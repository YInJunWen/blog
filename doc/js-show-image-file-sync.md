# 实时预览选择的图片文件

最初的实时预览选择的图片文件，是使用 ajax 直接上传后，由服务器返回一个 uri 地址，再显示出来的，后来发现了一个由浏览器本身提供的一个接口`Url.createObjectUrl(file/bob)`;

这个方法接收一个 file 或者 blob 作为参数，要注意的是 blob 作为参数的方法是不被推荐的，这个参数正在被弃用。方法执行后，会创建一个新的 URL 对象，哪怕使用相同的 file 参数，他也会生成一个新的 URL 对象， 因此在使用 URL 后，一定要记得及时手动释放它， 虽然浏览器在文档被关闭的时候也会自动释放，但是为了更好的性能和内存使用情况，最好是手动释放；

## 案例

```js
<form action=">
 <input type="file" name="file" onchange="shwTHhumb()">
</form>
<div id="thumb" />

// js
function shwTHhumb(){
 var inputEle = document.querySelector('form');
 var url = URL.createObjectURL(inputEle.files[0]);
 document.querySelector('#thumb').style.backgroundImage = "url("+url+")";
}
```

这样看起来似乎是已经实现了实时预览的功能，但还是有缺陷的，比如我应该在图片加载完成的时候，在设为 thumb 的背景图片。这个时候就需要使用到`img.onload`事件了,实现如下：

```js
function shwTHhumb() {
  var inputEle = document.querySelector("form");
  var url = URL.createObjectURL(inputEle.files[0]);
  var img = new Image();
  img.src = url;
  img.onload = function() {
    document.querySelector("#thumb").style.backgroundImage = "url(" + url + ")";
  };
}
```

这样就完成了吗？ 并没有，因为还没有手动释放生成的 URL 对象， 这个释放事件应该是在图片加载完成的时候，与设置 thumb 的背景图片同时执行的，代码如下：

```js
function shwTHhumb() {
  var inputEle = document.querySelector("form");
  var url = URL.createObjectURL(inputEle.files[0]);
  var img = new Image();
  img.src = url;
  img.onload = function() {
    document.querySelector("#thumb").style.backgroundImage = "url(" + url + ")";
  };
}
```

测试的时候，选择文件期间，打开了选择文件框，但我点击了取消，这个时候 input 元素照样执行了 onchange 事件，这个时候，就要把 thumb 的背景图片取消了，如果不取消的话，在最后提交表单的时候，虽然 thumb 有图片显示，实际上 input 表单上是没有文件数据的，就容易导致开发人员以为文件已经传递出去了，因此我们执行上面操作 ed 时候，要先判断用户是不是执行了取消了选择文件操作：

```js
function shwTHhumb(){
 var inputEle = document.querySelector('form');
 if(inputEle.value!='){
  var url = URL.createObjectURL(inputEle.files[0]);
  var img = new Image();
  img.src = url;
  img.onload = function(){
   document.querySelector('#thumb').style.backgroundImage = url('url');
   setTimeout(function(){
    URL.revokeObjectURL(url);
   }, 500)
  }
 }else{
  document.querySelector('#thumb').style.backgroundImage = ";
 }
}
```

至此为止，实时预览图片功能就完成了

最后，千万不要忘记你的图片不用的时候释放临时资源，方法是

```
URL.revokeObjectURL(资源句柄);
```

更多方法看https://developer.mozilla.org/zh-TW/docs/Using_files_from_web_applications
