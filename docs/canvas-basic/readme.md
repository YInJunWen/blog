<!-- Date: 2017-10-31 02:11 -->

# canvas 基础

创建画布：

```
var canvas = DOM.getContext('2d');
```

`canvas.beginPath()`
声明： 要开始创建路径了

`canvas.closePath()`
声明： 创建的路径结束了，必须与 beginPath 结合使用

`canvas.fill()`
方法：路径结束后填充路径内部

`canvas.stroke()`
方法： 路径结束后描边路径

`canvas.fillStyle = "rgb(255,255,255)"`
属性： 设置后面元素的填充颜色

`canvas.strokeStyle = "rgb(244,255,255)"`
属性： 设置后面元素的路径线条颜色

`canvas.fillRect(x,y,xwidth,yheight)`
方法： 创建一个矩形并填充颜色，矩形的原点在 x,y 坐标   宽度和高度 分别是 xwidth, yheight

`canvas.arc(x坐标，y坐标，半径，开始的弧度，结束的弧度，圆的方向)`

方法： 创建一个圆

例如： 创建一个圆形

```js
canvas.beginPath();
canvas.arc(100, 100, 50, 0, Math.PI * 2, true);
canvas.closePath();
canvas.fill(); //填充圆
canvas.stroke(); //描边圆
```

`canvas.moveTo(x坐标，y坐标)`
方法： 创建自定义路径的开始坐标

`canvas.lineTo(x坐标，y坐标)`

方法： 创建自定义路径的中间坐标或结束坐标

例如： 创建一条直线：

```js
    canvas.beginPath();   开始路径
    canvas.moveTo(100,100);    设置路径原点
    canvas.lineTo(140,130);    设置路径中点（终点）
    canvas.closePath();  结束路径
    canvas.stroke()；描边路径
```

例子 2： 创建一个多边形：

```js
canvas.beginPath();
开始路径;
canvas.moveTo(100, 100);
canvas.lineTo(150.15);
canvas.lineTo(200, 209);
canvas.closePath();
结束路径;
canvas.stroke();
描边路径;
```

`canvas.linewidth = "5"`
属性： 设置后面创建元素的描边宽度

`canvas.fillText("这里是要插入的文字")`
方法： 在 canvas 中创建一个内容填充的文字

`canvas.strokeText("这里是要插入的文字")`
方法： 在画布中创建一个描边文字

`canvas.font = "为字体设置的属性"`
属性：设置下面创建的文字的字体大小

例如：设置文字字号是 20px

```
    canvas.font = "20px";
```

例如 2： 设置文字倾斜

```
    canvas.font = "italic 20px"
```

`canvas.clearRect(x坐标，y坐标，x轴上的宽度，y轴上的高度)`
方法： 用一个矩形擦除画布中的一个区域

使 canvas 填充整个屏幕的方法：
   重置样式：

```css
    * {
    margin: 0;
    padding: 0;
}
    canvas {
    display: block;
}
```

```js
canvas.attr('width', $(window).get(0).innerWidth);
canvas.attr('height', $(window).get(0).innerHeight);
```

注意：修改 canvas 画布的宽度和高度的方法重置画布的时候   画布的所有属性将被重置，包括填充颜色 线条颜色等，如果需要在浏览器改变尺寸的同时修改画布的尺寸可以在 js 中添加\$(window).resize()方法

`canvas.save()`
方法： 保存多个画布状态

`canvas.restore();`
方法： 恢复多个画布状态

`canvas.translate(x坐标，y坐标)`
方法： 移动 2D 渲染上下文的坐标原点，千万记住 是改变”2D 渲染山上下文“的原点  ，并不能改变当前绘制对象的原点，建议绘制完成特殊图形后，利用 save(0 和 restore()方法把画布恢复到绘制前的状态

`canvas.scale(x缩放倍数，y缩放倍数)`
方法： 缩放 2D 渲染上下文的尺寸，同样建议绘制完成后，把画布恢复到之前的状态

`canvas.rotate(旋转的弧度)`
方法： 旋转 2D 渲染上下文的”弧度“，千万不能写角度，建议在需要使用旋转的时候，先完成其他变性操作，最后一步执行旋转操作

`canvas.transform(x轴缩放，y轴倾斜，x轴倾斜，y轴缩放，x轴平移，y轴平移)`

获取像素点对应索引值公式

例子：   绘制马赛克

```js
function masaike(lengthX, lengthY) {
    /*
      lengthX 马赛克宽度
      lengthY 马赛克高度
      numX    马赛克列数
      numY    马赛克行数

      */
    var newimg = ctx.createImageData(500, 500),
        imgdata = newimg.data,
        numX = newimg.width / lengthX,
        numY = newimg.width / lengthY;
    for (r = 0; r < numY; r++) {
        //遍历块的行
        for (c = 0; c < numX; c++) {
            //遍历块的列
            //为每一个块设置一个颜色
            var randomColor = Math.floor(Math.random() * 255);
            for (tr = 0; tr < lengthY; tr++) {
                //遍历块内的行
                for (tc = 0; tc < lengthX; tc++) {
                    //遍历块内的列
                    // 获取快内像素点的真实坐标，这里是一个公式
                    var trueX = c * lengthX + tc + 1;
                    var trueY = r * lengthY + tr + 1; // 获取真实左边对应的索引值
                    var trueIndex = ((trueY - 1) * newimg.width + trueX - 1) * 4; // 分别设置像素点的四个值
                    imgdata[trueIndex] = randomColor;
                    imgdata[trueIndex + 1] = randomColor;
                    imgdata[trueIndex + 2] = randomColor;
                    imgdata[trueIndex + 3] = 200;
                }
            }
        }
    } // 绘制图片
    ctx.putImageData(newimg, 0, 0);
}
masaike(10, 10);
```

实例：   翻转颜色

```js
function fanzhuan() {
    var newimg = new Image();
    newimg.src = '11.png';
    $(newimg).load(function () {
        console.log(9);
        ctx.drawImage(newimg, 0, 0);
        imgdata = ctx.getImageData(0, 0, canvas.width(), canvas.height());
        console.log(imgdata.data);
        for (i = 0; i < imgdata.data.length; i++) {
            imgdata.data[4 * i] = 255 - imgdata.data[4 * i];
            imgdata.data[4 * i + 1] = 255 - imgdata.data[4 * i + 1];
            imgdata.data[4 * i + 2] = 255 - imgdata.data[4 * i + 2];
        }
        console.log(imgdata.data);
        ctx.putImageData(imgdata, 0, 0);
    });
}
fanzhuan();
```

实例：   将图片变为灰度

```js
function huidu() {
    var newimg = new Image();
    newimg.src = '11.png';
    $(newimg).load(function () {
        console.log(9);
        ctx.drawImage(newimg, 0, 0);
        imgdata = ctx.getImageData(0, 0, canvas.width(), canvas.height());
        console.log(imgdata.data);
        for (i = 0; i < imgdata.data.length; i++) {
            // 计算灰度值：  三个颜色值加起来的平均值 就是灰度值
            var average = (imgdata.data[4 * i] + imgdata.data[4 * i + 1] + imgdata.data[4 * i + 2]) / 3;
            imgdata.data[4 * i] = average;
            imgdata.data[4 * i + 1] = average;
            imgdata.data[4 * i + 2] = average;
        }
        console.log(imgdata.data);
        ctx.putImageData(imgdata, 0, 0);
    });
}
huidu();
```

实例： 像素画处理图片（马赛克效果）

## 图像像素画

第一种方式：通过遍历块内的像素点，直接修改像素点的颜色值：

```js
function xiangsu(lengthX, lengthY) {
    var img = new Image();
    img.src = '00.png';
    $(img).load(function () {
        ctx.drawImage(img, 0, 0);
        var newimg = ctx.getImageData(0, 0, canvas.width(), canvas.height()), // var newimg = ctx.createImageData(500, 500),
            imgdata = newimg.data,
            numX = newimg.width / lengthX,
            numY = newimg.width / lengthY;
        for (r = 0; r < numY; r++) {
            //遍历块的行
            for (c = 0; c < numX; c++) {
                //遍历块的列
                //为每一个块设置一个颜色
                var randomColorX = c * lengthX + Math.floor(lengthX / 2),
                    randomColorY = r * lengthY + Math.floor(lengthY / 2),
                    randomColorIndex = ((randomColorY - 1) * newimg.width + randomColorX - 1) * 4,
                    randomColorRed = imgdata[randomColorIndex],
                    randomColorGreen = imgdata[randomColorIndex + 1],
                    randomColorBlue = imgdata[randomColorIndex + 2];
                for (tr = 0; tr < lengthY; tr++) {
                    //遍历块内的行
                    for (tc = 0; tc < lengthX; tc++) {
                        //遍历块内的列
                        // 获取快内像素点的真实坐标，这里是一个公式
                        var trueX = c * lengthX + tc + 1;
                        var trueY = r * lengthY + tr + 1; // 获取真实左边对应的索引值,这里也是一个公式

                        var trueIndex = ((trueY - 1) * newimg.width + trueX - 1) * 4; // 分别设置像素点的四个值
                        imgdata[trueIndex] = randomColorRed;
                        imgdata[trueIndex + 1] = randomColorGreen;
                        imgdata[trueIndex + 2] = randomColorBlue; // imgdata[trueIndex+3] = 255;
                    }
                }
            }
        } // 绘制图片
        ctx.putImageData(newimg, 0, 0);
    });
}
```

// 图像像素画 // 第二种方式，在块上直接绘制新的与快同样大小的图形

```js
function xiangsu2(lengthX, lengthY) {
    var img = new Image();
    img.src = '00.png';
    $(img).load(function () {
        ctx.drawImage(img, 0, 0);
        var newimg = ctx.getImageData(0, 0, canvas.width(), canvas.height()), // var newimg = ctx.createImageData(500, 500),
            imgdata = newimg.data,
            numX = newimg.width / lengthX,
            numY = newimg.width / lengthY;
        for (r = 0; r < numY + 1; r++) {
            //遍历块的行
            for (c = 0; c < numX + 1; c++) {
                //遍历块的列
                //为每一个块设置一个颜色
                var randomColorX = c * lengthX + Math.floor(lengthX / 2),
                    randomColorY = r * lengthY + Math.floor(lengthY / 2),
                    randomColorIndex = ((randomColorY - 1) * newimg.width + randomColorX - 1) * 4,
                    randomColorRed = imgdata[randomColorIndex],
                    randomColorGreen = imgdata[randomColorIndex + 1],
                    randomColorBlue = imgdata[randomColorIndex + 2];
                ctx.fillStyle = 'rgba(' + randomColorRed + ',' + randomColorGreen + ',' + randomColorBlue + ',255' + ')'; // ctx.fillRect(r*lengthX,c*lengthY,lengthX,lengthY);
                ctx.beginPath();
                ctx.arc(r * lengthX, c * lengthY, lengthX / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
    });
}
xiangsu2(20, 20);
```
