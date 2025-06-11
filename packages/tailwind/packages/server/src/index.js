// @semantic-ui/tailwind - Tailwind CSS Plugin for Semantic UI Components (Server/Node.js)
// Provides JIT compilation of Tailwind classes for Shadow DOM components

export { generateTailwindCSS } from './generator.js';
export { collectContent } from './scanner.js';
export { default as TailwindPlugin } from './tailwind-plugin.js';
