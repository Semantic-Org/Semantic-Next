/**
 * Generates Tailwind CSS using jit-browser-tailwindcss
 */

import { createTailwindcss } from '@mhsdesign/jit-browser-tailwindcss';

export async function generateTailwindCSS({ content, css = '', config = {} }) {
  const tailwind = createTailwindcss({ tailwindConfig: config });

  // Build source CSS with Tailwind directives + existing component CSS
  // The CSS parameter is processed by PostCSS with Tailwind plugin
  const sourceCSS = css
    ? `${css}\n@tailwind utilities;` // Add utilities to existing CSS
    : '@tailwind utilities;'; // Just utilities if no existing CSS

  const outputCSS = await tailwind.generateStylesFromContent(
    sourceCSS,
    [content],
  );

  return outputCSS; // returns stringified CSS ready to inject
}
