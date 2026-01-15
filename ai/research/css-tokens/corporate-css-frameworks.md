# Open Source Design Systems with CSS Custom Property Design Tokens

A curated list of production-grade, open-source design systems used by major companies that provide design tokens as CSS custom properties. Systems are ranked by quality, completeness, and comprehensiveness of their token architecture.

---

## 1. Nord Health Design System (Nordhealth)

**Company:** Nordhealth  
**Website:** https://nordhealth.design/  
**GitHub:** https://github.com/nicksrandall/nord  
**License:** MIT

### Overview
Nord is an exemplary design system that powers Nordhealth's veterinary and therapy software products. It features a comprehensive web component library with encapsulated styles, a CSS utility framework, and extensive theming capabilities. The documentation is exceptionally well-organized and serves as a benchmark for design system quality.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Brand colors, semantic colors, status colors, surface colors |
| **Border Radius** | Corner radius scale for UI elements |
| **Box Shadow** | Elevation and depth tokens |
| **Font Size** | Typographic scale |
| **Font** | Font family definitions |
| **Line Height** | Text line height scale |
| **Size** | Dimension tokens for components |
| **Space** | Spacing scale (margins, padding, gaps) |
| **Transition** | Animation timing and easing |
| **Z-index** | Stacking order tokens |

---

## 2. Shopify Polaris

**Company:** Shopify  
**Website:** https://polaris.shopify.com/  
**GitHub:** https://github.com/Shopify/polaris  
**License:** Custom (MIT-based with Shopify integration restrictions)

### Overview
Polaris is Shopify's mature design system powering the Shopify admin, POS, and mobile applications. It recently transitioned to web components and offers comprehensive React components with full CSS variable support. The system is well-documented with excellent token organization and semantic naming.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Extensive semantic color system (background, surface, fill, text, border, icon variants with states) |
| **Border** | Border width, style, and color tokens |
| **Breakpoints** | Responsive design breakpoints |
| **Font** | Font family, weight, and style tokens |
| **Height** | Component height scale |
| **Motion** | Animation duration and easing tokens |
| **Shadow** | Box shadow and elevation tokens |
| **Space** | Spacing scale (100-1600 based on 4px base) |
| **Text** | Typography tokens (size, weight, line-height) |
| **Width** | Component width tokens |
| **Z-Index** | Layering and stacking tokens |

---

## 3. IBM Carbon Design System

**Company:** IBM  
**Website:** https://carbondesignsystem.com/  
**GitHub:** https://github.com/carbon-design-system/carbon  
**License:** Apache 2.0

### Overview
Carbon is IBM's open-source design system for products and digital experiences. Built on the IBM Design Language, it provides a comprehensive set of components, guidelines, and tools. Carbon v11 introduced CSS custom properties for all tokens, enabling powerful theming including light/dark mode support.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Core tokens, component tokens, AI tokens (background, text, icon, border, interactive states) |
| **Spacing** | Component spacing scale and layout spacing scale |
| **Typography** | Productive and expressive type styles (universal, body, heading, label tokens) |
| **Global** | Layer usage, border width, component-specific variables |
| **Layout** | Size and density context tokens |
| **Motion** | Animation timing and easing |
| **Themes** | White, g10, g90, g100 theme variants |

---

## 4. Adobe Spectrum

**Company:** Adobe  
**Website:** https://spectrum.adobe.com/  
**GitHub:** https://github.com/adobe/spectrum-css  
**License:** Apache 2.0

### Overview
Spectrum is Adobe's design system powering Creative Cloud, Document Cloud, and Experience Cloud products. It provides design tokens through the `@spectrum-css/tokens` package and supports multiple system variants (Spectrum, Express, Spectrum 2). The system emphasizes multi-platform consistency with tokens available for web, iOS, and Android.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Color palette, semantic colors, background, foreground, and component-specific colors |
| **Typography** | Font family, size, weight, line height, letter spacing |
| **Spacing** | Margin and padding scale |
| **Sizing** | Component dimensions and layout sizes |
| **Animation** | Timing, easing, duration tokens |
| **Corner Radius** | Border radius scale |
| **Object Styles** | Shadows, borders, opacity |
| **Scale** | Medium and large scale variants for desktop/mobile |

---

## 5. Salesforce Lightning Design System (SLDS)

**Company:** Salesforce  
**Website:** https://www.lightningdesignsystem.com/  
**GitHub:** https://github.com/salesforce-ux/design-system  
**License:** BSD 3-Clause

### Overview
SLDS (now transitioning to SLDS 2) pioneered design tokens in 2016 and remains influential. SLDS 2 introduces "global styling hooks" as CSS custom properties, replacing the older design token system. The system powers all Salesforce products and offers comprehensive accessibility support.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Background Color** | Surface and component backgrounds |
| **Text Color** | Typography and content colors |
| **Border Color** | Edge and separator colors |
| **Font Weight** | Typography weight scale |
| **Font Size** | Typographic scale |
| **Opacity** | Transparency tokens |
| **Sizing** | Width and height scale |
| **Shadow** | Elevation and atmosphere tokens |
| **Timing** | Animation duration tokens |
| **Media Query** | Responsive breakpoints |
| **Z-Index** | Stacking order |

---

## 6. GitHub Primer

**Company:** GitHub  
**Website:** https://primer.style/  
**GitHub:** https://github.com/primer  
**License:** MIT

### Overview
Primer is GitHub's design system, implemented as CSS and React components. The `@primer/primitives` package provides design tokens as CSS variables with excellent accessibility support, including multiple color modes (light, dark) and themes for color vision deficiencies.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Functional color system with light/dark modes, high contrast, and colorblind-friendly themes |
| **Typography** | Font family, size, weight, line height |
| **Spacing** | Consistent spacing scale |
| **Size** | Component dimension tokens |
| **Border** | Border width, radius, and color |
| **Breakpoints** | Responsive design tokens |
| **Viewport** | Screen size tokens |
| **Motion** | Animation and transition tokens |

---

## 7. Red Hat PatternFly

**Company:** Red Hat  
**Website:** https://www.patternfly.org/  
**GitHub:** https://github.com/patternfly/patternfly  
**License:** MIT

### Overview
PatternFly is Red Hat's open-source design system for enterprise web applications. PatternFly 6 introduced a comprehensive three-layer token system (palette, base, semantic) with excellent dark mode support. It's built to meet strict accessibility standards and integrates well with React.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Palette tokens, base tokens (status, nonstatus), semantic tokens (background, text, border, icon) |
| **Spacer** | Spacing scale (xs, sm, md, lg, xl, 2xl, 3xl, 4xl) |
| **Typography** | Font family, size, weight, line height |
| **Border** | Width, radius, color tokens |
| **Box Shadow** | Elevation and depth tokens |
| **Motion** | Animation timing and easing |
| **Icon** | Size scale for icons |
| **Chart** | Data visualization tokens |

---

## 8. Microsoft Fluent UI

**Company:** Microsoft  
**Website:** https://developer.microsoft.com/en-us/fluentui  
**GitHub:** https://github.com/microsoft/fluentui  
**License:** MIT

### Overview
Fluent UI implements Microsoft's Fluent Design System across web, React, and Blazor platforms. The web components version leverages FAST's adaptive UI technology with CSS custom properties. Tokens are generated through a pipeline that transforms JSON to platform-specific code.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Neutral colors, accent colors, brand colors, semantic colors (danger, success, warning) |
| **Typography** | Font family, size, weight, line height |
| **Corner Radius** | Border radius scale |
| **Stroke Width** | Border and line tokens |
| **Spacing** | Layout and component spacing |
| **Shadow** | Elevation tokens |
| **Duration** | Animation timing |
| **Easing** | Animation curves |

---

## 9. GOV.UK Design System

**Company:** UK Government Digital Service  
**Website:** https://design-system.service.gov.uk/  
**GitHub:** https://github.com/alphagov/govuk-frontend  
**License:** MIT

### Overview
The GOV.UK Design System helps UK government service teams build accessible, consistent services. It emphasizes accessibility, simplicity, and clarity. The system uses Sass variables that compile to CSS custom properties and follows strict government accessibility standards.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | Government palette, semantic colors, focus states |
| **Typography** | GDS Transport font, responsive type scale |
| **Spacing** | Responsive spacing scale |
| **Layout** | Grid and container tokens |
| **Focus** | Accessibility focus state tokens |
| **Link** | Link styling tokens |
| **Print** | Print-specific tokens |

---

## 10. Finnish Government Suomi.fi Design System

**Company:** Digital and Population Data Services Agency (DVV), Finland  
**Website:** https://suomi.fi/  
**GitHub:** https://github.com/vrk-kpa/suomifi-design-tokens  
**License:** MIT

### Overview
The Suomi.fi design system provides design tokens for Finnish government digital services. Tokens are exported as CSS-formatted strings with granular access to individual values and units, making them highly flexible for various implementation needs.

### Design Token Categories
| Category | Description |
|----------|-------------|
| **Color** | HSL-based color tokens with separated h, s, l values |
| **Typography** | Font family, size, weight, style |
| **Spacing** | Spacing scale with unit and value separation |
| **Gradient** | Linear gradient tokens |
| **Shadow** | Box shadow tokens |
| **Focus** | Focus ring and outline tokens |
| **Radius** | Border radius tokens |
| **Transition** | Animation timing functions |
| **Breakpoints** | Responsive breakpoint tokens |

---

## Summary Comparison

| Design System | Company | Token Categories | Theming | Web Components | React |
|---------------|---------|------------------|---------|----------------|-------|
| Nord Health | Nordhealth | 10 | ✅ | ✅ | ✅ |
| Polaris | Shopify | 11 | ✅ | ✅ | ✅ |
| Carbon | IBM | 6+ | ✅ | ✅ | ✅ |
| Spectrum | Adobe | 8 | ✅ | ✅ | ✅ |
| SLDS | Salesforce | 11 | ✅ | ✅ | ✅ |
| Primer | GitHub | 8 | ✅ | ❌ | ✅ |
| PatternFly | Red Hat | 8 | ✅ | ❌ | ✅ |
| Fluent UI | Microsoft | 8 | ✅ | ✅ | ✅ |
| GOV.UK | UK Gov | 7 | Limited | ❌ | ❌ |
| Suomi.fi | Finland Gov | 9 | ✅ | ❌ | ✅ |

---

## Selection Criteria

This list was compiled based on:

1. **CSS Custom Properties**: All systems provide at least some tokens as CSS custom properties (`--token-name` syntax)
2. **Open Source**: Publicly available with permissive licenses
3. **Production Use**: Powers real applications at scale for the listed company
4. **Documentation**: Well-documented token taxonomy and usage guidelines
5. **Completeness**: Comprehensive coverage of design decisions (color, typography, spacing, etc.)
6. **Active Maintenance**: Regular updates and community support

---

*Document compiled January 2026*
