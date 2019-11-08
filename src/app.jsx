import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import Index from "./pages/index";
import "./assets/antd-font/iconfont.css";
import "./assets/checkfont/iconfont.css";
import action from "./utils/action";
import dva from "./utils/dva";
import models from "./models";
import "./app.scss";

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError(e, dispatch) {
    dispatch(action("sys/error", e));
  }
});

const store = dvaApp.getStore();
class App extends Component {
  config = {
    pages: ["pages/index/index"],
    window: {
      // backgroundTextStyle: "light",
      // navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black",
      // navigationStyle: "default",
      // navigationBarBackgroundColor: "#ffffff",
      navigationStyle: "custom"
      // enablePullDownRefresh: true
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />;
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
