# prototype那些事

函数的原型对象(prototype)属性
-
每个函数都有一个prototype属性，属性值是一个对象。当通过new关键字生成一个对象实例的时候，实例会继承构造器函数的prototype属性中的方法以及属性,这些方法和属性是通过`构造器函数.prototype`来定义的，prototype指向的实际上就是这个方法的`原型`,这个函数被称作是`构造函数`,通过`new`关键字生成的对象被称作是`实例对象`
```
function Person(){
 this.a = 1;
}
Person.prototype.age = 2
console.log(new Person()) // {a: 1}
console.log(new Person().__proto__) // {age: 2}
```

对象的原型(`__proto__`)属性
-
所有的对象都拥有一个`__proto__`属性,这个属性并不是w3c定义的标准属性，而是浏览器的私有属性，chrome和firfox中都可以看到这个属性
```
var zhangsan = {name: 1}
console.log(zhangsan)
{
 a: 1,
 __proto__: Object
}
```
实例的`__proto__`指向该实例构造器函数的prototype属性，也就是说
```
function Person(){
 this.name = 1
}
new Person().__proto === Person.prototype  // true
```
因此我们可以使用`__proto__`来查看实例对象的原型链上都有哪些属性和方法。但由于`__proto__`只是浏览器私有的属性，所以我们可以使用`Object.getPrototypeOf()`方法，来达到相同的目的
```
Object.getPrototypeOf(new Person()) === Person.prototype  // true
```
对象的`__proto__`属性实并不是对象本身的属性，实际上是部署在原始Object对象上的一个getter/setter，可以在`Object.prototype`中看到这个属性

原型对象(prototype)中的的constructor属性
-
每个对象都要一个constructor属性，会指向关联构造函数本身
```
function Person(){
 this.name = 1
}
Person === Person.prototype.constructor
```
在浏览器中输出`new Person()`的时候，总是会看到实例对象的`constructor`属性，实际上实例对象是没有这个属性的，他取的是`Person.prototype.constructor`
```
new Person().constructor === Person.ptototype.constructor  // true
```

原型链
-
实例对象，既可以访问构造函数中的属性和方法，又可以访问构造函数原型中的属性和方法。
```
function add(){
 this.age = 10;
}
add.prototype.name = 'zhangsan'
add.prototype.getName = function(){
 console.log(this.name)
}
var a = new add();
a.age  // 10
a.name  // zhangsan
a.getName()  // zhangsan
```
在浏览器中我们使用`a.__proto__`会发现输出的内容里面除了构造器本身的age属性，还有一个`__proto__`属性，打开这个`__proto__`属性，在里面找到了prototype中定义的name属性和getName方法和另一个`__proto__`属性，这个`__proto__`属性最终指向的是最基础的Object对象，这一个有一个`__proto__`串联起来，并且能让构造函数生成的实例对象可以访问自身的属性和方法，就被称作是原型链

当实例对象在自己的构造函数中没找到需要的属性和对象的时候，就会自动去原型链上查找对应的属性和方法
```
function add(){
 this.name = 'zhangsan'
}
add.prototype.name = 'lisi'
var a = new add();
a.name  // zhangsan
delete a.name
a.name  // lisi
```

继承
-
```
function Add(){
 this.name = 'zhangsan'
}
Add.prototype.print = function(){
 console.log(this.name)
}
function Foo(){
 Add.call(this)
 this.age = 12
}
new Foo() // {name: 'zhangsan', age: 12}
new Foo().print() // print is not a function
```
通过在Foo中执行call方法，我们实现了Foo函数继承了Add函数中的构造器属性和方法，下面继续实现继承Add函数原型中的方法
```
Foo.prototype = Object.create(Add.prototype)
```
> 这里要注意，千万不能忘了使用`Object.create()`方法来创建新的对象，JS里面对象的赋值运算，实际上只是增加了一个对同一个内存地址的指针，也就是说如果你在赋值之后，修改了Add.prototype属性,也会影响到Foo生成的实例对象!

前面说过，对象实例的constructor实际上是从构造函数.prototype.constructor中获取的，现在我们直接把Foo.prototype的值指向了Add.prototype，就导致了new Foo().constructor,指向了`class Add`,因此我们需要手动把这个值改回来
```
Foo.prototype.constructor = Foo
```