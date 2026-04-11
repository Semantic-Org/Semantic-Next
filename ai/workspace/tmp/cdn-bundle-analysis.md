# CDN Bundle Preset Analysis

## Architecture Understanding

Before answering, I need to state what I found by reading the actual implementation, because it materially changes how presets should be evaluated.

**What the combo endpoint actually does:** The Worker at `tools/cdn/worker/index.js` generates a tiny JS shim (~N lines of `export * from "..."`) that triggers N parallel browser fetches for individual component files. The browser deduplicates shared framework packages (`component`, `query`, `specs`) by URL identity since those are externalized as CDN imports. However, each component file **inlines its own CSS as a text string** -- this is by far the dominant cost. Button alone is 132KB minified, of which ~121KB is inlined CSS. Most other primitives are 1-25KB.

**What presets cost:** Loading a preset does NOT create a monolithic bundle. It creates 1 shim + N parallel fetches. Each fetched component is individually cached by the browser (immutable, `max-age=31536000`). So the marginal cost of including an unused component in a preset is: one extra HTTP/2 request + the component's file size on first load, then zero on subsequent loads.

**The current presets:**
- `standard` (13 components): button, card, container, divider, icon, image, input, label, menu, modal, segment, spinner, table
- `layout` (6 components): card, container, divider, rail, segment, table
- `form` (1 component): input

---

## Question 1: Agent Decision-Making — Preset vs. Explicit List

As an AI agent building a web interface, my reasoning would proceed in this order:

**Step 1: Do I know exactly which components I need?**

Usually yes. When I receive a prompt like "build a settings page with a form and a modal," I can enumerate the components before writing any HTML: input, button, modal, label, icon. I don't need to guess.

**Step 2: If I know the components, why would I ever use a preset?**

Two reasons, one good, one bad:
1. **Good: The preset is exactly what I need.** If `standard` covers 100% of what I'm building and I don't have to think about whether I missed something, the single word saves cognitive overhead and reduces the chance of a subtle omission.
2. **Bad: I'm being lazy.** If I use `standard` because "it probably has what I need" without checking, I'm trading precision for convenience and potentially loading 8 components I don't use.

**Step 3: What information would tip the decision?**

- **Preset contents**: I need to know exactly what's in the preset. An opaque name like `standard` is worthless without a manifest. If the docs or API don't enumerate the preset's components, I'll always use the explicit list because I can't reason about what I'm loading.
- **How close the preset matches my needs**: If I need 11 of the 13 components in `standard`, the preset is a clear win (one word vs. 11 comma-separated names). If I need 3 of 13, the explicit list is better.
- **Whether the preset is stable**: If `standard` might change between versions, I need to worry about components appearing or disappearing. Explicit lists are version-immune.

**My actual preference as an agent:**

I would default to explicit component lists in almost every case. Here's why:

1. I can enumerate components trivially -- it costs me nothing to write `button,input,modal,icon` instead of `standard`.
2. Explicit lists make the page's dependencies visible. If a human reads my generated HTML, they can see exactly what's loaded.
3. I'm already generating the entire HTML document. Adding a few component names to the script tag URL is negligible effort.

The exception: **prototyping or REPL-style work** where I want "give me everything reasonable" and don't care about optimization. In that case, a preset like `standard` is genuinely useful as a "just make it work" escape hatch.

**A contrarian observation:** The evaluation prompt frames this as "convenience (one word) vs. precision (explicit list)." But for an AI agent, there is almost no convenience benefit to a single word. Agents don't have typos, don't forget component names, and don't find comma-separated lists tedious. The convenience argument is primarily a human one. For agents, presets are useful only when they represent a **semantic contract** -- "these components are designed to work together for this use case" -- rather than merely a shorthand.

---

## Question 2: What Preset Groupings Are Genuinely Useful?

I'll evaluate this by working backwards from the use case, not forward from the component list.

### Preset: `standard`

**Use case:** "I'm building a general-purpose web page and I want the components most people reach for."

**Proposed components (projecting to 80-component 1.0):**
Button, Icon, Input, Label, Image, Divider, Spinner, Modal, Tooltip, Heading, Text, Link, Badge/Label, Alert/Message

**Why this earns its name:** This is the only preset that answers the question "what should I load if I don't know what I need yet?" Every component in `standard` should pass the test: "Would its absence from a general-purpose page be surprising?" If you'd be surprised a button isn't available, it belongs. If you wouldn't notice a QR code generator is missing, it doesn't.

**The current `standard` has 13 components.** At 80 components, it should have roughly 15-20. The critical discipline is keeping it tight. Every addition should face the question: "Would a developer starting a new project with no specific requirements expect this?"

**Components I would challenge in the current standard:**
- `table` -- Tables are common but not universal. Many modern UIs don't use them at all. Borderline inclusion.
- `menu` -- Navigation menus are common enough. Keep it.
- `card` -- Cards are extremely common in modern UI. Keep it.
- `segment` -- This is Semantic UI's box/surface primitive. Keep it.

**Components that should join standard at 1.0:**
- `Heading` and `Text` -- Typography primitives are foundational.
- `Alert`/`Message` -- Feedback is universal.
- `Tooltip` -- Nearly every UI needs hover context.
- `Link` -- If it exists as a component, it's standard.
- `Checkbox` and `Switch` -- Boolean inputs are as fundamental as text inputs.
- `Select`/`Dropdown` -- Selection inputs are universal.

**Projected standard at 1.0 (~20 components):** Button, Icon, Input, Label, Image, Divider, Spinner, Modal, Segment, Container, Card, Table, Menu, Heading, Text, Link, Alert/Message, Tooltip, Checkbox, Select/Dropdown

This is getting large. Which brings me to a key observation...

### Should `standard` exist at all?

Here's the contrarian case: a 20-component preset is doing too much. At that size, almost nobody uses exactly those 20 components. The preset becomes a grab-bag rather than a curated selection. The combo endpoint already supports comma-separated lists that are trivially easy to construct.

**Counter-argument:** `standard` serves a specific social function. It's the answer to "I just want to get started." It's in the docs, in the getting-started guide, in the first example a new user sees. Removing it would force every getting-started example to list 10+ components, which is noisy. The preset's value is pedagogical and ergonomic, not technical.

**My verdict:** Keep `standard`, but cap it at roughly 15 components. Anything beyond that defeats the purpose. If it's more than what fits on one line of a script tag, it's too big.

### Preset: `form`

**Use case:** "I'm building a form."

**Current contents:** Just `input`. That's not a preset, that's a single component.

**What a real form preset needs (at 1.0):** Input, Checkbox, Radio Button, Select, Switch, Textarea, Form, Form Field, Slider, Number Input, Password Input, Date Picker, File Upload

**Why this earns its name:** Forms are a complete vertical. The components involved are tightly coupled -- you rarely use a checkbox without a form field wrapper, rarely use a date picker without also needing an input. Loading them as a set is natural because form pages genuinely use most of them.

**A good form preset should have 8-13 components.** This is the strongest candidate for a preset because form components co-occur at a very high rate. If you're building a form, you probably need most of these.

### Preset: `layout`

**Use case:** "I need structural/layout components."

**Current contents:** card, container, divider, rail, segment, table

**Projected 1.0 contents:** Container, Grid, Flex, Stack, Box, Divider, Segment, Space, Aspect Ratio, Scroll Area

**Assessment:** This is a weak preset. Layout components are foundational -- they get pulled in by almost every page, but you rarely need ALL of them. You either use Grid or Flex, not both. You either use Box or Container, depending on your approach. A developer who needs Grid doesn't predictably need Scroll Area.

**My verdict:** Drop `layout` as a preset. Layout components are too heterogeneous in usage patterns. An agent or developer knows whether they need Grid or Flex. There's no coherent "I need all the layout components" use case.

### Preset: `data` (new proposal)

**Use case:** "I'm building a data-heavy dashboard or admin panel."

**Proposed components:** Table, Chart, Statistic, Pagination, Progress, Skeleton, Empty State, Timeline

**Why this could earn its name:** Data visualization and display is a genuine vertical. Dashboards need tables, charts, statistics, pagination, and loading states as a cohesive set. These components co-occur at a high rate in admin/analytics contexts.

**Assessment:** Interesting but risky. Chart alone might be a heavy component. And "data display" is broad. I'd include this only if the co-occurrence rate is genuinely high. Let me think about what a real dashboard loads... Table + Pagination + Statistic + Progress + Skeleton is a tight core. Chart might be specialized enough to always be loaded explicitly. Timeline is niche.

**My verdict:** Don't create this preset. The components that co-occur tightly (Table + Pagination) are easy to list explicitly. The rest are too situational.

### Preset: `all` (considered and rejected)

Loading all 80 components via a preset seems convenient but is actively harmful. At 80 parallel fetches, you'd saturate the browser's connection pool. HTTP/2 multiplexing helps but 80 files is still excessive. More importantly, `all` communicates "I don't care about what I'm loading" which is the wrong default.

### Final Recommended Presets

**Only two presets earn their name:**

1. **`standard`** (~15 components) -- The "just get started" preset. General-purpose components that 80%+ of pages use. Strict inclusion bar.

2. **`form`** (~10 components) -- Form input components. Tight vertical with high co-occurrence. This is the one preset where an agent would genuinely save effort because form components come as a cohort.

Everything else should be loaded via explicit comma-separated lists. More presets means more names to learn, more documentation to maintain, and more risk of stale groupings.

---

## Question 3: Staleness and Misleading Presets

**Yes, this is a real risk, but the architecture partially mitigates it.**

### Why the architecture helps

Because presets expand to individual, cached files rather than monolithic bundles, the cost of an unused component is:
- **First visit:** One extra HTTP/2 request + the component's file size (typically 2-25KB, with button as the outlier at 132KB due to its extensive CSS)
- **Subsequent visits:** Zero. The file is immutably cached for a year.

This means a `standard` preset that includes 5 components an agent doesn't need costs maybe 50-100KB of extra first-load bandwidth, then nothing. That's materially different from a framework where the preset creates a single 500KB bundle.

### Why staleness is still a problem

The real harm isn't bandwidth -- it's **semantic drift**. If `standard` meant "the 13 most common components" in v1.0 and gradually grows to 25 by v1.5, it stops being a useful mental model. Agents and developers lose confidence in what they're loading.

**Specific risk:** A component that was standard in v1.0 gets deprecated or replaced in v2.0. If the preset keeps it for backwards compatibility, the preset becomes misleading. If the preset removes it, existing pages break.

### The real tradeoff

The question frames this as "convenience vs. precision" but that understates the issue. The real tradeoff is:

**Discoverability vs. Bloat.** A preset teaches new users which components exist and matter. An explicit list requires the user to already know what's available. But a large preset normalizes loading things you don't need.

**Stability vs. Evolution.** Presets are implicit contracts. Once `standard` ships, changing its contents is a breaking change for anyone who depended on a specific component being present. Explicit lists are immune to this.

### My recommendation

Presets should be treated as **stable public API**. Adding a component to a preset is fine (existing pages still work). Removing one is a breaking change. This argues for keeping presets small and conservative -- it's easy to add components to `standard` later, painful to remove them.

The `bundle` field in spec files is the right mechanism -- it makes preset membership a first-class decision reviewed in code review, not an afterthought in a config file. But it needs a corresponding policy: "Adding a component to `standard` requires the same bar as adding a new public API."

---

## Question 4: Drawing the Line for "General Purpose"

### The wrong principle: frequency

"How often is this component used across all websites" is tempting but misleading. By that metric, you'd include `<table>` (used on 60% of pages) and exclude `<dialog>` (used on 5%). But a modern UI framework should include Modal even though tables are statistically more common.

### The wrong principle: simplicity

"Include the simple components" would give you Button, Icon, Divider, Spinner -- but exclude Modal, Menu, and Card, which are complex but clearly general-purpose.

### The right principle: universality of the *need*, not the component

The question is: **"Does this component address a need that exists in virtually every web application?"**

Every app needs:
- **Actions** -- Button (universal)
- **Text input** -- Input (universal)
- **Selection** -- Checkbox, Select (universal)
- **Display** -- Icon, Image, Label (universal)
- **Feedback** -- Spinner, Alert/Message (universal)
- **Structure** -- Container, Segment, Divider (universal)
- **Overlay** -- Modal, Tooltip (universal)
- **Navigation** -- Menu, Link (universal)
- **Typography** -- Heading, Text (universal)
- **Data** -- Card, Table (very common)

Not every app needs:
- **Rich input** -- Color Picker, Date Picker, File Upload (specialized forms)
- **Data visualization** -- Chart, Timeline, Progress (dashboards)
- **Navigation patterns** -- Breadcrumb, Steps, Tabs, Sidebar (specific layouts)
- **Specialized** -- QR Code, Transfer List, Command Palette (niche)

The middle ground components -- Tabs, Breadcrumb, Dropdown, Progress, Accordion -- fail the universality test. Tabs are common but plenty of apps don't use them. Breadcrumbs are a specific navigation pattern. Progress bars are a specific feedback pattern. These are "common but not universal."

### Where I'd draw the line

A component belongs in `standard` if a **generic page template** (not any specific page) would reasonably include it. Think of it as: "If I were creating a blank Semantic UI project with all the components I might need before I know what I'm building, which would I preload?"

That gives roughly 15 components. Anything beyond that is optimizing for a specific type of page.

### The overlooked factor: what an AI agent would preload

For AI agents specifically, there's a different consideration. An agent generating a one-off page from a natural language prompt typically knows exactly what components it needs. The agent doesn't benefit from "general-purpose" presets the way a human developer starting a new project does. For agent use, the combo endpoint with explicit component lists is almost always the better choice.

The preset's real audience is **humans in a getting-started context** and **AI agents doing rapid prototyping** where "good enough" matters more than "precisely right." For production agent output, explicit lists should be the documented best practice.

---

## Summary of Recommendations

1. **Keep exactly two presets:** `standard` (~15 components) and `form` (~10 components). Drop `layout`. Don't add more.

2. **Cap `standard` aggressively.** The bar for inclusion is universality of the underlying need, not frequency of use. If you're debating whether a component belongs, it doesn't.

3. **Treat presets as stable API.** Adding is fine, removing is breaking. This is the strongest argument for keeping presets small.

4. **Document preset contents in the URL response.** The combo endpoint could return a comment at the top of the generated shim listing the resolved components. This makes the preset's contents inspectable without documentation.

5. **Default agent guidance should favor explicit lists.** Presets are for humans getting started and agents prototyping. Production output should use `button,input,modal,icon` not `standard`.

6. **The current `form` preset (just `input`) is not a preset.** Either flesh it out to 8+ form components when they exist, or remove it until those components ship.
