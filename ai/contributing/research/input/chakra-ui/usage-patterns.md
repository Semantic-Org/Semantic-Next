# Chakra UI Input - Usage Patterns

## Component Overview

The Chakra UI Input component is a flexible, accessible form input element used for capturing single-line text input from users. It provides a complete solution for form input needs with built-in support for various states (disabled, invalid, readonly), visual variants, sizing options, and rich composition patterns through companion components like InputGroup, InputAddon, and InputElement. The component is designed with accessibility as a priority and supports comprehensive theming and customization.

**Component Type**: Form Control / Input Field
**Base Element**: HTML `<input>` element
**Package**: `@chakra-ui/react` or `@chakra-ui/input`
**Documentation URL**: https://v2.chakra-ui.com/docs/components/input

---

## Basic Usage

### Simple Input
```jsx
import { Input } from '@chakra-ui/react'

// Minimal input
<Input placeholder='Enter your name' />

// Input with type
<Input type='email' placeholder='your@email.com' />

// Disabled input
<Input placeholder='Disabled input' isDisabled />

// Readonly input
<Input value='Read-only value' isReadOnly />
```

### Input with Labels (using Field component)
```jsx
import { Input, Field } from '@chakra-ui/react'

<Field label='Email Address' required>
  <Input type='email' placeholder='your@email.com' />
</Field>

<Field label='Password'>
  <Input type='password' placeholder='Enter password' />
</Field>
```

---

## Props/API

### Core Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Controls the height and padding of the input |
| `variant` | `"outline" \| "filled" \| "flushed" \| "unstyled"` | `"outline"` | Visual appearance style of the input |
| `isDisabled` | `boolean` | `false` | Disables the input field |
| `isInvalid` | `boolean` | `false` | Marks the field as invalid (with error styling) |
| `isReadOnly` | `boolean` | `false` | Makes the input read-only (prevents user modification) |
| `isRequired` | `boolean` | `false` | Marks the field as required (semantic) |
| `type` | `string` | `"text"` | HTML input type attribute |
| `placeholder` | `string` | — | Placeholder text shown when input is empty |
| `value` | `string` | — | Controlled value of the input |
| `defaultValue` | `string` | — | Initial value for uncontrolled input |
| `onChange` | `function` | — | Callback fired when input value changes |
| `onFocus` | `function` | — | Callback fired when input receives focus |
| `onBlur` | `function` | — | Callback fired when input loses focus |
| `focusBorderColor` | `string` | theme-dependent | Custom border color on focus state |
| `errorBorderColor` | `string` | `"red.500"` | Custom border color when invalid |
| `_placeholder` | `object` | — | Style object for placeholder text |
| `disabled` | `boolean` | `false` | Alias for `isDisabled` |
| `readOnly` | `boolean` | `false` | Alias for `isReadOnly` |
| `required` | `boolean` | `false` | Alias for `isRequired` |
| `aria-label` | `string` | — | Accessible label (when label component not used) |
| `aria-describedby` | `string` | — | ID of element describing the input |
| `aria-invalid` | `boolean` | — | Set automatically based on `isInvalid` prop |

### Inherited Props

Input composes the `Box` component, so all Box props are accepted (margin, padding, color, etc.). Also accepts all standard HTML input attributes and event handlers.

### InputGroup Companion Props

```jsx
<InputGroup size='md' variant='outline'>
  <InputLeftAddon>+1</InputLeftAddon>
  <Input placeholder='Phone number' />
  <InputRightAddon>.com</InputRightAddon>
</InputGroup>
```

---

## Common Patterns

### Pattern: Basic Text Input with Placeholder
```jsx
<Input
  placeholder='Enter text here'
  size='md'
/>
```

### Pattern: Email Input with Validation
```jsx
import { useState } from 'react'
import { Input, Field } from '@chakra-ui/react'

function EmailInput() {
  const [email, setEmail] = useState('')
  const isInvalid = email && !email.includes('@')

  return (
    <Field
      label='Email'
      invalid={isInvalid}
      errorText='Please enter a valid email'
    >
      <Input
        type='email'
        placeholder='user@example.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isInvalid={isInvalid}
      />
    </Field>
  )
}
```

### Pattern: Controlled Input
```jsx
import { useState } from 'react'
import { Input } from '@chakra-ui/react'

function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder='Type something...'
    />
  )
}
```

### Pattern: Uncontrolled Input
```jsx
import { useRef } from 'react'
import { Input, Button } from '@chakra-ui/react'

function UncontrolledInput() {
  const inputRef = useRef(null)

  const handleSubmit = () => {
    console.log(inputRef.current.value)
  }

  return (
    <>
      <Input ref={inputRef} placeholder='Type something...' />
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  )
}
```

### Pattern: Input with Loading State
```jsx
import { useState } from 'react'
import { Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'

function LoadingInput() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value) => {
    setIsLoading(true)
    // Perform async operation
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <InputGroup>
      <Input
        placeholder='Search...'
        onChange={(e) => handleSearch(e.target.value)}
        isDisabled={isLoading}
      />
      {isLoading && (
        <InputRightElement>
          <Spinner size='sm' />
        </InputRightElement>
      )}
    </InputGroup>
  )
}
```

---

## Visual Variations

### Size Variations
```jsx
<Input size='xs' placeholder='Extra small' />
<Input size='sm' placeholder='Small' />
<Input size='md' placeholder='Medium (default)' />
<Input size='lg' placeholder='Large' />
```

**Size Details:**
| Size | Height | Use Case |
|------|--------|----------|
| `xs` | 24px | Compact forms, small spaces |
| `sm` | 32px | Form rows with dense spacing |
| `md` | 40px | Default, most common |
| `lg` | 48px | Prominent inputs, mobile-friendly |

### Variant Variations
```jsx
{/* Outline - Default, bordered style */}
<Input variant='outline' placeholder='Outline variant' />

{/* Filled - Solid background style */}
<Input variant='filled' placeholder='Filled variant' />

{/* Flushed - Bottom border only */}
<Input variant='flushed' placeholder='Flushed variant' />

{/* Unstyled - Minimal styling */}
<Input variant='unstyled' placeholder='Unstyled variant' />
```

**Variant Comparison:**
| Variant | Visual Style | Best For |
|---------|-------------|----------|
| `outline` | Bordered box | Standard forms |
| `filled` | Solid background | Emphasized inputs |
| `flushed` | Bottom border only | Modern, minimal UIs |
| `unstyled` | No styling | Custom styling, integration |

---

## Size Patterns

### Responsive Sizing
```jsx
import { Input } from '@chakra-ui/react'

// Using responsive array syntax (Chakra UI pattern)
<Input size={['sm', 'md', 'lg']} placeholder='Responsive size' />

// Mobile: sm, Tablet: md, Desktop: lg
```

### Fixed vs. Flexible Widths
```jsx
{/* Fixed width */}
<Input width='300px' placeholder='Fixed width' />

{/* Full width */}
<Input width='100%' placeholder='Full width' />

{/* Responsive width */}
<Input width={['100%', '80%', '60%']} placeholder='Responsive width' />

{/* Max width */}
<Input maxWidth='500px' placeholder='Max width constraint' />
```

---

## States

### Disabled State
```jsx
{/* Disabled input */}
<Input isDisabled placeholder='Disabled input' />

{/* Disabled with value */}
<Input isDisabled value='Cannot edit this' />

{/* Using HTML disabled attribute */}
<Input disabled placeholder='Also disabled' />
```

### Invalid/Error State
```jsx
import { Input, Field } from '@chakra-ui/react'

<Field
  label='Username'
  invalid
  errorText='Username is already taken'
>
  <Input
    isInvalid
    value='already_taken'
    focusBorderColor='red.500'
    errorBorderColor='red.500'
  />
</Field>
```

### Read-Only State
```jsx
{/* Read-only input */}
<Input isReadOnly value='Read-only value' />

{/* Using HTML readOnly attribute */}
<Input readOnly value='Also read-only' />
```

### Focus State
```jsx
{/* Custom focus border color */}
<Input
  focusBorderColor='blue.500'
  placeholder='Custom focus color'
/>

{/* Green focus, red error */}
<Input
  focusBorderColor='green.500'
  errorBorderColor='red.500'
  isInvalid
/>
```

---

## Validation Patterns

### Client-Side Validation
```jsx
import { useState } from 'react'
import { Input, Field, Text } from '@chakra-ui/react'

function ValidatedInput() {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = value.length >= 3
  const showError = touched && !isValid

  return (
    <Field
      label='Username'
      invalid={showError}
      errorText='Username must be at least 3 characters'
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        isInvalid={showError}
        placeholder='Enter username'
      />
    </Field>
  )
}
```

### Async Validation (with debounce)
```jsx
import { useState, useRef } from 'react'
import { Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'

function AsyncValidation() {
  const [value, setValue] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isValid, setIsValid] = useState(null)
  const timeoutRef = useRef(null)

  const checkUsername = async (username) => {
    setIsChecking(true)
    // Simulate API call
    const isAvailable = !['admin', 'user', 'test'].includes(username)
    setIsValid(isAvailable)
    setIsChecking(false)
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)

    // Debounce validation
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (newValue) checkUsername(newValue)
    }, 500)
  }

  return (
    <InputGroup>
      <Input
        value={value}
        onChange={handleChange}
        isInvalid={isValid === false}
        placeholder='Check username availability'
      />
      {isChecking && (
        <InputRightElement>
          <Spinner size='sm' color='blue.500' />
        </InputRightElement>
      )}
    </InputGroup>
  )
}
```

### Form Validation with React Hook Form
```jsx
import { useForm, Controller } from 'react-hook-form'
import { Input, Field, Button } from '@chakra-ui/react'

function FormWithValidation() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name='email'
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <Field
            label='Email'
            invalid={!!error}
            errorText={error?.message}
          >
            <Input {...field} type='email' />
          </Field>
        )}
      />
      <Button type='submit'>Submit</Button>
    </form>
  )
}
```

---

## Label & Placeholder Patterns

### With Field Component (Recommended)
```jsx
import { Input, Field } from '@chakra-ui/react'

{/* Basic label */}
<Field label='Full Name'>
  <Input placeholder='Enter your name' />
</Field>

{/* Required field indicator */}
<Field label='Email' required>
  <Input type='email' />
</Field>

{/* With helper text */}
<Field
  label='Password'
  helperText='Must be at least 8 characters'
>
  <Input type='password' />
</Field>

{/* With error */}
<Field
  label='Username'
  invalid
  errorText='Username already exists'
>
  <Input isInvalid />
</Field>
```

### With Custom Label
```jsx
import { Input, FormControl, FormLabel } from '@chakra-ui/react'

<FormControl isRequired>
  <FormLabel>Email Address</FormLabel>
  <Input type='email' placeholder='email@example.com' />
</FormControl>
```

### Placeholder Styling
```jsx
{/* Default placeholder styling */}
<Input placeholder='Default placeholder' />

{/* Custom placeholder color and opacity */}
<Input
  placeholder='Custom styled placeholder'
  _placeholder={{
    color: 'gray.500',
    opacity: 1  // Increase from default 0.6
  }}
/>

{/* Placeholder with different styling per variant */}
<Input
  variant='filled'
  placeholder='Filled variant'
  _placeholder={{
    color: 'gray.400',
    fontStyle: 'italic'
  }}
/>
```

### Aria-label (Accessibility)
```jsx
{/* When no visible label is used */}
<Input
  aria-label='Search products'
  placeholder='Search...'
/>

{/* Multiple inputs with distinct labels */}
<>
  <Input aria-label='First name' placeholder='First' />
  <Input aria-label='Last name' placeholder='Last' />
</>
```

---

## Prefix & Suffix Patterns

### Using InputGroup with Addons
```jsx
import { Input, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/react'

{/* Currency input */}
<InputGroup>
  <InputLeftAddon>$</InputLeftAddon>
  <Input placeholder='Enter amount' />
</InputGroup>

{/* Phone input */}
<InputGroup>
  <InputLeftAddon>+1</InputLeftAddon>
  <Input placeholder='Phone number' />
</InputGroup>

{/* URL input */}
<InputGroup>
  <InputLeftAddon>https://</InputLeftAddon>
  <Input placeholder='example.com' />
  <InputRightAddon>.com</InputRightAddon>
</InputGroup>

{/* File size unit */}
<InputGroup>
  <Input placeholder='Size' />
  <InputRightAddon>MB</InputRightAddon>
</InputGroup>
```

### Using InputElement (Icons & Interactive Elements)
```jsx
import { Input, InputGroup, InputLeftElement, InputRightElement, Icon, Button } from '@chakra-ui/react'
import { SearchIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

{/* Search icon prefix */}
<InputGroup>
  <InputLeftElement>
    <SearchIcon color='gray.300' />
  </InputLeftElement>
  <Input placeholder='Search users' />
</InputGroup>

{/* Show/hide password toggle */}
import { useState } from 'react'

function PasswordInput() {
  const [show, setShow] = useState(false)

  return (
    <InputGroup>
      <Input
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
      />
      <InputRightElement width='4.5rem'>
        <Button
          h='1.75rem'
          size='sm'
          onClick={() => setShow(!show)}
        >
          {show ? <ViewOffIcon /> : <ViewIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

{/* Clear button (X icon) */}
import { CloseIcon } from '@chakra-ui/icons'

function ClearableInput() {
  const [value, setValue] = useState('')

  return (
    <InputGroup>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Type to search...'
      />
      {value && (
        <InputRightElement>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => setValue('')}
          >
            <CloseIcon />
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  )
}

{/* Character counter */}
<InputGroup>
  <Input placeholder='Max 100 characters' maxLength={100} />
  <InputRightElement pr={3}>
    <Text fontSize='sm' color='gray.500'>0/100</Text>
  </InputRightElement>
</InputGroup>
```

### Compound Addon/Element Patterns
```jsx
{/* Multiple elements on right */}
<InputGroup>
  <Input placeholder='Username' />
  <InputRightElement pointerEvents='none' width='2.5rem'>
    <CheckIcon color='green.500' />
  </InputRightElement>
  <InputRightElement right='2.5rem'>
    <Tooltip label='Available'>
      <InfoIcon />
    </Tooltip>
  </InputRightElement>
</InputGroup>

{/* Addon + Element combination */}
<InputGroup>
  <InputLeftAddon>$</InputLeftAddon>
  <Input placeholder='Price' />
  <InputRightElement width='4rem'>
    <Button size='sm'>Apply</Button>
  </InputRightElement>
</InputGroup>
```

---

## Input Types

### Text Types
```jsx
{/* Text (default) */}
<Input type='text' placeholder='Text input' />

{/* Email */}
<Input type='email' placeholder='user@example.com' />

{/* Password */}
<Input type='password' placeholder='Enter password' />

{/* Search */}
<Input type='search' placeholder='Search term' />

{/* URL */}
<Input type='url' placeholder='https://example.com' />

{/* Telephone */}
<Input type='tel' placeholder='(555) 123-4567' />
```

### Numeric Types
```jsx
{/* Number - For numeric input (use Number Input component for better UX) */}
<Input type='number' placeholder='Enter a number' min={0} max={100} />

{/* Range - Creates a slider */}
<Input type='range' min={0} max={100} />
```

### Date/Time Types
```jsx
{/* Date picker */}
<Input type='date' />

{/* Time picker */}
<Input type='time' />

{/* DateTime local */}
<Input type='datetime-local' />

{/* Month picker */}
<Input type='month' />

{/* Week picker */}
<Input type='week' />
```

### Other Types
```jsx
{/* Color picker */}
<Input type='color' />

{/* File input */}
<Input type='file' accept='image/*' />

{/* Hidden input */}
<Input type='hidden' />
```

---

## Accessibility

### ARIA Attributes
```jsx
import { Input, Field } from '@chakra-ui/react'

{/* Using Field (handles ARIA automatically) */}
<Field label='Email' required>
  <Input type='email' />
</Field>

{/* Manual ARIA attributes */}
<Input
  aria-label='Search products'
  aria-describedby='search-help'
  placeholder='Search...'
/>
<Text id='search-help' fontSize='sm'>
  Enter product name or SKU
</Text>

{/* For invalid fields */}
<Input
  isInvalid
  aria-invalid='true'
  aria-errormessage='email-error'
/>
<Text id='email-error' color='red.500'>
  Please enter a valid email
</Text>
```

### Keyboard Navigation
```jsx
{/* Tab key navigation is automatic */}
<Input />

{/* Custom tab order */}
<Input tabIndex={2} />
<Input tabIndex={1} />

{/* Disable tab focus */}
<Input tabIndex={-1} />
```

### Screen Reader Support
```jsx
{/* Good: Clear labels */}
<Field label='Email Address'>
  <Input type='email' />
</Field>

{/* Good: Helper text visible */}
<Field
  label='Password'
  helperText='Minimum 8 characters'
>
  <Input type='password' />
</Field>

{/* Good: Error messages */}
<Field
  label='Username'
  invalid
  errorText='This username is not available'
>
  <Input isInvalid />
</Field>

{/* Avoid: Placeholder as only label */}
<Input placeholder='Email' /> {/* Bad for accessibility */}
```

### Focus Management
```jsx
import { useRef } from 'react'
import { Input, Button } from '@chakra-ui/react'

function FocusManagement() {
  const inputRef = useRef(null)

  return (
    <>
      <Input ref={inputRef} placeholder='Focus me' />
      <Button onClick={() => inputRef.current?.focus()}>
        Focus Input
      </Button>
    </>
  )
}
```

---

## Integration Patterns

### With Form Libraries - React Hook Form
```jsx
import { useForm, Controller } from 'react-hook-form'
import { Input, Field, Button } from '@chakra-ui/react'

function MyForm() {
  const { control, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name='email'
        control={control}
        rules={{
          required: 'Email required',
          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }
        }}
        render={({ field }) => (
          <Field
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            <Input {...field} type='email' />
          </Field>
        )}
      />
      <Button type='submit'>Submit</Button>
    </form>
  )
}
```

### With Formik
```jsx
import { Formik, Form, Field as FormikField } from 'formik'
import * as Yup from 'yup'
import { Input, Field, Button } from '@chakra-ui/react'

const validationSchema = Yup.object({
  email: Yup.string().email().required()
})

function FormikForm() {
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      {({ errors, touched }) => (
        <Form>
          <FormikField name='email'>
            {({ field }) => (
              <Field
                invalid={touched.email && !!errors.email}
                errorText={errors.email}
              >
                <Input {...field} type='email' />
              </Field>
            )}
          </FormikField>
          <Button type='submit'>Submit</Button>
        </Form>
      )}
    </Formik>
  )
}
```

### Multi-step Form
```jsx
import { useState } from 'react'
import { Input, Field, Button, VStack } from '@chakra-ui/react'

function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <VStack spacing={4}>
      {step === 1 && (
        <Field label='Name'>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Field>
      )}
      {step === 2 && (
        <Field label='Email'>
          <Input
            type='email'
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Field>
      )}
      {step === 3 && (
        <Field label='Password'>
          <Input
            type='password'
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </Field>
      )}
      <Button onClick={() => setStep(step + 1)}>Next</Button>
    </VStack>
  )
}
```

---

## Advanced Patterns

### Auto-save Input (with debounce)
```jsx
import { useState, useEffect, useRef } from 'react'
import { Input } from '@chakra-ui/react'

function AutoSaveInput() {
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setSaved(false)

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      // Save to server
      console.log('Saving:', value)
      setSaved(true)
    }, 1000)

    return () => clearTimeout(timeoutRef.current)
  }, [value])

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder='Type to auto-save...'
      borderColor={saved ? 'green.500' : 'gray.200'}
      _focus={{
        borderColor: saved ? 'green.500' : 'blue.500'
      }}
    />
  )
}
```

### Character Counter with Limit
```jsx
import { Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { useState } from 'react'

function CharacterCounterInput({ maxLength = 50 }) {
  const [value, setValue] = useState('')
  const isNearLimit = value.length >= maxLength * 0.8
  const isFull = value.length >= maxLength

  return (
    <InputGroup>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
        placeholder='Enter text...'
        isInvalid={isFull}
      />
      <InputRightElement pr={3}>
        <Text
          fontSize='sm'
          color={isFull ? 'red.500' : isNearLimit ? 'orange.500' : 'gray.500'}
        >
          {value.length}/{maxLength}
        </Text>
      </InputRightElement>
    </InputGroup>
  )
}
```

### Input with Real-time Search Suggestions
```jsx
import { useState, useEffect } from 'react'
import { Input, List, ListItem } from '@chakra-ui/react'

function SearchWithSuggestions() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    // Simulate API call
    const results = [
      'Apple',
      'Application',
      'Apply',
      'Apricot'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()))

    setSuggestions(results)
  }, [query])

  return (
    <>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search...'
      />
      {suggestions.length > 0 && (
        <List>
          {suggestions.map(item => (
            <ListItem
              key={item}
              onClick={() => setQuery(item)}
              cursor='pointer'
              _hover={{ bg: 'gray.100' }}
            >
              {item}
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}
```

### Input with Formatting (e.g., Phone Number)
```jsx
import { Input, InputGroup } from '@chakra-ui/react'
import { useState } from 'react'

function FormattedPhoneInput() {
  const [value, setValue] = useState('')

  const formatPhoneNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10)
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return (
    <InputGroup>
      <Input
        value={formatPhoneNumber(value)}
        onChange={(e) => setValue(e.target.value)}
        placeholder='(123) 456-7890'
      />
    </InputGroup>
  )
}
```

### Input with Mask (Credit Card Example)
```jsx
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { useState } from 'react'

function CreditCardInput() {
  const [cardNumber, setCardNumber] = useState('')

  const handleCardChange = (e) => {
    let val = e.target.value.replace(/\s/g, '').slice(0, 16)
    val = val.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(val)
  }

  return (
    <InputGroup>
      <InputLeftAddon>💳</InputLeftAddon>
      <Input
        value={cardNumber}
        onChange={handleCardChange}
        placeholder='1234 5678 9012 3456'
      />
    </InputGroup>
  )
}
```

### Copy-to-Clipboard Input
```jsx
import { Input, InputGroup, InputRightElement, Button, useClipboard } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

function CopyableInput({ value = 'https://example.com/share' }) {
  const { hasCopied, onCopy } = useClipboard(value)

  return (
    <InputGroup>
      <Input value={value} isReadOnly />
      <InputRightElement>
        <Button
          size='sm'
          onClick={onCopy}
          colorScheme={hasCopied ? 'green' : 'gray'}
        >
          {hasCopied ? '✓' : <CopyIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
```

---

## Notes

### Framework Design Philosophy

1. **Composition-First Approach**
   - Input is a minimal, focused component
   - Complex patterns built by composing with InputGroup, InputLeftAddon, InputRightAddon, InputLeftElement, InputRightElement
   - This keeps the base component simple while enabling unlimited flexibility

2. **Multipart Component**
   - Input is a multipart component with customizable `field` part
   - InputGroup has addon and element parts
   - Enables granular theming and styling control

3. **Accessibility by Default**
   - Proper ARIA attributes applied automatically based on props
   - Field component handles label association automatically
   - Standard HTML input attributes and events fully supported

4. **Theming & Customization**
   - Component uses design tokens for colors, spacing, sizes
   - Supports custom variants and sizes through theme extension
   - CSS-in-JS integration with Chakra's styled system

### Common Usage Observations

1. **State Management**
   - Use `useState` for controlled inputs when you need real-time feedback
   - Use `useRef` for uncontrolled inputs when value is only needed on submission
   - For complex forms, use React Hook Form or Formik

2. **Validation Timing**
   - Blur-based validation: Validate when user leaves the field (less disruptive)
   - Change-based validation: Real-time feedback (more guidance, more verbose)
   - Submit-based validation: Only check on form submission (simplest)

3. **Addon vs. Element**
   - Use InputLeftAddon / InputRightAddon for static text (currencies, units)
   - Use InputLeftElement / InputRightElement for interactive elements (icons, buttons)
   - Elements can be made non-interactive with `pointerEvents='none'`

4. **Responsive Design**
   - Use responsive size arrays: `size={['sm', 'md', 'lg']}`
   - Use responsive width arrays: `width={['100%', '80%', '60%']}`
   - Mobile-first: Define mobile size first, then tablet/desktop overrides

### Differences from Other Frameworks

1. **vs. MUI Input**
   - Chakra: Smaller, composition-based; MUI: More opinionated, comprehensive
   - Chakra: Easier to customize; MUI: More built-in features

2. **vs. Headless UI**
   - Chakra: Styled and ready to use; Headless UI: Unstyled primitive
   - Chakra: Built-in variants; Headless UI: Minimal styling

3. **vs. Radix UI**
   - Chakra: Complete design system; Radix: Lower-level primitives
   - Chakra: Opinionated styling; Radix: Headless/unstyled

### Best Practices

1. **Always use labels** - Either via Field component or aria-label
2. **Provide clear validation messages** - Don't just show red border
3. **Use appropriate input types** - type='email' for emails, type='number' for numbers
4. **Consider mobile UX** - Larger tap targets, appropriate keyboard types
5. **Test with screen readers** - Ensure ARIA attributes are correct
6. **Debounce async validation** - Avoid excessive API calls
7. **Use InputGroup wisely** - Addons for static content, Elements for interactive

### Performance Considerations

1. **Debounce onChange handlers** - For expensive operations (API calls)
2. **Memoize complex Components** - If many inputs in a list, use React.memo
4. **Avoid inline functions** - Define event handlers outside render for controlled inputs
5. **Use React Hook Form** - For large forms with multiple validations

### Common Pitfalls to Avoid

1. **Forgetting to bind onChange** - Input becomes uncontrolled when using value prop
2. **Using placeholder instead of label** - Placeholder disappears, reducing accessibility
3. **Not debouncing validation** - Can cause performance issues with async validation
4. **Mixing controlled and uncontrolled** - Set either value or defaultValue, not both
5. **Forgetting focusBorderColor** - Default color might not match theme
6. **Using isInvalid without aria-invalid** - Accessibility feature might not be clear to all users

