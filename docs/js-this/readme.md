<!-- Date: 2016-10-17 11:23:18 -->

# js 经常变脸的 this

this ，也被称作“执行上下文”， 它的指向算是 JS 中一个难点了，这里统一总结一下

## 浏览器中的顶层 this

> 不在函数中的 this 都可以叫做顶层 this，也可以说是全局作用域中的 this

在浏览器中，顶层 this 指向 windows 对象本身，也就是说，下面两个赋值方法是相同的

```js
var name = 'pear';
this.name = 'orange';
console.log(name); // "orange"
```

说明了什么？

1.  声明的变量 name 相当于`window.name = 'pear'`
2.  通过`this.name`赋值，改变了`window.name`的值

所以代码中两个方法实际上都是作用在 window 上的。

## Node 环境中的顶层 this

Node 环境中的顶层 this 统一指向 undfined，如果在顶层代码中使用了 this，则相当于在 global 添加了属性

```js
var name = 'pear';
this.name = 'orange';
console.log(name); // "pear"
console.log(this.name); // "orange"
console.log(global.name); // "orange"
```

在案例中会发现`this.name`与`name`本身是毫不相干的，分别属于两个对象的不同属性。`name`仅仅是当前代码块中的一个普通变量，而`this.name`实际上相当于给`global`添加一个 name 属性并赋值

> 注意，ES6 中不推荐在顶层代码中使用 this

## 普通函数和立即执行函数中的 this

普通函数中的 this，在浏览器环境中指向全局对象`window`, 在 Node 环境中则指向顶层变量`global`

```js
function add() {
  console.log(this);
}
(function() {
  console.log(this);
})();
```

把这段代码放在浏览器环境中可以看出，都会输出一个 Window 对象

放在 Node 环境则都输出 global 的属性和方法

## 构造函数中的 this

构造函数中的 this 指向构造函数生成的实例对象

```js
function Egg() {
  console.log(this);
}
let egg = new Egg(); // Egg {}
```

## 箭头函数中的 this

由于箭头函数的特殊性，函数中的 this 永远指向函数所在的作用域内的 this，如果箭头函数所在的位置也是一个箭头函数，则会继续向上查找，直到找到 this 为止

```js
function Fruit() {
  this.name = 'orange';
  this.getName = () => {
    console.log(this.name); // "orange"
    return () => {
      return () => {
        return () => {
          console.log(this.name); // "orange"
        };
      };
    };
  };
}
const fruit = new Fruit();
fruit.getName()()()();
```

## 改变函数中的 this

可以通过 bind、call、apply 三个方法改变一个函数中的 this

其中 bind 仅仅修改了函数中的 this 指向，并不会执行函数，返回一个绑定了新 this 的函数，

call 和 apply 在修改 this 指向后会立即执行函数,call 通过传入序列化字符串，来实现向函数传参，apply 通过传入一个数组实现向函数传参。

```js
function add(arg) {
  console.log(this.name);
  console.log(arg);
}
const obj = { name: 'pear' };
let add2 = add.bind(obj);
add2(); // 'pear'

add.call(obj, 10); // 会即执行一次
// 'pear',
// '10',
add.apply(obj, [10]); // 会即执行一次
// 'pear',
// '10',
```
