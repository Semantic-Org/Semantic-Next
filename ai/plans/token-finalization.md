# Token Finalization — Lock the Design Token System

## Goal

Make final decisions on the CSS token system so it can be consumed by 70+ components without risk of breaking changes. This is the gate that unblocks the primitive build-out track.

## What Needs Locking

### Sizing
- Current: `--size-3xs` through `--size-3xl` in `sizing.css`
- Open: Add `--size-*-em` variants? (planned but absent)
- Open: Add short aliases (`--3xs`, `--relative-3xs`)? (planned but absent)
- Reference: `sizing-system-reconcile.md` for plan vs reality divergence

### Spacing
- Current: `--padding-*` (em) + `--margin-*` (rem) in `spacing.css`
- Margin scale extends to 5xl (beyond original plan's 3xl) — confirm intentional
- Backward compat aliases (`--spacing-*` → `--margin-*`, `--vertically-spaced` → `--vertical-margin`) — decide when to remove

### Typography
- Current: `--title-{size}` and `--text-{size}` scales (3xs→3xl) added in 0.18.0
- Confirm these are final

### Color Scale
- OKLCH generation pipeline exists
- **Open: grade numbering** — `blue-0` through `blue-100` or `blue-5` through `blue-100`? Zero-indexed vs starting at 5 affects the mental model and how many usable steps exist at the light end.
- Semantic color grades (0-100) for positive/negative/info/warning — added in 0.18.0. Same numbering question applies.

### UI Background Colors
- **Open: slate/off-blacks** — are these colors (like `--slate-50`) or a separate concept (like `--surface-1`, `--surface-2`)? Components need slightly-off-black backgrounds that aren't simply "gray." Is this a named color scale, a surface/elevation system, or both?

### Borders & Shadows
- **Open: semantic vs numeric** — keep named tokens like `--subtle-border`, `--internal-border`, `--strong-border`? Or move to a reference layer like `--border-1` through `--border-10` that components compose from? Named tokens are more readable but harder to extend; numeric scales are systematic but less self-documenting.
- **Open: shadow scale** — same question. `--subtle-shadow`, `--floating-shadow` vs `--shadow-1` through `--shadow-5`.

### Dark Mode Inversion
- **Open: border contrast shifts** — borders need subtle adjustment when inverting for dark mode. A `--subtle-border` that works on white needs different lightness on near-black. Is this handled per-token (light/dark values), per-scale (the grade shifts), or structurally (borders reference a computed token that accounts for mode)?
- This is deeply coupled to the color scale decision — the OKLCH pipeline needs to produce values that work in both modes, not just one with manual overrides for the other.

### Border Radius
- `--border-radius-{size}` scale (3xs→3xl) with NL aliases — added in 0.18.0
- Likely final but confirm

### Containers
- `--text-container`, `--content-container`, `--wide-container`, `--fluid-container`
- Likely final but confirm

## Related Plans

- [Sizing System Reconcile](sizing-system-reconcile.md) — divergence between plan and implementation
- [Token Migration](token-migration.md) — migrating consumers to new tokens
- [CSS Token Extraction](css-token-extraction.md) — MCP tooling for token queries

## The Core Tension

These decisions are interconnected — colors affect borders affect dark mode affect surfaces. They form a single decision surface that can't be locked piecemeal. The system has been "almost done" since November 2025 because each question reveals implications for the others.

The cost of shipping wrong is permanent: 70+ components, every user theme, and every future version builds on this. There's no "we'll fix it in a patch."

## Possible Approach

A pair session focused specifically on building a few complex components (dropdown, date picker, card with nested elements) against the *current* tokens — not to ship, but to pressure-test. The gaps and friction will surface the remaining decisions concretely rather than abstractly.

## Status

Open-ended design. Implementation is trivial once decisions are made. This is the #1 blocker for the primitive build-out track.
