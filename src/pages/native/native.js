const { add } = require("../../utils/util");

Page({
  data: {
    text: "This is page data.",
    x: add(1, 2)
  },
  created(options) {
    console.log(options);
    // Do some initialize when page load.
  },
  onReady() {
    // console.log(this.selectComponent())
    // Do something when page ready.
    wx.chooseMessageFile({
      count: 10,
      type: "image",
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
      }
    });
  },
  // Event handler.
  viewTap() {
    this.setData(
      {
        text: "Set some data for updating view."
      },
      function() {
        // this is setData callback
      }
    );
  },

  handler(e) {
    console.log(e);
  },
  customData: {
    hi: "MINA"
  }
});
