# js 表单提交的那些事儿

## 获取表单元素

先说说获取表单元素，通常我们会给表单以及他下面的 input 控件添加一个 `name` 属性，方便我们通过`formName.inputName`来获取到对应的元素，一般来说在同一个页面不允许出现两个相同的 `name` 属性，如果出现相同 `name` 属性的元素，上面介绍的`formName.inputName`方法会返回一个 `nodeList`,
此时需要使用添加下标的方法`formName.inputName[0]`来获取想要的元素。当然了最好还是**不要声明两个相同 `name` 属性**的表单

## js 获取表单元素的值

```html
<form name="form1">
    <input type="text" value="16" name="age">
</form>
```

除了我们熟知的`getElementById`等方法可以获取到 `input` 元素之外，还可以通过`formName.inputName`来直接获取到想要的元素,比如上面的代码中我们就可以直接通过`form1.age`来获取到年龄所在的 `DOM`，进而可以使用`form1.age.value`来获取到具体的值。

注意：一般来说在同一个页面**不允许**出现两个相同的 `name` 属性，如果出现相同 `name` 属性的元素，上面介绍的`formName.inputName`方法会返回一个 `nodeList`, 而`formName.inputName.value`则会返回一个空字符串，如果想正确取值，就必须使用指定下标的方法`formName.inputName[0].value`

`formName.inputName.value`方法同样适用于类型为`radio`的`input`元素，如果相同 `name` 的多个类型为 `radio` 的元素都有 `checked` 属性，则以最后一个的 `value` 值为准

# checkbox 类型该怎么传值

表单中 CheckBox 类型很常见，我们先看一下在传统的开发模式下，checkbox 是怎么传值的

`index.html`

```html
<form action="index.php" method="GET">
    <input type="checkbox" name="color[]" checked value="zhangsan"> zhangsan
    <input type="checkbox" name="color[]" checked value="lisi"> lisi
    <input type="checkbox" name="color[]" value="wangwu"> wangwu
    <button type="submit">submit</button>
</form>
```

`index.php`

```php
    echo json_encode($_GET);
```

上面是传统的开发模式，点击 submit 按钮后会直接跳转到`inedx.php`页面,我们如愿以偿的看到了想要的 color 的值,由于使用的是 GET 方式，所以在 url 中可以看到这么一串内容

```
http://localhost:8080/index.php?color%5B%5D=zhangsan&color%5B%5D=lisi
```

使用`decodeURI()`方法把 url 转义后是

```
"http://localhost:8080/index.php?color[]=zhangsan&color[]=lisi"
```

那么如果改成 POST 方式呢
`index.html`

```html
<form action="index.php" method="POST">
    <input type="checkbox" name="color[]" checked value="zhangsan"> zhangsan
    <input type="checkbox" name="color[]" checked value="lisi"> lisi
    <input type="checkbox" name="color[]" value="wangwu"> wangwu
    <button type="submit">submit</button>
</form>
```

`index.php`

```php
    echo json_encode($_POST);
```

在页面跳转的时候，通过控制台的 network 模块，我们看一下关于`index.php`请求的详细内容， 在 Form Data 面板中，点击一下`view source`按钮，可以看到 post 请求传递的实际上也是`color%5B%5D=zhangsan&color%5B%5D=lisi`的内容，解码后还是`color[]=zhangsan&color[]=lisi`

这种参数类型就是 jquery 的 ajax 请求中默认的**序列化后的 URL 字符串**

# 手动把 json 序列化

现在很多同学都喜欢用另一种方式把参数传递给接口：**_json 字符串_**，**json 字符串**的方式能够让参数的层次更加清晰，在请求的时候需要指定 ajax 的参数类型为`application/json`，但是当设置`content-type`为`application/json`的时候，会触发 HTTP 的[预检请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)，也就是`OPTIONS`请求。我个人不喜欢这种方式，那么就需要把我们熟悉的 json 转成符合规则的**序列化后的 URL 字符串**，下面是转化方法

```js
function serialize(obj) {
  var ua = Object.prototype.toString
    .call(obj)
    .toLowerCase()
    .split(' ')[1];
  if (!/object/.test(ua)) {
    return obj;
  }
  var result = '';
  for (i in obj) {
    result += jie(obj[i], [i]);
  }
  return result;
}
function jie(obj, options) {
  var sl = Array.prototype.slice;
  var ua = Object.prototype.toString
    .call(obj)
    .toLowerCase()
    .split(' ')[1];
  var result = '';
  if (/object/.test(ua)) {
    // 处理对象
    for (key in obj) {
      var arg = options.concat([key]);
      result += jie(obj[key], arg);
    }
  } else if (/array/.test(ua)) {
    // 处理数组
    for (key in obj) {
      var arg = options.concat([key]);
      result += jie(obj[key], arg);
    }
  } else {
    options.forEach((item, index) => {
      if (index == 0) {
        result += `${item}`;
      } else {
        result += `[${item}]`;
      }
    });
    result += `=${obj}&`;
  }
  return result.slice(0, -1);
}
```

拿下面的数据来测试一下

```js
var data = {
  name: {
    list: [
      {
        id: 1,
        key: 12,
      },
      {
        id: 2,
        key: 13,
      },
      {
        list: [
          {
            name: 'zhangsan',
            age: 10,
          },
          {
            name: 'lisi',
            age: 12,
          },
        ],
      },
    ],
    color: {
      value: 'red',
    },
  },
};
console.log(serialize(data));

// name[list][0][id]=1&name[list][0][key]=12&name[list][1][id]=2&name[list][1][key]=13&name[list][2][list][0][name]=zhangsan&name[list][2][list][0][age]=10&name[list][2][list][1][name]=lisi&name[list][2][list][1][age]=12&name[color][value]=red
```

现在我们把这段字符串以 GET 的方式放到 php 文件中执行一次

```php
echo json_decode($_GET);
```

在页面中就会发现获取到的数据，和我们声明的 data 结构是一摸一样的，如果在页面中使用 ajax 请求的方式，也没有触发预检请求
