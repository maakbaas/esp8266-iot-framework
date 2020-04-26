const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const EventHooksPlugin = require('event-hooks-webpack-plugin');

const glob = require('glob');
const fs = require('fs');
const path = require('path');
const del = require('del');

module.exports = (env, argv) => ({
    
    context: path.resolve(__dirname),

    entry: './html/js/index.js',

    output: {
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[name].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            pngquant: {
                                quality: '20-40'
                            }
                        }
                    }
                ]
            }
        ]
    },

    optimization: {
        minimize: true        
    },

    resolve: {
        alias: {
            "react": "preact/compat",
            "react-dom": "preact/compat"
        },
    },

    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebPackPlugin({
            template: "./html/index.html",
            filename: "./index.html",
            inlineSource: '.(js|css)$' // embed all javascript and css inline
        }),
        new CleanWebpackPlugin({
            protectWebpackAssets: (argv.mode === 'production'),
            cleanAfterEveryBuildPatterns: ["**/*.js", "**/*.html", "**/*.css", "**/*.js.gz", "**/*.css.gz"]
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new MiniCssExtractPlugin(),
        new CompressionPlugin(),        
        new EventHooksPlugin({
            done: () => {
                if (argv.mode === 'production')
                {
                    var source = './dist/index.html.gz';
                    var destination = './src/generated/html.h';

                    var wstream = fs.createWriteStream(destination);
                    wstream.on('error', function (err) {
                        console.log(err);
                    });

                    var data = fs.readFileSync(source);
                    
                    wstream.write('#ifndef HTML_H\n');
                    wstream.write('#define HTML_H\n\n');
                    wstream.write('#include <Arduino.h>\n\n');                

                    wstream.write('#define html_len ' + data.length + '\n\n');

                    wstream.write('const uint8_t html[] PROGMEM = {')

                    for (i = 0; i < data.length; i++) {
                        if (i % 1000 == 0) wstream.write("\n");
                        wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                        if (i < data.length - 1) wstream.write(',');
                    }

                    wstream.write('\n};')

                    wstream.write('\n\n#endif\n');

                    wstream.end();

                    del([source]);
                    del('./dist/');
                }
            }
        })
    ]
});