var gulp = require('gulp');
var sass = require('gulp-sass');
var cp = require('child_process');
var browserSync = require('browser-sync');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

gulp.task('jekyll-build', function (done) {
  browserSync.notify('Jekyll building');

  return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload({stream: true});
});

gulp.task('browser-sync', ['jekyll-build'], function () {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('css', function () {
  console.log('css wooooo!');
  return gulp.src('sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('css/'))
    .pipe(gulp.dest('_site/css/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch([
    'sass/**/*.scss'
    ], ['css']);

  gulp.watch([
    '*.html',
    '_layouts/*.html',
    '_posts/*'
  ], ['jekyll-rebuild']);
});

gulp.task('default', ['css', 'browser-sync', 'watch']);
