# MUI (Material-UI) - Select Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-select/
Status: ✅ Working
Version: Material UI v5 (Current)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Excellent documentation with extensive examples, props reference, API documentation, theming guidance, and accessibility considerations. Includes interactive demos, TypeScript types, and detailed customization patterns.

## Component Definition
- **Core purpose**: Provides a Material Design-compliant dropdown component for capturing single or multiple selections from a list of predefined options in a form context
- **Mental model**: A form control that presents options in a dropdown menu, with visual emphasis hierarchy through variants and integration with Material UI's form component ecosystem
- **Semantic meaning**: Communicates choice selection with importance hierarchy through visual variants (outlined, filled, standard), supporting both simple selection and complex multi-select scenarios

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Direct text as MenuItem children: `<MenuItem value="1">Option</MenuItem>` |
| Icon support | ✅ | Composed | Via ListItemIcon wrapper in MenuItem for icons alongside text |
| Icon + Text | ✅ | Composed | Icons positioned via ListItemIcon with automatic spacing |
| Grouped options | ✅ | Native | Via ListSubheader component for logical grouping |
| Custom content | ✅ | Composed | Any React node as MenuItem children (checkboxes, avatars, badges, etc.) |
| Avatar/Image | ✅ | Composed | Via Avatar component in MenuItem |
| Empty state | ✅ | Native | `displayEmpty` prop allows showing value when nothing selected |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard | ✅ | Native | `variant="standard"` - Underlined input (default in v4) |
| Outlined | ✅ | Native | `variant="outlined"` - Border outline (default in v5) |
| Filled | ✅ | Native | `variant="filled"` - Solid background with bottom border |
| Native | ✅ | Native | `native` prop - Uses browser's native `<select>` element |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/Closed | ✅ | Native | `open` prop for controlled state, `onOpen`/`onClose` callbacks |
| Disabled | ✅ | Native | `disabled` prop - Non-interactive state, reduced opacity |
| Error | ✅ | Native | `error` prop - Visual error indication, typically used with FormHelperText |
| Loading | ⚠️ | Composed | Not built-in, requires custom implementation with MenuItem |
| Focused | ✅ | Native | Automatic focus management with keyboard navigation |
| Multiple selection | ✅ | Native | `multiple` prop - Value becomes array, supports multi-select |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="small"`, `size="medium"` (default) |
| Color options | ✅ | Native | `color="primary"`, `secondary`, `error`, `warning`, `info`, `success` |
| Full width | ✅ | Native | `fullWidth` prop on FormControl - Spans full container width |
| Auto width | ✅ | Native | `autoWidth` prop - Menu width adjusts to content, not select width |
| Required | ✅ | Native | `required` prop - Marks field as required in forms |
| Read-only | ✅ | Native | `inputProps={{ readOnly: true }}` - Display-only mode |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Change handler | ✅ | Native | Standard `onChange` prop with event object |
| Open/Close handlers | ✅ | Native | `onOpen` and `onClose` callbacks for menu state |
| Keyboard navigation | ✅ | Native | Arrow keys, Enter, Escape, type-ahead search built-in |
| Custom render | ✅ | Native | `renderValue` function to customize displayed value |
| Menu positioning | ✅ | Native | `MenuProps` for customizing dropdown position and behavior |
| Input props | ✅ | Native | `inputProps` and `SelectDisplayProps` for customization |

## Code Examples

### Basic Select with FormControl
```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
```

### Select Variants
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Standard variant (underlined)
<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="standard-label">Standard</InputLabel>
  <Select
    labelId="standard-label"
    id="standard-select"
    value={age}
    onChange={handleChange}
    label="Standard"
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
  </Select>
</FormControl>

// Outlined variant (default in v5)
<FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="outlined-label">Outlined</InputLabel>
  <Select
    labelId="outlined-label"
    id="outlined-select"
    value={age}
    onChange={handleChange}
    label="Outlined"
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
  </Select>
</FormControl>

// Filled variant
<FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="filled-label">Filled</InputLabel>
  <Select
    labelId="filled-label"
    id="filled-select"
    value={age}
    onChange={handleChange}
    label="Filled"
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
  </Select>
</FormControl>
```

### Select Sizes
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Small size
<FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="small-label">Small</InputLabel>
  <Select
    labelId="small-label"
    id="small-select"
    value={age}
    onChange={handleChange}
    label="Small"
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
  </Select>
</FormControl>

// Medium size (default)
<FormControl size="medium" sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="medium-label">Medium</InputLabel>
  <Select
    labelId="medium-label"
    id="medium-select"
    value={age}
    onChange={handleChange}
    label="Medium"
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
  </Select>
</FormControl>
```

### Multiple Selection
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

const names = ['Oliver Hansen', 'Van Henry', 'April Tucker', 'Ralph Hubbard'];

export default function MultipleSelect() {
  const [selectedNames, setSelectedNames] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="multiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="multiple-checkbox-label"
        id="multiple-checkbox"
        multiple
        value={selectedNames}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={selectedNames.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
```

### Multiple Select with Chips
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ['Oliver Hansen', 'Van Henry', 'April Tucker', 'Ralph Hubbard'];

export default function MultipleSelectChip() {
  const [selectedNames, setSelectedNames] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedNames(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="multiple-chip-label">Chip</InputLabel>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={selectedNames}
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
```

### Grouped Options with ListSubheader
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';

export default function GroupedSelect() {
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
      <Select
        defaultValue=""
        id="grouped-select"
        label="Grouping"
        value={value}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <ListSubheader>Category 1</ListSubheader>
        <MenuItem value={1}>Option 1</MenuItem>
        <MenuItem value={2}>Option 2</MenuItem>
        <ListSubheader>Category 2</ListSubheader>
        <MenuItem value={3}>Option 3</MenuItem>
        <MenuItem value={4}>Option 4</MenuItem>
      </Select>
    </FormControl>
  );
}
```

### Select with Icons
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';

export default function SelectWithIcons() {
  const [value, setValue] = React.useState('inbox');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <InputLabel id="icon-select-label">Folder</InputLabel>
      <Select
        labelId="icon-select-label"
        id="icon-select"
        value={value}
        onChange={handleChange}
        label="Folder"
      >
        <MenuItem value="inbox">
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Inbox</ListItemText>
        </MenuItem>
        <MenuItem value="drafts">
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Drafts</ListItemText>
        </MenuItem>
        <MenuItem value="sent">
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sent</ListItemText>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
```

### Native Select
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

export default function NativeSelectDemo() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Age
      </InputLabel>
      <NativeSelect
        defaultValue={30}
        inputProps={{
          name: 'age',
          id: 'uncontrolled-native',
        }}
        onChange={handleChange}
      >
        <option value={10}>Ten</option>
        <option value={20}>Twenty</option>
        <option value={30}>Thirty</option>
      </NativeSelect>
    </FormControl>
  );
}
```

### Select with Error State
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

export default function ErrorSelect() {
  const [age, setAge] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
    setError(false);
  };

  return (
    <FormControl error={error} sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="error-select-label">Age</InputLabel>
      <Select
        labelId="error-select-label"
        id="error-select"
        value={age}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      {error && <FormHelperText>This field is required</FormHelperText>}
    </FormControl>
  );
}
```

### Disabled Select
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function DisabledSelect() {
  return (
    <FormControl disabled sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="disabled-label">Age</InputLabel>
      <Select
        labelId="disabled-label"
        id="disabled-select"
        value={20}
        label="Age"
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
```

### Select with Placeholder (displayEmpty)
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function SelectWithPlaceholder() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="placeholder-label">Age</InputLabel>
      <Select
        labelId="placeholder-label"
        id="placeholder-select"
        value={age}
        onChange={handleChange}
        displayEmpty
        label="Age"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
```

### Auto Width Select
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function AutoWidthSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="auto-width-label">Age</InputLabel>
      <Select
        labelId="auto-width-label"
        id="auto-width-select"
        value={age}
        onChange={handleChange}
        autoWidth
        label="Age"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
```

### Custom renderValue
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function CustomRenderValue() {
  const [age, setAge] = React.useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="render-value-label">Age</InputLabel>
      <Select
        labelId="render-value-label"
        id="render-value-select"
        value={age}
        onChange={handleChange}
        label="Age"
        renderValue={(value) => `Selected: ${value} years old`}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
```

### Custom MenuProps
```jsx
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  // Position menu below the select
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
};

export default function CustomMenuPropsSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="menu-props-label">Age</InputLabel>
      <Select
        labelId="menu-props-label"
        id="menu-props-select"
        value={age}
        onChange={handleChange}
        label="Age"
        MenuProps={MenuProps}
      >
        {[...Array(20)].map((_, i) => (
          <MenuItem key={i} value={i + 10}>
            {i + 10}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
```

## Complete Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | any | - | The selected value. Use an array for multiple selections. |
| `onChange` | func | - | Callback fired when the selection changes. Signature: `function(event: object, child?: object) => void` |
| `variant` | `'filled'` \| `'outlined'` \| `'standard'` | `'outlined'` | The variant to use. |
| `size` | `'small'` \| `'medium'` | `'medium'` | The size of the component. |
| `multiple` | boolean | `false` | If true, value must be an array and the menu will support multiple selections. |
| `autoWidth` | boolean | `false` | If true, the width of the popover will automatically be set according to the items inside the menu. |
| `displayEmpty` | boolean | `false` | If true, a value is displayed even if no items are selected. |
| `native` | boolean | `false` | If true, the component uses a native select element. |
| `renderValue` | func | - | Render the selected value. Signature: `function(value: any) => ReactNode` |
| `MenuProps` | object | - | Props applied to the Menu element. |
| `SelectDisplayProps` | object | - | Props applied to the clickable div element. |
| `inputProps` | object | - | Attributes applied to the input element. |
| `IconComponent` | elementType | ArrowDropDownIcon | The icon that displays the arrow. |
| `open` | boolean | - | If true, the component is shown in open state. |
| `onOpen` | func | - | Callback fired when the component requests to be opened. |
| `onClose` | func | - | Callback fired when the component requests to be closed. |
| `disabled` | boolean | `false` | If true, the component is disabled. |
| `error` | boolean | `false` | If true, the component displays in error state. |
| `required` | boolean | `false` | If true, the component will be required. |
| `fullWidth` | boolean | `false` | If true, the component takes up the full width of its container. |
| `defaultValue` | any | - | The default value. Use when the component is not controlled. |
| `defaultOpen` | boolean | `false` | The default open state. Use when the component is not controlled. |
| `label` | node | - | The label content. Required when using outlined variant with FormControl. |
| `labelId` | string | - | The ID of an element that labels the select. |
| `id` | string | - | The id of the wrapper element. |
| `sx` | object | - | System prop for custom styling. |

**Inherited Props:** Also accepts props from OutlinedInput, Input, or FilledInput depending on variant.

## CSS Classes for Customization

- `.MuiSelect-root` - Root element
- `.MuiSelect-select` - The select component itself
- `.MuiSelect-filled` - Styles applied when `variant="filled"`
- `.MuiSelect-outlined` - Styles applied when `variant="outlined"`
- `.MuiSelect-standard` - Styles applied when `variant="standard"`
- `.MuiSelect-disabled` - Styles applied when `disabled={true}`
- `.MuiSelect-error` - Styles applied when `error={true}`
- `.MuiSelect-multiple` - Styles applied when `multiple={true}`
- `.MuiSelect-icon` - Styles applied to the icon component
- `.MuiSelect-iconOpen` - Styles applied when the select is open
- `.MuiSelect-iconFilled` - Styles applied to the icon when variant is filled
- `.MuiSelect-iconOutlined` - Styles applied to the icon when variant is outlined
- `.MuiSelect-iconStandard` - Styles applied to the icon when variant is standard
- `.MuiSelect-nativeInput` - Styles applied to the underlying native input component

## Notable Features

### 1. FormControl Integration
MUI Select is designed to work seamlessly with FormControl, InputLabel, and FormHelperText:
- **Automatic label shrinking**: Label moves to top when Select has value or is focused
- **Error state propagation**: Error state passed from FormControl to Select automatically
- **Consistent sizing**: Size prop on FormControl applies to all children
- **Unified API**: Variant prop can be set on FormControl level

**Important**: When using outlined variant, you must provide the label in TWO places:
```jsx
<FormControl>
  <InputLabel id="demo-label">Age</InputLabel>  {/* First location */}
  <Select
    labelId="demo-label"
    label="Age"  {/* Second location - creates notch in outline */}
  >
    ...
  </Select>
</FormControl>
```

### 2. Multiple Selection Support
Native multi-select functionality with several rendering options:
- **Array values**: Value becomes array when `multiple={true}`
- **Custom rendering**: `renderValue` for comma-separated, chips, or custom display
- **Checkbox integration**: Common pattern with Checkbox + ListItemText
- **Select all functionality**: Can be implemented with custom MenuItem

### 3. Variant System
Three distinct visual styles following Material Design:
- **Standard**: Underlined input (v4 default) - minimalist appearance
- **Outlined**: Border outline (v5 default) - clear boundaries
- **Filled**: Solid background - elevated appearance

Each variant has its own component base (Input, OutlinedInput, FilledInput).

### 4. Native Select Option
`native` prop switches to browser's native `<select>`:
- **Better mobile experience**: Uses OS-native picker on mobile devices
- **Faster rendering**: No custom dropdown rendering
- **Limited customization**: Cannot use MenuItem, must use `<option>`
- **Different API**: Children must be `<option>` elements, not MenuItem

### 5. Custom Value Rendering
`renderValue` prop allows complete control over displayed value:
- **Multi-select display**: Show chips, comma-separated list, or count
- **Value transformation**: Display labels instead of IDs
- **Custom formatting**: Add prefixes, suffixes, or custom text
- **Empty state**: Works with `displayEmpty` for placeholder-like behavior

### 6. Menu Customization
`MenuProps` provides extensive control over dropdown behavior:
- **Size constraints**: maxHeight, maxWidth for scrollable dropdowns
- **Positioning**: anchorOrigin and transformOrigin for menu placement
- **Styling**: PaperProps for custom dropdown appearance
- **Auto focus**: disableAutoFocusItem to prevent auto-selection
- **Portal**: disablePortal to render menu in normal DOM flow

### 7. Icon Customization
`IconComponent` prop allows custom dropdown indicator:
```jsx
<Select
  IconComponent={ExpandMoreIcon}
  // or custom component
  IconComponent={CustomIcon}
>
```

### 8. Controlled vs Uncontrolled
Supports both patterns:
- **Controlled**: Use `value` + `onChange` props
- **Uncontrolled**: Use `defaultValue` + optional `onChange`
- **Controlled open state**: Use `open` + `onOpen` + `onClose`

### 9. Type-Ahead Search
Built-in keyboard navigation:
- **Arrow keys**: Navigate through options
- **Enter**: Select focused option
- **Escape**: Close menu
- **Type-ahead**: Type letters to jump to matching options
- **Home/End**: Jump to first/last option

### 10. Accessibility Built-In
- **ARIA attributes**: Proper role, aria-labelledby, aria-describedby
- **Keyboard navigation**: Full keyboard support out of the box
- **Focus management**: Returns focus to trigger after selection
- **Screen reader support**: Announces selected value and available options
- **Label association**: Connects InputLabel with Select via labelId

### 11. Grouped Options
ListSubheader component for logical grouping:
- **Visual separation**: Headers visually distinguish groups
- **Non-selectable**: Headers cannot be selected
- **Keyboard navigation**: Properly handled in keyboard traversal
- **Dynamic grouping**: Can be generated from nested data structures

### 12. No Placeholder Prop
Unlike TextField, Select doesn't have a `placeholder` prop:
- **Use displayEmpty**: Combined with empty MenuItem for placeholder effect
- **Use InputLabel**: Label serves as placeholder before selection
- **Workaround pattern**:
```jsx
<Select displayEmpty value={value}>
  <MenuItem value="" disabled>
    <em>Select an option</em>
  </MenuItem>
  <MenuItem value="1">Option 1</MenuItem>
</Select>
```

## Research Notes

### Framework Approach
MUI Select takes a **comprehensive form integration** approach where:
- Deep integration with FormControl ecosystem
- Multiple rendering strategies (custom menu vs native)
- Composition-based content customization
- Prop-driven configuration for common patterns
- Extensive theming and styling options

### API Design Philosophy
- **Form-first design**: Designed to work within FormControl wrapper
- **Variant inheritance**: Variant system consistent with other input components
- **Composition over configuration**: MenuItem and ListSubheader for content structure
- **Controlled patterns**: Strong support for controlled component patterns
- **Type safety**: Excellent TypeScript support with generic value types

### Component Architecture
- **Base component variants**: Extends OutlinedInput/Input/FilledInput based on variant
- **Menu rendering**: Uses Menu component under the hood (not Popover directly)
- **Portal rendering**: Menu rendered in Portal by default for z-index management
- **Event composition**: Complex event handling for keyboard + mouse interaction

### Material Design Patterns
1. **Visual hierarchy**: Three variants with different visual weights
2. **Label behavior**: Shrinking labels on focus/value
3. **Error states**: Red color + helper text for validation feedback
4. **Focus indicators**: Clear outline on keyboard focus
5. **Ripple effects**: None (unlike buttons) - instant selection feedback

### State Management
- **Open/Closed**: Can be controlled via open prop + callbacks
- **Selection state**: Value-driven via value prop (controlled) or defaultValue (uncontrolled)
- **Validation**: Error prop for visual indication
- **Disabled**: Full component disabling including label graying
- **Loading**: No built-in support, custom implementation needed

### Common Patterns
1. **Multiple select with checkboxes**: Checkbox + ListItemText in MenuItem
2. **Multiple select with chips**: renderValue with Chip components in Box
3. **Grouped options**: ListSubheader between MenuItem groups
4. **Icons with text**: ListItemIcon + ListItemText in MenuItem
5. **Empty placeholder**: displayEmpty + empty MenuItem with disabled
6. **Custom display**: renderValue for transformed value display

### Migration Notes (v4 to v5)
- **Default variant changed**: From standard to outlined
- **Label prop required**: For outlined variant to create notch
- **Input components updated**: New base input components
- **CSS class names**: Updated with v5 class naming system

## Comparison Insights

### Strengths
1. **FormControl integration**: Seamless form ecosystem integration
2. **Multiple selection**: Native support with flexible rendering
3. **Variant system**: Three distinct Material Design styles
4. **Native option**: Can switch to browser native select
5. **Accessibility**: Comprehensive ARIA and keyboard support
6. **Type-ahead**: Built-in keyboard search
7. **Customization**: Extensive theming and styling options
8. **Icon support**: Easy icon integration via ListItemIcon
9. **Grouping**: Built-in support with ListSubheader
10. **Menu control**: Extensive MenuProps for customization

### Potential Limitations
1. **No placeholder prop**: Requires workaround pattern
2. **No loading state**: Must implement custom loading indicator
3. **Complex label setup**: Outlined variant requires label in two places
4. **FormControl dependency**: Best used within FormControl wrapper
5. **Bundle size**: Full Material Design system included
6. **Limited portal control**: Portal rendering is default, harder to customize positioning
7. **No search/filter**: No built-in option filtering/search for long lists

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **Multiple selection support**: Native multiple prop with array values
2. **renderValue customization**: Flexible value display transformation
3. **Variant system**: Multiple visual styles (though not necessarily Material Design)
4. **Native fallback**: Option to use browser native select
5. **MenuProps pattern**: Extensive menu customization via props object
6. **Icon integration**: Clean pattern for icons in options
7. **Grouped options**: Built-in grouping with subheaders
8. **Type-ahead search**: Keyboard-based option jumping
9. **Controlled open state**: Full control over menu visibility
10. **Size system**: Small/medium sizing options

#### Improve Upon
1. **Simpler label setup**: Single label definition, not two locations
2. **Built-in loading**: Loading state in base component
3. **Placeholder support**: Native placeholder prop
4. **Search/filter**: Built-in option filtering for long lists
5. **Lighter weight**: Optional Material Design features
6. **Form independence**: Work well standalone without wrapper component
7. **Portal flexibility**: Easier control over menu positioning strategy

### Questions for Semantic UI Design
1. **Form integration**: Should Select require a wrapper component or work standalone?
2. **Variant philosophy**: Material Design variants or different visual patterns?
3. **Native option**: Should we support browser native fallback?
4. **Label handling**: Single label definition or multiple like MUI?
5. **Multiple selection**: Built-in or separate MultiSelect component?
6. **Search functionality**: Built-in option search/filter or leave to composition?
7. **Menu rendering**: Portal-based by default or inline?
8. **Icon patterns**: Dedicated props or composition-based?

## Implementation Details Worth Noting

### Prop Interface (Simplified)
```typescript
interface SelectProps<T> {
  // Value and change handling
  value?: T;
  defaultValue?: T;
  onChange?: (event: SelectChangeEvent<T>, child?: React.ReactNode) => void;

  // Visual variants
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';

  // States
  disabled?: boolean;
  error?: boolean;
  required?: boolean;

  // Multiple selection
  multiple?: boolean;

  // Customization
  renderValue?: (value: T) => React.ReactNode;
  MenuProps?: Partial<MenuProps>;
  IconComponent?: React.ElementType;

  // Menu control
  open?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent) => void;

  // Behavior
  autoWidth?: boolean;
  displayEmpty?: boolean;
  native?: boolean;

  // Label (for outlined variant)
  label?: React.ReactNode;
  labelId?: string;

  // Standard props
  id?: string;
  fullWidth?: boolean;
  inputProps?: React.HTMLAttributes<HTMLInputElement>;
  SelectDisplayProps?: React.HTMLAttributes<HTMLDivElement>;
  sx?: SxProps;
}
```

### SelectChangeEvent Type
```typescript
interface SelectChangeEvent<T> extends React.ChangeEvent<HTMLInputElement> {
  target: {
    value: T;
    name?: string;
  };
}
```

### CSS Custom Properties
MUI uses CSS variables for theming:
```css
.MuiSelect-root {
  color: var(--mui-palette-text-primary);
  background-color: var(--mui-palette-background-paper);
}

.MuiSelect-outlined {
  border-color: var(--mui-palette-divider);
}
```

### Accessibility Attributes
Automatically applied:
```html
<div
  class="MuiSelect-root"
  role="combobox"
  aria-labelledby="demo-label"
  aria-describedby="demo-helper-text"
  aria-expanded="false"
  aria-haspopup="listbox"
  tabindex="0"
>
  <input type="hidden" value="10" />
  <div class="MuiSelect-select">Ten</div>
</div>
```

### Component Composition
Select components compose from base primitives:
```
Select → OutlinedInput/Input/FilledInput → InputBase
        ↓
      Menu → Popover → Modal → Portal
```

This architecture provides:
- Variant-specific styling inheritance
- Consistent input behavior
- Proper focus management
- Portal-based z-index handling
