# Headless UI — Component Documentation Structure
## Component Analyzed: Menu (Dropdown), cross-referenced with Combobox and Dialog
## URL: https://headlessui.com/react/menu

---

## Page Header (above all sections)

Before any numbered section, every component page opens with:
- **Component name** as the page title (e.g. "Menu", "Dialog")
- **One-sentence tagline** describing the component's purpose and key traits (accessibility, keyboard features, renderless)
- **Framework toggle** (React / Vue) — same content, different framework syntax
- **Sidebar navigation** with nested links to every section and subsection on the page

---

## Section Taxonomy (in page order)

### 1. Installation
- **Purpose**: How do I add this to my project?
- **Content type**: Single npm install command (`npm install @headlessui/react`)
- **Notes**: Minimal — one line. The package is the same for all components, so this is identical across pages. No version matrix or peer dependency notes.

### 2. Basic example
- **Purpose**: What does a minimal working implementation look like?
- **Content type**: Prose paragraph + complete JSX code example + Preview/Code toggle (live interactive preview)
- **Notes**: This is the "copy-paste and it works" section. Introduces the compositional component API (e.g. `Menu`, `MenuButton`, `MenuItems`, `MenuItem` as separate imports composed together). A short paragraph explains automatic behavior the user gets for free (open/close, keyboard nav, focus management, aria attributes). The preview toggle lets users see the rendered result before reading code.

### 3. Styling
- **Purpose**: How do I style the different states of this component?
- **Content type**: Two subsections, each with prose + code examples

#### 3a. Using data attributes
- **Purpose**: How do I style states with CSS alone?
- **Content type**: Prose explaining `data-*` attributes (e.g. `data-active`, `data-focus`) + HTML output example showing rendered attributes + Tailwind CSS example using `data-*` modifiers
- **Notes**: Links to MDN for CSS attribute selectors. This is the recommended/primary approach.

#### 3b. Using render props
- **Purpose**: How do I style states programmatically in JS?
- **Content type**: Prose + JSX code example using destructured render prop values (`active`, `focus`) for conditional class logic
- **Notes**: Positioned as the alternative approach. Links to React render props documentation.

### 4. Examples
- **Purpose**: How do I handle common real-world scenarios?
- **Content type**: 9-14 subsections (varies by component), each with prose explanation + complete code example
- **Notes**: This is the largest section by far. Subsections are component-specific but follow a progression from simple to advanced. For Menu, the subsections are:

| # | Subsection | Question it answers |
|---|-----------|-------------------|
| a | Using with buttons | How do I add click handlers / form submissions to items? |
| b | Disabling an item | How do I make an item non-interactive? |
| c | Separating items | How do I add visual dividers between items? |
| d | Grouping items | How do I organize items into labeled groups? |
| e | Setting the dropdown width | How do I control the popover width? |
| f | Positioning the dropdown | How do I control where the popover appears? |
| g | Adding transitions | How do I animate open/close with CSS? |
| h | Animating with Framer Motion | How do I animate with a JS animation library? |
| i | Closing menus manually | How do I close the menu from custom code? |
| j | Rendering as different elements | How do I change the underlying HTML element? |
| k | Integrating with Next.js | How do I handle framework-specific routing quirks? |

### 5. Keyboard interaction
- **Purpose**: What keyboard shortcuts are supported out of the box?
- **Content type**: Table with columns: Command, Description
- **Notes**: This is an accessibility-focused reference table. Covers Enter, Space, Escape, Arrow keys, Home/End/PageUp/PageDown, and A-Z type-ahead search. Serves dual purpose: user reference and implicit documentation of built-in a11y behavior.

### 6. Component API
- **Purpose**: What are all the props, data attributes, and render props for each sub-component?
- **Content type**: One subsection per sub-component, each containing up to three tables

For Menu, the sub-components are:
| Sub-component | Default `as` | Notable props | Data attributes | Render props |
|--------------|-------------|--------------|----------------|-------------|
| Menu | Fragment | `as` | `data-open` | `open`, `close` |
| MenuButton | `button` | `as`, `disabled` | `data-open`, `data-focus`, `data-hover`, `data-active`, `data-autofocus` | `open`, `focus`, `hover`, `active`, `autofocus` |
| MenuItems | `div` | `as`, `transition`, `anchor`, `static`, `unmount`, `portal`, `modal` | `data-open` | `open` |
| MenuItem | Fragment | `as`, `disabled` | `data-disabled`, `data-focus` | `disabled`, `focus`, `close` |
| MenuSection | `div` | `as` | — | — |
| MenuHeading | `header` | `as` | — | — |
| MenuSeparator | `div` | `as` | — | — |

**API entry structure per sub-component:**
1. **Component description** — one sentence
2. **Props table** — columns: Prop, Default, Description. The `anchor` prop expands into nested sub-properties (`to`, `gap`, `offset`, `padding`)
3. **Data Attributes table** — columns: Attribute, Description (maps to component states)
4. **Render Props table** — columns: Prop, Description (same states but as JS values passed to render functions)

### 7. Styled examples
- **Purpose**: Where can I find pre-designed, production-ready versions?
- **Content type**: Prose paragraph + promotional image + link to Tailwind Plus (paid component library)
- **Notes**: Cross-sell section. Brief — just a teaser with a CTA. Appears on every component page.

---

## Overall Pattern

Headless UI follows a **"zero-to-production" linear narrative**:

1. **Get it running** (Installation + Basic example) — under 30 seconds to a working component
2. **Make it look right** (Styling) — two approaches offered, CSS-first preferred
3. **Handle your specific case** (Examples) — exhaustive cookbook of real-world scenarios, ordered from common to edge-case
4. **Understand the a11y** (Keyboard interaction) — what you get for free
5. **Look up the details** (Component API) — reference tables, not tutorial prose
6. **Level up** (Styled examples) — escape hatch to premium designs

**Key philosophical choices:**
- **Behavior before appearance**: The entire library is "headless" — docs teach behavior and composition first, styling second. There is no default visual design.
- **Composition over configuration**: Components are small pieces composed in JSX (`Menu` > `MenuButton` + `MenuItems` > `MenuItem`), not a single component with many props. The docs teach this pattern from the very first example.
- **Progressive complexity**: Basic example is ~15 lines. The Examples section handles edge cases one at a time without overwhelming the basic example.
- **Dual styling philosophy**: Every state is exposed as both a data attribute (CSS) and a render prop (JS), and the docs teach both side by side.
- **API reference is a lookup table, not a tutorial**: The Component API section is intentionally dry — no prose explanations, just prop/attribute/render-prop tables. All teaching happens in earlier sections.
- **Framework parity**: React and Vue share the same page structure with a toggle. The docs don't assume React-only patterns.
- **Live previews**: Code examples have a Preview/Code toggle allowing users to see the rendered result before reading implementation details.
- **Consistent structure across all components**: Menu, Combobox, and Dialog all follow the identical 7-section sequence. Only the Examples subsections vary per component.
