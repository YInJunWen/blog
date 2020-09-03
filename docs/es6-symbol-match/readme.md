<!-- Date: 2018-06-09 12:45 -->

# es6 内置属性-[Symbol.match]

[Symbol.match]属性有两个作用

-   修改 match 函数的行为
-   修改正则表达式的属性

## 修改 match 函数的行为

一般来说 match 函数的参数是一个正则表达式，用来查找字符串中的匹配字符

如果函数的参数不是正则表达式，而是一个自定义对象，那么在执行 match 函数的时候，默认调用的就是这个对象的[Symbol.match]属性

```js
var reg = {
    [Symbol.match](string) {
        return 'match ' + string;
    },
};
'abcdef'.match(reg); // "match abcdef"
```

class 中同样可以使用

```js
class Egg {
    constructor() {
        this[Symbol.match] = function (string) {
            return 'match ' + string;
        };
    }
}
'abcdef'.match(new Egg()); // "match abcdef"

class Orange {
    [Symbol.match](string) {
        return 'match ' + string;
    }
}
'abcdef'.match(new Orange()); // "match abcdef"
```

## 修改正则表达式的属性

正则表达式本身的[Symbol.match]属性默认为 true，表示正则表达式不能被当做一个字符串使用

以 startsWith 为例，正常情况下 startsWith 函数的参数应该是一个字符串，如果传入一个正则表达式是会抛出错误`TypeError: First argument to String.prototype.startsWith must not be a regular expression`

```js
'/abc/def'.startsWith('/abc/'); // true
'/abc/def'.startsWith(/abc/); // throw an TypeError
```

如果把正则表达式的[Symbol.match]属性设置为 false，正则表达式会被当做一个字符串对待

```js
var reg = /abc/;
'/abc/def'.startsWith(reg); // throw an TypeError
reg[Symbol.match] = false;
'/abc/def'.startsWith(reg); // true
```
