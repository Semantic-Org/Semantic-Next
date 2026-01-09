# ShadCN UI - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://ui.shadcn.com/docs/components/button
Status: ✅ Working
Version: Current (using Tailwind v4 compatible styles)
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - Well-structured with clear examples, installation instructions, and detailed variant documentation.

## Component Definition
- **Core purpose**: Displays a clickable button element or a component styled as a button. Provides versatile styling options through variants while maintaining accessibility and supporting polymorphic rendering.
- **Mental model**: A highly composable button primitive that can transform into different visual styles through the variant system and can even render as different underlying elements (like links) through the asChild pattern.
- **Semantic meaning**: Represents an actionable element in the UI - whether a form submission, navigation, or state change trigger. Visual variants communicate the importance and type of action (destructive, secondary, etc.).

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Standard children prop - any text content renders naturally |
| Icon support | ✅ | Composed | Full icon support via children, with dedicated icon sizes |
| Icon + Text | ✅ | Composed | Icons and text compose naturally with automatic spacing |
| Loading indicator | ✅ | Composed | Uses Spinner component composed as child with disabled state |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default | ✅ | Native | `variant="default"` - Standard filled button with primary styling |
| Destructive | ✅ | Native | `variant="destructive"` - Warning/delete action styling |
| Outline | ✅ | Native | `variant="outline"` - Border-only button |
| Secondary | ✅ | Native | `variant="secondary"` - Alternative filled style |
| Ghost | ✅ | Native | `variant="ghost"` - Minimal, background-less button |
| Link | ✅ | Native | `variant="link"` - Text-only link appearance |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | Standard `disabled` attribute with visual feedback |
| Loading | ✅ | Composed | Combine Spinner component with disabled state |
| Focus | ✅ | Native | Built-in focus-visible styles for keyboard navigation |
| Hover | ✅ | Native | Interactive hover states for all variants |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `sm`, `default`, `lg`, `icon`, `icon-sm`, `icon-lg` sizes |
| As child | ✅ | Native | `asChild` prop enables polymorphic rendering via Radix Slot |
| Roundable | ✅ | CSS-only | Can apply `rounded-full` via className for pill buttons |
| Custom styling | ✅ | Native | Accepts className prop for Tailwind overrides |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard onClick and all button element props |
| As link | ✅ | Native | `asChild` pattern with Next.js Link or anchor elements |
| Form submission | ✅ | Native | Standard button type attribute (submit/button/reset) |

## Code Examples

### Installation
```bash
pnpm dlx shadcn@latest add button
```

### Basic Import and Usage
```typescript
import { Button } from "@/components/ui/button"

// Basic button
<Button>Button</Button>

// With variant
<Button variant="outline">Button</Button>
```

### All Variants
```typescript
// Default variant
<Button variant="default">Default</Button>

// Outline variant
<Button variant="outline">Outline</Button>

// Secondary variant
<Button variant="secondary">Secondary</Button>

// Ghost variant
<Button variant="ghost">Ghost</Button>

// Destructive variant
<Button variant="destructive">Destructive</Button>

// Link variant
<Button variant="link">Link</Button>
```

### Size Options
```typescript
// Small
<Button size="sm">Small</Button>

// Default (medium)
<Button size="default">Default</Button>

// Large
<Button size="lg">Large</Button>

// Icon button (square)
<Button size="icon">
  <ArrowUpIcon />
</Button>

// Small icon button
<Button size="icon-sm">
  <StarIcon />
</Button>

// Large icon button
<Button size="icon-lg">
  <HeartIcon />
</Button>
```

### Icon Patterns
```typescript
import { ArrowUpIcon } from "lucide-react"

// Icon only
<Button variant="outline" size="icon">
  <ArrowUpIcon />
</Button>

// Icon with text (automatic spacing)
<Button>
  <ArrowUpIcon />
  Upload
</Button>

// Text with trailing icon
<Button>
  Continue
  <ArrowRightIcon />
</Button>
```

### Loading State
```typescript
import { Spinner } from "@/components/ui/spinner"

// Loading button
<Button disabled>
  <Spinner />
  Submit
</Button>
```

### AsChild Pattern (Polymorphic)
```typescript
import Link from "next/link"

// Render as Next.js Link
<Button asChild>
  <Link href="/login">Login</Link>
</Button>

// Render as anchor
<Button asChild variant="link">
  <a href="https://example.com">Visit Site</a>
</Button>
```

### Custom Styling
```typescript
// Rounded pill button
<Button className="rounded-full">
  Rounded Button
</Button>

// Custom Tailwind classes
<Button className="w-full justify-start">
  Full Width Button
</Button>
```

### Complete Example with Multiple Patterns
```typescript
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon, XIcon } from "lucide-react"
import Link from "next/link"

export function ButtonDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {/* Standard buttons */}
      <Button>Default Button</Button>
      <Button variant="outline">Outline Button</Button>

      {/* With icons */}
      <Button>
        <CheckIcon />
        Confirm
      </Button>

      {/* Icon only */}
      <Button size="icon" variant="ghost">
        <XIcon />
      </Button>

      {/* Loading state */}
      <Button disabled={loading} onClick={() => setLoading(true)}>
        {loading && <Spinner />}
        {loading ? 'Submitting...' : 'Submit'}
      </Button>

      {/* As link */}
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>

      {/* Destructive action */}
      <Button variant="destructive">
        Delete Account
      </Button>
    </div>
  )
}
```

## Notable Features

### Radix UI Slot Primitive
- Uses Radix UI's Slot component for the `asChild` pattern
- Enables true polymorphic rendering without wrapper elements
- Merges props and refs correctly between Button and child element
- Allows button styling on any interactive element (links, custom components, etc.)

### Tailwind CSS + CVA Architecture
- Built on Tailwind CSS for styling (not a separate CSS file)
- Uses `cva` (class-variance-authority) for variant management
- Provides type-safe variant props
- Easy to customize by modifying variant definitions

### Icon Integration Philosophy
- Icons render without automatic margins
- Spacing between icon and text is handled by the button component itself
- Works with any icon library (Lucide React is the documented default)
- Dedicated icon-only sizes maintain square aspect ratio

### Accessibility Built-in
- Proper focus-visible styles for keyboard navigation
- Supports aria-labels for icon-only buttons
- Disabled state properly communicated to screen readers
- All native button semantics preserved

### Tailwind v4 Compatibility Notes
- Documentation notes that Tailwind v4 changed button cursor from `pointer` to `default`
- Provides CSS snippet to restore pointer cursor if desired:
```css
@layer base {
  button {
    cursor: pointer;
  }
}
```

### Copy-Paste Philosophy
- Not an npm package - code is copied directly into your project
- Full source code is customizable
- No version lock-in or breaking changes
- You own the implementation

## Research Notes

### Framework Approach
ShadCN UI is fundamentally different from traditional component libraries:
- **Not a package**: Components are copied into your codebase, not installed
- **Full ownership**: You have complete control over the implementation
- **Composition-first**: Most patterns achieved through children composition
- **Radix + Tailwind**: Combines Radix UI primitives with Tailwind styling

### Design Philosophy
- **Minimalist API**: Prefers composition over props for content patterns
- **Variant-driven**: Visual styles controlled through variant prop system
- **Polymorphic by design**: asChild pattern enables rendering flexibility
- **Accessibility-first**: Built on Radix UI's accessible primitives

### Implementation Strategy
- **CVA for variants**: Type-safe variant management with class-variance-authority
- **Slot for polymorphism**: Radix Slot enables asChild without wrapper divs
- **Tailwind for styling**: No CSS modules, styled-components, or CSS-in-JS
- **Lucide for icons**: Default icon library but any can be used

### Pattern Observations
1. **Loading state is composed**: No native loading prop, uses Spinner + disabled
2. **Icon spacing is automatic**: Button handles gap between icon and text
3. **Size variants are comprehensive**: Includes dedicated icon button sizes
4. **Link-styled buttons**: Separate from polymorphic link rendering (variant vs asChild)
5. **No icon position prop**: Icon placement handled by child order

### Strengths
- Extremely flexible through composition
- Full customization without fighting abstractions
- Type-safe variants
- Clean, readable code
- Excellent documentation with visual examples

### Potential Limitations
- No built-in loading state (must compose manually)
- Icon integration requires understanding composition patterns
- No automatic icon margins (spacing must be understood)
- Copy-paste approach means no centralized updates

### Semantic UI Integration Considerations
- **Props vs Composition**: ShadCN prefers composition; Semantic UI could offer both
- **Native loading**: Consider built-in loading prop vs composed pattern
- **Icon handling**: Evaluate automatic spacing vs manual composition
- **Variant system**: CVA approach is elegant, could inform Semantic UI's variant handling
- **asChild pattern**: Powerful polymorphic pattern worth considering
