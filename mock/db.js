// db.js
var Mock = require("mockjs");

module.exports = {
  getComment: Mock.mock({
    error: 0,
    message: "success",
    "result|4": [
      {
        author: "@name",
        comment: "@cparagraph",
        date: "@datetime"
      }
    ]
  }),
  addComment: Mock.mock({
    error: 0,
    message: "success",
    result: []
  })
};
