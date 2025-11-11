# Nuxt UI - Badge Component Usage Patterns

## Research Metadata
- **Framework**: Nuxt UI (Vue)
- **Component**: Badge
- **Documentation URL**: https://ui.nuxt.com/components/badge
- **Research Date**: 2025-11-04
- **URL Status**: ✅ Working (via web search extraction)
- **Version**: Current (v3 documentation available)

---

## Component Definition

**Purpose**: A compact labeling component for displaying status, categorization, and notification indicators.

**Mental Model**: Badge is a **flexible label** component designed to:
- Display status indicators and labels
- Show categorization and tagging
- Present inline information with icons or avatars
- Provide visual coding through colors and variants

**Key Characteristic**: Standalone inline element with rich composition options via slots; supports both simple text labels and complex content with icons/avatars.

---

## Documentation Quality

**Comprehensive** - Well-documented with clear API reference, extensive examples, and theming system. Interactive examples demonstrate all variants, colors, and sizes. Strong focus on customization through the `ui` prop system.

---

## Component Definition Comparison

### Nuxt UI Approach
Unlike frameworks that separate Badge and Tag components:
- **Single Badge component** handles both notification indicators and labeling
- **No separate Tag/Chip component** in core library
- **Flexible composition** via slots and props
- **Variant system** provides visual differentiation (solid/soft/outline/subtle)

---

## Pattern Support Levels

### Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via default slot or `label` prop |
| Icon support | ✅ | Native | `icon` prop with leading/trailing positioning |
| Avatar support | ✅ | Native | `avatar` prop with image/fallback support |
| Custom content | ✅ | Composed | Via default slot (can include any Vue components) |
| Leading/trailing | ✅ | Native | Dedicated slots and props for positioning |

### Variant Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Solid variant | ✅ | Native | Filled background, default variant |
| Soft variant | ✅ | Native | Subtle background with color tint |
| Outline variant | ✅ | Native | Border with transparent background |
| Subtle variant | ✅ | Native | Minimal styling, text-colored |

### Color System Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Semantic colors | ✅ | Native | primary, secondary, success, info, warning, error, neutral |
| Theme colors | ✅ | Native | All colors from `ui.colors` configuration |
| White/Black | ✅ | Native | Special handling with pre-defined variants |
| Custom colors | ✅ | Native | Full theme system integration |

### Size Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Extra small (xs) | ✅ | Native | `text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm` |
| Small (sm) | ✅ | Native | `text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm` |
| Medium (md) | ✅ | Native | `text-xs px-2 py-1 gap-1 rounded-md` |
| Large (lg) | ✅ | Native | Size option available |
| Extra large (xl) | ✅ | Native | Size option available |

### Composition Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Slot-based content | ✅ | Native | Default slot for main content |
| Leading slot | ✅ | Native | `#leading` slot for icons/avatars |
| Trailing slot | ✅ | Native | `#trailing` slot for icons |
| Multiple slots | ✅ | Native | base, label, leadingIcon, leadingAvatar, leadingAvatarSize, trailingIcon |

### Customization Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ui prop system | ✅ | Native | Component-level style overrides via `ui` prop |
| class prop | ✅ | Native | Direct class overrides |
| Global theming | ✅ | Native | `app.config.ts` configuration |
| Per-instance styling | ✅ | Native | `ui` and `class` props |

---

## API Props Reference

### Main Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **label** | `string` | - | Badge text content (alternative to default slot) | Level 1 |
| **color** | `string` | `'primary'` | Color scheme from theme | Level 1 |
| **variant** | `'solid' \| 'outline' \| 'soft' \| 'subtle'` | `'solid'` | Visual variant style | Level 1 |
| **size** | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant | Level 1 |
| **icon** | `string` | - | Icon name (e.g., 'i-lucide-rocket') | Level 1 |
| **leading** | `boolean` | - | Position icon at leading edge | Level 1 |
| **trailing** | `boolean` | - | Position icon at trailing edge | Level 1 |
| **avatar** | `object` | - | Avatar configuration (src, alt, etc.) | Level 1 |
| **ui** | `object` | - | Component-level style customization | Level 1 |
| **class** | `string` | - | Additional CSS classes | Level 1 |

### Available Colors

**Semantic Colors:**
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `success` - Green success indicator
- `info` - Blue informational
- `warning` - Orange/yellow warning
- `error` - Red error state
- `neutral` - Gray/neutral

**Plus:** All colors from `ui.colors` configuration, including `white` and `black` with pre-defined variants.

---

## Available Slots

| Slot Name | Purpose | Content Type |
|-----------|---------|--------------|
| **default** | Main badge content | Text, components, mixed content |
| **leading** | Leading icon/avatar area | Icons, avatars, custom components |
| **trailing** | Trailing icon area | Icons, custom components |
| **base** | Root element styling hook | CSS classes |
| **label** | Label text styling hook | CSS classes |
| **leadingIcon** | Leading icon styling hook | CSS classes |
| **leadingAvatar** | Leading avatar styling hook | CSS classes |
| **leadingAvatarSize** | Avatar size configuration | Size value |
| **trailingIcon** | Trailing icon styling hook | CSS classes |

---

## Code Examples

### Basic Usage

```vue
<template>
  <!-- Simple text badge -->
  <UBadge>Badge</UBadge>

  <!-- Using label prop -->
  <UBadge label="Badge Text" />
</template>
```

### Variant Examples

```vue
<template>
  <!-- Solid variant (default) -->
  <UBadge variant="solid" color="primary">
    Solid
  </UBadge>

  <!-- Soft variant -->
  <UBadge variant="soft" color="success">
    Soft
  </UBadge>

  <!-- Outline variant -->
  <UBadge variant="outline" color="info">
    Outline
  </UBadge>

  <!-- Subtle variant -->
  <UBadge variant="subtle" color="warning">
    Subtle
  </UBadge>
</template>
```

### Color Examples

```vue
<template>
  <!-- Semantic colors -->
  <UBadge color="primary">Primary</UBadge>
  <UBadge color="secondary">Secondary</UBadge>
  <UBadge color="success">Success</UBadge>
  <UBadge color="info">Info</UBadge>
  <UBadge color="warning">Warning</UBadge>
  <UBadge color="error">Error</UBadge>
  <UBadge color="neutral">Neutral</UBadge>

  <!-- Special colors -->
  <UBadge color="white">White</UBadge>
  <UBadge color="black">Black</UBadge>
</template>
```

### Size Examples

```vue
<template>
  <UBadge size="xs">Extra Small</UBadge>
  <UBadge size="sm">Small</UBadge>
  <UBadge size="md">Medium</UBadge>
  <UBadge size="lg">Large</UBadge>
  <UBadge size="xl">Extra Large</UBadge>
</template>
```

### Icon Usage

```vue
<template>
  <!-- Icon with text -->
  <UBadge icon="i-lucide-rocket" color="primary">
    Launch
  </UBadge>

  <!-- Leading icon (explicit) -->
  <UBadge icon="i-lucide-check" leading color="success">
    Verified
  </UBadge>

  <!-- Trailing icon -->
  <UBadge icon="i-lucide-x" trailing color="error">
    Close
  </UBadge>

  <!-- Icon only -->
  <UBadge icon="i-lucide-star" />
</template>
```

### Avatar Usage

```vue
<template>
  <!-- Avatar with text -->
  <UBadge
    :avatar="{ src: 'https://github.com/nuxt.png' }"
    size="md"
    color="neutral"
    variant="outline"
  >
    Nuxt Team
  </UBadge>

  <!-- Avatar with fallback -->
  <UBadge
    :avatar="{ src: 'invalid.png', alt: 'User', fallback: 'U' }"
    color="primary"
  >
    User Badge
  </UBadge>
</template>
```

### Slot-Based Composition

```vue
<template>
  <!-- Leading slot -->
  <UBadge color="success">
    <template #leading>
      <Icon name="i-lucide-check-circle" />
    </template>
    Success
  </UBadge>

  <!-- Trailing slot -->
  <UBadge color="info">
    Information
    <template #trailing>
      <Icon name="i-lucide-info" />
    </template>
  </UBadge>

  <!-- Complex composition -->
  <UBadge variant="soft" color="primary">
    <template #leading>
      <UAvatar src="https://example.com/avatar.jpg" size="3xs" />
    </template>
    <span class="font-semibold">Premium User</span>
    <template #trailing>
      <Icon name="i-lucide-crown" class="text-yellow-500" />
    </template>
  </UBadge>
</template>
```

### UI Prop Customization

```vue
<template>
  <!-- Customize specific parts -->
  <UBadge
    :ui="{
      base: 'font-bold',
      label: 'uppercase tracking-wide',
      leadingIcon: 'text-lg'
    }"
    icon="i-lucide-star"
    color="warning"
  >
    Featured
  </UBadge>

  <!-- Override variant styles -->
  <UBadge
    :ui="{
      variant: {
        solid: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      }
    }"
    variant="solid"
  >
    Gradient Badge
  </UBadge>
</template>
```

### Class Prop Override

```vue
<template>
  <!-- Add custom classes -->
  <UBadge class="font-bold rounded-full shadow-lg">
    Custom Badge
  </UBadge>

  <!-- Override default styles -->
  <UBadge class="!bg-purple-600 !text-white">
    Force Style
  </UBadge>
</template>
```

### Global Configuration Example

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    badge: {
      // Default props
      default: {
        size: 'md',
        variant: 'solid',
        color: 'primary'
      },
      // Custom size definitions
      size: {
        xs: 'text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm',
        sm: 'text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm',
        md: 'text-xs px-2 py-1 gap-1 rounded-md',
        lg: 'text-sm px-2.5 py-1.5 gap-1.5 rounded-md',
        xl: 'text-base px-3 py-2 gap-2 rounded-lg'
      },
      // Custom variant styles
      variant: {
        solid: 'bg-{color}-500 text-white',
        soft: 'bg-{color}-50 text-{color}-600',
        outline: 'ring-1 ring-{color}-500 text-{color}-500',
        subtle: 'text-{color}-500'
      },
      // Icon sizing per badge size
      leadingIconSize: {
        xs: 'size-3',
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-4.5',
        xl: 'size-5'
      }
    }
  }
})
```

---

## Notable Features

### 1. Unified Badge Component
Unlike many frameworks that split Badge (notifications) and Tag (labels), Nuxt UI provides a single Badge component that handles both use cases through variant and color options.

### 2. Powerful ui Prop System
The `ui` prop allows deep customization without creating wrapper components:
- Override any internal slot styling
- Customize variants on a per-instance basis
- Maintain type safety through TypeScript
- No need for CSS imports or external stylesheets

### 3. Icon Integration
Native icon support with positioning:
- Iconify icons via naming convention (`i-lucide-rocket`)
- Leading/trailing positioning
- Automatic sizing based on badge size
- Slot-based customization for complex cases

### 4. Avatar Support
Built-in avatar composition:
- Image source with fallback
- Automatic sizing relative to badge size
- Can combine avatar with text and icons
- Integrated with Nuxt UI Avatar component

### 5. Vue-Specific Patterns
Full Vue composition features:
- Reactive props
- Named slots for content projection
- Scoped slots for advanced customization
- Template-based composition

### 6. Tailwind Integration
Deep Tailwind CSS integration:
- Arbitrary value support (e.g., `text-[8px]/3`)
- Dynamic color token system
- Utility class customization
- JIT compilation support

### 7. Four Distinct Variants
Clear visual hierarchy:
- **Solid**: High emphasis, filled background
- **Soft**: Medium emphasis, subtle background
- **Outline**: Low emphasis, bordered
- **Subtle**: Minimal emphasis, text-only

---

## Size Variant Details

### Extra Small (xs)
```
text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm
Icon size: size-3
Avatar size: 3xs
```
**Use case**: Dense layouts, minimal space

### Small (sm)
```
text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm
Icon size: size-3.5
```
**Use case**: Compact UI, lists

### Medium (md) - Default
```
text-xs px-2 py-1 gap-1 rounded-md
Icon size: size-4
```
**Use case**: Standard badges, inline content

### Large (lg)
```
text-sm px-2.5 py-1.5 gap-1.5 rounded-md
Icon size: size-4.5
```
**Use case**: Prominent labels, headers

### Extra Large (xl)
```
text-base px-3 py-2 gap-2 rounded-lg
Icon size: size-5
```
**Use case**: Hero sections, marketing

---

## Implementation Philosophy

### Design Principles

1. **Composition over Configuration**
   - Slots provide flexibility
   - Props handle common cases
   - Both approaches are first-class

2. **Customization Hierarchy**
   - Global config for defaults
   - Component `ui` prop for instances
   - `class` prop for overrides
   - Slots for structure changes

3. **Type Safety**
   - TypeScript definitions for all props
   - Autocomplete for variant/color/size
   - Type-safe `ui` prop structure

4. **Performance**
   - Minimal runtime overhead
   - Tailwind JIT compilation
   - No CSS-in-JS runtime cost

### Vue-Specific Patterns

**Reactivity:**
```vue
<script setup>
const status = ref('active')
const badgeColor = computed(() =>
  status.value === 'active' ? 'success' : 'neutral'
)
</script>

<template>
  <UBadge :color="badgeColor">
    {{ status }}
  </UBadge>
</template>
```

**Conditional Rendering:**
```vue
<template>
  <UBadge
    v-if="showBadge"
    :variant="isImportant ? 'solid' : 'soft'"
    :color="isError ? 'error' : 'success'"
  >
    {{ message }}
  </UBadge>
</template>
```

**Dynamic Content:**
```vue
<template>
  <UBadge
    v-for="tag in tags"
    :key="tag.id"
    :color="tag.color"
    :icon="tag.icon"
  >
    {{ tag.label }}
  </UBadge>
</template>
```

---

## Accessibility Considerations

### Semantic HTML
- Uses semantic `<span>` element
- ARIA attributes can be added via `ui` prop
- Proper color contrast in all variants

### Color Accessibility
- Semantic color names provide meaning
- Should not rely on color alone for information
- Text labels always provided alongside colors

### Icon Accessibility
- Icons should be decorative or have labels
- Use `aria-label` when icon-only badges convey meaning
- Icon sizing ensures visibility

---

## Pattern Support Summary

### Core Features (Level 1)
| Feature | Support | Notes |
|---------|---------|-------|
| Text content | ✅ Native | Default slot or label prop |
| Color variants | ✅ Native | 7 semantic + theme colors |
| Visual variants | ✅ Native | 4 variants (solid/soft/outline/subtle) |
| Size variants | ✅ Native | 5 sizes (xs to xl) |
| Icon support | ✅ Native | Leading/trailing positioning |
| Avatar support | ✅ Native | Full avatar integration |
| Customization | ✅ Native | ui prop + class prop + global config |

### Composition Features (Level 1)
| Feature | Support | Notes |
|---------|---------|-------|
| Default slot | ✅ Native | Main content area |
| Leading slot | ✅ Native | Icon/avatar placement |
| Trailing slot | ✅ Native | Icon placement |
| Multi-slot | ✅ Native | Multiple styling hooks |

### Advanced Features (Level 2)
| Feature | Support | Notes |
|---------|---------|-------|
| Global theming | ✅ Native | app.config.ts configuration |
| Per-instance styling | ✅ Native | ui prop system |
| Arbitrary values | ✅ Native | Tailwind arbitrary syntax |
| Type safety | ✅ Native | Full TypeScript support |

---

## Research Notes

### Data Collection Method
- Web search extraction from official Nuxt UI documentation
- Multiple searches for API details, examples, and configuration
- GitHub source code references for theme structure
- Research date: 2025-11-04

### Documentation Quality
- **Excellent**: Comprehensive API documentation
- **Interactive**: Live examples for all features
- **Well-organized**: Clear separation of concerns
- **Modern**: Up-to-date with latest Vue/Nuxt patterns

### Framework Version Notes
- Current documentation reflects v3 (latest)
- v2 documentation also available at ui2.nuxt.com
- Breaking changes between versions in theming system
- Migration guides available

### Limitations
- Direct URL fetching blocked by network restrictions
- Relied on web search result extraction
- Some advanced theming details may require source code review
- Complete slot API may have additional undocumented options

---

## Recommendations for Semantic UI

### Badge Implementation Priority

**Must-Have (Level 1)**:
1. ✅ Text content via slot or prop
2. ✅ Four variant system (solid/soft/outline/subtle)
3. ✅ Semantic color system (success/warning/error/info)
4. ✅ Size variants (at least xs/sm/md/lg)
5. ✅ Icon support with positioning
6. ✅ Customization via settings

**Should-Have (Level 2)**:
1. ✅ Avatar integration
2. ✅ Slot-based composition
3. ✅ Leading/trailing positioning
4. ✅ Theme color integration
5. ✅ Multiple styling hooks

**Consider**:
- ui prop-style deep customization
- Global configuration system
- Arbitrary Tailwind value support (if using Semantic UI Tailwind plugin)
- TypeScript prop definitions

### Semantic UI Differentiators

**Natural Language Patterns**:
- Consider: `<ui-badge emphasis="high">` vs `<ui-badge variant="solid">`
- Consider: `<ui-badge status="success">` alongside `<ui-badge color="success">`
- Leverage: Natural positioning (`leading`/`trailing` is more intuitive than `left`/`right`)

**Settings Architecture**:
- Reactive settings for color, variant, size
- Settings-based avatar configuration
- Icon settings for name and position

**Component Composition**:
- Default slot for main content (matches Nuxt UI pattern)
- Named slots for leading/trailing (proven pattern)
- Settings for icon/avatar (simpler than props in some cases)

**Shadow DOM Considerations**:
- Nuxt UI uses scoped styles, Semantic UI uses Shadow DOM
- May need different styling approach for icons/avatars
- Slot composition works well with Shadow DOM

### Key Insights

1. **Single Component Approach**: Nuxt UI successfully handles both badge and tag use cases with one component through variants. This reduces API surface area.

2. **Variant Clarity**: Four variants (solid/soft/outline/subtle) provide clear visual hierarchy without overwhelming options.

3. **Icon Integration**: Native icon support with positioning is table stakes for modern badge components.

4. **Customization Layers**: Three-tier customization (global → ui prop → class) provides flexibility while maintaining defaults.

5. **Vue Patterns**: Slot-based composition and reactive props are powerful patterns that could map to Semantic UI's template system.

### Implementation Suggestions

**For Semantic UI Badge:**

```javascript
// Potential API
defineComponent({
  name: 'ui-badge',
  defaultSettings: {
    variant: 'solid',  // solid | soft | outline | subtle
    color: 'primary',   // semantic colors
    size: 'md',         // xs | sm | md | lg | xl
    icon: null,         // icon name
    iconPosition: 'leading', // leading | trailing
  },
  template: `
    <span class="ui-badge {variant} {color} {size}">
      {#if icon && iconPosition === 'leading'}
        <ui-icon name="{icon}" class="leading-icon" />
      {/if}

      <slot name="leading"></slot>

      <slot><!-- default content --></slot>

      <slot name="trailing"></slot>

      {#if icon && iconPosition === 'trailing'}
        <ui-icon name="{icon}" class="trailing-icon" />
      {/if}
    </span>
  `
})
```

**Usage:**
```html
<!-- Simple text badge -->
<ui-badge>Label</ui-badge>

<!-- With icon -->
<ui-badge icon="check" color="success">Verified</ui-badge>

<!-- Slot composition -->
<ui-badge variant="soft" color="primary">
  {#slot leading}
    <ui-avatar src="user.jpg" />
  {/slot}
  Premium User
  {#slot trailing}
    <ui-icon name="crown" />
  {/slot}
</ui-badge>

<!-- Settings-based -->
<ui-badge
  .settings="{ variant: 'outline', color: 'info', size: 'sm' }"
>
  Information
</ui-badge>
```

### Nuxt UI Badge vs Semantic UI Opportunities

**What Nuxt UI does well:**
- Clear variant system
- Icon integration
- Customization flexibility
- Single component for multiple use cases

**Semantic UI can improve on:**
- Natural language settings (`emphasis` vs `variant`)
- Shadow DOM encapsulation
- Web component interoperability
- Settings-based reactivity vs props
- Template-first composition

**Unique Semantic UI advantages:**
- Native web components (framework-agnostic)
- Shadow DOM style encapsulation
- Signals-based reactivity
- No build step required
- Progressive enhancement

---

## Conclusion

Nuxt UI's Badge component demonstrates a mature, flexible approach to badge/label UI elements. The four-variant system (solid/soft/outline/subtle) provides clear visual hierarchy, while the unified component API handles both notification badges and content labels effectively.

Key takeaways for Semantic UI:
1. Single component can handle multiple use cases (badge + tag)
2. Four variants provide sufficient visual variety
3. Icon and avatar support are essential features
4. Slot-based composition enables complex layouts
5. Multiple customization layers (global/instance/override) balance defaults and flexibility

The Nuxt UI Badge component represents a Level 1 (Universal) pattern for modern UI frameworks, making it an excellent reference for Semantic UI implementation.
