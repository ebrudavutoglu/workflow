var gulp           = require('gulp');
var sass           = require('gulp-sass');
var autoprefixer   = require('gulp-autoprefixer');
var clean          = require('gulp-clean');
var concat         = require('gulp-concat');
var browserify     = require('gulp-browserify');
var merge          = require('merge-stream');
var newer          = require('gulp-newer');
var imagemin       = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify         = require('gulp-minify');
var cssmin         = require('gulp-cssmin');
var rename         = require('gulp-rename');
var browserSync    = require('browser-sync');
var reload         = browserSync.reload;

var SOURCEPATH = {
  sassSource       : 'tpl/scss/*.scss',
  htmlSource       : 'tpl/*.html',
  htmlPartialSource: 'tpl/partial/*.html',
  jsSource         : 'tpl/js/**',
  imgSource        : 'tpl/images/**'
}
var APPPATH = {
  root             : 'app/',
  css              : 'app/css',
  js               : 'app/js',
  img              : 'app/images'
}

gulp.task('clean-html', function(){
  return gulp.src(APPPATH.root + '/*.html', {read: false, forse:true})
    .pipe(clean());
});
gulp.task('clean-js', function(){
  return gulp.src(APPPATH.js + '/*.js', {read: false, forse:true})
    .pipe(clean());
});

gulp.task('html', function(){
    gulp.src(SOURCEPATH.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPPATH.root))
});

gulp.task('fonticons', function(){

});

gulp.task('images', function(){
  return gulp.src(SOURCEPATH.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});
/**Production Task **/

gulp.task('compress', function(){
  gulp.src(SOURCEPATH.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(APPPATH.js));
});

gulp.task('compresscss', function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATH.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({oupPutStyle:'compressed'}).on('error', sass.logError))
  return merge(bootstrapCSS, sassFiles)
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(APPPATH.css));
});

/**End Of Production Task **/

gulp.task('serve',['sass'], function(){
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '*.html', APPPATH.js + '*.js'],{
    server:{
      baseDir : APPPATH.root
    }
  });
});

gulp.task('watch', ['serve', 'sass', 'html', 'clean-html', 'script', 'clean-js','images'], function() {
  gulp.watch([SOURCEPATH.sassSource],['sass']);
  gulp.watch([SOURCEPATH.htmlSource, SOURCEPATH.htmlPartialSource],['html']);
  gulp.watch([SOURCEPATH.jsSource],['script']);
  gulp.watch([SOURCEPATH.imgSource],['images']);

})

gulp.task('default', ['watch']);

gulp.task('production', ['compresscss', 'compress'] );
