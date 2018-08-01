<!-- Date: 2016-05-06 10:28:32 -->

# angularJS ngTouch 触发多次绑定事件的解决方案

ng-touch 在使用的时候，需要安装和引用 angular-touch 库，$swipe.bind()默认会监听三种事件：touch,mouse,pointer;在项目中一定要记得指定其中一种，否则会触发两次绑定的事件<br />

```js<br />
link: function($scope,ele, attr){<br />
 $swipe.bind(ele,{<br />
  'touchstart': function(e){}...<br />
 }, '在这里指定监控的类型[touch,mouse,pointer]')<br />
}<br />
<br />
```
