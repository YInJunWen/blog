<!-- Date: 2020-09-09 14:13 -->

# vue_cli 构建的项目中如何去掉 console 日志

[terser-webpack-plugin](https://webpack.js.org/plugins/terser-webpack-plugin/)是一款 webpack 中用来压缩 JS 的插件

项目环境：

```
vue-element-admin 项目
@vue/cli-service@3.5.3
```

`@vue/cli-service@3.5.3`中自带了[terser-webpack-plugin@^1.2.2](https://webpack.js.org/plugins/terser-webpack-plugin/)版本的插件(写这篇笔记的时候，自动安装的是 1.4.4 版本)，并设置了一些默认的配置项，通过`vue-cli-service inspect --mode production`可以看到它的默认配置项：

```
minimizer: [
      {
        options: {
          test: /\.m?js(\?.*)?$/i,
          chunkFilter: () => true,
          warningsFilter: () => true,
          extractComments: false,
          sourceMap: false,
          cache: true,
          cacheKeys: defaultCacheKeys => defaultCacheKeys,
          parallel: true,
          include: undefined,
          exclude: undefined,
          minify: undefined,
          terserOptions: {
            output: {
              comments: /^\**!|@preserve|@license|@cc_on/i
            },
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          }
        }
      }
    ],
```

插件的[readme](https://github.com/webpack-contrib/terser-webpack-plugin/tree/version-1)文件中写的很清楚，插件的核心使用的是[Terser 库](https://github.com/terser/terser)，所以`terserOptions`中的参数还是要去`terser`的文档上去找，我们需要的是`terserOptions.compress.drop_console`参数，所以在你的`vue.config.js`中如下配置：

```js
const TerserPlugin = require('terser-webpack-plugin');
config.optimization.minimizer([
    new TerserPlugin({
        extractComments: false,
        sourceMap: false,
        terserOptions: {
            output: {
                comments: /^\**!|@preserve|@license|@cc_on/i,
            },
            compress: {
                drop_console: true, // 这个参数设为true就可以去掉项目中的console语句了
                arrows: false,
                collapse_vars: false,
                comparisons: false,
                computed_props: false,
                hoist_funs: false,
                hoist_props: false,
                hoist_vars: false,
                inline: false,
                loops: false,
                negate_iife: false,
                properties: false,
                reduce_funcs: false,
                reduce_vars: false,
                switches: false,
                toplevel: false,
                typeofs: false,
                booleans: true,
                if_return: true,
                sequences: true,
                unused: true,
                conditionals: true,
                dead_code: true,
                evaluate: true,
            },
            mangle: {
                safari10: true,
            },
        },
    }),
]);
```

顺便尝试总结一下 terser 中的参数作用

## format.comments (default "some")

设置保留那些注释，默认`some`会保留`JSDoc`样式的注释，比如`@author`等；设置为`true`或者`'all'`会保留所有注释；设置为`false`不会保留所有类型的注释

也可以设置为一个正则表达式，或者设置为一个`function`

```
format:{
    comments:'some',
    comments:true/'all',
    comments:/自定义正则表达式/,
    comments:functin(matchText){
        return true/false
    }
}
```

## compress.defaults(true)

如果设置为 false，将会禁用大多数的默认压缩选项，以便自定义压缩参数

## compress.arrows(true)

如果设置为 true，将会把那些类似于`m(){return x}`的函数编译成`m:()=>x`的样子，如果函数中使用了`this`或 `arguments`关键字不会转换
转换前：

```js
let m = (x) => {
    return x + 1;
};
```

转换后：

```js
let m = (a) => a + 1;
```

## compress.arguments(false)

如果可以的话，把函数体中使用`arguments[index]`的代码替换为一个已有入参变量名，比如：

```js
function abc(a) {
    alert(arguments[0]);
}
abc(1, 2, 3);
```

可能会被替换为：

```js
function abc(a) {
    alert(a);
}
abc(1, 2, 3);
```

## compress.booleans(true)

设置为 `true` 的时候，会对一些逻辑运算表达式进行优化

## compress.booleans_as_integers (default: false) 慎用

设置为 `true` 的时候，如果变量的值是 `true` 或 `false` ，会分别使用 1 或 0 替换；如果这个变量出现在`===`或者`!==`两边的 true 和 false 也会被替换，并且会吧`===`和`!==`分别替换成`==`和`!=`

替换前：

```js
let a = true;
if (a === true) {
    alert(a);
}
```

替换后:

```js
let a = 1;
if (1 == a) alert(a);
```

## compress.computed_props (default: true)

设置为 true 可以把一些计算属性名转换成正常的属性名

转换前：

```js
let p1 = 'p1';
let obj = {
    [p1]: 'zhangsan',
    ['p2']: 'lisi',
};
```

转换后：

```js
let p1 = 'p1';
let obj = { [p1]: 'zhangsan', p2: 'lisi' };
```

这里的`['p2']`完全不需要使用计算属性名中括号，所以会被转成更为直接的属性名

## compress.conditionals (default: true)

还没测试出啥效果

## compress.comparisons (default: true)

还没测试出啥效果

## compress.collapse_vars (default: true)

还没测试出啥效果

## compress.dead_code (default: true)

设置为 true 时，会自动删掉**永远无法执行的代码**

压缩前：

```js
function def() {
    return true;
    alert('def');
}
switch (c) {
    case 1:
        alert(1);
        break;
        alert(2);
    default:
        alert(3);
}
```

压缩后：

```js
function def() {
    return 1;
}
switch (c) {
    case 1:
        alert(1);
        break;
    default:
        alert(3);
}
```

这个案例中，函数`def`里面`return`之后的语句永远都不会执行，所以会被删掉；`switch`语句中`break`关键字后的语句也是永远不会执行的，属于无效代码。

## compress.drop_debugger (default: true)

设置为 true，会移除代码中所有的`debugger`语句

## compress.drop_console (default: false)

设置为 true，会移除代码中所有的`console.*`语句,如果只想移除部分语句，可以使用`pure_funcs`参数指定

压缩前：

```js
console.log('drop console');
```

压缩后：

```js
void 0;
```

## evaluate (default: true)

还没测试出啥效果

## expression (default: false)

还没测试出啥效果

## global_defs (default: {})

这个其实就是定义了一些全局常量，代码中可以使用这些常量，压缩的时候会把这些常量代替为真实的值

比如：

```js
// 配置项
compress: {
    global_defs: {
        DEBUGGER: 'debugger';
    }
}
```

压缩前：

```js
alert(DEBUGGER);
```

压缩后：

```js
alert('debugger');
```

## hoist_funs (default: false)

还没测试出啥效果

## hoist_props (default: true)

还没测试出啥效果

## hoist_vars (default: false)

还没测试出啥效果，官方文档上不建议开启这个选项，原因是可能会导致打包后的文件大小增大

## if_return (default: true)

## inline (default: true)

## join_vars (default: true)

## keep_classnames (default: false)

## keep_fargs (default: true)

## keep_fnames (default: false)

## keep_infinity (default: false)

## loops (default: true)

## module (default false)

## negate_iife (default: true)

## passes (default: 1)

## properties (default: true)

## pure_funcs (default: null)

## pure_getters (default: "strict")

## reduce_funcs

## reduce_vars (default: true)

## sequences (default: true)

## side_effects (default: true)

## switches (default: true)

## toplevel (default: false)

## top_retain (default: null)

## typeofs (default: true)

## unsafe (default: false)

## unsafe_arrows (default: false)

## unsafe_comps (default: false)

## unsafe_Function (default: false)

## unsafe_math (default: false)

## unsafe_symbols (default: false)

## unsafe_methods (default: false)

## unsafe_proto (default: false)

## unsafe_regexp (default: false)

## unsafe_undefined (default: false)

## unused (default: true)
