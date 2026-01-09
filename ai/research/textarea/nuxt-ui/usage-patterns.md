# Nuxt UI - Textarea Usage Patterns

## Component URL
https://ui.nuxt.com/components/textarea
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Well-structured component documentation with clear prop tables, multiple code examples, visual previews, and integration guidance. Strong emphasis on practical usage patterns.

## Component Definition
- **Core purpose**: Multi-line text input field with automatic resizing and rich customization options
- **Mental model**: An enhanced HTML textarea element that provides Vue reactivity, flexible styling, auto-resize capability, and icon/avatar integration for enriched user input experiences
- **Semantic meaning**: Enables users to enter multi-line text content with visual feedback for different states (focus, disabled, validation) and optional content decorations

## Core Patterns

### Form Integration
| Pattern | Present | Details |
|---------|---------|---------|
| v-model binding | ✅ | Two-way reactive binding via `v-model` with full Vue reactivity support |
| Model modifiers | ✅ | `modelModifiers` prop supports Vue v-model directive modifiers |
| Name attribute | ✅ | `name` prop for form submission |
| ID attribute | ✅ | `id` prop for label association |
| Required validation | ✅ | `required` boolean prop for HTML5 validation |
| Placeholder text | ✅ | `placeholder` prop for empty state hint text |

### Value Management
| Pattern | Present | Details |
|---------|---------|---------|
| String values | ✅ | Primary value type via `modelValue` |
| Number values | ✅ | Supports `number` type in `modelValue` |
| Null values | ✅ | Supports `null` in `modelValue` for cleared state |
| Initial value | ✅ | Set via `v-model` or `modelValue` prop |

## Props & Configuration

### Core Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `null\|string\|number` | — | Value binding for v-model |
| `modelModifiers` | `ModelModifiers` | — | v-model directive modifiers |
| `placeholder` | `string` | — | Placeholder text when empty |
| `name` | `string` | — | Form field name |
| `id` | `string` | — | Element identifier |
| `required` | `boolean` | — | HTML required attribute |
| `disabled` | `boolean` | — | Disables user interaction |
| `rows` | `number` | `3` | Initial visible row count |

### Auto-resize Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoresize` | `boolean` | — | Enable automatic height adjustment |
| `autoresizeDelay` | `number` | `0` | Milliseconds before resize calculation |
| `maxrows` | `number` | `0` | Maximum rows when autoresizing (0 = unlimited) |

### Visual Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `'primary'` | Focus ring color theme |
| `variant` | `string` | `'outline'` | Visual style variant |
| `size` | `string` | `'md'` | Component size scale |
| `highlight` | `boolean` | — | Force display of focus ring (validation state) |

### Content Enhancement Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string\|object` | — | Icon to display in textarea |
| `avatar` | `AvatarProps` | — | Avatar component configuration |
| `loading` | `boolean` | — | Show loading indicator |
| `loading-icon` | `string` | `'i-lucide-loader-circle'` | Custom loading icon |
| `leading-icon` | `string` | — | Icon positioned at leading edge |
| `trailing-icon` | `string` | — | Icon positioned at trailing edge |

### Focus Management Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autofocus` | `boolean` | — | Auto-focus on component mount |
| `autofocusDelay` | `number` | `0` | Milliseconds delay before auto-focusing |

### Render Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `any` | `'div'` | Element or component to render container as |

## Visual Patterns

### Size Options
Five size scales controlling textarea dimensions and internal spacing:
- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

### Variant Styles
Five visual style variants for different UI contexts:
- `outline` (default) - Border with background, clear definition
- `soft` - Subtle background with minimal border
- `subtle` - Very light styling, minimal visual weight
- `ghost` - No background, appears on interaction
- `none` - No visual styling applied

### Color Themes
Seven semantic color options for focus ring indication:
- `primary` (default) - Primary brand color
- `secondary` - Secondary brand color
- `success` - Success/valid state green
- `info` - Informational blue
- `warning` - Warning/caution yellow/orange
- `error` - Error/invalid state red
- `neutral` - Neutral gray

## Behavioral Patterns

### Auto-resize Behavior
**Dynamic Height Adjustment**: When `autoresize` is enabled, the textarea automatically expands vertically as content grows.

**Configuration**:
- `autoresize` - Boolean to enable feature
- `autoresizeDelay` - Delay in milliseconds before resize calculation (performance optimization)
- `maxrows` - Maximum row limit (0 = unlimited growth)

**Use Cases**:
- Comment fields that grow with content
- Message composition areas
- Dynamic form fields
- Chat input boxes

**Example**:
```vue
<UTextarea v-model="comment" :autoresize="true" :maxrows="10" />
```

### Character Limits
While not explicitly documented as a built-in prop, character limits can be implemented through Vue patterns with the reactive `modelValue`.

### Loading State
**Loading Indicator**: Display loading spinner/icon via `loading` prop.

**Customization**:
- `loading-icon` prop for custom icon (default: `i-lucide-loader-circle`)
- Global configuration via `app.config.ts` (`ui.icons.loading`)

**Use Cases**:
- AI content generation in progress
- Auto-save feedback
- Content validation pending
- External API calls

### Focus Management
**Auto-focus**: Automatically focus textarea on mount with `autofocus` prop.

**Delayed Focus**: Control focus timing with `autofocusDelay` for UX orchestration (animations, page loads).

**Example**:
```vue
<!-- Focus after 300ms delay -->
<UTextarea :autofocus="true" :autofocusDelay="300" />
```

### State Patterns
| State | Prop/Pattern | Details |
|-------|--------------|---------|
| Disabled | `disabled` prop | Prevents user interaction, visual dimming |
| Required | `required` prop | HTML5 form validation requirement |
| Highlighted | `highlight` prop | Forces focus ring display (validation emphasis) |
| Loading | `loading` prop | Shows loading indicator |
| Empty | No value | Displays placeholder text |
| Focused | User interaction | Shows focus ring in configured color |

## Content Patterns

### Icon Integration
**Leading Icons**: Position icons at the start of the textarea.
```vue
<UTextarea leading-icon="i-lucide-search" />
```

**Trailing Icons**: Position icons at the end of the textarea.
```vue
<UTextarea trailing-icon="i-lucide-send" />
```

**Generic Icon**: Use `icon` prop with positioning controlled separately.

**Icon Formats**:
- String: Icon identifier (e.g., `"i-lucide-mail"`)
- Object: Icon configuration object

### Avatar Integration
**Avatar Display**: Embed avatar component using `avatar` prop with `AvatarProps` configuration.

**Example**:
```vue
<UTextarea :avatar="{ src: 'https://example.com/user.jpg' }" />
```

**Use Cases**:
- Comment fields with user identity
- Chat interfaces
- Collaborative editing

### Text Content
**Value Types**:
- String (primary use case)
- Number (for numeric text input)
- Null (cleared/empty state)

**Placeholder**: Guide users with `placeholder` text shown when empty.

## Slot System

### Default Slot
The component appears to use Vue's slot system for custom content, though specific slot documentation wasn't explicitly provided in the fetched content. Based on Nuxt UI patterns, likely supports:
- Default slot for custom content rendering
- Scoped slots with `ui` configuration access

**Note**: Specific slot documentation would require checking the component source or more detailed docs.

## Accessibility

### Semantic HTML
Built on native `<textarea>` element, inheriting standard HTML accessibility features:
- Keyboard navigation (Tab, Shift+Tab)
- Screen reader support
- Native form integration
- Label association via `id` prop

### ARIA Support
The component inherits textarea ARIA semantics:
- `aria-required` through `required` prop
- `aria-disabled` through `disabled` prop
- `aria-invalid` can be managed via `highlight` prop pattern

### Focus Indicators
Visual focus ring with configurable colors ensures keyboard navigation visibility.

### Required Fields
HTML5 `required` attribute for form validation and screen reader announcement.

## Framework-Specific Features

### Vue Integration
**Reactive v-model**: Full Vue 3 reactivity with two-way data binding.
```vue
<script setup>
const message = ref('')
</script>
<template>
  <UTextarea v-model="message" />
</template>
```

**Model Modifiers**: Supports Vue v-model modifiers via `modelModifiers` prop.
```vue
<UTextarea v-model.trim="text" />
```

**Refs**: Can be accessed via Vue refs for imperative control.

### Reka UI Foundation
Built on **Reka UI**, a headless component library providing:
- Solid accessibility primitives
- Consistent component patterns
- Framework-agnostic component logic
- Strong keyboard interaction support

This foundation ensures robust accessibility and behavior consistency across the Nuxt UI ecosystem.

### UApp Config System
**Global Customization**: Configure component defaults via `app.config.ts` (Nuxt) or `vite.config.ts` (Vue).

**Loading Icon Configuration**:
```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    icons: {
      loading: 'i-custom-spinner'
    }
  }
})
```

**Component Theme Overrides**: The `ui` prop (common in Nuxt UI) allows per-instance styling overrides of internal elements, following the pattern:
```vue
<UTextarea :ui="{ root: 'custom-class', base: 'other-class' }" />
```

### TypeScript Support
Full TypeScript integration with:
- Typed props with union types
- Type-safe `AvatarProps` configuration
- `ModelModifiers` interface
- Strong type inference for v-model

## Implementation Notes

### Render Function Flexibility
The `as` prop allows rendering the container as any element or component, providing flexibility for semantic HTML or component composition.

### Auto-resize Implementation
Auto-resize feature calculates content height dynamically, with:
- Optional delay for performance optimization (`autoresizeDelay`)
- Maximum height constraint (`maxrows`)
- Unlimited growth mode when `maxrows = 0`

### Row Management
**Initial Size**: `rows` prop sets initial visible lines (default: 3)
**Dynamic Growth**: When `autoresize` enabled, grows beyond initial `rows`
**Growth Limit**: `maxrows` caps maximum expansion

### Performance Considerations
- `autoresizeDelay` prevents excessive recalculation during rapid typing
- `autofocusDelay` allows page render completion before focus

### Validation Patterns
While not providing built-in validation, the `highlight` prop enables visual validation feedback integration:
```vue
<UTextarea
  v-model="message"
  :highlight="hasError"
  :color="hasError ? 'error' : 'primary'"
/>
```

## Code Examples

### Basic Textarea
```vue
<script setup>
const value = ref('')
</script>
<template>
  <UTextarea v-model="value" />
</template>
```

### Auto-resizing Textarea
```vue
<UTextarea
  v-model="comment"
  :autoresize="true"
  :maxrows="8"
  placeholder="Enter your comment..."
/>
```

### With Icon Indicators
```vue
<UTextarea
  v-model="message"
  leading-icon="i-lucide-mail"
  trailing-icon="i-lucide-send"
/>
```

### With Avatar (User Identity)
```vue
<UTextarea
  v-model="reply"
  :avatar="{ src: currentUser.avatar }"
  placeholder="Write a reply..."
/>
```

### Loading State
```vue
<UTextarea
  v-model="text"
  :loading="isGenerating"
  loading-icon="i-lucide-sparkles"
  placeholder="AI is generating content..."
/>
```

### Validation Highlight
```vue
<UTextarea
  v-model="description"
  :highlight="errors.description"
  :color="errors.description ? 'error' : 'primary'"
  :required="true"
/>
```

### Disabled State
```vue
<UTextarea
  v-model="readonlyText"
  :disabled="true"
  placeholder="This field is disabled"
/>
```

### Custom Size and Variant
```vue
<UTextarea
  v-model="notes"
  size="lg"
  variant="soft"
  color="secondary"
  :rows="5"
/>
```

### Auto-focus with Delay
```vue
<UTextarea
  v-model="quickNote"
  :autofocus="true"
  :autofocusDelay="200"
  placeholder="Start typing..."
/>
```

### Full-Featured Example
```vue
<script setup>
const feedback = ref('')
const isSubmitting = ref(false)
const hasError = computed(() => feedback.value.length > 500)
</script>

<template>
  <UTextarea
    v-model="feedback"
    :autoresize="true"
    :maxrows="10"
    :loading="isSubmitting"
    :highlight="hasError"
    :color="hasError ? 'error' : 'primary'"
    size="lg"
    variant="outline"
    leading-icon="i-lucide-message-square"
    placeholder="Share your feedback..."
    :required="true"
  />
</template>
```

## Notable Features

### 1. Auto-resize with Constraints
Unlike basic textareas, provides intelligent height management:
- Grows with content automatically
- Configurable maximum height
- Performance-optimized with delay option
- Maintains minimum `rows` setting

### 2. Rich Content Decoration
Multiple enhancement options in a single component:
- Leading and trailing icons
- Avatar integration
- Loading indicators
- All with consistent styling

### 3. Comprehensive State Management
Handles multiple interaction states elegantly:
- Disabled (non-interactive)
- Loading (processing feedback)
- Highlighted (validation emphasis)
- Focused (user attention)
- Required (form validation)

### 4. Flexible Styling System
Five variants × seven colors × five sizes = extensive visual customization without custom CSS.

### 5. Focus Control Precision
Granular focus management with delay control enables sophisticated UX patterns (modal animations, progressive disclosure).

### 6. Vue-Native Implementation
Seamless Vue integration with:
- Reactive v-model
- Model modifiers support
- Ref access
- Scoped slots
- TypeScript types

### 7. Global Configuration
Theme consistency through app-level configuration while allowing per-instance overrides.

### 8. Reka UI Foundation
Inherits robust accessibility and interaction patterns from headless UI library.

## Research Notes

### Documentation Experience
- **Excellent visual examples**: Live interactive previews with code samples
- **Clear prop documentation**: Comprehensive tables with types and defaults
- **Practical patterns**: Real-world use cases demonstrated
- **Accessibility consideration**: Semantic HTML and ARIA support highlighted
- **TypeScript clarity**: Strong type information throughout

### Framework Approach Observations

1. **Vue-first design**: Leverages Vue 3 reactivity, composition API, and v-model patterns
2. **Prop-driven API**: All functionality controlled via props rather than methods
3. **Tailwind integration**: Deep integration with Tailwind for utility-based customization
4. **Component composition**: Avatar and icon integration shows component interoperability
5. **Configuration over code**: Global theming via config files reduces boilerplate
6. **Headless foundation**: Reka UI provides accessibility and behavior, Nuxt UI adds styling
7. **Type safety**: Strong TypeScript support throughout prop system

### Implementation Patterns

1. **Auto-resize strategy**: Dynamic height calculation with performance controls
2. **Multi-content support**: Icons, avatars, and loading indicators coexist
3. **State visualization**: Distinct visual patterns for all interaction states
4. **Validation ready**: Highlight prop enables validation UI patterns
5. **Performance conscious**: Delay props for resize and focus operations
6. **Semantic rendering**: `as` prop for semantic HTML flexibility
7. **Gradual enhancement**: Works as basic textarea, enhanced with props

### Comparison to Standard HTML Textarea

**Enhancements over native `<textarea>`**:
- Auto-resize capability
- Icon and avatar integration
- Loading state visualization
- Sophisticated focus management
- Variant and color theming
- Vue reactivity integration
- TypeScript type safety
- Global configuration system

**Maintained native features**:
- Form integration (name, id, required)
- Keyboard navigation
- Screen reader support
- Placeholder text
- Row configuration

### Migration Considerations for Semantic UI

If porting this pattern to Semantic UI:

1. **Auto-resize**: Evaluate if auto-resize should be built-in or plugin-based
2. **Content decoration**: Decide on icon/avatar integration approach (slots vs props)
3. **State management**: Consider how to expose loading, validation, and highlight states
4. **Variant system**: Assess if five variants align with Semantic UI design language
5. **Focus control**: Determine if delay-based focus management is valuable
6. **Row constraints**: Evaluate `maxrows` pattern for limiting auto-resize growth
7. **Configuration**: Consider global vs instance-level theming approach
8. **Accessibility**: Ensure Reka UI-level accessibility standards are met
9. **Performance**: Implement delay-based optimizations for auto-resize
10. **API surface**: Balance between comprehensive props and simplicity

### Strengths

- Comprehensive feature set in single component
- Excellent auto-resize implementation
- Strong Vue integration
- Rich content decoration options
- Sophisticated focus management
- Performance-conscious design
- Solid accessibility foundation
- Clear documentation with examples

### Limitations

- Vue-specific (not framework-agnostic)
- No built-in character counting
- No built-in validation logic
- Auto-resize requires explicit `maxrows` for height limits
- Limited slot documentation
- Icon positioning limited to leading/trailing (no top/bottom)
- Avatar positioning not configurable

### Potential Extensions

1. **Character counter**: Built-in max length with visual feedback
2. **Resize handle**: Optional manual resize control
3. **Min/max height**: Explicit height constraints in addition to rows
4. **Validation feedback**: Built-in error message display
5. **Toolbar integration**: Rich text editing toolbar slot
6. **Auto-save indicator**: Visual feedback for auto-save state
7. **Markdown preview**: Side-by-side preview for markdown input
8. **Mentions/tagging**: @ mention autocomplete integration
9. **Paste handling**: Custom paste event handling (images, formatting)
10. **Undo/redo**: Built-in history management
