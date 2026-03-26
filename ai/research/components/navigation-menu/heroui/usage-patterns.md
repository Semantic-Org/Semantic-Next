# HeroUI - Navigation Menu Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/navbar
Status: ✅ Working
Version: HeroUI (Current) - Based on React Aria patterns
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-organized documentation with multiple code examples, detailed prop reference, responsive design patterns, accessibility features, and practical use cases. Clear breakdown of individual navbar components and composition patterns.

## Component Definition
- **Core purpose**: Provides a responsive header/navigation bar positioned at the top of the page with support for branding, navigation links, dropdowns, mobile menus, and user actions
- **Mental model**: A horizontal container that adapts from desktop (full navigation visible) to mobile (collapsed menu) layouts. Users think of it as the main navigation hub at the page top
- **Semantic meaning**: Communicates the primary navigation and branding hierarchy of the application, establishing visual identity and providing main entry points to application features

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | `NavbarBrand` component wraps branding content (logo/text) |
| Navigation links | ✅ | Composed | `NavbarItem` + `Link` composition for individual nav items |
| Search integration | ✅ | Composed | `Input` component can be embedded in `NavbarContent` |
| User menu/avatar | ✅ | Composed | `Avatar` component integrated with `Dropdown` for user profiles |
| Action buttons | ✅ | Composed | `Button` component placed in `NavbarContent` for CTAs |
| Dropdown menus | ✅ | Composed | `Dropdown` component nested within navbar items for nested navigation |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal navigation | ✅ | Native | Default orientation; items flow horizontally across the navbar |
| Vertical navigation | ✅ | Composed | Mobile menu via `NavbarMenu`/`NavbarMenuItem` elements stack vertically |
| Nested menus | ✅ | Composed | `Dropdown` component integration enables multi-level navigation |
| Mega menu | ✅ | Composed | Possible via custom `Dropdown` implementation with grid layouts |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Current link | ✅ | Native | `isActive` prop on `NavbarItem` with `aria-current="page"` for accessibility |
| Hover states | ✅ | CSS-only | Built-in hover styling via Tailwind utilities; customizable via `classNames` |
| Disabled links | ✅ | Native | `Link` component supports `isDisabled` prop |
| Mobile menu toggle | ✅ | Composed | `NavbarMenuToggle` component handles menu state; controlled via `isMenuOpen` and `onMenuOpenChange` |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Position options | ✅ | Native | `position` prop: `static` or `sticky` (default: sticky) |
| Width options | ✅ | Native | `maxWidth` prop: sm, md, lg (default), xl, 2xl, full |
| Height customization | ✅ | Native | `height` prop: accepts string or number (default: 4rem/64px) |
| Border styling | ✅ | Native | `isBordered` prop (boolean) to add bottom border |
| Blur effect | ✅ | Native | `isBlurred` prop (boolean, default: true) for backdrop blur effect |
| Hide on scroll | ✅ | Native | `shouldHideOnScroll` prop for auto-hide behavior on scroll |
| Animation control | ✅ | Native | `disableAnimation` prop (boolean) to disable transitions |
| Slot customization | ✅ | Native | `classNames` prop supports: base, wrapper, brand, content, item, toggle, toggleIcon, menu, menuItem |

## Code Examples

### Primary Usage Example - Basic Navbar
```jsx
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";

export default function App() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">Features</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">Integrations</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
```

[View on HeroUI Docs](https://www.heroui.com/docs/components/navbar)

## Notable Features

- **Component-Based Architecture**: Seven-component system (Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem) enables flexible composition
- **Responsive Breakpoints**: Built-in Tailwind responsive utilities (hidden sm:flex, hidden lg:flex) for adaptive layouts
- **Sticky Positioning**: Default sticky positioning with optional hide-on-scroll behavior for improved UX
- **React Aria Integration**: Built on React Aria's accessibility patterns ensuring WCAG compliance
- **Dropdown Integration**: Seamless composition with Dropdown component for nested navigation menus
- **Mobile Menu Support**: Dedicated mobile menu components with toggle state management
- **Avatar Integration**: User profile menu support via Avatar + Dropdown pattern
- **Search Integration**: Input component can be embedded for navbar-based search
- **Multiple Content Zones**: `NavbarContent` with `justify` prop (center, end, between) for layout control
- **Active Link Styling**: `isActive` prop with proper ARIA attributes (aria-current="page") for accessibility
- **Blur Effect**: Optional backdrop blur for modern glassmorphism aesthetic
- **Border Styling**: `isBordered` prop for visual separation from content below
- **Accessible**: Built on React Aria foundation with proper ARIA attributes and semantic HTML
- **Server Component Compatible**: Works with Next.js Server Components for performance
- **Slot-Based Customization**: Fine-grained styling control via named slots and classNames prop
- **Animation Control**: `disableAnimation` prop for accessibility and performance control

## Research Notes

- Documentation is well-structured with clear examples progressing from basic to advanced patterns
- The component system prioritizes composition over a monolithic navbar component, providing flexibility
- Strong emphasis on responsive design with Tailwind utilities for adaptive layouts
- Mobile menu pattern is well-documented with controlled state management examples
- Integration with other HeroUI components (Link, Button, Dropdown, Avatar, Input) is seamless and well-demonstrated
- The `NavbarContent` with `justify` prop provides intuitive layout control
- Accessibility features are built-in via React Aria, reducing custom implementation burden
- Styling approach combines Tailwind CSS utilities with HeroUI's design tokens
- The navbar supports various real-world patterns: user dropdowns, search bars, CTA buttons, and nested menus
- No mention of advanced features like mega menus or complex hierarchical navigation in primary docs
- The `shouldHideOnScroll` feature is useful for mobile-friendly experiences
- Position flexibility (static vs sticky) allows navbar to be part of page flow or float above content
- Component is part of HeroUI's React component library, suggesting React/Next.js as primary target framework
