# Nuxt UI - Card Usage Patterns

## Component URL
https://ui.nuxt.com/components/card
Status: ✅ Working

## Documentation Quality
**Good** - Clear prop documentation with code examples, visual previews, and variant demonstrations. Documentation is concise but covers all essential patterns.

## Component Definition
- **Core purpose**: Provides a structured container for organizing content with header, body, and footer sections
- **Mental model**: A bordered/styled box that groups related content with optional header and footer zones for titles, metadata, and actions
- **Semantic meaning**: Represents a self-contained unit of content that can be composed into larger layouts or used standalone

## Container Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic container | ✅ | Default div element with styling (can be customized via `as` prop) |
| Three-zone layout | ✅ | Header slot, default body slot, footer slot with distinct padding |
| Semantic rendering | ✅ | `as` prop allows rendering as any HTML element or component |
| Shadow DOM | ❌ | Standard Vue component, no shadow DOM encapsulation |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Header content | ✅ | `#header` slot for titles, actions, metadata |
| Body content | ✅ | Default slot for main content |
| Footer content | ✅ | `#footer` slot for actions, links, secondary info |
| Rich content | ✅ | All slots accept any Vue components or HTML |
| Empty states | ✅ | All slots are optional, can use any combination |

## Layout Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Slot-based composition | ✅ | Vue slots for header, body, footer organization |
| Responsive padding | ✅ | Default: `p-4 sm:px-6` (header/footer), `p-4 sm:p-6` (body) |
| Grid layouts | ✅ | Cards work well in CSS Grid or Flexbox layouts |
| Nesting support | ✅ | Cards can contain other cards with different variants |
| Content zones | ✅ | Three distinct, optional zones with independent styling |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Visual variants | ✅ | `solid`, `outline` (default), `soft`, `subtle` |
| Custom styling | ✅ | `ui` prop for granular control (root, header, body, footer) |
| Size options | ❌ | No built-in size variants; controlled via custom ui prop |
| Color themes | ❌ | No color prop; uses design system tokens via ui prop |
| Border radius | ⚠️ | Controlled through ui prop customization or global config |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Clickable cards | ✅ | `as="a"` or `as="button"` for navigation/interaction |
| href/to props | ✅ | Standard link props when using `as="a"` |
| Hover states | ⚠️ | No built-in hover styles; added via Tailwind classes |
| Interactive elements | ✅ | Can contain buttons, forms, inputs in any slot |
| Conditional rendering | ✅ | Vue directives (`v-if`, `v-show`) work with slots |

## Styling Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Tailwind integration | ✅ | Deep integration via `ui` prop for class customization |
| Design tokens | ✅ | Uses Nuxt UI design system colors and spacing |
| Global theming | ✅ | `app.config.ts` for site-wide card configuration |
| Per-instance styling | ✅ | `:ui="{ root, header, body, footer }"` prop |
| Variant system | ✅ | Four predefined variants with distinct visual styles |
| CSS modules | ❌ | Not applicable; uses Tailwind utility classes |

## Code Examples

### Basic Card Structure
```vue
<template>
  <UCard>
    <template #header>
      <h3>Card Title</h3>
    </template>

    <p>Main content goes here</p>

    <template #footer>
      <button>Action</button>
    </template>
  </UCard>
</template>
```

### Minimal Card (Body Only)
```vue
<template>
  <UCard>
    <p>Simple card with just body content</p>
  </UCard>
</template>
```

### Card Variants
```vue
<template>
  <!-- Outline (default) - border with ring -->
  <UCard variant="outline">
    Outline card
  </UCard>

  <!-- Solid - inverted colors -->
  <UCard variant="solid">
    Solid card
  </UCard>

  <!-- Soft - elevated background with opacity -->
  <UCard variant="soft">
    Soft card
  </UCard>

  <!-- Subtle - elevated background with ring -->
  <UCard variant="subtle">
    Subtle card
  </UCard>
</template>
```

### Custom Styling via UI Prop
```vue
<template>
  <UCard
    :ui="{
      root: 'shadow-xl rounded-xl',
      header: 'bg-blue-50 p-6',
      body: 'p-8',
      footer: 'bg-gray-50 p-4'
    }"
  >
    <template #header>Custom Styled Header</template>
    Custom styled content
    <template #footer>Custom Styled Footer</template>
  </UCard>
</template>
```

### Clickable/Navigable Card
```vue
<template>
  <!-- As link -->
  <UCard as="a" href="/details" class="hover:shadow-lg transition">
    <template #header>Clickable Card</template>
    Navigate to details page
  </UCard>

  <!-- As button -->
  <UCard as="button" @click="handleClick" class="hover:shadow-lg transition">
    <template #header>Interactive Card</template>
    Click to perform action
  </UCard>
</template>
```

### Rich Content Card
```vue
<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Title</h2>
        <UButton size="xs">Edit</UButton>
      </div>
    </template>

    <div class="space-y-4">
      <p>Content section 1</p>
      <p>Content section 2</p>
      <img src="/image.jpg" alt="Content" class="rounded" />
    </div>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton variant="solid">Save</UButton>
        <UButton variant="ghost">Cancel</UButton>
      </div>
    </template>
  </UCard>
</template>
```

### Grid Layout with Cards
```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard v-for="item in items" :key="item.id">
      <template #header>{{ item.title }}</template>
      {{ item.description }}
      <template #footer>
        <UButton @click="viewDetails(item)">View</UButton>
      </template>
    </UCard>
  </div>
</template>
```

### Nested Cards
```vue
<template>
  <UCard variant="outline">
    <template #header>Parent Card</template>

    <div class="space-y-4">
      <UCard variant="subtle">
        <template #header>Nested Card 1</template>
        Nested content
      </UCard>

      <UCard variant="subtle">
        <template #header>Nested Card 2</template>
        More nested content
      </UCard>
    </div>
  </UCard>
</template>
```

### Conditional Content Card
```vue
<template>
  <UCard>
    <template #header>
      {{ isLoading ? 'Loading...' : 'Data Loaded' }}
    </template>

    <USkeleton v-if="isLoading" class="h-20" />
    <div v-else>
      <p>{{ data.content }}</p>
    </div>

    <template #footer v-if="!isLoading">
      <UButton @click="refresh">Refresh</UButton>
    </template>
  </UCard>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)
const data = ref({ content: 'Some data' })

const refresh = () => {
  isLoading.value = true
  // Fetch data...
}
</script>
```

### Form Card
```vue
<template>
  <UCard>
    <template #header>
      <h2>Contact Form</h2>
    </template>

    <UForm :state="form" @submit="onSubmit" class="space-y-4">
      <UFormField name="name" label="Name">
        <UInput v-model="form.name" />
      </UFormField>

      <UFormField name="email" label="Email">
        <UInput v-model="form.email" type="email" />
      </UFormField>

      <UFormField name="message" label="Message">
        <UTextarea v-model="form.message" />
      </UFormField>
    </UForm>

    <template #footer>
      <div class="flex gap-2">
        <UButton type="submit" @click="onSubmit">Submit</UButton>
        <UButton variant="ghost" @click="reset">Reset</UButton>
      </div>
    </template>
  </UCard>
</template>
```

## Global Theme Configuration
```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: 'rounded-lg overflow-hidden shadow-sm',
        header: 'p-4 sm:px-6 border-b border-gray-200',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6 border-t border-gray-200'
      },
      variants: {
        variant: {
          solid: {
            root: 'bg-inverted text-inverted'
          },
          outline: {
            root: 'bg-default ring ring-default divide-y divide-default'
          },
          soft: {
            root: 'bg-elevated-50'
          },
          subtle: {
            root: 'bg-elevated ring ring-default'
          }
        }
      }
    }
  }
})
```

## Notable Features

### Flexible Content Organization
The three-slot system (header, body, footer) provides clear content zones without being prescriptive. Each slot is completely optional, allowing:
- Body-only cards for simple content
- Header + body for titled content blocks
- Full three-zone cards for complex UI elements
- Any combination that suits the use case

### Vue Slot Architecture
Uses standard Vue slot patterns for maximum flexibility:
- Named slots for header and footer
- Default slot for body content
- Scoped slots not required (unlike some frameworks)
- Clean, declarative composition

### Tailwind-First Customization
The `ui` prop provides direct access to Tailwind classes at four levels:
- `root` - Container styling (border, shadow, background)
- `header` - Header zone styling (padding, border, background)
- `body` - Body zone styling (padding, spacing)
- `footer` - Footer zone styling (padding, border, background)

This allows granular control while maintaining the component's structure.

### Variant System
Four predefined variants provide visual variety:
1. **Outline** (default) - Clean borders with ring for focus states
2. **Solid** - Inverted colors for emphasis or dark theme
3. **Soft** - Subtle elevated background for gentle separation
4. **Subtle** - Elevated with ring for more defined boundaries

### Semantic Flexibility
The `as` prop allows cards to be rendered as any element or component:
- `as="a"` for navigable cards
- `as="button"` for interactive cards
- `as="article"` for semantic HTML
- Any custom component for advanced use cases

### Responsive Design
Default padding uses responsive Tailwind classes:
- Mobile: `p-4` (all zones)
- Desktop: `sm:px-6` (header/footer), `sm:p-6` (body)

This provides better space utilization on smaller screens while maintaining comfortable spacing on larger displays.

## Research Notes

### Documentation Experience
- **Clear structure**: Props, slots, and examples are well-organized
- **Visual examples**: Live previews for each variant
- **Code samples**: Copy-paste ready examples for common patterns
- **Minimal but sufficient**: Covers essential patterns without overwhelming detail

### Framework Approach Observations

1. **Vue-centric patterns**: Leverages Vue slots and directives naturally
2. **Tailwind integration**: Deep, intentional integration with Tailwind ecosystem
3. **Design system alignment**: Variants map to design system primitives
4. **Unstyled foundation**: Component provides structure, not opinionated styling
5. **Configuration over convention**: Global config for consistency, props for variation

### Implementation Patterns

1. **Slot-based composition**: Three optional slots provide flexible content zones
2. **Render flexibility**: `as` prop enables semantic rendering and interactivity
3. **Styling hierarchy**: Global config → variant → ui prop allows multiple customization levels
4. **No built-in interactions**: Component is presentational; interactions added via composition
5. **Responsive defaults**: Sensible mobile-first padding patterns

### Comparison to Other Frameworks

**Strengths**:
- Extremely flexible slot-based architecture
- Clean separation of structure and style
- Powerful ui prop for customization
- Works well in isolation or as part of larger compositions
- Minimal API surface with maximum flexibility

**Limitations**:
- No built-in size variants (small, medium, large)
- No color/theme props (relies on ui customization)
- No built-in hover/focus states for interactive cards
- No loading or disabled states (must be implemented via composition)
- Requires Tailwind knowledge for effective customization

### Vue-Specific Patterns

1. **Named slots**: Standard Vue pattern for content zones
2. **v-if/v-show**: Vue directives work seamlessly with slots
3. **v-for**: Cards work naturally in lists
4. **Scoped slots**: Available but not required (keeps API simple)
5. **Reactivity**: All Vue reactivity features work as expected

### Migration Considerations for Semantic UI

If adapting this pattern to Semantic UI:

1. **Slot translation**: Consider Shadow DOM slot equivalent for header/body/footer
2. **Styling approach**: Evaluate CSS custom properties vs Tailwind classes
3. **Variant mapping**: Map Vue variants to Semantic UI's attribute-based system
4. **Interactivity**: Consider built-in hover/focus states vs composition-based
5. **Size variants**: Determine if size variations should be first-class
6. **Content zones**: Three-zone pattern is universal and should translate well
7. **Semantic rendering**: `as` prop pattern could map to custom element extension
8. **Responsive padding**: Consider token-based responsive spacing system
9. **Component composition**: Cards should support embedding other UI primitives
10. **Accessibility**: Ensure proper ARIA roles when used as navigation or interactive elements
