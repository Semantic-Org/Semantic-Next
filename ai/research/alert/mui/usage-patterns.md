# MUI Alert - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://mui.com/material-ui/react-alert/
> API Documentation: https://mui.com/material-ui/api/alert/

## Component Overview

The Alert component is Material UI's implementation of a feedback element that displays important messages to users. It provides contextual styling based on severity levels and visual variants, following Material Design 3 guidelines. The component is designed to communicate success, informational, warning, or error messages with appropriate visual hierarchy and accessibility features.

**Key Characteristics:**
- Severity-based semantic coloring (success, info, warning, error)
- Three visual variants (standard, filled, outlined)
- Support for titles, icons, and action elements
- Built-in accessibility features (ARIA roles, screen reader support)
- Full theme integration with light/dark mode support
- Controlled dismissal pattern (parent manages visibility)

## Core Patterns

### Basic Alert
```jsx
<Alert severity="success">
  This is a success alert — check it out!
</Alert>
```

### Alert with Title
```jsx
<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  This is an error alert — check it out!
</Alert>
```

### Dismissible Alert
```jsx
<Alert severity="warning" onClose={handleClose}>
  This is a warning alert — check it out!
</Alert>
```

### Alert with Action
```jsx
<Alert
  severity="info"
  action={
    <Button color="inherit" size="small">
      UNDO
    </Button>
  }
>
  This is an info alert with an action!
</Alert>
```

## Props & Configuration

### Complete Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | ReactNode | - | Custom action element (buttons, icons) displayed at the end of the alert |
| `children` | ReactNode | - | Alert message content (can include text, AlertTitle, or other elements) |
| `className` | string | - | Additional CSS class names for custom styling |
| `closeText` | string | `'Close'` | Screen reader text for the close button (accessibility) |
| `color` | `'error'` \| `'info'` \| `'success'` \| `'warning'` | - | Custom color override (alternative to severity) |
| `icon` | ReactNode \| false | - | Custom icon element; pass `false` to hide the icon entirely |
| `onClose` | `(event: SyntheticEvent) => void` | - | Callback function when alert is dismissed (does NOT manage visibility automatically) |
| `role` | string | `'alert'` | ARIA role attribute for accessibility |
| `severity` | `'error'` \| `'info'` \| `'success'` \| `'warning'` | `'success'` | Alert type/priority level that determines color and default icon |
| `sx` | SxProps | - | System styling prop for advanced customization and theme overrides |
| `variant` | `'filled'` \| `'outlined'` \| `'standard'` | `'standard'` | Visual style variant affecting background and border treatment |

### Inherited Props

The Alert component inherits all standard HTML `<div>` attributes and supports:
- Standard React props (key, ref, etc.)
- DOM event handlers (onClick, onMouseEnter, etc.)
- Data attributes (data-*)
- ARIA attributes (aria-label, aria-describedby, etc.)

## Visual Patterns

### Severity Variants

The `severity` prop determines the semantic meaning and visual styling:

#### Success (Default)
- **Color**: Green (`hsl(144, 72%, 37%)`)
- **Icon**: Checkmark/success icon
- **Use Case**: Positive outcomes, completed actions, confirmations
- **Example**: "Your changes have been saved successfully!"

#### Info
- **Color**: Blue (`rgb(2, 136, 209)`)
- **Icon**: Information icon
- **Use Case**: Neutral informational messages, tips, helpful context
- **Example**: "You can change these settings later in your profile"

#### Warning
- **Color**: Orange/Amber (`hsl(48, 100%, 44%)`)
- **Icon**: Warning triangle icon
- **Use Case**: Cautionary messages, potential issues, important notices
- **Example**: "Your session will expire in 5 minutes"

#### Error
- **Color**: Red (`hsl(355, 98%, 66%)`)
- **Icon**: Error/alert circle icon
- **Use Case**: Critical issues, failures, validation errors
- **Example**: "Failed to save changes. Please try again."

### Style Variants

#### Standard Variant (Default)
```jsx
<Alert severity="info" variant="standard">
  Standard info alert with light background
</Alert>
```
- Light background colors per severity
- Transparent/subtle appearance
- Colored text and icon
- Best for non-critical, ambient messaging

#### Filled Variant
```jsx
<Alert severity="warning" variant="filled">
  Filled warning alert with solid background
</Alert>
```
- Solid colored backgrounds
- Dark filled backgrounds for enhanced contrast
- White text for readability
- Best for high-priority, attention-demanding messages

#### Outlined Variant
```jsx
<Alert severity="error" variant="outlined">
  Outlined error alert with bordered style
</Alert>
```
- Colored borders matching severity
- Light background fill
- Colored elements (icon, text)
- Best for subtle emphasis while maintaining visual hierarchy

## Content Patterns

### Message-Only Alert
```jsx
<Alert severity="success">
  Simple success message
</Alert>
```
Minimal alert with just a message and default icon.

### Alert with Title
```jsx
<Alert severity="warning">
  <AlertTitle>Warning Title</AlertTitle>
  Detailed warning message content goes here.
</Alert>
```
The `AlertTitle` sub-component provides hierarchical structure for complex messages.

### Multi-Line Content
```jsx
<Alert severity="info">
  <AlertTitle>Information</AlertTitle>
  <Typography variant="body2">
    First paragraph of information.
  </Typography>
  <Typography variant="body2">
    Second paragraph with additional details.
  </Typography>
</Alert>
```
Supports rich content including multiple paragraphs and nested components.

### Alert with Custom Icon
```jsx
<Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
  Custom icon alert
</Alert>
```
Override the default severity icon with a custom element.

### Alert without Icon
```jsx
<Alert icon={false} severity="error">
  Alert with no icon displayed
</Alert>
```
Pass `false` to the `icon` prop to hide the icon entirely.

## Composition Patterns

### AlertTitle Sub-component

The `AlertTitle` component provides semantic hierarchy within alerts:

```jsx
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

<Alert severity="error">
  <AlertTitle>Error</AlertTitle>
  This is an error message with a title.
</Alert>
```

**Characteristics:**
- Renders as a `<div>` with semantic styling
- Provides visual hierarchy through typography
- Should be the first child of Alert for proper layout
- Inherits color from parent Alert severity

### Complex Composition Example
```jsx
<Alert
  severity="warning"
  variant="outlined"
  icon={<WarningAmberIcon />}
  action={
    <>
      <Button color="inherit" size="small">
        UNDO
      </Button>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={handleClose}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </>
  }
>
  <AlertTitle>Warning</AlertTitle>
  <Typography variant="body2">
    This action will permanently delete your data.
  </Typography>
</Alert>
```

## Behavioral Patterns

### Closable/Dismissible Alerts

**Important**: The Alert component does NOT manage its own visibility. The parent component must control mounting/unmounting.

```jsx
function DismissibleAlert() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <Alert
          severity="info"
          onClose={() => setOpen(false)}
        >
          This alert can be dismissed
        </Alert>
      )}
    </>
  );
}
```

**Pattern Notes:**
- `onClose` provides the callback, but does NOT hide the alert
- Parent must manage `open` state and conditional rendering
- Common pattern: use state + conditional rendering
- Allows for additional logic (analytics, persistence, etc.)

### Close Button with Custom Text
```jsx
<Alert
  severity="success"
  onClose={handleClose}
  closeText="Dismiss this message"
>
  Alert with custom close button accessibility text
</Alert>
```
The `closeText` prop provides screen reader text for the close button.

### Action Buttons

Alerts can include custom action elements:

```jsx
// Single action
<Alert
  severity="error"
  action={
    <Button color="inherit" size="small" onClick={handleRetry}>
      RETRY
    </Button>
  }
>
  Failed to load data
</Alert>

// Multiple actions
<Alert
  severity="warning"
  action={
    <Stack direction="row" spacing={1}>
      <Button size="small" onClick={handleConfirm}>
        YES
      </Button>
      <Button size="small" onClick={handleCancel}>
        NO
      </Button>
    </Stack>
  }
>
  Do you want to proceed?
</Alert>
```

**Action Patterns:**
- Positioned at the end of the alert (right side in LTR)
- Typically use `size="small"` for proportional sizing
- Use `color="inherit"` to match alert color scheme
- Can include buttons, icon buttons, or custom elements

## Transitions & Animations

### Material Design Transitions

Alerts use Material Design's standard easing and timing:
- **Duration**: 150-225ms for state changes
- **Easing**: Standard Material easing curves
- **Effects**: Fade in/out for appearance and dismissal
- **Accessibility**: Respects `prefers-reduced-motion` media query

### Transition Example with Collapse
```jsx
import Collapse from '@mui/material/Collapse';

<Collapse in={open}>
  <Alert severity="success" onClose={handleClose}>
    This alert transitions smoothly
  </Alert>
</Collapse>
```

### Transition Group for Multiple Alerts
```jsx
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';

<TransitionGroup>
  {alerts.map((alert) => (
    <Collapse key={alert.id}>
      <Alert
        severity={alert.severity}
        onClose={() => handleDismiss(alert.id)}
      >
        {alert.message}
      </Alert>
    </Collapse>
  ))}
</TransitionGroup>
```

## Accessibility

### ARIA Attributes

**Default ARIA Role**: `role="alert"`
- Announces content to screen readers immediately
- Indicates important, time-sensitive information
- Automatically interrupts screen reader flow

**Custom Roles**:
```jsx
<Alert role="status" severity="info">
  Less urgent informational message
</Alert>
```
Use `role="status"` for less urgent messages that should not interrupt.

### Screen Reader Support

**Close Button Accessibility**:
```jsx
<Alert
  severity="warning"
  onClose={handleClose}
  closeText="Dismiss warning notification"
>
  Warning message
</Alert>
```
The `closeText` prop provides descriptive text for screen readers.

**Semantic HTML**:
- AlertTitle provides hierarchical structure
- Icons convey meaning beyond color alone
- Proper heading levels when using AlertTitle

### Color Independence

**Pattern**: Icons and text convey meaning beyond color alone
- Each severity level has a unique icon
- Text clearly states the message type
- Not solely reliant on color for meaning
- Supports users with color blindness

### Keyboard Support

- Close buttons are keyboard accessible (Enter/Space to activate)
- Action buttons receive proper focus management
- Tab order follows logical content flow

## Framework-Specific Features

### Material Design 3 Specifications

**Design System Compliance**:
- Follows Material Design 3 guidelines for feedback components
- Consistent with Material UI's component ecosystem
- Integrates with MUI theme system

**Visual Specifications**:
- **Border Radius**: 12px for rounded corners
- **Spacing Baseline**: 8px grid system
- **Typography**: Uses Material Design type scale
- **Elevation**: No elevation by default (flat design)

### Theme Integration

#### Color System
Alerts use CSS custom properties from the MUI theme:

```css
/* Error colors */
--muidocs-palette-Alert-errorColor
--muidocs-palette-Alert-errorFilledBg
--muidocs-palette-Alert-errorStandardBg
--muidocs-palette-Alert-errorIconColor

/* Info colors */
--muidocs-palette-Alert-infoColor
--muidocs-palette-Alert-infoFilledBg
--muidocs-palette-Alert-infoStandardBg
--muidocs-palette-Alert-infoIconColor

/* Success colors */
--muidocs-palette-Alert-successColor
--muidocs-palette-Alert-successFilledBg
--muidocs-palette-Alert-successStandardBg
--muidocs-palette-Alert-successIconColor

/* Warning colors */
--muidocs-palette-Alert-warningColor
--muidocs-palette-Alert-warningFilledBg
--muidocs-palette-Alert-warningStandardBg
--muidocs-palette-Alert-warningIconColor
```

#### Dark Mode Support
```jsx
// Automatically adapts based on theme mode
<ThemeProvider theme={darkTheme}>
  <Alert severity="success">
    Automatically styled for dark mode
  </Alert>
</ThemeProvider>
```
Uses `data-mui-color-scheme` attribute for theme switching.

#### Theme Customization
```jsx
// Global theme override
const theme = createTheme({
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        filled: {
          fontWeight: 'bold',
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});
```

### CSS Classes & Customization

**Root Classes**:
- `MuiAlert-root` - Base class for all alerts

**Variant Classes**:
- `MuiAlert-standard` - Standard variant styling
- `MuiAlert-filled` - Filled variant styling
- `MuiAlert-outlined` - Outlined variant styling

**Severity Classes**:
- `MuiAlert-error` - Error severity
- `MuiAlert-info` - Info severity
- `MuiAlert-success` - Success severity
- `MuiAlert-warning` - Warning severity

**Slot Classes**:
- `MuiAlert-icon` - Icon wrapper
- `MuiAlert-action` - Action container
- `MuiAlert-message` - Message content container

### System Prop (sx)

The `sx` prop provides powerful inline styling with theme access:

```jsx
<Alert
  severity="info"
  sx={{
    width: '100%',
    '& .MuiAlert-icon': {
      fontSize: 24,
    },
    '& .MuiAlert-message': {
      fontSize: '1rem',
    },
    borderLeft: 4,
    borderLeftColor: 'primary.main',
  }}
>
  Custom styled alert
</Alert>
```

## Implementation Notes

### API Design Philosophy

**Controlled Component Pattern**:
- Alert does NOT manage its own visibility
- Parent must control mounting/unmounting
- `onClose` is a callback only, not a visibility toggle
- Provides maximum flexibility for state management

**Composition Over Configuration**:
- Accepts ReactNode for flexible content
- AlertTitle as separate importable component
- Custom icons and actions via props
- Encourages semantic HTML structure

### Architecture Details

**Component Hierarchy**:
```
Alert (Paper base)
├── Icon slot
├── Message container
│   ├── AlertTitle (optional)
│   └── Children content
└── Action slot
```

**Base Component**: Alert extends MUI's Paper component
- Inherits Paper's elevation system (though not used by default)
- Supports all Paper props via spreading
- Leverages Paper's theme integration

**Icon System**:
- Default icons mapped per severity level
- Lazy-loaded icon components for performance
- Supports custom icon override
- Icon can be completely hidden with `icon={false}`

**Rendering Optimization**:
- Uses React.memo for performance
- Avoids unnecessary re-renders
- Efficient event handler binding

### Performance Considerations

**Best Practices**:
1. Memoize action components to prevent re-renders
2. Use callback refs for close handlers when possible
3. Avoid inline function definitions in `action` prop
4. Consider virtualizing for lists of many alerts

**Example - Optimized Pattern**:
```jsx
const AlertAction = React.memo(({ onClose }) => (
  <IconButton size="small" onClick={onClose}>
    <CloseIcon fontSize="inherit" />
  </IconButton>
));

function MyAlert() {
  const handleClose = useCallback(() => {
    // Close logic
  }, []);

  return (
    <Alert
      severity="info"
      action={<AlertAction onClose={handleClose} />}
    >
      Optimized alert
    </Alert>
  );
}
```

### TypeScript Support

**Type Definitions**:
```typescript
interface AlertProps {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  closeText?: string;
  color?: 'error' | 'info' | 'success' | 'warning';
  icon?: ReactNode | false;
  onClose?: (event: SyntheticEvent) => void;
  role?: string;
  severity?: 'error' | 'info' | 'success' | 'warning';
  sx?: SxProps;
  variant?: 'filled' | 'outlined' | 'standard';
}
```

**Strict Typing**:
- Severity prop limited to specific string literals
- Variant prop limited to specific string literals
- Full TypeScript support for all props
- Proper event typing for onClose callback

### Common Patterns

#### Notification System
```jsx
function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, severity) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, severity }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Stack spacing={2}>
      {notifications.map(({ id, message, severity }) => (
        <Alert
          key={id}
          severity={severity}
          onClose={() => removeNotification(id)}
        >
          {message}
        </Alert>
      ))}
    </Stack>
  );
}
```

#### Form Validation Feedback
```jsx
function FormWithValidation() {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    if (!isValid) {
      setError('Please correct the errors below');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {/* Form fields */}
    </form>
  );
}
```

#### Loading States
```jsx
function DataLoader() {
  const [status, setStatus] = useState({ type: 'info', message: 'Loading...' });

  useEffect(() => {
    fetchData()
      .then(() => setStatus({ type: 'success', message: 'Data loaded!' }))
      .catch(() => setStatus({ type: 'error', message: 'Failed to load' }));
  }, []);

  return <Alert severity={status.type}>{status.message}</Alert>;
}
```

### Migration & Compatibility Notes

- Compatible with MUI v5+ theme system
- Follows Material Design 3 specifications
- Breaking changes from v4: Paper-based composition
- Full RTL (right-to-left) language support
- SSR (server-side rendering) compatible

## Summary

The MUI Alert component is a comprehensive, accessible feedback component that:
- Provides four severity levels with semantic meaning
- Offers three visual variants for different emphasis levels
- Supports rich content composition with AlertTitle
- Integrates deeply with MUI's theme system
- Follows Material Design 3 guidelines
- Implements proper accessibility patterns
- Uses a controlled component pattern for flexibility
- Provides extensive customization through sx prop and theme overrides

**Best Use Cases**:
- User feedback messages (success, error, warning, info)
- Form validation feedback
- System notifications
- Contextual help and tips
- Status updates and confirmations
