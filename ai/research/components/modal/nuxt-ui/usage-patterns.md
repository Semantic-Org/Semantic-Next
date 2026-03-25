# Nuxt UI - Modal Component

**Component**: Modal (Dialog)
**Framework**: Nuxt UI v4
**Foundation**: Built on Reka UI Dialog
**Documentation**: https://ui.nuxt.com/docs/components/modal
**Research Date**: 2025-11-05

---

## Component Overview

The Modal component in Nuxt UI is a dialog window that displays messages, forms, or requests user input. It's built on Reka UI's Dialog primitives and provides a fully accessible, keyboard-navigable overlay system with extensive customization options.

**Mental Model**: A modal is a temporary window that takes focus from the main content, requiring user interaction before returning to the underlying page. It combines overlay management, focus trapping, and keyboard navigation for a complete dialog experience.

**Common Use Cases**:
- Confirmation dialogs (confirm/cancel actions)
- Form dialogs (create/edit content)
- Alert messages (display important information)
- Command palettes (search-based interactions)
- Multi-step workflows (wizard patterns with nested modals)

---

## Usage Patterns

### Basic Usage

The simplest modal uses a trigger button (or any clickable element) and displays content when opened:

```vue
<template>
  <UModal>
    <UButton label="Open Modal" />

    <template #content>
      <div>Modal content goes here</div>
    </template>
  </UModal>
</template>
```

**Key Concepts**:
- The first child element (typically a button) acts as the trigger
- The `#content` slot contains what displays when the modal opens
- Modal automatically manages open/close state and overlay

### Semantic Structure with Slots

For proper semantic structure, use the dedicated slots instead of a single content slot:

```vue
<template>
  <UModal title="Edit Profile" description="Update your profile information">
    <UButton label="Edit" />

    <template #header="{ close }">
      <h2 class="text-xl font-semibold">Edit Profile</h2>
      <UButton
        icon="i-lucide-x"
        color="gray"
        variant="ghost"
        @click="close"
      />
    </template>

    <template #body>
      <UForm :state="form" @submit="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="form.name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" type="email" />
        </UFormGroup>
      </UForm>
    </template>

    <template #footer>
      <UButton color="gray" @click="isOpen = false">Cancel</UButton>
      <UButton @click="submit">Save Changes</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const form = reactive({ name: '', email: '' })

function submit() {
  // Handle form submission
  isOpen.value = false
}
</script>
```

**Slot Purposes**:
- `#header`: Title area with optional close button
- `#body`: Main content area (forms, text, etc.)
- `#footer`: Action buttons (Cancel, Submit, etc.)
- `#content`: Complete override of entire modal content

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Header title text |
| `description` | `string` | - | Subtitle or descriptive text below title |
| `overlay` | `boolean` | `true` | Show semi-transparent overlay behind modal |
| `transition` | `boolean` | `true` | Enable open/close animations |
| `scrollable` | `boolean` | `false` | Make body content scrollable |
| `fullscreen` | `boolean` | `false` | Expand modal to fill entire viewport |
| `dismissible` | `boolean` | `true` | Allow closing via Escape key and outside clicks |
| `modal` | `boolean` | `true` | Block interaction with background content |
| `v-model:open` | `boolean` | - | Two-way binding for open state |
| `default-open` | `boolean` | `false` | Initial open state |
| `close` | `ButtonProps \| false` | `{}` | Close button configuration (set to false to hide) |
| `close-icon` | `string` | `'i-lucide-x'` | Icon for close button |
| `content` | `object` | `{}` | Reka UI Dialog content props |

---

## States

### Open/Closed State

Control modal visibility with `v-model:open`:

```vue
<template>
  <div>
    <UButton label="Open Modal" @click="isOpen = true" />

    <UModal v-model:open="isOpen">
      <div class="p-4">
        Modal is {{ isOpen ? 'open' : 'closed' }}
      </div>

      <template #footer>
        <UButton color="gray" @click="isOpen = false">Close</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
</script>
```

### Dismissible vs Non-Dismissible

Control whether users can close the modal without taking action:

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Dismissible modal (default behavior)
const isProcessing = ref(false)
</script>

<template>
  <!-- Dismissible: user can close by pressing Esc or clicking outside -->
  <UModal :dismissible="true">
    <UButton label="Open" />
    <template #body>
      <p>You can close this modal</p>
    </template>
  </UModal>

  <!-- Non-dismissible: requires explicit action -->
  <UModal
    :dismissible="false"
    title="Processing..."
    description="Please wait while we process your request"
  >
    <UButton label="Processing" disabled />
    <template #body>
      <p>This modal cannot be closed while processing</p>
    </template>
  </UModal>
</template>
```

### Modal vs Modeless Background Interaction

Control whether background elements can be interacted with:

```vue
<template>
  <!-- Standard modal: blocks background interaction, shows overlay -->
  <UModal :modal="true" :overlay="true">
    <UButton label="Standard Modal" />
    <template #body>
      <p>Background is blocked</p>
    </template>
  </UModal>

  <!-- Non-modal dialog: allows background interaction without overlay -->
  <UModal :modal="false" :overlay="false">
    <UButton label="Floating Dialog" />
    <template #body>
      <p>You can interact with background</p>
    </template>
  </UModal>
</template>
```

---

## Sizing Options

### Default (Auto-Sized)

Modal automatically sizes to content:

```vue
<UModal>
  <UButton label="Open" />
  <template #body>
    <p>Modal width based on content</p>
  </template>
</UModal>
```

### Fullscreen Modal

Expand to fill entire viewport:

```vue
<UModal fullscreen>
  <UButton label="Fullscreen" />
  <template #body>
    <div class="p-8">
      <h2 class="text-2xl font-bold">Fullscreen Modal</h2>
      <p>Content expands to fill viewport</p>
    </div>
  </template>
</UModal>
```

### Custom Sizing via UI Slot

Use the `ui` prop to customize width/height with Tailwind classes:

```vue
<UModal :ui="{ content: 'max-w-2xl' }">
  <UButton label="Wide Modal" />
  <template #body>
    <p>Wider than default modal</p>
  </template>
</UModal>
```

---

## Layout & Positioning

### Centered Modal (Default)

Modal is centered both horizontally and vertically:

```vue
<UModal>
  <UButton label="Open" />
  <template #body>
    <p>Centered on screen</p>
  </template>
</UModal>
```

### Sticky Header and Footer

Keep header/footer visible while body scrolls:

```vue
<UModal :scrollable="true">
  <UButton label="Open" />

  <template #header>
    <h2>Header (always visible)</h2>
  </template>

  <template #body>
    <!-- Long content that scrolls independently -->
    <div v-for="i in 50" :key="i">
      <p>Item {{ i }}</p>
    </div>
  </template>

  <template #footer>
    <UButton @click="isOpen = false">Close</UButton>
    <UButton type="submit">Submit</UButton>
  </template>
</UModal>
```

### Overlay Customization

Control overlay appearance:

```vue
<UModal :overlay="true" :ui="{
  overlay: 'bg-black/50 backdrop-blur-sm'
}">
  <UButton label="Custom Overlay" />
  <template #body>
    <p>Darker overlay with blur effect</p>
  </template>
</UModal>
```

---

## Content & Structure

### Title and Description

Built-in header structure:

```vue
<UModal
  title="Confirm Action"
  description="Are you sure you want to proceed?"
>
  <UButton label="Open" />

  <template #body>
    <p>This action cannot be undone.</p>
  </template>

  <template #footer>
    <UButton color="gray" @click="isOpen = false">Cancel</UButton>
    <UButton color="red" @click="proceed">Confirm</UButton>
  </template>
</UModal>
```

### Form Content

Common pattern for form modals:

```vue
<template>
  <UModal title="Create New Item" description="Add a new item to your list">
    <UButton icon="i-lucide-plus" label="New Item" />

    <template #body>
      <UForm :state="form" @submit="submit">
        <UFormGroup label="Name" name="name" required>
          <UInput
            v-model="form.name"
            placeholder="Enter name..."
            autofocus
          />
        </UFormGroup>

        <UFormGroup label="Description" name="description">
          <UTextarea
            v-model="form.description"
            placeholder="Enter description..."
            rows="4"
          />
        </UFormGroup>

        <UFormGroup label="Category" name="category">
          <USelect
            v-model="form.category"
            :options="categories"
          />
        </UFormGroup>
      </UForm>
    </template>

    <template #footer>
      <UButton color="gray" @click="isOpen = false">Cancel</UButton>
      <UButton @click="submit">Create</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const form = reactive({
  name: '',
  description: '',
  category: null
})

const categories = ['Work', 'Personal', 'Shopping']

function submit() {
  // Save form data
  console.log('Creating item:', form)
  isOpen.value = false
}
</script>
```

### Dynamic Content Loading

Handle async content loading in modals:

```vue
<template>
  <UModal
    v-model:open="isOpen"
    title="User Details"
    :scrollable="true"
  >
    <UButton label="View Details" />

    <template #body>
      <div v-if="loading" class="flex justify-center p-8">
        <UIcon name="i-lucide-loader-2" class="animate-spin" size="lg" />
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 text-red-700">
        {{ error }}
      </div>

      <div v-else-if="user" class="space-y-4 p-4">
        <div>
          <p class="text-sm text-gray-500">Name</p>
          <p class="font-semibold">{{ user.name }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p>{{ user.email }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Bio</p>
          <p>{{ user.bio }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton color="gray" @click="isOpen = false">Close</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const loading = ref(false)
const error = ref(null)
const user = ref(null)

watch(isOpen, async (newOpen) => {
  if (newOpen) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/user/1')
      user.value = await response.json()
    } catch (err) {
      error.value = 'Failed to load user details'
    } finally {
      loading.value = false
    }
  }
})
</script>
```

---

## Interactive Features

### Open/Close Behavior

**Programmatic Control**:

```vue
<template>
  <div class="space-y-4">
    <UButton @click="openModal">Open Modal</UButton>
    <UButton @click="closeModal">Close Modal</UButton>

    <UModal
      v-model:open="isOpen"
      title="Interactive Modal"
    >
      <template #body>
        <p>Modal state: {{ isOpen }}</p>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}
</script>
```

**Event Handling**:

```vue
<template>
  <UModal
    v-model:open="isOpen"
    @close:prevent="onClosePrevented"
  >
    <UButton label="Open" />

    <template #body>
      <div class="space-y-4">
        <p>Perform an action before closing?</p>
        <p class="text-sm text-gray-500">
          Try pressing Escape or clicking outside
        </p>
      </div>
    </template>

    <template #footer>
      <UButton color="gray" @click="isOpen = false">Cancel</UButton>
      <UButton @click="completeAction">Complete Action</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)

function onClosePrevented() {
  console.log('Close was prevented')
}

function completeAction() {
  console.log('Action completed')
  isOpen.value = false
}
</script>
```

### Backdrop Click Behavior

Control what happens when clicking the overlay:

```vue
<template>
  <div class="space-y-4">
    <!-- Closing on backdrop click (default) -->
    <UModal :dismissible="true" :modal="true">
      <UButton label="Can close by clicking backdrop" />
      <template #body>
        <p>Click the overlay to close</p>
      </template>
    </UModal>

    <!-- Not closing on backdrop click -->
    <UModal :dismissible="false" :modal="true">
      <UButton label="Cannot close by clicking backdrop" />
      <template #body>
        <p>You must use the close button</p>
      </template>
    </UModal>
  </div>
</template>
```

### Scroll Lock Behavior

Modal automatically prevents body scroll when open:

```vue
<template>
  <UModal :scrollable="false">
    <UButton label="Locks body scroll when open" />

    <template #body>
      <p>Body scroll is locked</p>
      <p>Modal itself is not scrollable</p>
    </template>
  </UModal>
</template>
```

---

## Animation & Transitions

### Enabled Transitions (Default)

Smooth open/close animations:

```vue
<UModal :transition="true">
  <UButton label="Animated" />
  <template #body>
    <p>Opens and closes with animation</p>
  </template>
</UModal>
```

### Disabled Transitions

Instant open/close without animation:

```vue
<UModal :transition="false">
  <UButton label="No Animation" />
  <template #body>
    <p>Opens and closes instantly</p>
  </template>
</UModal>
```

### Custom Animation Classes

Override transition behavior with UI props:

```vue
<UModal
  :transition="true"
  :ui="{
    content: 'animate-bounce',
    overlay: 'transition-opacity duration-200'
  }"
>
  <UButton label="Custom Animation" />
  <template #body>
    <p>Custom animation classes</p>
  </template>
</UModal>
```

---

## Integration Patterns

### Confirmation Dialog Pattern

Standard confirmation for destructive actions:

```vue
<template>
  <div>
    <UButton color="red" @click="isOpen = true" label="Delete Item" />

    <UModal
      v-model:open="isOpen"
      title="Confirm Deletion"
      description="This action cannot be undone"
      :dismissible="false"
    >
      <template #body>
        <p class="text-sm text-gray-600">
          Are you sure you want to delete this item? This action is permanent.
        </p>
      </template>

      <template #footer>
        <UButton
          color="gray"
          @click="isOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="red"
          @click="deleteItem"
          :loading="isDeleting"
        >
          Delete
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const isDeleting = ref(false)

async function deleteItem() {
  isDeleting.value = true
  try {
    await fetch('/api/item', { method: 'DELETE' })
    isOpen.value = false
  } finally {
    isDeleting.value = false
  }
}
</script>
```

### Form with Validation Pattern

Modal with form validation before submission:

```vue
<template>
  <UModal
    v-model:open="isOpen"
    title="Edit Profile"
    :scrollable="true"
  >
    <UButton label="Edit" />

    <template #body>
      <UForm
        ref="form"
        :state="state"
        :schema="schema"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="email@example.com"
          />
        </UFormGroup>

        <UFormGroup label="Name" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="Your name"
          />
        </UFormGroup>
      </UForm>
    </template>

    <template #footer>
      <UButton color="gray" @click="isOpen = false">Cancel</UButton>
      <UButton
        type="submit"
        @click="form?.validate()"
        :loading="isSaving"
      >
        Save
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

const isOpen = ref(false)
const isSaving = ref(false)
const form = ref(null)

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short')
})

const state = reactive({
  email: '',
  name: ''
})

async function onSubmit(data) {
  isSaving.value = true
  try {
    await fetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    isOpen.value = false
  } finally {
    isSaving.value = false
  }
}
</script>
```

### Nested Modals Pattern

Stack multiple modals for complex workflows:

```vue
<template>
  <div>
    <!-- Primary Modal -->
    <UModal
      v-model:open="isPrimaryOpen"
      title="Create Project"
    >
      <UButton label="New Project" />

      <template #body>
        <div class="space-y-4">
          <p>Create a new project or import from existing:</p>
          <UButton
            @click="isSecondaryOpen = true"
            variant="outline"
            label="Import Existing"
          />
        </div>
      </template>

      <template #footer>
        <UButton color="gray" @click="isPrimaryOpen = false">Cancel</UButton>
        <UButton @click="createProject">Create</UButton>
      </template>
    </UModal>

    <!-- Nested Modal (opens on top of first) -->
    <UModal
      v-model:open="isSecondaryOpen"
      title="Import Project"
    >
      <template #body>
        <p>Select a project to import:</p>
        <USelect
          v-model="selectedProject"
          :options="projects"
          option-attribute="name"
        />
      </template>

      <template #footer>
        <UButton color="gray" @click="isSecondaryOpen = false">Cancel</UButton>
        <UButton @click="importProject">Import</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isPrimaryOpen = ref(false)
const isSecondaryOpen = ref(false)
const selectedProject = ref(null)

const projects = [
  { name: 'Project A' },
  { name: 'Project B' },
  { name: 'Project C' }
]

function createProject() {
  console.log('Creating new project')
  isPrimaryOpen.value = false
}

function importProject() {
  console.log('Importing project:', selectedProject.value)
  isSecondaryOpen.value = false
}
</script>
```

### Dynamic Modal Creation with useOverlay

Create modals programmatically for search/command palettes:

```vue
<template>
  <UButton
    @click="openCommandPalette"
    label="Open Command Palette"
    icon="i-lucide-command"
  />
</template>

<script setup lang="ts">
import { useOverlay } from '@nuxt/ui'

const overlay = useOverlay()

async function openCommandPalette() {
  const result = await overlay.open(UCommandPalette, {
    icon: 'i-lucide-search',
    placeholder: 'Search commands...',
    groups: [
      {
        key: 'files',
        label: 'Files',
        commands: [
          { id: '1', label: 'New File', icon: 'i-lucide-file' },
          { id: '2', label: 'Open File', icon: 'i-lucide-folder-open' }
        ]
      }
    ]
  })

  if (result) {
    console.log('Selected command:', result)
  }
}
</script>
```

---

## Accessibility Features

### Focus Management

Automatic focus management built-in:

```vue
<template>
  <UModal
    v-model:open="isOpen"
    title="Accessible Modal"
  >
    <UButton label="Open" />

    <template #body>
      <!-- Focus automatically moves here when modal opens -->
      <UInput
        v-model="name"
        placeholder="Focus starts here"
        autofocus
      />
    </template>
  </UModal>
</template>
```

**Focus Behavior**:
- Focus moves to first focusable element when modal opens
- Focus returns to trigger button when modal closes
- Tab key navigation is trapped within modal
- Focus management is automatic via Reka UI

### Keyboard Navigation

Built-in keyboard support:

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next element (trapped in modal) |
| `Shift + Tab` | Move focus to previous element |
| `Escape` | Close modal (if `dismissible: true`) |
| `Enter` | Submit form or activate focused button |
| `Space` | Activate focused button |

### ARIA Attributes

Proper semantic structure for screen readers:

```vue
<template>
  <UModal
    title="User Details"
    description="View and edit user information"
  >
    <UButton label="Edit User" />

    <template #header>
      <h2 role="heading" aria-level="1">User Details</h2>
      <p>View and edit user information</p>
    </template>

    <template #body>
      <section role="region" aria-label="User details">
        <dl>
          <dt>Name:</dt>
          <dd>John Doe</dd>
          <dt>Email:</dt>
          <dd>john@example.com</dd>
        </dl>
      </section>
    </template>
  </UModal>
</template>
```

**Automatic ARIA**:
- `role="dialog"` on modal container
- `aria-modal="true"` to indicate modal behavior
- `aria-labelledby` connects to title element
- `aria-describedby` connects to description element
- Proper focus management and trap

### Screen Reader Support

Content is properly announced to screen readers:

```vue
<template>
  <UModal
    title="Confirm Action"
    description="Please confirm before proceeding"
  >
    <UButton label="Proceed" />

    <template #body>
      <div role="region" aria-live="polite">
        <p>This action will permanently delete your account.</p>
        <p aria-label="Warning">This cannot be undone.</p>
      </div>
    </template>
  </UModal>
</template>
```

---

## Common Patterns

### Alert Dialog Pattern

Simple informational modal:

```vue
<template>
  <UButton @click="showAlert" label="Show Alert" />

  <UModal
    v-model:open="isAlertOpen"
    title="Alert"
    :dismissible="true"
  >
    <template #body>
      <p class="text-gray-700">{{ alertMessage }}</p>
    </template>

    <template #footer>
      <UButton @click="isAlertOpen = false">OK</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isAlertOpen = ref(false)
const alertMessage = ref('')

function showAlert() {
  alertMessage.value = 'This is an alert message'
  isAlertOpen.value = true
}
</script>
```

### Multi-Step Form Pattern (Wizard)

Walk through steps with form validation:

```vue
<template>
  <UModal
    v-model:open="isOpen"
    :title="steps[currentStep].title"
  >
    <UButton label="Start Setup" />

    <template #body>
      <component
        :is="steps[currentStep].component"
        v-model="formData"
      />
    </template>

    <template #footer>
      <UButton
        v-if="currentStep > 0"
        color="gray"
        @click="currentStep--"
      >
        Back
      </UButton>
      <UButton
        v-if="currentStep < steps.length - 1"
        @click="currentStep++"
      >
        Next
      </UButton>
      <UButton
        v-else
        @click="completeSetup"
      >
        Complete
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const currentStep = ref(0)
const formData = reactive({
  email: '',
  password: '',
  name: ''
})

const steps = [
  { title: 'Email', component: EmailStep },
  { title: 'Password', component: PasswordStep },
  { title: 'Profile', component: ProfileStep }
]

function completeSetup() {
  console.log('Setup completed:', formData)
  isOpen.value = false
}
</script>
```

### Search/Command Palette Pattern

Searchable modal for commands:

```vue
<template>
  <UModal
    v-model:open="isOpen"
    title="Search"
    :scrollable="true"
  >
    <UButton icon="i-lucide-search" label="Search" />

    <template #body>
      <UInput
        v-model="search"
        placeholder="Search..."
        icon="i-lucide-search"
        @input="filterResults"
      />

      <div class="mt-4 space-y-2">
        <button
          v-for="result in filteredResults"
          :key="result.id"
          class="w-full p-2 text-left hover:bg-gray-100"
          @click="selectResult(result)"
        >
          <div class="font-semibold">{{ result.title }}</div>
          <div class="text-sm text-gray-500">{{ result.description }}</div>
        </button>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const search = ref('')
const filteredResults = ref([])

const allResults = [
  { id: 1, title: 'Settings', description: 'Open settings' },
  { id: 2, title: 'Profile', description: 'View your profile' },
  { id: 3, title: 'Logout', description: 'Sign out' }
]

function filterResults() {
  if (!search.value) {
    filteredResults.value = []
    return
  }

  filteredResults.value = allResults.filter(r =>
    r.title.toLowerCase().includes(search.value.toLowerCase())
  )
}

function selectResult(result) {
  console.log('Selected:', result)
  isOpen.value = false
}
</script>
```

---

## Related Components

- **Dialog/Modal**: Core modal component (this component)
- **Button**: Typical trigger element for modals
- **Form/FormGroup**: Commonly used inside modals for data collection
- **Input/Textarea**: Form inputs used in modal forms
- **Select**: Dropdown selection in modal forms
- **CommandPalette**: Specialized modal for searching/commanding
- **Overlay**: Lower-level primitive for creating custom overlays
- **useOverlay**: Composable for programmatic modal creation

---

## Best Practices

### When to Use Modal

**Use Modal for:**
- Confirmation dialogs requiring immediate user action
- Forms that collect user input
- Important alerts and notifications
- Multi-step workflows (wizards)
- Context-specific actions and settings

**Don't use Modal for:**
- Simple notifications (use Toast instead)
- Navigation (use router instead)
- Large data tables (consider full page instead)
- Frequently accessed information (consider sidebar/drawer)

### Focus Management Best Practices

1. **Set autofocus on primary input**:
```vue
<UInput v-model="email" autofocus />
```

2. **Ensure tab order is logical**: Use native HTML form elements in order

3. **Return focus to trigger**: Modal handles this automatically

4. **Avoid focusing hidden elements**: All focusable elements should be visible

### Form Modal Best Practices

1. **Use native form validation**:
```vue
<UFormGroup name="email" required>
  <UInput type="email" required />
</UFormGroup>
```

2. **Provide clear save/cancel options** in footer

3. **Disable submit while processing**:
```vue
<UButton :loading="isSaving">Save</UButton>
```

4. **Show validation errors inline**, not in modals

### Accessibility Best Practices

1. **Always provide a way to close**:
   - If `dismissible: false`, ensure explicit close action
   - Provide visible close button

2. **Use semantic HTML**:
   - Use `<form>` for forms
   - Use `<ul>` for lists
   - Use heading hierarchy

3. **Provide meaningful titles**:
```vue
<UModal title="Confirm account deletion">
```

4. **Include aria-labels for complex content**:
```vue
<div aria-label="Step 1 of 3">
```

### Performance Best Practices

1. **Load content lazily**:
```vue
<UModal v-model:open="isOpen">
  <LazyComponentA v-if="tab === 'a'" />
  <LazyComponentB v-if="tab === 'b'" />
</UModal>
```

2. **Avoid heavy computations in render**:
```vue
<!-- Good -->
<template #body>{{ formattedData }}</template>

<!-- Avoid -->
<template #body>{{ heavyComputation() }}</template>
```

3. **Close modals when not needed**: Cleanup DOM for performance

4. **Use transition: false for many modals**: Skip animations if performance critical

---

## Accessibility Notes

### ARIA Implementation Details

The Modal component automatically applies:
- `role="dialog"` - Semantic role
- `aria-modal="true"` - Indicates modal behavior
- `aria-labelledby` - Links to title element
- `aria-describedby` - Links to description element
- `aria-hidden="true"` - On background when modal open

### Keyboard Support

**All keyboard interactions are built-in**:
- Escape closes modal (configurable)
- Tab cycles through elements (trapped)
- Focus visible on all elements
- Screen readers announce interactive elements

### Visual Accessibility

**Ensure adequate contrast**:
- Text in modal meets WCAG AA standards
- Button contrast sufficient for visibility
- Error messages use color + text

---

## Common Issues & Solutions

### Modal Not Dismissible with Escape

**Issue**: User presses Escape but modal doesn't close

**Solution**: Check `dismissible` prop:
```vue
<UModal :dismissible="true">  <!-- Must be true -->
```

### Focus Not Returning to Trigger

**Issue**: After closing, focus disappears

**Solution**: Modal handles this automatically via Reka UI. If issue persists, check for JavaScript errors

### Scrolling Issues

**Issue**: Body scroll locks but doesn't unlock

**Solution**: Ensure modal is properly closed:
```vue
<UModal v-model:open="isOpen">  <!-- Use v-model -->
```

### Nested Modal Stacking

**Issue**: Nested modals display incorrectly

**Solution**: Nuxt UI handles stacking automatically. Ensure each modal has unique `v-model`

---

## Research Notes

### Documentation Quality

**Strengths**:
- Clear prop documentation with defaults
- Interactive examples in official docs
- Good coverage of basic usage patterns
- Accessibility guidance provided

**Limitations**:
- Could benefit from more complex examples
- Dynamic modal creation (useOverlay) needs clearer documentation
- Best practices section limited

### Framework Approach

1. **Vue 3 Composable-First**: Uses `v-model:open` for state management
2. **Reka UI Foundation**: Leverages robust accessibility primitives
3. **Tailwind-First Styling**: All styling via utility classes
4. **Slot-Based Architecture**: Flexible content composition
5. **Type-Safe**: Full TypeScript support with proper types

### Implementation Patterns

1. **State Management**: Uses Vue refs for open/close state
2. **Two-Way Binding**: `v-model:open` for reactive control
3. **Composition**: Slots for flexible content composition
4. **Props-Driven**: All behavior controlled via props
5. **Accessibility Built-In**: ARIA and keyboard handling automatic

### Comparison to Other Frameworks

**Strengths vs Alternatives**:
- More accessible than many custom implementations
- Better TypeScript integration than some competitors
- Tailwind-native styling (no CSS-in-JS overhead)
- Built on proven Reka UI primitives

**Considerations**:
- Nuxt-specific (not standalone Vue component)
- No custom animations (uses default transitions)
- Styling requires Tailwind knowledge
- Focus trap by design (not always desired)

---

**Research completed**: 2025-11-05
**Component**: Modal
**Framework**: Nuxt UI v4
**Documentation**: https://ui.nuxt.com/docs/components/modal
