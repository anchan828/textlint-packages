// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierRc = require("./.prettierrc");
module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "sort-keys-fix"],
  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "lines-between-class-members": ["error", "always"],
    "no-unused-vars": "off",
    "no-useless-constructor": "off",
    "prettier/prettier": ["error", prettierRc],
    "sort-keys-fix/sort-keys-fix": "error",
  },
};
