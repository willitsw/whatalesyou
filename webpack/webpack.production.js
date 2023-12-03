const { merge } = require("webpack-merge");
const sharedConfig = require("./webpack.shared.js");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(sharedConfig, {
  entry: {
    frontend: "./frontend/src/index.tsx",
  },
  output: {
    path: path.resolve("./frontend/static/frontend/"),
    filename: "[name]-[hash].js",
    publicPath: "static/frontend/",
  },
  mode: "production",
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_ENV: "production",
    }),
  ],
});
