var a = { name: 'zhangsan' };
var b = [1, 2, 3].fill(a, 0, 1);
console.log(b);
a.name = 'lisi';
console.log(b);
