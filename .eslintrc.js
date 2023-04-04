module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:@next/next/recommended", "next/core-web-vitals"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
    },
};
