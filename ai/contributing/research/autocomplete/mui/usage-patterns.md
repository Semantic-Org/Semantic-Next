# MUI - Autocomplete Usage Patterns

## Component URL
https://mui.com/material-ui/react-autocomplete/
Status: ✅ Working
Version: Material-UI v5+ (Current)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Extensive examples, detailed API reference, multiple use case demonstrations

## Component Definition
- **Core purpose**: Enhances text inputs with a dropdown list of suggested options, combining search functionality with structured selection capabilities
- **Mental model**: A text field that dynamically filters and displays selectable options as users type, supporting both constrained selection and free-form entry
- **Semantic meaning**: Provides intelligent input assistance and option discovery, reducing user effort while maintaining input flexibility

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiple={true}`)
- **Composed**: Via composition/children (e.g., `renderInput={(params) => <TextField {...params} />}`)
- **CSS-only**: Requires custom styling (e.g., `sx={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Composed | Via required `renderInput` prop, typically renders TextField component |
| Dropdown list | ✅ | Native | Built-in popup with options, automatic positioning and overflow handling |
| Filtering/search | ✅ | Native | Real-time case-insensitive filtering, customizable via `filterOptions` prop |
| Multiple selection | ✅ | Native | `multiple` prop enables multi-select, displays chips/tags in input field |
| Custom option rendering | ✅ | Native | `renderOption` prop for rich content (icons, images, descriptions) |
| Creatable options | ✅ | Native | `freeSolo` prop allows user input not bound to provided options |
| Grouping | ✅ | Native | `groupBy` prop organizes options into groups with distinct headers |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Default behavior, returns single value via `onChange` |
| Multi select | ✅ | Native | `multiple={true}` prop, returns array of values |
| Async/remote data | ✅ | Native | `open`, `loading`, `onOpen`, `onClose` props manage async state |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | `loading` prop shows loading indicator, integrates with async data fetching |
| Disabled | ✅ | Native | `disabled` prop makes component uninteractive with grayed appearance |
| Error/Invalid | ✅ | Composed | Via TextField's `error` and `helperText` props in `renderInput` |
| Empty state | ✅ | Native | Automatic empty state handling with customizable messages |
| No results | ✅ | Native | `noOptionsText` prop customizes "no results found" message |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Composed | Via TextField `size` prop (small, medium) in `renderInput` |
| Placeholder text | ✅ | Composed | Via TextField `placeholder` prop in `renderInput` |
| Clear button | ✅ | Native | Built-in clear button, controlled by `disableClearable` prop |
| Icons | ✅ | Composed | Custom icons via TextField's InputProps or custom `renderOption` |
| Virtualization | ✅ | Native | `ListboxComponent` prop supports react-window for large datasets (10,000+ options) |

## Code Examples

### Primary Usage - Basic Autocomplete
```jsx
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

<Autocomplete
  options={top100Films}
  getOptionLabel={(option) => option.title}
  sx={{ width: 300 }}
  renderInput={(params) => (
    <TextField {...params} label="Movie" />
  )}
/>
```

### Multiple Selection with Tags
```jsx
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const top5Songs = [
  { title: "Organize" },
  { title: "Joha" },
  { title: "Terminator" },
  { title: "Dull" },
  { title: "Nzaza" },
];

export default function Tags() {
  return (
    <Stack spacing={3} sx={{ width: 300 }}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={top5Songs}
        getOptionLabel={(option) => option.title}
        defaultValue={[top5Songs[2]]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Multiple values"
            placeholder="Favorites"
          />
        )}
      />
    </Stack>
  );
}
```

### Asynchronous Loading with Loading State
```jsx
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

const [open, setOpen] = useState(false);
const [options, setOptions] = useState([]);
const loading = open && options.length === 0;

<Autocomplete
  open={open}
  onOpen={() => setOpen(true)}
  onClose={() => setOpen(false)}
  loading={loading}
  options={options}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Asynchronous"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
/>
```

### Grouped Options
```jsx
<Autocomplete
  options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
  groupBy={(option) => option.firstLetter}
  getOptionLabel={(option) => option.title}
  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Categories" />}
/>
```

### Free Solo Mode (Creatable)
```jsx
<Autocomplete
  freeSolo
  options={options}
  getOptionLabel={(option) => option.title}
  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Free Solo" />}
/>
```

### Disabled Options
```jsx
<Autocomplete
  options={timeSlots}
  getOptionDisabled={(option) =>
    option === timeSlots[0] || option === timeSlots[2]
  }
  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label="Disabled options" />}
/>
```

### Custom Rendering with No Clear Button
```jsx
<Autocomplete
  disableClearable
  options={posts}
  noOptionsText="No options"
  renderInput={(params) => (
    <TextField
      {...params}
      label="Search"
      placeholder="Type to search..."
      variant="outlined"
      size="small"
    />
  )}
  renderOption={(props, option) => (
    <li {...props}>
      <CustomOptionContent option={option} />
    </li>
  )}
/>
```

### Size Variants
```jsx
// Small size
<Autocomplete
  options={options}
  renderInput={(params) => (
    <TextField {...params} label="Small" size="small" />
  )}
/>

// Medium size (default)
<Autocomplete
  options={options}
  renderInput={(params) => (
    <TextField {...params} label="Medium" />
  )}
/>
```

### Form Integration with Error State
```jsx
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

<FormControl error={hasError}>
  <FormLabel>Label</FormLabel>
  <Autocomplete
    placeholder="Placeholder"
    options={options}
    sx={{ width: 300 }}
    renderInput={(params) => <TextField {...params} error={hasError} />}
  />
  <FormHelperText>Error message or helper text</FormHelperText>
</FormControl>
```

[View Live Examples](https://mui.com/material-ui/react-autocomplete/)

## Notable Features

### Comprehensive Props System
- **Options Management**: Flexible `options` array structure with customizable `getOptionLabel` and `isOptionEqualToValue`
- **Controlled/Uncontrolled**: Supports both patterns via `value`/`onChange` or `defaultValue`
- **Custom Filtering**: `filterOptions` prop for advanced filtering logic beyond default case-insensitive matching
- **Keyboard Navigation**: Full keyboard support for accessibility (arrow keys, Enter, Escape)

### Performance Optimization
- **Virtualization Support**: `ListboxComponent` prop enables react-window integration for rendering 10,000+ options efficiently
- **Debounce Integration**: Works seamlessly with debounced async operations for API calls

### Accessibility Features
- **ARIA Support**: Built-in ARIA attributes for screen readers
- **Form Integration**: Works with FormControl, FormLabel, and FormHelperText for accessible forms
- **Keyboard Navigation**: Complete keyboard interaction support

### Advanced Customization
- **Multiple Render Props**: `renderInput`, `renderOption`, `renderTags`, `renderGroup` for complete visual control
- **Event Lifecycle**: `onOpen`, `onClose`, `onInputChange`, `onChange` for granular state management
- **Popup Configuration**: `PopperComponent` and related props for custom dropdown positioning and behavior

### Unique Design Patterns
- **Hybrid Input Model**: Supports both constrained selection (`freeSolo={false}`) and free-form entry (`freeSolo={true}`)
- **Chip-Based Multi-Select**: Multiple selections display as removable chips within the input
- **Smart Default Behavior**: Automatically handles common use cases with sensible defaults while remaining highly customizable

## Research Notes

### Documentation Strengths
- Comprehensive examples covering basic to advanced use cases
- Clear separation between main documentation and API reference
- Live interactive examples on documentation site
- Strong community resources and third-party tutorials

### Implementation Observations
- **Composition Pattern**: Heavy reliance on composition via `renderInput` (required prop) rather than built-in input styling
- **TextField Dependency**: Most styling/sizing variations flow through the composed TextField component
- **React-Specific**: Deeply integrated with React patterns (hooks, controlled components)
- **Material Design**: Strong adherence to Material Design principles and visual language
- **TypeScript Support**: Full TypeScript definitions available with detailed prop types

### Comparison Notes
- **Framework Coupling**: Unlike vanilla web components, MUI Autocomplete is tightly coupled to React ecosystem
- **Bundle Size**: Part of larger @mui/material package, requires importing multiple components
- **Styling Approach**: Uses MUI's sx prop and theme system rather than CSS custom properties
- **Options Structure**: Expects JavaScript objects/arrays rather than DOM-based option elements

### Developer Experience
- **Learning Curve**: Moderate - requires understanding of MUI ecosystem and composition patterns
- **Customization**: Highly flexible through multiple render props and theme customization
- **Debugging**: Well-documented props and clear TypeScript types aid debugging
- **Examples**: Abundant examples in official docs and community resources (Stack Overflow, Medium, etc.)
