const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'dist', 'anyioc.js'),
  output: {
    filename: 'anyioc.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'anyioc'
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'app')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css']
  },
  devtool: 'source-map',
  devServer: {
    publicPath: path.join('/dist/')
  }
};