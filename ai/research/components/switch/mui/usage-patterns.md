# MUI - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-switch/
Status: ✅ Working
Version: Current (Material-UI v6)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with multiple interactive examples, API reference, accessibility guidance, and customization patterns.

## Component Definition
- **Core purpose**: Toggle the state of a single setting on or off. MUI describes it as "the preferred way to adjust settings on mobile."
- **Mental model**: A binary toggle control representing an on/off state, similar to a physical light switch
- **Semantic meaning**: Communicates immediate state change for settings or preferences, typically used for enabling/disabling features

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`, `size="small"`)
- **Composed**: Via composition/wrapper components (e.g., `<FormControlLabel>`)
- **CSS-only**: Requires custom styling via `styled()` API (e.g., custom colors, icons)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Composed | Via `FormControlLabel` wrapper component with `label` prop |
| Icons | ✅ | CSS-only | Via custom styling with `styled()` API and SVG backgrounds/pseudo-elements |
| Loading indicator | ❌ | N/A | Not natively supported |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `checked` prop for controlled, `defaultChecked` for uncontrolled |
| Disabled | ✅ | Native | `disabled` prop or via `FormControlLabel` |
| Loading | ❌ | N/A | No native loading state |
| Read-only | ❌ | N/A | No native read-only state (use disabled as alternative) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="small"` for compact variant, default size when omitted |
| Color options | ✅ | Native | `color` prop with values: "primary" (default), "secondary", "warning", "default" |
| Label placement | ✅ | Composed | Via `FormControlLabel` `labelPlacement` prop (start, end, top, bottom) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Standard click/tap interaction |
| Keyboard control | ✅ | Native | Native browser keyboard support (Space to toggle) |
| onChange handler | ✅ | Native | `onChange={(event) => {}}` receives event with `event.target.checked` |
| Controlled mode | ✅ | Native | `checked` + `onChange` props for full React state control |
| Uncontrolled mode | ✅ | Native | `defaultChecked` prop for initial state without controlled updates |

## Code Examples

### Basic Usage
```jsx
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function BasicSwitches() {
  return (
    <div>
      <Switch {...label} defaultChecked />
      <Switch {...label} />
      <Switch {...label} disabled defaultChecked />
      <Switch {...label} disabled />
    </div>
  );
}
```

### With Labels
```jsx
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchLabels() {
  return (
    <FormGroup>
      <FormControlLabel control={<Switch defaultChecked />} label="Label" />
      <FormControlLabel required control={<Switch />} label="Required" />
      <FormControlLabel disabled control={<Switch />} label="Disabled" />
    </FormGroup>
  );
}
```

### Controlled Mode
```jsx
import * as React from 'react';
import Switch from '@mui/material/Switch';

export default function ControlledSwitches() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      slotProps={{ input: { 'aria-label': 'controlled' } }}
    />
  );
}
```

### Size Variations
```jsx
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Size switch demo' } };

export default function SwitchesSize() {
  return (
    <div>
      <Switch {...label} defaultChecked size="small" />
      <Switch {...label} defaultChecked />
    </div>
  );
}
```

### Color Variations
```jsx
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function ColorSwitches() {
  return (
    <div>
      <Switch {...label} defaultChecked />
      <Switch {...label} defaultChecked color="secondary" />
      <Switch {...label} defaultChecked color="warning" />
      <Switch {...label} defaultChecked color="default" />
      <PinkSwitch {...label} defaultChecked />
    </div>
  );
}
```

[View Live Examples](https://mui.com/material-ui/react-switch/)

## Notable Features

### Advanced Customization
- **Multiple styling presets**: MUI documentation includes Android 12, iOS, and custom icon-based switch variants
- **Icon integration**: Custom switches can embed SVG icons using pseudo-elements (::before/::after) or background images
- **Theme integration**: Full Material Design theme integration with color palette, spacing, and transition systems
- **Dark mode support**: Built-in support via `theme.applyStyles('dark', {...})` pattern

### Accessibility Patterns
- All form controls should have labels per WCAG guidelines
- When visible labels aren't possible, use `inputProps` to pass `aria-label`, `aria-labelledby`, or `title` attributes
- `FormControlLabel` automatically handles proper label association
- Native keyboard interaction (Space key toggles)

### Composition Patterns
- **FormControlLabel**: Wrapper for adding labels with configurable placement
- **FormGroup**: Container for grouping multiple switches with easier API
- **Styled API**: Extensive customization through MUI's styling system
- **SlotProps**: New API pattern for passing props to internal slots (e.g., `slotProps={{ input: {...} }}`)

### Implementation Details
- Uses native checkbox input underneath with custom styling overlay
- Supports both controlled and uncontrolled modes following React patterns
- Event handler receives standard React synthetic event with `event.target.checked`
- Color variants integrate with MUI theme palette
- Size prop only offers "small" and default (medium) - no large variant

## Research Notes

### Observations
- MUI Switch follows standard React controlled/uncontrolled component patterns
- Strong emphasis on accessibility throughout documentation
- Extensive customization examples showing iOS, Android, and custom designs
- No native loading state support (would require custom implementation)
- Icon support requires custom styling - not a native prop
- Label placement is handled through FormControlLabel wrapper, not directly on Switch
- Documentation is well-organized with clear progression from basic to advanced usage
- Source location: `packages/mui-material/src/Switch`

### Compared to Other UI Libraries
- More prescriptive styling approach than unstyled component libraries
- Provides both pre-built color variants AND extensive customization options
- Strong integration with Material Design system
- Accessibility is well-documented and emphasized
- No middle/indeterminate state support (unlike some checkbox implementations)

### Framework Approach
MUI takes a **composed component** approach where the base Switch is minimal, and features like labels are added through composition with FormControlLabel rather than being built into the Switch itself. This provides flexibility but requires understanding the ecosystem of supporting components.
