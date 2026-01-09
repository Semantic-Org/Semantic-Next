# PrimeReact - Rating Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/rating/
Status: ✅ Working
Version: 10.9.7 (with v11 and v9 versions available)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear examples covering all major features with comprehensive prop documentation and accessibility details.

## Component Definition
- **Core purpose**: Enables users to provide star-based feedback or selection through an interactive rating interface
- **Mental model**: A horizontal row of clickable stars/icons where users select a rating by clicking on a star, with all stars up to and including the clicked star being filled
- **Semantic meaning**: Represents a rating or quality score, typically on a scale from 0 to 5 (or custom max), communicating user satisfaction or item quality

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={4}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Star symbols | ✅ | Native | Default icon representation using PrimeIcons |
| Custom icons | ✅ | Native | `onIcon`, `offIcon`, and `cancelIcon` props accept JSX elements including images |
| Text labels | ❌ | N/A | No built-in text label support |
| Tooltips | ❌ | N/A | No built-in tooltip support |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Read-only display | ✅ | Native | `readOnly` prop disables interaction, commonly used with `cancel={false}` |
| Interactive/Editable | ✅ | Native | Default mode with click-to-rate functionality |
| Half-star support | ❌ | N/A | No fractional rating support documented |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default/Unselected | ✅ | Native | `offIcon` represents unselected state, controlled by `value` prop |
| Hover state | ✅ | Native | Built-in hover preview showing what rating would be selected |
| Selected state | ✅ | Native | `onIcon` represents selected state for stars up to current value |
| Disabled | ✅ | Native | `disabled` prop prevents interaction with visual feedback |
| Focus state | ✅ | Native | Keyboard navigation with visual focus indicators on rated/first star |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No native size prop, would require custom icon sizing |
| Color options | ❌ | CSS-only | No native color prop, theme-based or custom CSS required |
| Count/Max value | ✅ | Native | `stars` prop sets number of stars (default appears to be 5) |
| Character customization | ✅ | Native | `onIcon`, `offIcon`, and `cancelIcon` fully customizable with any JSX |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to rate | ✅ | Native | Primary interaction - click star to set rating |
| Hover preview | ✅ | Native | Hovering over stars shows preview of rating selection |
| Clearable | ✅ | Native | `cancel` prop (defaults to true) shows cancel icon for reset to 0 |
| onChange callback | ✅ | Native | `onChange` event handler receives `e.value` with selected rating |

## Code Examples
```jsx
// Basic Usage
import { Rating } from 'primereact/rating';

export default function BasicRating() {
  const [value, setValue] = useState(null);

  return (
    <Rating value={value} onChange={(e) => setValue(e.value)} />
  );
}
```

```jsx
// Custom Star Count (10 stars instead of 5)
export default function CustomStarCount() {
  const [value, setValue] = useState(null);

  return (
    <Rating value={value} onChange={(e) => setValue(e.value)} stars={10} />
  );
}
```

```jsx
// Custom Icons (using images)
export default function CustomIcons() {
  const [value, setValue] = useState(null);

  return (
    <Rating
      value={value}
      onChange={(e) => setValue(e.value)}
      cancelIcon={<img src="/images/rating/cancel.png" width="25px" />}
      onIcon={<img src="/images/rating/custom-icon-active.png" width="25px" />}
      offIcon={<img src="/images/rating/custom-icon.png" width="25px" />}
    />
  );
}
```

```jsx
// Read-Only Display (no interaction, no cancel icon)
export default function ReadOnlyRating() {
  return (
    <Rating value={5} readOnly cancel={false} />
  );
}
```

```jsx
// Disabled State (no interaction, with visual disabled appearance)
export default function DisabledRating() {
  return (
    <Rating value={5} disabled cancel={false} />
  );
}
```

[View Live](https://primereact.org/rating/)

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | null | Current rating value (controlled component) |
| `onChange` | function | null | Callback triggered on rating change, receives event with `e.value` |
| `cancel` | boolean | true | Shows/hides cancel icon for resetting to 0 |
| `stars` | number | 5 (assumed) | Number of stars to display |
| `onIcon` | JSX element | null | Custom icon for selected/active stars |
| `offIcon` | JSX element | null | Custom icon for unselected/inactive stars |
| `cancelIcon` | JSX element | null | Custom icon for cancel/reset button |
| `readOnly` | boolean | false | Prevents value modification, displays rating only |
| `disabled` | boolean | false | Disables interaction with visual disabled state |

## Accessibility Features

### Keyboard Support
| Key | Function |
|-----|----------|
| **Tab** | Focuses the rated star (or first star if unrated) |
| **Arrow Keys** | Navigate between stars (left, up, right, down) |
| **Space** | Confirms selection on focused star |

### ARIA Support
- Comprehensive keyboard navigation built-in
- Focus management for screen reader compatibility
- Space bar selection support

## Notable Features

### 1. **Cancel Icon by Default**
Unlike some frameworks, PrimeReact includes a cancel/reset icon by default (controllable via `cancel` prop), making it easy to clear ratings without extra implementation.

### 2. **Full Icon Customization**
Complete control over all icon states (active, inactive, cancel) through props accepting any JSX, including images, allowing for brand-specific rating symbols beyond stars.

### 3. **Controlled Component Pattern**
Follows React's controlled component pattern with `value` and `onChange`, ensuring predictable state management and easy integration with forms and state management libraries.

### 4. **Hover Preview**
Built-in hover state shows users what rating they would select before clicking, improving user experience without additional implementation.

### 5. **Read-Only vs Disabled**
Distinct `readOnly` and `disabled` states provide semantic differences: read-only for displaying ratings, disabled for temporarily unavailable interactions.

### 6. **Flexible Star Count**
The `stars` prop allows any number of rating levels, not just the traditional 5-star scale, enabling custom rating scales (e.g., 10-point scales).

## Research Notes

### Documentation Strengths
- Clear code examples for all major use cases
- Comprehensive prop documentation
- Explicit keyboard navigation documentation
- Version selector available (v9, v10, v11)

### Framework Approach
PrimeReact's Rating component follows a straightforward, prop-driven design that prioritizes:
1. **Controlled state management** - Explicit value and onChange props
2. **Accessibility first** - Full keyboard navigation built-in
3. **Customization through props** - Native support for icon customization without CSS hacks
4. **Theme integration** - Works with PrimeReact's theming system

### Notable Design Decisions
- **Cancel icon defaults to visible** - Opinionated approach that may need to be disabled for read-only displays
- **No half-star support** - Integer values only, no fractional ratings documented
- **No size/color props** - Styling requires CSS or custom icon sizing
- **JSX-based icon customization** - More flexible than string-based icon names but requires more code

### Comparison Points for Other Frameworks
- More opinionated than headless UI libraries (has default appearance)
- Less props than some frameworks (no size/color built-in)
- Strong keyboard support compared to minimal implementations
- Cancel icon pattern is unique compared to frameworks where reset requires custom implementation
