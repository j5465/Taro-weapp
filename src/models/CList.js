import Taro from "@tarojs/taro";
import action from "../utils/action";

export default {
  namespace: "CList",
  state: {
    list: [
      {
        "11_7": true,
        deadLine: 1573348291971,
        lid: "hH9vrylAg9",
        name: "sbsmall.docx",
        printCopies: 1,
        printOri: 1,
        printPages: [2, 3, 4, 5, 6, 7],
        printSize: 1,
        progressName: "读取成功",
        progressPercent: 100,
        progressStatus: "success",
        totalpages: 7
      },
      {
        lid: "asdfsdf",
        name: "60-赵雪松-《美国自由的故事》-终稿.docx",

        deadLine: 1572009556533,

        // filePagesCount

        progressName: "正在上传",
        progressStatus: "progress", //   progress,error,success warning
        progressPercent: 75,

        printSize: 0,
        printOri: 0,
        printPages: [1, 2, 5, 3, 4, 9, 10, 15, 16, 17],

        printCopies: 3,
        totalpages: 40,
        inSetting: true
      }
    ],
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
