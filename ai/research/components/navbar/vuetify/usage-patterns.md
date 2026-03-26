# Vuetify - App Bar Usage Patterns

## Component URL
https://vuetifyjs.com/en/components/app-bars
https://vuetifyjs.com/en/api/v-app-bar
Status: ✅ Working

## Documentation Quality
Good - Comprehensive documentation with practical examples, API reference, and scrolling behavior demonstrations. Documentation includes Material Design integration patterns and responsive behavior guidance. The component is well-documented across multiple resources including official docs, tutorials, and community examples. Some scroll-related props have known issues that are documented in GitHub issues.

## Component Definition
- **Core purpose**: Primary navigation element displayed at the top of the screen, serving as a supercharged toolbar with advanced scrolling techniques and application layout support
- **Mental model**: A Material Design app bar - users think of it as the persistent top navigation header containing branding, navigation links, search, and actions
- **Semantic meaning**: Represents the primary application header and navigation surface, implementing Material Design's top app bar pattern with support for responsive behavior, scrolling interactions, and extensible content areas

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Logo/Brand | ✅ | Via `v-app-bar-title` component or custom content in default slot |
| Navigation links | ✅ | Via `v-tabs` in extension slot or buttons/links in main slot |
| Actions/Buttons | ✅ | Via `v-btn` components, typically placed in append slot |
| Search | ✅ | Via `v-text-field` or custom search components in extension or default slot |
| User menu | ✅ | Via `v-menu` with avatar/icon button, typically in append slot |
| Icon support | ✅ | Deep integration with Material Design Icons via `v-icon` and `v-app-bar-nav-icon` |
| Media support | ✅ | Background images via `src` prop or image slot, avatars in user menus |
| Custom content | ✅ | Full flexibility - can contain any Vue components via slots |

## Layout Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Fixed position | ✅ | `fixed` prop applies position: fixed to the component |
| Sticky position | ⚠️ | Not built-in, but can be achieved with CSS positioning workarounds |
| Absolute position | ✅ | `absolute` prop for absolute positioning within scroll containers |
| Responsive collapse | ✅ | Hide/show elements based on breakpoints using `d-flex d-sm-none` classes |
| Multi-row layout | ✅ | Extension slot provides additional row below main app bar |
| With navigation drawer | ✅ | Designed to work seamlessly with `v-navigation-drawer` via `app` prop |
| With tabs | ✅ | `v-tabs` commonly placed in extension slot for secondary navigation |
| Mobile menu | ✅ | `v-app-bar-nav-icon` toggles navigation drawer on mobile |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Active/Selected | ✅ | Tab selection state when using `v-tabs` in extension |
| Scroll behavior | ✅ | Multiple scroll-responsive states (elevated, hidden, collapsed, shrunk) |
| Collapsible | ✅ | `collapse-on-scroll` collapses the app bar when scrolling |
| Expandable | ✅ | `prominent` or `extended` props increase height |
| Loading | ❌ | No built-in loading state, but can add custom loading indicators |
| Disabled | ❌ | No disabled state (N/A for navigation components) |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Height options | ✅ | `dense` (48px), default (56px), `short` (56px), `prominent` (128px), `extended`, custom via `height` prop |
| Color themes | ✅ | `color` prop accepts Material color names (primary, success, etc.) or CSS colors |
| Density variations | ✅ | `dense` reduces height, `prominent` increases height, works together (dense+prominent = 96px) |
| Elevation | ✅ | `elevation` prop (0-24), `flat` removes shadow, `outlined` adds border, `elevate-on-scroll` dynamic elevation |
| Alignment | ✅ | Content alignment via slots and Vuetify flex utilities |
| Spacing control | ✅ | Vuetify spacing utilities (`pa-*`, `ma-*`) for internal spacing |
| Border styles | ✅ | `outlined` prop, `rounded` and `tile` props control border-radius |
| Background styles | ✅ | `src` prop for background images, `fade-img-on-scroll` for image fade effect |
| Theme variants | ✅ | `dark` and `light` props for theme variations |

## Code Examples

### Basic App Bar with Navigation
```vue
<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>My Application</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="Profile"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
</script>
```

### App Bar with Tabs and Search in Extension
```vue
<template>
  <v-app>
    <v-app-bar app color="deep-purple" dark extended>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Company Name</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tab value="one">Overview</v-tab>
          <v-tab value="two">Products</v-tab>
          <v-tab value="three">About</v-tab>
          <v-tab value="four">Contact</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Settings"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-window v-model="tab">
          <v-window-item value="one">Overview Content</v-window-item>
          <v-window-item value="two">Products Content</v-window-item>
          <v-window-item value="three">About Content</v-window-item>
          <v-window-item value="four">Contact Content</v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
const tab = ref('one');
</script>
```

### Responsive App Bar (Mobile/Desktop)
```vue
<template>
  <v-app>
    <v-app-bar app color="blue-darken-2" dark>
      <v-app-bar-nav-icon
        class="d-flex d-sm-none"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-app-bar-title>Responsive Nav</v-app-bar-title>

      <!-- Desktop Navigation -->
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <div class="d-none d-sm-flex">
        <v-btn>Home</v-btn>
        <v-btn>Products</v-btn>
        <v-btn>About</v-btn>
        <v-btn>Contact</v-btn>
      </div>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
    >
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>
        <v-list-item prepend-icon="mdi-shopping" title="Products"></v-list-item>
        <v-list-item prepend-icon="mdi-information" title="About"></v-list-item>
        <v-list-item prepend-icon="mdi-email" title="Contact"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <p>Resize window to see responsive behavior</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
</script>
```

### Hide on Scroll App Bar
```vue
<template>
  <v-app>
    <v-app-bar
      app
      color="teal"
      dark
      hide-on-scroll
    >
      <v-app-bar-title>Hide on Scroll</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-for="i in 50" :key="i" class="pa-4">
          Item {{ i }} - Scroll down to hide the app bar
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### Elevate on Scroll App Bar
```vue
<template>
  <v-app>
    <v-app-bar
      app
      color="white"
      elevate-on-scroll
    >
      <v-app-bar-title>Elevate on Scroll</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-for="i in 50" :key="i" class="pa-4">
          Item {{ i }} - Scroll to see elevation appear
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### Collapse on Scroll with Prominent
```vue
<template>
  <v-app>
    <v-app-bar
      app
      color="indigo"
      dark
      prominent
      collapse-on-scroll
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>Collapse on Scroll</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-for="i in 50" :key="i" class="pa-4">
          Item {{ i }} - Scroll to collapse the prominent app bar
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### Shrink on Scroll App Bar
```vue
<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      prominent
      shrink-on-scroll
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>Shrink on Scroll</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-for="i in 50" :key="i" class="pa-4">
          Item {{ i }} - Scroll to shrink the app bar from prominent to dense
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### App Bar with Background Image and Fade
```vue
<template>
  <v-app>
    <v-app-bar
      app
      color="rgba(0, 0, 0, 0)"
      dark
      prominent
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>Image Background</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-for="i in 50" :key="i" class="pa-4">
          Item {{ i }} - Scroll to fade the background image
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### Dense App Bar with Actions
```vue
<template>
  <v-app>
    <v-app-bar app color="grey-darken-3" dark dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>Dense App Bar</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon size="small">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon size="small">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon size="small">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <p>Compact app bar with reduced height (48px)</p>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### App Bar with Scroll Target and Absolute Position
```vue
<template>
  <v-app>
    <v-app-bar
      absolute
      color="pink"
      dark
      hide-on-scroll
      prominent
      scroll-target="#scrolling-content"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>Scroll Target Example</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-sheet
        id="scrolling-content"
        class="overflow-y-auto"
        max-height="600"
      >
        <v-container style="height: 1500px;">
          <div v-for="i in 50" :key="i" class="pa-4">
            Item {{ i }} - Scroll this container to hide app bar
          </div>
        </v-container>
      </v-sheet>
    </v-main>
  </v-app>
</template>
```

### App Bar with User Menu and Search
```vue
<template>
  <v-app>
    <v-app-bar app color="blue-grey-darken-3" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>My App</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-text-field
        hide-details
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        density="compact"
        placeholder="Search..."
        class="mr-4"
        style="max-width: 300px;"
      ></v-text-field>

      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar size="32">
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item prepend-icon="mdi-account" title="Profile"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="Settings"></v-list-item>
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-logout" title="Logout"></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-folder" title="Files"></v-list-item>
        <v-list-item prepend-icon="mdi-chart-bar" title="Analytics"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
</script>
```

### Inverted Scroll App Bar
```vue
<template>
  <v-app>
    <v-app-bar
      app
      color="deep-purple-accent-4"
      dark
      inverted-scroll
      scroll-threshold="200"
    >
      <v-app-bar-title>Inverted Scroll</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-for="i in 50" :key="i" class="pa-4">
          Item {{ i }} - Scroll down to hide, scroll up to show
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
```

## Notable Features

### Core Features
- **Material Design Integration**: Follows Material Design top app bar specifications
- **Vue 3 Composition API**: Full support for modern Vue patterns with Composition API
- **Application Layout System**: Designed to work within `v-app` layout system with automatic sizing
- **Vue Router Integration**: Works seamlessly with vue-router for navigation

### Scrolling Behaviors
- **Elevate on Scroll**: Dynamic elevation (0dp → 4dp) when user scrolls
- **Hide on Scroll**: Automatically hides when scrolling down (extension slot remains visible)
- **Collapse on Scroll**: Collapses to smaller height when scrolling
- **Shrink on Scroll**: Shrinks from prominent to dense/short height
- **Inverted Scroll**: Hides on scroll down, shows on scroll up
- **Fade Image on Scroll**: Background image fades as user scrolls
- **Scroll Threshold**: Configurable pixel threshold before scroll behaviors activate
- **Scroll Target**: Can target specific scroll containers instead of window

### Layout & Positioning
- **Fixed Positioning**: Position: fixed for persistent header
- **Absolute Positioning**: Position: absolute for use within scroll containers
- **Extension Slot**: Additional row below main app bar for tabs, search, or extra content
- **Navigation Drawer Integration**: Seamless coordination with `v-navigation-drawer`
- **Multiple Height Options**: Dense (48px), short (56px), default (64px), prominent (128px), extended, or custom

### Responsive Features
- **Breakpoint Classes**: Vuetify's responsive display classes (`d-flex`, `d-sm-none`, etc.)
- **Mobile Menu Pattern**: `v-app-bar-nav-icon` for mobile navigation drawer toggle
- **Desktop Navigation**: Full navigation links visible on larger screens
- **Responsive Tabs**: Tabs in extension slot with mobile collapse

### Styling Options
- **Color Theming**: Full Material Design color palette support plus custom CSS colors
- **Theme Variants**: Light and dark theme support
- **Elevation Control**: 0-24 elevation levels, flat, or outlined styles
- **Border Radius**: Rounded or tile (no radius) options
- **Background Images**: Full background image support with fade effects
- **Transparency**: Support for transparent/semi-transparent backgrounds

### Content Organization
- **Prepend Slot**: Leading content (nav icon, logo)
- **Default Slot**: Main content area
- **Append Slot**: Trailing content (actions, user menu)
- **Extension Slot**: Additional row below main bar
- **Title Slot**: Dedicated area for app/page title

### Accessibility
- **Semantic HTML**: Proper use of toolbar/header semantics
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Focus Management**: Proper focus handling for navigation
- **Screen Reader Support**: Works with assistive technologies
- **Touch Friendly**: Optimized touch targets for mobile
- **High Contrast**: Respects system high contrast settings

## API Reference

### v-app-bar Props

#### Layout & Positioning
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `app` | boolean | `false` | Positions the app-bar in the application layout system |
| `fixed` | boolean | `false` | Applies position: fixed to the component |
| `absolute` | boolean | `false` | Applies position: absolute to the component |

#### Height & Density
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | string \| number | — | Sets the height for the component |
| `dense` | boolean | `false` | Reduces height to 48px (96px with prominent) |
| `short` | boolean | `false` | Reduces height to 56px (112px with prominent) |
| `prominent` | boolean | `false` | Increases height to 128px |
| `extended` | boolean | `false` | Increases height without using extension slot |

#### Scrolling Behaviors
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevate-on-scroll` | boolean | `false` | Elevates app-bar when scrolling (0dp → 4dp) |
| `hide-on-scroll` | boolean | `false` | Hides app-bar when scrolling (extension slot remains) |
| `collapse-on-scroll` | boolean | `false` | Collapses app-bar when scrolling |
| `shrink-on-scroll` | boolean | `false` | Shrinks prominent toolbar to dense/short when scrolling |
| `inverted-scroll` | boolean | `false` | Hides when scrolling down, shows when scrolling up |
| `fade-img-on-scroll` | boolean | `false` | Fades background image when scrolling |
| `scroll-target` | string | — | Element selector to target for scrolling events |
| `scroll-threshold` | string \| number | `0` | Pixel threshold before scroll behaviors activate |

#### Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | string | — | Material color name (primary, success, etc.) or CSS color |
| `dark` | boolean | `false` | Applies dark theme variant |
| `light` | boolean | `false` | Applies light theme variant |
| `elevation` | string \| number | `0` | Material elevation (0-24) |
| `flat` | boolean | `false` | Removes box-shadow (elevation) |
| `outlined` | boolean | `false` | Removes elevation and adds thin border |
| `rounded` | boolean \| string | `false` | Designates border-radius |
| `tile` | boolean | `false` | Removes border-radius |
| `theme` | string | — | Theme variant to apply |

#### Background
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | — | Specifies v-img as component's background |
| `image` | string | — | Background image (alternative to src) |

#### Dimensions
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | string \| number | — | Sets the width for the component |
| `max-height` | string \| number | — | Sets the maximum height |
| `max-width` | string \| number | — | Sets the maximum width |
| `min-height` | string \| number | — | Sets the minimum height |
| `min-width` | string \| number | — | Sets the minimum width |

#### Other
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | string | `'header'` | HTML tag for root element |
| `name` | string | — | Assigns component name for transitions |

### Events
| Event | Payload | Description |
|-------|---------|-------------|
| `update:model-value` | boolean | Emitted when scroll behavior changes visibility state |

### Slots
| Slot | Description |
|------|-------------|
| `default` | Main content area for title, buttons, and navigation |
| `prepend` | Leading content (typically nav icon or logo) |
| `append` | Trailing content (typically actions or user menu) |
| `extension` | Additional row below main app bar for tabs, search, etc. |
| `title` | Dedicated slot for app bar title |
| `image` | Custom image element (when using src/image prop) |

### Component Structure
```
v-app-bar
├── [prepend slot] (nav icon, logo)
├── [title slot / v-app-bar-title] (app/page title)
├── [default slot] (navigation links, actions)
├── [append slot] (search, notifications, user menu)
└── [extension slot] (tabs, search bar, secondary navigation)
```

## Research Notes

### Framework Integration
- Part of Vuetify 3, a Material Design component framework for Vue 3
- Must be used within `v-app` component for proper layout behavior
- The `app` prop is critical for proper integration with other Vuetify layout components
- Works seamlessly with `v-navigation-drawer`, `v-main`, and other layout components

### Scrolling Behaviors
- Scroll-related props require proper scroll container setup
- Some scroll props have known issues without proper v-sheet configuration
- `scroll-target` can target specific elements by ID selector
- `scroll-threshold` defaults to 0 but can be customized (e.g., 200px)
- Multiple scroll behaviors can be combined (e.g., collapse + elevate)
- Extension slot behavior differs: remains visible with `hide-on-scroll`

### Responsive Patterns
- Use Vuetify's display classes for responsive visibility: `d-flex d-sm-none`, `d-none d-sm-flex`
- Common pattern: hamburger menu on mobile, full navigation on desktop
- `v-app-bar-nav-icon` is the standard mobile menu toggle
- Tabs in extension slot work well for desktop but collapse on mobile
- `useDisplay()` composable provides programmatic breakpoint detection

### Height Management
- Dense + prominent = 96px height
- Short + prominent = 112px height
- Prominent alone = 128px height
- Extension slot adds additional height below main bar
- `shrink-on-scroll` animates from prominent to dense/short

### Styling Best Practices
- Use Material Design color names for consistency: 'primary', 'secondary', 'success', etc.
- Transparent backgrounds work with `color="rgba(0, 0, 0, 0)"` for overlay effects
- Background images need consideration for text contrast
- `elevate-on-scroll` provides subtle depth without permanent elevation
- Flat variant (elevation 0) is modern and clean for minimal designs

### Content Organization
- Prepend slot: Navigation icon, logo
- Title: `v-app-bar-title` component (preferred) or title slot
- Default slot: Navigation links, search, actions
- Append slot: User menu, notifications, settings
- Extension slot: Tabs, extended search, secondary navigation

### Common Patterns
- **Standard App**: Nav icon + title + spacer + actions
- **With Tabs**: Extended height with tabs in extension slot
- **With Search**: Search field in append area or extension slot
- **Responsive**: Desktop links + mobile drawer toggle
- **User Menu**: Avatar with dropdown menu in append slot

### Performance Considerations
- Scroll listeners are efficient but can be disabled if not needed
- Background images can impact performance; consider lazy loading
- Multiple scroll behaviors may compound performance impact
- Fixed positioning performs better than absolute in most cases

### Accessibility Notes
- Uses semantic `<header>` tag by default (configurable via `tag` prop)
- Navigation elements should use proper ARIA labels
- Keyboard navigation works automatically with Vuetify button components
- Focus management handled by Vue and Vuetify
- High contrast and reduced motion preferences respected

### Known Issues & Workarounds
- Scroll behaviors may not work without proper scroll container setup
- GitHub Issue #9034: Various scroll props require v-sheet for proper function
- Sticky positioning not built-in but achievable with CSS workarounds
- Multiple scroll behaviors should be tested together for compatibility

### Version Notes
- Vuetify 3 added prepend/append slots (migration from v2)
- `img` slot renamed to `image` in v3
- `extended` prop added as alternative to extension slot
- Some v2 examples may not work directly in v3

### Integration Recommendations
- Always use within `v-app` component
- Include `app` prop for proper layout behavior
- Coordinate with `v-navigation-drawer` for complete navigation
- Use `v-main` component for proper content area sizing
- Consider using `v-tabs` in extension slot for secondary navigation
