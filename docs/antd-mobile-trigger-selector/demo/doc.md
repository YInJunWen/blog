## webpack-dev-server 配置文件在哪里添加

* 在 webpack.config.js 中，通过 module.exports.devServer 添加配置文件
* 使用 webpackDevServer.addDevServerEntrypoints(config,options)方法添加配置文件其中 config 值得是 webapck.config.js 文件的内容，options 中包含了具体的启动服务配置内容

## 使用 less 编写样式文件的时候需要以下 laoder

```js
rules: [
  {
    test: '/*.less/',
    use: ['style-loader', 'css-loader', 'less-loader'],
  },
];
```

* 一定要注意着三个 loader 的顺序，webpack 中 laoder 的使用顺序是从后往前

其中 less-loader 的目的是把 less 文件转为 css，css-loader 是为了把 css 转为一个 js 模块，style-laoder 是为了把这个模块插入到 html 文件中
