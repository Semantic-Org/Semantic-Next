# Chakra UI - Text Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://chakra-ui.com/docs/components/text
Status: ✅ Working
Version: v3.29.0
Last Verified: 2025-11-06

## Documentation Quality
Good - Clear documentation focusing on the foundational nature of the Text component with emphasis on Chakra's style props system. Documentation is concise and assumes familiarity with Chakra's design system.

## Component Definition
- **Core purpose**: Render text and paragraphs within an interface as a foundational typography element
- **Mental model**: A styled paragraph element (renders `p` by default) that accepts Chakra's comprehensive style props system for flexible text styling
- **Semantic meaning**: Communicates textual content with flexible visual presentation through style props while maintaining semantic HTML structure

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Style Props**: Via Chakra's style props system
- **Composed**: Via composition/children
- **Not Supported**: Pattern not available

## Related Typography Components
| Component | URL | Purpose |
|-----------|-----|---------|
| Text | https://chakra-ui.com/docs/components/text | Render text and paragraphs |
| Heading | https://chakra-ui.com/docs/components/heading | Hierarchical headings (h1-h6) |
| Blockquote | https://chakra-ui.com/docs/components/blockquote | Quoted content blocks |
| Code | https://chakra-ui.com/docs/components/code | Inline code display |
| Em | https://chakra-ui.com/docs/components/em | Emphasized text (italic) |
| Kbd | https://chakra-ui.com/docs/components/kbd | Keyboard key notation |
| Link | https://chakra-ui.com/docs/components/link | Hyperlinks |
| List | https://chakra-ui.com/docs/components/list | Ordered and unordered lists |
| Mark | https://chakra-ui.com/docs/components/mark | Highlighted text |
| Prose | https://chakra-ui.com/docs/components/prose | Rich formatted text blocks |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Style Props | `fontSize` prop: 2xs (0.625rem) through 9xl (8rem) |
| Font weight | ✅ | Style Props | `fontWeight` prop: thin, light, normal, medium, semibold, bold, extrabold, black |
| Text color | ✅ | Style Props | `color` prop: theme colors, semantic colors, or custom values |
| Text alignment | ✅ | Style Props | `textAlign` prop: left, center, right, justify |
| Text decoration | ✅ | Style Props | `textDecoration` prop: underline, line-through, none |
| Text transform | ✅ | Style Props | `textTransform` prop: uppercase, lowercase, capitalize, none |
| Line height | ✅ | Style Props | `lineHeight` prop: numeric values or theme tokens |
| Letter spacing | ✅ | Style Props | `letterSpacing` prop: numeric values or theme tokens |
| Truncation | ✅ | Style Props | `noOfLines` prop for single or multi-line truncation |
| Line clamping | ✅ | Style Props | `noOfLines` prop: numeric value for multi-line clamping |
| Gradient text | ❌ | Not Supported | Not available as built-in feature (may be possible via style props) |

## Semantic & Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Semantic HTML | ✅ | Native | Renders as `p` element by default |
| Polymorphic rendering | ✅ | Native | `as` prop to render as different elements (span, div, label, etc.) |
| ARIA attributes | ✅ | Style Props | All ARIA attributes available via props |

## Theming Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Design tokens | ✅ | Native | Full integration with Chakra theme tokens |
| Style props | ✅ | Native | Complete Chakra style props system (spacing, color, layout, typography) |
| Variant system | ⚠️ | Partial | No predefined variants; styling via props |
| Responsive values | ✅ | Native | Array/object syntax for breakpoint-based responsive styling |

## Code Examples

### Basic Text
```tsx
import { Text } from '@chakra-ui/react';

<Text>This is the Text component</Text>
```

### Text Sizes
```tsx
import { Text } from '@chakra-ui/react';

<Text fontSize="2xs">Extra extra small text</Text>
<Text fontSize="xs">Extra small text</Text>
<Text fontSize="sm">Small text</Text>
<Text fontSize="md">Medium text (default)</Text>
<Text fontSize="lg">Large text</Text>
<Text fontSize="xl">Extra large text</Text>
<Text fontSize="2xl">2xl text</Text>
<Text fontSize="3xl">3xl text</Text>
<Text fontSize="4xl">4xl text</Text>
<Text fontSize="5xl">5xl text</Text>
<Text fontSize="6xl">6xl text</Text>
<Text fontSize="7xl">7xl text</Text>
<Text fontSize="8xl">8xl text</Text>
<Text fontSize="9xl">9xl text</Text>
```

### Text Colors and Weights
```tsx
import { Text } from '@chakra-ui/react';

// Colors
<Text color="blue.500">Blue text</Text>
<Text color="red.600">Red text</Text>
<Text color="green.400">Green text</Text>

// Weights
<Text fontWeight="thin">Thin text</Text>
<Text fontWeight="light">Light text</Text>
<Text fontWeight="normal">Normal text</Text>
<Text fontWeight="medium">Medium text</Text>
<Text fontWeight="semibold">Semibold text</Text>
<Text fontWeight="bold">Bold text</Text>
<Text fontWeight="extrabold">Extrabold text</Text>
<Text fontWeight="black">Black text</Text>
```

### Truncation
```tsx
import { Text } from '@chakra-ui/react';

// Single line truncation
<Text noOfLines={1} width="200px">
  This is a very long text that will be truncated with an ellipsis when it exceeds the container width
</Text>

// Multi-line truncation (line clamping)
<Text noOfLines={3} width="300px">
  This is a longer paragraph that will be clamped to exactly 3 lines.
  Any content beyond the third line will be hidden and replaced with an ellipsis.
  This is useful for previewing long content in cards or list items.
</Text>
```

### Responsive Typography
```tsx
import { Text } from '@chakra-ui/react';

// Array syntax (mobile-first)
<Text fontSize={['sm', 'md', 'lg', 'xl']}>
  Responsive text size
</Text>

// Object syntax (specific breakpoints)
<Text
  fontSize={{
    base: 'sm',    // 0-480px
    sm: 'md',      // 480px-768px
    md: 'lg',      // 768px-1024px
    lg: 'xl',      // 1024px-1280px
    xl: '2xl'      // 1280px+
  }}
>
  Responsive text size with object syntax
</Text>

// Multiple responsive props
<Text
  fontSize={['md', 'lg', 'xl']}
  textAlign={['left', 'center', 'right']}
  color={['gray.600', 'gray.700', 'gray.800']}
>
  Multiple responsive properties
</Text>
```

### Polymorphic Rendering
```tsx
import { Text } from '@chakra-ui/react';

// Render as span
<Text as="span">This renders as a span element</Text>

// Render as div
<Text as="div">This renders as a div element</Text>

// Render as label
<Text as="label" htmlFor="input-id">This renders as a label</Text>
```

### Text Decoration and Transform
```tsx
import { Text } from '@chakra-ui/react';

// Decoration
<Text textDecoration="underline">Underlined text</Text>
<Text textDecoration="line-through">Strikethrough text</Text>

// Transform
<Text textTransform="uppercase">uppercase text</Text>
<Text textTransform="lowercase">LOWERCASE TEXT</Text>
<Text textTransform="capitalize">capitalize each word</Text>
```

### Combined Style Props
```tsx
import { Text } from '@chakra-ui/react';

<Text
  fontSize="lg"
  fontWeight="bold"
  color="blue.600"
  textAlign="center"
  lineHeight="tall"
  letterSpacing="wide"
  mt={4}
  mb={2}
  px={4}
>
  Text with multiple style props
</Text>
```

## Notable Features

### Comprehensive Style Props System
Chakra's Text component has access to the entire style props system, including:
- Typography props (fontSize, fontWeight, lineHeight, letterSpacing)
- Color props (color, background, borderColor)
- Spacing props (margin, padding with directional variants: mt, mr, mb, ml, mx, my, px, py)
- Layout props (display, width, height, position)
- Flexbox props (when parent is flex container)
- Border props (border, borderRadius, borderWidth)

This makes Text one of the most flexible text components across frameworks, as any CSS property can be applied via props.

### Responsive Design First-Class Support
Chakra provides two syntaxes for responsive values:
- **Array syntax**: Mobile-first approach `[base, sm, md, lg, xl]`
- **Object syntax**: Named breakpoints for more explicit control

Both syntaxes work with any style prop, enabling responsive typography without media queries.

### Breakpoint System
Chakra's built-in breakpoints:
- **base**: 0px (default)
- **sm**: 480px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Design Token Integration
The Text component deeply integrates with Chakra's theme system:
- Color tokens: `blue.500`, `gray.600`, etc.
- Font size tokens: `xs`, `sm`, `md`, `lg`, `xl`, `2xl` through `9xl`
- Spacing tokens: `0`, `1`, `2`, `4`, `8`, etc.
- Line height tokens: `normal`, `none`, `shorter`, `short`, `base`, `tall`, `taller`
- Letter spacing tokens: `tighter`, `tight`, `normal`, `wide`, `wider`, `widest`

### noOfLines for Truncation
The `noOfLines` prop is a Chakra-specific convenience that applies the appropriate CSS for:
- Single line: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`
- Multi-line: `-webkit-line-clamp` with `-webkit-box-orient: vertical`

This provides a simpler API than manually applying CSS properties.

### Polymorphic via `as` Prop
The `as` prop allows rendering as any HTML element or React component while preserving all styling capabilities. This is crucial for semantic HTML and accessibility while maintaining design consistency.

### No Variant System
Unlike some component libraries, Chakra's Text doesn't have predefined variants (like "body1", "body2"). Instead, developers compose their own text styles using the theme tokens and style props, providing maximum flexibility at the cost of needing to establish patterns in their codebase.

## Research Notes

- Chakra UI's approach to typography is fundamentally different from libraries like MUI or Ant Design - it provides a primitive styled component with comprehensive props rather than predefined variants
- The style props system is Chakra's defining feature, allowing CSS-like properties to be passed as props with theme token support
- Responsive typography is exceptionally well-supported with both array and object syntax for breakpoint-based styling
- The granular font size scale (2xs through 9xl) provides more options than most frameworks
- No built-in variant system means teams need to establish their own typography scale conventions
- The `noOfLines` prop is a convenient abstraction over complex CSS truncation patterns
- Polymorphic rendering via `as` prop maintains type safety in TypeScript
- Deep theme integration means Text inherits all design tokens defined in the theme
- The Text component is truly foundational - it's expected to be composed and styled rather than used with preset configurations
- Package: @chakra-ui/react
- Version: v3.29.0
- Built on Ark UI primitives in v3.x, providing a more solid foundation
- Chakra's philosophy emphasizes composition and flexibility over conventions
- The lack of predefined text variants (like Material Design's type scale) is intentional - Chakra provides tools, not prescriptions
- Spacing props (mt, mb, px, etc.) on Text itself eliminate need for wrapper elements in many cases
- The breakpoint system is mobile-first, aligning with modern web development practices
- All ARIA attributes are available as props, supporting accessibility needs
- The component renders as `p` by default, encouraging semantic HTML for text content
- Style props can accept theme tokens, raw CSS values, or responsive arrays/objects
- Chakra's theme system allows centralized typography definitions that all Text components inherit
- The extensive style props system means Text can sometimes replace Box for simple layouts
- Related typography components (Heading, Code, Kbd, Mark) follow the same style props pattern
