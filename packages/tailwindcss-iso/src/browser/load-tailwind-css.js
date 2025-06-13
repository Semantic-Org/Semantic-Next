import indexCSS from 'tailwindcss/index.css?raw';
import preflightCSS from 'tailwindcss/preflight.css?raw';
import themeCSS from 'tailwindcss/theme.css?raw';
import utilitiesCSS from 'tailwindcss/utilities.css?raw';

/* This handles loading tailwind css, it was adapted from the official plugin code
  <https://github.com/tailwindlabs/tailwindcss/blob/main/packages/%40tailwindcss-browser/src/index.ts>
*/

export async function loadTailwindCSS(id, base) {
  if (id === 'tailwindcss') {
    return {
      path: 'virtual:tailwindcss/index.css',
      base,
      content: indexCSS,
    };
  }
  else if (
    id === 'tailwindcss/preflight'
    || id === 'tailwindcss/preflight.css'
    || id === './preflight.css'
  ) {
    return {
      path: 'virtual:tailwindcss/preflight.css',
      base,
      content: preflightCSS,
    };
  }
  else if (
    id === 'tailwindcss/theme'
    || id === 'tailwindcss/theme.css'
    || id === './theme.css'
  ) {
    return {
      path: 'virtual:tailwindcss/theme.css',
      base,
      content: themeCSS,
    };
  }
  else if (
    id === 'tailwindcss/utilities'
    || id === 'tailwindcss/utilities.css'
    || id === './utilities.css'
  ) {
    return {
      path: 'virtual:tailwindcss/utilities.css',
      base,
      content: utilitiesCSS,
    };
  }

  throw new Error(`External stylesheets not supported in browser build: "${id}"`);
}
