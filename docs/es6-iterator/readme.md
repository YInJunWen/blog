# es6-iterator 遍历器

ES6 推出了一个遍历数据结构的新方法`for...of...`循环，这个方法需要对象已经被部署了`[Symbol.iterator]`属性。

## 为什么要添加 for...of...

在 JS 中，最基础的遍历方法就是`for循环`，可以用来遍历字符串、数组等，还可以在中途打断循环，但是它的写法太过繁琐。

```js
let egg = 'pear';
for (let i = 0; i < egg.length; i++) {
  console.log(egg[i]);
  if (i === 'a') {
    break;
  }
}
// p
// e
// a
```

遍历数组的时候，还有一个`forEach循环`，它的缺点是，遍历过程中，不能使用 break 打断循环，容易造成额外的性能浪费

```js
let egg = ['pear', 'apple', 'orange'];
egg.forEach(item => {
  console.log(item);
});
```

> 如果在 forEach 中使用了 break 会抛出错误 `SyntaxError: Illegal break statement`

遍历对象的时候，我们会用一个`for...in...循环`， 但是它在遍历的时候，不能保证输出顺序

```js
let fruit = {
  name: 'apple',
  age: 18,
  '20': '20',
};
for (let index in fruit) {
  console.log([index, fruit[index]]);
}
// [20, '20']
// [name, 'apple']
// [age, 18]
```

> 在`for...in...`中，倒是可以使用 break 打断，但由于输出顺序的不确定性，break 也没什么存在的意义

## for...of...

伴随着 Iterator 对象，ES6 也推出了一种新的遍历方法`for...of...`，这个方法统一的按照目标的`[Symbol.iterator]`方法返回的“遍历器对象”进行遍历输出，而且可以随时停止遍历。

也就是说只要目标被部署了`[Symbol.iterator]`属性，就可以使用`for...of...`方法来进行遍历。而有一些数据结构，默认已经部署了`[Symbol.iterator]`属性

```js
'helloworld'[Symbol.iterator]; // ƒ [Symbol.iterator]() { [native code] }
[][Symbol.iterator]; // ƒ values() { [native code] }
new Set()[Symbol.iterator]; // ƒ values() { [native code] }
new Map()[Symbol.iterator]; // ƒ entries() { [native code] }
```

## 默认部署了`[Symbol.iterator]`属性的数据结构

如果目标是一个字符串

```js
let egg = 'pear';
for (let item of egg) {
  console.log(item);
}
// p
// e
// a
// r
```

如果目标是一个数组

```js
let egg = [1, 2, 3];
for (let item of egg) {
  console.log(item);
}
// 1
// 2
// 3
```

如果目标是一个 Set 实例

```js
let egg = new Set([1, 2, 3]);
for (let item of egg) {
  console.log(item);
}
// 1
// 2
// 3
```

如果目标是一个 Map 实例

```js
let egg = new Set([['name', 'zhangsan'], ['age', 18]]);
for (let item of egg) {
  console.log(item);
}
// ['name', 'zhangsan']
// ['age', '18']
```

除了字符串、数组、Set 实例、Map 实例，都默认部署了`[Symbol.iterator]`属性，我们经常获取到的`NodeList`也默认部署了该属性

```js
let it = document.querySelectorAll('div')';
it[Symbol.iterator]; // ƒ values() { [native code] }
```

## 遍历器属性(接口)

遍历器属性主要有以下作用：

1.  提供一种接口，为各种不同的数据结构提供遍历的方法
2.  使数据结构的成员能够按照指定次序排列
3.  为 ES 新的语法 for...of...循环提供便利

除了`for...of...`循环用到遍历器接口之外，ES6 新提供的`解构赋值、扩展运算符`等，实际上都是通过“遍历器接口”实现的。

在给目标部署遍历器属性的时候，必须符合以下标准

- 返回的遍历器对象必须拥有 next 方法
- next 方法返回的对象中必须包含 value 和 done 属性
- done 是一个布尔值，当 done 为 true 的时候，`for...of...`会停止循环
- value 是遍历时每次输出的值

这里有一个模拟遍历器方法的案例

```js
function makeIterator(arr) {
  let index = 0,
    len = arr.length;
  return {
    next: function() {
      if (index < len) {
        index++;
        return {
          done: false,
          value: arr[index - 1],
        };
      } else {
        return {
          done: true,
          value: undefined,
        };
      }
    },
  };
}
let it = makeIterator([1, 2, 3]);
it.next(); // {done: false, value: 1}
it.next(); // {done: false, value: 2}
it.next(); // {done: false, value: 3}
it.next(); // {done: true, value: undefined}
it.next(); // {done: true, value: undefined}
```

## 手动部署一个遍历器属性

普通的对象默认是没有`[Symbol.iterator]`接口的，如果使用`for...of...`循环，会抛出一个错误`Uncaught TypeError: obj is not iterable`

```js
let obj = {};
for (let item of obj) {
  console.log(item);
}
```

但是我们可以手动给 obj 部署一个`[Symbol.iterator]`接口

```js
let obj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return {
            done: false,
            value: this.data[index++], // 这里我把index+1改了一下写法
          };
        } else {
          return {
            done: true,
            value: undefined,
          };
        }
      },
    };
  },
};
```

> 注意我代码中返回的 next 方法使用了箭头函数，这是为了让函数中 this 的作用域指向`obj`

在上面的代码中，我们为 obj 手动部署了遍历器接口，返回的遍历器对象会逐次输出`obj.data`中的元素

```js
// 手动输出
let it = obj[Symbol.iterator]();
it.next(); // {done: false, value: 1}
it.next(); // {done: false, value: 2}
it.next(); // {done: false, value: 3}
it.next(); // {done: true, value: undefined}
it.next(); // {done: true, value: undefined}

// 自动遍历
for (let item of obj) {
  console.log(item);
}
// 1
// 2
// 3
```

## 为类数组对象部署遍历器接口

数组本身是有遍历器接口的，如果需要给一个类数组部署一个遍历器接口，可以直接把数组的遍历器属性拿过来使用

```js
var obj = {
  0: 'pear',
  1: 'apple',
  2: 'orange',
  length: 3,
};
obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
for (item of obj) {
  console.log(item);
}
// 'pear'
// 'apple'
// 'orange'
```

## generator 函数作为遍历器对象

generator 函数是最快捷部署遍历器对象的方法，直接在 generator 函数中添加 yield 语句即可。

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
// 1;
// 2;
// 3;
```

关于 generator 函数的详情可以查看[es6-generator 生成器函数](../es6-generator)

## 返回遍历器对象的方法

除了执行`[Symbol.iterator]`之外，数组实例、Set 实例、Map 实例的`keys(), values(), entries()`方法都可以直接返回一个“遍历器对象”，具体案例可以在[es6-array 数组的扩展](../es6-array),[es6-set 新的数据结构 Set 与 WeakSet](../es6-set),[es6-map 新的数据结构 Map 与 WeakMap](../es6-map)三篇文章中的相关方法。

## 覆盖对象默认的遍历器接口

如果数据类型本身已经有了遍历器属性，我们可以把老的覆盖掉，以字符串为例

```js
var a = new String('yun');
a[Symbol.iterator] = function*() {
  yield 'l';
  yield 'i';
};
for (item of a) {
  console.log(item);
}

// l
// i
```

这里要注意一点，我用的是`new String()`，而不是使用“字面量”的方式。这是因为使用字面量定义的字符串，在执行方法的时候，实际上会先转成字符串对象，再执行字符串对象`String.prototype`上的方法。通过字面量定义的字符串上的遍历器接口是无效的

```js
var a = 'yun';
a[Symbol.iterator] = function*() {
  yield 'l';
  yield 'i';
};
for (item of a) {
  console.log(item);
}
// y
// u
// n
```

## 接收可迭代对象作为参数的方法

ES6 中有许多方法都可以接收一个 **可迭代对象** 作为参数，这里的可迭代对象，指的就是部署了`[Symbol.iterator]`属性的对象

Set 实例

```js
var obj = {};
obj[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};

let set = new Set(obj); // Set(3) {1, 2, 3}
```

WeakSet 实例

```js
var obj = {};
obj[Symbol.iterator] = function*() {
  yield { name: 1 };
  yield [1, 2];
};
let weakSet = new WeakSet(obj); // WeakSet {{…}, Array(2)}
```

Map 实例

```js
var obj = {};
obj[Symbol.iterator] = function*() {
  yield [1, '1'];
  yield [2, '2'];
  yield [3, '3'];
};
let map = new Map(obj); // Map(3) {1 => "1", 2 => "2", 3 => "3"}
```

WeakMap 实例

```js
var obj = {};
obj[Symbol.iterator] = function*() {
  yield [{}, '1'];
  yield [[], '2'];
};
for (let item of obj) {
  console.log(item);
}
let weakMap = new WeakMap(obj); // WeakMap {{…} => "1", Array(0) => "2"}
```

Array.from()方法

```js
var obj = {};
obj[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};
let arr = Array.from(obj); // [1, 2, 3]
```

Promise.all()方法

```js
let pa = new Promise((res, rej) => {
  res(1);
});
let pb = new Promise((res, rej) => {
  res(2);
});
let obj = {};
obj[Symbol.iterator] = function*() {
  yield pa;
  yield pb;
};
Promise.all(obj).then(res => {
  console.log(res); // [1, 2]
});
```

Promise.race()方法

```js
let pa = new Promise((res, rej) => {
  res(1);
});
let pb = new Promise((res, rej) => {
  rej(2);
});
let obj = {};
obj[Symbol.iterator] = function*() {
  yield pa;
  yield pb;
};
Promise.race(obj).then(res => {
  console.log(res); // 1
});
```
