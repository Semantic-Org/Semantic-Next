# Component Documentation Taxonomy — Cross-Framework Synthesis

## Methodology

Analyzed the default/primary documentation page for a complex component (Select, Autocomplete, Menu, or Dock) across 8 UI frameworks. Extracted the top-level section taxonomy, sequence, purpose, and dominant content patterns.

### Popularity Metrics (as of March 2026)

| Framework | GitHub Stars | npm Weekly Downloads | Doc Philosophy |
|---|---|---|---|
| Shadcn/UI | 110,099 | n/a (CLI registry) | Show First |
| MUI | 98,024 | 6,871,264 | Learn First |
| Ant Design | 97,741 | 2,243,339 | Show First |
| Chakra UI | 40,352 | 1,044,629 | Show First |
| Mantine | 30,811 | 1,181,163 | Show First |
| Headless UI | 28,457 | 4,031,737 | Do First |
| Magic UI | 20,468 | n/a (CLI registry) | Show First |
| Radix Primitives | 18,691 | 14,994,970 | Do First |
| Radix Themes | 8,239 | 429,207 | Do First |

**Notable**: Radix Primitives has the highest npm downloads (15M/week) despite modest stars — it's a dependency of Shadcn/UI and many other libraries. Shadcn and Magic UI distribute via CLI copy-paste, so npm stats don't apply.

---

## Section Inventory

Every framework's page can be decomposed into a finite set of **section types**. Not every framework uses every type, and the sequence varies. Here are the recurring section types observed:

| Section Type | Frameworks That Use It | Placement |
|---|---|---|
| **Hero/Preview** | Chakra, Magic UI, Ant Design, Mantine, Shadcn | Top (before any heading) |
| **When To Use** | Ant Design | Top (decision guidance) |
| **Installation** | Headless UI, Radix Primitives, Magic UI, Shadcn | Early |
| **Basic Example** | Headless UI, MUI, Mantine, Radix Themes | Early |
| **Anatomy / Import** | Chakra, Radix Primitives | Early |
| **Styling Guide** | Headless UI | After basic example |
| **Feature Examples** | ALL | Middle (bulk of page) |
| **API / Props Table** | ALL | Late or separate page |
| **Design Tokens** | Ant Design | Late |
| **Styles API / Parts** | Mantine, Ant Design (Semantic DOM), Chakra (Explorer) | Late |
| **Accessibility** | Headless UI, Radix Primitives, Mantine, MUI | Late |
| **Keyboard Interactions** | Headless UI, Radix Primitives | Late (within Accessibility) |
| **Limitations / FAQ** | MUI, Ant Design | End |
| **Custom APIs / Advanced** | Radix Primitives, MUI | End |

---

## Sequence Patterns

### Pattern A: "Show First" (Visual-First)
**Used by**: Chakra, Magic UI, Ant Design, Mantine

```
Hero Preview → [When To Use] → [Installation] → Examples → Props → [Styles/Explorer]
```

The very first thing is a live rendered component. No explanation, no import — just the thing working. Learning starts with the visual result.

### Pattern B: "Do First" (Code-First)
**Used by**: Headless UI, Radix

```
Installation → Basic Example → Styling → Examples → [Accessibility] → API Reference
```

Starts with getting the code running. The first thing is an install command and a minimal code block. Visual result is secondary to working code.

### Pattern C: "Learn First" (Concept-First)
**Used by**: MUI

```
Simplest Example → Concept Sections (Free Solo, Grouped, Multiple) → Advanced Patterns → Limitations → Accessibility → API Links
```

Organizes by user goal, not by prop. Sections are named "Asynchronous requests", "Multiple values" — concepts, not API surface. The full props table lives on a separate page.

---

## Key Observations

### 1. Examples Are The Documentation
Every framework puts the bulk of its page content into examples/demos. The ratio varies:

| Framework | Approximate % of page that is examples |
|---|---|
| Ant Design | ~70% (28 demos in grid) |
| Mantine | ~80% (38 sections, each with demo) |
| MUI | ~75% (25+ demos) |
| Chakra | ~80% (19 example sections) |
| Headless UI | ~60% (9-14 examples) |
| Radix | ~40% (9 examples, more in API) |
| Magic UI | ~30% (2-3 examples, simpler component) |

### 2. Code Hidden By Default
Every framework except Radix hides code behind a toggle (Expand, Code tab, etc.). The default view is **preview-first** — the live component is visible, the code requires a click. This makes the page read as a visual gallery by default.

### 3. Props Tables: Inline vs Separate
Two distinct approaches:

| Approach | Frameworks |
|---|---|
| **Props inline on same page** | Headless UI, Radix, Ant Design, Mantine (implicit), Chakra, Magic UI |
| **Props on separate API page** | MUI |

Mantine is unique — it has no explicit props table. Props are documented implicitly through the per-feature demo sections.

### 4. Theming/Styling Gets Special Treatment
Three frameworks give theming its own dedicated section or approach:

- **Ant Design**: "Design Token" section with component + global token tables
- **Mantine**: "Styles API" with interactive selector/highlighter
- **Chakra**: "Explorer" with clickable anatomy parts + recipe code

These are the closest analogues to SUI's proposed CSS tab.

### 5. Accessibility Is a Late Section
When present, accessibility is always near the end. It's reference material (keyboard tables, ARIA notes), not tutorial content. Headless UI and Radix Primitives give it the most attention.

### 6. "When To Use" Is Rare But Valuable
Only Ant Design has explicit decision guidance ("When To Use"). It answers "should I use this component?" before "how do I use it?" — a different question than any example answers.

### 7. AI-Era Features Emerging
- **Chakra**: "Copy Page" button (exports markdown for LLMs), MCP server callout
- **MUI**: "Edit in Chat" button on every demo
- These suggest the industry is starting to treat agents as a first-class documentation audience

---

## Normalized Taxonomy

Collapsing the observed patterns into a universal vocabulary of documentation sections:

### Tier 1: Orientation (top of page)
1. **Identity** — component name, one-line description
2. **Hero** — live preview or basic code example (the "what is this" moment)
3. **Decision Guidance** — when to use this vs alternatives (rare but valuable)

### Tier 2: Getting Started
4. **Installation / Import** — how to add it to your project
5. **Anatomy** — the compositional structure (compound component tree)
6. **Basic Usage** — minimal working code

### Tier 3: Feature Catalog (bulk of page)
7. **Examples** — progressive demos from simple to complex, organized by:
   - Visual props (size, variant, color) → simplest
   - Behavioral props (controlled, searchable, clearable) → intermediate
   - Composition patterns (with dialog, with form, async) → advanced
   - Edge cases (virtualization, custom filter, performance) → expert

### Tier 4: Reference (bottom of page)
8. **Props / API Table** — flat lookup reference
9. **Theming / Styling** — CSS variables, design tokens, parts anatomy
10. **Accessibility** — keyboard interactions, ARIA compliance
11. **Limitations / FAQ** — known issues, common gotchas

---

## Implications for Semantic UI

### What's unique about SUI's situation
- **Spec-driven**: SUI has a structured spec that can auto-generate much of Tiers 2 and 4
- **More variations than most**: SUI primitives have a deeper type/state/variation surface than typical React component libs
- **Separate definition tab**: The exhaustive visual catalog already exists as its own tab — the usage page doesn't need to replicate it
- **Three audiences**: Human developers (docs page), AI agents (MCP/spec), and framework authors (contributing docs)
- **CSS layer architecture**: The theming surface is structured enough for its own tab (unlike frameworks where styling is just a section)

### Recommended section sequence for SUI Usage tab
Based on the cross-framework analysis, with SUI-specific adaptations:

1. **Hero** — live preview + simplest example (auto-generated from spec)
2. **When To Use** — brief decision guidance (authored, following Ant Design's pattern)
3. **Import / Setup** — per-framework snippets (auto-generated from spec)
4. **Anatomy** — compositional structure for compound components like menu (auto or authored)
5. **Authored Guide Content** — the editorial heart (MDX body slot)
6. **Key Types & Variations** — condensed overview linking to definition tab (auto-generated, filtered by usageLevel)
7. **Settings Table** — flat props reference (auto-generated from spec)
8. **Events Table** — event reference (auto-generated from spec)
9. **Accessibility** — keyboard interactions, ARIA (mix of auto + authored)

**Notably excluded from usage tab** (lives on other tabs):
- Exhaustive visual catalog → Definition tab
- CSS variables, design tokens, parts → CSS tab
- Raw spec → Spec tab

### Key design principles drawn from the analysis
1. **Preview before code** — the hero should be a live component, not a code block
2. **Code hidden by default** — all examples should show the live result first, code on toggle
3. **One concept per section** — Mantine's "one H2 per feature" pattern works well with a rail nav
4. **Decision guidance is underused** — a brief "When To Use" section would differentiate SUI docs
5. **The usage tab is not the definition tab** — it should teach concepts and patterns, linking to the definition tab for the exhaustive gallery rather than reproducing it
6. **Authored content is the differentiator** — auto-generated sections create parity with other frameworks; the editorial voice is what makes docs memorable
