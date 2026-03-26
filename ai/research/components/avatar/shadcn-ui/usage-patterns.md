# Shadcn UI - Avatar Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/avatar
Status: ✅ Working
Version: Current (using Radix UI Avatar v1.1.10)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Clear examples with installation instructions. Concise but covers essential patterns. Additional technical details available in the Radix UI Avatar primitive documentation.

## Component Definition
- **Core purpose**: An image element with a fallback for representing users. Provides graceful degradation when profile images fail to load or are unavailable.
- **Mental model**: A three-part composite component where the image attempts to load, and if it fails or is delayed, a fallback (typically initials) is shown. The container handles the orchestration between image and fallback states.
- **Semantic meaning**: Represents user identity in the UI through visual imagery. The fallback provides a reliable alternative representation that maintains recognizability through initials or placeholder content.

## Pattern Support Levels
- **Native**: Dedicated prop/API in Radix primitives
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling via className

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image display | ✅ | Native | `AvatarImage` with `src` and `alt` props |
| Fallback text | ✅ | Composed | `AvatarFallback` accepts any children (typically initials) |
| Icon fallback | ✅ | Composed | Icons can be used as fallback children |
| Loading state | ✅ | Native | Automatic - fallback shown during image load |
| Custom content | ✅ | Composed | Any valid React children in fallback |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Circular (default) | ✅ | CSS-only | Default styling with `rounded-full` |
| Rounded rectangle | ✅ | CSS-only | `className="rounded-lg"` on Avatar component |
| Square | ✅ | CSS-only | Custom className to override border-radius |
| Custom shapes | ✅ | CSS-only | Any border-radius via className prop |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | Automatic - shows fallback while image loads |
| Error | ✅ | Native | Automatic - shows fallback if image fails to load |
| Loaded | ✅ | Native | Automatic - displays image when successfully loaded |
| Loading status callback | ✅ | Native | `onLoadingStatusChange` handler on AvatarImage |
| Delayed fallback | ✅ | Native | `delayMs` prop on AvatarFallback prevents flash |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Size controlled via className (w-* h-* utilities) |
| Shape variants | ✅ | CSS-only | Controlled via className (rounded-* utilities) |
| Border/Ring | ✅ | CSS-only | Tailwind ring-* utilities via className |
| Overlapping groups | ✅ | CSS-only | Flex utilities with negative margins |
| Grayscale filter | ✅ | CSS-only | CSS filter via className |
| Custom styling | ✅ | Native | All components accept className prop |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable avatar | ✅ | Composed | Wrap in button or use asChild pattern |
| AsChild pattern | ✅ | Native | All three components support asChild for polymorphism |
| Hover effects | ✅ | CSS-only | Via className hover: utilities |
| Status indicators | ✅ | Composed | Add badge/dot as additional child |
| Tooltip on hover | ✅ | Composed | Wrap in Tooltip component |

## Code Examples

### Installation
```bash
pnpm dlx shadcn@latest add avatar
```

### Basic Import and Usage
```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

// Basic avatar with fallback
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

### Different Shapes
```tsx
// Circular (default)
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Rounded rectangle
<Avatar className="rounded-lg">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Square
<Avatar className="rounded-none">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Size Variations
```tsx
// Small avatar
<Avatar className="h-8 w-8">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback className="text-xs">JD</AvatarFallback>
</Avatar>

// Medium avatar (default)
<Avatar className="h-10 w-10">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Large avatar
<Avatar className="h-16 w-16">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback className="text-lg">JD</AvatarFallback>
</Avatar>

// Extra large avatar
<Avatar className="h-24 w-24">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback className="text-2xl">JD</AvatarFallback>
</Avatar>
```

### Fallback Patterns
```tsx
// Text fallback (initials)
<Avatar>
  <AvatarImage src="/user.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Icon fallback
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>
    <UserIcon className="h-4 w-4" />
  </AvatarFallback>
</Avatar>

// Delayed fallback (prevents flash on fast connections)
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback delayMs={600}>JD</AvatarFallback>
</Avatar>

// Custom styled fallback
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-600 text-white">
    JD
  </AvatarFallback>
</Avatar>
```

### Loading Status Control
```tsx
import { useState } from "react"

function AvatarWithStatus() {
  const [status, setStatus] = useState("idle")

  return (
    <div>
      <Avatar>
        <AvatarImage
          src="/user.jpg"
          alt="User"
          onLoadingStatusChange={(status) => setStatus(status)}
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <p className="text-sm text-muted-foreground mt-2">
        Status: {status}
      </p>
    </div>
  )
}
```

### Avatar Groups (Overlapping)
```tsx
// Overlapping avatars with rings
<div className="flex -space-x-2">
  <Avatar className="ring-2 ring-background">
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
    <AvatarFallback>VC</AvatarFallback>
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <AvatarImage src="https://github.com/react.png" alt="@react" />
    <AvatarFallback>RC</AvatarFallback>
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <AvatarFallback>+5</AvatarFallback>
  </Avatar>
</div>
```

### Advanced Group with Grayscale
```tsx
// Using Tailwind arbitrary variants for complex styling
<div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
  <Avatar data-slot="avatar">
    <AvatarImage src="/user1.jpg" alt="User 1" />
    <AvatarFallback>U1</AvatarFallback>
  </Avatar>
  <Avatar data-slot="avatar">
    <AvatarImage src="/user2.jpg" alt="User 2" />
    <AvatarFallback>U2</AvatarFallback>
  </Avatar>
  <Avatar data-slot="avatar">
    <AvatarImage src="/user3.jpg" alt="User 3" />
    <AvatarFallback>U3</AvatarFallback>
  </Avatar>
</div>
```

### Interactive Avatars
```tsx
// Clickable avatar (as button)
<Avatar className="cursor-pointer transition-transform hover:scale-110">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Using asChild for polymorphic rendering
<Avatar asChild>
  <button onClick={() => console.log("Avatar clicked")}>
    <AvatarImage src="/user.jpg" alt="User" />
    <AvatarFallback>JD</AvatarFallback>
  </button>
</Avatar>

// With tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Avatar>
        <AvatarImage src="/user.jpg" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </TooltipTrigger>
    <TooltipContent>
      <p>John Doe</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Status Indicators
```tsx
// Avatar with online status badge
<div className="relative">
  <Avatar>
    <AvatarImage src="/user.jpg" alt="User" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
</div>

// Avatar with notification badge
<div className="relative">
  <Avatar>
    <AvatarImage src="/user.jpg" alt="User" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
    3
  </span>
</div>
```

### Complete Example with Multiple Patterns
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserIcon } from "lucide-react"

export function AvatarDemo() {
  const users = [
    { name: "Alice Johnson", image: "/alice.jpg", status: "online" },
    { name: "Bob Smith", image: "/bob.jpg", status: "offline" },
    { name: "Carol White", image: "/carol.jpg", status: "away" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "away": return "bg-yellow-500"
      case "offline": return "bg-gray-400"
      default: return "bg-gray-400"
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div className="space-y-8">
      {/* Basic avatars in different sizes */}
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/user.jpg" alt="Small" />
          <AvatarFallback className="text-xs">SM</AvatarFallback>
        </Avatar>
        <Avatar className="h-10 w-10">
          <AvatarImage src="/user.jpg" alt="Medium" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar className="h-16 w-16">
          <AvatarImage src="/user.jpg" alt="Large" />
          <AvatarFallback className="text-lg">LG</AvatarFallback>
        </Avatar>
      </div>

      {/* User list with status indicators */}
      <div className="space-y-3">
        {users.map((user) => (
          <TooltipProvider key={user.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-background ${getStatusColor(user.status)}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.status}</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name} is {user.status}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Avatar group */}
      <div className="flex -space-x-2">
        {users.map((user, i) => (
          <Avatar key={i} className="ring-2 ring-background">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        ))}
        <Avatar className="ring-2 ring-background">
          <AvatarFallback>+5</AvatarFallback>
        </Avatar>
      </div>

      {/* Different shapes */}
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="/user.jpg" alt="Circular" />
          <AvatarFallback>CI</AvatarFallback>
        </Avatar>
        <Avatar className="rounded-lg">
          <AvatarImage src="/user.jpg" alt="Rounded" />
          <AvatarFallback>RD</AvatarFallback>
        </Avatar>
        <Avatar className="rounded-none">
          <AvatarImage src="/user.jpg" alt="Square" />
          <AvatarFallback>SQ</AvatarFallback>
        </Avatar>
      </div>

      {/* Icon fallback */}
      <Avatar className="h-16 w-16">
        <AvatarImage src="/nonexistent.jpg" alt="User" />
        <AvatarFallback>
          <UserIcon className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
```

## Notable Features

### Radix UI Avatar Primitive Foundation
- Built on `@radix-ui/react-avatar` (v1.1.10, 3.11 kB gzipped)
- Provides automatic loading state management
- Smart fallback rendering based on image load status
- Three composable parts: Root, Image, and Fallback

### Automatic Loading Management
- Image only renders after successful load
- Fallback automatically shown during loading or on error
- No manual state management required for basic use cases
- `onLoadingStatusChange` callback available for advanced control

### Delayed Fallback Prevention
- `delayMs` prop on AvatarFallback prevents "flash of fallback"
- Useful for fast connections where image loads quickly
- Improves perceived performance and reduces visual jitter
- Recommended value: 600ms for optimal UX

### Polymorphic Rendering via AsChild
- All three components support `asChild` prop
- Enables rendering as different elements (buttons, links, etc.)
- Uses Radix Slot for proper prop/ref merging
- Maintains accessibility while providing flexibility

### Composition-First Philosophy
- No built-in size variants - controlled via className
- Fallback content completely flexible (text, icons, custom elements)
- Shape controlled through Tailwind border-radius utilities
- Enables unlimited customization without API bloat

### Tailwind CSS Integration
- All styling via Tailwind utilities through className prop
- No separate CSS files or CSS-in-JS
- Leverages Tailwind's arbitrary variants for complex patterns
- Group styling possible with Tailwind's group/peer utilities

### Flexible Fallback Content
- Accepts any valid React children
- Common patterns: initials, icons, placeholder graphics
- Can include complex components or styled elements
- Inherits sizing from parent Avatar container

### Avatar Group Patterns
- Overlapping achieved with negative margins (`-space-x-*`)
- Ring borders for visual separation (`ring-*`)
- Supports grayscale filters via className
- Arbitrary variant selectors for complex group styling

## Research Notes

### Framework Approach
Shadcn UI's Avatar follows the copy-paste component philosophy:
- **Not an npm package**: Code is copied into your project via CLI
- **Built on Radix**: Uses Radix UI Avatar primitive for behavior
- **Styled with Tailwind**: All visual styling through Tailwind utilities
- **Full ownership**: Complete control over implementation and customization

### Design Philosophy
- **Minimal API surface**: Core props focused on essential behavior
- **Composition over configuration**: Flexibility through children, not props
- **Smart defaults**: Automatic loading/error handling without boilerplate
- **Accessibility built-in**: Leverages Radix's accessible foundations
- **Performance conscious**: Delayed fallback prevents unnecessary renders

### Implementation Strategy
- **Three-component composition**: Avatar → AvatarImage + AvatarFallback
- **Radix for behavior**: Loading detection, fallback orchestration
- **Tailwind for appearance**: All visual styling, no CSS modules
- **Slot for polymorphism**: asChild pattern enables element flexibility
- **Automatic state management**: Loading/error states handled internally

### Pattern Observations
1. **No size prop**: Sizes controlled entirely through className (w-*, h-*)
2. **No shape prop**: Shape variants use border-radius utilities
3. **Automatic fallback**: No manual isLoading state needed
4. **Flexible content**: Fallback accepts any children, not just text
5. **Loading callback optional**: Only needed for advanced use cases
6. **Delayed fallback**: `delayMs` prevents flash on fast connections
7. **Status indicators**: Achieved through absolute positioning, not built-in
8. **Group patterns**: Composition with flex utilities, not dedicated component

### Strengths
- Extremely simple API for common use cases
- Automatic loading/error handling reduces boilerplate
- Infinite customization through className and children
- Clean separation between behavior (Radix) and appearance (Tailwind)
- Type-safe through TypeScript definitions
- Lightweight (3.11 kB for Radix primitive)
- Excellent documentation with visual examples
- Smart fallback delay prevents visual jitter

### Potential Limitations
- No built-in size variants (must use className)
- Status indicators require manual implementation
- Avatar groups require understanding flex utilities
- No built-in hover effects or interactive states
- Copy-paste approach means no centralized updates
- Requires Tailwind CSS knowledge for customization

### Semantic UI Integration Considerations

#### Pattern Adoption
- **Automatic fallback**: Adopt the automatic loading/error fallback pattern
- **Delayed fallback**: Consider `delayMs` equivalent to prevent flash
- **Three-part composition**: Avatar + Image + Fallback structure is elegant
- **Loading callback**: Provide similar `onLoadingStatusChange` for advanced use

#### API Design
- **Size variants**: Consider both className approach AND size prop variants
- **Shape variants**: Could provide both rounded prop AND className override
- **Status indicators**: Evaluate built-in status prop vs composition
- **Fallback content**: Support both text (initials) and custom children

#### Implementation Patterns
- **State management**: Adopt automatic loading detection approach
- **Fallback strategy**: Use similar fallback-first rendering pattern
- **Image optimization**: Consider lazy loading and srcset support
- **Accessibility**: Ensure alt text requirements are enforced

#### Semantic UI Advantages
- **Built-in variants**: Could offer size/shape props for easier DX
- **Status support**: Native status indicator prop would reduce boilerplate
- **Theme integration**: Automatic color scheme from design tokens
- **Group component**: Dedicated AvatarGroup for overlapping patterns
- **Loading states**: Could provide visual loading spinner option

#### Divergence Opportunities
- Provide both prop-based AND className-based size control
- Built-in status badge/indicator support
- Native avatar group component for overlapping layout
- Configurable fallback strategies (initials generator from name)
- Optional loading spinner state (not just fallback text)
- Integration with Semantic UI's broader design system
