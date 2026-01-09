# Vuetify - Navigation Drawer Usage Patterns

## Component URL
https://vuetifyjs.com/en/components/navigation-drawers
https://vuetifyjs.com/en/api/v-navigation-drawer
Status: ✅ Working

## Documentation Quality
Good - Comprehensive documentation with practical examples, API reference, and various usage patterns. Documentation includes Material Design integration patterns and responsive behavior. Some examples use older API patterns (v2 vs v3) which may require adjustment.

## Component Definition
- **Core purpose**: Contains internal navigation links for an application, providing a slide-out panel for primary navigation that can be permanently visible or controlled programmatically
- **Mental model**: A Material Design navigation surface - users think of it as a persistent or temporary side panel containing navigation links and app structure
- **Semantic meaning**: Represents the primary navigation structure of an application, implementing Material Design's navigation drawer pattern with responsive behavior for mobile and desktop contexts

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Primary use case - navigation links via v-list and v-list-item components |
| Icon support | ✅ | Deep integration with Material Design Icons via prepend-icon prop on list items |
| Media support | ✅ | Background images via image prop, avatars in list items |
| Custom content | ✅ | Full flexibility - can contain any Vue components via default slot |
| Form integration | ✅ | Can contain any Vuetify form components within the drawer body |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | `v-model` or `:model-value` + `@update:model-value` for external state management |
| Uncontrolled | ✅ | Can omit v-model for permanent drawers or use `null` for responsive behavior |
| Dismissible | ✅ | Temporary variant closes on overlay click and route changes by default |
| Non-dismissible | ✅ | Permanent variant stays visible; can use `disable-route-watcher` to prevent auto-close |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | Controlled via `v-model` boolean or `null` for responsive behavior |
| Loading | ❌ | No built-in loading state, but can add custom loading components |
| Disabled | ❌ | No disabled state (N/A for navigation components) |
| Interactive | ✅ | Contains interactive navigation elements, buttons, lists |
| Rail state | ✅ | Tracked via `rail` prop for collapsed mini-variant mode |
| Mobile state | ✅ | Automatic responsive behavior based on `mobile-breakpoint` |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `width` prop (default 256px), `rail-width` prop (default 56px) for rail mode |
| Placement | ✅ | `location` prop: `left`, `right`, `start` (default), `end`, `top`, `bottom` |
| Backdrop styles | ⚠️ | Scrim/overlay for temporary variant, can hide with `scrim=false` |
| Border control | ✅ | `border` prop controls border display, `floating` removes borders |
| Close button | ❌ | No built-in close button, typically controlled via app bar toggle button |
| Variants | ✅ | Permanent, temporary, rail (mini), expandable, bottom, floating |

## Structural Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Composite structure | ⚠️ | Single component with slots; typically paired with v-list for navigation structure |
| Header section | ✅ | `prepend` slot for top content (user info, branding) |
| Body section | ✅ | Default slot for main navigation content |
| Footer section | ✅ | `append` slot for bottom content (settings, actions) |
| Close button | ❌ | No automatic close button, handled by application layout |

## Animation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Slide transitions | ✅ | Default slide-in animation from placement edge |
| Custom animations | ⚠️ | Uses Vuetify's transition system, limited custom animation options |
| Backdrop animation | ✅ | Fade-in overlay animation for temporary variant |
| Disable animations | ❌ | No explicit prop to disable animations |

## Interaction Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Overlay click | ✅ | Closes temporary drawer by default |
| Keyboard dismiss | ⚠️ | ESC key behavior not explicitly documented |
| Focus trapping | ⚠️ | Implicit in temporary variant, not extensively documented |
| Scroll blocking | ⚠️ | Automatic for temporary overlays, not configurable |
| Touch gestures | ✅ | Swipe to close/open on mobile; `touchless` prop to disable |
| Expand on hover | ✅ | `expand-on-hover` prop for rail mode auto-expansion |
| Focus restoration | ⚠️ | Not explicitly documented |

## Code Examples

### Basic Usage with v-model
```vue
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(true);
const items = [
  { title: 'Home', icon: 'mdi-home', route: '/' },
  { title: 'About', icon: 'mdi-information', route: '/about' },
  { title: 'Contact', icon: 'mdi-email', route: '/contact' }
];
</script>
```

### Responsive Drawer (Desktop Permanent, Mobile Temporary)
```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
    >
      <v-list nav density="compact">
        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Shared" value="shared"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>App</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();
const drawer = ref(null); // null = closed on mobile, open on desktop
</script>
```

### Rail Mode with Expand on Hover
```vue
<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        rail
        expand-on-hover
        permanent
      >
        <!-- User section in prepend slot -->
        <template v-slot:prepend>
          <v-list>
            <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
              subtitle="sandra_a88@gmail.com"
              title="Sandra Adams"
            ></v-list-item>
          </v-list>
        </template>

        <v-divider></v-divider>

        <!-- Main navigation -->
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-folder"
            title="My Files"
            value="myfiles"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account-multiple"
            title="Shared with me"
            value="shared"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-star"
            title="Starred"
            value="starred"
          ></v-list-item>
        </v-list>

        <!-- Settings in append slot -->
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>
              <v-icon>mdi-cog</v-icon>
              <span>Settings</span>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <p>Content goes here</p>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
```

### Bottom Drawer for Mobile
```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      location="bottom"
      temporary
    >
      <v-list>
        <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="Profile"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Settings"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-toolbar-title>Bottom Drawer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>Tap the menu button to open bottom drawer</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
</script>
```

### Floating Drawer with Custom Width
```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      floating
      permanent
      width="280"
      class="elevation-4"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          title="John Doe"
          subtitle="john.doe@example.com"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <p>Floating drawer with custom width</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(true);
const items = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard' },
  { title: 'Photos', icon: 'mdi-image', value: 'photos' },
  { title: 'Videos', icon: 'mdi-video', value: 'videos' },
  { title: 'Settings', icon: 'mdi-cog', value: 'settings' }
];
</script>
```

### Drawer with Background Image
```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      image="https://picsum.photos/1920/1080?random"
    >
      <!-- Semi-transparent overlay for readability -->
      <template v-slot:prepend>
        <div class="pa-4" style="background: rgba(0,0,0,0.6);">
          <div class="text-h6 text-white">My App</div>
          <div class="text-caption text-white">Navigation</div>
        </div>
      </template>

      <v-list dark>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Background Image</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>Drawer with background image</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(true);
const items = [
  { title: 'Home', icon: 'mdi-home' },
  { title: 'About', icon: 'mdi-information' },
  { title: 'Contact', icon: 'mdi-email' }
];
</script>
```

### Multiple Drawers (Left and Right)
```vue
<template>
  <v-app>
    <!-- Left drawer -->
    <v-navigation-drawer
      v-model="leftDrawer"
      location="left"
      permanent
    >
      <v-list>
        <v-list-subheader>Main Navigation</v-list-subheader>
        <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item prepend-icon="mdi-folder" title="Files"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Right drawer -->
    <v-navigation-drawer
      v-model="rightDrawer"
      location="right"
      temporary
    >
      <v-list>
        <v-list-subheader>Actions</v-list-subheader>
        <v-list-item prepend-icon="mdi-bell" title="Notifications"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Settings"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="leftDrawer = !leftDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Multiple Drawers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>App with left and right drawers</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const leftDrawer = ref(true);
const rightDrawer = ref(false);
</script>
```

### Touchless Drawer (Disable Swipe Gestures)
```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      touchless
      temporary
    >
      <v-list>
        <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="Profile"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Touchless Drawer</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>Swipe gestures are disabled. Use button to toggle.</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
</script>
```

## Notable Features
- **Material Design Integration**: Follows Material Design navigation drawer specifications
- **Vue 3 Composition API**: Full support for modern Vue patterns with Composition API
- **Vue Router Integration**: Pre-configured to work with or without vue-router
- **Responsive by Default**: Automatic mobile/desktop behavior with configurable breakpoints
- **Rail Mode**: Compact mini-variant that expands on hover (like Gmail's sidebar)
- **Touch Gesture Support**: Swipe to open/close on mobile with configurable disable
- **Flexible Positioning**: Six placement options including bottom drawer for mobile
- **Slot-Based Structure**: prepend, default, and append slots for flexible content organization
- **Multiple Instances**: Support for multiple simultaneous drawers (left + right)
- **Background Images**: Built-in support for image backgrounds
- **Floating Variant**: Detached drawer style without borders
- **State Management Integration**: Works seamlessly with Vuex, Pinia, or local state
- **Automatic State**: Using `null` as v-model provides responsive open/closed behavior
- **Route Awareness**: Automatic close on navigation for temporary drawers
- **Resize Awareness**: Automatic responsive behavior based on screen size changes
- **Custom Width**: Configurable width for both normal and rail modes
- **Border Control**: Optional borders for different visual styles
- **App Integration**: Designed to work within v-app layout system
- **Scrim/Overlay**: Configurable backdrop for temporary drawers

## API Reference

### v-navigation-drawer Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model-value` / `v-model` | boolean \| null | `null` | Controls drawer visibility. `null` = responsive (closed mobile, open desktop) |
| `location` | string | `'start'` | Drawer position: `left`, `right`, `start`, `end`, `top`, `bottom` |
| `width` | string \| number | `256` | Width of drawer in pixels or CSS value |
| `rail` | boolean | `false` | Mini-variant collapsed mode (default 56px width) |
| `rail-width` | string \| number | `56` | Width when in rail mode |
| `permanent` | boolean | `false` | Drawer always visible, no overlay |
| `temporary` | boolean | `false` | Drawer overlays content with scrim/backdrop |
| `floating` | boolean | `false` | Removes border, detaches drawer visually |
| `expand-on-hover` | boolean | `false` | Expands rail drawer on hover |
| `mobile-breakpoint` | string \| number | `'md'` | Breakpoint for mobile behavior: `xs`, `sm`, `md`, `lg`, `xl`, or number |
| `touchless` | boolean | `false` | Disables touch swipe gestures |
| `disable-resize-watcher` | boolean | `false` | Disables automatic resize responsiveness |
| `disable-route-watcher` | boolean | `false` | Prevents auto-close on route navigation |
| `scrim` | boolean \| string | `true` | Shows overlay backdrop (temporary only); string value sets color |
| `image` | string | — | Background image URL |
| `color` | string | — | Background color (theme color or CSS) |
| `border` | boolean \| string | `false` | Show border; string sets border style |
| `elevation` | string \| number | `0` | Material elevation (0-24) |
| `theme` | string | — | Theme variant to apply |
| `tag` | string | `'nav'` | HTML tag for root element |

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| `update:model-value` | boolean | Emitted when drawer open/close state changes |
| `update:rail` | boolean | Emitted when rail state changes |

### Slots
| Slot | Description |
|------|-------------|
| `default` | Main content area for navigation items |
| `prepend` | Content at the top of the drawer (branding, user info) |
| `append` | Content at the bottom of the drawer (settings, logout) |
| `image` | Custom image element (replaces default v-img when using image prop) |

### Component Structure
```
v-navigation-drawer
├── [prepend slot] (optional header content)
├── [default slot] (main navigation content)
└── [append slot] (optional footer content)
```

## Accessibility Features
- **Semantic HTML**: Uses `<nav>` tag by default for proper semantics
- **Keyboard Navigation**: Full keyboard support for navigation items
- **Focus Management**: Implicit focus handling for temporary drawers
- **Screen Reader Support**: Works with v-list accessibility features
- **Touch Friendly**: Touch gesture support with configurable sensitivity
- **High Contrast**: Respects system high contrast settings
- **Reduced Motion**: Compatible with prefers-reduced-motion
- **ARIA Attributes**: Proper ARIA roles inherited from semantic HTML

## Research Notes
- Part of Vuetify 3, a Material Design component framework for Vue 3
- Documentation uses both Options API and Composition API examples
- Material Design principles guide default behaviors and visual design
- The `null` v-model pattern is unique - provides responsive behavior automatically
- Rail mode (mini-variant) is particularly useful for desktop applications
- Bottom drawer variant specifically designed for mobile navigation patterns
- Touch gestures can conflict with horizontal scrolling if not carefully managed
- Permanent + floating combination creates a detached sidebar effect
- The app layout system (v-app, v-main) is crucial for proper drawer integration
- Multiple drawers require careful state management to avoid conflicts
- Expand-on-hover works best with rail mode for desktop experiences
- Background images need overlay considerations for text readability
- Border and floating props interact to create different visual styles
- Resize and route watchers provide automatic responsive behavior but can be disabled
- Scrim color customization allows brand-specific overlay colors
- Image slot allows full customization of background rendering
- The component integrates deeply with Vuetify's theming system
- Elevation prop follows Material Design elevation guidelines (0-24)
- Mobile breakpoint can be customized for different responsive strategies
- Touchless prop is essential for drawers within scrollable containers
- Vue Router integration is automatic but can be disabled with disable-route-watcher
- The component is SSR-compatible for Nuxt.js applications
- Prepend/append slots create semantic structure for drawer organization
- Width prop accepts both pixel values and CSS units (%, vw, etc)
