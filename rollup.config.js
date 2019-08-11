import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/funtch.js',
  output: {
    name: 'funtch',
    file: 'bundle.js',
    format: 'umd',
  },
  plugins: [babel(), uglify()],
};
