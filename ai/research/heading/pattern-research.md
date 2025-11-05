# Component Pattern Research: Heading

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 2
- Date: 2025-11-05
- Unique patterns identified: 30+

## Component Definition Consensus

Heading components render semantic HTML heading elements (h1-h6) with consistent styling and visual hierarchy. Universal mental model: "Semantic heading with design system styling."

**Primary Purpose:** Establish visual hierarchy and document structure through semantic HTML heading elements, maintaining proper accessibility for screen readers and SEO while providing consistent, theme-integrated styling.

**Mental Model:** A styled wrapper around HTML heading tags that separates visual appearance from semantic meaning - the rendered HTML tag determines document structure (h1-h6), while styling props control visual presentation.

**Semantic meaning:** Communicates structural hierarchy in documents and content sections. Each heading level conveys different importance levels for navigation landmarks, with proper heading structure being critical for accessibility and SEO.

## Terminology Variations

- **Heading** (1 framework) = Chakra UI
- **Header** (1 framework) = Semantic UI Classic

Note: Despite terminology difference, both serve the same semantic HTML heading purpose.

## Pattern Inventory

### Semantic Level Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| h1 (page title) | Main page heading | 2/2 (100%) | **Level 1: Universal** | All | Native |
| h2 (section) | Section headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| h3 (subsection) | Subsection headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| h4 (minor section) | Sub-subsection headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| h5 (deep section) | Deep section headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| h6 (deepest) | Deepest heading level | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Size System Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Multiple size variants | 5+ size options | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Small sizes | Compact headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Medium sizes | Default/moderate sizing | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Large sizes | Prominent headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Extra large sizes | Hero/display headings | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Responsive sizing | Auto-adjust by breakpoint | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |

### Visual Separation Pattern

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size vs semantic separation | Visual size independent from HTML tag | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Fixed semantic sizing | Size tied to HTML tag | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | Native |

### Sizing Philosophy Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| rem-based sizing | Root em units, consistent | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |
| em-based sizing | Context-relative sizing | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |
| Design token sizing | Theme-integrated values | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Font Weight Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Font weight control | Customize boldness | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Normal weight | 400 weight | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Semibold/Bold | 600-700 weight | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Extra bold/Black | 800-900 weight | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |

### Alignment Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Left alignment | Default left align | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| Center alignment | Center text | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| Right alignment | Right-align text | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |

### Color/Theming Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Color variants | Semantic/brand colors | 2/2 (100%) | **Level 1: Universal** | All | Native/CSS-only |
| Theme integration | Design system colors | 2/2 (100%) | **Level 1: Universal** | All | Native |
| Custom colors | Arbitrary color values | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| Color palette (12+) | Wide color selection | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Icon integration | Icons with headings | 2/2 (100%) | **Level 1: Universal** | All | Composed |
| Sub-header support | Secondary text below | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | Composed |
| Image support | Images in headers | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | Composed |

### Layout Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Dividing variant | Border below header | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |
| Block variant | Background box styling | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |
| Attached variant | Attached to content | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |
| Floating variant | Float left/right | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Disabled state | Reduced opacity/interaction | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |
| Inverted state | Dark background variant | 1/2 (50%) | **Level 3: Frequent** | Semantic UI | CSS-only |

### Customization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Style props | Inline styling props | 2/2 (100%) | **Level 1: Universal** | All | Native |
| CSS classes | Custom class names | 2/2 (100%) | **Level 1: Universal** | All | CSS-only |
| Theme customization | Global theme overrides | 2/2 (100%) | **Level 1: Universal** | All | Native |

### Responsive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Auto-responsive sizes | Built-in breakpoint scaling | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Responsive props | Array/object syntax | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |
| Mobile-first design | Small-to-large scaling | 1/2 (50%) | **Level 3: Frequent** | Chakra UI | Native |

## Notable Patterns

### Universal (100%)
- All six semantic heading levels (h1-h6)
- Multiple size variants (5+)
- Small, medium, large size options
- Extra large display sizes
- Design token integration
- Color theming support
- Left, center, right alignment
- Icon integration
- Style props and CSS classes
- Theme customization

### Chakra UI Specializations
- 11 size variants (sm through 7xl)
- Automatic responsive sizing on larger variants
- Visual size separate from semantic level
- Font weight control (6 variants)
- Style props inheritance from Box
- v2/v3 cross-compatible
- Design token system integration
- Responsive prop syntax (array/object)
- TypeScript type safety
- Zero configuration defaults
- Color palette prop (v3)
- Mobile-first responsive design

### Semantic UI Classic Specializations
- Dual sizing philosophy:
  - Page headers (h1-h5): rem-based, fixed hierarchy
  - Content headers (Huge-Tiny): em-based, context-relative
- 12 color variants (red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey)
- Icon Headers variant
- Sub Headers composition
- Image integration
- 4 layout variations (dividing, block, attached, floating)
- Disabled state
- Inverted state (dark backgrounds)
- Pure CSS implementation
- jQuery-based framework
- No JavaScript initialization required
- Context-aware em scaling

## Implementation Notes

### Installation

**Chakra UI:**
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

**Semantic UI:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css">
```

### Basic Usage Comparison

**Chakra UI:**
```jsx
import { Heading } from '@chakra-ui/react'

<Heading as="h1" size="2xl">
  Welcome to My Site
</Heading>
```

**Semantic UI:**
```html
<h1 class="ui header">
  Welcome to My Site
</h1>
```

## Design Philosophy Differences

### Component-Based (Chakra UI)
- **Philosophy**: React component with props API
- **Approach**: JavaScript/TypeScript configuration
- **Styling**: CSS-in-JS with style props
- **Separation**: Visual size independent of semantic tag
- **Flexibility**: Full programmatic control
- **Audience**: Modern React applications
- **Responsive**: Built-in responsive prop syntax

### Class-Based (Semantic UI)
- **Philosophy**: Pure CSS with HTML classes
- **Approach**: Class names control appearance
- **Styling**: Predefined CSS classes
- **Sizing Systems**: Dual (rem page headers, em content headers)
- **Flexibility**: Limited to predefined classes
- **Audience**: Traditional web development, jQuery apps
- **Responsive**: CSS media queries in framework

## Use Case Consensus

Both frameworks emphasize these heading use cases:
1. **Page titles** - Main h1 page headings
2. **Section headers** - Content section organization
3. **Card titles** - Heading cards and panels
4. **Modal headers** - Dialog and modal titles
5. **Dashboard sections** - Admin panel organization
6. **Article headers** - Blog post and content titles
7. **Form sections** - Multi-step form organization

## Raw Data

- [Chakra UI](./chakra-ui/usage-patterns.md)
- [Semantic UI Classic](./semantic-ui-classic/usage-patterns.md)
