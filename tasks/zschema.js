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
      forOwn = require('lodash.forown');

  grunt.registerMultiTask('zschema', 'Validate JSON/schema files with z-schema.', function() {
    var complete = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    var data = this.data;
    data.validators = data.validators || {};
    data.remoteRefs = data.remoteRefs || {};

    var validator = new ZSchema(options);

    // Register remote references
    forOwn(data.remoteRefs, function(schema, uri) {
      validator.setRemoteReference(uri, schema);
    });

    // Register custom format validators
    forOwn(data.validators, function(callback, format) {
      ZSchema.registerFormat(format, callback);
    });


    var handleResults = function(file, cb, report) {
      if (report === true) {
        cb(null);
        return;
      }

      validator.getLastErrors().forEach(function(error) {
        grunt.log.error(file + " Error: " + error.message + " at " + error.path);
      });

      cb(report);
    };

    var validateSchema = function(schema, done) {
      var handler = handleResults.bind(this, schema, done);

      Promise.resolve(validator.validateSchema(schema)).then(handler, handler);
    };

    var validateFiles = function(schema, files, done) {
      async.mapSeries(files, function(filepath, cb) {
        if (!grunt.file.exists(filepath)) {
          // Warn and skip invalid source files.
          grunt.log.warn('Source file "' + filepath + '" not found.');
          cb();
        } else {
          var file = grunt.file.readJSON(filepath),
              handler = handleResults.bind(this, filepath, cb);

          Promise.resolve(validator.validate(file, schema)).then(handler, handler);
        }
      }, done);
    };

    async.mapSeries(this.files, function(filegroup, cb) {
      // each filegroup is an object with dest (string) and src (array)
      var schema = grunt.file.readJSON(filegroup.dest);
      async.series([
        validateSchema.bind(this, schema),
        validateFiles.bind(this, schema, filegroup.src)
      ], function(err) {
        cb(err);
      });
    }, function(err) {
      // false in grunt means the task failed
      complete(err ? false : undefined);
    });
  });

};
