import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively search for a folder and return all files within it
 * Replaces import.meta.glob() with targeted file loading
 */
export const getFolder = async (folderName, baseFolder, { depth = 3 } = {}) => {
  if (!folderName) {
    return {};
  }

  // Resolve path from process.cwd() (docs/ during build)
  // baseFolder like '../../examples/' means docs/src/examples/ (from docs/src/pages/)
  // From cwd (docs/), that's src/examples/
  const normalizedBase = baseFolder.replace(/^\.\.\/\.\.\//, 'src/');
  const searchBase = path.resolve(process.cwd(), normalizedBase);

  // Debug logging for build issues
  console.log('[getFolder] folderName:', folderName);
  console.log('[getFolder] cwd:', process.cwd());
  console.log('[getFolder] searchBase:', searchBase);
  console.log('[getFolder] searchBase exists:', fs.existsSync(searchBase));

  // Generate search patterns dynamically based on depth
  const globPatterns = [];

  // Direct match (0 levels deep)
  globPatterns.push(`${searchBase}/${folderName}/**/*`);

  // Add patterns for each depth level
  for (let i = 1; i <= depth; i++) {
    const wildcards = '*/'.repeat(i);
    globPatterns.push(`${searchBase}/${wildcards}${folderName}/**/*`);
  }

  const files = {};

  console.log('[getFolder] globPatterns:', globPatterns.slice(0, 2), '...');

  for (const pattern of globPatterns) {
    const matchedFiles = await glob(pattern, { nodir: true });
    if (matchedFiles.length > 0) {
      console.log('[getFolder] pattern matched:', pattern, '-> found', matchedFiles.length, 'files');
    }

    for (const filePath of matchedFiles) {
      // Convert absolute path back to the relative format that getExampleFiles expects
      const relativePath = path.relative(searchBase, filePath);
      const globStylePath = (baseFolder + relativePath).replace(/\\/g, '/');

      files[globStylePath] = async () => {
        const content = fs.readFileSync(filePath, 'utf8');
        return { default: content };
      };
    }
  }

  console.log('[getFolder] total files found:', Object.keys(files).length);
  return files;
};
