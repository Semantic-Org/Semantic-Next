# Semantic UI Classic - Card Usage Patterns

## Component URL
https://semantic-ui.com/views/card.html
Status: ✅ Working
Version: Semantic UI 2.x (Classic)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Detailed examples with live demos showing all variations and patterns

## Component Definition
- **Core purpose**: Display site content in a manner similar to a playing card - a flexible container for grouping related information with visual hierarchy
- **Mental model**: A physical card metaphor that contains structured content blocks (image, header, metadata, description, actions) with automatic equal-height matching in groups
- **Semantic meaning**: Represents a discrete unit of related content, typically used for collections of similar items (products, users, articles, etc.)
- **Classification**: "View" component (structured content presentation) as opposed to "Element" like Segment (generic container)

## Pattern Support Levels
- **Native**: Dedicated CSS class (e.g., `class="ui fluid card"`)
- **Composed**: Via HTML structure/nesting (e.g., nested content blocks)
- **Manual**: Requires custom HTML/CSS beyond base classes

## Container Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single Card | ✅ | Native | `<div class="ui card">` - Individual card container |
| Card Group | ✅ | Native | `<div class="ui cards">` - Multiple cards with flex-based equal height matching |
| Fluid Card | ✅ | Native | `class="ui fluid card"` - Card takes full width of container |
| Raised Card | ✅ | Native | `class="ui raised card"` - Elevated appearance with stronger shadow |
| Link Card | ✅ | Native | `class="ui link card"` - Entire card is clickable with hover effects |
| Centered Card | ✅ | Native | `class="ui centered card"` - Centers a single card in container |

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image | ✅ | Native | `<div class="image">` - Card image at top, supports reveal/dimmer effects |
| Header | ✅ | Native | `<div class="header">` - Card title/name within content block |
| Meta | ✅ | Native | `<div class="meta">` - Metadata with automatic spacing (dates, categories, tags) |
| Description | ✅ | Native | `<div class="description">` - Main descriptive text, supports paragraphs |
| Extra Content | ✅ | Native | `<div class="extra content">` - Separately formatted footer/supplementary info |
| Content Block | ✅ | Native | `<div class="content">` - Generic content container, can have multiple per card |
| Links | ✅ | Composed | Links can be images, headers, or inline content |
| Buttons | ✅ | Composed | Action buttons integrated into content or extra sections |
| Icons | ✅ | Composed | Icons used throughout (social icons, approval icons, etc.) |
| Avatar Images | ✅ | Composed | Small circular images within content using `ui avatar image` |
| Floated Content | ✅ | Native | `class="right floated"` / `class="left floated"` within content |

## Layout Patterns (Card Groups)

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Stackable | ✅ | Native | `class="ui stackable cards"` - Single column on mobile devices |
| Doubling | ✅ | Native | `class="ui doubling cards"` - Doubles cards per row on tablet/mobile |
| Column Count | ✅ | Native | Specific counts: `two cards`, `three cards`, `four cards`, `five cards`, `six cards`, `seven cards`, `eight cards` |
| Equal Height | ✅ | Automatic | Card groups automatically match heights using flexbox |
| Responsive Grid | ✅ | Automatic | Cards reflow automatically, enhanced by stackable/doubling |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color Options | ✅ | Native | Full color palette: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, `black` |
| Sizes | ❌ | Not Available | No size variations in Classic (unlike Button, Segment which have sizes) |
| Text Alignment | ✅ | Native | Standard alignment classes: `left aligned`, `center aligned`, `right aligned` |
| Horizontal Card | ❌ | Not Standard | Not a built-in pattern, would require custom layout |

## Interactive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Approval Actions | ✅ | Composed | Like/favorite buttons with icons, requires custom JavaScript |
| Action Buttons | ✅ | Composed | `<div class="ui button">` within extra content |
| Clickable Card | ✅ | Native | `class="ui link card"` - entire card is interactive |
| Hover Effects | ✅ | Native | Link cards and images have hover states |
| Reveal on Hover | ✅ | Composed | Using `ui reveal` module with card images |
| Dimmer on Hover | ✅ | Composed | Using `ui dimmer` module with card images |

## Special Features

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image Reveals | ✅ | Composed | Card images can use reveal module for hover effects |
| Dimmers | ✅ | Composed | Card images can use dimmer module for overlays |
| Friend Count | ✅ | Composed | Common pattern showing relationships (e.g., "22 Friends") |
| Date/Time Display | ✅ | Composed | Meta blocks commonly show dates |
| Category Tags | ✅ | Composed | Meta can include category labels |
| Social Integration | ✅ | Composed | Social icon groups in extra content |
| Star Ratings | ✅ | Composed | Using `ui star rating` component in meta |

## Code Examples

### Basic Card Structure
```html
<div class="ui card">
  <div class="image">
    <img src="/images/avatar/large/kristy.png">
  </div>
  <div class="content">
    <div class="header">Kristy</div>
    <div class="meta">
      <span class="date">Joined in 2013</span>
    </div>
    <div class="description">
      Kristy is an art director living in New York.
    </div>
  </div>
  <div class="extra content">
    <a>
      <i class="user icon"></i>
      22 Friends
    </a>
  </div>
</div>
```

### Card Group with Multiple Cards
```html
<div class="ui cards">
  <div class="card">
    <div class="content">
      <img class="right floated mini ui image" src="/images/avatar/small/elliot.jpg">
      <div class="header">Elliot Fu</div>
      <div class="meta">Friend</div>
      <div class="description">
        Elliot requested permission to view your contact details
      </div>
    </div>
    <div class="extra content">
      <div class="ui two buttons">
        <div class="ui basic green button">Approve</div>
        <div class="ui basic red button">Decline</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="content">
      <img class="right floated mini ui image" src="/images/avatar/small/jenny.jpg">
      <div class="header">Jenny Hess</div>
      <div class="meta">Friend</div>
      <div class="description">
        Jenny wants to add you to the group <b>musicians</b>
      </div>
    </div>
    <div class="extra content">
      <div class="ui two buttons">
        <div class="ui basic green button">Approve</div>
        <div class="ui basic red button">Decline</div>
      </div>
    </div>
  </div>
</div>
```

### Fluid Card
```html
<div class="ui fluid card">
  <div class="image">
    <img src="/images/wireframe/image.png">
  </div>
  <div class="content">
    <a class="header">Full Width Card</a>
    <div class="meta">
      <span class="date">Created in Sep 2014</span>
    </div>
    <div class="description">
      This card will take up the full width of its container.
    </div>
  </div>
</div>
```

### Raised Card
```html
<div class="ui raised card">
  <div class="image">
    <img src="/images/avatar/large/chris.jpg">
  </div>
  <div class="content">
    <a class="header">Chris Rivers</a>
    <div class="meta">
      <span class="date">Designer</span>
    </div>
  </div>
</div>
```

### Link Card
```html
<div class="ui link card">
  <div class="image">
    <img src="/images/avatar/large/steve.jpg">
  </div>
  <div class="content">
    <div class="header">Steve Sanders</div>
    <div class="meta">
      <a>Friends</a>
    </div>
    <div class="description">
      Steve wants to add you to the group <b>best friends</b>
    </div>
  </div>
  <div class="extra content">
    <span class="right floated">
      Joined in 2009
    </span>
    <span>
      <i class="user icon"></i>
      75 Friends
    </span>
  </div>
</div>
```

### Centered Card
```html
<div class="ui centered card">
  <div class="image">
    <img src="/images/avatar/large/elyse.png">
  </div>
  <div class="content">
    <a class="header">Elyse</a>
    <div class="meta">
      <span class="date">Joined in 2014</span>
    </div>
  </div>
</div>
```

### Colored Cards
```html
<div class="ui cards">
  <div class="red card">
    <div class="content">
      <div class="header">Red Card</div>
      <div class="description">Red accent color</div>
    </div>
  </div>
  <div class="blue card">
    <div class="content">
      <div class="header">Blue Card</div>
      <div class="description">Blue accent color</div>
    </div>
  </div>
  <div class="green card">
    <div class="content">
      <div class="header">Green Card</div>
      <div class="description">Green accent color</div>
    </div>
  </div>
</div>
```

### Card Group with Column Count
```html
<!-- Three Cards Per Row -->
<div class="ui three cards">
  <div class="card">
    <div class="image">
      <img src="/images/avatar/large/matthew.png">
    </div>
    <div class="content">
      <a class="header">Matthew</a>
    </div>
  </div>
  <div class="card">
    <div class="image">
      <img src="/images/avatar/large/molly.png">
    </div>
    <div class="content">
      <a class="header">Molly</a>
    </div>
  </div>
  <div class="card">
    <div class="image">
      <img src="/images/avatar/large/elyse.png">
    </div>
    <div class="content">
      <a class="header">Elyse</a>
    </div>
  </div>
</div>
```

### Stackable Cards (Mobile Responsive)
```html
<div class="ui stackable four cards">
  <div class="card">
    <div class="content">
      <div class="header">Card 1</div>
    </div>
  </div>
  <div class="card">
    <div class="content">
      <div class="header">Card 2</div>
    </div>
  </div>
  <div class="card">
    <div class="content">
      <div class="header">Card 3</div>
    </div>
  </div>
  <div class="card">
    <div class="content">
      <div class="header">Card 4</div>
    </div>
  </div>
</div>
```

### Doubling Cards (Responsive Grid)
```html
<div class="ui doubling four cards">
  <!-- Four per row on desktop, doubles to 8 per row on smaller screens -->
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

### Card with Meta Information
```html
<div class="ui card">
  <div class="content">
    <div class="header">Cute Dog</div>
    <div class="meta">
      <span class="date">2 days ago</span>
      <span class="category">Animals</span>
    </div>
    <div class="description">
      <p>Here's a description of a cute dog.</p>
    </div>
  </div>
</div>
```

### Card with Social Features
```html
<div class="ui card">
  <div class="content">
    <div class="header">Team Updates</div>
    <div class="description">
      Check out our latest updates and news.
    </div>
  </div>
  <div class="extra content">
    <a>
      <i class="like icon"></i>
      Like
    </a>
    <a>
      <i class="star icon"></i>
      Favorite
    </a>
  </div>
</div>
```

### Card with Floated Content
```html
<div class="ui card">
  <div class="content">
    <img class="right floated mini ui image" src="/images/avatar/small/jenny.jpg">
    <div class="header">Jenny Hess</div>
    <div class="meta">New Member</div>
    <div class="description">
      Jenny is a student studying Media Management at the New School.
    </div>
  </div>
</div>
```

### Card with Multiple Content Blocks
```html
<div class="ui card">
  <div class="content">
    <div class="header">Recent Activity</div>
  </div>
  <div class="content">
    <div class="description">
      <p>First update posted 2 hours ago</p>
    </div>
  </div>
  <div class="content">
    <div class="description">
      <p>Second update posted 5 hours ago</p>
    </div>
  </div>
  <div class="extra content">
    <div class="ui two buttons">
      <div class="ui button">View All</div>
      <div class="ui button">Refresh</div>
    </div>
  </div>
</div>
```

## Notable Features

### Unique to Semantic UI Classic:
1. **View vs Element Philosophy**: Card is classified as a "View" (structured presentation) distinct from generic containers like Segment (Element)
2. **Automatic Equal Heights**: Card groups use flexbox to automatically match heights without JavaScript
3. **Flexible Content Blocks**: Multiple `<div class="content">` blocks can be used for vertical segmentation
4. **Integration with Other Modules**: Seamless integration with Reveal, Dimmer, Rating, and Icon modules
5. **Class-Based Styling**: Pure CSS approach using BEM-style naming conventions
6. **Semantic HTML**: Encourages meaningful HTML structure with dedicated classes for different content types

### Pattern Insights:
1. **Modular Content**: Each content type (image, header, meta, description, extra) has specific styling and spacing
2. **Composable Design**: Complex cards built by nesting semantic HTML elements
3. **Responsive by Default**: Card groups have built-in responsive behavior, enhanced by stackable/doubling
4. **No JavaScript Required**: All visual patterns are CSS-only (except interactive features like dimmers)
5. **Consistent Spacing**: Automatic spacing between content blocks and elements
6. **Floated Elements**: Support for mini floated images commonly used for avatars

## Card vs Segment Distinction

**When to use Card:**
- Collections of similar items (product listings, user profiles, article previews)
- Content that benefits from card metaphor (discrete, scannable units)
- Need for automatic equal heights in grid layouts
- Structured content with image + header + description pattern

**When to use Segment:**
- Generic content containers without specific structure
- Single-column content blocks
- Content that doesn't fit card metaphor
- Need for more flexible, less opinionated styling

## Styling Approach

**CSS Class-Based System:**
- All variations controlled via CSS classes
- No inline styles required for standard patterns
- BEM-like naming: `ui [variation] [type]`
- Modifier pattern: `ui fluid raised link card`
- Group pattern: `ui stackable doubling four cards`

**Shadow DOM Considerations for Semantic UI Next:**
- Classic uses global CSS - Next will need scoped styles
- Class-based API remains compatible with web components
- Equal height card groups may need flexbox in shadow DOM context
- Color variations will use CSS custom properties instead of compiled LESS

## Research Notes

- **Documentation Access**: Clean, well-organized documentation with live examples
- **Framework Maturity**: This is the established reference implementation (v2.x)
- **Pattern Completeness**: Very comprehensive - covers nearly every card use case
- **Code Quality**: Semantic HTML with clear class naming conventions
- **Responsive Design**: Mobile-first with explicit stackable/doubling controls
- **Accessibility**: Structure supports semantic HTML but lacks ARIA examples
- **Learning Curve**: Intuitive naming makes patterns discoverable
- **Flexibility vs Opinion**: More opinionated than Segment, less than specialized components

## Implementation Recommendations for Semantic UI Next

1. **Preserve Core Patterns**: All content patterns (image, header, meta, description, extra) should be supported
2. **Maintain Class API**: The class-based API is intuitive and should be preserved as settings
3. **Shadow DOM Adaptation**: Equal height card groups need careful implementation in shadow DOM
4. **Web Component Slots**: Consider using slots for content projection (image, header, description slots)
5. **Responsive Behavior**: Stackable/doubling patterns need JavaScript or CSS container queries
6. **Color System**: Migrate to CSS custom properties from LESS variables
7. **Modular Content**: Support multiple content blocks with automatic spacing
8. **Interactive States**: Link card and hover effects need clear state management

## Metadata
- Research Date: 2025-11-04
- Researcher: Claude (Semantic UI Next AI Assistant)
- Framework Version: Semantic UI Classic 2.x
- Documentation URL: https://semantic-ui.com/views/card.html
- Classification: View Component (Structured Content Presentation)
- Status: Reference Implementation - Complete Pattern Analysis
