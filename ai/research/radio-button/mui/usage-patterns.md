# MUI - Radio Button Usage Patterns

## Component URL
https://mui.com/material-ui/react-radio-button/
Status: ✅ Successfully researched via web search

## Documentation Quality
Comprehensive - MUI provides detailed documentation with API reference for both Radio and RadioGroup components, multiple examples covering basic to advanced use cases, accessibility guidance, form integration patterns, and extensive customization options.

## Component Definition
- **Core purpose**: Provides radio button input controls for single-choice selection from a set of mutually exclusive options, typically grouped together using RadioGroup for proper behavior and keyboard accessibility.
- **Mental model**: A form control that allows users to select exactly one option from a set. Radio buttons work in groups where selecting one automatically deselects others. The RadioGroup wrapper manages the group behavior and provides an easier API with proper keyboard navigation.
- **Semantic meaning**: Represents a single selection from multiple options. Uses native HTML radio input semantics with proper ARIA attributes. Radio buttons should be used when users can see all available options and must make a single choice (unlike Select which hides options in a dropdown).

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text labels | ✅ | Labels provided via FormControlLabel component wrapping the Radio. The `label` prop accepts strings or React nodes |
| Icon support | ✅ | Supports custom icons via `icon` and `checkedIcon` props. Can use Material Icons or custom SVG components |
| Custom content | ✅ | FormControlLabel's `label` prop accepts any React node, enabling complex content like multiple lines, images, or custom components |
| Label positioning | ✅ | FormControlLabel's `labelPlacement` prop: `"end"` (default), `"start"`, `"top"`, `"bottom"` |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Standalone radio | ✅ | Radio can be used without RadioGroup for custom implementations. Requires manual state management |
| Radio group | ✅ | RadioGroup wrapper provides easier API, proper keyboard navigation, and automatic mutual exclusivity |
| Button style | ❌ | No built-in button-style radio. MUI provides separate ToggleButtonGroup component for button-style single selection |
| Row layout | ✅ | RadioGroup with `row` prop lays out radio buttons horizontally. Default is vertical (column) layout |
| Column layout | ✅ | Default layout. Radio buttons stack vertically in a column |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Checked | ✅ | `checked` prop (boolean) on Radio. RadioGroup manages via `value` prop matching Radio's `value` |
| Disabled | ✅ | `disabled` prop (boolean) on individual Radio or FormControlLabel. Can disable entire group or individual options |
| Error | ✅ | FormControl's `error` prop displays error state. Combine with FormHelperText for validation messages |
| Required | ✅ | Set `aria-required="true"` on RadioGroup element (not individual radios). Use FormControl's `required` prop |
| Indeterminate | ❌ | Not applicable to radio buttons (checkbox-only state) |
| Loading | ❌ | No built-in loading state |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `size` prop: `"small"`, `"medium"` (default), `"large"`. Can also customize via `sx` prop to set font size of SVG icons |
| Color options | ✅ | `color` prop: `"primary"` (default), `"secondary"`, `"error"`, `"info"`, `"success"`, `"warning"`, `"default"`. Custom colors via `sx` prop |
| Orientation | ✅ | RadioGroup's `row` prop for horizontal layout. Vertical is default |
| Spacing control | ✅ | Control spacing via RadioGroup's `sx` prop with gap/spacing utilities, or FormControl with spacing between FormControlLabels |
| Custom icons | ✅ | `icon` and `checkedIcon` props accept custom React components/SVG icons |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| onChange handler | ✅ | Radio: `onChange(event)`. RadioGroup: `onChange(event, value)` - cleaner API with direct value access |
| Controlled | ✅ | RadioGroup with `value` and `onChange` props. React state controls selection |
| Uncontrolled | ✅ | RadioGroup with `defaultValue` prop. Internal state management |
| Form integration | ✅ | Works with native forms via `name` prop. Compatible with FormControl, FormLabel, FormHelperText for complete form fields |
| Keyboard navigation | ✅ | RadioGroup provides proper arrow key navigation between options automatically |
| Focus management | ✅ | Proper focus ring styling and focus management through ButtonBase component |

## Code Examples

### Basic Radio Group (Uncontrolled)
```jsx
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

<FormControl>
  <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="female"
    name="radio-buttons-group"
  >
    <FormControlLabel value="female" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="other" control={<Radio />} label="Other" />
  </RadioGroup>
</FormControl>
```

### Controlled Radio Group
```jsx
import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function ControlledRadioButtonsGroup() {
  const [value, setValue] = useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
}
```

### Horizontal Layout (Row)
```jsx
<RadioGroup row defaultValue="30" name="radio-buttons-group">
  <FormControlLabel value="10" control={<Radio />} label="10" />
  <FormControlLabel value="20" control={<Radio />} label="20" />
  <FormControlLabel value="30" control={<Radio />} label="30" />
</RadioGroup>
```

### Label Placement Variations
```jsx
<RadioGroup row defaultValue="vm" name="radio-buttons-group">
  <FormControlLabel
    labelPlacement="start"
    value="vm"
    control={<Radio />}
    label="Very much"
  />
  <FormControlLabel
    labelPlacement="top"
    value="av"
    control={<Radio />}
    label="Average"
  />
  <FormControlLabel
    labelPlacement="bottom"
    value="no"
    control={<Radio />}
    label="Not much"
  />
  <FormControlLabel
    labelPlacement="end"
    value="vb"
    control={<Radio />}
    label="Very bad"
  />
</RadioGroup>
```

### Size Variations
```jsx
// Small size
<Radio size="small" />

// Medium size (default)
<Radio />
<Radio size="medium" />

// Custom size via sx prop
<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
```

### Color Variations
```jsx
// Primary (default)
<Radio />
<Radio color="primary" />

// Other semantic colors
<Radio color="secondary" />
<Radio color="success" />
<Radio color="error" />
<Radio color="info" />
<Radio color="warning" />
<Radio color="default" />

// Custom color via sx prop
<Radio
  sx={{
    color: pink[800],
    '&.Mui-checked': {
      color: pink[600]
    }
  }}
/>
```

### Custom Icons
```jsx
import Radio from '@mui/material/Radio';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

<Radio
  icon={<RadioButtonUncheckedIcon />}
  checkedIcon={<RadioButtonCheckedIcon />}
/>

// With custom SVG icons
<Radio
  icon={<CustomUncheckedIcon />}
  checkedIcon={<CustomCheckedIcon />}
/>
```

### Disabled States
```jsx
// Disabled individual radio
<FormControlLabel
  value="disabled"
  disabled
  control={<Radio />}
  label="Disabled option"
/>

// Disabled Radio directly
<Radio disabled />
<Radio disabled checked />
```

### Error State with Validation
```jsx
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';

function ErrorRadios() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('Choose wisely');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === '') {
      setHelperText('Please select an option.');
      setError(true);
    } else if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl error={error}>
        <FormLabel id="demo-error-radios">Pop quiz: Material UI is...</FormLabel>
        <RadioGroup
          aria-labelledby="demo-error-radios"
          name="quiz"
          value={value}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="best" control={<Radio />} label="The best!" />
          <FormControlLabel value="worst" control={<Radio />} label="The worst." />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
      <Button type="submit" variant="outlined">
        Check Answer
      </Button>
    </form>
  );
}
```

### Standalone Radio (Without RadioGroup)
```jsx
// Manual state management required
const [selectedValue, setSelectedValue] = useState('a');

const handleChange = (event) => {
  setSelectedValue(event.target.value);
};

<div>
  <Radio
    checked={selectedValue === 'a'}
    onChange={handleChange}
    value="a"
    name="radio-buttons"
    inputProps={{ 'aria-label': 'A' }}
  />
  <Radio
    checked={selectedValue === 'b'}
    onChange={handleChange}
    value="b"
    name="radio-buttons"
    inputProps={{ 'aria-label': 'B' }}
  />
</div>
```

### Using useRadioGroup Hook for Advanced Customization
```jsx
import { useRadioGroup } from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';

const StyledFormControlLabel = styled((props) => {
  const radioGroup = useRadioGroup();

  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <FormControlLabel checked={checked} {...props} />;
})(({ theme, checked }) => ({
  '.MuiFormControlLabel-label': checked && {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}));

function MyCustomRadioGroup() {
  return (
    <RadioGroup name="use-radio-group" defaultValue="first">
      <StyledFormControlLabel value="first" label="First" control={<Radio />} />
      <StyledFormControlLabel value="second" label="Second" control={<Radio />} />
    </RadioGroup>
  );
}
```

### Accessibility Example
```jsx
<FormControl required component="fieldset">
  <FormLabel component="legend">Pick a side</FormLabel>
  <RadioGroup
    aria-labelledby="side-selection-label"
    aria-required="true"
    name="side-selection"
  >
    <FormControlLabel
      value="light"
      control={<Radio inputProps={{ 'aria-label': 'Light side option' }} />}
      label="Light side"
    />
    <FormControlLabel
      value="dark"
      control={<Radio inputProps={{ 'aria-label': 'Dark side option' }} />}
      label="Dark side"
    />
  </RadioGroup>
</FormControl>
```

## Complete Props API

### Radio Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | boolean | - | If true, the component is checked |
| `checkedIcon` | node | - | The icon to display when the component is checked |
| `color` | `'primary'` \| `'secondary'` \| `'error'` \| `'info'` \| `'success'` \| `'warning'` \| `'default'` | `'primary'` | The color of the component |
| `disabled` | boolean | `false` | If true, the component is disabled |
| `disableRipple` | boolean | `false` | If true, the ripple effect is disabled |
| `icon` | node | - | The icon to display when the component is unchecked |
| `id` | string | - | The id of the input element |
| `inputProps` | object | - | **Deprecated** - Use `slotProps.input` instead. Attributes applied to the input element |
| `inputRef` | ref | - | Pass a ref to the input element |
| `name` | string | - | Name attribute of the input element |
| `onChange` | function | - | Callback fired when the state is changed. Signature: `function(event: React.ChangeEvent) => void` |
| `required` | boolean | `false` | If true, the input element is required |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | The size of the component |
| `sx` | object | - | System prop for custom styling |
| `value` | any | - | The value of the component |

**Note:** Props from ButtonBase component are also available.

### RadioGroup Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | The content of the component (typically FormControlLabel components) |
| `defaultValue` | any | - | The default value (uncontrolled mode) |
| `name` | string | - | The name used to reference the value of the control |
| `onChange` | function | - | Callback fired when a radio button is selected. Signature: `function(event: React.ChangeEvent, value: string) => void` |
| `value` | any | - | The currently selected value (controlled mode) |
| `row` | boolean | `false` | Display group of elements in a row |

**Note:** Props from FormGroup component are also available (which gives access to `row` and other layout props).

### FormControlLabel Props (Commonly Used)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `control` | element | - | A control element (e.g., Radio component) |
| `label` | node | - | The label content |
| `labelPlacement` | `'bottom'` \| `'end'` \| `'start'` \| `'top'` | `'end'` | The position of the label |
| `disabled` | boolean | `false` | If true, the control is disabled |
| `value` | any | - | The value of the component |

## CSS Classes for Customization

### Radio Component Classes

- `.MuiRadio-root` - Root element
- `.MuiRadio-colorPrimary` - Applied when `color="primary"`
- `.MuiRadio-colorSecondary` - Applied when `color="secondary"`
- `.Mui-checked` - Pseudo-class applied when checked
- `.Mui-disabled` - Pseudo-class applied when disabled
- `.Mui-focusVisible` - Pseudo-class applied when focused via keyboard

### RadioGroup Component Classes

- `.MuiRadioGroup-root` - Root element
- `.MuiRadioGroup-row` - Applied when `row={true}`

### FormControlLabel Classes

- `.MuiFormControlLabel-root` - Root element
- `.MuiFormControlLabel-labelPlacementStart` - When `labelPlacement="start"`
- `.MuiFormControlLabel-labelPlacementTop` - When `labelPlacement="top"`
- `.MuiFormControlLabel-labelPlacementBottom` - When `labelPlacement="bottom"`
- `.Mui-disabled` - Pseudo-class applied when disabled

## Notable Features

### RadioGroup Wrapper Benefits
- **Easier API**: Manages the selected value at the group level rather than tracking checked state for each radio
- **Keyboard Accessibility**: Automatic arrow key navigation between radio options
- **Mutual Exclusivity**: Automatically handles deselecting other options when one is selected
- **Form Integration**: Single `name` prop manages the group as one form control

### useRadioGroup Hook
- **Advanced Customization**: Exposed hook that returns the RadioGroup context value
- **Custom Components**: Enables creating custom radio components that integrate with RadioGroup state
- **Styling Based on State**: Access to parent RadioGroup's value for conditional styling

### ButtonBase Integration
- **Ripple Effect**: Radio buttons inherit Material Design ripple effect from ButtonBase
- **Focus Management**: Proper keyboard focus handling and visual focus indicators
- **Touch Targets**: Meets accessibility touch target size requirements (48x48px minimum)

### Flexible Label Positioning
- **Four Placement Options**: Labels can be positioned on any side (start, end, top, bottom)
- **Responsive Layouts**: Different label positions can create various UI patterns
- **Use Cases**: Top/bottom placement useful for compact horizontal layouts, start placement for right-to-left languages

### Color System Integration
- **Semantic Colors**: Built-in support for theme semantic colors (primary, secondary, error, success, etc.)
- **Theme Consistency**: Colors automatically adapt to theme changes (light/dark mode)
- **Custom Colors**: Full customization via `sx` prop with theme-aware values

### Form Control Integration
- **FormControl**: Wraps RadioGroup for error states and validation
- **FormLabel**: Provides accessible labels for the group
- **FormHelperText**: Displays helper text and validation messages
- **Complete Form Fields**: All pieces work together for full-featured form inputs

### Size Variations
- **Three Built-in Sizes**: Small, medium (default), and large
- **Custom Sizing**: Font size of SVG icons can be customized via `sx` prop
- **Responsive Sizing**: Different sizes can be used based on screen size

### Custom Icons Support
- **Full Icon Customization**: Both checked and unchecked states support custom icons
- **Material Icons**: Works seamlessly with @mui/icons-material package
- **Custom SVG**: Can use custom SVG components for brand-specific designs

### Accessibility Features
- **Proper ARIA Attributes**: `aria-labelledby`, `aria-required`, `aria-describedby` automatically applied
- **Semantic HTML**: Uses native radio input for proper form and screen reader behavior
- **Keyboard Navigation**: Full keyboard support (Tab, Arrow keys, Space to select)
- **Focus Indicators**: Clear visual focus indicators for keyboard users
- **Required Field Support**: `aria-required` properly set on RadioGroup element

### State Management Flexibility
- **Controlled Mode**: Full control with `value` and `onChange` props
- **Uncontrolled Mode**: Simpler implementation with `defaultValue`
- **Hybrid Approach**: Can mix controlled group with uncontrolled individual radios for advanced cases

## Research Notes

### Documentation Access
- Successfully researched via web search due to network restrictions on direct fetch
- Gathered comprehensive information from official MUI documentation pages and API references
- All information is from current Material UI v5+ documentation

### Framework Approach Observations

1. **Component Composition Pattern**: MUI uses a composition pattern with separate Radio, RadioGroup, FormControlLabel, FormControl, and FormHelperText components that work together. This provides flexibility but requires understanding how components compose.

2. **Controlled vs Uncontrolled**: Clear distinction between controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) patterns, following React conventions.

3. **Accessibility-First**: Strong focus on proper ARIA attributes and semantic HTML. RadioGroup automatically handles many accessibility concerns that would otherwise need manual implementation.

4. **Theme Integration**: Deep integration with MUI's theming system. Colors, sizes, and other styling can be customized globally via theme or locally via `sx` prop.

5. **Progressive Enhancement**: Basic functionality works with minimal props, with additional features available through optional props and composition patterns.

6. **ButtonBase Foundation**: Radio builds on ButtonBase component, inheriting ripple effects, focus management, and other interaction patterns consistent across MUI.

### Comparison Points for Implementation

- **Prop Names**: Uses `color` string enum (not boolean variants), `size` string enum, `labelPlacement` for positioning
- **Group Management**: RadioGroup provides cleaner API than managing individual radio states
- **Form Integration**: Designed to work with FormControl, FormLabel, FormHelperText for complete form fields
- **Customization**: Both styling (`sx`, `classes`) and structural customization (custom icons, `useRadioGroup` hook)
- **Deprecation Path**: Some props like `inputProps` are deprecated in favor of new `slotProps` pattern, showing evolution toward more consistent API

### Pattern Recommendations

1. **Always Use RadioGroup**: Unless you have specific needs for manual control, RadioGroup provides better UX and accessibility
2. **FormControl for Forms**: Wrap RadioGroup in FormControl when building form fields to get error states and helper text
3. **Controlled Components**: Prefer controlled components for forms to enable validation and state management
4. **Label Placement**: Use `labelPlacement` on FormControlLabel for layout flexibility
5. **Accessibility**: Always provide `aria-labelledby` or `aria-label` for RadioGroup
6. **Custom Icons**: Use Material Icons or consistent custom icons for brand identity
7. **Error Handling**: Combine FormControl's `error` prop with FormHelperText for validation feedback

### Missing Features (by Design)

- **No Button Style**: MUI provides separate ToggleButtonGroup component for button-style selection
- **No Indeterminate State**: Not applicable to radio buttons (checkbox-only)
- **No Loading State**: Not typically needed for radio buttons
- **Limited Built-in Styles**: Prefers customization through `sx` prop and theme rather than many style props

This minimalist approach keeps the component focused while providing extensive customization through the styling system and composition patterns.

---

Last Modified: 2025-11-05
