const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {}

  if (isProd) {
    config.minimizer = [
      new OptimizeCSSAssetsPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: optimization(),
  devServer: {
    port: 2000
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'src/assets/favicon.ico'),
        to: path.resolve(__dirname, 'dist/assets/favicon.ico')
      }]
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.html&/,
        use: ['html-loader?interpolate']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          'css-loader?url=false',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|svg|webp)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: 'assets',
            outputPath: 'assets',
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.(ttf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: 'assets/fonts',
            outputPath: 'assets/fonts',
            name: '[name].[ext]'
          }
        }]
      }
    ]
  }
}