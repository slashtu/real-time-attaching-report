var gulp = require('gulp');
var webpack = require('gulp-webpack');

var paths = {
	view : 'public/www/*.html',
	images : 'public/images/*.*',
    css: './public/css/*.css',
    data: './public/data/nations.json',
    destDir: 'build',
    destCSS: 'build/assets/css',
    destData:'build/assets/data'
};

gulp.task('webpack', function() {
    return gulp.src('')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe( gulp.dest(paths.destDir) )
});

gulp.task( 'static-files-handler' , function(){

    var _image = gulp.src( paths.images )
                .pipe(gulp.dest(paths.destDir+'/images'));
    var _view = gulp.src( paths.view )                  
                .pipe(gulp.dest(paths.destDir));

    var _data = gulp.src( paths.data )                  
                .pipe(gulp.dest(paths.destData));
});

gulp.task('minify-css', function() {
    gulp.src( paths.css )
        //.pipe(minifyCSS(
        //    {
        //        noAdvanced: false,
        //        keepBreaks:true,
        //        cache: true
        //    }))
        .pipe(gulp.dest( paths.destCSS ))
});

gulp.task('default', ['webpack', 'minify-css', 'static-files-handler'] );

gulp.task('watch', function() {
    gulp.watch( 'public/**/*', ['default'] );
});
gulp.task('build', ['default', 'watch'] );

