var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var svgmin = require('gulp-svgmin');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var htmlmin = require('gulp-htmlmin');
var exec = require('gulp-exec');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var bower = require('gulp-bower');

////

gulp.task('sass', function (){
    gulp.src('./dev/sass/*.scss')
	.pipe(sass({
	    includePaths: ['./dev/sass'],
	    outputStyle: 'expanded'
	}))
	.pipe(prefix(
	    "last 1 version", "> 1%", "ie 8", "ie 7"
	))
	.pipe(gulp.dest('./dev/css'))
	.pipe(minifycss())
	.pipe(gulp.dest('./prod/css'));
});

gulp.task('jslint', function(){
    gulp.src(['./dev/js/*.js', './dev/js/*/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('jscs', function(){
    gulp.src(['./dev/js/*.js', './dev/js/*/*.js'])
        .pipe(jscs('.jscsrc'))
	.pipe(jscs.reporter())
});

gulp.task('lint', ['jslint', 'jscs']);

gulp.task('uglify-js', function(){
    gulp.src('./dev/js/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('./prod/js'));
});

gulp.task('uglify-libs', function(){
    gulp.src('./dev/lib/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('./prod/lib'));
});

gulp.task('svgmin', function() {
    gulp.src('./dev/img/svg/*.svg')
	.pipe(svgmin())
	.pipe(gulp.dest('./dev/img/svg'))
	.pipe(gulp.dest('./prod/img/svg'));
});

gulp.task('imagemin', function () {
    gulp.src('./dev/img/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./dev/img'))
	.pipe(gulp.dest('./prod/img'));
});

gulp.task('stats', function () {
    gulp.src('./prod/**/*')
	.pipe(size())
	.pipe(gulp.dest('./prod'));
});

gulp.task('htmlmin', function () {
    return gulp.src('./dev/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./prod/'))
});

gulp.task('default', ['build']);

gulp.task('bower', function(){
    return bower();
});

gulp.task('build', ['bower', 'jslint', 'htmlmin', 'sass', 'uglify-js', 'uglify-libs', 'imagemin', 'svgmin']);

gulp.task('watch', function(){
    
    gulp.watch("./dev/sass/**/*.scss", function(event){
	gulp.run('sass');
    });

    gulp.watch("./dev/js/**/*.js", function(event){
	gulp.run('uglify');
    });

    gulp.watch("./dev/img/**/*", function(event){
	gulp.run('imagemin');
			gulp.run('svgmin');
    });
});
