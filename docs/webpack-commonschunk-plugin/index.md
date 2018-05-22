# webpack CommonsChunkPlugin 插件

CommonsChunkPlugin 插件主要用于建立一个独立的打包文件，这个文件包含多个入口文件的公共模块。可以更有效的利用浏览器并发的特性，不至于把所有的加载压力都放在一个入口文件中，也可以更快速的加载页面

这个插件是 webpack 内置插件，不需要单独安装

# 特别注意

可能以后来看文档的时候，没有功夫往下看完，因此把这个写在最前面： 当你使用了这个插件分离打包了公共模块，在页面中实际引用的时候，必须按照先引入特殊 chunk 文件，再引入公共 chunk 文件，最后引入其他 bundle 文件的顺序，否则将不能按照预期效果执行

**最好是搭配 htmlWebpaclPlugin 插件使用更简单**
以本文的案例 2 为例，引入顺序如下：

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <!-- 引入特殊chunk信息文件 -->
  <script type="text/javascript" src="output/load.common.js"></script>
  <!-- 引入公共模块文件 -->
  <script type="text/javascript" src="output/jquery.common.js"></script>
  <script type="text/javascript" src="output/react.common.js"></script>
  <!-- 引入其他文件 -->
  <script type="text/javascript" src="output/manidest.index.js"></script>
</body>
</html>
```

# 正文

## 用法

```js
new webpack.optimize.CommonsChunkPlugin(option)；
或者
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
new CommonsChunkPlugin(option);
```

## option

name: string | names: [ ]

指定公共的 chunk name， 可以传递一个字符串，也可以传入一个内含 chunk name 的数组，如果传入了一个数组，会与配置的入口文件信息分别对照后进行处理。

filename: string

> 指定公共模块被打包出来的文件 **模板名称**，可以使用[name]关键字，**注意：如果 name 有对应的 entry 名称，这个[name]就是 entry 的名称，否则，指的是 name 中指定的名称** ， 详见下面的[案例 1]()

chunks： string | [ ]

> 只有被这个参数指定的入口文件中的公共模块，才会被打包进指定的公共模块文件

minChunks: numer | Infinity | function(module, count)->boolean

> 这个参数主要是规定公共模块必须在指定数量的入口文件中同时被使用，才能被允许打包为公共模块文件。 比如 3 的意思就是说，一个模块必须在三个入口文件中同时被引入，才可以被视为公共模块，被打包到公共模块文件中； 该参数最小不能低于 2。

> 当参数为一个 function 的时候，可以用来更为细致的决定模块被打包到哪里，见[案例 3]()

children : boolean

> 当 chidren 为 true 的时候，name 和 names 属性都会失效，并且会把所有的公共模块打包到每一个入口文件生成的 chunk 文件中。然而我并没有发现这个参数有 P 的作用，反而是增大了每一个入口 chunk 文件的大小

async

> 这个属性，我实在是没有找到有什么作用，他和 children 结合生成的结果，和完全不使用这个插件的结果都一样， 如果有理解这个属性的同学麻烦告诉我一声

## 案例 1： names 属性传入多个值

```js
var config = {
  entry: {
    index1: 'index1.js',
    index2: 'index2.js',
    jquery: 'jquery',
    react: 'react'
  },
  ouput: {
    path: path.resolve(__dirname, 'output'),
    filename: '[name].bundle.js'
  }
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest', 'jquery','react'],
      filename: '[name].common.js'
    })
  ]
}
```

上面的这个配置会最终会打包出来 5 个 js 文件，分别是：

* 所有文件中的 jquery 模块，会被打包进 jquery.common.js 文件
* 所有文件中的 react 模块，会被打包进 react.common.js 文件
* index1 和 index2 中包含的其他公共模块(代码)会被打包进 manifest.common.js 文件
* index1 和 index2 中的其他非公共模块(代码)会被打包在 index1.bundle.js 和 index2.bundle.js 中

## 案例 2： 记录打包过程中的日志文件

webpack 在打包的时候，会记录下一些特殊的内容，比如打包的时间以及打包的 map 信息等等，我们可以把这些信息单独放进一个文件中去

```js
var config = {
  entry: {
    index1: 'index1.js',
    index2: 'index2.js',
    jquery: 'jquery',
    react: 'react'
  },
  ouput: {
    path: path.resolve(__dirname, 'output'),
    filename: '[name].bundle.js'
  }
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest', 'jquery','react', 'load'],
      filename: '[name].common.js'
    })
  ]
}
```

以上配置，除了会打包与案例 1 中类似的 5 个文件之外，打包过程的日志会被打包进 load.common.js 文件中,需要特别注意的是：

## 案例 3： 传递一个函数参数给 minChunks

minChunks 属性，会设置需要被单独打包的条件

```js
var config = {
  entry: {
    index1: 'index1.js',
    index2: 'index2.js',
    jquery: 'jquery',
    react: 'react'
  },
  ouput: {
    path: path.resolve(__dirname, 'output'),
    filename: '[name].bundle.js'
  }
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest', 'jquery','react', 'load'],
      filename: '[name].common.js',
      minChunks: function(module, count){
          return module.resource && /react/.test(module.resource) && count > 3
      }
    })
  ]
}
```

这个案例就指定了能被打包进公共 chunk 文件的两个条件：

1.  模块是一个路径，且该路径包含'react'
2.  该模块在被超过 3 个的入口文件共同使用那么就把这个模块放入 manifest.common.js 文件中
