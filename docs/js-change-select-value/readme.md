<!-- Date: 2017-11-02 10:07 -->

# js 改变 select 元素的值

select 元素在没有设置属性 selected 的子元素时，默认使用第一个 option 的 value 值作为 select 的值

```html
<select id="test">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
</select>
```

方法一：通过修改 select 元素的 value 值

```js
window.onload = function () {
    document.querySelector('#test').value = '2';
};
```

方法二：通过为 option 元素添加 selected 属性

```js
window.onload = function () {
    let ele = document.querySelectorAll('option')[2];
    ele.setAttribute('selected', true);
    //   或者
    ele.selected = true;
};
```

通过 setAttribute 和直接设置元素 selected 属性的区别在于：

-   setAttribute 会显式在 element 中表明 selected 属性
-   直接设置属性，也可以达到修改 select 值的效果，但不会在 element 上显示

这里设置 selected 属性为 true，实际上可以设置为任何结果为 true 的表达式，比如 1，'selected'等等

## 设置 selected 属性的时候尤其要注意：

通过 JS 把 option 元素的 selected 设置为值为 false 的任何表达式，都是`无效`的
