# Semantic UI - Pagination Usage Patterns

## Component URL
https://semantic-ui.com/collections/menu.html#pagination
Status: ✅ Working
Version: Current (Semantic UI Classic)
Last Verified: 2025-11-06

## Documentation Quality
Basic - The pagination component is documented as a specialized menu type with minimal dedicated examples. Most implementation details must be inferred from the general menu component documentation and third-party examples.

## Component Definition
- **Core purpose**: Provides a specialized menu format for presenting navigational links to pages of content in a collection or dataset.
- **Mental model**: Pagination is a formatted variant of the Menu component, specifically styled for page navigation. It displays sequential page numbers with navigation controls (previous/next, first/last) and uses ellipsis notation to represent omitted page ranges.
- **Semantic meaning**: Communicates the current position within a multi-page dataset and provides controls for navigating between pages.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Composed | Individual page numbers rendered as `<a class="item">` elements within the pagination menu |
| Previous/Next buttons | ✅ | Composed | Icon items with chevron icons: `<a class="icon item"><i class="left chevron icon"></i></a>` |
| First/Last buttons | ✅ | Composed | Icon items with double angle icons: `<a class="icon item"><i class="angle double left icon"></i></a>` |
| Page size selector | ❌ | N/A | Not part of the pagination menu component |
| Total count display | ❌ | N/A | Not part of the pagination menu component |
| Quick jumper | ❌ | N/A | Not part of the pagination menu component |
| Ellipsis notation | ✅ | Composed | Disabled items with ellipsis: `<div class="disabled item">...</div>` |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Inherits menu size variations: `small`, `large`, `mini`, `tiny`, `massive` via standard menu modifiers |
| Simplified mode | ✅ | Composed | Can omit boundary links (first/last) or direction links (prev/next) |
| Button style | ✅ | Native | Uses standard menu item styling - items are anchor tags with menu item classes |
| Disabled state | ✅ | Native | `disabled` class on items: `<a class="disabled item">` or `<div class="disabled item">` |
| Custom rendering | ✅ | Composed | Any HTML can be placed within items; supports icon-only, text-only, or mixed content |
| Active state | ✅ | Native | `active` class highlights current page: `<a class="active item">1</a>` |
| Icon variations | ✅ | Composed | Supports chevron, angle, or custom icons for navigation controls |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ❌ | Custom JS required | No built-in JavaScript behavior; requires custom event handlers on anchor tags |
| Controlled mode | ⚠️ | Custom JS required | Component is purely presentational; state management requires custom implementation |
| Uncontrolled mode | ⚠️ | Custom JS required | Component is purely presentational; state management requires custom implementation |
| Keyboard navigation | ⚠️ | Native (browser) | Standard anchor tag keyboard navigation via Tab and Enter; no enhanced keyboard controls |
| URL integration | ⚠️ | Custom JS required | Anchor tags can link to pages via href, but dynamic behavior requires JavaScript |

## Code Examples

### Basic Pagination Menu
```html
<!-- Simple numbered pagination -->
<div class="ui pagination menu">
  <a class="active item">1</a>
  <a class="item">2</a>
  <a class="item">3</a>
  <a class="item">4</a>
  <a class="item">5</a>
</div>
```

### Pagination with Navigation Controls
```html
<!-- Full-featured pagination with icons -->
<div class="ui pagination menu">
  <!-- First page button -->
  <a class="icon item">
    <i class="angle double left icon"></i>
  </a>

  <!-- Previous page button -->
  <a class="icon item">
    <i class="left chevron icon"></i>
  </a>

  <!-- Page numbers -->
  <a class="item">1</a>
  <a class="active item">2</a>
  <a class="item">3</a>
  <a class="item">4</a>
  <a class="item">5</a>

  <!-- Next page button -->
  <a class="icon item">
    <i class="right chevron icon"></i>
  </a>

  <!-- Last page button -->
  <a class="icon item">
    <i class="angle double right icon"></i>
  </a>
</div>
```

### Pagination with Ellipsis
```html
<!-- Pagination with gaps indicated by ellipsis -->
<div class="ui pagination menu">
  <a class="icon item">
    <i class="left chevron icon"></i>
  </a>

  <a class="item">1</a>
  <div class="disabled item">...</div>
  <a class="item">10</a>
  <a class="active item">11</a>
  <a class="item">12</a>
  <div class="disabled item">...</div>
  <a class="item">50</a>

  <a class="icon item">
    <i class="right chevron icon"></i>
  </a>
</div>
```

### Disabled States
```html
<!-- Pagination with disabled navigation controls -->
<div class="ui pagination menu">
  <!-- Disabled previous button (on first page) -->
  <a class="disabled icon item">
    <i class="left chevron icon"></i>
  </a>

  <a class="active item">1</a>
  <a class="item">2</a>
  <a class="item">3</a>

  <!-- Enabled next button -->
  <a class="icon item">
    <i class="right chevron icon"></i>
  </a>
</div>
```

### With JavaScript (Example Implementation)
```html
<div class="ui pagination menu" id="pagination">
  <a class="icon item" data-page="first">
    <i class="angle double left icon"></i>
  </a>
  <a class="icon item" data-page="prev">
    <i class="left chevron icon"></i>
  </a>

  <a class="item" data-page="1">1</a>
  <a class="active item" data-page="2">2</a>
  <a class="item" data-page="3">3</a>
  <a class="item" data-page="4">4</a>
  <a class="item" data-page="5">5</a>

  <a class="icon item" data-page="next">
    <i class="right chevron icon"></i>
  </a>
  <a class="icon item" data-page="last">
    <i class="angle double right icon"></i>
  </a>
</div>

<script>
// Example JavaScript implementation (jQuery)
$('#pagination .item').on('click', function(e) {
  e.preventDefault();

  var page = $(this).data('page');
  var currentPage = parseInt($('.active.item').data('page'));
  var totalPages = 5;

  // Calculate target page
  var targetPage;
  if (page === 'first') targetPage = 1;
  else if (page === 'last') targetPage = totalPages;
  else if (page === 'prev') targetPage = Math.max(1, currentPage - 1);
  else if (page === 'next') targetPage = Math.min(totalPages, currentPage + 1);
  else targetPage = parseInt(page);

  // Update active state
  $('.pagination .item').removeClass('active');
  $('.pagination .item[data-page="' + targetPage + '"]').addClass('active');

  // Update disabled states
  $('.pagination .item[data-page="first"], .pagination .item[data-page="prev"]')
    .toggleClass('disabled', targetPage === 1);
  $('.pagination .item[data-page="last"], .pagination .item[data-page="next"]')
    .toggleClass('disabled', targetPage === totalPages);

  // Load page content (custom implementation)
  loadPage(targetPage);
});
</script>
```

[View Live](https://semantic-ui.com/collections/menu.html#pagination)

## Notable Features
- **Purely presentational**: The pagination menu is entirely CSS-based with no built-in JavaScript behavior, making it framework-agnostic and highly flexible
- **Menu inheritance**: Inherits all styling variations from the base Menu component (inverted, secondary, pointing, tabular, etc.)
- **Icon flexibility**: Supports any Semantic UI icon for navigation controls (chevrons, angles, arrows, etc.)
- **Semantic HTML**: Uses standard anchor tags for accessibility and SEO benefits
- **Class-based state management**: Active and disabled states are controlled purely via CSS classes
- **Minimal markup**: Very lightweight DOM structure compared to other UI frameworks
- **Composition-first**: Encourages building pagination through composition of menu items rather than props

## Research Notes
- **Limited documentation**: Pagination receives minimal coverage in the official docs, appearing only as a brief mention under the Menu collection with a single visual example
- **No built-in behavior**: Unlike many modern UI frameworks, Semantic UI's pagination is purely presentational. All interactive behavior, state management, and page navigation logic must be implemented separately
- **Framework agnostic**: The lack of built-in JavaScript makes it equally suitable for jQuery, Angular, React, Vue, or vanilla JavaScript implementations
- **Third-party implementations exist**: The community has created various pagination directives and components that wrap the base pagination menu (e.g., angular-utils-pagination, semantic-ui-react Pagination addon)
- **CSS-first philosophy**: Consistent with Semantic UI's design philosophy, the component prioritizes visual design and CSS architecture over JavaScript functionality
- **Menu variations apply**: Since pagination is a menu variant, all menu modifiers work (sizes, colors, attached, borderless, compact, fluid, etc.)
- **Accessibility considerations**: The base implementation provides semantic HTML structure, but ARIA attributes and keyboard navigation enhancements require custom implementation

## Pattern Insights

### Strengths
1. **Maximum flexibility**: No JavaScript coupling allows for any state management approach
2. **Lightweight**: Minimal DOM and CSS footprint
3. **Familiar patterns**: Uses standard menu component patterns
4. **Easy theming**: Inherits full Semantic UI theming system

### Limitations
1. **No built-in interactivity**: Requires complete custom implementation for behavior
2. **Manual state management**: Active/disabled states must be managed via DOM manipulation
3. **Limited examples**: Official documentation provides minimal guidance for implementation
4. **No data binding**: Unlike React/Vue components, requires manual DOM updates

### Ideal Use Cases
- Projects already using Semantic UI styling
- Applications needing custom pagination logic
- Server-side rendered pagination where JavaScript behavior is optional
- Situations requiring specific framework integration (React, Vue, Angular, etc.)

### Integration Patterns
The pagination menu is commonly integrated with:
- **Tables**: For data table pagination controls
- **Grids**: For image gallery or product listing pagination
- **Search results**: For multi-page search result navigation
- **Blog posts**: For article listing pagination
- **API responses**: For paginated REST API result navigation

## CSS Class Reference

### Container Classes
- `ui` - Base Semantic UI namespace
- `pagination` - Pagination-specific styling
- `menu` - Menu component base

### Item Classes
- `item` - Standard menu item (page number or control)
- `icon item` - Menu item containing only an icon
- `active` - Highlights current page
- `disabled` - Grays out and disables interaction

### Size Modifiers (inherited from Menu)
- `mini` - Smallest size
- `tiny` - Very small size
- `small` - Small size
- (default) - Standard size
- `large` - Large size
- `huge` - Very large size
- `massive` - Largest size

### Style Modifiers (inherited from Menu)
- `inverted` - Dark theme
- `fluid` - Full width
- `compact` - Minimal padding
- `borderless` - Remove borders

## Related Components
- **Menu** - Parent component providing base styling and structure
- **Button** - Alternative navigation control pattern
- **Table** - Often paired with pagination for data tables
- **Grid** - Used with pagination for card/image layouts
- **Segment** - Container often used with paginated content

---

**Research Methodology**: Information compiled from official Semantic UI documentation (semantic-ui.com), legacy documentation sites (legacy.semantic-ui.com), community implementations (CodesLeuth pagination template), and educational resources (GeeksforGeeks). Examples validated against official Semantic UI CSS classes and patterns.

**Documentation Gaps Noted**: Official documentation lacks comprehensive examples of JavaScript integration, state management patterns, and advanced use cases. Most implementation knowledge comes from community resources and third-party framework integrations.
