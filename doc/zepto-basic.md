# Zepto笔记

### 使用注意事项：
- 页面必须有viewport属性
- touch(tap)事件，是zepto本身不包含的，要引入touch.js文件才可以使用
- 类似于JQuery的animate事件，必须单独引入fx.js文件

### 开始加载脚本
````
Zepto(function($){
    Code...
})
````

### ZeptoJS与 UC浏览器的手势事件冲突
关闭UC浏览器默认手势
````
navigator.control.gesture(false);
````
关闭UC浏览器默认长按事件
````
navigator.control.longpressMenu(false);
````

### $.container(parentNode,node)
这个用法是检查父节点是否包含子节点，包含则返回true，不包含则返回false；

里面的两个参数必须是DOM节点，如果使用$()方式获取到的元素要加上get(0)

### console.log()方法中的格式化输出
console对象的上面5种方法，都可以使用printf风格的占位符。不过，占位符的种类比较少，只支持字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）四种。

### $.fn 输出Zepto对象上所有的方法
这个方法直接返回一个数组，数组里面包含所有Zepto的方法，但是要注意：

如果只引入了Zpeto.js文件，这个方法只能返回他本身包含的模块，如果要让返回的数组中包含其他方法，比如touch事件中的tap、swipeUp等方法，必须引入相应的js文件

### 添加元素到一个Zepto对象集合形成一个新的数组
    console.log($('.div1').concat( $('.div2') ) );
    //  div.div1
    //  div.div2
- 这个方法和JS的concat是不一样的;JS中的concat方法是连接连接两个数组，而这里的方法连接的是Zepto对象或元素，形成一个新的数组集合
- 这个方法返回的数组里面是DOM对象，而不是Zepto对象！！也就是说：


    $.each($('.div1').concat( $('.div2') ), function(index,value){
        console.log(value.nodeName);            
    })
    //  DIV
    //  DIV 


### $.isPlainObject()检查对象是否是“纯粹”的对象
这里的纯粹的对象指的是通过new object或者{}定义的对象，其他类型的对象，比如function方法，就不是一个纯粹的对象

    var myObj = new Object();
    console.log($.isPlainObject(myObj));    //  true
    
    var myObj2 = {};
    console.log($.isPlainObject(myObj2));   //  true
    
    var myFunction = function(){ };
    console.log($.isPlainObject(muFunction));    //  false


### data()方法的使用
- Zepto基础文件的data方法只能存储字符串形式的内容，也就是说，如果你想存储一个JSON对象，他会存储成字符串&[Object object]&;
- 如果想要直接存储为对象形式，必须引入Zepto的data.js文件

### forEach 遍历数组
Zepto的forEach方法和API文档上的有所不同，API上写的方法是
    
    forEach(function(index,valule,array){ })

但是发现并不能正常使用，需要这样用：

    array.forEach(function(index,value){ })

### index 获取元素的索引值
格式：

    $(element).index(collection)
如果collection不存在，则获取前面元素在兄弟元素中的索引位置，如果存在，则获取在collection中的索引位置

### Zepto中offset、offsetParent、position的区别
- offset是获取元素与document的位置包含left，top，width，height四个属性
- position是获取对象集合中第一个元素的位置，如果他有相对元素，则获取相对于相对元素的位置，返回值包含top,left两个属性
- offsetParent 获取到的是第一个定位的祖先元素 而**不是位置**！！


### Zepto中的新方法pluck
pluck是获取元素的属性值，包含nodeName等属性，相当于
    
    $(element).get(0).nodeName;

### push方法
Zepto的push方法，是将新的元素放到元素集合的最后，而JS的push方法是向数组最后添加一个元素