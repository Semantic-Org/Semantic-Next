# Radix UI - Slider Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/slider
Status: ✅ Working
Version: 1.3.6
Bundle Size: 8.76 kB (gzip)
Last Verified: 2025-11-10

## Documentation Quality
**Comprehensive** - Excellent documentation with complete API reference, multiple code examples in different styling approaches (vanilla CSS, CSS Modules, Tailwind), keyboard interaction guide, accessibility guidelines, and implementation caveats. Progressive complexity in examples from basic to advanced patterns.

## Component Definition
- **Core purpose**: Enables users to select a single value or range of values from a continuous or discrete range using draggable thumbs along a track.
- **Mental model**: A visual representation of numeric input where users slide handle(s) along a track to select value(s), similar to physical volume or dimmer controls.
- **Semantic meaning**: Communicates adjustable numeric values within defined boundaries, often used for settings, filters, price ranges, volume controls, or any bounded numeric selection.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `value` and `defaultValue` props accept number arrays; `min`, `max`, `step` control range |
| Range (min-max) | ✅ | Composed | Multiple `Slider.Thumb` components with `minStepsBetweenThumbs` prop to enforce minimum spacing |
| Labels/marks | ❌ | CSS-only | Not provided; would require custom implementation alongside slider |
| Tooltips on handle | ❌ | CSS-only | Not provided; would require custom tooltip component positioned relative to thumb |
| Custom handle content | ✅ | Composed | `Slider.Thumb` accepts children for custom content inside handle |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default behavior with single thumb: `<Slider.Thumb />` |
| Range (dual handles) | ✅ | Composed | Multiple thumbs: `defaultValue={[25, 75]}` with multiple `<Slider.Thumb />` |
| Vertical orientation | ✅ | Native | `orientation="vertical"` prop with CSS adjustments for height |
| Reverse direction | ✅ | Native | `inverted` boolean prop reverses value direction |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` boolean prop; `[data-disabled]` attribute on all parts |
| Read-only | ✅ | Native | Controlled mode with `value` prop (no onChange) prevents user changes |
| Error state | ❌ | CSS-only | No built-in error state; would require custom styling/validation |
| Loading | ❌ | CSS-only | No built-in loading state; would require custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop (default: 1) controls granularity; example: `step={10}` |
| Track marks | ❌ | CSS-only | Not provided; would require custom implementation |
| Color customization | ✅ | CSS-only | Full control via CSS classes on Track, Range, Thumb components |
| Size variants | ✅ | CSS-only | Width/height controlled through CSS; example shows 200px width, 20px thumb |
| Track styling | ✅ | CSS-only | Background colors, border-radius applied to `.SliderTrack` and `.SliderRange` |

## Code Examples

### Basic Usage (Single Value)
```jsx
import * as Slider from '@radix-ui/react-slider';

export default () => (
  <Slider.Root className="SliderRoot" defaultValue={[50]} max={100} step={1}>
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
);
```

### Range Slider (Dual Handles)
```jsx
<Slider.Root
  className="SliderRoot"
  defaultValue={[25, 75]}
  max={100}
  step={1}
  minStepsBetweenThumbs={1}
>
  <Slider.Track className="SliderTrack">
    <Slider.Range className="SliderRange" />
  </Slider.Track>
  <Slider.Thumb className="SliderThumb" />
  <Slider.Thumb className="SliderThumb" />
</Slider.Root>
```

### Vertical Orientation
```jsx
<Slider.Root
  className="SliderRoot"
  defaultValue={[50]}
  orientation="vertical"
>
  <Slider.Track className="SliderTrack">
    <Slider.Range className="SliderRange" />
  </Slider.Track>
  <Slider.Thumb className="SliderThumb" />
</Slider.Root>
```

### CSS Implementation (Vanilla)
```css
.SliderRoot {
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 200px;
  height: 20px;
}

.SliderTrack {
  background-color: #ddd;
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
}

.SliderRange {
  position: absolute;
  background-color: blue;
  border-radius: 9999px;
  height: 100%;
}

.SliderThumb {
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
}

.SliderThumb:hover {
  background-color: #f0f0f0;
}

.SliderThumb:focus {
  outline: none;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Vertical orientation adjustments */
.SliderRoot[data-orientation='vertical'] {
  flex-direction: column;
  width: 20px;
  height: 100px;
}
```

### Tailwind CSS Implementation
```jsx
<Slider.Root
  className="relative flex items-center select-none touch-none w-[200px] h-5"
  defaultValue={[50]}
  max={100}
  step={1}
>
  <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
    <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
  </Slider.Track>
  <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
</Slider.Root>
```

### Controlled Component with Callbacks
```jsx
const [values, setValues] = React.useState([25, 75]);

<Slider.Root
  value={values}
  onValueChange={setValues}
  onValueCommit={(finalValues) => {
    console.log('Final values:', finalValues);
  }}
  max={100}
  step={1}
>
  <Slider.Track className="SliderTrack">
    <Slider.Range className="SliderRange" />
  </Slider.Track>
  <Slider.Thumb className="SliderThumb" />
  <Slider.Thumb className="SliderThumb" />
</Slider.Root>
```

### Form Integration
```jsx
<form>
  <Slider.Root name="volume" defaultValue={[50]}>
    <Slider.Track className="SliderTrack">
      <Slider.Range className="SliderRange" />
    </Slider.Track>
    <Slider.Thumb className="SliderThumb" />
  </Slider.Root>
  {/* Renders hidden input: <input type="number" name="volume" value="50" /> */}
</form>
```

## Notable Features

### Keyboard Navigation
- **Arrow Keys**: Increment/decrement by `step` value
- **Shift + Arrow**: Increment/decrement by larger amount (10x step)
- **PageUp/PageDown**: Increment/decrement by larger amount
- **Home**: Jump to minimum value
- **End**: Jump to maximum value

### Accessibility
- Implements WAI-ARIA slider-multithumb pattern
- `[data-disabled]` and `[data-orientation]` attributes for styling hooks
- Proper keyboard navigation and screen reader support
- Focus management built-in

### Form Integration
- Automatically renders hidden inputs when inside `<form>` element
- Supports `name` and `form` props for form association
- Values submitted as part of form data

### Mouse Event Caveat
**Important**: Mouse events are not fired from Slider components. Use pointer events instead:
```jsx
// ❌ Don't use
onMouseDown={...}
onMouseUp={...}

// ✅ Use instead
onPointerDown={...}
onPointerUp={...}
```

### Advanced Features
- **Direction Control**: RTL support via `dir` prop
- **Thumb Collision Prevention**: `minStepsBetweenThumbs` prevents overlap
- **Two Callback Types**:
  - `onValueChange`: Fires continuously during drag
  - `onValueCommit`: Fires only when interaction completes
- **Track Click**: Clicking track moves nearest thumb to that position
- **Touch Support**: Full touch interaction with `touch-action: none`

### Compositional Architecture
Radix Slider follows a compositional pattern:
```
<Slider.Root>        ← Container with all logic/state
  <Slider.Track>     ← Visual track background
    <Slider.Range>   ← Filled portion between min and thumb(s)
  </Slider.Track>
  <Slider.Thumb />   ← Draggable handle(s)
</Slider.Root>
```

This allows fine-grained control over styling and behavior of each part independently.

## Research Notes

### Strengths
1. **Unstyled Primitive Approach**: Complete styling freedom while maintaining accessibility
2. **Multiple Styling Examples**: Vanilla CSS, CSS Modules, and Tailwind examples provided
3. **Range Support**: Built-in dual-thumb support with collision prevention
4. **Accessibility First**: WAI-ARIA compliant with full keyboard support
5. **Form Integration**: Seamless HTML form compatibility
6. **Flexible Orientation**: Native vertical/horizontal support
7. **Granular Control**: Separate callbacks for change vs commit events

### Limitations
1. **No Built-in Labels/Marks**: Must implement custom track markers
2. **No Built-in Tooltips**: Requires separate tooltip component integration
3. **No Error/Loading States**: Must implement custom validation states
4. **Mouse Event Restriction**: Must use pointer events exclusively

### Framework Philosophy
Radix Primitives focuses on providing unstyled, accessible components that serve as building blocks. This aligns with their "bring your own styles" philosophy - they handle behavior, accessibility, and state management while leaving visual design entirely to the consumer.

The component is production-ready and well-suited for design systems that need full control over visual appearance while benefiting from robust accessibility and interaction patterns.
