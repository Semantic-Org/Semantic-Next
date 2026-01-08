# Ant Design - Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/grid
Status: ✅ Working
Version: Current (5.x)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Includes detailed API reference, multiple interactive demos, responsive examples, and extensive code samples covering basic to advanced use cases.

## Component Definition
- **Core purpose**: Provides a 24-column responsive grid layout system for organizing page content and creating flexible, predictable layouts. Solves the fundamental problem of arranging content in structured columns and rows with consistent spacing.
- **Mental model**: Users think of this as a flex-based container (Row) and content wrapper (Col) system where content spans 1-24 grid units. Think "spreadsheet columns" where each Col can occupy 1-24 units of width, with automatic wrapping when exceeding 24 units.
- **Semantic meaning**: Communicates structured, grid-based layout organization. Rows contain columns, columns contain content. The 24-unit system provides fine-grained control over width distribution (e.g., 8+8+8 for thirds, 6+12+6 for asymmetric layouts).

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `span={12}`, `gutter={16}`)
- **Composed**: Via composition/children (e.g., `<Row><Col></Col></Row>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Row/Column system | ✅ | Native | `<Row>` container with `<Col>` children. Only Col should be direct children of Row |
| 12-column grid | ❌ | CSS-only | Uses 24-column system instead. 12-column achievable via `span={2}` (doubles the unit) |
| CSS Grid based | ❌ | N/A | Uses Flexbox, not CSS Grid |
| Flexbox based | ✅ | Native | Built entirely on Flexbox with `display: flex` on Row |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | Native | xs (<576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px), xxl (≥1600px). Follows Bootstrap 4 media queries |
| Responsive props | ✅ | Native | Col accepts `xs`, `sm`, `md`, `lg`, `xl`, `xxl` props with number or object values (e.g., `xs={24} md={12} lg={8}`) |
| Fluid columns | ✅ | Native | Columns automatically wrap when sum exceeds 24 units. Use `flex` prop for flexible sizing |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gutter control | ✅ | Native | Row `gutter` prop accepts number, string (CSS units), object `{xs: 8, sm: 16}`, or array `[horizontal, vertical]` |
| Gap utilities | ✅ | Native | Gutter recommended at (16+8n)px intervals. Supports responsive object notation |
| Padding control | ✅ | CSS-only | Applied to content within Col, not native to grid system |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | Native | Row `justify` prop: `start`, `end`, `center`, `space-around`, `space-between`, `space-evenly` |
| Vertical alignment | ✅ | Native | Row `align` prop: `top`, `middle`, `bottom`, `stretch`. Supports responsive object (v4.24.0+) |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed spans | ✅ | Native | Col `span={number}` (1-24). `span={0}` sets `display: none` |
| Flex grow | ✅ | Native | Col `flex` prop accepts string or number (e.g., `flex="auto"`, `flex="1 1 300px"`, `flex={2}`) |
| Auto sizing | ✅ | Native | Omitting `span` or using `flex="auto"` creates auto-width columns |
| Offset | ✅ | Native | Col `offset={number}` shifts element right by N columns. Also responsive via breakpoint objects |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | Native | Row can be nested inside Col for complex layouts. Fully supported pattern |
| Column ordering | ✅ | Native | Col `order={number}` and `push`/`pull` props for reordering. `push` moves right, `pull` moves left |
| Responsive visibility | ✅ | Composed | Use `span={0}` at specific breakpoints to hide columns (e.g., `xs={0} md={6}`) |

## Code Examples

### Basic Grid
```jsx
import { Col, Row } from 'antd';

// Four equal columns (6 units each = 24 total)
<Row>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
</Row>

// Three equal columns (8 units each = 24 total)
<Row>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
</Row>

// Asymmetric layout
<Row>
  <Col span={16}>col-16 (main content)</Col>
  <Col span={8}>col-8 (sidebar)</Col>
</Row>
```

### Grid with Gutter (Spacing)
```jsx
// Fixed gutter (16px horizontal spacing)
<Row gutter={16}>
  <Col className="gutter-row" span={6}>
    <div>col-6</div>
  </Col>
  <Col className="gutter-row" span={6}>
    <div>col-6</div>
  </Col>
  <Col className="gutter-row" span={6}>
    <div>col-6</div>
  </Col>
  <Col className="gutter-row" span={6}>
    <div>col-6</div>
  </Col>
</Row>

// Horizontal and vertical gutter [horizontal, vertical]
<Row gutter={[16, 16]}>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
</Row>

// Responsive gutter (object notation)
<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
  <Col span={6}>col-6</Col>
</Row>

// Responsive horizontal and vertical gutter
<Row gutter={[16, { xs: 8, sm: 16, md: 24 }]}>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
</Row>
```

### Column Offset
```jsx
// Shift column right by 4 units (creates left margin)
<Row>
  <Col span={8}>col-8</Col>
  <Col span={8} offset={4}>col-8 offset-4</Col>
</Row>

// Center a column
<Row>
  <Col span={12} offset={6}>col-12 offset-6 (centered)</Col>
</Row>

// Multiple offsets
<Row>
  <Col span={6} offset={2}>col-6 offset-2</Col>
  <Col span={6} offset={4}>col-6 offset-4</Col>
</Row>
```

### Responsive Layout
```jsx
// Mobile: full width, Tablet: half, Desktop: third
<Row>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive Column
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive Column
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive Column
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    Responsive Column
  </Col>
</Row>

// Using object notation for complex responsive behavior
<Row>
  <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
    Mobile full-width, Desktop centered half-width
  </Col>
</Row>

// Responsive visibility (hide on mobile)
<Row>
  <Col xs={0} md={6}>Hidden on mobile</Col>
  <Col xs={24} md={18}>Always visible, adjusts width</Col>
</Row>
```

### Alignment
```jsx
// Horizontal alignment
<Row justify="start">
  <Col span={4}>col-4</Col>
  <Col span={4}>col-4</Col>
</Row>

<Row justify="center">
  <Col span={4}>col-4</Col>
  <Col span={4}>col-4</Col>
</Row>

<Row justify="end">
  <Col span={4}>col-4</Col>
  <Col span={4}>col-4</Col>
</Row>

<Row justify="space-between">
  <Col span={4}>col-4</Col>
  <Col span={4}>col-4</Col>
</Row>

<Row justify="space-around">
  <Col span={4}>col-4</Col>
  <Col span={4}>col-4</Col>
</Row>

// Vertical alignment (requires taller row)
<Row align="top" style={{ minHeight: 100 }}>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
</Row>

<Row align="middle" style={{ minHeight: 100 }}>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
</Row>

<Row align="bottom" style={{ minHeight: 100 }}>
  <Col span={8}>col-8</Col>
  <Col span={8}>col-8</Col>
</Row>
```

### Flex Layout
```jsx
// Auto-width columns
<Row>
  <Col flex="auto">flex: auto</Col>
  <Col flex="auto">flex: auto</Col>
</Row>

// Fixed and flex combination
<Row>
  <Col flex="100px">100px</Col>
  <Col flex="auto">flex: auto (fills remaining)</Col>
</Row>

// Flex ratio
<Row>
  <Col flex={2}>2 / 5</Col>
  <Col flex={3}>3 / 5</Col>
</Row>

// Complex flex value
<Row>
  <Col flex="1 1 200px">flex: 1 1 200px</Col>
  <Col flex="0 1 300px">flex: 0 1 300px</Col>
</Row>
```

### Column Ordering
```jsx
// Using order prop
<Row>
  <Col span={6} order={4}>1 col-order-4</Col>
  <Col span={6} order={3}>2 col-order-3</Col>
  <Col span={6} order={2}>3 col-order-2</Col>
  <Col span={6} order={1}>4 col-order-1</Col>
</Row>

// Using push/pull
<Row>
  <Col span={18} push={6}>col-18 push-6</Col>
  <Col span={6} pull={18}>col-6 pull-18</Col>
</Row>
```

### Nested Grid
```jsx
<Row gutter={16}>
  <Col span={12}>
    <div>Parent Column</div>
    <Row gutter={8}>
      <Col span={12}>Nested Col 1</Col>
      <Col span={12}>Nested Col 2</Col>
    </Row>
  </Col>
  <Col span={12}>
    <div>Parent Column</div>
    <Row gutter={8}>
      <Col span={8}>Nested 1</Col>
      <Col span={8}>Nested 2</Col>
      <Col span={8}>Nested 3</Col>
    </Row>
  </Col>
</Row>
```

### Wrapping Behavior
```jsx
// Columns exceeding 24 units automatically wrap to next line
<Row>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12 (wraps to new line)</Col>
  <Col span={12}>col-12</Col>
</Row>

// Disable wrapping (requires v4.8.0+)
<Row wrap={false}>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12</Col>
  <Col span={12}>col-12 (overflows without wrapping)</Col>
</Row>
```

### useBreakpoint Hook
```jsx
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const MyComponent = () => {
  const screens = useBreakpoint();

  // screens = { xs: true, sm: true, md: false, lg: false, xl: false, xxl: false }

  return (
    <div>
      Current breakpoint: {JSON.stringify(screens)}
      {screens.md && <div>Desktop View</div>}
      {screens.xs && !screens.md && <div>Mobile View</div>}
    </div>
  );
};
```

## Notable Features
- **24-column precision**: Unlike 12-column grids, offers finer-grained control over layout proportions (e.g., 5-column layouts via `span={5}`)
- **Dual gutter syntax**: Supports both simple number and array notation `[horizontal, vertical]` for two-dimensional spacing
- **Responsive objects everywhere**: Gutter, align, and all Col props support responsive object notation for breakpoint-specific values
- **Bootstrap 4 alignment**: Uses familiar justify (`start`, `center`, `space-between`) and align (`top`, `middle`, `bottom`) terminology
- **Flex prop versatility**: Col `flex` accepts CSS flex shorthand strings (`"1 1 300px"`) or simple numbers/auto
- **Zero-span hiding**: `span={0}` sets `display: none`, providing semantic responsive visibility control
- **Push/pull ordering**: In addition to CSS `order`, provides `push`/`pull` for traditional grid offset-based reordering
- **useBreakpoint hook**: Provides programmatic access to current breakpoint state for conditional rendering logic
- **Customizable breakpoints**: Theme configuration allows custom breakpoint values (v5.1.0+)

## Research Notes
- Direct access to ant.design was blocked by network restrictions, but GitHub documentation source and web search results provided comprehensive information
- The 24-column system (vs typical 12-column) is a distinctive choice, providing more flexibility at the cost of slightly more complex mental math
- Documentation emphasizes the (16+8n)px gutter recommendation for consistent spacing, aligning with 8px grid design systems
- The wrapping behavior (auto-wrap at 24 units) is intuitive but can be disabled via `wrap={false}` prop
- Framework follows Bootstrap 4 conventions for alignment and breakpoints, making migration easier for Bootstrap users
- The `flex` prop is powerful but requires understanding of CSS flexbox shorthand syntax
- Component integrates seamlessly with Ant Design's theme system for custom breakpoint definitions

