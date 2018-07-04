# es6-symbol 中的[Symbol.iterator]属性

当对一个对象使用`for...if...`方法时，会默认调用对象的`[Symbol.iterator]`属性，JS 中一些内置对象默认已经部署了该属性

- String.prototype[Symbol.iterator]
- Array.prototype[Symbol.iterator]
- TypeArray.prototype[Symbol.iterator]
- Set.prototype[Symbol.iterator]
- Map.prototype[Symbol.iterator]

但是如果想对一个空对象使用`for...of...`方法时，就会抛出一个错误`egg is not iterable`，因为它没有被部署`[Symbol.iterator]`属性

```js
var egg = {};
for (item of egg) {
  console.log(1); // egg is not iterable
}
```

下面给`egg`部署一下该属性

```js
var egg = {
  [Symbol.iterator]: function*() {
    yield 1;
    yield 2;
    yield 3;
  }
};
for (item of egg) {
  console.log(item); // 1,2,3
}
```

再来看一下部署到 class 中的案例：

```js
class Egg {}
Egg.prototype[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};
for (item of new Egg()) {
  console.log(item); // 1,2,3
}

// 等同于：
class Egg {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
}
for (item of new Egg()) {
  console.log(item); // 1,2,3
}

class Egg {
  constructor() {
    this[Symbol.iterator] = function*() {
      yield 1;
      yield 2;
      yield 3;
    };
  }
}
for (item of new Egg()) {
  console.log(item); // 1,2,3
}
```
