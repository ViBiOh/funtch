import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    name: 'funtch',
    file: 'index.js',
    format: 'umd',
    exports: 'named',
  },
  external: ['isomorphic-fetch'],
  plugins: [babel(), uglify()],
};
