# es6 class2

## Class 中定义的方法和属性

Class 的所有方法(除了 constructor)都定义在他的 prototype 属性上

通过 new Class 创建的实例的属性，除非是显式定义在其本身(即 this)上，否则都是定义在原型(即 class)上

```js
class Foo {
  constructor(x, y) {
    this.x = x;
    this.y = y; //这里通过this定义的就是显式定义
  }
  toString() {
    code; //这个toString方法都是定义在class上，而不是生成的实例上
  }
}
var f = new Foo(1, 2);
```

一个类必须具有 constructor 方法，如果没有显式定义，会被默认添加一个空的 constructor 方法

constructor 方法默认返回实例对象(即 this),也可以重新指定返回另一个对象

```js
class Foo {
  constructor() {
    return Obj.create(null);
  }
}
new Foo() instanceof Foo; // false
```

class 内部定义的所有方法都是 **不可枚举** 的(enumerable)，、ES5 中通过 prototype 定义的方法，默认是可枚举的

```js
    //class内部定义的属性
    class Foo{
        constructor(){}
        toString(){}
        dev()
    }
    Object.keys(Foo.prototype)                    //[],返回指定对象的所有可枚举属性
    Object.getOwnPropertyNames(Foo.prototype)
    //['constructor','toString']， 返回指定对象自身的所有属性，包含不可枚举属性

    //ES5prototype定义的属性
    function add(){}
    add.prototype.toString = function(){}
    Object.keys(add.prototype)                    //['toString']
    Object.getOwnPropertyNames(add.prototype)     //['constructor','toString']
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
}('张三');
person.getName(); //Myclass
```

## 变量提升

class 中不存在变量提升，因此 class 实例的生成必须写在 class 声明最后，否则会提示语法错误

## 严格模式

ES6 中的类和模块默认使用严格模式，因此不需要使用 use strict 关键字来指定运行模式

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

注意： 通过 class 创建的子类的`__proto__`指向他的父类，子类的 prototype 的`__proto__`指向他的父类的 prototype

```js
class a {}
class b extends a {}
b.__proto__ === a; //true
b.prototype.__proto__ === a.prototype; //true
```

理论上，extends 可以继承多种类型的值，包含 Obejct，Function 等

如果一个 class 属于基类，也就是说不存在继承关系，是一个普通函数的时候，那么他的**proto**属性依然指向 Function.prototype

```js
class A {}
A.__proto__ === Function.prototype; //true
A.prototype.__proto__ === Object.prototype; //true
```

有一个特殊的例子是，当一个 class 继承自 null 的时候，他的**proto**依然指向 Function.prototype

```js
class A extends null {}
A.__proto__ === Function.prototype; //true
A.prototype.__proto__ === undefined; //true
```

## 与 prototype 有关的 Object 方法

Object.getPrototypeOf(子类)： 获取指定子类的父类

```js
class a {}
class b extends a {}
Object.getPrototypeOf(b); //a
```

## super

先来理解 super 是干啥的，super 指向父类的实例，子类继承父类的时候，需要在 constructor 中调用一次 super 的， 就相当于调用了父类的 constructor 方法，目的是为了把 this 继承进来

```js
class a {
  constructor(a, b) {
    this.x = a;
    this.y = b;
  }
}
class b extends a {
  constructor() {
    super(2, 3);
  }
}
new b().x; //2
new b().y; //3
```

class 中支持直接使用 super 来调用父类中的方法，super 关键字代表父类的实例

```js
class a {
  getName() {
    return 1;
  }
}
class b extends a {
  say() {
    console.log(super.getName());
  }
}
new b().say(); // 1
```

## 原生构造函数的继承

ES5 中不允许继承原生构造函数，因为不管是 apply 还是 call 都无法获取原生构造函数的内部属性,ES6 的出现允许了创建一个继承自原生构造函数的类

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

## class 的静态方法

如果 class 的方法前面添加了 static 关键字，就说明这个方法是一个静态方法

静态方法不能被实例继承，但可以在子类中用 super 调用，也可以通过类名直接调用

```js
class Foo {
  static add() {
    return 1;
  }
}
class Dev extends Foo {
  static get() {
    return super.add(); //直接通过super调用父类中的静态方法
  }
}
Dev.get(); // 1， 通过类名直接调用类中的静态方法
```

## class 中的静态属性

ES6 规定 class 内部只有静态方法，没有静态属性，ES7 中会有相关的提案，

ES7 中提供的实例属性方法如下：

```js
class Foo {
  x = 1;
  constructor() {
    console.log(this.x);
  }
}
```

静态属性的写法：

```js
class Foo {
  static x = 1;
  constructor() {
    console.log(this.x);
  }
}
```

## new.target 属性

这个属性可以确定构造函数是怎么调用的，如果不是通过 new 命令调用的，会返回 undefined

```js
function foo(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用new命令生成实例');
  }
}
```

class 内部调用 new.target 的时候，返回当前类， 子类继承父类的时候，new.target 返回子类，可以通过这个属性来创建一些不能独立使用，必须被集继承后才能使用的类

```js
class Foo {
  constructor() {
    console.log(new.target);
    //class内部调用new.target的时候，返回当前类， 子类继承父类的时候，new.target返回子类
    try {
      if (new.target === Foo) throw new Error('该类不能被直接使用');
    } catch (e) {
      console.error(e);
    }
  }
}
class Dev extends Foo {
  constructor() {
    super();
  }
}
var f = new Foo(); //报错
var d = new Dev(); //正确
```

## Mixin 模式的实现

暂未弄懂
