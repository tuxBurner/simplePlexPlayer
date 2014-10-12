grunt.initConfig({
    express: {
      default_option: {}
    }
  });

  grunt.loadNpmTasks('grunt-express');

  grunt.registerTask('default', ['express']);