const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    // Entry file
    entry: path.resolve(__dirname, 'src', 'client', 'index.js'),

    // Output
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
    },
    // Dev server for development
    devServer: {
        compress: true,
        historyApiFallback: true,
 	host: '0.0.0.0',
        port: 3000,
	disableHostCheck: true,
    },

    devtool: 'eval-source-map',
    module: {
        rules: [
            // Compile .js and .jsx
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            // Compile .html template
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            // Compile css with postcss
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    "postcss-loader",
                ],
            },
            // Compile images to /build/images
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                    name: '[name]-[contenthash].[ext]',
                },
            },


        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'src', 'client', 'index.html'),
            filename: path.resolve(__dirname, 'build', 'index.html'),
        })
    ]
};
