class Orange extends Array {
  constructor(props) {
    super(props);
    this[Symbol.isConcatSpreadable] = false;
  }
}
var b = new Orange();

b[0] = 'a';
b[1] = 'b';
b[2] = 'c';

console.log([].concat(b)); // [ Orange [ 'a', 'b', 'c', [Symbol(Symbol.isConcatSpreadable)]: false ] ]

class Pears extends Array {
  constructor(props) {
    super(props);
  }
  get [Symbol.isConcatSpreadable]() {
    return false;
  }
}
var c = new Pears();

c[0] = 'a';
c[1] = 'b';
c[2] = 'c';

console.log([].concat(c)); // [ Pears [ 'a', 'b', 'c' ] ]
