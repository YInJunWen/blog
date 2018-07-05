# es6 - class

> ES5 本身没有“类”的概念，为了让有 C 、java 开发习惯的人群能快速学习 javascript，ES6 中添加了`class`的概念，来声明一个构造函数，在 ES6 里面 ，class 只是一个语法糖，而不是真正意义上的类。

一个类必须具有 constructor 方法，如果没有显式定义，会被默认添加一个空的 constructor 方法

constructor 方法默认返回实例对象(即 this),也可以重新指定返回另一个对象

## Class 中定义的方法和属性

首先来明确一下和构造函数有关的几种不同类型的方法

- 静态属性/方法: 只能被构造函数本身调用
- 构造器属性/方法：只能被构造函数的实例调用
- 原型链属性/方法: 只能被构造函数的实例调用

下面是一个 class 中常见的用法

```js
class Person {
  constructor(klass) {
    // 定义一个构造器属性
    this.klass = klass;
  }

  // 定义一个原型链属性，方法1
  name = "zhangsan";
  // 定义一个原型链方法，相当于定义Person.prototype.add = function(){}
  // 不需要function关键字，也不需要逗号隔开
  add() {
    console.log("add");
  }

  // 定义一个静态属性， 目前ES6不支持，可通过一个getter函数模拟实现
  static age: 16;
  // 定义一个静态方法,只能通过类或者子类本身调用，不能通过实例调用
  static foo() {
    console.log("foo");
  }
}
// 定义一个静态属性，方法2
Person.height = 180;

class Subperson extends Person {
  subAdd() {
    super.add();
  }
}

let lily = new Person("3");
let lilei = new Subperson("4");
console.log(lily); // {klass:3}
console.log(Person.height); // 180
console.log(Subperson.height); // 180
console.log(lily.height); // undefined
console.log(lilei.height); // undefined
console.log("------");
Person.foo(); //  foo
Subperson.foo(); //  foo
lily.foo(); // TypeError: lily.foo is not a function
lilei.foo(); // TypeError: lilei.foo is not a function
console.log("------");
Person.add(); // TypeError: Person.add is not a function
Subperson.add(); // TypeError: Subperson.add is not a function
lily.add(); // add
lilei.add(); // add
```

## 类的实例可用的属性/方法

```js
class Person {
  constructor() {
    //   这个方法会被保存在构造器方法中，只可以被实例调用
    this.add = function() {
      console.log("add");
    };
  }
  //   这个方法会被保存在Person的原型链中，只可以被实例调用
  foo() {
    console.log("foo");
  }
}
```

ES5 中一个对象实例不仅能够调用构造器本身的构造方法，也可以调用构造器原型链上的方法。在 class 中，写在 constructor 方法里面的就属于 **构造器属性**，写在外面的就属于 **原型链属性/方法**,因此上面的例子等同于

```js
function Person() {
  this.add = function() {
    console.log("add");
  };
}
Person.prototype.foo = function() {
  console.log("foo");
};
```

类方法只能通过类或者子类的实例调用，不能通过类本身调用

```js
Person.add(); // TypeError: Person.add is not a function
Subperson.add(); // TypeError: Subperson.add is not a function
new Person().add(); // add
new Subperson().add(); // add
```

通过`name='zhangsan`定义 **原型链属性**的方式暂时不可使用，只能通过在 constructor 中以及 prototype 的方式定义某个通过 **实例** 访问的属性/方法

```js
class Person {
  constructor() {
    this.name = "zhangan";
  }
}
class Subperson extends Person {}
```

实例属性同样`只能通过类或者子类的实例访问，不能通过类本身访问`

```js
Person.name; // undefined
Subpeson.name; // undefined
new Person().name; // zhangsan
new Subperson().name; // zhangsan
```

## 类本身可用的静态属性/方法

ES6 中允许为 class 声明一个静态方法，通过关键字`static`标识

```js
class Person {
  static foo() {
    console.log("foo");
  }
}
class Subperson extends Person {}
```

该静态方法，只能通过类或者子类本身调用，不能通过实例调用

```js
Person.foo(); // foo
Subperson.foo(); // foo
new Person().foo(); // TypeError: new Person().foo is not a function
new Subperson.foo(); // TypeError: new Suberson().foo is not a function
```

如果想在 class 中定义一个静态属性，目前只能通过`getter`函数实现或者通过以下方式：

```js
class Person {}
Person.name = "zhangsan";
class Subperson extends Person {}
```

> 通过 static 在 class 中声明一个静态属性目前只是一个提案，还不能使用

静态属性只能通过类或者子类访问，不能通过类或者子类的实例访问

```js
Person.name; // zhangsan
Subpeson.name; // zhangsan
new Person().name; // undefined
new Subperson().name; // undefined
```

## 原型链属性的不可枚举属性

ES6 规定 class 定义的 **原型链属性/方法**都是 **不可枚举** 的(enumerable)，而 ES5 中通过 prototype 定义的方法，默认是可枚举的

```js
//class内部定义的属性
class Foo {
  constructor() {}
  dev() {}
}
Object.keys(Foo.prototype); // [], 返回指定对象自身的所有可枚举属性
Object.getOwnPropertyNames(Foo.prototype);
//['constructor','dev']， 返回指定对象自身的所有属性，包含不可枚举属性

//ES5 prototype定义的属性
function add() {}
add.prototype.toString = function() {};
Object.keys(add.prototype); //['toString']
Object.getOwnPropertyNames(add.prototype); //['constructor','toString']
```

## 不存在变量提升

class 实际上也是一种变量声明的方式，使用了 class 的地方，会默认使用严格模式，所以不会出现变量提升的情况，也即是说，如果在声明类之前，使用了实例化该类或者调用了类本身的方法都会报错

```js
let lily = new Person(); // Person is not defined
class Person {}
```

## 类的 constructor

正常情况下，类的 constructor 方法，默认返回`实例对象`

```js
class Person {
  construct() {}
}
new Person() instanceof Person; // true
```

如果人为设置了类的 constructor 返回值，可能导致生成的对象不是类的实例。

案例 1：

```js
class Foo {
  constructor() {
    return Obj.create(null);
  }
}
new Foo() instanceof Foo; // false
```

案例 2：

```js
class Name {
  constructor() {
    this.name = "zhangsan";
  }
}
class Person {
  constructor() {
    this.name = "lisi";
    return new Name();
  }
}
new Person() instanceof Person; // false
new Person() instanceof Name; // true
```

这个时候我们输出一下 Person 的对象，会发现实例对象里面的属性已经是 Name 构造器函数的属性了

```js
new Person(); // {name: 'zhangsan'}
```

## 类的实例

生成类的实例也是通过`new`关键字,并且类的所有实例共享同一个原型对象

```js
class Person {
  constructor() {
    this.name = "zhangsan";
  }
}
var a = new Person();
var b = new Person();
a.name; // zhangsan
b.name; // zhangsan
a.name = "lisi";
a.name; // lisi
b.name; // lisi

a.__proto__ == b.__proto__; // true
```

## new.target

ES6 中引入了一个 new.target 属性，这个属性返回`new`关键字后面的构造器函数，如果函数不是通过`new`调用的，`new.target`会返回 undefined。我们可以通过这个属性来保证函数必须通过 new 关键字来调用；

```js
function Add(name) {
  if (new.target === undefined) {
    throw new Erro("请用new命令生成实例");
    return false;
  }
  this.name = name;
  console.log(name);
}
function Add(name) {
  if (new.target !== Add) {
    throw new Error("请用new命令生成实例");
    return false;
  }
  this.name = name;
  console.log(name);
}
var a = new Add("zhangsan"); // 不会报错
Add.call(null, "lisi"); // 会报错
```

new.target 在子类中使用，会返回子类的构造函数，可以利用这点来确保开发过程中，避免使用父类生成实例对象。

```js
class Add {
  constructor() {
    if (new.target === Add) {
      throw new Error("不能使用父类生成实例对象");
    }
  }
}
class Foo extends Add {
  constructor() {
    super();
  }
}
var a = new Foo(); // 不会报错
var a = new Add(); // 会报错
```

## class 中的继承

class 之间通过 extends 实现继承，子类必须在 constructor 中加入 super 方法，否则新建子类的实例会报错，这是因为 class 的继承机制是先创建父类的实例对象 this，在用子类的构造函数修改 this，因此如果不调用 super 方法，就得不到 this 对象

```js
class Foo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Dev extends Foo {
  constructor() {
    super(x, y);
  }
}
```

## 特殊的 super

在 class 语法中有一个关键词叫做`super`,super 在 class 中有两种用法，

- 在子类的 constructor 函数中，作为函数调用，目的是为了调用父类的构造器函数、传递参数到父类的构造器函数、生成对应的构造器属性和方法，并且拿到父类的 this
- 在子类中作为一个对象调用，可以调用父类中的属性和方法

第一种用法：

```js
class Add {
  constructor(age) {
    this.age = age;
  }
}
class Foo extends Add {
  constructor(name, age) {
    super(age);
    this.name = name;
  }
}
var foo = new Foo("zhangsan", 12);

foo; // {name: 'zhangsan', age: 12}
```

如果没有在子类的构造函数中调用`super()`方法，在使用将会导致生成实例失败，以及找不到`this`对象

```js
class Add {
  constructor(age) {
    this.age = age;
  }
}
class Foo extends Add {
  constructor(name, age) {
    this.name = name;
  }
}
var foo = new Foo("zhangsan", 12);
// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

在调用`super`方法之前使用 this，也会报错

```js
class Add {
  constructor(age) {
    this.age = age;
  }
}
class Foo extends Add {
  constructor(name, age) {
    this.name = name;
    super();
  }
}

var foo = new Foo("zhangsan", 12);
// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

在当做对象使用的时候，在子类的构造函数和原型链函数中，super 的赋值运算改变的是子类本身的 **构造器属性/方法**，取值运算(获取属性或执行方法) **只会** 指向父类的 **原型链属性/方法** [源码](./demo/demo1.html)

```js
class Add {
  constructor(props) {
    this.a = () => {
      console.log(" a in constructor");
    };
  }
  a() {
    console.log("a in prop");
  }
}
class Foo extends Add {
  constructor(props) {
    super(props);
    super.b = () => {
      super.a = 1;
      console.log("super.a:", super.a);
      console.log("this.a:", this.a);
    };
  }
  c() {
    super.a = 2;
    console.log("super.a:", super.a);
    console.log("this.a:", this.a);
  }
}
let a = new Add();
let b = new Foo();
b.b();
b.c();
```

上面的例子中，输出的都是

```
super.a: ƒ a() {
        console.log('a in prop')
      }
this.a: 1
```

在子类的构造函数和原型链函数中，通过 super 调用函数，函数中的 this 指向 **子类的实例**，这意味着我们可以通过 this 继续使用子类上的构造器属性/方法和原型链属性/方法, [属性案例](./demo/demo2.html)，[方法案例](./demo/demo3.html)

## class 的 prototype 与`__proto__`

ES5 中每一个对象都有一个原型(`__proto__`)属性，指向它构造函数的原型对象(prototype)中的`__proto__`.

而 class 作为构造函数的语法糖，类本身被定义了两条继承链，同时拥有 prototype 和`__proto__`属性。

其中子类`__proto__`指向父类本身

```js
class A {
  constructor() {
    this.name = "zhangsan";
  }
  getName() {}
}
class B extends A {
  constructor() {
    super();
  }
}
B.__proto__ === A; // true
```

子类的 prototype 的`__proto__`指向父类的 prototype

```js
B.prototype.__proto__ === A.prototype; // true
```

## class 的 name 属性

Class 的 name 属性 返回跟在 class 关键字后面的类名，当使用 class 表达式的时候，name 属性返回声明的变量名，而不再是 class 关键字后面的名称，class 后面的名称只可用于 `class内部` 使用，代指当前类

```js
class Foo {} //Foo.name  =  Foo
let DevName = class Dev {
  getClassName() {
    return Dev.name;
  }
};
Dev.name; // DevName 而不是  Dev
let d = new DevName();
d.getClassName; // Dev
Dev.name; //Dev is not defined
```

## 立即执行 class

与 function 一样，我们也可以写出立即执行的 class 实例，这个时候不需要实例化就可以直接使用里面的方法

```js
let person = new class {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(this.name);
  }
}("张三");
person.getName(); //Myclass
```

## Class 的取值函数 getter 和存值函数 setter

class 内部也可以像 ES5 一样使用取值、存值函数

```js
class Foo {
  constructor() {
    this.x = 1;
  }
  get prop() {
    return this.x;
  }
  set prop(v) {
    this.x = v;
  }
}
var f = new Foo();
f.prop; //1
f.prop = 2;
f.prop; //2
```

## class 中的 Generator 函数

class 中的函数前面加一个\*就表示该方法是一个 generator 函数

```js
class Foo {
  *add() {
    yield 1;
    yield 2;
    yield 3;
  }
}
var f = new Foo();
var g = f.add();
for (let i of g) {
  console.log(i);
}
//1
//2
//3
```

未完待续...
