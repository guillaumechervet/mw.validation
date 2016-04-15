module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
 grunt.loadNpmTasks('grunt-shell');

    grunt.initConfig({
        ts: {
            default : {
                src: ["sources/**/*.ts"],
                // specifying tsconfig as a boolean will use the 'tsconfig.json' in same folder as Gruntfile.js 
                tsconfig: true
            }
        },
        tslint: {
            options: {
                // can be a configuration object or a filepath to tslint.json
                configuration: "tslint.json"
            },
            files: {
                src: ["sources/**/*.ts", "!node_modules/**/*.ts"]
            }
        },
        concat: {
            vendorjs: {
                src: [
                    "sources/**/*.js"
                ],
                dest: "build/mw.validation.js"
            }
        },
        uglify: {
            my_min_files: {
                files: {
                    'build/mw.validation.min.js': [
                        "sources/**/*.js"
                    ]
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: "sources/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        watch: {
            appFolderScripts: {
                files: ['wwwroot/app/**/*.ts'],
                tasks: ['ts', 'tslint']
            },
             appFolderHtml: {
                files: ['wwwroot/app/**/*.html'],
                tasks: ['ngtemplates']
            }
        },
     copy: {
            main: {
               files: [
                    // includes files within path
                   // { expand: true, flatten: true, src: ['wwwroot/lib/*/*.eot'], dest: 'wwwroot/fonts' },
                    //{ expand: true, flatten: true, src: ['wwwroot/lib/*/*.svg'], dest: 'wwwroot/fonts' },
                    //{ expand: true, flatten: true, src: ['wwwroot/lib/*/*.ttf'], dest: 'wwwroot/fonts' },
                    //{ expand: true, flatten: true, src: ['wwwroot/lib/*/*.woff'], dest: 'wwwroot/fonts' },
                    //{ expand: true, flatten: true, src: ['wwwroot/lib/*/*.woff2'], dest: 'wwwroot/fonts' },
                    //{ expand: true, flatten: true, src: ['wwwroot/lib/*/*.otf'], dest: 'wwwroot/fonts' },
                     //{ expand: true, flatten: true, src: ['bower_components/js-xlsx/*.js'], dest: 'wwwroot/lib/js-xlsx' }
                ]
            }
        },
     
    });


    grunt.registerTask('default', ['copy', 'concat', 'uglify', 'cssmin', 'cache_control', 'ts', 'watch']);
    grunt.registerTask('production', ['bower', 'tslint', 'copy', 'concat', 'uglify', 'cssmin', 'cache_control', 'ts']);
};