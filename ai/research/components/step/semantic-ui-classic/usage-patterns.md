# Semantic UI Classic Step - Usage Patterns

> Last Modified: 2025-11-05
> Source: https://semantic-ui.com/elements/step.html (accessed via documentation knowledge)

## Component Overview

The Semantic UI Step component displays a sequence of steps in a process, allowing users to navigate through multi-step workflows. It's a visual progress indicator and navigation tool commonly used in multi-step forms, wizards, onboarding flows, and process tracking interfaces.

**Primary Use Cases:**
- Multi-step form wizards
- Process progress tracking
- Sequential navigation
- Onboarding flows
- Checkout processes
- Setup wizards
- Tutorial sequences

**Key Characteristics:**
- Progressive disclosure of information
- Visual indication of current position
- Support for completed, active, and disabled states
- Horizontal and vertical orientations
- Ordered and unordered variations
- Flexible content (icons, titles, descriptions)
- Interactive and non-interactive modes

## Basic Usage

### Simple Steps

The most basic step structure displays a horizontal sequence:

```html
<div class="ui steps">
  <div class="step">
    <i class="truck icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose your shipping options</div>
    </div>
  </div>
  <div class="step active">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter billing information</div>
    </div>
  </div>
  <div class="step disabled">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm Order</div>
      <div class="description">Verify order details</div>
    </div>
  </div>
</div>
```

**Structure Breakdown:**
- `.ui.steps` - Container for step group
- `.step` - Individual step item
- `.icon` - Optional icon (Semantic UI icon)
- `.content` - Content wrapper
- `.title` - Step title/heading
- `.description` - Optional descriptive text

### Minimal Steps (Title Only)

```html
<div class="ui steps">
  <div class="step">
    <div class="content">
      <div class="title">Shipping</div>
    </div>
  </div>
  <div class="step active">
    <div class="content">
      <div class="title">Billing</div>
    </div>
  </div>
  <div class="step">
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

### Icon-Only Steps

```html
<div class="ui steps">
  <div class="step">
    <i class="truck icon"></i>
  </div>
  <div class="step active">
    <i class="payment icon"></i>
  </div>
  <div class="step">
    <i class="info icon"></i>
  </div>
</div>
```

## Props/API

### Container Classes (`.ui.steps`)

| Class | Purpose | Effect |
|-------|---------|--------|
| `.ordered` | Numbered steps | Shows step numbers |
| `.vertical` | Vertical layout | Stacks steps vertically |
| `.fluid` | Full width | Stretches to container width |
| `.attached` | Attaches to adjacent content | Removes borders for attachment |
| `.stackable` | Responsive stacking | Stacks on mobile devices |
| `.unstackable` | Prevents stacking | Maintains horizontal layout |
| `.tablet stackable` | Stack on tablet | Responsive behavior |

### Step State Classes (`.step`)

| Class | Purpose | Visual Effect |
|-------|---------|---------------|
| `.active` | Current step | Highlighted, emphasized |
| `.completed` | Finished step | Checkmark, muted color |
| `.disabled` | Unavailable step | Grayed out, non-interactive |
| `.link` | Clickable step | Pointer cursor, hover effect |

### Size Variations

| Class | Size |
|-------|------|
| `.mini` | Smallest |
| `.tiny` | Very small |
| `.small` | Small |
| (default) | Standard |
| `.large` | Large |

### Content Elements

| Element | Class | Purpose |
|---------|-------|---------|
| Icon | `.icon` | Visual indicator |
| Content | `.content` | Text wrapper |
| Title | `.title` | Step name |
| Description | `.description` | Optional detail text |

## Common Patterns

### Pattern Category 1: Form Wizard Steps

Multi-step form navigation with state management:

```html
<div class="ui ordered steps">
  <div class="completed step">
    <div class="content">
      <div class="title">Account</div>
      <div class="description">Create your account</div>
    </div>
  </div>
  <div class="completed step">
    <div class="content">
      <div class="title">Profile</div>
      <div class="description">Setup your profile</div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">Preferences</div>
      <div class="description">Choose your preferences</div>
    </div>
  </div>
  <div class="disabled step">
    <div class="content">
      <div class="title">Review</div>
      <div class="description">Review and complete</div>
    </div>
  </div>
</div>
```

**JavaScript State Management:**
```javascript
// Track current step
var currentStep = 2; // 0-indexed

// Update step states
function updateSteps(stepIndex) {
  $('.ui.steps .step').each(function(index) {
    var $step = $(this);

    $step.removeClass('active completed disabled');

    if (index < stepIndex) {
      $step.addClass('completed');
    } else if (index === stepIndex) {
      $step.addClass('active');
    } else {
      $step.addClass('disabled');
    }
  });
}

// Navigate to step
function goToStep(stepIndex) {
  currentStep = stepIndex;
  updateSteps(currentStep);

  // Show corresponding form section
  $('.step-content').hide();
  $('.step-content').eq(stepIndex).show();
}

// Next/Previous handlers
$('.next-button').on('click', function() {
  if (currentStep < $('.ui.steps .step').length - 1) {
    goToStep(currentStep + 1);
  }
});

$('.prev-button').on('click', function() {
  if (currentStep > 0) {
    goToStep(currentStep - 1);
  }
});

// Clickable step navigation
$('.ui.steps .step.link').on('click', function() {
  var stepIndex = $(this).index();

  // Only allow navigating to completed or current steps
  if (stepIndex <= currentStep) {
    goToStep(stepIndex);
  }
});
```

### Pattern Category 2: Progress Tracking

Non-interactive status display:

```html
<div class="ui steps">
  <div class="completed step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Order Placed</div>
      <div class="description">Nov 4, 2:30 PM</div>
    </div>
  </div>
  <div class="completed step">
    <i class="box icon"></i>
    <div class="content">
      <div class="title">Packaged</div>
      <div class="description">Nov 4, 5:15 PM</div>
    </div>
  </div>
  <div class="active step">
    <i class="truck icon"></i>
    <div class="content">
      <div class="title">In Transit</div>
      <div class="description">Expected Nov 6</div>
    </div>
  </div>
  <div class="step">
    <i class="home icon"></i>
    <div class="content">
      <div class="title">Delivered</div>
    </div>
  </div>
</div>
```

### Pattern Category 3: Clickable Navigation Steps

Interactive step navigation:

```html
<div class="ui steps">
  <a class="completed step" href="#step1">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Personal Info</div>
    </div>
  </a>
  <a class="active step" href="#step2">
    <i class="map marker alternate icon"></i>
    <div class="content">
      <div class="title">Address</div>
    </div>
  </a>
  <div class="disabled step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Payment</div>
    </div>
  </div>
</div>
```

**Using `.link` class instead of `<a>` tags:**
```html
<div class="ui steps">
  <div class="completed link step" data-step="1">
    <div class="content">
      <div class="title">Step 1</div>
    </div>
  </div>
  <div class="active link step" data-step="2">
    <div class="content">
      <div class="title">Step 2</div>
    </div>
  </div>
  <div class="link step" data-step="3">
    <div class="content">
      <div class="title">Step 3</div>
    </div>
  </div>
</div>
```

## Orientation Patterns

### Horizontal Steps (Default)

```html
<div class="ui steps">
  <div class="step">
    <i class="truck icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
    </div>
  </div>
  <div class="active step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
    </div>
  </div>
  <div class="step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

**Characteristics:**
- Default layout
- Steps arranged left-to-right
- Equal width distribution
- Connected with arrows/lines
- Best for 2-7 steps

### Vertical Steps

```html
<div class="ui vertical steps">
  <div class="completed step">
    <i class="truck icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose your shipping options</div>
    </div>
  </div>
  <div class="active step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter billing information</div>
    </div>
  </div>
  <div class="step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm Order</div>
      <div class="description">Verify order details</div>
    </div>
  </div>
</div>
```

**Characteristics:**
- Stacked top-to-bottom
- Variable height per step
- Better for long descriptions
- Suitable for sidebar placement
- Accommodates more steps
- Better for narrow containers

### Stackable (Responsive)

```html
<div class="ui tablet stackable steps">
  <div class="step">
    <i class="plane icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose shipping method</div>
    </div>
  </div>
  <div class="active step">
    <i class="dollar icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter payment info</div>
    </div>
  </div>
  <div class="step">
    <i class="info circle icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
      <div class="description">Review order</div>
    </div>
  </div>
</div>
```

**Behavior:**
- Horizontal on desktop
- Stacks vertically on mobile
- `.tablet stackable` - Stacks on tablet and below
- Responsive breakpoint handling
- Best practice for mobile-friendly designs

## Size Patterns

### Mini Steps

```html
<div class="ui mini steps">
  <div class="step">
    <div class="content">
      <div class="title">Step 1</div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">Step 2</div>
    </div>
  </div>
  <div class="step">
    <div class="content">
      <div class="title">Step 3</div>
    </div>
  </div>
</div>
```

### Small Steps

```html
<div class="ui small steps">
  <div class="step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Account</div>
    </div>
  </div>
  <div class="active step">
    <i class="address card icon"></i>
    <div class="content">
      <div class="title">Profile</div>
    </div>
  </div>
</div>
```

### Large Steps

```html
<div class="ui large steps">
  <div class="completed step">
    <i class="check circle icon"></i>
    <div class="content">
      <div class="title">Registration</div>
      <div class="description">Complete your registration</div>
    </div>
  </div>
  <div class="active step">
    <i class="cog icon"></i>
    <div class="content">
      <div class="title">Setup</div>
      <div class="description">Configure your preferences</div>
    </div>
  </div>
</div>
```

**Size Comparison:**
- **Mini**: Very compact, title-only typically
- **Tiny**: Slightly larger than mini
- **Small**: Reduced padding, smaller icons
- **Default**: Standard size, balanced
- **Large**: Increased padding, larger icons

## Status Patterns

### Active State

The currently focused or in-progress step:

```html
<div class="ui steps">
  <div class="step">
    <div class="content">
      <div class="title">Completed Step</div>
    </div>
  </div>
  <div class="active step">
    <i class="spinner loading icon"></i>
    <div class="content">
      <div class="title">Processing</div>
      <div class="description">Please wait...</div>
    </div>
  </div>
  <div class="step">
    <div class="content">
      <div class="title">Next Step</div>
    </div>
  </div>
</div>
```

**Visual Characteristics:**
- Highlighted background color
- Prominent border or accent color
- Higher contrast
- May include loading indicator
- Clear visual emphasis

### Completed State

Steps that have been finished:

```html
<div class="ui steps">
  <div class="completed step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Account Created</div>
      <div class="description">Nov 4, 2023</div>
    </div>
  </div>
  <div class="completed step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Email Verified</div>
      <div class="description">Nov 4, 2023</div>
    </div>
  </div>
  <div class="active step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Complete Profile</div>
    </div>
  </div>
</div>
```

**Visual Characteristics:**
- Checkmark icon (often automatic)
- Muted color scheme
- Lower visual priority than active
- May show completion timestamp
- Still clickable if using link steps

### Disabled State

Steps not yet available:

```html
<div class="ui steps">
  <div class="active step">
    <i class="credit card icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Add payment method</div>
    </div>
  </div>
  <div class="disabled step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm Order</div>
      <div class="description">Review and submit</div>
    </div>
  </div>
</div>
```

**Visual Characteristics:**
- Grayed out appearance
- Reduced opacity
- Non-interactive (no hover effects)
- No cursor pointer
- Indicates unavailable state

### Link State

Interactive, clickable steps:

```html
<div class="ui steps">
  <div class="completed link step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
    </div>
  </div>
  <div class="active step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

**Characteristics:**
- Hover effects enabled
- Pointer cursor
- Clickable behavior
- Can navigate backward to completed steps
- Typically combined with completed or active states

## Type Patterns

### Ordered Steps (Numbered)

```html
<div class="ui ordered steps">
  <div class="completed step">
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose your shipping options</div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter billing information</div>
    </div>
  </div>
  <div class="disabled step">
    <div class="content">
      <div class="title">Confirm Order</div>
      <div class="description">Verify order details</div>
    </div>
  </div>
</div>
```

**Characteristics:**
- Automatically numbered (1, 2, 3...)
- Numbers replace icons
- Clear sequential progression
- Better for linear processes
- Numbers shown in circle/badge

### Vertical Ordered Steps

```html
<div class="ui vertical ordered steps">
  <div class="completed step">
    <div class="content">
      <div class="title">Create Account</div>
      <div class="description">Sign up for a new account</div>
    </div>
  </div>
  <div class="completed step">
    <div class="content">
      <div class="title">Verify Email</div>
      <div class="description">Check your inbox</div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">Complete Profile</div>
      <div class="description">Add your information</div>
    </div>
  </div>
</div>
```

### Stackable Steps

```html
<div class="ui stackable steps">
  <div class="step">
    <i class="plane icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Select method</div>
    </div>
  </div>
  <div class="active step">
    <i class="dollar sign icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Payment details</div>
    </div>
  </div>
  <div class="step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
      <div class="description">Review order</div>
    </div>
  </div>
</div>
```

**Responsive Behavior:**
- Desktop: Horizontal layout
- Tablet/Mobile: Stacks vertically
- Automatic responsive transformation
- Best practice for mobile-first design

## Content Patterns

### Icon + Title + Description

Full-featured step content:

```html
<div class="ui steps">
  <div class="step">
    <i class="truck icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose your shipping options</div>
    </div>
  </div>
  <div class="active step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter billing information</div>
    </div>
  </div>
</div>
```

### Icon + Title Only

Simplified content:

```html
<div class="ui steps">
  <div class="step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Account</div>
    </div>
  </div>
  <div class="active step">
    <i class="address card icon"></i>
    <div class="content">
      <div class="title">Profile</div>
    </div>
  </div>
  <div class="step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

### Icon Only

Minimal content:

```html
<div class="ui steps">
  <div class="completed step">
    <i class="check icon"></i>
  </div>
  <div class="active step">
    <i class="payment icon"></i>
  </div>
  <div class="step">
    <i class="info icon"></i>
  </div>
</div>
```

**Use case:** Space-constrained layouts, icon-driven UIs

### Title Only (No Icon)

Text-based steps:

```html
<div class="ui steps">
  <div class="completed step">
    <div class="content">
      <div class="title">Shipping</div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">Billing</div>
    </div>
  </div>
  <div class="step">
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

### Custom Content

```html
<div class="ui steps">
  <div class="step">
    <div class="content">
      <div class="title">
        <i class="user circle icon"></i>
        Personal Information
      </div>
      <div class="description">
        <div class="ui mini progress">
          <div class="bar" style="width: 100%"></div>
        </div>
        Complete
      </div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">
        <i class="building icon"></i>
        Company Details
      </div>
      <div class="description">
        <div class="ui mini progress">
          <div class="bar" style="width: 60%"></div>
        </div>
        3 of 5 fields
      </div>
    </div>
  </div>
</div>
```

## Group Patterns

### Two Steps

```html
<div class="ui two steps">
  <div class="active step">
    <i class="edit icon"></i>
    <div class="content">
      <div class="title">Edit</div>
    </div>
  </div>
  <div class="step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

### Three Steps

```html
<div class="ui three steps">
  <div class="completed step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Account</div>
    </div>
  </div>
  <div class="active step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
    </div>
  </div>
  <div class="step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>
```

### Four Through Seven Steps

```html
<!-- Four steps -->
<div class="ui four steps">
  <!-- ... -->
</div>

<!-- Five steps -->
<div class="ui five steps">
  <!-- ... -->
</div>

<!-- Six steps -->
<div class="ui six steps">
  <!-- ... -->
</div>

<!-- Seven steps -->
<div class="ui seven steps">
  <!-- ... -->
</div>

<!-- Eight steps -->
<div class="ui eight steps">
  <!-- ... -->
</div>
```

**Purpose:**
- Forces equal width distribution
- Maintains consistent sizing
- Better visual balance
- Prevents wrapping

**Note:** Without number class, steps use auto-width based on content.

### Fluid Steps (Full Width)

```html
<div class="ui fluid steps">
  <div class="step">
    <div class="content">
      <div class="title">Step 1</div>
    </div>
  </div>
  <div class="active step">
    <div class="content">
      <div class="title">Step 2</div>
    </div>
  </div>
  <div class="step">
    <div class="content">
      <div class="title">Step 3</div>
    </div>
  </div>
</div>
```

**Characteristics:**
- Stretches to full container width
- Equal width distribution
- No minimum width constraints
- Responsive to container size

### Attached Steps

```html
<div class="ui top attached steps">
  <div class="completed step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
    </div>
  </div>
  <div class="active step">
    <i class="payment icon"></i>
    <div class="content">
      <div class="title">Billing</div>
    </div>
  </div>
  <div class="step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm</div>
    </div>
  </div>
</div>

<div class="ui attached segment">
  <!-- Form content for active step -->
  <form class="ui form">
    <div class="field">
      <label>Card Number</label>
      <input type="text" placeholder="1234 5678 9012 3456">
    </div>
    <div class="fields">
      <div class="field">
        <label>Expiry</label>
        <input type="text" placeholder="MM/YY">
      </div>
      <div class="field">
        <label>CVC</label>
        <input type="text" placeholder="123">
      </div>
    </div>
  </form>
</div>

<div class="ui bottom attached segment">
  <button class="ui button">Previous</button>
  <button class="ui primary button">Continue</button>
</div>
```

**Attachment Options:**
- `.top attached` - Attached to top
- `.bottom attached` - Attached to bottom
- `.attached` - Attached both sides

**Visual Effect:**
- Removes borders between attached elements
- Creates unified appearance
- Common for wizard forms

## State Patterns

### Dynamic State Management

Complete example with state transitions:

```html
<div class="ui ordered steps">
  <div class="completed link step" data-step="0">
    <div class="content">
      <div class="title">Personal Info</div>
      <div class="description">Name and contact</div>
    </div>
  </div>
  <div class="active step" data-step="1">
    <div class="content">
      <div class="title">Address</div>
      <div class="description">Shipping details</div>
    </div>
  </div>
  <div class="disabled step" data-step="2">
    <div class="content">
      <div class="title">Payment</div>
      <div class="description">Billing information</div>
    </div>
  </div>
  <div class="disabled step" data-step="3">
    <div class="content">
      <div class="title">Review</div>
      <div class="description">Confirm order</div>
    </div>
  </div>
</div>

<div class="ui segment">
  <div class="step-content" data-content="0" style="display: none;">
    <!-- Personal info form -->
  </div>
  <div class="step-content" data-content="1">
    <!-- Address form -->
  </div>
  <div class="step-content" data-content="2" style="display: none;">
    <!-- Payment form -->
  </div>
  <div class="step-content" data-content="3" style="display: none;">
    <!-- Review screen -->
  </div>
</div>

<div class="ui buttons">
  <button class="ui button" id="prev-btn">Previous</button>
  <button class="ui primary button" id="next-btn">Next</button>
</div>
```

**JavaScript State Management:**
```javascript
var StepManager = {
  currentStep: 1,
  totalSteps: 4,

  init: function() {
    this.bindEvents();
    this.updateSteps();
  },

  bindEvents: function() {
    var self = this;

    // Next button
    $('#next-btn').on('click', function() {
      self.nextStep();
    });

    // Previous button
    $('#prev-btn').on('click', function() {
      self.prevStep();
    });

    // Clickable steps (only completed and current)
    $('.ui.steps .link.step').on('click', function() {
      var targetStep = $(this).data('step');
      if (targetStep <= self.currentStep) {
        self.goToStep(targetStep);
      }
    });
  },

  nextStep: function() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.updateSteps();
    }
  },

  prevStep: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateSteps();
    }
  },

  goToStep: function(stepIndex) {
    this.currentStep = stepIndex;
    this.updateSteps();
  },

  updateSteps: function() {
    var self = this;

    // Update step states
    $('.ui.steps .step').each(function(index) {
      var $step = $(this);

      $step.removeClass('active completed disabled');

      if (index < self.currentStep) {
        $step.addClass('completed link');
      } else if (index === self.currentStep) {
        $step.addClass('active');
        $step.removeClass('link');
      } else {
        $step.addClass('disabled');
      }
    });

    // Update content visibility
    $('.step-content').hide();
    $('.step-content[data-content="' + this.currentStep + '"]').show();

    // Update button states
    $('#prev-btn').toggleClass('disabled', this.currentStep === 0);

    if (this.currentStep === this.totalSteps - 1) {
      $('#next-btn').text('Complete');
    } else {
      $('#next-btn').text('Next');
    }
  }
};

// Initialize on DOM ready
$(document).ready(function() {
  StepManager.init();
});
```

### Validation-Based Progression

```javascript
var WizardValidator = {
  currentStep: 0,

  nextStep: function() {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.updateSteps();
    } else {
      this.showValidationErrors();
    }
  },

  validateCurrentStep: function() {
    var $currentForm = $('.step-content:visible form');

    // Use Semantic UI form validation
    var isValid = $currentForm.form('is valid');

    return isValid;
  },

  showValidationErrors: function() {
    $('.step-content:visible form').form('validate form');
  },

  updateSteps: function() {
    // Same as StepManager.updateSteps()
  }
};
```

### Async Step Loading

```javascript
var AsyncStepManager = {
  currentStep: 0,

  nextStep: function() {
    var self = this;
    var $activeStep = $('.step.active');

    // Show loading state
    $activeStep.addClass('loading');
    $activeStep.find('.icon').addClass('spinner loading');

    // Simulate async operation (API call, etc.)
    $.ajax({
      url: '/api/save-step',
      method: 'POST',
      data: this.getStepData(),
      success: function() {
        self.currentStep++;
        self.updateSteps();
      },
      error: function() {
        self.showError();
      },
      complete: function() {
        $activeStep.removeClass('loading');
        $activeStep.find('.icon').removeClass('spinner loading');
      }
    });
  },

  getStepData: function() {
    return $('.step-content:visible form').serialize();
  },

  showError: function() {
    $('.ui.error.message').show();
  }
};
```

## Accessibility

### Keyboard Navigation

```html
<!-- Add role and aria attributes -->
<nav class="ui steps" role="navigation" aria-label="Progress">
  <a class="completed step"
     href="#step1"
     role="button"
     aria-current="false"
     aria-label="Step 1: Shipping - Completed">
    <i class="check icon" aria-hidden="true"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose your shipping options</div>
    </div>
  </a>
  <div class="active step"
       role="button"
       aria-current="step"
       aria-label="Step 2: Billing - Current step">
    <i class="payment icon" aria-hidden="true"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter billing information</div>
    </div>
  </div>
  <div class="disabled step"
       role="button"
       aria-disabled="true"
       aria-label="Step 3: Confirm Order - Not available">
    <i class="info icon" aria-hidden="true"></i>
    <div class="content">
      <div class="title">Confirm Order</div>
      <div class="description">Verify order details</div>
    </div>
  </div>
</nav>
```

**ARIA Attributes:**
- `role="navigation"` - Identifies as navigation landmark
- `aria-label` - Provides context for screen readers
- `aria-current="step"` - Identifies current step
- `aria-disabled="true"` - Indicates disabled state
- `aria-hidden="true"` - Hides decorative icons

### Screen Reader Support

```javascript
// Announce step changes
function announceStepChange(stepIndex, stepTitle, stepState) {
  var announcement = 'Step ' + (stepIndex + 1) + ': ' + stepTitle;

  if (stepState === 'completed') {
    announcement += ' - Completed';
  } else if (stepState === 'active') {
    announcement += ' - Current step';
  } else if (stepState === 'disabled') {
    announcement += ' - Not available';
  }

  // Create live region announcement
  var $announcer = $('#step-announcer');
  if ($announcer.length === 0) {
    $announcer = $('<div id="step-announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>');
    $('body').append($announcer);
  }

  $announcer.text(announcement);
}
```

### Semantic HTML

```html
<!-- Use semantic elements -->
<nav aria-label="Checkout process">
  <ol class="ui ordered steps">
    <li class="completed step">
      <a href="#shipping">
        <i class="check icon" aria-hidden="true"></i>
        <div class="content">
          <div class="title">Shipping</div>
        </div>
      </a>
    </li>
    <li class="active step" aria-current="step">
      <i class="payment icon" aria-hidden="true"></i>
      <div class="content">
        <div class="title">Billing</div>
      </div>
    </li>
    <li class="disabled step">
      <i class="info icon" aria-hidden="true"></i>
      <div class="content">
        <div class="title">Confirm</div>
      </div>
    </li>
  </ol>
</nav>
```

### Focus Management

```javascript
// Ensure proper focus handling
function focusStep(stepIndex) {
  var $step = $('.ui.steps .step').eq(stepIndex);

  if ($step.is('a')) {
    $step.focus();
  } else {
    // If not naturally focusable, add tabindex
    $step.attr('tabindex', '-1').focus();
  }
}

// Keyboard navigation
$('.ui.steps').on('keydown', '.step', function(e) {
  var $steps = $('.ui.steps .step');
  var currentIndex = $steps.index(this);

  switch(e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      if (currentIndex < $steps.length - 1) {
        focusStep(currentIndex + 1);
      }
      break;

    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex > 0) {
        focusStep(currentIndex - 1);
      }
      break;

    case 'Home':
      e.preventDefault();
      focusStep(0);
      break;

    case 'End':
      e.preventDefault();
      focusStep($steps.length - 1);
      break;
  }
});
```

## Integration Patterns

### Integration with Forms

```html
<div class="ui top attached steps">
  <div class="completed step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Account</div>
    </div>
  </div>
  <div class="active step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Profile</div>
    </div>
  </div>
  <div class="step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Complete</div>
    </div>
  </div>
</div>

<form class="ui attached form segment">
  <h4 class="ui dividing header">Profile Information</h4>

  <div class="field">
    <label>First Name</label>
    <input type="text" name="first-name" placeholder="First Name">
  </div>

  <div class="field">
    <label>Last Name</label>
    <input type="text" name="last-name" placeholder="Last Name">
  </div>

  <div class="field">
    <label>Bio</label>
    <textarea name="bio"></textarea>
  </div>
</form>

<div class="ui bottom attached segment">
  <div class="ui buttons">
    <button class="ui button">Back</button>
    <button class="ui primary button">Continue</button>
  </div>
</div>
```

### Integration with Progress Bar

```html
<div class="ui steps">
  <div class="completed step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Step 1</div>
    </div>
  </div>
  <div class="active step">
    <i class="spinner loading icon"></i>
    <div class="content">
      <div class="title">Step 2</div>
    </div>
  </div>
  <div class="step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Step 3</div>
    </div>
  </div>
</div>

<div class="ui indicating progress" data-percent="50" id="step-progress">
  <div class="bar">
    <div class="progress">50%</div>
  </div>
  <div class="label">Step 2 of 3</div>
</div>

<script>
$('#step-progress').progress({
  percent: 50,
  text: {
    active: 'Step {value} of {total}',
    success: 'All steps completed!'
  }
});
</script>
```

### Integration with Tabs

```html
<div class="ui top attached tabular menu">
  <div class="ui ordered steps" style="border-bottom: none; margin-bottom: 0;">
    <a class="completed step" data-tab="shipping">
      <div class="content">
        <div class="title">Shipping</div>
      </div>
    </a>
    <a class="active step" data-tab="billing">
      <div class="content">
        <div class="title">Billing</div>
      </div>
    </a>
    <a class="disabled step" data-tab="confirm">
      <div class="content">
        <div class="title">Confirm</div>
      </div>
    </a>
  </div>
</div>

<div class="ui bottom attached tab segment" data-tab="shipping">
  Shipping content
</div>

<div class="ui bottom attached active tab segment" data-tab="billing">
  Billing content
</div>

<div class="ui bottom attached tab segment" data-tab="confirm">
  Confirmation content
</div>
```

### Integration with Modal

```html
<div class="ui modal">
  <div class="header">
    Setup Wizard
  </div>
  <div class="content">
    <div class="ui three steps">
      <div class="completed step">
        <i class="check icon"></i>
        <div class="content">
          <div class="title">Welcome</div>
        </div>
      </div>
      <div class="active step">
        <i class="cog icon"></i>
        <div class="content">
          <div class="title">Configuration</div>
        </div>
      </div>
      <div class="step">
        <i class="check icon"></i>
        <div class="content">
          <div class="title">Complete</div>
        </div>
      </div>
    </div>

    <div class="ui segment">
      <!-- Step content -->
    </div>
  </div>
  <div class="actions">
    <div class="ui cancel button">Back</div>
    <div class="ui primary approve button">Next</div>
  </div>
</div>
```

## Advanced Patterns

### Multi-Branch Steps

Steps with conditional paths:

```html
<div class="ui steps">
  <div class="completed step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Create Account</div>
    </div>
  </div>
  <div class="active step">
    <i class="question icon"></i>
    <div class="content">
      <div class="title">Account Type</div>
      <div class="description">Personal or Business?</div>
    </div>
  </div>
</div>

<!-- Conditional next steps based on account type selection -->
<div class="personal-path" style="display: none;">
  <div class="ui steps">
    <div class="step">
      <i class="address card icon"></i>
      <div class="content">
        <div class="title">Personal Info</div>
      </div>
    </div>
    <div class="step">
      <i class="check icon"></i>
      <div class="content">
        <div class="title">Complete</div>
      </div>
    </div>
  </div>
</div>

<div class="business-path" style="display: none;">
  <div class="ui steps">
    <div class="step">
      <i class="building icon"></i>
      <div class="content">
        <div class="title">Company Details</div>
      </div>
    </div>
    <div class="step">
      <i class="file alternate icon"></i>
      <div class="content">
        <div class="title">Business Verification</div>
      </div>
    </div>
    <div class="step">
      <i class="check icon"></i>
      <div class="content">
        <div class="title">Complete</div>
      </div>
    </div>
  </div>
</div>
```

### Nested Sub-Steps

```html
<div class="ui steps">
  <div class="completed step">
    <i class="user icon"></i>
    <div class="content">
      <div class="title">Personal Information</div>
    </div>
  </div>
  <div class="active step">
    <i class="address card icon"></i>
    <div class="content">
      <div class="title">Address Details</div>
      <div class="description">
        <div class="ui mini steps" style="margin-top: 0.5em;">
          <div class="completed mini step">Billing</div>
          <div class="active mini step">Shipping</div>
        </div>
      </div>
    </div>
  </div>
  <div class="step">
    <i class="check icon"></i>
    <div class="content">
      <div class="title">Complete</div>
    </div>
  </div>
</div>
```

### Dynamic Step Generation

```javascript
var DynamicSteps = {
  steps: [
    { title: 'Personal Info', icon: 'user', description: 'Basic information' },
    { title: 'Preferences', icon: 'cog', description: 'Your preferences' },
    { title: 'Review', icon: 'check', description: 'Review and submit' }
  ],

  currentStep: 0,

  renderSteps: function() {
    var $container = $('.ui.steps');
    $container.empty();

    this.steps.forEach((step, index) => {
      var classes = ['step'];

      if (index < this.currentStep) {
        classes.push('completed', 'link');
      } else if (index === this.currentStep) {
        classes.push('active');
      } else {
        classes.push('disabled');
      }

      var $step = $('<div>')
        .addClass(classes.join(' '))
        .attr('data-step', index)
        .html(`
          <i class="${step.icon} icon"></i>
          <div class="content">
            <div class="title">${step.title}</div>
            <div class="description">${step.description}</div>
          </div>
        `);

      $container.append($step);
    });

    this.bindStepClicks();
  },

  addStep: function(step) {
    this.steps.push(step);
    this.renderSteps();
  },

  removeStep: function(index) {
    this.steps.splice(index, 1);
    if (this.currentStep >= this.steps.length) {
      this.currentStep = this.steps.length - 1;
    }
    this.renderSteps();
  },

  bindStepClicks: function() {
    var self = this;
    $('.ui.steps .link.step').on('click', function() {
      var stepIndex = $(this).data('step');
      self.goToStep(stepIndex);
    });
  },

  goToStep: function(index) {
    this.currentStep = index;
    this.renderSteps();
  }
};

// Initialize
DynamicSteps.renderSteps();
```

### Progress Persistence

```javascript
var ProgressStorage = {
  storageKey: 'wizard-progress',

  saveProgress: function(stepIndex, formData) {
    var progress = {
      currentStep: stepIndex,
      formData: formData,
      timestamp: Date.now()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  },

  loadProgress: function() {
    var stored = localStorage.getItem(this.storageKey);

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored progress:', e);
        return null;
      }
    }

    return null;
  },

  clearProgress: function() {
    localStorage.removeItem(this.storageKey);
  },

  restoreProgress: function() {
    var progress = this.loadProgress();

    if (progress) {
      // Check if progress is recent (within 24 hours)
      var age = Date.now() - progress.timestamp;
      var oneDayMs = 24 * 60 * 60 * 1000;

      if (age < oneDayMs) {
        // Restore step
        StepManager.goToStep(progress.currentStep);

        // Restore form data
        $.each(progress.formData, function(name, value) {
          $('[name="' + name + '"]').val(value);
        });

        return true;
      }
    }

    return false;
  }
};

// Auto-save on step change
$(document).on('step:change', function(e, stepIndex) {
  var formData = {};

  $('.step-content form').each(function() {
    var data = $(this).serializeArray();
    $.each(data, function() {
      formData[this.name] = this.value;
    });
  });

  ProgressStorage.saveProgress(stepIndex, formData);
});

// Restore on page load
$(document).ready(function() {
  var restored = ProgressStorage.restoreProgress();

  if (restored) {
    $('.ui.info.message')
      .html('Your progress has been restored.')
      .show();
  }
});
```

## Notes

### Browser Compatibility

Semantic UI Step component works across all modern browsers:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

**IE11 Support**: Requires polyfills for:
- CSS Flexbox (partial support)
- CSS Variables (not supported)

### Performance Considerations

**Rendering:**
- Steps are rendered with CSS only (no JavaScript required for display)
- State changes involve simple class manipulation
- Minimal reflow/repaint

**Large Number of Steps:**
- Consider using scrolling for 8+ steps
- Vertical orientation better for many steps
- Stackable/responsive behavior for mobile

### Common Use Cases

1. **Checkout Process** - Shopping cart → Shipping → Payment → Confirmation
2. **User Onboarding** - Welcome → Profile → Preferences → Complete
3. **Account Setup** - Create Account → Verify Email → Add Info → Finish
4. **Form Wizard** - Multi-page form with validation at each step
5. **Process Tracking** - Order status, delivery tracking
6. **Tutorial/Tour** - Step-by-step instructions
7. **Configuration Wizard** - Software/service setup

### Design Best Practices

**Step Count:**
- **Ideal**: 3-5 steps
- **Maximum**: 7 steps horizontally
- **More than 7**: Use vertical layout or group related steps

**Content:**
- Keep titles concise (2-3 words)
- Use descriptions for clarity (optional but helpful)
- Choose meaningful icons that represent the step

**States:**
- Always mark completed steps
- Clearly indicate active/current step
- Show disabled/future steps
- Consider allowing backward navigation

**Responsive:**
- Use stackable for mobile-friendly design
- Test on various screen sizes
- Consider vertical layout for narrow containers

### jQuery API Limitations

Unlike other Semantic UI components (Dropdown, Modal, etc.), the Step component has **no jQuery behavior module**. It's purely visual/CSS-based.

**This means:**
- No `.step('method')` API
- State management is manual (add/remove classes)
- Navigation logic must be implemented by developer
- No built-in events or callbacks

**Typical Implementation Pattern:**
```javascript
// Manual state management required
function setActiveStep(stepIndex) {
  $('.ui.steps .step')
    .removeClass('active completed')
    .eq(stepIndex)
    .addClass('active')
    .prevAll()
    .addClass('completed');
}
```

### Framework Integration

**React Example:**
```jsx
const Step = ({ icon, title, description, state }) => (
  <div className={`step ${state}`}>
    {icon && <i className={`${icon} icon`} />}
    <div className="content">
      <div className="title">{title}</div>
      {description && <div className="description">{description}</div>}
    </div>
  </div>
);

const Steps = ({ currentStep, steps }) => (
  <div className="ui ordered steps">
    {steps.map((step, index) => (
      <Step
        key={index}
        {...step}
        state={
          index < currentStep ? 'completed' :
          index === currentStep ? 'active' :
          'disabled'
        }
      />
    ))}
  </div>
);
```

**Vue Example:**
```vue
<template>
  <div class="ui ordered steps">
    <div
      v-for="(step, index) in steps"
      :key="index"
      :class="getStepClass(index)"
      class="step"
    >
      <i v-if="step.icon" :class="`${step.icon} icon`"></i>
      <div class="content">
        <div class="title">{{ step.title }}</div>
        <div v-if="step.description" class="description">
          {{ step.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: Array,
    currentStep: Number
  },
  methods: {
    getStepClass(index) {
      if (index < this.currentStep) return 'completed';
      if (index === this.currentStep) return 'active';
      return 'disabled';
    }
  }
};
</script>
```

### Migration to Web Components

**Recommended Approach:**

Create a `<ui-step>` and `<ui-steps>` pair:

```html
<!-- Modern web component approach -->
<ui-steps current="1">
  <ui-step icon="truck" title="Shipping" description="Choose options">
  </ui-step>
  <ui-step icon="payment" title="Billing" description="Payment details">
  </ui-step>
  <ui-step icon="check" title="Confirm" description="Review order">
  </ui-step>
</ui-steps>
```

**Benefits over classic approach:**
- Automatic state management
- Built-in events (`step-change`, `step-complete`)
- Reactive properties
- Better encapsulation
- Progressive enhancement

### Accessibility Enhancements Needed

Semantic UI Classic Steps have minimal built-in accessibility. For WCAG compliance, add:

1. **ARIA roles**: `role="navigation"`, `role="list"`, `role="listitem"`
2. **ARIA attributes**: `aria-current="step"`, `aria-label`, `aria-disabled`
3. **Keyboard navigation**: Arrow keys, Home/End
4. **Focus management**: Visible focus indicators, logical tab order
5. **Screen reader announcements**: Live regions for step changes
6. **Semantic HTML**: Use `<nav>`, `<ol>`, `<li>` when appropriate

### Related Components

- **Breadcrumb** - Similar navigation concept, but for hierarchical paths
- **Menu** - Can be used for step-like navigation
- **Progress** - Shows completion percentage
- **Tab** - Alternative for switching between content sections
- **Timeline** - Chronological event display

### Comparison with Modern Frameworks

| Feature | Semantic UI | Modern Frameworks |
|---------|-------------|-------------------|
| **State Management** | Manual | Built-in reactive |
| **Events** | None (CSS only) | Custom events |
| **Keyboard Nav** | None | Built-in |
| **ARIA** | Minimal | Comprehensive |
| **API** | CSS classes only | Properties + methods |
| **Orientation** | CSS classes | Attribute/property |
| **Clickable Steps** | Manual handlers | Built-in navigation |
| **Validation** | Separate implementation | Integrated |

## Summary

The Semantic UI Step component is a **purely visual, CSS-driven component** for displaying sequential workflows. Unlike other Semantic UI modules, it has no jQuery behavior API and requires manual JavaScript for interactivity.

**Strengths:**
- Simple, clean visual design
- Flexible content structure (icons, titles, descriptions)
- Multiple orientation and size options
- Responsive stackable behavior
- Easy to understand class-based API

**Limitations:**
- No built-in state management
- No JavaScript API or methods
- Limited accessibility features
- Manual implementation of navigation logic
- No validation integration

**Best For:**
- Multi-step forms and wizards
- Progress tracking displays
- Sequential process visualization
- Onboarding flows

**Key Insight for Web Components:**
The Step component is an ideal candidate for web component enhancement. A modern `<ui-steps>` implementation should add:
- Reactive state management
- Built-in navigation methods
- Custom events for step changes
- Comprehensive ARIA support
- Keyboard navigation
- Validation hooks
- Progress persistence options

This would transform the purely visual classic component into a full-featured, accessible, interactive step navigation system while maintaining the familiar visual design and class-based styling approach.
