import { AtButton, AtDrawer, AtInputNumber } from "taro-ui";
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
  handleChangetoggle(pagenum, hav) {
    if (hav)
      this.changeCard(this.state.card.lid, {
        printPages: this.state.card.printPages.filter((value, index, arr) => {
          return value != pagenum;
        })
      });
    else
      this.changeCard(this.state.card.lid, {
        printPages: this.state.card.printPages.concat(pagenum)
      });
  }
  handleChangeCopies(value) {
    this.changeCard(this.state.card.lid, { printCopies: value });
  }
  render() {
    const { navBarHeight, navBarExtendHeight } = getSystemInfo(),
      card = this.state.card;

    var pagesString, choosefontsize, set, done, id_set;
    if (card != undefined && "printPages" in card == true) {
      console.log(card);
      (set = card.printSize + "" + card.printOri),
        (done = card[set] == undefined ? false : true),
        (id_set = card.lid + "_" + card.printSize + "" + card.printOri);

      var FullprintPages = [];
      for (let i = 1; i <= card[set + "_"]; i++) FullprintPages.push(i);
      console.log(set, done);
      if (done)
        var imglist = FullprintPages.map((index, i) => {
          const hav = card.printPages.indexOf(index) == -1 ? false : true;
          console.log(index, hav);
          return (
            <View className='page_img' key={id_set + index}>
              <Image
                src={`https://${baseurl}/img/page/${id_set}/${index}`}
                style='width: 100%'
                mode='widthFix'
              ></Image>
              {hav ? (
                <View
                  className='blue_border'
                  onClick={() => {
                    console.log("sb!!!");
                  }}
                ></View>
              ) : (
                <View className='cancel_blue_border'></View>
              )}

              {hav ? (
                <View
                  className='checkicon_checked'
                  hoverClass='checkicon_checked_onhover'
                  onClick={() => {
                    this.handleChangetoggle(index, hav);
                  }}
                ></View>
              ) : (
                <View
                  className='uncheckicon'
                  hoverClass='uncheckicon_onhover'
                  // hoverClass="checkicon_checked"
                  onClick={() => {
                    this.handleChangetoggle(index, hav);
                  }}
                ></View>
              )}
            </View>
          );
        });
      else var imglist;
      console.log("imglist:", typeof imglist);
      pagesString = "打印页码: " + ArrayToString(card.printPages);
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
              value={card.printSize}
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
              // onClick={this.handleChange.bind(this)}
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
        {done == true && imglist}
      </AtDrawer>
    );
  }
}

SetDrawer.defaultProps = {
  card: undefined,
  show: false
};
