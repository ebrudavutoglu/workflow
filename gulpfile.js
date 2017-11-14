var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('tpl/scss/index.scss')
    .pipe(sass({oupPutStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

gulp.task('defaut', ['sass']);
