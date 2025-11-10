# Chakra UI - Navbar/Header Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://chakra-ui.com/docs/components
Status: ✅ Working (Main documentation)
Version: v3.x (Current - as of 2024/2025)
Last Verified: 2025-11-10

**Note:** Chakra UI does not provide a dedicated Navbar or AppBar component. Instead, they provide flexible layout primitives (Box, Flex, Stack) that compose together to create custom navigation solutions.

## Documentation Quality
Good - Well-documented layout primitives with extensive community examples and tutorials. While there's no official Navbar component documentation, the composition approach is well-supported through layout component docs and numerous community tutorials. Official documentation covers Box, Flex, Drawer, and other building blocks comprehensively.

## Component Definition
- **Core purpose**: Chakra UI provides composable layout primitives for building custom navigation bars and headers. The framework philosophy emphasizes composition over pre-built components, allowing developers to construct navbars from foundational elements like Box, Flex, HStack, VStack, and Drawer.
- **Mental model**: A navbar is a composed structure built from layout primitives, not a single component. Developers combine Box/Flex for containers, HStack/VStack for layout direction, Link/Button for actions, and Drawer for mobile menus. This approach provides maximum flexibility while maintaining consistency through design tokens.
- **Semantic meaning**: Built using semantic HTML via the `as` prop (e.g., `<Flex as="nav">`), communicating "this is the primary navigation area." The composed nature means developers explicitly construct the navigation hierarchy, making semantic structure clear and customizable.

## Pattern Support Levels
- **Native**: Through layout primitive props
- **Composed**: Primary approach for all navbar features
- **CSS-only**: Supported via style props and theme tokens

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo/Brand | ✅ | Composed | Custom Logo component using `Box` or `Flex` wrapper containing `Text`, `Image`, or `Icon`. Accepts responsive color/size props: `<Logo color={["white", "white", "primary.500"]} />` |
| Navigation links | ✅ | Composed | Built with `HStack`/`VStack` containing `Link` components. Use `MenuItem` wrapper for consistent styling. Responsive direction via `direction={["column", "row"]}` |
| Actions/Buttons | ✅ | Composed | Standard `Button` components in navbar context. Common patterns: CTA buttons, user menu triggers, theme toggles. Responsive sizing: `size={{ base: "sm", md: "md" }}` |
| Search | ✅ | Composed | Use Chakra's `Input` or `InputGroup` components within navbar. No dedicated navbar-search component; integrate standard form components |
| User menu | ✅ | Composed | Built with `Menu.Root`, `Menu.Trigger`, `Menu.Content`, `Menu.Item` composition. Supports avatars, dropdown menus, and nested actions |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed position | ✅ | Native | `position="fixed"` prop on container. Requires `w="100%"` and compensating `mt` on page content. Example: `<Flex as="nav" position="fixed" top={0} zIndex={200}>` |
| Sticky position | ✅ | Native | `position="sticky"` prop with `top={0}`. Sticks during scroll without removing from document flow. More common pattern than fixed |
| Responsive collapse | ✅ | Composed | Mobile: Drawer component with hamburger trigger. Desktop: Horizontal HStack. Toggle visibility: `display={{ base: "none", md: "flex" }}` for desktop menu, opposite for mobile trigger |
| Multi-row layout | ✅ | Composed | Use nested `Flex` or `Stack` components with `direction="column"`. Common for navbars with top announcement bars or dual navigation levels |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/Selected | ✅ | Composed | Apply conditional styling to `Link` components. Common pattern: `color={isActive ? 'blue.600' : 'gray.600'}`, `fontWeight={isActive ? 'bold' : 'normal'}`, or `borderBottom` for tab-style indicators |
| Scroll behavior | ✅ | Composed | Implement with React hooks tracking scroll position. Trigger style changes via conditional props: `bg={scrolled ? 'white' : 'transparent'}`, `boxShadow={scrolled ? 'md' : 'none'}` |
| Collapsible | ✅ | Composed | Mobile menu state managed via `useState` or `useDisclosure` hook. Controls Drawer visibility and hamburger icon state. Pattern: `const {isOpen, onOpen, onClose} = useDisclosure()` |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Height options | ✅ | Native | Control via `height`, `py` (vertical padding), or `minH` props on container. Common values: `py={4}` (compact), `py={8}` (standard). Responsive: `py={{ base: 4, md: 6 }}` |
| Color themes | ✅ | Native | Full theme integration via color mode and design tokens. Responsive color arrays: `bg={["primary.500", "primary.500", "transparent", "transparent"]}`. Supports light/dark mode via `useColorMode` hook |
| Alignment | ✅ | Native | Flexbox props: `justify="space-between"` (logo left, links right), `justify="center"` (centered), `align="center"` (vertical centering). Fully responsive per breakpoint |
| Spacing control | ✅ | Native | Comprehensive spacing via `gap`, `padding`, `margin` props with theme tokens. Example: `gap={8}`, `px={4}`, `py={2}`. Accepts responsive arrays or object notation |

## Code Examples

### Basic Composed Navbar
```jsx
import { Flex, Box, HStack, Link, Button } from '@chakra-ui/react';

function Navbar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding={4}
      bg="white"
      boxShadow="sm"
    >
      {/* Logo */}
      <Box fontSize="xl" fontWeight="bold">
        Brand
      </Box>

      {/* Desktop Navigation */}
      <HStack spacing={8} display={{ base: "none", md: "flex" }}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
      </HStack>

      {/* Actions */}
      <Button colorScheme="blue" size="sm">
        Sign In
      </Button>
    </Flex>
  );
}
```

### Responsive Navbar with Mobile Drawer
```jsx
import {
  Flex, Box, HStack, VStack, Link, Button,
  Drawer, Portal, Icon, useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

function ResponsiveNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding={4}
        bg="white"
        boxShadow="sm"
      >
        {/* Logo */}
        <Box fontSize="xl" fontWeight="bold">
          Brand
        </Box>

        {/* Desktop Menu */}
        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </HStack>

        {/* Mobile Menu Trigger */}
        <Box display={{ base: "block", md: "none" }} onClick={onOpen}>
          <Icon as={HamburgerIcon} boxSize={6} />
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Content>
            <Drawer.Header>
              <Flex justify="space-between" align="center">
                <Box fontSize="xl" fontWeight="bold">Menu</Box>
                <Icon as={CloseIcon} onClick={onClose} />
              </Flex>
            </Drawer.Header>
            <Drawer.Body>
              <VStack spacing={4} align="stretch">
                <Link href="/" onClick={onClose}>Home</Link>
                <Link href="/about" onClick={onClose}>About</Link>
                <Link href="/services" onClick={onClose}>Services</Link>
                <Link href="/contact" onClick={onClose}>Contact</Link>
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Portal>
      </Drawer.Root>
    </>
  );
}
```

### Fixed/Sticky Navbar with Scroll Effects
```jsx
import { Flex, HStack, Link, Button, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

function FixedNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Flex
        as="nav"
        position="fixed"
        top={0}
        w="100%"
        align="center"
        justify="space-between"
        padding={scrolled ? 4 : 6}
        bg={scrolled ? 'white' : 'rgba(255, 255, 255, 0.8)'}
        backdropFilter={scrolled ? 'none' : 'saturate(180%) blur(5px)'}
        boxShadow={scrolled ? 'md' : 'none'}
        zIndex={200}
        transition="all 0.3s ease"
      >
        <Box fontSize="xl" fontWeight="bold">Brand</Box>

        <HStack spacing={8}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </HStack>

        <Button colorScheme="blue" size="sm">Get Started</Button>
      </Flex>

      {/* Add margin to prevent content overlap */}
      <Box mt="80px">
        {/* Page content */}
      </Box>
    </>
  );
}
```

### Advanced Navbar with User Menu
```jsx
import {
  Flex, HStack, Link, Avatar, Menu, MenuItem,
  MenuList, MenuButton, Box
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function NavbarWithUserMenu() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding={4}
      bg="white"
      boxShadow="sm"
    >
      <Box fontSize="xl" fontWeight="bold">Brand</Box>

      <HStack spacing={8}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>

        {/* User Menu */}
        <Menu>
          <MenuButton>
            <HStack spacing={2}>
              <Avatar size="sm" name="User Name" />
              <ChevronDownIcon />
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Dashboard</MenuItem>
            <MenuItem color="red.500">Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}
```

### Responsive Multi-Row Navbar
```jsx
import { Flex, VStack, HStack, Box, Link, Button, Text } from '@chakra-ui/react';

function MultiRowNavbar() {
  return (
    <VStack spacing={0} w="100%">
      {/* Top announcement bar */}
      <Flex
        w="100%"
        bg="blue.600"
        color="white"
        py={2}
        px={4}
        justify="center"
      >
        <Text fontSize="sm">🎉 Special offer: 50% off this week only!</Text>
      </Flex>

      {/* Main navbar */}
      <Flex
        w="100%"
        as="nav"
        align="center"
        justify="space-between"
        padding={4}
        bg="white"
        boxShadow="sm"
      >
        <Box fontSize="xl" fontWeight="bold">Brand</Box>

        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </HStack>

        <HStack spacing={4}>
          <Button variant="ghost" size="sm">Sign In</Button>
          <Button colorScheme="blue" size="sm">Sign Up</Button>
        </HStack>
      </Flex>
    </VStack>
  );
}
```

## Notable Features

### Composition-First Philosophy
Unlike frameworks with dedicated navbar components, Chakra UI embraces a composition-first approach. This design philosophy provides:
- **Maximum flexibility**: Build exactly the navbar structure needed without component limitations
- **Consistent API**: Same props system across all layout primitives (spacing, colors, responsive)
- **Learning curve advantage**: Master Box/Flex patterns once, apply everywhere
- **No abstraction penalty**: Direct access to flexbox and CSS properties through intuitive props

### Comprehensive Responsive System
Chakra UI's responsive props are exceptional for navbar construction:
- **Multiple syntaxes**: Array notation `[base, md, lg]` or object notation `{{ base: "value", md: "value" }}`
- **Breakpoint system**: `base` (0), `sm` (480px), `md` (768px), `lg` (992px), `xl` (1280px), `2xl` (1536px)
- **Prop-level responsiveness**: Every style prop accepts responsive values
- **Display utilities**: Built-in patterns like `display={{ base: "none", md: "block" }}` for showing/hiding elements

### Style Props System
Direct CSS property access via props eliminates separate stylesheet files:
- **Spacing**: `p`, `px`, `py`, `m`, `mx`, `my`, `gap` with theme-consistent values
- **Layout**: `display`, `position`, `width`, `height`, `overflow`, `zIndex`
- **Flexbox**: `direction`, `wrap`, `align`, `justify`, `basis`, `grow`, `shrink`
- **Visual**: `bg`, `color`, `border`, `borderRadius`, `boxShadow`, `opacity`
- **Typography**: `fontSize`, `fontWeight`, `lineHeight`, `textAlign`, `textDecor`
- **Transitions**: `transition`, animation support for smooth state changes

### Design Token Integration
All style props accept theme tokens for consistency:
```jsx
<Box
  bg="gray.50"           // Theme color token
  color="gray.800"       // Theme color token
  px={4}                 // Theme spacing token (1rem)
  py={2}                 // Theme spacing token (0.5rem)
  fontSize="lg"          // Theme typography token
  borderRadius="md"      // Theme radius token
  boxShadow="sm"         // Theme shadow token
/>
```

### Drawer Component for Mobile Navigation
Chakra's Drawer provides sophisticated mobile menu functionality:
- **Placement options**: `start`, `end`, `top`, `bottom` with RTL support
- **State management**: `useDisclosure` hook provides `isOpen`, `onOpen`, `onClose` utilities
- **Composition structure**: `Drawer.Root`, `Drawer.Backdrop`, `Drawer.Content`, `Drawer.Header`, `Drawer.Body`, `Drawer.Footer`
- **Accessibility**: Built-in focus management, keyboard navigation (ESC to close), ARIA attributes
- **Customization**: Size variants, backdrop controls, close-on-overlay-click, animation configuration

### useDisclosure Hook
Specialized state management hook for toggleable UI:
```javascript
const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
```
- **Common pattern**: Provides standard API for modals, drawers, menus, disclosure panels
- **No external state library**: Built-in solution eliminates dependencies
- **Cleanup handling**: Automatic cleanup prevents memory leaks

### Semantic HTML Support
All layout components support the `as` prop for semantic markup:
```jsx
<Flex as="nav">          // Renders <nav> element
<Box as="header">        // Renders <header> element
<HStack as="ul">         // Renders <ul> element
<Box as="li">            // Renders <li> element
```
This maintains accessibility and SEO benefits while using Chakra's component API.

### Fixed/Sticky Positioning Patterns
Common patterns for persistent navigation:
- **Fixed**: `position="fixed"` with `top={0}`, `w="100%"`, `zIndex={200}` - requires margin compensation on content
- **Sticky**: `position="sticky"` with `top={0}` - more common, no layout compensation needed
- **Backdrop effects**: `backdropFilter="saturate(180%) blur(5px)"` for translucent modern look
- **Shadow on scroll**: Conditional `boxShadow` based on scroll position creates depth

### Active Link Styling
No built-in active state; developers implement using routing libraries:
```jsx
// With React Router
import { NavLink } from 'react-router-dom';

<Link
  as={NavLink}
  to="/about"
  _activeLink={{ color: 'blue.600', fontWeight: 'bold' }}
>
  About
</Link>

// Manual implementation
<Link
  color={isActive ? 'blue.600' : 'gray.600'}
  fontWeight={isActive ? 'bold' : 'normal'}
  borderBottom={isActive ? '2px solid' : 'none'}
  borderColor="blue.600"
>
  About
</Link>
```

### Color Mode Integration
Built-in dark mode support via `useColorMode` hook:
```jsx
import { useColorMode } from '@chakra-ui/react';

function Navbar() {
  const { colorMode } = useColorMode();

  return (
    <Flex
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      color={colorMode === 'light' ? 'gray.800' : 'white'}
    >
      {/* navbar content */}
    </Flex>
  );
}
```

## Research Notes

### Documentation Structure
- **Primary source**: https://chakra-ui.com/docs/components official component documentation
- **Layout components**: Box, Flex, Stack, HStack, VStack comprehensively documented
- **Navigation components**: Breadcrumb, Link, Menu documented separately
- **Community resources**: Extensive tutorials on DEV.to, personal blogs, GitHub examples
- **Version**: Documentation covers v3.x with migration guides from v2.x

### No Dedicated Navbar Component - Why?
Chakra UI's philosophy prioritizes composition over pre-built complex components:
1. **Flexibility**: Every project has unique navbar requirements (layout, content, behavior)
2. **Learning**: Understanding layout primitives benefits the entire framework usage
3. **Maintenance**: Fewer large components means less API surface and breaking changes
4. **Customization**: Composition eliminates "fighting the component" anti-pattern
5. **Bundle size**: Import only the primitives needed rather than monolithic navbar component

This approach differs from Material-UI (AppBar), Ant Design (Layout.Header), or HeroUI (Navbar) which provide dedicated components.

### Common Composition Patterns
Research reveals consistent patterns across community implementations:

**Component structure:**
```
NavBarContainer (Flex as="nav")
├── Logo (Box/Text)
├── MenuLinks (HStack/VStack)
│   └── MenuItem (Link) × N
├── MenuToggle (Box/IconButton) - mobile only
└── Actions (HStack)
    └── Button × N

MobileDrawer (separate)
├── Drawer.Header
└── Drawer.Body
    └── MenuLinks (VStack variant)
```

**State management:**
- `useState` for simple toggle state
- `useDisclosure` for drawer management
- Custom hooks for scroll detection
- Router integration for active states

**Responsive strategy:**
- Mobile-first design with breakpoint objects
- Desktop menu: `display={{ base: "none", md: "flex" }}`
- Mobile trigger: `display={{ base: "block", md: "none" }}`
- Drawer for mobile, HStack for desktop

### Implementation Observations
- **TypeScript support**: Excellent type definitions for all props and components
- **Performance**: No virtualization needed; navbar typically has few elements
- **Animation**: CSS transitions via `transition` prop; Framer Motion for complex animations
- **Testing**: Standard React testing patterns; Chakra provides test utilities
- **Accessibility**: ARIA attributes automatic when using semantic `as` props

### Framework Evolution
- **v2 to v3**: Major architecture overhaul with improved TypeScript, composition patterns
- **Drawer changes**: New composition API replacing older single-component approach
- **Menu system**: Enhanced with better state management and customization
- **Responsive props**: Expanded breakpoint system and more intuitive syntax

### Unique Strengths
1. **Style props system**: Eliminates CSS files, provides type-safe styling API
2. **Theme integration**: Design tokens accessible throughout component tree
3. **Responsive flexibility**: Prop-level responsive values more granular than CSS media queries
4. **Composition power**: Build any navbar structure without component constraints
5. **Developer experience**: Excellent TypeScript support, clear documentation, active community
6. **Dark mode**: Built-in color mode with seamless switching
7. **Accessibility**: Semantic HTML support, ARIA attributes, keyboard navigation
8. **Learning curve**: Once layout primitives mastered, applies to entire framework

### Potential Challenges
1. **No quickstart**: Must compose navbar from scratch rather than import single component
2. **Boilerplate**: More code required compared to dedicated navbar components
3. **Pattern discovery**: Developers must learn common patterns through examples
4. **State management**: Must implement active states, scroll effects manually
5. **Mobile menu**: Drawer setup more involved than some framework's hamburger menus

### Comparison to Other Frameworks
- **vs Material-UI AppBar**: Chakra requires composition but offers more flexibility
- **vs Ant Design Layout.Header**: Chakra has steeper initial learning but less "fighting the component"
- **vs HeroUI Navbar**: Chakra needs more setup but provides unlimited customization
- **vs Mantine AppShell**: Similar philosophy but Chakra's style props more comprehensive
- **vs Radix UI**: Chakra provides styling layer; Radix focuses only on behavior primitives

### Community Ecosystem
- **Tutorials**: Extensive blog posts, DEV.to articles, YouTube videos for navbar patterns
- **GitHub examples**: Multiple open-source navbar implementations for reference
- **Templates**: Some third-party template libraries include pre-built navbar compositions
- **Stack Overflow**: Active community for troubleshooting and pattern recommendations

### Best Practice Recommendations
Based on research across multiple sources:
1. **Separate components**: Logo, MenuLinks, MenuToggle as distinct components for reusability
2. **useDisclosure for drawers**: Standard pattern for mobile menu state management
3. **Responsive arrays**: Prefer object notation `{{ base, md }}` for clarity over arrays
4. **Semantic HTML**: Always use `as="nav"` on container for accessibility
5. **Fixed positioning**: Use sticky over fixed when possible to avoid layout compensation
6. **Z-index values**: 100-200 range for navbars; 1000+ for modals/drawers
7. **Backdrop blur**: `backdropFilter` creates modern translucent effect on scroll
8. **Theme colors**: Use theme tokens rather than hardcoded colors for consistency
9. **Active states**: Implement with router integration rather than manual tracking
10. **Mobile-first**: Design mobile layout first, then enhance for desktop breakpoints
