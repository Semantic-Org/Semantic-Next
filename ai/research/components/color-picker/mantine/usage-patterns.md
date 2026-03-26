# Mantine - ColorPicker Usage Patterns

## Component URL
https://mantine.dev/core/color-picker/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
High quality documentation with comprehensive examples, API reference, and accessibility guidance. The documentation covers basic usage, advanced patterns, theming, and integration with the broader Mantine ecosystem. Code examples are clear and demonstrate real-world usage patterns. Accessibility features are documented but could be more detailed.

## Component Definition
- **Core purpose**: Provide an interactive UI for selecting colors across multiple formats (hex, rgb, hsl, hsv) with alpha channel support
- **Mental model**: A color selection tool combining a 2D saturation/brightness picker with 1D sliders for hue and opacity, plus optional swatches for quick selection
- **Semantic meaning**: Represents a color input control for color-related settings and design tools

## Pattern Support Levels
- **Native**: Features built directly into the ColorPicker component with dedicated props and internal logic (e.g., format switching, swatches, size variants)
- **Composed**: Functionality achieved by combining ColorPicker with other Mantine components or using multiple related components together (e.g., using HueSlider and AlphaSlider separately)
- **CSS-only**: Styling and visual customization through the Styles API, CSS modules, or custom CSS (e.g., custom swatch layouts, color scheme variations)

## Core Patterns

### Color Format Support
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| HEX format | ✅ | Native | Basic 6-character hexadecimal color values (#RRGGBB) |
| HEXA format | ✅ | Native | Hex with alpha channel support (#RRGGBBAA) |
| RGB format | ✅ | Native | Red, Green, Blue color model (rgb(r, g, b)) |
| RGBA format | ✅ | Native | RGB with alpha channel (rgba(r, g, b, a)) |
| HSL format | ✅ | Native | Hue, Saturation, Lightness color model |
| HSLA format | ✅ | Native | HSL with alpha channel support |
| HSV format | ✅ | Native | Hue, Saturation, Value color model (internal) |
| Alpha channel | ✅ | Native | Opacity controls for HEXA, RGBA, HSLA formats only |
| Format switching | ✅ | Native | Via `format` prop to change output format |

### Picker Components
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Saturation picker | ✅ | Native | 2D canvas for selecting saturation and brightness/lightness |
| Hue slider | ✅ | Native | 1D slider for hue selection (0-360 degrees) |
| Alpha slider | ✅ | Native | 1D slider for opacity (0-1), shown only for alpha formats |
| Standalone HueSlider | ✅ | Native | Separate `<HueSlider>` component for hue-only selection |
| Standalone AlphaSlider | ✅ | Native | Separate `<AlphaSlider>` component for opacity-only selection |
| Color preview | ✅ | Native | Visual preview of currently selected color |
| Color swatches | ✅ | Native | Predefined color options for quick selection |

### State Management
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled mode | ✅ | Native | `value` + `onChange` props for external state control |
| Uncontrolled mode | ✅ | Native | `defaultValue` prop for internal state management |
| Format conversion | ✅ | Native | Automatic conversion between formats when `format` prop changes |
| Value persistence | ✅ | Native | Maintains color value across format changes |

### Layout & Presentation
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | xs, sm, md, lg, xl via `size` prop |
| Full width | ✅ | Native | `fullWidth` prop to stretch to parent width |
| Swatches layout | ✅ | Native | `swatchesPerRow` prop to control grid layout |
| Swatches visibility | ✅ | Native | Show/hide swatches with conditional rendering |
| Picker visibility | ✅ | Native | `withPicker` boolean prop to toggle picker display |
| Component composition | ✅ | Native | Combine ColorPicker with HueSlider/AlphaSlider independently |

### Accessibility
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ✅ | Native | Arrow keys adjust slider values |
| Focus management | ✅ | Native | Sliders are focusable, focus moves to slider on interaction |
| ARIA labels | ✅ | Native | `saturationLabel`, `hueLabel`, `alphaLabel` props |
| Screen reader support | ✅ | Native | Labels provided to screen readers when specified |
| Tab navigation | ✅ | Native | Standard tab order through picker components |

### Styling & Theming
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Styles API | ✅ | Native | Comprehensive styling of internal elements |
| CSS modules | ✅ | Native | Standard Mantine CSS module support |
| Theme integration | ✅ | Native | Respects Mantine theme configuration |
| Custom swatches | ✅ | Native | Array of color strings via `swatches` prop |
| Swatch customization | ✅ | CSS-only | Style individual swatches via Styles API |

## Code Examples

### Basic Usage
```jsx
import { ColorPicker } from '@mantine/core';

function Demo() {
  const [value, onChange] = useState('#C5D899');
  return <ColorPicker format="hex" value={value} onChange={onChange} />;
}
```

### With Color Swatches
```jsx
import { ColorPicker } from '@mantine/core';

function Demo() {
  const [value, onChange] = useState('#fff');

  return (
    <ColorPicker
      format="hex"
      value={value}
      onChange={onChange}
      swatches={[
        '#25262b',
        '#868e96',
        '#fa5252',
        '#e64980',
        '#be4bdb',
        '#7950f2',
        '#4c6ef5',
        '#228be6',
        '#15aabf',
        '#12b886',
        '#40c057',
        '#82c91e',
        '#fab005',
        '#fd7e14',
      ]}
    />
  );
}
```

### Format Variants
```jsx
// HEX format
<ColorPicker format="hex" />

// HEXA with alpha channel
<ColorPicker format="hexa" />

// RGB format
<ColorPicker format="rgb" />

// RGBA with alpha slider
<ColorPicker format="rgba" />

// HSL format
<ColorPicker format="hsl" />

// HSLA with alpha slider
<ColorPicker format="hsla" />
```

### Controlled Swatches Per Row
```jsx
<ColorPicker
  format="hex"
  swatches={colors}
  swatchesPerRow={10}
/>
```

### Without Picker (Swatches Only)
```jsx
<ColorPicker
  format="hex"
  value={value}
  onChange={onChange}
  withPicker={false}
  swatches={presetColors}
/>
```

### Full Width
```jsx
<ColorPicker
  format="hex"
  value={value}
  onChange={onChange}
  fullWidth
/>
```

### Size Variants
```jsx
<ColorPicker size="xs" />
<ColorPicker size="sm" />
<ColorPicker size="md" /> {/* default */}
<ColorPicker size="lg" />
<ColorPicker size="xl" />
```

### Standalone HueSlider
```jsx
import { HueSlider } from '@mantine/core';

function Demo() {
  const [value, onChange] = useState(250);
  return <HueSlider value={value} onChange={onChange} />;
}
```

### Standalone AlphaSlider
```jsx
import { AlphaSlider } from '@mantine/core';

function Demo() {
  const [value, onChange] = useState(0.5);
  return <AlphaSlider color="#1c7ed6" value={value} onChange={onChange} />;
}
```

### With Accessibility Labels
```jsx
<ColorPicker
  format="rgba"
  saturationLabel="Saturation and brightness"
  hueLabel="Hue"
  alphaLabel="Opacity"
/>
```

### Uncontrolled Mode
```jsx
<ColorPicker defaultValue="#C5D899" format="hex" />
```

## Styling Approaches

### Styles API Target Elements
The ColorPicker exposes the following elements for styling via the Styles API:

- **wrapper**: Root wrapper element
- **preview**: Color preview display
- **body**: Main body container
- **slider**: Slider elements (hue and alpha sliders)
- **saturation**: Saturation picker canvas
- **thumb**: Draggable thumb/handle on sliders and saturation picker
- **swatch**: Individual color swatch buttons
- **swatches**: Container for swatch grid

### Styles API Example
```jsx
<ColorPicker
  styles={{
    preview: { borderRadius: '50%' },
    swatch: { borderRadius: 4 },
    slider: { marginTop: 12 },
  }}
/>
```

### Theme Integration
ColorPicker respects the Mantine theme configuration:
- Size values (xs, sm, md, lg, xl) map to theme spacing
- Colors use theme color scheme
- Border radius follows theme settings
- Focus ring styles from theme

### CSS Module Customization
```css
/* Custom styles for ColorPicker */
.colorPicker :global(.mantine-ColorPicker-preview) {
  border: 2px solid var(--mantine-color-blue-6);
}

.colorPicker :global(.mantine-ColorPicker-saturation) {
  border-radius: 8px;
}
```

## Accessibility Patterns

### Keyboard Navigation
- **Arrow keys**: Adjust slider values (hue, alpha)
  - Left/Down: Decrease value
  - Right/Up: Increase value
- **Tab**: Navigate between focusable elements (saturation picker, hue slider, alpha slider, swatches)
- **Shift+Tab**: Navigate backwards
- **Enter/Space**: Select swatch color (when focused on swatch)

### Focus Management
- Saturation, hue, and alpha sliders are focusable
- Focus automatically moves to slider when interacting with mouse
- Visual focus indicators provided
- Tab order follows logical flow: saturation → hue → alpha → swatches

### Screen Reader Support
Accessibility labels can be provided via props:
- `saturationLabel`: Announces saturation/brightness picker purpose
- `hueLabel`: Announces hue slider purpose
- `alphaLabel`: Announces opacity slider purpose

**Example with labels:**
```jsx
<ColorPicker
  saturationLabel="Select color saturation and brightness"
  hueLabel="Select hue (color tone)"
  alphaLabel="Select opacity level"
/>
```

### ARIA Attributes
While not explicitly documented, the component likely implements:
- `role="slider"` on slider controls
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` on sliders
- `aria-label` or `aria-labelledby` for accessibility labels
- Appropriate button roles for swatches

### Best Practices
- Always provide accessibility labels for screen reader users
- Ensure sufficient color contrast for focus indicators
- Test with keyboard-only navigation
- Provide text alternatives for color values when used in forms

## Notable Features

### Multi-Format Support
Comprehensive support for 6 color formats (HEX, HEXA, RGB, RGBA, HSL, HSLA) with automatic conversion and format-appropriate controls. Alpha slider only appears for formats supporting transparency.

### Modular Components
Provides standalone `HueSlider` and `AlphaSlider` components for building custom color selection interfaces. These can be used independently or combined with the full `ColorPicker`.

### Flexible Swatches System
- Customizable preset colors via `swatches` prop
- Adjustable grid layout with `swatchesPerRow`
- Can be used without the main picker (`withPicker={false}`)
- Individual swatch styling via Styles API

### Size Variants
Five predefined size options (xs, sm, md, lg, xl) for different UI contexts, from compact form fields to large design tool interfaces.

### Styles API Integration
Comprehensive styling control with 8+ targetable elements, allowing deep customization while maintaining component functionality.

### State Management Flexibility
Supports both controlled and uncontrolled patterns:
- Controlled: `value` + `onChange` for integration with form libraries
- Uncontrolled: `defaultValue` for simple use cases

### Full Width Option
`fullWidth` prop enables responsive layouts that adapt to parent container width.

## Research Notes

### Component Architecture
The ColorPicker is a composite component combining:
1. 2D saturation/value or saturation/lightness picker (depends on format)
2. 1D hue slider (0-360 degrees)
3. Optional 1D alpha slider (0-1, for formats with alpha)
4. Optional color swatches grid
5. Color preview display

### Format Considerations
- HSV (Hue, Saturation, Value) appears to be used internally for the saturation picker
- Output format is controlled by the `format` prop
- Conversions between formats happen automatically
- Alpha channel controls only appear for HEXA, RGBA, HSLA formats

### Integration Points
- Works seamlessly with Mantine form libraries
- Compatible with Mantine theme system
- Can be used in controlled forms with validation
- Standalone sliders enable custom color picker UIs

### Performance Considerations
- Saturation picker uses canvas rendering for smooth gradients
- Dragging operations are optimized for 60fps
- Color format conversions are efficient
- No noted performance issues in documentation

### Browser Compatibility
- Modern browser support assumed (ES6+)
- No specific compatibility notes or polyfills mentioned
- Canvas API dependency for saturation picker

### Comparison with Other Implementations
- More modular than many color pickers (standalone sliders)
- Strong format support (6 formats vs typical 1-2)
- Integrated with comprehensive design system (Mantine)
- Styles API provides styling flexibility without breaking encapsulation
- Size variants align with Mantine's consistent sizing system

### Potential Limitations
- No gradient picker support
- No eyedropper/color sampling tool
- No color palette management (beyond static swatches)
- No color history/recent colors feature
- No named color support (e.g., "red", "blue")
- No color space conversions beyond the 6 formats
- Documentation could be more detailed on ARIA implementation

### Use Cases
- Design tools and editors
- Theme customization interfaces
- Form color inputs
- CSS color property editors
- Brand color selection
- Data visualization configuration
- Accessibility contrast checkers (when paired with contrast calculation)
