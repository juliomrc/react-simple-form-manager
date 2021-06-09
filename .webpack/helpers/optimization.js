module.exports = {
    runtimeChunk: "single",
    splitChunks: {
        chunks: "all",
        cacheGroups: {
            chunks: "all",
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
            },
        },
    },
};
