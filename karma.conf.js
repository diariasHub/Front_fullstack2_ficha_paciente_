module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'tests/**/*.spec.js', watched: true },
    ],
    preprocessors: {
      'tests/**/*.spec.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { esmodules: true } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          'next/link': require('path').resolve(__dirname, 'tests/mocks/nextLinkMock.js'),
          'next/router': require('path').resolve(__dirname, 'tests/mocks/nextRouterMock.js'),
        },
      },
    },
    reporters: ['spec'],
    specReporter: { suppressErrorSummary: false, suppressFailed: false, showSpecTiming: true },
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
    ],
  });
};
