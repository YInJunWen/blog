# 关于 IOS9 以下版本不支持 flex 布局

> flex 布局出来之后，实在是用的太顺手了，不管什么地方都想用 flex 布局，本来以为出了那些旧的浏览器都可以支持的，没想到在 IOS 上踩了坑

测试人员告诉我说 IOS9 有一个页面布局乱了，我拿来一看是和 flex 布局有关的元素，其他的安卓机型都没有问题，于是我拿来了所有的 IOS 设备，一个一个去检测 useragent 和布局显示效果，发现只有 IOS 版本低于 9 以下的版本，才会出现不支持 flex 布局的问题。领导又说不能忽略这个问题，那就只好寻找相关的解决办法了。

首先要判断当前设备是不是 IOS 且版本是否低于 9

```js
var u = navigator.userAgent;

if (/OS\ (\d{1,3}_\d{1,3})\ /g.test(u)) {
  var tmp = u.match(/OS\ (\d{1,3}_\d{1,3})\ /g)[0];
  var version = tmp.slice(3).replace("_", ".");
  if (parseFloat(version) < 9) {
    document.body.className = "oslt9";
  }
}
```

前面我针对符合的设备在 body 元素上添加了一个`oslt9`的类名，后面就可以专门根据这个类名去做一些特殊处理

```js
.oslt9{
    // ..style
}
```
