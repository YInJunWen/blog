# RequireJS 小结

#### REquireJS 需要注意的事项

##### 1. script 标签中的 src 指向 require.js 文件

```
<script src="require.js" data-main="config" ></script>
```

##### 2. data-main 的作用：

* 指定网页程序的主模块
* 设置文件加载根目录

##### 3. require.config 属性

* baseUrl 重置文件加载根目录

  这里的值如果是斜杠开头，表示是一个绝对位置，比如：

  如果前面有域名 demo.com 那么他的位置标示的是 demo.com/的文件夹位置

  如果是以 `../` 或者直接 `字母` 开头则表示的是一个相对位置

```js
require.config({
  baseUrl: "/"
});
```

* paths 定义脚本对应的位置,并且可以定义多个位置

```js
require.config({
  paths: {
    a: "a"
  }
});
```

当定义了多个位置，加载的时候如果第一个位置没有加载成功就会加载第二个位置的脚本

```js
require.config({
  paths: {
    jquery: ["http://api.baidu.con/jqeury.1.11.0.js", "jquery-1.11.0"]
  }
});
```
