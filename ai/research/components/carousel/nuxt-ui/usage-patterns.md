# Nuxt UI - Carousel Usage Patterns

## Component URL
https://ui.nuxt.com/components/carousel
Status: ✅ Working
Version: v4.1.0
Last Verified: 2025-11-10

## Documentation Quality
Excellent - Comprehensive examples for each feature, clear prop tables, working demos, documented edge cases (e.g., vertical height requirement), plugin configuration guidance, and real-world patterns including thumbnails. The documentation demonstrates both basic and advanced usage patterns effectively.

## Component Definition
- **Core purpose**: Enable motion and swipe navigation through collections of items with extensive customization options for transitions, controls, and behavior.
- **Mental model**: A viewport window that displays one or more items at a time from a larger collection, allowing users to navigate through items via arrows, dots, drag gestures, or programmatic control.
- **Semantic meaning**: Communicates "navigable collection" or "gallery view" in the UI, typically used for image galleries, product showcases, testimonials, or any content that benefits from sequential presentation.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `arrows={true}`, `:orientation="vertical"`)
- **Composed**: Via composition/children (e.g., `v-slot="{ item }"` for custom rendering)
- **CSS-only**: Requires custom styling (e.g., `ui.item` classes for layout)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image slides | ✅ | Composed | Primary example uses image URLs in slot: `<img :src="item">` |
| Card slides | ✅ | Composed | Supported via default slot with any content, including cards |
| Custom content | ✅ | Composed | Full flexibility via `v-slot="{ item }"` - render any Vue component or HTML |
| Multiple items per slide | ✅ | CSS-only | Control via flex `basis` classes (e.g., `basis-1/3` for 3 items) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal scroll | ✅ | Native | Default behavior with `orientation="horizontal"` |
| Vertical scroll | ✅ | Native | Via `orientation="vertical"` prop (requires explicit container height) |
| Fade transition | ✅ | Native | Via `fade` prop/plugin - alternative to scroll animation |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Autoplay | ✅ | Native | Boolean or object config: `{ delay: 2000, stopOnInteraction: true }` |
| Pause on hover | ✅ | Native | Via autoplay plugin: `{ stopOnMouseEnter: true }` |
| Loading state | ❌ | N/A | Not documented; likely handled externally or via slot content |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Navigation dots | ✅ | Native | `dots` prop; customize via `ui.dots` and `ui.dot` classes |
| Arrow controls | ✅ | Native | `arrows` prop; customize via `prev`/`next` button config objects (label, color, variant, size, icon) |
| Infinite loop | ✅ | Native | Via `loop` prop/plugin (boolean or config object) |
| Speed control | ✅ | Native | Via Embla options or autoplay delay configuration |
| Swipe/drag support | ✅ | Native | Built-in via Embla; enhanced via `wheel-gestures` plugin for mouse wheel |
| Responsive behavior | ✅ | CSS-only | Control visible items via flex utilities (`basis-1/2`, `basis-1/3`, etc.) |
| Thumbnail navigation | ✅ | Composed | Documented pattern using `useTemplateRef()` and `emblaApi.scrollTo()` method |
| Auto-height | ✅ | Native | Via `auto-height` plugin with smooth `transition-[height]` animations |
| CSS class effects | ✅ | Native | Via `class-names` plugin - adds `.is-snapped` for opacity/scale effects |
| Continuous scroll | ✅ | Native | Via `auto-scroll` plugin for continuous animation |

## Code Examples
```vue
<!-- Basic Image Carousel -->
<template>
  <UCarousel
    v-slot="{ item }"
    arrows
    dots
    :items="items"
    class="w-full max-w-xs mx-auto"
  >
    <img :src="item" width="320" height="320" class="rounded-lg">
  </UCarousel>
</template>

<script setup>
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3'
]
</script>
```

```vue
<!-- Vertical Carousel with Autoplay -->
<template>
  <UCarousel
    v-slot="{ item }"
    orientation="vertical"
    arrows
    :autoplay="{ delay: 2000 }"
    :items="items"
    class="h-96"
  >
    <img :src="item" class="w-full h-full object-cover">
  </UCarousel>
</template>
```

```vue
<!-- Multiple Items with Custom Button Config -->
<template>
  <UCarousel
    v-slot="{ item }"
    arrows
    :items="items"
    :prev="{ color: 'neutral', variant: 'outline' }"
    :next="{ color: 'neutral', variant: 'outline' }"
    :ui="{ item: 'basis-1/3' }"
  >
    <img :src="item" class="rounded">
  </UCarousel>
</template>
```

```vue
<!-- Fade Transition with Loop -->
<template>
  <UCarousel
    v-slot="{ item }"
    fade
    loop
    dots
    :items="items"
  >
    <img :src="item" class="w-full h-64 object-cover">
  </UCarousel>
</template>
```

```vue
<!-- Thumbnail Navigation Pattern -->
<template>
  <div>
    <UCarousel
      ref="carouselRef"
      v-slot="{ item }"
      :items="items"
    >
      <img :src="item" class="w-full h-64 object-cover">
    </UCarousel>

    <div class="flex gap-2 mt-4">
      <button
        v-for="(item, index) in items"
        :key="index"
        @click="carouselRef.emblaApi.scrollTo(index)"
      >
        <img :src="item" class="w-16 h-16 object-cover">
      </button>
    </div>
  </div>
</template>

<script setup>
const carouselRef = useTemplateRef('carouselRef')
const items = [/* ... */]
</script>
```

[View Live Examples](https://ui.nuxt.com/components/carousel)

## Notable Features

### Embla Carousel Integration
Built on the Embla Carousel library, providing access to the full Embla API via `emblaApi` template reference for programmatic control (e.g., `scrollTo()`, `scrollNext()`, `scrollPrev()`).

### Plugin Ecosystem
Seven official Embla plugins supported via boolean or object props:
- **autoplay**: Automatic slide advancement with configurable timing
- **auto-scroll**: Continuous scrolling animation
- **auto-height**: Dynamic container height adjustment
- **class-names**: CSS class toggling (e.g., `.is-snapped` for active slides)
- **fade**: Alternative fade transition effect
- **wheel-gestures**: Mouse wheel navigation support
- **loop**: Infinite carousel behavior

### Flexible Content Rendering
Default slot pattern with `v-slot="{ item }"` enables rendering any content type - images, cards, components, or custom HTML structures.

### UI Customization System
Comprehensive `ui` prop for class customization:
- `container`: Wrapper classes
- `item`: Individual item classes (e.g., `basis-1/3` for multiple visible items)
- `controls`: Arrow button container
- `dots`: Dot indicator container
- `dot`: Individual dot styling

### Button Customization
`prev` and `next` props accept objects with:
- `label`: Accessible text
- `color`: Button color variant
- `variant`: Button style (solid, outline, ghost, etc.)
- `size`: Button size
- Icon customization via `prevIcon`/`nextIcon` props

### Responsive Multi-Item Display
Control visible item count using Tailwind flex utilities on `ui.item`:
- `basis-1/2`: 2 items visible
- `basis-1/3`: 3 items visible
- `basis-1/4`: 4 items visible

### Accessibility
- Icon customization support for internationalization
- Label props on navigation buttons
- Keyboard navigation built-in via Embla

## Research Notes

### Implementation Details
- External dependency on Embla Carousel library (not implemented from scratch)
- Vertical orientation requires explicit height on container element (documented edge case)
- Class Names plugin enables CSS-based effects via `.is-snapped` selector for active slides
- Auto Height plugin uses `transition-[height]` for smooth animations
- Default icon customization possible via `app.config.ts` or `vite.config.ts`

### Documentation Strengths
- Clear examples for each major feature (orientation, plugins, customization)
- Documented edge cases (e.g., vertical height requirement)
- Real-world pattern demonstrated (thumbnail navigation)
- Props table with types and descriptions
- Multiple working demos on documentation page

### Framework Approach
Vue-focused implementation leveraging:
- Composition API (`useTemplateRef()`)
- Slot-based rendering for flexibility
- Object/boolean prop patterns common in Vue ecosystems
- Tailwind CSS for styling utilities
- External library integration rather than custom implementation

### Observations
1. Heavy reliance on external Embla library for core functionality
2. Plugin system provides modular feature addition
3. Balances opinionated defaults with extensive customization options
4. Strong emphasis on responsive behavior and visual customization
5. Documentation assumes familiarity with Vue 3 and Tailwind CSS patterns
