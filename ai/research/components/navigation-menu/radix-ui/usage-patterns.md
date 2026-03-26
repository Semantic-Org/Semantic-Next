# Radix UI - Navigation Menu Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/primitives/docs/components/navigation-menu
Status: ✅ Working
Version: 1.2.14 (npm package version)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The official Radix UI documentation provides detailed component structure, examples, props, and integration patterns. The component is well-established in the ecosystem with active community examples and discussions.

## Component Definition
- **Core purpose**: A collection of links for navigating websites. Provides accessible navigation menu component with support for dropdowns, submenus, and complex hierarchical structures while maintaining full keyboard accessibility.
- **Mental model**: Users think of this as a structured navigation bar component that can contain both static links and dynamic dropdowns. It supports trigger-based content revelation similar to dropdown menus but with a navigation-specific focus.
- **Semantic meaning**: Communicates website structure and primary navigation paths. It's a landmark element (nav) that helps users understand site organization and provides quick access to major sections.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | Can be placed within NavigationMenu.Item or before NavigationMenu.List |
| Navigation links | ✅ | Native | NavigationMenu.Link component provides native support with active state detection |
| Search integration | ✅ | Composed | Can be added as a custom component within the navigation structure |
| User menu/avatar | ✅ | Composed | Can be composed using NavigationMenu.Item with NavigationMenu.Trigger and NavigationMenu.Content |
| Action buttons | ✅ | Composed | Buttons can be placed alongside or within navigation items |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal navigation | ✅ | Native | Default orientation; managed via NavigationMenu.Root |
| Vertical navigation | ✅ | Native | Set via `orientation="vertical"` prop on NavigationMenu.Root |
| Nested menus | ✅ | Native | Use NavigationMenu.Sub component for nested structures; works like Tabs with required defaultValue |
| Mega menu | ✅ | Composed | NavigationMenu.Viewport can position large content areas outside the list DOM |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Current link | ✅ | Native | NavigationMenu.Link provides `active` prop for aria-current and active styling; supports controlled/uncontrolled via activeValue/defaultValue |
| Hover states | ✅ | Native | Default interaction model uses pointer enter to open content; controlled via root props |
| Disabled links | ✅ | CSS-only | Applied via standard link/button disabled attributes and custom CSS |
| Mobile menu toggle | ✅ | Composed | Requires custom toggle implementation; typically hide navigation on mobile and show toggle button |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Position options | ✅ | Composed | Content positioning handled via NavigationMenu.Viewport and CSS (floated, absolute, or custom positioning) |
| Width options | ✅ | CSS-only | Applied via className props on NavigationMenu.Root and NavigationMenu.List |
| Background styles | ✅ | CSS-only | Full styling control through className and inline styles on any component |
| Border options | ✅ | CSS-only | Borders applied via CSS on root, list, or individual items |

## Code Examples

### Basic Horizontal Navigation with Dropdown
```jsx
import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/products/product-1">
              Product 1
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/products/product-2">
              Product 2
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/about">
            About
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/contact">
            Contact
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator />
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
};

export default NavigationMenuDemo;
```

### Vertical Navigation with Submenus
```jsx
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const VerticalNavigationDemo = () => {
  return (
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Services</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/services/consulting">
              Consulting
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/services/development">
              Development
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing">
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
};
```

### Nested Submenu Structure
```jsx
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const NestedMenuDemo = () => {
  return (
    <NavigationMenu.Root value={activeMenu} onValueChange={setActiveMenu}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Sub defaultValue="software">
              <NavigationMenu.List>
                <NavigationMenu.Item value="software">
                  <NavigationMenu.Trigger>Software</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <NavigationMenu.Link href="/software/tools">
                      Tools
                    </NavigationMenu.Link>
                    <NavigationMenu.Link href="/software/frameworks">
                      Frameworks
                    </NavigationMenu.Link>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Sub>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
};
```

### Custom Routing Integration (Next.js)
```jsx
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

const CustomLinkComponent = React.forwardRef(
  ({ href, children, ...props }, ref) => (
    <NavigationMenu.Link asChild>
      <Link href={href}>
        <a ref={ref} {...props}>
          {children}
        </a>
      </Link>
    </NavigationMenu.Link>
  )
);

const NavigationWithNextRouter = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <CustomLinkComponent href="/about">
            About Us
          </CustomLinkComponent>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
};
```

## Root Component Props
- **value**: Controlled active menu item value
- **defaultValue**: Default active menu item (uncontrolled)
- **onValueChange**: Callback when active item changes
- **orientation**: "horizontal" (default) or "vertical"
- **delayDuration**: Milliseconds before opening menu on pointer enter (default: 500)
- **skipDelayDuration**: Milliseconds for skip delay duration (default: 300)

## Notable Features
- **Flexible Layout Structure**: NavigationMenu.Viewport allows content to be positioned anywhere in the DOM, enabling mega menu layouts
- **Managed Tab Focus**: Automatic keyboard navigation with managed focus states
- **Optional Indicator**: NavigationMenu.Indicator component highlights the currently active trigger with an animated underline or custom indicator
- **Submenu Support**: NavigationMenu.Sub for nested structures; functions like Tabs with required defaultValue
- **Active State Indicator**: NavigationMenu.Link provides built-in active prop for setting aria-current and styling current page
- **Composition Pattern**: Supports composition with framework routing (Next.js Link, React Router, etc.) via asChild prop
- **Full Keyboard Navigation**: Arrow keys, Tab, Enter/Space for full accessibility
- **Pointer and Keyboard Events**: Handles both pointer (hover) and keyboard interactions intelligently
- **Automatic Collision Detection**: Content positioning respects viewport boundaries (when using proper positioner components)

## Research Notes
- Component is well-established (version 1.2.14 on npm as @radix-ui/react-navigation-menu)
- Official documentation is comprehensive and regularly maintained
- Community has created many framework-specific integrations (shadcn/ui, Base UI, Radix Vue, etc.)
- Important consideration: NavigationMenu.Link must be used for all navigation links to maintain keyboard control and accessibility
- For custom routing integration, use the `asChild` prop with Radix primitives' composition pattern to wrap framework routing links
- The orientation prop is supported but reported issues in some use cases with vertical orientation not applying expected layout changes
- Submenus work differently from root menus and require explicit defaultValue assignment similar to Tabs behavior
- Component is focused on navigation patterns specifically, not general dropdown menus (use Dropdown Menu primitive for non-navigation dropdowns)
