const fs = require('fs');
const path = require('path');

const babelConfigPath = path.join(__dirname, '../node_modules/@openedx/frontend-build/config/babel.config.js');
let content = fs.readFileSync(babelConfigPath, 'utf8');

if (!content.includes('@babel/plugin-transform-private-methods')) {
  content = content.replace(
    "'@babel/plugin-proposal-class-properties',",
    "'@babel/plugin-proposal-class-properties',\n    '@babel/plugin-transform-private-methods',"
  );
  fs.writeFileSync(babelConfigPath, content);
  console.log('Patched: added @babel/plugin-transform-private-methods');
} else {
  console.log('Already patched, skipping.');
}
