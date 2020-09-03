<!-- Date: 2018-06-21 01:58 -->

# es6 内置属性-[Symbol.split]

字符串的 splite 方法，用于把源字符串按照参数指定的规则分割，并返回一个数组，常用的参数可以是 `string` 或者 `regexp`

```js
'abc,def'.split(','); //["abc", "def"]
'abc,def'.split(/,/); //["abc", "def"]
```

如果参数传入一个对象，不会抛出错误，但是会把源字符放入一个数组中返回

```js
'abc,def'.split({}); //["abc,def"]
```

如果给对象部署了[Symbol.split]方法，相当于修改了`String.prototype.split`方法，会按照定义的内容返回

```js
let obj = {
    [Symbol.split](arg) {
        console.log(arg);
        return ['orange', 'pears'];
    },
};
'abc,def'.split(obj); // ["orange", "pears"]
```

重新定义[Symbol.split]方法的时候，默认传递一个参数，参数内容是 split 的上下文内容，在上面的案例中指向`'abc,def'`
