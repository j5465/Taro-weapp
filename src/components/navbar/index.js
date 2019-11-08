import _isFunction from "lodash/isFunction";
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { getSystemInfo } from "../../utils/functions";
import action from "../../utils/action";
import "./index.scss";

let globalSystemInfo = getSystemInfo();
@connect(state => {
  return { pplist: state["CList"].pplist };
})
class AtComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configStyle: this.setStyle(globalSystemInfo)
    };
  }
  static options = {
    multipleSlots: true,
    addGlobalClass: true
  };
  componentDidShow() {
    if (globalSystemInfo.ios) {
      globalSystemInfo = getSystemInfo();
      this.setState({
        configStyle: this.setStyle(globalSystemInfo)
      });
    }
  }

  handleSearchClick() {
    if (_isFunction(this.props.onSearch)) {
      this.props.onSearch();
    }
  }
  static defaultProps = {
    background: "#ffffff", //导航栏背景
    color: "#000000"
  };

  state = {};

  setStyle(systemInfo) {
    const {
      statusBarHeight,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      windowWidth
    } = systemInfo;
    const { color, background } = this.props;
    let rightDistance = windowWidth - capsulePosition.right; //胶囊按钮右侧到屏幕右侧的边距
    let leftWidth = windowWidth - capsulePosition.left; //胶囊按钮左侧到屏幕右侧的边距

    let navigationbarinnerStyle = [
      `color:${color}`,
      `background:${background}`,
      `height:${navBarHeight + navBarExtendHeight}px`,
      `padding-top:${statusBarHeight}px`,
      `padding-right:${leftWidth}px`,
      `padding-bottom:${navBarExtendHeight}px`
    ].join(";");

    return {
      navigationbarinnerStyle,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    };
  }

  render() {
    const {
      navigationbarinnerStyle,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance
    } = this.state.configStyle;
    const { background, extClass } = this.props;

    return (
      <View
        className={`lxy-nav-bar ${ios ? "ios" : "android"} ${extClass}`}
        style={`background: ${background};height:${navBarHeight +
          navBarExtendHeight}px;`}
      >
        <View
          className={`lxy-nav-bar__placeholder ${ios ? "ios" : "android"}`}
          style={`padding-top: ${navBarHeight + navBarExtendHeight}px;`}
        />
        <View
          className={`at-row at-row__align--start at-row__justify--between at-row--nowrap lxy-nav-bar__inner ${
            ios ? "ios" : "android"
          }`}
          style={navigationbarinnerStyle}
        >
          <View className='hiavatar'>
            <View className='hitext'>xss打印</View>
          </View>
          {/* <View> */}
          <View className='at-row  choosepp'>
            <View className='pp'>选择skdfnksdnf打印点</View>
            <View className='downarrow'>&#xe603;</View>
          </View>
          {/* </View> */}
        </View>
      </View>
    );
  }
}

export default AtComponent;
