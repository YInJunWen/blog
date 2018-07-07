# es6-symbol-hasInstance [Symbol.hasInstance] 属性

通常我们会用`object instanceof constructor`运算来判断 object 是否为 constructor 的实例(或者说 constructor.prototype 是否在 object 的原型链上) 在进行 instanceof 运算的时候，实际上就是执行了对象的`[symbol.hasInstance]`方法

```js
function Egg() {}
var foo = new Egg();
foo instanceof Egg; // true
Egg[Symbol.hasInstance](foo); // true
```

现在我们可以通过重新赋值来更改这个属性而获得不一样的结果：

```js
const Even = {
  [Symbol.hasInstance](obj) {
    return obj > 1;
  }
};
1 instanceof Even; // flase
2 instanceof Even; // true
```

这个方法，通常定义在函数的构造方法或者原型链方法上

```js
// 定义在构造方法上
function Foo() {
  this[Symbol.hasInstance] = function(obj) {
    return obj > 1;
  };
}
1 instanceof new Foo(); // false
2 instanceof new Foo(); // true

// 定义在原型链上
function Egg() {}
Egg.prototype[Symbol.hasInstance] = function(obj) {
  return obj > 1;
};
1 instanceof new Egg(); // false
2 instanceof new Egg(); // true

// 定义在构造方法上
class Phone {
  constructor() {
    this[Symbol.hasInstance] = foo => {
      return foo > 1;
    };
  }
}
1 instanceof new Phone(); // false
2 instanceof new Phone(); // true

// 定义在原型链上
class Apple {
  [Symbol.hasInstance](obj) {
    return obj > 1;
  }
}
console.log("1 instanceof new Apple(): ", 1 instanceof new Apple());
console.log("2 instanceof new Apple(): ", 2 instanceof new Apple());

// 定义在原型链上
class Pen {}
Pen.prototype[Symbol.hasInstance] = foo => {
  return foo > 1;
};
1 instanceof new Pen(); // false
2 instanceof new Pen(); // true
```

如果需要布置在 **静态方法** 上，目前只允许在 class 内部使用 static 的形式定义，其他两种方式都会赋值失败， [查看完整对比案例](./demo/demo3.html)

```js
// 定义在静态方法上
class Pears {
  static [Symbol.hasInstance](obj) {
    return obj > 1;
  }
}
1 instanceof Pears; // false
2 instanceof Pears; // true

// 以下两种方式都是无效的

function Add() {}
Add[Symbol.hasInstance] = function(obj) {
  return obj > 1;
};
1 instanceof Add; // false
2 instanceof Add; // false

class Orange {}
Orange[Symbol.hasInstance] = function(foo) {
  return foo > 1;
};
1 instanceof Orange; // false
2 instanceof Orange; // false
```

可以通过查看赋值后的属性值就可以看出，上面案例中后两种的赋值方式是彻底无效的。

> 如果你足够心细，在静态方法上重新定义后，我的 instanceof 运算符后面跟着的是 class 本身，而不是一个实例对象了。这是因为普通的对象默认是没有部署`[Symbol.hasInstance]`属性的。如果 instanceof 后跟一个没有部署该属性的对象，会抛出一个错误`Uncaught TypeError: Right-hand side of 'instanceof' is not callable`

```js
var add = {};
var foo = function() {};
add[Symbol.hasInstance]; // undefined
foo[Symbol.hasInstance]; // ƒ [Symbol.hasInstance]() { [native code] }

1 instanceof add; // Uncaught TypeError: Right-hand side of 'instanceof' is not callable
1 instanceof foo; // false, 这里用的是foo默认部署的[Symbol.hasInstance], 所以结果为false
new foo() instanceof foo; // true
```
