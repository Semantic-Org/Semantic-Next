# ShadCN - Navigation Menu Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/navigation-menu
Status: ✅ Working
Version: Current (Radix UI based)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear structure with code examples and installation instructions. Documentation is well-organized with component APIs documented and usage patterns demonstrated.

## Component Definition
- **Core purpose**: Provides an accessible, keyboard-navigable collection of links for website navigation. Built on Radix UI primitives, it enables hierarchical menu structures with dropdown content and supports responsive design patterns.
- **Mental model**: Users think of it as a dropdown navigation system where menu items can trigger panels of related links or content. The component handles complex accessibility requirements (keyboard navigation, ARIA attributes) automatically.
- **Semantic meaning**: Communicates the site's information hierarchy and navigation structure. Signals to users which sections contain related content or subnavigation options.

## Pattern Support Levels
- **Native**: Dedicated prop/API (component composition-based)
- **Composed**: Via composition/children (primary approach)
- **CSS-only**: Requires custom styling with Tailwind utilities

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | Can be placed in NavigationMenuContent with images/logos |
| Navigation links | ✅ | Native | NavigationMenuLink component with full control |
| Search integration | ✅ | Composed | Can be embedded within NavigationMenuContent using composition |
| User menu/avatar | ✅ | Composed | Can be added to menu structure using nested items |
| Action buttons | ✅ | Composed | Buttons can be nested within NavigationMenuContent |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal navigation | ✅ | Native | Default behavior with flex layout, menu items display horizontally |
| Vertical navigation | ✅ | Composed | Can be styled with flex-col and custom Tailwind classes |
| Nested menus | ✅ | Native | NavigationMenuTrigger with NavigationMenuContent creates dropdown structure |
| Mega menu | ✅ | Native | GridLayout in content areas with `md:grid-cols-2` and responsive behavior |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Current link | ✅ | CSS-only | Uses highlight styling (typically darker/underlined appearance) for current page |
| Hover states | ✅ | Native | Radix UI primitives handle hover activation; styled with Tailwind |
| Disabled links | ✅ | Composed | Can be implemented through NavigationMenuLink with disabled attribute |
| Mobile menu toggle | ✅ | Composed | Requires manual implementation using `hidden md:block` utilities for responsive behavior |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Position options | ✅ | CSS-only | Positioned using Tailwind positioning utilities (absolute, relative, fixed) |
| Width options | ✅ | CSS-only | Full-width or contained using Tailwind width classes (w-full, w-screen, w-auto) |
| Background styles | ✅ | CSS-only | Styled with Tailwind background utilities (bg-white, bg-slate-50, etc.) |
| Border options | ✅ | CSS-only | Border styling via Tailwind border utilities with shadow effects |

## Code Examples

### Basic Usage
```jsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

### Link as Trigger Pattern
```jsx
<NavigationMenuItem>
  <NavigationMenuLink asChild>
    <Link href="/docs">Documentation</Link>
  </NavigationMenuLink>
</NavigationMenuItem>
```

### Grid-Based Mega Menu
```jsx
<NavigationMenuContent>
  <div className="grid gap-3 p-4 md:grid-cols-2 w-[400px] lg:w-[500px]">
    {/* Grid items */}
    <NavigationMenuLink>List Item 1</NavigationMenuLink>
    <NavigationMenuLink>List Item 2</NavigationMenuLink>
  </div>
</NavigationMenuContent>
```

### Responsive Navigation with Viewport
```jsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Components</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {/* Items */}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Notable Features

- **Accessibility First**: Built on Radix UI's NavigationMenu primitive with full keyboard navigation support (arrow keys, Enter, Escape)
- **`asChild` Prop**: Allows components like Next.js `Link` to inherit trigger styling without additional wrappers
- **`navigationMenuTriggerStyle()` Utility**: Provides consistent styling for custom components acting as triggers
- **Responsive Viewport**: Content automatically adjusts viewport positioning for mobile and desktop
- **Grid-Based Layouts**: Content areas support CSS Grid for flexible, responsive link arrangements
- **Composition-Based Architecture**: All variations built through component composition rather than prop-driven variations
- **Shadow and Border Styling**: Default styling includes subtle shadows and borders for visual depth

## Implementation Highlights

### Key Components
1. **NavigationMenu** - Top-level wrapper that manages state and keyboard interactions
2. **NavigationMenuList** - Container for NavigationMenuItems
3. **NavigationMenuItem** - Individual menu item with optional trigger/content
4. **NavigationMenuTrigger** - Clickable element that shows/hides content (similar to dropdown trigger)
5. **NavigationMenuContent** - Container for dropdown content, positioned and styled by Radix UI
6. **NavigationMenuLink** - Semantic link element within the menu structure

### Styling Strategy
- Uses Tailwind CSS exclusively for styling
- Default color scheme: slate-based with white backgrounds
- Responsive breakpoints: `hidden md:block` for responsive behavior
- Grid support: `grid-cols-2`, `grid-cols-3`, etc. for content organization
- Spacing: Consistent padding with `p-4`, `gap-3` patterns

## Research Notes

- The component is production-ready with excellent Radix UI integration
- Documentation includes clear examples with installation via `pnpm dlx shadcn@latest add navigation-menu`
- The component handles complex accessibility requirements automatically (ARIA attributes, keyboard navigation)
- Mobile responsiveness requires manual implementation through Tailwind utilities (hidden/visible classes)
- The framework's approach aligns with modern React component patterns using composition over configuration
- No specific version number visible; uses "Current" versioning, indicating it tracks the latest Radix UI updates

## Comparison to Navigation Menu Patterns

The ShadCN Navigation Menu demonstrates several key patterns relevant to Semantic UI's navigation menu component:

1. **Composition-First Architecture**: Like Semantic UI's philosophy, uses component composition rather than prop-driven APIs
2. **Accessibility As Foundation**: Built on accessible primitives (Radix UI) similar to Semantic UI's web standards approach
3. **Responsive Design Pattern**: Mobile adaptation through CSS classes rather than JavaScript-driven breakpoints
4. **Content Flexibility**: Supports arbitrary content (links, text, buttons) within menu items through composition slots
