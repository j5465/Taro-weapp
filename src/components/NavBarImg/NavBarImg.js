import _isFunction from "lodash/isFunction";
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getSystemInfo } from "../../utils/functions";
import "./NavBarImg.scss";

let globalSystemInfo = getSystemInfo();

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
      navBarExtendHeight,
      ios,
      leftWidth
    };
  }
  handleChooseClick() {
    this.props.dispatch(
      action("CList/save", { chooseing: !this.props.chooseing })
    );
  }
  render() {
    const {
      navigationbarinnerStyle,
      navBarHeight,
      navBarExtendHeight,
      ios,
      leftWidth
    } = this.state.configStyle;
    const { background, extClass, fn, choosed_pages } = this.props;

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
          className={`at-row at-row__align--start  at-row--nowrap lxy-nav-bar__inner ${
            ios ? "ios" : "android"
          }`}
          style={navigationbarinnerStyle}
        >
          <View className='back' onClick={Taro.navigateBack}>
            &#xe601;
          </View>
          <View className='name_pages'>
            <View className='fn'>{fn}</View>
            <View className='choosed_pages'>{choosed_pages}</View>
          </View>
        </View>
      </View>
    );
  }
}

export default AtComponent;
