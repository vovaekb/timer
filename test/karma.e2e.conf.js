module.exports = function (config) {
	config.set({
		frameworks: ["ng-scenario", "requirejs"],
		files: [
			// {
			// 	pattern: "app/js/lib/**/*.js",
			// 	included: false
			// },
			// {
			// 	pattern: "app/js/app/*.js",
			// 	included: false
			// },
			{
				pattern: "test/e2e/*.tests.js",
				included: false
			},
			"test/test-main.js",
			{
				pattern: "test/angular-*.js"
			}
		],
		exclude: [
			// "app/js/app/main.js"
		],
		proxies: {
			"/": "http://localhost:8001/"
		},
		basePath: '../',
		reporters: ['progress'],
		port: 9876,
		runnerPort: 9100,
		colors: true,
		autoWatch: true,
		browsers: ['Chrome'],
		captureTimeout: 60000,
		singleRun: false,
		logLevel: config.LOG_DEBUG
	});
};