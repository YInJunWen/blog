require("babel-polyfill");
var obj = {
  b: "b",
  a: "a",
  5: 5,
  4: 4,
  [Symbol("b")]: "b",
  [Symbol("a")]: "a"
};
Object.keys(obj);
