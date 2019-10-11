import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./Ripple.scss";

export default class Ripple extends Component {
  initializeState = () => {
    return {
      spanStyles: {},
      count: 0
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
    const query = Taro.createSelectorQuery();
    const dsb = query.select("。rippleContainer").boundingClientRect(rect => {
      console.log(rect);
    });
    console.log(dsb);

    const rippleContainer = e.currentTarget;
    const size = rippleContainer.offsetWidth;
    // const pos = rippleContainer.getBoundingClientRect();
    // const x = e.pageX - pos.x - size / 2;
    // const y = e.pageY - pos.y - size / 2;
    const ClientX = e.touches[0].clientX,
      ClientY = e.touches[0].clientY,
      pageX = e.touches[0].pageX,
      pageY = e.touches[0].pageY;
    const x = pageX;
    const y = pageY;
    const spanStyles = {
      top: 0 + "px",
      left: 0 + "px",
      height: 20 + "px",
      width: 20 + "px"
    };
    console.log(e);
    const count = this.state.count + 1;
    this.setState({
      spanStyles: { ...this.state.spanStyles, [count]: spanStyles },
      count: count
    });
  };

  renderRippleSpan = () => {
    console.log("sv");
    const { showRipple = false, spanStyles = {} } = this.state;
    const spanArray = Object.keys(spanStyles);
    if (spanArray && spanArray.length > 0) {
      console.log(spanArray);
      return spanArray.map((key, index) => {
        return (
          <View
            className='sb'
            key={"spanCount_" + index}
            style={{ ...spanStyles[key] }}
          ></View>
        );
      });
    }
  };

  render() {
    const { children = null, classes = "", onClickHandler = null } = this.props;
    console.log(this.props);
    return (
      <View
        ref='targetElement'
        className='ripple btn'
        id='dsb'
        // style={{ height: "100px", width: "100px", backgroundColor: "red" }}
        // onClick={onClickHandler}
      >
        {children}
        <View
          className='rippleContainer'
          onTouchStart={res => {
            this.showRipple(res);
          }}
          onTouchEnd={this.callCleanUp(this.cleanUp, 1000)}
        >
          {this.renderRippleSpan()}
        </View>
      </View>
    );
  }
}
