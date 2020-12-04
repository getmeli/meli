const path = require('path');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

const buildInfo = {
  version: require('./package.json').version,
  buildDate: new Date().toISOString(),
  commitHash: require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim(),
};

const definedVariables = {
  BUILD_INFO: JSON.stringify(buildInfo),
  SENTRY_RELEASE: JSON.stringify(process.env.SENTRY_RELEASE),
  SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
};

console.log('definedVariables', definedVariables);

// https://webpack.js.org/guides/typescript/
module.exports = {
  target: 'node',
  node: {
    __dirname: false,
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  mode: 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['to-string-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  // https://webpack.js.org/guides/typescript/#source-maps
  devtool: 'source-map',
  optimization: {
    minimize: true,
    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
    minimizer: [
      // https://stackoverflow.com/questions/47439067/uglifyjs-throws-unexpected-token-keyword-const-with-node-modules
      new TerserPlugin({
        sourceMap: true,
        // https://webpack.js.org/plugins/terser-webpack-plugin/#extractcomments
        extractComments: false,
        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        terserOptions: {
          ecma: 6,
          // warnings: false,
          mangle: {
            toplevel: true,
            // https://github.com/terser/terser#mangle-properties-options
            // properties: true
          },
        },
      }),
    ],
  },
  stats: {
    // https://github.com/yargs/yargs/blob/master/docs/webpack.md#webpack-configuration
    warningsFilter: [
      /node_modules\/yargs/,
      /.*plugin-loader.ts*/,
    ],
  },
  plugins: [
    new webpack.DefinePlugin(definedVariables),
    ...(process.env.MELI_ANALYZE_BUNDLE ? [new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    })] : []),
    ...(!process.env.MELI_ANALYZE_BUNDLE ? [new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    })] : []),
    new CopyPlugin({
      patterns: [
        {
          from: './src/emails/templates',
          to: 'email/templates',
        },
        {
          from: './src/public',
          to: 'public',
        },
      ],
    }),
  ],
};
