import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { getSystemInfo, baseurl, ArrayToString } from "../../utils/functions";
import action from "../../utils/action";
import "./ImgPage.scss";

import NavBarImg from "../../components/NavBarImg/NavBarImg";

@connect(state => {
  for (let i = 0; i < state["CList"].list.length; i++) {
    if (state["CList"].list[i].lid == state["CList"].viewlid)
      return {
        card: state["CList"].list[i]
      };
  }
})
export default class ImgPage extends Component {
  constructor() {
    super(...arguments);
    this.state = { current: 0 };
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  static getDerivedStateFromProps(props, state) {
    return {
      current: 0
    };
  }
  changeCard = (lid, adict) => {
    // {lid [key] [value]}
    this.props.dispatch(action("CList/change", { lid: lid, dict: adict }));
  };
  handleChangetoggle(pagenum, hav) {
    var payload = {};
    const set = this.props.card.printSize + "" + this.props.card.printOri;
    if (hav) {
      payload[set + "printPages"] = this.props.card[set + "printPages"].filter(
        (value, index, arr) => {
          return value != pagenum;
        }
      );
      this.changeCard(this.props.card.lid, payload);
    } else {
      payload[set + "printPages"] = this.props.card[set + "printPages"].concat(
        pagenum
      );
      this.changeCard(this.props.card.lid, payload);
    }
  }
  render() {
    if (this.props.card == undefined) return <View></View>;
    var card = this.props.card;
    const set = card.printSize + "" + card.printOri,
      imgurl = card.ispdf ? card.lid : card.lid + "_" + set,
      done = card[set] == undefined ? false : true;
    console.log("setimgurldone", set, imgurl, done);

    var FullprintPages = [];
    for (let i = 1; i <= card[set + "_"]; i++) FullprintPages.push(i);
    const swiperheight =
      getSystemInfo().screenWidth *
        (card.printOri == 1 ? 1 / 1.414 : 1.414).toFixed(2) +
      3 +
      "px";

    const imgSwiperItem = FullprintPages.map((index, i) => {
      const hav = card[set + "printPages"].indexOf(index) == -1 ? false : true;
      return (
        <SwiperItem key={card.lid}>
          <View className='imgs'>
            <Image
              src={`https://${baseurl}/img/page/${imgurl}/${index}`}
              style={{ width: "100%" }}
              mode='widthFix'
            ></Image>
            <View className={hav ? "blue_border" : "cancel_blue_border"}></View>
            <View
              className={hav ? "checkicon_checked" : "uncheckicon"}
              hoverClass={
                hav ? "checkicon_checked_onhover" : "uncheckicon_onhover"
              }
              onClick={() => {
                this.handleChangetoggle(index, hav);
              }}
              hoverStartTime={10}
              hoverStayTime={50}
            ></View>
          </View>
        </SwiperItem>
      );
    });
    const choosed_pages =
      "已选页码: " +
      (card[set + "printPages"] == undefined
        ? ""
        : ArrayToString(card[set + "printPages"]));
    return (
      <View className='index'>
        <NavBarImg fn={card.name} choosed_pages={choosed_pages}></NavBarImg>
        {done ? (
          <Swiper
            indicatorDots
            indicatorColor='#bfbfbf'
            className='swiper'
            style={{ height: swiperheight }}
            current={this.state.current}
          >
            {imgSwiperItem}
          </Swiper>
        ) : (
          <View className='loading'>
            <View className='rotate'>&#xe6a1;</View>
            正在加载
          </View>
        )}
      </View>
    );
  }
}
