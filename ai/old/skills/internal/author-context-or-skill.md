# Authoring AI Context Files and Skills

> **Purpose**: Rules for writing and maintaining files in `ai/` that are served to agents via the Semantic UI MCP server
> **Audience**: Contributors editing or creating context files and skills in the SUI repo

---

## How Files Reach the Agent

Downstream users don't have the `ai/` folder. They interact with these files exclusively through the Semantic UI MCP server (or its Anthropic plugin, which exposes `list_skills`/`use_skill`). Understanding this pipeline is essential because it determines what matters in authoring.

| MCP Tool | What it does | What it reads from your file |
|----------|-------------|------------------------------|
| `search` | Keyword search across all content | Title, description, keywords, body text |
| `list_context` | Browse by audience filter | `audience` frontmatter field |
| `list_skills` | Browse available skills | `skill` frontmatter field, title, description |
| `use_skill` | Load full skill content | Entire file body |
| `get_context` | Load full doc by path | Entire file body |
| `get_api` | Look up a specific method | Section extracted by heading via `extractMarkdownSection` |

**Consequences for authors:**

1. **Frontmatter is the routing layer.** If your frontmatter is wrong or missing, the file is invisible to the agent regardless of how good the content is.

2. **Section headers are a mechanical API.** `extractMarkdownSection` pulls sections by heading name. A heading like `## weightedObjectSearch` isn't just organizational — it's the key the MCP uses to extract that section for `get_api` responses. Rename a heading carelessly and you break method lookups.

3. **Files land as tool results, not system prompt.** This means they don't get the "may or may not be relevant" dismissal that CLAUDE.md content gets. The agent explicitly requested this content — it will attend to it. But it also means the content competes with conversation history, other tool results, and whatever else is in the context window at that point.

4. **The `related` field is computed by the MCP server**, not authored in your file. The cross-reference tables at the bottom of files are for human readers browsing the raw markdown. They don't feed the agent's graph traversal — `findRelatedFor*` functions do that. Keep them accurate for human contributors, but know they aren't the routing mechanism.

---

## Everything Is a Skill

Anthropic's taxonomy draws a distinction between "skills" (procedural knowledge — how to do things) and "context" (declarative knowledge — what is true). In practice this boundary is fuzzy and the ecosystem is converging on skills as the primary delivery unit. Anthropic's plugin system is skills-based, their discovery mechanism is skills-based, and `list_skills`/`use_skill` is the path this MCP server will publish through.

**Treat every file as a skill.** Every file in `ai/` should have a `skill` field in its frontmatter and be loadable via `use_skill`. This doesn't mean every file reads like a how-to guide — it means every file is discoverable and deliverable through the skill pipeline.

### Two subtypes of skill

The difference isn't skill vs. context, it's **how the agent consumes it**:

| Subtype | Agent behavior | Example | Characteristics |
|---------|---------------|---------|-----------------|
| **Procedural** | Loads at task start, follows throughout | `use.md`, `style.md` | Teaches the agent how to act. Has a "golden rule." Agent's output changes because of this file. |
| **Reference** | Loads on demand, scans for specific values | `tokens.md` | Lookup table the agent queries mid-task. Stable public API that won't change once published. |

Both are skills. Both get `skill:` frontmatter. Both are served through `use_skill`. The distinction matters for authoring because it affects length tolerance and internal structure:

**Procedural skills** need to be read end-to-end. Keep them under 500 lines. Frontload the most important rules. The agent must internalize the logic, so attention degradation matters.

**Reference skills** are scanned, not read linearly. Length is more tolerable (tokens.md at 780 lines works fine) because the agent loads the file, reads the design principles at the top to understand the system's logic, then searches for the specific token family it needs. Structure these with clear section headers and a Quick Reference — the agent will jump to what it needs.

Files like `mental-model.md` blend both: the agent needs the conceptual framework (procedural) and the API patterns (reference). For these, frontload the conceptual content that must be internalized, and put the lookup patterns later where partial attention is acceptable.

### The decision test

When creating a new file, ask: **if the agent loads this file and nothing else, can it complete a task in this domain correctly?**

If yes, it's a well-scoped skill. If the agent would also need to load two other files to be useful, consider merging or restructuring.

---

## Frontmatter

Every file in `ai/` should have YAML frontmatter. These fields are not optional decoration — they feed the MCP's discovery and filtering tools.

```yaml
---
title: Semantic UI Mental Model                    # Shown in list results
description: Core mental model for AI agents...    # Shown in list results, fed to search
keywords: [mental model, architecture, signals]    # Fed to search ranking
audience: framework                                # Filters: ui | framework | contributing | research
skill: mental-model                                # If set, makes this loadable via use_skill
type: doc                                          # Content type classification
---
```

### What each field controls

**`title`** — Appears in `list_*` tool responses. The agent uses this to decide whether to load the full file. Make it action-oriented and specific.

```yaml
# Good — tells the agent what it will get
title: Creating Components Guide
title: CSS Design Tokens Reference

# Bad — vague, agent can't judge relevance
title: Components
title: Styling
```

**`description`** — Appears in `list_skills` and `list_context` responses, and feeds search ranking. Write it as a concise scope statement — what the file covers and what it doesn't.

```yaml
# Good — clear scope boundaries
description: Core mental model for AI agents working with Semantic UI, covering component architecture, reactivity system, template syntax, and framework design patterns.

# Bad — too vague to help with selection
description: Information about Semantic UI.
```

**`keywords`** — Fed to the `search` tool. Include terms the agent might search for that don't appear in the title or description. Think about what queries should surface this file.

```yaml
# Good — includes search terms beyond what's in the title
keywords: [shadow DOM, web components, defineComponent, signals, reactive proxy]

# Bad — just repeats the title
keywords: [mental model]
```

**`audience`** — Controls filtering in `list_context`. Pick the primary audience:

| Value | Who | Example content |
|-------|-----|-----------------|
| `ui` | Developers using SUI components | Markup syntax, styling, theming |
| `framework` | Developers building components with SUI | defineComponent, reactivity, templates |
| `contributing` | Contributors to the SUI codebase | Code conventions, PR process |
| `research` | Architectural investigation | Design decisions, tradeoffs |

**`skill`** — Registers this file as loadable via `use_skill` and discoverable via `list_skills`. Use a kebab-case name. Every file in `ai/` should have this field — it's the primary delivery mechanism for downstream users via the MCP plugin.

---

## Section Headers as API

Because `extractMarkdownSection` extracts content by heading name, headers serve double duty: human-readable organization and machine-addressable sections.

### Rules for headers

**Use the exact name the agent would search for.** If the section documents a method called `weightedObjectSearch`, the heading should be `## weightedObjectSearch`, not `## Weighted Object Search` or `## Search Utility`.

**Keep heading depth consistent within a file.** The extraction function matches on heading name — if you have `## Sizing` at one level and `### Sizing` at another, extraction becomes ambiguous.

**Don't rename headings without checking downstream impact.** If `get_api` returns a specific section by heading name, renaming that heading silently breaks the lookup.

---

## Content Principles

### Only document what the agent can't infer

The agent already knows HTML, CSS, JavaScript, and standard web component patterns. Document what's unique to SUI — the patterns it would get wrong without being told.

```markdown
<!-- Good — SUI-specific, non-obvious syntax -->
### Three Attribute Dialects
All equivalent:
<ui-button large>          <!-- concise (preferred) -->
<ui-button size="large">   <!-- verbose -->
<ui-button class="large">  <!-- classic -->

<!-- Bad — the agent knows this already -->
### What Are Web Components?
Web components are a set of browser APIs that allow you to create
reusable custom elements with encapsulated functionality...
```

### Lead with the golden rule, then explain

When a file has one overriding principle that prevents most mistakes, state it immediately and repeat it at the end:

```markdown
**Golden rule: If it's not in the spec, don't use it.**
```

This single line prevents more errors than paragraphs of detailed rules.

### Tables for lookup, prose for concepts

Use tables when the reader needs to find a specific value or map between things. Use prose when they need to understand why something works a certain way.

```markdown
<!-- Good — table for option lookup -->
| Flag | Meaning |
|------|---------|
| `compoundAliases` | Concise form requires value-attribute compound |
| `prefixCompound` | Compound uses attribute-value order instead |

<!-- Bad — same information buried in prose -->
The compoundAliases flag means the concise form requires a
value-attribute compound. The prefixCompound flag means the compound
uses attribute-value order instead of the default.
```

### Always pair ✅ with ❌

The agent learns more from the contrast than from either example alone:

```css
/* ❌ WRONG - raw scale values when semantic tokens exist */
color: var(--standard-80);

/* ✅ RIGHT - semantic tokens communicate intent */
color: var(--text-color);
```

### End with a Quick Reference

For files longer than ~100 lines, place a condensed lookup near the end. The agent may load the full file but only need the Quick Reference for a simple task. Keep it to code examples and short tables — no prose.

### End with a Related table

A cross-reference table as the final section linking to adjacent skills:

```markdown
## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **CSS Tokens** | `/sui:tokens` | Available design tokens |
| **Style SUI** | `/sui:style` | Customizing appearance from outside |
```

The MCP computes `related` links separately via `findRelatedFor*`, so these tables don't feed the agent's graph traversal. They serve two other audiences: human contributors browsing the raw markdown on GitHub, and agents that receive the full file content via `use_skill` (where the Related table appears at the bottom and may prompt the agent to load a companion skill).

---

## File Length

Length tolerance depends on the skill subtype (see "Everything Is a Skill" above):

**Procedural skills** (loaded and read end-to-end): Keep under 500 lines. The agent must internalize the logic, so attention degradation on mid-file content is a real concern. If a procedural skill grows past this, split into a focused guide plus a reference companion.

**Reference skills** (loaded and scanned for specific values): Length is more tolerable. A 780-line token reference works because the agent reads the design principles section, then searches for the specific token family it needs. The full file is in context but the agent isn't trying to hold all of it in working memory simultaneously.

**Mixed skills** (conceptual framework + lookup patterns): Frontload the conceptual content that must be internalized. Put lookup tables and code pattern references in the back half. If the file exceeds 500 lines, the conceptual portion should be in the first 300.

**For files used via section extraction** (`get_api`): Total file length is irrelevant because `extractMarkdownSection` pulls only the relevant heading. The full file never enters context.

---

## Consistency

### One term per concept across all files

The agent wastes attention resolving synonyms:

```
Always "spec" — not alternating between "spec", "definition", "schema", "config"
Always "concise form" — not alternating between "concise", "shorthand", "bare", "attribute form"
```

### One structural skeleton

All context files should follow the same pattern: frontmatter → blockquote header → sections with `---` separators → Quick Reference → Related table. Predictable structure benefits both agents and humans.

### Blockquote header format

```markdown
> **Skill:** `sui:identifier`
> **Purpose:** One line explaining what this file gives the agent
```

---

## Open Questions

Areas where the right approach isn't settled — flagging these for honest discussion rather than presenting premature answers.

**Frontmatter vs. blockquote headers.** Some files use YAML frontmatter; others use the blockquote pattern without YAML. Both serve a purpose: YAML feeds the MCP's search and filtering, the blockquote orients the agent when the file is loaded. Using both is ideal (YAML for machine routing, blockquote for in-context orientation) but doubles the maintenance surface. Worth deciding on a convention and enforcing it.

**Optimal keyword selection.** Keywords feed the `search` tool's ranking, but it's unclear how much weight they carry relative to body text matches. Testing specific search queries against the current keyword sets would reveal whether keywords are doing useful routing work or are redundant with body content.

**Skill granularity for the plugin.** When `list_skills`/`use_skill` ships as an Anthropic plugin, the skill list is what external agents see first. Too many skills creates a discovery problem (the agent has to read through 50 descriptions to pick one). Too few means each skill is too broad. The right granularity is probably task-oriented: "I need to use SUI components" → `use`, "I need to style them" → `style`, "I need to know what tokens exist" → `tokens`. But this needs validation against how agents actually select skills in the plugin context.

**Cross-reference table maintenance.** These tables drift as files are renamed or reorganized. A lint step that validates the paths in Related tables would prevent silent link rot.

**Mixed skill ordering.** For files that blend procedural and reference content (like `mental-model.md`), the recommendation is to frontload conceptual content. But it hasn't been tested whether agents actually retain the early sections better than later ones within a tool result. The attention degradation research is primarily about system prompts and conversation history, not single tool responses. Worth investigating.
