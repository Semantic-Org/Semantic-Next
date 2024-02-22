import { promises as fs } from 'fs';
import path from 'path';
import chokidar from 'chokidar';

// Transform function for .js files
const transformJsImports = (content) => {
  const importRegex = /import\s+.*?from\s+['"](.+?\.js)['"];?/g;
  return content.replace(importRegex, (match, p1) => `import '${p1}?raw';`);
};

// Function to process and copy a single file
const processAndCopyFile = async (srcFilePath, destFilePath) => {
  const extension = path.extname(srcFilePath);
  if (extension === '.js') {
    try {
      let content = await fs.readFile(srcFilePath, 'utf8');
      content = transformJsImports(content);
      await fs.writeFile(destFilePath, content);
      console.log(
        `Processed and copied JS file: ${path.basename(srcFilePath)}`
      );
    } catch (err) {
      console.error(`Error processing JS file ${srcFilePath}: ${err}`);
    }
  }
  else {
    try {
      await fs.copyFile(srcFilePath, destFilePath);
      console.log(`Copied file: ${path.basename(srcFilePath)}`);
    } catch (err) {
      console.error(
        `Error copying file ${srcFilePath} to ${destFilePath}: ${err}`
      );
    }
  }
};

// Initial copy function for directories
const processAndCopyFolder = async (sourceDir, destDir) => {
  try {
    const files = await fs.readdir(sourceDir);
    for (const file of files) {
      const srcFilePath = path.join(sourceDir, file);
      const destFilePath = path.join(destDir, file);
      await processAndCopyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    console.error(
      `Error during initial copy from ${sourceDir} to ${destDir}: ${err}`
    );
  }
};

// Watch and copy function using chokidar
export const watchAndCopy = async ({
  sourceDir,
  destDir,
  initialCopy = true,
} = {}) => {
  if (initialCopy) {
    await processAndCopyFolder(sourceDir, destDir);
  }

  // Use chokidar to watch the sourceDir
  const watcher = chokidar.watch(sourceDir, {
    persistent: true,
    ignoreInitial: false,
    depth: 99,
  });

  watcher
    .on('add', async (filePath) => {
      const destFilePath = path.join(
        destDir,
        path.relative(sourceDir, filePath)
      );
      console.log(`File ${filePath} has been added.`);
      await processAndCopyFile(filePath, destFilePath);
    })
    .on('change', async (filePath) => {
      const destFilePath = path.join(
        destDir,
        path.relative(sourceDir, filePath)
      );
      console.log(`File ${filePath} has been changed.`);
      await processAndCopyFile(filePath, destFilePath);
    })
    .on('unlink', (filePath) => {
      console.log(`File ${filePath} has been removed.`);
    });

  console.log(`Watching for file changes in ${sourceDir}`);
};
