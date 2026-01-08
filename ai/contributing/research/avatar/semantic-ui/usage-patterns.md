# Semantic UI - Avatar (Image Element)

## Component Overview

The Semantic UI Avatar is implemented as a variation of the Image element. Unlike standalone avatar components in other frameworks, Semantic UI treats avatars as a special formatting option for images that makes them appear inline with text, typically for user profile pictures and persona representations.

**Core purpose**: Display user profile pictures inline with text content, commonly used in comments, lists, feeds, and other user-attributed content.

**Architecture**: Avatar is a class modifier applied to the standard Image element (`<img class="ui avatar image">`). It works within Semantic UI's broader Image component system, sharing sizing, state, and variation options with other image types while adding specific inline formatting for avatar use cases.

**Common use cases**: Comment sections with user avatars, user lists with profile pictures, feed items with author images, chat interfaces, user cards, team member displays, social media-style layouts.

## Usage Patterns

### Basic Usage

The simplest avatar requires the `ui avatar image` class combination applied to an `<img>` tag:

```html
<!-- Basic avatar -->
<img class="ui avatar image" src="user-profile.jpg">

<!-- Avatar inline with text -->
<img class="ui avatar image" src="user-profile.jpg"> Username
```

The avatar class formats the image to appear inline with text, making it suitable for user profile displays.

### Variants/Styles

Semantic UI avatars inherit styling variations from the Image element:

**Circular** (most common for avatars):
- Creates perfectly round images
- Applied via `circular` class
- Example: `<img class="ui circular image" src="avatar.jpg">`

**Rounded**:
- Adds rounded corners to images
- Applied via `rounded` class
- Less common for avatars but available
- Example: `<img class="ui rounded image" src="avatar.jpg">`

**Bordered**:
- Adds border around image to emphasize edges
- Useful for white or transparent backgrounds
- Applied via `bordered` class
- Example: `<img class="ui bordered image" src="avatar.jpg">`

**Combined Variations**:
```html
<!-- Circular with border (common avatar pattern) -->
<img class="ui circular bordered image" src="avatar.jpg">

<!-- Rounded with border -->
<img class="ui rounded bordered image" src="avatar.jpg">
```

Note: The `avatar` class itself provides inline formatting but doesn't dictate shape. It's commonly combined with `circular` for the traditional avatar appearance.

### States

**Normal**:
- Default state for avatars
- No special state classes needed

**Disabled**:
- Shows avatar cannot be selected
- Applied via `disabled` class
- Example: `<img class="ui disabled avatar image" src="avatar.jpg">`

**Hidden**:
- Hides the avatar
- Applied via `hidden` class
- Example: `<img class="ui hidden avatar image" src="avatar.jpg">`

### Sizing Options

Avatars use the same size variations as standard images:

**Size Classes**:
- `mini` - 35px
- `tiny` - 80px
- `small` - 150px
- `medium` - 300px (default)
- `large` - 450px
- `big` - 600px
- `huge` - 800px
- `massive` - 960px

**Usage**:
```html
<!-- Tiny avatar -->
<img class="ui tiny avatar image" src="avatar.jpg">

<!-- Small avatar -->
<img class="ui small avatar image" src="avatar.jpg">

<!-- Combined with circular -->
<img class="ui tiny circular image" src="avatar.jpg">
```

**Avatar-specific sizing**: Avatar dimensions are also influenced by font-size of the containing element, allowing for responsive sizing based on context.

### Layout & Positioning

**Inline with Text**:
- Primary purpose of the `avatar` class
- Vertically aligns with adjacent text
- Example:
```html
<img class="ui avatar image" src="user.jpg"> John Doe
```

**Vertical Alignment**:
- Supports `top aligned`, `middle aligned`, `bottom aligned`
- Controls alignment relative to surrounding content
- Example: `<img class="ui middle aligned avatar image" src="avatar.jpg">`

**Floated**:
- Can float left or right of content
- Applied via `left floated` or `right floated`
- Example:
```html
<img class="ui left floated avatar image" src="avatar.jpg">
```

**Centered**:
- Centers avatar in content block
- Applied via `centered` class
- Example: `<img class="ui centered avatar image" src="avatar.jpg">`

**Spaced**:
- Adds additional spacing around avatar
- Useful for separation from nearby content
- Applied via `spaced` class
- Example: `<img class="ui spaced avatar image" src="avatar.jpg">`

### Content & Structure

**In Comments**:
The most common avatar usage in Semantic UI is within comment structures:

```html
<div class="ui comments">
    <div class="comment">
        <a class="avatar">
            <img src="user-avatar.jpg">
        </a>
        <div class="content">
            <a class="author">Username</a>
            <div class="metadata">
                <div class="date">2 days ago</div>
            </div>
            <div class="text">
                <p>Comment text here</p>
            </div>
            <div class="actions">
                <a class="reply">Reply</a>
            </div>
        </div>
    </div>
</div>
```

**In Lists**:
Avatars work seamlessly in list structures:

```html
<div class="ui list">
    <div class="item">
        <img class="ui avatar image" src="user.jpg">
        <div class="content">
            <div class="header">User Name</div>
            <div class="description">User description or status</div>
        </div>
    </div>
</div>
```

**In Feeds**:
Avatars appear in feed items for social media-style layouts:

```html
<div class="ui feed">
    <div class="event">
        <div class="label">
            <img src="user-avatar.jpg">
        </div>
        <div class="content">
            <div class="summary">
                <a>User Name</a> posted an update
            </div>
        </div>
    </div>
</div>
```

### Interactive Features

**Clickable Avatars**:
Wrap avatar in anchor tag for navigation:

```html
<a href="/profile/user123">
    <img class="ui avatar image" src="user.jpg">
</a>
```

**Image Links**:
Use the entire image as a link using `ui image` with link context:

```html
<a class="ui avatar image" href="/profile">
    <img src="user-avatar.jpg">
</a>
```

### Animation & Transitions

Semantic UI doesn't provide built-in animations specifically for avatars, but they can be enhanced with:

**Transition API**:
- Use Semantic UI's transition module for effects
- Common transitions: fade, scale, flip
- Applied via JavaScript or data attributes

**Hover Effects**:
Can be achieved through custom CSS combined with Semantic UI classes.

### Integration Patterns

**Comment System with Avatars**:
```html
<div class="ui comments">
    <h3 class="ui dividing header">Comments</h3>
    <div class="comment">
        <a class="avatar">
            <img src="https://semantic-ui.com/images/avatar/small/matt.jpg">
        </a>
        <div class="content">
            <a class="author">Matt</a>
            <div class="metadata">
                <div class="date">Today at 5:42PM</div>
            </div>
            <div class="text">
                How artistic!
            </div>
            <div class="actions">
                <a class="reply">Reply</a>
            </div>
        </div>
    </div>

    <form class="ui reply form">
        <div class="field">
            <textarea></textarea>
        </div>
        <div class="ui primary submit labeled icon button">
            <i class="icon edit"></i> Add Comment
        </div>
    </form>
</div>
```

**User List with Avatars**:
```html
<div class="ui list">
    <a class="item">
        <img class="ui avatar image" src="user1.jpg">
        <div class="content">
            <div class="header">Helen</div>
            <div class="description">Online</div>
        </div>
    </a>
    <a class="item">
        <img class="ui avatar image" src="user2.jpg">
        <div class="content">
            <div class="header">Christian</div>
            <div class="description">Away</div>
        </div>
    </a>
</div>
```

**Image Groups with Avatars**:
```html
<div class="ui tiny images">
    <img class="ui image" src="avatar1.jpg">
    <img class="ui image" src="avatar2.jpg">
    <img class="ui image" src="avatar3.jpg">
    <img class="ui image" src="avatar4.jpg">
</div>
```

### Accessibility Features

**ARIA Attributes**:
- Add `alt` attribute for screen reader description
- Use `role="img"` when necessary
- Example: `<img class="ui avatar image" src="user.jpg" alt="User profile picture">`

**Semantic HTML**:
- Use proper heading hierarchy for associated content
- Link avatars with `aria-labelledby` when needed
- Ensure sufficient color contrast for borders

**Keyboard Support**:
- When avatars are clickable, ensure keyboard accessibility
- Use proper focus indicators
- Support tab navigation

**Alternative Text**:
Always provide meaningful alt text:
```html
<img class="ui avatar image" src="john.jpg" alt="John Doe profile picture">
```

## Key Properties/Props

### Image Element Classes (Applicable to Avatars)

| Class | Type | Description |
|-------|------|-------------|
| `ui` | Required | Base Semantic UI class |
| `image` | Required | Designates element as an image component |
| `avatar` | Modifier | Formats image to appear inline with text as avatar |
| `circular` | Modifier | Makes image perfectly round (common with avatars) |
| `rounded` | Modifier | Adds rounded corners to image |
| `bordered` | Modifier | Adds border around image |
| `mini` | Size | 35px size |
| `tiny` | Size | 80px size |
| `small` | Size | 150px size |
| `medium` | Size | 300px size (default) |
| `large` | Size | 450px size |
| `big` | Size | 600px size |
| `huge` | Size | 800px size |
| `massive` | Size | 960px size |
| `centered` | Alignment | Centers image in container |
| `top aligned` | Alignment | Aligns to top of content |
| `middle aligned` | Alignment | Vertically centers with content |
| `bottom aligned` | Alignment | Aligns to bottom of content |
| `left floated` | Float | Floats image to the left |
| `right floated` | Float | Floats image to the right |
| `spaced` | Layout | Adds spacing around image |
| `fluid` | Layout | Makes image take full width of container |
| `hidden` | State | Hides the image |
| `disabled` | State | Shows image as disabled |

### HTML Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | string | Required | Path to image file |
| `alt` | string | "" | Alternative text for accessibility |
| `width` | number | auto | Image width (optional) |
| `height` | number | auto | Image height (optional) |
| `loading` | "lazy" \| "eager" | "eager" | Image loading strategy |

### Comment Avatar Structure

When used in comments, avatars follow this structure:

```html
<a class="avatar">
    <img src="path/to/image.jpg" alt="User name">
</a>
```

## Code Examples

### Example 1: Basic Avatar
```html
<img class="ui avatar image" src="user-profile.jpg" alt="User profile">
```

### Example 2: Avatar Inline with Text
```html
<img class="ui avatar image" src="joe.jpg" alt="Joe"> Joe Henderson
```

### Example 3: Tiny Circular Avatar
```html
<img class="ui tiny circular image" src="jenny.jpg" alt="Jenny">
```

### Example 4: Bordered Avatar
```html
<img class="ui circular bordered image" src="steve.jpg" alt="Steve">
```

### Example 5: Avatar in Comment
```html
<div class="ui comments">
    <div class="comment">
        <a class="avatar">
            <img src="elliot.jpg" alt="Elliot">
        </a>
        <div class="content">
            <a class="author">Elliot Fu</a>
            <div class="metadata">
                <div class="date">1 day ago</div>
            </div>
            <div class="text">
                <p>This is a great example!</p>
            </div>
            <div class="actions">
                <a class="reply">Reply</a>
            </div>
        </div>
    </div>
</div>
```

### Example 6: Avatar in List
```html
<div class="ui list">
    <div class="item">
        <img class="ui avatar image" src="daniel.jpg" alt="Daniel">
        <div class="content">
            <div class="header">Daniel Louise</div>
            <div class="description">Online</div>
        </div>
    </div>
    <div class="item">
        <img class="ui avatar image" src="stevie.jpg" alt="Stevie">
        <div class="content">
            <div class="header">Stevie Feliciano</div>
            <div class="description">Busy</div>
        </div>
    </div>
</div>
```

### Example 7: Multiple Avatar Sizes
```html
<div>
    <img class="ui mini circular image" src="user1.jpg" alt="Mini avatar">
    <img class="ui tiny circular image" src="user2.jpg" alt="Tiny avatar">
    <img class="ui small circular image" src="user3.jpg" alt="Small avatar">
    <img class="ui circular image" src="user4.jpg" alt="Medium avatar">
</div>
```

### Example 8: Avatar Group
```html
<div class="ui tiny images">
    <img class="ui image" src="avatar1.jpg" alt="Team member 1">
    <img class="ui image" src="avatar2.jpg" alt="Team member 2">
    <img class="ui image" src="avatar3.jpg" alt="Team member 3">
    <img class="ui image" src="avatar4.jpg" alt="Team member 4">
</div>
```

### Example 9: Clickable Avatar
```html
<a href="/profile/user123">
    <img class="ui avatar image" src="user123.jpg" alt="View user profile">
</a>
```

### Example 10: Spaced Avatar with Float
```html
<img class="ui left floated spaced small circular image" src="avatar.jpg" alt="Author">
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
```

## Accessibility Notes

**Alternative Text**:
- Always provide descriptive `alt` attributes
- Use user's name or role in alt text
- Example: `alt="John Doe profile picture"` or `alt="Administrator avatar"`

**Screen Reader Support**:
- Alt text is announced by screen readers
- Linked avatars should describe the link destination
- Use empty alt (`alt=""`) for purely decorative avatars

**Keyboard Considerations**:
- Clickable avatars must be keyboard accessible
- Ensure proper focus indicators on linked avatars
- Use semantic HTML (anchor tags) for navigation

**Color Accessibility**:
- Don't rely on border color alone to convey information
- Ensure sufficient contrast for bordered avatars
- Test with various color blindness simulations

**Semantic HTML**:
- Use `<img>` tags (not background images) for avatars
- Wrap in `<a>` tags for clickable avatars
- Maintain proper heading hierarchy in associated content

## Common Patterns

1. **Comment Section Avatars**: User profile pictures in comment threads with author names and timestamps
2. **User List Display**: Lists of users with avatars, names, and status indicators
3. **Feed Items**: Social media-style feeds with user avatars next to actions or posts
4. **Team Member Grids**: Groups of circular avatars representing team members
5. **Inline Mentions**: Small avatars inline with text for user mentions
6. **Chat Interfaces**: Avatars next to chat messages in conversation views
7. **Author Attribution**: Article or blog post authors with avatar and bio
8. **Navigation Menus**: User avatar in header navigation for account dropdown

## Related Components

- **Image** - Parent component providing core functionality
- **Comment** - Component structure commonly containing avatars
- **List** - Container component often used with avatars
- **Feed** - Social feed component using avatars for attribution
- **Card** - Container component that may include user avatars
- **Label** - Can include small avatars or images
- **Icon** - Alternative to images for generic user representations

## Implementation Notes

**Avatar as Image Variation**:
Unlike other frameworks that treat Avatar as a separate component, Semantic UI implements it as a variation of the Image element. This means:
- Avatars share all image properties and states
- No separate Avatar component to import
- Consistent API with other image types
- Relies on class composition for functionality

**Common Class Combinations**:
- `ui avatar image` - Basic inline avatar
- `ui circular image` - Round image (avatar-style)
- `ui tiny avatar image` - Small inline avatar
- `ui circular bordered image` - Round avatar with border
- `ui small circular image` - Common avatar size/shape combo

**Best Practices**:
- Use `circular` class for traditional avatar appearance
- Apply size classes for consistent dimensions
- Always include descriptive `alt` text
- Use within semantic structures (comments, lists, feeds)
- Consider `bordered` class for better visibility on varied backgrounds

---

**Research completed:** 2025-11-05
**Component:** Avatar (Image Element Variation)
**Framework:** Semantic UI Classic
**Documentation:** https://semantic-ui.com/elements/image.html

**Notable Features:**
- Avatar implemented as Image element variation, not standalone component
- Inline formatting for text alignment
- Shares all Image element properties and variations
- Commonly combined with `circular` class for round avatars
- Tightly integrated with Comment, List, and Feed components
- Size controlled by both image size classes and font-size
- No built-in grouping component (uses Image groups)
- Consistent class-based API with rest of framework
