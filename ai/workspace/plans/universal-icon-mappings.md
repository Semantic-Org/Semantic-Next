# Universal Icon Mappings Implementation Plan

## Overview

Implement a universal icon naming system that maps semantic icon names (like "delete", "close", "user") to native icon set names (like Feather's "trash-2", "x", "user"). This enables portable icon usage across different icon sets and better AI code generation.

## Architecture

```
src/primitives/icon/sets/
├── mappings.json          ← Universal mapping source of truth
├── feather/
│   └── index.css          ← Native defs + universal aliases
├── lucide/
│   └── index.css          ← (future)
└── ...
```

**How it works:**
- Universal names are CSS variable aliases pointing to native names
- `<ui-icon close>` → `--icon-close` → `var(--icon-x)` → Feather's X icon
- Same markup works across icon sets by swapping which CSS is loaded

---

## Tasks

### Task 1: Move mapping file to canonical location

**From:** `ai/workspace/memory/icon-set-mappings-full.md`
**To:** `src/primitives/icon/sets/mappings.json`

The file is already JSON content inside a markdown wrapper. Extract the JSON and save as proper `.json` file.

**Validation:**
- File parses as valid JSON
- Contains `meta` and `icons` keys
- Icons have mappings for target sets (feather, lucide, heroicons, etc.)

---

### Task 2: Update icon.spec.js with universal names

**File:** `src/primitives/icon/specs/icon.spec.js`

Add universal icon names to the `content[0].options` array. This enables the shorthand syntax:
```html
<ui-icon close></ui-icon>
```

**Source for names:** Extract all keys from `mappings.json` → `icons` object.

**Expected additions (~240 names):**
- Navigation: home, dashboard, menu, close, back, next, chevron-right, etc.
- User: user, avatar, users, add-user, login, logout, etc.
- Actions: add, edit, delete, save, check, refresh, copy, etc.
- And all other categories from the mapping

**Note:** Keep existing native Feather names for backwards compatibility. Universal names are additive.

---

### Task 3: Add universal aliases to Feather index.css

**File:** `src/primitives/icon/sets/feather/index.css`

After the native icon definitions, add universal alias section:

```css
/* Native Feather definitions (existing) */
:root {
  --icon-trash-2: url('./trash-2.svg');
  --icon-x: url('./x.svg');
  /* ... */
}

/* Universal aliases */
:root {
  /* Navigation */
  --icon-close: var(--icon-x);
  --icon-cancel: var(--icon-close);
  --icon-dismiss: var(--icon-close);

  /* Actions */
  --icon-delete: var(--icon-trash-2);
  --icon-trash: var(--icon-delete);
  --icon-remove: var(--icon-delete);

  /* ... all mappings from mappings.json where feather name differs from universal name */
}
```

**Rules:**
1. Skip aliases where universal name === feather name (e.g., "home" → "home")
2. Include all listed aliases from the mapping
3. Chain aliases where appropriate (e.g., `--icon-trash` → `var(--icon-delete)`)

---

## Verification

After implementation:

1. **Spec validates:**
   ```bash
   npm run build:ui-deps
   ```
   Should generate updated `icon.spec.json` and `icon.component.js`

2. **CSS resolves correctly:**
   ```html
   <ui-icon delete></ui-icon>
   <ui-icon trash-2></ui-icon>
   ```
   Both should render the same icon (Feather's trash-2)

3. **Shorthand works:**
   ```html
   <ui-icon close></ui-icon>
   ```
   Should render Feather's X icon

---

## Future Work

- Add workflows to `ai/contributing/workflows/` for generating icon set aliases
- Support additional icon sets (Lucide, Heroicons, Tabler, etc.)
- Consider tooling to validate mapping coverage

---

## Files Modified

| File | Change |
|------|--------|
| `ai/workspace/memory/icon-set-mappings-full.md` | Deleted (moved) |
| `src/primitives/icon/sets/mappings.json` | Created (canonical source) |
| `src/primitives/icon/specs/icon.spec.js` | Updated options array |
| `src/primitives/icon/sets/feather/index.css` | Added universal aliases |
