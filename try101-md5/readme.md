About
========
This is the very simple "single" javascript module, which has no dependency.

This package includes a function "MD5" as example.

Conventions
========
 - `src`: The sources
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
            gaze gulp gulp-util gulp-sourcemaps del \
            gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename \
            gulp-connect gulp-watch \
            browserify vinyl-source-stream \
            --save-dev --verbose

Usage
========
 1. `gulp` to build debug distribution and deploy `test/index.html` at `http://localhost:8888` ;
 2. `gulp build` to create a release distribution;
