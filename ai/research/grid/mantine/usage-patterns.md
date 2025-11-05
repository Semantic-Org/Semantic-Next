# Mantine - Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/grid/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear explanations, multiple examples, and detailed prop descriptions.

## Component Definition
- **Core purpose**: Provides a flexible, responsive 12-column grid system for organizing content into rows and columns with customizable spacing, alignment, and sizing.
- **Mental model**: Flexbox-based layout wrapper where columns automatically wrap when their combined span and offset values exceed the total column count (default 12).
- **Semantic meaning**: Establishes a structured, responsive layout grid that adapts to various screen sizes and provides consistent spacing and alignment across the application.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `span={12}`)
- **Composed**: Via composition/children (e.g., `<Grid><Grid.Col></Grid.Col></Grid>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Row/Column system | ✅ | Composed | `<Grid>` as row wrapper, `<Grid.Col>` for columns; columns auto-wrap when span + offset exceeds total |
| 12-column grid | ✅ | Native | Default 12-column system; configurable via `columns` prop (e.g., `columns={24}`) |
| CSS Grid based | ❌ | N/A | Not CSS Grid |
| Flexbox based | ✅ | Native | Built entirely on flexbox; uses flex properties for layout calculations |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | `xs, sm, md, lg, xl` breakpoints; object syntax for responsive values |
| Responsive spans | ✅ | Native | `span={{ base: 12, md: 6, lg: 3 }}` - base (0–36em), md (62em+), lg (75em+) |
| Responsive gutter | ✅ | Native | `gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}` supports theme tokens and pixel values |
| Container queries | ✅ | Native | `type="container"` with custom `breakpoints` prop responds to container width vs viewport |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gutter control | ✅ | Native | `gutter` prop accepts theme spacing (xs, sm, md, lg, xl), pixel values, or responsive object |
| Gap utilities | ✅ | Native | Implemented via CSS `--grid-gutter` variable; default `--mantine-spacing-md` |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | Native | `justify` prop: flex-start, flex-end, center, space-between, space-around |
| Vertical alignment | ✅ | Native | `align` prop: flex-start, flex-end, center |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Span control | ✅ | Native | `span` prop: numeric (1–12), "auto" (flex-grow), "content" (fit-content), responsive object |
| Offset | ✅ | Native | `offset` prop creates left margin/gaps; same syntax as span (numeric, responsive object) |
| Auto sizing | ✅ | Native | `span="auto"` enables flex-grow; multiple auto columns resize proportionally |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | Composed | Grid components can be nested within Grid.Col |
| Column ordering | ✅ | Native | `order` prop with responsive support: `order={{ base: 2, sm: 1, lg: 3 }}` |
| Grow/shrink | ✅ | Native | `grow` prop on Grid enables all columns to expand equally to fill row space |

## Code Examples

### Basic 3-Column Layout
```jsx
<Grid>
  <Grid.Col span={4}>1</Grid.Col>
  <Grid.Col span={4}>2</Grid.Col>
  <Grid.Col span={4}>3</Grid.Col>
</Grid>
```

### Responsive Span
```jsx
<Grid>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>1</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>2</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>3</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>4</Grid.Col>
</Grid>
```

### Responsive Gutter
```jsx
<Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
  <Grid.Col span={4}>1</Grid.Col>
  <Grid.Col span={4}>2</Grid.Col>
  <Grid.Col span={4}>3</Grid.Col>
</Grid>
```

### Auto-Sized Columns
```jsx
<Grid>
  <Grid.Col span="auto">1</Grid.Col>
  <Grid.Col span={6}>2</Grid.Col>
  <Grid.Col span="auto">3</Grid.Col>
</Grid>
```

### Content-Fit Column
```jsx
<Grid>
  <Grid.Col span="content">fit content</Grid.Col>
  <Grid.Col span={6}>2</Grid.Col>
</Grid>
```

### Alignment Control
```jsx
<Grid justify="flex-start" align="flex-start">
  <Grid.Col span={3} h={80}>1</Grid.Col>
  <Grid.Col span={3} h={120}>2</Grid.Col>
  <Grid.Col span={3} h={100}>3</Grid.Col>
</Grid>
```

### Column Offset
```jsx
<Grid>
  <Grid.Col span={3} offset={3}>3</Grid.Col>
</Grid>
```

### Column Ordering
```jsx
<Grid>
  <Grid.Col span={3} order={{ base: 2, sm: 1, lg: 3 }}>2</Grid.Col>
</Grid>
```

### Container Queries
```jsx
<Grid
  type="container"
  breakpoints={{ xs: '100px', sm: '200px', md: '300px', lg: '400px', xl: '500px' }}
>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>1</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>2</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>3</Grid.Col>
  <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>4</Grid.Col>
</Grid>
```

### Custom Column Count
```jsx
<Grid columns={24}>
  <Grid.Col span={12}>1</Grid.Col>
  <Grid.Col span={6}>2</Grid.Col>
  <Grid.Col span={6}>3</Grid.Col>
</Grid>
```

### Grow Behavior
```jsx
<Grid grow>
  <Grid.Col span={4}>1</Grid.Col>
  <Grid.Col span={4}>2</Grid.Col>
  <Grid.Col span={4}>3</Grid.Col>
  <Grid.Col span={4}>4</Grid.Col>
  <Grid.Col span={4}>5</Grid.Col>
</Grid>
```

## Notable Features

### Container Queries Support
Modern CSS container queries allow the grid to respond to its container's width rather than the viewport, enabling more modular responsive designs. Requires `type="container"` and explicit `breakpoints` prop.

### Flexible Span Values
Three distinct span modes:
- **Numeric (1–12)**: Traditional percentage-based columns
- **"auto"**: Flex-grow behavior where multiple auto columns resize proportionally
- **"content"**: Intrinsic sizing that adjusts to content width (fit-content)

### Custom Column Systems
The `columns` prop allows changing from the default 12-column grid to any number (e.g., 24), enabling more granular control and non-standard grid layouts.

### Responsive Everything
Nearly all props support responsive object syntax: `span`, `offset`, `order`, and `gutter` can all vary by breakpoint using the `{ base, xs, sm, md, lg, xl }` pattern.

### CSS Variable Architecture
Layout uses CSS custom properties for calculations:
- `--col-flex-grow`, `--col-flex-basis`, `--col-max-width` for column sizing
- `--grid-gutter` for spacing
- `--col-offset`, `--col-order` for positioning

### Automatic Wrapping
Columns automatically wrap to the next row when their combined `span + offset` exceeds the total column count, eliminating the need for explicit row wrappers.

## Research Notes

- Documentation was easily accessible with no issues
- Mantine v8.3.6 provides a mature, well-tested grid implementation
- The flexbox-based approach differs from pure CSS Grid implementations but offers excellent browser compatibility
- Container queries are a modern addition that provides significant flexibility for component-based architectures
- The "content" span value is particularly innovative for creating adaptive layouts
- Overflow behavior defaults to visible but can be set to hidden to manage negative margins
- All examples use React/JSX syntax with @mantine/core package
