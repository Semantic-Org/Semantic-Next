# Mantine Alert & Notification - Usage Patterns

> Research Date: 2025-11-06
> Component URLs:
> - Alert: https://mantine.dev/core/alert/
> - Notification: https://mantine.dev/core/notification/
> - Notifications System: https://mantine.dev/x/notifications/

## Component Overview

Mantine provides two distinct but related components for user messaging:

**Alert Component** (`@mantine/core`): A static feedback component that attracts user attention with important messages. Alerts are typically embedded directly in the page layout and remain visible until dismissed (if dismissible). They are ideal for contextual messages, warnings, errors, or informational content that needs to be displayed inline.

**Notification Component** (`@mantine/core`): A base component for building notification systems. It serves as the visual foundation that can be used standalone or as part of the full-featured `@mantine/notifications` package system for toast-style notifications.

**Notifications System** (`@mantine/notifications`): A complete notification management system built on the base Notification component, providing features like queue management, auto-dismiss, positioning, and programmatic control for toast-style notifications.

---

## Alert Component

### Core Patterns

The Alert is a static, inline feedback component that combines:
- Optional icon for visual reinforcement
- Optional title for message hierarchy
- Message content (children)
- Optional close button for dismissal
- Semantic role for accessibility

The component wraps content in a styled container with role="alert" for screen reader announcements.

**Basic Structure:**
```jsx
import { Alert } from '@mantine/core';

<Alert variant="light" color="blue" title="Alert title">
  Message content here
</Alert>
```

### Props & Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'light' \| 'outline' \| 'transparent' \| 'white'` | `'light'` | Visual style variant |
| `color` | `string` | - | Color theme (supports Mantine color system) |
| `title` | `string` | - | Optional alert heading |
| `icon` | `ReactNode` | - | Icon element to display (left-aligned) |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | theme default | Border radius size |
| `withCloseButton` | `boolean` | `false` | Shows dismissal button |
| `closeButtonLabel` | `string` | - | Accessibility label for close button |
| `children` | `ReactNode` | - | **Required.** Main message content |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Inline styles |

**Styles API Elements:**
- `root` - Container element
- `wrapper` - Wraps body and icon together
- `body` - Content container (title + message)
- `title` - Title text element
- `label` - (Legacy/deprecated name for title)
- `message` - Message/children content
- `icon` - Icon element wrapper
- `closeButton` - Close button element

### Visual Patterns

#### Variants

**1. Light Variant (Default)**
Subtle background with colored accent, ideal for informational messages:
```jsx
<Alert variant="light" color="blue" title="Information">
  This is a light alert variant
</Alert>
```

**2. Filled Variant**
Solid colored background with contrasting text for high emphasis:
```jsx
<Alert variant="filled" color="red" title="Error">
  This is a filled alert variant with high visibility
</Alert>
```

**3. Outline Variant**
Border-only styling for minimal visual weight:
```jsx
<Alert variant="outline" color="orange" title="Warning">
  This is an outline alert variant
</Alert>
```

**4. Transparent Variant**
No background, text-only with colored accent:
```jsx
<Alert variant="transparent" color="teal">
  Minimal styling for subtle messages
</Alert>
```

**5. White Variant**
White background with colored borders/text:
```jsx
<Alert variant="white" color="grape">
  White background variant
</Alert>
```

#### Colors

Supports full Mantine color system:
- Semantic colors: `blue` (info), `red` (error), `orange` (warning), `green` (success)
- Extended palette: `teal`, `cyan`, `grape`, `violet`, `indigo`, `pink`, etc.
- Custom theme colors

```jsx
<Alert color="blue" title="Info">Informational message</Alert>
<Alert color="red" title="Error">Error message</Alert>
<Alert color="orange" title="Warning">Warning message</Alert>
<Alert color="green" title="Success">Success message</Alert>
```

#### Icons

Icons are passed as React elements and positioned on the left side:
```jsx
import { IconInfoCircle, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';

<Alert icon={<IconInfoCircle />} title="Info" color="blue">
  Informational alert with icon
</Alert>

<Alert icon={<IconAlertTriangle />} title="Warning" color="orange">
  Warning alert with icon
</Alert>

<Alert icon={<IconCheck />} title="Success" color="green">
  Success alert with icon
</Alert>

<Alert icon={<IconX />} title="Error" color="red">
  Error alert with icon
</Alert>
```

#### Border Radius

Control corner rounding with radius prop:
```jsx
<Alert radius="xs">Extra small radius</Alert>
<Alert radius="sm">Small radius</Alert>
<Alert radius="md">Medium radius (default)</Alert>
<Alert radius="lg">Large radius</Alert>
<Alert radius="xl">Extra large radius</Alert>
```

### Content Patterns

#### Title and Message Hierarchy

**Title Only:**
```jsx
<Alert title="Important Message" />
```

**Message Only:**
```jsx
<Alert>This is a simple message without a title</Alert>
```

**Title + Message:**
```jsx
<Alert title="Account Verified" color="green">
  Your email address has been successfully verified. You can now access all features.
</Alert>
```

#### Icon Positioning

Icons are always positioned on the left side of the alert, aligned with the title/message:
```jsx
<Alert
  icon={<IconInfoCircle />}
  title="With Icon"
  color="blue"
>
  The icon appears on the left side
</Alert>
```

#### Dismissible Alerts

Add close button for user dismissal:
```jsx
<Alert
  withCloseButton
  closeButtonLabel="Dismiss notification"
  title="Dismissible Alert"
>
  This alert can be closed by the user
</Alert>
```

**Note:** The `closeButtonLabel` is required for accessibility when using `withCloseButton`.

### Layout Patterns

#### Positioning

Alerts are block-level elements that take full width of their container. Position them inline within your layout:

```jsx
<div>
  <h1>Page Title</h1>

  <Alert color="yellow" title="Maintenance Notice">
    System maintenance scheduled for tonight
  </Alert>

  <p>Page content continues here...</p>
</div>
```

#### Sizing

Alerts expand to fill their container width. Control sizing via container or style props:

```jsx
// Container-based sizing
<div style={{ maxWidth: 500 }}>
  <Alert title="Contained Alert">
    This alert is constrained by its container
  </Alert>
</div>

// Direct style
<Alert style={{ maxWidth: 400 }} title="Fixed Width">
  This alert has a maximum width
</Alert>
```

#### Wrapper Structure

Internal layout structure:
```
Alert (root)
└── Wrapper
    ├── Icon (optional)
    └── Body
        ├── Title (optional)
        └── Message (children)
    └── CloseButton (optional, right-aligned)
```

### Accessibility

#### ARIA Attributes

The Alert component implements comprehensive ARIA support:

**1. Role Declaration:**
```html
<div role="alert">
  <!-- Alert content -->
</div>
```
The root element has `role="alert"` which causes screen readers to announce the content immediately when it appears.

**2. ARIA Labeling:**
```html
<div role="alert" aria-labelledby="alert-title" aria-describedby="alert-body">
  <div id="alert-title">Alert Title</div>
  <div id="alert-body">Alert message content</div>
</div>
```

- `aria-labelledby` connects to title element ID when title is present
- `aria-describedby` connects to body element ID for message content

**3. Close Button Accessibility:**

The close button requires proper labeling:
```jsx
<Alert
  withCloseButton
  closeButtonLabel="Dismiss notification"
>
  Message content
</Alert>
```

The documentation explicitly states: "Set `closeButtonLabel` prop to make close button accessible"

#### Best Practices

- Always provide `closeButtonLabel` when using `withCloseButton`
- Use semantic colors that match message intent (red for errors, etc.)
- Provide clear, concise titles that summarize the message
- Use icons to reinforce message type visually
- Ensure sufficient color contrast for text readability

---

## Notification Component

### Core Patterns

The Notification component is a base building block for notification systems. It provides the visual presentation but not the management layer (positioning, queue, auto-dismiss, etc.).

**Important Distinction:** This is the foundational component. For production notification systems, use the `@mantine/notifications` package which builds on this base.

**Basic Structure:**
```jsx
import { Notification } from '@mantine/core';

<Notification title="Notification title">
  Notification message content
</Notification>
```

### Props & Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Notification heading |
| `icon` | `ReactNode` | - | Custom icon element |
| `color` | `string` | - | Color theme |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | theme default | Border radius size |
| `loading` | `boolean` | `false` | Shows loader component |
| `withBorder` | `boolean` | `false` | Adds border styling |
| `withCloseButton` | `boolean` | `true` | Shows close button |
| `closeButtonProps` | `object` | - | Props for close button (including aria-label) |
| `children` | `ReactNode` | - | Description/message content |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `classNames` | `object` | - | Styles API for inner elements |

**Styles API Elements:**
- `root` - Container element
- `loader` - Loader component (visible when loading=true)
- `icon` - Icon display element
- `body` - Main content container
- `title` - Title text element
- `description` - Description/children content
- `closeButton` - Close button element

### Visual Patterns

#### Colors

Supports semantic color mapping:
```jsx
<Notification color="blue" title="Information">
  Blue for informational messages
</Notification>

<Notification color="red" title="Error">
  Red for error messages
</Notification>

<Notification color="teal" title="Success">
  Teal/green for success messages
</Notification>

<Notification color="orange" title="Warning">
  Orange for warnings
</Notification>
```

#### Icons

Icons are passed as React elements:
```jsx
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';

<Notification icon={<IconCheck size={20} />} color="teal" title="Success">
  Operation completed successfully
</Notification>

<Notification icon={<IconX size={20} />} color="red" title="Error">
  Operation failed
</Notification>

<Notification icon={<IconAlertTriangle size={20} />} color="orange" title="Warning">
  Please review your input
</Notification>
```

#### Loading State

Display loader instead of icon:
```jsx
<Notification loading title="Processing">
  Please wait while we process your request
</Notification>
```

When `loading={true}`, a loading spinner replaces the icon position.

#### Border Variant

Add border for additional visual separation:
```jsx
<Notification withBorder title="With Border">
  This notification has a border
</Notification>
```

#### Radius Options

Control corner rounding:
```jsx
<Notification radius="xs" title="Extra Small">Sharp corners</Notification>
<Notification radius="sm" title="Small">Slightly rounded</Notification>
<Notification radius="md" title="Medium">Default rounding</Notification>
<Notification radius="lg" title="Large">More rounded</Notification>
<Notification radius="xl" title="Extra Large">Very rounded</Notification>
```

### Content Patterns

#### Title and Description

**Title Only:**
```jsx
<Notification title="Quick Message" />
```

**Description Only:**
```jsx
<Notification>
  Simple notification without title
</Notification>
```

**Title + Description:**
```jsx
<Notification title="Update Available" color="blue">
  A new version of the application is ready to install. Click here to update now.
</Notification>
```

#### Close Button Configuration

The close button is enabled by default. Configure via `closeButtonProps`:

```jsx
<Notification
  title="Custom Close Button"
  closeButtonProps={{
    'aria-label': 'Hide notification',
    title: 'Close'
  }}
>
  Close button is configured for accessibility
</Notification>
```

Disable close button:
```jsx
<Notification
  withCloseButton={false}
  title="No Close Button"
>
  This notification cannot be closed
</Notification>
```

### Accessibility

#### Close Button Labels

The documentation emphasizes: "set close button aria-label or title with `closeButtonProps`"

```jsx
<Notification
  closeButtonProps={{
    'aria-label': 'Dismiss notification',
    title: 'Close notification'
  }}
>
  Properly labeled for screen readers
</Notification>
```

#### Screen Reader Support

- Title element is semantically marked for screen readers
- Description content is associated with notification
- Close button requires explicit labeling via `closeButtonProps`
- Loading state should be announced to screen readers

---

## Notifications System (@mantine/notifications)

### Core Patterns

The `@mantine/notifications` package provides a complete notification management system with:
- Queue-based notification display
- Auto-dismiss functionality
- Position management
- Programmatic control (show, hide, update)
- Limit controls for maximum displayed notifications

**Architecture:**
- `Notifications` component - Container/manager (rendered once in app)
- `notifications` object - API for controlling notifications
- Based on the core `Notification` component for visuals

### Setup & Installation

**1. Install Package:**
```bash
npm install @mantine/notifications
# or
yarn add @mantine/notifications
```

**2. Import Styles:**
```javascript
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
```

**Note:** Notifications styles must be imported after core styles.

**3. Render Notifications Component:**
```jsx
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      {/* Your app content */}
    </MantineProvider>
  );
}
```

**Important:**
- Render only ONE `Notifications` component instance
- Must be inside `MantineProvider`
- It's a regular component, not a provider
- Configuration props go on this component

### Props & Configuration

#### Notifications Component Props

Configure the notification container:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `Position` | `'bottom-right'` | Default position for notifications |
| `autoClose` | `number \| false` | `4000` | Default auto-close timeout (ms) |
| `limit` | `number` | - | Maximum number of displayed notifications |
| `zIndex` | `number` | `400` | Z-index for notification container |

**Position Options:**
- `'top-left'`
- `'top-center'`
- `'top-right'`
- `'bottom-left'`
- `'bottom-center'`
- `'bottom-right'`

**Example Configuration:**
```jsx
<Notifications
  position="top-right"
  autoClose={5000}
  limit={5}
  zIndex={1000}
/>
```

#### Notification Properties

When calling `notifications.show()` or `notifications.update()`:

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string \| ReactNode` | **Required.** Notification body content |
| `id` | `string` | Unique identifier (auto-generated if omitted) |
| `title` | `string \| ReactNode` | Optional notification heading |
| `position` | `Position` | Override default position |
| `withBorder` | `boolean` | Adds border styling |
| `withCloseButton` | `boolean` | Shows close button |
| `autoClose` | `number \| false` | Auto-close timeout in milliseconds |
| `color` | `string` | Notification color theme |
| `icon` | `ReactNode` | Custom icon element |
| `radius` | `MantineSize` | Border radius size |
| `className` | `string` | Custom CSS class |
| `style` | `CSSProperties` | Inline styles |
| `classNames` | `object` | Styles API for inner elements |
| `loading` | `boolean` | Shows loading indicator |
| `onOpen` | `(props) => void` | Callback when notification mounts |
| `onClose` | `(props) => void` | Callback when notification unmounts |

### API Methods

The `notifications` object provides these methods:

#### notifications.show()

Display a new notification:

```javascript
import { notifications } from '@mantine/notifications';

notifications.show({
  title: 'Notification Title',
  message: 'Notification message content',
  color: 'blue',
  icon: <IconCheck />
});
```

**With ID for later reference:**
```javascript
const id = notifications.show({
  id: 'my-notification',
  title: 'Upload Started',
  message: 'Processing your file...',
  loading: true,
  autoClose: false
});
```

#### notifications.hide()

Remove a specific notification:

```javascript
const id = notifications.show({ message: 'Hello' });

// Later...
notifications.hide(id);
```

#### notifications.update()

Modify a displayed or queued notification:

```javascript
const id = notifications.show({
  id: 'upload',
  loading: true,
  title: 'Uploading...',
  message: 'Please wait',
  autoClose: false,
  withCloseButton: false
});

// Update after completion
setTimeout(() => {
  notifications.update({
    id: 'upload',
    title: 'Upload Complete',
    message: 'File uploaded successfully',
    color: 'green',
    icon: <IconCheck />,
    loading: false,
    autoClose: 3000
  });
}, 3000);
```

#### notifications.clean()

Remove all notifications and clear queue:

```javascript
notifications.clean();
```

#### notifications.cleanQueue()

Remove only queued notifications (not displayed ones):

```javascript
notifications.cleanQueue();
```

#### notifications.updateState()

Execute callback with current notifications state:

```javascript
notifications.updateState((state) => {
  console.log('Displayed:', state.notifications);
  console.log('Queued:', state.queue);
});
```

#### Alternative Import Syntax

Functions can be imported individually:

```javascript
import {
  showNotification,
  hideNotification,
  updateNotification,
  cleanNotifications,
  cleanNotificationsQueue,
  updateNotificationsState
} from '@mantine/notifications';

showNotification({ message: 'Hello' });
```

### Behavioral Patterns

#### Auto-Close

**Global Default:**
Set on Notifications component:
```jsx
<Notifications autoClose={5000} />
```

**Per-Notification Override:**
```javascript
notifications.show({
  message: 'Closes in 2 seconds',
  autoClose: 2000
});

notifications.show({
  message: 'Never closes automatically',
  autoClose: false
});
```

Per-notification setting takes precedence over component default.

#### Queue Management

**Set Display Limit:**
```jsx
<Notifications limit={5} />
```

When limit is reached:
- Additional notifications are queued automatically
- Queued notifications display as others close
- Queue is FIFO (first in, first out)

**Clear Queue:**
```javascript
// Remove queued notifications only
notifications.cleanQueue();

// Remove all (displayed + queued)
notifications.clean();
```

#### Loading State Pattern

Common pattern for async operations:

```javascript
// Start operation
const id = notifications.show({
  loading: true,
  title: 'Processing',
  message: 'Operation in progress...',
  autoClose: false,
  withCloseButton: false
});

// Simulate async operation
performAsyncOperation()
  .then(() => {
    // Success
    notifications.update({
      id,
      title: 'Success',
      message: 'Operation completed successfully',
      color: 'green',
      icon: <IconCheck />,
      loading: false,
      autoClose: 3000
    });
  })
  .catch(() => {
    // Error
    notifications.update({
      id,
      title: 'Error',
      message: 'Operation failed',
      color: 'red',
      icon: <IconX />,
      loading: false,
      autoClose: false
    });
  });
```

#### Update Workflow

Notifications can be updated multiple times:

```javascript
const id = notifications.show({
  loading: true,
  title: 'Step 1',
  message: 'Starting...',
  autoClose: false
});

// Update to step 2
setTimeout(() => {
  notifications.update({
    id,
    title: 'Step 2',
    message: 'Processing...'
  });
}, 2000);

// Update to completion
setTimeout(() => {
  notifications.update({
    id,
    title: 'Complete',
    message: 'All steps finished',
    loading: false,
    autoClose: 2000
  });
}, 4000);
```

### Positioning Patterns

#### Default Position

Set on component:
```jsx
<Notifications position="top-right" />
```

#### Per-Notification Position

Override default for specific notification:
```javascript
notifications.show({
  message: 'Top center notification',
  position: 'top-center'
});

notifications.show({
  message: 'Bottom left notification',
  position: 'bottom-left'
});
```

#### Position Options

Six placement positions available:

**Top Row:**
- `top-left` - Upper left corner
- `top-center` - Top center (horizontal middle)
- `top-right` - Upper right corner

**Bottom Row:**
- `bottom-left` - Lower left corner
- `bottom-center` - Bottom center (horizontal middle)
- `bottom-right` - Lower right corner

#### Stacking Behavior

- Notifications stack vertically at their position
- Newer notifications appear at the edge (top for top positions, bottom for bottom positions)
- When notifications close, remaining ones animate into place
- Multiple positions can be active simultaneously

```javascript
// These will stack in top-right
notifications.show({ message: 'First', position: 'top-right' });
notifications.show({ message: 'Second', position: 'top-right' });
notifications.show({ message: 'Third', position: 'top-right' });

// This will appear separately in bottom-left
notifications.show({ message: 'Different position', position: 'bottom-left' });
```

### Lifecycle & State

#### Callbacks

Monitor notification lifecycle:

```javascript
notifications.show({
  message: 'Tracked notification',
  onOpen: (props) => {
    console.log('Notification opened', props);
  },
  onClose: (props) => {
    console.log('Notification closed', props);
  }
});
```

#### State Subscription

Use the `useNotifications` hook to monitor state:

```jsx
import { useNotifications } from '@mantine/notifications';

function NotificationMonitor() {
  const { notifications: displayed, queue } = useNotifications();

  return (
    <div>
      <p>Displayed: {displayed.length}</p>
      <p>Queued: {queue.length}</p>
    </div>
  );
}
```

**Returns:**
- `notifications` - Array of currently displayed notifications
- `queue` - Array of queued notifications awaiting display

### Accessibility

#### Screen Reader Support

- Notifications are announced when they appear
- Title and message content are properly associated
- Close button requires proper labeling

**Best Practice:**
```javascript
notifications.show({
  title: 'Update Available',
  message: 'A new version is ready to install',
  closeButtonProps: {
    'aria-label': 'Dismiss update notification'
  }
});
```

#### Keyboard Support

- Close buttons are keyboard accessible
- Focus management during notification lifecycle
- Supports standard keyboard navigation

#### Auto-Dismiss Considerations

For accessibility:
- Ensure auto-close timeouts are sufficient for reading content
- Provide manual close option for important messages
- Consider disabling auto-close for critical notifications

```javascript
// Accessible pattern for important message
notifications.show({
  title: 'Important Update',
  message: 'Please review this information carefully',
  color: 'red',
  autoClose: false, // Don't auto-dismiss important messages
  withCloseButton: true
});
```

---

## Framework-Specific Features

### Mantine Design System Integration

Both components integrate deeply with Mantine's design system:

**1. Theme Integration:**
- Respects theme colors, spacing, and typography
- Uses theme default radius values
- Follows theme font settings

**2. Styles API:**
All components support Mantine's Styles API for granular customization:

```jsx
<Alert
  classNames={{
    root: 'custom-alert-root',
    title: 'custom-alert-title',
    message: 'custom-alert-message'
  }}
/>

<Notification
  classNames={{
    root: 'custom-notification-root',
    title: 'custom-notification-title',
    description: 'custom-notification-description'
  }}
/>
```

**3. Polymorphic Components:**
Can render as different HTML elements while maintaining functionality

**4. Size System:**
Radius values follow Mantine's size scale (xs, sm, md, lg, xl)

### Icon Library (@tabler/icons-react)

Mantine's examples use Tabler Icons, but any React icon library works:

```jsx
// Tabler Icons (common in Mantine docs)
import { IconCheck } from '@tabler/icons-react';
<Alert icon={<IconCheck />} />

// Or any other icon library
import { FaCheck } from 'react-icons/fa';
<Alert icon={<FaCheck />} />
```

### TypeScript Support

Full TypeScript definitions included:

```typescript
import { AlertProps, NotificationProps } from '@mantine/core';
import { NotificationsProps, ShowNotificationProps } from '@mantine/notifications';

const alertConfig: AlertProps = {
  variant: 'filled',
  color: 'blue',
  title: 'Type-safe alert'
};

notifications.show({
  title: 'Type-safe notification',
  message: 'With full IntelliSense support'
});
```

### React Integration

Both components are React-native with proper:
- Hooks support
- Context API usage (in notifications system)
- React 18+ concurrent rendering compatibility
- Proper cleanup and unmounting

---

## Implementation Notes

### Architecture Distinctions

**Alert (Static Inline):**
- Rendered directly in component tree
- Part of page layout
- Exists until dismissed or parent unmounts
- Direct JSX usage

**Notification (Base Component):**
- Can be used standalone for custom systems
- Provides visual presentation only
- No built-in positioning or queue management
- Foundation for notifications system

**Notifications System (Toast Manager):**
- Programmatic API (not JSX)
- Single container component + control functions
- Queue-based display management
- Position management
- Auto-dismiss functionality

### Package Organization

```
@mantine/core
├── Alert - Static inline feedback
└── Notification - Base notification component

@mantine/notifications
├── Notifications - Container component
├── notifications - Control API
└── useNotifications - State hook
```

### API Design Philosophy

**Declarative (Alert):**
```jsx
// Alert is used declaratively in JSX
<Alert title="Message">Content</Alert>
```

**Imperative (Notifications):**
```javascript
// Notifications are controlled imperatively
notifications.show({ title: 'Message' });
```

This dual approach allows:
- Alerts for static, layout-embedded messages
- Notifications for dynamic, event-driven messages

### Styling Approach

**1. Variants System:**
Both components use variant-based styling for common patterns

**2. Styles API:**
Granular control over internal elements via classNames/styles

**3. Theme Integration:**
Automatic theme value application

**4. CSS Variables:**
Components use CSS custom properties for themeable values

### Common Patterns

#### Alert Use Cases
- Form validation messages
- Page-level status messages
- Contextual help and information
- Warning banners
- Success confirmations embedded in forms
- Error summaries

#### Notification Use Cases
- Toast notifications for async operations
- Success/error messages from API calls
- Background task completion
- Real-time event notifications
- System status updates
- Upload/download progress

### Migration Considerations

**From Alert to Notifications System:**
```jsx
// Static alert in page
<Alert title="Saved">Changes saved</Alert>

// Equivalent as toast notification
notifications.show({
  title: 'Saved',
  message: 'Changes saved',
  color: 'green'
});
```

**Key Differences:**
- Alerts are part of layout, notifications float
- Alerts persist, notifications typically auto-dismiss
- Alerts are declared, notifications are programmatic
- Alerts are inline, notifications overlay content

### Performance Considerations

**Alert:**
- Lightweight, just rendered elements
- No state management overhead
- Minimal re-render impact

**Notifications System:**
- Queue management adds overhead
- Animation performance depends on count
- Use `limit` prop to cap active notifications
- Cleanup occurs automatically on unmount

**Best Practice:**
```jsx
// Limit notifications for performance
<Notifications limit={3} />
```

### Common Pitfalls

**1. Multiple Notifications Containers:**
```jsx
// ❌ WRONG - Don't render multiple containers
<MantineProvider>
  <Notifications />
  <Notifications /> {/* Don't do this */}
</MantineProvider>

// ✅ CORRECT - Single container
<MantineProvider>
  <Notifications />
</MantineProvider>
```

**2. Missing Accessibility Labels:**
```jsx
// ❌ WRONG
<Alert withCloseButton />

// ✅ CORRECT
<Alert withCloseButton closeButtonLabel="Dismiss" />
```

**3. Notification ID Collisions:**
```jsx
// ❌ WRONG - Same ID causes updates instead of new notifications
notifications.show({ id: 'msg', message: 'First' });
notifications.show({ id: 'msg', message: 'Second' }); // Updates first

// ✅ CORRECT - Unique IDs or auto-generated
notifications.show({ message: 'First' }); // Auto ID
notifications.show({ id: 'msg-2', message: 'Second' });
```

**4. Style Import Order:**
```javascript
// ❌ WRONG
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';

// ✅ CORRECT
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
```

### Testing Considerations

**Alert Testing:**
```jsx
// Test static rendering
render(<Alert title="Test">Message</Alert>);
expect(screen.getByRole('alert')).toBeInTheDocument();
expect(screen.getByText('Test')).toBeInTheDocument();
```

**Notifications Testing:**
```jsx
// Mock notifications API
jest.mock('@mantine/notifications');

// Test notification calls
notifications.show({ message: 'Test' });
expect(notifications.show).toHaveBeenCalledWith({
  message: 'Test'
});
```

---

## Summary

Mantine provides a comprehensive feedback system with:

**Alert Component**: Static, inline messages embedded in page layout with semantic ARIA support, multiple variants, and dismissible options.

**Notification Component**: Base visual component for building custom notification systems with loading states, icons, and flexible styling.

**Notifications System**: Complete toast notification management with queue handling, positioning, auto-dismiss, programmatic control, and state monitoring.

The architecture separates static feedback (Alert) from dynamic toast notifications (Notifications system), while providing the base Notification component for custom implementations. All components integrate with Mantine's design system and provide comprehensive accessibility support.
