# Radix UI Themes - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/themes/docs/components/switch
Status: ✅ Working
Version: Current (Radix Themes)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear examples with comprehensive prop documentation and visual demonstrations of all variants.

## Component Definition
- **Core purpose**: Provides a toggle switch alternative to the checkbox for binary on/off control mechanisms
- **Mental model**: A physical toggle switch that users can flip between two states (on/off)
- **Semantic meaning**: Represents a binary choice or setting that can be enabled or disabled

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `size="1"`, `variant="surface"`)
- **Composed**: Via composition/children (e.g., wrapping with `<Text as="label">`)
- **CSS-only**: Requires custom styling (e.g., custom animations)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Composed | Labels created via composition with Text component, not built into Switch |
| Icons | ❌ | Not supported | No icon support shown in documentation |
| Loading indicator | ❌ | Not supported | No loading state in documentation |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `defaultChecked` prop for initial state |
| Disabled | ✅ | Native | `disabled` prop (native HTML attribute) |
| Loading | ❌ | Not supported | No loading state documented |
| Read-only | ❌ | Not documented | Not shown in documentation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Three sizes: "1" (small), "2" (default), "3" (large) - responsive |
| Color options | ✅ | Native | Theme colors: indigo, cyan, orange, crimson, gray, and others |
| Visual variants | ✅ | Native | Three variants: "surface" (default), "classic", "soft" |
| High contrast mode | ✅ | Native | `highContrast` boolean prop for increased color distinction in light mode |
| Border radius | ✅ | Native | "none", "small", "medium", "large", "full" |
| Label placement | ✅ | Composed | Labels placed via flex layout composition |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Standard click/tap interaction |
| Keyboard control | ✅ | Native | Inherited from HTML switch primitives |
| onChange handler | ✅ | Native | Standard React event handlers (inherited from primitive) |
| Controlled mode | ✅ | Native | Standard React controlled component pattern |
| Uncontrolled mode | ✅ | Native | `defaultChecked` for uncontrolled usage |

## Code Examples

### Basic Usage
```jsx
<Switch defaultChecked />
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#basic)

### Size Variations
```jsx
<Flex align="center" gap="2">
  <Switch size="1" defaultChecked />
  <Switch size="2" defaultChecked />
  <Switch size="3" defaultChecked />
</Flex>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#size)

### Variant Showcase
```jsx
<Flex gap="2">
  <Flex direction="column" gap="3">
    <Switch variant="surface" />
    <Switch variant="classic" />
    <Switch variant="soft" />
  </Flex>
  <Flex direction="column" gap="3">
    <Switch variant="surface" defaultChecked />
    <Switch variant="classic" defaultChecked />
    <Switch variant="soft" defaultChecked />
  </Flex>
</Flex>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#variant)

### Color Options
```jsx
<Flex gap="2">
  <Switch color="indigo" defaultChecked />
  <Switch color="cyan" defaultChecked />
  <Switch color="orange" defaultChecked />
  <Switch color="crimson" defaultChecked />
</Flex>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#color)

### High Contrast Display
```jsx
<Grid rows="2" gapX="2" gapY="3" display="inline-grid" flow="column">
  <Switch color="indigo" defaultChecked />
  <Switch color="indigo" defaultChecked highContrast />
  <Switch color="cyan" defaultChecked />
  <Switch color="cyan" defaultChecked highContrast />
  <Switch color="orange" defaultChecked />
  <Switch color="orange" defaultChecked highContrast />
  <Switch color="crimson" defaultChecked />
  <Switch color="crimson" defaultChecked highContrast />
</Grid>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#high-contrast)

### Radius Variations
```jsx
<Flex gap="3">
  <Switch radius="none" defaultChecked />
  <Switch radius="small" defaultChecked />
  <Switch radius="full" defaultChecked />
</Flex>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#radius)

### Label Integration (Composed)
```jsx
<Flex direction="column" gap="3">
  <Text as="label" size="2">
    <Flex gap="2">
      <Switch size="1" defaultChecked /> Sync settings
    </Flex>
  </Text>
  <Text as="label" size="2">
    <Flex gap="2">
      <Switch size="1" /> Notifications
    </Flex>
  </Text>
</Flex>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#with-label)

### Disabled States
```jsx
<Flex direction="column" gap="2">
  <Text as="label" size="2">
    <Flex gap="2">
      <Switch size="1" disabled />
      Off (Disabled)
    </Flex>
  </Text>
  <Text as="label" size="2">
    <Flex gap="2">
      <Switch size="1" defaultChecked disabled />
      On (Disabled)
    </Flex>
  </Text>
</Flex>
```
[View Live](https://www.radix-ui.com/themes/docs/components/switch#disabled)

## Notable Features

- **Automatic Text Alignment**: The Switch automatically centers vertically with both single-line and multi-line text when composed within Text elements, making label integration seamless
- **Responsive Sizing**: The `size` prop supports responsive values, allowing different sizes at different breakpoints
- **Theme Integration**: Deeply integrated with Radix Themes' design system, inheriting global theme settings
- **High Contrast Mode**: Dedicated `highContrast` prop increases color distinction specifically for light mode accessibility
- **Flexible Border Radius**: Granular control over corner rounding from sharp ("none") to fully rounded ("full")
- **Margin Props**: Inherits common margin props from the Radix Themes system for spacing control
- **Primitive Extension**: Built on top of Radix UI's Switch primitive, inheriting all its accessibility features

## Research Notes

- Documentation is clear and well-organized with live interactive examples
- Component follows Radix UI's composition-over-configuration philosophy - labels are not built-in but composed using layout primitives
- No loading state or icon support documented, suggesting a minimal, focused component API
- The use of responsive prop values (e.g., size) indicates mobile-first design considerations
- Three visual variants provide good coverage of common design needs without overwhelming choice
- The component appears to be a thin wrapper around the Radix UI Switch primitive with theme system integration
- Examples demonstrate accessibility best practices (using `Text as="label"` with proper nesting)
- High contrast mode suggests WCAG compliance consideration
- No custom event handlers shown in examples - appears to use standard React patterns
