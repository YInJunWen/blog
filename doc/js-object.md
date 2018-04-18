# 关于对象那点事儿

## 函数与对象实例的关系

函数的原型是对象

构造函数创建的是一个函数的对象实例

函数本身有 prototype 属性， 指向 `Object{}`

构造函数创建的对象实例也有 prototype 属性， 指向 `函数{}`

## 关于 constructor

看了很多 constructor 的资料没自己在这里总结一下：

```js
function Accommodation() {}
var newFun = new Accommodation();
```

在上面的代码中：

Accommodation 是一个构造函数， newFn 是 Accommodation 这个构造函数的对象实例
1、 可以使用 constructor 找到对象实例的构造器
2、 使用 instanceof 沿着原型链查询

## 让一个类成为另一个类的子类

先定义两个函数：

```js
function person() {
  this.add = function() {
    console.log("add");
  };
}
function hourse() {}
```

我们先看看连个构造函数被实例化后是什么类型的

```js
console.log(new person()); //person{constructor:...,__proto__:...}
console.log(new hourse()); //hourse{constructor:...,__proto__:...}
console.log(typeof person); //function
console.log(typeof new person()); //object
```

new 方法会创建一个该构造函数的对象实例， 该对象实例的构造器是这个构造函数， 这个对象实例本身是一个对象类型 ** （这句话要细细品味） **

```js
console.log(person.prototype); //Object
console.log(hourse.prototype); //Object
```

函数的 prototype 方法输出的是该函数所有属性和方法组成的对象， 这个对象构造器是这个函数本身

```js
console.log(person.prototype.constructor); // person
console.log(hourse.prototype.constructor); // hourse
```

我们要让 hourse 成为 person 的子类， 需要把 person 的属性以及方法都赋予 hourse， 要获取到 person 的所有属性及方法， 可以用 new person() 获取 person 函数的一个对象实例， 该对象实例包含了 person 函数的所有属性及方法， 然后把这个对象实例直接赋予 hourse 的 prototype 即可:

```js
hourse.prototype = new person();
console.log(person.prototype.constructor); // person
console.log(hourse.prototype.constructor); // person
```

这个时候我们发现`hourse.protoype.constructor`的值也变成了 person， 这是由于在赋值的时候， 把 person 的 prototype 中 constructor 属性也继承过来了， 也就是说， 通过`new hourse()` 产生的对象实例的构造器就会变成 function person() {...
}, 这是不对的， 因此要重新设置 new hourse() 实例的构造器， 也就是 hourse 的 prototype 的 constructor 属性值:

```js
hourse.prototype.constructor = hourse;
```

注意这里被复制的是函数的 prototype 里面的 constructor 属性值， 而不是函数本身的 constructor 属性值， 因为 person 和 hourse 函数本身的 constructor 都是 function， 重置这个属性后我们再看一下两个构造器：

```js
console.log(person.constructor); // function function(){code}

console.log(hourse.constructor); // function function(){code}
console.log(person.prototype.constructor); //person
console.log(hourse.prototype.constructor); //hourse
```

子类不需要额外声明就可以使用父类的属性和方法， 这种特性被称为 `封装`, 子类只需要定义那些在父类基础上新增的属性和方法即可。

在构造一个新的子类来继承并扩展一个类的时候， 你可能需要将某个方法替换成一个同名的新方法， 新方法和原方法功能类似， 但对子类做了针对性的改变， 这就叫做 ** `多态` ** , 只需要写一个函数， 并给他一个和原方法相同的方法名即可。 ``

```js
function person() {
  this.dev = function() {
    console.log("dev");
  };
}
person.prototype.add = function() {
  console.log("add");
};
console.log(person.prototype);
```

.prototype 返回的是函数原型链上的方法， 不包含函数内部 this 指定的方法

```js
var newPerson = new person();
console.log(newPerson); // person{}
console.log(newPerson.prototype); // undefined
console.log(newPerson.constructor); // function person(){}
console.log(person.prototype); // object
console.log(person.constructor); // function function(){}
```

以上证明了，

1、 function 对象和对象直接量都有 constructor 属性，

2、 prototype 是 function 对象才有的， 对象直接量是没有这个属性的

3、 函数内部通过 this 定义的方法， 只能通过 `对象实例.fnName`
访问

4、 通过 `构造函数.prototype.name`
定义的原型链上的 方法， 可以通过 `对象实例.name`
或者 `构造函数.prototype.name`
访问

我们再看下面的代码, 先定义另一个函数：

```js
function house() {}
```

让这个函数成为 person 的子类：

```js
house.prototype = new person();
house.prototype.constructor = house;
```

这个时候 house 中就可以访问 person 上的 add() dev() 方法了， 但是有时候我们需要修改或者在原有的方法上添加新的执行内容， 可以使用 call 或者 apply 方法来实现继承： ``

```js
    house.prototype.add = function(){
        //  如果想person中add()方法的执行内容可以添加下面的：
        person.prototype.add.call(this)
        或者：
        new person().add.call(this)
        //  如果想要保留person中的dev()方法，需要执行下面：
        new person().dev.call(this)
    }
```

对象实例有构造函数内部方法， 也有原型链上的方法， 保存在原型链上， 但是可以直接通过 `对象实例.方法`
访问。 构造函数的原型链只有 prototype 声明的方法

## ES5 中的 Object.create() 与 new obj() 方法的区别

先看下面的代码：

```js
function person() {
  this.dev = function() {
    console.log("dev");
  };
}
person.prototype.add = function() {
  console.log("add");
};
var newPerson = new person();
console.log(newPerson);
// person {}
// dev:()
// **proto**: Object
// add:()
// constructor:person()
// **proto**: Object

var newPer = Object.create(new person());
console.log(newPer);
// person {}
// **proto**:person
// dev:()
// **proto**: Object
// add:()
// constructor:person()
// **proto**: Object
```

从上面的代码可以看出通过构造器出来的对象实例直接包含构造函数里通过 this 定义的属性和方法，

通过 Object.create() 方法出来的对象实例， 不会直接包含构造函数里通过 this 定义的属性和方法， 而是放在对象实例的原型链上， 也就是说 Object.create() 实际上是给参数的对象实例创建了一个子类

```

```
