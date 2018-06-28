# es6-symbol 新的原始数据类型

> ES6 之前存在 6 种原始数据类型,分别是`String, Number, Boolean, Object, undefined, null`,ES6 中新增了一种新的原始数据类型`Symbol`;

## 为什么要引入 Symbol 类型

同事 B 在使用同事 A 提供的的组件时，想给组件添加一个新的方法，就可能导致与组件原有方法有了冲突，如果有一种方法能让每一个属性名是独一无二的，就可以完美解决这个问题。Symbol 的出现就解决了这个问题。

## Symbol()

Symbol 类型数据通过`Symbol`函数生成，由于他是原始数据类型，因此不能使用 New 关键字来声明，否则会抛出一个错误

```js
var a = Symbol();
```

symbol 的参数可以是一个字符串

```js
var add = Symbol("a");
console.log(add); // "a"
var foo = Symbol({
  name: "1"
});
console.log(foo); // "Symbol([object Object])"
```

也可以是一个对象，如果是对象，会先调用 toString 方法，将对象转为字符串后才生成一个 Symbol 值

```js
var egg = Symbol({
  toString: function() {
    return "egg";
  }
});
console.log(egg); // "Symbol(egg)"
```

Symbol 函数的参数仅仅是为了 symbol 值的描述，传入相同的数据，生成的 Symbol 值也是不同的

```js
var a = Symbol('foo');
var b = Symbol('foo');

a === b; // false
Object.is(Symbol('a'), Symbol('a')); // false

var egg = {
	[Symbol('add')]: 1;
}

egg[Symbol('add')]; // undefiend
```

使用 symbol 值作为属性名时，赋值和取值都必须使用`[]`包括，且不能使用`.`运算符

```js
var tmp = Symbol("foo");
var egg = {
  [tmp]: 1
};
egg[tmp]; // 1

egg[tmp] = 2;
egg.tmp = 3;
egg[tmp]; // 2
egg.tmp; // 3
```

Symbol 值可以 **显式** 转为字符串和布尔值，却不能转为数值

```js
var a = Symbol("foo");
String(a); // "Symbol(foo)"
a.toString(); // "Symbol(foo)"
Boolean(a); //true

a + 2; // Typeerror
a + " string"; // TypeError ： can't covert symbol to string
```

## Symbol.for()

除了`Symbol()`之外，`Symbol.for()`也可以生成 Symbol 值

通过该方法生成的对象，会登记在全局环境中，在下一次使用相同参数赋值的时候，会先检查该参数在全局环境中是否已存在， 如果不存在，会创建返回一个新的 Symbol 值，如果已存在，会覆盖原有数据的值

```js
var egg = {
	[Symbol.for('add')]: 1;
}

console.log(egg[Symbol.for('add')]); // 1

egg[Symbol.for('add')] = 2;
console.log(egg[Symbol.for('add')]); // 2
```

也就是说使用相同参数的时候，生成的 Symbol 值实际上是同一个值

```
Object.is(Symbol.for('egg'), Symbol.for('egg')); // true
```

## 获取登记在全局环境中 Symbol 的 key 值

通过`Symbol.keyFor()`方法，可以获取到登记在全局环境中 Symbol 值的 key ，

```js
var add = Symbol("egg");
var foo = Symbol.for("egg");
console.log(Symbol.keyFor(add)); // undefiend
console.log(Symbol.keyFor(foo)); // "egg"
```

注意：

> Symbol.keyFor()只能获取到已经登记造全局环境中的 Symbol 值，所以上面案例中的变量 add 返回了 undefined

## 获取对象的 Symbol 属性

当使用 Symbol 作为属性名的时候，不管是`for...in..`还是`for..of..`还是`getOwnProperty`还是`Object.keys()`都拿不到 Symbol 属性

```js
let a = Symbol.for('a');
let b = Symbol.for('b');

cosnt obj = {
	[a]: 1,
	[b]: 2
}
for( key in obj){
	console.log(key) // 无输出
}
```

要想获得对象的 Symbol 属性名，可以使用`Reflect.ownkeys()`和`getOwnPropertySymbols`方法。其中`Reflect.ownkeys()`会获取对象自身的的所有属性，其中包含了不可枚举属性和 Symbol 属性，而`getOwnPropertySymbols`则是专门获取对象自身所有的 Symbol 属性

```js
let a = Symbol.for("a");
let b = Symbol.for("b");

const obj = {
  [a]: 1,
  [b]: 2
};
console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(a), Symbol(b) ]
```

## 内置的 Symbol 属性

ES6 提供了 11 个内置的 Symbol 值,这里只介绍几个常用的：

### Symbol.hasInstance

通常我们会用`object instanceof constructor`运算来判断 object 是否为 constructor 的实例(或者说 constructor.prototype 是否在 object 的原型链上) 在进行 instanceof 运算的时候，实际上就是执行了对象的`[symbol.hasInstance]`方法

```js
function Egg() {}
var foo = new Egg();
foo instanceof Egg; // true
Egg[Symbol.hasInstance](foo); // true
```

阮一峰老师的博客中写的太少了，我重新总结了一下，具体请阅读[es6-symbol 中的[Symbol.hasInstance]属性](../es6-symbol-hasinstance)

### Symbol.unscopables

这个属性主要用于修改使用 with 关键字后面代码块的上下文。先看一下正常的 with 案例

```js
var egg = {
  name: "zhangsan"
};
with (egg) {
  console.log(name); //  "张三"
}
```

案例中，通过 with 关键字，egg 被自动设置为大括号中的上下文，所以可以直接使用 name 属性，如果人为设置了`[Symbol.unscopables]`属性呢

```js
var name = "lisi";
var egg = {
  name: "zhangsan",
  [Symbol.unscopables]: {
    name: true
  }
};
with (egg) {
  console.log(name); //  undefined
}
```

上面的案例中，我们手动设置了`[Symbol.unscopables]`属性，并且把其中的 name 设置为 true，意味着在使用 with 语句的时候，后接代码块中的上下文不再包含 name 属性,此时输出 name 就会往上一级作用域中查找，最终输出了全局变量下的 name 属性
