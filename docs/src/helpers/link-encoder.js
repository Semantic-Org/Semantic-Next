import { each } from '@semantic-ui/utils';
import { deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate';
import { indentLines } from './injections.js';

// encode files in base 64 for urls
export const makeBase64UrlSafe = base64 => {
  return base64.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// decode files from base64 urls
export const fromBase64UrlSafe = urlSafeBase64 => {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  const paddingNeeded = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(paddingNeeded);
  return base64;
};

// Encode an object (mapping file names to content) into a URL-safe Base64 string
export const encodeObject = object => {
  const json = JSON.stringify(object);
  const uint8Array = strToU8(json);
  const compressed = deflateSync(uint8Array);

  let binary = '';
  each(compressed, byte => {
    binary += String.fromCharCode(byte);
  });

  const base64 = btoa(binary);
  return makeBase64UrlSafe(base64);
};

// Decode the URL-safe Base64 string back into the original object
export const decodeObject = encodedData => {
  const base64 = fromBase64UrlSafe(encodedData);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  const decompressed = inflateSync(bytes);
  const json = strFromU8(decompressed);

  return JSON.parse(json);
};

// Create a playground link from an object of parameters.
// If a key is 'files', its value is encoded using encodeObject.
// Other values are handled by URLSearchParams, which takes care of URL encoding.
export const getPlaygroundLink = (params, baseUrl = '/playground') => {
  const hashParams = new URLSearchParams();
  each(params, (value, key) => {
    if (key === 'files') {
      hashParams.set(key, encodeObject(value));
    }
    else {
      hashParams.set(key, String(value));
    }
  });
  return `${baseUrl}#${hashParams.toString()}`;
};

export const getCodePlaygroundLink = (code, baseUrl = '/playground', { wrapPage = true } = {}) => {
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

// Read the query string and return the decoded parameters.
// The 'files' parameter is decoded using decodeObject.
export const readPlaygroundLink = (hash) => {
  // strip leading # if present
  const hashString = hash?.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(hashString);
  const result = {};
  for (const [key, value] of params.entries()) {
    if (key === 'files') {
      try {
        result[key] = decodeObject(value);
      }
      catch (err) {
        result[key] = null;
      }
    }
    else {
      result[key] = value;
    }
  }
  return result;
};
