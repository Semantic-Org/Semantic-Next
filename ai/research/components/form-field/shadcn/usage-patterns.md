# ShadCN - Form Field Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/form
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

**Important Note**: Documentation explicitly states: "We are not actively developing this component anymore." Users are directed toward the newer `<Field />` component for new implementations.

## Documentation Quality
Basic - Single primary example with minimal variation, focuses on anatomy and basic patterns rather than comprehensive usage patterns.

## Component Definition
- **Core purpose**: Provide a composable, accessible wrapper around react-hook-form for building type-safe forms with schema validation
- **Mental model**: A composition-based form system where multiple components work together to create accessible form fields
- **Semantic meaning**: A structured form field that maintains proper HTML semantics and ARIA relationships for accessibility

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `control={form.control}`)
- **Composed**: Via composition/children (e.g., `<FormField><FormItem><FormLabel>`)
- **CSS-only**: Requires custom styling (e.g., `className="space-y-8"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label association | ✅ | Composed | `<FormLabel>` within `<FormItem>`, uses React.useId() for unique IDs and proper HTML association |
| Help text | ✅ | Composed | `<FormDescription>` component provides helper text below the input |
| Error messages | ✅ | Composed | `<FormMessage>` automatically displays validation errors from react-hook-form |
| Required indicator | ⚠️ | CSS-only | No dedicated component; must be added manually to label or via schema validation messaging |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Invalid/Error | ✅ | Native | Handled through react-hook-form validation state, ARIA attributes applied automatically |
| Disabled | ⚠️ | Native | Supported through native HTML disabled attribute, not shown in examples |
| Required | ✅ | Native | Handled through Zod schema validation (e.g., `.min(2)`) |
| Read-only | ❌ | Native | Not documented, but HTML readonly attribute should work |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical layout | ✅ | CSS-only | Default pattern, using `className="space-y-8"` on form element |
| Horizontal layout | ❌ | CSS-only | Not shown, but stated: "You have full control over the markup and styling" |
| Inline layout | ❌ | CSS-only | Not documented, requires custom CSS classes |
| Label placement | ✅ | Composed | Default top placement through component order, other placements require custom layout |

## Validation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Built-in validation | ✅ | Native | Zod schema with zodResolver integration for declarative validation |
| Custom validation | ✅ | Native | Supported through Zod custom refinements and react-hook-form validation functions |
| Real-time validation | ✅ | Native | Provided by react-hook-form's built-in capabilities, validates on change/blur |
| Error message display | ✅ | Composed | `<FormMessage>` automatically shows validation errors with proper ARIA attributes |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Form library integration | ✅ | Native | Built specifically for react-hook-form with `control` prop and render pattern |
| Native HTML form | ✅ | Native | Uses standard `<form>` element with `onSubmit={form.handleSubmit(onSubmit)}` |
| Controlled components | ✅ | Native | All fields are controlled via react-hook-form, requires `defaultValues` for each field |
| Uncontrolled components | ❌ | N/A | Pattern is designed for controlled components only |

## Code Examples

### Primary Usage Example
```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Installation
```bash
pnpm dlx shadcn@latest add form
```

### Component Anatomy
```tsx
<Form>
  <FormField
    control={...}
    name="..."
    render={({ field }) => (
      <FormItem>
        <FormLabel />
        <FormControl>
          {/* Your form field component */}
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

[View Live](https://ui.shadcn.com/docs/components/form) *(Documentation page, no interactive demo visible)*

## Notable Features

1. **Type-Safe Forms**: Full TypeScript support with Zod schema inference for compile-time type safety
2. **Composable Architecture**: Seven distinct components (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`) that work together
3. **Automatic ARIA Attributes**: Applies proper accessibility attributes based on field states without manual configuration
4. **Unique ID Generation**: Uses `React.useId()` for proper label-input association
5. **Schema Agnostic**: While examples use Zod, the architecture supports other validation libraries
6. **Render Props Pattern**: `FormField` uses render props for maximum flexibility with field rendering
7. **Client & Server Validation**: Supports both client-side and server-side validation approaches
8. **Radix UI Integration**: Built on top of Radix UI primitives for accessibility foundation
9. **Full Styling Control**: Emphasizes "You have full control over the markup and styling"
10. **Deprecated Status**: Component is no longer actively developed; newer `Field` component recommended for new projects

## Research Notes

### Documentation Accessibility
- Documentation loads successfully without issues
- Navigation clear with previous (Field) and next (Hover Card) components listed
- Related resources link to comprehensive forms guide at `/docs/forms`

### Framework Approach Observations

**Strengths**:
- Strong emphasis on accessibility with automatic ARIA attribute management
- Type safety integration is thorough with Zod and TypeScript
- Composition pattern provides flexibility while maintaining structure
- Clear separation of concerns (label, control, description, message as separate components)

**Limitations**:
- Minimal code examples (only one basic example shown)
- No documentation for common variations (checkboxes, selects, radio groups, etc.)
- Layout patterns not demonstrated (horizontal, inline, grid layouts)
- State variations (disabled, read-only) not shown in examples
- No interactive demos or playground
- Component is deprecated in favor of newer Field component

**Pattern Analysis**:
- Heavy reliance on react-hook-form as underlying engine
- Required tight coupling with Zod for validation (though stated as optional)
- Controlled-only approach, no uncontrolled field support
- Render props pattern for field rendering may be verbose for simple forms
- Seven components required for a single field indicates high composition complexity

**Comparison Considerations**:
- This is a React-specific implementation with no web component or framework-agnostic patterns
- Validation is external (Zod) rather than built into component system
- Accessibility features are automatic rather than exposed as props
- No native support for field arrays, conditional fields, or complex form layouts documented
- Documentation quality is minimal compared to more comprehensive component libraries

### Implementation Notes
- Component installed via CLI tool: `pnpm dlx shadcn@latest add form`
- Creates local copies of components in project (not consumed as external package)
- Requires React 18+ for `useId()` hook
- TypeScript is required for full functionality (schema inference)
- Next.js "use client" directive needed for client components
