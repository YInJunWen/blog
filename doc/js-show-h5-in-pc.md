# 如何在 PC 上展示移动端页面的效果

这个问题需要一步一步解决。

## rem 基数设置

移动端项目中的元素尺寸都是以`rem`为单位，rem 的基数又是以`html`的`font-size`为准的，移动端的设置如下：

```js
document.getElementsByTagName("html")[0].style.fontSize = window.innerWidth;
```

在 PC 中这样写就会导致 html 的`font-size`属性失常，变得非常大，整个页面布局就都乱了，需要改成下面的样式

```js
document.getElementsByTagName("html")[0].style.fontSize =
  window
    .getComputedStyle(document.getElementsByTagName("body")[0])
    .width.slice(0, -2) /
    10 +
  "px";
```

仅仅这样是肯定不够的，因为 body 的宽度默认是和 window 宽度相差很小的，再没有重置样式的情况下，body 的宽度还要用 window 的宽度减去默认的 margin 值，因此我们需要针对 PC 下的 body 元素专门设置一个宽度，先判断浏览器是否是在 PC 下

```js
function isMobile() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    return true;
  } else {
    return false;
  }
}
if (!isMobile()) {
  document.querySelector("html").className = "pc";
}
```

这样我们在 PC 上访问的时候，就会自动给 html 添加一个`pc`的类名，再来专门设置 pc 下的 body 样式

```css
.pc {
  body {
    max-width: 440px;
    max-height: 800px;
    min-width: 440px;
    min-height: 800px;
    margin: 0 auto;
    outline: 1px solid @dlc;
    box-sizing: border-box;
  }
}
```

现在，我们的 body 在 PC 上显示的样式就和移动端一样了，html 元素的`font-size`属性也达到了我们的要求。

## 固定定位的改动

项目中有一些使用`position:fixed`的元素，比如一些公共的`header`，一些全局使用的弹窗，都需要改动一下，这个属性是根据 window 来定位的，在 PC 中就不能这样了，需要把他们改成相对定位，我会把他们设置成相对 body 的定位，来使这些组件在 PC 中样式与移动端保持一致。
注意 -
这个时候要注意一点，当我们在 chrome 的开发者工具中查看 body 元素的时候，就会发现虽然 body 的 width 是我们想要的宽度，但如果你给 body 一个背景图片，这个背景图片，仍然是沾满全屏的。这个特性，就可以帮助我们，在 PC 中展示移动端项目的时候，为项目添加一个好看的背景
