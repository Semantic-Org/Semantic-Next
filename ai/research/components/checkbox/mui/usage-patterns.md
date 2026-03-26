# MUI (Material-UI) - Checkbox Usage Patterns

## Component URL
https://mui.com/material-ui/react-checkbox/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/checkbox/
Version: Current (v5+)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, code examples, and accessibility guidance.

---

## 1. Component Overview

The MUI Checkbox component is a Material Design implementation of a binary selection control. It allows users to toggle between checked, unchecked, and indeterminate states. Built on top of the ButtonBase component, it inherits all of ButtonBase's functionality while providing Material Design styling, ripple effects, and accessibility features out of the box. The component integrates seamlessly with MUI's form composition components (FormControlLabel, FormGroup) and supports extensive theming and customization through the Material-UI theming system.

---

## 2. Basic Usage

### Import
```jsx
import Checkbox from '@mui/material/Checkbox';
// or
import { Checkbox } from '@mui/material';
```

### Simple Checkbox
```jsx
<Checkbox />
```

### Checkbox with Label (using FormControlLabel)
```jsx
import FormControlLabel from '@mui/material/FormControlLabel';

<FormControlLabel
  control={<Checkbox />}
  label="Accept terms and conditions"
/>
```

### Controlled Checkbox
```jsx
import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
    />
  );
}
```

### Uncontrolled Checkbox
```jsx
<Checkbox defaultChecked />
```

---

## 3. Props/API

### Core Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | If `true`, the component is checked. Use for controlled components. |
| `defaultChecked` | `boolean` | `false` | The default checked state. Use for uncontrolled components. |
| `onChange` | `function` | - | Callback fired when the state is changed. Signature: `(event: React.ChangeEvent<HTMLInputElement>) => void` |
| `value` | `any` | - | The value of the component. The DOM API casts this to a string. Browser uses "on" as default. |
| `name` | `string` | - | Name attribute of the input element. Useful for form submission. |
| `indeterminate` | `boolean` | `false` | If `true`, the component appears indeterminate (partially checked). |
| `disabled` | `boolean` | `false` | If `true`, the component is disabled. |
| `required` | `boolean` | `false` | If `true`, the input element is required for form submission. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning' \| string` | `'primary'` | The color of the component. |
| `size` | `'small' \| 'medium' \| 'large' \| string` | `'medium'` | The size of the component. |
| `checkedIcon` | `node` | `<CheckBoxIcon />` | The icon to display when the component is checked. |
| `icon` | `node` | `<CheckBoxOutlineBlankIcon />` | The icon to display when the component is unchecked. |
| `indeterminateIcon` | `node` | `<IndeterminateCheckBoxIcon />` | The icon to display when the component is indeterminate. |
| `inputProps` | `object` | - | Attributes applied to the input element (e.g., aria-label). |
| `inputRef` | `ref` | - | Pass a ref to the input element. |
| `classes` | `object` | - | Override or extend the styles applied to the component. |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | The system prop for defining custom styles with theme access. |
| `disableRipple` | `boolean` | `false` | If `true`, the ripple effect is disabled. |
| `edge` | `'start' \| 'end' \| false` | `false` | If given, uses a negative margin to counteract padding on one side. |
| `id` | `string` | - | The id of the input element. |

### Inherited Props from ButtonBase

The Checkbox component inherits all props from ButtonBase, including:
- `action`
- `centerRipple`
- `disableTouchRipple`
- `focusRipple`
- `focusVisibleClassName`
- `LinkComponent`
- `onFocusVisible`
- `TouchRippleProps`
- And more...

---

## 4. Variants & Patterns

### Controlled vs Uncontrolled

**Controlled:**
```jsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

**Uncontrolled:**
```jsx
<Checkbox defaultChecked />
```

**Important:** Avoid switching a checkbox from uncontrolled to controlled or vice versa, as this can lead to unexpected behavior and console warnings.

### Label Placement (FormControlLabel)

```jsx
import FormControlLabel from '@mui/material/FormControlLabel';

// Label on the right (default)
<FormControlLabel control={<Checkbox />} label="Label" />

// Label on the left
<FormControlLabel
  control={<Checkbox />}
  label="Label"
  labelPlacement="start"
/>

// Label on top
<FormControlLabel
  control={<Checkbox />}
  label="Label"
  labelPlacement="top"
/>

// Label on bottom
<FormControlLabel
  control={<Checkbox />}
  label="Label"
  labelPlacement="bottom"
/>
```

### Size Variants

```jsx
<Checkbox size="small" />
<Checkbox size="medium" /> // default
<Checkbox size="large" />

// Custom size using sx prop
<Checkbox
  sx={{
    '& .MuiSvgIcon-root': { fontSize: 28 }
  }}
/>
```

### Color Variants

```jsx
<Checkbox color="default" />
<Checkbox color="primary" /> // default
<Checkbox color="secondary" />
<Checkbox color="error" />
<Checkbox color="info" />
<Checkbox color="success" />
<Checkbox color="warning" />

// Custom color using sx prop
<Checkbox
  sx={{
    color: '#a61107',
    '&.Mui-checked': {
      color: '#f56358',
    },
  }}
/>
```

### Indeterminate State

The indeterminate state represents a "partially checked" or "mixed" state, commonly used for parent checkboxes that control child checkboxes.

```jsx
const [checked, setChecked] = useState([true, false]);

const handleChange1 = (event) => {
  setChecked([event.target.checked, event.target.checked]);
};

const handleChange2 = (event) => {
  setChecked([event.target.checked, checked[1]]);
};

const handleChange3 = (event) => {
  setChecked([checked[0], event.target.checked]);
};

<FormControlLabel
  label="Parent"
  control={
    <Checkbox
      checked={checked[0] && checked[1]}
      indeterminate={checked[0] !== checked[1]}
      onChange={handleChange1}
    />
  }
/>
<FormGroup sx={{ ml: 3 }}>
  <FormControlLabel
    label="Child 1"
    control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
  />
  <FormControlLabel
    label="Child 2"
    control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
  />
</FormGroup>
```

**Note:** When `indeterminate` is set, the value of the `checked` prop only impacts form submission values, not visual appearance.

### Disabled State

```jsx
<Checkbox disabled />
<Checkbox disabled checked />

<FormControlLabel
  disabled
  control={<Checkbox />}
  label="Disabled"
/>
```

### Required/Error States

```jsx
// Required checkbox
<FormControlLabel
  required
  control={<Checkbox />}
  label="Required"
/>

// Error state with validation
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

<FormControl error={hasError}>
  <FormControlLabel
    control={<Checkbox />}
    label="I agree to the terms"
  />
  {hasError && (
    <FormHelperText>You must accept the terms</FormHelperText>
  )}
</FormControl>
```

### Icon Customization

```jsx
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import Bookmark from '@mui/icons-material/Bookmark';

// Custom checked/unchecked icons
<Checkbox
  icon={<FavoriteBorder />}
  checkedIcon={<Favorite />}
/>

<Checkbox
  icon={<BookmarkBorder />}
  checkedIcon={<Bookmark />}
/>

// Custom indeterminate icon
<Checkbox
  indeterminate
  indeterminateIcon={<CustomIndeterminateIcon />}
/>
```

### Checkbox Groups (FormGroup)

```jsx
import FormGroup from '@mui/material/FormGroup';

const [state, setState] = useState({
  gilad: true,
  jason: false,
  antoine: false,
});

const handleChange = (event) => {
  setState({
    ...state,
    [event.target.name]: event.target.checked,
  });
};

<FormGroup>
  <FormControlLabel
    control={
      <Checkbox
        checked={state.gilad}
        onChange={handleChange}
        name="gilad"
      />
    }
    label="Gilad Gray"
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={state.jason}
        onChange={handleChange}
        name="jason"
      />
    }
    label="Jason Killian"
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={state.antoine}
        onChange={handleChange}
        name="antoine"
      />
    }
    label="Antoine Llorca"
  />
</FormGroup>
```

---

## 5. Composition Patterns

### With FormControlLabel
FormControlLabel provides label management and layout for the checkbox:

```jsx
<FormControlLabel
  control={<Checkbox />}
  label="Accept terms"
  labelPlacement="end" // 'end' | 'start' | 'top' | 'bottom'
/>
```

### With FormGroup
FormGroup groups multiple checkboxes with consistent layout:

```jsx
<FormGroup row> {/* row prop for horizontal layout */}
  <FormControlLabel control={<Checkbox defaultChecked />} label="Label 1" />
  <FormControlLabel control={<Checkbox />} label="Label 2" />
  <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
</FormGroup>
```

### With FormControl and FormHelperText
For validation and helper text:

```jsx
<FormControl component="fieldset" variant="standard">
  <FormLabel component="legend">Select options</FormLabel>
  <FormGroup>
    <FormControlLabel
      control={<Checkbox checked={value.option1} onChange={handleChange} name="option1" />}
      label="Option 1"
    />
    <FormControlLabel
      control={<Checkbox checked={value.option2} onChange={handleChange} name="option2" />}
      label="Option 2"
    />
  </FormGroup>
  <FormHelperText>Choose at least one option</FormHelperText>
</FormControl>
```

### In Forms
```jsx
<form onSubmit={handleSubmit}>
  <FormControlLabel
    control={
      <Checkbox
        checked={formData.subscribe}
        onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
        name="subscribe"
        value="newsletter"
      />
    }
    label="Subscribe to newsletter"
  />
  <button type="submit">Submit</button>
</form>
```

---

## 6. Styling & Theming

### Using the sx Prop

The `sx` prop is the recommended approach for one-off customization:

```jsx
<Checkbox
  sx={{
    color: pink[800],
    '&.Mui-checked': {
      color: pink[600]
    },
    '&.Mui-disabled': {
      color: grey[400]
    }
  }}
/>
```

### Targeting Icon Size
```jsx
<Checkbox
  sx={{
    '& .MuiSvgIcon-root': {
      fontSize: 28
    }
  }}
/>
```

### Using Styled Components

```jsx
import { styled } from '@mui/material/styles';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&.Mui-checked': {
    color: theme.palette.secondary.main,
  },
}));

<CustomCheckbox />
```

### Theme Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
        color: 'secondary',
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-checked': {
            color: '#f56358',
          },
        },
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <Checkbox />
</ThemeProvider>
```

### Custom Color in Theme

```jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    customColor: {
      main: '#a61107',
    },
  },
});

// Extend palette types if using TypeScript
<Checkbox color="customColor" />
```

### Global CSS Classes

MUI exposes global class names you can target:
- `.MuiCheckbox-root` - Styles applied to the root element
- `.MuiCheckbox-checked` - State class applied when checked
- `.MuiCheckbox-disabled` - State class applied when disabled
- `.MuiCheckbox-indeterminate` - State class applied when indeterminate
- `.MuiCheckbox-colorPrimary` - Styles for primary color
- `.MuiCheckbox-colorSecondary` - Styles for secondary color

---

## 7. Accessibility

### ARIA Attributes

MUI Checkbox has built-in ARIA support:

```jsx
// When used with FormControlLabel, label association is automatic
<FormControlLabel
  control={<Checkbox />}
  label="Accept terms"
/>

// Without FormControlLabel, use aria-label or aria-labelledby
<Checkbox
  inputProps={{
    'aria-label': 'Accept terms and conditions'
  }}
/>

<label id="checkbox-label">Custom label</label>
<Checkbox
  inputProps={{
    'aria-labelledby': 'checkbox-label'
  }}
/>

// For descriptions
<Checkbox
  inputProps={{
    'aria-describedby': 'checkbox-description'
  }}
/>
<p id="checkbox-description">This checkbox controls notifications</p>
```

### Keyboard Support

MUI Checkbox provides full keyboard support automatically:

- **Tab**: Move focus to/from the checkbox
- **Space**: Toggle the checkbox state
- Focus visible state (`.Mui-focusVisible`) is triggered when navigating via keyboard

### Screen Reader Support

The component works seamlessly with screen readers:
- Announces the label (via FormControlLabel or aria-label)
- Announces the checked/unchecked state
- Announces the indeterminate state when applicable
- Announces disabled state
- Announces required state

### Best Practices for Accessibility

1. **Always provide labels:**
   ```jsx
   // Good
   <FormControlLabel control={<Checkbox />} label="Option" />

   // Good (when FormControlLabel can't be used)
   <Checkbox inputProps={{ 'aria-label': 'Option' }} />

   // Bad
   <Checkbox />
   ```

2. **Group related checkboxes:**
   ```jsx
   <FormControl component="fieldset">
     <FormLabel component="legend">Preferences</FormLabel>
     <FormGroup>
       <FormControlLabel control={<Checkbox />} label="Email" />
       <FormControlLabel control={<Checkbox />} label="SMS" />
     </FormGroup>
   </FormControl>
   ```

3. **Provide validation feedback:**
   ```jsx
   <FormControl error={hasError}>
     <FormControlLabel control={<Checkbox />} label="Required option" />
     <FormHelperText>This field is required</FormHelperText>
   </FormControl>
   ```

4. **Use appropriate required indicators:**
   ```jsx
   <FormControlLabel required control={<Checkbox />} label="Required" />
   ```

---

## 8. Best Practices

### When to Use Checkboxes

- **Multiple selections**: When users can select zero, one, or multiple options from a list
- **Binary choices**: For standalone on/off or yes/no decisions
- **Settings/Preferences**: For enabling/disabling features
- **Agreement/Consent**: For terms acceptance or acknowledgments
- **Filters**: For applying multiple filter criteria

### When NOT to Use Checkboxes

- **Mutually exclusive options**: Use Radio buttons instead
- **Single selection from many**: Use Select/Dropdown instead
- **Immediate action**: Use Switch if the change takes effect immediately
- **Binary toggle with immediate effect**: Use Switch component instead

### Common Patterns

**Select All Pattern:**
```jsx
const [selectedAll, setSelectedAll] = useState(false);
const [selected, setSelected] = useState({ a: false, b: false, c: false });

const handleSelectAll = (event) => {
  const newValue = event.target.checked;
  setSelectedAll(newValue);
  setSelected({ a: newValue, b: newValue, c: newValue });
};

const handleChange = (event) => {
  const newSelected = { ...selected, [event.target.name]: event.target.checked };
  setSelected(newSelected);
  setSelectedAll(Object.values(newSelected).every(Boolean));
};

<FormControlLabel
  label="Select All"
  control={
    <Checkbox
      checked={selectedAll}
      indeterminate={Object.values(selected).some(Boolean) && !selectedAll}
      onChange={handleSelectAll}
    />
  }
/>
<FormGroup>
  <FormControlLabel control={<Checkbox checked={selected.a} onChange={handleChange} name="a" />} label="A" />
  <FormControlLabel control={<Checkbox checked={selected.b} onChange={handleChange} name="b" />} label="B" />
  <FormControlLabel control={<Checkbox checked={selected.c} onChange={handleChange} name="c" />} label="C" />
</FormGroup>
```

**Form Integration with React Hook Form:**
```jsx
import { Controller, useForm } from 'react-hook-form';

const { control, handleSubmit } = useForm();

<Controller
  name="acceptTerms"
  control={control}
  defaultValue={false}
  rules={{ required: 'You must accept the terms' }}
  render={({ field, fieldState: { error } }) => (
    <FormControl error={!!error}>
      <FormControlLabel
        control={<Checkbox {...field} checked={field.value} />}
        label="I accept the terms and conditions"
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  )}
/>
```

**Handling Multiple Checkboxes:**
```jsx
const [state, setState] = useState({
  option1: false,
  option2: false,
  option3: false,
});

const handleChange = (event) => {
  setState({
    ...state,
    [event.target.name]: event.target.checked,
  });
};

// Use event.target.name and event.target.checked (not event.target.value)
```

### Material Design Guidelines

1. **Label Position**: Labels should typically be to the right of the checkbox
2. **Touch Targets**: Ensure adequate spacing for touch interfaces (minimum 48x48px)
3. **Visual Feedback**: The ripple effect provides immediate visual feedback
4. **Grouping**: Related checkboxes should be grouped using FormGroup
5. **Disabled State**: Disabled checkboxes should have reduced opacity
6. **Focus State**: Focus should be clearly visible for keyboard navigation

---

## 9. Comparison Notes

### Unique to Material Design/MUI

1. **Ripple Effect**: Material Design signature ripple animation on interaction (can be disabled with `disableRipple`)

2. **Built on ButtonBase**: Inherits advanced interaction patterns from ButtonBase component

3. **Three Visual States**: Clear visual distinction between checked, unchecked, and indeterminate with dedicated Material icons

4. **Edge Prop**: Special `edge` prop for adjusting positioning when used at the start or end of a container

5. **Color System Integration**: Deep integration with Material-UI's color system (primary, secondary, error, info, success, warning)

6. **FormControl Integration**: Seamless integration with MUI's form composition components (FormControl, FormLabel, FormGroup, FormHelperText)

7. **Theme Consistency**: Automatically inherits theme properties and can be customized globally via theme

8. **Focus Visible State**: Distinguishes between focus from clicking vs keyboard navigation (`.Mui-focusVisible`)

9. **sx Prop**: Direct access to theme values and advanced CSS capabilities via the sx prop

10. **Material Icons**: Uses Material Icons library by default for check/indeterminate indicators

### Material Design Philosophy

- **Visual Language**: Follows Material Design principles for elevation, motion, and interaction
- **Consistency**: Provides consistent behavior and appearance across all MUI components
- **Accessibility First**: ARIA attributes and keyboard navigation built-in by default
- **Responsive**: Designed to work across different screen sizes and input methods
- **Theming**: Strong emphasis on design system consistency through theming

---

## Research Notes

- MUI documentation is comprehensive and well-maintained with live interactive examples
- API reference is detailed with prop types, defaults, and descriptions
- Strong emphasis on accessibility throughout the documentation
- Component follows Material Design specifications closely
- The component has evolved from older versions (v1-v4) to current v5 with improved TypeScript support
- Focus on composition patterns with FormControlLabel, FormGroup, etc. rather than building everything into a single monolithic component
- The `sx` prop is the modern recommended approach for styling over older methods
- Documentation includes practical examples for common use cases (form integration, validation, etc.)
- Material-UI doesn't manage a standard "focused" state, only a "focusVisible" state for keyboard navigation
- The indeterminate state is a visual-only state that doesn't affect form submission (the checked value is what gets submitted)

---

## Notable Features

1. **Composition-First Design**: MUI encourages composing checkboxes with FormControlLabel, FormGroup, etc. rather than providing all-in-one components

2. **Icon Customization**: Full control over checked, unchecked, and indeterminate icons enables creative implementations (like favorite/unfavorite toggles)

3. **Advanced Form Integration**: Works seamlessly with form libraries like React Hook Form, Redux Form, and Formik

4. **Theme-Aware**: Automatically responds to theme changes and mode switches (light/dark)

5. **TypeScript Support**: First-class TypeScript support with comprehensive type definitions

6. **Global Customization**: Can customize default props and styles for all checkboxes via theme configuration

7. **Performance**: Optimized for performance with proper event handling and minimal re-renders

8. **Rich State Management**: Supports controlled, uncontrolled, and mixed usage patterns

9. **Comprehensive Styling Options**: Multiple ways to customize (sx prop, styled components, theme, classes prop)

10. **Accessibility Compliance**: Meets WCAG guidelines with proper ARIA attributes, keyboard navigation, and screen reader support
