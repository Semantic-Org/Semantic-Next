# Mantine - Textarea Usage Patterns

## Component URL
https://mantine.dev/core/textarea/
Status: ✅ Working
Version: Current (v7.x)
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - The Mantine Textarea documentation is thorough with clear examples, autosize functionality, accessibility guidance, and integration with the broader Input component system. The component inherits features from Input and Input.Wrapper components.

## Component Overview

The Textarea component is a multiline text input element in Mantine designed for entering and editing longer text content. It provides two primary modes of operation:
- **Regular textarea** - Fixed or manually resizable text area with scroll
- **Autosize textarea** - Automatically expands height based on content

The Textarea component provides core functionality including:
- Automatic height adjustment (autosize mode) with configurable min/max rows
- Manual resize control (vertical, both, or none)
- Size and variant control matching the Mantine design system
- State management (disabled, readonly, error states)
- Integration with Input.Wrapper for labels, descriptions, and error messages
- Left and right sections for icons, buttons, or custom elements (inherited from Input)
- Accessibility features including label association and ARIA support

**Key Insight**: Textarea inherits all features from the Input and Input.Wrapper components, making it a fully-featured form control with consistent API across all Mantine input components.

## Basic Usage

### Simple Textarea
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return <Textarea placeholder="Enter your message here" />;
}
```

### Controlled Textarea
```tsx
import { useState } from 'react';
import { Textarea } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="Enter text"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}
```

### Textarea with Label and Description
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Your comment"
      description="Please provide your feedback"
      placeholder="Enter your comment here"
    />
  );
}
```

### Required Field
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Bio"
      placeholder="Tell us about yourself"
      required
    />
  );
}
```

## Props/API

### Textarea Component Props

The Textarea component inherits all props from Input and Input.Wrapper, plus textarea-specific HTML attributes.

#### Core Textarea Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Textarea placeholder text |
| `value` | `string` | - | Controlled textarea value |
| `defaultValue` | `string` | - | Uncontrolled initial value |
| `onChange` | `(event: React.ChangeEvent<HTMLTextAreaElement>) => void` | - | Change handler |
| `rows` | `number` | - | Number of visible text rows (height) |
| `maxLength` | `number` | - | Maximum number of characters allowed |

#### Autosize Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autosize` | `boolean` | `false` | Enable automatic height adjustment based on content |
| `minRows` | `number` | - | Minimum number of visible rows when autosize is enabled |
| `maxRows` | `number` | - | Maximum rows before scrolling; unlimited if omitted |

#### Resize Control

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resize` | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | `'none'` | Controls CSS resize property behavior |

#### Inherited Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `React.ReactNode` | - | Label text displayed above the textarea |
| `description` | `React.ReactNode` | - | Description text below the label |
| `error` | `boolean \| React.ReactNode` | - | Error message or boolean to show error state |
| `disabled` | `boolean` | - | Disables the textarea |
| `readOnly` | `boolean` | - | Makes the textarea read-only |
| `required` | `boolean` | - | Shows asterisk and adds required attribute |
| `withAsterisk` | `boolean` | - | Shows asterisk without required attribute |
| `variant` | `'default' \| 'filled' \| 'unstyled'` | `'default'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Textarea size |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Border radius |
| `leftSection` | `React.ReactNode` | - | Element to display on the left side |
| `rightSection` | `React.ReactNode` | - | Element to display on the right side |
| `leftSectionWidth` | `string \| number` | - | Width of left section |
| `rightSectionWidth` | `string \| number` | - | Width of right section |
| `leftSectionPointerEvents` | `'auto' \| 'none'` | `'auto'` | Controls pointer events for left section |
| `rightSectionPointerEvents` | `'auto' \| 'none'` | `'auto'` | Controls pointer events for right section |
| `classNames` | `object` | - | Object with classNames for each selector |
| `styles` | `object` | - | Object with inline styles for each selector |
| `ref` | `React.Ref<HTMLTextAreaElement>` | - | Reference to the textarea element |
| `withErrorStyles` | `boolean` | `true` | Apply error styling to textarea |
| `inputWrapperOrder` | `array` | `['label', 'description', 'input', 'error']` | Order of wrapper elements |
| `inputContainer` | `(children: React.ReactNode) => React.ReactNode` | - | Wrapper function for custom containers |

**Note**: Since Textarea inherits from Input, consult the [Input documentation](https://mantine.dev/core/input/) for comprehensive details on all inherited features.

## Core Patterns

### Pattern: Basic Multiline Text Input
Standard textarea for longer text entry:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      rows={5}
    />
  );
}
```

### Pattern: Controlled Component
Full control over textarea state:

```tsx
import { useState } from 'react';
import { Textarea } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Textarea
      label="Comment"
      placeholder="Your comment"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}
```

### Pattern: Autosize Without Limits
Textarea grows indefinitely with content:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Your story"
      placeholder="Tell us your story..."
      autosize
      minRows={2}
    />
  );
}
```

**Behavior**: Height starts at `minRows` and expands as content grows with no upper limit.

### Pattern: Autosize With Max Rows
Textarea grows to max then scrolls:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Comment"
      placeholder="Enter comment (max 4 rows visible)"
      autosize
      minRows={2}
      maxRows={4}
    />
  );
}
```

**Behavior**: Height grows from 2 to 4 rows, then becomes scrollable.

### Pattern: Manual Resize Control
Allow user to resize textarea manually:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Vertical resize only */}
      <Textarea
        label="Vertical resize"
        placeholder="Drag bottom edge to resize"
        resize="vertical"
        mb="md"
      />

      {/* Both directions */}
      <Textarea
        label="Free resize"
        placeholder="Drag corner to resize"
        resize="both"
      />
    </>
  );
}
```

### Pattern: Character Count
Display character count and limit:

```tsx
import { useState } from 'react';
import { Textarea, Text } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const maxLength = 500;

  return (
    <>
      <Textarea
        label="Description"
        placeholder="Enter description"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        maxLength={maxLength}
      />
      <Text size="sm" c="dimmed" ta="right">
        {value.length} / {maxLength}
      </Text>
    </>
  );
}
```

### Pattern: Error Handling
Display validation errors:

```tsx
import { useState } from 'react';
import { Textarea } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const val = event.currentTarget.value;
    setValue(val);

    if (!val) {
      setError('Comment is required');
    } else if (val.length < 10) {
      setError('Comment must be at least 10 characters');
    } else {
      setError('');
    }
  };

  return (
    <Textarea
      label="Comment"
      placeholder="Enter your comment"
      value={value}
      onChange={handleChange}
      error={error}
    />
  );
}
```

### Pattern: Disabled State
Prevent user interaction:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Disabled field"
      placeholder="This field is disabled"
      disabled
      value="Cannot edit this content"
    />
  );
}
```

### Pattern: Read-Only State
Display content without editing:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Terms and Conditions"
      value="These are the terms..."
      readOnly
      rows={5}
    />
  );
}
```

### Pattern: Required Field with Asterisk
Indicate required fields:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Asterisk with required attribute */}
      <Textarea
        label="Message"
        placeholder="Required message"
        required
        mb="md"
      />

      {/* Visual asterisk only (no required attribute) */}
      <Textarea
        label="Optional message"
        placeholder="Optional but marked"
        withAsterisk
      />
    </>
  );
}
```

## Visual Patterns

### Size Variations
Control textarea size with the `size` prop:

```tsx
import { Textarea, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Textarea size="xs" label="Extra Small" placeholder="xs size" />
      <Textarea size="sm" label="Small" placeholder="sm size" />
      <Textarea size="md" label="Medium (default)" placeholder="md size" />
      <Textarea size="lg" label="Large" placeholder="lg size" />
      <Textarea size="xl" label="Extra Large" placeholder="xl size" />
    </Stack>
  );
}
```

**Size Effects**:
- Controls padding, font-size, border-width, and height
- Affects label and description text sizing
- Size is inherited by left/right sections automatically

### Variant Patterns
Mantine Textarea supports three visual style variants:

```tsx
import { Textarea, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      {/* Default - outlined style (default) */}
      <Textarea
        label="Default variant"
        placeholder="Outlined style"
        variant="default"
      />

      {/* Filled - filled background */}
      <Textarea
        label="Filled variant"
        placeholder="Filled background"
        variant="filled"
      />

      {/* Unstyled - minimal styling */}
      <Textarea
        label="Unstyled variant"
        placeholder="No default styling"
        variant="unstyled"
      />
    </Stack>
  );
}
```

**Variant Characteristics**:
- **default**: Outlined border style, standard Mantine appearance
- **filled**: Filled background, works well with dark themes
- **unstyled**: Minimal styling, requires custom styling

### Border Radius
Control corner rounding:

```tsx
import { Textarea, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Textarea radius="xs" placeholder="Extra small radius" />
      <Textarea radius="sm" placeholder="Small radius" />
      <Textarea radius="md" placeholder="Medium radius" />
      <Textarea radius="lg" placeholder="Large radius" />
      <Textarea radius="xl" placeholder="Extra large radius" />
      <Textarea radius={0} placeholder="No radius (square)" />
    </Stack>
  );
}
```

## Behavioral Patterns

### Autosize Behavior

#### Without maxRows (Unlimited Growth)
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Unlimited growth"
      placeholder="Keep typing and I'll keep growing..."
      autosize
      minRows={3}
    />
  );
}
```

**Behavior**: Textarea starts at 3 rows height and continues expanding as content grows, never showing a scrollbar.

#### With maxRows (Constrained Growth)
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Limited growth"
      placeholder="I'll grow to 6 rows then scroll..."
      autosize
      minRows={3}
      maxRows={6}
    />
  );
}
```

**Behavior**: Textarea grows from 3 to 6 rows, then becomes scrollable.

#### Fixed minRows Only
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Start bigger"
      placeholder="I start at 5 rows and grow from there..."
      autosize
      minRows={5}
    />
  );
}
```

**Behavior**: Starts taller and grows without limit.

### Resize Behavior

The `resize` prop controls manual resizing by the user:

```tsx
import { Textarea, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      {/* No resize (default) */}
      <Textarea
        label="No resize"
        placeholder="Cannot be resized"
        resize="none"
      />

      {/* Vertical only */}
      <Textarea
        label="Vertical resize"
        placeholder="Resize height only"
        resize="vertical"
      />

      {/* Both directions */}
      <Textarea
        label="Free resize"
        placeholder="Resize any direction"
        resize="both"
      />

      {/* Horizontal only (uncommon) */}
      <Textarea
        label="Horizontal resize"
        placeholder="Resize width only"
        resize="horizontal"
      />
    </Stack>
  );
}
```

**Note**: When `autosize` is enabled, manual resize may conflict with automatic height adjustment. Use `resize="none"` with autosize for best results.

### Focus and Blur Handling
Track focus state for conditional UI:

```tsx
import { useState } from 'react';
import { Textarea, Text } from '@mantine/core';

function Demo() {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <Textarea
        label="Message"
        placeholder="Focus me"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && <Text size="sm" c="blue">Textarea is focused</Text>}
    </>
  );
}
```

## Content Patterns

### Pattern: Rich Description
Provide detailed context with labels and descriptions:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Project requirements"
      description="Please describe the project scope, goals, and deliverables in detail"
      placeholder="Enter comprehensive project details..."
      autosize
      minRows={4}
    />
  );
}
```

### Pattern: Placeholder Guidance
Use placeholder for format hints:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="JSON Configuration"
      placeholder={`{
  "key": "value",
  "enabled": true
}`}
      rows={6}
    />
  );
}
```

### Pattern: Pre-filled Content
Start with initial content:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Edit template"
      defaultValue="Dear [Name],

Thank you for your interest.

Best regards"
      autosize
      minRows={5}
    />
  );
}
```

### Pattern: Character Limit with Warning
Show warning when approaching limit:

```tsx
import { useState } from 'react';
import { Textarea, Text } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const maxLength = 200;
  const warningThreshold = 180;
  const remaining = maxLength - value.length;

  return (
    <>
      <Textarea
        label="Bio"
        placeholder="Tell us about yourself"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        maxLength={maxLength}
      />
      <Text
        size="sm"
        ta="right"
        c={remaining < (maxLength - warningThreshold) ? 'red' : 'dimmed'}
      >
        {remaining} characters remaining
      </Text>
    </>
  );
}
```

## Accessibility

### Label Association
Always associate labels with textareas:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Your feedback"
      placeholder="Enter feedback"
      id="feedback"
    />
  );
}
```

**Automatic**: Mantine automatically links the label to the input with proper `htmlFor` attribute.

### ARIA Attributes for Unlabeled Textareas
When no visual label is present, use `aria-label`:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      aria-label="Enter your comments"
      placeholder="Comments..."
    />
  );
}
```

**Critical**: Without `label` or `aria-label`, the textarea is not accessible to screen readers.

### aria-describedby for Descriptions
Link descriptions to textarea for screen readers:

```tsx
import { Textarea, useId } from '@mantine/core';

function Demo() {
  const descId = useId();

  return (
    <>
      <Textarea
        label="Comment"
        aria-describedby={descId}
        placeholder="Your comment"
      />
      <span id={descId}>
        Please be respectful and constructive in your feedback
      </span>
    </>
  );
}
```

### Error Announcement
Error messages are automatically announced to screen readers:

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Message"
      placeholder="Enter message"
      error="Message must be at least 20 characters"
    />
  );
}
```

**Automatic**: Mantine handles `aria-describedby` linking for error messages.

### Required Field Semantics
```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Required comment"
      placeholder="Enter comment"
      required
      aria-required="true"
    />
  );
}
```

## Framework-Specific Features

### Styles API

The Textarea component exposes multiple selectors for granular styling control:

**Available Selectors**:
- `wrapper` - Root wrapper element
- `input` - Textarea element itself
- `section` - Left or right section wrapper
- `root` - Input.Wrapper root element
- `label` - Label element
- `required` - Required asterisk element
- `description` - Description text element
- `error` - Error message element

### CSS Modules with classNames

```tsx
import { Textarea } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Textarea
      label="Styled textarea"
      placeholder="Custom styling"
      classNames={{
        input: classes.input,
        label: classes.label,
        error: classes.error,
      }}
    />
  );
}
```

**Example CSS Module (Demo.module.css)**:
```css
.label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.input {
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
}

.input:focus {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}
```

### Inline Styles

```tsx
import { Textarea } from '@mantine/core';

function Demo() {
  return (
    <Textarea
      label="Custom styled"
      placeholder="Inline styles"
      styles={{
        input: {
          backgroundColor: '#f0f0f0',
          border: '2px solid #333',
          fontSize: '16px',
        },
        label: {
          color: '#555',
          fontWeight: 'bold',
        },
      }}
    />
  );
}
```

### Theme Integration

Set default props and styles for all textareas:

```tsx
import { MantineProvider, Textarea, createTheme } from '@mantine/core';

const theme = createTheme({
  components: {
    Textarea: Textarea.extend({
      defaultProps: {
        variant: 'filled',
        size: 'md',
        autosize: true,
        minRows: 2,
      },
      styles: {
        input: {
          fontFamily: 'monospace',
        },
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* All textareas will use custom defaults */}
    </MantineProvider>
  );
}
```

### CSS Variables
Runtime customization with CSS custom properties:

```css
:root {
  --mantine-textarea-min-height: 120px;
  --mantine-textarea-radius: 8px;
  --mantine-textarea-border-color: #cbd5e0;
  --mantine-textarea-font-size: 14px;
}

.custom-textarea {
  min-height: var(--mantine-textarea-min-height);
  border-radius: var(--mantine-textarea-radius);
  border: 1px solid var(--mantine-textarea-border-color);
  font-size: var(--mantine-textarea-font-size);
}
```

## Implementation Notes

### Autosize Implementation
Mantine Textarea uses the [react-textarea-autosize](https://www.npmjs.com/package/react-textarea-autosize) package for automatic height adjustment. This package:
- Adjusts height synchronously on content change
- Supports minimum and maximum row constraints
- Handles dynamic content updates efficiently
- Works with controlled and uncontrolled components

### Component Inheritance
Textarea inherits features from:
1. **Input component** - Core input functionality, sections, variants, sizes
2. **Input.Wrapper** - Labels, descriptions, errors, required indicators

This means all patterns and props from Input are available on Textarea. Consult the [Input documentation](https://mantine.dev/core/input/) for comprehensive feature coverage.

### Ref Access Pattern
Access the underlying textarea element:

```tsx
import { useRef } from 'react';
import { Textarea, Button } from '@mantine/core';

function Demo() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => ref.current?.focus();
  const handleClear = () => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  return (
    <>
      <Textarea ref={ref} label="Controlled via ref" placeholder="Textarea" />
      <Button onClick={handleFocus}>Focus</Button>
      <Button onClick={handleClear}>Clear</Button>
    </>
  );
}
```

### Left and Right Sections
While primarily designed for single-line inputs, textareas can technically use left/right sections inherited from Input:

```tsx
import { Textarea } from '@mantine/core';
import { IconNote } from '@tabler/icons-react';

function Demo() {
  return (
    <Textarea
      label="Notes"
      placeholder="Enter notes"
      leftSection={<IconNote size={16} />}
      leftSectionPointerEvents="none"
      rows={4}
    />
  );
}
```

**Note**: Section positioning may not be ideal for multi-row textareas. Use with consideration for UX.

### Form Integration
Standard form submission patterns:

```tsx
import { useState } from 'react';
import { Textarea, Button, Stack } from '@mantine/core';

function Demo() {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Textarea
          label="Comment"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
          required
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
```

### Performance Considerations
- **Autosize**: Slightly more expensive than fixed-size due to height calculations
- **Large content**: Consider virtualization for extremely large text (>10k characters)
- **Controlled components**: Avoid expensive onChange handlers; debounce if needed

### Common Use Cases

#### Code/JSON Editor
```tsx
<Textarea
  label="Configuration"
  placeholder="Enter JSON config"
  styles={{ input: { fontFamily: 'monospace' } }}
  autosize
  minRows={6}
  maxRows={20}
/>
```

#### Multi-paragraph Text Entry
```tsx
<Textarea
  label="Essay"
  description="Write at least 200 words"
  placeholder="Begin your essay..."
  autosize
  minRows={10}
/>
```

#### Comments/Feedback
```tsx
<Textarea
  label="Feedback"
  placeholder="Share your thoughts..."
  autosize
  minRows={3}
  maxRows={8}
/>
```

#### Short Notes
```tsx
<Textarea
  label="Quick note"
  placeholder="Jot down a note"
  rows={3}
  resize="none"
/>
```

## Best Practices

1. **Always provide accessible labels** - Use `label` prop or `aria-label` attribute
2. **Choose appropriate autosize settings** - Use `maxRows` to prevent excessive growth
3. **Set minRows for better UX** - Start with adequate visible space (3-5 rows)
4. **Use resize="none" with autosize** - Avoid conflicts between manual and automatic resizing
5. **Provide character counts** - Help users understand limits when using `maxLength`
6. **Use controlled components for validation** - Full control over state enables better validation UX
7. **Consider placeholder formatting** - Use multi-line placeholders to show expected format
8. **Match variant to context** - Filled works well in dark mode; default for light mode
9. **Leverage Input.Wrapper** - Consistent form layout with labels, descriptions, errors
10. **Set appropriate sizes** - Larger sizes for primary content entry, smaller for auxiliary fields

## Common Gotchas

1. **Missing label association** - Always use `label` or `aria-label` for accessibility
2. **Autosize without minRows** - Textarea may start too small; always set `minRows`
3. **Resize conflicts** - Manual `resize` can conflict with `autosize`; use `resize="none"` with autosize
4. **Uncontrolled maxLength** - `maxLength` attribute works but doesn't provide feedback; show character count
5. **ref timing** - Refs may be null on initial render; always check `ref.current` before using
6. **CSS override conflicts** - Be careful overriding height when autosize is enabled
7. **Initial value confusion** - Use `defaultValue` for uncontrolled, `value` for controlled
8. **Forgetting pointer events** - Set `leftSectionPointerEvents="none"` for non-interactive icons
9. **Form reset behavior** - Controlled components require manual reset in form handlers
10. **Performance with large text** - Consider debouncing onChange handlers for very large textareas

## Related Components

- **TextInput** - Single-line text input
- **PasswordInput** - Password entry with show/hide toggle
- **JsonInput** - Specialized textarea for JSON with syntax validation
- **CodeHighlight** - Read-only code display with syntax highlighting
- **Input** - Base input component with sections and wrapper features
- **Input.Wrapper** - Standalone wrapper for labels, descriptions, errors

## Integration with Mantine Design System

Textarea fully integrates with Mantine's design system:
- **Theme colors** - Respects theme color scheme and custom colors
- **Spacing system** - Uses consistent spacing tokens
- **Typography** - Inherits font settings from theme
- **Focus management** - Consistent focus ring styling
- **Dark mode** - Automatic dark mode support via ColorScheme
- **Responsive sizing** - Size props work with responsive breakpoints

## Notes

### When to Use Textarea vs TextInput
- **Textarea** - Multi-line content, paragraphs, descriptions, comments, code
- **TextInput** - Single-line entries: names, emails, URLs, short responses

### Autosize vs Fixed Height
- **Autosize** - Better UX for unknown content length; adapts to user input
- **Fixed height** - Better for consistent layouts; use with `rows` prop

### Manual Resize Options
- **none** (default) - Consistent layout, works well with autosize
- **vertical** - User control over visible area; good for optional expansion
- **both** - Maximum flexibility; may break layout consistency

### Validation Strategies
1. **On blur** - Validate when user leaves field (less intrusive)
2. **On change** - Real-time validation (immediate feedback)
3. **On submit** - Validate all fields together (batch validation)
4. **Hybrid** - Validate on blur, then on change after first error (balanced approach)
