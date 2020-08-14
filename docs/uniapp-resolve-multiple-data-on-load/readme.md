<!-- Date: 2020-08-13 18:20:11 -->

# uniapp 开发中总结的页面加载时多次 api 请求的处理意见

页面打开时，可能需要同时调用到后端提供的多 api 接口，此时强烈建议使用`Promise.all()`方法，下面是一个案例：

```js
onShow(){
    Promise.all([
        fetchData1(),
        fetchData2(),
        fetchData3(),
    ]).then(res=>{
        // res 是一个数组，按顺序对应上面的三次请求返回的结果
        // 把res中的数据分别处理到页面的data中
    }).catch(err=>{
        uni.showToast({
            title:'数据获取异常，请稍后重试'
        })
    })
}
```

这里有个问题，比如我页面中需要显示这么几个字段：

```html
<template>
    <view>我发布的文章总数：{{articleCount}}</view>
    <view>我发表的评论总数：{{commentCount}}</view>
</template>
<script>
    data(){
        return {
            articleCount:"",   // 文章数量
            commentCount:"",   // 评论数量
        }
    }
</script>
```

假设这两个字段都需要我从后台获取才能展示，假如这两个接口中任意一个接口返回了错误，JS 中执行了`catch`事件,页面中只会显示`我发布的文章总数：`,因为我的`articleCount`值默认是一个空字符串，这样的用户体验很差，所以强烈建议给那些需要在页面中显示的字段，设置一个合适的默认值，这样即便是获取数据出错，也不影响用户体验

```html
<script>
    data(){
        return {
            articleCount:0,   // 文章数量
            commentCount:0,   // 评论数量
        }
    }
</script>
```
