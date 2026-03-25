# PrimeReact - Tooltip Usage Patterns

## Component URL
- Primary: https://primereact.org/tooltip/

Status: ✅ Working (URL accessible)

## Documentation Quality
**Excellent** - Documentation is comprehensive and well-structured with extensive examples. Includes:
- Clear component overview explaining dual usage modes (built-in vs standalone)
- Extensive code examples covering all major use cases
- Complete tooltipOptions reference with types and defaults
- Detailed accessibility section with ARIA roles and keyboard navigation
- Practical examples showing reactive content, mouse tracking, and template content
- Solutions for edge cases (disabled elements, custom positioning)
- Data attribute reference for standalone usage
- Multiple trigger patterns (hover, focus, both)

## Component Definition
- **Core purpose**: An overlay component that displays contextual information on user interaction, integrated across PrimeReact form components and available as a standalone component for custom targets
- **Mental model**: A lightweight informational popup that appears near its target element, providing helpful text or rich content without requiring user interaction beyond hovering or focusing
- **Semantic meaning**: Provides supplementary information about UI elements that helps users understand their purpose or requirements. Uses proper ARIA `tooltip` role for assistive technology recognition

## Target Element Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Built-in form component support | ✅ | Primary pattern. Form components (InputText, Button, etc.) support native `tooltip` prop: `<InputText tooltip="Enter username" />` |
| CSS selector targeting | ✅ | Standalone component uses `target` prop with CSS selector: `<Tooltip target=".custom-icon" />`. Can target multiple elements with same class |
| Data attribute content | ✅ | Elements use `data-pr-tooltip` attribute for content: `<i data-pr-tooltip="No notifications" />` |
| Query selector specificity | ✅ | Supports complex selectors: `<Tooltip target=".slider>.p-slider-handle" />` for nested elements |
| Multiple targets | ✅ | Single Tooltip component can target multiple elements via class selector |
| Dynamic target elements | ✅ | Works with dynamically added elements matching selector |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Simple string via `tooltip` prop or `data-pr-tooltip` attribute: `tooltip="Enter your username"` |
| Reactive content | ✅ | Content updates based on state: `<Tooltip content={\`${value}%\`} />` or `tooltip={buttonTooltip}` |
| Template/Rich content | ✅ | Standalone Tooltip accepts JSX children: `<Tooltip target=".btn"><img src="logo.png" /></Tooltip>` |
| HTML content | ✅ | Can include any HTML/React components as children in standalone mode |
| Dynamic updates | ✅ | Content reacts to state changes in real-time (Knob, Slider examples showing percentage updates) |
| Images | ✅ | Direct example showing image as tooltip content with proper sizing |
| Plain text | ✅ | Default and most common pattern |
| Multi-line content | ⚠️ | Not explicitly shown but supported via rich content mode |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Four cardinal directions | ✅ | `position: 'top'`, `'bottom'`, `'left'`, `'right'` (default: `'right'`) |
| Mouse tracking | ✅ | `position: 'mouse'` makes tooltip follow cursor. Also `mouseTrack: true` with offset controls |
| Mouse track offsets | ✅ | `mouseTrackTop` and `mouseTrackLeft` for pixel offset from cursor: `mouseTrackTop: 15` |
| Data attribute positioning | ✅ | `data-pr-position="right"` attribute for standalone usage |
| Advanced positioning | ✅ | `data-pr-at` and `data-pr-my` attributes for precise alignment: `data-pr-at="right+5 top"` |
| Auto-positioning | ❌ | No automatic position adjustment based on viewport boundaries documented |
| Z-index control | ❌ | Not documented |
| Boundary detection | ❌ | Not mentioned in documentation |

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Hover trigger | ✅ | Default behavior. `event: 'hover'` in tooltipOptions (or omitted) |
| Focus trigger | ✅ | `tooltipOptions={{ event: 'focus' }}` shows tooltip on element focus |
| Both hover and focus | ✅ | `tooltipOptions={{ event: 'both' }}` responds to both interactions |
| Manual show/hide | ❌ | No imperative API for programmatic control |
| Click trigger | ❌ | Not supported (would need Popover component instead) |
| Custom events | ❌ | Limited to hover, focus, both |
| Touch device support | ⚠️ | Not explicitly documented but likely handles touch as hover |

## Timing Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Show delay | ✅ | `showDelay` in milliseconds: `tooltipOptions={{ showDelay: 1000 }}` delays appearance |
| Hide delay | ✅ | `hideDelay` in milliseconds: `tooltipOptions={{ hideDelay: 300 }}` delays disappearance |
| Independent delays | ✅ | Show and hide delays can be configured separately: `{{ showDelay: 1000, hideDelay: 300 }}` |
| Auto-hide control | ✅ | `autoHide: false` keeps tooltip visible when mouse leaves (default: `true`) |
| Persistent tooltips | ✅ | `autoHide: false` allows interactive content or permanent display |
| Default timing | ✅ | `showDelay: 0`, `hideDelay: 0` (immediate) by default |

## Behavior Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Auto-hide on mouse leave | ✅ | Default behavior via `autoHide: true`. Can disable with `autoHide: false` |
| Escape key dismissal | ✅ | Pressing Escape closes tooltip when focus is on target element |
| Interactive content | ✅ | `autoHide: false` allows hovering over tooltip content itself |
| Disabled element support | ✅ | Two approaches: 1) `showOnDisabled: true` option, 2) Wrap disabled element in span with tooltip |
| Multiple instances | ✅ | Multiple Tooltip components can coexist on same page |
| Focus return | ⚠️ | Not documented (tooltip is non-modal, doesn't trap focus) |
| Backdrop/Overlay | ❌ | No backdrop (tooltip is lightweight, non-modal) |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Uncontrolled | ✅ | Component manages its own visibility state based on triggers |
| Controlled | ❌ | No `visible` prop or visibility control from external state |
| Reactive content | ✅ | Content updates automatically when props/state change: `tooltip={buttonTooltip}` |
| Imperative API | ❌ | No ref-based methods for programmatic show/hide |
| Event callbacks | ❌ | No onShow/onHide events documented |

## Accessibility Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| ARIA role | ✅ | Uses proper `tooltip` role for assistive technology |
| aria-describedby | ✅ | Automatically applied to target element with generated tooltip ID when visible |
| Keyboard navigation | ✅ | Escape key closes tooltip when target has focus |
| Focus trigger support | ✅ | `event: 'focus'` enables keyboard-only navigation |
| Disabled element handling | ✅ | `showOnDisabled: true` or wrapper pattern for disabled elements |
| Screen reader support | ✅ | ARIA attributes ensure screen reader compatibility |
| Unique ID generation | ✅ | Component generates unique IDs for aria-describedby linking |

## Integration Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Form component integration | ✅ | All PrimeReact form components support `tooltip` and `tooltipOptions` props natively |
| Standalone component mode | ✅ | `<Tooltip target=".selector" />` for non-PrimeReact elements |
| Icon tooltips | ✅ | Direct example with badge icon: `<i className="custom-target-icon" data-pr-tooltip="..." />` |
| Button tooltips | ✅ | `<Button tooltip="Save" />` for action buttons |
| Input field tooltips | ✅ | `<InputText tooltip="Enter username" />` for form fields |
| Complex component tooltips | ✅ | Examples with Knob, Slider, showing dynamic value tooltips |
| Multiple element targeting | ✅ | Single Tooltip component targets all elements matching CSS selector |

## Code Examples

### Basic Usage with Form Components
```jsx
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function BasicTooltips() {
  return (
    <>
      {/* Simple text tooltip */}
      <InputText
        type="text"
        placeholder="Username"
        tooltip="Enter your username"
      />

      {/* Button with tooltip */}
      <Button
        label="Save"
        icon="pi pi-check"
        tooltip="Save your changes"
      />
    </>
  );
}
```

### Positioning Variations
```jsx
import { InputText } from 'primereact/inputtext';

export default function PositionDemo() {
  return (
    <>
      {/* Default: right */}
      <InputText
        type="text"
        placeholder="Right"
        tooltip="Enter your username"
      />

      {/* Top position */}
      <InputText
        type="text"
        placeholder="Top"
        tooltip="Enter your username"
        tooltipOptions={{ position: 'top' }}
      />

      {/* Bottom position */}
      <InputText
        type="text"
        placeholder="Bottom"
        tooltip="Enter your username"
        tooltipOptions={{ position: 'bottom' }}
      />

      {/* Left position */}
      <InputText
        type="text"
        placeholder="Left"
        tooltip="Enter your username"
        tooltipOptions={{ position: 'left' }}
      />

      {/* Mouse tracking position */}
      <InputText
        type="text"
        placeholder="Mouse"
        tooltip="Enter your username"
        tooltipOptions={{ position: 'mouse' }}
      />
    </>
  );
}
```

### Event Trigger Variations
```jsx
import { InputText } from 'primereact/inputtext';

export default function EventDemo() {
  return (
    <>
      {/* Hover trigger (default) */}
      <InputText
        type="text"
        placeholder="Hover"
        tooltip="Enter your username"
      />

      {/* Focus trigger only */}
      <InputText
        type="text"
        placeholder="Focus"
        tooltip="Enter your username"
        tooltipOptions={{ event: 'focus' }}
      />

      {/* Both hover and focus */}
      <InputText
        type="text"
        placeholder="Both"
        tooltip="Enter your username"
        tooltipOptions={{ event: 'both' }}
      />
    </>
  );
}
```

### Auto-Hide Control
```jsx
import { InputText } from 'primereact/inputtext';

export default function AutoHideDemo() {
  return (
    <>
      {/* Persistent tooltip (no auto-hide) */}
      <InputText
        type="text"
        placeholder="Persistent"
        tooltip="This tooltip stays visible"
        tooltipOptions={{ autoHide: false }}
      />

      {/* Auto-hide on mouse leave (default) */}
      <InputText
        type="text"
        placeholder="Auto-hide"
        tooltip="This tooltip disappears on mouse leave"
      />
    </>
  );
}
```

### Show/Hide Delays
```jsx
import { Button } from 'primereact/button';

export default function DelayDemo() {
  return (
    <Button
      tooltip="Confirm to proceed"
      tooltipOptions={{
        showDelay: 1000,  // 1 second before showing
        hideDelay: 300    // 300ms before hiding
      }}
      label="Save"
    />
  );
}
```

### Standalone Tooltip with CSS Selector
```jsx
import { Tooltip } from 'primereact/tooltip';
import { Badge } from 'primereact/badge';

export default function StandaloneDemo() {
  return (
    <>
      {/* Tooltip component targets elements via CSS selector */}
      <Tooltip target=".custom-target-icon" />

      {/* Custom element with data attributes */}
      <i
        className="custom-target-icon pi pi-envelope p-text-secondary p-overlay-badge"
        data-pr-tooltip="No notifications"
        data-pr-position="right"
        data-pr-at="right+5 top"
        data-pr-my="left center-2"
        style={{ fontSize: '2rem', cursor: 'pointer' }}
      >
        <Badge severity="danger"></Badge>
      </i>
    </>
  );
}
```

### Mouse Tracking with Offsets
```jsx
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export default function MouseTrackDemo() {
  return (
    <>
      {/* Button with mouse tracking */}
      <Button
        type="button"
        label="Save"
        icon="pi pi-check"
        tooltip="Save"
        tooltipOptions={{
          position: 'bottom',
          mouseTrack: true,
          mouseTrackTop: 15
        }}
      />

      {/* Standalone with mouse tracking */}
      <Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
      <img
        className="logo"
        alt="logo"
        src="/images/logo.png"
        data-pr-tooltip="PrimeReact Logo"
        height="80px"
      />
    </>
  );
}
```

### Reactive Content (State-Driven)
```jsx
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Knob } from 'primereact/knob';
import { Slider } from 'primereact/slider';
import { Tooltip } from 'primereact/tooltip';

export default function ReactiveDemo() {
  const [buttonTooltip, setButtonTooltip] = useState('Save');
  const [knobValue, setKnobValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <>
      {/* Button with reactive tooltip text */}
      <Button
        type="button"
        label="Save"
        icon="pi pi-check"
        tooltip={buttonTooltip}
        onClick={() => setButtonTooltip('Completed')}
      />

      {/* Knob with dynamic percentage tooltip */}
      <Tooltip target=".knob" content={`${knobValue}%`} />
      <Knob
        className="knob"
        value={knobValue}
        onChange={(e) => setKnobValue(e.value)}
        showValue={false}
      />

      {/* Slider with dynamic tooltip on focus */}
      <Tooltip
        target=".slider>.p-slider-handle"
        content={`${sliderValue}%`}
        position="top"
        event="focus"
      />
      <Slider
        className="slider"
        value={sliderValue}
        onChange={(e) => setSliderValue(e.value)}
        style={{ width: '14rem' }}
      />
    </>
  );
}
```

### Disabled Element Tooltips
```jsx
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export default function DisabledDemo() {
  return (
    <>
      {/* Approach 1: Wrap disabled element */}
      <Tooltip target=".disabled-button" />
      <span className="disabled-button" data-pr-tooltip="Action disabled">
        <Button
          type="button"
          label="Save"
          icon="pi pi-check"
          disabled
        />
      </span>

      {/* Approach 2: Use showOnDisabled option */}
      <Button
        type="button"
        label="Save"
        icon="pi pi-check"
        disabled
        tooltip="Action disabled"
        tooltipOptions={{ showOnDisabled: true }}
      />
    </>
  );
}
```

### Custom Template Content (Images/HTML)
```jsx
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export default function TemplateDemo() {
  return (
    <>
      {/* Tooltip with image content */}
      <Tooltip target=".custom-tooltip-btn">
        <img
          alt="logo"
          src="/images/logo.png"
          data-pr-tooltip="PrimeReact Logo"
          height="80px"
        />
      </Tooltip>

      <Button
        className="custom-tooltip-btn"
        type="button"
        label="Save"
        icon="pi pi-check"
      />
    </>
  );
}
```

### Complex Selector Targeting
```jsx
import { Tooltip } from 'primereact/tooltip';
import { Slider } from 'primereact/slider';
import { useState } from 'react';

export default function ComplexSelectorDemo() {
  const [value, setValue] = useState(0);

  return (
    <>
      {/* Target nested element with complex selector */}
      <Tooltip
        target=".slider > .p-slider-handle"
        content={`${value}%`}
        position="top"
        event="focus"
      />

      <Slider
        className="slider"
        value={value}
        onChange={(e) => setValue(e.value)}
      />
    </>
  );
}
```

## Component Props Reference (Built-in Tooltips)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tooltip` | string | null | The text to display in the tooltip |
| `tooltipOptions` | object | null | Configuration object for tooltip behavior and appearance |

## tooltipOptions Object Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `position` | string | 'right' | Position of tooltip relative to target. Values: `'right'`, `'left'`, `'top'`, `'bottom'`, `'mouse'` |
| `event` | string | 'hover' | Event to trigger tooltip display. Values: `'hover'`, `'focus'`, `'both'` |
| `autoHide` | boolean | true | Whether to automatically hide tooltip when mouse leaves target |
| `showDelay` | number | 0 | Delay in milliseconds before showing tooltip |
| `hideDelay` | number | 0 | Delay in milliseconds before hiding tooltip |
| `mouseTrack` | boolean | false | When enabled, tooltip position updates to follow pointer coordinates |
| `mouseTrackTop` | number | undefined | Vertical offset in pixels for mouse tracking position |
| `mouseTrackLeft` | number | undefined | Horizontal offset in pixels for mouse tracking position |
| `showOnDisabled` | boolean | false | Whether to display tooltip on disabled form elements |

## Standalone Tooltip Component Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | string | null | CSS selector string to target elements for tooltip attachment |
| `content` | string | null | Reactive tooltip text content (alternative to data-pr-tooltip attribute) |
| `mouseTrack` | boolean | false | Enable position updates following pointer movement |
| `mouseTrackTop` | number | undefined | Vertical offset for mouse tracking |
| `mouseTrackLeft` | number | undefined | Horizontal offset for mouse tracking |
| `position` | string | 'right' | Default position for all targeted elements |
| `event` | string | 'hover' | Default trigger event for all targeted elements |
| `children` | ReactNode | null | Template content for rich HTML/component tooltips |

## Data Attributes for Standalone Usage

| Attribute | Type | Description |
|-----------|------|-------------|
| `data-pr-tooltip` | string | The tooltip text content |
| `data-pr-position` | string | Position override for specific element. Values: `'top'`, `'bottom'`, `'left'`, `'right'`, `'mouse'` |
| `data-pr-at` | string | Position anchor point for advanced positioning (e.g., `'right+5 top'`) |
| `data-pr-my` | string | Alignment reference point for advanced positioning (e.g., `'left center-2'`) |

## CSS Classes

**Structural Classes:**
- `p-tooltip` - Main tooltip container element
- `p-tooltip-text` - Text content wrapper inside tooltip
- `p-tooltip-arrow` - Positioning arrow element (if present)
- `p-tooltip-right` - Applied when position is 'right'
- `p-tooltip-left` - Applied when position is 'left'
- `p-tooltip-top` - Applied when position is 'top'
- `p-tooltip-bottom` - Applied when position is 'bottom'

## Accessibility Features

### ARIA Implementation
- **Role**: Uses proper `tooltip` role for semantic meaning
- **aria-describedby**: Automatically applied to target element with generated unique tooltip ID when tooltip is visible
- **Unique ID generation**: Component generates unique IDs for proper ARIA linking
- **Screen reader support**: ARIA attributes ensure tooltip content is announced by screen readers

### Keyboard Navigation
| Key | Function |
|-----|----------|
| **Tab** | Navigate to focusable elements (triggers focus event tooltips) |
| **Escape** | Closes tooltip when focus is on target element |
| **Shift + Tab** | Navigate backward (maintains focus event tooltips) |

### Focus Management
- **Focus trigger**: `event: 'focus'` enables keyboard-only tooltip display
- **Both events**: `event: 'both'` supports both mouse and keyboard users
- **Disabled elements**: Two solutions provided for showing tooltips on disabled elements
- **No focus trap**: Tooltip is non-modal, doesn't trap or manage focus

### Best Practices
- Use `event: 'focus'` or `event: 'both'` for keyboard accessibility
- Ensure interactive elements with tooltips are keyboard accessible
- Use `showOnDisabled: true` or wrapper pattern for disabled element tooltips
- Keep tooltip text concise for screen reader users
- Avoid putting critical information only in tooltips

## Notable Features

### 1. Dual Usage Modes
PrimeReact provides two distinct approaches for tooltip implementation:

**Built-in Integration:**
- Form components (InputText, Button, etc.) have native `tooltip` and `tooltipOptions` props
- Simplest usage: `<InputText tooltip="Username" />`
- No separate Tooltip component needed
- Automatic lifecycle management

**Standalone Component:**
- Separate `<Tooltip>` component for non-PrimeReact elements
- Uses CSS selectors to target elements: `<Tooltip target=".icon" />`
- Single component can target multiple elements
- Flexible content via children or `content` prop

This dual approach provides maximum flexibility while maintaining simplicity for common cases.

### 2. Reactive Content System
Tooltip content updates automatically based on React state:

```jsx
const [value, setValue] = useState(0);
<Tooltip target=".knob" content={`${value}%`} />
```

This is particularly powerful for:
- Dynamic value displays (sliders, knobs, progress)
- State-dependent messages
- Real-time updates without re-mounting

The examples show practical use with Knob, Slider, and Button components updating in real-time.

### 3. Mouse Tracking Positioning
The `position: 'mouse'` and `mouseTrack: true` options enable dynamic tooltip positioning:

```jsx
tooltipOptions={{
  position: 'bottom',
  mouseTrack: true,
  mouseTrackTop: 15
}}
```

Features:
- Tooltip follows cursor movement
- Independent X/Y offsets via `mouseTrackTop` and `mouseTrackLeft`
- Useful for large interactive areas or detailed visualizations
- Combines with standard positioning (bottom + mouse track)

This is uncommon in tooltip libraries and enables unique UX patterns.

### 4. Advanced Data Attribute Positioning
Standalone tooltips support fine-grained position control via data attributes:

```jsx
<i
  data-pr-at="right+5 top"
  data-pr-my="left center-2"
/>
```

- `data-pr-at`: Defines tooltip position relative to target (with pixel offsets)
- `data-pr-my`: Defines alignment reference point
- Enables precise positioning for complex layouts
- Alternative to standard position prop

### 5. Timing Control System
Independent control over show and hide delays:

```jsx
tooltipOptions={{
  showDelay: 1000,  // Wait 1 second before showing
  hideDelay: 300    // Wait 300ms before hiding
}}
```

Benefits:
- Prevents tooltip flicker during rapid mouse movement
- Reduces visual noise with show delay
- Smooth exit experience with hide delay
- Different timing for different interaction patterns

### 6. Interactive Content Support
The `autoHide: false` option enables interactive tooltips:

```jsx
tooltipOptions={{ autoHide: false }}
```

This allows:
- Hovering over tooltip content itself
- Clicking links inside tooltips
- Selecting text in tooltips
- Complex interactive UIs within tooltips

Combined with template content, this enables sophisticated overlay patterns.

### 7. Disabled Element Handling
Two solutions for the common disabled element problem:

**Wrapper Pattern:**
```jsx
<Tooltip target=".disabled-button" />
<span className="disabled-button" data-pr-tooltip="Disabled">
  <Button disabled />
</span>
```

**showOnDisabled Flag:**
```jsx
<Button
  disabled
  tooltip="Disabled"
  tooltipOptions={{ showOnDisabled: true }}
/>
```

The second approach is cleaner but only works with PrimeReact components. The wrapper pattern works universally.

### 8. Multi-Element Targeting
Single Tooltip component targets all matching elements:

```jsx
<Tooltip target=".info-icon" />
<i className="info-icon" data-pr-tooltip="Help 1" />
<i className="info-icon" data-pr-tooltip="Help 2" />
<i className="info-icon" data-pr-tooltip="Help 3" />
```

Benefits:
- Reduces component instances
- Centralized configuration
- Better performance with many tooltips
- Individual content via data attributes

### 9. Complex Selector Support
Target nested elements with specific CSS selectors:

```jsx
<Tooltip target=".slider > .p-slider-handle" />
```

This enables:
- Targeting deeply nested elements
- Avoiding wrapper elements
- Tooltips on third-party component internals
- Precise control in complex DOMs

### 10. Template Content System
Standalone Tooltip accepts rich JSX content:

```jsx
<Tooltip target=".btn">
  <img src="/logo.png" height="80px" />
  <div>Additional content</div>
</Tooltip>
```

Use cases:
- Image previews
- Rich formatted text
- Component composition
- Custom layouts

This blurs the line between tooltip and popover, providing flexibility.

## Research Notes

### Documentation Access
The documentation at https://primereact.org/tooltip/ is current and comprehensive:
- Modern UI with good UX
- Extensive code examples
- Complete API reference
- Practical use cases demonstrated
- Accessibility section well-documented

### Framework Approach Observations

**API Philosophy:**
PrimeReact's tooltip design emphasizes pragmatism and developer experience:

1. **Built-in Integration First**: Form components have native tooltip support, reducing boilerplate
2. **Standalone Flexibility**: Separate component for custom elements maintains consistency
3. **Uncontrolled State**: Component manages its own visibility, no state management needed
4. **Declarative Configuration**: tooltipOptions object encapsulates all customization
5. **React Patterns**: Standard hooks, props, and JSX patterns throughout

**Design Choices:**
- Uncontrolled visibility (no `visible` prop) - simplicity over control
- Event-based triggers - no imperative API needed
- Data attributes for standalone mode - HTML-friendly configuration
- CSS selector targeting - powerful but requires class/id management
- Template content via children - natural React composition

**Integration Pattern:**
The dual-mode design (built-in + standalone) is notable:
- Built-in mode: Zero overhead, just add `tooltip` prop
- Standalone mode: Maximum flexibility with CSS selectors
- Trade-off: Different APIs for same feature (some inconsistency)

### Comparison Points

**Strengths:**
- Extremely simple built-in usage for PrimeReact components
- Strong reactive content support with state updates
- Unique mouse tracking with offset control
- Excellent accessibility built-in (ARIA, keyboard, screen readers)
- Independent show/hide delay configuration
- Interactive content support via autoHide control
- Rich template content for complex tooltips
- Multiple element targeting with single component
- Complex CSS selector support
- Disabled element solutions provided
- Good documentation with extensive examples

**Limitations:**
- No imperative API for programmatic show/hide
- No controlled visibility (can't drive from external state)
- Limited trigger events (no click, no custom events)
- No callback events (onShow, onHide)
- No built-in arrow styling shown in examples
- Auto-positioning/boundary detection not documented
- No z-index configuration mentioned
- No animation customization shown
- Different APIs between built-in and standalone modes
- CSS selector targeting can be brittle in dynamic UIs

**Unique Features:**
- Built-in tooltip support in all form components (unusual for React libraries)
- Mouse tracking with independent X/Y offsets
- Reactive content prop for dynamic updates
- Advanced data attribute positioning (data-pr-at, data-pr-my)
- showOnDisabled option for disabled elements
- Multi-element targeting via CSS selectors
- Template content via JSX children in standalone mode
- Independent show/hide delay timing

### Implementation Insights

The component appears to:

1. **State Management**: Internally tracks visibility state per target element
2. **Event Binding**: Attaches event listeners based on `event` option (hover/focus/both)
3. **Positioning Calculation**: Uses target element bounds and position option to calculate placement
4. **Mouse Tracking**: When enabled, recalculates position on mouse move events
5. **ARIA Management**: Dynamically adds/removes aria-describedby with generated IDs
6. **Portal Rendering**: Likely renders tooltip to document body for proper layering
7. **Timing Control**: Uses setTimeout for show/hide delays
8. **Selector Matching**: Queries DOM for target selector and attaches to all matches
9. **Content Reactivity**: Re-renders when content prop changes

**Built-in vs Standalone:**
- Built-in: Component lifecycle manages tooltip creation/destruction
- Standalone: Tooltip instance persists, manages multiple targets via selectors
- Both share core positioning/rendering logic
- Different initialization patterns but same runtime behavior

**Mouse Tracking Implementation:**
The mouse tracking feature is sophisticated:
- Continuously updates position during mouse move
- Applies offset calculations (mouseTrackTop/Left)
- Respects position option even with tracking
- Likely throttles/debounces for performance

This requires careful event handling and performance optimization.

**Data Attribute System:**
The data attribute positioning uses a micro-language:
- `data-pr-at="right+5 top"`: Position at right edge + 5px, aligned to top
- `data-pr-my="left center-2"`: Tooltip's left edge, vertically centered - 2px
- Similar to jQuery UI positioning system
- Provides fine-grained control without JavaScript configuration

This is powerful but requires learning the syntax.

### Use Case Suitability

**Best for:**
- Form field help text and validation messages
- Button action descriptions
- Icon explanations
- Dynamic value displays (sliders, knobs, progress)
- Keyboard-accessible contextual help
- Interactive tooltips with clickable content
- Image or rich content previews
- Applications requiring strong accessibility
- PrimeReact-based applications (best integration)

**Less suitable for:**
- Precise positioning requirements (limited control)
- Programmatic show/hide control (no imperative API)
- Controlled visibility patterns (no external state control)
- Complex trigger logic (limited to hover/focus/both)
- Animations and transitions (not documented)
- Nested tooltips or complex layering
- Click-triggered tooltips (use Popover instead)

### Integration Considerations

**With React:**
- Standard React patterns throughout (hooks, props, JSX)
- Built-in tooltips use component props directly
- Standalone uses ref-less pattern (no imperative API)
- Content updates via React state work seamlessly
- Template content via children follows React composition model

**With TypeScript:**
Typing considerations:
- tooltipOptions interface with all properties
- Standalone Tooltip component props interface
- Data attribute types (string patterns for positioning)
- Event types for trigger configuration
- Content prop can be string or ReactNode

**With Forms:**
Excellent form integration:
- All PrimeReact form components support tooltips natively
- Validation messages can use reactive content
- Focus trigger pattern works well for form fields
- Disabled form elements supported via showOnDisabled

**With Accessibility:**
Strong accessibility story:
- Proper ARIA roles and attributes out of the box
- Keyboard navigation support (Tab, Escape)
- Focus event option for keyboard-only users
- Screen reader compatibility via aria-describedby
- Disabled element solutions maintain accessibility

**With Animation Libraries:**
Limited animation control:
- No built-in animation customization documented
- CSS transitions likely possible via class styling
- No JavaScript animation API
- Could enhance with custom CSS

**With Other PrimeReact Components:**
Excellent integration demonstrated:
- Button, InputText, Slider, Knob all shown with tooltips
- DataTable handles could have tooltips
- Icons with Badge overlays work well
- Template content can include other PrimeReact components

**With Dynamic Content:**
Strong dynamic content support:
- Reactive content prop updates in real-time
- State-driven tooltip text
- Works with frequently changing values
- No performance concerns noted in examples

### Performance Considerations

**Potential Performance Impacts:**
- Multi-element targeting: Single component managing many elements could be more efficient than many tooltip instances
- Mouse tracking: Continuous position updates during mouse move could impact performance at scale
- Reactive content: Frequent state updates cause tooltip re-renders
- Selector queries: Complex selectors could be slow in large DOMs

**Optimization Strategies:**
- Use built-in tooltips when possible (simpler lifecycle)
- Group similar tooltips with single standalone component
- Consider show/hide delays to reduce render frequency
- Use simple CSS selectors for better query performance
- Minimize reactive content updates

**Best Practices:**
- Prefer built-in tooltips for PrimeReact components
- Use standalone component for groups of custom elements
- Enable mouse tracking only when needed
- Keep tooltip content lightweight
- Use show delays to prevent unnecessary renders during rapid mouse movement
