import { fromBase64, toBase64 } from '@semantic-ui/utils';

/*
  Share-link encoding — the whole project travels in the URL hash, so links work
  with no storage backend. Format: URL-safe base64 of raw-deflated JSON, byte-
  compatible with links produced by the docs site's fflate-based encoder.
*/

const pipeThrough = async (bytes, transform) => {
  const stream = new Blob([bytes]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

export const encodeProjectHash = async (files) => {
  const bytes = new TextEncoder().encode(JSON.stringify(files));
  const compressed = await pipeThrough(bytes, new CompressionStream('deflate-raw'));
  return toBase64(compressed, { urlSafe: true });
};

export const decodeProjectHash = async (encoded) => {
  const compressed = fromBase64(encoded, { as: 'bytes' });
  if (!compressed) {
    throw new Error('Malformed project hash');
  }
  const bytes = await pipeThrough(compressed, new DecompressionStream('deflate-raw'));
  return JSON.parse(new TextDecoder().decode(bytes));
};
