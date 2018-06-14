"use strict";

var foo = {
  0: "zhangsan",
  1: "lisi",
  2: "wangwu",
  length: 3
};
// [].slice.call(foo).map(item => {
//   console.log(item);
// });

[].split.call(foo).map(function (item) {
  console.log(item);
});