var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sync = require('gulp-sync-task');
var bs = require('browser-sync').create();
var fs = require('fs');

var jsPath = [
  'src/components/**/*.js',
  'src/common/**/*.js',
  'src/global/**/*.js',
  'src/model/**/*.js',
];
var lessPath = ['src/components/**/*.less', 'src/common/**/*.less'];
var htmlPath = ['src/components/**/*.html', 'src/common/**/*.html'];

var jsonPath = 'src/model/**/*.json';
// gulp.plumber 编译出错时，不中断编译

// var httpDevUrl = '开发环境的接口地址';
var httpTestUrl = '测试环境的接口地址';
var httpDistUrl = '生产环境的接口地址';

var staticPath, postPath;

gulp.task('devInit', function(cb) {
  staticPath = '../static';
  postPath = httpDevUrl;
  sync.callback = cb;
});
gulp.task('testInit', function(cb) {
  staticPath = './static';
  postPath = httpTestUrl;
  sync.callback = cb;
});
gulp.task('distInit', function(cb) {
  staticPath = './static';
  postPath = httpDistUrl;
  sync.callback = cb;
});

gulp.task('facicon', function(cb) {
  gulp
    .src('./favicon.ico')
    .pipe(gulp.dest('dist/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('clean', function(cb) {
  gulp.src('dist').pipe($.clean());
  setTimeout(function() {
    sync.callback = cb;
  }, 500);
});
gulp.task('lib', function(cb) {
  console.log('当前使用的postUrl是： ' + postPath);
  console.log('当前static路径是： ' + staticPath);
  gulp
    .src('static/lib/**/*.*')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/static/libs/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('image', function(cb) {
  gulp
    .src('static/images/**/*.*')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/static/images/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('index', function(cb) {
  gulp
    .src('src/index.html')
    .pipe($.replace(/{STATIC_PATH}/g, staticPath))
    .pipe($.replace(/{POST_PATH}/g, postPath))
    .pipe(gulp.dest('dist/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('html', function(cb) {
  gulp
    .src(htmlPath)
    .pipe(
      $.rename({
        dirname: '',
      })
    )
    .pipe($.replace(/{STATIC_PATH}/g, staticPath))
    .pipe($.replace(/{POST_PATH}/g, postPath))
    .pipe(gulp.dest('dist/static/view/'))
    .on('end', function() {
      sync.callback = cb;
    });
});
gulp.task('js', function(cb) {
  gulp
    .src(jsPath)
    .pipe($.plumber())
    .pipe($.concat('index.js'))
    .pipe($.replace(/{STATIC_PATH}/g, staticPath))
    .pipe($.replace(/{POST_PATH}/g, postPath))
    .pipe(gulp.dest('dist/static/js/'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/static/js/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('lib-js', function(cb) {
  gulp
    .src([
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
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('concatless', function(cb) {
  gulp
    .src(lessPath)
    .pipe($.plumber())
    .pipe($.concat('bundle.less'))
    .pipe(gulp.dest('src/style/'))
    .on('end', function() {
      sync.callback = cb;
    });
});
gulp.task('less', function(cb) {
  gulp
    .src('src/style/index.less')
    // 这里一定要记得先替换再less否则会报错
    .pipe($.plumber())
    .pipe($.replace(/{STATIC_PATH}/g, staticPath))
    .pipe($.less())
    .pipe(gulp.dest('dist/static/css/'))
    .pipe($.cssmin())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/static/css/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('json', function(cb) {
  gulp
    .src('src/components/**/*.json')
    .pipe(
      $.rename({
        dirname: '',
      })
    )
    .pipe($.plumber())
    .pipe(gulp.dest('dist/data/'))
    .on('end', function() {
      sync.callback = cb;
    });
});

gulp.task('server', function() {
  bs.init({
    server: 'dist',
    director: true,
    browser: 'google chrome',
    open: false,
    ui: false,
    files: ['dist/**/*.*'],
    rewriteRules: [
      {
        match: /\/\#\!(.*)$/g,
        fn: function(match) {
          return 'index.html/#!$1';
        },
      },
    ],
  });
});
gulp.task('replaceUrl', function(cb) {
  fs.readFile('dist/index.html', 'utf-8', function(err, data) {
    if (err) throw err;
    data += '<script>console.log = function(){}</script>';
    data = data.replace(
      /(lib|index)\.js/g,
      '$1.min.js?' + new Date().getTime()
    );
    data = data.replace(
      /(lib|index)\.css/g,
      '$1.min.css?' + new Date().getTime()
    );
    fs.writeFile('dist/index.html', data, function(err) {
      if (err) throw err;
      sync.callback = cb;
    });
  });
});

gulp.task('watch', function() {
  gulp.watch('src/index.html', function(e) {
    console.log(e.type, e.path);
    gulp
      .src(e.path)
      .pipe($.replace(/{STATIC_PATH}/g, staticPath))
      .pipe($.replace(/{POST_PATH}/g, postPath))
      .pipe(gulp.dest('dist/'));
  });
  gulp.watch(htmlPath, function(e) {
    console.log(e.type, e.path);
    gulp
      .src(e.path)
      .pipe(
        $.rename({
          dirname: '',
        })
      )
      .pipe($.replace(/{STATIC_PATH}/g, staticPath))
      .pipe($.replace(/{POST_PATH}/g, postPath))
      .pipe(gulp.dest('dist/static/view'));
  });
  gulp.watch(lessPath, ['concatless']);
  gulp.watch('src/style/*.less', ['less']);
  gulp.watch(jsPath, ['js']);
  gulp.watch(jsonPath, function(e) {
    console.log(e.type, e.path);
    gulp.src(e.path).pipe(gulp.dest('dist/data/json/'));
  });
});

gulp.task(
  'dist',
  sync(
    'distInit',
    'clean',
    'index',
    'facicon',
    'lib',
    'image',
    'html',
    'js',
    'lib-js',
    'concatless',
    'less',
    'replaceUrl'
  )
);

gulp.task(
  'test',
  sync(
    'testInit',
    'clean',
    'index',
    'facicon',
    'lib',
    'image',
    'html',
    'js',
    'lib-js',
    'concatless',
    'less',
    'replaceUrl'
  )
);

gulp.task(
  'dev',
  sync(
    'devInit',
    'clean',
    'index',
    'facicon',
    'lib',
    'image',
    'html',
    'js',
    'lib-js',
    'concatless',
    'less',
    'json',
    'server',
    'watch'
  )
);
