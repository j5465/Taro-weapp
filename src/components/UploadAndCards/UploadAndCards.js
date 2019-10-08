import { AtProgress, AtMessage } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
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
    return { list: props.list };
    return null;
  }
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
            cookie: {
              lid: item.lid,
              name: item.name
            }
          },
          filePath: item.path,
          name: "file"
          // complete(rs) {
          //   console.log("complete rs: ", rs);
          // }
        });

        uploadTask.progress(rs => {
          // console.log("progress percent: ", rs.progress);
          var newList = this.state.list.map(card => {
            if (card.lid === item.lid) card["progressPercent"] = rs.progress;
            return card;
          });
          this.setState({ list: newList });
        });
        uploadTask.then(Thenres => {
          console.log("uploadTask then res: ", Thenres);

          if (Thenres.statusCode === 500) {
            var data = JSON.parse(Thenres.data);
            this.handleMessage("文件最大支持10M", "error");
            this.changeCard(data.lid, {
              progressName: "上传失败",
              progressStatus: "error",
              progressPercent: 100
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
    // console.log("render Upload and cards: ", this.state.list);
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
      else if (progressStatus === "error") progressColor = "#52c41a";
      else progressColor = "#f5222d";
      return (
        <View className='Card' key={card.lid}>
          <Image
            className='file_type'
            // src={extent_Name === "docx" ? doc : extent_Name}
            src={filePng}
            mode='aspectFit'
          ></Image>
          <View className='main_content'>
            <View className='name_row'>
              <View className='name'>{name}</View>
              <View className='valid_time'>{deadLine}</View>
            </View>
            <View className='progress_row'>
              <View className='at-row '>
                <View className='status'>{progressName}</View>
                <View className='at-col at-col-7 at-col--auto'>
                  <AtProgress
                    className='my-progress'
                    percent={progressPercent}
                    status='progress'
                    color={progressColor}
                    // strokeWidth={12}
                  />
                </View>
                <View className='at-col at-col-1 at-col--auto'>
                  <View className='iconfont set_icon'>&#xe68d;</View>
                </View>
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
