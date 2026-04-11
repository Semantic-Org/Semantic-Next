# Icon Alias Audit

## Goal

Reduce the icon alias set from ~1960 to only aliases that bridge genuine naming gaps — names a developer or AI agent would actually reach for. The current set was generated exhaustively by AI and includes padding like `erase-back` for `backspace` or `arrow-downward` for `arrow-down` that no one will ever type. Every alias adds payload to `optionAttributes` (currently 2443 icon entries) and `iconAliases`, both of which ship to the browser.

## Background

Aliases serve three purposes:
1. **Library-native bridge** — developers who know Lucide/Phosphor/etc. names can use them directly (`zap` → `bolt`, `house` → `home`)
2. **Intent mismatch** — the canonical name doesn't match what developers reach for (`delete` → `trash`, `edit` → `pencil`, `notifications` → `bell`)
3. **Common shorthand** — shorter forms that feel natural (`down` → `arrow-down`, `close` → `x`, `left` → `arrow-left`)

Aliases that don't serve one of these purposes should be removed.

## Criteria

Every alias must pass the **intent test**: would a developer or AI agent, knowing the UI concept they want, plausibly type this name? Being a library-native name is context for evaluation, not a free pass — `swap_horiz` is Material's internal convention but nobody would type `swap-horiz` into SUI markup.

Keep an alias if:

1. **Common developer intent** — you'd reach for this name before the canonical one when describing the concept. `edit` → `pencil`, `delete` → `trash`, `notifications` → `bell`.
2. **Semantic signal** — the alias communicates purpose in markup that the canonical name doesn't. An agent writing `<ui-icon delete>` signals intent to any reader; `<ui-icon trash>` just describes the glyph. `warning` → `triangle-alert`, `success` → `circle-check`. This also gives premade selectors for event binding — `[icon="delete"]` or `[icon="settings"]` are meaningful hooks for delegation, whereas `[icon="trash"]` or `[icon="sliders-horizontal"]` require the reader to map glyph back to intent.
3. **Useful shorthand** — meaningfully shorter than canonical and unambiguous. `down` → `arrow-down` (yes), `nav-down` → `arrow-down` (no — same length, less clear).
4. **Established convention** — widely used across the icon ecosystem (Font Awesome, Material Icons, Ionic, etc.) and passes the intent test.

Remove an alias if:
- It's a mechanical synonym (`arrow-downward` for `arrow-down`, `erase-back` for `backspace`)
- It's a library-internal naming convention that doesn't match how people think (`swap_horiz`, `arrow_downward`)
- It describes the visual rather than the intent (`diagonal-lines` for `hash`)
- It's redundant with the canonical name (one word different, same meaning)
- Nobody would guess it (`remove-character` for `backspace`)

## Implementation

### Phase 1: Prepare evaluation data (agent)

Write a script that enriches each alias with context for evaluation:
- Whether the alias is a library-native name (and which library)
- The canonical name, description, and category
- All other aliases for the same icon (so the evaluator can see what's already covered)

Output: a JSON file chunked into ~20 groups for parallel evaluation.

### Phase 2: Parallel evaluation (agent, ~20 subagents)

Each subagent receives a chunk and the criteria. For every alias, it applies the intent test and outputs:
- `keep` with reason (`intent` | `shorthand` | `convention`) — e.g. "developers think 'edit' not 'pencil'"
- `remove` with one-line rationale — e.g. "mechanical synonym of canonical name"

Library-native status is context, not a verdict. `zap` (Lucide-native) passes because developers know it. `arrow_downward` (Material-native) fails because nobody would type that in markup.

### Phase 3: Reconciliation (pair)

Merge subagent results. Review any borderline cases — aliases where subagents might be uncertain. Jack makes final calls on contested names. Apply the removals to `mappings.js`.

### Phase 4: Rebuild (agent)

Run the icon build pipeline:
```bash
node packages/specs/scripts/build-icon-meta.js
node packages/specs/scripts/build-icon-css.js
npm run build:ui-deps
```

Verify no duplicate aliases remain and the total option count is reasonable.

## Target

Rough target: ~400-600 aliases (down from ~1960). This is a guess — the actual number depends on how many library-native names exist and how many intent bridges are genuinely useful.

## Open Questions

None — criteria are concrete enough to execute.

## Dependencies

None. The alias fix from the current session (threading aliases into `optionAttributes` + `delete` collision fix) should be committed first so this work builds on clean state.

## Status

Not started. Scope: `scoped`.
