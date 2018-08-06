<!-- Date: 2018-08-02 16:48 -->

# es6 代理对象的拦截器属性-ownKeys

该属性主要用于拦截`获取对象自身的属性名列表`操作，要求返回一个`数组`。

- `Object.getOwnPropertyNames(target)`获取对象自身所有字符串属性的属性名，包含不可枚举的属性名
- `Object.getOwnPropertySymbols(target)`获取对象自身所有`Symbol`类型且可枚举的属性名
- `Object.keys(target)`获取对象自身所有字符串属性且可枚举的属性名
- `Reflect.ownKeys(target)` 获取对象自身所有属性名(相当于`Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)))`

## 参数

- `target`表示被代理对象

```js
let obj = { name: 'peaer' };
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    console.log(target === obj); // true
    return ['age'];
  },
});
console.log(Object.getOwnPropertyNames(obj)); // ['name']
console.log(Object.getOwnPropertyNames(proxy)); // ['age']
```

可以看到，通过`proxy`获取属性名列表的过程中，返回的数据被修改掉了。

## 拦截案例：

```js
let obj = {};
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    return [Symbol.for('egg'), 'age'];
  },
});
console.log(Object.getOwnPropertyNames(proxy)); // ['age']
console.log(Object.getOwnPropertySymbols(proxy)); // [Symbol(egg)]
console.log(Reflect.ownKeys(proxy)); // [Symbol(egg), "age"]
console.log(Object.keys(proxy)); // []
```

上面的案例中，拦截器返回的数组中既有字符串元素，又有`Symbol`类型元素，`getOwnPropertyNames`只获取其中的字符串元素，`getOwnPropertySymbols`只获取其中的`Symbol`类型元素，`Reflect.ownKeys`获取全部的元素。

但是`Object.keys`为什么输出的是一个空数组呢？这是一个特例，`Object.keys()`获取代理对象的属性名列表时，只能输出`被代理对象已有的可枚举属性`。

```js
let obj = {
  age: 18,
};
Object.defineProperties(obj, {
  height: {
    value: '180cm',
  },
  weight: {
    value: '90kg',
    enumerable: true,
  },
});
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    return ['name', 'age', 'weight', 'height'];
  },
});
console.log(Object.keys(proxy)); // ["age", "weight"]
```

在上面案例中，拦截器返回了四种字符串元素，其中`name`属性在被代理对象中不存在，所以不会被输出；通过`Object.defineProperties`定义的属性默认是`不可枚举`的，所以`height`属性也不会被输出。

## 错误案例

返回的数组元素只能是`Symbol`或者字符串类型，其他类型都会抛出错误

```js
let obj = {};
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    return [new Set([1, 2])];
  },
});
Object.getOwnPropertyNames(proxy);
// ncaught TypeError: #<Set> is not a valid property name
```

如果被代理对象的自身属性中，有不可配置(configurable 为 false)的属性没有包含在返回的数组中，也会抛出一个错误.

```js
let obj = {};
Object.defineProperties(obj, {
  height: {
    value: '180cm',
  },
});
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    return ['name', 'age', 'weight'];
  },
});
Object.getOwnPropertyNames(proxy);
// Uncaught TypeError: 'ownKeys' on proxy: trap result did not include 'height'
```

> Tips: 通过对象字面量定义的属性默认的 configurable 为 true，通过 `Object.defineProperty` 或者 `Object.defineProperties` 定义的属性默认为 false

如果被代理对象是不可扩展的，`ownKeys`属性返回的数组，必须包含被代理对象自身的所有属性，且不能额外添加其他属性

```js
let obj = {
  weight: '80kg',
};
Object.preventExtensions(obj);
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    return [];
  },
});
Object.getOwnPropertyNames(proxy);
// Uncaught TypeError: 'ownKeys' on proxy: trap result did not include 'weight'
```

```js
let obj = {
  weight: '80kg',
};
Object.preventExtensions(obj);
let proxy = new Proxy(obj, {
  ownKeys: function(target) {
    return ['weight', 'height'];
  },
});
Object.getOwnPropertyNames(proxy);
// Uncaught TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
```
