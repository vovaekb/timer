module.exports = function (config) {
	config.set({
		basePath: "../",
		urlRoot: "_karma_",
		frameworks: ["ng-scenario"],
		files: ["e2e/*.spec.js"],
		proxies: {
			"/": "http://localhost:8001/"
		},
		reporters: ["progress"],
		port: 9876,
		browsers: ["Chrome"],
		captureTimeout: 60000,
		singleRun: true,
		logLevel: config.LOG_DEBUG/*,
		autoWatch: true*/
	});
};