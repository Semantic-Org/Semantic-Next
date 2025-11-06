# MUI - Snackbar Usage Patterns

## Component URL
https://mui.com/material-ui/react-snackbar/
Status: ✅ Successfully researched via web search and documentation access

## Documentation Quality
Comprehensive - MUI provides detailed documentation with API reference, multiple examples, accessibility guidance, theming information, and TypeScript support. The component is well-established with extensive community resources.

## Component Definition
- **Core purpose**: Provides brief, temporary notifications that appear at the edge of the screen to confirm actions, display status updates, or provide non-critical feedback. Implements Material Design's Snackbar specification for transient messaging without interrupting user workflow.
- **Mental model**: A "toast notification" system - lightweight, auto-dismissing messages that appear temporarily at screen edges. Unlike Alert (persistent feedback), Snackbar is designed for confirmations, undo actions, and transient status updates.
- **Semantic meaning**: Communicates non-critical, temporary feedback to users. Uses `role="alert"` for screen reader announcements. Designed for brief confirmations (e.g., "Item deleted", "Changes saved") rather than errors requiring user action.

## Display Patterns

### Position Options
| Pattern | Present | Details |
|---------|---------|---------|
| Bottom-left | ✅ | Default position. `anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}` |
| Bottom-center | ✅ | Centered at bottom. `anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}` |
| Bottom-right | ✅ | Right-aligned at bottom. `anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}` |
| Top-left | ✅ | Top-left corner. `anchorOrigin={{ vertical: 'top', horizontal: 'left' }}` |
| Top-center | ✅ | Centered at top. `anchorOrigin={{ vertical: 'top', horizontal: 'center' }}` |
| Top-right | ✅ | Top-right corner. `anchorOrigin={{ vertical: 'top', horizontal: 'right' }}` |

### Content Variants
| Pattern | Present | Details |
|---------|---------|---------|
| Simple message | ✅ | Text-only notification using `message` prop. Example: `message="Item deleted"` |
| With action | ✅ | Message with action button (typically "Undo" or "Dismiss"). Uses `action` prop |
| Alert integration | ✅ | Wraps Alert component for severity-based styling (success, error, warning, info) |
| SnackbarContent | ✅ | Custom component for advanced content layouts and styling |
| Multi-line | ✅ | Supports longer messages that wrap to multiple lines (keep under 2-3 lines) |

## Content Patterns

### Message Display
| Pattern | Present | Details |
|---------|---------|---------|
| Plain text | ✅ | Direct string passed to `message` prop. Example: `message="Changes saved"` |
| Rich content | ✅ | Can contain React nodes, formatted text, icons via `message` prop |
| Custom rendering | ✅ | Use `children` prop or SnackbarContent component for complete control |
| Truncation | ⚠️ | No built-in truncation - keep messages brief (2-3 lines recommended) |

### Action Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| No action | ✅ | Default - message only, auto-dismisses based on duration |
| Single action | ✅ | Most common - one button (Undo, Dismiss, Retry). Via `action` prop |
| Multiple actions | ✅ | Can include multiple buttons/links within `action` prop |
| Close button | ✅ | Explicit close icon can be added via action or IconButton in content |
| Text link | ✅ | Action can be styled as text link instead of button |

## Behavior Patterns

### Auto-Hide & Duration
| Pattern | Present | Details |
|---------|---------|---------|
| Auto-hide enabled | ✅ | Default `autoHideDuration={6000}` (6 seconds). Calls `onClose` after duration |
| Custom duration | ✅ | Set any millisecond value. Common: 3000-10000ms. Example: `autoHideDuration={4000}` |
| Persistent | ✅ | Set `autoHideDuration={null}` to disable auto-hide. Requires manual dismissal |
| Pause on hover | ✅ | Can pause auto-hide timer on mouse hover (requires custom implementation) |
| Resume after hover | ✅ | Timer resumes when mouse leaves (custom implementation) |

### Dismissal Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Auto-dismiss | ✅ | Primary pattern - closes after `autoHideDuration` expires |
| Click away | ✅ | Can dismiss by clicking outside. Check `reason === 'clickaway'` in onClose |
| Escape key | ✅ | ESC key triggers dismissal. Check `reason === 'escapeKeyDown'` in onClose |
| Action button | ✅ | Explicit dismiss button in action area |
| Programmatic | ✅ | Control via `open` prop state management |

### State Management
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | Primary pattern - `open` prop controlled by parent state |
| onClose callback | ✅ | Signature: `(event: SyntheticEvent \| Event, reason?: string) => void` |
| Close reasons | ✅ | Reason values: `'timeout'`, `'clickaway'`, `'escapeKeyDown'` |
| Queue handling | ⚠️ | No built-in queue - requires external library (notistack) or custom implementation |

## Transition & Animation Patterns

### Transition Types
| Pattern | Present | Details |
|---------|---------|---------|
| Slide (default) | ✅ | Slides in from edge. Default transition for Snackbar |
| Grow | ✅ | Grows from anchor point. Set via `TransitionComponent={Grow}` |
| Fade | ✅ | Fades in/out. Set via `TransitionComponent={Fade}` |
| Collapse | ✅ | Collapses height. Set via `TransitionComponent={Collapse}` |
| Custom transition | ✅ | Any component implementing transition interface |

### Animation Control
| Pattern | Present | Details |
|---------|---------|---------|
| TransitionComponent | ✅ | Prop to specify transition component. Example: `TransitionComponent={Slide}` |
| TransitionProps | ✅ | Pass props to transition component. Example: `TransitionProps={{ direction: 'up' }}` |
| transitionDuration | ✅ | Control enter/exit duration. Example: `transitionDuration={{ enter: 500, exit: 200 }}` |
| Reduced motion | ✅ | Respects `prefers-reduced-motion` media query for accessibility |

## Integration Patterns

### Alert Integration
| Pattern | Present | Details |
|---------|---------|---------|
| Severity variants | ✅ | Wrap Alert with severity: success, error, warning, info |
| Alert actions | ✅ | Alert can have own action buttons in addition to Snackbar action |
| Alert icons | ✅ | Severity-based icons from Alert component |
| AlertTitle | ✅ | Can use AlertTitle for structured content within Snackbar |

### Queue/Stacking
| Pattern | Present | Details |
|---------|---------|---------|
| Built-in queue | ❌ | No built-in queue system. Material Design recommends one at a time |
| Single display | ✅ | Recommended pattern - show one Snackbar, dismiss before showing next |
| Consecutive display | ✅ | Queue implementation via state management - show next after current closes |
| Vertical stacking | ⚠️ | Not built-in. Use notistack library for vertical stacking of multiple Snackbars |
| Custom queue | ✅ | Can implement custom queue with state management and callbacks |

## Customization Patterns

### Styling Options
| Pattern | Present | Details |
|---------|---------|---------|
| sx prop | ✅ | Theme-aware styling. Example: `sx={{ bottom: 90 }}` for custom positioning |
| ContentProps | ✅ | Pass props to SnackbarContent. Example: `ContentProps={{ sx: { textAlign: 'center' } }}` |
| CSS classes | ✅ | `.MuiSnackbar-root`, `.MuiSnackbar-anchorOrigin*` classes for targeting |
| Theme overrides | ✅ | Global customization via `MuiSnackbar` theme configuration |
| SnackbarContent | ✅ | Complete control over content rendering and styling |

### Position Customization
| Pattern | Present | Details |
|---------|---------|---------|
| anchorOrigin | ✅ | Object with vertical ('top' \| 'bottom') and horizontal ('left' \| 'center' \| 'right') |
| Custom offset | ✅ | Use sx prop for pixel-perfect positioning adjustments |
| Responsive position | ✅ | Can change position based on breakpoints using theme |
| Z-index control | ✅ | Default z-index: 1400. Customizable via theme or sx prop |

### Content Customization
| Pattern | Present | Details |
|---------|---------|---------|
| SnackbarContent | ✅ | Dedicated component for custom layouts and complex content |
| Custom components | ✅ | Use `children` prop to render any React component |
| Icon integration | ✅ | Add custom icons via SnackbarContent or Alert integration |
| Typography | ✅ | Full control over text styling and formatting |

## Accessibility Patterns

### Screen Reader Support
| Pattern | Present | Details |
|---------|---------|---------|
| ARIA role | ✅ | Default `role="alert"` announces to screen readers |
| Live region | ✅ | Dynamic Snackbars announced automatically when displayed |
| Custom role | ✅ | Can override with custom role if needed |

### Keyboard Support
| Pattern | Present | Details |
|---------|---------|---------|
| ESC to dismiss | ✅ | Escape key closes Snackbar. Check `reason === 'escapeKeyDown'` |
| Tab navigation | ✅ | Action buttons are keyboard accessible |
| Focus management | ✅ | Focus can move to action buttons when Snackbar opens |

### Motion & Animation
| Pattern | Present | Details |
|---------|---------|---------|
| prefers-reduced-motion | ✅ | Respects user preference for reduced motion |
| Disable transitions | ✅ | Can disable via TransitionProps or theme configuration |

## Code Examples

### Basic Snackbar
```jsx
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';

function BasicSnackbar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return; // Prevent closing on clickaway if desired
    }
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClick}>Show Snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
      />
    </>
  );
}
```

### Positioned Snackbars
```jsx
import Snackbar from '@mui/material/Snackbar';

// Bottom-center
<Snackbar
  open={open}
  onClose={handleClose}
  message="Bottom center notification"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
/>

// Top-right
<Snackbar
  open={open}
  onClose={handleClose}
  message="Top right notification"
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
/>

// Top-left
<Snackbar
  open={open}
  onClose={handleClose}
  message="Top left notification"
  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
/>
```

### Snackbar with Action
```jsx
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// With Undo button
<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message="Item deleted"
  action={
    <Button color="secondary" size="small" onClick={handleUndo}>
      UNDO
    </Button>
  }
/>

// With close icon
<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message="Email sent"
  action={
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  }
/>

// Multiple actions
<Snackbar
  open={open}
  onClose={handleClose}
  message="Connection lost"
  action={
    <>
      <Button color="secondary" size="small" onClick={handleRetry}>
        RETRY
      </Button>
      <IconButton size="small" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  }
/>
```

### Custom Duration
```jsx
// Short duration (3 seconds)
<Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={handleClose}
  message="Quick notification"
/>

// Long duration (10 seconds)
<Snackbar
  open={open}
  autoHideDuration={10000}
  onClose={handleClose}
  message="Important message - take your time to read"
/>

// Persistent (requires manual dismiss)
<Snackbar
  open={open}
  autoHideDuration={null}
  onClose={handleClose}
  message="This stays until you dismiss it"
  action={
    <Button color="secondary" size="small" onClick={handleClose}>
      DISMISS
    </Button>
  }
/>
```

### Alert Integration
```jsx
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Success alert
<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    This is a success message!
  </Alert>
</Snackbar>

// Error alert with title
<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    <AlertTitle>Error</AlertTitle>
    This is an error message with details!
  </Alert>
</Snackbar>

// Warning alert filled variant
<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert
    onClose={handleClose}
    severity="warning"
    variant="filled"
    sx={{ width: '100%' }}
  >
    This is a warning message!
  </Alert>
</Snackbar>

// Info alert outlined variant
<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert
    onClose={handleClose}
    severity="info"
    variant="outlined"
    sx={{ width: '100%' }}
  >
    This is an info message!
  </Alert>
</Snackbar>
```

### Transition Customization
```jsx
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import Fade from '@mui/material/Fade';

// Slide transition (default)
<Snackbar
  open={open}
  onClose={handleClose}
  message="Slides in from bottom"
  TransitionComponent={Slide}
/>

// Grow transition
<Snackbar
  open={open}
  onClose={handleClose}
  message="Grows from anchor point"
  TransitionComponent={Grow}
/>

// Fade transition
<Snackbar
  open={open}
  onClose={handleClose}
  message="Fades in and out"
  TransitionComponent={Fade}
/>

// Slide with custom direction
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

<Snackbar
  open={open}
  onClose={handleClose}
  message="Slides up from bottom"
  TransitionComponent={SlideTransition}
/>

// Custom transition duration
<Snackbar
  open={open}
  onClose={handleClose}
  message="Slow entrance, quick exit"
  TransitionProps={{
    enter: 1000,
    exit: 200
  }}
/>
```

### Custom Content with SnackbarContent
```jsx
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
>
  <SnackbarContent
    sx={{
      backgroundColor: 'success.main',
      color: 'success.contrastText',
    }}
    message={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleIcon />
        <span>Successfully saved!</span>
      </Box>
    }
    action={
      <IconButton size="small" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  />
</Snackbar>
```

### Handling Close Reasons
```jsx
const handleClose = (event, reason) => {
  // Prevent closing on clickaway
  if (reason === 'clickaway') {
    return;
  }

  // Log different close reasons
  if (reason === 'timeout') {
    console.log('Snackbar auto-closed after duration');
  } else if (reason === 'escapeKeyDown') {
    console.log('User pressed ESC key');
  }

  setOpen(false);
};

<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message="Note archived"
/>
```

### Custom Positioning and Styling
```jsx
import Snackbar from '@mui/material/Snackbar';

// Custom offset from edge
<Snackbar
  open={open}
  onClose={handleClose}
  message="Custom positioned"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  sx={{
    bottom: 90, // Offset from bottom
    left: 24,   // Offset from left
  }}
/>

// Custom width and styling
<Snackbar
  open={open}
  onClose={handleClose}
  message="Wide notification"
  ContentProps={{
    sx: {
      minWidth: 400,
      backgroundColor: 'primary.dark',
      color: 'primary.contrastText',
      textAlign: 'center',
      fontSize: '1.1rem',
    }
  }}
/>

// Responsive positioning
<Snackbar
  open={open}
  onClose={handleClose}
  message="Responsive position"
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'center'
  }}
  sx={{
    // Mobile: full width at bottom
    bottom: { xs: 0, sm: 24 },
    left: { xs: 0, sm: 'auto' },
    right: { xs: 0, sm: 'auto' },
    // Desktop: centered with max width
    maxWidth: { xs: '100%', sm: 600 },
  }}
/>
```

### Queue Implementation (Custom)
```jsx
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';

function SnackbarQueue() {
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClick = (message) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <>
      <Button onClick={() => handleClick('Message 1')}>Show Message 1</Button>
      <Button onClick={() => handleClick('Message 2')}>Show Message 2</Button>
      <Button onClick={() => handleClick('Message 3')}>Show Message 3</Button>

      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
      />
    </>
  );
}
```

### Theme Customization
```jsx
import { createTheme } from '@mui/material/styles';

// Global Snackbar customization
const theme = createTheme({
  components: {
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        autoHideDuration: 5000,
      },
      styleOverrides: {
        root: {
          // Custom positioning
          bottom: 90,
        },
        anchorOriginBottomCenter: {
          // Custom styles for bottom-center position
          '@media (min-width: 600px)': {
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
          color: '#fff',
          fontSize: '0.95rem',
        },
        message: {
          padding: '8px 0',
        },
        action: {
          paddingLeft: 16,
        },
      },
    },
  },
});
```

### Integration with Context/Provider Pattern
```jsx
import { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}

// Usage in components
function MyComponent() {
  const { showSnackbar } = useSnackbar();

  const handleSuccess = () => {
    showSnackbar('Operation completed successfully!', 'success');
  };

  const handleError = () => {
    showSnackbar('An error occurred!', 'error');
  };

  return (
    <>
      <Button onClick={handleSuccess}>Trigger Success</Button>
      <Button onClick={handleError}>Trigger Error</Button>
    </>
  );
}
```

## API Reference

### Snackbar Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | If `true`, Snackbar is open/visible |
| `autoHideDuration` | number \| null | null | Milliseconds to wait before auto-calling onClose. Set to `null` to disable |
| `onClose` | function | - | Callback fired when component requests to be closed. Signature: `(event: SyntheticEvent \| Event, reason?: string) => void` where reason can be: `'timeout'`, `'clickaway'`, `'escapeKeyDown'` |
| `anchorOrigin` | object | `{ vertical: 'bottom', horizontal: 'left' }` | Position of the Snackbar. Shape: `{ horizontal: 'center' \| 'left' \| 'right', vertical: 'bottom' \| 'top' }` |
| `message` | node | - | The message to display |
| `action` | node | - | Action to display, positioned after the message. Typically a Button or IconButton |
| `children` | node | - | Content of the component. When used, overrides the `message` prop. Often contains Alert or SnackbarContent |
| `TransitionComponent` | elementType | Slide | Component used for the transition. Must follow transition component requirements |
| `TransitionProps` | object | - | Props applied to the transition element (e.g., direction, timeout) |
| `transitionDuration` | number \| object | - | Duration for the transition. Object shape: `{ appear?: number, enter?: number, exit?: number }` |
| `ContentProps` | object | - | Props applied to the SnackbarContent element |
| `ClickAwayListenerProps` | object | - | Props applied to the ClickAwayListener element |
| `key` | any | - | Used with consecutive Snackbars. Change key to force re-render with new message |
| `resumeHideDuration` | number | - | Time in milliseconds to wait before resuming auto-hide after hover leaves |
| `disableWindowBlurListener` | boolean | false | If `true`, auto-hide duration won't reset when window loses focus |
| `sx` | object | - | System prop for custom styling with theme-aware values |
| `className` | string | - | CSS class name |
| `role` | string | 'alert' | ARIA role attribute |

### SnackbarContent Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | node | - | The message to display |
| `action` | node | - | Action to display |
| `role` | string | 'alert' | ARIA role attribute |
| `sx` | object | - | System prop for custom styling |

### Close Reasons
The `onClose` callback receives a `reason` parameter with these possible values:
- `'timeout'` - Auto-hide duration expired
- `'clickaway'` - User clicked outside the Snackbar
- `'escapeKeyDown'` - User pressed ESC key

### CSS Classes
- `.MuiSnackbar-root` - Root element
- `.MuiSnackbar-anchorOriginTopCenter` - Top-center position
- `.MuiSnackbar-anchorOriginBottomCenter` - Bottom-center position
- `.MuiSnackbar-anchorOriginTopRight` - Top-right position
- `.MuiSnackbar-anchorOriginBottomRight` - Bottom-right position
- `.MuiSnackbar-anchorOriginTopLeft` - Top-left position
- `.MuiSnackbar-anchorOriginBottomLeft` - Bottom-left position (default)
- `.MuiSnackbarContent-root` - SnackbarContent root
- `.MuiSnackbarContent-message` - Message container in SnackbarContent
- `.MuiSnackbarContent-action` - Action container in SnackbarContent

## Notable Features

### Material Design Compliance
- **Specification Adherence**: Implements Material Design's Snackbar guidelines for transient messaging
- **Positioning Standards**: Default bottom-left positioning follows Material Design conventions
- **Single Display**: Material Design recommends showing one Snackbar at a time to avoid cognitive overload
- **Brief Messages**: Designed for short, actionable feedback (2-3 lines maximum)

### Transition System
- **Flexible Transitions**: Supports Slide (default), Grow, Fade, Collapse, and custom transitions
- **Direction Control**: Slide transition can come from any direction via TransitionProps
- **Duration Control**: Customizable enter/exit durations for fine-tuned animations
- **Accessibility**: Automatically respects `prefers-reduced-motion` user preference

### Alert Component Integration
- **Severity Variants**: Seamlessly wraps Alert component for success/error/warning/info styling
- **Consistent Styling**: Alert provides icon, color, and visual consistency with rest of MUI
- **Action Flexibility**: Can combine Alert's onClose with Snackbar's action prop
- **Rich Content**: AlertTitle support for structured notifications

### State Management Patterns
- **Controlled Component**: Fully controlled via `open` prop and `onClose` callback
- **Close Reason Tracking**: Distinguishes between timeout, clickaway, and ESC key dismissal
- **Queue Support**: No built-in queue, but patterns exist for consecutive display
- **Context Integration**: Commonly used with Context/Provider for global notification system

### Positioning Flexibility
- **Six Standard Positions**: All combinations of top/bottom and left/center/right
- **Custom Offsets**: sx prop allows pixel-perfect positioning adjustments
- **Responsive Positioning**: Can change position based on breakpoints
- **Z-Index Control**: Default z-index of 1400 ensures visibility above most content

### Action System
- **Flexible Actions**: Accepts any React node (Button, IconButton, links, custom components)
- **Multiple Actions**: Can include multiple interactive elements
- **Common Patterns**: Undo, Dismiss, Retry, Details buttons
- **Consistent Positioning**: Actions always appear after message, right-aligned

### Auto-Hide Behavior
- **Default Duration**: 6 seconds (6000ms) is recommended baseline
- **Custom Durations**: 3-10 seconds common range based on message importance
- **Persistent Mode**: Set to `null` for messages requiring manual dismissal
- **Pause on Hover**: Can implement pause/resume behavior with `resumeHideDuration`

### Accessibility Features
- **Screen Reader Support**: Default `role="alert"` announces content to assistive technology
- **Keyboard Navigation**: ESC key dismissal, Tab navigation to action buttons
- **Focus Management**: Action buttons are keyboard accessible
- **Motion Preferences**: Respects `prefers-reduced-motion` for users with vestibular disorders
- **ARIA Compliance**: Proper ARIA roles and live region announcements

### Theme Integration
- **Global Defaults**: Set default position, duration via theme configuration
- **Style Overrides**: Customize appearance globally for consistent branding
- **Color Palette**: Integrates with theme's color system
- **Dark Mode**: Automatic color adjustments for dark theme
- **Responsive Values**: Theme breakpoints work with sx prop for responsive behavior

### TypeScript Support
- **Full Type Definitions**: Complete TypeScript interfaces for all props
- **Generic Types**: Proper typing for event handlers and callbacks
- **Strict Mode Compatible**: Works with TypeScript strict mode
- **IntelliSense Support**: Full autocomplete and type checking in IDEs

### Third-Party Integration
- **notistack Library**: Popular library for advanced stacking, queuing, and management
- **Redux Integration**: Can be controlled via Redux state
- **React Query**: Works with mutation callbacks for API feedback
- **Form Libraries**: Common in form validation and submission feedback

## Research Notes

### Documentation Access
- Successfully accessed MUI Snackbar documentation via web search and official documentation
- Comprehensive information gathered from official docs, GitHub discussions, Stack Overflow, and community resources
- TypeScript definitions and code examples verified across multiple sources

### Framework Philosophy

1. **Material Design First**: Strict adherence to Material Design Snackbar specification ensures consistency across Material ecosystem and user expectations

2. **Transient, Non-Intrusive Feedback**: Designed specifically for brief confirmations and status updates, not errors requiring user action

3. **Controlled Component Pattern**: Fully controlled via React state for predictable behavior and integration with complex state management

4. **Composition Over Configuration**: Wraps well with Alert, SnackbarContent for flexibility rather than prop explosion

5. **Single Display Recommendation**: Material Design philosophy of showing one notification at a time to avoid cognitive overload

6. **Accessibility by Default**: Built-in screen reader support, keyboard navigation, and motion preferences

### Comparison Points

**vs MUI Alert**:
- Snackbar is for **transient** notifications (auto-dismiss), Alert is for **persistent** feedback
- Snackbar typically appears at screen edges, Alert appears in content flow
- Snackbar is for **confirmations** ("Saved", "Deleted"), Alert is for **status** ("Error occurred", "Warning")
- Common pattern: Snackbar wraps Alert for transient severity-based notifications

**vs Semantic UI Classic Message**:
- Snackbar emphasizes transient display with auto-hide, Message is typically persistent
- Snackbar has sophisticated positioning system (6 positions), Message is inline
- Snackbar has no built-in severity variants (uses Alert), Message has built-in variants
- Snackbar action prop vs Message's onDismiss callback pattern

**vs Other Toast Libraries**:
- More opinionated than react-hot-toast (Material Design styling enforced)
- Less feature-rich than notistack (no built-in queue/stacking)
- Stronger theme integration than standalone toast libraries
- Better accessibility than many lightweight toast implementations

### API Design Patterns

1. **Controlled Open State**: `open` prop with `onClose` callback for full control
2. **Close Reason Discrimination**: Reason parameter allows different handling based on dismissal method
3. **Flexible Content**: `message` prop for simple text, `children` for complex content
4. **Transition Abstraction**: `TransitionComponent` for swappable animations
5. **Position Object**: `anchorOrigin` with vertical/horizontal object rather than string enum
6. **Action Slot**: Dedicated `action` prop for consistent action placement

### Notable Implementation Details

- Uses Portal to render at document root, ensuring z-index effectiveness
- ClickAwayListener integration for click-outside detection
- Transition component must implement specific interface (enter/exit callbacks)
- Key prop important for consecutive Snackbars with same position
- ContentProps allows deep customization of internal SnackbarContent
- Z-index default of 1400 positions above most UI but below modals (1300 is typical app bar)

### Common Use Cases

1. **Action Confirmations**: "Item deleted", "Changes saved", "Email sent"
2. **Undo Operations**: Delete with undo, bulk actions with undo
3. **Background Process Updates**: "Download complete", "Sync finished"
4. **Network Status**: "Connection lost", "Reconnected"
5. **Form Submissions**: "Form submitted successfully", "Message sent"
6. **Navigation Feedback**: "Copied to clipboard", "Link shared"

### Integration Patterns

- **Form Validation**: Show success Snackbar on form submission
- **CRUD Operations**: Confirm create/update/delete actions
- **API Feedback**: Display API success/error messages
- **Clipboard Operations**: Confirm copy to clipboard
- **Offline/Online Status**: Network connectivity changes
- **Background Jobs**: Long-running task completion notifications

### Missing/Requested Features

- **No Built-in Queue**: Requires custom implementation or notistack library
- **No Stacking**: Cannot show multiple Snackbars simultaneously out-of-box
- **No Progress Indicator**: Cannot show progress bar within Snackbar natively
- **No Rich Formatting**: Requires SnackbarContent or Alert for icons, colors
- **No Swipe to Dismiss**: Mobile swipe gesture not built-in

### Best Practices from Documentation

1. **Keep Messages Brief**: 2-3 lines maximum for readability
2. **Use Appropriate Duration**: 3-6 seconds for reading, 10 seconds for actions
3. **One at a Time**: Show single Snackbar, queue subsequent ones
4. **Provide Actions When Relevant**: Undo for destructive actions, Dismiss for persistent messages
5. **Check Close Reason**: Prevent clickaway closing if action is important
6. **Use Alert for Severity**: Wrap Alert for success/error/warning/info styling
7. **Position Consistently**: Use same position throughout app for predictability
8. **Accessible Actions**: Always provide keyboard-accessible action buttons
9. **Theme Integration**: Use theme configuration for app-wide consistency
10. **TypeScript Types**: Leverage TypeScript for type-safe implementations

### Queue Implementation Strategies

1. **State-Based Queue**: Array of messages, show first, remove on close
2. **Key-Based Consecutive**: Change key prop to force new Snackbar rendering
3. **TransitionProps onExited**: Wait for exit transition before showing next
4. **notistack Library**: Full-featured stacking/queue library for complex scenarios
5. **Context Provider Pattern**: Global notification system with queue management

### Performance Considerations

- Minimal re-renders with proper state management
- Transition animations use CSS transforms for performance
- Portal rendering avoids layout thrashing
- Automatic cleanup of event listeners
- Supports lazy loading and code splitting

This comprehensive research shows MUI Snackbar as a mature, well-documented component with strong Material Design alignment, excellent accessibility, and flexible customization options for transient user notifications.
