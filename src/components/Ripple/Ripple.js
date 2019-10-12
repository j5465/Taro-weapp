import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./Ripple.scss";

export default class Ripple extends Component {
  initializeState = () => {
    return {
      spanStyles: {},
      count: 0,
      ok: false
    };
  };
  state = this.initializeState();
  cleanUp = () => {
    const initialState = this.initializeState();

    this.setState({ ...initialState });
  };
  /* Debounce Code to call the Ripple removing function */
  callCleanUp = (cleanup, delay) => {
    console.log("sb");
    return function() {
      clearTimeout(this.bounce);
      this.bounce = setTimeout(() => {
        cleanup();
      }, delay);
    };
  };

  showRipple = e => {
    var rectLRTB = [];
    const newP = new Promise((resolve, reject) => {
      const query = Taro.createSelectorQuery().in(this.$scope);
      query
        .select("#targetElement")
        .boundingClientRect(rect => {
          console.log("rect", rect);
          rectLRTB = [rect.left, rect.right, rect.top, rect.bottom];
          resolve();
        })
        .exec();
    });
    newP.then(() => {
      const size = Math.floor(
        Math.max(rectLRTB[3] - rectLRTB[2], rectLRTB[1] - rectLRTB[0])
      );
      const x = e.touches[0].clientX - rectLRTB[0] - size / 2;
      const y = e.touches[0].clientY - rectLRTB[2] - size / 2;
      const spanStyles = {
        top: y + "px",
        left: x + "px",
        height: size + "px",
        width: size + "px"
      };
      console.log(spanStyles, e);

      this.setState({
        spanStyles: { ...this.state.spanStyles, [1]: spanStyles },
        count: 1,
        ok: false
      });
    });
  };

  renderRippleSpan = () => {
    const { spanStyles = {} } = this.state;
    const spanArray = Object.keys(spanStyles);
    if (spanArray && spanArray.length > 0) {
      console.log(spanArray);
      return spanArray.map((key, index) => {
        return (
          <View
            className='bo'
            key={"spanCount_" + index}
            style={{ ...spanStyles[key] }}
          ></View>
        );
      });
    }
  };

  render() {
    const { children = null, classes = "", onClickHandler = null } = this.props;

    return (
      <View
        id='targetElement'
        className='ripple'
        // style={{ height: "100%", width: "100%" }}
        // onClick={onClickHandler}
      >
        {children}
        <View
          id='rippleContainerID'
          className='rippleContainer'
          onTouchStart={this.showRipple}
          onTouchEnd={this.callCleanUp(this.cleanUp, 200)}
        >
          {this.renderRippleSpan()}
        </View>
      </View>
    );
  }
}
