var version = require("./version").version;
var fs = require('fs');


var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  minifycss = require("gulp-minify-css"),
  uglify = require("gulp-uglify"),
  gutil = require('gulp-util'),
  imagemin = require("gulp-imagemin"),
  rename = require("gulp-rename"),
  clean = require("gulp-clean"),
  concat = require("gulp-concat"),
  notify = require("gulp-notify"),
  cache = require("gulp-cache"),
  livereload = require("gulp-livereload");

// 样式处理任务
gulp.task("styles", function() {
  return gulp
    .src("assets/css/*.css") //引入所有CSS
    .pipe(concat(`default_v${version}.css`)) //合并CSS文件
    .pipe(
      autoprefixer(
        "last 2 version",
        "safari 5",
        "ie 8",
        "ie 9",
        "opera 12.1",
        "ios 6",
        "android 4"
      )
    )
    .pipe(rename({ suffix: '.min' })) //重命名
    .pipe(minifycss()) //CSS压缩
    .pipe(gulp.dest("public/css")) //压缩版输出
    .pipe(notify({ message: "样式文件处理完成" }));
});

// 如果需要通过scss文件编译css，就使用这段代码
// gulp.task('styles', function() {
//   return gulp.src('public/html/css/main.scss')
//     .pipe(sass({ style: 'expanded', }))
//     .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
//     .pipe(gulp.dest('public/dist/styles'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(minifycss())
//     .pipe(gulp.dest('public/dist/styles'))
//     .pipe(notify({ message: 'Styles task complete' }));
// });

gulp.task("scripts", function() {
  return gulp
    .src(["assets/js/jquery.min.js",
        "assets/js/jquery.cookie.js",
        "assets/js/dropload.min.js",
        "assets/js/mui.min.js",
        "assets/js/lazyload.min.js",
        "assets/js/bootstrap.min.js",
        "assets/js/clipboard.min.js",
        "assets/js/iconfont.js",
        "assets/js/tool.js"
        ]) //引入所有需处理的JS
    .pipe(concat(`default.js`)) //合并JS文件
    .pipe(rename({ suffix: `_v${version}.min` })) //重命名
    .pipe(gulp.dest("public/js")) //完整版输出
    .pipe(notify({ message: "合并公共JS文件" }));
});

gulp.task("rename_scripts", function() {
  return gulp
    .src(['assets/js/*.js',
    '!assets/js/*.min.js',
    "!assets/js/iconfont.js",
    "!assets/js/tool.js",
    '!assets/js/jquery.cookie.js']) //引入所有需处理的JS
    .pipe(rename({ suffix: `_v${version}.min` })) //重命名
    .pipe(gulp.dest("public/js")) //完整版输出
    .pipe(notify({ message: "单个JS文件重命名完成" }));
});

// 图片处理任务
gulp.task("images", function() {
  return (gulp
      .src("assets/images/*") //引入所有需处理的JS
      .pipe(
        imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
      ) //压缩图片
      // 如果想对变动过的文件进行压缩，则使用下面一句代码
      // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(rename({ suffix: `_v${version}` })) //重命名
      .pipe(gulp.dest("public/images/"))
      .pipe(notify({ message: "图片处理完成" })) );
});

// 复制文字文件
gulp.task("fonts", function() {
  return (gulp
      .src("assets/fonts/*") //引入所有需处理的JS
      .pipe(gulp.dest("public/fonts/"))
      .pipe(notify({ message: "复制文字文件处理完成" })) );
});

// 目标目录清理
gulp.task("clean", function() {
  return gulp
    .src(["public/images", "public/js", "public/css",'public/fonts'], { read: false })
    .pipe(clean());
});

// 预设任务，执行清理后，
gulp.task("default", function() {
  version++;
  fs.writeFile('./version.json', 
  `{
    "version": ${version}
   }`,'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  gulp.start("styles", "scripts", "images",'rename_scripts','fonts');
});

// 文档临听
gulp.task("watch", function() {
  //  // 监听所有.scss文档
  //   gulp.watch('src/styles/**/*.scss', ['styles']);

  // 监听所有css文档
  gulp.watch("assets/css/*.css", ["styles"]);

  // 监听所有.js档
  gulp.watch("assets/js/*.js", ["scripts"]);

  // 监听所有图片档
  gulp.watch("assets/images*", ["images"]);

  //   // 创建实时调整服务器 -- 在项目中未使用注释掉
  //   var server = livereload();
  //   // 监听 dist/ 目录下所有文档，有更新时强制浏览器刷新（需要浏览器插件配合或按前文介绍在页面增加JS监听代码）
  //   gulp.watch(['public/dist/**']).on('change', function(file) {
  //     server.changed(file.path);
  //   });
});
