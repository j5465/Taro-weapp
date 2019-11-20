import { AtDrawer, AtInputNumber } from "taro-ui";
import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  ArrayToString,
  getSystemInfo,
  getExtname
} from "../../utils/functions";
import action from "../../utils/action";
import MRadio from "../MRadio/MRadio";
import "./SetDrawer.scss";

@connect(state => {
  return { list: state["CList"].list, setlid: state["CList"].setlid };
})
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
        const extname = getExtname(props.list[i].name);
        var ispdf = false;
        if (extname != "doc" && extname != "docx" && extname != "rtf")
          ispdf = true;

        return { card: props.list[i], show: true, ispdf: ispdf };
      }
    return { show: false, card: undefined, ispdf: false };
  }
  onClose = () => {
    this.props.dispatch(action("CList/removeset", {}));
    console.log("Drawer on Close");
  };
  handleChangeSize(value) {
    if (this.state.ispdf == false)
      this.changeCard(this.state.card.lid, { printSize: value });
  }
  handleChangeOri(value) {
    if (this.state.ispdf == false)
      this.changeCard(this.state.card.lid, { printOri: value });
  }

  handleChangeCopies(value) {
    this.changeCard(this.state.card.lid, { printCopies: parseInt(value) });
  }
  render() {
    const { navBarHeight, navBarExtendHeight } = getSystemInfo(),
      card = this.state.card;

    var pagesString = "打印页码: ",
      choosefontsize,
      set,
      done,
      id_set,
      imgurl;

    if (
      card != undefined &&
      card.printSize + "" + card.printOri + "printPages" in card == true
    ) {
      console.log("setdrawercard:", card);
      (set = card.printSize + "" + card.printOri),
        (done = card[set] == undefined ? false : true),
        (id_set = card.lid + "_" + set),
        (imgurl = card.ispdf ? card.lid : id_set);

      pagesString = pagesString + ArrayToString(card[set + "printPages"]);

      if (pagesString.length <= 16) choosefontsize = "16px";
      else if (pagesString.length == 17) choosefontsize = "15px";
      else if (pagesString.length == 18) choosefontsize = "14px";
      else if (pagesString.length <= 20) choosefontsize = "12px";
      else choosefontsize = "11px";
    }
    console.log("pagesstring", pagesString);
    return (
      <AtDrawer
        right
        show={this.state.show}
        mask
        onClose={this.onClose.bind(this)}
      >
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
                  value: 0,
                  disabled:
                    this.state.ispdf && card.printSize != 0 ? true : false
                },
                {
                  label: "A4",
                  value: 1,
                  disabled:
                    this.state.ispdf && card.printSize != 1 ? true : false
                }
              ]}
              value={card.printSize}
              onClick={this.handleChangeSize.bind(this)}
            />
            <MRadio
              options={[
                {
                  label: "纵向",
                  value: 0,
                  disabled:
                    this.state.ispdf && card.printOri != 0 ? true : false
                },
                {
                  label: "横向",
                  value: 1,
                  disabled:
                    this.state.ispdf && card.printOri != 1 ? true : false
                }
              ]}
              value={card.printOri}
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
              loading={done != true}
              onClick={
                done
                  ? () => {
                      this.props.dispatch(
                        action("CList/save", { viewlid: card.lid })
                      );
                      Taro.navigateTo({ url: "/pages/ImgPage/ImgPage" });
                    }
                  : () => {}
              }
            ></MRadio>
          </View>
        )}
        <View
          className='at-row at-row__align--center at-row__align-content--between'
          style='padding:10px 7px 10px 16px'
        >
          <View className='at-col' style='color:#333'>
            份数:
          </View>
          <View className='at-col'>
            <AtInputNumber
              min={1}
              max={100}
              step={1}
              value={card == undefined ? 0 : this.state.card.printCopies}
              onChange={this.handleChangeCopies.bind(this)}
              size='23'
            />
          </View>
        </View>
      </AtDrawer>
    );
  }
}

SetDrawer.defaultProps = {
  card: undefined,
  show: false
};
