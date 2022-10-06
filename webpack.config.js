const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
                },
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },
                    {
                        // For pure CSS - /\.css$/i,
                        // For Sass/SCSS - /\.((c|sa|sc)ss)$/i,
                        // For Less - /\.((c|le)ss)$/i,
//                        test: /\.((c|sa|sc)ss)$/i,
                        test: /\.css$/i,
                        use: [
//                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    // Run `postcss-loader` on each CSS `@import` and CSS modules/ICSS imports, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
                                    // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
                                    importLoaders: 1,
                                },
                            },
                        ],
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
            ]
        },
    ];

}; 

