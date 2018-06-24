# es6 - iterator 遍历器

> 表示“集合”的数据结构中，除了 array 和 object，ES6 中又新增了 Set 和 Map 两种数据结构，Iterrator 就是为各种不同的数据结构提供一种统一的访问机制，任何数据结构只要部署了 Iterator 接口，就可以完成遍历操作，即依次处理该数据结构的所有成员。

Iterator 主要作用：

1.  提供一种接口，为各种不同的数据结构提供遍历的方法
2.  使数据结构的成员能够按照指定次序排列
3.  为 ES 新的语法 for...of...循环提供便利

最简单的模拟 itertor 接口的例子

```js
function makeiterator(array) {
  var index = 0;
  return {
    next: function() {
      return index < array.length
        ? { value: array[index], done: false }
        : { value: undefined, done: true };
    }
  };
}
var it = makeiterator([1, 2, 3]);
it.next(); //{value: 1, done: false}
it.next(); //{value: 2, done: false}
it.next(); //{value: 3, done: false}
it.next(); //{value: undefined, done: true}
```

如果 done 为 true 的时候就会停止遍历

在 ES6 中默认的 Iterator 接口都部署在 Symbol.iterator 属性中，有些数据结构默认已经具备 Iterator 接口，也就是说他们不需要人为部署 Symbol.iterator 属性就可以使用 for...of...循环，默认具备 iterator 接口的数据结构如下：

- Array
- Map
- Set
- Nodelist
- String
- 函数的 arguments 对象
- TypedArray (类数组对象)

## 对象

对象本身是没有遍历器接口的，但我们可以手动给对象部署一个遍历器接口，方法如下：

```js
var obj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next() {
        if (index < this.data.length) {
          return {
            done: false,
            value: this.data[index++]
          };
        } else {
          return {
            done: true,
            value: undefined
          };
        }
      }
    };
  }
};
for (item in obj) {
  console.log(item);
}
```

输出内容：

```js
1;
2;
3;
```

## 为类数组对象部署遍历器接口

通常，我们会把 key 值是数字并且拥有 length 属性的对象，称作是类数组对象，为他们部署遍历器接口，可以直接把数组的遍历器拿过来用，先看一下最常见的 nodelist：

```
Nodelist.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
```

类数组的对象也可以直接用数组的遍历器方法：

```js
var obj = {
  0: "zhangsan",
  1: "lisi",
  2: "wangwu",
  length: 3
};
obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
for (item of obj) {
  console.log(item);
}
```

这里千万要注意，给普通对象部署遍历器接口是没用的,必须要具备类数组对象的条件才行

```js
var obj = {
  name1: "zhangsan",
  name2: "lisi",
  name3: "wangwu",
  length: 3
};
obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
for (item of obj) {
  console.log(item);
}
```

输出结果：

```js
undefined;
undefined;
undefined;
```

在给对象部署遍历器接口的时候，遍历器接口返回的必须是一个标准的遍历器对象，否则程序会报错

```js
var obj = {};
obj[Symbol.iterator] = () => 1;
var it = obj[Symbol.iterator]();
it.next(); // it.next is not a function
```

## generator 函数作为遍历器对象

generator 函数是最快捷部署遍历器对象的方法，直接在 generator 函数中添加 yield 语句即可

```js
var obj = {};
obj[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};
for (item of obj) {
  console.log(item);
}
```

输入结果：

```js
1;
2;
3;
```

## 默认调用遍历器接口的 API 和语法

ES6 中提供了几种新的 API 和语法在执行的时候都是自动调用了对象的遍历器方法，比如扩展运算符`...`

```js
var a = [1, 2, 3];
var b = [5, 6, ...a];
b; // [5,6,1,2,3]
```

解构赋值也调用了遍历器方法

```js
var a = [1, 2, 3];
var [x, y, z] = a;
x; // 1
y; // 2
z; // 3
```

## 字符串上的遍历器接口

字符串也属于类数组的一种，因此它本身也默认部署了遍历器接口

```js
var a = "yun";
for (item of a) {
  console.log(item);
}
```

输出结果：

```js
y;
u;
n;
```

## Set 和 Map 对象上的遍历器接口

Set 对象和 Map 对象也默认部署了遍历器接口，Set 数据如下：

```js
var a = new Set()
  .add("zhangsan")
  .add("lisi")
  .add("wangwu");
for (item of a) {
  console.log(item);
}
```

输出结果：

```
zhangsan
lisi
wangwu
```

Map 数据的例子：

```js
var a = new Map();
a.set("name", "zhangsan");
a.set("age", "13");
a.set("height", "180");
for (item of a) {
  console.log(item);
}
```

输出结果：

```js
["name", "zhangsan"][("age", "13")][("height", "180")];
```

这里我们可以使用解构赋值来输出他们的值

```js
for ([name, value] of a) {
  console.log(value);
}
```

输出结果：

```js
"zhangsan";
"13";
"180";
```

## 返回遍历器对象的方法

除了通过调用对象的`[Symbol.iterator]`方法可以返回遍历器对象之外，还有其他的方法可以返回遍历器对象，比如`Object.entries()`、`Object.keys()`、`Object.values()`, 都可以使用遍历器对象的方法

```js
var a = ['zhangsan', 'lisi', 'wangwu'];
var b = Object.entries();
[...b]

var c == Object.keys();
[...c]

var d = Object.values();
[...d]
```

输出结果：

```js
[["0", "zhangsan"], ["1", "lisi"], ["2", "wangwu"]][("0", "1", "2")][
  ("zhangsan", "lisi", "wangwu")
];
```

## 覆盖对象默认的遍历器接口

对象默认的遍历器接口也是可以被覆盖掉的，我们以字符串为例

```js
var a = new String("yun");
a[Symbol.iterator] = function*() {
  yield "l";
  yield "i";
};
for (item of a) {
  console.log(item);
}
```

输出结果：

```js
// l
// i
```

这里要注意一点，我用的是`new String()`来创建的字符串对象，如果用字面量的形式声明变量`a`，则不会有任何效果。这是因为通过`new String()`定义的是一个特殊的`原始类型的实例(字符串对象)`，而字面量的形式生成的是一个`原始值`，原始值是不能定义定义属性的，至于原始类型的实例和原始值的区别，会在另一篇文章中详细介绍
