// @semantic-ui/tailwinds - Tailwind CSS Plugin for Semantic UI Components
// Provides JIT compilation of Tailwind classes for Shadow DOM components

import { isClient, isServer } from '@semantic-ui/utils';

// Environment-specific imports using string literals to avoid static analysis
let generateTailwindCSS, TailwindPlugin;

if (isServer) {
  const generatorPath = './generator-server.js';
  const pluginPath = './tailwind-plugin-server.js';
  const serverModule = await import(/* @vite-ignore */ generatorPath);
  const pluginModule = await import(/* @vite-ignore */ pluginPath);
  generateTailwindCSS = serverModule.generateTailwindCSS;
  TailwindPlugin = pluginModule.default;
}
else if (isClient) {
  const generatorPath = './generator-browser.js';
  const pluginPath = './tailwind-plugin-browser.js';
  const browserModule = await import(/* @vite-ignore */ generatorPath);
  const pluginModule = await import(/* @vite-ignore */ pluginPath);
  generateTailwindCSS = browserModule.generateTailwindCSS;
  TailwindPlugin = pluginModule.default;
}
else {
  throw new Error('Unknown environment - neither client nor server detected');
}

// Shared exports
export { collectContent } from './scanner.js';

// Environment-specific exports
export { generateTailwindCSS };
export { TailwindPlugin };
export default TailwindPlugin;
