import _isFunction from "lodash/isFunction";
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { getSystemInfo } from "../../utils/functions";
import classNames from "classnames";
import action from "../../utils/action";
import "./index.scss";

let globalSystemInfo = getSystemInfo();
@connect(state => {
  return {
    pplist: state["CList"].pplist,
    ppchoosed: state["CList"].ppchoosed,
    chooseing: state["CList"].chooseing
  };
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
    const { background, extClass } = this.props;
    const pp =
      this.props.ppchoosed < 0
        ? "选择打印点"
        : this.props.pplist[this.props.ppchoosed];

    const rootclass = classNames("rootclass", {
      "rootclass--active": this.props.chooseing
    });
    const rootStyle = {
      right: `10px`
    };
    const pplistview = this.props.pplist.map((name, index) => {
      return (
        <View
          className='app'
          onClick={() => {
            if (index != this.props.ppchoosed)
              this.props.dispatch(action("CList/save", { ppchoosed: index }));
            this.handleChooseClick();
          }}
        >
          {" "}
          {name}
        </View>
      );
    });
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
          <View
            className='at-row  choosepp '
            // hoverClass='choosepphover'
            onClick={this.handleChooseClick}
          >
            <View className='pp'>{pp}</View>
            <View className={this.props.chooseing ? "uparrow" : "downarrow"}>
              &#xe603;
            </View>
          </View>
          <View className={rootclass} style={rootStyle}>
            {this.props.pplist.length != 0 ? (
              pplistview
            ) : (
              <View
                className='app'
                onClick={() => {
                  this.handleChooseClick();
                  console.log("fuck");
                }}
              >
                无
              </View>
            )}
          </View>
          {this.props.chooseing && (
            <View className='modal' onClick={this.handleChooseClick}></View>
          )}
        </View>
      </View>
    );
  }
}

export default AtComponent;
