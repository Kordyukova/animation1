'use strict';

module.exports = function() {
    var fs = require('fs');
    let locals = JSON.parse(fs.readFileSync('./content.json', 'utf-8'));
  $.gulp.task('pug', function() {
    return $.gulp.src('./source/template/pages/*.pug')
      .pipe($.gp.pug({
          locals: locals,
          pretty: true }))
      .on('error', $.gp.notify.onError(function(error) {
        return {
          title: 'Pug',
          message:  error.message
        }
       }))
      .pipe($.gulp.dest($.config.root));
  });
};
