# es6 中的 function 扩展

es6 中，新增了允许声明函数参数默认值得属性，例如

```js
funciton add(x=1,y=2){
    console.log([x,y])
}
add() // [1,2]
add(3) // [3,2]
add(3,4) // [3,4]
```

也可以搭配解构赋值来使用,例如

```js
function add({ x = 1, y = 2 }) {
  console.log([x, y]);
}
add({}); // [1,2]
add({ x: 3, y: 4 }); //[3,4]
```

如果参数是一个对象，这个函数在执行的时候，必须传递该参数，哪怕是一个空对象，否则会直接报错

```js
function add({ x = 1, y = 2 }) {
  console.log([x, y]);
}
add(); // Error
```

当然了也可以把整个参数设置一个默认的值，来解决上面的问题

```js
function add({ x = 1, y = 2 } = {}) {
  console.log([x, y]);
}
add();
```

在上面函数执行的时候，由于没有传递参数，第一个参数先使用`{}==undefined`来进行解构赋值，再对`{ x = 1, y = 2 } = {}`进行解构赋值,所以函数的执行结果是`[1,2]`

## 函数的 length 属性

添加了默认值得函数，会影响到函数的 length 属性值，例如

```js
(function add(a, b) {}.length); // 2
(function add(a = 1, b) {}.length); // 0
(function add(a, b = 1) {}.length); // 1
```

从上面的例子中可以看出，对参数使用了默认值的函数，在计算函数的 length 值得时候，第一个使用默认值的参数以及之后的所有参数都 **不再** 计入 length 中

使用了`...rest`参数的函数，也会影响到函数的 length 属性值，例如：

```js
(function(a, b) {}.length); // 2
(function(a, ...b) {}.length); // 1
```

## 作用域

es6 中 let 和 const 的出现，引入了块级作用域，所以在函数中使用变量作为默认值的时候，也会受到“暂时性死区”的影响,例如

```js
let x = 1;
function add(y = x) {
  console.log(y);
}
add(); // 1
```

在函数 add 中，参数 y 的值相当于`let y = x`，因为使用了 let 声明变量，函数存在了一个局部作用域，由于在局部作用域中并没有声明变量 x，所以会自动使用全局变量中的 x，所以 add 函数执行后的结果为`1`

```js
function foo(y = x) {
  console.log(y);
}
foo(); // Error
```

在 foo 函数中，在局部作用域内没有提前声明变量 x，又没在全局中找到变量 x，所以会直接报错

## rest 参数

ES6 中允许在函数中使用 rest 参数，且 rest 参数必须是最后一个参数

```js
functiona add(name, ...other){
  console.log(other)
}
add('zhangsan', 13,'180cm') // [13, '180cm']
```

ES5 中使用的 arguments 属性是一个类数组，需要使用 Array 的 slice 转成一个真正的数组才能使用数组的方法，而 rest 则是一个真正的数组，不需要转换

```js
function add() {
  Array.prototype.slice.call(arguments).map(item => {
    // ...
  });
}
function foo(...values) {
  values.map(item => {
    // ...
  });
}
```

babel 中对`...rest`参数是这样转换的：

```js
// 转换前
}
function foo(name,...value){
    console.log(value)
}
// 转换后
function foo(name) {
    for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        value[_key2 - 1] = arguments[_key2];
    }

    console.log(value);
}
```

## 函数的 name 属性

es5 中如果把匿名函数复制给一个变量，匿名函数的 name 属性会返回一个 **空字符串**， 而 ES6 中会返回这个变量名

```js
// ES5:
let add = function() {};
add.name; // ""

// ES6:
let foo = funciton(){};
foo.name; // "foo"
```

如果是一个具名函数，不管有没有把函数赋值给其他变量，函数的 name 属性始终返回函数本身的名字

```js
function add() {}
add.name; // "add"
let foo = function add() {};
foo.name; // "add"
```
