# Stack (Layout) - MUI Usage Patterns

> **Framework**: MUI (Material-UI)
> **Component**: Stack
> **Documentation**: https://mui.com/material-ui/react-stack/
> **Research Date**: 2025-11-05

## Component Definition

The Stack component is a layout utility in Material UI that provides a flexible container for managing spacing and alignment of child elements using CSS Flexbox. It serves as a one-dimensional layout primitive that simplifies the creation of common layout patterns without requiring custom CSS.

**Core purpose**: Eliminate the need for repetitive layout CSS by providing a declarative API for managing direction, spacing, and alignment of child elements in a single dimension.

**Mental model**: Stack is a flex container with intelligent spacing management. It abstracts away the complexity of flexbox by focusing on the most common use cases: arranging items in a row or column with consistent spacing between them.

**Common use cases**:
- Form layouts with vertical spacing between fields
- Horizontal button groups with consistent gaps
- Navigation elements arranged in a row
- Card content with stacked elements
- Responsive layouts that switch between horizontal and vertical arrangements
- Any layout requiring consistent spacing between sibling elements

## Core Features

### Direction Control

Stack provides directional layout through the `direction` prop, which maps directly to CSS `flex-direction`:

- **row** - Horizontal layout (default), items arranged left to right
- **column** - Vertical layout, items stacked top to bottom
- **row-reverse** - Horizontal layout, items arranged right to left
- **column-reverse** - Vertical layout, items stacked bottom to top

Direction can be responsive, accepting object notation for breakpoint-specific values:
```jsx
<Stack direction={{ xs: 'column', sm: 'row' }}>
```

### Spacing Management

The `spacing` prop is Stack's primary feature, applying consistent gaps between child elements using the theme's spacing scale (default 8px base unit):

- **Number values**: Multipliers of the spacing unit (e.g., `2` = 16px with default theme)
- **Responsive arrays**: Different spacing at different breakpoints (e.g., `[2, 4, 6]`)
- **Responsive objects**: Named breakpoint values (e.g., `{ xs: 2, sm: 4 }`)
- **CSS gap property**: Modern implementation using CSS gap instead of margin hacks

### Alignment and Justification

Stack exposes standard flexbox alignment properties:

- **alignItems**: Cross-axis alignment (perpendicular to direction)
- **justifyContent**: Main-axis distribution (along direction)
- **alignContent**: Multi-line cross-axis alignment (when wrapping occurs)

These props accept standard CSS flexbox values: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `stretch`, etc.

### Responsive Design

Stack embraces mobile-first responsive design through:

- **Breakpoint objects**: Props can accept objects with breakpoint keys (`xs`, `sm`, `md`, `lg`, `xl`)
- **Responsive arrays**: Props can accept arrays that map to breakpoints in order
- **Theme integration**: Uses theme breakpoints for consistency across the application

### Divider Support

Stack can render dividers between children:

- **divider prop**: Accepts a ReactNode to render between each child
- **Automatic spacing**: Dividers are positioned correctly regardless of direction
- **Common pattern**: Use `<Divider />` component from MUI for visual separation

## Props API

### Primary Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse' \| object \| array` | `'column'` | Defines the flex-direction. Supports responsive values. |
| `spacing` | `number \| string \| object \| array` | `0` | Defines the space between immediate children. Uses theme spacing scale. |
| `divider` | `ReactNode` | - | Element to render between each child. |
| `useFlexGap` | `boolean` | `false` | If `true`, uses CSS gap instead of margin for spacing (modern browsers). |

### Alignment Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignItems` | `string \| object \| array` | `'stretch'` | Defines the align-items style property. Supports responsive values. |
| `alignContent` | `string \| object \| array` | `'stretch'` | Defines the align-content style property. Supports responsive values. |
| `justifyContent` | `string \| object \| array` | `'flex-start'` | Defines the justify-content style property. Supports responsive values. |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `flexWrap` | `string \| object \| array` | `'nowrap'` | Defines the flex-wrap style property. Supports responsive values. |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sx` | `object \| array \| function` | - | System prop for defining custom styles with theme-aware values. |
| `component` | `elementType` | `'div'` | The component used for the root node (for semantic HTML). |

### Standard Props

Stack also accepts all standard HTML div attributes and MUI system props for spacing, sizing, colors, borders, shadows, etc.

## Usage Patterns

### Pattern 1: Basic Vertical Stack

**Use case**: Default pattern for stacking elements vertically with consistent spacing.

**Implementation**: Omit direction prop (defaults to column) and set spacing value.

```jsx
<Stack spacing={2}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
</Stack>
```

### Pattern 2: Horizontal Row Layout

**Use case**: Arranging elements horizontally, such as button groups or inline navigation.

**Implementation**: Set direction to "row" with desired spacing.

```jsx
<Stack direction="row" spacing={2}>
  <Button>Cancel</Button>
  <Button variant="contained">Submit</Button>
</Stack>
```

### Pattern 3: Responsive Direction Switch

**Use case**: Vertical layout on mobile, horizontal on tablet and above (common for form actions, navigation).

**Implementation**: Use breakpoint object notation for direction prop.

```jsx
<Stack
  direction={{ xs: 'column', sm: 'row' }}
  spacing={2}
>
  <TextField label="First Name" />
  <TextField label="Last Name" />
</Stack>
```

### Pattern 4: Responsive Spacing

**Use case**: Tighter spacing on mobile, more generous spacing on larger screens.

**Implementation**: Use array or object notation for spacing prop.

```jsx
// Array syntax (maps to xs, sm, md, lg, xl)
<Stack spacing={[1, 2, 3]}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
</Stack>

// Object syntax (explicit breakpoints)
<Stack spacing={{ xs: 1, sm: 2, md: 3 }}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
</Stack>
```

### Pattern 5: Centered Content

**Use case**: Centering items both horizontally and vertically within the stack.

**Implementation**: Combine alignItems and justifyContent props.

```jsx
<Stack
  direction="row"
  spacing={2}
  alignItems="center"
  justifyContent="center"
>
  <Avatar />
  <Typography>User Name</Typography>
</Stack>
```

### Pattern 6: Space Between Layout

**Use case**: Pushing items to opposite ends of the container (e.g., header with title on left, actions on right).

**Implementation**: Use justifyContent="space-between" with row direction.

```jsx
<Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
>
  <Typography variant="h6">Page Title</Typography>
  <Button>Action</Button>
</Stack>
```

### Pattern 7: Divider Pattern

**Use case**: Visual separation between stacked items (e.g., menu items, list items).

**Implementation**: Pass Divider component to divider prop.

```jsx
<Stack divider={<Divider orientation="vertical" flexItem />} spacing={2}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
</Stack>
```

### Pattern 8: Nested Stacks

**Use case**: Complex two-dimensional layouts composed from one-dimensional stacks.

**Implementation**: Nest Stack components with different directions.

```jsx
<Stack spacing={3}>
  <Stack direction="row" spacing={2}>
    <Item>Row Item 1</Item>
    <Item>Row Item 2</Item>
  </Stack>
  <Stack direction="row" spacing={2}>
    <Item>Row Item 3</Item>
    <Item>Row Item 4</Item>
  </Stack>
</Stack>
```

### Pattern 9: Form Layout

**Use case**: Consistent vertical spacing for form fields with horizontal button group.

**Implementation**: Column stack for fields, nested row stack for buttons.

```jsx
<Stack spacing={3}>
  <TextField label="Email" />
  <TextField label="Password" type="password" />
  <TextField label="Confirm Password" type="password" />
  <Stack direction="row" spacing={2} justifyContent="flex-end">
    <Button>Cancel</Button>
    <Button variant="contained">Sign Up</Button>
  </Stack>
</Stack>
```

### Pattern 10: Full-Height Stretch

**Use case**: Items that should stretch to fill available space (e.g., card layouts).

**Implementation**: Use alignItems="stretch" (default) with defined container height.

```jsx
<Stack spacing={2} sx={{ height: '100%' }}>
  <Box sx={{ flexGrow: 0 }}>Header</Box>
  <Box sx={{ flexGrow: 1 }}>Content (stretches)</Box>
  <Box sx={{ flexGrow: 0 }}>Footer</Box>
</Stack>
```

## Variants and Composition

### No Built-in Variants

Stack does not have built-in visual variants (no "outlined", "contained", etc.). It is purely a layout primitive focused on spacing and alignment.

### Semantic HTML Composition

Stack supports the `component` prop for semantic HTML:

```jsx
<Stack component="nav" direction="row" spacing={2}>
  <Link>Home</Link>
  <Link>About</Link>
  <Link>Contact</Link>
</Stack>

<Stack component="section" spacing={3}>
  <Typography variant="h2">Section Title</Typography>
  <Typography>Section content...</Typography>
</Stack>
```

### Composition with Other MUI Components

Stack is designed to work seamlessly with all MUI components:

- **Typography**: For text elements
- **Button**: For action groups
- **TextField**: For form layouts
- **Card/Paper**: For container composition
- **Box**: For additional layout control (Box is more low-level, Stack is higher-level)
- **Divider**: For visual separation between items

## Accessibility

### Semantic HTML

Stack renders a `<div>` by default but supports the `component` prop for semantic HTML elements:

- Use `component="nav"` for navigation stacks
- Use `component="section"` for content sections
- Use `component="header"` or `component="footer"` for page regions

### Keyboard Navigation

Stack itself has no interactive behavior, so keyboard navigation depends on the child components:

- Ensure interactive children (buttons, links, inputs) are keyboard accessible
- Tab order follows the natural DOM order of children
- Use appropriate ARIA attributes on children when needed

### Screen Reader Support

Stack has no specific screen reader features, as it is purely a layout container:

- Proper semantic HTML via `component` prop aids screen reader navigation
- Children should have appropriate labels and ARIA attributes
- Logical visual order should match DOM order for screen reader users

### Focus Management

Stack does not manage focus. Ensure that:

- Interactive children handle focus appropriately
- Focus indicators are visible (not overridden by custom styles)
- Focus order is logical (matches visual order)

## Responsive Design

### Mobile-First Approach

MUI uses a mobile-first responsive strategy. Stack supports this through:

**Breakpoint Order**: `xs` (0px), `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1536px)

**Array Syntax** (mobile-first ordering):
```jsx
<Stack spacing={[1, 2, 3, 4, 5]}>
  // spacing 1 for xs, 2 for sm, 3 for md, 4 for lg, 5 for xl
</Stack>
```

**Object Syntax** (explicit breakpoints):
```jsx
<Stack spacing={{ xs: 1, sm: 2, md: 3 }}>
  // Inherits up: lg and xl use md value (3)
</Stack>
```

### Responsive Props

Nearly all Stack props support responsive values:

- `direction` - Switch between column and row at breakpoints
- `spacing` - Adjust spacing based on screen size
- `alignItems`, `justifyContent` - Change alignment at different sizes
- `flexWrap` - Control wrapping behavior responsively

### Common Responsive Patterns

**Mobile stack to desktop row**:
```jsx
<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
```

**Increasing spacing with screen size**:
```jsx
<Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
```

**Center on mobile, left-align on desktop**:
```jsx
<Stack alignItems={{ xs: 'center', md: 'flex-start' }}>
```

## Theme Integration

### Spacing Scale

Stack uses the theme's spacing scale, which defaults to an 8px base unit:

```jsx
// With default theme
<Stack spacing={2}>  // 16px gap (2 * 8px)
<Stack spacing={3}>  // 24px gap (3 * 8px)
```

Custom spacing scale can be defined in theme:
```jsx
const theme = createTheme({
  spacing: 4,  // 4px base unit
  // OR function
  spacing: (factor) => `${factor * 0.25}rem`,
});
```

### Theme Breakpoints

Stack respects theme breakpoint configuration:

```jsx
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
```

### Custom Styling via sx Prop

The `sx` prop provides theme-aware styling:

```jsx
<Stack
  spacing={2}
  sx={{
    bgcolor: 'background.paper',
    p: 3,
    borderRadius: 1,
    boxShadow: 2,
  }}
>
```

### Theme Overrides

Stack can be customized globally through theme:

```jsx
const theme = createTheme({
  components: {
    MuiStack: {
      defaultProps: {
        spacing: 2,  // Default spacing for all stacks
        direction: 'row',  // Default direction
      },
      styleOverrides: {
        root: {
          // Custom CSS for all Stack components
        },
      },
    },
  },
});
```

## Related Components

### Box

- **Relationship**: Box is the lower-level layout primitive; Stack is built on Box
- **When to use Box**: Need more fine-grained control over CSS properties, don't need automatic spacing
- **When to use Stack**: Need consistent spacing between children in one dimension

### Grid

- **Relationship**: Grid provides two-dimensional layout; Stack is one-dimensional
- **When to use Grid**: Complex multi-column, multi-row layouts with item spanning
- **When to use Stack**: Simple one-dimensional arrangements (rows or columns)

### Container

- **Relationship**: Container provides max-width constraints and horizontal centering; Stack manages child spacing
- **When to use Container**: Page-level layout with responsive max-widths
- **When to use Stack**: Child element spacing and alignment

### Divider

- **Relationship**: Often used together via Stack's `divider` prop
- **When to use with Stack**: Need visual separation between stacked items

### Box Spacing Props

- **Relationship**: Box accepts spacing props (m, p, etc.); Stack provides consistent gaps
- **When to use Box spacing**: Individual element margins/padding
- **When to use Stack spacing**: Consistent gaps between multiple siblings

## Framework-Specific Features

### Integration with MUI Theming System

Stack is deeply integrated with MUI's theming system:

- **Spacing function**: Uses theme.spacing() automatically
- **Breakpoints**: Uses theme.breakpoints for responsive values
- **Custom properties**: Generates CSS custom properties for theme tokens

### sx Prop System

Stack supports MUI's powerful `sx` prop for inline styling:

- Theme-aware property values (spacing, colors, etc.)
- Responsive object notation
- Shorthand properties (p, m, px, py, etc.)
- Pseudo-selectors and nested selectors

```jsx
<Stack
  spacing={2}
  sx={{
    px: { xs: 2, md: 4 },
    '& > *': {
      transition: 'all 0.3s',
    },
  }}
>
```

### TypeScript Support

Stack has comprehensive TypeScript definitions:

- Prop types are fully typed
- Generic component prop for type-safe component switching
- Responsive value types inferred correctly

### useFlexGap Flag

MUI provides a `useFlexGap` prop for modern browsers:

- **Default behavior**: Uses margin-based spacing (better browser support)
- **useFlexGap: true**: Uses CSS gap property (cleaner, modern approach)
- **Trade-off**: Gap property has better layout characteristics but slightly less browser support

## Code Examples

### Example 1: Basic Vertical Stack
```jsx
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicStack() {
  return (
    <Stack spacing={2}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Stack>
  );
}
```

### Example 2: Horizontal Button Group
```jsx
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function HorizontalStack() {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined">Cancel</Button>
      <Button variant="contained">Submit</Button>
    </Stack>
  );
}
```

### Example 3: Responsive Direction
```jsx
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function ResponsiveStack() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
    >
      <TextField label="First Name" fullWidth />
      <TextField label="Last Name" fullWidth />
    </Stack>
  );
}
```

### Example 4: With Dividers
```jsx
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

export default function StackWithDivider() {
  return (
    <Stack
      divider={<Divider orientation="horizontal" flexItem />}
      spacing={2}
    >
      <Typography>Item 1</Typography>
      <Typography>Item 2</Typography>
      <Typography>Item 3</Typography>
    </Stack>
  );
}
```

### Example 5: Centered Content
```jsx
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function CenteredStack() {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ height: 200 }}
    >
      <Avatar>JD</Avatar>
      <Typography variant="h6">John Doe</Typography>
    </Stack>
  );
}
```

### Example 6: Nested Stacks for Complex Layout
```jsx
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

export default function NestedStacks() {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Paper sx={{ p: 2, flexGrow: 1 }}>Item 1</Paper>
        <Paper sx={{ p: 2, flexGrow: 1 }}>Item 2</Paper>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Paper sx={{ p: 2, flexGrow: 1 }}>Item 3</Paper>
        <Paper sx={{ p: 2, flexGrow: 1 }}>Item 4</Paper>
      </Stack>
    </Stack>
  );
}
```

### Example 7: Form Layout
```jsx
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function FormStack() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 400 }}>
      <TextField label="Email" type="email" />
      <TextField label="Password" type="password" />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button>Cancel</Button>
        <Button variant="contained">Login</Button>
      </Stack>
    </Stack>
  );
}
```

### Example 8: Responsive Spacing
```jsx
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function ResponsiveSpacing() {
  return (
    <Stack spacing={{ xs: 1, sm: 2, md: 3 }}>
      <Box sx={{ bgcolor: 'primary.main', height: 50 }} />
      <Box sx={{ bgcolor: 'secondary.main', height: 50 }} />
      <Box sx={{ bgcolor: 'error.main', height: 50 }} />
    </Stack>
  );
}
```

### Example 9: Space Between Layout
```jsx
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function SpaceBetweenStack() {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ p: 2 }}
    >
      <Typography variant="h6">Dialog Title</Typography>
      <IconButton>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
```

### Example 10: Full-Height Layout
```jsx
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function FullHeightStack() {
  return (
    <Stack sx={{ height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>Header</Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        Main Content
      </Box>
      <Box sx={{ p: 2, bgcolor: 'grey.200' }}>
        Footer
      </Box>
    </Stack>
  );
}
```

## Notes and Observations

### Modern CSS Implementation

Stack uses CSS flexbox and the gap property (with fallback) rather than margin-based spacing hacks, resulting in cleaner and more predictable layouts.

### Theme Spacing Scale Importance

Understanding the theme's spacing scale is crucial for consistent spacing throughout an application. The default 8px base unit (theme.spacing(1) = 8px) follows common design system practices.

### Performance Characteristics

Stack is a lightweight component with minimal overhead. It generates optimized CSS using the MUI styling system, with styles shared across instances.

### Migration from Box

Stack was introduced as a more specialized alternative to Box for one-dimensional layouts. It provides better ergonomics for the common case of equally-spaced children.

### Comparison to CSS Grid

While CSS Grid can handle one-dimensional layouts, Stack provides a simpler API for the common case and better integrates with MUI's responsive design system.

### Flex Gap Browser Support

The `useFlexGap` prop allows opting into CSS gap for flex containers, which is cleaner than margin-based spacing but has slightly less browser support (IE not supported, but well-supported in modern browsers).

### No Visual Styling

Unlike many MUI components, Stack provides no visual styling (borders, backgrounds, etc.). It's purely a layout primitive. Use the `sx` prop or composition with other components (Paper, Card, etc.) for visual styling.

### Responsive Design Philosophy

MUI's mobile-first responsive approach means that values cascade upward through breakpoints. Setting a value at `sm` applies to `md`, `lg`, and `xl` unless explicitly overridden.

### Common Gotcha: Default Direction

Stack defaults to `direction="column"` (vertical), which differs from CSS flexbox's default of row (horizontal). This is intentional as vertical stacking is the more common use case in UI design.

### Integration with Grid

For truly two-dimensional layouts, Grid is more appropriate than nested Stacks. Use Stack for simpler one-dimensional arrangements and save Grid for complex multi-column, multi-row layouts.

---

**Research completed:** 2025-11-05
**Component:** Stack (Layout)
**Framework:** MUI (Material-UI)
**Documentation:** https://mui.com/material-ui/react-stack/

**Notable Features:**
- One-dimensional flexbox layout primitive with intelligent spacing management
- Full responsive design support with mobile-first approach
- Deep integration with MUI theming system (spacing scale, breakpoints)
- Modern CSS implementation using gap property with fallback
- Powerful `sx` prop for theme-aware inline styling
- Semantic HTML support via `component` prop
- Divider integration for visual separation
- TypeScript support with comprehensive type definitions
- No visual styling (purely layout-focused)
- Defaults to column direction (vertical stacking)
