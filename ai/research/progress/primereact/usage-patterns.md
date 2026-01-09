# PrimeReact - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
[https://primereact.org/progressbar/](https://primereact.org/progressbar/)
Status: ✅ Working
Version: 10.9.7 (as documented)
Last Verified: 2025-11-05

## Documentation Quality
Good - The documentation is clear and straightforward, providing essential usage patterns with code examples. However, it lacks comprehensive coverage of advanced variations and edge cases.

## Component Definition
- **Core purpose**: Display progress status as a visual indicator in React applications, showing completion percentage or indeterminate progress states
- **Mental model**: A progress bar is a visual feedback mechanism that communicates task progress to users; users think of it as a simple linear percentage indicator that updates reactively
- **Semantic meaning**: The component indicates that a process is in progress or has reached a certain completion level, providing reassurance during loading, uploading, or other time-consuming operations

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={50}`, `mode="indeterminate"`)
- **Composed**: Via composition/children (limited - primarily uses props)
- **CSS-only**: Requires custom styling (e.g., `style={{ height: '6px' }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via `displayValueTemplate` prop for custom content display |
| Icon support | ❌ | N/A | Not explicitly documented or supported |
| Custom content | ✅ | Native | `displayValueTemplate` prop allows custom template functions |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Default mode, displayed as horizontal progress bar |
| Circular | ❌ | N/A | Not supported by ProgressBar component |
| Dashboard/Arc | ❌ | N/A | Not supported by ProgressBar component |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | `mode="indeterminate"` for indefinite progress animation |
| Success state | ❌ | CSS-only | Not natively supported; would require custom styling |
| Error state | ❌ | CSS-only | Not natively supported; would require custom styling |
| Active/animating | ✅ | Native | Automatically animated in indeterminate mode; value changes animate smoothly |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Controlled via `style` prop (e.g., `style={{ height: '6px' }}`) |
| Color options | ❌ | CSS-only | Not natively supported; requires custom CSS overrides |
| Percentage display | ✅ | Native | Automatically displayed; customizable via `displayValueTemplate` |
| Segmented/steps | ❌ | N/A | Not supported by ProgressBar component |

## Code Examples

### Basic Usage
```jsx
import { ProgressBar } from 'primereact/progressbar';

// Simple progress bar with 50% completion
<ProgressBar value={50}></ProgressBar>
```

### Dynamic Progress Tracking
```jsx
import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';

export function DynamicProgress() {
  const [value, setValue] = useState(0);

  return (
    <ProgressBar value={value}></ProgressBar>
  );
}
```

### Indeterminate Mode
```jsx
<ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
```

### Custom Display Template
```jsx
<ProgressBar
  value={40}
  displayValueTemplate={(value) => `${value}% Complete`}
></ProgressBar>
```

### Custom Styling (Size Variation)
```jsx
// Small progress bar
<ProgressBar value={75} style={{ height: '4px' }}></ProgressBar>

// Large progress bar
<ProgressBar value={75} style={{ height: '20px' }}></ProgressBar>
```

## Accessibility
- **ARIA Support**: Implements `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` attributes
- **Labeling**: Supports `aria-labelledby` and `aria-label` props for screen reader descriptions
- **Keyboard Support**: Not applicable - this is a read-only status indicator component

## Notable Features
- **Reactive Value Updates**: The `value` prop is fully reactive; updating it dynamically re-renders the progress bar
- **Display Customization**: The `displayValueTemplate` prop provides powerful customization for displaying progress information
- **Mode Flexibility**: The `mode` prop allows switching between determinate progress (with a specific value) and indeterminate progress (animated, unknown completion)
- **Minimal API**: Simple, straightforward props make the component easy to use for basic use cases
- **Style Control**: Full control over size and appearance through inline styles

## Research Notes
- Documentation is accessible and well-written with clear examples
- The component is focused on linear progress indication only; no circular, circular-segmented, or dashboard-style variations are supported
- Color customization requires CSS overrides and is not part of the native prop API
- The component appears to be designed for React-specific usage with standard React prop patterns
- No mention of deprecated features or version-specific behaviors
- The component integrates well with React's state management and reactivity model

## Limitations Observed
- No built-in support for success, error, or warning states (would require external state management + CSS)
- No size preset options (only inline style customization)
- No color variant system (requires custom CSS)
- Linear-only design; no circular progress variants
- No step/segment visualization support
- Keyboard interaction not applicable or documented

## Implementation Patterns Worth Noting
1. **Value Reactivity**: Updates to the `value` prop automatically trigger re-renders and smooth animations
2. **Template Functions**: The `displayValueTemplate` uses a function pattern `(value) => string` for custom content
3. **Style Prop Integration**: Uses standard React inline styles for customization rather than CSS classes
4. **Mode-Based Variants**: The `mode` prop controls fundamental behavior (determinate vs. indeterminate), not just appearance
