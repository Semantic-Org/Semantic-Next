import { describe, expect, it } from 'vitest';

import { createLanguageService, registerLib, transpile } from '../src/worker/typescript-service.js';

registerLib(
  '/lib/lib.d.ts',
  `
declare var console: { log(message: unknown): void };
interface Number { toFixed(digits?: number): string; }
interface String {}
interface Boolean {}
interface Object {}
interface Function {}
interface Array<T> { length: number; }
interface RegExp {}
interface IArguments {}
`,
);

describe('transpile', () => {
  it('strips types and reports syntax diagnostics', () => {
    const result = transpile(`const n: number = 1;`, 'index.ts');
    expect(result.code).toContain('const n = 1');
    expect(result.diagnostics).toHaveLength(0);
  });
});

describe('createLanguageService', () => {
  it('resolves globals from the registered default lib', () => {
    const files = [{ name: 'index.ts', content: `const n: number = 1;\nconsole.log(n.toFixed(2));` }];
    const service = createLanguageService(() => files);
    const diagnostics = service.getDiagnostics('index.ts');
    expect(diagnostics).toHaveLength(0);
    service.dispose();
  });

  it('completes symbols after a whole-project reset outranks per-file pins', () => {
    let files = [{ name: 'index.ts', content: `const alphaValue = 1;\nalp` }];
    const service = createLanguageService(() => files);
    service.bumpVersion('index.ts');
    let completions = service.getCompletions('index.ts', files[0].content.length);
    expect(completions.entries.some(entry => entry.name === 'alphaValue')).toBe(true);

    files = [{ name: 'index.ts', content: `const betaValue = 2;\nbet` }];
    service.bumpVersion();
    completions = service.getCompletions('index.ts', files[0].content.length);
    expect(completions.entries.some(entry => entry.name === 'betaValue')).toBe(true);
    service.dispose();
  });
});
