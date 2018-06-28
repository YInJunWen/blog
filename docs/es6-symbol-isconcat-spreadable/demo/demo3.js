class Egg extends Array {
  constructor(props) {
    super(props);
  }
}
var a = new Egg();

console.log(Object.prototype.toString.call(a)); // [object Array]

a[0] = 'a';
a[1] = 'b';
a[2] = 'c';

console.log([].concat(a));

