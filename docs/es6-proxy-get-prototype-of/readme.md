<!-- Date: 2018-07-13 12:11:21 -->

# es6 代理对象拦截器属性-getPrototypeOf

`getPrototypeOf`属性，会拦击以下几种操作， 返回值必须是一个`对象`！

- `Object.getPrototypeOf(target)`
- `Reflect.getPrototypeOf(target)`
- `target.__proto__`
- `object.isPrototypeOf(target)`
- `instanceof`

## 参数

- `target`参数表示被代理对象

```js
let obj = {};
let proxy = new Proxy(obj, {
  getPrototypeOf: function(target) {
    console.log(target === obj); // true
    return {};
  },
});
Object.getPrototypeOf(proxy);
```

## 操作案例:

```js
let obj = {};
let foo = function() {};
foo.prototype.name = 'zhangsan';
foo.prototype.age = 12;

let proxy = new Proxy(obj, {
  getPrototypeOf: function(target) {
    return foo.prototype;
  },
});

console.log(Object.getPrototypeOf(proxy)); // {name: "zhangsan", age: 12, constructor: ƒ}
console.log(Reflect.getPrototypeOf(proxy)); // {name: "zhangsan", age: 12, constructor: ƒ}
console.log(proxy.__proto__); // {name: "zhangsan", age: 12, constructor: ƒ}
console.log(foo.prototype.isPrototypeOf(proxy)); // true
console.log(proxy instanceof foo); // true
```

## 参考文章

[设置原型链对象的拦截属性 Proxy.handler.setPrototypeOf(target, prototype)](../es6-proxy-setprototypeof)
