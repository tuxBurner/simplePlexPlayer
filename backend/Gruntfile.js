module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    supervisor: {
      target: {
        script: "server.js"
      }
    },
    bower: {
      install: {
        options: {
          "targetDir": "./views/public"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks("grunt-supervisor");

  // Default task(s).
  grunt.registerTask('default', ['bower', 'supervisor']);

};
