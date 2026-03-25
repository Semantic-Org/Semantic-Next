# Radix UI - Navigation Menu Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/navigation-menu
Status: ✅ Working
Version: 1.2.14
Bundle Size: 12.37 kB (gzipped)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-structured documentation with clear API reference, extensive props documentation, keyboard interaction tables, accessibility notes, and multiple code examples. Package-level documentation with installation instructions and styling guidance.

## Component Definition
- **Core purpose**: A collection of links for navigating websites with submenu support, keyboard navigation, and active state management
- **Mental model**: A hierarchical navigation structure with triggers that reveal content panels, similar to dropdown menus but optimized for site navigation
- **Semantic meaning**: Provides semantic navigation landmarks with proper ARIA roles, enabling users to navigate between website sections with full keyboard support and active page indication

## Pattern Support Levels
- **Native**: Props for orientation, timing, active state, controlled/uncontrolled modes, viewport positioning
- **Composed**: Multi-component system (Root, List, Item, Trigger, Content, Link, Indicator, Viewport, Sub)
- **CSS-only**: Extensive data attributes for styling states, motion, orientation, and active indicators

## Content Patterns

### Logo/Brand Area
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Logo placement | ✅ | Composed | Brand elements can be placed alongside NavigationMenu.List |
| Brand link | ✅ | Composed | Use NavigationMenu.Link for consistent navigation behavior |
| Logo sizing | N/A | - | Content determines size |

### Navigation Links
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Native | NavigationMenu.Link component with text content |
| Icon + text links | ✅ | Composed | Icons can be children of Link component |
| Icon-only links | ✅ | Composed | Requires proper ARIA labels for accessibility |
| Active link indication | ✅ | Native | `active` prop sets `[data-active]` attribute and `aria-current="page"` |
| Nested navigation | ✅ | Native | NavigationMenu.Sub component for hierarchical menus |
| External links | ✅ | Composed | Use standard anchor behavior with Link component |

### Actions/Buttons
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Primary CTA | ✅ | Composed | Button elements can coexist with navigation structure |
| Secondary actions | ✅ | Composed | Multiple action buttons supported |
| Icon buttons | ✅ | Composed | Any button type can be included |

### Search Integration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Search input | ✅ | Composed | Search components can be placed within or alongside navigation |
| Search trigger | ✅ | Composed | Trigger can open search interface |

### User Menu
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| User avatar | ✅ | Composed | Avatar can be part of Item with Trigger |
| Profile dropdown | ✅ | Native | Content component provides dropdown functionality |
| User info display | ✅ | Composed | Any content can be rendered in Content area |

## Layout Patterns

### Fixed Position
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed top | ⚠️ | CSS-only | Component provides structure; positioning via CSS |
| Fixed bottom | ⚠️ | CSS-only | Component provides structure; positioning via CSS |
| Fixed to side | ⚠️ | CSS-only | Component provides structure; positioning via CSS |

### Sticky Position
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Sticky on scroll | ⚠️ | CSS-only | Apply CSS sticky positioning to Root component |
| Reveal on scroll up | ⚠️ | CSS-only | Requires custom scroll detection logic |

### Responsive Collapse
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Mobile hamburger | N/A | - | No built-in mobile menu; requires separate mobile navigation component |
| Responsive breakpoints | ⚠️ | CSS-only | Media queries control visibility/layout |
| Auto-collapse | N/A | - | Not provided by component |

### Multi-row Layout
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Two-tier navigation | ✅ | Native | NavigationMenu.Sub enables nested menu structures |
| Horizontal + vertical | ✅ | Native | `orientation` prop supports both "horizontal" and "vertical" |
| Tab bar integration | ✅ | Composed | Multiple List components or custom composition |

## State Patterns

### Active/Selected
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active link styling | ✅ | Native | `active` prop on Link sets `[data-active]` and `aria-current="page"` |
| Current page indication | ✅ | Native | Automatic ARIA attributes when `active={true}` |
| Active item control | ✅ | Native | `value`/`defaultValue` props control which Item is active (trigger opened) |
| onValueChange callback | ✅ | Native | Callback fires when active item changes |

### Scroll Behavior
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hide on scroll down | N/A | - | Requires external scroll detection |
| Show on scroll up | N/A | - | Requires external scroll detection |
| Transparent to solid | N/A | - | CSS-only with scroll event handlers |
| Elevation on scroll | N/A | - | CSS-only with scroll event handlers |

### Collapsible State
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expanded/collapsed | ✅ | Native | Trigger controls Content visibility |
| Controlled state | ✅ | Native | `value` prop enables controlled mode |
| Uncontrolled state | ✅ | Native | `defaultValue` prop enables uncontrolled mode |
| State callbacks | ✅ | Native | `onValueChange` tracks state changes |
| Open/close animations | ✅ | CSS-only | `[data-state="open|closed"]` and `[data-motion]` attributes |

## Variation Patterns

### Height Options
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Compact height | ⚠️ | CSS-only | Content height controlled by styling |
| Standard height | ⚠️ | CSS-only | Default browser rendering |
| Large height | ⚠️ | CSS-only | Content height controlled by styling |

### Color Themes
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Light theme | ⚠️ | CSS-only | No built-in themes; apply custom styles |
| Dark theme | ⚠️ | CSS-only | No built-in themes; apply custom styles |
| Transparent | ⚠️ | CSS-only | No built-in themes; apply custom styles |
| Colored variants | ⚠️ | CSS-only | No built-in themes; apply custom styles |

### Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left-aligned items | ⚠️ | CSS-only | Flexbox/CSS Grid for alignment |
| Center-aligned items | ⚠️ | CSS-only | Flexbox/CSS Grid for alignment |
| Right-aligned items | ⚠️ | CSS-only | Flexbox/CSS Grid for alignment |
| Space-between | ⚠️ | CSS-only | Flexbox/CSS Grid for alignment |
| Split layout | ⚠️ | CSS-only | Multiple List components or custom composition |

### Spacing Control
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Padding variants | ⚠️ | CSS-only | No padding props; use CSS |
| Gap between items | ⚠️ | CSS-only | CSS gap or margin for List children |
| Content spacing | ⚠️ | CSS-only | Style Content component |

## Props/API Documentation

### NavigationMenu.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element instead of rendering default element |
| `value` | string | - | Controlled value for active Item (by Item's `value` prop) |
| `defaultValue` | string | - | Uncontrolled default active Item |
| `onValueChange` | (value: string) => void | - | Callback when active Item changes |
| `delayDuration` | number | 200 | Milliseconds before submenu opens on hover |
| `skipDelayDuration` | number | 300 | Milliseconds to skip delay after initial interaction |
| `dir` | "ltr" \| "rtl" | - | Text direction for right-to-left languages |
| `orientation` | "horizontal" \| "vertical" | "horizontal" | Menu orientation |

### NavigationMenu.List

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |

### NavigationMenu.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |
| `value` | string | - | Unique identifier for this Item (used with Root's value) |

### NavigationMenu.Trigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |

### NavigationMenu.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |
| `disableOutsidePointerEvents` | boolean | `false` | Disable pointer events outside when open |
| `onEscapeKeyDown` | (event: KeyboardEvent) => void | - | Callback when Escape pressed |
| `onPointerDownOutside` | (event: PointerDownOutsideEvent) => void | - | Callback when pointer down occurs outside |
| `onFocusOutside` | (event: FocusOutsideEvent) => void | - | Callback when focus moves outside |
| `onInteractOutside` | (event: InteractOutsideEvent) => void | - | Callback for any interaction outside |
| `forceMount` | boolean | `false` | Force Content to render even when closed (useful for animations) |

### NavigationMenu.Link

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |
| `active` | boolean | `false` | Marks link as active (current page), sets `[data-active]` and `aria-current="page"` |
| `onSelect` | (event: Event) => void | - | Callback when link selected (can prevent default) |

### NavigationMenu.Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |
| `forceMount` | boolean | `false` | Force Indicator to render even when no trigger active |

### NavigationMenu.Viewport

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Merge props with child element |
| `forceMount` | boolean | `false` | Force Viewport to render even when no content active |

### NavigationMenu.Sub

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | string | - | Default active value for nested submenu |
| `value` | string | - | Controlled active value for nested submenu |
| `onValueChange` | (value: string) => void | - | Callback when submenu active value changes |
| `orientation` | "horizontal" \| "vertical" | "horizontal" | Submenu orientation |

## Code Examples

### Basic Horizontal Navigation
```jsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default () => (
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link href="/">
          Home
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/about">
          About
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/contact" active>
          Contact
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
);
```

### Navigation with Dropdown Content
```jsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default () => (
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>
          Products
        </NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <ul>
            <li><NavigationMenu.Link href="/products/software">Software</NavigationMenu.Link></li>
            <li><NavigationMenu.Link href="/products/hardware">Hardware</NavigationMenu.Link></li>
            <li><NavigationMenu.Link href="/products/services">Services</NavigationMenu.Link></li>
          </ul>
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
```

### Vertical Orientation
```jsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default () => (
  <NavigationMenu.Root orientation="vertical">
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link href="/dashboard">
          Dashboard
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Trigger>
          Settings
        </NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Sub defaultValue="profile">
            <NavigationMenu.List>
              <NavigationMenu.Item value="profile">
                <NavigationMenu.Link href="/settings/profile">
                  Profile
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="security">
                <NavigationMenu.Link href="/settings/security">
                  Security
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Sub>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
);
```

### Controlled State with Indicator
```jsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState('');

  return (
    <NavigationMenu.Root value={value} onValueChange={setValue}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>
            Products
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            Product content here
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="company">
          <NavigationMenu.Trigger>
            Company
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            Company content here
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator />
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
};
```

### Integration with Next.js Link
```jsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default () => {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild active={pathname === '/'}>
            <NextLink href="/">Home</NextLink>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild active={pathname === '/about'}>
            <NextLink href="/about">About</NextLink>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
```

## Keyboard Interactions

| Key | Behavior |
|-----|----------|
| Space / Enter | When focus on Trigger: opens associated Content |
| Tab | Moves focus to next focusable element |
| Shift + Tab | Moves focus to previous focusable element |
| Arrow Down | When horizontal & focus on Trigger: opens Content<br>When open: moves focus to first item in Content<br>Otherwise: moves focus to next Item |
| Arrow Up | Moves focus to previous Item |
| Arrow Right | When horizontal: moves focus to next Item<br>When vertical & focus on Trigger: opens Content |
| Arrow Left | When horizontal: moves focus to previous Item<br>When vertical: closes open Content |
| Home | Moves focus to first Item |
| End | Moves focus to last Item |
| Escape | Closes open Content and returns focus to Trigger |

## Styling Approaches

### Data Attributes for State
All components expose data attributes for CSS targeting:

**State Attributes:**
- `[data-state="open"]` / `[data-state="closed"]` - On Trigger, Content, Viewport
- `[data-active]` - On Link when `active={true}`
- `[data-orientation="horizontal"]` / `[data-orientation="vertical"]` - On Root, List, Sub
- `[data-motion="from-start"]` / `[data-motion="from-end"]` / `[data-motion="to-start"]` / `[data-motion="to-end"]` - On Content for directional animations

**CSS Variables for Animations:**
- `--radix-navigation-menu-viewport-width` - Dynamic viewport width
- `--radix-navigation-menu-viewport-height` - Dynamic viewport height

### Example Styling
```css
/* Style active links */
[data-active] {
  color: var(--accent-color);
  font-weight: 600;
}

/* Animate Content entrance */
[data-state="open"] {
  animation: slideDown 200ms ease-out;
}

[data-state="closed"] {
  animation: slideUp 200ms ease-in;
}

/* Motion-aware animations */
[data-motion="from-start"] {
  animation: enterFromLeft 200ms ease;
}

[data-motion="from-end"] {
  animation: enterFromRight 200ms ease;
}

/* Responsive Viewport sizing */
.ViewportPosition {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  top: 100%;
  left: 0;
}

.Viewport {
  position: relative;
  overflow: hidden;
  width: var(--radix-navigation-menu-viewport-width);
  height: var(--radix-navigation-menu-viewport-height);
  transition: width, height, 300ms ease;
}
```

## Accessibility Patterns

### ARIA Implementation
- **Semantic roles**: Uses navigation landmark role pattern
- **Active page indication**: `active` prop sets `aria-current="page"` automatically
- **Keyboard navigation**: Full keyboard support per navigation role requirements
- **Focus management**: Tab order maintained properly through navigation structure

### Disclosure Pattern
Radix documentation explicitly notes this component uses the **disclosure pattern** (show/hide content), NOT the **menubar pattern** (application menus). This distinction is important:
- Disclosure: Better for website navigation with dropdowns
- Menubar: Better for application menu bars (File, Edit, etc.)

### Best Practices
```jsx
// Proper semantic structure
<NavigationMenu.Root>
  <NavigationMenu.List>
    {/* Links announce their active state automatically */}
    <NavigationMenu.Item>
      <NavigationMenu.Link active={isCurrentPage}>
        Current Page
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>

// External links should indicate they open new windows
<NavigationMenu.Link href="https://external.com" target="_blank" rel="noopener">
  External Link
  <span className="sr-only">(opens in new window)</span>
</NavigationMenu.Link>
```

## Notable Features

### Flexible Viewport System
The Viewport component enables advanced layout control:
- Content can render inside List (default) or teleported to Viewport
- Viewport uses CSS variables for smooth size transitions
- Enables centralized dropdown positioning

### Rich Animation Support
Multiple data attributes enable sophisticated animations:
- State transitions (open/closed)
- Directional motion (from-start, from-end, to-start, to-end)
- Dynamic sizing via CSS variables
- `forceMount` prop keeps elements in DOM for exit animations

### Timing Controls
Fine-grained control over interaction timing:
- `delayDuration`: How long hover waits before opening (default 200ms)
- `skipDelayDuration`: Skip delay briefly after closing (default 300ms)
- Improves UX by reducing accidental triggers while maintaining responsiveness

### Nested Menu Support
NavigationMenu.Sub component enables hierarchical navigation:
- Separate state management for submenus
- Can nest multiple levels deep
- Same API as Root (value, defaultValue, onValueChange)

### Active State Management
Two levels of "active" state:
1. **Item active**: Which trigger's Content is currently open (via Root's `value`)
2. **Link active**: Which page is current (via Link's `active` prop)

### Controlled & Uncontrolled Modes
Flexible state management:
- Uncontrolled: Use `defaultValue`, component manages state internally
- Controlled: Use `value` + `onValueChange`, parent manages state
- Useful for synchronizing with routers or analytics

### Client-Side Routing Integration
The `asChild` prop enables seamless integration with routing libraries:
```jsx
<NavigationMenu.Link asChild>
  <NextLink href="/page">Page</NextLink>
</NavigationMenu.Link>
```
Combines navigation menu behavior with router navigation.

### Orientation Support
Both horizontal and vertical layouts supported natively:
- Horizontal: Traditional top navigation bar
- Vertical: Sidebar navigation or dropdown submenus
- Keyboard navigation adapts to orientation automatically

### Event Interception
Multiple callbacks for controlling behavior:
- `onSelect`: Intercept link clicks (can prevent default)
- `onEscapeKeyDown`: Handle escape key presses
- `onPointerDownOutside`: Detect clicks outside
- `onFocusOutside`: Detect focus leaving
- `onInteractOutside`: General interaction outside

## Use Cases Documented

1. **Horizontal top navigation** - Standard website header navigation
2. **Vertical sidebar navigation** - Dashboard or app navigation
3. **Mega menus** - Complex dropdown content with multiple columns/sections
4. **Multi-level navigation** - Nested submenus using Sub component
5. **Active page indication** - Visual feedback for current location
6. **Client-side routing** - Integration with Next.js, React Router, etc.
7. **Animated transitions** - Smooth content entrances/exits with motion data
8. **Controlled navigation state** - External state management for complex apps
9. **Accessible navigation** - WCAG-compliant navigation with keyboard support

## Research Notes

### Documentation Structure
Documentation follows Radix UI's component pattern:
- Clear component categorization (navigation)
- Comprehensive API reference for all sub-components
- Keyboard interaction tables
- Accessibility guidance with W3C references
- Anatomy diagrams showing component relationships
- Multiple code examples with increasing complexity

### Framework Philosophy
Navigation Menu exemplifies Radix's approach:
- Unstyled primitives (bring your own design)
- Composable sub-components
- Rich data attributes for styling hooks
- Accessibility built-in, not optional
- Flexible state management (controlled/uncontrolled)
- Framework-agnostic (works with any React router)

### Comparison to Other Navigation Solutions
This component is notably more sophisticated than basic nav patterns:
- More complex than simple link lists (supports dropdowns, submenus)
- Less opinionated than UI frameworks (no styling, full customization)
- More accessible than custom solutions (W3C navigation role pattern)
- More flexible than menubar components (disclosure pattern for websites)

### Complexity vs Portal/Dropdown
At 12.37 kB, this is significantly larger than simpler primitives like Portal (1.72 kB):
- Reflects additional functionality (keyboard nav, active state, timing, orientation)
- Still reasonable for comprehensive navigation solution
- Can tree-shake unused sub-components

### Version Maturity
Version 1.2.14 indicates mature, stable API with minor improvements:
- Navigation patterns well-established
- API unlikely to have breaking changes
- Safe for production use

### Integration Patterns
Documentation emphasizes composition:
- `asChild` prop for routing library integration
- Viewport for flexible layout control
- Sub for nested menu structures
- Indicator for visual active state feedback

### State Management Philosophy
Two-tier state model is elegant:
- Item-level state: Which dropdown is open (transient UI state)
- Link-level state: Which page is active (application state)
- Allows independent management of each concern
