import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, OpenData } from "@tarojs/components";
import "./index.scss";

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

  render() {
    return (
      <View className='index'>
        <Text>申请获取你的公开信息（昵称、头像等）</Text>
        <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo}>
          微信授权
        </Button>
        <OpenData className='avatar' type='userAvatarUrl'></OpenData>
        <OpenData className='name' type='userNickName' lang='zh_CN'></OpenData>
      </View>
    );
  }
}
