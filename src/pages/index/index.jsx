import { AtToast, AtButton, AtAvatar, AtIcon, AtProgress } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, OpenData, ScrollView } from "@tarojs/components";
import "./index.scss";
// import Card from "../../components/Card/Card";
// import Mupload from "../../components/upload-area/Mupload";
import UploadAndCards from "../../components/UploadAndCards/UploadAndCards";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };
  getUserInfo = userInfo => {
    console.log("userinfo", userInfo);
    if (userInfo.detail.userInfo) {
      //同意
    } else {
      //拒绝,保持当前页面，直到同意
    }
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  onScrollToUpper(e) {
    console.log("ToUpper");
  }

  onScroll(e) {
    console.log(e.detail);
  }
  render() {
    const scrollStyle = {
      height: "500px"
    };
    const scrollTop = 0;
    const Threshold = 20;
    const vStyleA = {
      height: "350px",
      "background-color": "rgb(26, 173, 25)"
    };
    const vStyleB = {
      height: "350px",
      "background-color": "rgb(39,130,215)"
    };
    const vStyleC = {
      height: "350px",
      "background-color": "rgb(241,241,241)",
      color: "#333"
    };
    return (
      <View className='index'>
        <View className='container'>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
          <View className='paper'></View>
        </View>
        <View className='keyframes'>a</View>
        <UploadAndCards></UploadAndCards>
        {/* <Mupload></Mupload>
        <view className='Cards_container'>
          <Card></Card>
        </view>
      */}
        <AtAvatar
          className='my-avatar'
          size='large'
          circle
          openData={{ type: "userAvatarUrl" }}
        ></AtAvatar>
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
          onScroll={this.onScroll}
        >
          <View style={vStyleA}>A</View>
          <View style={vStyleB}>B</View>
          <View style={vStyleC}>C</View>
        </ScrollView>
      </View>
    );
  }
}
