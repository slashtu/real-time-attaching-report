// webpack.config.js
module.exports = {
    entry: './public/js/app.jsx',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader'
            }, // ES6
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee', '.jsx']
    },
    externals: {
            fs: '{}',
            tls: '{}',
            net: '{}',
            console: '{}'
    }
};