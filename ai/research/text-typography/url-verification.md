# Text / Typography Component - URL Verification

> Created: 2025-11-06
> Component: Text / Typography

## Summary

This file tracks URLs for researching Text/Typography components across UI frameworks. Typography components are fundamental presentational elements for displaying text content with consistent styling, sizing, and semantic structure.

### Framework Coverage
- **Total Frameworks Checked**: 12
- **With Typography Components**: 8
- **Without Typography Components**: 4 (use utility classes instead)

### Status Counts
- ✅ **Working**: 8
- ❌ **No Component**: 4
- 🔄 **Pending Research**: 8

## URLs to Research

| Framework | Component Name | URL | Status | Notes |
|-----------|----------------|-----|--------|-------|
| Ant Design | Typography | https://4x.ant.design/components/typography | ✅ Working | Has Title, Text, Paragraph, Link sub-components |
| Chakra UI | Text | https://chakra-ui.com/docs/components/text | ✅ Working | Also has separate Heading, Blockquote, etc. |
| Headless UI | - | N/A | ❌ No Component | Headless library, no typography component |
| HeroUI (NextUI) | - | N/A | ❌ No Component | Removed in v2+, uses Tailwind classes |
| Mantine | Text | https://mantine.dev/core/text | ✅ Working | Also has Title, Highlight, Mark, etc. |
| Material UI (MUI) | Typography | https://mui.com/material-ui/react-typography | ✅ Working | Comprehensive typography system |
| Nuxt UI | Typography | https://ui.nuxt.com/docs/typography | ✅ Working | Prose components via @nuxtjs/mdc |
| PrimeReact | - | N/A | ❌ No Component | Uses PrimeFlex utilities for text styling |
| Radix UI Primitives | - | N/A | ❌ No Component | Primitives focus on behavior, not presentation |
| Radix UI Themes | Text | https://www.radix-ui.com/themes/docs/components/text | ✅ Working | Foundational text primitive |
| ShadCN | Typography | https://ui.shadcn.com/docs/components/typography | ✅ Working | Utility-based typography styles |
| Vuetify | Typography | https://vuetifyjs.com/en/styles/text-and-typography/ | ✅ Working | Text and typography utility classes |

## Research Status

### Components to Research (8)
1. 🔄 Ant Design Typography
2. 🔄 Chakra UI Text
3. 🔄 Mantine Text
4. 🔄 Material UI Typography
5. 🔄 Nuxt UI Typography
6. 🔄 Radix UI Themes Text
7. 🔄 ShadCN Typography
8. 🔄 Vuetify Typography

### Frameworks Without Typography Components (4)
- **Headless UI**: Headless/unstyled library focused on interactive components, not presentational
- **HeroUI/NextUI**: Removed Text component in v2, users apply Tailwind CSS classes directly
- **PrimeReact**: No dedicated component, uses PrimeFlex utility classes for styling
- **Radix UI Primitives**: Primitives provide behavior only, Radix Themes has the Text component

## Key Observations

### Component Naming Patterns
- **"Typography"** (4): Ant Design, MUI, ShadCN, Nuxt UI, Vuetify
- **"Text"** (4): Chakra UI, Mantine, Radix UI Themes

### Common Features Across Frameworks
- Multiple size variants (typically 5-9 size options)
- Font weight control (light, regular, medium, bold)
- Text color/variants (primary, secondary, success, warning, danger)
- Alignment options (left, center, right)
- Truncation/ellipsis support
- Polymorphic rendering (render as different HTML elements)

### Sub-components and Variants
Many frameworks provide separate related components:
- **Heading/Title** - For h1-h6 semantic headings
- **Paragraph** - For block-level text
- **Text/Span** - For inline text
- **Link** - For hyperlinks
- **Code** - For inline code
- **Blockquote** - For quoted text
- **Mark/Highlight** - For highlighted text
- **Strong/Bold/Em/Italic** - For emphasis

### Utility-First Approach Trend
4 of 12 frameworks (33%) don't provide dedicated typography components:
- Modern frameworks increasingly rely on utility class systems (Tailwind CSS, PrimeFlex)
- Components seen as unnecessary abstraction over native HTML + utility classes
- Reduces bundle size and API surface

## Research Plan

For each framework with a typography component:
1. Document core purpose and mental model
2. Identify all typography variants (Title, Text, Paragraph, etc.)
3. Map out size system and how sizes relate to HTML semantics
4. Document styling patterns (weight, color, alignment, truncation)
5. Note polymorphic rendering capabilities
6. Identify responsive typography features
7. Document accessibility features (semantic HTML, ARIA)
8. Capture integration with theming/design tokens
9. Note any unique or innovative features

## Next Steps

1. ✅ URL verification complete
2. 🔄 Create directory structure for each framework
3. 🔄 Launch parallel research agents
4. 🔄 Generate individual usage-patterns.md reports
5. 🔄 Synthesize aggregate pattern-research.md
6. 🔄 Mark Text/Typography complete in next.md
