/**
 * Tailwind CSS transformation function for Semantic UI components (Browser)
 * Scans component definition for Tailwind classes and generates JIT CSS
 */

import { generateTailwindCSS } from './generator.js';
import { collectContent } from './scanner.js';

export default function TailwindPlugin(config = {}) {
  return async function transformDefinition(definition) {
    // Collect all content and CSS from the component definition
    const { content, css } = collectContent(definition);

    // Quick check - if no content, return unchanged
    if (!content.trim()) {
      return definition;
    }

    // Generate CSS using tailwindcss core with WASM scanner
    const tailwindCSS = await generateTailwindCSS({
      content,
      css,
      config,
    });

    // If no CSS was generated, return unchanged
    if (!tailwindCSS.trim()) {
      return definition;
    }

    // Replace component CSS with Tailwind-enhanced version
    return {
      ...definition,
      css: tailwindCSS,
    };
  };
}
