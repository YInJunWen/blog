# webpack 中 CSS 文件使用 require 或者 import 方法引入，返回值为空的对象

这是因为 css-loader 的 module 参数没有设置为 true，这个值默认是 false，只需要在 webpack.config.js 中声明即可，比如

```js
{
  test: /\.css$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[path][name]__[local]--[hash:base64:5]'
      }
    }
  ]
}
```

简单点也可这样写：

```js
{
 test: /\.css$/,
 loader: ['style-loader', 'css-loader?module']
}
```
