const { merge } = require("webpack-merge");
const sharedConfig = require("./webpack.shared.js");

module.exports = merge(sharedConfig, {
  mode: "production",
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_ENV: "production",
    }),
  ],
});
