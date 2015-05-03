var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');

//Read distribution folder and file from package.json
var pkgInfo = {};
(function () {
    var pkg = require('./package.json');
    var _main = pkg.main;
    var lastIndex = _main.lastIndexOf("/");
    if (lastIndex<1){   // the "main" property should be <folder>/<js file>
        throw "The 'main' property("+_main+") is invalid, the distribution file should be placed in a folder";
    }
    pkgInfo.dist_folder = _main.substr(0, lastIndex);
    pkgInfo.dist_js = _main.substr(lastIndex+1);
    gutil.log("Distribution", gutil.colors.green("folder:"), gutil.colors.yellow(pkgInfo.dist_folder),
                         ",", gutil.colors.green("file:"), gutil.colors.yellow(pkgInfo.dist_js));
})();

var perform_build_javascript = function(isMin){
    var uglify  = require('gulp-uglify');
    var concat  = require('gulp-concat');

    var distJs = pkgInfo.dist_js;
    if (isMin){
        var sourcemaps = require('gulp-sourcemaps');
        gulp.src('./src/**/*.js').pipe(sourcemaps.init())
            .pipe(uglify()).pipe(concat(distJs))
            .pipe(sourcemaps.write('.')).pipe(gulp.dest(pkgInfo.dist_folder));
    }else{
        gulp.src('./src/**/*.js').pipe(concat(distJs)).pipe(gulp.dest(pkgInfo.dist_folder));
    }
};
var perform_browserify_test_bundle = function () {
    //Create test bundle by browserify
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    browserify(['./test/test.js']).bundle().pipe(source('bundle.js')).pipe(gulp.dest(pkgInfo.dist_folder+'/test/'));    
}

gulp.task('connect', function() {
    connect.server({
        port: 8888,
        root: [pkgInfo.dist_folder,'test'],
        livereload: true
    });
});

gulp.task('watch', function () {    //FIXME: ERROR WHEN Folder rename, see https://github.com/gulpjs/gulp/issues/427
    var gaze = require('gaze');
    return gaze(['src/**', 'test/**'], function () {
        this.on('all', function (action, filepath) {
            gutil.log(gutil.colors.magenta(filepath), 'was', gutil.colors.yellow(action), " ...");
            perform_build_javascript(false);
            perform_browserify_test_bundle();
            gulp.src([pkgInfo.dist_folder+'/**', 'test/**']).pipe(connect.reload());
        });
    });
});

gulp.task('clean', function () {
    var del = require('del');
    del([pkgInfo.dist_folder+'/**']);
});

gulp.task('build-test', function () {
    perform_build_javascript(true);
    perform_browserify_test_bundle();
});

gulp.task('build', ["clean"], function () {
    perform_build_javascript(true);
});

gulp.task('default', ['build-test', 'connect', 'watch'], function(){
    //The default goal just start the test webserver
});
