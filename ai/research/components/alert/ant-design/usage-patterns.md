# Ant Design Alert & Notification - Usage Patterns

> Research Date: 2025-11-06
> Component URLs:
> - Alert: https://ant.design/components/alert
> - Notification: https://ant.design/components/notification
> - Alert GitHub Docs: https://github.com/ant-design/ant-design/blob/master/components/alert/index.en-US.md
> - Notification GitHub Docs: https://github.com/ant-design/ant-design/blob/master/components/notification/index.en-US.md

## Component Overview

Ant Design provides two distinct components for displaying messages to users:

**Alert Component**: A persistent, static container that displays warning or informational messages requiring user attention. Alerts are inline components that appear within the page flow and can be closed through direct user action. They are suitable for contextual messages that relate to specific page content or sections.

**Notification Component**: A global notification system that displays prompt messages at any of the four viewport corners. Notifications are rendered dynamically outside the normal page flow and are suitable for complex notifications, user interaction feedback, and application-pushed alerts. They support auto-dismissal, stacking, and rich content including custom actions.

## Alert Component

### Core Patterns

The Alert component follows a persistent message pattern where messages are displayed inline within the page content. Alerts remain visible until explicitly dismissed by the user (when closable) and are designed to draw attention to important information without interrupting the user's workflow.

**Key Characteristics**:
- Static positioning within document flow
- Persistent until user action (when closable)
- Four semantic types with distinct visual styling
- Optional icon display
- Support for primary message and supplementary description
- Banner mode for full-width display
- Custom actions and close controls

**Usage Scenarios**:
- Displaying alert messages to users
- Creating closable, persistent static containers
- Showing validation messages or form feedback
- Highlighting important information on the page
- Displaying system status or warnings

### Props & Configuration

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| `action` | Alert action element (e.g., buttons, links) | `ReactNode` | - | 4.9.0 |
| `afterClose` | Callback executed when close animation completes | `() => void` | - | - |
| `banner` | Displays Alert in banner style (full-width, top of section) | `boolean` | `false` | - |
| `closable` | Configuration for close functionality; can be boolean or object with `closeIcon` and aria attributes | `boolean \| object` | `false` | 5.15.0+ for object |
| `closeIcon` | Custom close icon (when using object form of closable) | `ReactNode` | - | 5.15.0+ |
| `description` | Supplementary content displayed below the message | `ReactNode` | - | - |
| `icon` | Custom icon to display (when `showIcon` is enabled) | `ReactNode` | - | - |
| `message` | Primary content of the Alert (required) | `ReactNode` | - | - |
| `showIcon` | Toggles icon visibility | `boolean` | `false` (automatically `true` in banner mode) | - |
| `type` | Alert style type | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` (or `'warning'` in banner mode) | - |
| `onClose` | Callback triggered when alert is closed | `(e: MouseEvent) => void` | - | - |
| `style` | Inline CSS styles | `CSSProperties` | - | - |
| `className` | CSS class name | `string` | - | - |
| `rootClassName` | Root element class name | `string` | - | - |
| `onMouseEnter` | Mouse enter event handler | `React.MouseEventHandler` | - | - |
| `onMouseLeave` | Mouse leave event handler | `React.MouseEventHandler` | - | - |
| `onClick` | Click event handler | `React.MouseEventHandler` | - | - |
| `role` | ARIA role attribute | `string` | - | - |

**Closable Configuration (v5.15.0+)**:
The `closable` prop supports both boolean and object forms:
```javascript
// Boolean form (simple)
<Alert closable />

// Object form (advanced, v5.15.0+)
<Alert
  closable={{
    closeIcon: <CustomIcon />,
    'aria-label': 'Close alert'
  }}
/>
```

### Visual Patterns

**Type Variants**:
Ant Design Alert provides four semantic types, each with distinct visual styling:

1. **Success** (`type="success"`): Green color scheme, typically with a checkmark icon
2. **Info** (`type="info"`): Blue color scheme, information icon (default type)
3. **Warning** (`type="warning"`): Yellow/orange color scheme, warning icon
4. **Error** (`type="error"`): Red color scheme, error/close icon

**Banner Mode**:
When `banner={true}` is set:
- Alert displays with banner-specific styling
- Full-width appearance suitable for top-of-page or section notifications
- `showIcon` defaults to `true` (automatically displays icon)
- Default `type` changes to `'warning'` (instead of `'info'`)
- CSS class `${prefixCls}-banner` is applied
- Note: Banner mode only applies styling; positioning must be handled separately

**Icon Display**:
- Icons are hidden by default (`showIcon={false}`)
- Set `showIcon={true}` to display the default type-specific icon
- Use the `icon` prop to provide a custom icon element
- In banner mode, icons are shown by default unless explicitly disabled

**Colors & Styling**:
- Each type has associated color tokens for background, border, and text
- Supports custom styling through `style`, `className`, and `rootClassName` props
- Component tokens can be customized for theme consistency

### Behavioral Patterns

**Closable Behavior**:
- By default, Alerts are not closable (`closable={false}`)
- Set `closable={true}` to enable close functionality
- Close button appears in the top-right corner
- Clicking close triggers `onClose` callback
- After animation completes, `afterClose` callback is triggered
- Custom close text/icon can be provided via `closeIcon` or `closable` object configuration

**Close Animation**:
- Smooth transition when closing
- `afterClose` callback fires when animation completes
- Useful for cleanup operations or state updates after dismissal

**Mouse Events**:
Supports standard React mouse event handlers:
- `onClick`: Triggered when Alert is clicked
- `onMouseEnter`: Triggered when mouse enters Alert area
- `onMouseLeave`: Triggered when mouse leaves Alert area

### Content Patterns

**Message Structure**:
Alerts support a two-tier content hierarchy:

1. **Message** (required): Primary content displayed prominently
2. **Description** (optional): Supplementary content displayed below message in smaller text

```javascript
<Alert
  message="Success Tips"
  description="Detailed description and advice about successful copywriting."
  type="success"
  showIcon
/>
```

**Rich Content**:
Both `message` and `description` accept `ReactNode`, allowing:
- Plain text
- Formatted text with emphasis, links, etc.
- JSX elements
- Complex component composition

**Action Elements**:
The `action` prop (v4.9.0+) allows adding custom actions:
- Buttons for user interaction
- Links for navigation
- Custom React components
- Positioned on the right side of the Alert

```javascript
<Alert
  message="Info Text"
  type="info"
  action={
    <Button size="small" type="text">
      UNDO
    </Button>
  }
/>
```

**Icon Patterns**:
- Default icons provided for each type
- Custom icons via `icon` prop
- Icons align with message text
- Icon visibility controlled by `showIcon`
- Custom close icons via `closeIcon` (v5.15.0+)

### Layout Patterns

**Inline Display** (Default):
- Alert appears within normal document flow
- Width determined by container
- Respects layout constraints of parent element
- Suitable for contextual messages within page sections

**Banner Mode**:
- Full-width styling for page-level or section-level alerts
- Typically used at the top of pages or major sections
- Visual emphasis through distinct styling
- Developer must handle positioning (not automatically fixed/absolute)
- Common pattern: Place at top of page container with appropriate margins

**Positioning Considerations**:
- Alert is a block-level component by default
- Does not automatically fix to viewport (unlike Notification)
- Positioning controlled through standard CSS (parent container, flexbox, grid, etc.)
- For fixed/sticky positioning, wrap in a positioned container or apply custom styles

### Error Boundary Support

**Alert.ErrorBoundary**:
Special variant for catching and displaying React errors:

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `description` | Custom error stack display | `ReactNode` | `{{ error stack }}` |
| `message` | Custom error message display | `ReactNode` | `{{ error }}` |

**Usage**:
```javascript
<Alert.ErrorBoundary>
  <ComponentThatMightError />
</Alert.ErrorBoundary>
```

This wraps child components and displays an Alert if an error occurs during rendering, providing graceful error handling with user-friendly error messages.

### Accessibility

**ARIA Attributes**:
- `role` prop allows setting appropriate ARIA role
- Custom aria attributes supported via `closable` object configuration (v5.15.0+)
- Close button includes appropriate accessibility labels

**Keyboard Support**:
- Close button is keyboard accessible (focusable and activatable)
- Standard tab navigation support

**Screen Reader Support**:
- Semantic HTML structure
- Type information conveyed through visual and structural cues
- Close button properly labeled for assistive technologies

---

## Notification Component

### Core Patterns

The Notification component implements a global notification system that displays messages at viewport corners. Unlike Alert, Notifications are rendered outside the normal document flow using a portal pattern. They support rich interactions, auto-dismissal, stacking behavior, and are ideal for application-level feedback that doesn't relate to specific page content.

**Key Characteristics**:
- Global positioning at viewport corners
- Portal-based rendering (outside normal DOM tree)
- Auto-dismiss with configurable duration
- Support for progress bar visualization
- Pause-on-hover functionality
- Notification stacking and limits
- Rich content with custom actions
- Context access via hooks pattern
- Programmatic control via static methods

**Usage Scenarios**:
- Complex notifications requiring user interaction
- Application-pushed alerts (real-time updates, system notifications)
- User action feedback (success confirmations, error messages)
- Multi-step process updates
- Background task completion notifications

### Props & Configuration

**Core Configuration Properties** (passed to `notification.open()` or type-specific methods):

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `message` | Title of the notification (required) | `ReactNode` | - |
| `description` | Content of the notification (required) | `ReactNode` | - |
| `duration` | Auto-close delay in seconds; `null` or `0` means never auto-close | `number \| null` | `4.5` |
| `placement` | Position of notification | `'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight'` | `'topRight'` |
| `icon` | Custom icon to display | `ReactNode` | Type-specific default icon |
| `closeIcon` | Custom close button; `null` or `false` hides it | `ReactNode \| null \| false` | Default close icon |
| `className` | CSS class name for notification | `string` | - |
| `style` | Inline CSS styles | `CSSProperties` | - |
| `key` | Unique identifier for the notification (used for programmatic control) | `string` | Auto-generated |
| `onClick` | Click handler for entire notification | `(event: React.MouseEvent) => void` | - |
| `onClose` | Callback when notification is closed | `() => void` | - |
| `showProgress` | Display auto-close progress bar | `boolean` | Global config value |
| `pauseOnHover` | Pause auto-close timer when hovering | `boolean` | `true` |
| `role` | ARIA role (typically `'alert'` or `'status'`) | `string` | `'alert'` |
| `actions` | Custom action buttons displayed at bottom | `ReactNode` | - |
| `props` | Additional HTML attributes (data-*, aria-*) | `Object` | - |
| `btn` | Custom button group (legacy, prefer `actions`) | `ReactNode` | - |

**Global Configuration Properties** (set via `notification.config()`):

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `placement` | Default position for all notifications | `'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight'` | `'topRight'` |
| `top` | Distance from top of viewport in pixels (for top/topLeft/topRight placements) | `number` | `24` |
| `bottom` | Distance from bottom of viewport in pixels (for bottom/bottomLeft/bottomRight placements) | `number` | `24` |
| `duration` | Default auto-close time in seconds | `number` | `4.5` |
| `rtl` | Enable right-to-left mode | `boolean` | `false` |
| `closeIcon` | Default close icon for all notifications | `ReactNode` | Default close icon |
| `getContainer` | Function returning the mount node | `() => HTMLNode` | `() => document.body` |
| `showProgress` | Show progress bar by default | `boolean` | `false` |
| `pauseOnHover` | Pause timer on hover by default | `boolean` | `true` |
| `maxCount` | Maximum number of simultaneous notifications | `number` | `undefined` (no limit) |
| `stack` | Stack notifications when exceeding threshold | `boolean \| { threshold: number }` | `{ threshold: 3 }` |

### Visual Patterns

**Type Variants**:
Notifications use semantic types with distinct visual styling:

1. **Success**: Green theme, checkmark icon
2. **Error**: Red theme, error icon
3. **Info**: Blue theme, information icon
4. **Warning**: Yellow/orange theme, warning icon
5. **Open** (generic): Customizable type via `notification.open()`

**Icon Display**:
- Each type has a default icon displayed on the left
- Custom icons can be provided via the `icon` prop
- Icons are colored to match the notification type
- Icon size and positioning are consistent across types

**Progress Bar**:
When `showProgress={true}`:
- Visual progress bar appears at bottom of notification
- Animates from full to empty as duration counts down
- Provides visual feedback for auto-close timing
- Pauses when `pauseOnHover` is enabled and user hovers

**Close Button**:
- Displayed in top-right corner by default
- Can be hidden with `closeIcon={null}` or `closeIcon={false}`
- Customizable via `closeIcon` prop or global config
- Includes hover and focus states

**Colors & Theming**:
- Type-specific color tokens for background, border, and icons
- Supports theme customization through component tokens
- Consistent with Ant Design's overall color system

### Behavioral Patterns

**Auto-Dismiss Duration**:
- Default: 4.5 seconds
- Configurable per-notification via `duration` prop
- Set to `0` or `null` for persistent notifications (manual close only)
- Global default configurable via `notification.config({ duration })`

**Pause on Hover**:
- Enabled by default (`pauseOnHover={true}`)
- Hovering over notification pauses auto-close timer
- Timer resumes when mouse leaves
- Progress bar animation pauses/resumes accordingly
- Can be disabled per-notification or globally

**Stacking Behavior**:
- Enabled by default with threshold of 3 (`stack: { threshold: 3 }`)
- When notifications exceed threshold, they collapse into a stack
- Hovering over stack expands all notifications
- All notification durations refresh when stack is expanded
- Can be disabled with `stack: false`
- Threshold customizable: `stack: { threshold: 5 }`

**MaxCount Behavior**:
- Limits maximum simultaneous notifications
- When limit reached, oldest notification is removed first
- Works in conjunction with stacking
- Stacking only activates when count is under maxCount
- No limit by default (all notifications shown)

**Stack and MaxCount Interaction**:
Important: Stack feature only activates when the number of notifications is under `maxCount`. The two properties work together to control notification display and organization.

**Close Actions**:
- Click close button to manually dismiss
- Auto-dismiss based on duration
- Programmatic close via `notification.destroy(key)`
- Close all with `notification.destroy()`
- `onClose` callback triggered when closed

### Content Patterns

**Message Structure**:
Two-tier content hierarchy:

1. **Message**: Title displayed prominently at top (required)
2. **Description**: Content displayed below title (required)

Both support `ReactNode` for rich content composition.

**Rich Content Support**:
- Plain text
- Formatted text with HTML/JSX
- Links and buttons
- Images and icons
- Complex component composition
- Custom layouts

**Custom Actions**:
The `actions` prop allows adding custom action buttons:

```javascript
notification.open({
  message: 'Notification Title',
  description: 'This is the content of the notification.',
  actions: (
    <>
      <Button size="small" type="primary" onClick={() => {}}>
        Accept
      </Button>
      <Button size="small" onClick={() => {}}>
        Decline
      </Button>
    </>
  ),
});
```

Actions are displayed at the bottom of the notification, providing clear call-to-action options for user interaction.

**Icon Patterns**:
- Default type-specific icons
- Custom icons via `icon` prop
- Icons displayed on left side
- Icon color matches notification type
- Can be omitted for minimal style

### Positioning Patterns

**Placement Options**:
Six placement options at viewport corners and edges:

1. **top**: Top center of viewport
2. **topLeft**: Top left corner
3. **topRight**: Top right corner (default)
4. **bottom**: Bottom center of viewport
5. **bottomLeft**: Bottom left corner
6. **bottomRight**: Bottom right corner

**Offset Configuration**:
- `top`: Pixel distance from top edge (for top/topLeft/topRight placements)
- `bottom`: Pixel distance from bottom edge (for bottom/bottomLeft/bottomRight placements)
- Default: 24px from respective edge
- Configurable globally via `notification.config()`

**Multiple Notifications**:
- Multiple notifications at same placement stack vertically
- Spacing between notifications is consistent
- Order: newest on top by default
- Stacking behavior when threshold exceeded

**RTL Support**:
- Enable with `rtl: true` in global config
- Mirrors layout for right-to-left languages
- Affects text direction and icon positioning
- Placement positions remain the same (topRight stays topRight)

### API Methods

**Static Methods**:

```javascript
// Type-specific notifications
notification.success(config)
notification.error(config)
notification.info(config)
notification.warning(config)

// Generic notification
notification.open(config)

// Close notifications
notification.destroy()           // Close all
notification.destroy(key)        // Close specific notification

// Global configuration
notification.config(options)

// Hook-based API
const [api, contextHolder] = notification.useNotification(config)
```

**Hook Pattern for Context Access**:

Since notifications are rendered dynamically via `ReactDOM.createRoot()`, they cannot access React context from parent components by default. Use the hook pattern to enable context access:

```javascript
const Context = React.createContext({ name: 'Default' });

function App() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.success({
      message: 'Notification',
      description: <Context.Consumer>
        {({ name }) => `Hello, ${name}!`}
      </Context.Consumer>,
    });
  };

  return (
    <Context.Provider value={{ name: 'Ant Design' }}>
      {contextHolder}
      <Button onClick={openNotification}>Open</Button>
    </Context.Provider>
  );
}
```

The `contextHolder` must be placed inside the context provider to inherit its values.

**Method Return Values**:
- `notification.open()` and type-specific methods return a function to manually close that specific notification
- Useful for imperatively controlling notification lifecycle

```javascript
const close = notification.success({
  message: 'Processing',
  description: 'Your request is being processed...',
  duration: 0,
});

// Later, close it manually
close();
```

### Accessibility

**ARIA Attributes**:
- Default `role="alert"` for important notifications requiring immediate attention
- Can be set to `role="status"` for less critical updates
- Custom ARIA attributes supported via `props` configuration
- Close button properly labeled for screen readers

**Keyboard Support**:
- Close button is keyboard accessible
- Tab navigation through interactive elements (close button, action buttons)
- Enter/Space to activate buttons
- Escape key support for closing (implementation-specific)

**Screen Reader Support**:
- Notifications announced when displayed (via ARIA live regions)
- Content structure semantic and accessible
- Type information conveyed through icons and text
- Action buttons clearly labeled

**Focus Management**:
- Notifications don't steal focus when displayed
- Focus remains on triggering element
- Interactive elements within notification are focusable
- Appropriate for non-blocking feedback

---

## Framework-Specific Features

### React Integration
Both Alert and Notification are React components deeply integrated with React patterns:
- Support for React hooks (`useNotification`)
- ReactNode content support for rich composition
- React Context integration for shared state
- Event handlers follow React conventions
- TypeScript type definitions included

### Portal Pattern (Notification)
Notification uses React portals for rendering:
- Rendered outside parent component DOM hierarchy
- Allows positioning independent of page layout
- Mount point configurable via `getContainer`
- Enables global notification system

### Error Boundary (Alert)
Alert provides a specialized Error Boundary component:
- Catches rendering errors in child components
- Displays user-friendly error messages
- Custom error display via props
- Prevents entire app crash from component errors

### Hook-Based API (Notification)
`useNotification` hook provides context-aware notifications:
- Access to parent component context
- Better integration with React lifecycle
- Enables using context providers (theme, i18n, etc.)
- Returns API instance and context holder element

### Dynamic Rendering (Notification)
Notifications are rendered dynamically:
- Created on-demand via method calls
- Removed when closed or duration expires
- Managed lifecycle without manual component mounting
- Singleton pattern for global notification container

### Stacking System (Notification)
Advanced notification management:
- Automatic stacking when threshold exceeded
- Hover-to-expand behavior
- Duration refresh on expansion
- Configurable threshold and max count
- Smart oldest-first removal

---

## Implementation Notes

### Alert Implementation

**Component Structure**:
- React functional component with hooks
- Shadow DOM not used (standard React component)
- CSS-in-JS or separate stylesheet for styling
- Modular design with sub-components for icon, close button, etc.

**State Management**:
- Internal state for close animation
- Controlled closing behavior with callbacks
- No global state (self-contained)

**Animation System**:
- CSS transitions for smooth close
- Motion library integration (Ant Design motion system)
- Configurable animation duration
- `afterClose` callback after animation completes

**Styling Architecture**:
- CSS class-based theming
- Component tokens for customization
- Prefix class system (`ant-alert`, `ant-alert-success`, etc.)
- Banner mode applies additional classes
- Responsive design built-in

### Notification Implementation

**Component Architecture**:
- Singleton container for all notifications
- Individual notification instances rendered as children
- Portal-based rendering to document.body (or custom container)
- Queue management for stacking and limits

**State Management**:
- Global notification registry
- Notification lifecycle tracking
- Stack state and expansion tracking
- Timer management for auto-dismiss

**Rendering Strategy**:
- Static methods create notifications imperatively
- ReactDOM.createRoot() for dynamic rendering
- Context holder pattern for React context access
- Cleanup on unmount and destroy

**Position System**:
- Fixed positioning at viewport corners
- Z-index management for layering
- Responsive positioning with configurable offsets
- Multiple placement containers for different corners

**Timer System**:
- `setTimeout` for auto-dismiss duration
- Pause/resume on hover interactions
- Timer tracking per notification
- Clear timers on manual close

**Stacking Logic**:
- Count-based threshold detection
- Collapse/expand state management
- Duration refresh on expansion
- Hover interaction tracking

**Performance Considerations**:
- Limit notifications via maxCount to prevent DOM bloat
- Efficient removal of old notifications
- Optimized re-renders using React keys
- Throttled hover events for stacking

### API Design Patterns

**Static Methods Pattern** (Notification):
Convenient imperative API for common use cases:
```javascript
notification.success(config);  // Quick success notification
notification.error(config);    // Quick error notification
```

**Configuration Cascading**:
- Global defaults via `notification.config()`
- Per-notification overrides via method arguments
- Consistent precedence: individual > global > defaults

**Key-Based Management**:
- Unique keys for notification identity
- Programmatic close via key
- Update existing notifications by key
- Auto-generated keys when not provided

**Callback Patterns**:
- `onClose`: After notification closes
- `afterClose` (Alert): After animation completes
- `onClick`: User interaction tracking

### TypeScript Support

Both components include comprehensive TypeScript definitions:
- Full prop type definitions
- Method signature types
- Config object interfaces
- Return type specifications
- Generic support for complex props

### Migration Considerations

**Version-Specific Features**:
- Alert `closable` object form: v5.15.0+
- Alert `action` prop: v4.9.0+
- Notification stacking: v5.9.0+
- Always check version compatibility for newer features

**Legacy Support**:
- `btn` prop in Notification (prefer `actions`)
- Backward-compatible API design
- Deprecation warnings in console for old patterns

### Testing Recommendations

**Alert Testing**:
- Test close callbacks and animations
- Verify type-specific styling
- Test banner mode behavior
- Validate error boundary functionality
- Accessibility testing (ARIA, keyboard)

**Notification Testing**:
- Test placement at all positions
- Verify auto-dismiss timing
- Test stacking behavior
- Validate maxCount limiting
- Test pause-on-hover functionality
- Context access verification with hooks
- Accessibility testing (ARIA, live regions)

---

## Summary

Ant Design's Alert and Notification components provide a comprehensive messaging system for React applications:

**Alert** is ideal for:
- Contextual, inline messages
- Persistent information requiring user awareness
- Form validation feedback
- Section-specific warnings or tips
- Error boundary displays

**Notification** is ideal for:
- Global application feedback
- User action confirmations
- Background process updates
- Real-time notifications
- Complex messages with actions

Both components offer:
- Rich customization options
- Accessibility support
- Smooth animations
- TypeScript integration
- Consistent API design
- Theme compatibility

Key differentiators:
- **Positioning**: Alert is inline, Notification is positioned at viewport corners
- **Lifecycle**: Alert is persistent (until closed), Notification auto-dismisses
- **Rendering**: Alert is standard component, Notification uses portals
- **Complexity**: Alert is simpler, Notification supports stacking and advanced behaviors
- **Context**: Alert is contextual, Notification is global

The choice between Alert and Notification depends on the message's importance, context, and required user interaction level.
