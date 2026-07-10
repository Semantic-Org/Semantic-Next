import { fromBase64, toBase64 } from '@semantic-ui/utils';
import { deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate';

/*
  Share-link encoding — the whole project travels in the URL hash, so links work
  with no storage backend. Format: URL-safe base64 of raw-deflated JSON.

  fflate on purpose: Safari's native CompressionStream('deflate-raw') has been
  observed emitting corrupt streams (bad back-references), so the codec stays
  deterministic across engines. Async signatures are kept for API stability.
*/

export const encodeProjectHash = async (files) => {
  const compressed = deflateSync(strToU8(JSON.stringify(files)));
  return toBase64(compressed, { urlSafe: true });
};

export const decodeProjectHash = async (encoded) => {
  const compressed = fromBase64(encoded, { as: 'bytes' });
  if (!compressed) {
    throw new Error('Malformed project hash');
  }
  return JSON.parse(strFromU8(inflateSync(compressed)));
};
