<!-- Date: 2018-08-06 13:30:21 -->

# es6 代理对象拦截器的属性-getOwnPropertyDescriptor

`getOwnPropertyDescriptor`属性主要拦截以下方法

- `Object.getOwnPropertyDescriptor`
- `Object.getOwnPropertyDescriptors`
- `Reflect.getOwnPropertyDescriptor`

参数

- `target`表示被代理对象
- `key`表示想要获取属性描述对象的属性名

## 拦截案例

下面案例中`name`属性的描述对象中`value`属性的值，被修改成了`orange`：

```js
let obj = { name: 'pear' };
let proxy = new Proxy(obj, {
  getOwnPropertyDescriptor(target, key) {
    return {
      configurable: true,
      enumerable: true,
      value: 'orange',
      writable: true,
    };
  },
});
console.log(Object.getOwnPropertyDescriptor(proxy, 'name'));
/*
{
  configurable: true,
  enumerable: true,
  value: 'orange',
  writable: true,
}
*/

console.log(Object.getOwnPropertyDescriptors(proxy, 'name'));
/*
{
  name: {
    configurable: true,
    enumerable: true,
    value: 'orange',
    writable: true,
  }
}
*/

console.log(Reflect.getOwnPropertyDescriptor(proxy, 'name'));
/*
{
  configurable: true,
  enumerable: true,
  value: 'orange',
  writable: true,
}
*/
```

如果返回的属性描述对象中`configurable`值与实际的值不同时，会抛出错误：

```js
let obj = { name: 'pear' };
let proxy = new Proxy(obj, {
  getOwnPropertyDescriptor(target, key) {
    return {
      configurable: false, // target中name属性描述对象中，该值实际为false
      enumerable: true,
      value: 'orange',
      writable: true,
    };
  },
});
Object.getOwnPropertyDescriptor(proxy, 'name');
// Uncaught TypeError: 'getOwnPropertyDescriptor' on proxy: trap reported non-configurability for property 'name' which is either non-existant or configurable in the proxy target
console.log(Object.getOwnPropertyDescriptor(proxy, 'name'));
```

如果被代理对象是不可扩展对象，获取被代理对象本身不存在属性的属性描述对象时，会抛出错误：

```js
let obj = { name: 'pear' };
let proxy = new Proxy(obj, {
  getOwnPropertyDescriptor(target, key) {
    return {
      configurable: true,
      enumerable: true,
      value: 'orange',
      writable: true,
    };
  },
});
Object.getOwnPropertyDescriptor(proxy, 'age');
// Uncaught TypeError: 'getOwnPropertyDescriptor' on proxy: trap returned descriptor for property 'age' that is incompatible with the existing property in the proxy target
console.log(Object.getOwnPropertyDescriptor(proxy, 'name'));
```
