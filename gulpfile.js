// TODO функции gulp 
const { src, dest, series, watch } = require("gulp")
// TODO конкатенация файлов
const concat = require("gulp-concat")
// TODO минификация html
const htmlMin = require("gulp-htmlmin")
// TODO авто-префиксы
const autoprefixer = require("gulp-autoprefixer")
// TODO очистка css
const cleanCss = require("gulp-clean-css")
// TODO сборка svg
const svgSprite = require("gulp-svg-sprite")
// TODO оптимизация изображения
const image = require("gulp-image")
// TODO нечитаемый JS
const uglify = require("gulp-uglify-es").default
const babel = require("gulp-babel")
const notify = require("gulp-notify")
// TODO карта исходников
const sourceMaps = require("gulp-sourcemaps")
// TODO удаление
const del = require("del")
// TODO отслеживание файлов - браузер, авто-перезагрузка
const browserSync = require("browser-sync").create()


const clean = () => {
    return del(["dist"])
}


const resources = () => {
    return src("src/resources/**")
    .pipe(dest("dist"))
}


const svgSprites = () => {
    return src("src/images/**/*.svg")
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest("dist/images"))
}

const images = () => {
    return src([
        "src/images/**/*.png",
        "src/images/**/*.jpg",
        "src/images/**/*.jepg",
    ])
        .pipe(image())
        .pipe(dest("dist/images"))
}

const scripts = () => {
    return src("src/js/**/*.js")
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(concat("app.js"))
        .pipe(uglify({
            toplevel: true,
        }).on("error", notify.onError()))
        .pipe(dest("dist"))
        .pipe(browserSync.stream())
}

const scriptsMap = () => {
    return src("src/js/main.js")
    .pipe(sourceMaps.init())
    .pipe(sourceMaps.write())
    .pipe(dest("src/js"))
}

const styles = () => {
    return src("src/styles/**/*.css")
        .pipe(concat("styles.css"))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCss({
            level: 2,
        }))
        .pipe(dest("dist"))
        .pipe(browserSync.stream())
}

const stylesMap = () => {
    return src("src/styles/high_pass.css")
    .pipe(sourceMaps.init())
    .pipe(sourceMaps.write())
    .pipe(dest("src/styles"))
}


const htmlMinify = () => {
    return src("src/**/*.html")
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest("dist"))
        .pipe(browserSync.stream())
}


const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    })
}


watch("src/**/*.html", htmlMinify)
watch("src/styles/**/*.css", styles)
watch("src/images/**/*.svg", svgSprites)
watch("src/js/**/*.js", scripts)
watch("src/resources/**", resources)


exports.htmlMinify = htmlMinify
exports.styles = styles


exports.default = series(clean, resources, svgSprites, images, scripts, scriptsMap, htmlMinify, styles, stylesMap, watchFiles)
