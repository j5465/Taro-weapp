// import { AtButton } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { mapStateToProps, randomString } from "../../utils/functions";
import action from "../../utils/action";
import "./Mupload.scss";

@connect(mapStateToProps)
export default class Mupload extends Component {
  addCards = payload => {
    //{list:[ , , ]}
    this.props.dispatch(action("CList/add", payload));
  };
  changeCard = payload => {
    // {lid [key] [value]}
    this.props.dispatch(action("CList/change", payload));
  };
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
          progressName: "正在上传",
          progressStatus: "progress",
          // progressPercent: "1",
          deadLine: ""
        });
        // console.log(res.tempFiles[i]);
      }
      console.log("add Cards", payload);
      this.addCards({ list: payload });
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
          name: "file",
          complete(rs) {
            console.log("complete rs: ", rs);
          }
        });
        uploadTask.progress(rs => {
          console.log("progress percent: ", rs.progress);

          this.changeCard({
            lid: item.lid,
            key: ["progressPercent"],
            value: [rs.progress]
          });
        });
      });
    });
  }
  render() {
    console.log("Mupload");
    return (
      <View
        className='upload-top'
        hoverClass='upload-top-blue'
        onClick={this.tapUploadView.bind(this)}
      >
        <View className='icon'></View>
        选择文件上传
      </View>
    );
  }
}
