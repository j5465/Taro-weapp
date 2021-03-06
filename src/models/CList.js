import Taro from "@tarojs/taro";

export default {
  namespace: "CList",
  state: {
    list: [],

    unabledcardlist: [],

    setlid: "",
    triggered: false,
    chooselist: [],

    viewlid: "",

    pplist: [],
    ppchoosed: -1, //index
    chooseing: false,

    sendToprint: false
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    add(state, { payload }) {
      return { ...state, ...{ list: payload.list.concat(state.list) } };
      // return { list: payload.list.concat(state.list), setlid: state.setlid };
    },
    change(state, { payload }) {
      var newlist = state.list;
      for (var i = 0; i < newlist.length; i++)
        if (newlist[i].lid === payload.lid)
          newlist[i] = { ...newlist[i], ...payload.dict };
      return { ...state, ...{ list: newlist.concat([]) } };
    },

    idInSet(state, { payload }) {
      return { ...state, ...{ setlid: payload.lid } };
      // return { list: state.list.concat([]), setlid: payload.lid };
    },

    removeset(state, { payload }) {
      return { ...state, ...{ list: state.list.concat([]), setlid: "" } };
    },
    //bottom button choose all
    chooseall(state, { payload }) {
      var newlist = [];
      //if not choosed all
      if (state.list.length != state.chooselist.length) {
        let noticed = false;

        for (let i = 0; i < state.list.length; i++) {
          if (
            state.list[i].unabled != true &&
            state.list[i].progressStatus == "success"
          )
            newlist.push(state.list[i].lid);
          else {
            if (noticed == false)
              Taro.atMessage({
                message: "当前有文件不可被选中",
                type: "warning"
              });
            noticed = true;
          }
          // if (state.unabledcardlist.indexOf(state.list[i].lid) == -1)
        }
      }
      return { ...state, ...{ chooselist: newlist } };
    },
    //remove selected card
    removecard(state, { payload }) {
      var newlist = state.list;
      for (let i = 0; i < state.chooselist.length; i++)
        for (let j = 0; j < state.list.length; j++)
          if (state.chooselist[i] == state.list[j].lid) newlist.splice(j, 1);
      return {
        ...state,
        ...{ list: newlist, chooselist: [], triggered: false }
      };
    },
    //add true/false  ppname
    updatepp(state, { payload }) {
      var newpplist = state.pplist,
        ppchoosed = state.ppchoosed,
        ind = newpplist.indexOf(payload.name);
      if (ind == -1) {
        if (payload.bool_add) newpplist.push(payload.name);
      } else {
        if (payload.bool_add == false) {
          newpplist.splice(ind, 1);
          if (ind == ppchoosed) ppchoosed = -1;
        }
      }
      return { ...state, ...{ pplist: newpplist, ppchoosed: ppchoosed } };
    },
    update_unabledcardlist(state, { payload }) {
      var newun = state.unabledcardlist;
      const popi = newun.indexOf(payload.lid);
      if (popi != -1) newun.pop(popi);
      return { ...state, ...{ unabledcardlist: newun } };
    }
  }
};
