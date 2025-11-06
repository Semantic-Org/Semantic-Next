# Nuxt UI - Badge Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.nuxt.com/components/badge
Status: ✅ Working
Version: Current (Nuxt UI v3)
Last Verified: 2025-11-05

## Documentation Quality
**Good** - Well-structured with live interactive examples, comprehensive prop tables, and visual demonstrations of all variations. However, lacks accessibility guidance, best practices, and interactive/state pattern documentation.

## Component Definition
- **Core purpose**: A short text component to represent a status, category, or label. Used to highlight important information, display counts, or indicate state changes in a compact, visually distinct format.
- **Mental model**: Think of it as a "tag" or "pill" - a small, self-contained label that adds semantic meaning or visual emphasis to content. It's a presentational component designed to draw attention without requiring interaction.
- **Semantic meaning**: Communicates status (success/error/warning), categorization (tags/labels), or metadata (counts/notifications) through both color semantics and text content.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="primary"`)
- **Composed**: Via composition/children (e.g., `<UBadge>{content}</UBadge>`)
- **CSS-only**: Requires custom styling (e.g., `class="custom-style"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native + Composed | Default slot for content OR `label` prop accepts string/number |
| Icons | ✅ | Native | `icon` prop with `leading`/`trailing` boolean flags, plus `leadingIcon`/`trailingIcon` for different icons per side |
| Avatars/Images | ✅ | Native | `avatar` prop accepts AvatarProps object for displaying user avatars on left side |
| Close/Remove button | ❌ | Not supported | No built-in close/remove functionality documented |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | Not documented | No selectable or active state patterns shown |
| Disabled | ❌ | Not documented | No disabled state support documented |
| Loading | ❌ | Not documented | No loading state support documented |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop: `'primary'` (default), `'secondary'`, `'success'`, `'info'`, `'warning'`, `'error'`, `'neutral'` |
| Size options | ✅ | Native | `size` prop: `'xs'`, `'sm'`, `'md'` (default), `'lg'`, `'xl'` |
| Visual variants | ✅ | Native | `variant` prop: `'solid'` (default), `'outline'`, `'soft'`, `'subtle'` - four distinct visual treatments |
| Bordered/Borderless | ✅ | Native (via variant) | Achieved through variant system - `'outline'` has border, `'solid'`/`'soft'`/`'subtle'` are borderless |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ⚠️ | CSS-only/Manual | Use `as` prop to render as button/link, but no built-in click handling |
| Closable/Removable | ❌ | Not supported | No built-in close/remove functionality |
| onClick handler | ❌ | Not native | Would require custom implementation with `as` prop |
| onClose handler | ❌ | Not supported | No close handler support |

## Code Examples
```vue
<!-- Basic text badge -->
<UBadge>Badge</UBadge>

<!-- With label prop -->
<UBadge label="Badge" />

<!-- Color variations -->
<UBadge color="primary">Primary</UBadge>
<UBadge color="success">Success</UBadge>
<UBadge color="error">Error</UBadge>

<!-- Variant styles -->
<UBadge variant="solid">Solid</UBadge>
<UBadge variant="outline">Outline</UBadge>
<UBadge variant="soft">Soft</UBadge>
<UBadge variant="subtle">Subtle</UBadge>

<!-- Size options -->
<UBadge size="xs">Extra Small</UBadge>
<UBadge size="sm">Small</UBadge>
<UBadge size="md">Medium</UBadge>
<UBadge size="lg">Large</UBadge>
<UBadge size="xl">Extra Large</UBadge>

<!-- With leading icon -->
<UBadge icon="i-heroicons-rocket-launch" leading>
  Launched
</UBadge>

<!-- With trailing icon -->
<UBadge trailing-icon="i-heroicons-arrow-right">
  Continue
</UBadge>

<!-- With avatar -->
<UBadge
  :avatar="{ src: 'https://example.com/avatar.jpg', alt: 'User' }"
>
  John Doe
</UBadge>

<!-- Square padding (equal horizontal/vertical) -->
<UBadge square>99+</UBadge>

<!-- Polymorphic rendering -->
<UBadge as="a" href="/notifications">
  3 New
</UBadge>

<!-- Custom styling -->
<UBadge class="custom-badge-style">
  Custom
</UBadge>
```
[View Live](https://ui.nuxt.com/components/badge)

## Notable Features
- **Integrated avatar support**: Unique among badge components - built-in `avatar` prop accepts full AvatarProps for seamless user representation
- **Dual icon positioning**: Supports both leading and trailing icons simultaneously with different icons per position (`leadingIcon` + `trailingIcon`)
- **Sophisticated variant system**: Four visual treatments (solid, outline, soft, subtle) that work across all seven semantic colors, providing 28 built-in style combinations
- **Polymorphic rendering**: `as` prop enables semantic flexibility (span/button/link) without sacrificing styles
- **Square mode**: `square` boolean for equal padding - optimized for numeric badges or icon-only badges
- **Flexible content API**: Choice between default slot (compositional) or `label` prop (declarative) for content
- **Number-aware**: `label` prop explicitly supports both string and number types

## Research Notes
- Documentation is accessible and well-organized with live interactive playground
- Component appears read-only by design - no interactive states (disabled, loading, selected) or event handlers documented
- Interaction would need to be implemented externally using `as` prop for semantic element switching
- Avatar integration is particularly innovative - most badge/chip components don't have this built-in
- The variant system is more extensive than typical badge components (most offer 2-3 variants, this offers 4)
- Missing accessibility documentation (ARIA labels, keyboard navigation, screen reader support)
- No guidance on when to use Badge vs Button vs Chip (if Chip exists in the library)
- The `square` prop suggests specific use cases (notification counts, icon-only badges) but these aren't explicitly documented as patterns
