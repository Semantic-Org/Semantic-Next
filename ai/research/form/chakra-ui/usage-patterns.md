# Chakra UI - FormControl Component (v2) / Field Component (v3)

## Component Overview

The FormControl component (v2) and Field component (v3) in Chakra UI are context-providing wrappers that manage state for form elements. They distribute properties like `isInvalid`, `isDisabled`, `isRequired`, and `isReadOnly` to child components, ensuring consistent validation and accessibility across form inputs. These components serve as the foundation for building accessible, well-structured forms by automatically managing ARIA attributes, label associations, error messages, and helper text.

**Key Features:**
- Context-based state management for form fields
- Automatic ARIA attribute management for accessibility
- Cascading props to child form elements
- Built-in support for validation states
- Integrated error and helper text display
- Automatic label-to-input associations

---

## Core Patterns

### Basic Form Field Pattern

The most fundamental pattern: a labeled input with helper text.

```jsx
import { FormControl, FormLabel, Input, FormHelperText } from '@chakra-ui/react'

function BasicFormField() {
  return (
    <FormControl>
      <FormLabel>Email address</FormLabel>
      <Input type='email' />
      <FormHelperText>We'll never share your email.</FormHelperText>
    </FormControl>
  )
}
```

### Validation Pattern

Form field with error state and error message display.

```jsx
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react'
import { useState } from 'react'

function ValidatedFormField() {
  const [input, setInput] = useState('')
  const isError = input === ''

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Email</FormLabel>
      <Input
        type='email'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {!isError ? (
        <FormHelperText>Enter your email address</FormHelperText>
      ) : (
        <FormErrorMessage>Email is required.</FormErrorMessage>
      )}
    </FormControl>
  )
}
```

### Required Field Pattern

Marking fields as required with automatic indicator display.

```jsx
function RequiredFormField() {
  return (
    <FormControl isRequired>
      <FormLabel>First name</FormLabel>
      <Input placeholder='First name' />
    </FormControl>
  )
}
```

### Disabled Field Pattern

Disabling an entire form control and all its children.

```jsx
function DisabledFormField() {
  return (
    <FormControl isDisabled>
      <FormLabel>Username</FormLabel>
      <Input placeholder='Cannot edit' />
      <FormHelperText>This field is currently disabled</FormHelperText>
    </FormControl>
  )
}
```

### Read-Only Field Pattern

Making a form control read-only while preserving visual clarity.

```jsx
function ReadOnlyFormField() {
  return (
    <FormControl isReadOnly>
      <FormLabel>Account Type</FormLabel>
      <Input value='Premium' />
      <FormHelperText>Your account type cannot be changed</FormHelperText>
    </FormControl>
  )
}
```

---

## Props & Configuration

### FormControl Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDisabled` | `boolean` | `false` | Disables all form elements; adds `data-disabled` attribute to label |
| `isInvalid` | `boolean` | `false` | Marks field as invalid; sets `aria-invalid` on input and shows error messages |
| `isRequired` | `boolean` | `false` | Marks field as required; shows indicator on label, sets `aria-required` on input |
| `isReadOnly` | `boolean` | `false` | Makes form control read-only; prevents editing while maintaining accessibility |
| `label` | `string` | — | Helper text for form sections (alternative to FormLabel component) |
| `id` | `string` | auto-generated | Custom ID for the form control; cascades to inputs and labels |

### FormLabel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | auto-linked | Explicitly set the `for` attribute; automatically linked to child input if not provided |
| `requiredIndicator` | `ReactNode` | red asterisk (`*`) | Custom element to display for required fields |
| `optionalIndicator` | `ReactNode` | — | Custom element to display for optional fields |

### FormHelperText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | — | — | Inherits standard box styling props for customization |

### FormErrorMessage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI box props | — | — | Inherits standard box styling props for customization |

**Note:** FormErrorMessage only renders when `isInvalid` is explicitly `true` on the parent FormControl.

### FormErrorIcon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| All Chakra UI icon props | — | — | Inherits standard icon props; automatically shown in error messages |

---

## Sub-components

### FormLabel

Renders as an HTML `<label>` element with automatic `htmlFor` binding to child inputs.

**Features:**
- Automatic association with form inputs
- Responds to parent FormControl state with style props (`_disabled`, `_focus`, `_invalid`)
- Displays required/optional indicators
- Semantic HTML for accessibility

```jsx
<FormControl isRequired>
  <FormLabel>Email address</FormLabel>
  <Input type='email' />
</FormControl>
```

### FormHelperText

Displays supplementary information about the form field below the input.

**Features:**
- Extends `aria-describedby` references on associated inputs
- Provides context and guidance for users
- Conditionally renderable based on form state

```jsx
<FormControl>
  <FormLabel>Password</FormLabel>
  <Input type='password' />
  <FormHelperText>Must be at least 8 characters long</FormHelperText>
</FormControl>
```

### FormErrorMessage

Shows validation error messages only when `isInvalid` is `true`.

**Features:**
- Automatic visibility control based on `isInvalid` prop
- Adds `aria-describedby` and `aria-invalid` attributes to inputs
- Can include FormErrorIcon for visual error indication
- Prevents unintended display when form is valid

```jsx
<FormControl isInvalid={hasError}>
  <FormLabel>Username</FormLabel>
  <Input value={username} onChange={handleChange} />
  <FormErrorMessage>Username is already taken</FormErrorMessage>
</FormControl>
```

### FormErrorIcon

A visual icon indicator for error states, automatically included in error messages.

```jsx
<FormControl isInvalid={isError}>
  <FormLabel>Email</FormLabel>
  <Input type='email' />
  <FormErrorMessage>
    <FormErrorIcon />
    Invalid email format
  </FormErrorMessage>
</FormControl>
```

---

## Validation Patterns

### Basic Client-Side Validation

Simple validation using component state.

```jsx
function ClientSideValidation() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  const isInvalid = touched && email === ''

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>Email</FormLabel>
      <Input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      <FormErrorMessage>Email is required</FormErrorMessage>
    </FormControl>
  )
}
```

### Complex Field Validation

Validation with multiple error conditions.

```jsx
function ComplexValidation() {
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  const getError = () => {
    if (!touched) return null
    if (password.length === 0) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
    return null
  }

  const error = getError()

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Password</FormLabel>
      <Input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        <FormHelperText>Use at least 8 characters with uppercase letters</FormHelperText>
      )}
    </FormControl>
  )
}
```

### Async Validation Pattern

Validation that requires server-side checks.

```jsx
function AsyncValidation() {
  const [username, setUsername] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [touched, setTouched] = useState(false)

  const checkUsername = async (value) => {
    setIsChecking(true)
    // Simulate API call
    const available = await fetch(`/api/check-username?username=${value}`)
      .then(res => res.json())
    setIsAvailable(available)
    setIsChecking(false)
  }

  const handleBlur = () => {
    setTouched(true)
    if (username) checkUsername(username)
  }

  const isInvalid = touched && !isAvailable

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>Username</FormLabel>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleBlur}
      />
      {isChecking && <FormHelperText>Checking availability...</FormHelperText>}
      {isInvalid && <FormErrorMessage>Username is already taken</FormErrorMessage>}
      {!isChecking && isAvailable && touched && (
        <FormHelperText>Username is available!</FormHelperText>
      )}
    </FormControl>
  )
}
```

### Formik Integration

Using FormControl with Formik for comprehensive form management.

```jsx
import { Formik, Form, Field } from 'formik'
import { FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react'

function FormikIntegration() {
  function validateName(value) {
    if (!value) return 'Name is required'
    if (value.length < 3) return 'Name must be at least 3 characters'
    return undefined
  }

  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
      }}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.name && form.touched.name}
                isRequired
              >
                <FormLabel>First name</FormLabel>
                <Input {...field} placeholder='Enter your name' />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme='teal'
            isLoading={props.isSubmitting}
            type='submit'
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}
```

---

## Layout Patterns

### Vertical Stack Pattern

Standard vertical form layout with stacked fields.

```jsx
import { VStack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'

function VerticalForm() {
  return (
    <VStack spacing={4} align='stretch'>
      <FormControl isRequired>
        <FormLabel>First Name</FormLabel>
        <Input placeholder='First name' />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Last Name</FormLabel>
        <Input placeholder='Last name' />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type='email' placeholder='email@example.com' />
      </FormControl>

      <Button colorScheme='blue' type='submit'>Submit</Button>
    </VStack>
  )
}
```

### Horizontal/Inline Pattern

Inline form fields for compact layouts.

```jsx
import { HStack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react'

function InlineForm() {
  return (
    <HStack spacing={4}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Your name' />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type='email' placeholder='email@example.com' />
      </FormControl>

      <Button colorScheme='blue' alignSelf='flex-end'>
        Subscribe
      </Button>
    </HStack>
  )
}
```

### Grid Layout Pattern

Multi-column form layout using Grid.

```jsx
import { Grid, GridItem, FormControl, FormLabel, Input } from '@chakra-ui/react'

function GridForm() {
  return (
    <Grid templateColumns='repeat(2, 1fr)' gap={6}>
      <GridItem>
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input placeholder='First name' />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input placeholder='Last name' />
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type='email' placeholder='email@example.com' />
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input placeholder='Street address' />
        </FormControl>
      </GridItem>
    </Grid>
  )
}
```

### Fieldset Pattern

Using FormControl as a fieldset for grouped controls.

```jsx
import { FormControl, FormLabel, RadioGroup, Radio, HStack } from '@chakra-ui/react'

function FieldsetPattern() {
  return (
    <FormControl as='fieldset' isRequired>
      <FormLabel as='legend'>Favorite Character</FormLabel>
      <RadioGroup defaultValue='Itachi'>
        <HStack spacing={6}>
          <Radio value='Sasuke'>Sasuke</Radio>
          <Radio value='Itachi'>Itachi</Radio>
          <Radio value='Naruto'>Naruto</Radio>
        </HStack>
      </RadioGroup>
    </FormControl>
  )
}
```

---

## State Management

### State Cascading

Props passed to FormControl automatically cascade to all child form elements.

```jsx
// All inputs within this FormControl are disabled
<FormControl isDisabled>
  <FormLabel>Username</FormLabel>
  <Input placeholder='Disabled input' />
  <FormHelperText>This entire field is disabled</FormHelperText>
</FormControl>

// All inputs are marked as required
<FormControl isRequired>
  <FormLabel>Email</FormLabel>
  <Input type='email' />
</FormControl>

// All inputs inherit the invalid state
<FormControl isInvalid={hasErrors}>
  <FormLabel>Password</FormLabel>
  <Input type='password' />
  <FormErrorMessage>Password is incorrect</FormErrorMessage>
</FormControl>
```

### Combined States

Multiple states can be combined on a single FormControl.

```jsx
function CombinedStates() {
  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormLabel>Email</FormLabel>
      <Input type='email' />
      <FormErrorMessage>Invalid email format</FormErrorMessage>
    </FormControl>
  )
}
```

### Dynamic State Management

Controlling FormControl state dynamically based on form logic.

```jsx
function DynamicStateManagement() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    acceptTerms: false
  })
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})

  const validate = (name, value) => {
    switch (name) {
      case 'username':
        return value.length < 3 ? 'Username must be at least 3 characters' : ''
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
  }

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  return (
    <VStack spacing={4}>
      <FormControl
        isRequired
        isInvalid={touched.username && errors.username}
      >
        <FormLabel>Username</FormLabel>
        <Input
          name='username'
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormErrorMessage>{errors.username}</FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={touched.email && errors.email}
      >
        <FormLabel>Email</FormLabel>
        <Input
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}
```

---

## Accessibility

### Automatic ARIA Management

FormControl automatically manages ARIA attributes for accessibility:

**Generated ARIA Attributes:**
- `aria-invalid="true"` - Set on inputs when `isInvalid` is true
- `aria-required="true"` - Set on inputs when `isRequired` is true
- `aria-describedby` - Links inputs to FormHelperText and FormErrorMessage
- `aria-readonly="true"` - Set on inputs when `isReadOnly` is true

```jsx
// This FormControl automatically generates:
// - aria-invalid="true" on the input
// - aria-describedby="email-error" linking to error message
<FormControl isInvalid={true} id='email'>
  <FormLabel>Email</FormLabel>
  <Input type='email' />
  <FormErrorMessage id='email-error'>Invalid email</FormErrorMessage>
</FormControl>
```

### ID Management

IDs passed to FormControl cascade to inputs and labels automatically:

```jsx
// Custom ID cascades to input and label
<FormControl id='custom-email-field'>
  <FormLabel>Email</FormLabel>  {/* htmlFor='custom-email-field' */}
  <Input type='email' />         {/* id='custom-email-field' */}
</FormControl>

// Override with explicit IDs
<FormControl>
  <FormLabel htmlFor='specific-input-id'>Email</FormLabel>
  <Input id='specific-input-id' type='email' />
</FormControl>
```

### Label Awareness

FormLabel responds to input state with contextual styling through Chakra's style props:

- `_disabled` - Applied when FormControl has `isDisabled`
- `_focus` - Applied when associated input has focus
- `_invalid` - Applied when FormControl has `isInvalid`

```jsx
<FormControl isInvalid={hasError}>
  <FormLabel
    _invalid={{ color: 'red.500', fontWeight: 'bold' }}
  >
    Email
  </FormLabel>
  <Input type='email' />
</FormControl>
```

### Screen Reader Support

FormControl ensures proper screen reader announcements:

```jsx
function AccessibleForm() {
  const [email, setEmail] = useState('')
  const isInvalid = email && !/\S+@\S+\.\S+/.test(email)

  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormLabel>Email Address</FormLabel>
      <Input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label='Email address input'
      />
      <FormHelperText>
        We'll use this to contact you about your order
      </FormHelperText>
      <FormErrorMessage>
        Please enter a valid email address
      </FormErrorMessage>
    </FormControl>
  )
}
```

**Screen Reader Announcements:**
- "Email Address, required, edit text" (on focus)
- "We'll use this to contact you about your order" (helper text read)
- "Please enter a valid email address, invalid data" (error announced when invalid)

### Required Field Indicators

Customizing required field indicators for accessibility:

```jsx
import { Box } from '@chakra-ui/react'

// Custom required indicator
<FormControl isRequired>
  <FormLabel
    requiredIndicator={
      <Box as='span' color='red.500' aria-label='required'>
        (required)
      </Box>
    }
  >
    Email
  </FormLabel>
  <Input type='email' />
</FormControl>

// Optional field indicator
<FormControl>
  <FormLabel
    optionalIndicator={
      <Box as='span' color='gray.500' fontSize='sm'>
        (optional)
      </Box>
    }
  >
    Phone Number
  </FormLabel>
  <Input type='tel' />
</FormControl>
```

---

## Version Notes

### v2 (Current Documentation Source)

**Component Name:** FormControl, FormLabel, FormHelperText, FormErrorMessage, FormErrorIcon

**Key Features:**
- Context-based prop distribution
- Automatic ID management
- ARIA attribute generation
- Label awareness of input state
- Error message visibility control
- Integration with Formik and other form libraries

**Improvements from v1:**
- Enhanced accessibility through automatic ID binding
- Improved label awareness of input state
- Stricter error message visibility control
- Support for custom ID overrides via `htmlFor` and `id` props

### v3 (Field Component)

**Component Name:** Field (replaces FormControl)

**Migration Notes:**
- FormControl is replaced by Field component in v3
- Likely follows similar composition pattern (Field.Root, Field.Label, Field.HelperText, Field.ErrorText)
- Built on Ark UI foundation for enhanced composition
- Expected to maintain similar API surface with improved TypeScript support
- Documentation indicates similar feature set: labels, help text, error messages

**Note:** Complete v3 Field component documentation was not fully accessible at the time of research. The core concepts and patterns from v2 FormControl are expected to translate to v3 Field with potential API refinements.

---

## Framework-Specific Features

### Chakra UI Integration

FormControl is deeply integrated with Chakra UI's ecosystem:

**Automatic Styling Integration:**
```jsx
// Uses Chakra's design tokens and theme
<FormControl>
  <FormLabel>Email</FormLabel>
  <Input />  {/* Inherits theme styles automatically */}
</FormControl>
```

**Style Props Support:**
```jsx
// All Chakra style props work on FormControl and sub-components
<FormControl
  mb={4}
  p={4}
  bg='gray.50'
  borderRadius='md'
>
  <FormLabel fontSize='lg' fontWeight='bold'>
    Email
  </FormLabel>
  <Input />
</FormControl>
```

**Theme Customization:**
```jsx
// Can be customized via Chakra's theme system
const theme = extendTheme({
  components: {
    FormLabel: {
      baseStyle: {
        fontWeight: 'semibold',
        color: 'gray.700'
      }
    },
    FormError: {
      baseStyle: {
        text: {
          fontSize: 'sm',
          color: 'red.600'
        }
      }
    }
  }
})
```

### Integration with Chakra Form Elements

Works seamlessly with all Chakra UI form components:

**Input Integration:**
```jsx
<FormControl>
  <FormLabel>Text Input</FormLabel>
  <Input placeholder='Enter text' />
</FormControl>
```

**Select Integration:**
```jsx
<FormControl>
  <FormLabel>Country</FormLabel>
  <Select placeholder='Select country'>
    <option>United States</option>
    <option>Canada</option>
    <option>United Kingdom</option>
  </Select>
</FormControl>
```

**NumberInput Integration:**
```jsx
<FormControl>
  <FormLabel>Amount</FormLabel>
  <NumberInput max={100} min={0}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
</FormControl>
```

**Textarea Integration:**
```jsx
<FormControl>
  <FormLabel>Description</FormLabel>
  <Textarea placeholder='Enter description' />
</FormControl>
```

**Checkbox Integration:**
```jsx
<FormControl>
  <Checkbox>Accept terms and conditions</Checkbox>
  <FormHelperText>You must accept to continue</FormHelperText>
</FormControl>
```

**Radio Integration:**
```jsx
<FormControl as='fieldset'>
  <FormLabel as='legend'>Select Option</FormLabel>
  <RadioGroup defaultValue='1'>
    <VStack align='start'>
      <Radio value='1'>Option 1</Radio>
      <Radio value='2'>Option 2</Radio>
      <Radio value='3'>Option 3</Radio>
    </VStack>
  </RadioGroup>
</FormControl>
```

**Switch Integration:**
```jsx
<FormControl display='flex' alignItems='center'>
  <FormLabel mb='0'>Enable notifications</FormLabel>
  <Switch />
</FormControl>
```

### Ark UI Foundation (v3)

The v3 Field component is built on Ark UI, providing:
- Enhanced composition patterns
- Better TypeScript inference
- Improved accessibility primitives
- Cross-framework compatibility (React, Vue, Solid)
- Headless UI foundation for maximum flexibility

---

## Implementation Notes

### Best Practices

1. **Always Use FormControl for Inputs:** Wrap all form inputs in FormControl for consistent behavior and accessibility.

2. **Conditional Error Messages:** Only show FormErrorMessage when validation has been triggered (e.g., on blur or after submit attempt).

3. **Helpful Helper Text:** Use FormHelperText to provide clear guidance on expected input format or requirements.

4. **Custom IDs When Needed:** Provide custom IDs when you need to reference form fields externally or for testing.

5. **State Cascading:** Leverage FormControl's state cascading to manage groups of related inputs efficiently.

### Common Pitfalls

**❌ Pitfall 1: Always Showing Error Messages**
```jsx
// BAD: Error always renders, even when valid
<FormControl>
  <FormLabel>Email</FormLabel>
  <Input />
  <FormErrorMessage>Invalid email</FormErrorMessage>
</FormControl>
```

**✅ Solution: Use isInvalid Prop**
```jsx
// GOOD: Error only shows when actually invalid
<FormControl isInvalid={hasError}>
  <FormLabel>Email</FormLabel>
  <Input />
  <FormErrorMessage>Invalid email</FormErrorMessage>
</FormControl>
```

**❌ Pitfall 2: Missing Required Indicators**
```jsx
// BAD: No visual indication that field is required
<FormControl>
  <FormLabel>Email</FormLabel>
  <Input required />
</FormControl>
```

**✅ Solution: Use isRequired Prop**
```jsx
// GOOD: Automatic required indicator
<FormControl isRequired>
  <FormLabel>Email</FormLabel>
  <Input />
</FormControl>
```

**❌ Pitfall 3: Manual ARIA Management**
```jsx
// BAD: Manually managing ARIA attributes
<FormControl>
  <FormLabel htmlFor='email'>Email</FormLabel>
  <Input
    id='email'
    aria-invalid={hasError}
    aria-describedby='email-error'
  />
  <FormErrorMessage id='email-error'>Error</FormErrorMessage>
</FormControl>
```

**✅ Solution: Let FormControl Manage ARIA**
```jsx
// GOOD: Automatic ARIA management
<FormControl id='email' isInvalid={hasError}>
  <FormLabel>Email</FormLabel>
  <Input />
  <FormErrorMessage>Error</FormErrorMessage>
</FormControl>
```

### Performance Considerations

1. **Memoize Validation Functions:** Use `useCallback` for validation functions to prevent unnecessary re-renders.

```jsx
const validateEmail = useCallback((value) => {
  return /\S+@\S+\.\S+/.test(value)
}, [])
```

2. **Debounce Async Validation:** Debounce async validation to reduce API calls.

```jsx
const debouncedValidate = useMemo(
  () => debounce(validateUsername, 500),
  []
)
```

3. **Controlled vs Uncontrolled:** Consider using uncontrolled inputs with refs for large forms to reduce re-renders.

```jsx
function UncontrolledForm() {
  const emailRef = useRef()
  const [isInvalid, setIsInvalid] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = emailRef.current.value
    setIsInvalid(!email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={isInvalid}>
        <FormLabel>Email</FormLabel>
        <Input ref={emailRef} type='email' />
        <FormErrorMessage>Email is required</FormErrorMessage>
      </FormControl>
    </form>
  )
}
```

### Testing Considerations

1. **Query by Label:** Use accessible queries in tests.

```jsx
// Jest + React Testing Library
const emailInput = screen.getByLabelText('Email')
expect(emailInput).toHaveAttribute('aria-required', 'true')
```

2. **Check ARIA Attributes:** Verify accessibility attributes are properly set.

```jsx
const input = screen.getByRole('textbox', { name: 'Email' })
expect(input).toHaveAttribute('aria-invalid', 'true')
expect(input).toHaveAttribute('aria-describedby')
```

3. **Test Error Display:** Ensure error messages appear correctly.

```jsx
fireEvent.change(emailInput, { target: { value: '' } })
fireEvent.blur(emailInput)
expect(screen.getByText('Email is required')).toBeInTheDocument()
```

---

## Related Components

- **Input** - Text input fields that work within FormControl
- **Select** - Dropdown selection integrated with FormControl
- **Textarea** - Multi-line text input with FormControl support
- **NumberInput** - Numeric input with stepper controls
- **Checkbox** - Binary selection with label integration
- **Radio** - Single selection from multiple options
- **Switch** - Toggle control for binary states
- **PinInput** - Specialized input for PIN/OTP codes
- **Editable** - Inline editing component with form integration

---

**Research completed:** 2025-11-06
**Component:** FormControl (v2) / Field (v3)
**Framework:** Chakra UI
**Documentation Source:** https://v2.chakra-ui.com/docs/components/form-control
**Note:** v3 Field component documentation was not fully accessible; patterns based on v2 FormControl with noted v3 migration context.
