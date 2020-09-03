<!-- Date: 2017-08-11 01:30 -->

# wechat 微信小程序在组件之间触发事件以及传参

小程序开发中，自定义组件是必不可少的，那些复用率较大的一般都会封装成一个单一的组件，那么和 AngularJS、VueJS、ReactJS 一样，肯定也有触发上级事件以及传参的方法，具体如下(下面的代码中省略了暴露组件以及引入组件的方法，具体可以参考[微信小程序组件暴露以及使引入方法](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/))

微信小程序中方法是`this.triggerEvent(eventName, data, options)`

其中 eventName 表示上级组件要监听的方法，data 表示要传递过去的额外的参数，options 表示该事件向上传递的选项

-   `eventName`:微信小程序允许自定义监听方法，`bindcustomevent=""`或者`bind:customevent`都可以实现监听功能

-   `data`:组件点击事件，会把本次事件对象传递到监听事件中区，data 中定义的额外数据会被放在 event.detail 属性中

-   `options`: 定义了本次触发上级监听事件的选项，通常包含三个值

| 值           | 类型    | 是否必填 | 默认值 | 解释                                       |
| ------------ | ------- | -------- | ------ | ------------------------------------------ |
| bubbles      | Boolean | 否       | false  | 事件是否冒泡                               |
| composed     | Boolean | 否       | false  | 如果允许事件冒泡，事件是否可以穿越组件边界 |
| capturePhase | Boolean | 否       | false  | 事件是否拥有捕获阶段                       |

## 先看看基础的组件声明及引入方法

`/component/card/card.wxml`

```html
<button bindtap="buttonTapEvent"></button>
```

`/component/card/card.js`

```js
Component({
    methods: {
        buttonTapEvent() {
            this.triggerEvent('customevent', { name: 'zhangsan' });
        },
    },
});
```

`/component/card/card.json`

```js
{
  "component": true
}
```

`/pages/index/index.json`

```js
{
  "usingComponents":{
    "card":"/component/card/card"
  }
}
```

`/pages/index/index.wxs`

```js
Page({
    customEvent(data) {
        console.log(data);
    },
});
```

`/pages/index/index.wxml`

```html
<card bindcustomevent="customEvent" />
```

在上面的案例中，点击 button 的时候，就会触发组件内的 buttonTapEvent 事件，，并且通过 triggerEvent 触发在 index.wxml 绑定的 customevent 事件，最终在 customEvent 事件中输出包含了`{name: 'zhangsan'}`的参数

`注意：`

父组件上添加自定义监听方法的时候，方法名是 `不需要`使用`{{}}`的！！！

## 怎么获取传递过去的参数

上面的案例中，我们传递了一个`{name:'zhangsan'}`给 customEvent 事件，那么如何获取这个事件呢，通过在 customEvent 中输出事件的第一个参数可以发现以下内容：

```
{
  type: '...',
  target: '...',
  currentTarget: '...',
  timeStamp: '...',
  detail: {
    name: 'zhangsan
  },
  ......
}
```

具体的内容可以参考[微信小程序事件对象](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html), 其中在 triggerEvent 中传递的第二个参数 data，可以在上面的 detail 中找到。

## triggerEvent 的第三个参数 options

既然是事件，那么肯定有冒泡这些属性，微信小程序在 triggerEvent 方法中可以定义以下两个内容

1.事件是否冒泡，即组建的祖宗元素如果也绑定了监听事件，该事件也会被触发 2.如果允许事件冒泡，是否可以穿透到其他的组件中去

关于这两点，小程序官网举出了一个很好的[例子]()https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html

```html
// 页面 page.wxml
<another-component bindcustomevent="pageEventListener1">
    <my-component bindcustomevent="pageEventListener2"></my-component>
</another-component>
```

```html
// 组件 another-component.wxml
<view bindcustomevent="anotherEventListener">
    <slot />
</view>
```

```html
// 组件 my-component.wxml
<view bindcustomevent="myEventListener">
    // 这里一定要注意，绑定的事件名称 <不需要> 大括号包围
    <slot />
</view>
```

```js
// 组件 my-component.js
Component({
    methods: {
        onTap: function () {
            this.triggerEvent('customevent', {}); // 只会触发 pageEventListener2
            this.triggerEvent('customevent', {}, { bubbles: true }); // 会依次触发 pageEventListener2 、 pageEventListener1
            this.triggerEvent('customevent', {}, { bubbles: true, composed: true }); // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
        },
    },
});
```

在看这个案例的时候，不要关心组件的嵌套(slot),只需要知道

1.pageEventListener1 和 pageEventListener2 都是绑定在 page 页面上的，其中 pageEventListener1 是组件内部 triggerEvent 后的第一个触发事件，pageEventListener2 则属于允许冒泡后的事件

2.anotherEventListener 是绑定在 another-component 组件上的，属于组件内部事件，只有在 options.composed 为 true 的时候，才会被触发，且它的优先级 `高于` 事件冒泡导致的 pageEventListener2

3.myEventListener 绑定在 my-component 组件的根元素上(这个事件会不会被触发还没尝试过)
