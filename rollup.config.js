import typescript from 'typescript';
import pluginTypescript from '@rollup/plugin-typescript';

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';
const projectPackage = require('./package.json');
const excludeDependencies = ['fs', 'path', 'http', 'url'];

module.exports = {
  output: {
    intro: !isProduction ? 'require("dotenv").config();' : undefined,
    format: 'cjs'
  },
  cache: null,
  external: Object.keys(projectPackage.dependencies).concat(excludeDependencies),
  plugins: [
    pluginTypescript({
      typescript
    })
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;

    warn(warning);
  }
};
