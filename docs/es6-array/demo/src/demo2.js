var a = [1, 2, 3];
var b = [4, 5, 6];
var c = [...a, ...b, 7];
var d = [...a];

console.log(c); // [ 1, 2, 3, 4, 5, 6, 7 ]
console.log(d); // [ 1, 2, 3]

a[0] = 9;

console.log(c); // [ 1, 2, 3, 4, 5, 6, 7 ]
console.log(d); // [ 1, 2, 3]
