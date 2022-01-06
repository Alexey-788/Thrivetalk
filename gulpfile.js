const { src, dest, watch, parallel, series } = require('gulp');
const gulp = require('gulp');

const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const del          = require('del');
const browserSync  = require('browser-sync').create();
const ghPages      = require('gulp-gh-pages');

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function images() {
    return src('app/images/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'));
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true,
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function cleanDist() {
    return del('dist');
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/**/main.min.js'], scripts);
    watch(['app/**/*.html']).on('change', browserSync.reload);
}

function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], {base: 'app'})
    .pipe(dest('dist'));
}

exports.cleanDist = cleanDist;
exports.scripts = scripts;
exports.styles  = styles;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;

exports.default = parallel(styles, scripts, browsersync, watching);
exports.build = series(cleanDist, images, build);