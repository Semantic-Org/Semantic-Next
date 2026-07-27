import { describe, expect, it } from 'vitest';

import { completionSource } from '../src/editor/intelligence.js';

/* emulates CM's matchBefore: a regex match ending exactly at the cursor */
const makeContext = ({ text, pos, explicit = false }) => ({
  pos,
  explicit,
  aborted: false,
  matchBefore(regex) {
    const slice = text.slice(0, pos);
    const match = slice.match(new RegExp(`(?:${regex.source})$`));
    return match ? { from: pos - match[0].length, to: pos, text: match[0] } : null;
  },
});

describe('completionSource', () => {
  const provider = async () => ({
    entries: [
      { name: 'safety', kind: 'property', sortText: '11' },
      { name: 'version', kind: 'property', sortText: '12' },
      { name: 'count', kind: 'const', sortText: '15' },
    ],
  });

  it('fires on an object literal opened in argument position, members only', async () => {
    const source = completionSource({ provider, fileName: 'index.js' });
    const text = 'signal(2, {';
    const result = await source(makeContext({ text, pos: text.length }));
    expect(result.options.map(option => option.label)).toEqual(['safety', 'version']);
  });

  it('keeps scope symbols once typing starts', async () => {
    const source = completionSource({ provider, fileName: 'index.js' });
    const text = 'signal(2, { c';
    const result = await source(makeContext({ text, pos: text.length }));
    expect(result.options.map(option => option.label)).toContain('count');
  });

  it('stays quiet after a block brace', async () => {
    const source = completionSource({ provider, fileName: 'index.js' });
    const text = 'if (x) {';
    const result = await source(makeContext({ text, pos: text.length }));
    expect(result).toBeNull();
  });
});
