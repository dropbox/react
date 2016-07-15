/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

// NOTE: if you mess with this file, you probably will need to `grunt clean`
// for your changes to takes effect.

var recast = require('recast');
var types = recast.types;
var builders = types.builders;

var babylon = require("babylon");
var evalToString = require("../scripts/error-codes/evalToString");
var existingErrorMap = require("../scripts/error-codes/codes.json");
var invertObject = require("../scripts/error-codes/invertObject");

var errorMap = invertObject(existingErrorMap);

function propagate(constants, source) {
  return recast.print(transform(recast.parse(source), constants)).code;
}

var DEV_EXPRESSION = builders.binaryExpression(
  '===',
  builders.literal('development'),
  builders.memberExpression(
    builders.memberExpression(
      builders.identifier('process'),
      builders.identifier('env'),
      false
    ),
    builders.identifier('NODE_ENV'),
    false
  )
);

var DEBUG_EXPRESSION = builders.binaryExpression(
  '!==',
  builders.literal('production'),
  builders.memberExpression(
    builders.memberExpression(
      builders.identifier('process'),
      builders.identifier('env'),
      false
    ),
    builders.identifier('NODE_ENV'),
    false
  )
);

var visitors = {
  visitIdentifier: function(nodePath) {
    // If the identifier is the property of a member expression
    // (e.g. object.property), then it definitely is not a constant
    // expression that we want to replace.
    if (nodePath.parentPath.value.type === 'MemberExpression') {
      return false;
    }

    // replace __DEV__ with process.env.NODE_ENV === 'development'
    if (nodePath.value.name === '__DEV__') {
      nodePath.replace(DEV_EXPRESSION);
    }

    // replace __DEBUG__ with process.env.NODE_ENV !== 'production'
    // __DEBUG__ is used in both the development build and the debug
    // build, which is basically a dev build with the more expensive
    // checks turned off.
    if (nodePath.value.name === '__DEBUG__') {
      nodePath.replace(DEBUG_EXPRESSION);
    }

    // TODO: bring back constant replacement if we decide we need it

    this.traverse(nodePath);
  },

  visitCallExpression: function(nodePath) {
    var node = nodePath.value;
    if (node.callee.name === 'invariant') {
      // strip the error message out of invariant calls for debug/prod,
      // and replace with error codes.
      // (dead code removal will remove the extra bytes).
      var errorCode = recast.print(node.arguments[1]);
      var babelAst = babylon.parse(errorCode.code);
      var stringError;
      if (babelAst.program.body.length > 0) {
        stringError = evalToString(babelAst.program.body[0].expression);
      } else {
        stringError = babelAst.program.directives[0].value.value;
      }
      var prodErrorId = parseInt(errorMap[stringError.replace(/\\/g, "")]);
      var args = [node.arguments[0], builders.literal(prodErrorId)];
      args = args.concat(node.arguments.slice(2));

      nodePath.replace(
        builders.conditionalExpression(
          DEV_EXPRESSION,
          node,
          builders.callExpression(
            node.callee,
            args
          )
        )
      );
      return false;
    } else if (node.callee.name === 'warning') {
      // Eliminate warning(condition, ...) statements based on NODE_ENV
      // (dead code removal will remove the extra bytes).
      nodePath.replace(
        builders.conditionalExpression(
          DEBUG_EXPRESSION,
          node,
          builders.literal(null)
        )
      );
      return false;
    }
    this.traverse(nodePath);
  }
};

function transform(ast, constants) {
  // TODO constants
  return recast.visit(ast, visitors);
}

exports.propagate = propagate;
exports.transform = transform;
