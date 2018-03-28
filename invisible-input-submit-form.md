# 不可见的 input 元素会默认添加到表单中提交吗?

> 在传统的 form 表单提交中，常见的是可见的 input 元素，那么 css 设置为`display:none`的 input 元素可以添加到 post 数据中去吗？我这里做了一个小 demo

## index.php

```html
<form action="test.php" method="POST">
   <input value="" style="display:none;"lass="export_value" name="export" type="text">
    <button class="export" type="submit" >export </button>
</form>
<script >
    var exportbtn = document.querySelector('.export');
    var input = document.querySelector('.export_value');
    exportbtn.onclick=function(){
        input.value = 'Y'
    }
</script>
```

test.php

```php
<?php
     print(json_encode($_POST));
?>
```

上面的例子执行后，在`test.php`页面正确输出了`{'wxport'=> 'Y'}`的值， 说明了两点

*   input 元素只要存在，哪怕被设置为不可见状态，他的值也是可以被添加到表单中，提交到对应文件中去的
*   在`form`表单中`type`属性设置为`submit`的`button`或者`input`元素，点击提交后会自动触发表单，但是如果人为给他们他们添加了时间，表单会在事件执行完毕后提交。注意： 如果你的点击事件包含了大量的逻辑运算或者异步操作，最好使用`event.preventDefault()`方法，阻止表单的自动提交，改为手动提交。
