# Chakra UI — Component Documentation Structure
## Component Analyzed: Select
## URL: https://www.chakra-ui.com/docs/components/select

## Section Taxonomy (in page order)

### 0. Page Chrome (persistent across all component pages)
- **Left sidebar**: Component navigation organized by category (e.g. "Collections", "Overlays", "Disclosure"). The current component is highlighted. Categories are collapsible groups.
- **Right sidebar ("On this page")**: Sticky table of contents listing all h2 and h3 anchors on the page. Provides jump links for Usage, Examples (with all sub-examples indented), Props (with sub-parts indented), and Explorer.
- **Top bar**: Global nav with Docs, Showcase, Blog, Guides links. Version selector, search (Cmd+K), GitHub link, and theme toggle.
- **Secondary nav tabs**: Get Started | Components | Charts | Styling | Theming

### 1. Page Header
- **Purpose**: Identify the component and provide quick-access links to related resources.
- **Content type**: Title (h1), one-line description, badge row of outbound links, AI tip callout.
- **Details**:
  - **Breadcrumb**: `Collections > Select` (uses the component's category from the sidebar taxonomy)
  - **Title**: `Select` (h1) with a "Copy Page" button (copies the entire page as markdown for LLM context)
  - **Description**: `Used to pick a value from predefined options.` (single sentence, muted color)
  - **Resource links row**: Four pill-shaped links — **Source** (GitHub component source), **Storybook** (interactive story), **Recipe** (GitHub theme recipe file), **Ark** (underlying headless primitive from Ark UI)
  - **AI Tip callout**: A highlighted inline banner: "Want to skip the docs? Use the MCP Server" with link to MCP setup guide
- **Notes**: The "Copy Page" button is a notable AI-era feature. The resource links establish the component's provenance chain (Ark headless -> Chakra styled). The AI tip is a recent addition promoting their MCP server.

### 2. Hero Example (unnamed, before any heading)
- **Purpose**: Show the component in action immediately, before any explanation.
- **Content type**: Tabbed live preview with "Preview" and "Code" tabs, plus a "Stackblitz" button.
- **Details**: The Preview tab shows a working, interactive Select component. The Code tab shows the full source. This is the same `example-tabs` widget used throughout, but placed prominently before any heading.
- **Notes**: This "show before tell" pattern puts a working example at the very top. No heading wraps it — it sits between the header metadata and the Usage section.

### 3. Usage (h2)
- **Purpose**: Show how to import the component and explain its compositional anatomy.
- **Content type**: Import code block, anatomy code block, prose paragraph.
- **Details**:
  - **Import statement**: `import { Select } from "@chakra-ui/react"` (syntax-highlighted code block)
  - **Anatomy code block**: Full JSX tree showing all sub-components (`Select.Root`, `Select.HiddenSelect`, `Select.Label`, `Select.Control`, `Select.Trigger`, `Select.ValueText`, `Select.IndicatorGroup`, `Select.Indicator`, `Select.ClearTrigger`, `Select.Positioner`, `Select.Content`, `Select.Item`, `Select.ItemGroup`, `Select.ItemGroupLabel`) — dark-themed code block
  - **Setup note**: Short prose paragraph explaining `useListCollection` with a link to the Ark UI list-collection docs
- **Notes**: The anatomy block is not a live preview — it is a static code block showing the full component tree structure. This is key to understanding the compound component API. The section is concise; it does not explain every part.

### 4. Examples (h2)
- **Purpose**: Container heading for all example variations. Has no content of its own.
- **Content type**: Heading only — all content lives under h3 sub-sections.
- **Notes**: This is the largest section of the page by far. All sub-sections follow an identical pattern (documented below).

#### 4.1 Sizes (h3)
- **Purpose**: Show size variants.
- **Content**: One-sentence prose ("Use the `size` prop...") + example-tabs (Preview | Code + Stackblitz).
- **Preview**: Shows xs, sm, md, lg variants stacked vertically.

#### 4.2 Variants (h3)
- **Purpose**: Show visual variants.
- **Content**: Same pattern — prose + example-tabs.

#### 4.3 Color Palette (h3)
- **Purpose**: Explain how to apply color theming.
- **Content**: Multi-sentence prose (explains the neutral default and how to use `colorPalette` token) + example-tabs.
- **Notes**: Slightly longer prose than most examples since the default behavior is non-obvious.

#### 4.4 Option Group (h3)
- **Purpose**: Show how to group options.
- **Content**: Prose + example-tabs.

#### 4.5 Controlled (h3)
- **Purpose**: Show controlled usage pattern.
- **Content**: Prose (mentions `value` and `onValueChange` props) + example-tabs.

#### 4.6 Async Loading (h3)
- **Purpose**: Show loading options from a remote source.
- **Content**: Prose + example-tabs.

#### 4.7 Hook Form (h3)
- **Purpose**: Integration with react-hook-form.
- **Content**: Prose + example-tabs.

#### 4.8 Disabled (h3)
- **Purpose**: Show disabled state.
- **Content**: Prose + example-tabs.

#### 4.9 Invalid (h3)
- **Purpose**: Show error/invalid state composed with Field component.
- **Content**: Prose + example-tabs.

#### 4.10 Multiple (h3)
- **Purpose**: Show multi-select.
- **Content**: Prose + example-tabs.

#### 4.11 Positioning (h3)
- **Purpose**: Show dropdown positioning control via floating-ui.
- **Content**: Prose + example-tabs.

#### 4.12 Clear Trigger (h3)
- **Purpose**: Show clearable select.
- **Content**: Prose + example-tabs.

#### 4.13 Overflow (h3)
- **Purpose**: Show behavior with many options (maxHeight scrolling).
- **Content**: Prose + example-tabs.

#### 4.14 Item Description (h3)
- **Purpose**: Show items with description text.
- **Content**: Prose + example-tabs.

#### 4.15 Open From Popover (h3)
- **Purpose**: Show composition with Popover.
- **Content**: Prose + example-tabs.

#### 4.16 Open From Dialog (h3)
- **Purpose**: Show composition with Dialog, including portalling workaround.
- **Content**: Prose + diff-style code block (showing what to remove) + additional prose + bulleted list of configuration steps + second code block + example-tabs.
- **Notes**: This is the most complex example section — it includes migration-style diff code, a bulleted instruction list, and explanatory prose beyond the typical one-liner. This is the exception that proves the rule: complex integration scenarios get more verbose treatment.

#### 4.17 Avatar Select (h3)
- **Purpose**: Show composition with Avatar component.
- **Content**: Prose + example-tabs.

#### 4.18 Country Select (h3)
- **Purpose**: Show real-world use case (country picker).
- **Content**: Prose + example-tabs.

#### 4.19 Icon Button (h3)
- **Purpose**: Show triggering select from an IconButton.
- **Content**: Prose + example-tabs.

### 5. Props (h2)
- **Purpose**: Complete API reference for the component's props.
- **Content type**: h3 sub-heading + props table.
- **Details**:
  - **Root (h3)**: The only sub-heading under Props. Contains a table with columns: **Prop**, **Default**, **Type**. The table has 41 rows covering all props for `Select.Root`.
  - Each row shows the prop name (with a `*` for required props like `collection`), the default value (if any), and the TypeScript type. Prop descriptions appear as expandable or inline text within cells.
- **Notes**: Only the Root component's props are shown on this page. Other sub-components (Trigger, Content, Item, etc.) do not have separate prop tables here. The table is dense — no grouping or categorization of props.

### 6. Explorer (h2)
- **Purpose**: Interactive anatomy explorer for understanding the component's part structure.
- **Content type**: Prose description + interactive two-panel widget + recipe code block.
- **Details**:
  - **Description**: "Explore the Select component parts interactively. Click on parts in the sidebar to highlight them in the preview."
  - **Interactive explorer**: Left panel shows a live Select preview. Right panel ("Component Anatomy") shows all part names as clickable labels (Label, Positioner, Trigger, Indicator, ClearTrigger, Item, ItemText, ItemIndicator, ItemGroup, ItemGroupLabel, List, Content, Root, Control, ValueText, IndicatorGroup). Clicking a part highlights it in the preview.
  - **Framework selector**: Dropdown to choose React.js, Vue.js, Angular, or Svelte — changes the recipe code shown below.
  - **Recipe code block**: Shows the `select.recipe.ts` file — the slot recipe definition using `selectAnatomy` and `defineSlotRecipe`.
- **Notes**: This is a sophisticated interactive tool unique to Chakra's docs. It bridges the gap between visual output and the component's internal part structure. The multi-framework selector is notable — the anatomy/recipe is framework-agnostic.

### 7. Previous/Next Navigation (footer)
- **Purpose**: Sequential navigation between component pages.
- **Content type**: Two link cards at the page bottom — "Previous: Listbox" and "Next: Tree View".
- **Notes**: Follows the sidebar ordering within the same category (Collections).

### 8. Right Sidebar Extras (persistent)
- **Purpose**: Utility links and promotions.
- **Content type**: Links and promotional card.
- **Details**:
  - "Edit page on GitHub" link
  - "Scroll to top" link
  - Promotional card for "Master Chakra UI" course

## Example Sub-Section Pattern (repeated 19 times)

Every example under the "Examples" heading follows this template:

```
### [Example Name] (h3)
<p> One or two sentences explaining what this example demonstrates,
    typically starting with "Use the `propName` prop to..." or
    "Here's an example of how to..." </p>
<example-tabs>
  [Preview tab] — Live, interactive rendering of the component
  [Code tab]    — Full source code (syntax highlighted)
  [Stackblitz]  — Button to open in Stackblitz
</example-tabs>
```

The only exception is "Open From Dialog" which adds extra prose, a diff code block, a bulleted list, and a second code block before the example-tabs.

## Overall Pattern

Chakra UI's component documentation follows a **"show first, explain second, reference last"** philosophy:

1. **Immediate gratification**: A hero live example appears before any heading, letting developers see and interact with the component before reading a word of explanation.

2. **Minimal usage ceremony**: The Usage section is remarkably short — just an import line, an anatomy tree, and a one-sentence setup note. No lengthy conceptual explanation.

3. **Example-driven learning**: The Examples section dominates the page (~80% of content). Each sub-example is self-contained with consistent structure: short prose + live preview + full source code. Examples progress from basic (sizes, variants) through intermediate (controlled, disabled, invalid) to advanced (async loading, dialog composition, custom triggers).

4. **Compound component API via anatomy**: The component is documented as a tree of named parts (`Select.Root`, `Select.Trigger`, etc.). The anatomy code block and the Explorer widget both reinforce this mental model.

5. **Props as reference, not tutorial**: The Props table is placed near the end, treated as a lookup reference rather than a learning tool. Only the Root component's props are listed.

6. **Interactive explorer as capstone**: The Explorer section at the end provides a novel interactive tool that connects visual output to named parts and recipe code — serving both learning and theming use cases.

7. **Strong outbound linking**: The header links (Source, Storybook, Recipe, Ark) acknowledge the layered architecture and let advanced users drill into each layer.

8. **AI-era features**: The "Copy Page" button (copies full page as markdown for LLM context) and "MCP Server" callout are forward-looking additions that treat AI agents as a first-class audience.

9. **Progressive disclosure by position**: The page flows from visual (hero) to structural (usage/anatomy) to variations (examples) to reference (props) to exploration (explorer). A developer can stop reading at any point and have gotten value proportional to their depth.
