# es6-object 对象的扩展

## es6 中更简洁的对象表示方法

当对象的属性名，需要用到某个已声明的变量以及变量值的时候，ES6 允许使用下面更简洁的方法

```js
var name = "zangsan";
var obj = { name };
obj.name; // 'zhangsan'

function add(x, y) {
  return { x, y }; // 这里等同于 {x: x, y: y}
}
add(1, 2); //  {x:1, y:2};
```

除了属性，对象的方法名也是可以简写的,这里要注意的是对象里面简写方法的时候，逗号是不能少的**(class 语法糖中方法之间是不需要逗号的)**

```js
var obj = {
  getName() {
    console.log("zhangsan");
  },
  getAge() {
    console.log(20);
  }
};
obj.getName(); // zhangsan
obj.getAge(); // 20
```

我们在写 nodeJs 模块的时候，也可以这么写

```js
var getName = function() {
  console.log("zhangsan");
};
var getAge = function() {
  console.log(20);
};
module.exports = {
  getName, //  相当于 getName: getName
  getAge //  相当于 getAge: getAge
};
```

## 属性名使用表达式

ES5 的时候，定义对象的属性，可以通过`.`实现，或者通过在`[]`中写表达式来实现

```js
var add = {};
add.male = 1;
add["famale"] = 2;
add["na" + "me"] = 3;
console.log(add); // {male: 1, famale: 2, name: 3}
```

但是在对象字面量中只能使用字符串或者数字来声明一个属性，ES6 中在对象字面量中定义属性名也可以使用表达式了，但是要包含在`[]`之间

```js
var sex = "male";
var add = {
  [sex]: 1
};
console.log(add); // {male: 1}
```

但是要注意属性名表达式不能和简介表示法同时使用，会抛出一个语法错误`Uncaught SyntaxError: Unexpected token }`

```js
var sex = "male";
var male  = 1;
var add = {
  [sex]
};
console.log(add); // Uncaught SyntaxError: Unexpected token }
```

## Object.is(target, source)

ES6 提供了这个新方法，来进行两个对象之间的对比。在 ES5 中会使用`===`来严格判断两个对象是否相同，但是它有一个致命的缺陷：不能判断`NaN`等于自身。`Object.is()`方法弥补了这个不足

```js
NaN === NaN; // false
Object.is(NaN, NaN); // true
```

两者在处理`+0`与`-0`上也有所不同

```js
+0 === -0; //true
Object.is(+0, -0); // false
```

对于其他值得行为与`===`是保持一致的

```js
Object.is('a', 'a'); / true
Object.is(1, 1); / true
Object.is(true, true); / true
Object.is(null, null); / true
Object.is(undefined, undefined); / true

Object.is({}, {}); / false
Object.is([], []); / false

Object.is(Symbol('a'), Symbol('a')); / false
Object.is(new Set([1,2,3]), new Set([1,2,3])); / false
Object.is(new Map().set('name',1), new Map().set('name',1)); / false
```

## Object.assign(target, source)

该方法经常用来合并/覆盖多个对象中的属性，执行后会返回合并/覆盖后的 target 对象，但是要注意：

1.source 中的同名属性会覆盖 target 中的属性,如果有多个 source，以最后一个 source 的属性值为主

```js
let add = { a: 1 };
let foo = { a: 2, b: 2 };
let egg = { a: 3, b: undefined };
Object.assign(add, foo, egg);
console.log(add); //{a:3, b:undefined}
```

2.只会合并/覆盖对象中的 **第一级属性**

```js
let add = { a: { b: 1 } };
let foo = { a: 2 };
Object.assign(add, foo);
console.log(add); //{a:2}
```

3.在拷贝的时候属于浅拷贝，也就是如果属性值是一个复合数据类型，该属性值如果在 source 中被修改，target 中也会随着更改

```js
var sex = { male: 1 };
var add = {};
var foo = { sex };
Object.assign(add, foo);
console.log(add); // {sex: {male: 1}}
sex.male = 2;
console.log(add); // {sex: {male: 2}}
```

4.由于这个方法会修改 target，所以在大多数我们会把 target 设置一个空对象，来实现返回一个新对象的目的

```js
let add = { a: 1 };
let foo = { a: 2, b: 2 };
let target = Object.assign({}, add, foo);
console.log(target); // {a:2, b:2}
```

在函数中不能使用默认值的时候，我们经常会使用这个方法来替换默认值

```js
var defaultOptions = {};
function add(options) {
  var realOptions = Object.assign({}, defaultOptions, options);
  // ...code
}
```

5.只可以合并/覆盖 **可枚举的属性**， 比如对象的 toString 属性，就是不可枚举的，就不会被合并/覆盖到 target 上

6.方法不能拷贝`getter`和`setter`属性，如果一个对一个属性设置了`getter`和`setter`,`Object.assign()`会先自动计算`getter`的结果后，再进行拷贝。

```js
var add = {
  name: "zhangsan",
  get foo() {
    return this.name;
  }
};
var foo = Object.assign({}, add);
console.log(Object.getOwnPropertyDescriptors(foo));
/*
    {
        foo: {
            configurable:true
            enumerable:true
            value:"zhangsan"
            writable:true
        },
        name: {
            configurable:true
            enumerable:true
            value:"zhangsan"
            writable:true
        }
    }
*/
```

这个缺点可以使用下面的方式解决：

```js
var add = {
  name: "zhangsan",
  get foo() {
    return this.name;
  }
};
var foo = {};
Object.defineProperties(foo, Object.getOwnPropertyDescriptors(add));
console.log(Object.getOwnPropertyDescriptors(foo));
/*
    {
        foo: {
            configurable:true
            enumerable:true
            get:function(){...}
            set: undefined 
        },
        name: {
            configurable:true
            enumerable:true
            value:"zhangsan"
            writable:true
        }
    }
*/
```

## 属性的描述对象

每个属性都有他们各自的描述对象`descriptor`,描述对象包含了多个属性：

- value: 定义属性的值
- writable: 定义属性是否可被重新赋值， 默认为 true
- enumerable: 定义属性的可枚举性， 默认为 false
- configurable: 定义属性是否可以被重新定义描述对象， 默认为 false
- get: 给属性提供 getter 方法，主要用于获取属性值， 默认为 undefined
- set: 给属性提供 setter 方法，主要用于设置属性值， 默认为 undefined

属性的描述对象可以在`Object.defineProperty(object, name, descriptor)`中 **定义/修改**

```js
var obj = {};
Object.defintProperty(obj, "name", {
  value: "zhangsan"
});
console.log(obj); // {name: 'zhangsan'}
```

也可以使用`Object.defineProperties(object, properties)`中同时 **定义/修改** 多个属性

```js
var obj = {};
Object.defintProperties(obj, {
  name: {
    value: "zhangsan"
  },
  weight: {
    value: "90kg"
  }
});
console.log(obj); // {name: 'zhangsan', weight: '90kg'}
```

相反的，可以通过`Object.getOwnPropertyDescriptor(object, name)`来获取单个属性的描述对象，或者通过`Object.getOwnPropertyDescriptors(obj)`来同时获取所有属性的描述对象

`Object.defineProperty(object, name, descriptor)`和`Object.defineProperties(object, property)`主要就是为了解决`Object.assign()`不能正确拷贝设置了`getter/setter`的属性[案例看这里](./demo/demo3.html)

## 对象的遍历方式

ES6 中提供了几种新的遍历对象的方式，他们之间也有很大的区别，基本上都围绕着属性 **是否可枚举**、**是否是 symbol 类型**来区分

| 方法                                 | 定义                                                                 |
| ------------------------------------ | -------------------------------------------------------------------- |
| for...in...                          | 遍历对象 **自身和原型链上**的 **可枚举属性**，不包含 Symbol 属性     |
| Object.keys(object)                  | 返回对象 **自身** 的 **可枚举属性**，不包含 Symbol 属性              |
| Object.getOwnPropertyNames(object)   | 返回对象 **自身** 的 所有属性(包含不可枚举属性)， 不包含 Symbol 属性 |
| Object.getOwnPropertySymbols(object) | 返回对象 **自身** 所有的 Symbol 属性                                 |
| Reflect.ownKeys(object)              | 返回对象 **自身** 的所有属性，包含不可枚举的和 Symbol 属性           |

在遍历过程中，遵循以下顺序：

- 找出属性值为数字的，按照升序排列
- 找出属性值为字符串的，按照加入时间排列
- 找出属性值为 Symbol 的，按照加入时间排列

```js
let result = Reflect.ownKeys({
  [Symbol("foo")]: 1,
  [Symbol("add")]: 2,
  b: 2,
  a: 1,
  4: "si",
  3: "san"
});

console.log(result); //[ '3', '4', 'b', 'a', Symbol(foo), Symbol(add) ]
```

## Object.getPrototypeOf(target)与 Object.setPrototypeOf(target, prototype)

这个方法可以获取指定对象的原型链对象

```js
var add = {
  name: "zhangsan"
};
add.prototype.age = 18;
add.prototype.weight = "90kg";

Object.getPropertyOf(add); // {age: 18, weight: '90kg'}
```

相反，可以通过`Object.setPrototypeOf(target, prototype)`来设置一个对象的原型链对象

```js
var add = {
  name: "zhangsan"
};
Object.setPrototypeOf(add, {
  age: 18,
  weight: "90kg"
});

Object.getPropertyOf(add); // {age: 18, weight: '90kg'}
```

## Objet.create(source, propertiesObjet)

这个方法可以创建一个 **新对象**，并且把参数中的 source 设置为新对象的`__proto__`, propertiesObject 中可以定义新对象本身的属性，默认值为 undefined，内容相当于`Object.defineProperties()`方法的第二个参数，否则会抛出一个错误[完整案例](./demo/demo4.html)

```js
var add = {
  name: "zhangsan"
};
let foo = Object.create(add, {
  weight: {
    value: 12
  },
  weight: {
    value: "90kg"
  }
});
Object.getOwnPropertyDescriptors(foo); // {age: 12, weight:'90kg'}
Object.getPrototypeOf(foo); // {name: 'zhangsan'}
```

但是要注意`Object.create()`方法属于浅拷贝，修改参数中 source 时，会影响到返回的新对象，需要谨慎使用[完整代码](./demo5.html)

```js
var add = {
  name: "zhangsan",
  parent: {
    age: 13
  }
};
let foo = Object.create(add);
Object.getPrototypeOf(foo); // {name: 'zhangsan'}

add.name = "lisi";
Object.getPrototypeOf(foo); // {name: 'lisi'}
```

另外，如果通过这个方法给对象本身定义了属性，这些属性的描述对象中`enumerable`的值默认为 false，也就是不可遍历的，在使用的时候一定要小心

```js
var add = Object.create({}, { name: { valye: "zhangsan" } });
Object.keys(add); // []
Object.getOwnPropertyNames(add); // {name: 'zhangsan'}
```

## super

ES6 中除了 this 之外，新增了一个关键字`super`，指向对象的原型对象

```js
var add = {
  name: "zhangsan"
};
var foo = {
  age: 12,
  getName() {
    console.log(super.name);
  }
};
Object.setPrototypeOf(foo, add);
foo.getName(); // "zhangsan"
```

但是要注意：

- super 表示原型对象的时候，只能用在对象的方法中，用在其他地方都会抛出一个错误
- 目前的 JavaScript 引擎仅能识别在 **简写形式** 函数中 super， 其他箭头函数或者 function 都会抛出错误

也就是说在下面这三种形式中使用 super 都会抛出一个错误

```js
var foo = {
    age: super.name
};

var foo = {
    age: ()=>{
        console.log(super.name)
    }
};

var foo = {
    age: function(){
        console.log(super.name)
    }
};
```

特别注意：

> 在对象中使用的 super 关键字，一定要和 class 中的关键字功能区分开，可以参考[es6 中的 class](../es6-class)一文中的 super 部分

在 JavaScript 引擎内部，super 实际上相当于通过`Object.getProtorypeOf()`方法获取了对应的属性或者执行了对应的方法

```js
var add = {
  name: "zhangsan"
};
var foo = {
  age: 12,
  getName() {
    console.log(super.name);
  },
  getName2() {
    console.log(Object.getProtorypeOf(this).name);
  }
};
Object.setPrototypeOf(foo, add);
foo.getName(); // "zhangsan"
foo.getName2(); // "zhangsan"
```

上面案例中，可以看出两者的结果是一致的

## Object.keys(),Object.values(),Object.entries()

ES6 引入了这三个新的方法用来获取对象的键名列表、值列表、键值对列表，都返回一个数组对象，并且都只能获取对象自身的可枚举属性(不包含 Symbol 属性)

```js
require("babel-polyfill");
var obj = {
  b: "b",
  a: "a",
  5: 5,
  4: 4
};
Object.keys(obj); //["4", "5", "b", "a"]

Object.values(obj); //["4", "5", "b", "a"]

Object.entries(obj); //[["4", 4], ["5", 5], ["b", "b"], ["a": "a"]
```

## 对象中的扩展运算符

ES2016 中引入了数组的扩展运算符，为数组的解构赋值提供了新的方法，ES2018 中也为对象引入了扩展运算符

1.等号左边的扩展运算符，会把没有解构赋值的属性全部集合在一起

```js
var add = {
  x: 1,
  y: 2,
  z: 3
};
var { x, ...foo } = add;
console.log(foo); // {y:2, z:3}
```

在等号左边的扩展运算符，必须放在最后一位，否则会抛出错误

2.等号右边的扩展运算符，相当于`Object.assign()`操作，会把指定的对象扩展开来后进行赋值

```js
var add = {
  x: 1,
  y: 2,
  z: 3
};
var foo = { ...add };
console.log(foo); // {x: 1, y: 2, z: 3}
```

如果等号右边的扩展运算符不在最后一位，且后面定义了一些同名属性，会覆盖前面的属性值，这一点和`Object.assign()`是保持一致的

```js
var add = {
  x: 1,
  y: 2,
  z: 3
};
var foo = { ...add, x: 4 };
console.log(foo); // {x: 4, y: 2, z: 3}
```

等号右边的扩展运算符也属于浅拷贝，如果属性的值是一个复合对象，修改了 source 对象后，也会影响到新的对象

```js
var add = {
  z: 3,
  m: {
    name: "zhangsan"
  }
};
var foo = { ...add, x: 4 };
console.log(foo); // { z: 3, m: {name: 'zhangsan'} }

add.m.name = "lisi";
console.log(foo); // { z: 3, m: {name: 'lisi'} }
```

等号右边的扩展运算符，如果对象是 undefined 或者 null，会被忽略掉，不会抛出错误。

```js
var foo = { ...undefined };
var egg = { ...null };
```

等号右边的扩展运算符和`Object.assign()`一样，不能复制`getter\setter`的属性，会对属性自动取值

```js
var add = {
  get name() {
    return "zhangsan";
  }
};
var foo = {
  ...add
};
console.log(Object.getOwnPropertyDescriptors(foo));
/*
  {
    name: {
      value: "zhangsan",
      enumerable: true,
      configurable: true,
      writable: true
    }
  }
*/
```

如果想弥补这个不足可以用下面的方式代替：

```js
var add = {
  get name() {
    return "zhangsan";
  }
};
var foo = {
  ...Object.getOwnPropertyDescriptors(add)
};
console.log(Object.getOwnPropertyDescriptors(foo));
/*
  {
    name: {
      enumerable: true,
      configurable: true,
      set: undefined,
      get: function(){...}
    }
  }
*/
```
