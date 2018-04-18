# JS 中的 innerHTML 方法

> 使用原生 JS 操作 DOM 的时候，我们经常使用 innerHTML 去插入新的元素，但这种方法是不可取的

```html
<div>
    <p></p>
</div>
```

假设我们有上面的两个 DOM 元素，我们想在 p 元素后面插入一个新的元素，然后把 p 元素的颜色改为红色，通过`innerHTML`我们会这样做

```js
var oD = document.querySelector("div");
var oP = document.querySelector("p");
oD.innerHTML += "<a>href</a>"; // 注意：这里用的是  +=
oP.style.color = "red";
```

这段代码表面上看起来，是没有问题的，应该能实现我们的目的，但是在浏览器中打开，却发现 a 元素确实插入进去了，但是 P 元素的颜色却没有修改成功，这是为什么呢？

因为通过 innerHTML 插入的内容后，显示的 P 元素已经不是当初的 P 元素了，而我们的`oP`，表示的是我们的更新之前的元素，虽然给他设置了颜色，但是它已经不在 DOM 中，我们看不到了。

那么我们用什么呢？ 除了 innerHTML，js 还提供了许多操作 DOM 元素的方法，比如我们可以使用`appendChild`方法来插入我们新的`a`元素

```js
var oD = document.querySelector("div");
var oP = document.querySelector("p");
var oA = document.createElement("a");
oD.appendChild(oA);
oP.style.color = "red";
```

现在就完全达到我们的目的了，既插入了新的元素，又改变了 p 元素的颜色。
