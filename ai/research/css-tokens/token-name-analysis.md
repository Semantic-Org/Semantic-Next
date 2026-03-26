# Design Token Taxonomy: A Descriptive Linguistic Analysis

Research for Semantic UI's next-generation CSS token architecture.

---

## 1. Token Category Frequency Analysis

How often does each concept appear as a distinct token category across 11 major systems?

| Category | Frequency | Systems Using |
|----------|:---------:|---------------|
| Color (umbrella) | 11/11 | Universal |
| Font Size | 11/11 | Universal |
| Spacing | 11/11 | Universal |
| Font Family | 10/11 | All except SLDS |
| Line Height | 9/11 | Missing: SLDS, Base Web |
| Font Weight | 10/11 | Missing: Nord |
| Border Radius | 9/11 | Missing: Carbon, Atlassian |
| Box Shadow / Elevation | 9/11 | Missing: Carbon, Base Web |
| Motion / Transition | 8/11 | Missing: Primer, Atlassian, Gestalt |
| Border Width | 7/11 | |
| Size / Dimension | 6/11 | |
| Z-Index | 4/11 | Nord, Polaris, SLDS, Primer |
| Breakpoints | 3/11 | Polaris, SLDS, Primer |
| Opacity | 2/11 | Spectrum, SLDS |
| Data Visualization | 3/11 | PatternFly, Atlassian, Gestalt |

**Observation:** The "universal three" are Color, Typography (size), and Spacing. Everything else varies by system philosophy.

---

## 2. Color Subcategory Patterns

How do systems subdivide the "Color" category?

### Pattern A: By Element Role (Most Common)
```
background  →  what sits behind
text        →  what you read
border      →  what defines edges
icon        →  what illustrates
```

**Systems using this:** Carbon, Polaris, Primer, PatternFly, Atlassian

### Pattern B: By Surface/Layer Hierarchy
```
surface-1   →  base canvas
surface-2   →  elevated cards
surface-3   →  overlays/modals
```

**Systems using this:** Carbon (`$layer-01/02/03`), SLDS (`surface-container-1`), Spectrum

### Pattern C: By Interaction State
```
default     →  resting state
hover       →  pointer over
active      →  being pressed
focus       →  keyboard navigation
disabled    →  non-interactive
```

**Systems using this:** All systems, but naming varies (see Section 4)

### Pattern D: By Semantic Intent
```
primary     →  main action
secondary   →  supporting action
success     →  positive outcome
warning     →  caution needed
error       →  problem occurred
info        →  neutral notice
```

**Systems using this:** Universal, but vocabulary differs

---

## 3. Naming Convention Analysis

### 3.1 Prefix Strategies

| System | Prefix | Example |
|--------|--------|---------|
| Carbon | `--cds-` | `--cds-text-primary` |
| SLDS | `--slds-g-` / `--slds-c-` | `--slds-g-color-brand-base` |
| Spectrum | `--spectrum-` | `--spectrum-global-color-blue-400` |
| Polaris | `--p-` | `--p-color-bg-surface` |
| Primer | (none) | `--fgColor-default` |
| PatternFly | `--pf-t--` | `--pf-t--global--spacer--sm` |
| Atlassian | `--ds-` | `--ds-text` |

**Observation:** Primer is the outlier—no namespace prefix, relying on semantic naming to avoid collision.

### 3.2 Delimiter Patterns

| Pattern | Example | Systems |
|---------|---------|---------|
| Single hyphen | `--p-color-bg-surface` | Polaris |
| Double hyphen | `--pf-t--global--spacer--sm` | PatternFly |
| camelCase | `--fgColor-default` | Primer |
| Dot notation (JS) | `color.text.primary` | Atlassian (JS API) |

### 3.3 Word Order Patterns

**Category-first (most common):**
```
color-background-primary
spacing-small
font-size-large
```

**Property-first:**
```
background-color-primary
size-font-large
```

**Role-first (Primer's innovation):**
```
fgColor-default      (foreground color)
bgColor-canvas       (background color)
borderColor-muted    (border color)
```

---

## 4. State Naming Vocabulary

How do systems name interaction states?

| Concept | Carbon | SLDS | Spectrum | Polaris | Primer | PatternFly |
|---------|--------|------|----------|---------|--------|------------|
| Normal | (none) | `default` | `default` | (none) | `default` | `default` |
| Pointer over | `hover` | `hover` | `hover` | `hover` | `hover` | `hover` |
| Being clicked | `active` | `active` | `down` | `active` | `active` | `clicked` |
| Keyboard focus | `focus` | `focus` | `focus` | `focus` | `focus` | `focus` |
| Not available | `disabled` | `disabled` | `disabled` | `disabled` | `disabled` | `disabled` |
| Chosen | `selected` | `selected` | `selected` | `selected` | `selected` | `selected` |

**Observation:** Near-universal agreement except Spectrum's `down` and PatternFly's `clicked` for the active state.

---

## 5. Semantic Intent Vocabulary

### 5.1 Action Hierarchy

| Concept | Carbon | SLDS | Polaris | Primer | PatternFly |
|---------|--------|------|---------|--------|------------|
| Main action | `interactive-01` | `brand` | `action-primary` | `accent` | `primary` |
| Supporting | `interactive-02` | `neutral` | `action-secondary` | `default` | `secondary` |
| Danger action | `danger` | `destructive` | `critical` | `danger` | `danger` |

**Observation:** No consensus. "Primary/secondary" vs "01/02" vs "brand/neutral" represent fundamentally different mental models.

### 5.2 Status/Feedback Colors

| Concept | Most Common Term | Alternatives |
|---------|------------------|--------------|
| Positive | `success` | `positive`, `good` |
| Negative | `error` | `danger`, `critical`, `negative` |
| Caution | `warning` | `caution`, `attention` |
| Neutral info | `info` | `information`, `notice` |

**Observation:** `success/warning/error/info` is the emerging standard (SLDS, PatternFly, Atlassian).

---

## 6. Spacing Scale Patterns

### 6.1 Naming Approaches

**Numeric (t-shirt alternative):**
```
spacing-1, spacing-2, spacing-3...
space-100, space-200, space-400...
```
Systems: Polaris (`space-100` = 4px), PatternFly, Atlassian

**T-shirt sizing:**
```
spacing-xs, spacing-sm, spacing-md, spacing-lg, spacing-xl
```
Systems: PatternFly (also supports), Primer

**Pixel-based (explicit):**
```
spacing-4, spacing-8, spacing-16...
```
Systems: SLDS

**Hybrid (Carbon):**
```
$spacing-01 (2px) through $spacing-13 (160px)
```

### 6.2 Base Unit Analysis

| System | Base Unit | Scale |
|--------|-----------|-------|
| Carbon | 2px | 2, 4, 8, 12, 16, 24, 32, 40, 48... |
| Polaris | 4px | 4, 8, 12, 16, 20, 24, 32... |
| Primer | 4px | 4, 8, 16, 24, 32... |
| Spectrum | 4px | 4, 8, 16, 24, 32, 40... |
| PatternFly | 4px | xs(4), sm(8), md(16), lg(24), xl(32)... |

**Observation:** 4px base is dominant. Carbon's 2px base allows finer control but adds complexity.

---

## 7. Typography Token Patterns

### 7.1 Category Subdivision

**Flat (single category):**
```
font-size-sm, font-size-md, font-size-lg
font-weight-regular, font-weight-bold
line-height-tight, line-height-normal
```

**Grouped by property:**
```
typography/
  ├── size/
  ├── weight/
  ├── family/
  └── line-height/
```

**Grouped by intent (Carbon):**
```
typography/
  ├── productive/    (dense UI)
  ├── expressive/    (editorial)
  └── utility/       (code, labels)
```

### 7.2 Size Scale Vocabulary

| Approach | Example | Systems |
|----------|---------|---------|
| Numeric | `font-size-100`, `font-size-200` | Polaris, Spectrum |
| T-shirt | `font-size-sm`, `font-size-lg` | PatternFly, Primer |
| Semantic | `body-01`, `heading-02`, `caption` | Carbon |
| Pixel-explicit | `font-size-12`, `font-size-14` | (rare) |

---

## 8. The Three-Tier Architecture

Most mature systems use a three-level hierarchy:

```
┌─────────────────────────────────────────────────────────┐
│  PRIMITIVE / GLOBAL                                     │
│  Raw values. The palette. No semantic meaning.          │
│  Example: blue-400, gray-50, 16px                       │
├─────────────────────────────────────────────────────────┤
│  SEMANTIC / ALIAS                                       │
│  Intent mapping. What the value means.                  │
│  Example: cta-background, text-primary, spacing-md      │
├─────────────────────────────────────────────────────────┤
│  COMPONENT                                              │
│  Specific implementation.                               │
│  Example: button-primary-bg, card-padding               │
└─────────────────────────────────────────────────────────┘
```

**Adoption:**
- Full three-tier: Spectrum, SLDS, PatternFly
- Two-tier (primitive + semantic): Carbon, Polaris, Primer
- Flat: Nord, Gestalt

---

## 9. Unique Patterns Worth Noting

### 9.1 Carbon's Layering Model
Tokens recalculate based on DOM context:
```css
.layer-01 { --cds-text-primary: #161616; }
.layer-02 { --cds-text-primary: #161616; }  /* same in light */
.layer-01.dark { --cds-text-primary: #f4f4f4; }
.layer-02.dark { --cds-text-primary: #f4f4f4; }
```
Nested layers can have different themes without component variants.

### 9.2 Primer's Functional Naming
Decouples name from appearance:
```css
/* Old: appearance-based */
--color-text-gray-900

/* New: function-based */
--fgColor-default
```
Theme switching only changes the mapping, not the variable names.

### 9.3 SLDS Fallback Chains
Component → Global → Primitive:
```css
background: var(--slds-c-button-color-background, 
            var(--slds-g-color-brand-base, 
            #0176d3));
```

### 9.4 Spectrum's Scale Dimension
Same token, different values by device:
```css
/* medium-vars.css (desktop) */
--spectrum-button-padding: 14px;

/* large-vars.css (touch) */
--spectrum-button-padding: 18px;
```

---

## 10. Vocabulary Frequency (Semantic Terms)

Terms that appear across 5+ systems:

| Term | Usage | Frequency |
|------|-------|-----------|
| `primary` | Main element/action | 10/11 |
| `secondary` | Supporting element | 9/11 |
| `default` | Resting state | 8/11 |
| `surface` | Background container | 7/11 |
| `muted` | De-emphasized | 6/11 |
| `subtle` | Low contrast | 5/11 |
| `inverse` | Flipped for contrast | 5/11 |
| `on-[x]` | Color for content on surface | 5/11 |
| `interactive` | Clickable element | 4/11 |
| `canvas` | Page background | 3/11 |

---

## 11. Patterns for Semantic UI Consideration

Based on this analysis, emerging conventions that align with "natural language" naming:

### High Consensus (safe to adopt)
- `success`, `warning`, `error`, `info` for status
- `hover`, `focus`, `disabled` for states
- 4px base spacing unit
- `primary`, `secondary` for hierarchy

### Divergent (opportunity for Semantic's voice)
- Action color naming (no standard)
- Spacing scale naming (numeric vs t-shirt vs semantic)
- Typography grouping strategy
- Layer/surface vocabulary

### Semantic UI's Historical Strength
Semantic UI's original innovation was **readable class names**:
```html
<div class="ui red large button">
```

The token equivalent could extend this:
```css
--ui-color-red
--ui-size-large
--ui-element-button-background
```

Or more linguistically:
```css
--color-negative
--size-large  
--button-background
```

---

*Research compiled January 2026 for Semantic UI development*
