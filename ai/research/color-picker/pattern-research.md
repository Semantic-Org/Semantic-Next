# Component Pattern Research: Color Picker

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3
- Date: 2025-11-05
- Unique patterns identified: 50+

## Component Definition Consensus

Color Picker components provide interactive interfaces for selecting colors through visual pickers, sliders, and format controls. Universal mental model: "Interactive color selection tool."

**Primary Purpose:** Enable users to select and configure colors through intuitive visual interfaces while supporting multiple color format outputs (HEX, RGB, HSL, etc.) for design systems, themes, and user preferences.

**Mental Model:** A trigger or inline interface that opens/displays a color selection panel with 2D saturation/brightness picker, hue slider, optional alpha slider, and preset swatches - similar to native OS color pickers but web-based.

**Semantic meaning:** Communicates color input and selection intent, providing visual feedback of current color state and enabling precise color manipulation across multiple color space representations.

## Terminology Variations

- **ColorPicker** (2 frameworks) = Ant Design, Mantine, Nuxt UI

All frameworks use consistent "ColorPicker" naming with camelCase or PascalCase variations.

## Pattern Inventory

### Color Format Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| HEX format | #RRGGBB hexadecimal | 3/3 (100%) | **Level 1: Universal** | All | Native |
| RGB format | Red, Green, Blue | 3/3 (100%) | **Level 1: Universal** | All | Native |
| HSL format | Hue, Saturation, Lightness | 2/3 (67%) | **Level 2: Common** | Mantine, Nuxt UI | Native |
| HSB/HSV format | Hue, Saturation, Brightness/Value | 2/3 (67%) | **Level 2: Common** | Ant Design, Mantine | Native |
| Alpha channel (RGBA/HEXA/HSLA) | Transparency support | 3/3 (100%) | **Level 1: Universal** | All | Native |
| CMYK format | Print color space | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | Native |
| CIELab format | Professional color space | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | Native |
| Format switching | Change output format | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Format conversion | Auto-convert between formats | 3/3 (100%) | **Level 1: Universal** | All | Native |

### Picker Interface Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| 2D saturation picker | Saturation/brightness canvas | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Hue slider | 1D hue selection (0-360°) | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Alpha slider | Opacity control (0-1) | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Color preview | Visual current color display | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Preset swatches | Quick color selection | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Gradient mode | Gradient color creation | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |

### State Management Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Controlled mode | External state (value + onChange) | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Uncontrolled mode | Internal state (defaultValue) | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Change callbacks | onChange event handler | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Completion callbacks | onChangeComplete separate event | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |
| Format-specific callbacks | Format change handler | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |

### Size and Layout Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size variants | Multiple size options | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Small size | Compact picker | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Medium size | Default size | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Large size | Prominent picker | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Extra sizes (xs/xl) | Extended size range | 2/3 (67%) | **Level 2: Common** | Mantine, Nuxt UI | Native |
| Full width | Stretch to container | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |

### Trigger Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Click trigger | Open on click | 2/3 (67%) | **Level 2: Common** | Ant Design, Nuxt UI | Native |
| Hover trigger | Open on hover | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |
| Inline display | Always visible picker | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Trigger customization | Custom trigger element | 2/3 (67%) | **Level 2: Common** | Ant Design, Nuxt UI | Native |

### Preset/Swatch Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Preset colors | Predefined color array | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Swatches with labels | Named preset colors | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |
| Swatches per row | Grid layout control | 2/3 (67%) | **Level 2: Common** | Mantine, Nuxt UI | Native |
| Toggle swatches | Show/hide presets | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |

### Component Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Standalone hue slider | Separate HueSlider component | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |
| Standalone alpha slider | Separate AlphaSlider component | 1/3 (33%) | **Level 4: Occasional** | Mantine | Native |
| Custom panel rendering | Template override | 1/3 (33%) | **Level 4: Occasional** | Ant Design | Native |
| Slot-based customization | Vue slot system | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | Composed |

### Performance Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Throttling | Rate-limit updates | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | Native |
| Debouncing | Delay callbacks | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | Native |

### Disabled/State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Disabled state | Non-interactive mode | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Read-only state | View-only mode | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | Native |
| Alpha disable | Hide alpha controls | 2/3 (67%) | **Level 2: Common** | Ant Design, Mantine | Native |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Keyboard navigation | Arrow key controls | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Focus management | Keyboard focus handling | 3/3 (100%) | **Level 1: Universal** | All | Native |
| ARIA labels | Screen reader labels | 2/3 (67%) | **Level 2: Common** | Mantine, Nuxt UI | Native |
| Tab navigation | Tab order support | 3/3 (100%) | **Level 1: Universal** | All | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Custom CSS classes | className prop | 3/3 (100%) | **Level 1: Universal** | All | CSS-only |
| Inline styles | style prop | 3/3 (100%) | **Level 1: Universal** | All | CSS-only |
| Styles API | Granular style control | 1/3 (33%) | **Level 4: Occasional** | Mantine | CSS-only |
| UI slots | Component part styling | 1/3 (33%) | **Level 4: Occasional** | Nuxt UI | CSS-only |
| Theme integration | Design system colors | 3/3 (100%) | **Level 1: Universal** | All | Native |

## Notable Patterns

### Universal (100%)
- HEX and RGB format support
- Alpha channel (RGBA/HEXA)
- 2D saturation picker
- Hue slider
- Alpha slider
- Color preview
- Preset swatches
- Controlled/uncontrolled modes
- onChange callbacks
- Format switching
- Size variants (small, medium, large)
- Disabled state
- Keyboard navigation
- Focus management
- Custom CSS classes
- Theme integration
- Inline display option

### Ant Design Specializations
- Gradient mode (unique feature)
- HSB/HSV color format
- Hover trigger mode
- Preset colors with labels
- Separate onChangeComplete callback
- Format change callback
- Custom panel rendering
- Three size variants (small, middle, large)
- v5.x modern implementation
- ConfigProvider theme integration

### Mantine Specializations
- Six color formats (HEX, HEXA, RGB, RGBA, HSL, HSLA)
- Standalone HueSlider component
- Standalone AlphaSlider component
- Five size variants (xs-xl)
- Full width layout option
- Swatches per row control
- withPicker boolean prop
- Comprehensive Styles API (8+ elements)
- ARIA label props (saturationLabel, hueLabel, alphaLabel)
- v8.3.6 implementation
- Mantine theme integration

### Nuxt UI Specializations
- Five color formats including professional spaces (CMYK, CIELab)
- Performance throttling (50ms default)
- Debounce support
- Read-only state
- Eight UI customization slots
- Five explicit size dimensions
- Vue 3 Composition API
- v-model Vue binding
- Popover integration documentation
- Slot-based customization

## Implementation Notes

### Installation

**Ant Design:**
```bash
npm install antd
```

**Mantine:**
```bash
npm install @mantine/core
```

**Nuxt UI:**
```bash
npm install @nuxt/ui
```

### Basic Usage Comparison

**Ant Design:**
```jsx
import { ColorPicker } from 'antd'

<ColorPicker defaultValue="#1677ff" onChange={(color, hex) => {
  console.log('Color:', color)
  console.log('Hex:', hex)
}} />
```

**Mantine:**
```tsx
import { ColorPicker } from '@mantine/core'

<ColorPicker format="hex" value={color} onChange={setColor} />
```

**Nuxt UI:**
```vue
<UColorPicker v-model="color" />

<script setup>
const color = ref('#3b82f6')
</script>
```

### Format Support Comparison

**Ant Design:**
```jsx
// HEX, RGB, HSB support
<ColorPicker format="hex" />
<ColorPicker format="rgb" />
<ColorPicker format="hsb" />
```

**Mantine:**
```tsx
// 6 format options
<ColorPicker format="hex" />
<ColorPicker format="hexa" />
<ColorPicker format="rgb" />
<ColorPicker format="rgba" />
<ColorPicker format="hsl" />
<ColorPicker format="hsla" />
```

**Nuxt UI:**
```vue
<!-- 5 formats including professional spaces -->
<UColorPicker format="hex" />
<UColorPicker format="rgb" />
<UColorPicker format="hsl" />
<UColorPicker format="cmyk" />
<UColorPicker format="cielab" />
```

### Gradient Mode (Ant Design Only)

```jsx
<ColorPicker mode="gradient" />
```

### Preset Swatches Pattern

**Ant Design:**
```jsx
<ColorPicker
  presets={[
    {
      label: 'Recommended',
      colors: ['#F5222D', '#FA8C16', '#FADB14']
    }
  ]}
/>
```

**Mantine:**
```tsx
<ColorPicker
  swatches={['#25262b', '#868e96', '#fa5252', '#e64980']}
  swatchesPerRow={7}
/>
```

**Nuxt UI:**
```vue
<UColorPicker
  :swatches="['#ef4444', '#f97316', '#f59e0b']"
  :swatches-per-row="6"
/>
```

### Performance Optimization (Nuxt UI)

```vue
<UColorPicker
  v-model="color"
  :throttle="100"
  :debounce="200"
/>
```

### Standalone Sliders (Mantine Only)

```tsx
import { HueSlider, AlphaSlider } from '@mantine/core'

<HueSlider value={hue} onChange={setHue} />
<AlphaSlider value={alpha} onChange={setAlpha} color="#1677ff" />
```

### Size Variants Comparison

**Ant Design:**
```jsx
<ColorPicker size="small" />
<ColorPicker size="middle" /> {/* default */}
<ColorPicker size="large" />
```

**Mantine:**
```tsx
<ColorPicker size="xs" />
<ColorPicker size="sm" />
<ColorPicker size="md" /> {/* default */}
<ColorPicker size="lg" />
<ColorPicker size="xl" />
```

**Nuxt UI:**
```vue
<UColorPicker size="xs" />
<UColorPicker size="sm" />
<UColorPicker size="md" /> <!-- default -->
<UColorPicker size="lg" />
<UColorPicker size="xl" />
```

## Design Philosophy Differences

### Event-Driven (Ant Design)
- **Philosophy**: React-based with rich event system
- **Approach**: Separate onChange and onChangeComplete callbacks
- **Unique Features**: Gradient mode, labeled presets
- **Format Support**: 3 formats (HEX, RGB, HSB)
- **Audience**: Enterprise applications, design tools
- **Specialization**: Gradient creation capabilities

### Component-Modular (Mantine)
- **Philosophy**: Composable primitives
- **Approach**: Standalone slider components for custom UIs
- **Unique Features**: HueSlider, AlphaSlider components
- **Format Support**: 6 formats (most comprehensive)
- **Audience**: Design system builders
- **Specialization**: Maximum flexibility through composition

### Performance-Optimized (Nuxt UI)
- **Philosophy**: Vue 3 with performance tuning
- **Approach**: Built-in throttling and debouncing
- **Unique Features**: Professional color spaces (CMYK, CIELab)
- **Format Support**: 5 formats including print/professional
- **Audience**: Professional design applications
- **Specialization**: Print workflow and color accuracy

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **Theme customization** - User interface color selection
2. **Brand colors** - Brand identity configuration
3. **Design tools** - Color selection in editors
4. **User preferences** - Personal color settings
5. **Data visualization** - Chart/graph color selection
6. **CSS variable editing** - Design token configuration
7. **Form inputs** - Color field in forms

## Key Differences

### Format Coverage
- **Ant Design**: 3 formats (HEX, RGB, HSB)
- **Mantine**: 6 formats (most comprehensive - includes HSL variants)
- **Nuxt UI**: 5 formats (includes professional CMYK, CIELab)

### Unique Features
- **Ant Design**: Gradient mode (only framework with gradient support)
- **Mantine**: Standalone slider components
- **Nuxt UI**: Professional color spaces + performance optimization

### Size Options
- **Ant Design**: 3 sizes (small, middle, large)
- **Mantine**: 5 sizes (xs, sm, md, lg, xl)
- **Nuxt UI**: 5 sizes (xs, sm, md, lg, xl)

### Callback Events
- **Ant Design**: onChange + onChangeComplete (separate)
- **Mantine**: onChange only
- **Nuxt UI**: update:modelValue (Vue pattern)

### Component Composition
- **Ant Design**: Custom panel rendering
- **Mantine**: Standalone HueSlider/AlphaSlider
- **Nuxt UI**: Slot-based customization

### Performance Features
- **Ant Design**: None documented
- **Mantine**: None documented
- **Nuxt UI**: Throttling and debouncing built-in

### Framework Integration
- **Ant Design**: React, ConfigProvider theming
- **Mantine**: React, comprehensive Styles API
- **Nuxt UI**: Vue 3, Composition API, v-model

## Raw Data

- [Ant Design](./ant-design/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
- [Nuxt UI](./nuxt-ui/usage-patterns.md)
