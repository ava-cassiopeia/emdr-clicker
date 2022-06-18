const path = require("path");
const gulp = require("gulp");
const clean = require("gulp-clean");
const sass = require("gulp-sass")(require("node-sass"));
const ts = require("gulp-typescript");
const webpack = require("webpack-stream");
const HandlebarsGenerator = require("handlebars-generator");

const tsProject = ts.createProject("src/ts/tsconfig.json");

const OUTPUT_DIR = "build";

const SCSS_SRCS = ["src/scss/*.scss", "src/scss/**/*.scss"];
const HTML_SRCS = ["src/html/*.hbs", "src/html/**/*.hbs"];
const TS_SRCS = ["src/ts/*.ts", "src/ts/**/*.ts"];

function buildHTML(cb) {
  HandlebarsGenerator.generateSite(
    "src/html",
    OUTPUT_DIR,
    {sourceExtension: "hbs"})
      .then(function () {
          console.log("successfully generated HTML pages");
          cb();
      }, function (e) {
          console.error("failed to generate HTML pages", e);
          cb();
      });
}

function buildCSS() {
  return gulp.src(SCSS_SRCS)
      .pipe(sass())
      .pipe(gulp.dest(`${OUTPUT_DIR}/css/`));
}

function buildJS() {
  return tsProject.src()
      .pipe(webpack({
        mode: "development",
        entry: {
          shell: "./src/ts/shell.ts",
          site: "./src/ts/site.ts",
        },
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
          ],
        },
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
          filename: '[name].js'
        }
      }))
      .pipe(gulp.dest(`${OUTPUT_DIR}/js/`));
}

function copyStaticAssets() {
  return gulp.src(["static/*"])
    .pipe(gulp.dest(`${OUTPUT_DIR}/`));
}

function cleanUpOutput() {
  return gulp.src([OUTPUT_DIR])
    .pipe(clean());
}

function rebuildOnSave() {
  gulp.watch(
    HTML_SRCS,
    gulp.series([gulp.parallel([buildJS, buildCSS]), buildHTML]));
  gulp.watch(SCSS_SRCS, gulp.series([buildCSS, buildHTML]));
  gulp.watch(TS_SRCS, gulp.series([buildJS, buildHTML]));
}

exports.default = gulp.series([
  // We must build the JavaScript and CSS before we build the HTML so that the
  // shell code that needs to be injected into the HTML is present for
  // consumption by the handlebars generator.
  gulp.parallel([buildJS, buildCSS]),
  gulp.parallel([buildHTML, copyStaticAssets]),
]);
exports.clean = cleanUpOutput;
exports.watch = rebuildOnSave;
