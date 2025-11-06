# Mantine - Chip Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/chip/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear examples demonstrating single/multiple selection, controlled/uncontrolled states, icon customization, and practical use cases with tooltips.

## Component Definition
- **Core purpose**: Enables users to select one or multiple values through inline controls, combining visual feedback with selection capability
- **Mental model**: An interactive selection control that functions as a specialized input (radio or checkbox) with prominent visual state feedback
- **Semantic meaning**: Communicates a selectable option within a choice set, showing clear checked/unchecked states for user input

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="blue"`, `checked={true}`)
- **Composed**: Via composition/children (e.g., `<Chip>Label</Chip>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop accepts text labels directly |
| Icons | ✅ | Native | `icon` prop replaces default checkmark with custom icon when checked |
| Avatars/Images | ❌ | N/A | Not supported in Chip component |
| Close/Remove button | ❌ | N/A | Not applicable - uses checked/unchecked state instead |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ✅ | Native | `checked` prop (controlled), `defaultChecked` (uncontrolled), `onChange` handler |
| Disabled | ⚠️ | Not documented | Standard disabled attribute may be supported via native input |
| Loading | ❌ | N/A | Not documented |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop accepts theme colors |
| Size options | ✅ | Native | `xs`, `sm`, `md`, `lg`, `xl` sizes |
| Visual variants | ✅ | Native | `filled`, `outline`, `light` variants |
| Bordered/Borderless | ✅ | Native | Controlled via `variant` prop (outline has border, filled/light don't) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Native | Built on native radio/checkbox input with full keyboard support |
| Closable/Removable | ❌ | N/A | Not applicable - uses selection state paradigm |
| onClick handler | ✅ | Native | Custom click handlers supported for advanced behavior (e.g., deselectable radio) |
| onChange handler | ✅ | Native | `onChange` prop for controlled components |

## Selection Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single selection | ✅ | Native | `Chip.Group` component with `multiple={false}` (default) |
| Multiple selection | ✅ | Native | `Chip.Group` component with `multiple={true}` |
| Deselectable | ✅ | Native | Custom onClick handlers enable deselectable radio behavior |
| Controlled state | ✅ | Native | `value` and `onChange` props on `Chip.Group` |
| Uncontrolled state | ✅ | Native | `defaultValue` prop on `Chip.Group`, `defaultChecked` on individual chips |

## Code Examples

### Basic Usage (Uncontrolled)
```jsx
import { Chip } from '@mantine/core';

function Demo() {
  return <Chip defaultChecked>Awesome chip</Chip>
}
```

### Controlled Single Chip
```jsx
import { useState } from 'react';
import { Chip } from '@mantine/core';

function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <Chip checked={checked} onChange={() => setChecked((v) => !v)}>
      My chip
    </Chip>
  );
}
```

### Custom Icon
```jsx
import { Chip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

function Demo() {
  return (
    <Chip
      icon={<IconX size={16} />}
      color="red"
      variant="filled"
      defaultChecked
    >
      Forbidden
    </Chip>
  );
}
```

### Chip with Tooltip
```jsx
import { Tooltip, Chip } from '@mantine/core';

function Demo() {
  return (
    <Tooltip label="Chip tooltip" refProp="rootRef">
      <Chip defaultChecked>Chip with tooltip</Chip>
    </Tooltip>
  );
}
```

### Single Selection Group
```jsx
import { Chip, Group } from '@mantine/core';

function Demo() {
  return (
    <Chip.Group>
      <Group justify="center">
        <Chip value="1">Single chip</Chip>
        <Chip value="2">Can be selected</Chip>
        <Chip value="3">At a time</Chip>
      </Group>
    </Chip.Group>
  );
}
```

### Multiple Selection Group
```jsx
import { Chip, Group } from '@mantine/core';

function Demo() {
  return (
    <Chip.Group multiple>
      <Group justify="center" mt="md">
        <Chip value="1">Multiple chips</Chip>
        <Chip value="2">Can be selected</Chip>
        <Chip value="3">At a time</Chip>
      </Group>
    </Chip.Group>
  );
}
```

### Controlled Single Selection
```jsx
import { useState } from 'react';
import { Chip } from '@mantine/core';

function Single() {
  const [value, setValue] = useState('react');

  return (
    <Chip.Group multiple={false} value={value} onChange={setValue}>
      <Chip value="react">React</Chip>
      <Chip value="ng">Angular</Chip>
      <Chip value="svelte">Svelte</Chip>
      <Chip value="vue">Vue</Chip>
    </Chip.Group>
  );
}
```

### Controlled Multiple Selection
```jsx
import { useState } from 'react';
import { Chip } from '@mantine/core';

function Multiple() {
  const [value, setValue] = useState(['react']);

  return (
    <Chip.Group multiple value={value} onChange={setValue}>
      <Chip value="react">React</Chip>
      <Chip value="ng">Angular</Chip>
      <Chip value="svelte">Svelte</Chip>
      <Chip value="vue">Vue</Chip>
    </Chip.Group>
  );
}
```

### Deselectable Radio Chips
```jsx
import { useState } from 'react';
import { Chip, Group } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState<string | null>('first');
  const handleChipClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === value) {
      setValue(null);
    }
  };

  return (
    <Chip.Group multiple={false} value={value} onChange={setValue}>
      <Group>
        <Chip value="first" onClick={handleChipClick}>
          First
        </Chip>
        <Chip value="second" onClick={handleChipClick}>
          Second
        </Chip>
        <Chip value="third" onClick={handleChipClick}>
          Third
        </Chip>
      </Group>
    </Chip.Group>
  );
}
```

## Notable Features

### Built on Native Form Controls
- Uses native radio/checkbox inputs as foundation
- Full keyboard event support matching native control behavior
- Ensures accessibility and familiar interaction patterns
- Screen reader compatible out of the box

### Dual State Management
- Uncontrolled mode with `defaultChecked` for simple use cases
- Controlled mode with `checked` and `onChange` for complex state management
- Group-level control via `Chip.Group` component
- Individual chip control for standalone usage

### Selection Group System
- `Chip.Group` component manages multiple chips cohesively
- Single selection mode (radio-like behavior, default)
- Multiple selection mode via `multiple` prop (checkbox-like behavior)
- Controlled group state with `value` and `onChange` props
- Automatic coordination of checked states within group

### Flexible Selection Patterns
- Standard radio behavior (one selection at a time)
- Checkbox behavior (multiple simultaneous selections)
- Deselectable radio pattern via custom onClick handlers
- Enables advanced UX patterns beyond standard form controls

### Customizable Check Indicator
- Default checkmark icon for checked state
- `icon` prop allows custom icon replacement
- Useful for semantic meaning (e.g., X icon for forbidden options)
- Icon only displays in checked state

### Tooltip Integration
- Special `refProp="rootRef"` required for Tooltip component
- Enables hover explanations without interfering with chip functionality
- Clean API for common UI pattern

### Theme Integration
- Color prop inherits from Mantine theme system
- Consistent sizing across component library (xs-xl)
- Variant system matches Mantine design language
- Radius customization via standard size tokens

### Wrapper Props Support
- `wrapperProps` allows adding attributes to root element
- Enables additional customization without breaking component behavior
- Useful for data attributes, ARIA labels, etc.

## Research Notes

- Chip is fundamentally a **selection control** (input), not a display element
- Built on semantic HTML form controls (radio/checkbox) for accessibility
- The `Chip.Group` component provides essential coordination for multi-chip interfaces
- Deselectable radio pattern is explicitly supported through examples
- Documentation emphasizes controlled vs uncontrolled state patterns
- The component doesn't support dismissible/closable patterns (that's Badge territory)
- Icon customization is limited to checked state indicator only
- No support for left/right content sections like Badge component
- Missing explicit disabled state documentation (likely supported via native input)
- The tooltip integration requires special refProp handling
- Clear separation of concerns: Chip = selection input, Badge = display label
- Version v8.3.6 indicates mature, actively maintained component
- Full TypeScript support with proper generic types for controlled state
- Package: @mantine/core
