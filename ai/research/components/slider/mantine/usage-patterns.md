# Mantine - Slider Usage Patterns

## Component URL
https://mantine.dev/core/slider/
Status: ✅ Working
Version: Current (Mantine v7)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with extensive code examples, clear prop descriptions, and multiple pattern demonstrations including accessibility, styling, and advanced features.

## Component Definition
- **Core purpose**: Provides an interactive control for selecting numeric values within a defined range, supporting both single-value and range selection patterns with rich customization options.
- **Mental model**: Users think of this as a draggable track with a thumb control that represents a numeric value or range. The slider visually represents progress along a scale with optional marks and labels.
- **Semantic meaning**: Communicates adjustable numeric input within constraints, often for settings, filters, or selections where visual feedback of position along a scale is valuable.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `value`/`defaultValue` props with `min`, `max`, `step` configuration. Supports integers and decimals with arbitrary precision |
| Range (min-max) | ✅ | Native | Separate `RangeSlider` component for dual-value selection with `defaultValue={[min, max]}` array pattern |
| Labels/marks | ✅ | Native | `marks` prop accepts array of objects with `value` and optional `label`. Mark values are relative to slider value, not width |
| Tooltips on handle | ✅ | Native | `label` prop accepts formatter function `(value) => string` or `null` to hide. `labelAlwaysOn` keeps label visible without dragging. Custom transitions via `labelTransitionProps` |
| Custom handle content | ✅ | Native | `thumbChildren` prop accepts React nodes (icons, text) rendered inside thumb element. `thumbSize` controls dimensions |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default `Slider` component with controlled (`value`/`onChange`) or uncontrolled (`defaultValue`) state |
| Range (dual handles) | ✅ | Native | Dedicated `RangeSlider` component with array-based value `[min, max]` and dual `thumbChildren` array support |
| Vertical orientation | ❌ | CSS-only | Not built-in. Documentation suggests using `use-move` hook for custom vertical implementations |
| Reverse direction | ✅ | Native | `inverted` prop reverses track fill direction visually |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` boolean prop prevents interaction and applies disabled styling |
| Read-only | ⚠️ | Native | Achievable through `disabled` state - no distinct read-only mode |
| Error state | ❌ | CSS-only | No built-in error state prop. Would require custom styling via Styles API |
| Loading | ❌ | CSS-only | No built-in loading state. Would require custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop controls increment size (supports decimals like `0.0005`). `restrictToMarks` limits values to mark positions only |
| Track marks | ✅ | Native | `marks` array with `{ value, label }` objects. Styles API allows customization of `mark` and `markLabel` elements |
| Color customization | ✅ | Native | `color` prop integrates with Mantine theme colors (e.g., "blue", "red"). Custom colors via Styles API for `thumb`, `bar`, `track` |
| Size variants | ✅ | Native | `size` prop controls track thickness (xs, sm, md, lg, xl). `radius` prop controls border radius with same scale |
| Track styling | ✅ | Native | Comprehensive Styles API targeting: `root`, `label`, `thumb`, `track`, `bar`, `mark`, `markLabel`. Also accepts `classNames` prop |

## Code Examples

### Basic Usage with Marks
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return (
    <Slider
      color="blue"
      defaultValue={40}
      marks={[
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' },
      ]}
    />
  );
}
```

### Controlled Component with State
```tsx
import { useState } from 'react';
import { Slider } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState(40);
  return <Slider value={value} onChange={setValue} />;
}
```

### Range Slider (Dual Handles)
```tsx
import { RangeSlider } from '@mantine/core';

function Demo() {
  return (
    <RangeSlider
      defaultValue={[20, 60]}
      marks={[
        { value: 0, label: 'Min' },
        { value: 100, label: 'Max' },
      ]}
    />
  );
}
```

### Custom Label Formatting
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Hidden label */}
      <Slider defaultValue={40} label={null} />

      {/* Formatted label */}
      <Slider defaultValue={40} label={(value) => `${value} °C`} />

      {/* Always visible label */}
      <Slider defaultValue={40} labelAlwaysOn />

      {/* Custom label transition */}
      <Slider
        defaultValue={40}
        labelTransitionProps={{
          transition: 'skew-down',
          duration: 150,
          timingFunction: 'linear',
        }}
      />
    </>
  );
}
```

### Decimal Steps and Precision
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return (
    <Slider
      min={0}
      max={1}
      step={0.0005}
      defaultValue={0.5535}
      label={(value) => value.toFixed(4)}
    />
  );
}
```

### Custom Thumb Content (Icons)
```tsx
import { Slider, RangeSlider } from '@mantine/core';
import { IconHeart, IconHeartBroken } from '@tabler/icons-react';

function Demo() {
  return (
    <>
      {/* Single slider with icon */}
      <Slider
        thumbChildren={<IconHeart size={16} />}
        color="red"
        label={null}
        defaultValue={40}
        thumbSize={26}
        styles={{ thumb: { borderWidth: 2, padding: 3 } }}
      />

      {/* Range slider with different icons */}
      <RangeSlider
        styles={{ thumb: { borderWidth: 2, padding: 3 } }}
        color="red"
        label={null}
        defaultValue={[20, 60]}
        thumbSize={26}
        thumbChildren={[
          <IconHeart size={16} key="1" />,
          <IconHeartBroken size={16} key="2" />
        ]}
      />
    </>
  );
}
```

### Scale Transformation (Exponential Values)
```tsx
import { Slider } from '@mantine/core';

function valueLabelFormat(value: number) {
  const units = ['KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let scaledValue = value;

  while (scaledValue >= 1024 && unitIndex < units.length - 1) {
    unitIndex += 1;
    scaledValue /= 1024;
  }

  return `${scaledValue} ${units[unitIndex]}`;
}

const getScale = (v: number) => 2 ** v;

function Demo() {
  return (
    <Slider
      scale={getScale}
      step={1}
      min={2}
      max={30}
      labelAlwaysOn
      defaultValue={10}
      label={valueLabelFormat}
    />
  );
}
```

### Restrict to Marks Pattern
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return (
    <Slider
      restrictToMarks
      defaultValue={25}
      marks={[
        { value: 0 },
        { value: 25 },
        { value: 50 },
        { value: 75 },
        { value: 100 },
      ]}
    />
  );
}
```

### onChange vs onChangeEnd
```tsx
import { useState } from 'react';
import { Slider, Text, Box } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState(50);
  const [endValue, setEndValue] = useState(50);

  return (
    <Box>
      <Slider
        value={value}
        onChange={setValue}        // Fires continuously while dragging
        onChangeEnd={setEndValue}  // Fires only when drag completes
      />
      <Text>onChange value: <b>{value}</b></Text>
      <Text>onChangeEnd value: <b>{endValue}</b></Text>
    </Box>
  );
}
```

### Domain Configuration
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return (
    <Slider
      domain={[0, 100]}  // Full value range
      min={10}           // Visual/interaction minimum
      max={90}           // Visual/interaction maximum
      defaultValue={25}
      marks={[
        { value: 10, label: 'min' },
        { value: 90, label: 'max' },
      ]}
    />
  );
}
```

### Inverted Track Direction
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return <Slider inverted defaultValue={80} />;
}
```

### Custom Styling with Styles API
```tsx
import { Slider } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Slider
      defaultValue={40}
      size={2}
      classNames={classes}  // Custom CSS module classes
      marks={[
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' },
      ]}
    />
  );
}
```

### Accessibility Features
```tsx
import { Slider } from '@mantine/core';

function Demo() {
  return (
    <Slider
      thumbLabel="Volume control"  // aria-label for screen readers
      defaultValue={50}
    />
  );
}
```

## Notable Features

### Comprehensive Prop API
- **Dual Component Pattern**: Separate `Slider` and `RangeSlider` components rather than a single component with mode switching
- **Scale Transformation**: Built-in `scale` prop allows mathematical transformations (e.g., exponential scales for file sizes)
- **Domain Separation**: `domain` prop allows independent value range from visual `min`/`max` bounds

### Rich Customization
- **Styles API**: Granular control over 7 distinct elements: `root`, `label`, `thumb`, `track`, `bar`, `mark`, `markLabel`
- **Thumb Customization**: Both size (`thumbSize`) and content (`thumbChildren`) can be customized, including per-thumb in range sliders
- **Label Control**: Multiple label behaviors (hidden, formatted, always-on) with customizable transitions

### Developer Experience
- **Controlled/Uncontrolled**: Full support for both patterns with `value`/`onChange` vs `defaultValue`
- **Change Events**: Distinction between `onChange` (continuous) and `onChangeEnd` (completion) callbacks
- **TypeScript**: Full TypeScript support with proper prop typing

### Accessibility
- **Keyboard Navigation**: Arrow keys adjust by step; Home/End set to min/max
- **ARIA Support**: `thumbLabel` prop for screen reader descriptions
- **Focus Management**: Proper focus indicators on thumb elements

### Advanced Patterns
- **Restrict to Marks**: `restrictToMarks` prop limits selection to predefined positions
- **Inverted Direction**: Visual reversal of track fill with `inverted` prop
- **Mark System**: Marks are value-based (not position-based), ensuring correct alignment regardless of scale

### Integration Points
- **Theme Integration**: `color` prop works with Mantine's theme system
- **Size System**: Consistent sizing scale (xs-xl) across `size` and `radius` props
- **Custom Hooks**: Documentation references `use-move` hook for building custom slider implementations

## Research Notes

### Documentation Strengths
- Extremely comprehensive with 15+ distinct code examples
- Each pattern is demonstrated with working TypeScript/JSX code
- Clear explanation of mark positioning (value-relative, not width-relative)
- Explicit guidance on vertical slider implementation (use `use-move` hook)

### API Design Observations
- **Separation of Concerns**: Slider and RangeSlider are distinct components rather than a mode prop
- **Explicit over Implicit**: Many props (like `labelAlwaysOn`, `restrictToMarks`) make behavior explicit
- **Flexibility**: The `scale` prop pattern allows complex transformations without complex APIs

### Missing Patterns
- No built-in vertical orientation (requires custom implementation)
- No distinct read-only state (only disabled)
- No built-in error or loading states (would require custom styling)
- No built-in tooltip on hover over track marks (only on thumb)

### Framework Integration
- Pure React component using hooks pattern
- Relies on Mantine's core styling system and theme
- Would require adaptation for use in non-React frameworks

### Comparison Notes
- More feature-rich than basic HTML `<input type="range">`
- Provides both simple (default behavior) and complex (scale, domain) use cases
- Strong TypeScript integration throughout
- Clear separation between presentation (Styles API) and behavior (props)
