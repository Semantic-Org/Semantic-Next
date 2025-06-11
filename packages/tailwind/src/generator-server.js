/**
 * Generates Tailwind CSS using @tailwindcss/node (server-side with native scanner)
 */

// Try to import Node.js specific packages, fall back to core if not available
let compile, Features, Scanner;

try {
  const nodeModule = await import('@tailwindcss/node');
  compile = nodeModule.compile;
  Features = nodeModule.Features;

  const oxideModule = await import('@tailwindcss/oxide');
  Scanner = oxideModule.Scanner;
}
catch (error) {
  // Fallback to core tailwindcss if Node packages not available
  const coreModule = await import('tailwindcss');
  compile = coreModule.compile;
  Features = coreModule.Features;

  throw new Error(
    'Server usage requires @tailwindcss/node and @tailwindcss/oxide to be installed. '
      + 'Install them with: npm install @tailwindcss/node @tailwindcss/oxide',
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
  const candidates = [...scanner.scanText(content)];

  // Build the CSS with the extracted candidates
  const result = compiler.build(candidates);

  return result; // returns stringified CSS ready to inject
}
