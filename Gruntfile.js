'use strict';

module.exports = function (grunt) {
  var srcFiles = ['src/*.js', 'Gruntfile.js'],
      bumpFiles = ['package.json', 'bower.json'];

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    copy: {
      files: { src: 'src/phaser-state-transition-plugin.js', dest: 'dist/phaser-state-transition-plugin.js' }
    },
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
        src: srcFiles
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: srcFiles
    },
    bump: {
      options: {
        files: bumpFiles,
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: bumpFiles,
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },
  });

  // Register grunt tasks
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['jshint', 'jscs', 'uglify', 'copy']);
};
