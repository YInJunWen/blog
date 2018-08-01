<!-- Date: 2017-04-13 03:17:42 -->

# js 柯里化编程

> 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。先来看一个原始案例

```js
function add() {
  return [].slice.call(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

这是一个计算 add 所有参数之和的方法，如何实现柯里化呢？

```js
function add(a) {
  var init = a;
  var fn = function(b) {
    return init + b;
  };
  return fn;
}
```

现在我们可以用`add(1)(2)`来计算 1+2 的值了，但是如果加上了第三个数字`add(1)(2)(3)`呢？浏览器马上就报错了，说`add()()()not a function`，我们需要把第二层以及以后的每一层也能返回一个 function 出来才能实现连续的调用，代码如下:

```js
function add(a){
    var init = a;
    var fn = function(b){
        return add.call(null, b);
    };
    return fn;
}
console.log(add(1)(2)(3)+');
```

现在控制台并没有像我们预设的那样输出`1+2+3`的结果，而是输出了一个函数体的内容

```js
function (b){
        return add.call(null, b);
    }
```

这里牵扯到一个数据转换的问题，具体请看[javascript 的数据转换](http://frontenddev.org/link/conversion-of-tostring-and-the-valueof-javascript-object.html)一文，这里不再详述

```js
function add() {
  var init = [].slice.call(arguments);
  var fn = function() {
    return add.apply(null, init.concat([].slice.call(arguments)));
  };
  fn.toString = function() {
    return init.reduce(function(a, b) {
      return a + b;
    });
  };
  return fn;
}
```

现在我们可以用`add(1)(2)(3)(4)`的形式来计算结果了，当然了上面的代码也同样支持`add(1,2)(3,4)(5)`的用法，因为我们把所有的 arguments 都作为参数传递了进来。这种实现方式就被称为&柯里化&
