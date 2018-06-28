var a = [1, 2, 3];
a[Symbol.isConcatSpreadable] = false;

var c = [].concat(a);
console.log(c);

var b = {
  length: 2,
  0: 'a',
  1: 'b',
  [Symbol.isConcatSpreadable]: true,
};

var d = [].concat(b);
console.log(d);
