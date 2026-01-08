# MUI (Material-UI) - Transfer List Usage Patterns

## Component URL
https://mui.com/material-ui/react-transfer-list/
Status: ✅ Working
API Reference: https://mui.com/material-ui/components/transfer-list/ (Composition-based, no single component)
Version: Current (v5+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos and examples. Note: Transfer List is NOT a single exported component, but a pattern demonstrated through composition of existing MUI components (List, ListItem, Checkbox, Button, Paper).

---

## 1. Component Overview

The MUI Transfer List (also called "Shuttle") is a UI pattern that enables users to move one or more list items between two lists. Unlike most MUI components, Transfer List is not a single exported component but rather a composition pattern using MUI's building blocks:
- **List** - Container for items
- **ListItem** - Individual selectable items
- **Checkbox** - Selection control for each item
- **Button** - Transfer action controls
- **Paper** - Container styling

The pattern is commonly used for permission management, feature selection, email list management, and similar scenarios where users need to organize items into different categories. MUI provides two main architectural approaches: basic transfer (with "move all" buttons) and enhanced transfer (with "select all" checkbox and counters).

**Note**: Transfer List is desktop-only and not optimized for mobile. For small option sets, MUI recommends using the Autocomplete component instead.

---

## 2. Basic Usage

### Basic Transfer List Pattern

The fundamental pattern uses React state to manage left and right lists:

```jsx
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  Grid,
  Box,
  Checkbox,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function TransferList() {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([0, 1, 2, 3]);
  const [right, setRight] = useState([4, 5, 6, 7]);

  // Helper to get checked items in a specific list
  const leftChecked = checked.filter((value) => left.includes(value));
  const rightChecked = checked.filter((value) => right.includes(value));

  // Toggle checkbox
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  // Move all right
  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    setChecked([]);
  };

  // Move checked right
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(left.filter((value) => !leftChecked.includes(value)));
    setChecked(checked.filter((value) => !leftChecked.includes(value)));
  };

  // Move checked left
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(right.filter((value) => !rightChecked.includes(value)));
    setChecked(checked.filter((value) => !rightChecked.includes(value)));
  };

  // Move all left
  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
    setChecked([]);
  };

  const CustomList = ({ items, title, listType }) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <Box sx={{ px: 2, py: 1, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider' }}>
        {title}
      </Box>
      <List dense component="div" role="list">
        {items.map((value) => (
          <ListItem key={value} role="listitem" disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={`List item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        <CustomList items={left} title="Choices" listType="left" />
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center" spacing={1}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <CustomList items={right} title="Selected" listType="right" />
      </Grid>
    </Grid>
  );
}

export default TransferList;
```

---

## 3. Props/API

### Core Building Block Components

Since Transfer List is a composition pattern, it uses props from multiple MUI components:

#### List Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dense` | `boolean` | `false` | Reduces vertical padding of list items for compact display |
| `disablePadding` | `boolean` | `false` | Removes padding from the root element |
| `subheader` | `node` | - | Optional element to render above the list items |
| `children` | `node` | - | ListItem elements |
| `component` | `string \| component` | `'ul'` | The component used for the root node |
| `sx` | `object` | - | System prop for custom styles |

#### ListItem Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `button` | `boolean` | `false` | If true, item becomes a button for better interaction |
| `selected` | `boolean` | `false` | Applies selected state styling |
| `disabled` | `boolean` | `false` | Disables interaction with the item |
| `divider` | `boolean` | `false` | Renders a divider below the item |
| `children` | `node` | - | ListItemButton, ListItemIcon, ListItemText components |
| `disablePadding` | `boolean` | `false` | Removes padding from the item |
| `sx` | `object` | - | System prop for custom styles |

#### Checkbox Props (from within ListItem)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | If true, checkbox appears checked |
| `onChange` | `function` | - | Callback fired when checkbox state changes |
| `disabled` | `boolean` | `false` | If true, checkbox is disabled |
| `edge` | `'start' \| 'end' \| false` | `false` | Positions checkbox at item edge with negative margin |
| `color` | `'default' \| 'primary' \| 'secondary'` | `'primary'` | Color of the checkbox |
| `size` | `'small' \| 'medium'` | `'medium'` | Size of the checkbox |

#### Button Props (Transfer Controls)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'outlined' \| 'contained'` | `'text'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disables the button when no items available |
| `onClick` | `function` | - | Callback for transfer action |
| `color` | `'inherit' \| 'primary' \| 'secondary'` | `'primary'` | Button color |
| `aria-label` | `string` | - | Accessibility label for the button |
| `sx` | `object` | - | System prop for custom styles |

#### Paper Props (Container)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevation` | `number` | `1` | Shadow elevation level |
| `variant` | `'elevation' \| 'outlined'` | `'elevation'` | Paper style |
| `sx` | `object` | - | System prop for custom styles |

---

## 4. Variants & Patterns

### Basic Transfer with "Move All" Buttons

The standard pattern with four buttons (move all right, move selected right, move selected left, move all left):

```jsx
// See Basic Usage section above for complete example
// Key features:
// - Four directional buttons
// - Move all or selected items
// - Bidirectional transfers
// - Simple item structure (items[number])
```

### Enhanced Transfer List with Select All and Counter

Replaces bulk action buttons with "select all / select none" checkboxes and item counters:

```jsx
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  Grid,
  Box,
  Checkbox,
} from '@mui/material';

function SelectAllTransferList() {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([0, 1, 2, 3]);
  const [right, setRight] = useState([4, 5, 6, 7]);

  const leftChecked = checked.filter((value) => left.includes(value));
  const rightChecked = checked.filter((value) => right.includes(value));

  // Select all items in a list
  const handleToggleAll = (items) => () => {
    if (checked.length === items.length) {
      setChecked(checked.filter((value) => !items.includes(value)));
    } else {
      const newChecked = [...checked, ...items.filter((value) => !checked.includes(value))];
      setChecked(newChecked);
    }
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(left.filter((value) => !leftChecked.includes(value)));
    setChecked(checked.filter((value) => !leftChecked.includes(value)));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(right.filter((value) => !rightChecked.includes(value)));
    setChecked(checked.filter((value) => !rightChecked.includes(value)));
  };

  const CustomList = ({ items, title, listType }) => {
    const allChecked = items.length > 0 && checked.filter((value) => items.includes(value)).length === items.length;
    const someChecked = items.length > 0 && checked.filter((value) => items.includes(value)).length > 0;

    return (
      <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
        {/* Header with Select All checkbox and counter */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'select all items',
            }}
          />
          <Box sx={{ ml: 1, fontSize: '0.875rem', fontWeight: 'bold' }}>
            {`${checked.filter((value) => items.includes(value)).length}/${items.length}`}
          </Box>
        </Box>

        {/* List items */}
        <List dense component="div" role="list">
          {items.map((value) => (
            <ListItem key={value} role="listitem" disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(value)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={`List item ${value + 1}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>
        <CustomList items={left} title="Choices" listType="left" />
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <CustomList items={right} title="Selected" listType="right" />
      </Grid>
    </Grid>
  );
}

export default SelectAllTransferList;
```

### State Management Patterns

#### Using Array-Based Items (Simple)
```jsx
// Store items as simple values (numbers, strings)
const [items, setItems] = useState([0, 1, 2, 3]);
const [checked, setChecked] = useState([]);
```

#### Using Object-Based Items (Complex)
```jsx
// Store items as objects for more complex data
const [items, setItems] = useState([
  { id: '1', name: 'Item 1', description: 'Description 1' },
  { id: '2', name: 'Item 2', description: 'Description 2' },
]);

const [checked, setChecked] = useState([]);

// Toggle by ID
const handleToggle = (id) => () => {
  const currentIndex = checked.indexOf(id);
  const newChecked = [...checked];
  if (currentIndex === -1) {
    newChecked.push(id);
  } else {
    newChecked.splice(currentIndex, 1);
  }
  setChecked(newChecked);
};
```

### Bidirectional Transfer Pattern

```jsx
// Helper to calculate items in each list
const getLeftItems = () => items.filter(item => !right.includes(item.id));
const getRightItems = () => items.filter(item => right.includes(item.id));

const moveRight = () => {
  const leftCheckedIds = checked.filter(id =>
    getLeftItems().some(item => item.id === id)
  );
  setRight([...right, ...leftCheckedIds]);
  setChecked([]);
};

const moveLeft = () => {
  const rightCheckedIds = checked.filter(id =>
    getRightItems().some(item => item.id === id)
  );
  setRight(right.filter(id => !rightCheckedIds.includes(id)));
  setChecked([]);
};
```

---

## 5. Item Transfer Mechanisms

### Move Selected Items

The core transfer operation:

```jsx
const handleCheckedRight = () => {
  // Find items in left list that are checked
  const itemsToMove = left.filter(value => leftChecked.includes(value));

  // Add to right list
  setRight([...right, ...itemsToMove]);

  // Remove from left list
  setLeft(left.filter(value => !itemsToMove.includes(value)));

  // Clear checked state
  setChecked(checked.filter(value => !itemsToMove.includes(value)));
};
```

### Move All Items (Bulk Transfer)

Transfers entire list:

```jsx
const handleAllRight = () => {
  setRight([...right, ...left]);
  setLeft([]);
  setChecked([]);
};
```

### Move with Validation

Transfer with constraints:

```jsx
const handleCheckedRight = () => {
  const itemsToMove = left.filter(value => leftChecked.includes(value));

  // Validate: e.g., max items in right list
  if (right.length + itemsToMove.length > MAX_ITEMS) {
    alert(`Maximum ${MAX_ITEMS} items allowed`);
    return;
  }

  setRight([...right, ...itemsToMove]);
  setLeft(left.filter(value => !itemsToMove.includes(value)));
  setChecked([]);
};
```

### Drag and Drop Transfer (Custom Implementation)

Enhance with draggable items:

```jsx
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Wrap list in Droppable
<Droppable droppableId="left-list">
  {(provided, snapshot) => (
    <Box ref={provided.innerRef} {...provided.droppableProps}>
      {left.map((item, index) => (
        <Draggable key={item} draggableId={String(item)} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <ListItem>{item}</ListItem>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </Box>
  )}
</Droppable>
```

---

## 6. Selection Patterns

### Individual Item Selection

```jsx
const [checked, setChecked] = useState([]);

const handleToggle = (value) => () => {
  const currentIndex = checked.indexOf(value);
  const newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
  } else {
    newChecked.splice(currentIndex, 1);
  }

  setChecked(newChecked);
};

// Render checkbox
<Checkbox
  checked={checked.includes(value)}
  onChange={handleToggle(value)}
/>
```

### Select All / Select None

```jsx
const handleSelectAll = (items) => () => {
  const itemsChecked = checked.filter(value => items.includes(value));

  if (itemsChecked.length === items.length) {
    // All selected, deselect all
    setChecked(checked.filter(value => !items.includes(value)));
  } else {
    // Not all selected, select all
    const newChecked = [...checked, ...items.filter(value => !checked.includes(value))];
    setChecked(newChecked);
  }
};

// Render select all checkbox
<Checkbox
  onClick={handleSelectAll(items)}
  checked={allItemsChecked}
  indeterminate={someItemsChecked && !allItemsChecked}
/>
```

### Selection with Keyboard

```jsx
const handleKeyDown = (event, value) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    handleToggle(value)();
  }
};

// In ListItemButton
<ListItemButton
  onClick={handleToggle(value)}
  onKeyDown={(e) => handleKeyDown(e, value)}
>
```

### Preserve Selection on Transfer

```jsx
const handleCheckedRight = () => {
  const itemsToMove = left.filter(value => leftChecked.includes(value));

  setRight([...right, ...itemsToMove]);
  setLeft(left.filter(value => !itemsToMove.includes(value)));

  // Keep selection in checked state (for re-transferring)
  // Optionally clear: setChecked([]);
};
```

---

## 7. Search/Filter Capabilities

### Basic Search/Filter Implementation

```jsx
import React, { useState, useMemo } from 'react';
import { TextField } from '@mui/material';

function FilteredTransferList() {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  const [right, setRight] = useState([]);
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  // Filter items based on search
  const filteredLeft = useMemo(() => {
    return left.filter(value =>
      `List item ${value + 1}`.toLowerCase().includes(leftSearch.toLowerCase())
    );
  }, [left, leftSearch]);

  const filteredRight = useMemo(() => {
    return right.filter(value =>
      `List item ${value + 1}`.toLowerCase().includes(rightSearch.toLowerCase())
    );
  }, [right, rightSearch]);

  const CustomList = ({ items, filteredItems, title, searchValue, onSearchChange }) => (
    <Paper sx={{ width: 250, height: 300 }}>
      <TextField
        fullWidth
        size="small"
        placeholder={`Search ${title}`}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ p: 1 }}
      />
      <Box sx={{ borderTop: 1, borderColor: 'divider', height: 'calc(100% - 50px)', overflow: 'auto' }}>
        <List dense>
          {filteredItems.map((value) => (
            <ListItem key={value} disablePadding>
              <ListItemButton onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(value)}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={`List item ${value + 1}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );

  return (
    <Grid container spacing={2}>
      <Grid item>
        <CustomList
          items={left}
          filteredItems={filteredLeft}
          title="Choices"
          searchValue={leftSearch}
          onSearchChange={setLeftSearch}
        />
      </Grid>
      {/* Transfer buttons and right list */}
    </Grid>
  );
}
```

### Filter by Category

```jsx
const [categoryFilter, setCategoryFilter] = useState('all');

const filteredItems = useMemo(() => {
  return items.filter(item =>
    categoryFilter === 'all' || item.category === categoryFilter
  );
}, [items, categoryFilter]);

// UI with category selector
<FormControl size="small" sx={{ mb: 1 }}>
  <InputLabel>Category</InputLabel>
  <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
    <MenuItem value="all">All</MenuItem>
    <MenuItem value="active">Active</MenuItem>
    <MenuItem value="inactive">Inactive</MenuItem>
  </Select>
</FormControl>
```

### Real-time Search with Debounce

```jsx
import { useCallback, useState } from 'react';

function useSearchDebounce(initialValue = '', delay = 300) {
  const [search, setSearch] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    const timer = setTimeout(() => setDebouncedSearch(value), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return [debouncedSearch, handleSearch];
}

// Usage
const [searchTerm, handleSearch] = useSearchDebounce('');
```

---

## 8. Custom Rendering

### Custom Item Content

```jsx
const CustomList = ({ items }) => (
  <List>
    {items.map((item) => (
      <ListItem key={item.id} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <Checkbox checked={checked.includes(item.id)} />
          </ListItemIcon>
          <ListItemIcon>
            {/* Custom icon based on item type */}
            {item.type === 'folder' && <FolderIcon />}
            {item.type === 'file' && <FileIcon />}
          </ListItemIcon>
          <div style={{ flex: 1 }}>
            <ListItemText primary={item.name} secondary={item.description} />
          </div>
          <ListItemIcon>
            {item.starred && <StarIcon color="warning" />}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);
```

### Rich List Items with Multiple Lines

```jsx
const CustomList = ({ items }) => (
  <List>
    {items.map((item) => (
      <ListItem
        key={item.id}
        disablePadding
        secondaryAction={
          <IconButton edge="end" aria-label="info">
            <InfoIcon />
          </IconButton>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <Checkbox checked={checked.includes(item.id)} />
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            secondary={
              <React.Fragment>
                <Typography variant="body2" color="textSecondary">
                  {item.email}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.status}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);
```

### Custom Header and Footer

```jsx
const CustomListWithHeader = ({ items, title, itemCount }) => (
  <Paper>
    {/* Header */}
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="caption" color="textSecondary">
        {itemCount} items
      </Typography>
    </Box>

    {/* List content */}
    <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
      {items.map((item) => (
        <ListItem key={item.id} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Checkbox checked={checked.includes(item.id)} />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>

    {/* Footer with stats */}
    <Box sx={{ p: 1, backgroundColor: '#fafafa', borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
      <Typography variant="caption">
        {checkedCount} of {itemCount} selected
      </Typography>
    </Box>
  </Paper>
);
```

### Virtualized List (Large Data Sets)

```jsx
import { FixedSizeList } from 'react-window';

const VirtualizedList = ({ items, height = 300, itemSize = 46 }) => {
  const Row = ({ index, style }) => (
    <ListItem style={style} disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <Checkbox checked={checked.includes(items[index].id)} />
        </ListItemIcon>
        <ListItemText primary={items[index].name} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### Custom Styling per Item

```jsx
const CustomList = ({ items }) => (
  <List>
    {items.map((item) => (
      <ListItem
        key={item.id}
        disablePadding
        sx={{
          backgroundColor: item.disabled ? '#f5f5f5' : 'transparent',
          opacity: item.disabled ? 0.6 : 1,
          '&:hover': {
            backgroundColor: item.disabled ? '#f5f5f5' : '#f0f0f0',
          },
        }}
      >
        <ListItemButton disabled={item.disabled}>
          <ListItemIcon>
            <Checkbox
              checked={checked.includes(item.id)}
              disabled={item.disabled}
            />
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            secondary={item.disabled ? 'Unavailable' : item.description}
            primaryTypographyProps={{
              style: { textDecoration: item.disabled ? 'line-through' : 'none' }
            }}
          />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);
```

---

## 9. Styling & Theming

### Using the sx Prop

```jsx
<Paper
  sx={{
    width: 200,
    height: 230,
    overflow: 'auto',
    border: '1px solid #ddd',
    borderRadius: 2,
    boxShadow: 2,
  }}
>
  {/* Content */}
</Paper>

<Button
  sx={{
    my: 0.5,
    color: '#1976d2',
    borderColor: '#1976d2',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
    '&:disabled': {
      color: '#bdbdbd',
      borderColor: '#bdbdbd',
    },
  }}
/>
```

### Theme Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#1976d2',
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

<ThemeProvider theme={theme}>
  <TransferList />
</ThemeProvider>
```

### Custom Color Scheme

```jsx
<Paper
  sx={{
    backgroundColor: '#f5f5f5',
    border: 1,
    borderColor: 'divider',
  }}
>
  <Box
    sx={{
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      p: 2,
    }}
  >
    Header
  </Box>
</Paper>
```

### Responsive Styling

```jsx
<Grid
  container
  spacing={2}
  direction={{ xs: 'column', sm: 'row' }}
  justifyContent="center"
  alignItems="center"
>
  <Grid item xs={12} sm={6} md={4}>
    <CustomList items={left} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    {/* Transfer buttons */}
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <CustomList items={right} />
  </Grid>
</Grid>
```

---

## 10. Accessibility

### ARIA Attributes

```jsx
// List container
<Box role="region" aria-label="Selectable items">
  <List role="listbox">
    {items.map((item) => (
      <ListItem key={item.id} role="option">
        <Checkbox aria-label={`Select ${item.name}`} />
      </ListItem>
    ))}
  </List>
</Box>

// Transfer buttons
<Button aria-label="Move selected items to the right list">
  &gt;
</Button>
```

### Keyboard Navigation

```jsx
const handleKeyDown = (event, value) => {
  switch (event.key) {
    case ' ':
    case 'Enter':
      event.preventDefault();
      handleToggle(value)();
      break;
    case 'ArrowUp':
      // Focus previous item
      break;
    case 'ArrowDown':
      // Focus next item
      break;
    default:
      break;
  }
};

<ListItemButton
  onKeyDown={(e) => handleKeyDown(e, value)}
  tabIndex={0}
>
  {/* Content */}
</ListItemButton>
```

### Screen Reader Support

```jsx
// Announce selected count
<Box aria-live="polite" aria-atomic="true">
  {checked.length} items selected
</Box>

// Announce list changes
<Box
  role="status"
  aria-live="assertive"
  aria-label={`${right.length} items in selected list`}
>
  {/* List content */}
</Box>
```

### Focus Management

```jsx
const leftListRef = useRef(null);
const rightListRef = useRef(null);

const handleCheckedRight = () => {
  // Move items...
  // Refocus on transfer button
  transferButtonRef.current?.focus();
};

<ListItemButton
  autoFocus={shouldFocus}
  onKeyDown={handleKeyDown}
>
  {/* Content */}
</ListItemButton>
```

### Label Association

```jsx
<FormControl>
  <FormLabel id="transfer-list-label">
    Select items to include
  </FormLabel>
  <Box role="group" aria-labelledby="transfer-list-label">
    {/* Transfer list content */}
  </Box>
</FormControl>
```

---

## 11. Best Practices

### When to Use Transfer List

- **Permission/Role Management**: Assign permissions to users or roles
- **Email List Management**: Add/remove recipients from distributions
- **Feature Flagging**: Select features to enable for users/environments
- **Multi-select Organization**: Users need to organize items into categories
- **Access Control**: Manage which resources users can access
- **Data Migration**: Move items between lists for cleanup or organization

### When NOT to Use Transfer List

- **Mobile interfaces**: Transfer List is desktop-only; use multi-select for mobile
- **Limited options**: Use Autocomplete if choosing from a small pre-defined list
- **Single selection**: Use Select/Dropdown for single choice
- **Hierarchical relationships**: Use TreeView for nested data
- **Large complex data**: Consider Autocomplete with search and filtering

### Common Patterns

**Permission Management:**
```jsx
// Available vs Assigned Roles
<TransferList
  left={availableRoles}
  right={assignedRoles}
  onMoveRight={(roles) => assignToUser(userId, roles)}
/>
```

**Email List:**
```jsx
// All contacts vs Selected recipients
<TransferList
  left={allContacts}
  right={selectedRecipients}
  onMoveRight={(contacts) => addToDistribution(contacts)}
/>
```

**Feature Selection:**
```jsx
// All features vs Enabled features
<TransferList
  left={allFeatures}
  right={enabledFeatures}
  onMoveRight={(features) => enableForUser(features)}
/>
```

### Performance Considerations

1. **Virtualization for Large Lists**: Use react-window for 1000+ items
2. **Memoization**: Memo custom list components to prevent unnecessary re-renders
3. **useMemo for Derived State**: Cache filtered/computed list values
4. **Debounce Search**: Prevent excessive filtering operations
5. **Lazy Load**: Load items on demand for very large datasets

```jsx
const CustomList = React.memo(({ items, title }) => (
  // Component...
));

const filteredItems = useMemo(() => {
  return items.filter(item => item.name.includes(search));
}, [items, search]);
```

### Form Integration

```jsx
import { Controller, useForm } from 'react-hook-form';

const { control, handleSubmit } = useForm();

<Controller
  name="selectedItems"
  control={control}
  defaultValue={[]}
  rules={{ required: 'Must select at least one item' }}
  render={({ field, fieldState: { error } }) => (
    <>
      <TransferList
        left={availableItems}
        right={field.value}
        onChange={(newItems) => field.onChange(newItems)}
      />
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </>
  )}
/>
```

---

## 12. Comparison Notes

### Unique to MUI Transfer List Pattern

1. **Composition-Based**: Built from composable MUI components, not a single monolithic component
2. **Flexible Architecture**: Two main documented patterns (basic and enhanced)
3. **Select All with Counter**: Enhanced version shows selection counts elegantly
4. **Material Design**: Follows Material Design 3 guidelines
5. **Grid-Based Layout**: Uses MUI Grid for responsive arrangement
6. **Integrated Checkbox States**: Supports indeterminate state for partial selection
7. **Button Variants**: Four transfer buttons in base pattern (move all/selected in both directions)
8. **No Pre-Built Exports**: Developers must create custom implementations
9. **sx Prop Support**: Modern styling with theme integration
10. **Deep MUI Integration**: Works seamlessly with other MUI form components

### Design Philosophy

- **Composition Over Components**: Encourages building with MUI primitives
- **Flexibility**: No forced component structure; adapt to your needs
- **Material Design Compliance**: Follows MD3 principles for interactions
- **Accessibility First**: Built on accessible MUI components (List, Checkbox, Button)
- **Modern Styling**: Uses sx prop and theme system for customization

---

## 13. Notable Features

1. **Two Architectural Approaches**: Basic (move all buttons) and Enhanced (select all with counter) documented patterns

2. **Indeterminate Checkbox State**: Elegantly represents partial selection in enhanced version

3. **Item Counter**: Shows "selected/total" count for improved UX

4. **Bidirectional Transfer**: Full support for moving items in both directions with dedicated buttons

5. **Flexible Item Structure**: Works with simple values, objects, or complex data structures

6. **Integration with Form Libraries**: Works seamlessly with React Hook Form, Formik, etc.

7. **Composition-First Philosophy**: Encourages reusable custom implementations

8. **No External Dependencies**: Uses only MUI components; build with what you need

9. **Customizable Buttons**: Four button pattern easily adaptable to three, two, or one button variations

10. **Performance Optimization**: Can be combined with virtualization libraries for large datasets

11. **Accessibility Built-In**: Inherits a11y from MUI components (keyboard nav, screen reader support)

12. **Search/Filter Capability**: Easily add search with useMemo and controlled text input

13. **Theme Integration**: Full support for MUI theming and custom colors

14. **Responsive Design**: Grid-based layout naturally responds to screen sizes

15. **Rich Customization**: Custom rendering per item, headers, footers, styling per item state

---

## Research Notes

- MUI Transfer List is documented as a composition pattern, not a standalone component export
- Official documentation emphasizes flexibility through composition over providing a monolithic component
- Two main architectural patterns documented: TransferList (with move all buttons) and SelectAllTransferList (with select all checkbox)
- The component is desktop-only; mobile users benefit more from Autocomplete with search
- No pre-built npm exports exist; developers must create custom implementations based on the provided examples
- Strong emphasis on using MUI's component library (List, ListItem, Checkbox, Button, Paper) as building blocks
- The pattern is commonly extended with search/filtering, custom rendering, and drag-and-drop capabilities
- MUI's modern sx prop is the recommended styling approach over older theme overrides
- The component integrates well with form libraries like React Hook Form for validation and form submission
- GitHub issue #27579 tracks requests for higher-level component exports and mobile support

---

## External References

- **MUI Documentation**: https://mui.com/material-ui/react-transfer-list/
- **GitHub Examples**: https://github.com/mui/material-ui/tree/master/docs/data/material/components/transfer-list
- **Material Design Specs**: https://m3.material.io/ (MD3 principles)
- **Related MUI Components**: List, ListItem, Checkbox, Button, Paper, Grid

---

**Last Modified:** 2025-11-05
