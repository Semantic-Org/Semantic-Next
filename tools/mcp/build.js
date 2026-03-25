import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist/api', { recursive: true });

await esbuild.build({
  entryPoints: ['src/http.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/api/mcp.js',
  banner: {
    js: '// @ts-nocheck',
  },
});

copyFileSync('api/index.js', 'dist/api/index.js');
