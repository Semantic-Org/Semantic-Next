# Semantic UI Classic - List Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://semantic-ui.com/elements/list.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of list patterns with visual examples showing various list types, item variations, icon integration, image/avatar lists, content alignment, and horizontal list configurations.

## Component Definition
- **Core purpose**: A semantic element to display a series of related items, whether as a simple bulleted list, ordered list, icon list, or more complex content with images and descriptions
- **Mental model**: A flexible container for displaying related sequential items with optional visual enhancements (icons, images, descriptions). Can adapt from basic semantic lists to complex content presentation
- **Semantic meaning**: Communicates a series of related items. List type (bulleted, ordered, link-based) indicates the relationship and importance hierarchy. Item variations suggest level of detail and content richness

## Pattern Support Levels
- **Native**: Dedicated class/API
- **Composed**: Via HTML composition with other elements
- **CSS-only**: Requires custom styling

## List Types
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Bulleted list | ✅ | Native | Basic unordered list with bullets using `class="ui bulleted list"` |
| Ordered list | ✅ | Native | Numbered list using `class="ui ordered list"` |
| Unordered list | ✅ | Native | Basic list without bullets using `class="ui list"` |
| Link list | ✅ | Native | List of clickable links using `class="ui link list"` |
| Divided list | ✅ | Native | List items separated by dividers using `class="ui divided list"` |
| Celled list | ✅ | Native | List items displayed in cells/table format using `class="ui celled list"` |
| Relaxed list | ✅ | Native | List with increased spacing between items using `class="ui relaxed list"` |
| Very relaxed list | ✅ | Native | List with even more spacing using `class="ui very relaxed list"` |

## List Item Variations
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple item | ✅ | Native | Basic list item with text only using `<div class="item">` |
| Item with icon | ✅ | Native | List item with icon prefix and text content |
| Item with image | ✅ | Native | List item with avatar/image and content |
| Item with description | ✅ | Native | Item with main content and description using nested divs |
| Item with header | ✅ | Native | Item with header text and secondary content |
| Disabled item | ✅ | Native | Visually disabled list item using `class="disabled"` |
| Active item | ✅ | Native | Highlighted active item using `class="active"` |

## Icon Lists
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon with text | ✅ | Native | Icon element paired with text content |
| Icon position (left) | ✅ | Native | Icon positioned to the left of content (default) |
| Icon alignment | ✅ | Native | Icon vertically aligned with content top/middle/bottom |
| Multiple icons | ✅ | Composed | Multiple icon elements within item |

## Image/Avatar Lists
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Avatar image | ✅ | Native | Small image (avatar) before content |
| Avatar size (mini) | ✅ | Native | Mini-sized avatar using Semantic size classes |
| Avatar size (tiny) | ✅ | Native | Tiny-sized avatar |
| Avatar size (small) | ✅ | Native | Small-sized avatar |
| Avatar rounded | ✅ | Native | Circular avatar using Semantic rounding classes |
| Multiple images | ✅ | Composed | Multiple images within item |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text only | ✅ | Native | Simple text content |
| Text with description | ✅ | Native | Main text with secondary description |
| Text with metadata | ✅ | Composed | Text with additional metadata/stats |
| Rich content | ✅ | Composed | Complex content with multiple elements |

## Content Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Left aligned (default) | ✅ | Native | Content aligned to the left |
| Center aligned | ✅ | Native | Content centered using `class="center aligned"` |
| Right aligned | ✅ | Native | Content aligned to the right using `class="right aligned"` |
| Top aligned icon/image | ✅ | Native | Icon/image aligned to top of item |
| Middle aligned icon/image | ✅ | Native | Icon/image vertically centered |
| Bottom aligned icon/image | ✅ | Native | Icon/image aligned to bottom |

## Horizontal vs Vertical Lists
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical list (default) | ✅ | Native | Items stacked vertically (default behavior) |
| Horizontal list | ✅ | Native | Items arranged horizontally using `class="ui horizontal list"` |

## Sizing & Spacing
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Relaxed spacing | ✅ | Native | More space between items using `class="relaxed"` |
| Very relaxed spacing | ✅ | Native | Extra space using `class="very relaxed"` |
| Compact spacing | ✅ | CSS-only | Less space (may require custom CSS) |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| With header | ✅ | Composed | List with header before items |
| With divider | ✅ | Composed | List with divider lines between items |
| In segment | ✅ | Composed | List wrapped in segment for card-like appearance |
| In menu | ✅ | Composed | List within menu for navigation |
| With pagination | ✅ | Composed | List with pagination controls |

## CSS Class Patterns Summary
| Class | Element | Purpose |
|-------|---------|---------|
| `.ui.list` | Root | Base list container |
| `.ui.bulleted.list` | Root | Unordered list with bullets |
| `.ui.ordered.list` | Root | Ordered list with numbers |
| `.ui.link.list` | Root | List of clickable links |
| `.ui.divided.list` | Root | List with dividers between items |
| `.ui.celled.list` | Root | List items in cells/boxes |
| `.ui.relaxed.list` | Root | List with increased item spacing |
| `.ui.very.relaxed.list` | Root | List with extra spacing |
| `.ui.horizontal.list` | Root | Horizontal layout (items in a row) |
| `.item` | Child | Individual list item |
| `.active` | Item | Mark item as active/selected |
| `.disabled` | Item | Disable item visually |
| `.header` | Item/Child | Header text within item |
| `.description` | Item/Child | Secondary description text |
| `.icon` | Item/Child | Icon element prefix |
| `.image` | Item/Child | Image/avatar element |
| `.content` | Item/Child | Main content wrapper |
| `.list` | Item/Child | Nested list |
| `.ui.mini.image` | Element | Mini-sized image |
| `.ui.tiny.image` | Element | Tiny-sized image |
| `.ui.small.image` | Element | Small-sized image |
| `.ui.circular` | Element | Circular/rounded shape |
| `.center.aligned` | Item | Center-aligned content |
| `.right.aligned` | Item | Right-aligned content |

## Code Examples

### Basic Bulleted List
```html
<!-- Simple bulleted list -->
<div class="ui bulleted list">
  <div class="item">Apples</div>
  <div class="item">Oranges</div>
  <div class="item">Pears</div>
</div>
```

**Behavior**: Displays a standard bulleted list with circular bullets before each item. Items are stacked vertically.

**Typical Use Case**: Feature lists, ingredient lists, simple enumerations, todo items.

### Ordered List
```html
<!-- Numbered list -->
<div class="ui ordered list">
  <div class="item">First step</div>
  <div class="item">Second step</div>
  <div class="item">Third step</div>
</div>
```

**Behavior**: Displays items with sequential numbering (1, 2, 3, etc.). Items are stacked vertically.

**Typical Use Case**: Instructions, steps, rankings, sequences, recipes, tutorials.

### Unordered List (No Bullets)
```html
<!-- List without bullets or numbers -->
<div class="ui list">
  <div class="item">Item one</div>
  <div class="item">Item two</div>
  <div class="item">Item three</div>
</div>
```

**Behavior**: Displays items without any prefix. Useful for semantic markup without visual indicators.

**Typical Use Case**: Generic lists, breadcrumbs, navigation lists, related items.

### Link List
```html
<!-- Clickable link list -->
<div class="ui link list">
  <a class="item" href="#">Home</a>
  <a class="item" href="#">About</a>
  <a class="item" href="#">Contact</a>
  <a class="item" href="#">Services</a>
</div>
```

**Behavior**: List of clickable links with hover effects. Links are styled as list items.

**Typical Use Case**: Navigation menus, breadcrumbs, related links, site navigation.

### Divided List
```html
<!-- List with dividers between items -->
<div class="ui divided list">
  <div class="item">
    <div class="content">
      <div class="header">Stevie Feliciano</div>
      <div class="description">Last seen watching Arrested Development just now.</div>
    </div>
  </div>
  <div class="item">
    <div class="content">
      <div class="header">Kristy Thomas</div>
      <div class="description">Last seen watching Orange Is The New Black 2 hours ago</div>
    </div>
  </div>
</div>
```

**Behavior**: Items are separated by horizontal divider lines for visual clarity.

**Typical Use Case**: User lists, comment threads, activity feeds, related items.

### Celled List
```html
<!-- List with cells/borders -->
<div class="ui celled list">
  <div class="item">
    <div class="content">
      <div class="header">Header</div>
      Content goes here
    </div>
  </div>
  <div class="item">
    <div class="content">
      <div class="header">Another Item</div>
      More content
    </div>
  </div>
</div>
```

**Behavior**: Each item is displayed in a bordered cell/box with spacing between items.

**Typical Use Case**: Card-like layouts, grouped content, dashboard items.

### Relaxed List
```html
<!-- List with increased spacing -->
<div class="ui relaxed list">
  <div class="item">
    <div class="content">
      <div class="header">Relaxed Item 1</div>
      <div class="description">More breathing room between items</div>
    </div>
  </div>
  <div class="item">
    <div class="content">
      <div class="header">Relaxed Item 2</div>
      <div class="description">Easier to scan and read</div>
    </div>
  </div>
</div>
```

**Behavior**: Increases vertical spacing between list items for improved readability.

**Typical Use Case**: Long-form lists, content-heavy items, navigation with descriptions.

### Very Relaxed List
```html
<!-- List with extra spacing -->
<div class="ui very relaxed list">
  <div class="item">Item with lots of breathing room</div>
  <div class="item">Much more comfortable spacing</div>
  <div class="item">Best for important items</div>
</div>
```

**Behavior**: Maximum spacing between items for prominent display.

**Typical Use Case**: Important lists, highlighted items, showcase layouts.

### Icon List
```html
<!-- List with icons -->
<div class="ui list">
  <div class="item">
    <i class="heart icon"></i>
    <div class="content">Love</div>
  </div>
  <div class="item">
    <i class="star icon"></i>
    <div class="content">Favorite</div>
  </div>
  <div class="item">
    <i class="check icon"></i>
    <div class="content">Done</div>
  </div>
</div>
```

**Behavior**: Icons appear before content, vertically centered by default.

**Typical Use Case**: Feature lists with icons, todo lists, status indicators, capability lists.

### Avatar/Image List
```html
<!-- List with avatar images -->
<div class="ui list">
  <div class="item">
    <img class="ui mini rounded image" src="user1.jpg" alt="User 1">
    <div class="content">
      <div class="header">Stevie Feliciano</div>
      <div class="description">Last seen watching Arrested Development just now.</div>
    </div>
  </div>
  <div class="item">
    <img class="ui mini rounded image" src="user2.jpg" alt="User 2">
    <div class="content">
      <div class="header">Kristy Thomas</div>
      <div class="description">Last seen watching Orange Is The New Black 2 hours ago</div>
    </div>
  </div>
</div>
```

**Behavior**: Images appear before content, typically used for avatars in user lists.

**Typical Use Case**: User lists, team rosters, participant lists, social feeds.

### Content with Icon and Description
```html
<!-- Rich item content -->
<div class="ui divided list">
  <div class="item">
    <i class="large github middle aligned icon"></i>
    <div class="content">
      <div class="header">Semantic-Org/Semantic-UI</div>
      <div class="description">Updated 10 mins ago</div>
    </div>
  </div>
  <div class="item">
    <i class="large github middle aligned icon"></i>
    <div class="content">
      <div class="header">Semantic-Org/Semantic-UI-Docs</div>
      <div class="description">Updated 22 mins ago</div>
    </div>
  </div>
</div>
```

**Behavior**: Combines icons with rich content structure (header + description). Icon is middle-aligned with content.

**Typical Use Case**: Repository lists, project lists, recent activity, content feeds.

### Horizontal List
```html
<!-- Horizontal layout -->
<div class="ui horizontal list">
  <div class="item">
    <i class="globe icon"></i> New York
  </div>
  <div class="item">
    <i class="flag icon"></i> United States
  </div>
  <div class="item">
    <i class="users icon"></i> 350,000 Friends
  </div>
</div>
```

**Behavior**: Items are arranged horizontally in a single row. Useful for tags, chips, or inline lists.

**Typical Use Case**: Tags, breadcrumbs, inline lists, chips/filters, metadata display.

### Disabled Items
```html
<!-- List with disabled items -->
<div class="ui list">
  <div class="item">Active item</div>
  <div class="item disabled">Disabled item (grayed out)</div>
  <div class="item">Another active item</div>
</div>
```

**Behavior**: Disabled items appear grayed out or with reduced opacity.

**Typical Use Case**: Conditional actions, unavailable options, locked features.

### Active Item
```html
<!-- List with active item -->
<div class="ui list">
  <div class="item">Option 1</div>
  <div class="item active">Selected option</div>
  <div class="item">Option 3</div>
</div>
```

**Behavior**: Active item is highlighted (usually with background color or bold text).

**Typical Use Case**: Current selection, active navigation item, selected option.

### Nested Lists
```html
<!-- List with nested items -->
<div class="ui list">
  <div class="item">
    <div class="header">Parent Item</div>
    <div class="list">
      <div class="item">Child item 1</div>
      <div class="item">Child item 2</div>
      <div class="item">Child item 3</div>
    </div>
  </div>
  <div class="item">
    <div class="header">Another Parent</div>
    <div class="list">
      <div class="item">Nested child</div>
    </div>
  </div>
</div>
```

**Behavior**: Nested lists create hierarchical structures. Child items are indented relative to parent.

**Typical Use Case**: Directory trees, hierarchical navigation, outline structures, category/subcategory lists.

### Center Aligned List
```html
<!-- Center aligned items -->
<div class="ui center aligned list">
  <div class="item">Centered item 1</div>
  <div class="item">Centered item 2</div>
  <div class="item">Centered item 3</div>
</div>
```

**Behavior**: All items are centered horizontally. Useful for callouts or emphasized content.

**Typical Use Case**: Featured content, callouts, centered testimonials.

### Right Aligned List
```html
<!-- Right aligned items -->
<div class="ui right aligned list">
  <div class="item">Right item 1</div>
  <div class="item">Right item 2</div>
  <div class="item">Right item 3</div>
</div>
```

**Behavior**: All items are aligned to the right. Useful for numbers, statistics, or right-to-left languages.

**Typical Use Case**: Statistics, numbers, RTL content, right-aligned timestamps.

### List with Image and Content
```html
<!-- Complex item structure -->
<div class="ui divided relaxed list">
  <div class="item">
    <img class="ui tiny rounded image" src="avatar.jpg" alt="Avatar">
    <div class="content">
      <div class="header">Stevie Feliciano</div>
      <div class="description">
        Stevie Feliciano is a library scientist living in New York City. She likes to spend time reading, traveling, and writing about her adventures.
      </div>
    </div>
  </div>
  <div class="item">
    <img class="ui tiny rounded image" src="avatar2.jpg" alt="Avatar">
    <div class="content">
      <div class="header">Veronika Ossi</div>
      <div class="description">
        Veronika Ossi is a business analyst and museum curator living in the Netherlands. She enjoys modern art, a long trip, and spicy food.
      </div>
    </div>
  </div>
</div>
```

**Behavior**: Combines images, headers, and descriptions for rich content display.

**Typical Use Case**: User profiles, team members, blog comments, social feeds.

### List in Segment
```html
<!-- List within a segment -->
<div class="ui segment">
  <div class="ui bulleted list">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
  </div>
</div>
```

**Behavior**: List wrapped in segment provides visual containment and styling.

**Typical Use Case**: Grouped content, card layouts, sidebar content.

### Bulleted List with Multiple Levels
```html
<!-- Nested bulleted structure -->
<div class="ui bulleted list">
  <div class="item">First level item
    <div class="ui bulleted list">
      <div class="item">Second level item</div>
      <div class="item">Another second level</div>
    </div>
  </div>
  <div class="item">Another first level</div>
</div>
```

**Behavior**: Creates hierarchy with nested indentation and bullet variations.

**Typical Use Case**: Outlines, multi-level lists, hierarchical content.

### Combined Features - Feature List
```html
<!-- Feature list with icons and descriptions -->
<div class="ui relaxed divided list">
  <div class="item">
    <i class="large lightning icon"></i>
    <div class="content">
      <div class="header">Lightning Fast</div>
      <div class="description">
        Built with performance in mind. Fully semantic HTML with CSS-driven styling.
      </div>
    </div>
  </div>
  <div class="item">
    <i class="large users icon"></i>
    <div class="content">
      <div class="header">Community Driven</div>
      <div class="description">
        Maintained by over 2000 community members.
      </div>
    </div>
  </div>
  <div class="item">
    <i class="large bell icon"></i>
    <div class="content">
      <div class="header">Well Documented</div>
      <div class="description">
        Documentation that describes most patterns with examples.
      </div>
    </div>
  </div>
</div>
```

**Behavior**: Rich feature list with icons, headers, and descriptions combined.

**Typical Use Case**: Feature lists, capabilities, benefits, product highlights.

## Customization Patterns

### Custom Bullet Style
```css
/* Custom bullet style for bulleted lists */
.ui.bulleted.list > .item:before {
  content: '▸';  /* Custom bullet character */
  color: #1b1c1d;
  margin-right: 0.5em;
}
```

### Custom Item Spacing
```css
/* Increase spacing between items */
.ui.list > .item {
  padding: 1.5em 0;
}
```

### Custom Icon Color
```css
/* Style icons in list items */
.ui.list .item > .icon {
  color: #3b83bd;
}
```

### Custom List Style
```css
/* Apply custom background and borders */
.ui.list > .item {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 1em;
  margin-bottom: 0.5em;
  border-radius: 4px;
}
```

## Notable Features

- **Semantic markup**: Uses semantic `<div>` structure with class-based styling instead of traditional `<ul>`/`<ol>` elements
- **Flexible types**: Supports bulleted, ordered, link, divided, and celled variations
- **Rich content support**: Can contain complex nested structures with icons, images, headers, descriptions
- **Icon integration**: Direct support for Semantic UI icons with alignment options
- **Image/avatar support**: Integrates with Semantic UI image sizing and rounding utilities
- **Horizontal layout**: Optional horizontal layout for inline list display
- **Nesting support**: Lists can be nested for hierarchical structures
- **Spacing variations**: Relaxed and very relaxed options for increased spacing
- **Content alignment**: Support for left, center, and right alignment
- **Item states**: Active and disabled item states
- **Class-based API**: Pure CSS implementation with no JavaScript required for basic functionality
- **Component integration**: Works seamlessly with other Semantic UI components (segments, icons, images)
- **Accessibility**: Maintains semantic structure for screen readers
- **Mobile-responsive**: List layouts respond to viewport size
- **Theme customization**: Can be customized via CSS variables and less variables in site.variables

## Implementation Details

### HTML Architecture
The list component uses semantic `<div>` elements rather than traditional HTML list elements. This approach provides:
- Flexibility for complex item structures
- Consistent API with other Semantic UI components
- Custom styling without HTML element constraints

### CSS Architecture
The list is implemented as a pure CSS solution with:
- **Class selectors** for type and variation identification
- **Media queries** for responsive behavior (optional)
- **Flexbox** or grid for alignment control
- **Custom properties** for theming and customization

### Browser Compatibility
- Works across all modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ support in Semantic UI Classic
- Graceful degradation: Falls back to standard list appearance in very old browsers
- No JavaScript required for core functionality

### Performance Characteristics
- **Minimal CSS footprint**: Efficient class-based styling
- **No JavaScript overhead**: Pure CSS for basic lists
- **Paint performance**: Efficient rendering due to simple DOM structure
- **Layout stability**: Fixed structures prevent layout shift

## Research Notes

- **Semantic HTML debate**: While Semantic UI uses `<div>` elements instead of semantic `<ul>`/`<ol>`, this approach prioritizes flexibility and consistency with the component system over strict semantic HTML adherence. Modern HTML validators may flag this, but accessibility is maintained through ARIA attributes when needed.

- **List vs navigation pattern**: Semantic UI lists are distinct from navigation menus. Lists present related content items, while menus (often lists) present navigational options or actions. The List component supports both use cases through the `.link` variant.

- **Icon positioning strategy**: Icons are positioned left-aligned and top-aligned by default. The ability to change alignment (top, middle, bottom) suggests icons are treated as equal content elements alongside text, not just decorative prefixes.

- **Image avatar pattern**: Mini/tiny image sizes with rounded corners are explicitly supported, indicating avatars are a primary use case. The integration with Semantic's image utilities (sizing, rounding) shows deliberate design for user list scenarios.

- **Horizontal list purpose**: The horizontal variant transforms the list from a sequence into a tag-like or chip-like display. This suggests horizontal lists are used for filtering, tagging, or breadcrumb-like patterns rather than traditional horizontal navigation.

- **Nesting behavior**: Support for nested lists through `.list` elements allows hierarchy without requiring new component types. This compositional approach is consistent with Semantic UI's philosophy.

- **Divided vs celled distinction**: The divided list adds separators between items, while celled adds borders around items (like cells). This distinction shows attention to visual hierarchy and grouping semantics.

- **Relaxed spacing rationale**: Multiple spacing options (default, relaxed, very relaxed) accommodate different content densities and use cases. Dense lists (compact) might require custom CSS, suggesting this is an edge case.

- **Active/disabled states**: Support for item-level active and disabled states suggests lists are interactive, supporting selection patterns without additional JavaScript.

- **No pagination built-in**: Lists don't include built-in pagination, suggesting they're meant for small to medium datasets. Large datasets would need pagination implemented separately.

- **Class-based styling**: The pure class-based approach (no JavaScript required) reflects Semantic UI Classic's progressive enhancement philosophy. Lists work without JavaScript, with JavaScript enhancements added optionally.

- **Content alignment control**: Alignment classes (center aligned, right aligned) are applied to the list root, affecting all items. This suggests a design decision that items in a list should typically have consistent alignment rather than mixed.

- **Comparison to traditional lists**: Unlike HTML `<ul>`/`<ol>` with `<li>` children, Semantic UI lists use a more flexible structure. This allows for content that `<li>` elements wouldn't traditionally contain (images, complex structures).

- **Icon integration philosophy**: Icons are positioned using flexbox alignment, suggesting they're meant to be visually prominent alongside text, not merely decorative.

- **Component composition**: Lists can be composed with other Semantic UI elements (segments, cards, menus) without conflict, showing good design for component reusability.

- **Use case flexibility**: The same List component serves simple content (bulleted lists) to complex scenarios (user activity feeds). This unified component reduces cognitive overhead for developers.

- **Mobile considerations**: Lists are responsive by nature (horizontal on desktop, vertical on mobile via breakpoints), though not explicitly documented in all cases.

## Comparison with Modern Patterns

### HTML Native Lists
Traditional `<ul>`, `<ol>`, `<li>` elements provide semantic HTML and better accessibility out of the box. However, they're less flexible for complex content structures. Semantic UI's approach trades strict semantics for flexibility.

### CSS Utility Frameworks
Frameworks like Tailwind CSS provide list styling through utility classes but require more markup and class composition. Semantic UI's pre-defined list types are more opinionated but require less configuration.

### Modern Component Libraries
React/Vue component libraries often provide List components with props for type, items, and rendering functions. Semantic UI Classic's class-based approach is more static but works in non-JavaScript environments.

### CSS Grid/Flexbox Lists
Modern CSS layouts could achieve similar visual results with Grid or Flexbox. Semantic UI's approach predates widespread adoption of these features but remains compatible.

## Migration Considerations

When migrating to Semantic UI Next or other modern frameworks, consider:

1. **Semantic HTML**: Consider using native `<ul>`/`<ol>`/`<li>` if strict HTML semantics are important
2. **Component structure**: Document nested list patterns and how they translate to new framework
3. **Icon integration**: Verify icon positioning and alignment work identically
4. **Image sizing**: Ensure image utility classes transfer to new framework
5. **Spacing variations**: Confirm relaxed and very relaxed spacing is preserved
6. **State management**: Check that active/disabled states work as expected
7. **Horizontal layout**: Test horizontal list behavior on different breakpoints
8. **Nesting patterns**: Verify nested list indentation and bullets behave the same
9. **Alignment classes**: Map alignment modifiers to new framework equivalents
10. **CSS customization**: Migrate any custom CSS overrides for bullet styles, spacing, colors

## Common Use Cases

### Feature List
```html
<div class="ui relaxed divided list">
  <div class="item">
    <i class="check icon"></i>
    <div class="content">Fast performance</div>
  </div>
  <div class="item">
    <i class="check icon"></i>
    <div class="content">Easy to customize</div>
  </div>
  <div class="item">
    <i class="check icon"></i>
    <div class="content">Well documented</div>
  </div>
</div>
```

### User List
```html
<div class="ui divided list">
  <div class="item">
    <img class="ui mini rounded image" src="avatar.jpg">
    <div class="content">
      <div class="header">John Doe</div>
      <div class="description">Member since 2020</div>
    </div>
  </div>
</div>
```

### Navigation List
```html
<div class="ui link list">
  <a class="item active" href="#">Home</a>
  <a class="item" href="#">About</a>
  <a class="item" href="#">Services</a>
  <a class="item" href="#">Contact</a>
</div>
```

### Tag List
```html
<div class="ui horizontal list">
  <div class="item">
    <span class="ui label">Python</span>
  </div>
  <div class="item">
    <span class="ui label">JavaScript</span>
  </div>
  <div class="item">
    <span class="ui label">React</span>
  </div>
</div>
```

### Todo List
```html
<div class="ui bulleted list">
  <div class="item">
    <i class="square outline icon"></i>
    Complete project proposal
  </div>
  <div class="item active">
    <i class="check square icon"></i>
    Review designs
  </div>
  <div class="item">
    <i class="square outline icon"></i>
    Final testing
  </div>
</div>
```

## Edge Cases and Gotchas

1. **Semantic HTML vs divs**: Using `<div>` instead of `<ul>`/`<ol>` may impact accessibility if ARIA attributes aren't properly set
2. **Icon sizing**: Icon size can affect overall item height; ensure consistency across list items
3. **Image sizing mismatch**: Different image sizes in avatar lists can cause uneven item heights
4. **Text overflow**: Long text content in items can break layout; consider text truncation
5. **Nested list indentation**: Deep nesting can cause excessive indentation
6. **Horizontal list wrapping**: Items may wrap unpredictably on narrow screens if not constrained
7. **Spacing on mobile**: Relaxed spacing may be too much on mobile devices
8. **Icon/image alignment**: Mixing different element types (icons vs images) requires careful alignment
9. **Complex nested content**: Very complex nested structures can become hard to manage
10. **Color contrast**: Disabled items may have insufficient contrast for accessibility

## Best Practices

1. **Use semantic HTML when possible**: Prefer native `<ul>`/`<ol>` for accessibility unless flexibility is needed
2. **Consistent item structure**: Keep similar items structured the same way
3. **Icon and image consistency**: Use consistent sizing for icons/images across list items
4. **Proper alignment**: Align icons/images at top or middle, not bottom
5. **Spacing appropriately**: Use relaxed spacing only when items have sufficient content
6. **Nesting limitation**: Keep nesting to 2-3 levels; use sections for deeper hierarchies
7. **Mobile testing**: Always test list behavior on mobile devices
8. **Color contrast**: Ensure sufficient contrast for disabled and active states
9. **Loading states**: Use disabled styling for items being loaded
10. **Accessibility**: Add ARIA labels when using non-semantic `<div>` structure

## Complete Page Layout Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="semantic.min.css">
  <title>List Examples</title>
</head>
<body>
  <div class="ui container">
    <h1>List Components</h1>

    <!-- Feature list -->
    <h2>Features</h2>
    <div class="ui segment">
      <div class="ui relaxed divided list">
        <div class="item">
          <i class="large lightning icon"></i>
          <div class="content">
            <div class="header">Lightning Fast</div>
            <div class="description">Built for performance</div>
          </div>
        </div>
        <div class="item">
          <i class="large users icon"></i>
          <div class="content">
            <div class="header">Community Driven</div>
            <div class="description">Maintained by 2000+ contributors</div>
          </div>
        </div>
      </div>
    </div>

    <!-- User list -->
    <h2>Users</h2>
    <div class="ui segment">
      <div class="ui divided list">
        <div class="item">
          <img class="ui mini rounded image" src="user1.jpg">
          <div class="content">
            <div class="header">John Doe</div>
            <div class="description">Member since 2020</div>
          </div>
        </div>
        <div class="item">
          <img class="ui mini rounded image" src="user2.jpg">
          <div class="content">
            <div class="header">Jane Smith</div>
            <div class="description">Member since 2021</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Horizontal tag list -->
    <h2>Tags</h2>
    <div class="ui horizontal list">
      <div class="item">
        <span class="ui blue label">Important</span>
      </div>
      <div class="item">
        <span class="ui green label">Completed</span>
      </div>
      <div class="item">
        <span class="ui orange label">In Progress</span>
      </div>
    </div>
  </div>
</body>
</html>
```

---

**Last Updated**: 2025-11-05
**Research Status**: Complete
**Coverage**: Comprehensive - All major list types, variations, and patterns documented
