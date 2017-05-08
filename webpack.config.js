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
                                ['es2015', { modules: false }],
                                //'modern-browsers/full-support',
                                'stage-1'
                        ]
                }
            }
        ]
    }
};
