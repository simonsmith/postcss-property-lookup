import del from 'del';

export default () => {
	return del([
		'build/**/*.js',
		'build/**/*.d.ts',
		'dist'
	]);
}
