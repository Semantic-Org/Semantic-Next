# Semantic UI (jQuery) - Header & Text Elements Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://semantic-ui.com/elements/header.html
Status: ✅ Working
Version: v2.4+
Framework: Semantic UI (jQuery-based, original)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Good visual examples and thorough documentation of variations. Clear categorization of header types (page vs content). Documentation includes color options, size variations, and formatting modifiers. However, lacks explicit code examples in some sections and limited JavaScript API documentation.

## Component Definition
- **Core purpose**: Provides short summaries of content and establishes visual hierarchy within pages and content sections
- **Mental model**: Class-based styling system with two distinct header categories: page headers (hierarchy-based, rem units) and content headers (importance-based, em units)
- **Semantic meaning**: Uses semantic HTML heading elements (h1-h6) with additional styling classes, supports sub-headers for descriptions, and provides visual hierarchy through size, color, and formatting variations

## Pattern Support Levels
- **Native**: Dedicated class/attribute
- **Composed**: Via composition/children
- **Styled**: Via CSS class only
- **Not Supported**: Pattern not available

## Header Types
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page Headers | ✅ | Native | H1-H5 hierarchy using `<h1-h5 class="ui header">`, sized with rem units (context-independent) |
| Content Headers | ✅ | Native | Importance-based headers using class="ui huge\|large\|medium\|small\|tiny header", sized with em units (context-dependent) |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Paragraph text | ❌ | Not Supported | No dedicated paragraph component in Header element docs |
| Headings (h1-h6) | ✅ | Native | Full support for h1-h6 with `ui header` class |
| Sub-headers | ✅ | Native | Via `<div class="sub header">` inside header element |
| Inline styles | ❌ | Not Supported | No documented inline text styling within headers |
| Code display | ❌ | Not Supported | No code/monospace styling for headers |
| Links in headers | ⚠️ | Partial | Can compose with standard `<a>` elements but no specific header+link pattern documented |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Display text | ✅ | Native | Page headers (H1-H5) and Content headers (Huge-Tiny) serve as display text |
| Body text | ❌ | Not Supported | Headers are not designed for body text |
| Caption text | ✅ | Native | Sub-headers provide caption/description functionality |
| Label text | ⚠️ | Partial | Sub-headers can function as labels but no dedicated label pattern |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `class="ui disabled header"` for inactive state |
| Muted/Secondary | ✅ | Native | Sub-headers provide muted/de-emphasized appearance |
| Error state | ❌ | Not Supported | No error state for headers |
| Success state | ❌ | Not Supported | No success state for headers |
| Warning state | ❌ | Not Supported | No warning state for headers |

## Variation Patterns

### Size
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Font size variations | ✅ | Native | Page headers (H1-H5), Content headers (Huge, Large, Medium, Small, Tiny) |
| Responsive sizing | ⚠️ | Partial | Page headers use rem (fixed), Content headers use em (relative to container) |

### Weight
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Font weight | ❌ | Not Supported | No explicit font weight modifiers documented |

### Color
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color variants | ✅ | Native | Red, Orange, Yellow, Olive, Green, Teal, Blue, Purple, Violet, Pink, Brown, Grey via `class="ui [color] header"` |
| Inverted colors | ✅ | Native | Light color variants for dark backgrounds, used within `ui inverted segment` |

### Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text alignment | ✅ | Native | Left aligned, Right aligned, Center aligned, Justified via `class="ui [alignment] aligned header"` |
| Floating alignment | ✅ | Native | Left floated, Right floated via `class="ui [direction] floated header"` |

### Truncation
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text truncation | ❌ | Not Supported | No ellipsis or truncation support documented |
| Line clamping | ❌ | Not Supported | No multi-line truncation support |

### Line Height
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Line height control | ❌ | Not Supported | No line height modifiers documented |

### Letter Spacing
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Letter spacing | ❌ | Not Supported | No letter spacing modifiers documented |

### Transforms
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text transform | ❌ | Not Supported | No uppercase/lowercase/capitalize modifiers documented |

### Interactive Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Copyable text | ❌ | Not Supported | No copy-to-clipboard functionality |
| Editable text | ❌ | Not Supported | No inline editing capability |
| Keyboard display | ❌ | Not Supported | No keyboard key styling |

## Formatting Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Dividing | ✅ | Native | `class="ui dividing header"` adds separator line below header |
| Block | ✅ | Native | `class="ui block header"` formats header as content block |
| Attached | ✅ | Native | Top/Bottom/Middle attached via `class="ui [position] attached header"` for connecting to segments |
| Floating | ✅ | Native | Left/Right floated positioning via `class="ui [direction] floated header"` |

## Content Integration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon support | ✅ | Native | Icons via `<i class="[icon-name] icon"></i>` within header, special `icon header` class for emphasis |
| Image support | ✅ | Native | Images via `<img>` element within header, supports circular images |
| Icon emphasis | ✅ | Native | `class="ui icon header"` for emphasized icon headers, `class="ui center aligned icon header"` for centered icon emphasis |

## Code Examples

### Basic Page Headers (H1-H5)
```html
<h1 class="ui header">First header</h1>
<h2 class="ui header">Second header</h2>
<h3 class="ui header">Third header</h3>
<h4 class="ui header">Fourth header</h4>
<h5 class="ui header">Fifth header</h5>
```

### Content Headers (Size Variations)
```html
<div class="ui huge header">Huge Header</div>
<div class="ui large header">Large Header</div>
<div class="ui medium header">Medium Header</div>
<div class="ui small header">Small Header</div>
<div class="ui tiny header">Tiny Header</div>
```

### Header with Sub-header
```html
<h2 class="ui header">
  Account Settings
  <div class="sub header">Manage your account settings and preferences.</div>
</h2>
```

### Icon Headers
```html
<!-- Simple icon header -->
<h2 class="ui header">
  <i class="plug icon"></i>
  <div class="content">Uptime Guarantee</div>
</h2>

<!-- Emphasized icon header -->
<h2 class="ui icon header">
  <i class="settings icon"></i>
  <div class="content">
    Account Settings
    <div class="sub header">Manage preferences</div>
  </div>
</h2>

<!-- Centered circular icon -->
<h2 class="ui center aligned icon header">
  <i class="circular users icon"></i>
  Friends
</h2>
```

### Image Headers
```html
<!-- Basic image header -->
<h2 class="ui header">
  <img src="/images/icons/school.png">
  <div class="content">Learn More</div>
</h2>

<!-- Circular image (avatar) -->
<h2 class="ui header">
  <img src="/images/avatar/large/chris.jpg" class="ui circular image">
  Chris
</h2>
```

### Disabled Header
```html
<div class="ui disabled header">Disabled Header</div>
```

### Dividing Header
```html
<h3 class="ui dividing header">Dividing Header</h3>
<p>Content below the dividing line...</p>
```

### Block Header
```html
<h3 class="ui block header">Block Header</h3>
<p>Content after the block header...</p>
```

### Attached Headers
```html
<h3 class="ui top attached header">Top Attached</h3>
<div class="ui attached segment">
  <p>Segment content...</p>
</div>
<h3 class="ui attached header">Middle Attached</h3>
<div class="ui attached segment">
  <p>More content...</p>
</div>
<h3 class="ui bottom attached header">Bottom Attached</h3>
```

### Floating Headers
```html
<div class="ui clearing segment">
  <h3 class="ui right floated header">Go Forward</h3>
  <h3 class="ui left floated header">Go Back</h3>
</div>
```

### Text Alignment
```html
<h3 class="ui right aligned header">Right Aligned</h3>
<h3 class="ui left aligned header">Left Aligned</h3>
<h3 class="ui center aligned header">Center Aligned</h3>
<h3 class="ui justified header">Justified Full Width Text</h3>
```

### Colored Headers
```html
<h4 class="ui red header">Red</h4>
<h4 class="ui orange header">Orange</h4>
<h4 class="ui yellow header">Yellow</h4>
<h4 class="ui olive header">Olive</h4>
<h4 class="ui green header">Green</h4>
<h4 class="ui teal header">Teal</h4>
<h4 class="ui blue header">Blue</h4>
<h4 class="ui violet header">Violet</h4>
<h4 class="ui purple header">Purple</h4>
<h4 class="ui pink header">Pink</h4>
<h4 class="ui brown header">Brown</h4>
<h4 class="ui grey header">Grey</h4>
```

### Inverted Colors (Dark Background)
```html
<div class="ui inverted segment">
  <h4 class="ui red header">Red</h4>
  <h4 class="ui orange header">Orange</h4>
  <h4 class="ui yellow header">Yellow</h4>
  <h4 class="ui olive header">Olive</h4>
  <h4 class="ui green header">Green</h4>
  <h4 class="ui teal header">Teal</h4>
  <h4 class="ui blue header">Blue</h4>
  <h4 class="ui violet header">Violet</h4>
  <h4 class="ui purple header">Purple</h4>
  <h4 class="ui pink header">Pink</h4>
  <h4 class="ui brown header">Brown</h4>
  <h4 class="ui grey header">Grey</h4>
</div>
```

### Complex Header Composition
```html
<h2 class="ui header">
  <i class="users icon"></i>
  <div class="content">
    Friend List
    <div class="sub header">Only Private ones.</div>
  </div>
</h2>
```

## Notable Features

### Dual Header System (Page vs Content)
Semantic UI provides two distinct header systems: **Page Headers** use rem units making them context-independent and suitable for establishing page hierarchy, while **Content Headers** use em units making them relative to their container, ideal for component-level headings. This dual approach provides flexibility for different use cases.

### Rich Icon Integration
Headers have first-class support for icons with multiple presentation styles: inline icons, emphasized icon headers with the `ui icon header` class, and circular icons for special emphasis. The `center aligned icon header` pattern creates a distinct presentation style particularly suited for empty states or call-to-action sections.

### Attached Header Pattern
The attached header system (top/middle/bottom) allows headers to be visually connected to segments, creating a cohesive block-like presentation. This is particularly useful for card-like layouts, settings panels, and sectioned content.

### Sub-header for Descriptions
The `<div class="sub header">` pattern provides a native way to include descriptions or secondary information directly within the header structure, creating a clear visual hierarchy without additional components.

### Comprehensive Color System
Semantic UI provides 12 color variants (Red, Orange, Yellow, Olive, Green, Teal, Blue, Violet, Purple, Pink, Brown, Grey) with both standard and inverted versions, offering extensive theming options through simple class modifiers.

### Floating vs Aligned
Semantic UI distinguishes between **floating** (which affects layout flow, useful for navigation-style headers) and **aligned** (which only affects text alignment within the header). This distinction provides fine-grained control over header positioning.

### Block and Dividing Modifiers
The **dividing** class adds a subtle separator line below headers, useful for visual separation without explicit divider elements. The **block** class gives headers a background and padding, making them stand out as distinct sections.

### Semantic HTML Foundation
Headers maintain semantic HTML by using actual h1-h6 elements for page headers, ensuring proper document structure and accessibility. Content headers use divs but remain semantically meaningful through ARIA and class names.

### Image Support with Circular Variant
Headers support both standard and circular images, with the circular variant particularly useful for avatar-based headers in user profiles or social interfaces.

## Research Notes

### Framework Context
- This is the **original jQuery-based Semantic UI**, not Semantic UI React or other ports
- Version 2.4+ (documentation references "New in 2.4" features)
- CDN link in examples: `https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css`
- Requires both CSS and JS files for full functionality
- MIT licensed, open-source framework

### Architecture Approach
- Purely class-based styling system (no JavaScript configuration shown for headers)
- Relies on BEM-like naming conventions with `ui` prefix
- Multiple class modifiers can be combined (e.g., `ui large blue dividing header`)
- No component/props API - all configuration via HTML classes

### Comparison to Modern Frameworks
- **No interactive features**: Unlike Ant Design's Typography with copyable/editable, Semantic UI headers are purely presentational
- **No truncation system**: Missing ellipsis/line-clamping features found in modern frameworks
- **Class-based vs Props**: Uses HTML classes instead of React props or web component attributes
- **Strong layout integration**: Attached/floating patterns show tight integration with Semantic UI's layout system
- **More prescriptive**: Fewer customization points compared to utility-first approaches

### Missing Features
- No text truncation or ellipsis support
- No line height, letter spacing, or text transform modifiers
- No copyable or editable functionality
- No keyboard key styling
- Limited inline text styling within headers
- No explicit responsive typography system
- No documented polymorphic rendering (as/component prop)

### Strengths
- Clear semantic HTML usage
- Comprehensive color system with inverted variants
- Thoughtful layout integration (attached, floating, dividing)
- Icon and image integration feels natural
- Sub-header pattern is elegant and reusable
- Dual sizing system (rem vs em) shows architectural consideration

### Design Philosophy
- **Semantic naming**: Class names describe meaning, not just appearance
- **Composition over configuration**: Build complex headers by combining classes
- **Layout-aware**: Headers understand their relationship to surrounding content (attached, floating)
- **Visual hierarchy**: Multiple tools for establishing hierarchy (size, color, dividing, block)

### Usage Patterns Observed
- Headers commonly used with icons for emphasis and visual interest
- Sub-headers provide context without cluttering the main header
- Attached headers create card-like sectioning
- Inverted colors require explicit inverted segment wrapper
- Color modifiers work on any header size
- Floating headers need clearing context (clearing segment)

### Integration Notes
- Tight integration with Semantic UI's segment, container, and layout components
- Icon system requires separate icon font/library
- Images should be sized appropriately or use Semantic UI's image classes
- Color modifiers integrate with broader Semantic UI color system

### Documentation Gaps
- Limited JavaScript API documentation (if any exists for headers)
- Code examples not always shown inline with visual examples
- No explicit accessibility documentation beyond semantic HTML
- Responsive behavior not thoroughly documented
- Browser compatibility not mentioned

### Modernization Opportunities
If adapting this pattern to a modern framework:
- Add truncation/ellipsis with expandable support
- Include copyable/editable interactions
- Provide prop-based API alongside class-based
- Add responsive typography utilities
- Support for text transforms and spacing
- Better TypeScript definitions
- Design token system over hardcoded classes

### Best Practices Observed
1. Use page headers (h1-h6) for document structure
2. Use content headers (huge-tiny) for component-level headings
3. Sub-headers for descriptions, not separate elements
4. Icons add visual interest and aid scanning
5. Dividing headers reduce need for explicit dividers
6. Attached headers create cohesive sections
7. Inverted colors for contrast on dark backgrounds
8. Floating headers for navigation-style layouts
9. Combine modifiers for rich presentations
10. Maintain semantic HTML for accessibility

### Related Components
While this research focuses on Headers, Semantic UI likely has related typography components:
- **Text/Paragraph**: For body text (not covered in header docs)
- **List**: For structured content
- **Label**: For inline badges and tags
- **Message**: For callouts and notices
- **Icon**: Core icon system used throughout

### Research Quality Note
The official documentation provides good visual examples but lacks comprehensive inline code samples. Third-party sources (GeeksforGeeks, GitHub) were necessary to extract complete HTML patterns. The framework's maturity (v2.4+) and stability make these patterns reliable, though the jQuery dependency makes this less relevant for modern React/Vue/web component development.
