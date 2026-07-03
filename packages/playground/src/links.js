/*
  Share-link encoding — the whole project travels in the URL hash, so links work
  with no storage backend. Format: URL-safe base64 of raw-deflated JSON, byte-
  compatible with links produced by the docs site's fflate-based encoder.
*/

const toBase64Url = (bytes) => {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (encoded) => {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  base64 += '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
};

const pipeThrough = async (bytes, transform) => {
  const stream = new Blob([bytes]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

export const encodeProjectHash = async (files) => {
  const bytes = new TextEncoder().encode(JSON.stringify(files));
  const compressed = await pipeThrough(bytes, new CompressionStream('deflate-raw'));
  return toBase64Url(compressed);
};

export const decodeProjectHash = async (encoded) => {
  const compressed = fromBase64Url(encoded);
  const bytes = await pipeThrough(compressed, new DecompressionStream('deflate-raw'));
  return JSON.parse(new TextDecoder().decode(bytes));
};
