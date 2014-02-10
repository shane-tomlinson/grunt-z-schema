/*
 * grunt-z-schema
 * https://github.com/petrbela/grunt-z-schema
 *
 * Copyright (c) 2014 Petr Bela
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var ZSchema = require('z-schema'),
      async = require('async'),
      _ = require('lodash');

  grunt.registerMultiTask('zschema', 'Validate JSON/schema files with z-schema.', function() {
    var complete = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    var validator = new ZSchema(options);

    var handleResults = function(file, cb, report) {
      report.errors.forEach(function(error) {
        grunt.log.error(file + " Error: " + error.message + " at " + error.path);
      });
      report.warnings.forEach(function(warning) {
        grunt.log.warn(file + " Warning: " + warning.message + " at " + warning.path);
      });
      cb(report.valid ? null : report);
    }

    var validateSchema = function(schema, done) {
      var handler = _.bind(handleResults, this, schema, done);

      validator.validateSchema(schema).then(handler).catch(handler);
    };

    var validateFiles = function(schema, files, done) {
      async.mapSeries(files, function(filepath, cb) {
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

    async.mapSeries(this.files, function(filegroup, cb) {
      // each filegroup is an object with dest (string) and src (array)
      var schema = grunt.file.readJSON(filegroup.dest);
      async.series([
        _.bind(validateSchema, this, schema),
        _.bind(validateFiles, this, schema, filegroup.src)
      ], function(err) {
        cb(err);
      });
    }, function(err) {
      // false in grunt means the task failed
      complete(err ? false : undefined);
    });
  });

};
