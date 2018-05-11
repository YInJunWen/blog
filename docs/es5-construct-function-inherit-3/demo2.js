function Animal() {
  this.species = '动物';
}
Animal.prototype.age = 12;
Animal.prototype.test = function() {
  return 'test';
};
function Cat(name, color) {
  this.name = name;
  this.color = color;
}
Cat.prototype = new Animal();
Cat.constructor = Cat;
let a = new Cat('大毛', '黄色');

console.log(a.species);
console.log(a.name);
console.log(a.color);
console.log(a.age);
console.log(a.test());
