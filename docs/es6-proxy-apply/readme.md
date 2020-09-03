<!-- Date: 2018-07-13 12:11 -->

# es6 代理对象的拦截器属性-apply

`apply`属性主要用于拦截函数的执行操作

-   Function.prototype.apply(context, argList:array)
-   Function.prototype.call(context, ...args)
-   Reflect.apply(target, context, argList:array)

## 参数

-   `target`表示被代理的对象
-   `context`表示执行函数时的上下文
-   `argList`表示执行函数式传入的参数，以数组形式传递

## 拦截案例

```js
let add = function () {
    console.log('add');
};
let proxy = new Proxy(add, {
    apply: function (target, context, argList) {
        console.log(target === add); // true
        console.log(context === obj); // true
        console.log(argList); // [1,2,3]
    },
});
let obj = {
    name: 'pear',
    proxy,
};
obj.proxy(1, 2, 3);
```

```js
let add = function () {
    console.log('add');
};
let proxy = new Proxy(add, {
    apply: function (target, context, argList) {
        retrun[(target === add, context === obj, argList)];
    },
});
let obj = {
    name: 'pear',
};
let a = proxy.call(obj, 1, 2, 3); // [true, true, [1,2,3]]
let b = proxy.apply(obj, [1, 2, 3]); // [true, true, [1,2,3]]
let c = Reflect.apply(proxy, obj, [1, 2, 3]); // [true, true, [1,2,3]]
```

## 错误案例

`apply`属性强调被代理对象必须是一个可执行函数，否则会抛出一个错误

```js
let add = {};
let proxy = new Proxy(add, {
    apply: function (target, context, argList) {
        console.log(target === add); // true
        console.log(context === obj); // true
        console.log(argList); // [1,2,3]
    },
});
let obj = {
    name: 'pear',
    proxy,
};
obj.proxy(1, 2, 3);
// Uncaught TypeError: obj.proxy is not a function
```
