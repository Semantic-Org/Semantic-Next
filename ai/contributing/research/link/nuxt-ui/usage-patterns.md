# Nuxt UI - Link Usage Patterns

## Component URL
https://ui.nuxt.com/components/link
Status: ✅ Working
Version: Current
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with detailed prop descriptions, examples, and advanced configuration options.

## Component Definition
- **Core purpose**: Wrapper around Vue's NuxtLink that enhances navigation with additional props for controlling active/inactive styling and exact route matching, restoring features from Nuxt 2/Vue 2.
- **Mental model**: An intelligent link component that understands routing context and automatically adapts between anchor tags and buttons based on whether a navigation target is provided.
- **Semantic meaning**: Communicates navigational relationships and current location context through visual styling and ARIA attributes.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Navigation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Internal navigation | ✅ | Native | Via `to` prop accepting path strings or route objects |
| External navigation | ✅ | Native | Auto-detected or forced with `external` prop |
| Router integration | ✅ | Native | Full Vue Router 4+ integration with history management |
| Hash links | ✅ | Native | Supported with `exactHash` prop for exact matching control |
| Download links | ✅ | Native | Works with external URLs and file downloads |
| Named routes | ✅ | Native | Supports Vue Router named route objects |
| Dynamic parameters | ✅ | Native | Full support for dynamic route parameters |
| Query string handling | ✅ | Native | `exactQuery` prop with boolean or "partial" matching |
| Replace navigation | ✅ | Native | `replace` prop uses router.replace() instead of push() |
| Force navigation | ✅ | Native | `force` option triggers navigation on identical routes |
| Trailing slash control | ✅ | Native | `trailingSlash` prop to append/remove trailing slashes |

## Visual Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Underline styling | ✅ | Native | Default styling includes underline decoration |
| Color customization | ✅ | Native | Uses Nuxt UI theme color system variables |
| Visited state | ✅ | CSS-only | Standard browser visited state support |
| Hover effects | ✅ | Native | Theme-based hover styling |
| Active state | ✅ | Native | `activeClass` prop with smart route matching |
| Inactive state | ✅ | Native | `inactiveClass` prop for non-active links |
| Focus indicators | ✅ | Native | Standard focus ring with theme integration |
| Exact matching styles | ✅ | Native | Different styling for exact vs partial route matches |
| Raw mode | ✅ | Native | `raw` prop disables defaults for full custom control |
| Prefetched styling | ✅ | Native | `prefetchedClass` prop for prefetched link indication |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onClick handler | ✅ | Native | Standard Vue event handling |
| New window/tab | ✅ | Native | `target` prop (_blank, _parent, _self, _top) |
| Disabled state | ✅ | Native | `disabled` prop prevents interaction |
| No-follow attribute | ✅ | Native | `rel` prop with smart defaults (noopener noreferrer for external) |
| Custom rel control | ✅ | Native | `noRel` prop disables automatic rel attributes |
| Prefetching | ✅ | Native | `prefetch`, `prefetchOn` props for route/payload prefetching |
| View Transitions | ✅ | Native | `viewTransition` prop enables View Transitions API |
| Auto-focus | ✅ | Native | `autofocus` prop for automatic focus |
| Button fallback | ✅ | Native | `as` prop controls fallback element when not a link |
| Button type control | ✅ | Native | `type` prop for button types (reset/submit/button) |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ✅ | Composed | Standard Vue/HTML ARIA attribute support |
| ARIA current | ✅ | Native | `ariaCurrentValue` prop (default: "page") when active |
| Keyboard navigation | ✅ | Native | Full native keyboard support for links and buttons |
| Screen reader support | ✅ | Native | Semantic HTML with proper ARIA attributes |
| Focus management | ✅ | Native | Auto-focus capability and standard focus behavior |
| Semantic HTML | ✅ | Native | Renders as `<a>` for links, `<button>` for buttons |

## Code Examples
```vue
// Basic internal link
<ULink to="/docs/components/link">Link</ULink>

// External link with custom target
<ULink to="https://example.com" target="_blank">External Link</ULink>

// Custom active/inactive styling
<ULink
  to="/docs/components/link"
  active-class="font-bold text-primary"
  inactive-class="text-muted"
>
  Link with Custom Classes
</ULink>

// Raw mode for full control
<ULink
  raw
  to="/docs/components/link"
  active-class="font-bold"
  inactive-class="text-muted"
>
  Link without default styles
</ULink>

// Button fallback (no navigation)
<ULink as="button" @click="handleClick">
  Button-style Link
</ULink>

// Exact route matching with query control
<ULink
  to="/search?q=nuxt"
  exact
  exact-query="partial"
>
  Search Results
</ULink>

// Named route with parameters
<ULink :to="{ name: 'user-profile', params: { id: 123 } }">
  User Profile
</ULink>

// Prefetching control
<ULink
  to="/dashboard"
  prefetch
  prefetch-on="visibility"
>
  Dashboard
</ULink>

// View Transitions enabled
<ULink to="/about" view-transition>
  About (with transitions)
</ULink>
```
[View Live](https://ui.nuxt.com/components/link)

## Notable Features

### Advanced Route Matching
- **Granular control**: Separate props for exact route, query, and hash matching
- **Partial query matching**: Use `exact-query="partial"` for flexible query string comparison
- **Force navigation**: Override Vue Router's default behavior of not navigating to the same route

### Intelligent Element Rendering
- Automatically renders as `<a>` when `to` prop is provided
- Falls back to `<button>` (or custom element via `as` prop) when no navigation target
- Smart semantic HTML based on component usage

### Smart External Link Handling
- Auto-detection of external URLs
- Automatic `rel="noopener noreferrer"` for external links
- Override control via `external` and `noRel` props

### Performance Features
- Built-in route prefetching on visibility or interaction
- View Transitions API support for modern browsers
- Efficient middleware and layout prefetching

### Developer Experience
- VSCode IntelliSense support for Tailwind classes on `active-class` and `inactive-class`
- Full TypeScript support
- Restores missing Nuxt 2/Vue 2 functionality in modern framework

### Styling Flexibility
- Theme-integrated default styles
- Raw mode for complete custom control
- Separate active/inactive class configuration
- Prefetched state styling

## Research Notes

### Accessibility
The component shows excellent accessibility practices:
- Proper use of `aria-current` for active navigation
- Semantic HTML with appropriate element types
- Full keyboard navigation support
- Screen reader friendly

### Framework Integration
Deep integration with Nuxt 3 and Vue Router 4:
- Leverages Vue Router's route matching capabilities
- Integrates with Nuxt's prefetching system
- Supports modern web APIs (View Transitions)
- Backward compatibility with Nuxt 2 patterns

### Unique Approaches
- **Dual nature**: Seamlessly transitions between link and button based on props
- **Prefetch visibility**: Innovative `prefetch-on="visibility"` option
- **Query matching flexibility**: `exact-query="partial"` for pragmatic query handling
- **Raw mode**: Provides escape hatch for full styling control

### Documentation Quality
Excellent documentation with:
- Clear prop descriptions and types
- Multiple usage examples
- Advanced configuration guidance
- VSCode integration tips
- Migration guidance from Nuxt 2
