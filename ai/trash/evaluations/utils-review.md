# @semantic-ui/utils — Review Report

Review conducted across 20 source files and 21 test files using 5 parallel review agents, scoped by functional grouping.

---

## 1. Implementation Mistakes

### Confidence 9-10

| # | File | Finding | Status |
|---|------|---------|--------|
| 1 | `types.js` | **`isPlainObject` throws on `Object.create(null)`** | **FIXED** — uses `Object.getPrototypeOf` + proto check |
| 2 | `types.js` | **`isClassInstance` throws on `Object.create(null)`** | **FIXED** — optional chaining + `!constructorName` guard |
| 3 | `debug.js` | **`fatal`'s `onError` parameter never called** | **FIXED** — wired up as interception (call + return, prevents throw) |
| 4 | ~~`utils.js`~~ | ~~`export * from './errors.js'`~~ | **RESOLVED** — stale barrel file deleted |

### Confidence 8

| # | File | Finding | Status |
|---|------|---------|--------|
| 5 | `types.js` | **`isDOM` returns `true` for ANY input in SSR** | **INTENTIONAL** — SSR optimistically assumes DOM so code paths don't bail out |
| 6 | `arrays.js` | **`range` treats `stop=0` as absent** | **FIXED** — `!stop` → `stop === undefined`; also rewrote `range` with V8-optimized fast paths and added new `sequence` function |
| 7 | `strings.js` | **`toTitleCase` doesn't capitalize the last word** | **FIXED** — added `index === arr.length - 1` check |
| 8 | `css.js` | **`extractCSS` strips `@media`/`@supports` wrappers** | **FIXED** — recursive `extractFromRules` preserves at-rule wrappers, handles arbitrary nesting depth, passes through nested style rules as-is |
| 9 | `environment.js` | **`__DEV__` check ignores the value** | **FIXED** — added `&& __DEV__`; also fixed `env.MODE` (now checks `=== 'development'` not `!== 'production'`) and removed dead `env.CI === true` check |
| 10 | `browser.js` | **`openLink` calls `preventDefault()` after navigation** | Not yet addressed |

### Confidence 7

| # | File | Finding | Status |
|---|------|---------|--------|
| 11 | `numbers.js` | **`== 0` loose equality** | **FIXED** — `=== 0` |
| 12 | `objects.js` | **`proxyObject` uses `\|\|` fallback** | **FIXED** — `??` |
| 13 | `functions.js` | **`debounce`/`throttle` `cleanupListener` removes abort handler after first invocation** | Not yet addressed |
| 14 | `dates.js` | **EST/PST not in shorthand map** | **FIXED** — tests updated to use actual shorthand keys `ET`/`PT` |
| 15 | `css.js` | **`scopeStyles` lowercases the scope selector** | Not yet addressed |
| 16 | `css.js` | **`extractCSS` only descends one nesting level** | **FIXED** — recursive approach (same fix as #8) |

### Confidence 6

| # | File | Finding | Status |
|---|------|---------|--------|
| 17 | `functions.js` | **`memoize` default hash conflates `undefined` and `null`** | Not yet addressed |
| 18 | `strings.js` | **`escapeHTML(null)` returns `null`** | Not yet addressed |
| 19 | `debug.js` | **`log` `data` parameter silently dropped for non-array-like objects** | Not yet addressed |
| 20 | `css.js` | **`scopeStyles` uses `==` instead of `===`** | Not yet addressed |

---

## 2. Reward-Hacking Tests

### Fixed (in this review)

| # | File | Fix |
|---|------|-----|
| 1 | `functions.test.js:7` | `noop` test renamed to "identity function" with real assertions (`noop(42) === 42`) |
| 2 | `regexp.test.js:7-11` | `escapeRegExp` now verifies escaped pattern matches literal input |
| 3 | `browser.test.js:58-78` | Collapsed 4 tautological `getIPAddress` Node tests into 2 honestly-named ones |
| 4 | `string.test.js:156-158` | `wordBoundary: false` now uses input where cut falls mid-word |
| 5 | `functions.test.js:563-577` | Context preservation test now has real assertions |
| 6 | `objects.test.js:504-513` | `deepExtend` `__proto__` uses `JSON.parse` to create real own property |
| 7 | `arrays.test.js:323-330` | `moveItem` tests use fresh arrays instead of chaining mutations |
| 8 | `crypto.test.js:58-61` | `hashCode` consistency pinned to actual value `1884887178` |
| 9 | `crypto.test.js:93-116` | Robustness tests now assert `typeof result === 'number'` |
| 10 | `dates.test.js:177-178` | Timezone tests changed from V8-specific `EST`/`PST` to actual shorthand keys `ET`/`PT` |
| 11 | `browser/browser.test.js:64` | Added `expect.assertions(1)` to invalid type test |
| 12 | `browser/css.test.js:289` | Nested rule extraction verifies selector in extracted CSS |
| 13 | `renderer/helpers.test.js:381` | `escapeHTML` expected value was missing semicolons in HTML entities |

### Still Present (not addressed)

| # | File | Finding |
|---|------|---------|
| 1 | `colors.test.js:28-34` | oklch expectations recorded from implementation output, not verified against CSS Color Level 4 reference (commented) |
| 2 | `dates.test.js` | No tests for the shorthand timezone feature's full map (only ET/PT tested) |
| 3 | `equality.test.js` | Set equality tests only use primitives, hiding reference-equality limitation for objects (commented) |
| 4 | `css.test.js:289` | Nested rule extraction doesn't verify `@media` wrapper is preserved (implementation now fixed, test should be updated) |
| 5 | `css.test.js:477-481` | `scopeStyles` multiple-selector test doesn't verify each selector is individually scoped |

---

## 3. Performance Improvements

### High Impact (hot paths)

| # | File | Finding | Status |
|---|------|---------|--------|
| 1 | `dates.js` | **`reverseKeys(shorthand)` rebuilt on every `formatDate` call** | **FIXED** — `timezoneShorthand` at module scope |
| 2 | `crypto.js` | **`new TextEncoder()` on every `hashCode` call** | **FIXED** — `encoder` singleton at module scope |
| 3 | `strings.js` | **`escapeHTML`/`unescapeHTML` re-create lookup objects + compile regex every call** | **FIXED** — all hoisted above their functions |
| 4 | `browser.js` | **`specialKeys` object allocated on every `getKeyFromEvent` call** | **FIXED** — hoisted above function |
| 5 | `objects.js` | **`weightedObjectSearch` creates `new RegExp(word, 'i')` per word per field per object** | Not yet addressed |
| 6 | `strings.js` | **`Intl.Segmenter` constructed fresh on every `truncate`/`reverseString` call** | Not yet addressed |
| 7 | `functions.js` | **`memoize` default hash runs `JSON.stringify` + `hashCode` (with TextEncoder) on every call including hits** | Not yet addressed |

### Medium Impact

| # | File | Finding | Status |
|---|------|---------|--------|
| 8 | `types.js` | **`isBinary`: 11 `instanceof` checks → `ArrayBuffer.isView(x)`** | Not yet addressed |
| 9 | `types.js` | **`isClassInstance` allocates `builtInTypes` array on every call** | **FIXED** — module-level `Set` |
| 10 | `cloning.js` | **`{ ...options, seen }` allocates per recursive call** | Not yet addressed |
| 11 | `strings.js` | **`capitalizeWords` runs 3 regex passes where 1 suffices** | Not yet addressed |
| 12 | `strings.js` | **`toTitleCase` re-creates `stopWords` array per call** | **FIXED** — module-level `Set` |
| 13 | `equality.js` | **Map equality iterates entries twice; object equality iterates keys three times** | Not yet addressed |
| 14 | `arrays.js` | **`sortBy` uses `each()` inside the sort comparator** | Not yet addressed |
| 15 | `colors.js` | **Regex + `clamp01`/`applyGamma` closures allocated inside `oklchToRgb` per call** | **FIXED** — all hoisted above function |
| 16 | `dates.js` | **Format regex compiled on every `formatDate` call** | **FIXED** — `formatTokenRegExp` at module scope |

---

## 4. Structural Issues

- ~~**`utils.js` vs `index.js` barrel drift**~~ — **RESOLVED: deleted stale `utils.js` barrel and orphaned `meta.json` build artifact**
- **`equality.js` `isEqual` accepts `options` parameter that is never read or forwarded** — not yet addressed
- ~~**`arrays.js` `range` semantics diverge from every known `range` implementation**~~ — **RESOLVED: `range` rewritten with standard semantics + V8 fast paths; old behavior extracted to new `sequence` function**

---

## 5. New Work

### `range` rewrite
- Standard `range(start, stop, step)` semantics (exclusive stop)
- V8-optimized: fast path for single-arg, integer/fractional bifurcation, pre-allocated arrays, step=0 guard
- All existing call sites verified compatible

### `sequence` (new function)
- `sequence(count, interval = 1, start = 1)` — generates multiples
- Designed via `design-util-function` workflow: usage elicitation → naming → implementation
- `count | 0` guard for NaN/float truncation
- Exported from arrays.js, added to template helpers

### `design-util-function` workflow
- New contributing workflow at `ai/workflows/contributing/design-util-function.md`
- 5-step process: Intent → Usage elicitation → Naming → Implementation → Validate
- Uses isolated subagents at each step to avoid leading the witness
- Targets V8 internals, frontend scale, first-principles API design
