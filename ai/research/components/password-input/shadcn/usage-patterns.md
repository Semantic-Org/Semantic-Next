# ShadCN - Password Input Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/input
Status: ✅ Working
Version: Not explicitly versioned (latest as of 2025-11-05)
Last Verified: 2025-11-05

## Documentation Quality

ShadCN's Input component documentation is minimal and focused on basic usage patterns. Password input functionality is not explicitly documented as a distinct component pattern. Instead, password inputs are expected to be implemented using the standard Input component with `type="password"` combined with custom enhancement patterns.

**Documentation Characteristics:**
- **Coverage**: Basic - covers essential usage but lacks password-specific examples
- **Code Examples**: Limited to generic input patterns (email, file, disabled, with label, with button)
- **API Reference**: Not present - relies on standard HTML input attributes
- **Accessibility**: Not explicitly documented for password inputs
- **Password Patterns**: Not documented officially - community-driven patterns exist

**Notable Absence**: No official password input pattern with visibility toggle in the core documentation, though this is a common user need addressed by community implementations.

## Component Definition

- **Core purpose**: The Input component provides a styled foundation for all HTML input types, including password inputs. For password-specific functionality (like visibility toggling), developers are expected to compose custom solutions using the base Input component with additional UI elements.

- **Mental model**: ShadCN follows a copy-paste distribution model where components are copied into your project rather than installed as dependencies. The Input is a styled HTML input wrapper that accepts all standard input attributes. Password functionality is achieved through `type="password"` on the standard Input component.

- **Semantic meaning**: A form input field that accepts user data. When used with `type="password"`, it provides password-specific browser behaviors (obscured characters, password managers, autocomplete suggestions).

## Pattern Support Levels

- **Native**: Standard HTML password input using `type="password"` on the Input component. This includes browser-default obscured character display and native password manager integration.

- **Composed**: Enhanced password input with visibility toggle (show/hide password). This pattern requires composing the Input component with Button components and icons, creating a custom PasswordInput wrapper component. Not provided by default but commonly implemented by users.

- **CSS-only**: Basic styling through Tailwind classes. Password-specific visual states (error states, strength indicators) require custom implementation using Tailwind utilities and data attributes.

## Core Patterns

### Base Input Types

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic password input | ✅ | Native | Standard Input with `type="password"` attribute |
| Email input | ✅ | Native | `type="email"` with browser validation |
| File input | ✅ | Native | `type="file"` for file uploads |
| Text input | ✅ | Native | Default `type="text"` |
| Number input | ✅ | Native | `type="number"` for numeric values |
| Date/Time inputs | ✅ | Native | All HTML5 date/time input types supported |

### Password-Specific Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic password field | ✅ | Native | `<Input type="password" />` |
| Password visibility toggle | ❌ | Composed | Requires custom PasswordInput component with state and button |
| Password strength indicator | ❌ | Composed | No built-in support - requires custom implementation |
| Password validation | ❌ | Composed | Must use Form component with validation library (Zod, etc.) |
| Password confirmation matching | ❌ | Composed | Form-level validation logic required |
| Password autocomplete control | ✅ | Native | Standard `autoComplete` HTML attribute |
| Password generator | ❌ | Composed | Not supported - would require custom component |
| Caps lock warning | ❌ | Composed | Not supported - would require custom implementation |

### Input States

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled state | ✅ | Native | `disabled` prop with visual styling |
| Placeholder text | ✅ | Native | `placeholder` attribute |
| Default value | ✅ | Native | `defaultValue` for uncontrolled inputs |
| Controlled value | ✅ | Native | `value` prop with `onChange` handler |
| Read-only state | ✅ | Native | `readOnly` attribute |
| Required field | ✅ | Native | `required` attribute |
| Error state | ❌ | Composed | Requires Form component or custom styling |

### Composition Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| With Label | ✅ | Composed | Label component wrapping or adjacent to Input |
| With Button | ✅ | Composed | Button adjacent to Input (e.g., password reveal) |
| With validation message | ❌ | Composed | Requires Form component integration |
| With character counter | ❌ | Composed | Custom implementation required |
| With icons/prefix/suffix | ❌ | Composed | Custom wrapper component needed |

### Form Integration

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| React Hook Form | ✅ | Composed | Works via `ref` forwarding and standard props |
| Form component | ✅ | Composed | ShadCN Form component with Zod validation |
| Native form submission | ✅ | Native | Standard `name` attribute for form data |
| Field-level validation | ✅ | Composed | Via Form component and validation library |

## Code Examples

### Basic Password Input

```tsx
import { Input } from "@/components/ui/input"

export function BasicPasswordInput() {
  return <Input type="password" placeholder="Enter password" />
}
```

### Password Input with Label

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordWithLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="password">Password</Label>
      <Input type="password" id="password" placeholder="Enter password" />
    </div>
  )
}
```

### Disabled Password Input

```tsx
import { Input } from "@/components/ui/input"

export function DisabledPassword() {
  return <Input disabled type="password" placeholder="Password" />
}
```

### Controlled Password Input

```tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function ControlledPassword() {
  const [password, setPassword] = useState("")

  return (
    <Input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter password"
    />
  )
}
```

### Password Input with Autocomplete

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordWithAutocomplete() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="current-password">Current Password</Label>
      <Input
        type="password"
        id="current-password"
        autoComplete="current-password"
      />
    </div>
  )
}
```

### Custom Password Input with Visibility Toggle (Community Pattern)

```tsx
'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const disabled =
      props.value === '' ||
      props.value === undefined ||
      props.disabled

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('hide-password-toggle pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2
                     hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword && !disabled ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>

        {/* Hide browser default password reveal button */}
        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
export { PasswordInput }
```

### Using Custom Password Input

```tsx
"use client"

import { useState } from "react"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function PasswordInputExample() {
  const [password, setPassword] = useState("")

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Enter password"
        />
      </div>
      <Button type="submit">Save</Button>
    </div>
  )
}
```

### Password Input with Form Component

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export function PasswordFormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters with uppercase, lowercase, and number.
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

### Confirm Password Pattern

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function ConfirmPasswordExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Account</Button>
      </form>
    </Form>
  )
}
```

## Styling Approaches

### Base Input Component Structure

The Input component is implemented as a simple styled wrapper around the HTML input element:

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background",
          "px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### CSS Variable Theming

ShadCN uses CSS variables for theming, defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --muted-foreground: 215.4 16.3% 46.9%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --muted-foreground: 215.4 16.3% 56.9%;
  /* ... other variables */
}
```

### Tailwind Class Breakdown

| Class Group | Purpose | Classes |
|-------------|---------|---------|
| **Layout** | Flexbox and sizing | `flex h-10 w-full` |
| **Border** | Border radius and color | `rounded-md border border-input` |
| **Background** | Background color | `bg-background` |
| **Spacing** | Padding | `px-3 py-2` |
| **Typography** | Font size | `text-sm` |
| **Focus** | Focus ring styling | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| **Disabled** | Disabled state | `disabled:cursor-not-allowed disabled:opacity-50` |
| **File Input** | File input specific | `file:border-0 file:bg-transparent file:text-sm file:font-medium` |
| **Placeholder** | Placeholder styling | `placeholder:text-muted-foreground` |

### Customization Patterns

#### Custom Size Variants

```tsx
// Small password input
<Input
  type="password"
  className="h-8 text-xs px-2 py-1"
  placeholder="Small password"
/>

// Large password input
<Input
  type="password"
  className="h-12 text-base px-4 py-3"
  placeholder="Large password"
/>
```

#### Custom Border/Colors

```tsx
// Error state styling
<Input
  type="password"
  className="border-red-500 focus-visible:ring-red-500"
  placeholder="Invalid password"
/>

// Success state styling
<Input
  type="password"
  className="border-green-500 focus-visible:ring-green-500"
  placeholder="Valid password"
/>
```

#### Dark Mode Support

```tsx
<Input
  type="password"
  className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
  placeholder="Dark mode password"
/>
```

#### With Icons/Prefix

```tsx
import { Lock } from "lucide-react"

// Custom wrapper for icon prefix
<div className="relative">
  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    type="password"
    className="pl-10"
    placeholder="Password"
  />
</div>
```

### Password Input Specific Styling Considerations

1. **Browser Default Password Reveal**: Some browsers (Edge, IE) show a built-in reveal button. Hide it with CSS:
```css
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}
```

2. **Monospace Font for Passwords**: Some designs use monospace for password visibility:
```tsx
<Input type="password" className="font-mono" />
```

3. **Password Strength Indicator Styling**: Requires custom implementation:
```tsx
<div className="space-y-2">
  <Input type="password" />
  <div className="flex gap-1">
    <div className="h-1 flex-1 bg-red-500 rounded" />
    <div className="h-1 flex-1 bg-gray-200 rounded" />
    <div className="h-1 flex-1 bg-gray-200 rounded" />
    <div className="h-1 flex-1 bg-gray-200 rounded" />
  </div>
  <p className="text-xs text-muted-foreground">Weak password</p>
</div>
```

## Accessibility Patterns

### Keyboard Navigation

The Input component supports standard HTML input keyboard navigation:

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from input |
| `Shift + Tab` | Move focus backward |
| `Ctrl/Cmd + A` | Select all text |
| `Home` | Move cursor to start |
| `End` | Move cursor to end |
| `Left/Right Arrow` | Move cursor character by character |
| `Ctrl/Cmd + Left/Right` | Move cursor word by word |

For custom password visibility toggle button:

| Key | Action |
|-----|--------|
| `Space` or `Enter` | Toggle password visibility |

### ARIA Attributes

The base Input component automatically receives appropriate ARIA attributes through standard HTML input behavior. For password inputs, these should be enhanced:

```tsx
// Basic password with label association
<div>
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    aria-describedby="password-requirements"
  />
  <p id="password-requirements" className="text-sm text-muted-foreground">
    Must be at least 8 characters
  </p>
</div>

// Error state
<div>
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    aria-invalid="true"
    aria-describedby="password-error"
  />
  <p id="password-error" className="text-sm text-red-500" role="alert">
    Password is required
  </p>
</div>

// Required field
<div>
  <Label htmlFor="password">
    Password <span className="text-red-500">*</span>
  </Label>
  <Input
    id="password"
    type="password"
    required
    aria-required="true"
  />
</div>
```

### Screen Reader Support

**Best Practices:**

1. **Always use labels**: Associate Label component with Input via `htmlFor` and `id`
```tsx
<Label htmlFor="password">Password</Label>
<Input id="password" type="password" />
```

2. **Provide descriptive text**: Use `aria-describedby` for requirements/hints
```tsx
<Input
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">Must contain uppercase, lowercase, and number</p>
```

3. **Screen reader only text**: For visibility toggle buttons
```tsx
<Button onClick={toggleVisibility}>
  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
  <span className="sr-only">
    {showPassword ? 'Hide password' : 'Show password'}
  </span>
</Button>
```

4. **Error announcements**: Use `role="alert"` for error messages
```tsx
<p id="password-error" role="alert" className="text-sm text-red-500">
  Password must be at least 8 characters
</p>
```

5. **Autocomplete attributes**: Help screen readers and password managers
```tsx
// New password
<Input type="password" autoComplete="new-password" />

// Current password
<Input type="password" autoComplete="current-password" />

// Username for password context
<Input type="text" autoComplete="username" />
```

### Focus Management

```tsx
// Auto-focus password field on mount
<Input type="password" autoFocus />

// Programmatic focus management
const passwordRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  if (showPasswordField) {
    passwordRef.current?.focus()
  }
}, [showPasswordField])

<Input ref={passwordRef} type="password" />
```

### Accessibility Checklist for Password Inputs

- ✅ **Label association**: Every password input has an associated label
- ✅ **Focus indicators**: Clear visible focus ring (provided by default)
- ✅ **Keyboard navigation**: All functionality accessible via keyboard
- ✅ **Error identification**: Validation errors are clearly announced
- ✅ **Sufficient contrast**: Text meets WCAG AA standards (4.5:1)
- ✅ **Touch targets**: Minimum 44x44px clickable area (including label)
- ✅ **Autocomplete support**: Proper `autoComplete` attributes
- ✅ **Screen reader text**: Hidden labels for icon buttons
- ✅ **Error recovery**: Clear instructions for fixing errors
- ✅ **Time limits**: No time pressure for password entry

## Notable Features

### Copy-Paste Distribution Model

ShadCN's defining characteristic is its copy-paste approach:
- Components are copied into your project (`components/ui/`) rather than installed as npm dependencies
- Full ownership and customization control
- No library lock-in or update dependencies
- Direct source code modification encouraged

### Minimal API Surface

The Input component is intentionally minimal:
- Extends standard HTML input attributes
- No custom props beyond `className`
- Relies on composition for advanced features
- Type safety through TypeScript

### Radix UI Foundation

While the Input component itself is simple, it's designed to work with ShadCN's Form component which is built on:
- `@radix-ui/react-label` for accessible labels
- React Hook Form for form state management
- Zod for validation schemas
- Type-safe form handling

### Tailwind CSS Integration

- All styling via Tailwind utility classes
- CSS variables for theming
- Dark mode support through Tailwind's dark variant
- Responsive utilities fully supported

### Browser Compatibility Considerations

The Input component handles various browser quirks:
- File input button styling (`file:` modifiers)
- Focus-visible for keyboard-only focus rings
- Placeholder styling consistency
- Password reveal button hiding (requires additional CSS for IE/Edge)

### No Built-in Password Features

Unlike specialized libraries, ShadCN Input intentionally omits:
- Password visibility toggle (must build custom component)
- Password strength indicators
- Password generation
- Caps lock warnings
- Password validation UI

This is consistent with ShadCN's philosophy of providing minimal, composable primitives rather than feature-complete components.

## Research Notes

### Community-Driven Password Patterns

While ShadCN doesn't provide official password input enhancements, the community has developed consistent patterns:

1. **Visibility Toggle**: Most common pattern uses:
   - Relative container div
   - Input with extra right padding (`pr-10`)
   - Absolutely positioned Button
   - Eye icons from lucide-react
   - State to toggle between `type="text"` and `type="password"`

2. **Common Dependencies for Password UI**:
   - `lucide-react` for Eye/EyeOff icons
   - `react-hook-form` for form handling
   - `zod` for validation
   - `@hookform/resolvers` for Zod integration

3. **Accessibility Pattern**: Community implementations typically include:
   - Screen reader text for toggle button
   - Disabled state when input is empty
   - Proper button type (`type="button"` to prevent form submission)
   - ARIA hidden on icons

### Comparison to Other Frameworks

Unlike frameworks that provide dedicated password components (MUI's TextField, Ant Design's Input.Password), ShadCN:
- Provides lower-level primitives
- Requires more manual composition
- Offers more customization flexibility
- Has smaller bundle size (only what you use)
- Needs more setup for common features

### Implementation Gotchas

1. **Browser Password Reveal**: Edge/IE show native reveal buttons that conflict with custom toggles. Must hide with CSS.

2. **Password Managers**: Proper `autoComplete` attributes are critical for password manager compatibility:
   - `autoComplete="new-password"` for registration
   - `autoComplete="current-password"` for login

3. **Form Integration**: Direct usage of `register` from react-hook-form doesn't work well. Better to use `Controller` or manual `value`/`onChange`.

4. **TypeScript Strictness**: Input accepts any valid HTML input attribute, so type checking relies on standard DOM types.

### Password Validation Patterns

Common Zod validation patterns for passwords:

```tsx
// Minimum length
z.string().min(8, "Password must be at least 8 characters")

// Complexity requirements
z.string()
  .min(8)
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[a-z]/, "Must contain lowercase")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^A-Za-z0-9]/, "Must contain special character")

// Password confirmation
z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})
```

### Design System Integration

ShadCN's CSS variable system makes it easy to integrate with design systems:

```css
/* Custom theme for password inputs */
:root {
  --input-password-bg: 220 13% 95%;
  --input-password-border: 220 13% 85%;
  --input-password-focus: 217 91% 60%;
}

.dark {
  --input-password-bg: 220 13% 15%;
  --input-password-border: 220 13% 25%;
  --input-password-focus: 217 91% 50%;
}
```

### Performance Considerations

- **Controlled vs Uncontrolled**: Use `defaultValue` for uncontrolled inputs to avoid re-renders
- **Validation Debouncing**: Debounce validation in forms with expensive checks
- **Lazy Icon Loading**: Icons from lucide-react are tree-shakeable
- **Minimal Re-renders**: Input component is simple enough to not need memoization

### Testing Recommendations

```tsx
// Test password visibility toggle
const { getByLabelText, getByRole } = render(<PasswordInput />)
const input = getByLabelText(/password/i)
const toggleButton = getByRole('button', { name: /show password/i })

expect(input).toHaveAttribute('type', 'password')
fireEvent.click(toggleButton)
expect(input).toHaveAttribute('type', 'text')

// Test validation
const { getByText } = render(<PasswordForm />)
const submitButton = getByRole('button', { name: /submit/i })

fireEvent.click(submitButton)
expect(await findByText(/password is required/i)).toBeInTheDocument()
```

### Migration from Other Libraries

When migrating from libraries with built-in password components:

**From MUI:**
```tsx
// Before (MUI)
<TextField type="password" />

// After (ShadCN)
<Input type="password" />
```

**From Ant Design:**
```tsx
// Before (Ant Design)
<Input.Password />

// After (ShadCN - requires custom component)
<PasswordInput />
```

**From Chakra UI:**
```tsx
// Before (Chakra)
<Input type="password" />

// After (ShadCN)
<Input type="password" />
```

### Future Considerations

Based on community patterns, future additions to ShadCN might include:
- Official PasswordInput component with visibility toggle
- Password strength indicator component
- Form field composition helpers
- More authentication examples

However, the copy-paste model means users can implement these patterns themselves without waiting for official releases.
