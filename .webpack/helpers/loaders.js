const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getJsTsLoaders = (isHotDevelopment) => {
    return {
        test: /\.(js|ts(x?))$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                plugins: [isHotDevelopment && "react-refresh/babel"].filter(
                    Boolean,
                ),
            },
        },
    };
};

const styleLoaders = {
    test: /\.(scss|sass|css)$/,
    exclude: /node_modules/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: "@teamsupercell/typings-for-css-modules-loader",
            options: { disableLocalsExport: true },
        },
        {
            loader: "css-loader",
            options: {
                modules: true,
            },
        },
        "sass-loader",
    ],
};

const fontLoaders = {
    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
    type: "asset/resource",
};

const assetLoaders = {
    test: /\.(png|jpe?g|gif|ico|svg)$/i,
    type: "asset",
};

const getModuleLoaders = (isHotDevelopment) => {
    return [
        {
            ...getJsTsLoaders(isHotDevelopment),
        },
        {
            ...styleLoaders,
        },
        {
            ...fontLoaders,
        },
        {
            ...assetLoaders,
        },
    ];
};

module.exports = {
    getJsTsLoaders,
    styleLoaders,
    fontLoaders,
    assetLoaders,
    getModuleLoaders,
};
