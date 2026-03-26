# ShadCN - Navigation Menu Component

## Component Overview

The Navigation Menu component in ShadCN is described as "a collection of links for navigating websites." It's a sophisticated navigation pattern built on Radix UI primitives and styled with Tailwind CSS. The component provides accessible navigation with dropdown menus, grid-based layouts, and responsive behavior. It's designed for top-level website navigation with support for complex nested content structures, featuring sections, icons, and multi-column layouts.

**Component URL**: https://ui.shadcn.com/docs/components/navigation-menu
**Status**: Working (verified 2025-11-10)

---

## Documentation Quality

**Rating**: High

**Strengths**:
- Clear installation instructions with CLI command
- Complete import statements
- Visual examples with interactive demo
- Code examples showing different patterns
- Integration guidance for Next.js Link component
- Responsive design patterns documented
- Accessibility built-in through Radix UI

**Coverage**:
- Basic usage patterns
- External link integration
- Grid-based content layouts
- Icon support
- Responsive behavior
- Accessibility features

---

## Component Definition

### Installation

```bash
pnpm dlx shadcn@latest add navigation-menu
```

### Import Statement

```typescript
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
```

### Component Parts

The Navigation Menu uses a composable architecture with distinct sub-components:

- **NavigationMenu**: Root container that manages overall state
- **NavigationMenuList**: Container for menu items (horizontal list)
- **NavigationMenuItem**: Individual menu item wrapper
- **NavigationMenuTrigger**: Clickable trigger element for dropdowns
- **NavigationMenuContent**: Dropdown content area (hidden until triggered)
- **NavigationMenuLink**: Link elements within content or as direct menu items
- **NavigationMenuViewport**: Viewport container for content rendering
- **NavigationMenuIndicator**: Visual indicator (typically an arrow/chevron)

### Basic Structure

```tsx
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
```

---

## Content Patterns

### Logo/Brand

**Pattern**: Not explicitly shown in documentation
**Usage**: Navigation Menu focuses on navigation links rather than branding
**Note**: Typically used alongside a separate logo component in app bar/header context

### Navigation Links

#### Simple Links (No Dropdown)

```tsx
<NavigationMenuItem>
  <NavigationMenuLink asChild>
    <Link href="/docs">Documentation</Link>
  </NavigationMenuLink>
</NavigationMenuItem>
```

**Features**:
- Uses `asChild` prop to render as Next.js Link
- Direct navigation without dropdown
- Clean, minimal pattern for top-level pages

#### Dropdown Links with Content

```tsx
<NavigationMenuItem>
  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
  <NavigationMenuContent>
    <NavigationMenuLink>Link</NavigationMenuLink>
  </NavigationMenuContent>
</NavigationMenuItem>
```

**Features**:
- Trigger opens dropdown content
- Content can contain multiple links
- Supports complex nested structures

### Actions/Buttons

**Pattern**: Not a primary feature
**Note**: Navigation Menu is focused on navigation, not action buttons. Actions would typically be separate components in a header.

### Search

**Pattern**: Not included in Navigation Menu component
**Note**: Search would be a separate component integrated into the header/navbar

### User Menu

**Pattern**: Not included in Navigation Menu component
**Note**: User profile/menu would typically use a separate Dropdown Menu component

---

## Layout Patterns

### Fixed Position

**Pattern**: Not handled by component itself
**Implementation**: Would be applied to parent container
**Note**: Navigation Menu provides the menu structure, positioning is handled by wrapper

### Sticky Position

**Pattern**: Not handled by component itself
**Implementation**: Would be applied to parent container
**Note**: Component focuses on navigation logic, not positioning

### Responsive Collapse

**Pattern**: Supported through viewport and conditional rendering

```tsx
{/* Hidden on mobile, shown on desktop */}
<NavigationMenuItem className="hidden md:block">
  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
  <NavigationMenuContent>
    {/* Complex content */}
  </NavigationMenuContent>
</NavigationMenuItem>
```

**Features**:
- Uses Tailwind responsive classes (`hidden md:block`)
- Mobile detection hook mentioned (`useIsMobile`)
- Progressive enhancement approach
- Simple links shown on mobile, complex dropdowns on desktop

### Multi-row Layout

**Pattern**: Supported through flex-wrap

```tsx
<NavigationMenuList className="flex-wrap">
  {/* Items can wrap to multiple rows */}
</NavigationMenuList>
```

**Features**:
- `flex-wrap` allows items to wrap
- Useful for responsive designs with many items

### Horizontal Navigation (Primary Pattern)

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>Item 1</NavigationMenuItem>
    <NavigationMenuItem>Item 2</NavigationMenuItem>
    <NavigationMenuItem>Item 3</NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

**Features**:
- Default horizontal layout
- Flex-based positioning
- Items displayed in a row

### Grid-based Dropdown Content

```tsx
<NavigationMenuContent>
  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
    {/* Grid items */}
  </ul>
</NavigationMenuContent>
```

**Features**:
- Responsive grid layouts
- Multi-column content organization
- Customizable column proportions
- Gap spacing control
- Viewport-specific widths

---

## State Patterns

### Active/Selected

**Pattern**: Built-in through Radix UI
**Implementation**: Automatically handled by component
**Note**: Active state styling available through Tailwind classes

### Hover Behavior

**Pattern**: Supported through CSS/Tailwind
**Implementation**: Hover states applied to links and triggers
**Features**:
- Trigger hover opens dropdown (automatic)
- Link hover styling customizable
- Smooth transitions

### Focus State

**Pattern**: Accessibility-focused
**Features**:
- Keyboard navigation support (built into Radix UI)
- Focus indicators automatically applied
- Tab navigation between items
- Arrow key navigation in dropdowns

### Expanded/Collapsed

**Pattern**: Automatic state management
**Features**:
- NavigationMenuTrigger controls expansion
- NavigationMenuContent visibility managed automatically
- Visual indicator (arrow/chevron) rotates on state change
- Smooth transitions between states

---

## Variation Patterns

### Height Options

**Pattern**: Not explicitly provided
**Implementation**: Would use CSS/Tailwind classes on container
**Note**: Component height is content-driven

### Color Themes

**Pattern**: Tailwind-based customization
**Implementation**: Apply Tailwind classes to sub-components
**Features**:
- Dark/light mode support through Tailwind
- Customizable via className prop
- Background, text, border colors all configurable

### Alignment

**Pattern**: Flex-based alignment
**Features**:
- Horizontal alignment (left, center, right) via flex utilities
- Content alignment within dropdowns
- Grid alignment within dropdown content

### Spacing Control

**Pattern**: Tailwind utilities
**Features**:
- Gap between items
- Padding within dropdowns
- Margin around component
- Grid gap in content layouts

---

## Code Examples from Docs

### Example 1: Basic Navigation Menu

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

function BasicNavigation() {
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

### Example 2: With External Links (Next.js)

```tsx
<NavigationMenuItem>
  <NavigationMenuLink asChild>
    <Link href="/docs">Documentation</Link>
  </NavigationMenuLink>
</NavigationMenuItem>
```

**Key Feature**: The `asChild` prop allows the NavigationMenuLink to render as a Next.js Link component while preserving navigation menu behavior.

### Example 3: Grid-based Dropdown Content

```tsx
<NavigationMenuItem>
  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
  <NavigationMenuContent>
    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
      <li className="row-span-3">
        <NavigationMenuLink asChild>
          <a href="/" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <div className="mb-2 mt-4 text-lg font-medium">
              Featured Section
            </div>
            <p className="text-sm leading-tight text-muted-foreground">
              Description text here
            </p>
          </a>
        </NavigationMenuLink>
      </li>
      <li>
        <NavigationMenuLink asChild>
          <a href="/docs/primitives/alert-dialog">
            Alert Dialog
          </a>
        </NavigationMenuLink>
      </li>
      <li>
        <NavigationMenuLink asChild>
          <a href="/docs/primitives/hover-card">
            Hover Card
          </a>
        </NavigationMenuLink>
      </li>
      <li>
        <NavigationMenuLink asChild>
          <a href="/docs/primitives/progress">
            Progress
          </a>
        </NavigationMenuLink>
      </li>
    </ul>
  </NavigationMenuContent>
</NavigationMenuItem>
```

**Key Features**:
- Responsive grid with different widths per viewport
- Custom column sizing using fractional units
- Row spanning for featured content
- Rich content with gradients and custom styling

### Example 4: Icon-augmented Links

```tsx
<NavigationMenuLink asChild>
  <Link href="#" className="flex-row items-center gap-2">
    <CircleCheckIcon />
    Done
  </Link>
</NavigationMenuLink>
```

**Key Feature**: Icons can be integrated alongside link text using flex layouts.

### Example 5: Responsive Navigation

```tsx
<NavigationMenu>
  <NavigationMenuList>
    {/* Always visible */}
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href="/">Home</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>

    {/* Hidden on mobile */}
    <NavigationMenuItem className="hidden md:block">
      <NavigationMenuTrigger>Components</NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* Complex dropdown content */}
      </NavigationMenuContent>
    </NavigationMenuItem>

    {/* Simple link visible on all devices */}
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href="/docs">Documentation</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

**Key Features**:
- Progressive enhancement approach
- Simple links on mobile
- Complex dropdowns on desktop
- Uses Tailwind responsive utilities

---

## Notable Features

### 1. Radix UI Foundation
Built on Radix UI primitives, ensuring:
- Comprehensive accessibility
- Keyboard navigation
- Screen reader support
- ARIA attributes automatically applied
- Focus management

### 2. asChild Pattern
Allows composition with other components (e.g., Next.js Link) while preserving navigation menu behavior:
```tsx
<NavigationMenuLink asChild>
  <Link href="/docs">Documentation</Link>
</NavigationMenuLink>
```

### 3. Flexible Content Layouts
Supports multiple dropdown content patterns:
- Simple link lists
- Grid-based multi-column layouts
- Featured sections with row spanning
- Rich content with icons, images, descriptions
- Responsive viewport sizing

### 4. Viewport System
NavigationMenuViewport provides:
- Controlled rendering area for dropdown content
- Smooth transitions between different content sizes
- Responsive width adjustments

### 5. Visual Indicator
NavigationMenuIndicator provides:
- Visual feedback for active triggers
- Typically rendered as chevron/arrow
- Animated state changes

### 6. Mobile-First Responsive Design
- Uses `useIsMobile` hook for device detection
- Progressive enhancement pattern
- Tailwind responsive utilities for conditional rendering
- Simple on mobile, complex on desktop

### 7. Integration Patterns
- Works seamlessly with Next.js routing
- Icon library integration (lucide-react shown)
- Tailwind CSS styling
- TypeScript support

### 8. Composable Architecture
- Clear separation of concerns
- Each sub-component has specific purpose
- Easy to customize individual parts
- Follows component composition patterns

---

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between menu items
- **Arrow keys**: Navigate within dropdowns
- **Enter/Space**: Activate links
- **Escape**: Close dropdowns

### Screen Reader Support
- Semantic HTML structure
- ARIA attributes automatically managed by Radix UI
- Proper labeling of interactive elements
- State changes announced

### Focus Management
- Clear focus indicators
- Logical tab order
- Focus trap in dropdowns (when appropriate)
- Return focus on close

---

## Related Components

From the documentation:
- **Native Select**: For simpler selection patterns
- **Pagination**: For page navigation

Additional related components (typical usage context):
- **Dropdown Menu**: For user menus and actions
- **Command Menu**: For command palettes
- **App Bar/Header**: Container component for navigation
- **Mobile Menu**: Hamburger menu for mobile navigation

---

## Common Patterns

### Website Top Navigation
Primary use case for horizontal navigation with dropdown menus containing links to various sections.

### Documentation Sites
Multi-level navigation with categorized content in dropdown menus, often with featured sections.

### App Navigation
Top-level navigation for web applications with complex hierarchical content.

### Mega Menus
Grid-based dropdown content with multiple columns and featured sections.

---

Research completed: 2025-11-10
Component: Navigation Menu
Framework: ShadCN UI
Documentation: https://ui.shadcn.com/docs/components/navigation-menu
Built on: Radix UI Primitives
Styled with: Tailwind CSS
