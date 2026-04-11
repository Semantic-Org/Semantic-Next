# CSS Theming Query Tool

## Goal

Enable AI/MCP to answer: "What CSS controls `<ui-button large red>`?"

Return actual CSS content, not JSON abstractions.

## Key Insight

The infrastructure already exists:
- `componentSpec.optionAttributes` maps values to attributes (`large` → `size`, `red` → `color`)
- `componentSpec.types/states/variations` categorizes each attribute
- CSS file structure mirrors spec structure exactly

No manifest generation needed. Just a query function.

## Architecture

```
<ui-button large red>
        ↓
Parse attributes: [large, red]
        ↓
componentSpec.optionAttributes:
  large → size
  red → color
        ↓
componentSpec.variations includes both → category = "variations"
        ↓
File path convention:
  css/theme/variations/size-variables.css
  css/theme/variations/color-variables.css
        ↓
Return: actual CSS content
```

## Prerequisites

### Fix Inconsistent Filenames

Rename these to match attribute names exactly:

```bash
# In src/primitives/button/css/theme/variations/
mv sizing-variables.css size-variables.css
mv colored-variables.css color-variables.css
```

Audit other primitives for similar inconsistencies.

## Implementation

### Core Function: `getThemingCSS`

**Location**: `tools/mcp/src/utils/get-theming-css.ts` (or in @semantic-ui/specs)

```typescript
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface ThemingResult {
  attribute: string;
  category: 'types' | 'states' | 'variations' | 'content';
  file: string;
  css: string;
  globalRefs: string[];
}

export function getThemingCSS(
  componentSpec: ComponentSpec,
  primitivePath: string,
  attributes: string[]
): ThemingResult[] {
  const results: ThemingResult[] = [];

  for (const attr of attributes) {
    // 1. Resolve value to attribute (large → size)
    const resolvedAttr = componentSpec.optionAttributes?.[attr] || attr;

    // 2. Find category
    const category = findCategory(componentSpec, resolvedAttr);
    if (!category) continue;

    // 3. Build file path
    const filePath = buildCSSPath(primitivePath, category, resolvedAttr);
    if (!existsSync(filePath)) continue;

    // 4. Read CSS
    const css = readFileSync(filePath, 'utf-8');

    // 5. Extract global references
    const globalRefs = extractGlobalRefs(css, componentSpec.tagName);

    results.push({
      attribute: resolvedAttr,
      category,
      file: filePath,
      css,
      globalRefs
    });
  }

  return results;
}

function findCategory(spec: ComponentSpec, attr: string): string | null {
  if (spec.types?.includes(attr)) return 'types';
  if (spec.states?.includes(attr)) return 'states';
  if (spec.variations?.includes(attr)) return 'variations';
  if (spec.content?.includes(attr)) return 'content';
  return null;
}

function buildCSSPath(primitivePath: string, category: string, attr: string): string {
  return resolve(primitivePath, `css/theme/${category}/${attr}-variables.css`);
}

function extractGlobalRefs(css: string, tagName: string): string[] {
  const componentPrefix = `--${tagName.replace('ui-', '')}-`;
  const refs = new Set<string>();

  const matches = css.matchAll(/var\((--[\w-]+)\)/g);
  for (const match of matches) {
    const token = match[1];
    // Global ref = doesn't start with component prefix
    if (!token.startsWith(componentPrefix)) {
      refs.add(token);
    }
  }

  return [...refs];
}
```

### MCP Tool: `get_theming_css`

**Location**: `tools/mcp/src/index.ts` (add to existing tools)

```typescript
{
  name: 'get_theming_css',
  description: 'Get CSS custom properties that control specific component attributes. Input can be HTML like "<ui-button large red>" or just attributes like "large red".',
  parameters: {
    component: {
      type: 'string',
      description: 'Component name (e.g., "button")'
    },
    attributes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Attributes to look up (e.g., ["large", "red"])'
    }
  },
  handler: async ({ component, attributes }) => {
    const spec = loadComponentSpec(component);
    const primitivePath = getPrimitivePath(component);

    const results = getThemingCSS(spec, primitivePath, attributes);

    return {
      component,
      results: results.map(r => ({
        attribute: r.attribute,
        category: r.category,
        file: r.file.replace(primitivePath, ''),
        css: r.css,
        globalTokens: r.globalRefs
      }))
    };
  }
}
```

### Optional: Parse HTML Input

Allow passing full HTML like `<ui-button large red>`:

```typescript
function parseAttributesFromHTML(html: string): { component: string, attributes: string[] } {
  const match = html.match(/<(ui-[\w-]+)\s+([^>]+)>/);
  if (!match) throw new Error('Invalid HTML');

  const component = match[1].replace('ui-', '');
  const attrString = match[2];

  // Parse boolean attributes (large red) and key=value (size="large")
  const attributes = [];
  const booleanAttrs = attrString.match(/(?<!=)(\b[\w-]+\b)(?!=)/g) || [];
  attributes.push(...booleanAttrs.filter(a => !a.includes('=')));

  return { component, attributes };
}
```

## Example Usage

**Query:**
```
get_theming_css({ component: "button", attributes: ["large", "red"] })
```

**Response:**
```json
{
  "component": "button",
  "results": [
    {
      "attribute": "size",
      "category": "variations",
      "file": "css/theme/variations/size-variables.css",
      "css": ":host {\n  --button-mini-font-size: 0.78571429rem;\n  --button-tiny-font-size: 0.85714286rem;\n  ...\n}",
      "globalTokens": ["--relative-11px", "--relative-12px", "--relative-14px"]
    },
    {
      "attribute": "color",
      "category": "variations",
      "file": "css/theme/variations/color-variables.css",
      "css": ":host([red]) {\n  --button-colored-background: var(--red);\n  ...\n}",
      "globalTokens": ["--red", "--white-90", "--black-80"]
    }
  ]
}
```

## What This Enables

1. **"How do I make large buttons bigger?"**
   - Tool returns `size-variables.css`
   - AI sees `--button-large-font-size: 1.125rem`
   - Answers: "Override `--button-large-font-size` or change the global token it references"

2. **"Why is my red button too dark?"**
   - Tool returns `color-variables.css`
   - AI sees `--button-colored-background: var(--red)`
   - Answers: "The button uses the `--red` global token. Adjust that or override `--button-colored-background`"

3. **"What's the hover animation speed?"**
   - Query with `hover` attribute
   - Returns `states/hover-variables.css`
   - AI sees `var(--duration)` reference
   - Answers: "Controlled by `--duration` global token"

## Tasks

- [ ] Audit all primitives for filename inconsistencies (size/sizing, color/colored pattern)
- [ ] Rename inconsistent files to match attribute names
- [ ] Implement `getThemingCSS` utility function
- [ ] Add `get_theming_css` MCP tool
- [ ] Add HTML parsing helper for convenience
- [ ] Test with button component
- [ ] Document in MCP tool descriptions
