# Mantine - FileInput Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://mantine.dev/core/file-input/
Status: ✅ Working
Version: v7.x / v8.x
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, thorough prop coverage, TypeScript support, and practical use cases demonstrating all major features including custom value components and file validation.

## Component Definition
- **Core purpose**: Provides a file input field that allows users to select and upload one or multiple files, with built-in validation and customizable display
- **Mental model**: An enhanced input field specifically designed for file selection, offering controlled value management, visual feedback, and flexible file display customization
- **Semantic meaning**: Communicates a file selection interface where users can browse and select files from their device, with clear indication of selected files and validation states

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiple={true}`, `accept="image/*"`)
- **Composed**: Via composition/children (e.g., custom `valueComponent` for file display)
- **CSS-only**: Requires custom styling (e.g., Styles API for granular control)

## Core Features
| Feature | Present | Support | Details |
|---------|---------|---------|---------|
| Single file selection | ✅ | Native | Default behavior with `value` and `onChange` props accepting `File \| null` |
| Multiple file selection | ✅ | Native | `multiple` prop enables array-based file selection with `File[]` type |
| File type restriction | ✅ | Native | `accept` prop for MIME type filtering (e.g., `accept="image/png,image/jpeg"`) |
| Clear button | ✅ | Native | `clearable` prop displays clear button when file is selected |
| Custom file display | ✅ | Composed | `valueComponent` prop accepts custom component for displaying selected files |
| Placeholder text | ✅ | Native | `placeholder` prop for empty state text |
| Icon sections | ✅ | Native | `leftSection` and `rightSection` props for icons or custom elements |
| File validation | ✅ | Native | `error` prop for validation messages, works with form libraries |
| Camera capture | ✅ | Native | `capture` prop for mobile device camera/file capture |
| Disabled state | ✅ | Native | `disabled` prop prevents interaction |
| Read-only state | ✅ | Native | `readOnly` prop makes input non-editable |
| Form integration | ✅ | Native | `name` and `form` props for HTML form integration |
| Reset functionality | ✅ | Native | `resetRef` prop provides programmatic reset capability |

## Props API

### Value Management
| Prop | Type | Default | Details |
|------|------|---------|---------|
| `value` | `File \| null` or `File[]` | `null` or `[]` | Controlled component value, type depends on `multiple` prop |
| `onChange` | `(value: File \| null \| File[]) => void` | - | Callback fired when file selection changes |
| `defaultValue` | `File \| null` or `File[]` | - | Uncontrolled component default value |
| `multiple` | `boolean` | `false` | Allows selection of multiple files |

### File Selection
| Prop | Type | Default | Details |
|------|------|---------|---------|
| `accept` | `string` | - | MIME types to accept (e.g., `"image/png,image/jpeg"` or `"image/*"`) |
| `capture` | `boolean \| 'user' \| 'environment'` | - | Specifies camera capture on mobile devices |
| `clearable` | `boolean` | `false` | Shows clear button in right section when file is selected |

### Display & Customization
| Prop | Type | Default | Details |
|------|------|---------|---------|
| `valueComponent` | `FC<{ value: File \| File[] \| null }>` | - | Custom component to render selected file(s) |
| `placeholder` | `string` | - | Placeholder text when no file is selected |
| `leftSection` | `ReactNode` | - | Content displayed in left section (typically icons) |
| `rightSection` | `ReactNode` | - | Content displayed in right section (overrides clear button) |
| `leftSectionPointerEvents` | `CSSProperties['pointerEvents']` | - | Pointer events for left section (set to 'none' for non-interactive) |
| `rightSectionPointerEvents` | `CSSProperties['pointerEvents']` | - | Pointer events for right section (set to 'none' for non-interactive) |

### Form & Validation
| Prop | Type | Default | Details |
|------|------|---------|---------|
| `label` | `ReactNode` | - | Input label for accessibility and display |
| `description` | `ReactNode` | - | Description text below label |
| `error` | `ReactNode` | - | Error message (displays as text or boolean for error state) |
| `required` | `boolean` | `false` | Adds required attribute and asterisk to label |
| `withAsterisk` | `boolean` | `false` | Shows asterisk without required attribute (visual only) |
| `name` | `string` | - | Name attribute for form submission |
| `form` | `string` | - | Form ID to associate with |

### Styling
| Prop | Type | Default | Details |
|------|------|---------|---------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Input size |
| `variant` | `'default' \| 'filled' \| 'unstyled'` | `'default'` | Visual variant style |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Border radius |
| `classNames` | `Partial<Record<string, string>>` | - | CSS classes for inner elements |
| `styles` | `Partial<Record<string, CSSProperties>>` | - | Inline styles for inner elements |

### State & Accessibility
| Prop | Type | Default | Details |
|------|------|---------|---------|
| `disabled` | `boolean` | `false` | Disables the input |
| `readOnly` | `boolean` | `false` | Makes input read-only |
| `aria-label` | `string` | - | Accessibility label (required if no label prop) |
| `resetRef` | `MutableRefObject<() => void>` | - | Ref to function called when value resets to null/empty |

## Usage Patterns

### Single File Selection
```tsx
import { useState } from 'react';
import { FileInput } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<File | null>(null);

  return (
    <FileInput
      label="Upload resume"
      placeholder="Choose file"
      value={value}
      onChange={setValue}
    />
  );
}
```

### Multiple File Selection
```tsx
import { useState } from 'react';
import { FileInput } from '@mantine/core';

function Demo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileInput
      label="Upload images"
      placeholder="Select files"
      multiple
      value={files}
      onChange={setFiles}
    />
  );
}
```

### With File Type Restriction
```tsx
import { FileInput } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Accept only images */}
      <FileInput
        label="Upload image"
        placeholder="Image files only"
        accept="image/png,image/jpeg"
      />

      {/* Accept only PDFs */}
      <FileInput
        label="Upload PDF"
        placeholder="PDF files only"
        accept="application/pdf"
      />

      {/* Accept any image type */}
      <FileInput
        label="Upload any image"
        placeholder="Any image format"
        accept="image/*"
      />
    </>
  );
}
```

### With Icon Sections
```tsx
import { FileInput } from '@mantine/core';
import { IconUpload, IconFileCv } from '@tabler/icons-react';

function Demo() {
  return (
    <>
      {/* Left section icon */}
      <FileInput
        leftSection={<IconUpload size={16} />}
        label="Upload file"
        placeholder="Click to upload"
        leftSectionPointerEvents="none"
      />

      {/* Right section icon */}
      <FileInput
        rightSection={<IconFileCv size={18} />}
        label="Attach CV"
        placeholder="Your CV"
        rightSectionPointerEvents="none"
      />
    </>
  );
}
```

### Clearable with Clear Button
```tsx
import { useState } from 'react';
import { FileInput } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<File | null>(null);

  return (
    <FileInput
      label="Upload file"
      placeholder="Click to upload"
      clearable
      value={value}
      onChange={setValue}
    />
  );
}
```

### Custom Value Display with Pills
```tsx
import { FileInput, FileInputProps, Pill } from '@mantine/core';

const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return (
      <Pill.Group>
        {value.map((file, index) => (
          <Pill key={index}>{file.name}</Pill>
        ))}
      </Pill.Group>
    );
  }

  return <Pill>{value.name}</Pill>;
};

function Demo() {
  return (
    <FileInput
      label="Upload files"
      placeholder="Select files"
      multiple
      valueComponent={ValueComponent}
    />
  );
}
```

### Advanced Custom Value Display
```tsx
import { FileInput, FileInputProps, Group, Center } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

function FileValue({ file }: { file: File }) {
  return (
    <Center
      inline
      style={{
        backgroundColor: 'var(--mantine-color-gray-1)',
        fontSize: 'var(--mantine-font-size-xs)',
        padding: '3px 7px',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
    >
      <IconPhoto size={14} style={{ marginRight: 5 }} />
      <span
        style={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          maxWidth: 200,
          display: 'inline-block',
        }}
      >
        {file.name}
      </span>
    </Center>
  );
}

const ValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return (
      <Group gap="sm" py="xs">
        {value.map((file, index) => (
          <FileValue file={file} key={index} />
        ))}
      </Group>
    );
  }

  return <FileValue file={value} />;
};

function Demo() {
  return (
    <FileInput
      label="Upload images"
      placeholder="Select images"
      multiple
      valueComponent={ValueComponent}
    />
  );
}
```

### With Validation and Error
```tsx
import { useState } from 'react';
import { FileInput, Button, Stack } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (!value) {
      setError('Please select a file');
      return;
    }

    if (value.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    // Submit logic here
  };

  return (
    <Stack>
      <FileInput
        label="Upload file"
        placeholder="Select file"
        required
        error={error}
        value={value}
        onChange={(file) => {
          setValue(file);
          setError('');
        }}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}
```

### Size Variants
```tsx
import { FileInput, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <FileInput size="xs" label="Extra small" placeholder="Size xs" />
      <FileInput size="sm" label="Small" placeholder="Size sm" />
      <FileInput size="md" label="Medium" placeholder="Size md" />
      <FileInput size="lg" label="Large" placeholder="Size lg" />
      <FileInput size="xl" label="Extra large" placeholder="Size xl" />
    </Stack>
  );
}
```

### Visual Variants
```tsx
import { FileInput, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <FileInput
        variant="default"
        label="Default variant"
        placeholder="Default"
      />

      <FileInput
        variant="filled"
        label="Filled variant"
        placeholder="Filled"
      />

      <FileInput
        variant="unstyled"
        label="Unstyled variant"
        placeholder="Unstyled"
      />
    </Stack>
  );
}
```

### Mobile Camera Capture
```tsx
import { FileInput } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Capture from any camera */}
      <FileInput
        label="Take photo"
        placeholder="Capture photo"
        accept="image/*"
        capture
      />

      {/* Capture from front camera */}
      <FileInput
        label="Take selfie"
        placeholder="Capture selfie"
        accept="image/*"
        capture="user"
      />

      {/* Capture from rear camera */}
      <FileInput
        label="Take photo"
        placeholder="Capture photo"
        accept="image/*"
        capture="environment"
      />
    </>
  );
}
```

### Disabled and Read-Only States
```tsx
import { FileInput, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <FileInput
        label="Disabled input"
        placeholder="Cannot interact"
        disabled
      />

      <FileInput
        label="Read-only input"
        placeholder="Cannot change"
        readOnly
      />
    </Stack>
  );
}
```

### With Description and Required
```tsx
import { FileInput } from '@mantine/core';

function Demo() {
  return (
    <>
      <FileInput
        label="Upload resume"
        description="PDF or Word document, max 5MB"
        placeholder="Select file"
        required
        accept=".pdf,.doc,.docx"
      />

      <FileInput
        label="Upload avatar"
        description="Square image, recommended size 400x400px"
        placeholder="Select image"
        withAsterisk
        accept="image/*"
      />
    </>
  );
}
```

### Form Integration
```tsx
import { FileInput, Button, Stack } from '@mantine/core';

function Demo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('resume');
    console.log('Uploaded file:', file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <FileInput
          label="Resume"
          name="resume"
          placeholder="Select your resume"
          required
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
```

### With Reset Functionality
```tsx
import { useState, useRef } from 'react';
import { FileInput, Button, Group } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const handleReset = () => {
    setValue(null);
    resetRef.current?.();
  };

  return (
    <>
      <FileInput
        label="Upload file"
        placeholder="Select file"
        value={value}
        onChange={setValue}
        resetRef={resetRef}
      />

      <Group mt="md">
        <Button onClick={handleReset}>Reset</Button>
      </Group>
    </>
  );
}
```

### Custom Styling with Styles API
```tsx
import { FileInput } from '@mantine/core';

function Demo() {
  return (
    <FileInput
      label="Custom styled input"
      placeholder="Select file"
      classNames={{
        root: 'custom-root',
        wrapper: 'custom-wrapper',
        input: 'custom-input',
        section: 'custom-section',
        label: 'custom-label',
        error: 'custom-error',
      }}
      styles={{
        input: {
          border: '2px solid blue',
          borderRadius: '8px',
        },
        label: {
          color: 'blue',
          fontWeight: 600,
        },
      }}
    />
  );
}
```

## Variants and Composition

### Visual Variants
- **default**: Standard input with border and background
- **filled**: Filled background style without border
- **unstyled**: No default styling, full customization needed

### Size Options
- **xs**: Extra small (compact)
- **sm**: Small (default)
- **md**: Medium
- **lg**: Large
- **xl**: Extra large

### Radius Options
- **xs**: Extra small border radius
- **sm**: Small border radius (default)
- **md**: Medium border radius
- **lg**: Large border radius
- **xl**: Extra large border radius

## Accessibility

### Best Practices
- Always provide `label` prop for screen reader users
- If `label` is not used, provide `aria-label` for accessibility
- Use `required` or `withAsterisk` to indicate mandatory fields
- Provide clear `error` messages for validation failures
- Use descriptive `placeholder` text
- Ensure `description` provides helpful context about file requirements

### Keyboard Navigation
- Tab: Focus the file input
- Enter/Space: Opens file picker dialog
- Escape: Closes file picker (browser behavior)

### Screen Reader Support
- Label is properly associated with input element
- Error messages are announced to screen readers
- Required state is communicated via aria-required
- File selection changes are announced

## Responsive Design

### Mobile Considerations
- `capture` prop enables camera capture on mobile devices
- Touch-friendly click target size maintained across sizes
- File picker interface is native to device
- Consider using `accept` to limit file types on mobile

### Breakpoint Behavior
- FileInput inherits responsive sizing from Input component
- Can be wrapped in responsive Grid or Stack layouts
- Supports full-width display with standard width props

## Theme Integration

### CSS Variables
FileInput uses Mantine's design tokens:
- `--mantine-color-*`: Color scheme
- `--mantine-font-size-*`: Font sizing
- `--mantine-spacing-*`: Spacing
- `--mantine-radius-*`: Border radius
- `--mantine-line-height`: Line height

### Customization via Theme
```tsx
import { MantineProvider } from '@mantine/core';

const theme = {
  components: {
    FileInput: {
      defaultProps: {
        size: 'md',
        variant: 'default',
        radius: 'sm',
      },
      styles: {
        label: {
          fontWeight: 600,
        },
      },
    },
  },
};

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* Your app */}
    </MantineProvider>
  );
}
```

## Related Components

### FileButton
- Alternative component for custom file input styling
- Provides render prop pattern for full customization
- Used when FileInput's structure is too restrictive
- **URL**: https://mantine.dev/core/file-button/

### Dropzone
- Drag-and-drop file upload component
- More visual and interactive than FileInput
- Supports multiple files with preview
- **Package**: @mantine/dropzone

### Input
- Base input component that FileInput extends
- Provides Input.Wrapper for label, description, error
- Shared props and styling patterns
- **URL**: https://mantine.dev/core/input/

### Pill
- Commonly used with `valueComponent` for file display
- Shows selected files as dismissible chips
- **URL**: https://mantine.dev/core/pill/

### Button
- Often paired with FileInput in forms
- Used for form submission and reset actions
- **URL**: https://mantine.dev/core/button/

## Framework-Specific Features

### TypeScript Support
```tsx
import { FileInput, FileInputProps } from '@mantine/core';

// Single file
const [file, setFile] = useState<File | null>(null);

// Multiple files
const [files, setFiles] = useState<File[]>([]);

// Custom value component with types
const CustomValueComponent: FileInputProps['valueComponent'] = ({ value }) => {
  // TypeScript knows the value type based on multiple prop
  return <div>{value?.toString()}</div>;
};
```

### Polymorphic Component
FileInput extends Input which is polymorphic, though typically used as standard input element.

### Uncontrolled Usage
```tsx
import { FileInput } from '@mantine/core';

function Demo() {
  return (
    <FileInput
      label="Upload file"
      defaultValue={null}
      // No value/onChange props needed
    />
  );
}
```

### Integration with Mantine Form
```tsx
import { useForm } from '@mantine/form';
import { FileInput, Button } from '@mantine/core';

function Demo() {
  const form = useForm({
    initialValues: {
      file: null,
    },
    validate: {
      file: (value) => {
        if (!value) return 'File is required';
        if (value.size > 5 * 1024 * 1024) {
          return 'File size must be less than 5MB';
        }
        return null;
      },
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <FileInput
        label="Upload file"
        placeholder="Select file"
        {...form.getInputProps('file')}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Code Examples

See "Usage Patterns" section above for comprehensive code examples covering:
- Single and multiple file selection
- File type restrictions
- Icon sections
- Clear button functionality
- Custom value display with Pills
- Validation and error handling
- Size and variant options
- Mobile camera capture
- Disabled and read-only states
- Form integration
- Reset functionality
- Custom styling

## Notes and Observations

### Strengths
- **Comprehensive File Management**: Excellent support for both single and multiple file selection with type-safe TypeScript generics
- **Flexible Display**: `valueComponent` prop enables complete customization of how selected files are displayed
- **Rich Validation**: Built-in error prop with form library integration for robust validation
- **Mobile-First**: `capture` prop enables native camera capture on mobile devices
- **Clearable UX**: Built-in clear button improves user experience
- **Icon Integration**: `leftSection` and `rightSection` props allow for visual enhancement
- **Accessibility**: Proper label association and ARIA support
- **Type Safety**: Full TypeScript support with generic types based on `multiple` prop
- **Form Integration**: Seamless integration with native forms and Mantine form library
- **Styles API**: Granular control over all internal elements
- **Theme Integration**: Inherits from Mantine's design system

### Design Patterns
- Follows controlled/uncontrolled component pattern
- Uses render props pattern for `valueComponent`
- Extends base Input component for consistency
- Provides `resetRef` for imperative control
- Supports both native and visual-only validation states

### Best Practices Demonstrated
- TypeScript generics ensure type safety based on configuration
- `leftSectionPointerEvents="none"` prevents icon clicks
- Custom value components handle both single and array cases
- Clear separation between clearable button and custom rightSection
- Proper accessibility labels required when no visual label
- File size validation should be handled in onChange or form validation

### Limitations
- Custom `rightSection` overrides the `clearable` button
- `valueComponent` must handle null and array cases manually
- No built-in file size or type validation (must be implemented separately)
- File preview functionality requires custom implementation
- Drag-and-drop requires separate Dropzone component

### Framework Integration
- **Package**: @mantine/core
- **Dependencies**: React 18+
- **Styling**: CSS Modules with CSS variables
- **Compatible With**: Next.js, Vite, Create React App
- **Form Libraries**: Mantine Form, React Hook Form, Formik

### Comparison with FileButton
- FileInput provides structured input field UI
- FileButton provides render prop for complete customization
- FileInput better for traditional forms
- FileButton better for custom upload experiences

### Version Notes
- Current stable version: v7.x / v8.x series
- API stable since v5.x with minor enhancements
- TypeScript support improved in v7.x
- Styles API consistent across versions
- Breaking changes minimal between major versions

### Documentation Quality
- Excellent code examples for all major features
- Clear TypeScript typing in examples
- Comprehensive props documentation
- Good coverage of edge cases and patterns
- Integration examples with other components
- Mobile-specific features well documented
