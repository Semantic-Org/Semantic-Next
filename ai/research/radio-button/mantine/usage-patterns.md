# Mantine - Radio Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/radio/
Status: ✅ Working
Version: v7.x (current stable)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, thorough prop coverage, TypeScript support, and practical use cases demonstrating all major features including Radio, Radio.Group, Radio.Card, and Radio.Indicator components.

## Component Definition
- **Core purpose**: Provides a wrapper for input type="radio" that enables single selection within a group of options, with rich styling options and states
- **Mental model**: A form control for mutually exclusive choices, supporting both individual radio buttons and grouped selection patterns with visual variants
- **Semantic meaning**: Communicates a single choice from a set of options, with visual cues for selection state, validation, and interaction availability

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `checked={true}`, `disabled`, `color="blue"`)
- **Composed**: Via composition/children (e.g., `<Radio.Group><Radio /></Radio.Group>`)
- **CSS-only**: Requires custom styling via Styles API

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text label | ✅ | Native | `label` prop for text directly adjacent to radio |
| Description text | ✅ | Native | `description` prop for additional helper text below label |
| Custom icon | ✅ | Native | `icon` prop accepts custom icon component to replace default check mark |
| Icon color | ✅ | Native | `iconColor` prop controls check icon color (e.g., `"dark.8"`, `"lime.4"`) |
| Error message | ✅ | Native | `error` prop displays validation error message |
| Group label | ✅ | Native | `Radio.Group` supports `label` prop with optional asterisk via `withAsterisk` |
| Group description | ✅ | Native | `Radio.Group` supports `description` prop for group-level helper text |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single radio | ✅ | Native | Individual `Radio` component for standalone use |
| Radio group | ✅ | Native | `Radio.Group` component manages selection state for multiple radios |
| Visual indicator | ✅ | Native | `Radio.Indicator` - non-semantic visual-only component for display purposes |
| Interactive card | ✅ | Native | `Radio.Card` - fully accessible radio with custom card-style layout |
| Filled variant | ✅ | Native | Default checked state with solid fill |
| Outline variant | ✅ | Native | `variant="outline"` provides outlined checked state |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Unchecked | ✅ | Native | Default state - radio not selected |
| Checked | ✅ | Native | `checked` prop or controlled via `Radio.Group` value |
| Disabled unchecked | ✅ | Native | `disabled` prop on unchecked radio prevents interaction |
| Disabled checked | ✅ | Native | `disabled` prop on checked radio shows selected but non-interactive |
| Error state | ✅ | Native | `error` prop displays validation message |
| Required | ✅ | Composed | `Radio.Group` with `withAsterisk` prop adds asterisk to group label |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `xs`, `sm`, `md`, `lg`, `xl` for both individual Radio and Radio.Group |
| Color options | ✅ | Native | `color` prop accepts theme colors for radio styling |
| Horizontal layout | ✅ | Composed | Use `Group` component to layout radios horizontally within `Radio.Group` |
| Vertical layout | ✅ | Composed | Use `Stack` component to layout radios vertically within `Radio.Group` |
| Custom spacing | ✅ | Composed | Layout containers (`Group`, `Stack`) support `gap` prop for spacing control |
| Cursor styling | ✅ | Native | Theme-level `cursorType` configuration affects default pointer behavior |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uncontrolled | ✅ | Native | `defaultChecked` prop for uncontrolled single radio usage |
| Controlled | ✅ | Native | `checked` + `onChange` props for controlled single radio |
| Group uncontrolled | ✅ | Native | `Radio.Group` with `defaultValue` for uncontrolled group |
| Group controlled | ✅ | Native | `Radio.Group` with `value` + `onChange` for controlled group state |
| onChange handler | ✅ | Native | Standard `onChange` event with `event.currentTarget.checked` access |
| Click handler | ✅ | Native | `Radio.Card` supports `onClick` for toggle behavior |
| Form integration | ✅ | Native | Standard `name` and `value` attributes for form submission |
| Ref support | ✅ | Native | TypeScript ref support via `useRef<HTMLInputElement>(null)` |
| Tooltip support | ✅ | Native | `refProp` configuration for tooltip attachment to input vs entire root element |
| Keyboard support | ✅ | Native | `Radio.Card` includes full keyboard interactions matching native radio inputs |

## Code Examples

### Basic Usage
```tsx
import { Radio } from '@mantine/core';

function Demo() {
  return <Radio label="I cannot be unchecked" />;
}
```

### Controlled Radio
```tsx
import { useState } from 'react';
import { Radio } from '@mantine/core';

function Demo() {
  const [checked, setChecked] = useState(false);
  return (
    <Radio
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
}
```

### All States
```tsx
import { Radio, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Radio checked={false} onChange={() => {}} label="Default radio" />
      <Radio checked onChange={() => {}} label="Checked radio" />
      <Radio checked variant="outline" onChange={() => {}} label="Outline checked radio" />
      <Radio disabled label="Disabled radio" />
      <Radio disabled checked onChange={() => {}} label="Disabled checked radio" />
    </Stack>
  );
}
```

### Custom Icon
```tsx
import { Radio, CheckIcon } from '@mantine/core';

function Demo() {
  return (
    <Radio
      icon={CheckIcon}
      label="Custom check icon"
      name="check"
      value="check"
      defaultChecked
    />
  );
}
```

### Custom Icon Color
```tsx
import { Radio } from '@mantine/core';

function Demo() {
  return (
    <Radio
      iconColor="dark.8"
      color="lime.4"
      label="Custom icon color"
      name="check"
      value="check"
      defaultChecked
    />
  );
}
```

### Disabled State
```tsx
import { Radio, Group } from '@mantine/core';

function Demo() {
  return (
    <Group>
      <Radio checked disabled label="React" value="react" />
      <Radio disabled label="Angular" value="nu" />
      <Radio disabled label="Svelte" value="sv" />
    </Group>
  );
}
```

### Radio with Tooltip
```tsx
import { Tooltip, Radio } from '@mantine/core';

function Demo() {
  return (
    <>
      <Tooltip label="Radio with tooltip">
        <Radio label="Tooltip on radio only" />
      </Tooltip>

      <Tooltip label="Radio with tooltip" refProp="rootRef">
        <Radio label="Tooltip the entire element" mt="md" />
      </Tooltip>
    </>
  );
}
```

### Radio.Group - Basic
```tsx
import { Radio, Group } from '@mantine/core';

function Demo() {
  return (
    <Radio.Group
      name="favoriteFramework"
      label="Select your favorite framework/library"
      description="This is anonymous"
      withAsterisk
    >
      <Group mt="xs">
        <Radio value="react" label="React" />
        <Radio value="svelte" label="Svelte" />
        <Radio value="ng" label="Angular" />
        <Radio value="vue" label="Vue" />
      </Group>
    </Radio.Group>
  );
}
```

### Radio.Group - Controlled
```tsx
import { useState } from 'react';
import { Radio } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState('react');

  return (
    <Radio.Group
      value={value}
      onChange={setValue}
      name="favoriteFramework"
      label="Select your favorite framework/library"
      description="This is anonymous"
      withAsterisk
    >
      <Radio value="react" label="React" />
      <Radio value="svelte" label="Svelte" />
      <Radio value="ng" label="Angular" />
      <Radio value="vue" label="Vue" />
    </Radio.Group>
  );
}
```

### Radio.Indicator
```tsx
import { Radio, Group } from '@mantine/core';

function Demo() {
  return (
    <Group>
      <Radio.Indicator />
      <Radio.Indicator checked />
      <Radio.Indicator disabled />
      <Radio.Indicator disabled checked />
    </Group>
  );
}
```

### Radio.Card - Standalone
```tsx
import { useState } from 'react';
import { Radio, Group, Text } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <Radio.Card
      className={classes.root}
      radius="md"
      checked={checked}
      onClick={() => setChecked((c) => !c)}
    >
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator />
        <div>
          <Text className={classes.label}>@mantine/core</Text>
          <Text className={classes.description}>
            Core components library: inputs, buttons, overlays, etc.
          </Text>
        </div>
      </Group>
    </Radio.Card>
  );
}
```

### Radio.Card with Radio.Group
```tsx
import { useState } from 'react';
import { Radio, Group, Stack, Text } from '@mantine/core';
import classes from './Demo.module.css';

const data = [
  {
    name: '@mantine/core',
    description: 'Core components library: inputs, buttons, overlays, etc.',
  },
  {
    name: '@mantine/hooks',
    description: 'Collection of reusable hooks for React applications.'
  },
  {
    name: '@mantine/notifications',
    description: 'Notifications system'
  },
];

function Demo() {
  const [value, setValue] = useState<string | null>(null);

  const cards = data.map((item) => (
    <Radio.Card className={classes.root} radius="md" value={item.name} key={item.name}>
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator />
        <div>
          <Text className={classes.label}>{item.name}</Text>
          <Text className={classes.description}>{item.description}</Text>
        </div>
      </Group>
    </Radio.Card>
  ));

  return (
    <>
      <Radio.Group
        value={value}
        onChange={setValue}
        label="Pick one package to install"
        description="Choose a package that you will need in your application"
      >
        <Stack pt="md" gap="xs">
          {cards}
        </Stack>
      </Radio.Group>

      <Text fz="xs" mt="md">
        CurrentValue: {value || '–'}
      </Text>
    </>
  );
}
```

### Get Element Ref
```tsx
import { useRef } from 'react';
import { Radio } from '@mantine/core';

function Demo() {
  const ref = useRef<HTMLInputElement>(null);
  return <Radio ref={ref} />;
}
```

### Accessibility Examples
```tsx
import { Radio } from '@mantine/core';

// Not accessible - missing label or aria-label
function Bad() {
  return <Radio />;
}

// Accessible with aria-label
function GoodAriaLabel() {
  return <Radio aria-label="My radio" />;
}

// Accessible with label prop
function GoodLabel() {
  return <Radio label="My radio" />;
}
```

## Notable Features

### Compound Component Architecture
- Three specialized components: `Radio`, `Radio.Group`, `Radio.Card`, `Radio.Indicator`
- Each component designed for specific use cases
- Seamless integration between components
- Clean separation of concerns (interaction vs visual display)

### Radio.Card Component
- Fully accessible with `role="radio"` by default
- Native keyboard interactions matching standard radio inputs
- Enables rich custom layouts while maintaining accessibility
- Works within `Radio.Group` like standard Radio components
- Perfect for card-based selection interfaces

### Radio.Indicator Visual Component
- Non-semantic, visual-only display component
- Cannot be focused or keyboard-selected
- Useful for displaying radio state in custom layouts, cards, or trees
- Explicitly designed for decoration, not interaction
- Prevents accessibility issues from non-interactive visual elements

### Dual Variant System
- Filled variant (default) - solid fill when checked
- Outline variant - outlined style when checked
- Both variants support all state combinations
- Consistent behavior across variants

### Advanced Icon Customization
- Custom icon component support via `icon` prop
- Independent icon color control via `iconColor` prop
- Works with any icon library
- Maintains proper sizing and alignment automatically

### Flexible Tooltip Integration
- Standard tooltip on radio input only
- `refProp="rootRef"` for tooltip on entire element
- Solves common tooltip + radio UX challenges
- Works with disabled states

### Comprehensive State Management
- Both controlled and uncontrolled patterns
- Group-level state management via `Radio.Group`
- Individual radio state control when needed
- Clean onChange API with direct access to checked state

### Rich Group Features
- Group label with optional asterisk (`withAsterisk`)
- Group-level description text
- Automatic state coordination across radios
- Supports any layout via composition (Group, Stack, Grid)

### Form Integration
- Standard `name` and `value` attributes
- Natural form submission support
- Works with form validation libraries
- Compatible with form context providers

### Size System
- Five size options: xs, sm, md, lg, xl
- Applies to both individual radios and groups
- Consistent sizing across all components
- Scales icon, label, and description proportionally

### Theme Integration
- Deep integration with Mantine's theming system
- Color prop accepts full theme color palette
- Custom icon colors from theme
- Cursor type configuration at theme level

### Styles API System
- Granular control over internal elements
- Targets: root, radio, icon, label, description, error
- Supports both className and inline styles
- Enables deep customization without losing component behavior

### Full TypeScript Support
- Complete type definitions for all props
- Ref typing for HTMLInputElement
- Type-safe onChange handlers
- IntelliSense-friendly API

### Layout Flexibility
- Compose with Group for horizontal layout
- Compose with Stack for vertical layout
- Custom spacing control via layout components
- Supports complex grid-based layouts

## Research Notes

- Documentation is exceptionally comprehensive with practical examples for every feature
- The compound component pattern (Radio + Radio.Group + Radio.Card + Radio.Indicator) is well-architected
- Radio.Indicator as an explicitly non-semantic component is a thoughtful design choice
- Radio.Card provides excellent balance between customization and accessibility
- The separation between interactive (Radio, Radio.Card) and visual (Radio.Indicator) components prevents common accessibility mistakes
- Icon customization with separate color control is more flexible than typical implementations
- Tooltip integration with `refProp` option elegantly handles different UX requirements
- The component follows standard form control patterns for easy integration
- Both controlled and uncontrolled patterns are well-documented
- Group component provides clean API for managing radio collections
- Layout flexibility through composition is preferable to hardcoded orientation props
- Outline variant provides alternative visual style while maintaining functionality
- The documentation clearly distinguishes between individual radio and group patterns
- Accessibility guidance is prominent and comprehensive
- Package: @mantine/core (part of the Mantine UI library ecosystem)
- Active, mature development with stable v7.x release
- All code examples compile with TypeScript and are production-ready
- The API follows Mantine's consistent naming conventions across the library
