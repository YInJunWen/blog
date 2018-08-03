<!-- Date: 2018-07-13 12:11:21 -->

# es6 代理对象拦截器属性-setPrototypeOf

`setPrototypeOf`属性，主要用于拦截`Obejct.setPrototypeOf(target, prototype)`和`Reflect.setPrototypeOf(target, prototype)`两种操作。

## 参数

- `target`表示被代理对象
- `prototype`表示想要设置的原型

```js
let obj = {};
let foo = function() {};
foo.prototype.name = 'zhangsan';
foo.prototype.age = 12;

let proxy = new Proxy(obj, {
  setPrototypeOf: function(target, prototype) {
    console.log(target === obj); // true
    console.log(prototype === foo.prototype); // true
    return true;
  },
});
Object.setPrototypeOf(proxy, foo.prototype); // true
```

## 拦截案例

定义的函数返回一个布尔值，`true`表示设置成功，`false`表示设置失败，可以在方法中手动返回布尔值，也可以使用`Reflect.setPrototypeOf(target, prototype)`的返回值函数的返回值

```js
let obj = {};
let foo = function() {};
foo.prototype.name = 'zhangsan';
foo.prototype.age = 12;

let proxy = new Proxy(obj, {
  setPrototypeOf: function(target, prototype) {
    return Reflect.setPrototypeOf(target, prototype);
  },
});
Object.setPrototypeOf(proxy, foo.prototype); // true

console.log(Object.getPrototypeOf(proxy) === foo.prototype); // true
console.log(Reflect.getPrototypeOf(proxy) === foo.prototype); // true
console.log(proxy.__proto__ === foo.prototype); // true
console.log(foo.prototype.isPrototypeOf(proxy)); // true
console.log(proxy instanceof foo); // true
```

## 错误案例

如果被代理对象是`不可扩展的`,proxy 将会抛出一个错误

```js
let obj = {};
Object.freeze(obj);
let foo = function() {};
foo.prototype.name = 'zhangsan';
foo.prototype.age = 12;

let proxy = new Proxy(obj, {
  setPrototypeOf: function(target, prototype) {
    return Reflect.setPrototypeOf(target, prototype);
  },
});
Object.setPrototypeOf(proxy, foo.prototype);
// Uncaught TypeError: 'setPrototypeOf' on proxy: trap returned falsish
```

因此，在为`proxy`设置原型对象的时候，必须和被代理对象的已有原型对象相同

```js
let obj = {};
let obj2 = { age: 3 };
Object.setPrototypeOf(obj, obj2);
Object.freeze(obj);

let foo = function() {};
foo.prototype.name = 'zhangsan';
foo.prototype.age = 12;

let proxy = new Proxy(obj, {
  setPrototypeOf: function(target, prototype) {
    return Reflect.setPrototypeOf(target, prototype);
  },
});
Object.setPrototypeOf(proxy, obj2); // 这里就不会抛出错误了
```

## 参考文章

[获取原型链对象的拦截属性 Proxy.handler.getPrototypeOf(target, prototype)](../es6-proxy-getprototypeof)
