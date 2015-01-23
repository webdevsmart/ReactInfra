var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react');

var paths = {
  dependencies: [
    'vendor/**/*.js'
  ],
  scripts: [
    'fresh.js',
    'lib/**/*.js',
    'mixins/**/*.js',
    'widgets/**/*.jsx']
};

gulp.task('scripts', function() {
  // Node bundle
  gulp.src(paths.scripts)
    .pipe(react())
    .pipe(concat('fresh-bundle.js'))
    .pipe(gulp.dest('.'));
  // Bundle bundle
  gulp.src(paths.dependencies.concat(paths.scripts))
    .pipe(react())
    .pipe(concat('fresh-bundle-with-dependencies.js'))
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
