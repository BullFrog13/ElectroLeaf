module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': 0,
    'arrow-parens': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/self-closing-comp': 1,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'linebreak-style': 0,
  },
};
