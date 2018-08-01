<!-- Date: 2017-10-04 01:02:27 -->

# js 函数的 prototype 属性

每个函数都有一个 prototype 属性，属性值是一个对象。当通过 new 关键字生成一个对象实例的时候，实例会继承构造器函数的 prototype 属性中的方法以及属性,这些方法和属性是通过`构造器函数.prototype`来定义的，prototype 指向的实际上就是这个方法的`原型`,这个函数被称作是`构造函数`,通过`new`关键字生成的对象被称作是`实例对象`

```js
function Person() {
  this.a = 1;
}
Person.prototype.age = 2;
console.log(new Person()); // {a: 1}
console.log(new Person().__proto__); // {age: 2}
```

## 对象的`__proto__`属性

所有的对象都拥有一个`__proto__`属性,这个属性并不是 w3c 定义的标准属性，而是浏览器的私有属性，chrome 和 firfox 中都可以看到这个属性

```js
var zhangsan = {name: 1}
console.log(zhangsan)
{
	a: 1,
	__proto__: Object
}
```

实例的`proto`指向该实例构造器函数的 prototype 属性，也就是说

```js
function Person() {
  this.name = 1;
}
new Person().__proto === Person.prototype; // true
```

因此我们可以使用`__proto__`来查看实例对象的原型链上都有哪些属性和方法。但由于`__proto__`只是浏览器私有的属性，所以我们可以使用`Object.getPrototypeOf()`方法，来达到相同的目的

```js
Object.getPrototypeOf(new Person()) === Person.prototype; // true
```

对象的`__proto__`属性实并不是对象本身的属性，实际上是部署在原始 Object 对象上的一个 getter/setter，可以在`Object.prototype`中看到这个属性

## prototype 的 constructor 属性

每个对象都要一个 constructor 属性，会指向关联构造函数本身

```js
function Person() {
  this.name = 1;
}
Person === Person.prototype.constructor;
```

在浏览器中输出`new Person()`的时候，总是会看到实例对象的`constructor`属性，实际上实例对象是没有这个属性的，他取的是`Person.prototype.constructor`

```js
new Person().constructor === Person.ptototype.constructor; // true
```

## 原型链

实例对象，既可以访问构造函数中的 `构造器属性/方法**，又可以访问构造函数原型中的 **原型链属性/方法`。

```js
function add() {
  this.age = 10;
}
add.prototype.name = 'zhangsan';
add.prototype.getName = function() {
  console.log(this.name);
};
var a = new add();
a.age; // 10
a.name; // zhangsan
a.getName(); // zhangsan
```

在浏览器中我们使用`a.__proto__`会发现输出的内容里面除了构造器本身的 age 属性，还有一个`__proto__`属性，打开这个`__proto__`属性，在里面找到了 prototype 中定义的 name 属性和 getName 方法和另一个`__proto__`属性，这个`__proto__`属性最终指向的是最基础的 Object 对象，这一个有一个`__proto__`串联起来，并且能让构造函数生成的实例对象可以访问自身的属性和方法，就被称作是原型链

当实例对象在自己的构造函数中没找到需要的属性和对象的时候，就会自动去原型链上查找对应的属性和方法

```js
function add() {
  this.name = 'zhangsan';
}
add.prototype.name = 'lisi';
var a = new add();
a.name; // zhangsan
delete a.name;
a.name; // lisi
```

## 继承

```js
function Add() {
  this.name = 'zhangsan';
}
Add.prototype.print = function() {
  console.log(this.name);
};
function Foo() {
  Add.call(this);
  this.age = 12;
}
new Foo(); // {name: 'zhangsan', age: 12}
new Foo().print(); // print is not a function
```

通过在 Foo 中执行 call 方法，我们实现了 Foo 函数继承了 Add 函数中的构造器属性和方法，下面继续实现继承 Add 函数原型中的方法

```js
Foo.prototype = Object.create(Add.prototype);
```

> 这里要注意，千万不能忘了使用`Object.create()`方法来创建新的对象，JS 里面对象的赋值运算，实际上只是增加了一个对同一个内存地址的指针，也就是说如果你在赋值之后，修改了 Add.prototype 属性,也会影响到 Foo 生成的实例对象!

前面说过，对象实例的 constructor 实际上是从构造函数.prototype.constructor 中获取的，现在我们直接把 Foo.prototype 的值指向了 Add.prototype，就导致了 new Foo().constructor,指向了`class Add`,因此我们需要手动把这个值改回来

```js
Foo.prototype.constructor = Foo;
```
