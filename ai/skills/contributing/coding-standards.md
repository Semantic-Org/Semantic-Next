---
title: Coding Standards — Abstractions and Code Shape
description: How to shape code authored in this repo — when behavior becomes a class, the house class anatomy, branding, registries, folder structure, naming by intent, and the hackathon patterns to avoid.
keywords: [coding standards, abstractions, class anatomy, branding, registry, naming, code shape, helpers, factory, legibility]
audience: contributing
skill: coding-standards
type: skill
---

# Coding Standards — Abstractions and Code Shape

> **Skill:** `coding-standards`
> **Purpose:** How to shape new code so it reads like this codebase — the abstractions, structures, and naming that make it defensible at 50k+ star scale

---

## The Bar

This is public open source infrastructure. Code here is read far more than it is written — by contributors, by downstream users debugging through it, and by agents learning the framework from its source. Coherence, internal consistency, and legibility matter as much as functionality. A feature that works but reads like a weekend project is half-finished.

The reference points are Vite, Svelte, and Solid. If a file would look out of place in those codebases, it is not done.

**Golden rule: find the noun.** Behavior belongs to a class that owns its state. When you catch yourself threading the same first argument through a family of functions, that argument is the class you failed to write.

---

## The Primary Failure: Hackathon Exports

The most common failure in unprompted code is a module of loose top-level functions with large argument lists, re-exported as the public surface. The signature look: five to ten flat files in `src/`, each exporting ten or twenty freestanding functions passing `a(b, c, d, e)` into `c(a, b, c)` — every function's parameters are some other function's locals. It works, it tests green, and it is the wrong shape. Agents lean to this style whenever they are not told otherwise, which is why this section exists.

This is not hypothetical — the schema package shipped this way first and had to be reshaped in review (a full public-API rewrite):

```js
// ❌ WRONG — twelve verb files, the "owner" threaded as the first argument of everything
export const validateDoc = (schema, doc, options = {}) => { ... };
export const coerceDoc = (schema, doc) => { ... };
export const applyDefaults = (schema, doc) => { ... };
export const getFieldProps = (schema, path) => { ... };
export const runComputed = (descriptor, doc, current) => { ... };
```

```js
// ✅ RIGHT — the noun owns its verbs, per-field work flows through a located handle
const Todo = schema({ title: String, done: { type: Boolean, default: false } });
Todo.validate(doc);
Todo.coerce(doc);
Todo.defaults(doc);
Todo.getField('title').validate(value);
```

The tells that you are writing the wrong shape:

- the same argument (`schema`, `config`, `state`) leads every signature
- a function takes 4+ positional arguments, several of them optional
- the barrel re-exports a dozen verbs instead of two or three nouns
- behavior for one concept is spread across sibling files named after verbs (`validate.js`, `coerce.js`, `revive.js`) instead of one file named after the noun

Free functions are still right for **pure transforms with no owned state** — the whole of `@semantic-ui/utils` is free functions, and helpers like a path lexer stay free. The test is state and cohesion: if a group of functions shares state, a lifecycle, or a threaded first argument, it is a class. If it is a stateless value-in value-out transform, it is a function.

When a function legitimately needs more than two or three inputs, the tail goes in an options object with destructured defaults, never a positional list:

```js
// ❌ WRONG
export function buildChannel(name, selector, sort, limit, live, onEnter) { ... }

// ✅ RIGHT
export function buildChannel(name, { selector, sort, limit, live = true, onEnter } = {}) { ... }
```

---

## Class Anatomy

Classes in this codebase follow one anatomy, so a reader who knows one class knows them all. The class reads top to bottom as a story about use: identity, then configuration, then creation, then the core verbs, then advanced machinery, then interop. `ReactiveObject` (reactivity), `Schema` and `Field` (schema) are the live exemplars.

```js
import { extend, isEqual } from '@semantic-ui/utils';

import { IS_CHANNEL } from './helpers/identity.js';

/*
  file-lead comment: what this is and the one or two invariants that govern it.
  short — the maintainer revoices these.
*/

export class Channel {

  // brand channel
  get [IS_CHANNEL]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_CHANNEL];
  }

  // adjustable class defaults, referenced in constructor signature defaults so
  // users can retune them globally
  static equality = isEqual;

  static defaults = {
    live: true,
  };

  constructor(options) {
    extend(this, Channel.defaults, options);
  }

  /*******************************
              Core
  *******************************/

  // primary verbs, in use order (not alphabetical)

  /*******************************
            Teardown
  *******************************/

  // stop / destroy last among the lifecycle sections
}

// the lowercase factory closes the file
export const channel = (options) => new Channel(options);
```

The ordering rules, and why:

1. **Brand first.** Identity is the first thing a reader meets (`signal.js`, `reactive-object.js`, `query.js`, `template.js` all open on the brand block). Label it with a two-word comment (`// brand channel`).
2. **Statics second.** Two kinds: adjustable class defaults (`Signal.equality`, `Schema.optional`) that constructor signatures reference so apps can retune them globally, and toolkit re-exports for one-import discovery (`Schema.getType`). The free named exports stay the tree-shakeable path — statics are convenience aliases. Static utility *methods* (finders, registries of instances) are the exception: those close the class instead, after the instance methods (`Template.findTemplate`).

   Capture the static at construction (`{ equality = Signal.equality } = {}`), don't read it live inside methods. Capture is what makes the default *per-instance overridable* — an instance can opt out through options while the class-level retune still governs everything created after. A live read gives apps only the global knob and silently changes existing instances; if that's genuinely wanted somewhere, it's a deviation to flag, not a variant to pick freely.
3. **Constructors take a primary value plus a destructured options object** with inline defaults reading the class statics: `constructor(initialValue, { equality = Signal.equality } = {})`. Never a positional multi-arg list. When the input is a whole props bag rather than value-plus-options (a descriptor object like `Field`), collapse the assignment run to `extend(this, Class.defaults, props)` with a `static defaults` carrying only the non-undefined defaults — the `.d.ts` is the per-prop reference, not 25 lines of `this.x = props.x`.
4. **Private helpers colocate with their caller**, directly after the method that uses them. No helpers pen at the bottom, and no helper functions above the class in the same file.
5. **Boxed section headers** group members by concern, title-case, methods in use order:

   ```js
   /*******************************
               Reads
   *******************************/
   ```

   Reuse the established section vocabulary where it fits — Reads / Writes / Teardown for stores, Settings, DOM Helpers, Property Configuration in component land. Small classes stay flat or use one-line `/* caption */` groups — a boxed header for two methods is noise. A class earns boxes at roughly three concerns.
6. **Internal machinery gets its own late section** (a lazy engine, a cache) rather than fields-at-top. It is an implementation chapter, not the class's face.
7. **Interop last** (Standard Schema, serialization adapters).
8. **The class file exports the noun, the lowercase factory is its door.** Newer packages co-locate the factory at the bottom of the class file (`export const schema = (fields, options) => new Schema(fields, options)`); reactivity homes its factories in `helpers/create.js`. Either way there is exactly one factory per noun, the class file never exports loose verbs, and the barrel exports both.

---

## Branding

`instanceof` via constructor identity breaks across realms and duplicated packages in a bundle. Every core object type gets a structural brand instead, and **instanceof-via-brand is the only type test** — no duck-typing, no `constructor.name` checks.

```js
// helpers/identity.js — one home per package for every brand
export const IS_SCHEMA = Symbol.for('semantic-ui/Schema');
export const IS_FIELD = Symbol.for('semantic-ui/Field');
```

```js
// on the class — the brand getter plus Symbol.hasInstance
export class Field {

  // brand field
  get [IS_FIELD]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_FIELD];
  }
}
```

`Symbol.for` keys the brand in the global symbol registry so it survives bundles and iframes. Home every brand in one `helpers/identity.js` per package — it gives circular-import pairs (Field ↔ Schema) a shared dependency-free module, and it prevents the drift that happens without it (`IS_TEMPLATE` is currently declared independently in two packages, relying on the global registry to line up).

Brands are for **public nouns that cross package or realm boundaries**. Internal machinery (`Reaction`, `Dependency`, `Behavior`) deliberately carries no brand — plain classes are fine when nothing outside the package tests their identity.

One caveat worth knowing: private-field access (`other.#method()`) brand-checks the real internal slot, not the symbol. A cross-realm instance passes `instanceof` but throws on private access — fine for `instanceof` consumers, relevant if your class walks collections of its own kind.

---

## The Registry Pattern

When named things need runtime registration — components, engines, blocks, value types, behaviors — the house shape scales with the need:

**The default: a module-scoped Map plus free-function doors.** `component-registry.js` and `engine-registry.js` are the pattern — a private `Map`, `registerComponent` / `getComponent` / `hasComponent`, no class, nothing threaded through calls. `register*` is the verb for side-effecting registration, `create*` for factories.

**The full registry class** (`TypeRegistry` is the exemplar) earns its extra weight when any of these apply:

- tests or embedders need an isolated instance (the class holds no ambient state, the singleton lives in a helpers module that exports the doors)
- entries have two names (constructor and wire name) needing dual indexes
- registration must be order-free across parties: a pending bucket lets an adapter attach to a type that hasn't registered yet
- the set must freeze once the host is configured (`seal()`) so a late registration crashes instead of quietly reshaping runtime behavior

**Duplicates are handled deliberately, never silently.** A registry of user vocabulary throws on a duplicate (a silent replace of a built-in is a footgun); an idempotent re-registration guard (`registerBehavior`) is acceptable when double-import is the realistic cause. Pick one and say why.

**Built-ins register one of two sanctioned ways:**

```js
// ✅ value-dependency list — the package stays sideEffects: false and tree-shakes
//    (schema's builtinTypes: pure value modules collected into a list the singleton consumes)
each(builtinTypes, (type) => registry.register(type));

// ✅ self-registration at module top — sanctioned ONLY with an explicit allowlist
//    in package.json: "sideEffects": ["./src/engines/*/register.js"]
registerBlock('each', eachBlock);
```

```json
// ❌ WRONG — load-time registration with "sideEffects": false, the bundler strips it
```

Prefer the value-dependency list where the built-ins are enumerable up front; use allowlisted self-registration when entries are plugin-shaped (engines, blocks) and ship with a `register.js` per entry.

---

## Package and Folder Shape

```
packages/<name>/
├── src/
│   ├── index.js          curated barrel: classes first, then helpers, grouped with section comments
│   ├── <noun>.js         one class per file, kebab-case matching the class
│   ├── helpers/          free-function modules, one concern per file (identity.js, paths.js) —
│   │                     a package with only a handful uses a flat helpers.js instead
│   ├── engines/<name>/   adapter seam: one folder per engine, the base/factory/register triplet
│   └── <catalog>/        plugin or value catalogs: one entry per file + registry + index,
│                         optionally a sample.js authoring stub (renderer blocks, schema types)
├── types/                hand-authored .d.ts — the API reference lives here, not in source comments
└── test/                 *.test.js, node:test
```

- **Flat `src/` is the default.** A concern earns a folder when it has multiple files, not before.
- **Barrels are curated, not wildcards** (utils is the one `export *` exception). Named re-exports grouped by blank lines and section comments, alphabetized within each clause. A deliberate omission gets a comment saying why (the renderer barrel documents that the Lit engine is left out as "tree-shaking poison").
- **Server/browser splits are dual entry files, not folders**: sibling `browser.js` + `server.js` barrels (no `index.js`) wired through a conditional `exports` map in package.json, with `server.js` re-exporting the browser surface plus the fs-bound extras. A substantial server half becomes its own package instead. Never fake the split with `isServer` branches scattered through shared files.
- **Cross-cutting constants get one home.** A reserved key or shared option bundle is exported once and imported everywhere (`OVERRIDES_KEY`), never retyped. Bundles that multiple call sites must agree on ship frozen (`Object.freeze`) so a new call site cannot drift.
- **`sideEffects` is honest**: `false` by default, or an explicit allowlist naming exactly the registration files (`"./src/engines/*/register.js"`).
- **Imports**: external packages first (`@semantic-ui/utils`), then local, roughly alphabetical within each group.

---

## Naming

**Name intent, not mechanism.** A mechanism name describes plumbing (`depValue`: it stores a value and uses `dependency()` underneath). An intent name describes what it is for (`computed`: this value is computed from other fields). Internal precision that requires onboarding loses to a name that is 80% right with zero teaching — this surface is read by people and agents with no training round.

The same rule renames classes: `ComputedIndex` described its data structure, `RecomputeEngine` describes its role — and everything around it already called it "the recompute engine". When docs and comments consistently use a different word than the identifier, the identifier is wrong.

**The corpus is the naming authority.** Before minting a name, search for what the codebase already calls the concept — the same verb at another layer, the vocabulary in neighboring comments, docs, and tests. Whole-corpus self-consistency is a feature of the framework: the same word means the same thing at every layer, and every new word is a cost the rest of the corpus pays. After authoring, do a naming revise pass — list every name you minted while wearing the "naming hat" and check each against the callers and patterns it should align with.

- **The established verbs**: `to*` for coercion (`toDate`), `is*` for guards, `create*` for factories (never `make*`), `register*` for side-effecting registration, `resolve*` for reconciling config/attributes to a final value, `normalize*` for canonicalizing shape.
- **No abbreviations, no single letters** in source: `callback` not `cb`, `initialValue` not `initial`, the noun not `out`. Tests can be looser.
- **Pure builders read as `<noun>From(input)`** and return the value — `entriesFrom(fields)` reads like natural language. Avoid out-param accumulators; if a walk accumulates, wrap it so the public shape is pure.
- **One term per concept, everywhere.** The same word at different scopes is uniformity, not ambiguity — but two words for one concept is a bug. House vocabulary in current use: *derive/re-derive* (computing a stored value), *release* (an override ending), *seed* (first fill), *prune* (dropping dead state), *notify* (readers told a value changed), *located/bound* (a handle with an address / with a source), *advisory/authoritative* (the gate that warns / the gate that throws).
- **Match the expression to the thought**: `value !== undefined` when the thought is "if defined", `value == null` for the absent pair, `Object.hasOwn` for map-shaped lookups, `!isObject(doc)` over hand-rolled null-and-typeof chains. If a guard needs a comment to explain itself, reach for the utils vocabulary that says it directly.

---

## Errors

Fail loud, name the offender, carry the door out. Prefix the message with the name the caller actually invoked — the function in a utility (`createCache:`), `Class.method` on an instance surface (`Signal.mutate:`), the package at a subsystem boundary (`schema:`):

```js
// ❌ WRONG
throw new Error('Invalid type');

// ✅ RIGHT — names what was called, what was wrong, and the way out
throw new TypeError(`createCache: unknown eviction strategy '${eviction}'. Use 'lru', 'fifo', or 'flush'.`);
throw new TypeError(`schema: unknown type ${name}. known types: ${known}. register a custom type with registerType`);
```

Severity maps to channel: `throw` for contract violations the caller must fix, `console.error` for broken invariants the code survives (a detected reactive cycle), `isDevelopment && console.warn` for advice (warn once per offender where the same one would spam). Production stays quiet. Sanitize-don't-reject when the mistake belongs to the author, not the writer: an undeclared field drops with a dev warn, it does not reject the write.

---

## Iteration and Loops

`each()` from utils is the default in framework-level code — it reads uniformly across arrays and objects (query and component are `each`-dominant). Native `for`/`for..of` owns two territories: the cases `each` cannot express (early `return` out of the enclosing function, index-coupled loops), and genuinely hot paths — the reactivity internals, the utils primitives, and the compiler's scanner use native loops throughout, deliberately. Pick by the file's temperature, then be consistent within it. Don't hand-roll `charCode` scans where a native primitive (`startsWith`, a small regex, `slice`) says the same thing — V8 makes those near-free.

---

## Evaluating a Design

Three lenses on every abstraction before it ships, plus one sizing rule:

1. **What is the degenerate case?** An API that silently misbehaves on the naive call (a non-computed field routed through an override verb) needs a simpler shape, not documentation.
2. **How many lines does it ship?** Prefer the structural solve (`?? identity`, an inverted enumeration) over a mechanism. A doc line beats a runtime guard.
3. **Is this complexity where simplicity exists?** If the estimate exceeds the conceptual delta, the design has helper inflation, export symmetry, or pattern-completion baked in. Structure must earn its keep — size from the constraint, not from the pattern.

And: **everything arbitrary is a setting.** A constant is either mechanical (spec-defined, derivable) or arbitrary (a judgment call two apps would make differently). Arbitrary values must be reachable from outside — a class static, an option, an `fn.config` — or every disagreeing app vendors the function. See the `design-util-function` workflow for the full treatment.

---

## Comments

Comments state intent, never mechanism, and never process. The full treatment lives in the `code-comments` skill — the two rules that shape code structure:

- a comment explaining a clunky expression is a smell: simplify the code instead
- a comment that has to argue for a guard ("which is the source of truth?") is a design smell: re-derive the constraint from intent before keeping either

---

## Quick Reference

```js
import { extend } from '@semantic-ui/utils';
import { IS_THING } from './helpers/identity.js';

export class Thing {
  // brand thing
  get [IS_THING]() { return true; }
  static [Symbol.hasInstance](value) { return !!value?.[IS_THING]; }

  static defaults = { /* non-undefined defaults only */ };

  constructor(options) {
    extend(this, Thing.defaults, options);
  }

  /**** Core ****/        // boxed sections, use order, helpers colocated
  /**** Teardown ****/
}

export const thing = (options) => new Thing(options);
```

| Smell | Fix |
|-------|-----|
| Same first arg threads through a function family | that argument is the class |
| 4+ positional args | options object with destructured defaults |
| Verb-named sibling files (`validate.js`, `coerce.js`) | one noun-named class file |
| `x instanceof Y` breaking across bundles | brand via `Symbol.for` + `Symbol.hasInstance` |
| Ambient singleton threaded through calls | registry class + helpers-module doors |
| Load-time registration side effects | value-dependency catalog list, `sideEffects: false` |
| Out-param accumulator | pure `<noun>From(input)` builder |
| Mechanism name (`depValue`, `ComputedIndex`) | intent name (`computed`, `RecomputeEngine`) |
| Comment explaining a clunky guard | utils vocabulary that says it directly |

---

## Related Skills

| Skill | Type | Use when... |
|-------|------|-------------|
| **apply-code-standards** | workflow | Cleaning up existing code against these standards |
| **code-comments** | skill | Writing or pruning source comments |
| **code-formatting** | skill | Voice, formatting, and syntax-level conventions |
| **design-util-function** | workflow | Designing a new utils function (API shape, naming, config) |
