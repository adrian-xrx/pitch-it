var webpackConfig = require('./webpack.config');

module.exports = {
  entry: webpackConfig.entry,
  output: {
    path: webpackConfig.output.path,
    publicPath: '/',
    filename: webpackConfig.output.filename
  },
  module: webpackConfig.module,
  devtool: "sourcemap",
  debug: true,
  devServer: {
    keepAlive: true,
    contentBase: './build/server/asset/',
    proxy: {
      '*': 'http://localhost'
    }
  }
}