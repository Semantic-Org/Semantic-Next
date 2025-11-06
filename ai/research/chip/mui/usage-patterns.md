# MUI - Chip Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-chip/
Status: ✅ Working
Version: MUI v5.x (Current)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides detailed API documentation with interactive examples, code snippets, and extensive prop descriptions.

## Component Definition
- **Core purpose**: Displays compact, interactive elements representing tags, selections, contacts, or removable items. Chips provide a way to represent small pieces of information that can be selected, removed, or trigger actions.
- **Mental model**: A "pill-shaped" badge that can contain text, icons, avatars, and delete actions. Users think of chips as tags or tokens that can be added to or removed from a collection.
- **Semantic meaning**: Represents an entity (person, tag, filter) that has been selected or can be selected. Communicates categorization, selection state, or input value in forms and filters.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="primary"`, `size="small"`)
- **Composed**: Via composition/children (e.g., custom content within chip)
- **CSS-only**: Requires custom styling (e.g., `sx={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `label` prop accepts string or node for chip text |
| Icons | ✅ | Native | `icon` prop for leading icon element (Material-UI icons or custom) |
| Avatars/Images | ✅ | Native | `avatar` prop for leading Avatar component with image or initials |
| Close/Remove button | ✅ | Native | `onDelete` prop displays delete icon automatically; `deleteIcon` prop customizes icon |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ✅ | Native | `clickable` prop (boolean) enables hover effects; visual feedback via `onClick` handler |
| Disabled | ✅ | Native | `disabled` prop (boolean) disables interaction and reduces opacity |
| Loading | ❌ | CSS-only | No native loading state; requires custom implementation via `sx` prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop: 'default', 'primary', 'secondary', 'error', 'info', 'success', 'warning' |
| Size options | ✅ | Native | `size` prop: 'small', 'medium' (default) |
| Visual variants | ✅ | Native | `variant` prop: 'filled' (default), 'outlined' |
| Bordered/Borderless | ✅ | Native | Controlled via `variant` prop - 'filled' is borderless, 'outlined' has border |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Native | `onClick` handler makes chip interactive with hover/focus effects; `clickable` prop explicit control |
| Closable/Removable | ✅ | Native | `onDelete` handler displays delete icon; triggers on click or keyboard (Backspace/Delete when focused, Escape blurs) |
| onClick handler | ✅ | Native | Function called when chip body is clicked; provides automatic hover/focus styling |
| onDelete handler | ✅ | Native | Function called when delete icon is clicked or keyboard shortcut used; delete icon appears automatically |

## Code Examples

### Basic Chip
```jsx
import Chip from '@mui/material/Chip';

// Simple text chip
<Chip label="Basic Chip" />

// With variant
<Chip label="Filled" variant="filled" />
<Chip label="Outlined" variant="outlined" />
```
[View Live](https://mui.com/material-ui/react-chip/#basic-chip)

### Chip with Colors
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

<Stack direction="row" spacing={1}>
  <Chip label="Default" />
  <Chip label="Primary" color="primary" />
  <Chip label="Secondary" color="secondary" />
  <Chip label="Success" color="success" />
  <Chip label="Error" color="error" />
  <Chip label="Warning" color="warning" />
  <Chip label="Info" color="info" />
</Stack>
```
[View Live](https://mui.com/material-ui/react-chip/#color)

### Chip with Sizes
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

<Stack direction="row" spacing={1}>
  <Chip label="Small" size="small" color="primary" />
  <Chip label="Medium" size="medium" color="primary" />
  <Chip label="Small Outlined" size="small" variant="outlined" color="success" />
  <Chip label="Medium Outlined" size="medium" variant="outlined" color="success" />
</Stack>
```
[View Live](https://mui.com/material-ui/react-chip/#sizes)

### Chip with Icon
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FaceIcon from '@mui/icons-material/Face';
import TagFacesIcon from '@mui/icons-material/TagFaces';

<Stack direction="row" spacing={1}>
  <Chip icon={<FaceIcon />} label="With Icon" />
  <Chip
    icon={<TagFacesIcon />}
    label="Clickable"
    onClick={handleClick}
    color="primary"
  />
  <Chip
    icon={<FaceIcon />}
    label="Deletable"
    onDelete={handleDelete}
    variant="outlined"
  />
</Stack>
```
[View Live](https://mui.com/material-ui/react-chip/#icon-chip)

### Chip with Avatar
```jsx
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

<Stack direction="row" spacing={1}>
  <Chip
    avatar={<Avatar>M</Avatar>}
    label="Avatar Chip"
  />
  <Chip
    avatar={<Avatar alt="User" src="/avatar.jpg" />}
    label="User Name"
    variant="outlined"
  />
  <Chip
    avatar={<Avatar>G</Avatar>}
    label="GeeksforGeeks"
    onClick={handleClick}
    color="success"
  />
</Stack>
```
[View Live](https://mui.com/material-ui/react-chip/#avatar-chip)

### Clickable Chip
```jsx
import Chip from '@mui/material/Chip';

const handleClick = () => {
  alert('You clicked the chip!');
};

<Chip
  label="Click Me"
  onClick={handleClick}
  color="primary"
/>

// Explicit clickable styling without onClick
<Chip
  label="Clickable"
  clickable
  color="primary"
/>
```
[View Live](https://mui.com/material-ui/react-chip/#clickable)

### Deletable Chip
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const handleDelete = () => {
  console.log('Delete clicked');
};

<Stack direction="row" spacing={1}>
  <Chip
    label="Delete Me"
    onDelete={handleDelete}
  />
  <Chip
    label="Outlined Delete"
    onDelete={handleDelete}
    variant="outlined"
    color="error"
  />
</Stack>
```
[View Live](https://mui.com/material-ui/react-chip/#deletable)

### Chip with Custom Delete Icon
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';

const handleDelete = () => {
  console.log('Delete clicked');
};

<Stack direction="row" spacing={1}>
  <Chip
    label="Custom delete icon"
    onClick={handleClick}
    onDelete={handleDelete}
    deleteIcon={<DoneIcon />}
  />
  <Chip
    label="Custom delete icon"
    onClick={handleClick}
    onDelete={handleDelete}
    deleteIcon={<DeleteIcon />}
    variant="outlined"
  />
</Stack>
```
[View Live](https://mui.com/material-ui/react-chip/#deletable)

### Chip with Custom Styling
```jsx
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const CustomChip = styled(Chip)(() => ({
  width: 150,
  height: 50,
  backgroundColor: 'lightblue',
  borderRadius: 2,
  color: 'white',
  '& .MuiChip-label': {
    color: 'blue',
    fontSize: 20
  },
  '& .MuiChip-deleteIcon': {
    color: 'blue',
    fontSize: 20
  },
}));

<CustomChip
  label="Custom Chip"
  variant="filled"
  onDelete={handleDelete}
/>
```

### Disabled Chip
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

<Stack direction="row" spacing={1}>
  <Chip label="Disabled" disabled />
  <Chip
    label="Disabled Clickable"
    onClick={handleClick}
    disabled
    color="primary"
  />
  <Chip
    label="Disabled Deletable"
    onDelete={handleDelete}
    disabled
    variant="outlined"
  />
</Stack>
```

### Array of Chips (Tag Selection Pattern)
```jsx
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

function ChipArray() {
  const [chips, setChips] = useState([
    { key: 0, label: 'React' },
    { key: 1, label: 'Material-UI' },
    { key: 2, label: 'TypeScript' },
  ]);

  const handleDelete = (chipToDelete) => {
    setChips((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <Stack direction="row" spacing={1}>
      {chips.map((data) => (
        <Chip
          key={data.key}
          label={data.label}
          onDelete={() => handleDelete(data)}
        />
      ))}
    </Stack>
  );
}
```
[View Live](https://mui.com/material-ui/react-chip/#chip-array)

## Notable Features
- **Automatic delete icon display**: Delete icon appears automatically when `onDelete` handler is provided
- **Keyboard accessibility**: Supports Backspace/Delete to trigger onDelete when focused, Escape to blur
- **Clickable prop inference**: When `onClick` is provided, chip automatically becomes clickable with hover effects
- **Avatar integration**: Native support for Material-UI Avatar component with automatic sizing
- **Flexible icon support**: Accepts any React element as icon (Material-UI icons or custom)
- **Custom delete icon**: `deleteIcon` prop allows customization of the remove button
- **Semantic color system**: Full integration with MUI theme colors for consistent theming
- **Variant system**: Two distinct visual styles (filled and outlined) for different UI contexts
- **Size variants**: Two predefined sizes with automatic spacing and padding adjustments
- **CSS class customization**: Exposes CSS classes for fine-grained styling control
- **Theme integration**: Full support for MUI theme customization via `sx` prop and theme overrides
- **Composed patterns**: Can be used within other MUI components like Autocomplete, TextField (as chips)

## Research Notes
- **Documentation access**: Documentation was accessible with comprehensive examples and API reference
- **Framework approach**: MUI follows Material Design guidelines closely, providing opinionated but flexible chip implementation
- **Version stability**: Current v5.x version has stable API with consistent naming conventions
- **Component composition**: Chips work seamlessly with other MUI components (Stack, Avatar, Icons)
- **Styling approach**: Three styling methods available: native props, `sx` prop, and `styled` API
- **Real-world usage**: Chips are production-ready and widely used for tags, filters, selections, and contact lists
- **Bundle impact**: Part of core MUI library; minimal additional bundle size
- **Browser support**: Works across all modern browsers
- **Accessibility**: Built-in keyboard support and ARIA attributes for screen readers
- **Performance**: Lightweight component with efficient re-renders
- **Customization depth**: Highly customizable via theme system, styled components, or CSS classes
- **Migration path**: Clear upgrade path from v4 to v5 documented
- **TypeScript support**: Full TypeScript definitions included with proper prop types
