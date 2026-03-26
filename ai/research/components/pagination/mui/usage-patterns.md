# MUI (Material-UI) - Pagination Component

## Component URL
https://mui.com/material-ui/react-pagination/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/pagination/
PaginationItem API: https://mui.com/material-ui/api/pagination-item/
TablePagination API: https://mui.com/material-ui/api/table-pagination/
Version: Current (v5+/v6)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, multiple examples covering basic/controlled patterns, customization options, accessibility guidance, and Material Design specifications. The component system offers both standalone Pagination and TablePagination components for different use cases.

---

## 1. Component Overview

The MUI Pagination component provides a user interface for navigating through pages of content. It implements Material Design's pagination pattern and is commonly used for paginated lists, tables, and search results.

MUI provides two main pagination components:
- **Pagination** - Standalone pagination control with page numbers, previous/next navigation
- **TablePagination** - Integrated table pagination with rows per page selector and total count display
- **PaginationItem** - Individual page button (can be customized)

The components support both **controlled** (externally managed state) and **uncontrolled** (self-managed) patterns, making them flexible for different data loading strategies.

**Key Design Features**:
- Full Material Design compliance with ripple effects and proper spacing
- Flexible page display (show/hide first/last buttons, configurable sibling/boundary counts)
- Built-in accessibility with ARIA attributes and keyboard navigation
- Customizable styling with sx prop and theme integration
- Supports different sizes, shapes, and color variants
- Integration with data fetching and routing libraries

---

## 2. Basic Usage

### Import
```jsx
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import TablePagination from '@mui/material/TablePagination';

// Alternative import
import { Pagination, PaginationItem, TablePagination } from '@mui/material';
```

### Basic Pagination (Uncontrolled Pattern)
The simplest pattern - pagination manages its own page state:

```jsx
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function BasicPagination() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} />
      <Pagination count={10} color="primary" />
      <Pagination count={10} color="secondary" />
      <Pagination count={10} disabled />
    </Stack>
  );
}
```

**Key Pattern Notes**:
- `count` prop specifies total number of pages
- Default starts at page 1
- `color` can be "standard", "primary", or "secondary"
- Automatically shows ellipsis (...) for skipped pages
- Previous/Next buttons included by default

### Controlled Pagination
External state controls the current page:

```jsx
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function ControlledPagination() {
  const [page, setPage] = React.useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2}>
      <Typography>Page: {page}</Typography>
      <Pagination count={10} page={page} onChange={handleChange} />
    </Stack>
  );
}
```

**Controlled Pattern Notes**:
- `page` prop sets the current active page
- `onChange` callback receives `(event, page)` - note the page is the second argument
- Perfect for integrating with data fetching logic
- Can be synchronized with URL parameters or routing

### TablePagination (Integrated Table Pattern)
Complete pagination with rows per page selector and count display:

```jsx
import React from 'react';
import TablePagination from '@mui/material/TablePagination';

function TablePaginationDemo() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      count={100}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
```

**TablePagination Pattern Notes**:
- Uses zero-based page indexing (starts at 0, not 1)
- Shows "1-10 of 100" style count display
- Includes rows per page dropdown selector
- Previous/Next navigation buttons
- Typically used inside Table components but can be standalone with `component="div"`

---

## 3. Props/API

### Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `1` | The total number of pages |
| `page` | `number` | - | The current page (controlled). Must be between 1 and count |
| `defaultPage` | `number` | `1` | The default page (uncontrolled) |
| `onChange` | `function` | - | Callback fired when the page is changed. Signature: `(event: object, page: number) => void` |
| `boundaryCount` | `number` | `1` | Number of always visible pages at the beginning and end |
| `siblingCount` | `number` | `1` | Number of always visible pages before and after the current page |
| `color` | `'standard' \| 'primary' \| 'secondary'` | `'standard'` | The active page color |
| `disabled` | `boolean` | `false` | If true, the component is disabled |
| `hideNextButton` | `boolean` | `false` | If true, hide the next-page button |
| `hidePrevButton` | `boolean` | `false` | If true, hide the previous-page button |
| `showFirstButton` | `boolean` | `false` | If true, show the first-page button |
| `showLastButton` | `boolean` | `false` | If true, show the last-page button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | The size of the pagination |
| `shape` | `'circular' \| 'rounded'` | `'circular'` | The shape of the pagination items |
| `variant` | `'outlined' \| 'text'` | `'text'` | The variant to use |
| `getItemAriaLabel` | `function` | - | Customize ARIA labels. Signature: `(type: string, page: number, selected: boolean) => string` |
| `renderItem` | `function` | - | Render a custom pagination item. Signature: `(item: object) => ReactNode` |
| `sx` | `object \| function` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles. Supports: `root`, `ul` |

### PaginationItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | - | The current page number |
| `type` | `'page' \| 'first' \| 'last' \| 'next' \| 'previous' \| 'start-ellipsis' \| 'end-ellipsis'` | `'page'` | The type of pagination item |
| `selected` | `boolean` | `false` | If true, the item is selected/active |
| `disabled` | `boolean` | `false` | If true, the item is disabled |
| `color` | `'standard' \| 'primary' \| 'secondary'` | `'standard'` | The color of the item |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | The size of the item |
| `shape` | `'circular' \| 'rounded'` | `'circular'` | The shape of the item |
| `variant` | `'outlined' \| 'text'` | `'text'` | The variant to use |
| `sx` | `object \| function` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles |

### TablePagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | **Required** | The total number of rows |
| `page` | `number` | **Required** | The zero-based index of the current page |
| `rowsPerPage` | `number` | **Required** | The number of rows per page |
| `onPageChange` | `function` | **Required** | Callback fired when the page is changed. Signature: `(event: object, page: number) => void` |
| `onRowsPerPageChange` | `function` | - | Callback fired when rows per page is changed. Signature: `(event: object) => void` |
| `rowsPerPageOptions` | `array` | `[10, 25, 50, 100]` | Options for rows per page dropdown |
| `labelRowsPerPage` | `node` | `'Rows per page:'` | Label for rows per page select |
| `labelDisplayedRows` | `function` | - | Customize the displayed rows label. Signature: `({ from, to, count }) => string` |
| `component` | `elementType` | `TableCell` | The component used for the root node (often "div" for standalone use) |
| `showFirstButton` | `boolean` | `false` | If true, show the first-page button |
| `showLastButton` | `boolean` | `false` | If true, show the last-page button |
| `SelectProps` | `object` | - | Props applied to the rows per page Select component |
| `ActionsComponent` | `component` | `TablePaginationActions` | The component used for displaying pagination actions |
| `sx` | `object \| function` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles |

---

## 4. Variants & Patterns

### Size Variants

```jsx
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function SizePagination() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} size="small" />
      <Pagination count={10} size="medium" />
      <Pagination count={10} size="large" />
    </Stack>
  );
}
```

**Size Options**:
- **small** - Compact size for dense layouts
- **medium** - Default size, balanced appearance
- **large** - Larger touch targets, more prominent

### Shape Variants

```jsx
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function ShapePagination() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} shape="circular" />
      <Pagination count={10} shape="rounded" />
    </Stack>
  );
}
```

**Shape Options**:
- **circular** - Fully rounded (default Material Design style)
- **rounded** - Slightly rounded corners (softer rectangular)

### Variant Options

```jsx
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function VariantPagination() {
  return (
    <Stack spacing={2}>
      <Pagination count={10} variant="text" />
      <Pagination count={10} variant="outlined" />
    </Stack>
  );
}
```

**Variant Options**:
- **text** - Flat, text-only buttons (default, minimal)
- **outlined** - Bordered buttons with stroke outline

### Button Visibility Options

```jsx
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function ButtonVisibilityPagination() {
  return (
    <Stack spacing={2}>
      {/* Default: Previous/Next only */}
      <Pagination count={10} />

      {/* With First/Last buttons */}
      <Pagination count={10} showFirstButton showLastButton />

      {/* Hide Previous/Next */}
      <Pagination count={10} hidePrevButton hideNextButton />

      {/* Only page numbers */}
      <Pagination
        count={10}
        hidePrevButton
        hideNextButton
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
```

**Button Control**:
- **showFirstButton** - Adds "First" (⏮) button
- **showLastButton** - Adds "Last" (⏭) button
- **hidePrevButton** - Hides "Previous" (◀) button
- **hideNextButton** - Hides "Next" (▶) button

### Page Range Configuration

```jsx
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function PageRangePagination() {
  return (
    <Stack spacing={2}>
      {/* Default: boundaryCount=1, siblingCount=1 */}
      <Pagination count={20} />

      {/* More boundary pages */}
      <Pagination count={20} boundaryCount={2} />

      {/* More sibling pages */}
      <Pagination count={20} siblingCount={2} />

      {/* Minimal page display */}
      <Pagination count={20} boundaryCount={0} siblingCount={0} />

      {/* Maximum page display */}
      <Pagination count={20} boundaryCount={3} siblingCount={3} />
    </Stack>
  );
}
```

**Range Configuration**:
- **boundaryCount** - Pages always visible at start/end (e.g., `1 ... 5 6 7 ... 20`)
- **siblingCount** - Pages visible around current page (e.g., `... 5 [6] 7 ...`)
- Set both to 0 for minimal display, higher for more visible pages

### Disabled State

```jsx
import Pagination from '@mui/material/Pagination';

function DisabledPagination() {
  return (
    <Pagination count={10} disabled />
  );
}
```

**Disabled Features**:
- All buttons non-interactive
- Reduced opacity visual indication
- Useful during data loading states

---

## 5. Composition Patterns

### Basic Data Pagination with State

```jsx
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function DataPagination() {
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;

  // Sample data - 50 items
  const allItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  // Calculate total pages
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  // Get current page items
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = allItems.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Page {page} of {totalPages}
      </Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {currentItems.map((item, index) => (
          <Box key={index} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography>{item}</Typography>
          </Box>
        ))}
      </Stack>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
      />
    </Box>
  );
}
```

### Table Pagination (Complete Example)

```jsx
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  // ... more rows
];

function TablePaginationExample() {
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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.name}>
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
```

### Router Integration (React Router Example)

```jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function RouterPagination() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get page from URL or default to 1
  const page = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = 10;

  const handleChange = (event, value) => {
    // Update URL with new page
    navigate(`?page=${value}`);
  };

  return (
    <Stack spacing={2}>
      <div>Content for page {page}</div>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
      />
    </Stack>
  );
}
```

### Server-Side Pagination with Loading State

```jsx
import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function ServerPagination() {
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/items?page=${page}`);
        const result = await response.json();
        setData(result.items);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 300, position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            {data.map((item, index) => (
              <div key={index}>{item.name}</div>
            ))}
          </div>
        )}
      </Box>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        disabled={loading}
        color="primary"
      />
    </Stack>
  );
}
```

### Custom Pagination Item Rendering

```jsx
import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';

function CustomPaginationItem() {
  return (
    <Stack spacing={2}>
      {/* Custom rendering with React Router Links */}
      <Pagination
        count={10}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/page/${item.page}`}
            {...item}
          />
        )}
      />

      {/* Custom styling per item */}
      <Pagination
        count={10}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'success.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'success.dark',
                }
              }
            }}
          />
        )}
      />
    </Stack>
  );
}
```

---

## 6. Styling & Theming

### Using sx Prop

```jsx
import Pagination from '@mui/material/Pagination';

function StyledPagination() {
  return (
    <Pagination
      count={10}
      color="primary"
      sx={{
        '& .MuiPaginationItem-root': {
          fontSize: '1rem',
          fontWeight: 'bold',
        },
        '& .Mui-selected': {
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        },
        '& .MuiPaginationItem-ellipsis': {
          color: 'text.secondary',
        },
      }}
    />
  );
}
```

### Styled Components API

```jsx
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0, 0.5),
    minWidth: 40,
    height: 40,
  },
  '& .MuiPaginationItem-page': {
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  '& .MuiPaginationItem-previousNext': {
    border: `1px solid ${theme.palette.divider}`,
  },
}));

function CustomStyledPagination() {
  return <StyledPagination count={10} />;
}
```

### Theme-Level Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

const theme = createTheme({
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontSize: '0.875rem',
          },
        },
      },
      defaultProps: {
        size: 'large',
        color: 'primary',
        showFirstButton: true,
        showLastButton: true,
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        outlined: {
          border: '2px solid currentColor',
        },
      },
    },
  },
});

function ThemedApp() {
  return (
    <ThemeProvider theme={theme}>
      <Pagination count={10} />
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization

**Pagination CSS classes**:
- `.MuiPagination-root` - Root element
- `.MuiPagination-ul` - List container

**PaginationItem CSS classes**:
- `.MuiPaginationItem-root` - Root element
- `.MuiPaginationItem-page` - Page number items
- `.MuiPaginationItem-previousNext` - Previous/Next buttons
- `.MuiPaginationItem-firstLast` - First/Last buttons
- `.MuiPaginationItem-ellipsis` - Ellipsis items (...)
- `.Mui-selected` - Selected/active page
- `.Mui-disabled` - Disabled state
- `.MuiPaginationItem-text` - Text variant
- `.MuiPaginationItem-outlined` - Outlined variant

---

## 7. Accessibility

### ARIA Attributes

MUI Pagination automatically manages ARIA attributes:

```jsx
<Pagination
  count={10}
  getItemAriaLabel={(type, page, selected) => {
    if (type === 'page') {
      return `${selected ? '' : 'Go to '}page ${page}`;
    }
    if (type === 'first') {
      return 'Go to first page';
    }
    if (type === 'last') {
      return 'Go to last page';
    }
    if (type === 'next') {
      return 'Go to next page';
    }
    // type === 'previous'
    return 'Go to previous page';
  }}
/>
```

**Default ARIA Support**:
- `aria-label` on each pagination item
- `aria-current="true"` on active page
- Proper button semantics for all interactive elements

### Keyboard Navigation

**Supported Keys**:
- **Tab** - Navigate to next pagination item
- **Shift+Tab** - Navigate to previous pagination item
- **Enter/Space** - Activate focused page button
- **Arrow Keys** - Navigate between page buttons (with proper focus management)

**Keyboard Example**:
```jsx
function AccessiblePagination() {
  const [page, setPage] = React.useState(1);

  return (
    <nav aria-label="pagination navigation">
      <Pagination
        count={10}
        page={page}
        onChange={(event, value) => setPage(value)}
        getItemAriaLabel={(type, page, selected) => {
          if (type === 'page') {
            return `${selected ? 'page' : 'Go to page'} ${page}`;
          }
          return `Go to ${type} page`;
        }}
      />
    </nav>
  );
}
```

### Screen Reader Support

```jsx
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ScreenReaderPagination() {
  const [page, setPage] = React.useState(1);
  const totalPages = 10;

  return (
    <Box>
      <Typography id="pagination-label" variant="srOnly">
        Results pagination
      </Typography>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => setPage(value)}
        aria-labelledby="pagination-label"
      />

      <Typography variant="srOnly" role="status" aria-live="polite">
        Showing page {page} of {totalPages}
      </Typography>
    </Box>
  );
}
```

---

## 8. Best Practices

### When to Use Pagination

**Use Pagination for**:
- Large datasets (100+ items)
- Search results
- Product listings
- Blog archives
- Data tables
- API results with page limits

**Use Infinite Scroll Instead for**:
- Social media feeds
- Image galleries
- Mobile-first experiences
- Continuous browsing experiences

**Use Load More Instead for**:
- Medium datasets (20-100 items)
- Progressive content loading
- Mobile experiences with limited bandwidth

### Design Guidelines

**Page Count Display**:
```jsx
// Good: Show reasonable page range
<Pagination
  count={50}
  boundaryCount={1}
  siblingCount={1}
/>

// Good: Adjust for many pages
<Pagination
  count={1000}
  boundaryCount={2}
  siblingCount={0}
/>

// Avoid: Too many visible pages
<Pagination
  count={1000}
  boundaryCount={5}
  siblingCount={5}
/>
```

**Button Visibility**:
```jsx
// Good: First/Last for many pages
<Pagination
  count={100}
  showFirstButton
  showLastButton
/>

// Good: Hide for few pages
<Pagination
  count={5}
/>

// Avoid: First/Last with few pages
<Pagination
  count={5}
  showFirstButton
  showLastButton
/>
```

**Loading State Handling**:
```jsx
// Good: Disable during load
<Pagination
  count={10}
  page={page}
  onChange={handleChange}
  disabled={loading}
/>

// Good: Show loading indicator
{loading && <CircularProgress />}
<Pagination
  count={10}
  disabled={loading}
/>
```

### State Management

**Client-Side Pagination**:
```jsx
const [page, setPage] = React.useState(1);
const itemsPerPage = 10;

// Calculate slice
const startIndex = (page - 1) * itemsPerPage;
const currentItems = allItems.slice(startIndex, startIndex + itemsPerPage);
```

**Server-Side Pagination**:
```jsx
const [page, setPage] = React.useState(1);

React.useEffect(() => {
  fetch(`/api/items?page=${page}&limit=10`)
    .then(res => res.json())
    .then(data => setItems(data.items));
}, [page]);
```

**URL Synchronization**:
```jsx
// Read from URL
const page = parseInt(searchParams.get('page') || '1', 10);

// Write to URL
const handleChange = (event, value) => {
  navigate(`?page=${value}`);
};
```

### Performance Considerations

**Large Datasets**:
```jsx
// Good: Virtualization for large tables
import { FixedSizeList } from 'react-window';

// Good: Server-side pagination
fetch(`/api/items?page=${page}&limit=20`);

// Avoid: Client-side pagination of 10,000+ items
const allItems = Array.from({ length: 10000 });
```

**Prefetching**:
```jsx
// Good: Prefetch next page
React.useEffect(() => {
  // Prefetch next page in background
  fetch(`/api/items?page=${page + 1}`);
}, [page]);
```

---

## 9. Common Patterns & Use Cases

### Search Results Pagination

```jsx
function SearchResultsPagination() {
  const [page, setPage] = React.useState(1);
  const [results, setResults] = React.useState([]);
  const [totalResults, setTotalResults] = React.useState(0);
  const resultsPerPage = 10;

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {totalResults} results found
      </Typography>

      {results.map(result => (
        <Box key={result.id} sx={{ mb: 2 }}>
          <Typography variant="h6">{result.title}</Typography>
          <Typography variant="body2">{result.description}</Typography>
        </Box>
      ))}

      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
```

### Product Listing

```jsx
function ProductListing() {
  const [page, setPage] = React.useState(1);
  const [view, setView] = React.useState('grid');
  const productsPerPage = 12;

  return (
    <Box>
      <Grid container spacing={2}>
        {products
          .slice((page - 1) * productsPerPage, page * productsPerPage)
          .map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia component="img" image={product.image} />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="h5">${product.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          size="large"
          color="primary"
        />
      </Box>
    </Box>
  );
}
```

### Blog Archive

```jsx
function BlogArchive() {
  const [page, setPage] = React.useState(1);
  const postsPerPage = 5;

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom>Blog</Typography>

      <Stack spacing={3}>
        {posts
          .slice((page - 1) * postsPerPage, page * postsPerPage)
          .map(post => (
            <Card key={post.id}>
              <CardContent>
                <Typography variant="h5">{post.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.date} • {post.author}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {post.excerpt}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Read More</Button>
              </CardActions>
            </Card>
          ))}
      </Stack>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(posts.length / postsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </Container>
  );
}
```

---

## 10. Material Design Specifications

### Pagination Dimensions

**Standard (medium)**:
- Item size: 32px × 32px
- Font size: 0.875rem
- Spacing between items: 8px
- Minimum touch target: 40px × 40px (with padding)

**Small**:
- Item size: 28px × 28px
- Font size: 0.75rem
- Spacing between items: 6px

**Large**:
- Item size: 40px × 40px
- Font size: 1rem
- Spacing between items: 10px

### Color Scheme

**Light Mode**:
- Default text: `rgba(0, 0, 0, 0.87)`
- Selected background (primary): `theme.palette.primary.main`
- Selected text: `theme.palette.primary.contrastText`
- Outlined border: `rgba(0, 0, 0, 0.23)`
- Hover background: `rgba(0, 0, 0, 0.04)`

**Dark Mode**:
- Default text: `rgba(255, 255, 255, 0.87)`
- Selected background (primary): `theme.palette.primary.main`
- Selected text: `theme.palette.primary.contrastText`
- Outlined border: `rgba(255, 255, 255, 0.23)`
- Hover background: `rgba(255, 255, 255, 0.08)`

### Interaction States

**Hover**: Subtle background color change
**Active/Pressed**: Ripple effect (Material Design)
**Focus**: Focus ring/outline visible
**Disabled**: 38% opacity, no interaction

---

## 11. Additional Resources

### Official Documentation
- Main docs: https://mui.com/material-ui/react-pagination/
- Pagination API: https://mui.com/material-ui/api/pagination/
- PaginationItem API: https://mui.com/material-ui/api/pagination-item/
- TablePagination API: https://mui.com/material-ui/api/table-pagination/
- Table docs: https://mui.com/material-ui/react-table/

### Material Design Specifications
- Navigation patterns: https://m3.material.io/components/navigation-drawer/overview
- Material Design 3: https://m3.material.io/

### Community Resources
- Stack Overflow MUI tag: https://stackoverflow.com/questions/tagged/material-ui
- MUI GitHub: https://github.com/mui/material-ui
- MUI Discussions: https://github.com/mui/material-ui/discussions

### Related Components
- Table: https://mui.com/material-ui/react-table/
- List: https://mui.com/material-ui/react-list/
- Tabs: https://mui.com/material-ui/react-tabs/
- Button: https://mui.com/material-ui/react-button/

---

## Summary

MUI Pagination is a comprehensive, Material Design-compliant navigation component that provides:

- **Flexible patterns** - Both Pagination (standalone) and TablePagination (integrated) components
- **Controlled/Uncontrolled** - Supports both state management patterns
- **Extensive customization** - Size, shape, variant, color, button visibility options
- **Rich configuration** - Control visible page range with boundaryCount and siblingCount
- **Full accessibility** - ARIA attributes, keyboard navigation, screen reader support
- **Material Design integration** - Ripple effects, proper spacing, theme support
- **Custom rendering** - renderItem prop for complete item customization
- **Router integration** - Works seamlessly with React Router and other routing libraries

The component is production-ready, well-documented, and suitable for search results, product listings, data tables, blog archives, and any scenario requiring page-based navigation. Its flexibility makes it easy to adapt to different design systems while maintaining accessibility and usability.

---

Research completed: 2025-11-06
Component: Pagination
Framework: MUI (Material-UI)
Documentation: https://mui.com/material-ui/react-pagination/
