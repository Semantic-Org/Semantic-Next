# Vuetify - Expansion Panels Component

## Component Overview

The Vuetify Expansion Panels component (also known as Accordion) is a lightweight container that hides and reveals information behind expandable and collapsible panels. It is commonly used to organize related content into collapsible sections, reducing visual clutter while providing users with the ability to reveal detailed information on demand. Typical use cases include FAQs, feature lists, documentation sections, settings panels, and multi-step forms.

### Key Characteristics
- **Light-weight**: Minimal DOM overhead and efficient rendering
- **Accessible**: Follows WAI-ARIA standards for disclosure patterns
- **Flexible**: Supports both single and multiple panel expansion
- **Customizable**: Extensive styling and behavioral configuration options
- **Vue-Integrated**: Native Vue component with full reactivity support

---

## Component Hierarchy

### Primary Components

**`v-expansion-panels`** - Root container component that manages the overall accordion behavior and state

**`v-expansion-panel`** - Individual panel that can be expanded or collapsed, containing a header and content area

### Optional Components (for enhanced structure)

**`v-expansion-panel-title`** - Explicit title component within a panel (alternative to `title` prop)

**`v-expansion-panel-text`** - Explicit content wrapper within a panel (alternative to slot)

---

## Usage Patterns

### Basic Usage

**Simplest Implementation:**
```vue
<v-expansion-panels>
  <v-expansion-panel title="Section 1">
    Content for section 1
  </v-expansion-panel>
  <v-expansion-panel title="Section 2">
    Content for section 2
  </v-expansion-panel>
  <v-expansion-panel title="Section 3">
    Content for section 3
  </v-expansion-panel>
</v-expansion-panels>
```

**With Explicit Title and Text Components:**
```vue
<v-expansion-panels>
  <v-expansion-panel>
    <v-expansion-panel-title>
      Section 1
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      Content for section 1
    </v-expansion-panel-text>
  </v-expansion-panel>

  <v-expansion-panel>
    <v-expansion-panel-title>
      Section 2
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      Content for section 2
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>
```

### Variants/Styles

#### Accordion Mode (Mutually Exclusive)

When `accordion` prop is set on `v-expansion-panels`, only one panel can be expanded at a time:

```vue
<v-expansion-panels accordion>
  <v-expansion-panel title="Only one can be open">
    Content A
  </v-expansion-panel>
  <v-expansion-panel title="Opens when you click this">
    Content B
  </v-expansion-panel>
</v-expansion-panels>
```

#### Multiple Expansion Mode (Default)

Without `accordion` prop, multiple panels can be open simultaneously:

```vue
<v-expansion-panels>
  <v-expansion-panel title="Section 1">
    Can be open independently
  </v-expansion-panel>
  <v-expansion-panel title="Section 2">
    While others are also open
  </v-expansion-panel>
</v-expansion-panels>
```

#### Inset Style

The `inset` prop removes margins around active panels for a cleaner appearance:

```vue
<v-expansion-panels inset>
  <v-expansion-panel title="Inset Style">
    No margins around the active panel
  </v-expansion-panel>
</v-expansion-panels>
```

#### Flat Style

The `flat` prop removes elevation/shadow effects:

```vue
<v-expansion-panels flat>
  <v-expansion-panel title="Flat Style">
    No box shadow or elevation
  </v-expansion-panel>
</v-expansion-panels>
```

#### Popout Style

The `popout` prop creates a distinct visual separation with the active panel appearing to "pop out":

```vue
<v-expansion-panels popout>
  <v-expansion-panel title="Popout Effect">
    Active panel stands out visually
  </v-expansion-panel>
</v-expansion-panels>
```

#### Themed/Colored Panels

```vue
<v-expansion-panels>
  <v-expansion-panel
    title="Custom Color"
    bg-color="blue-lighten-4"
  >
    Background color applied to panel
  </v-expansion-panel>
</v-expansion-panels>
```

### States

#### Default State (Closed)

All panels are closed by default unless `model-value` specifies otherwise:

```vue
<v-expansion-panels>
  <v-expansion-panel title="Closed by default">
    This is hidden initially
  </v-expansion-panel>
</v-expansion-panels>
```

#### Expanded State

Control which panels are initially expanded using the `model-value` prop:

```vue
<script setup>
import { ref } from 'vue'

const openPanels = ref([0, 2]) // Expands panels at index 0 and 2
</script>

<template>
  <v-expansion-panels v-model="openPanels">
    <v-expansion-panel title="Initially Expanded">
      Open on mount
    </v-expansion-panel>
    <v-expansion-panel title="Closed">
      Hidden initially
    </v-expansion-panel>
    <v-expansion-panel title="Initially Expanded">
      Also open on mount
    </v-expansion-panel>
  </v-expansion-panels>
</template>
```

#### Disabled State

Individual panels can be disabled:

```vue
<v-expansion-panel
  title="Disabled Panel"
  disabled
>
  Cannot be clicked or expanded
</v-expansion-panel>
```

#### Accordion Mode with Readonly

Combine `accordion` mode with `readonly` to prevent closing:

```vue
<v-expansion-panels accordion readonly>
  <v-expansion-panel title="Always Has One Open">
    One panel must remain open
  </v-expansion-panel>
  <v-expansion-panel title="Cannot be closed">
    Closing is prevented
  </v-expansion-panel>
</v-expansion-panels>
```

#### Readonly Mode

Prevents user interaction while preserving visibility:

```vue
<v-expansion-panels readonly>
  <v-expansion-panel title="View Only">
    Content cannot be toggled
  </v-expansion-panel>
</v-expansion-panels>
```

### Sizing Options

#### Height Control

Use the `height` prop on individual panels:

```vue
<v-expansion-panel
  title="Custom Height"
  height="300"
>
  Fixed height content area
</v-expansion-panel>
```

#### Title Padding and Spacing

Customize padding via style props:

```vue
<v-expansion-panels>
  <v-expansion-panel
    title="Padded Title"
    :class="{ 'pa-4': true }"
  >
    Content with custom padding
  </v-expansion-panel>
</v-expansion-panels>
```

### Layout & Positioning

#### Nested Panels

Create nested accordion structures for hierarchical organization:

```vue
<v-expansion-panels accordion>
  <v-expansion-panel title="Category 1">
    <v-expansion-panels accordion>
      <v-expansion-panel title="Subcategory 1.1">
        Nested content
      </v-expansion-panel>
      <v-expansion-panel title="Subcategory 1.2">
        Nested content
      </v-expansion-panel>
    </v-expansion-panels>
  </v-expansion-panel>

  <v-expansion-panel title="Category 2">
    Other content
  </v-expansion-panel>
</v-expansion-panels>
```

#### Multiple Expansion Panels on Page

```vue
<script setup>
import { ref } from 'vue'

const section1Open = ref([])
const section2Open = ref([])
</script>

<template>
  <v-container>
    <h2>Section 1</h2>
    <v-expansion-panels v-model="section1Open" accordion>
      <v-expansion-panel title="Panel 1">Content</v-expansion-panel>
      <v-expansion-panel title="Panel 2">Content</v-expansion-panel>
    </v-expansion-panels>

    <h2>Section 2</h2>
    <v-expansion-panels v-model="section2Open" accordion>
      <v-expansion-panel title="Panel 3">Content</v-expansion-panel>
      <v-expansion-panel title="Panel 4">Content</v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
```

### Content & Structure

#### Rich Text Content

```vue
<v-expansion-panel title="Rich Content">
  <h3>Heading</h3>
  <p>Paragraph with <strong>bold</strong> and <em>italic</em> text</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
</v-expansion-panel>
```

#### Component Content

Nest other Vue components within panels:

```vue
<v-expansion-panel title="With Components">
  <v-card>
    <v-card-text>
      Card content inside expansion panel
    </v-card-text>
  </v-card>
</v-expansion-panel>
```

#### Icons in Titles

```vue
<v-expansion-panel>
  <template #title>
    <v-icon>mdi-information</v-icon>
    <span>Panel with Icon</span>
  </template>

  Content with icon in title
</v-expansion-panel>
```

#### Custom Header Content

```vue
<v-expansion-panel>
  <template #title>
    <div class="d-flex justify-space-between w-100">
      <span>Title</span>
      <v-chip>Badge</v-chip>
    </div>
  </template>

  Custom header content alongside title
</v-expansion-panel>
```

#### Prepend/Append Content

```vue
<v-expansion-panel
  title="Title"
  :class="{ 'bg-blue-lighten-5': true }"
>
  <template #prepend>
    <v-icon>mdi-folder</v-icon>
  </template>

  Content area

  <template #append>
    <v-spacer></v-spacer>
    <v-icon>mdi-check</v-icon>
  </template>
</v-expansion-panel>
```

### Interactive Features

#### Controlled Expansion

Use `v-model` binding for full control over which panels are open:

```vue
<script setup>
import { ref } from 'vue'

const activePanel = ref(0)

function openPanel(index) {
  activePanel.value = index
}

function closeAll() {
  activePanel.value = []
}
</script>

<template>
  <div>
    <v-btn @click="openPanel(0)">Open Panel 1</v-btn>
    <v-btn @click="closeAll">Close All</v-btn>

    <v-expansion-panels v-model="activePanel" accordion>
      <v-expansion-panel title="Panel 1">Content 1</v-expansion-panel>
      <v-expansion-panel title="Panel 2">Content 2</v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
```

#### Event Handling

```vue
<script setup>
function onPanelUpdated(value) {
  console.log('Active panels:', value)
}
</script>

<template>
  <v-expansion-panels @update:model-value="onPanelUpdated">
    <v-expansion-panel title="Listen for changes">
      Content
    </v-expansion-panel>
  </v-expansion-panels>
</template>
```

#### Single vs Multiple Selection

**Single Selection (Accordion):**
```vue
<v-expansion-panels accordion v-model="selected">
  <!-- Only one panel open at a time -->
</v-expansion-panels>
```

**Multiple Selection:**
```vue
<v-expansion-panels v-model="selected">
  <!-- Multiple panels can be open -->
</v-expansion-panels>
```

#### Mandatory Selection (One Must Stay Open)

```vue
<v-expansion-panels accordion mandatory>
  <v-expansion-panel title="Must be one open">
    At least one panel is always expanded
  </v-expansion-panel>
</v-expansion-panels>
```

#### Max Panels Open

Limit the number of simultaneously open panels:

```vue
<v-expansion-panels :max="2">
  <v-expansion-panel title="Panel 1">Content 1</v-expansion-panel>
  <v-expansion-panel title="Panel 2">Content 2</v-expansion-panel>
  <v-expansion-panel title="Panel 3">Content 3</v-expansion-panel>
  <!-- Only 2 can be open at once -->
</v-expansion-panels>
```

### Animation & Transitions

#### Default Transitions

Vuetify provides smooth expand/collapse animations by default:

```vue
<v-expansion-panels>
  <v-expansion-panel title="Smooth Transition">
    Content slides and fades smoothly
  </v-expansion-panel>
</v-expansion-panels>
```

#### Custom Transitions

Apply custom Vue transitions:

```vue
<v-expansion-panels>
  <transition-group name="custom">
    <v-expansion-panel
      v-for="(panel, i) in panels"
      :key="i"
      :title="panel.title"
    >
      {{ panel.content }}
    </v-expansion-panel>
  </transition-group>
</v-expansion-panels>
```

### Integration Patterns

#### With Forms

```vue
<v-form @submit.prevent="submitForm">
  <v-expansion-panels accordion>
    <v-expansion-panel title="Step 1: Personal Information">
      <v-text-field label="Name" v-model="form.name"></v-text-field>
      <v-text-field label="Email" v-model="form.email"></v-text-field>
    </v-expansion-panel>

    <v-expansion-panel title="Step 2: Address">
      <v-text-field label="Street" v-model="form.street"></v-text-field>
      <v-text-field label="City" v-model="form.city"></v-text-field>
    </v-expansion-panel>

    <v-expansion-panel title="Step 3: Confirmation">
      <v-checkbox label="Agree to terms" v-model="form.agreed"></v-checkbox>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-btn type="submit">Submit</v-btn>
</v-form>
```

#### FAQ Section

```vue
<template>
  <div>
    <h1>Frequently Asked Questions</h1>
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="(faq, index) in faqs"
        :key="index"
        :title="faq.question"
      >
        {{ faq.answer }}
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const faqs = ref([
  { question: 'How does this work?', answer: 'It works by expanding and collapsing panels.' },
  { question: 'Is it accessible?', answer: 'Yes, it follows WAI-ARIA standards.' }
])
</script>
```

#### Dynamic Content Loading

```vue
<script setup>
import { ref } from 'vue'

const panels = ref([
  { id: 1, title: 'Section 1', content: null, loaded: false }
])

async function loadContent(panelId) {
  const panel = panels.value.find(p => p.id === panelId)
  if (!panel.loaded) {
    const response = await fetch(`/api/content/${panelId}`)
    panel.content = await response.text()
    panel.loaded = true
  }
}
</script>

<template>
  <v-expansion-panels @update:model-value="(val) => val?.forEach(idx => loadContent(panels[idx].id))">
    <v-expansion-panel
      v-for="panel in panels"
      :key="panel.id"
      :title="panel.title"
    >
      <v-skeleton-loader
        v-if="!panel.loaded"
        type="paragraph"
      ></v-skeleton-loader>
      <span v-else>{{ panel.content }}</span>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
```

### Accessibility Features

#### ARIA Disclosure Pattern

Vuetify automatically applies:
- `role="region"` on panels
- `aria-expanded` attribute on titles (true/false)
- `aria-controls` linking title to content
- Proper heading hierarchy

#### Keyboard Navigation

Built-in keyboard support:
- **Tab**: Focus titles in sequence
- **Enter/Space**: Toggle panel expansion
- **Arrow Down/Up**: Navigate between panels (when `tabindex=0`)
- **Home/End**: Jump to first/last panel

#### Semantic HTML

```vue
<!-- Vuetify automatically generates semantic HTML -->
<v-expansion-panel title="Accessible Panel">
  <div role="region" aria-expanded="false" aria-controls="panel-content">
    <h3>Accessible Panel</h3>
  </div>
  <div id="panel-content">Content area</div>
</v-expansion-panel>
```

#### Screen Reader Testing

```vue
<v-expansion-panels>
  <v-expansion-panel title="Fully Accessible">
    <!-- ARIA attributes automatically managed -->
    <!-- Screen readers announce:
         - Panel role and title
         - Expanded/collapsed state
         - Content when revealed
    -->
    Content announced to screen readers
  </v-expansion-panel>
</v-expansion-panels>
```

#### Focus Management

Vuetify manages focus automatically:
- Focus moves to title when opening via keyboard
- Focus trap within modal dialogs (if used)
- Clear visual focus indicators

---

## Key Properties/Props

### VExpansionPanels Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model-value` | `number \| number[]` | - | Controls which panels are open (index or array of indices) |
| `accordion` | `boolean` | `false` | Forces only one panel open at a time |
| `flat` | `boolean` | `false` | Remove elevation/shadow effects |
| `inset` | `boolean` | `false` | Inset panels with no margins around active panel |
| `popout` | `boolean` | `false` | Active panel pops out visually |
| `readonly` | `boolean` | `false` | Prevents opening/closing panels |
| `mandatory` | `boolean` | `false` | Requires at least one panel to remain open (with accordion) |
| `max` | `number` | - | Maximum number of panels that can be open simultaneously |
| `tile` | `boolean` | `false` | Removes border-radius from panels |
| `variant` | `string` | 'default' | Style variant ('default', 'accordion', etc.) |
| `theme` | `string` | - | Vuetify theme name |

### VExpansionPanel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Title text for the panel header |
| `text` | `string` | - | Content text for the panel body |
| `disabled` | `boolean` | `false` | Disables the panel (cannot be clicked) |
| `readonly` | `boolean` | `false` | Makes panel readonly (cannot be toggled) |
| `value` | `any` | - | The value to return when this panel is selected |
| `height` | `string \| number` | - | Fixed height for the panel content area |
| `lazy` | `boolean` | `false` | Defer rendering content until first expansion |
| `eager` | `boolean` | `false` | Immediately render content even if closed |
| `bg-color` | `string` | - | Background color of the panel |
| `color` | `string` | - | Text/border color of the panel |
| `elevation` | `number` | - | Shadow elevation level |
| `rounded` | `string \| number \| boolean` | - | Border radius |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:model-value` | `number \| number[]` | Fired when panels are opened/closed |

### Slots

| Slot | Context | Description |
|------|---------|-------------|
| `default` | - | Panel content |
| `title` | - | Custom title content |
| `text` | - | Custom content area |
| `prepend` | - | Content before title |
| `append` | - | Content after title |

---

## Code Examples

### Example 1: Basic FAQ Accordion

```vue
<script setup>
const faqs = [
  {
    question: 'What is Vuetify?',
    answer: 'Vuetify is a Vue component framework with a comprehensive set of pre-built components.'
  },
  {
    question: 'How do I install Vuetify?',
    answer: 'Install via npm: npm install vuetify'
  },
  {
    question: 'Is Vuetify free?',
    answer: 'Yes, Vuetify is open-source and free to use.'
  }
]

const activePanel = ref(null)
</script>

<template>
  <v-container>
    <h1 class="mb-6">Frequently Asked Questions</h1>

    <v-expansion-panels accordion v-model="activePanel">
      <v-expansion-panel
        v-for="(faq, index) in faqs"
        :key="index"
        :title="faq.question"
      >
        {{ faq.answer }}
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
```

### Example 2: Multi-Step Form

```vue
<script setup>
import { ref } from 'vue'

const step = ref(0)
const form = ref({
  name: '',
  email: '',
  address: '',
  country: '',
  agreeTerms: false
})

function nextStep() {
  if (step.value < 3) {
    step.value++
  }
}

function submitForm() {
  console.log('Form submitted:', form.value)
}
</script>

<template>
  <v-container max-width="600" class="mt-8">
    <h1 class="mb-6">Registration Form</h1>

    <v-expansion-panels v-model="step" accordion mandatory>
      <!-- Step 1 -->
      <v-expansion-panel title="Personal Information">
        <v-text-field
          v-model="form.name"
          label="Full Name"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="form.email"
          label="Email Address"
          type="email"
          variant="outlined"
        ></v-text-field>

        <v-btn @click="nextStep" class="mt-4">Next</v-btn>
      </v-expansion-panel>

      <!-- Step 2 -->
      <v-expansion-panel title="Address">
        <v-text-field
          v-model="form.address"
          label="Street Address"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-select
          v-model="form.country"
          :items="['USA', 'Canada', 'UK', 'Australia']"
          label="Country"
          variant="outlined"
        ></v-select>

        <v-btn @click="nextStep" class="mt-4">Next</v-btn>
      </v-expansion-panel>

      <!-- Step 3 -->
      <v-expansion-panel title="Confirmation">
        <v-checkbox
          v-model="form.agreeTerms"
          label="I agree to the terms and conditions"
        ></v-checkbox>

        <v-btn
          @click="submitForm"
          :disabled="!form.agreeTerms"
          class="mt-4"
          color="success"
        >
          Submit
        </v-btn>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
```

### Example 3: Nested Hierarchy with Icons

```vue
<script setup>
import { ref } from 'vue'

const expanded = ref([])

const categories = [
  {
    id: 0,
    name: 'Getting Started',
    icon: 'mdi-play-circle',
    items: [
      { id: '0-0', title: 'Installation', content: 'Installation guide...' },
      { id: '0-1', title: 'Quick Start', content: 'Quick start guide...' }
    ]
  },
  {
    id: 1,
    name: 'Documentation',
    icon: 'mdi-book-open-variant',
    items: [
      { id: '1-0', title: 'API Reference', content: 'API documentation...' },
      { id: '1-1', title: 'Components', content: 'Component guide...' }
    ]
  }
]
</script>

<template>
  <v-container>
    <v-expansion-panels accordion v-model="expanded">
      <v-expansion-panel
        v-for="category in categories"
        :key="category.id"
      >
        <template #title>
          <v-icon class="mr-2">{{ category.icon }}</v-icon>
          <span>{{ category.name }}</span>
        </template>

        <v-expansion-panels accordion flat :class="{ 'ml-4': true }">
          <v-expansion-panel
            v-for="item in category.items"
            :key="item.id"
            :title="item.title"
          >
            {{ item.content }}
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
```

### Example 4: Dynamic Content with Loading

```vue
<script setup>
import { ref } from 'vue'

const openPanels = ref([])

const sections = [
  { id: 1, title: 'Section 1', url: '/api/section-1' },
  { id: 2, title: 'Section 2', url: '/api/section-2' },
  { id: 3, title: 'Section 3', url: '/api/section-3' }
]

const contentCache = ref({})
const loading = ref({})

async function loadContent(sectionId, url) {
  if (contentCache.value[sectionId]) return

  loading.value[sectionId] = true
  try {
    const response = await fetch(url)
    contentCache.value[sectionId] = await response.text()
  } finally {
    loading.value[sectionId] = false
  }
}

function onPanelsUpdate(value) {
  value?.forEach(index => {
    loadContent(sections[index].id, sections[index].url)
  })
}
</script>

<template>
  <v-container>
    <v-expansion-panels accordion @update:model-value="onPanelsUpdate">
      <v-expansion-panel
        v-for="(section, index) in sections"
        :key="section.id"
        :title="section.title"
      >
        <v-progress-circular
          v-if="loading[section.id]"
          indeterminate
          color="primary"
        ></v-progress-circular>

        <div v-else-if="contentCache[section.id]" v-html="contentCache[section.id]"></div>

        <div v-else>Content not loaded</div>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
```

### Example 5: Styled Accordion with Custom Colors

```vue
<script setup>
import { ref } from 'vue'

const activePanel = ref(0)

const panels = [
  {
    title: 'Design System',
    icon: 'mdi-palette',
    color: 'blue-lighten-4',
    content: 'Our design system follows Material Design principles...'
  },
  {
    title: 'Components',
    icon: 'mdi-puzzle-outline',
    color: 'purple-lighten-4',
    content: 'We provide a comprehensive set of pre-built components...'
  },
  {
    title: 'Theming',
    icon: 'mdi-theme-light-dark',
    color: 'green-lighten-4',
    content: 'Customize colors and styles with our theming system...'
  }
]
</script>

<template>
  <v-container>
    <h1 class="mb-6">Features</h1>

    <v-expansion-panels
      accordion
      popout
      v-model="activePanel"
      class="mb-6"
    >
      <v-expansion-panel
        v-for="(panel, index) in panels"
        :key="index"
        :title="panel.title"
        :bg-color="panel.color"
      >
        <template #prepend>
          <v-icon>{{ panel.icon }}</v-icon>
        </template>

        <v-divider class="my-2"></v-divider>

        {{ panel.content }}

        <v-divider class="my-2"></v-divider>

        <v-chip color="primary" class="mt-4">Learn More</v-chip>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
```

---

## Accessibility Notes

### WAI-ARIA Compliance

Vuetify Expansion Panels automatically implement the WAI-ARIA disclosure pattern:

**Automatic ARIA Attributes:**
- `role="region"` on expanded panels
- `aria-expanded="true|false"` on titles indicating state
- `aria-controls` linking title to content
- Proper semantic heading hierarchy

### Keyboard Navigation Best Practices

```vue
<!-- Ensure proper tab order and focus management -->
<v-expansion-panels>
  <v-expansion-panel
    title="Keyboard Navigable"
    tabindex="0"  <!-- Explicit tabindex if needed -->
  >
    Content accessible via keyboard
  </v-expansion-panel>
</v-expansion-panels>
```

### Screen Reader Support

- Titles are properly announced as interactive elements
- Expanded/collapsed state is announced
- Content is only read when expanded (no hidden content read)
- Nesting structure is preserved and announced

### Color Contrast

Always ensure sufficient contrast between text and background colors:

```vue
<!-- Good: sufficient contrast -->
<v-expansion-panel
  title="Readable"
  bg-color="blue-lighten-5"
  color="blue-darken-3"
>
  Content with good contrast
</v-expansion-panel>
```

### Testing for Accessibility

```javascript
// Test keyboard navigation
test('keyboard navigation', () => {
  const panel = document.querySelector('[role="region"]')
  const title = panel.querySelector('[aria-expanded]')

  // Press Enter to toggle
  title.focus()
  title.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }))

  expect(title.getAttribute('aria-expanded')).toBe('true')
})
```

---

## Common Patterns

### FAQ/Disclosure List
Most common use case - single accordion for frequently asked questions

### Multi-Step Forms
Sequential steps using accordion mode with `mandatory` prop

### Documentation Section Navigation
Organizing documentation into collapsible sections

### Settings/Preferences Panel
Grouping related settings under expandable categories

### Features Showcase
Highlighting different product features in collapsible panels

### Nested Data Hierarchies
Multi-level categorization with nested expansion panels

### Progressive Disclosure
Showing basic information, revealing details on demand

### Content Filtering
Expanding sections based on user selection or categories

---

## Related Components

- **`v-stepper`** - For sequential multi-step processes (alternative for step-by-step)
- **`v-tabs`** - For switching between multiple content areas (alternative)
- **`v-navigation-drawer`** - For side navigation with collapsible sections
- **`v-menu`** - For nested menu-like structures
- **`v-card`** - Often used within expansion panel content for structured information
- **`v-list`** - For list-based content within panels
- **`v-dialog`** - Can contain expansion panels for modal content organization

---

## Performance Considerations

### Lazy Loading Content

```vue
<v-expansion-panel
  title="Lazy Load Content"
  lazy  <!-- Defers rendering until first expansion -->
>
  Content only renders when expanded
</v-expansion-panel>
```

### Eager Rendering

```vue
<v-expansion-panel
  title="Always Rendered"
  eager  <!-- Renders even when closed -->
>
  Content always in DOM (better for small content)
</v-expansion-panel>
```

### Virtual Scrolling for Long Lists

For many panels, consider virtualizing the list:

```vue
<v-virtual-scroll :items="manyPanels" height="600">
  <template #default="{ item }">
    <v-expansion-panel :title="item.title">
      {{ item.content }}
    </v-expansion-panel>
  </template>
</v-virtual-scroll>
```

---

## Browser Compatibility

- **Modern browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **IE11**: Requires polyfills for ES6+ features
- **Mobile**: Full support with touch-friendly interactions
- **Screen readers**: Tested with NVDA, JAWS, VoiceOver, TalkBack

---

## Theming Integration

### Vuetify Theme System

```javascript
// In vuetify.js or theme configuration
const theme = {
  themes: {
    light: {
      colors: {
        // Custom expansion panel colors
        'expansion-panel-bg': '#ffffff',
        'expansion-panel-border': '#e0e0e0'
      }
    }
  }
}
```

### CSS Variables

```css
/* Custom styling via CSS variables */
:root {
  --v-expansion-panel-bg: #ffffff;
  --v-expansion-panel-padding: 16px;
  --v-expansion-transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Known Limitations

1. **Nested Animation**: Deeply nested panels may have animation performance impact
2. **Height Calculation**: Custom heights can conflict with content overflow
3. **Mobile Keyboard**: Mobile keyboard can cause layout shift when closing panels
4. **Accordion + Max**: `accordion` mode ignores `max` prop (use one or the other)
5. **Content Measurement**: Very tall content may cause layout thrashing during animation

---

## Migration from Earlier Versions

### v2 to v3 Breaking Changes

**Template prop renamed:**
```vue
<!-- v2 -->
<v-expansion-panel title="Title">Content</v-expansion-panel>

<!-- v3 - same API, internal changes -->
<v-expansion-panel title="Title">Content</v-expansion-panel>
```

**Event handling:**
```vue
<!-- v2 -->
<v-expansion-panels @change="handler">

<!-- v3 - use update:model-value -->
<v-expansion-panels @update:model-value="handler">
```

---

## Research Metadata

- **Research Date**: November 5, 2025
- **Component**: Expansion Panels (Accordion)
- **Framework**: Vuetify
- **Documentation**: https://vuetifyjs.com/en/components/expansion-panels
- **Version**: Vuetify 3.x (latest)
- **Status**: Stable, actively maintained
- **Use Cases Analyzed**: FAQ, Forms, Settings, Hierarchies, Documentation

---

**Document Version**: 1.0
**Last Updated**: November 5, 2025
**Maintainer**: AI Research Agent
