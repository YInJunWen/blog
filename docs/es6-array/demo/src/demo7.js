require("babel-polyfill");

var a = [1, 2, 3];

console.log("Object.keys(a): ", Object.keys(a));
console.log("Object.values(a): ", Object.values(a));
console.log("Object.entries(a): ", Object.entries(a));

console.log("[].key()");
for (let x of a.keys()) {
  console.log(x); // 0,1,2
}

console.log("[].values()");
for (let x of a.values()) {
  console.log(x); //.values() is not a function
}

console.log("[].entries()");
for (let x of a.entries()) {
  console.log(x); // [0, 1], [1, 2], [2, 3]
}
