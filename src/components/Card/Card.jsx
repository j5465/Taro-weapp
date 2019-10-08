import { AtProgress } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { mapStateToProps, getExtname } from "../../utils/functions";
import action from "../../utils/action";
import pdf from "../../assets/images/pdf.png";
import doc from "../../assets/images/doc.png";
import rtf from "../../assets/images/rtf.png";
import "./Card.scss";

@connect(mapStateToProps)
export default class Card extends Component {
  render() {
    console.log("fuck", this.props);

    const MyCardsList = this.props.list.map((card, i) => {
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

    return <View>{MyCardsList}</View>;
  }
}
