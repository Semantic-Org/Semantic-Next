import { generateTailwindCSS } from 'tailwindcss-iso/browser';
import { extractDefinitionContent } from './extract-definition-content.js';

export async function TailwindPlugin(definition) {
  // Collect all content and CSS from the component definition
  const { content, css } = extractDefinitionContent(definition);

  // Quick check - if no content, return unchanged
  if (!content.trim()) {
    return definition;
  }

  // Generate CSS using tailwindcss-iso browser implementation
  const tailwindCSS = await generateTailwindCSS({
    content,
    css,
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
}

export { extractDefinitionContent } from './extract-definition-content.js';