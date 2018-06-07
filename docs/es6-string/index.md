# es6 字符串的扩展

**基本字符串** 和 **字符串对象** 是两个概念，

```js
let a = '111', //  这叫做基本字符串
let b = new String('2222') // 这叫做字符串对象
```

当 **基本字符串** 调用 String 相关方法的时候，实际上是被 **转换成了字符串对象** 后才执行方法的。

如果使用 eval 分别执行基本字符串和字符串对象，结果是不同的

![](./images/QQ20180601-110818.png)

使用 valueOf 方法，可以把字符串对象转成基本字符串

```js
console.log(eval(s2.valueOf())); // returns the number 4
```

## 字符串的表示方法

| 写法     | 类型                       |
| -------- | -------------------------- |
| 'z'      | 基本字符串                 |
| \z       | 使用了转义字符的基本字符串 |
| \172     | ASCII、Unicode 码点        |
| \x7A     | Latin-1 字符(x 小写)       |
| \uxxxx   | Unicode 第 1 平面的码点    |
| \u{xxxx} | Unicode 第 2-17 平面的码点 |

## String.prototype.length

返回字符串的长度

## String.prototype.charCodeAt(index)

返回字符的 unicode 码位，并转成 10 进制表示，只能返回 0~65535 之间的数值，具体的编码算法可以查看[Unicode 与 ASCII 码的关系](../unicode-ascii/index.md);

```js
let a = '汉';
console.log(a.charCodeAt(0)); // 27721
console.log(a.charCodeAt(1)); // NaN
```

如果遇到一些不在第 1 平面的字符，需要需要加上该字符第二个编码单元。

```js
let b = '𠮷';
console.log(b.charCodeAt(0)); // 55362
console.log(b.charCodeAt(1)); // 57271
```

## String.ptototype.codePointAt(index)

返回 10 进制的 unicode 码位, JS 特别给出一个 codePointAt 方法，用来返回第 1 字符平面之外字符的 unicode 码位

```js
let b = '𠮷';
console.log(b.codePointAt(0)); // 134071  这是10进制的
```

## includes, startsWith, endsWith

ES6 在 ES5 的基础上添加了 includes，startsWith，endsWith 方法，用来判断某个字符串是否包含另一个字符串, 分别返回一个布尔值

现在除了 indexOf 方法之外还可以使用下面的方法了：

```js
let a = 'hello world';

a.indexOf('hello'); // 0
a.includes('hello'); // true
a.startsWith('hello'); // true
a.endsWith('world'); // true
```

## repeat(number)

ES6 引入了字符串重复的方法，该方法传入重复的次数，并返回一个新的字符串

```js
let a = 'foo'.repeat(2); // 'foofoo'
```

当参数为带有小数点的正数时，会先舍去小数点后面的内容

```js
let a = 'foo'.repeat(3.6); // 'foofoofoo'
```

当参数为负数的时候，会直接报错

```js
let a = 'foo'.repeat(-2); // Error
```

当参数为 0~-1 之间的小数是，会当做 0 计算

```js
let a = 'foo'.repeat(2); // ''
```

当参数字符串的时候，会先转成数字再执行重复曹邹

```js
let a = 'foo'.repeat('2'); // 'foofoo'
```

## padStart(number, string), padEnd(number, string)

ES6 引入了字符串自动补全的方法，number 指定字符串应有的长度，string 指定用来补全字符串的内容,该方法不会影响源字符串，返回一个新的字符串

```js
let a = 'xx';
let d = 'xx';
let b = a.padStart(10, 'an');
let c = d.padEnd(10, 'an');

a; // xx
b; // anananaxxx
d; // xx
c; // xxananananananan
```

如果 number 小于或等于源字符串的长度，则返回源字符串

```js
let a = 'hello world';
let b = a.padStart(2, 'zhangsan');

a; // hello world
b; // hello world
```

如果省略了第二个参数，默认会使用空格补全

```js
let a = 'hello';
let b = a.padStart(10);

a; // hello
b; // '     hello'
```
