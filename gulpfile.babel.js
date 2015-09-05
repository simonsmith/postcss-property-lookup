import gulp from 'gulp';

function loadTask(taskName) {
	return require(`./.tasks/gulp-${taskName}`);
}

gulp.task('default', ['eslint']);
gulp.task('eslint', ['typescript'], loadTask('eslint'));
gulp.task('eslint:no-clean', ['typescript:no-clean'], loadTask('eslint'));
gulp.task('typescript', ['clean', 'tslint'], loadTask('typescript'));
gulp.task('typescript:no-clean', ['tslint'], loadTask('typescript'));
gulp.task('clean', loadTask('clean'));
gulp.task('tslint', loadTask('tslint'));
gulp.task('watch', ['typescript'], loadTask('watch'));
gulp.task('copy', loadTask('copy'));
