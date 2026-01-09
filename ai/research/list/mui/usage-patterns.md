# MUI (Material-UI) - List Component Usage Patterns

## Component URL
https://mui.com/material-ui/react-list/
Status: ✅ Working (verified via web search)
API References:
- https://mui.com/material-ui/api/list/
- https://mui.com/material-ui/api/list-item/
- https://mui.com/material-ui/api/list-item-button/
- https://mui.com/material-ui/api/list-subheader/
Version: Current (v5+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides extensive documentation with interactive examples, complete API reference for all sub-components, code patterns, and accessibility guidance.

---

## 1. Component Overview

The MUI List component is a Material Design implementation for displaying an ordered or unordered collection of items. Unlike simple HTML lists, MUI's List is a composition-based system consisting of multiple coordinated sub-components (List, ListItem, ListItemButton, ListItemIcon, ListItemAvatar, ListItemText, ListSubheader, ListDivider) that work together to create rich, interactive list experiences. Lists are commonly used for navigation, displaying data collections, settings panels, and multi-select interfaces. MUI's list system emphasizes accessibility, keyboard navigation, and Material Design principles including ripple effects and proper spacing.

---

## 2. Core Sub-Components

The MUI List system is composed of multiple components working together:

### List (Parent Container)
**Purpose**: Wrapper component that renders as `<ul>` or `<ol>` element. Manages the overall list structure and spacing.

**Key Characteristics**:
- Renders semantic HTML list element (`<ul>` by default)
- Can be changed to `<ol>` for ordered lists via `component` prop
- Handles padding and vertical spacing of list items
- Can render as `<nav>` for navigation lists
- Root component provides baseline styles

**Basic Example**:
```jsx
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

<List>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</List>
```

### ListItem (Individual Item Container)
**Purpose**: Container for a single list entry. Renders as `<li>` element. Provides baseline spacing and interaction surface.

**Key Characteristics**:
- Renders semantic `<li>` element by default
- Can accept `ListItemButton`, `ListItemText`, `ListItemIcon`, `ListItemAvatar` as children
- Supports dense spacing via `dense` prop
- Can be `selected` and `disabled`
- Provides consistent padding and height

**Basic Example**:
```jsx
<ListItem>
  <ListItemText primary="Item title" secondary="Optional description" />
</ListItem>
```

**Props**:
- `dense` (boolean) - Compact spacing for dense lists
- `selected` (boolean) - Visual selection state
- `disabled` (boolean) - Disabled interaction
- `alignItems` ('flex-start' | 'center') - Vertical alignment of children
- `disableGutters` (boolean) - Remove left/right padding
- `divider` (boolean) - Add bottom border

### ListItemButton (Interactive Action Element)
**Purpose**: Clickable/interactive list item element. Provides ripple effects, focus states, and hover interactions per Material Design.

**Key Characteristics**:
- Inherits from `ButtonBase` - provides ripple effect by default
- Renders as `<div>` with `button` role
- Full keyboard navigation support
- Provides hover and focus visual feedback
- Can be `selected` for selection patterns
- Supports `dense` mode

**Common Pattern**:
```jsx
<ListItem disablePadding>
  <ListItemButton>
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Inbox" />
  </ListItemButton>
</ListItem>
```

**Props**:
- `selected` (boolean) - Selected/active state
- `dense` (boolean) - Compact spacing
- `divider` (boolean) - Add bottom border
- `disableGutters` (boolean) - Remove padding
- `component` (string | element) - Change root element
- `href` (string) - Make it a link
- `to` (string) - React Router integration
- `disabled` (boolean) - Disabled state
- `onClick` (function) - Click handler

### ListItemIcon (Icon Container)
**Purpose**: Container for icons within list items. Ensures proper sizing and alignment.

**Key Characteristics**:
- Provides fixed width for icon area
- Aligns icons vertically with text
- Designed to work with `ListItemText`
- Typically holds MUI icons or custom SVGs

**Example**:
```jsx
<ListItem>
  <ListItemIcon>
    <InboxIcon />
  </ListItemIcon>
  <ListItemText primary="Inbox" />
</ListItem>
```

### ListItemAvatar (Avatar Container)
**Purpose**: Container for avatars (profile images) within list items. Similar to ListItemIcon but optimized for avatar sizing.

**Key Characteristics**:
- Provides appropriate spacing for avatars
- Works with MUI Avatar component
- Aligns avatar with text content
- Alternative to ListItemIcon for image-based indicators

**Example**:
```jsx
import Avatar from '@mui/material/Avatar';

<ListItem>
  <ListItemAvatar>
    <Avatar src="avatar-url" alt="User" />
  </ListItemAvatar>
  <ListItemText primary="User Name" secondary="Last message" />
</ListItem>
```

### ListItemText (Text Content Container)
**Purpose**: Container and formatter for text content within list items. Handles primary and secondary text with automatic styling.

**Key Characteristics**:
- Renders primary (main) and secondary (subtitle) text
- Handles text overflow and ellipsis
- Applies appropriate typography and colors
- Secondary text is gray/muted by default
- Supports `inset` prop to add left padding

**Props**:
- `primary` (node | string) - Main text content
- `secondary` (node | string) - Subtitle/helper text
- `primaryTypographyProps` (object) - Props for primary text (e.g., `variant`, `color`)
- `secondaryTypographyProps` (object) - Props for secondary text
- `inset` (boolean) - Add left padding (for items without icon)
- `disableTypography` (boolean) - Use raw children without Typography wrapper

**Example**:
```jsx
<ListItemText
  primary="Main heading"
  secondary="Subtitle or description"
  primaryTypographyProps={{ variant: 'subtitle1' }}
  secondaryTypographyProps={{ color: 'textSecondary' }}
/>
```

### ListSubheader (Section Header)
**Purpose**: Non-interactive header/label for grouping list items into sections.

**Key Characteristics**:
- Renders as `<li role="presentation">` containing a header
- Sticky positioning possible via `sticky` prop
- Typically used for section labels
- Can group related items visually

**Example**:
```jsx
<List>
  <ListSubheader>Section A</ListSubheader>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListSubheader>Section B</ListSubheader>
  <ListItem>Item 3</ListItem>
</List>
```

**Props**:
- `sticky` (boolean) - Sticky positioning on scroll
- `color` ('inherit' | 'primary' | 'textPrimary') - Text color
- `disableSticky` (boolean) - Disable sticky behavior
- `component` (string | element) - Root element

### ListDivider (Separator)
**Purpose**: Visual separator between list items. Uses `<Divider>` component within lists.

**Key Characteristics**:
- Horizontal line separator
- Can use `variant="inset"` to add left padding
- Often used as `component="li"` for proper HTML structure

**Example**:
```jsx
import Divider from '@mui/material/Divider';

<List>
  <ListItem>Item 1</ListItem>
  <Divider component="li" />
  <ListItem>Item 2</ListItem>
</List>
```

---

## 3. Props & API

### List Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | List items and sub-components |
| `component` | elementType | `'ul'` | Root element type ('ul', 'ol', 'nav', 'div') |
| `dense` | boolean | `false` | Compact spacing for all children |
| `disablePadding` | boolean | `false` | Remove padding |
| `subheader` | node | - | Optional subheader content |
| `sx` | object | - | System prop for custom styling |
| `className` | string | - | CSS class name |

### ListItem Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignItems` | 'flex-start' \| 'center' | 'center' | Vertical alignment of children |
| `children` | node | - | Item content (text, icons, etc.) |
| `component` | elementType | `'li'` | Root element type |
| `dense` | boolean | `false` | Compact spacing |
| `disabled` | boolean | `false` | Disables item |
| `disableGutters` | boolean | `false` | Remove padding |
| `divider` | boolean | `false` | Add bottom border |
| `selected` | boolean | `false` | Selection state styling |
| `secondaryAction` | node | - | Content for right side (e.g., IconButton) |
| `sx` | object | - | System prop for custom styling |

### ListItemButton Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignItems` | 'flex-start' \| 'center' | 'center' | Vertical alignment |
| `autoFocus` | boolean | `false` | Auto focus on mount |
| `children` | node | - | Button content |
| `component` | elementType | `'div'` | Root element (can be 'a' for links) |
| `dense` | boolean | `false` | Compact spacing |
| `disabled` | boolean | `false` | Disables button |
| `disableGutters` | boolean | `false` | Remove padding |
| `divider` | boolean | `false` | Add bottom border |
| `href` | string | - | Link href (converts to anchor) |
| `selected` | boolean | `false` | Selected/active state |
| `disableTouchRipple` | boolean | `false` | Disable ripple on touch |
| `disableRipple` | boolean | `false` | Disable ripple effect |
| `focusVisibleClassName` | string | - | Custom focus class |
| `onFocusVisible` | function | - | Focus visible handler |
| `sx` | object | - | System prop for custom styling |

### ListItemIcon & ListItemAvatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Icon or avatar element |
| `sx` | object | - | System prop for custom styling |

### ListItemText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disableTypography` | boolean | `false` | Disable Typography wrapper |
| `inset` | boolean | `false` | Add left padding (for items without icon) |
| `primary` | node \| string | - | Main text content |
| `primaryTypographyProps` | object | - | Props for primary Typography component |
| `secondary` | node \| string | - | Subtitle text |
| `secondaryTypographyProps` | object | - | Props for secondary Typography component |
| `sx` | object | - | System prop for custom styling |

### ListSubheader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Subheader content |
| `color` | 'inherit' \| 'primary' \| 'textPrimary' | 'textPrimary' | Text color |
| `component` | elementType | `'li'` | Root element |
| `disableSticky` | boolean | `false` | Disable sticky positioning |
| `disableGutters` | boolean | `false` | Remove padding |
| `inset` | boolean | `false` | Add left padding |
| `sticky` | boolean | `false` | Sticky positioning on scroll |
| `sx` | object | - | System prop for custom styling |

---

## 4. Usage Patterns

### Simple List with Text

```jsx
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

<List>
  <ListItem>
    <ListItemText primary="First item" />
  </ListItem>
  <ListItem>
    <ListItemText primary="Second item" />
  </ListItem>
  <ListItem>
    <ListItemText primary="Third item" />
  </ListItem>
</List>
```

### List with Icons and Text

```jsx
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';

<List>
  <ListItem>
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Inbox" secondary="Unread: 5" />
  </ListItem>
  <ListItem>
    <ListItemIcon>
      <SendIcon />
    </ListItemIcon>
    <ListItemText primary="Sent" />
  </ListItem>
  <ListItem>
    <ListItemIcon>
      <DraftsIcon />
    </ListItemIcon>
    <ListItemText primary="Drafts" secondary="3 drafts" />
  </ListItem>
</List>
```

### Clickable/Interactive List (ListItemButton)

```jsx
<List>
  <ListItem disablePadding>
    <ListItemButton selected>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox (Selected)" />
    </ListItemButton>
  </ListItem>
  <ListItem disablePadding>
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
    </ListItemButton>
  </ListItem>
</List>
```

### List with Avatars (User/Contact List)

```jsx
import Avatar from '@mui/material/Avatar';

<List>
  <ListItem>
    <ListItemAvatar>
      <Avatar src="avatar1.jpg" alt="Alice" />
    </ListItemAvatar>
    <ListItemText
      primary="Alice Johnson"
      secondary="Hey, how are you?"
    />
  </ListItem>
  <ListItem>
    <ListItemAvatar>
      <Avatar src="avatar2.jpg" alt="Bob" />
    </ListItemAvatar>
    <ListItemText
      primary="Bob Smith"
      secondary="Let's meet tomorrow"
    />
  </ListItem>
</List>
```

### Dense/Compact List

```jsx
<List dense>
  <ListItem>
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Item 1" />
  </ListItem>
  <ListItem>
    <ListItemIcon>
      <SendIcon />
    </ListItemIcon>
    <ListItemText primary="Item 2" />
  </ListItem>
</List>
```

### List with Dividers

```jsx
import Divider from '@mui/material/Divider';

<List>
  <ListItem>
    <ListItemText primary="Item 1" />
  </ListItem>
  <Divider component="li" />
  <ListItem>
    <ListItemText primary="Item 2" />
  </ListItem>
  <Divider component="li" />
  <ListItem>
    <ListItemText primary="Item 3" />
  </ListItem>
</List>
```

### Inset Divider (for items without icons)

```jsx
<List>
  <ListItem>
    <ListItemText primary="Item 1" />
  </ListItem>
  <Divider component="li" variant="inset" />
  <ListItem>
    <ListItemText primary="Item 2" inset />
  </ListItem>
</List>
```

### Nested/Hierarchical Lists

```jsx
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const [open, setOpen] = useState(false);

const handleClick = () => {
  setOpen(!open);
};

<List>
  <ListItem disablePadding>
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary="Folder" />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  </ListItem>
  <Collapse in={open} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <ListItem sx={{ pl: 4 }}>
        <ListItemIcon>
          <FileIcon />
        </ListItemIcon>
        <ListItemText primary="Nested File 1" />
      </ListItem>
      <ListItem sx={{ pl: 4 }}>
        <ListItemIcon>
          <FileIcon />
        </ListItemIcon>
        <ListItemText primary="Nested File 2" />
      </ListItem>
    </List>
  </Collapse>
</List>
```

### List with Subheaders

```jsx
<List subheader={<ListSubheader>Categories</ListSubheader>}>
  <ListSubheader>Category A</ListSubheader>
  <ListItem>
    <ListItemText primary="Item A1" />
  </ListItem>
  <ListItem>
    <ListItemText primary="Item A2" />
  </ListItem>

  <ListSubheader>Category B</ListSubheader>
  <ListItem>
    <ListItemText primary="Item B1" />
  </ListItem>
  <ListItem>
    <ListItemText primary="Item B2" />
  </ListItem>
</List>
```

### Sticky Subheader (on scroll)

```jsx
<List sx={{ maxHeight: 300, overflow: 'auto' }}>
  <ListSubheader sticky>
    Category A
  </ListSubheader>
  {/* Many items... */}
  <ListSubheader sticky>
    Category B
  </ListSubheader>
  {/* More items... */}
</List>
```

### List with Secondary Actions (Checkboxes, Buttons)

```jsx
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

<List>
  <ListItem
    secondaryAction={
      <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    }
  >
    <ListItemIcon>
      <Checkbox edge="start" />
    </ListItemIcon>
    <ListItemText primary="Item with secondary action" />
  </ListItem>
</List>
```

### Navigation List

```jsx
<List component="nav">
  <ListItem disablePadding>
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
  </ListItem>
  <ListItem disablePadding>
    <ListItemButton component={Link} to="/profile">
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
  </ListItem>
</List>
```

### Selectable List (Multi-select)

```jsx
const [selectedIndex, setSelectedIndex] = useState(0);

const handleListItemClick = (index) => {
  setSelectedIndex(index);
};

<List>
  {['Inbox', 'Sent', 'Drafts'].map((label, index) => (
    <ListItem disablePadding key={label}>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={() => handleListItemClick(index)}
      >
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  ))}
</List>
```

### Disabled List Items

```jsx
<List>
  <ListItem>
    <ListItemText primary="Enabled item" />
  </ListItem>
  <ListItem disabled>
    <ListItemText primary="Disabled item" />
  </ListItem>
  <ListItem disabled>
    <ListItemText primary="Another disabled item" secondary="With description" />
  </ListItem>
</List>
```

### List with Custom Styling (sx Prop)

```jsx
<List
  sx={{
    maxWidth: 360,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1
  }}
>
  <ListItem
    sx={{
      '&:hover': {
        bgcolor: 'action.hover'
      }
    }}
  >
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Custom styled item" />
  </ListItem>
</List>
```

### List with Inset Padding (for items without icons)

```jsx
<List>
  <ListItem>
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Item with icon" />
  </ListItem>
  <ListItem>
    <ListItemText primary="Item without icon (inset)" inset />
  </ListItem>
</List>
```

---

## 5. Composition Patterns

### FormControl Integration

```jsx
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

<FormControl component="fieldset">
  <FormLabel component="legend">Choose items</FormLabel>
  <List>
    <ListItem>
      <ListItemIcon>
        <Checkbox />
      </ListItemIcon>
      <ListItemText primary="Option 1" />
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <Checkbox />
      </ListItemIcon>
      <ListItemText primary="Option 2" />
    </ListItem>
  </List>
</FormControl>
```

### Dialog with List Selection

```jsx
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Select an option</DialogTitle>
  <List sx={{ pt: 0 }}>
    {options.map((option) => (
      <ListItem
        button
        key={option}
        onClick={() => {
          handleSelect(option);
          handleClose();
        }}
      >
        <ListItemText primary={option} />
      </ListItem>
    ))}
  </List>
</Dialog>
```

### Paper Container

```jsx
import Paper from '@mui/material/Paper';

<Paper elevation={2}>
  <List>
    <ListItem>
      <ListItemText primary="Card-like list" />
    </ListItem>
    <Divider />
    <ListItem>
      <ListItemText primary="With elevation" />
    </ListItem>
  </List>
</Paper>
```

### GridList with List Items

```jsx
// Multiple columns using CSS Grid
<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
  <List>
    {/* First column items */}
  </List>
  <List>
    {/* Second column items */}
  </List>
</Box>
```

---

## 6. Styling & Theming

### Using the sx Prop

```jsx
<List
  sx={{
    bgcolor: 'primary.light',
    borderRadius: 2,
    '& .MuiListItem-root': {
      pl: 3,
      '&:hover': {
        bgcolor: 'action.hover'
      }
    }
  }}
>
  <ListItem>
    <ListItemText primary="Styled item" />
  </ListItem>
</List>
```

### Targeting Sub-Components

```jsx
<List
  sx={{
    '& .MuiListItemIcon-root': {
      color: 'primary.main'
    },
    '& .MuiListItemText-secondary': {
      color: 'text.disabled'
    }
  }}
>
  <ListItem>
    <ListItemIcon>
      <InboxIcon />
    </ListItemIcon>
    <ListItemText primary="Main" secondary="Secondary" />
  </ListItem>
</List>
```

### Theme Customization

```jsx
const theme = createTheme({
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.light,
          },
        },
      },
    },
  },
});
```

### CSS Classes for Customization

Available MUI CSS classes:
- `.MuiList-root` - Root list element
- `.MuiListItem-root` - Individual list item
- `.MuiListItemButton-root` - Interactive button element
- `.MuiListItemIcon-root` - Icon container
- `.MuiListItemAvatar-root` - Avatar container
- `.MuiListItemText-root` - Text content container
- `.MuiListItemText-primary` - Primary text
- `.MuiListItemText-secondary` - Secondary text
- `.MuiListSubheader-root` - Subheader element
- `.MuiListDivider-root` - (Uses `Divider` classes)

---

## 7. Accessibility

### ARIA & Semantic HTML

```jsx
// Proper semantic list with navigation
<List component="nav" aria-label="main navigation">
  <ListItem disablePadding>
    <ListItemButton>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
  </ListItem>
</List>

// For selection lists
<List role="listbox">
  <ListItem role="option" selected>
    <ListItemText primary="Selected Option" />
  </ListItem>
</List>
```

### Keyboard Navigation

- **Tab**: Focus through interactive items (ListItemButton)
- **Space/Enter**: Activate ListItemButton
- **Arrow Keys**: Navigate between items (custom implementation required)
- **Home/End**: Navigate to first/last item (custom implementation required)

### Screen Reader Support

- Semantic HTML ensures screen readers announce list structure
- Primary and secondary text announced appropriately
- Icons with labels/aria-labels are announced
- Selected/disabled states announced automatically
- Subheaders announce as landmarks

### Best Practices for Accessibility

1. **Always use semantic components**:
   ```jsx
   // Good - semantic structure
   <List component="nav">
     <ListItem disablePadding>
       <ListItemButton>

   // Bad - div with list styling
   <div className="list">
   ```

2. **Provide descriptive text**:
   ```jsx
   <ListItem>
     <ListItemText primary="Main heading" secondary="Description" />
   </ListItem>
   ```

3. **Label interactive items**:
   ```jsx
   <ListItemButton aria-label="Delete item">
     <DeleteIcon />
   </ListItemButton>
   ```

4. **Use proper list structure for navigation**:
   ```jsx
   <List component="nav" aria-label="Sidebar navigation">
     {/* Navigation items */}
   </List>
   ```

5. **Mark disabled items properly**:
   ```jsx
   <ListItem disabled aria-disabled="true">
     <ListItemText primary="Disabled option" />
   </ListItem>
   ```

---

## 8. Best Practices

### When to Use Lists

✅ **Use lists for:**
- Navigation menus and sidebars
- Displaying collections of items (emails, messages, contacts)
- Multi-select interfaces
- Settings/preferences panels
- Displaying hierarchical/nested data
- Displaying data rows (light tables)

### When NOT to Use Lists

❌ **Don't use lists for:**
- Complex tabular data (use Table component instead)
- Form layouts (use Form components)
- Grid-based layouts (use Grid component)
- Card collections (consider Card Deck or Grid)

### Performance Considerations

1. **Virtualization for Long Lists**:
   - For 1000+ items, use virtualization library (react-window, react-virtualized)
   - MUI doesn't provide built-in virtualization

2. **Memoization**:
   ```jsx
   const ListItemMemo = React.memo(({ item, onSelect }) => (
     <ListItem onClick={() => onSelect(item.id)}>
       <ListItemText primary={item.name} />
     </ListItem>
   ));
   ```

3. **Avoid Inline Functions**:
   ```jsx
   // Bad - creates new function each render
   <ListItemButton onClick={() => handleClick(item.id)}>

   // Good - use useCallback
   const handleClickItem = useCallback((id) => {
     // Handle click
   }, []);
   <ListItemButton onClick={() => handleClickItem(item.id)}>
   ```

### Common Patterns

**Search/Filter List**:
```jsx
const [filter, setFilter] = useState('');

const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(filter.toLowerCase())
);

<>
  <TextField
    placeholder="Search..."
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  />
  <List>
    {filteredItems.map(item => (
      <ListItem key={item.id}>
        <ListItemText primary={item.name} />
      </ListItem>
    ))}
  </List>
</>
```

**Sortable List**:
```jsx
const [items, setItems] = useState(initialItems);
const [sortBy, setSortBy] = useState('name');

const sorted = [...items].sort((a, b) => {
  return a[sortBy].localeCompare(b[sortBy]);
});

<List>
  {sorted.map(item => (
    <ListItem key={item.id}>
      <ListItemText primary={item[sortBy]} />
    </ListItem>
  ))}
</List>
```

**Paginated List**:
```jsx
const [page, setPage] = useState(0);
const itemsPerPage = 10;

const start = page * itemsPerPage;
const end = start + itemsPerPage;
const pageItems = items.slice(start, end);

<>
  <List>
    {pageItems.map(item => (
      <ListItem key={item.id}>
        <ListItemText primary={item.name} />
      </ListItem>
    ))}
  </List>
  <Pagination
    count={Math.ceil(items.length / itemsPerPage)}
    page={page + 1}
    onChange={(_, value) => setPage(value - 1)}
  />
</>
```

### Material Design Guidelines

1. **Touch Targets**: Ensure list items are at least 48x48px for touch devices
2. **Spacing**: Use `dense` prop for compact UIs
3. **Icons**: Use Material Icons consistently
4. **Ripple Effect**: Enable by default for interactive items
5. **Focus States**: Clearly visible for keyboard navigation
6. **Grouping**: Use subheaders for logical grouping
7. **Dividers**: Use inset dividers for items without icons

---

## 9. Unique Material Design Features

### 1. Ripple Effect
- Default on `ListItemButton`
- Provides Material Design tactile feedback
- Can be disabled with `disableRipple` prop

### 2. Selected State
- Built-in styling for selected items
- Typically with highlight color from theme

### 3. Avatar Integration
- `ListItemAvatar` component specifically for avatars
- Proper sizing and spacing built-in
- Common in messaging/contact lists

### 4. Secondary Action
- `secondaryAction` prop on `ListItem`
- Allows icons/buttons on right side (checkboxes, delete buttons, etc.)
- Automatically positioned

### 5. Dense Mode
- Compact spacing option for dense information display
- Applied to entire list or individual items
- Reduces height and padding

### 6. Inset Variants
- `inset` prop on `ListItemText` and `Divider`
- Adds left padding to items without icons
- Maintains visual alignment

### 7. Sticky Subheaders
- `sticky` prop on `ListSubheader`
- Subheader stays visible while scrolling
- Common in long lists with sections

### 8. Theme Integration
- Automatic color theme inheritance
- Responds to light/dark mode
- Global customization via theme configuration

---

## 10. Comparison Notes

### Unique to Material-UI Lists

1. **Composition-Based Design**: MUI emphasizes composition with multiple sub-components rather than a monolithic component with many props

2. **Secondary Action**: Built-in `secondaryAction` prop for icons/buttons on the right side of items

3. **ListSubheader with Sticky**: Native sticky header support on subheaders

4. **Dense Mode**: Explicit `dense` prop for compact layouts across entire list or individual items

5. **ListItemButton Inheritance**: ListItemButton inherits from ButtonBase, providing ripple effects and focus-visible states automatically

6. **Avatar Container**: Dedicated `ListItemAvatar` component for avatar support

7. **Inset Variants**: Built-in inset options for both text and dividers to maintain visual alignment

8. **Material Design Ripple**: Signature Material Design ripple effect on interactive list items

9. **Semantic Component**: Renders as semantic HTML (`<ul>`, `<ol>`, `<li>`) by default, can be customized with `component` prop

10. **Theming System**: Deep integration with MUI's theming system - colors, spacing, and styles can be globally configured

### Material Design Philosophy Applied to Lists

- **Visual Hierarchy**: Primary and secondary text with appropriate typography
- **Touch-Friendly**: Minimum 48x48px touch targets for list items
- **Consistent Spacing**: Material Design spacing system applied throughout
- **Accessibility First**: Semantic HTML and ARIA attributes built-in
- **Responsive**: Adapts to different screen sizes and input methods
- **Dark Mode Support**: Automatic theming for light/dark modes

---

## 11. Advanced Patterns

### Collapsible List with Nested Items

```jsx
const [expandedId, setExpandedId] = useState(null);

const items = [
  { id: 1, title: 'Folder 1', children: ['File 1.1', 'File 1.2'] },
  { id: 2, title: 'Folder 2', children: ['File 2.1', 'File 2.2'] }
];

<List>
  {items.map(item => (
    <React.Fragment key={item.id}>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
          <ListItemIcon>
            {expandedId === item.id ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      </ListItem>
      <Collapse in={expandedId === item.id} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((child, idx) => (
            <ListItem key={idx} sx={{ pl: 4 }}>
              <ListItemText primary={child} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  ))}
</List>
```

### Drag and Drop List

```jsx
// Using react-beautiful-dnd or similar
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="items">
    {(provided) => (
      <List {...provided.droppableProps} ref={provided.innerRef}>
        {items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <ListItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <ListItemText primary={item.name} />
              </ListItem>
            )}
          </Draggable>
        ))}
      </List>
    )}
  </Droppable>
</DragDropContext>
```

### Virtualized List for Performance

```jsx
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>
    <ListItem>
      <ListItemText primary={`Item ${index}`} />
    </ListItem>
  </div>
);

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={56}
  width="100%"
>
  {Row}
</FixedSizeList>
```

### Editable List

```jsx
const [items, setItems] = useState(['Item 1', 'Item 2']);
const [editingId, setEditingId] = useState(null);
const [editValue, setEditValue] = useState('');

const handleSave = (id, value) => {
  const newItems = items.map((item, idx) => idx === id ? value : item);
  setItems(newItems);
  setEditingId(null);
};

<List>
  {items.map((item, idx) => (
    <ListItem key={idx} disablePadding>
      {editingId === idx ? (
        <TextField
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleSave(idx, editValue)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave(idx, editValue)}
          fullWidth
          variant="standard"
        />
      ) : (
        <ListItemButton onClick={() => { setEditingId(idx); setEditValue(item); }}>
          <ListItemText primary={item} />
        </ListItemButton>
      )}
    </ListItem>
  ))}
</List>
```

---

## Research Notes

### Documentation Coverage
- MUI List documentation is comprehensive and well-maintained
- Clear separation of concerns with multiple specialized sub-components
- Interactive examples available in the official documentation
- Multiple API reference pages for each component

### API Design Philosophy
- **Composition Over Configuration**: Use multiple smaller components rather than one large component with many props
- **Material Design Compliance**: Follows Material Design specifications for spacing, typography, and interactions
- **System Prop Pattern**: `sx` prop provides direct access to theme and styling
- **Semantic HTML First**: Components render semantic HTML elements by default, fully customizable via `component` prop

### Notable Design Decisions
1. **No Built-in Virtualization**: Developers must add virtualization libraries for large lists
2. **ButtonBase Inheritance**: ListItemButton inherits from ButtonBase for consistency with other MUI buttons
3. **Separate Avatar Component**: ListItemAvatar keeps avatar-specific styling separate
4. **Sticky Subheader**: Sticky positioning is a built-in feature, not via CSS
5. **Secondary Action Pattern**: RHS actions via `secondaryAction` prop is more elegant than composition

### Unique Strengths
1. **Material Design Excellence**: Best-in-class implementation of Material Design list patterns
2. **Composition Flexibility**: Multiple sub-components allow fine-grained control
3. **Theming System**: Deep integration with MUI's powerful theming system
4. **Accessibility**: Semantic HTML and ARIA support built-in by default
5. **Secondary Actions**: Purpose-built pattern for RHS icons/buttons
6. **Performance Awareness**: Documentation acknowledges virtualization for large lists

### Weaknesses/Limitations
1. **No Built-in Virtualization**: Requires external libraries for very large lists
2. **Complex for Simple Cases**: Can be verbose for very simple lists
3. **Learning Curve**: Multiple components to understand
4. **Sticky Subheader CSS**: Requires flex overflow container setup

---

## Key Takeaways

1. **MUI List is a Composition of Multiple Components**: List, ListItem, ListItemButton, ListItemIcon, ListItemAvatar, ListItemText, ListSubheader all work together

2. **Five Main Sub-Component Categories**:
   - **Container**: List (wrapper)
   - **Items**: ListItem (container), ListItemButton (interactive)
   - **Content**: ListItemText (primary + secondary text)
   - **Indicators**: ListItemIcon (icons), ListItemAvatar (avatars)
   - **Structure**: ListSubheader (sections)

3. **Dense Mode is Built-In**: Single `dense` prop applies to entire list or individual items

4. **Material Design Ripple Included**: ListItemButton provides ripple effect automatically

5. **Secondary Actions Pattern**: RHS icons/buttons via `secondaryAction` prop is elegant and common

6. **Sticky Subheader Support**: Native sticky positioning on subheaders

7. **Theme Integration Deep**: Colors, spacing, and appearance fully themeable

8. **Semantic HTML by Default**: Renders proper `<ul>`, `<ol>`, `<li>` elements

9. **No Virtualization Built-In**: Large lists require external virtualization library

10. **Accessibility First**: ARIA attributes and semantic HTML ensure accessibility by default

---

## Conclusion

MUI's List component is a comprehensive, composition-based system for displaying ordered collections of items. Its strength lies in the flexibility of composition while maintaining Material Design consistency. The system excels at:
- Creating accessible, semantic HTML lists
- Providing Material Design visual feedback (ripple, selection states)
- Supporting complex patterns (nested lists, secondary actions, avatars, icons)
- Integrating with MUI's theming system
- Handling dense layouts efficiently

The primary trade-off is that simple lists require multiple components working together, though this composition approach provides excellent flexibility for more complex scenarios.
