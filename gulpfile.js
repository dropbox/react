/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var del = require('del');

var extractErrors = require('./scripts/error-codes/gulp-extract-errors');

var paths = {
  react: {
    src: [
      'src/**/*.js',
      '!src/**/__tests__/**/*.js',
      '!test/all.js',
    ],
    lib: 'build/modules',
  },
};

var errorCodeOpts = {
  errorMapFilePath: 'scripts/error-codes/codes.json',
};

gulp.task('react:extract-errors', function() {
  return gulp
    .src(paths.react.src)
    .pipe(extractErrors(errorCodeOpts));
});

gulp.task('default', ['react:extract-errors']);
