<!-- Date: 2017-12-12 18:49:52 -->

# es5 函数继承-构造函数的继承(3)

比如，现在有一个"动物"对象的构造函数。

```js
function Animal() {
  this.species = '动物';
}
Animal.prototype.age = 12;
Animal.prototype.test = function() {
  return 'test';
};
```

还有一个"猫"对象的构造函数。

```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
}
```

怎样才能使"猫"继承"动物"呢？

## 一、 构造函数绑定

第一种方法也是最简单的方法，使用 call 或 apply 方法，将父对象的构造函数绑定在子对象上，即在子对象构造函数中加一行：

[代码](./demo1.js)

```js
function Cat(name, color) {
  Animal.apply(this, arguments);
  this.name = name;
  this.color = color;
}
let a = new Cat('大毛', '黄色');
```

但是这种方法只能继承 Animal 的自有属性，无法继承 Animal 的 prototype 属性(或方法)

```js
a.species; // 动物
a.name; // 大毛
a.color; // 黄色
a.age; // undefined
a.test(); // a.test is not function
```

## 二、 prototype 模式

第二种方法更常见，使用 prototype 属性。

如果"猫"的 prototype 对象，指向一个 Animal 的实例，那么所有"猫"的实例，就能继承 Animal 了。

```js
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
var cat1 = new Cat('大毛', '黄色');
alert(cat1.species); // 动物
```

代码的第一行，我们将 Cat 的 prototype 对象指向一个 Animal 的实例。

```js
Cat.prototype = new Animal();
```

它相当于完全删除了 prototype 对象原先的值，然后赋予一个新值。但是，第二行又是什么意思呢？

```js
Cat.prototype.constructor = Cat;
```

原来，任何一个 prototype 对象都有一个 constructor 属性，指向它的构造函数。如果没有"Cat.prototype = new Animal();"这一行，Cat.prototype.constructor 是指向 Cat 的；加了这一行以后，Cat.prototype.constructor 指向 Animal。

```js
alert(Cat.prototype.constructor == Animal); //true
```

更重要的是，每一个实例也有一个 constructor 属性，默认调用 prototype 对象的 constructor 属性。

```js
alert(cat1.constructor == Cat.prototype.constructor); // true
```

因此，在运行"Cat.prototype = new Animal();"这一行之后，cat1.constructor 也指向 Animal！

```js
alert(cat1.constructor == Animal); // true
```

这显然会导致继承链的紊乱（cat1 明明是用构造函数 Cat 生成的），因此我们必须手动纠正，将 Cat.prototype 对象的 constructor 值改为 Cat。这就是第二行的意思。

这是很重要的一点，编程时务必要遵守。下文都遵循这一点，即如果替换了 prototype 对象，

```js
o.prototype = {};
```

那么，下一步必然是为新的 prototype 对象加上 constructor 属性，并将这个属性指回原来的构造函数。

```js
o.prototype.constructor = o;
```

与第一种方法相比，这种方法已经既可以获取 Animal 的自有属性，也可以获取到 Animal 的 prototype 属性

[代码](./demo2.js)

```js
a.species; // 动物
a.name; // 大毛
a.color; // 黄色
a.age; // 12
a.test(); // test
```

## 三、 直接继承 prototype

第三种方法是对第二种方法的改进。由于 Animal 对象中，不变的属性都可以直接写入 Animal.prototype。所以，我们也可以让 Cat()跳过 Animal()，直接继承 Animal.prototype。

现在，我们先将 Animal 对象改写：

```js
function Animal() {}
Animal.prototype.species = '动物';
```

然后，将 Cat 的 prototype 对象，然后指向 Animal 的 prototype 对象，这样就完成了继承。

```js
Cat.prototype = Animal.prototype;
Cat.prototype.constructor = Cat;
var cat1 = new Cat('大毛', '黄色');
alert(cat1.species); // 动物
```

与前一种方法相比，这样做的优点是效率比较高（不用执行和建立 Animal 的实例了），比较省内存。缺点是 Cat.prototype 和 Animal.prototype 现在指向了同一个对象，那么任何对 Cat.prototype 的修改，都会反映到 Animal.prototype。

所以，上面这一段代码其实是有问题的。请看第二行

```js
Cat.prototype.constructor = Cat;
```

这一句实际上把 Animal.prototype 对象的 constructor 属性也改掉了！

```js
alert(Animal.prototype.constructor); // Cat
```

## 四、 利用空对象作为中介

由于"直接继承 prototype"存在上述的缺点，所以就有第四种方法，利用一个空对象作为中介。

```js
var F = function() {};
F.prototype = Animal.prototype;
Cat.prototype = new F();
Cat.prototype.constructor = Cat;
```

F 是空对象，所以几乎不占内存。这时，修改 Cat 的 prototype 对象，就不会影响到 Animal 的 prototype 对象。

```js
alert(Animal.prototype.constructor); // Animal
```

我们将上面的方法，封装成一个函数，便于使用。

```js
function extend(Child, Parent) {
  var F = function() {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}
```

使用的时候，方法如下

```js
extend(Cat, Animal);
var cat1 = new Cat('大毛', '黄色');
alert(cat1.species); // 动物
```

这个 extend 函数，就是 YUI 库如何实现继承的方法。另外，说明一点，函数体最后一行

```js
Child.uber = Parent.prototype;
```

意思是为子对象设一个 uber 属性，这个属性直接指向父对象的 prototype 属性。（uber 是一个德语词，意思是"向上"、"上一层"。）这等于在子对象上打开一条通道，可以直接调用父对象的方法。这一行放在这里，只是为了实现继承的完备性，纯属备用性质。

## 五、 拷贝继承

上面是采用 prototype 对象，实现继承。我们也可以换一种思路，纯粹采用"拷贝"方法实现继承。简单说，如果把父对象的所有属性和方法，拷贝进子对象，不也能够实现继承吗？这样我们就有了第五种方法。

首先，还是把 Animal 的所有不变属性，都放到它的 prototype 对象上。

```js
function Animal() {}
Animal.prototype.species = '动物';
```

然后，再写一个函数，实现属性拷贝的目的。

```js
function extend2(Child, Parent) {
  var p = Parent.prototype;
  var c = Child.prototype;
  for (var i in p) {
    c[i] = p[i];
  }
  c.uber = p;
}
```

这个函数的作用，就是将父对象的 prototype 对象中的属性，一一拷贝给 Child 对象的 prototype 对象。

使用的时候，这样写：

```js
extend2(Cat, Animal);
var cat1 = new Cat('大毛', '黄色');
alert(cat1.species); // 动物
```

但是，不管是第四种还是第五种都有一个要注意的地方，那就是如果 Animal 的 prototype 中有一个属性的值是一个对象，那么修改 Cat 生成的实例的相关属性的时候，同样会改变 Animal 原型链上的这个属性，这个影响同样作用于是数组的情况，引起这种影响的主要原因在于 JS 的深拷贝与浅拷贝原理

[代码](./demo.js)

```js
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
```
