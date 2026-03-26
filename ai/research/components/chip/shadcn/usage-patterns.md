# ShadCN/UI - Badge Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/badge
Status: ✅ Working
Version: Current (as of 2025-11-04)
Last Verified: 2025-11-04

## Documentation Quality
**Good** - Clear, concise documentation with practical examples and comprehensive variant coverage. Demonstrates the component's dual use for both badges and tags.

## Component Definition
- **Core purpose**: Display small inline indicators for status, categories, labels, or counts
- **Mental model**: A lightweight visual marker that provides quick contextual information without demanding attention
- **Semantic meaning**: Communicates auxiliary information, metadata, or state in a compact, non-intrusive format
- **Dual role**: Serves as both traditional badges (status indicators) and tags (categorical labels)

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `variant="destructive"`)
- **Composed**: Via composition/children (e.g., `<Badge>{content}</Badge>`)
- **CSS-only**: Requires custom styling via className (e.g., `className="custom-class"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop - primary content mechanism |
| Icon support | ✅ | Composed | Icons composed as children alongside text |
| Numerical indicators | ✅ | Composed | Demonstrated with circular badges for counts |
| Custom content | ✅ | Composed | Any valid React children accepted |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inline badge | ✅ | Native | Default display as inline element |
| Circular badge | ✅ | CSS-only | `rounded-full px-1 h-5 min-w-5` for numerical counts |
| Link badge | ✅ | Composed | Via `asChild` prop wrapping Link component |
| Interactive badge | ✅ | Composed | Can wrap any interactive element using `asChild` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | Not demonstrated in documentation |
| Disabled | ❌ | N/A | Not demonstrated (typically not needed for badges) |
| Active/Selected | ❌ | CSS-only | Could be achieved via custom className |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Visual variants | ✅ | Native | `variant` prop: "default", "secondary", "destructive", "outline" |
| Size options | ❌ | CSS-only | Not built-in, but achievable via Tailwind classes |
| Color customization | ✅ | CSS-only | Via Tailwind utilities: `className="bg-blue-500 text-white"` |
| Border variants | ✅ | Native | "outline" variant provides border-only style |
| Rounded variants | ✅ | CSS-only | Full customization via `rounded-*` Tailwind classes |

## Architecture Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| CVA variants | ✅ | Native | Class Variance Authority for variant management |
| Tailwind CSS | ✅ | Native | Core styling approach using Tailwind utilities |
| Slot composition | ✅ | Native | `asChild` pattern via Radix UI Slot primitive |
| Copy-paste distribution | ✅ | Native | Not an npm package - code copied into project |

## Code Examples

### Basic Variants
```jsx
import { Badge } from "@/components/ui/badge"

// Default variant
<Badge>Default Badge</Badge>

// Secondary variant
<Badge variant="secondary">Secondary</Badge>

// Destructive variant
<Badge variant="destructive">Destructive</Badge>

// Outline variant
<Badge variant="outline">Outline</Badge>
```

### With Icons
```jsx
import { BadgeCheckIcon } from "lucide-react"

<Badge variant="secondary" className="bg-blue-500 text-white">
  <BadgeCheckIcon className="mr-1 h-3 w-3" />
  Verified
</Badge>
```

### Circular Numerical Badge
```jsx
<Badge className="rounded-full px-1 h-5 min-w-5 flex items-center justify-center">
  5
</Badge>
```

### As Link (asChild pattern)
```jsx
import Link from "next/link"

<Badge variant="outline" asChild>
  <Link href="/profile">View Profile</Link>
</Badge>
```

### Custom Styling
```jsx
<Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
  Custom Gradient
</Badge>
```

[View Live Examples](https://ui.shadcn.com/docs/components/badge)

## Implementation Details

### Component Source Structure
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### Installation
```bash
# Via CLI (recommended)
pnpm dlx shadcn@latest add badge

# Manual installation
# Copy component code from documentation into:
# components/ui/badge.tsx
```

## Notable Features

### 1. Copy-Paste Philosophy
- **No npm package**: Component source code is copied directly into project
- **Full ownership**: Developers own and can customize every line
- **No version lock-in**: Updates are manual, giving full control
- **Direct dependency management**: Only depends on class-variance-authority

### 2. CVA Integration
- Uses Class Variance Authority for type-safe variant management
- Provides excellent TypeScript inference for variant props
- Easily extensible for custom variants
- Maintains single source of truth for style combinations

### 3. Composition via asChild
- Radix UI Slot pattern enables polymorphic rendering
- Can transform any component to look like a badge
- Maintains accessibility of wrapped component
- Avoids wrapper div hell in DOM

### 4. Design Token Integration
- Uses semantic color tokens (`primary`, `secondary`, `destructive`)
- Follows ShadCN's theming system
- Supports light/dark mode automatically
- Customizable via CSS variables

### 5. Tag-Like Usage
- Documentation explicitly shows badge used as tags
- Suitable for categorization, filtering, labels
- Can be combined for tag clouds or multi-select displays
- No separate "Tag" component - Badge serves both purposes

### 6. Minimal Dependencies
- Only requires `class-variance-authority` and `cn` utility
- No React-specific badge library dependency
- Leverages Tailwind CSS (assumed in project)
- Optional: Radix UI Slot for `asChild` pattern

## Comparison to Other Frameworks

### Unique Patterns
- **Copy-paste distribution model**: Unlike other frameworks, not distributed via npm
- **CVA for variants**: More type-safe than runtime props or CSS-in-JS
- **Explicit tag usage**: Documentation shows dual badge/tag purpose
- **asChild polymorphism**: Radix UI pattern not common in other badge implementations

### Standard Patterns
- Four visual variants (common across frameworks)
- Inline display model
- Children-based content
- Icon composition support

### Missing Patterns (vs other frameworks)
- No built-in size variants (handled via custom classes)
- No built-in closeable/dismissible badges
- No built-in dot/status indicators (can be composed)
- No animation/transition props (rely on Tailwind utilities)

## Tailwind CSS Integration

### Base Classes
```
inline-flex items-center rounded-full border px-2.5 py-0.5
text-xs font-semibold transition-colors
focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
```

### Variant Classes
- **Default**: `border-transparent bg-primary text-primary-foreground hover:bg-primary/80`
- **Secondary**: `border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **Destructive**: `border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80`
- **Outline**: `text-foreground` (inherits border from base)

### Customization Examples
```jsx
// Size customization
<Badge className="px-3 py-1 text-sm">Larger Badge</Badge>

// Shape customization
<Badge className="rounded-md">Square Corners</Badge>

// Color customization
<Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
  Success
</Badge>

// Icon spacing
<Badge className="gap-1">
  <Icon /> With Gap
</Badge>
```

## Research Notes

### Documentation Quality
- Clear, focused documentation
- Excellent code examples
- Shows real-world usage patterns
- Demonstrates the "copy-paste" philosophy well
- Good TypeScript typing examples

### Framework Philosophy
- Anti-framework framework: provides primitives, not constraints
- Developer autonomy prioritized
- No abstraction for the sake of abstraction
- Direct access to underlying implementation
- Encourages customization over configuration

### Badge vs Tag Distinction
- ShadCN doesn't separate Badge and Tag into different components
- Badge serves both purposes through styling and usage
- Documentation explicitly shows tag-like usage with multiple badges
- Philosophy: one flexible component > two rigid components

### Accessibility Considerations
- No explicit ARIA role mentioned (uses native div)
- Focus ring styling included for interactive variants
- Semantic meaning communicated through visual styling only
- When used with `asChild` pattern, inherits accessibility of wrapped component

### Migration Considerations for Semantic UI
- CVA pattern could inform our variant system
- asChild pattern aligns with web component composition
- Copy-paste philosophy differs from our npm distribution
- Tailwind integration patterns could inform our Tailwind plugin
- Single component for badge/tag aligns with simplicity principle
