// An example configuration file.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  // seleniumServerJar: './selenium/selenium-server-standalone-2.35.0.jar',
  // chromeDriver: './selenium/chromedriver',

  capabilities: {
    'browserName': 'chrome'
  },
  seleniumArgs: [],

  baseUrl: 'http://klaster1.github.io/timer/',
  specs: ['../e2e/*.spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    includeStackTrace: false
  }
};
