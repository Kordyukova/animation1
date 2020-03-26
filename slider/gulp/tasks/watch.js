'use strict';

module.exports = function() {
  $.gulp.task('watch', function() {
    $.gulp.watch('./source/js/**/*.js', $.gulp.series('js:process'));
    $.gulp.watch('./source/style/**/*.scss', $.gulp.series('sass'));
    $.gulp.watch('./source/template/**/*.pug', $.gulp.series('pug'));
    $.gulp.watch('./source/sprite/**/*.png', $.gulp.series('sprite:png'));
    $.gulp.watch('./source/sprite/**/*.svg', $.gulp.series('sprite:svg'));
    $.gulp.watch('./source/images/**/*.*', $.gulp.series('copy:image'));
    $.gulp.watch('./source/userfiles/**/*.*', $.gulp.series('copy:userfiles'));
  });
};
