<!-- Date: 2018-06-05 01:05:38 -->

# js 获取 DOM 元素的方法

> 在 H5 出来之前我们想获取一个元素，是通过 document.get 类方法,再通过一系列的节点操作，来获取指定元素，H5 出现后，有了一个新的 query 方法。

那么这两个方法有什么不同？

get 类方法，包含我们常见的`getElementById、getElementsByClassName、 getElementsByTagName、 getElementsByName`。

query 类方法只有两种，`querySelect、querySelectAll`。

## 1.运行速度不同

query 类方法比 get 类方法的运行速度快了 7~8 倍，比 jquery 的查找元素方法，快了 10 倍以上，这是因为 jquery 中对查找元素的方法进行了二次封装

## 2.方便程度不同

get 类方法如果想查找一个深层次的元素，可能需要在 get 方法后，配合其他的一些节点操作方法，比如 parentNode，childNodes 等，而 query 类方法的参数可以直接通过 css 选择器的方法去筛选过滤元素，可以一次到位 3.选择模式不同 -
选取 DOM 的模式有两种，动态选取和静态选取。

```js
<ul>
    <li>0</li>
</ul>
<script>
    window.onload = function(){
        var oU = document.querySelector('ul');
        var oL = document.getElementsByTagName('li');
        var oL2 = document.querySelectorAll('li');
        oU.addEventListener('click', function(e){
            var li = document.createElement('li');
            li.innerHTML = oL.length;
            oU.appendChild(li);
            console.log(oL.length);
            console.log(oL2.length)
        })
    }
</script>
```

运行后，我们发现，`oL.length`在每次点击后的数值都是+1 的，而`oL2.length`始终是 1，也就是说

* get 类方法是动态方法，当 DOM 发生了新建或者删除节点的事件，通过该类选取的 DOM 会`自动`发生变化
* query 类方法是静态方法，选取 DOM 后就会被保存下来，不会跟着 DOM 的改变而`自动`改变
