# Ant Design - Table Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ant.design/components/table
Status: ⚠️ Unable to verify directly (network restrictions), research conducted via web search and GitHub source

## Documentation Quality
Comprehensive - Ant Design provides extensive documentation with numerous examples, API references, and advanced use cases. Documentation includes live demos, detailed prop tables, TypeScript support, and real-world implementation patterns.

## Component Definition
- **Core purpose**: Displays rows of structured data with support for sorting, searching, pagination, filtering, and data manipulation. Designed to handle both simple data display and complex interactive data operations.
- **Mental model**: A powerful data grid that serves as the primary interface for viewing and manipulating tabular data. Users expect to interact with data through sorting, filtering, selecting, and detailed viewing.
- **Semantic meaning**: Represents structured, relational data that can be explored, compared, and acted upon. Communicates data organization and relationships through visual hierarchy and interactive affordances.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Standard text/number display with configurable `dataIndex` and `key` properties on columns |
| Custom cell rendering | ✅ | Via `render` prop on columns: `render: (value, record, index) => ReactNode`. Supports complex cell content including icons, buttons, links, and custom components |
| Nested/expandable rows | ✅ | Via `expandable` prop with `expandedRowRender` callback. Supports nested tables, detail panels, and hierarchical data. Includes control over which rows are expandable via `expandedRowProps(record).expandable` |
| Action columns | ✅ | Common pattern using `render` to display action buttons, dropdowns, or menus. Often includes operations like edit, delete, view details |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Simple tabular display with `columns` and `dataSource` props. Minimal configuration for straightforward data presentation |
| Data table | ✅ | Full-featured interactive table with sorting, filtering, pagination, and selection. Standard use case for business applications |
| Tree table | ✅ | Hierarchical data display via `children` property in dataSource. Supports custom `childrenColumnName` and `indentSize`. Can combine with expandable rows for complex hierarchies |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | Via `loading` prop (boolean or Spin props object). Shows loading spinner overlay while data fetches |
| Empty | ✅ | Via `locale.emptyText` prop or ConfigProvider's `renderEmpty`. Customizable empty state with custom messages, icons, and actions |
| Error | ⚠️ | Not built-in, typically handled via custom `locale.emptyText` or by conditionally rendering error messages |
| Selected rows | ✅ | Via `rowSelection` prop with `selectedRowKeys`, `onChange`, and `onSelect` callbacks. Supports single/multiple selection, select all, preserve selection across pages via `preserveSelectedRowKeys` |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Via `size` prop: `"small"`, `"middle"` (default), `"large"`. Affects padding and overall density |
| Bordered | ✅ | Via `bordered` prop (boolean). Adds borders to all cells. Can customize with `title` and `footer` props |
| Striped rows | ⚠️ | Not built-in, achievable via `rowClassName` callback: `rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}` |
| Hoverable rows | ✅ | Default behavior with hover styles. Note: Known issues with borders disappearing on hover in some versions |
| Fixed header | ✅ | Via `scroll={{ y: number }}`. Header remains visible during vertical scrolling |
| Fixed columns | ✅ | Via `fixed: 'left'` or `fixed: 'right'` on column definition. Uses `position: sticky` (v4+). Requires scroll.x to be set |
| Scrollable | ✅ | Via `scroll={{ x: number/true/'max-content', y: number }}`. Supports both horizontal and vertical scrolling |
| Responsive | ✅ | Via `responsive` array on columns: `responsive: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']`. Columns appear/disappear based on breakpoints |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ✅ | Via column `sorter` prop. Supports client-side: `sorter: (a, b) => a.age - b.age`, server-side: `sorter: true`, and multi-column: `sorter: { multiple: number }`. Includes `defaultSortOrder` and `sortDirections` |
| Filtering | ✅ | Via column `filters` array and `onFilter` callback. Supports tree-mode filters (`filterMode: 'tree'`), filter search (`filterSearch: true`), multiple/single selection (`filterMultiple`), and custom filter dropdowns (`filterDropdown`) |
| Pagination | ✅ | Via `pagination` prop or ConfigProvider. Includes `pageSize`, `current`, `total`, `showSizeChanger`, `pageSizeOptions`, `showTotal`, `hideOnSinglePage`. Auto-hides when total < 50, shows size changer when total > 50 (v4.1.0+) |
| Row selection | ✅ | Via `rowSelection` prop with type (`checkbox`/`radio`), `selectedRowKeys`, `onChange`, custom `renderCell` for checkboxes, `preserveSelectedRowKeys` for maintaining selection across data changes |
| Column resizing | ❌ | Not built-in to base Table component. Available in pro-table extension or via third-party libraries |
| Column reordering | ✅ | Via `components` prop with dnd-kit integration. Requires custom implementation using drag-and-drop library |
| Cell editing | ⚠️ | Not built-in, commonly implemented using `render` prop with input components, form fields, or inline editing patterns. Pro-table extension provides more structured editing support |

## Code Examples

### Basic Table with Sorting and Filtering
```jsx
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value),
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const dataSource = [
  { key: '1', name: 'Mike', age: 32, address: '10 Downing Street' },
  { key: '2', name: 'John', age: 42, address: '10 Downing Street' },
];

<Table
  columns={columns}
  dataSource={dataSource}
  pagination={{ pageSize: 10 }}
/>
```

### Table with Row Selection
```jsx
const [selectedRowKeys, setSelectedRowKeys] = useState([]);

const rowSelection = {
  selectedRowKeys,
  onChange: (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log('Selected rows:', selectedRows);
  },
  preserveSelectedRowKeys: true,
};

<Table
  rowSelection={rowSelection}
  columns={columns}
  dataSource={dataSource}
/>
```

### Expandable Rows with Nested Table
```jsx
const expandedRowRender = (record) => {
  const nestedColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', key: 'status', render: () => <Badge status="success" text="Active" /> },
  ];

  return (
    <Table
      columns={nestedColumns}
      dataSource={record.details}
      pagination={false}
    />
  );
};

<Table
  columns={columns}
  dataSource={dataSource}
  expandable={{
    expandedRowRender,
    rowExpandable: (record) => record.hasDetails,
  }}
/>
```

### Styled Table with Multiple Features
```jsx
<Table
  columns={columns}
  dataSource={dataSource}
  bordered
  size="middle"
  loading={isLoading}
  rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
  scroll={{ x: 1300, y: 500 }}
  title={() => 'Data Table'}
  footer={() => 'Footer Content'}
  locale={{
    emptyText: (
      <Empty
        description="No data available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary">Add Data</Button>
      </Empty>
    )
  }}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  }}
/>
```

### Tree Data Structure
```jsx
const treeData = [
  {
    key: 1,
    name: 'Parent 1',
    age: 60,
    children: [
      { key: 11, name: 'Child 1-1', age: 35 },
      { key: 12, name: 'Child 1-2', age: 32 },
    ],
  },
  {
    key: 2,
    name: 'Parent 2',
    age: 58,
    children: [
      { key: 21, name: 'Child 2-1', age: 30 },
    ],
  },
];

<Table
  columns={columns}
  dataSource={treeData}
  // Optional: customize the children property name
  childrenColumnName="children"
  indentSize={20}
/>
```

### Server-Side Operations (Ajax)
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [tableParams, setTableParams] = useState({
  pagination: { current: 1, pageSize: 10 },
  sortField: null,
  sortOrder: null,
  filters: {},
});

const fetchData = async () => {
  setLoading(true);
  const response = await fetch(`/api/data?${getQueryParams(tableParams)}`);
  const result = await response.json();
  setData(result.data);
  setTableParams({
    ...tableParams,
    pagination: {
      ...tableParams.pagination,
      total: result.total,
    },
  });
  setLoading(false);
};

const handleTableChange = (pagination, filters, sorter) => {
  setTableParams({
    pagination,
    filters,
    sortField: sorter.field,
    sortOrder: sorter.order,
  });
};

useEffect(() => {
  fetchData();
}, [tableParams]);

<Table
  columns={columns}
  dataSource={data}
  loading={loading}
  onChange={handleTableChange}
  pagination={tableParams.pagination}
/>
```

### Custom Cell Rendering with Actions
```jsx
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <a onClick={() => viewDetails(record)}>{text}</a>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
        <Button type="link" danger onClick={() => handleDelete(record)}>Delete</Button>
      </Space>
    ),
  },
];
```

### Fixed Columns and Header
```jsx
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  // ... many more columns
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: () => <Button>Action</Button>,
  },
];

<Table
  columns={columns}
  dataSource={dataSource}
  scroll={{ x: 1500, y: 400 }}
/>
```

### Virtual Scrolling (v5+)
```jsx
<Table
  columns={columns}
  dataSource={largeDataset}
  virtual
  scroll={{ x: 1000, y: 500 }}
/>
```

## Notable Features

### 1. **Virtual Scrolling (v5+)**
Ant Design v5 introduced built-in virtual scrolling for handling massive datasets efficiently. Set `virtual` prop along with `scroll.x` and `scroll.y` (both must be numbers) to enable this feature.

### 2. **Pro Table Extension**
The `@ant-design/pro-table` package provides enhanced table functionality including:
- ActionRef for programmatic table control (`reload()`, `reset()`, `clearSelected()`)
- Built-in search and filter forms
- Preset configurations for common scenarios
- Enhanced TypeScript support
- Simplified API for common patterns

### 3. **Tree-Mode Filtering**
Advanced filtering with hierarchical filter options using `filterMode: 'tree'` and `filterSearch: true` for searchable filter dropdowns.

### 4. **Multi-Column Sorting**
Support for sorting by multiple columns simultaneously using `sorter: { multiple: number }` where the number indicates sort priority.

### 5. **Drag-and-Drop Integration**
While not built-in, Ant Design provides clear integration patterns with dnd-kit library for:
- Row reordering
- Column reordering
- Draggable rows with handles

### 6. **Ellipsis Cell Content**
Built-in text truncation with tooltip support via `column.ellipsis` or `column.ellipsis.showTitle`.

### 7. **Summary Rows**
Built-in support for footer summary rows via `summary` prop with `Table.Summary` components, including fixed positioning support (v4.16.0+).

### 8. **TypeScript Excellence**
Comprehensive TypeScript definitions with generics:
- `TableColumnsType<T>` for type-safe column definitions
- `TableRowSelection<T>` for typed selection
- Full inference for data, filters, and sorters

### 9. **Responsive Columns**
Per-column visibility control based on viewport breakpoints using `responsive` array prop.

### 10. **Server-Side Operations**
Well-documented patterns for implementing server-side pagination, sorting, and filtering with clear state management examples.

## Implementation Details Worth Noting

### Performance Considerations
- Virtual scrolling recommended for datasets > 1000 rows
- Use `rowKey` prop (function or string) for optimal rendering performance
- Default page loading to reduce user waiting
- Cache user browsing position and mark browsed items
- Automatic return to first page when current page is out of filtered results

### State Management
- `selectedRowKeys` controlled externally for row selection
- `tableParams` pattern for managing pagination, sort, and filter state
- `preserveSelectedRowKeys` maintains selection across data changes

### Styling Integration
- Component-level customization via `className` and `style` props
- Row-level styling via `rowClassName` callback
- Cell-level styling via `onCell` and `onHeaderCell` props
- ConfigProvider for global table theming

### Known Issues
- Border visibility issues with hover on bordered tables (reported in issues)
- `ellipsis` doesn't work with sorter and filters simultaneously (documented limitation)
- `tableLayout` forced to `fixed` when `ellipsis` is enabled

### Best Practices from Documentation
- Use matrix layout for complex data with horizontal and vertical alignment needs
- Implement loading states for async operations
- Provide meaningful empty states with actions
- Use appropriate size variants for information density
- Combine features thoughtfully to avoid overwhelming users

## Research Notes

### Documentation Access
Unable to access https://ant.design/components/table directly due to network restrictions. Research conducted via:
- Web search results
- GitHub source code examination (ant-design/ant-design)
- Stack Overflow patterns and community examples
- Third-party tutorials and implementation guides

### Framework Approach
Ant Design takes a comprehensive, batteries-included approach to tables:
- Extensive built-in features reducing need for extensions
- Clear patterns for common use cases
- Strong TypeScript support throughout
- Well-documented server-side operation patterns
- Emphasis on data-heavy interfaces and business applications

### Comparison Observations
- More feature-rich out-of-the-box compared to minimal table implementations
- Balances flexibility with structured patterns
- Strong focus on enterprise use cases
- Excellent documentation with numerous live examples
- Active ecosystem with pro-table and extension packages

### Community Patterns
- Common pattern: Custom cell rendering for actions
- Frequent use: Server-side operations with controlled state
- Popular extension: Third-party packages for export, search, and advanced editing
- Standard practice: Combining multiple features (sort + filter + page + select)
