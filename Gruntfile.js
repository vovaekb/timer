module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			options: {
				name: 'timer',
				appDir: 'app/',
				baseUrl: './js',
				dir: 'build/',
				findNestedDependencies: true,
				mainConfigFile: 'app/js/app/main.js',
				skipModuleInsertion: true,
				removeCombined: true
			},
			build: {
				optimize: 'none'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default', ["requirejs:build"]);
};