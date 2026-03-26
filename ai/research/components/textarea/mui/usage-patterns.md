# MUI (Material-UI) - TextField Multiline/Textarea Usage Patterns

## Component URL
https://mui.com/material-ui/react-text-field/#multiline
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/text-field/
TextareaAutosize Reference: https://mui.com/material-ui/react-textarea-autosize/
Version: Current (v5+)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, code examples, and practical guidance for multiline TextField usage. Documentation includes details about the underlying TextareaAutosize component and Material Design specifications.

---

## 1. Component Overview

The MUI TextField component with `multiline` prop transforms into a Material Design-compliant textarea that automatically resizes based on content. It utilizes the MUI Base TextareaAutosize element internally, providing dynamic height adjustment while maintaining all the benefits of TextField including label management, validation states, helper text, and adornments. The multiline TextField follows Material Design 3 specifications for text input areas and integrates seamlessly with MUI's theming system.

### Key Characteristics
- **Auto-Sizing Textarea**: Dynamically adjusts height to match content length
- **Underlying Component**: Uses MUI Base TextareaAutosize internally when multiline is true
- **Full TextField Features**: Retains all TextField capabilities (labels, validation, adornments, etc.)
- **Height Control**: Configurable via rows, minRows, and maxRows props
- **Material Design Compliance**: Follows Material Design 3 specifications for text areas
- **All Variants Supported**: Works with outlined, filled, and standard variants
- **Overflow Handling**: Applies overflow: hidden by default for auto-sizing behavior
- **Responsive Resizing**: Automatically adjusts on keyboard input and window resize events

---

## 2. Basic Usage

### Import
```jsx
import TextField from '@mui/material/TextField';
// or
import { TextField } from '@mui/material';
```

### Simple Multiline TextField
```jsx
<TextField
  label="Comments"
  multiline
/>
```

### Multiline with Fixed Rows
```jsx
<TextField
  label="Description"
  multiline
  rows={4}
/>
```

### Auto-Growing Textarea (Recommended)
```jsx
<TextField
  label="Message"
  multiline
  minRows={3}
  maxRows={10}
/>
```

### Full Example with State
```jsx
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

function MultilineExample() {
  const [value, setValue] = useState('');

  return (
    <TextField
      label="Your Message"
      multiline
      minRows={4}
      maxRows={10}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
      placeholder="Enter your message here..."
    />
  );
}
```

---

## 3. Props & Configuration

### Multiline-Specific Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiline` | `boolean` | `false` | If `true`, transforms TextField into a textarea using TextareaAutosize |
| `rows` | `number \| string` | `1` | Number of rows to display when multiline. Sets fixed height |
| `minRows` | `number \| string` | - | Minimum number of rows to display (enables auto-sizing) |
| `maxRows` | `number \| string` | - | Maximum number of rows to display (bounds auto-sizing) |

### Behavior Notes
- **When `rows` is set**: Height is fixed at the specified number of rows
- **When `minRows`/`maxRows` are set**: Height automatically grows between bounds
- **When neither is set**: TextField auto-expands infinitely to match content
- **Setting all three**: `rows` takes precedence over `minRows`/`maxRows`
- **User input limitation**: `maxRows` only limits visible rows, not the total text length

### All TextField Props Still Available

The multiline TextField supports all standard TextField props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| ReactNode` | - | The label text displayed above the textarea |
| `placeholder` | `string` | - | Placeholder text shown when empty |
| `value` | `string` | - | Controlled component value |
| `defaultValue` | `string` | - | Uncontrolled component default value |
| `onChange` | `function` | - | Callback fired when value changes |
| `error` | `boolean` | `false` | If `true`, displays error state |
| `helperText` | `string \| ReactNode` | - | Helper text below the textarea |
| `disabled` | `boolean` | `false` | If `true`, disables the textarea |
| `required` | `boolean` | `false` | If `true`, marks field as required |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | Visual variant of the text field |
| `size` | `'small' \| 'medium'` | `'medium'` | Size of the text field |
| `fullWidth` | `boolean` | `false` | If `true`, textarea takes full width of container |
| `autoFocus` | `boolean` | `false` | If `true`, focuses textarea on mount |
| `inputProps` | `object` | - | Attributes applied to the textarea element |
| `InputProps` | `object` | - | Props applied to the Input component |
| `InputLabelProps` | `object` | - | Props applied to the InputLabel component |
| `FormHelperTextProps` | `object` | - | Props applied to the FormHelperText component |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' \| 'warning'` | `'primary'` | The color of the field |
| `margin` | `'none' \| 'dense' \| 'normal'` | `'none'` | Vertical margin of the field |
| `sx` | `object \| function` | - | System prop for custom styling |

---

## 4. Visual Patterns

### Variants with Multiline

All three TextField variants support multiline:

#### Outlined Variant (Recommended, Default)
```jsx
<TextField
  label="Outlined Multiline"
  multiline
  rows={4}
  variant="outlined"
/>
```

**Characteristics**:
- Border around the entire textarea
- Label floats above on focus/fill
- Most visually distinct
- Best for standard forms
- Recommended by Material Design 3

#### Filled Variant
```jsx
<TextField
  label="Filled Multiline"
  multiline
  rows={4}
  variant="filled"
/>
```

**Characteristics**:
- Background color fill
- Border only at bottom
- Works well in dense layouts
- Slightly less visual weight than outlined

#### Standard Variant (Legacy)
```jsx
<TextField
  label="Standard Multiline"
  multiline
  rows={4}
  variant="standard"
/>
```

**Characteristics**:
- Border only at bottom
- Minimal visual footprint
- Legacy Material Design v1 style
- Use sparingly in new designs

### Variant Comparison
```jsx
import { Box, TextField } from '@mui/material';

function VariantComparison() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Outlined"
        multiline
        rows={3}
        variant="outlined"
      />
      <TextField
        label="Filled"
        multiline
        rows={3}
        variant="filled"
      />
      <TextField
        label="Standard"
        multiline
        rows={3}
        variant="standard"
      />
    </Box>
  );
}
```

---

## 5. Size Variants

### Medium Size (Default)
```jsx
<TextField
  label="Medium Size"
  multiline
  rows={4}
  size="medium"
/>
```

### Small Size
```jsx
<TextField
  label="Small Size"
  multiline
  rows={4}
  size="small"
/>
```

**Use Cases for Small**:
- Compact layouts
- Dense forms
- Inline comments
- Side panels
- Modal dialogs with limited space

### Size Comparison
```jsx
<Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
  <TextField
    label="Small Multiline"
    multiline
    rows={3}
    size="small"
    fullWidth
  />
  <TextField
    label="Medium Multiline"
    multiline
    rows={3}
    size="medium"
    fullWidth
  />
</Box>
```

---

## 6. Behavioral Patterns

### Auto-Growing Textarea (Dynamic Height)

The primary behavioral pattern for multiline TextField is automatic height adjustment based on content.

#### Unbounded Auto-Growth
```jsx
<TextField
  label="Unbounded Growth"
  multiline
  minRows={2}
  placeholder="This will grow as you type..."
/>
```

**Behavior**: Starts at `minRows` height and grows infinitely as content increases.

#### Bounded Auto-Growth (Recommended)
```jsx
<TextField
  label="Bounded Growth"
  multiline
  minRows={3}
  maxRows={10}
  placeholder="Grows from 3 to 10 rows..."
/>
```

**Behavior**: Starts at `minRows`, grows to `maxRows`, then scrolls internally.

**Best Practice**: Always set both `minRows` and `maxRows` for predictable UX.

#### Fixed Height
```jsx
<TextField
  label="Fixed Height"
  multiline
  rows={6}
  placeholder="Always shows exactly 6 rows"
/>
```

**Behavior**: Height remains constant at `rows` value. Content scrolls internally when exceeding height.

### Height Behavior Matrix

| Configuration | Initial Height | Growth Behavior | Scroll Behavior |
|--------------|----------------|-----------------|-----------------|
| `multiline` only | 1 row | Grows infinitely | Never scrolls |
| `rows={4}` | 4 rows | No growth | Scrolls when content exceeds 4 rows |
| `minRows={2}` | 2 rows | Grows infinitely | Never scrolls |
| `minRows={2} maxRows={6}` | 2 rows | Grows from 2 to 6 | Scrolls when content exceeds 6 rows |
| `rows={4} minRows={2} maxRows={6}` | 4 rows | No growth | Scrolls when content exceeds 4 rows |

### Resize Events

The TextareaAutosize component automatically adjusts height on:
1. **Keyboard input**: Every keystroke recalculates height
2. **Window resize**: Viewport changes trigger height recalculation
3. **Content changes**: Programmatic value updates adjust height
4. **Font size changes**: Theme or style updates recalculate height

### Full Example with Character Count
```jsx
function AutoGrowingWithCount() {
  const [value, setValue] = useState('');
  const maxLength = 500;

  return (
    <TextField
      label="Your Review"
      multiline
      minRows={4}
      maxRows={12}
      value={value}
      onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
      fullWidth
      inputProps={{ maxLength }}
      helperText={`${value.length}/${maxLength} characters`}
      placeholder="Share your thoughts..."
    />
  );
}
```

---

## 7. Content Patterns

### Label Patterns

#### Standard Label (Recommended)
```jsx
<TextField
  label="Description"
  multiline
  rows={4}
/>
```

#### Label with Placeholder
```jsx
<TextField
  label="Comments"
  placeholder="Enter your comments here..."
  multiline
  rows={4}
/>
```

#### Required Field
```jsx
<TextField
  label="Feedback"
  required
  multiline
  rows={4}
/>
```

#### Persistent Label (Always Floated)
```jsx
<TextField
  label="Notes"
  multiline
  rows={4}
  InputLabelProps={{
    shrink: true,
  }}
/>
```

### Placeholder Best Practices

```jsx
// ✅ Good: Label describes field, placeholder provides example
<TextField
  label="Address"
  placeholder="123 Main St, Apt 4B, New York, NY 10001"
  multiline
  rows={3}
/>

// ✅ Good: Placeholder for format hint
<TextField
  label="Code Snippet"
  placeholder="Enter code here... (supports markdown)"
  multiline
  minRows={5}
  maxRows={15}
/>

// ❌ Avoid: Placeholder instead of label (accessibility issue)
<TextField
  placeholder="Enter your bio"
  multiline
  rows={4}
/>
```

### Helper Text Patterns

#### Static Helper Text
```jsx
<TextField
  label="Bio"
  multiline
  rows={4}
  helperText="Tell us about yourself"
/>
```

#### Dynamic Character Count
```jsx
function CharCountField() {
  const [value, setValue] = useState('');
  const maxLength = 250;

  return (
    <TextField
      label="Summary"
      multiline
      minRows={3}
      maxRows={6}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      inputProps={{ maxLength }}
      helperText={`${value.length}/${maxLength}`}
    />
  );
}
```

#### Validation Message
```jsx
function ValidatedTextarea() {
  const [value, setValue] = useState('');
  const minLength = 50;
  const error = value.length > 0 && value.length < minLength;

  return (
    <TextField
      label="Detailed Feedback"
      multiline
      minRows={4}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={error}
      helperText={
        error
          ? `Please write at least ${minLength} characters (${value.length}/${minLength})`
          : `${value.length} characters`
      }
    />
  );
}
```

---

## 8. Accessibility

### Built-in Accessibility Features

The multiline TextField inherits all TextField accessibility features:

#### Automatic ARIA Attributes
```jsx
// MUI automatically applies proper ARIA attributes
<TextField
  label="Comments"
  multiline
  rows={4}
  helperText="Optional feedback"
/>
```

Renders with:
```html
<textarea
  id="outlined-multiline-static"
  aria-describedby="outlined-multiline-static-helper-text"
  rows="4"
>
</textarea>
<p id="outlined-multiline-static-helper-text">
  Optional feedback
</p>
```

#### Required Field Accessibility
```jsx
<TextField
  label="Required Feedback"
  multiline
  rows={4}
  required
  inputProps={{
    'aria-required': 'true',
  }}
/>
```

#### Error State with Accessibility
```jsx
<TextField
  label="Message"
  multiline
  rows={4}
  error={hasError}
  helperText="This field is required"
  FormHelperTextProps={{
    role: 'alert',
    id: 'message-error',
  }}
  inputProps={{
    'aria-invalid': hasError,
    'aria-describedby': 'message-error',
  }}
/>
```

### Custom ARIA Labels

For textareas without visible labels:

```jsx
// Use inputProps to add aria-label
<TextField
  multiline
  rows={4}
  inputProps={{
    'aria-label': 'Additional comments',
  }}
/>
```

### Accessibility Known Issue

**Important**: MUI TextField with `multiline` renders a second hidden textarea element with `aria-hidden="true"` that lacks an associated label. This is used internally for height calculations but can flag accessibility warnings in automated testing tools. This is a known issue tracked in the MUI repository (Issue #35580) and generally doesn't impact actual screen reader experience since the element is properly hidden.

### Keyboard Navigation

Multiline TextField supports full keyboard navigation:

| Key | Action |
|-----|--------|
| **Tab** | Focus the textarea |
| **Shift+Tab** | Move to previous focusable element |
| **Enter** | Insert newline (does NOT submit form) |
| **Ctrl/Cmd+Enter** | Custom handler for submit (must be implemented) |
| **Escape** | Custom handler for cancel (must be implemented) |
| **Standard editing keys** | Cut, copy, paste, undo, redo work normally |

### Best Practices

```jsx
// ✅ Good: Always provide a label
<TextField
  label="Your Comments"
  multiline
  rows={4}
/>

// ✅ Good: Use helperText for validation feedback
<TextField
  label="Feedback"
  multiline
  rows={4}
  error={hasError}
  helperText={hasError ? "Please provide feedback" : ""}
/>

// ✅ Good: Mark required fields properly
<TextField
  label="Required Field"
  multiline
  rows={4}
  required
  inputProps={{ 'aria-required': true }}
/>

// ❌ Avoid: No label and no aria-label
<TextField
  multiline
  rows={4}
  placeholder="Comments"
/>

// ❌ Avoid: Using title instead of label
<TextField
  multiline
  rows={4}
  title="Comments"
/>
```

---

## 9. Framework-Specific Features

### Material Design Specifications

MUI's multiline TextField follows Material Design 3 specifications:

#### Spacing and Sizing
- **Default padding**: 16.5px vertical, 14px horizontal (outlined variant)
- **Small padding**: 8.5px vertical, 14px horizontal (outlined variant)
- **Line height**: 1.4375em (23px at 16px base font)
- **Label spacing**: 8px from top of field
- **Helper text spacing**: 4px below field

#### Typography
- **Input text**: Body1 (16px, 400 weight)
- **Label text**: Body1 (16px) when filled, Body2 (12px) when floated
- **Helper text**: Caption (12px, 400 weight)
- **Placeholder text**: Body1 (16px, 400 weight, reduced opacity)

#### Color System
- **Default border**: rgba(0, 0, 0, 0.23) in light mode
- **Hover border**: rgba(0, 0, 0, 0.87) in light mode
- **Focused border**: Primary theme color (default #1976d2)
- **Error border**: Error theme color (default #d32f2f)
- **Disabled**: Reduced opacity (0.38)

### TextareaAutosize Component

Multiline TextField uses the MUI Base TextareaAutosize component internally:

#### Implementation Detail
```jsx
// When you use:
<TextField multiline rows={4} />

// MUI internally renders:
<TextareaAutosize
  minRows={4}
  maxRows={4}
  style={{ overflow: 'hidden' }}
  // ... other props
/>
```

#### Direct TextareaAutosize Usage

For advanced use cases, you can use TextareaAutosize directly:

```jsx
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    font-family: ${theme.typography.fontFamily};
    font-size: 1rem;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d0d7de'};
  `,
);

<StyledTextarea minRows={3} maxRows={10} placeholder="Custom textarea" />
```

### InputBase Component

For complete customization, use InputBase directly:

```jsx
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

const CustomTextarea = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

<CustomTextarea
  multiline
  minRows={4}
  maxRows={8}
  placeholder="Custom styled textarea"
/>
```

### Overflow Behavior

**Important Implementation Detail**: MUI applies `overflow: hidden` as an inline style to the textarea element to enable proper auto-sizing. This prevents scrollbars from appearing during height calculations.

To enable custom overflow behavior:

```jsx
<TextField
  multiline
  rows={5}
  inputProps={{
    style: { overflow: 'auto' }, // Override default
  }}
/>
```

---

## 10. Styling & Theming

### Custom Styling with sx Prop

#### Border Radius Customization
```jsx
<TextField
  label="Rounded Corners"
  multiline
  rows={4}
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: 3, // 24px
    },
  }}
/>
```

#### Custom Colors
```jsx
<TextField
  label="Custom Colors"
  multiline
  rows={4}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'purple',
      },
      '&:hover fieldset': {
        borderColor: 'darkpurple',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'blue',
      },
    },
  }}
/>
```

#### Background Color
```jsx
<TextField
  label="Colored Background"
  multiline
  minRows={4}
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
    },
  }}
/>
```

#### Font Customization
```jsx
<TextField
  label="Custom Font"
  multiline
  rows={4}
  sx={{
    '& .MuiInputBase-input': {
      fontFamily: 'monospace',
      fontSize: '14px',
      lineHeight: 1.6,
    },
  }}
/>
```

### Styled Component Approach

```jsx
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomTextarea = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderWidth: 2,
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    fontSize: '16px',
    lineHeight: 1.5,
  },
}));

// Usage
<CustomTextarea
  label="Styled Textarea"
  multiline
  minRows={4}
  maxRows={10}
/>
```

### Global Theme Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.MuiInputBase-multiline': {
              padding: 0, // Remove default padding for multiline
            },
          },
          '& .MuiInputBase-inputMultiline': {
            padding: '16px 14px', // Custom textarea padding
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        label="Themed Textarea"
        multiline
        rows={4}
      />
    </ThemeProvider>
  );
}
```

### CSS Classes for Multiline

Key CSS classes for targeting multiline-specific styles:

| Class | Target |
|-------|--------|
| `.MuiInputBase-multiline` | The root Input component when multiline |
| `.MuiInputBase-inputMultiline` | The textarea element itself |
| `.MuiOutlinedInput-multiline` | Outlined variant root when multiline |
| `.MuiFilledInput-multiline` | Filled variant root when multiline |

Example:
```jsx
<TextField
  label="Custom Classes"
  multiline
  rows={4}
  sx={{
    '& .MuiInputBase-inputMultiline': {
      lineHeight: 2,
      color: 'text.secondary',
    },
  }}
/>
```

---

## 11. Common Use Cases

### Comment Input
```jsx
function CommentInput() {
  const [comment, setComment] = useState('');

  return (
    <TextField
      label="Add a comment"
      placeholder="Share your thoughts..."
      multiline
      minRows={2}
      maxRows={6}
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      fullWidth
      helperText={`${comment.length} characters`}
    />
  );
}
```

### Feedback Form
```jsx
function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(false);
  const minLength = 50;

  const handleSubmit = () => {
    if (feedback.length < minLength) {
      setError(true);
      return;
    }
    // Submit feedback
  };

  return (
    <Box>
      <TextField
        label="Your Feedback"
        multiline
        minRows={5}
        maxRows={15}
        value={feedback}
        onChange={(e) => {
          setFeedback(e.target.value);
          setError(false);
        }}
        error={error}
        helperText={
          error
            ? `Please provide at least ${minLength} characters`
            : `${feedback.length} characters`
        }
        fullWidth
        required
        placeholder="Tell us what you think..."
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Submit Feedback
      </Button>
    </Box>
  );
}
```

### Code Editor Input
```jsx
function CodeInput() {
  const [code, setCode] = useState('');

  return (
    <TextField
      label="Code Snippet"
      multiline
      minRows={10}
      maxRows={30}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      fullWidth
      placeholder="Paste your code here..."
      inputProps={{
        style: {
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: 1.6,
          tabSize: 2,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#f5f5f5',
        },
      }}
    />
  );
}
```

### Notes/Description Field
```jsx
function NotesField() {
  const [notes, setNotes] = useState('');
  const maxLength = 1000;

  return (
    <TextField
      label="Additional Notes"
      multiline
      minRows={4}
      maxRows={8}
      value={notes}
      onChange={(e) => setNotes(e.target.value.slice(0, maxLength))}
      inputProps={{ maxLength }}
      helperText={`${notes.length}/${maxLength}`}
      fullWidth
      placeholder="Add any additional information..."
    />
  );
}
```

### Message Composer
```jsx
function MessageComposer() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    // Send message
    await sendMessage(message);
    setMessage('');
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  return (
    <Box>
      <TextField
        label="Message"
        multiline
        minRows={3}
        maxRows={10}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        disabled={sending}
        placeholder="Type your message... (Ctrl+Enter to send)"
        helperText="Press Ctrl+Enter to send"
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </Box>
    </Box>
  );
}
```

### Address Input
```jsx
function AddressInput() {
  const [address, setAddress] = useState('');

  return (
    <TextField
      label="Shipping Address"
      multiline
      rows={3}
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      fullWidth
      required
      placeholder="Street address&#10;City, State ZIP&#10;Country"
      helperText="Enter your complete shipping address"
    />
  );
}
```

### Bio/About Section
```jsx
function BioField() {
  const [bio, setBio] = useState('');
  const maxLength = 500;
  const remaining = maxLength - bio.length;

  return (
    <TextField
      label="About You"
      multiline
      minRows={4}
      maxRows={8}
      value={bio}
      onChange={(e) => setBio(e.target.value.slice(0, maxLength))}
      fullWidth
      inputProps={{ maxLength }}
      helperText={`${remaining} characters remaining`}
      placeholder="Tell us about yourself..."
    />
  );
}
```

---

## 12. Integration Patterns

### Form Integration
```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={formData.name}
        onChange={handleChange('name')}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Message"
        multiline
        minRows={5}
        maxRows={12}
        value={formData.message}
        onChange={handleChange('message')}
        fullWidth
        margin="normal"
        required
        placeholder="Enter your message here..."
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Send Message
      </Button>
    </form>
  );
}
```

### React Hook Form Integration
```jsx
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';

function FormWithValidation() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="description"
        control={control}
        rules={{
          required: 'Description is required',
          minLength: {
            value: 50,
            message: 'Description must be at least 50 characters',
          },
          maxLength: {
            value: 500,
            message: 'Description must not exceed 500 characters',
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Description"
            multiline
            minRows={5}
            maxRows={15}
            error={!!error}
            helperText={error?.message || `${field.value.length}/500`}
            fullWidth
            placeholder="Provide a detailed description..."
          />
        )}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </form>
  );
}
```

### Formik Integration
```jsx
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';

const validationSchema = yup.object({
  feedback: yup
    .string()
    .min(20, 'Feedback should be at least 20 characters')
    .max(1000, 'Feedback should not exceed 1000 characters')
    .required('Feedback is required'),
});

function FormikForm() {
  const formik = useFormik({
    initialValues: {
      feedback: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        name="feedback"
        label="Your Feedback"
        multiline
        minRows={4}
        maxRows={10}
        value={formik.values.feedback}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.feedback && Boolean(formik.errors.feedback)}
        helperText={
          formik.touched.feedback && formik.errors.feedback
            ? formik.errors.feedback
            : `${formik.values.feedback.length}/1000`
        }
        fullWidth
        placeholder="Share your feedback with us..."
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Submit Feedback
      </Button>
    </form>
  );
}
```

---

## 13. Advanced Patterns

### Character Counter with Progress
```jsx
import { LinearProgress, Box, Typography } from '@mui/material';

function TextareaWithProgress() {
  const [value, setValue] = useState('');
  const minLength = 50;
  const maxLength = 500;
  const progress = Math.min((value.length / minLength) * 100, 100);

  return (
    <Box>
      <TextField
        label="Review"
        multiline
        minRows={4}
        maxRows={10}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
        fullWidth
        inputProps={{ maxLength }}
        helperText={`${value.length}/${maxLength} characters (minimum ${minLength})`}
      />
      {value.length < minLength && value.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress === 100 ? 'success' : 'primary'}
          />
          <Typography variant="caption" color="text.secondary">
            {minLength - value.length} more characters needed
          </Typography>
        </Box>
      )}
    </Box>
  );
}
```

### Auto-Save Textarea
```jsx
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

function AutoSaveTextarea() {
  const [value, setValue] = useState('');
  const [savedValue, setSavedValue] = useState('');
  const [saving, setSaving] = useState(false);

  const saveToServer = async (text) => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedValue(text);
    setSaving(false);
  };

  const debouncedSave = useCallback(
    debounce((text) => saveToServer(text), 2000),
    []
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSave(newValue);
  };

  const isSaved = value === savedValue && !saving;

  return (
    <TextField
      label="Notes"
      multiline
      minRows={6}
      maxRows={15}
      value={value}
      onChange={handleChange}
      fullWidth
      helperText={
        saving
          ? 'Saving...'
          : isSaved
          ? 'All changes saved'
          : 'Changes will be saved automatically'
      }
      InputProps={{
        endAdornment: saving ? (
          <CircularProgress size={20} sx={{ position: 'absolute', right: 14, top: 14 }} />
        ) : null,
      }}
    />
  );
}
```

### Markdown Preview
```jsx
import { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function MarkdownEditor() {
  const [value, setValue] = useState('');
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Write" />
        <Tab label="Preview" />
      </Tabs>
      {tab === 0 ? (
        <TextField
          multiline
          minRows={10}
          maxRows={25}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          placeholder="Write markdown here..."
          inputProps={{
            style: {
              fontFamily: 'monospace',
            },
          }}
        />
      ) : (
        <Paper sx={{ p: 2, minHeight: 200 }}>
          <ReactMarkdown>{value || '*No content to preview*'}</ReactMarkdown>
        </Paper>
      )}
    </Box>
  );
}
```

### Textarea with Mentions/Autocomplete
```jsx
import { useState } from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';

function TextareaWithMentions() {
  const [value, setValue] = useState('');
  const [mentions, setMentions] = useState([]);
  const users = ['Alice', 'Bob', 'Charlie', 'David'];

  return (
    <Box>
      <Autocomplete
        multiple
        options={users}
        value={mentions}
        onChange={(e, newValue) => setMentions(newValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={`@${option}`} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Mention people" placeholder="Type to search..." />
        )}
      />
      <TextField
        label="Message"
        multiline
        minRows={4}
        maxRows={10}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        placeholder={
          mentions.length > 0
            ? `Mentioning: ${mentions.map((m) => '@' + m).join(', ')}`
            : 'Type your message...'
        }
      />
    </Box>
  );
}
```

### Resizable with Custom Handle
```jsx
import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

function ResizableTextarea() {
  const [rows, setRows] = useState(4);

  const handleResize = (direction) => {
    setRows((prev) => Math.max(2, Math.min(20, prev + direction)));
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        label="Resizable Textarea"
        multiline
        rows={rows}
        fullWidth
        placeholder="Use the handle below to resize..."
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 1,
          gap: 1,
        }}
      >
        <IconButton size="small" onClick={() => handleResize(-1)}>
          -
        </IconButton>
        <DragIndicatorIcon color="action" />
        <IconButton size="small" onClick={() => handleResize(1)}>
          +
        </IconButton>
      </Box>
    </Box>
  );
}
```

---

## 14. Implementation Notes

### TextareaAutosize Technical Details

**Component Architecture**:
```
TextField (multiline=true)
  └─> Input[Outlined/Filled/Standard]
      └─> InputBase
          └─> TextareaAutosize (MUI Base)
              └─> <textarea> (DOM element)
```

**Height Calculation Method**:
1. Renders a hidden clone textarea with same content and styling
2. Measures the scrollHeight of the clone
3. Applies the measured height to the visible textarea
4. Repeats on content change, window resize, or font change

**Overflow Handling**:
- MUI applies `overflow: hidden` as inline style by default
- This prevents scrollbars during auto-sizing calculations
- When content exceeds `maxRows`, overflow automatically changes to `auto`
- Can be overridden via `inputProps.style.overflow`

### Performance Considerations

**Optimization Tips**:
1. **Use minRows/maxRows**: Prevents unbounded growth and excessive recalculations
2. **Debounce onChange**: For expensive operations triggered by input
3. **Avoid excessive re-renders**: Memoize parent components if necessary
4. **Fixed rows for large content**: Use `rows` prop instead of auto-sizing for very long content

**Example with Debounced Handler**:
```jsx
import { useMemo } from 'react';
import { debounce } from 'lodash';

function OptimizedTextarea() {
  const [value, setValue] = useState('');

  const debouncedUpdate = useMemo(
    () =>
      debounce((newValue) => {
        // Expensive operation (API call, etc.)
        console.log('Updated:', newValue);
      }, 500),
    []
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  return (
    <TextField
      multiline
      minRows={4}
      maxRows={12}
      value={value}
      onChange={handleChange}
      fullWidth
    />
  );
}
```

### Browser Compatibility

**Full Support**: All modern browsers
- Chrome/Edge: Excellent
- Firefox: Excellent
- Safari: Excellent
- Mobile browsers: Excellent

**Known Issues**:
- **Safari iOS**: Slight delay in height adjustment on fast typing (minor visual issue)
- **Firefox**: Scrollbar may briefly appear during resize (cosmetic only)
- **All browsers**: Horizontal scroll not supported by default (Material Design spec)

### Mobile Considerations

**Touch Optimization**:
- Textarea expands to accommodate mobile keyboard
- Auto-focus can be problematic on mobile (causes unwanted keyboard popup)
- Consider larger tap targets and font sizes for mobile

**Mobile Best Practices**:
```jsx
// Avoid autoFocus on mobile
<TextField
  multiline
  minRows={3}
  autoFocus={false} // Don't auto-focus on mobile
  inputProps={{
    style: {
      fontSize: '16px', // Prevents zoom on iOS
    },
  }}
/>
```

### Common Pitfalls

#### 1. Mixing rows with minRows/maxRows
```jsx
// ❌ Don't: rows takes precedence, minRows/maxRows ignored
<TextField multiline rows={4} minRows={2} maxRows={8} />

// ✅ Do: Use either rows OR minRows/maxRows
<TextField multiline rows={4} /> // Fixed height
<TextField multiline minRows={2} maxRows={8} /> // Auto-sizing
```

#### 2. Forgetting to handle Enter key
```jsx
// ❌ Problem: Enter submits form instead of adding newline
<form onSubmit={handleSubmit}>
  <TextField multiline />
  <button type="submit">Submit</button>
</form>

// ✅ Solution: Prevent form submission on Enter
<TextField
  multiline
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.stopPropagation(); // Prevent form submission
    }
  }}
/>
```

#### 3. Accessibility - Missing labels
```jsx
// ❌ Bad: No label
<TextField multiline placeholder="Comments" />

// ✅ Good: Proper label
<TextField multiline label="Comments" />

// ✅ Acceptable: aria-label when no visible label
<TextField
  multiline
  inputProps={{ 'aria-label': 'Comments' }}
/>
```

#### 4. Not limiting height in modals
```jsx
// ❌ Problem: Textarea grows beyond modal height
<Dialog>
  <TextField multiline minRows={5} /> {/* Can grow infinitely */}
</Dialog>

// ✅ Solution: Set maxRows
<Dialog>
  <TextField multiline minRows={5} maxRows={10} />
</Dialog>
```

---

## 15. Notable Features

### 1. Automatic Height Adjustment
The TextareaAutosize component provides seamless auto-growing behavior that:
- Calculates height based on content
- Responds to keyboard input instantly
- Adjusts on window resize events
- Handles font size changes dynamically

### 2. Full TextField API Support
Unlike some component libraries that have separate textarea components, MUI's multiline TextField retains ALL TextField features:
- Label management and animation
- Helper text and validation
- Error states
- All three visual variants (outlined, filled, standard)
- Input adornments (though less common with multiline)
- Full theme integration

### 3. Material Design Compliance
Strict adherence to Material Design 3 specifications:
- Proper spacing and padding
- Consistent typography scale
- Animated label behavior
- Focus and error state styling
- Color system integration

### 4. Bounded Auto-Growth
The `minRows`/`maxRows` pattern provides predictable UX:
- Starts at comfortable reading height
- Grows with content up to maximum
- Scrolls internally when exceeding maximum
- Prevents layout shift issues

### 5. Performance Optimized
- Efficient height recalculation algorithm
- Minimal DOM manipulations
- Debounced resize handlers
- No layout thrashing

### 6. Composition Architecture
Built on composable primitives:
- Can drop down to InputBase for custom implementations
- Can use TextareaAutosize directly for non-Material designs
- Maintains consistent API across all levels

### 7. Theme Integration
Deep theme integration enables:
- Global multiline styling via theme overrides
- CSS variable support for dynamic theming
- Consistent styling across application
- Light/dark mode support out of the box

### 8. TypeScript Support
Full TypeScript definitions:
- Proper prop type inference
- Generic component typing
- Ref forwarding support
- Event handler types

### 9. No Horizontal Scroll (By Design)
Follows Material Design specification:
- Only vertical growth/scroll
- Horizontal content wraps automatically
- Cannot be changed without custom implementation
- Ensures consistent reading experience

### 10. Accessibility First
- Proper ARIA attributes automatically applied
- Label association handled correctly
- Error announcements via helper text
- Keyboard navigation fully supported
- Screen reader friendly

---

## 16. Research Notes

### Framework Approach
MUI takes a **unified component** approach where:
- Single TextField component handles both single-line and multiline
- `multiline` prop transforms the underlying implementation
- All TextField features remain available in multiline mode
- Consistent API regardless of input type

### Comparison to Other Implementations

**Strengths vs Other Libraries**:
1. **Unified API**: Single component for all text input types
2. **Auto-sizing built-in**: No separate component needed
3. **Full feature parity**: Multiline gets all TextField features
4. **Material Design compliance**: Strict adherence to design system
5. **Excellent documentation**: Clear examples and API reference

**Potential Improvements**:
1. **No horizontal scroll**: Cannot accommodate wide content (code, tables)
2. **Fixed overflow behavior**: `overflow: hidden` applied as inline style
3. **Accessibility issue**: Hidden textarea for measurements creates warnings
4. **Bundle size**: Includes full TextareaAutosize even if not using auto-sizing
5. **Limited resize control**: Cannot disable auto-sizing without custom implementation

### Design Philosophy

MUI's multiline TextField embodies several design principles:

1. **Progressive Enhancement**: Basic `multiline` works, add `minRows`/`maxRows` for better UX
2. **Sensible Defaults**: Auto-sizing off by default (uses rows=1), must opt-in
3. **Composition over Configuration**: Complex behavior via composed components
4. **Material Design First**: All decisions guided by Material Design specifications
5. **Accessibility by Default**: Proper ARIA and semantic HTML built-in

### Common Patterns in the Wild

Based on MUI documentation and community usage:

1. **Comment Input**: `minRows={2} maxRows={6}` - Small to medium expansion
2. **Long Form Text**: `minRows={5} maxRows={15}` - Larger content areas
3. **Fixed Height**: `rows={4}` - Predictable layout requirements
4. **Unbounded**: `minRows={3}` only - Chat or note-taking interfaces
5. **Character Limited**: With `inputProps.maxLength` and counter in helperText

### Integration Success Patterns

**Works excellently with**:
- React Hook Form (Controller pattern)
- Formik (direct props spreading)
- Yup validation
- MUI theme system
- TypeScript projects

**Requires care when using**:
- In modals/dialogs (set maxRows)
- With form auto-submit (handle Enter key)
- In tables/grids (use small size)
- With custom overflow (override inline styles)

---

## 17. Patterns to Consider for Semantic UI

### Adopt These Patterns

1. **Unified Component API**: Single TextField component with `multiline` prop rather than separate Textarea component
2. **minRows/maxRows Pattern**: Intuitive height control via row-based sizing
3. **Auto-sizing by Default (with bounds)**: When minRows/maxRows set, auto-grow is automatic
4. **Full Feature Parity**: Multiline mode retains all single-line features (validation, adornments, states)
5. **Label Animation**: Floating label behavior works identically for single-line and multiline
6. **Material Design Typography**: Consistent line-height and font sizing for predictable row heights

### Improve Upon

1. **Horizontal Scroll Support**: Add option for horizontal scrolling when content is wide (code editors, data)
2. **Configurable Overflow**: Allow easy override of overflow behavior without inline styles
3. **Accessibility**: Fix the hidden textarea measurement approach to avoid accessibility warnings
4. **Resize Handle**: Optional visual resize handle for user-controlled height adjustment
5. **Line Number Support**: Built-in line number display for code editing use cases
6. **Syntax Highlighting Integration**: First-class support for code highlighting in textarea mode

### Questions for Semantic UI Design

1. **Single vs Separate Component**: Should we follow MUI's unified TextField approach or have separate Textarea?
2. **Auto-sizing Default**: Should auto-sizing be default behavior or opt-in?
3. **Height Control API**: Row-based (minRows/maxRows) or pixel-based (minHeight/maxHeight)?
4. **Horizontal Scroll**: Support horizontal scrolling for code/data use cases?
5. **Resize Control**: Should users be able to manually resize? If so, which directions?
6. **Material Design**: Should we follow Material Design specs or be design-system agnostic?
7. **Performance**: What's the acceptable performance threshold for height recalculation?

---

## 18. Code Snippets Summary

### Essential Patterns

```jsx
// 1. Basic multiline
<TextField multiline label="Comments" />

// 2. Fixed height
<TextField multiline rows={4} label="Description" />

// 3. Auto-growing (recommended)
<TextField multiline minRows={3} maxRows={10} label="Message" />

// 4. With character count
<TextField
  multiline
  minRows={4}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  helperText={`${value.length}/500`}
  inputProps={{ maxLength: 500 }}
/>

// 5. With validation
<TextField
  multiline
  minRows={4}
  error={hasError}
  helperText={hasError ? "This field is required" : ""}
/>

// 6. Full width in form
<TextField
  multiline
  minRows={5}
  fullWidth
  margin="normal"
/>

// 7. Custom styled
<TextField
  multiline
  rows={5}
  sx={{
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
    },
  }}
/>

// 8. Small size for compact layouts
<TextField
  multiline
  rows={3}
  size="small"
/>
```

---

## Conclusion

MUI's multiline TextField implementation represents a mature, well-designed approach to textarea functionality that balances Material Design compliance with practical usability. The unified API (single component for all text inputs), automatic height adjustment via TextareaAutosize, and full feature parity with single-line TextField make it a strong reference implementation.

Key strengths include the intuitive minRows/maxRows pattern for bounded auto-growth, comprehensive accessibility support, excellent TypeScript integration, and deep theme system integration. The component excels in common use cases like comment inputs, feedback forms, and message composers.

Areas for potential improvement include the lack of horizontal scroll support (limiting code editor use cases), the fixed overflow behavior that requires workarounds, and the accessibility warning from the hidden measurement textarea.

For Semantic UI, MUI's implementation provides valuable patterns to adopt (unified component API, row-based sizing, auto-growth) while also highlighting opportunities to improve (horizontal scroll support, configurable overflow, optional resize handles, better code editing support).
