# Chakra UI - QR Code Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/qr-code
Status: ✅ Working
Version: 3.28.1
Last Verified: 2025-11-05

## Documentation Quality
Good - Includes basic usage, component structure, and resource links. API reference is concise, with references to underlying Ark UI documentation for comprehensive feature details.

## Component Definition
- **Core purpose**: Generate scannable QR codes from provided string data for embedding in web applications. Encodes any string value into a visual QR code pattern that can be scanned by QR code readers.
- **Mental model**: A composable data-to-visual component that transforms input data into a scannable graphic. Users think of it as "I have data I want to turn into a QR code."
- **Semantic meaning**: Represents machine-readable data in visual form, typically used for sharing URLs, contact information, or other machine-processable content. Acts as a bridge between human-readable (URL/text) and machine-readable (QR pattern) formats.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Data/value encoding | ✅ | Native | `value` prop accepts any string; typically URLs, contact info, or plain text |
| Logo/image overlay | ✅ | Composed | QrCode.Frame can contain overlay elements positioned absolutely or via composition |
| Error correction level | ❓ | Unknown | Not explicitly documented in Chakra UI docs; may be available via Ark UI |
| Data type variants | ✅ | Native | String-based; Chakra UI handles encoding automatically (no manual QR level selection in v3.28) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| SVG rendering | ✅ | Native | Component uses SVG-based rendering via `<svg>` elements for scalable, crisp output at any size |
| Canvas rendering | ❌ | Not available | Uses SVG exclusively; no canvas-based implementation |
| Raster export | ❌ | Not available | SVG-based; can be exported to PNG/JPG via client-side rendering, not built-in |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size customization | ✅ | CSS-only | Default 120px; controlled via `--qr-code-size` CSS custom property |
| Color customization | ✅ | CSS-only | Uses `fill: currentColor` property; inherit from parent color via CSS or Chakra color utilities |
| Overlay sizing | ✅ | CSS-only | `--qr-code-overlay-size` CSS variable for optional overlays (e.g., logo in center) |
| Border/frame options | ✅ | Composed | QrCode.Frame component allows padding/styling; QrCode.Root can accept containerization |

## Code Examples

### Basic QR Code
```jsx
import { QrCode } from "@chakra-ui/react"

export function BasicQrCode() {
  return (
    <QrCode.Root value="https://www.google.com">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}
```

### With Custom Styling (Size)
```jsx
import { QrCode } from "@chakra-ui/react"

export function CustomSizedQrCode() {
  return (
    <QrCode.Root
      value="https://example.com"
      style={{ "--qr-code-size": "200px" }}
    >
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}
```

### With Color Customization
```jsx
import { QrCode, Box } from "@chakra-ui/react"

export function ColoredQrCode() {
  return (
    <Box color="blue.600">
      <QrCode.Root value="https://example.com">
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
    </Box>
  )
}
```

### With Logo Overlay
```jsx
import { QrCode, Box, Image } from "@chakra-ui/react"

export function QrCodeWithLogo() {
  return (
    <QrCode.Root
      value="https://example.com"
      style={{ "--qr-code-size": "200px", "--qr-code-overlay-size": "50px" }}
    >
      <QrCode.Frame position="relative">
        <QrCode.Pattern />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          p={1}
          borderRadius="md"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            w={`var(--qr-code-overlay-size)`}
            h={`var(--qr-code-overlay-size)`}
          />
        </Box>
      </QrCode.Frame>
    </QrCode.Root>
  )
}
```

### Responsive QR Code
```jsx
import { QrCode, Box } from "@chakra-ui/react"

export function ResponsiveQrCode() {
  return (
    <Box
      style={{
        "--qr-code-size": "120px"
      }}
      _md={{
        "--qr-code-size": "200px"
      }}
      _lg={{
        "--qr-code-size": "250px"
      }}
    >
      <QrCode.Root value="https://example.com">
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
    </Box>
  )
}
```

### With Padding/Border Frame
```jsx
import { QrCode, Box } from "@chakra-ui/react"

export function QrCodeWithFrame() {
  return (
    <Box
      bg="white"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      display="inline-block"
    >
      <QrCode.Root value="https://example.com">
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
    </Box>
  )
}
```

[View Live](https://storybook.chakra-ui.com/) *(Storybook examples available)*

## Notable Features

- **Compound Component Architecture**: Follows Chakra UI v3's modern composition pattern with Root, Frame, and Pattern subcomponents
- **CSS Variable-based Sizing**: Uses `--qr-code-size` and `--qr-code-overlay-size` for flexible customization without prop drilling
- **SVG-based Rendering**: Guarantees crisp rendering at any scale, perfect for both web display and print
- **Color Inheritance**: Uses `fill: currentColor` property, allowing color customization through Chakra's color system
- **Ark UI Foundation**: Built on Ark UI's QR Code component, providing battle-tested QR encoding under the hood
- **No Error Correction Props**: Unlike some QR libraries, Chakra UI v3.28 doesn't expose error correction level selection; defaults to library standards

## Props/API Reference

### QrCode.Root Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | The data/text to encode into the QR code (typically a URL, contact info, or plain text) |
| `style` | `CSSProperties` | No | - | CSS custom properties for sizing (e.g., `{ "--qr-code-size": "150px" }`) |
| `children` | `ReactNode` | Yes | - | Must contain QrCode.Frame component |

### QrCode.Frame Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Must contain QrCode.Pattern component; can also contain overlay elements |
| `style` | `CSSProperties` | No | - | Standard Chakra/React inline styles for positioning, layout, etc. |

### QrCode.Pattern Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| None | - | - | - | No direct props; inherits sizing and color from parent context |

### CSS Variables (Customization)

| Variable | Default | Usage |
|----------|---------|-------|
| `--qr-code-size` | `120px` | Controls width/height of the QR code pattern |
| `--qr-code-overlay-size` | - | Optional variable for sizing overlay elements (not auto-applied) |

## Architecture & Implementation Details

### Compound Component Pattern
The QR Code component exemplifies Chakra UI v3's shift toward composable, unstyled-by-default patterns:

```
QrCode.Root (State provider, encodes data)
  └── QrCode.Frame (Container for layout control)
      └── QrCode.Pattern (SVG element, renders pattern)
      └── [Optional overlay content]
```

### SVG Structure
The Pattern component renders as an SVG element with the following characteristics:
- Uses SVG's `<rect>` elements for individual QR code modules
- Applies `fill: currentColor` for inheritance-based color control
- Automatically scales via CSS without rasterization artifacts

### Data Flow
1. `value` prop passed to `QrCode.Root`
2. Ark UI (underlying library) encodes the string into QR matrix data
3. `QrCode.Pattern` renders SVG representation
4. Frame acts as positioning/layout context for overlays

## Accessibility

### Built-in Accessibility Features
- **SVG Semantics**: Uses proper SVG elements for screen reader compatibility
- **aria-label Support**: Can be applied to QrCode.Root for context
- **Alternative Text Context**: Since QR codes are visual data, should be accompanied by the represented data in alt text or label

### Accessibility Best Practices

**Always Provide Context:**
```jsx
<Box>
  <Heading>Scan QR Code to visit our website</Heading>
  <QrCode.Root value="https://example.com">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
  <Text>Or visit: https://example.com</Text>
</Box>
```

**Use aria-label for Icon-only Usage:**
```jsx
<QrCode.Root
  value="https://example.com"
  aria-label="QR code for https://example.com"
>
  <QrCode.Frame>
    <QrCode.Pattern />
  </QrCode.Frame>
</QrCode.Root>
```

**Screen Reader Considerations:**
- QR codes are inherently visual; always provide alternative access to the encoded information
- Include descriptive context or alternative link/text
- Don't rely solely on QR code for critical navigation

## Use Cases

### Primary Uses
- **Contact Information**: Encoding vCard data for easy contact sharing
- **URL Sharing**: Converting long URLs into scannable codes
- **Payment Processing**: Encoding payment instructions (though specialized libraries may be better)
- **WiFi Sharing**: Encoding network credentials
- **Event Registration**: Linking to event pages or registration forms
- **Product Information**: Linking to product details or documentation
- **Document Tracking**: Encoding document IDs or tracking numbers

### When NOT to Use
- Critical navigation that users must access (always provide alternative)
- Only accessibility mechanism (requires accompanying text/link)
- When immediate navigation is required (QR scanning adds friction)

## Styling Patterns

### Via CSS Variables
```jsx
<Box
  style={{
    "--qr-code-size": "150px"
  }}
>
  <QrCode.Root value="https://example.com">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
</Box>
```

### Via Chakra Responsive Props
```jsx
<Box
  style={{ "--qr-code-size": "120px" }}
  _md={{ "--qr-code-size": "180px" }}
  _lg={{ "--qr-code-size": "240px" }}
>
  <QrCode.Root value="https://example.com">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
</Box>
```

### Via Container Styling
```jsx
<Box
  color="brand.600"
  bg="white"
  p={4}
  borderRadius="lg"
>
  <QrCode.Root value="https://example.com">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
</Box>
```

## Browser Support
- Modern browsers with SVG support (all current versions)
- IE11 support unlikely due to modern component architecture

## Performance Considerations

### Rendering Performance
- SVG-based rendering is efficient for static QR codes
- No canvas rendering overhead
- No animation frame updates needed for static codes

### Best Practices
- Pre-compute QR code values where possible
- Use memoization if QR code component updates frequently:
```jsx
const QrCodeMemo = React.memo(({ value }) => (
  <QrCode.Root value={value}>
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
))
```

## Known Limitations & Gaps

- **No Error Correction Control**: Cannot specify QR error correction level (L/M/Q/H)
- **No Export Function**: No built-in PNG/JPG export; requires external libraries
- **No Animated QR**: Static QR codes only; no dynamic/animated variants
- **No Padding Control in Root**: Padding/margin must be applied via Frame or wrapper container
- **Limited Size Validation**: No warning if `--qr-code-size` is too small to scan reliably

## Research Notes

- **Documentation**: Chakra UI v3 documentation is concise, referring to underlying Ark UI library for detailed feature information
- **Ark UI Dependency**: The actual QR encoding is provided by Ark UI; for advanced features (error correction, ECI modes, etc.), consult Ark UI documentation
- **Storybook Available**: Official examples available in Storybook for reference implementation patterns
- **No v2 Equivalent**: This is a Chakra UI v3-only component; no v2 version exists in the legacy codebase

## Comparison with Other Libraries

### vs. QRCode.js / qrcode.react
- **QRCode.js**: More low-level control, direct error correction props, larger bundle
- **Chakra UI QR Code**: Higher-level, integrated with design system, automatic theming

### vs. qr-code-styling
- **qr-code-styling**: More customization options (gradients, rounded squares, images)
- **Chakra UI QR Code**: Simpler API, better Chakra integration, less configuration

### vs. Native Solutions
- More polished than rolling your own with a library wrapper
- Better accessibility defaults than minimal implementations

---

## Summary of Key Findings

### Core Features
1. **Compound Component Pattern**: Root → Frame → Pattern structure enables composition
2. **SVG-based**: Scalable, crisp rendering at any size without rasterization
3. **CSS Variable Customization**: `--qr-code-size` and `--qr-code-overlay-size` for flexible sizing
4. **Color Inheritance**: Uses `fill: currentColor` for theme-aware coloring
5. **Ark UI Foundation**: Battle-tested QR encoding under the hood

### API Simplicity
- Single required prop: `value` (the data to encode)
- No complex prop drilling or configuration
- Minimal prop surface area makes it easy to learn and use

### Integration Pattern
- Works seamlessly with Chakra's color system
- Responsive design via CSS variables and responsive style props
- Composable with overlays and frames

### Customization Approach
- **Sizing**: CSS custom properties (`--qr-code-size`)
- **Color**: Parent color context via `fill: currentColor`
- **Layout**: Wrapper containers for padding/borders/frames
- **Overlays**: Absolute positioning within Frame for logos

---

**Research Date**: 2025-11-05
**Chakra UI Version Analyzed**: 3.28.1
**Documentation Sources**: Official Chakra UI docs, Storybook, Ark UI foundation reference
