# Nuxt UI - Separator/Divider Usage Patterns

## Component URL
https://ui.nuxt.com/components/separator
Status: ✅ Working

## Documentation Quality
**Comprehensive** - Well-structured with clear prop documentation, multiple code examples, visual previews, and accessibility guidance.

## Component Definition
- **Core purpose**: Separates content horizontally or vertically with flexible customization options
- **Mental model**: A visual divider line that can optionally contain centered content (text, icons, avatars) to add context to the separation
- **Semantic meaning**: Communicates visual and semantic separation between sections of content. Can be purely decorative or serve as a meaningful content boundary.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | `label` prop allows centered text in the separator |
| Icon support | ✅ | `icon` prop accepts icon strings or objects for centered icons |
| Media support | ✅ | `avatar` prop accepts `AvatarProps` for centered avatar display |
| Custom content | ✅ | Default slot with scoped props for completely custom center content |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal | ✅ | Default orientation, full-width line |
| Vertical | ✅ | `orientation="vertical"` creates vertical line (requires explicit height via classes) |
| Decorative | ✅ | `decorative` prop for purely visual separators |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | Not applicable to this component |
| Disabled | ❌ | Not applicable to this component |
| Interactive | ❌ | Component is purely presentational |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Five sizes: `xs`, `sm`, `md`, `lg`, `xl` - controls line thickness |
| Spacing control | ❌ | No built-in spacing props; handled via utility classes |
| Visual styles | ✅ | Three types: `solid`, `dashed`, `dotted` |
| Color options | ✅ | Seven semantic colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` (default) |
| Alignment | ⚠️ | Center content is always centered; no left/right alignment options |

## Code Examples

### Basic Horizontal Separator
```vue
<USeparator />
```

### Vertical Separator (with height)
```vue
<USeparator orientation="vertical" class="h-48" />
```

### With Centered Label
```vue
<USeparator label="Hello World" />
```

### With Icon
```vue
<USeparator icon="i-simple-icons-nuxtdotjs" />
```

### With Avatar
```vue
<USeparator :avatar="{ src: 'https://github.com/nuxt.png' }" />
```

### Styled Separator
```vue
<USeparator color="primary" type="dashed" size="lg" />
```

### Custom Content via Slot
```vue
<USeparator>
  <template #default="{ ui }">
    <!-- Custom content with access to ui configuration -->
    <span>Custom</span>
  </template>
</USeparator>
```

## Notable Features

### Multi-Content Support
Unlike many separator components that support only one type of content, Nuxt UI's Separator elegantly handles:
- Plain text labels
- Icons (with flexible icon format support)
- Avatar components
- Custom slot content

### Flexible Styling Architecture
The component uses a slot-based styling system with the `ui` prop, allowing granular control over:
- `root` - Main container
- `border` - The line element
- `container` - Center content wrapper
- `icon`, `avatar`, `label` - Individual content type styling

This can be customized per-instance or globally via `app.config.ts`.

### Accessibility Considerations
The `decorative` prop properly manages ARIA attributes:
- When `true`: removes from accessibility tree
- When `false` or omitted: maintains semantic meaning for screen readers

### Orientation Handling
Vertical orientation is achieved through flexbox adjustments, but requires explicit height specification via utility classes (e.g., `class="h-48"`), giving developers control over vertical separator height.

### Built on Reka UI
Component leverages Reka UI (headless component library) as its foundation, providing:
- Solid accessibility primitives
- Consistent component patterns across the Nuxt UI ecosystem

## Research Notes

### Documentation Experience
- **Excellent visual previews**: Interactive examples with live code editing
- **Clear prop tables**: Type information and defaults clearly documented
- **Well-organized**: Logical progression from basic to advanced usage
- **Accessibility focus**: Explicit guidance on decorative vs semantic usage

### Framework Approach Observations

1. **Vue-centric API**: Uses Vue-specific patterns (`:avatar="{ ... }"`, scoped slots)
2. **Tailwind-first styling**: Deep integration with Tailwind utilities for customization
3. **Semantic color system**: Predefined color palette aligned with design tokens
4. **Component composition**: Avatar integration shows component-to-component interoperability
5. **Configuration-driven**: Global theming via `app.config.ts` for consistent design system

### Implementation Patterns

1. **Prop-based variations**: All visual variations controlled via props rather than CSS classes
2. **Render function flexibility**: `as` prop allows rendering as any element/component
3. **Centered content strategy**: Single-position (center) approach simplifies API
4. **No spacing props**: Relies on utility classes for margins/padding (keeps component focused)
5. **Type safety**: Strong TypeScript integration with union types for prop values

### Comparison to Other Frameworks

**Strengths**:
- More content pattern support than typical divider components
- Clear separation between visual and semantic concerns
- Excellent documentation with visual examples
- Strong accessibility guidance

**Limitations**:
- Center-only alignment (no left/right label positioning)
- No built-in spacing control
- Vertical orientation requires manual height management
- No compound component pattern (all-in-one component)

### Migration Considerations for Semantic UI

If porting this pattern to Semantic UI:
1. Consider whether to support multiple content types or keep focused
2. Evaluate prop vs class-based API for Semantic UI's philosophy
3. Determine if left/center/right alignment would add value
4. Assess if spacing controls should be built-in or external
5. Consider compound component approach (e.g., `<ui-divider-label>`) vs monolithic
