import Taro from "@tarojs/taro";
import _isFunction from "lodash/isFunction";

export const baseurl = "sbxsbbb.xyz";
export const getExtname = name => {
  return name.split(".").reverse()[0];
};
export const randomString = (
  length = 10,
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) => {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
export const DeadLineToTime = ddl => {
  var date = new Date(ddl);
  return (
    "有效期至 " +
    (date.getMonth() + 1).toString() +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
};
export const StatusToColor = progressStatus => {
  if (progressStatus === "progress") return "#1890ff";
  else if (progressStatus === "error") return "#f5222d";
  else if (progressStatus === "warning") return "#ffc107";
  else return "#52c41a";
  // else return "#28a745";
};

export function getSystemInfo() {
  if (Taro.globalSystemInfo && !Taro.globalSystemInfo.ios) {
    return Taro.globalSystemInfo;
  } else {
    // h5环境下忽略navbar
    if (!_isFunction(Taro.getSystemInfoSync)) {
      return null;
    }
    let systemInfo = Taro.getSystemInfoSync() || {
      model: "",
      system: ""
    };
    let ios = !!(systemInfo.system.toLowerCase().search("ios") + 1);
    let rect = Taro.getMenuButtonBoundingClientRect
      ? Taro.getMenuButtonBoundingClientRect()
      : null;
    Taro.getMenuButtonBoundingClientRect();

    let navBarHeight = "";
    if (!systemInfo.statusBarHeight) {
      systemInfo.statusBarHeight =
        systemInfo.screenHeight - systemInfo.windowHeight - 20;
      navBarHeight = (function() {
        let gap = rect.top - systemInfo.statusBarHeight;
        return 2 * gap + rect.height;
      })();

      systemInfo.statusBarHeight = 0;
      systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
    } else {
      navBarHeight = (function() {
        let gap = rect.top - systemInfo.statusBarHeight;
        return systemInfo.statusBarHeight + 2 * gap + rect.height;
      })();
      if (ios) {
        systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
      } else {
        systemInfo.navBarExtendHeight = 0;
      }
    }

    systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
    systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.ios = ios; //是否ios
    Taro.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
    //console.log('systemInfo', systemInfo);
    // console.log("function get system info");
    return systemInfo;
  }
}
// export const SystemInfo = getSystemInfo();
export const ArrayToString = arr => {
  var res = "",
    tmp = "";

  arr.sort((a, b) => {
    return a - b;
  });
  // console.log(arr);
  for (var i = 0, j; i < arr.length; i = j) {
    j = i + 1;
    while (j < arr.length && arr[j] - 1 === arr[j - 1]) {
      j++;
    }
    if (j - i > 1) tmp = arr[i].toString() + "-" + arr[j - 1].toString();
    else tmp = arr[i].toString();
    if (res === "") res = tmp;
    else res += "," + tmp;
  }
  console.log(res);
  return res;
};
