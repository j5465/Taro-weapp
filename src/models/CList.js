import Taro from "@tarojs/taro";
import action from "../utils/action";

export default {
  namespace: "CList",
  state: {
    list: [],
    setlid: ""
  },

  effects: {
    *add({ payload }, { call, put }) {
      var newList = payload.concat(state.list);
      console.log(newList);
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    add(state, { payload }) {
      return { list: payload.list.concat(state.list), setlid: state.setlid };
    },
    change(state, { payload }) {
      var newlist = state.list;
      for (var i = 0; i < newlist.length; i++)
        if (newlist[i].lid === payload.lid)
          newlist[i] = { ...newlist[i], ...payload.dict };
      return { list: newlist.concat([]), setlid: state.setlid };
    },
    idInSet(state, { payload }) {
      // return { ...state, ...{ setlid: payload.lid } };
      return { list: state.list.concat([]), setlid: payload.lid };
    },
    removeset(state, { payload }) {
      return { list: state.list.concat([]), setlid: "" };
    }
  }
};
