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

## 箭头函数

ES6 推出了新的声明函数的方法：箭头函数`()=>{}`，箭头函数可以代替普通的函数

```js
let add = () => {};
// 相当于
let add = function() {};
```

箭头函数需要记住以下四个特性：

- 箭头函数中是没有 this 的
- 箭头函数中是没有 arguments 属性的，如果需要可以用`...rest`参数代替
- 箭头函数不可以当做构造函数，把箭头函数用作构造函数的时候是会抛出错误的，这也是因为箭头函数本身没有 this 的缘故
- 箭头函数中不可以使用 yield 语句，所以也不能作为 generator 函数，同样是因为箭头函数本身没有 this 的缘故

## 箭头函数中的 this

箭头函数中是没有 this 的，如果使用了 this，则永远指向声明函数时所在作用域内的 this，如果所在作用域依然是个箭头函数，则继续向上查找，直到找到 this 为止， 来看下面两段代码执行结果的区别：

```js
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    foo(function() {
      console.log(this.name);
    });
  },
};
function foo(cb) {
  cb();
}
person.getName(); // 'zhangsan'
```

在上面的代码中，我们需要输入 person 中的`lisi`,结果输出结果却是`zhangsan`这是因为匿名函数的 this 默认指向全局，为了达到目标，通常我们会通过 bind、apply、call 方法来改变匿名函数的上下文：

```js
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    foo(
      function() {
        console.log(this.name);
      }.bind(this)
    );
  },
};
function foo(cb) {
  cb();
}
person.getName(); // 'lisi'
```

箭头函数的出现，让我们省略了这一步：

```js
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    foo(() => {
      console.log(this.name);
    });
  },
};
function foo(cb) {
  cb();
}
person.getName(); // 'lisi'
```

在把匿名函数作为参数传递的时候，使用箭头函数，默认把函数内的 this 指向了函数所在作用域的 this，也就是 person，所以就可以获取到 person.name 的值了。

setTimeout 也是一个可以参考的例子：

```js
// 没有使用箭头函数
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    setTimeout(function() {
      console.log(this.name);
    });
  },
};
person.getName(); // 'zhangsan'
```

```js
// 使用了箭头函数
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    setTimeout(() => {
      console.log(this.name);
    });
  },
};
person.getName(); // 'lisi'
```

再来看一下嵌套的箭头函数执行的结果

```js
var name = 'zhangsan'
var person = {
  name: 'lisi',
  getName: function() {
    foo(() => {
      ()={
        ()=>{
          console.log(this.name)
        }
      }
    });
  },
};
function foo(cb) {
  cb();
}
person.getName()  // 'lisi'
```

这里我们嵌套了三层箭头函数，但最终输出的结果依然是 person 中的 name 属性

## 双冒号运算符

在 ES5 中想要改变一个函数的上下文，一般会通过 bind、call、apply 来实现，新的草案提出了使用双冒号`object::function`来实现同样的效果，比如

```js
var person = {
  name: 'zhangsan',
};
function add() {
  console.log(this.name);
}
person::add; // 相当于add.bind(person);

add(); // 'zhangsan'
```

如果需要传递参数并且直接执行函数，可以直接在后面添加参数

```js
var person = {
  name: 'zhangsan',
};
function add(age) {
  console.log([this.name, age]);
}
person::add([15]);
// 相当于add.apply(person,[15]);  输出结果为： ['zhangsan', 15]
```

注意：

> 带参数的双冒号运算符相当于 `apply`，而 **不是** call，因此在传递参数的时候,参数必须是一个数组，如果参数多的话也可以使用 ...rest 来实现

```js
var person = {
  name: 'zhangsan',
};
function add(...values) {
  console.log([this.name, values]);
}
person::add([15, 30, 40]);
// 相当于add.apply(person,[15,30,40]);  输出结果为： ['zhangsan', [15,30,40]]
```

再看一个案例：

```js
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    console.log(this.name);
  },
};
var log = person.getName;
log(); // "zhangsan"

var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: () => {
    console.log(this.name);
  },
};
var log = person.getName;
log(); // "zhangsan"
```

为什么这里用了箭头函数结果还是`zhangsan`呢，因为我们只是把一个箭头函数赋值给了 **全局作用域** 内的变量`log`，箭头函数中的 this 指向的依然是全局作用域，那么如何让输出结果依然是`lisi`呢，我们会这样做

```js
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    console.log(this.name);
  },
};
var log = person.getName.bind(person);
log();
```

现在结果就是我们想要的`lisi`了，双冒号运算符也可以达到我们的目的：

```js
var name = 'zhangsan';
var person = {
  name: 'lisi',
  getName: function() {
    console.log(this.name);
  },
};
var log = ::person.getName;
// 这里就相当于  var log = person.getName.bind(person);
log();
```

所以

> 当双冒号左边为空，右边为一个指定对象的方法时，相当于为这个方法默认指定了 this，指向方法所在的对象
