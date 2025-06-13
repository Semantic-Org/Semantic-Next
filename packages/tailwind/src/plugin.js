/**
 * This extracts html/css/js from a definition and then creates tailwind css
 */

import { generateTailwindCSS } from 'tailwindcss-iso';
import { extractDefinitionContent } from './extract-definition-content.js';

export default function TailwindPlugin(config = {}) {
  return async function transformDefinition(definition) {
    // Collect all content and CSS from the component definition
    const { content, css } = collectContent(definition);

    // Quick check - if no content, return unchanged
    if (!content.trim()) {
      return definition;
    }

    // Generate CSS using @tailwindcss/node with native scanner
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
