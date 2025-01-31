import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from './log.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const buildPlayground = async ({
  watch = false
}) => {
  return;
  const sourceCore = path.join(__dirname, '../../docs/node_modules/@semantic-ui/core');
  const destCore = path.join(__dirname, '../../docs/public/node_modules/@semantic-ui/core');
  const srcDir = path.join(__dirname, '../../src');
  const packagesDir = path.join(__dirname, '../../packages');

  const copyModules = async () => {
    try {
      // Clean destination if it exists
      if (fs.existsSync(destCore)) {
        await fs.promises.rm(destCore, { recursive: true });
      }

      // Create the destination directory
      await fs.promises.mkdir(destCore, { recursive: true });

      // Copy core folders: src, dist, and packages
      const foldersToCopy = ['src', 'dist', 'packages'];

      for (const folder of foldersToCopy) {
        const sourcePath = path.join(sourceCore, folder);
        const destPath = path.join(destCore, folder);

        if (fs.existsSync(sourcePath)) {
          log('Docs Playground', `Copying ${folder} folder`);
          await fs.promises.cp(sourcePath, destPath, { recursive: true });
        } else {
          log('Docs Playground', `Warning: ${folder} folder not found`);
        }
      }

      // Verify final contents
      const finalContents = await fs.promises.readdir(destCore);
      log('Docs Playground', `Final contents: ${finalContents.join(', ')}`);

    } catch (error) {
      log('Docs Playground', `Error during copy: ${error.message}`);
      console.error(error);
    }
  };

  // Do initial copy
  await copyModules();

  if (watch) {
    fs.watch(srcDir, { recursive: true }, async (eventType, filename) => {
      if (filename?.includes('node_modules')) return;
      log('Docs Playground', `Change detected in src/${filename}`);
      await copyModules();
    });

    fs.watch(packagesDir, { recursive: true }, async (eventType, filename) => {
      if (filename?.includes('node_modules')) return;
      log('Docs Playground', `Change detected in packages/${filename}`);
      await copyModules();
    });
  }
};
