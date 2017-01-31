/* tslint:disable */
/* eslint-disable no-console, no-multi-spaces, import/no-extraneous-dependencies */
const gulp         = require('gulp');
const runSequence  = require('run-sequence');
const gutil        = require('gulp-util');
const del          = require('del');
// ...
gutil.log = gutil.noop;

gulp.task('watch', () => {
	gulp.run('build');
	gulp.watch([`${SRC_CLIENT_DIR}/**/*`, `${APP_STATIC_DIR}/main.js`], ['build']);
});

gulp.task('purge:cache', () => {
	return del(`${CLIENT_CACHE}`);
});

// Default task for dev - watch Files For Changes
// The build task is in gulp/client-build.js
gulp.task('default', ['purge:cache'], () => {
	runSequence('build', 'watch');
});

gulp.task('build', (done) => {
	const spinner = new Spinner('processing.. %s');
	spinner.setSpinnerString(18);
	spinner.setSpinnerTitle('%s Rebuilding the application...');
	spinner.start();

	return fs.mkdirp(`${DST_CLIENT_DIR}`, () => {
		runSequence(
			'clean:client',
			'html:client',
			'css:client', // @TODO - Refactor all CSS to SASS, then remove this.

			() => {
				spinner.stop();
				console.log(chalk.yellow(`App built in ${DST_CLIENT_DIR}.`));
				gulp.src('package.json')
					.pipe(notify({
						title: 'Scoreboard build',
						message: 'A new build is ready',
					}));
				done();
			});
	});
});