# Nuxt UI - Drawer Usage Patterns

## Component URL
https://ui.nuxt.com/components/drawer
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Exceptionally well-documented with 16+ interactive code examples, complete prop table with TypeScript types, accessibility guidance, and advanced composition patterns. Covers basic to complex scenarios with clear visual previews.

## Component Definition
- **Core purpose**: A dismissible overlay panel that smoothly slides in from screen edges for displaying contextual content, forms, navigation, or command palettes
- **Mental model**: A side drawer/sheet interface that temporarily overlays the main content, providing focused interaction space without leaving the current page context
- **Semantic meaning**: Represents auxiliary content that supplements the main interface. Used for secondary navigation, settings panels, filters, forms, or detailed views that don't warrant a full page navigation.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Title/Header | ✅ | `title` prop for header text, `#header` slot for custom headers |
| Description | ✅ | `description` prop for subtitle text below title |
| Body content | ✅ | `#body` slot for main content area, `#content` slot for full control |
| Footer actions | ✅ | `#footer` slot for action buttons, forms submission controls |
| Trigger element | ✅ | Default slot for the element that opens the drawer (button, link, etc.) |
| Custom content | ✅ | Complete flexibility through named slots for all sections |
| Command palette | ✅ | Integration with UCommandPalette component for search interfaces |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Directional | ✅ | Four directions: `bottom` (default), `right`, `left`, `top` |
| Modal | ✅ | `modal` prop blocks background interaction when true (default) |
| Non-modal | ✅ | `modal="false"` allows background interaction while open |
| Inset | ✅ | `inset` prop adds spacing from screen edges for floating appearance |
| Nested | ✅ | `nested` prop enables stacking multiple drawers |
| Responsive | ✅ | Can conditionally render as Modal on desktop, Drawer on mobile |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled state | ✅ | `v-model:open` for two-way binding of open/closed state |
| Default state | ✅ | `default-open` prop sets initial visibility |
| Dismissible | ✅ | `dismissible` prop controls whether clicking outside/ESC closes drawer |
| Non-dismissible | ✅ | `dismissible="false"` requires explicit close action |
| Keyboard shortcuts | ✅ | Integration with `defineShortcuts` composable for custom hotkeys |
| Loading | ⚠️ | No built-in loading state; handled via content slots |
| Focus management | ✅ | `onOpenAutoFocus`, `onCloseAutoFocus` callbacks for focus control |

## Interaction Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Drag to dismiss | ✅ | `handle` prop shows draggable handle (default true) |
| Handle-only drag | ✅ | `handle-only` restricts dragging to handle element only |
| Click outside | ✅ | Closes drawer when `dismissible` is true (default) |
| Escape key | ✅ | Closes drawer when `dismissible` is true (default) |
| Programmatic control | ✅ | Control via `v-model:open` binding |
| Pointer events | ✅ | `onPointerDownOutside` callback for custom outside click handling |

## Visual Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Overlay/Backdrop | ✅ | `overlay` prop controls backdrop display (default true) |
| Background scaling | ✅ | `should-scale-background` creates depth effect by scaling background |
| Background color change | ✅ | `set-background-color-on-scale` changes background color during scale |
| Handle indicator | ✅ | Visual drag handle (pill-shaped indicator) |
| Custom styling | ✅ | `:ui` prop for Tailwind class overrides per instance |
| Global theming | ✅ | Configuration via `app.config.ts` for consistent design system |

## Code Examples

### Basic Usage
```vue
<template>
  <UDrawer>
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-up"
    />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

### With Title and Description
```vue
<template>
  <UDrawer
    title="Drawer with description"
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  >
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UDrawer>
</template>
```

### Directional Variants
```vue
<!-- Right side drawer -->
<UDrawer direction="right">
  <UButton label="Open" />
  <template #content>
    <Placeholder class="min-w-96 min-h-96 size-full m-4" />
  </template>
</UDrawer>

<!-- Top drawer -->
<UDrawer direction="top">
  <UButton label="Open" />
  <template #content>
    <Placeholder class="h-48 m-4" />
  </template>
</UDrawer>
```

### Inset Drawer (Floating)
```vue
<template>
  <UDrawer direction="right" inset>
    <UButton label="Open" />
    <template #content>
      <Placeholder class="min-w-96 min-h-96 size-full m-4" />
    </template>
  </UDrawer>
</template>
```

### Controlled State with Keyboard Shortcuts
```vue
<script setup lang="ts">
const open = ref(false)

defineShortcuts({
  o: () => (open.value = !open.value)
})
</script>

<template>
  <UDrawer v-model:open="open">
    <UButton label="Open (or press 'o')" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

### Non-Dismissible with Explicit Close
```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer
    v-model:open="open"
    :dismissible="false"
    :modal="false"
    :handle="false"
  >
    <UButton label="Open" />
    <template #body>
      <div class="flex items-center justify-between gap-4 mb-4">
        <h2 class="text-highlighted font-semibold">Drawer non-dismissible</h2>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="open = false"
        />
      </div>
      <Placeholder class="size-full min-h-48" />
    </template>
  </UDrawer>
</template>
```

### With Footer Actions
```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer
    v-model:open="open"
    title="Drawer with footer"
    description="This is useful when you want a form in a Drawer."
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <UButton label="Open" />
    <template #body>
      <Placeholder class="h-48" />
    </template>
    <template #footer>
      <UButton
        label="Submit"
        color="neutral"
        class="justify-center"
      />
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        class="justify-center"
        @click="open = false"
      />
    </template>
  </UDrawer>
</template>
```

### With Background Scale Effect
```vue
<template>
  <!-- Parent element requires data-vaul-drawer-wrapper attribute -->
  <UDrawer
    should-scale-background
    set-background-color-on-scale
  >
    <UButton label="Open" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

### Responsive: Modal on Desktop, Drawer on Mobile
```vue
<script setup lang="ts">
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'

const [DefineFormTemplate, ReuseFormTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
const open = ref(false)

const state = reactive({
  email: undefined
})

const title = 'Edit profile'
const description = "Make changes to your profile here. Click save when you're done."
</script>

<template>
  <DefineFormTemplate>
    <UForm :state="state" class="space-y-4">
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          placeholder="shadcn@example.com"
          required
        />
      </UFormField>
      <UButton label="Save changes" type="submit" />
    </UForm>
  </DefineFormTemplate>

  <UModal
    v-if="isDesktop"
    v-model:open="open"
    :title="title"
    :description="description"
  >
    <UButton label="Edit profile" color="neutral" variant="outline" />
    <template #body>
      <ReuseFormTemplate />
    </template>
  </UModal>

  <UDrawer
    v-else
    v-model:open="open"
    :title="title"
    :description="description"
  >
    <UButton label="Edit profile" color="neutral" variant="outline" />
    <template #body>
      <ReuseFormTemplate />
    </template>
  </UDrawer>
</template>
```

### Nested Drawers
```vue
<template>
  <UDrawer :ui="{ content: 'h-full', overlay: 'bg-inverted/30' }">
    <UButton label="Open" />
    <template #footer>
      <UDrawer
        nested
        :ui="{ content: 'h-full', overlay: 'bg-inverted/30' }"
      >
        <UButton color="neutral" variant="outline" label="Open nested" />
        <template #content>
          <Placeholder class="flex-1 m-4" />
        </template>
      </UDrawer>
    </template>
  </UDrawer>
</template>
```

### With Command Palette
```vue
<script setup lang="ts">
const searchTerm = ref('')

const { data: users, status } = await useFetch(
  'https://jsonplaceholder.typicode.com/users',
  {
    key: 'command-palette-users',
    params: { q: searchTerm },
    transform: (data: { id: number, name: string, email: string }[]) => {
      return data?.map(user => ({
        id: user.id,
        label: user.name,
        suffix: user.email,
        avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` }
      })) || []
    },
    lazy: true
  }
)

const groups = computed(() => [{
  id: 'users',
  label: searchTerm.value ? `Users matching "${searchTerm.value}"...` : 'Users',
  items: users.value || [],
  ignoreFilter: true
}])
</script>

<template>
  <UDrawer :handle="false">
    <UButton
      label="Search users..."
      color="neutral"
      variant="subtle"
      icon="i-lucide-search"
    />
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        placeholder="Search users..."
        class="h-80"
      />
    </template>
  </UDrawer>
</template>
```

### Without Overlay or Handle
```vue
<template>
  <!-- No backdrop overlay -->
  <UDrawer :overlay="false">
    <UButton label="Open" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>

  <!-- No drag handle -->
  <UDrawer :handle="false">
    <UButton label="Open" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>

  <!-- Drag only by handle -->
  <UDrawer handle-only>
    <UButton label="Open" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

### Non-Modal (Background Interactive)
```vue
<template>
  <UDrawer :modal="false">
    <UButton label="Open" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

## Notable Features

### Built on Vaul Vue
The drawer is powered by Vaul Vue, a headless drawer component library that provides:
- Smooth slide animations with physics-based motion
- Gesture-based drag interactions
- Accessibility primitives and focus management
- Nested drawer support
- Customizable animation curves and behaviors

### Comprehensive Slot Architecture
Unlike simpler drawer implementations, Nuxt UI provides granular control through multiple named slots:
- **Default slot**: Trigger element composition
- **`#content`**: Full drawer content control
- **`#header`**: Custom header rendering
- **`#body`**: Main content area
- **`#footer`**: Action buttons and form controls

This allows developers to compose drawers from semantic sections or take full control via the content slot.

### Responsive Design Pattern
The documentation showcases an elegant pattern for responsive UI by combining:
- `useMediaQuery` composable for breakpoint detection
- `createReusableTemplate` for component logic sharing
- Conditional rendering between Modal and Drawer components
- Shared form state and content

This pattern enables desktop-optimized modals and mobile-optimized drawers with a single codebase.

### Advanced State Management
The drawer supports sophisticated state control through:
- Two-way binding via `v-model:open`
- Integration with Nuxt UI's `defineShortcuts` composable
- Keyboard navigation and dismissal
- Programmatic open/close control
- Focus lifecycle callbacks

### Visual Depth Effects
The `should-scale-background` and `set-background-color-on-scale` props enable Material Design-style depth effects, creating visual hierarchy by scaling and dimming background content when the drawer opens. Requires `data-vaul-drawer-wrapper` attribute on parent element.

### Flexible Interaction Modes
Supports multiple interaction paradigms:
- **Modal drawers**: Block background interaction (default)
- **Non-modal drawers**: Allow background interaction
- **Dismissible drawers**: Close on outside click/ESC (default)
- **Non-dismissible drawers**: Require explicit close action
- **Handle-only drag**: Restrict drag area to handle element

### Command Palette Integration
Seamless integration with UCommandPalette component for creating searchable command interfaces within drawers. Example demonstrates async data fetching, reactive search filtering, and loading states.

### Nested Drawer Support
The `nested` prop enables stacking multiple drawer instances, useful for multi-step workflows or hierarchical navigation. Each drawer maintains its own overlay and state.

### Custom Styling System
The `:ui` prop accepts an object mapping to internal component classes:
- `root`: Main wrapper element
- `content`: Drawer content container
- `overlay`: Backdrop element
- `container`: Content layout container
- `header`, `body`, `footer`: Section-specific styling

Can be customized per-instance or globally via `app.config.ts` for design system consistency.

## Research Notes

### Documentation Experience
- **Outstanding visual design**: Interactive examples with live code editing and preview
- **Comprehensive coverage**: 16+ distinct examples covering basic to advanced scenarios
- **Clear prop documentation**: Complete TypeScript types, defaults, and descriptions
- **Real-world patterns**: Responsive design, form integration, command palette examples
- **Accessibility focus**: Explicit guidance on focus management and keyboard interaction
- **Progressive complexity**: Examples build from simple to complex use cases

### Vue Framework Integration

1. **Vue 3 Composition API**: Heavy use of `ref`, `reactive`, `computed` for state management
2. **Two-way binding**: `v-model:open` directive for controlled components
3. **Composables ecosystem**: Integration with `defineShortcuts`, `useMediaQuery`, `useFetch`
4. **Template reusability**: `createReusableTemplate` pattern for shared component logic
5. **Named slots**: Semantic slot names for component composition
6. **Scoped slots**: Access to internal UI configuration via scoped slot props
7. **Conditional rendering**: `v-if`/`v-else` for responsive component switching

### Implementation Patterns

1. **Prop-driven configuration**: All behavior controlled via boolean and string props
2. **Slot-based composition**: Flexible content structure through named slots
3. **Controlled component pattern**: State management via `v-model` directive
4. **Render function flexibility**: `as` prop for polymorphic rendering
5. **Style abstraction**: `:ui` prop for Tailwind class injection
6. **Lifecycle hooks**: Callbacks for open/close auto-focus events
7. **Event customization**: Pointer event handlers for custom outside-click behavior
8. **Nested component support**: Explicit `nested` prop for stacking behavior

### Accessibility Considerations

1. **Focus management**: Automatic focus trapping and restoration
2. **Keyboard navigation**: ESC key dismissal (configurable)
3. **ARIA attributes**: Proper role and state announcements (via Vaul Vue)
4. **Focus callbacks**: `onOpenAutoFocus`, `onCloseAutoFocus` for custom focus behavior
5. **Modal behavior**: Prevents background interaction when modal=true
6. **Screen reader support**: Semantic HTML structure with header/body/footer sections

### Comparison to Other Frameworks

**Strengths**:
- Exceptional documentation with 16+ examples
- Most comprehensive slot architecture among drawer implementations
- Unique responsive Modal/Drawer pattern
- Advanced visual effects (background scaling)
- Strong TypeScript integration
- Nested drawer support
- Command palette integration example
- Both modal and non-modal modes
- Fine-grained drag control (handle, handle-only)

**Limitations**:
- Vue 3 specific (not framework-agnostic)
- Requires Vaul Vue dependency
- Background scaling requires additional markup (`data-vaul-drawer-wrapper`)
- No built-in loading or skeleton states
- Limited animation customization without accessing underlying Vaul API
- No built-in resize handle for adjustable drawer width/height

### Migration Considerations for Semantic UI

If porting this pattern to Semantic UI:

1. **State management**: Adapt `v-model:open` pattern to Semantic UI's reactive signals
2. **Slot architecture**: Consider compound components vs. single component with slots
3. **Direction naming**: Evaluate `direction` prop vs. `placement` or position-based props
4. **Modal behavior**: Decide on default modal behavior and background interaction patterns
5. **Drag interaction**: Assess if gesture-based dragging aligns with Semantic UI philosophy
6. **Responsive patterns**: Create guidance for Modal vs. Drawer responsive patterns
7. **Animation system**: Leverage Semantic UI's animation capabilities for smooth transitions
8. **Overlay management**: Consider portal/teleport patterns for overlay rendering
9. **Focus management**: Implement focus trapping and restoration lifecycle
10. **Nesting support**: Decide if nested drawers should be first-class feature
11. **Custom styling**: Adapt `:ui` prop pattern to Semantic UI's theming system
12. **Command integration**: Consider patterns for embedding search/command interfaces
13. **Visual depth**: Evaluate background scaling effects for material design patterns
14. **Accessibility**: Ensure keyboard navigation and ARIA attributes match Nuxt UI's approach

### Implementation Architecture Insights

1. **Trigger abstraction**: Default slot pattern allows any element to be drawer trigger
2. **Content isolation**: Drawer content renders in portal/teleport for proper layering
3. **State synchronization**: Two-way binding keeps parent and drawer state in sync
4. **Event bubbling**: Pointer events propagate through overlay for custom handling
5. **Animation coordination**: Overlay and drawer animations coordinate for smooth transitions
6. **Focus restoration**: Tracks previously focused element for restoration on close
7. **Scroll locking**: Body scroll prevention when drawer is open (modal mode)
8. **Z-index management**: Proper stacking context for nested drawers
9. **Touch gestures**: Swipe-to-dismiss via drag velocity detection
10. **Inset calculations**: CSS-based inset for floating drawer appearance

### Design System Integration

1. **Color system**: Uses Nuxt UI's semantic color tokens (neutral, primary, etc.)
2. **Spacing system**: Tailwind utility classes for margins and padding
3. **Typography**: Inherits text styles from parent theme
4. **Animation timing**: Consistent with Nuxt UI's motion design system
5. **Shadow system**: Overlay shadows for visual depth
6. **Border radius**: Rounded corners align with design tokens
7. **Backdrop**: Overlay opacity and color configurable via `:ui` prop
8. **Global theming**: `app.config.ts` for project-wide drawer styling

### Performance Considerations

1. **Lazy rendering**: Drawer content only rendered when open (likely)
2. **Animation optimization**: GPU-accelerated transforms for smooth motion
3. **Event delegation**: Minimal event listeners via event delegation
4. **Portal rendering**: Renders at document root to avoid re-rendering parent tree
5. **Conditional imports**: Command palette example uses async data loading
6. **Scroll prevention**: Efficient body scroll lock without layout shifts
