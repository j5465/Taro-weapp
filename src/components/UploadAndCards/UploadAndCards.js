import { AtProgress, AtMessage, AtButton, AtTag } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  mapStateToProps,
  randomString,
  getExtname
} from "../../utils/functions";
import action from "../../utils/action";
import "./UploadAndCards.scss";
import pdf from "../../assets/images/pdf.png";
import doc from "../../assets/images/doc.png";
import rtf from "../../assets/images/rtf.png";

@connect(mapStateToProps)
export default class UploadAndCards extends Component {
  constructor() {
    super(...arguments);
    // this.tapUploadView.bind(this);
    this.state = {
      list: []
    };
  }
  config: Config = {
    navigationBarTitleText: "Upload And Cards"
  };
  addCards = alist => {
    //{list:[ , , ]}
    this.props.dispatch(action("CList/add", { list: alist }));
  };
  changeCard = (lid, adict) => {
    // {lid [key] [value]}
    this.props.dispatch(action("CList/change", { lid: lid, dict: adict }));
  };
  handleMessage(msg, type) {
    Taro.atMessage({ message: msg, type: type });
  }
  static getDerivedStateFromProps(props, state) {
    console.log("fuck", props.list);
    return { list: props.list };
    return null;
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("should update?", nextProps);
  //   return true;
  // }
  tapUploadView() {
    new Promise((resolve, reject) => {
      wx.chooseMessageFile({
        count: 10,
        type: "file",
        extension: [".doc", ".docx", ".pdf"],
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
            this.changeCard(data.lid, {
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
        extname = getExtname(name),
        progressName = card.progressName,
        progressStatus = card.progressStatus,
        deadLine = card.deadLine,
        progressPercent = card.progressPercent;
      var progressColor, filePng;
      if (extname === "pdf") filePng = pdf;
      else if (extname === "docx" || extname === "doc") filePng = doc;
      else filePng = rtf;
      if (progressStatus === "progress") progressColor = "#1890ff";
      else if (progressStatus === "error") progressColor = "#f5222d";
      else progressColor = "#52c41a";
      console.log(
        "in render Upload and cards: ",
        name,
        extname,
        progressStatus
      );
      return (
        <View className='Card' key={card.lid}>
          <View className='Card-1'>
            <Image className='file_type' src={filePng}></Image>
            <View className='Card-1-r'>
              <View className='at-row at-row__justify--between at-row__align--center name_row'>
                <View className='at-col  name'>{name}</View>
                <View className='at-col at-col-1 at-col--auto valid_time'>
                  有效期至 3-29 17:20
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
                        // percent={progressPercent}
                        // status={progressStatus}
                        // color={progressColor}
                        percent={75}
                        status='progress'
                      ></AtProgress>
                    </View>
                    <View className='at-col at-col-1 at-col--auto'>
                      <AtButton circle size='small' type='primary'>
                        按钮
                      </AtButton>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className='Card-2'>
              <View className='Divider div-transparent' />
              <View className='at-row at-row__align--center'>
                <View className='my-tag'>标签</View>
              </View>
            </View>
          </View>
        </View>
      );
    });

    return (
      <View>
        <AtMessage />
        <View
          className='upload-top'
          hoverClass='upload-top-blue'
          onClick={this.tapUploadView.bind(this)}
        >
          <View className='icon'></View>
          选择文件上传
        </View>
        {CardsList}
      </View>
    );
  }
}
