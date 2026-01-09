# Semantic UI Classic - Message Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://semantic-ui.com/collections/message.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation provides thorough coverage of all message patterns with visual examples and detailed descriptions. Includes dismissible behavior implementation guidance.

## Component Definition
- **Core purpose**: Display user feedback, system notifications, and informational content in a visually distinct container
- **Mental model**: A communication container that draws attention to important information. Users understand messages as system feedback that requires acknowledgment or provides context for actions
- **Semantic meaning**: Communicates intent through semantic types (info, warning, error, success) and provides visual hierarchy for content presentation

## Pattern Support Levels
- **Native**: Dedicated class/API
- **Composed**: Via HTML composition
- **CSS-only**: Requires custom styling

## Display Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic message | ✅ | Native | Standard message container with `class="ui message"` |
| Icon message | ✅ | Native | Message with integrated icon using flexbox layout with `class="ui icon message"` |
| Dismissible message | ✅ | Composed | Message with close icon requiring jQuery for dismiss behavior |
| Floating message | ✅ | Native | Message that floats above content with `class="ui floating message"` |
| Attached message | ✅ | Native | Message attached to adjacent content with `top/bottom attached` classes |
| Compact message | ✅ | Native | Message width constrained to content with `class="ui compact message"` |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header support | ✅ | Native | Dedicated header element with `class="header"` |
| Paragraph content | ✅ | Native | Standard paragraph elements for body content |
| List content | ✅ | Native | Bulleted lists with `class="list"` |
| Icon integration | ✅ | Native | Icon element with `class="icon"` for icon messages |
| Mixed content | ✅ | Native | Combination of headers, paragraphs, and lists |
| Content wrapper | ✅ | Native | Content div wrapper for icon messages `class="content"` |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Dismissible | ✅ | Composed | Close icon with jQuery handler: `$('.message .close').on('click', function() { $(this).closest('.message').transition('fade'); })` |
| Hidden state | ✅ | Native | Message can be hidden with `class="ui hidden message"` |
| Visible state | ✅ | Native | Message forced to display with `class="ui visible message"` |
| Transition effects | ✅ | jQuery | Requires jQuery and Semantic UI transition module for animations |

## Variant Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Warning | ✅ | Native | `class="ui warning message"` - yellow styling for warnings |
| Info | ✅ | Native | `class="ui info message"` - blue styling for information |
| Positive | ✅ | Native | `class="ui positive message"` - green styling for positive feedback |
| Success | ✅ | Native | `class="ui success message"` - alias for positive |
| Negative | ✅ | Native | `class="ui negative message"` - red styling for negative feedback |
| Error | ✅ | Native | `class="ui error message"` - alias for negative |
| Colored variants | ✅ | Native | 12 colors: red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, black |
| Size variations | ✅ | Native | 7 sizes: mini, tiny, small, (default), large, big, huge, massive |

## Code Examples

### Basic Message
```html
<!-- Standard Message -->
<div class="ui message">
  <div class="header">Changes in Service</div>
  <p>We just updated our privacy policy here to better service our customers. We recommend reviewing the changes.</p>
</div>
```

### List Message
```html
<!-- Message with Bulleted List -->
<div class="ui message">
  <div class="header">New Site Features</div>
  <ul class="list">
    <li>You can now have cover images on blog pages</li>
    <li>Drafts will now auto-save while writing</li>
  </ul>
</div>
```

### Icon Message
```html
<!-- Icon Message with Flexbox Layout -->
<div class="ui icon message">
  <i class="inbox icon"></i>
  <div class="content">
    <div class="header">Have you heard about our mailing list?</div>
    <p>Get the best news in your e-mail every day.</p>
  </div>
</div>

<!-- Loading State Icon Message -->
<div class="ui icon message">
  <i class="notched circle loading icon"></i>
  <div class="content">
    <div class="header">Just one second</div>
    <p>We're fetching that content for you.</p>
  </div>
</div>
```

### Dismissible Message
```html
<!-- Message with Close Icon -->
<div class="ui message">
  <i class="close icon"></i>
  <div class="header">Welcome back!</div>
  <p>This is a special notification which you can dismiss if you're bored with it.</p>
</div>
```

**JavaScript for Dismissal:**
```javascript
$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
```

### State Variations
```html
<!-- Hidden Message -->
<div class="ui hidden message">
  You can't see me
</div>

<!-- Visible Message (forced display) -->
<div class="ui visible message">
  You can always see me
</div>
```

### Layout Variations
```html
<!-- Floating Message -->
<div class="ui floating message">
  <div class="header">Way to go!</div>
</div>

<!-- Compact Message (width fits content) -->
<div class="ui compact message">
  Get all the best inventions in your e-mail every day. Sign up now!
</div>
```

### Attached Messages
```html
<!-- Top Attached Message -->
<div class="ui attached message">
  <div class="header">Welcome to our site!</div>
  <p>Fill out the form below to sign-up for a new account</p>
</div>

<!-- Middle Attached Content (form) -->
<form class="ui form attached segment">
  <div class="two fields">
    <div class="field">
      <label>First Name</label>
      <input type="text" name="first-name" placeholder="First Name">
    </div>
    <div class="field">
      <label>Last Name</label>
      <input type="text" name="last-name" placeholder="Last Name">
    </div>
  </div>
  <div class="field">
    <label>Username</label>
    <input type="text" name="username" placeholder="Username">
  </div>
  <div class="field">
    <label>Password</label>
    <input type="password" name="password">
  </div>
  <div class="inline field">
    <div class="ui checkbox">
      <input type="checkbox" name="agreement">
      <label>I agree to the terms and conditions</label>
    </div>
  </div>
  <button class="ui button" type="submit">Submit</button>
</form>

<!-- Bottom Attached Warning Message -->
<div class="ui bottom attached warning message">
  <i class="icon help"></i>
  Already signed up? <a href="#">Login here</a> instead.
</div>
```

### Semantic Type Variations
```html
<!-- Warning Message -->
<div class="ui warning message">
  <div class="header">You must register before you can do that!</div>
  <p>Visit our registration page, then try again</p>
</div>

<!-- Info Message -->
<div class="ui info message">
  <div class="header">Was this what you wanted?</div>
  <ul class="list">
    <li>It's good to see you again.</li>
    <li>Did you know it's been a while?</li>
  </ul>
</div>

<!-- Positive Message -->
<div class="ui positive message">
  <div class="header">You are eligible for a reward</div>
  <p>Go to your <strong>special offers</strong> page to see now.</p>
</div>

<!-- Success Message (alias for positive) -->
<div class="ui success message">
  <div class="header">Your user registration was successful.</div>
  <p>You may now log-in with the username you have chosen</p>
</div>

<!-- Negative Message -->
<div class="ui negative message">
  <div class="header">We're sorry we can't apply that discount</div>
  <p>That offer has expired</p>
</div>

<!-- Error Message (alias for negative) -->
<div class="ui error message">
  <div class="header">There were some errors with your submission</div>
  <ul class="list">
    <li>You must include both a upper and lower case letters in your password.</li>
    <li>You need to select your home country.</li>
  </ul>
</div>
```

### Color Variations
```html
<!-- All Color Options -->
<div class="ui red message">Red</div>
<div class="ui orange message">Orange</div>
<div class="ui yellow message">Yellow</div>
<div class="ui olive message">Olive</div>
<div class="ui green message">Green</div>
<div class="ui teal message">Teal</div>
<div class="ui blue message">Blue</div>
<div class="ui violet message">Violet</div>
<div class="ui purple message">Purple</div>
<div class="ui pink message">Pink</div>
<div class="ui brown message">Brown</div>
<div class="ui black message">Black</div>
```

### Size Variations
```html
<!-- All Size Options -->
<div class="ui mini message">This is a mini message.</div>
<div class="ui tiny message">This is a tiny message.</div>
<div class="ui small message">This is a small message.</div>
<div class="ui message">This is a default message.</div>
<div class="ui large message">This is large</div>
<div class="ui big message">This is big</div>
<div class="ui huge message">This is huge</div>
<div class="ui massive message">This is massive</div>
```

## API Reference

### CSS Classes
- **Base**: `ui message` - Core message component
- **Types**: `icon` - Icon message with flexbox layout
- **Semantic**: `warning`, `info`, `positive`, `success`, `negative`, `error`
- **Colors**: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `black`
- **Layout**: `floating`, `compact`, `attached`, `top attached`, `bottom attached`
- **States**: `hidden`, `visible`
- **Sizes**: `mini`, `tiny`, `small`, `large`, `big`, `huge`, `massive`

### Content Classes
- **header**: Text header for message
- **content**: Content wrapper (required for icon messages)
- **list**: Bulleted list styling
- **close**: Close icon for dismissible messages

### jQuery API
```javascript
// Manual dismissal behavior (must be implemented)
$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade');  // Requires Semantic UI transition module
  });
```

## Notable Features

- **Class-based API**: All variations achieved through composable CSS classes following Semantic UI's naming conventions
- **Semantic naming**: Clear intent communication through `warning`, `info`, `positive/success`, `negative/error` classes
- **Flexbox icon layout**: Icon messages use modern flexbox for proper alignment and spacing
- **Manual dismiss behavior**: Dismissible messages require explicit jQuery implementation - not automatic
- **Transition integration**: Works seamlessly with Semantic UI's transition module for smooth animations
- **Comprehensive color palette**: 12 decorative colors plus 4 semantic types for flexible styling
- **Flexible content structure**: Supports headers, paragraphs, lists, and icons in various combinations
- **Attachment system**: Messages can be attached to other Semantic UI components (forms, segments, etc.)
- **Size flexibility**: 7 distinct size options from mini to massive
- **State management**: Hidden/visible classes for conditional display
- **jQuery-based**: Classic version requires jQuery for interactive behaviors

## Research Notes

### Framework Approach
- **Class composition**: Like other Semantic UI Classic components, functionality is added through combining class names
- **jQuery dependency**: Interactive features (dismissal, transitions) require jQuery initialization
- **CSS-first philosophy**: Most features are pure CSS with optional JavaScript enhancement

### Content Structure
- **Icon messages**: Require specific structure with `content` wrapper div for proper flexbox layout
- **Header optional**: Messages work with or without headers, providing flexibility
- **List integration**: Semantic UI's list styling applies automatically within messages
- **Mixed content support**: Can combine headers, paragraphs, lists, and icons freely

### Behavioral Characteristics
- **No auto-dismiss**: Dismissible messages don't automatically close - requires explicit jQuery handler
- **Transition dependency**: Smooth animations require Semantic UI's transition module
- **State persistence**: Hidden/visible states are CSS-based, not JavaScript-managed
- **Manual event binding**: Developers must wire up dismiss behavior themselves

### Design Philosophy
- **Semantic intent**: Strong emphasis on meaningful names (info, warning, error, success) over decorative descriptions
- **Visual hierarchy**: Headers, content, and lists have distinct styling for clear information architecture
- **Accessibility consideration**: Uses semantic HTML with proper heading and list structures
- **Flexible theming**: Color variations allow matching brand or semantic meaning

### Layout Patterns
- **Attached positioning**: Designed to work with Semantic UI's segment and form components
- **Floating elevation**: Floating variant adds shadow and elevation for prominence
- **Compact sizing**: Compact variant useful for inline or sidebar messages
- **Full-width default**: Messages span container width by default unless compact

### Historical Significance
- **Early notification pattern**: One of the pioneering implementations of semantic message types in CSS frameworks
- **Influenced modern design**: The info/warning/error/success pattern became standard in web development
- **jQuery era artifact**: Represents pre-framework era approach where jQuery handled all interactivity
- **Class-based patterns**: Popularized compositional CSS class patterns now common in utility frameworks

### Migration Considerations for Semantic UI Next
- **Web component adaptation**: Icon message structure (content wrapper) maps well to slot-based architecture
- **Dismissible behavior**: Should be built-in with automatic event handling (no jQuery needed)
- **Transition system**: Use CSS animations or Web Animations API instead of jQuery transitions
- **State management**: Could use reactive properties for hidden/visible states
- **Semantic variants**: Maintain warning/info/positive/negative naming for consistency
- **Color system**: Comprehensive color palette should be preserved
- **Size scale**: 7-size system aligns with Semantic UI design language
- **Attachment patterns**: Consider how attached messages work with shadow DOM boundaries
