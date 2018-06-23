# webpack4 构建 react + antd-mobile 应用

## webpack-dev-server 配置文件在哪里添加

* 在 webpack.config.js 中，通过 module.exports.devServer 添加配置文件
* 使用 webpackDevServer.addDevServerEntrypoints(config,options)方法添加配置文件其中 config 值得是 webapck.config.js 文件的内容，options 中包含了具体的启动服务配置内容
* option 中的 contentBase 路径必须和 output.path 保持一致，否则会出现`Cannot get /`的错误
* 如果使用了 HTMLWebpackPlugin 插件，也要保证生成的 html 路径和 output.path 路径保持一致，否则页面会空白

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

## 如何引用 antd-mobile 中的组件

1.  单个引入需要的组件

```js
import Button from 'antd-mobile/lib/button/index.js';
import 'antd-mobile/lib/button/style/index.less';

<Button type="primary">dd</Button>;
```

2.使用官方推荐的 babel-import-plugin 插件

首先肯定是先安装这个插件，由于这个插件是和 babel 有关的，所以插件的配置项，可以放在.babelrc 文件中，也可以放在 webpack 的配置 babel-loader 的 options 中

```js
{
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['env', 'react'],
      plugins: [['import', { libraryName: 'antd-mobile', style: true }]],  // 主要是这一行
    },
  },
},
```

**注意：** 由于 antd-mobile 引入了 normalize.css 包，所以 webpack 中除了要配置自己常用的 less 文件相关的一系列 loader，也要配置 css 文件相关的一系列 laoder

## 报错 Inline JavaScript is not enabled

使用 less 文件的时候，默认的 less-loader 是不允许在文件内使用函数的，因此需要打开这个设置

```js
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader?javascriptEnabled'],
},
```

或者

```js
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', {
    laoder: 'less-loader',
    options: {
      javascriptEnabled: true
    }
  }],
},
```

## 报错 Unknown plugin 'import' specified in .babelrc

通常是因为忘记安装`babel-plugin-import`组件导致的
