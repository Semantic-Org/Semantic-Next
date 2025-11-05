# Component Pattern Research: QR Code

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 2
- Date: 2025-11-05
- Unique patterns identified: 15+

## Component Definition Consensus

QR Code components serve as specialized utility components for encoding data into scannable visual patterns. The universal mental model is "convert text/URL into a scannable code."

**Primary Purpose:** Transform string data (URLs, text, contact info) into machine-readable QR code graphics for data sharing and scanning workflows.

**Mental Model:** A data-to-visual converter where input text becomes a scannable graphic pattern.

**Semantic Meaning:** Represents encoded data that can be shared via scanning, typically for URLs, contact information, payments, or authentication codes.

## Terminology Variations

### Component Names
- **QRCode** (1 framework) = Ant Design
- **QrCode** (1 framework) = Chakra UI

### Architecture Patterns
- **Single Component** (1 framework): Ant Design uses monolithic `<QRCode />` with props
- **Compound Components** (1 framework): Chakra UI uses `QrCode.Root`, `QrCode.Frame`, `QrCode.Pattern`

### Prop Naming
- **Value prop**: Both frameworks use `value` for data encoding (universal)
- **Size control**: Both offer size customization (Ant: `size` prop; Chakra: CSS variable)
- **Color control**: Both support color (Ant: `color` + `bgColor` props; Chakra: CSS `currentColor`)

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Data/URL encoding | Text to QR conversion | 2/2 (100%) | **Level 1: Universal** | Ant Design, Chakra UI | Native `value` prop |
| Icon/Logo overlay | Brand logo in center | 2/2 (100%) | **Level 1: Universal** | Ant Design, Chakra UI | Ant: Native; Chakra: Composed |
| Error correction | Data recovery levels | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native `errorLevel` (L/M/Q/H) |
| Custom status display | Workflow states | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native status prop |
| Download capability | Save QR as image | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native integration |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| SVG rendering | Scalable vector output | 2/2 (100%) | **Level 1: Universal** | Both frameworks | Ant: Optional; Chakra: Native |
| Canvas rendering | Raster performance | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native `type` prop |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size customization | Dimension control | 2/2 (100%) | **Level 1: Universal** | Both frameworks | Ant: Prop; Chakra: CSS var |
| Color customization | QR code color | 2/2 (100%) | **Level 1: Universal** | Both frameworks | Different approaches |
| Background color | QR background | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native `bgColor` prop |
| Border options | Visual borders | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native `bordered` prop |
| Batch generation | Multiple QR codes | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Array value support |
| Status management | Workflow states | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | active/expired/loading/scanned |
| Custom rendering | Status custom display | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | statusRender function (v5.20+) |

### Architecture Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Compound components | Root/Frame/Pattern | 1/2 (50%) | **Level 3: Moderate** | Chakra UI only | Native architecture |
| Monolithic component | Single component | 1/2 (50%) | **Level 3: Moderate** | Ant Design only | Native architecture |
| CSS variables | Customization | 1/2 (50%) | **Level 3: Moderate** | Chakra UI only | `--qr-code-size` |

## Notable Patterns

### Universal Patterns (100%)

**Core Features:**
- Data encoding via `value` prop
- SVG rendering support
- Size customization
- Color control
- Logo/icon overlay capability

### Ant Design Specializations

**Status Management System:**
- Four states: active, expired, loading, scanned
- Custom status rendering (v5.20.0+)
- Workflow-oriented design for real-world scanning scenarios

**Error Correction:**
- L level (7% recovery)
- M level (15% recovery - default)
- Q level (25% recovery)
- H level (30% recovery)

**Dual Rendering:**
- Canvas for performance (default)
- SVG for scalability
- Type selection via prop

**Batch Generation:**
- Array value support
- Multiple QR codes from single component

**Transparency Default:**
- Background defaults to transparent
- Better integration with varied backgrounds

### Chakra UI Specializations

**Compound Architecture:**
- `QrCode.Root` - State provider
- `QrCode.Frame` - Layout container
- `QrCode.Pattern` - Visual rendering

**CSS Variable System:**
- `--qr-code-size` for dimensions
- `--qr-code-overlay-size` for logos
- Responsive design friendly

**Color Inheritance:**
- Uses `fill: currentColor`
- Theme-aware coloring
- No explicit color props needed

**Ark UI Foundation:**
- Built on battle-tested Ark UI
- Solid encoding implementation
- Minimal API surface

## Pattern Correlations

### When Error Correction exists → Multiple levels offered
- 1 of 1 framework (100%) with error correction offers L/M/Q/H levels
- Framework: Ant Design
- Pattern: Granular control over data recovery

### When Status Management exists → Workflow features present
- 1 of 1 framework (100%) with status has download and custom rendering
- Framework: Ant Design
- Pattern: Status implies complete workflow support

### When Compound Architecture exists → CSS variables used
- 1 of 1 framework (100%) with compound components uses CSS vars
- Framework: Chakra UI
- Pattern: Modern composition patterns pair with CSS customization

## Implementation Notes

### Rendering Strategies

**SVG-based (Universal):**
- Scalable to any size without quality loss
- Crisp rendering for print
- Better for responsive design
- Both frameworks support

**Canvas-based (Ant Design only):**
- Better performance for large-scale generation
- Raster-based output
- Default in Ant Design
- Trade-off: scalability vs speed

### Architecture Philosophies

**Ant Design - Feature-Rich Monolith:**
- Single component with comprehensive props
- All features accessible via props API
- Status management built-in
- Batch generation native
- More configuration surface area

**Chakra UI - Composable Minimal:**
- Compound component pattern
- Minimal required props (just `value`)
- CSS-based customization
- Composition for advanced features
- Smaller API surface

### Color Customization Approaches

**Ant Design:**
```jsx
<QRCode
  value="data"
  color="#1890ff"
  bgColor="#ffffff"
/>
```
- Explicit color props
- Separate foreground/background control
- Direct color specification

**Chakra UI:**
```jsx
<Box color="blue.600">
  <QrCode.Root value="data">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
</Box>
```
- Inherits from parent color
- Theme-aware via Chakra system
- Uses `fill: currentColor`

### Size Control Approaches

**Ant Design:**
```jsx
<QRCode value="data" size={200} />
```
- Direct size prop
- Number in pixels
- Simple and explicit

**Chakra UI:**
```jsx
<Box style={{ "--qr-code-size": "200px" }}>
  <QrCode.Root value="data">
    {/* ... */}
  </QrCode.Root>
</Box>
```
- CSS custom property
- Responsive design friendly
- Requires wrapper for customization

### Logo Overlay Patterns

**Ant Design:**
```jsx
<QRCode
  value="data"
  icon="https://example.com/logo.png"
  iconSize={64}
/>
```
- Native icon prop
- Built-in sizing control
- Automatic positioning

**Chakra UI:**
```jsx
<QrCode.Frame position="relative">
  <QrCode.Pattern />
  <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
    <Image src="/logo.png" />
  </Box>
</QrCode.Frame>
```
- Composition-based
- Manual positioning required
- Full layout control

## Comparison Insights

### Feature Completeness

**Ant Design Advantages:**
- Error correction level control
- Status management system
- Batch generation support
- Built-in download capability
- Canvas rendering option
- Background color control
- Border toggle

**Chakra UI Advantages:**
- Compound component flexibility
- Theme system integration
- Smaller bundle (fewer features)
- CSS variable responsiveness
- Cleaner composition patterns

### Use Case Alignment

**Ant Design Better For:**
- Workflow-heavy applications (scanning, expiration, confirmation)
- Applications needing error correction control
- Batch QR code generation
- Enterprise applications with complex requirements

**Chakra UI Better For:**
- Simple QR code needs
- Applications already using Chakra UI
- Minimal API surface preference
- Composition-heavy architectures

### API Philosophy

**Ant Design:**
- Prop-driven configuration
- Feature-complete out of box
- More learning curve
- All features discoverable via props

**Chakra UI:**
- Composition-driven customization
- Minimal core, extend via composition
- Steeper initial setup for advanced features
- Follows Chakra v3 patterns

## Limited Ecosystem Observation

**Important Note:** Only 2 of the surveyed frameworks provide QR Code components. This indicates:

1. **Specialized Functionality:** QR codes considered optional/specialized
2. **External Library Preference:** Most apps use dedicated QR libraries
3. **Not Core UI:** Not seen as fundamental UI component
4. **Implementation Burden:** Complex encoding logic discourages inclusion

### Other Frameworks

**Not Found In:**
- MUI
- Mantine
- HeroUI
- Radix UI
- ShadCN
- Nuxt UI
- PrimeReact
- Semantic UI Classic

**Implications:**
- QR Code components are optional additions
- Consider external library integration vs native implementation
- Low ecosystem consensus on need

## Raw Data

Individual framework reports:
- [Ant Design](./ant-design/usage-patterns.md)
- [Chakra UI](./chakra-ui/usage-patterns.md)
