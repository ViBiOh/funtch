import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    name: 'funtch',
    file: 'index.js',
    format: 'umd',
    exports: 'named',
  },
  external: ['isomorphic-fetch'],
  plugins: [
    babel(),
    terser({
      ecma: 2020,
      mangle: {
        toplevel: true,
      },
      compress: {
        module: true,
        toplevel: true,
        unsafe_arrows: true,
        drop_debugger: true,
      },
      output: {
        quote_style: 1,
      },
    }),
  ],
};
