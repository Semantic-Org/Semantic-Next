# Chakra UI - Text & Heading Usage Patterns

> Last Modified: 2025-11-10

## Component URLs
- Text: https://chakra-ui.com/docs/components/text
- Heading: https://chakra-ui.com/docs/components/heading
- Status: ✅ Working
- Version: v3.29.0 (current), v2 also analyzed
- Last Verified: 2025-11-10

## Documentation Quality
Good - Clear component documentation with interactive examples. API documentation is concise. Style props are well-documented in a separate section. Some examples require navigating to the typography style props page for complete patterns.

## Component Definition
- **Core purpose**: Text renders text and paragraphs; Heading renders semantic HTML heading elements (h1-h6). Both are fundamental typography primitives that integrate with Chakra's design token system.
- **Mental model**: Polymorphic typography components that compose the Box component, inheriting all Box style props. Text is for body copy and inline text; Heading is for hierarchical page structure.
- **Semantic meaning**: Communicates textual content with proper HTML semantics. Heading provides document structure hierarchy. Both support theme integration and responsive design.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **Styled**: Via style props only
- **Not Supported**: Pattern not available

## Component Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text | ✅ | Native | Renders span/div for body text and paragraphs |
| Heading | ✅ | Native | Renders semantic h1-h6 elements |
| Polymorphic rendering | ✅ | Native | `as` prop allows rendering as different HTML elements |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Paragraph text | ✅ | Native | Text component primary use case |
| Headings | ✅ | Native | Heading component with h1-h6 via `as` prop |
| Inline text | ✅ | Native | Text component can be used inline |
| Code/keyboard | ✅ | Styled | Via `as='kbd'` or custom styling |
| Links | ⚠️ | Partial | Use separate Link component or `as='a'` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Display text | ✅ | Native | Heading with large sizes (xl, 2xl, 3xl, 4xl) |
| Body text | ✅ | Native | Text component with standard sizes |
| Caption/small | ✅ | Native | Text with xs, sm sizes |
| Label text | ✅ | Native | Text component for labels |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ❌ | Not Supported | No native disabled prop |
| Muted | ✅ | Styled | Via `color='fg.muted'` token or opacity |
| Error | ✅ | Styled | Via color prop with semantic tokens |
| Success | ✅ | Styled | Via color prop with semantic tokens |
| Warning | ✅ | Styled | Via color prop with semantic tokens |

## Variation Patterns

### Font Size
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | Heading: `size` prop (xs, sm, md, lg, xl, 2xl, 3xl, 4xl) |
| fontSize prop | ✅ | Native | Both: `fontSize` prop with tokens (2xs-9xl) or custom values |
| Responsive sizing | ✅ | Native | Both: Array/object syntax for breakpoints |

### Font Weight
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Font weight | ✅ | Native | `fontWeight` prop with tokens or values (thin-black, 100-900) |
| Semantic weights | ✅ | Native | thin, extralight, light, normal, medium, semibold, bold, extrabold, black |

### Color
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color prop | ✅ | Native | `color` prop with theme tokens, dot notation, or CSS values |
| Color palette | ✅ | Native | `colorPalette` prop for virtual colors with variants |
| Opacity modifier | ✅ | Native | `{color}/{opacity}` syntax (e.g., `bg="red.300/40"`) |
| Dark mode | ✅ | Native | Automatic color mode switching via theme tokens |

### Text Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text alignment | ✅ | Native | `textAlign` prop (left, center, right, justify) |
| Responsive alignment | ✅ | Native | Array/object syntax for breakpoints |

### Text Truncation
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single line | ✅ | Native | v2: `isTruncated` prop, v3: `truncate` prop |
| Multi-line | ✅ | Native | v2: `noOfLines={n}`, v3: `lineClamp={n}` |
| Responsive truncation | ✅ | Native | `noOfLines={[1, 2, 3]}` for different breakpoints |

### Line Height
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Line height | ✅ | Native | `lineHeight` prop with tokens or numeric values |
| Semantic tokens | ✅ | Native | shorter, short, moderate, tall, taller |

### Letter Spacing
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Letter spacing | ✅ | Native | `letterSpacing` prop with tokens or custom values |
| Semantic tokens | ✅ | Native | tighter, tight, normal, wide, wider, widest |

### Text Transform
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text transform | ✅ | Native | v2: `casing` prop, v3: `textTransform` prop |
| Transform values | ✅ | Native | uppercase, lowercase, capitalize, none |

### Text Decoration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text decoration | ✅ | Native | `textDecoration` prop (underline, line-through, etc.) |
| Decoration color | ✅ | Native | `textDecorationColor` prop |
| Decoration style | ✅ | Native | `textDecorationStyle` prop (solid, dashed, dotted, etc.) |
| Decoration thickness | ✅ | Native | `textDecorationThickness` prop |

### Interactive Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Copyable | ❌ | Not Supported | No built-in copyable feature |
| Editable | ❌ | Not Supported | Use separate Editable component |
| Keyboard display | ✅ | Styled | Via `as='kbd'` for keyboard key styling |

## Code Examples

### Basic Text Usage
```tsx
import { Text } from "@chakra-ui/react"

// Basic text
<Text>Default text content</Text>

// With size
<Text fontSize="6xl">Large text</Text>
<Text fontSize="sm">Small text</Text>

// With custom size
<Text fontSize="50px">Custom sized text</Text>
```

### Basic Heading Usage
```tsx
import { Heading, Stack } from "@chakra-ui/react"

// Different heading levels
<Stack>
  <Heading as="h1">Level 1 Heading</Heading>
  <Heading as="h2">Level 2 Heading</Heading>
  <Heading as="h3">Level 3 Heading</Heading>
  <Heading as="h4">Level 4 Heading</Heading>
</Stack>
```

### Heading with Size Prop
```tsx
import { Heading } from "@chakra-ui/react"

// Size variants
<Heading as="h1" size="xl">XL Heading</Heading>
<Heading as="h2" size="lg">Large Heading</Heading>
<Heading as="h4" size="sm">Small Heading</Heading>

// Override size with fontSize
<Heading as="h4" size="sm" fontSize="25px">
  Custom fontSize overrides size
</Heading>
```

### Font Weight Variations
```tsx
import { Text } from "@chakra-ui/react"

// Token values
<Text fontWeight="thin">Thin text</Text>
<Text fontWeight="normal">Normal text</Text>
<Text fontWeight="semibold">Semibold text</Text>
<Text fontWeight="bold">Bold text</Text>

// Numeric values
<Text fontWeight="600">Weight 600</Text>
```

### Color Variations
```tsx
import { Text } from "@chakra-ui/react"

// Theme color tokens
<Text color="gray.50">Gray 50</Text>
<Text color="tomato">Tomato color</Text>

// Raw CSS values
<Text color="#f00">Red text</Text>

// Muted text (semantic token)
<Text color="fg.muted">Muted text</Text>

// With opacity modifier
<Text bg="red.300/40" color="white">
  Red background with 40% opacity
</Text>
```

### Color Palette (Virtual Colors)
```tsx
import { Box, Button } from "@chakra-ui/react"

// Basic colorPalette
<Box
  colorPalette="blue"
  bg={{ base: "colorPalette.100", _hover: "colorPalette.200" }}
>
  Hover for color change
</Box>

// With dark mode
<Box
  colorPalette="blue"
  bg={{ base: "colorPalette.600", _dark: "colorPalette.400" }}
>
  Dark mode aware
</Box>

// Button with colorPalette
<Button colorPalette="blue">Click me</Button>
```

### Text Alignment
```tsx
import { Text } from "@chakra-ui/react"

// Basic alignment
<Text textAlign="center">Centered text</Text>
<Text textAlign="right">Right aligned</Text>

// Combined with transform
<Text textAlign="center" textTransform="uppercase">
  Centered uppercase
</Text>
```

### Text Transform
```tsx
import { Text } from "@chakra-ui/react"

<Text textTransform="uppercase">Uppercase text</Text>
<Text textTransform="lowercase">Lowercase text</Text>
<Text textTransform="capitalize">Capitalized text</Text>
```

### Line Height and Letter Spacing
```tsx
import { Text } from "@chakra-ui/react"

// Line height with numeric value
<Text lineHeight="1.5">Text with custom line height</Text>

// Line height with tokens
<Text lineHeight="tall">Tall line height</Text>
<Text lineHeight="short">Short line height</Text>

// Letter spacing with tokens
<Text letterSpacing="tight">Tight letter spacing</Text>
<Text letterSpacing="wide">Wide letter spacing</Text>
<Text letterSpacing="widest">Widest letter spacing</Text>

// Letter spacing with custom value
<Text letterSpacing="0.1rem">Custom letter spacing</Text>
```

### Text Decoration
```tsx
import { Text } from "@chakra-ui/react"

// Basic underline
<Text textDecoration="underline">Underlined text</Text>

// With custom color
<Text
  textDecoration="underline"
  textDecorationColor="red"
>
  Red underline
</Text>

// With style
<Text
  textDecoration="underline"
  textDecorationStyle="dashed"
>
  Dashed underline
</Text>

// With thickness
<Text
  textDecoration="underline"
  textDecorationThickness="2px"
>
  Thick underline
</Text>
```

### Text Truncation (v2)
```tsx
import { Text } from "@chakra-ui/react"

// Single line truncation
<Text isTruncated>
  This is a very long text that will be truncated with ellipsis
</Text>

// Multi-line truncation
<Text noOfLines={3}>
  This is a long paragraph that will be truncated after 3 lines.
  Any content beyond the third line will be hidden and replaced
  with an ellipsis to indicate there is more content available.
</Text>

// Responsive truncation
<Text noOfLines={[1, 2, 3]}>
  This text will show 1 line on mobile, 2 lines on tablet,
  and 3 lines on desktop breakpoints.
</Text>
```

### Text Truncation (v3)
```tsx
import { Text } from "@chakra-ui/react"

// Single line truncation
<Text truncate>
  This is a very long text that will be truncated with ellipsis
</Text>

// Multi-line truncation
<Text lineClamp={3}>
  This is a long paragraph that will be truncated after 3 lines.
  Any content beyond the third line will be hidden and replaced
  with an ellipsis to indicate there is more content available.
</Text>
```

### Polymorphic Rendering with 'as' Prop
```tsx
import { Text } from "@chakra-ui/react"

// Bold element
<Text as="b">Bold text</Text>

// Italic element
<Text as="i">Italic text</Text>

// Underline element
<Text as="u">Underlined text</Text>

// Keyboard element
<Text as="kbd">Ctrl + C</Text>

// Mark element
<Text as="mark">Highlighted text</Text>

// Abbreviation
<Text as="abbr">HTML</Text>

// Citation
<Text as="cite">Book Title</Text>

// Deleted text
<Text as="del">Deleted text</Text>

// Inserted text
<Text as="ins">Inserted text</Text>

// Strikethrough
<Text as="s">Strikethrough text</Text>

// Sample output
<Text as="samp">Sample output</Text>

// Subscript
<Text as="sub">Subscript</Text>

// Superscript
<Text as="sup">Superscript</Text>
```

### Responsive Typography
```tsx
import { Text, Heading } from "@chakra-ui/react"

// Responsive font size (array syntax)
<Text fontSize={["sm", "md", "lg", "xl"]}>
  Responsive text size
</Text>

// Responsive font size (object syntax)
<Heading
  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
>
  Responsive heading
</Heading>

// Responsive alignment and transform
<Text
  textAlign={["left", "center", "right"]}
  textTransform={["none", "uppercase"]}
>
  Responsive styling
</Text>
```

### Complete Typography Example
```tsx
import { Box, Heading, Text } from "@chakra-ui/react"

<Box>
  <Heading
    as="h1"
    size="2xl"
    fontWeight="bold"
    letterSpacing="tight"
    mb={4}
  >
    Main Heading
  </Heading>

  <Text
    fontSize="lg"
    lineHeight="tall"
    color="gray.600"
    mb={2}
  >
    This is a paragraph with custom styling including font size,
    line height, and color from the theme tokens.
  </Text>

  <Text
    fontSize="md"
    noOfLines={2}
    color="fg.muted"
  >
    This paragraph will be truncated after two lines with an ellipsis.
    Any additional content beyond the second line will be hidden.
  </Text>
</Box>
```

## Notable Features

### Polymorphic 'as' Prop
Both Text and Heading support the `as` prop to render as different HTML elements, providing flexibility while maintaining consistent styling. Text can render as b, i, u, kbd, mark, and many other inline elements. Heading can render as h1-h6 for proper semantic hierarchy.

### Responsive Design First-Class Support
All typography props support responsive values via array syntax `[mobile, tablet, desktop]` or object syntax `{ base: "value", md: "value" }`. This includes fontSize, fontWeight, textAlign, noOfLines, and all other style props.

### Size vs fontSize Props
Heading has a convenience `size` prop (xs, sm, md, lg, xl, 2xl, 3xl, 4xl) that provides predefined responsive sizing. The `fontSize` prop can override this for more granular control. Text uses `fontSize` directly without a size abstraction.

### Comprehensive Text Decoration Control
Beyond simple underline/strikethrough, Chakra provides fine-grained control over text decoration including color, style (solid, dashed, dotted, wavy), and thickness - uncommon in many UI libraries.

### Color Opacity Modifier Syntax
The `{color}/{opacity}` syntax (e.g., `bg="red.300/40"`) provides inline opacity control without additional props, making it easy to create semi-transparent backgrounds and overlays.

### Virtual Colors with colorPalette
The `colorPalette` prop creates virtual color references that work with hover states, dark mode, and component variants. This enables consistent color theming across related components.

### Semantic Design Tokens
Extensive token system for typography including:
- Font sizes: 2xs through 9xl
- Font weights: thin through black (with semantic names and numeric values)
- Line heights: shorter, short, moderate, tall, taller
- Letter spacing: tighter through widest
- Semantic colors: fg.muted and other contextual tokens

### Multi-line Truncation
v2 uses `noOfLines` prop with array support for responsive truncation
v3 uses `lineClamp` prop (simpler API)
Both versions support responsive array syntax for different breakpoint behaviors

### Version Differences (v2 vs v3)
- Truncation: `isTruncated` (v2) → `truncate` (v3)
- Multi-line: `noOfLines` (v2) → `lineClamp` (v3)
- Text transform: `casing` (v2) → `textTransform` (v3)
- Core functionality remains consistent across versions

### Box Component Composition
Both Text and Heading compose the Box component, inheriting all Box style props. This provides access to spacing (margin, padding), layout (display, position), borders, shadows, and all other Box capabilities without prop duplication.

### Theme System Integration
Components integrate deeply with Chakra's theme system:
- CSS variables for runtime theming
- Design tokens for consistent spacing/sizing
- Automatic dark mode support
- Customizable default styles via theme configuration

## Research Notes

- Chakra UI takes a different approach than Ant Design - instead of feature-rich components (copyable, editable), it provides primitive typography components with comprehensive styling props
- The polymorphic `as` prop is more flexible than Ant Design's fixed sub-components approach
- No built-in interactive features (copyable, editable) - these are separate components or require custom implementation
- Strong emphasis on responsive design with first-class array/object syntax support for all props
- The Box composition pattern means Text and Heading inherit extensive styling capabilities
- Color system is more sophisticated with colorPalette virtual colors and opacity modifiers
- Text decoration control is more granular than most UI libraries
- Version migration from v2 to v3 involves minor prop name changes but maintains backward compatibility patterns
- Documentation separates component basics from comprehensive style props reference
- No native disabled state for text - expected to use color/opacity for visual feedback
- Font family inheritance from theme (Inter by default) rather than per-component configuration
- The `size` prop on Heading is a convenience wrapper around responsive fontSize values
- Missing enterprise features like inline editing or copy-to-clipboard found in Ant Design
- Responsive truncation is more powerful than most frameworks with array syntax support
- Letter spacing and line height have both semantic tokens and custom value support
- The as='kbd' pattern for keyboard display is less sophisticated than Ant Design's keyboard prop
- Scroll margin automatically added to headings for anchor linking (UX consideration)
- No text alignment prop restrictions - full CSS text-align support
- Theming is runtime via CSS variables rather than build-time compilation
- Component is very lightweight - most features come from inherited Box props
- No suffix ellipsis feature like Ant Design (middle truncation for file paths)
- Dark mode support is automatic through theme tokens rather than explicit prop
- Package: @chakra-ui/react
- Framework: React-specific but uses standard CSS-in-JS patterns
- The separation of Text vs Heading is semantic (span/div vs h1-h6) rather than feature-based
- Type safety likely strong due to TypeScript-first development
- No opinionated typography scale - developers define their own via theme
- Text and layer styles provide reusable typography compositions
- More focused on providing building blocks than ready-to-use patterns
- Accessibility through semantic HTML and theme color contrast ratios
