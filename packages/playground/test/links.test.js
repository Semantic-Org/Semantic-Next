import { describe, expect, it } from 'vitest';

import { decodeProjectHash, encodeProjectHash } from '../src/links.js';

describe('project hash links', () => {
  it('round-trips a file set', async () => {
    const files = {
      'page.html': { contentType: 'text/html', content: '<html><body>hello</body></html>' },
      'page.js': { contentType: 'text/javascript', content: 'console.log("hi");' },
    };
    const encoded = await encodeProjectHash(files);
    expect(encoded).toMatch(/^[\w-]+$/);
    await expect(decodeProjectHash(encoded)).resolves.toEqual(files);
  });

  it('decodes links produced by the fflate-based docs encoder', async () => {
    // deflateSync(JSON) → base64url, captured from the docs link-encoder
    const { deflateSync, strToU8 } = await import('fflate');
    const files = { 'page.html': { content: '<h1>legacy link</h1>' } };
    const bytes = deflateSync(strToU8(JSON.stringify(files)));
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    const legacyEncoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await expect(decodeProjectHash(legacyEncoded)).resolves.toEqual(files);
  });
});
