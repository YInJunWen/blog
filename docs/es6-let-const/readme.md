<!-- Date: 2018-05-08 17:14 -->

# es6 变量新的声明方式-let-const

es6 中开始提供了新声明变量的方式：let 与 const，其中 let 声明一个变量，const 声明一个常量

这里提起前说一下浏览器环境、node 环境与严格模式的关系，一定要提前记住：

-   浏览器和 node 环境在使用 var 声明的时候，默认是非严格模式
-   浏览器和 node 环境想进入 `严格模式` 都需要使用`"use strict"`关键字。或者在代码中使用 let 或 const 声明
-   使用了 let 和 const 声明的默认为 ES6 语法
-   ES6 默认使用严格模式

## 不再存在变量提升

变量提升，指的是变量可以在声明之前使用，且在赋值之前，变量值为 undefined。先看一下传统 ES5 中出现的案例:

```js
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
a[1](); //  10
```

这个案例中结果为 10，就是因为 i 发生了 `变量提升` ，成为了一个全局变量，每次循环都会修改 i 的值，导致最后输出的结果只能是 10 了

for 循环中就存在一个关系到`变量提升`的重大问题，可以参考[ES5 与 ES6 中的 for 循环](../js-for/index.md)

## 暂时性死区

let 和 const 声明的变量必须在声明之后使用，否则就会报错。这在语法上被称为：暂时性死区。

```js
console.log(a);
let a = '123';
```

上面的句子中就会暴露`ReferenceError: a is not defined`的错误。这个错误会直接导致程序的停止运行，而不是我们常见的输出到控制台就继续下一步了。

有一些死区比较隐蔽，比如：

```js
test(x=y,y=1){
	console.log(x)
}
test()
```

这里也会抛出`ReferenceError: y is not defined`的错误，并且停止执行当前程序,因为我们在赋值给 a 的时候，y 还没有被声明

## let 和 const 的作用域

ES6 规定在 let 和 const 声明变量的地方，都会出现块级作用域，在作用域内已经声明的变量不允许重复声明。比如以下代码在执行的时候都会抛出`Uncaught SyntaxError: Identifier 'a' has already been declared`的错误

```js
function add() {
    let a = 1;
    let a = 2;
}

// 或者
function add(a) {
    // 参数a，实际上相当于 let a;
    let a = 2;
}
```

块级作用域使得外层代码不受内层代码块的影响，且外层无法访问内层声明的变量，也代替了之前广泛使用的为了保留单独作用的立即执行函数表达式,比如：

```js
{
    let a = 1;
    {
        let a = 2;
        let b = 3;
        console.log(a); // 2
    }
    console.log(a); // 1
    console.log(b); // ReferenceError b is not defined
}
```

ES5 中虽然明确规定函数只能在 `顶层作用域** 和 **函数作用域` 中声明，但是几乎所有的浏览器都没有遵循这个规则，

因此 ES6 中明确 `严格模式** 中规定了如果在 **块级作用域** 中声明了函数，**这个声明函数的行为相当于 let`，所以在块级作用域之外是不可以使用的

```js
function add() {
    console.log('outside');
}
function foo() {
    if (true) {
        function add() {
            console.log('inside');
        }
    }
    add();
}
foo();
```

上面代码在非严格模式下，执行的结果是`inside`,严格模式下执行的结果是`outside`

> 这里的严格模式指的是代码前加上 "use strict"语句，可以在 chrome 浏览器中测试

> PS: Node 中如果没有使用 let 和 const，也是需要"use strict"来声明严格模式， 否则会默认进入严格模式

现在把代码改一下

```js
function add() {
    console.log('outside');
}
function foo() {
    if (true) {
        var add = function () {
            console.log('inside');
        };
    }
    add();
}
foo();
```

代码中没有使用严格模式，但是 var 声明的 add 发生了 `变量提升`，导致最终的结果是 inside。 再改一下代码

```js
function add() {
    console.log('outside');
}
function foo() {
    if (true) {
        let add = function () {
            console.log('inside');
        };
    }
    add();
}
foo();
```

这次代码的输出结果是 outside 了，这是因为使用了 let 关键字的时候，浏览器会自动进入严格模式(ES6 的模块自动采用严格模式)。

最后看一个案例

```js
var tmp = '123';
function add() {
    console.log(tmp);
    if (true) {
        var tmp = '456';
    }
}
add(); // undefined
console.log(tmp); // 123

var tmp = '123';
function add() {
    console.log(tmp);
    if (true) {
        let tmp = '456';
    }
}
add(); // 123
console.log(tmp); // 123
```

> 回顾一下 JS 中的作用域： 全局作用域、函数作用域、块作用域
