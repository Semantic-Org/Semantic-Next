# Semantic UI Classic - Breadcrumb Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/collections/breadcrumb.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-05

## Documentation Quality
Basic - The documentation provides clear visual examples showing the main patterns, but code examples are limited and implementation details are minimal. The structure is organized but lacks the depth found in other Semantic UI components.

## Component Definition
- **Core purpose**: Display hierarchical navigation paths showing the user's current location within a website's structure
- **Mental model**: A trail of links representing the path from the site's root to the current page. Users understand breadcrumbs as a way to see where they are and navigate back to parent pages
- **Semantic meaning**: Communicates location within a hierarchy and provides contextual navigation. Acts as a secondary navigation aid showing the relationship between pages

## Pattern Support Levels
- **Native**: Dedicated class/API (e.g., `class="ui breadcrumb"`)
- **Composed**: Via HTML composition (e.g., multiple sections and dividers)
- **CSS-only**: Requires custom styling (not supported by framework)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Native | Sections with `<a class="section">` for clickable links |
| Text (non-clickable) | ✅ | Native | Sections with `<div class="section">` for non-clickable items |
| Icon dividers | ✅ | Native | Icons as separators using `<i class="right angle icon divider">` or similar icon classes |
| Text dividers | ✅ | Native | Text separators using `<div class="divider">/</div>` |
| Mixed content | ✅ | Composed | Sections can contain nested links, e.g., "Search for: [paper towels]" |
| Icon support | ❌ | - | No dedicated support for icons within breadcrumb sections (only as dividers) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard breadcrumb | ✅ | Native | Basic `class="ui breadcrumb"` with sections and dividers |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page (active) | ✅ | Native | `<div class="active section">` indicates current location |
| Disabled items | ❌ | - | No disabled state documented |
| Clickable links | ✅ | Native | `<a class="section">` creates clickable navigation items |
| Non-clickable text | ✅ | Native | `<div class="section">` creates non-interactive text items |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text separators | ✅ | Native | `/` or custom text in `<div class="divider">` |
| Icon separators | ✅ | Native | `<i class="right angle icon divider">`, `<i class="right arrow icon divider">`, or other icons |
| Size options | ✅ | Native | 7 sizes: mini, tiny, small, (medium/default), large, big, huge, massive |
| Responsive behavior | ❌ | - | No specific responsive patterns documented |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Native | Standard `<a>` link behavior for clickable sections |
| Router integration | ❌ | - | No built-in router integration (would use standard href attributes) |
| Programmatic nav | ❌ | - | No JavaScript API documented for breadcrumb manipulation |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ❌ | - | No ARIA attributes documented |
| aria-current | ❌ | - | No aria-current attribute shown (uses `.active` class instead) |
| Keyboard navigation | ✅ | Native | Standard link keyboard navigation through `<a>` elements |
| Semantic structure | ✅ | Native | Uses semantic class names (section, divider, active) for clarity |

## Code Examples

### Basic Breadcrumb with Text Divider
```html
<div class="ui breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Store</a>
  <div class="divider">/</div>
  <div class="active section">T-Shirt</div>
</div>
```

### Breadcrumb with Icon Divider (Right Angle)
```html
<div class="ui breadcrumb">
  <a class="section">Home</a>
  <i class="right angle icon divider"></i>
  <a class="section">Registration</a>
  <i class="right angle icon divider"></i>
  <div class="active section">Personal Information</div>
</div>
```

### Breadcrumb with Icon Divider (Right Arrow)
```html
<div class="ui breadcrumb">
  <a class="section">Home</a>
  <i class="right arrow icon divider"></i>
  <a class="section">Data Structure</a>
  <i class="right arrow icon divider"></i>
  <div class="active section">Link-List</div>
</div>
```

### Breadcrumb with Mixed Content (Nested Link)
```html
<div class="ui breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <div class="section">Search for: <a href="#">paper towels</a></div>
</div>
```

### Breadcrumb with Non-Clickable Sections
```html
<div class="ui breadcrumb">
  <div class="section">Products</div>
  <div class="divider">/</div>
  <div class="active section">Paper Towels</div>
</div>
```

### Size Variations
```html
<!-- Mini -->
<div class="ui mini breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Registration</a>
  <div class="divider">/</div>
  <div class="active section">Personal Information</div>
</div>

<!-- Tiny -->
<div class="ui tiny breadcrumb">
  <a class="section">Home</a>
  <i class="right angle icon divider"></i>
  <a class="section">Registration</a>
  <i class="right angle icon divider"></i>
  <div class="active section">Personal Information</div>
</div>

<!-- Small -->
<div class="ui small breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Registration</a>
  <div class="divider">/</div>
  <div class="active section">Personal Information</div>
</div>

<!-- Medium (Default) -->
<div class="ui breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Registration</a>
  <div class="divider">/</div>
  <div class="active section">Personal Information</div>
</div>

<!-- Large -->
<div class="ui large breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Registration</a>
  <div class="divider">/</div>
  <div class="active section">Personal Information</div>
</div>

<!-- Big -->
<div class="ui big breadcrumb">
  <a class="section">Home</a>
  <i class="right chevron icon divider"></i>
  <a class="section">Registration</a>
  <i class="right chevron icon divider"></i>
  <div class="active section">Personal Information</div>
</div>

<!-- Huge -->
<div class="ui huge breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Registration</a>
  <div class="divider">/</div>
  <div class="active section">Personal Information</div>
</div>

<!-- Massive -->
<div class="ui massive breadcrumb">
  <a class="section">Home</a>
  <div class="divider">/</div>
  <a class="section">Registration</a>
  <div class="divider">/</div>
  <div class="active section">Personal Information</div>
</div>
```

## Notable Features
- **Class-based API**: All variations achieved through simple, composable CSS classes following Semantic UI's consistent naming conventions
- **Flexible divider system**: Supports both text dividers (/, >, etc.) and icon dividers (angle, arrow, chevron) for visual separation
- **Mixed content support**: Sections can contain nested links or mixed text/link content for flexible navigation patterns
- **Simple state model**: Uses `.active` class to indicate current page location
- **Consistent sizing**: Uses Semantic UI's standard 7-size scale (mini through massive) for typography scaling
- **No JavaScript required**: Pure CSS component with no behavioral JavaScript needed
- **Semantic HTML**: Uses meaningful class names (`section`, `divider`, `active`) that clearly communicate purpose
- **Element flexibility**: Sections can be `<a>` for links or `<div>` for non-clickable text
- **Icon integration**: Deep integration with Semantic UI's icon system for visual dividers

## Research Notes
- **Framework approach**: Class-based utility system from the jQuery era. Semantic UI Classic uses compositional class names for all styling and layout
- **Limited documentation**: Compared to other Semantic UI components (like Button), Breadcrumb documentation is relatively sparse with fewer code examples
- **No accessibility guidance**: Documentation doesn't mention ARIA attributes or accessibility best practices, though the semantic class names and standard link elements provide basic accessibility
- **Icon divider patterns**: Most common icon dividers are `right angle`, `right arrow`, and `right chevron` - all expressing forward movement through hierarchy
- **Manual structure**: Unlike some modern implementations, requires manual HTML composition of sections and dividers (not generated from data)
- **No responsive features**: No documented patterns for responsive behavior (truncation, collapse, etc.) on mobile devices
- **jQuery dependency**: This is the classic jQuery-based version, not the React port. However, breadcrumb appears to be a purely CSS component with no interactive jQuery behaviors
- **Simplicity**: One of the simpler Semantic UI components with minimal variations compared to Button, Form, or Menu
- **Missing modern features**: No built-in support for JSON/data-driven breadcrumbs, schema.org markup, or programmatic manipulation
- **Design philosophy**: Follows Semantic UI's principle of human-readable class names and simple composition
- **Historical significance**: Represents a straightforward, CSS-only approach to breadcrumb navigation from the pre-component era

