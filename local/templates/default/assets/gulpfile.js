var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    csscomb = require('gulp-csscomb'),
    csso = require('gulp-csso'),
    gcmq = require('gulp-group-css-media-queries'),
    nib = require('nib'),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus');
    watch = require('gulp-watch');

// Initial default ...
var path = {
  // Sources paths
  src: {
    js: [
      'bundles/**/*.js',
      'js/**/*.js'
    ],
    styl: [
      'bundles/**/*.styl',
      'bundles/**/**/*.styl',
    ],
    html: [
      '../../../../*.html',
    ]
  }
}

// Task for work with Stylus
gulp.task('stylus', function(){
  return gulp.src([
      'bundles/*.styl',
      'bundles/*/*.styl',
      '!bundles/styl'
    ])
    .pipe(plumber())
    .pipe(stylus({
      use:[nib()],
      'include css': true
    }))
    .pipe(gcmq())
    .pipe(csso())
    .pipe(csscomb())
    .on("error", notify.onError(function(error){
      return "Message to the notifier: " + error.message;
    }))
    .pipe(autoprefixer({
        browsers: ['>= 0.01% in RU'],
        cascade: false
      }))
    .pipe(concat('template_styles.css'))
    .pipe(gulp.dest('../'))
    .pipe(browsersync.reload({
      stream: true
    }));
});

// Task for work whith JS files
gulp.task('scripts', function(){
  return gulp.src([
      // Adding jQuery
      // 'js/jquery.min.js',
	  
      // Adding others libs
	  // 'js/plugins/*.js'
	  // 'js/plugins/**/*.js
	  
      // Adding custom scripts
      'bundles/*.js',
      'bundles/*/*.js',
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('../'))
    .pipe(browsersync.reload({
      stream: true
    }));
});

// Task for watching file trees
gulp.task('watch', ['browsersync', 'stylus', 'scripts'], function(){
    // Watching .JS files
    watch(path.src.js, function(event, cb) {
        gulp.start('scripts');
    });
    // Watching .STYL files
    watch(path.src.styl, function(event, cb) {
        gulp.start('stylus');
    });
    // Watching HTML files
    watch(path.src.html, function(event, cb) {
      gulp.src(path.src.html)
        .pipe(browsersync.reload({stream:true}));
    });
});

// Task for building project
gulp.task('build', ['stylus', 'scripts'], function(){
  // Building .JS files
  gulp.start('scripts');
  // Building .STYL files
  gulp.start('stylus');
});

// Task for work whith browsersync
gulp.task('browsersync', function(){
  browsersync({
    // proxy: 'localhost/scene/templates/assets/php/'
    server: {
      baseDir: '../../../../'
    }
  });
});
