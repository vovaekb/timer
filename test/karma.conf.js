module.exports = function (config) {
	config.set({
		frameworks: ["jasmine", "requirejs"],
		files: [
			{
				pattern: "app/js/lib/**/*.js",
				included: false
			},
			{
				pattern: "app/js/app/*.js",
				included: false
			},
			{
				pattern: "test/unit/*.tests.js",
				included: false
			},
			"test/test-main.js",
			{
				pattern: "test/angular-mocks.js",
				included: false
			}
		],
		exclude: [
			"app/js/app/main.js"
		],
		basePath: '../',
		reporters: ['progress'],
		port: 9876,
		runnerPort: 9100,
		colors: true,
		autoWatch: true,
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
		singleRun: false
	});
};