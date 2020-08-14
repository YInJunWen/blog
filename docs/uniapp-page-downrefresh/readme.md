<!-- Date: 2020-08-13 18:20:11 -->

# uniapp 中页面下拉刷新需要注意的问题

页面下拉刷新需要在`/pages.json`中，在指定的`page.style`属性中添加`enablePullDownRefresh`属性，并设为`true`，例如：

```js
{
    "path": "pages/knowledge/list",
    "style": {
        "navigationBarTitleText": "知识库列表",
        "enablePullDownRefresh": true
    }
},
```

在实际项目中，推荐在获取到新数据后，手动关闭下拉刷新的状态，否则会出现“新数据已经拿到了，下拉刷新的状态依然存在”的问题，下拉刷新状态指的是手指在页面向下滑动，页面顶部出现的 loading 样式，比如：

```js
methods:{
    getList(){
        uni.showLoading({
            title: '获取数据中...'
        })
        fetchData().then(res=>{     // fetchData意为模拟一个ajax请求
            uni.stopPullDownRefresh() // 手动关闭下拉刷新状态
            uni.hideLoading()
        }).catch(err=>{
            uni.hideLoading()
        })
    }
}

```
