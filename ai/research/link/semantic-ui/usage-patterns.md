# Semantic UI - Link Usage Patterns

## Component URL
https://semantic-ui.com/elements/list.html#link
Status: ✅ Working
Version: Current (Semantic UI Classic)
Last Verified: 2025-11-06

## Documentation Quality
Basic - The link functionality is documented as part of the List element, not as a standalone component. Two variations are provided: "Link" as a list type and "Link" as content variation.

## Component Definition
- **Core purpose**: Format lists specifically for navigation purposes, with list items that function as clickable links
- **Mental model**: A specialized list styling that makes list items visually and functionally behave as navigation links
- **Semantic meaning**: Indicates a group of related navigational options, commonly used for menus, footer links, or site navigation

## Pattern Support Levels
- **Native**: CSS classes for link list styling
- **Composed**: Standard HTML anchor tags within list items
- **CSS-only**: Link list formatting via `.ui.link.list` class

## Navigation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Internal navigation | ✅ | Composed | Use standard `<a class="item">` elements with href attributes |
| External navigation | ✅ | Composed | Use `<a class="item" target="_blank">` for external links |
| Router integration | ✅ | Composed | Framework router links can be styled as list items |
| Hash links | ✅ | Composed | Standard href="#section" pattern supported |
| Download links | ✅ | Composed | Standard download attribute supported on anchor tags |

## Visual Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Underline styling | ❌ | CSS-only | No built-in underline, can be added with custom CSS |
| Color customization | ✅ | Native | Inherits from Semantic UI color system |
| Visited state | ✅ | CSS-only | Browser default :visited styling, can be customized |
| Hover effects | ✅ | Native | Built-in hover state changes opacity/color |
| Active state | ✅ | Native | `.active` class highlights current/selected item |
| Focus indicators | ✅ | CSS-only | Browser default focus styling |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onClick handler | ✅ | Composed | Standard JavaScript event handlers on anchor tags |
| New window/tab | ✅ | Composed | Use `target="_blank"` attribute on anchor tags |
| Disabled state | ❌ | CSS-only | No native disabled state, requires custom CSS |
| No-follow attribute | ✅ | Composed | Standard `rel="nofollow"` attribute supported |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ✅ | Composed | Standard ARIA attributes can be added to anchor tags |
| Keyboard navigation | ✅ | Native | Standard tab navigation through focusable links |
| Screen reader support | ✅ | Native | Semantic HTML anchors are screen reader accessible |

## Code Examples

### Example 1: Link Type - Navigation List
```html
<!-- A list specially formatted for navigation links -->
<div class="ui link list">
  <div class="active item">Home</div>
  <a class="item">About</a>
  <a class="item">Jobs</a>
  <a class="item">Team</a>
</div>
```
**Usage**: Use `.ui.link.list` class to format an entire list as a navigation menu. The `.active` class highlights the current page.

### Example 2: Link Content - FAQ List
```html
<!-- A list can contain links as content -->
<div class="ui list">
  <a class="item">What is a FAQ?</a>
  <a class="item">Who is our user?</a>
  <a class="item">Where is our office located?</a>
</div>
```
**Usage**: Individual list items as anchor tags create clickable list content.

### Example 3: Links with Headers and Descriptions
```html
<div class="ui list">
  <div class="item">
    <a class="header">Header</a>
    <div class="description">
      Click a link in our <a>description</a>.
    </div>
  </div>
  <div class="item">
    <a class="header">Learn More</a>
    <div class="description">
      Learn more about this site on <a>our FAQ page</a>.
    </div>
  </div>
</div>
```
**Usage**: Combine link headers with descriptions containing inline links for richer content structures.

### Example 4: Footer Navigation (Real-world Example)
```html
<div class="three wide column">
  <h4 class="ui header">Community</h4>
  <div class="ui link list">
    <a class="item" href="https://www.transifex.com/organization/semantic-org/" target="_blank">Help Translate</a>
    <a class="item" href="https://github.com/Semantic-Org/Semantic-UI/issues" target="_blank">Submit an Issue</a>
    <a class="item" href="https://gitter.im/Semantic-Org/Semantic-UI" target="_blank">Join our Chat</a>
    <a class="item" href="/cla.html" target="_blank">CLA</a>
  </div>
</div>
```
**Usage**: Footer links organized as a vertical navigation list.

### Example 5: Horizontal Link List
```html
<div class="ui horizontal small divided link list">
  <a class="item" href="http://semantic-ui.mit-license.org/" target="_blank">Free & Open Source (MIT)</a>
  <a class="item" href="https://github.com/sponsors/jlukic" target="_blank">Support</a>
</div>
```
**Usage**: Combine `.horizontal`, `.divided`, and `.link` classes for inline link lists with separators.

### Example 6: Bulleted Link List
```html
<div class="ui horizontal bulleted link list">
  <a class="item">Home</a>
  <a class="item">About</a>
  <a class="item">Contact</a>
  <a class="item">Support</a>
</div>
```
**Usage**: Horizontal link list with bullet separators between items.

## Notable Features
- **Dual Pattern**: "Link" functions both as a list type (`.link` class) and as content (anchor tags within items)
- **Composable**: Can be combined with other list modifiers (horizontal, bulleted, divided, etc.)
- **Active State**: Built-in `.active` class for current page indication
- **Semantic HTML**: Uses standard `<a>` elements for proper accessibility
- **Flexible Structure**: Supports both `<div class="item">` and `<a class="item">` patterns
- **No JavaScript Required**: Pure CSS implementation

## Semantic UI List Modifiers Compatible with Links
The link list type can be combined with other Semantic UI list classes:

- **Layout Modifiers**: `horizontal`, `vertical` (default)
- **Dividers**: `divided`, `bulleted`
- **Sizing**: `small`, `large`, `massive`, `mini`, `tiny`, `huge`
- **Styling**: `relaxed`, `very relaxed`, `celled`, `animated`
- **Selection**: `selection` (for interactive hover states)
- **Alignment**: `middle aligned`, `top aligned`

## Research Notes
- The Link pattern is documented within the List element rather than as a standalone component
- Two distinct patterns exist: "Link Type" (entire list formatted for navigation) and "Link Content" (individual items as links)
- Documentation shows both `<div class="item">` with anchors inside and `<a class="item">` patterns
- Real-world usage examples found in the Semantic UI website footer demonstrate practical implementation
- No explicit disabled state or loading state - these would require custom implementation
- The `.active` class provides visual distinction for current page/selection
- Compatible with standard HTML anchor attributes (href, target, rel, download, etc.)

## Common Patterns Observed
1. **Footer Navigation**: Vertical link lists organized in columns
2. **FAQ Lists**: Simple clickable question lists
3. **Site Navigation**: Horizontal link lists with dividers
4. **Documentation Links**: Lists with headers and descriptions containing inline links
5. **Social/Community Links**: External link lists with target="_blank"

## Related List Variations
- **Basic List**: Standard list without link styling
- **Selection List**: Interactive lists with hover states (similar but different purpose)
- **Divided List**: Lists with visual dividers (can be combined with link lists)
- **Bulleted List**: Lists with bullet points (can be combined with link lists)

---

**Research Completed**: 2025-11-06
**Pattern**: Link (List Type and Content Variation)
**Framework**: Semantic UI Classic
**Documentation**: https://semantic-ui.com/elements/list.html#link
