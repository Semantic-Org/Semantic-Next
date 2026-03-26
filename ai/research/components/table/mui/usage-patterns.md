# MUI - Table Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://mui.com/material-ui/react-table/
Status: ✅ Working (verified via web search - direct access blocked by network restrictions)

## Documentation Quality
**Good** - Comprehensive coverage of basic to advanced table features with clear examples and API documentation. MUI provides both simple table components and guidance on advanced use cases including virtualization and migration paths to DataGrid for complex scenarios.

## Component Definition
- **Core purpose**: Display tabular data in a scannable format that enables users to identify patterns and insights. Provides native HTML table elements wrapped with Material Design styling.
- **Mental model**: Compositional building blocks that mirror native HTML table structure (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`). Each semantic part has a corresponding React component.
- **Semantic meaning**: Structured data presentation that maintains accessibility through proper HTML table semantics while adding Material Design visual language.

## Core Table Components

MUI provides the following compositional components:

- `<TableContainer />` - Wrapper providing horizontal scrolling behavior
- `<Table />` - Main table component (renders `<table>`)
- `<TableHead />` - Header row container (renders `<thead>`)
- `<TableBody />` - Body rows container (renders `<tbody>`)
- `<TableRow />` - Table row (renders `<tr>`)
- `<TableCell />` - Table cell (renders `<th>` in head, `<td>` in body)
- `<TableFooter />` - Footer container (renders `<tfoot>`)
- `<TableSortLabel />` - Sorting control component for column headers
- `<TablePagination />` - Pagination controls component

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Standard text content in TableCell components |
| Custom cell rendering | ✅ | Any React content can be placed in TableCell, full flexibility for custom rendering |
| Nested/expandable rows | ✅ | Demonstrated in examples using Collapse component for expandable row details |
| Action columns | ✅ | TableCell can contain IconButton, Button, or other action components |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Simple table with rows and columns, minimal configuration |
| Data table | ✅ | Tables with sorting, selection, pagination - full data management features |
| Tree table | ❌ | Not directly supported - would require custom implementation or DataGrid component |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ⚠️ | Not built-in - requires custom implementation with Skeleton or CircularProgress components |
| Empty | ⚠️ | Not built-in - requires custom empty state rendering in TableBody |
| Error | ⚠️ | Not built-in - requires custom error state handling |
| Selected rows | ✅ | Demonstrated with Checkbox in cells, manual state management required |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `size="small"` and `size="medium"` props on Table component |
| Bordered | ⚠️ | Not direct prop - achievable through custom styling or sx prop |
| Striped rows | ⚠️ | Not built-in - requires custom styling with nth-child selectors or per-row styling |
| Hoverable rows | ✅ | `hover` prop on TableRow component |
| Fixed header | ✅ | Achieved with `stickyHeader` prop on Table component |
| Fixed columns | ❌ | Not directly supported - requires custom CSS or DataGrid for advanced scenarios |
| Scrollable | ✅ | TableContainer provides horizontal scrolling, vertical scroll with custom height |
| Responsive | ✅ | Horizontal scrolling via TableContainer, mobile optimization examples provided |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ✅ | TableSortLabel component provides sorting UI, logic is custom implementation |
| Filtering | ⚠️ | Not built-in - requires custom implementation, no provided filtering components |
| Pagination | ✅ | TablePagination component with rows per page selector and navigation controls |
| Row selection | ✅ | Checkbox pattern demonstrated, state management is manual |
| Column resizing | ❌ | Not supported - would require third-party library or DataGrid |
| Column reordering | ❌ | Not supported - would require third-party library or DataGrid |
| Cell editing | ❌ | Not built-in - requires custom implementation with form controls in cells |

## Code Examples

### Basic Table
```jsx
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

### Table with Sorting
```jsx
import TableSortLabel from '@mui/material/TableSortLabel';

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
```

### Table with Selection
```jsx
import Checkbox from '@mui/material/Checkbox';

function SelectableTable() {
  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selected.length > 0 && selected.length < rows.length}
              checked={rows.length > 0 && selected.length === rows.length}
              onChange={handleSelectAllClick}
            />
          </TableCell>
          {/* Other header cells */}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => {
          const isItemSelected = selected.indexOf(row.id) !== -1;
          return (
            <TableRow
              hover
              onClick={(event) => handleClick(event, row.id)}
              role="checkbox"
              aria-checked={isItemSelected}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={isItemSelected} />
              </TableCell>
              {/* Other cells */}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
```

### Dense/Compact Table
```jsx
<Table size="small" aria-label="a dense table">
  {/* Table content */}
</Table>
```

### Sticky Header
```jsx
<TableContainer sx={{ maxHeight: 440 }}>
  <Table stickyHeader aria-label="sticky table">
    <TableHead>
      {/* Header content */}
    </TableHead>
    <TableBody>
      {/* Body content */}
    </TableBody>
  </Table>
</TableContainer>
```

### Table with Pagination
```jsx
import TablePagination from '@mui/material/TablePagination';

function PaginatedTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer>
        <Table>
          {/* Table content */}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
```

## Notable Features

### 1. **Compositional Design**
MUI Table closely mirrors native HTML table structure, making it immediately familiar to developers. Each semantic part (`<thead>`, `<tbody>`, `<tr>`, `<td>`) has a corresponding React component.

### 2. **Virtualization Support**
Documentation includes integration examples with react-virtuoso for handling very large datasets (200+ rows) with excellent performance through row virtualization.

### 3. **Migration Path to DataGrid**
MUI explicitly acknowledges Table component limitations for complex data grids and provides clear guidance on when to migrate to the DataGrid component for advanced features like:
- Built-in column resizing
- Column reordering
- Advanced filtering
- Row grouping
- Excel export
- Inline editing

### 4. **Accessibility First**
Proper use of ARIA attributes demonstrated throughout examples:
- `aria-label` on tables
- `role="checkbox"` on selectable rows
- `aria-checked` on selected rows
- Proper `<th scope="row">` usage

### 5. **Material Design Integration**
Seamless integration with MUI ecosystem:
- `sx` prop for custom styling
- Theme-aware components
- Integration with Paper component for elevation
- Works with all MUI components (Checkbox, IconButton, etc.)

### 6. **Third-Party Ecosystem**
Rich ecosystem of table libraries built on MUI:
- **Material React Table (MRT)** - Full-featured data grid with advanced features
- **MUI-Datatables** - Responsive datatables with filtering, sorting, export
- Demonstrates MUI's extensibility and community adoption

## Research Notes

### Access Challenges
- Direct web fetch blocked by network restrictions/enterprise security policies
- Confirmed URL is working via web search results
- Documentation is publicly accessible at https://mui.com/material-ui/react-table/

### Documentation Approach
MUI takes a pragmatic approach by:
1. Providing simple, composable table components for basic use cases
2. Showing advanced patterns (sorting, selection, pagination) as examples rather than built-in features
3. Clearly documenting when to migrate to DataGrid for complex requirements
4. Maintaining semantic HTML structure for accessibility

### Framework Philosophy
- **Low-level primitives**: Basic table components are thin wrappers over HTML
- **Manual state management**: Sorting, filtering, selection logic is developer-implemented
- **Composition over configuration**: Build up functionality by combining components
- **Escape hatch**: DataGrid available for complex scenarios where manual implementation becomes burdensome

### Comparison with Other Frameworks
- More manual than Ant Design or Mantine (which have more built-in features)
- Similar philosophy to Radix UI (low-level primitives)
- More opinionated styling than Headless UI
- Clear separation between simple tables and complex data grids

### Key Takeaways for Semantic UI
1. **Clear separation of concerns**: MUI distinguishes between simple tables and complex data grids
2. **Compositional API**: Each semantic part is a component
3. **Example-driven documentation**: Advanced patterns shown as implementation examples
4. **Performance consideration**: Virtualization guidance for large datasets
5. **Accessibility patterns**: Comprehensive ARIA attribute usage examples
6. **Migration paths**: Clear guidance on when features outgrow the component

## Additional Resources
- **API Reference**: https://mui.com/material-ui/api/table/
- **Material React Table**: https://www.material-react-table.com/
- **MUI DataGrid**: For complex data grid requirements
- **GitHub Examples**: Official MUI documentation repository contains comprehensive examples
