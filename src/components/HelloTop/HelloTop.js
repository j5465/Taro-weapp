import { AtAvatar } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./HelloTop.scss";

export default class UploadAndCards extends Component {
  render() {
    return (
      <View className='container'>
        {/* <AtAvatar
          className='my-avatar'
          size='small'
          circle
          openData={{ type: "userAvatarUrl" }}
        ></AtAvatar> */}
      </View>
    );
  }
}
