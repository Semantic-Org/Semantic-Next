# Semantic UI - Progress Module

## Component Overview

The Progress component displays the current progress of a task or workflow, providing visual feedback to users through animated bars, percentage values, and state indicators. It communicates the completion status of ongoing operations, helping reduce user uncertainty during long-running processes.

**Primary Use Cases:**
- File uploads and downloads
- Multi-step form progression
- Loading states for asynchronous operations
- Task completion tracking
- Installation or setup progress
- Data processing operations
- Workflow advancement indicators

---

## Usage Patterns

### Basic Usage

The most simple implementation of a progress bar displays a fill bar with a label:

```html
<div class="ui progress">
  <div class="bar"></div>
  <div class="label">Loading</div>
</div>
```

JavaScript initialization:

```javascript
$('#example').progress({ percent: 22 });
```

**Key Points:**
- The `.bar` element represents the filled portion
- The `.label` contains optional text content
- JavaScript API provides methods to update state dynamically

---

### Variants/Styles

#### Standard Progress Bar
The default horizontal progress bar representation:

```html
<div class="ui progress" data-percent="60">
  <div class="bar"></div>
  <div class="label">60% Complete</div>
</div>
```

#### Indicating Progress
Progress bar that indicates a specific semantic meaning:

```html
<div class="ui indicating progress" data-percent="30">
  <div class="bar"></div>
  <div class="label">{percent}% Complete</div>
</div>
```

#### Colored Progress
Use semantic color classes to indicate status:

```html
<!-- Primary (default) -->
<div class="ui progress" data-percent="50">
  <div class="bar"></div>
</div>

<!-- Secondary -->
<div class="ui secondary progress" data-percent="50">
  <div class="bar"></div>
</div>
```

#### Inverted Progress
Progress bar styled for dark backgrounds:

```html
<div class="ui inverted segment">
  <div class="ui inverted progress" data-percent="75">
    <div class="bar"></div>
    <div class="label">Loading...</div>
  </div>
</div>
```

---

### States

#### Active (Indeterminate) State
Displays continuous animation when progress duration is unknown:

```html
<div class="ui active progress">
  <div class="bar"></div>
  <div class="label">Loading...</div>
</div>
```

JavaScript trigger:

```javascript
$('#progress').progress({ active: true });
```

#### Success State
Indicates that a task has completed successfully:

```html
<div class="ui success progress" data-percent="100">
  <div class="bar" style="width: 100%"></div>
  <div class="label">Task Complete</div>
</div>
```

JavaScript trigger:

```javascript
$('#progress').progress('complete');
```

#### Warning State
Signals potential issues or slow progress:

```html
<div class="ui warning progress" data-percent="45">
  <div class="bar"></div>
  <div class="label">Slow Progress</div>
</div>
```

#### Error State
Indicates failure or a problem with the operation:

```html
<div class="ui error progress" data-percent="45">
  <div class="bar"></div>
  <div class="label">Error Occurred</div>
</div>
```

JavaScript trigger:

```javascript
$('#progress').progress('reset');
```

#### Disabled State
Makes the progress component non-interactive:

```html
<div class="ui disabled progress" data-percent="50">
  <div class="bar"></div>
  <div class="label">Disabled</div>
</div>
```

---

### Sizing Options

#### Tiny Progress
```html
<div class="ui tiny progress" data-percent="40">
  <div class="bar"></div>
</div>
```

#### Small Progress
```html
<div class="ui small progress" data-percent="40">
  <div class="bar"></div>
</div>
```

#### Medium Progress (Default)
```html
<div class="ui progress" data-percent="40">
  <div class="bar"></div>
</div>
```

#### Large Progress
```html
<div class="ui large progress" data-percent="40">
  <div class="bar"></div>
</div>
```

#### Big Progress
```html
<div class="ui big progress" data-percent="40">
  <div class="bar"></div>
</div>
```

**Size Classes Available:** `tiny`, `small`, `large`, `big`

---

### Layout & Positioning

#### Attached Progress (Top)
Progress bar attached above a container:

```html
<div class="ui attached progress" data-percent="50">
  <div class="bar"></div>
</div>
<div class="ui attached segment">
  Content below progress bar
</div>
```

#### Attached Progress (Bottom)
Progress bar attached below a container:

```html
<div class="ui attached segment">
  Content above progress bar
</div>
<div class="ui bottom attached progress" data-percent="50">
  <div class="bar"></div>
</div>
```

#### Inline Progress
Progress bar embedded within content flow:

```html
<p>
  Download progress:
  <div class="ui inline progress" data-percent="75">
    <div class="bar"></div>
  </div>
</p>
```

---

### Content & Structure

#### Progress with Percentage Label
Display dynamic percentage using template variables:

```html
<div class="ui progress" data-percent="60">
  <div class="bar"></div>
  <div class="label">{percent}% Complete</div>
</div>
```

#### Progress with Custom Template Variables
Semantic UI supports special template variables that auto-update:

| Variable | Description |
|----------|-------------|
| `{percent}` | Current percentage value |
| `{value}` | Current absolute value |
| `{total}` | Total value target |
| `{left}` | Remaining amount to complete |

```html
<div class="ui progress" data-percent="60">
  <div class="bar"></div>
  <div class="label">{value} of {total} items processed</div>
</div>
```

Programmatic usage:

```javascript
$('#progress').progress({
  percent: 60,
  total: 100,
  value: 60
});
```

#### Progress with Text Label Only
Simple text indicator without percentage:

```html
<div class="ui progress">
  <div class="bar"></div>
  <div class="label">Uploading file...</div>
</div>
```

#### Segmented Progress
Show progress as individual segments or steps:

```html
<div class="ui progress" data-percent="66">
  <div class="bar">
    <div class="progress"></div>
  </div>
</div>
```

---

### Interactive Features

#### Auto-Success Behavior
Automatically mark progress as complete when reaching 100%:

```javascript
$('#progress').progress({
  percent: 0,
  autoSuccess: true
});
```

#### Polling and Auto-Update
Continuously update progress from a server endpoint:

```javascript
$('#progress').progress({
  percent: 0,
  autoSuccess: false,
  showProgress: true,
  metadata: {
    currentValue: 0,
    totalValue: 100
  }
});

// Update progress incrementally
$('#progress').progress('increment', 10);
$('#progress').progress('increment', 10);
```

#### Programmatic State Changes
Update progress state via JavaScript API:

```javascript
const progress = $('#progress');

// Set to specific percent
progress.progress('set progress', 75);

// Increment by amount
progress.progress('increment', 10);

// Set label text
progress.progress('set label', 'Processing items...');

// Complete progress
progress.progress('complete');

// Reset to initial state
progress.progress('reset');
```

#### Event Callbacks
Execute custom logic when progress state changes:

```javascript
$('#progress').progress({
  percent: 0,
  onSuccess: function() {
    console.log('Progress completed successfully');
  },
  onChange: function(percent) {
    console.log('Progress updated to: ' + percent + '%');
  }
});
```

---

### Animation & Transitions

#### Active Animation
The active state provides continuous smooth animation:

```html
<div class="ui active progress">
  <div class="bar"></div>
</div>
```

**Animation Characteristics:**
- Smooth bar fill animation
- Continuous cycling for indeterminate state
- Indicates ongoing work without showing specific progress

#### State Transition Animation
Progress bar animates when transitioning between states:

```javascript
// Smooth transition to success state
$('#progress').progress('set success');
```

#### Custom Animation Speed
Control animation timing via CSS:

```css
.ui.progress .bar {
  transition: width 0.6s ease;
}

.ui.progress.active .bar {
  animation: progress-animation 2s ease-in-out infinite;
}
```

---

### Integration Patterns

#### AJAX-Based Progress
Update progress from asynchronous HTTP requests:

```javascript
let currentProgress = 0;

$.ajax({
  url: '/api/upload',
  type: 'POST',
  xhr: function() {
    const xhr = new window.XMLHttpRequest();

    // Monitor upload progress
    xhr.upload.addEventListener('progress', function(e) {
      if (e.lengthComputable) {
        currentProgress = (e.loaded / e.total) * 100;
        $('#progress').progress('set progress', Math.round(currentProgress));
      }
    }, false);

    return xhr;
  },
  success: function() {
    $('#progress').progress('set success');
  },
  error: function() {
    $('#progress').progress('set error');
  }
});
```

#### File Upload Progress
Track file upload with visual feedback:

```html
<form id="upload-form">
  <input type="file" id="file-input">
  <button type="submit">Upload</button>
</form>

<div class="ui progress" id="upload-progress">
  <div class="bar"></div>
  <div class="label">{percent}% uploaded</div>
</div>
```

```javascript
$('#upload-form').on('submit', function(e) {
  e.preventDefault();

  const file = $('#file-input')[0].files[0];
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', function(e) {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      $('#upload-progress').progress('set progress', percent);
    }
  });

  xhr.addEventListener('load', function() {
    $('#upload-progress').progress('set success');
  });

  xhr.open('POST', '/upload');
  xhr.send(formData);
});
```

#### Multi-Step Process Tracking
Update progress as user completes form steps:

```javascript
function completeStep(stepNumber, totalSteps) {
  const percent = (stepNumber / totalSteps) * 100;
  $('#progress').progress('set progress', percent);

  if (stepNumber === totalSteps) {
    $('#progress').progress('set success');
  }
}

// User completes step 1 of 4
completeStep(1, 4); // 25%

// User completes step 2 of 4
completeStep(2, 4); // 50%

// User completes step 4 of 4
completeStep(4, 4); // 100% + success state
```

#### Background Task Polling
Poll server endpoint to update progress:

```javascript
function pollProgress(taskId) {
  const poll = setInterval(function() {
    $.ajax({
      url: '/api/task/' + taskId + '/progress',
      success: function(data) {
        $('#progress').progress('set progress', data.percent);

        if (data.percent >= 100) {
          $('#progress').progress('set success');
          clearInterval(poll);
        }

        if (data.status === 'error') {
          $('#progress').progress('set error');
          clearInterval(poll);
        }
      }
    });
  }, 500); // Poll every 500ms
}

// Start polling task progress
pollProgress('task-12345');
```

---

### Accessibility Features

#### ARIA Attributes
The progress component should include proper accessibility attributes:

```html
<div class="ui progress"
     role="progressbar"
     aria-valuenow="60"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="File download progress">
  <div class="bar"></div>
  <div class="label">60% Complete</div>
</div>
```

#### Screen Reader Announcements
Ensure progress updates are communicated to assistive technologies:

```javascript
function updateProgress(percent) {
  const progress = $('#progress');

  progress.progress('set progress', percent);

  // Update ARIA attributes for screen readers
  progress.attr('aria-valuenow', percent);

  // Optional: announce updates to screen readers
  if (percent === 100) {
    progress.attr('aria-label', 'Task completed');
  }
}
```

#### Label Association
Always include descriptive labels with progress bars:

```html
<label for="download-progress">Download Progress</label>
<div class="ui progress" id="download-progress">
  <div class="bar"></div>
  <div class="label">{percent}% complete</div>
</div>
```

---

## Key Properties/Props

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `percent` | `number` | `0` | Initial progress percentage (0-100) |
| `value` | `number` | `0` | Current absolute value being tracked |
| `total` | `number` | `100` | Total value target for completion |
| `active` | `boolean` | `false` | Enable continuous indeterminate animation |
| `autoSuccess` | `boolean` | `true` | Automatically mark as success at 100% |
| `showProgress` | `boolean` | `false` | Display numerical percentage in label |
| `preserveWords` | `boolean` | `true` | Preserve label text when updating progress |
| `metadata` | `object` | `{}` | Store additional metadata on component |
| `onSuccess` | `function` | `null` | Callback when progress completes |
| `onChange` | `function` | `null` | Callback on any progress change |
| `onError` | `function` | `null` | Callback when progress encounters error |
| `onWarning` | `function` | `null` | Callback when progress triggers warning |

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.ui.progress` | Base progress component |
| `.active` | Enable continuous animation |
| `.success` | Mark as completed successfully |
| `.error` | Mark as failed/error state |
| `.warning` | Mark as having issues |
| `.disabled` | Disable interaction |
| `.indicating` | Indicate semantic status |
| `.inverted` | Styled for dark backgrounds |
| `.tiny` / `.small` / `.large` / `.big` | Size variants |
| `.attached` | Attach to other elements |
| `.bottom.attached` | Attached to bottom of element |

---

## Code Examples

### Example 1: Basic Progress

```html
<div class="ui progress">
  <div class="bar"></div>
  <div class="label">Loading</div>
</div>
```

```javascript
$('#example').progress({ percent: 22 });
```

**Output:** A progress bar at 22% completion with "Loading" label

---

### Example 2: File Upload with Progress

```html
<form id="upload">
  <input type="file" id="file">
  <button type="submit">Upload File</button>
</form>

<div class="ui progress" id="upload-progress">
  <div class="bar"></div>
  <div class="label">0% uploaded</div>
</div>
```

```javascript
$('#upload').on('submit', function(e) {
  e.preventDefault();

  const file = $('#file')[0].files[0];
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', function(e) {
    const percent = (e.loaded / e.total) * 100;
    $('#upload-progress').progress('set progress', Math.round(percent));
  });

  xhr.onload = function() {
    $('#upload-progress').progress('set success');
  };

  xhr.onerror = function() {
    $('#upload-progress').progress('set error');
  };

  xhr.open('POST', '/api/upload');
  xhr.send(formData);
});
```

---

### Example 3: Indeterminate Progress

```html
<div class="ui active progress">
  <div class="bar"></div>
  <div class="label">Processing data...</div>
</div>
```

```javascript
// Will animate continuously until explicitly stopped
$('#progress').progress({
  active: true
});

// Stop animation and mark complete
setTimeout(function() {
  $('#progress').progress('set success');
}, 5000);
```

---

### Example 4: Multi-Step Form Progress

```html
<div class="ui progress" id="form-progress">
  <div class="bar"></div>
  <div class="label">Step {value} of {total}</div>
</div>

<form>
  <fieldset id="step-1">
    <h3>Step 1: Personal Information</h3>
    <!-- Form fields -->
    <button type="button" onclick="nextStep(2, 4)">Next</button>
  </fieldset>

  <fieldset id="step-2" style="display:none;">
    <h3>Step 2: Address</h3>
    <!-- Form fields -->
    <button type="button" onclick="nextStep(3, 4)">Next</button>
  </fieldset>

  <fieldset id="step-3" style="display:none;">
    <h3>Step 3: Billing</h3>
    <!-- Form fields -->
    <button type="button" onclick="nextStep(4, 4)">Next</button>
  </fieldset>

  <fieldset id="step-4" style="display:none;">
    <h3>Step 4: Review</h3>
    <!-- Form fields -->
    <button type="submit">Complete</button>
  </fieldset>
</form>
```

```javascript
function nextStep(step, total) {
  // Update progress
  $('#form-progress').progress({
    value: step,
    total: total
  });

  // Show current step
  $('fieldset').hide();
  $('#step-' + step).show();

  // Scroll to form
  $('html, body').animate({ scrollTop: 0 }, 'smooth');
}

// Initialize
$('#form-progress').progress({
  value: 1,
  total: 4
});
```

---

### Example 5: Download Progress with Cancel

```html
<div class="ui progress" id="download-progress">
  <div class="bar"></div>
  <div class="label">{percent}% - {value}MB of {total}MB</div>
</div>
<button id="cancel-btn">Cancel Download</button>
```

```javascript
let downloadXhr = null;

function startDownload() {
  downloadXhr = new XMLHttpRequest();

  downloadXhr.addEventListener('progress', function(e) {
    if (e.lengthComputable) {
      const mb = (e.loaded / 1024 / 1024).toFixed(2);
      const totalMb = (e.total / 1024 / 1024).toFixed(2);

      $('#download-progress').progress({
        value: mb,
        total: totalMb,
        percent: Math.round((e.loaded / e.total) * 100)
      });
    }
  });

  downloadXhr.addEventListener('load', function() {
    $('#download-progress').progress('set success');
  });

  downloadXhr.addEventListener('error', function() {
    $('#download-progress').progress('set error');
  });

  downloadXhr.open('GET', '/api/large-file');
  downloadXhr.responseType = 'blob';
  downloadXhr.send();
}

$('#cancel-btn').on('click', function() {
  if (downloadXhr) {
    downloadXhr.abort();
    $('#download-progress').progress('reset');
  }
});

startDownload();
```

---

## Accessibility Notes

### Screen Reader Compatibility
- Always use `role="progressbar"` on the root element
- Update `aria-valuenow` when progress changes
- Provide `aria-label` to describe the progress purpose
- Include `aria-valuemin` (0) and `aria-valuemax` (100)

### Keyboard Interaction
- Progress bars are typically read-only indicators
- No keyboard interaction is expected
- Ensure associated controls (buttons, forms) are keyboard accessible

### Color Contrast
- Progress bar colors must meet WCAG AA contrast requirements
- Use color + text/icon to communicate state (not color alone)
- Success (green) and error (red) convey meaning via label text

### Motion
- Respect `prefers-reduced-motion` preference
- Provide static indicator when animations are disabled
- Use text labels instead of animation for state changes

---

## Common Patterns

### Progress in Modal
Progress bar within a dialog for confirmation of long operations:

```html
<div class="ui modal" id="process-modal">
  <div class="header">Processing Your Request</div>
  <div class="content">
    <p id="status">Initializing...</p>
    <div class="ui progress" id="modal-progress">
      <div class="bar"></div>
      <div class="label">{percent}% complete</div>
    </div>
  </div>
</div>
```

### Progress in Sidebar
Progress indicator in a sidebar for background task tracking:

```html
<div class="ui sidebar">
  <h3>Background Tasks</h3>
  <div class="task">
    <label>Syncing Files</label>
    <div class="ui small progress" data-percent="75">
      <div class="bar"></div>
    </div>
  </div>
</div>
```

### Stacked Progress Bars
Multiple progress bars for tracking different aspects:

```html
<div class="ui segment">
  <h4>Download Progress</h4>
  <div class="ui progress" data-percent="60">
    <div class="bar"></div>
    <div class="label">Overall</div>
  </div>

  <h5>Current File</h5>
  <div class="ui progress" data-percent="85">
    <div class="bar"></div>
    <div class="label">File 3 of 5</div>
  </div>
</div>
```

### Progress with Status Message
Progress bar combined with dynamic status updates:

```html
<div class="ui container">
  <h3>Data Import</h3>
  <p id="status-message">Connecting to server...</p>

  <div class="ui progress" id="import-progress">
    <div class="bar"></div>
    <div class="label">{percent}% complete</div>
  </div>
</div>
```

```javascript
const steps = [
  { label: 'Connecting to server...', time: 2000, percent: 10 },
  { label: 'Authenticating...', time: 4000, percent: 25 },
  { label: 'Downloading data...', time: 8000, percent: 50 },
  { label: 'Processing records...', time: 12000, percent: 75 },
  { label: 'Finalizing import...', time: 14000, percent: 100 }
];

steps.forEach(step => {
  setTimeout(() => {
    $('#status-message').text(step.label);
    $('#import-progress').progress('set progress', step.percent);
  }, step.time);
});

setTimeout(() => {
  $('#import-progress').progress('set success');
  $('#status-message').text('Import completed successfully!');
}, 15000);
```

---

## Related Components

- **[Loader](https://semantic-ui.com/elements/loader.html)** - Spinner indicator for background activity
- **[Dimmer](https://semantic-ui.com/modules/dimmer.html)** - Modal overlay with loading state
- **[Segment](https://semantic-ui.com/elements/segment.html)** - Container for grouping related progress information
- **[Button](https://semantic-ui.com/elements/button.html)** - Trigger progress operations
- **[Form](https://semantic-ui.com/collections/form.html)** - Context for multi-step progress
- **[Modal](https://semantic-ui.com/modules/modal.html)** - Container for progress dialogs
- **[Statistic](https://semantic-ui.com/views/statistic.html)** - Display numerical progress values

---

**Research completed:** 2025-11-05
**Component:** Progress
**Framework:** Semantic UI Classic
**Documentation:** https://semantic-ui.com/modules/progress.html
