const path = require('path')
module.exports = {
  entry: './src/morph-svg.js',
  output: {
    filename: 'morph.js',
    path: './dist',
    publicPath: '/public/',
    library: 'morph',
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, loader: 'babel', include: [path.resolve(__dirname, 'src')]}
    ]
  },
  debug: true,
  devtool: 'cheap-module-source-map',
}
