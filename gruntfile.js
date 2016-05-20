module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-mocha-test');
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
        // Configure a mochaTest task
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['build/**/*.spec.js']
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
                files: ['sources/**/*.ts'],
                tasks: ['ts', 'shell']
            },

        },
         shell: {
            lib: {
                command: function () {
                    return 'node generateLib';
                }
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


    grunt.registerTask('default', [ 'ts', 'shell', 'watch']);
    grunt.registerTask('production', ['bower', 'tslint', 'copy', 'concat', 'uglify', 'cssmin', 'cache_control', 'ts']);
};