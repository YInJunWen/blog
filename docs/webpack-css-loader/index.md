# webpack 中的 css-loader

css-loader 是组件化 css 的一种最为有效的方式，提供针对各种工具的插件，以 webpack 支持最好，而且很容易使用

# 参数

## modules

默认值是 false，设置为 true 就可以打开 cssModule 功能，用法如下：

```
//style.css
.header{
 font-size: 20px;
}

//webpack.config.js
{
 test: /\.css$/,
 loader: ['style-loader', 'css-loader?module']
}

//js
import css from 'style.css';
function reactComponent(){
 return (<h1 className={css.header}></h1>)
}
```

CSS MODULE 组件化的原理就是为一个类名生成一个唯一的 hash 值，这样就可以确保类名的唯一性，注意： 如果没有设置为 true，是不能使用上面方法的

## 全局和本地类

:local(classname){}和:global(classname){}分别生成两种样式，第一种类似于上面的例子，会生成一个唯一的 hash 值作为类名，第二种表明了要作为全局类名来使用，因此不需要生成 hash 类名，用法如下：

```
//style.css
.header{
 font-size: 20px;
}
:global(.header){
 font-size: 40px;
}

//webpack.config.js
{
 test: /\.css$/,
 loader: ['style-loader', 'css-loader?module']
}

//js
import css from 'style.css';
function reactComponent(){
 return (<h1 className="header"></h1>)
}
```

这个时候文档中渲染的`<h1>`元素的字号是`40px`

## 定制自己想要的 hash 类名

这个要用到 css-loader 的 localIdentName 参数，其中可以使用[]关键字使用一些固定的常亮，比如：

```
module: {
  loaders: [
    // ...
    {
      test: /\.css$/,
      loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
    },
  ]
}
```

这个时候类名被编译成了：文件所在文件夹名称-组件-文件名---类名---base64 后的前 5 位。
