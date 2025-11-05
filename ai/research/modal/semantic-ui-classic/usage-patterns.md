# Semantic UI - Modal Module

## Component Overview

The Modal component is a UI element that displays content that temporarily blocks interactions with the main view of a site. It prevents users from interacting with page content while focused on the modal, creating a focused context for important actions, confirmations, forms, or content viewing. Modals are commonly used for:

- Confirmations and approvals/denials
- Forms and data entry
- Alerts and notifications
- Content display and previews
- Multi-step processes
- User interactions requiring focused attention

## Usage Patterns

### Basic Usage

The basic modal implementation requires:
1. A container element with the `modal` class
2. A dimmer overlay (automatically managed by the component)
3. Content structure (header, content, actions)
4. JavaScript initialization and control

**Basic HTML Structure:**
```html
<div class="ui modal">
  <div class="header">Modal Header Title</div>
  <div class="content">
    <p>Modal body content goes here</p>
  </div>
  <div class="actions">
    <div class="ui button">Cancel</div>
    <div class="ui primary button">Approve</div>
  </div>
</div>
```

**Basic JavaScript Initialization:**
```javascript
$('.modal').modal('show');
```

### Variants/Styles

#### Standard Modal
The default modal presentation with full styling and all standard features.

```html
<div class="ui modal">
  <div class="header">Standard Modal</div>
  <div class="content">
    <p>This is a standard modal with default styling.</p>
  </div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button">OK</button>
  </div>
</div>
```

#### Basic Modal
A simplified version with reduced visual styling complexity.

```html
<div class="ui basic modal">
  <div class="header">Basic Modal</div>
  <div class="content">
    <p>This is a basic modal with minimal styling.</p>
  </div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button">OK</button>
  </div>
</div>
```

### States

#### Hidden (Default)
The modal is not visible and interactions with the page are not blocked.

```javascript
// Modal is initially hidden
// Only becomes visible when explicitly shown
```

#### Visible/Active
The modal is displayed and blocks page interaction through the dimmer overlay.

```javascript
$('.ui.modal').modal('show');
```

#### Loading State
Modals can display loading indicators while content is being fetched or processed.

```html
<div class="ui modal">
  <div class="header">Loading Content</div>
  <div class="content">
    <div class="ui active centered inline loader"></div>
  </div>
</div>
```

#### Disabled State
Modal actions or content can be disabled to prevent interaction.

```html
<div class="ui modal">
  <div class="content">
    <input type="text" disabled />
  </div>
  <div class="actions">
    <button class="ui button" disabled>Disabled Button</button>
  </div>
</div>
```

### Sizing Options

#### Mini Modal
```html
<div class="ui mini modal">
  <div class="header">Mini Modal</div>
  <div class="content">Smallest modal size</div>
</div>
```

#### Tiny Modal
```html
<div class="ui tiny modal">
  <div class="header">Tiny Modal</div>
  <div class="content">Very small modal</div>
</div>
```

#### Small Modal
```html
<div class="ui small modal">
  <div class="header">Small Modal</div>
  <div class="content">Small modal size</div>
</div>
```

#### Default/Medium Modal
```html
<div class="ui modal">
  <div class="header">Default Modal</div>
  <div class="content">Standard/medium modal size</div>
</div>
```

#### Large Modal
```html
<div class="ui large modal">
  <div class="header">Large Modal</div>
  <div class="content">Large modal size</div>
</div>
```

#### Fullscreen Modal
```html
<div class="ui fullscreen modal">
  <div class="header">Fullscreen Modal</div>
  <div class="content">Fullscreen modal covering entire viewport</div>
</div>
```

### Layout & Positioning

#### Centered Modal (Default)
Modals are vertically centered by default within the viewport.

```javascript
$('.ui.modal').modal({
  centered: true  // Default behavior
});
```

#### Non-Centered Modal
Modals can be positioned at the top of the viewport without centering.

```javascript
$('.ui.modal').modal({
  centered: false
});
```

#### Scrolling Content
When modal content exceeds viewport height, the modal body scrolls while header and actions remain fixed.

```html
<div class="ui modal">
  <div class="header">Modal with Scrolling Content</div>
  <div class="scrolling content">
    <!-- Long content that will scroll -->
    <p>This content will scroll if it exceeds viewport height</p>
  </div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button">OK</button>
  </div>
</div>
```

### Content & Structure

#### Header Section
Optional title and header content.

```html
<div class="ui modal">
  <div class="header">
    <h2>Modal Title</h2>
  </div>
</div>
```

#### Content Section
Main body content with flexible content types.

```html
<div class="content">
  <p>Text content</p>
  <form><!-- Forms --></form>
  <div><!-- Complex HTML --></div>
</div>
```

#### Image Content
Dedicated container for image-focused modals (v2.0+).

```html
<div class="ui modal">
  <div class="image content">
    <div class="image">
      <img src="image.jpg" />
    </div>
    <div class="description">
      <div class="header">Header text</div>
      <p>Description text</p>
    </div>
  </div>
</div>
```

#### Actions Section
Button row for user interactions (approve/deny pattern).

```html
<div class="actions">
  <button class="ui button">Decline</button>
  <button class="ui primary button">Accept</button>
</div>
```

#### Combined Structure
Complete modal with all sections.

```html
<div class="ui modal">
  <div class="header">Modal Title</div>
  <div class="content">
    <p>Main content goes here</p>
  </div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button">Confirm</button>
  </div>
</div>
```

### Interactive Features

#### Show/Hide Behavior
```javascript
// Show modal
$('.ui.modal').modal('show');

// Hide modal
$('.ui.modal').modal('hide');

// Toggle modal visibility
$('.ui.modal').modal('toggle');
```

#### Closable Property
Controls whether clicking the dimmer closes the modal.

```javascript
$('.ui.modal').modal({
  closable: true   // Default - dimmer click closes modal
});

$('.ui.modal').modal({
  closable: false  // Dimmer click does not close modal
});
```

#### Dimmer Overlay
The dimmer prevents interaction with page content behind the modal.

```javascript
// Standard dimmer
$('.ui.modal').modal({
  // Default dimmer behavior
});

// Blurred dimmer effect
$('.ui.modal').modal('show'); // Can apply via CSS classes
```

#### Dimmer Variations
```html
<!-- Blurred dimmer -->
<div class="ui blurred dimmer"></div>

<!-- Inverted dimmer -->
<div class="ui inverted dimmer"></div>
```

#### Multiple Modals
Stack multiple modals using the allowMultiple setting.

```javascript
$('.ui.modal').modal({
  allowMultiple: true
});

// Show multiple modals
$('.first.modal').modal('show');
$('.second.modal').modal('show');
```

#### Detachable Modals
Controls whether the modal is repositioned in the DOM.

```javascript
$('.ui.modal').modal({
  detachable: true   // Default - repositions modal in DOM
});
```

#### Autofocus
Automatically focuses the first form input when modal opens.

```javascript
$('.ui.modal').modal({
  autofocus: true    // Default - focuses first input
});
```

### Animation & Transitions

#### Transition Effects
Modals support various animation types.

**Scale (Default):**
```javascript
$('.ui.modal').modal({
  transition: 'scale'
});
```

**Fade:**
```javascript
$('.ui.modal').modal({
  transition: 'fade'
});
```

**Horizontal Flip:**
```javascript
$('.ui.modal').modal({
  transition: 'horizontal flip'
});
```

**Vertical Flip:**
```javascript
$('.ui.modal').modal({
  transition: 'vertical flip'
});
```

**Fade Up:**
```javascript
$('.ui.modal').modal({
  transition: 'fade up'
});
```

#### Animation Duration
Control animation speed in milliseconds.

```javascript
$('.ui.modal').modal({
  duration: 400  // Default duration in milliseconds
});

// Custom duration
$('.ui.modal').modal({
  duration: 600  // Slower animation
});
```

### Integration Patterns

#### Form Integration
Modals commonly contain forms for data entry.

```html
<div class="ui modal">
  <div class="header">User Registration</div>
  <div class="content">
    <form class="ui form">
      <div class="field">
        <label>Name</label>
        <input type="text" placeholder="Enter name" />
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" placeholder="Enter email" />
      </div>
    </form>
  </div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button">Register</button>
  </div>
</div>
```

#### Confirmation Pattern
Classic approve/deny modal for confirmations.

```javascript
$('.delete.modal').modal({
  onApprove: function() {
    // Delete action confirmed
    return true;  // Close modal
  },
  onDeny: function() {
    // Deletion cancelled
    return true;  // Close modal
  }
});
```

#### Callback Integration
```javascript
$('.ui.modal').modal({
  onShow: function() {
    console.log('Modal is beginning to show');
  },
  onVisible: function() {
    console.log('Modal animation completed');
  },
  onHide: function() {
    console.log('Modal is beginning to hide');
  },
  onHidden: function() {
    console.log('Modal has been hidden');
  },
  onApprove: function() {
    console.log('User clicked approve button');
    return true;  // Return false to prevent closing
  },
  onDeny: function() {
    console.log('User clicked deny button');
    return true;
  }
});
```

#### AJAX Content Loading
Load modal content dynamically from server.

```javascript
$('.ui.modal').modal({
  onShow: function() {
    $.get('/api/modal-content', function(data) {
      $('.ui.modal .content').html(data);
    });
  }
});
```

#### Nested Modals
Display modals within modals for multi-step processes.

```javascript
$('.first.modal').modal({
  onApprove: function() {
    $('.second.modal').modal('show');
    return false;  // Don't close this modal
  },
  allowMultiple: true
});
```

### Accessibility Features

#### Keyboard Navigation
- **Escape key**: Closes modal (when closable is true)
- **Tab**: Navigates focus within modal
- **Enter**: Submits form or activates focused button

```javascript
$('.ui.modal').modal({
  closable: true  // Allows Escape key to close
});
```

#### Focus Management
Modal automatically manages focus when opening/closing.

```javascript
$('.ui.modal').modal({
  autofocus: true  // First focusable element receives focus
});
```

#### Semantic HTML
```html
<div class="ui modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="header" id="modal-title">Modal Title</div>
  <div class="content">Content</div>
  <div class="actions">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</div>
```

#### ARIA Attributes
```html
<div class="ui modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modal-header"
     aria-describedby="modal-content">
  <div class="header" id="modal-header">Title</div>
  <div class="content" id="modal-content">Description</div>
</div>
```

#### Screen Reader Support
- Modal announces title through aria-labelledby
- Modal announces description through aria-describedby
- Dialog role indicates modal behavior to assistive technologies

## Key Properties/Props

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `closable` | Boolean | true | Whether clicking the dimmer closes the modal |
| `autofocus` | Boolean | true | Whether first form input automatically receives focus |
| `centered` | Boolean | true | Whether modal is vertically centered |
| `transition` | String | 'scale' | Animation type (scale, fade, flip horizontal, flip vertical, fade up) |
| `duration` | Number | 400 | Animation duration in milliseconds |
| `detachable` | Boolean | true | Whether modal is repositioned in the DOM |
| `allowMultiple` | Boolean | false | Whether multiple modals can be displayed simultaneously |
| `onShow` | Function | null | Callback when modal begins to show |
| `onVisible` | Function | null | Callback after modal animation completes |
| `onHide` | Function | null | Callback when modal begins to hide |
| `onHidden` | Function | null | Callback after modal has been hidden |
| `onApprove` | Function | null | Callback when approve button clicked; return false to prevent closing |
| `onDeny` | Function | null | Callback when deny button clicked; return false to prevent closing |
| `blurring` | Boolean | false | Dimmer blurs background content |
| `inverted` | Boolean | false | Dimmer has inverted colors |

## Code Examples

### Example 1: Basic Modal with Approve/Deny

```html
<div class="ui modal" id="basicModal">
  <div class="header">Confirm Action</div>
  <div class="content">
    <p>Are you sure you want to perform this action?</p>
  </div>
  <div class="actions">
    <div class="ui button">Cancel</div>
    <div class="ui primary button">Confirm</div>
  </div>
</div>

<button class="ui button" id="openModal">Open Modal</button>

<script>
  $('#basicModal').modal({
    closable: true,
    onApprove: function() {
      console.log('Action approved');
    },
    onDeny: function() {
      console.log('Action denied');
    }
  });

  $('#openModal').on('click', function() {
    $('#basicModal').modal('show');
  });
</script>
```

### Example 2: Form Modal with Validation

```html
<div class="ui modal" id="formModal">
  <div class="header">User Registration</div>
  <div class="content">
    <form class="ui form">
      <div class="field">
        <label>Username</label>
        <input type="text" name="username" placeholder="Username" required />
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" name="email" placeholder="Email" required />
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" name="password" placeholder="Password" required />
      </div>
    </form>
  </div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button">Register</button>
  </div>
</div>

<script>
  $('#formModal').modal({
    onApprove: function() {
      // Validate form
      const form = $('#formModal form')[0];
      if (!form.checkValidity()) {
        return false;  // Prevent closing
      }
      // Submit form
      return true;    // Close modal
    }
  });
</script>
```

### Example 3: Image Modal

```html
<div class="ui modal" id="imageModal">
  <div class="image content">
    <div class="image">
      <img src="image.jpg" alt="Modal image" />
    </div>
    <div class="description">
      <div class="header">Image Title</div>
      <p>Image description and details go here.</p>
    </div>
  </div>
  <div class="actions">
    <button class="ui button">Close</button>
  </div>
</div>

<script>
  $('#imageModal').modal('show');
</script>
```

### Example 4: Scrolling Content Modal

```html
<div class="ui large modal" id="scrollingModal">
  <div class="header">Terms and Conditions</div>
  <div class="scrolling content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
    <!-- Long content that will scroll -->
  </div>
  <div class="actions">
    <button class="ui button">Decline</button>
    <button class="ui primary button">Accept</button>
  </div>
</div>

<script>
  $('#scrollingModal').modal({
    onApprove: function() {
      console.log('Terms accepted');
    }
  });
</script>
```

### Example 5: Loading Modal

```html
<div class="ui modal" id="loadingModal">
  <div class="header">Processing Request</div>
  <div class="content">
    <div class="ui active centered inline loader"></div>
    <p style="text-align: center; margin-top: 1em;">Please wait...</p>
  </div>
</div>

<script>
  $('#loadingModal').modal('show');

  // Simulate async operation
  setTimeout(function() {
    $('#loadingModal').modal('hide');
  }, 3000);
</script>
```

### Example 6: Multiple Modals

```html
<div class="ui modal" id="firstModal">
  <div class="header">First Modal</div>
  <div class="content">This is the first modal</div>
  <div class="actions">
    <button class="ui button">Cancel</button>
    <button class="ui primary button" id="goToSecond">Next</button>
  </div>
</div>

<div class="ui modal" id="secondModal">
  <div class="header">Second Modal</div>
  <div class="content">This is the second modal</div>
  <div class="actions">
    <button class="ui button">Back</button>
    <button class="ui primary button">Complete</button>
  </div>
</div>

<script>
  $('#firstModal').modal({
    allowMultiple: true,
    onApprove: function() {
      return false;  // Don't close
    }
  });

  $('#secondModal').modal({
    allowMultiple: true
  });

  $('#goToSecond').on('click', function() {
    $('#secondModal').modal('show');
  });
</script>
```

### Example 7: Dynamic Content Modal

```html
<div class="ui modal" id="dynamicModal">
  <div class="header">Dynamic Content</div>
  <div class="content" id="dynamicContent">
    Loading...
  </div>
  <div class="actions">
    <button class="ui button">Close</button>
  </div>
</div>

<script>
  $('#dynamicModal').modal({
    onShow: function() {
      // Load content from server
      $.get('/api/content', function(data) {
        $('#dynamicContent').html(data);
      });
    }
  });

  $('#dynamicModal').modal('show');
</script>
```

### Example 8: Custom Transitions

```html
<div class="ui modal" id="customTransitionModal">
  <div class="header">Custom Animation</div>
  <div class="content">Watch this modal with custom animation</div>
  <div class="actions">
    <button class="ui button">Close</button>
  </div>
</div>

<script>
  $('#customTransitionModal').modal({
    transition: 'vertical flip',
    duration: 600
  });

  $('#customTransitionModal').modal('show');
</script>
```

## Accessibility Notes

### Required ARIA Attributes
1. **role="dialog"** - Identifies element as a dialog
2. **aria-modal="true"** - Indicates modal behavior
3. **aria-labelledby** - Points to modal title (header id)
4. **aria-describedby** - Points to modal description (optional)

### Focus Management
- Modal must trap focus within modal content
- Escape key should close modal when closable is true
- Focus should return to trigger element after modal closes
- First focusable element should receive focus when modal opens (autofocus: true)

### Keyboard Accessibility
- Tab key navigates forward through focusable elements
- Shift+Tab navigates backward through focusable elements
- Escape key closes modal (when closable is true)
- Enter key activates default button
- Space bar activates buttons

### Screen Reader Announcements
- Modal title announced on open
- Modal content available to screen readers
- Button purposes clear through labels
- Form fields properly labeled

### Visual Accessibility
- Focus indicators clearly visible
- Sufficient color contrast in all states
- No information conveyed by color alone
- Dimmer provides clear modal focus

## Common Patterns

1. **Confirmation Dialogs** - Approve/deny pattern for destructive actions
2. **Form Entry** - Modal as context for data input with validation
3. **Image Galleries** - Image-content modals for photo displays
4. **Multi-step Processes** - Multiple modals in sequence
5. **Loading States** - Modal with spinner for async operations
6. **Alert Messages** - Simple content modals for notifications
7. **Terms & Conditions** - Scrolling content modals with acceptance
8. **Settings/Preferences** - Form-based modals for configuration
9. **Error Reporting** - Modals for error details and recovery options
10. **Help & Documentation** - Content modals for help text and guides

## Related Components

- **Dimmer** - Overlay that blocks interaction with page content
- **Button** - Call-to-action controls within modal
- **Form** - Data entry patterns within modals
- **Message** - Alert and notification content
- **Segment** - Content container for modal body
- **Header** - Title element for modal header section
- **Transition** - Animation system powering modal animations
- **Icon** - Visual indicators within modal content
- **Loader** - Loading spinner for async operations
- **Popup** - Positioning alternative for smaller overlays

---
Research completed: 2025-11-05
Component: Modal
Framework: Semantic UI Classic
Documentation: https://semantic-ui.com/modules/modal.html
