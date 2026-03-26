# MCP Server Improvements Plan

> Based on agent feedback session - testing MCP server usability for AI agents

## Planned Improvements

### 1. Content Relationship Linking
**Problem:** Content is siloed. When I find `weightedObjectSearch` API docs, I don't see:
- The `weightedObjectSearch` example that demonstrates it
- The utils guide that explains when to use it
- Other methods in the same package

**Use cases:**
- Search for API method → show related examples
- Look at component spec → show examples using that component
- Read a guide → show related API docs
- Browse package docs → show the package's skill/guide

**Solution approaches:**

**A. Metadata-based linking (simpler)**
Add explicit `related` fields in frontmatter:
```yaml
# In weightedObjectSearch API doc
related:
  examples: ["utils-weightedobjectsearch"]
  guides: ["framework/utils"]
```

**B. Convention-based linking (automatic)**
Infer relationships from naming/structure:
- Example `utils-weightedobjectsearch` → API doc for `weightedObjectSearch`
- Doc in `api/query/*` → Skill `query`
- Component spec `button` → Examples with `button` in id/tags

**C. Hybrid**
Use conventions as defaults, allow explicit overrides in frontmatter.

**Implementation:**
- Add `related` field to tool responses
- When returning API doc, include matching examples/guides
- When returning example, include related API docs
- Search results could group related items

**Example response with relationships:**
```json
{
  "path": "/content/docs/api/utils/objects.md",
  "title": "Object Utilities",
  "methods": ["weightedObjectSearch", "get", "extend"],
  "related": {
    "examples": ["utils-weightedobjectsearch"],
    "skills": ["utils"],
    "seeAlso": ["api/utils/arrays"]
  }
}
```

**Priority:** High - significantly improves discoverability

---

### 2. Add Orientation/Help Tool
**Problem:** No clear starting point when first connecting. Agent had to call multiple `list_*` tools to understand what's available.

**Solution:** Add a `help` or `overview` tool that returns:
- Available tools and when to use each
- Quick start guide (e.g., "use `use_skill` for deep dives, `get_component` for UI specs")
- Tool relationships and typical workflows
- **Escape hatch**: "You can just use Tailwind. It works inside Shadow DOM. Use `TailwindPlugin(definition)` and write classes you already know."

**Critical messaging:** The Tailwind escape hatch should be prominent. Agents already know Tailwind from training data. Let them use what they know without learning the theming system. The sophisticated spec/CSS architecture is there when needed, but not required for getting things done.

**Priority:** High - first impression matters

---

### 3. Batch Fetching (Array Parameters)
**Problem:** Fetching 3 examples requires 3 separate tool calls, adding latency.

**Solution:** Allow array input for string parameters:
```typescript
// Current
get_example({ id: "counter" })

// Proposed
get_example({ id: ["counter", "dropdown", "modal"] })
// Returns array of results
```

**Affected tools:**
- `get_example`
- `get_component`
- `get_context`
- `get_doc`

**Priority:** Medium - quality of life improvement

---

### 4. Category Discovery in Tool Descriptions
**Problem:** Agent had to guess valid category names for `list_examples`.

**Solution:** Update tool description to include available categories:
```
"List code examples. Filter by category: 'Templates', 'Framework', 'UI Components', 'Query', 'Reactivity', 'Utils'"
```

**Alternative:** Add `list_categories` tool that returns available filter values.

**Priority:** Low - easy fix

---

### 5. Slim Down List Responses
**Problem:** `list_context()` without filter returned 168K characters, causing overflow.

**Issues identified:**
- `type: 'context'` is redundant (you called `list_context`, you know the type)
- Full metadata on every item when listings should be lightweight indexes

**Solution:**
- Remove redundant `type` field from list responses
- Consider returning minimal fields in lists (path, title, tokens)
- Full metadata available via `get_*` tools
- Or: require audience filter on `list_context`

**Priority:** Medium - affects usability

---

### 6. Clarify Skill vs Context in Tool Descriptions
**Problem:** Unclear when to use `use_skill` vs `get_context`.

**Current understanding:**
- Skills = curated comprehensive guides (subset with `skill` field)
- Context = all AI docs including supplementary material

**Solution:** Update tool descriptions:
```
use_skill: "Load a curated comprehensive guide for a topic (see list_skills)"
get_context: "Get any AI context document by path, including supplementary docs not in skills"
```

**Priority:** Low - documentation fix

---

## Implementation Order

1. **Content relationship linking** - High impact, start with convention-based approach
2. **Orientation tool** - Design and implement `help` tool
3. **Slim list responses** - Remove `type`, consider minimal fields
4. **Batch fetching** - Add array support to get_* tools
5. **Category discovery** - Quick win, update tool description
6. **Clarify skill vs context** - Update descriptions

---

### 7. HTML → CSS Theming Tool
**Problem:** Agent writes HTML like `<ui-button large red>`, then gets asked "make it rounder" or "change the hover speed." No way to query what CSS controls those attributes.

**Solution:** `get_theming_css` tool that:
- Accepts HTML string or component + attributes
- Returns actual CSS content (not JSON abstractions)
- Shows global token dependencies
- Works because spec structure = CSS file structure = CSS layer names

**Example:**
```typescript
get_theming_css({
  html: '<ui-button large red>Submit</ui-button>'
})

// Returns:
{
  "ui-button": {
    "size": {
      "file": "css/theme/variations/size-variables.css",
      "css": ":host { --button-large-font-size: ... }",
      "globalTokens": ["--relative-16px"]
    },
    "color": {
      "file": "css/theme/variations/color-variables.css",
      "css": ":host([red]) { --button-colored-background: var(--red); }",
      "globalTokens": ["--red", "--white-90"]
    }
  }
}
```

**Key insight:** The routing is mechanical:
1. Parse HTML → extract components and attributes
2. `componentSpec.optionAttributes`: `large` → `size`, `red` → `color`
3. `componentSpec.variations` includes both → category = "variations"
4. File path: `css/theme/{category}/{attribute}-variables.css`

No manifest generation needed. The file structure IS the API.

**Priority:** High - critical for AI-assisted theming workflows

**See also:** `ai/workspace/plans/css-token-extraction.md` for full implementation details

---

### 8. Global Token Lookup
**Problem:** Agent sees `var(--border-radius)` in component CSS. Where is it defined? What other values are available?

**Solution:** `get_global_tokens` tool that:
- Lists tokens by category (spacing, typography, colors, etc.)
- Returns actual values
- Shows file location
- Supports search ("all tokens containing 'spacing'")

**Example:**
```typescript
get_global_tokens({ search: 'border-radius' })

// Returns:
{
  "--border-radius": {
    "value": "var(--4px)",
    "file": "src/css/tokens/global/visual.css",
    "category": "visual"
  },
  "--border-radius-small": { ... },
  "--border-radius-large": { ... }
}
```

**Priority:** Medium - supports theming workflow

---

### 9. Reverse Token Lookup
**Problem:** User wants to change `--primary-color`. What components will be affected?

**Solution:** `get_token_usage` tool that searches all component CSS for references to a token.

**Example:**
```typescript
get_token_usage({ token: '--primary-color' })

// Returns:
{
  "token": "--primary-color",
  "usedBy": [
    { "component": "button", "file": "css/theme/types/emphasis-variables.css" },
    { "component": "label", "file": "css/theme/variations/colored-variables.css" },
    ...
  ]
}
```

**Priority:** Low - nice to have for impact analysis

---

## Tool Description Best Practices

Tool descriptions are the primary way agents decide which tool to use. Optimize for mechanical parsing, not human charm.

### Structure (in order)

```typescript
{
  name: 'tool_name',
  description: `One-line summary of what this does.

When to use: [Trigger condition - the situation that should make agent reach for this tool]

Input: [What to pass, with concrete example]

Output: [What you get back, structured]

[Optional: Note about batch support, related tools, etc.]`
}
```

### Example: get_theming_css

```typescript
{
  name: 'get_theming_css',
  description: `Get CSS variables that control component styling.

When to use: You wrote HTML with ui-* components and need to customize their appearance (colors, sizing, spacing, hover states, etc.)

Input: HTML string with Semantic UI components
Example: '<ui-button large red>Submit</ui-button>'

Output: For each component and attribute found:
- attribute: The resolved attribute name (e.g., 'size', 'color')
- category: Where it lives (types/states/variations)
- file: CSS file path
- css: Actual CSS content with variables
- globalTokens: External token dependencies

Handles multiple components in one call. Use this before manually searching for CSS variable names.`
}
```

### Why this format works

1. **Keyword density** - relevant terms appear early (CSS, variables, styling, customize)
2. **Explicit trigger** - "When to use" tells agent exactly when to reach for this
3. **Concrete input example** - agent can pattern-match against their current situation
4. **Structured output** - agent knows what they'll get back, can plan next steps
5. **Boundary hint** - "Use this before manually searching" prevents wasted effort

### Anti-patterns

- Conversational/casual tone (works for some models, not all)
- Abstract descriptions ("processes component metadata")
- Missing input/output format
- No trigger condition (when would I use this?)
- Assuming agent knows your domain vocabulary

### Apply to existing tools

Review all existing tool descriptions against this format:
- `get_component` - add "When to use: You need to know what attributes/options a component supports"
- `get_example` - add "When to use: You want working code to reference or adapt"
- `use_skill` - add "When to use: You need deep understanding of a topic, not just a quick lookup"
- `search` - add "When to use: You don't know where something is or what it's called"

---

## Files To Modify

- `tools/mcp/src/index.ts` - Tool descriptions, new help tool, batch support, theming tools
- `tools/mcp/src/utils/cache.ts` - Slim list responses, relationship linking
- `tools/mcp/src/utils/get-theming-css.ts` - New file for theming CSS lookup
- `tools/mcp/src/utils/get-global-tokens.ts` - New file for global token queries
