# Chakra UI - Table Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://www.chakra-ui.com/docs/components/table (v3)
https://v2.chakra-ui.com/docs/components/table (v2)
Status: ⚠️ Mixed - Main site has accessibility issues, v2 docs accessible

**Note**: Chakra UI is transitioning between v2 and v3. The component architecture has changed significantly between versions. v3 uses a more modular composition pattern with `Table.Root`, `Table.Header`, `Table.Body`, etc., while v2 uses traditional imports like `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`.

## Documentation Quality
**Good** - Clear component structure with examples, though access was limited during research. Documentation shows comprehensive prop tables, variants, and theming information. Examples demonstrate both basic tables and integration with advanced libraries like React Table. Web search results indicate extensive third-party tutorials and guides exist.

## Component Definition
- **Core purpose**: Display tabular data in a structured, accessible format with built-in styling and theming support
- **Mental model**: A semantic HTML table wrapper that integrates with Chakra UI's design system, providing consistent styling and accessibility while maintaining native table behavior
- **Semantic meaning**: Presents structured data in rows and columns with proper ARIA attributes for screen readers and keyboard navigation

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Standard `<td>` elements with theme styling (padding, borders, font sizing) |
| Custom cell rendering | ✅ | Cells can contain any React components/content via composition |
| Nested/expandable rows | ⚠️ | Not built-in, but achievable through composition patterns |
| Action columns | ✅ | Support for buttons, icons, and interactive elements in cells via composition |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Simple data display with thead, tbody, rows, and cells |
| Data table | ✅ | Integration with React Table library for advanced features |
| Tree table | ⚠️ | Not explicitly documented, likely requires third-party integration |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | Skeleton components available for async data loading states |
| Empty | ⚠️ | Not built-in, implemented through conditional rendering |
| Error | ⚠️ | Not built-in, handled at application level |
| Selected rows | ✅ | Support via `aria-selected` attribute with background color change to `color-palette-subtle` |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Three sizes: `sm`, `md` (default), `lg` - controls padding and font size |
| Bordered | ✅ | Customizable via `borderColor`, `borderWidth` props on container |
| Striped rows | ✅ | `striped` variant available for alternating row colors |
| Hoverable rows | ⚠️ | Achievable via theme customization or style props |
| Fixed header | ⚠️ | Requires manual implementation with sticky positioning |
| Fixed columns | ⚠️ | Requires manual implementation or third-party solution |
| Scrollable | ✅ | `TableContainer` component provides automatic horizontal scrolling on overflow |
| Responsive | ✅ | TableContainer enables horizontal scroll on small screens; supports Chakra's responsive props |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ✅ | Via React Table integration - not built-in to base component |
| Filtering | ✅ | Via React Table integration - not built-in to base component |
| Pagination | ✅ | Via React Table integration - not built-in to base component |
| Row selection | ✅ | Checkbox integration shown in examples with action bars for bulk operations |
| Column resizing | ⚠️ | Via React Table integration or manual implementation |
| Column reordering | ⚠️ | Via React Table integration or manual implementation |
| Cell editing | ⚠️ | Not documented, requires custom implementation |

## Code Examples

### Basic Table (v2 API)
```jsx
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer
} from '@chakra-ui/react'

function BasicTable() {
  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>Product inventory</TableCaption>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th isNumeric>Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Laptop</Td>
            <Td>Electronics</Td>
            <Td isNumeric>$999</Td>
          </Tr>
          <Tr>
            <Td>Mouse</Td>
            <Td>Accessories</Td>
            <Td isNumeric>$25</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th isNumeric>Price</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  )
}
```

### Modular Table (v3 API)
```jsx
import { Table } from "@chakra-ui/react"

function ModularTable() {
  return (
    <Table.Root variant='simple'>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Product</Table.ColumnHeader>
          <Table.ColumnHeader>Category</Table.ColumnHeader>
          <Table.ColumnHeader textAlign='end'>Price</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Laptop</Table.Cell>
          <Table.Cell>Electronics</Table.Cell>
          <Table.Cell textAlign='end'>$999</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  )
}
```

### Striped Variant
```jsx
<Table variant='striped' colorScheme='teal'>
  <Thead>
    <Tr>
      <Th>Name</Th>
      <Th>Email</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>John Doe</Td>
      <Td>john@example.com</Td>
    </Tr>
    <Tr>
      <Td>Jane Smith</Td>
      <Td>jane@example.com</Td>
    </Tr>
  </Tbody>
</Table>
```

### Size Variants
```jsx
// Small table
<Table size='sm'>
  {/* ... */}
</Table>

// Medium table (default)
<Table size='md'>
  {/* ... */}
</Table>

// Large table
<Table size='lg'>
  {/* ... */}
</Table>
```

### With TableContainer (Overflow Handling)
```jsx
<TableContainer>
  <Table variant='simple' size='md'>
    <Thead>
      <Tr>
        <Th>Column 1</Th>
        <Th>Column 2</Th>
        <Th>Column 3</Th>
        <Th>Column 4</Th>
        <Th>Column 5</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>Data 1</Td>
        <Td>Data 2</Td>
        <Td>Data 3</Td>
        <Td>Data 4</Td>
        <Td>Data 5</Td>
      </Tr>
    </Tbody>
  </Table>
</TableContainer>
```

### Numeric Alignment
```jsx
<Table>
  <Thead>
    <Tr>
      <Th>Item</Th>
      <Th isNumeric>Quantity</Th>
      <Th isNumeric>Price</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Widget</Td>
      <Td isNumeric>12</Td>
      <Td isNumeric>$45.00</Td>
    </Tr>
  </Tbody>
</Table>
```

### With React Table Integration (Sortable)
```jsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'

function SortableTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map(headerGroup => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Th key={header.id}>
                {header.column.columnDef.header}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map(row => (
          <Tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Td key={cell.id}>
                {cell.getValue()}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
```

### Custom Styling
```jsx
<Table
  variant='striped'
  colorScheme='blue'
  borderRadius='lg'
  overflow='hidden'
>
  {/* ... */}
</Table>

<TableContainer
  border='1px'
  borderColor='gray.200'
  borderRadius='md'
  boxShadow='sm'
>
  <Table>
    {/* ... */}
  </Table>
</TableContainer>
```

## Component Props Reference (v2)

### Table
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'simple' \| 'striped' \| 'unstyled'` | `'simple'` | Visual style variant of the table |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of table elements (padding, font size) |
| `colorScheme` | `string` | — | Color scheme for striped variant |

### Th (Table Header)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isNumeric` | `boolean` | `false` | Right-aligns content for numeric data |

### Td (Table Data Cell)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isNumeric` | `boolean` | `false` | Right-aligns content for numeric data |

### TableContainer
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All standard Chakra style props | — | — | Wraps table to provide overflow handling |

## Notable Features

### 1. Multi-Part Component System (v2)
Chakra UI's table is a multi-part component requiring styling on each sub-component:
- Table (root)
- Thead, Tbody, Tfoot (sections)
- Tr (rows)
- Th, Td (cells)
- TableCaption (caption)

### 2. Modular Composition Pattern (v3)
v3 introduces a more React-like component composition with dot notation:
- `Table.Root`
- `Table.Header`, `Table.Body`, `Table.Footer`
- `Table.Row`
- `Table.ColumnHeader`, `Table.Cell`

### 3. TableContainer Component
Dedicated wrapper component that:
- Prevents table overflow
- Enables horizontal scrolling on small screens
- Prevents data content line breaks
- Can be styled independently (borders, shadows, etc.)

### 4. Responsive Behavior
- TableContainer automatically adds horizontal scroll on small screens
- Full support for Chakra's responsive prop syntax
- Can hide columns based on breakpoints using Chakra's `display` props

### 5. Accessibility First
- Proper semantic HTML (`<table>`, `<thead>`, `<tbody>`, etc.)
- ARIA attributes for selection states (`aria-selected`)
- Keyboard navigation support
- Screen reader friendly structure

### 6. Theming System
Tables integrate deeply with Chakra's theme system:
- Customizable via `extendTheme`
- Component-specific theme overrides
- Color scheme variants
- Size variants

### 7. React Table Integration
Official documentation includes examples of integrating with TanStack React Table (formerly React Table) for:
- Sorting
- Filtering
- Pagination
- Complex data operations

### 8. Style Props Support
All table components accept standard Chakra style props:
- Spacing (`p`, `m`, `px`, `py`, etc.)
- Colors (`bg`, `color`, `borderColor`)
- Layout (`display`, `width`, `height`)
- Borders (`border`, `borderRadius`, `borderWidth`)

## Implementation Details Worth Noting

### Semantic HTML Foundation
Uses native HTML table elements, ensuring:
- Proper accessibility without additional work
- Standard browser behavior
- SEO-friendly structure
- Native keyboard navigation

### CSS-Based Styling
- Font size controlled via CSS custom properties: `var(--chakra-font-sizes-sm)`
- Border styling uses standard border properties
- Padding uses Chakra's spacing scale
- Color values from theme palette

### Border Spacing Control
Special props for controlling table border spacing:
- `borderSpacing` - Controls both horizontal and vertical spacing
- `borderSpacingX` - Controls horizontal spacing only (requires `borderSpacing='auto'`)
- Only applies when `border-collapse` is set to `separate`

### Composition Over Configuration
Like other Chakra components:
- Complex features built through composition
- Minimal built-in complexity
- Flexibility through React component patterns
- Integration with other Chakra components (Stack, Box, etc.)

## Research Notes

### Documentation Access Issues
- Main chakra-ui.com had network/security restrictions during research
- v2 documentation (v2.chakra-ui.com) also restricted
- Information compiled from web search results and limited web fetch data
- Third-party resources (GeeksforGeeks, CodingEasyPeasy, etc.) provide additional context

### Framework Transition (v2 → v3)
Chakra UI is in active transition:
- v2 uses traditional component imports
- v3 uses dot notation composition pattern
- API surface area remains similar
- Migration path appears straightforward

### Philosophy & Approach
Chakra UI emphasizes:
- **Accessibility first** - ARIA attributes, semantic HTML, keyboard nav
- **Theme-driven design** - Minimal inline props, max theme customization
- **Composition patterns** - Build complex from simple primitives
- **Developer experience** - TypeScript support, comprehensive docs, active community

### Integration Ecosystem
Strong integration story:
- TanStack React Table for advanced features
- Horizon UI provides extended table components
- Refine.dev shows data grid patterns
- CodeSandbox has numerous community examples

## Patterns to Consider for Semantic UI

### Strengths to Adopt
1. **TableContainer pattern** - Dedicated wrapper for overflow handling is elegant and reusable
2. **Numeric alignment** - Simple `isNumeric` prop is clear and semantic
3. **Size variants** - Three-size system (sm, md, lg) covers most use cases
4. **Variant system** - Clear variants (simple, striped, unstyled) with good defaults
5. **React Table integration pattern** - Document how to integrate with advanced table libraries
6. **Accessibility foundation** - ARIA attributes for selection, semantic HTML structure

### Potential Improvements Over Chakra
1. **Built-in sorting** - Could provide basic sorting without external library
2. **Built-in pagination** - Simple pagination UI without external dependencies
3. **Built-in loading states** - Skeleton or spinner patterns built-in
4. **Built-in empty states** - Standard empty state component/pattern
5. **More granular responsive control** - Hide/show columns, stack on mobile
6. **Fixed header/column support** - Built-in sticky positioning for headers
7. **Cell editing** - Simple inline editing capabilities

### Questions for Semantic UI Table Design

#### API Design
1. Should we follow v2 (separate imports) or v3 (dot notation) pattern?
2. Do we need a separate TableContainer or build overflow handling into Table?
3. Should numeric alignment be a prop or CSS class?
4. What variants should we support (simple, striped, bordered, compact)?

#### Features
1. Should sorting/filtering/pagination be built-in or plugin-based?
2. Do we provide skeleton loading states or leave to composition?
3. Should we support fixed headers/columns out of the box?
4. How do we handle responsive behavior (scroll vs. stack vs. hide)?

#### Advanced Patterns
1. Do we need explicit integration guides for TanStack React Table?
2. Should we provide expandable row patterns?
3. Do we support row/cell selection natively?
4. Should we have built-in virtualization for large datasets?

#### Theme Integration
1. How deep should theme customization go?
2. Should we provide color scheme variants like Chakra?
3. Do we need size tokens specifically for tables?
4. How should border/spacing be controlled (props vs. theme vs. CSS)?

### Comparison with Other Frameworks
Based on research ecosystem, Chakra's approach:
- **More basic than** Ant Design or Material-UI (fewer built-in features)
- **More accessible than** most CSS frameworks (ARIA-first approach)
- **More composable than** all-in-one solutions (primitive building blocks)
- **Better DX than** unstyled libraries (sensible styled defaults)
- **Simpler than** Horizon UI or other Chakra extensions (minimal by design)

The sweet spot appears to be: semantic foundation + essential variants + external integration for advanced features.
