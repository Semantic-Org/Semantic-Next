# ShadCN Checkbox - Usage Patterns Report

## 1. Component Overview

The ShadCN Checkbox is a control that allows users to toggle between checked, unchecked, and indeterminate states. Built on Radix UI's accessible primitives and styled with Tailwind CSS, it follows the **copy-paste distribution model** - meaning the component code is copied directly into your project rather than installed as an npm package dependency. This approach gives developers full ownership and customization control over the component while leveraging Radix UI's robust accessibility foundation and battle-tested interaction patterns.

The checkbox adheres to the tri-state Checkbox WAI-ARIA design pattern and integrates seamlessly with React Hook Form for form validation and state management.

## 2. Installation/Setup

### CLI Installation (Recommended)

```bash
# Using pnpm
pnpm dlx shadcn@latest add checkbox

# Using npx
npx shadcn@latest add checkbox

# Using yarn
yarn dlx shadcn@latest add checkbox
```

This command copies the checkbox component file into your project at `components/ui/checkbox.tsx`.

### Manual Installation

If you prefer manual setup or need to understand the dependencies:

1. **Install Radix UI Checkbox Primitive:**
   ```bash
   npm install @radix-ui/react-checkbox
   ```

2. **Install Lucide React (for icons):**
   ```bash
   npm install lucide-react
   ```

3. **Create the component file** at `components/ui/checkbox.tsx` with the implementation (see Implementation section below)

4. **Ensure you have the `cn` utility** for class merging (typically from `lib/utils.ts`):
   ```typescript
   import { clsx } from "clsx"
   import { twMerge } from "tailwind-merge"

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   ```

### Dependencies

- `@radix-ui/react-checkbox` - Unstyled, accessible checkbox primitive
- `lucide-react` - Icon library (provides Check icon)
- `react` - React 16.8+ (requires hooks support)
- `tailwindcss` - For styling utilities
- `class-variance-authority` (optional) - For variant styling patterns
- `clsx` and `tailwind-merge` - For the `cn()` utility

## 3. Basic Usage

### Simple Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxDemo() {
  return <Checkbox id="terms" />
}
```

### Checkbox with Label

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxWithLabel() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
```

### Controlled Checkbox

```tsx
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export function ControlledCheckbox() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}
```

### Uncontrolled with Default State

```tsx
import { Checkbox } from "@/components/ui/checkbox"

export function UncontrolledCheckbox() {
  return <Checkbox defaultChecked />
}
```

## 4. Props/API

The Checkbox component extends `React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>`, inheriting all Radix UI Checkbox.Root props plus standard HTML attributes.

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | `undefined` | The controlled checked state. Can be `true`, `false`, or `'indeterminate'`. |
| `defaultChecked` | `boolean` | `false` | The default checked state when uncontrolled. |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | `undefined` | Event handler called when the checked state changes. |
| `disabled` | `boolean` | `false` | When true, prevents user interaction and shows disabled styling. |
| `required` | `boolean` | `false` | When true, indicates the checkbox must be checked. |
| `name` | `string` | `undefined` | The name of the checkbox for form submissions. |
| `value` | `string` | `'on'` | The value submitted with form data when checked. |
| `id` | `string` | `undefined` | The id attribute for associating with labels. |
| `className` | `string` | `undefined` | Additional CSS classes to apply (merged with default styles via `cn()`). |

### Additional Props (from Radix UI)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Change the default rendered element for the one passed as a child. |
| `form` | `string` | `undefined` | Associates the checkbox with a form by form id. |
| `aria-label` | `string` | `undefined` | Accessible label when visual label isn't present. |
| `aria-labelledby` | `string` | `undefined` | ID of element that labels the checkbox. |
| `aria-describedby` | `string` | `undefined` | ID of element that describes the checkbox. |
| `aria-invalid` | `boolean` | `false` | Indicates validation state for form integration. |

### Data Attributes (for styling)

The Checkbox automatically applies data attributes based on its state:

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-state` | `"checked" \| "unchecked" \| "indeterminate"` | The current state of the checkbox. |
| `data-disabled` | `""` (present when disabled) | Present when the checkbox is disabled. |

## 5. Underlying Implementation

### Radix UI Primitives Used

The ShadCN Checkbox is built using two Radix UI primitives:

1. **`CheckboxPrimitive.Root`** - The main checkbox container
   - Renders as a `<button>` element with `role="checkbox"`
   - Automatically creates a hidden `<input type="checkbox">` when used within a `<form>` for proper form submission
   - Handles all keyboard navigation and accessibility attributes
   - Manages checked/unchecked/indeterminate state

2. **`CheckboxPrimitive.Indicator`** - The visual indicator container
   - Only renders its children when checkbox is in checked or indeterminate state
   - Provides smooth transition animations
   - Can contain icons or custom visual indicators

### Component Structure

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary",
      "ring-offset-background focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

### How It Works

1. **Client Component**: Uses `"use client"` directive for Next.js App Router compatibility
2. **Forward Ref**: Supports ref forwarding to access the underlying DOM element
3. **Type Safety**: TypeScript types ensure proper prop usage and autocomplete
4. **Class Merging**: `cn()` utility merges Tailwind classes, allowing customization without conflicts
5. **Primitive Wrapping**: Wraps Radix primitives with ShadCN's styling conventions
6. **Automatic Form Integration**: When placed in a `<form>`, Radix automatically renders a hidden input for form submission

## 6. Variants & Patterns

### Checked/Unchecked/Indeterminate States

```tsx
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxStates() {
  const [state, setState] = useState<boolean | 'indeterminate'>('indeterminate')

  return (
    <div className="space-y-4">
      {/* Unchecked */}
      <Checkbox checked={false} />

      {/* Checked */}
      <Checkbox checked={true} />

      {/* Indeterminate (for parent checkboxes in hierarchical lists) */}
      <Checkbox
        checked={state}
        onCheckedChange={setState}
      />
    </div>
  )
}
```

**Note**: To display the indeterminate state properly, you need to modify the component to include a Minus icon:

```tsx
import { Check, Minus } from "lucide-react"

// In the Indicator section:
<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
  {props.checked === 'indeterminate' ? (
    <Minus className="h-4 w-4" />
  ) : (
    <Check className="h-4 w-4" />
  )}
</CheckboxPrimitive.Indicator>
```

### Disabled State

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function DisabledCheckbox() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled" className="text-muted-foreground">
        Disabled option
      </Label>
    </div>
  )
}
```

### With Label and Description

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxWithDescription() {
  return (
    <div className="flex items-start gap-3">
      <Checkbox id="marketing" defaultChecked />
      <div className="grid gap-2">
        <Label htmlFor="marketing">Marketing emails</Label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  )
}
```

### Styled Variant with Custom Colors

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function StyledCheckbox() {
  return (
    <Label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
      <Checkbox
        id="styled"
        defaultChecked
        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
      />
      <div className="grid gap-1.5 font-normal">
        <p className="text-sm font-medium leading-none">
          Enable notifications
        </p>
        <p className="text-sm text-muted-foreground">
          You can manage your notification preferences.
        </p>
      </div>
    </Label>
  )
}
```

### In Forms with React Hook Form

```tsx
import { useForm, Controller } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type FormData = {
  terms: boolean
  marketing: boolean
}

export function CheckboxForm() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      terms: false,
      marketing: false,
    }
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="terms"
        control={control}
        rules={{ required: "You must accept the terms" }}
        render={({ field, fieldState }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <Label htmlFor="terms">Accept terms and conditions *</Label>
          </div>
        )}
      />

      <Controller
        name="marketing"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Checkbox
              id="marketing"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="marketing">Receive marketing emails</Label>
          </div>
        )}
      />

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### Checkbox Group (Multiple Selection)

```tsx
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const items = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
  { id: "angular", label: "Angular" },
]

export function CheckboxGroup() {
  const [selected, setSelected] = useState<string[]>([])

  const handleChange = (id: string, checked: boolean) => {
    setSelected(prev =>
      checked
        ? [...prev, id]
        : prev.filter(item => item !== id)
    )
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3">
          <Checkbox
            id={item.id}
            checked={selected.includes(item.id)}
            onCheckedChange={(checked) => handleChange(item.id, checked as boolean)}
          />
          <Label htmlFor={item.id}>{item.label}</Label>
        </div>
      ))}
      <p className="text-sm text-muted-foreground">
        Selected: {selected.join(", ") || "None"}
      </p>
    </div>
  )
}
```

### Parent-Child Checkboxes with Indeterminate State

```tsx
import { useState, useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const frameworks = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
]

export function ParentChildCheckboxes() {
  const [selected, setSelected] = useState<string[]>([])

  const parentState = useMemo(() => {
    if (selected.length === 0) return false
    if (selected.length === frameworks.length) return true
    return 'indeterminate'
  }, [selected])

  const handleParentChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelected(frameworks.map(f => f.id))
    } else {
      setSelected([])
    }
  }

  const handleChildChange = (id: string, checked: boolean) => {
    setSelected(prev =>
      checked
        ? [...prev, id]
        : prev.filter(item => item !== id)
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 font-medium">
        <Checkbox
          checked={parentState}
          onCheckedChange={handleParentChange}
          id="select-all"
        />
        <Label htmlFor="select-all">Select all frameworks</Label>
      </div>

      <div className="ml-6 space-y-2">
        {frameworks.map(framework => (
          <div key={framework.id} className="flex items-center gap-3">
            <Checkbox
              id={framework.id}
              checked={selected.includes(framework.id)}
              onCheckedChange={(checked) => handleChildChange(framework.id, checked as boolean)}
            />
            <Label htmlFor={framework.id}>{framework.label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 7. Composition Patterns

### With Form Component

ShadCN provides a Form component that works with React Hook Form. The checkbox integrates seamlessly:

```tsx
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
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  marketing: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export function FormWithCheckbox() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketing: false,
      terms: false,
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
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Marketing emails</FormLabel>
                <FormDescription>
                  Receive emails about new products and features.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### With Card Component

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox id="notifications" defaultChecked />
            <Label htmlFor="notifications">Push notifications</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="emails" />
            <Label htmlFor="emails">Email updates</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### As Filter Options

```tsx
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const categories = ["Electronics", "Clothing", "Books", "Home & Garden"]

export function FilterCheckboxes() {
  const [filters, setFilters] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Filter by category</h3>
      <div className="space-y-2">
        {categories.map(category => (
          <div key={category} className="flex items-center gap-2">
            <Checkbox
              id={category}
              checked={filters.includes(category)}
              onCheckedChange={(checked) => {
                setFilters(prev =>
                  checked
                    ? [...prev, category]
                    : prev.filter(c => c !== category)
                )
              }}
            />
            <Label htmlFor={category} className="text-sm font-normal">
              {category}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 8. Styling & Theming

### Default Styling Approach

ShadCN uses Tailwind CSS classes with the `cn()` utility for merging classes:

```tsx
// Base styling classes
className={cn(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary",
  "ring-offset-background focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  className // User's custom classes
)}
```

### CSS Variables for Theming

ShadCN uses CSS variables defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --ring: 222.2 84% 4.9%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --ring: 212.7 26.8% 83.9%;
  /* ... other variables */
}
```

### Customization Approaches

#### 1. Via className Prop

```tsx
<Checkbox className="h-6 w-6 rounded-lg border-2 border-purple-500 data-[state=checked]:bg-purple-500" />
```

#### 2. Using Data Attributes

```tsx
<Checkbox className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
```

#### 3. Dark Mode Support

```tsx
<Checkbox className="dark:border-slate-700 dark:data-[state=checked]:bg-slate-100 dark:data-[state=checked]:text-slate-900" />
```

#### 4. Creating Variants with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const checkboxVariants = cva(
  "peer shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
      variant: {
        default: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        destructive: "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
        success: "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

// Usage
<Checkbox className={checkboxVariants({ size: "lg", variant: "success" })} />
```

#### 5. With Container Styling (has-[] selector)

```tsx
<Label className="has-[[aria-checked=true]]:bg-blue-50 has-[[aria-checked=true]]:border-blue-600">
  <Checkbox />
  <span>Option text</span>
</Label>
```

### Theming Best Practices

1. **Use CSS Variables**: Leverage ShadCN's CSS variable system for consistent theming
2. **Respect Dark Mode**: Always provide dark mode variants
3. **Maintain Accessibility**: Don't reduce contrast or remove focus indicators
4. **Use Data Attributes**: Prefer `data-[state=checked]` over custom state classes
5. **Keep Consistent Sizing**: Use size variants rather than arbitrary sizes

## 9. Accessibility

### ARIA Attributes

The Radix UI Checkbox primitive automatically provides:

- `role="checkbox"` - Identifies the element as a checkbox
- `aria-checked="true|false|mixed"` - Communicates the checked state (mixed = indeterminate)
- `aria-disabled="true"` - Indicates disabled state
- `aria-required="true"` - Indicates required fields
- `aria-invalid="true"` - Indicates validation errors
- `aria-labelledby` - Associates with label elements
- `aria-describedby` - Associates with description elements

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` | Toggles the checkbox |
| `Tab` | Moves focus to/from the checkbox |
| `Shift + Tab` | Moves focus backward |

### Focus Management

- Clear focus indicators with `focus-visible:ring-2`
- Focus ring respects system preferences (visible only with keyboard navigation)
- Focus ring offset prevents overlap with component borders

### Screen Reader Support

```tsx
// With visible label
<div className="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>

// With aria-label (no visible label)
<Checkbox aria-label="Accept terms and conditions" />

// With aria-labelledby
<div>
  <Checkbox id="terms" aria-labelledby="terms-label" />
  <span id="terms-label">Accept terms</span>
</div>

// With description
<div className="flex items-start gap-3">
  <Checkbox id="marketing" aria-describedby="marketing-description" />
  <div>
    <Label htmlFor="marketing">Marketing emails</Label>
    <p id="marketing-description" className="text-sm text-muted-foreground">
      Receive updates about new products
    </p>
  </div>
</div>
```

### Form Integration Accessibility

When used in forms, Radix automatically renders a hidden `<input type="checkbox">` that:

- Participates in form submission
- Works with native form validation
- Supports `name` and `value` attributes
- Fires native `change` events

### Best Practices for Accessibility

1. **Always provide labels**: Use `Label` component with `htmlFor` matching checkbox `id`
2. **Use meaningful labels**: Avoid generic text like "Click here"
3. **Group related checkboxes**: Use `<fieldset>` and `<legend>` for checkbox groups
4. **Indicate required fields**: Use `required` prop and visual indicators
5. **Provide error messages**: Use `aria-invalid` and `aria-describedby` for errors
6. **Test with screen readers**: Verify announcement patterns with NVDA/JAWS/VoiceOver
7. **Ensure sufficient contrast**: Maintain WCAG AA contrast ratios (4.5:1 minimum)
8. **Make clickable areas large enough**: Minimum 44x44px touch target (include label)

## 10. Best Practices

### When to Use Checkboxes

**Use checkboxes when:**

- Users can select multiple options from a list
- Users need to enable/disable a single setting
- Confirming agreement (e.g., terms and conditions)
- Showing parent-child relationships with indeterminate states
- Building filter interfaces

**Don't use checkboxes when:**

- Only one option can be selected (use Radio buttons instead)
- Triggering immediate actions (use Switch or Toggle instead)
- Binary on/off states that take effect immediately (use Switch)

### Common Customizations

#### 1. Custom Icon

```tsx
import { CheckboxPrimitive } from "@radix-ui/react-checkbox"
import { CheckCircle } from "lucide-react"

<CheckboxPrimitive.Indicator>
  <CheckCircle className="h-4 w-4" />
</CheckboxPrimitive.Indicator>
```

#### 2. Animated Checkbox

```tsx
<CheckboxPrimitive.Indicator className="flex items-center justify-center transition-all data-[state=checked]:scale-100 data-[state=unchecked]:scale-0">
  <Check className="h-4 w-4" />
</CheckboxPrimitive.Indicator>
```

#### 3. Checkbox with Badge

```tsx
import { Badge } from "@/components/ui/badge"

<Label className="flex items-center gap-2">
  <Checkbox id="new-feature" />
  <span>New feature</span>
  <Badge variant="secondary">New</Badge>
</Label>
```

### Common Gotchas

1. **CheckedState type confusion**
   - ❌ `onChange={(e) => setValue(e.target.checked)}`
   - ✅ `onCheckedChange={(checked) => setValue(checked)}`
   - The `onCheckedChange` callback receives `boolean | 'indeterminate'`, not a change event

2. **Form integration without Controller**
   - ❌ Direct `register` from react-hook-form doesn't work properly
   - ✅ Use `Controller` component or manual `setValue`

3. **Label clicking not working**
   - ❌ `<label><Checkbox /></label>` (wrapping without `htmlFor`)
   - ✅ `<Checkbox id="x" /> <Label htmlFor="x">Text</Label>`

4. **Indeterminate state rendering**
   - The default component only includes Check icon
   - Must manually add Minus icon with conditional rendering for indeterminate state

5. **Styling state-specific styles**
   - ❌ `.checked:bg-blue-500` (doesn't work with Radix)
   - ✅ `data-[state=checked]:bg-blue-500` (use data attributes)

6. **TypeScript errors with checked prop**
   - `checked` can be `boolean | 'indeterminate'`
   - Type your state as `boolean | 'indeterminate'` when using indeterminate

7. **Focus ring positioning**
   - Always use `ring-offset-background` to prevent overlap
   - Respect system focus-visible preferences

### Performance Considerations

1. **Memoize event handlers** in lists of checkboxes:
   ```tsx
   const handleChange = useCallback((id: string, checked: boolean) => {
     setSelected(prev => /* ... */)
   }, [])
   ```

2. **Virtualize long lists**: Use react-window or similar for 100+ checkboxes

3. **Debounce filter updates**: When using checkboxes as filters, debounce the API calls

4. **Avoid unnecessary re-renders**: Use `React.memo` for checkbox list items

## 11. Comparison Notes: Copy-Paste Model vs Traditional Libraries

### The Copy-Paste Model Explained

Unlike traditional component libraries (Material-UI, Ant Design, Chakra UI) that are installed as npm dependencies, ShadCN uses a **copy-paste distribution model**:

**Traditional Library Approach:**
```bash
npm install @mui/material
import { Checkbox } from '@mui/material'
```
- Components live in node_modules
- Updates require package version bumps
- Limited customization without ejecting or complex theming
- Bundle size includes entire library

**ShadCN Copy-Paste Approach:**
```bash
npx shadcn@latest add checkbox
```
- Component code is copied into your project (`components/ui/`)
- You own the code completely
- Customize directly in the component file
- Only includes what you use (tree-shakeable by default)

### How It Affects Usage

#### Ownership & Customization

**Traditional Libraries:**
- ❌ Modifying component internals is difficult
- ❌ Must work within the library's API constraints
- ✅ Consistent updates and bug fixes
- ✅ Less code to maintain

**ShadCN Copy-Paste:**
- ✅ Full control over implementation
- ✅ Easy to modify, extend, or optimize
- ❌ Manual updates (copy new version if needed)
- ❌ More code in your repository

#### Versioning & Updates

**Traditional Libraries:**
```bash
npm update @mui/material  # All components update
```
- All components update together
- May introduce breaking changes across your app
- Dependency on library maintenance

**ShadCN Copy-Paste:**
```bash
npx shadcn@latest add checkbox  # Re-copy individual component
```
- Update components individually
- Review changes before applying
- No forced updates

#### Theming Approach

**Traditional Libraries:**
- Complex theme providers and configuration objects
- Theme tokens must be defined upfront
- Often requires HOCs or context providers

```tsx
<ThemeProvider theme={customTheme}>
  <Checkbox />
</ThemeProvider>
```

**ShadCN:**
- Simple CSS variables in globals.css
- Direct Tailwind class application
- No runtime overhead

```css
:root {
  --primary: 222.2 47.4% 11.2%;
}
```

#### Bundle Size Impact

**Traditional Libraries:**
- Entire library in node_modules (even if unused)
- Tree-shaking helps but may include shared dependencies
- Theme runtime overhead

**ShadCN:**
- Only the code you copy is included
- Pure React components with no library overhead
- Tailwind CSS is already tree-shaken in production

#### Developer Experience Differences

| Aspect | Traditional Library | ShadCN Copy-Paste |
|--------|-------------------|-------------------|
| **Setup Time** | Fast (npm install) | Fast (CLI command) |
| **Learning Curve** | Library-specific API | Standard React + Radix |
| **Customization** | Limited by API | Unlimited |
| **TypeScript** | Library types | Types included in copied code |
| **Debugging** | node_modules (harder) | Your source code (easier) |
| **Testing** | May need library-specific setup | Standard React Testing Library |
| **Updates** | Breaking changes possible | Opt-in, component-by-component |

### When Copy-Paste Model Shines

✅ **Perfect for:**
- Applications needing heavy customization
- Teams wanting full control over UI code
- Projects with unique design systems
- Avoiding dependency bloat
- Learning component implementation patterns

❌ **Less ideal for:**
- Rapid prototyping with no customization
- Teams that prefer library maintenance over code ownership
- Projects needing guaranteed security updates
- Developers uncomfortable maintaining component code

### Practical Implications for Checkbox

**Customizing the checkbox in MUI:**
```tsx
// Must use MUI's styling API
<Checkbox
  sx={{
    color: 'purple',
    '&.Mui-checked': { color: 'purple' },
  }}
/>
```

**Customizing the checkbox in ShadCN:**
```tsx
// Just edit components/ui/checkbox.tsx directly
className="border-purple-500 data-[state=checked]:bg-purple-500"

// Or modify the source file for app-wide changes
// components/ui/checkbox.tsx
<CheckboxPrimitive.Root
  className={cn(
    "border-purple-500",  // Your change
    "data-[state=checked]:bg-purple-500",  // Your change
    className
  )}
```

### Hybrid Approach

Some teams combine both approaches:
- Use ShadCN for frequently customized components
- Use traditional libraries for complex components (charts, tables, calendars)
- Copy and modify ShadCN components as needed
- Maintain custom component library in monorepo

---

## Summary

The ShadCN Checkbox component exemplifies the **copy-paste philosophy**: it's not a package dependency but a starting point you own. Built on Radix UI's accessibility-first primitives and styled with Tailwind CSS, it provides:

- **Full customization freedom** - Edit the source directly
- **Robust accessibility** - WAI-ARIA compliant via Radix
- **Type safety** - TypeScript definitions included
- **Form integration** - Works seamlessly with React Hook Form
- **Modern styling** - Tailwind utilities with dark mode support
- **Production-ready** - Battle-tested patterns from Radix UI

The copy-paste model means you're not locked into a library's API or update cycle - you control when and how the component evolves with your application. This approach is particularly valuable for design systems and applications requiring deep customization beyond what traditional component libraries offer.
