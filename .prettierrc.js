/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.sol",
      options: { tabWidth: 4, singleQuote: false },
    },
    {
      files: "*.vue",
      options: { singleQuote: false },
    },
  ],
};