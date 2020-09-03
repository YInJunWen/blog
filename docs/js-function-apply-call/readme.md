<!-- Date: 2018-08-07 10:24 -->

# js 解读-Function.prototype.apply.call()

今天又有人问我`Function.prototype.apply.call()`是啥意思了，干脆在这里总结一下

首先回忆一下 apply 和 call 的用法:

`apply`和`call`都用于改变函数的执行上下文,并且传递参数(两者传递参数的方式不同, `call`以序列化参数传参，`apply`以数组形式传参)

```js
let egg = { name: 'pear' };
function add(color) {
    return this.name + "'s color is " + color;
}
add.call(egg, 'yellow'); // "paer's color is yellow"˝
add.apply(egg, ['yellow']); // "paer's color is yellow"
```

相当于

```js
function add(color) {
    return this.name + "'s color is " + color;
}
let egg = {
    name: 'pear',
    add,
};
egg.add('yellow'); // "paer's color is yellow"
```

现在来把`Function.prototype.apply.call(target, context, [...argList])`拆分一下:

`Function.prototype.apply`当做一个函数`fn`,

那就是`fn.call(target, context, [...argList])`

相当于`target.fn(context, [...argList])`

通常情况下，我们的`target`都是一个对象，用来设置`call`方法的执行上下文

但是如果我们把`target`设置成一个函数呢？函数时可以执行`apply`方法的。

现在再把 fn 展开`target.apply(context, [...argList])`，你会发现是不是又回到了`apply`的用法。

其中：

`target`是一个函数，

`context`是`target`函数的执行上下文，

`[...argList]`是通过`apply`执行函数的传参内容。

到此`Function.prototype.apply.call(target, context, [...argList])`就解读完毕了

## 扩展

实际上不是非要使用这种格式`Function.prototype.apply.call(target, context, [...argList])`。

我们也可以使用

`Function.prototype.apply.apply(target, [context, [...argList]])`

`Function.prototype.call.call(target, context, ...argList)`

`Function.prototype.call.apply(target, [context, ...argList]])`

```js
function add(color) {
    return this.name + "'s color is " + color;
}
let egg = {
    name: 'pear',
};

Function.prototype.apply.apply(add, [egg, ['red']]); // "pear's color is red"
Function.prototype.apply.apply(add, [egg, ['yellow']]); // "pear's color is red"
Function.prototype.call.apply(add, [egg, ['yellow']]); // "pear's color is red"
Function.prototype.call.call(add, egg, 'yellow'); // "pear's color is red"
```

可以发现这四种写法的结果都是一样的，具体的分解原理和上面是一样的，就不再细说了。
