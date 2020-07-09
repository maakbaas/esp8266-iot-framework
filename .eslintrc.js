module.exports = { // eslint-disable-line no-undef
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: [
        "react",
    ],
    rules: {
        "comma-dangle": [
            "error",
            "always-multiline",
        ],
        curly: [
            "error",
            "all",
        ],
        "brace-style": [
            "error",
            "1tbs",
            { allowSingleLine: true },
        ],
        indent: [
            "error",
            4,
            { SwitchCase: 1 },
        ],
        "keyword-spacing": [
            "error",
            { before: true, after: true },
        ],
        "linebreak-style": [
            "error",
            "unix",
        ],
        "no-multi-spaces": [
            "error",
        ],
        "no-var": [
            "error",
        ],
        "prefer-const": [
            "error",
        ],
        "prefer-template": [
            "error",
        ],
        "quote-props": [
            "error",
            "as-needed",
        ],
        quotes: [
            "error",
            "double",
        ],
        semi: [
            "error",
            "always",
        ],
        "space-infix-ops": [
            "error",
        ],
        "template-curly-spacing": [
            "error",
            "never",
        ],
    },
};
