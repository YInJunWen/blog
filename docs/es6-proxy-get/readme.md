<!-- Date: 2018-07-13 12:11:21 -->

# es6 代理对象拦截器属性-get

`get`属性用于拦截取值操作

## 参数

- `target`表示被代理的对象
- `key`表示要获取的属性值
- `receiver`默认表示返回的代理对象

## 拦截案例

```js
let obj = {
  name: "pear",
};
let proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log(target === obj); // true
    console.log(key); // 'name'
    console.log(receiver === proxy); // true
    return "orange";
  },
});
console.log(proxy.name);
```

从上面的例子中，访问`name`属性的操作被拦截掉了，返回的结果被修改成了`orange`

如果一个对象自身没有要获取的属性，而它的原型链上有一个 proxy，那么获取这个属性的时候，`proxy`的`get`属性也会被调用：

```js
let obj = {
  name: "pear",
};
let proxy = new Proxy(obj, {
  get(target, key, receiver) {
    return "orange";
  },
});
let egg = Object.craete(proxy);

egg.name; //'orange'
```

使用`Reflect.get()`获取属性值的时候，同样有效

```js
let obj = {
  name: "pear",
};
let proxy = new Proxy(obj, {
  get(target, key, receiver) {
    return "orange";
  },
});

Reflect.get(proxy, "name"); //'orange'
```

## 错误案例

如果要访问的属性的描述对象中可配置属性`configurable`和可改写属性`writable`都为`false`，`get`拦截器返回的值必须与`target`中的值相同，否则会抛出错误`Uncaught TypeError: 'get' on proxy: property 'name' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'pear' but got 'orange')`

```js
let obj = {};
Object.defineProperty(obj, "name", {
  value: "pear",
  configurable: false,
  writable: false,
  enumerable: true,
});
let proxy = new Proxy(obj, {
  get(target, key, receiver) {
    return "orange";
  },
});
console.log(proxy); // Proxy {name: 'pear'}
console.log(proxy.name);
```

> MDN 上说“如果要访问的目标属性没有配置访问方法，即 get 方法是 undefined 的，则返回值必须为 undefined”。我在测试的时候，并没有发现这个限制。有兴趣的[查看完整代码](./demo/demo1.html)。或者告诉我是哪里的原因

`get`属性可以拦截以下三种方式的取值操作：

- proxy.key 或者 proxy[key]
- Reflect.get(proxy, key)
- 通过`Object.create(proxy)`创建的对象的取值操作

拦截赋值操作可以参考[es6 Proxy 的赋值拦截属性](../es6-proxy-set)
