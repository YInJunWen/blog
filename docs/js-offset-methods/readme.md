# js 获取元素相对于屏幕的位置

JS 获取 DOM 先对于屏幕的位置，可以使用 offsetLeft 与 offsetparent 结合的方式获取，因为 offsetLeft 获取的是相对于父级的位置，要想获取相对于屏幕的位置，可以通过 dom.offserParent != null 来判断是否继续向上获取，代码如下：

```
function getLeft(e){
 var offset=e.offsetLeft;
 if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
 return offset;
}
```
