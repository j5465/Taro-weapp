var list = [{ 1: 2, 3: 4 }, { 5: 6, 7: 8 }];
list[0] = { ...list[0], ...{ 1: 3, 5: 7 } };
console.log(list);
function test(number) {
  console.log("number", number);
  return new Promise((resolve, reject) => {
    var timeOut = Math.random() * 2;
    console.log("set timeout to: " + timeOut + " seconds.");
    // console.log(sb());
    setTimeout(function() {
      if (timeOut < 1) {
        console.log("call resolve()...");
        resolve("200 OK");
      } else {
        console.log("call reject()...");
        reject("timeout in " + timeOut + " seconds.");
      }
    }, timeOut * 1000);
  });
}
// let sb = new Promise(test)

async function main() {
  let res = await test(1)
    .then(function(cnm) {
      console.log("cnm", cnm);
    })
    .catch(function(reason) {
      console.log("失败：" + reason);
    });
  let res2 = await test(2)
    .then(function(cnm) {
      console.log("cnm", cnm);
    })
    .catch(function(reason) {
      console.log("失败：" + reason);
    });
  console.log("fuck done");
}
// main();

// test(
//   function resolve(res) {
//     console.log(res);
//   },
//   function reject(res) {
//     console.log(res);
//   }
// );
