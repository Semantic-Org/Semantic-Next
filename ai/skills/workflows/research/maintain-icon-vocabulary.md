---
title: Maintain Icon Vocabulary
description: Step-by-step workflows for refreshing the canonical icon vocabulary in mappings.js when an upstream library updates, renames icons, or when adding a sixth library.
keywords: [icons, mappings, lucide, phosphor, tabler, material symbols, heroicons, maintenance, library update, library rename, add library]
audience: contributing
type: workflow
workflow: maintain-icon-vocabulary
---

# Maintain Icon Vocabulary

> **Workflow:** `maintain-icon-vocabulary`
> **Purpose:** Concrete steps for the three maintenance scenarios. Read `icon-vocabulary` first for system context.

**Source of truth:** `packages/specs/src/icons/mappings.js`. Every script in `ai/research/icons/icon-mappings/` mutates this file. After any mutation, regenerate runtime artifacts:

```bash
cd packages/specs && npm run build:icons
```

This regenerates `icons.meta.js`, the five `{lib}.css` files, and the SVG mirrors. Don't skip it — the runtime depends on the generated files, not on `mappings.js` directly.

---

## Scenario A — New icons in upstream Lucide

When Lucide releases a new version with new primaries, add the ones that pass the semantic name test.

1. **Bump the dependency** in `packages/specs/package.json`:
   ```
   "lucide-static": "^X.Y.Z"
   ```
2. **Refresh** `ai/research/icons/icon-mappings/lucide-primary-icons.csv` from Lucide upstream. (No automated source; copy the catalog manually.)
3. **Selection** — run the curation methodology in `selection-process.md` against the new primaries. Two passes (exhaustive + editorial) plus an audit. Append accepted entries to `ai/research/icons/final-list.txt`.
4. **Document the judgments** — append addition rationale to `expansion-review.md` so future readers can defend the inclusion.
5. **Add entries to `mappings.js`** with empty library fields:
   ```js
   'new-icon': {
     category: 'action',
     aliases: [],
     description: '...',
     visual: '...',
     usage: '...',
     lucide: '',
     phosphor: '',
     tabler: '',
     materialSymbols: '',
     heroicons: '',
   },
   ```
6. **Cross-library lookup** — for each library, run a subagent against the library's icon catalog to fill `_{lib}-{A..E}.json` for the new entries. See `rebuild-plan.md` Pass 2.
7. **Merge** — fills the empty fields:
   ```bash
   node ai/research/icons/icon-mappings/merge-mappings.mjs
   ```
8. **Aliases** — add by hand or with a Pass 3 subagent batch.
9. **Build** — `cd packages/specs && npm run build:icons`.

## Scenario B — Upstream library renames icons

When Phosphor (or any library) renames N icons, the `phosphor:` field on those entries goes stale.

1. **Bump the dependency** in `packages/specs/package.json`.
2. **Update the per-library batches** — edit `_phosphor-{A..E}.json` to reflect the new names for affected entries.
3. **Merge in update mode** — overwrites stale values:
   ```bash
   node ai/research/icons/icon-mappings/merge-mappings.mjs --library phosphor --update
   ```
4. **Build** — `cd packages/specs && npm run build:icons`.

`build-icon-svg.js` is additive and does not prune stale SVGs; if the renamed icons leave orphans in `src/primitives/icon/sets/phosphor/svg/`, remove them by hand.

## Scenario C — Add a sixth icon library

When introducing a new library (e.g. Bootstrap Icons), every entry needs a new column and a sixth set CSS file is generated.

1. **Add the dependency** in `packages/specs/package.json`.
2. **Extend the build scripts** — add the library to:
   - `packages/specs/scripts/build-icon-css.js` `libraries` table
   - `packages/specs/scripts/build-icon-svg.js` `libraries` table (with `pkg` and `svgPath`)
   - `tools/mcp/src/server.ts` `ICON_LIBRARIES` and `LIB_DISPLAY` constants
3. **Extend the merge script** — add the new library to `libraryFields` in `ai/research/icons/icon-mappings/merge-mappings.mjs`.
4. **Add the field to every entry in `mappings.js`** — bulk-add `bootstrapIcons: ''` (or null where no equivalent exists) to all 481 entries. Script this; do not edit by hand.
5. **Cross-library research** — subagent fan-out per `rebuild-plan.md` Pass 2 to produce `_bootstrap-icons-{A..E}.json` covering all 481 canonicals.
6. **Merge** — `node ai/research/icons/icon-mappings/merge-mappings.mjs --library bootstrapIcons`.
7. **Sets directory** — `mkdir src/primitives/icon/sets/bootstrap-icons` (the build will populate `bootstrap-icons.css` and `svg/`).
8. **Document** — add a row to `src/primitives/icon/sets/README.md`.
9. **Build** — `cd packages/specs && npm run build:icons`.

## Scenario D — Promote an alias to canonical

When a frequently-typed alias outweighs its current canonical (the descriptivist call):

1. **Add a promotion entry** to a new JSON file (or extend an existing pass5 file):
   ```json
   {
     "promotions": [
       {
         "old": "current-canonical",
         "new": "what-people-reach-for",
         "reason": "...",
         "family_renames": { "current-canonical-plus": "what-people-reach-for-plus" }
       }
     ]
   }
   ```
2. **Apply** — renames the canonical key, pushes the old name into the new entry's aliases, and renames family members:
   ```bash
   node ai/research/icons/icon-mappings/apply-promotions.mjs path/to/your-promotions.json
   ```
3. **Document the judgment** — append to `expansion-review.md` or a new judgment file. Promotions are a permanent rename; the descriptivist record matters.
4. **Build** — `cd packages/specs && npm run build:icons`.

## Quick reference

```bash
# Fill new empty library fields after adding entries
node ai/research/icons/icon-mappings/merge-mappings.mjs

# Refresh one library's stale values
node ai/research/icons/icon-mappings/merge-mappings.mjs --library phosphor --update

# Apply a promotion table
node ai/research/icons/icon-mappings/apply-promotions.mjs ai/research/icons/icon-mappings/pass5-promotions.json

# Always finish with
cd packages/specs && npm run build:icons
```

## Related Skills

| Skill | Use when |
|---|---|
| **Icon Vocabulary** (`icon-vocabulary`) | Understanding why the vocabulary was chosen the way it was, before maintaining it |
| **Authoring AI Context** (`ai-author-context`) | Writing or maintaining content under `ai/skills/` |
