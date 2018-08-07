<!-- Date: 2018-08-07 10:25:09 -->

# es6 新的对象-Reflect

Reflect 和 Proxy 是一一对应的，Proxy 的拦截器参数有多少属性，Reflect 就有多少方法。

## 不同的返回结果

`Reflect`的出现代替了`Object`的相同方法，并且与`Object`返回的结果不同

以赋值操作为例

```js
let obj = {};
let re1 = (obj.name = "pear");
let re2 = Reflect.set(obj, "color", "red");

console.log(re1, re2); // 'zhangsan', true
```

可以看出，传统的赋值操作，整体返回的是等号右边的计算结果，而`Reflect`操作返回了一个布尔值，告诉开发人员赋值操作是否成功。

再比如常用的`Object.defineProperty()`方法：

```js
let obj = {};
let re1 = Object.defineProperty(obj, "name", { value: "pear" });
console.log(re1); // {name: "pear"}

let re2 = Reflect.defineProperty(obj, "color", { value: "red" });
console.log(re2); // true
```

`re1`操作返回了整个`obj`对象的内容，而`re2`返回的是操作的成功与否。

## 易读性

有了`Reflect`之后，会让很多操作变得更加易读，以常见的`key in target`表达式为例

```js
let obj = { name: "pear" };
console.log("name" in obj); // true
console.log(Reflect.has(obj, "name")); // true
```

再比如很经典的`Function.prototype.apply.call(, context, [...arg])`方法，这个方法可以执行一个函数，并且为该函数设置上下文，以及传递参数。有了`Reflect`就简单多了

```js
function add(name) {
  return name + "'s color is " + this.color;
}
Function.prototype.apply.call(add, { color: "red" }, ["pear"]); // "pear's color is red"
Reflect.apply(add, { color: "red" }, ["pear"]); // "pear's color is red"
```

> `Function.prototype.apply.call`解读可以参考[解读-Function.prototype.apply.call()](../js-function-apply-call)一文

## 方法

前面说过，`Reflect`的方法都是与`Proxy`对应着的，所以`Reflect`包含以下方法

| 方法                                            | 返回值  | 作用                                                 |
| ----------------------------------------------- | ------- | ---------------------------------------------------- |
| Reflect.get(target, key, receiver)              | Any     | 获取某个属性值                                       |
| Reflect.set(target, key, value, receiver)       | Boolean | 设置某个属性值                                       |
| Reflect.has(target, key)                        | Boolean | 检测是否存在某个属性名                               |
| Reflect.defineProperty(target, key, descriptor) | Boolean | 通过属性描述对象新增属性值                           |
| Reflect.deleteProperty(target, key)             | Boolean | 删除某个属性                                         |
| Reflect.setPrototypeOf(target, prototype)       | Boolean | 为目标设置原型链对象                                 |
| Reflect.getPrototypeOf(target)                  | Boolean | 获取目标的原型链对象                                 |
| Reflect.ownKeys(target)                         | Object  | 获取目标自身的所有属性，包含不可枚举的和 Symbol 类型 |
| Reflect.getOwnPropertyDescriptor(target, key)   | Object  | 获取对象自身所有的属性描述对象                       |
| Reflect.preventExtensions(target)               | Boolean | 阻止目标的可扩展性                                   |
| Reflect.isExtensible(target)                    | Boolean | 检测目标是否可扩展                                   |
| Reflect.apply(target, context, [...argList])    | Any     | 执行一个方法，并且为方法设置执行上下文和参数         |
| Reflect.construct(target, [...argList])         | Object  | 类似于执行一个`new`语句                              |

下面是具体的案例

## Reflect.get(target, key, receiver)

| 参数     | 作用                                     |
| -------- | ---------------------------------------- |
| target   | 目标对象                                 |
| key      | 键名                                     |
| receiver | 执行上下文，如果存在，函数中的 this 指它 |

```js
let obj = {
  color: "red",
  get name() {
    return this.color;
  },
};
let egg = { color: "yellow" };

let proxy = new Proxy(obj, {
  get(target, key, receiver) {
    return [receiver === egg, target[key], receiver[key]];
  },
});

Reflect.get(obj, "name"); // 'red'
```

来看看传入`ceceiver`的情况：

```js
let obj = {
  color: "red",
  get name() {
    return this.color;
  },
};
let egg = { color: "yellow" };
Reflect.get(obj, "name", egg); // 'yellow'
```

案例中，当传入了`receiver`参数后，`getter`中的 this 就指向了`egg`，所以获取到的是`egg.color`

最后来看一下`Proxy`的案例

```js
let obj = {
  color: "red",
  get name() {
    return this.color;
  },
};
let egg = { color: "yellow" };

let proxy = new Proxy(obj, {
  get(target, key, receiver) {
    return [receiver == proxy, receiver === egg, target[key]];
  },
});
Reflect.get(proxy, "name"); // [true, false, 'red']
Reflect.get(proxy, "name", egg); // [false, true, 'yellow']
```

如果`
相关的 proxy： [es6 代理对象拦截器属性-get](../es6-proxy-get)

## Reflect.set(target, key, value, receiver)

| 参数     | 作用                                     |
| -------- | ---------------------------------------- |
| target   | 目标对象                                 |
| key      | 键名                                     |
| value    | 键值                                     |
| receiver | 执行上下文，如果存在，函数中的 this 指它 |

这个方法返回一个布尔值。true 表示设置成功，false 表示设置失败

```js
let obj = {
  set name(value) {
    this.color = value;
  },
};
let egg = {};
Reflect.set(obj, "name", "red"); // 整个语句返回 true

console.log(obj); // {color: 'red'}
```

来看看传入 receiver 的案例

```js
let obj = {
  set name(value) {
    this.color = value;
  },
};
let egg = {};
Reflect.set(obj, "name", "red", egg); // // 整个语句返回 true

console.log(
  obj, // {}
  egg, // {color: 'red'}
);
```

案例中，当传入了`receiver`参数后，`setter`中的 this 就指向了`egg`，所以`egg`中添加了一个`color`属性，而`obj`没有变化

最后来看一下`Proxy`的案例;

```js
let obj = {
  set name(value) {
    this.color = value;
  },
};
let egg = {};
let proxy = new Proxy(obj, {
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  },
});

Reflect.set(proxy, "name", "red"); // 语句整体返回true
console.log(
  obj, // {color: 'red'}
  egg, // {}
);

Reflect.set(proxy, "name", "yellow", egg); // 语句整体返回true

console.log(
  obj, // {color: 'red'}
  egg, // {color: 'yellow'}
);
```

案例中，第二次把 `egg`作为`receiver`参数，所以`name`属性被设置到了`egg`上。

如果`target`不是一个对象，会抛出错误

```js
Reflect.set(null, "name", "yellow");
// Uncaught TypeError: Reflect.set called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-set](../es6-proxy-set)

## Reflect.has(target, key)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |
| key    | 键名     |

这个方法主要用于判断目标自身或者原型链上是否含有某个属性， 类似于`key in target`语句。

下面的代码创建了一个变量`obj`,并且自身拥有一个属性`name`,原型链上拥有一个属性`color`

```js
let obj = Object.create(
  { color: "red" },
  {
    name: {
      value: "pear",
    },
  },
);

console.log(
  "name" in obj, // true
  "color" in obj, // true
);
console.log(
  Reflect.has(obj, "name"), // true
  Reflect.has(obj, "color"), // true
);
```

再来看看与 Proxy 一起使用

```js
let obj = Object.create(
  { color: "red" },
  {
    name: {
      value: "pear",
    },
  },
);

let proxy = new Proxy(obj, {
  has(target, key) {
    return Reflect.has(target, key);
  },
});
console.log(
  Reflect.has(proxy, "name"), // true
  Reflect.has(proxy, "color"), // true
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.has(null, "name");
// Uncaught TypeError: Reflect.has called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-has](../es6-proxy-has)

## Reflect.defineProperty(target, key, descriptor)

| 参数       | 作用         |
| ---------- | ------------ |
| target     | 目标对象     |
| key        | 键名         |
| descriptor | 属性描述对象 |

方法主要用于为目标设置一个属性，用法与`Object.defineProperty(target, key, descriptor)`相似，但是返回的结果不同，这个方法返回一个布尔值，表示是否设置成功

```js
let obj = {};
Reflect.defineProperty(obj, "name", {
  value: "pear",
});
console.log(obj); // {name: 'pear'}
```

再来看一下与 proxy 的结合

```js
let obj = {};
let proxy = new Proxy(obj, {
  defineProperty(target, key, descriptor) {
    return Reflect.defineProperty(target, key, descriptor);
  },
});
Reflect.defineProperty(proxy, "name", {
  value: "pear",
});

console.log(obj); // {name: 'pear'}
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.defineProperty(null, "name", {
  value: "pear",
});
// Uncaught TypeError: Reflect.defineProperty called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-defineProperty](../es6-proxy-define-property)

## Reflect.deleteProperty(target, key)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |
| key    | 键名     |

方法用于删除目标某个属性，与`delete target.key`语句相似，两者都返回一个布尔值

```js
let obj = {
  name: "pear",
  color: "red",
};
console.log(
  delete obj.name, // true
  Reflect.deleteProperty(obj, "color"), // true
  obj, // {}
);
```

再来看一下`proxy`的结合案例

```js
let obj = {
  name: "pear",
  color: "red",
};
let proxy = new Proxy(obj, {
  deleteProperty(target, key) {
    return Reflect.deleteProperty(target, key);
  },
});

Reflect.deleteProperty(proxy, "name"); // true
Reflect.deleteProperty(proxy, "color"); // true
console.log(obj); // {}
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.deleteProperty(null, "name");
// Uncaught TypeError: Reflect.deleteProperty called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-deleteProperty](../es6-proxy-delete-property)

## Reflect.setPrototypeOf(target, prototype)

| 参数      | 作用     |
| --------- | -------- |
| target    | 目标对象 |
| prototype | 描述对象 |

该方法与`Reflect.setPrototypeOf(target, prototype)`用法相同，只是该方法返回一个布尔值，告诉开发人员是否设置成功。作用是给目标设置原型链对象

```js
let obj = { name: "pear" };
let egg = { color: "yellow" };
let foo = { height: 180 };

let re1 = Object.setPrototypeOf(obj, egg);

console.log(
  re1, // {name: 'pear', color: 'yellow'};
  obj.name, // pear
  obj.color, //,yellow
);

let re2 = Reflect.setPrototypeOf(obj, foo);

console.log(
  re1, // true
  obj.name, // pear
  obj.height, //180
);
```

可以看出来通过`Object`和`Reflect`方法返回的结果是不同，但实现的功能是相同的

再来看一下与`Proxy`的结合

```js
let obj = { name: "pear" };
let egg = { color: "yellow" };

let proxy = new Proxy(obj, {
  setPrototypeOf(target, prototype) {
    return Reflect.setPrototypeOf(target, prototype);
  },
});

let re1 = Reflect.setPrototypeOf(proxy, egg);
console.log(
  re1, // true
  proxy.color, // 'yellow'
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.setPrototypeOf(null, {});
// Uncaught TypeError: Reflect.setPrototypeOf called on non-object
```

如果`prototype`不是一个对象，或者不为`null`,也会抛出错误

```js
Reflect.setPrototypeOf({}, 1);
// Uncaught TypeError: Object prototype may only be an Object or null: 1
```

相关的 proxy： [es6 代理对象拦截器属性-setPrototypeOf](../es6-proxy-get-prototype-of)

## Reflect.getPrototypeOf(target)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |

该方法作用与`Reflect.getPrototypeOf(target)`相同，目的是为了获取目标的原型链对象

```js
let obj = { name: "pear" };
let foo = Object.create(obj);

console.log(
  Object.getPrototypeOf(foo), // {name: "pear"}
  Reflect.getPrototypeOf(foo), // {name: "pear"}
);
```

再来看一下与`Proxy`的结合

```js
let obj = { name: "pear" };
let foo = Object.create(obj);

let proxy = new Proxy(foo, {
  getPrototypeOf(target) {
    return Reflect.getPrototypeOf(target);
  },
});
let re1 = Reflect.getPrototypeOf(proxy);
console.log(
  re1, // {name: "pear"}
  re1 === obj, // true
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.getPrototypeOf(null);
// Uncaught TypeError: Reflect.getPrototypeOf called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-getPrototypeOf](../es6-proxy-get-prototype-of)

## Reflect.ownKeys(target)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |
| key    | 键名     |

该方法返回的是目标自身所有的属性列表，包含不可枚举的属性以及`Symbol`类型的属性名，这一点要与`Object.keys(target)`区分开，`Object.keys(target)`返回的是目标自身可枚举的字符串属性列表，

```js
let obj = {
  [Symbol("egg")]: "egg",
};
Object.defineProperties(obj, {
  name: {
    value: "pear",
  },
  color: {
    value: "yellow",
    enumerable: true,
  },
});

console.log(
  Object.keys(obj), // ["color"
  Reflect.ownKeys(obj), // ["name", "color", Symbol(egg)]
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.ownKeys(null);
// Uncaught TypeError: Reflect.ownKeys called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-ownKeys](../es6-proxy-own-keys)

## Reflect.getOwnPropertyDescriptor(target, key)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |
| key    | 键名     |

该方法与`Object.getOwnPropertyDescriptor(target, key)`用法一致，目的是为了查询目标指定属性的描述对象

```js
let obj = {
  name: "pear",
};

console.log(
  Object.getOwnPropertyDescriptor(obj, "name"), // {value: "pear", writable: true, enumerable: true, configurable: true}
  Reflect.getOwnPropertyDescriptor(obj, "name"), //{value: "pear", writable: true, enumerable: true, configurable: true}
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.getOwnPropertyDescriptor(null, "name");
// Uncaught TypeError: Reflect.getOwnPropertyDescriptor called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-getOwnPropertyDescriptor](../es6-proxy-get-own-property-descriptor)

## Reflect.preventExtensions(target)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |

该方法与`Object.preventExtensions(target)`用法相同，目的都是为了使目标对象不可扩展，但是该方法返回的是一个布尔值，表示操作结果是否成功

```js
let obj = { name: "pear" };
let egg = { color: "yellow" };
console.log(
  Object.preventExtensions(obj), // { name: "pear" }
  Reflect.preventExtensions(obj), // true
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.preventExtensions(null, "name");
// Uncaught TypeError: Reflect.preventExtensions called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-preventExtensions](../es6-proxy-prevent-extensions)

## Reflect.isExtensible(target)

| 参数   | 作用     |
| ------ | -------- |
| target | 目标对象 |

该方法与`Object.isExtensible(target)`用法相同，目的都是为了获取目标对象是否可扩展，返回的都是一个布尔值

```js
let obj = { name: "pear" };

console.log(
  Object.isExtensible(obj), // true
  Reflect.isExtensible(obj), // true
);

Reflect.preventExtensions(obj);

console.log(
  Object.isExtensible(obj), // false
  Reflect.isExtensible(obj), // false
);
```

如果`target`不是一个对象，会抛出错误

```js
Reflect.isExtensible(null, "name");
// Uncaught TypeError: Reflect.isExtensible called on non-object
```

相关的 proxy： [es6 代理对象拦截器属性-isExtensible](../es6-proxy-is-extensible)

## Reflect.apply(target, context, [...argList])

| 参数    | 作用                    |
| ------- | ----------------------- |
| target  | 指定要执行的函数        |
| context | 指定函数的执行上下文    |
| argList | 指定函数的参数,数组类型 |

前面说过，该方法可以用来代替> `Function.prototype.apply.call`(可以参考[解读-Function.prototype.apply.call()](../js-function-apply-call))

方法会运行一个指的函数，，并且为函数提供执行上下文以及参数

```js
function add(name) {
  return name + "'s color is " + this.color;
}
Function.prototype.apply.call(add, { color: "red" }, ["pear"]); // "pear's color is red"
Reflect.apply(add, { color: "red" }, ["pear"]); // "pear's color is red"
```

如果`target`不是可以执行的函数，会抛出错误

```js
Reflect.apply(null, { color: "red" }, ["pear"]);
// Uncaught TypeError: Function.prototype.apply was called on null, which is a object and not a function
```

相关的 proxy： [es6 代理对象拦截器属性-apply](../es6-proxy-apply)

## Reflect.construct(target, [...argList], newTarget)

| 参数      | 作用                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| target    | 目标对象,必须是一个构造函数                                                        |
| argList   | 将要传递的参数， 数组类型传递                                                      |
| newTarget | 指定`new.target`的值，用于判定生成对象实例的构造函数，省略的时候，默认等于`target` |

该方法相当于执行一次`new`,会返回一个对象实例。

```js
function Egg(name) {
  this.name = name;
}
let re1 = new Egg("pear");
let re2 = Reflect.construct(Egg, ["orange"]);
console.log(
  re1, // Egg {name: "pear"}
  re2, // Egg {name: "orange"}
);
```

再看看`class`的例子:

```js
class Egg {
  constructor(name) {
    this.name = name;
  }
}
let re1 = new Egg("pear");
let re2 = Reflect.construct(Egg, ["orange"]);
console.log(
  re1, // Egg {name: "pear"}
  re2, // Egg {name: "orange"}
);
```

如果`target`不是一个构造函数，会抛出错误

```js
let re1 = Reflect.construct(null, ["orange"]);
// Uncaught TypeError: null is not a constructor
```

相关的 proxy： [es6 代理对象拦截器属性-construct](../es6-proxy-construct)
