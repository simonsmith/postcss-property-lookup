import gulp from 'gulp';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import babel from 'gulp-babel';

gulp.task('lint', () => {
  return gulp.src(['lib/index.js', 'test/*.js', 'gulpfile.babel.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', () => {
  return gulp.src('lib/index.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('test', () => {
  return gulp.src('test/*.js', { read: false }).pipe(mocha());
});

gulp.task('default', ['lint', 'test']);
