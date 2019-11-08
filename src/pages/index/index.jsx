import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
// import { AtAvatar } from "taro-ui";
import UploadAndCards from "../../components/UploadAndCards/UploadAndCards";
import NavBar from "../../components/navbar/index";
import Modal from "../../components/Modal/Modal";
import SetDrawer from "../../components/SetDrawer/SetDrawer";
import BottomBtn from "../../components/BottomBtn/BottomBtn";

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
    console.log(this.props.pplist);
    //   <AtAvatar
    //     className='my-avatar'
    //     size='small'
    //     circle
    //     openData={{ type: "userAvatarUrl" }}
    //   ></AtAvatar>
    return (
      <View className='index'>
        <NavBar></NavBar>
        <Modal></Modal>
        <SetDrawer>555</SetDrawer>

        <UploadAndCards></UploadAndCards>
        <BottomBtn></BottomBtn>
      </View>
    );
  }
}
