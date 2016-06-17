var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var preprocess  = require('gulp-preprocess');

gulp.task('default', function(){

});

gulp.task('build', function(){
  return gulp.src(['./public/src/scripts/revision/**/*.js'])
    .pipe(preprocess({
      context: {
        DEBUG: true
      }
    }))
    .pipe(gulp.dest("./public/app"));
});

gulp.task('lint', function() {
  return gulp.src('./public/src/scripts/revision/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
