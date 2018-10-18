const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'control.trackplayback': './src/control.trackplayback/index.js',
        'leaflet.trackplayback': './src/leaflet.trackplayback/index.js'
    },
    externals: {
        leaflet: {
            root: 'L',
            commonjs: 'leaflet',
            commonjs2: 'leaflet',
            amd: 'leaflet'
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget : 'umd'
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/control.trackplayback'),
            to: path.resolve(__dirname, 'dist'),
            ignore: ['*.js']
        }])
    ]
}