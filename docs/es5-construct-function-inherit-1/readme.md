<!-- Date: 2017-09-09 21:50:45 -->

# es5 函数继承-构造函数的继承(1)

## 一、从古代说起

要理解 Javascript 的设计思想，必须从它的诞生说起。
1994 年，网景公司（Netscape）发布了 Navigator 浏览器 0.9 版。这是历史上第一个比较成熟的网络浏览器，轰动一时。但是，这个版本的浏览器只能用来浏览，不具备与访问者互动的能力。比如，如果网页上有一栏"用户名"要求填写，浏览器就无法判断访问者是否真的填写了，只有让服务器端判断。如果没有填写，服务器端就返回错误，要求用户重新填写，这太浪费时间和服务器资源了。

因此，网景公司急需一种网页脚本语言，使得浏览器可以与网页互动。工程师 Brendan Eich 负责开发这种新语言。他觉得，没必要设计得很复杂，这种语言只要能够完成一些简单操作就够了，比如判断用户有没有填写表单。

1994 年正是面向对象编程（object-oriented programming）最兴盛的时期，C++是当时最流行的语言，而 Java 语言的 1.0 版即将于第二年推出，Sun 公司正在大肆造势。

Brendan Eich 无疑受到了影响，Javascript 里面所有的数据类型都是对象（object），这一点与 Java 非常相似。但是，他随即就遇到了一个难题，到底要不要设计"继承"机制呢？

## 二、Brendan Eich 的选择

如果真的是一种简易的脚本语言，其实不需要有"继承"机制。但是，Javascript 里面都是对象，必须有一种机制，将所有对象联系起来。所以，Brendan Eich 最后还是设计了"继承"。

但是，他不打算引入"类"（class）的概念，因为一旦有了"类"，Javascript 就是一种完整的面向对象编程语言了，这好像有点太正式了，而且增加了初学者的入门难度。

他考虑到，C++和 Java 语言都使用 new 命令，生成实例。

C++的写法是：

```js
　　ClassName *object = new ClassName(param);
```

Java 的写法是：

```js
　　Foo foo = new Foo();
```

因此，他就把 new 命令引入了 Javascript，用来从原型对象生成一个实例对象。但是，Javascript 没有"类"，怎么来表示原型对象呢？这时，他想到 C++和 Java 使用 new 命令时，都会调用"类"的构造函数（constructor）。他就做了一个简化的设计，在 Javascript 语言中，new 命令后面跟的不是类，而是构造函数。

举例来说，现在有一个叫做 DOG 的构造函数，表示狗对象的原型。

```js
function DOG(name) {
  this.name = name;
}
```

对这个构造函数使用 new，就会生成一个狗对象的实例。

```js
var dogA = new DOG('大毛');
alert(dogA.name); // 大毛
```

注意构造函数中的 this 关键字，它就代表了新创建的实例对象。

## 三、new 运算符的缺点

用构造函数生成实例对象，有一个缺点，那就是无法共享属性和方法。

比如，在 DOG 对象的构造函数中，设置一个实例对象的共有属性 species。

```js
function DOG(name) {
  this.name = name;
  this.species = '犬科';
}
```

然后，生成两个实例对象：

```js
var dogA = new DOG('大毛');
var dogB = new DOG('二毛');
```

这两个对象的 species 属性是独立的，修改其中一个，不会影响到另一个。

```js
dogA.species = '猫科';
alert(dogB.species); // 显示"犬科"，不受dogA的影响
```

每一个实例对象，都有自己的属性和方法的副本。这不仅无法做到数据共享，也是极大的资源浪费。

## 四、prototype 属性的引入

考虑到这一点，Brendan Eich 决定为构造函数设置一个 prototype 属性。这个属性包含一个对象（以下简称"prototype 对象"），所有实例对象需要共享的属性和方法，都放在这个对象里面；那些不需要共享的属性和方法，就放在构造函数里面。

实例对象一旦创建，将自动引用 prototype 对象的属性和方法。也就是说，实例对象的属性和方法，分成两种，一种是本地的，另一种是引用的。

还是以 DOG 构造函数为例，现在用 prototype 属性进行改写：

```js
function DOG(name) {
  this.name = name;
}
DOG.prototype = { species: '犬科' };

var dogA = new DOG('大毛');
var dogB = new DOG('二毛');

alert(dogA.species); // 犬科
alert(dogB.species); // 犬科
```

现在，species 属性放在 prototype 对象里，是两个实例对象共享的。只要修改了 prototype 对象，就会同时影响到两个实例对象。

```js
DOG.prototype.species = '猫科';

alert(dogA.species); // 猫科
alert(dogB.species); // 猫科
```

## 五、总结

* 构造函数本身的属性相当于私有属性，生成的对象实例之间互不影响

* 而构造函数的 prototype 属性上定义的属性，相当于公共属性，生成的对象实例之间互相影响，只要一个被修改，另一个也会被修改

由于所有的实例对象共享同一个 prototype 对象，那么从外界看起来，prototype 对象就好像是实例对象的原型，而实例对象则好像"继承"了 prototype 对象一样。

Javascript 是一种基于对象（object-based）的语言，你遇到的所有东西几乎都是对象。但是，它又不是一种真正的面向对象编程（OOP）语言，因为它的语法中没有 class（类）。

那么，如果我们要把"属性"（property）和"方法"（method），封装成一个对象，甚至要从原型对象生成一个实例对象，我们应该怎么做呢？
