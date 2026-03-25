# API Documentation Formatting Review Plan

> **Purpose:** Standardize all API reference pages to use consistent header hierarchy and link existing examples.
> **Scope:** All `.mdx` files in `docs/src/pages/docs/api/`
> **Critical Rule:** Do NOT modify written content. Only adjust formatting structure.

---

## Required Context

Before starting, load these contexts:

1. **`sui:api-doc` skill** (if available) - or manually read:
   - `ai/documentation/api/api-authoring.md` - formatting rules and header hierarchy
   - `ai/documentation/shared/slop-identification.md` - quality standards (read-only reference)

2. **Reference example:**
   - `docs/src/pages/docs/api/query/dom-manipulation.mdx` - correctly formatted page
   - `docs/src/pages/docs/api/utils/strings.mdx` - correct utils-style format

---

## Overview

API docs have inconsistent header hierarchies. Some use H2 for methods (incorrect), others use H3 (correct). This plan standardizes all pages to the correct format documented in `ai/documentation/api/api-authoring.md`.

---

## Correct Header Hierarchy

```
## [Grouping Header]           ← H2: "Functions", "Methods", "Constructor"
### methodName                 ← H3: Method/function names
```javascript                  ← Signature (no header)
function signature here
```
Brief description.
#### Parameters                ← H4: Section headers
#### Returns
#### Example
```

**Key Rules:**
- H2 = Grouping headers only (Functions, Methods, Static Methods, Constructor)
- H3 = Method/function names
- H4 = Sections (Parameters, Returns, Example)
- H5 = Sub-sections (Options tables under Parameters)

---

## Pre-Work: Catalog Available Examples

Before starting, run once to get the full list of available examples:

```bash
ls /home/jack/semantic/next/docs/src/content/examples/ | sort
```

Save this list mentally or in notes. When adding PlaygroundExample links, match method names to available example IDs (e.g., `query-append.mdx` → `query-append`).

---

## What To Fix

### DO:
- Change method names from `## method` to `### method`
- Add `## Functions` or `## Methods` grouping header if missing
- Change section headers from `### Syntax/Parameters/Returns` to `#### Parameters/Returns/Example`
- Remove `### Syntax` headers (signature should be bare code block after method name)
- Remove `### Usage` headers entirely
- **If PlaygroundExample exists: remove inline code examples** - the PlaygroundExample IS the example
- If no PlaygroundExample: keep a minimal inline code example (2-5 lines max)
- Add `<PlaygroundExample id="..." direction="horizontal"></PlaygroundExample>` where example exists
- Add Blockquote import if page has `> **Note**` style callouts:
  ```javascript
  import Blockquote from '@components/mdx/Blockquote.astro';
  export const components = { blockquote: Blockquote };
  ```

### DO NOT:
- Modify any descriptive text, parameter descriptions, or explanations
- Create new examples
- Change expository sections (introductions, conceptual explanations, notes)
- Modify content you're uncertain about
- Remove any content

---

## Handling Uncertainty

If you encounter content that doesn't clearly fit the method documentation pattern:
1. **Leave it unchanged**
2. Expository content (introductions, conceptual explanations) should remain as-is
3. Constructor documentation may have different structure - use judgment
4. When in doubt, skip and note in progress tracker

---

## Edge Cases

### Index Files
`index.mdx` files are typically human-written overviews. **Skip unless there are obvious blunders.** They are not structured to match method documentation format.

### Getter/Setter Methods
Query methods often have distinct get/set behaviors. Use H5 subheaders under Returns:

```markdown
#### Returns

##### Get
- **Single Element** - The width in pixels
- **Multiple Elements** - Array of widths

##### Set
[Query object](/docs/api/query/constructor#the-query-object) (for chaining).
```

### Notes Section
Notes are optional. Only include if the information is:
- Unusual or non-obvious behavior
- Would appear in official docs for projects like Svelte, Vue, Vite
- Performance caveats or gotchas

**Formatting rules for notes:**
- Must be concise (1-2 sentences max)
- Never create run-on sentences by combining multiple points
- If multiple points needed, use a bullet list or omit
- If an existing note is a run-on mess, either fix it concisely or remove it

Do NOT add notes for obvious behavior. When uncertain, omit.

### Partial Fixes
If a file has some methods correctly formatted and others not, fix only the incorrect portions. Do not rewrite correctly formatted sections.

---

## Missing Examples

When a method lacks a corresponding example in `docs/src/content/examples/`:
1. Do NOT add a PlaygroundExample component
2. Record it in `ai/artifacts/missing-examples.md` with format:
   ```
   ## [Package/Page Name]
   - methodName
   - anotherMethod
   ```

---

## Progress Tracker

Mark each file as you complete it. Status: `[ ]` pending, `[~]` in progress, `[x]` done, `[-]` skipped (no changes needed)

### query/
- [ ] attributes.mdx
- [ ] basic.mdx
- [ ] components.mdx
- [ ] content.mdx
- [ ] css.mdx
- [ ] dimensions.mdx
- [x] dom-manipulation.mdx *(converted as reference example)*
- [ ] dom-traversal.mdx
- [ ] events.mdx
- [ ] index.mdx
- [ ] internal.mdx
- [ ] iterators.mdx
- [ ] logical-operators.mdx
- [ ] utilities.mdx
- [ ] visibility.mdx

### utils/
- [ ] arrays.mdx
- [ ] browser.mdx
- [ ] cloning.mdx
- [ ] colors.mdx
- [ ] crypto.mdx
- [ ] css.mdx
- [ ] dates.mdx
- [ ] debug.mdx
- [ ] environment.mdx
- [ ] equality.mdx
- [ ] functions.mdx
- [ ] index.mdx
- [ ] looping.mdx
- [ ] numbers.mdx
- [ ] objects.mdx
- [ ] regex.mdx
- [ ] strings.mdx
- [ ] types.mdx

### reactivity/
- [ ] array-helpers.mdx
- [ ] boolean-helpers.mdx
- [ ] collection-helpers.mdx
- [ ] date-helpers.mdx
- [ ] dependency.mdx
- [ ] flushing.mdx
- [ ] helpers.mdx
- [ ] index.mdx
- [ ] number-helpers.mdx
- [ ] reaction.mdx
- [ ] scheduler.mdx
- [ ] signal.mdx

### component/
- [ ] define-component.mdx
- [ ] index.mdx
- [ ] utilities.mdx
- [ ] web-component-base.mdx

### templating/
- [ ] *(list files when starting this section)*

### helpers/
- [ ] *(list files when starting this section)*

### renderer/
- [ ] *(list files when starting this section)*

---

## Workflow Per File

1. Read the file
2. Identify if it contains method/function documentation (vs. pure expository)
3. If expository only → mark `[-]` skipped
4. If method docs:
   a. Note current header structure
   b. Apply formatting fixes (headers only)
   c. Check for matching examples, add PlaygroundExample if exists
   d. Record any methods without examples
5. Write updated file
6. Mark `[x]` in tracker
7. Move to next file

---

## Reference

- Correct format example: `docs/src/pages/docs/api/query/dom-manipulation.mdx`
- Format guide: `ai/documentation/api/api-authoring.md`
- Utils format (already correct): `docs/src/pages/docs/api/utils/strings.mdx`

---

## Starting the Work

Begin with `query/` package as it has the most inconsistencies. Use `dom-manipulation.mdx` as your reference for the correct format. When you complete a file, update this tracker and continue.

If resuming work, check the tracker to see where to continue.
