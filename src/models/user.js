import Taro from "@tarojs/taro";

export default {
  namespace: "user",

  mixins: ["common"],

  state: {
    systemInfo: {}
  },

  async setup({ put }) {
    // 新增初始化获取用户手机系统相关信息，存储到redux全局状态中
    console.log("systemInfo");
    Taro.getSystemInfo().then(systemInfo => {
      put({ type: "update", payload: { systemInfo } });
    });
  }
};
