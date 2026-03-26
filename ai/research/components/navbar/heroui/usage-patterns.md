# HeroUI (NextUI) - Navbar Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://www.heroui.com/docs/components/navbar
Status: ✅ Working
Version: Current (Rebranded from NextUI)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with clear progression from basic to advanced usage, complete API tables with types and defaults, accessibility guidance, and interactive Storybook integration.

## Component Definition
- **Core purpose**: Provides a responsive navigation header positioned at the top of pages that includes support for branding, links, navigation, collapse menus, dropdowns, search, and user profile integration.
- **Mental model**: A composition-based navigation system built from semantic sub-components (Brand, Content, Item, Menu, MenuToggle) that combine to create flexible, mobile-responsive navigation patterns.
- **Semantic meaning**: Represents the primary navigation structure of an application, communicating current location via active states, organizing navigation items by priority (start/center/end positioning), and adapting to screen sizes through responsive collapse patterns.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `position="sticky"`, `shouldHideOnScroll`, `isActive`, `maxWidth="lg"`)
- **Composed**: Via composition/children (e.g., `<NavbarBrand><Logo /></NavbarBrand>`, `<NavbarContent justify="center"><NavbarItem>Features</NavbarItem></NavbarContent>`)
- **CSS-only**: Requires custom styling via `classNames` prop or data attributes (e.g., `[data-active=true]`, custom colors beyond theme)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | `<NavbarBrand>` component for logo + text branding. Typically positioned at start. Example: `<NavbarBrand><AcmeLogo /><p>ACME</p></NavbarBrand>` |
| Navigation links | ✅ | Composed | `<NavbarItem>` within `<NavbarContent>`. Items can be plain links or integrate with routing libraries. Active state via `isActive` prop |
| Actions/Buttons | ✅ | Composed | Common pattern: Login/Sign Up buttons in end-justified `<NavbarContent>`. Can use any button component as children |
| Search input | ✅ | Composed | Search fields placed in `<NavbarContent>`. Documentation shows Input component integration for search functionality |
| User menu/Avatar | ✅ | Composed | Avatar with dropdown menu pattern shown in examples. Integrated with Dropdown component for profile/settings/logout options |
| Dropdown menus | ✅ | Composed | Navigation items can contain Dropdown components for nested navigation (e.g., Features dropdown with sub-options) |
| Custom content | ✅ | Composed | NavbarContent and NavbarItem accept any ReactNode children for flexible composition |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed position | ✅ | Native | `position="static"` - Navbar scrolls with page content (non-sticky) |
| Sticky position | ✅ | Native | `position="sticky"` (default) - Remains visible during scroll |
| Responsive collapse | ✅ | Composed | Mobile menu via `<NavbarMenuToggle>` and `<NavbarMenu>` components. Toggle shows hamburger button on mobile, activates slide-down menu |
| Multi-row layout | ✅ | Composed | Multiple `<NavbarContent>` sections can create multi-row layouts. Common pattern: Brand (left), Links (center), Actions (right) |
| Justification control | ✅ | Native | `<NavbarContent justify="start \| center \| end">` - Controls item positioning within content sections |
| Max width control | ✅ | Native | `maxWidth="sm \| md \| lg \| xl \| 2xl \| full"` (default: "lg") - Constrains navbar width for large screens |
| Height customization | ✅ | Native | `height={string \| number}` (default: "4rem (64px)") - Adjustable navbar height |
| Mobile visibility | ✅ | Composed | `hideIn="desktop"` pattern for mobile-only elements, responsive utility classes for selective display |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Selected | ✅ | Native | `<NavbarItem isActive={true}>` - Marks current page/section. Creates `data-active` attribute for CSS styling |
| Scroll behavior | ✅ | Native | `shouldHideOnScroll={boolean}` (default: false) - Navbar hides when scrolling down, reappears when scrolling up |
| Scroll position tracking | ✅ | Native | `onScrollPositionChange={(position) => void}` - Callback receives scroll position for custom behaviors |
| Collapsible menu state | ✅ | Native | `isMenuOpen={boolean}` + `onMenuOpenChange={(isOpen) => void}` - Controlled mobile menu state |
| Data attributes | ✅ | CSS-only | Rich semantic attributes: `data-active`, `data-open`, `data-pressed`, `data-hover`, `data-focus-visible`, `data-hidden`, `data-menu-open` |
| Hover states | ✅ | CSS-only | Automatic hover effects, accessible via `data-hover` attribute |
| Focus states | ✅ | CSS-only | Focus-visible states for keyboard navigation, accessible via `data-focus-visible` attribute |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Height options | ✅ | Native | `height` prop accepts string or number values. Default: "4rem (64px)" |
| Color themes | ✅ | CSS-only | Supports dark/light modes via theme system. Link colors via color prop: foreground, primary, secondary, danger variants |
| Border variants | ✅ | Native | `isBordered={boolean}` (default: false) - Adds bottom border to navbar |
| Blur effects | ✅ | Native | `isBlurred={boolean}` (default: true) - Toggles background blur effect for modern glass morphism aesthetic |
| Spacing control | ✅ | CSS-only | Gap and padding adjustments via Tailwind classes or `classNames` prop |
| Animation control | ✅ | Native | `disableAnimation={boolean}` (default: false) - Disables motion effects for reduced motion preferences |
| Alignment options | ✅ | Composed | Via `justify` prop on `<NavbarContent>`: start, center, end positioning |

## Code Examples

### Basic Navbar Structure
```jsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@heroui/react";

export default function App() {
  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
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

### Static vs Sticky Positioning
```jsx
// Sticky navbar (default)
<Navbar position="sticky">
  <NavbarContent>...</NavbarContent>
</Navbar>

// Static navbar (scrolls with page)
<Navbar position="static">
  <NavbarContent>...</NavbarContent>
</Navbar>
```

### Hide on Scroll Behavior
```jsx
<Navbar shouldHideOnScroll>
  <NavbarBrand>
    <AcmeLogo />
    <p className="font-bold text-inherit">ACME</p>
  </NavbarBrand>
  <NavbarContent className="hidden sm:flex gap-4" justify="center">
    <NavbarItem>
      <Link color="foreground" href="#">Features</Link>
    </NavbarItem>
  </NavbarContent>
</Navbar>
```

### Mobile Menu Pattern
```jsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link
} from "@heroui/react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">Features</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">Customers</Link>
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

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
```

### With Dropdown Menu
```jsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Link
} from "@heroui/react";

export default function App() {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };

  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                Features
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="autoscaling"
              description="ACME scales apps to meet user demand, automagically."
            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
              key="usage_metrics"
              description="Real-time metrics to debug issues."
            >
              Usage Metrics
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">Integrations</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
```

### With User Menu (Avatar)
```jsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar
} from "@heroui/react";

export default function App() {
  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">Features</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">Integrations</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
```

### With Search
```jsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input
} from "@heroui/react";

export default function App() {
  const searchIcon = (
    <svg>...</svg>
  );

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <AcmeLogo />
          <p className="hidden sm:block font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem>
            <Link color="foreground" href="#">Features</Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page">Customers</Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">Integrations</Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={searchIcon}
          type="search"
        />
      </NavbarContent>
    </Navbar>
  );
}
```

### Border and Blur Variants
```jsx
// With border
<Navbar isBordered>
  <NavbarContent>...</NavbarContent>
</Navbar>

// Without blur effect
<Navbar isBlurred={false}>
  <NavbarContent>...</NavbarContent>
</Navbar>

// Combined
<Navbar isBordered isBlurred>
  <NavbarContent>...</NavbarContent>
</Navbar>
```

### Custom Height and Max Width
```jsx
<Navbar height="5rem" maxWidth="xl">
  <NavbarContent>...</NavbarContent>
</Navbar>

// Full width navbar
<Navbar maxWidth="full">
  <NavbarContent>...</NavbarContent>
</Navbar>
```

### Scroll Position Tracking
```jsx
function App() {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  return (
    <Navbar onScrollPositionChange={setScrollPosition}>
      <NavbarBrand>
        <p>Scroll position: {scrollPosition}px</p>
      </NavbarBrand>
    </Navbar>
  );
}
```

### Custom Styling with classNames
```jsx
<Navbar
  classNames={{
    base: "custom-navbar-base",
    wrapper: "custom-wrapper",
    brand: "custom-brand",
    content: "custom-content",
    item: "custom-item",
    toggle: "custom-toggle",
    menu: "custom-menu",
  }}
>
  <NavbarContent>...</NavbarContent>
</Navbar>
```

### Disable Animations
```jsx
<Navbar disableAnimation>
  <NavbarContent>...</NavbarContent>
</Navbar>
```

## Notable Features

### Composition-Based Architecture
- Built from semantic sub-components (Brand, Content, Item, Menu, MenuToggle, MenuItem)
- Provides flexibility through composition rather than monolithic configuration
- Each component has focused responsibility and clear purpose
- Enables natural nesting and hierarchical structure

### Responsive Design Patterns
- Mobile-first approach with utility classes (`hidden sm:flex`)
- Dedicated mobile menu system separate from desktop navigation
- NavbarMenuToggle automatically shows/hides based on screen size
- Responsive utilities for selective display of login/signup actions

### Rich Data Attributes for Styling
- Comprehensive data attributes: `data-active`, `data-open`, `data-pressed`, `data-hover`, `data-focus-visible`, `data-hidden`, `data-menu-open`
- Enables CSS-based customization without prop drilling
- Supports advanced theming and state-based styling
- Follows web component patterns for semantic HTML attributes

### Hide-on-Scroll Behavior
- `shouldHideOnScroll` provides modern mobile app-like experience
- Navbar disappears when scrolling down to maximize content space
- Reappears when scrolling up for quick access to navigation
- Common pattern in modern content-heavy applications

### Scroll Position Tracking
- `onScrollPositionChange` callback provides real-time scroll position
- Enables custom behaviors based on scroll depth
- Can drive progress indicators, nav style changes, or content loading
- Useful for creating parallax effects or dynamic navigation states

### Blur Effect (Glass Morphism)
- `isBlurred` prop enables modern glass morphism aesthetic
- Creates semi-transparent background with backdrop blur
- Default enabled for contemporary design language
- Can be disabled for solid backgrounds or performance optimization

### Max Width Control
- Constrains navbar width on large screens via `maxWidth` prop
- Preset options: sm, md, lg (default), xl, 2xl, full
- Maintains content readability on ultra-wide displays
- Aligns with responsive container patterns

### Justification System
- `justify` prop on NavbarContent: start, center, end
- Enables flexible multi-section layouts (brand left, links center, actions right)
- Multiple NavbarContent sections can coexist with different justifications
- Simplifies common navigation layout patterns

### Integration with HeroUI Ecosystem
- Seamless integration with Dropdown component for menus
- Works with Avatar component for user profiles
- Input component integration for search functionality
- Button component styling consistency
- Link component with color variants

### Active State Management
- `isActive` prop clearly marks current page/section
- Creates `data-active` attribute for CSS targeting
- Supports `aria-current="page"` for accessibility
- Simple boolean API for route integration

### Portal Support for Mobile Menu
- NavbarMenu uses `portalContainer` prop for rendering location
- Prevents z-index and overflow issues
- Enables full-screen mobile navigation overlays
- Improves accessibility and focus management

### Motion Configuration
- `disableAnimation` prop respects reduced motion preferences
- Supports accessibility requirements (WCAG 2.1 Success Criterion 2.3.3)
- Can be controlled globally or per-component
- Maintains visual consistency when animations disabled

### Slot-Based Customization
- `classNames` prop provides granular style control
- Targets semantic parts: base, wrapper, brand, content, item, toggle, menu
- Avoids CSS specificity battles with scoped customization
- Enables design system integration without forking component

### Parent Reference for Scroll Detection
- `parentRef` prop accepts RefObject for custom scroll containers
- Enables navbar within scrollable regions (not just window)
- Supports complex layouts with nested scroll areas
- Useful for dashboard layouts or split-pane interfaces

## Research Notes

### Access & Documentation
- Documentation successfully accessed at https://www.heroui.com/docs/components/navbar
- Rebranded from NextUI to HeroUI (formerly @nextui-org/react, now @heroui/react)
- Comprehensive documentation with clear structure and progression
- Interactive Storybook integration available for component exploration
- Clear separation of basic, intermediate, and advanced patterns

### Framework Approach Observations

**Composition Over Configuration:**
- Strong emphasis on composition through sub-components
- Avoids prop explosion by delegating to specialized components
- Each component has single, focused responsibility
- Natural hierarchical structure mirrors semantic HTML

**Mobile-First Responsiveness:**
- Dedicated mobile menu system (MenuToggle + Menu + MenuItem)
- Responsive utility classes integrated throughout examples
- Separate code paths for mobile vs desktop patterns
- Progressive disclosure for mobile complexity

**State Management Philosophy:**
- Controlled component pattern for menu state (`isMenuOpen` + `onMenuOpenChange`)
- Declarative state props (`isActive`, `isBlurred`, `isBordered`)
- Data attributes for CSS-based state styling
- Clear separation of state vs presentation

**Integration Strategy:**
- Deep integration with other HeroUI components (Dropdown, Avatar, Input, Link, Button)
- Consistent API patterns across component ecosystem
- Composition enables complex patterns (dropdown menus, user profiles)
- No hard dependencies - components work independently

**Accessibility Considerations:**
- ARIA attributes in examples (`aria-label`, `aria-current`)
- Keyboard navigation support
- Focus-visible states via data attributes
- Reduced motion support through `disableAnimation`

**Styling Approach:**
- Tailwind CSS-first with utility classes
- Data attributes for semantic state styling
- `classNames` slot system for granular customization
- Theme integration for color variants
- Glass morphism aesthetic as default (modern design language)

**Performance Patterns:**
- Animation opt-out via `disableAnimation`
- Blur effect toggle for performance tuning
- Portal rendering for mobile menu (optimizes layout calculations)
- Controlled scroll detection via `parentRef`

**API Design Principles:**
- Boolean props for binary states (`isBordered`, `isBlurred`, `isActive`)
- Callback props for events (`onMenuOpenChange`, `onScrollPositionChange`)
- Preset options for common patterns (`maxWidth`, `position`, `justify`)
- Progressive API complexity (basic props to advanced customization)

**Notable Patterns:**
- Hide-on-scroll behavior (modern mobile app pattern)
- Scroll position tracking for custom behaviors
- Max width constraint on large screens (typography best practice)
- Multi-section layout via multiple NavbarContent components
- Active state via prop (clean integration with routing)

**Potential Challenges:**
- Composition requires understanding component relationships
- Responsive patterns need Tailwind utility class knowledge
- Mobile menu state management adds complexity
- Rich data attributes require CSS selector familiarity

**Strengths:**
- Excellent composition-based architecture
- Strong mobile-responsive patterns
- Comprehensive accessibility support
- Rich customization without prop explosion
- Clear, progressive documentation
- Modern design aesthetic out of box
- Deep ecosystem integration
- Flexible layout patterns via justify system

**Comparison to Other Frameworks:**
- More composition-focused than prop-based (vs Ant Design)
- Stronger mobile menu patterns than most
- Glass morphism aesthetic is distinctive
- Hide-on-scroll is less common feature
- Scroll position tracking provides advanced control
- Slot-based customization similar to other modern frameworks
