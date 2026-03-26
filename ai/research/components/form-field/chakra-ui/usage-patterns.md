# Chakra UI - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/field
Status: ✅ Working
Version: Current (Chakra UI v3)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear purpose, code examples, and composition patterns shown with additional references to source code and Storybook.

## Component Definition
- **Core purpose**: Provides a compositional wrapper for form inputs with associated metadata including labels, help text, and error messages. Solves the problem of consistently structuring form fields with proper accessibility and validation feedback.
- **Mental model**: A field container that orchestrates the relationship between a form control and its descriptive elements (label, help, errors). Users think of it as "everything that makes up a complete form input."
- **Semantic meaning**: Communicates form field structure, state (error/valid), and requirements (required/optional) to both users and assistive technologies.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `label="Name"`)
- **Composed**: Via composition/children (e.g., `<Field><Field.Label>Name</Field.Label></Field>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Composed | `<Field.Label>` sub-component provides semantic label association with proper htmlFor binding |
| Help text | ✅ | Composed | `<Field.HelperText>` sub-component for additional guidance text, displayed below input |
| Error messages | ✅ | Composed | `<Field.ErrorText>` sub-component for validation error display, conditionally shown |
| Required indicator | ✅ | Composed | Supported through field state, typically shown via asterisk or other visual indicator on label |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Composed | Error state controlled via `invalid` prop, triggers error styling and shows ErrorText |
| Disabled | ✅ | Composed | `disabled` prop prevents interaction with field and applies disabled styling |
| Required | ✅ | Composed | `required` prop marks field as mandatory, typically shows indicator on label |
| Read-only | ✅ | Composed | `readOnly` prop allows viewing but prevents modification |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | Native | Default layout with label above input, helper text and errors below |
| Horizontal layout | ⚠️ | CSS-only | Not explicitly documented but likely achievable through custom styling |
| Inline layout | ⚠️ | CSS-only | Not explicitly documented but likely achievable through flex/grid styling |
| Label placement | ✅ | Composed | Label positioned above input by default; alternative placements via custom styling |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ❌ | N/A | Field is presentational; validation logic handled externally |
| Custom validation | ✅ | Composed | Accepts validation state from parent form/input, displays via `invalid` prop |
| Real-time validation | ✅ | Composed | Can display real-time errors when connected to form library or custom logic |
| Error message display | ✅ | Composed | `<Field.ErrorText>` conditionally shown based on validation state |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ✅ | Composed | Designed to work with React Hook Form, Formik, and other form libraries via composition |
| Native HTML form | ✅ | Composed | Works with native form elements through standard HTML attributes |
| Controlled components | ✅ | Composed | Input control state managed by parent, Field displays associated metadata |
| Uncontrolled components | ✅ | Composed | Supports uncontrolled inputs with Field providing structure and state display |

## Code Examples
```jsx
// Basic usage with composition pattern
import { Field } from "@chakra-ui/react"

<Field>
  <Field.Label>Email</Field.Label>
  <Input />
  <Field.HelperText>Enter your email address</Field.HelperText>
  <Field.ErrorText>Email is required</Field.ErrorText>
</Field>

// With validation state
<Field invalid={!isValid}>
  <Field.Label>Email</Field.Label>
  <Input value={email} onChange={handleChange} />
  <Field.HelperText>We'll never share your email</Field.HelperText>
  <Field.ErrorText>Please enter a valid email address</Field.ErrorText>
</Field>

// Required field
<Field required>
  <Field.Label>Username</Field.Label>
  <Input />
  <Field.HelperText>Choose a unique username</Field.HelperText>
</Field>

// Disabled field
<Field disabled>
  <Field.Label>Account Type</Field.Label>
  <Input value="Premium" readOnly />
</Field>
```
[View Live](https://chakra-ui.com/docs/components/field) *(documentation page)*

## Notable Features
- **Composition-first API**: Unlike many form libraries that use props, Chakra UI Field uses sub-components (`Field.Label`, `Field.HelperText`, `Field.ErrorText`) for maximum flexibility
- **Ark UI Foundation**: Built on top of Ark UI primitives, providing solid accessibility and behavior patterns
- **Theme integration**: Fully integrated with Chakra's design system including color mode support
- **Automatic ARIA associations**: Handles proper `htmlFor`, `aria-describedby`, and `aria-errormessage` relationships automatically
- **Focus management**: Built-in focus ring visibility and keyboard navigation support
- **Storybook integration**: Provides interactive examples for rapid prototyping

## Research Notes
- Documentation is clear and focused on the compositional pattern rather than prop-heavy configuration
- The Field component itself is a lightweight wrapper; most functionality comes from proper composition of sub-components
- Error text visibility is likely controlled by conditional rendering rather than a built-in toggle
- Integration with form libraries happens at the parent level; Field remains a presentational component
- The component follows Chakra UI v3 patterns with improved composition and cleaner APIs compared to v2
- Additional resources (GitHub source, Storybook examples, Ark UI docs) are readily accessible for deeper implementation details
- No difficulties accessing documentation; the page loaded successfully and provided comprehensive information
