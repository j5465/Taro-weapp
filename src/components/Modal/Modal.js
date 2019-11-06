import Taro, { Component } from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import classNames from "classnames";
// import { mapStateToProps } from "../../utils/functions";
import action from "../../utils/action";
import { getSystemInfo } from "../../utils/functions";
import "./Modal.scss";

@connect(state => {
  return state["modal_store"];
})
export default class Modal extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  handleClickOverlay = () => {
    this.props.dispatch(action("modal_store/save", { isOpen: false }));
  };
  render() {
    const {
      isOpen,
      clickx = 0,
      clicky = 0,
      url,
      pagecount,
      now_index
    } = this.props;
    const rootClass = classNames("modal", {
      "modal--active": isOpen
    });
    console.log("modal props", this.props);
    var numlist = [];
    for (let i = 1; i <= pagecount; i++) numlist.push(i);

    const imgSwiperItem = numlist.map(v => {
      console.log(v);
      return (
        <SwiperItem>
          <Image
            src={`${url}${v.toString()}`}
            style='width: 100%'
            mode='widthFix'
          ></Image>
        </SwiperItem>
      );
    });
    var rootstyle, containerheight;
    if (isOpen != true) rootstyle = "pointer-events: none;";
    containerheight =
      getSystemInfo().screenWidth *
        0.9 *
        (this.props.zong ? 1.414 : 1 / 1.414).toFixed(2) +
      "px";
    console.log("containerheight" + containerheight);
    return (
      <View className={rootClass} style={rootstyle}>
        <View
          className='modal__overlay'
          // onClick={isOpen ? this.handleClickOverlay : () => {}}
          onClick={this.handleClickOverlay}
        ></View>
        <View id='container' className='modal__content'>
          <Swiper
            style={`height:${containerheight}`}
            indicatorDots
            indicatorActiveColor='#69c0ff'
            current={now_index - 1}
          >
            {imgSwiperItem}
          </Swiper>
        </View>
      </View>
    );
  }
}
