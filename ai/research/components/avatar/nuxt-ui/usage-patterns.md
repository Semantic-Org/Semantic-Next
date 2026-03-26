# Nuxt UI - Avatar Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/avatar
Status: ✅ Working
Version: Current (Nuxt UI 3.0+)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - The documentation provides clear prop documentation, visual previews for all size variants, interactive examples, and demonstrates integration patterns with other components. Code examples are concise and practical.

## Component Definition
- **Core purpose**: A versatile image container with intelligent fallback hierarchy for displaying user avatars, profile pictures, or any circular/shaped imagery with status indicators
- **Mental model**: A smart image wrapper that gracefully degrades through multiple fallback strategies (image → icon → text → initials) to always display something meaningful
- **Semantic meaning**: Represents a user's identity or entity visually. The circular shape creates a universally recognized pattern for profile pictures, with status chips communicating availability or state.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image content | ✅ | Native | Via `src` prop. Supports standard `<img>` attributes (loading, crossorigin, decoding, referrerpolicy). Automatically uses `<NuxtImg>` when `@nuxt/image` is installed. |
| Icon fallback | ✅ | Native | Via `icon` prop accepting string identifiers like `"i-lucide-image"`. Displays when image fails to load or is unavailable. |
| Text fallback | ✅ | Native | Via `text` prop for explicit text content (e.g., `"+1"` for count indicators). Higher priority than initials. |
| Initials fallback | ✅ | Native | Automatically extracts initials from `alt` prop. Example: `alt="Benjamin Canac"` renders as "BC". Lowest priority in fallback hierarchy. |
| Status indicator | ✅ | Native | Via `chip` prop (boolean or object) displaying a badge overlay. Supports positioning, colors, sizes, and inset options. |
| Custom content | ⚠️ | CSS-only | No default slot mentioned; customization via CSS masks for shapes (demonstrated with squircle pattern). |

## Shape Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Circular | ✅ | Native | Default shape via `rounded-full` class. Universal profile picture pattern. |
| Square | ✅ | CSS-only | Via custom `class` prop removing `rounded-full` styling. |
| Custom shapes | ✅ | CSS-only | Via CSS `mask-image` property. Documented example shows squircle shape using SVG data URI mask. |
| Responsive rounding | ⚠️ | CSS-only | Can override border-radius via `class` or `ui` prop customization. |

## Size Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ✅ | Native | Nine sizes: `3xs`, `2xs`, `xs`, `sm`, `md` (default), `lg`, `xl`, `2xl`, `3xl`. Applied via `size` prop. Automatically sets width/height. |
| Custom dimensions | ✅ | CSS-only | Via `class` or `ui.root` customization overriding size classes. |
| Responsive sizing | ⚠️ | CSS-only | No built-in responsive size switching; handled via Tailwind responsive classes in `class`/`ui` props. |

## Status/Badge Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Status chip | ✅ | Native | Via `chip` prop accepting boolean (default position) or object configuration. Displays as overlay badge. |
| Chip positioning | ✅ | Native | Four positions via `chip.position`: `"top-right"` (default), `"bottom-right"`, `"top-left"`, `"bottom-left"`. |
| Chip colors | ✅ | Native | Seven semantic colors: `"primary"`, `"secondary"`, `"success"`, `"info"`, `"warning"`, `"error"`, `"neutral"`. |
| Chip sizing | ✅ | Native | Supports all standard sizes via `chip.size`: `2xs` through `3xl`. |
| Inset mode | ✅ | Native | `chip.inset: true` keeps chip inside rounded boundaries (important for circular avatars). |
| Standalone mode | ✅ | Native | `chip.standalone: true` positions chip relative to parent instead of avatar. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Background color | ✅ | CSS-only | Default `bg-elevated`. Customizable via `ui.root` classes or `class` prop. |
| Border/ring | ⚠️ | CSS-only | No built-in border variants; added via custom classes. |
| Shadow effects | ⚠️ | CSS-only | No built-in shadow variants; added via custom classes. |
| Hover states | ❌ | CSS-only | No built-in hover states; implemented via custom classes when needed. |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable avatar | ✅ | Native | Via `as` prop rendering as `"a"` or `"button"`. Supports standard element props (href, onClick). |
| Tooltip integration | ✅ | Composed | Wrap in `<UTooltip>` component for hover information. Documented pattern. |
| Event handlers | ✅ | Native | Standard Vue events (`@click`, `@mouseenter`, etc.) via polymorphic rendering. |
| Grouping/stacking | ⚠️ | Composed | Separate `AvatarGroup` component exists but not detailed on this page. |
| Loading states | ✅ | Native | Via `loading="lazy"` or `loading="eager"` attribute for image lazy loading. |

## Image Handling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image optimization | ✅ | Native | Automatically uses `<NuxtImg>` when `@nuxt/image` package is installed. Falls back to standard `<img>` otherwise. |
| Lazy loading | ✅ | Native | Via `loading="lazy"` attribute (standard HTML img attribute). |
| CORS handling | ✅ | Native | Via `crossorigin` attribute for cross-origin image requests. |
| Decode options | ✅ | Native | Via `decoding="async"|"sync"|"auto"` attribute for image decode timing. |
| Referrer policy | ✅ | Native | Via `referrerpolicy` attribute for privacy control. |
| Error fallback | ✅ | Native | Automatic fallback hierarchy: image fails → icon → text → initials from alt. |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Alt text | ✅ | Native | Via `alt` prop for semantic image description. Also serves as initials source. |
| ARIA attributes | ⚠️ | Native | Standard HTML attributes pass through; no explicit ARIA documentation. |
| Keyboard navigation | ⚠️ | Native | Supported when rendered as button/link via `as` prop. |
| Screen reader support | ✅ | Native | Alt text provides screen reader context. Fallback text/initials also accessible. |

## Code Examples

### Basic Avatar with Image
```vue
<template>
  <!-- Simple image avatar -->
  <UAvatar src="https://github.com/benjamincanac.png" />

  <!-- With alt text (screen readers + initials fallback) -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
  />
</template>
```

### Fallback Patterns
```vue
<template>
  <!-- Icon fallback (when no image) -->
  <UAvatar icon="i-lucide-image" />
  <UAvatar icon="i-lucide-user" />

  <!-- Text fallback (explicit text content) -->
  <UAvatar text="+1" />
  <UAvatar text="BC" />

  <!-- Initials fallback (extracted from alt) -->
  <UAvatar alt="Benjamin Canac" />
  <!-- Renders as "BC" -->

  <UAvatar alt="Jane Smith" />
  <!-- Renders as "JS" -->

  <!-- Fallback hierarchy in action -->
  <UAvatar
    src="invalid-url.jpg"
    icon="i-lucide-user"
    alt="John Doe"
  />
  <!-- Shows icon when image fails -->
</template>
```

### Size Variants
```vue
<template>
  <div class="flex items-center gap-2">
    <UAvatar src="https://github.com/benjamincanac.png" size="3xs" />
    <UAvatar src="https://github.com/benjamincanac.png" size="2xs" />
    <UAvatar src="https://github.com/benjamincanac.png" size="xs" />
    <UAvatar src="https://github.com/benjamincanac.png" size="sm" />
    <UAvatar src="https://github.com/benjamincanac.png" size="md" />
    <UAvatar src="https://github.com/benjamincanac.png" size="lg" />
    <UAvatar src="https://github.com/benjamincanac.png" size="xl" />
    <UAvatar src="https://github.com/benjamincanac.png" size="2xl" />
    <UAvatar src="https://github.com/benjamincanac.png" size="3xl" />
  </div>
</template>
```

### Status Chip Patterns
```vue
<template>
  <!-- Simple chip (default position: top-right) -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    chip
  />

  <!-- Chip with inset (stays within circular boundary) -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ inset: true }"
  />

  <!-- Chip positioning -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ position: 'bottom-right', inset: true }"
  />

  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ position: 'top-left', inset: true }"
  />

  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ position: 'bottom-left', inset: true }"
  />

  <!-- Chip with semantic colors -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ color: 'success', inset: true }"
  />

  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ color: 'error', inset: true }"
  />

  <UAvatar
    src="https://github.com/benjamincanac.png"
    :chip="{ color: 'warning', inset: true }"
  />

  <!-- Chip with custom size -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    size="xl"
    :chip="{ size: 'lg', color: 'primary', inset: true }"
  />

  <!-- Standalone chip (relative to parent) -->
  <div class="relative">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      :chip="{ standalone: true, color: 'success' }"
    />
  </div>
</template>
```

### Interactive Patterns
```vue
<template>
  <!-- Clickable avatar as button -->
  <UAvatar
    as="button"
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
    @click="handleClick"
  />

  <!-- Clickable avatar as link -->
  <UAvatar
    as="a"
    href="/profile/benjamincanac"
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
  />

  <!-- With tooltip (composition) -->
  <UTooltip text="Benjamin Canac">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
    />
  </UTooltip>

  <!-- With tooltip and status -->
  <UTooltip text="Online">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      :chip="{ color: 'success', inset: true }"
    />
  </UTooltip>
</template>

<script setup>
function handleClick() {
  console.log('Avatar clicked')
}
</script>
```

### Custom Shape Patterns
```vue
<template>
  <!-- Square avatar -->
  <UAvatar
    class="rounded-none"
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
  />

  <!-- Rounded square -->
  <UAvatar
    class="rounded-lg"
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
  />

  <!-- Custom shape via CSS mask (squircle) -->
  <UAvatar
    class="rounded-none squircle"
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
  />
</template>

<style scoped>
.squircle {
  mask-image: url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0z'/%3e%3c/svg%3e");
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
}
</style>
```

### Image Loading Patterns
```vue
<template>
  <!-- Lazy loading (performance optimization) -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    loading="lazy"
  />

  <!-- Eager loading (critical content) -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    loading="eager"
  />

  <!-- With CORS handling -->
  <UAvatar
    src="https://external-domain.com/avatar.jpg"
    crossorigin="anonymous"
  />

  <!-- With decode optimization -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    decoding="async"
  />

  <!-- With referrer policy -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    referrerpolicy="no-referrer"
  />
</template>
```

### Customization Patterns
```vue
<template>
  <!-- Custom background via class -->
  <UAvatar
    class="bg-blue-500"
    icon="i-lucide-user"
  />

  <!-- Custom styling via ui prop -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    :ui="{
      root: 'ring-2 ring-primary shadow-lg',
      image: 'opacity-90'
    }"
  />

  <!-- Custom fallback styling -->
  <UAvatar
    alt="Benjamin Canac"
    :ui="{
      root: 'bg-gradient-to-br from-blue-500 to-purple-500',
      fallback: 'text-white font-bold'
    }"
  />
</template>
```

### NuxtImg Integration
```vue
<template>
  <!-- Automatically uses NuxtImg when @nuxt/image is installed -->
  <UAvatar
    src="https://github.com/benjamincanac.png"
    alt="Benjamin Canac"
  />
  <!-- Renders as <NuxtImg> with optimization -->

  <!-- Without @nuxt/image, renders as standard <img> -->
</template>
```

### Complex Compositions
```vue
<template>
  <!-- User profile with all features -->
  <div class="flex items-center gap-3">
    <UTooltip text="Online">
      <UAvatar
        src="https://github.com/benjamincanac.png"
        alt="Benjamin Canac"
        size="lg"
        :chip="{ color: 'success', inset: true }"
      />
    </UTooltip>

    <div>
      <div class="font-semibold">Benjamin Canac</div>
      <div class="text-sm text-muted">@benjamincanac</div>
    </div>
  </div>

  <!-- Comment/chat avatar -->
  <div class="flex gap-2">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
      size="sm"
    />

    <div class="flex-1">
      <div class="text-sm font-semibold">Benjamin Canac</div>
      <p class="text-sm">This is a great component!</p>
    </div>
  </div>

  <!-- Notification with count badge -->
  <div class="relative inline-block">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      size="md"
    />
    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      3
    </span>
  </div>
</template>
```

## Global Theme Configuration
```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    avatar: {
      slots: {
        root: 'inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-elevated',
        image: 'h-full w-full rounded-[inherit] object-cover',
        fallback: 'font-medium leading-none text-muted truncate',
        icon: 'text-muted shrink-0'
      },
      variants: {
        size: {
          '3xs': { root: 'size-4 text-[8px]' },
          '2xs': { root: 'size-5 text-[10px]' },
          'xs': { root: 'size-6 text-xs' },
          'sm': { root: 'size-7 text-sm' },
          'md': { root: 'size-8 text-base' },
          'lg': { root: 'size-9 text-lg' },
          'xl': { root: 'size-10 text-xl' },
          '2xl': { root: 'size-12 text-2xl' },
          '3xl': { root: 'size-14 text-3xl' }
        }
      },
      defaultVariants: {
        size: 'md'
      }
    }
  }
})
```

## Notable Features

### Intelligent Fallback Hierarchy
The Avatar component implements a sophisticated four-tier fallback system:
1. **Image** (`src` prop) - Primary display method
2. **Icon** (`icon` prop) - Displays when image fails to load
3. **Text** (`text` prop) - Explicit text content (e.g., count badges)
4. **Initials** (extracted from `alt`) - Last resort, automatic extraction

This ensures users never see a broken image, always displaying something meaningful. The automatic initials extraction from the `alt` prop is particularly elegant - it serves both accessibility and functionality purposes.

### Comprehensive Status System
The `chip` prop provides rich status indication with:
- **Four positioning options** - Corner placement control
- **Seven semantic colors** - Maps to common status states (success, error, warning, etc.)
- **Size variants** - Scales with avatar or independently
- **Inset mode** - Critical for circular avatars to keep chip within bounds
- **Standalone mode** - Positions relative to parent for advanced layouts

This eliminates the need for manual status badge composition while remaining flexible.

### NuxtImg Auto-Integration
When `@nuxt/image` is installed, the component automatically upgrades to use `<NuxtImg>` for:
- Automatic image optimization
- Format conversion (WebP/AVIF)
- Responsive image serving
- Lazy loading enhancements

This progressive enhancement happens transparently - developers get optimization without code changes.

### Polymorphic Rendering
The `as` prop enables semantic flexibility:
- `as="button"` for interactive avatars
- `as="a"` for navigable avatars
- Any custom component for advanced use cases

Combined with Vue event handling, this enables avatars to be clickable, hoverable, or purely presentational based on context.

### Nine Size Variants
The granular size system (`3xs` through `3xl`) provides precise control:
- Small sizes (`3xs`, `2xs`, `xs`) for compact UIs, lists, inline mentions
- Medium sizes (`sm`, `md`, `lg`) for standard profile displays
- Large sizes (`xl`, `2xl`, `3xl`) for hero sections, profile headers

Each size automatically adjusts width, height, and font size for optimal appearance.

### CSS Mask Shape System
The documented squircle pattern demonstrates how CSS masks enable arbitrary shapes:
- Circular by default (universal pattern)
- Square/rounded-square via class overrides
- Custom shapes via SVG mask data URIs
- Maintains all functionality regardless of shape

This provides creative freedom without sacrificing component features.

### Standard HTML Image Support
All standard `<img>` attributes pass through:
- `loading="lazy"` for performance
- `crossorigin` for CORS handling
- `decoding` for paint optimization
- `referrerpolicy` for privacy control

This respects web platform conventions while adding component benefits.

## Research Notes

### Documentation Experience
- **Clear and focused**: Single component page with all essential patterns
- **Visual examples**: Size comparisons and chip positioning shown visually
- **Interactive playground**: Live editing of props and styles
- **Code samples**: Copy-paste ready examples for common patterns
- **Theme configuration**: Complete app.config.ts example provided

### Framework Approach Observations

1. **Vue-centric patterns**: Relies on Vue's reactivity and prop system. No explicit state management needed.

2. **Tailwind-first styling**: Deep integration with Tailwind CSS via `ui` prop slot system and utility classes.

3. **Progressive enhancement**: NuxtImg integration happens automatically when available - graceful degradation to standard `<img>`.

4. **Composition-friendly**: Designed to work within Tooltip, Button, and other components without special handling.

5. **Config-driven theming**: Global `app.config.ts` configuration enables site-wide consistency.

6. **String-based icons**: Uses `"i-lucide-*"` pattern suggesting integration with icon resolution system (likely auto-import).

7. **Slot-based customization**: The `ui` prop targets specific component slots (root, image, fallback, icon) for granular control.

8. **Zero-runtime size variants**: Size variants compile to CSS classes, no JavaScript computation needed.

9. **Semantic HTML**: Allows rendering as appropriate elements (`span`, `button`, `a`) based on context.

10. **TypeScript-first**: Strong typing for props, chip configuration, and size variants.

### Implementation Patterns

1. **Fallback priority system**: Clear priority hierarchy prevents display failures
2. **Chip as object**: Boolean shorthand or detailed object configuration - flexible API
3. **Auto-initials extraction**: Clever dual-use of `alt` prop (accessibility + functionality)
4. **CSS inheritance**: Uses `rounded-[inherit]` for image to match container shape
5. **Flexbox centering**: Consistent centering of fallback content via flex utilities
6. **Mask customization**: CSS masks provide shape flexibility without component complexity
7. **Polymorphic base**: Renders as appropriate element without wrapper divs

### Comparison to Other Frameworks

**Strengths**:
- Robust four-tier fallback system (most frameworks only handle 2-3)
- Sophisticated chip system with positioning and inset options
- NuxtImg auto-integration for zero-config optimization
- Nine size variants (more granular than typical 3-5 options)
- CSS mask shape support documented and demonstrated
- Full HTML img attribute support
- Clean composition with Tooltip and other components

**Unique Features**:
- Auto-initials extraction from alt prop (uncommon pattern)
- Chip inset mode for circular boundary respect
- Chip standalone mode for advanced positioning
- Automatic NuxtImg upgrade when available
- String-based icon identifiers

**Limitations**:
- No built-in AvatarGroup on this page (separate component)
- No built-in border/ring variants (CSS-only)
- No built-in hover states (CSS-only)
- No image loading state indicators (relies on browser behavior)
- No explicit error handling callbacks

### Vue-Specific Patterns

1. **Prop reactivity**: All props are reactive by default - no manual subscription needed
2. **Event handling**: Standard Vue event system (`@click`, `@mouseenter`, etc.)
3. **Template composition**: Works naturally with Vue conditional rendering and loops
4. **Scoped styles**: CSS masks and custom shapes use scoped styles
5. **Component wrapping**: Tooltip integration via standard Vue component composition

### Potential Learning Points for Semantic UI

1. **Four-tier fallback system**: Icon → Text → Initials hierarchy is more robust than typical implementations

2. **Chip inset mode**: The `inset` option solving circular avatar badge positioning is a thoughtful UX detail

3. **Auto-initials extraction**: Dual-purpose `alt` prop reduces API surface while adding functionality

4. **Size granularity**: Nine size options provides better design system coverage than typical 3-5

5. **CSS mask documentation**: Showing how to extend shape options empowers advanced users

6. **NuxtImg auto-upgrade**: Progressive enhancement pattern worth considering for other components

7. **Chip positioning**: Four-corner positioning with size/color control is more flexible than typical boolean badge prop

8. **Polymorphic rendering**: The `as` prop pattern enables semantic HTML without component variants

9. **Standard attribute passthrough**: Supporting all `<img>` attributes respects platform conventions

10. **Slot-based theming**: The `ui` prop targeting specific slots (root, image, fallback, icon) provides precise control

### Accessibility Considerations

- `alt` prop provides semantic description for screen readers
- Automatic initials fallback provides visual context when alt text is present
- Polymorphic rendering enables proper button/link semantics
- Standard HTML attributes (alt, loading) supported
- No ARIA attributes explicitly documented (relies on semantic HTML)

### Performance Considerations

- Lazy loading support via standard `loading` attribute
- NuxtImg auto-optimization when available
- CSS-only size variants (no runtime computation)
- Mask-based shapes use GPU-accelerated rendering
- Automatic width/height attributes prevent layout shift

### Migration Considerations for Semantic UI

If adapting this pattern to Semantic UI:

1. **Fallback hierarchy**: Implement signal-based fallback state management for four-tier system
2. **Chip positioning**: Consider compound component pattern (Avatar + AvatarChip) vs. object prop
3. **Size system**: Map Vue size variants to attribute-based system (`size="lg"` or boolean `large`)
4. **Shape variants**: Evaluate CSS custom properties vs. mask-based approach for Shadow DOM
5. **Icon integration**: Consider string identifiers vs. component composition for icon fallback
6. **Image optimization**: Evaluate equivalent to NuxtImg integration for automatic optimization
7. **Initials extraction**: Implement utility for extracting initials from alt/name attributes
8. **Semantic rendering**: Consider `as` prop equivalent in web components context
9. **Status badges**: Evaluate dedicated chip component vs. integrated chip prop
10. **Accessibility**: Ensure ARIA roles and labels for interactive avatars

### Notable Distinctions vs Other Frameworks

**vs React Avatar Components**:
- More sophisticated fallback system (4 tiers vs typical 2-3)
- Chip inset mode uncommon in React implementations
- NuxtImg auto-integration pattern not present in React equivalents

**vs Material-UI Avatar**:
- More size options (9 vs 4 in Material-UI)
- Chip positioning more flexible than Material-UI badge
- CSS mask shapes documented vs Material-UI variant approach

**vs Chakra UI Avatar**:
- Similar fallback hierarchy but auto-initials more elegant
- Chip system more sophisticated than Chakra badge integration
- Vue reactivity simpler than Chakra's prop management

**vs Ant Design Avatar**:
- Comparable feature set but different API design
- Nuxt UI's chip system more flexible than Ant Design badge
- Better documentation of custom shape patterns

**Universal Patterns Present**:
- Image primary, fallback secondary (all frameworks)
- Size variants (standard across frameworks)
- Status indicators (common but implementation varies)
- Circular default shape (universal convention)

**Framework-Specific Advantages**:
- Vue reactivity makes prop updates seamless
- Tailwind integration provides utility-first customization
- Nuxt ecosystem integration (NuxtImg, auto-imports)
- Composition API patterns for complex interactions
