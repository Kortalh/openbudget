module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			options: { livereload: true },

			js: {
				files: ['app/webroot/js/dev/*.js'],
				tasks: ['jshint', 'concat:js', 'uglify']
			},
			html: {
				files: ['app/Controller/*.php', 'app/Model/*.php', 'app/View/**/*']
			},
			css: {
				files: ['app/webroot/css/dev/*.scss'],
				tasks: ['sass']
			}
		},

		// Javascript
		jshint: {
			all: ['app/webroot/js/dev/*.js']
		},

		concat: {
			js: {
				options: {
					separator: ';',
				},
				// Combine all source files
				src: 'app/webroot/js/dev/*.js',
				// Place them all in an unminified JS file
				dest: 'app/webroot/js/openbudget.min.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
			},
			build: {
				// Minimize the compiled js file
				src: 'app/webroot/js/openbudget.min.js',
				dest: 'app/webroot/js/openbudget.min.js'
			}
		},


		// CSS
		sass: {
			dist: {
				options: {
					// style: 'compressed'
				},
				files: {
					'app/webroot/css/openbudget.min.css': 'app/webroot/css/dev/main.scss'
				}
			}
		},

		cssmin: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %> */',
				report: 'gzip'
			},
			minify: {
				expand: true,
				cwd: '',
				src: 'app/webroot/css/openbudget.min.css',
				dest: ''
			}
		}

	});


	grunt.registerTask('default', ['watch']);

	grunt.registerTask('compile', [
		'jshint',
		'concat:js',
		'uglify',
		'sass'
	]);

};