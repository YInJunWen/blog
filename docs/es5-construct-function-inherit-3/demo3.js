function Animal() {
  this.species = '动物';
}
Animal.prototype.age = 12;
Animal.prototype.test = function() {
  return 'test';
};
Animal.prototype.other = {
  width: 10,
  height: 20,
};
function Cat(name, color) {
  this.name = name;
  this.color = color;
}

function extend(Child, Parent) {
  var F = function() {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

extend(Cat, Animal);
var a = new Cat('大毛', '黄色');

a.other.width = 30;
console.log(Animal.prototype.other); // {width: 30, height: 20}
