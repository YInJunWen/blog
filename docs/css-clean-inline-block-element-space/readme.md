<!-- Date: 2016-12-19 01:55:40 -->

# css 清除内联元素之间的间隙

内联元素或者内联块元素之间有一个默认间距，可以通过设置父级元素`font-size: 0`来清除间距，但是不要忘记重置内联元素的字号

```html
.html
<div>
 <span>1</span>
 <span>2</span>
 <span>3</span>
</div>
```

```css
div {
  font-size: 0;
  span {
    font-size: 16px;
    display: inline-block;
  }
}
```
