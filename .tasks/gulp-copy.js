import gulp from 'gulp';

export default () => {
	return gulp.src('build/lib/**/*.d.ts', { base: 'build' })
		.pipe(gulp.dest('dist'));
}
