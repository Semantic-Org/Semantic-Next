# MUI - Divider Usage Patterns

## Component URL
https://mui.com/material-ui/react-divider/
Status: ⚠️ Unable to directly fetch (network restrictions), data gathered via web search

## Documentation Quality
Comprehensive - MUI provides detailed documentation with API reference, multiple examples, accessibility guidance, and theming information.

## Component Definition
- **Core purpose**: Provides visual separation between content sections or list items, rendering as a thin horizontal or vertical line that can optionally contain text, chips, or other React components.
- **Mental model**: A flexible separator element that can be styled and positioned in various ways, ranging from a simple line to a labeled section divider with content in the middle.
- **Semantic meaning**: Communicates logical separation or grouping of content. By default uses `<hr>` element for horizontal dividers (semantic separator), but can be customized to `<div>` or other elements as needed.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Supports children content in v5+. Text can be placed within divider with automatic lines on both sides. Example: `<Divider>CENTER</Divider>` |
| Icon support | ✅ | Can contain any React node including icons. Commonly used in vertical toolbars with format icons |
| Media support | ✅ | Supports any React component as children, including images or media elements |
| Custom content | ✅ | Full support for custom React components. Example: `<Divider><Chip label="Chip" size="small" /></Divider>` |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal | ✅ | Default orientation. Renders as `<hr>` element with implicit separator role |
| Vertical | ✅ | Set via `orientation="vertical"`. Renders as `<div>` with appropriate ARIA attributes per WAI-ARIA spec. Requires `flexItem` prop when used in flex containers |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | No built-in loading state |
| Disabled | ❌ | No disabled state (not applicable to separators) |
| Light variant | ✅ | `light` boolean prop provides lighter color variant for use on dark backgrounds or when subtle separation is needed |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | No explicit size props. Size controlled via CSS/theme customization using `sx` prop or theme overrides |
| Spacing control | ✅ | Three variants control spacing/width: `"fullWidth"` (default - full width), `"inset"` (indented from edges), `"middle"` (centered with margins on both sides) |
| Visual styles | ✅ | Styled via theme and `sx` prop. Default is solid line. Can customize border style, color, height/thickness |
| Color options | ✅ | `light` boolean prop for lighter variant. Full color control via `sx` prop or theme customization |
| Alignment | ✅ | `textAlign` prop for content alignment: `"left"`, `"center"` (default), `"right"` |

## Code Examples

### Basic Horizontal Dividers
```jsx
import Divider from '@mui/material/Divider';

// Simple divider (renders as <hr>)
<Divider />

// With centered text
<Divider>CENTER</Divider>

// With aligned text
<Divider textAlign="left">LEFT</Divider>
<Divider textAlign="right">RIGHT</Divider>
```

### Divider with Custom Content
```jsx
// With Chip component
<Divider>
  <Chip label="Chip" size="small" />
</Divider>

// With Typography (recommended accessibility pattern)
<Divider component="div" role="presentation">
  <Typography>Text element</Typography>
</Divider>
```

### Vertical Dividers
```jsx
// In a flex container (toolbar example)
<Box sx={{ display: 'flex' }}>
  <FormatBoldIcon />
  <Divider orientation="vertical" flexItem />
  <FormatItalicIcon />
</Box>

// With middle variant
<Divider orientation="vertical" variant="middle" flexItem />
```

### Variant Examples
```jsx
// Full width (default)
<Divider variant="fullWidth" />

// Inset - indented from edges
<Divider variant="inset" />

// Middle - centered with margins
<Divider variant="middle" />
```

### List Dividers
```jsx
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';

<List>
  <ListItem>Item 1</ListItem>
  <Divider component="li" />
  <ListItem>Item 2</ListItem>
</List>
```

### Styling with sx Prop
```jsx
// Custom color and thickness
<Divider sx={{
  borderColor: 'primary.main',
  borderBottomWidth: 2
}} />

// Custom background for divider with content
<Divider sx={{
  '&::before, &::after': {
    borderColor: 'secondary.light',
  },
}} />
```

### Light Variant for Dark Backgrounds
```jsx
<Divider light />
```

### Absolute Positioning
```jsx
// Absolutely positioned divider
<Divider absolute />
```

## Complete Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Content to display within the divider (v5+) |
| `orientation` | `'horizontal'` \| `'vertical'` | `'horizontal'` | The component orientation |
| `variant` | `'fullWidth'` \| `'inset'` \| `'middle'` | `'fullWidth'` | Controls the divider's width behavior |
| `textAlign` | `'left'` \| `'center'` \| `'right'` | `'center'` | Text alignment for content within divider |
| `flexItem` | boolean | `false` | If true, adds appropriate height styles for flex containers |
| `light` | boolean | `false` | If true, uses lighter color variant |
| `absolute` | boolean | `false` | If true, positions divider absolutely within container |
| `component` | elementType | `'hr'` | Component used for root node |
| `sx` | object | - | System prop for custom styling |
| `role` | string | - | ARIA role (use `"presentation"` for decorative dividers) |

## CSS Classes for Customization

- `.MuiDivider-root` - Root element
- `.MuiDivider-absolute` - When `absolute={true}`
- `.MuiDivider-fullWidth` - When `variant="fullWidth"`
- `.MuiDivider-inset` - When `variant="inset"`
- `.MuiDivider-middle` - When `variant="middle"`
- `.MuiDivider-light` - When `light={true}`
- `.MuiDivider-vertical` - When `orientation="vertical"`
- `.MuiDivider-flexItem` - When `flexItem={true}`
- `.MuiDivider-withChildren` - When horizontal divider has content
- `.MuiDivider-withChildrenVertical` - When vertical divider has content
- `.MuiDivider-textAlignLeft` - When `textAlign="left"`
- `.MuiDivider-textAlignRight` - When `textAlign="right"`

## Notable Features

### Children Content Support (v5+)
- **Major API Evolution**: MUI v4 did not support children in Divider. This was added in v5, making it much easier to create dividers with embedded content without custom workarounds.
- **Flexible Content**: Can contain any React node - text, icons, chips, badges, or custom components.

### Semantic HTML & Accessibility
- **Smart Element Selection**: Horizontal dividers render as `<hr>` (semantic separator), vertical render as `<div>` to comply with WAI-ARIA specifications.
- **Screen Reader Considerations**: By default announced as "Horizontal Splitter" or "Vertical Splitter" by screen readers.
- **Recommended Pattern for Decorative Use**: When wrapping content, use `component="div"` and `role="presentation"` to prevent redundant announcements while preserving semantics of nested elements.

### Flex Container Integration
- **`flexItem` Prop**: Critical for vertical dividers in flex layouts - ensures proper height calculation.
- **Common Use Case**: Toolbar separators between icon buttons.

### Variant System
- **Three Width Behaviors**:
  - `fullWidth` - Extends to container edges (default)
  - `inset` - Indented from left/right edges (subtle separation)
  - `middle` - Centered with margins (balanced spacing)
- **Works with Both Orientations**: Variants can combine with vertical orientation.

### Positioning Flexibility
- **Absolute Positioning**: `absolute` prop allows overlay effects and decorative styling.
- **List Integration**: `component="li"` makes divider a valid list item for proper HTML structure.

### Theming Integration
- **Theme Customization**: Default props can be overridden via `MuiDivider` in theme configuration.
- **Style Overrides**: Full access to CSS classes for global or scoped customization.
- **`sx` Prop**: Direct inline styling with theme-aware values.

## Research Notes

### Documentation Access
- Unable to directly fetch documentation due to network restrictions/enterprise security policies.
- Successfully gathered comprehensive information via web search, including current v5 documentation and API details.

### Framework Approach Observations

1. **Progressive Enhancement**: MUI evolved the Divider API significantly from v4 to v5, adding children support which was a major DX improvement.

2. **Accessibility-First Design**: The framework makes thoughtful decisions about HTML semantics (hr vs div based on orientation) to ensure proper accessibility by default.

3. **Composition Over Configuration**: Rather than providing numerous built-in style props, MUI provides a flexible foundation with `sx` prop and theme system for customization.

4. **Practical Variants**: The three variant options (fullWidth, inset, middle) cover the most common spacing/positioning needs without overwhelming users with options.

5. **Flex-Aware**: The `flexItem` prop shows MUI's attention to modern layout patterns and common pain points developers face.

6. **Content Flexibility**: Modern version (v5+) allows any React node as children, making the component extremely versatile - from simple text labels to complex chip arrays.

### Comparison Points for Implementation

- **Prop Names**: MUI uses `orientation` (not `vertical` boolean) and `textAlign` (standard CSS terminology)
- **Variant Naming**: `inset` and `middle` are intuitive names for spacing behaviors
- **Light Variant**: Boolean `light` prop is simpler than color string values
- **Children Support**: Direct children (not `content` prop) feels more natural in React
- **Accessibility Guidance**: Strong documentation around proper ARIA usage

### Missing Features (by design)
- No loading/disabled states (not applicable to dividers)
- No explicit size prop (handled via styling)
- No dashed/dotted style props (handled via sx/theme)
- No color string prop (uses light boolean + sx for customization)

This minimalist API surface keeps the component focused while remaining highly customizable through the styling system.
