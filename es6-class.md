# es6 中的 class

> ES5 本身没有“类”的概念，为了让有 C 、java 开发习惯的人群能快速学习 javascript，ES6 中添加了`class`的概念，来声明一个构造函数，在 ES6 里面 ，class 只是一个语法糖，而不是真正意义上的类。

下面是一个 class 中常见的用法

```js
class Person {
    // 定义类的实例属性，方法1
    name = "zhangsan";
    // 定义类类的静态属性， 方法1
    static age: 16;
    constructor(klass) {
        // 定义类的实例属性，方法2
        this.klass = klass;
    }
    // 定义静态方法,只能通过类或者子类本身调用，不能通过实例调用
    static foo() {
        console.log("foo");
    }

    // 定义类方法，相当于定义Person.prototype.add = function(){},只能通过实例或者子类的实例调用，不能通过类或者子类本身调用，不需要function关键字，也不需要逗号隔开
    //
    add() {
        console.log("add");
    }
}
// 定义静态属性，方法2
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

## 类方法的声明

```js
class Person {
    construct() {
        this.add = function() {
            console.log("add");
        };
    }
    foo() {
        console.log("foo");
    }
}
```

ES5 中一个对象实例不仅能够调用构造器本身的构造方法，也可以调用构造器原型链上的方法。在 class 中，写在 constructor 方法里面的就属于构造方法，写在外面的就属于原型链上的方法,因此上面的例子等同于

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

## 类的静态方法

ES6 中允许为 class 声明一个静态方法，用过关键字`static`标识

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

## 类的实例属性

从第一个例子中可以看到，有两种定义实例属性的方法，但是方法 1 目前只是个提案，暂时不可使用，只能使用方法 2 来定义实例属性，

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

## 类的静态属性

第一个例子中也展示了两种定义静态属性的方法，同样的，方法 1 只是个提案，暂时只能使用方法 2 来定义一个静态属性

```js
class Person {}
Person.name = "zhangsan";
class Subperson extends Person {}
```

静态属性只能通过类或者子类访问，不能通过类或者子类的实例访问

```js
Person.name; // zhangsan
Subpeson.name; // zhangsan
new Person().name; // undefined
new Subperson().name; // undefined
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
class Person{
	this.name = 'zhangsan'
}
var a = new Person();
var b = new Person();
a.name // zhangsan
b.name // zhangsan
a.name = 'lisi'
a.name // lisi
b.name // lisi

a.__proto__  == b.__proto__ 	// true
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
    if (new.target === Add) {
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
        if (new.target === undefined) {
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

```js
class Add {
    constructor() {
        console.log(this);
    }
}
```

## 特殊的 super

在 class 语法中有一个关键词叫做`super`,super 在 class 中有两种用法，第一种是写在子类的 constructor 函数中，作为函数调用，目的是为了调用父类的构造器函数、传递参数到父类的构造器函数、生成对应的构造器属性和方法，并且拿到父类的 this

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

如果没有在子类的构造函数中调用`super()`方法，或者在使用将会导致生成实例失败，以及找不到`this`对象

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

第二种是`super`作对对象在方法中使用，可以调用父类原型上的方法和属性，拿不到父类的实例属性

```js
class Add {
    constructor() {
        this.age = 10;
        this.getA = function() {
            return "getA";
        };
    }
    getB() {
        return "getB";
    }
}
Add.prototype.height = 180;

class Foo extends Add {
    constructor() {
        super();
        this.name = "zhangsan";
    }
    get a() {
        return super.age;
    }
    get b() {
        return super.height;
    }
    c() {
        return super.getA();
    }
    d() {
        return super.getB();
    }
}
new Foo(); // {name: 'zhangsan', age: 10}
new Foo().a; // udefined
new Foo().b; // 180
new Foo().c(); // .getA is not a function
new Foo().d(); // getB
```

当使用 super 调用父类的方法时，方法内部的 this 指向子类，上面的这个例子可以看出，调用子类实例的 a 方法，会返回子类中的值

```js
class Add {
    constructor() {
        this.name = "zhangsan";
    }
    addA() {
        return this.name;
    }
}
class Foo extends Add {
    constructor() {
        super();
        this.name = "lisi";
    }
    a() {
        return super.addA();
    }
}
new Foo().a(); // lisi
```

但是当 super 在子类的静态方法中使用的时候，super 执行的会是父类的静态方法，而不是父类的原型方法。也就是说 super 在静态方法中指向父类，在普通方法中指向父类的原型

```js
class Add {
    static a() {
        console.log("a in static");
    }
    a() {
        console.log("a in prototype");
    }
}
class Foo extends Add {
    constructor() {
        super();
    }
    static b() {
        super.a(); // a in static
    }
}
```

另外，当在子类中把 super 作为对象使用的时候，所有的赋值运算，改变的都是子类的属性值，所有的取值运算，获取的都是父类的属性值，因此如果在子类中使用 super 关键字赋值，实际上相当于使用 this 赋值

```js
class Add {
    constructor() {
        this.name = "zhangsan";
    }
}
class Foo extends Add {
    constructor() {
        super();
        super.age = 20;
        console.log(super.age); // undefined
        console.log(this.age); // lisi
        super.age = 30;
        console.log(super.age); // undefined
        console.log(this.age); // 30
    }
}
```

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

未完待续...
