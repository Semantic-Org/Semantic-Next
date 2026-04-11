# Homepage Hero & Tour Section — Content Outline

## Hero

**H1:** The UI Framework for the AI Era

**Subhead:** A web component framework with signals, expressive templates, and a complete UI kit that **reads like English**. Built to **run without compilation** — in an agent sandbox or wherever you code.

- Bold only two phrases: "reads like English" and "run without compilation"
- These are the two claims the tour sections below prove
- CTAs: "View Docs" (secondary) / "Try In 5 Minutes" (primary)

---

## Tour Sections (right graphic chases user down page)

### Section One — "Code Designed to Edit" (Agentic Coding Simulation)

**Concept:** Simulated AI prompt bar above a code panel + rendered UI. Prompts appear, an agent "thinks", then code updates and UI re-renders. Demonstrates the feedback loop: lazy human prompt → spec-aware agent → readable markup → working UI.

**Prompt bar:** Simplified chat input (like Claude/ChatGPT but abstracted). Right-side arrow button that visually submits. Brief "thinking..." state with animated icon before each code update. No loop — plays once, lands on final state.

**Script (4 steps):**

| # | Prompt text | HTML output |
|---|------------|-------------|
| 1 | "Make a delete button" | `<ui-button>Delete</ui-button>` |
| 2 | "Add an icon" | `<ui-button>`<br>`  <ui-icon delete></ui-icon>`<br>`  Delete`<br>`</ui-button>` |
| 3 | "Add edit and save" | `<ui-buttons>`<br>`  <ui-button><ui-icon delete></ui-icon>Delete</ui-button>`<br>`  <ui-button><ui-icon edit></ui-icon>Edit</ui-button>`<br>`  <ui-button><ui-icon save></ui-icon>Save</ui-button>`<br>`</ui-buttons>` |
| 4 | "Emphasize save" | `<ui-buttons>`<br>`  <ui-button subtle-negative><ui-icon delete></ui-icon>Delete</ui-button>`<br>`  <ui-button><ui-icon edit></ui-icon>Edit</ui-button>`<br>`  <ui-button primary><ui-icon save></ui-icon>Save</ui-button>`<br>`</ui-buttons>` |

**Key details:**
- Prompts get lazier/terser as conversation builds context — realistic human behavior
- Step 4 is the money shot: user says "emphasize save" but agent also adds `subtle-negative` to delete — spec-aware compositional reasoning the user didn't ask for
- Rendered UI and code panel layout TBD (try UI above code vs below)
- Timing: natural pace, not rushed. Can tighten later like editing film
- Code transitions: simple opacity swap to start, refine later
- Mobile: non-goal for now

**Code organization:**
- All styles in a standalone CSS file, scoped under an ID (e.g. `#hero-demo`)
- All JS self-contained in `<script>` in index.astro
- Will eventually become a Semantic UI web component — don't design for that now, just don't make it hard (no scattered selectors, no global state)

**Implementation order (piece by piece):**
1. Static prompt bar HTML/CSS — get the visual right with no animation
2. Script data structure — each step's prompt, code, rendered HTML
3. Sequencer JS — steps through script with timing: prompt appears → thinking → resolve
4. Code/UI transitions — simple swap first, polish later

**Copy direction:**
- Sub: Beautiful Markup
- Header: Code Designed to Edit
- Body: Agents write UI that reads like English — so you can manually tweak changes and understand what was generated.
- Features:
  - Semantic attributes — `primary`, `large`, `subtle-negative` — not class soup
  - Every edit is a legible diff a human can review
  - No transpilation gap between what's generated and what runs

### Section Two — "Author Components" (Template Expressiveness)

**Concept:** Show the template syntax doing real work — ternaries, function calls, inline objects, iteration. Demonstrates this isn't dumb string substitution; there's full expression power without a compile step.

Already has the code2 example with `{#each action in actions}`, Lisp-style calls, etc.

**Copy direction:**
- Sub: Component Authoring
- Header: Author Components
- Body: Templates compile to an AST at runtime in the browser. Full expression power — ternaries, nested calls, reactive expressions — no compiler required.
- Features:
  - `{isActive ? 'Yes' : 'No'}` — same power as JSX, no build step
  - Lisp-style or JS-style calls — write templates the way you think
  - Templates are first-class values — pass them as settings, swap layouts at runtime

### Section Three — "Specs as Code Contracts" (The Spec System)

**Concept:** Abridged spec JSON alongside generated markup. Shows the structured data on one side, correct output on the other. The agent didn't hallucinate `subtle-negative` — it read it from a contract.

Abridged spec visual (key elements):
```json
{
  "tagName": "ui-button",
  "types": [
    {
      "name": "Emphasis",
      "usageLevel": 1,
      "options": [
        { "value": "primary", "description": "be emphasized as the first action" },
        { "value": "secondary" }
      ]
    },
    {
      "name": "Social Site",
      "usageLevel": 5,
      "options": ["instagram", "facebook", "twitter"]
    }
  ],
  "variations": [
    { "name": "Size", "usageLevel": 1, "options": ["small", "medium", "large"] },
    { "name": "Circular", "usageLevel": 3 }
  ]
}
```

The `usageLevel: 1` vs `usageLevel: 5` juxtaposition tells the story: agents know not just what's valid, but what's common.

**Copy direction:**
- Sub: Designed for Agents
- Header: Specs as Code Contracts
- Body: Every component ships with a machine-readable spec. Agents read structured contracts — not docs, not examples — to know exactly what's valid, what attributes compose, and what's appropriate.
- One-liner: Specs are a code contract that also inform usage patterns.
- Features:
  - Structured types, variations, and states with natural language descriptions
  - `usageLevel` tells agents what's common vs. niche — no hallucinated `<ui-button instagram>` in a checkout flow
  - Example code per option — agents generate from known-good patterns

---

## Below the Fold — Proof Cards

Three cards (already exist):
1. **Designed for Agents** — specs translate natural language to code
2. **No Build Necessary** — signals, expressions, ESM directly in the browser
3. **Complete UI Library** — full framework with compositionality + JIT Tailwind in shadow DOM

---

## Notes

- The right-side graphic following the user down the page ties all three sections together as one continuous story: agent writes it (section 1) → templates give it power (section 2) → specs make it correct (section 3)
- The hero makes the claim, the tour proves it
- Runtime AST compilation is sub-millisecond for nearly all cases — this is a real no-build story, not "fast enough that you won't notice"
