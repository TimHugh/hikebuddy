const gulp       = require('gulp'),
      babel      = require('gulp-babel'),
      browserify = require('browserify'),
      buffer     = require('vinyl-buffer'),
      del        = require('del'),
      gutil      = require('gulp-util'),
      livereload = require('gulp-livereload'),
      ngAnnotate = require('gulp-ng-annotate'),
      source     = require('vinyl-source-stream'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify     = require('gulp-uglify')
      ;

const Config = require('./gulp-config.json');

gulp.task('javascript', ['clean'], () => {
  var b = browserify({
    entries: Config.source + '/js/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write(Config.destination))
    .pipe(gulp.dest(Config.destination))
    .pipe(livereload());
});

gulp.task('copy-index', ['clean'], () => {
  return gulp.src(Config.source + '/index.html')
    .pipe(gulp.dest(Config.destination));
});

gulp.task('clean', () => del([ Config.destination ]));

gulp.task('watch', ['build'], () => {
  livereload.listen();
  gulp.watch(Config.source + '/**/*', ['build']);
});

gulp.task('build', ['copy-index', 'javascript']);
gulp.task('default', ['build']);
