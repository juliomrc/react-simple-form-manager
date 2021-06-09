module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    settings: {
        react: { version: "detect" },
    },
    ignorePatterns: ["*.d.ts", "./node_modules", "./lib", "./dist"],
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
    },
};
