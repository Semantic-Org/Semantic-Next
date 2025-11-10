# MUI (Material UI) - Slider Usage Patterns

## Component URL
https://mui.com/material-ui/react-slider/
Status: ✅ Working
Version: v5+ (Current as of 2025)
Last Verified: 2025-11-10

## Documentation Quality
Good - Comprehensive API reference with clear examples and prop documentation. The documentation provides both conceptual guides and detailed API references, though the WebFetch tool had difficulty extracting full content due to heavy CSS preprocessing.

## Component Definition
- **Core purpose**: Enables users to select single values or ranges within a defined numeric domain through an interactive track-based interface. Ideal for adjusting settings like volume, brightness, or applying image filters.
- **Mental model**: A continuous or discrete value selector represented as a draggable thumb(s) on a horizontal or vertical track, visually showing the selected portion of the available range.
- **Semantic meaning**: Communicates both the current selection and the available range of values, with optional marks indicating significant values along the continuum.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `value` prop controls current value, `onChange` callback receives numeric value |
| Range (min-max) | ✅ | Native | Array value `[min, max]` creates dual-handle range slider |
| Labels/marks | ✅ | Native | `marks` prop accepts boolean or array of `{value, label}` objects |
| Tooltips on handle | ✅ | Native | `valueLabelDisplay` prop ("auto", "on", "off") controls value label display |
| Custom handle content | ✅ | Composed | Custom components can be passed via `components` prop with `ThumbComponent` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default behavior with numeric `value` prop |
| Range (dual handles) | ✅ | Native | Array `value={[15, 65]}` creates two draggable thumbs |
| Vertical orientation | ✅ | Native | `orientation="vertical"` prop switches to vertical layout |
| Reverse direction | ✅ | Native | `track="inverted"` prop reverses visual progression |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop prevents interaction while maintaining visual presence |
| Read-only | ✅ | Native | `readOnly` prop allows display without modification |
| Error state | ✅ | Native | `color="error"` provides visual error indication |
| Loading | ❌ | N/A | No built-in loading state pattern |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop defines discrete value intervals; `step={null}` with marks for specific values |
| Track marks | ✅ | Native | `marks={true}` for automatic step marks, or array of `{value, label}` objects for custom |
| Color customization | ✅ | Native | `color` prop: "primary", "secondary", "error", "warning", "info", "success" |
| Size variants | ✅ | Native | `size="small"` or `size="medium"` (default) |
| Track styling | ✅ | Native + CSS-only | `track` prop ("normal", "inverted", false) + CSS custom properties |

## Code Examples

### Basic Single Value Slider
```jsx
import React, { useState } from "react";
import Slider from "@mui/material/Slider";

const App = () => {
  const [value, setValue] = useState(50);

  function handleRangeSlider(event, value) {
    setValue(value);
  }

  return (
    <div style={{ width: "300px" }}>
      <Slider
        size="small"
        defaultValue={50}
        valueLabelDisplay="auto"
        value={value}
        onChange={handleRangeSlider}
      />
      <h4>You have selected {value} in range slider</h4>
    </div>
  );
};

export default App;
```

### Range Slider (Dual Handles)
```jsx
import React, { useState } from "react";
import Slider from "@mui/material/Slider";

const App = () => {
  const [range, setRange] = useState([15, 65]);

  function handleRangeSlider(e, range) {
    setRange(range);
  }

  return (
    <div style={{ width: "300px" }}>
      <Slider
        getAriaLabel={() => "Select Range"}
        value={range}
        onChange={handleRangeSlider}
        valueLabelDisplay="auto"
      />
      <h4>You have selected {range[0]}, {range[1]} in range slider.</h4>
    </div>
  );
};

export default App;
```

### Slider with Custom Marks
```jsx
import React, { useState } from "react";
import Slider from "@mui/material/Slider";

const App = () => {
  const [value, setValue] = useState(64);

  const marks = [
    { value: 2, label: "2" },
    { value: 4, label: "4" },
    { value: 8, label: "8" },
    { value: 16, label: "16" },
    { value: 32, label: "32" },
    { value: 64, label: "64" }
  ];

  function handleSlider(e, value) {
    setValue(value);
  }

  return (
    <div style={{ width: "300px" }}>
      <Slider
        aria-label="Custom steps in the slider"
        defaultValue={64}
        onChange={handleSlider}
        valueLabelDisplay="auto"
        step={null}
        marks={marks}
      />
      <h4>You have selected {value} in the slider.</h4>
    </div>
  );
};

export default App;
```

### Slider with Input Field
```jsx
import React from "react";
import Slider from "@mui/material/Slider";
import Input from '@mui/material/Input';

const App = () => {
  const [val, setVal] = React.useState(68);

  const handleSliderInput = (e, newValue) => {
    setVal(newValue);
  };

  const handleInputChange = (e) => {
    setVal(e.target.value === '' ? '' : Number(e.target.value));
  };

  return (
    <div style={{ padding: 40, width: '50%' }}>
      <Slider
        value={typeof val === 'number' ? val : 0}
        onChange={handleSliderInput}
        aria-labelledby="slider-with-input"
        valueLabelDisplay="on"
        color="secondary"
      />
      <Input
        value={val}
        size="small"
        onChange={handleInputChange}
        inputProps={{
          step: 5,
          min: 0,
          max: 50,
          type: 'number',
          'aria-labelledby': 'slider-with-input',
        }}
      />
    </div>
  );
};

export default App;
```

### Vertical Slider
```jsx
import Slider from "@mui/material/Slider";

<Slider
  orientation="vertical"
  defaultValue={30}
  valueLabelDisplay="auto"
  min={0}
  max={100}
/>
```

### Disabled Slider
```jsx
import Slider from "@mui/material/Slider";

<Slider
  disabled
  defaultValue={30}
  valueLabelDisplay="auto"
/>
```

## Notable Features

### Key Props and API
- **value / defaultValue**: Controlled vs uncontrolled component pattern
- **onChange(event, value)**: Callback receives both event and numeric value
- **min / max**: Define the available range (defaults: 0-100)
- **step**: Increment size for discrete values; `null` with marks for specific values only
- **marks**: Boolean for automatic marks or array of `{value, label}` objects
- **valueLabelDisplay**: "auto" (on hover/drag), "on" (always), "off" (never)
- **orientation**: "horizontal" (default) or "vertical"
- **color**: Theme color variants (primary, secondary, error, warning, info, success)
- **size**: "small" or "medium"
- **track**: "normal" (default), "inverted", or false to hide track
- **disabled / readOnly**: State control props
- **getAriaLabel / getAriaValueText**: Accessibility support
- **disableSwap**: Prevents thumb swapping in range mode
- **scale**: Custom value transformation function
- **shiftStep**: Custom increment for Shift+Arrow or Page keys

### Material Design Integration
- Leverages CSS custom properties for theming (`--mui-palette-Slider-*`)
- Follows Material Design principles for touch target sizing and interaction
- Built-in accessibility with ARIA attributes and keyboard navigation
- Smooth animations and transitions for thumb and value label

### Composition Capabilities
- **components** prop allows replacing internal subcomponents:
  - `Rail`: The track background
  - `Track`: The active portion of track
  - `Thumb`: The draggable handle
  - `ValueLabel`: The tooltip showing current value
  - `Mark`: Individual mark indicators
  - `MarkLabel`: Labels for marks
- **componentsProps** allows passing props to these subcomponents
- Enables deep customization while maintaining accessibility

### Advanced Patterns
- **Scale transformations**: `scale` prop allows logarithmic or custom value mappings
- **Custom step behavior**: `shiftStep` for keyboard navigation optimization
- **Integration with inputs**: Common pattern combines Slider with TextField/Input for dual control
- **Controlled arrays**: Range sliders can be precisely controlled via state management

## Research Notes

### Documentation Access Challenges
The WebFetch tool encountered difficulties extracting the full documentation content from the MUI website, likely due to:
- Heavy CSS preprocessing and styling code dominating the page source
- Possible client-side rendering requiring JavaScript execution
- Complex documentation build system (appears to use Next.js or similar)

This required supplementing with WebSearch results and external tutorial sources to gather comprehensive information.

### Documentation Strengths
- Clear separation of conceptual guide and API reference
- Multiple complete code examples covering common use cases
- Good accessibility documentation with ARIA integration
- Material Design compliance clearly communicated

### Documentation Gaps Observed
- No explicit loading state pattern (common for async value fetching)
- Limited discussion of performance considerations for large ranges
- Custom styling examples could be more prominent
- Animation customization not well documented

### Comparison Notes
MUI Slider demonstrates a mature, production-ready component with:
- Comprehensive native prop support for most common patterns
- Strong accessibility foundation with ARIA
- Deep customization through component composition system
- Clear Material Design visual language
- Excellent TypeScript support (implicit in modern MUI)

The component favors **native prop support** over composition for most features, making it straightforward to use for common cases while still providing escape hatches for custom requirements through the `components` and `componentsProps` system.
