# ShadCN - Skeleton Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/skeleton
Status: ✅ Working
Version: Current (shadcn/ui)
Last Verified: 2025-11-04

## Documentation Quality
Good - Provides clear examples with complete code. Documentation is concise and focused on practical usage rather than extensive API documentation. The copy-paste philosophy means the documentation emphasizes integration patterns over API surface.

## Component Definition
- **Core purpose**: Provide visual placeholder feedback while content is loading. Acts as a content shape indicator to reduce perceived loading time and provide better user experience during asynchronous operations.
- **Mental model**: Users understand skeletons as "temporary content shapes" that preview the layout structure before actual content arrives. The skeleton maintains layout stability and communicates that content is being fetched.
- **Semantic meaning**: Communicates "loading in progress" state without explicit text. The skeleton's shape hints at the type of content that will appear (circular for avatars, rectangular for text, etc.).

## Pattern Support Levels
- **Native**: N/A (component is minimal with no built-in props)
- **Composed**: All customization via Tailwind className composition
- **CSS-only**: All visual styling through Tailwind utility classes

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text placeholders | ✅ | CSS-only | Rectangular shapes with height/width classes to mimic text lines |
| Avatar placeholders | ✅ | CSS-only | Circular shapes using `rounded-full` class |
| Media placeholders | ✅ | CSS-only | Rectangular shapes with custom dimensions for images/video |
| Custom shapes | ✅ | CSS-only | Any shape achievable via Tailwind classes (rounded-xl, etc.) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Circle | ✅ | CSS-only | `rounded-full` class for circular skeletons (avatars) |
| Rectangle | ✅ | CSS-only | Default shape with optional rounding via `rounded-*` classes |
| Custom radius | ✅ | CSS-only | Full Tailwind rounding scale available (rounded-sm, rounded-xl, etc.) |
| No distinct types | ✅ | - | Single component with className customization only |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading animation | ✅ | Native | Built-in pulse/shimmer animation via CSS |
| Static | ❌ | - | No static variant, always animated |
| Speed control | ❌ | - | Animation speed not configurable via props |
| Custom animation | ✅ | CSS-only | Can override animation via className |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size control | ✅ | CSS-only | Via Tailwind height/width classes (h-*, w-*) |
| Spacing control | ✅ | CSS-only | Via Tailwind spacing utilities (space-y-*, gap-*, etc.) |
| Color customization | ✅ | CSS-only | Can override background via className |
| Border radius | ✅ | CSS-only | Full Tailwind radius scale (rounded-*, rounded-[value]) |
| Aspect ratio | ✅ | CSS-only | Via Tailwind aspect-* utilities or explicit dimensions |
| Multi-line layouts | ✅ | Composed | Multiple Skeleton components in flex/grid containers |

## Code Examples

### Basic Usage - Simple Skeleton
```typescript
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```
**Pattern**: Avatar + text lines composition using Flexbox layout

### Card Skeleton Example
```typescript
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```
**Pattern**: Media placeholder + text content structure, common for card layouts

### Basic Element Usage
```typescript
<Skeleton className="h-[20px] w-[100px] rounded-full" />
```
**Pattern**: Single skeleton with explicit dimensions using Tailwind arbitrary values

## Installation & Setup

### CLI Installation
```bash
pnpm dlx shadcn@latest add skeleton
```

**Copy-Paste Philosophy**: The component is installed directly into your project's component directory, not as an npm package dependency. This gives full control over the implementation.

### Import Pattern
```typescript
import { Skeleton } from "@/components/ui/skeleton"
```

**Note**: The `@/components/ui/skeleton` path assumes the default shadcn/ui setup with path aliasing configured in tsconfig.json.

## Notable Features

### 1. **Minimal API Surface**
- No props for variants, sizes, or colors
- Everything controlled via className composition
- Reduces component complexity to bare minimum

### 2. **Copy-Paste Distribution**
- Component source code lives in your project
- Full customization freedom without version constraints
- Can modify implementation details as needed

### 3. **Tailwind-First Design**
- Leverages Tailwind's utility-first approach completely
- No custom CSS abstractions or prop-based styling
- Direct access to full Tailwind feature set

### 4. **Arbitrary Value Support**
```typescript
// Custom dimensions with bracket notation
<Skeleton className="h-[20px] w-[100px]" />
<Skeleton className="h-[125px] w-[250px]" />
```

### 5. **Composition Over Configuration**
- No built-in layouts or presets
- Users compose multiple skeletons in custom arrangements
- Flexible container patterns (flex, grid, space-y)

### 6. **Built-in Animation**
- Pulse/shimmer effect included by default
- No configuration needed for standard loading appearance
- Animation defined in component's base CSS

### 7. **Semantic-Free Styling**
- No semantic variants (primary, secondary, etc.)
- Pure presentation component without meaning-based props
- All styling is utilitarian and dimension-focused

## Customization Patterns

### Size Customization
```typescript
// Explicit dimensions
<Skeleton className="h-12 w-12" />

// Arbitrary values
<Skeleton className="h-[40px] w-[300px]" />

// Responsive sizing
<Skeleton className="h-4 w-full md:w-[250px]" />
```

### Shape Customization
```typescript
// Circle (avatar)
<Skeleton className="h-12 w-12 rounded-full" />

// Rounded rectangle (card)
<Skeleton className="h-[125px] w-[250px] rounded-xl" />

// Slight rounding (button)
<Skeleton className="h-10 w-24 rounded-md" />

// Custom radius
<Skeleton className="h-20 w-20 rounded-[12px]" />
```

### Layout Patterns
```typescript
// Vertical stack with spacing
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-4 w-[180px]" />
</div>

// Flex layout with gap
<div className="flex gap-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <Skeleton className="h-12 flex-1" />
</div>

// Grid layout
<div className="grid grid-cols-3 gap-4">
  <Skeleton className="h-24 w-full" />
  <Skeleton className="h-24 w-full" />
  <Skeleton className="h-24 w-full" />
</div>
```

### Color Customization
```typescript
// Custom background (override default)
<Skeleton className="h-4 w-[250px] bg-slate-200" />

// Dark mode support
<Skeleton className="h-4 w-[250px] bg-slate-200 dark:bg-slate-800" />
```

### Animation Customization
```typescript
// Override animation (if needed)
<Skeleton className="h-4 w-[250px] animate-none" />

// Custom animation duration
<Skeleton className="h-4 w-[250px] animate-pulse [animation-duration:1s]" />
```

## Common Use Cases

### 1. **User Profile Skeleton**
```typescript
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-3 w-[150px]" />
  </div>
</div>
```

### 2. **Article/Post Skeleton**
```typescript
<div className="space-y-4">
  <Skeleton className="h-6 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

### 3. **Card Grid Skeleton**
```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex flex-col space-y-3">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ))}
</div>
```

### 4. **Table Skeleton**
```typescript
<div className="space-y-2">
  {[1, 2, 3, 4, 5].map((i) => (
    <div key={i} className="flex gap-4">
      <Skeleton className="h-10 w-12 rounded" />
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-32" />
    </div>
  ))}
</div>
```

## Implementation Details

### Actual Component Implementation
Based on shadcn/ui's copy-paste model, the skeleton component typically looks like:

```typescript
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

**Key Implementation Points**:
- Extends standard `HTMLDivElement` props
- Uses `cn()` utility for class merging (typically clsx + tailwind-merge)
- Default classes: `animate-pulse rounded-md bg-muted`
- All customization via className override/extension

### Default Styling
- **Animation**: `animate-pulse` (Tailwind's built-in pulse animation)
- **Shape**: `rounded-md` (medium border radius)
- **Color**: `bg-muted` (theme-aware muted background color)

### Theme Integration
The `bg-muted` class references the shadcn/ui theme system:
- Light mode: typically a light gray
- Dark mode: typically a dark gray
- Configurable via CSS custom properties in globals.css

## Research Notes

### Documentation Accessibility
The documentation is clear and well-structured, providing immediate value with code examples. The minimal API means there's less to document, which aligns with the copy-paste philosophy.

### Framework Approach Observations
ShadCN takes a radically different approach compared to traditional component libraries:
1. **No npm package** - Components are source code, not dependencies
2. **No abstraction layers** - Direct Tailwind usage, no prop-based styling
3. **Full customization** - Since code lives in your project, modify freely
4. **Tailwind-native** - Assumes and embraces Tailwind's utility-first approach

### Skeleton-Specific Patterns
- **No preset sizes** - Unlike other libraries with sm/md/lg variants
- **No preset shapes** - No "circle", "square", "text" type props
- **Pure composition** - All layouts built by combining multiple skeletons
- **Minimal abstraction** - Component is essentially a styled div with merge capability

### Unique Aspects
1. **Arbitrary values everywhere** - Heavy use of bracket notation for custom sizes
2. **className as API** - The component's only real configuration point
3. **No loading state management** - Component doesn't track loading, just displays
4. **No conditional rendering** - User responsible for showing/hiding
5. **No built-in layouts** - Every example composes multiple skeletons manually

### Comparison to Traditional Libraries
Unlike frameworks with dedicated props for every feature:
```typescript
// Traditional approach (not ShadCN)
<Skeleton variant="circle" size="lg" />
<Skeleton variant="text" width={250} lines={3} />

// ShadCN approach
<Skeleton className="h-12 w-12 rounded-full" />
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[250px]" />
</div>
```

### Developer Experience Trade-offs
**Pros**:
- Full Tailwind power available
- No learning curve for Tailwind users
- No component API to learn
- Complete styling freedom
- No version lock-in

**Cons**:
- Verbose for complex layouts
- No built-in semantic variants
- Manual repetition for multi-line text
- Requires Tailwind knowledge
- No type-safe prop variants

## Accessibility Considerations

### ARIA Attributes
The component doesn't include built-in ARIA attributes. Users should add when appropriate:

```typescript
<div role="status" aria-label="Loading...">
  <Skeleton className="h-12 w-12 rounded-full" />
  <span className="sr-only">Loading user profile...</span>
</div>
```

### Screen Reader Considerations
- Skeletons are decorative and should be hidden from screen readers in most cases
- Use `aria-hidden="true"` or `role="presentation"` if purely visual
- Include `role="status"` wrapper with live region if communicating loading state

### Reduced Motion
The component respects `prefers-reduced-motion`:
```css
/* Tailwind's animate-pulse respects user preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
```

## Integration Patterns

### With React Query
```typescript
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"

function UserProfile({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  return <div>{/* actual content */}</div>
}
```

### With Suspense Fallback
```typescript
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

function App() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <UserCard />
    </Suspense>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

### Reusable Skeleton Components
```typescript
// Common pattern: create reusable skeleton layouts
function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

// Use in components
function MyComponent({ isLoading }) {
  if (isLoading) return <ProfileSkeleton />
  return <div>{/* content */}</div>
}
```

## Summary

The ShadCN Skeleton component represents a **minimal, Tailwind-first** approach to loading placeholders:

### Core Philosophy
- **Copy-paste distribution** - Source code lives in your project
- **Tailwind-native** - No prop abstraction, pure utility classes
- **Composition over configuration** - Build layouts by combining primitives
- **Minimal API** - Only className for customization

### Key Characteristics
1. Single component with no variants or sizes
2. All customization via Tailwind className
3. Built-in pulse animation
4. Theme-integrated background color
5. Full HTML div element props support
6. Heavy use of arbitrary values for custom dimensions
7. Manual composition for all layout patterns

### Strengths
- Maximum flexibility through Tailwind
- No learning curve for Tailwind users
- Full customization freedom
- No version dependencies
- Simple, predictable behavior

### Limitations
- Verbose for complex layouts
- No semantic variants
- Manual repetition required
- Requires Tailwind expertise
- No built-in layout presets

### Ideal Use Cases
- Tailwind-based projects
- Custom design systems
- Projects needing full styling control
- Teams comfortable with utility-first CSS
- Applications where copy-paste components are preferred over npm dependencies
