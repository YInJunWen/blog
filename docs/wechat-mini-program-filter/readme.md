<!-- Date: 2018-05-04 18:25:17 -->

# wechat 微信小程序中如何创建类似于 Vue 和 Angular 中的过滤器

如果在接口中获取了大量 list 数据，并且想要修改 list 中所有数据的某一个字段，最初使用遍历来实现的方法似乎已经过时了，随着 Vue、Angular、React 的大量使用，大家似乎都已经习惯于在项目中使用过“过滤器”来实现同样的目的，这里记录一下在微信小程序中，如何创建以及使用“过滤器”

简单的用法如下：

`index.wxml`

```html
<wxs module="foo">
module.exports = {
    test: function(data){
      return 'detail='+JSON.stringify(data)
    }
}
<view>{{ foo.test({name: 'zhangsan'})}}}</view>
</wxs>
```

当然了你也可以把 wxs 内容放到一个单独的文件中，比如“filter.wxs"，然后在 wxml 文件中引入该文件
`filter.wxs`

```js
module.exports = {
  test: function(data) {
    return 'detail=' + JSON.stringify(data);
  },
};
```

`index.wxml`

```html
<wxs src="filter.wxs" module="foo">
<view>{{ foo.test({name: 'zhangsan'})}}}</view>
</wxs>
```
