# Semantic UI Classic - Accordion Module

> Last Modified: 2025-11-05
> Source: https://semantic-ui.com/modules/accordion.html

## 1. Component Overview

The Semantic UI Accordion is a versatile **collapsible content container** that displays a single piece of content while allowing users to view other related content through a click-triggered reveal pattern. Unlike traditional accordion patterns that strictly enforce only one open panel, Semantic UI's Accordion is highly flexible and supports multiple nested levels, custom trigger selectors, dynamic content addition, and sophisticated state management.

The component is particularly valuable for:
- **FAQ sections** - Organizing questions with expandable answers
- **Content organization** - Grouping related information hierarchically
- **Form optimization** - Conditionally revealing optional form fields
- **Navigation drawers** - Creating expandable menu sections
- **Content filtering** - Showing/hiding filtered content dynamically

The Accordion uses a **progressive enhancement approach** - basic HTML structure works without JavaScript, and the component gracefully initializes when JavaScript loads, enhancing the experience with animations and state management.

## 2. Basic Usage

### Minimal Accordion (No JavaScript Required)

The simplest accordion requires only HTML markup with specific class names:

```html
<!-- Basic accordion structure -->
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    What is an accordion?
  </div>
  <div class="content">
    <p>An accordion is a UI pattern that shows and hides content.</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    How does it work?
  </div>
  <div class="content">
    <p>Click the title to toggle the content visibility.</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    What are the benefits?
  </div>
  <div class="content">
    <p>It saves space and organizes content effectively.</p>
  </div>
</div>
```

**Structure breakdown**:
- `.ui.accordion` - Root container establishing accordion context
- `.title` - Clickable header that triggers expand/collapse
- `.dropdown.icon` - Visual indicator (chevron/caret, optional but recommended)
- `.content` - Container for hidden/shown content
- Content inside `.content` can be any HTML

### JavaScript Initialization

```javascript
// Initialize all accordions
$('.ui.accordion').accordion();

// With configuration
$('.ui.accordion').accordion({
  exclusive: true,           // Only one open panel at a time
  on: 'click',              // Trigger event ('click' or 'hover')
  animate: true,            // Enable animations
  duration: 350,            // Animation duration in ms
  closeNested: false,       // Close parent when opening child
  collapsible: true,        // Allow closing open panels
  onOpening: () => {},      // Callback when opening
  onClosing: () => {},      // Callback when closing
  onOpen: () => {},         // Callback after opened
  onClose: () => {}         // Callback after closed
});

// Programmatic control
const accordion = $('.ui.accordion').accordion('instance');
accordion.open(0);          // Open first panel
accordion.close(0);         // Close first panel
accordion.toggle(1);        // Toggle second panel
```

## 3. Core Patterns & Variants

### Pattern: Basic FAQ Accordion

```html
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    <strong>Question 1</strong>
  </div>
  <div class="content">
    <p>This is the answer to the first question.</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    <strong>Question 2</strong>
  </div>
  <div class="content">
    <p>This is the answer to the second question.</p>
  </div>
</div>
```

### Pattern: Multiple Panels Open

```html
<div class="ui accordion" data-exclusive="false">
  <div class="title">
    <i class="dropdown icon"></i>
    Panel 1
  </div>
  <div class="content">
    <p>Content 1 - Can be open simultaneously with others</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Panel 2
  </div>
  <div class="content">
    <p>Content 2 - Can be open simultaneously with others</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Panel 3
  </div>
  <div class="content">
    <p>Content 3 - Can be open simultaneously with others</p>
  </div>
</div>

<script>
  $('.ui.accordion').accordion({ exclusive: false });
</script>
```

### Pattern: Nested Accordions

```html
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Parent Category 1
  </div>
  <div class="content">
    <p>Parent content</p>

    <!-- Nested accordion -->
    <div class="ui accordion">
      <div class="title">
        <i class="dropdown icon"></i>
        Subcategory 1.1
      </div>
      <div class="content">
        <p>Nested content 1.1</p>
      </div>

      <div class="title">
        <i class="dropdown icon"></i>
        Subcategory 1.2
      </div>
      <div class="content">
        <p>Nested content 1.2</p>
      </div>
    </div>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Parent Category 2
  </div>
  <div class="content">
    <p>Parent content 2</p>
  </div>
</div>

<script>
  // Initialize parent and nested accordions
  $('.ui.accordion').accordion({ closeNested: false });
</script>
```

### Pattern: Custom Trigger Element

```html
<div class="ui accordion">
  <!-- Trigger is on the button, not the title div -->
  <div class="title">
    <button class="ui small button">Click Me</button>
    <i class="dropdown icon"></i>
    Section Title
  </div>
  <div class="content">
    <p>Content triggered by custom button element</p>
  </div>

  <div class="title">
    <button class="ui small button">
      <i class="heart icon"></i>
    </button>
    <i class="dropdown icon"></i>
    Another Section
  </div>
  <div class="content">
    <p>Another custom trigger example</p>
  </div>
</div>

<script>
  // Custom selector for trigger element
  $('.ui.accordion').accordion({
    selector: {
      trigger: '.button'  // Only buttons trigger accordion
    }
  });
</script>
```

### Pattern: Hover Trigger

```html
<div class="ui accordion" data-on="hover">
  <div class="title">
    <i class="dropdown icon"></i>
    Hover over me
  </div>
  <div class="content">
    <p>This opens on hover, not click</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Hover me too
  </div>
  <div class="content">
    <p>Also opens on hover</p>
  </div>
</div>

<script>
  $('.ui.accordion').accordion({ on: 'hover' });
</script>
```

## 4. Styling & Variants

### Styled Variants

```html
<!-- Styled Accordion with flush appearance -->
<div class="ui styled accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Styled Section
  </div>
  <div class="content">
    <p>This accordion has styled appearance with borders and padding.</p>
  </div>
  <!-- More panels... -->
</div>
```

### Fluid (Full-width) Accordion

```html
<div class="ui fluid accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Full Width Section
  </div>
  <div class="content">
    <p>This accordion expands to fill its container width.</p>
  </div>
</div>
```

### Compact Accordion

```html
<div class="ui compact accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Compact Section
  </div>
  <div class="content">
    <p>Minimal padding and spacing for compact layouts.</p>
  </div>
</div>
```

### Inverted (Dark Theme)

```html
<div class="ui inverted accordion" style="background: #333; color: white; padding: 1em;">
  <div class="title">
    <i class="dropdown icon"></i>
    Dark Theme Section
  </div>
  <div class="content">
    <p>Designed for dark backgrounds with light text.</p>
  </div>
</div>
```

## 5. States

### Initial State Configuration

```html
<!-- Start with first panel open -->
<div class="ui accordion">
  <div class="title active">
    <i class="dropdown icon"></i>
    Open by Default
  </div>
  <div class="content active">
    <p>This panel starts in the open state.</p>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Closed by Default
  </div>
  <div class="content">
    <p>This panel starts closed.</p>
  </div>
</div>
```

### Disabled Panel

```html
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Active Section
  </div>
  <div class="content">
    <p>This can be clicked normally.</p>
  </div>

  <div class="title disabled">
    <i class="dropdown icon"></i>
    Disabled Section (Cannot be opened)
  </div>
  <div class="content">
    <p>This panel cannot be interacted with.</p>
  </div>
</div>
```

### Active/Expanded State

```html
<!-- Programmatic state control -->
<button onclick="togglePanel()">Toggle First Panel</button>

<div class="ui accordion" id="myAccordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Panel 1
  </div>
  <div class="content">
    <p>Content 1</p>
  </div>
</div>

<script>
  function togglePanel() {
    $('#myAccordion').accordion('toggle', 0);
  }
</script>
```

## 6. Interactive Features

### Content Callbacks

```javascript
// Initialize with event callbacks
$('.ui.accordion').accordion({
  onOpening: function() {
    console.log('Panel is opening...');
  },
  onClosing: function() {
    console.log('Panel is closing...');
  },
  onOpen: function() {
    console.log('Panel is now open');
    // Load content dynamically
    loadDynamicContent();
  },
  onClose: function() {
    console.log('Panel is now closed');
  }
});
```

### Dynamic Content Loading

```html
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Load on Expand
  </div>
  <div class="content" data-url="/api/content/1">
    <p>Content will load when opened...</p>
  </div>
</div>

<script>
  $('.ui.accordion').accordion({
    onOpen: function(index) {
      // Load content via AJAX when opened
      const $content = $('.content').eq(index);
      const url = $content.data('url');

      if (url && !$content.data('loaded')) {
        $.get(url, function(data) {
          $content.html(data);
          $content.data('loaded', true);
        });
      }
    }
  });
</script>
```

### AJAX Content Integration

```html
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Section with AJAX Content
  </div>
  <div class="content" data-content-url="/api/accordion/1">
    <i class="spinner loading icon"></i> Loading...
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Another AJAX Section
  </div>
  <div class="content" data-content-url="/api/accordion/2">
    <i class="spinner loading icon"></i> Loading...
  </div>
</div>

<script>
  $('.ui.accordion').accordion({
    onOpen: function(currentIndex) {
      const $content = $('.accordion .content').eq(currentIndex);
      const url = $content.data('content-url');

      if (url && $content.find('i.loading').length) {
        $.get(url, function(html) {
          $content.html(html);
        });
      }
    }
  });
</script>
```

### Dynamic Panel Addition

```javascript
// The accordion automatically handles dynamically added panels
// thanks to delegated events and DOM Mutation Observers

function addPanel(title, content) {
  const $accordion = $('.ui.accordion');

  // Add new panel HTML
  $accordion.append(`
    <div class="title">
      <i class="dropdown icon"></i>
      ${title}
    </div>
    <div class="content">
      <p>${content}</p>
    </div>
  `);

  // Refresh the accordion
  $accordion.accordion('refresh');
}

// Usage
addPanel('New Panel', 'New content goes here');
```

## 7. Integration Patterns

### Form Integration (Conditional Fields)

```html
<form class="ui form">
  <div class="field">
    <label>Do you have experience?</label>
    <select class="ui dropdown" id="experienceLevel">
      <option value="">Select...</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </div>

  <!-- Accordion for conditional fields -->
  <div class="ui accordion">
    <div class="title">
      <i class="dropdown icon"></i>
      Additional Details (Click to Expand)
    </div>
    <div class="content">
      <div class="field">
        <label>Years of Experience</label>
        <input type="number" name="years" placeholder="How many years?">
      </div>
      <div class="field">
        <label>Specializations</label>
        <input type="text" name="specializations" placeholder="List your specializations">
      </div>
    </div>
  </div>

  <button class="ui button" type="submit">Submit</button>
</form>

<script>
  $('#experienceLevel').on('change', function() {
    const $accordion = $('.ui.accordion');

    if ($(this).val() === 'advanced') {
      // Automatically open accordion for advanced users
      $accordion.accordion('open', 0);
    }
  });

  $('.ui.accordion').accordion();
</script>
```

### Menu Integration (Content Drawer)

```html
<div class="ui menu">
  <a class="item">
    Home
  </a>

  <!-- Accordion as menu drawer -->
  <div class="ui accordion">
    <a class="title item">
      <i class="dropdown icon"></i>
      Products
    </a>
    <div class="content">
      <a class="item">Electronics</a>
      <a class="item">Clothing</a>
      <a class="item">Books</a>
    </div>
  </div>

  <a class="item">
    Contact
  </a>
</div>

<script>
  $('.ui.accordion').accordion({
    on: 'click',
    exclusive: false
  });
</script>
```

### Segment Integration

```html
<div class="ui segment">
  <h4>FAQ Section</h4>

  <div class="ui accordion">
    <div class="title">
      <i class="dropdown icon"></i>
      What is this about?
    </div>
    <div class="content">
      <p>Explanation of the topic.</p>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      How do I use it?
    </div>
    <div class="content">
      <p>Instructions for usage.</p>
    </div>
  </div>
</div>
```

## 8. Accessibility Features

### ARIA Support

```html
<!-- Semantic UI Accordion includes built-in ARIA attributes -->
<div class="ui accordion" role="region">
  <div class="title" role="button" tabindex="0" aria-expanded="false">
    <i class="dropdown icon"></i>
    Expandable Section
  </div>
  <div class="content" role="region" aria-hidden="true">
    <p>Content revealed on expansion</p>
  </div>
</div>

<script>
  $('.ui.accordion').accordion();

  // ARIA attributes are automatically managed by Semantic UI
  // - aria-expanded toggles between true/false
  // - aria-hidden toggles between true/false
  // - tabindex ensures keyboard accessibility
</script>
```

### Keyboard Navigation

```html
<div class="ui accordion">
  <div class="title">
    <i class="dropdown icon"></i>
    Press Enter or Space to Toggle
  </div>
  <div class="content">
    <p>Keyboard navigation is automatically supported by Semantic UI.</p>
    <ul>
      <li>Tab - Navigate between sections</li>
      <li>Enter/Space - Toggle section</li>
      <li>Arrow Up/Down - Navigate between panels (when exclusive)</li>
    </ul>
  </div>

  <div class="title">
    <i class="dropdown icon"></i>
    Focus Management
  </div>
  <div class="content">
    <p>Focus is automatically managed and visible when using keyboard.</p>
  </div>
</div>

<script>
  $('.ui.accordion').accordion({
    // Ensure keyboard accessibility
    on: 'click'
  });
</script>
```

### Screen Reader Support

The accordion automatically implements:
- **role="region"** - Indicates expandable content sections
- **aria-expanded** - Communicates expansion state
- **aria-hidden** - Hides collapsed content from screen readers
- **tabindex** - Makes titles keyboard accessible
- **Semantic HTML** - Uses meaningful structure

## 9. Animation & Transitions

### Built-in Animations

```javascript
// Standard dropdown animation
$('.ui.accordion').accordion({
  animate: true,      // Enable animations
  duration: 350       // Duration in milliseconds
});

// No animation
$('.ui.accordion').accordion({
  animate: false
});

// Custom duration
$('.ui.accordion').accordion({
  animate: true,
  duration: 600       // Slower animation
});
```

### Transition Effects

Semantic UI supports various transition effects:

```html
<!-- HTML data attributes for animation control -->
<div class="ui accordion" data-transition="fade">
  <div class="title">
    <i class="dropdown icon"></i>
    Fade Effect
  </div>
  <div class="content">
    <p>Content fades in and out</p>
  </div>
</div>

<div class="ui accordion" data-transition="slide down">
  <div class="title">
    <i class="dropdown icon"></i>
    Slide Effect
  </div>
  <div class="content">
    <p>Content slides down and up</p>
  </div>
</div>

<div class="ui accordion" data-transition="scale">
  <div class="title">
    <i class="dropdown icon"></i>
    Scale Effect
  </div>
  <div class="content">
    <p>Content scales in and out</p>
  </div>
</div>
```

## 10. Key Properties/Props & Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `exclusive` | Boolean | `true` | Only one panel open at a time |
| `on` | String | `'click'` | Event type to trigger: 'click', 'hover', or 'click hover' |
| `animate` | Boolean | `true` | Enable expand/collapse animations |
| `duration` | Number | `350` | Animation duration in milliseconds |
| `closeNested` | Boolean | `false` | Close parent when opening child |
| `collapsible` | Boolean | `true` | Allow closing all panels (no panel required to be open) |
| `selector.trigger` | String | `.title` | Selector for clickable trigger element |
| `selector.title` | String | `.title` | Selector for title elements |
| `selector.content` | String | `.content` | Selector for content elements |
| `onOpening` | Function | `null` | Callback when panel begins opening |
| `onClosing` | Function | `null` | Callback when panel begins closing |
| `onOpen` | Function | `null` | Callback after panel opens |
| `onClose` | Function | `null` | Callback after panel closes |
| `onChanging` | Function | `null` | Callback during state change |

## 11. API Methods

```javascript
const accordion = $('.ui.accordion').accordion();

// Panel Control
accordion.accordion('open', 0);          // Open panel at index
accordion.accordion('close', 0);         // Close panel at index
accordion.accordion('toggle', 0);        // Toggle panel state
accordion.accordion('refresh');          // Refresh selector cache (for dynamic content)

// State Query
accordion.accordion('is open', 0);       // Check if panel is open
accordion.accordion('is animating');     // Check if animating

// Reset
accordion.accordion('reset');            // Close all panels

// Destroy
accordion.accordion('destroy');          // Destroy accordion instance
```

## 12. Code Examples

### Example 1: FAQ Accordion

```html
<div class="ui container">
  <h2>Frequently Asked Questions</h2>

  <div class="ui accordion">
    <div class="title">
      <i class="dropdown icon"></i>
      What is the return policy?
    </div>
    <div class="content">
      <p>We offer a 30-day money-back guarantee on all purchases. Items must be returned in original condition with all packaging.</p>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      How long does shipping take?
    </div>
    <div class="content">
      <p>Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout.</p>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      Do you offer international shipping?
    </div>
    <div class="content">
      <p>Yes, we ship to over 100 countries. International shipping costs vary based on destination.</p>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      How do I track my order?
    </div>
    <div class="content">
      <p>You'll receive a tracking number via email once your order ships. You can track it on our website or the carrier's site.</p>
    </div>
  </div>
</div>

<script>
  $(document).ready(function() {
    $('.ui.accordion').accordion({
      exclusive: true,
      collapsible: true
    });
  });
</script>
```

### Example 2: Settings Accordion

```html
<div class="ui form">
  <h3>Settings</h3>

  <div class="ui accordion">
    <div class="title active">
      <i class="dropdown icon"></i>
      Profile Settings
    </div>
    <div class="content active">
      <div class="field">
        <label>Full Name</label>
        <input type="text" placeholder="Your name">
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" placeholder="Your email">
      </div>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      Privacy Settings
    </div>
    <div class="content">
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" checked>
          <label>Show profile publicly</label>
        </div>
      </div>
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" checked>
          <label>Show email address</label>
        </div>
      </div>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      Notification Settings
    </div>
    <div class="content">
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox" checked>
          <label>Email notifications</label>
        </div>
      </div>
      <div class="field">
        <div class="ui checkbox">
          <input type="checkbox">
          <label>SMS notifications</label>
        </div>
      </div>
    </div>
  </div>

  <button class="ui button primary">Save Settings</button>
</div>

<script>
  $(document).ready(function() {
    $('.ui.accordion').accordion({
      exclusive: false,
      collapsible: true
    });
  });
</script>
```

### Example 3: Documentation with Nested Accordions

```html
<div class="ui container">
  <h2>Documentation</h2>

  <div class="ui accordion">
    <div class="title">
      <i class="dropdown icon"></i>
      Getting Started
    </div>
    <div class="content">
      <p>Learn the basics of our platform.</p>

      <div class="ui accordion">
        <div class="title">
          <i class="dropdown icon"></i>
          Installation
        </div>
        <div class="content">
          <p>Step 1: Download the package...</p>
        </div>

        <div class="title">
          <i class="dropdown icon"></i>
          Configuration
        </div>
        <div class="content">
          <p>Configure your settings...</p>
        </div>
      </div>
    </div>

    <div class="title">
      <i class="dropdown icon"></i>
      API Reference
    </div>
    <div class="content">
      <p>Complete API documentation.</p>

      <div class="ui accordion">
        <div class="title">
          <i class="dropdown icon"></i>
          Authentication
        </div>
        <div class="content">
          <p>Authentication endpoints...</p>
        </div>

        <div class="title">
          <i class="dropdown icon"></i>
          Data Methods
        </div>
        <div class="content">
          <p>Data manipulation endpoints...</p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  $(document).ready(function() {
    $('.ui.accordion').accordion({
      exclusive: false,
      closeNested: false
    });
  });
</script>
```

## 13. Notable Features

- **Dynamic Content Support**: Automatic DOM Mutation Observer integration allows content added after initialization to work seamlessly
- **Flexible Triggering**: Custom trigger selectors enable unconventional activation patterns (buttons, icons, etc.)
- **Nested Accordion Support**: Multiple levels of nesting with optional parent-close behavior
- **Exclusive & Collapsible**: Configure whether only one panel can be open and whether all panels can be closed
- **Progressive Enhancement**: Works with basic HTML structure, enhanced with JavaScript
- **Animation System**: Smooth transitions with configurable duration and easing
- **Delegated Events**: Events bound to parent allow automatic support for dynamically added panels
- **Callback Hooks**: Comprehensive lifecycle callbacks for opening, closing, and state changes
- **Class-based API**: All variations achieved through CSS classes and JavaScript configuration

## 14. Common Patterns Observed

- **FAQ Sections**: Most common use case - organizing question/answer pairs
- **Documentation Navigation**: Collapsing sections of documentation for easier navigation
- **Form Optimization**: Revealing optional fields based on previous selections
- **Menu Drawers**: Creating expandable navigation within existing menus
- **Settings Panels**: Organizing grouped configuration options
- **Content Organization**: Creating structured hierarchies of information
- **Timeline/History**: Expanding individual timeline entries for details

## 15. Related Components

- **Tabs** - Alternative for organizing content in horizontal tabs
- **Segment** - Container that works well with accordion panels
- **Menu** - Can be integrated with accordion for navigation drawers
- **Form** - Works well for form field organization
- **Card** - Related content grouping component
- **List** - Similar hierarchical organization

---

Research completed: 2025-11-05
Component: Accordion Module
Framework: Semantic UI Classic
Documentation: https://semantic-ui.com/modules/accordion.html
