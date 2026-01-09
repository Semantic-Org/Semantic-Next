# PrimeReact - Message Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://primereact.org/message
Status: ✅ Working
Version: PrimeReact (latest)
Last Verified: 2025-11-04

## Documentation Quality
Good - The documentation provides clear examples with live demos and covers the primary use cases. The component has a focused, simple API designed specifically for inline contextual messages. However, detailed API reference (all props with types and defaults) and advanced customization patterns require consulting additional documentation tabs or source code.

## Component Definition
- **Core purpose**: Displays inline contextual information messages, primarily designed for form validation feedback and status notifications. Provides a simple, lightweight way to show severity-based messages alongside UI elements.
- **Mental model**: An inline alert/notification component optimized for contextual display. Unlike banner-style messages, this is designed to be placed adjacent to specific UI elements (especially form fields) to provide immediate, relevant feedback.
- **Semantic meaning**: Communicates status, feedback, or informational content with semantic severity levels. Uses ARIA alert role to announce important information to assistive technologies.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling
- **Not Shown**: Pattern exists but not demonstrated in docs

## Display Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inline message | ✅ | Native | Primary use case - displayed inline with content |
| Form validation | ✅ | Native | Shown alongside invalid form inputs with error severity |
| Status feedback | ✅ | Native | Six severity levels for different message types |
| Icon display | ✅ | Native | Icons automatically shown based on severity level |
| Custom template | ✅ | Native | `content` prop accepts custom JSX for complex layouts |
| Sticky/persistent | ❓ | Not Shown | Not demonstrated in available documentation |
| Closable | ❓ | Not Shown | `closeButtonProps` mentioned but not demonstrated |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple text | ✅ | Native | `text` prop for plain string messages |
| Custom content | ✅ | Native | `content` prop accepts JSX for rich content (images, styled text, etc.) |
| Icons | ✅ | Native | Automatic severity-based icons, customization not shown |
| Multiple elements | ✅ | Composed | Via `content` prop with complex JSX |
| Rich formatting | ✅ | Composed | HTML/JSX within `content` prop |

## Severity Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Info | ✅ | Native | `severity="info"` - informational messages (blue theme) |
| Success | ✅ | Native | `severity="success"` - positive feedback (green theme) |
| Warning | ✅ | Native | `severity="warn"` - warning states (yellow/orange theme) |
| Error | ✅ | Native | `severity="error"` - error notifications (red theme) |
| Secondary | ✅ | Native | `severity="secondary"` - secondary messaging (gray theme) |
| Contrast | ✅ | Native | `severity="contrast"` - high contrast variant |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Static display | ✅ | Native | Default behavior - always visible |
| Closable | ❓ | Not Shown | `closeButtonProps` prop mentioned, implementation not shown |
| Auto-dismiss | ❌ | Not Present | Not mentioned in documentation |
| Lifecycle events | ❓ | Not Shown | onClose or similar events not demonstrated |

## Variant Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Severity variants | ✅ | Native | Six built-in severity levels with distinct styling |
| Size variants | ❌ | Not Present | No size options mentioned |
| Outlined | ❌ | Not Present | No outlined variant shown |
| Filled | ✅ | Native | Default appearance is filled/solid |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom classes | ✅ | Native | `className` prop for CSS class application |
| Inline styles | ✅ | Native | `style` prop for inline styling |
| Border customization | ✅ | CSS-only | Example shows custom border styling |
| Color customization | ✅ | CSS-only | Example shows custom text color |

## Code Examples

### Basic Usage
```jsx
import { Message } from 'primereact/message';

// Simplest form - default severity
<Message text="Username is required" />

// With severity specified
<Message severity="error" text="Username is required" />
```

### Severity Levels
```jsx
// Info message (blue)
<Message severity="info" text="Info Message" />

// Success message (green)
<Message severity="success" text="Success Message" />

// Warning message (yellow/orange)
<Message severity="warn" text="Warning Message" />

// Error message (red)
<Message severity="error" text="Error Message" />

// Secondary message (gray)
<Message severity="secondary" text="Secondary Message" />

// Contrast message (high contrast)
<Message severity="contrast" text="Contrast Message" />
```

### Form Validation Usage
```jsx
// Typical form validation pattern
<div className="flex flex-wrap align-items-center mb-3 gap-2">
  <label htmlFor="username" className="p-hidden-accessible">
    Username
  </label>
  <InputText
    id="username"
    placeholder="Username"
    className="p-invalid mr-2"
  />
  <Message severity="error" text="Username is required" />
</div>
```

### Custom Content Template
```jsx
// Using content prop for rich layouts
const customContent = (
  <div className="flex align-items-center">
    <img
      alt="logo"
      src="/path/to/logo.svg"
      width="32"
      className="mr-2"
    />
    <div className="ml-2">
      <strong>Custom Title</strong>
      <p className="text-sm">Additional details here</p>
    </div>
  </div>
);

<Message
  severity="info"
  content={customContent}
/>
```

### Custom Styling
```jsx
// Custom border and color
<Message
  style={{
    border: 'solid #696cff',
    borderWidth: '0 0 0 6px',
    color: '#696cff'
  }}
  className="border-primary w-full justify-content-start"
  severity="info"
  content={customContent}
/>
```

### Multiple Messages
```jsx
// Display multiple messages in a form
<div className="form-section">
  <div className="field">
    <InputText className="p-invalid" />
    <Message severity="error" text="Email is required" />
  </div>

  <div className="field">
    <InputText className="p-invalid" />
    <Message severity="error" text="Password must be at least 8 characters" />
  </div>

  <Message
    severity="info"
    text="All fields are required to submit the form"
  />
</div>
```

## API Reference

### Core Props (Identified from Examples)
```typescript
interface MessageProps {
  // Content
  text?: string;                    // Simple text message
  content?: React.ReactNode;        // Custom JSX content

  // Severity
  severity?: 'info' | 'success' | 'warn' | 'error' | 'secondary' | 'contrast';

  // Styling
  style?: React.CSSProperties;      // Inline styles
  className?: string;               // CSS classes

  // Behavior (mentioned but not demonstrated)
  closeButtonProps?: object;        // Close button customization

  // Accessibility
  // Supports aria-label and aria-labelledby (mentioned in docs)
}
```

### Default Behavior
- Default severity appears to be "info" when not specified
- Uses `alert` role with implicit `aria-live="assertive"` and `aria-atomic="true"`
- Icons are automatically displayed based on severity
- Close button implemented as semantic `button` element when enabled

## Notable Features

### 1. **Dual Content API**
The component offers two distinct content patterns:
- `text` prop for simple string messages (most common use case)
- `content` prop for rich JSX content (images, complex layouts, formatted text)

This dual approach balances simplicity for basic cases with flexibility for complex needs.

### 2. **Six Severity Levels**
Unlike many libraries with 3-4 severity levels, PrimeReact provides six:
- Standard four: info, success, warn, error
- Additional: secondary, contrast

The `secondary` and `contrast` variants provide more nuanced messaging options.

### 3. **Form Validation Focus**
The component is explicitly designed and optimized for form validation scenarios, with examples showing it paired with form inputs. This is its primary use case, unlike more general-purpose alert components.

### 4. **Accessibility First**
Built-in ARIA support with:
- `alert` role for screen reader announcements
- Implicit `aria-live="assertive"` for immediate announcements
- `aria-atomic="true"` for complete message reading
- Semantic button element for close functionality
- Support for `aria-label` and `aria-labelledby`

### 5. **Lightweight Design**
The component has a minimal, focused API without complex features like:
- Auto-dismiss timers
- Animation controls
- Complex lifecycle events
- Position management

This keeps it simple and performant for its primary inline use case.

### 6. **Keyboard Support**
Built-in keyboard interaction:
- Enter key closes message
- Space key closes message

### 7. **Template Flexibility**
The `content` prop accepts any React node, enabling rich content composition without prop proliferation. Examples show images, styled text, and complex layouts.

### 8. **Styling Control**
Provides both `style` and `className` props for flexible styling approaches:
- Framework/utility class users: `className`
- Inline styling users: `style`
- Custom theme users: Both combined

## Research Notes

### Architecture Approach
PrimeReact Message follows a **minimalist inline message pattern**:
- Focused specifically on contextual, inline messages
- Optimized for form validation feedback
- Separate from banner/toast notifications
- Content-first API with two distinct content patterns

### Comparison with Other Frameworks

**Similar To:**
- Mantine Alert (inline variant)
- Chakra UI Alert (inline usage)
- Ant Design Alert (message variant)

**Different From:**
- Toast notifications (Toast component is separate in PrimeReact)
- Banner alerts (separate Messages component for multiple queued messages)
- Modal dialogs (different component family)

### Message vs Messages Component

The documentation references both "Message" (singular) and "Messages" (plural) components:
- **Message**: Single inline message (this component)
- **Messages**: Multiple stacked/queued messages (separate component)

This separation is similar to Material-UI's Alert vs Snackbar pattern.

### Strengths

1. **Clear purpose**: Focused on inline contextual messages
2. **Simple API**: Minimal props for common use cases
3. **Dual content model**: `text` for simple, `content` for complex
4. **Accessibility**: Built-in ARIA support
5. **Form-optimized**: Perfect for validation feedback
6. **Six severity levels**: More nuanced than typical 4-level systems
7. **Template flexibility**: `content` prop enables rich layouts
8. **Styling flexibility**: Both `className` and `style` props

### Limitations

1. **No auto-dismiss**: No built-in timer/auto-close functionality
2. **Limited close customization**: `closeButtonProps` mentioned but not documented
3. **No size variants**: Single size only
4. **No outlined variant**: Only filled/solid style shown
5. **No icon customization**: Icons appear automatic, customization not shown
6. **No lifecycle events**: onClose or similar not demonstrated
7. **Documentation gaps**: API reference not fully shown in available docs

### Developer Experience

**Strengths:**
- Very easy to learn (2-3 props cover 90% of use cases)
- Type-safe severity levels
- Intuitive content vs text distinction
- Works perfectly with form libraries

**Limitations:**
- Icon customization not clear
- Close button configuration unclear
- Need to check source for complete API
- Distinction from Messages component not explained

### Use Cases

**Ideal For:**
- Form validation errors
- Field-level feedback
- Inline contextual hints
- Status messages adjacent to specific UI elements
- Simple informational notes

**Not Ideal For:**
- Page-level alerts (use banner or toast)
- Multiple stacked messages (use Messages component)
- Dismissible notifications with callbacks
- Auto-expiring messages
- Complex interactive alerts

### Pattern Evolution Opportunities

1. **Prop-based icon customization**:
```jsx
// Current: automatic icons only
<Message severity="error" text="Error occurred" />

// Potential: custom icon support
<Message
  severity="error"
  text="Error occurred"
  icon={<CustomIcon />}
  iconPosition="left"
/>
```

2. **Explicit close functionality**:
```jsx
// Current: closeButtonProps mentioned but unclear
<Message text="Message" closeButtonProps={{...}} />

// Potential: clearer close API
<Message
  text="Message"
  closable={true}
  onClose={() => console.log('closed')}
/>
```

3. **Size variants**:
```jsx
// Current: single size
<Message text="Message" />

// Potential: size options
<Message text="Message" size="sm" />
<Message text="Message" size="md" />
<Message text="Message" size="lg" />
```

4. **Variant prop for styling**:
```jsx
// Current: only filled shown
<Message text="Message" />

// Potential: variant support
<Message text="Message" variant="filled" />
<Message text="Message" variant="outlined" />
<Message text="Message" variant="light" />
```

### Integration Patterns

**With React Hook Form:**
```jsx
const { formState: { errors } } = useForm();

{errors.email && (
  <Message
    severity="error"
    text={errors.email.message}
  />
)}
```

**With State Management:**
```jsx
const [showSuccess, setShowSuccess] = useState(false);

{showSuccess && (
  <Message
    severity="success"
    text="Settings saved successfully"
  />
)}
```

**With Custom Validation:**
```jsx
const validateField = (value) => {
  if (!value) return 'Field is required';
  if (value.length < 3) return 'Minimum 3 characters';
  return null;
};

const error = validateField(inputValue);

{error && (
  <Message severity="error" text={error} />
)}
```

## Relationship to Messages Component

While this research focuses on the Message (singular) component, PrimeReact also has a Messages (plural) component for handling multiple queued messages. The key differences appear to be:

- **Message**: Single inline message, manually placed in markup
- **Messages**: Multiple messages, potentially with queue management

For comprehensive pattern analysis, both components should be studied, but Message serves the inline contextual use case specifically.
