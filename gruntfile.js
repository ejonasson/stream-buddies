module.exports = function (grunt) {
  grunt.initConfig({
  uglify: {
    options: {
      mangle: false
    },
    my_target: {
      files: {
        'js/main.min.js': ['js/apicall.js']
      }
    }
  },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          'css/main.css': ['less/main.less']
        }
      }
    },

    watch: {
      scripts: {
        files :['js/*.js'],
        tasks: ['uglify']
      },
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });
   grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};