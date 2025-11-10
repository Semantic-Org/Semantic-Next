# Chakra UI - Form Usage Patterns

## Component URL
https://v2.chakra-ui.com/docs/components/form-control
Status: ✅ Working
Version: v2 (Current stable documentation)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - The documentation provides detailed examples, accessibility information, integration patterns with popular form libraries (Formik), and covers all sub-components thoroughly.

## Component Definition
- **Core purpose**: FormControl is a context-providing wrapper component that manages state and accessibility for form elements. It distributes properties like `isInvalid`, `isDisabled`, `isRequired`, and `isReadOnly` to child components, ensuring consistent validation and accessibility across form inputs.
- **Mental model**: Think of FormControl as a "smart wrapper" that automatically handles the tedious aspects of form field management - ARIA attributes, label associations, error message visibility, and state cascading - allowing developers to focus on validation logic rather than accessibility plumbing.
- **Semantic meaning**: FormControl establishes a semantic relationship between a form field's label, input, helper text, and error messages, communicating field state and requirements to both users and assistive technologies.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `isInvalid={true}`, `isRequired={true}`)
- **Composed**: Via composition/children (e.g., `<FormControl><FormLabel /></FormControl>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Field grouping | ✅ | Composed | FormControl wraps all related components (label, input, helper text, error message) to create a cohesive field group. Can also use `as='fieldset'` for semantic fieldset/legend patterns with radio/checkbox groups. |
| Field labels | ✅ | Composed | FormLabel component with automatic `htmlFor` binding to child inputs. Responds to parent FormControl state with `_disabled`, `_focus`, and `_invalid` style props. |
| Help text | ✅ | Composed | FormHelperText component displays supplementary information. Automatically extends `aria-describedby` references on associated inputs for screen reader support. |
| Error messages | ✅ | Composed | FormErrorMessage component with automatic visibility control via `isInvalid` prop. Only renders when FormControl has `isInvalid={true}`. Includes FormErrorIcon for visual error indication. |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ❌ | N/A | No built-in validation logic. Validation must be implemented externally and indicated via the `isInvalid` prop. |
| Custom validation | ✅ | Native | Set `isInvalid={true}` based on custom validation logic. FormControl handles all accessibility and visual feedback automatically. |
| Async validation | ✅ | CSS-only/Custom | No dedicated async validation support. Requires custom implementation with loading states and async functions. Can show loading indicator in FormHelperText while validation is in progress. |
| Cross-field validation | ✅ | CSS-only/Custom | No dedicated support. Requires custom implementation at form level to coordinate validation between multiple FormControls. |
| Validation triggers | ✅ | CSS-only/Custom | No built-in trigger system. Developers control when to trigger validation (e.g., onBlur, onChange, onSubmit) and set `isInvalid` accordingly. Common pattern: track "touched" state to avoid showing errors prematurely. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled values | ✅ | Composed | Works seamlessly with controlled inputs using `value` and `onChange` props on child input components. FormControl manages validation state while inputs manage their own values. |
| Uncontrolled values | ✅ | Composed | Supports uncontrolled inputs using refs. FormControl can still manage `isInvalid` state independently of input value control. |
| Initial values | ✅ | Composed | Set initial values directly on child input components (e.g., `<Input defaultValue="..." />`). FormControl doesn't manage values, only validation states. |
| Dynamic fields | ✅ | CSS-only | No dedicated support. Requires custom implementation using React state to manage arrays of FormControls. Can be added/removed using standard React patterns. |
| Field dependencies | ✅ | CSS-only | No built-in support. Requires custom logic to coordinate validation/visibility between FormControls based on other field values. |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal layout | ✅ | CSS-only | Use Chakra's HStack or Flex components to arrange FormControls horizontally. FormControl itself doesn't provide layout, but integrates with Chakra's layout primitives. |
| Vertical layout | ✅ | CSS-only | Use Chakra's VStack or Stack components to arrange FormControls vertically. Default behavior when stacking FormControls in a container. |
| Inline layout | ✅ | CSS-only | Use HStack with appropriate spacing. Can use FormControl `display='flex'` with alignment props for inline labels (e.g., switches). |
| Grid layout | ✅ | CSS-only | Use Chakra's Grid and GridItem components to create multi-column forms. FormControls work seamlessly within grid cells. |
| Responsive layout | ✅ | CSS-only | Leverage Chakra's responsive style props on layout containers (e.g., `<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>`). FormControl inherits responsive behavior from parent layout. |

## Submission Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Submit handling | ✅ | CSS-only | No built-in submit handling. Use standard HTML form `onSubmit` or integrate with form libraries (Formik, React Hook Form). FormControl provides validation state, not submission logic. |
| Loading state | ❌ | CSS-only | No dedicated loading state. Can display loading indicators using FormHelperText or custom components. Button components have `isLoading` prop for submit buttons. |
| Error handling | ✅ | Native | `isInvalid` prop with FormErrorMessage provides comprehensive error display. Handles ARIA attributes and conditional rendering automatically. |
| Success handling | ❌ | CSS-only | No dedicated success state. Can implement using custom styling or by showing success messages in FormHelperText conditionally. |
| Reset functionality | ❌ | CSS-only | No built-in reset. Use standard form reset or state management to clear field values and validation states. |

## Code Examples

### Basic Usage
```jsx
import { FormControl, FormLabel, Input, FormHelperText } from '@chakra-ui/react'

function BasicExample() {
  return (
    <FormControl>
      <FormLabel>Email address</FormLabel>
      <Input type='email' />
      <FormHelperText>We'll never share your email.</FormHelperText>
    </FormControl>
  )
}
```

### Validation with Error Messages
```jsx
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react'
import { useState } from 'react'

function ValidationExample() {
  const [input, setInput] = useState('')
  const handleInputChange = (e) => setInput(e.target.value)
  const isError = input === ''

  return (
    <FormControl isInvalid={isError}>
      <FormLabel>Email</FormLabel>
      <Input type='email' value={input} onChange={handleInputChange} />
      {!isError ? (
        <FormHelperText>
          Enter the email you'd like to receive the newsletter on.
        </FormHelperText>
      ) : (
        <FormErrorMessage>Email is required.</FormErrorMessage>
      )}
    </FormControl>
  )
}
```

### Required Fields
```jsx
function RequiredExample() {
  return (
    <FormControl isRequired>
      <FormLabel>First name</FormLabel>
      <Input placeholder='First name' />
    </FormControl>
  )
}
```

### Select Dropdown
```jsx
function SelectExample() {
  return (
    <FormControl>
      <FormLabel>Country</FormLabel>
      <Select placeholder='Select country'>
        <option>United Arab Emirates</option>
        <option>Nigeria</option>
      </Select>
    </FormControl>
  )
}
```

### Number Input
```jsx
function NumberInputExample() {
  return (
    <FormControl>
      <FormLabel>Amount</FormLabel>
      <NumberInput max={50} min={10}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  )
}
```

### Radio Group with Fieldset Pattern
```jsx
function RadioGroupExample() {
  return (
    <FormControl as='fieldset'>
      <FormLabel as='legend'>Favorite Naruto Character</FormLabel>
      <RadioGroup defaultValue='Itachi'>
        <HStack spacing='24px'>
          <Radio value='Sasuke'>Sasuke</Radio>
          <Radio value='Nagato'>Nagato</Radio>
          <Radio value='Itachi'>Itachi</Radio>
          <Radio value='Sage of the six Paths'>Sage of the six Paths</Radio>
        </HStack>
      </RadioGroup>
      <FormHelperText>Select only if you're a fan.</FormHelperText>
    </FormControl>
  )
}
```

### Formik Integration
```jsx
import { Formik, Form, Field } from 'formik'
import { FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react'

function FormikExample() {
  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱"
    }
    return error
  }

  return (
    <Formik
      initialValues={{ name: 'Sasuke' }}
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
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel>First name</FormLabel>
                <Input {...field} placeholder='name' />
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

[View Live Examples](https://v2.chakra-ui.com/docs/components/form-control)

## Notable Features

### Context-Based State Distribution
FormControl uses React Context to distribute state information (`isInvalid`, `isDisabled`, `isRequired`, `isReadOnly`) to all child components. This eliminates the need to manually pass props to every form element, reducing boilerplate and ensuring consistency.

### Automatic ARIA Management
The component automatically handles all necessary ARIA attributes:
- Sets `aria-invalid="true"` on inputs when `isInvalid` is true
- Sets `aria-required="true"` on inputs when `isRequired` is true
- Creates `aria-describedby` links between inputs and FormHelperText/FormErrorMessage
- Automatically manages ID associations between labels and inputs

### Label State Awareness
FormLabel is context-aware and responds to input states through Chakra's style props system:
- `_disabled` - Applies styles when FormControl has `isDisabled`
- `_focus` - Applies styles when associated input has focus
- `_invalid` - Applies styles when FormControl has `isInvalid`

This enables declarative styling based on form field state without manual event handling.

### Conditional Error Display
FormErrorMessage only renders when `isInvalid` is explicitly `true`, preventing accidental error display. This pattern encourages proper validation state management and prevents UI glitches.

### Seamless Theme Integration
FormControl and its sub-components are deeply integrated with Chakra UI's theming system, supporting:
- Design token usage for consistent styling
- Theme customization through `extendTheme`
- All standard Chakra style props (spacing, colors, typography)
- Responsive style props for adaptive layouts

### Form Library Integration
Excellent integration with popular form libraries:
- **Formik**: Clean integration through Field render props
- **React Hook Form**: Compatible with register pattern
- Can work with any form library that uses standard HTML form patterns

## Research Notes

### Documentation Access
- The original URL provided (https://chakra-ui.com/docs/components/form-control) returned a 404
- The component was renamed from "FormControl" to "Field" in Chakra UI v3
- Found complete v2 documentation at https://v2.chakra-ui.com/docs/components/form-control
- v3 Field component documentation was not fully accessible at the time of research

### Framework Approach Observations

**Context-First Architecture**: Chakra UI's approach with FormControl demonstrates a strong preference for React Context to solve prop drilling issues. This is elegant but creates tight coupling between FormControl and its child components - they must be direct children to receive context.

**Composition Over Configuration**: Rather than a monolithic form component with many props, Chakra breaks form fields into composable pieces (FormControl, FormLabel, FormHelperText, FormErrorMessage). This provides flexibility but requires more boilerplate.

**Accessibility as First-Class Concern**: The automatic ARIA attribute management is sophisticated and shows that accessibility was considered from the ground up rather than bolted on. This is one of the strongest aspects of the implementation.

**Validation Agnostic**: FormControl intentionally doesn't include validation logic, only validation state display. This keeps the component flexible but means developers must bring their own validation or integrate a library.

**Version Migration**: The v2 to v3 transition (FormControl → Field) suggests the component is being rebuilt on Ark UI for better TypeScript support and cross-framework compatibility. The core patterns appear to be maintained.

### Comparison to Other Frameworks
- **vs MUI**: Chakra's approach is more composition-heavy, while MUI often provides all-in-one components
- **vs Ant Design**: Chakra focuses on accessibility primitives, while Ant Design includes more built-in validation
- **vs Mantine**: Similar composition approach but Mantine includes more built-in form state management

### Implementation Considerations
The context-based approach means FormControl's child components must be direct descendants or the context won't be received. Custom wrapper components need to pass context through explicitly or FormControl features break. This is a common gotcha for developers.
