module.exports = (extension, isDevelopment) => {
    if (isDevelopment) {
        return `[name].bundle.${extension}`;
    }
    return `[name].[contenthash].bundle.${extension}`;
};
