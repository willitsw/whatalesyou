const { merge } = require("webpack-merge");
const sharedConfig = require("./webpack.shared.js");
const webpack = require("webpack");

module.exports = merge(sharedConfig, {
  mode: "production",
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_ENV: "production",
    }),
  ],
});
