# PrimeReact - DataTable Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://primereact.org/datatable/
Status: ⚠️ Unable to verify (network restrictions prevented direct access)

## Documentation Quality
**Comprehensive** - Based on search results and community resources, PrimeReact provides extensive documentation with numerous examples, API references, and patterns. The documentation includes interactive showcases, code examples, and covers all major features thoroughly.

## Component Definition
- **Core purpose**: Display and manipulate tabular data with rich interactivity, supporting everything from simple data display to complex enterprise data management scenarios.
- **Mental model**: A fully-featured data grid that acts as a comprehensive data presentation and manipulation layer. Users think of it as "everything you need for tables" - from basic display to advanced features like editing, filtering, and sorting.
- **Semantic meaning**: Represents structured data in rows and columns, communicating hierarchical information (via tree tables), relationships (via expandable rows), and enabling direct data manipulation (via inline editing).

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Direct field binding via `<Column field="name" header="Name" />` |
| Custom cell rendering | ✅ | Body templates allow full customization: `body={customTemplate}` where template returns JSX |
| Nested/expandable rows | ✅ | Row expansion with `expandedRows`, `onRowToggle`, and `rowExpansionTemplate` props. Separate TreeTable component for hierarchical data |
| Action columns | ✅ | Custom templates for action buttons (edit, delete, etc.) with full event handling |
| Empty state | ✅ | `emptyMessage` prop for customizing no-data display |
| Header/footer content | ✅ | Custom header and footer sections via templating |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Standard DataTable with simple column definitions |
| Data table | ✅ | Full-featured with sorting, filtering, pagination, selection |
| Tree table | ✅ | Separate `TreeTable` component for hierarchical data with `expandedKeys` and `onToggle` |
| Grouped rows | ✅ | Row grouping with expandable groups |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | `loading` prop shows loading overlay/indicator during async operations |
| Empty | ✅ | `emptyMessage` prop for custom empty state messaging |
| Error | ⚠️ | Not explicitly documented - likely handled via custom templates or external state |
| Selected rows | ✅ | `selection` and `onSelectionChange` props with `selectionMode` options (single, multiple, checkbox, radiobutton) |
| Expanded rows | ✅ | `expandedRows` and `onRowToggle` for managing row expansion state |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `size` prop with values: small, normal, large |
| Bordered | ✅ | `showGridlines` prop displays borders between cells |
| Striped rows | ✅ | `stripedRows` prop for alternating row colors |
| Hoverable rows | ✅ | Built-in hover effects for row interactivity |
| Fixed header | ✅ | `scrollable` with `scrollHeight` creates fixed header with scrollable body |
| Fixed columns | ✅ | `frozen` prop on Column for sticky left columns, `alignFrozen="right"` for right-side frozen columns |
| Scrollable | ✅ | `scrollable` prop with `scrollHeight` for vertical scroll, `scrollDirection="both"` for horizontal |
| Responsive | ✅ | `responsiveLayout="scroll"` or `"stack"` for mobile-friendly displays |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ✅ | Column-level `sortable` prop, `sortMode="single"` or `"multiple"`, `removableSort` for clearing |
| Filtering | ✅ | Column-level `filter` prop with `filterMatchMode`, global filtering, filter templates, multiple constraints via popups |
| Pagination | ✅ | `paginator` prop with `rows`, `rowsPerPageOptions`, highly customizable `paginatorTemplate` |
| Row selection | ✅ | Multiple modes: single, multiple, checkbox, radiobutton via `selectionMode` and `selection` props |
| Column resizing | ✅ | `resizableColumns` prop with modes: `fit` (default) or `expand`, drag-to-resize functionality |
| Column reordering | ✅ | `reorderableColumns` prop enables drag-and-drop column reordering with `onColReorder` callback |
| Cell editing | ✅ | Inline editing with cell and row edit modes, custom editor templates, validation support |
| Row reordering | ✅ | `reorderableRows` prop with Column `rowReorder` property and `onRowReorder` callback |
| Virtual scrolling | ✅ | `virtualScrollerOptions` for rendering large datasets efficiently |
| Export | ✅ | Built-in CSV export functionality |

## Code Examples

### Basic DataTable with Core Features
```jsx
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const BasicExample = () => {
  const [products, setProducts] = useState([]);

  return (
    <DataTable
      value={products}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      showGridlines
      stripedRows
    >
      <Column field="code" header="Code" sortable filter />
      <Column field="name" header="Name" sortable filter />
      <Column field="category" header="Category" sortable filter />
      <Column field="price" header="Price" sortable />
    </DataTable>
  );
};
```

### Custom Cell Templates
```jsx
const ratingBodyTemplate = (rowData) => {
  return <Rating value={rowData.rating} readOnly cancel={false} />;
};

const actionBodyTemplate = (rowData) => {
  return (
    <>
      <Button icon="pi pi-pencil" onClick={() => editProduct(rowData)} />
      <Button icon="pi pi-trash" onClick={() => deleteProduct(rowData)} />
    </>
  );
};

<Column field="rating" header="Rating" body={ratingBodyTemplate} />
<Column body={actionBodyTemplate} exportable={false} />
```

### Selection with Multiple Modes
```jsx
const [selectedProducts, setSelectedProducts] = useState(null);

<DataTable
  value={products}
  selection={selectedProducts}
  onSelectionChange={(e) => setSelectedProducts(e.value)}
  selectionMode="checkbox"
  dataKey="id"
>
  <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
  <Column field="name" header="Name" />
  <Column field="category" header="Category" />
</DataTable>
```

### Advanced Filtering
```jsx
const [filters, setFilters] = useState({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  category: { value: null, matchMode: FilterMatchMode.EQUALS }
});

<DataTable
  value={products}
  filters={filters}
  onFilter={(e) => setFilters(e.filters)}
  globalFilterFields={['name', 'category', 'code']}
>
  <Column field="name" header="Name" filter filterPlaceholder="Search by name" />
  <Column field="category" header="Category" filter filterElement={categoryFilterTemplate} />
</DataTable>
```

### Expandable Rows
```jsx
const [expandedRows, setExpandedRows] = useState(null);

const rowExpansionTemplate = (data) => {
  return (
    <div className="orders-subtable">
      <h5>Orders for {data.name}</h5>
      <DataTable value={data.orders}>
        <Column field="id" header="Id" />
        <Column field="customer" header="Customer" />
        <Column field="date" header="Date" />
      </DataTable>
    </div>
  );
};

<DataTable
  value={products}
  expandedRows={expandedRows}
  onRowToggle={(e) => setExpandedRows(e.data)}
  rowExpansionTemplate={rowExpansionTemplate}
  dataKey="id"
>
  <Column expander style={{ width: '3rem' }} />
  <Column field="name" header="Name" />
  <Column field="category" header="Category" />
</DataTable>
```

### Lazy Loading with Server-Side Features
```jsx
const [lazyState, setLazyState] = useState({
  first: 0,
  rows: 10,
  page: 0,
  sortField: null,
  sortOrder: null,
  filters: {}
});
const [loading, setLoading] = useState(false);
const [totalRecords, setTotalRecords] = useState(0);

const onPage = (event) => {
  setLazyState(event);
};

const onSort = (event) => {
  setLazyState(event);
};

const onFilter = (event) => {
  event['first'] = 0;
  setLazyState(event);
};

<DataTable
  value={data}
  lazy
  paginator
  first={lazyState.first}
  rows={lazyState.rows}
  totalRecords={totalRecords}
  onPage={onPage}
  onSort={onSort}
  onFilter={onFilter}
  sortField={lazyState.sortField}
  sortOrder={lazyState.sortOrder}
  filters={lazyState.filters}
  loading={loading}
>
  <Column field="name" header="Name" sortable filter />
  <Column field="country" header="Country" sortable filter />
  <Column field="company" header="Company" sortable filter />
</DataTable>
```

### Column Resizing and Reordering
```jsx
<DataTable
  value={products}
  resizableColumns
  columnResizeMode="expand"
  reorderableColumns
  onColReorder={(e) => console.log('Column reordered')}
  showGridlines
>
  <Column field="code" header="Code" />
  <Column field="name" header="Name" />
  <Column field="category" header="Category" />
  <Column field="quantity" header="Quantity" />
</DataTable>
```

### State Persistence
```jsx
<DataTable
  value={products}
  paginator
  rows={10}
  stateStorage="session"
  stateKey="dt-state-demo-session"
  filters={filters}
  sortField={sortField}
  sortOrder={sortOrder}
>
  <Column field="name" header="Name" sortable filter />
  <Column field="category" header="Category" sortable filter />
</DataTable>
```

## Notable Features

### 1. **Comprehensive Template System**
Every part of the table is customizable via templates - headers, bodies, footers, cells, filters, pagination, expansion content, and more. This provides maximum flexibility for custom UIs.

### 2. **Built-in Accessibility**
Proper ARIA attributes for expandable rows (`aria-expanded`, `aria-controls`), row editor controls (`aria.editRow`, `aria.cancelEdit`, `aria.saveEdit`), and keyboard navigation support.

### 3. **State Management**
Built-in state persistence to localStorage or sessionStorage maintains page, sort, filters, and column order across sessions using `stateStorage` and `stateKey` props.

### 4. **Virtual Scrolling**
Efficient rendering of large datasets using `virtualScrollerOptions` - only visible rows are rendered in the DOM.

### 5. **Lazy Loading Architecture**
Comprehensive lazy loading support for server-side pagination, sorting, and filtering with the `lazy` prop and corresponding event handlers.

### 6. **Dual Component System**
Separate `DataTable` and `TreeTable` components - each optimized for their specific use case (flat vs hierarchical data).

### 7. **Export Functionality**
Built-in CSV export capabilities without requiring additional libraries.

### 8. **Responsive Layouts**
Multiple responsive strategies: scroll mode (horizontal scrolling on mobile) or stack mode (stacked card layout).

### 9. **Advanced Filtering**
Multiple filter modes (contains, startsWith, endsWith, equals, etc.), multiple constraints per column, global filtering across multiple fields, and custom filter templates.

### 10. **Row and Column Reordering**
Drag-and-drop support for both rows and columns with proper callbacks for state management.

## Implementation Patterns

### API Design
- **Props-based configuration**: All features controlled via component props
- **Controlled components**: State managed externally (selection, filters, expanded rows)
- **Event callbacks**: Consistent naming (`onRowToggle`, `onSelectionChange`, `onFilter`)
- **Template props**: Body, header, footer, filter, editor templates as function props

### State Management Pattern
```javascript
// Common pattern - external state management
const [data, setData] = useState([]);
const [selection, setSelection] = useState(null);
const [filters, setFilters] = useState({});
const [expandedRows, setExpandedRows] = useState(null);

// Pass state and updaters to DataTable
<DataTable
  value={data}
  selection={selection}
  onSelectionChange={(e) => setSelection(e.value)}
  filters={filters}
  onFilter={(e) => setFilters(e.filters)}
  expandedRows={expandedRows}
  onRowToggle={(e) => setExpandedRows(e.data)}
/>
```

### Composition Pattern
- Main `DataTable` component wraps `Column` components
- Each Column defines field binding, rendering, and behavior
- Templates receive `rowData` for custom rendering
- Clear separation between data structure and presentation

## Research Notes

### Access Issues
- Direct access to https://primefaces.org/primereact/showcase/#/datatable was blocked due to network restrictions
- Alternative URL https://primereact.org/datatable/ also blocked
- Research conducted via web searches, community resources, blog posts, and GitHub issues

### Documentation Observations
- Extensive documentation based on community discussions and blog posts
- Well-established patterns in the React ecosystem (8+ years mature)
- Active community with regular updates and issue tracking on GitHub
- Comprehensive API coverage based on search results and code examples
- Strong focus on enterprise use cases (finance, ecommerce, CRM, analytics)

### Framework Characteristics
- **Naming**: Uses "DataTable" (not just "Table") - emphasizing data-centric nature
- **Architecture**: Controlled components with external state management (React patterns)
- **Flexibility**: Template-based customization over configuration
- **Completeness**: Batteries-included approach - all common table features built-in
- **Separation of Concerns**: Separate components for different table types (DataTable vs TreeTable)

### Known Issues (from GitHub)
1. **Column Resize + Reorder**: Cell misalignment between header and body when both features used together with scrollable tables
2. **Expanded Rows State**: Expanded rows may collapse when data updates if row identity tracking isn't properly managed with `dataKey`
3. **Mixed Expansion**: Cannot easily mix row expansion and group expansion due to shared props
4. **Resize Mode Bugs**: Some reported issues with column resize behavior in different modes (fit vs expand)

### Comparison Points
- More comprehensive than basic HTML tables
- Competes with AG-Grid, React Table, Material-UI Table
- Strong enterprise feature set (filtering, sorting, editing, export)
- React-specific (not web components) - requires React as a dependency
- Part of larger PrimeReact UI library ecosystem
