# zepto 笔记

### 使用注意事项：

* 页面必须有 viewport 属性
* touch(tap)事件，是 zepto 本身不包含的，要引入 touch.js 文件才可以使用
* 类似于 JQuery 的 animate 事件，必须单独引入 fx.js 文件

### 开始加载脚本

```
Zepto(function($){
    Code...
})
```

### ZeptoJS 与 UC 浏览器的手势事件冲突

关闭 UC 浏览器默认手势

```
navigator.control.gesture(false);
```

关闭 UC 浏览器默认长按事件

```
navigator.control.longpressMenu(false);
```

### $.container(parentNode,node)

这个用法是检查父节点是否包含子节点，包含则返回 true，不包含则返回 false；

里面的两个参数必须是 DOM 节点，如果使用$()方式获取到的元素要加上 get(0)

### console.log()方法中的格式化输出

console 对象的上面 5 种方法，都可以使用 printf 风格的占位符。不过，占位符的种类比较少，只支持字符（%s）、整数（%d 或%i）、浮点数（%f）和对象（%o）四种。

### $.fn 输出 Zepto 对象上所有的方法

这个方法直接返回一个数组，数组里面包含所有 Zepto 的方法，但是要注意：

如果只引入了 Zpeto.js 文件，这个方法只能返回他本身包含的模块，如果要让返回的数组中包含其他方法，比如 touch 事件中的 tap、swipeUp 等方法，必须引入相应的 js 文件

### 添加元素到一个 Zepto 对象集合形成一个新的数组

    console.log($('.div1').concat( $('.div2') ) );
    //  div.div1
    //  div.div2

* 这个方法和 JS 的 concat 是不一样的;JS 中的 concat 方法是连接连接两个数组，而这里的方法连接的是 Zepto 对象或元素，形成一个新的数组集合
* 这个方法返回的数组里面是 DOM 对象，而不是 Zepto 对象！！也就是说：


    $.each($('.div1').concat( $('.div2') ), function(index,value){
        console.log(value.nodeName);
    })
    //  DIV
    //  DIV

### $.isPlainObject()检查对象是否是“纯粹”的对象

这里的纯粹的对象指的是通过 new object 或者{}定义的对象，其他类型的对象，比如 function 方法，就不是一个纯粹的对象

    var myObj = new Object();
    console.log($.isPlainObject(myObj));    //  true

    var myObj2 = {};
    console.log($.isPlainObject(myObj2));   //  true

    var myFunction = function(){ };
    console.log($.isPlainObject(muFunction));    //  false

### data()方法的使用

* Zepto 基础文件的 data 方法只能存储字符串形式的内容，也就是说，如果你想存储一个 JSON 对象，他会存储成字符串&[Object object]&;
* 如果想要直接存储为对象形式，必须引入 Zepto 的 data.js 文件

### forEach 遍历数组

Zepto 的 forEach 方法和 API 文档上的有所不同，API 上写的方法是

 forEach(function(index,valule,array){ })

但是发现并不能正常使用，需要这样用：

    array.forEach(function(index,value){ })

### index 获取元素的索引值

格式：

    $(element).index(collection)

如果 collection 不存在，则获取前面元素在兄弟元素中的索引位置，如果存在，则获取在 collection 中的索引位置

### Zepto 中 offset、offsetParent、position 的区别

* offset 是获取元素与 document 的位置包含 left，top，width，height 四个属性
* position 是获取对象集合中第一个元素的位置，如果他有相对元素，则获取相对于相对元素的位置，返回值包含 top,left 两个属性
* offsetParent 获取到的是第一个定位的祖先元素 而`不是位置`！！

### Zepto 中的新方法 pluck

pluck 是获取元素的属性值，包含 nodeName 等属性，相当于

 $(element).get(0).nodeName;

### push 方法

Zepto 的 push 方法，是将新的元素放到元素集合的最后，而 JS 的 push 方法是向数组最后添加一个元素
