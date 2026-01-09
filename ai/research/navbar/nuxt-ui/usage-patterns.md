# Nuxt UI NavigationMenu - Usage Patterns

> Research Date: 2025-11-10
> Component URL: https://ui.nuxt.com/components/navigation-menu
> Component Status: Active and documented

## Component Overview

The NavigationMenu component is described as "a horizontal or vertical list of links with optional submenus." It provides a flexible navigation solution for building sophisticated navigation bars, sidebars, and menu structures within Nuxt applications. The component supports nested submenus, multiple layout orientations, interactive states, and extensive customization through props and configuration.

**Core Philosophy**: Flexible navigation structure with support for both horizontal navigation bars and vertical sidebars, featuring expandable submenus, active state highlighting, and responsive collapse modes.

**Documentation Quality**: Excellent - comprehensive API documentation with clear examples for both horizontal and vertical layouts, interactive demos, and detailed prop descriptions.

## Component Definition

### Type Classification
- **Category**: Composite navigation component
- **Composition**: Built on Reka UI foundation primitives
- **Dependencies**: Uses internal Link, Badge, Avatar, Tooltip, Accordion components

### Core Functionality
- Renders hierarchical navigation structures with parent/child relationships
- Supports both horizontal (nav bar) and vertical (sidebar) orientations
- Handles expandable/collapsible submenu groups
- Manages active state indication
- Provides collapsed icon-only mode for vertical layouts

## Core Patterns

### Basic Structure
```vue
<UNavigationMenu
  :items="[
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]"
/>
```

The component accepts an items array where each item can be:
1. **Simple link** - Label + destination
2. **Trigger item** - Opens a submenu popover (horizontal)
3. **Label item** - Non-interactive section header
4. **Expandable group** - Parent with children (vertical accordion)

### Item Structure Hierarchy
```typescript
NavigationMenuItem {
  // Display content
  label?: string
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps

  // Behavior
  type?: 'label' | 'trigger' | 'link'
  disabled?: boolean

  // Link properties (when type is 'link')
  to?: string
  target?: string

  // Submenu (when type is 'trigger' or accordion)
  children?: NavigationMenuChildItem[]
  defaultOpen?: boolean
  trailingIcon?: string

  // Enhancements
  tooltip?: TooltipProps

  // State
  active?: boolean
  open?: boolean
}

NavigationMenuChildItem {
  label: string
  description?: string
  icon?: string
  to?: string
  onSelect?: (e: Event) => void
  active?: boolean
}
```

## Props & Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | NavigationMenuItem[] \| NavigationMenuItem[][] | — | Array of menu items or grouped item arrays |
| `orientation` | 'horizontal' \| 'vertical' | `'horizontal'` | Menu layout direction |
| `collapsed` | boolean | `false` | Collapses vertical menu to icon-only mode |
| `highlight` | boolean | `false` | Displays border highlight on active items |
| `highlightColor` | string | Inherits from `color` | Color of the highlight border indicator |
| `color` | string | `'primary'` | Theme color for component styling |
| `variant` | string | Default variant | Visual style variant (e.g., 'link') |
| `trailingIcon` | string | `'i-lucide-chevron-down'` | Default icon for expandable items |
| `arrow` | boolean | `false` | Shows animated arrow pointing to active content |
| `contentOrientation` | 'horizontal' \| 'vertical' | `'horizontal'` | Layout direction for submenu content (horizontal orientation only) |
| `unmountOnHide` | boolean | `true` | Controls whether hidden content is removed from DOM |
| `class` | any | — | Additional CSS classes for custom styling |
| `ui` | object | — | Slot-level style overrides using Nuxt UI's slot customization system |

## Content Patterns

### Logo/Brand
The NavigationMenu focuses on link and navigation items. Brand/logo elements are typically added separately outside the component:

```vue
<div class="flex items-center gap-8">
  <NuxtLink to="/" class="logo">
    <img src="/logo.svg" alt="Brand" />
  </NuxtLink>

  <UNavigationMenu
    :items="navigationItems"
  />
</div>
```

### Simple Navigation Links
```vue
<UNavigationMenu
  :items="[
    { label: 'Home', to: '/', active: true },
    { label: 'Products', to: '/products' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]"
/>
```

### Links with Icons
```vue
<UNavigationMenu
  :items="[
    {
      label: 'Dashboard',
      to: '/dashboard',
      icon: 'i-lucide-layout-dashboard'
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: 'i-lucide-settings'
    },
    {
      label: 'Profile',
      to: '/profile',
      icon: 'i-lucide-user'
    }
  ]"
  orientation="vertical"
/>
```

### Links with Badges
```vue
<UNavigationMenu
  :items="[
    {
      label: 'Messages',
      to: '/messages',
      badge: 5  // Numeric badge
    },
    {
      label: 'Notifications',
      to: '/notifications',
      badge: { label: 'New', color: 'red' }  // Custom badge
    }
  ]"
/>
```

### Expandable Submenus (Horizontal)
```vue
<UNavigationMenu
  :items="[
    { label: 'Home', to: '/' },
    {
      label: 'Products',
      type: 'trigger',
      children: [
        {
          label: 'Software',
          description: 'Desktop and mobile apps',
          to: '/products/software',
          icon: 'i-lucide-laptop'
        },
        {
          label: 'Hardware',
          description: 'Physical devices',
          to: '/products/hardware',
          icon: 'i-lucide-cpu'
        }
      ]
    }
  ]"
/>
```

### Expandable Groups (Vertical)
```vue
<UNavigationMenu
  orientation="vertical"
  :items="[
    {
      label: 'Getting Started',
      icon: 'i-lucide-book-open',
      defaultOpen: true,
      children: [
        { label: 'Introduction', to: '/intro' },
        { label: 'Installation', to: '/install' }
      ]
    },
    {
      label: 'Components',
      icon: 'i-lucide-blocks',
      children: [
        { label: 'Button', to: '/button' },
        { label: 'Input', to: '/input' }
      ]
    }
  ]"
/>
```

### Section Headers (Labels)
```vue
<UNavigationMenu
  orientation="vertical"
  :items="[
    { label: 'Main', type: 'label' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Projects', to: '/projects' },
    { label: 'Settings', type: 'label' },
    { label: 'Account', to: '/account' },
    { label: 'Preferences', to: '/preferences' }
  ]"
/>
```

### Grouped Items (Horizontal)
```vue
<UNavigationMenu
  :items="[
    [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' }
    ],
    [
      { label: 'Products', to: '/products' },
      { label: 'Services', to: '/services' }
    ]
  ]"
/>
```

Groups will be spaced when horizontal and separated when vertical.

### Search Integration
Not built into the component. Search would typically be added as a separate element:

```vue
<div class="flex items-center gap-4">
  <UNavigationMenu :items="navItems" />
  <UInput icon="i-lucide-search" placeholder="Search..." />
</div>
```

### User Menu Pattern
Not built-in. User menu typically implemented separately:

```vue
<div class="flex items-center justify-between">
  <UNavigationMenu :items="navItems" />

  <UDropdown :items="userMenuItems">
    <UAvatar src="/user.jpg" />
  </UDropdown>
</div>
```

### Actions/Buttons
Not directly supported. Action buttons are typically added outside the navigation menu:

```vue
<div class="flex items-center gap-8">
  <UNavigationMenu :items="navItems" />

  <div class="flex gap-2">
    <UButton variant="ghost">Sign In</UButton>
    <UButton>Get Started</UButton>
  </div>
</div>
```

## Layout Patterns

### Horizontal Navigation Bar
```vue
<UNavigationMenu
  orientation="horizontal"
  :items="horizontalItems"
/>
```

**Characteristics:**
- Items display inline across the page
- Submenus appear as popovers on trigger
- Groups are spaced horizontally
- Highlight shows as bottom border on active items
- Content can be laid out vertically or horizontally

### Vertical Sidebar
```vue
<UNavigationMenu
  orientation="vertical"
  :items="sidebarItems"
/>
```

**Characteristics:**
- Items stack vertically
- Uses Accordion component for expandable groups
- Groups are separated with visual dividers
- Supports collapsed icon-only mode
- Child items render with description text

### Fixed Position Navbar
Not built into component. Achieved with wrapper styling:

```vue
<nav class="fixed top-0 left-0 right-0 z-50 bg-white border-b">
  <div class="container mx-auto px-4">
    <UNavigationMenu :items="items" />
  </div>
</nav>
```

### Sticky Position
Not built into component. Achieved with wrapper styling:

```vue
<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur">
  <UNavigationMenu :items="items" />
</nav>
```

### Responsive Collapse (Mobile)
Collapsed mode is available for vertical orientation:

```vue
<script setup>
const isCollapsed = ref(false)

// Responsive logic
const isMobile = useMediaQuery('(max-width: 768px)')
watchEffect(() => {
  isCollapsed.value = isMobile.value
})
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :collapsed="isCollapsed"
    :items="items"
  />
</template>
```

When collapsed:
- Shows only icons
- Label text hidden
- Tooltips/popovers provide context on hover

### Collapsed Sidebar (Icon-Only)
```vue
<UNavigationMenu
  orientation="vertical"
  collapsed
  :items="[
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/dashboard',
      tooltip: { text: 'Dashboard' }
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings',
      tooltip: { text: 'Settings' }
    }
  ]"
/>
```

### Multi-Row Layout
Not directly supported. Multi-row layouts would require custom wrapper implementation or multiple NavigationMenu instances.

### Content Orientation (Submenu Layout)
```vue
<UNavigationMenu
  orientation="horizontal"
  contentOrientation="vertical"
  :items="[
    {
      label: 'Products',
      type: 'trigger',
      children: [
        { label: 'Product 1', description: 'First product' },
        { label: 'Product 2', description: 'Second product' }
      ]
    }
  ]"
/>
```

Controls how submenu children are laid out (horizontal menus only).

## State Patterns

### Active/Selected Links
```vue
<UNavigationMenu
  :items="[
    { label: 'Home', to: '/', active: true },  // Active state
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]"
/>
```

The `active` property marks the current/selected navigation item.

### Active State with Highlight
```vue
<UNavigationMenu
  highlight
  highlightColor="blue"
  :items="[
    { label: 'Dashboard', to: '/dashboard', active: true }
  ]"
/>
```

The highlight prop adds a colored border indicator to active items:
- Horizontal: Bottom border
- Vertical: Left border (typically)

### Animated Highlight Arrow
```vue
<UNavigationMenu
  arrow
  :items="[
    {
      label: 'Products',
      type: 'trigger',
      active: true,
      children: productItems
    }
  ]"
/>
```

The arrow animates to follow the active item's content.

### Hover States
Built-in via framework styling. No explicit prop needed. Standard hover effects apply to interactive items.

### Disabled Items
```vue
<UNavigationMenu
  :items="[
    { label: 'Available', to: '/available' },
    { label: 'Coming Soon', disabled: true },
    { label: 'Active', to: '/active' }
  ]"
/>
```

Disabled items are visually de-emphasized and non-interactive.

### Expandable/Collapsible (Vertical)
```vue
<UNavigationMenu
  orientation="vertical"
  :items="[
    {
      label: 'Documentation',
      defaultOpen: false,  // Initial collapsed state
      children: [
        { label: 'Guide', to: '/guide' },
        { label: 'API', to: '/api' }
      ]
    }
  ]"
/>
```

The `defaultOpen` prop controls initial accordion state. The `open` prop can be used for controlled state.

### Expandable/Collapsible (Horizontal Popover)
```vue
<UNavigationMenu
  :items="[
    {
      label: 'Products',
      type: 'trigger',  // Opens popover on click/hover
      children: [
        { label: 'Software', to: '/software' },
        { label: 'Hardware', to: '/hardware' }
      ]
    }
  ]"
/>
```

Horizontal orientation uses popover/dropdown pattern for submenus.

### Scroll Behavior
Not built into component. Scroll-based highlighting would require custom implementation:

```vue
<script setup>
const activeSection = ref('home')

// Watch scroll position and update activeSection
onMounted(() => {
  window.addEventListener('scroll', updateActiveSection)
})

const items = computed(() => [
  { label: 'Home', to: '#home', active: activeSection.value === 'home' },
  { label: 'Features', to: '#features', active: activeSection.value === 'features' }
])
</script>

<template>
  <UNavigationMenu :items="items" />
</template>
```

## Variation Patterns

### Height Options
Not explicitly provided as props. Height control achieved through:
- Custom CSS classes via `class` prop
- Slot styling via `ui` prop
- Wrapper container styling

```vue
<UNavigationMenu
  class="h-16"  <!-- Custom height -->
  :items="items"
/>
```

### Color Themes
```vue
<!-- Primary color (default) -->
<UNavigationMenu
  color="primary"
  :items="items"
/>

<!-- Custom semantic colors -->
<UNavigationMenu
  color="blue"
  :items="items"
/>

<UNavigationMenu
  color="neutral"
  :items="items"
/>
```

The `color` prop affects:
- Active state highlighting
- Badge colors (when not specified)
- Interactive hover states

### Color Mode Support
Automatic light/dark mode adaptation via Nuxt UI's color mode system:
- Uses CSS custom properties
- Automatic contrast adjustment
- oklch color space for consistency

### Style Variants
```vue
<UNavigationMenu
  variant="link"  <!-- Link-style appearance -->
  :items="items"
/>

<UNavigationMenu
  variant="default"  <!-- Default appearance -->
  :items="items"
/>
```

Limited variant options compared to other components - primarily focused on link styling.

### Alignment Options
Not built-in as props. Alignment controlled through wrapper styling:

```vue
<!-- Left-aligned -->
<div class="flex justify-start">
  <UNavigationMenu :items="items" />
</div>

<!-- Center-aligned -->
<div class="flex justify-center">
  <UNavigationMenu :items="items" />
</div>

<!-- Right-aligned -->
<div class="flex justify-end">
  <UNavigationMenu :items="items" />
</div>

<!-- Space between -->
<div class="flex justify-between">
  <UNavigationMenu :items="leftItems" />
  <UNavigationMenu :items="rightItems" />
</div>
```

### Spacing Control
Spacing customization via `ui` prop:

```vue
<UNavigationMenu
  :items="items"
  :ui="{
    root: 'gap-8',  <!-- Custom item spacing -->
    item: 'px-4 py-2'  <!-- Custom item padding -->
  }"
/>
```

### Submenu Content Unmounting
```vue
<!-- Keep submenu content in DOM (preserve state) -->
<UNavigationMenu
  :unmountOnHide="false"
  :items="itemsWithChildren"
/>

<!-- Remove from DOM when hidden (default) -->
<UNavigationMenu
  :unmountOnHide="true"
  :items="itemsWithChildren"
/>
```

Useful for preserving component state within submenus.

## Code Examples

### Basic Horizontal Navbar
```vue
<template>
  <UNavigationMenu
    :items="[
      { label: 'Home', to: '/', active: true },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/about' }
    ]"
  />
</template>
```

### Navbar with Dropdown Submenus
```vue
<script setup>
const items = [
  { label: 'Home', to: '/' },
  {
    label: 'Products',
    type: 'trigger',
    children: [
      {
        label: 'Software',
        description: 'Web and mobile applications',
        icon: 'i-lucide-monitor',
        to: '/products/software'
      },
      {
        label: 'Hardware',
        description: 'Physical devices and equipment',
        icon: 'i-lucide-cpu',
        to: '/products/hardware'
      },
      {
        label: 'Services',
        description: 'Consulting and support',
        icon: 'i-lucide-headphones',
        to: '/products/services'
      }
    ]
  },
  {
    label: 'Resources',
    type: 'trigger',
    children: [
      { label: 'Blog', to: '/blog', icon: 'i-lucide-newspaper' },
      { label: 'Documentation', to: '/docs', icon: 'i-lucide-book-open' },
      { label: 'Support', to: '/support', icon: 'i-lucide-life-buoy' }
    ]
  },
  { label: 'Pricing', to: '/pricing' }
]
</script>

<template>
  <UNavigationMenu :items="items" />
</template>
```

### Vertical Sidebar Navigation
```vue
<script setup>
const sidebarItems = [
  {
    label: 'Getting Started',
    icon: 'i-lucide-book-open',
    defaultOpen: true,
    children: [
      { label: 'Introduction', to: '/docs/intro' },
      { label: 'Installation', to: '/docs/install' },
      { label: 'Configuration', to: '/docs/config' }
    ]
  },
  {
    label: 'Components',
    icon: 'i-lucide-blocks',
    children: [
      { label: 'Button', to: '/docs/button' },
      { label: 'Input', to: '/docs/input' },
      { label: 'Card', to: '/docs/card' }
    ]
  },
  {
    label: 'Advanced',
    icon: 'i-lucide-zap',
    children: [
      { label: 'Theming', to: '/docs/theming' },
      { label: 'Plugins', to: '/docs/plugins' }
    ]
  }
]
</script>

<template>
  <aside class="w-64 border-r">
    <UNavigationMenu
      orientation="vertical"
      :items="sidebarItems"
    />
  </aside>
</template>
```

### Collapsible Icon-Only Sidebar
```vue
<script setup>
const collapsed = ref(false)

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
    tooltip: { text: 'Dashboard', side: 'right' }
  },
  {
    label: 'Projects',
    icon: 'i-lucide-folder',
    to: '/projects',
    tooltip: { text: 'Projects', side: 'right' }
  },
  {
    label: 'Team',
    icon: 'i-lucide-users',
    to: '/team',
    tooltip: { text: 'Team', side: 'right' }
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
    tooltip: { text: 'Settings', side: 'right' }
  }
]
</script>

<template>
  <aside :class="collapsed ? 'w-16' : 'w-64'">
    <UButton
      icon="i-lucide-menu"
      @click="collapsed = !collapsed"
      variant="ghost"
    />

    <UNavigationMenu
      orientation="vertical"
      :collapsed="collapsed"
      :items="sidebarItems"
    />
  </aside>
</template>
```

### Navbar with Active Highlight
```vue
<script setup>
const route = useRoute()

const items = computed(() => [
  { label: 'Dashboard', to: '/', active: route.path === '/' },
  { label: 'Projects', to: '/projects', active: route.path === '/projects' },
  { label: 'Team', to: '/team', active: route.path === '/team' },
  { label: 'Settings', to: '/settings', active: route.path === '/settings' }
])
</script>

<template>
  <UNavigationMenu
    highlight
    highlightColor="blue"
    :items="items"
  />
</template>
```

### Navbar with Badges
```vue
<template>
  <UNavigationMenu
    :items="[
      { label: 'Dashboard', to: '/dashboard' },
      {
        label: 'Messages',
        to: '/messages',
        icon: 'i-lucide-mail',
        badge: 12
      },
      {
        label: 'Notifications',
        to: '/notifications',
        icon: 'i-lucide-bell',
        badge: { label: '3', color: 'red' }
      },
      {
        label: 'Tasks',
        to: '/tasks',
        icon: 'i-lucide-check-square',
        badge: { label: 'New', color: 'blue' }
      }
    ]"
  />
</template>
```

### Grouped Navigation (Horizontal)
```vue
<template>
  <UNavigationMenu
    :items="[
      [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' }
      ],
      [
        { label: 'Products', to: '/products' },
        { label: 'Services', to: '/services' },
        { label: 'Pricing', to: '/pricing' }
      ],
      [
        { label: 'Contact', to: '/contact' }
      ]
    ]"
  />
</template>
```

### Vertical Navigation with Section Labels
```vue
<template>
  <UNavigationMenu
    orientation="vertical"
    :items="[
      { label: 'MAIN MENU', type: 'label' },
      { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-home' },
      { label: 'Projects', to: '/projects', icon: 'i-lucide-folder' },

      { label: 'WORKSPACE', type: 'label' },
      { label: 'Team', to: '/team', icon: 'i-lucide-users' },
      { label: 'Documents', to: '/docs', icon: 'i-lucide-file-text' },

      { label: 'SETTINGS', type: 'label' },
      { label: 'Account', to: '/account', icon: 'i-lucide-user' },
      { label: 'Preferences', to: '/preferences', icon: 'i-lucide-settings' }
    ]"
  />
</template>
```

### Full-Featured Application Navbar
```vue
<script setup>
const items = [
  { label: 'Home', to: '/' },
  {
    label: 'Products',
    type: 'trigger',
    children: [
      {
        label: 'All Products',
        description: 'Browse our complete catalog',
        icon: 'i-lucide-grid',
        to: '/products'
      },
      {
        label: 'Featured',
        description: 'Our top picks this month',
        icon: 'i-lucide-star',
        to: '/products/featured'
      },
      {
        label: 'New Arrivals',
        description: 'Just added to our store',
        icon: 'i-lucide-sparkles',
        to: '/products/new'
      }
    ]
  },
  {
    label: 'Company',
    type: 'trigger',
    children: [
      { label: 'About Us', to: '/about', icon: 'i-lucide-info' },
      { label: 'Team', to: '/team', icon: 'i-lucide-users' },
      { label: 'Careers', to: '/careers', icon: 'i-lucide-briefcase', badge: '3' },
      { label: 'Contact', to: '/contact', icon: 'i-lucide-mail' }
    ]
  }
]
</script>

<template>
  <nav class="border-b bg-white">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo.svg" alt="Logo" class="h-8" />
        </NuxtLink>

        <!-- Navigation -->
        <UNavigationMenu
          highlight
          :items="items"
        />

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <UInput
            icon="i-lucide-search"
            placeholder="Search..."
            class="w-64"
          />
          <UButton variant="ghost" icon="i-lucide-shopping-cart" />
          <UButton>Sign In</UButton>
        </div>
      </div>
    </div>
  </nav>
</template>
```

### Responsive Navigation with Mobile Collapse
```vue
<script setup>
const isMobile = ref(false)
const mobileMenuOpen = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

const items = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]
</script>

<template>
  <nav class="border-b">
    <div class="container mx-auto px-4">
      <!-- Desktop -->
      <div v-if="!isMobile" class="flex items-center h-16">
        <UNavigationMenu :items="items" />
      </div>

      <!-- Mobile -->
      <div v-else>
        <div class="flex items-center justify-between h-16">
          <span class="font-bold">Logo</span>
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>

        <div v-if="mobileMenuOpen" class="pb-4">
          <UNavigationMenu
            orientation="vertical"
            :items="items"
          />
        </div>
      </div>
    </div>
  </nav>
</template>
```

## Notable Features

### Reka UI Foundation
Built on Reka UI primitives (headless UI library for Vue/Nuxt) providing:
- Accessible navigation patterns
- Keyboard navigation support
- Focus management
- ARIA attributes

### Automatic Link Detection
The component intelligently determines item behavior:
- Items with `to` prop become navigable links
- Items with `type: 'trigger'` and `children` open submenus
- Items with `type: 'label'` are non-interactive headers

### Flexible Item Structure
Supports both flat arrays and nested arrays for grouping:
```vue
<!-- Flat -->
:items="[item1, item2, item3]"

<!-- Grouped -->
:items="[[item1, item2], [item3, item4]]"
```

### Dual Orientation Support
Single component handles both use cases:
- **Horizontal**: Traditional navigation bar with popover submenus
- **Vertical**: Sidebar navigation with accordion submenus

### Submenu Description Support
Child items can include descriptions (primarily for horizontal orientation):
```vue
{
  label: 'Products',
  type: 'trigger',
  children: [
    {
      label: 'Software',
      description: 'Web and mobile applications'  // Secondary text
    }
  ]
}
```

### Collapsed Mode with Tooltips
Icon-only mode supports tooltip hints:
```vue
{
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  tooltip: { text: 'Dashboard', side: 'right' }
}
```

### Iconify Integration
Uses Iconify icon system:
- Format: `i-{collection}-{icon-name}`
- Examples: `i-lucide-home`, `i-heroicons-user`
- Automatic icon loading
- Extensive icon library support

### Badge Flexibility
Badges can be:
- Simple numbers: `badge: 5`
- Strings: `badge: 'New'`
- Full Badge component props: `badge: { label: '3', color: 'red' }`

### Smart Visual Separation
"Groups will be spaced when orientation is horizontal and separated when orientation is vertical" - automatic visual grouping based on layout.

### Animated Highlight Arrow
Optional animated arrow that follows active content:
```vue
<UNavigationMenu arrow :items="items" />
```

### Content Unmounting Control
The `unmountOnHide` prop controls whether hidden submenu content remains in the DOM:
- `true` (default): Removed from DOM, better performance
- `false`: Kept in DOM, preserves component state

### Avatar Support
Navigation items can use avatars instead of icons:
```vue
{
  label: 'Profile',
  avatar: { src: '/user.jpg', alt: 'User' },
  to: '/profile'
}
```

## Accessibility

### Semantic Structure
- Proper navigation landmarks
- Semantic HTML elements
- Link vs button differentiation

### Keyboard Navigation
- Tab navigation through items
- Enter/Space to activate links and triggers
- Arrow keys for submenu navigation (via Reka UI)
- Escape to close expanded menus

### Screen Reader Support
- Proper ARIA labels
- Announced link destinations
- Submenu relationship indication
- Disabled state announcements

### Focus Management
- Clear focus indicators
- Focus trap in open submenus
- Proper focus restoration on close

### ARIA Patterns
Built on Reka UI which implements:
- `aria-current` for active items
- `aria-expanded` for expandable items
- `aria-disabled` for disabled items
- Navigation landmark roles

## Framework-Specific Features

### Vue 3 Integration
```vue
<script setup>
import { ref, computed } from 'vue'

// Reactive state
const currentPath = ref('/dashboard')

// Computed items with active state
const items = computed(() => [
  {
    label: 'Dashboard',
    to: '/dashboard',
    active: currentPath.value === '/dashboard'
  },
  // ... more items
])
</script>
```

### Nuxt Router Integration
Seamless integration with Nuxt/Vue Router:
- Uses `<NuxtLink>` internally
- Automatic active state with `route.path`
- Supports all NuxtLink props (`to`, `target`, `prefetch`, etc.)

```vue
<script setup>
const route = useRoute()

const items = computed(() => [
  { label: 'Home', to: '/', active: route.path === '/' }
])
</script>
```

### App Config Customization
Global configuration via `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    // Global icon overrides
    icons: {
      chevronDown: 'i-custom-chevron'
    },

    // Primary color
    primary: 'blue',

    // NavigationMenu defaults
    navigationMenu: {
      default: {
        color: 'primary',
        variant: 'link',
        trailingIcon: 'i-lucide-chevron-down'
      }
    }
  }
})
```

### Color Mode Support
Automatic light/dark mode theming:
- CSS custom properties: `--ui-primary`, etc.
- oklch color space for consistent colors
- Automatic contrast adjustment

### Tailwind CSS Integration
- Built on Tailwind CSS utilities
- Custom classes via `class` prop
- Slot customization via `ui` prop
- Responsive utilities supported

### Slot-Level Styling
```vue
<UNavigationMenu
  :items="items"
  :ui="{
    root: 'gap-6',           // Root container
    item: 'px-4 py-2',       // Individual items
    link: 'hover:underline', // Link elements
    icon: 'size-5',          // Icon sizing
    badge: 'ml-2'            // Badge positioning
  }"
/>
```

## Implementation Notes

### Architecture
- **Component Base**: Vue 3 SFC with Composition API
- **Styling**: Tailwind CSS utility classes
- **Icons**: Iconify ecosystem
- **Primitives**: Reka UI headless components
- **Theming**: CSS custom properties with color mode

### Performance Considerations
- Icon auto-loading may add bundle size
- `unmountOnHide: true` (default) improves performance
- Large nested menus may impact initial render
- Consider lazy-loading submenu content for large apps

### Design System Integration
- Part of Nuxt UI comprehensive component library
- Consistent API patterns across components
- Shared theming system via app config
- Unified color and variant naming

### Layout Strategy
- Horizontal: Uses popover/floating UI positioning
- Vertical: Uses accordion/collapsible pattern
- Groups: Automatic spacing/separation
- Collapsed: Icon-only with optional tooltips

### State Management Strategy
- `active` prop for current page indication
- `defaultOpen` for initial accordion state
- `open` for controlled accordion state
- `collapsed` for icon-only mode

### Best Practices
1. **Use semantic colors**: Match highlight color to brand
2. **Provide icons in collapsed mode**: Required for icon-only sidebar
3. **Add tooltips for collapsed items**: Improve UX in icon-only mode
4. **Keep submenu depth shallow**: Maximum 1-2 levels for usability
5. **Use descriptions wisely**: Provide context in horizontal submenus
6. **Mark active items**: Always indicate current location
7. **Group related items**: Use grouping for logical organization
8. **Consider mobile**: Plan responsive strategy early
9. **Test keyboard navigation**: Ensure full keyboard accessibility
10. **Optimize icons**: Use appropriate icon sets, avoid large collections

### Common Patterns

**App Navigation Bar:**
```vue
<nav class="border-b">
  <div class="container flex items-center justify-between h-16">
    <Logo />
    <UNavigationMenu highlight :items="navItems" />
    <UserMenu />
  </div>
</nav>
```

**Documentation Sidebar:**
```vue
<aside class="w-64 border-r">
  <UNavigationMenu
    orientation="vertical"
    :items="docsItems"
  />
</aside>
```

**Dashboard Collapsible Sidebar:**
```vue
<aside :class="collapsed ? 'w-16' : 'w-64'">
  <UNavigationMenu
    orientation="vertical"
    :collapsed="collapsed"
    :items="dashboardItems"
  />
</aside>
```

## Summary

Nuxt UI's NavigationMenu component provides a comprehensive, production-ready navigation solution with excellent flexibility and developer experience. Key strengths include:

- **Dual Orientation Support**: Single component handles both horizontal nav bars and vertical sidebars
- **Flexible Content**: Icons, badges, avatars, tooltips, and nested submenus
- **Smart Submenu Handling**: Popovers for horizontal, accordions for vertical
- **Collapsible Mode**: Icon-only sidebar with tooltip support
- **Active State Management**: Highlight borders, animated arrows, and clear indication
- **Grouping Support**: Visual separation with nested arrays
- **Rich Customization**: Slot-level styling via `ui` prop, Tailwind utilities
- **Accessibility**: Built on Reka UI primitives with full keyboard support
- **Framework Integration**: Native Vue 3, Nuxt Router integration, Iconify icons
- **Theming**: Color mode aware, global app config, CSS custom properties
- **Type Safety**: TypeScript support throughout

**Documentation Quality: Excellent** - Clear API reference, interactive examples, comprehensive prop documentation, and practical code samples.

**Component Maturity: High** - Production-ready with thoughtful API design, accessibility support, and flexible customization options suitable for a wide range of navigation patterns from simple link lists to complex multi-level menu systems.

The component excels at providing a unified API for different navigation patterns while maintaining sensible defaults and extensive customization capabilities.
