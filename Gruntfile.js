module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			js: 'app/js',
			dest: 'build'
		},
		files: {
			app: "<%= dirs.js %>/app/*.js"
		},
		concat: {
			libs: {
				src: [
					'<%= dirs.js %>/lib/jquery/*.js',
					'<%= dirs.js %>/lib/angular/*.js',
					'<%= dirs.js %>/lib/angular-ui/*.js',
					'<%= dirs.js %>/lib/angular-ui-router/*.js',
					'<%= dirs.js %>/lib/angular-bootstrap/*.js'
				],
				dest: '<%= dirs.dest %>/libs.js'
			},
			app: {
				src: ['<%= files.app %>'],
				dest: '<%= dirs.dest %>/app.js'
			}
		},
		karma: {
			unit: {
				options: {
					frameworks: ['jasmine'],
					files: [
						'build/libs.js',
						'build/app.js',
						'test/lib/angular-mocks.js',
						'test/unit/*.spec.js'
					],
					browsers: ['Chrome'],
					reporters: ['progress'],
					singleRun: false,
					autoWatch: true
				}
			}
		},
		watch: {
			app: {
				files: ['<%= files.app %>'],
				tasks: ['concat:app']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');
	grunt.registerTask('default', ["concat"]);
	grunt.registerTask('unit', ["karma"]);
};