import { callback as callbackPlugin } from '@semantic-ui/esbuild-callback';
import { build } from '@semantic-ui/internal-scripts';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const specsDir = join(scriptsDir, '..');

build({
  watch: true,
  write: false,
  logLevel: 'silent',
  readEntrypoints: false,
  addBanner: false,
  addOutfile: false,
  log: { header: 'UI Specs', text: 'Icon SVG/CSS Rebuilt' },
  sourcemap: false,
  metafile: false,
  entryPoints: [join(specsDir, 'src/icons/mappings.js')],
  outdir: join(specsDir, '.temp-watch'),
  plugins: [
    callbackPlugin({
      onComplete: async (result, { isRebuild }) => {
        if (isRebuild) {
          try {
            execSync('npm run build:icons', { stdio: 'ignore', cwd: specsDir });
          }
          catch {
            // build error already printed by child process
          }
        }
      },
    }),
  ],
});
