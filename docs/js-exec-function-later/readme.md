<!-- Date: 2016-08-19 20:57 -->

# js 输入框延迟指定事件执行方法

> 本博客中文章编辑器，使用了及时保存功能，这里记录一下实现过程

及时的把用户输入信息保存到数据库是一个很常见的功能，要实现这个功能很简单，对 input 或者 textarea 新增一个 onchange 事件即可。

但是，如果只是简单的 onchange 事件就去调用接口，会给服务器造成相当大的压力，因此我们要对这个功能进行优化：当用户输入后 3 秒内无后续输入，及时为用户保存内容一次

那么如何来实现这个 3 秒后无输入呢

```js
// 按下的时间需要和后面的时间作对比，所以不能放在函数体内，必须定义一个全局的变量，来存储用户改变内容的时间
// 同样定义一个临时保存内容的变量
var lastEditTime = ', lastContent = ';
function upperCase(ele) {
    lastEditTime = new Date().getTime();
    // 只有和之前内容不同的情况下才继续后面的判断,这是为了区别用户按下真实输入键和非真实输入键，比如上下左右等
    if (ele.value === lastContent) {
        return false;
    }
    lastContent = ele.value;
    setTimeout(function () {
        if (new Date().getTime() - lastEditTime > 3000) {
            console.log('执行想要的操作');
        }
    }, 3000);
}
```

第一次输入的时候，lastEditTime 会被赋值，3 秒内第二次输入后 lastEditTime 会重新赋值，但是第一次输入中设置的定时器与第二次保存的 lastTime 之间的差距已经小于 3000 毫秒，所以不会执行我们调用接口的事件

## angularJS 中用法

```html
<input ng-model="content" type="text" />
```

```js
$scope.$watch('content', function (newVaue, oldValue) {
    // 执行代码
});
```

angularJs 中要把上面的`lastEditTime`和`lastContent`放在`$scope`模型中，作为"全局"变量。也可以省略`lastContent`变量，可以使用`newVallue`和`oldValue`对比来代替

## Vue 中用法

```html
<input type="text" v-model="content" />
```

```js
export default {
    watch: {
        content() {
            // ..执行代码
        },
    },
};
```

Vue 中要把上面的`lastEditTime`和`lastContent`放在组件的`data`模型中，作为"全局"变量。
