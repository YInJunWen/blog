let foo = {
  0: 'zhangsan',
  1: 'lisi',
  2: 'wangwu',
  name: 'other',
  length: 3,
};
console.log([].slice.call(foo));
console.log(Array.from(foo));
