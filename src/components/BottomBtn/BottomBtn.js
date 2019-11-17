import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import action from "../../utils/action";
import "./BottomBtn.scss";

@connect(state => {
  return {
    triggered: state["CList"].triggered,
    chooselist: state["CList"].chooselist,
    dcount: state["CList"].list.length,
    ppchoosed: state["CList"].ppchoosed
  };
})
export default class BottomBtn extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      triggered: false,
      num: 0,
      dcount: 0,
      ppchoosed: -1
    };
  }
  static getDerivedStateFromProps(props, state) {
    return {
      triggered: props.triggered,
      num: props.chooselist.length,
      dcount: props.dcount,
      ppchoosed: props.ppchoosed,
      chooselist: props.chooselist
    };
  }
  handleClickPrint() {
    if (!this.state.num > 0) return;
    if (this.state.ppchoosed >= 0) {
      this.props.dispatch(
        action("CList/save", {
          sendToprint: true,
          chooselist: [],
          unabledcardlist: this.state.chooselist
        })
      );
      console.log("start print");
    } else this.props.dispatch(action("CList/save", { chooseing: true }));
  }
  render() {
    console.log("triggered", this.state.num);
    const chooseall_opacity = this.state.dcount == 0 ? 0.5 : 1;

    return (
      <View>
        <View
          className={this.state.triggered ? "triggered" : "trigger"}
          // onClick={this.test()}

          onClick={() => {
            console.log("fuck");
            this.props.dispatch(action("CList/save", { triggered: true }));
          }}
        >
          &#xe7ba;
          <View className='whitebg'></View>
        </View>
        <View
          className={
            "at-row  at-row__align--end at-row__justify--around at-row--nowrap " +
            (this.state.triggered ? "toolbar" : "hidetoolbar")
          }
        >
          <View>
            <View className='at-row  at-row__align--center'>
              <View
                className='close'
                hoverClass='greyhover'
                hoverStayTime={200}
                hoverStartTime={10}
                onClick={() => {
                  console.log("fuckclose");
                  this.props.dispatch(
                    action("CList/save", { triggered: false, chooselist: [] })
                  );
                }}
              >
                &#xe62d;
              </View>
              <View className='choosenum'>{this.state.num}</View>
            </View>
          </View>
          <View style={{ opacity: chooseall_opacity }}>
            <View className='at-row  at-row__align--center'>
              <View
                className={
                  "chooseall" +
                  (this.state.dcount != 0 && this.state.dcount == this.state.num
                    ? "ed"
                    : "")
                }
                hoverStayTime={200}
                hoverStartTime={10}
                onClick={
                  this.state.dcount == 0
                    ? () => {}
                    : () => {
                        this.props.dispatch(action("CList/chooseall", {}));
                      }
                }
              ></View>
              <View className='chooseallt'>全选</View>
            </View>
          </View>
          <View
            className='delete'
            hoverClass='greyhover'
            hoverStayTime={200}
            hoverStartTime={10}
            onClick={() => {
              this.props.dispatch(action("CList/removecard", {}));
            }}
          >
            &#xe661;
          </View>

          <View
            className='print'
            // hoverClass={this.state.num > 0 ? "greyhover" : ""}
            hoverClass='greyhover'
            style={this.state.num > 0 ? {} : { opacity: 0.5 }}
            hoverStayTime={200}
            hoverStartTime={10}
            onClick={this.handleClickPrint}
          ></View>
        </View>
      </View>
    );
  }
}
