# **proto**与 prototype

## 对象的`__proto__`

任何对象都有一个叫`__proto__`的东西（注意这里是 2 个下划线，不是 1 个），可以用 Object.getPrototypeOf(foo)来获得

`__proto__`和 prototype 是两个东西：

`__proto__`是每一个对象都有的，不仅局限于函数。我们说的“原型链”指的就是这个`__proto__`

## prototype

prototype 是函数特有的，将这个函数用 new 运算符生成实例后，实例的`__proto__`就是这个函数的 prototype

```js
function add() {}
var a = new add();
a.__proto__ === add.prototype; //true
```

## 关系：

数据类型(Function, String, Array 等)本身也是一个函数，因为我们都是通过 new 方法生成新的对象，因此数据类型本身的`__proto__`是 Function.prototype

```js
Function.__proto__ === Function.prototype; //true
Error.__proto__ === Function.prototype; //true
String.__proto__ === Function.prototype; //true
等等;
```

再往下说的话，然后`Function.prototype.__proto__`自然是一个 Object 对象，所有 Object 对象类型的**proto**都指向 Obejct.prototype,所以 Function.prototype 的`__proto__`是 Object.prototype

```js
Function.prototype.__proto__ === Object.prototype; //true
```

最后 Object.prototype 的`__proto__`是 null，注意是 null 不是 undefined，也就是说这是人为设定的且就是设定了 null，而不是“没有`__proto__`”

```js
Object.prototype.__proto__ === null; //true
```

所以 JavaScript 里有一句话，叫“万物皆继承自 null”，不少人听了这话就一口血……
