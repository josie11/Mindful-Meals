// Karma configuration
// Generated on Mon Nov 06 2017 11:11:29 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', '@angular/cli'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-mocha-reporter'),
      require('@angular/cli/plugins/karma')
    ],


    // list of files / patterns to load in the browser
    files: [
        { pattern: './src/test.ts', watched: false },
        // this file only gets watched and is otherwise ignored
        { pattern: './src/assets/sql/sql.js', included: true },
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './src/test.ts': ['@angular/cli']
    },


    mime: {
        'text/x-typescript': ['ts','tsx']
    },


    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },


    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['mocha', 'karma-remap-istanbul']
              : ['mocha'],


    // web server port
    port: 8100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
