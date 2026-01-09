# Mantine - Space Usage Patterns

## Component URL
https://mantine.dev/core/space/
Status: ✅ Working (Client-side rendered - React/Next.js application)
Version: 8.3.6 (as of documentation header)
Last Verified: 2025-11-05

## Documentation Quality
**Limited Access Note:** The Mantine documentation is a client-side rendered React application that requires JavaScript execution to display component details. The page successfully loads but requires browser rendering to access full documentation content including props tables, code examples, and interactive demos.

**From Available Metadata:**
- Page title: "Space | Mantine"
- Description: "Add horizontal or vertical spacing from theme"
- Documentation framework: Next.js-based documentation site
- Version display: v8.3.6 shown in navigation
- Navigation category: Listed under "Layout" components

## Component Definition

### Core Purpose
Based on the meta description and component name:
- **Primary Function:** Add horizontal or vertical spacing from theme
- **Component Category:** Layout utility component
- **Problem Solved:** Provides consistent spacing using theme-defined values rather than arbitrary CSS margins

### Mental Model
Space appears to be a spacing utility component that:
- Acts as a layout primitive for controlling spacing
- Integrates with Mantine's theme spacing scale
- Likely supports both horizontal and vertical orientations
- Provides a declarative API for spacing management

### Semantic Meaning
The Space component communicates:
- **Intentional spacing:** Deliberate spacing decisions rather than arbitrary margins
- **Theme consistency:** Spacing values derived from design system
- **Layout control:** Structural spacing within layouts

## Pattern Support Levels

### Definitions
- **Native**: Built-in props/features directly supported by the component API
- **Composed**: Achieved through composition with other Mantine components
- **CSS-only**: Accomplished through style props, className, or CSS custom properties

## Core Patterns

**Note:** Due to the client-rendered nature of the documentation, detailed prop tables and pattern analysis require browser-based access. The following represents expected patterns based on:
1. Component name and description
2. Mantine's consistent design system approach
3. Common spacing component patterns in modern UI libraries
4. Component category (Layout components)

### Spacing Control Patterns

| Pattern | Expected | Support Type | Details |
|---------|----------|--------------|---------|
| Theme spacing values | Likely ✅ | Native | Integration with Mantine theme spacing scale (xs, sm, md, lg, xl) |
| Custom spacing values | Likely ✅ | Native | CSS values (rem, px, etc.) |
| Horizontal spacing | Likely ✅ | Native | Left/right or inline-axis spacing |
| Vertical spacing | Likely ✅ | Native | Top/bottom or block-axis spacing |
| Responsive spacing | Likely ✅ | Native | Different spacing per breakpoint |

### Direction/Orientation

| Pattern | Expected | Support Type | Details |
|---------|----------|--------------|---------|
| Horizontal (h) | Likely ✅ | Native | Horizontal spacing via prop |
| Vertical (w) | Likely ✅ | Native | Vertical spacing via prop |
| Responsive direction | Possible ✅ | Native/CSS-only | May support responsive orientation changes |

### Common Layout Patterns

| Pattern | Expected | Support Type | Details |
|---------|----------|--------------|---------|
| Between elements spacing | Likely ✅ | Usage Pattern | Primary use case for spacing between layout elements |
| Visual separator | Possible ✅ | Native/Composed | May render as visual space or invisible spacing |
| Flexbox/Grid integration | Likely ✅ | Composed | Works within Flex, Grid, Group, Stack components |

## Code Examples

**Note:** Code examples require JavaScript execution to access from the documentation. Based on typical Mantine patterns and component purpose:

### Expected Usage Pattern

```tsx
// Likely basic usage pattern
import { Space } from '@mantine/core';

function Demo() {
  return (
    <>
      <div>First element</div>
      <Space h="md" />
      <div>Second element</div>
    </>
  );
}
```

### Expected Horizontal Spacing

```tsx
// Likely horizontal spacing
<>
  <span>Text</span>
  <Space w="xs" />
  <span>More text</span>
</>
```

### Expected Theme Integration

```tsx
// Likely theme-based spacing
<Space h="xs" />   // Extra small
<Space h="sm" />   // Small
<Space h="md" />   // Medium (likely default)
<Space h="lg" />   // Large
<Space h="xl" />   // Extra large
```

### Expected Custom Values

```tsx
// Likely custom spacing values
<Space h="2rem" />
<Space h={32} />
<Space h="var(--mantine-spacing-md)" />
```

### Expected Responsive Spacing

```tsx
// Possible responsive API (following Mantine patterns)
<Space h={{ base: 'sm', md: 'lg' }} />
```

## Styling Approaches

**Expected Patterns Based on Mantine v8 Architecture:**

### Inline Styles
- Likely converts props to inline styles
- Direct spacing value application

### CSS Custom Properties
Based on visible CSS variables in page source:
```css
--mantine-spacing-xs
--mantine-spacing-sm
--mantine-spacing-md
--mantine-spacing-lg
--mantine-spacing-xl
```

### Style Props
- Likely supports Mantine's standard `style` prop
- May support `className` for additional customization

### Theme Integration
- Theme values accessible via MantineProvider
- Consistent with other layout components (Flex, Grid, Stack, Group)

## Accessibility Patterns

### Expected Accessibility Features

| Feature | Expected | Details |
|---------|----------|---------|
| No ARIA required | ✅ | Spacing component should be purely visual/structural |
| Semantic HTML | Likely | May render as `<div>` or custom element |
| Screen reader impact | Neutral | Should not introduce unwanted pauses or announcements |
| Keyboard navigation | N/A | Non-interactive component |

**Best Practices:**
- Space components should not interfere with document flow for assistive technologies
- Should not create focusable elements
- Should not add semantic meaning that could confuse screen readers

## Notable Features

### Expected Mantine-Specific Features

1. **Theme Integration**
   - Direct access to Mantine theme spacing scale
   - Consistent with design system tokens

2. **Responsive Design**
   - Mantine v8's responsive object syntax likely supported
   - Breakpoint-aware spacing adjustments

3. **TypeScript Support**
   - Full TypeScript definitions expected
   - Type-safe prop interfaces

4. **Zero Runtime Complexity**
   - Likely compiles to simple CSS
   - Minimal JavaScript overhead

5. **Composition Friendly**
   - Works seamlessly with other Mantine layout components
   - No conflicts with Flex, Grid, Stack, Group

## Research Notes

### Documentation Access Limitations

This research was conducted with limited access to the full documentation due to:
- **Client-Side Rendering:** Mantine docs use Next.js with client-side data fetching
- **JavaScript Required:** Full component API details require JavaScript execution
- **Interactive Demos:** Live code examples not accessible without browser rendering

### Information Sources

**Successfully Accessed:**
1. Page metadata (title, description)
2. Documentation version (8.3.6)
3. Component category (Layout)
4. Theme CSS variables structure
5. Documentation navigation structure

**Not Accessible:**
1. Complete props table
2. Interactive code examples
3. Variant demonstrations
4. API reference details
5. Migration guides or version notes

### Confidence Levels

**High Confidence:**
- Component category: Layout utility
- Core purpose: Theme-based spacing
- Horizontal/vertical orientation support
- Theme integration via CSS custom properties
- Mantine v8 architecture patterns

**Medium Confidence:**
- Specific prop names (h/w assumed based on common patterns)
- Exact spacing scale values
- Responsive API structure
- Custom value support

**Low Confidence:**
- Visual rendering behavior
- Edge case handling
- Performance characteristics
- Breaking changes from previous versions

### Recommended Follow-Up Research

To complete this research, recommend:

1. **Browser-Based Access:**
   - Open URL in browser with JavaScript enabled
   - Document full props table
   - Capture code examples from interactive demos

2. **Source Code Review:**
   - Check Mantine GitHub repository
   - Review Space component source
   - Examine TypeScript definitions

3. **Package Documentation:**
   - Install @mantine/core package
   - Review TypeScript type definitions
   - Check inline documentation

4. **Community Resources:**
   - Discord server discussions
   - GitHub issues related to Space component
   - Migration guides for v7→v8

### Comparison Context

**Similar Components in Other Frameworks:**
- **Chakra UI:** Spacer component
- **Ant Design:** Space component (same name)
- **Material-UI:** Box with spacing props (no dedicated Space component)
- **Mantine Context:** Part of layout primitives alongside Stack, Group, Flex, Grid

**Likely Differentiators:**
- Strong theme integration (Mantine's strength)
- Consistent API with other Mantine components
- Responsive object syntax (Mantine v8 feature)
- CSS variable-based implementation

### Technical Observations

**From Page Source:**
1. Documentation built with Next.js (static site generation + client hydration)
2. Mantine v8.3.6 confirmed in header
3. CSS custom properties used extensively for theming
4. Color scheme switching supported (light/dark modes)
5. Responsive breakpoint system: xs (36em), sm (48em), md (62em), lg (75em), xl (88em)

**Theming Architecture:**
```css
/* Observed CSS custom property patterns */
:root {
  --mantine-spacing-xs: [value];
  --mantine-spacing-sm: [value];
  --mantine-spacing-md: [value];
  --mantine-spacing-lg: [value];
  --mantine-spacing-xl: [value];
  --mantine-scale: 1; /* Global scaling factor */
}
```

## Research Metadata

- **Research Date:** 2025-11-05
- **Mantine Version:** 8.3.6
- **Documentation URL:** https://mantine.dev/core/space/
- **Component Category:** Layout
- **Research Method:** Metadata extraction + pattern inference
- **Completion Status:** Partial - requires browser-based follow-up
- **Researcher Notes:** Client-side rendered documentation limits automated research. Recommend manual browser-based documentation review for complete prop tables and code examples.

---

**Status:** This research document represents a best-effort analysis based on available metadata and Mantine's established patterns. For production use, verify all assumptions against the live documentation or source code.
