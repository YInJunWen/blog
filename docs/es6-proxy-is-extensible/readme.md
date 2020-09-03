<!-- Date: 2018-08-06 13:27 -->

# es6 代理对象的拦截器属性-isExtensible

`isExtensible`拦截器属性，主要用来拦截“判断对象是否可扩展”的方法

-   `Object.isExtensible(target)`
-   `Reflect.isExtensible(target)`

参数

-   `target`表示被代理对象

## 拦截案例

拦截器属性返回的值，必须与被代理对象的"可扩展属性"相同

```js
let obj = {};
let proxy = new Proxy(obj, {
    isExtensible(target) {
        console.log(target === obj); // true
        return true;
    },
});
console.log(Object.isExtensible(proxy)); // true
```

拦截器属性允许返回隐式转换后为布尔值的值，比如`1==true, 0==false, ''==false, 'a'==true`等

```js
let obj = {};
let proxy = new Proxy(obj, {
    isExtensible(target) {
        return 1;
    },
});
console.log(Object.isExtensible(proxy)); // true
```

相反的：

```js
let obj = {};
Object.preventExtensions(obj);
let proxy = new Proxy(obj, {
    isExtensible(target) {
        return 0;
    },
});
console.log(Object.isExtensible(proxy)); // false
```

## 错误案例

相反的，如果返回值与被代理对象实际可扩展属性不同会抛出错误
案例中，被代理对象`obj`是可以扩展的，但是通过被代理对象`proxy`返回的结果却是`true`。

再来看看相反的例子

```js
let obj = {};
let proxy = new Proxy(obj, {
    isExtensible(target) {
        return false;
    },
});
console.log(Object.isExtensible(proxy));
// Uncaught TypeError: 'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is 'true')
```

再看一个相反的：

```js
let obj = {};
Object.preventExtensions(obj);
let proxy = new Proxy(obj, {
    isExtensible(target) {
        return true;
    },
});
console.log(Object.isExtensible(proxy));
// Uncaught TypeError: 'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is 'false')
```
