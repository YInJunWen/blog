<!-- Date: 2018-07-13 12:11 -->

# es6 代理对象的拦截器属性-deleteProperty

`deleteProperty`属性用于拦截删除某个属性的操作。

-   `delete target[key]`或者`delete target.key`
-   `Reflect.deleteProperty(target, key)`

## 参数

-   target 表示代理对象
-   key 表示要删除的属性名

## 拦截案例

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    deleteProperty: function (target, key) {
        console.log(target === obj); // true
        console.log(key); // 'name'
        return true;
    },
});
let result = delete obj.name; // true
```

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    deleteProperty: function (target, key) {
        return delete target[key];
    },
});
let result = Reflect.deleteProperty(proxy, 'name'); // true
```

> `delete`和`Reflect.deleteProperty(target, key)`方法都可以直接作为`handler.deleteProperty`的返回值。因为他们的返回值都是`布尔值`。且即便被删除的属性不存在，也不会抛出错误

```js
let obj = {};
let proxy = new Proxy(obj, {
    deleteProperty: function (target, key) {
        return Reflect.deleteProperty(target, key);
    },
});
let result = Reflect.deleteProperty(proxy, 'name'); // true
```

与该属性相反的还有[拦截删除属性操作 handler.deleteProperty()](../es6/proxy-deleteproperty)
