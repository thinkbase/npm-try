var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');

//Read distribution folder and file from package.json
var pkgInfo = {};
(function () {
	var getFolderAndFile = function(path, name){
		var lastIndex = path.lastIndexOf("/");
		if (lastIndex<1){   // the "path" property should be <folder>/<js file>
	        throw "The path of property '"+name+"' ("+path+") is invalid";
	    }
		var result = { dir: path.substr(0, lastIndex), file: path.substr(lastIndex+1) };
	    gutil.log(name, '-', gutil.colors.green("folder:"), gutil.colors.yellow(result.dir),
                        ",", gutil.colors.green("file:"), gutil.colors.yellow(result.file));
		return result;
	};
    var pkg = require('./package.json');
    pkgInfo.distJS = getFolderAndFile(pkg.main, "package.json main");
    pkgInfo.distCSS = getFolderAndFile(pkg.style, "package.json style");
})();

var perform_build_javascript = function(isMin){
    var concat = require('gulp-concat');

    if (isMin){
        var uglify = require('gulp-uglify');
        var minifyCss = require('gulp-minify-css');
        var sourcemaps = require('gulp-sourcemaps');
        gulp.src('./src/**/*.js')
        	.pipe(sourcemaps.init())
            	.pipe(uglify()).pipe(concat(pkgInfo.distJS.file))
            .pipe(sourcemaps.write('.')).pipe(gulp.dest(pkgInfo.distJS.dir));
        gulp.src('./src/**/*.css')
        	.pipe(sourcemaps.init())
        		.pipe(minifyCss()).pipe(concat(pkgInfo.distCSS.file))
        	.pipe(sourcemaps.write('.')).pipe(gulp.dest(pkgInfo.distCSS.dir));
    }else{
        gulp.src('./src/**/*.js').pipe(concat(pkgInfo.distJS.file)).pipe(gulp.dest(pkgInfo.distJS.dir));
        gulp.src('./src/**/*.css').pipe(concat(pkgInfo.distCSS.file)).pipe(gulp.dest(pkgInfo.distCSS.dir));
    }
    
    gulp.src('./src/images/**/*').pipe(gulp.dest(pkgInfo.distCSS.dir + '/images/'));
};

var perform_browserify_test_bundle = function () {
    //Create test bundle by browserify
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    browserify(['./test/test.js'])
    	.transform(require('browserify-css'), {
	        rootDir: 'src',
	        processRelativeUrl: function(relativeUrl) {
	            return relativeUrl;
	        }
	    })
    	.bundle().pipe(source('bundle.js')).pipe(gulp.dest(pkgInfo.distJS.dir+'/test/'));    
}

gulp.task('connect', function() {
    connect.server({
        port: 8888,
        root: [pkgInfo.distJS.dir, pkgInfo.distCSS.dir,'test'],
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
            gulp.src([pkgInfo.distJS.dir+'/**', pkgInfo.distCSS.dir+'/**', 'test/**']).pipe(connect.reload());
        });
    });
});

gulp.task('clean', function () {
    var del = require('del');
    del([pkgInfo.distJS.dir+'/**']);
    del([pkgInfo.distCSS.dir+'/**']);
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
