module.exports = {
  "*.{ts,tsx,vue}": ["eslint --fix", "prettier --write"],
  "*.{js,jsx,cjs,mjs}": ["eslint --fix", "prettier --write"],
  "*.{json,yaml,yml}": ["prettier --write"],
  "*.{css,scss}": ["prettier --write"],
  "*.md": ["prettier --write"],
  "*.sol": ["prettier --write"],
};