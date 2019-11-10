import { AtProgress, AtMessage, AtButton, AtTag } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import classNames from "classnames";
import {
  mapStateToProps,
  randomString,
  getExtname,
  DeadLineToTime,
  StatusToColor,
  ArrayToString,
  baseurl
} from "../../utils/functions";
import action from "../../utils/action";
import "./UploadAndCards.scss";
import socketio from "weapp.socket.io";
import Ripple from "../Ripple/Ripple";
// import request from "../../utils/request";

var socket = socketio(`wss://${baseurl}/`);
@connect(state => {
  return {
    list: state["CList"].list,
    triggered: state["CList"].triggered,
    chooselist: state["CList"].chooselist
  };
})
export default class UploadAndCards extends Component {
  constructor() {
    super(...arguments);
    // this.tapUploadView.bind(this);
    this.state = {
      list: [],
      triggered: false,
      chooselist: []
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
      nlist = props.list;
    for (let i = 0; i < nlist.length; i++) {
      if (
        nlist[i].printSize != undefined &&
        nlist[i].printSize + "" + nlist[i].printOri in nlist[i] == false
      )
        socket.emit("genimg", {
          id: nlist[i].lid,
          set: nlist[i].printSize + "" + nlist[i].printOri,
          extname: getExtname(nlist[i].name)
        });
    }
    console.log("fuck upload and cards derived state from props");
    return {
      list: props.list,
      triggered: props.triggered,
      chooselist: props.chooselist
    };
  }
  componentDidMount() {
    socket.on("greetings", data => {
      console.log("received news: ", data);
      socket.emit("add a weapp", "i am weapp");
    });
    socket.on("change state", data => {
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
          deadLine: ""
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
            this.handleMessage("错误:" + Thenres.data.msg);
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
    if (this.state.triggered) {
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
    } else {
      //navigate
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
        Pages = card.printPages,
        Copies = card.printCopies,
        totalpages = card[Size + "" + Ori + "_"],
        progressColor = StatusToColor(progressStatus),
        hav = this.state.chooselist.indexOf(card.lid) == -1 ? false : true,
        CardClass = classNames("Card", { Cardonhover: this.state[card.lid] });

      console.log("cardlid", card, CardClass);

      return (
        <View
          className={CardClass}
          style={
            hav
              ? {
                  "background-color": "#e8e8e8",
                  border: "solid 6rpx #262626"
                }
              : ""
          }
          id={card.lid}
          key={card.lid}
          onLongPress={() => {
            if (Size + "" + Ori + "_" in card) this.handleLongPress(card.lid);
          }}
          onTouchStart={() => {
            console.log(
              "on touch start",
              card[Size + "" + Ori + "_"],
              Size + "" + Ori + "_",
              Size + "" + Ori + "_" in card
            );

            if (Size + "" + Ori + "_" in card) {
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
                      <AtButton
                        circle
                        size='small'
                        type='primary'
                        onClick={() => {
                          if (Size + "" + Ori + "_" in card)
                            this.idInSet(card.lid);
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
      <View style={{}}>
        {/* <View
          id='abc'
          onTouchStart={e => {
            console.log(e.currentTarget);

            const query = Taro.createSelectorQuery().in(this.$scope);
            query.select("#abc").boundingClientRect();
            query.exec(rect => {
              console.log(rect);
            });
          }}
        >
          ABC
        </View> */}
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
        <View
          style='width:100px;height:100px;background-color:#8c8c8c;z-index:10'
          onClick={() => {
            console.log("open");
            this.props.dispatch(action("modal_store/save", { isOpen: true }));
          }}
        ></View>
      </View>
    );
  }
}
