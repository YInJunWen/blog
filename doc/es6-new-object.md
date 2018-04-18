# es6 中更简洁的对象表示方法

当对象的属性名，需要用到某个已声明的变量以及变量值的时候，ES6 允许使用下面更简洁的方法

```js
var name = "zangsan";
var obj = { name };
obj.name; // 'zhangsan'

function add(x, y) {
    return { x, y }; // 这里等同于 {x: x, y: y}
}
add(1, 2); //  {x:1, y:2};
```

除了属性，对象的方法名也是可以简写的,这里要注意的是对象里面简写方法的时候，逗号是不能少的**(class 语法糖中方法之间是不需要逗号的)**

```js
var obj = {
    getName() {
        console.log("zhangsan");
    },
    getAge() {
        console.log(20);
    }
};
obj.getName(); // zhangsan
obj.getAge(); // 20
```

我们在写 nodeJs 模块的时候，也可以这么写

```js
var getName = function() {
    console.log("zhangsan");
};
var getAge = function() {
    console.log(20);
};
module.exports = {
    getName, //  相当于 getName: getName
    getAge //  相当于 getAge: getAge
};
```
