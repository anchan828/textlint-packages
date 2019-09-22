const prettierRc = require("./.prettierrc");
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.eslint.json",
  },
  plugins: ["@typescript-eslint", "sort-keys-fix"],
  rules: {
    "prettier/prettier": ["error", prettierRc],
    "lines-between-class-members": ["error", "always"],
    "no-useless-constructor": "off",
    "no-unused-vars": "off",
    "sort-keys-fix/sort-keys-fix": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/camelcase": "off",
  },
};
