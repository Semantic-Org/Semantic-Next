# ShadCN UI - Radio Group Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/radio-group
Status: ✅ Working
Version: Current (built on Radix UI Radio Group v1.3.8)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear basic example with visual demonstration. Documentation is intentionally minimal, focusing on the primary usage pattern and deferring to Radix UI documentation for comprehensive API reference.

## Component Definition
- **Core purpose**: A set of checkable buttons where no more than one of the buttons can be checked at a time. Enables single-selection from multiple mutually exclusive options.
- **Mental model**: A group of radio buttons functioning as a single form control. Think of it as "one choice from many" - selecting one automatically deselects all others within the group.
- **Semantic meaning**: Represents a mutually exclusive selection control in forms and interfaces. Visual grouping and labels communicate the relationship between options and what decision is being made.

## Pattern Support Levels
- **Native**: Dedicated prop/API from Radix UI primitive
- **Composed**: Via composition with Label and custom layouts
- **CSS-only**: Requires custom styling via className

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text labels | ✅ | Composed | Label component paired with each RadioGroupItem via htmlFor |
| Icon support | ✅ | Composed | Icons can be added to label composition patterns |
| Description text | ✅ | Composed | Additional text elements can be composed within item containers |
| Custom content | ✅ | Composed | Any content can be composed in the wrapper div with RadioGroupItem |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default radio | ✅ | Native | Standard radio button with RadioGroupItem component |
| Radio group | ✅ | Native | RadioGroup wrapper manages mutual exclusivity |
| Button-style radio | ❌ | CSS-only | No built-in button variant, would require custom styling |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled (group) | ✅ | Native | `disabled` prop on RadioGroup disables all items |
| Disabled (individual) | ✅ | Native | `disabled` prop on RadioGroupItem for single item |
| Checked | ✅ | Native | Controlled via `value` prop or `defaultValue` |
| Required | ✅ | Native | `required` prop on RadioGroup for form validation |
| Error state | ❌ | CSS-only | No built-in error styling, compose with form libraries |
| Focus | ✅ | Native | Built-in focus-visible styles and keyboard navigation |
| Hover | ✅ | Native | Interactive hover states |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No size prop, customize via className on RadioGroupItem |
| Orientation | ✅ | Native | `orientation="horizontal"` or `"vertical"` on RadioGroup |
| Spacing | ✅ | Composed | Control via Tailwind gap utilities on wrapper divs |
| Color schemes | ❌ | CSS-only | No color variants, use Tailwind theme classes |
| Custom styling | ✅ | Native | Full className support on all components |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange handler | ✅ | Native | `onValueChange` prop on RadioGroup receives selected value |
| Controlled | ✅ | Native | `value` prop with `onValueChange` for full control |
| Uncontrolled | ✅ | Native | `defaultValue` prop for uncontrolled usage |
| Form integration | ✅ | Native | `name` prop for native form submission |
| Keyboard navigation | ✅ | Native | Full arrow key navigation with roving tabindex |
| Loop navigation | ✅ | Native | `loop` prop (default true) for circular keyboard navigation |

## Code Examples

### Installation
```bash
pnpm dlx shadcn@latest add radio-group
```

### Basic Import and Usage
```tsx
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  )
}
```

### Controlled Usage
```tsx
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ControlledRadioGroup() {
  const [value, setValue] = useState("option-one")

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
    </RadioGroup>
  )
}
```

### Disabled State
```tsx
// Disable entire group
<RadioGroup defaultValue="option-one" disabled>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option-one" id="r1" />
    <Label htmlFor="r1">Option One</Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option-two" id="r2" />
    <Label htmlFor="r2">Option Two</Label>
  </div>
</RadioGroup>

// Disable individual item
<RadioGroup defaultValue="option-one">
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option-one" id="r1" />
    <Label htmlFor="r1">Option One</Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option-two" id="r2" disabled />
    <Label htmlFor="r2">Option Two (Disabled)</Label>
  </div>
</RadioGroup>
```

### Horizontal Orientation
```tsx
<RadioGroup defaultValue="option-one" orientation="horizontal">
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option-one" id="r1" />
    <Label htmlFor="r1">Option One</Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="option-two" id="r2" />
    <Label htmlFor="r2">Option Two</Label>
  </div>
</RadioGroup>
```

### Form Integration
```tsx
<form onSubmit={(e) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  console.log(formData.get('notification-method'))
}}>
  <RadioGroup
    defaultValue="email"
    name="notification-method"
    required
  >
    <div className="flex items-center gap-3">
      <RadioGroupItem value="email" id="email" />
      <Label htmlFor="email">Email</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="sms" id="sms" />
      <Label htmlFor="sms">SMS</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="push" id="push" />
      <Label htmlFor="push">Push Notification</Label>
    </div>
  </RadioGroup>
  <button type="submit">Submit</button>
</form>
```

### With Descriptions
```tsx
<RadioGroup defaultValue="card">
  <div className="flex items-start gap-3">
    <RadioGroupItem value="card" id="card" className="mt-1" />
    <div className="grid gap-1.5">
      <Label htmlFor="card">Credit Card</Label>
      <p className="text-sm text-muted-foreground">
        Pay with credit or debit card
      </p>
    </div>
  </div>
  <div className="flex items-start gap-3">
    <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
    <div className="grid gap-1.5">
      <Label htmlFor="paypal">PayPal</Label>
      <p className="text-sm text-muted-foreground">
        Pay with your PayPal account
      </p>
    </div>
  </div>
</RadioGroup>
```

### With Icons
```tsx
import { CreditCard, Wallet, Smartphone } from "lucide-react"

<RadioGroup defaultValue="card">
  <div className="flex items-center gap-3">
    <RadioGroupItem value="card" id="card" />
    <Label htmlFor="card" className="flex items-center gap-2">
      <CreditCard className="h-4 w-4" />
      Credit Card
    </Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="wallet" id="wallet" />
    <Label htmlFor="wallet" className="flex items-center gap-2">
      <Wallet className="h-4 w-4" />
      Wallet
    </Label>
  </div>
  <div className="flex items-center gap-3">
    <RadioGroupItem value="mobile" id="mobile" />
    <Label htmlFor="mobile" className="flex items-center gap-2">
      <Smartphone className="h-4 w-4" />
      Mobile Payment
    </Label>
  </div>
</RadioGroup>
```

### Custom Styling
```tsx
<RadioGroup defaultValue="option-one" className="gap-4">
  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent">
    <RadioGroupItem value="option-one" id="r1" />
    <Label htmlFor="r1" className="cursor-pointer flex-1">
      Option One
    </Label>
  </div>
  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent">
    <RadioGroupItem value="option-two" id="r2" />
    <Label htmlFor="r2" className="cursor-pointer flex-1">
      Option Two
    </Label>
  </div>
</RadioGroup>
```

## Component Implementation Details

### Radix UI Foundation
ShadCN UI Radio Group is built on **Radix UI Radio Group primitive v1.3.8**:
- Provides accessible radio group behavior
- Handles keyboard navigation automatically
- Manages focus and selection state
- Implements WAI-ARIA Radio Group pattern
- 10.2 kB gzipped

### Copy-Paste Philosophy
Like all ShadCN components:
1. CLI copies component source code into your project
2. Code lives in `@/components/ui/radio-group` directory
3. Full control to modify implementation
4. No version lock-in or breaking changes
5. You own the code completely

### Component Structure
```
RadioGroup (Radix Root)
├── Props: value, onValueChange, defaultValue, disabled, orientation, name, required, loop
├── Manages: mutual exclusivity, keyboard navigation, form integration
└── Contains multiple RadioGroupItem components

RadioGroupItem (Radix Item)
├── Props: value, disabled, id
├── Data attributes: [data-state], [data-disabled]
└── Paired with Label via id/htmlFor
```

### Styling Implementation
- **Tailwind CSS**: All styling via Tailwind utility classes
- **No variant system**: Unlike Button, no built-in variants
- **Composition-based**: Layout controlled by wrapper divs and Tailwind classes
- **Theme integration**: Uses semantic color tokens for consistency

### Keyboard Navigation (Radix UI)
- **Tab**: Moves focus to the checked radio button or first if none checked
- **Space**: Checks the focused radio button
- **Arrow Down / Arrow Right**: Moves focus to next radio, checks it
- **Arrow Up / Arrow Left**: Moves focus to previous radio, checks it
- **Loop behavior**: Arrow keys wrap around by default (controlled by `loop` prop)

### Accessibility Features (Radix UI)
- **Roving tabindex**: Only one radio is tabbable, others navigable via arrows
- **ARIA roles**: Proper radio group and radio roles
- **Label association**: Via id/htmlFor for click-to-select
- **Disabled communication**: Proper ARIA states for screen readers
- **Data attributes**: `[data-state]` (checked/unchecked), `[data-disabled]`

## Notable Features

### Radix UI Primitive Foundation
- **WAI-ARIA compliant**: Full Radio Group pattern implementation
- **Keyboard navigation**: Complete arrow key navigation with roving tabindex
- **Focus management**: Automatic focus handling and restoration
- **Controlled/Uncontrolled**: Both patterns fully supported
- **Form integration**: Native form submission via `name` prop

### Orientation Support
- **Vertical (default)**: Standard stacked radio layout
- **Horizontal**: Side-by-side radio layout
- **Keyboard adapts**: Arrow key directions change based on orientation
- **CSS agnostic**: Orientation affects keyboard behavior, not visual layout

### Loop Navigation
- **Enabled by default**: Arrow keys wrap from last to first (and vice versa)
- **Configurable**: `loop={false}` disables wrap-around behavior
- **User experience**: Feels natural for short lists, can be disabled for long lists

### Label Integration Pattern
- **Separate component**: Uses ShadCN Label component, not built-in
- **Explicit pairing**: Via `id` on RadioGroupItem and `htmlFor` on Label
- **Clickable labels**: Proper association enables label clicking
- **Composition flexibility**: Labels can contain any content

### State Management
- **Uncontrolled**: `defaultValue` prop for initial selection
- **Controlled**: `value` + `onValueChange` for full control
- **Form submission**: `name` prop for native form integration
- **Validation**: `required` prop for HTML5 validation

### Composition Philosophy
- **No built-in labels**: Labels are composed via separate Label component
- **Flexible layout**: Wrapper divs control spacing and arrangement
- **Icon support**: Icons composed within labels or wrapper divs
- **Description support**: Additional text composed within item wrappers
- **Custom content**: Any React content can be composed

## Research Notes

### Framework Approach
ShadCN UI Radio Group differs from traditional radio button implementations:
- **Primitive-based**: Built entirely on Radix UI Radio Group primitive
- **Composition-first**: Labels, layouts, and content are composed, not props
- **Minimal wrapper**: Thin styling layer over Radix functionality
- **Tailwind-styled**: No CSS modules or styled-components

### Design Philosophy
- **Accessible by default**: Leverages Radix's built-in accessibility
- **Flexible composition**: No prescriptive label or layout patterns
- **Keyboard-first**: Full keyboard navigation out of the box
- **Form-friendly**: Native form integration via name prop
- **Minimal API**: Relies on Radix props, adds minimal abstraction

### Implementation Strategy
- **Radix primitive**: All behavior from Radix UI Radio Group
- **Tailwind styling**: Visual appearance via Tailwind classes
- **No variant system**: Single visual style, customized via className
- **Label component**: Separate, reusable Label component for associations

### Pattern Observations
1. **Manual label pairing**: Requires explicit id/htmlFor, not automatic
2. **Layout via composition**: Flex containers control spacing and alignment
3. **No built-in descriptions**: Description text is manually composed
4. **Single visual style**: No size or color variants out of the box
5. **Orientation is behavioral**: Affects keyboard, not visual layout
6. **Icons via composition**: No dedicated icon prop or slot
7. **Required state**: Prop available but no visual indicator
8. **Error state**: Not built-in, compose with form libraries

### Strengths
- Excellent keyboard navigation and accessibility
- Flexible composition allows any layout pattern
- Built on battle-tested Radix UI primitive
- Native form integration
- Simple, understandable API
- Full TypeScript support
- Minimal bundle size through Radix primitives
- No complex variant system to learn

### Potential Limitations
- Manual label association (id/htmlFor pairing required)
- No built-in visual variants (size, color schemes)
- No built-in description or helper text pattern
- No error state styling
- No loading state
- Single visual style requires custom CSS for variations
- Layout spacing not built-in (manual flex wrappers)
- No built-in icon positioning patterns

### Comparison to Other Frameworks
- **Material UI Radio**: RadioGroup + FormControlLabel, built-in labels, size prop
- **Ant Design Radio**: Radio.Group with children Radio components, button style variant
- **Chakra UI Radio**: RadioGroup with Stack layout, size/colorScheme props
- **ShadCN**: Most primitive - relies heavily on composition, minimal props

### Semantic UI Integration Considerations

#### Radix Primitive Alignment
- **ShadCN approach**: Direct use of Radix primitive with minimal wrapper
- **Semantic UI consideration**: Could use Radix internally for behavior
- **Pattern**: Separate behavior (Radix) from styling (Semantic UI)
- **Benefit**: Leverage Radix's accessibility and keyboard handling

#### Composition vs Props
- **ShadCN**: Labels, icons, descriptions all composed manually
- **Semantic UI consideration**: Could offer both patterns
- **Hybrid approach**: Built-in label prop + composition slot for flexibility
- **Trade-off**: Convenience vs flexibility

#### Label Association Pattern
- **ShadCN**: Manual id/htmlFor pairing required
- **Semantic UI opportunity**: Auto-generate IDs for convenience
- **Developer experience**: Reduce boilerplate while allowing manual override
- **Accessibility**: Maintain proper associations in both patterns

#### Layout and Spacing
- **ShadCN**: Manual flex wrappers with Tailwind gap utilities
- **Semantic UI consideration**: Built-in spacing options
- **Pattern**: `spacing` prop or CSS custom properties
- **Goal**: Reduce layout boilerplate while maintaining flexibility

#### Variant System
- **ShadCN**: Single visual style, customize via className
- **Semantic UI opportunity**: Size variants, color schemes, button-style variant
- **Balance**: Offer common variants + full customization
- **Examples**: size="sm|md|lg", variant="default|button|card"

#### Error and Required States
- **ShadCN**: No visual indicators for required/error
- **Semantic UI opportunity**: Built-in visual feedback
- **Accessibility**: Visual indicators + ARIA attributes
- **Form integration**: Work with validation libraries

#### Orientation Pattern
- **ShadCN**: Orientation affects keyboard only, not layout
- **Semantic UI consideration**: Visual layout adaptation
- **Pattern**: orientation prop that affects both behavior and appearance
- **Developer expectation**: Orientation should change visual layout

## Key Takeaways for Semantic UI

### Pattern Alignment
- **Radix foundation** is solid choice for radio behavior
- **Keyboard navigation** pattern is excellent, adopt as-is
- **Controlled/uncontrolled** patterns are standard, support both
- **Form integration** via name prop is clean and native
- **Data attributes** pattern useful for styling based on state

### Pattern Divergence
- **Manual label pairing** is tedious, auto-generate IDs
- **No variants** too minimal for comprehensive component library
- **Tailwind-only** incompatible with framework-agnostic goals
- **No layout options** forces manual wrapper divs
- **Orientation behavioral only** doesn't match developer expectations

### Potential Adoptions
1. **Radix primitive**: Use Radix UI Radio Group for behavior/accessibility
2. **Data attributes**: Use [data-state], [data-disabled] for styling hooks
3. **Loop navigation**: Support loop prop for keyboard wrap-around
4. **Name prop**: Native form integration pattern
5. **Orientation prop**: Support both horizontal and vertical

### Avoid These Patterns
1. **Manual label association**: Auto-generate IDs, allow override
2. **No variants**: Provide size, color, and style variants
3. **Composition-only layouts**: Offer spacing and layout props
4. **No error states**: Build in validation feedback
5. **Orientation behavioral only**: Make it affect visual layout too

### Innovation Opportunities
1. **Auto-ID generation**: Reduce boilerplate for label association
2. **Built-in descriptions**: Helper text pattern for each radio
3. **Card-style radios**: Visual card selection variant
4. **Icon positioning**: Dedicated icon slot or prop
5. **Error states**: Visual validation feedback
6. **Loading states**: Skeleton or spinner during async operations
7. **Button-style variant**: Radio group styled as segmented buttons
8. **Grid layouts**: Support grid patterns for large option sets
9. **Visual indicators**: Required asterisks, error icons
10. **Spacing presets**: Built-in spacing options (compact, comfortable, spacious)

## Conclusion

ShadCN UI Radio Group represents a minimal, accessibility-first approach built on the solid Radix UI primitive. It excels in keyboard navigation and accessibility but requires significant composition for common patterns like labels, descriptions, and layout.

**Adopt**: Radix primitive foundation, keyboard navigation patterns, data attributes, form integration, controlled/uncontrolled support

**Adapt**: Auto-generate IDs, add variant system, built-in spacing/layout options, error/required visual states, make orientation affect visual layout

**Avoid**: Manual label pairing boilerplate, Tailwind dependency, composition-only approach for common patterns, minimal variant philosophy

ShadCN's composition-first philosophy works for their copy-paste model but may be too minimal for Semantic UI's comprehensive component library approach. The key insight is to build on Radix for behavior while adding convenient props and variants for common use cases.
