# PrimeReact Messages - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://www.primefaces.org/primereact-v8/messages/

## Component Overview

PrimeReact's Messages component is a ref-based imperative notification system designed for displaying inline messages with various severity levels. Unlike the singular Message component (optimized for static inline form validation), Messages is built for dynamic message management with features like auto-dismiss, stacking multiple messages, and programmatic control through ref methods.

**Core Purpose**: Provide a dynamic notification system for displaying one or multiple inline messages that can be programmatically shown, cleared, or replaced, primarily used within forms and page sections.

**Mental Model**: A managed notification container with imperative API control. Think of it as a message queue manager where messages are added programmatically via ref methods, with built-in auto-dismiss, close buttons, and animation support.

**Semantic Meaning**: Displays contextual feedback messages with semantic severity levels (success, info, warn, error) that communicate application state, user actions, or validation results.

## Core Patterns

### Dual Component System

PrimeReact provides two distinct components for different use cases:

1. **Messages (plural)**: Dynamic, ref-based message management
   - Programmatic control via `messages.current.show()`
   - Multiple message stacking
   - Auto-dismiss and sticky modes
   - Queue management (show, clear, replace)

2. **Message (singular)**: Static, declarative inline messages
   - JSX-based declaration
   - Single message display
   - Perfect for form validation
   - No ref required

### Ref-Based Imperative API

The Messages component uses React refs for programmatic control, following a pattern common in PrimeReact:

```javascript
const messages = useRef(null);

// Show message via ref
messages.current.show({ severity: 'success', summary: 'Success', detail: 'Order submitted' });
```

This imperative approach enables dynamic message management from event handlers, async callbacks, and complex application logic.

## Props & Configuration

### Messages Component Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | null | Unique element identifier |
| `className` | string | null | Style class of the component |
| `style` | object | null | Inline styles for the component |
| `transitionOptions` | object | null | CSSTransition properties (excludes 'nodeRef' and 'in') |

**Note**: The Messages component has minimal declarative props because its primary API is imperative through ref methods.

### Message Object Properties

When calling `messages.current.show()`, the message object accepts:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | null | Unique identifier for the message |
| `severity` | string | null | Severity level: 'success', 'info', 'warn', 'error' |
| `summary` | ReactNode | null | Message headline/title |
| `detail` | ReactNode | null | Message description/content |
| `content` | ReactNode | null | Custom template (replaces summary/detail) |
| `closable` | boolean | true | Enables manual close icon |
| `sticky` | boolean | false | Prevents auto-removal when true |
| `life` | number | 3000 | Auto-dismiss delay in milliseconds |
| `icon` | string/ReactNode | Severity-based | Custom icon override |

### Message Component Props (Inline Variant)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | null | Element identifier |
| `className` | string | null | Style class |
| `style` | object | null | Inline styles |
| `severity` | string | null | Severity level |
| `text` | any | null | Message text content |
| `content` | ReactNode | null | Custom template |
| `icon` | string | Severity-based | Icon display |

## Visual Patterns

### Severity Levels

Four predefined severity levels with distinct visual styling:

| Severity | Color Theme | Icon | Use Case |
|----------|-------------|------|----------|
| `success` | Green | Check circle | Successful operations, confirmations |
| `info` | Blue | Info circle | Informational messages, tips |
| `warn` | Orange/Yellow | Warning triangle | Warnings, cautions, unsaved changes |
| `error` | Red | Error X | Errors, validation failures, critical issues |

Each severity level maps to specific CSS classes (`.p-messages-success`, `.p-messages-info`, etc.) enabling theme customization.

### Visual Structure

```
┌─────────────────────────────────────────────┐
│ [Icon] Summary (bold)                   [×] │
│        Detail (regular)                     │
└─────────────────────────────────────────────┘
```

- **Icon**: Left-aligned, severity-based (customizable)
- **Summary**: Bold headline text
- **Detail**: Regular description text below summary
- **Close Button**: Right-aligned X icon (optional)

### Message Stacking

Multiple messages stack vertically when shown:

```
┌─────────────────────────────────────────────┐
│ [✓] Success Message 1                   [×] │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ [ℹ] Info Message 2                      [×] │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│ [⚠] Warning Message 3                   [×] │
└─────────────────────────────────────────────┘
```

Messages appear in the order they are added.

## Content Patterns

### Summary + Detail Pattern

The most common content structure uses separate summary and detail properties:

```javascript
messages.current.show({
  severity: 'success',
  summary: 'Success',           // Headline
  detail: 'Order submitted'      // Description
});
```

- **Summary**: Short, bold headline (1-3 words)
- **Detail**: Longer descriptive text explaining the message

### Custom Content Template

For complex layouts, use the `content` property to provide custom JSX:

```javascript
messages.current.show({
  severity: 'info',
  content: (
    <div className="flex align-items-center">
      <img alt="logo" src="/logo.svg" width="32" />
      <div className="ml-2">
        <strong>Custom Title</strong>
        <p>Additional details with custom layout</p>
      </div>
    </div>
  )
});
```

When `content` is provided, it replaces the default summary/detail layout entirely.

### Text-Only Pattern (Message Component)

For simple inline messages, the Message component supports text-only:

```jsx
<Message severity="success" text="Record Saved" />
```

This is ideal for form validation feedback where a single line of text suffices.

## Behavioral Patterns

### Auto-Dismiss (Default)

Messages automatically disappear after a configurable duration:

```javascript
// Default: 3000ms (3 seconds)
messages.current.show({
  severity: 'info',
  summary: 'Info',
  detail: 'This message will auto-dismiss'
});

// Custom duration: 5 seconds
messages.current.show({
  severity: 'info',
  summary: 'Info',
  detail: 'This message will auto-dismiss after 5 seconds',
  life: 5000
});
```

**Default Life**: 3000ms
**Use Cases**: Transient feedback, success confirmations, non-critical info

### Sticky Messages

Sticky messages persist until manually closed:

```javascript
messages.current.show({
  severity: 'error',
  summary: 'Error',
  detail: 'This message stays until closed',
  sticky: true
});
```

**Use Cases**: Critical errors, important warnings, required acknowledgment

### Closable Control

Messages are closable by default but can be disabled:

```javascript
// Non-closable message (user cannot dismiss)
messages.current.show({
  severity: 'warn',
  summary: 'Warning',
  detail: 'Cannot close this message',
  closable: false
});

// Closable (default behavior)
messages.current.show({
  severity: 'info',
  summary: 'Info',
  detail: 'User can close this',
  closable: true  // Can be omitted as it's default
});
```

**Use Cases for Non-Closable**: System status, loading states, required information

### Message Lifecycle Patterns

#### Single Message
```javascript
messages.current.show({
  severity: 'success',
  summary: 'Success',
  detail: 'Operation completed'
});
```

#### Multiple Messages at Once
```javascript
messages.current.show([
  { severity: 'info', summary: 'Message 1', detail: 'First message' },
  { severity: 'info', summary: 'Message 2', detail: 'Second message' },
  { severity: 'info', summary: 'Message 3', detail: 'Third message' }
]);
```

#### Sequential Messages
```javascript
// Add messages one by one
showSuccess();
setTimeout(() => showInfo(), 1000);
setTimeout(() => showWarn(), 2000);
```

## Imperative API

### Core Methods

PrimeReact Messages uses a ref-based API with three primary methods:

#### show(message | messages[])

Display one or more messages:

```javascript
const messages = useRef(null);

// Single message
messages.current.show({
  severity: 'success',
  summary: 'Success',
  detail: 'Order submitted'
});

// Multiple messages
messages.current.show([
  { severity: 'success', summary: 'Success', detail: 'Record 1 saved' },
  { severity: 'success', summary: 'Success', detail: 'Record 2 saved' }
]);
```

#### clear()

Remove all currently displayed messages:

```javascript
messages.current.clear();
```

**Use Cases**:
- Clear all messages before showing new ones
- Reset message state on navigation
- Clear messages on form reset

#### replace(messages[])

Replace all current messages with new ones:

```javascript
// Replace all messages with a new set
messages.current.replace([
  { severity: 'error', summary: 'Error', detail: 'New error occurred' }
]);
```

**Difference from clear() + show()**:
- `replace()` is atomic (one operation)
- May have different animation behavior
- More efficient for bulk updates

### Ref Pattern

Complete setup pattern:

```javascript
import { Messages } from 'primereact/messages';
import { useRef } from 'react';

function MyComponent() {
  const messages = useRef(null);

  const showSuccess = () => {
    messages.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation completed'
    });
  };

  return (
    <div>
      <Messages ref={messages} />
      <Button onClick={showSuccess} label="Show Message" />
    </div>
  );
}
```

### Event Callbacks

Two callback events are available:

```javascript
<Messages
  ref={messages}
  onRemove={(message) => {
    console.log('Message removed:', message);
  }}
  onClick={(message) => {
    console.log('Message clicked:', message);
  }}
/>
```

**onRemove**: Invoked when a message is removed (auto-dismiss or manual close)
**onClick**: Invoked when a message is clicked by the user

## Accessibility

**Current Status**: The documentation explicitly states:

> "This section is under development. After the necessary tests and improvements are made, it will be shared with the users as soon as possible."

### Known Accessibility Considerations

Based on the component structure and PrimeReact patterns:

- **Visual Clarity**: Color-coded severity levels with icons
- **Semantic HTML**: Uses semantic HTML structure
- **Close Button**: Accessible button element for dismissal
- **Screen Reader Support**: Status pending official documentation

### Accessibility Gaps (To Be Addressed)

- ARIA roles not documented
- Screen reader announcements not specified
- Keyboard navigation details not provided
- Focus management not documented

## Related Components

### Messages vs Message Component

PrimeReact provides two distinct components:

#### Messages (Plural) - This Component

**Purpose**: Dynamic message queue management
**API Style**: Imperative (ref-based)
**Use Cases**:
- Dynamic notifications
- Form submission feedback
- API response messages
- Multiple stacked messages
- Auto-dismiss notifications

**Pattern**:
```javascript
const messages = useRef(null);
messages.current.show({ severity: 'success', summary: 'Success', detail: 'Saved' });
```

#### Message (Singular) - Companion Component

**Purpose**: Static inline messages
**API Style**: Declarative (JSX)
**Use Cases**:
- Form field validation
- Static help text
- Permanent status displays
- Single inline messages

**Pattern**:
```jsx
<Message severity="error" text="Username is required" />
```

### When to Use Which

| Scenario | Component | Reason |
|----------|-----------|--------|
| Form submission feedback | Messages | Dynamic, needs to appear/disappear |
| Form field validation | Message | Static, tied to specific field |
| API response messages | Messages | Dynamic, programmatic control |
| Help text that's always shown | Message | Static, declarative |
| Success toast after action | Messages | Auto-dismiss, dynamic |
| Inline error beside input | Message | Static positioning, simple |
| Multiple queued notifications | Messages | Built for stacking |
| Single permanent message | Message | Simpler API |

### Toast Component

PrimeReact also has a separate Toast component for corner-positioned notifications:

- **Toast**: Corner/edge-positioned, overlay-style notifications
- **Messages**: Inline, flow-based messages within content
- **Message**: Static inline messages

## Framework-Specific Features

### 1. Ref-Based Imperative API

PrimeReact's ref-based pattern is consistent across many components (Toast, FileUpload, etc.):

```javascript
const messagesRef = useRef(null);
messagesRef.current.show({ ... });
```

This pattern provides:
- Programmatic control from any context
- No need for state management
- Direct instance access
- Consistent API across similar components

### 2. React Transition Group Integration

Messages component integrates with `react-transition-group` for animations:

```javascript
<Messages
  ref={messages}
  transitionOptions={{
    timeout: 500,
    classNames: 'my-custom-animation'
  }}
/>
```

**Note**: The `nodeRef` and `in` properties are managed internally and cannot be overridden.

**Requirement**: Animations require `react-transition-group` package to be installed.

### 3. Dual Content API

Similar to the Message component, Messages supports two content patterns:

- **Structured**: `summary` + `detail` props
- **Template**: `content` prop with custom JSX

This dual approach balances simplicity with flexibility.

### 4. Message Object Pattern

Messages accepts rich message objects rather than simple strings:

```javascript
{
  id: 'msg-1',
  severity: 'success',
  summary: 'Title',
  detail: 'Description',
  closable: true,
  sticky: false,
  life: 3000,
  icon: 'custom-icon'
}
```

This object-based API enables fine-grained control per message.

### 5. Array-Based Batch Operations

Both `show()` and `replace()` accept arrays for batch operations:

```javascript
messages.current.show([msg1, msg2, msg3]);
messages.current.replace([newMsg1, newMsg2]);
```

This enables efficient bulk updates without multiple method calls.

### 6. Severity-Based Auto-Theming

Messages automatically apply severity-based styling without custom CSS:

```javascript
// Automatically gets green styling with check icon
messages.current.show({ severity: 'success', ... });

// Automatically gets red styling with error icon
messages.current.show({ severity: 'error', ... });
```

### 7. PrimeReact Theme System Integration

Messages integrates with PrimeReact's extensive theme system:
- Bootstrap themes
- Material Design themes
- Tailwind themes
- Fluent UI themes
- PrimeOne Design System themes
- Light/dark mode variants

Theme changes automatically affect Messages styling.

## Implementation Notes

### Architecture Design

**Imperative State Management**: Unlike most React components that rely on declarative state, Messages uses imperative methods. This design choice:
- Simplifies programmatic control from async operations
- Avoids prop drilling for message state
- Provides consistent API with Toast and other notification components
- Enables easy integration with form libraries and API calls

**Message Queue**: Internally manages message lifecycle:
1. Messages added via `show()` enter the queue
2. Each message gets auto-dismiss timer (unless sticky)
3. Messages removed on close button click or timer expiration
4. `onRemove` callback fired on removal

### Ref-Based Pattern

The ref pattern enables several advantages:

```javascript
const messages = useRef(null);

// Access from anywhere in component
useEffect(() => {
  if (error) {
    messages.current.show({ severity: 'error', ... });
  }
}, [error]);

// Access from event handlers
const handleSubmit = async () => {
  const result = await submitForm();
  messages.current.show({ severity: 'success', ... });
};
```

**Benefits**:
- No state updates needed
- No re-renders triggered
- Simple access pattern
- Easy to use with async operations

### Animation System

Messages uses CSSTransition from `react-transition-group`:

**Lifecycle**:
1. Message enters: `enter` classes applied
2. Message displays: `enter-active` classes
3. Message exits: `exit` classes applied
4. Message removed from DOM

**Customization**:
```javascript
<Messages
  transitionOptions={{
    timeout: 500,
    classNames: {
      enter: 'my-enter',
      enterActive: 'my-enter-active',
      exit: 'my-exit',
      exitActive: 'my-exit-active'
    }
  }}
/>
```

### CSS Class Structure

Messages provides targeted CSS classes for styling:

```css
/* Container */
.p-messages { }

/* Severity variants */
.p-messages-success { }
.p-messages-info { }
.p-messages-warn { }
.p-messages-error { }

/* Elements */
.p-messages-icon { }
.p-messages-summary { }
.p-messages-detail { }
.p-messages-close { }
```

This granular class system enables precise theme customization.

### State Management Integration

Messages works well with state management libraries:

```javascript
// Redux action
const handleApiError = (error) => {
  messagesRef.current.show({
    severity: 'error',
    summary: 'API Error',
    detail: error.message
  });
};

// React Query
const { error } = useQuery('data', fetchData, {
  onError: (error) => {
    messagesRef.current.show({
      severity: 'error',
      summary: 'Error',
      detail: error.message
    });
  }
});
```

### Performance Considerations

**Message Limits**: No documented limit on message count, but excessive messages may impact:
- Scroll performance (many DOM nodes)
- Animation performance (many transitions)
- Visual clarity (too much information)

**Best Practice**: Limit to 3-5 visible messages at once.

**Auto-Dismiss**: Use appropriate `life` values to prevent message buildup:
- Success: 3000-5000ms (short-lived)
- Info: 5000-7000ms (moderate)
- Warning: 7000-10000ms (longer)
- Error: Sticky or 10000ms+ (persistent)

## Code Examples

### Complete Component Setup

```javascript
import React, { useRef } from 'react';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';

export default function MessagesDemo() {
  const messages = useRef(null);

  const showSuccess = () => {
    messages.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Order submitted successfully'
    });
  };

  const showInfo = () => {
    messages.current.show({
      severity: 'info',
      summary: 'Info',
      detail: 'PrimeReact rocks'
    });
  };

  const showWarn = () => {
    messages.current.show({
      severity: 'warn',
      summary: 'Warning',
      detail: 'There are unsaved changes'
    });
  };

  const showError = () => {
    messages.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Validation failed'
    });
  };

  return (
    <div>
      <Messages ref={messages} />
      <Button onClick={showSuccess} label="Success" />
      <Button onClick={showInfo} label="Info" />
      <Button onClick={showWarn} label="Warning" />
      <Button onClick={showError} label="Error" />
    </div>
  );
}
```

### Sticky Error Messages

```javascript
const showStickyError = () => {
  messages.current.show({
    severity: 'error',
    summary: 'Critical Error',
    detail: 'System malfunction detected. Please contact support.',
    sticky: true,
    closable: true
  });
};
```

### Non-Closable System Messages

```javascript
const showSystemMessage = () => {
  messages.current.show({
    severity: 'info',
    summary: 'System Update',
    detail: 'System maintenance in progress...',
    closable: false,
    sticky: true
  });
};
```

### Custom Life Duration

```javascript
// Quick dismissal (1 second)
messages.current.show({
  severity: 'success',
  summary: 'Saved',
  detail: 'Auto-save successful',
  life: 1000
});

// Long display (10 seconds)
messages.current.show({
  severity: 'warn',
  summary: 'Warning',
  detail: 'Please review these important changes',
  life: 10000
});
```

### Multiple Messages at Once

```javascript
const showMultiple = () => {
  messages.current.show([
    {
      severity: 'info',
      summary: 'Message 1',
      detail: 'First operation completed'
    },
    {
      severity: 'success',
      summary: 'Message 2',
      detail: 'Second operation completed'
    },
    {
      severity: 'warn',
      summary: 'Message 3',
      detail: 'Third operation has warnings'
    }
  ]);
};
```

### Custom Content Template

```javascript
const showCustomContent = () => {
  messages.current.show({
    severity: 'info',
    content: (
      <div className="flex align-items-center">
        <img
          alt="User Avatar"
          src="/avatar.jpg"
          width="48"
          height="48"
          className="mr-3"
        />
        <div>
          <h4 className="m-0">User Notification</h4>
          <p className="m-0">John Doe mentioned you in a comment</p>
          <a href="/comments" className="text-primary">
            View comment →
          </a>
        </div>
      </div>
    )
  });
};
```

### Custom Icons

```javascript
const showCustomIcon = () => {
  messages.current.show({
    severity: 'success',
    summary: 'Custom Icon',
    detail: 'Message with custom icon',
    icon: 'pi pi-check-circle'  // PrimeIcons class
  });
};
```

### Clear All Messages

```javascript
const clearAllMessages = () => {
  messages.current.clear();
};

// Clear after showing
const showAndClear = () => {
  messages.current.show({
    severity: 'info',
    summary: 'Temporary',
    detail: 'This will be cleared in 2 seconds'
  });

  setTimeout(() => {
    messages.current.clear();
  }, 2000);
};
```

### Replace Messages

```javascript
const replaceMessages = () => {
  // Replace all current messages with new ones
  messages.current.replace([
    {
      severity: 'error',
      summary: 'System Alert',
      detail: 'Critical error occurred'
    }
  ]);
};
```

### Event Callbacks

```javascript
<Messages
  ref={messages}
  onRemove={(message) => {
    console.log('Message removed:', message);
    // Track analytics, update state, etc.
  }}
  onClick={(message) => {
    console.log('Message clicked:', message);
    // Navigate, expand details, etc.
  }}
/>
```

### Form Integration

```javascript
import { useForm } from 'react-hook-form';

function FormWithMessages() {
  const messages = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitForm(data);
      messages.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Form submitted successfully'
      });
    } catch (error) {
      messages.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        sticky: true
      });
    }
  };

  // Show validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.entries(errors).map(([field, error]) => ({
        severity: 'error',
        summary: `${field} Error`,
        detail: error.message
      }));
      messages.current.show(errorMessages);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Messages ref={messages} />
      {/* Form fields */}
    </form>
  );
}
```

### API Response Handling

```javascript
const handleApiCall = async () => {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    messages.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Data loaded successfully',
      life: 3000
    });

    return data;
  } catch (error) {
    messages.current.show({
      severity: 'error',
      summary: 'API Error',
      detail: error.message,
      sticky: true,
      closable: true
    });
  }
};
```

### Conditional Message Display

```javascript
// Show different messages based on conditions
const handleSave = async () => {
  const hasChanges = checkForChanges();

  if (!hasChanges) {
    messages.current.show({
      severity: 'info',
      summary: 'No Changes',
      detail: 'No changes to save',
      life: 2000
    });
    return;
  }

  try {
    await save();
    messages.current.show({
      severity: 'success',
      summary: 'Saved',
      detail: 'Changes saved successfully'
    });
  } catch (error) {
    messages.current.show({
      severity: 'error',
      summary: 'Save Failed',
      detail: error.message,
      sticky: true
    });
  }
};
```

### Inline Message Component (Static)

```jsx
// Declarative alternative for static messages
<div className="form-field">
  <label htmlFor="username">Username</label>
  <InputText id="username" />
  <Message severity="info" text="Username must be 3-20 characters" />
</div>

<div className="form-field">
  <label htmlFor="email">Email</label>
  <InputText id="email" className="p-invalid" />
  <Message severity="error" text="Email is required" />
</div>

<div className="form-field">
  <Message severity="success" text="All fields validated successfully" />
</div>
```

### With Custom Styling

```javascript
<Messages
  ref={messages}
  className="custom-messages"
  style={{ marginBottom: '2rem' }}
/>

// Show message with custom inline styles
messages.current.show({
  severity: 'info',
  summary: 'Custom Styled',
  detail: 'This message has custom styling',
  style: {
    border: 'solid #696cff',
    borderWidth: '0 0 0 6px',
    color: '#696cff'
  },
  className: 'my-custom-message'
});
```

### Animation Customization

```javascript
<Messages
  ref={messages}
  transitionOptions={{
    timeout: 300,
    classNames: 'fade'
  }}
/>

/* Custom CSS for fade animation */
/*
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
*/
```

## Advanced Patterns

### Message Queuing with Delays

```javascript
const showSequentialMessages = () => {
  messages.current.show({
    severity: 'info',
    summary: 'Step 1',
    detail: 'Starting process...'
  });

  setTimeout(() => {
    messages.current.show({
      severity: 'info',
      summary: 'Step 2',
      detail: 'Processing data...'
    });
  }, 1000);

  setTimeout(() => {
    messages.current.show({
      severity: 'success',
      summary: 'Complete',
      detail: 'Process finished successfully'
    });
  }, 2000);
};
```

### Message with Unique IDs

```javascript
// Add unique IDs for message tracking
messages.current.show({
  id: 'validation-error-email',
  severity: 'error',
  summary: 'Email Error',
  detail: 'Invalid email format'
});

// Later, can reference by ID if needed
```

### Batch Validation Errors

```javascript
const showValidationErrors = (errors) => {
  const errorMessages = errors.map(error => ({
    severity: 'error',
    summary: error.field,
    detail: error.message,
    sticky: true  // Keep visible until user fixes
  }));

  messages.current.show(errorMessages);
};

// Usage
showValidationErrors([
  { field: 'Email', message: 'Email is required' },
  { field: 'Password', message: 'Password must be 8+ characters' },
  { field: 'Name', message: 'Name is required' }
]);
```

### Progressive Feedback

```javascript
const handleLongOperation = async () => {
  // Show initial message
  messages.current.show({
    id: 'operation-status',
    severity: 'info',
    summary: 'Processing',
    detail: 'Please wait...',
    closable: false,
    sticky: true
  });

  try {
    await performOperation();

    // Replace with success message
    messages.current.replace([{
      severity: 'success',
      summary: 'Complete',
      detail: 'Operation completed successfully',
      life: 3000
    }]);
  } catch (error) {
    // Replace with error message
    messages.current.replace([{
      severity: 'error',
      summary: 'Failed',
      detail: error.message,
      sticky: true
    }]);
  }
};
```

## Best Practices

### 1. Message Lifespan Guidelines

**Quick Success**: 2000-3000ms
```javascript
messages.current.show({
  severity: 'success',
  detail: 'Saved',
  life: 2000
});
```

**Informational**: 4000-6000ms
```javascript
messages.current.show({
  severity: 'info',
  detail: 'Data synchronized',
  life: 5000
});
```

**Warnings**: 8000-10000ms or sticky
```javascript
messages.current.show({
  severity: 'warn',
  detail: 'Unsaved changes',
  life: 10000
});
```

**Errors**: Sticky with close button
```javascript
messages.current.show({
  severity: 'error',
  detail: 'Error occurred',
  sticky: true,
  closable: true
});
```

### 2. Message Content Guidelines

**Summary**: 1-3 words, action-oriented
- ✅ "Saved", "Error", "Warning"
- ❌ "The record has been successfully saved to the database"

**Detail**: Concise but complete
- ✅ "Changes saved successfully"
- ❌ "The changes that you made to the form have now been successfully saved to the database and are now persisted"

### 3. Severity Level Selection

| Use Case | Severity | Reasoning |
|----------|----------|-----------|
| Operation succeeded | success | Positive confirmation |
| Form validation failed | error | Requires user action |
| Unsaved changes exist | warn | Caution, not blocking |
| Helpful tip or context | info | Informational only |
| System offline | error | Critical, blocks usage |
| Optional field empty | info | Non-critical |

### 4. Ref Management

```javascript
// ✅ Good: Single ref for component
const messages = useRef(null);

// ❌ Bad: Creating refs in render
function MyComponent() {
  const messages = useRef(null);  // ✅ Top level

  return (
    <div>
      {items.map(item => (
        <Messages ref={useRef(null)} />  // ❌ Don't do this
      ))}
    </div>
  );
}
```

### 5. Error Handling

```javascript
// ✅ Good: Always handle null ref
const showMessage = () => {
  if (messages.current) {
    messages.current.show({ ... });
  }
};

// ✅ Good: Use optional chaining
messages.current?.show({ ... });

// ❌ Bad: Assuming ref is ready
messages.current.show({ ... });  // May crash if ref not ready
```

### 6. Clear Before Critical Operations

```javascript
const handleSubmit = async () => {
  // Clear old messages before showing new ones
  messages.current.clear();

  try {
    await submit();
    messages.current.show({
      severity: 'success',
      detail: 'Submitted successfully'
    });
  } catch (error) {
    messages.current.show({
      severity: 'error',
      detail: error.message
    });
  }
};
```

### 7. Limit Simultaneous Messages

```javascript
// ✅ Good: Limit visible messages
const maxMessages = 3;
const messageQueue = [];

const showMessage = (message) => {
  if (messageQueue.length >= maxMessages) {
    messages.current.clear();
    messageQueue = [];
  }

  messages.current.show(message);
  messageQueue.push(message);
};
```

## Use Cases

### Ideal For

1. **Form Submission Feedback**
   - Success confirmation after submit
   - Batch validation errors
   - Server-side validation results

2. **API Response Messages**
   - Success/failure notifications
   - Loading state indicators
   - Error messages from server

3. **Multi-Step Process Feedback**
   - Sequential operation status
   - Progress updates
   - Completion notifications

4. **Inline Contextual Alerts**
   - Section-specific messages
   - Page-level notifications
   - Contextual help and tips

5. **Transient Notifications**
   - Auto-save confirmations
   - Background sync status
   - Temporary status updates

### Not Ideal For

1. **Global App Notifications** → Use Toast instead
   - Corner-positioned alerts
   - System-wide messages
   - Cross-page notifications

2. **Modal Dialogs** → Use Dialog component
   - Blocking confirmations
   - User decisions
   - Complex interactions

3. **Permanent Help Text** → Use Message (singular) component
   - Always-visible instructions
   - Static form hints
   - Unchanging guidance

4. **Badge/Label Status** → Use Badge/Tag components
   - Inline status indicators
   - Item metadata
   - Count displays

## Comparison with Other Frameworks

### vs Toast Component (PrimeReact)

| Feature | Messages | Toast |
|---------|----------|-------|
| Position | Inline, flow-based | Fixed corner/edge |
| Use Case | Form/section feedback | Global notifications |
| Stacking | Vertical in flow | Overlay stack |
| Auto-dismiss | Optional | Common |
| Context | Local to section | Global to app |

### vs Message Component (PrimeReact)

| Feature | Messages (plural) | Message (singular) |
|---------|-------------------|-------------------|
| API | Imperative (ref) | Declarative (JSX) |
| Dynamic | Yes | No |
| Multiple | Yes | One at a time |
| Control | Programmatic | Props |
| Use Case | Dynamic feedback | Static messages |

### vs Other Framework Alert Components

**Similar To**:
- Material-UI Snackbar (with inline positioning)
- Ant Design Message (but inline vs. global)
- Chakra UI useToast (but inline vs. toast)

**Different From**:
- Bootstrap Alert (static, no imperative API)
- Tailwind Alert (CSS-only, no behavior)
- Semantic UI Message (static, declarative)

## Migration Considerations

### From Static Alerts

If migrating from static alert components:

```jsx
// Before: Static alert
<Alert severity="error">Error occurred</Alert>

// After: Dynamic Messages
const messages = useRef(null);
useEffect(() => {
  if (error) {
    messages.current.show({
      severity: 'error',
      detail: 'Error occurred'
    });
  }
}, [error]);

<Messages ref={messages} />
```

### From Toast to Messages

If notifications should be inline rather than positioned:

```javascript
// Before: Toast (corner position)
toast.current.show({ severity: 'success', detail: 'Saved' });

// After: Messages (inline)
messages.current.show({ severity: 'success', detail: 'Saved' });
```

### From Message to Messages

If needing dynamic control:

```jsx
// Before: Static Message
{error && <Message severity="error" text={error} />}

// After: Dynamic Messages
useEffect(() => {
  if (error) {
    messages.current.show({ severity: 'error', detail: error });
  }
}, [error]);
```

## Limitations & Considerations

### Current Limitations

1. **Accessibility Incomplete**: Official accessibility documentation is in development
2. **No Built-In Animation**: Requires `react-transition-group` package
3. **No Position Control**: Always inline where placed (use Toast for positioned alerts)
4. **No Queue Limits**: No built-in limit on message count
5. **No Message Priority**: Messages shown in order added, no priority system
6. **No Grouping**: No built-in message grouping or categorization

### Browser Compatibility

Follows PrimeReact's browser support:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 support requires polyfills

### Performance Considerations

- **Many Messages**: Excessive messages (>10) may impact performance
- **Animations**: CSSTransition adds overhead
- **Sticky Messages**: Accumulate if not manually cleared
- **DOM Nodes**: Each message adds DOM elements

### Developer Experience

**Strengths**:
- Simple imperative API
- Consistent with other PrimeReact components
- TypeScript support
- Rich theme system

**Challenges**:
- Ref pattern less intuitive than hooks
- Accessibility documentation pending
- Must install animation library separately
- Less discoverable than declarative props

## Summary

PrimeReact's Messages component provides a robust, ref-based imperative API for dynamic inline notifications. It excels at form feedback, API response messages, and multi-step process notifications with features like auto-dismiss, sticky mode, and message stacking. The component's imperative design makes it ideal for programmatic control from async operations and event handlers, while the separate Message component serves static inline use cases. Integration with PrimeReact's theme system and CSSTransition provides visual polish, though accessibility documentation is still in development.
