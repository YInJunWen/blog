var person = { name: 'zhangsan' };
var a = Array.from(
  [1, 2, 3],
  function(item, index) {
    this[index] = item;
    return item * item;
  },
  person
);

console.log(a); // [ 1, 4, 9 ]
console.log(person); // { '0': 1, '1': 2, '2': 3, name: 'zhangsan' }
