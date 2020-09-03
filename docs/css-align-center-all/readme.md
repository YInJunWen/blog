<!-- Date: 2016-11-28 23:57 -->

# css 如何实现一个元素在父元素中上下左右居中

## html

```html
<div class="&parent&">
    <div class="&child&"></div>
</div>
```

## 第一种：position+transform/margin

```css
.parent {
    width: 100%;
    height: 100%;
    position: relative;
    .child {
        width: 100px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.parent {
    width: 100%;
    height: 100%;
    position: relative;
    .child {
        width: 100px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -25px;
        margin-bottom: -25px;
        margin-left: -50px;
        margin-right: -50px;
    }
}
```

## 第二种：float+transform

```css
.parent {
    width: 100%;
    height: 100%;
    position: relative;
    .child {
        width: 100px;
        height: 50px;
        float: left;
        margin-top: 50%;
        margin-left: 50%;
        transform: translate(-50%, -50%);
    }
}
```

## 第三种：css 弹性布局 Flex

```css
.parent {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .child {
        width: 100px;
        height: 50px;
    }
}
```
