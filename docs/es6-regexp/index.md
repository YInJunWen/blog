# es6 Regexp 的扩展

ES5 声明一个 Regexp 构造函数有两种方法

```js
let reg = new Regexp("hello", "i");
let reg = new Regexp(/hello/i);
```

其中第一个参数可以是字符串，也可以是一个正则表达式，第二个参数则是 **修饰符**，修饰符在正则表达式对象创建之后，是 **不能修改和删除的**

修饰符列表
|修饰符|作用|
|---|---|
|g|在一行的全局(所有)字符中查找中搜索|
|i|不区分大小写|
|m|在多行中搜索|
|u|区分 unicode 码点大于\uFFFF 的字符|
|y|执行粘性搜索，类似于 g 但是有所不同|
|s|ES2018 引入，修改`.`的匹配模式为：包含换行符在内的所有字符|

当次一个参数是正则表达式的时候，是不允许使用第二个参数的，但是 ES6 改变了这个行为，如果第一个参数为正则表达式，且第二个参数存在，第二个参数会覆盖前面正则表达式的修饰符

```js
let reg = new Regexp(/hello/i, "g"); // 等同于 new Regexp(/hello/g)
```

## u 修饰符

由于 JS 正常情况下只能识别码点小于\u10000 的字符，ES6 新增了 u 修饰符，用来识别 Unicode 码点大于\uFFFF 的字符

```js
/𠮷/.test('𠮷')  // false
/𠮷/u.test('𠮷')  // true

/^𠮷{2}/.test('𠮷𠮷')  // false
/^𠮷{2}/u.test('𠮷𠮷')  // true
```

经常会需要直接使用 unicode 码点来作为正则表达式，这个时候就需要使用 u 修饰符，才能正确识别正则表达式中的大括号,否则大括号会被识别为一个 **量词**

```js
/\u{61}/.test("a"); // false
```

```js
/\u{61}/u.test("a"); // true
```

## `()`的用法

`()`在正则中使用的频率很大，主要目的是为了 **记住** 括号内匹配的字符，以便在正则表达式本身或者后续语句中使用。主要使用`\`和`$`符号来引入被记住的得字符串

先看一下`$`的使用:

```js
let reg = /(\d)([a-z])/;
let a = "3a";
a.replace(reg, "$2,$1"); // 'a,3'
```

上面的例子发生了什么，a 的内容被替换掉了，第一个括号内的数字`3`被记做变量`$`,第二个括号内的字母`a`被记做变量`$2`，所以才可以在 replace 函数中通过`$1` `$2`调用。

注意：

> 正则表达式中被记忆在内存中的字符串从 1 开始，不是从 0 开始

再来看一下`\`的使用：

```js
let a = "-a-a hello";
let b = "-a+b hello";
let reg = /([-\.\+])([abcd])\1\2/;
reg.test(a); // true
reg.test(b); // false
```

在正则表达式中，看到了`\`的使用，这里`\1`表示这里的内容必须第 1 个括号内的内容保持一致，这里`\2`表示这里的内容必须第 2 个括号内的内容保持一致。所以变量 a 是匹配的，b 是不匹配的。

那么正则表达式中的内容，我们希望用它来对比字符串，又不希望它被内存记录下来，该怎么办呢？ 这里就要用到 **非捕获括号(非记忆括号)** 了，表达式为`(?:x)`,还是用前面的例子

```js
let reg = /(?:\d)([a-z])/;
let a = "3a";
a.replace(reg, "$2,$1"); // '$2,3'
```

第一个括号，我们使用了非捕获括号，所以这里的内容不会被记录下来，replace 中的`$1`实际上是从第 2 个括号开始计算的，而`$2`并没有对应的记忆内容，所以就要被直接当做字符串替换了

## 正则表达式的方法

正则表达式主要用在以下几个方法上
|方法|作用|
|---|---|
|regexp.test(string)|检查字符串是否返回符合表达式的字符，返回布尔值，包含则返回 true，否则返回 false|
|string.search(regexp)|检查字符串是否返回符合表达式的字符，返回符合字符所在的索引值，没找到符合字符返回 -1|
|string.match(regexp)|返回包含了匹配字符的数组，如果没找到返回 null|
|regexp.exec(string)|返回包含了匹配字符的数组，如果没有返回 null|
|string.split(regexp)|查找符合正则表达式的字符，并以匹配字符为界，分割源字符串后保存到新的数组中，返回该数组|
|string.replace(regexp, string)|把匹配的字符替换成指定字符|

如果只是想判断目标是否包含某个匹配的字符串，可以使用 test 和 search 方法，如果想获取匹配的更多信息，可以使用 match 和 exec 方法

## match 方法

先看没有使用`g`修饰符的时候,会返回匹配到的第一个匹配项以及他的详细信息

```js
"1999-12-31 1999-12-32".match(/\d{4}-\d{2}-\d{2}/);
// ["1999-12-31"]
```

添加了`g`修饰符后

```js
"1999-12-31 1999-12-32".match(/\d{4}-\d{2}-\d{2}/g);
// ["1999-12-31", "1999-12-32"]
```

如果正则表达式中使用了`()`，返回的数组从第二个元素开始会依次列出`()`内的匹配值,这些值可以通过下标来访问到

```js
let a = "1999-12-31 1999-12-32".match(/(\d{4})-(\d{2})-(\d{2})/);
/*
[
    "1999-12-31", 
    "1999", 
    "12", 
    "31", 
    index: 0, 
    input: "1999-12-31", 
    groups: undefined
]
*/
a[1]; //1999
a[2]; //12
a[3]; //31
```

注意:

> 使用 match 方法的时候，如果正则表达式中使用了匿名组，且想要获取匿名组中的信息，不能使用`g`修饰符，否则只会返回“包含了所有匹配值的数组”

```js
let a = "1999-12-31 1999-12-32".match(/(\d{4})-(\d{2})-(\d{2})/);
// ["1999-12-31", "1999-12-32"]
```

## exec 方法

exec 方法，默认使用全局匹配模式，每执行一次都会返回一个数组，数组的第一个元素是匹配到的第一个匹配值，并且下一次搜索从匹配值的后一个字符串开始

```js
let a = "aaa_aa_a";
let reg = /a+/;
console.log(reg.exec(a)); // [ 'aaa', index: 0, input: 'aaa_aa_a' ]
console.log(reg.exec(a)); // [ 'aa', index: 4, input: 'aaa_aa_a' ]  从_开始搜索
console.log(reg.exec(a)); // [ 'a', index: 7, input: 'aaa_aa_a' ] 从_开始搜索
```

如果正则表达式中使用了`()`，返回的数组从第二个元素开始会依次列出`()`内的匹配值,这些值可以通过下标来访问到

```js
let a = /(\d{4})-(\d{2})-(\d{2})/.exec("1999-12-31");
/*
[
    "1999-12-31", 
    "1999", 
    "12", 
    "31", 
    index: 0, 
    input: "1999-12-31", 
    groups: undefined
]
*/
a[1]; //1999
a[2]; //12
a[3]; //31
```

## 具名组

如果给正则表达式中的`()`添加了组名，就可以通过这些组名访问到匹配值，这种方法被称为 **具名组**，具名组从 ES2018 开始引入，格式为`(?<name>y)`
添加了组名的内容可以通过`.groups.name`访问

```js
let a = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/.exec("1999-12-31");
/* 
[
    "1999-12-31", 
    "1999", 
    "12", 
    "31", 
    index: 0, 
    input:  "1999-12-31", 
    groups:{
        year: "1999", 
        month: "12", 
        day: "31"
    }, 
    index:0,
    input:"1999-12-31"
]
*/
a.groups.year; //1999
a.groups.month; //12
a.groups.day; //31
```

## 具名组的使用

具名组出现之后，也可以在解构赋值中使用

```js
let a = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/.exec("1999-12-31");
let {
  groups: { year, month, day }
} = a;
// {year: "1999", month: "12", day: "31"}
```

replace 函数中如果想要使用具名组的内容可以使用`$<name>`

```js
let a = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
"1999-02-04".replace(a, "$<day>/$<month>/$<year>");
// "04/02/1999"
```

正则表达式中如果想引用前面的具名组，可以使用`\k<name>`的写法，并且可以与`\number`同时使用

```js
let a = /(abc)\1/;
let b = /(?<foo>abc)\k<foo>/; // 这里的foo就是声明的组名

a.test("abcabc"); // true
a.test("abcab"); // false
b.test("abcabc"); // true
b.test("abcab"); // false
```

## y 修饰符

```js
let a = "aaa_aa_a";
let reg = /a+/g;
console.log(reg.exec(a)); // [ 'aaa', index: 0, input: 'aaa_aa_a' ]
console.log(reg.exec(a)); // [ 'aa', index: 4, input: 'aaa_aa_a' ]
console.log(reg.exec(a)); // [ 'a', index: 7, input: 'aaa_aa_a' ]
```

但是当正则表达式使用了`y`标识符的时候，结果就有所不同了，y 修饰符不仅仅是在全部的字符串内匹配，还要求匹配的内容必须从 **开始查找** 的位置开始

```js
let a = "aaa_aa_a";
let reg = /a+/y;
console.log(reg.exec(a)); // [ 'aaa', index: 0, input: 'aaa_aa_a' ]
console.log(reg.exec(a)); // null
console.log(reg.exec(a)); // [ 'aaa', index: 0, input: 'aaa_aa_a' ]
```

第二次执行 exec 的时候发生了什么？ 第一次匹配后，第 2 次 exec 将从第[3]个字符`_`开始查找，所以没有找到匹配的字符串，返回了 null。第 3 次执行等于把开始搜索的位置重新设置为[0]，所以第 3 次的结果和第 1 次的结果是相同的,那么如何通过改动，让第 2 次也能匹配到呢？

```js
let a = "aaa_aa_a";
let reg = /a+_?/y;
console.log(reg.exec(a)); // [ 'aaa_', index: 0, input: 'aaa_aa_a' ]
console.log(reg.exec(a)); // [ 'aa_', index: 4, input: 'aaa_aa_a' ]
console.log(reg.exec(a)); // [ 'a', index: 7, input: 'aaa_aa_a' ]
```

现在就可以了。

## s 修饰符

`.`修饰符最初是匹配除了 **换行符** 之外的所有字符，所以在应用中想要匹配换行符，通常有以下两种替代做法

```js
/hello[\n]world/.test('hello\nworld') // true
/hello[^]world/.test('hello\nworld') // true
```

ES2018 中引入了新的修饰符`s`，添加了这个修饰符的正则表达式中`.`将匹配包括换行符在内的任意字符，也就是说我们可以这样使用了

```js
/hello.world/s.test("hello\nworld");
```

## 后行断言

先说前行断言`x(?=y)`，前行断言值得是只要后面跟着 y 的 x 才能被匹配到，那么相反的，如果规则改成“只有前面是 y 的 x 才能被匹配到”，就属于后行断言，ES2018 已经引入了该模式，正则表达式为`(?<=y)x`,chrome 从 64 版本已经开始支持

```js
// 前行断言
"person pen process".match(/p(?=e)\w+[^\s]/g); // ["person", "pen"]
// 后行断言
"person pen process".match(/\w(?<=c)e/g); // ["ce"]
```
