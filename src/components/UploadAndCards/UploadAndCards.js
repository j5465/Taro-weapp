import { AtProgress, AtMessage, AtButton } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import classNames from "classnames";
import socketio from "weapp.socket.io";
import {
  randomString,
  getExtname,
  DeadLineToTime,
  StatusToColor,
  ArrayToString,
  baseurl
} from "../../utils/functions";
import action from "../../utils/action";
import "./UploadAndCards.scss";

var socket = socketio(`wss://${baseurl}/`);
@connect(state => {
  return {
    list: state["CList"].list,
    triggered: state["CList"].triggered,
    chooselist: state["CList"].chooselist,
    sendToprint: state["CList"].sendToprint,
    pplist: state["CList"].pplist,
    ppchoosed: state["CList"].ppchoosed,
    unabledcardlist: state["CList"].unabledcardlist
  };
})
export default class UploadAndCards extends Component {
  constructor() {
    super(...arguments);
    // this.tapUploadView.bind(this);
    this.state = {
      list: [],
      triggered: false,
      chooselist: [],
      glist: []
    };
  }
  // static getDerivedStateFromProps(props, state) {  }
  addCards = alist => {
    //{list:[ , , ]}
    this.props.dispatch(action("CList/add", { list: alist }));
  };
  changeCard = (lid, adict) => {
    // {lid [key] [value]}
    this.props.dispatch(action("CList/change", { lid: lid, dict: adict }));
  };
  idInSet = lid => {
    this.props.dispatch(action("CList/idInSet", { lid: lid }));
  };
  handleMessage(msg, type) {
    Taro.atMessage({ message: msg, type: type });
  }
  static getDerivedStateFromProps(props, state) {
    var ylist = state.list,
      nlist = props.list,
      printmessage = [],
      glist = state.glist;
    for (let i = 0; i < nlist.length; i++) {
      if (
        nlist[i].printSize != undefined &&
        nlist[i].printSize + "" + nlist[i].printOri in nlist[i] == false &&
        glist.indexOf(
          nlist[i].lid + nlist[i].printSize + "" + nlist[i].printOri
        ) == -1
      ) {
        glist.push(nlist[i].lid + nlist[i].printSize + "" + nlist[i].printOri);
        socket.emit("genimg", {
          id: nlist[i].lid,
          set: nlist[i].printSize + "" + nlist[i].printOri,
          extname: getExtname(nlist[i].name)
        });
      }

      if (
        props.sendToprint == true &&
        state.chooselist.indexOf(nlist[i].lid) != -1
      ) {
        printmessage.push({
          printSize: nlist[i].printSize,
          printOri: nlist[i].printOri,
          printPages:
            nlist[i][
              nlist[i].printSize + "" + nlist[i].printOri + "printPages"
            ],
          printCopies: nlist[i].printCopies,
          isPdf: getExtname(nlist[i].name) == "pdf" ? true : false,
          id: nlist[i].lid,
          name: nlist[i].name
        });
      }
    }
    if (printmessage.length != 0) {
      console.log("sbsbsbsb", props.pplist, props.ppchoosed);

      props.dispatch(action("CList/save", { sendToprint: false }));
      socket.emit("sendToprint", {
        printmessage: printmessage,
        pp: props.pplist[props.ppchoosed]
      });
    }
    console.log("fuck upload and cards derived state from props");
    return {
      list: props.list,
      triggered: props.triggered,
      chooselist: props.chooselist,
      sendToprint: props.sendToprint,
      glist: glist
    };
  }
  componentDidMount() {
    // Taro.navigateTo({ url: "/pages/ImgPage/ImgPage" });
    socket.on("greetings", data => {
      console.log("received news: ", data);
      socket.emit("add a weapp", "i am weapp");
    });
    socket.on("change state", data => {
      if (data.progressName == "正在打印" && data.progressPercent == 100) {
        data.progressName = "打印完成";
        data.progressStatus = "success";

        for (let i = 0; i < this.state.list.length; i++) {
          if (this.state.list[i].lid == data.lid)
            this.handleMessage(
              `${this.state.list[i].name}打印完成，可再次打印或者从列表删除`,
              "success"
            );
        }

        var unabledcardlist = this.props.unabledcardlist;
        unabledcardlist.pop(unabledcardlist.indexOf(data.lid));
        console.log("update unabledcardlist", unabledcardlist);
        this.props.dispatch(
          action("CList/save", { unabledcardlist: unabledcardlist })
        );
      }
      this.changeCard(data.lid, data);
    });
    socket.on("a message", data => {
      console.log("a message " + data);
    });
    socket.on("pp message", data => {
      console.log(data);
      this.props.dispatch(action("CList/updatepp", data));
    });
  }

  tapUploadView() {
    new Promise((resolve, reject) => {
      if (this.state.triggered == true)
        this.props.dispatch(
          action("CList/save", { triggered: false, chooselist: [] })
        );
      Taro.chooseMessageFile({
        count: 10,
        type: "file",
        extension: [".doc", ".docx", ".pdf", ".rtf"],
        success(res) {
          resolve(res);
        },
        fail(reason) {
          reject(reason);
        }
      });
    }).then(res => {
      let payload = [];
      for (var i = 0; i < res.tempFiles.length; i++) {
        const lid = randomString();
        res.tempFiles[i].lid = lid;
        payload.push({
          lid: lid,
          name: res.tempFiles[i].name,
          progressPercent: 0,
          progressName: "正在上传",
          progressStatus: "progress",
          deadLine: "",
          ispdf: getExtname(res.tempFiles[i].name) == "pdf" ? true : false
        });
        // console.log(res.tempFiles[i]);
      }
      console.log("add Cards", payload);
      this.addCards(payload);
      // this.setState({ list: payload.concat(this.state.list) });
      // console.log("list", payload.concat(this.state.list));
      res.tempFiles.forEach(item => {
        const uploadTask = Taro.uploadFile({
          url: `https://${baseurl}/xsscfile`,
          header: {
            "content-type": "multipart/form-data",
            lid: item.lid
          },
          filePath: item.path,
          name: "file"
          // complete(rs) {
          //   console.log("complete rs: ", rs);
          // }
        });
        uploadTask.progress(rs => {
          console.log("progress percent: ", rs.progress);
          var newList = this.state.list.map(card => {
            if (card.lid === item.lid) card["progressPercent"] = rs.progress;
            return card;
          });
          // console.log("shit");
          // this.changeCard(item.lid, { progressPercent: rs.progress });
          this.setState({ list: newList });
          // console.log("shit");
        });
        uploadTask.then(Thenres => {
          console.log("uploadTask then res: ", Thenres);
          var data = JSON.parse(Thenres.data);
          console.log("sbname:");
          if (Thenres.statusCode === 200) {
            const extname = getExtname(item.name);
            console.log(extname);
            if (extname == "doc" || extname == "docx" || extname == "rtf")
              socket.emit("fileinfo", {
                id: data.lid,
                extname: getExtname(item.name)
              });
            else if (extname == "pdf") socket.emit("pdfinfo", { id: data.lid });

            this.changeCard(data.lid, {
              deadLine: data.deadLine,
              progressName: "上传成功",
              progressPercent: 100,
              progressStatus: "success"
            });
          } else {
            // error
            this.handleMessage("错误:" + Thenres.data.msg, "error");
            this.changeCard(data.lid, {
              progressName: "上传失败",
              progressStatus: "error"
            });
          }
        });
        uploadTask.catch(Erres => {
          this.handleMessage(Erres.data.msg, "error");
        });
      });
    });
  }
  handleLongPress(lid) {
    console.log(lid, this.state.chooselist);

    this.props.dispatch(
      action("CList/save", {
        triggered: true,
        chooselist: this.state.chooselist.concat(lid)
      })
    );
  }
  handleToggleCard(lid, hav) {
    var chooselist = this.state.chooselist;
    console.log("handleToggleCard", chooselist, lid, hav, this.state.triggered);
    if (this.state.triggered && this.props.unabledcardlist.indexOf(lid) == -1) {
      if (hav) {
        chooselist.splice(this.state.chooselist.indexOf(lid), 1);
        console.log(chooselist);
        this.props.dispatch(
          action("CList/save", {
            chooselist: chooselist,
            triggered: chooselist.length == 0 ? false : true
          })
        );
      } else
        this.props.dispatch(
          action("CList/save", {
            chooselist: this.state.chooselist.concat(lid)
          })
        );
    } else if (this.state.triggered == false) {
      this.props.dispatch(action("CList/save", { viewlid: lid }));
      Taro.navigateTo({ url: "/pages/ImgPage/ImgPage" });
    }
  }
  render() {
    console.log("cards", this.state.chooselist);
    const CardsList = this.state.list.map((card, i) => {
      const name = card.name,
        progressName = card.progressName,
        progressStatus = card.progressStatus,
        progressPercent = card.progressPercent,
        Ori = card.printOri,
        Size = card.printSize,
        Pages = card[Size + "" + Ori + "printPages"],
        Copies = card.printCopies,
        // totalpages = card[Size + "" + Ori + "_"],
        progressColor = StatusToColor(progressStatus),
        CardClass = classNames("Card", { Cardonhover: this.state[card.lid] }),
        hav = this.state.chooselist.indexOf(card.lid) == -1 ? false : true;
      var cardstyle = {};
      if (hav) {
        cardstyle = {
          "background-color": "#e8e8e8",
          border: "solid 6rpx #262626"
        };
      }

      console.log(
        "cardlid",
        card,
        this.props.unabledcardlist.indexOf(card.lid)
      );

      return (
        <View
          className={CardClass}
          style={cardstyle}
          id={card.lid}
          key={card.lid}
          onLongPress={() => {
            if (
              Size + "" + Ori + "_" in card &&
              this.props.unabledcardlist.indexOf(card.lid) == -1 &&
              Pages.length != 0
            )
              this.handleLongPress(card.lid);
            console.log(
              "ctmdkeyia",
              Size + "" + Ori + "_" in card,
              this.props.unabledcardlist.indexOf(card.lid)
            );
            if (Size + "" + Ori + "_" in card == false)
              this.handleMessage("请等待读取文件配置", "warning");
            else if (Pages.length == 0)
              this.handleMessage("打印页码范围不能为空", "error");
            else if (this.props.unabledcardlist.indexOf(card.lid) != -1)
              this.handleMessage("请等待打印结束", "warning");
          }}
          onTouchStart={() => {
            console.log(
              "on touch start",
              card[Size + "" + Ori + "_"],
              Size + "" + Ori + "_",
              Size + "" + Ori + "_" in card
            );

            if (this.props.unabledcardlist.indexOf(card.lid) == -1) {
              console.log("ctmctmIn ");
              const ns = {};
              ns[card.lid] = true;
              this.setState(ns);
            }
          }}
          onTouchEnd={() => {
            const ns = {};
            ns[card.lid] = false;
            this.setState(ns);
          }}
          onClick={() => {
            if (Size + "" + Ori + "_" in card)
              this.handleToggleCard(card.lid, hav);
            else if (this.state.triggered == false) {
              this.props.dispatch(action("CList/save", { viewlid: card.lid }));
              Taro.navigateTo({ url: "/pages/ImgPage/ImgPage" });
            } else if (this.state.triggered) {
              this.handleMessage("请等待读取配置完成", "warning");
            }
          }}
        >
          <View className='Card-1'>
            <Image
              className='file_type'
              src={`https://${baseurl}/img/icon/` + getExtname(name)}
            ></Image>
            <View className='Card-1-r'>
              <View className='at-row at-row__justify--between at-row__align--center name_row'>
                <View className='at-col  name'>{name}</View>
                <View className='at-col at-col-1 at-col--auto valid_time'>
                  {Pages != undefined ? DeadLineToTime(card.deadLine) : " "}
                </View>
              </View>
              <View className=' at-row at-row__justify--between at-row__align--center  progress_row'>
                <View className='at-col at-col-1 at-col--auto status'>
                  {progressName}
                </View>
                <View className='at-col '>
                  <View className='  at-row at-row__justify--between at-row__align--center'>
                    <View className='at-col   progress   '>
                      <AtProgress
                        // className='at-col '
                        percent={progressPercent}
                        status={
                          progressStatus == "warning"
                            ? "progress"
                            : progressStatus
                        }
                        color={progressColor}
                      ></AtProgress>
                    </View>
                    <View
                      className='at-col at-col-1 at-col--auto'
                      hoverStopPropagation
                    >
                      <View onClick={e => e.stopPropagation()}>
                        <AtButton
                          circle
                          size='small'
                          type='primary'
                          onClick={() => {
                            if (
                              this.props.unabledcardlist.indexOf(card.lid) == -1
                            )
                              this.idInSet(card.lid);
                            else this.handleMessage("请等待打印完成", "waring");
                            if (this.state.triggered == true)
                              this.props.dispatch(
                                action("CList/save", {
                                  triggered: false,
                                  chooselist: []
                                })
                              );
                          }}
                        >
                          打印设置
                        </AtButton>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {Pages != undefined && (
            <View className='Card-2'>
              <View className='Divider div-transparent' />
              <View className='at-row at-row__align--center at-row__justify--around at-row--nowrap'>
                <View className='mytag  '>黑白</View>
                <View className='mytag  '>单面</View>
                <View className='mytag  '>{Size == 0 ? "A3" : "A4"}</View>
                <View className='mytag   '>{Ori == 0 ? "纵向" : "横向"}</View>
                <View className='mytag  long'>
                  {"打印页码:" + ArrayToString(Pages)}
                </View>
                <View className='mytag '>{Copies + "份"}</View>
              </View>
            </View>
          )}
        </View>
      );
    });

    return (
      <View style={{ position: "relative" }}>
        <AtMessage />

        <View
          className='upload-top'
          hoverClass='upload-top-blue'
          onClick={this.tapUploadView.bind(this)}
          style='z-index:2'
        >
          <View className='icon'></View>
          单击选择文件打印
        </View>

        {CardsList}
      </View>
    );
  }
}
