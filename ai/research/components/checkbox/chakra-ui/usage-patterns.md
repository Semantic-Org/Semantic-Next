# Chakra UI Checkbox Component - Usage Patterns Report

## 1. Component Overview

The Checkbox component in Chakra UI is a form control element that allows users to select one or more options from a set. It provides a fully accessible, customizable checkbox implementation that follows WAI-ARIA standards and integrates seamlessly with Chakra's design system. The component supports multiple states including checked, unchecked, indeterminate, disabled, and invalid states, making it suitable for various use cases from simple single checkboxes to complex nested selection hierarchies.

## 2. Version Comparison (v2 vs v3)

### Major Breaking Changes

Chakra UI v3 introduced significant architectural changes to the Checkbox component, moving from a single-component API to a **composable component structure**.

#### API Structure Changes

**v2 Structure (Single Component):**
```jsx
<Checkbox>Click me</Checkbox>
```

**v3 Structure (Composable Components):**
```jsx
<Checkbox.Root defaultChecked>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Checkbox</Checkbox.Label>
</Checkbox.Root>
```

### Component Parts (v3)

- **`Checkbox.Root`** - Main wrapper component that accepts configuration props
- **`Checkbox.HiddenInput`** - Hidden native input element for form submission
- **`Checkbox.Control`** - Visual checkbox control element
- **`Checkbox.Indicator`** - The checkmark/indeterminate indicator
- **`Checkbox.Label`** - Associated label text

### Prop Name Changes

| v2 Prop | v3 Prop | Notes |
|---------|---------|-------|
| `defaultIsChecked` | `defaultChecked` | Removed in v2, replaced with `defaultChecked` |
| `isChecked` | `checked` | State prop name changed |
| `isDisabled` | `disabled` | Boolean state prop simplified |
| `isInvalid` | `invalid` | Boolean state prop simplified |
| `isIndeterminate` | `checked="indeterminate"` | Now uses string value instead of boolean prop |
| `colorScheme` | `colorPalette` | Theming prop renamed |
| `onChange` | `onCheckedChange` | Event handler renamed |

### Migration Challenges

- **No Codemods Available**: The Chakra team has not provided automated migration tools
- **Compositional Complexity**: The new structure requires more boilerplate code
- **Snippets as Solution**: v3 introduces "snippets" - code generation tools that can create simplified wrapper components to achieve v2-like DX
- **Many Small Issues**: Community reports indicate numerous edge cases not covered in official migration guide

### Version-Specific Features

**v2 Exclusive:**
- Simpler single-component API
- Direct prop passing for all configurations

**v3 Exclusive:**
- Greater compositional flexibility
- More granular control over component parts
- Improved styling customization through separated components
- Modern colorPalette system replacing colorScheme

## 3. Basic Usage

### v2 Basic Usage

**Simple Checkbox:**
```jsx
import { Checkbox } from '@chakra-ui/react'

function Example() {
  return <Checkbox>I agree to terms</Checkbox>
}
```

**With Default Checked State:**
```jsx
<Checkbox defaultChecked>Subscribe to newsletter</Checkbox>
```

**Controlled Checkbox:**
```jsx
import { useState } from 'react'
import { Checkbox } from '@chakra-ui/react'

function ControlledExample() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      isChecked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    >
      Controlled checkbox
    </Checkbox>
  )
}
```

### v3 Basic Usage

**Simple Checkbox:**
```jsx
import { Checkbox } from '@chakra-ui/react'

function Example() {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>I agree to terms</Checkbox.Label>
    </Checkbox.Root>
  )
}
```

**With Default Checked State:**
```jsx
<Checkbox.Root defaultChecked>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Subscribe to newsletter</Checkbox.Label>
</Checkbox.Root>
```

**Controlled Checkbox:**
```jsx
"use client"
import { useState } from 'react'
import { Checkbox } from '@chakra-ui/react'

function ControlledExample() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(e) => setChecked(!!e.checked)}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>Controlled checkbox</Checkbox.Label>
    </Checkbox.Root>
  )
}
```

## 4. Props/API Reference

### v2 Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultChecked` | `boolean` | `false` | If true, the checkbox will be initially checked (uncontrolled) |
| `isChecked` | `boolean` | - | If true, the checkbox will be checked (controlled). Requires `onChange` |
| `isIndeterminate` | `boolean` | `false` | If true, shows indeterminate state. Does not modify `isChecked` |
| `isDisabled` | `boolean` | `false` | If true, the checkbox will be disabled |
| `isInvalid` | `boolean` | `false` | If true, marks the checkbox as invalid and changes unchecked state style |
| `isReadOnly` | `boolean` | `false` | If true, the checkbox will be readonly |
| `isRequired` | `boolean` | `false` | If true, the checkbox will be required |
| `onChange` | `(event: ChangeEvent) => void` | - | Callback invoked when the checked state changes |
| `name` | `string` | - | The name of the input field (useful for form submission) |
| `value` | `string \| number` | - | The value to be used in the checkbox input for form submission |
| `colorScheme` | `string` | `blue` | The color scheme of the checkbox. Can be any color key from theme.colors |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | The size of the checkbox |
| `variant` | `string` | - | The variant of the checkbox |
| `spacing` | `SpaceProps` | `0.5rem` | The spacing between the checkbox and label text |
| `iconColor` | `string` | - | The color of the checkbox icon when checked or indeterminate |
| `iconSize` | `string \| number` | - | The size of the checkbox icon when checked or indeterminate |
| `tabIndex` | `number` | - | The tab-index property of the underlying input element |
| `id` | `string` | - | The id assigned to input field |
| `aria-label` | `string` | - | Defines the string that labels the checkbox element |
| `aria-labelledby` | `string` | - | Refers to the id of the element that labels the checkbox element |
| `aria-describedby` | `string` | - | Refers to the id of the element that provides additional description |

### v3 Checkbox.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultChecked` | `boolean \| "indeterminate"` | `false` | If true, the checkbox will be initially checked (uncontrolled) |
| `checked` | `boolean \| "indeterminate"` | - | If true, the checkbox will be checked (controlled). Set to "indeterminate" for indeterminate state |
| `disabled` | `boolean` | `false` | If true, the checkbox will be disabled |
| `invalid` | `boolean` | `false` | If true, marks the checkbox as invalid |
| `readOnly` | `boolean` | `false` | If true, the checkbox will be readonly |
| `required` | `boolean` | `false` | If true, the checkbox will be required |
| `onCheckedChange` | `(details: { checked: boolean \| "indeterminate" }) => void` | - | Callback invoked when the checked state changes |
| `name` | `string` | - | The name of the input field (useful for form submission) |
| `value` | `string \| number` | - | The value to be used in the checkbox input for form submission |
| `colorPalette` | `string` | - | The color palette of the checkbox. Replaces v2's colorScheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | The size of the checkbox |
| `variant` | `'outline' \| 'subtle' \| 'solid'` | - | The visual style variant of the checkbox |
| `id` | `string` | - | The id assigned to input field |

### v2 CheckboxGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `(string \| number)[]` | - | Initial checked checkboxes (uncontrolled). Only considered on first render |
| `value` | `(string \| number)[]` | - | The controlled value of checkbox group |
| `onChange` | `(value: (string \| number)[]) => void` | - | Callback invoked when any child checkbox is checked/unchecked |
| `colorScheme` | `string` | - | The color scheme for all checkboxes in the group |
| `size` | `'sm' \| 'md' \| 'lg'` | - | The size for all checkboxes in the group |
| `variant` | `string` | - | The variant for all checkboxes in the group |
| `isDisabled` | `boolean` | - | If true, all checkboxes will be disabled |
| `spacing` | `ResponsiveValue<string \| number>` | - | The spacing between checkboxes |

### v3 CheckboxGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string[]` | - | Initial checked checkboxes (uncontrolled) |
| `value` | `string[]` | - | The controlled value of checkbox group |
| `onValueChange` | `(details: { value: string[] }) => void` | - | Callback invoked when any child checkbox is checked/unchecked |
| `disabled` | `boolean` | - | If true, all checkboxes will be disabled |
| `name` | `string` | - | The name for all checkboxes in the group |

## 5. Variants & Patterns

### Size Variants

**v2:**
```jsx
<Stack>
  <Checkbox size="sm">Small</Checkbox>
  <Checkbox size="md">Medium (default)</Checkbox>
  <Checkbox size="lg">Large</Checkbox>
</Stack>
```

**v3:**
```jsx
<Stack>
  <Checkbox.Root size="sm">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Small</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root size="md">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Medium</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root size="lg">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Large</Checkbox.Label>
  </Checkbox.Root>
</Stack>
```

### Color/Theme Variants

**v2:**
```jsx
<Stack>
  <Checkbox colorScheme="red">Red</Checkbox>
  <Checkbox colorScheme="green">Green</Checkbox>
  <Checkbox colorScheme="blue">Blue</Checkbox>
  <Checkbox colorScheme="purple">Purple</Checkbox>
</Stack>
```

**v3:**
```jsx
<Stack>
  <Checkbox.Root colorPalette="red">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Red</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root colorPalette="green">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Green</Checkbox.Label>
  </Checkbox.Root>
</Stack>
```

### Visual Variants (v3)

```jsx
<Stack>
  <Checkbox.Root variant="outline">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Outline</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root variant="subtle">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Subtle</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root variant="solid">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Solid</Checkbox.Label>
  </Checkbox.Root>
</Stack>
```

### Disabled State

**v2:**
```jsx
<Stack>
  <Checkbox isDisabled>Disabled</Checkbox>
  <Checkbox isDisabled defaultChecked>Disabled Checked</Checkbox>
</Stack>
```

**v3:**
```jsx
<Stack>
  <Checkbox.Root disabled>
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Disabled</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root disabled defaultChecked>
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Disabled Checked</Checkbox.Label>
  </Checkbox.Root>
</Stack>
```

### Invalid/Error States

**v2:**
```jsx
<Checkbox isInvalid>Accept terms and conditions</Checkbox>
```

**v3:**
```jsx
<Checkbox.Root invalid>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
</Checkbox.Root>
```

### Indeterminate State

**v2:**
```jsx
import { useState } from 'react'

function IndeterminateExample() {
  const [checkedItems, setCheckedItems] = useState([false, false])

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
      >
        Parent Checkbox
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        <Checkbox
          isChecked={checkedItems[0]}
          onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
        >
          Child 1
        </Checkbox>
        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          Child 2
        </Checkbox>
      </Stack>
    </>
  )
}
```

**v3:**
```jsx
"use client"
import { useState } from 'react'
import { Checkbox, Stack } from "@chakra-ui/react"

const initialValues = [
  { label: "Monday", checked: false, value: "monday" },
  { label: "Tuesday", checked: false, value: "tuesday" },
  { label: "Wednesday", checked: false, value: "wednesday" },
  { label: "Thursday", checked: false, value: "thursday" },
]

function IndeterminateExample() {
  const [values, setValues] = useState(initialValues)
  const allChecked = values.every((value) => value.checked)
  const indeterminate = values.some((value) => value.checked) && !allChecked

  const items = values.map((item, index) => (
    <Checkbox.Root
      ms="6"
      key={item.value}
      checked={item.checked}
      onCheckedChange={(e) => {
        setValues((current) => {
          const newValues = [...current]
          newValues[index] = {
            ...newValues[index],
            checked: !!e.checked
          }
          return newValues
        })
      }}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>{item.label}</Checkbox.Label>
    </Checkbox.Root>
  ))

  return (
    <Stack align="flex-start">
      <Checkbox.Root
        checked={allChecked ? true : indeterminate ? "indeterminate" : false}
        onCheckedChange={(e) => {
          setValues((current) =>
            current.map((item) => ({
              ...item,
              checked: !!e.checked
            }))
          )
        }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Select All</Checkbox.Label>
      </Checkbox.Root>
      {items}
    </Stack>
  )
}
```

### Checkbox Groups

**v2:**
```jsx
import { CheckboxGroup, Stack, Checkbox } from '@chakra-ui/react'

function CheckboxGroupExample() {
  return (
    <CheckboxGroup defaultValue={['naruto', 'kakashi']}>
      <Stack spacing={2} direction="column">
        <Checkbox value="naruto">Naruto</Checkbox>
        <Checkbox value="sasuke">Sasuke</Checkbox>
        <Checkbox value="kakashi">Kakashi</Checkbox>
      </Stack>
    </CheckboxGroup>
  )
}
```

**v3:**
```jsx
import { Checkbox, CheckboxGroup, Fieldset, For } from "@chakra-ui/react"

function CheckboxGroupExample() {
  return (
    <Fieldset.Root>
      <CheckboxGroup defaultValue={["react"]} name="framework">
        <Fieldset.Legend fontSize="sm" mb="2">
          Select framework
        </Fieldset.Legend>
        <Fieldset.Content>
          <For each={["React", "Svelte", "Vue", "Angular"]}>
            {(value) => (
              <Checkbox.Root key={value} value={value}>
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>{value}</Checkbox.Label>
              </Checkbox.Root>
            )}
          </For>
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  )
}
```

### Icon Customization (v2)

```jsx
<Checkbox iconColor="red.500" iconSize="1rem">
  Custom Icon
</Checkbox>
```

**Note:** In v3, icon customization is achieved through styling the `Checkbox.Indicator` component directly using Chakra's styling props.

## 6. Composition Patterns

### With Forms (v2)

```jsx
import { useForm } from 'react-hook-form'
import { Checkbox, Button, VStack } from '@chakra-ui/react'

function FormExample() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="start">
        <Checkbox {...register('newsletter')}>
          Subscribe to newsletter
        </Checkbox>
        <Checkbox {...register('terms')} isRequired>
          I accept the terms and conditions
        </Checkbox>
        <Button type="submit">Submit</Button>
      </VStack>
    </form>
  )
}
```

### With Forms (v3)

```jsx
"use client"
import { Checkbox, Button, Stack, Fieldset } from '@chakra-ui/react'

function FormExample() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log(Object.fromEntries(formData))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root>
        <Stack align="start">
          <Checkbox.Root name="newsletter">
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Subscribe to newsletter</Checkbox.Label>
          </Checkbox.Root>

          <Checkbox.Root name="terms" required>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>I accept the terms and conditions</Checkbox.Label>
          </Checkbox.Root>

          <Button type="submit">Submit</Button>
        </Stack>
      </Fieldset.Root>
    </form>
  )
}
```

### Controlled Group with State

**v2:**
```jsx
import { useState } from 'react'
import { CheckboxGroup, Stack, Checkbox } from '@chakra-ui/react'

function ControlledGroup() {
  const [selected, setSelected] = useState(['react'])

  return (
    <CheckboxGroup value={selected} onChange={setSelected}>
      <Stack>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
      </Stack>
    </CheckboxGroup>
  )
}
```

**v3:**
```jsx
"use client"
import { useState } from 'react'
import { CheckboxGroup, Checkbox, Stack } from '@chakra-ui/react'

function ControlledGroup() {
  const [selected, setSelected] = useState(['react'])

  return (
    <CheckboxGroup
      value={selected}
      onValueChange={(e) => setSelected(e.value)}
    >
      <Stack>
        <Checkbox.Root value="react">
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>React</Checkbox.Label>
        </Checkbox.Root>

        <Checkbox.Root value="vue">
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Vue</Checkbox.Label>
        </Checkbox.Root>

        <Checkbox.Root value="svelte">
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Svelte</Checkbox.Label>
        </Checkbox.Root>
      </Stack>
    </CheckboxGroup>
  )
}
```

### With Layouts

```jsx
// Horizontal layout
<Stack direction="row" spacing={4}>
  <Checkbox>Option 1</Checkbox>
  <Checkbox>Option 2</Checkbox>
  <Checkbox>Option 3</Checkbox>
</Stack>

// Grid layout
<Grid templateColumns="repeat(3, 1fr)" gap={4}>
  <Checkbox>Option 1</Checkbox>
  <Checkbox>Option 2</Checkbox>
  <Checkbox>Option 3</Checkbox>
  <Checkbox>Option 4</Checkbox>
  <Checkbox>Option 5</Checkbox>
  <Checkbox>Option 6</Checkbox>
</Grid>
```

## 7. Styling & Theming

### Custom Styling with Style Props (v2)

```jsx
<Checkbox
  colorScheme="purple"
  borderColor="purple.500"
  _checked={{
    '& .chakra-checkbox__control': {
      background: 'purple.600',
      borderColor: 'purple.600',
    }
  }}
>
  Custom styled checkbox
</Checkbox>
```

### Theme Customization (v2)

```jsx
// In your theme configuration
const theme = extendTheme({
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: 'md',
          borderWidth: '2px',
        },
      },
      sizes: {
        xl: {
          control: { w: 6, h: 6 },
          label: { fontSize: 'xl' },
          icon: { fontSize: '1rem' },
        },
      },
      variants: {
        circular: {
          control: {
            borderRadius: 'full',
          },
        },
      },
      defaultProps: {
        size: 'md',
        colorScheme: 'blue',
      },
    },
  },
})
```

### Theme Customization (v3)

```jsx
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f7ff" },
          500: { value: "#1890ff" },
          600: { value: "#096dd9" },
        },
      },
    },
    semanticTokens: {
      colors: {
        checkbox: {
          bg: { value: "{colors.brand.500}" },
          _checked: {
            bg: { value: "{colors.brand.600}" },
          },
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, customConfig)
```

### Styling Individual Parts (v3)

```jsx
<Checkbox.Root>
  <Checkbox.HiddenInput />
  <Checkbox.Control
    borderRadius="md"
    borderWidth="2px"
    _checked={{ bg: "purple.500", borderColor: "purple.500" }}
  >
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label fontSize="lg" fontWeight="semibold">
    Custom styled
  </Checkbox.Label>
</Checkbox.Root>
```

### Color Palette System (v3)

```jsx
// Using built-in color palettes
<Stack>
  <Checkbox.Root colorPalette="red">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Red Theme</Checkbox.Label>
  </Checkbox.Root>

  <Checkbox.Root colorPalette="blue">
    <Checkbox.HiddenInput />
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
    <Checkbox.Label>Blue Theme</Checkbox.Label>
  </Checkbox.Root>
</Stack>
```

## 8. Accessibility

Chakra UI Checkbox components are built with accessibility as a core principle, following WAI-ARIA standards.

### Built-in Accessibility Features

#### Keyboard Support
- **Tab**: Move focus to/from the checkbox
- **Space**: Toggle checkbox checked state
- All checkboxes are keyboard navigable by default

#### ARIA Attributes (Automatically Managed)

**v2 & v3 Common Features:**
- `role="checkbox"` - Automatically applied
- `aria-checked` - Reflects checked/unchecked/indeterminate state
- `aria-disabled` - Applied when disabled
- `aria-invalid` - Applied when invalid
- `aria-required` - Applied when required

#### Screen Reader Support

Both v2 and v3 provide full screen reader compatibility:
- Label association through proper HTML structure
- State announcements (checked/unchecked/indeterminate)
- Disabled and invalid states are announced
- Group context provided through CheckboxGroup

### Accessibility Best Practices

**Always Provide Labels:**
```jsx
// Good - label text provided
<Checkbox>Accept terms</Checkbox>

// Good - aria-label for icon-only checkbox
<Checkbox aria-label="Accept terms" />

// Bad - no label
<Checkbox />
```

**Use aria-describedby for Additional Context (v2):**
```jsx
<>
  <Checkbox aria-describedby="terms-description">
    Accept terms
  </Checkbox>
  <Text id="terms-description" fontSize="sm" color="gray.600">
    By checking this box, you agree to our terms and conditions
  </Text>
</>
```

**Proper Grouping:**
```jsx
// v2
<CheckboxGroup>
  <FormLabel>Select your interests</FormLabel>
  <Stack>
    <Checkbox value="sports">Sports</Checkbox>
    <Checkbox value="music">Music</Checkbox>
    <Checkbox value="art">Art</Checkbox>
  </Stack>
</CheckboxGroup>

// v3
<Fieldset.Root>
  <CheckboxGroup name="interests">
    <Fieldset.Legend>Select your interests</Fieldset.Legend>
    <Fieldset.Content>
      <Checkbox.Root value="sports">
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Sports</Checkbox.Label>
      </Checkbox.Root>
      {/* More checkboxes... */}
    </Fieldset.Content>
  </CheckboxGroup>
</Fieldset.Root>
```

**Indeterminate State Accessibility:**

The indeterminate state has been a topic of accessibility discussion in the Chakra UI community. As of recent versions:
- Indeterminate state is properly announced to screen readers
- The `aria-checked="mixed"` attribute is set for indeterminate checkboxes
- Screen readers announce the state as "mixed" or "partially checked"

### Focus Management

Both versions provide visible focus indicators by default:
```jsx
// Customizing focus style (v2)
<Checkbox
  _focus={{
    boxShadow: 'outline',
    borderColor: 'blue.500',
  }}
>
  Custom focus
</Checkbox>

// Customizing focus style (v3)
<Checkbox.Root>
  <Checkbox.HiddenInput />
  <Checkbox.Control
    _focus={{
      boxShadow: 'outline',
      borderColor: 'blue.500',
    }}
  >
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Custom focus</Checkbox.Label>
</Checkbox.Root>
```

## 9. Best Practices

### When to Use Checkboxes

**Use checkboxes when:**
- Users need to select multiple options from a list
- Users need to turn a single option on or off
- Users need to see all options at once
- Selections are independent of each other

**Don't use checkboxes when:**
- Only one option can be selected (use Radio buttons instead)
- The action is immediate (use Switch instead)
- There are too many options (use a multi-select dropdown instead)

### State Management

**Prefer Uncontrolled Components for Simple Cases:**
```jsx
// v2
<Checkbox defaultChecked>Simple checkbox</Checkbox>

// v3
<Checkbox.Root defaultChecked>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Simple checkbox</Checkbox.Label>
</Checkbox.Root>
```

**Use Controlled Components When:**
- State needs to be synchronized with other components
- Form validation is required
- State needs to be persisted or logged
- Complex logic depends on checkbox state

### CheckboxGroup Usage

**Use CheckboxGroup When:**
- Managing multiple related checkboxes
- Need to get/set values as an array
- Want consistent styling across checkboxes
- Need form submission with grouped values

```jsx
// v2 - Clean way to handle multiple checkboxes
<CheckboxGroup defaultValue={['email', 'sms']}>
  <Stack>
    <Checkbox value="email">Email notifications</Checkbox>
    <Checkbox value="sms">SMS notifications</Checkbox>
    <Checkbox value="push">Push notifications</Checkbox>
  </Stack>
</CheckboxGroup>
```

### Indeterminate Pattern Best Practices

**Use Indeterminate State For:**
- Parent checkbox controlling multiple child checkboxes
- Showing partial selection in hierarchical data
- "Select All" functionality with some items already selected

**Implementation Tips:**
1. Parent checkbox should show indeterminate when some (but not all) children are checked
2. Clicking indeterminate parent should either check all or uncheck all (be consistent)
3. Always calculate indeterminate state based on children state, don't store it separately

### Migration Guide (v2 → v3)

**Step 1: Update Component Structure**
```jsx
// Before (v2)
<Checkbox>Label</Checkbox>

// After (v3)
<Checkbox.Root>
  <Checkbox.HiddenInput />
  <Checkbox.Control>
    <Checkbox.Indicator />
  </Checkbox.Control>
  <Checkbox.Label>Label</Checkbox.Label>
</Checkbox.Root>
```

**Step 2: Update Prop Names**
```jsx
// v2
<Checkbox
  isChecked={checked}
  isDisabled={disabled}
  isInvalid={invalid}
  colorScheme="blue"
  onChange={(e) => setChecked(e.target.checked)}
/>

// v3
<Checkbox.Root
  checked={checked}
  disabled={disabled}
  invalid={invalid}
  colorPalette="blue"
  onCheckedChange={(e) => setChecked(!!e.checked)}
/>
```

**Step 3: Update Indeterminate State**
```jsx
// v2
<Checkbox isIndeterminate={isIndeterminate} />

// v3
<Checkbox.Root checked={isIndeterminate ? "indeterminate" : checked} />
```

**Step 4: Consider Using Snippets**

v3 provides a snippets CLI that can generate simplified wrapper components:
```bash
npx @chakra-ui/cli snippet add checkbox
```

This creates a wrapper component that provides a v2-like API while using v3 under the hood.

### Performance Considerations

**Avoid Unnecessary Re-renders:**
```jsx
// Bad - creates new function on every render
<Checkbox onChange={() => handleChange(id)}>Label</Checkbox>

// Good - use useCallback or stable function reference
const handleChangeWithId = useCallback(() => handleChange(id), [id])
<Checkbox onChange={handleChangeWithId}>Label</Checkbox>
```

**Optimize Large Lists:**
```jsx
// Use React.memo for checkbox items in large lists
const CheckboxItem = React.memo(({ label, value, onChange }) => (
  <Checkbox value={value} onChange={onChange}>
    {label}
  </Checkbox>
))

// In parent component
<CheckboxGroup>
  {items.map(item => (
    <CheckboxItem key={item.id} {...item} />
  ))}
</CheckboxGroup>
```

### Form Integration

**With React Hook Form (v2):**
```jsx
import { useForm, Controller } from 'react-hook-form'

function FormExample() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="terms"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Checkbox {...field}>
            Accept terms
          </Checkbox>
        )}
      />
    </form>
  )
}
```

**With React Hook Form (v3):**
```jsx
"use client"
import { useForm, Controller } from 'react-hook-form'
import { Checkbox } from '@chakra-ui/react'

function FormExample() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="terms"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange, ...field } }) => (
          <Checkbox.Root
            {...field}
            checked={value}
            onCheckedChange={(e) => onChange(!!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Accept terms</Checkbox.Label>
          </Checkbox.Root>
        )}
      />
    </form>
  )
}
```

## 10. Comparison Notes

### Unique Features

**Compared to Native HTML Checkbox:**
- Built-in theming system
- Consistent styling across browsers
- Indeterminate state support with proper styling
- Integration with Chakra's design token system
- Advanced accessibility features beyond basic HTML

**Compared to Other Component Libraries:**

**Material-UI:**
- Chakra's API is more flexible with style props
- Chakra v3's composable structure provides more granular control
- Material-UI has a more opinionated design system

**Ant Design:**
- Chakra provides better TypeScript support
- Ant Design has more built-in form integration
- Chakra's theming is more flexible

**Radix UI:**
- Chakra v3 is actually built on top of Ark UI (similar philosophy to Radix)
- Chakra provides styled components out of the box
- Radix is unstyled by default

### Architecture Evolution

**v2 Philosophy:**
- Monolithic components with all features built-in
- Simple API but less flexible for advanced customization
- Easier to use for common cases

**v3 Philosophy:**
- Composable components following headless UI principles
- More boilerplate but maximum flexibility
- Better separation of concerns
- Aligns with modern React patterns (similar to Radix, Ark UI)

### Developer Experience

**v2 Strengths:**
- Less code for simple use cases
- Familiar single-component API
- Faster to prototype

**v3 Strengths:**
- More control over rendering and styling
- Better for complex custom designs
- More semantic HTML structure
- Better TypeScript inference for component parts

### Bundle Size Considerations

- v3 is more tree-shakeable due to composable nature
- v2 may include unused features in bundle
- v3 allows importing only needed component parts

### Community & Ecosystem

- v2 has more community examples and third-party resources (as of 2025)
- v3 is the future direction with active development
- Migration path exists but requires manual work
- Snippets system in v3 helps bridge the gap

---

## Summary of Key Findings

### Major v2/v3 Differences

1. **API Structure**: v2 uses single-component API; v3 uses composable components (Root, Control, Label, Indicator, HiddenInput)

2. **Prop Naming**:
   - `isChecked` → `checked`
   - `isIndeterminate` → `checked="indeterminate"`
   - `colorScheme` → `colorPalette`
   - `onChange` → `onCheckedChange`

3. **Indeterminate State**: v2 uses boolean prop; v3 uses string value on `checked` prop

4. **Theming**: v2 uses component theme API; v3 uses semantic tokens and design system

5. **Event Handling**: v2 passes native event; v3 passes details object with `checked` property

6. **Migration**: No codemods available; manual migration required; snippets can help

### Notable Unique Features

- **Composable Architecture (v3)**: Granular control over each part of the checkbox
- **Color Palette System (v3)**: More flexible theming than v2's colorScheme
- **Built-in Accessibility**: Both versions follow WAI-ARIA standards with automatic ARIA attributes
- **Indeterminate State**: Full support with proper visual indicators and accessibility
- **CheckboxGroup**: Convenient state management for multiple checkboxes
- **Form Integration**: Works seamlessly with form libraries and native forms

---

**Research Date**: 2025-11-04
**Chakra UI Versions Analyzed**: v2.x and v3.x
**Documentation Sources**: Official Chakra UI docs, GitHub discussions, community resources
