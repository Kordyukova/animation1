'use strict';

module.exports = function () {
    $.gulp.task('sprite:png', function() {
        var merge = require('merge-stream'),
            spriteData = $.gulp.src('./source/sprite/**/*.png')
            .pipe($.gp.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../img/sprite.png',
            padding: 2}));

        var imgStream = spriteData.img
            .pipe($.buffer())
            .pipe($.gp.imagemin())
            .pipe($.gulp.dest($.config.root + '/assets/img'));

        var cssStream = spriteData.css
            .pipe($.buffer())
            .pipe($.gp.rename({ extname: ".scss" }))
            .pipe($.gulp.dest('./source/style'));

        return merge (imgStream, cssStream);
    });
};
