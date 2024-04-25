const { src, dest, watch, series } = require(`gulp`);
const babel = require(`gulp-babel`);
const eslint = require(`gulp-eslint`);
const stylelint = require(`gulp-stylelint`);
const browserSync = require(`browser-sync`).create();

function html() {
    return src(`index.html`)
        .pipe(dest(`prod`));
}

function css() {
    return src(`styles/*.css`)
        .pipe(stylelint({
            reporters: [
                { formatter: `string`, console: true }
            ]
        }))
        .pipe(dest(`prod/styles`));
}

function js() {
    return src(`js/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel({
            presets: [`@babel/preset-env`]
        }))
        .pipe(dest(`prod/js`));
}

function watchFiles() {
    watch([`index.html`, `styles/*.css`, `js/*.js`], series(html, css, js, reload));
}

function reload(done) {
    browserSync.reload();
    done();
}

function serve() {
    browserSync.init({
        server: {
            baseDir: `./prod`
        }
    });
}

exports.default = series(html, css, js, serve, watchFiles);
exports.build = series(html, css, js);
