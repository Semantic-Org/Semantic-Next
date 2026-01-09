# Mantine - AspectRatio Usage Patterns

## Component URL
https://mantine.dev/core/aspect-ratio/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear purpose, practical examples covering multiple use cases, and implementation notes for edge cases (flex containers)

## Component Definition
- **Core purpose**: Maintain responsive consistent width/height ratio for media elements (images, videos, maps, iframes) across responsive designs
- **Mental model**: A container that enforces a fixed aspect ratio on its children, automatically scaling proportionally regardless of parent container size
- **Semantic meaning**: Aspect ratio preservation wrapper - communicates that the content inside maintains a specific width-to-height proportion

## Pattern Support Levels
- **Native**: Ratio control via dedicated prop
- **Composed**: Content provided via children composition
- **CSS-only**: Styling customization through Mantine's style props system

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image content | ✅ | Composed | Child `<img>` elements maintain aspect ratio |
| Video embeds | ✅ | Composed | YouTube/Vimeo iframes in 16:9 typical pattern |
| Map embeds | ✅ | Composed | Google Maps iframes demonstrated |
| Custom content | ✅ | Composed | Any child element constrained to ratio |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single container | ✅ | Native | Component is a single aspect ratio container |
| Multiple ratios | ❌ | CSS-only | Would require multiple instances |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | CSS-only | Not built-in, would require custom implementation |
| Error states | ❌ | CSS-only | Not built-in, would require custom implementation |
| Responsive ratios | ❌ | CSS-only | Single ratio value, no breakpoint-specific ratios |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Ratio control | ✅ | Native | `ratio` prop accepts numeric value (e.g., `16/9`, `1080/720`) |
| Size constraints | ✅ | Native | `maw` (max-width), standard Mantine sizing props |
| Margin control | ✅ | Native | `mx`, `my` and other Mantine spacing props |
| Flex properties | ✅ | Native | `flex` prop for flex container contexts |
| Width control | ✅ | Native | Standard width/w prop support |

## Props/API Documentation

### Core Props
```typescript
interface AspectRatioProps {
  ratio: number;           // Width/height ratio (e.g., 16/9, 1080/720)
  maw?: string | number;   // Maximum width
  mx?: string | number;    // Horizontal margin
  flex?: string;           // Flex property for flex containers
  // + All Mantine style system props
}
```

### Mantine Style System Integration
The component inherits Mantine's complete style props system including:
- Layout props: `w`, `h`, `maw`, `mah`, `miw`, `mih`
- Spacing props: `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`, `p`, `px`, `py`, etc.
- Display props: `display`, `opacity`, `pos` (position)
- Other standard Mantine style utilities

## Code Examples

### Basic Image with Aspect Ratio
```jsx
import { AspectRatio } from '@mantine/core';

function Demo() {
  return (
    <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
      <img
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
        alt="Panda"
      />
    </AspectRatio>
  );
}
```
[View Live](https://mantine.dev/core/aspect-ratio/)

### Embedded Google Map (16:9)
```jsx
<AspectRatio ratio={16 / 9}>
  <iframe
    src="https://www.google.com/maps/embed?pb=..."
    title="Google map"
    style={{ border: 0 }}
  />
</AspectRatio>
```

### YouTube Video Embed
```jsx
<AspectRatio ratio={16 / 9}>
  <iframe
    src="https://www.youtube.com/embed/mzJ4vCjSt28"
    title="YouTube video player"
    style={{ border: 0 }}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</AspectRatio>
```

### Inside Flex Container
```jsx
<div style={{ display: 'flex' }}>
  <AspectRatio ratio={1} flex="0 0 100px">
    <Image src="..." alt="Avatar" />
  </AspectRatio>
</div>
```

## Composition Patterns

### Children Composition
The component uses a simple children composition pattern:
```jsx
<AspectRatio ratio={desired_ratio}>
  {/* Any content */}
</AspectRatio>
```

Children are automatically sized to fill the constrained aspect ratio container.

### Integration with Mantine Components
Works seamlessly with other Mantine components:
```jsx
<AspectRatio ratio={1}>
  <Image src="..." alt="..." />  {/* Mantine Image component */}
</AspectRatio>
```

## Styling Approaches

### Mantine Style Props
Primary styling through Mantine's style props system:
```jsx
<AspectRatio
  ratio={16/9}
  maw={600}
  mx="auto"
  mt="md"
/>
```

### Inline Styles on Children
Direct styling of child elements:
```jsx
<AspectRatio ratio={16/9}>
  <iframe style={{ border: 0 }} />
</AspectRatio>
```

### CSS-in-JS (Emotion/CSS Modules)
Can be styled via Mantine's styling solutions:
- Emotion-based CSS-in-JS
- CSS Modules
- Tailwind CSS integration

## Accessibility Patterns

### Semantic Child Elements
Relies on child elements having proper accessibility:
```jsx
<AspectRatio ratio={16/9}>
  <img src="..." alt="Descriptive text" />  {/* Alt text on image */}
</AspectRatio>
```

### ARIA Support for Embeds
Demonstrated with iframe titles:
```jsx
<AspectRatio ratio={16/9}>
  <iframe
    title="Google map"  {/* Accessible title */}
    src="..."
  />
</AspectRatio>
```

### No Built-in ARIA
The container itself doesn't add ARIA attributes - it's a layout wrapper that relies on child element semantics.

## Notable Features

### Flexible Ratio Expression
Accepts ratio as a division expression, making it intuitive:
```jsx
ratio={16 / 9}     // Standard video
ratio={4 / 3}      // Classic monitor
ratio={1080 / 720} // From pixel dimensions
ratio={1}          // Perfect square
```

### Flex Container Awareness
Explicitly documented behavior in flex contexts:
- Default: Takes available space in regular containers
- Flex contexts: Requires explicit `width` or `flex` property
```jsx
flex="0 0 100px"  // Specific flex sizing
```

### Maximum Width Constraint
Built-in max-width control for responsive centering:
```jsx
<AspectRatio ratio={16/9} maw={800} mx="auto">
```

### Integration with Mantine Ecosystem
Full integration with:
- Mantine style props system
- Mantine Image component
- Mantine's responsive utilities
- Theme-based spacing values

### Minimal API Surface
Simple, focused API - single required prop (`ratio`) with composition for flexibility.

### TypeScript Support
Full TypeScript support as part of `@mantine/core` package.

## Implementation Details

### CSS-based Approach
Likely uses CSS aspect-ratio property or padding-top percentage technique internally to maintain ratios without JavaScript calculations.

### Zero-Config Children
Children automatically fill the aspect ratio container without requiring additional configuration.

### Responsive by Nature
Aspect ratio is maintained across all viewport sizes - the container scales proportionally.

## Research Notes
- Documentation is clear and focused on practical use cases
- Strong emphasis on media embedding (videos, maps)
- Explicitly addresses flex container edge case
- Version 8.3.6 is current at time of research
- Part of Mantine's core component library
- No complex variant system - intentionally simple and focused
- Relies on composition rather than props for content flexibility
- Documentation includes live interactive examples
- Source code available on GitHub for reference
