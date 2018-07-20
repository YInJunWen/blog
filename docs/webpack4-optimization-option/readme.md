# webpack4 新增的 optimization 配置项

从 v4 开始，webpack 为项目的打包过程添加了默认的优化方案，这个方案会根据 webapck 配置文件中的 mode 自动改变，也可以在 webpack 的配置文件中添加 optimization 选项来覆盖默认的优化方案

## optimization.minimize

当 mode 为 production 的时候，webpack 会自动开启 `压缩 JS`插件，用的是`UglifyJsPlugin`插件

## optimization.minimizer

这个属性允许开发人员定义自己的的压缩方式， 比如仍然使用`UglifyJsPlugin`插件，但是修改了其中的部分配置

```js
module.exports = {
  //...
  optimization: {
    minimizer: [
      new webpack.optimize.UglifyJsPlugin({
        /* your config */
      }),
    ],
  },
  ß,
};
```

## optimization.splitChunks

webpack4 提供了这个选项来代替 v4 之前版本使用的`CommonsChunkPlugin`插件，这里用到的是最新的`SplitChunkPlugin`,开发人员可以在这里定义插件的配置内容

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`,
    },
  },
};
```

## optimization.noEmitOnErrors

这个选项用来配置项目在运行时候是否要在控制台输出错误日志

```js
module.exports = {
  //...
  optimization: {
    noEmitOnErrors: true,
  },
};
```
