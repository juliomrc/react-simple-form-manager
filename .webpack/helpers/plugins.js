const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const fileName = require("./fileName");
const webpack = require("webpack");

module.exports = (isDevelopment, isHotDevelopment) => {
    const plugins = [
        new MiniCssExtractPlugin({ filename: fileName("css", isDevelopment) }),
        new HtmlWebpackPlugin({
            template: "examples/index.html",
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: isHotDevelopment ? "server" : "static",
        }),
    ];

    if (isDevelopment) {
        plugins.push(
            new webpack.SourceMapDevToolPlugin({
                filename: "[file].map",
                exclude: [/vendors.*.*/, /polyfills.*/, /runtime.*/],
            }),
        );

        if (isHotDevelopment) {
            plugins.push(
                new ReactRefreshWebpackPlugin(),
                new webpack.WatchIgnorePlugin({ paths: [/\.d\.ts$/] }),
            );
        }
    } else {
        plugins.push(new StylelintPlugin(), new ESLintPlugin());
    }

    return plugins;
};
