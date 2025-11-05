# Material-UI (MUI) - Badge Component Usage Patterns

## Research Metadata
- **Framework**: Material-UI (MUI) v5+
- **Component**: Badge
- **Documentation URL**: https://mui.com/material-ui/react-badge/
- **Research Date**: 2025-11-04
- **URL Status**: Accessible
- **Note**: MUI has Badge but not Tag (separate from Label/Chip components)

---

## Component Definition

### Badge Component
**Purpose**: A notification indicator overlaid on other elements, used for displaying counts, status indicators, or alerts.

**Mental Model**: Badge is an **overlay notification** component designed to:
- Display numerical counts on UI elements (icons, avatars, buttons)
- Show status indicators using dot variant
- Provide visual notification cues
- Communicate state changes or pending actions

**Key Characteristic**: Always wraps another element; provides overlay positioning with customizable anchor points and overlap modes.

---

## Material Design Philosophy

MUI Badge follows Material Design 3 specifications:
- **Standard Badge**: 20px height circle with numerical content
- **Dot Badge**: 8px diameter circle for status indication
- **Positioning**: Precisely calculated offsets based on overlap mode
- **Color System**: Integrates with theme palette (primary, secondary, error, etc.)
- **Transitions**: Smooth visibility and content changes
- **Typography**: Small size (12px) for optimal readability at badge scale

---

## Badge Variants & Types

### 1. **Standard Badge** (Level 1 - Core)
**Support**: Full
**Description**: Default badge displaying numerical or text content

```jsx
<Badge badgeContent={4} color="primary">
  <MailIcon />
</Badge>
```

**Key Features**:
- Displays any number or short text
- Hides when `badgeContent` is `null`, `undefined`, or `0` (unless `showZero`)
- Top-right positioning by default
- Automatic overflow handling with `max` prop

### 2. **Dot Variant** (Level 1 - Core)
**Support**: Full
**Description**: Minimal circular indicator without text content

```jsx
<Badge variant="dot" color="success">
  <Avatar />
</Badge>
```

**Use Cases**:
- Online/offline status
- Unread indicator (binary state)
- Notification presence without count
- Processing/loading state

**Characteristics**:
- 8px diameter circle
- No content displayed
- Same positioning system as standard
- All color variants supported

---

## Badge API Props

### Core Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **badgeContent** | `ReactNode` | - | Content displayed in badge | Level 1 |
| **variant** | `'standard' \| 'dot'` | `'standard'` | Badge style variant | Level 1 |
| **color** | `'default' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'default'` | Theme color | Level 1 |
| **max** | `number` | `99` | Maximum count to show before displaying "+" | Level 1 |
| **showZero** | `boolean` | `false` | Show badge when badgeContent is 0 | Level 1 |
| **invisible** | `boolean` | `false` | Manually control badge visibility | Level 1 |
| **children** | `ReactNode` | - | Element to overlay badge on | Level 1 |

### Positioning Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **anchorOrigin** | `{ vertical: 'top' \| 'bottom', horizontal: 'left' \| 'right' }` | `{ vertical: 'top', horizontal: 'right' }` | Badge position anchor | Level 1 |
| **overlap** | `'circular' \| 'rectangular'` | `'rectangular'` | Shape of wrapped element affects offset | Level 1 |

### Styling Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **component** | `elementType` | `'span'` | Root component element | Level 2 |
| **sx** | `object` | - | Theme-aware style overrides | Level 1 |
| **classes** | `object` | - | CSS class overrides | Level 2 |

---

## Color System

### Theme-Integrated Colors (Level 1)
**Support**: Full - 7 preset colors

```jsx
<Badge color="default" badgeContent={4}><Icon /></Badge>
<Badge color="primary" badgeContent={4}><Icon /></Badge>
<Badge color="secondary" badgeContent={4}><Icon /></Badge>
<Badge color="error" badgeContent={4}><Icon /></Badge>
<Badge color="warning" badgeContent={4}><Icon /></Badge>
<Badge color="info" badgeContent={4}><Icon /></Badge>
<Badge color="success" badgeContent={4}><Icon /></Badge>
```

**Color Semantics**:
- **default** - Gray/neutral (not important)
- **primary** - Main brand color (general notifications)
- **secondary** - Accent color (alternative notifications)
- **error** - Red (errors, critical alerts)
- **warning** - Orange/yellow (warnings, caution)
- **info** - Blue (informational)
- **success** - Green (completed, success states)

**Material Design Alignment**: Colors map directly to theme palette, ensuring consistency across the application.

---

## Positioning System

### anchorOrigin Configuration (Level 1)
**Support**: Full - 4 position combinations

The `anchorOrigin` prop positions the badge relative to the wrapped element:

```jsx
// Top-right (default)
<Badge anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
  <Avatar />
</Badge>

// Top-left
<Badge anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
  <Avatar />
</Badge>

// Bottom-right
<Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
  <Avatar />
</Badge>

// Bottom-left
<Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
  <Avatar />
</Badge>
```

**Position Values**:
- **vertical**: `'top'` | `'bottom'`
- **horizontal**: `'left'` | `'right'`

**Default**: Top-right corner (most common notification pattern)

### Overlap Modes (Level 1)
**Support**: Full - 2 modes

Controls offset calculation based on wrapped element shape:

```jsx
// Circular overlap (for avatars, circular icons)
<Badge overlap="circular" badgeContent={4}>
  <Avatar src="/avatar.jpg" />
</Badge>

// Rectangular overlap (for buttons, cards, rectangular elements)
<Badge overlap="rectangular" badgeContent={4}>
  <Button>Action</Button>
</Badge>
```

**Overlap Behavior**:
- **circular**: Badge overlaps circular target more (less offset)
- **rectangular**: Badge has larger offset to avoid covering content

**Material Design Rationale**: Different shapes require different overlap amounts to maintain visual balance and content visibility.

---

## Count Display Features

### Maximum Count with Overflow (Level 1)
**Support**: Full
**Description**: Display "max+" when count exceeds threshold

```jsx
// Default max (99)
<Badge badgeContent={120}>
  <MailIcon />
</Badge>
// Displays: "99+"

// Custom max
<Badge badgeContent={1234} max={999}>
  <NotificationsIcon />
</Badge>
// Displays: "999+"

// Low max for compact display
<Badge badgeContent={15} max={9}>
  <Icon />
</Badge>
// Displays: "9+"
```

**Default**: `max={99}` (industry standard for notification counts)

**Use Cases**:
- Prevent badge from becoming too wide
- Communicate "many" without exact precision
- Maintain consistent badge size

### Show Zero Feature (Level 1)
**Support**: Full
**Description**: Control visibility when count is zero

```jsx
// Default: hides badge when count is 0
<Badge badgeContent={0}>
  <MailIcon />
</Badge>
// Badge is hidden

// Show zero explicitly
<Badge badgeContent={0} showZero>
  <MailIcon />
</Badge>
// Displays: "0"
```

**Use Cases**:
- Explicitly show "no notifications" state
- Distinguish between "zero" and "unknown/unloaded"
- Consistent badge presence for layout stability

---

## Visibility Control

### Invisible Property (Level 1)
**Support**: Full
**Description**: Manually control badge visibility programmatically

```jsx
const [invisible, setInvisible] = useState(false);

<Badge badgeContent={4} invisible={invisible}>
  <Icon />
</Badge>

<Button onClick={() => setInvisible(!invisible)}>
  Toggle Visibility
</Button>
```

**Use Cases**:
- Animate badge appearance/disappearance
- Conditional visibility based on user preferences
- "Mark as read" interactions

**Behavior**:
- `invisible={true}`: Badge renders with `aria-hidden="true"` but takes no space
- Different from `badgeContent={null}` which prevents rendering entirely

---

## Badge Content Customization

### Content Types (Level 1)
**Support**: Full - Any ReactNode

```jsx
// Numbers (most common)
<Badge badgeContent={42}>
  <Icon />
</Badge>

// Text
<Badge badgeContent="NEW">
  <Icon />
</Badge>

// Small icons (advanced)
<Badge badgeContent={<DoneIcon fontSize="small" />}>
  <Icon />
</Badge>
```

**Best Practices**:
- Keep content short (1-4 characters for readability)
- Numbers are most common and expected
- Text should be concise ("NEW", "!")
- Icons should be very small

### Dynamic Content Updates (Level 1)
**Support**: Full - Reactive updates

```jsx
const [count, setCount] = useState(0);

<Badge badgeContent={count} color="primary">
  <MailIcon />
</Badge>

// Count updates automatically trigger badge re-render
```

**Material Design**: Badge includes smooth transitions for content changes.

---

## Component Composition Patterns

### Wrapping Elements (Level 1)
**Pattern**: Badge wraps target element via `children` prop

```jsx
// Icon
<Badge badgeContent={4}>
  <MailIcon />
</Badge>

// Avatar
<Badge badgeContent={12} color="error">
  <Avatar alt="User Name" src="/avatar.jpg" />
</Badge>

// Button
<Badge badgeContent={2} overlap="rectangular">
  <Button variant="contained">Cart</Button>
</Badge>

// Custom element
<Badge badgeContent={5}>
  <div className="custom-element">
    Content
  </div>
</Badge>
```

**Key Pattern**: Badge always needs exactly one child element to position against.

### Nested Badges (Level 3 - Advanced)
**Support**: Not recommended
**Note**: MUI documentation doesn't show nested badge patterns (multiple badges on same element).

---

## Code Examples

### Basic Notification Badge
```jsx
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

function NotificationExample() {
  return (
    <Badge badgeContent={4} color="primary">
      <MailIcon />
    </Badge>
  );
}
```

### Dot Badge for Status
```jsx
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

function OnlineStatus() {
  return (
    <Badge
      variant="dot"
      color="success"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      overlap="circular"
    >
      <Avatar alt="User" src="/avatar.jpg" />
    </Badge>
  );
}
```

### Max Count with Overflow
```jsx
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

function UnreadNotifications({ count }) {
  return (
    <Badge badgeContent={count} max={99} color="error">
      <NotificationsIcon />
    </Badge>
  );
}

// Usage:
<UnreadNotifications count={145} />
// Displays: "99+"
```

### Dynamic Visibility Control
```jsx
import { useState } from 'react';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';

function ToggleBadgeExample() {
  const [invisible, setInvisible] = useState(false);

  return (
    <>
      <Badge badgeContent={4} color="primary" invisible={invisible}>
        <MailIcon />
      </Badge>
      <Button onClick={() => setInvisible(!invisible)}>
        {invisible ? 'Show' : 'Hide'} Badge
      </Button>
    </>
  );
}
```

### All Position Variants
```jsx
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

function PositionExample() {
  return (
    <Stack direction="row" spacing={2}>
      <Badge
        badgeContent={4}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Avatar>TR</Avatar>
      </Badge>

      <Badge
        badgeContent={4}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Avatar>TL</Avatar>
      </Badge>

      <Badge
        badgeContent={4}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar>BR</Avatar>
      </Badge>

      <Badge
        badgeContent={4}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Avatar>BL</Avatar>
      </Badge>
    </Stack>
  );
}
```

### All Color Variants
```jsx
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Stack from '@mui/material/Stack';

function ColorExample() {
  return (
    <Stack direction="row" spacing={2}>
      <Badge badgeContent={4} color="default"><MailIcon /></Badge>
      <Badge badgeContent={4} color="primary"><MailIcon /></Badge>
      <Badge badgeContent={4} color="secondary"><MailIcon /></Badge>
      <Badge badgeContent={4} color="error"><MailIcon /></Badge>
      <Badge badgeContent={4} color="warning"><MailIcon /></Badge>
      <Badge badgeContent={4} color="info"><MailIcon /></Badge>
      <Badge badgeContent={4} color="success"><MailIcon /></Badge>
    </Stack>
  );
}
```

### Show Zero Example
```jsx
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

function ShowZeroExample() {
  return (
    <Stack direction="row" spacing={2}>
      {/* Hidden when zero (default) */}
      <Badge badgeContent={0}>
        <MailIcon />
      </Badge>

      {/* Visible when zero */}
      <Badge badgeContent={0} showZero>
        <MailIcon />
      </Badge>
    </Stack>
  );
}
```

### Overlap Mode Comparison
```jsx
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

function OverlapExample() {
  return (
    <Stack direction="row" spacing={4}>
      {/* Circular overlap for avatars */}
      <Badge badgeContent={4} overlap="circular" color="primary">
        <Avatar alt="User" src="/avatar.jpg" />
      </Badge>

      {/* Rectangular overlap for buttons */}
      <Badge badgeContent={2} overlap="rectangular" color="error">
        <Button variant="contained">Cart</Button>
      </Badge>
    </Stack>
  );
}
```

---

## Pattern Support Levels Summary

| Pattern | Support Level | Adoption |
|---------|---------------|----------|
| Standard badge with count | Level 1 | Core feature |
| Dot variant | Level 1 | Core feature |
| Max count with overflow | Level 1 | Core feature |
| Show zero control | Level 1 | Core feature |
| Invisible control | Level 1 | Core feature |
| Color variants (7 presets) | Level 1 | Core feature |
| Position variants (anchorOrigin) | Level 1 | Core feature |
| Overlap modes (circular/rectangular) | Level 1 | Core feature |
| Custom badge content | Level 1 | Core feature |
| Component customization | Level 2 | Common |

---

## MUI-Specific Features

### Theme Integration (Level 1)
**Support**: Full
**Description**: Badge integrates deeply with MUI theme system

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

<ThemeProvider theme={theme}>
  <Badge badgeContent={4} color="primary">
    <Icon />
  </Badge>
</ThemeProvider>
```

Colors automatically adapt to theme palette changes.

### sx Prop for Custom Styling (Level 1)
**Support**: Full
**Description**: Theme-aware style overrides

```jsx
<Badge
  badgeContent={4}
  sx={{
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
  }}
>
  <Avatar />
</Badge>
```

**CSS Classes Available**:
- `.MuiBadge-root` - Root element
- `.MuiBadge-badge` - Badge element
- `.MuiBadge-dot` - Dot variant
- `.MuiBadge-standard` - Standard variant

---

## Accessibility Features

### Screen Reader Support (Level 1)
**Support**: Full
**Implementation**:
- Badge content is readable by screen readers when visible
- `invisible={true}` adds `aria-hidden="true"`
- Semantic HTML structure maintained

### Color Accessibility (Level 1)
**Best Practice**: Color shouldn't be the only indicator of meaning

```jsx
// Good: Combines color with text
<Badge badgeContent="NEW" color="error">
  <Icon />
</Badge>

// Good: Status with text label nearby
<Stack direction="row" spacing={1} alignItems="center">
  <Badge variant="dot" color="success">
    <Avatar />
  </Badge>
  <Typography variant="body2">Online</Typography>
</Stack>
```

### Keyboard Navigation
**Note**: Badges are typically decorative/informative overlays, not interactive elements. If badge triggers an action, the parent element should be keyboard accessible.

---

## Common Usage Patterns

### 1. **Notification Counts** (Level 1)
Display unread message/notification counts on icons

```jsx
<Badge badgeContent={messages.length} color="primary">
  <MailIcon />
</Badge>
```

### 2. **Status Indicators** (Level 1)
Show online/offline or processing states using dot variant

```jsx
<Badge variant="dot" color={user.online ? 'success' : 'default'}>
  <Avatar src={user.avatar} />
</Badge>
```

### 3. **Shopping Cart Count** (Level 1)
Display items in cart with rectangular overlap

```jsx
<Badge badgeContent={cart.items.length} color="error" overlap="rectangular">
  <IconButton>
    <ShoppingCartIcon />
  </IconButton>
</Badge>
```

### 4. **Conditional Visibility** (Level 1)
Show badge only when there are notifications

```jsx
<Badge
  badgeContent={count}
  invisible={count === 0}
  color="primary"
>
  <NotificationsIcon />
</Badge>
```

### 5. **Mark as Read Pattern** (Level 2)
Toggle badge visibility on user action

```jsx
const [hasUnread, setHasUnread] = useState(true);

<IconButton onClick={() => setHasUnread(false)}>
  <Badge variant="dot" invisible={!hasUnread} color="error">
    <MailIcon />
  </Badge>
</IconButton>
```

---

## Material Design Alignment

### Size Specifications
- **Standard Badge**: 20px height, 6px padding horizontal
- **Dot Badge**: 8px diameter
- **Font Size**: 12px (0.75rem)
- **Font Weight**: 500 (medium)

### Positioning Offsets
Calculated based on:
- `anchorOrigin` values (top/bottom, left/right)
- `overlap` mode (circular vs rectangular)
- Badge variant (standard vs dot)

**Circular Overlap Offsets** (more overlap):
- Top-right: `transform: translate(50%, -50%)`
- Bottom-right: `transform: translate(50%, 50%)`

**Rectangular Overlap Offsets** (less overlap):
- Top-right: `transform: translate(100%, -50%)`
- Bottom-right: `transform: translate(100%, 50%)`

### Transitions
- **Content Change**: Smooth scale transition (0.3s)
- **Visibility**: Fade + scale transition
- **Material Motion**: Follows Material Design easing curves

### Elevation
Badges don't use elevation (shadow) by default but can be added via `sx` prop for custom designs.

---

## Comparison with Other MUI Components

### Badge vs Chip
| Aspect | Badge | Chip |
|--------|-------|------|
| **Purpose** | Overlay notification | Standalone label/tag |
| **Position** | Overlays other elements | Standalone inline element |
| **Interaction** | Typically non-interactive | Can be clickable/deletable |
| **Size** | Small (20px height) | Medium (32px height) |
| **Content** | Short (1-4 chars) | Longer text, icons |

**Use Badge when**: Showing counts/status on existing UI elements
**Use Chip when**: Displaying tags, filters, or removable selections

### Badge vs Tooltip
| Aspect | Badge | Tooltip |
|--------|-------|---------|
| **Visibility** | Always visible (when content exists) | Shown on hover/focus |
| **Purpose** | Count/status indicator | Additional information |
| **Interaction** | No interaction required | Requires hover/focus |

---

## Implementation Philosophy

### Badge Design Philosophy
MUI's Badge component embodies a **notification-overlay** approach:
- Primary use: Numerical notification counts
- Secondary use: Status indication (dot variant)
- Always positioned relative to another element
- Minimal visual footprint to avoid overwhelming UI
- Automatic visibility management based on content
- Theme-integrated colors for consistency

### Material Design Principles Applied
1. **Hierarchy**: Badge draws attention without dominating
2. **Responsive**: Adjusts position based on parent element shape
3. **Accessible**: Maintains readability at small size
4. **Consistent**: Follows Material Design spacing and color systems
5. **Purposeful Motion**: Transitions enhance rather than distract

---

## Limitations & Constraints

### Content Size Limitations
**Constraint**: Badges should contain 1-4 characters for optimal readability
**Reason**: Small size (20px height) limits content space
**Recommendation**: Use `max` prop to prevent overflow

### No Built-in Positioning Offset
**Note**: MUI doesn't provide numeric offset props like some frameworks
**Workaround**: Use `sx` prop with transform for custom positioning

```jsx
<Badge
  badgeContent={4}
  sx={{
    '& .MuiBadge-badge': {
      transform: 'translate(10px, -10px)',
    },
  }}
>
  <Icon />
</Badge>
```

### Single Child Requirement
**Constraint**: Badge requires exactly one child element
**Reason**: Positioning logic anchors to single child dimensions

```jsx
// ❌ Invalid: Multiple children
<Badge badgeContent={4}>
  <Icon />
  <Icon />
</Badge>

// ✅ Valid: Single child wrapper
<Badge badgeContent={4}>
  <div>
    <Icon />
    <Icon />
  </div>
</Badge>
```

---

## Research Notes

### Data Collection Method
- Direct fetch from official MUI documentation
- Extracted from https://mui.com/material-ui/react-badge/
- Research date: 2025-11-04
- URL status: Accessible

### Documentation Quality
- Comprehensive API documentation
- Clear prop tables with types and defaults
- Extensive code examples
- Material Design alignment notes included
- Accessibility guidance provided

### MUI Note: No Tag Component
**Important**: MUI does not have a separate "Tag" component. Related components are:
- **Chip**: Closest to "tag" functionality (labels, filters, removable items)
- **Label**: Form labels only (not a general labeling component)
- **Badge**: Notification overlays (not standalone labels)

For tag/label research, investigate MUI Chip component separately.

---

## Recommendations for Semantic UI

### Badge Implementation Priority

**Must-Have (Level 1)**:
1. ✅ Standard badge with numerical content
2. ✅ Dot variant for status indication
3. ✅ Max count with "+" overflow display
4. ✅ Show zero option
5. ✅ Invisible/visibility control
6. ✅ Color variants (error, success, warning, info, primary, secondary)
7. ✅ Position variants (top/bottom, left/right combinations)
8. ✅ Overlap modes (circular/rectangular)

**Should-Have (Level 2)**:
1. Custom content beyond numbers (text, small icons)
2. Component/element type customization
3. Transition animations for content changes

**Consider**:
- Theme integration via design tokens
- Extended positioning with numeric offsets (not in MUI by default)
- Size variants beyond standard/dot (small, large)

### Semantic UI Differentiators

**Natural Language Patterns**:
```html
<!-- Consider natural language alternatives -->
<ui-badge count="5">...</ui-badge>
<!-- vs MUI: badgeContent={5} -->

<ui-badge dot>...</ui-badge>
<!-- vs MUI: variant="dot" -->

<ui-badge position="top-right">...</ui-badge>
<!-- vs MUI: anchorOrigin={{ vertical: 'top', horizontal: 'right' }} -->
```

**Settings Architecture**:
- Leverage reactive settings for count updates
- Use settings for color, variant, position configuration
- Automatic visibility based on count (align with MUI behavior)

**Slot-Based Composition**:
- Default slot for wrapped element (MUI's children prop)
- Named slot for custom badge content if needed

### Key Insights

1. **Overlay-Only**: MUI Badge is exclusively an overlay component (never standalone)
2. **Binary Variant System**: Only two variants (standard, dot) keeps API simple
3. **Smart Visibility**: Automatic hiding when content is null/undefined/0 is UX pattern
4. **Material Design Precision**: Overlap mode affects positioning offset calculation
5. **Theme-Centric**: All colors derive from theme palette (not arbitrary colors)

### Pattern Adoption Recommendation

**Adopt from MUI**:
- ✅ Overlay-only pattern (clearer component purpose)
- ✅ Max count with overflow handling
- ✅ Show zero explicit control
- ✅ Invisible prop for programmatic control
- ✅ Overlap mode for positioning precision
- ✅ Dot variant for status indication

**Adapt for Semantic UI**:
- 🔄 anchorOrigin → Simpler `position` attribute with combined values
- 🔄 badgeContent → More intuitive `content` or direct slot usage
- 🔄 Color system → Map to Semantic UI design tokens
- 🔄 Consider natural language for overlap: `overlap="circle"` vs `overlap="circular"`

**Skip/Reconsider**:
- ❌ Component-level theming complexity (if not using theme provider pattern)
- ❌ sx prop pattern (use standard CSS/design tokens instead)

---

## Cross-Framework Pattern Validation

Comparing with Ant Design Badge research:
- **Overlay Mode**: Both MUI and Ant Design support wrapping children ✅
- **Dot Variant**: Both support dot indicator ✅
- **Max Count**: Both support overflow with "+" display ✅
- **Show Zero**: Both support explicit zero display ✅
- **Color Variants**: Both offer status-based colors ✅
- **Position Control**: Both offer position customization ✅

**MUI Unique Features**:
- Overlap mode (circular/rectangular) for offset calculation
- Invisible prop for programmatic visibility
- No ribbon variant (Ant Design has Badge.Ribbon)
- No standalone status badges (Ant Design has status prop)

**Consistency Level**: High (90%+ pattern overlap)
**Conclusion**: Badge overlay patterns are standardized across modern frameworks.
