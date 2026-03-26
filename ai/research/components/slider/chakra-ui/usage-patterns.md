# Chakra UI - Slider Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/slider
Status: ✅ Working
Version: v3.29.0 (Current)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-documented with multiple examples, theming guidance, and API reference

## Component Definition
- **Core purpose**: Enable users to make selections from a range of numeric values through an interactive draggable interface
- **Mental model**: A draggable thumb on a horizontal or vertical track that represents a value within a defined range
- **Semantic meaning**: Input control for selecting numeric values where precise input is less important than relative position within a range (e.g., volume, brightness, filters)

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Numeric value | ✅ | Native | Value display via `SliderValueText` component, controllable with `value`/`defaultValue` props |
| Range (min-max) | ✅ | Native | Set `value` or `defaultValue` to array for dual-thumb range selection |
| Labels/marks | ✅ | Native | `SliderMark` component for static labels at specific values, `SliderLabel` for field label |
| Tooltips on handle | ✅ | Composed | Wrap `SliderThumb` with Chakra's `Tooltip` component, control visibility with hover state |
| Custom handle content | ✅ | Composed | Children of `SliderThumb` can include icons, text, or custom elements |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single value | ✅ | Native | Default behavior with single numeric `value`/`defaultValue` |
| Range (dual handles) | ✅ | Native | Pass array to `value`/`defaultValue`, use `minStepsBetweenThumbs` to prevent overlap |
| Vertical orientation | ✅ | Native | `orientation='vertical'` prop, adjust height with `minH` |
| Reverse direction | ✅ | Native | Built-in RTL support, can be controlled via direction context |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `isDisabled` prop prevents interaction |
| Read-only | ✅ | Native | `isReadOnly` prop allows display without modification |
| Error state | ✅ | Native | Supports validation states through Field wrapper integration |
| Loading | ✅ | Native | Loading states supported for async value updates |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Step increments | ✅ | Native | `step` prop defines interval between values (discrete slider) |
| Track marks | ✅ | Native | `SliderMark` with `value` prop for positioning, accepts custom styling |
| Color customization | ✅ | Native | `colorPalette` prop for theme colors (teal, blue, pink, etc.) |
| Size variants | ✅ | Native | `size` prop with predefined sizes, customizable via theme |
| Track styling | ✅ | CSS-only/Composed | `SliderTrack`, `SliderFilledTrack`, and `SliderRange` accept style props |

## Code Examples

### Basic Usage (v2)
```jsx
<Slider aria-label='slider-ex-1' defaultValue={30}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
```

### Basic Usage (v3 - New Composition)
```jsx
<Slider.Root>
  <Slider.Label />
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumb>
      <Slider.DraggingIndicator />
      <Slider.HiddenInput />
    </Slider.Thumb>
  </Slider.Control>
</Slider.Root>
```

### Color Scheme Customization
```jsx
<Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={30}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
```

### Vertical Orientation
```jsx
<Slider
  aria-label='slider-ex-3'
  defaultValue={30}
  orientation='vertical'
  minH='32'
>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
```

### Custom Styled Slider with Icon in Thumb
```jsx
<Slider aria-label='slider-ex-4' defaultValue={30}>
  <SliderTrack bg='red.100'>
    <SliderFilledTrack bg='tomato' />
  </SliderTrack>
  <SliderThumb boxSize={6}>
    <Box color='tomato' as={MdGraphicEq} />
  </SliderThumb>
</Slider>
```

### Discrete Slider with Steps
```jsx
<Slider defaultValue={60} min={0} max={300} step={30}>
  <SliderTrack bg='red.100'>
    <SliderFilledTrack bg='tomato' />
  </SliderTrack>
  <SliderThumb boxSize={6} />
</Slider>
```

### Slider with Custom Marks/Labels
```jsx
function SliderMarkExample() {
  const [sliderValue, setSliderValue] = useState(50)
  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }
  return (
    <Box p={4} pt={6}>
      <Slider aria-label='slider-ex-6' onChange={(val) => setSliderValue(val)}>
        <SliderMark value={25} {...labelStyles}>25%</SliderMark>
        <SliderMark value={50} {...labelStyles}>50%</SliderMark>
        <SliderMark value={75} {...labelStyles}>75%</SliderMark>
        <SliderMark
          value={sliderValue}
          textAlign='center'
          bg='blue.500'
          color='white'
          mt='-10'
          ml='-5'
          w='12'
        >
          {sliderValue}%
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}
```

### Slider with Tooltip
```jsx
function SliderThumbWithTooltip() {
  const [sliderValue, setSliderValue] = React.useState(5)
  const [showTooltip, setShowTooltip] = React.useState(false)
  return (
    <Slider
      id='slider'
      defaultValue={5}
      min={0}
      max={100}
      colorScheme='teal'
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderMark value={25} mt='1' ml='-2.5' fontSize='sm'>25%</SliderMark>
      <SliderMark value={50} mt='1' ml='-2.5' fontSize='sm'>50%</SliderMark>
      <SliderMark value={75} mt='1' ml='-2.5' fontSize='sm'>75%</SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg='teal.500'
        color='white'
        placement='top'
        isOpen={showTooltip}
        label={`${sliderValue}%`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  )
}
```

### Getting Final Value on Change End
```jsx
<Slider aria-label='slider-ex-5' onChangeEnd={(val) => console.log(val)}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
```

### Controlled Slider with focusThumbOnChange
```jsx
<Slider aria-label='slider-ex-5' value={value} focusThumbOnChange={false}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
```

### Theme Customization - Base Styles
```jsx
import { sliderAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  thumb: {
    bg: 'orange.400',
  },
  filledTrack: {
    bg: 'blue.600',
  },
})

export const sliderTheme = defineMultiStyleConfig({ baseStyle })
```

### Custom Size Definition
```jsx
const sizes = {
  xl: definePartsStyle({
    container: defineStyle({
      w: "50%",
    }),
    track: defineStyle({
      h: 7,
    }),
    thumb: defineStyle({
      boxSize: 7,
    }),
  }),
};

export const sliderTheme = defineMultiStyleConfig({ sizes })

// Usage:
<Slider size="xl">...</Slider>
```

### Custom Variant - Square Thumb
```jsx
const square = definePartsStyle({
  thumb: defineStyle({
    rounded: "none",
  }),
});

export const sliderTheme = defineMultiStyleConfig({
  variants: { square },
})

// Usage:
<Slider variant="square">...</Slider>
```

## Notable Features

### V3 Architecture Evolution
- **Slot-Recipe Pattern**: V3 introduces a new composition model using dot notation (e.g., `Slider.Root`, `Slider.Track`) providing better component organization and discoverability
- **Built on Ark UI**: Leverages Ark UI's headless slider component for accessibility and behavior, combined with Chakra's styling system
- **Multi-thumb Context**: Built-in support for range sliders with context-based value iteration for multiple thumbs

### Accessibility
- Native keyboard navigation support
- Screen reader friendly with proper ARIA labels
- Hidden input integration for form accessibility
- `touch-action: none` for reliable touch interactions

### Customization System
- **CSS Variables**: Exposes design tokens (`--slider-thumb-size`, `--slider-track-size`, `--slider-marker-size`) for granular control
- **Multi-style Config**: Comprehensive theming API supporting base styles, size variants, visual variants, and default props
- **Style Props**: Direct styling through Chakra's style system on individual components

### State Management
- Controlled and uncontrolled patterns supported
- `onChange` for real-time updates during drag
- `onChangeEnd` for capturing final value after interaction
- `focusThumbOnChange` prop to control focus behavior during programmatic updates
- `minStepsBetweenThumbs` for range slider validation

### Component Parts (v3)
The v3 architecture provides granular control through these sub-components:
- `SliderRoot` / `SliderRootProvider` - Container and context provider
- `SliderControl` - Control wrapper
- `SliderTrack` - Visual track/rail
- `SliderRange` / `SliderFilledTrack` - Filled portion indicator
- `SliderThumb` - Draggable handle
- `SliderLabel` - Associated label
- `SliderValueText` - Current value display
- `SliderMarkerGroup` / `SliderMarker` - Position markers with labels
- `SliderDraggingIndicator` - Visual feedback during drag
- `SliderHiddenInput` - Hidden input for form integration

### Innovative Patterns
- **Dragging Indicator**: Built-in component for showing tooltips/indicators only while dragging, reducing visual clutter
- **Dynamic Mark Labels**: SliderMark can display dynamic content based on current slider state
- **Flexible Mark System**: Accepts either numeric values or objects with custom labels for rich mark displays
- **Creative Applications**: Documentation showcases image galleries, color pickers, and audio controls as inspiration

## Research Notes

### Documentation Access
- Main v3 documentation available but code examples were limited in initial fetch
- v2 documentation (https://v2.chakra-ui.com/docs/components/slider) provided more comprehensive code examples
- Source code structure analyzed from GitHub repository showing slot-recipe composition pattern
- Component built on Ark UI foundation with Chakra styling layer

### Framework Approach
- **Progressive Enhancement**: V3 represents architectural evolution while maintaining core patterns
- **Composition over Configuration**: Dot notation API provides clearer component hierarchy
- **Design System Integration**: Deep integration with Chakra's theming system through multi-style configs
- **Accessibility First**: Built on headless UI foundation (Ark UI) ensuring WCAG compliance

### Version Differences
- **V2**: Traditional component composition with prop-based configuration
- **V3**: Slot-recipe pattern with dot notation, more granular control and better TypeScript support
- Both versions maintain similar functionality with V3 offering improved developer experience and component organization

### Implementation Insights
- Forwardable component pattern allows composition and ref forwarding
- Context-based styling through `createSlotRecipeContext` for theme integration
- Built-in responsive behavior through Chakra's responsive style props
- Touch-optimized with `touch-action: none` for reliable mobile interactions
