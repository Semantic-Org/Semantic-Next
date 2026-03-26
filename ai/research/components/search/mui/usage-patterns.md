# MUI - Autocomplete Usage Patterns

## Component URL
https://mui.com/material-ui/react-autocomplete/
Status: ✅ Verified and documented

## Documentation Quality
Excellent - MUI provides comprehensive documentation with extensive examples, complete API reference, accessibility guidance, theming information, and advanced patterns including hooks and customization.

## Component Definition
- **Core purpose**: Enhances a text input with a panel of suggested options that users can select from. The component supports both strict selection (combo box) and free-form text entry with suggestions (free solo mode).
- **Mental model**: A search input that intelligently filters and displays matching options as the user types, supporting single/multiple selections and custom values. It's a controlled or uncontrolled input with sophisticated dropdown behavior.
- **Semantic meaning**: A combobox that combines an input field with a listbox of options. Follows W3C ARIA combobox patterns for proper accessibility.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text options | ✅ | Primary pattern. Accepts array of strings or objects with string labels via `getOptionLabel` |
| Icon support | ✅ | Can render icons in options via `renderOption` prop. Common pattern for adding visual indicators |
| Custom content | ✅ | Full control over option rendering via `renderOption((props, option, state) => ReactNode)` |
| Rich options | ✅ | Supports complex option objects with multiple properties. Use `getOptionLabel` to extract display text |
| Grouped content | ✅ | `groupBy` prop organizes options into sections with headers. Customizable via `renderGroup` |
| Tag/Chip display | ✅ | Multiple selections render as removable chips. Customizable via `renderTags` prop |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single selection | ✅ | Default mode. Returns single value via `onChange` |
| Multiple selection | ✅ | `multiple={true}` allows selecting multiple options. Returns array of values |
| Combo box | ✅ | Default behavior - value must be from predefined options |
| Free solo | ✅ | `freeSolo={true}` allows arbitrary text input while suggesting options |
| Controlled | ✅ | Full control via `value`/`onChange` and `inputValue`/`onInputChange` |
| Uncontrolled | ✅ | Component manages state internally with optional `defaultValue` |
| Async/Remote data | ✅ | Supports loading state and dynamic options via `loading` prop and effects |
| Search as you type | ✅ | Filters options based on input. Custom filtering via `filterOptions` |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | `loading={true}` displays progress indicator. Works with `open`/`onOpen`/`onClose` for async data |
| Disabled | ✅ | `disabled={true}` prevents all interactions. Individual options can be disabled via `getOptionDisabled` |
| Read-only | ✅ | `readOnly={true}` prevents editing but allows viewing selected value |
| Error state | ✅ | Passed through `renderInput` to TextField. Use `error` and `helperText` props |
| Open/closed | ✅ | Controlled via `open` prop or uncontrolled. `onOpen`/`onClose` callbacks available |
| Focus state | ✅ | Standard input focus behavior. Configurable with `selectOnFocus`, `clearOnBlur` |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `size="small"` or `size="medium"` (default) controls input dimensions |
| Input variants | ✅ | TextField variants: "outlined" (default), "filled", "standard" passed via renderInput |
| Full width | ✅ | `fullWidth={true}` makes component span container width |
| Visual styles | ✅ | Customizable via `sx` prop, theme, and `classes` prop for className overrides |
| Clearable | ✅ | Clear button shown by default. Disable with `disableClearable={true}` |
| Portal behavior | ✅ | Popup uses Portal by default. Use `disablePortal={true}` for inline rendering |
| Tag limits | ✅ | `limitTags={number}` limits visible tags when unfocused in multiple mode |
| Custom popup | ✅ | `PaperComponent` and `PopperComponent` allow full customization |
| Virtualization | ✅ | Supports virtual scrolling for large option lists via `ListboxComponent` |

## Code Examples

### Basic Autocomplete
```jsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const top5Songs = [
  { label: "Organize" },
  { label: "Joha" },
  { label: "Terminator" },
  { label: "Dull" },
  { label: "Nzaza" },
];

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top5Songs}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Songs" />}
    />
  );
}
```

### Free Solo (Custom Input)
```jsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

const top5Songs = [
  { title: "Organize" },
  { title: "Joha" },
  { title: "Terminator" },
  { title: "Dull" },
  { title: "Nzaza" },
];

export default function FreeSolo() {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={top5Songs.map((option) => option.title)}
        renderInput={(params) => <TextField {...params} label="freeSolo" />}
      />
    </Stack>
  );
}
```

### Grouped Options
```jsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const movies = [
  // Array of movie objects with 'title' key
];

export default function Grouped() {
  const options = movies.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  return (
    <Autocomplete
      id="grouped-demo"
      options={options.sort(
        (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
      )}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.title}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Grouped Options" />
      )}
    />
  );
}
```

### Controlled State
```jsx
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const options = ["Value 1", "Value 2"];

export default function ManageableStates() {
  const [value, setValue] = useState(options[0]);
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <div>{`value: ${value !== null ? `'${value}'` : "null"}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div>
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="manageable-states-demo"
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Manage State" />}
      />
    </div>
  );
}
```

### Asynchronous Loading
```jsx
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const top5Songs = [
  { title: "Organize" },
  { title: "Joha" },
  { title: "Terminator" },
  { title: "Dull" },
  { title: "Nzaza" },
];

export default function Asynchronous() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      await sleep(1e3); // Simulate API call
      if (active) {
        setOptions([...top5Songs]);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) =>
        value === undefined ||
        option?.id?.toString() === (value?.id ?? value)?.toString()
      }
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          slotProps={{
            input: {
              ...params.slotProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.slotProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
}
```

### Multiple Selection with Tags
```jsx
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

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

### Fixed Options (Cannot be Removed)
```jsx
import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const movies = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  // ... more movies
];

export default function FixedTags() {
  const fixedOptions = [movies[6]];
  const [value, setValue] = useState([...fixedOptions, movies[13]]);

  return (
    <Autocomplete
      multiple
      id="fixed-options-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue([
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
        ]);
      }}
      options={movies}
      getOptionLabel={(option) => option.title}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.title}
            {...getTagProps({ index })}
            disabled={fixedOptions.indexOf(option) !== -1}
          />
        ))
      }
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Fixed tag" placeholder="Movies" />
      )}
    />
  );
}
```

### Checkboxes Selection
```jsx
import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const top5Songs = [
  { title: "Organize" },
  { title: "Joha" },
  { title: "Terminator" },
  { title: "Dull" },
  { title: "Nzaza" },
];

export default function CheckboxesTags() {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={top5Songs}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
          {option.title}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Checkboxes" placeholder="Checkboxes" />
      )}
    />
  );
}
```

### Custom Input Rendering
```jsx
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";

const options = ["Option 1", "Option 2"];

export default function CustomInputAutocomplete() {
  return (
    <label>
      Value:{" "}
      <Autocomplete
        sx={{ width: 200 }}
        id="custom-input-demo"
        options={options}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input type="text" {...params.inputProps} />
          </div>
        )}
      />
    </label>
  );
}
```

### Using useAutocomplete Hook
```jsx
import * as React from "react";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import { styled } from "@mui/system";

const Label = styled("label")({
  display: "block",
});

const Input = styled("input")(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  color: theme.palette.mode === "light" ? "#000" : "#fff",
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: 200,
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: "absolute",
  listStyle: "none",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  border: "1px solid rgba(0,0,0,.5)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

const top5Songs = [
  { label: "Organize" },
  { label: "Joha" },
  { label: "Terminator" },
  { label: "Dull" },
  { label: "Nzaza" },
];

export default function UseAutocomplete() {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: top5Songs,
    getOptionLabel: (option) => option.label,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>useAutocomplete</Label>
        <Input {...getInputProps()} />
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions).map((option, index) => (
            <li {...getOptionProps({ option, index })}>{option.label}</li>
          ))}
        </Listbox>
      ) : null}
    </div>
  );
}
```

### Formik Integration
```jsx
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Autocomplete } from "@mui/material";
import { useField } from "formik";

const FormikAutoComplete = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  return (
    <Autocomplete
      {...props}
      onChange={(event, value) => setValue(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          {...field}
          label={label}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
        />
      )}
    />
  );
};

const validationSchema = Yup.object({
  song: Yup.string().required("Required"),
});

const options = [
  { title: "Organize" },
  { title: "Joha" },
  { title: "Terminator" },
  { title: "Dull" },
  { title: "Nzaza" },
];

const AutoCompleteForm = () => {
  return (
    <Formik
      initialValues={{ song: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <Field
            name="song"
            component={FormikAutoComplete}
            options={options}
            getOptionLabel={(option) => option.title}
            label="Song"
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default AutoCompleteForm;
```

## Complete Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | Array | **required** | Array of options to display |
| `value` | any | - | The selected value (controlled) |
| `onChange` | function | - | Callback when selection changes: `(event, value, reason, details?) => void` |
| `inputValue` | string | - | The input value (controlled) |
| `onInputChange` | function | - | Callback when input changes: `(event, value, reason) => void` |
| `multiple` | boolean | `false` | If true, allows multiple selections |
| `freeSolo` | boolean | `false` | If true, allows arbitrary input values |
| `disabled` | boolean | `false` | If true, disables the component |
| `readOnly` | boolean | `false` | If true, makes input read-only |
| `loading` | boolean | `false` | If true, shows loading indicator |
| `open` | boolean | - | Controls popup open state |
| `onOpen` | function | - | Callback when popup opens |
| `onClose` | function | - | Callback when popup closes: `(event, reason) => void` |
| `defaultValue` | any | - | Default selected value (uncontrolled) |
| `getOptionLabel` | function | `(option) => option.label ?? option` | Function to get display text for option |
| `getOptionKey` | function | - | Function to get unique key for option (for duplicate labels) |
| `isOptionEqualToValue` | function | `(option, value) => option === value` | Function to determine if option matches value |
| `getOptionDisabled` | function | - | Function to determine if option is disabled |
| `filterOptions` | function | createFilterOptions() | Custom filtering function |
| `groupBy` | function | - | Groups options by returned value: `(option) => string` |
| `renderOption` | function | - | Render custom option: `(props, option, state, ownerState) => ReactNode` |
| `renderGroup` | function | - | Render custom group: `(params) => ReactNode` |
| `renderTags` | function | - | Render custom tags in multiple mode |
| `renderInput` | function | **required** | Render input field: `(params) => ReactNode` |
| `size` | 'small' \| 'medium' | `'medium'` | Size of the component |
| `fullWidth` | boolean | `false` | If true, takes full width of container |
| `disableClearable` | boolean | `false` | If true, hides clear button |
| `disableCloseOnSelect` | boolean | `false` | If true, keeps popup open after selection |
| `disablePortal` | boolean | `false` | If true, popup renders inline instead of in Portal |
| `clearOnBlur` | boolean | `!props.freeSolo` | If true, clears input on blur |
| `clearOnEscape` | boolean | `false` | If true, clears input when Escape is pressed |
| `selectOnFocus` | boolean | `!props.freeSolo` | If true, selects input content on focus |
| `handleHomeEndKeys` | boolean | `!props.freeSolo` | If true, Home/End keys navigate options |
| `autoComplete` | boolean | `false` | If true, adds autocomplete attribute to input |
| `autoHighlight` | boolean | `false` | If true, first option is highlighted |
| `autoSelect` | boolean | `false` | If true, highlighted option selected on blur |
| `blurOnSelect` | boolean \| 'touch' \| 'mouse' | `false` | Control blur behavior on selection |
| `clearText` | string | `'Clear'` | Text for clear button aria-label |
| `closeText` | string | `'Close'` | Text for close button aria-label |
| `openText` | string | `'Open'` | Text for open button aria-label |
| `noOptionsText` | ReactNode | `'No options'` | Text when no options match |
| `loadingText` | ReactNode | `'Loading…'` | Text shown during loading |
| `limitTags` | number | `-1` | Max visible tags when not focused (-1 = no limit) |
| `getLimitTagsText` | function | `(more) => `+${more}`` | Function to render "+X more" text |
| `filterSelectedOptions` | boolean | `false` | If true, hides already selected options |
| `forcePopupIcon` | boolean \| 'auto' | `'auto'` | Controls popup icon visibility |
| `disableListWrap` | boolean | `false` | If true, list doesn't loop when using keyboard |
| `componentsProps` | object | `{}` | Props for internal components |
| `slotProps` | object | `{}` | Props for component slots (newer API) |
| `PaperComponent` | elementType | `Paper` | Component for dropdown container |
| `PopperComponent` | elementType | `Popper` | Component for popup positioning |
| `ListboxComponent` | elementType | `'ul'` | Component for options list |
| `ChipProps` | object | - | Props passed to Chip components in multiple mode |
| `sx` | object | - | System prop for styling |
| `classes` | object | - | Override component classes |
| `id` | string | - | ID for the input element |

## CSS Classes for Customization

- `.MuiAutocomplete-root` - Root element
- `.MuiAutocomplete-fullWidth` - When `fullWidth={true}`
- `.MuiAutocomplete-focused` - When component is focused
- `.MuiAutocomplete-tag` - Tag elements in multiple mode
- `.MuiAutocomplete-tagSizeSmall` - Small size tags
- `.MuiAutocomplete-tagSizeMedium` - Medium size tags
- `.MuiAutocomplete-inputRoot` - Input root element
- `.MuiAutocomplete-input` - Input element
- `.MuiAutocomplete-inputFocused` - When input is focused
- `.MuiAutocomplete-endAdornment` - End adornment container
- `.MuiAutocomplete-clearIndicator` - Clear button
- `.MuiAutocomplete-popupIndicator` - Dropdown icon button
- `.MuiAutocomplete-popupIndicatorOpen` - When popup is open
- `.MuiAutocomplete-popper` - Popper element
- `.MuiAutocomplete-popperDisablePortal` - When portal is disabled
- `.MuiAutocomplete-paper` - Paper element
- `.MuiAutocomplete-listbox` - Listbox element
- `.MuiAutocomplete-loading` - Loading container
- `.MuiAutocomplete-noOptions` - No options container
- `.MuiAutocomplete-option` - Option element
- `.MuiAutocomplete-groupLabel` - Group label element
- `.MuiAutocomplete-groupUl` - Group list element

## Notable Features

### Dual State Management
- **Independent States**: The component manages two separate states - `value` (selected option) and `inputValue` (text in input). This allows fine-grained control over the component's behavior.
- **Controlled vs Uncontrolled**: Supports both fully controlled (via props) and uncontrolled (internal state) modes.
- **Referential Stability**: Documentation emphasizes using `useMemo` for derived values to prevent unnecessary re-renders.

### Free Solo Mode
- **Hybrid Behavior**: `freeSolo` enables a combo of autocomplete suggestions with free-form text entry.
- **Creatable Options**: Can be configured to create new options on the fly with proper focus/blur handling.
- **Keyboard Shortcuts**: Configurable Home/End key navigation, selection on focus, and blur behavior.

### Asynchronous Data Loading
- **Two Patterns**: Supports both "load on open" and "search as you type" patterns.
- **Loading State**: Built-in `loading` prop displays progress indicator during data fetching.
- **Custom Filtering**: When using async search, disable built-in filtering with `filterOptions={(x) => x}`.

### Multiple Selection
- **Tag/Chip Display**: Selected items render as removable chips by default.
- **Fixed Tags**: Can mark certain selections as non-removable (fixed options pattern).
- **Limit Visible Tags**: `limitTags` prevents UI overflow with many selections.
- **Custom Rendering**: Full control over tag appearance via `renderTags` prop.

### Grouping and Organization
- **Automatic Grouping**: `groupBy` function organizes options into categories.
- **Custom Group Rendering**: `renderGroup` allows custom group headers and styling.
- **Sorting Requirements**: Options should be pre-sorted by the grouping dimension for best results.

### Advanced Customization
- **Render Props Pattern**: `renderInput`, `renderOption`, `renderGroup`, `renderTags` provide comprehensive customization.
- **Component Slots**: Can replace internal components via `PaperComponent`, `PopperComponent`, `ListboxComponent`.
- **Headless Hook**: `useAutocomplete` hook available for complete UI control.

### Virtualization Support
- **Large Lists**: Built-in support for virtualizing long option lists via custom `ListboxComponent`.
- **Performance**: Essential for datasets with hundreds or thousands of options.

### Keyboard Navigation
- **Full Keyboard Support**: Arrow keys for navigation, Enter to select, Escape to close.
- **Home/End Keys**: Optional navigation to first/last option.
- **Type-Ahead**: Finds options as user types.

### Integration Features
- **Form Libraries**: Works seamlessly with Formik, React Hook Form, and other form libraries.
- **Validation**: Error states passed through `renderInput` to TextField.
- **Portal Behavior**: Popup can render in Portal (default) or inline for complex layouts.

### Accessibility (ARIA Compliance)
- **Combobox Pattern**: Follows W3C ARIA authoring practices for combobox.
- **Screen Reader Support**: Proper roles (`combobox`, `listbox`), labels, and announcements.
- **Keyboard Accessible**: Full keyboard navigation and control.
- **Focus Management**: Proper focus handling in popup and input.
- **Semantic HTML**: Uses appropriate elements and attributes.

## Research Notes

### Documentation Access
- Successfully accessed MUI documentation via web search and third-party resources
- Documentation is comprehensive and up-to-date (last updated April 2025)
- API reference available separately from component guide

### Framework Approach Observations

1. **Sophisticated State Model**: MUI's dual-state approach (value vs inputValue) provides maximum flexibility but requires understanding the distinction. This is more complex than simpler autocompletes but enables advanced use cases.

2. **Render Props Pattern**: Heavy use of render props (`renderInput`, `renderOption`, etc.) follows React best practices and provides escape hatches for any customization need.

3. **Headless Architecture**: The `useAutocomplete` hook demonstrates MUI's commitment to separation of concerns - logic separate from presentation.

4. **Async-First Design**: The component's architecture naturally supports async patterns, recognizing that most real-world autocompletes fetch data from APIs.

5. **Accessibility Excellence**: Strong ARIA compliance with proper keyboard navigation, screen reader support, and focus management out of the box.

6. **Composition Over Configuration**: Rather than endless boolean flags, MUI uses render props and component slots for customization.

7. **Performance Awareness**: Built-in support for virtualization and guidance on avoiding re-renders shows attention to real-world performance needs.

8. **Form Integration**: Designed to work within form systems with proper validation, error states, and form library integration patterns.

### Comparison Points for Implementation

- **Prop Naming**: Uses `options` (not `items`), `multiple` (not `multiSelect`), `freeSolo` (descriptive name)
- **State Props**: Separate `value`/`inputValue` with corresponding `onChange`/`onInputChange` callbacks
- **Rendering**: Required `renderInput` prop ensures flexibility while maintaining consistency
- **Loading Pattern**: Simple `loading` boolean combined with effects for async data
- **Grouping**: Single `groupBy` function returns string category name
- **Customization**: Render props > configuration props (flexible but requires more code)
- **Size**: Only two sizes (small, medium) keeping API simple
- **Tags**: In multiple mode, automatic chip display with customization options

### API Design Decisions

1. **Required renderInput**: Forces developers to explicitly handle input rendering, ensuring TextField integration is intentional
2. **Separate value states**: More verbose but prevents confusion between selection and input text
3. **Option structure flexibility**: Works with strings or objects, uses `getOptionLabel` for extraction
4. **Comparison function**: `isOptionEqualToValue` prevents common bugs with object options
5. **Comprehensive callbacks**: Multiple callbacks (`onOpen`, `onClose`, `onChange`, `onInputChange`) provide visibility into all state changes
6. **Portal by default**: Smart default for most use cases, with escape hatch via `disablePortal`

### Missing Features (by design)
- No built-in icon prop (use `renderOption` instead)
- No color variants (handled via theme and TextField)
- No built-in section dividers beyond groups (custom rendering handles this)
- No placeholder for each tag in multiple mode (keep UI clean)

### Evolution and Maturity
- Component evolved from `@material-ui/lab` to stable `@mui/material`
- API has stabilized with backward compatibility
- New `slotProps` API alongside older `componentsProps` shows gradual modernization
- Comprehensive examples and patterns reflect years of community feedback

This component represents a mature, production-ready autocomplete with excellent documentation and real-world usage patterns.
