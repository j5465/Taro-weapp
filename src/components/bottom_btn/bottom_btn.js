import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./Bottom_btn.scss";

export default class Bottom_btn extends Component {
  render() {
    return (
      <View>
        <View className='trigger'>
          <View className='ion-plus'></View>
        </View>
        <View className='toolbar'>
          <View className='close'>X</View>
          <View className='pseudo-circle'>
            <View className='dialog'></View>
          </View>
        </View>
      </View>
    );
  }
}
