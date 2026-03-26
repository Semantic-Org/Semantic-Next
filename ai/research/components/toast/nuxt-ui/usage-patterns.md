# Nuxt UI - Toast Component

## Component Overview

The Toast component in Nuxt UI is a succinct message system designed to provide information or feedback to the user. Built on Reka UI's toast foundation, it provides a non-intrusive way to display notifications, confirmations, and alerts. Nuxt UI's Toast implementation is inspired by Sonner, featuring a modern stacked display with hover-to-expand functionality, progress indicators, and a composable-driven API that integrates seamlessly with Vue 3's reactivity system.

Unlike traditional component-based approaches, Nuxt UI Toasts are triggered using the `useToast()` composable, making them accessible from anywhere in your application without prop drilling or complex state management.

---

## Usage Patterns

### Basic Usage

The simplest toast configuration using the composable API:

```vue
<script setup>
const toast = useToast()

function showToast() {
  toast.add({
    title: 'Success',
    description: 'Your changes have been saved.'
  })
}
</script>

<template>
  <UButton @click="showToast">Show Toast</UButton>
</template>
```

### Toast with Icon

Display a toast with an icon for visual context:

```vue
<script setup>
const toast = useToast()

function showSuccess() {
  toast.add({
    title: 'Success',
    description: 'Operation completed successfully',
    icon: 'i-lucide-check-circle'
  })
}

function showError() {
  toast.add({
    title: 'Error',
    description: 'Something went wrong',
    icon: 'i-lucide-alert-circle',
    color: 'error'
  })
}
</script>

<template>
  <div>
    <UButton @click="showSuccess">Show Success</UButton>
    <UButton @click="showError">Show Error</UButton>
  </div>
</template>
```

### Toast with Avatar

Display user-related notifications with an avatar:

```vue
<script setup>
const toast = useToast()

function showInvitation() {
  toast.add({
    title: 'John invited you to join the team',
    description: 'Click to view the invitation',
    avatar: {
      src: 'https://example.com/avatar.jpg',
      alt: 'John Doe'
    }
  })
}
</script>

<template>
  <UButton @click="showInvitation">Show Invitation</UButton>
</template>
```

### Toast with Actions

Add interactive buttons to toasts:

```vue
<script setup>
const toast = useToast()

function showWithActions() {
  toast.add({
    title: 'Error saving document',
    description: 'Your changes could not be saved',
    color: 'error',
    actions: [
      {
        label: 'Retry',
        color: 'error',
        click: (e) => {
          e.stopPropagation()
          // Retry logic here
          console.log('Retrying...')
        }
      },
      {
        label: 'Dismiss',
        variant: 'ghost',
        click: (e) => {
          e.stopPropagation()
          // Dismiss logic
        }
      }
    ]
  })
}
</script>

<template>
  <UButton @click="showWithActions">Show Error with Actions</UButton>
</template>
```

### Calendar Event Example

Complex toast with formatted date content:

```vue
<script setup>
const toast = useToast()

function addCalendarEvent() {
  toast.add({
    title: 'Event scheduled',
    description: 'Meeting added to your calendar for Jan 15, 2025 at 2:00 PM',
    icon: 'i-lucide-calendar',
    color: 'primary'
  })
}
</script>

<template>
  <UButton @click="addCalendarEvent">Add Event</UButton>
</template>
```

---

## Variants/Styles

### Color Variants

Nuxt UI Toast supports multiple color schemes to convey different message types:

```vue
<script setup>
const toast = useToast()

function showNeutral() {
  toast.add({
    title: 'Neutral',
    description: 'This is a neutral message',
    color: 'neutral'
  })
}

function showPrimary() {
  toast.add({
    title: 'Primary',
    description: 'This is a primary message',
    color: 'primary'
  })
}

function showSuccess() {
  toast.add({
    title: 'Success',
    description: 'Operation completed successfully',
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

function showError() {
  toast.add({
    title: 'Error',
    description: 'An error occurred',
    color: 'error',
    icon: 'i-lucide-x-circle'
  })
}

function showWarning() {
  toast.add({
    title: 'Warning',
    description: 'Please review this action',
    color: 'warning',
    icon: 'i-lucide-alert-triangle'
  })
}

function showInfo() {
  toast.add({
    title: 'Info',
    description: 'Here is some information',
    color: 'info',
    icon: 'i-lucide-info'
  })
}
</script>

<template>
  <div class="flex gap-2">
    <UButton @click="showNeutral">Neutral</UButton>
    <UButton @click="showPrimary">Primary</UButton>
    <UButton @click="showSuccess">Success</UButton>
    <UButton @click="showError">Error</UButton>
    <UButton @click="showWarning">Warning</UButton>
    <UButton @click="showInfo">Info</UButton>
  </div>
</template>
```

### Orientation Variants

Control the layout direction of toast content:

```vue
<script setup>
const toast = useToast()

function showHorizontal() {
  toast.add({
    title: 'Horizontal Layout',
    description: 'Icon and content side by side',
    icon: 'i-lucide-layout-grid',
    orientation: 'horizontal'
  })
}

function showVertical() {
  toast.add({
    title: 'Vertical Layout',
    description: 'Icon above content',
    icon: 'i-lucide-layout-list',
    orientation: 'vertical'
  })
}
</script>

<template>
  <div>
    <UButton @click="showHorizontal">Horizontal</UButton>
    <UButton @click="showVertical">Vertical</UButton>
  </div>
</template>
```

### Custom Close Button

Customize or hide the close button:

```vue
<script setup>
const toast = useToast()

function showCustomClose() {
  toast.add({
    title: 'Custom Close Button',
    description: 'This toast has a rounded close button',
    close: {
      color: 'error',
      variant: 'outline',
      rounded: true
    }
  })
}

function showNoClose() {
  toast.add({
    title: 'No Close Button',
    description: 'This toast will auto-dismiss',
    close: false
  })
}

function showCustomIcon() {
  toast.add({
    title: 'Custom Close Icon',
    description: 'Using a different icon for close',
    closeIcon: 'i-lucide-x-square'
  })
}
</script>

<template>
  <div class="flex gap-2">
    <UButton @click="showCustomClose">Custom Close</UButton>
    <UButton @click="showNoClose">No Close</UButton>
    <UButton @click="showCustomIcon">Custom Icon</UButton>
  </div>
</template>
```

---

## States

### With Progress Bar

Display a countdown progress bar:

```vue
<script setup>
const toast = useToast()

function showWithProgress() {
  toast.add({
    title: 'Auto-closing',
    description: 'This toast will close automatically',
    progress: true,
    color: 'primary'
  })
}

function showNoProgress() {
  toast.add({
    title: 'No Progress',
    description: 'This toast has no progress indicator',
    progress: false
  })
}
</script>

<template>
  <div>
    <UButton @click="showWithProgress">With Progress</UButton>
    <UButton @click="showNoProgress">No Progress</UButton>
  </div>
</template>
```

### Duration States

Control how long toasts remain visible:

```vue
<script setup>
const toast = useToast()

// Configure duration globally in App component
// or per toast (if supported in future versions)

function showQuick() {
  toast.add({
    title: 'Quick Message',
    description: 'This disappears quickly'
    // Duration controlled by global config
  })
}

function showLong() {
  toast.add({
    title: 'Long Message',
    description: 'This stays visible longer'
    // Duration controlled by global config
  })
}
</script>

<template>
  <div>
    <UButton @click="showQuick">Quick</UButton>
    <UButton @click="showLong">Long</UButton>
  </div>
</template>
```

### Stacked State with Hover

Toasts stack and expand on hover:

```vue
<script setup>
const toast = useToast()

function showMultiple() {
  toast.add({
    title: 'First Toast',
    description: 'This is the first notification'
  })

  setTimeout(() => {
    toast.add({
      title: 'Second Toast',
      description: 'This is the second notification'
    })
  }, 500)

  setTimeout(() => {
    toast.add({
      title: 'Third Toast',
      description: 'This is the third notification'
    })
  }, 1000)
}
</script>

<template>
  <UButton @click="showMultiple">Show Multiple Toasts</UButton>
  <!-- Hover over toasts to see them expand -->
  <!-- Hovering pauses auto-dismiss timers -->
</template>
```

---

## Positioning Options

### Global Position Configuration

Configure toast position globally in the App component:

```vue
<template>
  <UApp>
    <!-- Configure toast position -->
    <UToaster position="bottom-right" />

    <UContainer>
      <NuxtPage />
    </UContainer>
  </UApp>
</template>
```

Position options include:
- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right` (default)

### Maximum Concurrent Toasts

Limit the number of visible toasts:

```vue
<template>
  <UApp>
    <!-- Show maximum 3 toasts at once -->
    <UToaster :max="3" />

    <UContainer>
      <NuxtPage />
    </UContainer>
  </UApp>
</template>
```

### Expand Behavior

Control whether toasts stack or expand:

```vue
<template>
  <UApp>
    <!-- Disable expand on hover (always show all) -->
    <UToaster :expand="false" />

    <!-- Enable expand on hover (stack when not hovered) -->
    <UToaster :expand="true" />

    <UContainer>
      <NuxtPage />
    </UContainer>
  </UApp>
</template>
```

---

## Content & Structure

### Rich Content with VNode

Use VNodes for complex content:

```vue
<script setup>
import { h } from 'vue'

const toast = useToast()

function showRichContent() {
  toast.add({
    title: h('span', { class: 'font-bold' }, 'Rich Content'),
    description: h('div', [
      h('p', 'This is a paragraph with '),
      h('strong', 'bold text'),
      h('p', 'and multiple elements')
    ])
  })
}
</script>

<template>
  <UButton @click="showRichContent">Show Rich Content</UButton>
</template>
```

### Multi-line Description

Display longer messages with multiple lines:

```vue
<script setup>
const toast = useToast()

function showMultiLine() {
  toast.add({
    title: 'Update Available',
    description: 'A new version of the application is available. Please save your work and restart to update. This may take a few minutes.'
  })
}
</script>

<template>
  <UButton @click="showMultiLine">Show Multi-line</UButton>
</template>
```

### Title Only

Display toasts with just a title:

```vue
<script setup>
const toast = useToast()

function showTitleOnly() {
  toast.add({
    title: 'Copied to clipboard'
  })
}
</script>

<template>
  <UButton @click="showTitleOnly">Show Title Only</UButton>
</template>
```

---

## Interactive Features

### Action Buttons

Multiple action patterns:

```vue
<script setup>
const toast = useToast()

function showRetryAction() {
  toast.add({
    title: 'Upload Failed',
    description: 'Could not upload file',
    color: 'error',
    actions: [
      {
        label: 'Retry',
        color: 'error',
        click: (e) => {
          e.stopPropagation()
          // Retry upload
          toast.add({
            title: 'Retrying upload...',
            color: 'primary'
          })
        }
      }
    ]
  })
}

function showUndoAction() {
  toast.add({
    title: 'Item deleted',
    description: '1 item moved to trash',
    actions: [
      {
        label: 'Undo',
        variant: 'outline',
        click: (e) => {
          e.stopPropagation()
          // Undo deletion
          toast.add({
            title: 'Deletion undone',
            color: 'success'
          })
        }
      }
    ]
  })
}

function showMultipleActions() {
  toast.add({
    title: 'New message received',
    description: 'You have a new message from Sarah',
    actions: [
      {
        label: 'Reply',
        color: 'primary',
        click: (e) => {
          e.stopPropagation()
          // Open reply dialog
        }
      },
      {
        label: 'Mark as Read',
        variant: 'ghost',
        click: (e) => {
          e.stopPropagation()
          // Mark as read
        }
      }
    ]
  })
}
</script>

<template>
  <div class="flex gap-2">
    <UButton @click="showRetryAction">Show Retry</UButton>
    <UButton @click="showUndoAction">Show Undo</UButton>
    <UButton @click="showMultipleActions">Multiple Actions</UButton>
  </div>
</template>
```

### Click Handler

Make entire toast clickable:

```vue
<script setup>
const toast = useToast()

function showClickable() {
  toast.add({
    title: 'New notification',
    description: 'Click to view details',
    // Click handler would be added via wrapper or custom implementation
  })
}
</script>

<template>
  <UButton @click="showClickable">Show Clickable Toast</UButton>
</template>
```

---

## Animation & Transitions

### Default Animations

Nuxt UI Toast includes smooth animations by default:

```vue
<script setup>
const toast = useToast()

function showAnimated() {
  toast.add({
    title: 'Animated Toast',
    description: 'Slides in smoothly with fade effect'
  })
}
</script>

<template>
  <UButton @click="showAnimated">Show Animated Toast</UButton>
</template>
```

Animation features:
- Slide-in animation from position edge
- Fade-in effect
- Smooth height transitions when stacking
- Expand/collapse animation on hover
- Progress bar animation

### Stacking Animation

When multiple toasts appear:

```vue
<script setup>
const toast = useToast()

function showStackAnimation() {
  // Show multiple toasts to see stacking
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      toast.add({
        title: `Toast ${i}`,
        description: `This is notification number ${i}`
      })
    }, i * 300)
  }
}
</script>

<template>
  <UButton @click="showStackAnimation">Show Stack Animation</UButton>
</template>
```

Stacking behavior:
- New toasts push previous ones into stack
- Stack collapses showing only top toast
- Hover expands stack to show all toasts
- Smooth transitions between states

---

## Integration Patterns

### Form Submission Feedback

Provide feedback after form actions:

```vue
<script setup>
const toast = useToast()

async function handleSubmit(formData) {
  try {
    // Submit form
    await submitForm(formData)

    toast.add({
      title: 'Form submitted',
      description: 'Your information has been saved',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Submission failed',
      description: error.message,
      color: 'error',
      icon: 'i-lucide-alert-circle',
      actions: [
        {
          label: 'Retry',
          color: 'error',
          click: () => handleSubmit(formData)
        }
      ]
    })
  }
}
</script>
```

### API Request Status

Show loading and completion states:

```vue
<script setup>
const toast = useToast()

async function fetchData() {
  // Show loading toast
  toast.add({
    title: 'Loading data...',
    color: 'primary',
    progress: false
  })

  try {
    const data = await api.fetch()

    toast.add({
      title: 'Data loaded',
      description: `Loaded ${data.length} items`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Failed to load data',
      description: error.message,
      color: 'error',
      actions: [
        {
          label: 'Retry',
          click: () => fetchData()
        }
      ]
    })
  }
}
</script>
```

### Copy to Clipboard

Confirm copy actions:

```vue
<script setup>
const toast = useToast()

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)

    toast.add({
      title: 'Copied to clipboard',
      icon: 'i-lucide-copy-check',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Copy failed',
      description: 'Please try again',
      color: 'error'
    })
  }
}
</script>

<template>
  <UButton @click="copyToClipboard('Hello World')">Copy Text</UButton>
</template>
```

### Real-time Notifications

Handle incoming notifications:

```vue
<script setup>
const toast = useToast()

// WebSocket or polling for notifications
function handleNotification(notification) {
  toast.add({
    title: notification.title,
    description: notification.message,
    avatar: notification.user?.avatar ? {
      src: notification.user.avatar,
      alt: notification.user.name
    } : undefined,
    actions: [
      {
        label: 'View',
        click: () => navigateTo(`/notifications/${notification.id}`)
      }
    ]
  })
}

onMounted(() => {
  // Subscribe to notifications
  socket.on('notification', handleNotification)
})
</script>
```

### Undo Actions

Provide undo functionality:

```vue
<script setup>
const toast = useToast()

function deleteItem(item) {
  // Delete item
  items.value = items.value.filter(i => i.id !== item.id)

  // Show undo toast
  toast.add({
    title: 'Item deleted',
    description: `"${item.name}" has been removed`,
    actions: [
      {
        label: 'Undo',
        variant: 'outline',
        click: (e) => {
          e.stopPropagation()
          // Restore item
          items.value.push(item)

          toast.add({
            title: 'Item restored',
            color: 'success'
          })
        }
      }
    ]
  })
}
</script>
```

---

## Accessibility Features

### Keyboard Support

Toasts automatically handle keyboard interactions:

| Key | Behavior |
|-----|----------|
| **Escape** | Close focused toast |
| **Tab** | Focus next interactive element (action buttons) |
| **Shift + Tab** | Focus previous interactive element |
| **Enter / Space** | Activate focused action button |

### ARIA Attributes

Nuxt UI automatically applies ARIA attributes:

| Attribute | Purpose | Applied To |
|-----------|---------|------------|
| `role="status"` | Announces non-critical updates | Toast container |
| `role="alert"` | Announces critical messages | Error/warning toasts |
| `aria-live="polite"` | Non-interrupting announcements | Standard toasts |
| `aria-live="assertive"` | Immediate announcements | Error toasts |
| `aria-label` | Describes close button | Close button |

### Screen Reader Support

```vue
<script setup>
const toast = useToast()

function showAccessible() {
  toast.add({
    title: 'Account settings updated',
    description: 'Your changes have been saved and will take effect immediately',
    // Screen readers will announce this message
    color: 'success'
  })
}
</script>
```

Screen reader behavior:
- Title and description are announced together
- Color semantic meaning is conveyed
- Action buttons are announced as interactive
- Progress state changes are announced
- Close action is clearly labeled

### Focus Management

```vue
<script setup>
const toast = useToast()

function showWithActions() {
  toast.add({
    title: 'Confirm action',
    description: 'Are you sure you want to proceed?',
    actions: [
      {
        label: 'Confirm',
        color: 'primary',
        // Focus is managed automatically for buttons
        click: () => {
          // Action logic
        }
      },
      {
        label: 'Cancel',
        variant: 'ghost',
        click: () => {
          // Cancel logic
        }
      }
    ]
  })
}
</script>
```

Focus management features:
- Focus trap within toast when actions present
- Visible focus indicators on all interactive elements
- Return focus to trigger element after close
- Keyboard navigation between action buttons

---

## Key Properties/Props

### useToast() Composable

The `useToast()` composable returns an object with the following method:

| Method | Type | Description |
|--------|------|-------------|
| `add` | `(toast: ToastOptions) => void` | Add a new toast notification |

### ToastOptions Interface

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string \| VNode` | - | Toast heading text or VNode |
| `description` | `string \| VNode` | - | Additional details text or VNode |
| `icon` | `string \| object` | - | Icon identifier (e.g., 'i-lucide-check') |
| `avatar` | `AvatarProps` | - | Avatar configuration object |
| `color` | `'neutral' \| 'primary' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'neutral'` | Visual styling and semantic meaning |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction for content |
| `close` | `ButtonProps \| false` | - | Close button configuration or false to hide |
| `closeIcon` | `string` | `'i-lucide-x'` | Custom close button icon |
| `actions` | `ButtonProps[]` | `[]` | Array of action buttons |
| `progress` | `boolean \| false` | `true` | Show/hide progress bar |
| `as` | `string` | `'li'` | HTML element tag for rendering |

### UToaster Component Props

Global configuration for the toast system:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Screen position for toasts |
| `duration` | `number` | `4000` | Auto-dismiss timeout in milliseconds |
| `max` | `number` | `Infinity` | Maximum concurrent toasts displayed |
| `expand` | `boolean` | `true` | Enable hover-to-expand stacking behavior |

### ButtonProps (for actions and close)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | - | Button text |
| `color` | `string` | - | Button color variant |
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Button style variant |
| `rounded` | `boolean` | `false` | Use rounded button style |
| `click` | `(event: Event) => void` | - | Click handler function |

### AvatarProps

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | `string` | - | Avatar image URL |
| `alt` | `string` | - | Alternative text for avatar |

---

## Code Examples

### Example 1: Notification System

```vue
<script setup>
const toast = useToast()

// Success notification
function notifySuccess(message) {
  toast.add({
    title: 'Success',
    description: message,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

// Error notification
function notifyError(message) {
  toast.add({
    title: 'Error',
    description: message,
    color: 'error',
    icon: 'i-lucide-x-circle'
  })
}

// Info notification
function notifyInfo(message) {
  toast.add({
    title: 'Info',
    description: message,
    color: 'info',
    icon: 'i-lucide-info'
  })
}

// Warning notification
function notifyWarning(message) {
  toast.add({
    title: 'Warning',
    description: message,
    color: 'warning',
    icon: 'i-lucide-alert-triangle'
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <UButton @click="notifySuccess('Operation completed successfully')">
      Success
    </UButton>
    <UButton @click="notifyError('An error occurred')">
      Error
    </UButton>
    <UButton @click="notifyInfo('Here is some information')">
      Info
    </UButton>
    <UButton @click="notifyWarning('Please be careful')">
      Warning
    </UButton>
  </div>
</template>
```

### Example 2: Form Validation Feedback

```vue
<script setup>
const toast = useToast()
const form = ref({
  email: '',
  password: ''
})

async function handleLogin() {
  // Validate
  if (!form.value.email) {
    toast.add({
      title: 'Email required',
      description: 'Please enter your email address',
      color: 'error',
      icon: 'i-lucide-mail-x'
    })
    return
  }

  if (!form.value.password) {
    toast.add({
      title: 'Password required',
      description: 'Please enter your password',
      color: 'error',
      icon: 'i-lucide-lock-keyhole'
    })
    return
  }

  // Submit
  try {
    await login(form.value)

    toast.add({
      title: 'Login successful',
      description: 'Welcome back!',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (error) {
    toast.add({
      title: 'Login failed',
      description: error.message,
      color: 'error',
      icon: 'i-lucide-alert-circle',
      actions: [
        {
          label: 'Forgot Password?',
          variant: 'ghost',
          click: () => navigateTo('/forgot-password')
        }
      ]
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <UInput v-model="form.email" type="email" placeholder="Email" />
    <UInput v-model="form.password" type="password" placeholder="Password" />
    <UButton type="submit">Login</UButton>
  </form>
</template>
```

### Example 3: User Activity Notifications

```vue
<script setup>
const toast = useToast()

// Simulate real-time notifications
function simulateNotifications() {
  // User joined
  setTimeout(() => {
    toast.add({
      title: 'Sarah joined the workspace',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=1',
        alt: 'Sarah'
      },
      actions: [
        {
          label: 'View Profile',
          variant: 'outline',
          click: () => console.log('View profile')
        }
      ]
    })
  }, 1000)

  // Comment added
  setTimeout(() => {
    toast.add({
      title: 'New comment on your post',
      description: 'John commented: "Great work!"',
      avatar: {
        src: 'https://i.pravatar.cc/150?img=2',
        alt: 'John'
      },
      actions: [
        {
          label: 'Reply',
          color: 'primary',
          click: () => console.log('Reply')
        }
      ]
    })
  }, 3000)

  // Task assigned
  setTimeout(() => {
    toast.add({
      title: 'Task assigned to you',
      description: 'Review Q4 presentation slides',
      icon: 'i-lucide-clipboard-check',
      color: 'primary',
      actions: [
        {
          label: 'View Task',
          color: 'primary',
          click: () => console.log('View task')
        }
      ]
    })
  }, 5000)
}
</script>

<template>
  <UButton @click="simulateNotifications">
    Simulate Activity
  </UButton>
</template>
```

### Example 4: File Upload Progress

```vue
<script setup>
const toast = useToast()

async function uploadFile(file) {
  // Show upload starting
  toast.add({
    title: 'Upload started',
    description: `Uploading ${file.name}`,
    icon: 'i-lucide-upload',
    color: 'primary',
    progress: true
  })

  try {
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Show success
    toast.add({
      title: 'Upload complete',
      description: `${file.name} uploaded successfully`,
      icon: 'i-lucide-check-circle',
      color: 'success'
    })
  } catch (error) {
    // Show error with retry
    toast.add({
      title: 'Upload failed',
      description: `Could not upload ${file.name}`,
      icon: 'i-lucide-x-circle',
      color: 'error',
      actions: [
        {
          label: 'Retry',
          color: 'error',
          click: () => uploadFile(file)
        }
      ]
    })
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    uploadFile(file)
  }
}
</script>

<template>
  <div>
    <input type="file" @change="handleFileSelect" />
  </div>
</template>
```

---

## Accessibility Notes

1. **Screen Reader Announcements**: All toasts are announced to screen readers with appropriate urgency levels
2. **Keyboard Navigation**: Full keyboard support for dismissing toasts and interacting with action buttons
3. **Focus Management**: Focus is properly managed when toasts appear and are dismissed
4. **Color Independence**: Toast meaning is conveyed through icons and text, not color alone
5. **Timing Control**: Users can pause auto-dismiss by hovering over toast stack
6. **Interactive Elements**: All buttons have clear labels and are keyboard accessible
7. **Progress Indication**: Visual progress bar provides timing feedback for auto-dismiss
8. **ARIA Roles**: Appropriate roles (status/alert) based on toast urgency level

---

## Common Patterns

### Success/Error Feedback
Providing immediate feedback after user actions

### Undo Operations
Allowing users to reverse recent actions before they're committed

### Form Validation
Displaying validation errors and success messages

### Real-time Notifications
Showing live updates from WebSocket or polling sources

### Copy Confirmation
Confirming clipboard operations

### File Operations
Feedback for upload, download, and file management actions

### API Status Updates
Informing users about loading, success, and error states

### User Activity
Notifying about comments, mentions, and social interactions

---

## Related Components

- **Modal** - For more detailed, blocking user interactions
- **Alert** - For persistent, inline messages within content
- **Notification** - Alternative notification system with different UI patterns
- **Banner** - For site-wide announcements
- **Progress** - For detailed progress tracking
- **Badge** - For status indicators

---

## Implementation Notes

### Composable Architecture
Unlike traditional component-based toasts, Nuxt UI uses the `useToast()` composable, which provides several advantages:
- Accessible from anywhere without prop drilling
- No need to render a component in your template
- Integrates with Vue 3's composition API
- Simpler state management

### Sonner Inspiration
The toast implementation is inspired by Sonner's design:
- Stacked display saves screen space
- Hover-to-expand reveals all notifications
- Hovering pauses auto-dismiss timers
- Modern, clean aesthetic

### Progress Bar Behavior
The progress bar provides visual countdown feedback:
- Automatically starts when toast appears
- Color matches toast color scheme
- Can be disabled per toast
- Pauses when user hovers over toast stack

### VNode Support
Both title and description support VNodes for complex content:
- Allows rich formatting
- Enables custom components
- Provides maximum flexibility
- Maintains type safety with TypeScript

---

Research completed: 2025-11-05
Component: Toast
Framework: Nuxt UI (v4)
Documentation: https://ui.nuxt.com/components/toast
