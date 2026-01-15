# Design Token Categories Comparison Matrix

A comparison of design token categories across major open-source design systems that use CSS custom properties.

---

## Token Category Matrix

| Token Category | Nord Health | Shopify Polaris | IBM Carbon | Adobe Spectrum | Salesforce SLDS | GitHub Primer | Red Hat PatternFly | Microsoft Fluent UI | GOV.UK | Suomi.fi |
|----------------|:-----------:|:---------------:|:----------:|:--------------:|:---------------:|:-------------:|:------------------:|:-------------------:|:------:|:--------:|
| **Color** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Background Color** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Text Color** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Border Color** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Icon Color** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Border Radius** | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| **Border Width** | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Box Shadow / Elevation** | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ |
| **Font Family** | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Font Size** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Font Weight** | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Line Height** | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Letter Spacing** | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Space / Spacing** | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Size / Dimension** | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Width** | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Height** | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Transition / Motion** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| **Animation Duration** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Animation Easing** | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| **Z-Index** | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Breakpoints** | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| **Opacity** | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Focus States** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| **Gradient** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Category Totals

| Design System | Categories Covered | Percentage |
|---------------|:------------------:|:----------:|
| **Shopify Polaris** | 21 | 84% |
| **Adobe Spectrum** | 18 | 72% |
| **Nord Health** | 17 | 68% |
| **IBM Carbon** | 15 | 60% |
| **Microsoft Fluent UI** | 15 | 60% |
| **Red Hat PatternFly** | 15 | 60% |
| **GitHub Primer** | 15 | 60% |
| **Suomi.fi** | 14 | 56% |
| **Salesforce SLDS** | 11 | 44% |
| **GOV.UK** | 9 | 36% |

---

## Legend

| Symbol | Meaning |
|:------:|---------|
| ✓ | Token category is explicitly documented and available as CSS custom properties |
| ✗ | Token category is not available or not documented as CSS custom properties |

---

## Notes

1. **Color categories**: Most systems break "Color" into semantic subcategories (background, text, border, icon). The matrix shows both the umbrella "Color" category and its common subdivisions.

2. **Typography**: Font-related tokens are often grouped under a "Typography" umbrella. The matrix breaks these into constituent parts (family, size, weight, line-height).

3. **Motion/Transition**: Some systems combine duration and easing under a single "Motion" or "Transition" category.

4. **System-specific categories**: Some systems have unique categories not shown here:
   - **Polaris**: Has separate "Text" category combining multiple typography tokens
   - **Carbon**: Has "Layout" context tokens and AI-specific tokens
   - **PatternFly**: Has "Chart" tokens for data visualization
   - **Spectrum**: Has "Scale" variants (medium/large) as a meta-category

5. **Government systems**: GOV.UK and Suomi.fi prioritize accessibility tokens (focus states) over decorative ones (shadows, animations).

---

## Taxonomy by Documentation Structure

Below is how each system **officially organizes** their token documentation (matching their navigation/API structure):

### Nord Health
`Color` → `Border Radius` → `Box Shadow` → `Font Size` → `Font` → `Line Height` → `Size` → `Space` → `Transition` → `Z-index`

### Shopify Polaris
`Border` → `Breakpoints` → `Color` → `Font` → `Height` → `Motion` → `Shadow` → `Space` → `Text` → `Width` → `Z-Index`

### IBM Carbon
`Color` → `Spacing` → `Typography` → `Global` → `Layout` → `Motion`

### Adobe Spectrum
`Color` → `Typography` → `Spacing` → `Sizing` → `Animation` → `Corner Radius` → `Object Styles` → `Scale`

### Salesforce SLDS
`Background Color` → `Text Color` → `Border Color` → `Font Weight` → `Font Size` → `Opacity` → `Sizing` → `Shadow` → `Timing` → `Media Query` → `Z-Index`

### GitHub Primer
`Color` → `Typography` → `Spacing` → `Size` → `Border` → `Breakpoints` → `Viewport` → `Motion`

### Red Hat PatternFly
`Color` → `Spacer` → `Typography` → `Border` → `Box Shadow` → `Motion` → `Icon` → `Chart`

### Microsoft Fluent UI
`Color` → `Typography` → `Corner Radius` → `Stroke Width` → `Spacing` → `Shadow` → `Duration` → `Easing`

### GOV.UK
`Color` → `Typography` → `Spacing` → `Layout` → `Focus` → `Link` → `Print`

### Suomi.fi
`Color` → `Typography` → `Spacing` → `Gradient` → `Shadow` → `Focus` → `Radius` → `Transition` → `Breakpoints`

---

*Document compiled January 2026*
