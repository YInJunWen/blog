# es6-symbol 中的[Symbol.toStringTag]属性

在工作中，通常会使用`Object.prototype.toString()`来返回一个值的数据类型, 比如：

```js
Object.prototype.toString.call('abc'); // [object String]
Object.prototype.toString.call(1000); // [object Number]
Object.prototype.toString.call(true); // [object Boolean]
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call(undefined); // [object Undefined]
Object.prototype.toString.call(function() {}); // [object Function]
Object.prototype.toString.call([1, 2, 3]); // [object Array]
Object.prototype.toString.call({ name: 'zhangsan' }); // [object Object]
```

ES6 中那些新的数据类型，本身也部署了这个属性

```js
Object.prototype.toString.call(new Set()); // [object Set]
Object.prototype.toString.call(new Map()); // [object Map]
Object.prototype.toString.call(Symbol()); // [object Symbol]
```

但是我们自己定义的对象是没有这个属性的， 比如自己创建的类

```js
class Egg {}
Object.prototype.toString.call(new Egg()); // "[object Object]"
```

可以看到只能输出一个`[object Object]`, 但这并不是我们想要的，我们需要像上面两个数据类型一样，能够识别出更详细的内容，这个时候就可以人为部署这个`[Symbol.toStringTag]`属性：

```js
class Egg {
  constructor() {
    this[Symbol.toStringTag] = 'Egg';
  }
}
Object.prototype.toString.call(new Egg()); // "[object Egg]"
```

也可以定义在原型链上：

```js
class Egg {
  get [Symbol.toStringTag]() {
    return 'Egg';
  }
}
Object.prototype.toString.call(new Egg()); // "[object Egg]"
```
