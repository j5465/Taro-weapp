// import Taro from "@tarojs/taro";

export default {
  namespace: "CList",
  state: {
    list: [],
    setlid: "",
    triggered: true,
    chooselist: [],
    pplist: []
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
      // return { list: state.list.concat([]), setlid: "" };
    },
    chooseall(state, { payload }) {
      var newlist = [];
      if (state.list.length != state.chooselist.length) {
        for (let i = 0; i < state.list.length; i++)
          newlist.push(state.list[i].lid);
      }
      return { ...state, ...{ chooselist: newlist } };
    },
    removecard(state, { payload }) {
      var newlist = state.list;
      for (let i = 0; i < state.chooselist.length; i++)
        for (let j = 0; j < state.list.length; j++)
          if (state.chooselist[i] == state.list[j].lid) newlist.splice(j, 1);
      return { ...state, ...{ list: newlist, chooselist: [] } };
    },
    updatepp(state, { payload }) {
      //add true/false  ppname
      var newpplist = state.pplist,
        ind = newpplist.indexOf(payload.name);
      if (ind == -1) {
        if (payload.bool_add) newpplist.push(payload.name);
      } else {
        if (payload.bool_add == false) newpplist.splice(ind, 1);
      }
      return { ...state, ...{ pplist: newpplist } };
    }
  }
};
