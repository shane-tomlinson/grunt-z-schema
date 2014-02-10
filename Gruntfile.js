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
    pkg: grunt.file.readJSON('package.json'),

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

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'CHANGELOG.md'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },

    // Configuration to be tested.
    zschema: {
      pass: {
        files: {
          'test/fixtures/schema.json': ['test/fixtures/pass.json']
        }
      },
      fail_file: {
        files: {
          'test/fixtures/schema.json': ['test/fixtures/fail.json']
        }
      },
      fail_schema: {
        options: {
          noExtraKeywords: true
        },
        files: {
          'test/fixtures/schema-invalid.json': []
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-continue');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');

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
