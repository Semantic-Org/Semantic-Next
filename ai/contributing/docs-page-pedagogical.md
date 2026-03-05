---
title: Writing Lessons (Learn REPL)
description: How to write interactive lessons for the Semantic UI Learn section — standalone REPLs that sequentially teach framework concepts.
keywords: [lessons, Learn REPL, interactive tutorials, challenges, code-first, pedagogical]
audience: contributing
skill: docs-page-pedagogical
---

# Writing Lessons (Learn REPL)

> **Skill:** `sui:docs-page-pedagogical`
> **Purpose:** How to write interactive lessons for the Semantic UI Learn section — standalone REPLs that sequentially teach framework concepts

---

## What Lessons Are

Lessons are standalone interactive REPLs that teach Semantic UI concepts sequentially. Each lesson pairs prose explanation (left panel) with a live code playground (right panel) where the reader edits and runs real components. A live preview renders the component output.

Lessons are grouped into learning tracks (Quickstart, Basic Guide, Advanced Guide, etc.) and ordered within subcategories. The reader navigates linearly with Previous/Next buttons or jumps via the sidebar menu.

**Reference model:** [Svelte's interactive tutorial](https://svelte.dev/tutorial)
**Prerequisite reading:** Load `sui:docs-examples-authoring` — lessons wrap the same playground system used for documentation examples.

---

## Layout

The lesson UI has three areas:

1. **Left panel** — Prose content from `index.mdx`. Includes Previous/Next navigation and a Resources button for reference links.
2. **Code editor** (center) — Tabbed file editor showing the lesson's code files (`component.js`, `component.html`, `component.css`, `page.html`, `page.js`). The reader can edit code live.
3. **Preview pane** (right) — Live render of the component. Updates as code changes.

The bottom bar has a **Resources** button (shows `references` from frontmatter) and a **Layout** toggle (tabs vs panels). Lessons with a `solution/` directory get a **Solve** button that swaps in the solution code.

---

## File Structure

Each lesson is a directory in `/docs/src/content/lessons/`:

```
lessons/
├── selection/              # Landing page (sort 0.1.1)
│   └── index.mdx
├── 111-introduction/       # Quickstart lesson 1
│   ├── index.mdx           # Prose content
│   └── example/            # Starting code
│       ├── component.js
│       ├── component.html
│       ├── component.css
│       └── page.html
├── 211-hello-world/        # Basic Guide lesson 1
│   ├── index.mdx
│   ├── example/            # Starting code
│   │   ├── component.js
│   │   └── ...
│   └── solution/           # Challenge answer
│       ├── component.js
│       └── ...
```

### Files in `example/` and `solution/`

| File | Purpose | When to include |
|------|---------|-----------------|
| `component.js` | Component definition and logic | Always |
| `component.html` | Template markup (separate file) | Multi-file components |
| `component.css` | Component styles | When the lesson involves styling |
| `page.html` | HTML page that uses the component | When demonstrating usage context |
| `page.js` | Page-level JavaScript | When demonstrating external interaction (e.g., `component()` method, `$().settings()`) |

The `solution/` directory mirrors `example/` with the completed challenge code. Only include `solution/` for lessons that have a "Try It Yourself" section.

---

## Numbering and Sorting

Directory names follow the pattern `{3-digit-number}-{slug}/`. The three digits encode hierarchy:

| Digit | Meaning | Example |
|-------|---------|---------|
| First | Category | `1` = Quickstart, `2` = Basic Guide, `3` = Advanced Guide, `4` = UI Framework, `5` = Open Source Guide |
| Second | Subcategory | Within `2xx`: `1` = Getting Started, `2` = Core Concepts |
| Third | Sequence | Order within subcategory |

The `sort` frontmatter field is a semver string derived from the digits: directory `221-state-reactivity` has `sort: '2.2.1'`. The navigation system uses semver comparison to order lessons and build the sidebar menu.

### Naming a new lesson

1. Identify which category and subcategory the lesson belongs to
2. Find the highest existing sequence number in that subcategory
3. Increment by 1 for the new lesson
4. Choose a short, descriptive slug: `223-event-handling`, not `223-learning-about-how-events-work`

---

## Frontmatter Schema

```yaml
---
title: State and Reactivity           # Display title (required)
category: 'Basic Guide'               # Category name (required) — must match other lessons in same 1st digit
subcategory: 'Core Concepts'          # Subcategory name (required) — must match other lessons in same 2nd digit
description: Learn how to use reactive state  # Short description (required)
sort: '2.2.1'                         # Semver sort string (required) — must match directory numbering
references:                            # Related docs (optional, recommended)
  - title: Reactivity System
    link: /reactivity
  - title: Signal API
    link: /api/reactivity/signal
selectedFile: component.html           # Tab to show initially (optional) — defaults to component.js
hint: Try using state.count.increment() # Help text for challenges (optional)
shortTitle: State                      # Abbreviated title for menus (optional)
tags: [reactivity, signals, state]     # Search tags (optional)
hidden: true                           # Hide from navigation (optional)
hideNavigation: true                   # Hide prev/next buttons (optional) — only for selection page
---
```

**Required fields:** `title`, `category`, `subcategory`, `description`, `sort`

The `category` and `subcategory` strings must be identical across all lessons sharing the same first or second digit. The sidebar menu derives group names from the first lesson encountered in each group.

### Discovering references

Each lesson should include 2-4 `references` linking to relevant guide and API pages. The reader sees these in the **Resources** modal (bottom bar). To find appropriate references, use the Semantic UI MCP server:

1. **Search by topic** — `mcp__semantic-ui__search` with the lesson's concept (e.g., "reactivity signals state") returns matching docs, examples, and context files ranked by relevance.

2. **Browse the doc tree** — `mcp__semantic-ui__list_user_docs` returns every guide and API page with its path and title. Scan this to find related pages the search may have missed.

3. **Build the URL** — Doc paths from the MCP are relative to the Astro base folder (`docs/`), so use them directly with a leading `/`: path `guides/components/state` becomes `/guides/components/state`. For anchor links to specific sections, append `#section-name`. You can confirm a path exists by checking for the file at `docs/src/pages/docs/{path}.mdx`.

**Example workflow** for a lesson about state reactivity:

```
# 1. Search for relevant docs
mcp__semantic-ui__search  query: "state reactivity signals"

# Results include:
#   guides/reactivity/signals       → "Signals"
#   guides/components/state         → "Internal State"
#   api/reactivity/signal           → "Signal"
#   api/reactivity/array-helpers    → "Array Helpers"

# 2. Pick the most relevant 2-4 and format as references:
references:
  - title: Internal State
    link: /guides/components/state
  - title: Signals Guide
    link: /guides/reactivity/signals
  - title: Signal API
    link: /api/reactivity/signal
```

Choose references that help the reader go deeper on the lesson's concept — a guide page for explanation and an API page for details is a good pairing. Don't include every tangentially related page.

---

## Two Lesson Formats

### 1xx Quickstart — Read-Along Walkthroughs

These are guided tours through pre-written code. The reader reads the prose and studies the code but doesn't modify it.

**Characteristics:**
- `example/` only, no `solution/`
- Shorter, conversational prose with bullet points
- Uses `###` headers (not `##`) — appropriate for lighter content
- Explains what the code does and why
- No "Try It Yourself" challenge

**Example structure:**
```markdown
### Your First Component

`defineComponent` is used to define any UI you would like to reuse.

In this example we use some of the most common features:

* **Tag Name** - A custom element to assign your component to.
* **Template** - A template that specifies the html rendered.
* **CSS** - CSS scoped to your component.
* **State** - A signals based reactivity store.
```

### 2xx+ Basic Guide and Beyond — Challenge-Based

These teach a concept, show working code, then ask the reader to extend it.

**Characteristics:**
- Both `example/` and `solution/` directories
- More structured prose with `##` headers
- Numbered key concepts with documentation links
- "Understanding the Code" section referencing specific files
- "Try It Yourself" challenge with hints
- Solve button available to reveal the answer

**Example structure:**
```markdown
## State and Reactivity

Reactivity is the heart of Semantic UI components.

## Key Concepts

1. **Component Definition**: The [`defineComponent`](/docs/guides/...) function creates a web component.
2. **Template**: The template contains HTML with [expressions](/docs/guides/...) in curly braces.

## Understanding the Code

Looking at [component.js](#component.js), notice how:
- `defaultState` initializes a counter
- We use [`.set()`](/docs/guides/...) to update values

## Try It Yourself

Enhance the counter to include:
1. A reset button that sets the counter to zero
2. A "step" feature that increments by a configurable amount
```

---

## Writing the Prose

### Principles

**Code is primary.** The code editor is the centerpiece of the lesson. Prose explains, contextualizes, and motivates — it doesn't replace reading the code. Keep prose short. The reader should spend most of their time in the code.

**One concept per lesson.** Each lesson should teach a single framework concept (state, settings, events, file structure). Don't combine unrelated ideas.

**Progressive complexity.** Lessons within a track build on each other. Early lessons use inline templates and minimal features. Later lessons introduce file separation, settings, events, and advanced patterns. Don't reference concepts the reader hasn't seen yet.

**Link to documentation.** Inline links connect lesson concepts to full documentation. Link on first mention using the pattern `[`defineComponent`](/docs/guides/components/create#defining-components)`. This lets curious readers go deeper without bloating the lesson.

### Prose style

- 1-2 sentence paragraphs. No walls of text.
- Bullet lists for enumerating features or observations about code.
- Blockquotes with `> **Note:**` for tips, not for emphasis.
- Use inline code for identifiers: `` `defineComponent` ``, `` `state.count` ``, `` `onCreated` ``.
- Don't explain what's obvious from the code. Focus on *why* and *how things connect*.
- Don't use marketing language ("powerful", "flexible", "elegant").
- Don't write concluding summaries. The lesson ends when the content ends.

### Referencing code files

Link to files using `[component.js](#component.js)` or `[component.html](#component.html)`. The LearnExample component converts these into clickable links that switch to the corresponding tab in the code editor.

For page files, use `[page.html](/#page.html)` (note the leading `/`).

Use `selectedFile` in frontmatter to control which tab is shown when the lesson loads (defaults to `component.js`). Set this when the lesson's main focus is the template or CSS.

### Playground-fold comments

Use `/* playground-fold */` and `/* playground-fold-end */` in code files to collapse implementation details the reader doesn't need to focus on. The collapsed region shows as `...` with an expand toggle. This is useful in early lessons where you want to show the `defineComponent` call without exposing complex helper logic.

```javascript
/* playground-fold */
const createComponent = ({ state, settings }) => ({
  // complex implementation the reader shouldn't focus on yet
  dateSettings() {
    return { timezone: getTimezone(settings.timezone) };
  },
});
/* playground-fold-end */
```

---

## Writing the Code

### How the playground works

Lessons use the same playground system as documentation examples. Understanding its behavior is essential for writing code that works correctly in the REPL.

**Automatic injections:** The playground automatically injects:
- The SUI core library (`semantic-ui.js` + `semantic-ui.css`)
- An error interceptor for runtime error display
- An auto-generated `page.html` wrapper if none is provided

**File layout in the editor:**
- Component files (`component.js`, `component.html`, `component.css`) appear as the primary tabs in the left pane
- Page files (`page.html`, `page.css`, `page.js`) appear as secondary tabs in the right pane
- The `selectedFile` frontmatter field controls which tab is active on load

**Script load order:** `page.css` → error interceptor → `component.js` → `page.js`. This means `page.js` can safely reference components defined in `component.js`.

**Auto-generated page.html:** If you don't provide a `page.html`, the system generates one containing your component's tag. Provide a custom `page.html` when you need to show multiple instances, pass attributes, or demonstrate usage context.

### General principles

- Code must run. Every `example/` must produce a working component in the preview pane. Broken starting code frustrates readers.
- Code should be clean and readable. Use clear variable names, consistent formatting, and minimal complexity.
- Only show what the lesson teaches. Don't include features that haven't been introduced yet.
- Use CSS variables from the Semantic UI theme (`var(--padding)`, `var(--primary-text-color)`, `var(--border-radius)`) rather than hardcoded values where reasonable. This demonstrates the theming system and looks correct in both light and dark mode.

### CSS standards

Lesson code follows the same CSS standards as all playground examples. Load `sui:docs-examples-authoring` for the full reference.

- **Use design tokens, not hardcoded values.** Colors, spacing, borders, radii, and transitions should use CSS variables: `var(--border)`, `var(--padding)`, `var(--primary-text-color)`, `var(--border-radius)`, `var(--standard-5)`.
- **Use CSS nesting.** Nest child selectors and state variants with `&`:

```css
.container {
  padding: var(--padding);
  border: var(--border);

  .header {
    color: var(--header-color);
    font-weight: var(--bold);
  }

  &.active {
    background: var(--primary-background-color);
  }
}
```

- **Use simple class names.** Shadow DOM provides scoping, so prefer `.card`, `.header`, `.content` over `.profile-card`, `.card-header`, `.card-content`. No dashed class names.
- **No raw `<button>` elements** in page files. Use `<ui-button>` to dogfood the framework and ensure dark mode compatibility. Inside component templates, plain `<button>` is fine since the component controls its own styling.

### Query variable conventions

Prefix DOM query results with `$`:
```javascript
const $button = $('.button');
const $container = $('.container');
```

### Inline vs multi-file components

Early introductory lessons (e.g., 113) can use inline templates and CSS in `component.js`:

```javascript
defineComponent({
  tagName: 'current-time',
  template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  // ...
});
```

Once file separation is introduced (lesson 115+), use `getText` to load external files:

```javascript
import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');
```

### Component patterns to demonstrate

Semantic UI components follow a consistent structure. Lessons should introduce these patterns incrementally:

| Pattern | When to introduce | Key points |
|---------|-------------------|------------|
| `tagName` | First lesson | Components register as custom HTML elements |
| `template` / `css` | First lesson | Inline or loaded from files |
| `defaultState` | Early | Reactive internal data. Use `.get()`/`.set()` in JS, direct access in templates |
| `onCreated` | Early | Lifecycle callback, receives destructured args |
| `createComponent` | Mid | Returns the component instance. Methods become part of the data context |
| `defaultSettings` | Mid | Public config via HTML attributes. Reactive proxy — no `.get()`/`.set()` |
| `events` | Mid | Event delegation with `'click .selector'` syntax |
| Template expressions | Throughout | `{value}`, `{helper arg1 arg2}`, `{#if}`, `{#each}` |
| `$` / `$$` querying | Later | Shadow DOM-aware DOM queries |
| `findParent`/`findChild` | Later | Component tree navigation |
| `dispatchEvent` | Later | Custom event communication |

### Template syntax reminders

Lessons are where readers first encounter Semantic UI templates. These are common patterns to demonstrate correctly:

```html
<!-- Variable interpolation -->
{name}
{user.email}

<!-- Helper calls (spaced Lisp-style — preferred in Semantic UI) -->
{formatDate time 'h:mm:ss a'}

<!-- Equivalent JS-style -->
{formatDate(time, 'h:mm:ss a')}

<!-- Conditionals -->
{#if isActive}
  <div class="active">Online</div>
{else}
  <div>Offline</div>
{/if}

<!-- Iteration -->
{#each item in items}
  <div>{item.name}</div>
{/each}

<!-- Ternary in attributes (no #if needed) -->
<div class="{isActive ? 'active' : 'inactive'}">

<!-- Boolean attribute (unquoted = removed when falsy) -->
<input type="checkbox" checked={isChecked} />
```

### Common design tokens

These tokens are verified from existing lessons and examples. Use these instead of hardcoded values:

```css
/* Layout */
var(--padding)              /* Standard padding */
var(--border)               /* Standard border */
var(--border-radius)        /* Standard border radius */
var(--margin)               /* Standard margin */
var(--vertically-spaced)    /* Vertical spacing between elements */

/* Colors (theme-adaptive) */
var(--standard-5)           /* Light background */
var(--standard-20)          /* Muted text */
var(--standard-80)          /* Strong text */
var(--primary-color)        /* Primary brand color */
var(--primary-text-color)   /* Primary-colored text */
var(--primary-hover)        /* Primary hover state */
var(--header-color)         /* Header text color */
var(--text-color)           /* Standard text color */

/* Semantic colors */
var(--green)                /* Success color */
var(--red)                  /* Error/negative color */

/* Typography */
var(--bold)                 /* Bold font weight */
var(--small)                /* Small font size */
var(--medium)               /* Medium font size */
var(--h3)                   /* H3 font size */
var(--tiny)                 /* Tiny font size */

/* Effects */
var(--transition)           /* Standard transition */
var(--duration)             /* Standard duration */
var(--subtle-shadow)        /* Subtle box shadow */
var(--circular-radius)      /* Fully round radius */
```

For a complete reference, load `sui:tokens` and verify tokens against `/src/css/tokens/`.

### Reactivity patterns

When demonstrating state, show the two access patterns clearly:

```javascript
// In JavaScript — explicit signal API
state.count.get()         // read
state.count.set(5)        // write
state.count.increment()   // helper
state.isOpen.toggle()     // boolean helper

// In templates — automatic unwrapping (no .get())
// {count}  ← the framework calls .get() for you
```

When demonstrating settings, emphasize the proxy pattern:

```javascript
// Settings use a reactive proxy — direct assignment triggers updates
settings.theme = 'dark';           // reactive
const { theme } = settings;       // breaks reactivity (captures static value)
```

---

## Challenge Design (Try It Yourself)

Good challenges:
- Build directly on the code already shown
- Have a clear, achievable goal (add a reset button, make a value configurable)
- Require using the concept the lesson just taught
- Include 2-3 numbered hints that guide without giving the full answer
- Have a corresponding `solution/` that demonstrates one correct approach

Bad challenges:
- Require concepts not yet taught
- Are too vague ("make it better")
- Are too trivial ("change the text color")
- Have only one possible solution path

### Solution code

The solution should be a minimal, clean extension of the example code. Don't refactor the entire component — just add what the challenge asked for. The diff between `example/` and `solution/` should be easy to follow.

---

## Choosing What to Teach

### Concept sequencing

Within a track, order concepts from fundamental to derived:

1. What a component is, `defineComponent`, `tagName`
2. Templates and expressions
3. Styling with CSS (Shadow DOM scoping, CSS variables)
4. Internal state (`defaultState`, signals, reactivity)
5. File separation (`getText`, multi-file structure)
6. Settings (`defaultSettings`, HTML attributes, reactive proxy)
7. Component methods (`createComponent`, `self`, data context)
8. Events (event delegation, `dispatchEvent`)
9. Lifecycle callbacks (`onCreated`, `onRendered`, `onDestroyed`)
10. Querying (`$`, `$$`, shadow DOM)
11. Component communication (`findParent`, `findChild`, custom events)

### What makes a good lesson topic

- Introduces exactly one concept or closely related pair
- Can be demonstrated with a small, self-contained component
- Produces a visible result in the preview pane
- Builds naturally on what came before

### What doesn't work as a lesson

- Pure API reference (use docs instead)
- Concepts that need a large application context
- Topics that don't produce visible output

---

## Step-by-Step: Creating a New Lesson

1. **Read prerequisites** — This guide, `sui:docs-examples-authoring`, and 2-3 existing lessons similar to what you're creating
2. **Identify the concept** and where it fits in the learning sequence
3. **Determine the directory number** based on category, subcategory, and sequence
4. **Create the directory** with the naming pattern `{number}-{slug}/`
5. **Write the example code** — a working component that demonstrates the concept
6. **Write the prose** — explain the concept, reference the code, link to docs
7. **Write the challenge** (for 2xx+ lessons) — extend the example in a focused way
8. **Write the solution** — clean, minimal implementation of the challenge
9. **Set frontmatter** — ensure `sort`, `category`, and `subcategory` match the numbering scheme and existing lessons in the same group
10. **Add references** — link to relevant documentation pages
11. **Verify code quality** — run through workflow `docs-examples-self-critique` for the code files
12. **Test** — verify the example code renders correctly in the playground and the solution works. Load `sui:docs-examples-debugging` if Chrome DevTools MCP is available.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Too much prose, not enough code | Cut prose. The code editor is the lesson. |
| Example code doesn't run | Always test in the playground before committing |
| Challenge requires untaught concepts | Keep challenges within the lesson's scope |
| `category`/`subcategory` strings don't match siblings | Copy exact strings from neighboring lessons |
| Using `##` headers in Quickstart lessons | Quickstart uses `###`, Basic Guide uses `##` |
| Explaining obvious code | Focus on *why*, not *what* |
| Missing file links | Use `[component.js](#component.js)` for editor tab links |
| Hardcoded colors/sizes in CSS | Use design tokens: `var(--padding)`, `var(--primary-color)` |
| Flat CSS without nesting | Use CSS nesting with `&` for state variants and child selectors |
| Dashed class names (`.nav-item`) | Use simple names (`.item`, `.nav`). Shadow DOM provides scoping |
| Raw `<button>` in page.html | Use `<ui-button>` in page files for dark mode compatibility |
| Query variables without `$` prefix | Always prefix: `const $el = $('.selector')` |
| Solution is a complete rewrite | Solution should be a minimal diff from the example |
| No documentation links in prose | Link key terms to their docs on first mention |
