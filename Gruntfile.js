'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/phaser-state-transition-plugin.min.js': ['src/phaser-state-transition-plugin.js']
        }
      }
    },
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: require('jscs-stylish').path
      },
      all: {
        src: ['src/*.js', 'Gruntfile.js']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: ['src/*.js', 'Gruntfile.js']
    }
  });

  // Register grunt tasks
  grunt.registerTask('default', ['jshint', 'jscs', 'uglify']);
};
