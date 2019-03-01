module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: 0,
    'space-in-parens': 0,
    'comma-dangle': ['error', 'only-multiline'],
    'keyword-spacing': 0,
    'key-spacing': 0,
    'no-multiple-empty-lines': 0,
    'space-infix-ops': 0,
    'comma-spacing': 0,
    "space-before-function-paren": ["off", "always"],
    'no-unused-vars': 0,
    'spaced-comment': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      'impliedStrict' : true
    }
  }
}
