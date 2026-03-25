# Mantine - Input Usage Patterns

## Component URL
https://mantine.dev/core/input/
Status: ✅ Working
Version: Current (v7.x)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The Mantine Input documentation is thorough with extensive examples, clear API documentation, specialized components, accessibility guidance, and advanced customization options.

## Component Overview

The Input component is a foundational base input element in Mantine designed for creating custom input controls. **Important**: In most cases, you should not use `Input` directly in your application. Instead, use specialized components like `TextInput`, `Textarea`, `NumberInput`, `PasswordInput`, or `SearchInput` that build upon this foundation and provide pre-configured styling and behavior. The `Input` component is primarily intended for advanced use cases where you need to create custom input variants or integrate with third-party libraries.

The Input component provides core functionality including:
- Flexible component polymorphism to work with custom elements or third-party libraries
- Left and right sections for icons, buttons, or custom elements
- Size and variant control
- State management (disabled, readonly, error states)
- Integration with Input.Wrapper for labels, descriptions, and error messages
- Accessibility features including label association and ARIA support

Mantine provides three key input-related components:
- **Input** - Low-level foundational input component for custom implementations
- **Input.Wrapper** - Manages labels, descriptions, and error messages
- **InputBase** - Combines Input and Input.Wrapper with polymorphic component support

## Basic Usage

### Simple Input
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return <Input placeholder="Enter text here" />;
}
```

### Controlled Input
```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Input
      placeholder="Enter text"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}
```

### Input with Wrapper
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input.Wrapper label="Email" description="Enter your email address">
      <Input placeholder="your@email.com" />
    </Input.Wrapper>
  );
}
```

### InputBase (Combined)
InputBase combines Input and Input.Wrapper in a single component:

```tsx
import { InputBase } from '@mantine/core';

function Demo() {
  return (
    <InputBase
      label="Email"
      description="Enter your email address"
      placeholder="your@email.com"
    />
  );
}
```

## Props/API

### Input Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Input placeholder text |
| `value` | `string \| number` | - | Controlled input value |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `disabled` | `boolean` | - | Disables the input |
| `readOnly` | `boolean` | - | Makes the input read-only |
| `error` | `boolean` | - | Marks input as having an error |
| `variant` | `'default' \| 'filled' \| 'unstyled'` | `'default'` | Visual style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Input size |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Border radius |
| `leftSection` | `React.ReactNode` | - | Element to display on the left side of input |
| `rightSection` | `React.ReactNode` | - | Element to display on the right side of input |
| `leftSectionWidth` | `string \| number` | - | Width of left section |
| `rightSectionWidth` | `string \| number` | - | Width of right section |
| `leftSectionPointerEvents` | `'auto' \| 'none'` | `'auto'` | Controls pointer events for left section |
| `rightSectionPointerEvents` | `'auto' \| 'none'` | `'auto'` | Controls pointer events for right section |
| `component` | `React.ElementType` | `'input'` | Root element component (supports polymorphism) |
| `classNames` | `object` | - | Object with classNames for each selector |
| `styles` | `object` | - | Object with inline styles for each selector |
| `ref` | `React.Ref<HTMLInputElement>` | - | Reference to the input element |

### Input.Wrapper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `React.ReactNode` | - | Label text displayed above the input |
| `description` | `React.ReactNode` | - | Description text below the label |
| `error` | `boolean \| React.ReactNode` | - | Error message or boolean to show error state |
| `required` | `boolean` | - | Shows asterisk and adds required attribute |
| `withAsterisk` | `boolean` | - | Shows asterisk without required attribute |
| `withErrorStyles` | `boolean` | `true` | Apply error styling to input |
| `id` | `string` | - | Associates label with input via htmlFor |
| `children` | `React.ReactNode` | - | Input element(s) |
| `inputWrapperOrder` | `array` | `['label', 'description', 'input', 'error']` | Order of wrapper elements |
| `inputContainer` | `(children: React.ReactNode) => React.ReactNode` | - | Wrapper function for custom containers |
| `classNames` | `object` | - | Object with classNames for each selector |
| `styles` | `object` | - | Object with inline styles for each selector |

### InputBase Props
Combines all Input and Input.Wrapper props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `React.ElementType` | `'input'` | Root element component (polymorphic) |
| `label` | `React.ReactNode` | - | Label text |
| `description` | `React.ReactNode` | - | Description text |
| `error` | `boolean \| React.ReactNode` | - | Error message |
| `required` | `boolean` | - | Shows asterisk |

## Common Patterns

### Pattern: Input with Icon (Left Section)
Add an icon to the left of the input:

```tsx
import { Input } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';

function Demo() {
  return (
    <>
      <Input
        placeholder="Your email"
        leftSection={<IconAt size={16} />}
        mb="md"
      />

      <Input
        placeholder="Password"
        type="password"
        leftSection={<IconLock size={16} />}
      />
    </>
  );
}
```

**Note**: Use `leftSectionPointerEvents="none"` if the icon is not interactive:

```tsx
<Input
  placeholder="Email"
  leftSection={<IconAt size={16} />}
  leftSectionPointerEvents="none"
/>
```

### Pattern: Input with Clear Button (Right Section)
Add an interactive clear button to the right:

```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Input
      placeholder="Clearable input"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      rightSection={
        value ? (
          <Input.ClearButton onClick={() => setValue('')} />
        ) : null
      }
    />
  );
}
```

**Alternative with CloseButton**:

```tsx
import { Input, CloseButton } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Input
      placeholder="Search"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      rightSection={
        value ? (
          <CloseButton
            onClick={() => setValue('')}
            aria-label="Clear input"
          />
        ) : null
      }
    />
  );
}
```

### Pattern: Multiple Sections
Combine left and right sections:

```tsx
import { Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';

function Demo() {
  return (
    <Input
      placeholder="Email"
      leftSection={<IconAt size={16} />}
      rightSection={<span>@example.com</span>}
      rightSectionPointerEvents="none"
    />
  );
}
```

### Pattern: Custom Icon Button in Right Section
```tsx
import { Input, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function Demo() {
  return (
    <Input
      placeholder="Search"
      rightSection={
        <ActionIcon size="xs" variant="subtle" color="gray">
          <IconSearch size={14} />
        </ActionIcon>
      }
    />
  );
}
```

### Pattern: Label and Description
Use Input.Wrapper for complete form field control:

```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input.Wrapper
      label="Email address"
      description="We'll never share your email"
      id="email"
    >
      <Input id="email" placeholder="your@email.com" />
    </Input.Wrapper>
  );
}
```

### Pattern: Required Field with Asterisk
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Asterisk with required attribute */}
      <Input.Wrapper label="Email" required id="email1">
        <Input id="email1" placeholder="Email" />
      </Input.Wrapper>

      {/* Visual asterisk only (no required attribute) */}
      <Input.Wrapper label="Name" withAsterisk id="name">
        <Input id="name" placeholder="Name" />
      </Input.Wrapper>
    </>
  );
}
```

### Pattern: Error Handling
Display validation errors:

```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.currentTarget.value;
    setValue(val);
    setError(!val ? 'Email is required' : val.includes('@') ? '' : 'Invalid email');
  };

  return (
    <Input.Wrapper
      label="Email"
      error={error}
      id="email"
    >
      <Input
        id="email"
        placeholder="your@email.com"
        value={value}
        onChange={handleChange}
      />
    </Input.Wrapper>
  );
}
```

### Pattern: Custom Error Styles
Use `withErrorStyles={false}` when applying custom error indicators:

```tsx
import { Input, Tooltip } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

function Demo() {
  return (
    <Input.Wrapper
      label="Email"
      error="Invalid email"
      withErrorStyles={false}
      id="email"
    >
      <Input
        id="email"
        placeholder="Email"
        rightSection={<IconAlertCircle size={16} color="red" />}
      />
    </Input.Wrapper>
  );
}
```

### Pattern: Custom Wrapper Layout
Customize the order of wrapper elements:

```tsx
import { TextInput } from '@mantine/core';

function Demo() {
  return (
    <TextInput
      label="Username"
      description="Choose a unique username"
      error="Username is already taken"
      // Custom order: error appears before input
      inputWrapperOrder={['label', 'error', 'input', 'description']}
    />
  );
}
```

### Pattern: Input Container (Tooltip Integration)
Wrap input with custom container:

```tsx
import { Input, Tooltip } from '@mantine/core';
import { useState } from 'react';

function Demo() {
  const [focused, setFocused] = useState(false);

  return (
    <Input.Wrapper
      label="Username"
      inputContainer={(children) => (
        <Tooltip label="5-20 characters" opened={focused}>
          {children}
        </Tooltip>
      )}
    >
      <Input
        placeholder="Username"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Input.Wrapper>
  );
}
```

## Visual Variations

### Variants
Mantine Input supports three visual style variants:

```tsx
import { Input, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      {/* Default - outlined style (default) */}
      <Input
        placeholder="Default variant"
        variant="default"
      />

      {/* Filled - filled background */}
      <Input
        placeholder="Filled variant"
        variant="filled"
      />

      {/* Unstyled - no styling, minimal styling */}
      <Input
        placeholder="Unstyled variant"
        variant="unstyled"
      />
    </Stack>
  );
}
```

**Variant Characteristics**:
- **default**: Outlined border style, default Mantine style
- **filled**: Filled background, works well with dark themes
- **unstyled**: Minimal styling, custom styling required

### Size Patterns
Control input size with the `size` prop:

```tsx
import { Input, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Input size="xs" placeholder="Extra small" />
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium (default)" />
      <Input size="lg" placeholder="Large" />
      <Input size="xl" placeholder="Extra large" />
    </Stack>
  );
}
```

**Size Effects**:
- Controls padding, font-size, border-width, and height
- `size` prop is inherited by left/right sections automatically
- Use `leftSectionWidth` and `rightSectionWidth` for custom section sizing

### Border Radius
```tsx
import { Input, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Input radius="xs" placeholder="Extra small radius" />
      <Input radius="sm" placeholder="Small radius" />
      <Input radius="md" placeholder="Medium radius" />
      <Input radius="lg" placeholder="Large radius" />
      <Input radius="xl" placeholder="Extra large radius" />
      <Input radius={0} placeholder="No radius (square)" />
    </Stack>
  );
}
```

## States

### Disabled State
Disable user interaction:

```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input
      placeholder="Disabled input"
      disabled
    />
  );
}
```

**With Wrapper**:
```tsx
<Input.Wrapper label="Email" disabled id="email">
  <Input id="email" placeholder="Email" disabled />
</Input.Wrapper>
```

### Read-Only State
Make input non-editable:

```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input
      value="Cannot edit this"
      readOnly
    />
  );
}
```

### Error State
Mark input with error styling:

```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Boolean error - no message */}
      <Input
        placeholder="Input"
        error
        mb="md"
      />

      {/* Error with message */}
      <Input.Wrapper
        label="Email"
        error="Invalid email format"
        id="email"
      >
        <Input
          id="email"
          placeholder="Email"
          error
        />
      </Input.Wrapper>
    </>
  );
}
```

**Without Error Styling**:
```tsx
<Input.Wrapper
  error="Custom error handling"
  withErrorStyles={false}
  id="input"
>
  <Input id="input" placeholder="Input" />
</Input.Wrapper>
```

### Focused State
Handle focus events:

```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [focused, setFocused] = useState(false);

  return (
    <Input
      placeholder="Focus me"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        borderColor: focused ? 'blue' : undefined,
        boxShadow: focused ? '0 0 0 2px rgba(0, 125, 255, 0.1)' : undefined,
      }}
    />
  );
}
```

## Validation Patterns

### Form Integration with Form Hook
Validate input with custom logic:

```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (val) => {
    if (!val) {
      setError('Email is required');
      return false;
    }
    if (!val.includes('@')) {
      setError('Invalid email format');
      return false;
    }
    setError('');
    return true;
  };

  const handleBlur = () => validate(value);

  return (
    <Input.Wrapper
      label="Email"
      error={error}
      id="email"
    >
      <Input
        id="email"
        placeholder="your@email.com"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onBlur={handleBlur}
      />
    </Input.Wrapper>
  );
}
```

### Real-time Validation
Validate as user types:

```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const handleChange = (e) => {
    const val = e.currentTarget.value;
    setPassword(val);

    if (val.length < 6) setStrength('weak');
    else if (val.length < 12) setStrength('medium');
    else setStrength('strong');
  };

  return (
    <Input.Wrapper
      label="Password"
      description={`Strength: ${strength}`}
      id="password"
    >
      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
      />
    </Input.Wrapper>
  );
}
```

## Label & Placeholder Patterns

### Label with Description
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input.Wrapper
      label="Full name"
      description="Enter your first and last name"
      id="fullname"
    >
      <Input id="fullname" placeholder="John Doe" />
    </Input.Wrapper>
  );
}
```

### Placeholder Only
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input placeholder="Enter text here" />
  );
}
```

### Required Indicators
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Asterisk with required HTML attribute */}
      <Input.Wrapper label="Email" required id="email">
        <Input id="email" placeholder="Email" />
      </Input.Wrapper>

      {/* Visual asterisk only */}
      <Input.Wrapper label="Name" withAsterisk id="name">
        <Input id="name" placeholder="Name" />
      </Input.Wrapper>
    </>
  );
}
```

### Custom Label
```tsx
import { Input, Group, Text } from '@mantine/core';
import { IconInfo } from '@tabler/icons-react';

function Demo() {
  return (
    <Input.Wrapper
      label={
        <Group gap={4}>
          <Text>Email</Text>
          <IconInfo size={16} />
        </Group>
      }
      id="email"
    >
      <Input id="email" placeholder="Email" />
    </Input.Wrapper>
  );
}
```

## Prefix & Suffix Patterns

### Left Section (Prefix)
Prefix with icon:

```tsx
import { Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';

function Demo() {
  return (
    <Input
      placeholder="your@email.com"
      leftSection={<IconAt size={16} />}
      leftSectionPointerEvents="none"
    />
  );
}
```

Prefix with text:

```tsx
import { Input, Text } from '@mantine/core';

function Demo() {
  return (
    <Input
      placeholder="10"
      leftSection={<Text size="sm">$</Text>}
      leftSectionPointerEvents="none"
    />
  );
}
```

### Right Section (Suffix)
Suffix with text:

```tsx
import { Input, Text } from '@mantine/core';

function Demo() {
  return (
    <Input
      placeholder="50"
      rightSection={<Text size="sm">%</Text>}
      rightSectionPointerEvents="none"
    />
  );
}
```

Suffix with button:

```tsx
import { Input, Button } from '@mantine/core';

function Demo() {
  return (
    <Input
      placeholder="Enter email"
      rightSection={
        <Button size="xs" variant="default">
          Search
        </Button>
      }
    />
  );
}
```

### Section Sizing
Control section width:

```tsx
import { Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function Demo() {
  return (
    <Input
      placeholder="Search"
      leftSection={<IconSearch size={16} />}
      leftSectionWidth={40}  // Custom width
      rightSectionWidth={40}
    />
  );
}
```

**Disable Pointer Events for Non-Interactive Sections**:

```tsx
<Input
  placeholder="Email"
  leftSection={icon}
  leftSectionPointerEvents="none"  // Icon is not clickable
  rightSection={button}
  rightSectionPointerEvents="auto"  // Button is clickable
/>
```

## Input Types

### Text Input
Default input type for text entry:

```tsx
<Input type="text" placeholder="Enter text" />
```

### Password Input
```tsx
<Input type="password" placeholder="Enter password" />
```

### Email Input
```tsx
<Input type="email" placeholder="your@email.com" />
```

### Number Input
```tsx
<Input type="number" placeholder="Enter number" />
```

### URL Input
```tsx
<Input type="url" placeholder="https://example.com" />
```

### Search Input
```tsx
<Input type="search" placeholder="Search..." />
```

### Telephone Input
```tsx
<Input type="tel" placeholder="+1 (555) 000-0000" />
```

### Date Input
```tsx
<Input type="date" />
```

### Time Input
```tsx
<Input type="time" />
```

**Note**: For specialized input types, consider using Mantine's dedicated components:
- `TextInput` - Text entry (recommended)
- `PasswordInput` - Secure password entry with show/hide toggle
- `NumberInput` - Number entry with increment/decrement
- `Textarea` - Multi-line text entry

## Polymorphic Component

The Input component supports the `component` prop to use different elements:

### As Select Element
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <InputBase
      label="Choose option"
      component="select"
      pointer
    >
      <option value="">Select option</option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="svelte">Svelte</option>
    </InputBase>
  );
}
```

### As Button
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input
      component="button"
      pointer
      onClick={() => console.log('clicked')}
    >
      Click me
    </Input>
  );
}
```

### With Third-Party Libraries (IMask)
Integrate with react-imask for input masking:

```tsx
import { InputBase } from '@mantine/core';
import { IMaskInput } from 'react-imask';

function Demo() {
  return (
    <InputBase
      label="Phone number"
      component={IMaskInput}
      mask="+7 (000) 000-00-00"
      placeholder="+7 (000) 000-00-00"
    />
  );
}
```

### With Custom Components
```tsx
import { InputBase } from '@mantine/core';
import { forwardRef } from 'react';

const CustomInput = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

function Demo() {
  return (
    <InputBase
      component={CustomInput}
      label="Custom input"
    />
  );
}
```

## Accessibility

### Label Association
Always associate labels with inputs:

```tsx
import { Input, useId } from '@mantine/core';

function Demo() {
  const id = useId();

  return (
    <Input.Wrapper label="Email" id={id}>
      <Input id={id} placeholder="your@email.com" />
    </Input.Wrapper>
  );
}
```

### ARIA Attributes
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input
      aria-label="Search products"
      placeholder="Search..."
    />
  );
}
```

### aria-describedby
Link descriptions to input for screen readers:

```tsx
import { Input, useId } from '@mantine/core';

function Demo() {
  const descId = useId();

  return (
    <>
      <Input
        aria-describedby={descId}
        placeholder="Password"
      />
      <span id={descId}>
        Must be 8+ characters with numbers and symbols
      </span>
    </>
  );
}
```

### Semantic HTML
Use proper input types for better accessibility:

```tsx
{/* Better accessibility */}
<Input type="email" aria-label="Email address" />
<Input type="password" aria-label="Password" />
<Input type="tel" aria-label="Phone number" />
```

### Error Announcement
Error messages are announced to screen readers via aria-describedby:

```tsx
<Input.Wrapper
  label="Email"
  error="Invalid email format"
  id="email"
>
  <Input id="email" />
</Input.Wrapper>
```

## Integration Patterns

### Form Submission
Basic form handling:

```tsx
import { useState } from 'react';
import { Input, Button, Stack } from '@mantine/core';

function Demo() {
  const [values, setValues] = useState({ email: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Input.Wrapper label="Name" id="name">
          <Input
            id="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.currentTarget.value })}
            placeholder="Your name"
          />
        </Input.Wrapper>

        <Input.Wrapper label="Email" id="email">
          <Input
            id="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.currentTarget.value })}
            placeholder="your@email.com"
          />
        </Input.Wrapper>

        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
```

### With Controlled Component State
```tsx
import { useState } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      placeholder="Controlled input"
    />
  );
}
```

### Conditional Rendering Based on Input
```tsx
import { useState } from 'react';
import { Input, Text } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');

  return (
    <>
      <Input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="Type something"
      />
      {value && <Text>You typed: {value}</Text>}
    </>
  );
}
```

## Advanced Patterns

### Custom Input with Ref Management
```tsx
import { useRef } from 'react';
import { Input, Button, Stack } from '@mantine/core';

function Demo() {
  const ref = useRef<HTMLInputElement>(null);

  const handleFocus = () => ref.current?.focus();
  const handleClear = () => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  return (
    <Stack>
      <Input ref={ref} placeholder="Focus me" />
      <Button onClick={handleFocus}>Focus Input</Button>
      <Button onClick={handleClear} variant="default">Clear Input</Button>
    </Stack>
  );
}
```

### Input with Live Search
```tsx
import { useState } from 'react';
import { Input, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function Demo() {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);

  const items = ['React', 'Vue', 'Angular', 'Svelte', 'Ember'];

  const handleChange = (e) => {
    const val = e.currentTarget.value;
    setValue(val);
    setResults(
      val ? items.filter((item) => item.toLowerCase().includes(val.toLowerCase())) : []
    );
  };

  return (
    <Stack>
      <Input
        placeholder="Search frameworks"
        value={value}
        onChange={handleChange}
        leftSection={<IconSearch size={16} />}
      />
      {results.length > 0 && (
        <Stack gap={4}>
          {results.map((result) => (
            <Text key={result} size="sm">{result}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
```

### Input with Character Counter
```tsx
import { useState } from 'react';
import { Input, Text } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const maxLength = 100;

  return (
    <>
      <Input
        placeholder="Type message"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        maxLength={maxLength}
      />
      <Text size="sm" c="dimmed">
        {value.length} / {maxLength}
      </Text>
    </>
  );
}
```

### Debounced Input
```tsx
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Input
      placeholder="Type to search (debounced)"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}
```

### Theme Customization
Set default props and styles for all inputs:

```tsx
import { MantineProvider, Input, createTheme } from '@mantine/core';

const theme = createTheme({
  components: {
    Input: Input.extend({
      defaultProps: {
        variant: 'filled',
        size: 'md',
      },
    }),
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* All inputs will use custom defaults */}
    </MantineProvider>
  );
}
```

### Styling with classNames
```tsx
import { Input } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Input
      classNames={{
        input: classes.input,
        section: classes.section,
      }}
      leftSection={icon}
      placeholder="Custom styled"
    />
  );
}
```

### Inline Styles
```tsx
import { Input } from '@mantine/core';

function Demo() {
  return (
    <Input
      styles={{
        input: {
          border: '2px solid blue',
          padding: '12px',
          fontSize: '16px',
        },
      }}
      placeholder="Custom styled"
    />
  );
}
```

## Styling & CSS

### Available Style Selectors

**Input Component Selectors**:
- `wrapper` - Root wrapper element
- `input` - Input element itself
- `section` - Left or right section wrapper

**Input.Wrapper Selectors**:
- `root` - Root wrapper element
- `label` - Label element
- `required` - Required asterisk element
- `description` - Description text element
- `error` - Error message element

### CSS Modules with classNames
```tsx
import { Input } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Input.Wrapper
      label="Email"
      classNames={{
        label: classes.label,
        error: classes.error,
      }}
      error="Invalid email"
      id="email"
    >
      <Input
        id="email"
        classNames={{
          input: classes.input,
          section: classes.section,
        }}
        placeholder="Email"
      />
    </Input.Wrapper>
  );
}
```

**Example CSS Module (Demo.module.css)**:
```css
.label {
  font-weight: 600;
  color: #333;
}

.input {
  border-color: #ccc;
  border-radius: 8px;
}

.input:focus {
  border-color: blue;
  box-shadow: 0 0 0 3px rgba(0, 0, 255, 0.1);
}

.error {
  color: #ff6b6b;
  font-size: 12px;
}
```

### Mantine Theme Integration
Inputs automatically respect theme settings:

```tsx
import { MantineProvider, createTheme, Input } from '@mantine/core';

const theme = createTheme({
  colors: {
    primary: ['#f0f0f0', '#e6e6e6', '#cccccc', '#999999', '#666666', '#333333', '#1a1a1a', '#0d0d0d', '#000000', '#000000'],
  },
  primaryColor: 'primary',
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Input color="primary" />
    </MantineProvider>
  );
}
```

### CSS Variables
Runtime customization with CSS custom properties:

```css
:root {
  --input-size-md: 40px;
  --input-radius: 8px;
  --input-border-color: #ccc;
}

.input {
  height: var(--input-size-md);
  border-radius: var(--input-radius);
  border: 1px solid var(--input-border-color);
}
```

## Notes

### Why Use Specialized Components
- **TextInput** - Pre-configured text input with type validation
- **PasswordInput** - Includes show/hide toggle for password visibility
- **NumberInput** - Built-in increment/decrement buttons and number validation
- **Textarea** - Multi-line text input with resize control
- **SearchInput** - Optimized for search with clear button and focus handling

Use the base `Input` component only for:
- Custom input variants not provided by Mantine
- Integration with third-party input libraries
- Creating specialized input types specific to your application

### Component Composition
- **Input** - Pure input element
- **Input.Wrapper** - Labels, descriptions, errors
- **InputBase** - Combined Input + Input.Wrapper (recommended for most cases)

### Best Practices
1. Always provide accessible labels or aria-label
2. Use specialized input components when available
3. Control section pointer events based on interactivity
4. Use refs sparingly - prefer controlled components
5. Leverage Input.Wrapper for consistent form layout
6. Set `inputWrapperOrder` for custom element arrangement
7. Use `withErrorStyles={false}` when applying custom error indicators

### Common Gotchas
1. **Missing label association** - Always use `id` with Input.Wrapper to link labels
2. **Unhandled leftSectionPointerEvents** - Default is 'auto', set to 'none' for non-interactive icons
3. **Forgetting rightSectionPointerEvents** - Interactive buttons need 'auto' (default)
4. **InputBase vs Input** - Use InputBase for most cases, bare Input for special cases
5. **Custom error handling** - Remember to set `withErrorStyles={false}` when combining with custom error indicators
