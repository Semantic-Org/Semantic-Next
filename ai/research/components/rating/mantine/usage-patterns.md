# Mantine - Rating Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/rating/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides clear examples, multiple use cases, interactive demos, and detailed prop descriptions with practical implementations.

## Component Definition
- **Core purpose**: Enables users to select and display star-based ratings in a visual, interactive format
- **Mental model**: A horizontal row of symbols (typically stars) that users can click to indicate a rating value from 0 to a maximum number
- **Semantic meaning**: Represents a quantitative evaluation or preference level, commonly used for feedback, reviews, and user sentiment

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={4}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Star symbols | ✅ | Native | Default five-star display with filled/empty states |
| Custom icons | ✅ | Native | `emptySymbol` and `fullSymbol` props accept any React component |
| Text labels | ❌ | CSS-only | No built-in label support; would require wrapper component |
| Tooltips | ❌ | CSS-only | Not natively supported; would need Mantine Tooltip wrapper |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Read-only display | ✅ | Native | `readOnly={true}` prop disables interaction |
| Interactive/Editable | ✅ | Native | Default behavior with onChange callback |
| Half-star support | ✅ | Native | `fractions={2}` enables 0.5 increments |
| Quarter-star support | ✅ | Native | `fractions={4}` enables 0.25 increments |
| Third-star support | ✅ | Native | `fractions={3}` enables 0.33 increments |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default/Unselected | ✅ | Native | Shows empty symbols when value is 0 |
| Hover state | ✅ | Native | Built-in hover preview before selection |
| Selected state | ✅ | Native | Filled symbols up to current value |
| Disabled | ❌ | CSS-only | No dedicated disabled prop; would use readOnly |
| Focus state | ✅ | Native | Keyboard navigation with visible focus indicators |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | xs, sm, md, lg, xl size variants via `size` prop |
| Color options | ✅ | Native | Theme-aware color support using Mantine color system |
| Count/Max value | ✅ | Native | `count` prop sets number of rating items (default 5) |
| Character customization | ✅ | Native | Both static symbols and dynamic per-item symbols supported |
| Highlight mode | ✅ | Native | `highlightSelectedOnly` toggles cumulative vs. single-item highlight |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to rate | ✅ | Native | Primary interaction via onClick on symbol elements |
| Hover preview | ✅ | Native | Shows preview of rating value on hover |
| Clearable | ✅ | Native | Clicking selected value clears to 0 |
| onChange callback | ✅ | Native | `onChange={(value) => {}}` fires on value changes |
| Controlled state | ✅ | Native | `value` and `onChange` props for full control |
| Uncontrolled state | ✅ | Native | `defaultValue` prop for internal state management |

## Code Examples

### Basic Usage
```jsx
import { Rating } from '@mantine/core';

function Demo() {
  return <Rating defaultValue={2} />
}
```

### Controlled Component Pattern
```jsx
import { useState } from 'react';
import { Rating } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState(0);

  return <Rating value={value} onChange={setValue} />;
}
```

### Fractional Ratings (Half-Stars)
```jsx
import { Rating } from '@mantine/core';

function Demo() {
  return (
    <>
      <Rating fractions={2} defaultValue={1.5} />
      <Rating fractions={3} defaultValue={2.33333333} />
      <Rating fractions={4} defaultValue={3.75} />
    </>
  );
}
```

### Custom Icons
```jsx
import { Rating } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

function Demo() {
  return (
    <Rating
      emptySymbol={<IconSun size={16} />}
      fullSymbol={<IconMoon size={16} />}
      defaultValue={3}
    />
  );
}
```

### Size Variants
```jsx
import { Rating, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Rating size="xs" defaultValue={3} />
      <Rating size="sm" defaultValue={3} />
      <Rating size="md" defaultValue={3} />
      <Rating size="lg" defaultValue={3} />
      <Rating size="xl" defaultValue={3} />
    </Stack>
  );
}
```

### Read-Only Display
```jsx
import { Rating } from '@mantine/core';

function Demo() {
  return <Rating readOnly defaultValue={3.5} fractions={2} />;
}
```

### Emoji Rating System (Per-Item Symbols)
```jsx
import { Rating } from '@mantine/core';

function Demo() {
  const getSymbol = (value) => {
    const symbols = {
      1: '😢',
      2: '😕',
      3: '😊',
      4: '😃',
      5: '🤩'
    };
    return symbols[value];
  };

  return (
    <Rating
      count={5}
      defaultValue={3}
      emptySymbol={(value) => getSymbol(value)}
      fullSymbol={(value) => getSymbol(value)}
    />
  );
}
```

### Configurable Count
```jsx
import { Rating } from '@mantine/core';

function Demo() {
  return (
    <>
      <Rating count={5} defaultValue={3} />
      <Rating count={7} defaultValue={4} />
      <Rating count={10} defaultValue={6} />
    </>
  );
}
```

### Color Customization
```jsx
import { Rating } from '@mantine/core';

function Demo() {
  return (
    <>
      <Rating color="red" defaultValue={3} />
      <Rating color="blue" defaultValue={3} />
      <Rating color="green" defaultValue={3} />
    </>
  );
}
```

[View Live Examples](https://mantine.dev/core/rating/)

## Notable Features

- **Fractional precision**: Supports 2, 3, or 4 fractions per rating item, enabling half-star, third-star, and quarter-star granularity
- **Symbol flexibility**: Accepts both static React components and functions that dynamically generate symbols based on item value
- **Per-item customization**: Function-based symbols allow unique icons for each rating level (e.g., emoji progression from sad to happy)
- **Theme integration**: Deep integration with Mantine's theming system via CSS custom properties for consistent color application
- **Highlight modes**: Toggle between cumulative highlighting (stars 1-3 lit) or single-item highlighting (only star 3 lit) via `highlightSelectedOnly` prop
- **Clearable by default**: Clicking the current rating value resets to 0, providing intuitive clearing behavior
- **Accessibility foundations**: Component integrates with Mantine's accessibility system, though specific ARIA implementation details not explicitly documented

## Research Notes

- The documentation is well-structured with interactive demos and collapsible code examples
- Version 8.3.6 was current at time of research (November 5, 2025)
- The component is listed under "Inputs" category, positioned between RangeSlider and SegmentedControl
- Practical use cases demonstrated include product reviews, feedback forms, and mood tracking
- The emoji rating example showcases the component's flexibility beyond traditional star ratings
- No explicit disabled state prop exists; read-only mode serves this purpose in the current API
- Documentation focuses on React/TypeScript usage patterns with modern hooks-based examples
