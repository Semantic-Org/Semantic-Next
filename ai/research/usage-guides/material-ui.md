# Material UI (MUI) -- Component Documentation Structure
## Component Analyzed: Autocomplete
## URL: https://mui.com/material-ui/react-autocomplete/

---

## Page Layout

Three-column layout:
- **Left sidebar**: Component navigation organized by category (Inputs, Data Display, Feedback, Surfaces, etc.)
- **Main content**: Scrolling documentation body
- **Right sidebar**: "CONTENTS" table of contents with h2/h3 hierarchy, indented sub-sections, scroll-tracking highlight

## Header Region (above first heading)

- **H1**: Component name ("Autocomplete")
- **Description**: One-sentence summary ("The autocomplete is a normal text input enhanced by a panel of suggested options.")
- **Introductory prose**: 1-2 paragraphs explaining the two primary use cases (combo box vs. free solo), with inline anchor links to the relevant sections below
- **Chip links**: Row of external resource chips -- View as Markdown, Feedback (GitHub issues), Bundle size (Bundlephobia), Source (GitHub), WAI-ARIA spec, Figma, Sketch

---

## Section Taxonomy (in page order)

### 1. Combo box (h2)
- **Purpose**: What is the simplest, most common usage? (value from a predefined set)
- **Content type**: 1 sentence of prose + live demo (rendered Autocomplete component) + collapsible code snippet
- **Notes**: This is the "hello world" -- the very first demo a user sees. Minimal code (6 lines JSX). The demo is interactive (you can type, open the dropdown). Code is collapsed by default behind an "Expand code" button. Demo toolbar includes: "Edit in Chat" (AI), code style switcher (JS/TS, Tailwind/CSS/System), copy button, CodeSandbox/StackBlitz launchers.

### 2. Options structure (h3, under Combo box)
- **Purpose**: How do you structure the data passed to the component? What shape do options take?
- **Content type**: Prose explaining the `label`/`id` structure + code snippet showing the TypeScript interface + a callout/aside with a tip about `getOptionKey` for duplicate labels
- **Notes**: This is API education, not a visual demo. Uses a `MuiCallout-info` aside for supplemental advice.

### 3. Playground (h3, under Combo box)
- **Purpose**: How do the various boolean props affect behavior? (interactive exploration)
- **Content type**: Live interactive demo with ~14 Autocomplete instances, each labeled with the prop it demonstrates (disableCloseOnSelect, clearOnEscape, disableClearable, includeInputInList, flat, controlled, autoComplete, disableListWrap, openOnFocus, autoHighlight, autoSelect, disabled, disablePortal, blurOnSelect, clearOnBlur, selectOnFocus, readOnly)
- **Notes**: This is a "prop playground" pattern -- one demo renders many variants side-by-side, each labeled with the prop name. Progressive disclosure: code is collapsed. This section demonstrates a philosophy of "show all the knobs" rather than explaining each one in prose.

### 4. Country select (h3, under Combo box)
- **Purpose**: Real-world example -- how to render custom option content (flags + country names)?
- **Content type**: 1 sentence of prose + live demo + collapsible code
- **Notes**: Demonstrates `renderOption` customization. Shows how to handle 248 items with custom rendering.

### 5. Controlled states (h3, under Combo box)
- **Purpose**: How do controlled vs. uncontrolled patterns work? What are the two independent state axes?
- **Content type**: Prose explaining `value`/`onChange` vs `inputValue`/`onInputChange` + numbered list + info callout (defining controlled vs uncontrolled with link to React docs) + live demo showing both states + warning callout about referential stability with good/bad code examples
- **Notes**: Heaviest prose section so far. Uses TWO callouts (info + warning). Warning callout includes inline code showing anti-pattern and fix. This is the deepest conceptual section in the "Combo box" group.

### 6. Free solo (h2)
- **Purpose**: How to allow arbitrary values (not just predefined options)?
- **Content type**: 1 sentence prose setting the `freeSolo` prop + subsections below
- **Notes**: New top-level concept. Very brief intro, delegates to sub-sections.

### 7. Search input (h3, under Free solo)
- **Purpose**: Primary free-solo use case -- search suggestions (like Google search)
- **Content type**: Prose + live demo (two variants: freeSolo and search input) + collapsible code + warning callout about non-string options
- **Notes**: Warning callout appears AFTER the demo, not before -- pattern of "show it working, then warn about edge cases."

### 8. Creatable (h3, under Free solo)
- **Purpose**: How to let users create new options on the fly?
- **Content type**: Prose recommending three props to set + bulleted list + live demo + code
- **Notes**: Cross-links back to the combo box section. Shows the "add new" UX pattern.

### 9. Grouped (h2)
- **Purpose**: How to group options by category?
- **Content type**: Prose + live demo + code
- **Notes**: Brief section. Demonstrates `groupBy` prop.

### 10. Disabled options (h2)
- **Purpose**: How to disable individual options?
- **Content type**: Prose + live demo + code
- **Notes**: Brief section. Demonstrates `getOptionDisabled` prop.

### 11. useAutocomplete (h2)
- **Purpose**: How to use the headless hook for fully custom UI?
- **Content type**: Prose introducing the hook + link to hook API page + live demo + code
- **Notes**: Links out to `/material-ui/react-autocomplete/hooks-api/` for the full hook API. This is the "escape hatch" section.

### 12. Customized hook (h3, under useAutocomplete)
- **Purpose**: Concrete example of the headless hook in action
- **Content type**: Live demo (custom styled, non-Material UI rendering) + code
- **Notes**: Demo visually looks different from all other demos -- it proves the hook works without Material UI components.

### 13. Asynchronous requests (h2)
- **Purpose**: How to load options from an API/server?
- **Content type**: Prose introducing the concept + subsections
- **Notes**: Another concept-heavy top-level section with multiple sub-patterns.

### 14. Load on open (h3, under Asynchronous requests)
- **Purpose**: How to load options lazily when the dropdown opens?
- **Content type**: Prose + live demo (with loading spinner) + code
- **Notes**: Shows loading state UX pattern.

### 15. Search as you type (h3, under Asynchronous requests)
- **Purpose**: How to fetch filtered results as the user types?
- **Content type**: Prose + info callout about using `filterOptions` to disable client-side filtering + live demo + code
- **Notes**: Callout explains why you need to disable built-in filtering when doing server-side filtering. Uses Google's `throttle` as the example.

### 16. Google Maps place (h3, under Asynchronous requests)
- **Purpose**: Real-world integration example -- Google Maps Places API
- **Content type**: Prose + live demo + code
- **Notes**: Complex, production-quality example. Demonstrates a realistic API integration.

### 17. Single value rendering (h2)
- **Purpose**: How to customize how the selected value appears in the input?
- **Content type**: Prose + live demo + code
- **Notes**: Demonstrates `renderValue` prop (new in v7). Brief.

### 18. Multiple values (h2)
- **Purpose**: How to allow selecting multiple options?
- **Content type**: Prose + live demo (chips in the input) + code + subsections
- **Notes**: Core feature section with multiple sub-variants.

### 19. Fixed options (h3, under Multiple values)
- **Purpose**: How to have some tags that can't be removed?
- **Content type**: Prose + live demo + code
- **Notes**: Shows a pattern where certain selected values are "locked."

### 20. Selection indicators (h3, under Multiple values)
- **Purpose**: How to show checkboxes next to options?
- **Content type**: Prose + live demo + code
- **Notes**: Demonstrates `renderOption` with Checkbox components.

### 21. Limit tags (h3, under Multiple values)
- **Purpose**: How to limit how many chips are visible when not focused?
- **Content type**: Prose + live demo + code
- **Notes**: Demonstrates `limitTags` prop. Shows "+N" overflow pattern.

### 22. Sizes (h2)
- **Purpose**: How to change the component size?
- **Content type**: Prose + live demo (small vs. medium) + code
- **Notes**: Brief section. Demonstrates `size` prop.

### 23. Customization (h2)
- **Purpose**: How to deeply customize the look and behavior?
- **Content type**: Umbrella section for customization sub-topics
- **Notes**: Groups several advanced customization patterns.

### 24. Custom input (h3, under Customization)
- **Purpose**: How to replace the input element itself?
- **Content type**: Prose + live demo + code
- **Notes**: Demonstrates `renderInput` customization.

### 25. Globally customized options (h3, under Customization)
- **Purpose**: How to style all option items consistently across your app?
- **Content type**: Prose + live demo + code
- **Notes**: Uses theme customization / `slotProps`.

### 26. GitHub's picker (h3, under Customization)
- **Purpose**: Real-world showcase -- reproduce GitHub's label picker UI
- **Content type**: Prose + live demo (custom popper-based UI) + code
- **Notes**: Complex, opinionated example showing the Autocomplete can be bent into very different shapes. Not a typical dropdown.

### 27. Hint (h3, under Customization)
- **Purpose**: How to show inline type-ahead hints?
- **Content type**: Prose + live demo + code
- **Notes**: Demonstrates an autocomplete "ghost text" pattern.

### 28. Highlights (h2)
- **Purpose**: How to highlight matching text in options?
- **Content type**: Prose + live demo + code
- **Notes**: Uses `autosuggest-highlight` library. Shows text highlighting UX.

### 29. Custom filter (h2)
- **Purpose**: How to change the filtering algorithm?
- **Content type**: Prose + utility function documentation + sub-sections
- **Notes**: Contains API-style documentation for `createFilterOptions`.

### 30. createFilterOptions(config) => filterOptions (h3, under Custom filter)
- **Purpose**: API reference for the filter factory function
- **Content type**: Prose + "Arguments" (h4) table/list + "Returns" (h4) description
- **Notes**: This is inline API documentation -- tables describing config options. Unusual for a guide page; more like a reference embed.

### 31. Advanced (h3, under Custom filter)
- **Purpose**: How to use a completely custom filter like `match-sorter`?
- **Content type**: Prose + live demo + code
- **Notes**: Shows integration with third-party fuzzy-match library.

### 32. Virtualization (h2)
- **Purpose**: How to handle 10,000+ options without performance degradation?
- **Content type**: Prose + live demo (10,000 options) + code
- **Notes**: Uses `react-window` for virtualized list rendering. Performance-focused section.

### 33. Events (h2)
- **Purpose**: How to handle component events?
- **Content type**: Prose + live demo (with console output) + code
- **Notes**: Demonstrates `onChange`, `onInputChange`, etc. with visible event logging.

### 34. Limitations (h2)
- **Purpose**: What known issues or platform-specific behaviors should users be aware of?
- **Content type**: Prose-heavy section with sub-sections describing specific limitations
- **Notes**: Honesty section -- documents things that don't work perfectly.

### 35. autocomplete/autofill (h3, under Limitations)
- **Purpose**: Browser autofill conflicts
- **Content type**: Prose explaining the browser behavior conflict + workaround guidance
- **Notes**: Explains why `autoComplete="new-password"` is sometimes needed.

### 36. iOS VoiceOver (h3, under Limitations)
- **Purpose**: VoiceOver accessibility limitation
- **Content type**: Prose
- **Notes**: Documents a known accessibility issue on iOS.

### 37. ListboxComponent (h3, under Limitations)
- **Purpose**: Custom listbox component constraints
- **Content type**: Prose
- **Notes**: Technical limitation about the `ListboxComponent` prop.

### 38. Accessibility (h2)
- **Purpose**: How does this component handle accessibility? What ARIA spec does it follow?
- **Content type**: Prose + link to WAI-ARIA combobox spec
- **Notes**: References the WAI-ARIA 1.2 combobox pattern. Explains the keyboard interaction model.

### 39. API (h2)
- **Purpose**: Where to find the complete API reference?
- **Content type**: Links to separate API reference pages
- **Notes**: Links to individual component API pages (`<Autocomplete>` component API, `useAutocomplete` hook API). This is a gateway section, not inline API docs. The full props table lives on a separate page.

---

## Overall Pattern

### Documentation Philosophy

MUI follows a **"progressive complexity"** structure:

1. **Start with the simplest case** (Combo box -- 6 lines of code)
2. **Expand to variations** (Free solo, Grouped, Multiple, Sizes)
3. **Show advanced patterns** (Async, Customization, Custom filter, Virtualization)
4. **End with meta-information** (Limitations, Accessibility, API links)

### Key Structural Patterns

- **Every section = prose + live demo + collapsible code**: The dominant pattern is a 1-3 sentence introduction, then an interactive demo with rendered output, then a code snippet that's collapsed by default. The demo is always shown FIRST, code second.

- **Callouts for warnings and tips**: MUI uses `MuiCallout-info` (blue) and `MuiCallout-warning` (amber) asides extensively. Warnings typically appear AFTER the demo they relate to, not before.

- **Demo toolbar**: Every demo has a consistent toolbar with: "Edit in Chat" (AI-assisted editing), code style switcher (JS/TS), styling approach switcher (Tailwind/CSS/System), copy button, and external sandbox launchers (CodeSandbox, StackBlitz).

- **Concept-first, not prop-first**: Sections are organized by USE CASE ("Free solo", "Multiple values", "Asynchronous requests"), not by prop name. Props are introduced in context. The full props table is on a separate API page.

- **Real-world examples as proof**: Several sections use complex, real-world scenarios (Country select, Google Maps, GitHub's picker) to demonstrate that the abstractions work in production.

- **Inline API reference is minimal**: Only `createFilterOptions` gets inline API docs. Everything else links to separate API pages. This keeps the guide page focused on "how" rather than "what."

- **Limitations section is explicit**: MUI explicitly documents known issues (browser autofill, VoiceOver, custom listbox). This is a trust-building pattern.

- **Right sidebar TOC shows full hierarchy**: h2 sections show as top-level, h3 sections are indented. The active section is highlighted as you scroll. This provides navigability for a very long page (~40 sections).

- **Header chip links provide cross-cutting resources**: Before any content, users can jump to GitHub source, WAI-ARIA spec, Figma/Sketch designs, bundle size analysis. These are "meta" resources separate from the documentation flow.

### Content Volume Estimates

- ~15 top-level (h2) sections
- ~27 sub-sections (h3/h4)
- ~25+ live interactive demos
- ~5 callout/aside boxes
- Page is extremely long -- likely 8,000+ words of prose plus code
- The vast majority of the page is demo-driven, not text-driven
