# ES5-构造函数基础

先看以下案例

```js
function add(){
        this.x = 1
}
add.prototype = {
    y: 2;
}
var a = new add();
console.log(a)
```

a 的打印结果为

```js
add{
    x: 1,
    __proto__: {
        constructor: function add(){},
        y: 2,
    }
}
```

`function add(){this.x = 1}`是一个**构造函数**

* 通过 new 方法返回的对象叫做**对象实例**，实例内容如上 a 打印出来的内容,

* 每个**函数**都包含一个 prototype 属性，

```js
console.log(add.prototype)

{
    constructor: f add()，
    __proto__: f Object()
}
```

* 每个**函数**的 prototype 属性中都默认包含一个 constructor 属性，指向**函数本身**

```js
add.prototype.constructor === add; //true
```

* 每个**函数**的 prototype 属性中默认包含一个`__proto__`属性，指向 **Object 函数的 prototype**，(这句话先记得就好，深究需要看 javacsript 的设计理念)

```js
add.prototype.__proto__ === Object。protorype // true
```

* prototype 中的所有属性和方法都会被**对象实例**所继承

* 每个**对象实例**，都有一个 constructor 属性，这个属性其实是**生成对象实例的构造函数的 prototype 属性 中的 constructor**属性，指向对象实例的**构造函数本身**

```js
a.constructor === add.prototype.constructor; //true
console.log(a.constructor); // function add(){}
```

* 每个**对象实例**都有一个隐藏的`__proto__`属性，这个属性指向**其构造函数的 prototype 属性**

```js
a.__proto === add.prototype; // true
```

* 构造函数中的**this**指向生成的**对象实例本身**
