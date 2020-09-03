<!-- Date: 2018-05-05 10:46 -->

# es6 变量的解构赋值

> ES6 提供了一中新的语法，可以快速在声明变量的同时，从数组或者对象中提取内容进行赋值，这种方式被称作是“解构”，极大的提高了工作效率。

## 数组的解构赋值

ES6 允许按以下方式，在声明变量的同时进行赋值

```js
let [a, b, c] = [1, 2, 3];
a; // 1
b; // 2
c; // 3
```

解构过程中，允许等号左右不对称，如果解构不成功，变量的值会成为`undefined`，且不会报错

```js
let [a, b, c] = [1, 2];
a; // 1
b; // 2
c; // undefined
```

实际上，在数组解构中，等号右边的对象只要是一个`可迭代对象`，就可以完成解构。

常见默认部署了`遍历器属性`的对象，包括了`字符串, [], new Set(), new Map()`等数据类型，以及某些类数组数据类型，比如`NodeList`等。

```js
let [a, b, c, d] = 'pear';
console.log(a, b, c, d); // 'p','e','a','r'

let [a, b, c, d] = new Set([1, 2, 3, 4]);
console.log(a, b, c, d); // 1,2,3,4

let [a, b, c, d] = new Map([
    [{}, 1],
    [{}, 2],
    [{}, 3],
    [{}, 4],
]);
console.log(a, b, c, d); // [{…}, 1], [{…}, 2], [{…}, 3], [{…}, 4]
```

> 上面案例中关于 Set 和 Map 数据类型用来解构赋值的原理可以看[新的数据结构 Set 与 WeakSet](../es6-set)与[新的数据结构 Map 与 WeakMap](../es6-map)中的解构赋值部分

数组、Set、Map 实例的`keys(), values(), entries()`返回的对象也可以用来完成`数组解构`

```js
let obj = new Map([
    [{}, 1],
    [{}, 2],
    [{}, 3],
    [{}, 4],
]);
let [a, b, c, d] = obj.values();
console.log(a, b, c, d); // 1,2,3,4
```

如果等号右边不是一个可迭代对象，程序都会直接抛出错误。

## 数组解构赋值中的嵌套

只要等号左右的结构`相同`，就可以对左边的变量进行赋值。

```js
let [a, [b, c]] = [1, [2, 3]];
a; // 1
b; // 2
c; // 3
```

```js
let [a, b, c] = [1, [2, 3]];
a; // 1
b; // [2, 3]
c; // undefined
```

## 数组解构赋值中的默认值

数组解构的时候是允许指定默认值的,当等号右边与等号右边元素数量不对等的情况下，会使用默认值

```js
[a = 1, b = 2] = [3];
a; // 3
b; // 2
```

当等号右边的元素，`严格`等于`undefined`的时候，也会使用默认值

```js
[a = 1, b = 2] = [undefiend, undefined];
a; // 1
b; // 2
```

## 对象的解构赋值

对象上也可以使用解构赋值：

```js
let { a, b, c } = { a: 1, b: 2, d: 3 };
a; // 1
b; // 2
d; // undefined
```

为什么上面的案例中可以成功的给三个变量赋值呢？我们知道 ES6 的对象中，如果属性名和已有变量名相同，有一种更为简洁的写法：

```js
let a = 1;
let b = 2;
let c = 3;

let obj = {
    a,
    b,
    c,
};
```

所以，`{a,b,c,d}`实际上就相当于`{a: a, b: b, c: c, d: d}`.

```js
let { a: a, b: c, c: c } = { a: 1, b: 2, d: 3 };
```

因此，在上面的解构赋值中，实际上被赋值的是等号左边的`属性值`，而不是属性名！

```js
let { a: e, b: f, c: g } = { a: 1, b: 2, d: 3 };
a; // a is  not defined
b; // a is  not defined
c; // a is  not defined
e; // 1
f; // 2
g; // undefined
```

## 对象解构赋值的嵌套

嵌套的对象也可以通过解构赋值

```js
let obj = {
    name: {
        age: 18,
    },
};
let { name: data } = obj;

name; // name is not defined
data; // {age: 18}
```

上面的案例中，等号左右两边有一个相同层次且同名的属性`name`，所以等号右边`name`的值，会被赋值给等号左边的变量`data`。

```js
let obj = {
    name: {
        age: 18,
    },
};
let {
    name: { age },
} = obj;

name; // name is not defined
age; // 18
data; // 18
```

上面案例中，只声明了一个变量`age`，解构赋值的方式相当于

```js
let {
    name: { age: age },
} = obj;
```

## 对象解构赋值的默认值

在对象使用解构赋值的时候， 也是可以使用默认值的；当等号右边没有同名属性，或者同名属性的值`严格等于undefined`的时候，会使用默认值

```js
let { a = 1, b = 2 } = {};
let { c = 1, d = 2 } = { c: undefined, d: undefined };

a; // 1
b; // 2
c; // 1
d; // 3

let { e: egg = 1, f: foo = 2 } = { e: 3, f: 4 };
e; // e is not defined
f; // f is not defined
egg; // 3
foo; // 4
```

## 要注意的地方

通过解构赋值使用`let, const`声明变量的时候，同样要遵循`let、const`的规则。

1.不允许重复声明,程序会直接报错`SyntaxError: Identifier 'a' has already been declared`

```js
let a;
let { a } = { a: 1 };
console.log(a);
```

2.const 声明的变量，不允许修改值,程序会直接报错`Assignment to constant variable.`

```js
const a = 2;
[a] = [2];
```

3.变量声明后，才使用对象解构赋值的时候，一定要记得两边加上括号，否则程序会把大括号之间的部分当做代码块去执行，照样会报错

```js
let a,b;
{a, b} = {a: 1, b: 2};  	//   Unexpected token =
({a, b} = {a: 1, b: 2})  	//  可以正确解构
```

## 对象解构赋值与原型链

在对象解构赋值中，可以取到对象的原型链中的同名属性的值。[完整案例代码](./demo/demo1.html)

```js
let foo;
foo = Object.create({
    add: function () {
        console.log('add in prototype');
    },
});
let { add } = foo;

add(); // 'add in prototype
```

并且遵循原型链中`后定义覆盖先定义`的规则。[完整案例代码](./demo/demo2.html)

```js
let foo = Object.create(
    {
        add: function () {
            console.log('add in prototype');
        },
    },
    {
        add: {
            value: function () {
                console.log('add');
            },
        },
    }
);
let { add } = foo;

add(); // 'add'
```

通过构造函数生成的实例对象也是如此。[完整案例代码](./demo/demo3.html)

```js
let foo = function () {
    console.log('foo');
};
foo.prototype.add = function () {
    console.log('add in prototype');
};
let { add } = new foo();

add(); // 'add in prototype
```

## 字符串的解构赋值

我们都知道：基本字符串，在执行某些方法的时候，实际上执行的是`字符串对象`的方法，也就是说，会先把基本字符串转为字符串对象再执行。

字符串对象本身具有遍历器接口，也就是说是一个可迭代对象，又具有一些特殊的属性和方法，例如`toString(),length`。这就导致了字符串可以使用数组进行解构赋值，又可以使用对象进行解构赋值(通过对象进行解构赋值，可以直接拿到字符串对象的原型链上部署的属性和方法)

```js
let str = 'pear';

let [a, b, c, d] = str;
console.log(a, b, c, d); // p, e, a, r

let { length: egg, toString, match } = str;
length; // 2
egg; // 4
tostring; // f(){[native code]}
match; // f(){[native code]}
```

> 为什么这里的`length`是`2`而不是`undefined`呢？，这里的案例是在浏览器中测试的，在浏览器中有一个顶层对象`window`，默认的`length`变量实际上相当于`window.length`，表示当前页面中`frame`的数量，我是在 chrome 的新标签页中测试的，页面内默认包含了两个`iframe`元素，所以这里的`length`是 2

## 数字与布尔值解构赋值

当解构赋值的等号右边是一个数字或者布尔值的时候，同样会先转成对象再进行赋值，也可以拿到他们的原型链上部署的方法。

数字的解构赋值：

```js
let { toString: add, toFixed } = 12;

toString; // toString is not defined
add; // f(){[native code]}
toFixed; // f(){[native code]}
toFixed.call(3.14, 1); // 3.1
```

布尔值的解构赋值:

```js
let { toString: add, valueOf } = true;

toString; // toString is not defined
add; // f(){[native code]}
valueOf; // f(){[native code]}
```

## 在函数中使用解构赋值

利用解构赋值，我们可以在函数中快速的获取到想要的数据

```js
function add({ name, weight }) {
    console.log(name, weight);
}
add({ name: 'pear', weight: '19kg' });
```

如果担心同名变量影响查看代码，还可以使用新的变量名称

```js
function add({ name: realName, weight: realWeight }) {
    console.log(realName, realWeight);
}
add({ name: 'pear', weight: '19kg' });
```

在解构赋值之前，如果想要设置一个函数参数的默认值我们会使用

```js
function add(name, weight) {
    const name = name || 'pear';
    const weight = weight || '10kg';
    console.log(name, weight);
}
add();
```

或者使用`Object.assign()`:

```js
defaultOptions = {
    name: 'pear',
    weight: '10kg',
};
function add(options) {
    const realOptions = Object.assign(option, defaultOptions);
}
add();
```

现在我们可以通过解构赋值的同时为参数定义默认值了

```js
function add({ name = 'pear', weight = '10kg' }) {
    console.log(name, weight);
}
add({}); // 'paer', '10kg'
add({ name: 'orange', weight: '20kg' }); // // 'pear', '20kg'
```

这个时候要注意，默认值，是在执行函数的第一个参数有值的情况下才有效的，如果在执行的时候，第一个参数整体为`undefined`，参数中的解构赋值都不会生效,且会抛出错误!

```js
function add({ name = 'pear', weight = '10kg' }) {
    console.log(name, weight);
}
add(); // Uncaught TypeError: Cannot destructure property `name` of 'undefined' or 'null'.
```

这个时候，我们可以对第一个参数整体进行解构赋值:

```js
function add({ name = 'pear', weight = '10kg' } = {}) {
    console.log(name, weight);
}
add();
```

现在即使不传递第一个参数，默认值也可以生效了。

那么默认值到底应该放在整体解构赋值的等号左边还是右边呢？

解构赋值的默认值，只有在属性值`严格等于undefined`的时候，才会生效，如果在执行方法的时候，传入的参数属性值为`undefined`。等号右边的默认值就失效了。

```js
function add({ name, weight } = { name: 'pear', weight: '10kg' }) {
    console.log(name, weight);
}
add({ name: undefined, weight: undefined });
```
