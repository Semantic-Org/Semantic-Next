# ShadCN UI - Card Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ui.shadcn.com/docs/components/card
Status: ✅ Working
Version: Current
Last Verified: 2025-11-04

## Documentation Quality
Good - Clear structural examples with practical use case (login form). Documentation is intentionally minimal, focusing on composition patterns rather than extensive configuration options.

## Component Definition
- **Core purpose**: Displays content within a structured container with optional header, content, and footer sections. Provides semantic organization for related information and actions.
- **Mental model**: A composable content container with distinct sections. Think of it as a "document within a document" - a self-contained unit that groups related information with clear visual boundaries.
- **Semantic meaning**: Represents a discrete piece of content or functionality. Visual structure communicates information hierarchy (title > description > content > actions).

## Pattern Support Levels
- **Native**: Dedicated component/prop
- **Composed**: Via sub-component composition
- **CSS-only**: Requires custom styling via className

## Container Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Card root | ✅ | Native | `<Card>` - Main wrapper component with rounded corners, border, shadow |
| Width control | ✅ | CSS-only | Via className (e.g., `className="w-full max-w-sm"`) |
| Height control | ✅ | CSS-only | Via className with Tailwind utilities |
| Padding control | ✅ | CSS-only | Controlled via className, default padding provided |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header section | ✅ | Native | `<CardHeader>` - Top section container for titles and metadata |
| Title | ✅ | Native | `<CardTitle>` - Primary heading element |
| Description | ✅ | Native | `<CardDescription>` - Subtitle/descriptive text with muted styling |
| Action area | ✅ | Native | `<CardAction>` - Interactive elements in header (buttons, links) |
| Content section | ✅ | Native | `<CardContent>` - Main body content area |
| Footer section | ✅ | Native | `<CardFooter>` - Bottom section for secondary actions |
| Nested content | ✅ | Composed | Any content can be composed within sections |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical structure | ✅ | Native | Default layout - header, content, footer stack vertically |
| Header + Actions | ✅ | Native | CardHeader + CardAction pattern for title with inline actions |
| Multi-column footer | ✅ | CSS-only | CardFooter with flex classes (e.g., `flex-col gap-2`) |
| Form integration | ✅ | Composed | CardContent wraps form elements naturally |
| Spacing control | ✅ | Native | Built-in spacing between sections, customizable via className |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default card | ✅ | Native | Standard card with all structural elements available |
| Header-only | ✅ | Composed | Omit CardContent/CardFooter, use only CardHeader |
| Content-only | ✅ | Composed | Omit CardHeader/CardFooter, use only CardContent |
| Full structure | ✅ | Composed | All sections: Header + Content + Footer |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Interactive | ✅ | CSS-only | Can add hover effects via className |
| Disabled | ✅ | CSS-only | Apply opacity/pointer-events via className |
| Loading | ✅ | Composed | Compose loading spinners in CardContent |
| Selected | ✅ | CSS-only | Add border/background changes via className |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ❌ | CSS-only | No prop-based sizes, use className for width/padding |
| Visual variants | ❌ | CSS-only | No variant prop (outlined/filled/elevated), customize via className |
| Color schemes | ❌ | CSS-only | No color props, use Tailwind theme colors via className |
| Shadow variants | ❌ | CSS-only | Default shadow provided, customize via className |
| Border variants | ❌ | CSS-only | Default border provided, customize via className |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tailwind classes | ✅ | Native | Full Tailwind support via className prop on all components |
| cn utility | ✅ | Native | All components use cn() for class merging |
| Responsive design | ✅ | CSS-only | Apply responsive classes (sm:, md:, lg:) via className |
| Dark mode | ✅ | Native | Built-in dark mode support through Tailwind |
| Custom styling | ✅ | Native | className prop on all sub-components |

## Code Examples

### Installation
```bash
pnpm dlx shadcn@latest add card
```

### Basic Import
```jsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

### Minimal Card Structure
```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

### Complete Login Form Example
```jsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto inline-block text-sm">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Header with Inline Action
```jsx
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
    <CardAction>
      <Button variant="link">Edit</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Settings content */}
  </CardContent>
</Card>
```

### Content-Only Card
```jsx
<Card>
  <CardContent>
    <p>Simple card with just content, no header or footer.</p>
  </CardContent>
</Card>
```

### Multi-Button Footer
```jsx
<Card>
  <CardHeader>
    <CardTitle>Confirm Action</CardTitle>
    <CardDescription>This action cannot be undone</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Are you sure you want to proceed?</p>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" className="flex-1">Cancel</Button>
    <Button variant="destructive" className="flex-1">Delete</Button>
  </CardFooter>
</Card>
```

### Responsive Width Control
```jsx
<Card className="w-full md:w-96 lg:w-[500px]">
  <CardHeader>
    <CardTitle>Responsive Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This card adapts its width based on screen size.</p>
  </CardContent>
</Card>
```

### Custom Styling
```jsx
<Card className="border-2 border-blue-500 shadow-lg">
  <CardHeader className="bg-blue-50">
    <CardTitle className="text-blue-900">Custom Styled Card</CardTitle>
    <CardDescription className="text-blue-700">
      With custom colors and borders
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content with custom styling applied</p>
  </CardContent>
</Card>
```

## Component Implementation Details

### Copy-Paste Philosophy
ShadCN UI components are not installed as npm packages. Instead:
1. CLI copies component source code into your project
2. Code lives in `@/components/ui/card` directory
3. Full control to modify implementation
4. No version lock-in or breaking changes
5. You own the code completely

### Architectural Pattern
```
Card (root container)
├── CardHeader (optional, top section)
│   ├── CardTitle (optional, heading)
│   ├── CardDescription (optional, subtitle)
│   └── CardAction (optional, header actions)
├── CardContent (optional, main content)
└── CardFooter (optional, bottom section)
```

All sections are optional - compose only what you need.

### Styling Implementation
- **Tailwind CSS**: All styling via Tailwind utility classes
- **cn utility**: Merges className props with default styles
- **No CSS files**: No separate stylesheet, everything in component
- **No variants**: Unlike Button component, Card has no variant prop system
- **Full customization**: Every sub-component accepts className prop

### Default Styles Applied
```typescript
// Card (inferred from typical ShadCN pattern)
cn(
  "rounded-xl border bg-card text-card-foreground shadow",
  className
)

// CardHeader
cn("flex flex-col space-y-1.5 p-6", className)

// CardTitle
cn("font-semibold leading-none tracking-tight", className)

// CardDescription
cn("text-sm text-muted-foreground", className)

// CardContent
cn("p-6 pt-0", className)

// CardFooter
cn("flex items-center p-6 pt-0", className)
```

### React Patterns
- **forwardRef**: All components likely use React.forwardRef for ref passing
- **Spread props**: Accepts and spreads additional HTML attributes
- **TypeScript**: Full type definitions for props
- **Composition**: Children-based content patterns

## Notable Features

### Compositional Flexibility
- All sub-components are optional
- Order can be customized (though semantic order is recommended)
- Multiple instances of same sub-component possible (e.g., multiple CardContent sections)
- Nesting is unrestricted - compose any React content within sections

### CardAction Component
- Unique to header section
- Typically positions actions (links, buttons) in header area
- Example usage: "Sign Up" link alongside "Login" title
- Provides semantic separation of header metadata vs header actions

### No Variant System
Unlike ShadCN's Button component (which has variant/size props):
- Card has no variant prop
- No elevation variants (flat/raised/outlined)
- No color scheme variants
- Philosophy: Cards are structurally consistent, style via className

### Theme Integration
- Uses semantic color tokens (`bg-card`, `text-card-foreground`)
- Automatically adapts to dark mode via Tailwind
- Shadow and border inherit from theme configuration
- Spacing uses theme spacing scale

### Form Integration Pattern
Documentation emphasizes Cards as form containers:
- CardHeader for form title/description
- CardContent wraps form fields
- CardFooter for submit/cancel actions
- Natural structure for multi-step forms

### Accessibility Considerations
- No explicit ARIA roles applied (just semantic HTML)
- CardTitle renders as heading element (likely h3)
- CardDescription provides subtitle context
- Structure is keyboard-navigable when interactive elements included

## Research Notes

### Framework Approach
ShadCN UI's card differs from traditional component libraries:
- **Structure-focused**: Provides layout structure, not style variants
- **Composition over configuration**: No props for visual variants
- **Semantic sections**: Named sub-components convey purpose
- **Tailwind-first**: All customization through utility classes

### Design Philosophy
- **Minimal API**: Only structural components, no variant complexity
- **Full control**: className on every sub-component enables any design
- **Semantic markup**: Component names describe content purpose
- **Flexibility**: Optional sections, any composition order

### Implementation Strategy
- **React components**: JSX-based sub-component system
- **cn utility**: Class merging for default + custom styles
- **No CSS modules**: Inline Tailwind classes only
- **Type-safe**: Full TypeScript definitions

### Pattern Observations
1. **All sections optional**: Can use Card with only CardContent
2. **CardAction is header-specific**: No equivalent footer action component
3. **No prop-based variants**: Unlike most component libraries
4. **Form-centric examples**: Login form showcases primary use case
5. **Multi-button footers**: Flex utilities enable complex footer layouts
6. **No grid support shown**: Cards not shown in grid layouts (though possible)

### Strengths
- Extreme flexibility through composition
- Simple, understandable structure
- Clean separation of semantic sections
- Easy to extend and customize
- Excellent for form containers
- No learning curve for variant systems

### Potential Limitations
- No built-in visual variants (must style manually)
- No elevation/shadow variants
- No interactive states (hover, selected) built-in
- No grid/list layout helpers
- No media integration patterns shown
- CardAction only in header, no footer equivalent

### Comparison to Other Frameworks
- **Material UI Card**: Has variant prop (elevation, outlined), explicit media areas
- **Ant Design Card**: Size variants, loading state, cover images, tabs integration
- **Chakra UI Card**: Variant system (elevated, outline, filled, unstyled)
- **ShadCN**: Most minimal - no variants, pure structural composition

### Semantic UI Integration Considerations

#### Compositional Architecture
- **Sub-component pattern**: CardHeader, CardTitle, etc. provide clear structure
- **Optional sections**: Semantic UI could adopt flexible composition
- **Named sections**: Better than generic "header" prop, shows intent

#### Copy-Paste Philosophy
- **Not compatible**: Semantic UI uses npm packages, not copied code
- **But pattern is**: Sub-component structure works with web components
- **Consider**: Template-based composition vs JSX composition

#### Styling Approach
- **Tailwind-only limitations**: Semantic UI needs framework-agnostic styling
- **className flexibility**: Semantic UI could support similar override pattern
- **Theme tokens**: ShadCN's semantic tokens align with design system thinking

#### Variant Minimalism
- **ShadCN choice**: No variants, full CSS control
- **Semantic UI consideration**: May want some variants (elevated, outlined)
- **Balance**: Offer common variants + full styling control

#### CardAction Component
- **Interesting pattern**: Separate actions from title/description
- **Semantic UI fit**: Aligns with composition-based approach
- **Consider**: Generic "actions" slot vs header-specific component

## Key Takeaways for Semantic UI

### Pattern Alignment
- **Sub-component structure** is universal and semantic - adopt this
- **Optional sections** provide flexibility - all sections should be optional
- **Form container pattern** is primary use case - optimize for this
- **Semantic naming** (Title, Description, Content, Footer) beats generic names

### Pattern Divergence
- **No variants**: Too minimal for Semantic UI's comprehensive approach
- **Tailwind-only**: Incompatible with framework-agnostic goals
- **Copy-paste model**: Doesn't fit npm package distribution
- **React-only**: Semantic UI targets web components

### Potential Adoptions
1. **Sub-component architecture**: Card.Header, Card.Title, Card.Content, Card.Footer
2. **Optional composition**: Every section optional, compose only what's needed
3. **Semantic tokens**: bg-card, text-card-foreground pattern for theming
4. **Form optimization**: Design Card specifically for form containers
5. **Action separation**: Dedicated actions component/slot in header

### Avoid These Patterns
1. **No variants at all**: Provide common variants (elevated, outlined, flat)
2. **Tailwind dependency**: Keep framework-agnostic styling
3. **JSX-only composition**: Use slots/templates for web components
4. **No accessibility**: Add proper ARIA roles and keyboard navigation
5. **Documentation minimalism**: Provide more comprehensive examples

### Innovation Opportunities
1. **Media patterns**: ShadCN doesn't show image/video integration
2. **Interactive states**: Built-in hover, selected, active states
3. **Grid layouts**: Card grids with responsive patterns
4. **Expandable cards**: Accordion-style card expansion
5. **Loading states**: Built-in skeleton/loading patterns
6. **Badge integration**: Status badges, counts in headers

## Conclusion

ShadCN Card represents minimalist structural design - it provides semantic organization without prescriptive styling. This works for their copy-paste, Tailwind-first philosophy but may be too minimal for Semantic UI's comprehensive component approach.

**Adopt**: Sub-component structure, semantic naming, compositional flexibility, form-centric design
**Adapt**: Add variant system, built-in states, media patterns, framework-agnostic styling
**Avoid**: Tailwind dependency, variant minimalism, copy-paste distribution, React-only implementation
