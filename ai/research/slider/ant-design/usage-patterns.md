# Ant Design - Slider Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://ant.design/components/slider
Status: ✅ Working
Version: 5.x (Current - as of 2025)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with detailed API reference, multiple examples (12+ demos), TypeScript support, and accessibility features well documented.

## Component Definition
- **Core purpose**: A data entry component that allows users to input a value within a specified range by dragging a handle along a track, displaying current values and intervals.
- **Mental model**: A draggable slider control for selecting numeric values within a bounded range, similar to volume controls or timeline scrubbers. Can operate as single-value or dual-value (range) selector.
- **Semantic meaning**: An input control for continuous or discrete numeric values. Communicates "select a value by dragging" with visual feedback showing the current selection and available range.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={50}` or `range={true}`)
- **Composed**: Via composition/children (e.g., custom content in marks)
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `value` prop (number or [number, number] for range mode); controlled via `onChange` callback |
| Range (min-max) | ✅ | Native | `min` and `max` props define bounds (default: 0-100); `range={true}` enables dual-thumb selection returning [min, max] array |
| Labels/marks | ✅ | Native | `marks` prop accepts object mapping positions to labels/ReactNodes (e.g., `{0: '0°C', 100: '100°C'}`); supports custom styling |
| Tooltips on handle | ✅ | Native | Built-in tooltip showing current value; customizable via `tooltip.formatter` function; control visibility with `tooltip.open` |
| Custom handle content | ✅ | Composed | Tooltip formatter returns ReactNode for custom display; marks accept ReactNode for custom labels |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default mode - `value={number}` or `defaultValue={number}` for single handle slider |
| Range (dual handles) | ✅ | Native | `range={true}` enables dual-thumb mode with `value={[min, max]}` array; supports `draggableTrack` for moving entire range |
| Vertical orientation | ✅ | Native | `vertical={true}` switches to vertical layout; height should be set via CSS or container |
| Reverse direction | ✅ | Native | `reverse={true}` (v5.0+) reverses the slider direction (right-to-left for horizontal, bottom-to-top for vertical) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled={true}` prevents interaction; grayed-out visual state |
| Read-only | ❌ | — | No dedicated read-only prop; workaround via `disabled` or removing event handlers |
| Error state | ❌ | — | No built-in error/validation state; can be composed with Form validation |
| Loading | ❌ | — | No built-in loading state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step={10}` defines increment value; `step={null}` allows free-form sliding; `dots={true}` snaps to marks only |
| Track marks | ✅ | Native | `marks` object defines tick positions and labels; `dots={true}` shows dots at step intervals; `included={true}` (default) highlights track between min and handle |
| Color customization | ✅ | CSS-only | Customizable via `classNames` and `styles` props (v5.10.0+) or global theme tokens; no direct color prop |
| Size variants | ❌ | CSS-only | No built-in size prop; can customize via CSS or `styles` prop |
| Track styling | ✅ | CSS-only | Customizable via `classNames` and `styles` semantic props for track, rail, handle elements |

## Advanced Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard control | ✅ | Native | `keyboard={true}` (default, v5.2.0+) enables arrow key control when focused |
| Auto-focus | ✅ | Native | `autoFocus={true}` focuses slider on mount |
| Draggable track | ✅ | Native | `draggableTrack={true}` (range mode only) allows dragging the entire selected range |
| Dynamic nodes | ✅ | Native | `editable={true}` (v5.20.0+) enables adding/removing handles dynamically; `minCount` and `maxCount` control node limits |
| Tooltip control | ✅ | Native | `tooltip.open` controls visibility; `tooltip.placement` sets position; `tooltip.autoAdjustOverflow={true}` (v5.8.0+) prevents overflow |
| Custom container | ✅ | Native | `tooltip.getPopupContainer` specifies DOM node for tooltip rendering |
| Change callbacks | ✅ | Native | `onChange` fires during drag; `onChangeComplete` fires on mouseup/keyup for final value |

## Code Examples

### Basic Single Value Slider
```jsx
import React, { useState } from 'react';
import { Slider } from 'antd';

export default function App() {
  const [currentValue, setCurrentValue] = useState(0);

  return (
    <div style={{ display: 'block', width: 700, padding: 30 }}>
      <h4>Basic Slider</h4>
      <Slider
        defaultValue={0}
        disabled={false}
        max={100}
        onChange={(value) => {
          setCurrentValue(value);
        }}
      />
      Slider Value: {currentValue}
    </div>
  );
}
```

### Range Slider (Dual Handles)
```jsx
import { Slider } from 'antd';

// Basic range slider
<Slider range defaultValue={[20, 50]} />

// Range with controlled state
const [range, setRange] = useState([20, 50]);

<Slider
  range
  value={range}
  onChange={(newRange) => setRange(newRange)}
  min={0}
  max={100}
/>
```

### Slider with Marks and Steps
```jsx
import { Slider } from 'antd';

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: { color: '#f50' },
    label: <strong>100°C</strong>,
  },
};

<Slider
  marks={marks}
  defaultValue={37}
  step={1}
  dots={true}
/>
```

### Vertical Slider
```jsx
import { Slider } from 'antd';

<div style={{ height: 300 }}>
  <Slider
    vertical
    defaultValue={30}
    min={0}
    max={100}
  />
</div>
```

### Slider with Custom Tooltip
```jsx
import { Slider } from 'antd';

<Slider
  defaultValue={37}
  tooltip={{
    formatter: (value) => `${value}%`,
    placement: 'top',
    open: true, // Always show tooltip
  }}
/>

// Hide tooltip
<Slider
  defaultValue={37}
  tooltip={{
    formatter: null, // Hides tooltip
  }}
/>
```

### Draggable Track Range Slider
```jsx
import { Slider } from 'antd';

<Slider
  range
  draggableTrack
  defaultValue={[20, 50]}
  min={0}
  max={100}
/>
```

### Slider with Dynamic Handles (v5.20.0+)
```jsx
import { Slider } from 'antd';

<Slider
  range
  editable
  minCount={1}
  maxCount={5}
  defaultValue={[20, 50]}
/>
```

### Disabled Slider
```jsx
import { Slider } from 'antd';

<Slider defaultValue={30} disabled />
```

### Reverse Direction Slider
```jsx
import { Slider } from 'antd';

// Horizontal reverse (right to left)
<Slider reverse defaultValue={30} />

// Vertical reverse (bottom to top)
<Slider vertical reverse defaultValue={30} />
```

## Notable Features

### Advanced API Props
- **dots**: Boolean to show dots at step intervals, with `included` controlling whether only steps within range show dots
- **keyboard**: Enables arrow key control when focused (v5.2.0+, default: true)
- **step**: Accepts number or `null` for continuous sliding without snapping
- **draggableTrack**: In range mode, enables dragging the entire selected range as a unit
- **editable**: (v5.20.0+) Allows dynamic addition/removal of slider handles with configurable min/max node counts
- **onChange vs onChangeComplete**: `onChange` fires during drag for real-time updates; `onChangeComplete` fires only on mouseup/keyup for performance optimization

### Tooltip System
Sophisticated tooltip configuration:
- **formatter**: Custom display function (return ReactNode or null to hide)
- **placement**: Positioning relative to handle (inherits from Tooltip component)
- **open**: Force visibility state (true/false/undefined for auto)
- **autoAdjustOverflow**: (v5.8.0+) Automatically repositions tooltip to prevent viewport overflow
- **getPopupContainer**: Custom container for portal rendering

### Styling Architecture (v5.10.0+)
Semantic styling system:
- **classNames**: Object mapping semantic keys (track, rail, handle, marks) to class names
- **styles**: Object mapping semantic keys to inline style objects
- Enables precise control over individual slider parts without global CSS

### Marks System
Flexible mark definition:
- Object keys represent positions (numbers between min and max)
- Values can be strings (simple labels) or objects with `style` and `label` properties
- Labels accept ReactNode for custom content (icons, formatted text, etc.)
- Marks automatically align with slider position

### Range Mode Capabilities
- **Dual handles**: Array value `[min, max]` for range selection
- **Draggable track**: Move entire range by dragging the track between handles
- **Dynamic handles**: (v5.20.0+) Add/remove handles with `editable={true}`, control count with `minCount`/`maxCount`
- **Independent callbacks**: Each handle triggers same onChange with updated array

### Accessibility Features
- Keyboard navigation with arrow keys (v5.2.0+)
- Auto-focus support for immediate keyboard control
- Semantic HTML with proper ARIA attributes
- Focus management with `blur()` and `focus()` methods

### Performance Optimizations
- **onChangeComplete**: Separate callback for final value (mouseup/keyup) avoids expensive operations during drag
- **Controlled vs uncontrolled**: `defaultValue` for uncontrolled (internal state), `value` for controlled (external state)
- **Tooltip optimization**: Can disable or control visibility to reduce DOM updates

## Research Notes

### Documentation Access
- Main documentation at https://ant.design/components/slider is comprehensive and actively maintained
- GitHub repository contains raw markdown documentation at https://github.com/ant-design/ant-design/blob/master/components/slider/index.en-US.md
- TypeScript definitions available for full type safety

### Framework Evolution
- **v5.2.0**: Added `keyboard` prop for arrow key control (default: true)
- **v5.8.0**: Introduced `tooltip.autoAdjustOverflow` for viewport-aware positioning
- **v5.10.0**: Added semantic `classNames` and `styles` props for granular styling
- **v5.20.0**: Major feature addition - `editable` prop enables dynamic handle management with `minCount`/`maxCount`

### Implementation Observations
- Built on React with strong TypeScript support and comprehensive type definitions
- Uses ReactNode throughout for maximum flexibility (tooltip formatter, mark labels)
- Tooltip implementation integrates with Ant Design's Tooltip component for consistent behavior
- Smooth animations and interactions via CSS transitions
- Proper event handling with separate drag vs complete callbacks for performance

### Unique Strengths
1. **Dynamic handle management**: v5.20.0+ allows adding/removing handles at runtime - rare in slider implementations
2. **Draggable track**: In range mode, can drag the entire range as a unit, not just individual handles
3. **Rich marks system**: Supports complex mark labels with custom styling and ReactNode content
4. **Sophisticated tooltip control**: Fine-grained control over tooltip behavior, positioning, and content
5. **Reverse direction**: Native support for RTL and bottom-to-top orientations
6. **Keyboard control**: Full keyboard navigation with customizable step increments
7. **Dual callbacks**: Separate onChange (real-time) and onChangeComplete (final) for performance optimization
8. **Semantic styling**: v5.10.0+ granular styling system for individual slider components
9. **Null step mode**: `step={null}` enables continuous sliding without snapping to increments
10. **Comprehensive accessibility**: Built-in focus management, keyboard support, and ARIA attributes

### Comparison with Other Frameworks
- **More advanced than most**: Dynamic handle editing and draggable track are uncommon features
- **Strong TypeScript integration**: Better type safety than many competitor implementations
- **Tooltip flexibility**: More control than typical slider tooltip implementations
- **React-centric**: Deeply integrated with React patterns (hooks, controlled components, ReactNode)
