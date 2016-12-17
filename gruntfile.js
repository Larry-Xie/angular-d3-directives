// Copyright © Citrix Systems, Inc.  All rights reserved.

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    'use strict';
    
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: 'app',
            sandbox: 'app/sandbox',
            dist: 'dist'
        },

        // JSHint
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: [
                '<%= yeoman.app %>/scripts/**/*.js'
            ],
            sandbox: [
                '<%= yeoman.sandbox %>/scripts/**/*.js'
            ]
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: '<%= yeoman.app %>/scripts/**/*.js',
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            css: {
                files: ['<%= yeoman.app %>/styles/**/*.less', '<%= yeoman.sandbox %>/styles/*.less'],
                tasks: ['less:development'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            html: {
                files: ['<%= yeoman.app %>/views/**/*.html'],
                tasks: ['html2js'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            gruntfile: {
                files: ['gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/sandbox/images/*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9005,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 98745
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= yeoman.app %>'
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.dist %>'
                    ]
                }]
            },
            bower: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.app %>/bower_components'
                    ]
                }]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        html2js: {
            options: {
                base: '.',
                rename: function (modulePath) {
                    var moduleName = modulePath.replace('app/', '');
                    return moduleName;
                }
            },
            main: {
                options: {
                    module: 'cwc.d3.templates'
                },
                src: ['<%= yeoman.app %>/views/**/*.html'],
                dest: '<%= yeoman.dist %>/scripts/citrix-charts-templates.js'
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [{
                    '<%= yeoman.dist %>/scripts/citrix-charts.js': [
                        '<%= yeoman.app %>/scripts/app.js',
                        '<%= yeoman.app %>/scripts/modules/**/*.js',
                        '<%= yeoman.app %>/scripts/directives/**/*.js',
                        '<%= yeoman.app %>/scripts/services/**/*.js',
                        '<%= yeoman.dist %>/scripts/citrix-charts-templates.js'
                    ]
                }]
            }
        },

        uglify: {
            options: {
                compress: {
                    warnings: false
                },
                mangle: true
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/citrix-charts.min.js': '<%= yeoman.dist %>/scripts/citrix-charts.js'
                }
            }
        },

        less: {
            development: {
                files: [{
                    expand: true,
                    src: ['<%= yeoman.app %>/styles/**/*.less'],
                    ext: '.css'
                }, {
                    // Sandbox styles
                    '<%= yeoman.sandbox %>/styles/sandbox.css': '<%= yeoman.sandbox %>/styles/*.less'
                }]
            },
            dist: {
                files: [{
                    // All directives stylesheet
                    '<%= yeoman.dist %>/styles/citrix-charts.css': [
                        '<%= yeoman.app %>/styles/**/*.less'
                    ]
                }, {
                    // Individual directive stylesheets
                    expand: true,
                    flatten: true,
                    cwd: '<%= yeoman.app %>/styles',
                    src: ['**/*.less', '!theme-default.less'],
                    dest: '<%= yeoman.dist %>/styles/assets',
                    ext: '.css'
                }, {
                    // All directives stylesheet
                    '<%= yeoman.dist %>/sandbox/styles.css': [
                        '<%= yeoman.app %>/bower_components/bootstrap/dist/css/bootstrap.min.css',
                        "<%= yeoman.app %>/bower_components/fullpage.js/jquery.fullPage.css",
                        '<%= yeoman.app %>/sandbox/styles/sandbox.css'
                    ]
                }]
            }
        },

        cssmin: {
            dist: {
                files: [{
                    // All directives stylesheet
                    '<%= yeoman.dist %>/styles/citrix-charts.min.css': [
                        '<%= yeoman.dist %>/styles/citrix-charts.css'
                    ]
                }, {
                    // Individual directive stylesheets
                    expand: true,
                    cwd: '<%= yeoman.dist %>/styles/assets',
                    src: ['*.css'],
                    dest: '<%= yeoman.dist %>/styles/assets',
                    ext: '.min.css'
                }]
            }
        },

        htmlmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        concat: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/sandbox/bower_components.js': [
                        '<%= yeoman.app %>/bower_components/angular/angular.min.js',
                        '<%= yeoman.app %>/bower_components/jquery/dist/jquery.min.js',
                        '<%= yeoman.app %>/bower_components/bootstrap/dist/js/bootstrap.min.js',
                        '<%= yeoman.app %>/bower_components/fullpage.js/jquery.fullPage.min.js',
                        '<%= yeoman.app %>/bower_components/angular-animate/angular-animate.min.js',
                        '<%= yeoman.app %>/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        '<%= yeoman.app %>/bower_components/angular-route/angular-route.min.js',
                        '<%= yeoman.app %>/bower_components/angular-sanitize/angular-sanitize.min.js',
                        '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.min.js'
                    ],
                    '<%= yeoman.dist %>/sandbox/scripts.js': [
                        '<%= yeoman.app %>/sandbox/scripts/sandbox-app.js',
                        '<%= yeoman.app %>/sandbox/scripts/controllers/example.js',
                        '<%= yeoman.app %>/sandbox/scripts/controllers/home.js',
                        '<%= yeoman.app %>/sandbox/scripts/controllers/navigation.js'
                    ]
                }
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            js: ['<%= yeoman.dist %>/scripts/**/*.js'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>'],
                blockReplacements: {
                    siteCSS: function (block) {
                        return '<link rel="stylesheet" href="' + block.dest + '" />';
                    },
                    siteJS: function (block) {
                        return '<script src="' + block.dest + '"></script>';
                    }
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            sandbox: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/sandbox/views',
                    dest: '<%= yeoman.dist %>/sandbox/views',
                    src: '{,*/}*.*'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/sandbox/images',
                    dest: '<%= yeoman.dist %>/sandbox/images',
                    src: '{,*/}*.*'
                }]
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    //Load third party tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'less:development',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        //'jshint',
        'clean:dist',
        'useminPrepare',
        'html2js',
        'ngAnnotate',
        'uglify',
        'less:dist',
        'cssmin',
        'htmlmin',
        'concat:dist',
        'usemin',
        'copy:sandbox'
    ]);

    grunt.registerTask('test', [
        'html2js',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
