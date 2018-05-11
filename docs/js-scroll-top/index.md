# 获取浏览器滚动条高度 scrollTop

> 经常会遇到检测浏览器滚动条事件获取 scrollTop 的需求，由于 safari、IE、chrome 等浏览器在这方面的不统一，导致我们必须通过一个复杂的计算来获取。

###各浏览器下 scrollTop 的差异###

####IE6/7/8####

对于没有 doctype 声明的页面里可以使用 `document.body.scrollTop` 来获取 scrollTop 高度 ；

对于有 doctype 声明的页面则可以使用 `document.documentElement.scrollTop`；

####Safari:####

safari 比较特别，有自己获取 scrollTop 的函数 ：`window.pageYOffset` ；

####Firefox:####

火狐等等相对标准些的浏览器就省心多了，直接用 `document.documentElement.scrollTop` ；

获取 scrollTop 值

完美的获取 scrollTop 赋值短语 ：

```js
var scrollTop =
  document.documentElement.scrollTop ||
  window.pageYOffset ||
  document.body.scrollTop;
```
