<!-- Date: 2018-06-22 12:00:54 -->

# js 向 textarea 输入 tab 字符

> 在本博客的编辑器功能中，需要模仿 IDE 按下 tab 键插入四个空格功能，实现方式记录如下

```js
document.onkeydown = function(e) {
  if (e.target.nodeName.toLowerCase() == "textarea" && e.keyCode == 9) {
    e.preventDefault();
    var ele = e.target;
    var start = ele.selectionStart;
    var end = ele.selectionEnd;
    var tmp1 = ele.value.substr(0, start);
    var tmp2 = ele.value.substr(end);
    ele.value = tmp1 + "    " + tmp2;
    ele.selectionStart = ele.selectionEnd = start + 4;
    $scope.$apply();
    // return false;
  }
};
```

## 注意

千万要注意几点：

1.  里面的事件必须用原生 JS 实现，比如 textarea 我们通常会给他绑定到一个 angularjs 模型中，假设我们绑定模型为`$scope.content`,上面的代码中千万不要`$scope.content`来代替`ele.value`
2.  插入 4 个空格之后，不要忘记重置输入框的锚点位置即：`ele.selectionStart = ele.selectionEnd = start + 4`
3.  由于是在 angularjs 中使用原生 JS，为了保证 JS 的脏检查，最后推荐使用`$scope.$apply()`手动触发一次 angularJS 的脏检查。
4.  浏览器本身有 tab 事件，比如 safari 和 chrome 中会将焦点跳转到地址栏，因此在自定义事件执行后不要忘记添加`return false`来阻止浏览器的事件，`event.preventDefault`同样可以达到阻止浏览器事件的目的
