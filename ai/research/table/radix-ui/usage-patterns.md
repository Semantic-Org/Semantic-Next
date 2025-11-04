# Radix UI - Table Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://www.radix-ui.com/themes/docs/components/table
Status: ✅ Working

## Documentation Quality
Good - Clear structure and API documentation with live examples, but lacks advanced patterns

The documentation provides clear explanations of the component structure, props, and basic usage patterns. It includes a live playground for experimentation. However, it doesn't cover advanced patterns like data loading, sorting, filtering, or state management scenarios.

## Component Definition
- **Core purpose**: A semantic HTML table component for presenting structured, tabular data with consistent styling and layout options
- **Mental model**: Compound component pattern that mirrors native HTML table structure (Root → Header/Body → Row → Cell) with enhanced styling and layout props
- **Semantic meaning**: Presents structured data in a grid format where relationships between data points are important; emphasizes proper accessibility through semantic HTML elements

## Component Architecture

### Compound Components
- **Table.Root**: Container element that groups Header and Body; accepts margin and layout props
- **Table.Header**: Column heading section (wraps `<thead>`)
- **Table.Body**: Data rows section (wraps `<tbody>`)
- **Table.Row**: Individual row container (wraps `<tr>`)
- **Table.ColumnHeaderCell**: Column header cell (wraps `<th>`)
- **Table.RowHeaderCell**: Row header cell (wraps `<th>`)
- **Table.Cell**: Standard data cell (wraps `<td>`)

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Standard text content in cells using Table.Cell |
| Custom cell rendering | ✅ | Cells accept any React children, allowing custom content |
| Row header cells | ✅ | Table.RowHeaderCell for semantic row headers |
| Column header cells | ✅ | Table.ColumnHeaderCell for semantic column headers |
| Nested/expandable rows | ❌ | Not documented |
| Action columns | ❌ | Not explicitly shown, but would work with custom cell rendering |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Simple tabular data with headers and rows |
| Data table | ✅ | Structured data presentation (users, emails, groups) |
| Tree table | ❌ | Not documented |
| Grid layout | ✅ | Standard grid structure with proper semantic HTML |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | Not documented |
| Empty | ❌ | Not documented |
| Error | ❌ | Not documented |
| Selected rows | ❌ | Not documented |
| Hover states | ⚠️ | Likely present but not explicitly documented |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Three sizes: "1" (compact), "2" (default), "3" (large) |
| Variants | ✅ | "ghost" (default, transparent) and "surface" (with backplate) |
| Bordered | ❌ | Not explicitly documented |
| Striped rows | ❌ | Not documented |
| Hoverable rows | ⚠️ | Likely supported but not explicitly shown |
| Fixed header | ❌ | Not documented |
| Fixed columns | ❌ | Not documented |
| Scrollable | ⚠️ | Layout="auto" or "fixed" suggests responsive behavior |
| Responsive | ✅ | layout prop with "auto" or "fixed" options |

## Layout & Alignment Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Cell horizontal alignment | ✅ | justify: "start" \| "center" \| "end" |
| Row vertical alignment | ✅ | align: "start" \| "center" \| "end" \| "baseline" |
| Cell width control | ✅ | width, minWidth, maxWidth props on cells |
| Cell padding control | ✅ | Standard padding props (p, px, py, pt, pr, pb, pl) |
| Table layout | ✅ | layout: "auto" \| "fixed" for CSS table-layout |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ❌ | Not documented |
| Filtering | ❌ | Not documented |
| Pagination | ❌ | Not documented |
| Row selection | ❌ | Not documented |
| Column resizing | ❌ | Not documented |
| Column reordering | ❌ | Not documented |
| Cell editing | ❌ | Not documented |

## Code Examples

### Basic Table Structure
```jsx
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    <Table.Row>
      <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
      <Table.Cell>danilo@example.com</Table.Cell>
      <Table.Cell>Developer</Table.Cell>
    </Table.Row>

    <Table.Row>
      <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
      <Table.Cell>zahra@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>

    <Table.Row>
      <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
      <Table.Cell>jasper@example.com</Table.Cell>
      <Table.Cell>Developer</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Size Variations
```jsx
<Flex direction="column" gap="5" maxWidth="350px">
  {/* Compact size */}
  <Table.Root size="1">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
        <Table.Cell>danilo@example.com</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
        <Table.Cell>zahra@example.com</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>

  {/* Default size */}
  <Table.Root size="2">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
        <Table.Cell>danilo@example.com</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
        <Table.Cell>zahra@example.com</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>

  {/* Large size */}
  <Table.Root size="3">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
        <Table.Cell>danilo@example.com</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
        <Table.Cell>zahra@example.com</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
</Flex>
```

### Surface Variant (With Backplate)
```jsx
<Table.Root variant="surface">
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    <Table.Row>
      <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
      <Table.Cell>danilo@example.com</Table.Cell>
      <Table.Cell>Developer</Table.Cell>
    </Table.Row>

    <Table.Row>
      <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
      <Table.Cell>zahra@example.com</Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>

    <Table.Row>
      <Table.RowHeaderCell>Jasper Eriksson</Table.RowHeaderCell>
      <Table.Cell>jasper@example.com</Table.Cell>
      <Table.Cell>Developer</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## API Reference Summary

### Table.Root Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | "1" \| "2" \| "3" | "2" | Controls text size and cell padding |
| variant | "ghost" \| "surface" | "ghost" | Visual style; surface adds background |
| layout | "auto" \| "fixed" | - | CSS table-layout behavior |

### Table.Cell / Table.ColumnHeaderCell / Table.RowHeaderCell Props
| Prop | Type | Description |
|------|------|-------------|
| justify | "start" \| "center" \| "end" | Horizontal content alignment |
| width | string | Cell width |
| minWidth | string | Minimum cell width |
| maxWidth | string | Maximum cell width |
| p, px, py, pt, pr, pb, pl | spacing | Padding controls |

### Table.Row Props
| Prop | Type | Description |
|------|------|-------------|
| align | "start" \| "center" \| "end" \| "baseline" | Vertical content alignment |

## Notable Features
- **Semantic HTML foundation**: Built on native table elements (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`) for proper accessibility
- **Compound component pattern**: Clear, composable API that mirrors HTML structure
- **Flexible cell content**: Cells accept any React children, enabling custom rendering
- **Row and column headers**: Separate components (RowHeaderCell, ColumnHeaderCell) for proper semantic markup
- **Consistent with design system**: Uses "justify" for horizontal alignment, matching other Radix layout components
- **Fine-grained control**: Separate alignment and width controls at cell level
- **Responsive layout options**: layout prop provides CSS table-layout control

## Research Notes

### Strengths
1. **Clean API**: The compound component pattern is intuitive and maps directly to HTML table structure
2. **Semantic correctness**: Proper use of `<th>` for headers (both row and column) improves accessibility
3. **Flexible styling**: Size, variant, and spacing props provide good baseline customization
4. **Layout control**: justify/align props offer fine-grained control over content positioning

### Limitations
1. **No interactive patterns**: Missing documentation for sorting, filtering, selection, pagination
2. **No state examples**: Loading, empty, and error states not covered
3. **No data patterns**: No guidance on mapping data arrays to rows
4. **Basic feature set**: Appears to be a styled semantic table rather than a full data table component
5. **No advanced layout**: Fixed header, sticky columns, scrolling not documented

### Framework Approach
Radix UI's Table component takes a **presentational approach**:
- Focuses on styling and layout of semantic HTML tables
- Leaves data management, interactivity, and state to the developer
- Acts as a styling/theming layer over native table elements
- Not attempting to be a "data grid" or "data table" component

This aligns with Radix UI's general philosophy of providing unstyled primitives (via @radix-ui/primitives) and styled components (via Radix Themes) that developers compose together.

### Comparison Notes
- **More basic than** Material-UI Table or Ant Design Table (which include sorting, pagination, selection)
- **Similar to** Chakra UI Table (presentational styling layer)
- **Compound component pattern** is similar to many modern React table implementations
- **Semantic HTML first** approach is a strength for accessibility

### Implementation Observations
1. The component emphasizes **composition over configuration**
2. Uses React component nesting rather than data props (no "columns" or "dataSource" props)
3. Developer manually maps data to JSX rather than using declarative data binding
4. This provides flexibility but requires more boilerplate for common patterns

### Migration Considerations
For teams migrating from other table libraries:
- Need to implement sorting/filtering logic separately
- Need to build pagination if required
- Need to handle row selection state manually
- Cell customization is straightforward (just render React children)
- More verbose than data-driven table APIs but more flexible

## Accessibility Notes
- Proper semantic HTML structure (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- Separate ColumnHeaderCell and RowHeaderCell for proper `<th>` usage
- Scope attributes likely handled by the component (not shown in examples)
- This foundation should provide good screen reader support

## Use Case Suitability

### Well-suited for:
- Simple data tables with 2-10 columns
- Static or mostly-static tabular content
- Tables where custom cell rendering is important
- Projects already using Radix Themes
- Situations where accessibility via semantic HTML is prioritized

### Less suited for:
- Large datasets requiring virtualization
- Tables requiring built-in sorting, filtering, pagination
- Complex data grids with many interactive features
- Use cases requiring row selection, bulk actions
- Tables needing fixed headers or columns with scrolling

## Documentation Accessibility
- Live playground available for experimentation
- Clear prop documentation in table format
- Code examples are clear and copy-pasteable
- Missing: TypeScript prop types, advanced examples, migration guides
