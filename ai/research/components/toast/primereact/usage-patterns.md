# PrimeReact - Toast Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/toast/
Status: ✅ Working
Version: PrimeReact (latest)
Last Verified: 2025-11-05

## Documentation Quality
Good - The documentation provides clear examples with live demos covering the primary use cases. The ref-based API pattern is well-demonstrated with multiple positioning, severity, and customization examples. The component includes both template-based and headless modes for different customization needs. However, complete API reference (all props with types and defaults), event callbacks, and advanced animation controls require consulting additional documentation tabs or source code.

## Component Definition
- **Core purpose**: Displays messages in an overlay as non-intrusive notifications for user feedback. Designed for temporary, system-initiated messages that appear without blocking user interaction and typically auto-dismiss after a short duration.
- **Mental model**: A notification overlay system positioned at screen edges or center, separate from the content flow. Unlike inline Message components, Toast notifications "pop up" temporarily to deliver feedback and then disappear, similar to physical toast popping from a toaster.
- **Semantic meaning**: Communicates transient status updates, feedback, or informational content with semantic severity levels. Uses ARIA alert role to announce important information to assistive technologies without interrupting screen reader flow.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling
- **Not Shown**: Pattern exists but not demonstrated in docs

## Display Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Overlay notification | ✅ | Native | Primary use case - messages appear in overlay at specified position |
| Auto-dismiss | ✅ | Native | Messages automatically close after `life` milliseconds (default: 3000ms) |
| Sticky messages | ✅ | Native | `sticky` prop prevents auto-dismissal |
| Multiple messages | ✅ | Native | Supports displaying multiple messages simultaneously |
| Positioned display | ✅ | Native | Seven position options for message placement |
| Icon display | ✅ | Native | Icons automatically shown based on severity level |
| Closable | ✅ | Native | Close button displayed on each message |
| Batch messages | ✅ | Native | `show()` accepts array of messages for simultaneous display |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple text | ✅ | Native | `summary` and `detail` props for structured text content |
| Custom template | ✅ | Native | `content` function prop for custom JSX layouts |
| Headless mode | ✅ | Native | Complete UI control via component-level `content` prop |
| Icons | ✅ | Native | Automatic severity-based icons |
| Rich formatting | ✅ | Composed | HTML/JSX within `content` function |
| Structured content | ✅ | Native | `summary` (title) and `detail` (description) structure |
| Avatar/images | ✅ | Composed | Via custom `content` template function |

## Severity Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Info | ✅ | Native | `severity="info"` - informational messages (blue theme) |
| Success | ✅ | Native | `severity="success"` - positive feedback (green theme) |
| Warning | ✅ | Native | `severity="warn"` - warning states (yellow/orange theme) |
| Error | ✅ | Native | `severity="error"` - error notifications (red theme) |
| Secondary | ✅ | Native | `severity="secondary"` - secondary messaging (gray theme) |
| Contrast | ✅ | Native | `severity="contrast"` - high contrast variant |

## Position Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Top-left | ✅ | Native | `position="top-left"` |
| Top-center | ✅ | Native | `position="top-center"` |
| Top-right | ✅ | Native | `position="top-right"` |
| Center | ✅ | Native | `position="center"` |
| Bottom-left | ✅ | Native | `position="bottom-left"` |
| Bottom-center | ✅ | Native | `position="bottom-center"` |
| Bottom-right | ✅ | Native | `position="bottom-right"` |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Auto-dismiss | ✅ | Native | Default behavior - messages close after `life` duration |
| Manual dismiss | ✅ | Native | Close button on each message |
| Sticky/persistent | ✅ | Native | `sticky: true` in message object prevents auto-dismiss |
| Clear all | ✅ | Native | `clear()` method removes all messages |
| Queued display | ✅ | Native | Multiple messages stack vertically at position |
| Individual lifetimes | ✅ | Native | Each message can have custom `life` duration |

## API Method Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| show() | ✅ | Native | Display single message or array of messages |
| clear() | ✅ | Native | Remove all currently displayed messages |
| Ref-based API | ✅ | Native | Methods accessed via React ref |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom classes | ✅ | Native | `className` prop for CSS class application |
| Inline styles | ✅ | Native | `style` prop for inline styling |
| Headless styling | ✅ | Native | Complete style control via `content` prop |
| Close button customization | ✅ | Native | `closeButtonProps` for close button attributes |

## Code Examples

### Basic Setup and Usage
```jsx
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

function App() {
  const toast = useRef(null);

  const show = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
      life: 3000
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Button onClick={show} label="Show Toast" />
    </>
  );
}
```

### Severity Levels
```jsx
const toast = useRef(null);

// Success message (green)
const showSuccess = () => {
  toast.current.show({
    severity: 'success',
    summary: 'Success Message',
    detail: 'Operation completed successfully'
  });
};

// Info message (blue)
const showInfo = () => {
  toast.current.show({
    severity: 'info',
    summary: 'Info Message',
    detail: 'Here is some information'
  });
};

// Warning message (yellow/orange)
const showWarn = () => {
  toast.current.show({
    severity: 'warn',
    summary: 'Warning Message',
    detail: 'Please be careful'
  });
};

// Error message (red)
const showError = () => {
  toast.current.show({
    severity: 'error',
    summary: 'Error Message',
    detail: 'Something went wrong'
  });
};

// Secondary message (gray)
const showSecondary = () => {
  toast.current.show({
    severity: 'secondary',
    summary: 'Secondary Message',
    detail: 'Additional information'
  });
};

// Contrast message (high contrast)
const showContrast = () => {
  toast.current.show({
    severity: 'contrast',
    summary: 'Contrast Message',
    detail: 'High contrast notification'
  });
};

<Toast ref={toast} />
<Button label="Success" severity="success" onClick={showSuccess} />
<Button label="Info" severity="info" onClick={showInfo} />
<Button label="Warn" severity="warning" onClick={showWarn} />
<Button label="Error" severity="danger" onClick={showError} />
<Button label="Secondary" severity="secondary" onClick={showSecondary} />
<Button label="Contrast" severity="contrast" onClick={showContrast} />
```

### Positioning
```jsx
const toastTL = useRef(null);
const toastTC = useRef(null);
const toastTR = useRef(null);
const toastBL = useRef(null);
const toastBC = useRef(null);
const toastBR = useRef(null);
const toastCenter = useRef(null);

const showTopLeft = () => {
  toastTL.current.show({
    severity: 'info',
    summary: 'Top Left',
    detail: 'Message positioned at top-left'
  });
};

const showBottomRight = () => {
  toastBR.current.show({
    severity: 'success',
    summary: 'Bottom Right',
    detail: 'Message positioned at bottom-right'
  });
};

// Create separate Toast instances for each position
<Toast ref={toastTL} position="top-left" />
<Toast ref={toastTC} position="top-center" />
<Toast ref={toastTR} position="top-right" />
<Toast ref={toastCenter} position="center" />
<Toast ref={toastBL} position="bottom-left" />
<Toast ref={toastBC} position="bottom-center" />
<Toast ref={toastBR} position="bottom-right" />

<Button label="Top Left" onClick={showTopLeft} />
<Button label="Bottom Right" onClick={showBottomRight} />
```

### Multiple Messages
```jsx
const toast = useRef(null);

const showMultiple = () => {
  // Pass array of message objects to display multiple at once
  toast.current.show([
    { severity: 'info', summary: 'Message 1', detail: 'First notification', life: 3000 },
    { severity: 'success', summary: 'Message 2', detail: 'Second notification', life: 3000 },
    { severity: 'warn', summary: 'Message 3', detail: 'Third notification', life: 3000 }
  ]);
};

<Toast ref={toast} />
<Button onClick={showMultiple} label="Show Multiple" />
```

### Sticky Messages and Clear
```jsx
const toast = useRef(null);

const showSticky = () => {
  toast.current.show({
    severity: 'info',
    summary: 'Sticky Message',
    detail: 'This message will not auto-dismiss',
    sticky: true  // Prevents auto-dismiss
  });
};

const clear = () => {
  toast.current.clear();  // Removes all messages
};

<Toast ref={toast} />
<Button onClick={showSticky} label="Show Sticky" />
<Button onClick={clear} label="Clear All" />
```

### Custom Lifetime
```jsx
const toast = useRef(null);

const showCustomLife = () => {
  toast.current.show({
    severity: 'info',
    summary: 'Custom Lifetime',
    detail: 'This message will dismiss after 5 seconds',
    life: 5000  // 5 seconds instead of default 3 seconds
  });
};

<Toast ref={toast} />
<Button onClick={showCustomLife} label="Show 5s Message" />
```

### Custom Template
```jsx
const toast = useRef(null);

const showTemplate = () => {
  toast.current.show({
    severity: 'success',
    summary: 'Can you send me the report?',
    sticky: true,
    content: (props) => (
      <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
        <div className="flex align-items-center gap-2">
          <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
          <span className="font-bold text-900">Amy Elsner</span>
        </div>
        <div className="font-medium text-lg my-3 text-900">
          {props.message.summary}
        </div>
        <Button
          className="p-button-sm flex"
          label="Reply"
          severity="success"
          onClick={() => toast.current.clear()}
        />
      </div>
    )
  });
};

<Toast ref={toast} />
<Button onClick={showTemplate} label="Show Custom Template" />
```

### Headless Mode
```jsx
const toast = useRef(null);
const [progress, setProgress] = useState(0);

const showHeadless = () => {
  toast.current.show({
    severity: 'info',
    summary: 'Uploading',
    detail: 'File upload in progress'
  });
};

const clear = () => {
  toast.current.clear();
};

<Toast
  ref={toast}
  content={({ message }) => (
    <section
      className="flex p-3 gap-3 w-full bg-black-alpha-90 shadow-2 fadeindown"
      style={{ borderRadius: '10px' }}
    >
      <i className="pi pi-cloud-upload text-primary-500 text-2xl"></i>
      <div className="flex flex-column gap-3 w-full">
        <p className="m-0 font-semibold text-base text-white">
          {message.summary}
        </p>
        <p className="m-0 text-base text-700">
          {message.detail}
        </p>
        <div className="flex flex-column gap-2">
          <ProgressBar value={progress} showValue={false} />
          <label className="text-right text-xs text-white">
            {progress}% uploaded...
          </label>
        </div>
        <div className="flex gap-3 mb-3">
          <Button
            label="Another Upload?"
            text
            className="p-0"
            onClick={clear}
          />
          <Button
            label="Cancel"
            text
            className="text-white p-0"
            onClick={clear}
          />
        </div>
      </div>
    </section>
  )}
/>
<Button onClick={showHeadless} label="View Headless" />
```

### Real-World Integration Examples

#### Form Submission Feedback
```jsx
const toast = useRef(null);

const handleSubmit = async (formData) => {
  try {
    await submitForm(formData);
    toast.current.show({
      severity: 'success',
      summary: 'Form Submitted',
      detail: 'Your form has been successfully submitted',
      life: 3000
    });
  } catch (error) {
    toast.current.show({
      severity: 'error',
      summary: 'Submission Failed',
      detail: error.message,
      life: 5000
    });
  }
};
```

#### API Request Feedback
```jsx
const toast = useRef(null);

const saveSettings = async () => {
  toast.current.show({
    severity: 'info',
    summary: 'Saving...',
    detail: 'Please wait while we save your settings',
    sticky: true
  });

  try {
    await api.saveSettings();
    toast.current.clear();
    toast.current.show({
      severity: 'success',
      summary: 'Settings Saved',
      detail: 'Your preferences have been updated',
      life: 3000
    });
  } catch (error) {
    toast.current.clear();
    toast.current.show({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Could not save settings. Please try again.',
      sticky: true
    });
  }
};
```

#### User Action Confirmation
```jsx
const toast = useRef(null);

const deleteItem = async (itemId) => {
  await api.delete(itemId);

  toast.current.show({
    severity: 'success',
    summary: 'Item Deleted',
    detail: 'The item has been removed successfully',
    life: 3000
  });
};
```

#### Multiple Channel Usage
```jsx
// Different toast instances for different message types
const notificationToast = useRef(null);
const errorToast = useRef(null);
const successToast = useRef(null);

// Notifications in top-right
<Toast ref={notificationToast} position="top-right" />
// Errors in top-center for prominence
<Toast ref={errorToast} position="top-center" />
// Success in bottom-right to not obstruct
<Toast ref={successToast} position="bottom-right" />

// Use appropriate toast for each case
errorToast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed' });
successToast.current.show({ severity: 'success', summary: 'Done', detail: 'Completed' });
```

## API Reference

### Component Props (Toast Element)
```typescript
interface ToastProps {
  // Positioning
  position?: 'top-left' | 'top-center' | 'top-right' | 'center' |
             'bottom-left' | 'bottom-center' | 'bottom-right';

  // Behavior (default for all messages)
  life?: number;                          // Default auto-dismiss duration in ms
  sticky?: boolean;                       // Prevent auto-dismiss by default

  // Content
  content?: (props: { message: ToastMessage }) => React.ReactNode;  // Headless mode

  // Styling
  style?: React.CSSProperties;            // Inline styles
  className?: string;                     // CSS classes

  // Accessibility
  closeButtonProps?: object;              // Close button customization

  // Ref for API methods
  ref: React.RefObject<ToastAPI>;
}
```

### Message Object Structure
```typescript
interface ToastMessage {
  // Severity
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

  // Content
  summary?: string;                       // Primary message text (title)
  detail?: string;                        // Secondary message text (description)
  content?: (props: { message: ToastMessage }) => React.ReactNode;  // Custom template

  // Behavior
  life?: number;                          // Auto-dismiss duration in milliseconds
  sticky?: boolean;                       // If true, message persists until manually closed

  // Styling (if supported)
  closable?: boolean;                     // Show/hide close button
  className?: string;                     // Custom CSS classes
  style?: React.CSSProperties;            // Inline styles
}
```

### API Methods (via ref)
```typescript
interface ToastAPI {
  show(message: ToastMessage | ToastMessage[]): void;  // Display message(s)
  clear(): void;                                        // Remove all messages
}
```

### Default Behavior
- Default position: Not specified (appears to be top-right based on examples)
- Default life: 3000ms (3 seconds)
- Default severity: Not specified (appears to default to 'info')
- Uses `alert` role with implicit `aria-live="assertive"` and `aria-atomic="true"`
- Icons are automatically displayed based on severity
- Close button included by default
- Keyboard support: Enter/Space keys close individual messages

## Notable Features

### 1. **Ref-Based Imperative API**
Unlike many React components that use declarative props, Toast uses a ref-based imperative API:
```jsx
const toast = useRef(null);
toast.current.show({ ... });  // Imperative call
```

This pattern provides:
- Programmatic control from anywhere with ref access
- No need to manage message state in component
- Clean separation between UI and notification logic
- Easy integration with async operations and event handlers

### 2. **Dual Template Systems**

The component offers two distinct template customization levels:

**Message-Level Template** (individual message customization):
```jsx
toast.current.show({
  content: (props) => <CustomLayout {...props} />
});
```

**Component-Level Template** (headless mode for all messages):
```jsx
<Toast content={({ message }) => <CompletelyCustomUI />} />
```

This dual approach supports both:
- Quick one-off custom messages (message-level)
- Consistent custom design system (component-level)

### 3. **Multi-Position Architecture**

The component supports managing multiple independent toast containers:
```jsx
<Toast ref={toastTL} position="top-left" />
<Toast ref={toastBR} position="bottom-right" />
```

This enables:
- Different message types in different screen positions
- Separate notification channels (errors top-center, success bottom-right)
- Independent message queues per position
- Prevents message overlap

### 4. **Flexible Message Lifecycle Control**

Each message can have independent lifecycle configuration:
- Per-message `life` duration
- Per-message `sticky` behavior
- Global default via component props
- Message-level overrides

Example:
```jsx
// Default 3s, but this message stays for 10s
toast.current.show({ life: 10000, ... });

// Default auto-dismiss, but this message is sticky
toast.current.show({ sticky: true, ... });
```

### 5. **Batch Message Display**

The `show()` method accepts arrays for simultaneous message display:
```jsx
toast.current.show([
  { severity: 'info', summary: 'Step 1', detail: 'Processing...' },
  { severity: 'success', summary: 'Step 2', detail: 'Complete' },
  { severity: 'warn', summary: 'Step 3', detail: 'Warning' }
]);
```

This is valuable for:
- Multi-step operation feedback
- Batch validation results
- Grouped notifications

### 6. **Six Severity Levels**

Like PrimeReact's Message component, Toast provides six severity variants:
- Standard four: success, info, warn, error
- Additional: secondary, contrast

The extra variants support more nuanced messaging hierarchies.

### 7. **Clear All Functionality**

The `clear()` method removes all active messages:
```jsx
toast.current.clear();
```

Useful for:
- Cleanup before showing new messages
- User-initiated "dismiss all"
- State reset on navigation
- Error recovery flows

### 8. **Accessibility First**

Built-in ARIA support with:
- `alert` role for screen reader announcements
- Implicit `aria-live="assertive"` for immediate announcements
- `aria-atomic="true"` for complete message reading
- Semantic button element for close functionality
- Customizable `aria-label` via `closeButtonProps`
- Keyboard support (Enter/Space to close)

### 9. **Non-Blocking Overlay Pattern**

Toast messages appear in an overlay layer that:
- Doesn't interrupt user interaction with main content
- Doesn't block or shift page layout
- Auto-dismisses to avoid screen clutter
- Positions at screen edges to minimize obstruction

### 10. **Headless Mode for Design Systems**

The component-level `content` prop enables complete UI replacement:
```jsx
<Toast content={({ message }) => <YourCompleteDesign />} />
```

This allows:
- Complete design system integration
- Custom animations
- Brand-specific styling
- Alternative layouts (cards, banners, etc.)
- Full accessibility control

## Research Notes

### Architecture Approach

PrimeReact Toast follows an **overlay notification pattern** with these characteristics:

- **Imperative API**: Ref-based control rather than declarative state
- **Position-based instances**: Multiple Toast components for different screen positions
- **Automatic lifecycle**: Built-in auto-dismiss with configurable duration
- **Template hierarchy**: Message-level and component-level customization
- **Queue management**: Implicit message stacking at each position

### Comparison with Other Frameworks

**Similar To:**
- Material-UI Snackbar (ref-based API, positioning)
- Ant Design Message/Notification (imperative API)
- Chakra UI Toast (position-based instances)

**Different From:**
- Inline Message component (overlay vs inline)
- Modal/Dialog (non-blocking vs blocking)
- Alert/Banner (temporary vs persistent)

### Toast vs Message Component

PrimeReact separates notification concerns:
- **Message**: Inline, contextual, manually placed in markup
- **Toast**: Overlay, system-initiated, programmatically triggered
- **Messages**: Multiple inline messages (separate component)

This separation follows the pattern:
- Message = Inline feedback
- Toast = Overlay notifications
- Messages = Inline message queue

### Strengths

1. **Imperative API**: Clean programmatic control via refs
2. **Multi-position support**: Seven screen positions with independent instances
3. **Dual template modes**: Message-level and component-level customization
4. **Batch display**: Array support for multiple simultaneous messages
5. **Flexible lifecycle**: Per-message and global duration control
6. **Clear all method**: Easy bulk dismissal
7. **Six severity levels**: More nuanced than typical 4-level systems
8. **Accessibility**: Built-in ARIA support and keyboard navigation
9. **Headless mode**: Complete UI customization capability
10. **Non-blocking UX**: Overlay pattern doesn't interrupt user flow

### Limitations

1. **No declarative API**: Can't control via props/state (only imperative)
2. **Animation control**: Animation options not documented
3. **Event callbacks**: onShow, onHide, onRemove not demonstrated
4. **Icon customization**: Per-message icon override not shown
5. **Transition control**: Custom animation/transition not documented
6. **Queue limits**: No documented max message limit or queue control
7. **Grouped messages**: No message grouping or channel system shown
8. **Close button control**: `closeButtonProps` mentioned but not detailed
9. **Message ID tracking**: No way to target specific messages for removal
10. **Sound/haptic**: No notification sound or haptic feedback options

### Developer Experience

**Strengths:**
- Very intuitive ref-based API
- Easy to trigger from async operations
- Position-based instances are clear and explicit
- Template customization is flexible
- Batch messages simplify multi-notification scenarios

**Limitations:**
- No TypeScript interfaces shown in docs
- Event callbacks not documented
- Animation customization unclear
- Individual message removal not possible (only clear all)
- Testing imperative API requires ref mocking

### Use Cases

**Ideal For:**
- Form submission feedback
- API request status updates
- User action confirmations
- System notifications
- Success/error alerts
- Progress updates (with headless mode)
- Multi-step operation feedback
- Non-critical alerts

**Not Ideal For:**
- Critical errors requiring acknowledgment (use Modal)
- Persistent status indicators (use inline Message)
- Complex interactive notifications (limited interaction support)
- Form validation errors (use inline Message)
- Long-form content (auto-dismiss makes reading difficult)

### Pattern Evolution Opportunities

1. **Declarative API Option**:
```jsx
// Current: imperative only
toast.current.show({ severity: 'success', summary: 'Done' });

// Potential: declarative alternative
const [messages, setMessages] = useState([]);
<Toast messages={messages} onDismiss={(id) => removeMessage(id)} />
```

2. **Individual Message Removal**:
```jsx
// Current: only clear all
toast.current.clear();

// Potential: targeted removal
const id = toast.current.show({ ... });
toast.current.remove(id);
```

3. **Message Grouping/Channels**:
```jsx
// Current: separate instances per position
<Toast ref={toast1} position="top-right" />
<Toast ref={toast2} position="bottom-right" />

// Potential: single instance with channels
<Toast ref={toast} />
toast.current.show({ channel: 'errors', position: 'top-center', ... });
toast.current.show({ channel: 'notifications', position: 'top-right', ... });
```

4. **Event Callbacks**:
```jsx
// Current: no callbacks shown
toast.current.show({ severity: 'success', summary: 'Done' });

// Potential: lifecycle hooks
toast.current.show({
  severity: 'success',
  summary: 'Done',
  onShow: () => console.log('shown'),
  onHide: () => console.log('hidden'),
  onClose: () => console.log('closed')
});
```

5. **Animation Control**:
```jsx
// Current: default animation only
<Toast ref={toast} />

// Potential: animation options
<Toast ref={toast} animation="slide" transitionDuration={300} />
toast.current.show({
  ...,
  animation: 'fade',
  transitionDuration: 500
});
```

6. **Queue Management**:
```jsx
// Current: unlimited queue
toast.current.show([message1, message2, message3, ...]);

// Potential: queue limits and strategies
<Toast ref={toast} maxMessages={3} queueStrategy="replace-oldest" />
```

7. **Sound/Haptic Feedback**:
```jsx
// Current: visual only
toast.current.show({ severity: 'error', summary: 'Error' });

// Potential: multi-sensory feedback
toast.current.show({
  severity: 'error',
  summary: 'Error',
  sound: 'error-beep',
  haptic: 'error-vibration'
});
```

### Integration Patterns

**With React Hook Form:**
```jsx
const toast = useRef(null);
const { handleSubmit } = useForm();

const onSubmit = async (data) => {
  try {
    await submitForm(data);
    toast.current.show({
      severity: 'success',
      summary: 'Form Submitted',
      detail: 'Your data has been saved successfully'
    });
  } catch (error) {
    toast.current.show({
      severity: 'error',
      summary: 'Submission Failed',
      detail: error.message
    });
  }
};
```

**With State Management (Redux):**
```jsx
// Toast notification middleware
const toastMiddleware = (toast) => (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.endsWith('/fulfilled')) {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: action.payload.message
    });
  }

  if (action.type.endsWith('/rejected')) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: action.error.message
    });
  }

  return result;
};
```

**With Async Operations:**
```jsx
const toast = useRef(null);

const performLongOperation = async () => {
  const id = toast.current.show({
    severity: 'info',
    summary: 'Processing',
    detail: 'Please wait...',
    sticky: true
  });

  try {
    await longRunningTask();
    toast.current.clear();
    toast.current.show({
      severity: 'success',
      summary: 'Complete',
      detail: 'Operation finished successfully'
    });
  } catch (error) {
    toast.current.clear();
    toast.current.show({
      severity: 'error',
      summary: 'Failed',
      detail: error.message,
      sticky: true
    });
  }
};
```

**Custom Hook Pattern:**
```jsx
// useToast.js - Custom hook for toast notifications
export const useToast = () => {
  const toast = useRef(null);

  const showSuccess = (summary, detail) => {
    toast.current.show({ severity: 'success', summary, detail });
  };

  const showError = (summary, detail) => {
    toast.current.show({ severity: 'error', summary, detail, life: 5000 });
  };

  const showInfo = (summary, detail) => {
    toast.current.show({ severity: 'info', summary, detail });
  };

  return {
    Toast: () => <Toast ref={toast} position="top-right" />,
    showSuccess,
    showError,
    showInfo
  };
};

// Usage
const { Toast, showSuccess, showError } = useToast();

<Toast />
<Button onClick={() => showSuccess('Done', 'Task completed')} />
```

## Relationship to Message and Messages Components

PrimeReact has three distinct notification components:

- **Message** (singular): Single inline message, manually placed in markup, for contextual feedback
- **Messages** (plural): Multiple inline messages with queue management, for stacked inline notifications
- **Toast**: Overlay notifications with programmatic control, for system-initiated feedback

The separation follows:
- **Inline** vs **Overlay**: Message/Messages are inline, Toast is overlay
- **Manual** vs **Programmatic**: Message is declarative, Toast is imperative
- **Contextual** vs **System**: Message tied to UI elements, Toast is page-level

For comprehensive notification patterns, all three components serve different use cases:
- Form validation → Message
- Multi-step errors → Messages
- Success feedback → Toast
