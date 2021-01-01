const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    target: 'node',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: path.resolve(__dirname, 'lib', 'index'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        library: 'template',
        libraryTarget: 'umd',
    },
    module: {},
    resolve: {
        alias: {
            'html-minifier': 'node-noop',
        },
    },
    devtool: 'source-map',
    plugins: [new ESLintPlugin(), new webpack.optimize.ModuleConcatenationPlugin()],
    node: {
        global: true,
    },
};
