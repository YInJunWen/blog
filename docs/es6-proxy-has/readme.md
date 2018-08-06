<!-- Date: 2018-07-13 12:11:21 -->

# es6 代理对象的拦截器属性-has

`has`属性主要用于拦截`in， Reflect.has()`操作

## 参数

- `target`表示被代理对象
- `key`表示要查询的属性名

```js
let obj = { name: 'pear' };
let proxy = new Proxy(obj, {
  has: function(target, key) {
    console.log(target === obj); // true
    console.log(key); // 'name'
  },
});
console.log('name' in proxy); // true
```

## 拦截案例

可以手动来修改被拦截方法的返回值

```js
let obj = Object.create(
  {
    name: 'pear',
  },
  {
    age: {
      value: 18,
    },
  }
);
let proxy = new Proxy(obj, {
  has: function(target, key) {
    return true;
  },
});

console.log('name' in proxy); // true
console.log('age' in proxy); // true
console.log(Reflect.has(proxy, 'name')); // true
console.log(Reflect.has(proxy, 'age')); // true
```

上面的案例中，并没有去被代理对象中查询，直接返回了`true`

属性必须返回一个布尔值，除了可以自己定义返回值之外，也可以使用`Reflect.has(target, key)`来作为返回值

```js
let obj = Object.create(
  {
    name: 'pear',
  },
  {
    age: {
      value: 18,
    },
  }
);
Object.freeze(obj);
let proxy = new Proxy(obj, {
  has: function(target, key) {
    // return Reflect.has(target, key);
    return false;
  },
});
```
