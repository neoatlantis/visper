const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const RemoveConsolePlugin = require('remove-console-webpack-plugin')


module.exports = (env)=>{

    const is_dev = (env.production === undefined);
    const output_path = path.resolve(__dirname, is_dev?"web-dev":"web");


    return [
        {
            entry: './client/index.js',
            mode: is_dev?'development':'production',
            watch: true, //is_dev,
            output: {
                filename: 'app.js',
                path: output_path,
            },
            resolve: {
                alias: {
                    app: path.resolve(__dirname, "client"),
                    sfc: path.resolve(__dirname, "client", "vue"),
                    msgpack: "@ygoe/msgpack",
                },
            },
            externals: {
                "socket-io": "io",
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },
                    {
                        test: /\.(vue|js)$/,
                        loader: 'ifdef-loader',
                        exclude: /node_modules/,
                        options: {
                            DEV: is_dev,
                        }
                    }
                ]
            },
            plugins: [
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin({
                    template: "./client/index.html",
                }),
                //new RemoveConsolePlugin(is_dev?[]:['*']),
            ]
        },
    ];

}; 

