# HeroUI/NextUI - Textarea Usage Patterns

## Component URL
https://www.heroui.com/docs/components/textarea
Status: ✅ Working

## Documentation Quality
Good - Comprehensive API documentation with clear examples, detailed prop descriptions, accessibility information, and practical use cases. Well-organized with code examples for each feature.

## Component Definition
- **Core purpose**: Multi-line text input field enabling users to enter large blocks of text content with automatic resizing capabilities
- **Mental model**: An expandable text container - users think of it as a flexible space that grows as they type, providing visual feedback about their input
- **Semantic meaning**: Represents a form control for multi-line textual data entry, supporting validation states, helper text, and contextual information to guide user input

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Primary content is user-entered text, supports placeholder hints |
| Label content | ✅ | Supports label text above, inside, or outside-left of the textarea |
| Description text | ✅ | Helper text below textarea via `description` prop |
| Error messages | ✅ | Validation feedback via `errorMessage` prop (ReactNode or function) |
| Start content | ✅ | Left-side icons or elements via `startContent` slot |
| End content | ✅ | Right-side icons or elements via `endContent` slot |
| Placeholder | ✅ | Hint text via `placeholder` prop |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | `value` prop with `onChange` or `onValueChange` callbacks |
| Uncontrolled | ✅ | `defaultValue` prop for initial value without control |
| Auto-resize | ✅ | Default behavior, grows with content based on `minRows` and `maxRows` |
| Fixed size | ✅ | Set `disableAutosize={true}` to disable auto-growth |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Disabled | ✅ | `isDisabled` boolean prop, adds `data-disabled` attribute |
| Read-only | ✅ | `isReadOnly` boolean prop, adds `data-readonly` attribute |
| Invalid/Error | ✅ | `isInvalid` boolean prop, adds `data-invalid` attribute |
| Required | ✅ | `isRequired` boolean prop, adds `data-required` attribute |
| Hover | ✅ | `data-hover` attribute during mouse interaction |
| Focus | ✅ | `data-focus` attribute when focused |
| Focus visible | ✅ | `data-focus-visible` attribute for keyboard focus |
| Clearable | ✅ | `isClearable` boolean shows clear button when populated |

## Variation Patterns

### Visual Variants
| Variant | Present | Details |
|---------|---------|---------|
| flat | ✅ | Default variant, subtle background appearance |
| bordered | ✅ | Outlined style with visible border |
| faded | ✅ | Muted appearance with soft styling |
| underlined | ✅ | Bottom border only, minimalist style |

### Size Options
| Size | Present | Details |
|---------|---------|---------|
| sm | ✅ | Small size variant |
| md | ✅ | Medium size variant (default) |
| lg | ✅ | Large size variant |

### Color Options
| Color | Present | Details |
|---------|---------|---------|
| default | ✅ | Default theme color |
| primary | ✅ | Primary theme color |
| secondary | ✅ | Secondary theme color |
| success | ✅ | Success/positive state color |
| warning | ✅ | Warning/caution state color |
| danger | ✅ | Danger/error state color |

### Radius Options
| Radius | Present | Details |
|---------|---------|---------|
| none | ✅ | No border radius (sharp corners) |
| sm | ✅ | Small border radius |
| md | ✅ | Medium border radius |
| lg | ✅ | Large border radius |
| full | ✅ | Full border radius (maximum roundness) |

### Label Placement
| Placement | Present | Details |
|---------|---------|---------|
| inside | ✅ | Label appears inside the textarea (floating label pattern) |
| outside | ✅ | Label appears above the textarea |
| outside-left | ✅ | Label appears to the left of the textarea |

## Behavioral Patterns

### Auto-Resize Behavior
| Pattern | Present | Details |
|---------|---------|---------|
| Default auto-resize | ✅ | Grows automatically with content, based on react-textarea-autosize |
| Min rows control | ✅ | `minRows` prop (default: 3) sets minimum visible rows |
| Max rows control | ✅ | `maxRows` prop (default: 8) limits maximum growth |
| Disable auto-resize | ✅ | `disableAutosize` boolean to prevent automatic growth |
| Cache measurements | ✅ | `cacheMeasurements` boolean to reuse previous height calculations |
| Height change callback | ✅ | `onHeightChange(height, meta)` triggered on height recalculation |

### Character Limits
| Pattern | Present | Details |
|---------|---------|---------|
| Max length | ✅ | Native HTML `maxLength` attribute support |
| Character counter | ❌ | Not documented (may require custom implementation) |
| Min length | ✅ | Native HTML `minLength` attribute support |

### Validation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Custom validation | ✅ | `validate` prop with custom validation function |
| Error message | ✅ | `errorMessage` as ReactNode or function(validationResult) |
| Invalid state | ✅ | `isInvalid` boolean for manual error state control |
| Required field | ✅ | `isRequired` boolean marks field as required |
| Native validation | ✅ | `validationBehavior="native"` for HTML form validation |
| ARIA validation | ✅ | `validationBehavior="aria"` for screen reader validation |

### Interaction Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Clear button | ✅ | `isClearable` shows clear icon when text exists |
| Clear callback | ✅ | `onClear()` callback when clear button clicked |
| Value change | ✅ | `onValueChange(value: string)` for controlled components |
| Native change | ✅ | Standard `onChange` event with event.target.value |
| Animation control | ✅ | `disableAnimation` boolean to remove transition effects |
| Full width | ✅ | `fullWidth` boolean (default: true) for container spanning |

## Accessibility Features

### ARIA Support
- Built on native `<textarea>` element for semantic HTML compliance
- ARIA labeling support for screen readers
- Invalid state exposure via ARIA attributes (`aria-invalid`)
- Description linked via `aria-describedby`
- Error messages linked via `aria-errormessage`
- Required state communicated via `aria-required`

### Keyboard Support
- Standard textarea keyboard navigation
- Focus visible state for keyboard users (`data-focus-visible`)
- Tab navigation support
- Form submission on Ctrl/Cmd+Enter (standard browser behavior)

### Screen Reader Support
- Label association with textarea element
- Description and error message announcements
- State changes announced (invalid, required, disabled)
- Clear button announced as actionable control

### Event Support
Native HTML textarea events:
- change
- clipboard events
- composition events
- selection events
- input events

## DOM Slots & Customization

The component exposes the following customizable slots via `classNames` or `slots` props:

| Slot | Purpose |
|------|---------|
| base | Main wrapper element handling overall alignment |
| label | Label element with positioning control |
| inputWrapper | Container wrapping label and input together |
| input | The actual `<textarea>` element |
| description | Helper text area below the textarea |
| errorMessage | Validation message display area |
| headerWrapper | Container for label and clear button |

## Data Attributes

Conditional attributes applied to the base element for styling:

| Attribute | Condition |
|-----------|-----------|
| data-invalid | When `isInvalid={true}` |
| data-required | When `isRequired={true}` |
| data-readonly | When `isReadOnly={true}` |
| data-disabled | When `isDisabled={true}` |
| data-hover | During mouse hover interaction |
| data-focus | When textarea has focus |
| data-focus-visible | When focused via keyboard navigation |

These enable precise CSS targeting:
```css
[data-invalid="true"] { /* error styling */ }
[data-focus-visible="true"] { /* keyboard focus styling */ }
```

## Code Examples

### Basic Usage
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <Textarea
      label="Description"
      placeholder="Enter your description"
    />
  );
}
```

### Controlled with Validation
```jsx
import {Textarea} from "@heroui/react";
import {useState} from "react";

export default function App() {
  const [value, setValue] = useState("");

  const validate = (val) => {
    if (val.length < 10) {
      return "Description must be at least 10 characters";
    }
    return null;
  };

  return (
    <Textarea
      label="Description"
      value={value}
      onValueChange={setValue}
      validate={validate}
      isInvalid={value.length > 0 && value.length < 10}
      errorMessage={validate(value)}
    />
  );
}
```

### All Variants
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea
        variant="flat"
        label="Flat"
        placeholder="Enter your description"
      />
      <Textarea
        variant="bordered"
        label="Bordered"
        placeholder="Enter your description"
      />
      <Textarea
        variant="faded"
        label="Faded"
        placeholder="Enter your description"
      />
      <Textarea
        variant="underlined"
        label="Underlined"
        placeholder="Enter your description"
      />
    </div>
  );
}
```

### With Description and Helper Text
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <Textarea
      label="Bio"
      placeholder="Tell us about yourself"
      description="Enter a brief description about yourself"
    />
  );
}
```

### Label Placement Variations
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea
        label="Inside"
        labelPlacement="inside"
        placeholder="Enter your description"
      />
      <Textarea
        label="Outside"
        labelPlacement="outside"
        placeholder="Enter your description"
      />
      <Textarea
        label="Outside Left"
        labelPlacement="outside-left"
        placeholder="Enter your description"
      />
    </div>
  );
}
```

### With Start and End Content
```jsx
import {Textarea} from "@heroui/react";
import {MailIcon} from "./icons";

export default function App() {
  return (
    <Textarea
      label="Email"
      placeholder="you@example.com"
      startContent={<MailIcon />}
      endContent={
        <div className="text-sm text-default-400">
          @example.com
        </div>
      }
    />
  );
}
```

### Auto-Resize Configuration
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <Textarea
      label="Description"
      placeholder="Enter your description"
      minRows={3}
      maxRows={8}
      onHeightChange={(height, meta) => {
        console.log('New height:', height, meta);
      }}
    />
  );
}
```

### Fixed Height (No Auto-Resize)
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <Textarea
      label="Description"
      placeholder="Enter your description"
      disableAutosize={true}
      minRows={5}
    />
  );
}
```

### With Clear Button
```jsx
import {Textarea} from "@heroui/react";
import {useState} from "react";

export default function App() {
  const [value, setValue] = useState("Some initial text");

  return (
    <Textarea
      label="Description"
      value={value}
      onValueChange={setValue}
      isClearable={true}
      onClear={() => setValue("")}
    />
  );
}
```

### Required Field with Error State
```jsx
import {Textarea} from "@heroui/react";
import {useState} from "react";

export default function App() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && value.length === 0;

  return (
    <Textarea
      label="Comment"
      placeholder="Enter your comment"
      value={value}
      onValueChange={setValue}
      onBlur={() => setTouched(true)}
      isRequired
      isInvalid={isInvalid}
      errorMessage={isInvalid && "Comment is required"}
    />
  );
}
```

### Color Variants
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea color="default" label="Default" />
      <Textarea color="primary" label="Primary" />
      <Textarea color="secondary" label="Secondary" />
      <Textarea color="success" label="Success" />
      <Textarea color="warning" label="Warning" />
      <Textarea color="danger" label="Danger" />
    </div>
  );
}
```

### Size Variants
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea size="sm" label="Small" />
      <Textarea size="md" label="Medium" />
      <Textarea size="lg" label="Large" />
    </div>
  );
}
```

### Radius Variants
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea radius="none" label="None" />
      <Textarea radius="sm" label="Small" />
      <Textarea radius="md" label="Medium" />
      <Textarea radius="lg" label="Large" />
      <Textarea radius="full" label="Full" />
    </div>
  );
}
```

### Disabled and Read-Only States
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea
        label="Disabled"
        isDisabled={true}
        defaultValue="This textarea is disabled"
      />
      <Textarea
        label="Read-Only"
        isReadOnly={true}
        defaultValue="This textarea is read-only"
      />
    </div>
  );
}
```

### Form Integration (React Hook Form)
```jsx
import {Textarea} from "@heroui/react";
import {useForm} from "react-hook-form";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 10,
            message: "Must be at least 10 characters"
          }
        })}
        label="Description"
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Custom Slot Styling
```jsx
import {Textarea} from "@heroui/react";

export default function App() {
  return (
    <Textarea
      label="Custom Styled"
      classNames={{
        base: "max-w-md",
        label: "text-blue-600 font-bold",
        inputWrapper: "bg-gray-100 border-2 border-gray-300",
        input: "text-lg font-mono",
        description: "text-xs italic",
      }}
      description="Custom styling applied to each slot"
    />
  );
}
```

## Framework-Specific Features

### React Aria Foundation
- Built on React Aria's form primitives for accessibility
- Leverages `useTextField` hook internally
- Provides consistent accessibility patterns across HeroUI components

### React Textarea Autosize Integration
- Auto-resize functionality powered by `react-textarea-autosize` library
- Efficient height recalculation with optional caching
- Smooth transitions during content growth
- Performance optimized for large text blocks

### Next.js Compatibility
- Server Component compatible (can be imported in server components)
- No hydration mismatches
- Works with Next.js form actions
- SSR-friendly rendering

### Framer Motion Integration
- Animations powered by Framer Motion (when not disabled)
- Smooth state transitions
- Can be disabled via `disableAnimation` prop
- Configurable motion variants through theme customization

### Tailwind CSS Integration
- All styling built on Tailwind CSS utilities
- Fully customizable through Tailwind theme
- Responsive variants available
- Custom variants can be added through configuration

### TypeScript Support
- Full TypeScript definitions included
- Props fully typed with generics
- Type-safe ref forwarding
- Intellisense support for all props and slots

## Installation & Setup

### Package Installation
```bash
# npm
npm i @heroui/react

# yarn
yarn add @heroui/react

# pnpm
pnpm add @heroui/react

# bun
bun add @heroui/react
```

### CLI Installation (Individual Component)
```bash
npx heroui-cli@latest add input
```

Note: Textarea is part of the Input component package in HeroUI.

### Import
```jsx
import {Textarea} from "@heroui/react";
```

## API Reference Summary

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | ReactNode | - | Label text for the textarea |
| value | string | - | Controlled value |
| defaultValue | string | - | Default uncontrolled value |
| placeholder | string | - | Placeholder text |
| description | ReactNode | - | Helper text below textarea |
| errorMessage | ReactNode \| function | - | Error message (static or function) |
| variant | "flat" \| "bordered" \| "faded" \| "underlined" | "flat" | Visual style variant |
| color | "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" | "default" | Theme color |
| size | "sm" \| "md" \| "lg" | "md" | Size variant |
| radius | "none" \| "sm" \| "md" \| "lg" \| "full" | - | Border radius |
| labelPlacement | "inside" \| "outside" \| "outside-left" | - | Label positioning |
| fullWidth | boolean | true | Span full container width |
| minRows | number | 3 | Minimum visible rows |
| maxRows | number | 8 | Maximum auto-grow rows |
| disableAutosize | boolean | false | Disable auto-resize |
| cacheMeasurements | boolean | false | Cache height calculations |
| isDisabled | boolean | false | Disabled state |
| isReadOnly | boolean | false | Read-only state |
| isRequired | boolean | false | Required field |
| isInvalid | boolean | false | Invalid/error state |
| isClearable | boolean | false | Show clear button |
| disableAnimation | boolean | false | Disable animations |
| validate | function | - | Custom validation function |
| validationBehavior | "native" \| "aria" | "aria" | Validation method |
| startContent | ReactNode | - | Left-side content slot |
| endContent | ReactNode | - | Right-side content slot |
| classNames | object | - | Custom classes for slots |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| onChange | (event) | Native change event |
| onValueChange | (value: string) | Value change callback |
| onClear | () | Clear button clicked |
| onHeightChange | (height, meta) | Height recalculated |

### Data Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| data-invalid | boolean | Invalid state |
| data-required | boolean | Required state |
| data-readonly | boolean | Read-only state |
| data-disabled | boolean | Disabled state |
| data-hover | boolean | Hover state |
| data-focus | boolean | Focus state |
| data-focus-visible | boolean | Keyboard focus state |

## Notable Features

- **Auto-Resize by Default**: Intelligent height adjustment based on content with configurable constraints
- **Rich Validation System**: Supports both native HTML validation and ARIA-based validation with custom functions
- **Comprehensive State Management**: Full support for controlled/uncontrolled patterns
- **Slot-Based Architecture**: Extensive customization through slot-based styling system
- **Accessibility First**: Built on React Aria with full ARIA support and keyboard navigation
- **Form Library Integration**: Works seamlessly with React Hook Form, Formik, and other form libraries
- **Server Component Support**: Next.js Server Component compatible
- **Animation Control**: Framer Motion powered animations that can be disabled
- **Flexible Label Positioning**: Three label placement options (inside, outside, outside-left)
- **Clear Button**: Optional clear functionality with callback support
- **Theme Integration**: Full HeroUI theme system support with color and variant options
- **TypeScript First**: Comprehensive TypeScript definitions included
- **Performance Optimized**: Height calculation caching for large text blocks
- **Data Attributes**: Extensive data attributes for precise CSS targeting

## Research Notes

- Documentation is comprehensive and well-structured with clear API reference
- Strong focus on accessibility with React Aria foundation
- Auto-resize is a core feature with sophisticated configuration options
- The component provides excellent form integration patterns
- Slot-based architecture enables deep customization without CSS conflicts
- Clear separation between visual variants and semantic colors
- Data attributes provide clean separation of concerns for styling
- The component balances simplicity with powerful features
- Validation system is flexible supporting both HTML and ARIA approaches
- Height change callback enables advanced use cases (e.g., dynamic layout adjustments)
- Part of the broader HeroUI/NextUI v2 ecosystem
- Built on react-textarea-autosize for reliable auto-grow behavior
- Animation system can be completely disabled for performance-critical scenarios
- Clear button pattern follows common UX conventions
- Label placement options accommodate different layout requirements
- The component maintains native textarea accessibility while enhancing UX
