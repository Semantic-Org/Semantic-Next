# Lucide Icon Selection: Editorial Process

## Context

Semantic UI ships an icon font backed by multiple SVG libraries (Lucide, Heroicons, Material Symbols, Phosphor, Tabler). Icons are mapped to semantic names via `mappings.js` — a Rosetta Stone where `<ui-icon trash>` resolves to the best glyph across backends. This research determined which Lucide icons to include.

The optimization target: **agent hit rate**. When an AI agent generates a UI, it reaches for icon names by concept. Every miss means a broken icon, a fallback, or a manual import that breaks flow. The icon vocabulary should cover what agents reach for on first pass, without synonym ambiguity.

## Methodology

Two independent selection passes were run in parallel by separate Claude instances with no shared context:

### Pass 1A: Exhaustive Vibe Pass (827 icons)
- **Approach**: 5 parallel sub-agents each processed ~335 icons from the full Lucide set (1,668 primary icons, aliases excluded). Each agent independently appended icons that "felt essential" for common UI work.
- **Criteria**: Broad category coverage (navigation, status, communication, commerce, data, dev tools, AI/ML). Skip niche/domain-specific icons.
- **Result**: `pass-1-exhaustive-827.txt` — high recall, low precision. Committees expand.
- **Weakness**: No dedup discipline. Shipped `cog`, `settings`, and `settings-2`. No consistent family boundaries.

### Pass 1B: Editorial Dedup Pass (341 icons)
- **Approach**: Single agent, single pass. "Deduplicate concepts that overlap in training data."
- **Criteria**: One icon per concept. If two icons map to the same mental concept, only the better glyph survives.
- **Result**: `pass-1-editorial-341.txt` — high precision, some recall gaps.
- **Weakness**: Missed font-size icons (`a-arrow-down/up`), ascending sort counterpart, `car`, `hand`, `hard-drive`, grid icons, `graduation-cap`, emotion spectrum (`frown`/`meh`).

### Adversarial Review
The two agents exchanged arguments through a human mediator. Key points of convergence:

1. **Agent B's decision-cost argument** (too many choices confuse developers) was reframed: agents don't browse icon pickers, they pattern-match on names. Decision cost is a human problem, not an agent problem.
2. **Agent A's cost argument** (SVGs are lazy-loaded, CSS compresses well) held — marginal byte cost is near zero.
3. **The mapping layer** (`mappings.js`) resolved the synonym debate: Lucide names are implementation details. `trash-2` and `trash` don't both ship — one maps to `<ui-icon trash>`, the other is dead weight.

This produced the **semantic name test**: if an icon earns a distinct, intuitive `<ui-icon name>` that an agent would reach for, it belongs. If it's a synonym or container variant of an existing concept, it doesn't.

### Pass 2: Expansion Review (341 → 433)
Agent B applied the semantic name test to Agent A's 501 extras. 92 passed, 409 were rejected. Every decision is documented with rationale in `expansion-review.md`.

Biggest expansion categories:
- Panels/layout (+13): sidebar open/close, drawer open/close, alignment family
- Messages/chat (+9): typing indicator, new chat, unread, reply-in-thread
- Files (+7): zip, verified, image, protected, search, spreadsheet, remove
- Git/dev (+7): compare, log, PR states, code search, JSON
- Charts (+5): stacked, candlestick, gantt, network, scatter
- Rich text (+5): format-clear, spell-check, sub/superscript, blockquote
- Design tools (+7): bring-forward, send-backward, flip, fill, color-picker, split

### Pass 3: Final Pushback (433 → 441)
Agent A reviewed the rejections and argued for 8 re-inclusions:
- `archive-x` — "junk mail" is a distinct destination concept, not archive + delete
- `router` — network layer was missing from the server/database/hard-drive infrastructure triad
- `webcam` — video calls are universal; distinct from camera (photography) and video (recording)
- `shield-off` — "security disabled" is a third state axis alongside warning and error
- `wifi-high`, `wifi-low`, `wifi-zero` — signal strength is a real UI pattern
- `mouse` — input device pair with keyboard for settings/accessibility UIs

Agent B accepted all 8.

### Pass 4: Three-Way Reconciliation (441 → 471)
An independent auditor agent reviewed the 386 icons in the exhaustive pass but not in the converged 441. Two categories of findings:

**Mapping integrity (7 remaps, no new icons):** Icons referenced by `mappings.js` where a better glyph was already in the 441 — fix the mapping pointer, don't add the icon. Examples: `building` → remap to `building-2`, `laptop` → remap to `laptop-minimal`, `refresh-cw` → remap to `refresh-ccw`.

**Genuine concept gaps (14 icons):** Distinct concepts with no substitute in the 441:
- `scale` (balance/justice), `milestone` (project management), `mouse-pointer` (cursor), `tablet` (device family gap), `cast` (Chromecast/AirPlay), `triangle` (geometric shape, accordion indicator), `droplet` (color picker, water)
- Concept gaps caught by semantic name test: `vote`, `voicemail`, `regex`, `sigma` (sum), `shapes`, `waypoints`, `separator-horizontal` (divider), `text-cursor-input` (text input field), `text-select`, `scroll-text` (terms/legal), `variable`, `radar` (chart type), `mouse-pointer-click` (click analytics), `picture-in-picture`, `user-x` (block user), `user-search`

**Niche icons retained (9 icons):** Initially flagged as too niche, but justified on review:
- `snowflake` — freeze column/row in spreadsheets, frozen account state
- `thermometer` — IoT dashboards, server monitoring (CPU temp), smart home
- `vault` — password managers, secrets management (HashiCorp Vault)
- `watch` — wearable device targeting, responsive breakpoint previews
- `hexagon` — node-based editors, honeycomb grid layouts
- `wind`, `usb` — weather apps, device management
- At near-zero marginal cost (brotli-compressed CSS), all non-overlapping concepts were retained.

Both Agent A and Agent B signed off on all 30 additions.

## Final Result

**482 icons** in `final-list.txt`. Estimated ~97%+ first-pass agent hit rate across dashboard, chat, e-commerce, dev tools, rich text editor, design tool, IoT, and admin panel contexts.

## Files

| File | Description |
|------|-------------|
| `final-list.txt` | The converged icon list (ship this) |
| `pass-1-exhaustive-827.txt` | Agent A's broad vibe pass |
| `pass-1-editorial-341.txt` | Agent B's tight editorial pass |
| `expansion-review.md` | Every addition/rejection with rationale and proposed semantic names |
| `reconciliation-audit.md` | Independent auditor's three-way reconciliation review |

## Key Insight

The same model (Claude), given the same source data, produced lists of 827 and 341 depending solely on prompting strategy. The truth emerged from adversarial exchange — neither list alone was correct. Structured batch processing maximizes recall but loses editorial coherence. Single-pass conceptual curation maximizes precision but has blind spots. The semantic name test provided an objective razor that both approaches could agree on.

A third-pass reconciliation audit caught 30 additional icons — including 7 mapping integrity issues that would have caused silent rendering failures. The three-agent process (exhaustive → editorial → auditor) mirrors the accounting principle of three-way reconciliation: no single perspective catches everything.
