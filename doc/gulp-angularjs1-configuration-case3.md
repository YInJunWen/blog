# 五个 ng1 项目后的最新项目结构与 gulpFile 文件

> angular1 用够 5 个项目了，从组开始的蹒跚学步到现在，不停的更改 gulp 文件，不停的更改项目编译流程，也不停的更改项目结构，最终找到了**目前为止**最合适的项目开发流程以及配置文件，虽然 angular 已经出了 2 3 版本，以后不一定再有 angularjs.v1 开发项目的机会，但还是把这些东西记录下来，以便有需要的做个参考

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

```js
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sync = require('gulp-sync-task');
var bs = require('browser-sync').create();
var fs = require('fs');


var jsPath = [
    'src/components/**/*.js',
    'src/common/**/*.js',
    'src/global/**/*.js',
    'src/model/**/*.js'
];
var lessPath = [
    'src/components/**/*.less',
    'src/common/**/*.less',
];
var htmlPath = [
    'src/components/**/*.html',
    'src/common/**/*.html',
];

var jsonPath = 'src/model/**/*.json';
// gulp.plumber 编译出错时，不中断编译

// var httpDevUrl = '开发环境的接口地址';
var httpTestUrl = '测试环境的接口地址';
var httpDistUrl = '生产环境的接口地址';

var staticPath, postPath;

gulp.task('devInit', function (cb) {
    staticPath = '../static';
    postPath = httpDevUrl;
    sync.callback = cb;

})
gulp.task('testInit', function (cb) {
    staticPath = './static';
    postPath = httpTestUrl;
    sync.callback = cb;
})
gulp.task('distInit', function (cb) {
    staticPath = './static';
    postPath = httpDistUrl;
    sync.callback = cb;
})

gulp.task('facicon', function(cb){
    gulp.src('./favicon.ico')
        .pipe(gulp.dest('dist/'))
        .on('end', function(){
        sync.callback = cb;
    })
})

gulp.task('clean', function (cb) {
    gulp.src('dist')
        .pipe($.clean())
        setTimeout(function () {
            sync.callback = cb;
    }, 500)
})
gulp.task('lib', function (cb) {
    console.log('当前使用的postUrl是： ' + postPath)
    console.log('当前static路径是： ' + staticPath)
    gulp.src('static/lib/**/*.*')
        .pipe($.plumber())
        .pipe(gulp.dest('dist/static/libs/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('image', function (cb) {
    gulp.src('static/images/**/*.*')
        .pipe($.plumber())
        .pipe(gulp.dest('dist/static/images/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('index', function (cb) {
    gulp.src('src/index.html')
        .pipe($.replace(/{STATIC_PATH}/g, staticPath))
        .pipe($.replace(/{POST_PATH}/g, postPath))
        .pipe(gulp.dest('dist/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('html', function (cb) {
    gulp.src(htmlPath)
        .pipe($.rename({
            dirname: '
        }))
        .pipe($.replace(/{STATIC_PATH}/g, staticPath))
        .pipe($.replace(/{POST_PATH}/g, postPath))
        .pipe(gulp.dest('dist/static/view/'))
        .on('end', function () {
            sync.callback = cb;
        })
})
gulp.task('js', function (cb) {
    gulp.src(jsPath)
        .pipe($.plumber())
        .pipe($.concat('index.js'))
        .pipe($.replace(/{STATIC_PATH}/g, staticPath))
        .pipe($.replace(/{POST_PATH}/g, postPath))
        .pipe(gulp.dest('dist/static/js/'))
        .pipe($.uglify())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/static/js/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('lib-js', function (cb) {
    gulp.src([
        'static/js/angular.js',
        'static/js/angular-ui-router.js',
        'static/js/angular-cookies.js',
        'static/js/showdown.js',
        'static/js/md5.js',
    ])
        .pipe($.plumber())
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest('dist/static/js/'))
        .pipe($.uglify())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/static/js/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('concatless', function (cb) {
    gulp.src(lessPath)
        .pipe($.plumber())
        .pipe($.concat('bundle.less'))
        .pipe(gulp.dest('src/style/'))
        .on('end', function () {
            sync.callback = cb;
        })
})
gulp.task('less', function (cb) {
    gulp.src('src/style/index.less')
        // 这里一定要记得先替换再less否则会报错
        .pipe($.plumber())
        .pipe($.replace(/{STATIC_PATH}/g, staticPath))
        .pipe($.less())
        .pipe(gulp.dest('dist/static/css/'))
        .pipe($.cssmin())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/static/css/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('json', function (cb) {
    gulp.src('src/components/**/*.json')
        .pipe($.rename({
            dirname: '
        }))
        .pipe($.plumber())
        .pipe(gulp.dest('dist/data/'))
        .on('end', function () {
            sync.callback = cb;
        })
})

gulp.task('server', function () {
    bs.init({
        server: 'dist',
        director: true,
        browser: 'google chrome',
        open: false,
        ui: false,
        files: [
            'dist/**/*.*'
        ],
        rewriteRules: [
            {
                match: /\/\#\!(.*)$/g,
                fn: function (match) {
                    return 'index.html/#!$1';
                }
            }
        ]
    })

})
gulp.task('replaceUrl', function (cb) {
    fs.readFile('dist/index.html', 'utf-8', function (err, data) {
        if (err) throw err;
        data += '<script>console.log = function(){}</script>';
        data = data.replace(/(lib|index)\.js/g, '$1.min.js?' + new Date().getTime())
        data = data.replace(/(lib|index)\.css/g, '$1.min.css?' + new Date().getTime())
        fs.writeFile('dist/index.html', data, function (err) {
            if (err) throw err;
            sync.callback = cb;
        })
    })
})

gulp.task('watch', function () {
    gulp.watch('src/index.html', function (e) {
        console.log(e.type, e.path)
        gulp.src(e.path)
            .pipe($.replace(/{STATIC_PATH}/g, staticPath))
            .pipe($.replace(/{POST_PATH}/g, postPath))
            .pipe(gulp.dest('dist/'))
    })
    gulp.watch(htmlPath, function (e) {
        console.log(e.type, e.path)
        gulp.src(e.path)
            .pipe($.rename({
                dirname: '
            }))
            .pipe($.replace(/{STATIC_PATH}/g, staticPath))
            .pipe($.replace(/{POST_PATH}/g, postPath))
            .pipe(gulp.dest('dist/static/view'))
    })
    gulp.watch(lessPath, ['concatless'])
    gulp.watch('src/style/*.less', ['less'])
    gulp.watch(jsPath, ['js'])
    gulp.watch(jsonPath, function (e) {
        console.log(e.type, e.path)
        gulp.src(e.path)
            .pipe(gulp.dest('dist/data/json/'))
    })
})

gulp.task('dist', sync('distInit', 'clean', 'index', 'facicon', 'lib', 'image', 'html', 'js', 'lib-js', 'concatless', 'less', 'replaceUrl'))


gulp.task('test', sync('testInit', 'clean', 'index', 'facicon', 'lib', 'image', 'html', 'js', 'lib-js', 'concatless', 'less', 'replaceUrl'))


gulp.task('dev', sync('devInit', 'clean', 'index', 'facicon', 'lib', 'image', 'html', 'js', 'lib-js', 'concatless', 'less', 'json', 'server', 'watch'))
```

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
