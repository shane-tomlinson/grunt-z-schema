/*
 * grunt-z-schema
 * https://github.com/petrbela/grunt-z-schema
 *
 * Copyright (c) 2014 Petr Bela
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var ZSchema = require('z-schema'),
      async = require('async'),
      _ = grunt.util._;

  grunt.registerMultiTask('zschema', 'Grunt plugin for z-schema, a JSON Schema validator.', function() {
    var complete = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    var validator = new ZSchema(options.validation);
    var schema = grunt.file.readJSON(options.schema);

    var handleResults = function(file, cb, report) {
      report.errors.forEach(function(error) {
        grunt.log.error(file + " Error: " + error.message + " at " + error.path);
      });
      report.warnings.forEach(function(warning) {
        grunt.log.warn(file + " Warning: " + warning.message + " at " + warning.path);
      });
      cb(report.valid ? null : report);
    }

    var validateSchema = function(done) {
      var handler = _.bind(handleResults, this, options.schema, done);

      validator.validateSchema(schema).then(handler).catch(handler);
    };

    var validateFiles = function(done) {
      // Iterate over all specified file groups.
      // console.log(this)
      async.mapSeries(this.filesSrc, function(filepath, cb) {
        if (!grunt.file.exists(filepath)) {
          // Warn and skip invalid source files.
          grunt.log.warn('Source file "' + filepath + '" not found.');
          cb();
        } else {
          var file = grunt.file.readJSON(filepath),
              handler = _.bind(handleResults, this, filepath, cb);
          validator.validate(file, schema).then(handler).catch(handler);
        }
      }, done);
    };

    async.series([
      _.bind(validateSchema, this),
      _.bind(validateFiles, this)
    ], function(err) {
      // false in grunt means the task failed
      complete(err ? false : undefined);
    });
  });

};
