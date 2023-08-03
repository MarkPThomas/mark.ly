module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  plugins: [
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "react-hooks"
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    "react": {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies

    rules: {
      /* Indentation */
      'no-mixed-spaces-and-tabs': 2,
      'indent': [2, 2],
      /* Variable cames */
      'camelcase': 2,
      /* Language constructs */
      'curly': 2,
      'eqeqeq': [2, 'smart'],
      'func-style': [2, 'expression'],
      /* Semicolons */
      'semi': 2,
      'no-extra-semi': 2,
      /* Padding & additional whitespace (perferred but optional) */
      'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
      'semi-spacing': 1,
      'key-spacing': 1,
      'block-spacing': 1,
      'comma-spacing': 1,
      'no-multi-spaces': 1,
      'space-before-blocks': 1,
      'keyword-spacing': [1, { 'before': true, 'after': true }],
      'space-infix-ops': 1,
      /* Variable declaration */
      'one-var': [1, { 'uninitialized': 'always', 'initialized': 'never' }],
      /* Minuta */
      'comma-style': [2, 'last'],
      'quotes': [1, 'single']
    },
  }
}