# ShadCN - Aspect Ratio Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/aspect-ratio
Status: ✅ Working
Version: Current (based on Radix UI Aspect Ratio v1.1.7)
Last Verified: 2025-11-05

## Documentation Quality
Good - Concise documentation with practical example and clear installation instructions. References Radix UI for complete API documentation.

## Component Definition
- **Core purpose**: Displays content within a desired aspect ratio, maintaining consistent proportions regardless of container dimensions
- **Mental model**: A constraint container that enforces a specific width-to-height ratio on its children
- **Semantic meaning**: A layout utility that ensures content maintains visual proportions, commonly used for responsive images and media

## Pattern Support Levels
- **Native**: Direct prop for ratio control (`ratio={16/9}`)
- **Composed**: Content via children composition
- **CSS-only**: Styling via className prop

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image content | ✅ | Composed | Images as children, demonstrated with Next.js Image component |
| Media content | ✅ | Composed | Any child element supported (images, videos, embeds) |
| Custom content | ✅ | Composed | Content-agnostic design via children |
| Text content | ✅ | Composed | Any valid React children accepted |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Ratio-based layout | ✅ | Native | Primary pattern via `ratio` prop |
| Responsive container | ✅ | Native | Automatically scales with container dimensions |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | No built-in loading state |
| Disabled | ❌ | N/A | Not applicable to layout utility |
| Error | ❌ | N/A | Not applicable to layout utility |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Ratio options | ✅ | Native | `ratio` prop accepts any numeric value (16/9, 4/3, 1/1, etc.) |
| Custom styling | ✅ | CSS-only | `className` prop for custom styling |
| Background | ✅ | CSS-only | Applied via className (e.g., `bg-muted`) |
| Border radius | ✅ | CSS-only | Applied via className (e.g., `rounded-lg`) |

## Props/API Documentation

### AspectRatio Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratio` | number | 1 | Specifies the desired aspect ratio (width/height) |
| `className` | string | - | CSS class names for styling |
| `asChild` | boolean | false | Merge props with child element (Radix UI pattern) |

### Common Ratio Values
- **16/9**: Widescreen video (1.777...)
- **4/3**: Standard video (1.333...)
- **1/1**: Square
- **21/9**: Ultrawide
- **3/2**: Classic photography

## Code Examples

### Basic Usage
```jsx
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
      <Image
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo by Drew Beamer"
        fill
        className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </AspectRatio>
  )
}
```

### Simple Pattern
```jsx
<AspectRatio ratio={16 / 9}>
  <Image src="..." alt="Image" className="rounded-md object-cover" />
</AspectRatio>
```

### Installation
```bash
pnpm dlx shadcn@latest add aspect-ratio
```

### Import
```javascript
import { AspectRatio } from "@/components/ui/aspect-ratio"
```

## Composition Patterns

### With Next.js Image
- **Pattern**: AspectRatio wrapper + Next.js Image with `fill` prop
- **Styling**: Combined className on both components for coordinated appearance
- **Dark mode**: Conditional styling via Tailwind variants (e.g., `dark:brightness-[0.2]`)

### With Background Styling
- **Pattern**: Container styling on AspectRatio itself
- **Example**: `className="bg-muted rounded-lg"` for background and border radius

## Styling Approaches

### Tailwind Integration
- Direct Tailwind className support
- Background colors: `bg-muted`, `bg-gray-100`, etc.
- Border radius: `rounded-lg`, `rounded-md`, etc.
- Dark mode variants: `dark:brightness-[0.2]`, `dark:grayscale`

### Object Fit Control
- Applied to child elements (e.g., `object-cover`, `object-contain`)
- Ensures content fills or fits within ratio constraint

## Accessibility Patterns

### Image Accessibility
- **Alt text**: Required on Image components for screen readers
- **Semantic HTML**: Uses appropriate element types for content

### No Built-in ARIA
- Component is a layout utility, not an interactive element
- Accessibility handled by child content

## Technical Implementation

### Underlying Technology
- Built on **Radix UI Aspect Ratio primitive** (v1.1.7)
- Bundle size: 1.71 kB (gzipped)
- Uses modern CSS aspect-ratio property or padding-bottom technique

### Rendering Approach
- Maintains aspect ratio without JavaScript calculations
- Responsive by default
- Works with any child element type

### AsChild Pattern
- Radix UI composition pattern
- Merges props with child element when `asChild={true}`
- Enables flexible component composition

## Notable Features

### Flexible Ratio Support
- Accepts any numeric ratio value
- Common use cases: 16/9 (video), 4/3 (standard), 1/1 (square)
- Mathematical expression support: `ratio={16 / 9}` for clarity

### Content Agnostic
- Works with images, videos, iframes, or any content
- No restrictions on child element types
- Styling entirely controlled via className

### Next.js Integration
- Primary example uses Next.js Image component
- Demonstrates `fill` prop pattern for responsive images
- Shows dark mode integration with Tailwind

### Minimal API Surface
- Single required prop (`ratio`)
- Simple composition model
- Relies on standard React patterns (children, className)

### Radix UI Foundation
- Benefits from Radix UI's accessibility focus
- Part of the broader Radix primitives ecosystem
- Well-tested and maintained implementation

## Research Notes

### Documentation Approach
- ShadCN provides practical implementation examples
- Defers to Radix UI documentation for complete API reference
- Focus on integration with Next.js and Tailwind

### Framework Integration
- Designed for React ecosystem
- Tight integration with Tailwind CSS
- Common in Next.js applications

### Use Case Focus
- Primary example: responsive images
- Implicit support for video/embed use cases
- Layout utility rather than full-featured component

### Design Philosophy
- Minimal abstraction over Radix UI primitive
- Styling left to consumer via className
- Composition-based rather than prop-heavy API
