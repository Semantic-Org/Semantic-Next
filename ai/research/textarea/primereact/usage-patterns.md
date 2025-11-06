# PrimeReact - InputTextarea Usage Patterns

## Component URL
- Primary: https://primereact.org/inputtextarea/
- Secondary: https://www.primefaces.org/primereact-v8/inputtextarea/

Status: ✅ Working (both URLs accessible)

## Documentation Quality
**Good** - Documentation is well-structured and provides clear information. Includes:
- Clear component overview and purpose statement
- Complete prop reference with types and defaults
- Multiple code examples demonstrating key features
- Import instructions (module and CDN)
- Theme customization information
- CSS class reference

**Areas for improvement:**
- Accessibility documentation noted as "under development"
- Limited advanced usage examples
- No form validation patterns shown
- Character count patterns not demonstrated

## Component Definition
- **Core purpose**: Enhances the standard HTML textarea element with PrimeReact styling and an optional auto-resize feature for dynamic height adjustment based on content
- **Mental model**: A styled, controlled textarea component that can grow vertically as users type, eliminating scrollbars while maintaining readability
- **Semantic meaning**: Multi-line text input for longer-form content like comments, descriptions, messages, or any text that requires multiple lines

## Core Patterns

### Basic Implementation
```jsx
import { InputTextarea } from 'primereact/inputtextarea';

<InputTextarea
  rows={5}
  cols={30}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Auto-Resize Implementation
```jsx
<InputTextarea
  rows={5}
  cols={30}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  autoResize
/>
```

### Disabled State
```jsx
<InputTextarea
  rows={5}
  cols={30}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  disabled
/>
```

## Props & Configuration

### Component-Specific Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `autoResize` | boolean | false | When enabled, height of textarea dynamically adjusts as content is typed, growing vertically instead of showing scrollbars |
| `tooltip` | any | null | Content to display in tooltip when hovering over the textarea |
| `tooltipOptions` | object | null | Configuration object for tooltip behavior (position, delay, etc.) |

### Standard HTML Textarea Attributes

The component accepts all standard HTML textarea attributes, including:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rows` | number | N/A | Specifies the visible number of text rows |
| `cols` | number | N/A | Specifies the visible number of columns (character width) |
| `value` | string | N/A | Controlled input value (required for controlled component) |
| `onChange` | function | N/A | Event handler called when textarea value changes. Receives event object with `event.target.value` |
| `placeholder` | string | N/A | Placeholder text displayed when textarea is empty |
| `disabled` | boolean | false | When true, textarea is non-interactive and visually muted |
| `readOnly` | boolean | false | When true, content is visible but not editable |
| `required` | boolean | false | Marks the field as required for form validation |
| `maxLength` | number | N/A | Maximum number of characters allowed |
| `name` | string | N/A | Name attribute for form submission |
| `id` | string | N/A | Unique identifier for the textarea element |

### React Event Handlers

All standard React textarea event handlers are supported:

- `onFocus` - Triggered when textarea receives focus
- `onBlur` - Triggered when textarea loses focus
- `onKeyDown` - Triggered on key press
- `onKeyUp` - Triggered on key release
- `onInput` - Triggered on input (similar to onChange)
- `onPaste` - Triggered when content is pasted
- `onCut` - Triggered when content is cut
- `onCopy` - Triggered when content is copied

## Visual Patterns

### Input Styles

PrimeReact supports two primary input styling approaches:

1. **Outlined** (default) - Traditional bordered input style
2. **Filled** - Material Design-inspired filled background style

These are configured globally through the PrimeReact theme configuration, not per-component props.

### Size Variants

Size is controlled through:
- **rows** prop - Controls initial vertical height
- **cols** prop - Controls horizontal width
- **CSS classes** - Custom styling for specific dimensions
- **Component scale** - Global theme setting for overall sizing

### Theme Integration

The component integrates with PrimeReact's theming system:
- Multiple built-in themes (Bootstrap, Material Design, Tailwind, Lara, etc.)
- Customizable through PrimeReact Theme Designer
- Ripple effect support (configurable globally)
- Consistent styling across component library

## Behavioral Patterns

### Auto-Resize Behavior

**Key Feature:** When `autoResize={true}` is enabled:

1. **Initial State**: Textarea renders with height based on `rows` prop
2. **Dynamic Growth**: As user types and content exceeds visible area, textarea height increases automatically
3. **No Scrollbars**: Vertical scrollbar is eliminated in favor of expanding the container
4. **Content-Driven**: Height adjusts based on actual content, not fixed dimensions
5. **User Experience**: Provides better readability by always showing full content without scrolling

**Use Cases for Auto-Resize:**
- Comment sections where length varies greatly
- Feedback forms with unpredictable response lengths
- Description fields that should show all content
- Messages or notes where scrolling is undesirable

**When NOT to Use Auto-Resize:**
- Forms with strict layout requirements
- Designs where height must remain fixed
- Scenarios where very long text would break layout
- Performance-critical contexts with many textareas

### Controlled Component Pattern

InputTextarea follows React's controlled component pattern:

```jsx
const [value, setValue] = useState('');

<InputTextarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Controlled Component Benefits:**
- React state is the single source of truth
- Easy integration with form libraries
- Programmatic value manipulation
- Validation and transformation on change

### State Management

```jsx
// Basic state
const [text, setText] = useState('');

// With character limit feedback
const [text, setText] = useState('');
const maxChars = 500;
const remaining = maxChars - text.length;

<InputTextarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  maxLength={maxChars}
/>
<small>{remaining} characters remaining</small>
```

## Content Patterns

| Pattern | Present | Details |
|---------|---------|---------|
| Plain text | ✅ | Primary use case - standard text input |
| Formatted text | ❌ | No rich text editing - plain text only |
| Multi-line | ✅ | Core feature - supports unlimited lines |
| Placeholder | ✅ | Standard HTML placeholder attribute supported |
| Default value | ✅ | Can be set via initial state value |
| Character limit | ✅ | Via standard `maxLength` attribute |
| Line breaks | ✅ | Preserved in textarea content |

## Accessibility

**Current Status:** Documentation notes that accessibility section is "under development"

**Standard HTML Textarea Accessibility:**
The component inherits standard textarea accessibility features:
- Keyboard navigation (Tab to focus, arrow keys for cursor movement)
- Screen reader compatible (reads as textarea input)
- Form association via labels
- Required field indication
- Disabled state communication

**Best Practices for Implementation:**
```jsx
<label htmlFor="description">Description</label>
<InputTextarea
  id="description"
  aria-label="Product description"
  aria-describedby="desc-help"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  required
/>
<small id="desc-help">Enter a detailed product description</small>
```

**Accessibility Considerations:**
- Always provide associated `<label>` with `htmlFor` matching textarea `id`
- Use `aria-label` when visual label isn't present
- Use `aria-describedby` to link help text
- Use `aria-invalid` and `aria-errormessage` for validation feedback
- Ensure adequate color contrast in themes
- Test auto-resize with screen readers (height changes should not disrupt flow)

## Framework-Specific Features

### PrimeReact Integration

**Tooltip Support:**
```jsx
<InputTextarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  tooltip="Enter your comments here"
  tooltipOptions={{ position: 'top' }}
/>
```

**Theme Customization:**
- Global theme selection through PrimeReact configuration
- Input style variants (outlined/filled)
- Ripple effects
- Component scaling
- Custom theme creation via Theme Designer

**CSS Class System:**
```jsx
// Base class applied automatically
<textarea className="p-inputtextarea p-component p-filled" />

// Custom classes can be added
<InputTextarea
  className="my-custom-class"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### React-Specific Patterns

**Refs Support:**
```jsx
const textareaRef = useRef(null);

<InputTextarea
  ref={textareaRef}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Access native textarea methods
textareaRef.current.focus();
textareaRef.current.select();
```

**Form Integration:**
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  // Process form data
};

<form onSubmit={handleSubmit}>
  <InputTextarea
    name="comments"
    value={comments}
    onChange={(e) => setComments(e.target.value)}
    required
  />
  <button type="submit">Submit</button>
</form>
```

## Implementation Notes

### Import Methods

**Module Import (Recommended):**
```javascript
import { InputTextarea } from 'primereact/inputtextarea';
```

**CDN Import:**
```html
<script src="https://unpkg.com/primereact/core/core.min.js"></script>
<script src="https://unpkg.com/primereact/inputtextarea/inputtextarea.min.js"></script>
```

### CSS Classes Reference

**Primary Class:**
- `p-inputtextarea` - Base class applied to the textarea element

**State Classes:**
- `p-filled` - Applied when textarea has content
- `p-disabled` - Applied when disabled prop is true
- `p-focus` - Applied when textarea has focus (handled automatically)

**Styling Customization:**
```css
/* Custom styling example */
.p-inputtextarea {
  font-family: 'Your Font', sans-serif;
  border-radius: 8px;
}

.p-inputtextarea:focus {
  border-color: #your-brand-color;
  box-shadow: 0 0 0 0.2rem rgba(your-color, 0.25);
}
```

### Dependencies

**None required** - The component has no external dependencies beyond PrimeReact core.

### Performance Considerations

**Auto-Resize Performance:**
- Auto-resize recalculates height on every input event
- For forms with many auto-resize textareas, consider performance impact
- May cause layout reflows during typing
- Test with long content (1000+ characters) to ensure smooth experience

**Optimization Tips:**
- Use `autoResize` selectively, not on all textareas by default
- Consider debouncing for character count calculations
- Avoid complex onChange handlers that run on every keystroke
- Test on mobile devices where performance may be more constrained

## Notable Features

### 1. Auto-Resize Capability
The standout feature - textarea dynamically grows to show all content without scrollbars. This creates a superior user experience for variable-length text input.

### 2. Minimalist API
Simple prop structure with just `autoResize` and `tooltip` as framework-specific additions. All other functionality comes from standard HTML textarea attributes.

### 3. Full HTML Textarea Compatibility
Unlike some component libraries that create abstracted APIs, PrimeReact's InputTextarea accepts all standard textarea attributes, making migration and integration straightforward.

### 4. Controlled Component Pattern
Follows React best practices with controlled component pattern, making state management and form integration predictable and idiomatic.

### 5. Theme System Integration
Seamlessly integrates with PrimeReact's comprehensive theming system, allowing consistent styling across entire applications.

## Research Notes

### Documentation Access
Both URLs worked successfully:
- **primereact.org/inputtextarea/** - Modern documentation site with cleaner UX
- **primefaces.org/primereact-v8/inputtextarea/** - Version 8 specific documentation

The modern site appears to be the canonical source for current versions.

### Framework Approach Observations

**Props Philosophy:**
- Minimalist approach with only 2 custom props (`autoResize`, `tooltip`)
- Relies on standard HTML attributes for most configuration
- No size/variant props - controlled through CSS and theme
- Composition over configuration pattern

**React Patterns:**
- Standard controlled component implementation
- Accepts all native textarea props and handlers
- No wrapper components or additional abstractions
- Direct mapping to native textarea element

**Design System Integration:**
- Uses PrimeReact class naming convention (`p-*`)
- Global theme configuration rather than per-component styling
- Consistent with other PrimeReact form components
- Theme Designer tool for customization

### Comparison Points

**Strengths:**
- Extremely simple API (only 2 custom props)
- Auto-resize feature is clean and performant
- Full compatibility with standard textarea features
- Excellent theme customization options
- No external dependencies
- Lightweight implementation

**Limitations:**
- No built-in character counter component
- No built-in validation feedback UI
- No size variants (small/medium/large props)
- Accessibility documentation incomplete
- No mention of form integration patterns
- Limited advanced examples (no form libraries integration)

**Unique Features:**
- Auto-resize implementation is particularly smooth
- Tooltip integration built-in
- Theme Designer for visual customization
- CDN option for quick prototyping

### Implementation Insights

**Component Architecture:**
The component is essentially a thin wrapper around native textarea that:
1. Applies PrimeReact CSS classes for consistent theming
2. Implements auto-resize through height calculation on input
3. Integrates tooltip functionality from PrimeReact core
4. Passes through all other props to native textarea element

**Auto-Resize Implementation:**
- Likely uses `scrollHeight` measurement to determine content height
- Adjusts textarea `style.height` dynamically
- Runs on input events to maintain responsiveness
- Starts with initial height based on `rows` prop

**State Management:**
- Completely controlled by parent component via `value` and `onChange`
- No internal state management
- Makes component predictable and easy to integrate

### Usage Recommendations

**Use InputTextarea when:**
- Multi-line text input is required
- Content length varies significantly (especially with autoResize)
- Integration with PrimeReact design system is desired
- Simple, straightforward textarea with good styling is needed

**Consider alternatives when:**
- Rich text editing is required (use dedicated rich text editor)
- Complex validation UI is needed built-in
- Extensive form-building features are required
- Non-React framework is being used

### Integration Examples

**With React Hook Form:**
```jsx
import { useForm, Controller } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';

const { control, handleSubmit } = useForm();

<Controller
  name="description"
  control={control}
  rules={{ required: 'Description is required', maxLength: 500 }}
  render={({ field, fieldState }) => (
    <>
      <InputTextarea
        {...field}
        autoResize
        rows={5}
        className={fieldState.error ? 'p-invalid' : ''}
      />
      {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
    </>
  )}
/>
```

**With Formik:**
```jsx
import { useFormik } from 'formik';
import { InputTextarea } from 'primereact/inputtextarea';

const formik = useFormik({
  initialValues: { comments: '' },
  onSubmit: values => console.log(values)
});

<InputTextarea
  name="comments"
  value={formik.values.comments}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  autoResize
/>
```

**Character Counter Pattern:**
```jsx
const [text, setText] = useState('');
const MAX_LENGTH = 500;

<div className="field">
  <label htmlFor="feedback">Feedback</label>
  <InputTextarea
    id="feedback"
    value={text}
    onChange={(e) => setText(e.target.value)}
    maxLength={MAX_LENGTH}
    rows={5}
    autoResize
  />
  <small className="p-d-block p-text-right">
    {text.length} / {MAX_LENGTH} characters
  </small>
</div>
```

**Validation Pattern:**
```jsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

const handleBlur = () => {
  if (value.length < 10) {
    setError('Minimum 10 characters required');
  } else {
    setError('');
  }
};

<div className="field">
  <InputTextarea
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={handleBlur}
    className={error ? 'p-invalid' : ''}
    rows={5}
  />
  {error && <small className="p-error">{error}</small>}
</div>
```
