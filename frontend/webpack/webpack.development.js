const webpack = require("webpack");
const { merge } = require("webpack-merge");
const sharedConfig = require("./webpack.shared.js");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(sharedConfig, {
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
      NODE_ENV: "development",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
  ],
});
