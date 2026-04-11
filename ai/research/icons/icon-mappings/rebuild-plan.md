# Plan: Rebuild Icon Mappings from Lucide Final List

## Context

We're on `feat/icon-sets`, rebuilding `packages/specs/src/icons/mappings.js` from scratch. The old mappings (306 semantic names) are being replaced by a new system driven by the curated 482-icon Lucide list (`ai/research/icons/final-list.txt`). The approach: Lucide icon names become the canonical semantic names (with a small rename table for artifacts), then other libraries and aliases are layered on.

`mappings.js` is the source of truth — `icons.meta.js` is a build artifact generated from it.

## Pass 1: Literal Lucide Mapping

**Goal:** Generate new `mappings.js` with 482 entries. Lucide names are the canonical names. Other libraries null.

**Rename table** (artifact names → canonical):
- `trash-2` → `trash`, `building-2` → `building`, `maximize-2` → `maximize`, `minimize-2` → `minimize`
- `redo-2` → `redo`, `undo-2` → `undo`, `laptop-minimal` → `laptop`, `tv-minimal` → `tv`
- `fingerprint-pattern` → `fingerprint`, `receipt-text` → `receipt`
- `volume-1` → `volume-low` (numbered level is meaningless)

**Needs assignment:** category + one-line description per icon.

**Approach:** Script reads `final-list.txt`, applies rename table, splits into ~5 batches. Each batch goes to a subagent that assigns category (from existing category list in `index.js`) and writes a short description. Output: JSON fragments `_pass1-{A-E}.json`.

A merge script combines fragments → writes `mappings.js` with format:
```js
'icon-name': {
  category: 'category',
  aliases: [],
  description: 'Description',
  lucide: 'original-lucide-name',
  phosphor: null,
  tabler: null,
  materialSymbols: null,
  heroicons: null,
}
```

**Key files:**
- Input: `ai/research/icons/final-list.txt`
- Input: `packages/specs/src/icons/index.js` (category list)
- Input: `ai/research/icons/icon-mappings/lucide-primary-icons.csv` (tags for context)
- Output: `packages/specs/src/icons/mappings.js`

## Pass 2: Other Libraries

**Goal:** Fill in phosphor, tabler, materialSymbols, heroicons for each of the ~482 semantic names.

**Existing research:** `ai/research/icons/icon-mappings/_heroicons-{A-E}.json` etc. covers 288 OLD semantic names. Many new names won't have matches.

**Approach:** For each library, split the ~482 semantic names into batches. Each subagent gets:
- The batch of semantic names + their Lucide icon + description
- The library's full icon list (need to source these — may need CSVs or directory listings from node_modules)
- Any existing research matches as hints

Output: `_pass2-{library}-{A-E}.json` with format `{ "semantic-name": { "value": "lib-icon-name", "reason": "..." } }`

A merge script patches these into mappings.js. Icons with no match in a library get `null`.

**Key files:**
- Input: `mappings.js` from Pass 1
- Input: `ai/research/icons/icon-mappings/_*-{A-E}.json` (existing research as hints)
- Output: Updated `mappings.js`

## Pass 3: Aliases

**Goal:** Generate aliases for each icon — the names developers/agents would actually reach for.

**Approach:** Split ~482 icons into batches. Each subagent gets:
- The icon's canonical name, Lucide name, description, category
- The icon's names across ALL libraries (from Pass 2) — cross-library naming is signal
- Instructions: generate aliases that are common synonyms, action-oriented names, or legacy names developers expect

Output: `_pass3-aliases-{A-E}.json` with format `{ "canonical-name": ["alias1", "alias2"] }`

## Pass 4: Dedupe Aliases

**Goal:** Ensure no alias maps to more than one canonical icon.

**Approach:** Automated script (no agents needed). Merge all alias JSONs, detect collisions, resolve by picking the most natural owner. Flag ambiguous cases for human review.

Output: Clean alias map, collision report if any.

## Pass 5: Promote

**Goal:** Review aliases and decide if any should replace the canonical name.

**Test:** If the alias is what 90%+ of developers would reach for and the Lucide name is just a glyph description, promote it.

Examples that might promote:
- `circle-user` → `avatar`
- `chevrons-down-up` → `collapse`

**Approach:** Single agent reviews the full alias map + all library names. Outputs a small promotion table. Human reviews and approves.

Final script applies promotions: old canonical becomes an alias, alias becomes canonical.

## Verification

1. Count: `mappings.js` should have ~482 entries
2. Every Lucide icon in `final-list.txt` appears exactly once as a `lucide:` value
3. No alias points to two different canonical names
4. `npm run build` in `packages/specs` succeeds (generates `icons.meta.js`)
5. Spot-check: common names like `delete`, `search`, `edit`, `settings` resolve correctly

## Critical Files

- `ai/research/icons/final-list.txt` — the 482 Lucide icons (source of truth)
- `packages/specs/src/icons/mappings.js` — output target
- `packages/specs/src/icons/index.js` — category list
- `packages/specs/scripts/build-icon-meta.js` — generates icons.meta.js from mappings
- `ai/research/icons/icon-mappings/` — existing cross-library research (288 old names)
- `ai/research/icons/icon-mappings/lucide-primary-icons.csv` — Lucide icon tags
