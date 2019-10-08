import Taro from "@tarojs/taro";
import action from "../utils/action";

export default {
  namespace: "CList",
  state: {
    // lid
    // name

    // deadLine

    // filePagesCount

    // progressName
    // progressStatus   progress,error,success
    // progressPercent

    // printOrientation
    // printSide
    // printColor
    // printCopies
    // printPages

    // inSetting

    list: []
  },

  effects: {
    // *add({ payload }, { call, put }) {
    //   var newList = payload.concat(state.list);
    //   console.log(newList);
    // }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    add(state, { payload }) {
      return { list: payload.list.concat(state.list) };
    },
    change(state, { payload }) {
      var newlist = state.list;
      for (var i = 0; i < newlist.length; i++)
        if (newlist[i].lid === payload.lid)
          newlist[i] = { ...newlist[i], ...payload.dict };
      newlist[0].progressPercent = 0;
      console.log(newlist);
      return { list: newlist };
    }
  }
};
