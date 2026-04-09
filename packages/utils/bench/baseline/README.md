# Baseline Implementations

This directory holds **ephemeral** copies of pre-optimization code used for A/B benchmarking. Files here are gitignored and should be deleted after a perf pass is complete.

## When to use

Use this directory when the code being optimized is a **pure function or standalone class** that can be copied, renamed, and run alongside the optimized version in the same vitest bench process. This gives the tightest measurements — both implementations share identical JIT, thermal, and GC conditions.

If the code is deeply coupled (classes with cross-references, shared singletons), use `--compare` instead. See the `improve-performance` workflow for details.

## How to populate

```bash
# Copy from main branch
git show main:packages/utils/src/equality.js > packages/utils/bench/baseline/equality.js

# Or copy from current branch before making changes
cp packages/utils/src/equality.js packages/utils/bench/baseline/equality.js
```

Then rename exports to avoid conflicts:

```js
// baseline/equality.js
export const isEqualBaseline = (a, b, options) => { ... };
```

## How to use in bench files

```js
import { isEqual } from '../src/equality.js';
import { isEqualBaseline } from './baseline/equality.js';

describe('shallow equal — 10-key settings', () => {
  bench('baseline', () => { isEqualBaseline(settingsA, settingsB); });
  bench('optimized', () => { isEqual(settingsA, settingsB); });
});
```

## Cleanup

After confirming results, delete all files except `.gitignore` and this README:

```bash
find packages/utils/bench/baseline -type f ! -name '.gitignore' ! -name 'README.md' -delete
```
