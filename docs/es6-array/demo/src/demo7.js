var a = [1, 2, 3];
for (let x of a.keys()) {
  console.log(x); // 0,1,2
}

for (let x of a.entries()) {
  console.log(x); // [0, 1], [1, 2], [2, 3]
}

// for (let x of a.values()) {
//   console.log(x); //.values() is not a function
// }

console.log(Object.keys(a));
