import { prefixCSS } from '@semantic-ui/utils';
import { generateTailwindCSS } from 'tailwindcss-iso';
import { extractDefinitionContent } from './extract-definition-content.js';

// @property rules must be registered at the document level — they are ignored
// inside Shadow DOM adopted stylesheets. Split them into pageCSS so that
// defineComponent adopts them on the document instead of the shadow root.
const propertyRulePattern = /^@property\s[^{]+\{[^}]*\}\s*/gm;

function splitPropertyRules(css) {
  const propertyRules = [];
  const componentCSS = css.replace(propertyRulePattern, (match) => {
    propertyRules.push(match.trim());
    return '';
  });
  return {
    componentCSS,
    pageCSS: propertyRules.join('\n'),
  };
}

export async function TailwindPlugin(definition, { autoprefix = true } = {}) {
  // Collect all content and CSS from the component definition
  const { content, css } = extractDefinitionContent(definition);

  // Quick check - if no content, return unchanged
  if (!content.trim()) {
    return definition;
  }

  // Generate CSS using tailwindcss-iso server implementation
  let tailwindCSS = await generateTailwindCSS({
    content,
    css,
  });

  // If no CSS was generated, return unchanged
  if (!tailwindCSS.trim()) {
    return definition;
  }

  // Add vendor prefixes for cross-browser compatibility
  if (autoprefix) {
    tailwindCSS = prefixCSS(tailwindCSS);
  }

  // Split @property rules into pageCSS for document-level registration
  const { componentCSS, pageCSS } = splitPropertyRules(tailwindCSS);

  // Replace component CSS with Tailwind-enhanced version
  return {
    ...definition,
    css: componentCSS,
    ...(pageCSS && {
      pageCSS: definition.pageCSS
        ? `${definition.pageCSS}\n${pageCSS}`
        : pageCSS,
    }),
  };
}

export { extractDefinitionContent } from './extract-definition-content.js';
