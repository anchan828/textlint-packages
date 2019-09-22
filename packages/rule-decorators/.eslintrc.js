const baseESLintConfig = require("../../.eslintrc");
const path = require("path");

module.exports = {
  ...baseESLintConfig,
  parserOptions: {
    ...baseESLintConfig.parserOptions,
    project: path.resolve(__dirname, "../../tsconfig.eslint.json")
  }
};
