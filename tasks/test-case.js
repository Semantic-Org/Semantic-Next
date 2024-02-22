import * as esbuild from 'esbuild';
import { logPlugin } from './lib/log.js';

let buildTest = await esbuild.context({
  entryPoints: ['./tests/test-case/src/test-case'],
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
    },
  },
  bundle: true,
  minify: false,
  sourcemap: true,
  plugins: [logPlugin('Test Case Updated')],
  loader: {
    '.ts': 'ts',
    '.html': 'text',
    '.css': 'text',
  },
  outdir: './tests/test-case/dist',
});

let { host, port } = await buildTest.serve({
  servedir: 'tests/test-case',
});

console.log(`Server up ${host}:${port}`);
