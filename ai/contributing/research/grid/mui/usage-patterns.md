# MUI - Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-grid/
Status: ✅ Working
Version: Current (v5+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides detailed documentation with interactive demos, complete API reference, and migration guides for both Grid v1 (flexbox) and Grid v2 (CSS Grid).

## Component Definition
- **Core purpose**: Provides a responsive two-dimensional layout system for organizing content in rows and columns with built-in spacing and breakpoint support
- **Mental model**: Container/item hierarchy where containers establish grid context and items define column spans and positioning
- **Semantic meaning**: Structural layout component that communicates content organization and responsive behavior

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `xs={12}`, `spacing={2}`, `container`)
- **Composed**: Via composition/children (e.g., `<Grid container><Grid item></Grid></Grid>`)
- **CSS-only**: Requires custom styling (e.g., `sx={{ ... }}`)

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Container/Item system | ✅ | Native | `container` and `item` boolean props |
| 12-column grid | ✅ | Native | Grid v1 uses 12-column flexbox system |
| CSS Grid based | ✅ | Native | Grid2 component uses CSS Grid |
| Flexbox based | ✅ | Native | Grid v1 component uses flexbox |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | xs, sm, md, lg, xl props |
| Responsive sizing | ✅ | Native | `xs={12} sm={6} md={4}` - different widths per breakpoint |
| Responsive spacing | ✅ | Native | `spacing={{xs: 2, md: 3}}` - different spacing per breakpoint |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Spacing prop | ✅ | Native | `spacing={2}` - applies consistent gutter between items |
| Column spacing | ✅ | Native | `columnSpacing={2}` - horizontal spacing only (Grid2) |
| Row spacing | ✅ | Native | `rowSpacing={2}` - vertical spacing only (Grid2) |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | Native | `justifyContent="center"` - flex-start, center, flex-end, space-between, space-around, space-evenly |
| Vertical alignment | ✅ | Native | `alignItems="center"` - flex-start, center, flex-end, stretch, baseline; `alignContent` for multi-row |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoint sizing | ✅ | Native | `xs`, `sm`, `md`, `lg`, `xl` props with values 1-12 or 'auto' |
| Auto sizing | ✅ | Native | `xs="auto"` - size based on content width |
| Flex grow | ✅ | Native | `xs={true}` - grow to fill available space |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | Native | Grid containers can be items in parent grids |
| Zero minimum width | ✅ | Native | `zeroMinWidth` prop - prevents content overflow |
| Fluid grids | ✅ | Native | Grids are fluid by default, filling container |

## Code Examples

### Grid v1 (Flexbox-based) - Basic Usage
```jsx
import Grid from '@mui/material/Grid';

// Container with items
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Paper>Item 2</Paper>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Paper>Item 3</Paper>
  </Grid>
</Grid>
```

### Grid v1 - Responsive Column Spans
```jsx
// 12 columns on mobile, 6 on tablet, 4 on desktop
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
</Grid>
```

### Grid v1 - Auto-layout Columns
```jsx
// Equal width columns
<Grid container spacing={2}>
  <Grid item xs>
    <Paper>Auto width 1</Paper>
  </Grid>
  <Grid item xs>
    <Paper>Auto width 2</Paper>
  </Grid>
  <Grid item xs>
    <Paper>Auto width 3</Paper>
  </Grid>
</Grid>

// Variable width based on content
<Grid container spacing={2}>
  <Grid item xs="auto">
    <Paper>Auto size</Paper>
  </Grid>
  <Grid item xs>
    <Paper>Fills remaining space</Paper>
  </Grid>
</Grid>
```

### Grid v1 - Alignment
```jsx
// Horizontal alignment
<Grid container spacing={2} justifyContent="center">
  <Grid item xs={4}>
    <Paper>Centered</Paper>
  </Grid>
</Grid>

// Vertical alignment
<Grid container spacing={2} alignItems="center" style={{minHeight: '300px'}}>
  <Grid item xs={4}>
    <Paper>Vertically centered</Paper>
  </Grid>
</Grid>

// Multiple alignment props
<Grid
  container
  spacing={2}
  justifyContent="space-between"
  alignItems="flex-start"
>
  <Grid item xs={4}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid item xs={4}>
    <Paper>Item 2</Paper>
  </Grid>
</Grid>
```

### Grid v1 - Nested Grids
```jsx
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <Paper>
      {/* Nested grid */}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Chip label="Nested 1" />
        </Grid>
        <Grid item xs={6}>
          <Chip label="Nested 2" />
        </Grid>
      </Grid>
    </Paper>
  </Grid>
  <Grid item xs={12} md={6}>
    <Paper>Regular item</Paper>
  </Grid>
</Grid>
```

### Grid v1 - Responsive Spacing
```jsx
<Grid
  container
  spacing={{ xs: 2, md: 3 }}
>
  <Grid item xs={12} sm={6}>
    <Paper>Item with responsive spacing</Paper>
  </Grid>
  <Grid item xs={12} sm={6}>
    <Paper>Item with responsive spacing</Paper>
  </Grid>
</Grid>
```

### Grid2 (CSS Grid-based) - Basic Usage
```jsx
import Grid from '@mui/material/Unstable_Grid2'; // Note: Grid2 import

// Simpler API - no container/item distinction
<Grid container spacing={2}>
  <Grid xs={12} sm={6} md={4}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid xs={12} sm={6} md={4}>
    <Paper>Item 2</Paper>
  </Grid>
  <Grid xs={12} sm={6} md={4}>
    <Paper>Item 3</Paper>
  </Grid>
</Grid>
```

### Grid2 - Column and Row Spacing
```jsx
// Different horizontal and vertical spacing
<Grid
  container
  rowSpacing={1}
  columnSpacing={2}
>
  <Grid xs={6}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid xs={6}>
    <Paper>Item 2</Paper>
  </Grid>
  <Grid xs={6}>
    <Paper>Item 3</Paper>
  </Grid>
  <Grid xs={6}>
    <Paper>Item 4</Paper>
  </Grid>
</Grid>
```

### Grid2 - Offset
```jsx
// Offset items using CSS Grid
<Grid container spacing={2}>
  <Grid xs={4} xsOffset={4}>
    <Paper>Offset by 4 columns</Paper>
  </Grid>
</Grid>
```

### Grid2 - Responsive Direction
```jsx
<Grid
  container
  direction={{ xs: 'column', sm: 'row' }}
  spacing={2}
>
  <Grid xs={12} sm={6}>
    <Paper>Item 1</Paper>
  </Grid>
  <Grid xs={12} sm={6}>
    <Paper>Item 2</Paper>
  </Grid>
</Grid>
```

### Zero Min Width (Prevent Overflow)
```jsx
// Prevents content from overflowing grid
<Grid container>
  <Grid item xs zeroMinWidth>
    <Typography noWrap>
      Very long text that would normally overflow but now gets ellipsis
    </Typography>
  </Grid>
</Grid>
```

### Complex Responsive Layout
```jsx
<Grid container spacing={3}>
  {/* Full width header */}
  <Grid item xs={12}>
    <Paper>Header</Paper>
  </Grid>

  {/* Sidebar on desktop, full width on mobile */}
  <Grid item xs={12} md={3}>
    <Paper>Sidebar</Paper>
  </Grid>

  {/* Main content */}
  <Grid item xs={12} md={9}>
    <Paper>Main Content</Paper>
  </Grid>

  {/* Three equal columns on desktop */}
  <Grid item xs={12} md={4}>
    <Paper>Column 1</Paper>
  </Grid>
  <Grid item xs={12} md={4}>
    <Paper>Column 2</Paper>
  </Grid>
  <Grid item xs={12} md={4}>
    <Paper>Column 3</Paper>
  </Grid>
</Grid>
```

## Notable Features

### Grid v1 (Flexbox-based)
- **12-column system**: Traditional grid system with 12 equal columns
- **Container/item pattern**: Clear separation between grid containers and items
- **Negative margins**: Uses negative margins on container to offset item spacing
- **Flexbox-based**: Built on CSS flexbox for maximum browser compatibility
- **Direction control**: `direction="row|column"` to control flex direction
- **Wrap control**: `wrap="nowrap|wrap|wrap-reverse"` for flex wrapping

### Grid v2 (CSS Grid-based)
- **CSS Grid native**: Uses CSS Grid Layout under the hood for modern browsers
- **Simpler API**: No need for separate `container` and `item` props
- **Offset support**: Native `xsOffset`, `smOffset`, etc. props for column offsets
- **Row/column spacing**: Separate control for horizontal and vertical spacing
- **Better performance**: CSS Grid can be more performant for complex layouts
- **Gradual adoption**: Can use alongside Grid v1 during migration

### Common to Both
- **Responsive by default**: Mobile-first responsive design built-in
- **Theme integration**: Spacing uses theme spacing units
- **Breakpoint system**: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)
- **Auto-layout**: Support for auto-sizing and flex-grow columns
- **Nested grids**: Containers can be items in parent grids
- **sx prop support**: Full Material-UI styling system support

## Research Notes

- MUI offers two Grid implementations: Grid v1 (flexbox) and Grid2 (CSS Grid)
- Grid v1 is stable and production-ready; Grid2 was unstable but is becoming stable in recent versions
- Grid2 import path: `@mui/material/Unstable_Grid2` (check current docs for stability status)
- The 12-column system in Grid v1 is familiar to Bootstrap/Foundation users
- Grid2's CSS Grid approach is more modern but requires recent browser versions
- Spacing prop multiplies by theme spacing (default 8px), so `spacing={2}` = 16px
- The `container` prop adds negative margins in Grid v1 to offset item padding
- Grid v1 uses `item` prop to establish items; Grid2 doesn't require this
- Both support nested grids for complex layouts
- Zero minimum width is important for text truncation and preventing overflow
- Responsive props can take single values or objects: `spacing={2}` or `spacing={{xs: 2, md: 3}}`
- Grid doesn't add any default background or border - purely layout
- Works with any children, not just Material-UI components
- Official migration guide available for moving from Grid v1 to Grid2
- Grid is one of the most commonly used layout components in Material-UI
