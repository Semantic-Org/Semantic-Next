import fs from 'fs/promises';
import path from 'path';

export async function cleanDirectory(directoryPath) {
  try {

    // only clear if exists
    try {
      await fs.access(directoryPath);
    } catch (error) {
      console.log(error);
      return;
    }

    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        // recurse
        await fs.rm(entryPath, { recursive: true, force: true });
      } else {
        // rm
        await fs.unlink(entryPath);
      }
    }

    console.log(`Successfully cleaned ${directoryPath}`);
  } catch (error) {
    console.error(`Error cleaning directory ${directoryPath}:`, error);
    process.exit(1);
  }
}
// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {

    let targetDir = process.argv[2];

    if(!targetDir) {
      const base = process.env.BASE_DIR || process.cwd();
      targetDir = path.resolve(base, 'dist');
    }
    console.log('target dir', targetDir);
    await cleanDirectory(targetDir);
    process.exit();
  })();
}
