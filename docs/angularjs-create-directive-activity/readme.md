<!-- Date: 2016-07-02 13:10 -->

# angularJS 动态创建自定义指令

> 所谓的动态创建自定义指令，就是在动态插入一段 htm 代码的时候，如果这段 html 代码中包含于 angular 的指令，利用 angularjs 的\$compile 功能，先把包含的指令扩展成对应的模板，或者自动加载对应的方法，再插入到 DOM 中

假设我们需要动态插入了以下菜单，并且每个 name 的值都有一个对应的 directive 模板页面

```js
var data = [{ name: 'home' }, { name: 'news' }, { name: 'member' }];
```

html

```html
<div class="container"></div>
```

js

```js
angular.forEach(data, function (item, index) {
    var tmp = `<div ${item.name}></div>`;
    angular.element('.container').append(tpl);
});
```

这是我们插入后在浏览器中查看 DOM 的显示内容

```html
<div class="container">
    <div home></div>
    <div news></div>
    <div member></div>
</div>
```

表面看起来他确实被解析成了我们想要的 DOM，但实际上这些`home news member`并没有关联到他们对应的模板，为什么呢？因为他被当做一个普通的 DOM 属性插入到页面中去了，并没有绑定他对应的模板文件。

下面我们利用 angularjs 的\$compile 方法，把他们关联起来

```js
angular.forEach(data, function(item,index){
 var tmp = `<div ${item.name}></div>`；

 var tplFn = $compile(tmp);
 var tpl = tplFn($scope)

 angular.element('.container').append(tpl);
})
```

上面比之前多了两行代码，他的功能就是为了先解析对应的自定义指令，再插入到 DOM 中。这个时候去浏览器中查看
