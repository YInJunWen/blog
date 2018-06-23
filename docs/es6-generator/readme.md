# es6 中的 Generator

Generator 是 ES6 新提供的一种异步解决方案，generator 函数有两个明显的特征，1：函数名前面有`*`号，2：函数内部有`yeild`关键字,定义了不同的状态。

```js
function *go(){
	yeild 1;
	yeild 2;
	return 3;
}
```

## yield 表达式

既然叫做表达式，那么 yield 后面可以跟任何一个表达式语句，比如

```js
function* go() {
    yield 1 + 2;
    yield false || 3;
    yield "hello" + " world";
}

var foo = go();
foo.next(); // {value: 3, done: false}
foo.next(); // {value: 3, done: false}
foo.next(); // {value: 'hello world, done: true}
```

## 遍历器对象的 next 方法

generator 函数执行或会返回一个遍历器对象，遍历器对象包含了`next,return,throw`三个主要的遍历器方法

> generator 函数的用法和普通函数调用方式是一样的，只是调用函数，不会输出任何内容，仅仅是返回一个遍历器对象，我们先试一下遍历器对象的 next 方法

```
var foo = go();
foo.next(); 	// {value: 1, done: false}
foo.next(); 	// {value: 2, done: false}
foo.next(); 	// {value: 3, done: true}
foo.next(); 	// {value: undefined, done: true}
```

可以发现。遍历器的 next 方法，会返回一个包含了 value 和 done 属性的对象，value 是 yeild 表达式后面的值，而 done 保存了遍历器对象的状态。来表示是否遍历完成。我们也可以把这种返回每个状态对应的结果的案例称作“状态机”.

> next 方法，只会执行到对应 yield 表达式的结束，不会对整个 yield 表达式赋值

```js
function* go(){
	yeild 1;
	console.log(2)
}
var foo = fo();
foo.next()  // 执行之后并没有任何输出
foo.next()  // 2， 这一句执行之后才调用了console.log()方法
```

> next 方法的参数，会成为上一个 yield 表达式的返回值

```js
function* go() {
    var a = yield 3;
    console.log(a);
}
var foo = go();
var k = foo.next(); //
console.log(k); // {value: 3,done: false}

var j = foo.next(5); // 5, 这里的5就是a的值, next方法执行后，才会对变量a赋值，并执行上一个yield语句后面的方法
console.log(j); // {value: undefined, done: true}
```

> 当有 generator 函数内部有 return 语句的时候，会把 return 的值，当做一个新状态的 value 值返回出去，并且会把此时的状态设置为遍历状态设置为 true，如果碰到了 return 语句，遍历器对象会中断遍历

```js
function* go() {
    yield 1;
    return 2;
    yield 3;
}
var foo = go();
foo.next(); // {value: 1, done: false}
foo.next(); // {value: 2, done: true}
foo.next(); // {value: undefiend, done: true} 由于碰到了return语句，就获取不到后面的yield值了
```

通过一个案例来整体看一下 generator 的执行顺序

```js
function* go() {
    var a = yield 1;
    console.log(a);
    var b = yield 2;
    console.log(b);
    return 3;
}
var foo = go();

var m = foo.next();
console.log(m);

var n = foo.next(5);
console.log(n);

var k = foo.next(6);
console.log(k);

var j = foo.next(6);
console.log(j);
```

直接在 chrome 控制台中,在第一个 next 方法处打断点，看一下他的输出顺序如下

```js
{vlaue: 1, done: false}  		// 这是调用第一个next方法后，第二个next方法之前输出的比变量 m：
5  								// 这是调用第二个next之后，才开始执行输出变量 a
{value: 2, done: false}  		// 这个是调用第三个next之前输出的变量 n
6  								// 调用第三个next之后，执行输出变量 b
{value: 3, done: true}  		// 调用第四个next之前输出的变量 k
{value: undefined, done: true}  //调用第四个next之后，输出的变量j
```

## 遍历器对象的 throw 方法

> `遍历器对象`的 throw 方法，可以用来在函数体外抛出一个错误，被函数体内的 catch 捕捉。和 throw 命令一样，它的参数会传递给 catch 语句

```js
function* go() {
    try {
        yield 3;
    } catch (e) {
        console.log(e); //  a
    }
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 3, done: false}
foo.throw("a");
```

> 如果函数内部没有部署`try...catch...`语句，`throw方法`抛出的错误会被函数体外捕获

```js
function* go() {
    yield 3;
    yield 4;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 3, done: false}
try {
    foo.throw("a");
} catch (e) {
    console.log(e); // a ，由于函数内部没有部署`try..catch`语句，所以会被这里捕获到抛出的错误
}
console.log(n);
```

> 如果函数体内和函数体外都没有部署`try...catch`语句，`throw方法`抛出的错误将会暴露给执行环境，并且终止执行

```js
function* go() {
    yield 3;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 3, done: false}
foo.throw();
console.log("不会执行这一句"); // 由于抛出的错误没有捕获语句接收，这里不会输出任何东西
```

> throw 方法执行的时候，会附带执行一次 next 方法

```js
function* go() {
    try {
        yield 3;
    } catch (e) {
        console.log(e);
    }
    yield 4;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 3, done: false}
var n = foo.throw("a");
console.log(n); // {value: 4, done: false}
var k = foo.next();
console.log(k); // {value: undefined, done: true}
```

> 那么也可以函数体外抛出的错误被函数体内捕获，函数体内抛出的错误，被函数体外捕获

```js
function* go() {
    try {
        yield 3;
    } catch (e) {
        console.log(e); //  throw 方法 抛出的错误
    }
    throw new Error("throw 命令 抛出的错误");
    yield 4;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 3, done: false}
try {
    var n = foo.throw("throw 方法 抛出的错误");
    console.log(n); //  不会执行，因为throw抛出了错误，将进入catch语句
} catch (e) {
    console.log(e); // throw 命令 抛出的错误
}

//  执行结果
//  {value: 3, done: false}
//  {value: 3, done: false}
//  Error: throw 命令 抛出的错误
```

> 函数体内的`throw命令`抛出的错误，如果没有在函数体内被捕获，遍历器会终止，并且在下一次 next 方法后返回一个 value 为 undefined，done 为 true 的对象

```js
function* go() {
    yield 3;
    throw new Error("没有捕获事件接收的throw命令抛出的错误");
    yield 4;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 3, done: false}
try {
    var n = foo.next();
} catch (e) {
    console.log(e); //  Error: 没有捕获事件接收的throw命令抛出的错误
}
console.log(n); // 由于第二次next方法调用的时候，抛出了一个错误，所以这里的变量 n 不会被赋值，所以它的值就是undefined
var k = foo.next();
console.log(k); // {value: undefined, done: true}
```

## 遍历器的 return 方法

> 当调用了遍历器的 return 方法，可以返回 return 方法带过去的参数作为 value 的值，且 done 的状态为 true 的对象。并且终止遍历, 如果 return 方法没有传递参数进去，返回的对象中 value 值为`undefiend`

```js
function* go() {
    yield 1;
    yield 2;
    yield 3;
}
var foo = go();
foo.next(); // {value: 1; done: false}
foo.return("4"); // {value: 4; done: true}  如果么有传递参数，这里的value应该为undefined
foo.next(); // {value: undefined; done: true}
```

> 如果函数体内有 finally 语句，return 方法会等到 fially 语句执行完再执行

```js
function* go() {
    yield 1;
    try {
        yield 2;
    } finally {
        yield 3;
    }
    yield 4;
}
var foo = go();
foo.next(); // {value: 1; done: false}
foo.return(5); // {value: 2; done: false}
foo.next(); // {value: 3; done: false}
foo.next(); // {value: 5; done: true}
foo.next(); // {value: undefined; done: false}
```

## 遍历 generator 函数生成的遍历器对象

ES6 专门提供了一个新的遍历对象属性的方法:`for...of...`， 可以通过这个语句来循环输出 generator 函数生成的遍历器对象

```js
function* go(){
	yield 1;
	yield 2;
	yield 3;
}
var foo = go();
for(item iof foo){
	console.log(item)
}

// 结果
// 1
// 2
// 3
```

可以看出，`for..of...`循环，会直接输出 next 方法返回值中的 value 属性

## Generator 函数与 Iterator

Iterator 为不同的数据对象提供了一种新的访问机制，用来提供遍历的方法。当碰到返回对象的 done 属性为 true 的时候，就会停止遍历。所以我们完全可以用 Genrator 函数来为对象布置一个遍历器方法。

```js
var obj = {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
};
for (item of obj) {
    console.log(item);
}

//  结果
// 1
// 2
// 3
```

对 obj 对象设置了一个遍历器接口之后，我们就可以在`obj`对象上使用扩展运算符`...`了

```js
var a = [...obj, 4, 5, 6];
console.log(a); //  [1, 2, 3, 4, 5, 6]
```

## generator 函数的嵌套

> yield 表达式，同样可以包含另一个遍历器对象，例如：

```js
function* out() {
    yield 1;
    yield 2;
}
function* go() {
    yield* out();
    yield 3;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: 1, done: false}
var n = foo.next();
console.log(n); // {value: 1, done: false}
var k = foo.next();
console.log(k); // {value: 1, done: false}
```

> 如果 yield 后面没有加`*`星号，则会直接返回一个遍历器对象

```js
function* out() {
    yield 1;
    yield 2;
}
function* go() {
    yield* out();
    yield 3;
}
var foo = go();
var m = foo.next();
console.log(m); // {value: out, done: false}
var n = foo.next();
console.log(n); // {value: 3, done: false}
var k = foo.next();
console.log(k); // {value: undefined, done: true}
```

> 所有的具有 iterator 接口的对象都可以使用`yield*`来遍历

```js
function* go() {
    yield "zhang";
    yield* "zhang";
}
var foo = go();
foo.next(); // {value: 'zhang', done: false}
foo.next(); // {value: 'z', done: false}
foo.next(); // {value: 'h', done: false}
foo.next(); // {value: 'a', done: false}
foo.next(); // {value: 'n', done: false}
foo.next(); // {value: 'g', done: false}

function* go() {
    yield [1, 2, 3];
    yield* [1, 2, 3];
}
var foo = go();
foo.next(); // {value: [1,2,3], done: false}
foo.next(); // {value: 1, done: false}
foo.next(); // {value: 2, done: false}
foo.next(); // {value: 3, done: false}
```

这说明,如果 yield 后面跟了一个遍历器对象，会执行了类似于`for...of...`循环的方法，先进入那个表达式中执行遍历

> 当 generator 函数中有 return`命令`的时候，会把 return 的值赋给`yield*`语句的返回值

```js
function* out() {
    return 10;
}
function* go() {
    var a = yield* out();
    console.log(a);
    return 1;
}
var foo = go();
var m = foo.next();
console.log(m);

//  执行结果
// 10
// {value: 1, done: true}
```
