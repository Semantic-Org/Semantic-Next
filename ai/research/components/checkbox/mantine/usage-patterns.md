# Mantine - Checkbox Usage Patterns

## Component URL
https://mantine.dev/core/checkbox/
Status: ✅ Working
Version: Current (v7.x based on search results, v7.10.0 mentioned)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The Mantine Checkbox documentation is thorough with extensive examples, clear API documentation, multiple usage patterns, accessibility guidance, and advanced customization options.

## Component Overview

The Mantine Checkbox is a versatile form control component that enables users to select one or multiple options from a set. It supports both individual checkboxes and grouped selections through `Checkbox.Group`, with comprehensive features including checked/unchecked states, indeterminate state for hierarchical selections, custom icon support, and full accessibility compliance. The component is built with Mantine's powerful Styles API for deep customization and integrates seamlessly with Mantine's form management system.

Mantine uniquely provides multiple checkbox-related components: the standard `Checkbox` for semantic form controls, `Checkbox.Indicator` for visual representation without semantic meaning (useful in cards and trees), and `Checkbox.Card` for building custom interactive checkbox cards. This compositional approach offers flexibility for various UI patterns while maintaining accessibility where appropriate.

## Basic Usage

### Uncontrolled Checkbox
```tsx
import { Checkbox } from '@mantine/core';

function Demo() {
  return (
    <Checkbox
      defaultChecked
      label="I agree to sell my privacy"
    />
  );
}
```

### Controlled Checkbox
```tsx
import { useState } from 'react';
import { Checkbox } from '@mantine/core';

function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
      label="Accept terms and conditions"
    />
  );
}
```

### Checkbox with Description and Error
```tsx
import { Checkbox } from '@mantine/core';

function Demo() {
  return (
    <Checkbox
      label="Subscribe to newsletter"
      description="Get weekly updates about new features"
      error="You must accept the terms"
    />
  );
}
```

## Props/API

### Checkbox Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `React.ReactNode` | - | Checkbox label text, for accessibility either label or aria-label must be provided |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Position of the label relative to the checkbox input |
| `description` | `React.ReactNode` | - | Description text displayed below the label |
| `error` | `React.ReactNode` | - | Error message displayed below the description |
| `checked` | `boolean` | - | Controlled checked state (ignored if indeterminate is set) |
| `defaultChecked` | `boolean` | - | Initial checked state for uncontrolled component |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler called when checkbox state changes |
| `indeterminate` | `boolean` | - | Indeterminate state, when set, checked prop is ignored |
| `disabled` | `boolean` | - | Disables the checkbox input |
| `value` | `string` | - | Value used when checkbox is part of Checkbox.Group |
| `color` | `MantineColor` | - | Color from theme or any valid CSS color (e.g., "lime.4") |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Controls label font-size, input width and height |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Border radius from theme |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Visual style variant |
| `icon` | `CheckboxProps['icon']` | - | Custom icon component for checked/indeterminate states |
| `iconColor` | `string` | - | Color for the checkbox icon, uses theme.colors or valid CSS color |
| `autoContrast` | `boolean` | - | If set, adjusts text color based on background color for filled variant |
| `wrapperProps` | `object` | - | Props to add to the root wrapper element |
| `classNames` | `object` | - | Object with className for each style selector |
| `styles` | `object` | - | Object with styles for each style selector |
| `aria-label` | `string` | - | Accessibility label when visual label is not present |

### Checkbox.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | - | Controlled value (array of selected checkbox values) |
| `defaultValue` | `string[]` | - | Initial value for uncontrolled component |
| `onChange` | `(value: string[]) => void` | - | Called with array of selected values when any checkbox changes |
| `label` | `React.ReactNode` | - | Group label displayed above checkboxes |
| `description` | `React.ReactNode` | - | Description text displayed below the label |
| `error` | `React.ReactNode` | - | Error message displayed below the group |
| `withAsterisk` | `boolean` | - | Displays a required asterisk next to the label |
| `children` | `React.ReactNode` | - | Checkbox components |

### Checkbox.Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `onClick` | `() => void` | - | Click handler for the card |
| `value` | `string` | - | Value for use with Checkbox.Group |
| `radius` | `MantineRadius` | - | Border radius |
| `children` | `React.ReactNode` | - | Card content (typically includes Checkbox.Indicator) |

### Checkbox.Indicator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Visual checked state |
| `indeterminate` | `boolean` | - | Visual indeterminate state |
| `color` | `MantineColor` | - | Color from theme |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | - | Size of the indicator |
| `icon` | `CheckboxProps['icon']` | - | Custom icon component |

**Note**: Checkbox.Indicator is purely visual and non-semantic - it cannot be focused or selected with keyboard and should not replace accessible Checkbox components.

## Variants & Patterns

### Size Variants
Mantine provides 5 predefined sizes that control label font-size, input width and height:

```tsx
<Checkbox size="xs" label="Extra small checkbox" />
<Checkbox size="sm" label="Small checkbox" />
<Checkbox size="md" label="Medium checkbox" /> {/* Default */}
<Checkbox size="lg" label="Large checkbox" />
<Checkbox size="xl" label="Extra large checkbox" />
```

**Custom Sizes**: You can extend the theme to add custom sizes (e.g., "xxs", "xxl") using the `Checkbox.extend()` method and CSS modules.

### Color Variants
Checkboxes can use any color from the Mantine theme or custom CSS colors:

```tsx
<Checkbox color="blue" label="Blue checkbox" />
<Checkbox color="red" label="Red checkbox" />
<Checkbox color="lime.4" label="Lime checkbox" />
<Checkbox color="#ff6b6b" label="Custom color checkbox" />
```

The `iconColor` prop separately controls the checkmark icon color:

```tsx
<Checkbox
  color="blue"
  iconColor="yellow"
  label="Blue checkbox with yellow icon"
/>
```

### Visual Style Variants
Mantine Checkbox supports two variants:

```tsx
{/* Filled variant (default) - solid background when checked */}
<Checkbox variant="filled" label="Filled checkbox" />

{/* Outline variant - outlined border when checked */}
<Checkbox variant="outline" label="Outline checkbox" />
```

### Label Positioning
Control label position relative to the checkbox:

```tsx
<Checkbox labelPosition="right" label="Label on right" /> {/* Default */}
<Checkbox labelPosition="left" label="Label on left" />
```

### Description Text
Add contextual information below the label:

```tsx
<Checkbox
  label="Subscribe to newsletter"
  description="Get weekly updates about new features and improvements"
/>
```

### Error States
Display validation errors:

```tsx
<Checkbox
  label="Accept terms"
  error="You must accept the terms and conditions"
/>
```

Errors work with both individual checkboxes and Checkbox.Group:

```tsx
<Checkbox.Group
  label="Select frameworks"
  error="You must select at least one framework"
>
  <Checkbox value="react" label="React" />
  <Checkbox value="vue" label="Vue" />
</Checkbox.Group>
```

### Indeterminate State
Useful for "select all" scenarios or hierarchical selections:

```tsx
import { useState } from 'react';
import { Checkbox } from '@mantine/core';

function Demo() {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      label="Select all items"
      onChange={() => {
        setChecked((c) => !c);
        setIndeterminate(false);
      }}
    />
  );
}
```

**Important**: When `indeterminate` is set to `true`, the `checked` prop is ignored and the checkbox always displays checked styles with an indeterminate icon.

### Checkbox Groups (Checkbox.Group)
Manage multiple related checkboxes with a single state:

```tsx
import { useState } from 'react';
import { Checkbox, Group } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<string[]>(['react']);

  return (
    <Checkbox.Group
      value={value}
      onChange={setValue}
      label="Select your favorite frameworks/libraries"
      description="This is anonymous"
      withAsterisk
    >
      <Group mt="xs">
        <Checkbox value="react" label="React" />
        <Checkbox value="svelte" label="Svelte" />
        <Checkbox value="ng" label="Angular" />
        <Checkbox value="vue" label="Vue" />
      </Group>
    </Checkbox.Group>
  );
}
```

### Icon Customization
Customize the checkbox icon for different states:

```tsx
import { Checkbox } from '@mantine/core';
import { IconBiohazard, IconRadioactive } from '@tabler/icons-react';

const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconRadioactive {...others} /> : <IconBiohazard {...others} />;

function Demo() {
  return (
    <Checkbox
      icon={CheckboxIcon}
      label="Custom icon checkbox"
    />
  );
}
```

### Disabled State
Disable user interaction:

```tsx
<Checkbox disabled label="Disabled checkbox" />
<Checkbox disabled checked label="Disabled checked" />

{/* In a group */}
<Checkbox.Group label="Select options">
  <Checkbox value="1" label="Option 1" />
  <Checkbox value="2" label="Option 2" disabled />
</Checkbox.Group>
```

## Composition Patterns

### Form Integration with use-form
Seamless integration with Mantine's form management:

```tsx
import { useForm } from '@mantine/form';
import { Checkbox, Button } from '@mantine/core';

function Demo() {
  const form = useForm({
    initialValues: {
      termsOfService: false,
      newsletter: true,
    },
    validate: {
      termsOfService: (value) =>
        !value && 'You must accept terms of service',
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Checkbox
        label="I agree to sell my privacy"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

      <Checkbox
        mt="md"
        label="Subscribe to newsletter"
        key={form.key('newsletter')}
        {...form.getInputProps('newsletter', { type: 'checkbox' })}
      />

      <Button type="submit" mt="md">Submit</Button>
    </form>
  );
}
```

**Important**: When using `form.getInputProps()` with Checkbox, you must specify `{ type: 'checkbox' }` option.

### Custom Checkbox Cards
Create interactive card-based checkbox selections:

```tsx
import { useState } from 'react';
import { Checkbox, Group, Text } from '@mantine/core';

function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox.Card
      checked={checked}
      onClick={() => setChecked((c) => !c)}
      radius="md"
      p="lg"
    >
      <Group wrap="nowrap" align="flex-start">
        <Checkbox.Indicator />
        <div>
          <Text fw={500}>Premium Plan</Text>
          <Text size="sm" c="dimmed">
            All features included, unlimited projects
          </Text>
        </div>
      </Group>
    </Checkbox.Card>
  );
}
```

### Checkbox Cards with Groups
```tsx
import { useState } from 'react';
import { Checkbox, Stack, Group, Text } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<string[]>([]);

  const cards = [
    { value: 'basic', title: 'Basic Plan', description: '10 projects max' },
    { value: 'pro', title: 'Pro Plan', description: '100 projects max' },
    { value: 'enterprise', title: 'Enterprise', description: 'Unlimited' },
  ];

  return (
    <Checkbox.Group value={value} onChange={setValue}>
      <Stack>
        {cards.map((card) => (
          <Checkbox.Card
            key={card.value}
            value={card.value}
            radius="md"
            p="lg"
          >
            <Group wrap="nowrap" align="flex-start">
              <Checkbox.Indicator />
              <div>
                <Text fw={500}>{card.title}</Text>
                <Text size="sm" c="dimmed">{card.description}</Text>
              </div>
            </Group>
          </Checkbox.Card>
        ))}
      </Stack>
    </Checkbox.Group>
  );
}
```

### Layout Patterns
Common layout approaches for checkboxes:

```tsx
import { Checkbox, Stack, Group } from '@mantine/core';

// Vertical stack
<Stack>
  <Checkbox label="Option 1" />
  <Checkbox label="Option 2" />
  <Checkbox label="Option 3" />
</Stack>

// Horizontal group
<Group>
  <Checkbox label="Option 1" />
  <Checkbox label="Option 2" />
  <Checkbox label="Option 3" />
</Group>

// With Checkbox.Group for state management
<Checkbox.Group value={value} onChange={setValue}>
  <Stack mt="xs">
    <Checkbox value="1" label="Option 1" />
    <Checkbox value="2" label="Option 2" />
  </Stack>
</Checkbox.Group>
```

## Styling & Theming

### Mantine Theme Integration
Checkboxes automatically integrate with the Mantine theme system and respect global theme settings for colors, spacing, fonts, and radius.

### CSS Modules with classNames
Apply custom styles to specific parts of the component:

```tsx
import { Checkbox } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Checkbox
      classNames={{
        root: classes.root,
        input: classes.input,
        label: classes.label,
        icon: classes.icon,
        inner: classes.inner,
      }}
      label="Custom styled checkbox"
    />
  );
}
```

**Available Style Selectors**:
- `root` - Root wrapper element
- `input` - Checkbox input element
- `label` - Label text element
- `icon` - Icon element (checkmark)
- `inner` - Inner wrapper element

### Styles API with Inline Styles
Apply inline styles to component parts:

```tsx
<Checkbox
  styles={{
    label: { color: 'blue', fontSize: 16 },
    input: { cursor: 'pointer' },
  }}
  label="Custom styled"
/>
```

### Theme-Level Customization
Customize all checkboxes in your application:

```tsx
import { MantineProvider, Checkbox, createTheme } from '@mantine/core';
import classes from './Demo.module.css';

const theme = createTheme({
  components: {
    Checkbox: Checkbox.extend({
      classNames: classes,
      defaultProps: {
        size: 'md',
        radius: 'sm',
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* All checkboxes will use custom styles */}
    </MantineProvider>
  );
}
```

### CSS Variables
Mantine Checkbox uses CSS custom properties that can be overridden:

- `--checkbox-size` - Controls input dimensions
- `--checkbox-radius` - Controls border radius
- `--checkbox-color` - Controls color (set via color prop)

### Conditional Styling Based on Props
Apply styles dynamically based on component state:

```tsx
import { createTheme, Checkbox } from '@mantine/core';
import cx from 'clsx';
import classes from './Demo.module.css';

const theme = createTheme({
  components: {
    Checkbox: Checkbox.extend({
      classNames: (_theme, props) => ({
        label: cx({ [classes.labelRequired]: props.withAsterisk }),
        input: cx({ [classes.inputError]: props.error }),
      }),
    }),
  },
});
```

### Styling Checked State
Use data attributes in CSS to style based on state:

```css
/* Demo.module.css */
.root[data-checked] {
  border-color: blue;
  background-color: lightblue;
}

.input[data-checked] {
  /* Styles for checked state */
}
```

### Wrapper Props
Add custom attributes to the root element:

```tsx
<Checkbox
  wrapperProps={{
    'data-testid': 'my-checkbox',
    'data-analytics': 'terms-checkbox'
  }}
  label="Terms and conditions"
/>
```

## Accessibility

### ARIA Attributes
Mantine Checkbox provides comprehensive ARIA support:

- **Role**: The root element automatically has `role="checkbox"` attribute
- **aria-label**: Use when visual label is not present
  ```tsx
  <Checkbox aria-label="Accept terms" />
  ```
- **aria-checked**: Automatically managed based on checked/indeterminate state
- **aria-invalid**: Set when error prop is provided
- **aria-describedby**: Automatically links description and error text

### Label Association
Checkboxes must have accessible labels:

```tsx
{/* Preferred: Visible label */}
<Checkbox label="Subscribe to newsletter" />

{/* Alternative: ARIA label for no visible text */}
<Checkbox aria-label="Accept terms" />
```

**Required**: Either `label` or `aria-label` must be provided for accessibility.

### Keyboard Support
Full keyboard navigation following standard HTML checkbox behavior:

- **Space**: Toggle checkbox state (check/uncheck)
- **Tab**: Focus next checkbox
- **Shift + Tab**: Focus previous checkbox

The component supports the same keyboard interactions as native `input[type="checkbox"]`.

### Screen Reader Support
- Checkbox state (checked/unchecked/indeterminate) is announced
- Label text is read when checkbox receives focus
- Description and error messages are associated and announced
- Group labels are announced when navigating into Checkbox.Group

### Focus Management
- Visible focus indicator on keyboard navigation
- Focus states are properly managed
- Custom focus styles can be applied via Styles API

### Accessibility Notes
**Checkbox.Indicator Important Note**:
- Cannot be focused or selected with keyboard
- Not accessible - purely visual representation
- Should NOT replace semantic Checkbox components
- Use only for visual state display in non-interactive contexts (e.g., displaying selected state in a larger clickable card)

**Checkbox.Card Accessibility**:
- Fully accessible with `role="checkbox"` attribute
- Supports same keyboard interactions as standard checkbox
- Properly announces state to screen readers

## Best Practices

### When to Use
- **Multi-select forms**: Allow users to select multiple options from a list
- **Boolean settings**: Enable/disable features or preferences
- **Terms acceptance**: Require agreement to terms and conditions
- **Filter interfaces**: Select multiple criteria for filtering content
- **Permission management**: Select multiple permissions or access levels
- **Task lists**: Mark items as complete/incomplete

### When NOT to Use
- **Single selection from options**: Use Radio buttons instead
- **Binary state toggle**: Consider Switch component for on/off states
- **Navigation**: Use other components like Tabs or Menu

### Common Patterns

**1. Required Fields**
```tsx
<Checkbox
  label="I accept the terms and conditions"
  withAsterisk
  {...form.getInputProps('terms', { type: 'checkbox' })}
/>
```

**2. Select All Pattern**
```tsx
function SelectAllDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const allValues = ['react', 'vue', 'angular', 'svelte'];

  const allChecked = selected.length === allValues.length;
  const indeterminate = selected.length > 0 && !allChecked;

  return (
    <>
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label="Select all"
        onChange={() => setSelected(allChecked ? [] : allValues)}
      />
      <Checkbox.Group value={selected} onChange={setSelected}>
        <Stack mt="xs">
          {allValues.map((value) => (
            <Checkbox key={value} value={value} label={value} />
          ))}
        </Stack>
      </Checkbox.Group>
    </>
  );
}
```

**3. Nested Checkboxes**
For hierarchical selections, use indeterminate state on parent checkboxes to indicate partial selection of children.

**4. Form Validation**
Always validate checkbox state when user input is required:
```tsx
const form = useForm({
  validate: {
    terms: (value) => !value && 'You must accept terms',
  },
});
```

### Gotchas

**1. Checkbox.Group type: 'checkbox' requirement**
When using `form.getInputProps()` with Checkbox, you MUST specify `{ type: 'checkbox' }`:
```tsx
// ❌ Wrong - won't work properly
{...form.getInputProps('myCheckbox')}

// ✅ Correct
{...form.getInputProps('myCheckbox', { type: 'checkbox' })}
```

**2. Indeterminate overrides checked**
When `indeterminate={true}`, the `checked` prop is ignored:
```tsx
// This will show indeterminate state, not checked
<Checkbox checked={true} indeterminate={true} />
```

**3. Checkbox.Indicator is not accessible**
Never use Checkbox.Indicator as a replacement for semantic Checkbox in interactive contexts. It's purely visual.

**4. Value prop with Checkbox.Group**
Individual checkboxes need a `value` prop to work with Checkbox.Group:
```tsx
// ❌ Wrong - won't work with group
<Checkbox.Group value={value}>
  <Checkbox label="React" />
</Checkbox.Group>

// ✅ Correct
<Checkbox.Group value={value}>
  <Checkbox value="react" label="React" />
</Checkbox.Group>
```

**5. Controlled vs Uncontrolled**
Don't mix controlled and uncontrolled patterns:
```tsx
// ❌ Wrong - mixing patterns
<Checkbox checked={checked} defaultChecked={true} />

// ✅ Correct - pick one
<Checkbox checked={checked} onChange={handleChange} />
// or
<Checkbox defaultChecked={true} />
```

## Comparison Notes

### Unique Mantine Features

**1. Three-Component System**
- **Checkbox**: Semantic, accessible form control
- **Checkbox.Indicator**: Visual-only, non-semantic indicator
- **Checkbox.Card**: Interactive card wrapper for checkbox UI patterns

This separation provides flexibility while maintaining clear semantic boundaries.

**2. Powerful Styles API**
Mantine's Styles API is exceptionally comprehensive, offering:
- Fine-grained control over every component part
- Theme-level customization with `Checkbox.extend()`
- CSS modules integration
- CSS-in-JS with `styles` prop
- CSS variables for runtime customization
- Conditional styling based on props

**3. iconColor Prop**
Separate control over checkbox background color and checkmark icon color, providing more design flexibility than many frameworks.

**4. autoContrast Prop**
Automatically adjusts text color based on background color for the filled variant, ensuring WCAG compliance without manual configuration.

**5. Variants System**
Explicit `variant` prop ('filled' | 'outline') provides clear visual style options, unlike some frameworks that rely solely on color props.

**6. Form Integration**
Deep integration with `@mantine/form` package with special `getInputProps` handling for checkbox type, providing type-safe form state management.

### Notable Styling Approach

Mantine takes a hybrid approach to styling:
- **CSS Modules**: Recommended for complex styling with co-located .module.css files
- **Styles API**: Comprehensive system for targeting specific component parts
- **Theme System**: Global customization through `createTheme()`
- **CSS Variables**: Runtime customization without JavaScript
- **Inline Styles**: Quick prototyping with `styles` prop

This multi-modal approach gives developers flexibility to choose the styling method that best fits their project architecture, from traditional CSS to fully type-safe CSS-in-JS solutions.

The Styles API is particularly powerful compared to other frameworks, offering selector-based targeting of internal component elements (root, input, label, icon, inner) with full TypeScript support and the ability to apply conditional styles based on component props.
