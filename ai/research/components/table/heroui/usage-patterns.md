# HeroUI - Table Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://www.heroui.com/docs/components/table
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Excellent documentation with detailed props reference, multiple usage examples, accessibility coverage, and integration patterns for sorting, pagination, and virtualization.

## Component Definition
- **Core purpose**: Displays tabular data using rows and columns, enabling users to quickly scan, sort, compare, and take action on large amounts of data
- **Mental model**: A structured grid system for organizing data with built-in support for selection, sorting, and dynamic content rendering
- **Semantic meaning**: Represents structured data relationships in a scannable, organized format with interactive capabilities

## Architecture
HeroUI exports six table-related components that work together:
- **Table**: Main container component
- **TableHeader**: Header section wrapper
- **TableBody**: Body section containing data rows
- **TableColumn**: Column definitions
- **TableRow**: Individual row elements
- **TableCell**: Cell content containers

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Direct text/data in TableCell components |
| Custom cell rendering | ✅ | Render functions in TableBody to customize cell content based on column key - enables formatted data, icons, badges, and interactive elements |
| Nested/expandable rows | ❌ | Not documented - would require custom implementation |
| Action columns | ✅ | Custom cell rendering supports action buttons, dropdowns, and interactive elements in cells |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Static table | ✅ | Hardcoded rows using TableRow and TableCell children directly |
| Dynamic table | ✅ | Using `columns` and `items` props with render functions - automatically caches results and avoids re-rendering all items when only one changes |
| Data table | ✅ | Full data table with sorting, pagination, selection, and async loading |
| Tree table | ❌ | Not documented |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | `isLoading` prop on TableBody, `loadingState` for stages, `loadingContent` for custom UI |
| Empty | ✅ | `emptyContent` prop on TableBody to display custom message/UI when no rows exist |
| Error | ❌ | Not explicitly documented - would use custom emptyContent or loadingContent |
| Selected rows | ✅ | Controlled via `selectedKeys` Set and `onSelectionChange` callback, styled with `data-selected` attribute |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `isCompact` reduces padding, `radius` prop for border radius (size variants) |
| Bordered | ✅ | Controlled via slots customization and wrapper styling |
| Striped rows | ✅ | `isStriped` prop for alternating row colors |
| Hoverable rows | ✅ | Built-in hover states, styled via `data-hover` attribute |
| Fixed header | ✅ | `isHeaderSticky` keeps header visible on scroll |
| Fixed columns | ❌ | Not documented |
| Scrollable | ✅ | Wrapper handles overflow, works with sticky headers |
| Responsive | ❌ | Not explicitly documented - would require custom implementation |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ✅ | `allowsSorting` on columns, `sortDescriptor` prop, `onSortChange` callback, custom `sortIcon` support. Recommends using `useAsyncList` hook from "@react-stately/data" |
| Filtering | ❌ | Not built-in - would implement via external controls that filter items array |
| Pagination | ✅ | Integration with separate Pagination component, or infinite scroll using `useAsyncList` and "@heroui/use-infinite-scroll" hooks |
| Row selection | ✅ | `selectionMode`: "none", "single", "multiple" with checkboxes, controlled via `selectedKeys`/`onSelectionChange` |
| Column resizing | ❌ | Not documented |
| Column reordering | ❌ | Not documented |
| Cell editing | ❌ | Not built-in - would implement via custom cell rendering with input components |

## Additional Features
| Feature | Present | Details |
|---------|---------|---------|
| Virtualization | ✅ | `isVirtualized` prop for large datasets, built on "@tanstack/react-virtual", requires `maxTableHeight` (default 600) and optional `rowHeight` (default 40) |
| Disabled rows | ✅ | `disabledKeys` prop prevents selection of specific rows, styled with `data-disabled` attribute |
| Row actions | ✅ | `onRowAction` callback triggered by clicking rows (toggle mode) or double-clicking (replace mode) |
| Hide header | ✅ | `hideHeader` prop to hide column headers |
| Color variants | ✅ | `color` prop for visual color schemes |
| Shadow variants | ✅ | `shadow` prop for depth control |
| Layout modes | ✅ | `layout`: "auto" (default) or "fixed" for column width behavior |

## Key Props Reference

### Table Props
```typescript
{
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  layout?: "auto" | "fixed";
  radius?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  isVirtualized?: boolean;
  hideHeader?: boolean;
  isStriped?: boolean;
  isCompact?: boolean;
  isHeaderSticky?: boolean;
  removeWrapper?: boolean;
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Set<Key>;
  disabledKeys?: Set<Key>;
  sortDescriptor?: SortDescriptor;
  onSelectionChange?: (keys: Set<Key>) => void;
  onSortChange?: (descriptor: SortDescriptor) => void;
}
```

### TableColumn Props
```typescript
{
  align?: "start" | "center" | "end"; // default: "start"
  allowsSorting?: boolean;
  sortIcon?: ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
}
```

### TableBody Props
```typescript
{
  items?: Iterable<T>;
  isLoading?: boolean;
  loadingState?: LoadingState;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
  onLoadMore?: () => void;
}
```

## Code Examples

### Basic Static Table
```jsx
<Table aria-label="Example static collection table">
  <TableHeader>
    <TableColumn>NAME</TableColumn>
    <TableColumn>ROLE</TableColumn>
    <TableColumn>STATUS</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow key="1">
      <TableCell>Tony Reichert</TableCell>
      <TableCell>CEO</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
    <TableRow key="2">
      <TableCell>Zoey Lang</TableCell>
      <TableCell>Technical Lead</TableCell>
      <TableCell>Paused</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Dynamic Table with Custom Rendering
```jsx
const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const users = [
  { id: 1, name: "Tony Reichert", role: "CEO", status: "active" },
  { id: 2, name: "Zoey Lang", role: "Technical Lead", status: "paused" },
];

<Table aria-label="Example table with dynamic content">
  <TableHeader columns={columns}>
    {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
  </TableHeader>
  <TableBody items={users}>
    {(item) => (
      <TableRow key={item.id}>
        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>
```

### Table with Selection
```jsx
const [selectedKeys, setSelectedKeys] = useState(new Set());

<Table
  aria-label="Example table with multiple selection"
  selectionMode="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
>
  <TableHeader>
    <TableColumn>NAME</TableColumn>
    <TableColumn>ROLE</TableColumn>
  </TableHeader>
  <TableBody items={users}>
    {(item) => (
      <TableRow key={item.id}>
        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>
```

### Table with Sorting
```jsx
const [sortDescriptor, setSortDescriptor] = useState({
  column: "name",
  direction: "ascending",
});

<Table
  aria-label="Example table with client side sorting"
  sortDescriptor={sortDescriptor}
  onSortChange={setSortDescriptor}
>
  <TableHeader>
    <TableColumn key="name" allowsSorting>NAME</TableColumn>
    <TableColumn key="role" allowsSorting>ROLE</TableColumn>
    <TableColumn key="status">STATUS</TableColumn>
  </TableHeader>
  <TableBody items={sortedItems}>
    {(item) => (
      <TableRow key={item.id}>
        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>
```

### Table with Loading State
```jsx
<Table aria-label="Example table with loading state">
  <TableHeader>
    <TableColumn>NAME</TableColumn>
    <TableColumn>ROLE</TableColumn>
  </TableHeader>
  <TableBody
    items={users}
    isLoading={isLoading}
    loadingContent={<Spinner />}
  >
    {(item) => (
      <TableRow key={item.id}>
        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>
```

### Table with Empty State
```jsx
<Table aria-label="Example empty table">
  <TableHeader>
    <TableColumn>NAME</TableColumn>
    <TableColumn>ROLE</TableColumn>
  </TableHeader>
  <TableBody
    items={[]}
    emptyContent={"No rows to display."}
  >
    {(item) => (
      <TableRow key={item.id}>
        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>
```

### Virtualized Table
```jsx
<Table
  aria-label="Example table with virtualization"
  isVirtualized
  maxTableHeight={600}
  rowHeight={40}
>
  <TableHeader>
    <TableColumn>NAME</TableColumn>
    <TableColumn>EMAIL</TableColumn>
  </TableHeader>
  <TableBody items={largeDataset}>
    {(item) => (
      <TableRow key={item.id}>
        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>
```

## Styling and Customization

### Data Attributes for Styling
Available for targeting specific states:
- `data-selected`: Selected rows
- `data-disabled`: Disabled rows
- `data-hover`: Hovered rows
- `data-focus-visible`: Keyboard-focused rows
- `data-first`, `data-middle`, `data-last`: Row position indicators
- `data-odd`: Odd-numbered rows

### Slots System
Comprehensive slot system for deep customization:
- `base`: Flex layout container
- `wrapper`: Outer padding and styling
- `table`: Table element sizing
- `thead`/`tbody`/`tfoot`: Section styling
- `tr`/`th`/`td`: Row and cell styling
- `sortIcon`: Sort indicator appearance
- `emptyWrapper`: Empty state styling
- `loadingWrapper`: Loading state positioning

## Accessibility Features
- **ARIA grid semantics**: Proper ARIA roles and attributes
- **Keyboard navigation**: Arrow keys for cell/row navigation
- **Screen reader support**: Announcements for selection, sorting, and state changes
- **Row headers**: Proper semantic marking of header cells
- **Typeahead search**: Quick navigation by typing

## Integration Patterns

### Async Data Loading
Documentation recommends using `useAsyncList` hook from "@react-stately/data" for managing:
- Sort logic
- Filter logic
- Pagination
- Async data fetching

### Infinite Scrolling
Use "@heroui/use-infinite-scroll" hook combined with `useAsyncList` for implementing infinite scroll pagination.

### Virtualization
Built on "@tanstack/react-virtual" for high-performance rendering of large datasets. Automatically renders only visible rows.

## Notable Features

1. **React Aria Integration**: Built on React Aria's collection system for robust handling of dynamic content, selection, and keyboard navigation

2. **Performance Optimization**:
   - Automatic caching with items prop to avoid unnecessary re-renders
   - Virtualization support for massive datasets
   - Optimized render functions

3. **Flexible Selection Model**:
   - Single and multiple selection modes
   - Controlled selection state
   - Disabled rows
   - Row action callbacks

4. **Sorting Infrastructure**:
   - Built-in sort UI
   - Custom sort icons
   - Integration with async data management

5. **State Management**:
   - Loading states with custom content
   - Empty states with custom content
   - Comprehensive data attributes for styling different states

6. **Sticky Headers**: Simple boolean prop for fixed headers on scroll

7. **Composable Architecture**: Six separate components that work together, allowing fine-grained control

## Research Notes

### Access
- Documentation loaded successfully without issues
- Comprehensive and well-structured documentation

### Implementation Approach
HeroUI takes a composable approach with separate components for each table part, similar to headless UI libraries but with built-in styling. The tight integration with React Aria provides robust accessibility and keyboard navigation out of the box.

### Unique Aspects
- Strong emphasis on performance with virtualization and render optimization
- Excellent integration hooks (`useAsyncList`, `use-infinite-scroll`)
- Data attribute system for state-based styling
- Comprehensive slots system for deep customization
- Built-in support for common patterns (sorting, selection, pagination)

### Missing Features
- No built-in filtering UI (expected to implement externally)
- No column resizing or reordering
- No built-in cell editing
- No tree/hierarchical table support
- No responsive table patterns documented
- No fixed columns (horizontal scrolling with pinned columns)

### Design Philosophy
HeroUI provides a "batteries included" approach with sensible defaults while maintaining flexibility through slots and data attributes. The component is optimized for common use cases (basic tables, data tables with sorting/selection) rather than trying to cover every edge case.
