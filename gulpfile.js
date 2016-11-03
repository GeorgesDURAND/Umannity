//GLOBALS
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
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');

//VARIABLES
var js_dirs = ['./dev/js/*.js', './dev/js/*/*.js', './dev/js/*/*/*.js', './dev/js/*/*/*/*.js'];

//TASKS

gulp.task('run', ['watch', 'webserver']);

////

gulp.task('webserver', function(){
    gulp.src('./dev/')
	.pipe(webserver({
	    livereload: true,
	    directoryListing:{
		enable: false,
		path: './dev/',
		fallback: 'index.html'
	    },
	    open: true,
	    port: 7979
	}));
});

function sassError(error){
    console.log(error.stack);
}

gulp.task('sass', function (){
    gulp.src('./dev/sass/*.scss')
	.pipe(sass({
	    includePaths: ['./dev/sass'],
	    outputStyle: 'expanded'
	}))
	.on('error', sassError)
	.pipe(prefix(
	    "last 1 version", "> 1%", "ie 8", "ie 7"
	))
	.pipe(concatCss("umannity.css"))
    	.pipe(minifycss())
    	.pipe(gulp.dest('./dev/css'))
	.pipe(gulp.dest('./prod/css'));
});

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('jshint', function(){
    gulp.src(js_dirs)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('jscs', function(){
    gulp.src(js_dirs)
	.pipe(jscs('.jscsrc'))
	.pipe(jscs.reporter())
});

gulp.task('uglify-js', function(){
    gulp.src(['./dev/js/*.js', './dev/lib/*/*.js'])
	.pipe(uglify())
	.pipe(concat('umannity.js'))
	.pipe(gulp.dest('./prod/js'));
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

gulp.task('build', ['bower', 'lint', 'htmlmin', 'sass', 'uglify-js', 'imagemin', 'svgmin']);

gulp.task('watch', function(){
    
    gulp.watch(["./dev/sass/**/*.scss"], ['sass']);

    gulp.watch("./dev/js/**/*.js", function(event){
	gulp.run('uglify-js');
    });

    gulp.watch("./dev/img/**/*", function(event){
	gulp.run('imagemin');
	gulp.run('svgmin');
    });
});
