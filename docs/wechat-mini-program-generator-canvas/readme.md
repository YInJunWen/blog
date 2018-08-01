<!-- Date: 2017-07-21 15:50:16 -->

# wechat 微信小程序中如何把通过 canvas 生成的图片上传到服务器

在一个小程序项目中，需要前端使用 canvas 生成图片，并把图片上传到指定的服务器，实现代码如下

`wxml`

```html
<canvas canvas-id="canvas"></canvas>
<button bindtap="generatorImage">generator</button>
```

`wxjs`

```js
Page({
  generatorImage() {
    let ctx = wx.createCanvasContext('canvas', this);
    let bg = '/static/cards/card-bg-1.png'; // 这里是我的示例图片，保存在项目中
    ctx.drawImage(bg, 0, 0, 190, 114);
    ctx.draw(true, () => {
      wx.canvasToTempFilePath(
        // 这里一定要记得放在draw()方法的毁掉函数中，否则上传的会是一个空白图片
        {
          canvasId: 'canvas',
          success(res) {
            wx.uploadFile({
              url: 'http://localhost/index.php',
              filePath: res.tempFilePath,
              name: 'testFile', //  后端通过这个字段获取到对应得文件
              formData: {
                name: 'zhangsan', // 这里的数据可以通过 $_POST 获取到，下面的php代码中有显示
              },
              success(res) {
                console.log(res);
              },
            });
          },
        },
        this
      );
    });
  },
});
```

`php`

```php
<?php
    $file = $_FILES['testFile'];
    $tmpPath = $file['tmp_name'];
    $savepath = __DIR__.'/test.png';    // 我这里自定义了一个固定的文件名，实际项目中，请按需使用
    if(!file_exists($tmpPath)){
        echo 'tmp file not found';
    }
    if(move_uploaded_file($tmpPath, $savepath)){
        echo 'save success';
        echo json_encode($_POST);  //  这里可以获取到wx.uploadFile中参数formData中的数据  {"name":"zhangsan"}
    }else{
        echo 'save fail';
    }
?>
```

要注意以下几点:

* 由于官方推荐使用 wx.createCanvasContext()方法，需要指定对应的 canvas-id，因此 wxml 中必须显式插入一个 canvas 元素
* wxml 中的 canvas 必须是可见的，也就是说不能设置为 `display：none`
* 如果想让 canvas 不可见，可以通过暗度陈仓的方式，比如设置为 `position:fixed;top:-100%;left: 0;`
