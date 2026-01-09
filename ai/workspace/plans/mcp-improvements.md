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

## Files To Modify

- `tools/mcp/src/index.ts` - Tool descriptions, new help tool, batch support
- `tools/mcp/src/utils/cache.ts` - Slim list responses, relationship linking
