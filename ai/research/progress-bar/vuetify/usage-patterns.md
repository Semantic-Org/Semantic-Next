# Vuetify - Progress Components (v-progress-linear & v-progress-circular)

## Component Overview

Vuetify provides two primary progress indicator components:

### v-progress-linear
A linear progress indicator that displays task completion status along a horizontal bar. Used for showing loading states, file uploads, downloads, or any linear progress operation. Supports both determinate (known progress) and indeterminate (unknown progress) modes.

### v-progress-circular
A circular progress indicator that displays task completion status in a circular format. Used for showing loading states, completion percentages, or cyclical progress operations. Also supports both determinate and indeterminate modes with rotation customization.

## Usage Patterns

### Basic Usage

**v-progress-linear - Determinate:**
```vue
<v-progress-linear
  v-model="progress"
  height="25"
  striped
></v-progress-linear>

<script>
export default {
  data() {
    return {
      progress: 65
    }
  }
}
</script>
```

**v-progress-linear - Indeterminate:**
```vue
<v-progress-linear
  indeterminate
  color="primary"
></v-progress-linear>
```

**v-progress-circular - Determinate:**
```vue
<v-progress-circular
  :value="progress"
  color="primary"
></v-progress-circular>

<script>
export default {
  data() {
    return {
      progress: 75
    }
  }
}
</script>
```

**v-progress-circular - Indeterminate:**
```vue
<v-progress-circular
  indeterminate
  color="primary"
></v-progress-circular>
```

### Variants/Styles

#### v-progress-linear Variants:

1. **Determinate** - Shows specific progress value (0-100%)
   - Use `v-model` or `value` prop to control progress
   - Default behavior showing exact progress percentage

2. **Indeterminate** - Animates continuously without specific value
   - Use `indeterminate` prop for true/false
   - Useful when progress amount is unknown

3. **Buffer** - Displays buffered content alongside progress
   - Use `value` for actual progress
   - Use `buffer-value` for buffered/anticipated progress
   - Common in video streaming scenarios

4. **Stream** - Animated streaming state indicator
   - Indicates ongoing data stream activity
   - Continuous animation without direction

5. **Query** - Query/loading state indicator
   - Indicates pending query or search operation
   - Distinguished visual treatment from standard progress

#### v-progress-circular Variants:

1. **Determinate** - Shows specific progress percentage (0-100%)
   - Use `:value` prop to bind progress
   - Displays filled portion of circle

2. **Indeterminate** - Continuous rotation animation
   - Use `indeterminate` prop
   - No specific progress value

3. **Rotate** - Custom rotation starting point
   - Use `rotate` prop to set origin angle
   - Allows customization of circular progress orientation

### States

**v-progress-linear States:**
- **Active/Default** - Normal operating state
- **Indeterminate** - Unknown progress state (continuously animating)
- **Buffering** - Loading ahead of playback/current position
- **Disabled** - Non-interactive disabled state (via CSS or styling)
- **Striped** - Visual striped pattern effect available

**v-progress-circular States:**
- **Active/Default** - Normal operating state
- **Indeterminate** - Unknown progress state (continuously rotating)
- **Disabled** - Non-interactive disabled state

### Sizing Options

**v-progress-linear:**
- `height` prop - Controls bar height (default: 4px or 0.25rem)
  - Example: `height="8"`, `height="25"`
- Default width spans full container width
- Responsive to parent container sizing

**v-progress-circular:**
- `size` prop - Controls overall diameter (default: 40)
  - Example: `size="50"`, `size="100"`
- `width` prop - Controls stroke width (default: 4)
  - Example: `width="2"`, `width="8"`
- Maintains aspect ratio as perfect circle

### Layout & Positioning

**v-progress-linear:**
- Block-level element, takes full container width
- Positioning:
  - Top of container: Standard placement
  - Inline within content: Via flexbox/grid wrapping
  - Absolute positioning: Via custom CSS
- Vertical spacing controlled by parent layout

**v-progress-circular:**
- Inline element, can be positioned within flex/grid
- Centering:
  - `display: flex; justify-content: center; align-items: center;`
  - Often used in centered loading overlay scenarios
- Can be sized absolutely via `size` prop

### Content & Structure

**v-progress-linear:**
- Default slot: Contains hidden/text content (optional)
- No visual text slots; content is inside the bar
- Label text typically placed outside/above component
- Supports striped visual pattern

**v-progress-circular:**
- Default slot: Center content area (optional)
  - Can display percentage text: `{{ progress }}%`
  - Can display icons or custom content
  - Centered by component layout

### Interactive Features

**v-progress-linear:**
- Value binding with `v-model` for reactive updates
- `v-model` syntax: `<v-progress-linear v-model="currentProgress" />`
- Programmatic value updates via data properties
- Change detection on `value` prop changes

**v-progress-circular:**
- Value binding with `v-model` or `:value` prop
- `v-model` for two-way binding
- `:value` for one-way binding (read-only display)
- Rotation point customization via `rotate` prop

### Animation & Transitions

**v-progress-linear:**
- Indeterminate: Smooth continuous horizontal sweep animation
- Determinate: Smooth transition between value changes
- Striped pattern: Optional animated stripes (horizontal movement)
- Animation timing: Built-in CSS transitions (smooth by default)
- No manual animation control props

**v-progress-circular:**
- Indeterminate: Continuous 360-degree rotation animation
- Determinate: Smooth arc transition as value changes
- Rotation origin: Controlled via `rotate` prop (0-360 degrees)
- Animation timing: Built-in CSS transitions
- Easing: Default smooth easing transitions

### Integration Patterns

**Async Operations:**
```vue
<v-progress-linear
  :value="uploadProgress"
  indeterminate
  v-if="isUploading"
></v-progress-linear>

<script>
export default {
  data() {
    return {
      uploadProgress: 0,
      isUploading: false
    }
  },
  methods: {
    uploadFile() {
      this.isUploading = true;
      // Simulate progress updates
      const interval = setInterval(() => {
        this.uploadProgress += Math.random() * 30;
        if (this.uploadProgress >= 100) {
          this.uploadProgress = 100;
          clearInterval(interval);
          this.isUploading = false;
        }
      }, 500);
    }
  }
}
</script>
```

**Loading States:**
```vue
<div v-if="isLoading">
  <v-progress-circular
    indeterminate
    color="primary"
    size="50"
  ></v-progress-circular>
</div>
<div v-else>
  <!-- Content loaded -->
</div>
```

**Data Buffering (Video/Streaming):**
```vue
<v-progress-linear
  :value="currentProgress"
  :buffer-value="bufferedProgress"
  height="8"
></v-progress-linear>
```

### Accessibility Features

**ARIA Attributes (v-progress-linear):**
- `role="progressbar"` - Implicit via component
- `aria-valuenow` - Current progress value (0-100)
- `aria-valuemin` - Minimum value (0)
- `aria-valuemax` - Maximum value (100)
- `aria-label` - Describes progress purpose (optional)

**ARIA Attributes (v-progress-circular):**
- `role="progressbar"` - Implicit via component
- `aria-valuenow` - Current progress value (0-100)
- `aria-valuemin` - Minimum value (0)
- `aria-valuemax` - Maximum value (100)
- `aria-label` - Describes progress purpose (optional)

**Screen Reader Support:**
- Components announce current progress value to screen readers
- Label/description should clarify what is being loaded
- Indeterminate state typically announces "loading" or "in progress"

**Color Contrast:**
- Default colors meet WCAG AA standards
- Custom colors should maintain sufficient contrast ratio
- Text within component (if any) must meet contrast requirements

**Keyboard Accessibility:**
- Components are read-only (no keyboard interaction)
- No tabindex required (non-interactive)
- Progress updates announced via ARIA live regions

## Key Properties/Props

### v-progress-linear Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | Number | - | Two-way binding for progress value (0-100) |
| `value` | Number | 0 | Current progress value (0-100) |
| `buffer-value` | Number | - | Buffered/anticipated progress value (streaming) |
| `height` | Number \| String | 4 | Height of the progress bar in pixels |
| `color` | String | 'primary' | Color of the progress bar |
| `bg-color` | String | - | Background color of the track |
| `indeterminate` | Boolean | false | Continuous animation without specific value |
| `striped` | Boolean | false | Animated striped pattern overlay |
| `rounded` | Boolean \| String | - | Border radius of the bar |
| `stream` | Boolean | false | Streaming animation mode |
| `reverse` | Boolean | false | Reverse animation direction |
| `absolute` | Boolean | false | Absolute positioning |
| `fixed` | Boolean | false | Fixed positioning |

### v-progress-circular Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | Number | - | Two-way binding for progress value (0-100) |
| `value` | Number | 0 | Current progress value (0-100) |
| `size` | Number \| String | 40 | Diameter of the circle in pixels |
| `width` | Number \| String | 4 | Stroke width in pixels |
| `color` | String | 'primary' | Color of the progress arc |
| `bg-color` | String | - | Background circle color |
| `indeterminate` | Boolean | false | Continuous rotation without specific value |
| `rotate` | Number \| String | 0 | Starting angle rotation (0-360 degrees) |
| `rounded` | Boolean | false | Rounded stroke caps |

## Code Examples

### Example 1: Linear Progress - File Upload

```vue
<template>
  <div class="upload-container">
    <h3>Upload Progress</h3>
    <v-progress-linear
      :value="uploadProgress"
      height="8"
      color="success"
      striped
    ></v-progress-linear>
    <p class="mt-2">{{ uploadProgress }}% uploaded</p>
    <v-btn @click="simulateUpload" :disabled="isUploading">
      {{ isUploading ? 'Uploading...' : 'Start Upload' }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadProgress: 0,
      isUploading: false
    }
  },
  methods: {
    simulateUpload() {
      this.isUploading = true;
      this.uploadProgress = 0;

      const interval = setInterval(() => {
        this.uploadProgress += Math.random() * 25;

        if (this.uploadProgress >= 100) {
          this.uploadProgress = 100;
          clearInterval(interval);
          setTimeout(() => {
            this.isUploading = false;
          }, 500);
        }
      }, 300);
    }
  }
}
</script>
```

### Example 2: Circular Progress - Loading Indicator

```vue
<template>
  <div class="loading-container">
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
      size="60"
      width="5"
    ></v-progress-circular>
    <div v-else class="content">
      <p>Content loaded successfully!</p>
    </div>
    <v-btn @click="toggleLoading" class="mt-4">
      Toggle Loading
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    toggleLoading() {
      this.isLoading = !this.isLoading;

      if (this.isLoading) {
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      }
    }
  }
}
</script>
```

### Example 3: Buffer Progress - Video Streaming

```vue
<template>
  <div class="video-container">
    <h3>Video Player</h3>
    <div class="video-placeholder">
      <p>Video content here</p>
    </div>
    <v-progress-linear
      :value="currentTime"
      :buffer-value="bufferedTime"
      height="4"
      color="primary"
      bg-color="rgba(0,0,0,0.1)"
      @click="seekVideo"
    ></v-progress-linear>
    <div class="time-display">
      <span>{{ formatTime(currentTime) }}</span>
      <span class="ml-auto">{{ formatTime(videoDuration) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: 0,
      bufferedTime: 0,
      videoDuration: 240 // 4 minutes in seconds
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    seekVideo(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const percent = (event.clientX - rect.left) / rect.width;
      this.currentTime = Math.round(percent * this.videoDuration);
    }
  },
  mounted() {
    // Simulate video playback
    setInterval(() => {
      if (this.currentTime < this.videoDuration) {
        this.currentTime += 1;
        // Simulate buffering ahead
        if (this.bufferedTime < this.videoDuration) {
          this.bufferedTime = Math.min(
            this.bufferedTime + 2,
            this.videoDuration
          );
        }
      }
    }, 1000);
  }
}
</script>
```

### Example 4: Circular Progress with Center Content

```vue
<template>
  <div class="progress-container">
    <v-progress-circular
      :value="taskProgress"
      size="100"
      width="6"
      color="info"
      bg-color="rgba(0,0,0,0.1)"
    >
      <span class="text-center">
        <div class="font-weight-bold">{{ taskProgress }}%</div>
        <small>Complete</small>
      </span>
    </v-progress-circular>
    <div class="mt-4">
      <v-btn @click="incrementProgress" :disabled="taskProgress >= 100">
        Advance Task
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskProgress: 0
    }
  },
  methods: {
    incrementProgress() {
      this.taskProgress = Math.min(this.taskProgress + 10, 100);
    }
  }
}
</script>
```

## Accessibility Notes

### Implementation Details

1. **ARIA Roles and Attributes:**
   - Vuetify progress components include appropriate `role="progressbar"` attributes
   - `aria-valuenow` reflects current progress (0-100)
   - `aria-valuemin` set to 0, `aria-valuemax` set to 100

2. **Labeling:**
   - Add descriptive text or `aria-label` prop to clarify what is loading
   - Example: `aria-label="File upload progress"`
   - Screen readers announce the purpose and current value

3. **Color Contrast:**
   - Default color combinations meet WCAG AA standards
   - Custom colors should maintain 4.5:1 contrast ratio minimum
   - Do not rely on color alone to communicate state

4. **Keyboard Interaction:**
   - Progress components are non-interactive (read-only)
   - No keyboard focus required
   - Can be used within focusable parent containers

5. **Screen Reader Behavior:**
   - Current value announced to screen readers
   - Indeterminate state typically announced as "loading"
   - Buffer value not typically announced (visual context)

### Recommended Patterns

```vue
<!-- Linear progress with label -->
<div role="region" aria-label="Upload progress">
  <label>Uploading file...</label>
  <v-progress-linear
    v-model="progress"
    aria-label="Upload progress percentage"
    aria-describedby="upload-status"
  ></v-progress-linear>
  <div id="upload-status">{{ progress }}% complete</div>
</div>

<!-- Circular progress with accessible label -->
<div role="region" aria-label="Loading content">
  <v-progress-circular
    indeterminate
    aria-label="Loading content"
    aria-busy="true"
  ></v-progress-circular>
  <div class="sr-only">Loading content, please wait</div>
</div>
```

## Common Patterns

1. **Loading with Overlay:**
   - Progress component centered in modal/overlay
   - Indeterminate state while waiting for data
   - Fade out when content loads

2. **Progress with Status Text:**
   - Display percentage or status text alongside bar
   - Update text based on current phase
   - Example: "Uploading... 45%", "Processing...", "Complete!"

3. **Multi-stage Progress:**
   - Show multiple linear progress bars for different stages
   - Each bar represents one step in process
   - Highlight current/completed/pending stages

4. **Inline Progress Indicators:**
   - Small circular progress inside buttons during submission
   - Indicates loading state while maintaining button space
   - Minimal visual footprint

5. **Determinate vs Indeterminate Toggle:**
   - Start with indeterminate (unknown duration)
   - Switch to determinate when progress amount known
   - Improves UX by providing accurate completion estimate

6. **Streaming/Real-time Progress:**
   - Buffer value shows buffered/cached content
   - Current value shows actual playback position
   - Common in video/audio players

## Related Components

- **v-skeleton-loader** - Placeholder loading state
- **v-spinner** - Alternative loading indicator (Vuetify v2)
- **v-overlay** - Background for loading states
- **v-dialog** - Modal for loading dialogs
- **v-snackbar** - Progress notifications/alerts
- **v-card** - Container for progress information
- **v-btn** - Can display inline loading state

---
Research completed: 2025-11-05
Component: v-progress-linear & v-progress-circular
Framework: Vuetify
Documentation: https://vuetifyjs.com/en/components/progress-linear/ and https://vuetifyjs.com/en/components/progress-circular/
