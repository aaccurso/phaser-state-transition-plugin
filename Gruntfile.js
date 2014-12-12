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
    }
  });

  // Register grunt tasks
  grunt.registerTask('default', 'uglify');
};
