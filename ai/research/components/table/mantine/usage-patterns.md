# Mantine - Table Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://mantine.dev/core/table/
Status: ⚠️ Unable to fetch directly (network/security restrictions)

**Note**: This report is based on web search results and available documentation snippets. Direct access to the Mantine documentation website was blocked by network restrictions. Some details may be incomplete.

## Documentation Quality
Good - Based on search results, Mantine provides comprehensive documentation with clear examples and API references, though full assessment was limited by access restrictions.

## Component Definition
- **Core purpose**: Provides a styled HTML table component with optional features like striping, hover effects, scrolling, and sticky headers. Part of a two-tier approach: basic Table component for simple use cases, and Mantine React Table library for advanced data table functionality.
- **Mental model**: Semantic HTML table wrapper with progressive enhancement - start with a simple styled table, add features as needed, or upgrade to full data table library for complex requirements.
- **Semantic meaning**: Represents tabular data with proper HTML semantics (table, thead, tbody, tr, td, th) enhanced with styling and optional interactive features.

## Architecture Approach

### Two-Tier System
Mantine provides two distinct table solutions:

1. **@mantine/core Table Component**
   - Basic styled table component
   - Focuses on presentation and simple enhancements
   - Minimal JavaScript, mostly CSS-driven
   - Suitable for static or simple tables

2. **Mantine React Table** (separate library)
   - Advanced data table library
   - Built on top of @mantine/core
   - Full-featured: sorting, filtering, pagination, row selection, etc.
   - Suitable for complex data-driven applications

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Standard table cells with semantic HTML (td, th) |
| Custom cell rendering | ✅ | Support for custom content via React components (Mantine React Table) |
| Nested/expandable rows | ✅ | Row expansion feature in Mantine React Table |
| Action columns | ✅ | Can be implemented with custom cell rendering |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Core Table component for simple use cases |
| Data table | ✅ | Mantine React Table library for advanced data tables |
| Tree table | ⚠️ | Not explicitly mentioned in available documentation |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ⚠️ | Not explicitly mentioned in basic Table docs |
| Empty | ⚠️ | Not explicitly mentioned in basic Table docs |
| Error | ⚠️ | Not explicitly mentioned in basic Table docs |
| Selected rows | ✅ | Available in Mantine React Table |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Controlled via `horizontalSpacing` and `verticalSpacing` props (theme spacing values or pixel numbers) |
| Bordered | ✅ | Table borders can be configured |
| Striped rows | ✅ | `striped` prop for alternating row colors |
| Hoverable rows | ✅ | `highlightOnHover` prop highlights rows on hover |
| Fixed header | ✅ | Sticky header support with `stickyHeaderOffset` prop |
| Fixed columns | ✅ | Column pinning available in Mantine React Table |
| Scrollable | ✅ | `Table.ScrollContainer` with `minWidth` prop for viewport overflow |
| Responsive | ✅ | Scroll container provides responsive behavior |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ✅ | Available in Mantine React Table |
| Filtering | ✅ | Available in Mantine React Table |
| Pagination | ✅ | Available in Mantine React Table |
| Row selection | ✅ | Available in Mantine React Table |
| Column resizing | ✅ | Available in Mantine React Table |
| Column reordering | ✅ | Column ordering/reordering in Mantine React Table |
| Cell editing | ⚠️ | Not explicitly mentioned, but likely possible with custom cell rendering |

## Code Examples

### Basic Table Structure (Conceptual)
```jsx
import { Table } from '@mantine/core';

function Demo() {
  return (
    <Table
      striped
      highlightOnHover
      horizontalSpacing="md"
      verticalSpacing="xs"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Header 1</Table.Th>
          <Table.Th>Header 2</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Cell 1</Table.Td>
          <Table.Td>Cell 2</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
```

### Scrollable Table
```jsx
import { Table } from '@mantine/core';

function Demo() {
  return (
    <Table.ScrollContainer minWidth={500}>
      <Table>
        {/* table content */}
      </Table>
    </Table.ScrollContainer>
  );
}
```

### Mantine React Table (Advanced)
```jsx
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';

function DataTable() {
  // IMPORTANT: columns and data must be memoized or stable
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ], []);

  const data = useMemo(() => [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' },
  ], []);

  const table = useMantineReactTable({
    columns,
    data,
    // Additional options for sorting, filtering, pagination, etc.
  });

  return <MantineReactTable table={table} />;
}
```

### Customization with Props
```jsx
// Props can be passed as objects or callback functions
const table = useMantineReactTable({
  columns,
  data,
  // As object
  mantineTableProps: {
    striped: true,
    highlightOnHover: true,
  },
  // As callback function with access to table instance
  mantineTableBodyRowProps: ({ row }) => ({
    onClick: () => console.log(row.original),
    sx: { cursor: 'pointer' },
  }),
});
```

## Notable Features

### Component Composition
- **Nested Component Pattern**: Uses `Table.Thead`, `Table.Tbody`, `Table.Tr`, `Table.Td`, `Table.Th` for semantic structure
- **Scroll Container**: Separate `Table.ScrollContainer` wrapper component for overflow handling

### Styling Features
- **Tabular Numbers**: `tabularNums` prop sets `font-variant-numeric: tabular-nums` for aligned numerical columns
- **Caption Positioning**: `captionSide` prop controls table caption placement (top/bottom)
- **Flexible Spacing**: Supports both theme tokens and pixel values for spacing

### Performance Considerations
- **Critical Performance Pattern**: Columns and data MUST be memoized or stable to prevent unnecessary re-renders
- **Memoization Required**: Use `useState`, `useMemo`, or define outside component to ensure stability

### Two-Library Approach
- **Separation of Concerns**: Basic Table for presentation, Mantine React Table for data management
- **Progressive Enhancement**: Start simple, upgrade when needed
- **Mantine Component Integration**: All `mantine...Props` get forwarded to underlying Mantine components

### Conditional Logic Support
- **Callback Props**: Props can be functions receiving `{ table, cell, row, column }` parameters
- **Dynamic Customization**: Enables conditional styling and behavior based on data

## Research Notes

### Access Limitations
- Direct access to https://mantine.dev/core/table/ was blocked by network/security restrictions
- Report compiled from web search results and documentation snippets
- Some details may be incomplete or require verification

### Observations
1. **Pragmatic Design**: Two-tier approach (basic + advanced) is practical and user-friendly
2. **React-Specific**: Both components are React-only (JSX, hooks, component composition)
3. **Performance-Conscious**: Explicit warnings about memoization suggest community learning from performance issues
4. **Extensive Customization**: Forwarding of Mantine component props shows commitment to flexibility
5. **Semantic HTML**: Maintains proper table semantics despite being React components

### Documentation Structure
- Appears well-organized with separate docs for basic and advanced table features
- GitHub discussions suggest active community and ongoing feature development
- Multiple documentation versions maintained (v2, v5, current)

### Comparison Points for Semantic UI

#### Similarities Possible
- Progressive enhancement approach (basic → advanced)
- Semantic HTML structure
- Flexible styling system
- Performance considerations

#### Differences to Note
- Mantine is React-specific vs Semantic UI's web standards approach
- Two separate libraries vs single component with variations
- Heavy reliance on React hooks and JSX
- Requires memoization patterns for performance

### Missing Information
Due to access restrictions, the following details could not be verified:
- Exact prop APIs and TypeScript definitions
- Complete code examples from documentation
- Visual examples and design patterns
- Accessibility features and ARIA attributes
- Theming and customization details
- Error handling patterns
- Loading state implementations
- Empty state patterns

### Recommended Follow-up
If full access to documentation becomes available:
1. Review complete prop APIs
2. Examine accessibility implementation
3. Study theming system integration
4. Analyze performance optimization patterns
5. Review testing approaches
6. Examine TypeScript type definitions

## Conclusion

Mantine's Table component demonstrates a pragmatic two-tier approach: a simple styled table for basic use cases and a comprehensive data table library for complex scenarios. The emphasis on memoization and performance, extensive customization through prop forwarding, and semantic HTML structure are notable patterns. However, the React-specific implementation (hooks, JSX, component composition) represents a different architectural philosophy compared to web standards-based approaches.

The separation between basic and advanced table functionality may offer insights for component taxonomy and progressive feature disclosure in other frameworks.
