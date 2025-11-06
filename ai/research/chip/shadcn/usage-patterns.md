# ShadCN - Badge Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/badge
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
**Good** - Clean, focused documentation with clear examples demonstrating the core functionality and variant system. The documentation is concise and practical, showing common use cases including the `asChild` polymorphic pattern. Examples include basic variants, icon integration, and custom styling approaches.

## Component Definition
- **Core purpose**: Display small visual indicators to highlight, categorize, or mark content with status information
- **Mental model**: A lightweight inline element that adds visual emphasis or metadata to content without dominating the interface
- **Semantic meaning**: Communicates supplementary information, status, or categorization in a compact, non-intrusive format

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `variant="destructive"`)
- **Composed**: Via composition/children (e.g., `<Badge>{content}</Badge>`)
- **CSS-only**: Requires custom styling (e.g., `className="custom-classes"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Primary content delivered through children prop |
| Icons | ✅ | Composed | Icons can be composed as children alongside text content |
| Avatars/Images | ✅ | Composed | Any React children accepted, including images |
| Close/Remove button | ❌ | N/A | Not included; would require custom composition |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | CSS-only | No built-in selection state; could be styled via custom classes |
| Disabled | ❌ | CSS-only | No native disabled prop; could apply via className |
| Loading | ❌ | N/A | Not demonstrated or included |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | Four semantic variants: default, secondary, destructive, outline |
| Size options | ❌ | CSS-only | No built-in size variants; use Tailwind utilities like `text-sm`, `px-3` |
| Visual variants | ✅ | Native | Filled (default, secondary, destructive) and outlined variants |
| Bordered/Borderless | ✅ | Native | Border present in all variants; outline variant emphasizes border |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Composed | Via `asChild` prop wrapping Link or button elements |
| Closable/Removable | ❌ | N/A | Not built-in; would require custom implementation |
| onClick handler | ✅ | Native | Inherits standard HTMLDivElement props including onClick |
| onClose handler | ❌ | N/A | No dedicated close/dismiss functionality |

## Code Examples

### Basic Variants
```jsx
import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
```
[View Live](https://ui.shadcn.com/docs/components/badge)

### With Icons (Custom Composition)
```jsx
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "lucide-react"

<Badge className="gap-1">
  <StarIcon className="h-3 w-3" />
  Featured
</Badge>
```

### Polymorphic with asChild
```jsx
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Render as a link while maintaining badge appearance
<Badge variant="outline" asChild>
  <Link href="/profile">View Profile</Link>
</Badge>
```

### Custom Styling with Tailwind
```jsx
// Custom size
<Badge className="text-sm px-3 py-1">Large Badge</Badge>

// Custom color
<Badge className="bg-purple-500 text-white hover:bg-purple-600">
  Custom Color
</Badge>

// Circular numeric badge
<Badge className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
  3
</Badge>
```

## Notable Features

### 1. Copy-Paste Component Distribution
- **Not an npm package**: Component source code is copied directly into your project via CLI
- **Full ownership**: Developers have complete control over the implementation
- **No version dependencies**: Updates are manual, avoiding breaking changes
- **Direct customization**: Modify the component source without ejecting or forking

### 2. Class Variance Authority (CVA) Integration
- Uses CVA for type-safe variant management
- Provides excellent TypeScript inference for variant props
- Single source of truth for variant style combinations
- Easily extensible for custom variants in your project

### 3. Radix UI Slot Pattern (asChild)
- Polymorphic component rendering through the `asChild` prop
- Can transform any element to look like a badge
- Maintains underlying component's accessibility and behavior
- Avoids unnecessary wrapper elements in the DOM

### 4. Minimal Implementation
- Simple component with focused API
- Only depends on `class-variance-authority` and a `cn` utility
- No complex state management or lifecycle concerns
- Easy to understand and modify

### 5. Tailwind-First Design
- Core styling through Tailwind utility classes
- Design token integration via semantic color names
- Automatic light/dark mode support through CSS variables
- Full customization through className prop

### 6. Semantic Variants
- Uses semantic naming: default, secondary, destructive
- Aligns with broader shadcn/ui theming system
- Consistent with other shadcn components
- Theme-aware through CSS custom properties

## Research Notes

### Documentation Accessibility
- Documentation is clear and well-structured
- Live examples are immediately visible and functional
- Installation process is streamlined with CLI tooling
- Code examples are copy-ready

### Framework Philosophy
- **Copy-paste over npm**: Unique distribution model prioritizing developer ownership
- **Composition over configuration**: Flexibility through children and asChild patterns
- **Tailwind-native**: Embraces utility-first CSS rather than abstracting it
- **Minimal abstraction**: Only abstracts what's necessary (variant management)

### Implementation Simplicity
- Badge component is essentially a styled div with variant support
- No complex state or lifecycle management
- Relies on standard React patterns (props, children)
- CVA handles the only complexity (variant class combinations)

### Comparison to Component Libraries
- **Lighter than**: Material-UI, Ant Design (no heavy runtime or theme engine)
- **More opinionated than**: Headless UI, Radix UI primitives
- **Different from**: Bootstrap, Chakra (copy-paste vs. package dependency)

### Badge vs. Chip/Tag Naming
- ShadCN uses "Badge" to cover what some frameworks separate as Badge/Chip/Tag
- No semantic distinction between notification badges and categorization tags
- Single flexible component serves multiple use cases
- Documentation examples show tag-like usage patterns

### Potential Semantic UI Considerations
- CVA pattern could inform variant system design
- asChild pattern aligns with web component composition goals
- Copy-paste philosophy differs from npm distribution but shows value of minimal abstraction
- Tailwind integration patterns relevant for Semantic UI's Tailwind plugin
- Simple API demonstrates effectiveness of focused components
