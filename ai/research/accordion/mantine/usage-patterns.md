# Mantine - Accordion Component

## Component Overview

The Mantine Accordion is a collapsible content component designed to manage large volumes of information by organizing content into expandable sections. It divides content into labeled panels with headers that toggle the visibility of their content. Users can expand and collapse panels to reveal or hide information, making it ideal for FAQs, lengthy documentation, complex forms, and information hierarchies.

**Common Use Cases:**
- FAQ sections with expandable answers
- Step-by-step forms organized into logical sections
- Detailed specification or reference material
- Nested navigation structures
- Settings or configuration panels organized by category
- Disclosure patterns where space is limited

---

## Usage Patterns

### Basic Usage

The simplest accordion implementation consists of three main components:

1. **`Accordion`** - Root container that manages the entire accordion state
2. **`Accordion.Item`** - Individual collapsible section (contains control and panel)
3. **`Accordion.Control`** - Clickable header element that toggles expansion
4. **`Accordion.Panel`** - Expandable content area hidden by default

```jsx
import { Accordion } from '@mantine/core';

export function BasicAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Control>First Item</Accordion.Control>
        <Accordion.Panel>First item content goes here</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.Control>Second Item</Accordion.Control>
        <Accordion.Panel>Second item content goes here</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="item-3">
        <Accordion.Control>Third Item</Accordion.Control>
        <Accordion.Panel>Third item content goes here</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

---

### Variants/Styles

Mantine Accordion supports five distinct visual variants that change the appearance and styling of the component:

#### 1. **Default Variant** (default)
Standard accordion styling with subtle separation between items. Suitable for most use cases.

```jsx
<Accordion variant="default">
  <Accordion.Item value="item-1">
    <Accordion.Control>Item Title</Accordion.Control>
    <Accordion.Panel>Item content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### 2. **Contained Variant**
Items are contained within visible boxes with borders. Provides clear visual boundaries around each section.

```jsx
<Accordion variant="contained">
  <Accordion.Item value="item-1">
    <Accordion.Control>Item Title</Accordion.Control>
    <Accordion.Panel>Item content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### 3. **Filled Variant**
Items have a filled background color for each header. Creates a more visually prominent appearance.

```jsx
<Accordion variant="filled">
  <Accordion.Item value="item-1">
    <Accordion.Control>Item Title</Accordion.Control>
    <Accordion.Panel>Item content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### 4. **Separated Variant**
Items are completely separated with individual styling. Each item appears as a standalone unit with clear visual separation.

```jsx
<Accordion variant="separated">
  <Accordion.Item value="item-1">
    <Accordion.Control>Item Title</Accordion.Control>
    <Accordion.Panel>Item content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### 5. **Unstyled Variant**
Removes all non-essential library styles, allowing for complete custom theming. Useful when creating a completely custom design system.

```jsx
<Accordion variant="unstyled">
  <Accordion.Item value="item-1">
    <Accordion.Control>Item Title</Accordion.Control>
    <Accordion.Panel>Item content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

---

### States

#### Default/Closed State
All panels are closed initially. Users must click headers to expand content.

```jsx
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Closed by default</Accordion.Control>
    <Accordion.Panel>Hidden content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Expanded/Opened State
Panels can be opened by default using the `defaultValue` prop on the Accordion component, or `value` for controlled state.

```jsx
// Uncontrolled - default open
<Accordion defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Control>Opens by default</Accordion.Control>
    <Accordion.Panel>Visible content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Controlled - manage expanded state
const [activeItem, setActiveItem] = useState('item-1');

<Accordion value={activeItem} onChange={setActiveItem}>
  <Accordion.Item value="item-1">
    <Accordion.Control>Currently open</Accordion.Control>
    <Accordion.Panel>Visible content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Disabled State
Individual items can be disabled to prevent expansion/collapse interaction.

```jsx
<Accordion>
  <Accordion.Item value="item-1" disabled>
    <Accordion.Control>Disabled Item</Accordion.Control>
    <Accordion.Panel>Cannot be opened</Accordion.Panel>
  </Accordion.Item>

  <Accordion.Item value="item-2">
    <Accordion.Control>Enabled Item</Accordion.Control>
    <Accordion.Panel>Can be opened</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

---

### Sizing Options

#### Radius Customization
Controls the border radius of accordion items. Five standard radius sizes available.

```jsx
<Accordion radius="xs">  {/* Extra small radius */}
  <Accordion.Item value="item-1">
    <Accordion.Control>Item</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

<Accordion radius="sm">  {/* Small radius */}
  {/* ... */}
</Accordion>

<Accordion radius="md">  {/* Medium radius - default */}
  {/* ... */}
</Accordion>

<Accordion radius="lg">  {/* Large radius */}
  {/* ... */}
</Accordion>

<Accordion radius="xl">  {/* Extra large radius */}
  {/* ... */}
</Accordion>
```

#### Chevron Icon Sizing
The chevron (arrow) icon size is determined by the control button content and can be customized.

```jsx
<Accordion chevronSize={24}>  {/* 24px chevron */}
  <Accordion.Item value="item-1">
    <Accordion.Control>Default size chevron</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

<Accordion chevronSize={32}>  {/* 32px chevron */}
  <Accordion.Item value="item-1">
    <Accordion.Control>Larger chevron</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

---

### Layout & Positioning

#### Chevron Position
Controls whether the chevron icon appears on the left or right side of the control header.

```jsx
// Chevron on right (default)
<Accordion chevronPosition="right">
  <Accordion.Item value="item-1">
    <Accordion.Control>Right chevron ▶</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Chevron on left
<Accordion chevronPosition="left">
  <Accordion.Item value="item-1">
    <Accordion.Control>◀ Left chevron</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Item Order (Heading Wrapping)
The `order` prop wraps the control's label text with semantic heading tags (h2-h6), improving document outline and accessibility.

```jsx
// No heading tags
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Not wrapped in heading</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Wrapped in h2 tags
<Accordion order={2}>
  <Accordion.Item value="item-1">
    <Accordion.Control>Wrapped in h2</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Wrapped in h3 tags
<Accordion order={3}>
  <Accordion.Item value="item-1">
    <Accordion.Control>Wrapped in h3</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Multiple Simultaneous Expansions
By default, only one item can be open at a time. Enable `multiple` to allow multiple items to be open simultaneously.

```jsx
// Single expansion (default)
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Can't open with item-2</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Control>Can't open with item-1</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Multiple expansion
<Accordion multiple>
  <Accordion.Item value="item-1">
    <Accordion.Control>Can open with item-2</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Control>Can open with item-1</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

---

### Content & Structure

#### Panel Structure
Each accordion item contains a control (header) and a panel (content area). The panel is hidden until the control is clicked.

```jsx
<Accordion.Item value="item-1">
  {/* Control: The clickable header */}
  <Accordion.Control>
    Section Title
  </Accordion.Control>

  {/* Panel: The hidden/shown content */}
  <Accordion.Panel>
    <p>This is the expandable content area.</p>
    <p>It can contain any React components or HTML elements.</p>
  </Accordion.Panel>
</Accordion.Item>
```

#### Rich Content in Controls
Controls can contain more than just text. Add icons, badges, or other elements.

```jsx
import { Accordion, Badge, ThemeIcon, Group, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function RichAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Control>
          <Group wrap="nowrap" grow>
            <ThemeIcon variant="light">
              <IconAlertCircle size={16} />
            </ThemeIcon>
            <Text>Error Report</Text>
            <Badge color="red" size="lg">
              Critical
            </Badge>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          Error details and resolution steps...
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

#### Rich Content in Panels
Panels can contain complex layouts, nested components, forms, tables, or any React content.

```jsx
export function ComplexAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="form">
        <Accordion.Control>Account Settings</Accordion.Control>
        <Accordion.Panel>
          <form>
            <TextInput label="Email" placeholder="your@email.com" />
            <PasswordInput label="Password" />
            <Button>Save Changes</Button>
          </form>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="table">
        <Accordion.Control>Activity Log</Accordion.Control>
        <Accordion.Panel>
          <table>
            {/* Complex table structure */}
          </table>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

---

### Interactive Features

#### Expandable Behavior
Items expand when the control is clicked, revealing the panel content. Clicking again collapses the item.

```jsx
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Click to expand/collapse</Accordion.Control>
    <Accordion.Panel>Content appears and disappears</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Single vs Multiple Expansion
Control whether only one item or multiple items can be open simultaneously.

```jsx
// Single: Default behavior
<Accordion>
  {/* Only one item open at a time */}
</Accordion>

// Multiple: Allow concurrent expansions
<Accordion multiple>
  {/* Multiple items can be open simultaneously */}
</Accordion>
```

#### Collapsible Behavior
When `multiple` is enabled, items can be toggled open and closed individually. When not enabled, opening one item automatically closes others.

```jsx
// With multiple=true, user can collapse items
<Accordion multiple>
  <Accordion.Item value="item-1">
    <Accordion.Control>Can be closed independently</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// With multiple=false (default), only one can be open
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Opening this closes others</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Controlled Expansion
Manage which item is open using React state for programmatic control.

```jsx
import { useState } from 'react';
import { Accordion, Button, Group } from '@mantine/core';

export function ControlledAccordion() {
  const [active, setActive] = useState('item-1');

  return (
    <>
      <Group mb="md">
        <Button onClick={() => setActive('item-1')}>Open Item 1</Button>
        <Button onClick={() => setActive('item-2')}>Open Item 2</Button>
        <Button onClick={() => setActive(null)}>Close All</Button>
      </Group>

      <Accordion value={active} onChange={setActive}>
        <Accordion.Item value="item-1">
          <Accordion.Control>Item 1</Accordion.Control>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Control>Item 2</Accordion.Control>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
```

---

### Animation & Transitions

#### Transition Duration
Controls the expand/collapse animation speed in milliseconds. Set to `0` to disable animations.

```jsx
// Default animation (200ms)
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Default speed</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// Custom duration (500ms)
<Accordion transitionDuration={500}>
  <Accordion.Item value="item-1">
    <Accordion.Control>Slower animation</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>

// No animation
<Accordion transitionDuration={0}>
  <Accordion.Item value="item-1">
    <Accordion.Control>No animation</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Visual Transition Feedback
The accordion automatically animates the height of the panel as it expands/collapses. The chevron icon also rotates to indicate state.

---

### Integration Patterns

#### With Forms
Accordions work well with form fields, allowing users to organize inputs by category or section.

```jsx
import { Accordion, TextInput, Select, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

export function FormAccordion() {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Accordion>
        <Accordion.Item value="personal">
          <Accordion.Control>Personal Information</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <TextInput
                label="First Name"
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                {...form.getInputProps('lastName')}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="contact">
          <Accordion.Control>Contact Information</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <TextInput
                label="Email"
                type="email"
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Phone"
                {...form.getInputProps('phone')}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Button type="submit" mt="md">
        Submit
      </Button>
    </form>
  );
}
```

#### With Modals or Drawers
Accordions can be placed inside modals or drawers for modal-specific organization.

```jsx
import { Accordion, Modal, Button, useState } from '@mantine/core';

export function ModalWithAccordion() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button onClick={() => setOpened(true)}>Open Modal</Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Options">
        <Accordion>
          <Accordion.Item value="display">
            <Accordion.Control>Display Settings</Accordion.Control>
            <Accordion.Panel>Display configuration...</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="privacy">
            <Accordion.Control>Privacy Settings</Accordion.Control>
            <Accordion.Panel>Privacy configuration...</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Modal>
    </>
  );
}
```

#### With Navigation
Accordions function as collapsible navigation menus in sidebars or mobile layouts.

```jsx
import { Accordion, NavLink, Group, Text } from '@mantine/core';
import { IconHome, IconSettings, IconUser } from '@tabler/icons-react';

export function AccordionNav() {
  return (
    <Accordion>
      <Accordion.Item value="main">
        <Accordion.Control leftSection={<IconHome size={16} />}>
          Main Navigation
        </Accordion.Control>
        <Accordion.Panel>
          <NavLink label="Dashboard" />
          <NavLink label="Analytics" />
          <NavLink label="Reports" />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="account">
        <Accordion.Control leftSection={<IconUser size={16} />}>
          Account
        </Accordion.Control>
        <Accordion.Panel>
          <NavLink label="Profile" />
          <NavLink label="Preferences" />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="system">
        <Accordion.Control leftSection={<IconSettings size={16} />}>
          System
        </Accordion.Control>
        <Accordion.Panel>
          <NavLink label="Settings" />
          <NavLink label="Administration" />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

---

### Accessibility Features

#### ARIA Labels
Mantine Accordion automatically implements WAI-ARIA accordion patterns with proper semantic roles.

```jsx
<Accordion>
  <Accordion.Item value="item-1">
    {/* Automatically includes:
        - role="button" on control
        - aria-expanded="true|false" based on state
        - aria-controls pointing to panel ID
        - role="region" on panel
    */}
    <Accordion.Control>Item Title</Accordion.Control>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Keyboard Navigation
Full keyboard support for all interactions:

- **Tab** - Navigate to accordion items
- **Space/Enter** - Toggle item expansion
- **Arrow Down/Up** - Navigate between items (when `multiple` is enabled)
- **Home** - Jump to first item
- **End** - Jump to last item

```jsx
// Keyboard support is automatic - no additional configuration needed
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Control>Use keyboard to navigate</Accordion.Control>
    <Accordion.Panel>Tab to focus, Space/Enter to toggle</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

#### Screen Reader Support
All accordion text and state changes are properly announced to screen readers. The controls are marked as buttons, and the expanded/collapsed state is announced.

#### Focus Management
The control receives focus when tabbing through the page. The focus is clearly visible with a focus ring around the control.

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'contained' \| 'filled' \| 'separated' \| 'unstyled'` | `'default'` | Visual style variant of the accordion |
| `multiple` | `boolean` | `false` | Allow multiple items to be open simultaneously |
| `value` | `string \| null` | - | Controlled value: which item is open (single) |
| `defaultValue` | `string \| null` | - | Uncontrolled: which item is open by default |
| `onChange` | `(value: string \| null) => void` | - | Callback fired when active item changes |
| `radius` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | Border radius of accordion items |
| `chevronPosition` | `'left' \| 'right'` | `'right'` | Position of the chevron icon |
| `chevronSize` | `number` | - | Size of the chevron icon in pixels |
| `transitionDuration` | `number` | `200` | Animation duration in milliseconds (0 to disable) |
| `order` | `2 \| 3 \| 4 \| 5 \| 6` | - | Wrap control label in heading tags (h2-h6) for semantics |
| `icon` | `ReactNode` | - | Custom icon to replace default chevron |
| `disableChevronRotation` | `boolean` | `false` | Prevent chevron from rotating when expanded |
| `chevron` | `ReactNode` | - | Custom chevron element |
| `className` | `string` | - | CSS class for styling |
| `styles` | `object` | - | Mantine styles object for theme customization |
| `classNames` | `object` | - | CSS classes for sub-elements: `root`, `item`, `control`, `chevron`, `label`, `icon`, `itemTitle`, `panel`, `content` |

---

## Code Examples

### Example 1: FAQ Accordion
A common use case for FAQs with multiple expandable questions and answers.

```jsx
import { Accordion, Container, Title } from '@mantine/core';

const faqData = [
  {
    id: 'faq-1',
    question: 'How do I create an account?',
    answer: 'Click the Sign Up button at the top of the page and follow the registration process.',
  },
  {
    id: 'faq-2',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page and follow the email verification steps.',
  },
  {
    id: 'faq-3',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, PayPal, and bank transfers.',
  },
  {
    id: 'faq-4',
    question: 'How do I contact support?',
    answer: 'Visit our support page or email support@example.com for assistance.',
  },
];

export function FAQAccordion() {
  return (
    <Container py="xl">
      <Title order={2} mb="lg">
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        {faqData.map((item) => (
          <Accordion.Item key={item.id} value={item.id}>
            <Accordion.Control>{item.question}</Accordion.Control>
            <Accordion.Panel>{item.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
```

### Example 2: Multi-Step Form with Accordion
A form broken into logical sections using accordion for better organization.

```jsx
import { Accordion, Button, TextInput, Select, Stack, Group } from '@mantine/core';
import { useState } from 'react';

export function MultiStepFormAccordion() {
  const [activeStep, setActiveStep] = useState('step-1');

  const handleNext = () => {
    if (activeStep === 'step-1') setActiveStep('step-2');
    if (activeStep === 'step-2') setActiveStep('step-3');
  };

  const handleSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <Accordion value={activeStep} onChange={setActiveStep}>
      <Accordion.Item value="step-1">
        <Accordion.Control>Step 1: Personal Information</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <TextInput label="First Name" placeholder="John" />
            <TextInput label="Last Name" placeholder="Doe" />
            <Group justify="flex-end">
              <Button onClick={handleNext}>Next</Button>
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="step-2">
        <Accordion.Control>Step 2: Address</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <TextInput label="Street Address" />
            <TextInput label="City" />
            <TextInput label="ZIP Code" />
            <Group justify="space-between">
              <Button variant="default" onClick={() => setActiveStep('step-1')}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="step-3">
        <Accordion.Control>Step 3: Confirmation</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <p>Please review your information and submit.</p>
            <Group justify="space-between">
              <Button variant="default" onClick={() => setActiveStep('step-2')}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Example 3: Settings Panel with Multiple Open Items
A settings interface allowing multiple sections to be open simultaneously for comparison.

```jsx
import { Accordion, Switch, Group, Text, Stack } from '@mantine/core';

export function SettingsPanel() {
  return (
    <Accordion multiple variant="contained">
      <Accordion.Item value="notifications">
        <Accordion.Control>Notification Settings</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Group justify="space-between">
              <Text>Email Notifications</Text>
              <Switch defaultChecked />
            </Group>
            <Group justify="space-between">
              <Text>Push Notifications</Text>
              <Switch />
            </Group>
            <Group justify="space-between">
              <Text>SMS Notifications</Text>
              <Switch />
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="privacy">
        <Accordion.Control>Privacy Settings</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Group justify="space-between">
              <Text>Profile Visibility</Text>
              <Switch defaultChecked />
            </Group>
            <Group justify="space-between">
              <Text>Show Online Status</Text>
              <Switch />
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="appearance">
        <Accordion.Control>Appearance Settings</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Group justify="space-between">
              <Text>Dark Mode</Text>
              <Switch />
            </Group>
            <Group justify="space-between">
              <Text>Compact View</Text>
              <Switch />
            </Group>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Example 4: Nested Accordions
Accordion items containing other accordions for hierarchical information structures.

```jsx
import { Accordion } from '@mantine/core';

export function NestedAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="frontend">
        <Accordion.Control>Frontend</Accordion.Control>
        <Accordion.Panel>
          <Accordion>
            <Accordion.Item value="react">
              <Accordion.Control>React</Accordion.Control>
              <Accordion.Panel>Hooks, Components, Context API</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="vue">
              <Accordion.Control>Vue</Accordion.Control>
              <Accordion.Panel>Composition API, Templates, Reactivity</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="backend">
        <Accordion.Control>Backend</Accordion.Control>
        <Accordion.Panel>
          <Accordion>
            <Accordion.Item value="node">
              <Accordion.Control>Node.js</Accordion.Control>
              <Accordion.Panel>Express, NestJS, Fastify</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="python">
              <Accordion.Control>Python</Accordion.Control>
              <Accordion.Panel>Django, Flask, FastAPI</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

---

## Accessibility Notes

### Built-in ARIA Support
Mantine Accordion automatically implements the WAI-ARIA Accordion pattern:
- **role="button"** on controls for keyboard activation
- **aria-expanded="true|false"** to indicate open/closed state
- **aria-controls** to link control with its panel
- **role="region"** on panels to identify collapsible sections

### Keyboard Accessibility
- All controls are keyboard accessible via Tab key
- Space and Enter keys toggle expansion
- Arrow keys navigate between items (when not in single-expansion mode)
- Home/End keys jump to first/last item

### Focus Management
- Visual focus indicators are clearly visible
- Focus order follows DOM structure
- Disabled items are properly marked and inaccessible

### Screen Reader Support
- All text is properly announced
- State changes (expanded/collapsed) are announced
- Required attribute announcements included
- Disabled state is properly communicated

### Best Practices
1. **Use semantic heading order**: When using the `order` prop, ensure heading hierarchy follows document structure
2. **Meaningful labels**: Accordion control text should clearly describe what content will be revealed
3. **Disable with purpose**: Only disable items when there's a functional reason
4. **Test with keyboard**: Verify navigation works without mouse
5. **Test with screen readers**: Ensure announcements are clear and helpful

---

## Common Patterns

### Pattern 1: Help Documentation
Organizing help topics into collapsible sections for easy navigation.

```jsx
const helpTopics = [
  { id: 'getting-started', title: 'Getting Started', content: '...' },
  { id: 'tutorials', title: 'Tutorials', content: '...' },
  { id: 'troubleshooting', title: 'Troubleshooting', content: '...' },
];

<Accordion variant="filled">
  {helpTopics.map(topic => (
    <Accordion.Item key={topic.id} value={topic.id}>
      <Accordion.Control>{topic.title}</Accordion.Control>
      <Accordion.Panel>{topic.content}</Accordion.Panel>
    </Accordion.Item>
  ))}
</Accordion>
```

### Pattern 2: Configuration Wizard
Step-by-step configuration with validation between steps.

```jsx
const [current, setCurrent] = useState('step1');

<Accordion value={current} onChange={setCurrent}>
  {steps.map(step => (
    <Accordion.Item key={step.id} value={step.id}>
      <Accordion.Control>
        {step.number}. {step.title}
      </Accordion.Control>
      <Accordion.Panel>{step.content}</Accordion.Panel>
    </Accordion.Item>
  ))}
</Accordion>
```

### Pattern 3: Feature Comparison
Comparing features across products or plans.

```jsx
<Accordion multiple variant="contained">
  {plans.map(plan => (
    <Accordion.Item key={plan.id} value={plan.id}>
      <Accordion.Control>{plan.name}</Accordion.Control>
      <Accordion.Panel>
        <FeatureList features={plan.features} />
      </Accordion.Panel>
    </Accordion.Item>
  ))}
</Accordion>
```

### Pattern 4: Metadata or Specification Details
Organizing detailed technical information.

```jsx
<Accordion variant="unstyled">
  <Accordion.Item value="specs">
    <Accordion.Control>Technical Specifications</Accordion.Control>
    <Accordion.Panel>
      <SpecTable />
    </Accordion.Panel>
  </Accordion.Item>

  <Accordion.Item value="api">
    <Accordion.Control>API Reference</Accordion.Control>
    <Accordion.Panel>
      <APIDocumentation />
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

---

## Related Components

- **Tabs** - Alternative for navigating between content sections (better for 2-5 sections)
- **Collapse** - Simpler single-item collapsible component
- **Modal** - For focused, isolated information
- **Drawer** - Side-sliding panel for navigation or details
- **Menu** - Dropdown alternative for navigation
- **Stack** - Basic vertical layout for static information
- **Group** - Horizontal layout combining with accordion items

---

---
Research completed: November 5, 2025
Component: Accordion
Framework: Mantine
Documentation: https://mantine.dev/core/accordion/
