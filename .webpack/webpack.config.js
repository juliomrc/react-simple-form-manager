const webpackDevServerConfiguration = require("./helpers/webpackDevServer");
const optimization = require("./helpers/optimization");
const getPlugins = require("./helpers/plugins");
const fileName = require("./helpers/fileName");
const loaders = require("./helpers/loaders");
const alias = require("./helpers/alias");
const path = require("path");

const relativePathToRoot = "../.";

module.exports = (config) => {
    const isDevelopment = config.dev;
    const isHotDevelopment = config.WEBPACK_SERVE;
    const publicPath = "/";

    return {
        mode: isDevelopment ? "development" : "production",
        devtool: false,
        devServer: webpackDevServerConfiguration,
        context: path.join(__dirname, relativePathToRoot),
        entry: { examplesApp: path.resolve("examples/boot.tsx") },
        output: {
            filename: fileName("js", isDevelopment),
            chunkFilename: fileName("js", isDevelopment),
            path: path.resolve("examples-dist"),
            publicPath,
        },
        resolve: {
            extensions: [".js", ".ts", ".tsx"],
            alias,
        },
        optimization,
        plugins: getPlugins(isDevelopment, isHotDevelopment),
        module: { rules: loaders.getModuleLoaders(isHotDevelopment) },
    };
};
