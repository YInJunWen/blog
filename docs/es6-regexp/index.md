# es6 Regexp 的扩展

ES5 声明一个 Regexp 构造函数有两种方法

```js
let reg = new Regexp('hello', 'i');
let reg = new Regexp(/hello/i);
```

其中第一个参数可以是字符串，也可以是一个正则表达式，第二个参数则是 **修饰符**

当次一个参数是正则表达式的时候，是不允许使用第二个参数的，但是 ES6 改变了这个行为，如果第一个参数为正则表达式，且第二个参数存在，第二个参数会覆盖前面正则表达式的修饰符

```js
let reg = new Regexp(/hello/i, 'g'); // 等同于 new Regexp(/hello/g)
```

## u 修饰符

由于 JS 正常情况下只能识别码点小于\u10000 的字符，这里新增了 u 修饰符，用来识别 Unicode 码点大于\uFFFF 的字符

```js
/𠮷/.test('𠮷')  // false
/𠮷/u.test('𠮷')  // true

/^𠮷{2}/.test('𠮷𠮷')  // false
/^𠮷{2}/u.test('𠮷𠮷')  // true
```

经常会需要直接使用 unicode 码点来作为正则表达式，这个时候就需要使用 u 修饰符，才能正确识别正则表达式中的大括号,否则大括号会被识别为一个 **量词**

```js
/\u{61}/.test(a) / // false
  a /
  u.test(a); // true
```
