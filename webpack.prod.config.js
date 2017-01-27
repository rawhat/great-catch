var webpack = require('webpack');

process.env.NODE_ENV = 'production';

module.exports = {
    entry: [ 'babel-polyfill', __dirname + '/src/' + 'app.js' ],
    output: {
        filename: 'app.min.js',
        path: __dirname + '/static/js'
    },
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                        presets: [
                                'react',
                                'es2015',
                                //'modern-browsers/full-support',
                                'stage-1'
                        ]
                }
            }
        ]
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
          comments: false,
          sourceMap: false,
          mangle: true,
          minimize: true
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV'])
    ],
};
