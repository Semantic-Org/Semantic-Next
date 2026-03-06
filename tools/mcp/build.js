import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/http.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'api/mcp.js',
  banner: {
    js: '// @ts-nocheck',
  },
});
