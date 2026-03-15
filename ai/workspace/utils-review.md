# @semantic-ui/utils — Review Report

Review conducted across 20 source files and 21 test files using 5 parallel review agents, scoped by functional grouping.

---

## 1. Implementation Mistakes

### Confidence 9-10

| # | File | Line | Finding |
|---|------|------|---------|
| 1 | `types.js` | 12 | **`isPlainObject` throws on `Object.create(null)`** — no `constructor` property exists, `x.constructor === Object` throws TypeError |
| 2 | `types.js` | 113 | **`isClassInstance` throws on `Object.create(null)`** — `proto.constructor.name` throws when proto is null |
| 3 | `debug.js` | 87-118 | **`fatal`'s `onError` parameter is accepted but never called** — dead parameter, code checks `globalThis.onError` instead |
| 4 | ~~`utils.js`~~ | ~~9~~ | ~~**`export * from './errors.js'`** — file does not exist~~ — **RESOLVED: stale barrel file deleted** |

### Confidence 8

| # | File | Line | Finding |
|---|------|------|---------|
| 5 | `types.js` | 62 | **`isDOM` returns `true` for ANY input in SSR** — when `typeof window === 'undefined'`, returns `true` unconditionally |
| 6 | `arrays.js` | — | **`range` treats `stop=0` as absent** — `if (!stop)` is truthy for `0`, so `range(5, 0)` returns `[0,1,2,3,4]` instead of `[]` |
| 7 | `strings.js` | — | **`toTitleCase` doesn't capitalize the last word** — standard title case rules say the last word should always be capitalized regardless of stopword status |
| 8 | `css.js` | 107-115 | **`extractCSS` strips `@media`/`@supports` wrappers** — nested rules extracted without their at-rule context, changing semantics |
| 9 | `environment.js` | 66-68 | **`__DEV__` check ignores the value** — `typeof __DEV__ !== 'undefined'` is true even when `__DEV__ === false` (React Native production) |
| 10 | `browser.js` | 11-21 | **`openLink` calls `preventDefault()` after navigation** — should come before `window.location.href =` |

### Confidence 7

| # | File | Line | Finding |
|---|------|------|---------|
| 11 | `numbers.js` | 8,19 | **`== 0` loose equality** — coerces `''`, `false`, `null` to `0`, bypassing the `isNumber` guard below |
| 12 | `objects.js` | 220 | **`proxyObject` uses `\|\|` fallback** — suppresses falsy values (`0`, `""`, `false`) from the reference object |
| 13 | `functions.js` | 119-146 | **`debounce`/`throttle` `cleanupListener` removes abort handler after first invocation** — subsequent calls can't be aborted |
| 14 | `dates.js` | — | **EST/PST not in shorthand map** — only `ET`/`PT` exist; tests previously passed by accident because V8 accepts them as raw Intl timezone IDs (now fixed in tests) |
| 15 | `css.js` | 129 | **`scopeStyles` lowercases the scope selector** — `.MyComponent` becomes `.mycomponent`, breaking case-sensitive CSS matching |
| 16 | `css.js` | 107 | **`extractCSS` only descends one nesting level** — `@media` inside `@layer` etc. are missed |

### Confidence 6

| # | File | Line | Finding |
|---|------|------|---------|
| 17 | `functions.js` | 23 | **`memoize` default hash conflates `undefined` and `null`** — `JSON.stringify([undefined])` === `JSON.stringify([null])` === `"[null]"` |
| 18 | `strings.js` | — | **`escapeHTML(null)` returns `null`** — inconsistent with `truncate` which returns `''` for falsy input |
| 19 | `debug.js` | 53,76 | **`log` `data` parameter silently dropped for non-array-like objects** — `data?.length` is undefined for `{key: val}` |
| 20 | `css.js` | 160 | **`scopeStyles` uses `==` instead of `===`** for `rule.type` comparison |

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

### Still Present (not addressed)

| # | File | Finding |
|---|------|---------|
| 1 | `colors.test.js:28-34` | oklch expectations recorded from implementation output, not verified against CSS Color Level 4 reference (commented) |
| 2 | `dates.test.js` | No tests for the shorthand timezone feature's full map (only ET/PT tested) |
| 3 | `equality.test.js` | Set equality tests only use primitives, hiding reference-equality limitation for objects (commented) |
| 4 | `css.test.js:289` | Nested rule extraction doesn't verify `@media` wrapper is preserved (it isn't — implementation bug) |
| 5 | `css.test.js:477-481` | `scopeStyles` multiple-selector test doesn't verify each selector is individually scoped |

---

## 3. Performance Improvements

### High Impact (hot paths)

| # | File | Finding |
|---|------|---------|
| 1 | `dates.js` | **`reverseKeys(shorthand)` rebuilt on every `formatDate` call** — static data, should be module-level constant |
| 2 | `crypto.js` | **`new TextEncoder()` on every `hashCode` call** — used by `adoptStylesheet` for every component's CSS |
| 3 | `strings.js` | **`escapeHTML`/`unescapeHTML` re-create lookup objects + compile regex every call** — per-render hot path in a UI framework |
| 4 | `browser.js` | **`specialKeys` object allocated on every `getKeyFromEvent` call** — fires on every keypress |
| 5 | `objects.js` | **`weightedObjectSearch` creates `new RegExp(word, 'i')` per word per field per object** — should precompile once |
| 6 | `strings.js` | **`Intl.Segmenter` constructed fresh on every `truncate`/`reverseString` call** — expensive constructor, cache by locale |
| 7 | `functions.js` | **`memoize` default hash runs `JSON.stringify` + `hashCode` (with TextEncoder) on every call including hits** |

### Medium Impact

| # | File | Finding |
|---|------|---------|
| 8 | `types.js` | **`isBinary`: 11 `instanceof` checks → `ArrayBuffer.isView(x) \|\| x instanceof ArrayBuffer`** — single native call |
| 9 | `types.js` | **`isClassInstance` allocates `builtInTypes` array on every call** — hoist to module-scope `Set` |
| 10 | `cloning.js` | **`{ ...options, seen }` allocates a new object per recursive call** — pass `seen` as direct parameter |
| 11 | `strings.js` | **`capitalizeWords` runs 3 regex passes where 1 suffices** |
| 12 | `strings.js` | **`toTitleCase` re-creates `stopWords` array per call** — should be module-level `Set` |
| 13 | `equality.js` | **Map equality iterates entries twice; object equality iterates keys three times** |
| 14 | `arrays.js` | **`sortBy` uses `each()` inside the sort comparator** — `each` has dispatch overhead, use plain `for` loop |
| 15 | `colors.js` | **Regex + `clamp01`/`applyGamma` closures allocated inside `oklchToRgb` per call** |
| 16 | `dates.js` | **Format regex compiled on every `formatDate` call** — fixed pattern, hoist to module scope |

---

## 4. Structural Issues

- ~~**`utils.js` vs `index.js` barrel drift**~~ — **RESOLVED: deleted stale `utils.js` barrel and orphaned `meta.json` build artifact**
- **`equality.js` `isEqual` accepts `options` parameter that is never read or forwarded**
- **`arrays.js` `range` semantics diverge from every known `range` implementation** — `step` doesn't affect length, produces values past `stop`
