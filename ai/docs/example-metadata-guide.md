# Example Metadata & Organization Guide

This guide documents the canonical structure, organization, and metadata requirements for examples in the Semantic UI documentation system. It serves as a companion to `example-creation-guide.md` and provides the definitive reference for how examples are organized, categorized, and displayed in the navigation.

## Table of Contents
- [Example Organization Philosophy](#example-organization-philosophy)
- [Folder Structure & Naming](#folder-structure--naming)
- [Content Collection Metadata](#content-collection-metadata)
- [Navigation System](#navigation-system)
- [Example Routing](#example-routing)
- [Canonical Taxonomy](#canonical-taxonomy)
- [Best Practices](#best-practices)

## Example Organization Philosophy

Examples are organized using a **hierarchical taxonomy** that progresses from **simple → complex** within each category. The system supports multiple levels of organization:

1. **Top-level categories** (Framework, UI Components, Templates, Reactivity, Query)
2. **Subcategories** within each top-level category
3. **Individual examples** within each subcategory

The key principle: **Examples should build conceptual understanding progressively**, starting with foundational concepts and advancing to complex integration patterns.

## Folder Structure & Naming

### Folder Naming Rules

1. **Folder names MUST exactly match example IDs** for routing to work
2. **Subfolders are allowed** but the final folder name must match the ID
3. **IDs must be globally unique** across all packages/categories
4. **Use descriptive prefixes** to avoid conflicts (e.g., `reactive-increment` not just `increment`)

### Supported Structures

```
examples/
  category/
    example-id/           ← Flat structure
    subcategory/
      example-id/         ← Nested structure (preferred for organization)
```

### Example Structure

```
examples/
  reactivity/
    introduction/
      signals/            ← ID: "signals"
      reactions/          ← ID: "reactions"
      subscribe/          ← ID: "subscribe"
    helpers/
      reactive-increment/ ← ID: "reactive-increment"
      reactive-toggle/    ← ID: "reactive-toggle"
```

## Content Collection Metadata

### Authoritative Schema

The definitive schema is defined in `docs/src/content/config.js` as the `examplesCollection`:

```javascript
const examplesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.optional(z.string()),                    // Optional: Custom ID override
    title: z.string(),                             // Required: Display name
    hidden: z.optional(z.boolean()),               // Optional: Hide from navigation
    exampleType: z.string(),                       // Required: 'component', 'log', 'page'
    folder: z.optional(z.string()),                // Optional: Include all files in folder
    fold: z.optional(z.boolean()),                 // Optional: Code folding behavior
    category: z.optional(z.string()),              // Optional: Top-level category
    selectedFile: z.optional(z.string()),          // Optional: Default file to show
    subcategory: z.string(),                       // Required: Secondary categorization
    description: z.string(),                       // Required: Tooltip/summary text
    tip: z.optional(z.string()),                   // Optional: Educational guidance
    tags: z.array(z.string()),                     // Required: Array for search/filtering
    shortTitle: z.optional(z.string()),            // Optional: Abbreviated display name
    additionalPageFiles: z.optional(z.string().array()), // Optional: Extra page files
  }),
});
```

### Example ID Resolution

The system determines the example ID using the following logic:

1. If an `id` field is provided in the metadata, use that
2. If no `id` field is present, **automatically generate** an ID by tokenizing the `title` field (converting spaces to hyphens, lowercase)

**Critical Rule**: The resolved ID **must match the folder name exactly** for routing to work. The system will search for this folder name even if it's nested in subcategories (e.g., `reactivity/helpers/reactive-increment/`).

### Metadata Example

```yaml
---
title: 'Signal Basics'              # Required: Will generate ID "signal-basics" if no id field
id: 'signals'                       # Optional: Override auto-generated ID
category: 'Reactivity'              # Optional: Top-level category
subcategory: 'Introduction'         # Required: Must match menus.js subcategories
exampleType: 'component'            # Required: Determines file loading behavior
description: 'Basic signal usage'   # Required: Used in tooltips/summaries
tags: ['reactivity', 'basics']      # Required: Array for search functionality
tip: 'Click buttons to see reactivity' # Optional: User guidance
shortTitle: 'Signals'              # Optional: For compact displays
---
```

### File Naming Convention

**MDX files should be named to match their ID** for consistency:
- `signals.mdx` for `id: 'signals'`
- `reactive-increment.mdx` for `id: 'reactive-increment'`
- `reactive-vs-nonreactive.mdx` for `id: 'reactive-vs-nonreactive'`

### Example Types

- **`component`**: Interactive page examples with UI (uses `page.html` + `page.js`)
- **`log`**: Console-based examples showing output (uses `index.js`)
- **`page`**: Full page examples with custom HTML structure

## Navigation System

### Top Navigation

Defined in `docs/src/helpers/menus.js` as `topbarDisplayMenu`:

```javascript
{
  _ids: ['examples-framework', 'examples-ui-components', 'examples-templates', 'examples-reactivity', 'examples-query'],
  name: 'Examples',
  url: '/examples/counter',
  baseURL: '/examples',
}
```

### Subcategory Navigation

Also defined in `menus.js` as `subCategorySortOrder`:

```javascript
'Reactivity': [
  'Introduction',
  'Variables', 
  'Helpers',
  'Performance',
  'Controls',
  'Advanced',
]
```

### Example Discovery

The system automatically discovers examples by:
1. Reading all `.mdx` files from `docs/src/content/examples/`
2. Grouping by `category` and `subcategory`
3. Sorting according to `subCategorySortOrder`
4. Building dynamic navigation menus

## Example Routing

### Route Generation

Routes are generated in `docs/src/pages/examples/[...slug].astro`:

```javascript
// Gets example ID from metadata
const exampleID = example.id || tokenize(example.title);

// Finds matching folder using glob pattern
const allExampleFiles = await import.meta.glob(`../../examples/**`);

// Searches for folder matching the ID
let deepPath = `${basePath}.*/${contentID}/${subFolder}`;
let shallowPath = `${basePath}${contentID}/${subFolder}`;
```

### Critical Requirements

1. **Folder name MUST match example ID exactly**
2. **IDs must be unique globally** (across all categories)
3. **No spaces or special characters** in IDs (use kebab-case)

## Canonical Sources of Truth

### Current Taxonomy
The current subcategory organization is defined in `docs/src/helpers/menus.js` under `subCategorySortOrder`. This is the authoritative source for:
- Which subcategories exist for each top-level category
- The order in which subcategories appear in navigation
- The complete list of supported categories

### Existing Examples
To understand current examples and their organization:
- **Content metadata**: `docs/src/content/examples/*.mdx` files contain all example metadata
- **Example folders**: `docs/src/examples/` contains the actual example code and folder structure
- **Current categories**: Framework, UI Components, Templates, Reactivity, Query (as defined in `topbarDisplayMenu`)

### Navigation System
- **Top-level navigation**: `docs/src/helpers/menus.js` → `topbarDisplayMenu`
- **Subcategory navigation**: `docs/src/helpers/menus.js` → `subCategorySortOrder`  
- **Example discovery**: Automatic based on content collection metadata

## Best Practices

### ID Naming
- Use **descriptive prefixes** to avoid conflicts (`reactive-increment` not `increment`)
- Keep IDs **concise but clear** (`signals` not `signal-basics-introduction`)
- Use **kebab-case** consistently
- Consider **global uniqueness** across all example categories

### Organization Principles
1. **Simple → Complex**: Each subcategory should progress in difficulty
2. **Conceptual grouping**: Group related functionality together
3. **Logical prerequisites**: Earlier examples should establish concepts used in later ones
4. **Clear boundaries**: Each subcategory should have a distinct purpose

### Metadata Consistency
- **Match MDX filename to ID** for easy maintenance
- **Use consistent tags** across related examples
- **Write helpful descriptions** that explain the example's purpose
- **Include tips** for complex concepts that might confuse users

### Complex Examples
- Place examples that don't fit the taxonomy in **`unordered/`** subfolders
- Plan to reorganize these when expanding other category taxonomies
- Consider whether complex examples belong in a different top-level category

## Integration Points

### Playground System
- Example files are loaded via `getExampleFiles()` in `docs/src/helpers/playground.js`
- Supports both flat and nested folder structures
- Automatically includes required dependencies and boilerplate

### MDX References
- API documentation can reference examples using `<PlaygroundExample id="example-id">`
- Guide pages can embed examples inline
- Example IDs are used consistently across documentation

### Content Collection
- All examples are part of the Astro content collection
- Metadata is validated and typed
- Examples can be queried and filtered programmatically

This guide ensures consistency and maintainability as the example system grows across all Semantic UI packages and documentation.
