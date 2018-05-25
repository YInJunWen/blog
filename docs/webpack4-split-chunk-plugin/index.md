# webpack4 中使用 SplitChunkPlugin 插件

在 v4 中，webpack 使用了`splitChunkPlugin`插件来代替之前的`CommonsChunkPlugin`插件

案例 1

```js
optimization: {
    splitChunks: {
      minSize: 3000,
      chunks: 'all',  // initial的效果相同
      // chunks: 'initial',
    },
  },

// 入口文件 a.js   4kb
import './b.js'   // 40kb
import 'jqeury'   // 40kb

// 生成文件
// a.js
// vendor~a.js
```

* a 中引入的 b 文件为什么没有被单独列出来，是因为只有 a 文件引入了，没有与其他的文件公用，所以 b 文件不会被单独分割出来
* jquery 文件由于是从 node_modules 中拿出来的，且只有 a 文件引用了它，所以插件会自动为它生成一个 vendor~a 开头文件名

案例 2

```js
optimization: {
    splitChunks: {
      minSize: 3000, // 当import的文件大小超过这个值，才会被单独分割出来
      chunks: 'all',  // initial的效果相同
      // chunks: 'initial',
    },
  },

// 入口文件 a.js   4kb
import './c.js'   // 40kb
import 'jqeury'   // 40kb

// 入口文件 b.js   4kb
import './c.js'   // 40kb
import 'jqeury'   // 40kb


// 生成文件
// a.js
// b.js
// a~b.js
// vendor~a.js
```

* 由于 a 和 b 文件公用了 c 文件，且 c 文件大于我们设置的最小代码块范围，所以 c 的文件会被单独分割出来，且自动生成一个 a~b 开头的文件名
* jquery 文件由于是从 node_modules 中拿出来的，且 a 和 b 文件都用到了它，所以插件会自动为它生成一个 vendor~a~b 为开头的文件名

案例 3

```js
optimization: {
    splitChunks: {
      minSize: 3000, // 当import的文件大小超过这个值，才会被单独分割出来
    //   chunks: 'all',  // initial的效果相同
      chunks: 'initial',
    },
  },

// 入口文件 a.js   4kb
import './c.js'   // 40kb
import 'jqeury'   // 40kb

// 入口文件 b.js   4kb
import './c.js'   // 40kb
import 'jqeury'   // 40kb

// 入口文件 d.js   4kb
import './c.js'   // 40kb


// 生成文件
// a.js
// b.js
// c.js
// a~b~d.js
// vendor~a.js
```

* 由于 a、b、d 文件公用了 c 文件，且 c 文件大于我们设置的最小代码块范围，所以 c 的文件会被单独分割出来，且自动生成一个 a~b~d 开头的文件名
* jquery 文件由于是从 node_modules 中拿出来的，且 a 和 b 文件都用到了它，所以插件会自动为它生成一个 vendor~a~b 为开头的文件名
