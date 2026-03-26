# ShadCN UI - Alert Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ui.shadcn.com/docs/components/alert
Status: ✅ Working
Version: Current (using Tailwind CSS)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Clean, focused documentation with clear examples and installation instructions. Follows ShadCN's copy-paste philosophy with straightforward API.

## Component Definition
- **Core purpose**: Displays a callout message for user attention. Used for important information that requires acknowledgment but doesn't interrupt workflow (unlike modals or dialogs).
- **Mental model**: A static, non-dismissible notification component that presents contextual information inline with content. Acts as a visual anchor point for important messages without blocking interaction.
- **Semantic meaning**: Represents informational, warning, or error states that need to be visible but don't require immediate action. Uses semantic `role="alert"` for accessibility.

## Pattern Support Levels
- **Native**: Dedicated prop/API built into component
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling/className override

## Display Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Inline notification | ✅ | Native | Default display as block element in flow |
| Card-like container | ✅ | Native | Rounded border with padding, distinct from surrounding content |
| Grid layout | ✅ | Native | Internal grid layout for icon + content arrangement |
| Full width | ✅ | Native | Default full-width behavior (w-full) |
| Constrained width | ✅ | CSS-only | Can apply max-width via className |
| Border styling | ✅ | Native | Rounded corners and border included in base styles |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon support | ✅ | Composed | Icon as direct child, renders in grid layout |
| Title text | ✅ | Composed | AlertTitle sub-component for heading |
| Description text | ✅ | Composed | AlertDescription sub-component for details |
| Title only | ✅ | Composed | Can omit AlertDescription, use title alone |
| Description only | ✅ | Composed | Can omit AlertTitle, use description alone |
| Rich content | ✅ | Composed | Can include lists, links, formatted text in description |
| Multiple paragraphs | ✅ | Composed | Description supports complex nested content |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Static display | ✅ | Native | Non-interactive by default |
| Dismissible | ❌ | None | No built-in close/dismiss functionality |
| Auto-hide | ❌ | None | Persists until manually removed |
| Animation | ❌ | CSS-only | No built-in enter/exit animations |
| Click handler | ✅ | Native | Accepts standard div props including onClick |

## Variant Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default | ✅ | Native | `variant="default"` - neutral background, standard foreground |
| Destructive | ✅ | Native | `variant="destructive"` - error/warning red styling |
| Info variant | ❌ | CSS-only | Would need custom variant or className |
| Success variant | ❌ | CSS-only | Would need custom variant or className |
| Warning variant | ❌ | CSS-only | Typically use destructive or custom styling |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Visible | ✅ | Native | Default state |
| Hidden | ✅ | Composed | Control via conditional rendering |
| Role="alert" | ✅ | Native | Built-in ARIA role for screen readers |
| Semantic colors | ✅ | Native | Variant-based color tokens |

## Sub-Component Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| AlertTitle | ✅ | Native | Heading component with proper typography |
| AlertDescription | ✅ | Native | Body text component with appropriate styling |
| Icon slot | ✅ | Composed | No dedicated component, icon as child |
| Action buttons | ❌ | Composed | No dedicated pattern, add manually |
| Close button | ❌ | Composed | Not included, must implement manually |

## Code Examples

### Installation
```bash
pnpm dlx shadcn@latest add alert
```

### Basic Import and Usage
```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Basic alert
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

### Variant Examples
```typescript
// Default variant (neutral)
<Alert variant="default">
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>
    This is a standard informational message.
  </AlertDescription>
</Alert>

// Destructive variant (error/warning)
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### With Icons
```typescript
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react"

// Info with icon
<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>

// Success with icon
<Alert>
  <CheckCircle2 className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>

// Error with icon
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    There was a problem processing your request.
  </AlertDescription>
</Alert>
```

### Title Only Pattern
```typescript
import { Popcorn } from "lucide-react"

// Alert without description
<Alert>
  <Popcorn className="h-4 w-4" />
  <AlertTitle>Quick tip: Try keyboard shortcuts!</AlertTitle>
</Alert>
```

### Rich Content in Description
```typescript
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Could not complete action</AlertTitle>
  <AlertDescription>
    The following issues were found:
    <ul className="mt-2 list-disc pl-4">
      <li>Invalid email format</li>
      <li>Password must be at least 8 characters</li>
      <li>Terms of service must be accepted</li>
    </ul>
  </AlertDescription>
</Alert>
```

### Custom Styling
```typescript
// Constrain width
<Alert className="max-w-md">
  <AlertTitle>Narrow alert</AlertTitle>
  <AlertDescription>
    This alert has a maximum width constraint.
  </AlertDescription>
</Alert>

// Custom colors (override variant)
<Alert className="border-blue-500 bg-blue-50 text-blue-900">
  <AlertTitle>Custom styled</AlertTitle>
  <AlertDescription>
    This uses custom Tailwind classes instead of variants.
  </AlertDescription>
</Alert>
```

### Conditional Display
```typescript
function FormWithValidation() {
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
    </div>
  )
}
```

### Complete Example with Multiple Alert Types
```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, CheckCircle2, AlertCircle, Info } from "lucide-react"

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-4">
      {/* Info alert */}
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>CLI Available</AlertTitle>
        <AlertDescription>
          You can add components and dependencies to your app using the cli.
        </AlertDescription>
      </Alert>

      {/* Success alert */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>
          Your profile has been updated successfully.
        </AlertDescription>
      </Alert>

      {/* Warning/error alert */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>
          Your session is about to expire. Please save your work.
        </AlertDescription>
      </Alert>

      {/* Title only */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>
          Pro tip: Use keyboard shortcuts for faster navigation
        </AlertTitle>
      </Alert>

      {/* With rich content */}
      <Alert variant="destructive" className="max-w-xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Form validation failed</AlertTitle>
        <AlertDescription>
          Please correct the following errors:
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Email address is required</li>
            <li>Password must be at least 8 characters</li>
            <li>
              Username is already taken. Try{" "}
              <a href="#" className="underline">
                these suggestions
              </a>
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

## API Reference

### Alert Component
```typescript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  className?: string
  // Inherits all standard div props
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>
```

**Props:**
- `variant`: Visual style variant ("default" | "destructive")
- `className`: Additional Tailwind classes for customization
- All standard HTML div attributes (onClick, onMouseEnter, etc.)

**Default Styles:**
- Full width (`w-full`)
- Rounded borders (`rounded-lg`)
- Border with variant-specific color
- Padding (`px-4 py-3`)
- Grid layout for icon + content
- Small text size (`text-sm`)
- ARIA role="alert"

### AlertTitle Component
```typescript
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>
```

**Default Styles:**
- Medium font weight
- Bottom margin for spacing from description
- Tracking tight
- Leading relaxed

### AlertDescription Component
```typescript
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>
```

**Default Styles:**
- Smaller text size
- Muted text color (opacity/lighter)
- Leading relaxed

## Notable Features

### Copy-Paste Philosophy
- **Not an npm package**: Alert component is copied into your project
- **Full control**: Modify source code directly in your codebase
- **No versioning conflicts**: You own the implementation
- **Easy customization**: Edit alertVariants directly to add new variants

### CVA (Class Variance Authority) Integration
- Uses `cva` for type-safe variant management
- Variants defined with Tailwind classes
- Easy to extend with new variants:
```typescript
const alertVariants = cva(
  "base classes...",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive",
        // Add your own:
        success: "border-green-500 bg-green-50 text-green-900",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-900",
      }
    }
  }
)
```

### Tailwind CSS Architecture
- **Pure Tailwind**: No separate CSS files
- **Design tokens**: Uses Tailwind theme colors (destructive, foreground, etc.)
- **Dark mode ready**: Color tokens adapt to dark/light themes
- **Responsive**: Can add responsive modifiers via className

### Grid Layout System
- Internal grid layout handles icon + content alignment
- Icon and text automatically aligned
- No manual flexbox/spacing needed
- Gap between elements handled by base styles

### Composition Model
- **Minimal API surface**: Only variant prop, rest is composition
- **Flexible structure**: Can omit title or description
- **Rich content support**: Description accepts any JSX
- **Icon agnostic**: Works with any icon library (Lucide React is default)

### Accessibility Features
- **role="alert"**: Proper ARIA role for screen reader announcements
- **Semantic HTML**: Uses appropriate heading/paragraph elements
- **Keyboard accessible**: Can add keyboard handlers via props
- **Color contrast**: Variants maintain WCAG contrast ratios

### Radix UI Foundation
- While simpler than many ShadCN components, follows Radix patterns
- No Radix primitive needed (unlike AlertDialog)
- Pure React + Tailwind implementation
- forwardRef for proper ref handling

## Research Notes

### Framework Approach
ShadCN Alert exemplifies the library's core philosophy:
- **Simplicity first**: No complex state management or API
- **Composition over configuration**: Sub-components instead of props
- **Copy-paste architecture**: Developer owns the code
- **Tailwind native**: Styling through utility classes only

### Design Philosophy
- **Non-intrusive**: Static display, doesn't interrupt workflow
- **Content flexible**: Accommodates various content structures
- **Minimal variants**: Only essential variants provided (default, destructive)
- **Extension encouraged**: Easy to add custom variants and styles

### Implementation Strategy
- **React.forwardRef**: Proper ref forwarding for DOM access
- **CVA for variants**: Type-safe variant system
- **Composition pattern**: AlertTitle and AlertDescription as separate components
- **Grid layout**: Modern CSS grid for icon + content arrangement
- **No JavaScript logic**: Pure presentational component

### Pattern Observations

#### Strengths
1. **Minimal API surface**: Only one prop (variant), very easy to learn
2. **Highly composable**: Mix and match title, description, icons freely
3. **Easy to customize**: Direct code ownership enables modifications
4. **Type-safe**: TypeScript support with proper prop typing
5. **Accessible by default**: Proper semantic HTML and ARIA roles

#### Limitations
1. **No dismissibility**: Must implement close button manually
2. **Limited variants**: Only two variants out of the box (default, destructive)
3. **No animations**: Enter/exit animations not included
4. **No auto-hide**: Persistence must be managed externally
5. **No action buttons**: Must compose button patterns manually

#### Unique Characteristics
1. **Grid over flexbox**: Uses CSS grid for layout vs common flexbox approach
2. **Separate sub-components**: AlertTitle/Description vs single content prop
3. **Icon as child**: Icon composed as child vs dedicated iconLeft/iconRight props
4. **No close button**: Philosophy of persistent, non-dismissible messages
5. **Minimal variants**: Intentionally limited vs comprehensive variant systems

### Comparison with Other Patterns

**vs Traditional Alert Libraries:**
- Less feature-rich but more customizable
- No JavaScript state management
- Simpler API but requires more composition knowledge

**vs Chakra UI Alert:**
- No status prop (success/info/warning/error)
- No AlertIcon helper component
- Simpler variant system
- More manual composition required

**vs Material-UI Alert:**
- No severity prop
- No built-in close button
- No icons mapped to variants automatically
- Must compose icon + content manually

**vs Ant Design Alert:**
- No message/description props (uses sub-components instead)
- No closable prop
- No banner/type variations
- Simpler but less batteries-included

### Semantic UI Integration Considerations

#### Patterns to Adopt
1. **Sub-component composition**: MessageTitle, MessageDescription pattern
2. **Minimal variant API**: Start simple, extend as needed
3. **Grid layout**: Modern approach to icon + content alignment
4. **Copy-paste friendly**: Make components easy to customize
5. **Type-safe variants**: CVA-like approach for variant management

#### Patterns to Enhance
1. **Built-in variants**: Add success, warning, info variants out of box
2. **Dismissibility**: Consider native dismiss functionality
3. **Icon mapping**: Optional automatic icon selection per variant
4. **Action slot**: Dedicated pattern for action buttons
5. **Animation support**: Built-in enter/exit transitions

#### API Design Considerations
```typescript
// Possible Semantic UI approach (combining ShadCN simplicity with more features):

// Minimal like ShadCN:
<ui-message variant="destructive">
  <ui-message-title>Error</ui-message-title>
  <ui-message-description>Something went wrong</ui-message-description>
</ui-message>

// Or with more built-in features:
<ui-message
  variant="error"          // More semantic variants
  dismissible              // Built-in close
  icon="alert-circle"      // Optional auto-icon
>
  <ui-message-header>Error</ui-message-header>
  <ui-message-content>Something went wrong</ui-message-content>
  <ui-message-actions>    // Optional action slot
    <ui-button size="sm">Retry</ui-button>
  </ui-message-actions>
</ui-message>
```

### Implementation Insights

#### CVA Pattern
```typescript
// ShadCN uses cva for variant management
import { cva } from "class-variance-authority"

const alertVariants = cva(
  // Base styles
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)
```

#### Component Structure
```typescript
// Simplified implementation structure
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
)

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
)
```

### Key Takeaways

1. **Simplicity wins**: One prop (variant) handles most use cases
2. **Composition is powerful**: Sub-components provide flexibility without prop explosion
3. **Customization matters**: Copy-paste approach enables easy modifications
4. **Grid layout**: Modern CSS grid is elegant for icon + content
5. **Limited variants intentional**: Easy to extend but starts minimal
6. **Accessibility built-in**: role="alert" and semantic HTML by default
7. **Type safety**: forwardRef + TypeScript provide good DX
8. **No magic**: Straightforward implementation, easy to understand

### Questions for Semantic UI Design

1. Should Message component be dismissible by default or opt-in?
2. Include more variants (success, info, warning) out of box?
3. Auto-map icons to variants or always require manual composition?
4. Support actions/buttons natively or leave to composition?
5. Include animations or keep static like ShadCN?
6. Use grid layout or flexbox for icon alignment?
7. Single content prop or separate title/description components?
8. Follow copy-paste philosophy or provide as web component?
