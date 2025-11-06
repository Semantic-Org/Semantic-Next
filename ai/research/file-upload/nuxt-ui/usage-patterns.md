# Nuxt UI File Upload Component - Usage Patterns

**Framework**: Nuxt UI
**Version**: v4.1.0
**Component**: FileUpload
**Documentation URL**: https://ui.nuxt.com/components/file-upload
**Research Date**: 2025-11-06

---

## Component Definition

The `UFileUpload` component is a Vue-based file upload interface that provides comprehensive file selection and management capabilities. It combines native HTML file input functionality with enhanced UI features including drag-and-drop zones, multiple file support, visual feedback, and form validation integration. The component is designed to handle both single and multiple file uploads with flexible display layouts and customization options.

The component wraps the native file input element while providing a richer user experience through dropzone interaction, file preview capabilities, and tight integration with Nuxt UI's form validation system.

---

## Core Features

### File Selection and Management
- **Single and multiple file modes**: Toggle between single file (`v-model="file"`) and multiple files (`v-model="files"`) using the `multiple` prop
- **Drag-and-drop support**: Built-in dropzone functionality enabled by default via the `dropzone` prop
- **Clickable trigger**: Interactive area that opens the native file browser when clicked (controlled by `interactive` prop)
- **File removal**: Programmatic file removal through exposed `removeFile(index?)` method
- **File type filtering**: Accept specific file types using MIME types or file extensions via the `accept` prop

### Display and Layout
- **Two primary variants**: `'area'` (default dropzone interface) and `'button'` (button-style trigger, single file only)
- **Multiple layout modes**: Grid layout for visual thumbnails and list layout for detailed file information
- **Flexible positioning**: File list can be positioned `'inside'` or `'outside'` (default) the upload area
- **Size variants**: Five size options from `'xs'` to `'xl'` for different use cases
- **Visual feedback**: Highlight state for validation and interaction feedback

### Form Integration
- **Native form support**: Works with standard HTML forms using the `name` attribute
- **UForm integration**: Seamless integration with Nuxt UI's form validation system
- **UFormField compatibility**: Supports field-level validation and error display
- **Zod schema validation**: Validate file size, type, dimensions, and custom rules

### Customization
- **Slot system**: Four slots for custom content (`default`, `actions`, `files-top`, `files-bottom`)
- **Icon customization**: Configurable upload icon with global defaults
- **Theme integration**: Color scheme support aligned with design tokens
- **Label and description**: Built-in text elements for user guidance

---

## Props API

### Element and Identity

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `any` | `'div'` | The element or component to render as the root |
| `id` | `string` | `undefined` | HTML id attribute for the component |
| `name` | `string` | `undefined` | Form field name for the underlying file input |

### Visual Appearance

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string \| object` | `appConfig.ui.icons.upload` | Icon displayed in the upload area |
| `label` | `string` | `undefined` | Primary text label displayed to users |
| `description` | `string` | `undefined` | Supplementary descriptive text below the label |
| `color` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "error" \| "neutral"` | `'primary'` | Theme color scheme for the component |
| `variant` | `"button" \| "area"` | `'area'` | Display style: dropzone area or button trigger |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `'md'` | Component dimensions and spacing |
| `highlight` | `boolean` | `undefined` | Visual emphasis state for validation feedback |

### Layout Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `"list" \| "grid"` | `'grid'` | File display arrangement (list or grid view) |
| `position` | `"inside" \| "outside"` | `'outside'` | File list placement relative to upload area |

### Behavioral Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Enable selection of multiple files |
| `dropzone` | `boolean` | `true` | Enable drag-and-drop functionality |
| `interactive` | `boolean` | `true` | Allow clicking to trigger file selection |
| `accept` | `string` | `undefined` | Allowed file types (MIME types or extensions) |

### Data Binding

| Prop | Type | Description |
|------|------|-------------|
| `v-model` | `File \| File[]` | Two-way binding for selected file(s). Type depends on `multiple` prop |

---

## Usage Patterns

### Basic Single File Upload

```vue
<template>
  <UFileUpload
    v-model="selectedFile"
    label="Upload Document"
    description="PDF, DOC, or DOCX up to 5MB"
    accept=".pdf,.doc,.docx"
  />
</template>

<script setup>
const selectedFile = ref(null)
</script>
```

### Multiple File Upload with Grid Layout

```vue
<template>
  <UFileUpload
    v-model="files"
    multiple
    layout="grid"
    label="Upload Images"
    description="Select multiple images"
    accept="image/*"
  />
</template>

<script setup>
const files = ref([])
</script>
```

### Button Variant (Single File Only)

```vue
<template>
  <UFileUpload
    v-model="file"
    variant="button"
    label="Choose File"
    color="primary"
    size="lg"
  />
</template>

<script setup>
const file = ref(null)
</script>
```

### Custom Interaction with Slot Methods

```vue
<template>
  <UFileUpload v-model="files" multiple>
    <template #default="{ open, removeFile }">
      <div>
        <button @click="open">Select Files</button>
        <button @click="removeFile()">Clear All</button>
      </div>
    </template>
  </UFileUpload>
</template>

<script setup>
const files = ref([])
</script>
```

### List Layout with Inside Positioning

```vue
<template>
  <UFileUpload
    v-model="files"
    multiple
    layout="list"
    position="inside"
    label="Upload Attachments"
  />
</template>

<script setup>
const files = ref([])
</script>
```

### Programmatic File Management

```vue
<template>
  <UFileUpload v-model="files" multiple ref="uploader" />
  <button @click="removeLastFile">Remove Last</button>
  <button @click="clearAll">Clear All</button>
</template>

<script setup>
const files = ref([])
const uploader = ref(null)

const removeLastFile = () => {
  if (files.value.length > 0) {
    uploader.value.removeFile(files.value.length - 1)
  }
}

const clearAll = () => {
  uploader.value.removeFile()
}
</script>
```

---

## Variants and Composition

### Variant Types

#### Area Variant (Default)
The `area` variant displays a dropzone interface with drag-and-drop support. This is the most feature-rich variant and supports both single and multiple file uploads.

**Characteristics**:
- Full dropzone experience with visual feedback
- Supports drag-and-drop operations
- Can display file list inside or outside the upload area
- Works with both grid and list layouts
- Suitable for prominent upload interfaces

```vue
<UFileUpload
  v-model="files"
  variant="area"
  multiple
  dropzone
  layout="grid"
/>
```

#### Button Variant
The `button` variant displays a compact button-style trigger. This variant is **only available for single file uploads**.

**Characteristics**:
- Compact, button-like appearance
- No dropzone functionality
- Opens file browser on click
- Suitable for inline or space-constrained layouts
- Limited to single file selection

```vue
<UFileUpload
  v-model="file"
  variant="button"
  label="Choose File"
  size="md"
/>
```

### Layout Configurations

#### Grid Layout
Displays selected files as thumbnail cards in a grid arrangement. Ideal for visual file types like images.

```vue
<UFileUpload
  v-model="files"
  layout="grid"
  multiple
  accept="image/*"
/>
```

#### List Layout
Displays files in a vertical list with detailed information. Better for document-type files where metadata is important.

```vue
<UFileUpload
  v-model="files"
  layout="list"
  multiple
/>
```

### Positioning Options

#### Outside Positioning (Default)
File list appears below the upload area, creating a clear visual separation.

```vue
<UFileUpload
  v-model="files"
  position="outside"
  multiple
/>
```

#### Inside Positioning
File list appears within the upload area boundary, creating a more compact interface.

```vue
<UFileUpload
  v-model="files"
  position="inside"
  multiple
/>
```

### Slot-Based Customization

#### Default Slot (Complete Custom Interface)

```vue
<UFileUpload v-model="files" multiple>
  <template #default="{ open, removeFile }">
    <div class="custom-upload-interface">
      <button @click="open">
        <Icon name="i-heroicons-arrow-up-tray" />
        Select Files
      </button>
      <div v-if="files.length">
        {{ files.length }} file(s) selected
        <button @click="removeFile()">Clear</button>
      </div>
    </div>
  </template>
</UFileUpload>
```

#### Actions Slot (Custom Control Buttons)

```vue
<UFileUpload v-model="files" multiple>
  <template #actions="{ open, removeFile }">
    <button @click="open">Browse</button>
    <button @click="removeFile()">Clear All</button>
  </template>
</UFileUpload>
```

#### Files-Top and Files-Bottom Slots

```vue
<UFileUpload v-model="files" multiple>
  <template #files-top>
    <div class="file-count">{{ files.length }} files selected</div>
  </template>

  <template #files-bottom>
    <div class="upload-info">Total size: {{ totalSize }}</div>
  </template>
</UFileUpload>
```

---

## Accessibility

The Nuxt UI FileUpload component provides accessibility through its integration with native HTML file input elements and Vue's semantic rendering patterns.

### Native File Input Foundation
- Uses standard `<input type="file">` element under the hood, inheriting native accessibility features
- Screen readers can announce the file input as a file upload control
- Keyboard navigation works through native browser file selection dialog

### Label Association
- The `label` prop provides visible text that can be associated with the file input
- The `description` prop offers additional context for assistive technologies
- The `id` prop allows explicit label-for-input associations when needed

### Interactive Elements
- The `interactive` prop controls whether the upload area is clickable
- When `interactive="true"`, the entire area acts as a clickable trigger
- Keyboard users can activate the file selection dialog through standard keyboard interactions

### Expected Patterns (Not Explicitly Documented)
While not explicitly detailed in the documentation, standard Vue component accessibility patterns would suggest:
- Focus management for keyboard navigation
- ARIA attributes for state communication
- Role attributes for custom interactive elements
- Screen reader announcements for file selection/removal

**Note**: The documentation does not provide detailed accessibility specifications, ARIA attribute usage, or keyboard shortcut documentation. Implementation details would need to be verified through code inspection or testing.

---

## Responsive Design

### Responsive Behavior
The FileUpload component inherits responsive behavior through Nuxt UI's responsive class utilities. The documentation mentions that the component's header height adjusts to `112px` on screens `1024px` and wider, indicating built-in responsive adjustments.

### Responsive Sizing
Developers can apply responsive sizing using Nuxt UI's utility classes:

```vue
<UFileUpload
  v-model="files"
  class="w-full sm:w-96"
  multiple
/>
```

### Responsive Layouts
Layout and positioning can be controlled responsively through component composition:

```vue
<UFileUpload
  v-model="files"
  :layout="isMobile ? 'list' : 'grid'"
  :position="isMobile ? 'inside' : 'outside'"
  multiple
/>
```

### Dimension Control
The documentation notes that dimension control is achieved through utility classes like `w-96` and `min-h-48` rather than built-in responsive props:

```vue
<UFileUpload
  v-model="files"
  class="w-96 min-h-48"
  multiple
/>
```

**Note**: The component does not appear to have built-in responsive breakpoint props. Responsive behavior is achieved through external utility classes and reactive layout switching based on viewport size.

---

## Theme Integration

### Color Scheme System
The FileUpload component integrates with Nuxt UI's semantic color system through the `color` prop:

```vue
<UFileUpload
  v-model="file"
  color="primary"    <!-- Default -->
/>

<UFileUpload
  v-model="file"
  color="success"    <!-- Success state -->
/>

<UFileUpload
  v-model="file"
  color="error"      <!-- Error state -->
/>
```

**Available Colors**:
- `primary` (default)
- `secondary`
- `success`
- `info`
- `warning`
- `error`
- `neutral`

### Global Icon Configuration
The upload icon can be customized globally through application configuration:

**Nuxt Configuration** (`app.config.ts`):
```typescript
export default defineAppConfig({
  ui: {
    icons: {
      upload: 'i-heroicons-arrow-up-tray'  // Custom icon
    }
  }
})
```

**Vue Configuration** (`vite.config.ts`):
```typescript
export default defineConfig({
  plugins: [
    Vue(),
    UI({
      icons: {
        upload: 'i-heroicons-arrow-up-tray'
      }
    })
  ]
})
```

### Per-Instance Icon Customization
Icons can also be overridden on individual component instances:

```vue
<UFileUpload
  v-model="file"
  icon="i-heroicons-document"
/>
```

### Size System
The component supports Nuxt UI's size scale system:

```vue
<UFileUpload v-model="file" size="xs" />  <!-- Extra small -->
<UFileUpload v-model="file" size="sm" />  <!-- Small -->
<UFileUpload v-model="file" size="md" />  <!-- Medium (default) -->
<UFileUpload v-model="file" size="lg" />  <!-- Large -->
<UFileUpload v-model="file" size="xl" />  <!-- Extra large -->
```

### Visual Feedback
The `highlight` prop provides visual emphasis for validation states or user attention:

```vue
<UFileUpload
  v-model="file"
  :highlight="hasError"
  color="error"
/>
```

---

## Related Components

### UForm
The FileUpload component integrates with Nuxt UI's form validation system:

```vue
<UForm :state="form" :schema="schema" @submit="onSubmit">
  <UFileUpload
    v-model="form.file"
    name="file"
    label="Upload Document"
  />
</UForm>
```

### UFormField
Provides field-level validation and error display:

```vue
<UFormField label="Profile Picture" description="Upload your profile picture">
  <UFileUpload
    v-model="profilePicture"
    accept="image/*"
  />
</UFormField>
```

### Form Validation with Zod
The component supports Zod schema validation for comprehensive file validation:

```typescript
import { z } from 'zod'

const schema = z.object({
  file: z.custom<File>()
    .refine(file => file.size <= 5000000, 'File size must be less than 5MB')
    .refine(
      file => ['image/jpeg', 'image/png'].includes(file.type),
      'Only JPEG and PNG images are allowed'
    )
})
```

**Multi-file validation**:
```typescript
const schema = z.object({
  files: z.array(z.custom<File>())
    .min(1, 'At least one file is required')
    .max(5, 'Maximum 5 files allowed')
})
```

**Image dimension validation**:
```typescript
const schema = z.object({
  image: z.custom<File>()
    .refine(async (file) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await img.decode()
      return img.width <= 1920 && img.height <= 1080
    }, 'Image must be 1920x1080 or smaller')
})
```

---

## Framework-Specific Features

### Vue Composition API Integration
The component is designed for Vue 3's Composition API with full TypeScript support:

```vue
<script setup lang="ts">
const selectedFile = ref<File | null>(null)
const selectedFiles = ref<File[]>([])

// Type-safe ref access
const uploader = ref<InstanceType<typeof UFileUpload>>()
</script>
```

### Reactive v-model Binding
Full two-way binding with automatic type inference:

```vue
<script setup>
// Single file mode
const file = ref(null)  // Type: File | null

// Multiple file mode
const files = ref([])   // Type: File[]
</script>

<template>
  <UFileUpload v-model="file" />
  <UFileUpload v-model="files" multiple />
</template>
```

### Slot Scope Methods
The component exposes methods through slot scopes for programmatic control:

```vue
<template>
  <UFileUpload v-model="files" multiple>
    <template #default="{ open, removeFile }">
      <!-- open(): Opens file selection dialog -->
      <!-- removeFile(index?): Removes file at index, or all if no index -->
      <button @click="open">Select</button>
      <button @click="removeFile(0)">Remove First</button>
      <button @click="removeFile()">Clear All</button>
    </template>
  </UFileUpload>
</template>
```

### Nuxt-Specific Features
When used in Nuxt applications, the component integrates with Nuxt's configuration system:

- Global configuration through `app.config.ts`
- Auto-imported component (no explicit import needed)
- SSR-compatible (server-side rendering safe)
- Nuxt module integration with UI configuration

### Vue-Only Usage
The component can be used in standalone Vue applications through Vite configuration:

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import UI from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    Vue(),
    UI({
      icons: {
        upload: 'i-heroicons-arrow-up-tray'
      }
    })
  ]
})
```

---

## Code Examples

### Complete Single File Upload with Validation

```vue
<template>
  <UForm :state="form" :schema="schema" @submit="handleSubmit">
    <UFormField
      label="Upload Resume"
      description="PDF or Word document, max 5MB"
      :error="errors.resume"
    >
      <UFileUpload
        v-model="form.resume"
        name="resume"
        accept=".pdf,.doc,.docx"
        :highlight="!!errors.resume"
        :color="errors.resume ? 'error' : 'primary'"
      />
    </UFormField>

    <button type="submit">Submit Application</button>
  </UForm>
</template>

<script setup>
import { z } from 'zod'

const form = reactive({
  resume: null
})

const errors = reactive({
  resume: null
})

const schema = z.object({
  resume: z.custom<File>()
    .refine(file => file !== null, 'Resume is required')
    .refine(
      file => file.size <= 5000000,
      'File size must be less than 5MB'
    )
    .refine(
      file => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Only PDF and Word documents are allowed'
    )
})

const handleSubmit = async () => {
  // Submit logic
  console.log('Uploading file:', form.resume)
}
</script>
```

### Multiple Image Upload with Grid Preview

```vue
<template>
  <div>
    <UFileUpload
      v-model="images"
      multiple
      accept="image/*"
      layout="grid"
      label="Upload Photos"
      description="Select multiple images (JPEG, PNG)"
      color="primary"
      size="lg"
    >
      <template #files-top>
        <div class="text-sm text-gray-600">
          {{ images.length }} image(s) selected
        </div>
      </template>

      <template #files-bottom>
        <div class="text-sm text-gray-600">
          Total size: {{ formatFileSize(totalSize) }}
        </div>
      </template>
    </UFileUpload>

    <button
      @click="uploadImages"
      :disabled="images.length === 0"
      class="mt-4"
    >
      Upload {{ images.length }} Image(s)
    </button>
  </div>
</template>

<script setup>
const images = ref([])

const totalSize = computed(() => {
  return images.value.reduce((sum, file) => sum + file.size, 0)
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const uploadImages = async () => {
  // Upload logic
  console.log('Uploading images:', images.value)
}
</script>
```

### Custom Drag-and-Drop Interface

```vue
<template>
  <UFileUpload
    v-model="files"
    multiple
    ref="uploader"
  >
    <template #default="{ open, removeFile }">
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="isDragging = false"
        :class="{ 'border-blue-500 bg-blue-50': isDragging }"
      >
        <Icon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 mx-auto mb-4" />

        <h3 class="text-lg font-semibold mb-2">
          {{ isDragging ? 'Drop files here' : 'Drag and drop files' }}
        </h3>

        <p class="text-gray-600 mb-4">or</p>

        <button
          @click="open"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Browse Files
        </button>

        <div v-if="files.length" class="mt-4">
          <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-2 bg-gray-100 rounded mb-2">
            <span class="text-sm">{{ file.name }}</span>
            <button @click="removeFile(index)" class="text-red-500">
              Remove
            </button>
          </div>
        </div>
      </div>
    </template>
  </UFileUpload>
</template>

<script setup>
const files = ref([])
const isDragging = ref(false)
const uploader = ref(null)
</script>
```

### Conditional Variant Based on Context

```vue
<template>
  <div>
    <!-- Desktop: Area variant with dropzone -->
    <UFileUpload
      v-if="!isMobile"
      v-model="file"
      variant="area"
      dropzone
      label="Upload Document"
      description="Drag and drop or click to browse"
      size="lg"
    />

    <!-- Mobile: Button variant for simpler interaction -->
    <UFileUpload
      v-else
      v-model="file"
      variant="button"
      label="Choose File"
      size="md"
    />

    <div v-if="file" class="mt-4">
      Selected: {{ file.name }}
    </div>
  </div>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core'

const file = ref(null)
const isMobile = useMediaQuery('(max-width: 768px)')
</script>
```

### Integration with Form Submission

```vue
<template>
  <UForm :state="formData" @submit="submitForm">
    <UFormField label="Profile Information">
      <input v-model="formData.name" placeholder="Name" />
    </UFormField>

    <UFormField label="Profile Picture" description="JPEG or PNG, max 2MB">
      <UFileUpload
        v-model="formData.avatar"
        accept="image/jpeg,image/png"
        variant="button"
        label="Choose Photo"
      />
    </UFormField>

    <UFormField label="Documents" description="Upload supporting documents">
      <UFileUpload
        v-model="formData.documents"
        multiple
        layout="list"
        position="inside"
      />
    </UFormField>

    <button type="submit">Submit</button>
  </UForm>
</template>

<script setup>
const formData = reactive({
  name: '',
  avatar: null,
  documents: []
})

const submitForm = async () => {
  const data = new FormData()
  data.append('name', formData.name)

  if (formData.avatar) {
    data.append('avatar', formData.avatar)
  }

  formData.documents.forEach((doc, index) => {
    data.append(`document_${index}`, doc)
  })

  // Submit to API
  await fetch('/api/submit', {
    method: 'POST',
    body: data
  })
}
</script>
```

---

## Notes and Observations

### Design Philosophy
The Nuxt UI FileUpload component follows a **progressive enhancement** approach, starting with native file input functionality and layering additional features like drag-and-drop, visual feedback, and form integration. The component prioritizes developer experience through Vue's reactive patterns and TypeScript support.

### Variant Limitations
The **button variant is restricted to single-file mode only**. This is a significant constraint that affects UI design decisions. When multiple file selection is required, developers must use the area variant or implement custom slot-based solutions.

### Type Safety
The component demonstrates strong type inference with v-model binding. The return type automatically adjusts between `File | null` (single mode) and `File[]` (multiple mode) based on the `multiple` prop, providing excellent TypeScript developer experience.

### Slot Method Design
The slot scope pattern (`{ open, removeFile }`) provides a clean API for custom implementations while maintaining the component's internal state management. The `removeFile(index?)` method's optional parameter allows both specific file removal and bulk clearing operations.

### Form Integration Philosophy
The component integrates deeply with Nuxt UI's form ecosystem (`UForm`, `UFormField`) and external validation libraries (Zod). This suggests a **composition-over-configuration** approach where validation logic lives outside the component and is applied through standard form patterns.

### File API Utilization
The documentation demonstrates advanced File API usage, particularly in validation examples (image dimension checking). This indicates that the component expects developers to work directly with File objects and browser APIs for custom requirements.

### Layout Flexibility Trade-offs
The component provides built-in `grid` and `list` layouts but relies on external utility classes for responsive behavior. This keeps the component's API surface small while delegating responsive design to Nuxt UI's utility system.

### Missing Documentation
Several areas lack explicit documentation:
- Detailed accessibility specifications (ARIA attributes, keyboard shortcuts)
- Event emissions beyond v-model updates
- Browser compatibility requirements
- Performance considerations for large file lists
- Server-side upload integration patterns
- Progress indication during upload
- Error handling patterns beyond validation

### Global vs. Local Configuration
The icon customization pattern (global config vs. per-instance props) reflects a **layered configuration strategy** common in component libraries: set sensible defaults globally, override locally when needed.

### State Management Pattern
The component uses Vue's ref/reactive system for state management rather than providing internal state exposure. This keeps the component's API clean and encourages standard Vue patterns for state handling.

### Extensibility Through Slots
The four-slot system (`default`, `actions`, `files-top`, `files-bottom`) provides strategic extension points without overwhelming the component API. The `default` slot in particular enables complete UI replacement while maintaining file management logic.

### Mobile Considerations
While responsive utilities are supported, there's no built-in mobile-optimized variant. The documentation's mention of responsive header sizing (`112px` at `1024px+`) suggests some responsive awareness, but mobile-specific patterns (like camera access) aren't addressed.

### Framework Portability
Despite being "Nuxt UI," the component can be used in standalone Vue applications through Vite configuration. This suggests the "Nuxt" branding may be more about ecosystem than hard technical requirements.
