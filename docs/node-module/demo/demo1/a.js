const B = require("./b");
console.log(B);

const pad = str => {
  return str.padEnd("20", " ");
};
var name = "zhangsan";
console.log(this);

this.name = "lisi";
console.log(this);

const { add } = B;
const foo = function() {
  console.log(pad("name: "), name);
  console.log(pad("this.name: "), this.name);
};

const egg = () => {
  console.log(pad("name: "), name);
  console.log(pad("this.name: "), this.name);
};
foo();
egg();
