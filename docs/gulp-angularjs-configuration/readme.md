<!-- Date: 2017-03-12 19:26:06 -->

# gulp 开发 AngularJS 的配置案例

> angular1 用够 5 个项目了，从组开始的蹒跚学步到现在，不停的更改 gulp 文件，不停的更改项目编译流程，也不停的更改项目结构，最终找到了`目前为止`最合适的项目开发流程以及配置文件，虽然 angular 已经出了 2 3 版本，以后不一定再有 angularjs.v1 开发项目的机会，但还是把这些东西记录下来，以便有需要的做个参考

### 项目目录

```
docs   // 文档
dist   // 编译出来的目录
|--static  // 静态文件
| |-- css   // 最终编译生成的css文件，未压缩的和已压缩的各一份
| |-- images  // 最终编译生成的图片文件
| |-- js   // 最终编译生成的js文件，未压缩的和已压缩的各一份
| |-- libs  // 插件库
| |-- view  // view库，就是那些自定义组件的模板
|--favicon.ico
|--index.html
node_modules // node包
src    // 开发目录
|--common   // 公共组件
|--components  // 所有的组件
| |-- index.js   // 入口文件
|--global
|    |-- cache // 封装浏览器缓存事件
|    |-- dict // 全局变量，可以理解为类似vedux的东西
|    |-- html    // 这是一个markdown的过滤器
|    |-- http  // 重新封装http事件
|    |-- router  // 路由管理
|--model   // 接口文件夹
|     |--model.factory.js  //  接口文件
|--style
|  |-- common.less  //  公共样式文件
|  |-- index.less  // 样式主文件，gulp中最终只编译这个文件
|  |-- reset.less  // 统一浏览器初始样式
|  |-- variable.less // 保存less的全局变量，比如全局的颜色样式等
static   // 最初的插件库
.gitignore  // git过滤配置文件
favicon.ico     // 网站图标
gulpfiile.js  // gulp执行文件
package.json  // 包管理文件
readme.md
```

### gulp 文件

这一部分要注意一下重点：

1.  gulp-task-sync 同步执行任务的插件
2.  编译 html、js、css 中对变量的替换，这个功能类似于 php 或者 jade 中的模板
3.  对开发、测试、生产三种不同环境接口地址的替换，以及生产环境中对引用 js、css 压缩版本资源的替换

[代码](./gulpFile.js)

### 需要的 nodejs 包以及说明

```js
"dependencies": {
    "@uirouter/angularjs": "^1.0.6",   // 管理路由
    "angular": "^1.6.6",        // angularjs主文件
    "angular-cookies": "^1.6.6",   // 管理cookie
    "markdown": "^0.5.0",    // markdown文件编译
  },
  "devDependencies": {
    "browser-sync": "^2.18.12",   // 开发的时候的本地服务器
    "gulp": "^3.9.1",     // gulp主程序
    "gulp-clean": "^0.3.2",    // 删除文件或文件夹
    "gulp-concat": "^2.6.1",   // 合并文件
    "gulp-connect": "^5.0.0",   // 另外一个可以起一个服务器的包
    "gulp-cssmin": "^0.1.7",   // 压缩css
    "gulp-less": "^3.3.0",    // 编译less
    "gulp-load-plugins": "^1.5.0",  // 自动加载gulp插件
    "gulp-plumber": "^1.1.0",   // 任务中出错的时候继续执行下去，不停止gulp程序
    "gulp-rename": "^1.2.2",   // 重命名文件或文件夹
    "gulp-replace": "^0.6.1",   // 替换文件内容
    "gulp-sync-task": "^1.0.3",   // 同步处理gulp任务
    "gulp-uglify": "^2.0.1"    // 压缩js
  },
```
