<!-- Date: 2018-03-11 15:43 -->

# vue 中如何在 v-html 指令中使用过滤器

> 在 vue 和 angularJs 中使用过滤器是很频繁的事情，尤其是像本博客中的实时编译 markdown 语法，更是一个很大的功能点，angularJs 中是可以对自定义指令 ng-bind-html 使用过滤器的，但是 vue2 版本以上不再允许 v-html 指令使用过滤器，那么该怎么做呢？

## 先回忆一下 angularJS 中如何定义和使用过滤器

假设我们已经在 html 中引入了 showdown.js 文件

```js
angular.module('app').filter('showdown', filter);
function filter(data) {
    return function (data) {
        (converter = new showdown.Converter({
            tables: true,
            underline: true,
            strikethrough: true,
        })),
            (html = converter.makeHtml(data));
        return $sce.trustAsHtml(html);
    };
}
```

在 html 中的用法

```html
<div ng-bind-html="content | showdown"></div>
```

## 那么在 vue 中该如何实现这个效果呢？

首先在 vue 文件中引入 showdown

```js
import { showdown as ShowDown } from 'showdown.js';
```

仔细看过 showdown 源码的应该会知道，showdown 里面已经针对 AMD、CommonJS、Regular 做了分别的而处理，可以允许我们以 import 的方式引入他的模块，而我们要用的 showdown 只是他 export 出来的对象中的一个方法，因此我们在 import 的时候，使用了对象解构的语法(对象解构请看[阮一峰老师的 ES6 详解](http://es6.ruanyifeng.com/#docs/destructuring))

现在我们来解决 vue 的 v-html 指令不能使用过滤器的问题。

v-html 指令实际上指向了一个表达式，所以我们完全可以在他的值中使用类似于&showdown(data)&的方式，来绑定显示的内容，这就意味这我们需要在 methods 中定义一个专门的方法，代码如下：

```js
export default {
    methods: {
        showdown(data) {
            let converter = new ShowDown.Converter({
                tables: true,
                underline: true,
                strikethrough: true,
            });
            let html = converter.makeHtml(data);
            return html;
        },
    },
};
```

在 html 中的用法

```html
<div v-html="showdown(content)"></div>
```
