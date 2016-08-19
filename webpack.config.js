var webpack = require('webpack');
var fs = require('fs');

var pkgRaw = fs.readFileSync('./package.json', 'utf8');
var pkg = JSON.parse(pkgRaw);

var license = fs.readFileSync('./LICENSE', 'utf8');

module.exports = {
  entry: './server/asset/entry.js',
  output: {
    path: './dist/server/asset',
    filename: pkg.name + '.js'
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: "style!css!less"
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: /@preserve|@cc_on|\bMIT\b|\bMPL\b|\bGPL\b|\bBSD\b|\bISCL\b|\(c\)|License|Copyright/mi
    }),
    new webpack.BannerPlugin(license)
  ]
};

