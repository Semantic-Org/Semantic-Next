# Chakra UI - Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/grid
Status: ✅ Working
Version: v2.10.9 (Chakra UI v2), v3.28.1 referenced
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-documented with clear examples showing various grid patterns, spanning behavior, and template areas.

## Component Definition
- **Core purpose**: Provides a CSS Grid-based layout system for organizing content in two-dimensional rows and columns with flexible positioning and alignment control.
- **Mental model**: A declarative wrapper around native CSS Grid that manages grid containers and items, with semantic naming through template areas and responsive capabilities through Chakra's design system.
- **Semantic meaning**: Communicates structured, two-dimensional layout with precise control over item placement, spanning, and responsive behavior.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `templateColumns="repeat(5, 1fr)"`)
- **Composed**: Via composition/children (e.g., `<Grid><GridItem></GridItem></Grid>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Row/Column system | ✅ | Native | Uses CSS Grid with `templateColumns` and `templateRows` props |
| 12-column grid | ✅ | Native | Can be created via `templateColumns="repeat(12, 1fr)"` |
| CSS Grid based | ✅ | Native | Built directly on CSS Grid display property |
| Flexbox based | ❌ | N/A | Uses CSS Grid, not Flexbox |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | Supports base, sm (480px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) |
| Responsive props | ✅ | Native | All grid props accept `ResponsiveValue` type for breakpoint-based values |
| Fluid columns | ✅ | Native | Using `fr` units in templateColumns (e.g., `repeat(3, 1fr)`) |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gutter control | ✅ | Native | `gap`, `rowGap`, `columnGap` props map to Chakra spacing scale |
| Gap utilities | ✅ | Native | Gap accepts numeric values (1-96) mapping to spacing tokens or raw CSS values |
| Padding control | ✅ | Composed | Via Box composition (Grid extends Box, inherits padding props) |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | Native | `justifyContent`, `justifyItems` props available via Box composition |
| Vertical alignment | ✅ | Native | `alignContent`, `alignItems` props available via Box composition |
| Place alignment | ✅ | Native | `placeContent`, `placeItems` shorthand props supported |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Template columns | ✅ | Native | `templateColumns` prop with responsive support (e.g., `repeat(5, 1fr)`) |
| Template rows | ✅ | Native | `templateRows` prop with responsive support |
| Span control | ✅ | Native | `colSpan`, `rowSpan` props on GridItem component |
| Auto flow | ✅ | Native | `autoFlow`, `autoRows`, `autoColumns` props with ResponsiveValue support |
| Explicit positioning | ✅ | Native | `colStart`, `colEnd`, `rowStart`, `rowEnd` props on GridItem |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | Native | Grid components can be nested within GridItem for complex layouts |
| Grid areas | ✅ | Native | `templateAreas` prop for named regions, `area` prop on GridItem to reference regions |
| Dense packing | ✅ | Native | Via `autoFlow` prop (can be set to "dense" or "row dense"/"column dense") |

## Code Examples

### Basic Grid with Template Columns
```jsx
import { Grid, GridItem } from '@chakra-ui/react'

// Evenly distributed 5-column grid
<Grid templateColumns='repeat(5, 1fr)' gap={6}>
  <GridItem w='100%' h='10' bg='blue.500' />
  <GridItem w='100%' h='10' bg='blue.500' />
  <GridItem w='100%' h='10' bg='blue.500' />
  <GridItem w='100%' h='10' bg='blue.500' />
  <GridItem w='100%' h='10' bg='blue.500' />
</Grid>
```

### Column and Row Spanning
```jsx
// Complex grid with spanning items
<Grid
  h='200px'
  templateRows='repeat(2, 1fr)'
  templateColumns='repeat(5, 1fr)'
  gap={4}
>
  <GridItem rowSpan={2} colSpan={1} bg='tomato'>
    <Box>rowSpan=2</Box>
  </GridItem>
  <GridItem colSpan={2} bg='papayawhip'>
    <Box>colSpan=2</Box>
  </GridItem>
  <GridItem colSpan={2} bg='papayawhip'>
    <Box>colSpan=2</Box>
  </GridItem>
  <GridItem colSpan={4} bg='tomato'>
    <Box>colSpan=4</Box>
  </GridItem>
</Grid>
```

### Explicit Grid Item Positioning
```jsx
// Position items using start and end lines
<Grid templateColumns='repeat(5, 1fr)' gap={4}>
  <GridItem colStart={4} colEnd={6} h='10' bg='papayawhip' />
  <GridItem colStart={1} colEnd={3} h='10' bg='tomato' />
</Grid>
```

### Template Areas (Semantic Layout)
```jsx
// Define named regions for semantic layout
<Grid
  templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
  gridTemplateRows='50px 1fr 30px'
  gridTemplateColumns='150px 1fr'
  gap='1'
  h='200px'
>
  <GridItem area='header' bg='orange.300'>
    Header
  </GridItem>
  <GridItem area='nav' bg='pink.300'>
    Nav
  </GridItem>
  <GridItem area='main' bg='green.300'>
    Main
  </GridItem>
  <GridItem area='footer' bg='blue.300'>
    Footer
  </GridItem>
</Grid>
```

### Responsive Grid (Conceptual)
```jsx
// Responsive columns using breakpoint syntax
<Grid
  templateColumns={{
    base: 'repeat(1, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)'
  }}
  gap={6}
>
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
  <GridItem>Item 4</GridItem>
</Grid>
```

## Notable Features
- **CSS Grid Native Implementation**: Directly wraps CSS Grid without abstraction, providing full access to CSS Grid capabilities
- **GridItem Component Pattern**: Dedicated child component (GridItem) for controlling individual cell behavior with colSpan, rowSpan, and positioning props
- **Template Areas Support**: Named grid regions via `templateAreas` prop enable semantic, maintainable layout definitions
- **Chakra Box Composition**: Grid extends Box component, inheriting all Box props for styling, spacing, and layout control
- **Responsive Value System**: All grid props support ResponsiveValue types, enabling breakpoint-based responsive layouts through object syntax
- **Spacing Scale Integration**: Gap properties integrate with Chakra's spacing scale (numeric values 1-96 map to spacing tokens like 0.25rem, 0.5rem, etc.)
- **Explicit and Implicit Positioning**: Supports both implicit placement via colSpan/rowSpan and explicit positioning via colStart/colEnd/rowStart/rowEnd
- **Auto-Flow Control**: Full control over grid auto-placement behavior through autoFlow, autoRows, and autoColumns props
- **TypeScript Support**: Comprehensive TypeScript definitions with ResponsiveValue types for all grid-specific props

## Research Notes
- Documentation accessed from v2.chakra-ui.com which provided comprehensive examples and prop details
- Current version (v3.28.1) is available but v2 documentation was more detailed for research purposes
- Grid component is part of the `@chakra-ui/layout` package
- The component provides a thin, declarative wrapper around CSS Grid without attempting to simplify or abstract away CSS Grid concepts
- Unlike some frameworks that create custom grid systems, Chakra's Grid maintains 1:1 mapping with CSS Grid properties
- The GridItem component provides convenience for common patterns (spanning, positioning) while remaining optional for simple use cases
- No difficulties accessing documentation; examples were clear and comprehensive
- The framework's approach prioritizes CSS Grid knowledge transfer rather than creating a proprietary grid system
