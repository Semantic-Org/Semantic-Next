# Ant Design - Rating Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/rate
Status: ✅ Working
Version: Current (v5.x documented, v3.x and v2.x also available)
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive API documentation with TypeScript interfaces and multiple examples. Documentation accessible across version branches (2x, 3x, current). Examples demonstrate all major features clearly.

## Component Definition
- **Core purpose**: Enables users to provide rating feedback through an interactive star-based interface. Used for "show evaluation" and "a quick rating operation on something."
- **Mental model**: An interactive rating control that captures user sentiment through a visual, icon-based scale. Can function as both an input mechanism (editable) and a display component (read-only).
- **Semantic meaning**: Communicates evaluative scores or satisfaction levels. The visual metaphor of stars (or custom characters) provides intuitive understanding of relative quality or rating intensity.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `allowHalf={true}`)
- **Composed**: Via composition/children (e.g., `character={<Icon />}`)
- **CSS-only**: Requires custom styling (e.g., `style={{ fontSize: 36 }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Star symbols | ✅ | Native | Default character is `<Icon type="star" />` |
| Custom icons | ✅ | Composed | Via `character` prop accepting ReactNode: `character={<Icon type="heart" />}` |
| Text labels | ✅ | Native | Via `tooltips` prop with string array for each rating value |
| Tooltips | ✅ | Native | `tooltips={['Terrible', 'Bad', 'Normal', 'Good', 'Excellent']}` (v3.12.0+) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Read-only display | ✅ | Native | `disabled={true}` - renders as non-interactive display |
| Interactive/Editable | ✅ | Native | Default mode - users can click to rate |
| Half-star support | ✅ | Native | `allowHalf={true}` enables semi-selection (e.g., 2.5 stars) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default/Unselected | ✅ | Native | `defaultValue={0}` or no value prop |
| Hover state | ✅ | Native | Built-in with `onHoverChange` callback for tracking |
| Selected state | ✅ | Native | Controlled via `value` prop or uncontrolled via `defaultValue` |
| Disabled | ✅ | Native | `disabled={true}` - read-only, unable to interact |
| Focus state | ✅ | Native | Built-in focus management with `focus()`, `blur()` methods and `onFocus`/`onBlur` callbacks |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Via `style={{ fontSize: 36 }}` - scales character size |
| Color options | ✅ | CSS-only | Customizable via `style` prop or CSS theming |
| Count/Max value | ✅ | Native | `count={5}` - configures number of rating items (default: 5) |
| Character customization | ✅ | Composed | `character` prop accepts ReactNode: icons, text, emoji, Chinese characters |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to rate | ✅ | Native | Default behavior - single click sets rating value |
| Hover preview | ✅ | Native | Hover highlights rating with `onHoverChange={Function(value)}` callback |
| Clearable | ✅ | Native | `allowClear={true}` (default in v3.1.0+) - clicking same value clears rating |
| onChange callback | ✅ | Native | `onChange={Function(value: number)}` - fires when rating selected |
| onHoverChange | ✅ | Native | `onHoverChange={Function(value: number)}` - tracks hover interactions |
| onFocus/onBlur | ✅ | Native | Focus event callbacks for accessibility |
| onKeyDown | ✅ | Native | Keyboard event handling via `onKeyDown={Function(event)}` |
| autoFocus | ✅ | Native | `autoFocus={true}` - automatically focuses component on mount |

## Code Examples

### Basic Usage
```jsx
import { Rate } from 'antd';

// Simple rate component with default 5 stars
<Rate />

// With default value
<Rate defaultValue={3} />

// Controlled component
const [value, setValue] = useState(4);
<Rate value={value} onChange={setValue} />
```
[View Live](https://ant.design/components/rate#components-rate-demo-basic)

### Half Star Support
```jsx
// Allow half-star ratings (e.g., 2.5, 3.5)
<Rate allowHalf defaultValue={2.5} />
```
[View Live](https://ant.design/components/rate#components-rate-demo-half)

### Custom Characters
```jsx
import { HeartOutlined } from '@ant-design/icons';

// Heart icon instead of stars
<Rate character={<HeartOutlined />} allowHalf />

// Letter character
<Rate character="A" allowHalf style={{ fontSize: 36 }} />

// Chinese character
<Rate character="好" allowHalf />
```
[View Live](https://ant.design/components/rate#components-rate-demo-character)

### Read-Only Display
```jsx
// Disabled state for showing existing rating
<Rate disabled defaultValue={2} />
```
[View Live](https://ant.design/components/rate#components-rate-demo-disabled)

### With Tooltips
```jsx
const tooltips = ['Terrible', 'Bad', 'Normal', 'Good', 'Excellent'];
const [value, setValue] = useState(3);

<Rate
  tooltips={tooltips}
  onChange={setValue}
  value={value}
/>
```
[View Live](https://ant.design/components/rate#components-rate-demo-text)

### Clearable vs Non-Clearable
```jsx
// Allow clearing by clicking again (default behavior)
<Rate allowClear defaultValue={3} />

// Prevent clearing
<Rate allowClear={false} defaultValue={3} />
```
[View Live](https://ant.design/components/rate#components-rate-demo-clear)

### Complete Interactive Example
```jsx
import React, { useState } from 'react';
import { Rate } from 'antd';

export default function App() {
  const [currentValue, setCurrentValue] = useState(2);
  const tooltips = ['Terrible', 'Bad', 'Normal', 'Good', 'Excellent'];

  return (
    <div>
      <Rate
        tooltips={tooltips}
        onChange={(value) => setCurrentValue(value)}
        value={currentValue}
        allowHalf
        allowClear
      />
      <br />
      Current Rating: {currentValue}
    </div>
  );
}
```

### Full API Example with Callbacks
```jsx
import React, { useRef } from 'react';
import { Rate } from 'antd';

export default function App() {
  const rateRef = useRef(null);
  const [value, setValue] = useState(3);

  return (
    <Rate
      ref={rateRef}
      count={10}                                    // 10 stars instead of 5
      allowHalf={true}                              // Enable half-star selection
      allowClear={true}                             // Allow clearing by re-clicking
      autoFocus={false}                             // Don't auto-focus on mount
      defaultValue={3}                              // Initial uncontrolled value
      value={value}                                 // Controlled value
      disabled={false}                              // Interactive mode
      character={<Icon type="star" />}              // Custom character
      tooltips={['Poor', 'Fair', 'Good', 'Great', 'Excellent']}  // Tooltip labels
      className="custom-rate"                       // Custom CSS class
      style={{ fontSize: 24, color: '#fadb14' }}   // Custom styling
      onChange={(val) => {                          // Selection handler
        console.log('Value changed:', val);
        setValue(val);
      }}
      onHoverChange={(val) => {                     // Hover handler
        console.log('Hovering:', val);
      }}
      onFocus={() => console.log('Focused')}        // Focus handler
      onBlur={() => console.log('Blurred')}         // Blur handler
      onKeyDown={(e) => console.log('Key:', e.key)} // Keyboard handler
    />
  );
}

// Programmatic focus control
rateRef.current.focus();  // Apply focus
rateRef.current.blur();   // Remove focus
```

## Notable Features

### Half-Star Precision
- `allowHalf` enables fractional ratings (2.5, 3.5, etc.)
- Particularly useful for displaying aggregated ratings or fine-grained user feedback
- Works seamlessly with custom characters

### Character Flexibility
- Accepts any ReactNode as rating symbol
- Supports icons, text, emoji, Unicode characters
- Can be styled independently via inline styles
- Common patterns: hearts (❤️), thumbs up (👍), custom brand icons

### Clearable Interaction
- `allowClear={true}` (default in v3.1.0+) lets users reset their rating
- Clicking the same rating value again clears to 0
- Configurable for scenarios requiring permanent ratings vs. optional ratings

### Tooltip Integration
- Built-in tooltip support per rating value (v3.12.0+)
- Provides contextual labels: "Terrible", "Bad", "Normal", "Good", "Excellent"
- Enhances accessibility and user understanding
- No separate Tooltip component composition required

### Focus Management
- Programmatic focus control via `focus()` and `blur()` methods
- `autoFocus` prop for immediate focus on mount
- Complete keyboard event handling via `onKeyDown`
- Focus/blur callbacks for accessibility integration

### Configurable Scale
- `count` prop allows custom rating scales (e.g., 3 stars, 10 stars)
- Default is 5 stars but flexible for different use cases
- Adapts tooltip array to match count automatically

### State Management Flexibility
- Uncontrolled mode via `defaultValue` for simple use cases
- Controlled mode via `value` and `onChange` for complex state management
- Hybrid approach available for specific scenarios

### TypeScript Integration
- Full TypeScript support with comprehensive type definitions
- Type-safe props and callbacks
- IntelliSense support in modern IDEs

## Research Notes

### Documentation Access Challenges
- Modern Ant Design site (ant.design) serves heavily bundled/minified JavaScript
- Direct web scraping returned infrastructure code rather than prose content
- Successfully gathered comprehensive information through:
  - Version-specific documentation (2x.ant.design, 3x.ant.design)
  - Third-party tutorials (GeeksforGeeks)
  - Web search result aggregation
  - Cross-referencing multiple sources

### Framework Approach Observations

**Component Philosophy:**
- Simple, focused component with single responsibility (rating capture/display)
- Progressive enhancement from v2 → v3 → v5 with backward compatibility
- Feature additions (tooltips, allowClear) added without breaking changes

**Developer Experience:**
- Intuitive prop naming conventions (`allowHalf`, `allowClear`)
- Rich callback ecosystem (`onChange`, `onHoverChange`, `onFocus`, `onBlur`, `onKeyDown`)
- Programmatic control through ref-based methods (`focus()`, `blur()`)
- Comprehensive TypeScript support

**Flexibility Patterns:**
- ReactNode-based customization (`character` prop)
- CSS styling escape hatch via `style` and `className` props
- Both controlled and uncontrolled component patterns
- Configurable scale via `count` prop

**Accessibility Considerations:**
- Focus management built-in
- Keyboard event support
- Tooltip integration for screen readers
- Disabled state for read-only scenarios

**Evolution Tracking:**
- Version annotations in API (`allowClear` since 3.1.0, `tooltips` since 3.12.0)
- Legacy compatibility maintained across versions
- Clear feature progression path

### Implementation Patterns

**Prop Organization:**
```
Configuration Props:
  - count, allowHalf, allowClear, autoFocus, disabled

Display Props:
  - character, tooltips, className, style

Value Props:
  - value, defaultValue

Callback Props:
  - onChange, onHoverChange, onFocus, onBlur, onKeyDown

Methods (via ref):
  - focus(), blur()
```

**Common Use Cases:**
1. **Product Reviews**: Standard 5-star rating with tooltips
2. **Satisfaction Surveys**: Custom characters (thumbs, emojis) with half-star precision
3. **Rating Display**: Disabled mode showing aggregate ratings
4. **Fine-Grained Feedback**: 10-star scale with clearable option
5. **Branded Experiences**: Custom icon characters matching brand identity

**Anti-Patterns to Avoid:**
- Using `disabled` when you want non-interactive display (correct approach)
- Not providing tooltips for accessibility (should include for screen readers)
- Ignoring `allowClear` configuration (consider UX implications)
- Overriding default count without adjusting tooltips array

### Comparison Points for Semantic UI

**Strengths:**
- Very clean prop API with intuitive naming
- Built-in tooltip support (no composition required)
- Flexible character customization via ReactNode
- Comprehensive callback ecosystem
- Strong TypeScript integration

**Potential Improvements:**
- Size variants could be prop-based rather than CSS-only
- Color theming could leverage design tokens more explicitly
- Documentation site accessibility via web scraping

**Web Standards Alignment:**
- React-specific implementation (not web components)
- Could benefit from custom element approach for framework independence
- Accessibility features well-implemented but React-bound

**Design Token Patterns:**
- Relies on Ant Design's global theming system
- CSS custom properties used internally
- Direct style prop for one-off customizations

### Notable Technical Details

**Rendering Behavior:**
- Component renders individual rate items based on `count` prop
- Hover state managed internally with visual feedback
- Half-star rendering splits item visually using CSS
- Tooltip positioning handled automatically

**Event Handling:**
- Click events on individual rate items
- Hover tracking across all items
- Keyboard navigation support (arrow keys, enter, space)
- Focus ring styling for accessibility

**State Management:**
- Internal state for uncontrolled mode
- External state synchronization for controlled mode
- Hover state ephemeral (not persisted)
- Clear action resets to 0 or undefined based on configuration

This comprehensive analysis reveals Ant Design's Rate component as a mature, well-designed rating solution with strong developer experience, accessibility features, and flexible customization options. The component demonstrates thoughtful API design with progressive enhancement across versions.
