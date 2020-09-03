<!-- Date: 2018-07-13 12:11 -->

# es6 代理对象的拦截器属性-set

`set`属性，表示`proxy`在设置某个属性值的时候，必须先经过的过滤规则

-   proxy.key 或者 proxy[key]
-   Reflect.set(proxy, key, value)
-   通过`Object.create(proxy)`创建的对象的赋值操作

## 参数

-   `target`表示被代理的对象
-   `key`表示要设置的属性值
-   `value`表示要设置的属性值
-   `receiver`默认表示返回的代理对象

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    set: function (target, key, value, receiver) {
        console.log(target === obj); // true
        console.log(key, value); // 'name', 'orange'
    },
});

proxy.name = 'orange';
```

当直接对`proxy`对象进行赋值的时候，`receiver`参数表示`proxy`本身

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    set: function (target, key, value, receiver) {
        console.log(receiver === proxy); // true
    },
});

proxy.name = 'orange';
```

当对象`egg`自身没有要赋值的属性，且对象的原型链上有一个`proxy`对象时，`receiver`参数指向`egg`

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    set: function (target, key, value, receiver) {
        console.log(receiver === proxy); // false
        console.log(receiver === egg); // true
    },
});

let egg = Object.create(proxy);

egg.name = 'orange';
```

## 拦截案例

`set`拦截属性需要返回一个布尔值，用来告诉开发人员赋值操作是否成功。

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    set: function (target, key, value, receiver) {
        target[key] = value;
        return true;
    },
});

let egg = Object.create(proxy);

let result = (egg.name = 'orange'); // true
```

在已知的赋值操作中，直接赋值的表达式会返回等号右边的值，而`Object.defineProperty(target, key, descriptor)`与`Object.defineProperties(target, key, descriptors)`返回的是 target 自身，我们可以使用`Reflect.set(target, key, value, receiver)`方法的结果来作为拦截器属性`set`的返回值

```js
let obj = {
    name: 'pear',
};
let proxy = new Proxy(obj, {
    set: function (target, key, value, receiver) {
        return Reflect.set(target, key, value);
    },
});

let egg = Object.create(proxy);

let result = (egg.name = 'orange'); // true
```

拦截取值操作可以参考[es6 Proxy 的取值拦截属性](../es6-proxy-get)
