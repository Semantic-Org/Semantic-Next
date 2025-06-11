/**
 * Generates Tailwind CSS using @tailwindcss/node (server-side with native scanner)
 */

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, Features } from 'tailwindcss';

// Get path to bundled native binary
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const enginePath = join(__dirname, '..', 'engine');

// Load bundled native scanner
const require = createRequire(import.meta.url);
let Scanner;

try {
  // Try to load bundled native binary (prefer GNU, fallback to musl)
  let binaryPath;
  try {
    binaryPath = join(enginePath, 'oxide-linux-x64-gnu', 'tailwindcss-oxide.linux-x64-gnu.node');
    const nativeModule = require(binaryPath);
    Scanner = nativeModule.Scanner;
  }
  catch {
    binaryPath = join(enginePath, 'oxide-linux-x64-musl', 'tailwindcss-oxide.linux-x64-musl.node');
    const nativeModule = require(binaryPath);
    Scanner = nativeModule.Scanner;
  }
}
catch (error) {
  throw new Error(
    `Failed to load bundled native scanner: ${error.message}. `
      + 'Server environments require a compatible native binary.',
  );
}

export async function generateTailwindCSS({ content, css = '', tailwindCSS, config = {} }) {
  // Build source CSS with Tailwind directives + existing component CSS
  if (!tailwindCSS) {
    tailwindCSS = `@tailwind base; @tailwind components; @tailwind utilities;`;
  }

  const sourceCSS = css
    ? `${css}\n${tailwindCSS}` // Add utilities to existing CSS
    : tailwindCSS; // Just utilities if no existing CSS

  // Compile the CSS using @tailwindcss/node
  const compiler = await compile(sourceCSS, {
    base: process.cwd(),
    onDependency: () => {}, // No-op dependency tracking for now
    shouldRewriteUrls: false,
    polyfills: Features.All, // Include all features
  });

  // Extract candidates using native Node.js scanner
  const scanner = new Scanner({ sources: [] }); // No file sources, we'll scan content directly
  const candidatesWithPositions = scanner.get_candidates_with_positions({ content, extension: 'html' });
  const candidates = candidatesWithPositions.map(item => item.candidate);

  // Build the CSS with the extracted candidates
  const result = compiler.build(candidates);

  return result; // returns stringified CSS ready to inject
}
