module.exports = function(grunt)
{
	/**
     *  Variables
     **/
    var path = {
        tmp:            'tmp',
        src:            'src',
        html:           'src/html',
        scss:           'src/scss',
        js:             'src/js',
        res:            'src/res',
        modules:        'node_modules',
		build:          'build'
    };


    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			debug: {
				options: {
					sourceMap: true
				},
                files: [{
                    src: path.js + '/*.js',
    				dest: path.build + '/newScrollbar/newScrollbar.js'
                }]
			}
        },

		sass: {
			options: {
				cacheLocation: path.tmp + '/sass'
			},
			debug: {
				files: [
                    {
    					src: path.scss + '/app.scss',
    					dest: path.build + '/app.css'
    				},
                    {
                        src: path.scss + '/newScrollbar.scss',
                        dest: path.build + '/newScrollbar/newScrollbar.css'
                    }
                ]
			}
		},

		uglify: {
			release: {
				files: [
                    {
                        src: path.js + '/*.js',
                        dest: path.build + '/newScrollbar/newScrollbar.js'
                    }
                ]
			}
		},

		usebanner: {
			js: {
				options: {
					position: 'top',
					banner: '/**\n' +
							' *	JavaScript\n' +
							' *	\n' +
							' *	@author		<%= pkg.author %>\n' +
							' *	@author		<%= pkg.author_mail %>\n' +
							' *	\n' +
							// ' *	@link      	<%= pkg.site %>\n' +
							' *	@date		<%= grunt.template.today("yyyy-mm-dd") %>\n' +
							' *	@version	<%= pkg.version %>\n' +
							' * \n' +
							'**/'
				},
				files: {
					src: path.build + '/js/app.js'
				}
			},
			css: {
				options: {
					position: 'top',
					banner: '/**\n' +
							' *	Stylesheet\n' +
							' *	\n' +
							' *	@author		<%= pkg.author %>\n' +
							' *	@author		<%= pkg.author_mail %>\n' +
							' *	\n' +
							// ' *	@link      	<%= pkg.site %>\n' +
							' *	@date		<%= grunt.template.today("yyyy-mm-dd") %>\n' +
							' *	@version	<%= pkg.version %>\n' +
							' * \n' +
							'**/'
				},
				files: {
					src: path.build + '/css/app.css'
				}
			}
		},

		copy: {
            debug: {
                files: [
                    {
                        src: '**/*',
    					dest: path.build,
                        cwd: path.res,
                        expand: true
                    }
                ]
            }
		},

        replace: {
            debug: {
                src: [
                    path.build + '/**/*.html',
                    path.build + '/**/*.js'
                ],
                overwrite: true,
				replacements: [
                    {
    					from: 	'{{ VERSION }}',
    					to: 	'<%= pkg.version %>'
    				}
                ]
            }
        },

		includereplace: {
			options: {
				prefix: '{% ',
				suffix: ' %}',
				includesDir: path.html
			},
            debug: {
                expand: true,
                src: [
                    '**/*.html',
                    '!widget/**/*.html',
                    '!layout/**/*.html'
                ],
                dest: path.build + '/',
                cwd: path.html
            }
        },

		watch: {
			options: {
				spawn: false,
				livereload: true,
				dateFormat: function(time)
                {
					grunt.log.subhead('>> Waiting for more changes...');
				}
			},
            html: {
                files: path.html + '/**/*.html',
                tasks: [
                    'includereplace:debug'
                ]
            },
			css: {
				files: path.scss + '/**/*.scss',
				tasks: [
					'sass:debug'
				]
			},
			js: {
				files: path.js + '/**/*.js',
				tasks: [
					'concat:debug'
				]
			},
			gruntcopy: {
				files: 'gruntcopy.json',
				tasks: [
					'copy:debug',
                    'replace:debug'
				]
			},
            res: {
                files: path.res + '/**/*',
                tasks: [
                    'sass:debug',
                    'copy:debug',
                    'replace:debug'
                ]
            }
		}
    });






	//////////////////////
	//////// TASK ////////
	//////////////////////

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', [
		'includereplace:debug',
		'sass:debug',
		'concat:debug',
        'copy:debug',
        'replace:debug',
        'usebanner',
        'watch'
	]);
};
