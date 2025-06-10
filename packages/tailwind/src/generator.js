/**
 * Generates Tailwind CSS using jit-browser-tailwindcss
 */

import { createTailwindcss } from '@mhsdesign/jit-browser-tailwindcss';

export async function generateTailwindCSS({ content, css = '', tailwindCSS, config = {} }) {
  const tailwind = createTailwindcss({ tailwindConfig: config });

  // Build source CSS with Tailwind directives + existing component CSS
  // The CSS parameter is processed by PostCSS with Tailwind plugin

  if (!tailwindCSS) {
    tailwindCSS = `@tailwind base; @tailwind components; @tailwind utilities;`;
  }

  const sourceCSS = css
    ? `${css}\n${tailwindCSS}` // Add utilities to existing CSS
    : tailwindCSS; // Just utilities if no existing CSS

  const outputCSS = await tailwind.generateStylesFromContent(
    sourceCSS,
    [content],
  );

  return outputCSS; // returns stringified CSS ready to inject
}
