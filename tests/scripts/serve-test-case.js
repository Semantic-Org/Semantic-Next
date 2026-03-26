import esbuild from 'esbuild';
import path from 'path';
import fs from 'fs/promises';

// Plugin to handle ?raw imports (Vite-style raw file imports)
const rawPlugin = {
  name: 'raw',
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      const filePath = path.resolve(args.resolveDir, args.path.replace(/\?raw$/, ''));
      return {
        path: filePath,
        namespace: 'raw',
      };
    });
    build.onLoad({ filter: /.*/, namespace: 'raw' }, async (args) => {
      const contents = await fs.readFile(args.path, 'utf8');
      return { contents: `export default ${JSON.stringify(contents)}`, loader: 'js' };
    });
  },
};

const ctx = await esbuild.context({
  entryPoints: ['tests/test-case/src/index.js'],
  bundle: true,
  outfile: 'tests/test-case/dist/test-case.js',
  format: 'esm',
  sourcemap: true,
  plugins: [rawPlugin],
});

const { host, port } = await ctx.serve({
  servedir: 'tests/test-case',
  port: 3333,
});

console.log(`Test case server running at http://localhost:${port}`);
