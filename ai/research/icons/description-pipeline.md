# Icon Visual Description Methodology

## Purpose

Each of the 481 canonical icons in Semantic UI has a `visual` and `usage` field in `mappings.js`. These descriptions exist so that AI agents can confidently select icons without seeing them — they bridge the gap between an agent's need ("I want a trash can icon") and the canonical name (`trash`).

The `visual` field is particularly important because agents have icon libraries like Lucide and Material Symbols in their training data. They know what `house` looks like, but not what SUI's `home` renders as. The visual description gives them that grounding.

## Why Blind Vision, Not Training Data

Early experiments showed that agents asked to describe SVG path data would "cheat" — recognizing icon names from class attributes, filenames, or even path geometry patterns they'd memorized from training. This produced descriptions that parroted known metadata rather than describing what the icon actually looks like.

A text-only SVG path analysis scored 10/11 on a test batch, but the one miss was revealing: a venetian mask was described as "an open book" because the path geometry was genuinely ambiguous without rendering. The same batch scored 11/11 when rendered to PNG and inspected via vision.

## Pipeline

### Step 1: Render (one-time)

All 481 Lucide SVGs were rendered to 96×96 PNGs using ImageMagick:

```bash
sed 's/currentColor/black/g' icon.svg | convert -background white -density 384 svg:- -resize 96x96 icon.png
```

The `currentColor` replacement is necessary because Lucide SVGs use stroke-based rendering with `currentColor`, which ImageMagick can't resolve.

### Step 2: Batch by Category

Icons were organized into batches by their `category` field from `mappings.js`, with a max batch size of 30. This produced 32 batches. The category grouping was intentional — agents describing icons alongside their categorical neighbors write descriptions that emphasize what makes each icon *distinctive* within the group (e.g., "shield with checkmark" vs "shield with X" vs "plain shield").

Each batch directory contained:
- Numbered PNGs (1.png, 2.png, ...) with no icon names
- A `_manifest.json` mapping numbers back to canonical names (hidden from the describing agent)

### Step 3: Blind Description (26 parallel agents)

Each batch was assigned to an independent agent (Sonnet) with this prompt structure:

> You are labeling icons for a database. Another AI agent will read ONLY your descriptions to choose the right icon for a UI — they cannot see the images.
>
> **visual** — One sentence, max 25 words. Describe what a human would call this shape — not how it's drawn.
>
> **usage** — 2-4 concrete UI contexts (comma-separated).

Key constraints:
- No references to other icons (no "identical to icon 3", no "same shape as the shield")
- Describe the object, not the geometry (no stroke weights, no coordinates)
- No "representing X" interpretations — that's what the `usage` field is for
- Name well-known UI symbols (checkbox, toggle switch, radio button)

Small categories (brand, gamification, ai, education, weather, misc) were combined into multi-category agents to reduce overhead. Large categories (action: 65 icons) were split into batches of 30.

### Step 4: Verification (text-only QA)

A verification agent reviewed all 481 `{canonical name, visual description}` pairs without seeing any images. It flagged entries where the description contradicted what the name implies — for example, `toggle-right` described as "circle on the left" or `users` described as a single person.

This caught **19 mismatches out of 481** (96% accuracy).

### Step 5: Targeted Re-inspection

The 19 flagged icons were sent to a fix agent that could see both the PNG and the flag reason. This agent determined:

- **4 false flags** — the description was accurate, the verifier just didn't know what the icon looks like (e.g., `file-archive`'s vertical dots are a zipper motif, not "more options")
- **15 real errors** — corrected with accurate descriptions based on the PNG

All 19 were then human-reviewed on a test page rendering the actual icons alongside the descriptions. All confirmed accurate.

## Prompt Evolution

### V1 (initial run)
- No length constraint
- Produced verbose geometric descriptions ("A bold downward-pointing arrow with a straight vertical shaft and a wide triangular arrowhead with flat horizontal T-bar ends")
- Frequent relative references ("identical to icon 3 but with a checkmark")
- ~10% required cleanup

### V2 (production run)
- "One sentence, max 25 words"
- "Describe what a human would call this shape — not how it's drawn"
- Explicit prohibition on relative references
- Good/bad examples in prompt
- ~4% error rate, all caught by automated QA

The key insight between V1 and V2: agents writing icon descriptions for other agents need to describe *objects*, not *geometry*. "A trash can with a lid and handle" is useful for selection. "A rectangular body with a flat panel at the top and two vertical interior strokes" is not.

## Output

- `visual` and `usage` fields on each entry in `packages/specs/src/icons/mappings.js`
- Exposed via the `get_icon` MCP tool — agents searching by name, alias, or library-native name see the visual description in results
- Human-readable artifact at `ai/workspace/artifacts/icon-descriptions.md`

## Reproducibility

All intermediate artifacts are preserved in `ai/workspace/icon-visual-test/production/`:
- `pngs/` — all 481 rendered PNGs
- `batches/` — per-category directories with numbered PNGs, manifests, and description JSONs
- `batch-index.json` — batch metadata
- `verify-input.json` — collected descriptions for QA
- `verification-results.json` — flagged mismatches
- `fixes-v2.json` — targeted corrections

The render script (`ai/workspace/icon-visual-test/render-all.js`) and merge script (`ai/workspace/icon-visual-test/merge-descriptions.js`) can re-run the pipeline if icons are added or changed.
