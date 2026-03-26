# MUI (Material-UI) - Menu Usage Patterns

## Component URL
https://mui.com/material-ui/react-menu/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/menu/
MenuItem API: https://mui.com/material-ui/api/menu-item/
MenuList API: https://mui.com/material-ui/api/menu-list/
Version: Current (v5+/v6)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, code examples, and accessibility guidance. The component follows Material Design specifications and has extensive community resources.

---

## 1. Component Overview

The MUI Menu component is Material Design's implementation of a temporary surface that displays a list of choices when triggered by user interaction. In Material Design, "Menu" is the official term for what is commonly called a "dropdown" in other frameworks. The Menu appears anchored to an element (typically a button) and provides a popover-based navigation interface for options and actions.

Built on top of the Popover component, Menu inherits all Popover functionality while providing Material Design styling, elevation system, proper focus management, and accessibility features out of the box. It integrates seamlessly with other MUI components like MenuItem, MenuList, ListItemIcon, ListItemText, and Divider for rich composition patterns.

**Dropdown vs Menu Clarification**: In Material Design terminology, "Menu" is the canonical term for this dropdown pattern. MUI calls it "Menu" (not "Dropdown") to align with Material Design specifications. The component serves the same purpose as dropdowns in other frameworks - displaying a list of options triggered by user action.

---

## 2. Basic Usage

### Import
```jsx
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Alternative import
import { Menu, MenuItem, Button } from '@mui/material';
```

### Simple Menu (Basic Pattern)
The most common pattern uses `useState` to manage the anchor element:

```jsx
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
```

**Key Pattern Notes**:
- `anchorEl` is set to `null` by default
- `handleClick` updates `anchorEl` with `event.currentTarget`
- `open` is determined by `Boolean(anchorEl)` (true when anchorEl exists, false when null)
- Each MenuItem typically calls `handleClose` on click to dismiss the menu
- The anchor element must always be available - removing it while open causes errors

### Menu with Action Handling
```jsx
function MenuWithActions() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log('Edit clicked');
    handleClose();
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    handleClose();
  };

  return (
    <>
      <Button onClick={handleClick}>Actions</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Cancel</MenuItem>
      </Menu>
    </>
  );
}
```

---

## 3. Props/API

### Core Menu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `anchorEl` | `HTML element \| object` | - | The element that the menu attaches to for positioning. Usually set to `event.currentTarget` from the trigger element. **Required for positioning**. |
| `open` | `boolean` | `false` | If `true`, the menu is visible. Typically controlled with `Boolean(anchorEl)`. |
| `onClose` | `function` | - | Callback fired when the menu requests to be closed. Signature: `(event: object, reason: string) => void`. Reason can be: 'escapeKeyDown', 'backdropClick', 'tabKeyDown'. |
| `anchorOrigin` | `object` | `{ vertical: 'top', horizontal: 'left' }` | Defines which point on the anchor element the menu attaches to. Properties: `vertical` ('top', 'center', 'bottom', or number), `horizontal` ('left', 'center', 'right', or number). |
| `transformOrigin` | `object` | `{ vertical: 'top', horizontal: 'left' }` | Defines the transformation origin point for the menu. Same structure as `anchorOrigin`. |
| `autoFocus` | `boolean` | `true` | If `true`, the menu will automatically receive focus when opened. |
| `children` | `node` | - | Menu contents, typically MenuItem components. |
| `classes` | `object` | - | Override or extend styles applied to the component. Supports: `paper`, `list`. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for defining custom styles with theme access. |
| `disableAutoFocusItem` | `boolean` | `false` | When opening, the menu will not automatically set focus on the first item. |
| `MenuListProps` | `object` | - | Props passed to the underlying MenuList component. |
| `PaperProps` | `object` | - | **Deprecated in v6** - Use `slotProps.paper` instead. Props applied to the Paper element. |
| `slotProps` | `object` | - | Props for component slots. Supports `paper` (PaperProps) and `root` (Popover props). |
| `elevation` | `number` | `8` | The elevation (shadow depth) of the menu. Range: 0-24. |
| `variant` | `'menu' \| 'selectedMenu'` | `'selectedMenu'` | The variant to use. 'selectedMenu' keeps the selected item highlighted. |
| `transitionDuration` | `'auto' \| number \| object` | `'auto'` | Duration for the transition animation in milliseconds. |

**Inherited from Popover**: Menu inherits all Popover props, which in turn inherits from Modal. This includes props like `BackdropProps`, `disablePortal`, `keepMounted`, `marginThreshold`, and more.

### MenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The content of the menu item. |
| `selected` | `boolean` | `false` | If `true`, the menu item is highlighted as selected. |
| `disabled` | `boolean` | `false` | If `true`, the menu item is disabled and cannot be interacted with. |
| `onClick` | `function` | - | Click handler for the menu item. Signature: `(event: React.MouseEvent) => void` |
| `dense` | `boolean` | `false` | If `true`, compact vertical padding is applied to reduce height. |
| `divider` | `boolean` | `false` | If `true`, a 1px border is added to the bottom of the item as a separator. |
| `disableGutters` | `boolean` | `false` | If `true`, removes the left and right padding. |
| `component` | `elementType` | `'li'` | The component used for the root node (can be HTML string or React component). |
| `classes` | `object` | - | Override styles. Supports: `root`, `selected`, `disabled`, `dense`, `divider`. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles. |

**Inherited from ListItem**: MenuItem inherits props from the ListItem component, including `alignItems`, `button`, `ContainerComponent`, `ContainerProps`, and event handlers.

### MenuList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean` | `false` | If `true`, the list will automatically focus the first item when the menu opens. |
| `autoFocusItem` | `boolean` | `false` | If `true` and `autoFocus` is true, focuses the first item. |
| `children` | `node` | - | MenuList contents, typically MenuItem components. |
| `dense` | `boolean` | `false` | If `true`, applies compact spacing to all children. |
| `disableListWrap` | `boolean` | `false` | If `true`, vertical keyboard navigation will not wrap from bottom to top. |
| `variant` | `'menu' \| 'selectedMenu'` | `'selectedMenu'` | The variant to use for focus behavior. |

---

## 4. Variants & Patterns

### Anchor/Positioning

Menu positioning is controlled via `anchorOrigin` and `transformOrigin` to align the menu relative to the anchor element.

**Common Positioning Patterns**:

```jsx
// Menu appears below anchor, aligned to left edge
<Menu
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
/>

// Menu appears below anchor, aligned to right edge (common for user avatars)
<Menu
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
/>

// Menu appears above anchor
<Menu
  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
  transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
/>

// Menu appears to the right of anchor
<Menu
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
/>

// Using numeric offset values (px from top-left corner of anchor)
<Menu
  anchorOrigin={{ vertical: 10, horizontal: 20 }}
  transformOrigin={{ vertical: 0, horizontal: 0 }}
/>
```

**Understanding Origins**:
- `anchorOrigin`: Which point on the **anchor element** to attach the menu to
- `transformOrigin`: Which point on the **menu itself** aligns with the anchor point
- Combining these determines the final menu position and animation origin

### Menu Items with Icons and Typography

```jsx
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';

function IconMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Edit
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
```

**Icon Best Practices**:
- Use `fontSize="small"` for icons in menus
- `ListItemIcon` provides proper spacing and alignment
- `ListItemText` handles typography and truncation

### Dividers and Subheaders

```jsx
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';

function GroupedMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Options
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <ListSubheader>File Actions</ListSubheader>
        <MenuItem onClick={() => setAnchorEl(null)}>New File</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Open File</MenuItem>
        <Divider />
        <ListSubheader>Edit Actions</ListSubheader>
        <MenuItem onClick={() => setAnchorEl(null)}>Cut</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Copy</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Paste</MenuItem>
      </Menu>
    </>
  );
}
```

**Divider Usage**:
- `<Divider />` component for visual separation
- Alternative: `divider` prop on MenuItem: `<MenuItem divider>Item</MenuItem>`
- For proper HTML: `<Divider component="li" />` when used in lists

### Selected States

```jsx
function MenuWithSelection() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Options
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          selected={selectedIndex === 0}
          onClick={() => handleMenuItemClick(0)}
        >
          Option 1
        </MenuItem>
        <MenuItem
          selected={selectedIndex === 1}
          onClick={() => handleMenuItemClick(1)}
        >
          Option 2
        </MenuItem>
        <MenuItem
          selected={selectedIndex === 2}
          onClick={() => handleMenuItemClick(2)}
        >
          Option 3
        </MenuItem>
      </Menu>
    </>
  );
}
```

**Selection Patterns**:
- `selected` prop highlights the current item
- Often combined with checkmark icons
- Use `variant="menu"` on Menu to disable initial focus on selected item
- `variant="selectedMenu"` (default) focuses the selected item when opened

### Dense Variant

```jsx
function DenseMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Compact Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ dense: true }}
      >
        <MenuItem dense>Item 1</MenuItem>
        <MenuItem dense>Item 2</MenuItem>
        <MenuItem dense>Item 3</MenuItem>
      </Menu>
    </>
  );
}
```

**Dense Usage**:
- Apply to entire menu: `MenuListProps={{ dense: true }}`
- Apply to individual items: `<MenuItem dense>`
- Reduces vertical padding for space-constrained interfaces
- Useful for long lists or compact layouts

### Max Height and Scrolling

When menus exceed available viewport space, implement scrolling with max-height:

```jsx
const ITEM_HEIGHT = 48;

function ScrollingMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangzhou',
    'Io',
    'Luna',
    'Oberon',
    'Phobos',
    'Rhea',
    'Titan',
    'Umbriel',
  ];

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Long Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => setAnchorEl(null)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
```

**Modern approach with slotProps (v6+)**:
```jsx
<Menu
  slotProps={{
    paper: {
      sx: {
        maxHeight: ITEM_HEIGHT * 4.5,
        width: 200,
      }
    }
  }}
>
  {/* Menu items */}
</Menu>
```

**Responsive max-height**:
```jsx
<Menu
  slotProps={{
    paper: {
      sx: {
        maxHeight: {
          xs: 200,  // Mobile
          sm: 300,  // Tablet
          md: 400,  // Desktop
        },
        width: 250,
      }
    }
  }}
>
  {/* Menu items */}
</Menu>
```

**Scrolling Behavior**:
- Menu automatically scrolls internally when height exceeds max-height
- Native browser scrollbars appear
- Keyboard navigation continues to work
- Focus remains visible during scrolling

### Nested Menus (Submenus)

**Note**: MUI does not provide built-in support for nested menus. The community has created packages to handle this:

**Using `mui-nested-menu` package**:
```jsx
import { NestedMenuItem } from 'mui-nested-menu';

function NestedMenuExample() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Menu with Submenus
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>Regular Item</MenuItem>
        <NestedMenuItem
          label="Nested Item"
          parentMenuOpen={Boolean(anchorEl)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>Sub Item 1</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Sub Item 2</MenuItem>
        </NestedMenuItem>
      </Menu>
    </>
  );
}
```

**Manual nested menu implementation**:
```jsx
function ManualNestedMenu() {
  const [mainAnchor, setMainAnchor] = React.useState(null);
  const [subAnchor, setSubAnchor] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setMainAnchor(e.currentTarget)}>
        Main Menu
      </Button>
      <Menu
        anchorEl={mainAnchor}
        open={Boolean(mainAnchor)}
        onClose={() => setMainAnchor(null)}
      >
        <MenuItem>Item 1</MenuItem>
        <MenuItem
          onMouseEnter={(e) => setSubAnchor(e.currentTarget)}
          onMouseLeave={() => setSubAnchor(null)}
        >
          More Options →
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={subAnchor}
        open={Boolean(subAnchor)}
        onClose={() => setSubAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={() => { setSubAnchor(null); setMainAnchor(null); }}>
          Sub Item 1
        </MenuItem>
        <MenuItem onClick={() => { setSubAnchor(null); setMainAnchor(null); }}>
          Sub Item 2
        </MenuItem>
      </Menu>
    </>
  );
}
```

**Community Packages**:
- `mui-nested-menu` - https://www.npmjs.com/package/mui-nested-menu
- `material-ui-nested-menu-item` - https://github.com/azmenak/material-ui-nested-menu-item

---

## 5. Composition Patterns

### Core Component Hierarchy

```
Menu (wrapper/popover container)
└── MenuList (list container)
    └── MenuItem (individual option)
        ├── ListItemIcon (leading icon)
        ├── ListItemText (text content)
        └── Typography (custom text)
```

### Complete Composition Example

```jsx
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

function ComposedMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState('English');

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Account Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            Signed in as user@example.com
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setSelected('English'); setAnchorEl(null); }}>
          <ListItemIcon>
            {selected === 'English' && <Check fontSize="small" />}
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setSelected('Spanish'); setAnchorEl(null); }}>
          <ListItemIcon>
            {selected === 'Spanish' && <Check fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Spanish</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
```

### MenuList Alternative Pattern

For menus that don't need Popover functionality (e.g., always visible menus):

```jsx
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

function StandaloneMenuList() {
  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Paper>
  );
}
```

**When to use MenuList directly**:
- Always-visible navigation menus
- Sidebar menus
- Static option lists that don't need popover behavior
- Custom dropdown implementations

---

## 6. Styling & Theming

### Using sx Prop

**Menu styling**:
```jsx
<Menu
  sx={{
    '& .MuiPaper-root': {
      backgroundColor: 'background.paper',
      boxShadow: 3,
      borderRadius: 2,
      minWidth: 200,
    },
    '& .MuiList-root': {
      padding: '8px',
    }
  }}
>
  {/* Menu items */}
</Menu>
```

**MenuItem styling**:
```jsx
<MenuItem
  sx={{
    backgroundColor: '#f0f0f0',
    color: 'navy',
    borderRadius: 1,
    mb: 0.5,
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
    '&.Mui-selected': {
      backgroundColor: 'primary.light',
      color: 'primary.contrastText',
      '&:hover': {
        backgroundColor: 'primary.main',
      }
    },
    '&.Mui-disabled': {
      opacity: 0.5,
    }
  }}
>
  Styled Item
</MenuItem>
```

**Complete styled menu example**:
```jsx
function StyledMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Custom Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'grey.900',
              color: 'grey.100',
              borderRadius: 2,
              mt: 1,
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'grey.800',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.dark',
                }
              }
            }
          }
        }}
      >
        <MenuItem>Dark Theme Item 1</MenuItem>
        <MenuItem selected>Selected Item</MenuItem>
        <MenuItem>Dark Theme Item 3</MenuItem>
      </Menu>
    </>
  );
}
```

### Styled Components API

```jsx
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiList-root': {
    padding: theme.spacing(1),
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: theme.spacing(0.5),
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  }
}));

function CustomStyledMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
        Styled Menu
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <StyledMenuItem>Item 1</StyledMenuItem>
        <StyledMenuItem selected>Item 2</StyledMenuItem>
        <StyledMenuItem>Item 3</StyledMenuItem>
      </StyledMenu>
    </>
  );
}
```

### Theme-Level Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          marginTop: 8,
        },
        list: {
          padding: '8px',
        }
      },
      defaultProps: {
        elevation: 3,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* All menus will use these styles */}
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization

**Menu CSS classes**:
- `.MuiMenu-root` - Root element
- `.MuiMenu-paper` - Paper component (menu surface)
- `.MuiMenu-list` - List element containing items

**MenuItem CSS classes**:
- `.MuiMenuItem-root` - Root element
- `.MuiMenuItem-dense` - Applied when dense prop is true
- `.MuiMenuItem-divider` - Applied when divider prop is true
- `.Mui-selected` - Applied when selected prop is true
- `.Mui-disabled` - Applied when disabled prop is true

**Example using classes**:
```jsx
<Menu
  classes={{
    paper: 'custom-menu-paper',
    list: 'custom-menu-list',
  }}
>
  <MenuItem classes={{ root: 'custom-menu-item' }}>
    Item
  </MenuItem>
</Menu>
```

---

## 7. Accessibility

### ARIA Attributes

**Menu ARIA**:
- `role="menu"` - Automatically applied to Menu component
- `aria-labelledby` - Links menu to trigger button (automatically managed)
- `aria-hidden` - Managed based on open state

**MenuItem ARIA**:
- `role="menuitem"` - Automatically applied
- `aria-disabled="true"` - Applied when disabled
- `aria-selected` - Indicates selected state (not automatically applied)
- `aria-haspopup="menu"` - For items with submenus

**Example with explicit ARIA**:
```jsx
<Button
  id="menu-button"
  aria-controls={open ? 'basic-menu' : undefined}
  aria-haspopup="true"
  aria-expanded={open ? 'true' : undefined}
  onClick={handleClick}
>
  Menu
</Button>
<Menu
  id="basic-menu"
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  MenuListProps={{
    'aria-labelledby': 'menu-button',
  }}
>
  <MenuItem onClick={handleClose}>Profile</MenuItem>
  <MenuItem onClick={handleClose} aria-disabled="true" disabled>
    Disabled Option
  </MenuItem>
</Menu>
```

### Keyboard Navigation

**Supported Keys**:
- **Arrow Up/Down** - Navigate between menu items
- **Home** - Jump to first item
- **End** - Jump to last item
- **Enter/Space** - Activate current item
- **Escape** - Close menu
- **Tab** - Close menu and move focus to next tabbable element
- **Alphanumeric keys** - Jump to items starting with typed character (type-ahead)

**Keyboard Navigation Example**:
```jsx
function AccessibleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="true"
      >
        Accessible Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          autoFocus: true,  // Focus first item on open
        }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Apple</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Banana</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Cherry</MenuItem>
      </Menu>
    </>
  );
}
```

### Focus Management

**Auto-focus behavior**:
- `autoFocus={true}` (default) - Menu receives focus when opened
- `disableAutoFocusItem={false}` (default) - First item is focused
- With `variant="selectedMenu"` - Selected item is focused instead of first

**Custom focus control**:
```jsx
function ControlledFocusMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      autoFocus={false}  // Don't auto-focus menu
      MenuListProps={{
        autoFocus: false,  // Don't auto-focus first item
      }}
    >
      <MenuItem autoFocus>This item will be focused</MenuItem>
      <MenuItem>Regular item</MenuItem>
    </Menu>
  );
}
```

**Focus restoration**:
- Focus automatically returns to trigger element when menu closes
- Managed by Popover component
- Works correctly with keyboard and mouse interactions

### Known Accessibility Issues

**Disabled items and keyboard navigation**:
- **Issue**: According to ARIA APG menu pattern, disabled items should be focusable but not activatable
- **Current behavior**: Disabled items are skipped during keyboard navigation
- **Workaround**: If strict compliance needed, use custom styling instead of disabled prop

**Screen reader announcements**:
```jsx
// Proper labeling for screen readers
<Button
  id="demo-menu-button"
  aria-controls={open ? 'demo-menu' : undefined}
  aria-haspopup="true"
  aria-expanded={open ? 'true' : undefined}
  onClick={handleClick}
>
  Dashboard
</Button>
<Menu
  id="demo-menu"
  aria-labelledby="demo-menu-button"
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
>
  <MenuItem>Profile</MenuItem>
  <MenuItem>My account</MenuItem>
  <MenuItem>Logout</MenuItem>
</Menu>
```

---

## 8. Best Practices

### When to Use Menu vs Other Components

**Use Menu for**:
- Contextual actions tied to specific UI elements
- Navigation options (settings, logout, profile)
- Command palettes triggered by buttons
- Right-click context menus
- Overflow actions (three-dot menus)
- Action sheets on mobile

**Use Select instead for**:
- Form inputs requiring a single selection from predefined options
- Data entry in forms
- Replacing native `<select>` elements
- Filtering or sorting options

**Use Autocomplete instead for**:
- Large lists requiring search/filtering
- Searchable dropdowns
- Tag/token inputs
- Free-text entry with suggestions
- Async data loading from APIs

**Use Dialog/Modal instead for**:
- Complex forms or interactions
- Confirmation prompts requiring multiple actions
- Content requiring user's full attention

### Design Guidelines

**Menu Length**:
- Keep menus concise and scannable
- Group related items with Dividers
- For long lists (10+ items), implement scrolling with max-height
- Consider nested menus or alternate UI for very long lists

**Item Text**:
- Use clear, action-oriented labels ("Delete", "Edit", not "Click to delete")
- Keep labels short (1-3 words ideally)
- Use sentence case ("Edit profile", not "Edit Profile")
- Maintain consistent verb tenses

**Visual Hierarchy**:
- Use icons sparingly for better scannability
- Group related actions with dividers
- Place destructive actions (Delete, Remove) at bottom
- Disable unavailable actions rather than hiding them (provides context)

**Touch Targets**:
- Maintain minimum 44×44px touch targets for mobile
- Use `dense` prop sparingly - only for desktop interfaces
- Test on actual devices for touch usability

**State Management**:
```jsx
// Good: Single source of truth
const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

// Avoid: Separate open state that can get out of sync
const [anchorEl, setAnchorEl] = useState(null);
const [open, setOpen] = useState(false);  // Don't do this
```

**Close Behavior**:
```jsx
// Good: Close after action
<MenuItem onClick={() => {
  handleAction();
  handleClose();
}}>
  Action
</MenuItem>

// Good: Stay open for multi-select
<MenuItem onClick={handleToggleOption}>
  <Checkbox checked={isChecked} />
  Option
</MenuItem>
```

### Performance Considerations

**Conditional Rendering**:
```jsx
// Good: Only render when needed
{open && (
  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
    {/* items */}
  </Menu>
)}

// Also good: Use keepMounted for frequently opened menus
<Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  keepMounted  // Keeps DOM mounted, only hides
>
  {/* items */}
</Menu>
```

**Large Lists**:
```jsx
// Use max-height and scrolling instead of rendering 100+ items
<Menu
  slotProps={{
    paper: {
      sx: { maxHeight: 400 }
    }
  }}
>
  {items.map(item => (
    <MenuItem key={item.id}>{item.label}</MenuItem>
  ))}
</Menu>
```

### Common Patterns

**Confirmation before action**:
```jsx
function MenuWithConfirmation() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => {
    setAnchorEl(null);
    setConfirmOpen(true);
  };

  return (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmedDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

**Menu with keyboard shortcuts**:
```jsx
<MenuItem onClick={handleCopy}>
  <ListItemIcon>
    <ContentCopy fontSize="small" />
  </ListItemIcon>
  <ListItemText>Copy</ListItemText>
  <Typography variant="body2" color="text.secondary">
    ⌘C
  </Typography>
</MenuItem>
```

---

## 9. Comparison Notes - Material Design Approach

### Unique Material Design Characteristics

**Elevation System**:
- Material Design uses elevation (shadow depth) to show hierarchy
- Default elevation is 8 for menus
- Can be customized via `elevation` prop (0-24)
- Higher elevation = appears "above" other content

**Ripple Effect**:
- Material Design signature interaction feedback
- Applied to all MenuItems by default
- Can be disabled with `disableRipple` on MenuItem
- Provides visual confirmation of touch/click

**Popover-Based Architecture**:
- Menu is built on Popover component (not just positioned div)
- Inherits all Popover/Modal functionality
- Proper focus trap management
- Backdrop click handling
- Portal rendering by default

**Selected Menu Variant**:
- `variant="selectedMenu"` (default) - Focuses selected item when opened
- `variant="menu"` - Focuses first item, ignoring selection
- Unique to Material Design's menu patterns

**Transform Origin Animation**:
- Menu animates from `transformOrigin` point
- Creates visual connection between trigger and menu
- Smooth scale + fade transition
- Configurable animation duration

### Differences from Other Frameworks

**vs Bootstrap Dropdowns**:
- Material Design uses Popover (Portal-based), Bootstrap uses positioned divs
- MUI has built-in elevation system vs Bootstrap's box-shadow
- MUI includes ripple effects by default
- Material Design has stricter positioning system (origins vs simple offsets)

**vs Headless UI Menu**:
- MUI includes full styling, Headless UI is unstyled
- Material Design has opinionated design system
- MUI has theme integration built-in
- Headless UI is more flexible for custom designs

**vs Ant Design Dropdown**:
- Material Design uses "Menu" terminology, Ant uses "Dropdown"
- MUI separates Menu/Select concerns more strictly
- Material Design has elevation-based hierarchy
- Ant Design has different overlay positioning system

**Material Design Principles Reflected**:
- **Material as Metaphor**: Elevation creates depth perception
- **Bold, Graphic, Intentional**: High contrast, clear hierarchy
- **Motion Provides Meaning**: Transform origin shows relationship
- **Adaptive Design**: Responsive positioning, works across devices

### Material Design Menu Specifications

**Spacing**:
- Default menu item height: 48px (dense: 32px)
- Horizontal padding: 16px
- Vertical padding: 6px (dense: 4px)
- Icon margin: 16px from edge

**Typography**:
- Menu items use `body1` variant by default
- Font size: 16px (1rem)
- Font weight: 400 (regular)
- Line height: 1.5

**Colors**:
- Menu background: `background.paper` theme token
- Item text: `text.primary`
- Disabled text: `text.disabled`
- Selected background: `action.selected` (usually 8% primary color)
- Hover background: `action.hover` (usually 4% primary color)

**Shadows**:
- Default: elevation 8
- Shadow blur: Material Design shadow algorithm
- Follows Material Design elevation guidelines

---

## 10. Additional Resources

### Official Documentation
- Main docs: https://mui.com/material-ui/react-menu/
- Menu API: https://mui.com/material-ui/api/menu/
- MenuItem API: https://mui.com/material-ui/api/menu-item/
- MenuList API: https://mui.com/material-ui/api/menu-list/
- Popover API (inherited): https://mui.com/material-ui/api/popover/

### Material Design Specifications
- Menu design guidelines: https://m3.material.io/components/menus/overview
- Material Design 3: https://m3.material.io/

### Community Resources
- Nested menu package: https://www.npmjs.com/package/mui-nested-menu
- Stack Overflow MUI tag: https://stackoverflow.com/questions/tagged/material-ui
- MUI GitHub discussions: https://github.com/mui/material-ui/discussions

### Related Components
- Select: https://mui.com/material-ui/react-select/
- Autocomplete: https://mui.com/material-ui/react-autocomplete/
- List: https://mui.com/material-ui/react-list/
- Popover: https://mui.com/material-ui/react-popover/
- Divider: https://mui.com/material-ui/react-divider/

---

## Summary

MUI Menu is a comprehensive, Material Design-compliant dropdown/menu component that provides:

- **Flexible positioning** via anchorOrigin and transformOrigin
- **Rich composition** with MenuItem, MenuList, ListItemIcon, Divider, etc.
- **Multiple styling approaches** (sx prop, styled components, theme customization)
- **Full accessibility** with ARIA, keyboard navigation, and focus management
- **Material Design integration** including elevation, ripple effects, and animations
- **Extensibility** through props inheritance from Popover and Modal

The component is production-ready, well-documented, and suitable for a wide range of use cases from simple action menus to complex navigation patterns. Its distinction from Select and Autocomplete components makes it ideal for contextual actions rather than form data entry.
