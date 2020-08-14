<!-- Date: 2020-08-14 14:47:11 -->

# uiapp 中 scroll-view 的下拉刷新事件与页面的下拉刷新事件

> 1. `scroll-view`组件有自己的下拉刷新事件，可以认为控制是否开启下拉刷新。

> 2. `scroll-view`组件内部不会触发页面级的下拉刷新事件

因此你需要决定在页面中启用 scroll-view 组件的下拉刷新事件还是启用页面级的下拉刷新事件，这里只总结 scroll-view 组件的下拉刷新事件使用方法

```html
<scroll-view
    refresher-enabled="true"
    :refresher-triggered="refreshTrigger"
    :refresherrefresh="onRefreshEvent"
></scroll-view>
<script>
    export default {
        data() {
            return {
                refreshTrigger: true,
            };
        },
        methods: {
            onRefreshEvent() {},
        },
    };
</script>
```

上面这段代码中，`refresher-enabled`表示启用`scroll-view`的下拉刷新事件；`refresher-triggered`官方解释为：`设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发`，但是在实际操作中，我发现它应该这么用：

```js
export default {
    methods: {
        onRefreshEvent() {
            this.refreshTrigger = false;
            fetchData()
                .then((res) => {})
                .catch((err) => {})
                .finally((_) => {
                    this.refreshTrigger = true;
                });
        },
    },
};
```

`refreshTrigger`的值默认是`true`，表示下拉事件可以开始了，`refresh`事件开始后，把它的值设置为`false`，表示下拉事件已完成，让`loading`框自动收起来，当获取到想要的数据后，再设置为`true`，以便下次的下拉刷新事件。

为什么这么说呢？

如果下拉事件触发后，没有将`refreshTrigger`设置为`false`，即便`fetchData()`已经开始了，`loading`状态也不会自动收起。设置为`false`后，即可将`loading`状态收起。

`fetchData()`拿到数据之后，自然也要把`refreshTrigger`设置为`true`，以便再次触发下拉刷新事件，否则也会出现同样的问题。
