const webpack = require("webpack");
const { merge } = require("webpack-merge");
const sharedConfig = require("./webpack.shared.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = merge(sharedConfig, {
  entry: "./frontend/src/index.tsx",
  output: {
    path: path.resolve("./frontend/static/frontend/"),
    filename: "[name]-[hash].js",
    publicPath: "auto",
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
  },
  devtool: "source-map",
  mode: "development",
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_ENV: "development",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../frontend/templates", "indexdev.html"),
      favicon: path.join(__dirname, "../frontend/templates", "favicon.ico"),
    }),
  ],
});
