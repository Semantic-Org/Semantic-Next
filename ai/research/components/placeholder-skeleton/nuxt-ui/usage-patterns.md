# Nuxt UI - Skeleton Component Usage Patterns

## Research Metadata
- **Framework**: Nuxt UI (Vue)
- **Component**: Skeleton
- **Documentation URL**: https://ui.nuxt.com/components/skeleton
- **Research Date**: 2025-11-04
- **URL Status**: ✅ Working (via WebFetch)
- **Version**: Current (v3 documentation available)

---

## Component Definition

**Purpose**: A loading placeholder component that displays animated content while actual data is being fetched or processed.

**Mental Model**: Skeleton is a **visual placeholder** component designed to:
- Provide visual feedback during loading states
- Maintain layout structure before content loads
- Create smooth perceived performance
- Build anticipation for incoming content
- Reduce cognitive load during wait times

**Key Characteristic**: Extremely minimal API surface with maximum flexibility through composition. Acts as a styled building block rather than a complex component system.

---

## Documentation Quality

**Minimal but Complete** - Very concise documentation that covers all necessary aspects. Single example demonstrates the core pattern. Focus on flexibility through Tailwind utility classes rather than complex prop APIs. Documentation emphasizes composition over configuration.

---

## Component Definition Comparison

### Nuxt UI Approach
Nuxt UI takes a radically simple approach to skeleton loading:
- **Single primitive component** rather than a skeleton system
- **No built-in layouts** - users compose their own patterns
- **Style-driven** - controlled entirely through Tailwind classes
- **Polymorphic** - can render as any HTML element via `as` prop
- **Composition-first** - multiple skeletons arranged to match target layout

This contrasts with frameworks that provide pre-built skeleton layouts (avatar + text, card, list, etc.). Nuxt UI provides the building block and leaves composition to developers.

---

## Pattern Support Levels

### Core Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic placeholder | ✅ | Native | Single skeleton element with pulse animation |
| Custom dimensions | ✅ | Native | Via Tailwind width/height classes |
| Custom shapes | ✅ | Native | Via Tailwind border-radius classes |
| Animation | ✅ | Native | `animate-pulse` applied by default |
| Polymorphic rendering | ✅ | Native | `as` prop to render as any element |

### Layout Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Circular skeleton | ✅ | Composed | `rounded-full` class for avatars |
| Rectangular skeleton | ✅ | Composed | Default shape with customizable border-radius |
| Text line skeleton | ✅ | Composed | Fixed width with height approximating text |
| Multiple lines | ✅ | Composed | Stack multiple skeletons with gap |
| Mixed layouts | ✅ | Composed | Flexbox/grid containers with skeleton children |

### Customization Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tailwind classes | ✅ | Native | Full utility class support via `class` attribute |
| Theme configuration | ✅ | Native | Global theming via app.config.ts or vite.config.ts |
| ui prop system | ✅ | Native | Component-level style overrides |
| Background color | ✅ | Native | Default uses `bg-elevated` theme color |
| Animation control | ✅ | Native | Can override `animate-pulse` in theme |

---

## API Props Reference

### Main Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **as** | `any` | `'div'` | HTML element or component to render as | Level 1 |
| **class** | `string` | - | Tailwind utility classes for styling | Level 1 |
| **ui** | `object` | - | Component-level theme overrides | Level 1 |

### Theme Configuration Structure

The component exposes a `base` slot for theme customization:

```typescript
{
  skeleton: {
    base: 'animate-pulse rounded-md bg-elevated'
  }
}
```

**Base classes:**
- `animate-pulse` - Pulsing animation effect
- `rounded-md` - Default border-radius
- `bg-elevated` - Theme-aware background color

---

## Available Slots

| Slot Name | Purpose | Content Type |
|-----------|---------|--------------|
| **default** | Skeleton content area | Empty by default, can contain nested elements |

**Note**: Unlike many components, Skeleton typically uses an empty default slot. Content is defined through dimensions and classes rather than slot content.

---

## Code Examples

### Basic Usage

```vue
<template>
  <!-- Simple rectangular skeleton -->
  <USkeleton class="h-4 w-32" />

  <!-- Square skeleton -->
  <USkeleton class="h-16 w-16" />

  <!-- Full-width skeleton -->
  <USkeleton class="h-12 w-full" />
</template>
```

### Circular Skeleton (Avatar Placeholder)

```vue
<template>
  <!-- Small avatar skeleton -->
  <USkeleton class="h-8 w-8 rounded-full" />

  <!-- Medium avatar skeleton -->
  <USkeleton class="h-12 w-12 rounded-full" />

  <!-- Large avatar skeleton -->
  <USkeleton class="h-16 w-16 rounded-full" />
</template>
```

### Text Line Skeletons

```vue
<template>
  <div class="grid gap-2">
    <!-- Title skeleton -->
    <USkeleton class="h-6 w-48" />

    <!-- Subtitle skeleton -->
    <USkeleton class="h-4 w-32" />

    <!-- Paragraph skeletons -->
    <USkeleton class="h-4 w-full" />
    <USkeleton class="h-4 w-full" />
    <USkeleton class="h-4 w-3/4" />
  </div>
</template>
```

### Avatar + Text Pattern (Canonical Example)

```vue
<template>
  <div class="flex items-center gap-4">
    <!-- Avatar skeleton -->
    <USkeleton class="h-12 w-12 rounded-full" />

    <!-- Text content skeletons -->
    <div class="grid gap-2">
      <USkeleton class="h-4 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>
```

### Card Skeleton Layout

```vue
<template>
  <div class="rounded-lg border p-4">
    <!-- Card image skeleton -->
    <USkeleton class="h-48 w-full rounded-md mb-4" />

    <!-- Card content -->
    <div class="grid gap-3">
      <!-- Title -->
      <USkeleton class="h-6 w-3/4" />

      <!-- Description lines -->
      <div class="grid gap-2">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-2/3" />
      </div>

      <!-- Action button skeleton -->
      <USkeleton class="h-10 w-32 rounded-md" />
    </div>
  </div>
</template>
```

### List Skeleton Pattern

```vue
<template>
  <div class="divide-y">
    <!-- Repeat for each list item -->
    <div v-for="i in 5" :key="i" class="py-3 flex items-center gap-3">
      <USkeleton class="h-10 w-10 rounded-full" />
      <div class="flex-1 grid gap-2">
        <USkeleton class="h-4 w-1/2" />
        <USkeleton class="h-3 w-1/3" />
      </div>
    </div>
  </div>
</template>
```

### Table Skeleton Pattern

```vue
<template>
  <div class="w-full">
    <!-- Table header -->
    <div class="grid grid-cols-4 gap-4 pb-2 border-b">
      <USkeleton class="h-4 w-20" />
      <USkeleton class="h-4 w-24" />
      <USkeleton class="h-4 w-16" />
      <USkeleton class="h-4 w-20" />
    </div>

    <!-- Table rows -->
    <div v-for="i in 6" :key="i" class="grid grid-cols-4 gap-4 py-3 border-b">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
      <USkeleton class="h-4 w-2/3" />
    </div>
  </div>
</template>
```

### Polymorphic Rendering

```vue
<template>
  <!-- Render as span instead of div -->
  <USkeleton as="span" class="h-4 w-24 inline-block" />

  <!-- Render as article element -->
  <USkeleton as="article" class="h-64 w-full" />

  <!-- Render as a custom component (advanced) -->
  <USkeleton :as="CustomComponent" class="h-32 w-32" />
</template>
```

### Responsive Skeleton Patterns

```vue
<template>
  <div class="grid gap-4">
    <!-- Responsive width -->
    <USkeleton class="h-4 w-full sm:w-3/4 lg:w-1/2" />

    <!-- Responsive layout -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <USkeleton class="h-16 w-16 rounded-full" />
      <div class="grid gap-2 w-full">
        <USkeleton class="h-5 w-full sm:w-64" />
        <USkeleton class="h-4 w-full sm:w-48" />
      </div>
    </div>
  </div>
</template>
```

### Theme Configuration Examples

#### Global Configuration (app.config.ts)

```typescript
export default defineAppConfig({
  ui: {
    skeleton: {
      base: 'animate-pulse rounded-md bg-elevated'
    }
  }
})
```

#### Global Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      ui: {
        skeleton: {
          base: 'animate-pulse rounded-md bg-elevated'
        }
      }
    })
  ]
})
```

#### Custom Animation Speed

```typescript
export default defineAppConfig({
  ui: {
    skeleton: {
      // Slower animation
      base: 'animate-pulse [animation-duration:2s] rounded-md bg-elevated'
    }
  }
})
```

#### Custom Colors

```typescript
export default defineAppConfig({
  ui: {
    skeleton: {
      // Use custom background color
      base: 'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800'
    }
  }
})
```

### UI Prop Customization

```vue
<template>
  <!-- Override base styles per instance -->
  <USkeleton
    :ui="{ base: 'animate-pulse rounded-lg bg-blue-100' }"
    class="h-8 w-32"
  />

  <!-- Remove animation for specific instance -->
  <USkeleton
    :ui="{ base: 'rounded-md bg-elevated' }"
    class="h-12 w-48"
  />

  <!-- Custom animation -->
  <USkeleton
    :ui="{ base: 'animate-bounce rounded-md bg-elevated' }"
    class="h-4 w-24"
  />
</template>
```

### Conditional Skeleton Display

```vue
<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const data = ref(null)

onMounted(async () => {
  // Simulate data loading
  data.value = await fetchData()
  loading.value = false
})
</script>

<template>
  <div>
    <!-- Show skeleton while loading -->
    <div v-if="loading" class="flex items-center gap-4">
      <USkeleton class="h-12 w-12 rounded-full" />
      <div class="grid gap-2">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
    </div>

    <!-- Show actual content when loaded -->
    <div v-else class="flex items-center gap-4">
      <img :src="data.avatar" class="h-12 w-12 rounded-full" />
      <div>
        <h3>{{ data.name }}</h3>
        <p>{{ data.description }}</p>
      </div>
    </div>
  </div>
</template>
```

### Reusable Skeleton Components

```vue
<script setup>
// ProfileSkeleton.vue
</script>

<template>
  <div class="flex items-center gap-4">
    <USkeleton class="h-12 w-12 rounded-full" />
    <div class="grid gap-2">
      <USkeleton class="h-4 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>
```

```vue
<script setup>
import ProfileSkeleton from './ProfileSkeleton.vue'

const loading = ref(true)
</script>

<template>
  <div>
    <ProfileSkeleton v-if="loading" />
    <UserProfile v-else :user="userData" />
  </div>
</template>
```

### Grid Layout Skeleton

```vue
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="i in 6" :key="i" class="border rounded-lg p-4">
      <!-- Card image -->
      <USkeleton class="h-40 w-full rounded-md mb-4" />

      <!-- Card title -->
      <USkeleton class="h-5 w-3/4 mb-2" />

      <!-- Card description -->
      <div class="grid gap-2 mb-4">
        <USkeleton class="h-3 w-full" />
        <USkeleton class="h-3 w-full" />
        <USkeleton class="h-3 w-2/3" />
      </div>

      <!-- Card footer -->
      <div class="flex items-center justify-between">
        <USkeleton class="h-8 w-20 rounded-md" />
        <USkeleton class="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
</template>
```

---

## Notable Features

### 1. Radical Simplicity

The Skeleton component embodies minimalism:
- **Single meaningful prop** (`as`) for polymorphism
- **No preset layouts** - composition over configuration
- **Styling through classes** - no complex prop combinations
- **Transparent API** - what you see is what you get

This simplicity is intentional: skeleton screens are highly context-dependent, and pre-built patterns would be more limiting than helpful.

### 2. Composition-First Design

Rather than providing `<SkeletonAvatar>`, `<SkeletonText>`, etc., Nuxt UI provides one primitive:
- **Build your own patterns** by composing multiple skeletons
- **Layout control** through standard CSS (Flexbox, Grid)
- **Reusable patterns** through custom wrapper components
- **Context-aware designs** that match your actual UI

### 3. Polymorphic Rendering

The `as` prop enables semantic HTML:
```vue
<!-- Semantic section element -->
<USkeleton as="section" />

<!-- Inline span -->
<USkeleton as="span" class="inline-block" />

<!-- Custom component wrapper -->
<USkeleton :as="MyComponent" />
```

### 4. Tailwind Integration

Deep integration with Tailwind CSS:
- **Arbitrary values** - `w-[250px]` for precise sizing
- **Responsive modifiers** - `sm:w-3/4 lg:w-1/2`
- **Dark mode** - Automatic via `bg-elevated` theme token
- **Theme colors** - Uses design system colors
- **Custom variants** - Apply any Tailwind utility

### 5. Theme-Aware Backgrounds

Uses `bg-elevated` token:
- **Adapts to light/dark mode** automatically
- **Consistent with design system** color hierarchy
- **Semantic naming** - elevated = slightly above surface
- **Customizable** - can override globally or per-instance

### 6. Performance Characteristics

Minimal performance overhead:
- **CSS animations** - no JavaScript for pulse effect
- **Static structure** - no reactive state
- **Small bundle** - almost no runtime code
- **Composable** - no layout calculations

### 7. Vue Composition Patterns

Full Vue ecosystem integration:
- **v-for loops** for repeated skeleton items
- **Conditional rendering** with v-if/v-else
- **Reactive dimensions** with computed classes
- **Component composition** for reusable patterns

---

## Implementation Philosophy

### Design Principles

1. **Minimalism Over Features**
   - Provide the primitive, not the pattern
   - Let developers compose their own layouts
   - Avoid assumptions about use cases

2. **Tailwind-First Styling**
   - All styling through utility classes
   - No hidden magic classes
   - Transparent and predictable

3. **Semantic Flexibility**
   - Render as appropriate HTML element
   - Support component composition
   - Enable accessibility improvements

4. **Theme Integration**
   - Use design system tokens
   - Support light/dark modes
   - Enable global customization

### Vue-Specific Patterns

**Conditional Loading States:**
```vue
<script setup>
const { data, pending } = await useFetch('/api/users')
</script>

<template>
  <div>
    <USkeleton v-if="pending" class="h-32 w-full" />
    <UserList v-else :users="data" />
  </div>
</template>
```

**Composable Patterns:**
```vue
<script setup>
const { isLoading } = useAsyncData()
</script>

<template>
  <Transition name="fade" mode="out-in">
    <SkeletonProfile v-if="isLoading" key="skeleton" />
    <UserProfile v-else key="content" />
  </Transition>
</template>
```

**Staggered Animations:**
```vue
<template>
  <TransitionGroup name="stagger" tag="div">
    <USkeleton
      v-for="i in 5"
      :key="i"
      class="h-12 w-full"
      :style="{ animationDelay: `${i * 100}ms` }"
    />
  </TransitionGroup>
</template>
```

---

## Accessibility Considerations

### Semantic HTML

The Skeleton component itself doesn't inherently convey meaning to screen readers. Consider:

```vue
<template>
  <!-- Add aria-busy and aria-label to container -->
  <div aria-busy="true" aria-label="Loading user profile">
    <USkeleton class="h-12 w-12 rounded-full" />
    <USkeleton class="h-4 w-32" />
  </div>
</template>
```

### Screen Reader Announcements

```vue
<script setup>
const loading = ref(true)
</script>

<template>
  <div>
    <!-- Announce loading state -->
    <span class="sr-only" role="status" aria-live="polite">
      {{ loading ? 'Loading content...' : 'Content loaded' }}
    </span>

    <div v-if="loading">
      <USkeleton class="h-32 w-full" />
    </div>
    <div v-else>
      <!-- Actual content -->
    </div>
  </div>
</template>
```

### Motion Preferences

```vue
<template>
  <USkeleton
    :ui="{
      base: 'motion-safe:animate-pulse motion-reduce:animate-none rounded-md bg-elevated'
    }"
    class="h-12 w-32"
  />
</template>
```

Or globally:

```typescript
export default defineAppConfig({
  ui: {
    skeleton: {
      base: 'motion-safe:animate-pulse motion-reduce:animate-none rounded-md bg-elevated'
    }
  }
})
```

---

## Pattern Support Summary

### Core Features (Level 1)

| Feature | Support | Notes |
|---------|---------|-------|
| Basic placeholder | ✅ Native | Styled div with pulse animation |
| Custom dimensions | ✅ Native | Via Tailwind width/height classes |
| Custom shapes | ✅ Native | Via border-radius classes |
| Pulse animation | ✅ Native | CSS-based, performant |
| Polymorphic element | ✅ Native | Render as any HTML element or component |

### Layout Features (Level 1 - Composed)

| Feature | Support | Notes |
|---------|---------|-------|
| Circular skeleton | ✅ Composed | `rounded-full` class |
| Text line skeleton | ✅ Composed | Fixed width + appropriate height |
| Multi-line text | ✅ Composed | Multiple skeletons with gap |
| Avatar + text | ✅ Composed | Flexbox composition (canonical example) |
| Card layouts | ✅ Composed | Grid/flex with multiple skeletons |
| List layouts | ✅ Composed | Repeated pattern with v-for |
| Table layouts | ✅ Composed | Grid with skeleton rows/columns |

### Customization Features (Level 1)

| Feature | Support | Notes |
|---------|---------|-------|
| Theme configuration | ✅ Native | Global app.config.ts or vite.config.ts |
| ui prop override | ✅ Native | Per-instance theme customization |
| Tailwind classes | ✅ Native | Full utility class support |
| Animation control | ✅ Native | Modify animate-pulse or replace |
| Color customization | ✅ Native | Override bg-elevated with custom colors |
| Responsive design | ✅ Native | Tailwind responsive modifiers |

### Advanced Features (Level 2)

| Feature | Support | Notes |
|---------|---------|-------|
| Dark mode support | ✅ Native | Via bg-elevated theme token |
| Arbitrary values | ✅ Native | Tailwind arbitrary syntax (e.g., w-[250px]) |
| Custom components | ✅ Native | Via `as` prop polymorphism |
| Motion preferences | ✅ Composed | motion-reduce: utilities |
| Accessibility hints | ⚠️ Manual | Requires manual aria attributes |

---

## Research Notes

### Data Collection Method
- WebFetch extraction from official Nuxt UI documentation
- Documentation URL: https://ui.nuxt.com/components/skeleton
- Research completed: 2025-11-04
- Information extracted via AI model analysis of page content

### Documentation Quality
- **Minimal by design**: Single example demonstrates core pattern
- **Clear theming**: Theme configuration clearly documented
- **Composition-focused**: Emphasis on building custom layouts
- **Tailwind-centric**: Assumes familiarity with Tailwind CSS

### Framework Version Notes
- Current documentation reflects v3 (latest)
- Component is stable and unlikely to change significantly
- Very small API surface reduces breaking change risk

### Limitations
- No pre-built layout patterns documented
- Accessibility guidance minimal
- Advanced composition patterns not shown in docs
- Must infer complex usage patterns from basic example

---

## Recommendations for Semantic UI

### Skeleton Implementation Priority

**Must-Have (Level 1)**:
1. ✅ Basic rectangular skeleton with dimensions
2. ✅ Pulse animation (CSS-based)
3. ✅ Circular shape support (for avatars)
4. ✅ Customizable via classes or settings
5. ✅ Theme-aware background color
6. ✅ Responsive sizing support

**Should-Have (Level 2)**:
1. ✅ Polymorphic rendering (as different elements)
2. ✅ Global theme configuration
3. ✅ Per-instance style overrides
4. ✅ Dark mode support
5. ✅ Animation control (speed, style)

**Consider**:
- Pre-built skeleton patterns (avatar+text, card, list) as examples
- Accessibility helpers (aria-busy, role, aria-label)
- Motion preference support
- Staggered animation utilities
- Transition components for skeleton → content

### Semantic UI Differentiators

**Natural Language Approach:**
- Consider: `<ui-skeleton shape="circle">` vs `<ui-skeleton class="rounded-full">`
- Consider: `<ui-skeleton animation="wave">` for alternative animation styles
- Consider: `<ui-skeleton emphasis="subtle">` for varying opacity

**Settings Architecture:**
```javascript
// Potential Semantic UI pattern
settings: {
  width: '100%',
  height: '3rem',
  shape: 'rectangle', // rectangle | circle | rounded
  animation: 'pulse',  // pulse | wave | none
  speed: 'normal'      // slow | normal | fast
}
```

**Web Component Benefits:**
- Shadow DOM style encapsulation
- Framework-agnostic usage
- Custom CSS properties for theming
- Slot-based composition

**Template Patterns:**
```html
<!-- Semantic UI potential -->
<ui-skeleton shape="circle" width="3rem" height="3rem"></ui-skeleton>

<ui-skeleton width="100%" height="1rem">
  <!-- Empty by default -->
</ui-skeleton>

<!-- Composed pattern -->
<div class="flex items-center gap-4">
  <ui-skeleton shape="circle" width="3rem" height="3rem"></ui-skeleton>
  <div class="flex flex-col gap-2">
    <ui-skeleton width="250px" height="1rem"></ui-skeleton>
    <ui-skeleton width="200px" height="1rem"></ui-skeleton>
  </div>
</div>
```

### Key Insights

1. **Simplicity is a Feature**: Nuxt UI proves that a skeleton component doesn't need a complex API. A single primitive with flexible styling is sufficient.

2. **Composition Over Configuration**: Rather than `<SkeletonCard>`, `<SkeletonAvatar>`, etc., provide one building block and let developers compose.

3. **Styling Mechanism Matters**: Nuxt UI relies on Tailwind classes. Semantic UI would use:
   - CSS custom properties in Shadow DOM
   - Settings-based dimensions and shape
   - Slot-based composition
   - Theme token integration

4. **Animation is Critical**: Pulse animation is essential for conveying "loading" state. CSS-based animation is performant.

5. **Semantic HTML**: Supporting `as` prop for semantic elements (`<article>`, `<section>`, etc.) improves accessibility.

### Implementation Suggestions

**For Semantic UI Skeleton:**

```javascript
defineComponent({
  name: 'ui-skeleton',
  defaultSettings: {
    width: '100%',
    height: '1rem',
    shape: 'rectangle', // rectangle | circle | rounded
    animation: 'pulse',  // pulse | wave | shimmer | none
    speed: 'normal',     // slow | normal | fast
    as: 'div'           // HTML element to render
  },
  template: `
    <{as} class="ui-skeleton {shape} {animation} {speed}">
      <slot></slot>
    </{as}>
  `,
  css: `
    :host {
      display: block;
      width: var(--skeleton-width, 100%);
      height: var(--skeleton-height, 1rem);
    }

    .ui-skeleton {
      background: var(--color-background-elevated);
      border-radius: var(--border-radius-md);
    }

    .ui-skeleton.circle {
      border-radius: 50%;
      aspect-ratio: 1;
    }

    .ui-skeleton.rounded {
      border-radius: var(--border-radius-lg);
    }

    .ui-skeleton.pulse {
      animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `
})
```

**Usage:**

```html
<!-- Basic skeleton -->
<ui-skeleton></ui-skeleton>

<!-- Circular skeleton -->
<ui-skeleton shape="circle" width="3rem" height="3rem"></ui-skeleton>

<!-- Settings-based configuration -->
<ui-skeleton
  .settings="{ width: '250px', height: '1rem', animation: 'pulse' }"
></ui-skeleton>

<!-- Composed pattern (avatar + text) -->
<div class="flex items-center gap-4">
  <ui-skeleton shape="circle" width="3rem" height="3rem"></ui-skeleton>
  <div class="flex flex-col gap-2">
    <ui-skeleton width="250px"></ui-skeleton>
    <ui-skeleton width="200px"></ui-skeleton>
  </div>
</div>

<!-- Semantic HTML -->
<ui-skeleton as="article" width="100%" height="200px"></ui-skeleton>
```

### Nuxt UI Skeleton vs Semantic UI Opportunities

**What Nuxt UI does well:**
- Radical simplicity (one prop + classes)
- Composition-first approach
- Tailwind integration
- Theme system integration

**Semantic UI can improve on:**
- Natural language settings (shape, animation, speed)
- Dimension props instead of classes (width, height)
- Pre-defined shape options
- Shadow DOM encapsulation
- Framework-agnostic usage

**Unique Semantic UI advantages:**
- Native web components
- CSS custom properties for theming
- Settings-based configuration
- No build step required
- Works everywhere (React, Vue, Vanilla, etc.)

### Comparison with Other Frameworks

**Nuxt UI vs MUI/Chakra/etc.:**
- Most frameworks provide `<Skeleton variant="text">`, `<Skeleton variant="circular">`, etc.
- Nuxt UI provides one primitive and lets you compose
- Semantic UI could take middle ground:
  - Support common patterns via settings
  - Also support full composition flexibility
  - Provide example patterns in docs

**Recommendation:**
Semantic UI should provide a simple primitive like Nuxt UI, but enhance it with:
1. **Shape setting** - easier than remembering class names
2. **Dimension props** - more intuitive than inline styles
3. **Animation options** - pulse, wave, shimmer
4. **Composition examples** - show common patterns in docs

---

## Conclusion

Nuxt UI's Skeleton component exemplifies minimalist design: provide the essential primitive and let developers compose their own patterns. With just one meaningful prop (`as`) and full Tailwind styling support, it achieves maximum flexibility with minimal API surface.

Key takeaways for Semantic UI:

1. **Simplicity is powerful** - Don't over-engineer with preset layouts
2. **Composition over configuration** - One building block, infinite patterns
3. **Animation is essential** - CSS pulse animation is the defining characteristic
4. **Theming integration** - Use design system colors (bg-elevated)
5. **Semantic HTML** - Support polymorphic rendering for accessibility
6. **Documentation should show patterns** - Even if the API is simple, show composition examples

The Nuxt UI Skeleton represents a Level 1 (Universal) primitive that prioritizes flexibility and simplicity over comprehensive feature sets. It's an excellent reference for Semantic UI, demonstrating that sometimes the best API is the smallest one.

Semantic UI can differentiate by:
- Offering natural language settings alongside class-based styling
- Providing dimension props (width/height) for better DX
- Including animation variants (pulse/wave/shimmer)
- Showing comprehensive composition patterns in documentation
- Leveraging Shadow DOM for true style encapsulation
