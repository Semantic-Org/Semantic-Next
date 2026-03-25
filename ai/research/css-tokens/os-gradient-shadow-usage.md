# Shadow and Gradient Token Organization: A Cross-Framework Analysis

Research for Semantic UI's next-generation CSS token architecture.

---

## 1. Overarching Category Names

Frameworks organize shadows and gradients under varying umbrella categories:

| Framework | Shadow Category | Gradient Category | Parent Grouping |
|-----------|-----------------|-------------------|-----------------|
| **MUI (Material)** | `shadows` (array 0-24) | — (not tokenized) | `theme.shadows` |
| **Chakra UI** | `shadows` | `gradients` | `theme.tokens` |
| **Mantine** | `shadow` | — (not tokenized) | `theme` |
| **Tailwind CSS** | `boxShadow` / `--shadow-*` | — (via `backgroundImage`) | `theme` |
| **Open Props** | `--shadow-*` | `--gradient-*` | Flat (no parent) |
| **Radix UI** | — (not tokenized) | — (not tokenized) | — |
| **Pico CSS** | `--pico-box-shadow` | — (not tokenized) | Flat |
| **DaisyUI** | — (inherits Tailwind) | — (inherits Tailwind) | — |
| **Bulma** | `--bulma-shadow` | — (not tokenized) | `--bulma-*` |
| **IBM Carbon** | — (not tokenized as CSS vars) | — (not tokenized) | Sass mixins |
| **Atlassian** | `elevation.shadow.*` | — (not tokenized) | `elevation` |
| **Salesforce SLDS** | `--slds-g-shadow-*` | — (not tokenized) | `shadow` |
| **Adobe Spectrum** | `--spectrum-alias-dropshadow-*` | — (not tokenized) | `dropshadow` |
| **GitHub Primer** | `--shadow-*` | — (not tokenized) | `shadow` |
| **Shopify Polaris** | `--p-shadow-*` | — (not tokenized) | `shadow` |
| **PatternFly** | `--pf-t--global--box-shadow--*` | — (not tokenized) | `box-shadow` |

**Key Observation:** Shadows are nearly universal as tokens; gradients are rare. Only **Open Props** and **Chakra UI** explicitly tokenize gradients. Most frameworks expect gradients to be composed from color tokens.

---

## 2. Shadow Token Naming Patterns

### 2.1 Naming Approaches

| Approach | Example | Frameworks Using |
|----------|---------|------------------|
| **T-shirt sizing** | `shadow-sm`, `shadow-md`, `shadow-lg` | Tailwind, Chakra, Mantine, Bulma |
| **Numeric scale** | `shadow-1`, `shadow-2`, `shadow-3` | Open Props, Polaris |
| **Semantic/functional** | `shadow-raised`, `shadow-overlay` | Atlassian, Spectrum |
| **Numeric array** | `shadows[0]` through `shadows[24]` | MUI (Material Design) |
| **Component-specific** | `--pico-card-box-shadow` | Pico CSS |

### 2.2 T-Shirt Scale (Most Common)

```
xs    → extra small (subtle, 1-2px blur)
sm    → small (light lift)
md    → medium (default card elevation)
lg    → large (dropdown/popover)
xl    → extra large (modal)
2xl   → double extra large (dramatic)
```

**Frameworks using this:** Tailwind, Chakra UI, Mantine, Joy UI

### 2.3 Semantic/Elevation Scale

```
sunken    → inset, below surface
default   → flat, no shadow
raised    → slight elevation (cards)
overlay   → floating above (dropdowns)
overflow  → scroll indicators
```

**Frameworks using this:** Atlassian (primary approach)

### 2.4 Numeric Scale

```
shadow-1  → lowest elevation
shadow-2  → subtle
shadow-3  → medium
shadow-4  → high
shadow-5  → highest
shadow-6  → dramatic
```

**Frameworks using this:** Open Props (1-6), Polaris (100-500)

---

## 3. Shadow Token Values

### 3.1 Tailwind CSS Default Shadow Scale

| Token | Value |
|-------|-------|
| `--shadow-2xs` | `0 1px rgb(0 0 0 / 0.05)` |
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--shadow` (default) | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| `--shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |
| `--shadow-inner` | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)` |
| `--shadow-none` | `0 0 #0000` |

### 3.2 Chakra UI Default Shadow Scale

| Token | Value |
|-------|-------|
| `xs` | `0 0 0 1px rgba(0, 0, 0, 0.05)` |
| `sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` |
| `base` | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` |
| `md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` |
| `lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |
| `xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` |
| `2xl` | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` |
| `inner` | `inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)` |

### 3.3 Open Props Shadow Scale

| Token | Blur Range | Opacity |
|-------|------------|---------|
| `--shadow-1` | 1px blur | 0.04 |
| `--shadow-2` | 3px blur | 0.05 |
| `--shadow-3` | 6px blur | 0.06 |
| `--shadow-4` | 9px blur | 0.07 |
| `--shadow-5` | 15px blur | 0.08 |
| `--shadow-6` | 25px blur | 0.09 |

Open Props uses a **multi-layer shadow approach** with separate:
- `--shadow-color` (customizable per-theme)
- `--shadow-strength` (intensity multiplier)

### 3.4 MUI Material Design (25 Levels)

MUI implements the full Material Design elevation system with **25 discrete levels** (0-24):

| Elevation | Use Case | Approximate Blur |
|-----------|----------|------------------|
| 0 | Flat surface | 0px |
| 1 | Card, switch | ~1px |
| 2 | Raised button | ~3px |
| 4 | App bar | ~6px |
| 6 | FAB, snackbar | ~10px |
| 8 | Bottom nav, card hover | ~15px |
| 12 | Floating action | ~20px |
| 16 | Nav drawer, modal side | ~25px |
| 24 | Dialog | ~40px |

**Note:** MUI uses a 3-shadow composite (umbra, penumbra, ambient) for each level.

### 3.5 Atlassian Semantic Shadows

| Token | Value (Light) | Value (Dark) |
|-------|---------------|--------------|
| `elevation.shadow.raised` | Subtle drop shadow | Lighter surface + shadow |
| `elevation.shadow.overlay` | Deeper drop shadow | Lighter surface + shadow |
| `elevation.shadow.overflow.spread` | Fade gradient | Fade gradient (inverted) |
| `elevation.shadow.overflow.perimeter` | Edge shadow | Edge shadow |

Atlassian pairs shadows with **surface tokens** — the shadow alone is insufficient; you need both:
- `elevation.surface.raised` + `elevation.shadow.raised`
- `elevation.surface.overlay` + `elevation.shadow.overlay`

---

## 4. Shadow Architecture Patterns

### 4.1 Single-Layer vs Multi-Layer

| Approach | Description | Frameworks |
|----------|-------------|------------|
| **Single-layer** | One shadow per token | Pico, Bulma, SLDS |
| **Multi-layer** | 2-3 shadows composited | Tailwind, Chakra, MUI |
| **Customizable layers** | Color/strength separated | Open Props |

### 4.2 Shadow Color Customization

Most frameworks hard-code shadow colors (black with opacity), but some allow customization:

**Open Props:**
```css
--shadow-color: 220 3% 15%;  /* HSL channels */
--shadow-strength: 1%;
```

**Tailwind (v4):**
```css
--shadow-color: rgb(0 0 0);
```

**Polaris:**
```css
--p-shadow-color: rgba(0, 0, 0, 0.2);
```

### 4.3 Inset Shadows

| Framework | Token Name | Example |
|-----------|------------|---------|
| Tailwind | `shadow-inner` | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)` |
| Chakra | `inner` | `inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)` |
| Open Props | `--inner-shadow-*` | Multiple levels (1-4) |
| Pico | `--pico-form-element-focus-color` | Used for focus rings |

---

## 5. Gradient Token Organization

**Critical Finding:** Gradient tokenization is rare. Only 2 frameworks have explicit gradient tokens:

### 5.1 Open Props Gradients (30 Prebuilt)

Open Props provides 30 hand-crafted gradient presets:

| Token | Type | Description |
|-------|------|-------------|
| `--gradient-1` | Linear | Purple to orange sunset |
| `--gradient-2` | Linear | Purple to violet |
| `--gradient-3` | Linear | Pink to coral |
| `--gradient-4` | Conic | Rainbow |
| `--gradient-5` | Conic | Fuchsia to white |
| `--gradient-6` | Conic | Black to white |
| `--gradient-7` | Linear | Blue ocean |
| `--gradient-8` | Conic | Dark metallic |
| `--gradient-9` | Conic | Light blue fade |
| `--gradient-10` | Conic | Warm fire spectrum |
| ... | ... | ... |
| `--gradient-30` | Radial | Various effects |

**Naming Pattern:** Pure numeric (`--gradient-1` through `--gradient-30`)

**Also provides:**
- `--gradient-space`: Color space for interpolation (`in oklch`)
- `--noise-*`: SVG noise filters to combine with gradients

### 5.2 Chakra UI Gradients

Chakra allows gradient tokens but doesn't ship defaults:

```javascript
const tokens = defineTokens({
  gradients: {
    primary: { 
      value: 'linear-gradient(to right, red, blue)' 
    },
    // Or composite syntax:
    sunset: {
      value: {
        type: 'linear',
        placement: 'to right',
        stops: ['#ff6b6b', '#feca57', '#48dbfb']
      }
    }
  }
})
```

### 5.3 Panda CSS Gradient Tokens

Panda CSS (powering Chakra v3) supports:

```javascript
gradients: {
  simple: { value: 'linear-gradient(to right, red, blue)' },
  primary: { 
    value: {
      type: 'linear',
      placement: 'to right',
      stops: ['red', 'blue']
    }
  }
}
```

### 5.4 Why Gradients Aren't Tokenized

Most frameworks expect you to compose gradients from color tokens:

```css
/* Instead of: */
--gradient-primary: linear-gradient(to right, #3b82f6, #8b5cf6);

/* Frameworks expect: */
background: linear-gradient(
  to right, 
  var(--color-primary), 
  var(--color-accent)
);
```

**Rationale:** Gradients are considered compositional (built from primitives) rather than primitive (atomic values).

---

## 6. Token Naming Vocabulary

### 6.1 Shadow-Specific Terms

| Term | Frequency | Meaning |
|------|-----------|---------|
| `shadow` | Universal | Generic shadow |
| `elevation` | 6/22 | Semantic depth (Atlassian, MUI, Spectrum) |
| `raised` | 4/22 | Elevated above surface |
| `overlay` | 4/22 | Floating/modal level |
| `sunken` | 2/22 | Below surface (Atlassian) |
| `inset` | 5/22 | Inner shadow |
| `inner` | 5/22 | Inner shadow (synonym) |
| `drop` | 3/22 | Drop shadow (Spectrum) |
| `ambient` | 2/22 | Soft fill shadow (MUI) |
| `umbra` | 1/22 | Hard shadow (MUI) |
| `penumbra` | 1/22 | Soft edge shadow (MUI) |
| `overflow` | 1/22 | Scroll indicator (Atlassian) |

### 6.2 Gradient-Specific Terms

| Term | Framework | Meaning |
|------|-----------|---------|
| `gradient` | Open Props, Chakra | Generic gradient |
| `linear` | Panda CSS | Directional gradient |
| `radial` | Panda CSS | Circular gradient |
| `conic` | Open Props | Angular gradient |
| `noise` | Open Props | Texture overlay |

---

## 7. Dark Mode Shadow Handling

| Framework | Approach |
|-----------|----------|
| **Atlassian** | Surface color lightens + shadow softens |
| **MUI** | Elevation uses surface lightening, not shadow |
| **Tailwind** | Same shadows (no automatic dark adjustment) |
| **Chakra** | Semantic tokens can have `_dark` variants |
| **Open Props** | `--shadow-color` changes per theme |

**Atlassian's insight:** In dark mode, shadows are harder to perceive. They compensate by using **surface color differentiation** (higher elevation = lighter surface in dark mode).

---

## 8. Elevation vs Shadow Distinction

Some systems separate the concepts:

| Concept | What It Controls | Frameworks |
|---------|------------------|------------|
| **Elevation** | Semantic layer level (z-index intent) | Atlassian, MUI |
| **Shadow** | Visual implementation of depth | All |
| **Surface** | Background color at elevation | Atlassian, MUI, Carbon |

**Atlassian's 3-token pattern:**
```css
/* Each elevation needs all three: */
.card {
  background: var(--ds-elevation-surface-raised);
  box-shadow: var(--ds-elevation-shadow-raised);
  /* z-index implied by context */
}
```

---

## 9. Scale Comparison Table

| Framework | Steps | Min Blur | Max Blur | Inset? |
|-----------|-------|----------|----------|--------|
| Tailwind | 8 | 1px | 50px | Yes |
| Chakra | 8 | 0px | 50px | Yes |
| Open Props | 6 | 1px | 25px | Yes (4) |
| MUI | 25 | 0px | ~40px | No |
| Mantine | 5 | 1px | 20px | No |
| Bulma | 1 | — | — | No |
| Atlassian | 4 | — | — | No |
| Polaris | 6 | 0px | 32px | Yes |

---

## 10. Recommendations for Semantic UI

### For Shadows:

1. **Use t-shirt sizing** (xs, sm, md, lg, xl, 2xl) — it's the dominant community pattern
2. **Include `inner` variant** for form fields and pressed states
3. **Separate shadow color token** for theming flexibility
4. **Consider semantic aliases**: `shadow-card`, `shadow-dropdown`, `shadow-modal` that reference scale values
5. **Dark mode**: Follow Atlassian's pattern of pairing shadows with surface color changes

### For Gradients:

1. **Don't tokenize by default** — let users compose from color tokens
2. **If tokenizing**: Use numeric naming (`--gradient-1`) like Open Props, or semantic (`--gradient-primary`)
3. **Provide gradient utilities** rather than preset values
4. **Consider color-stop tokens** instead of full gradients:
   ```css
   --gradient-start: var(--color-primary);
   --gradient-end: var(--color-accent);
   ```

### Naming Convention Alignment:

```css
/* Shadow tokens */
--shadow-xs
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl
--shadow-inner
--shadow-none

/* Shadow modifiers */
--shadow-color
--shadow-opacity

/* Semantic aliases (optional) */
--shadow-card: var(--shadow-md);
--shadow-dropdown: var(--shadow-lg);
--shadow-modal: var(--shadow-xl);

/* If gradients are tokenized */
--gradient-1
--gradient-2
/* or */
--gradient-primary
--gradient-accent
```

---

*Research compiled January 2026 for Semantic UI development*
