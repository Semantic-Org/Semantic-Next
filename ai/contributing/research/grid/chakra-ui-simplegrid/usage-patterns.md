# Chakra UI - SimpleGrid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/simple-grid
Status: ✅ Working
Version: v2 (Current stable)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-documented with clear examples, responsive patterns, and practical use cases. Documentation includes both array and object syntax for responsive design.

## Component Definition
- **Core purpose**: Provides a friendly interface to create responsive grid layouts with equal-width columns and automatic column adjustment based on available space.
- **Mental model**: A simplified CSS Grid wrapper that abstracts away complex grid template syntax, focusing on common patterns like equal-width columns and auto-responsive layouts.
- **Semantic meaning**: A layout container that arranges child elements in a grid structure with automatic responsive behavior, ideal for card grids, image galleries, and uniform content layouts.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `columns={3}`, `minChildWidth="120px"`)
- **Composed**: Via composition/children (e.g., `<SimpleGrid>children</SimpleGrid>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Equal-width columns | ✅ | Native | `columns` prop creates equal-width columns automatically |
| Min-width columns | ✅ | Native | `minChildWidth` prop uses CSS grid auto-fit and minmax() |
| CSS Grid based | ✅ | Native | Renders as `display: grid`, composes Box for full CSS grid access |
| Auto-fit/Auto-fill | ✅ | Native | `minChildWidth` uses auto-fit internally with minmax() |
| Column spanning | ✅ | Composed | Use GridItem component with `colSpan` prop |
| Row spanning | ✅ | Composed | Use GridItem component with `rowSpan` prop |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | base (0px), sm (480px), md (768px), lg (992px), xl (1280px), 2xl (1536px) |
| Responsive columns | ✅ | Native | `columns={[2, null, 3]}` or `columns={{ base: 2, md: 4 }}` |
| Responsive spacing | ✅ | Native | `spacing={{ base: '20px', md: '40px' }}` |
| Array syntax | ✅ | Native | Mobile-first array values: `[mobile, tablet, desktop]` |
| Object syntax | ✅ | Native | Breakpoint object: `{ base: value, md: value }` |
| Auto-responsive | ✅ | Native | `minChildWidth` adjusts columns automatically based on container width |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gap control | ✅ | Native | `spacing` prop for uniform gap, or `gap` prop directly |
| Row gap | ✅ | Native | `spacingY` prop or `rowGap` prop |
| Column gap | ✅ | Native | `spacingX` prop or `columnGap` prop |
| Separate X/Y spacing | ✅ | Native | `spacingX="40px" spacingY="20px"` |
| Responsive spacing | ✅ | Native | `spacing={[4, 6, 8]}` or `spacing={{ base: 4, md: 6 }}` |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed columns | ✅ | Native | `columns={3}` creates exactly 3 columns |
| Responsive fixed columns | ✅ | Native | `columns={[2, null, 3]}` for breakpoint-specific column counts |
| Min child width | ✅ | Native | `minChildWidth="120px"` or `minChildWidth="sm"` (using theme sizes) |
| Auto-fill behavior | ✅ | Native | `minChildWidth` provides auto-fill with minimum width constraint |
| Theme-based sizing | ✅ | Native | Can use theme tokens: `minChildWidth="sm"`, `spacing="4"` |

## Code Examples

### Basic Equal-Width Grid
```jsx
import { SimpleGrid, Box } from "@chakra-ui/react"

const Demo = () => (
  <SimpleGrid columns={3} spacing="40px">
    <Box bg="tomato" height="80px"></Box>
    <Box bg="tomato" height="80px"></Box>
    <Box bg="tomato" height="80px"></Box>
    <Box bg="tomato" height="80px"></Box>
    <Box bg="tomato" height="80px"></Box>
    <Box bg="tomato" height="80px"></Box>
  </SimpleGrid>
)
```

### Responsive Grid with Array Syntax
```jsx
// 2 columns on mobile, 2 on tablet (null keeps previous value), 3 on desktop
<SimpleGrid columns={[2, null, 3]} spacing="40px">
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

### Responsive Grid with Object Syntax
```jsx
<SimpleGrid columns={{ base: 2, md: 4 }} spacing="40px">
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

### Auto-Responsive with minChildWidth
```jsx
// Automatically adjusts column count based on available space
// Children will never be smaller than 120px
<SimpleGrid minChildWidth="120px" spacing="40px">
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

### Using Theme Size Tokens
```jsx
// Using Chakra's theme size tokens
<SimpleGrid minChildWidth="sm" spacing="40px">
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

### Separate Row and Column Spacing
```jsx
<SimpleGrid columns={2} spacingX="40px" spacingY="20px">
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

### With GridItem for Column Spanning
```jsx
<SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "24px", md: "40px" }}>
  <GridItem colSpan={{ base: 1, md: 3 }}>
    <Box bg="tomato" height="80px">Spans 1 col on mobile, 3 on desktop</Box>
  </GridItem>
  <Box bg="blue.500" height="80px">Regular item</Box>
  <Box bg="blue.500" height="80px">Regular item</Box>
  <Box bg="blue.500" height="80px">Regular item</Box>
</SimpleGrid>
```

### Responsive Spacing
```jsx
<SimpleGrid
  columns={[1, 2, 3]}
  spacing={{ base: "20px", md: "40px", lg: "60px" }}
>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
  <Box bg="tomato" height="80px"></Box>
</SimpleGrid>
```

## Notable Features

### 1. Simplified API
SimpleGrid abstracts complex CSS Grid syntax into a simple, intuitive API. Instead of writing `gridTemplateColumns: "repeat(3, 1fr)"`, you write `columns={3}`.

### 2. Auto-Responsive Behavior
The `minChildWidth` prop is particularly powerful - it uses CSS Grid's `auto-fit` and `minmax()` functions internally to automatically adjust the number of columns based on available space while respecting minimum width constraints. This eliminates the need for manual breakpoint management in many cases.

### 3. Mobile-First Design
All responsive props use a mobile-first approach with min-width media queries. Values cascade upward from smaller to larger breakpoints.

### 4. Theme Integration
SimpleGrid integrates seamlessly with Chakra UI's theme system, allowing you to use theme tokens for spacing (`spacing="4"`) and sizes (`minChildWidth="sm"`).

### 5. Composes Box
SimpleGrid extends Box, meaning it accepts all Box props and CSS Grid properties. This provides escape hatches for advanced use cases while maintaining the simple API for common patterns.

### 6. Difference from Grid Component
- **SimpleGrid**: Best for equal-width columns and auto-responsive layouts with minimal configuration
- **Grid**: Better for complex layouts requiring precise control over column widths, grid template areas, and asymmetric designs

### 7. GridItem Integration
While SimpleGrid creates equal-width columns by default, you can use the GridItem component for children that need to span multiple columns or rows, combining simplicity with flexibility.

### 8. Null Values in Arrays
When using array syntax for responsive props, `null` values preserve the previous breakpoint's value, allowing for more concise responsive definitions: `columns={[2, null, 3]}` means "2 on mobile, stay at 2 on tablet, 3 on desktop".

## Research Notes

- **Documentation Access**: Successfully accessed via web search. Primary documentation at https://chakra-ui.com/docs/components/simple-grid is comprehensive and well-maintained.

- **Version Stability**: Component API appears stable across v1 and v2 of Chakra UI. v2 is the current stable version.

- **Framework Approach**: Chakra UI emphasizes developer experience with intuitive prop names and flexible responsive syntax. The choice between array and object syntax gives developers flexibility in how they express responsive designs.

- **CSS Grid Abstraction**: SimpleGrid successfully abstracts CSS Grid complexity for the 80% use case (equal-width columns), while still providing full CSS Grid power through the underlying Box component composition.

- **Auto-Fit Implementation**: The `minChildWidth` prop is implemented using `grid-template-columns: repeat(auto-fit, minmax(${minChildWidth}, 1fr))`, which is the CSS Grid pattern for auto-responsive layouts.

- **Comparison to Other Frameworks**: Unlike some frameworks that require separate components for grid items, SimpleGrid works directly with any children. GridItem is only needed when column/row spanning is required.

- **Practical Use Cases**:
  - Card grids (product cards, blog post cards)
  - Image galleries
  - Dashboard widgets
  - Form layouts (2-column forms)
  - Feature lists
  - Any uniform grid of items

- **Performance**: As a thin wrapper around CSS Grid, performance is essentially native CSS performance. No JavaScript-based layout calculations.

- **Accessibility**: SimpleGrid itself doesn't add semantic meaning, but maintains the semantic structure of its children. Developers should ensure proper semantic HTML within grid items.
