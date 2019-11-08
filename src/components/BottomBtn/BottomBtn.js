import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { mapStateToProps } from "../../utils/functions";
import action from "../../utils/action";
import "./BottomBtn.scss";

@connect(state => {
  return {
    triggered: state["CList"].triggered,
    chooselist: state["CList"].chooselist,
    dcount: state["CList"].list.length
  };
})
export default class BottomBtn extends Component {
  constructor() {
    super(...arguments);
  }
  static getDerivedStateFromProps(props, state) {
    return {
      triggered: props.triggered,
      num: props.chooselist.length,
      dcount: props.dcount
    };
  }
  test() {
    console.log("test");
  }
  render() {
    console.log("triggered");
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
                onClick={() => {
                  console.log("fuckclose");
                  this.props.dispatch(
                    action("CList/save", { triggered: false })
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
            onClick={() => {
              this.props.dispatch(action("CList/removecard", {}));
            }}
          >
            &#xe661;
          </View>

          <View className='print'></View>
        </View>
      </View>
    );
  }
}
