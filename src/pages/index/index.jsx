import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import UploadAndCards from "../../components/UploadAndCards/UploadAndCards";
import NavBar from "../../components/navbar/index";
import SetDrawer from "../../components/SetDrawer/SetDrawer";
import BottomBtn from "../../components/BottomBtn/BottomBtn";

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className='index'>
        <NavBar></NavBar>
        <SetDrawer></SetDrawer>
        <UploadAndCards></UploadAndCards>
        <BottomBtn></BottomBtn>
      </View>
    );
  }
}
