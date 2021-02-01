const { babel } = require('@rollup/plugin-babel');
const chalk = require('chalk');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const jsonPlugin = require('@rollup/plugin-json');
const { resolve } = require('path');
const { terser } = require('rollup-plugin-terser');
import dts from 'rollup-plugin-dts';
const pkg = require('./package.json');
const html = require('@rollup/plugin-html');

const isProduction = process.env.BUILD_ENV === 'prod';
const isProductionBuild = process.env.BUILD_ENV === 'prod';
const userFormat = process.env.FORMAT;
const outputPath = process.env.BUILD_PATH || './lib';
const extensions = ['.js', '.ts'];
/**
 * @description 处理format
 */
const formatList = ['amd', 'cjs', 'es', 'iife', 'umd', 'system'];
let format = 'umd';
if (formatList.indexOf(userFormat) !== -1) {
  format = userFormat;
} else {
  if (userFormat !== undefined) {
    console.log(
      chalk.red(`The ${userFormat} format does not exist. Package using the default format${chalk.green('[umd]')}`),
    );
  }
}
console.log(chalk.green(`Format:${format}`));

const resolvePath = (...path) => {
  return resolve(__dirname, ...path);
};

const outputOptions = {
  file: resolvePath(outputPath) + '/index.js',
  format,
};

const pluginsOptions = [
  jsonPlugin(),
  nodeResolve({
    extensions,
    modulesOnly: true,
  }),
  babel({
    exclude: 'node_modules/**',
    extensions,
    babelHelpers: 'bundled',
  }),
];

if (isProductionBuild) {
  Object.assign(outputOptions, {
    plugins: [terser()],
  });
} else {
  Object.assign(outputOptions, { sourcemap: true });
}

if (!isProduction) {
  pluginsOptions.push(html());
}
if (format === 'umd') {
  Object.assign(outputOptions, { name: pkg.name });
}

const buildJs = {
  input: resolvePath('src/index.ts'),
  output: outputOptions,
  plugins: pluginsOptions,
};

const buildTs = {
  input: resolvePath('src/index.ts'),
  output: {
    file: resolvePath(outputPath, 'index.d.ts'),
    format: 'es',
  },
  plugins: [dts()],
};
module.exports = [buildJs, buildTs];
