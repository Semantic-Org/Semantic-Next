# MUI - Progress Bar Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-progress/
Status: ✅ Working
Version: Current (Material-UI v6 with modern CSS custom property theming)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured documentation with clear examples, detailed API reference, and accessibility considerations.

## Component Definition
- **Core purpose**: Communicates process completion status to users through visual indicators. Provides feedback during operations with unknown duration (indeterminate) or measurable progress (determinate).
- **Mental model**: Progress indicators represent the state of an ongoing operation. Circular progress is typically used for indefinite loading states, while linear progress shows measurable completion percentages or buffer states.
- **Semantic meaning**: Signals to users that a process is active and communicates how far along it is (when determinate). Reduces perceived wait time and provides visual confirmation that the system is working.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={50}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ❌ | CSS-only | No built-in text/label display; must be added as separate elements |
| Label support | ❌ | Composed | Labels can be added via composition by wrapping component or using Box/Stack layout |
| Value display | ❌ | Composed | Percentage/value text must be manually added through composition, often overlaid on circular or adjacent to linear |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | LinearProgress component with horizontal bar visualization |
| Circular | ✅ | Native | CircularProgress component with SVG-based circular rendering |
| Determinate | ✅ | Native | Both components support `variant="determinate"` with `value` prop (0-100) |
| Indeterminate | ✅ | Native | Both components support `variant="indeterminate"` for continuous animation |
| Buffer | ✅ | Native | LinearProgress supports `variant="buffer"` with `value` and `valueBuffer` props |
| Query | ✅ | Native | LinearProgress includes `variant="query"` for reverse animation pattern |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | Primary use case; indeterminate variant represents loading state |
| Success | ❌ | CSS-only | No built-in success state; achieved via `color="success"` prop and manual state management |
| Error | ❌ | CSS-only | No built-in error state; achieved via `color="error"` prop and manual state management |
| Disabled | ❌ | CSS-only | No explicit disabled prop; would need custom styling/opacity |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | CircularProgress has `size` prop for dimensions; LinearProgress height customizable via `sx` prop |
| Color options | ✅ | Native | Both support `color` prop: "primary", "secondary", "error", "success", "warning", "info", "inherit" |
| Thickness | ✅ | Native | CircularProgress has `thickness` prop (controls stroke width); LinearProgress height via styling |
| Min/Max values | ✅ | Native | Implicit 0-100 range for `value` prop; buffer variant has separate `valueBuffer` prop |

## Code Examples
```jsx
// LinearProgress - Indeterminate (loading state)
<LinearProgress />

// LinearProgress - Determinate (specific progress)
<LinearProgress variant="determinate" value={50} />

// LinearProgress - Buffer (with buffered content)
<LinearProgress
  variant="buffer"
  value={70}
  valueBuffer={85}
/>

// LinearProgress - Query (reverse animation)
<LinearProgress variant="query" />

// LinearProgress - With color
<LinearProgress color="success" value={100} />

// CircularProgress - Indeterminate
<CircularProgress />

// CircularProgress - Determinate
<CircularProgress variant="determinate" value={75} />

// CircularProgress - Static (non-animated)
<CircularProgress variant="static" value={50} />

// CircularProgress - Custom size and thickness
<CircularProgress
  color="secondary"
  size={60}
  thickness={5}
/>

// CircularProgress - With label (composed pattern)
<Box sx={{ position: 'relative', display: 'inline-flex' }}>
  <CircularProgress variant="determinate" value={75} />
  <Box
    sx={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography variant="caption" component="div" color="text.secondary">
      75%
    </Typography>
  </Box>
</Box>
```
[View Live](https://mui.com/material-ui/react-progress/)

## Notable Features
- **Dual component approach**: Separate CircularProgress and LinearProgress components rather than a unified Progress component with type variants
- **SVG-based circular rendering**: CircularProgress uses SVG for smooth, scalable graphics with animatable stroke properties
- **Buffer variant**: LinearProgress uniquely supports showing both actual progress and buffered content (useful for video/audio players)
- **Query variant**: LinearProgress includes a "query" variant with reverse animation pattern for loading states
- **CSS-based animations**: Performance-optimized with CSS keyframe animations using cubic-bezier easing
- **Theme integration**: Fully integrated with MUI's theme system including CSS custom properties and dark mode support via `data-mui-color-scheme` attribute
- **MUI System support**: Full `sx` prop support for advanced customization and responsive styling
- **Semantic color palette**: Both components support semantic colors (success, error, warning) for contextual feedback
- **Accessibility built-in**: ARIA roles and attributes automatically included for assistive technologies
- **Static variant**: CircularProgress includes a "static" variant for non-animated display (useful for snapshots or printing)

## Research Notes
- Documentation is comprehensive and well-organized with clear separation between CircularProgress and LinearProgress
- MUI takes a "two separate components" approach rather than a unified Progress component, which provides more specialized APIs but requires developers to choose between components
- No built-in label/value display - this is a composed pattern requiring additional elements and layout management
- State patterns (success/error) are handled through color props rather than dedicated state variants
- The buffer variant is a distinctive feature not commonly found in other libraries
- Strong emphasis on theme integration and accessibility compliance
- Documentation includes performance considerations noting CSS-based animations reduce JavaScript overhead
- Version detection: Modern implementation with CSS custom properties and data attributes for theming suggests Material-UI v5/v6
