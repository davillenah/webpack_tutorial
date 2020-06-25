/*********************************
* Environment and imports
*********************************/
const environment = process.env.NODE_ENV || "development";

const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

/*********************************
* Entry
*********************************/
const entry = {
  "main": ["./src/main.site.ts", "./src/main.site.scss"]
}

/*********************************
* Module
*********************************/
const _module = {
  rules: [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        "ts-loader"
      ]
    },
    {
      test: /\.pug$/,
      exclude: /node_modules/,
      use: [
        "raw-loader",
        "pug-html-loader"
      ]
    },
    {
      test: /\.component.scss$/,
      exclude: ["/node_modules/", "/0-bourbon/", "/1-neat/", "/2-base/"],
      use: [
        "raw-loader",
        "postcss-loader",
        "sass-loader"
      ]
    },
    {
      test: /\.site.scss$/,
      exclude: ["/node_modules/", "/0-bourbon/", "/1-neat/", "/2-base/"],
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      })
    }
  ]
}

/*********************************
* Optimization
*********************************/
const optimization = {
  splitChunks: {
    cacheGroups: {
      commons: { test: /[\\/]node_modules[\\/]/, name: "common", chunks: "all" }
    }
  }
};

/*********************************
* Output
*********************************/
const output = {
  filename: "[name].bundle.js",
  path: __dirname + "/wwwroot/js/",
  pathinfo: true
};

if (environment === "production") {
  output.filename = "[name].bundle.min.js";
  output.pathinfo = false;
} else if (environment === "development") {
  output.publicPath = "/js/";
}

/*********************************
* Plugins
*********************************/
const plugins = [
  new ExtractTextPlugin({
    filename: environment === "production" ? "../css/[name].bundle.min.css" : "../css/[name].bundle.css",
    disable: false,
    allChunks: false
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer()
      ]
    }
  }),
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }
  })
];

/*********************************
* Resolve
*********************************/
const resolve = {
  extensions: [".ts", ".js"]
}

/*********************************
* Exports
*********************************/
module.exports = {
  entry: entry,
  output: output,
  resolve: resolve,
  mode: environment,
  module: _module,
  optimization: optimization,
  plugins: plugins
}