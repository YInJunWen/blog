<!-- Date: 2020-08-12 15:16 -->

# uniapp 中使用 page 标签设置页面背景色无效的问题

问题重现：

```html
<style lang="less" scoped>
    page {
        background-color: red;
        height: 100%;
    }
</style>
```

这段样式目标是为了设置整个页面的背景色，但是在微信小程序中没有任何作用，原因在于 `style`标签上存在`scoped`属性，在编译后的 wxss 文件中可以看到，这段样式被编译成了：

```css
page.data-v-475a72fb {
    background-color: red;
    height: 100%;
}
```

`scoped`指定了`style`标签内的样式都是具有作用域的，所以这个页面内的每个元素都认为添加了`data-v-hash`类名，也是为了保证类名在项目内的唯一性。但是微信小程序中的`page`作为页面的根节点，不会带有`data-v-hash`类名，所以要想解决这个问题需要这么改:

```html
<style lang="less">
    /* 去掉scoped属性 ，就不会在这里编译后的page后添加data-v-hash的类名*/
    page {
        background-color: red;
        height: 100%;
    }
</style>
```
