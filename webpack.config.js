const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'client', 'src'),
  entry: {
    app: './index.ts',
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      images: path.resolve(__dirname, 'client', 'assets', 'images'),
      styles: path.resolve(__dirname, 'client', 'assets', 'styles'),
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'THREE Sandbox',
      chunks: ['app']
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};