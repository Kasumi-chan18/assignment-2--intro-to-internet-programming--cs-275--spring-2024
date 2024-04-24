const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const cleanCSS = require(`gulp-clean-css`);
const htmlmin = require(`gulp-htmlmin`);
const imagemin = require(`gulp-imagemin`);
const browserSync = require(`browser-sync`).create();
const del = require(`del`);
const rename = require(`gulp-rename`);

// Development tasks
gulp.task(`lint-js`, () => {
    return gulp.src([`js/*.js`, `node_modules/**`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task(`lint-css`, () => {
    return gulp.src([`styles/*.css`])
        .pipe(stylelint({
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
});

gulp.task(`babel`, () => {
    return gulp.src(`js/*.js`)
        .pipe(babel({
            presets: [`@babel/preset-env`]
        }))
        .pipe(gulp.dest(`js`));
});

gulp.task(`browserSync`,() => {
    browserSync.init({
        server: {
            baseDir: `./`
        }
    });
    gulp.watch([`js/*.js`, `styles/*.css`]).on(`change`, browserSync.reload);
});

gulp.task(`watch`, () => {
    gulp.watch([`**/*.js`, `!node_modules/**`], gulp.series(`lint-js`));
    gulp.watch(`styles/*.css`, gulp.series(`lint-css`));
    gulp.watch(`js/*.js`, gulp.series(`babel`));
});

// Development workflow
gulp.task(`dev`, gulp.parallel(`browserSync`, () => {
    gulp.watch(`js/*.js`, gulp.series(`lint-js`, `babel`));
    gulp.watch(`styles/*.css`, gulp.series(`lint-css`));
}));

gulp.task(`default`, gulp.parallel(`dev`));

// Production tasks
gulp.task(`clean`, () => {
    return del([`prod`]);
});

gulp.task(`build-js`, () => {
    return gulp.src(`js/*.js`)
        .pipe(babel({
            presets: [`@babel/preset-env`]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(`prod/js`));
});

gulp.task(`build-css`, () => {
    return gulp.src(`styles/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`prod/styles`));
});

gulp.task(`build-html`, () => {
    return gulp.src(`index.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(`prod`));
});

gulp.task(`build-img`, () => {
    return gulp.src(`img/*`)
        .pipe(imagemin())
        .pipe(gulp.dest(`prod/img`));
});

// Create 'prod' directory
gulp.task(`create-prod-dir`, () => {
    return gulp.src(`*.*`, { read: false })
        .pipe(rename())
        .pipe(gulp.dest(`prod`));
});

// Production workflow
// eslint-disable-next-line max-len
gulp.task(`build`, gulp.series(`clean`,`create-prod-dir`, `lint-js`, `lint-css`, `babel`, `build-js`, `build-css`, `build-html`, `build-img`));

gulp.task(`default`, gulp.series(`dev`));
