/**
 * Generates Tailwind CSS for Node.js environments using native scanner
 */

import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

export async function generateTailwindCSS({ content, css = '', tailwindCSS, config = {} }) {
  // Build source CSS with Tailwind directives + existing component CSS
  if (!tailwindCSS) {
    tailwindCSS = `@import "tailwindcss";`;
  }

  const sourceCSS = css
    ? `${css}\n${tailwindCSS}` // Add utilities to existing CSS
    : tailwindCSS; // Just utilities if no existing CSS

  // Compile CSS using @tailwindcss/node with automatic file resolution
  const compiler = await compile(sourceCSS, {
    base: process.cwd(),
    onDependency: () => {}, // No-op dependency tracking for JIT use
  });

  // Extract candidates using native scanner
  const scanner = new Scanner({ sources: [] });
  const candidatesWithPositions = scanner.getCandidatesWithPositions({
    content,
    extension: 'html',
  });
  const candidates = candidatesWithPositions.map(item => item.candidate);

  // Build the CSS with the extracted candidates
  const result = compiler.build(candidates);

  return result; // returns stringified CSS ready to inject
}
