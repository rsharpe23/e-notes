// import не поддерживается здесь

const gulp = require('gulp');
const rollup = require('gulp-rollup');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify-css');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('clean', () => del('dist'));

gulp.task('watch', gulp.series(() => {
  gulp.watch('src/js/node_modules/**/*.js')
    .on('change', gulp.parallel('bundle:js'));
}));

gulp.task('bundle:js', () => {
  return gulp.src('src/js/node_modules/**/*.js')
    .pipe(rollup({
      format: 'iife',
      input: 'src/js/node_modules/bundle.js'
    }))
    .pipe(gulp.dest('src/js'));
});

/**
 * ------------
 * Build HTML
 * ------------
 */

gulp.task('build:html', () => {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

/**
 * ------------
 * Build Fonts
 * ------------
 */

gulp.task('build:fonts', () => {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

/**
 * ------------
 * Build CSS
 * ------------
 */

gulp.task('pre-build01:css', () => {
  return gulp.src('src/css/bundle.css')
    .pipe(autoprefixer([
      'last 15 versions',
      '> 1%',
      'ie 8',
      'ie 7'
    ], { cascade: true }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('pre-build02:css', () => {
  return gulp.src('dist/css/bundle.css')
    .pipe(minify())
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task(
  'build:css',
  gulp.series('pre-build01:css', 'pre-build02:css', () => {
    return gulp.src([
      'src/css/**/*.css',
      '!src/js/bundle.css',
    ]).pipe(gulp.dest('dist/css'));
  })
);

/**
 * ------------
 * Build JS
 * ------------
 */

gulp.task('pre-build01:js', () => {
  return gulp.src('src/js/bundle.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('pre-build02:js', () => {
  return gulp.src('dist/js/bundle.js')
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task(
  'build:js',
  gulp.series('bundle:js', 'pre-build01:js', 'pre-build02:js', () => {
    return gulp.src([
      'src/js/**/*.js',
      '!src/js/bundle.js',
      '!src/js/node_modules/**/*.js'
    ]).pipe(gulp.dest('dist/js'));
  })
);

/**
 * ------------
 * Build
 * ------------
 */

gulp.task('build', gulp.series(
  'clean',
  'build:fonts',
  'build:html',
  'build:css',
  'build:js'
));