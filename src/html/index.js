const path = require("path");
const fs = require("fs");

const BUILD_DIR = path.resolve("build");

// Static assets to inject into HTML
const shellJS = fs.readFileSync(`${BUILD_DIR}/js/shell.js`, {encoding: "utf-8"});
const shellCSS = fs.readFileSync(`${BUILD_DIR}/css/shell.css`, {encoding: "utf-8"});

module.exports = {
  siteTitle: "Bilateral Stimulation",
  static: {
    js: shellJS,
    css: shellCSS,
  },
};
