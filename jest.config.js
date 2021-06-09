/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    testEnvironment: "jsdom",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "./.tests/coverage",
    setupFilesAfterEnv: ["<rootDir>/.tests/jest-setup.ts"],
    coverageProvider: "babel",
    moduleNameMapper: {
        "@some-module/(.*)$": "<rootDir>/src/some-module/$1",
        // https://jestjs.io/docs/webpack
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/.tests/__mocks__/file-mock.js",
        "\\.(css|less|scss|sass)$": "<rootDir>/.tests/__mocks__/style-mock.js",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$",
    transformIgnorePatterns: ["\\\\node_modules\\\\"],
};
