# angularJS 自定义指令绑定策略

angularjs 支持三种绑定数据的方式

## `@`把属性的值解析为字符串，

```html
<div ng-controller="parentCtrl">
    <div child-directive  test="zhangsan"></div>
</div>
```

```js
// parentCtrl:
$scope.test = 'lisi';

// child-directive:
return {
  strict: 'EA',
  template: '<p ng-bind="test"></p>',
  scope: {
    test: '@',
  },
};
```

这个时候，`p`标签的内容会渲染成`test`属性的值`zhangsan`,而不是`lisi`

## `=`把属性的值解析为表达式，方便引用父级作用域的模型，用作双向绑定使用

```html
<div  ng-controller="parentCtrl">
    <div child-directive test="zhangsan"></div>
</div>
```

```js
// parentCtrl:
$scope.test = 'lisi';

// child-directive:
return {
  strict: 'EA',
  template: '<p ng-bind="test"></p>',
  scope: {
    test: '=',
  },
};
```

此时`p`元素渲染出来的内容是'lisi'，而不是 DOM 中的值`zhangsan`

## `&`把属性值解析为表达式，方便引用父级作用域的函数，属性值要写成`模型名称()`的模式

```html
<div ng-controller="parentCtrl">
    <div child-directive test="zhangsan" ></div>
</div>
```

```js
// parentCtrl:
$scope.zhangsan = function() {
  alert(1);
};

// child-directive:
return {
  strict: 'EA',
  template: '<p ng-click="test"></p>',
  scope: {
    test: '&',
  },
};
```

此时如果点击了`p`标签，会直接执行`parentCtrl`中定义的`zhangsan`方法,当然了，这是在没有参数传递情况下的用法，如果需要传递参数，则需要这么写

```html
<div ng-controller="parentCtrl">
    <div child-directive test="zhangsan" ></div>
</div>
```

```js
// parentCtrl:
$scope.zhangsan = function(name){
    alert(name);
}

// child-directive:
return {
    strict: 'EA',
    template: '<p ng-click="test('lisi')"></p>',
    scope: {
        test: '&'
    }
}
```
