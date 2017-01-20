const path = require('path')
module.exports = {
  entry: './index.js',
  output: {
    filename: 'app.js',
    path: './dist',
    publicPath: '/dist/',
    libraryTarget: 'var',
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, loader: 'babel', include: [path.resolve(__dirname, '.'), path.resolve(__dirname, '../src')]}
    ]
  },
  debug: true,
  devtool: 'eval-source-map',
}
