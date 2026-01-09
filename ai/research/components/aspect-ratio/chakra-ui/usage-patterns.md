# Chakra UI - Aspect Ratio Usage Patterns

## Component URL
**v2 (detailed)**: https://v2.chakra-ui.com/docs/components/aspect-ratio
**v3 (current)**: https://www.chakra-ui.com/docs/components/aspect-ratio
Status: ✅ Working (both versions)
Version: v2.10.9 (v2), v3 (current)
Last Verified: 2025-11-05

## Documentation Quality
**v2**: Good - Includes clear examples, prop documentation, and common use cases
**v3**: Basic - Shows preset tokens and general purpose, but less detailed than v2

## Component Definition
- **Core purpose**: A layout utility component that maintains consistent width-to-height proportions for embedded responsive content (videos, maps, images) across different screen sizes.
- **Mental model**: A container that enforces a specific aspect ratio regardless of viewport size, preventing layout shift and distortion of embedded media.
- **Semantic meaning**: Communicates that the wrapped content should maintain a specific proportional relationship between width and height, typically for responsive media embedding.

## Pattern Support Levels
- **Native**: Dedicated `ratio` prop for numeric aspect ratio values (e.g., `ratio={16/9}`)
- **Composed**: Content wrapped as children (e.g., `<AspectRatio>{content}</AspectRatio>`)
- **CSS-only**: Additional styling via standard Chakra style props

## Installation
```js
import { AspectRatio } from '@chakra-ui/react'
```

Package: `@chakra-ui/layout` (v2)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Video/iframe content | ✅ | Composed | Primary use case - wraps iframe elements for video embeds |
| Image content | ✅ | Composed | Wraps Image components with `objectFit='cover'` for proper scaling |
| Map embeds | ✅ | Composed | Supports Google Maps and other map service iframes |
| Custom content | ✅ | Composed | Can wrap any child content that needs aspect ratio enforcement |

## Type Patterns
Not applicable - this is a layout utility component without distinct type variants.

## State Patterns
Not documented - component appears to be stateless.

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom ratio values | ✅ | Native | `ratio` prop accepts any numeric value (e.g., `21/9`, `16/9`, `4/3`, `1.85/1`) |
| Preset ratio tokens | ✅ | Native (v3) | Named tokens: square (1/1), landscape (4/3), portrait (3/4), wide (16/9), ultrawide (18/5), golden (1.618/1) |
| Responsive ratios | ✅ | Native | `ratio` prop accepts `ResponsiveValue<number>` for breakpoint-specific ratios |
| Width control | ✅ | Native | `maxW` or `maxWidth` prop to constrain container width while maintaining ratio |
| Full-width mode | ✅ | Composed | Omit `maxWidth` prop for full-width responsive containers |

## Props/API Documentation

### AspectRatio Props (v2)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratio` | `ResponsiveValue<number>` | - | The aspect ratio of the container. Common values: `21/9`, `16/9`, `9/16`, `4/3`, `1.85/1` |

Additional props: Supports all Chakra Box component props for styling (maxW, maxWidth, etc.)

### Preset Ratio Tokens (v3)

| Token | Value | Description |
|-------|-------|-------------|
| `square` | 1/1 | Perfect square aspect ratio |
| `landscape` | 4/3 | Traditional landscape photo/screen ratio |
| `portrait` | 3/4 | Portrait orientation ratio |
| `wide` | 16/9 | Widescreen video standard |
| `ultrawide` | 18/5 | Ultra-widescreen cinema ratio (3.6:1) |
| `golden` | 1.618/1 | Golden ratio for aesthetic balance |

## Code Examples

### Video Embedding
```jsx
<AspectRatio maxW='560px' ratio={1}>
  <iframe
    title='naruto'
    src='https://www.youtube.com/embed/QhBnZ6NPOY0'
    allowFullScreen
  />
</AspectRatio>
```

### Image Display with 4:3 Ratio
```jsx
<AspectRatio maxW='400px' ratio={4 / 3}>
  <Image src='https://bit.ly/naruto-sage' alt='naruto' objectFit='cover' />
</AspectRatio>
```

### Responsive Map Embedding (Full Width)
```jsx
<AspectRatio ratio={16 / 9}>
  <iframe src='https://www.google.com/maps/embed?pb=...' />
</AspectRatio>
```

### Using Preset Tokens (v3)
```jsx
// Example usage with preset tokens
<AspectRatio ratio="wide">
  {/* 16:9 content */}
</AspectRatio>

<AspectRatio ratio="golden">
  {/* 1.618:1 content */}
</AspectRatio>
```

## Composition Patterns

### With Chakra Image Component
The component commonly composes with Chakra's Image component, using `objectFit='cover'` to ensure proper scaling within the aspect ratio bounds.

### With iframes
Primary composition pattern involves wrapping iframe elements for external embedded content (videos, maps).

### Width Constraints
Uses `maxW` or `maxWidth` props to constrain the maximum width while the aspect ratio controls the height proportionally.

## Styling Approaches

### Style Props
Accepts all standard Chakra Box component style props for additional customization.

### Responsive Values
The `ratio` prop supports responsive values for different breakpoints:
```jsx
// TypeScript type signature
ratio: ResponsiveValue<number>
```

### Theming Integration
- Part of Chakra UI's theming system (v3)
- Supports light and dark modes through CSS custom properties
- Preset ratio tokens are part of the design token system

## Accessibility Patterns

No specific accessibility features are documented. The component appears to be a layout utility that:
- Preserves the accessibility of its children
- Does not add semantic markup or ARIA attributes
- Relies on child elements (iframe, img) to provide their own accessibility features

Best practice would be to ensure:
- iframe elements have `title` attributes (as shown in examples)
- Image elements have `alt` attributes (as shown in examples)

## Notable Features

### CSS-Based Implementation
The component uses CSS-based aspect ratio management, suggesting it likely leverages the native CSS `aspect-ratio` property or padding-based aspect ratio techniques.

### Responsive by Default
The component is designed from the ground up for responsive behavior, maintaining proportions across all viewport sizes.

### TypeScript Support
Props are fully typed with TypeScript, including `ResponsiveValue<number>` for breakpoint-aware aspect ratios.

### Preset Ratio System (v3)
Version 3 introduces a named token system with six common aspect ratios, providing a more semantic API option alongside numeric values.

### Framework Integration
Located in the `@chakra-ui/layout` package, integrating with Chakra's broader layout component ecosystem (Box, Flex, Grid, Stack, Container).

## Research Notes

### Version Differences
- **v2**: More detailed documentation with explicit code examples and prop tables
- **v3**: Less detailed docs, introduces preset ratio token system, focuses on design tokens

### Documentation Access
- v2 documentation at `v2.chakra-ui.com` is more comprehensive for implementation details
- v3 documentation at `www.chakra-ui.com` is newer but currently less detailed

### Use Case Focus
The documentation emphasizes three primary use cases:
1. Video embedding (YouTube, Vimeo)
2. Image galleries with consistent proportions
3. Map service integration (Google Maps)

### Implementation Philosophy
The component follows Chakra's composition-first approach - it provides aspect ratio enforcement while delegating content rendering to child components. This keeps the API simple while maintaining flexibility.

### Common Aspect Ratios Referenced
- **21/9**: Ultra-widescreen cinema
- **16/9**: Standard widescreen (HD video, modern displays)
- **9/16**: Vertical video (mobile, stories)
- **4/3**: Traditional displays and photos
- **1.85/1**: Cinema widescreen
- **1/1**: Square (social media)
- **1.618/1**: Golden ratio (aesthetic balance)
