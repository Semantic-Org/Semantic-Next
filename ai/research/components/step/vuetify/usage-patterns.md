# Vuetify Stepper - Usage Patterns

## Component Overview

The Vuetify Stepper component (`v-stepper`) is a Material Design-based component that provides a linear or non-linear progression process for gathering and displaying information to users. It's commonly used in multi-step forms, wizards, and guided workflows where users need to complete tasks in sequence or navigate between different stages of a process.

**Primary Use Cases:**
- Multi-step forms and registration processes
- Checkout workflows in e-commerce applications
- Guided tutorials and onboarding experiences
- Complex data entry processes broken into manageable steps
- Validation workflows with progressive disclosure

**Component Family:**
- `v-stepper` - Main container component
- `v-stepper-header` - Contains step indicators
- `v-stepper-item` - Individual step header (Vuetify 3)
- `v-stepper-window` - Container for step content windows
- `v-stepper-window-item` - Individual step content
- `v-stepper-actions` - Navigation buttons (prev/next)

## Basic Usage

### Vuetify 3: Two Implementation Approaches

#### Approach 1: Props-Based (Simplified)

```vue
<template>
  <v-stepper
    editable
    :items="['Step 1', 'Step 2', 'Step 3']"
    non-linear
  >
  </v-stepper>
</template>
```

**Advantages:**
- Minimal boilerplate
- Quick setup for simple steppers
- Automatic structure generation

**Disadvantages:**
- Less customization control
- Limited content flexibility

---

#### Approach 2: Template/Slots-Based (Full Control)

```vue
<template>
  <v-stepper>
    <template v-slot:default="{ prev, next }">
      <!-- Step Headers -->
      <v-stepper-header>
        <v-stepper-item
          complete
          editable
          title="Step 1"
          value="1"
        ></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          complete
          editable
          title="Step 2"
          value="2"
        ></v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          editable
          title="Step 3"
          value="3"
        ></v-stepper-item>
      </v-stepper-header>

      <!-- Step Content Windows -->
      <v-stepper-window>
        <v-stepper-window-item value="1">
          <v-card>
            <v-card-text>
              <h3>Step 1 Content</h3>
              <p>Content for the first step</p>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item value="2">
          <v-card>
            <v-card-text>
              <h3>Step 2 Content</h3>
              <p>Content for the second step</p>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item value="3">
          <v-card>
            <v-card-text>
              <h3>Step 3 Content</h3>
              <p>Content for the third step</p>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <!-- Navigation Actions -->
      <v-stepper-actions
        @click:prev="prev"
        @click:next="next"
      ></v-stepper-actions>
    </template>
  </v-stepper>
</template>
```

**Advantages:**
- Full control over content and structure
- Custom navigation logic
- Rich content support
- Granular step configuration

**Disadvantages:**
- More verbose
- Requires understanding of slot structure

---

### Vuetify 2: Legacy Structure

```vue
<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        step="1"
      >
        Name of step 1
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
        :complete="step > 2"
        step="2"
      >
        Name of step 2
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">
        Name of step 3
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card>
          <v-card-text>Content 1</v-card-text>
        </v-card>
        <v-btn color="primary" @click="step = 2">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card>
          <v-card-text>Content 2</v-card-text>
        </v-card>
        <v-btn text @click="step = 1">Back</v-btn>
        <v-btn color="primary" @click="step = 3">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card>
          <v-card-text>Content 3</v-card-text>
        </v-card>
        <v-btn text @click="step = 2">Back</v-btn>
        <v-btn color="primary">Finish</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      step: 1
    }
  }
}
</script>
```

**Note:** Vuetify 2 uses `v-stepper-step`, `v-stepper-items`, and `v-stepper-content`, while Vuetify 3 uses `v-stepper-item`, `v-stepper-window`, and `v-stepper-window-item`.

## Props/API

### v-stepper (Main Container)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` / `modelValue` | `any` | `undefined` | Controls the currently active step |
| `items` | `Array<string \| object>` | `[]` | Array of step items (simplified approach) |
| `editable` | `boolean` | `false` | Makes all steps clickable/editable |
| `non-linear` | `boolean` | `false` | Allows non-sequential navigation (requires `editable` to work) |
| `alt-labels` | `boolean` | `false` | Places step labels below step circles |
| `flat` | `boolean` | `false` | Removes elevation shadow |
| `color` | `string` | `'primary'` | Component color theme |
| `bg-color` | `string` | `undefined` | Background color |
| `elevation` | `number \| string` | `undefined` | Shadow depth (0-24) |
| `rounded` | `boolean \| string` | `undefined` | Border radius style |
| `tile` | `boolean` | `false` | Removes border radius |
| `theme` | `string` | `undefined` | Theme variation |

---

### v-stepper-item (Vuetify 3)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | `undefined` | **Required** - Unique identifier for the step |
| `title` | `string` | `undefined` | Main text label for the step |
| `subtitle` | `string` | `undefined` | Secondary text below the title |
| `complete` | `boolean` | `false` | Marks step as complete (shows checkmark icon) |
| `editable` | `boolean` | `false` | Makes this specific step clickable |
| `disabled` | `boolean` | `false` | Disables interaction with the step |
| `error` | `boolean` | `false` | Shows error state (red color) |
| `icon` | `string` | `undefined` | Custom icon to display |
| `color` | `string` | `'primary'` | Step color when active/complete |
| `complete-icon` | `string` | `'$complete'` | Icon shown when step is complete |
| `edit-icon` | `string` | `'$edit'` | Icon shown when step is editable |
| `error-icon` | `string` | `'$error'` | Icon shown when step has error |

---

### v-stepper-window

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` / `modelValue` | `any` | `undefined` | Controls which window item is visible |
| `continuous` | `boolean` | `false` | Whether windows transition continuously |
| `show-arrows` | `boolean \| string` | `false` | Display navigation arrows |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Transition direction |
| `reverse` | `boolean` | `false` | Reverse transition direction |
| `disabled` | `boolean` | `false` | Disables window transitions |

---

### v-stepper-window-item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | `undefined` | **Required** - Unique identifier matching step |
| `transition` | `string \| boolean` | `undefined` | Custom transition animation |
| `reverse-transition` | `string \| boolean` | `undefined` | Reverse transition animation |
| `eager` | `boolean` | `false` | Forces content to render before being visible |

---

### v-stepper-actions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean \| 'next' \| 'prev'` | `false` | Disables both or specific buttons |
| `prev-text` | `string` | `'$vuetify.stepper.prev'` | Text for previous button |
| `next-text` | `string` | `'$vuetify.stepper.next'` | Text for next button |

**Events:**
- `@click:prev` - Emitted when previous button clicked
- `@click:next` - Emitted when next button clicked

---

### v-stepper-step (Vuetify 2 - Legacy)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `number \| string` | `undefined` | **Required** - Step number or identifier |
| `complete` | `boolean` | `false` | Whether step is complete |
| `editable` | `boolean` | `false` | Whether step is editable/clickable |
| `rules` | `Array<Function>` | `[]` | Validation rules |
| `error-icon` | `string` | `'$vuetify.icons.error'` | Icon shown on error |
| `complete-icon` | `string` | `'$vuetify.icons.complete'` | Icon shown when complete |
| `edit-icon` | `string` | `'$vuetify.icons.edit'` | Icon shown when editable |
| `color` | `string` | `'primary'` | Color theme |

## Common Patterns

### Pattern Category 1: State Management

#### Controlled Stepper with v-model

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
          :editable="step.value <= maxVisitedStep"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <component :is="step.component" />
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        :disabled="isNavigationDisabled"
        @click:prev="handlePrev"
        @click:next="handleNext"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const currentStep = ref(1)
const maxVisitedStep = ref(1)

const steps = [
  { value: 1, title: 'Personal Info', component: PersonalInfoForm },
  { value: 2, title: 'Address', component: AddressForm },
  { value: 3, title: 'Review', component: ReviewStep }
]

// Track the furthest step visited
watch(currentStep, (newStep) => {
  if (newStep > maxVisitedStep.value) {
    maxVisitedStep.value = newStep
  }
})

const isNavigationDisabled = computed(() => {
  return currentStep.value === 1 ? 'prev' :
         currentStep.value === steps.length ? 'next' :
         false
})

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleNext() {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}
</script>
```

---

### Pattern Category 2: Validation Integration

#### Step-by-Step Form Validation

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="(step, index) in steps"
          :key="step.id"
          :value="step.id"
          :title="step.title"
          :complete="step.isValid && step.id < currentStep"
          :error="!step.isValid && step.visited"
          :editable="step.visited"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.id"
          :value="step.id"
        >
          <v-form
            ref="forms"
            v-model="step.isValid"
            @submit.prevent="handleNext"
          >
            <v-card>
              <v-card-text>
                <slot :name="`step-${step.id}`" />
              </v-card-text>
            </v-card>
          </v-form>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:prev="handlePrev"
        @click:next="validateAndNext"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const forms = ref([])

const steps = ref([
  { id: 1, title: 'Account', isValid: false, visited: true },
  { id: 2, title: 'Profile', isValid: false, visited: false },
  { id: 3, title: 'Preferences', isValid: false, visited: false }
])

async function validateAndNext() {
  const currentStepData = steps.value.find(s => s.id === currentStep.value)
  const currentForm = forms.value[currentStep.value - 1]

  const { valid } = await currentForm.validate()

  if (valid) {
    currentStepData.isValid = true
    if (currentStep.value < steps.value.length) {
      currentStep.value++
      steps.value[currentStep.value - 1].visited = true
    }
  } else {
    currentStepData.isValid = false
  }
}

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
</script>
```

---

### Pattern Category 3: Dynamic Steps

#### Conditional Step Rendering

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <template v-for="(step, index) in visibleSteps" :key="step.id">
          <v-stepper-item
            :value="step.id"
            :title="step.title"
            :complete="step.complete"
            editable
          />
          <v-divider v-if="index < visibleSteps.length - 1" />
        </template>
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in visibleSteps"
          :key="step.id"
          :value="step.id"
        >
          <component :is="step.component" :data="formData" />
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)
const formData = ref({
  accountType: null, // 'personal' | 'business'
  hasCompany: false
})

const allSteps = [
  { id: 1, title: 'Account Type', component: AccountTypeStep, condition: () => true },
  { id: 2, title: 'Personal Info', component: PersonalInfoStep, condition: () => formData.value.accountType === 'personal' },
  { id: 3, title: 'Company Info', component: CompanyInfoStep, condition: () => formData.value.accountType === 'business' },
  { id: 4, title: 'Contact', component: ContactStep, condition: () => true },
  { id: 5, title: 'Review', component: ReviewStep, condition: () => true }
]

const visibleSteps = computed(() => {
  return allSteps.filter(step => step.condition())
})
</script>
```

## Orientation Patterns

### Horizontal Stepper (Default)

Horizontal steppers move users along the x-axis through defined steps. This is the default orientation.

```vue
<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-item value="1" title="Step 1" />
      <v-divider />
      <v-stepper-item value="2" title="Step 2" />
      <v-divider />
      <v-stepper-item value="3" title="Step 3" />
    </v-stepper-header>

    <v-stepper-window v-model="step">
      <v-stepper-window-item value="1">
        Content 1
      </v-stepper-window-item>
      <v-stepper-window-item value="2">
        Content 2
      </v-stepper-window-item>
      <v-stepper-window-item value="3">
        Content 3
      </v-stepper-window-item>
    </v-stepper-window>
  </v-stepper>
</template>
```

**Best For:**
- Desktop layouts with horizontal space
- Fewer steps (3-5 recommended)
- Equal-length step titles

---

### Vertical Stepper

**Note:** Vertical stepper functionality was available in Vuetify 2 but is not natively implemented in Vuetify 3. Custom CSS or workarounds are required.

**Vuetify 2 Example:**

```vue
<template>
  <v-stepper v-model="step" vertical>
    <v-stepper-step
      :complete="step > 1"
      step="1"
    >
      Select campaign settings
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card flat>
        <v-card-text>
          Content for step 1
        </v-card-text>
      </v-card>
      <v-btn color="primary" @click="step = 2">
        Continue
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="step > 2"
      step="2"
    >
      Create an ad group
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card flat>
        <v-card-text>
          Content for step 2
        </v-card-text>
      </v-card>
      <v-btn text @click="step = 1">Back</v-btn>
      <v-btn color="primary" @click="step = 3">
        Continue
      </v-btn>
    </v-stepper-content>

    <v-stepper-step step="3">
      Create an ad
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card flat>
        <v-card-text>
          Final step content
        </v-card-text>
      </v-card>
      <v-btn text @click="step = 2">Back</v-btn>
      <v-btn color="primary">Finish</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data: () => ({
    step: 1
  })
}
</script>
```

**Best For:**
- Mobile layouts
- Many steps (6+)
- Longer step descriptions
- Content-heavy steps

## Type Patterns

### Linear Stepper

Linear steppers require users to complete steps in sequence. Users cannot skip ahead to incomplete steps.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
          :editable="step.value < currentStep"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          {{ step.content }}
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:prev="prev"
        @click:next="next"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const steps = [
  { value: 1, title: 'Step 1', content: 'First step content' },
  { value: 2, title: 'Step 2', content: 'Second step content' },
  { value: 3, title: 'Step 3', content: 'Third step content' }
]
</script>
```

**Characteristics:**
- Forward-only progression (unless going back)
- Previous steps become editable after completion
- Current and future steps not clickable
- Enforces sequential workflow

**Use Cases:**
- Payment checkout processes
- Account setup wizards
- Tutorial workflows
- Processes with strict dependencies

---

### Non-Linear Stepper

Non-linear steppers allow users to navigate between steps in any order.

**Important:** The `non-linear` prop alone has no effect. You must also set `editable` prop to enable non-linear navigation.

```vue
<template>
  <v-stepper
    v-model="currentStep"
    editable
    non-linear
  >
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="completedSteps.includes(step.value)"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="!completedSteps.includes(step.value)"
                @click="markComplete(step.value)"
              >
                Mark Complete
              </v-btn>
              <v-chip v-else color="success">
                Completed
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:prev="prev"
        @click:next="next"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const completedSteps = ref([])

const steps = [
  { value: 1, title: 'Personal', content: 'Personal information form' },
  { value: 2, title: 'Billing', content: 'Billing details form' },
  { value: 3, title: 'Shipping', content: 'Shipping address form' }
]

function markComplete(stepValue) {
  if (!completedSteps.value.includes(stepValue)) {
    completedSteps.value.push(stepValue)
  }
}
</script>
```

**Characteristics:**
- All steps are clickable (when `editable` is set)
- Users can jump to any step
- No enforced order
- Completion tracking is manual

**Use Cases:**
- Settings panels with independent sections
- Multi-section forms where order doesn't matter
- Dashboard configuration wizards
- Profile setup with optional sections

---

### Editable Stepper

Makes individual or all steps clickable for navigation.

```vue
<template>
  <v-stepper v-model="currentStep" editable>
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <!-- All steps editable via parent prop -->
        <v-stepper-item
          value="1"
          title="Always Editable"
          :complete="step1Complete"
        />
        <v-divider />

        <!-- Or individual step editable control -->
        <v-stepper-item
          value="2"
          title="Conditionally Editable"
          :editable="step1Complete"
          :complete="step2Complete"
        />
        <v-divider />

        <v-stepper-item
          value="3"
          title="Final Step"
          :editable="step2Complete"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item value="1">
          Step 1 content
        </v-stepper-window-item>
        <v-stepper-window-item value="2">
          Step 2 content
        </v-stepper-window-item>
        <v-stepper-window-item value="3">
          Step 3 content
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const step1Complete = ref(false)
const step2Complete = ref(false)
</script>
```

**Editable Behavior:**
- Parent `editable` prop makes ALL steps clickable
- Individual `editable` prop on `v-stepper-item` for granular control
- Parent prop overrides individual props
- Useful for allowing users to review/edit previous steps

## Status Patterns

### Active Step

The currently active/selected step.

```vue
<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-item
        value="1"
        title="Active when currentStep is 1"
        :complete="currentStep > 1"
      />
      <v-stepper-item
        value="2"
        title="Active when currentStep is 2"
        :complete="currentStep > 2"
      />
      <v-stepper-item
        value="3"
        title="Active when currentStep is 3"
      />
    </v-stepper-header>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'
const currentStep = ref(2) // Step 2 is active
</script>
```

**Visual Indicators:**
- Step number circle is filled with primary color
- Step title is bold/emphasized
- Optional icon changes

---

### Complete Status

Steps that have been completed show a checkmark icon.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.complete"
          :complete-icon="step.completeIcon"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="toggleComplete(step.value)"
                :color="step.complete ? 'error' : 'success'"
              >
                {{ step.complete ? 'Mark Incomplete' : 'Mark Complete' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const steps = ref([
  { value: 1, title: 'Step 1', complete: true, completeIcon: 'mdi-check', content: 'Content 1' },
  { value: 2, title: 'Step 2', complete: false, completeIcon: 'mdi-check', content: 'Content 2' },
  { value: 3, title: 'Step 3', complete: false, completeIcon: 'mdi-check', content: 'Content 3' }
])

function toggleComplete(stepValue) {
  const step = steps.value.find(s => s.value === stepValue)
  if (step) {
    step.complete = !step.complete
  }
}
</script>
```

**Visual Indicators:**
- Checkmark icon replaces step number
- Circle background shows success/primary color
- Step title may change style

---

### Error Status

Steps can show error state for validation failures.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :error="step.hasError"
          :error-icon="step.errorIcon"
          :complete="step.complete"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card>
            <v-card-text>
              <v-alert
                v-if="step.hasError"
                type="error"
                dismissible
                @click:close="clearError(step.value)"
              >
                {{ step.errorMessage }}
              </v-alert>
              {{ step.content }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="simulateError(step.value)">
                Trigger Error
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const steps = ref([
  {
    value: 1,
    title: 'Personal Info',
    hasError: false,
    errorIcon: 'mdi-alert-circle',
    errorMessage: '',
    complete: false,
    content: 'Step 1 content'
  },
  {
    value: 2,
    title: 'Payment',
    hasError: true,
    errorIcon: 'mdi-alert-circle',
    errorMessage: 'Invalid credit card number',
    complete: false,
    content: 'Step 2 content'
  },
  {
    value: 3,
    title: 'Review',
    hasError: false,
    errorIcon: 'mdi-alert-circle',
    errorMessage: '',
    complete: false,
    content: 'Step 3 content'
  }
])

function simulateError(stepValue) {
  const step = steps.value.find(s => s.value === stepValue)
  if (step) {
    step.hasError = true
    step.errorMessage = `Error in ${step.title}`
    step.complete = false
  }
}

function clearError(stepValue) {
  const step = steps.value.find(s => s.value === stepValue)
  if (step) {
    step.hasError = false
    step.errorMessage = ''
  }
}
</script>
```

**Visual Indicators:**
- Error icon replaces step number
- Red color theme applied
- Step is usually editable to allow correction

---

### Disabled Status

Prevents interaction with specific steps.

```vue
<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-item
        value="1"
        title="Available"
        editable
      />
      <v-divider />

      <v-stepper-item
        value="2"
        title="Locked Until Step 1 Complete"
        :disabled="!step1Complete"
        editable
      />
      <v-divider />

      <v-stepper-item
        value="3"
        title="Premium Feature"
        :disabled="!isPremiumUser"
        editable
      />
    </v-stepper-header>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const step1Complete = ref(false)
const isPremiumUser = ref(false)
</script>
```

**Visual Indicators:**
- Grayed out appearance
- Not clickable even if `editable` is true
- May show lock icon

## Content Patterns

### Title and Subtitle

Steps can display both a main title and subtitle for additional context.

```vue
<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-item
        value="1"
        title="Personal Details"
        subtitle="Basic information"
      />
      <v-divider />

      <v-stepper-item
        value="2"
        title="Contact Information"
        subtitle="Phone and email"
      />
      <v-divider />

      <v-stepper-item
        value="3"
        title="Review & Submit"
        subtitle="Confirm your details"
      />
    </v-stepper-header>
  </v-stepper>
</template>
```

**Best Practices:**
- Keep titles concise (2-4 words)
- Use subtitles for clarification
- Subtitles should be shorter than titles
- Consider responsive design (subtitles may hide on mobile)

---

### Custom Icons

Steps can use custom icons instead of step numbers.

```vue
<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-item
        value="1"
        title="Profile"
        icon="mdi-account"
        :complete="step1Complete"
        complete-icon="mdi-check-circle"
      />
      <v-divider />

      <v-stepper-item
        value="2"
        title="Security"
        icon="mdi-shield-lock"
        :complete="step2Complete"
        complete-icon="mdi-check-circle"
      />
      <v-divider />

      <v-stepper-item
        value="3"
        title="Notifications"
        icon="mdi-bell"
        :complete="step3Complete"
        complete-icon="mdi-check-circle"
      />
    </v-stepper-header>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const step1Complete = ref(false)
const step2Complete = ref(false)
const step3Complete = ref(false)
</script>
```

**Note:** Vuetify 2 and earlier versions had limited built-in support for custom step icons. Vuetify 3 added the `icon` prop to `v-stepper-item`.

**Workaround for Limited Icon Support (Vuetify 2):**

```vue
<style>
.v-stepper__step__step .v-icon {
  font-size: 24px;
}
</style>
```

---

### Rich Content Areas

Step windows can contain complex content including forms, cards, and media.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item value="1" title="Images" />
        <v-stepper-item value="2" title="Form" />
        <v-stepper-item value="3" title="Data Table" />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <!-- Image Gallery Step -->
        <v-stepper-window-item value="1">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col v-for="n in 6" :key="n" cols="4">
                  <v-img
                    :src="`https://picsum.photos/200?random=${n}`"
                    aspect-ratio="1"
                    cover
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Form Step -->
        <v-stepper-window-item value="2">
          <v-card flat>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Name"
                  variant="outlined"
                />
                <v-text-field
                  label="Email"
                  type="email"
                  variant="outlined"
                />
                <v-textarea
                  label="Message"
                  variant="outlined"
                />
              </v-form>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Data Table Step -->
        <v-stepper-window-item value="3">
          <v-card flat>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="items"
              />
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' }
]

const items = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' }
]
</script>
```

## Navigation Patterns

### Built-in Actions Component

The simplest navigation using `v-stepper-actions`.

```vue
<template>
  <v-stepper v-model="step">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item value="1" title="Step 1" />
        <v-stepper-item value="2" title="Step 2" />
        <v-stepper-item value="3" title="Step 3" />
      </v-stepper-header>

      <v-stepper-window v-model="step">
        <v-stepper-window-item value="1">Content 1</v-stepper-window-item>
        <v-stepper-window-item value="2">Content 2</v-stepper-window-item>
        <v-stepper-window-item value="3">Content 3</v-stepper-window-item>
      </v-stepper-window>

      <!-- Simple built-in actions -->
      <v-stepper-actions
        @click:prev="prev"
        @click:next="next"
      />
    </template>
  </v-stepper>
</template>
```

**Features:**
- Automatic prev/next buttons
- Automatic disabled state on boundaries
- Localized button text
- Consistent styling

---

### Custom Navigation Controls

Full control over navigation logic and UI.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card flat>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <!-- Custom Navigation -->
      <v-card-actions class="pa-4">
        <v-btn
          v-if="currentStep > 1"
          variant="text"
          @click="handleBack"
        >
          <v-icon start>mdi-chevron-left</v-icon>
          Back
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="currentStep < steps.length"
          color="primary"
          @click="handleNext"
          :loading="isValidating"
        >
          Continue
          <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>

        <v-btn
          v-else
          color="success"
          @click="handleSubmit"
          :loading="isSubmitting"
        >
          Submit
          <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const isValidating = ref(false)
const isSubmitting = ref(false)

const steps = [
  { value: 1, title: 'Step 1', content: 'First step' },
  { value: 2, title: 'Step 2', content: 'Second step' },
  { value: 3, title: 'Step 3', content: 'Final step' }
]

async function handleNext() {
  isValidating.value = true

  // Simulate validation
  await new Promise(resolve => setTimeout(resolve, 500))

  isValidating.value = false
  currentStep.value++
}

function handleBack() {
  currentStep.value--
}

async function handleSubmit() {
  isSubmitting.value = true

  // Simulate submission
  await new Promise(resolve => setTimeout(resolve, 1000))

  isSubmitting.value = false
  console.log('Form submitted!')
}
</script>
```

---

### Clickable Step Headers

Enable navigation by clicking on step headers.

```vue
<template>
  <v-stepper v-model="currentStep" editable non-linear>
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="completedSteps.includes(step.value)"
          editable
          @click="navigateToStep(step.value)"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
            <v-card-actions>
              <v-checkbox
                v-model="completedSteps"
                :value="step.value"
                label="Mark as completed"
              />
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const completedSteps = ref([])

const steps = [
  { value: 1, title: 'Profile', content: 'Profile settings' },
  { value: 2, title: 'Privacy', content: 'Privacy settings' },
  { value: 3, title: 'Notifications', content: 'Notification settings' }
]

function navigateToStep(stepValue) {
  currentStep.value = stepValue
}
</script>
```

**Important Notes:**
- Requires both `editable` and `non-linear` props on parent `v-stepper`
- Without `editable`, step headers are not clickable
- `non-linear` alone has no effect (known issue in Vuetify 3.5.2)

---

### Progress-Based Navigation

Navigate based on completion percentage.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
        />
      </v-stepper-header>

      <!-- Progress Indicator -->
      <v-progress-linear
        :model-value="progressPercentage"
        color="primary"
        height="6"
      />

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          {{ step.content }}
        </v-stepper-window-item>
      </v-stepper-window>

      <v-card-actions class="justify-space-between pa-4">
        <div class="text-caption">
          Step {{ currentStep }} of {{ steps.length }}
          ({{ progressPercentage }}% complete)
        </div>

        <div>
          <v-btn
            v-if="currentStep > 1"
            variant="text"
            @click="prev"
          >
            Back
          </v-btn>
          <v-btn
            v-if="currentStep < steps.length"
            color="primary"
            @click="next"
          >
            Next
          </v-btn>
          <v-btn
            v-else
            color="success"
          >
            Finish
          </v-btn>
        </div>
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)

const steps = [
  { value: 1, title: 'Step 1', content: 'Content 1' },
  { value: 2, title: 'Step 2', content: 'Content 2' },
  { value: 3, title: 'Step 3', content: 'Content 3' },
  { value: 4, title: 'Step 4', content: 'Content 4' }
]

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / steps.length) * 100)
})
</script>
```

## Progress Patterns

### Linear Progress Indicator

Shows overall completion as a percentage or fraction.

```vue
<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Multi-Step Form</span>
      <v-chip color="primary" small>
        {{ currentStep }}/{{ totalSteps }}
      </v-chip>
    </v-card-title>

    <v-progress-linear
      :model-value="(currentStep / totalSteps) * 100"
      color="primary"
      height="4"
    />

    <v-stepper v-model="currentStep" flat>
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            v-for="n in totalSteps"
            :key="n"
            :value="n"
            :title="`Step ${n}`"
            :complete="n < currentStep"
          />
        </v-stepper-header>

        <v-stepper-window v-model="currentStep">
          <v-stepper-window-item
            v-for="n in totalSteps"
            :key="n"
            :value="n"
          >
            Step {{ n }} content
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions @click:prev="prev" @click:next="next" />
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const totalSteps = 5
</script>
```

---

### Step Completion Tracking

Track which steps have been completed vs just visited.

```vue
<template>
  <v-stepper v-model="currentStep" editable non-linear>
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.id"
          :value="step.id"
          :title="step.title"
          :complete="step.completed"
          :error="step.visited && !step.completed && currentStep !== step.id"
          editable
        >
          <template v-slot:subtitle>
            <span v-if="step.completed" class="text-success">
              Completed
            </span>
            <span v-else-if="step.visited" class="text-warning">
              Incomplete
            </span>
            <span v-else class="text-grey">
              Not started
            </span>
          </template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.id"
          :value="step.id"
        >
          <v-card>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
            <v-card-actions>
              <v-checkbox
                :model-value="step.completed"
                @update:model-value="updateStepCompletion(step.id, $event)"
                label="Mark this step as completed"
              />
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-card-actions class="pa-4">
        <v-chip :color="allCompleted ? 'success' : 'warning'">
          {{ completedCount }}/{{ steps.length }} completed
        </v-chip>

        <v-spacer />

        <v-stepper-actions @click:prev="handlePrev" @click:next="handleNext" />
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const currentStep = ref(1)

const steps = ref([
  { id: 1, title: 'Profile', content: 'Profile content', completed: false, visited: true },
  { id: 2, title: 'Security', content: 'Security content', completed: false, visited: false },
  { id: 3, title: 'Preferences', content: 'Preferences content', completed: false, visited: false }
])

// Mark step as visited when navigated to
watch(currentStep, (newStep) => {
  const step = steps.value.find(s => s.id === newStep)
  if (step) {
    step.visited = true
  }
})

const completedCount = computed(() => {
  return steps.value.filter(s => s.completed).length
})

const allCompleted = computed(() => {
  return completedCount.value === steps.value.length
})

function updateStepCompletion(stepId, completed) {
  const step = steps.value.find(s => s.id === stepId)
  if (step) {
    step.completed = completed
  }
}

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleNext() {
  if (currentStep.value < steps.value.length) {
    currentStep.value++
  }
}
</script>
```

---

### Circular Progress Indicators

Alternative visual representation of progress.

```vue
<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Setup Wizard</span>
      <v-progress-circular
        :model-value="progressPercentage"
        :size="60"
        :width="6"
        color="primary"
      >
        {{ progressPercentage }}%
      </v-progress-circular>
    </v-card-title>

    <v-stepper v-model="currentStep">
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            v-for="step in steps"
            :key="step.value"
            :value="step.value"
            :title="step.title"
            :complete="step.value < currentStep"
          />
        </v-stepper-header>

        <v-stepper-window v-model="currentStep">
          <v-stepper-window-item
            v-for="step in steps"
            :key="step.value"
            :value="step.value"
          >
            {{ step.content }}
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions @click:prev="prev" @click:next="next" />
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)

const steps = [
  { value: 1, title: 'Account', content: 'Account setup' },
  { value: 2, title: 'Profile', content: 'Profile details' },
  { value: 3, title: 'Complete', content: 'All done!' }
]

const progressPercentage = computed(() => {
  return Math.round((currentStep.value / steps.length) * 100)
})
</script>
```

## Header Patterns

### Alternate Labels

Places step labels below the step indicator circles instead of to the right.

```vue
<template>
  <v-stepper v-model="step" alt-labels>
    <v-stepper-header>
      <v-stepper-item
        value="1"
        title="Select campaign settings"
      />
      <v-divider />

      <v-stepper-item
        value="2"
        title="Create an ad group"
      />
      <v-divider />

      <v-stepper-item
        value="3"
        title="Create an ad"
      />
    </v-stepper-header>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'
const step = ref(1)
</script>
```

**Use Cases:**
- Horizontal steppers with limited width
- Longer step titles that need more space
- Better visual hierarchy
- Mobile-responsive layouts

---

### Condensed Headers

Minimal header design without dividers.

```vue
<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-item value="1" title="Step 1" />
      <v-stepper-item value="2" title="Step 2" />
      <v-stepper-item value="3" title="Step 3" />
    </v-stepper-header>
  </v-stepper>
</template>
```

**Note:** Omit `<v-divider />` components between steps for a cleaner look.

---

### Custom Header Content

Use slots to customize header appearance.

```vue
<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-item
        v-for="step in steps"
        :key="step.value"
        :value="step.value"
      >
        <template v-slot:title>
          <div class="d-flex align-center">
            <v-icon :color="step.iconColor" start>
              {{ step.icon }}
            </v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ step.title }}
              </div>
              <div class="text-caption text-grey">
                {{ step.description }}
              </div>
            </div>
          </div>
        </template>
      </v-stepper-item>
    </v-stepper-header>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const steps = [
  {
    value: 1,
    title: 'Personal',
    description: 'Basic info',
    icon: 'mdi-account',
    iconColor: 'blue'
  },
  {
    value: 2,
    title: 'Contact',
    description: 'Phone & email',
    icon: 'mdi-phone',
    iconColor: 'green'
  },
  {
    value: 3,
    title: 'Review',
    description: 'Confirm details',
    icon: 'mdi-check-circle',
    iconColor: 'orange'
  }
]
</script>
```

**Note:** Vuetify 3's slot support for stepper headers may be limited. Check the current documentation for available slots.

## Window Patterns

### Transition Effects

Custom transitions between step content.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item value="1" title="Step 1" />
        <v-stepper-item value="2" title="Step 2" />
        <v-stepper-item value="3" title="Step 3" />
      </v-stepper-header>

      <v-stepper-window
        v-model="currentStep"
        :continuous="false"
      >
        <v-stepper-window-item
          value="1"
          transition="fade-transition"
          reverse-transition="fade-transition"
        >
          <v-card flat>
            <v-card-text>Step 1 content</v-card-text>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item
          value="2"
          transition="slide-x-transition"
          reverse-transition="slide-x-reverse-transition"
        >
          <v-card flat>
            <v-card-text>Step 2 content</v-card-text>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item
          value="3"
          transition="scale-transition"
          reverse-transition="scale-transition"
        >
          <v-card flat>
            <v-card-text>Step 3 content</v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>
```

**Available Vuetify Transitions:**
- `fade-transition` - Fade in/out
- `slide-x-transition` / `slide-x-reverse-transition` - Horizontal slide
- `slide-y-transition` / `slide-y-reverse-transition` - Vertical slide
- `scale-transition` - Grow/shrink
- `scroll-x-transition` / `scroll-x-reverse-transition` - Horizontal scroll
- `scroll-y-transition` / `scroll-y-reverse-transition` - Vertical scroll

---

### Lazy Loading Content

Defer rendering of step content until visited.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <!-- Content only rendered when step becomes active -->
          <HeavyComponent v-if="currentStep === step.value" />
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>
```

**Alternative with `eager` prop:**

```vue
<v-stepper-window-item
  value="1"
  eager
>
  <!-- Renders immediately, even if not visible -->
</v-stepper-window-item>

<v-stepper-window-item
  value="2"
>
  <!-- Lazy loaded by default (renders when first shown) -->
</v-stepper-window-item>
```

---

### Keep-Alive Windows

Preserve component state when switching steps.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item value="1" title="Form 1" />
        <v-stepper-item value="2" title="Form 2" />
        <v-stepper-item value="3" title="Review" />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <!-- Use keep-alive to preserve form state -->
        <keep-alive>
          <v-stepper-window-item
            v-for="step in steps"
            :key="step.value"
            :value="step.value"
          >
            <component :is="step.component" v-model="formData[step.key]" />
          </v-stepper-window-item>
        </keep-alive>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next" />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'
import FormStep1 from './FormStep1.vue'
import FormStep2 from './FormStep2.vue'
import ReviewStep from './ReviewStep.vue'

const currentStep = ref(1)
const formData = ref({
  step1: {},
  step2: {},
  review: {}
})

const steps = [
  { value: 1, title: 'Form 1', component: FormStep1, key: 'step1' },
  { value: 2, title: 'Form 2', component: FormStep2, key: 'step2' },
  { value: 3, title: 'Review', component: ReviewStep, key: 'review' }
]
</script>
```

**Benefits:**
- Form inputs retain values when navigating back
- Component state preserved
- Avoids re-initialization

## Accessibility

### Current Accessibility Limitations

**Known Issues (as of Vuetify 3.4):**

1. **Non-focusable Step Headers:**
   - `v-stepper-item` elements with `editable` prop are not keyboard-focusable
   - Missing `tabindex` attribute
   - Cannot trigger `@click` events via keyboard

2. **Missing ARIA Attributes:**
   - No `role` attributes on step elements
   - Missing `aria-current="step"` on active step
   - No `aria-orientation` on stepper container

3. **Keyboard Navigation:**
   - Tab navigation does not focus on step elements
   - No keyboard-based step navigation
   - Arrow keys not supported for step navigation

**Bug Reference:** Vuetify GitHub Issue #9975

---

### Recommended Accessibility Enhancements

While Vuetify's built-in accessibility is limited, you can improve it with these patterns:

#### Adding Keyboard Navigation

```vue
<template>
  <v-stepper
    v-model="currentStep"
    role="group"
    aria-label="Registration wizard"
  >
    <template v-slot:default="{ prev, next }">
      <v-stepper-header role="tablist">
        <v-stepper-item
          v-for="(step, index) in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
          editable
          role="tab"
          :aria-selected="currentStep === step.value"
          :aria-current="currentStep === step.value ? 'step' : undefined"
          tabindex="0"
          @keydown="handleStepKeydown($event, step.value)"
        />
      </v-stepper-header>

      <v-stepper-window
        v-model="currentStep"
        role="tabpanel"
        :aria-labelledby="`step-${currentStep}`"
      >
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:prev="prev"
        @click:next="next"
        aria-label="Step navigation"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

const steps = [
  { value: 1, title: 'Personal Info', content: 'Step 1 content' },
  { value: 2, title: 'Address', content: 'Step 2 content' },
  { value: 3, title: 'Review', content: 'Step 3 content' }
]

function handleStepKeydown(event, stepValue) {
  // Enter or Space activates step
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    currentStep.value = stepValue
  }

  // Arrow keys for navigation
  const currentIndex = steps.findIndex(s => s.value === currentStep.value)

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    if (currentIndex < steps.length - 1) {
      currentStep.value = steps[currentIndex + 1].value
      // Focus next step
      setTimeout(() => {
        const nextEl = document.querySelector(`[value="${currentStep.value}"]`)
        nextEl?.focus()
      }, 100)
    }
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (currentIndex > 0) {
      currentStep.value = steps[currentIndex - 1].value
      // Focus previous step
      setTimeout(() => {
        const prevEl = document.querySelector(`[value="${currentStep.value}"]`)
        prevEl?.focus()
      }, 100)
    }
  }
}
</script>

<style scoped>
/* Add focus indicator */
.v-stepper-item:focus {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
```

---

### Screen Reader Support

```vue
<template>
  <v-stepper
    v-model="currentStep"
    aria-label="Multi-step form"
  >
    <template v-slot:default="{ prev, next }">
      <!-- Announce progress to screen readers -->
      <div
        class="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Step {{ currentStep }} of {{ steps.length }}: {{ currentStepTitle }}
      </div>

      <v-stepper-header>
        <v-stepper-item
          v-for="(step, index) in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
          :aria-label="`Step ${index + 1}: ${step.title}. ${getStepStatus(step.value)}`"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :aria-labelledby="`step-title-${step.value}`"
        >
          <v-card>
            <v-card-title :id="`step-title-${step.value}`">
              {{ step.title }}
            </v-card-title>
            <v-card-text>
              {{ step.content }}
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions @click:prev="prev" @click:next="next">
        <template v-slot:prev>
          <v-btn aria-label="Go to previous step">
            Previous
          </v-btn>
        </template>
        <template v-slot:next>
          <v-btn aria-label="Go to next step">
            Next
          </v-btn>
        </template>
      </v-stepper-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)

const steps = [
  { value: 1, title: 'Account Details', content: 'Step 1 content' },
  { value: 2, title: 'Personal Info', content: 'Step 2 content' },
  { value: 3, title: 'Confirmation', content: 'Step 3 content' }
]

const currentStepTitle = computed(() => {
  return steps.find(s => s.value === currentStep.value)?.title || ''
})

function getStepStatus(stepValue) {
  if (stepValue < currentStep.value) return 'Completed'
  if (stepValue === currentStep.value) return 'Current step'
  return 'Not started'
}
</script>

<style scoped>
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

---

### Focus Management

```vue
<template>
  <v-stepper v-model="currentStep" ref="stepperRef">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :ref="el => stepRefs[step.value] = el"
          :value="step.value"
          :title="step.title"
          :complete="step.value < currentStep"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
        >
          <v-card>
            <v-card-text>
              <h2
                :ref="el => contentRefs[step.value] = el"
                tabindex="-1"
                class="step-heading"
              >
                {{ step.title }}
              </h2>
              {{ step.content }}
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:prev="handlePrev"
        @click:next="handleNext"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const currentStep = ref(1)
const stepRefs = ref({})
const contentRefs = ref({})

const steps = [
  { value: 1, title: 'Step 1', content: 'Content 1' },
  { value: 2, title: 'Step 2', content: 'Content 2' },
  { value: 3, title: 'Step 3', content: 'Content 3' }
]

// Focus management on step change
watch(currentStep, async (newStep) => {
  await nextTick()

  // Focus the heading of the new step content
  const heading = contentRefs.value[newStep]
  if (heading) {
    heading.focus()
  }
})

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleNext() {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}
</script>

<style scoped>
.step-heading:focus {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 4px;
}
</style>
```

---

### Better Alternative: Vuestic UI Stepper

For comparison, the **Vuestic UI** stepper component implements better accessibility out of the box:

```vue
<!-- Vuestic UI example (not Vuetify) -->
<va-stepper v-model="step">
  <!-- Automatically includes: -->
  <!-- - role="group" with aria-orientation -->
  <!-- - aria-current="step" on active step -->
  <!-- - Proper focus management -->
  <!-- - Keyboard navigation support -->
</va-stepper>
```

## Integration Patterns

### Form Validation Integration

#### Vue Validate Integration

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.isValid && step.value < currentStep"
          :error="!step.isValid && step.touched"
          editable
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <!-- Step 1: Personal Info -->
        <v-stepper-window-item value="1">
          <v-form ref="form1" v-model="steps[0].isValid">
            <v-card flat>
              <v-card-text>
                <v-text-field
                  v-model="formData.firstName"
                  :rules="[rules.required, rules.minLength(2)]"
                  label="First Name"
                  variant="outlined"
                />

                <v-text-field
                  v-model="formData.lastName"
                  :rules="[rules.required, rules.minLength(2)]"
                  label="Last Name"
                  variant="outlined"
                />

                <v-text-field
                  v-model="formData.email"
                  :rules="[rules.required, rules.email]"
                  label="Email"
                  type="email"
                  variant="outlined"
                />
              </v-card-text>
            </v-card>
          </v-form>
        </v-stepper-window-item>

        <!-- Step 2: Address -->
        <v-stepper-window-item value="2">
          <v-form ref="form2" v-model="steps[1].isValid">
            <v-card flat>
              <v-card-text>
                <v-text-field
                  v-model="formData.street"
                  :rules="[rules.required]"
                  label="Street Address"
                  variant="outlined"
                />

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="formData.city"
                      :rules="[rules.required]"
                      label="City"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="formData.zipCode"
                      :rules="[rules.required, rules.zipCode]"
                      label="ZIP Code"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-form>
        </v-stepper-window-item>

        <!-- Step 3: Review -->
        <v-stepper-window-item value="3">
          <v-card flat>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Name</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formData.firstName }} {{ formData.lastName }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formData.email }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Address</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formData.street }}, {{ formData.city }} {{ formData.zipCode }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-card-actions class="pa-4">
        <v-btn
          v-if="currentStep > 1"
          variant="text"
          @click="handlePrev"
        >
          Back
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="currentStep < steps.length"
          color="primary"
          @click="handleNext"
          :disabled="!steps[currentStep - 1].isValid"
        >
          Continue
        </v-btn>

        <v-btn
          v-else
          color="success"
          @click="handleSubmit"
          :loading="isSubmitting"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const isSubmitting = ref(false)
const form1 = ref(null)
const form2 = ref(null)

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  zipCode: ''
})

const steps = ref([
  { value: 1, title: 'Personal Info', isValid: false, touched: false },
  { value: 2, title: 'Address', isValid: false, touched: false },
  { value: 3, title: 'Review', isValid: true, touched: false }
])

const rules = {
  required: value => !!value || 'This field is required',
  minLength: min => value =>
    (value && value.length >= min) || `Minimum ${min} characters required`,
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Invalid email address'
  },
  zipCode: value => {
    const pattern = /^\d{5}$/
    return pattern.test(value) || 'Invalid ZIP code (5 digits required)'
  }
}

async function handleNext() {
  const currentStepData = steps.value[currentStep.value - 1]

  // Validate current step's form
  let form
  if (currentStep.value === 1) form = form1.value
  if (currentStep.value === 2) form = form2.value

  if (form) {
    const { valid } = await form.validate()
    currentStepData.isValid = valid
    currentStepData.touched = true

    if (!valid) return
  }

  // Move to next step
  if (currentStep.value < steps.value.length) {
    currentStep.value++
  }
}

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function handleSubmit() {
  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Form submitted:', formData.value)
    alert('Form submitted successfully!')
  } catch (error) {
    console.error('Submission error:', error)
    alert('Submission failed')
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

---

### Wizard Pattern with Data Persistence

```vue
<template>
  <v-card>
    <v-card-title>Setup Wizard</v-card-title>

    <v-stepper v-model="currentStep" editable non-linear>
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            v-for="step in steps"
            :key="step.value"
            :value="step.value"
            :title="step.title"
            :complete="step.completed"
            editable
          />
        </v-stepper-header>

        <v-stepper-window v-model="currentStep">
          <v-stepper-window-item
            v-for="step in steps"
            :key="step.value"
            :value="step.value"
          >
            <component
              :is="step.component"
              v-model="wizardData[step.key]"
              @update:valid="updateStepValidity(step.value, $event)"
            />
          </v-stepper-window-item>
        </v-stepper-window>

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="saveAndExit">
            Save & Exit
          </v-btn>

          <v-spacer />

          <v-btn
            v-if="currentStep > 1"
            variant="text"
            @click="prev"
          >
            Back
          </v-btn>

          <v-btn
            v-if="currentStep < steps.length"
            color="primary"
            @click="saveAndNext"
          >
            Save & Continue
          </v-btn>

          <v-btn
            v-else
            color="success"
            @click="completeWizard"
            :disabled="!allStepsCompleted"
          >
            Complete Setup
          </v-btn>
        </v-card-actions>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AccountStep from './steps/AccountStep.vue'
import ProfileStep from './steps/ProfileStep.vue'
import PreferencesStep from './steps/PreferencesStep.vue'

const currentStep = ref(1)
const STORAGE_KEY = 'wizard-progress'

const wizardData = ref({
  account: {},
  profile: {},
  preferences: {}
})

const steps = ref([
  {
    value: 1,
    title: 'Account',
    component: AccountStep,
    key: 'account',
    completed: false,
    valid: false
  },
  {
    value: 2,
    title: 'Profile',
    component: ProfileStep,
    key: 'profile',
    completed: false,
    valid: false
  },
  {
    value: 3,
    title: 'Preferences',
    component: PreferencesStep,
    key: 'preferences',
    completed: false,
    valid: false
  }
])

const allStepsCompleted = computed(() => {
  return steps.value.every(step => step.completed && step.valid)
})

// Load saved progress on mount
onMounted(() => {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      wizardData.value = parsed.data
      currentStep.value = parsed.currentStep
      steps.value = parsed.steps
    } catch (error) {
      console.error('Failed to load wizard progress:', error)
    }
  }
})

// Auto-save on data change
watch([wizardData, currentStep, steps], () => {
  saveProgress()
}, { deep: true })

function saveProgress() {
  const data = {
    data: wizardData.value,
    currentStep: currentStep.value,
    steps: steps.value,
    timestamp: Date.now()
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function updateStepValidity(stepValue, isValid) {
  const step = steps.value.find(s => s.value === stepValue)
  if (step) {
    step.valid = isValid
  }
}

function saveAndNext() {
  const currentStepData = steps.value.find(s => s.value === currentStep.value)

  if (currentStepData?.valid) {
    currentStepData.completed = true
    if (currentStep.value < steps.value.length) {
      currentStep.value++
    }
  }
}

function saveAndExit() {
  saveProgress()
  alert('Progress saved. You can resume later.')
}

async function completeWizard() {
  if (!allStepsCompleted.value) {
    alert('Please complete all steps before finishing')
    return
  }

  try {
    // Submit wizard data to API
    console.log('Submitting wizard data:', wizardData.value)

    // Clear saved progress after successful submission
    localStorage.removeItem(STORAGE_KEY)

    alert('Wizard completed successfully!')
  } catch (error) {
    console.error('Wizard submission failed:', error)
    alert('Failed to complete wizard')
  }
}
</script>
```

---

### Multi-Step Checkout Flow

```vue
<template>
  <v-container>
    <v-stepper v-model="currentStep" alt-labels>
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            value="1"
            title="Cart"
            icon="mdi-cart"
            :complete="currentStep > 1"
          />
          <v-divider />

          <v-stepper-item
            value="2"
            title="Shipping"
            icon="mdi-truck"
            :complete="currentStep > 2"
          />
          <v-divider />

          <v-stepper-item
            value="3"
            title="Payment"
            icon="mdi-credit-card"
            :complete="currentStep > 3"
          />
          <v-divider />

          <v-stepper-item
            value="4"
            title="Review"
            icon="mdi-check-circle"
            :complete="currentStep > 4"
          />
        </v-stepper-header>

        <v-stepper-window v-model="currentStep">
          <!-- Cart Review -->
          <v-stepper-window-item value="1">
            <CartReview
              v-model:items="cartItems"
              @update:total="cartTotal = $event"
            />
          </v-stepper-window-item>

          <!-- Shipping Info -->
          <v-stepper-window-item value="2">
            <ShippingForm
              v-model="shippingInfo"
              v-model:valid="steps[1].valid"
            />
          </v-stepper-window-item>

          <!-- Payment -->
          <v-stepper-window-item value="3">
            <PaymentForm
              v-model="paymentInfo"
              v-model:valid="steps[2].valid"
            />
          </v-stepper-window-item>

          <!-- Order Review -->
          <v-stepper-window-item value="4">
            <OrderSummary
              :cart-items="cartItems"
              :cart-total="cartTotal"
              :shipping-info="shippingInfo"
              :payment-info="paymentInfo"
            />
          </v-stepper-window-item>
        </v-stepper-window>

        <v-divider />

        <v-card-actions class="pa-4 justify-space-between">
          <div class="text-h6 font-weight-bold">
            Total: ${{ cartTotal.toFixed(2) }}
          </div>

          <div>
            <v-btn
              v-if="currentStep > 1"
              variant="text"
              @click="prev"
            >
              Back
            </v-btn>

            <v-btn
              v-if="currentStep < 4"
              color="primary"
              @click="handleContinue"
              :disabled="!canProceed"
            >
              Continue
            </v-btn>

            <v-btn
              v-else
              color="success"
              size="large"
              @click="placeOrder"
              :loading="isPlacingOrder"
            >
              Place Order
            </v-btn>
          </div>
        </v-card-actions>
      </template>
    </v-stepper>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import CartReview from './checkout/CartReview.vue'
import ShippingForm from './checkout/ShippingForm.vue'
import PaymentForm from './checkout/PaymentForm.vue'
import OrderSummary from './checkout/OrderSummary.vue'

const currentStep = ref(1)
const isPlacingOrder = ref(false)

const cartItems = ref([])
const cartTotal = ref(0)
const shippingInfo = ref({})
const paymentInfo = ref({})

const steps = ref([
  { value: 1, valid: true }, // Cart is always valid
  { value: 2, valid: false }, // Shipping
  { value: 3, valid: false }, // Payment
  { value: 4, valid: true } // Review is always valid
])

const canProceed = computed(() => {
  return steps.value[currentStep.value - 1]?.valid
})

function handleContinue() {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

async function placeOrder() {
  isPlacingOrder.value = true

  try {
    const orderData = {
      items: cartItems.value,
      shipping: shippingInfo.value,
      payment: paymentInfo.value,
      total: cartTotal.value
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Order placed:', orderData)

    // Redirect to confirmation page
    // router.push('/order-confirmation')
  } catch (error) {
    console.error('Order placement failed:', error)
    alert('Failed to place order. Please try again.')
  } finally {
    isPlacingOrder.value = false
  }
}
</script>
```

## Advanced Patterns

### Conditional Step Flow

Dynamic steps based on user choices.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <template v-for="(step, index) in visibleSteps" :key="step.value">
          <v-stepper-item
            :value="step.value"
            :title="step.title"
            :complete="step.value < currentStep"
          />
          <v-divider v-if="index < visibleSteps.length - 1" />
        </template>
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <!-- Account Type Selection -->
        <v-stepper-window-item value="1">
          <v-card flat>
            <v-card-text>
              <v-radio-group v-model="accountType" column>
                <v-radio
                  label="Personal Account"
                  value="personal"
                />
                <v-radio
                  label="Business Account"
                  value="business"
                />
              </v-radio-group>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Personal Info (always shown) -->
        <v-stepper-window-item value="2">
          <v-card flat>
            <v-card-text>
              <h3>Personal Information</h3>
              <!-- Personal info form fields -->
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Business Info (only for business accounts) -->
        <v-stepper-window-item v-if="accountType === 'business'" value="3">
          <v-card flat>
            <v-card-text>
              <h3>Business Information</h3>
              <v-text-field
                v-model="businessData.companyName"
                label="Company Name"
                variant="outlined"
              />
              <v-text-field
                v-model="businessData.taxId"
                label="Tax ID"
                variant="outlined"
              />
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Contact (step number changes based on account type) -->
        <v-stepper-window-item :value="contactStepValue">
          <v-card flat>
            <v-card-text>
              <h3>Contact Information</h3>
              <!-- Contact form fields -->
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <!-- Review (final step) -->
        <v-stepper-window-item :value="reviewStepValue">
          <v-card flat>
            <v-card-text>
              <h3>Review Your Information</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Account Type</v-list-item-title>
                  <v-list-item-subtitle>{{ accountType }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="accountType === 'business'">
                  <v-list-item-title>Company Name</v-list-item-title>
                  <v-list-item-subtitle>{{ businessData.companyName }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions
        @click:prev="handlePrev"
        @click:next="handleNext"
      />
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)
const accountType = ref('personal')

const businessData = ref({
  companyName: '',
  taxId: ''
})

const allSteps = [
  { value: 1, title: 'Account Type', condition: () => true },
  { value: 2, title: 'Personal Info', condition: () => true },
  { value: 3, title: 'Business Info', condition: () => accountType.value === 'business' },
  { value: 4, title: 'Contact', condition: () => true },
  { value: 5, title: 'Review', condition: () => true }
]

const visibleSteps = computed(() => {
  return allSteps.filter(step => step.condition())
})

const contactStepValue = computed(() => {
  return accountType.value === 'business' ? 4 : 3
})

const reviewStepValue = computed(() => {
  return accountType.value === 'business' ? 5 : 4
})

function handleNext() {
  const visibleValues = visibleSteps.value.map(s => s.value)
  const currentIndex = visibleValues.indexOf(currentStep.value)

  if (currentIndex < visibleValues.length - 1) {
    currentStep.value = visibleValues[currentIndex + 1]
  }
}

function handlePrev() {
  const visibleValues = visibleSteps.value.map(s => s.value)
  const currentIndex = visibleValues.indexOf(currentStep.value)

  if (currentIndex > 0) {
    currentStep.value = visibleValues[currentIndex - 1]
  }
}
</script>
```

---

### Async Step Validation

Validate steps with API calls before allowing progression.

```vue
<template>
  <v-stepper v-model="currentStep">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in steps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.validated"
          :error="step.validationError"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item value="1">
          <v-card flat>
            <v-card-text>
              <v-text-field
                v-model="formData.username"
                label="Username"
                :error-messages="usernameError"
                variant="outlined"
              />

              <v-alert
                v-if="steps[0].validationError"
                type="error"
                class="mt-2"
              >
                {{ steps[0].errorMessage }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item value="2">
          <v-card flat>
            <v-card-text>
              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                :error-messages="emailError"
                variant="outlined"
              />

              <v-alert
                v-if="steps[1].validationError"
                type="error"
                class="mt-2"
              >
                {{ steps[1].errorMessage }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item value="3">
          <v-card flat>
            <v-card-text>
              <h3>Review</h3>
              <p>Username: {{ formData.username }}</p>
              <p>Email: {{ formData.email }}</p>
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-card-actions class="pa-4">
        <v-btn
          v-if="currentStep > 1"
          variant="text"
          @click="prev"
          :disabled="isValidating"
        >
          Back
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="currentStep < steps.length"
          color="primary"
          @click="validateAndNext"
          :loading="isValidating"
        >
          Continue
        </v-btn>

        <v-btn
          v-else
          color="success"
          @click="submit"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const isValidating = ref(false)

const formData = ref({
  username: '',
  email: ''
})

const usernameError = ref('')
const emailError = ref('')

const steps = ref([
  {
    value: 1,
    title: 'Username',
    validated: false,
    validationError: false,
    errorMessage: ''
  },
  {
    value: 2,
    title: 'Email',
    validated: false,
    validationError: false,
    errorMessage: ''
  },
  {
    value: 3,
    title: 'Review',
    validated: true,
    validationError: false,
    errorMessage: ''
  }
])

async function validateAndNext() {
  isValidating.value = true

  const currentStepData = steps.value[currentStep.value - 1]

  try {
    // Reset previous errors
    currentStepData.validationError = false
    currentStepData.errorMessage = ''

    // Perform async validation based on current step
    if (currentStep.value === 1) {
      await validateUsername()
    } else if (currentStep.value === 2) {
      await validateEmail()
    }

    // Mark step as validated
    currentStepData.validated = true

    // Move to next step
    if (currentStep.value < steps.value.length) {
      currentStep.value++
    }
  } catch (error) {
    // Handle validation error
    currentStepData.validationError = true
    currentStepData.errorMessage = error.message
    currentStepData.validated = false
  } finally {
    isValidating.value = false
  }
}

async function validateUsername() {
  // Simulate API call to check username availability
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (formData.value.username.length < 3) {
    throw new Error('Username must be at least 3 characters')
  }

  // Simulate username already taken
  if (formData.value.username === 'admin') {
    throw new Error('Username already taken')
  }

  usernameError.value = ''
}

async function validateEmail() {
  // Simulate API call to validate email
  await new Promise(resolve => setTimeout(resolve, 1000))

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(formData.value.email)) {
    throw new Error('Invalid email format')
  }

  // Simulate email already registered
  if (formData.value.email === 'test@example.com') {
    throw new Error('Email already registered')
  }

  emailError.value = ''
}

async function submit() {
  console.log('Form submitted:', formData.value)
  alert('Registration successful!')
}
</script>
```

---

### State Machine Pattern

Use a state machine for complex step logic.

```vue
<template>
  <v-stepper v-model="currentState">
    <template v-slot:default="{ prev, next }">
      <v-stepper-header>
        <v-stepper-item
          v-for="step in displaySteps"
          :key="step.value"
          :value="step.value"
          :title="step.title"
          :complete="step.complete"
        />
      </v-stepper-header>

      <v-stepper-window v-model="currentState">
        <v-stepper-window-item
          v-for="step in displaySteps"
          :key="step.value"
          :value="step.value"
        >
          <v-card flat>
            <v-card-text>
              <component
                :is="step.component"
                @transition="handleTransition"
              />
            </v-card-text>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-card-actions class="pa-4">
        <v-btn
          v-for="action in availableActions"
          :key="action.name"
          :color="action.color"
          @click="handleTransition(action.event)"
        >
          {{ action.label }}
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createMachine, interpret } from 'xstate'

// Define state machine
const wizardMachine = createMachine({
  id: 'wizard',
  initial: 'userType',
  states: {
    userType: {
      on: {
        SELECT_INDIVIDUAL: 'individualInfo',
        SELECT_BUSINESS: 'businessInfo'
      }
    },
    individualInfo: {
      on: {
        NEXT: 'payment',
        BACK: 'userType'
      }
    },
    businessInfo: {
      on: {
        NEXT: 'companyDetails',
        BACK: 'userType'
      }
    },
    companyDetails: {
      on: {
        NEXT: 'payment',
        BACK: 'businessInfo'
      }
    },
    payment: {
      on: {
        SUBMIT: 'confirmation',
        BACK: 'individualInfo' // Could be dynamic based on path
      }
    },
    confirmation: {
      type: 'final'
    }
  }
})

const service = interpret(wizardMachine)
service.start()

const currentState = ref(service.state.value)

// Update currentState when machine state changes
service.onTransition(state => {
  currentState.value = state.value
})

const stateConfig = {
  userType: {
    title: 'User Type',
    component: 'UserTypeStep',
    complete: false
  },
  individualInfo: {
    title: 'Personal Info',
    component: 'IndividualInfoStep',
    complete: false
  },
  businessInfo: {
    title: 'Business Type',
    component: 'BusinessInfoStep',
    complete: false
  },
  companyDetails: {
    title: 'Company Details',
    component: 'CompanyDetailsStep',
    complete: false
  },
  payment: {
    title: 'Payment',
    component: 'PaymentStep',
    complete: false
  },
  confirmation: {
    title: 'Confirmation',
    component: 'ConfirmationStep',
    complete: true
  }
}

const displaySteps = computed(() => {
  // Build step list based on current state path
  const state = service.state
  const path = state.toStrings()

  return path.map((stateName, index) => ({
    value: stateName,
    ...stateConfig[stateName],
    complete: index < path.length - 1
  }))
})

const availableActions = computed(() => {
  const state = service.state
  const actions = []

  Object.keys(state.nextEvents).forEach(event => {
    if (event === 'BACK') {
      actions.push({ name: 'back', event: 'BACK', label: 'Back', color: '' })
    } else if (event === 'NEXT') {
      actions.push({ name: 'next', event: 'NEXT', label: 'Next', color: 'primary' })
    } else if (event === 'SUBMIT') {
      actions.push({ name: 'submit', event: 'SUBMIT', label: 'Submit', color: 'success' })
    } else if (event.startsWith('SELECT_')) {
      const type = event.replace('SELECT_', '').toLowerCase()
      actions.push({
        name: type,
        event,
        label: `Select ${type}`,
        color: 'primary'
      })
    }
  })

  return actions
})

function handleTransition(event) {
  service.send(event)
}
</script>
```

## Notes

### Important Observations

1. **Version Differences:**
   - Vuetify 2 uses `v-stepper-step`, `v-stepper-items`, `v-stepper-content`
   - Vuetify 3 uses `v-stepper-item`, `v-stepper-window`, `v-stepper-window-item`
   - API is not backward compatible between major versions

2. **Non-Linear Prop Issue:**
   - The `non-linear` prop alone has no effect (Bug #19275)
   - Must also set `editable` prop to enable non-linear navigation
   - This is a known issue in Vuetify 3.5.2 and may be fixed in future versions

3. **Vertical Stepper Missing:**
   - Vertical stepper was available in Vuetify 2
   - Not natively implemented in Vuetify 3 (Issue #18842)
   - Requires custom CSS or workarounds

4. **Accessibility Gaps:**
   - Step headers are not keyboard-focusable even with `editable` prop
   - Missing ARIA attributes (`role`, `aria-current`, etc.)
   - No built-in keyboard navigation
   - See GitHub Issue #9975 for details

5. **Slot Support:**
   - `hasCompleted` prop not set when using slots (as of v3.4)
   - Slot-based customization is limited compared to other Vuetify components
   - Custom header content may require CSS workarounds

6. **Window Structure:**
   - Must use ONE `v-stepper-window` to wrap ALL `v-stepper-window-item` components
   - Incorrect structure breaks transitions
   - Each window item must have unique `value` matching step value

7. **Icon Customization:**
   - Limited built-in support for custom step icons in earlier versions
   - Vuetify 3 added `icon` prop to `v-stepper-item`
   - Complete icon customization may require CSS overrides

8. **State Management:**
   - v-model controls active step
   - Step completion must be managed manually
   - No built-in validation state tracking

### Best Practices

1. **Always match step and window item values:**
   ```vue
   <v-stepper-item value="1" />
   <v-stepper-window-item value="1" />
   ```

2. **Use editable for non-linear navigation:**
   ```vue
   <v-stepper editable non-linear>
   ```

3. **Implement custom accessibility:**
   - Add `role`, `aria-*` attributes manually
   - Implement keyboard navigation handlers
   - Add focus indicators with CSS

4. **Validate before progressing:**
   - Check form validity before allowing next step
   - Show error states on step headers
   - Prevent navigation if validation fails

5. **Save wizard progress:**
   - Use localStorage for long multi-step forms
   - Allow users to resume later
   - Auto-save on step changes

6. **Handle responsive layouts:**
   - Consider `alt-labels` for mobile
   - Vertical stepper may be better for small screens
   - Hide step subtitles on narrow viewports

7. **Provide clear feedback:**
   - Show progress percentage
   - Display step counts (e.g., "Step 2 of 5")
   - Use loading states during async validation
   - Show completion status clearly

8. **Optimize performance:**
   - Lazy load step content
   - Use `keep-alive` to preserve form state
   - Avoid re-rendering all steps on every change

### Framework Comparison

**Advantages over other steppers:**
- Material Design styling out of the box
- Seamless integration with Vuetify ecosystem
- Good TypeScript support
- Responsive by default

**Disadvantages:**
- Accessibility issues compared to alternatives (e.g., Vuestic UI)
- Limited vertical stepper support in v3
- Breaking changes between major versions
- Less flexible than headless solutions

**Alternative Solutions:**
- **Vuestic UI Stepper:** Better accessibility, similar API
- **Custom Implementation:** Full control, but more work
- **Headless Libraries:** Maximum flexibility, no styling
