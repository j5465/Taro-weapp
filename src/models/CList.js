import Taro from "@tarojs/taro";
import action from "../utils/action";

export default {
  namespace: "CList",
  state: {
    list: [
      {
        lid: "asdfsdf",
        name: "60-赵雪松-《美国自由的故事》-终稿.docx",

        deadLine: "skdfnskdfnf",

        // filePagesCount

        progressName: "正在上传",
        progressStatus: "progress", //   progress,error,success
        progressPercent: 75

        // printOrientation
        // printSide
        // printColor
        // printCopies
        // printPages

        // inSetting
      }
    ]
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
      return { list: newlist.concat([]) };
    }
  }
};
