# Radix UI -- Component Documentation Structure

Radix UI ships two documentation layers for each component: **Themes** (styled, opinionated) and **Primitives** (unstyled, headless). They share a common skeleton but diverge in depth. Both are analyzed below.

---

## Part A: Radix Themes (Styled Components)

### Component Analyzed: Select
### URL: https://www.radix-ui.com/themes/docs/components/select

### Section Taxonomy (in page order)

#### 1. Title + One-Liner
- **Purpose**: Instant identification -- what is this component and what does it do?
- **Content type**: H1 heading + single sentence of prose.
- **Exact text**: "Select" / "Displays a list of options for the user to pick from -- triggered by a button."
- **Notes**: No badge, no version indicator, no link to source. Pure description.

#### 2. Hero Code Example
- **Purpose**: Show a complete, realistic usage in a single glance. Answers "what does using this look like?"
- **Content type**: Full JSX code block (not a snippet -- a complete working component with grouped items, disabled state, separator).
- **Notes**: There is NO live interactive preview on Themes docs. Code-only. This is different from many other design system docs (e.g., Storybook-style). The example is the first thing after the description, with no heading -- it sits in an implicit "intro" zone.

#### 3. API Reference
- **Purpose**: Exhaustive prop documentation for every sub-component part.
- **Content type**: Heading (H2) followed by sub-component sections (each effectively H3).
- **Sub-sections** (in order):
  - **Root** -- props table (Prop | Type | Default). Notes inheritance from Select primitive Root.
  - **Trigger** -- props table + brief prose description ("The button that toggles the select"). Props: variant, color, radius, placeholder.
  - **Content** -- props table. Props: variant, color, highContrast. Notes inheritance from Select.Portal and Select.Content primitives.
  - **Item** -- single-line description with inheritance note.
  - **Group** -- single-line description with inheritance note.
  - **Label** -- single-line description with inheritance note.
  - **Separator** -- single-line description with inheritance note.
- **Notes**: Props tables have 3 columns: **Prop**, **Type**, **Default**. Types use union syntax (e.g., `"1" | "2" | "3"`). Responsive wrapper type appears for size-related props (`Responsive<...>`). Simpler sub-components (Item, Group, Label, Separator) get only a one-liner -- no table. "Inherits props from X primitive" is a common pattern that links conceptually to the Primitives docs layer.

#### 4. Examples
- **Purpose**: Progressive gallery of visual/behavioral variations. Each answers "how do I customize X?"
- **Content type**: H2 heading, then a series of H3 sub-sections. Each sub-section has: 1-2 sentences of prose + a full JSX code block.
- **Sub-sections** (in order):
  1. **Size** -- demonstrates size="1" / "2" / "3" in a Flex layout.
  2. **Variant** -- shows "surface", "classic", "soft" variants side-by-side.
     - **Ghost** (nested sub-example) -- dedicated explanation of ghost variant behavior with visual comparison. This is the only example with deeper nesting.
  3. **Color** -- four color variations (indigo, cyan, orange, crimson) applied to both Trigger and Content.
  4. **High-contrast** -- side-by-side default vs. highContrast.
  5. **Radius** -- three values: "none", "large", "full".
  6. **Placeholder** -- using placeholder prop without defaultValue.
  7. **Position** -- position="popper" for popover-style positioning.
  8. **With SSR** -- functional component pattern to prevent hydration layout shift.
  9. **With an Icon** -- custom Trigger children with icon, theme switcher pattern.
- **Notes**: Examples are ordered from simplest customization (size) to most advanced pattern (SSR, custom triggers). Each example is self-contained and copy-pasteable. There are no live previews -- code only. The progression follows a clear taxonomy: **visual props first** (size, variant, color, contrast, radius) then **behavioral props** (placeholder, position) then **integration patterns** (SSR, composition).

#### 5. Right-Side TOC ("On This Page")
- **Purpose**: Jump navigation for the current page.
- **Content type**: Sticky sidebar with anchor links.
- **Entries**: API Reference, Root, Trigger, Content, Item, Group, Label, Separator, Examples, Size, Variant, Ghost, Color, High-contrast, Radius, Placeholder, Position, With SSR, With an icon.
- **Notes**: Shows both H2 and H3 levels. API sub-components and Example sub-sections are all visible in the TOC, making it a flat scannable list.

### Themes Page -- Sections NOT Present
- No Installation section (Themes components are available via the Radix Themes package).
- No Anatomy section.
- No Features bullet list.
- No Accessibility section.
- No Keyboard Interactions table.
- No "Custom APIs" / abstraction patterns section.
- No live interactive preview/playground.
- No "Import" code block.

---

## Part B: Radix Primitives (Headless Components)

### Component Analyzed: Select
### URL: https://www.radix-ui.com/primitives/docs/components/select

### Section Taxonomy (in page order)

#### 1. Title + One-Liner
- **Purpose**: Same as Themes -- instant identification.
- **Content type**: H1 + single sentence.
- **Exact text**: "Select" / "Displays a list of options for the user to pick from -- triggered by a button."

#### 2. Features
- **Purpose**: Sell the component's capabilities upfront. Answers "why should I use this instead of a native select or building my own?"
- **Content type**: Bulleted list of capabilities.
- **Items include**: Controlled/uncontrolled, positioning modes, keyboard navigation, typeahead, RTL support.
- **Notes**: This is a compact "feature card" -- no prose elaboration, just terse bullet points. Sets expectations before showing any code.

#### 3. Installation
- **Purpose**: How to add this to your project.
- **Content type**: Brief prose + bash code snippet (`npm install @radix-ui/react-select`).
- **Notes**: Single package manager shown. No tabs for yarn/pnpm/bun (unlike shadcn/ui).

#### 4. Anatomy
- **Purpose**: Show the compositional structure -- all the parts and how they nest. Answers "what pieces exist and how do they fit together?"
- **Content type**: Prose intro ("Import all parts and piece them together.") + large JSX code block showing the full component tree with every sub-component.
- **Notes**: This is a critical section unique to Primitives. It teaches the mental model of the compound component pattern. The code is not runnable -- it's a structural skeleton.

#### 5. API Reference
- **Purpose**: Exhaustive per-part prop documentation.
- **Content type**: H2 heading, then one H3 sub-section per sub-component.
- **Sub-components documented**: Root, Trigger, Value, Icon, Portal, Content, Viewport, Item, ItemText, ItemIndicator, ScrollUpButton, ScrollDownButton, Group, Label, Separator, Arrow.
- **Per sub-component layout**:
  1. Brief prose description (1 sentence).
  2. **Props table** with columns: Prop | Type | Default.
  3. **Data Attributes table** (where applicable) showing `data-*` attributes and their possible values.
  4. **CSS Variables table** (where applicable, mainly on Content) listing custom properties.
- **Notes**: Significantly more sub-components documented than the Themes layer (16 vs. 7). This is because Themes abstracts away many inner parts. The Primitives layer documents the full compositional surface.

#### 6. Examples
- **Purpose**: Show common usage patterns and edge cases.
- **Content type**: H2 heading, then H3 sub-sections. Each has prose + JSX code block, sometimes paired with a CSS code block.
- **Sub-sections**:
  1. Change the positioning mode
  2. Constrain the content size
  3. With disabled items
  4. With a placeholder
  5. With separators
  6. With grouped items
  7. With complex items
  8. Controlling the value displayed in the trigger
  9. With custom scrollbar
- **Notes**: Examples are more task-oriented than Themes (which is prop-oriented). Themes examples map 1:1 to props. Primitives examples map to user goals/scenarios. Some examples include CSS alongside JSX.

#### 7. Accessibility
- **Purpose**: Document ARIA compliance and keyboard behavior.
- **Content type**: H2 heading with sub-sections.
- **Sub-sections**:
  - General prose referencing WAI-ARIA ListBox design pattern.
  - **Keyboard Interactions** -- table with columns: Key | Description. Documents Space, Enter, ArrowDown, ArrowUp, Esc.
  - **Labelling** -- prose + JSX example showing how to use Label component for a11y.
- **Notes**: This section is entirely absent from the Themes layer. It exists only at the Primitives level, which makes sense -- Primitives users need to know what they're getting for free; Themes users get it automatically.

#### 8. Custom APIs
- **Purpose**: Show how to wrap Primitives into a simpler, project-specific API.
- **Content type**: H2 heading, then a pattern with two parts: "Usage" (the clean API you'd expose) and "Implementation" (the wrapper component code).
- **Notes**: This is a pedagogical "best practice" section. It teaches composition patterns. The title "Abstract down to Select and SelectItem" frames it as simplification. This effectively bridges the gap between Primitives (many parts) and a Themes-like API (few parts).

### Primitives Page -- Right-Side TOC
Entries: Installation, Anatomy, API Reference (+ all sub-components), Examples (+ all sub-examples), Accessibility, Custom APIs. Shows H2 and H3 nesting.

---

## Part C: Cross-Cutting Patterns

### Documentation Philosophy

1. **Two-layer architecture**: Radix splits docs into "how to use it" (Themes) and "how it works" (Primitives). Themes is consumer-facing; Primitives is builder-facing. This is a deliberate progressive disclosure strategy -- most users never need to read the Primitives docs.

2. **Code-first, not preview-first**: Neither layer leads with a live interactive demo. The hero content is always a code example. This prioritizes "how do I write this" over "what does it look like." This is a notable divergence from Storybook-style docs (MUI, Chakra) which lead with a rendered preview.

3. **Compound component model drives structure**: The API Reference section mirrors the component's compositional anatomy. Each part (Root, Trigger, Content, Item, etc.) gets its own documentation block. This teaches the architecture implicitly.

4. **Examples follow a size-to-complexity gradient**:
   - Themes: visual props (size/variant/color) -> behavioral props (placeholder/position) -> integration patterns (SSR/composition).
   - Primitives: common tasks (positioning/sizing) -> content patterns (disabled/grouped/complex items) -> advanced (custom scrollbar).

5. **Inheritance links between layers**: Themes docs reference Primitives ("Inherits props from Select primitive Root"). This creates a deliberate "drill down if you need more" pathway without duplicating documentation.

6. **Accessibility is a Primitives concern**: A11y docs live only on the Primitives layer. The implicit message: Themes handles this for you; Primitives documents what it provides so you can verify compliance.

7. **Props tables are minimal**: 3 columns (Prop, Type, Default). No separate "Description" column -- the description is inferred from context or the type annotation. This keeps tables scannable but relies on good naming.

8. **No playground / no Storybook embed**: The documentation is entirely static. There are no knobs, sliders, or interactive previews. Every example is a complete copy-pasteable code block.

### Structural Summary

| Section | Themes | Primitives |
|---------|--------|------------|
| Title + Description | Yes | Yes |
| Features list | No | Yes |
| Installation | No | Yes |
| Anatomy | No | Yes |
| Hero code example | Yes (implicit) | No |
| API Reference | Yes (slim) | Yes (comprehensive) |
| Data Attributes | No | Yes |
| CSS Variables | No | Yes |
| Examples | Yes (prop-oriented) | Yes (task-oriented) |
| Accessibility | No | Yes |
| Keyboard Interactions | No | Yes |
| Custom APIs | No | Yes |
| Right-side TOC | Yes | Yes |
| Live preview | No | No |
| Prev/Next navigation | No | No |
