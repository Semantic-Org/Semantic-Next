# ShadCN - Slider Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/slider
Status: ✅ Working
Version: Built on Radix UI 1.3.6 (8.76 kB gzipped)
Last Verified: 2025-11-10

## Documentation Quality
Basic - The ShadCN page provides minimal documentation with a single demo example. Complete API reference defers to Radix UI documentation. No advanced examples, variants, or customization patterns are shown on the ShadCN page itself.

## Component Definition
- **Core purpose**: Provides an interactive input for selecting numeric values within a defined range via draggable handle(s)
- **Mental model**: A physical slider control that maps spatial position to numeric values with configurable bounds and step intervals
- **Semantic meaning**: Communicates continuous value selection (volume, brightness, price range, etc.) where precise numeric input is less important than relative positioning

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | `defaultValue={[50]}` or controlled `value={[50]}` as number array |
| Range (min-max) | ✅ | Native | Multiple thumbs via `defaultValue={[25, 75]}`, renders two handles for range selection |
| Labels/marks | ❌ | CSS-only | Not documented; would require custom implementation outside component structure |
| Tooltips on handle | ❌ | CSS-only | Not documented; would require custom wrapper or overlay implementation |
| Custom handle content | ✅ | Composed | Slider.Thumb accepts children for custom handle rendering |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default pattern: `defaultValue={[50]}` with single Slider.Thumb |
| Range (dual handles) | ✅ | Native | `defaultValue={[25, 75]}` with multiple Slider.Thumb components, `minStepsBetweenThumbs` controls minimum gap |
| Vertical orientation | ✅ | Native | `orientation="vertical"` prop on Slider.Root |
| Reverse direction | ✅ | Native | `inverted={true}` prop reverses value direction, separate from `dir="rtl"` for text direction |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled={true}` prop, exposes `[data-disabled]` attribute for styling |
| Read-only | ❌ | CSS-only | No native read-only prop; would need custom pointer-events styling |
| Error state | ❌ | CSS-only | No built-in error state; requires custom styling/wrapper |
| Loading | ❌ | CSS-only | No built-in loading state; requires custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step={1}` prop defines increment between values, keyboard navigation respects steps |
| Track marks | ❌ | CSS-only | Not documented; would require custom CSS overlay on Slider.Track |
| Color customization | ✅ | CSS-only | ShadCN uses Tailwind classes for styling; colors via CSS custom properties or Tailwind config |
| Size variants | ❌ | CSS-only | No predefined size variants; requires custom className styling |
| Track styling | ✅ | Composed | Slider.Track, Slider.Range as separate composable parts for granular styling control |

## Code Examples

### Basic Single Value
```tsx
import { Slider } from "@/components/ui/slider"

<Slider
  defaultValue={[50]}
  max={100}
  step={1}
  className="w-[60%]"
/>
```

### Range with Dual Handles (from Radix docs)
```tsx
<Slider.Root
  defaultValue={[25, 75]}
  max={100}
  minStepsBetweenThumbs={1}
>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb aria-label="Minimum value" />
  <Slider.Thumb aria-label="Maximum value" />
</Slider.Root>
```

### Vertical Orientation (from Radix docs)
```tsx
<Slider.Root
  orientation="vertical"
  defaultValue={[50]}
  max={100}
>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb aria-label="Value" />
</Slider.Root>
```

### Controlled State Pattern
```tsx
const [value, setValue] = React.useState([50])

<Slider
  value={value}
  onValueChange={setValue}
  max={100}
  step={1}
/>
```

### Component Structure (Radix composition pattern)
```tsx
import * as Slider from "@radix-ui/react-slider"

<Slider.Root defaultValue={[50]} max={100} step={1}>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
</Slider.Root>
```

## Notable Features

### Compositional Architecture
- **Four-part structure**: Root (state), Track (rail), Range (fill), Thumb (handle)
- **Flexible assembly**: Each part can be styled independently via className
- **Radix composition**: Follows Radix UI's compound component pattern with namespaced subcomponents

### Interaction Model
- **Track clicking**: Clicking anywhere on track jumps value to that position
- **Keyboard navigation**: Full arrow key support (←/→/↑/↓), PageUp/PageDown, Home/End
- **Touch-friendly**: Built for cross-device interaction (mouse, touch, keyboard)
- **Pointer events required**: Mouse events (`onMouseDown`, etc.) don't fire; use pointer events instead

### Value Management
- **Array-based values**: Always uses number arrays even for single values (`[50]` not `50`)
- **Controlled/uncontrolled**: Supports both `defaultValue` (uncontrolled) and `value`+`onValueChange` (controlled)
- **Commit events**: `onValueCommit` fires on interaction end (mouseup/touch end) vs `onValueChange` during drag

### Accessibility
- **ARIA compliance**: Follows WAI-ARIA Slider design pattern
- **Keyboard accessible**: Complete keyboard control without mouse requirement
- **Screen reader support**: Proper semantic structure with aria-label support on thumbs
- **Data attributes**: `[data-disabled]`, `[data-orientation]` for state-based styling

### Form Integration
- **Native form support**: `name` and `form` props for standard form submission
- **Hidden inputs**: Automatically renders hidden inputs for each thumb value

### Styling Integration
- **ShadCN approach**: Pre-styled via Tailwind CSS with `cn()` utility for class merging
- **Customization via props**: `className` prop for Tailwind classes or custom CSS
- **CSS variables friendly**: Can use CSS custom properties for theming
- **No inline styles**: Styling entirely class-based for flexibility

## Research Notes

### Documentation Accessibility
- **ShadCN docs are minimal**: Single basic example with installation instructions
- **Radix docs are comprehensive**: Full API reference with all props, subcomponents, keyboard shortcuts
- **Pattern**: ShadCN provides styled wrapper, Radix provides unstyled primitive with complete API

### Implementation Observations
- **Radix dependency**: ShadCN Slider is a thin styling layer over Radix UI Slider primitive
- **No custom features**: ShadCN doesn't add functionality beyond Radix; only styling opinions
- **Tailwind-first**: Styling assumes Tailwind CSS for rapid customization
- **Installation simplicity**: CLI tool (`shadcn@latest add slider`) handles setup

### Similarities and Differences from Radix

**Identical Functionality**:
- All props are passed through to Radix Root unchanged
- Same compositional structure (Root, Track, Range, Thumb)
- Same event model and accessibility features

**ShadCN Additions**:
- Pre-configured Tailwind styling with design system tokens
- `cn()` utility for class name merging
- Opinionated default styling (colors, sizing, spacing)
- Simplified import (`@/components/ui/slider` vs explicit Radix imports)

**Missing from ShadCN docs**:
- No range/dual handle examples shown
- No vertical orientation examples
- No customization patterns documented
- No variant examples (size, color, etc.)

### Framework Context
- **React-only**: ShadCN is React-specific; no framework-agnostic version
- **TypeScript-first**: All examples use TypeScript with proper typing
- **Tailwind dependency**: Assumes Tailwind CSS for styling approach
- **Copy-paste philosophy**: Components copied into project, not imported from package

### Potential Semantic UI Considerations
- **Web Component adaptation**: Would need translation from React composition to Shadow DOM parts
- **Signal-based state**: Could map Radix's controlled state to Semantic UI signals
- **Event system**: Radix pointer events vs Semantic UI event delegation
- **Styling approach**: CSS custom properties vs Tailwind classes
- **Composition model**: Slot-based content projection vs React children
