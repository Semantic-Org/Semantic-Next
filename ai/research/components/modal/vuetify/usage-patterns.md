# Vuetify - Dialog Component (v-dialog)

**Framework:** Vuetify (Vue.js)
**Component:** v-dialog
**Version:** 3.x (Latest)
**Research Date:** 2025-11-05
**Documentation:** https://vuetifyjs.com/en/components/dialogs

---

## 1. Component Overview

The v-dialog component informs users about a specific task and may contain critical information, require decisions, or involve multiple tasks. It is designed as an **overlay modal** that interrupts the user experience to present important information or require user input.

Dialogs are **intentionally intrusive** - they break the flow of the application to ensure user attention and action. They are best used for:
- Confirming critical actions (delete, permanent changes)
- Collecting essential form input
- Displaying important alerts or warnings
- Step-by-step workflows or wizards
- Modal forms that require completion before returning to the main interface

**Key Distinction:** v-dialog is a **modal overlay component** designed for important, user-blocking interactions. It should be used sparingly to avoid disrupting the user experience.

---

## 2. Basic Usage

### Simple Dialog with v-model

```vue
<template>
  <div>
    <button @click="dialog = true">Open Dialog</button>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>Dialog Title</v-card-title>
        <v-card-text>
          This is the dialog content. Users must interact with it.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button @click="dialog = false">Cancel</button>
          <button @click="handleConfirm">Confirm</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);

const handleConfirm = () => {
  // Handle confirmation action
  dialog.value = false;
};
</script>
```

**Explanation:** The `v-model` binding controls the dialog's visibility. Setting it to `true` opens the dialog, `false` closes it. The v-card structure (title, text, actions) is the recommended layout.

### Dialog with Persistent Prop

```vue
<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-card-title>Important Action</v-card-title>
      <v-card-text>
        This is a persistent dialog. Clicking outside will not close it.
      </v-card-text>
      <v-card-actions>
        <button @click="dialog = false">Close</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);
</script>
```

**Explanation:** The `persistent` prop prevents the dialog from closing when clicking or tapping outside of it. Users must explicitly close it via a button or by programmatically setting the v-model to `false`.

### Dialog with Form

```vue
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <button v-bind="props">Open Form</button>
    </template>

    <v-card>
      <v-card-title>Edit Profile</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            :rules="[(v) => v.length >= 6 || 'Password must be at least 6 characters']"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <button @click="dialog = false">Cancel</button>
        <button @click="handleSubmit">Save</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';

const dialog = ref(false);
const form = reactive({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = async () => {
  // Submit form data
  console.log('Form submitted:', form);
  dialog.value = false;
};
</script>
```

**Explanation:** Dialogs commonly contain forms for user input. The v-text-field components support validation rules. Form submission logic updates the form and closes the dialog on success.

---

## 3. Props/API

### Core v-dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model-value` / `v-model` | `boolean` | `false` | Controls whether the dialog is open or closed |
| `persistent` | `boolean` | `false` | Clicking outside will not deactivate the dialog; must be closed programmatically or via button |
| `fullscreen` | `boolean` | `false` | Dialog expands to fill the entire viewport |
| `max-width` | `string \| number` | undefined | Sets the maximum width (e.g., "500px", "600", "sm", "md", "lg", "xl") |
| `width` | `string \| number` | undefined | Sets the exact width |
| `scrollable` | `boolean` | `false` | When true, expects v-card with v-card-text to have designated height; makes dialog scrollable |
| `transition` | `string` | `'dialog-transition'` | Sets the animation/transition effect |
| `origin` | `string` | undefined | Sets the transition origin on the element |
| `no-click-animation` | `boolean` | `false` | Disables the bounce/click animation when clicking outside (on persistent dialogs) |
| `retain-focus` | `boolean` | `true` | Tab focus returns to first child of dialog; disable for external tools like TinyMCE |
| `content-class` | `string \| object \| array` | undefined | Applies custom CSS class to the dialog content element |
| `overlay-color` | `string` | undefined | Sets the overlay/backdrop color |
| `overlay-opacity` | `string \| number` | undefined | Sets the overlay opacity (0-1) |
| `hide-overlay` | `boolean` | `false` | Hides the backdrop overlay entirely |
| `attach` | `string \| boolean \| object` | undefined | Specifies where to mount the dialog (default: body). Can be selector, element, or false to not detach |
| `eager` | `boolean` | `false` | Forces rendering of the dialog on component mount instead of lazy rendering |
| `disabled` | `boolean` | `false` | Disables interaction with the dialog |
| `no-click-outside` | `boolean` | `false` | Disables click outside to close (alternative to persistent) |
| `contained` | `boolean` | `false` | Restricts dialog to the bounds of its container |

### Additional Props (Positioning & Behavior)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `absolute` | `boolean` | `false` | Applies absolute positioning instead of fixed |
| `centered` | `boolean` | `true` | Centers the dialog vertically and horizontally |
| `z-index` | `string \| number` | undefined | Stacking context depth |
| `theme` | `'light' \| 'dark'` | undefined | Applies theme variant |

---

## 4. Component Structure

### Recommended v-card Structure

The recommended structure for dialog content uses Vuetify's v-card components:

```vue
<v-dialog v-model="dialog">
  <v-card>
    <!-- Title Section -->
    <v-card-title class="text-h5">
      Dialog Title
    </v-card-title>

    <!-- Divider -->
    <v-divider></v-divider>

    <!-- Content Section -->
    <v-card-text>
      Main dialog content goes here
    </v-card-text>

    <!-- Actions Section -->
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <button @click="dialog = false">Cancel</button>
      <button @click="confirm">Confirm</button>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Structure Breakdown:**
- **v-card-title**: Header with dialog title
- **v-divider**: Visual separator (optional but common)
- **v-card-text**: Main content area; should have fixed height if using scrollable
- **v-card-actions**: Button area at bottom (using v-spacer to align buttons right)

### Scrollable Content Structure

For dialogs with long content:

```vue
<v-dialog v-model="dialog" max-width="600px" scrollable>
  <v-card>
    <v-card-title>Long Content Dialog</v-card-title>

    <!-- v-card-text is scrollable when scrollable prop is true -->
    <v-card-text style="height: 400px">
      <!-- Content that exceeds 400px will scroll -->
      <p v-for="i in 50" :key="i">
        Line {{ i }} of content
      </p>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <button @click="dialog = false">Close</button>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Note:** When using `scrollable`, the v-card-text element should have a defined height for the scroll behavior to work properly.

---

## 5. Variants & Styling

### Size Variants

#### Small Dialog
```vue
<v-dialog v-model="dialog" max-width="300px">
  <!-- Content -->
</v-dialog>
```

#### Medium Dialog (Default)
```vue
<v-dialog v-model="dialog" max-width="500px">
  <!-- Content -->
</v-dialog>
```

#### Large Dialog
```vue
<v-dialog v-model="dialog" max-width="900px">
  <!-- Content -->
</v-dialog>
```

#### Full-Width Dialog with Max
```vue
<v-dialog v-model="dialog" max-width="1200px" width="100%">
  <!-- Content -->
</v-dialog>
```

### Fullscreen Dialog

```vue
<v-dialog v-model="dialog" fullscreen>
  <v-card>
    <v-toolbar dark color="primary">
      <button @click="dialog = false">Close</button>
      <v-spacer></v-spacer>
      <v-toolbar-title>Fullscreen Dialog</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      Full screen content area
    </v-card-text>
  </v-card>
</v-dialog>
```

**Note:** Fullscreen dialogs typically include a toolbar at the top instead of a card title for better UX on mobile devices.

### Theme Variants

```vue
<!-- Light Theme Dialog -->
<v-dialog v-model="dialog" theme="light">
  <v-card>
    <!-- Content -->
  </v-card>
</v-dialog>

<!-- Dark Theme Dialog -->
<v-dialog v-model="dialog" theme="dark">
  <v-card>
    <!-- Content -->
  </v-card>
</v-dialog>
```

---

## 6. States

### Open State
Dialog is visible. Content is displayed, overlay is shown, and user interaction is focused on the dialog.

```vue
<v-dialog v-model="dialog">
  <!-- Dialog is open when v-model is true -->
</v-dialog>
```

### Closed State
Dialog is hidden. Overlay is not shown, focus returns to trigger element (if configured).

```vue
<v-dialog v-model="dialog">
  <!-- Dialog is closed when v-model is false -->
</v-dialog>
```

### Persistent State
Dialog cannot be closed by clicking outside or on overlay. Requires explicit action (button click or ESC key handling).

```vue
<v-dialog v-model="dialog" persistent>
  <!-- Can only close via button or programmatically -->
</v-dialog>
```

### Loading State
Dialog shows loading indicator while processing async operation:

```vue
<template>
  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-card-title>Processing</v-card-title>
      <v-card-text>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        Please wait...
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);

const handleAsync = async () => {
  dialog.value = true;
  try {
    await performAsyncOperation();
    dialog.value = false;
  } catch (error) {
    // Handle error
  }
};
</script>
```

### Disabled State
Dialog cannot be interacted with:

```vue
<v-dialog v-model="dialog" disabled>
  <!-- Dialog is non-interactive -->
</v-dialog>
```

---

## 7. Interactive Features

### Activator Slot

The `activator` slot defines the element that triggers the dialog:

```vue
<v-dialog v-model="dialog">
  <template v-slot:activator="{ props }">
    <button v-bind="props">Open Dialog</button>
  </template>

  <v-card>
    <!-- Dialog content -->
  </v-card>
</v-dialog>
```

**Explanation:** The `props` from activator scope binding include event handlers for mouse enter, mouse leave, focus, etc. Binding them to the trigger element makes it interactive.

### Default Slot

The default slot contains the dialog content:

```vue
<v-dialog v-model="dialog">
  <v-card>
    <!-- This is the default slot content -->
    <v-card-title>Title</v-card-title>
    <v-card-text>Content</v-card-text>
  </v-card>
</v-dialog>
```

### Prepend/Append Slots (if available)

Some Vuetify versions support additional slots for content before/after the card:

```vue
<v-dialog v-model="dialog">
  <template v-slot:prepend>
    <!-- Content before the card -->
  </template>

  <v-card>
    <!-- Main content -->
  </v-card>

  <template v-slot:append>
    <!-- Content after the card -->
  </template>
</v-dialog>
```

---

## 8. Animation & Transitions

### Built-in Transitions

Vuetify provides several built-in dialog transitions:

```vue
<!-- Default dialog transition -->
<v-dialog v-model="dialog" transition="dialog-transition">
  <!-- Content -->
</v-dialog>

<!-- Fade transition -->
<v-dialog v-model="dialog" transition="fade-transition">
  <!-- Content -->
</v-dialog>

<!-- Scale transition -->
<v-dialog v-model="dialog" transition="scale-transition">
  <!-- Content -->
</v-dialog>

<!-- Slide transitions -->
<v-dialog v-model="dialog" transition="slide-y-transition">
  <!-- Slides in from top -->
</v-dialog>

<v-dialog v-model="dialog" transition="slide-y-reverse-transition">
  <!-- Slides in from bottom -->
</v-dialog>
```

### Custom Transition Origin

```vue
<v-dialog
  v-model="dialog"
  transition="dialog-transition"
  origin="top left"
>
  <!-- Dialog expands from top-left corner -->
</v-dialog>
```

### Custom CSS Transitions

Define custom transitions using Vue's transition component system:

```vue
<v-dialog v-model="dialog" transition="custom-dialog-transition">
  <v-card>
    <!-- Content -->
  </v-card>
</v-dialog>

<style>
/* Custom CSS transition */
.custom-dialog-transition-enter-active,
.custom-dialog-transition-leave-active {
  transition: all 0.3s ease;
}

.custom-dialog-transition-enter-from,
.custom-dialog-transition-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
```

---

## 9. Integration Patterns

### Form Dialog with Validation

```vue
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <button v-bind="props">Edit Item</button>
    </template>

    <v-card>
      <v-card-title>Edit Item</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="item.name"
            label="Name"
            :rules="[v => !!v || 'Name is required']"
            required
          ></v-text-field>

          <v-text-field
            v-model="item.description"
            label="Description"
            :rules="[v => !v || v.length <= 500 || 'Max 500 characters']"
          ></v-text-field>

          <v-select
            v-model="item.category"
            :items="categories"
            label="Category"
            :rules="[v => !!v || 'Category is required']"
            required
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <button @click="dialog = false">Cancel</button>
        <button @click="handleSubmit" :disabled="!formValid">Save</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';

const dialog = ref(false);
const form = ref(null);
const formValid = ref(false);
const categories = ref(['Electronics', 'Clothing', 'Books']);

const item = reactive({
  name: '',
  description: '',
  category: null
});

const handleSubmit = async () => {
  if (!await form.value.validate()) return;

  // Submit form data
  console.log('Saving item:', item);
  dialog.value = false;
};
</script>
```

### Confirmation Dialog

```vue
<template>
  <v-dialog v-model="confirmDialog" max-width="400px" persistent>
    <v-card>
      <v-card-title>Confirm Action</v-card-title>
      <v-card-text>
        {{ confirmMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <button @click="confirmDialog = false">Cancel</button>
        <button
          @click="handleConfirm"
          color="error"
          variant="text"
        >
          Delete
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const confirmDialog = ref(false);
const confirmMessage = ref('Are you sure?');
const confirmCallback = ref(null);

const openConfirm = (message, callback) => {
  confirmMessage.value = message;
  confirmCallback.value = callback;
  confirmDialog.value = true;
};

const handleConfirm = () => {
  if (confirmCallback.value) {
    confirmCallback.value();
  }
  confirmDialog.value = false;
};

// Export for use in other components
defineExpose({ openConfirm });
</script>
```

### Async Operations Dialog

```vue
<template>
  <v-dialog v-model="asyncDialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        {{ isLoading ? 'Processing...' : 'Operation Complete' }}
      </v-card-title>

      <v-card-text>
        <div v-if="isLoading" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          ></v-progress-circular>
          <p class="mt-4">{{ statusMessage }}</p>
        </div>

        <div v-else>
          <v-alert
            :type="operationSuccess ? 'success' : 'error'"
            :text="resultMessage"
          ></v-alert>
        </div>
      </v-card-text>

      <v-card-actions v-if="!isLoading">
        <v-spacer></v-spacer>
        <button @click="asyncDialog = false">Close</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const asyncDialog = ref(false);
const isLoading = ref(false);
const statusMessage = ref('');
const operationSuccess = ref(false);
const resultMessage = ref('');

const performAsyncOperation = async (operation) => {
  asyncDialog.value = true;
  isLoading.value = true;
  statusMessage.value = 'Processing...';

  try {
    const result = await operation();
    operationSuccess.value = true;
    resultMessage.value = 'Operation completed successfully!';
  } catch (error) {
    operationSuccess.value = false;
    resultMessage.value = `Error: ${error.message}`;
  } finally {
    isLoading.value = false;
  }
};

defineExpose({ performAsyncOperation });
</script>
```

---

## 10. Accessibility Features

### Built-in Accessibility

Vuetify's v-dialog provides several accessibility features out of the box:

**ARIA Attributes:**
- `role="dialog"` is automatically applied
- `aria-labelledby` can be bound to v-card-title
- `aria-describedby` can reference v-card-text

**Focus Management:**
- Focus is automatically trapped within the dialog
- Focus can be returned to the trigger element on close (when `retain-focus` is true)
- The `tab` key navigates within the dialog

**Keyboard Support:**
- `Escape` key closes the dialog (unless persistent)
- `Tab` / `Shift+Tab` navigate interactive elements
- Form elements within the dialog are fully keyboard accessible

### Implementing Accessible Dialogs

```vue
<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    persistent
    :aria-label="dialogTitle"
  >
    <template v-slot:activator="{ props }">
      <button
        v-bind="props"
        aria-label="Open dialog to edit profile"
      >
        Edit Profile
      </button>
    </template>

    <v-card role="dialog" aria-modal="true">
      <v-card-title
        id="dialog-title"
        class="text-h5"
      >
        {{ dialogTitle }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text id="dialog-description">
        <p>Edit your profile information below.</p>

        <v-text-field
          v-model="profile.name"
          label="Full Name"
          aria-label="Full Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="profile.email"
          label="Email Address"
          aria-label="Email Address"
          type="email"
          required
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <button
          @click="dialog = false"
          aria-label="Cancel and close dialog"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          aria-label="Save changes and close dialog"
        >
          Save Changes
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';

const dialog = ref(false);
const dialogTitle = 'Edit Profile';
const profile = reactive({
  name: '',
  email: ''
});

const handleSave = () => {
  console.log('Profile updated:', profile);
  dialog.value = false;
};
</script>
```

### Accessibility Testing Checklist

- ✅ Dialog has explicit title that's announced
- ✅ Focus trap is working (cannot tab outside dialog)
- ✅ Escape key closes the dialog
- ✅ Focus returns to trigger element on close
- ✅ All form elements are properly labeled
- ✅ Color is not the only means of conveying information
- ✅ Sufficient color contrast (WCAG AA minimum)
- ✅ Screen reader can announce dialog purpose and content
- ✅ All interactive elements are keyboard accessible

---

## 11. Key Properties Reference Table

| Property | Type | Default | Use Case |
|----------|------|---------|----------|
| `v-model` | `boolean` | `false` | Control dialog visibility |
| `persistent` | `boolean` | `false` | Prevent closing by clicking outside |
| `fullscreen` | `boolean` | `false` | Expand to fill viewport |
| `max-width` | `string \| number` | undefined | Limit dialog maximum width |
| `width` | `string \| number` | undefined | Set exact dialog width |
| `scrollable` | `boolean` | `false` | Make content scrollable |
| `transition` | `string` | `'dialog-transition'` | Choose animation style |
| `no-click-animation` | `boolean` | `false` | Disable click outside animation |
| `retain-focus` | `boolean` | `true` | Keep focus in dialog |
| `content-class` | `string \| object \| array` | undefined | Custom CSS classes |
| `overlay-color` | `string` | undefined | Backdrop color |
| `overlay-opacity` | `string \| number` | undefined | Backdrop opacity |
| `hide-overlay` | `boolean` | `false` | Hide backdrop |
| `attach` | `string \| boolean \| object` | `'body'` | Where to mount dialog |

---

## 12. Code Examples

### Example 1: Basic Alert Dialog

```vue
<template>
  <div>
    <button @click="showAlert = true">Show Alert</button>

    <v-dialog v-model="showAlert" max-width="400px">
      <v-card>
        <v-card-title>Alert</v-card-title>
        <v-card-text>
          This is an important message that needs your attention.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button @click="showAlert = false">OK</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showAlert = ref(false);
</script>
```

### Example 2: Persistent Confirmation Dialog

```vue
<template>
  <div>
    <button @click="showConfirm = true" color="error">Delete Item</button>

    <v-dialog v-model="showConfirm" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h5">Delete Item?</v-card-title>
        <v-card-text>
          Are you sure you want to delete this item? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button @click="showConfirm = false" variant="text">Cancel</button>
          <button @click="handleDelete" color="error" variant="text">Delete</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showConfirm = ref(false);

const handleDelete = () => {
  console.log('Item deleted');
  showConfirm.value = false;
};
</script>
```

### Example 3: Form Dialog with Validation

```vue
<template>
  <div>
    <v-dialog v-model="showForm" max-width="600px">
      <template v-slot:activator="{ props }">
        <button v-bind="props">Add New User</button>
      </template>

      <v-card>
        <v-card-title>Add New User</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="newUser.firstName"
              label="First Name"
              :rules="[v => !!v || 'First name is required']"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.lastName"
              label="Last Name"
              :rules="[v => !!v || 'Last name is required']"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.email"
              label="Email"
              type="email"
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.phone"
              label="Phone"
              type="tel"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <button @click="showForm = false">Cancel</button>
          <button @click="handleSubmit">Add User</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const showForm = ref(false);
const form = ref(null);

const newUser = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

const handleSubmit = async () => {
  if (!await form.value.validate()) return;

  console.log('Adding user:', newUser);

  // Reset form
  form.value.reset();
  showForm.value = false;
};
</script>
```

### Example 4: Scrollable Dialog

```vue
<template>
  <v-dialog v-model="showScrollable" max-width="500px" scrollable>
    <template v-slot:activator="{ props }">
      <button v-bind="props">View Long Content</button>
    </template>

    <v-card>
      <v-card-title class="sticky top-0 bg-white z-10">
        Long Content
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text style="height: 400px">
        <p v-for="i in 50" :key="i" class="mb-4">
          <strong>Section {{ i }}</strong><br>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <button @click="showScrollable = false">Close</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const showScrollable = ref(false);
</script>
```

### Example 5: Fullscreen Dialog

```vue
<template>
  <v-dialog v-model="showFullscreen" fullscreen>
    <template v-slot:activator="{ props }">
      <button v-bind="props">Open Fullscreen</button>
    </template>

    <v-card>
      <v-toolbar dark color="primary">
        <button icon @click="showFullscreen = false">
          Close
        </button>
        <v-spacer></v-spacer>
        <v-toolbar-title>Fullscreen Dialog</v-toolbar-title>
        <v-spacer></v-spacer>
        <button icon @click="handleSave">
          Save
        </button>
      </v-toolbar>

      <v-card-text class="pa-4">
        <h2 class="mb-4">Edit Content</h2>
        <p>
          This is a fullscreen dialog suitable for complex forms or detailed editing.
          It provides more space than a regular dialog.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const showFullscreen = ref(false);

const handleSave = () => {
  console.log('Saved');
  showFullscreen.value = false;
};
</script>
```

---

## 13. Common Patterns & Use Cases

### Pattern 1: Dialog Service (Composable)

```typescript
// useDialog.ts
import { ref } from 'vue';

export function useDialog() {
  const dialogs = ref([]);

  const openDialog = (config) => {
    const id = Date.now();
    dialogs.value.push({
      id,
      ...config,
      isOpen: true
    });
    return id;
  };

  const closeDialog = (id) => {
    const dialog = dialogs.value.find(d => d.id === id);
    if (dialog) {
      dialog.isOpen = false;
    }
  };

  return {
    dialogs,
    openDialog,
    closeDialog
  };
}
```

### Pattern 2: Modal Workflow (Multi-Step Dialog)

```vue
<template>
  <v-dialog v-model="showWorkflow" max-width="600px" persistent>
    <v-card>
      <v-card-title>Setup Wizard</v-card-title>

      <v-stepper v-model="currentStep">
        <v-stepper-header>
          <v-stepper-item :step="1">Account</v-stepper-item>
          <v-stepper-item :step="2">Preferences</v-stepper-item>
          <v-stepper-item :step="3">Confirm</v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item :step="1">
            <!-- Step 1 content -->
            <v-text-field v-model="form.username" label="Username"></v-text-field>
          </v-stepper-window-item>

          <v-stepper-window-item :step="2">
            <!-- Step 2 content -->
            <v-select v-model="form.theme" :items="['light', 'dark']" label="Theme"></v-select>
          </v-stepper-window-item>

          <v-stepper-window-item :step="3">
            <!-- Review step -->
            <p>Username: {{ form.username }}</p>
            <p>Theme: {{ form.theme }}</p>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

      <v-card-actions>
        <v-spacer></v-spacer>
        <button @click="currentStep = Math.max(1, currentStep - 1)" :disabled="currentStep === 1">Back</button>
        <button v-if="currentStep < 3" @click="currentStep++">Next</button>
        <button v-else @click="handleComplete">Complete</button>
        <button @click="showWorkflow = false">Cancel</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';

const showWorkflow = ref(false);
const currentStep = ref(1);
const form = reactive({
  username: '',
  theme: 'light'
});

const handleComplete = () => {
  console.log('Workflow completed:', form);
  showWorkflow.value = false;
};
</script>
```

### Pattern 3: Dialog with Async Loading

```vue
<template>
  <v-dialog v-model="showDialog" max-width="500px" persistent>
    <template v-slot:activator="{ props }">
      <button v-bind="props">Load Data</button>
    </template>

    <v-card>
      <v-card-title>Loading Data</v-card-title>

      <v-card-text v-if="isLoading">
        <v-progress-linear indeterminate></v-progress-linear>
        Loading...
      </v-card-text>

      <v-card-text v-else-if="error">
        <v-alert type="error" :text="error"></v-alert>
      </v-card-text>

      <v-card-text v-else>
        <p v-for="item in data" :key="item.id">{{ item.name }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <button @click="showDialog = false" :disabled="isLoading">Close</button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const showDialog = ref(false);
const isLoading = ref(false);
const error = ref(null);
const data = ref([]);

watch(showDialog, async (newValue) => {
  if (newValue) {
    isLoading.value = true;
    error.value = null;
    data.value = [];

    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to load');
      data.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
});
</script>
```

---

## 14. Best Practices

### DO

✅ **Do use dialogs for critical decisions** - Deletions, confirmations, important alerts
✅ **Do keep content focused** - Dialogs should handle one task
✅ **Do provide clear actions** - Explicit button labels (not just "OK" / "Cancel")
✅ **Do use persistent for important actions** - Prevent accidental dismissal
✅ **Do implement proper form validation** - Give feedback before submission
✅ **Do handle async operations** - Show loading states during API calls
✅ **Do make them accessible** - Proper ARIA labels, keyboard support
✅ **Do use scrollable for long content** - Better UX than overflow
✅ **Do return focus after close** - Improves keyboard navigation

### DON'T

❌ **Don't overuse dialogs** - They interrupt user flow; use for important content only
❌ **Don't nest dialogs** - Avoid dialog within dialog; breaks UX
❌ **Don't make them too large** - Use `max-width` to constrain size
❌ **Don't disable ESC key dismissal** - Use `persistent` instead if needed
❌ **Don't put critical content in modals alone** - Provide alternative access
❌ **Don't skip validation feedback** - Always explain validation errors
❌ **Don't use for navigation** - Dialogs are for tasks, not navigation
❌ **Don't auto-close without warning** - Let users control closure

---

## 15. Gotchas & Common Issues

### Issue 1: Dialog Not Closing on Outside Click

**Problem:** Dialog has `persistent="true"` set
**Solution:** Remove `persistent` prop unless it's intentional, or provide explicit close button

### Issue 2: Scrollable Not Working

**Problem:** `scrollable` prop set but content doesn't scroll
**Solution:** Ensure `v-card-text` has a fixed height (e.g., `style="height: 400px"`)

### Issue 3: Form Not Validating in Dialog

**Problem:** Form validation not triggering
**Solution:** Ensure form ref is properly accessed: `await form.value.validate()`

### Issue 4: Focus Not Returning

**Problem:** Focus remains on overlay after dialog closes
**Solution:** Ensure `retain-focus` is not set to `false` unless necessary

### Issue 5: Dialog Behind Other Elements

**Problem:** Dialog appears behind other content
**Solution:** Check z-index or use `attach` prop to specify mount location

### Issue 6: Activator Slot Not Responsive

**Problem:** Trigger button is not clickable
**Solution:** Ensure event listeners are properly bound from `props` object

---

## 16. Related Components

- **v-card** - Container for dialog content (v-card-title, v-card-text, v-card-actions)
- **v-form** - Form validation within dialogs
- **v-text-field, v-select, v-checkbox** - Form inputs in dialogs
- **v-progress-circular, v-progress-linear** - Loading indicators in dialogs
- **v-stepper** - Multi-step workflows in dialogs
- **v-sheet** - Alternative container for dialog content
- **v-menu** - For simpler overlay needs (not modal)
- **v-bottom-sheet** - Mobile-optimized alternative to dialogs

---

## 17. Accessibility Notes

### Keyboard Navigation
- **Tab**: Move focus to next element (trapped within dialog)
- **Shift+Tab**: Move focus to previous element
- **Escape**: Close dialog (unless persistent)
- **Enter**: Activate focused button
- **Space**: Toggle checkboxes/radio buttons

### Screen Reader Announcements
- Dialog title is announced when opened
- Content changes are announced
- Form errors are announced
- Button purposes are clearly stated

### WCAG 2.1 Compliance
- Level A: Basic functionality and structure
- Level AA: Enhanced contrast, keyboard accessibility (recommended minimum)
- Level AAA: Advanced features, extended descriptions

### Testing with Assistive Technology
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

---

## Summary

Vuetify's v-dialog component is a **modal overlay** designed for important user interactions. Key characteristics:

**Strengths:**
- Clean, Vue-integrated API
- Built-in accessibility features
- Flexible sizing and positioning
- Rich content support via v-card
- Multiple transition options
- Easy form integration

**Limitations:**
- Intrusive by design (use sparingly)
- Focus management requires care
- Scrollable needs explicit height
- Limited nested dialog support

**Best For:** Confirmations, form submissions, important alerts, critical decision points, and task-specific workflows that require user interaction before proceeding.

---

**Research Completed:** 2025-11-05
**Component:** Dialog (v-dialog)
**Framework:** Vuetify
**Documentation:** https://vuetifyjs.com/en/components/dialogs
