/*
 * grunt-z-schema
 * https://github.com/petrbela/grunt-z-schema
 *
 * Copyright (c) 2014 Petr Bela
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Configuration to be tested.
    zschema: {
      options: {
        schema: 'test/fixtures/schema.json'
      },
      pass: {
        src: ['test/fixtures/pass.json']
      },
      fail_file: {
        src: ['test/fixtures/fail.json']
      },
      fail_schema: {
        options: {
          schema: 'test/fixtures/schema-invalid.json',
          validation: {
            noExtraKeywords: true
          }
        },
        src: ['test/fixtures/pass.json']
      }
    }
  });

  grunt.loadNpmTasks('grunt-continue');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  var passNames = [];
  var failNames = [];
  var conf = grunt.config.get('zschema');

  Object.keys(conf).sort().forEach(function(name) {
    if (/^pass_/.test(name)) {
      passNames.push('zschema:' + name);
    } else if (/^fail_/.test(name)) {
      failNames.push('zschema:' + name);
    } else if (name !== 'options') {
      passNames.push('zschema:' + name);
    }
  });

  grunt.registerTask('pass', passNames);
  grunt.registerTask('fail', failNames);

  grunt.registerTask('test', ['pass', 'continueOn', 'fail', 'continueOff']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
