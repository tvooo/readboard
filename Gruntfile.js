module.exports = function ( grunt ) {

    grunt.initConfig ({
        compass: {
            rapid: {
                options: {
                    sassDir: 'styles',
                    cssDir: 'assets/styles',
                    outputStyle: 'expanded',
                    relativeAssets: true
                }
            }
        },

        watch: {
            css : {
                files: ['styles/**/*.scss'],
                tasks: ['css']
            },
            html: {
                files: ['*.html'],
                tasks: []
            },
            //js: {
            //    files: ['js/src/**/*.js'],
            //    tasks: ['js']
            //},
            options: {
                livereload: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.',
                    keepalive: false,
                    open: true
                }
            }
        },
        /*cssmin: {
            minify: {
                files: {
                    'www/styles/style.css': ['www/styles/style.css']
                },
                options: {
                    report: 'gzip'
                }
            }
        },*/
        copy: {
            fonts: {
                src: ['fonts/*'],
                expand: true,
                dest: 'www/fonts/',
                flatten: true
            }
        }
    });

    grunt.registerTask('css', ['compass:rapid'] );
    grunt.registerTask('js', ['concat:js']);
    grunt.registerTask('default', ['connect', 'watch']);
    //grunt.registerTask('build', ['clean', 'js', 'css', 'bear', 'cssmin', 'copy']);

    //grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
