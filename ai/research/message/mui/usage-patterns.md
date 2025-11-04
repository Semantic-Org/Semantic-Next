# MUI - Alert Usage Patterns

## Component URL
https://mui.com/material-ui/react-alert/
Status: ⚠️ Unable to directly fetch (network restrictions), data gathered via web search

## Documentation Quality
Comprehensive - MUI provides detailed documentation with API reference, multiple examples, accessibility guidance, and theming information.

## Component Definition
- **Core purpose**: Displays important messages to users with contextual severity levels (success, info, warning, error) and optional actions. Based on Material Design specification for alerts and feedback messages.
- **Mental model**: A feedback component that combines text content, optional title, contextual icon, and optional actions (like close or undo buttons) to communicate status or important information to users.
- **Semantic meaning**: Communicates feedback, status updates, or important information to users. Not to be confused with alert dialogs (ARIA) which interrupt users for responses. Alerts are announced to screen readers when dynamically displayed.

## Display Patterns

### Severity Types
| Pattern | Present | Details |
|---------|---------|---------|
| Success | ✅ | Green theme, checkmark icon by default. Indicates successful completion of actions or positive status |
| Info | ✅ | Blue theme, info icon by default. Displays informational messages or neutral status updates |
| Warning | ✅ | Orange/yellow theme, warning icon by default. Alerts users to potential issues or important notices |
| Error | ✅ | Red theme, error icon by default. Communicates errors, failures, or critical issues |

### Variant Options
| Pattern | Present | Details |
|---------|---------|---------|
| Standard | ✅ | Default variant with lighter background colors. Provides subtle, non-intrusive feedback |
| Filled | ✅ | Solid background color variant. More prominent and attention-grabbing than standard |
| Outlined | ✅ | Border-based styling with transparent background. Minimal visual weight while maintaining clarity |

## Content Patterns

### Text Content
| Pattern | Present | Details |
|---------|---------|---------|
| Plain text | ✅ | Direct children content renders as message text. Example: `<Alert>This is a message</Alert>` |
| Rich text | ✅ | Supports HTML elements within message. Example: `<Alert>This is an error — <strong>check it out!</strong></Alert>` |
| AlertTitle | ✅ | Separate AlertTitle component for structured content with title and message. Provides neatly styled and properly aligned title above message body |
| Multiple elements | ✅ | Can contain multiple React elements and nested components |

### Icon Support
| Pattern | Present | Details |
|---------|---------|---------|
| Default icons | ✅ | Each severity level has default icon (checkmark for success, info circle, warning triangle, error icon) |
| Custom icon | ✅ | `icon` prop accepts HTML element, SVG icon, or React component. Example: `icon={<CheckIcon fontSize="inherit" />}` |
| Icon removal | ✅ | Set `icon={false}` to remove icon completely |
| Icon mapping | ✅ | `iconMapping` prop overrides icons for specific severity levels. Can be customized globally via theme |

### Action Support
| Pattern | Present | Details |
|---------|---------|---------|
| Close button | ✅ | Automatic close icon (✕) displays when `onClose` callback provided without `action` prop |
| Custom action | ✅ | `action` prop accepts any element (Button, icon, custom component). Positioned right-aligned after message |
| Multiple actions | ✅ | Can include multiple action elements within `action` prop |

## Behavior Patterns

### Interactive Behaviors
| Pattern | Present | Details |
|---------|---------|---------|
| Dismissible | ✅ | `onClose` prop with signature `function(event: React.SyntheticEvent) => void` enables dismissal |
| Custom actions | ✅ | Action buttons can trigger any handler (undo, retry, navigate, etc.) |
| Non-dismissible | ✅ | Default behavior when no `onClose` provided. Alert remains visible |

### Accessibility
| Pattern | Present | Details |
|---------|---------|---------|
| Screen reader | ✅ | Dynamically displayed alerts automatically announced by screen readers |
| Static alerts | ⚠️ | Alerts present on page load are NOT announced by screen readers |
| ARIA distinction | ✅ | Not an ARIA alert dialog - does not interrupt user flow for responses |
| Icon inheritance | ✅ | Icons use `fontSize="inherit"` for proper scaling and accessibility |

## Variant Patterns

### Color Customization
| Pattern | Present | Details |
|---------|---------|---------|
| Severity colors | ✅ | Four built-in color themes tied to severity (success=green, info=blue, warning=orange, error=red) |
| Custom color | ✅ | `color` prop can override default color for specified severity |
| Theme integration | ✅ | Colors derived from theme palette (success, info, warning, error palette values) |
| Dark mode | ✅ | Comprehensive dark mode support with adjusted color palettes |

### Layout Options
| Pattern | Present | Details |
|---------|---------|---------|
| Full width | ✅ | Default behavior - extends to container width |
| Content width | ✅ | No explicit prop, but inherits Paper component sizing |
| Inline content | ✅ | AlertTitle and message body stack vertically when title present |

### Styling Customization
| Pattern | Present | Details |
|---------|---------|---------|
| sx prop | ✅ | System prop for defining custom CSS styles with theme-aware values |
| CSS classes | ✅ | Multiple classes for targeting specific elements (root, icon, message, action, etc.) |
| Theme overrides | ✅ | Global customization via `MuiAlert` theme configuration |
| Component prop | ✅ | Can change root element type (inherits from Paper) |

## Code Examples

### Basic Severity Examples
```jsx
import Alert from '@mui/material/Alert';

// Success alert
<Alert severity="success">
  This is a success alert — check it out!
</Alert>

// Info alert
<Alert severity="info">
  This is an info alert — check it out!
</Alert>

// Warning alert
<Alert severity="warning">
  This is a warning alert — check it out!
</Alert>

// Error alert
<Alert severity="error">
  This is an error alert — check it out!
</Alert>
```

### Variant Examples
```jsx
// Standard (default)
<Alert severity="success">
  This is a standard success Alert.
</Alert>

// Filled
<Alert variant="filled" severity="error">
  This is a filled error Alert.
</Alert>

// Outlined
<Alert variant="outlined" severity="warning">
  This is an outlined warning Alert.
</Alert>
```

### AlertTitle Examples
```jsx
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// With title
<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  This is an error alert — <strong>check it out!</strong>
</Alert>

// Multiple alerts with titles
<Alert severity="warning">
  <AlertTitle>Warning</AlertTitle>
  This is a warning alert — check it out!
</Alert>

<Alert severity="info">
  <AlertTitle>Info</AlertTitle>
  This is an info alert — check it out!
</Alert>

<Alert severity="success">
  <AlertTitle>Success</AlertTitle>
  This is a success alert — check it out!
</Alert>
```

### Icon Customization
```jsx
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Custom icon
<Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
  This success Alert has a custom icon.
</Alert>

// No icon
<Alert icon={false} severity="success">
  This success Alert has no icon.
</Alert>

// Icon mapping (override default icon for severity)
<Alert
  iconMapping={{
    success: <CheckCircleOutlineIcon fontSize="inherit" />
  }}
  severity="success"
>
  This success Alert uses iconMapping to override the default icon.
</Alert>
```

### Dismissible Alerts
```jsx
// With default close button
<Alert severity="warning" onClose={() => {}}>
  This Alert displays the default close icon.
</Alert>

// With state management
const [open, setOpen] = React.useState(true);

{open && (
  <Alert
    severity="success"
    onClose={() => setOpen(false)}
  >
    This is a dismissible success alert.
  </Alert>
)}
```

### Custom Actions
```jsx
import Button from '@mui/material/Button';

// With action button
<Alert
  severity="success"
  action={
    <Button color="inherit" size="small">
      UNDO
    </Button>
  }
>
  This Alert uses a Button component for its action.
</Alert>

// Multiple actions
<Alert
  severity="info"
  action={
    <>
      <Button color="inherit" size="small">
        RETRY
      </Button>
      <Button color="inherit" size="small">
        DISMISS
      </Button>
    </>
  }
>
  This Alert has multiple action buttons.
</Alert>
```

### Combined Patterns
```jsx
// Filled error with title and close
<Alert
  variant="filled"
  severity="error"
  onClose={() => {}}
>
  <AlertTitle>Error</AlertTitle>
  Your session has expired. Please log in again.
</Alert>

// Outlined warning with custom icon and action
<Alert
  variant="outlined"
  severity="warning"
  icon={<WarningAmberIcon fontSize="inherit" />}
  action={
    <Button color="inherit" size="small">
      DETAILS
    </Button>
  }
>
  <AlertTitle>System Maintenance</AlertTitle>
  Scheduled maintenance will occur tonight at 11 PM EST.
</Alert>
```

### Theme Customization
```jsx
import { createTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';

// Global close icon customization
const theme = createTheme({
  components: {
    MuiAlert: {
      defaultProps: {
        components: {
          CloseIcon: HomeIcon,
        },
      },
    },
  },
});

// Global icon mapping
const theme = createTheme({
  components: {
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          success: <CheckCircleOutlineIcon fontSize="inherit" />,
        },
      },
    },
  },
});
```

### Advanced Styling
```jsx
// Custom styling with sx prop
<Alert
  severity="info"
  sx={{
    backgroundColor: 'primary.light',
    color: 'primary.contrastText',
    '& .MuiAlert-icon': {
      color: 'primary.dark',
    },
  }}
>
  This Alert has custom styling.
</Alert>
```

## API Reference

### Alert Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | The content of the component |
| `severity` | `'error'` \| `'info'` \| `'success'` \| `'warning'` | `'success'` | The severity of the alert. Defines color and default icon |
| `variant` | `'filled'` \| `'outlined'` \| `'standard'` | `'standard'` | The variant to use |
| `action` | node | - | Action to display, typically a button or icon button. Positioned right-aligned |
| `onClose` | function | - | Callback fired when close icon clicked. Signature: `function(event: React.SyntheticEvent) => void` |
| `icon` | node \| false | - | Override default icon. Set to `false` to remove icon |
| `iconMapping` | object | - | Map custom icons to severity levels. Shape: `{ error?: node, info?: node, success?: node, warning?: node }` |
| `color` | string | - | Override default color for specified severity |
| `sx` | object | - | System prop for defining custom CSS styles |
| `slots` | object | - | Slots for component customization. Shape: `{ closeButton?: elementType, closeIcon?: elementType }` |
| `slotProps` | object | - | Props to pass to slot components. Shape: `{ closeButton?: IconButtonProps, closeIcon?: SvgIconProps }` |
| `components` | object | - | Alias for `slots` prop (deprecated, use `slots` instead) |
| `componentsProps` | object | - | Alias for `slotProps` prop (deprecated, use `slotProps` instead) |
| `role` | string | `'alert'` | ARIA role of the component |

### Inherited Props
Alert inherits props from the Paper component, including:
- `component` - Override root element type
- `elevation` - Shadow depth
- `square` - Disable rounded corners
- And other Paper props

### AlertTitle Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | The content of the component |
| `sx` | object | - | System prop for custom styling |

### CSS Classes
- `.MuiAlert-root` - Root element
- `.MuiAlert-filled` - Variant filled
- `.MuiAlert-outlined` - Variant outlined
- `.MuiAlert-standard` - Variant standard (default)
- `.MuiAlert-standardSuccess` - Standard success variant
- `.MuiAlert-standardInfo` - Standard info variant
- `.MuiAlert-standardWarning` - Standard warning variant
- `.MuiAlert-standardError` - Standard error variant
- `.MuiAlert-filledSuccess` - Filled success variant
- `.MuiAlert-filledInfo` - Filled info variant
- `.MuiAlert-filledWarning` - Filled warning variant
- `.MuiAlert-filledError` - Filled error variant
- `.MuiAlert-outlinedSuccess` - Outlined success variant
- `.MuiAlert-outlinedInfo` - Outlined info variant
- `.MuiAlert-outlinedWarning` - Outlined warning variant
- `.MuiAlert-outlinedError` - Outlined error variant
- `.MuiAlert-icon` - Icon container
- `.MuiAlert-message` - Message container
- `.MuiAlert-action` - Action container

## Notable Features

### Material Design Alignment
- **Specification Compliance**: Built to Material Design's feedback component specification
- **Consistent Experience**: Users familiar with Material Design expect these patterns
- **Design System Integration**: Seamlessly integrates with Material-UI design system

### Severity-Based Theming
- **Automatic Color Mapping**: Each severity automatically maps to appropriate theme palette
- **Icon Consistency**: Default icons follow Material Design iconography standards
- **Dark Mode Support**: Comprehensive palette adjustments for dark theme

### AlertTitle Component
- **Structured Content**: Separate component for hierarchical alert structure
- **Proper Typography**: Title uses appropriate typography scale and weight
- **Automatic Spacing**: Consistent spacing between title and message content

### Flexible Action System
- **Action Prop**: Accepts any React element for custom interactions
- **Auto Close Button**: Automatic close icon when `onClose` provided without action
- **Multiple Actions**: Can include multiple buttons or interactive elements

### Icon Customization
- **Three Levels of Control**:
  1. **Per-Instance**: `icon` prop for specific alert
  2. **Per-Severity**: `iconMapping` prop for severity-level overrides
  3. **Global**: Theme configuration for app-wide customization
- **Icon Removal**: Can completely remove icon with `icon={false}`

### Accessibility Considerations
- **Dynamic Announcements**: Screen readers announce dynamically displayed alerts
- **Static Alert Limitation**: Alerts present on load are NOT announced (important consideration)
- **Not ARIA Dialog**: Correctly positioned as non-interrupting feedback (not dialog role)
- **Semantic HTML**: Uses appropriate ARIA role and structure

### Theme Integration
- **Global Defaults**: Set default props via theme configuration
- **Palette System**: Colors derived from theme's success/info/warning/error palettes
- **Custom Slots**: Can replace internal components (closeButton, closeIcon) globally
- **sx Prop**: Theme-aware styling with direct access to theme tokens

### Paper Component Heritage
- **Inherited Props**: Gets elevation, square, and other Paper props
- **Layout Flexibility**: Benefits from Paper's container capabilities
- **Future Enhancement**: Feature request exists for Paper slot customization

### Version Evolution
- **API Maturity**: Alert component introduced in MUI v5 (previously in Lab in v4)
- **Slots Migration**: Moving from `components`/`componentsProps` to `slots`/`slotProps` pattern
- **Stable API**: Well-established patterns with comprehensive documentation

## Research Notes

### Documentation Access
- Unable to directly fetch documentation due to network restrictions/enterprise security policies
- Successfully gathered comprehensive information via web search results
- Verified information across multiple sources (official docs, Stack Overflow, GitHub issues, TypeScript definitions)

### Framework Philosophy

1. **Material Design First**: MUI Alert strictly follows Material Design specification for feedback components, ensuring consistency with broader Material ecosystem

2. **Severity as Core Concept**: The four severity levels (success, info, warning, error) are central to component design, automatically providing appropriate colors and icons

3. **Composition Over Props**: Rather than numerous boolean props, MUI favors composition (AlertTitle, action elements, custom icons) for flexibility

4. **Theme-Driven**: Heavy reliance on theme system for colors, icons, and defaults rather than component-level configuration

5. **Accessibility By Default**: Proper ARIA roles and screen reader announcements built in (though with noted limitation for static alerts)

### Comparison Points

**vs Semantic UI Classic Message**:
- MUI uses "Alert" terminology (Material Design) vs "Message" (Semantic)
- MUI's severity prop is more explicit than Semantic's type variants
- AlertTitle is separate component vs Header as subcomponent in Semantic
- MUI's icon customization is more granular (per-instance, per-severity, global)
- MUI action prop vs Semantic's onDismiss + custom content patterns

**vs Other Frameworks**:
- Similar to Ant Design's Alert (also Material-inspired)
- More structured than generic notification components
- Less flexible than headless UI patterns but more batteries-included
- Stronger coupling to design system than utility-first approaches

### API Design Patterns

1. **Severity-Driven Theming**: Single prop determines color scheme and default icon
2. **Optional Title Component**: Separate AlertTitle component vs prop-based title
3. **Smart Close Behavior**: Auto-displays close icon when onClose provided without action
4. **Flexible Actions**: Action prop accepts any React element for custom interactions
5. **Three-Tier Icon Control**: Instance, severity-level, and global icon customization
6. **Inherited Complexity**: Paper component inheritance brings many additional props

### Notable Implementation Details

- Uses Paper component as base (elevation, rounded corners, etc.)
- CSS-in-JS with emotion for styling
- Comprehensive CSS class names for every variant combination
- fontSize="inherit" pattern for icons ensures proper scaling
- Slots API for replacing internal components (closeButton, closeIcon)
- Theme configuration allows global defaults and customization

### Missing/Requested Features

- Paper slot support for advanced styling customization (GitHub issue #44819)
- Static alert announcements for screen readers (architectural limitation)
- No built-in transition/animation support (handled by parent components)
- No built-in stacking/positioning system (requires wrapper component like Snackbar)

### Best Practices from Documentation

1. Use AlertTitle for alerts with both heading and body content
2. Set icon={false} when context makes icon redundant
3. Use iconMapping at theme level for consistent icon overrides
4. Prefer action prop over manual positioning of buttons
5. Use sx prop for one-off styling, theme for systematic changes
6. Consider Snackbar component for temporary notifications vs persistent Alert
7. Ensure dynamically displayed alerts for screen reader announcements

### Integration Patterns

- Often used with Snackbar for temporary notifications
- Common in form validation feedback
- Frequently appears in dashboard status panels
- Used in confirmation/success pages after user actions
- Appears in onboarding flows and help sections

This comprehensive research shows MUI Alert as a mature, well-documented component with strong Material Design alignment and flexible customization options.
