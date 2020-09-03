<!-- Date: 2018-06-25 13:01 -->

# es6 内置属性-[Symbol.unscopables]

这个属性主要用于修改使用 with 关键字后面代码块的上下文。先看一下正常的 with 案例

```js
var egg = {
    name: 'zhangsan',
};
with (egg) {
    console.log(name); //  "张三"
}
```

案例中，通过 with 关键字，egg 被自动设置为大括号中的上下文，所以可以直接使用 name 属性，如果人为设置了`[Symbol.unscopables]`属性呢

```js
var name = 'lisi';
var egg = {
    name: 'zhangsan',
    [Symbol.unscopables]: {
        name: true,
    },
};
with (egg) {
    console.log(name); //  undefined
}
```

上面的案例中，我们手动设置了`[Symbol.unscopables]`属性，并且把其中的 name 设置为 true，意味着在使用 with 语句的时候，后接代码块中的上下文不再包含 name 属性,此时输出 name 就会往上一级作用域中查找，最终输出了全局变量下的 name 属性.

[Symbol.unscopables]属性也可以写成 getter：

```js
var name = 'lisi';
var egg = {
    name: 'zhangsan',
    get [Symbol.unscopables]() {
        return {
            name: true,
        };
    },
};
with (egg) {
    console.log(name); //  undefined
}
```

构造函数中也可以重置这个属性

```js
// 正常情况下的输出：
var name = 'lisi';
function Egg() {
    this.name = 'zhangsan';
}
var eg = new Egg();
with (eg) {
    console.log(name); // "zhangsan"
}

// 设置了unscopables属性的输出：
var name = 'lisi';
function Egg() {
    this.name = 'zhangsan';
    this[Symbol.unscopables] = {
        name: true,
    };
}
var eg = new Egg();
with (eg) {
    console.log(name); // "lisi"
}
```

当然了，设置在构造函数的原型链上也是可以的：

```js
var name = 'lisi';
function Egg() {
    this.name = 'zhangsan';
}
Egg.prototype[Symbol.unscopables] = {
    name: true,
};
var eg = new Egg();
with (eg) {
    console.log(name); // "lisi"
}
```

再来看看使用 class 的例子：

```js
// 定义在构造函数中：
var name = 'lisi';
class Egg {
    constuctor(props) {
        this.name = 'zhangsan';
        this[Symbol.unscopables] = {
            name: true,
        };
    }
}
var eg = new Egg();
with (eg) {
    console.log(name); // "lisi"
}

// 定义在原型链上：
var name = 'lisi';
class Egg {
    constructor(props) {
        this.name = 'zhangsan';
    }
    [Symbol.unscopables]() {
        return {
            name: true,
        };
    }
}
var eg = new Egg();
with (eg) {
    console.log(name); // "lisi"
}
```

最后再来看看定义在构造函数静态属性上的`[Symbol.unscopables]`属性:

```js
var names = 'lisi';
function Egg() {}
Egg.names = 'zhangsan';

with (Egg) {
    console.log(names); // "zhangsan"
}

Egg[Symbol.unscopables] = { names: true };
with (Egg) {
    console.log(names); // "lisi"
}
```

注意：

> 为什么最后一个例子中的变量用了"names"而不是前面的"name"呢？ 每一个函数都默认有一个 name 属性，而且这个 name 属性是不可被重写的，具体的可以参考[es6 - function 函数的扩展](../es6-function)中的 name 属性

干脆再来看看在 class 上定义静态属性的结果吧

```js
// 第一种方式静态属性的方式：

var names = 'lisi';
class Egg {}
Egg.names = 'zhangsan';

with (Egg) {
    console.log(names); // "zhangsan"
}

Egg[Symbol.unscopables] = { names: true };
with (Egg) {
    console.log(names); // "lisi"
}

// 第二种设置静态属性的方式：
var names = 'lisi';
class Egg {
    static get names() {
        return 'zhangsan';
    }
    static get [Symbol.unscopables]() {
        return {
            names: true,
        };
    }
}
with (Egg) {
    console.log(names); // "lisi"ƒ
}
```

> 为什么上面案例中第二种方式都使用了`getter`，这是因为 目前 ES6 规定 class 中 `只有静态方法，没有静态属性`，详细的可以参考[es6 中的 class](../es6-class)文中的《静态属性/方法》部分
