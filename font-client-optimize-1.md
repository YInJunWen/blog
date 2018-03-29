# 前端优化方案

> 前端的优化方案是在太多了，今天开始一个一个的记录下来，后期会不定时增加

## 使用 dns-prefetch

浏览器在输入某个域名后，正常情况话会去 DNS 服务器查询域名对应的真实 IP 地址，一次典型的 DNS 解析需要 20~120ms 左右的时间，除了要尽可能减少 DNS 解析之外，我们可以通过预查询的方式提前进行 DNS 解析，开启方法只需要在`<head>`标签内加入下面代码即可

```html
<meta http-equiv="x-dns-prefetch-control" content="on">
<link ref="dns-prefetch" href="//a.test.cn">
<link ref="dns-prefetch" href="//b.test.cn">
```

实际上现在大多数浏览器，已经做到了隐式、智能的 DNS 预解析。关闭隐式 dns 预解析的方法如下：

```html
<meta http-equiv="x-dns-prefetch-control" content="off">
```

虽然使用预解析可以提高前端性能(减少用户的等待时间)但也不能滥用，有技术人员指出，禁用掉 DNS 预解析，每个月可以减少 100 亿次的 DNS 查询。

## 减少页面重排与重绘

在浏览器中更改元素的样式属性，经常会导致页面的重排`reflow` 和重绘`repaint`,如果不太了解可以参考[网页性能管理-阮一峰](http://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)。

比如下面的代码

```js
let top = div.offsetTop;
div.style.top = top + 10 + "px";
let top = div.offsetLeft;
div.style.left = top + 10 + "px";
```

这段代码中，每获取 div 的位置都会强制浏览器渲染一次，才去获取 div 的样式属性值，改变 div 位置的时候，又导致了大量的重排和重绘，这样就导致浏览器需要进行至少 4 次渲染(render)，严重影响了浏览器的处理时间和速度。最好是把读取属性和改变属性的事件合并在起，像下面这样

```js
let top = div.offsetTop;
let top = div.offsetLeft;
div.style.top = top + 10 + "px";
div.style.left = top + 10 + "px";
```

现在浏览器只需要 2 次渲染就可以达到相同的目标了。

## 减少直接对 DOM 的直接操作

先看下面的例子

```js
let div = document.querySelector("div");
let form = document.createElement("form");
div.appendChild(form);
let input = doucment.createElement("input");
form.appendChild(input);
let button = doucment.createElement("button");
form.appendChild(button);
```

这个案例其实也牵扯到了导致浏览器多次重排和重绘的问题，我们可以通过下面的方案来对他进行优化:

```js
let div = document.querySelector("div");
let form = document.createElement("form");
let input = doucment.createElement("input");
form.appendChild(input);
let button = doucment.createElement("button");
form.appendChild(button);
div.appendChild(form);
```

优化后的方案中，form 在插入到 div 元素中之前，只是一个**虚拟元素**，不会引起浏览器的重排与重绘，只会引发一次浏览器的渲染行为。

除了调整操作元素顺序，也可以使用 "空白片段文档" `document.createDocumentFragment()`方法来操作 DOM，相关内容可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment)

还有一种备用方法，就是先把要操作的元素设置为`display:none`,等操作完成后再设置为`display:block`,只需要 2 次重新渲染即可完达到相同目的

## 适时使用 web worker

如果你的页面某个部分存在大量计算程序，为了不让这个计算程序阻塞 JS 主线程，就可以考虑使用`web worker`这个神器了，比如：

`index.js`

```js
// 新建web-worker线程
var worker = new Worker("./main.js");

// 给worker发送参数
worker.postMessage([1, 2]);

// 监听worker的回传事件
worker.onmessage = function(message) {
    // 回传的数据也保存在 message.data中
    console.log(message.data);

    // 如果需要可以使用 terminate 方法，关闭worker线程
    worker.terminate();
};
```

`main.js`

```js
// 监听主线程发送过来的数据
onmessage = function(message) {
    // 传递过来的数据存放在message.data内
    let result = message.data.reduce((a, b) => {
        return a + b;
    }, 0);

    // 回传计算后的数据给主线程
    postMessage(result);

    // 如果需要，可以直接使用 close 方法，关掉worker线程
    close();
};
```

## 多域名拆分

实际项目中，我们会经常看到页面中引入的资源使用了不同的域名(这里说的不包含 CND 资源)，到底是为什么要这儿做呢？具体有两方面的原因。先看一下 cookie 的规则：

*   document.cookie 只能获取当前域下的 cookie 内容，即便使用 document.doman 重置了域名也**不能**获取到超级域的 cookie

*   document.doman 只允许在子域页面中设置为超级域，不能在超级域页面中设置为子域

*   请求资源(这里不包含 ajax,多数时候指得是图片等静态资源)的时候，如果资源和页面属于同一个域，会把本域下的 cookie 自动发送给服务端，如果不属于同一个域，会自动把**资源所属域**下的 cookie 信息(如果有 cookie 的话)发送到服务端

*   请求不同域资源的时候，如果资源所属域下有 cookie，这些 cookie 也会在开发者工具中显示出来，但不可以被 document.cookie 获取到

`test.com/index.html`

```html
<!-- 假设本页面已有cookie: name=zhangsan -->
<img src="http://a.test.com/logo.png">
```

`a.test.com/index.html`

```html
<!-- 假设本页面已有cookie: age=12 -->
<img src="http://test.com/logo.png">
```

在没有插入图片标签的时候，两个页面在开发者工具中显示的 `cookie` 信息如下

| 页面       | cookie        | path       |
| ---------- | ------------- | ---------- |
| test.com   | name=zhangsan | test.com   |
| a.test.com | age=12        | a.test.com |

在 test.com 中插入引用了 `a.test.com` 服务器中的图片后，开发者工具中显示的 `cookie` 信息如下：

| 页面       | cookie        | path       |
| ---------- | ------------- | ---------- |
| test.com   | name=zhangsan | test.com   |
| test.com   | age =12       | a.test.com |
| a.test.com | age=12        | a.test.com |

相对应的，在 `a.test.com` 中插入引用了 `test.com` 服务器中的图片后，开发者工具中显示的 `cookie` 信息如下：

| 页面       | cookie        | path       |
| ---------- | ------------- | ---------- |
| a.test.com | name=zhangsan | test.com   |
| a.test.com | age =12       | a.test.com |
| test.com   | name=zhangsan | test.com   |

在 `test.com/index.html` 页面中获取一下 `document.cookie`，信息如下

```
name=zhangsan
```

可以发现 `document.cookie` 并**没有获取到** `a.test.com` 域下的 `cookie` 信息，只能在请求资源的时候，把 `cookie` 传递给服务器
