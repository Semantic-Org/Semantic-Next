# Mantine - Notifications System

## Component Overview

The Mantine Notifications system (`@mantine/notifications`) provides a complete solution for displaying temporary or persistent alert messages to users. Unlike typical provider-based notification systems, Mantine's approach uses a regular component that renders notifications in a designated container, paired with imperative API methods for programmatic control.

**Core purpose**: Communicate transient information, status updates, success/error feedback, and process notifications to users without interrupting their workflow. Notifications appear in configurable screen positions and can be queued, updated dynamically, and dismissed automatically or manually.

**Architecture**: Composed of two main parts: (1) the `<Notifications />` component that renders the notification container and must be placed inside `MantineProvider`, and (2) the `notifications` object that provides imperative methods (`show`, `hide`, `update`, `clean`) for managing notification state programmatically from anywhere in the application.

**Common use cases**: Form submission feedback, async operation status (loading → success/error), real-time alerts, file upload progress, multi-step process updates, error notifications, success confirmations, informational messages.

## Usage Patterns

### Basic Usage

The simplest notification requires the Notifications component in your app root and calling `notifications.show()`:

```jsx
// App setup (once at root level)
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      {/* Your app content */}
    </MantineProvider>
  );
}

// Triggering notifications from anywhere
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

function Demo() {
  return (
    <Button
      onClick={() =>
        notifications.show({
          title: 'Default notification',
          message: 'Do not forget to star Mantine on GitHub! 🌟',
        })
      }
    >
      Show notification
    </Button>
  );
}
```

**Key characteristics**:
- CSS imports must be in correct order: core styles before notification styles
- Notifications component is non-blocking (doesn't require provider wrapper)
- Imperative API allows calling from anywhere (event handlers, async functions, etc.)
- Minimal setup with sensible defaults

### Variants/Styles

Mantine Notifications support visual customization through props rather than predefined variant names:

**Color Schemes** (`color` prop):
- Default: Blue (theme primary)
- Semantic colors: `red`, `green`, `yellow`, `orange`, `teal`, `blue`, `cyan`, `pink`, `grape`
- All Mantine theme colors supported
- Applied to notification background and icon color

```jsx
// Success notification (green)
notifications.show({
  title: 'Success',
  message: 'Your changes have been saved',
  color: 'green',
});

// Error notification (red)
notifications.show({
  title: 'Error',
  message: 'Something went wrong',
  color: 'red',
});

// Warning notification (yellow)
notifications.show({
  title: 'Warning',
  message: 'Please review your input',
  color: 'yellow',
});
```

**Visual Customization Options**:

**Border Style** (`withBorder` prop):
- Boolean flag to add border styling
- Enhances notification visual prominence
- Example: `withBorder: true`

**Border Radius** (`radius` prop):
- Controls corner rounding
- Options: `xs`, `sm`, `md`, `lg`, `xl`
- Example: `radius: 'md'`

**Loading State** (`loading` prop):
- Shows spinner indicator
- Typically paired with `autoClose: false` for manual control
- Example: `loading: true`

### States

**Standard Display State**:
- Default notification appearance
- Shows title and message
- Optional close button
- Auto-dismisses after timeout (default 4000ms)

```jsx
notifications.show({
  title: 'Notification',
  message: 'This is a standard notification',
});
```

**Loading State**:
- Visual spinner indicator
- Used for ongoing operations
- Typically disables auto-close and close button
- Can be transformed via `update()` method

```jsx
const id = notifications.show({
  loading: true,
  title: 'Loading your data',
  message: 'Please wait...',
  autoClose: false,
  withCloseButton: false,
});

// Transform loading state to success
setTimeout(() => {
  notifications.update({
    id,
    color: 'teal',
    title: 'Data was loaded',
    message: 'Your data is ready',
    icon: <IconCheck />,
    loading: false,
    autoClose: 2000,
  });
}, 3000);
```

**Persistent State**:
- Does not auto-dismiss
- Requires manual dismissal via close button or programmatic `hide()`
- Set via `autoClose: false`

```jsx
notifications.show({
  title: 'Important',
  message: 'This notification stays until you dismiss it',
  autoClose: false,
  withCloseButton: true,
});
```

**Color-Based Semantic States**:
- Success: `color: 'green'`
- Error: `color: 'red'`
- Warning: `color: 'yellow'` or `'orange'`
- Info: `color: 'blue'` or `'cyan'`

### Sizing Options

Mantine Notifications do not have explicit size variants. Size is controlled through:

**Radius Control** (`radius` prop):
- `xs` - Minimal rounding (1-2px)
- `sm` - Small rounding (4px)
- `md` - Medium rounding (8px) - default
- `lg` - Large rounding (12px)
- `xl` - Extra large rounding (16px)

**Content-Based Sizing**:
- Width adapts to content and container
- Height determined by title and message length
- Icon size follows theme defaults
- Typography uses Mantine's text system

**Custom Sizing** (via style prop):
```jsx
notifications.show({
  title: 'Custom sized',
  message: 'This notification has custom width',
  style: { width: 400 },
});
```

### Layout & Positioning

**Screen Positions** (`position` prop):

Six predefined positions available:
- `top-left` - Upper left corner
- `top-center` - Top center
- `top-right` - Upper right corner (common default)
- `bottom-left` - Lower left corner
- `bottom-center` - Bottom center
- `bottom-right` - Lower right corner

**Global Default Position** (on Notifications component):
```jsx
<Notifications position="top-right" zIndex={1000} />
```

**Per-Notification Position Override**:
```jsx
notifications.show({
  title: 'Top Center',
  message: 'This appears at top center',
  position: 'top-center',
});
```

**Z-Index Control**:
- Set globally on `<Notifications />` component
- Ensures notifications appear above other content
- Default is high z-index for overlay visibility
- Example: `<Notifications zIndex={2000} />`

**Stacking Behavior**:
- Notifications stack vertically in their position
- Newest notifications appear at top of stack (top positions) or bottom of stack (bottom positions)
- Spacing between notifications is automatic
- Respects container boundaries

### Content & Structure

**Title and Message Structure**:
```jsx
notifications.show({
  title: 'Notification Title',      // Optional heading
  message: 'Notification message',  // Required body text
});
```

**Icon Integration**:
```jsx
import { IconCheck } from '@tabler/icons-react';

notifications.show({
  title: 'Success',
  message: 'Operation completed',
  icon: <IconCheck size={18} />,  // Custom icon component
  color: 'green',
});
```

**Close Button Control**:
```jsx
// With close button (default)
notifications.show({
  message: 'Dismissible notification',
  withCloseButton: true,
});

// Without close button
notifications.show({
  message: 'Auto-dismiss only',
  withCloseButton: false,
  autoClose: 3000,
});
```

**Custom Styling**:
```jsx
// Inline styles
notifications.show({
  title: 'Custom styled',
  message: 'With custom styles',
  style: { backgroundColor: '#f0f0f0' },
  className: 'my-notification',
});

// CSS Modules
notifications.show({
  title: 'Themed notification',
  message: 'Using CSS modules',
  classNames: {
    root: classes.root,
    title: classes.title,
    description: classes.description,
  },
});
```

### Interactive Features

**Manual Dismissal**:
```jsx
const id = notifications.show({
  title: 'Manual control',
  message: 'Dismiss this manually',
  autoClose: false,
});

// Dismiss programmatically
function handleDismiss() {
  notifications.hide(id);
}
```

**Dynamic Updates**:
```jsx
const id = notifications.show({
  loading: true,
  title: 'Processing',
  message: 'Please wait...',
  autoClose: false,
  withCloseButton: false,
});

// Update after async operation
async function processData() {
  try {
    await someAsyncOperation();
    notifications.update({
      id,
      color: 'teal',
      title: 'Success',
      message: 'Processing complete',
      icon: <IconCheck />,
      loading: false,
      autoClose: 2000,
    });
  } catch (error) {
    notifications.update({
      id,
      color: 'red',
      title: 'Error',
      message: error.message,
      icon: <IconX />,
      loading: false,
      autoClose: 4000,
    });
  }
}
```

**Lifecycle Callbacks**:
```jsx
notifications.show({
  title: 'With callbacks',
  message: 'Lifecycle events tracked',
  onOpen: () => {
    console.log('Notification opened');
  },
  onClose: () => {
    console.log('Notification closed');
  },
});
```

### Animation & Transitions

**Built-in Animations**:
- Notifications animate in with bounce/slide effect
- Smooth transition when appearing and disappearing
- CSS-based animations (`animation-1s6mpx1` class)
- No configuration needed - automatic

**Transition Timing**:
- Enter animation: ~300-400ms
- Exit animation: ~200-300ms
- Smooth height collapse when dismissed
- Queue transitions are seamless

**Auto-Close Timing**:
```jsx
// Global default (Notifications component)
<Notifications autoClose={4000} />

// Per-notification override
notifications.show({
  message: 'Custom timing',
  autoClose: 8000, // 8 seconds
});

// Disable auto-close
notifications.show({
  message: 'Manual only',
  autoClose: false,
});
```

### Integration Patterns

**Form Submission Feedback**:
```jsx
async function handleSubmit(formData) {
  const id = notifications.show({
    loading: true,
    title: 'Submitting form',
    message: 'Please wait...',
    autoClose: false,
  });

  try {
    await submitForm(formData);
    notifications.update({
      id,
      color: 'green',
      title: 'Success',
      message: 'Form submitted successfully',
      icon: <IconCheck />,
      loading: false,
      autoClose: 3000,
    });
  } catch (error) {
    notifications.update({
      id,
      color: 'red',
      title: 'Submission failed',
      message: error.message,
      icon: <IconX />,
      loading: false,
      autoClose: 5000,
    });
  }
}
```

**File Upload Progress**:
```jsx
async function handleFileUpload(file) {
  const id = notifications.show({
    loading: true,
    title: 'Uploading file',
    message: `${file.name} - 0%`,
    autoClose: false,
    withCloseButton: false,
  });

  try {
    await uploadFile(file, (progress) => {
      notifications.update({
        id,
        loading: true,
        message: `${file.name} - ${progress}%`,
      });
    });

    notifications.update({
      id,
      color: 'green',
      title: 'Upload complete',
      message: `${file.name} uploaded successfully`,
      icon: <IconCheck />,
      loading: false,
      autoClose: 3000,
    });
  } catch (error) {
    notifications.update({
      id,
      color: 'red',
      title: 'Upload failed',
      message: error.message,
      icon: <IconX />,
      loading: false,
      autoClose: 4000,
    });
  }
}
```

**Multi-Step Process**:
```jsx
async function multiStepProcess() {
  const id = notifications.show({
    loading: true,
    title: 'Step 1/3',
    message: 'Processing first step...',
    autoClose: false,
  });

  await step1();
  notifications.update({
    id,
    title: 'Step 2/3',
    message: 'Processing second step...',
  });

  await step2();
  notifications.update({
    id,
    title: 'Step 3/3',
    message: 'Processing final step...',
  });

  await step3();
  notifications.update({
    id,
    color: 'green',
    title: 'Complete',
    message: 'All steps completed successfully',
    icon: <IconCheck />,
    loading: false,
    autoClose: 3000,
  });
}
```

**Queue Management Pattern**:
```jsx
// Set notification limit
<Notifications limit={5} />

// Notifications beyond limit enter queue
function showMultipleNotifications() {
  for (let i = 0; i < 10; i++) {
    notifications.show({
      title: `Notification ${i + 1}`,
      message: `This is notification number ${i + 1}`,
    });
  }
  // Only 5 show at once, rest queued
}

// Clear queue
function clearQueue() {
  notifications.cleanQueue();
}

// Clear all (displayed + queued)
function clearAll() {
  notifications.clean();
}
```

### Accessibility Features

**Implicit Accessibility**:
- Notifications component renders in a portal
- Screen readers can announce new notifications
- Close button is keyboard accessible
- Visual focus indicators on interactive elements

**Semantic Structure**:
- Title uses heading semantics
- Message uses descriptive text
- Icon provides visual context
- Color should not be sole indicator of meaning

**Best Practices**:
- Always include both title and message for context
- Use icons alongside color for semantic meaning
- Provide clear, actionable text
- Don't rely on color alone (add icon for success/error)
- Ensure sufficient auto-close time for reading
- Use `withCloseButton: true` for important messages

**Keyboard Support**:
- Tab key navigates to close button
- Enter/Space activates close button
- Escape key (if implemented) can dismiss
- Focus management is automatic

**Screen Reader Considerations**:
```jsx
// Good: Clear, descriptive content
notifications.show({
  title: 'Form submission successful',
  message: 'Your profile has been updated',
  color: 'green',
  icon: <IconCheck />,
});

// Avoid: Ambiguous or icon-only
notifications.show({
  icon: <IconCheck />,
  // Missing title and message - not accessible
});
```

## Key Properties/Props

### Notifications Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Global default position for notifications |
| `limit` | `number` | `undefined` (no limit) | Maximum number of notifications displayed simultaneously. Excess notifications enter queue |
| `zIndex` | `number` | `9999` | CSS z-index value for notification container |
| `autoClose` | `number \| false` | `4000` | Global auto-close timeout in milliseconds. Individual notifications can override |
| `containerWidth` | `number \| string` | `440px` | Width of notification container |

**Example**:
```jsx
<Notifications
  position="top-right"
  limit={5}
  zIndex={2000}
  autoClose={5000}
/>
```

### notifications.show() Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | Auto-generated | Unique identifier for the notification. Required for `update()` and `hide()` |
| `message` | `ReactNode` | **Required** | Main notification content text |
| `title` | `ReactNode` | `undefined` | Optional heading text |
| `color` | `string` | `'blue'` | Notification color from Mantine theme (red, green, blue, yellow, etc.) |
| `icon` | `ReactNode` | `undefined` | Custom icon element (e.g., `<IconCheck />`) |
| `loading` | `boolean` | `false` | Show loading spinner indicator |
| `autoClose` | `number \| false` | Component default (4000) | Milliseconds before auto-dismiss. `false` disables |
| `withCloseButton` | `boolean` | `true` | Show close button for manual dismissal |
| `withBorder` | `boolean` | `false` | Add border styling to notification |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Border radius size |
| `position` | `string` | Component default | Override component position for this notification |
| `className` | `string` | `undefined` | CSS class name for custom styling |
| `style` | `CSSProperties` | `undefined` | Inline styles object |
| `classNames` | `object` | `undefined` | CSS module classes for Styles API |
| `onOpen` | `() => void` | `undefined` | Callback when notification mounts |
| `onClose` | `() => void` | `undefined` | Callback when notification unmounts |

### notifications.update() Props

Same props as `show()`, but `id` is required to identify which notification to update.

### Method Signatures

**notifications.show()**:
```typescript
notifications.show(props: NotificationData): string
// Returns: notification ID
```

**notifications.hide()**:
```typescript
notifications.hide(id: string): void
```

**notifications.update()**:
```typescript
notifications.update(props: NotificationData & { id: string }): void
```

**notifications.clean()**:
```typescript
notifications.clean(): void
// Clears all notifications and queue
```

**notifications.cleanQueue()**:
```typescript
notifications.cleanQueue(): void
// Clears queue only, keeps displayed notifications
```

**notifications.updateState()**:
```typescript
notifications.updateState(
  callback: (state: NotificationsState) => NotificationsState
): void
```

## Code Examples

### Example 1: Basic Notification
```jsx
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function BasicNotification() {
  return (
    <Button
      onClick={() =>
        notifications.show({
          title: 'Default notification',
          message: 'Hey there, your code is awesome! 🤥',
        })
      }
    >
      Show notification
    </Button>
  );
}
```

### Example 2: Success Notification with Icon
```jsx
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export function SuccessNotification() {
  return (
    <Button
      onClick={() =>
        notifications.show({
          title: 'Success',
          message: 'Your changes have been saved successfully',
          color: 'green',
          icon: <IconCheck size={18} />,
        })
      }
    >
      Show success
    </Button>
  );
}
```

### Example 3: Error Notification
```jsx
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export function ErrorNotification() {
  return (
    <Button
      onClick={() =>
        notifications.show({
          title: 'Error',
          message: 'Something went wrong. Please try again.',
          color: 'red',
          icon: <IconX size={18} />,
        })
      }
    >
      Show error
    </Button>
  );
}
```

### Example 4: Loading to Success Transformation
```jsx
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export function LoadingNotification() {
  const handleClick = () => {
    const id = notifications.show({
      loading: true,
      title: 'Loading your data',
      message: 'Data will be loaded in 3 seconds, you cannot close this yet',
      autoClose: false,
      withCloseButton: false,
    });

    setTimeout(() => {
      notifications.update({
        id,
        color: 'teal',
        title: 'Data loaded',
        message: 'Notification will close in 2 seconds',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 2000,
      });
    }, 3000);
  };

  return <Button onClick={handleClick}>Show loading notification</Button>;
}
```

### Example 5: Different Positions
```jsx
import { Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function PositionedNotifications() {
  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  return (
    <Stack>
      {positions.map((position) => (
        <Button
          key={position}
          onClick={() =>
            notifications.show({
              title: `${position} notification`,
              message: `This notification appears at ${position}`,
              position: position,
            })
          }
        >
          Show at {position}
        </Button>
      ))}
    </Stack>
  );
}
```

### Example 6: Custom Styling
```jsx
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function CustomStyledNotification() {
  return (
    <Button
      onClick={() =>
        notifications.show({
          title: 'Custom styled notification',
          message: 'This notification has custom styling',
          withBorder: true,
          radius: 'lg',
          style: {
            backgroundColor: '#f0f9ff',
            borderColor: '#3b82f6',
          },
          className: 'custom-notification',
        })
      }
    >
      Show custom styled
    </Button>
  );
}
```

### Example 7: Queue Management
```jsx
import { Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function QueueManagement() {
  const showMany = () => {
    Array(10)
      .fill(0)
      .forEach((_, index) => {
        notifications.show({
          title: `Notification ${index + 1}`,
          message: `This is notification number ${index + 1}`,
        });
      });
  };

  return (
    <Group>
      <Button onClick={showMany}>Show 10 notifications</Button>
      <Button onClick={() => notifications.cleanQueue()} variant="outline">
        Clear queue
      </Button>
      <Button onClick={() => notifications.clean()} variant="outline" color="red">
        Clear all
      </Button>
    </Group>
  );
}
```

### Example 8: Persistent Notification
```jsx
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function PersistentNotification() {
  return (
    <Button
      onClick={() =>
        notifications.show({
          title: 'Important message',
          message: 'This notification will not auto-close. Click X to dismiss.',
          autoClose: false,
          withCloseButton: true,
          color: 'orange',
        })
      }
    >
      Show persistent notification
    </Button>
  );
}
```

### Example 9: Manual Dismissal
```jsx
import { Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function ManualDismissal() {
  const [notificationId, setNotificationId] = React.useState(null);

  const showNotification = () => {
    const id = notifications.show({
      title: 'Manual control',
      message: 'Click the button to dismiss this notification',
      autoClose: false,
      withCloseButton: false,
    });
    setNotificationId(id);
  };

  const hideNotification = () => {
    if (notificationId) {
      notifications.hide(notificationId);
      setNotificationId(null);
    }
  };

  return (
    <Group>
      <Button onClick={showNotification}>Show notification</Button>
      <Button onClick={hideNotification} variant="outline">
        Hide notification
      </Button>
    </Group>
  );
}
```

### Example 10: Form Submission Pattern
```jsx
import { Button, TextInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export function FormSubmissionNotification() {
  const form = useForm({
    initialValues: { email: '' },
  });

  const handleSubmit = async (values) => {
    const id = notifications.show({
      loading: true,
      title: 'Submitting form',
      message: 'Please wait while we process your request',
      autoClose: false,
      withCloseButton: false,
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      notifications.update({
        id,
        color: 'green',
        title: 'Form submitted',
        message: 'Your form has been submitted successfully',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 3000,
      });

      form.reset();
    } catch (error) {
      notifications.update({
        id,
        color: 'red',
        title: 'Submission failed',
        message: 'There was an error submitting your form',
        icon: <IconX size={18} />,
        loading: false,
        autoClose: 4000,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
```

## Accessibility Notes

**ARIA Implementation**:
- Notifications render in a portal for proper stacking context
- Screen readers can detect and announce new notifications
- Close buttons are keyboard accessible and focusable
- Semantic HTML structure with appropriate roles

**Keyboard Support**:
- **Tab**: Focuses the close button (when `withCloseButton: true`)
- **Enter/Space**: Activates close button to dismiss notification
- **Escape**: Not natively supported but can be implemented
- Focus management is automatic within notification portal

**Screen Reader Behavior**:
- New notifications are announced when they appear
- Title and message content read in sequence
- Loading state announced appropriately
- Updates to existing notifications may or may not be re-announced (depends on implementation)

**Best Practices for Accessibility**:
1. **Provide context**: Always include both `title` and `message` for clarity
2. **Don't rely on color alone**: Use icons alongside colors for semantic meaning
3. **Timing considerations**: Ensure `autoClose` duration is sufficient for reading (minimum 4-5 seconds for important content)
4. **Persistent messages**: Use `autoClose: false` with `withCloseButton: true` for critical information
5. **Clear language**: Use descriptive, actionable text rather than technical jargon
6. **Icon semantics**: Pair success/error/warning states with appropriate icons (✓, ✗, ⚠)
7. **Motion sensitivity**: Consider users with motion sensitivity (built-in animations are subtle)

**Color Accessibility**:
- Theme colors meet WCAG contrast requirements
- Works in both light and dark modes
- Icons provide redundant information alongside color
- Text content is primary information carrier

## Common Patterns

1. **Loading → Success/Error Transformation**: Show loading state during async operations, then update to success or error state based on outcome
2. **Form Submission Feedback**: Immediate loading notification on submit, followed by success or error notification
3. **File Upload Progress**: Loading notification with progressive message updates showing upload percentage
4. **Multi-Step Process Updates**: Single notification that updates its message as process progresses through steps
5. **Batch Operation Feedback**: Queue multiple notifications for batch operations with limit to prevent UI overflow
6. **Critical Persistent Messages**: Important notifications with `autoClose: false` requiring manual user acknowledgment
7. **Success Confirmation**: Quick auto-dismissing green notifications with checkmark icon for completed actions
8. **Error Recovery**: Error notifications with longer auto-close time and close button for user control
9. **Informational Alerts**: Blue notifications with info icon for non-critical updates and system messages
10. **Warning Prompts**: Orange/yellow notifications for cautionary messages that require user attention

## Related Components

- **Alert** - Static alert messages embedded in page content (not floating)
- **Dialog/Modal** - For actions requiring user input or critical decisions
- **Tooltip** - For contextual help and brief information on hover
- **Badge** - For status indicators and counts
- **Loader** - For loading states without notification context
- **Banner** - For persistent page-level announcements

**When to use Notifications vs Alternatives**:
- Use **Notifications** for: Transient feedback, async operation status, non-blocking alerts
- Use **Alert** for: Static, persistent page-level messages
- Use **Dialog** for: Actions requiring user decision or input
- Use **Tooltip** for: Contextual help that doesn't persist

## Notable Features

- **Non-Provider Architecture**: Unlike many notification systems, Mantine doesn't require a provider wrapper - notifications component is a regular component that can be placed anywhere (though typically at root)
- **Imperative API**: Call `notifications.show()` from anywhere in your application without prop drilling or context
- **Queue Management**: Automatic queuing system when notification limit is reached, with queue-specific management methods
- **Dynamic Updates**: Transform notifications in place via `update()` method - perfect for loading → success/error patterns
- **Position Flexibility**: Six predefined positions with per-notification override capability
- **Loading State Built-in**: Native loading prop with spinner integration for async operations
- **Lifecycle Callbacks**: `onOpen` and `onClose` callbacks for tracking notification lifecycle
- **Theme Integration**: Full integration with Mantine theme system including color schemes and dark mode
- **Auto-Close Control**: Global and per-notification auto-close timing with option to disable
- **CSS Module Support**: Advanced styling via `classNames` prop for Styles API integration
- **No Animation Configuration**: Smooth animations work out of box with no configuration needed
- **Border Customization**: Optional border styling via `withBorder` prop
- **Manual Dismissal Control**: Programmatic `hide()` method for manual notification management
- **State Subscription**: `useNotifications` hook for monitoring notification state and queue
- **Proper Style Layering**: Critical requirement to import notification styles after core styles for proper positioning

---

**Research completed:** 2025-11-05
**Component:** Notifications
**Framework:** Mantine
**Documentation:** https://mantine.dev/x/notifications

**Key Differentiators from Other Frameworks**:
- Imperative API design (vs provider-based approaches in Chakra UI)
- Built-in queue management with configurable limits
- Dynamic notification updates via `update()` method
- Non-provider architecture for simpler setup
- Separate package (`@mantine/notifications`) rather than core component
- Loading state as first-class feature
- Six position options with global and per-notification control
