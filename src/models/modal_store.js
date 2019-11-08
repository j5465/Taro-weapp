import Taro from "@tarojs/taro";
import action from "../utils/action";

export default {
  namespace: "modal_store",
  state: {
    isOpen: false,
    clickx: 0,
    clicky: 0,
    url: "https://sbxsbbb.xyz/img/page/pjaNftQKxu_10/",
    pagecount: 5,
    now_index: 1,
    zong: true
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
