# Chakra UI - Textarea Usage Patterns

## Component URL
- **v2**: https://v2.chakra-ui.com/docs/components/textarea (✅ Working)
- **v3**: https://www.chakra-ui.com/docs/components/textarea (✅ Working, but limited detail in WebFetch)

**Status**: Both v2 and v3 documentation accessible. v2 docs are more comprehensive for prop details.

## Documentation Quality
**Excellent** - Clear, well-structured documentation with practical examples, comprehensive prop tables, and theming information. Examples demonstrate basic usage, controlled components, resize patterns, state variants, and extensive theming customization.

## Component Definition
- **Core purpose**: Enables multi-line text input for forms and user interfaces
- **Mental model**: An enhanced textarea element with built-in accessibility, styling system integration, and form control capabilities
- **Semantic meaning**: A form control for collecting multi-line text input from users, with built-in validation states and accessibility features

## Component Overview

### Architecture
- **v2**: Built as an extension of the Input component, inheriting its foundation while adding textarea-specific functionality
- **v3**: Part of Chakra's component system with recipe-based theming approach
- **Package**: Part of `@chakra-ui/react`
- **Component Type**: Single-part component (all styling applies to one root element)

### Import
```jsx
import { Textarea } from '@chakra-ui/react'
```

## Core Patterns

### Basic Usage
```jsx
<Textarea placeholder='Here is a sample placeholder' />
```

### Controlled Component Pattern
```jsx
function Example() {
  const [value, setValue] = React.useState('')
  const handleInputChange = (e) => setValue(e.target.value)

  return (
    <>
      <Text mb='8px'>Value: {value}</Text>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder='Here is a sample placeholder'
        size='sm'
      />
    </>
  )
}
```

### Uncontrolled Pattern
```jsx
// Standard uncontrolled usage with defaultValue
<Textarea defaultValue='Initial content' />
```

## Props & Configuration

### Complete Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Controls the size of the textarea (height, padding, font size) |
| `variant` | `"outline" \| "filled" \| "flushed" \| "unstyled"` | `"outline"` | Visual style variant of the textarea |
| `colorScheme` | `"whiteAlpha" \| "blackAlpha" \| "gray" \| "red" \| "orange" \| "yellow" \| "green" \| "teal" \| "blue" \| "cyan" \| "purple" \| "pink"` | — | Visual color appearance scheme |
| `resize` | `"horizontal" \| "vertical" \| "none"` | — | Controls resize behavior of the textarea |
| `isDisabled` | `boolean` | `false` | Disables the textarea and affects label styling |
| `isInvalid` | `boolean` | `false` | Marks textarea as invalid; sets `aria-invalid` |
| `isReadOnly` | `boolean` | `false` | Sets textarea to read-only mode |
| `isRequired` | `boolean` | `false` | Marks textarea as required; sets `aria-required` |
| `errorBorderColor` | `string` | — | Border color when textarea is in invalid state |
| `focusBorderColor` | `string` | — | Border color when textarea is focused |
| `placeholder` | `string` | — | Placeholder text shown when textarea is empty |
| `value` | `string` | — | Value for controlled component |
| `defaultValue` | `string` | — | Default value for uncontrolled component |
| `onChange` | `(event: ChangeEvent) => void` | — | Change event handler |

### Additional Standard HTML Props
Supports all standard HTML textarea attributes including:
- `rows` - Number of visible text lines
- `cols` - Number of visible text columns
- `maxLength` - Maximum character count
- `minLength` - Minimum character count
- `autoFocus` - Automatically focus on mount
- `name` - Form field name
- `id` - Element identifier

## Visual Patterns

### Size Variants
Chakra UI provides four built-in sizes:

```jsx
// Extra small
<Textarea size='xs' placeholder='Extra small size' />

// Small
<Textarea size='sm' placeholder='Small size' />

// Medium (default)
<Textarea size='md' placeholder='Medium size' />

// Large
<Textarea size='lg' placeholder='Large size' />
```

**Size Characteristics**:
- `xs` - Minimal padding, smallest font size
- `sm` - Compact padding, smaller font size
- `md` - Standard padding and font size (default)
- `lg` - Generous padding, larger font size

### Style Variants

#### Outline Variant (Default)
```jsx
<Textarea variant='outline' placeholder='Outline style' />
```
- Border around the textarea
- Clear visual boundary
- Default variant

#### Filled Variant
```jsx
<Textarea variant='filled' placeholder='Filled style' />
```
- Background color fill
- No border (or subtle border)
- Modern appearance

#### Flushed Variant
```jsx
<Textarea variant='flushed' placeholder='Flushed style' />
```
- Bottom border only
- Minimal, clean appearance
- Good for inline editing

#### Unstyled Variant
```jsx
<Textarea variant='unstyled' placeholder='Unstyled' />
```
- No default styling
- Full control over appearance
- Useful for custom designs

### Color Schemes
```jsx
// Various color schemes
<Textarea colorScheme='red' placeholder='Red scheme' />
<Textarea colorScheme='blue' placeholder='Blue scheme' />
<Textarea colorScheme='green' placeholder='Green scheme' />
<Textarea colorScheme='purple' placeholder='Purple scheme' />
```

Available schemes: `whiteAlpha`, `blackAlpha`, `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`

## Behavioral Patterns

### Resize Control
The `resize` prop controls how users can resize the textarea:

```jsx
function ResizeExample() {
  const [resize, setResize] = React.useState('horizontal')

  return (
    <>
      <RadioGroup defaultValue={resize} onChange={setResize} mb={6}>
        <Stack direction='row' spacing={5}>
          <Radio value='horizontal'>Horizontal</Radio>
          <Radio value='vertical'>Vertical</Radio>
          <Radio value='none'>None</Radio>
        </Stack>
      </RadioGroup>

      <Textarea
        placeholder='Sample text'
        size='sm'
        resize={resize}
      />
    </>
  )
}
```

**Resize Options**:
- `"horizontal"` - Can resize width only
- `"vertical"` - Can resize height only
- `"none"` - No resizing allowed
- Default (unset) - Typically allows both directions (browser default)

### State Patterns

#### Disabled State
```jsx
<Textarea isDisabled placeholder='Disabled textarea' />
```
- Prevents user interaction
- Visual styling indicates disabled state
- Affects associated label styling in FormControl
- Does not submit with form data

#### Read-Only State
```jsx
<Textarea isReadOnly value='Read-only content' />
```
- Displays content but prevents editing
- Still focusable and selectable
- Submits with form data
- Useful for displaying non-editable information

#### Invalid State
```jsx
<Textarea isInvalid placeholder='Invalid textarea' />
```
- Shows error styling
- Sets `aria-invalid="true"`
- Typically used with validation feedback
- Red border or error color indication

#### Required State
```jsx
<Textarea isRequired placeholder='Required field' />
```
- Marks field as required
- Sets `aria-required="true"`
- Typically shown with asterisk in label (via FormControl)

### Focus State Customization
```jsx
<Textarea
  focusBorderColor='blue.500'
  placeholder='Custom focus color'
/>

<Textarea
  focusBorderColor='pink.400'
  errorBorderColor='red.300'
  placeholder='Custom border colors'
/>
```

## Content Patterns

### Placeholder Text
```jsx
<Textarea placeholder='Enter your comments here...' />
```

### Default Value (Uncontrolled)
```jsx
<Textarea defaultValue='Initial content here' />
```

### Controlled Value
```jsx
const [text, setText] = React.useState('')

<Textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

### Character Count
```jsx
function CharacterCount() {
  const [value, setValue] = React.useState('')
  const maxLength = 200

  return (
    <>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        placeholder='Type something...'
      />
      <Text fontSize='sm' color='gray.500'>
        {value.length} / {maxLength} characters
      </Text>
    </>
  )
}
```

## Form Integration Patterns

### With FormControl
```jsx
import { FormControl, FormLabel, FormHelperText, FormErrorMessage } from '@chakra-ui/react'

function FormExample() {
  const [input, setInput] = React.useState('')
  const isError = input === ''

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Comments</FormLabel>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Enter your comments'
      />
      {!isError ? (
        <FormHelperText>
          Enter any additional comments or feedback.
        </FormHelperText>
      ) : (
        <FormErrorMessage>Comments are required.</FormErrorMessage>
      )}
    </FormControl>
  )
}
```

### Form Submission
```jsx
function FormSubmit() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const message = formData.get('message')
    console.log(message)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Textarea name='message' placeholder='Your message' />
      <Button type='submit'>Submit</Button>
    </form>
  )
}
```

## Accessibility

### Built-in Accessibility Features
1. **ARIA Attributes**:
   - `aria-invalid` - Set automatically by `isInvalid` prop
   - `aria-required` - Set automatically by `isRequired` prop
   - Accepts additional ARIA attributes as props

2. **Keyboard Navigation**:
   - Standard textarea keyboard behavior
   - Tab to focus
   - Shift+Tab to focus previous
   - Text selection and editing shortcuts

3. **Screen Reader Support**:
   - Announces as "textarea" or "multi-line edit"
   - Required and invalid states announced
   - Label association via FormControl

4. **Focus Management**:
   - Visible focus indicator
   - Customizable focus colors
   - Auto-focus support via `autoFocus` prop

### Accessibility Best Practices
```jsx
// Always use FormLabel for accessible labels
<FormControl>
  <FormLabel htmlFor='description'>Description</FormLabel>
  <Textarea id='description' placeholder='Enter description' />
</FormControl>

// Provide helpful error messages
<FormControl isInvalid={hasError}>
  <FormLabel>Message</FormLabel>
  <Textarea />
  <FormErrorMessage>This field is required</FormErrorMessage>
</FormControl>

// Use helper text for additional guidance
<FormControl>
  <FormLabel>Feedback</FormLabel>
  <Textarea />
  <FormHelperText>Please be specific in your feedback</FormHelperText>
</FormControl>
```

## Theming & Customization

### Theme Structure
The Textarea is a **single-part component**, meaning all styles apply to one root element. This simplifies theming compared to multi-part components.

### Custom Size Definition
```javascript
import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

// Define custom XL size
const xl = defineStyle({
  fontSize: 'xl',
  px: '6',
  h: '16',
  borderRadius: 'md',
})

export const textareaTheme = defineStyleConfig({
  sizes: { xl },
})
```

### Custom Variant Definition
```javascript
import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

// Define brand primary variant
const brandPrimary = defineStyle({
  background: 'orange.500',
  color: 'white',
  fontFamily: 'serif',
  fontWeight: 'normal',

  // Dark mode support
  _dark: {
    background: 'orange.300',
    color: 'orange.800',
  }
})

export const textareaTheme = defineStyleConfig({
  variants: { brandPrimary },
})
```

### Setting Default Props
```javascript
import { defineStyleConfig } from '@chakra-ui/react'

export const textareaTheme = defineStyleConfig({
  defaultProps: {
    size: 'lg',
    variant: 'outline',
    colorScheme: 'brand',
  },
})
```

### Theme Integration
```javascript
import { extendTheme } from '@chakra-ui/react'
import { textareaTheme } from './components/textarea'

export const theme = extendTheme({
  components: {
    Textarea: textareaTheme,
  },
})

// Use in app
<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>
```

### Using Custom Theme Tokens
```jsx
// Apply custom size
<Textarea size='xl' />

// Apply custom variant
<Textarea variant='brandPrimary' />
```

### Inline Style Customization
```jsx
// Direct style props
<Textarea
  bg='gray.50'
  borderColor='blue.300'
  _hover={{ borderColor: 'blue.400' }}
  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
  fontSize='lg'
  fontWeight='medium'
  borderRadius='xl'
/>
```

## Version Notes (v2 vs v3)

### Chakra UI v2
- **Architecture**: Extends Input component
- **Theming**: Component style configs with `defineStyleConfig`
- **Documentation**: Comprehensive prop tables and examples
- **Stability**: Mature, well-documented API

### Chakra UI v3
- **Architecture**: Recipe-based theming system
- **Styling**: CSS-in-JS with custom properties (`--chakra-colors-*`)
- **Integration**: Enhanced design system integration
- **Features**: Core functionality remains similar, but theming approach evolved
- **Source**: Component available in packages structure

### Migration Considerations
- Core props (`size`, `variant`, `isDisabled`, etc.) remain consistent
- Theming syntax may differ (v2 uses `defineStyleConfig`, v3 uses recipe system)
- Color mode handling integrated into CSS variables in v3
- API surface area largely unchanged for common use cases

### Ark UI Foundation
- **Note**: While v3 appears to integrate with Chakra's recipe system, the Textarea component doesn't have a direct Ark UI equivalent (404 on ark-ui.com)
- Other form components in Chakra v3 may use Ark UI primitives, but Textarea appears to be a native implementation

## Framework-Specific Features

### 1. Composition with Input Foundation
Textarea shares the Input component's foundation, inheriting:
- Common props and patterns
- Styling variants
- Form integration capabilities
- Accessibility features

### 2. Theme-First Design Philosophy
- Customization primarily through theme configuration
- Reduces need for inline style props
- Consistent with Chakra's design system approach
- Easy to apply brand styles globally

### 3. Single-Part Simplicity
- All styling applies to one root element
- Simpler mental model than multi-part components
- Easier to customize and theme
- Reduced CSS specificity conflicts

### 4. Chakra Style Props System
Full access to Chakra's style props:
```jsx
<Textarea
  mt={4}           // margin-top
  mb={2}           // margin-bottom
  p={3}            // padding
  w='full'         // width: 100%
  maxW='500px'     // max-width
  bg='white'       // background
  borderRadius='md' // border-radius
/>
```

### 5. Color Mode Support
Automatic dark mode integration:
```jsx
// Define styles for both modes in theme
const customVariant = defineStyle({
  bg: 'white',
  color: 'gray.800',
  _dark: {
    bg: 'gray.800',
    color: 'white',
  }
})
```

### 6. Responsive Design Support
```jsx
<Textarea
  size={['sm', 'md', 'lg']}  // Responsive sizes
  fontSize={['sm', 'md', 'lg', 'xl']}  // Responsive font
  width={['100%', '80%', '60%']}  // Responsive width
/>
```

## Implementation Notes

### Semantic HTML
- Renders as native `<textarea>` element
- Maintains semantic meaning for accessibility
- Works with browser form validation
- Compatible with form submission

### CSS-Based Styling
- Uses CSS borders, backgrounds, and padding
- Performant rendering
- Respects system fonts and conventions
- Easy to customize with CSS-in-JS

### State Management
- Supports both controlled and uncontrolled patterns
- React state integration for controlled components
- Standard HTML form integration for uncontrolled
- Compatible with form libraries (React Hook Form, Formik, etc.)

### Performance Considerations
- Single-part component minimizes DOM complexity
- No wrapper elements unless composed with FormControl
- Efficient re-rendering with controlled values
- No auto-resize feature (manual implementation needed)

## Notable Features

### 1. Comprehensive Size System
Four built-in sizes with consistent scaling:
- Heights, padding, and font sizes scale together
- Easy to add custom sizes via theme
- Responsive size support

### 2. Flexible Resize Control
Granular control over resize behavior:
- Horizontal, vertical, or none
- Can be controlled dynamically
- Respects user preferences when unset

### 3. Rich Variant System
Multiple visual styles out of the box:
- Outline, filled, flushed, unstyled
- Easy to add custom variants
- Consistent with Input component

### 4. State Props Pattern
Consistent boolean props for states:
- `isDisabled`, `isInvalid`, `isReadOnly`, `isRequired`
- Clear, readable API
- Automatic ARIA attribute management

### 5. Extensive Color Scheme Support
Twelve color schemes built-in:
- Consistent with Chakra's color system
- Automatic dark mode adaptation
- Custom schemes via theme

### 6. FormControl Integration
Seamless integration with Chakra's form system:
- Automatic label association
- Error message display
- Helper text support
- Visual state propagation

## Patterns to Consider for Semantic UI

### Strengths to Adopt

1. **Clear Size System**
   - Four intuitive sizes (xs, sm, md, lg)
   - Consistent scaling across properties
   - Easy to extend with custom sizes

2. **Resize Control API**
   - Simple prop with clear values
   - Covers common use cases
   - Dynamically controllable

3. **State Props Pattern**
   - Boolean `is*` prefix for states
   - Self-documenting API
   - Automatic accessibility handling

4. **Single-Part Simplicity**
   - Easier to theme and customize
   - Reduces complexity
   - Better performance

5. **Variant System**
   - Clear visual distinctions
   - Named variants are discoverable
   - Easy to add custom variants

6. **Color Scheme Pattern**
   - Standardized color options
   - Consistent with design system
   - Dark mode built-in

### Potential Improvements

1. **Auto-Resize Feature**
   - Many modern textareas grow with content
   - Could provide `autoResize` prop
   - Useful for dynamic UIs

2. **Character Count Built-in**
   - Common pattern in forms
   - Could integrate with `maxLength`
   - Reduce boilerplate for developers

3. **Validation Integration**
   - Built-in validation patterns
   - RegEx or custom validators
   - Real-time feedback

4. **Enhanced Placeholder**
   - Animated placeholders
   - Multi-line placeholder support
   - Better visual hierarchy

5. **Focus State Enhancement**
   - More granular focus customization
   - Focus-within patterns
   - Keyboard navigation hints

### Questions for Semantic UI Design

1. **Auto-resize behavior**?
   - Should Textarea auto-grow with content?
   - Optional vs. default behavior?
   - Performance considerations?

2. **Character counting**?
   - Built-in character counter component?
   - Word count option?
   - Visual indicator (progress bar, text)?

3. **Validation patterns**?
   - Built-in validators?
   - Pattern matching support?
   - Real-time vs. on-blur validation?

4. **Resize control**?
   - Should we match Chakra's API?
   - Additional options (both, auto)?
   - Visual resize handle customization?

5. **Multi-part vs. Single-part**?
   - Should Textarea be single-part like Chakra?
   - Or composite with optional character counter, action buttons?
   - Trade-offs in flexibility vs. simplicity?

6. **Form integration**?
   - How deeply integrate with form system?
   - Built-in error display?
   - Label association patterns?

7. **Composition patterns**?
   - Should we support action buttons (clear, copy)?
   - Prefix/suffix content?
   - Toolbar integration for rich editing?

## Research Notes

### Documentation Observations
- v2 documentation is more detailed for prop specifications
- v3 documentation emphasizes theming and recipe system
- Both versions maintain similar core API
- Migration path appears smooth for common use cases

### Framework Philosophy
Chakra UI demonstrates:
- **Consistency**: Textarea follows same patterns as Input
- **Simplicity**: Single-part component reduces complexity
- **Flexibility**: Rich theming system for customization
- **Accessibility**: Built-in ARIA and semantic HTML
- **Developer Experience**: Intuitive props and clear naming

### Comparison to Other Frameworks
- **More minimal** than frameworks with built-in character counters or auto-resize
- **More flexible** in theming than utility-first approaches
- **More opinionated** about visual styles than headless libraries
- **Better integrated** with design system than standalone components

### Implementation Patterns
- Native textarea element foundation
- No JavaScript for core functionality
- CSS-driven visual states
- React for state management in controlled mode
- Theme-based customization preferred over inline styles
