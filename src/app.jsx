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
    pages: ["pages/index/index", "pages/ImgPage/ImgPage"],
    window: {
      navigationBarTextStyle: "black",
      navigationStyle: "custom"
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}
  render() {
    return (
      <Provider store={store}>
        <Index />;
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
