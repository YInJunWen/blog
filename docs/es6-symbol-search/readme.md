# es6 内置属性-[Symbol.search]

字符串的 search 方法，用于在指定字符串中查找是否存在指定的字符串,并返回匹配字符串的起始位置，search 的参数可以是 `string` 或者 `regexp`

```js
let a = "abcdef".search("bc");
a; // 1
let b = "abcdef".search(/bc/);
b; // 1
```

如果参数是一个对象，

```js
"abcdef".search({}); // 1
"dddff".search({}); // -1
"f89fhf9e".search({}); // 7
```

> 如果参数是一个对象的话，这个输出值我也不知道是经过什么样的计算出来的，知道的师兄可以在下面留言一下。

如果给对象部署了[Symbol.split] 属性，会怎么样？

```js
var obj = {
  [Symbol.search](str) {
    console.log(str);
    return 10;
  }
};
let a = "abcdef".search(obj);
a; // 10
```

所以[Symbol.search]属性，相当于重新定义了`String.prototype.search`方法， 方法默认传递一个参数，参数内容是方法的上下文，也就是 this，在上面案例中参数内容就是'abcdef',
