var gulp = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var coveralls = require('gulp-coveralls');
var rename = require('gulp-rename');
var lint = require('gulp-jshint');

gulp.task('build', function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('upload', function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('../chezstov.github.io'));
});

gulp.task('test', function() {
    return gulp.src('spec/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('coveralls', function() {
    return gulp.src('./coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(lint())
	.pipe(lint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['build', 'upload', 'lint', 'test']);
    gulp.watch('spec/*.js', ['test']);
});

gulp.task('default', ['build', 'lint', 'test', 'coveralls']);
