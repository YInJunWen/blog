<!-- Date: 2018-06-17 16:11:16 -->

# es6 内置属性-[Symbol.isConcatSpreadable]

这个属性主要用于数组或者类数组在作为 concat 参数的时候，是否展开，数组默认为 true，类数组默认为 undefined，直接设置为 false 和 undefined 的效果是一样的[查看完整案例](./demo1.js)

```js
var a = [1, 2, 3];
var b = { length: 0 };

var c = [].concat(a);
var d = [].concat(b);

c; // [1,2,3]
d; // [{length: 0}]
```

可以通过修改这个属性来改变作为 concat 参数的行为[查看完整案例](./demo2.js)

```js
var a = [1, 2, 3];
a[Symbol.isConcatSpreadable] = true;

var c = [].concat(a);

c; // [[1,2,3,[Symbol.isConcatSpreadable]: false]]

var b = {
  length: 2,
  0: "a",
  1: "b",
  [Symbol.isConcatSpreadable]: true
};

var d = [].concat(b);
console.log(d); // [ 'a', 'b' ]
```

当然了，继承自 Array 的对象默认的`[Symbol.isConcatSpreadable]`属性默认值也是 true[查看完整案例](./demo3.js)

```js
class Egg extends Array {
  constructor(props) {
    super(props);
  }
}
var a = new Egg();

console.log(Object.prototype.toString.call(a)); // [object Array]

a[0] = "a";
a[1] = "b";
a[2] = "c";

console.log([].concat(a));
```

我们可以通过在构造属性或原型链属性上修改`[Symbol.isConcatSpreadable]`，达到禁止展开的目的[查看完整案例](./demo4.js)

```js
class Orange extends Array {
  constructor(props) {
    super(props);
    this[Symbol.isConcatSpreadable] = false;
  }
}
var b = new Orange();

b[0] = "a";
b[1] = "b";
b[2] = "c";

console.log([].concat(b)); // [ Orange [ 'a', 'b', 'c', [Symbol(Symbol.isConcatSpreadable)]: false ] ]

class Pears extends Array {
  constructor(props) {
    super(props);
  }
  get [Symbol.isConcatSpreadable]() {
    return false;
  }
}
var c = new Pears();

c[0] = "a";
c[1] = "b";
c[2] = "c";

console.log([].concat(c)); // [ Pears [ 'a', 'b', 'c' ] ]
```

注意：

1.细心的话可以发现： 上面案例中两次输出结果是不同的，第一次输出中，出现了我们定义的 `[Symbol.isConcatSpreadable]` 属性，是因为我们把这个属性写在了构造属性中，在执行`console.log()`的时候，自动调用的`toString()`方法，会输出所有的实例上的属性，不会输出实例原型链上的属性

2.因为 `[Symbol.isConcatSpreadable]`是一个属性，不是一个方法，因此在原型链中修改的时候，需要使用`getter`函数
