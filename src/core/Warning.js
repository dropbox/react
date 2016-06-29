/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * NOTE: this has been forked to add support for callbacks from warning.
 * @providesModule warning
 */

"use strict";

var emptyFunction = require('emptyFunction');
var warningHandlers = require('WarningHandlers');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (__DEBUG__) {
  warning = function(condition, format, ...args) {
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (!condition) {
      var argIndex = 0;
      var msg = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
      console.warn(msg);
      warningHandlers.forEach(function(hanlder) {
        handler(msg);
      });
    }
  };
}

module.exports = warning;
