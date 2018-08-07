<!-- Date: 2018-07-12 19:31:21 -->

# es6 新的代理对象-Proxy

`Proxy`是 ES6 提供的新对象，用来自定义对目标的代理操作。也就是说，可以在目标的外面，设置一层“拦截”，在设置或者获取目标某些属性/方法的时候，先通过`Proxy`中定义的行为过滤和改写，再返回指定的内容。

具体的用法如下：

```js
new Proxy(target, handler);
```

- target： 表示被代理的对象，该对象可以是任何数据类型
- handler：表示具体的拦截内容，以对象的形式设置不同的拦截属性

该方法，返回一个`proxy`对象， 可以通过`proxy`对象进行属性的获取、赋值等一系列操作.

handler 中可以定义拦截不同的操作，比如`get`属性

```js
let obj = { name: "pear" };
let proxy = new Proxy(obj, {
  get: function(target, key) {
    return "orange";
  },
});
console.log(proxy.orange); // 'orange'
```

上面案例中，`obj.name`属性值本来是`'pear'`，被代理后的对象`proxy.name`却返回了`'orange'`。对象`proxy`是`obj`的代理对象。在通过`proxy`获取属性值的时候，被`handler.get`方法拦截了返回值。

除了取值操作，赋值操作也可以被拦截

```js
let obj = { name: "pear" };
let proxy = new Proxy(obj, {
  set: function(target, key, value) {
    console.log(key, value);
    target[key] = "apple";
    return true;
  },
});
proxy.name = "orange";
console.log(obj); // {name: 'apple'}
```

在上面的案例中，通过代理对象`proxy`设置属性`name`的值为`orange`，经过拦截器中的`set`方法后，`obj.name`的值被修改成了`'apple'`。

在生成新的代理对象过程中，一共可以设置 13 个拦截属性，各自可以拦截多种操作：

- [handler.get()](../es6-proxy-get)
- [handler.set()](../es6-proxy-set)
- [handler.has()](../es6-proxy-has)
- [handler.defineProperty()](../es6-proxy-define-property)
- [handler.deleteProperty()](../es6-proxy-delete-property)
- [handler.ownKeys()](../es6-proxy-own-keys)
- [handler.getOwnPropertyDescriptor()](../es6-proxy-get-own-property-descriptor)
- [handler.getPrototypeOf()](../es6-proxy-get-prototype-of)
- [handler.setPrototypeOf()](../es6-proxy-set-prototype-of)
- [handler.isExtensible()](../es6-proxy-is-extensible)
- [handler.preventExtensions()](../es6-proxy-prevent-extensions)
- [handler.apply()](../es6-proxy-apply)
- [handler.construct()](../es6-proxy-construct)

## Proxy 中的 this 问题

正常情况下 Proxy 中的`this`都指向代理对象本身

```js
let obj = {
  getName() {
    console.log(this === proxy);
  },
};
let proxy = new Proxy(obj, {});

console.log(
  obj.getName(), // false
  proxy.getName(), // true
);
```

在`Proxy`的拦截器参数中`get(target, key, value, receiver),set(target, key, value, receiver)`中如果传入了`receiver`，`this`将指向`receiver`

```js
let egg = {
  age: 20,
};
let obj = {
  age: 10,
  get name() {
    console.log(this === proxy, this === egg);
    return this.age;
  },
};
let proxy = new Proxy(obj, {});

console.log(
  Reflect.get(proxy, "name"), // 10
  Reflect.get(proxy, "name", egg), // 20
);
```

上面的案例中，当`receiver`参数传入一个`egg`的时候，`this`指向了`egg`。所以`return this.age`的值也是不同的

再看一个特殊的例子(该例子来源于阮一峰老师的案例)

```js
let map = new Map();
class Egg {
  constructor() {
    map.set(this, "pear");
  }
  getName() {
    return map.get(this);
  }
}
let obj = new Egg();
let proxy = new Proxy(obj, {});

console.log(
  obj.getName(); // 'pear'
  proxy.getName(); // undefined
);
```

上面的例子中，被代理对象`obj.getName()`和`proxy.getName()`返回的结果是不同的，就是因为内部的`this`指向不同。`obj.getName()`中的`this`指向`obj`，map 的内容是`Map(1) {Egg => "pear"}`， `proxy.getName()`中的`this`指向`proxy`。`map`中并没有以`proxy`为键名的属性，所以返回了`undefined`

## 可撤销代理的`Proxy`对象

在某些场景中，我们希望必须通过代理对象访问目标对象，并且在一定条件后，可以直接访问目标对象。 此时就用到了“可以撤销的`Proxy`对象”。

方法：`Proxy.revocable(target, handler)`，其中`target`与`handler`与正常的`new Proxy(target, handler)`用法相同，返回一个特殊对象

该对象的结构为`{"proxy": proxy, "revoke": revoke}`， 其中`proxy`就是返回的代理对象，`revoke`是一个方法，用于撤销代理。代理被撤销后，再使用代理对象进行任何操作都会抛出错误

```js
let obj = {
  name: "pear",
};

let revocable = Proxy.revocable(obj, {
  get(target, key) {
    return "orange";
  },
});

let proxy = revocable.proxy;
console.log(proxy.name); // pear

revocable.revoke(); // 撤销代理
console.log(proxy.name); // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```
