import gulp from 'gulp';

export default () => {
	gulp.watch(
		[
			'lib/**/*.ts',
			'test/**/*.ts'
		],
		['eslint:no-clean']
	);
}
