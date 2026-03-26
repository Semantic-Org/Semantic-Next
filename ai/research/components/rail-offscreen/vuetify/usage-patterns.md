# Vuetify Navigation Drawer - Usage Patterns Report

**Framework:** Vuetify (Vue.js)
**Component:** v-navigation-drawer
**Version:** 3.x (Latest) / 2.x (Current LTS)
**Research Date:** 2025-11-05
**Documentation:** https://vuetifyjs.com/en/components/navigation-drawers/

---

## Component Overview

The Vuetify `v-navigation-drawer` component is a **Material Design-compliant side navigation panel** that slides in and out of the viewport. It's a fundamental UI pattern for application navigation, often paired with an app bar (v-app-bar) at the top of the page.

**Primary Purpose:** Provide a sliding navigation panel that houses navigation links, user menus, and other application controls in a space-efficient sidebar pattern.

**Mental Model:** A "drawer" that slides in from the left (or right) edge of the screen, containing navigation structure and controls. It can be permanently visible on desktop, hidden on mobile, or toggled with a button.

**Key Characteristics:**
- Follows Material Design specifications
- Responsive: temporary on mobile, permanent on desktop (by default)
- Supports multiple display modes (temporary, permanent, rail)
- Can include a mini/collapsed state for icon-only display
- Integrates with v-app-bar and v-main for complete layouts
- Supports theme colors, elevation, and custom styling

---

## Basic Usage Patterns

### Minimal Navigation Drawer

```vue
<template>
  <v-app>
    <v-navigation-drawer>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.id"
          :title="item.title"
          :to="item.path"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <!-- Content -->
    </v-app-bar>

    <v-main>
      <!-- Page content -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, title: 'Dashboard', path: '/' },
        { id: 2, title: 'Settings', path: '/settings' },
        { id: 3, title: 'About', path: '/about' }
      ]
    }
  }
}
</script>
```

### Toggle Drawer with Button

```vue
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.id"
          :title="item.title"
          @click="drawer = false"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>My App</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <!-- Content -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [...]
    }
  }
}
</script>
```

---

## Props/API Reference

### Core Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| **v-model** | `Boolean \| null` | `null` | Controls drawer visibility; `null` = responsive (open on desktop, closed on mobile) |
| **temporary** | `Boolean` | `false` | Drawer overlays content and closes on click outside (mobile mode) |
| **permanent** | `Boolean` | `false` | Drawer is always visible and doesn't overlay content (desktop mode) |
| **rail** | `Boolean` | `false` | Drawer is in rail/icon-only mode (narrow width) |
| **expand-on-hover** | `Boolean` | `false` | Rail expands to full width on hover (requires `rail` prop) |
| **width** | `String \| Number` | `256` | Custom drawer width in pixels or CSS value |
| **rail-width** | `Number` | `80` | Width of drawer when in rail mode |
| **location** | `'start' \| 'end'` | `'start'` | Side of screen drawer appears ('start' = left, 'end' = right) |

### Appearance Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| **color** | `String` | `'surface'` | Background color (supports theme colors) |
| **elevation** | `Number \| String` | `1` | Material Design elevation/shadow level |
| **border** | `Boolean \| String` | `undefined` | Add border styling |
| **rounded** | `Boolean \| String` | `undefined` | Border radius value |
| **image** | `String` | `undefined` | Background image URL |
| **theme** | `'light' \| 'dark'` | `undefined` | Override theme for drawer only |

### Behavior Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| **touchless** | `Boolean` | `false` | Disable touch-swipe opening (mobile) |
| **overlay** | `Boolean` | `true` | Show semi-transparent overlay when temporary drawer is open |
| **overlay-opacity** | `Number \| String` | `0.4` | Overlay transparency level |
| **scrim** | `Boolean \| String` | `true` | Show scrim (overlay) when drawer is open (can pass color) |
| **persistent** | `Boolean` | `false` | Drawer stays open but content scrolls beneath (between temporary and permanent) |
| **stateless** | `Boolean` | `false` | Drawer doesn't manage its own state; fully controlled by v-model |

### Animation & Transition Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| **transition** | `String` | `'slide'` | Animation type ('slide', 'fade', custom) |
| **scrollable** | `Boolean` | `true` | Enable scrolling inside drawer when content overflows |

### Mobile/Responsive Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| **mobile-breakpoint** | `Number \| String` | `1264` | Breakpoint pixel value to switch between modes |
| **disable-resize-watcher** | `Boolean` | `false` | Disable automatic responsive behavior |

---

## Slots

### Content Slots

| Slot | Purpose | Usage |
|------|---------|-------|
| **default** | Main drawer content | Primary content area for navigation items |
| **prepend** | Top of drawer (v2 pattern) | Content at top of drawer above main content |
| **append** | Bottom of drawer | Content at bottom of drawer below main content |
| **header** | Header area (v3) | Special area for titles, logos, or close buttons |
| **image** | Background image overlay | Custom image content |

### Scrim/Overlay Slot

| Slot | Purpose |
|------|---------|
| **scrim** | Custom overlay when drawer is open (temporary mode) |

---

## Display Modes

### Mode 1: Temporary (Modal)

**Use Case:** Mobile devices - drawer overlays content and closes on click outside

```vue
<v-navigation-drawer v-model="drawer" temporary>
  <!-- Content slides over the main content -->
</v-navigation-drawer>
```

**Characteristics:**
- Overlay behind drawer (configurable with `scrim` prop)
- Closes when clicking scrim or navigating
- Touch-swipe to close (unless `touchless` enabled)
- Typical on mobile/small screens

### Mode 2: Permanent

**Use Case:** Desktop - drawer is always visible, takes up space

```vue
<v-navigation-drawer permanent>
  <!-- Drawer occupies constant space -->
</v-navigation-drawer>
```

**Characteristics:**
- Never overlays content
- Always visible
- Main content shifts to accommodate drawer
- Content below drawer can still scroll
- Typical on desktop/large screens

### Mode 3: Persistent

**Use Case:** Desktop - drawer visible but content scrolls under it

```vue
<v-navigation-drawer persistent>
  <!-- Content scrolls under drawer overlay -->
</v-navigation-drawer>
```

**Characteristics:**
- Mix between temporary and permanent
- Always visible but content can scroll beneath
- Useful for hybrid layouts

### Mode 4: Rail (Icon-Only)

**Use Case:** Compact navigation showing only icons

```vue
<v-navigation-drawer
  v-model="drawer"
  rail
  expand-on-hover
>
  <!-- Content displayed as icons only, expands on hover -->
</v-navigation-drawer>
```

**Characteristics:**
- Narrow width (`rail-width`: default 80px)
- Typically shows only icons
- Can expand on hover with `expand-on-hover` prop
- Can be toggled between rail and full width
- Useful for applications with limited horizontal space

---

## Responsive Patterns

### Responsive Default Behavior

```vue
<v-navigation-drawer v-model="drawer">
  <!-- v-model="null" by default: open on desktop, closed on mobile -->
</v-navigation-drawer>
```

**Behavior:**
- On desktop (> breakpoint): drawer is open and permanent
- On mobile (< breakpoint): drawer is hidden, can be toggled
- `mobile-breakpoint` controls the threshold (default: 1264px)

### Custom Responsive Setup

```vue
<template>
  <v-navigation-drawer
    :temporary="isMobile"
    :permanent="!isMobile"
  >
    <!-- Drawer behavior changes based on breakpoint -->
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm
    }
  }
}
</script>
```

---

## Placement Patterns

### Left Navigation Drawer (Default)

```vue
<v-navigation-drawer location="start">
  <!-- Drawer appears on left side -->
</v-navigation-drawer>
```

### Right Navigation Drawer

```vue
<v-navigation-drawer location="end">
  <!-- Drawer appears on right side -->
</v-navigation-drawer>
```

---

## Size Patterns

### Custom Width

```vue
<v-navigation-drawer :width="300">
  <!-- Drawer is 300px wide -->
</v-navigation-drawer>
```

### Rail Mode with Custom Width

```vue
<v-navigation-drawer rail :rail-width="100">
  <!-- Rail is 100px wide (default is 80) -->
</v-navigation-drawer>
```

### Dynamic Width

```vue
<v-navigation-drawer
  :width="expanded ? 300 : 80"
  :rail="!expanded"
  @click="expanded = !expanded"
>
  <!-- Width changes on click -->
</v-navigation-drawer>
```

---

## Content Patterns

### Simple Navigation List

```vue
<v-navigation-drawer>
  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :prepend-icon="item.icon"
      :to="item.path"
    />
  </v-list>
</v-navigation-drawer>
```

### With Header/Title

```vue
<v-navigation-drawer>
  <v-card-title>My App</v-card-title>
  <v-divider />

  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :prepend-icon="item.icon"
    />
  </v-list>
</v-navigation-drawer>
```

### With User Profile Section

```vue
<v-navigation-drawer>
  <template #prepend>
    <v-list-item
      :title="user.name"
      :subtitle="user.email"
      :prepend-avatar="user.avatar"
    />
    <v-divider />
  </template>

  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :prepend-icon="item.icon"
    />
  </v-list>

  <template #append>
    <v-divider />
    <v-list>
      <v-list-item title="Logout" prepend-icon="mdi-logout" />
    </v-list>
  </template>
</v-navigation-drawer>
```

### With Nested Groups (Collapsible)

```vue
<v-navigation-drawer>
  <v-list>
    <v-list-group value="admin">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          title="Admin"
          prepend-icon="mdi-cog"
        />
      </template>

      <v-list-item
        v-for="item in adminItems"
        :key="item.id"
        :title="item.title"
        :prepend-icon="item.icon"
      />
    </v-list-group>
  </v-list>
</v-navigation-drawer>
```

### With Fixed Header and Footer

```vue
<v-navigation-drawer>
  <v-card class="mx-auto">
    <v-card-title>Navigation</v-card-title>
    <v-card-subtitle>Main Menu</v-card-subtitle>
  </v-card>

  <v-divider />

  <v-list class="flex-grow-1">
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :title="item.title"
    />
  </v-list>

  <v-divider />

  <v-list>
    <v-list-item title="Settings" prepend-icon="mdi-cog" />
    <v-list-item title="Help" prepend-icon="mdi-help-circle" />
  </v-list>
</v-navigation-drawer>
```

---

## Display Modes & States

### Toggle Display

```vue
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <!-- Drawer content -->
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </v-app-bar>

    <v-main>
      <!-- Page content -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null  // Responsive default: open on desktop, closed on mobile
    }
  }
}
</script>
```

### Controlled vs Uncontrolled

```vue
<!-- Controlled: Parent controls state -->
<v-navigation-drawer :v-model="drawerOpen" @update:model-value="handleDrawerChange" />

<!-- Uncontrolled: Drawer manages own state (no v-model) -->
<v-navigation-drawer />
```

### Overlay Control

```vue
<v-navigation-drawer
  temporary
  :scrim="true"
  scrim="rgba(0,0,0,0.6)"
>
  <!-- Custom scrim color -->
</v-navigation-drawer>

<v-navigation-drawer
  temporary
  :scrim="false"
>
  <!-- No overlay behind drawer -->
</v-navigation-drawer>
```

---

## Animation Patterns

### Transition Types

```vue
<!-- Default slide transition -->
<v-navigation-drawer>
  <!-- Slides in from left/right -->
</v-navigation-drawer>

<!-- Fade transition -->
<v-navigation-drawer transition="fade">
  <!-- Fades in -->
</v-navigation-drawer>

<!-- Custom transition -->
<v-navigation-drawer :transition="customTransition">
  <!-- Uses custom Vue transition -->
</v-navigation-drawer>
```

### Expand/Collapse Animation

```vue
<template>
  <v-navigation-drawer
    :width="isExpanded ? 256 : 80"
    :rail="!isExpanded"
    class="transition-all"
  >
    <!-- Smooth width transition between rail and full -->
  </v-navigation-drawer>
</template>

<style scoped>
.transition-all {
  transition: width 0.3s ease-in-out;
}
</style>
```

---

## Mini/Rail Variant

### Basic Rail Mode

```vue
<v-navigation-drawer rail>
  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :prepend-icon="item.icon"
      :title="item.title"
    />
  </v-list>
</v-navigation-drawer>
```

### Rail with Hover Expansion

```vue
<v-navigation-drawer
  rail
  expand-on-hover
>
  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :prepend-icon="item.icon"
      :title="item.title"
    />
  </v-list>
</v-navigation-drawer>
```

**Behavior:**
- When rail is narrow, hovers on any item expands drawer to full width
- Clicking outside collapses back to rail
- Icons remain visible in rail mode
- Text labels appear only when expanded

### Toggle Between Rail and Full

```vue
<template>
  <v-navigation-drawer
    :rail="isCompact"
    :expand-on-hover="isCompact"
  >
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.id"
        :prepend-icon="item.icon"
        :title="item.title"
      />
    </v-list>
  </v-navigation-drawer>

  <v-btn
    icon
    @click="isCompact = !isCompact"
  >
    <v-icon>{{ isCompact ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      isCompact: true
    }
  }
}
</script>
```

---

## Accessibility Patterns

### Semantic Structure

```vue
<v-navigation-drawer>
  <nav>
    <v-list role="navigation">
      <v-list-item
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        role="menuitem"
      />
    </v-list>
  </nav>
</v-navigation-drawer>
```

### ARIA Labels

```vue
<v-navigation-drawer
  aria-label="Main navigation"
  role="navigation"
>
  <v-list
    aria-label="Navigation menu"
    role="menubar"
  >
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      role="menuitem"
      :aria-current="item.isCurrent ? 'page' : undefined"
    />
  </v-list>
</v-navigation-drawer>
```

### Keyboard Navigation

```vue
<template>
  <v-navigation-drawer>
    <v-list
      @keydown.arrow-down="nextItem"
      @keydown.arrow-up="prevItem"
      @keydown.enter="selectItem"
    >
      <v-list-item
        v-for="(item, index) in items"
        :key="item.id"
        :tabindex="focusedIndex === index ? 0 : -1"
        @focus="focusedIndex = index"
        :title="item.title"
      />
    </v-list>
  </v-navigation-drawer>
</template>
```

### Screen Reader Support

```vue
<v-navigation-drawer
  aria-label="Application navigation"
  aria-describedby="nav-description"
>
  <span id="nav-description" class="sr-only">
    Main navigation menu for site sections and pages
  </span>

  <v-list>
    <v-list-item
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :aria-label="`Navigate to ${item.title}`"
    />
  </v-list>
</v-navigation-drawer>
```

### Focus Management

```vue
<template>
  <v-navigation-drawer ref="drawer">
    <v-list ref="list">
      <v-list-item
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :tabindex="currentIndex === item.id ? 0 : -1"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  methods: {
    focusFirstItem() {
      this.$refs.list.$el.querySelector('[tabindex="0"]')?.focus()
    }
  },
  watch: {
    drawer(newVal) {
      if (newVal) {
        this.$nextTick(() => this.focusFirstItem())
      }
    }
  }
}
</script>
```

---

## Integration Patterns

### Complete Application Layout

```vue
<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      expand-on-hover
      permanent
    >
      <v-list-item
        title="My App"
        prepend-avatar="https://..."
      />
      <v-divider />

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.id"
          :title="item.title"
          :prepend-icon="item.icon"
          :to="item.path"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      color="primary"
      dark
      :elevation="4"
    >
      <v-app-bar-nav-icon @click="rail = !rail" />
      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
      <v-spacer />
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item title="Profile" />
          <v-list-item title="Logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      rail: false,
      items: [
        { id: 1, title: 'Dashboard', icon: 'mdi-home', path: '/' },
        { id: 2, title: 'Users', icon: 'mdi-account', path: '/users' },
        { id: 3, title: 'Settings', icon: 'mdi-cog', path: '/settings' }
      ]
    }
  },
  computed: {
    pageTitle() {
      return this.$route.meta.title || 'My App'
    }
  }
}
</script>
```

### With Scrollable Content

```vue
<v-navigation-drawer
  permanent
  scrollable
  overflow="auto"
>
  <v-list>
    <v-list-item
      v-for="item in manyItems"
      :key="item.id"
      :title="item.title"
    />
  </v-list>
</v-navigation-drawer>
```

### Nested Drawer Layout

```vue
<template>
  <v-app>
    <!-- Primary Drawer -->
    <v-navigation-drawer location="start" permanent>
      <v-list>
        <v-list-item
          v-for="item in primaryNav"
          :key="item.id"
          :title="item.title"
          @click="selectedCategory = item.id"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Secondary Drawer (Context-specific) -->
    <v-navigation-drawer location="end" :width="250">
      <v-list>
        <v-list-item
          v-for="item in secondaryNav"
          :key="item.id"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar and Main -->
    <v-app-bar>
      <!-- Toolbar content -->
    </v-app-bar>

    <v-main>
      <!-- Page content -->
    </v-main>
  </v-app>
</template>
```

---

## Advanced Patterns

### Animated Drawer with Router Integration

```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :temporary="isMobile"
      :permanent="!isMobile"
      :transition="drawerTransition"
    >
      <v-list>
        <v-list-item
          v-for="item in routes"
          :key="item.path"
          :title="item.name"
          :prepend-icon="item.icon"
          :active="$route.path === item.path"
          @click="$router.push(item.path)"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
    </v-app-bar>

    <v-main>
      <transition name="page-fade">
        <router-view :key="$route.path" />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      drawerTransition: 'slide-x-transition'
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.xs
    },
    routes() {
      return this.$router.getRoutes().filter(r => !r.meta.hidden)
    }
  }
}
</script>
```

### Drawer with Dynamic Content Loading

```vue
<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    :loading="isLoading"
  >
    <v-progress-linear
      v-if="isLoading"
      indeterminate
    />

    <v-list>
      <v-list-item
        v-for="item in dynamicItems"
        :key="item.id"
        :title="item.title"
        @click="selectItem(item)"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      isLoading: false,
      dynamicItems: []
    }
  },
  watch: {
    drawer(newVal) {
      if (newVal && !this.dynamicItems.length) {
        this.loadItems()
      }
    }
  },
  methods: {
    async loadItems() {
      this.isLoading = true
      try {
        const response = await fetch('/api/nav-items')
        this.dynamicItems = await response.json()
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
```

### Themeable Drawer

```vue
<template>
  <v-navigation-drawer
    :color="drawerColor"
    :theme="isDark ? 'dark' : 'light'"
    :elevation="elevation"
  >
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :active="item.active"
        active-color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    isDark() {
      return this.$vuetify.theme.global.current.dark
    },
    drawerColor() {
      return this.isDark ? 'surface' : 'background'
    },
    elevation() {
      return this.$vuetify.display.lgAndUp ? 4 : 0
    }
  }
}
</script>
```

---

## Notes

### Version Differences (v2 vs v3)

- **v3 (Latest):** Uses `expand-on-hover` instead of `mini-variant`, simpler API, better performance
- **v2:** Uses `mini-variant` and `mini-variant-width` for rail mode, older syntax
- **v3 offers:** Better TypeScript support, composition API ready, improved accessibility

### Common Issues & Solutions

1. **Drawer not responding to v-model**
   - Ensure v-app-bar and v-main are within v-app wrapper
   - Check that mobile-breakpoint matches your design breakpoint

2. **Rail mode text not visible**
   - Use `expand-on-hover` to reveal text on hover
   - Or manually toggle between rail and full width

3. **Overlay too transparent**
   - Adjust `overlay-opacity` or `scrim` prop
   - Higher opacity = darker overlay

4. **Content scrolling inside drawer**
   - Ensure drawer height isn't set to 100vh
   - Let v-app manage the layout structure

5. **Responsive behavior not working**
   - Verify `mobile-breakpoint` matches your needs
   - Check `disable-resize-watcher` isn't enabled

### Best Practices

1. **Use v-model="null"** for responsive default behavior (open on desktop, closed on mobile)
2. **Always wrap with v-app** for proper layout management
3. **Use semantic elements** (nav, role="navigation") for accessibility
4. **Provide meaningful icons** in rail mode for visual clarity
5. **Test on multiple breakpoints** to ensure responsive behavior works
6. **Consider keyboard navigation** when adding custom content
7. **Use aria-labels** for screen reader users
8. **Keep drawer content performant** - lazy load if necessary

### Material Design Compliance

- Follows Material Design 3 guidelines for navigation drawers
- Standard elevation (1) creates subtle depth
- Default width (256px) aligns with MD recommendations
- Rail width (80px) matches icon + padding standards
- Overlay opacity (0.4) provides legible scrim effect
- Slide transitions follow MD motion guidelines
