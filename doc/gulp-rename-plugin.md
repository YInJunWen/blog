# gulp-rename 插件

gulp.dest(path)方法可以指定文件被处理后的保存位置，如果使用了 glob 匹配，默认的保存路径则是**path+文件的 glob 部分**

下面的案例说明了使用在使用了 rename 插件和没使用插件之间的差别

```js
const gulp = require('gulp);
const rename = require('gulp-rename);

gulp.src("src/**/*.html")
  .pipe(gulp.dest('./output'))   //最终保存路径为 ./output/component/person/index.html

gulp.src("src/**/*.html")
  .pipe(rename({
    dirname: './'
  }))
  .pipe(gulp.dest('./output'))   //最终保存路径为 ./output/index.html

gulp.src("src/**/*.html")
  .pipe(rename({
    dirname: './view'
  }))
  .pipe(gulp.dest('./output'))   //最终保存路径为 ./output/view/index.html
```
