# Nuxt UI Icon - Usage Patterns

**Research Date**: 2025-11-05
**Framework**: Nuxt UI
**Component**: UIcon
**URL**: https://ui.nuxt.com/docs/components/icon

---

## Component Overview

The UIcon component in Nuxt UI is a flexible icon display element that renders icons from Iconify (a comprehensive icon collection service) or custom Vue components. It serves as a unified interface for displaying icons throughout applications with customizable sizing, rendering modes, and transformation capabilities.

**Core Philosophy**: Iconify-first approach with fallback support for custom Vue components, enabling developers to choose from thousands of curated icons or provide their own SVG implementations.

**Key Characteristics**:
- Supports both string-based icon identifiers and Vue component definitions
- Offers flexible rendering modes (SVG, CSS)
- Provides customization through transform callbacks
- Lightweight and composable with other Nuxt UI components
- Vue 3 composition API compatible

---

## Basic Usage

### String-Based Iconify Icons

The most common usage pattern, leveraging the extensive Iconify icon collection:

```vue
<template>
  <div>
    <!-- Simple icon display -->
    <UIcon name="i-lucide-lightbulb" />

    <!-- With sizing -->
    <UIcon name="i-lucide-lightbulb" class="size-5" />

    <!-- Various icon collections -->
    <UIcon name="i-heroicons-solid-check-circle" />
    <UIcon name="i-mdi-github" />
    <UIcon name="i-tabler-bell" />
    <UIcon name="i-simple-icons-vue" />
  </div>
</template>
```

**Icon Naming Convention**:
- Prefix: Collection identifier (e.g., `i-lucide`, `i-heroicons`, `i-mdi`, `i-tabler`)
- Middle: Category/group (e.g., `solid`, `outline`)
- Suffix: Icon name (e.g., `lightbulb`, `check-circle`, `github`)

**Popular Icon Collections**:
- **Lucide**: Modern, consistently designed icons (`i-lucide-*`)
- **Heroicons**: Designed by Tailwind Labs (`i-heroicons-solid-*`, `i-heroicons-outline-*`)
- **Material Design Icons**: Google's icon library (`i-mdi-*`)
- **Tabler**: Open-source icon set (`i-tabler-*`)
- **Simple Icons**: Brand logos (`i-simple-icons-*`)
- **Font Awesome**: Comprehensive icon library (`i-fa6-*`)

---

### Vue Component Icons

For custom SVG icons or pre-imported icon components:

```vue
<script setup lang="ts">
import { h } from 'vue'

// Define custom SVG icon as Vue component
const IconLightbulb = () => h(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
  [
    h('path', {
      d: 'M15 14c.2-1 .7-1.7 1.5-2.5a6 6 0 1 0-8 0c.8.8 1.3 1.5 1.5 2.5M12 17v4M9 21h6'
    })
  ]
)

// Or import from icon library
import { Check } from 'lucide-vue-next'
import MdiGithub from '~icons/mdi/github'
</script>

<template>
  <!-- Pass Vue component to name prop -->
  <UIcon :name="IconLightbulb" class="size-6" />

  <!-- Using imported icon components -->
  <UIcon :name="Check" class="size-5" />
  <UIcon :name="MdiGithub" class="size-4" />

  <!-- Inline SVG component -->
  <UIcon :name="() => h('svg', { ... })" />
</template>
```

---

## Props/API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string \| object` | - | **Required**. Icon identifier (Iconify string) or Vue component |
| `mode` | `'svg' \| 'css'` | `'svg'` | Rendering method for Iconify icons |
| `size` | `string \| number` | - | Icon dimension (CSS size property value) |

### Extended Attributes

Since UIcon is a Vue component, it accepts standard HTML attributes:

```vue
<!-- Class binding -->
<UIcon name="i-lucide-star" class="text-yellow-500 hover:scale-125 transition" />

<!-- Inline styles -->
<UIcon
  name="i-lucide-heart"
  style="color: red; animation: pulse 2s infinite;"
/>

<!-- ARIA and semantic attributes -->
<UIcon
  name="i-lucide-warning"
  role="img"
  aria-label="Warning icon"
/>

<!-- Data attributes -->
<UIcon name="i-lucide-settings" data-testid="settings-icon" />
```

---

## Common Patterns

### Pattern 1: Sized Icon System

Creating a consistent icon sizing system across the application:

```vue
<script setup lang="ts">
interface IconSize {
  name: string
  class: string
  usage: string
}

const iconSizes: IconSize[] = [
  { name: 'xs', class: 'size-3', usage: 'Badges, inline indicators' },
  { name: 'sm', class: 'size-4', usage: 'List items, compact UI' },
  { name: 'md', class: 'size-5', usage: 'Default, buttons' },
  { name: 'lg', class: 'size-6', usage: 'Headers, featured icons' },
  { name: 'xl', class: 'size-8', usage: 'Hero sections, large UI' },
]
</script>

<template>
  <div class="space-y-4">
    <div v-for="size in iconSizes" :key="size.name" class="flex items-center gap-4">
      <UIcon name="i-lucide-star" :class="size.class" />
      <span>{{ size.name }} - {{ size.usage }}</span>
    </div>
  </div>
</template>
```

### Pattern 2: Icon Buttons

Combining icons with button functionality:

```vue
<template>
  <div class="flex gap-2">
    <!-- Icon-only button -->
    <UButton
      color="gray"
      variant="ghost"
      size="sm"
      icon="i-lucide-settings"
      aria-label="Settings"
    />

    <!-- Icon with text button -->
    <UButton
      icon="i-lucide-download"
      trailing
      size="md"
    >
      Download
    </UButton>

    <!-- Icon button group -->
    <div class="flex border rounded-lg divide-x">
      <UButton
        color="gray"
        variant="ghost"
        icon="i-lucide-bold"
        aria-label="Bold"
      />
      <UButton
        color="gray"
        variant="ghost"
        icon="i-lucide-italic"
        aria-label="Italic"
      />
      <UButton
        color="gray"
        variant="ghost"
        icon="i-lucide-underline"
        aria-label="Underline"
      />
    </div>
  </div>
</template>
```

### Pattern 3: Status/State Icons

Using icons to convey status, with semantic color coding:

```vue
<script setup lang="ts">
interface StatusConfig {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending'
  icon: string
  color: string
  label: string
}

const statuses: StatusConfig[] = [
  {
    status: 'success',
    icon: 'i-lucide-check-circle',
    color: 'text-green-600',
    label: 'Completed'
  },
  {
    status: 'error',
    icon: 'i-lucide-x-circle',
    color: 'text-red-600',
    label: 'Failed'
  },
  {
    status: 'warning',
    icon: 'i-lucide-alert-circle',
    color: 'text-amber-600',
    label: 'Warning'
  },
  {
    status: 'info',
    icon: 'i-lucide-info',
    color: 'text-blue-600',
    label: 'Information'
  },
  {
    status: 'pending',
    icon: 'i-lucide-loader-2',
    color: 'text-gray-600 animate-spin',
    label: 'Processing'
  },
]
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="config in statuses"
      :key="config.status"
      class="flex items-center gap-3"
    >
      <UIcon
        :name="config.icon"
        :class="[config.color, 'size-5']"
      />
      <span class="text-sm">{{ config.label }}</span>
    </div>
  </div>
</template>
```

### Pattern 4: Navigation with Icons

Using icons in navigation menus and breadcrumbs:

```vue
<script setup lang="ts">
interface NavItem {
  icon: string
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: 'i-lucide-home', label: 'Home', href: '/' },
  { icon: 'i-lucide-inbox', label: 'Inbox', href: '/inbox' },
  { icon: 'i-lucide-bookmark', label: 'Saved', href: '/saved' },
  { icon: 'i-lucide-users', label: 'Team', href: '/team' },
  { icon: 'i-lucide-settings', label: 'Settings', href: '/settings' },
]
</script>

<template>
  <!-- Sidebar navigation -->
  <nav class="flex flex-col gap-2">
    <NuxtLink
      v-for="item in navItems"
      :key="item.label"
      :to="item.href"
      class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
    >
      <UIcon :name="item.icon" class="size-5 flex-shrink-0" />
      <span class="text-sm font-medium">{{ item.label }}</span>
    </NuxtLink>
  </nav>

  <!-- Breadcrumb navigation -->
  <div class="flex items-center gap-2 text-sm">
    <UIcon name="i-lucide-home" class="size-4" />
    <span>/</span>
    <span>Products</span>
    <span>/</span>
    <span class="text-gray-500">Electronics</span>
  </div>
</template>
```

### Pattern 5: Icon + Text Combinations

Pairing icons with text for enhanced visual communication:

```vue
<script setup lang="ts">
interface AlertConfig {
  type: 'success' | 'error' | 'warning' | 'info'
  icon: string
  title: string
  message: string
  backgroundColor: string
  borderColor: string
}

const alerts: AlertConfig[] = [
  {
    type: 'success',
    icon: 'i-lucide-check-circle',
    title: 'Success',
    message: 'Your changes have been saved',
    backgroundColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    type: 'error',
    icon: 'i-lucide-x-circle',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    backgroundColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
]
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="alert in alerts"
      :key="alert.type"
      :class="[alert.backgroundColor, alert.borderColor]"
      class="flex gap-4 rounded-lg border p-4"
    >
      <UIcon :name="alert.icon" class="size-5 flex-shrink-0 mt-0.5" />
      <div>
        <h3 class="font-semibold">{{ alert.title }}</h3>
        <p class="text-sm text-gray-600">{{ alert.message }}</p>
      </div>
    </div>
  </div>
</template>
```

### Pattern 6: Animated Icons

Creating dynamic icon animations for visual feedback:

```vue
<template>
  <div class="space-y-4">
    <!-- Loading spinner -->
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
      <span>Loading...</span>
    </div>

    <!-- Bouncing icon -->
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-arrow-down" class="size-5 animate-bounce" />
      <span>Scroll down</span>
    </div>

    <!-- Pulsing icon -->
    <div class="flex items-center gap-2">
      <div class="relative">
        <UIcon name="i-lucide-bell" class="size-5" />
        <div class="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 animate-pulse" />
      </div>
      <span>Notifications</span>
    </div>

    <!-- Custom animation with hover -->
    <div class="flex items-center gap-2 group">
      <UIcon
        name="i-lucide-heart"
        class="size-5 text-gray-400 group-hover:text-red-500 group-hover:scale-125 transition-all duration-300"
      />
      <span class="group-hover:text-red-500 transition-colors">Like</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
}

.animate-wiggle {
  animation: wiggle 0.2s ease-in-out infinite;
}
</style>
```

### Pattern 7: Conditional Icon Display

Rendering different icons based on application state:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const sortOrder = ref<'asc' | 'desc'>('asc')
const isLoading = ref(false)
const hasNotifications = ref(true)

const sortIcon = computed(() =>
  sortOrder.value === 'asc'
    ? 'i-lucide-arrow-up'
    : 'i-lucide-arrow-down'
)

const connectionIcon = computed(() => ({
  name: isLoading.value
    ? 'i-lucide-loader-2'
    : 'i-lucide-wifi',
  class: [
    'size-4',
    isLoading.value && 'animate-spin',
    !isLoading.value && 'text-green-600',
  ]
}))
</script>

<template>
  <!-- Sort toggle -->
  <button
    @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
    class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
  >
    <UIcon :name="sortIcon" class="size-4" />
    <span>Sort</span>
  </button>

  <!-- Conditional network status -->
  <div class="flex items-center gap-2">
    <UIcon
      :name="connectionIcon.name"
      :class="connectionIcon.class"
    />
    <span class="text-sm">
      {{ isLoading ? 'Connecting...' : 'Connected' }}
    </span>
  </div>

  <!-- Conditional notification badge -->
  <div class="relative">
    <UIcon name="i-lucide-bell" class="size-5" />
    <span
      v-if="hasNotifications"
      class="absolute -top-2 -right-2 size-2 rounded-full bg-red-600"
    />
  </div>
</template>
```

### Pattern 8: Custom Icon Transformation

Using the `customize` prop (mentioned in API) to transform icon content:

```vue
<script setup lang="ts">
// Note: customize prop documentation is limited
// This pattern shows potential usage based on API surface

const customizeIcon = (content: string) => {
  // Could modify SVG content (stroke-width, colors, etc.)
  return content
    .replace(/stroke="currentColor"/g, 'stroke="#3b82f6"')
    .replace(/fill="none"/g, 'fill="#eff6ff"')
}
</script>

<template>
  <!-- Using custom Vue component with internal transformation -->
  <UIcon
    :name="() => h('svg', {
      class: 'size-5 text-blue-500',
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10', fill: 'currentColor', opacity: '0.1' }),
      h('circle', { cx: '12', cy: '12', r: '6', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' })
    ])"
  />
</template>
```

---

## Visual Variations

### Icon Collections

Nuxt UI supports multiple icon collections through Iconify:

```vue
<template>
  <div class="grid grid-cols-4 gap-4">
    <!-- Lucide icons (modern, 24x24 grid) -->
    <div class="flex flex-col items-center gap-2">
      <UIcon name="i-lucide-heart" class="size-6" />
      <span class="text-xs">Lucide</span>
    </div>

    <!-- Heroicons (Tailwind's icons, solid/outline) -->
    <div class="flex flex-col items-center gap-2">
      <UIcon name="i-heroicons-solid-heart" class="size-6" />
      <span class="text-xs">Heroicons Solid</span>
    </div>

    <!-- Material Design (Google's icons) -->
    <div class="flex flex-col items-center gap-2">
      <UIcon name="i-mdi-heart" class="size-6" />
      <span class="text-xs">Material Design</span>
    </div>

    <!-- Tabler (Open-source, consistent) -->
    <div class="flex flex-col items-center gap-2">
      <UIcon name="i-tabler-heart" class="size-6" />
      <span class="text-xs">Tabler</span>
    </div>

    <!-- Simple Icons (Brand logos) -->
    <div class="flex flex-col items-center gap-2">
      <UIcon name="i-simple-icons-github" class="size-6" />
      <span class="text-xs">Simple Icons</span>
    </div>

    <!-- Font Awesome -->
    <div class="flex flex-col items-center gap-2">
      <UIcon name="i-fa6-solid-heart" class="size-6" />
      <span class="text-xs">Font Awesome</span>
    </div>
  </div>
</template>
```

### Style Variations

```vue
<template>
  <!-- Solid icon -->
  <UIcon name="i-heroicons-solid-check-circle" class="size-5 text-green-600" />

  <!-- Outline icon -->
  <UIcon name="i-heroicons-outline-check-circle" class="size-5 text-green-600" />

  <!-- Different colors -->
  <div class="flex gap-4">
    <UIcon name="i-lucide-star" class="size-5 text-yellow-500" />
    <UIcon name="i-lucide-star" class="size-5 text-blue-500" />
    <UIcon name="i-lucide-star" class="size-5 text-red-500" />
    <UIcon name="i-lucide-star" class="size-5 text-green-500" />
  </div>

  <!-- Opacity variations -->
  <div class="flex gap-4">
    <UIcon name="i-lucide-star" class="size-5 opacity-25" />
    <UIcon name="i-lucide-star" class="size-5 opacity-50" />
    <UIcon name="i-lucide-star" class="size-5 opacity-75" />
    <UIcon name="i-lucide-star" class="size-5 opacity-100" />
  </div>

  <!-- Inverted colors (dark on light, light on dark) -->
  <div class="flex gap-4">
    <div class="bg-gray-900 p-2 rounded">
      <UIcon name="i-lucide-star" class="size-5 text-white" />
    </div>
    <div class="bg-gray-100 p-2 rounded">
      <UIcon name="i-lucide-star" class="size-5 text-gray-900" />
    </div>
  </div>
</template>
```

---

## Size Patterns

### Fixed Sizes

```vue
<template>
  <div class="space-y-4">
    <!-- Extra small (3 = 12px) -->
    <UIcon name="i-lucide-star" class="size-3" />

    <!-- Small (4 = 16px) -->
    <UIcon name="i-lucide-star" class="size-4" />

    <!-- Medium (5 = 20px) - common default -->
    <UIcon name="i-lucide-star" class="size-5" />

    <!-- Large (6 = 24px) -->
    <UIcon name="i-lucide-star" class="size-6" />

    <!-- Extra large (8 = 32px) -->
    <UIcon name="i-lucide-star" class="size-8" />

    <!-- Hero size (10 = 40px, 12 = 48px) -->
    <UIcon name="i-lucide-star" class="size-10" />
    <UIcon name="i-lucide-star" class="size-12" />

    <!-- Custom size via style -->
    <UIcon name="i-lucide-star" style="width: 2.5rem; height: 2.5rem;" />
  </div>
</template>
```

### Responsive Sizes

```vue
<template>
  <!-- Icon size changes at breakpoints -->
  <div class="flex items-center gap-4">
    <!-- Mobile: size-4, Tablet+: size-5, Desktop+: size-6 -->
    <UIcon
      name="i-lucide-star"
      class="size-4 sm:size-5 lg:size-6"
    />

    <!-- Responsive in context -->
    <div class="text-sm sm:text-base lg:text-lg">
      <!-- Icon scales with text size -->
      <UIcon
        name="i-lucide-arrow-right"
        class="inline size-4 sm:size-5 lg:size-6"
      />
    </div>
  </div>
</template>
```

### Dynamic Sizing

```vue
<script setup lang="ts">
import { computed } from 'vue'

const sizes = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
}

interface IconWithSize {
  name: string
  size: keyof typeof sizes
}

const icons: IconWithSize[] = [
  { name: 'i-lucide-home', size: 'md' },
  { name: 'i-lucide-settings', size: 'lg' },
  { name: 'i-lucide-bell', size: 'sm' },
]
</script>

<template>
  <div class="flex gap-4">
    <div v-for="icon in icons" :key="icon.name">
      <UIcon
        :name="icon.name"
        :class="sizes[icon.size]"
      />
    </div>
  </div>
</template>
```

---

## Color/Theming

### Using Tailwind Color Classes

```vue
<template>
  <div class="space-y-4">
    <!-- Base colors -->
    <div class="flex gap-4">
      <UIcon name="i-lucide-star" class="size-5 text-gray-600" />
      <UIcon name="i-lucide-star" class="size-5 text-blue-600" />
      <UIcon name="i-lucide-star" class="size-5 text-green-600" />
      <UIcon name="i-lucide-star" class="size-5 text-red-600" />
      <UIcon name="i-lucide-star" class="size-5 text-yellow-600" />
    </div>

    <!-- Semantic colors -->
    <div class="flex gap-4">
      <UIcon name="i-lucide-check" class="size-5 text-success" />
      <UIcon name="i-lucide-alert-circle" class="size-5 text-warning" />
      <UIcon name="i-lucide-x-circle" class="size-5 text-error" />
      <UIcon name="i-lucide-info" class="size-5 text-info" />
    </div>

    <!-- Color shades -->
    <div class="flex gap-2">
      <UIcon name="i-lucide-star" class="size-5 text-blue-300" />
      <UIcon name="i-lucide-star" class="size-5 text-blue-500" />
      <UIcon name="i-lucide-star" class="size-5 text-blue-700" />
      <UIcon name="i-lucide-star" class="size-5 text-blue-900" />
    </div>

    <!-- Dark mode -->
    <div class="flex gap-4 dark:bg-gray-900 p-4 rounded">
      <UIcon name="i-lucide-star" class="size-5 dark:text-yellow-400" />
      <UIcon name="i-lucide-moon" class="size-5 dark:text-blue-300" />
      <UIcon name="i-lucide-sun" class="size-5 dark:text-yellow-300" />
    </div>
  </div>
</template>
```

### CSS Variables for Theming

```vue
<script setup lang="ts">
import { ref } from 'vue'

const theme = ref('light')
</script>

<template>
  <div
    :class="theme"
    class="space-y-4 p-4 rounded"
    :style="{
      '--icon-color': theme === 'light' ? '#000' : '#fff',
      '--icon-hover-color': theme === 'light' ? '#3b82f6' : '#60a5fa',
    }"
  >
    <!-- Icons using CSS variables via currentColor -->
    <div class="flex gap-4">
      <button
        class="text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] transition"
      >
        <UIcon name="i-lucide-home" class="size-5" />
      </button>
      <button
        class="text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] transition"
      >
        <UIcon name="i-lucide-settings" class="size-5" />
      </button>
    </div>

    <button
      @click="theme = theme === 'light' ? 'dark' : 'light'"
      class="px-4 py-2 rounded bg-blue-600 text-white"
    >
      Toggle Theme
    </button>
  </div>
</template>
```

---

## Icon Libraries

### Supported Icon Collections

Nuxt UI's icon system supports any icon collection available through Iconify:

| Collection | Prefix | Usage | Total Icons |
|------------|--------|-------|-------------|
| **Lucide** | `i-lucide-` | Modern, minimalist, 24x24 grid | 800+ |
| **Heroicons** | `i-heroicons-solid-`, `i-heroicons-outline-` | Tailwind Labs, professional | 290+ |
| **Material Design Icons** | `i-mdi-` | Google's icon library, comprehensive | 6,500+ |
| **Tabler** | `i-tabler-` | Open-source, consistent stroke width | 900+ |
| **Font Awesome** | `i-fa6-solid-`, `i-fa6-regular-`, `i-fa6-brands-` | Established, widely recognized | 6,100+ |
| **Simple Icons** | `i-simple-icons-` | Brand logos, company icons | 2,500+ |
| **Bootstrap Icons** | `i-bi-` | Clean, consistent design | 1,800+ |
| **Unicons** | `i-uil-` | Unique style, solid/outline | 4,000+ |

### Installation Setup

Most icon collections are loaded through UnoCSS presets in Nuxt UI:

```js
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    icons: {
      dynamic: true // Enable dynamic icon loading
    }
  },
  modules: [
    '@nuxt/ui',
    'uno'
  ],
  uno: {
    presets: [
      require('@unocss/preset-icons')({
        collections: {
          lucide: () => import('lucide-static').then(i => i.icons),
          mdi: () => import('@mdi/js').then(i => i.default),
          // ... other collections
        }
      })
    ]
  }
})
```

### Collection Discovery

Finding icons from a collection:

```vue
<script setup lang="ts">
// Visit https://icones.js.org/ to browse all available icons
// Search by collection and preview icon names

// Lucide icons: https://lucide.dev/icons
const lucideIcons = [
  'i-lucide-home',
  'i-lucide-settings',
  'i-lucide-user',
  'i-lucide-bell',
]

// Heroicons: https://heroicons.com/
const heroiconsIcons = [
  'i-heroicons-solid-home',
  'i-heroicons-outline-settings',
]

// Material Design: https://materialdesignicons.com/
const mdiIcons = [
  'i-mdi-home',
  'i-mdi-github',
  'i-mdi-google',
]
</script>

<template>
  <!-- Browse at https://icones.js.org/ -->
  <div class="text-sm text-gray-600">
    <p>Search thousands of icons at icones.js.org</p>
  </div>
</template>
```

---

## Custom Icons

### SVG as Vue Component

```vue
<script setup lang="ts">
import { h } from 'vue'

// Define inline SVG
const CustomLogo = () => h(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 100 100',
    width: '100',
    height: '100'
  },
  [
    h('circle', { cx: '50', cy: '50', r: '45', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }),
    h('path', { d: 'M 50 20 L 60 40 L 80 45 L 65 60 L 70 80 L 50 70 L 30 80 L 35 60 L 20 45 L 40 40 Z', fill: 'currentColor' })
  ]
)
</script>

<template>
  <!-- Use custom component -->
  <UIcon :name="CustomLogo" class="size-6 text-blue-600" />
</template>
```

### Imported Custom Components

```vue
<script setup lang="ts">
// Import custom SVG as Vue component (with appropriate loader)
import CustomCheckmark from '~/components/icons/CustomCheckmark.vue'
import BrandLogo from '~/assets/icons/brand-logo.svg?component'

// Or use unplugin-icons for automatic SVG imports
import MdiGithub from '~icons/mdi/github'
import TailerCheck from '~icons/tabler/check'
</script>

<template>
  <div class="flex gap-4">
    <UIcon :name="CustomCheckmark" class="size-5" />
    <UIcon :name="BrandLogo" class="size-8" />
    <UIcon :name="MdiGithub" class="size-5" />
    <UIcon :name="TailerCheck" class="size-5" />
  </div>
</template>
```

### Custom SVG File Component

```vue
<!-- components/icons/CustomCheckmark.vue -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="inline"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
</template>

<style scoped>
svg {
  display: inline-block;
}
</style>
```

### Sprite-Based Icons

```vue
<script setup lang="ts">
// Use SVG sprite with fragment identifier
const spriteIcon = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-checkmark')
  svg.appendChild(use)
  return svg
}
</script>

<template>
  <!-- SVG sprite must be loaded in page -->
  <svg style="display: none;">
    <defs>
      <symbol id="icon-checkmark" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"></polyline>
      </symbol>
    </defs>
  </svg>

  <!-- Use via UIcon -->
  <UIcon :name="spriteIcon" class="size-5" />
</template>
```

---

## Accessibility

### ARIA Labels

```vue
<template>
  <div class="space-y-4">
    <!-- Icon with aria-label for screen readers -->
    <button
      class="px-4 py-2 rounded bg-blue-600 text-white"
      aria-label="Close dialog"
    >
      <UIcon name="i-lucide-x" class="size-5" />
    </button>

    <!-- Icon with aria-hidden (decorative) -->
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-check" class="size-5 text-green-600" aria-hidden="true" />
      <span>Completed</span>
    </div>

    <!-- Icon with role="img" and aria-label -->
    <div
      role="img"
      aria-label="Warning: This action cannot be undone"
      class="flex items-center gap-2 text-red-600"
    >
      <UIcon name="i-lucide-alert-triangle" class="size-5" />
      <span>Warning</span>
    </div>
  </div>
</template>
```

### Context for Icon-Only Controls

```vue
<template>
  <!-- Icon button must have accessible label -->
  <button
    aria-label="Save document"
    title="Save (Ctrl+S)"
    class="p-2 rounded hover:bg-gray-100"
  >
    <UIcon name="i-lucide-save" class="size-5" />
  </button>

  <!-- Or use visually hidden text -->
  <button class="flex items-center gap-2 px-3 py-2 rounded">
    <UIcon name="i-lucide-download" class="size-5" />
    <span class="sr-only">Download file</span>
  </button>

  <!-- Tooltip for additional context -->
  <div class="group relative">
    <UIcon name="i-lucide-help-circle" class="size-5 text-gray-500" />
    <div class="hidden group-hover:block absolute bottom-full left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
      Additional help text
    </div>
  </div>
</template>
```

### Semantic Markup

```vue
<template>
  <!-- Use semantic HTML with icons -->
  <article class="space-y-4">
    <!-- Status indicator -->
    <header class="flex items-center gap-2">
      <UIcon name="i-lucide-check-circle" class="size-5 text-green-600" aria-hidden="true" />
      <h1>Task Completed</h1>
    </header>

    <!-- Navigation with icons -->
    <nav class="flex gap-2">
      <a href="/" class="flex items-center gap-2 px-3 py-2 rounded">
        <UIcon name="i-lucide-home" class="size-5" />
        <span>Home</span>
      </a>
      <a href="/about" class="flex items-center gap-2 px-3 py-2 rounded">
        <UIcon name="i-lucide-info" class="size-5" />
        <span>About</span>
      </a>
    </nav>

    <!-- List with icon bullets -->
    <ul class="space-y-2">
      <li class="flex items-start gap-2">
        <UIcon name="i-lucide-check" class="size-5 mt-0.5 flex-shrink-0 text-green-600" aria-hidden="true" />
        <span>Feature one completed</span>
      </li>
      <li class="flex items-start gap-2">
        <UIcon name="i-lucide-check" class="size-5 mt-0.5 flex-shrink-0 text-green-600" aria-hidden="true" />
        <span>Feature two completed</span>
      </li>
    </ul>
  </article>
</template>
```

---

## Interactive Patterns

### Icon Toggle

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isLiked = ref(false)
const isFavorite = ref(false)
</script>

<template>
  <div class="flex gap-4">
    <!-- Like button toggle -->
    <button
      @click="isLiked = !isLiked"
      class="flex items-center gap-2 px-3 py-2 rounded transition-colors"
      :class="isLiked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'"
    >
      <UIcon
        :name="isLiked ? 'i-lucide-heart' : 'i-lucide-heart-outline'"
        class="size-5"
      />
      <span class="text-sm">{{ isLiked ? 'Liked' : 'Like' }}</span>
    </button>

    <!-- Favorite toggle with animation -->
    <button
      @click="isFavorite = !isFavorite"
      class="relative p-2 rounded transition-transform hover:scale-110"
    >
      <UIcon
        :name="isFavorite ? 'i-lucide-star' : 'i-lucide-star-outline'"
        class="size-5 transition-all"
        :class="[
          isFavorite ? 'text-yellow-500 scale-110' : 'text-gray-400',
          'transition-all duration-200'
        ]"
      />
    </button>
  </div>
</template>
```

### Icon Dropdown Menu

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

interface MenuItem {
  icon: string
  label: string
  action: () => void
}

const menuItems: MenuItem[] = [
  {
    icon: 'i-lucide-edit',
    label: 'Edit',
    action: () => console.log('Edit')
  },
  {
    icon: 'i-lucide-copy',
    label: 'Duplicate',
    action: () => console.log('Duplicate')
  },
  {
    icon: 'i-lucide-trash-2',
    label: 'Delete',
    action: () => console.log('Delete')
  },
]
</script>

<template>
  <div class="relative">
    <!-- Trigger button -->
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded hover:bg-gray-100"
      aria-label="Open menu"
    >
      <UIcon name="i-lucide-more-vertical" class="size-5" />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg bg-white z-50"
    >
      <button
        v-for="item in menuItems"
        :key="item.label"
        @click="() => { item.action(); isOpen = false; }"
        class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
      >
        <UIcon :name="item.icon" class="size-4 flex-shrink-0" />
        <span class="text-sm">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>
```

### Icon Input with Clear

```vue
<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <!-- Search input with icons -->
  <div class="relative">
    <div class="flex items-center gap-2 px-3 py-2 border rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <!-- Leading icon -->
      <UIcon name="i-lucide-search" class="size-4 text-gray-400" />

      <!-- Input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="flex-1 outline-none text-sm"
      />

      <!-- Clear button (visible when input has value) -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Clear search"
      >
        <UIcon name="i-lucide-x" class="size-4 text-gray-400" />
      </button>
    </div>
  </div>
</template>
```

### Icon Loader Indicator

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <button
    @click="handleSubmit"
    :disabled="isLoading"
    class="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-75"
  >
    <!-- Show different icon based on loading state -->
    <UIcon
      :name="isLoading ? 'i-lucide-loader-2' : 'i-lucide-upload'"
      class="size-4"
      :class="isLoading && 'animate-spin'"
    />
    <span>{{ isLoading ? 'Uploading...' : 'Upload' }}</span>
  </button>
</template>
```

---

## Advanced Patterns

### Icon with Badge

```vue
<script setup lang="ts">
interface IconWithBadge {
  icon: string
  badge?: string | number
  badgeColor: string
}

const icons: IconWithBadge[] = [
  { icon: 'i-lucide-bell', badge: 3, badgeColor: 'bg-red-500' },
  { icon: 'i-lucide-mail', badge: 12, badgeColor: 'bg-blue-500' },
  { icon: 'i-lucide-shopping-cart', badge: 5, badgeColor: 'bg-green-500' },
]
</script>

<template>
  <div class="flex gap-6">
    <div
      v-for="item in icons"
      :key="item.icon"
      class="relative"
    >
      <UIcon :name="item.icon" class="size-6" />
      <span
        v-if="item.badge"
        :class="item.badgeColor"
        class="absolute -top-2 -right-2 min-w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
      >
        {{ item.badge }}
      </span>
    </div>
  </div>
</template>
```

### Icon Grid with Labels

```vue
<script setup lang="ts">
interface CategoryIcon {
  name: string
  label: string
  icon: string
}

const categories: CategoryIcon[] = [
  { name: 'home', label: 'Home', icon: 'i-lucide-home' },
  { name: 'work', label: 'Work', icon: 'i-lucide-briefcase' },
  { name: 'health', label: 'Health', icon: 'i-lucide-heart' },
  { name: 'finance', label: 'Finance', icon: 'i-lucide-dollar-sign' },
]
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <button
      v-for="category in categories"
      :key="category.name"
      class="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <UIcon :name="category.icon" class="size-8 text-blue-600" />
      <span class="text-sm font-medium">{{ category.label }}</span>
    </button>
  </div>
</template>
```

### Icon Progress Indicator

```vue
<script setup lang="ts">
import { computed } from 'vue'

const progress = ref(65)

const progressSteps = [
  { step: 1, icon: 'i-lucide-check-circle', label: 'Account Created' },
  { step: 2, icon: 'i-lucide-check-circle', label: 'Email Verified' },
  { step: 3, icon: 'i-lucide-clock', label: 'Profile Setup' },
  { step: 4, icon: 'i-lucide-circle', label: 'Complete Setup' },
]

const getIconColor = (step: number) => {
  if (step <= Math.ceil(progress.value / 25)) return 'text-green-600'
  if (step === Math.ceil(progress.value / 25) + 1) return 'text-blue-600'
  return 'text-gray-400'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Progress indicator with icons -->
    <div class="flex items-center justify-between">
      <div
        v-for="step in progressSteps"
        :key="step.step"
        class="flex flex-col items-center gap-2"
      >
        <div :class="getIconColor(step.step)">
          <UIcon :name="step.icon" class="size-8" />
        </div>
        <span class="text-xs sm:text-sm text-gray-600">{{ step.label }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div
        class="bg-blue-600 h-full rounded-full transition-all duration-500"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
```

---

## Notes

### Performance Considerations

1. **Icon Loading**: Iconify icons are loaded on-demand, reducing initial bundle size
2. **Caching**: Nuxt UI caches icon SVGs in memory for better performance
3. **Mode Selection**: SVG mode (default) is generally more performant than CSS mode

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (Vue 3 requirement)
- Mobile browsers fully supported

### Common Gotchas

1. **Icon Name Format**: Must follow Iconify naming convention (`collection-style-name`)
2. **Missing Icons**: Invalid icon names render as empty or fallback silently - check console for warnings
3. **Size Prop**: Should use Tailwind's `size-*` classes rather than inline style width/height for consistency
4. **Dark Mode**: Must explicitly add dark mode classes (dark:text-*) for icon color changes

### Best Practices

1. **Always provide `aria-label`** for icon-only controls
2. **Use semantic HTML** when icons complement text (prefer icons before text, not after in most cases)
3. **Maintain consistent sizing** within components and sections using defined size system
4. **Test with screen readers** to ensure icons don't break semantics
5. **Consider icon semantics** - choose icons that clearly convey meaning in context
6. **Use color + additional indicators** for important states (don't rely on color alone)
7. **Batch icon loads** by using same collection when possible for better caching

### Related Components

- `UButton` - Often combines icons with text
- `UInput` - Icons as leading/trailing elements
- `UBadge` - Icons for status indicators
- `UAvatar` - Fallback icons for user avatars
- `UDropdown` - Icons in menu items

---

## Research Metadata

**Research Date**: 2025-11-05
**Component**: Nuxt UI UIcon
**Framework**: Nuxt UI (Vue 3)
**Primary Icon Source**: Iconify
**Alternative Icon Systems**: Custom Vue components, SVG imports
**Documentation**: https://ui.nuxt.com/docs/components/icon

**Icon Collections Supported**: 150+ via Iconify

**TypeScript Support**: Full (Vue 3 + TypeScript compatible)

**CSS Framework**: Tailwind CSS (primary styling approach)
