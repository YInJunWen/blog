function Animal() {
  this.species = '动物';
}
Animal.prototype.age = 12;
Animal.prototype.test = function() {
  console.log('test');
};

function Cat(name, color) {
  Animal.apply(this, arguments);
  this.name = name;
  this.color = color;
}
let a = new Cat('大毛', '黄色');

a.species; // 动物
a.name; // 大毛
a.color; // 黄色
a.age; // undefined
a.test; // a.test is not function
