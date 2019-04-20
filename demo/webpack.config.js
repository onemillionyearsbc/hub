const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
        ]


    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'register.html',
            template: './src/register.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'jobseeker-dashboard.html',
            template: './src/jobseeker-dashboard.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'jobseeker-account.html',
            template: './src/jobseeker-account.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'recruiter-dashboard.html',
            template: './src/recruiter-dashboard.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'jobcredits.html',
            template: './src/jobcredits.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'createjobad.html',
            template: './src/createjobad.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'managejobads.html',
            template: './src/managejobads.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'displayjob.html',
            template: './src/displayjob.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'search.html',
            template: './src/search.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'favourites.html',
            template: './src/favourites.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'advert.html',
            template: './src/advert.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'account-settings.html',
            template: './src/account-settings.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'createalert.html',
            template: './src/createalert.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'blockchaintools.html',
            template: './src/blockchaintools.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'jobseeker-applications.html',
            template: './src/jobseeker-applications.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'recruiter-applications.html',
            template: './src/recruiter-applications.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'cvsearch.html',
            template: './src/cvsearch.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'cvsearchresults.html',
            template: './src/cvsearchresults.html'
        }),
        new CopyWebpackPlugin([{
            from: 'src/img',
            to: 'img',
        } ]),
    ]

};