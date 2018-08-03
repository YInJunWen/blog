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
let obj = { name: 'pear' };
let proxy = new Proxy(obj, {
  get: function(target, key) {
    return 'orange';
  },
});
console.log(proxy.orange); // 'orange'
```

上面案例中，`obj.name`属性值本来是`'pear'`，被代理后的对象`proxy.name`却返回了`'orange'`。对象`proxy`是`obj`的代理对象。在通过`proxy`获取属性值的时候，被`handler.get`方法拦截了返回值。

除了取值操作，赋值操作也可以被拦截

```js
let obj = { name: 'pear' };
let proxy = new Proxy(obj, {
  set: function(target, key, value) {
    console.log(key, value);
    target[key] = 'apple';
    return true;
  },
});
proxy.name = 'orange';
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
