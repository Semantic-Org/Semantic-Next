// @semantic-ui/tailwinds - Tailwind CSS Plugin for Semantic UI Components
// Provides JIT compilation of Tailwind classes for Shadow DOM components

export { generateTailwindCSS } from './generator.js';
export { collectContent } from './scanner.js';
export { default as TailwindPlugin } from './tailwind-plugin.js';
