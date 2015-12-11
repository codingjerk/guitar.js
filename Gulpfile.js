var gulp = require('gulp');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var coveralls = require('gulp-coveralls');
var rename = require('gulp-rename');

gulp.task('build', function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('test', function() {
    return gulp.src('spec/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['build', 'test']);
});

gulp.task('coveralls', function() {
    return gulp.src('./coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['build', 'test', 'coveralls']);
