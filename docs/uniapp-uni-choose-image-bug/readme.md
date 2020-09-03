<!-- Date: 2020-08-18 13:38 -->

# uniapp 中 uni.chooseImage 方法的底层 bug(触发 app 级别 onhide 与 onshow)的问题

手里这个项目需要在小程序中使用`richtext`组件，并且要增加插入图片功能，uniapp 提供了`richtext`组件，可以直接拿来用，但是在选择图片之后，微信小程序可能会触发一个底层 BUG，这里记录一下。

问题： 选择图片之后，微信小程序自动切换到了登录页。

微信小程序自动切换到首页，可能牵扯两个问题：

1. 某个 bug 导致微信小程序重新启动了
2. 某个 bug 到导致微信小程序被重新定位到了首页

首先检查了一遍代码，没有发现任何使用`uni.navigator`的地方。

为了确认是不是第一个问题，我在`App.vue`中做了`onLanuch`,`onShow`,`onHide`和`onError`钩子函数，再次点击某张图片后，发现控制台中`onHide`和`onShow`依次被触发了

再详细的说，就是使用`uni.chooseImg()`时，触发了`onHide`，选择图片后，触发了`onShow`。

在微信小程序文档中遨游了半天，发现不近是我一个人发现了这个问题，而且这个问题属于微信小程序的**底层 BUG**，(目前我的小程序开发版本为：`2.12.1`)

并且我的`onShow`函数中有一个检测 `token` 的功能，如果没有在 `storage` 中发现用户 `token` 会自动跳转到登录页。

现在问题找到了，就是因为这个底层 BUG 导致微信小程序进入了`onShow`的钩子函数，才导致每次选择图片都自动跳转到了登录页

## 解决办法

这样子我就得在`onShow`中添加一个变量，来判断是否检测 `token`，微信小程序中，如果要在富文本页面改变一个变量，还能让`App.vue`的`onShow`中能获取到，只能把变量设置在`globalData`中了，

`editor.vue`

```js
getApp().globalData.noCheckToken = true;
uni.chooseImage({
    success: function () {
        uni.uploadFile({
            success: function () {
                // 操作完成后，最好noCheckToken清空，或者设为false，因为如果用户关闭了当前小程序，再重新进入时，还会触发`onShow`,此时可能需要再次检测token
                getApp().globalData.noCheckToken = false;
            },
        });
    },
});
```

`App.vue`

```js
export default {
    onShow() {
        console.log('App Show');
        if (!this.$scope.globalData.noCheckToken) {
            const token = uni.getStorageSync('tk');
            if (token) {
                uni.switchTab({
                    url: '/pages/index/index',
                });
            }
        }
    },
};
```
