/* eslint-disable import/prefer-default-export */
export const mapStateToProps = state => {
  const list = state["CList"].list;
  return { list };
};

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
