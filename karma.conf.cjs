// Karma configuration
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'tests/**/*.spec.jsx', watched: false },
      { pattern: 'tests/**/*.spec.js', watched: false }
    ],
    preprocessors: {
      'tests/**/*.spec.jsx': ['esbuild'],
      'tests/**/*.spec.js': ['esbuild']
    },
    esbuild: {
      sourcemap: 'inline',
      jsx: 'automatic',
      loader: { '.js': 'jsx', '.jsx': 'jsx', '.css': 'text' },
      target: 'es2020',
      define: {
        'process.env.NODE_ENV': '"test"'
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-esbuild')
    ]
  })
}
