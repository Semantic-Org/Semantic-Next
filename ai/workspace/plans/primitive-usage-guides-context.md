# Primitive Usage Guides — Design Context

Companion document to `primitive-usage-guides.md`. Captures the reasoning, research findings, and architectural decisions that informed the plan. Read this first if you're picking up this work in a new session.

---

## The Core Problem

Primitive docs have a **definition tab** (exhaustive visual catalog of every type/state/variation) and a **spec tab** (raw machine-readable spec). What's missing is a **usage tab** — the learning surface where developers understand how to use the component, when to reach for it, and how to compose it with others.

The definition tab is where you *browse*. The usage tab is where you *learn*. They serve different audiences at different moments.

---

## The Spec's Two Audiences

A key insight from this design process: the spec serves two distinct audiences, and the boundary between them determines what goes where.

### The spec serves machines and agents
- `get_component('button')` returns the spec for AI agents generating HTML
- `getWebComponentSpec()` produces the runtime metadata for `defineComponent`
- `getDefinition()` auto-generates the definition tab
- The `exampleCode` fields are **intentionally curated for agent comprehension** — they show composition patterns (e.g., `subtle red` demonstrates that style types compose with colors, which an agent might not infer from the attribute list alone)
- `usageLevel` is an agent-facing signal for what to reach for first
- Rendering metadata (`separateExamples`, `includeAttributeClass`, `compoundAliases`) controls docs layout and runtime behavior — agents don't need it, but the MCP currently passes it through

### The usage guide serves humans
- Editorial prose, design guidance, composition patterns
- Custom preview components, interactive specimens
- Per-component personality — the "voice" that makes docs memorable
- Content that's inherently verbose and visual, not machine-optimized
- The guide is also exposed as markdown via MCP for agents who want design reasoning, but it's not the primary path for code generation

### The boundary
The spec should contain everything needed to **generate valid component usage** (the API contract). The usage guide should contain everything needed to **make good decisions about usage** (the design intent). The spec is structured data; the guide is narrative.

---

## Cross-Framework Research

We analyzed 8 UI frameworks' component documentation pages in detail. Individual analyses and full-page screenshots are in `ai/research/usage-guides/`. The synthesis is in `ai/research/usage-guides/00-synthesis.md`.

### Frameworks analyzed (ranked by npm weekly downloads)

| Framework | npm/week | Stars | Doc Pattern |
|---|---|---|---|
| Radix Primitives | 14,994,970 | 18,691 | Do First (code-first) |
| MUI | 6,871,264 | 98,024 | Learn First (concept-organized) |
| Headless UI | 4,031,737 | 28,457 | Do First (linear narrative) |
| Ant Design | 2,243,339 | 97,741 | Show First (demo grid) |
| Mantine | 1,181,163 | 30,811 | Show First (feature-per-section) |
| Chakra UI | 1,044,629 | 40,352 | Show First (hero + explorer) |
| Shadcn/UI | n/a (CLI) | 110,099 | Show First (visual-first, copy-paste) |
| Magic UI | n/a (CLI) | 20,468 | Show First (minimal, preview-first) |

### Key findings

1. **"Show First" wins hype (stars), "Do First" wins production usage (downloads).** MUI is the only framework that ranks highly on both — its "Learn First" concept-organized approach is validated by sustained production use.

2. **Examples are the documentation.** Every framework puts 60-80% of page content into demos. Code is hidden by default — pages read as visual galleries.

3. **Props tables are reference, not tutorial.** Always placed late or on a separate page. MUI puts them on a completely separate API page.

4. **Theming gets its own section when the system has depth.** Ant Design (design token tables), Mantine (interactive Styles API), Chakra (Explorer with clickable parts). These validate SUI's decision to give CSS its own tab.

5. **"When To Use" is rare but valuable.** Only Ant Design has explicit decision guidance before examples. It answers "should I use this?" — a question no example answers.

6. **AI-era features are emerging.** Chakra has a "Copy Page" button for LLM context and promotes their MCP server. MUI has "Edit in Chat" on every demo. The industry is starting to treat agents as a documentation audience.

### What SUI has that none of them do
- A separate exhaustive definition tab (the visual catalog lives on its own page, not crammed into the usage flow)
- A structured spec that can auto-generate most mechanical sections
- A CSS layer architecture deep enough for its own tab
- An MCP-based agent consumption layer
- More types/states/variations per component than typical React component libraries

---

## The Specimen Explorer

The centerpiece of the usage tab. Born from the insight that the two strongest documentation patterns ("Show First" from high-star frameworks, "Do First" from high-download frameworks) can be combined into one interactive experience.

### Why it's the killer feature
- **Spec-driven = zero per-component authoring.** The specimen reads the spec and generates controls automatically. Every primitive gets it for free.
- **Teaches the dialect implicitly.** Users learn `<ui-button primary large>` by composing it in real time, not by reading about attribute syntax.
- **Live code generation.** The generated HTML updates as you toggle controls. A dialect switcher shows the same component in concise/verbose/classic syntax side by side — the best way to teach the three-dialect system.
- **Bridges to the definition tab.** "I composed my variation in the specimen → now let me see it in full context on the definition page."
- **Built with SUI itself.** The specimen is a `defineComponent` component, not a React island. It demonstrates the framework while documenting it.

---

## The CSS Tab and Theme Spec

### Why CSS needs its own tab
Button alone has 77 CSS files across two parallel trees. The theming surface includes per-variation CSS variables organized by CSS layers that map 1:1 to spec entries. This is too deep for a section on the usage page.

### The theme spec format
CSS variables store their **inheritance tree**, not raw values. This reveals override points without exposing implementation details:

```json
{
  "--button-primary-color": { "inherits": ["--primary-color"] },
  "--button-primary-color-hover": { "inherits": ["--button-primary-color", "--hover-lightness"] }
}
```

An agent or themer sees: "override `--button-primary-color` and the hover/focus/active/pressed states follow automatically." They don't need to know the OKLCH math.

### Auto-extraction
The barrel file `button-theme.css` is a complete index — each `@import url(...) layer(...)` line gives the file path and layer name. Parse it at build time, extract variables, write `button.theme.json`. Same build pipeline as `spec.js → spec.json → component.js`.

---

## Implementation Reference

### Key Files

| File | Role |
|---|---|
| `docs/src/pages/ui/primitives/[...slug].astro` | Route handler — generates paths per entry + tab, renders the right component per tab |
| `docs/src/components/SpecDefinition.astro` | Definition tab renderer — loops spec sections, renders CodeExample per type/variation |
| `docs/src/components/SpecViewer.astro` | Spec tab renderer — custom syntax-highlighted spec viewer with collapsible sections |
| `docs/src/layouts/Definition.astro` | Thin wrapper around Layout.astro, passes through props |
| `docs/src/layouts/Layout.astro` | Main page layout — TopBar, Sidebar, DocsMasthead (tab menu), DocsRail (jump nav), slot |
| `docs/src/components/DocsMasthead.astro` | Renders title, description, and tab menu (UIMenu with active tab detection) |
| `docs/src/components/DocsRail.astro` | Right sidebar jump menu |
| `docs/src/content/primitives/*.mdx` | Content entries — frontmatter defines tabs/specName/etc, body is currently empty |
| `docs/src/content.config.js` | Content collection config — defines schema for primitives/components/behaviors |
| `docs/src/helpers/menus.js` | Sidebar navigation structure — must update when adding pages |

### Spec System Files

| File | Role |
|---|---|
| `packages/specs/src/spec-reader.js` | SpecReader class — `getDefinition()`, `getDefinitionMenu()`, `getWebComponentSpec()`, `getCodeFromModifiers()` |
| `src/primitives/button/specs/button.spec.js` | Source spec (authored, imports shared helpers) |
| `src/primitives/button/specs/button.spec.json` | Compiled spec (auto-generated, full JSON) |
| `src/primitives/button/specs/button.component.js` | Runtime componentSpec (auto-generated, tree-shaken) |
| `src/specs/` | Spec entry points and exports — `@semantic-ui/core/specs` resolves here |

### CSS Architecture Files (for CSS tab)

| File | Role |
|---|---|
| `src/primitives/button/css/button.css` | Root — imports definition + theme |
| `src/primitives/button/css/theme/button-theme.css` | **Barrel file** — `@import` index mapping every variation to its CSS layer and variables file |
| `src/primitives/button/css/theme/types/*.css` | Theme variables per type (emphasis, styled, link, etc.) |
| `src/primitives/button/css/theme/states/*.css` | Theme variables per state (hover, focus, disabled, etc.) |
| `src/primitives/button/css/theme/variations/*.css` | Theme variables per variation (sizing, colored, etc.) |
| `src/primitives/button/css/definition/` | Structural CSS that consumes the theme variables |

### Existing Patterns to Follow

**Tab routing**: The route handler uses `displayedTab` to decide what to render. Adding a new tab means:
1. Adding it to the `tabs` array in content entry frontmatter
2. Adding a condition in the route handler template section
3. Building a rail menu for that tab

**Content entry rendering**: Astro's `entry.render()` returns a `Content` component from the MDX body. Currently unused since bodies are empty.

**Spec consumption in docs**: The route handler imports all specs via `import * as Specs from '@semantic-ui/core/specs'`, looks up by `data.specName`, and creates a `SpecReader` instance. The same pattern works for the specimen explorer and CSS tab.

**Component structure convention**: Docs components live in `docs/src/components/`. Complex interactive components (like CodeExample) use SUI's `defineComponent` with `client:load` for hydration.

### MCP Context

The `use-components` context doc (`ai/essentials/use-components.md`) is the system-level guide that teaches agents how to interpret specs. It covers dialects, compound aliases, plural inheritance, content syntaxes. Per-component usage guides would be exposed alongside it via `get_user_doc`.

---

## What's Not In v1

### Accessibility section
Deferred. See the detailed reasoning in the plan. The short version: ARIA annotation is a classification task currently performed by developers at authoring time. ML-based semantic inference at the consumption layer (screen readers, browser extensions) is a more appropriate long-term solution. SUI's spec system already provides richer semantic data than ARIA. Investment is better placed in the spec foundation than in per-component ARIA documentation that may not reflect best practices in 12-18 months.

### Types/Variations overview on usage tab
Originally planned as condensed previews linking to the definition tab. Removed because the Specimen Explorer serves this purpose better — it lets you explore types and variations interactively rather than scrolling through a condensed list. The definition tab remains the exhaustive visual catalog.
