# Shadcn/UI — Component Documentation Structure
## Component Analyzed: Combobox (with Button and Dropdown Menu for cross-reference)
## URL: https://ui.shadcn.com/docs/components/radix/combobox

## Section Taxonomy (in page order)

### 1. Title + Description
- **Purpose**: Identify the component and provide a one-sentence summary of what it does.
- **Content type**: H1 heading ("Combobox") followed by a single sentence of prose ("Autocomplete input with a list of suggestions.").
- **Notes**: Immediately after the description, there are variant tabs — "Radix UI" and "Base UI" — allowing the user to toggle between the two underlying headless library implementations of the same component. This is a shadcn-specific pattern: the same component page exists in two flavors. A "Copy Page" button and Previous/Next navigation links sit directly in the header area beside the H1.

### 2. Hero Preview + Code
- **Purpose**: Show the component in action before any instructions. Answer "What does this look like?"
- **Content type**: A live, interactive preview of the component (a real combobox you can click and type into), followed by a collapsed code block (first ~3 lines visible, with a "View Code" button to expand). The code is syntax-highlighted TSX.
- **Notes**: This preview appears _before_ the Installation section — the reader sees the result before they're told how to get it. The code block shows line numbers. No prose accompanies this section; it stands alone as a visual anchor.

### 3. Installation (H2)
- **Purpose**: Answer "How do I add this to my project?"
- **Content type**: Tabbed interface with two top-level tabs:
  - **"Command"** — nested package manager tabs (pnpm / npm / yarn / bun), each showing a one-line CLI command (e.g., `pnpm dlx shadcn@latest add combobox`).
  - **"Manual"** — (collapsed by default) for manual installation steps.
- **Notes**: The tab system is two levels deep: install method (Command vs Manual), then package manager. The CLI command approach is the default/promoted path.

### 4. Usage (H2)
- **Purpose**: Answer "What's the minimal code to use this component?"
- **Content type**: Two consecutive code blocks (no prose):
  1. **Import statement** — shows the exact imports from `@/components/ui/combobox`.
  2. **Minimal working example** — a complete, copy-pasteable TSX function showing the component composed with its sub-components (Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem).
- **Notes**: No explanation accompanies the code. The code _is_ the documentation. This is a "show, don't tell" philosophy. Each code block has a Copy button.

### 5. Guided Patterns (H2-level sections between Usage and Examples)
- **Purpose**: Teach the 1-2 most important non-obvious usage patterns that aren't just visual variants.
- **Content type**: Each is an H2 section with:
  - A one-sentence prose description highlighting the key prop or technique.
  - A full code example (syntax-highlighted TSX with line numbers and Copy button).
- **Sections on the Combobox page**:
  - **Custom Items** — "Use `itemToStringValue` when your items are objects." + full code.
  - **Multiple Selection** — "Use `multiple` with chips for multi-select behavior." + full code.
- **Notes**: These are _conceptual_ patterns, not visual variants. They appear at H2 level (peer to Examples), elevating them above the example gallery. Not all components have this section — the Button and Dropdown Menu pages skip straight from Usage to Examples. The Combobox has them because object items and multi-select are fundamentally different usage modes, not just visual tweaks.

### 6. Examples (H2) — Gallery of Variants
- **Purpose**: Answer "What are all the ways I can configure this component?"
- **Content type**: An H2 heading ("Examples") followed by many H3 sub-sections, each containing:
  1. A short prose description (one sentence, often naming the key prop).
  2. A live interactive preview of the component in that configuration.
  3. A collapsed code block (first ~3 lines visible, expandable via "View Code" button).
- **Sub-sections for Combobox**: Basic, Multiple, Clear Button, Groups, Custom Items, Invalid, Disabled, Auto Highlight, Popup, Input Group.
- **Sub-sections for Button**: Size, Default, Outline, Secondary, Ghost, Destructive, Link, Icon, With Icon, Rounded, Spinner, Button Group, As Child.
- **Sub-sections for Dropdown Menu**: Basic, Submenu, Shortcuts, Icons, Checkboxes, Checkboxes Icons, Radio Group, Radio Icons, Destructive, Avatar, Complex.
- **Notes**: This is the longest section on every page — the bulk of the documentation. The pattern is extremely consistent: every example follows the same [sentence + preview + code] triplet. Some simpler examples (like Button "Default", "Outline") omit the prose sentence and show only preview + code. The "View Code" progressive disclosure keeps the page scannable — the previews are visible and the code is one click away.

### 7. RTL (H2)
- **Purpose**: Show that the component supports right-to-left layouts.
- **Content type**: One sentence of prose linking to the RTL configuration guide, followed by a live preview demonstrating the component in an RTL context (Arabic text), plus a collapsed code block.
- **Notes**: Present on all three pages analyzed. Always near the end, just before API Reference. Standardized across all components — the prose sentence is identical on every page ("To enable RTL support in shadcn/ui, see the RTL configuration guide.").

### 8. API Reference (H2)
- **Purpose**: Answer "What props does this component accept?"
- **Content type**: Varies by component complexity:
  - **Simple components (Button)**: Inline prop table with columns [Prop, Type, Default]. Each sub-component gets its own H3 heading and table. The Button page has an H3 "Button" with a one-sentence description and a 3-row prop table (variant, size, asChild).
  - **Complex components (Combobox, Dropdown Menu)**: A single sentence linking to the upstream headless library's API docs. Combobox: "See the Base UI documentation for more information." (with "Base UI" as a hyperlink to `base-ui.com/react/components/combobox#api-reference`). Dropdown Menu: "See the Radix UI documentation for the full API reference."
- **Notes**: This is a deliberate delegation pattern. Shadcn/UI is a styling/composition layer over headless libraries, so it links out for the exhaustive prop reference rather than duplicating it. Only props that shadcn itself adds (like `variant` and `size` on Button) get inline tables. This keeps the page focused on _how the component looks and composes_ rather than the full headless API surface.

### 9. Previous/Next Navigation (Footer)
- **Purpose**: Sequential navigation through the component catalog.
- **Content type**: Two links — "Previous" (Collapsible) and "Next" (Command) — linking to adjacent components in alphabetical order.
- **Notes**: These appear at the very bottom of the content area, after API Reference. They also appear near the H1 at the top of the page.

### 10. "On This Page" Sidebar (Right Rail)
- **Purpose**: Persistent table of contents for in-page navigation.
- **Content type**: A list of anchor links mirroring all H2 and H3 headings on the page (Installation, Usage, Custom Items, Multiple Selection, Examples > Basic/Multiple/Clear Button/Groups/..., RTL, API Reference).
- **Notes**: The H3 items (examples) are visually indented under their parent H2. This sidebar stays fixed as you scroll. The heading "On This Page" labels it.

## Supplementary Page Elements

### Variant Tabs (Radix UI / Base UI)
- Appears directly below the title description.
- Allows switching between two different headless library implementations of the same component.
- The current variant is visually indicated (e.g., "Radix UI" logo shown).

### Vercel Deploy CTA
- A promotional banner at the very bottom of the page: "Deploy your shadcn/ui app on Vercel."
- Not part of the documentation content.

## Overall Pattern

Shadcn/UI documentation follows a **"see it, install it, use it, explore it"** flow:

1. **Visual-first**: The hero preview appears before any instructions. The reader knows what the component looks like before they read a single line of documentation.

2. **Copy-paste oriented**: Every section is designed to be copy-pasted. Import statements, CLI commands, and full working examples are all provided as discrete, self-contained code blocks with Copy buttons.

3. **Progressive disclosure on code**: Live previews are always visible; source code is collapsed behind "View Code" buttons. This keeps the page scannable — you can scroll through 10+ examples seeing only the rendered output, expanding code only when you need it.

4. **Pattern-first, API-last**: The bulk of the page is examples showing composition patterns. The API reference is minimal (often just a link to the upstream library). The philosophy is that you learn by seeing examples, not by reading prop tables.

5. **Consistent triplet structure**: Nearly every example follows the same atomic unit: [one-sentence description] + [live preview] + [expandable code block]. This consistency makes the page highly predictable and scannable.

6. **Separation of concepts from variants**: Important conceptual patterns (Custom Items, Multiple Selection) are elevated to H2-level sections between Usage and Examples. Visual variants (sizes, states, configurations) live in the Examples gallery at H3 level. Not all components need the conceptual layer — simpler ones go straight from Usage to Examples.

7. **Delegation over duplication**: API documentation for the underlying headless library is linked, not duplicated. Only shadcn-specific additions (like `variant` and `size` props on Button) get inline documentation. This keeps the focus on the styling and composition layer that shadcn provides.

8. **RTL as a standard section**: Every component page includes an RTL section with a live demo, treating internationalization as a first-class concern rather than an afterthought.
