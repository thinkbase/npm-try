About
========
This is the simple javascript + css module, which has no dependency.

This package includes decoration functions as example.

Conventions
========
 - `src`: The sources
  * `images`: The image files for CSS
 - `test`: The test resources
  * `test.js`: The test javascript file
  * `index.html`: The test html file
 - `dist`: The build result for distribution
  * `test/bundle.js`: The compiled test.js file

Prepare
========
 1. Run `npm init` to build package.json;
 2. Run `npm install ... --save-dev --verbose` to prepare the develop dependencies;

         npm install \
            gaze vinyl-source-stream  \
            gulp gulp-util gulp-sourcemaps del \
            gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-minify-css gulp-rename \
            gulp-connect gulp-watch \
            browserify browserify-css gulp-browserify \
            --save-dev --verbose

Usage
========
 1. `gulp` to build debug distribution and deploy `test/index.html` at `http://localhost:8888` ;
 2. `gulp build` to create a release distribution;
