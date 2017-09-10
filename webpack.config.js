const outputFile = 'jPopup';

var webpack = require('webpack'),
    extractTextPlugin = require('extract-text-webpack-plugin'),
    optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var minifyJs = new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
        screw_ie8: true,
        keep_fnames: true
    },
    compress: {
        warnings: false,
        screw_ie8: true
    },
    comments: false
});

var promisePolyFill = new webpack.ProvidePlugin({
    'Promise': 'es6-promise'
});

var extractSass = new extractTextPlugin({ 
    filename: 'dist/css/' + outputFile + '.css',
    allChunks: true
});

var minifyCss = new optimizeCssAssetsPlugin({
    cssProcessorOptions: { 
        discardComments: { 
            removeAll: true 
        },
        zindex: false
    }
});

module.exports = {

    watch: true,
    cache: true,

    entry: ['./src/js/jPopup.js', './src/sass/jPopup.scss', './src/index.html'],

    output: {
        filename: 'dist/js/' + outputFile + '.min.js',
        publicPath: 'dist/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: { 
                            presets: [['env', {
                                'targets': {
                                    'browsers': ['last 5 versions', 'Explorer >= 9']
                                }
                            }]] 
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ],
            },
            { 
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader'
                })
            },
            { 
                test: /\.scss$/,
                use: extractTextPlugin.extract(['css-loader', 'csslint-loader', 'sass-loader', 'postcss-loader'])
            },
            {
                test: /\.html$/,
                use: [ 'file-loader?name=dist/index.html' ]
            }
        ],
    },

    plugins: [
        extractSass,
        minifyCss,
        minifyJs,
    ]

}