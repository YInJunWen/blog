var person = { age: 13 };
var a = [12, 13, 14];

a.find(function(item) {
  return item > this.age;
}, person); // 14

a.findIndex(function(item) {
  return item > this.age;
}, person); // 2

