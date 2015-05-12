var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
	return browserify('./src/morph-svg.js', {
			standalone: 'morph'
		})
		.transform('babelify')
		.bundle()
		.pipe(source('morph.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	return gulp.watch('src/**/*', ['']);
});

gulp.task('test', function() {
	return gulp.src('dist/test.html')
		.pipe(plugins.jasmine());
});