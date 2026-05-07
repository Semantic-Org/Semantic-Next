# Icon-Mapping Pipeline Methodology

The pipeline that fills `packages/specs/src/icons/mappings.js`. Each canonical entry carries `category`, `description`, `aliases`, `visual`, `usage`, and the per-library names (`lucide`, `phosphor`, `tabler`, `materialSymbols`, `heroicons`). This document describes how each field is produced.

`mappings.js` is the source of truth — `icons.meta.js` and the per-library set CSS files are build artifacts generated from it.

## Pass 1: Roster, Category, Description

**Goal:** Establish the canonical name set with category and one-line description.

**Inputs:**
- `ai/research/icons/canonical-roster.txt` — the converged Lucide-based vocabulary
- `ai/research/icons/renames.csv` — artifact-name → canonical rename rules (`trash-2 → trash`, `building-2 → building`, etc.)
- `pipeline/lucide-primary-icons.csv` — Lucide upstream tags used as semantic context
- `packages/specs/src/icons/categories.js` — category list

**Approach:** Split the roster into batches; each batch goes to a subagent that assigns category and writes a short description per icon.

**Output:** `pipeline/classification.json` with format `{ "icon-name": { "category": "...", "description": "..." } }`. Merged into `mappings.js` by hand or by a one-off script — Pass 1 is run once per major roster expansion.

## Pass 2: Cross-Library Lookup

**Goal:** For each canonical name, fill the `phosphor`, `tabler`, `materialSymbols`, and `heroicons` fields with the matching native names.

**Inputs:**
- `mappings.js` (Pass 1 state, with empty library fields)
- Each library's full icon list, sourced from its npm package
- `pipeline/{library}.json` — prior cross-library research used as hints

**Approach:** For each library, run a subagent against the canonical names and the library's catalog. The subagent picks the best library-native match per canonical (or `null` if no equivalent exists), with a one-line `reason`.

**Output:** `pipeline/{library}.json` with format `{ "icon-name": { "value": "library-native-name", "reason": "..." } }`. Merged into `mappings.js` by `pipeline/merge-mappings.mjs`.

## Pass 3: Aliases

**Goal:** Generate aliases per canonical — the names developers/agents reach for.

**Inputs:**
- The canonical name, its Lucide name, description, category
- All library-native names (cross-library naming is signal — common names across libraries become aliases)

**Approach:** Subagent fan-out generates aliases that are common synonyms, action-oriented intent names, or shorthand.

**Output:** `pipeline/aliases.json` with format `{ "canonical-name": ["alias1", "alias2"] }`. Merged into the `aliases` field of each entry in `mappings.js`.

## Pass 4: Dedupe Aliases

**Goal:** Ensure no alias maps to more than one canonical.

**Approach:** Deterministic — merge all alias entries, detect collisions, resolve by picking the most natural owner. Result is the set of `aliases` arrays in `mappings.js`.

## Pass 5: Promotion

**Goal:** Rename a canonical when its alias is what developers actually reach for.

**Test:** If the alias is what 90%+ of developers reach for and the Lucide name is just a glyph description, promote it. The artifact name becomes the alias.

Worked examples (recorded in `pipeline/promotions.json` and applied by `pipeline/apply-promotions.mjs`):
- `house → home`, `circle-user → avatar`, `triangle-alert → warning`
- `square-arrow-out-up-right → external-link`, `circle-question-mark → help`
- `key-round → key`, `rectangle-ellipsis → password`

`apply-promotions.mjs` renames the canonical key in `mappings.js`, pushes the old name into the new entry's aliases, and applies any `family_renames` (e.g. `message-circle-more → chat-more` when `message-circle → chat`).

## Verification

1. Every name in `canonical-roster.txt` appears as a key (or alias) in `mappings.js`.
2. No alias points to two different canonical names.
3. `cd packages/specs && npm run build:icons` succeeds and regenerates `icons.meta.js` plus the five `{lib}.css` files.
4. Spot-check: common names like `delete`, `search`, `edit`, `settings` resolve correctly via `<ui-icon name>`.

## Files in this directory

- `methodology.md` — this file
- `lucide-primary-icons.csv` — Lucide upstream tags (Pass 1 input)
- `{lucide,phosphor,tabler,material,heroicons}.json` — Pass 2 cross-library lookup with rationale
- `classification.json` — Pass 1 worked example (category + description per entry)
- `aliases.json` — Pass 3 worked example (alias generation per entry)
- `promotions.json`, `promotions-followup.json` — Pass 5 promotion tables (applied)
- `merge-mappings.mjs` — fills empty library fields in `mappings.js` from `{library}.json`
- `apply-promotions.mjs` — applies a promotion table to `mappings.js`
