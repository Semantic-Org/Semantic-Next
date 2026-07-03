import { decodeProjectHash, encodeProjectHash } from '@semantic-ui/playground';
import { each } from '@semantic-ui/utils';
import { indentLines } from './injections.js';

// Create a playground link from an object of parameters.
// If a key is 'files', its value is compressed into the hash via the engine codec.
// Other values are handled by URLSearchParams, which takes care of URL encoding.
export const getPlaygroundLink = async (params, baseUrl = '/playground') => {
  const hashParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === 'files') {
      hashParams.set(key, await encodeProjectHash(value));
    }
    else {
      hashParams.set(key, String(value));
    }
  }
  return `${baseUrl}#${hashParams.toString()}`;
};

export const getCodePlaygroundLink = async (code, baseUrl = '/playground', { wrapPage = true } = {}) => {
  const cdnChannel = window.location.hostname === 'next.semantic-ui.com' ? 'latest' : 'canary';
  let pageContent = code;
  if (wrapPage) {
    pageContent = `<html>
<!-- playground-fold -->
  <head>
    <!-- Include Semantic UI -->
    <link href="https://cdn.semantic-ui.com/css@${cdnChannel}" rel="stylesheet" />
    <script src="https://cdn.semantic-ui.com/core@${cdnChannel}" type="module"></script>

    <!-- Include Default Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

    <!-- Playground Code -->
    <link href="page.css" rel="stylesheet" />
    <script src="page.js" type="module"></script>
  </head>
<!-- playground-fold-end -->

  <body>
${indentLines(code, 4)}
  </body>
</html>
`;
  }

  const pageJS = `
    // handle dark mode for playground
    if(localStorage.getItem('theme') == 'dark') {
      document.querySelector('html').classList.add('dark');
    }
  `;

  const pageCSS = `
body {
  padding: 1rem;
}
`;
  const params = {
    files: {
      'page.js': {
        contentType: 'text/javascript',
        content: pageJS,
      },
      'page.css': {
        contentType: 'text/css',
        content: pageCSS,
      },
      'page.html': {
        contentType: 'text/html',
        content: pageContent,
      },
    },
  };
  return getPlaygroundLink(params);
};

// Read the hash string and return the decoded parameters.
// The 'files' parameter is decoded via the engine codec.
export const readPlaygroundLink = async (hash) => {
  const hashString = hash?.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(hashString);
  const result = {};
  for (const [key, value] of params.entries()) {
    if (key === 'files') {
      result[key] = await decodeProjectHash(value).catch((error) => {
        console.error('Error decoding files:', error);
        return null;
      });
    }
    else {
      result[key] = value;
    }
  }
  return result;
};
