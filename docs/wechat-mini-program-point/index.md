# 微信小程序开发要注意的地方

这里记录一下微信小程序开发中发现的一些小问题，以及微信开发工具的 bug

## 怎么设置小程序首页

在 app.json 文件中，小程序根据 pages 属性的的第一个页面位置，设置小程序默认打开的首页，所以这里可以把想设置的页面放在第一位即可

## 如何在 text 组件中使用多个空格以及空格的实体字符

text 组建中有两个属性 space 和 decode 都可以用来正确显示想要的空格

## scroll-view 横向滚动为啥不起作用

官方文档写的不全，这里补充一下：

* 滚动容器一定要设置 white-space: no-wrap;
* 滚动项要设置为： display:inline-block;
* 滚动项添加 float 是无效的

## 事件传参

小程序的事件只会传递一个参数，那就是 event，如果想传递其他参数可以通过 event 事件的其他属性来获取，看下面的例子

```html
<view data-name="zhangsan" data-age="{{age}}" bindtap="tapEvent">
```

```js
Page({
  data: {
    age: 12,
  },
  tapEvent(event) {
    let name = event.target.dataset.name; // 这里就可以获取到我们传递进来的 name 值
    let age = event.target.dataset.age; // 这里就可以获取到我们传递进来的 age 值
  },
});
```

具体 event 的属性列表可以参考[小程序事件](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)

## wxs 中的变量声明

声明变量的时候，只可以使用关键字**var**，注意：千万不要把 let，const 也用到小程序里面，会报错的

## 小程序中的遍历

针对”对象“类型的变量，在 wxs 中是没办法遍历的，因为 wxs 并没有提供`for...in...`或者是`for...of...`等循环语句

## 远程调试触发 Sync 错误

使用远程调试的时候，偶尔会出现`Sync cant send`的错误，重启开发工具即可，这是微信开发工具的 bug
