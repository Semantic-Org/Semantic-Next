# Mantine - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/switch/
Status: ✅ Working
Version: Current (v7.x)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with interactive examples, clear API reference, accessibility guidance, and detailed customization options.

## Component Definition
- **Core purpose**: Captures boolean input from users as an interactive toggle control for true/false states. Provides an alternative to checkboxes with a more modern, mobile-friendly interface that clearly shows on/off states.
- **Mental model**: A physical toggle switch that slides between two states - visually represents binary choices with immediate visual feedback through position and color changes.
- **Semantic meaning**: Indicates a binary setting or preference that takes effect immediately upon interaction, typically used for enable/disable features, settings, or instant state changes rather than form submissions.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`, `label="Text"`)
- **Composed**: Via composition/children (e.g., `<Switch.Group>{children}</Switch.Group>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}` or Styles API)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Native | `label` prop for external label, `onLabel`/`offLabel` for inner track text |
| Icons | ✅ | Native | `thumbIcon` prop for icon in thumb, `onLabel`/`offLabel` accept JSX icons |
| Loading indicator | ❌ | - | Not available |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `checked` prop (controlled), `defaultChecked` (uncontrolled) |
| Disabled | ✅ | Native | `disabled` prop prevents interaction |
| Loading | ❌ | - | Not available |
| Read-only | ❌ | - | Not available (use disabled instead) |
| Error | ✅ | Native | `error` prop displays error message below switch |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size`: xs, sm, md, lg, xl |
| Color options | ✅ | Native | `color` prop accepts Mantine color values |
| Label placement | ✅ | Native | Label positioning: right (default) or left |
| Radius | ✅ | Native | `radius`: xs, sm, md, lg, xl |
| Inner labels | ✅ | Native | `onLabel`/`offLabel` for text/icons inside track |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Standard toggle behavior on click |
| Keyboard control | ✅ | Native | Standard input[type="checkbox"] keyboard behavior |
| onChange handler | ✅ | Native | `onChange` receives event with `event.currentTarget.checked` |
| Controlled mode | ✅ | Native | `checked` + `onChange` props |
| Uncontrolled mode | ✅ | Native | `defaultChecked` prop |
| Group selection | ✅ | Composed | `Switch.Group` component for multiple switches |

## Code Examples

### Basic Usage
```jsx
import { Switch } from '@mantine/core';

function Demo() {
  return (
    <Switch
      defaultChecked
      label="I agree to sell my privacy"
    />
  );
}
```

### Controlled Switch
```jsx
import { useState } from 'react';
import { Switch } from '@mantine/core';

function Demo() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
      label="Toggle me"
    />
  );
}
```

### Size Variations with Inner Labels
```jsx
import { Switch, Group } from '@mantine/core';

function Demo() {
  return (
    <Group justify="center">
      <Switch size="xs" onLabel="ON" offLabel="OFF" />
      <Switch size="sm" onLabel="ON" offLabel="OFF" />
      <Switch size="md" onLabel="ON" offLabel="OFF" />
      <Switch size="lg" onLabel="ON" offLabel="OFF" />
      <Switch size="xl" onLabel="ON" offLabel="OFF" />
    </Group>
  );
}
```

### Icon Labels (Light/Dark Mode Toggle)
```jsx
import { Switch } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

function Demo() {
  return (
    <Switch
      size="md"
      color="dark.4"
      onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
      offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
    />
  );
}
```

### Thumb Icon (Dynamic Feedback)
```jsx
import { useState } from 'react';
import { Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
      color="teal"
      size="md"
      label="Switch with thumb icon"
      thumbIcon={
        checked ? (
          <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
        ) : (
          <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
        )
      }
    />
  );
}
```

### Switch Group (Multiple Selections)
```jsx
import { Switch, Group } from '@mantine/core';

function Demo() {
  return (
    <Switch.Group
      defaultValue={['react']}
      label="Select your favorite framework/library"
      description="This is anonymous"
      withAsterisk
    >
      <Group mt="xs">
        <Switch value="react" label="React" />
        <Switch value="svelte" label="Svelte" />
        <Switch value="ng" label="Angular" />
        <Switch value="vue" label="Vue" />
      </Group>
    </Switch.Group>
  );
}
```

### Controlled Switch.Group
```jsx
import { useState } from 'react';
import { Switch, Group } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Switch.Group value={value} onChange={setValue}>
      <Group mt="xs">
        <Switch value="react" label="React" />
        <Switch value="svelte" label="Svelte" />
      </Group>
    </Switch.Group>
  );
}
```

### Error State
```jsx
import { Switch } from '@mantine/core';

function Demo() {
  return (
    <Switch
      label="Accept terms"
      description="You must accept terms to continue"
      error="Please accept terms and conditions"
    />
  );
}
```

### Accessibility (Without Visible Label)
```jsx
import { Switch } from '@mantine/core';

// ❌ Not accessible
function Bad() {
  return <Switch />;
}

// ✅ Accessible with aria-label
function Good() {
  return <Switch aria-label="I agree to everything" />;
}

// ✅ Accessible with visible label
function AlsoGood() {
  return <Switch label="I agree to everything" />;
}
```

[View Live](https://mantine.dev/core/switch/)

## Notable Features

### Unique Features
- **Inner track labels**: The `onLabel` and `offLabel` props allow displaying text or icons inside the switch track itself, providing additional context without external labels
- **Thumb icon customization**: Dynamic icons can be displayed within the toggle thumb that change based on state, providing rich visual feedback
- **Switch.Group component**: Built-in grouping component that manages multiple switches as a collection with shared label, description, and validation
- **Rich visual customization**: Extensive Styles API with 10 distinct targets (root, track, trackLabel, thumb, input, body, labelWrapper, label, description, error)

### Implementation Details
- **HTML structure**: Renders as semantic `input[type="checkbox"]` for native form integration and accessibility
- **State management**: Supports both controlled (`checked` + `onChange`) and uncontrolled (`defaultChecked`) patterns
- **Transitions**: Smooth 200ms CSS transitions for background-color and border-color changes
- **Composition**: Follows Mantine's compound component pattern with `Switch.Group` for related switches
- **Theme integration**: Deeply integrated with Mantine's theme system for colors, spacing, and sizing
- **Form integration**: Works seamlessly with form libraries via standard checkbox input patterns

### Accessibility Highlights
- Semantic checkbox input for screen reader compatibility
- Required `aria-label` when used without visible label
- Standard keyboard navigation (Space/Enter to toggle)
- Proper focus management and visual focus indicators
- Group validation support via `Switch.Group`

## API Reference

### Switch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial checked state |
| `onChange` | `(event: ChangeEvent<HTMLInputElement>) => void` | - | Change event handler |
| `label` | `ReactNode` | - | Text label displayed next to switch |
| `description` | `ReactNode` | - | Description displayed below label |
| `error` | `ReactNode` | - | Error message displayed below description |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Controls switch size |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'xl'` | Border radius |
| `color` | `MantineColor` | `theme.primaryColor` | Active state color |
| `disabled` | `boolean` | `false` | Disables the switch |
| `onLabel` | `ReactNode` | - | Content displayed inside track when checked |
| `offLabel` | `ReactNode` | - | Content displayed inside track when unchecked |
| `thumbIcon` | `ReactNode` | - | Icon displayed within the toggle thumb |
| `wrapperProps` | `React.ComponentPropsWithoutRef<'div'>` | - | Props for root element |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Position of the label |

### Switch.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | - | Controlled value (array of checked switch values) |
| `defaultValue` | `string[]` | - | Uncontrolled initial value |
| `onChange` | `(value: string[]) => void` | - | Called when any switch in group changes |
| `label` | `ReactNode` | - | Group label |
| `description` | `ReactNode` | - | Group description |
| `error` | `ReactNode` | - | Group error message |
| `withAsterisk` | `boolean` | `false` | Displays required asterisk |
| `children` | `ReactNode` | - | Switch components |

### Styles API Targets

- `root` - Root element
- `track` - Switch track (background rail)
- `trackLabel` - Label displayed inside track (onLabel/offLabel)
- `thumb` - Moving toggle thumb
- `input` - Hidden checkbox input
- `body` - Wrapper for label/description/error
- `labelWrapper` - Wrapper for label element
- `label` - Label text
- `description` - Description text
- `error` - Error message text

## Research Notes

### Documentation Quality
The Mantine Switch documentation is exceptionally well-structured with:
- Interactive playground for testing all features
- Clear categorization of features (basic, sizes, colors, icons, etc.)
- Comprehensive code examples for each pattern
- Explicit accessibility guidance
- Detailed props table with TypeScript types
- Styles API reference for deep customization

### Framework Approach
Mantine follows a highly composable approach:
- Main `Switch` component handles individual toggles
- `Switch.Group` provides grouping functionality similar to RadioGroup/CheckboxGroup patterns
- Deep integration with Mantine's theme system
- Extensive customization via both props and Styles API

### Comparison Points
- More feature-rich than basic toggle implementations (inner labels, thumb icons)
- Provides both simple and complex use cases (individual vs. grouped switches)
- Strong TypeScript support with well-defined prop types
- Follows React ecosystem patterns (controlled/uncontrolled, composition)

### Notable Design Decisions
1. **Checkbox foundation**: Uses `input[type="checkbox"]` rather than custom elements for better accessibility and form integration
2. **Inner label flexibility**: Accepts both text and JSX (icons) for onLabel/offLabel, enabling rich visual designs
3. **Thumb icon pattern**: Separate from track labels, allowing dynamic visual feedback within the thumb itself
4. **Group composition**: Separate component rather than prop-based grouping, following Mantine's compositional patterns
5. **No loading state**: Unlike some other Mantine inputs, Switch doesn't include a loading state - design philosophy appears to be immediate state changes

---

**Research completed**: 2025-11-05
**Component**: Switch
**Framework**: Mantine
**Documentation URL**: https://mantine.dev/core/switch/
