var gulp = require('gulp');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

gulp.task('default', [ 'templates' ], function() {

});

gulp.task('templates', function() {

    'use strict';

    gulp.src('public/templates/*.hbs')
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'killernotes.templates',
            noRedeclare: true // avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('public/templates'));
});