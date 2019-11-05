import { AtToast, AtButton, AtAvatar, AtIcon, AtProgress } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, OpenData } from "@tarojs/components";
import "./index.scss";

import UploadAndCards from "../../components/UploadAndCards/UploadAndCards";
import NavBar from "../../components/navbar/index";
import HelloTop from "../../components/HelloTop/HelloTop";
import SetDrawer from "../../components/SetDrawer/SetDrawer";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };
  onPullDownRefresh() {
    console.log("on pull down refresh");
    Taro.stopPullDownRefresh();
  }
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
        <NavBar
          renderLeft={
            <View style='padding-left:10px '>
              <AtAvatar
                className='my-avatar'
                size='small'
                circle
                openData={{ type: "userAvatarUrl" }}
              ></AtAvatar>
            </View>
          }
          renderCenter={<View style='font-size:44rpx'>打印工具</View>}
          // renderRight={          }
        ></NavBar>
        <SetDrawer>555</SetDrawer>

        <UploadAndCards></UploadAndCards>
      </View>
    );
  }
}
