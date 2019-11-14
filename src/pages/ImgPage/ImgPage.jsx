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
      return { card: state["CList"].list[i] };
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
    return { current: 0 };
  }
  changeCard = (lid, adict) => {
    // {lid [key] [value]}
    this.props.dispatch(action("CList/change", { lid: lid, dict: adict }));
  };
  handleChangetoggle(pagenum, hav) {
    if (hav)
      this.changeCard(this.props.card.lid, {
        printPages: this.props.card.printPages.filter((value, index, arr) => {
          return value != pagenum;
        })
      });
    else
      this.changeCard(this.props.card.lid, {
        printPages: this.props.card.printPages.concat(pagenum)
      });
  }
  render() {
    var card = this.props.card;
    const set = card.printSize + "" + card.printOri,
      imgurl = card.ispdf ? card.lid : card.lid + "_" + set;

    var FullprintPages = [];
    for (let i = 1; i <= card[set + "_"]; i++) FullprintPages.push(i);
    const swiperheight =
      getSystemInfo().screenWidth * (card.ori ? 1 / 1.414 : 1.414).toFixed(2) +
      3 +
      "px";
    const imgSwiperItem = FullprintPages.map((index, i) => {
      const hav = card.printPages.indexOf(index) == -1 ? false : true;
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
            ></View>
          </View>
        </SwiperItem>
      );
    });
    return (
      <View className='index'>
        <NavBarImg
          fn={card.name}
          choosed_pages={"已选页码: " + ArrayToString(card.printPages)}
        ></NavBarImg>

        <Swiper
          className='swiper'
          style={{ height: swiperheight }}
          current={this.state.current}
        >
          {imgSwiperItem}
        </Swiper>
      </View>
    );
  }
}
