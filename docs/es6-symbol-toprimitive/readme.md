<!-- Date: 2018-06-22 00:58:39 -->

# es6 内置属性-[Symbol.toPrimitive]

该属性主要用于修改对象被转成原始值时的行为。比如一个变量为`var obj = {};`;这个变量在不同的运算符中，需要转换为不同的原始值

```js
var obj = {};
console.log("" + obj); // 需要转换成字符串 输出内容："[Object object]"
console.log(+obj); // 需要转换成数字 输出内容：NaN
```

这些转换为原始值的行为，都取决于这个属性，并且是可以更改的。在修改的时候[Symbol.toPrimitive]需要设置成一个函数，并且该函数接收一个参数，参数表示需要转为原始值的类型，类型分为三种：`string, number, default`,分别对应以下三种情况;

- string: 需要转成字符串
- number : 需要转成数字
- default： 可以转成字符串，也可以转成数字

```js
var egg = {
  [Symbol.toPrimitive](hint) {
    console.log(hint);
  }
};
console.log(String(egg)); // "string"
console.log(`${egg}`); // "string"
console.log(+egg); // "number"
console.log(Number(egg)); // "number"
console.log("" + egg); //"default"

console.log(Boolean(egg)); // 注意： 这里并没有调用`[Symbol.toPrimitive]`方法
```

所以在覆盖原有属性的时候，可以根据这三种类型区分处理

```js
var egg = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "string":
        return "str";
      case "number":
        return 1000;
      case "default":
        return "def";
    }
  }
};
console.log(Number(egg)); // 1000
console.log(String(egg)); // "str"
console.log("" + egg); // "def"
```

在构造函数中覆盖该属性的时候，可以定在构造属性、原型链属性、静态属性上，唯一需要注意的是：定义在静态属性上行为对象是构造函数本身，而不是实例对象，具体方法可以参考[es6-symbol 中的[Symbol.unscopables]属性](../es6-symbol-unscopables)中的案例
