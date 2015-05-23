module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    supervisor: {
      target: {
        script: "server.js"
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-supervisor");

  // Default task(s).
  grunt.registerTask('default', ['supervisor']);

};
