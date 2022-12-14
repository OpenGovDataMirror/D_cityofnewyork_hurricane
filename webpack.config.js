module.exports = require('nyc-build-helper').config.defaultWebpackConfig(
  __dirname,
  {
    copyOptions: [
      {from: 'src/css/311.css', to: 'css'},
      {from: 'src/311/index.html', to: '311/index.html'},
      {from: 'src/mta.html', to: 'mta.html'}
    ]
  }
)