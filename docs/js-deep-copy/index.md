# js 中的深拷贝与浅拷贝

## 概念

在业务开发中经常会遇到需“从老数组拷贝出一份新数组，且两者互不影响的”的需求，这里记录一下用到的方法。

先说一下什么叫深拷贝与浅拷贝。

大家应该都在电脑中用过“创建快捷方式”的功能吧，假设有一个文件“a.text”，如果我们在这个文件上创建了两个快捷方式，并且分别命名为“b.text"和"c.test"，现在这三个文件，不管通过那个文件打开后修改里面的内容，保存关闭后，打开其他连个文件，会发现文件的内容也跟着变化了，这是因为虽然三个文件的名字不同，但它们指向的文件实际上是同一个，在往深层次说，就是他们指向的内存地址是相同的，所以从三个文件中的任何一个文件打开修改，实际上修改的都是同一份数据，这就是**浅拷贝**

那么，如果我们通过“复制-粘贴”功能，再创建一个新的文件“d.text”呢？我们在"d.text"文件中修改一部分内容，会发现"a.text"文件并没有改变。这是以为虽然通过“复制-粘贴”功能，我们把"a.text"文件的所有内容复制了一份，并且放到了硬盘的另一个区域，这两个区域是互不影响的，这种拷贝的方式就叫做“深拷贝”。

那么在代码中这两种方式是怎么实现的呢？先来看一下 Javascript 中的浅拷贝

```js
let a = { name: 'lily' };
let b = a;
console.log(a); //'lily'
console.log(b); //'lily'
a.name = 'david';
console.log(a); //'david'
console.log(b); //'david'
```

上面的代码中，我们明明只是修改了 a 的 name 属性，b 的 name 属性也跟着变了，这就是一种**浅拷贝**，因为在计算机内存中，a 和 b 对应着相同的内存位置，所以修改了 a，b 就会跟着改变。

再来看看深拷贝

```js
let a = { name: 'lily' };
let b = Object.assign({}, a);
console.log(a); //'lily'
console.log(b); //'lily'
a.name = 'david';
console.log(a); //'david'
console.log(b); //'lily'
```

这次 a 的 name 属性改变了，b 的 name 属性依然是 lily，这就是一种**深拷贝**，因为通过`Object.assign()`方法在计算机中复制了 a 的值，且占用了一部分内存，来作为 b 的值。(**这里有一个坑，后面会讲到**)

数组和对象的拷贝方式，经常会引起开发过程中出现重大的错误，在大多数时候，我们需要的是**深拷贝**而不是**浅拷贝**，下面来说一下在 JavaScript 中进行深拷贝的常用方法

## 常规数组的深拷贝

常规数组，指的是元素为原始数据类型(string,number,boolean,null,undefined)的数组，通常可以利用一下几种方式进行深拷贝

1.遍历函数： for、while、forEach、for...in...、for...of...

```js
// for
let a = [1, 2, 3, 4, 5];
let b = [];
for (i = 0; i < a.length; i++) {
  b.push(a[i]);
}
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// while
let a = [1, 2, 3, 4, 5];
let b = [];
let i = a.length;
while (i--) {
  b.push(a[i]);
}
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// forEach
let a = [1, 2, 3, 4, 5];
let b = [];
a.forEach(item => {
  b.push(item);
});
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// for...in...
let a = [1, 2, 3, 4, 5];
let b = [];
for (let i in a) {
  console.log(i);
  b.push(i);
}
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// for...of...
let a = [1, 2, 3, 4, 5];
let b = [];
for (let i of a) {
  console.log(i);
  b.push(i);
}
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]
```

2.能够返回一个数组，且不会修改源数组的函数： map、filter、slice、concat

```js
// concat
let a = [1, 2, 3, 4, 5];
let b = [].concat(a);
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// map
let a = [1, 2, 3, 4, 5];
let b = a.map(item => {
  return item;
});
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// filter
let a = [1, 2, 3, 4, 5];
let b = a.filter(item => {
  return true;
});
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// slice
let a = [1, 2, 3, 4, 5];
let b = a.slice(0);
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]
```

3.ES6 中新增的方法： ...扩展运算符、Object.values

```js
// ...扩展运算符
let a = [1, 2, 3, 4, 5];
let b = [...a];
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]

// Object.values()
let a = [1, 2, 3, 4, 5];
let b = Object.values(a);
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]
```

4.特殊方法： JSON.parse、JSON.stringify

```js
let a = [1, 2, 3, 4, 5];
let b = JSON.parse(JSON.stringify(a));
a[0] = 8;
console.log(a); //[ 8, 2, 3, 4, 5 ]
console.log(b); //[ 1, 2, 3, 4, 5 ]
```

## 非常规数组的深拷贝

下面的例子就是一个非常规数组，我们用前面的 concat 方法来试一下：

```js
let a = [{ name: 'lily' }];
let b = [].concat(a);
a[0].name = 'david';
console.log(a); //[ { name: 'david' } ]
console.log(b); //[ { name: 'david' } ]
```

发生了什么？在例子中，明明只是修改了 a 数组中的 name 属性，b 数组也跟着变了。这就说明当原数组是一个非常规数组的时候，数组里面的元素依然是**浅拷贝**状态，其实不只是 concat，上面第二类方法中的 slice、map、filter 都是这个结果，那么再来试试第一类方法

```js
let a = [{ name: 'lily' }];
let b = [];
for (i = 0; i < a.length; i++) {
  b.push(a[i]);
}
a[0].name = 'david';
console.log(a); //[ { name: 'david' } ]
console.log(b); //[ { name: 'david' } ]
```

通过尝试，发现第一类的方法也不管用了，数组内的非原始数据类型元素都执行的是浅拷贝，不仅如此，第三类中的方法也是无效的，那么到底该如何让非常规数组**深拷贝**呢？这里也提供两种参考方法

* 在循环中分层进行深拷贝，这里暂不举例
* 使用第四类方法，简单粗暴

```js
let a = [{ name: 'lily' }];
let b = JSON.parse(JSON.stringify(a));
a[0].name = 'david';
console.log(a); //[ { name: 'david' } ]
console.log(b); //[ { name: 'lily' } ]
```

## 简单对象的深拷贝

简单对象的深拷贝，前面举有例子

```js
let a = { name: 'lily' };
let b = Object.assign({}, a);
console.log(a); //'lily'
console.log(b); //'lily'
a.name = 'david';
console.log(a); //'david'
console.log(b); //'lily'
```

## 复杂对象的深拷贝

但是 Object.assign()方法，并不是真正意义上的**深拷贝**，为什么这么说呢

```js
```
