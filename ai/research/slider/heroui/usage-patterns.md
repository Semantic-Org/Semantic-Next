# HeroUI/NextUI - Slider Usage Patterns

## Component URL
https://www.heroui.com/docs/components/slider
Status: ✅ Working
Version: Current (Updated badge visible)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - includes detailed prop tables, multiple code examples, custom rendering patterns, accessibility information, and advanced features like value formatting and custom marks.

## Component Definition
- **Core purpose**: Enables users to select one or more values within a defined range through an interactive dragging interface
- **Mental model**: A visual track with draggable handle(s) representing numeric value(s) along a continuous or stepped range
- **Semantic meaning**: Communicates adjustable numeric input with immediate visual feedback, suitable for settings, filters, and value selection

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `value` and `defaultValue` props for controlled/uncontrolled modes |
| Range (min-max) | ✅ | Native | Pass array to `value`/`defaultValue` (e.g., `[100, 500]`) for dual-thumb range |
| Labels/marks | ✅ | Native | `label` prop for component label; `marks` prop accepts array of `{value, label}` objects for track marks |
| Tooltips on handle | ✅ | Native | `showTooltip` prop; `tooltipValueFormatOptions` for custom formatting |
| Custom handle content | ✅ | Native | `renderThumb` render prop for complete thumb customization |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default mode with single number value |
| Range (dual handles) | ✅ | Native | Automatic when passing array value (e.g., `defaultValue={[100, 500]}`) |
| Vertical orientation | ✅ | Native | `orientation="vertical"` prop (348px container height recommended) |
| Reverse direction | ⚠️ | CSS-only | Not explicitly documented; likely via CSS transforms or RTL support |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `isDisabled` prop - prevents all interaction |
| Read-only | ❌ | - | No dedicated read-only prop documented |
| Error state | ❌ | - | No validation/error state props; would need custom styling |
| Loading | ❌ | - | No loading state; would need custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop (default: 1); `showSteps` to visualize steps on track |
| Track marks | ✅ | Native | `marks` prop with `{value: number, label: string}[]` for labeled positions |
| Color customization | ✅ | Native | `color` prop: foreground, primary, secondary, success, warning, danger |
| Size variants | ✅ | Native | `size` prop: sm, md, lg (default: md) |
| Track styling | ✅ | Native + Composed | `radius` prop (none/sm/md/lg/full); slots system for granular styling |

## Code Examples

### Basic Single Value
```jsx
<Slider
  className="max-w-md"
  defaultValue={0.4}
  label="Temperature"
  maxValue={1}
  step={0.01}
/>
```

### Range Selection with Currency Formatting
```jsx
<Slider
  defaultValue={[100, 500]}
  formatOptions={{style: "currency", currency: "USD"}}
  label="Price Range"
  maxValue={1000}
  step={50}
/>
```

### With Tooltip
```jsx
<Slider
  showTooltip={true}
  formatOptions={{style: "percent"}}
/>
```

### Vertical Orientation
```jsx
<Slider
  orientation="vertical"
  defaultValue={0.5}
  maxValue={1}
/>
```

### Custom Thumb Rendering
```jsx
<Slider
  renderThumb={(props) => (
    <div {...props} className="custom-thumb-styling">
      <span />
    </div>
  )}
/>
```

### With Step Marks
```jsx
<Slider
  label="Select a value"
  step={10}
  maxValue={100}
  minValue={0}
  marks={[
    { value: 0, label: "0%" },
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "100%" }
  ]}
  defaultValue={50}
/>
```

## Complete API Surface

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | ReactNode | - | Component label |
| `value` | number \| number[] | - | Controlled value(s) |
| `defaultValue` | number \| number[] | - | Uncontrolled initial value(s) |
| `minValue` | number | 0 | Minimum allowed value |
| `maxValue` | number | 100 | Maximum allowed value |
| `step` | number | 1 | Value increment step |
| `size` | sm \| md \| lg | md | Visual size variant |
| `color` | foreground \| primary \| secondary \| success \| warning \| danger | primary | Track/thumb color |
| `radius` | none \| sm \| md \| lg \| full | full | Border radius |
| `orientation` | horizontal \| vertical | horizontal | Layout direction |
| `showSteps` | boolean | false | Visualize step intervals on track |
| `showTooltip` | boolean | false | Show value tooltip on thumb |
| `showOutline` | boolean | false | Show outline styling |
| `hideValue` | boolean | false | Hide value display |
| `hideThumb` | boolean | false | Hide thumb element |
| `isDisabled` | boolean | false | Disable interaction |
| `fillOffset` | number | - | Offset for track fill start position |
| `marks` | Array<{value: number, label: string}> | - | Labeled marks on track |
| `formatOptions` | Intl.NumberFormatOptions | - | Value display formatting |
| `tooltipValueFormatOptions` | Intl.NumberFormatOptions | - | Tooltip-specific formatting |

### Event Handlers
- `onChange(value: number | number[])` — Fires continuously during interaction
- `onChangeEnd(value: number | number[])` — Fires only when dragging stops

### Render Props
- `renderThumb` — Customize thumb appearance
- `renderLabel` — Customize label section
- `renderValue` — Customize value display
- `getTooltipValue` — Customize tooltip content

### Slots for Styling
`base`, `labelWrapper`, `label`, `value`, `trackWrapper`, `track`, `filler`, `thumb`, `step`, `mark`, `startContent`, `endContent`

## Notable Features

1. **Automatic Range Mode**: Simply pass an array to switch from single to range slider—no separate component needed
2. **Rich Value Formatting**: Built-in Intl.NumberFormat support for currency, percentages, units, etc.
3. **Separate Tooltip Formatting**: Different format for tooltip vs displayed value via `tooltipValueFormatOptions`
4. **Render Props Pattern**: Multiple render props (`renderThumb`, `renderLabel`, `renderValue`) for granular customization
5. **Slots-Based Styling**: Named slots for every visual element enable precise CSS targeting
6. **Marks System**: Labeled positions on track for visual guidance (distinct from `showSteps` which shows all step intervals)
7. **Fill Offset**: `fillOffset` prop enables custom track fill starting positions (useful for diverging scales)
8. **Accessibility First**: Full keyboard navigation (arrows, Page Up/Down, Home, End), multi-touch, RTL, ARIA labels
9. **Event Granularity**: Separate `onChange` (continuous) and `onChangeEnd` (on release) events for performance optimization

## Research Notes

### Access & Quality
- Documentation loaded successfully without issues
- Recent updates indicated by "Updated" badge
- Well-structured with clear prop tables, multiple examples, and accessibility documentation

### Framework Approach Observations
1. **Unified Component**: Single `Slider` component handles both single-value and range modes via value type detection
2. **Formatting-First**: Deep integration with Intl.NumberFormat shows focus on internationalization
3. **Render Props Over Composition**: Prefers render props for customization rather than compound components
4. **Visual Customization**: Extensive theming via size/color/radius props plus slots system
5. **No Validation States**: Missing error/success visual states—assumes external validation handling
6. **Performance Consideration**: Separate onChange/onChangeEnd events suggests awareness of performance in controlled scenarios

### Missing Patterns
- No read-only state (disabled is available but prevents all interaction)
- No error/validation visual states
- No loading state
- Track mark labels appear limited to simple strings (no ReactNode support documented)
