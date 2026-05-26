module.exports = {
  extends: '@openedx/frontend-build/config/babel.config.js',
  plugins: [
    '@babel/plugin-transform-private-methods',
  ],
};
