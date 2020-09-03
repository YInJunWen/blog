<!-- Date: 2018-08-06 12:10 -->

# es6 代理对象的拦截器属性-prevetExtensions

`prevetExtensions`主要用于拦截`Object.preventExtensions(), Reflect.preventExtensions()`方法，属性返回一个布尔值。

参数

-   `target`表示被代理对象

## 拦截案例

```js
let obj = {};
let proxy = new Proxy(obj, {
    preventExtensions(target) {
        console.log(target === obj); // true
        Object.preventExtensions(target);
        return true;
    },
});
Object.preventExtensions(proxy); // Proxy{}
Reflect.preventExtensions(proxy); // true
```

案例中，拦截器里面我用了`Object.preventExtensions(target)`来真正的把被代理对象设置为不可扩展，这个时候可以返回 true

> 这里要注意，`Object.preventExtensions(target)`方法返回的是目标本身，而`Reflect.preventExtensions(proxy)`方法返回的是一个布尔值

如果没有真正的去阻止扩展，返回`true`会抛出一个错误

```js
let obj = {};
let proxy = new Proxy(obj, {
    preventExtensions(target) {
        console.log(target === obj);
        return true;
    },
});
Object.preventExtensions(proxy);
// Uncaught TypeError: 'preventExtensions' on proxy: trap returned truish but the proxy target is extensible
```

另外在拦截`Object.preventExtensions(proxy)`方法的时候，不允许返回`false`，否则会抛出一个错误。

```js
let obj = {};
let proxy = new Proxy(obj, {
    preventExtensions(target) {
        console.log(target === obj);
        return false;
    },
});
Object.preventExtensions(proxy);

// Uncaught TypeError: 'preventExtensions' on proxy: trap returned falsish
```

这时可以使用`Reflect.preventExtensions(proxy);`来代替：

```js
let obj = {};
let proxy = new Proxy(obj, {
    preventExtensions(target) {
        console.log(target === obj);
        return false;
    },
});
Reflect.preventExtensions(proxy); // true
```
