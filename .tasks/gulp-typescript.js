import filter from 'gulp-filter';
import gulp from 'gulp';
import { merge } from 'event-stream';
import ts from 'gulp-typescript';
import { compilerOptions } from '../tsconfig';

const project = ts.createProject('tsconfig.json');

export default () => {
	const libResult = project.src().pipe(ts(project));
	return merge(
		libResult.dts
			.pipe(filter(['**', '!test/**']))
			.pipe(gulp.dest(compilerOptions.outDir)),
		libResult.js.pipe(gulp.dest(compilerOptions.outDir))
	);
};
