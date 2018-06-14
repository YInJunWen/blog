let a;

console.log("map：");
a = [, , ,].map(() => {
  console.log(1);
  c++;
  return 1;
});
console.log(a);

console.log("filter：");
a = [, , ,].filter(() => {
  console.log(1);
  return true;
});
console.log(a);

console.log("every：");
a = [, , ,].every(() => {
  console.log(1);
  return true;
});
console.log(a);

console.log("some：");
a = [, , ,].some(() => {
  console.log(1);
  return true;
});
console.log(a);

console.log("forEach：");
[, , ,].forEach(() => {
  console.log(1);
});

console.log("for..of...：");
for (let i of [, , ,]) {
  console.log(1);
}

let b;
b = [, , ,].toString();
console.log(b);

b = [, , ,].join(",");
console.log(b);
