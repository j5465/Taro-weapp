import { AtButton, AtDrawer, AtIcon, AtInputNumber } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  mapStateToProps,
  ArrayToString,
  getSystemInfo,
  baseurl
} from "../../utils/functions";
import action from "../../utils/action";
import MRadio from "../MRadio/MRadio";
import "./SetDrawer.scss";

@connect(mapStateToProps)
export default class SetDrawer extends Component {
  constructor() {
    super(...arguments);
  }
  changeCard = (lid, adict) => {
    // {lid [key] [value]}
    this.props.dispatch(action("CList/change", { lid: lid, dict: adict }));
  };

  static getDerivedStateFromProps(props, state) {
    console.log("Drawer get props", props, state);

    for (let i = 0; i < props.list.length; i++)
      if (props.list[i].lid === props.setlid) {
        console.log(props.list[i]);
        return { card: props.list[i], show: true };
      }
    return { show: false, card: undefined };
  }
  onClose = () => {
    this.props.dispatch(action("CList/removeset", {}));
    console.log("Drawer on Close");
  };
  handleChangeSize(value) {
    this.changeCard(this.state.card.lid, { printSize: value });
  }
  handleChangeOri(value) {
    this.changeCard(this.state.card.lid, { printOri: value });
  }
  render() {
    const { navBarHeight, navBarExtendHeight } = getSystemInfo();

    var pagesString, choosefontsize;
    if (this.state.card != undefined) {
      pagesString = "打印页码:" + ArrayToString(this.state.card.printPages);
      if (pagesString.length <= 16) choosefontsize = "16px";
      else if (pagesString.length == 17) choosefontsize = "15px";
      else if (pagesString.length == 18) choosefontsize = "14px";
      else if (pagesString.length <= 20) choosefontsize = "12px";
      else choosefontsize = "11px";
    }
    console.log(pagesString);
    return (
      <AtDrawer show={this.state.show} mask onClose={this.onClose.bind(this)}>
        <View
          className='fill_statusBarHeight'
          style={`height:${navBarHeight + navBarExtendHeight}px;`}
        ></View>

        {this.state.show && (
          <View>
            <MRadio
              options={[
                { label: "黑白", value: "0" },
                { label: "彩色", value: "1", disabled: true }
              ]}
              value='0'
            />
            <MRadio
              options={[
                {
                  label: "单面打印",
                  value: "0"
                },
                {
                  label: "双面打印",
                  value: "1",
                  disabled: true
                }
              ]}
              value='0'
            />
            <MRadio
              options={[
                {
                  label: "A3",
                  value: 0
                },
                {
                  label: "A4",
                  value: 1
                }
              ]}
              value={this.state.card.printSize}
              onClick={this.handleChangeSize.bind(this)}
            />
            <MRadio
              options={[
                {
                  label: "纵向",
                  value: 0
                },
                {
                  label: "横向",
                  value: 1
                }
              ]}
              value={this.state.card.printOri}
              onClick={this.handleChangeOri.bind(this)}
            ></MRadio>
            <MRadio
              options={[
                {
                  label: pagesString,
                  value: 0
                }
              ]}
              value={0}
              choosefontsize={choosefontsize}
              loading
              // onClick={this.handleChange.bind(this)}
            ></MRadio>
          </View>
        )}

        <AtInputNumber min={0} max={10} step={1} value={5} size={3} />

        {/* <AtIcon prefixClass='checkicon' value="" ></AtIcon> */}
        <View className='page_img'>
          <View className='checkicon' hoverClass='checkicon_onhover'></View>

          <Image
            src={`http://${baseurl}/img/page/Zl3S9jSA7s_01/3`}
            style='width: 100%'
            mode='widthFix'
            lazyLoad
          ></Image>

          <View
            className='light_blue_border'
            onClick={() => {
              console.log("sb!!!");
            }}
          ></View>
        </View>
      </AtDrawer>
    );
  }
}

SetDrawer.defaultProps = {
  card: undefined,
  show: false
};
