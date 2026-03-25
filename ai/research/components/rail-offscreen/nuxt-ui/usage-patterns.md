# Nuxt UI Slideover - Usage Patterns

## Component Overview

The Nuxt UI Slideover component is a dialog that slides in from the side (or top/bottom) of the screen. It provides an off-canvas panel for displaying supplementary content, forms, or navigation without fully replacing the current page view. The component features built-in support for overlays, transitions, focus management, and accessibility features including proper ARIA handling and keyboard navigation.

**Key Characteristics:**
- Slides in from a configurable side of the screen
- Supports overlay with customizable styling
- Built-in close button and keyboard navigation
- Content projection with flexible slotting
- Smooth transitions and animations
- Programmatic control via composables

---

## Basic Usage

### Simple Slideover

```vue
<template>
  <UButton @click="isOpen = true">Open Slideover</UButton>

  <USlideover v-model:open="isOpen">
    <div class="p-4">
      <h2>Slideover Content</h2>
      <p>This is the main content of the slideover.</p>
    </div>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
```

### Slideover with Header and Footer

```vue
<template>
  <UButton @click="isOpen = true">Open</UButton>

  <USlideover v-model:open="isOpen">
    <template #header>
      <h2 class="text-lg font-semibold">Slideover Title</h2>
      <p class="text-sm text-gray-500">Optional description</p>
    </template>

    <template #default>
      <div class="p-4">Main content goes here</div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton color="gray" @click="isOpen = false">Cancel</UButton>
        <UButton @click="handleSubmit">Submit</UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function handleSubmit() {
  // Handle submission logic
  isOpen.value = false
}
</script>
```

### Using Title and Description Props

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    title="Settings"
    description="Customize your preferences"
  >
    <!-- Content here -->
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
```

---

## Props/API

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` / `v-model:open` | `boolean` | `false` | Controls the visibility of the slideover |
| `title` | `string` | - | Title displayed in the header |
| `description` | `string` | - | Subtitle/description in the header |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Which side the slideover slides in from |
| `overlay` | `boolean` | `true` | Whether to show a semi-transparent overlay behind the slideover |
| `transition` | `boolean` | `true` | Whether to animate the slideover opening/closing |
| `modal` | `boolean` | `true` | Whether the slideover acts as a modal (blocks interaction with page) |
| `dismissible` | `boolean` | `true` | Whether clicking outside or pressing ESC closes the slideover (v3 prop) |
| `prevent-close` | `boolean` | `false` | Whether to disable outside click and ESC keyboard shortcut (v2 prop) |
| `close-icon` | `string` | `'i-lucide-x'` | Icon name for the close button |
| `close` | `object` | - | Button props to customize the close button appearance |
| `ui` | `object` | `{}` | UI customization object for styling (Tailwind classes) |

### UI Customization Object

```typescript
interface SlideoverUI {
  wrapper?: string      // Outer wrapper classes
  content?: string      // Content container classes
  header?: string       // Header section classes
  body?: string         // Body section classes
  footer?: string       // Footer section classes
  overlay?: string      // Overlay backdrop classes
  title?: string        // Title text classes
  description?: string  // Description text classes
  close?: string        // Close button wrapper classes
}
```

### Width Configuration

Default width configuration: `w-screen max-w-md` (full screen on mobile, max 28rem on larger screens)

Customize width using the `ui` prop:

```vue
<USlideover
  v-model:open="isOpen"
  :ui="{
    width: 'w-[85%] sm:w-full sm:max-w-2xl md:max-w-3xl'
  }"
>
```

---

## Common Patterns

### Pattern 1: Form Submission in Slideover

```vue
<template>
  <UButton @click="isOpen = true">Edit Profile</UButton>

  <USlideover
    v-model:open="isOpen"
    title="Edit Profile"
    description="Update your profile information"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4 p-4">
        <UFormGroup label="Name">
          <UInput v-model="form.name" placeholder="Your name" />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput v-model="form.email" type="email" placeholder="your@email.com" />
        </UFormGroup>

        <UFormGroup label="Bio">
          <UTextarea v-model="form.bio" placeholder="Tell us about yourself" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end p-4">
          <UButton color="gray" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit">Save Changes</UButton>
        </div>
      </template>
    </form>
  </USlideover>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isOpen = ref(false)
const form = reactive({
  name: '',
  email: '',
  bio: ''
})

async function handleSubmit() {
  // Validate and submit form
  try {
    await submitProfile(form)
    isOpen.value = false
  } catch (error) {
    console.error('Failed to save profile:', error)
  }
}
</script>
```

### Pattern 2: Data Display with Actions

```vue
<template>
  <div class="space-y-4">
    <UButton v-for="item in items" :key="item.id" @click="openItem(item)">
      View {{ item.name }}
    </UButton>
  </div>

  <USlideover v-model:open="isOpen">
    <template #header v-if="selectedItem">
      <h2>{{ selectedItem.name }}</h2>
      <p class="text-sm text-gray-500">ID: {{ selectedItem.id }}</p>
    </template>

    <template #default v-if="selectedItem">
      <div class="p-4 space-y-4">
        <div>
          <h3 class="font-semibold text-sm">Description</h3>
          <p>{{ selectedItem.description }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-sm">Created</h3>
          <p>{{ formatDate(selectedItem.createdAt) }}</p>
        </div>

        <div>
          <h3 class="font-semibold text-sm">Status</h3>
          <UBadge>{{ selectedItem.status }}</UBadge>
        </div>
      </div>
    </template>

    <template #footer v-if="selectedItem">
      <div class="flex gap-2">
        <UButton
          color="red"
          variant="ghost"
          @click="handleDelete(selectedItem.id)"
        >
          Delete
        </UButton>
        <UButton @click="isOpen = false">Close</UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Item 1', description: 'Description...', status: 'Active', createdAt: new Date() },
  // More items...
])

const isOpen = ref(false)
const selectedItem = ref(null)

function openItem(item) {
  selectedItem.value = item
  isOpen.value = true
}

async function handleDelete(id) {
  if (confirm('Are you sure?')) {
    await deleteItem(id)
    items.value = items.value.filter(item => item.id !== id)
    isOpen.value = false
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}
</script>
```

### Pattern 3: Navigation in Slideover

```vue
<template>
  <UButton @click="isOpen = true">Menu</UButton>

  <USlideover v-model:open="isOpen">
    <template #header>
      <h2>Navigation</h2>
    </template>

    <UNavigationMenu
      :links="navigationLinks"
      @select="handleNavigate"
    />
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const navigationLinks = [
  { label: 'Dashboard', icon: 'i-lucide-home', to: '/' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/settings' },
  { label: 'Profile', icon: 'i-lucide-user', to: '/profile' },
  { label: 'Logout', icon: 'i-lucide-log-out' }
]

function handleNavigate(link) {
  if (link.to) {
    router.push(link.to)
    isOpen.value = false
  }
}
</script>
```

---

## Placement Patterns

### Right Placement (Default)

```vue
<USlideover v-model:open="isOpen" side="right">
  <!-- Content slides in from the right -->
</USlideover>
```

### Left Placement

```vue
<USlideover v-model:open="isOpen" side="left">
  <!-- Content slides in from the left -->
</USlideover>
```

### Top Placement

```vue
<USlideover v-model:open="isOpen" side="top">
  <!-- Content slides in from the top -->
</USlideover>
```

### Bottom Placement

```vue
<USlideover v-model:open="isOpen" side="bottom">
  <!-- Content slides in from the bottom -->
</USlideover>
```

### Responsive Placement

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    :side="isMobile ? 'bottom' : 'right'"
  >
    <!-- Content -->
  </USlideover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const isOpen = ref(false)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>
```

---

## Size Patterns

### Default Size (Small)

```vue
<!-- Default: w-screen max-w-md (28rem) -->
<USlideover v-model:open="isOpen">
  <!-- Content -->
</USlideover>
```

### Medium Size

```vue
<USlideover
  v-model:open="isOpen"
  :ui="{
    width: 'w-screen max-w-2xl'
  }"
>
  <!-- Content -->
</USlideover>
```

### Large Size

```vue
<USlideover
  v-model:open="isOpen"
  :ui="{
    width: 'w-screen max-w-4xl'
  }"
>
  <!-- Content -->
</USlideover>
```

### Full Width (Mobile Adaptive)

```vue
<USlideover
  v-model:open="isOpen"
  :ui="{
    width: 'w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl'
  }"
>
  <!-- Content -->
</USlideover>
```

### Custom Pixel Size

```vue
<USlideover
  v-model:open="isOpen"
  :ui="{
    width: 'w-[400px] sm:w-[600px] md:w-[800px]'
  }"
>
  <!-- Content -->
</USlideover>
```

---

## Content Patterns

### Header with Icon and Close Button

```vue
<USlideover v-model:open="isOpen">
  <template #header>
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-settings" class="text-lg" />
      <h2 class="text-lg font-semibold">Settings</h2>
    </div>
  </template>

  <template #default>
    <!-- Body content -->
  </template>
</USlideover>
```

### Scrollable Content Body

```vue
<USlideover v-model:open="isOpen">
  <template #default>
    <div class="overflow-y-auto">
      <div class="p-4 space-y-4">
        <!-- Content items that may overflow -->
        <div v-for="item in items" :key="item.id">
          <!-- Item content -->
        </div>
      </div>
    </div>
  </template>
</USlideover>
```

### Footer with Buttons

```vue
<USlideover v-model:open="isOpen">
  <template #footer>
    <div class="flex gap-2 justify-between">
      <UButton color="gray" variant="ghost">Help</UButton>
      <div class="flex gap-2">
        <UButton color="gray" @click="isOpen = false">Cancel</UButton>
        <UButton>Confirm</UButton>
      </div>
    </div>
  </template>
</USlideover>
```

### Tabs in Body

```vue
<USlideover v-model:open="isOpen">
  <template #default>
    <UTabs :items="tabs" class="p-4">
      <template #default="{ item }">
        <div class="p-4">
          {{ item.content }}
        </div>
      </template>
    </UTabs>
  </template>
</USlideover>
```

---

## State Patterns

### Controlled State (v-model)

```vue
<template>
  <UButton @click="isOpen = true">Open</UButton>
  <UButton @click="isOpen = false">Close</UButton>

  <USlideover v-model:open="isOpen">
    <!-- Content -->
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
```

### Conditional Content Based on State

```vue
<template>
  <USlideover v-model:open="isOpen">
    <template #default v-if="isLoading">
      <USkeleton class="h-32 p-4" />
    </template>

    <template #default v-else-if="error">
      <div class="p-4 text-red-500">
        <p>Error loading content: {{ error }}</p>
        <UButton @click="retry" class="mt-2">Retry</UButton>
      </div>
    </template>

    <template #default v-else>
      <!-- Actual content -->
    </template>
  </USlideover>
</template>

<script setup>
import { ref, watch } from 'vue'

const isOpen = ref(false)
const isLoading = ref(false)
const error = ref(null)

watch(isOpen, async (newVal) => {
  if (newVal) {
    isLoading.value = true
    error.value = null
    try {
      await loadContent()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }
})

async function loadContent() {
  // Load content logic
}

async function retry() {
  isLoading.value = true
  try {
    await loadContent()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
```

### Prevent Close Until Valid

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    :dismissible="!hasChanges"
  >
    <template #default>
      <form class="p-4 space-y-4">
        <UFormGroup label="Name">
          <UInput
            v-model="form.name"
            @change="hasChanges = true"
          />
        </UFormGroup>
      </form>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="gray"
          @click="handleCancel"
          :disabled="hasChanges"
        >
          Cancel
        </UButton>
        <UButton
          @click="handleSave"
          :disabled="!isFormValid"
        >
          Save
        </UButton>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
import { ref, computed } from 'vue'

const isOpen = ref(false)
const hasChanges = ref(false)
const form = ref({ name: '' })

const isFormValid = computed(() => form.value.name.trim().length > 0)

function handleCancel() {
  if (!hasChanges.value) {
    isOpen.value = false
  }
}

async function handleSave() {
  if (isFormValid.value) {
    await saveForm()
    hasChanges.value = false
    isOpen.value = false
  }
}

async function saveForm() {
  // Save logic
}
</script>
```

---

## Animation Patterns

### Disable Transitions

```vue
<USlideover
  v-model:open="isOpen"
  :transition="false"
>
  <!-- Content opens/closes instantly -->
</USlideover>
```

### Custom Animation via CSS

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    :ui="{
      content: 'custom-slideover-animation'
    }"
  >
    <!-- Content -->
  </USlideover>
</template>

<style scoped>
/* Custom entrance animation */
.custom-slideover-animation {
  animation: slideInCustom 0.5s ease-out;
}

@keyframes slideInCustom {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
```

### Overlay Fade Animation

```vue
<USlideover
  v-model:open="isOpen"
  :ui="{
    overlay: 'transition-opacity duration-200'
  }"
>
  <!-- Content -->
</USlideover>
```

---

## Nested Slideovers

### Simple Nested Slideover

```vue
<template>
  <UButton @click="firstOpen = true">Open First Slideover</UButton>

  <!-- First Slideover -->
  <USlideover v-model:open="firstOpen" title="First Slideover">
    <template #default>
      <div class="p-4">
        <p>First slideover content</p>
        <UButton @click="secondOpen = true" class="mt-4">
          Open Nested Slideover
        </UButton>
      </div>
    </template>

    <template #footer>
      <UButton @click="firstOpen = false">Close</UButton>
    </template>
  </USlideover>

  <!-- Nested Second Slideover -->
  <USlideover v-model:open="secondOpen" title="Second Slideover">
    <template #default>
      <div class="p-4">
        <p>Nested slideover content</p>
      </div>
    </template>

    <template #footer>
      <UButton @click="secondOpen = false">Back</UButton>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const firstOpen = ref(false)
const secondOpen = ref(false)
</script>
```

### Nested in Footer Slot

```vue
<template>
  <USlideover v-model:open="isOpen">
    <template #header>
      <h2>Main Slideover</h2>
    </template>

    <template #default>
      <p class="p-4">Main content</p>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton @click="isOpen = false">Close</UButton>
        <UButton @click="showDetails = true">View Details</UButton>
      </div>

      <!-- Nested Slideover in Footer -->
      <USlideover v
-model:open="showDetails" title="Details">
        <p class="p-4">Detailed information goes here</p>
      </USlideover>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const showDetails = ref(false)
</script>
```

### Multi-Level Navigation

```vue
<template>
  <USlideover v-model:open="level1">
    <template #header>
      <h2>Level 1</h2>
    </template>

    <template #default>
      <div class="p-4 space-y-2">
        <UButton @click="level2 = true">Go to Level 2</UButton>
      </div>
    </template>

    <template #footer>
      <UButton @click="level1 = false">Close</UButton>
    </template>
  </USlideover>

  <USlideover v-model:open="level2">
    <template #header>
      <h2>Level 2</h2>
    </template>

    <template #default>
      <div class="p-4 space-y-2">
        <UButton @click="level3 = true">Go to Level 3</UButton>
      </div>
    </template>

    <template #footer>
      <UButton @click="level2 = false">Back to Level 1</UButton>
    </template>
  </USlideover>

  <USlideover v-model:open="level3">
    <template #header>
      <h2>Level 3</h2>
    </template>

    <template #default>
      <div class="p-4">
        <p>Deepest level</p>
      </div>
    </template>

    <template #footer>
      <UButton @click="level3 = false">Back</UButton>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const level1 = ref(false)
const level2 = ref(false)
const level3 = ref(false)
</script>
```

---

## Accessibility

### Keyboard Navigation

The Slideover component has built-in keyboard support:

- **ESC Key**: Closes the slideover (unless `dismissible="false"` or `prevent-close="true"`)
- **TAB**: Navigates through focusable elements within the slideover
- **Focus Trap**: Focus is trapped within the slideover when open

```vue
<template>
  <USlideover v-model:open="isOpen">
    <!-- TAB navigation automatically works through:
         - Form inputs
         - Buttons
         - Links
         - Any focusable elements
    -->
    <template #default>
      <form class="p-4 space-y-4">
        <UFormGroup label="Name">
          <UInput placeholder="First focusable element" />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput type="email" placeholder="Second focusable element" />
        </UFormGroup>

        <UButton>Submit (Last focusable element)</UButton>
      </form>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
```

### ARIA Attributes

The component automatically includes proper ARIA attributes:
- `role="dialog"` on the slideover container
- `aria-modal="true"` when modal prop is true
- `aria-labelledby` and `aria-describedby` for title and description
- `aria-hidden="true"` on backdrop overlay

### Custom Focus Management

```vue
<template>
  <USlideover v-model:open="isOpen" @open="setInitialFocus">
    <template #header>
      <h2 id="slideover-title">Form Title</h2>
    </template>

    <template #default>
      <form class="p-4 space-y-4">
        <UFormGroup label="First Name">
          <UInput ref="firstNameInput" placeholder="Focus here first" />
        </UFormGroup>
      </form>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const firstNameInput = ref(null)

function setInitialFocus() {
  // Focus the first input when slideover opens
  nextTick(() => {
    firstNameInput.value?.$el.focus()
  })
}
</script>
```

### Screen Reader Support

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    title="Important Form"
    description="Please fill out all required fields marked with an asterisk"
  >
    <template #default>
      <form class="p-4 space-y-4">
        <UFormGroup
          label="Email"
          hint="Required field"
          description="We'll never share your email"
        >
          <UInput
            type="email"
            required
            aria-required="true"
            aria-describedby="email-hint"
          />
        </UFormGroup>
      </form>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
```

---

## Integration Patterns

### With useOverlay Composable (v3)

```vue
<template>
  <UButton @click="openSlideoverProgrammatically">
    Open via Composable
  </UButton>
</template>

<script setup>
import { useOverlay } from '@nuxt/ui/composables'
import MySlideoverComponent from './MySlideoverComponent.vue'

const overlay = useOverlay()

function openSlideoverProgrammatically() {
  const slideover = overlay.create(MySlideoverComponent, {
    props: {
      title: 'Dynamic Title',
      // Other props
    }
  })

  // Open the slideover
  slideover.open()
}
</script>
```

### With Form Validation

```vue
<template>
  <USlideover v-model:open="isOpen" title="Create User">
    <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
      <UFormGroup
        label="Name"
        :error="errors.name"
      >
        <UInput
          v-model="form.name"
          @blur="validateField('name')"
        />
      </UFormGroup>

      <UFormGroup
        label="Email"
        :error="errors.email"
      >
        <UInput
          v-model="form.email"
          type="email"
          @blur="validateField('email')"
        />
      </UFormGroup>

      <template #footer>
        <div class="flex gap-2">
          <UButton color="gray" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit" :disabled="!isFormValid">
            Create
          </UButton>
        </div>
      </template>
    </form>
  </USlideover>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const isOpen = ref(false)
const form = reactive({ name: '', email: '' })
const errors = reactive({ name: '', email: '' })

const isFormValid = computed(() => {
  return form.name.trim() && form.email.includes('@') && !errors.name && !errors.email
})

function validateField(field) {
  if (field === 'name' && !form.name.trim()) {
    errors.name = 'Name is required'
  } else if (field === 'name') {
    errors.name = ''
  }

  if (field === 'email' && !form.email.includes('@')) {
    errors.email = 'Invalid email'
  } else if (field === 'email') {
    errors.email = ''
  }
}

async function handleSubmit() {
  // Validate all fields
  validateField('name')
  validateField('email')

  if (isFormValid.value) {
    // Submit form
    console.log('Submitting:', form)
    isOpen.value = false
  }
}
</script>
```

### With Loading States

```vue
<template>
  <USlideover v-model:open="isOpen" title="Save Changes">
    <template #default>
      <div class="p-4">
        <p v-if="isLoading">Saving...</p>
        <p v-else>Your changes have been saved.</p>
      </div>
    </template>

    <template #footer>
      <UButton
        @click="handleSave"
        :loading="isLoading"
        :disabled="isLoading"
      >
        Save
      </UButton>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const isLoading = ref(false)

async function handleSave() {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    isOpen.value = false
  } finally {
    isLoading.value = false
  }
}
</script>
```

### With Router Integration

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    @close="handleClose"
  >
    <UNavigationMenu
      :links="navLinks"
      @select="handleNavigation"
    />
  </USlideover>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

// Close slideover when route changes
watch(() => route.path, () => {
  isOpen.value = false
})

function handleNavigation(link) {
  if (link.to) {
    router.push(link.to)
  }
}

function handleClose() {
  isOpen.value = false
}
</script>
```

---

## Advanced Patterns

### Animated Content Transitions

```vue
<template>
  <USlideover v-model:open="isOpen">
    <template #default>
      <Transition name="fade" mode="out-in">
        <div v-if="!showDetails" key="list" class="p-4">
          <div v-for="item in items" :key="item.id" class="mb-2">
            <UButton @click="selectItem(item)">{{ item.name }}</UButton>
          </div>
        </div>

        <div v-else key="details" class="p-4">
          <UButton @click="showDetails = false" variant="ghost">
            &larr; Back
          </UButton>
          <h3 class="mt-4 text-lg font-semibold">{{ selected?.name }}</h3>
          <p>{{ selected?.description }}</p>
        </div>
      </Transition>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const showDetails = ref(false)
const selected = ref(null)

const items = [
  { id: 1, name: 'Item 1', description: 'Description 1' },
  { id: 2, name: 'Item 2', description: 'Description 2' }
]

function selectItem(item) {
  selected.value = item
  showDetails.value = true
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### Composable-Based Slideover Control

```typescript
// useSlideoverManager.js
import { ref } from 'vue'

export function useSlideoverManager() {
  const openSlideovers = ref(new Set())

  function openSlideover(id) {
    openSlideovers.value.add(id)
  }

  function closeSlideover(id) {
    openSlideovers.value.delete(id)
  }

  function closeAll() {
    openSlideovers.value.clear()
  }

  function isOpen(id) {
    return openSlideovers.value.has(id)
  }

  return {
    openSlideover,
    closeSlideover,
    closeAll,
    isOpen
  }
}
```

Usage:
```vue
<template>
  <div>
    <UButton @click="manager.openSlideover('main')">
      Open Main
    </UButton>

    <USlideover
      :open="manager.isOpen('main')"
      @update:open="(val) => val ? manager.openSlideover('main') : manager.closeSlideover('main')"
    >
      <!-- Content -->
    </USlideover>
  </div>
</template>

<script setup>
import { useSlideoverManager } from './composables/useSlideoverManager'

const manager = useSlideoverManager()
</script>
```

### Conditional Overlay

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    :overlay="shouldShowOverlay"
  >
    <template #default>
      <div class="p-4">
        <label class="flex items-center gap-2">
          <UCheckbox v-model="shouldShowOverlay" />
          Show overlay when open
        </label>

        <div class="mt-4">Main content goes here</div>
      </div>
    </template>
  </USlideover>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const shouldShowOverlay = ref(true)
</script>
```

### Responsive Behavior

```vue
<template>
  <USlideover
    v-model:open="isOpen"
    :side="isMobile ? 'bottom' : 'right'"
    :modal="!isMobile"
    :ui="{
      width: isMobile
        ? 'w-full h-1/2'
        : 'w-screen max-w-md'
    }"
  >
    <!-- Content -->
  </USlideover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const isOpen = ref(false)
const { width } = useWindowSize()

const isMobile = computed(() => width.value < 768)
</script>
```

---

## Notes

### Important Observations

1. **Focus Management**: The component automatically traps focus when open, ensuring keyboard navigation stays within the slideover. This is essential for accessibility.

2. **Overlay Behavior**: When `overlay="false"`, the background is not visually obscured, but the page may still be blocked from interaction depending on the `modal` prop.

3. **ESC Key Handling**: The default behavior is to close on ESC, but this can be disabled with `prevent-close` (v2) or `dismissible="false"` (v3). Custom ESC handling can be implemented with `defineShortcuts`.

4. **Width Configuration**: Use Tailwind's responsive prefixes (sm:, md:, lg:) to make slideovers adaptive. The default width may be too narrow for complex forms or large content.

5. **Z-Index Stacking**: Multiple nested slideovers automatically stack correctly with proper z-index management through the overlay provider.

6. **Performance**: For slideovers with large content lists, consider implementing virtual scrolling or pagination to maintain smooth performance.

7. **Close Button**: The close button is always visible by default. Customize it using the `close-icon` prop (icon name) or the `close` prop (full button props object).

8. **Slot Priority**: The default slot takes precedence. Use semantic slots (`header`, `body`, `footer`) when structure is important for accessibility and styling.

9. **Animation Timing**: Default transitions animate smoothly. Disable with `transition="false"` for instant opening/closing if needed.

10. **Mobile Considerations**: On mobile, consider using `side="bottom"` for better UX, as side drawers can be difficult to dismiss with one hand.

### Known Limitations

- **No Native Scroll Lock**: The component doesn't automatically prevent page scrolling when open on all browsers. You may need to add manual scroll prevention.
- **Click Detection**: There's no built-in event to detect specifically when the overlay is clicked (vs. using the close button).
- **Multiple Overlays**: When multiple slideovers are open, clicking the overlay closes only the topmost one.

### Browser Support

The Slideover component works on all modern browsers that support:
- CSS custom properties (CSS variables)
- ES6+ JavaScript
- Vue 3+
- Shadow DOM (if using scoped styles)
