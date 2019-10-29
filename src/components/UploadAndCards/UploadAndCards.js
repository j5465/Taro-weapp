import { AtProgress, AtMessage, AtButton, AtTag } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  mapStateToProps,
  randomString,
  getExtname,
  DeadLineToTime,
  StatusToColor,
  ArrayToString
} from "../../utils/functions";
import action from "../../utils/action";
import "./UploadAndCards.scss";
import socketio from "weapp.socket.io";
import Ripple from "../Ripple/Ripple";
import request from "../../utils/request";

var socket = socketio("ws://127.0.0.1:3000");
@connect(mapStateToProps)
export default class UploadAndCards extends Component {
  constructor() {
    super(...arguments);
    // this.tapUploadView.bind(this);
    this.state = {
      list: []
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
    console.log("fuck", props);
    return { list: props.list };
    return null;
  }
  componentDidMount() {
    socket.on("greetings", data => {
      console.log("received news: ", data);
    });
    socket.on("change state", data => {
      this.changeCard(data.lid, data);
    });
  }

  tapUploadView() {
    new Promise((resolve, reject) => {
      wx.chooseMessageFile({
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
          url: "http://localhost:3000/uploadfile",
          header: {
            "content-type": "multipart/form-data",
            lid: item.lid,
            name: item.name
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
          if (Thenres.statusCode === 200) {
            socket.emit("fileinfo", {
              id: data.lid,
              extname: getExtname(item.name)
            });

            this.changeCard(data.lid, {
              deadLine: data.deadLine,
              progressName: "上传成功",
              progressPercent: 100,
              progressStatus: "success"
            });
          } else if (Thenres.statusCode === 500) {
            this.handleMessage("文件最大支持10M", "error");
            console.log(data);
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

  render() {
    const CardsList = this.state.list.map((card, i) => {
      const name = card.name,
        progressName = card.progressName,
        progressStatus = card.progressStatus,
        progressPercent = card.progressPercent,
        Ori = card.printOri,
        Size = card.printSize,
        Pages = card.printPages,
        Copies = card.printCopies,
        totalpages = card.totalpages,
        progressColor = StatusToColor(progressStatus);

      console.log("cards");
      return (
        <View className='Card' key={card.lid}>
          <View className='Card-1'>
            <Image
              className='file_type'
              src={"http://localhost:3000/img/icon/" + getExtname(name)}
            ></Image>
            <View className='Card-1-r'>
              <View className='at-row at-row__justify--between at-row__align--center name_row'>
                <View className='at-col  name'>{name}</View>
                <View className='at-col at-col-1 at-col--auto valid_time'>
                  {DeadLineToTime(card.deadLine)}
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
                    <View className='at-col at-col-1 at-col--auto'>
                      <AtButton
                        circle
                        size='small'
                        type='primary'
                        onClick={() => {
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
      <View>
        <View
          id='abc'
          // style={{ height: "100px", width: "100px", border: "3px #000 solid" }}
          // style={{ border: "3px #000 solid" }}
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
        </View>
        <AtMessage />
        <View
          className='upload-top'
          hoverClass='upload-top-blue'
          onClick={this.tapUploadView.bind(this)}
        >
          <View className='icon'></View>
          单击选择文件打印
        </View>
        {CardsList}
      </View>
    );
  }
}
