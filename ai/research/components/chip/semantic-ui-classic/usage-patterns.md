# Semantic UI Classic - Label Usage Patterns

## Component URL
https://semantic-ui.com/elements/label.html
Status: ✅ Working
Version: Semantic UI 2.x
Last Verified: 2025-11-04

## Documentation Quality
**Comprehensive** - Extensive documentation with multiple types, variations, and examples

## Component Definition
- **Core purpose**: Display content classification through labels, tags, and badges for categorization, status indication, and notification counts
- **Mental model**: A unified labeling system that combines badge (notification/count), tag (categorization), and label (general classification) concepts into a single component
- **Semantic meaning**: Provides visual markers for categorization, status, relationships, and metadata within the interface

## Unique Characteristic
Semantic UI Classic's Label is distinctive because it **unifies Badge, Tag, and Label concepts** into a single component. Where other frameworks separate badges (notification counters) from tags (categorization chips) from labels (general text markers), Semantic UI treats all of these as variations of content classification.

## Pattern Support Levels
- **Native**: Dedicated class-based API (e.g., `class="ui label"`, `class="ui red label"`)
- **Composed**: Via HTML structure and nesting (e.g., images, icons, detail text)
- **CSS-only**: Additional customization through standard CSS

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Base label displays text: `<div class="ui label">Text</div>` |
| Icon support | ✅ | Composed | Icons added via nested `<i>` elements: `<i class="mail icon"></i>` |
| Image support | ✅ | Native | Image labels with avatars: `class="ui image label"` with `<img>` |
| Detail text | ✅ | Composed | Secondary detail via nested `<div class="detail">`: displays counts/metadata |
| Link labels | ✅ | Native | Labels as links: `<a class="ui label">` or nested link content |
| Removable/close | ✅ | Composed | Delete icon: `<i class="delete icon"></i>` within label |
| Custom content | ✅ | Composed | Any HTML content can be nested within labels |

## Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic label | ✅ | Native | Default: `<div class="ui label">` |
| Image label | ✅ | Native | Avatar + text: `class="ui image label"` |
| Pointing label | ✅ | Native | Directional arrows: `pointing`, `left pointing`, `right pointing`, `pointing below` |
| Corner label | ✅ | Native | Corner-positioned: `class="ui corner label"` (left/right corners) |
| Tag label | ✅ | Native | Tag style: `class="ui tag label"` |
| Ribbon label | ✅ | Native | Ribbon attachment: `class="ui ribbon label"`, `class="ui right ribbon label"` |
| Attached label | ✅ | Native | Edge-attached: `top attached`, `bottom attached`, `top left attached`, `top right attached`, etc. |
| Horizontal label | ✅ | Native | Horizontal formatting: `class="ui horizontal label"` |
| Floating label | ✅ | Native | Floating badge: `class="ui floating label"` (requires `position: relative` container) |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active/selected | ✅ | CSS-only | Visual differentiation through color/style |
| Removable | ✅ | Composed | Delete icon for removal interaction |
| Disabled | ❌ | Not documented | No native disabled state |
| Loading | ❌ | Not documented | No native loading state |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | 8 sizes: `mini`, `tiny`, `small`, `medium` (default), `large`, `big`, `huge`, `massive` |
| Color options | ✅ | Native | 13 colors: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, `black` |
| Visual styles | ✅ | Native | `basic` modifier (v2.1+) - reduced complexity/simpler appearance |
| Circular style | ✅ | Native | `class="ui circular label"` - badge-style circles for counts |
| Semantic colors | ✅ | Implicit | Color names have semantic associations (red=error, green=success, etc.) |

## Group Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Label groups | ✅ | Native | `<div class="ui labels">` - shares size properties |
| Colored groups | ✅ | Native | Groups with shared color: `class="ui blue labels"` |
| Tag groups | ✅ | Native | Tag formatting across group: `class="ui tag labels"` |
| Circular groups | ✅ | Native | Circular badges together: `class="ui circular labels"` |

## Code Examples

### Basic Label
```html
<!-- Simple text label -->
<div class="ui label">
  Default Label
</div>

<!-- With count/number -->
<div class="ui label">
  23
</div>
```

### Image Label
```html
<!-- Label with avatar -->
<a class="ui image label">
  <img src="avatar.jpg">
  Joe
</a>

<!-- With detail text -->
<a class="ui image label">
  <img src="avatar.jpg">
  Elliot
  <div class="detail">Friend</div>
</a>
```

### Pointing Labels
```html
<!-- Points right (default) -->
<div class="ui pointing label">
  Please enter a value
</div>

<!-- Points left -->
<div class="ui left pointing label">
  That name is taken
</div>

<!-- Points below -->
<div class="ui pointing below label">
  Your password must be 6 characters or more
</div>

<!-- Basic pointing (reduced style) -->
<div class="ui basic pointing label">
  Basic pointing label
</div>
```

### Corner Label
```html
<!-- Container with corner label (requires position: relative) -->
<div class="ui segment" style="position: relative;">
  <div class="ui corner label">
    <i class="heart icon"></i>
  </div>
  Content here
</div>

<!-- Right corner -->
<div class="ui segment" style="position: relative;">
  <div class="ui right corner label">
    <i class="star icon"></i>
  </div>
  Content here
</div>
```

### Tag Label
```html
<!-- Simple tag -->
<div class="ui tag label">
  New
</div>

<!-- Colored tags -->
<div class="ui red tag label">Featured</div>
<div class="ui teal tag label">Upcoming</div>
```

### Ribbon Label
```html
<!-- Left ribbon (inside segment or card) -->
<div class="ui segment">
  <div class="ui ribbon label">Overview</div>
  <p>Content with ribbon label...</p>
</div>

<!-- Right ribbon -->
<div class="ui segment">
  <div class="ui right ribbon label">Specs</div>
  <p>Technical specifications...</p>
</div>

<!-- Colored ribbon -->
<div class="ui segment">
  <div class="ui red ribbon label">Hotel</div>
  <p>Hotel information...</p>
</div>
```

### Attached Label
```html
<!-- Top attached -->
<div class="ui top attached label">HTML</div>
<div class="ui attached segment">
  Code content here
</div>

<!-- Bottom attached -->
<div class="ui segment">
  Content here
</div>
<div class="ui bottom attached label">View</div>

<!-- Corner attached -->
<div class="ui segment">
  <div class="ui top right attached label">Code</div>
  Content with corner label
</div>
```

### Horizontal Label
```html
<!-- Labels content alongside it -->
<div class="ui divided selection list">
  <a class="item">
    <div class="ui horizontal label">Fruit</div>
    Kumquats
  </a>
  <a class="item">
    <div class="ui horizontal label">Candy</div>
    Ice Cream
  </a>
  <a class="item">
    <div class="ui horizontal label">Dog</div>
    Poodle
  </a>
</div>
```

### Floating Label
```html
<!-- Floating badge (requires position: relative on container) -->
<a style="position: relative;">
  <i class="mail icon"></i>
  <div class="ui floating label">22</div>
</a>

<a style="position: relative;">
  <i class="users icon"></i>
  <div class="ui red floating label">22</div>
</a>
```

### Label with Detail
```html
<!-- Detail provides secondary information -->
<div class="ui label">
  Dogs
  <div class="detail">214</div>
</div>

<div class="ui label">
  <i class="mail icon"></i>
  Messages
  <div class="detail">1048</div>
</div>
```

### Label with Icon
```html
<!-- Icon + text -->
<div class="ui label">
  <i class="mail icon"></i>
  Mail
</div>

<!-- Icon only -->
<div class="ui label">
  <i class="check icon"></i>
</div>

<!-- Icon with detail -->
<div class="ui label">
  <i class="tag icon"></i>
  Fun
  <div class="detail">22</div>
</div>
```

### Removable Label
```html
<!-- With delete icon -->
<div class="ui label">
  Snickerdoodle
  <i class="delete icon"></i>
</div>

<!-- Image label with removal -->
<a class="ui image label">
  <img src="avatar.jpg">
  Joe
  <i class="delete icon"></i>
</a>
```

### Link Label
```html
<!-- Entire label is link -->
<a class="ui label" href="#">
  Link Label
</a>

<!-- Label with linked detail -->
<div class="ui label">
  <a href="#">23</a>
  View Mail
</div>
```

### Circular Labels (Badges)
```html
<!-- Circular count badges -->
<div class="ui circular label">2</div>
<div class="ui circular label">22</div>
<div class="ui circular label">141</div>

<!-- Colored circular -->
<div class="ui red circular label">2</div>
<div class="ui teal circular label">10</div>
```

### Color Variations
```html
<!-- 13 color options -->
<div class="ui red label">Red</div>
<div class="ui orange label">Orange</div>
<div class="ui yellow label">Yellow</div>
<div class="ui olive label">Olive</div>
<div class="ui green label">Green</div>
<div class="ui teal label">Teal</div>
<div class="ui blue label">Blue</div>
<div class="ui violet label">Violet</div>
<div class="ui purple label">Purple</div>
<div class="ui pink label">Pink</div>
<div class="ui brown label">Brown</div>
<div class="ui grey label">Grey</div>
<div class="ui black label">Black</div>
```

### Size Variations
```html
<!-- 8 size options -->
<div class="ui mini label">Mini</div>
<div class="ui tiny label">Tiny</div>
<div class="ui small label">Small</div>
<div class="ui label">Medium (default)</div>
<div class="ui large label">Large</div>
<div class="ui big label">Big</div>
<div class="ui huge label">Huge</div>
<div class="ui massive label">Massive</div>
```

### Basic Style
```html
<!-- Reduced complexity (v2.1+) -->
<div class="ui basic label">Basic</div>
<div class="ui basic red label">Basic Red</div>
<div class="ui basic blue label">Basic Blue</div>

<!-- Basic pointing -->
<div class="ui basic pointing label">Basic Pointing</div>
```

### Label Groups
```html
<!-- Share size properties -->
<div class="ui labels">
  <div class="ui label">Fun</div>
  <div class="ui label">Happy</div>
  <div class="ui label">Smart</div>
  <div class="ui label">Witty</div>
</div>

<!-- Colored group -->
<div class="ui blue labels">
  <div class="ui label">Fun</div>
  <div class="ui label">Happy</div>
</div>

<!-- Tag group -->
<div class="ui tag labels">
  <div class="ui label">$10.00</div>
  <div class="ui label">$19.99</div>
  <div class="ui label">$24.99</div>
  <div class="ui label">$30.99</div>
</div>

<!-- Circular group -->
<div class="ui circular labels">
  <div class="ui label">11</div>
  <div class="ui label">22</div>
  <div class="ui label">33</div>
  <div class="ui label">141</div>
</div>

<!-- Sized group -->
<div class="ui tiny labels">
  <div class="ui label">Small</div>
  <div class="ui label">Labels</div>
</div>
```

## Notable Features

1. **Unified Badge/Tag/Label Concept**: Unlike other frameworks that separate badges from tags from labels, Semantic UI treats all content classification as variations of a single Label component

2. **Directional Pointing**: Extensive support for pointing labels in all directions (left, right, above, below) for form validation and contextual messaging

3. **Spatial Positioning**: Rich positioning system including:
   - Corner labels (anchored to container corners)
   - Ribbon labels (attached to edges with ribbon effect)
   - Attached labels (fixed to segment edges)
   - Floating labels (overlaid badge-style)

4. **Class-Based API**: Pure CSS class composition pattern - no JavaScript required for visual variations

5. **Group Coordination**: Label groups automatically share properties (size, color, style) applied to the container

6. **Semantic Color System**: 13 colors with implicit semantic meaning (red = error/important, green = success, blue = info, etc.)

7. **Detail Pattern**: Dedicated detail element for secondary information (counts, metadata) - creates consistent visual hierarchy

8. **Technical Requirements**:
   - Corner labels require `position: relative` on container
   - Floating labels require `position: relative` on container
   - Rounded containers with corner labels need `overflow: hidden`
   - Attached labels may need manual padding adjustments

## Research Notes

- **Version evolution**: Basic style introduced in v2.1, showing continued component development
- **Positioning complexity**: Multiple positioning types (corner, ribbon, attached, floating, pointing) show sophisticated spatial relationship handling
- **Container dependencies**: Several label types require specific container styling (position: relative, overflow: hidden)
- **Class composition**: Modifiers combine naturally: `class="ui red circular label"`, `class="ui basic pointing label"`
- **No JavaScript dependency**: All variations achieved through CSS classes alone
- **Accessibility**: Relies on class-based styling; screen reader support would need aria-label or text content

## How Label Combines Badge + Tag Concepts

### Badge Patterns in Label
- **Circular labels**: `class="ui circular label"` creates notification-style count badges
- **Floating labels**: `class="ui floating label"` creates overlaid notification badges
- **Corner labels**: `class="ui corner label"` creates anchored status indicators

### Tag Patterns in Label
- **Tag labels**: `class="ui tag label"` creates categorization tags
- **Tag groups**: `class="ui tag labels"` creates multiple category tags
- **Removable**: Delete icon support for dismissible tags

### General Label Patterns
- **Horizontal labels**: Metadata and key-value labeling
- **Image labels**: User/entity labeling with avatars
- **Pointing labels**: Validation and contextual messaging
- **Ribbon labels**: Section headers and prominent categorization

### API Implications
By unifying these concepts, Semantic UI:
- Reduces component count (1 component vs 2-3 in other frameworks)
- Enables pattern mixing (e.g., "red circular tag label")
- Creates consistent API across use cases
- Shares variations (colors, sizes) across all pattern types
