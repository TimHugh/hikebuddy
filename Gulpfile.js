const gulp       = require('gulp'),
      babel      = require('gulp-babel'),
      browserify = require('browserify'),
      buffer     = require('vinyl-buffer'),
      del        = require('del'),
      gutil      = require('gulp-util'),
      livereload = require('gulp-livereload'),
      ngAnnotate = require('gulp-ng-annotate'),
      sass       = require('gulp-sass'),
      source     = require('vinyl-source-stream'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify     = require('gulp-uglify')
      ;

const Config = require('./gulp-config.json');

gulp.task('javascript', ['clean:javascript'], () => {
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
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(Config.destination))
    .pipe(livereload());
});

gulp.task('css', ['clean:css'], () => {
  gulp.src(Config.source + '/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(Config.destination));
});

gulp.task('copy-index', ['clean:index'], () => {
  return gulp.src(Config.source + '/index.html')
    .pipe(gulp.dest(Config.destination));
});

gulp.task('clean', () => del([ Config.destination ]));
gulp.task('clean:css', () => del([ Config.destination + '**/*.css' ]));
gulp.task('clean:javascript', () => del([ Config.destination + '**/*.js' ]));
gulp.task('clean:index', () => del([ Config.destination + '/index.html' ]));

gulp.task('watch', ['build'], () => {
  livereload.listen();
  gulp.watch(Config.source + '/**/*.js', ['javascript']);
  gulp.watch(Config.source + '/**/*.css', ['css']);
  gulp.watch(Config.source + '/index.html', ['copy-index']);
});

gulp.task('build', ['copy-index', 'css', 'javascript']);
gulp.task('default', ['build']);
