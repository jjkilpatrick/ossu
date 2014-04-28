module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        requirejs: {
            production: {
                options: {
                    baseUrl: "webapp/library/js/lib",
                    name: "app",
                    paths: {
                        "app": "../app"
                    },
                    shim: {
                        "jquery.alpha": ["jquery"],
                        "jquery.beta": ["jquery"]
                    },
                    out: "webapp/library/js/app-build.js"
                }
            }
        },
        compass: {
            production: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        },
        watch: {
            sass: {
                files: ['sass/*.scss'],
                tasks: ['compass']
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compass');

    // Tasks
    grunt.registerTask('default', 'watch');

    // Distribution Task
    grunt.registerTask('dist', ['compass:production', 'requirejs:production']);

};