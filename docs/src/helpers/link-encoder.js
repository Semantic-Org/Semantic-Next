import { each } from '@semantic-ui/utils';

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
  const uint8Array = new TextEncoder().encode(json);
  let binary = '';
  each(uint8Array, byte => {
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
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
};

// Create a playground link from an object of parameters.
// If a key is 'files', its value is encoded using encodeObject.
// Other values are handled by URLSearchParams, which takes care of URL encoding.
export const getPlaygroundLink = (params, baseUrl = '/playground') => {
  const queryParams = new URLSearchParams();
  each(params, (value, key) => {
    if (key === 'files') {
      queryParams.set(key, encodeObject(value));
    }
    else {
      // URLSearchParams encodes the value automatically
      queryParams.set(key, String(value));
    }
  });
  return `${baseUrl}?${queryParams.toString()}`;
};

export const getCodePlaygroundLink = (code, baseUrl = '/playground') => {
  const params = {
    files: {
      'page.html': code
    }
  };
  return getPlaygroundLink(params);
};


// Read the query string and return the decoded parameters.
// The 'files' parameter is decoded using decodeObject.
export const readPlaygroundLink = queryString => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params.entries()) {
    if (key === 'files') {
      try {
        result[key] = decodeObject(value);
      }
      catch (err) {
        console.error('Error decoding files:', err);
        result[key] = null;
      }
    }
    else {
      result[key] = value;
    }
  }
  return result;
};
