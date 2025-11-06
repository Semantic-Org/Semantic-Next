# Chakra UI - Flex Usage Patterns
> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/flex
Status: ✅ Working
Version: 3.28.1
Last Verified: 2025-11-05

## Documentation Quality
Good - The Flex component documentation provides clear explanations of its purpose as a flexbox wrapper with shorthand props. Documentation covers basic usage and prop aliases, though code examples are less extensive compared to some other Chakra UI components.

## Component Definition
- **Core purpose**: Flex is Box with `display: flex` pre-applied, designed to simplify flexbox layouts by providing convenient shorthand props for common flexbox properties. It renders a `div` element by default.
- **Mental model**: Think of Flex as a convenience wrapper that eliminates the need to repeatedly set `display="flex"` on Box components. It's a specialized Box that assumes you want flexbox behavior and provides intuitive prop aliases (like `direction` instead of `flexDirection`).
- **Semantic meaning**: Flex is semantically neutral (renders as a `div` by default), but communicates intent for flexible layouts. It can be made semantic through the `as` prop (inherited from Box).

## Flexbox Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Direction control | ✅ | Native | `direction` prop (alias for `flexDirection`). Accepts: `row`, `column`, `row-reverse`, `column-reverse`. Responsive values supported. |
| Justify content | ✅ | Native | `justify` prop (alias for `justifyContent`). Controls main-axis alignment: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` |
| Align items | ✅ | Native | `align` prop (alias for `alignItems`). Controls cross-axis alignment: `flex-start`, `flex-end`, `center`, `stretch`, `baseline` |
| Align content | ✅ | Native | Full `alignContent` support for multi-line flex containers |
| Gap/spacing | ✅ | Native | `gap` prop for spacing between flex items. Accepts spacing scale values (e.g., `gap={4}` = 1rem). Also supports `rowGap` and `columnGap` |
| Wrap control | ✅ | Native | `wrap` prop (alias for `flexWrap`). Values: `nowrap`, `wrap`, `wrap-reverse` |
| Flex basis | ✅ | Native | `flexBasis` prop to set initial main size of flex items |
| Flex grow | ✅ | Native | `flexGrow` prop to control growth factor |
| Flex shrink | ✅ | Native | `flexShrink` prop to control shrink factor |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Responsive direction | ✅ | Native | Array syntax: `direction={["column", "row"]}` or object syntax: `direction={{ base: "column", md: "row" }}` |
| Responsive alignment | ✅ | Native | All alignment props support responsive values: `justify={{ base: "center", md: "space-between" }}` |
| Responsive gap | ✅ | Native | Gap supports responsive spacing: `gap={[2, 4, 6]}` or `gap={{ base: 2, md: 4, lg: 6 }}` |
| Responsive wrap | ✅ | Native | Wrap control with breakpoints: `wrap={{ base: "wrap", md: "nowrap" }}` |
| Mobile-first design | ✅ | Native | Follows Chakra's mobile-first responsive system with breakpoints: base (0px), sm (480px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) |

## Prop Aliases
| Alias | Maps To | Purpose |
|-------|---------|---------|
| `direction` | `flexDirection` | More concise, commonly used property |
| `justify` | `justifyContent` | Shorter name for main-axis alignment |
| `align` | `alignItems` | Shorter name for cross-axis alignment |
| `wrap` | `flexWrap` | Simplified wrap control |

## Code Examples

### Basic Flex Container
```jsx
import { Flex } from "@chakra-ui/react"

// Simple horizontal flex container
export function BasicFlex() {
  return (
    <Flex>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Flex>
  )
}
```

### Direction Control
```jsx
// Column layout
<Flex direction="column">
  <Box>First</Box>
  <Box>Second</Box>
  <Box>Third</Box>
</Flex>

// Reverse row
<Flex direction="row-reverse">
  <Box>First (appears right)</Box>
  <Box>Second</Box>
  <Box>Third (appears left)</Box>
</Flex>

// Responsive direction: column on mobile, row on desktop
<Flex direction={{ base: "column", md: "row" }}>
  <Box>Stacks on mobile</Box>
  <Box>Horizontal on desktop</Box>
</Flex>
```

### Alignment Patterns
```jsx
// Center everything
<Flex justify="center" align="center" minH="200px">
  <Box>Centered content</Box>
</Flex>

// Space between with vertical centering
<Flex justify="space-between" align="center">
  <Box>Left</Box>
  <Box>Right</Box>
</Flex>

// Space around with stretch
<Flex justify="space-around" align="stretch" h="200px">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Flex>

// Responsive alignment
<Flex
  justify={{ base: "center", md: "space-between" }}
  align={{ base: "stretch", md: "center" }}
>
  <Box>Adaptive alignment</Box>
  <Box>Changes with viewport</Box>
</Flex>
```

### Gap/Spacing
```jsx
// Uniform gap
<Flex gap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Flex>

// Responsive gap
<Flex gap={[2, 4, 6]}>
  <Box>Small gap on mobile</Box>
  <Box>Large gap on desktop</Box>
</Flex>

// Different row and column gaps
<Flex wrap="wrap" rowGap={6} columnGap={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
  <Box>Item 4</Box>
</Flex>
```

### Wrap Control
```jsx
// Allow wrapping
<Flex wrap="wrap" gap={4}>
  <Box w="200px">Item 1</Box>
  <Box w="200px">Item 2</Box>
  <Box w="200px">Item 3</Box>
  <Box w="200px">Item 4</Box>
</Flex>

// Responsive wrap: wrap on mobile, nowrap on desktop
<Flex wrap={{ base: "wrap", lg: "nowrap" }} gap={4}>
  <Box flex="1">Item 1</Box>
  <Box flex="1">Item 2</Box>
  <Box flex="1">Item 3</Box>
</Flex>
```

### Flex Item Control
```jsx
// Control individual item growth and shrink
<Flex gap={4}>
  <Box flex="1">Grows to fill space</Box>
  <Box flexShrink={0} w="200px">Fixed width</Box>
  <Box flex="2">Grows twice as much</Box>
</Flex>

// Flex basis
<Flex>
  <Box flexBasis="200px" flexGrow={1}>Starts at 200px, can grow</Box>
  <Box flexBasis="300px" flexShrink={0}>Fixed at 300px</Box>
</Flex>
```

### Common Layout Patterns
```jsx
// Header layout: logo left, nav right
<Flex justify="space-between" align="center" p={4} bg="gray.100">
  <Box fontWeight="bold" fontSize="xl">Logo</Box>
  <Flex gap={6}>
    <Box>Home</Box>
    <Box>About</Box>
    <Box>Contact</Box>
  </Flex>
</Flex>

// Sidebar layout
<Flex h="100vh">
  <Box w="250px" bg="gray.100" p={4}>
    Sidebar
  </Box>
  <Box flex="1" p={4}>
    Main content
  </Box>
</Flex>

// Card with icon and content
<Flex gap={4} p={4} borderWidth={1} borderRadius="md">
  <Box flexShrink={0}>
    <Icon />
  </Box>
  <Box flex="1">
    <Heading size="md">Card Title</Heading>
    <Text>Card content that grows to fill space</Text>
  </Box>
</Flex>

// Responsive grid-like layout using flex
<Flex wrap="wrap" gap={4}>
  <Box
    w={{ base: "100%", sm: "calc(50% - 8px)", lg: "calc(33.333% - 11px)" }}
    p={4}
    borderWidth={1}
  >
    Card 1
  </Box>
  <Box
    w={{ base: "100%", sm: "calc(50% - 8px)", lg: "calc(33.333% - 11px)" }}
    p={4}
    borderWidth={1}
  >
    Card 2
  </Box>
  <Box
    w={{ base: "100%", sm: "calc(50% - 8px)", lg: "calc(33.333% - 11px)" }}
    p={4}
    borderWidth={1}
  >
    Card 3
  </Box>
</Flex>

// Vertical centering with full height
<Flex justify="center" align="center" minH="100vh">
  <Box maxW="md" p={8} borderWidth={1} borderRadius="lg">
    Centered modal-like content
  </Box>
</Flex>
```

### Combining with Other Box Props
```jsx
// Flex inherits all Box props for styling
<Flex
  direction="column"
  gap={4}
  p={6}
  bg="gray.50"
  borderRadius="lg"
  boxShadow="md"
  maxW="500px"
>
  <Box>Flex with Box styling</Box>
  <Box>Background, padding, border radius</Box>
  <Box>All work seamlessly</Box>
</Flex>

// Responsive styling with flex
<Flex
  direction={{ base: "column", md: "row" }}
  gap={{ base: 4, md: 6 }}
  p={{ base: 4, md: 8 }}
  bg={{ base: "white", md: "gray.50" }}
>
  <Box>Responsive everything</Box>
  <Box>Direction, gap, padding, background</Box>
</Flex>
```

## Notable Features

### 1. Convenience Wrapper Pattern
Flex is essentially `Box` with `display: flex` pre-applied, eliminating repetitive code:
```jsx
// Without Flex
<Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">

// With Flex
<Flex direction="row" justify="center" align="center">
```

### 2. Prop Alias System
Chakra UI provides shorter, more intuitive prop names that map to standard CSS flexbox properties:
- `direction` → `flexDirection`
- `justify` → `justifyContent`
- `align` → `alignItems`
- `wrap` → `flexWrap`

This reduces verbosity while maintaining clarity.

### 3. Full Box Composition
Since Flex extends Box, it inherits all Box capabilities:
- All spacing props (`p`, `m`, `px`, `py`, etc.)
- Color props (`bg`, `color`)
- Border props (`borderRadius`, `borderWidth`)
- Typography props (`fontSize`, `fontWeight`)
- Layout props (`w`, `h`, `maxW`, `minH`)
- Polymorphism via `as` prop

### 4. Native Gap Support
Modern CSS `gap` property is supported natively, eliminating the need for margin hacks or wrapper components for spacing between flex items.

### 5. Responsive Design Integration
All flex props support Chakra UI's responsive syntax:
- Array syntax (mobile-first): `[base, sm, md, lg, xl, 2xl]`
- Object syntax (named breakpoints): `{ base, sm, md, lg, xl, 2xl }`

### 6. Design Token Integration
Spacing values automatically map to Chakra UI's spacing scale:
- `gap={4}` = `1rem` (16px)
- `gap={8}` = `2rem` (32px)
- Consistent with the rest of the design system

### 7. Type Safety
Full TypeScript support with autocomplete for all props and valid values.

## Research Notes

### Strengths
- **Developer Experience**: Excellent DX with intuitive prop names and minimal boilerplate
- **Consistency**: Follows Chakra UI's design system patterns for spacing, colors, and responsive design
- **Flexibility**: Being built on Box means full access to all styling capabilities
- **Modern CSS**: Uses native `gap` property rather than margin hacks
- **Type Safety**: Strong TypeScript support with comprehensive prop types
- **Documentation**: Clear and accessible, though could benefit from more advanced examples

### Observations
- Flex is one of the most commonly used layout components in Chakra UI
- The prop alias system (`direction`, `justify`, `align`, `wrap`) is a key differentiator that improves code readability
- Gap support eliminates the need for the older pattern of adding margins to child elements
- The component demonstrates Chakra UI's philosophy of "composition over configuration" - Flex is just Box with preset display and convenient aliases
- Responsive design is first-class with mobile-first breakpoint system
- No dedicated "reverse" prop - uses standard CSS values like `row-reverse` and `column-reverse`

### Comparison to Stack Components
Chakra UI also provides Stack components (VStack, HStack) which are more opinionated:
- **Flex**: General-purpose flexbox container with full control
- **Stack (VStack/HStack)**: Specialized flex containers optimized for vertical/horizontal stacking with built-in spacing
- **When to use Flex**: Need fine-grained control over alignment, wrapping, grow/shrink behavior
- **When to use Stack**: Simple vertical or horizontal layouts with consistent spacing

### Integration with Design System
- All spacing props use the Chakra UI spacing scale (0-96, corresponding to 0-24rem)
- Color props integrate with the color palette system
- Responsive breakpoints: sm (480px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Works seamlessly with other Chakra UI components

### Performance Characteristics
- Lightweight: Minimal JavaScript overhead (just prop mapping)
- No runtime style computation beyond Chakra's standard style system
- CSS-in-JS is optimized by Chakra's styling engine
- Responsive styles generate efficient CSS media queries

### Common Use Cases Observed
1. **Header/Navigation Layouts**: Logo on left, menu items on right with space-between
2. **Card Components**: Icon/image with adjacent content that grows to fill space
3. **Form Layouts**: Label and input side-by-side with proper alignment
4. **Sidebar Layouts**: Fixed sidebar with flexible main content area
5. **Responsive Grids**: Using wrap with percentage-based widths
6. **Centering Content**: Horizontal and vertical centering for modals, empty states
7. **Button Groups**: Horizontal button arrangements with consistent spacing

### Potential Semantic UI Implementation Considerations
- Consider whether to provide prop aliases or stick with standard CSS property names
- Gap support is essential for modern flexbox layouts
- Responsive design integration is a key feature to replicate
- The convenience of pre-setting `display: flex` significantly reduces boilerplate
- TypeScript autocomplete for flex properties greatly improves DX
- Design token integration for spacing values provides consistency

### Version Notes
- Version 3.28.1 represents the latest Chakra UI v3 release
- The Flex component API has remained stable across Chakra UI versions
- v3 continues to support all v2 Flex patterns with recipe-based theming improvements
- No breaking changes noted in recent versions for Flex component

### Related Documentation
- Main Flex docs: https://chakra-ui.com/docs/components/flex
- Flexbox style props: https://chakra-ui.com/docs/styling/style-props/flex-and-grid
- v2 props reference: https://v2.chakra-ui.com/docs/components/flex/props
- Box component (base): https://chakra-ui.com/docs/components/box
- Stack components (related): https://chakra-ui.com/docs/components/stack
