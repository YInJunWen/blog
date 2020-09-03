<!-- Date: 2016-05-15 06:18 -->

# angularJS 中的文件上传

angular 中对 input[type=file]使用 ng-change 无效，解决办法如下：

## 可见上传按钮的实现方式

```html
<input onchange="angular.element(this).scope().change()" />
```

其中 angular.element(this)是获取这个元素

.scope()应该是获取当前元素的作用域的实例，然后调用其中的 change 方法，

change 方法可以在 controller 或者 directive 中指定，我一般会在 change 方法中传递当前的这个 input 节点，类似于这样：

```html
<input onchange="angular.element(this).scope().change(this)" />
```

把当前的 input 节点传递给事件，就可以针对节点来处理一些事件了，

对于 input[type=file]类型来说，最常用的处理事件无非就是实时预览获取的图片文件，方法如下：

```js
var imgUrl = URL.createObjectURL(ele.files[0]);
angular
    .element(ele)
    .parent('.upload')
    .next('.thumb')
    .css({
        backgroundImage: 'url(' + imgUrl + ')',
    });
```

## 不可见按钮的实现方式

```html
<input type="file" style="display: none;" onchange="angular.element(this).scope().fileChange(this)" name="file" /> <button class="btn_default" ng-click="addImage()">添加图片</button>
```

```js
$scope.addImage = function () {
    document.querySelector('input[type=file]').click();
};
```

## 上传

```js
$http({
    url: url,
    method: &POST&,
    headers: {
        &Content-Type&: undefined,
    },
    transformRequest: function () {
        var formData = new FormData();

        angular.forEach(data, function (item, index) {
            if (angular.isArray(item)) {
                angular.forEach(item, function (value, key) {
                    formData.append(index, value)
                })
            } else {
                formData.append(index, item);
            }
        })
        formData.append('token', cache.get('token'));
        formData.append('usid', cache.get('usid'));
        return formData;
    }
}).then(function (res) {

}， function(){

}）
```

1.  这段代码中，`Content-Type: undefined`指定使用 angular 的\$http 服务的默认类型
2.  中间的 foreach 循环主要是为了方便多个文件上传使用，在文件上传的时候，我们的模型中可能会出现一个字段对应一个包含了多个 File 的数组，需要用 foreach 转成正确的 formdata 类型，后台才能正确接收到文件
