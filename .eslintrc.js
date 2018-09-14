module.exports = {
  root: true,
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true
  },
  extends: "standard",
  // required to lint *.vue files
  plugins: ["html"],
  // add your custom rules here
  rules: {
    "space-before-function-paren": "off",
    semi: "off",
    quotes: "off",
    "no-debugger": "off",
    "no-undef": "off",
    "no-tabs": "off",
    "new-cap": "off",
    "no-unused-vars": "off",
    indent: "off",
    semicolon: "off"
  },
  globals: {}
};
