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

/* mirrors the types.json asset layout — package declarations under virtual /node_modules paths */
registerLib(
  '/node_modules/@semantic-ui/reactivity/package.json',
  JSON.stringify({
    name: '@semantic-ui/reactivity',
    version: '0.0.0',
    types: './types/index.d.ts',
    exports: { '.': { types: './types/index.d.ts' } },
  }),
);
registerLib(
  '/node_modules/@semantic-ui/reactivity/types/index.d.ts',
  `export { Reaction, reaction } from './reaction.js';
export { signal, SignalOptions } from './signal.js';`,
);
registerLib(
  '/node_modules/@semantic-ui/reactivity/types/signal.d.ts',
  `
export interface SignalOptions<T> {
  safety?: 'clone' | 'reference' | 'none';
  equality?: (oldValue: T, newValue: T) => boolean;
  version?: number;
}
/**
 * Creates a signal.
 * @param initialValue - Starting value
 * @param options - Configuration for the signal's behavior
 */
export function signal<T>(initialValue: T, options?: SignalOptions<T>): T;
`,
);
registerLib(
  '/node_modules/@semantic-ui/reactivity/types/reaction.d.ts',
  `
export class Reaction {
  constructor(callback: (computation: Reaction) => void);
  readonly firstRun: boolean;
  stop(): void;
}
/**
 * Creates a reactive computation that re-runs when its signals change.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/reaction Reaction Documentation}
 * @param callback - Function to run reactively
 * @param options - Optional configuration
 */
export function reaction(callback: (computation: Reaction) => void, options?: { context?: Record<string, any>; firstRun?: boolean; }): Reaction;
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

  it('resolves package imports from registered declarations', () => {
    const content =
      `import { reaction } from '@semantic-ui/reactivity';\nreaction(computation => computation.firstRun);`;
    const files = [{ name: 'index.ts', content }];
    const service = createLanguageService(() => files);
    expect(service.getDiagnostics('index.ts')).toHaveLength(0);
    const hover = service.getHover('index.ts', content.indexOf('computation =>'));
    expect(hover.text).toContain('Reaction');
    service.dispose();
  });

  it('types imports in plain js files', () => {
    const content =
      `import { reaction } from '@semantic-ui/reactivity';\nreaction(computation => computation.firstRun);`;
    const files = [{ name: 'index.js', content }];
    const service = createLanguageService(() => files);
    const hover = service.getHover('index.js', content.indexOf('firstRun'));
    expect(hover.text).toContain('boolean');
    service.dispose();
  });

  it('returns completion details with signature and documentation', () => {
    const content = `import { reaction } from '@semantic-ui/reactivity';\nreac`;
    const files = [{ name: 'index.ts', content }];
    const service = createLanguageService(() => files);
    const completions = service.getCompletions('index.ts', content.length);
    expect(completions.entries.some(entry => entry.name === 'reaction')).toBe(true);
    const detail = service.getCompletionDetail('index.ts', content.length, 'reaction');
    expect(detail.text).toContain('reaction(');
    expect(detail.documentation).toContain('reactive computation');
    expect(detail.links).toEqual([{
      url: 'https://next.semantic-ui.com/docs/api/reactivity/reaction',
      label: 'Reaction Documentation',
    }]);
    service.dispose();
  });

  it('returns signature help inside a call', () => {
    const content = `import { reaction } from '@semantic-ui/reactivity';\nreaction(`;
    const files = [{ name: 'index.ts', content }];
    const service = createLanguageService(() => files);
    const help = service.getSignatureHelp('index.ts', content.length);
    expect(help.activeParameter).toBe(0);
    expect(help.signatures[0].parameters[0].label).toContain('callback');
    expect(help.signatures[0].parameters[0].documentation).toContain('run reactively');
    service.dispose();
  });

  it('expands a named options-bag parameter into a shape', () => {
    const content = `import { signal } from '@semantic-ui/reactivity';\nsignal(2, `;
    const files = [{ name: 'index.ts', content }];
    const service = createLanguageService(() => files);
    const help = service.getSignatureHelp('index.ts', content.length);
    expect(help.activeParameter).toBe(1);
    expect(help.parameterShape.name).toContain('SignalOptions');
    // T infers as the literal type of the first argument mid-call, hence oldValue: 2
    expect(help.parameterShape.properties).toEqual([
      { name: 'safety', optional: true, type: `"clone" | "reference" | "none"` },
      { name: 'equality', optional: true, type: '(oldValue: 2, newValue: 2) => boolean' },
      { name: 'version', optional: true, type: 'number' },
    ]);
    service.dispose();
  });

  it('skips shape expansion for inline literal and function parameters', () => {
    const content = `import { reaction } from '@semantic-ui/reactivity';\nreaction(() => {}, `;
    const files = [{ name: 'index.ts', content }];
    const service = createLanguageService(() => files);
    const inline = service.getSignatureHelp('index.ts', content.length);
    expect(inline.activeParameter).toBe(1);
    expect(inline.parameterShape).toBeUndefined();
    const callback = service.getSignatureHelp('index.ts', content.indexOf('() =>'));
    expect(callback.activeParameter).toBe(0);
    expect(callback.parameterShape).toBeUndefined();
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
