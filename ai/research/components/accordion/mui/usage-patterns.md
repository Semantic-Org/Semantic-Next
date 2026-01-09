# MUI (Material-UI) - Accordion Component

## Component URL
https://mui.com/material-ui/react-accordion/
Status: ✅ Working
API Reference: https://mui.com/material-ui/api/accordion/
AccordionSummary API: https://mui.com/material-ui/api/accordion-summary/
AccordionDetails API: https://mui.com/material-ui/api/accordion-details/
AccordionActions API: https://mui.com/material-ui/api/accordion-actions/
Version: Current (v5+/v6)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - MUI provides excellent documentation with interactive demos, complete API reference, multiple examples covering controlled/uncontrolled patterns, accessibility guidance, and Material Design specifications. The component system is well-structured with clear component hierarchy and composition patterns.

---

## 1. Component Overview

The MUI Accordion component is Material Design's implementation of a disclosure pattern - a user interface element that expands and collapses sections of content. It's ideal for organizing large amounts of information into manageable, scannable panels.

Accordion is a composite component system consisting of:
- **Accordion** - The wrapper/container for accordion panels
- **AccordionSummary** - The clickable header/trigger for expanding/collapsing
- **AccordionDetails** - The container for expanded panel content
- **AccordionActions** (optional) - A footer area for action buttons

The component supports both **controlled** (externally managed state) and **uncontrolled** (self-managed) patterns, making it flexible for different use cases like FAQs, settings panels, and content disclosure patterns.

**Key Design Features**:
- Full Material Design compliance with elevation and ripple effects
- Flexible expansion behavior (single or multiple panels at once)
- Built-in accessibility with ARIA attributes and keyboard navigation
- Customizable styling with sx prop and theme integration
- Content is mounted by default even when collapsed (SEO-friendly)

---

## 2. Basic Usage

### Import
```jsx
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

// Alternative import
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
```

### Uncontrolled Accordion (Basic Pattern)
The simplest pattern - each accordion manages its own expanded state internally:

```jsx
import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function BasicAccordion() {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Section 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is the content for section 1.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Section 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is the content for section 2.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography>Section 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is the content for section 3.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
```

**Key Pattern Notes**:
- Each Accordion instance is independent
- Users can expand multiple panels simultaneously
- `expandIcon` prop adds a visual indicator (typically ExpandMoreIcon)
- `aria-controls` and `id` attributes provide accessibility
- Content is always rendered in DOM (not unmounted when collapsed)

### Controlled Accordion (Single Expansion)
Only one panel can be expanded at a time - controlled by parent state:

```jsx
import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ControlledAccordion() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Section 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Content for section 1</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Section 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Content for section 2</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography>Section 3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Content for section 3</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
```

**Controlled Pattern Notes**:
- Parent state controls which panel(s) are expanded
- `expanded` prop set to boolean for each accordion
- `onChange` callback receives `(event, isExpanded)` and updates parent state
- Perfect for "one at a time" expansion behavior
- Enable/disable expansion of multiple panels by adjusting `expanded` logic

---

## 3. Props/API

### Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | AccordionSummary and AccordionDetails components |
| `defaultExpanded` | `boolean` | `false` | If `true`, the accordion is expanded by default (uncontrolled) |
| `disabled` | `boolean` | `false` | If `true`, the accordion cannot be expanded or collapsed |
| `expanded` | `boolean` | - | If provided, makes accordion controlled (requires onChange callback) |
| `onChange` | `function` | - | Callback fired when expansion state changes. Signature: `(event: object, isExpanded: boolean) => void` |
| `square` | `boolean` | `false` | If `true`, removes rounded corners (square appearance) |
| `disableGutters` | `boolean` | `false` | If `true`, removes padding from AccordionSummary when expanded |
| `TransitionComponent` | `component` | `Collapse` | The component used for the transition animation |
| `elevation` | `number` | `1` | The elevation (shadow depth) of the accordion. Range: 0-24 |
| `slotProps` | `object` | - | Props passed to slot components (transition, root, etc.) |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for defining custom styles with theme access |
| `classes` | `object` | - | Override or extend styles. Supports: `root`, `rounded`, `expanded`, `disabled`, `gutters` |

### AccordionSummary Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The content of the accordion summary (typically Typography or text) |
| `expandIcon` | `node` | - | The icon that indicates expansion state (typically ExpandMoreIcon) |
| `aria-controls` | `string` | - | ARIA attribute linking to the controlled content panel |
| `aria-expanded` | `boolean` | - | ARIA attribute indicating if accordion is expanded (auto-managed) |
| `id` | `string` | - | HTML id attribute (important for accessibility) |
| `disabled` | `boolean` | `false` | If `true`, the summary cannot be clicked to expand |
| `onClick` | `function` | - | Click handler callback |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles. Supports: `root`, `expanded`, `disabled`, `focusVisible` |

### AccordionDetails Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | The content to display when accordion is expanded |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles. Supports: `root` |

### AccordionActions Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `node` | - | Action buttons or other interactive elements |
| `disableSpacing` | `boolean` | `false` | If `true`, removes margin from action buttons |
| `sx` | `Array<func \| object \| bool> \| func \| object` | - | System prop for custom styles |
| `classes` | `object` | - | Override styles. Supports: `root`, `spacing` |

---

## 4. Variants & Patterns

### Default Expanded State

```jsx
<Accordion defaultExpanded>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Expanded by Default</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>This accordion opens automatically</Typography>
  </AccordionDetails>
</Accordion>
```

**Use Cases**:
- First accordion in a FAQ section
- Important information that should be visible initially
- Demonstration content

### Disabled Accordion

```jsx
<Accordion disabled>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Disabled Accordion</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>This accordion cannot be expanded</Typography>
  </AccordionDetails>
</Accordion>
```

**Disabled State Features**:
- Visual indication of disabled state (reduced opacity)
- Cannot be clicked to expand/collapse
- Useful for conditional content access
- Better UX than hiding unavailable sections

### Square Variant

```jsx
<Accordion square>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Square Accordion</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>This accordion has square corners</Typography>
  </AccordionDetails>
</Accordion>
```

**Use Cases**:
- Modern, minimalist designs
- Card-based layouts
- Dense information layouts

### Multiple Panels Expanded

```jsx
function MultiExpandAccordion() {
  const [expandedPanels, setExpandedPanels] = React.useState({});

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
  };

  return (
    <div>
      <Accordion
        expanded={expandedPanels.panel1 || false}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Section 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Content 1</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expandedPanels.panel2 || false}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Section 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Content 2</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
```

**Use Cases**:
- Allow users to compare multiple sections
- Independent information sections
- Form sections that don't conflict

### Accordion with Custom Icon

```jsx
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

<Accordion>
  <AccordionSummary
    expandIcon={<ChevronRightIcon />}
    sx={{
      '& .MuiAccordionSummary-content': {
        flexGrow: 0,
      },
    }}
  >
    <Typography>Custom Icon</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>Using ChevronRightIcon instead of ExpandMoreIcon</Typography>
  </AccordionDetails>
</Accordion>
```

**Icon Considerations**:
- ExpandMoreIcon (default) - rotates 180° when expanded
- ChevronRightIcon - rotates 90° when expanded
- Custom icons require custom CSS for rotation
- Icon should clearly indicate expansion state

### Accordion with Rich Summary Content

```jsx
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Avatar sx={{ mr: 2 }}>JD</Avatar>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        John Doe
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Active member since 2020
      </Typography>
    </Box>
    <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
      View Profile
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Stack spacing={2}>
      <Typography>Email: john@example.com</Typography>
      <Typography>Phone: (555) 000-0000</Typography>
      <Typography>Address: 123 Main St, City, State 12345</Typography>
    </Stack>
  </AccordionDetails>
</Accordion>
```

**Rich Content Patterns**:
- Combine with Avatar, icons, badges
- Use multiple Typography variants
- Create visually rich accordion headers
- Use flexGrow for layout control

### Accordion with Actions

```jsx
import AccordionActions from '@mui/material/AccordionActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Settings</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Box sx={{ width: '100%' }}>
      <Typography>
        Configure your preferences below.
      </Typography>
    </Box>
  </AccordionDetails>
  <Divider />
  <AccordionActions>
    <Button>Cancel</Button>
    <Button variant="contained">Save</Button>
  </AccordionActions>
</Accordion>
```

**Action Button Patterns**:
- Always add `<Divider />` before AccordionActions
- Use AccordionActions for related buttons at bottom
- Common for form/settings panels
- Buttons remain visible when expanded

### Nested Accordions

```jsx
import Stack from '@mui/material/Stack';

function NestedAccordions() {
  return (
    <Stack spacing={2}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Category 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Subcategory 1.1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">Content 1.1</Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Subcategory 1.2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">Content 1.2</Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Category 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Content for category 2</Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
```

**Nested Accordion Tips**:
- Each nested accordion is independent
- Use variant="body2" for Typography in nested levels
- Wrap nested accordions in Stack with spacing
- Proper indentation for visual hierarchy
- Works with both controlled and uncontrolled patterns

### Transition Customization

```jsx
import Grow from '@mui/material/Grow';

<Accordion
  TransitionComponent={Grow}
  slotProps={{
    transition: {
      timeout: 500,
    }
  }}
>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Custom Transition</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>Uses Grow animation instead of Collapse</Typography>
  </AccordionDetails>
</Accordion>
```

**Available Transitions**:
- `Collapse` (default) - Expands/collapses vertically
- `Grow` - Scales and fades
- `Zoom` - Scales and fades from center
- `Fade` - Fades in/out

---

## 5. Composition Patterns

### Complete FAQ Example

```jsx
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQSection() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      id: 'panel1',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all unused items in original packaging.'
    },
    {
      id: 'panel2',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is 2-3 business days.'
    },
    {
      id: 'panel3',
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries. International shipping rates are calculated at checkout.'
    },
    {
      id: 'panel4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.'
    }
  ];

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={handleChange(faq.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${faq.id}-content`}
              id={`${faq.id}-header`}
            >
              <Typography fontWeight={500}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
```

### Controlled Accordion with Filters

```jsx
function ProductSettings() {
  const [expanded, setExpanded] = React.useState('panel1');
  const [settings, setSettings] = React.useState({
    notifications: true,
    darkMode: false,
    twoFactor: false
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div>
      <Accordion
        expanded={expanded === 'notifications'}
        onChange={handleAccordionChange('notifications')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Notifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={() => handleSettingChange('notifications')}
              />
            }
            label="Enable notifications"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'security'}
        onChange={handleAccordionChange('security')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Security</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={() => handleSettingChange('darkMode')}
                />
              }
              label="Dark mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactor}
                  onChange={() => handleSettingChange('twoFactor')}
                />
              }
              label="Two-factor authentication"
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
```

---

## 6. Styling & Theming

### Using sx Prop

**Summary styling**:
```jsx
<AccordionSummary
  expandIcon={<ExpandMoreIcon />}
  sx={{
    backgroundColor: 'primary.light',
    color: 'primary.contrastText',
    '&:hover': {
      backgroundColor: 'primary.main',
    },
    '&.Mui-expanded': {
      backgroundColor: 'primary.main',
    }
  }}
>
  <Typography>Styled Summary</Typography>
</AccordionSummary>
```

**Details styling**:
```jsx
<AccordionDetails
  sx={{
    backgroundColor: 'grey.50',
    borderTop: '1px solid',
    borderColor: 'divider',
    pt: 3,
  }}
>
  <Typography>Styled content</Typography>
</AccordionDetails>
```

**Complete styled accordion**:
```jsx
<Accordion
  sx={{
    '&:before': {
      display: 'none',
    },
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider',
    '&.Mui-expanded': {
      margin: '0',
    }
  }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    sx={{
      backgroundColor: 'action.hover',
      '&.Mui-expanded': {
        backgroundColor: 'primary.light',
      }
    }}
  >
    <Typography>Custom Styled</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>Content</Typography>
  </AccordionDetails>
</Accordion>
```

### Styled Components API

```jsx
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  '&.Mui-expanded': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .1)'
        : 'rgba(0, 0, 0, .06)',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

function CustomStyledAccordion() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Custom Styled Accordion</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Content</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
```

### Theme-Level Customization

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            display: 'none',
          },
        }
      },
      defaultProps: {
        elevation: 0,
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, .03)',
          '&.Mui-expanded': {
            backgroundColor: 'rgba(0, 0, 0, .06)',
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: 'background.paper',
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* All accordions will use these styles */}
    </ThemeProvider>
  );
}
```

### CSS Classes for Customization

**Accordion CSS classes**:
- `.MuiAccordion-root` - Root element
- `.Mui-expanded` - Applied when expanded
- `.Mui-disabled` - Applied when disabled

**AccordionSummary CSS classes**:
- `.MuiAccordionSummary-root` - Root element
- `.Mui-expanded` - Applied when expanded
- `.MuiAccordionSummary-content` - Content wrapper
- `.Mui-focusVisible` - Applied on focus

**AccordionDetails CSS classes**:
- `.MuiAccordionDetails-root` - Root element

---

## 7. Accessibility

### ARIA Attributes

**AccordionSummary ARIA**:
```jsx
<AccordionSummary
  id="panel1-header"                    // For labeling
  aria-controls="panel1-content"        // Links to details section
  aria-expanded={expanded}              // Indicates if expanded (auto-managed)
  expandIcon={<ExpandMoreIcon />}
>
  <Typography>Summary</Typography>
</AccordionSummary>
<AccordionDetails id="panel1-content">
  {/* Content */}
</AccordionDetails>
```

**Screen Reader Announcements**:
- Automatically announces accordion state changes
- ARIA expanded attribute indicates current state
- aria-controls links header to content
- Expand/collapse action announced to users

### Keyboard Navigation

**Supported Keys**:
- **Space/Enter** - Toggle expansion state of focused accordion
- **Tab** - Move focus to next accordion header
- **Shift+Tab** - Move focus to previous accordion header
- **Home** - Jump to first accordion (if proper tabindex management)
- **End** - Jump to last accordion (if proper tabindex management)

**Keyboard Example**:
```jsx
function AccessibleAccordion() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div role="region" aria-label="FAQ Section">
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id="panel1-header"
          aria-controls="panel1-content"
          aria-expanded={expanded === 'panel1'}
        >
          <Typography>Question 1</Typography>
        </AccordionSummary>
        <AccordionDetails id="panel1-content">
          <Typography>Answer 1</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id="panel2-header"
          aria-controls="panel2-content"
          aria-expanded={expanded === 'panel2'}
        >
          <Typography>Question 2</Typography>
        </AccordionSummary>
        <AccordionDetails id="panel2-content">
          <Typography>Answer 2</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
```

### Focus Management

**Best Practices**:
- All accordion headers should be keyboard accessible
- Focus visible indicator provided automatically
- Tab order flows naturally through headers
- No focus trap - can tab past entire accordion

**Focus Control Example**:
```jsx
<AccordionSummary
  expandIcon={<ExpandMoreIcon />}
  tabIndex={0}  // Ensure focusable
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Handle enter/space to toggle
    }
  }}
>
  <Typography>Focusable Summary</Typography>
</AccordionSummary>
```

---

## 8. Best Practices

### When to Use Accordion

**Use Accordion for**:
- FAQs and help documentation
- Settings or preferences panels
- Step-by-step workflows (can expand multiple)
- Long lists of related content
- Progressive disclosure of information
- Content that's referenced but not always needed

**Use Other Components Instead for**:
- Main navigation - Use tabs or nav menu
- Temporary content - Use modal/dialog
- Real-time data updates - Use dedicated panel
- Content requiring frequent switching - Consider tabs

### Design Guidelines

**Ordering**:
```jsx
// Good: Most frequently asked first
<Accordion>Most Popular Question</Accordion>
<Accordion>Second Most Popular</Accordion>

// Good: Logical grouping
<Accordion>Getting Started</Accordion>
<Accordion>Using Features</Accordion>
<Accordion>Troubleshooting</Accordion>
```

**Content Length**:
- Keep summaries concise (1-2 lines)
- Limit details to relevant information
- Use headings in details for longer content
- Consider pagination for very long content

**Visual Clarity**:
```jsx
// Good: Clear hierarchy
<Accordion defaultExpanded>  {/* Important */}
  <AccordionSummary>Important Information</AccordionSummary>
  <AccordionDetails>Content</AccordionDetails>
</Accordion>

// Good: Icon indicates state
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
  Expandable Section
</AccordionSummary>

// Good: Distinguish active state
<AccordionSummary
  sx={{
    '&.Mui-expanded': {
      backgroundColor: 'action.hover',
    }
  }}
>
  Summary
</AccordionSummary>
```

**Spacing and Borders**:
```jsx
import Stack from '@mui/material/Stack';

// Good: Use Stack for spacing between accordions
<Stack spacing={1}>
  <Accordion>Panel 1</Accordion>
  <Accordion>Panel 2</Accordion>
  <Accordion>Panel 3</Accordion>
</Stack>

// Good: Add dividers for clear separation
<Accordion>
  <AccordionSummary>Summary</AccordionSummary>
  <AccordionDetails>Content</AccordionDetails>
  <Divider />
  <AccordionActions>
    <Button>Action</Button>
  </AccordionActions>
</Accordion>
```

### State Management

**Simple Multi-Expand Pattern**:
```jsx
// Good: Boolean map for multiple expansions
const [expanded, setExpanded] = React.useState({
  panel1: true,
  panel2: false,
  panel3: false
});

const handleChange = (panel) => (event, isExpanded) => {
  setExpanded(prev => ({
    ...prev,
    [panel]: isExpanded
  }));
};
```

**Single-Expand Pattern**:
```jsx
// Good: String state for single expansion
const [expanded, setExpanded] = React.useState('panel1');

const handleChange = (panel) => (event, isExpanded) => {
  setExpanded(isExpanded ? panel : false);
};
```

### Performance Considerations

**Content Mounting Behavior**:
```jsx
// Content is always in DOM (default)
// Good for: SEO, screen readers, stable component tree

// For performance with many panels:
const [expandedPanels, setExpandedPanels] = React.useState({});

{panels.map(panel => (
  <Accordion
    key={panel.id}
    expanded={expandedPanels[panel.id] || false}
    onChange={handleChange(panel.id)}
  >
    <AccordionSummary>{panel.title}</AccordionSummary>
    <AccordionDetails>
      {/* Content rendered regardless of expansion */}
      {panel.content}
    </AccordionDetails>
  </Accordion>
))}
```

### Common Patterns

**Accordion with Status Badges**:
```jsx
import Badge from '@mui/material/Badge';

<AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Typography sx={{ flexGrow: 1 }}>
    Settings
  </Typography>
  <Badge badgeContent={3} color="error">
    <Typography variant="body2" color="text.secondary">
      Requires attention
    </Typography>
  </Badge>
</AccordionSummary>
```

**Accordion with Custom Headers**:
```jsx
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Avatar src={user.avatar} sx={{ mr: 2 }} />
  <Box sx={{ flexGrow: 1 }}>
    <Typography fontWeight="bold">{user.name}</Typography>
    <Typography variant="body2" color="text.secondary">
      {user.status}
    </Typography>
  </Box>
  <Chip label={user.role} size="small" />
</AccordionSummary>
```

**Searchable Accordion List**:
```jsx
function SearchableAccordionList() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TextField
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {filteredItems.map((item) => (
        <Accordion
          key={item.id}
          expanded={expanded === item.id}
          onChange={(e, isExpanded) =>
            setExpanded(isExpanded ? item.id : false)
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
```

---

## 9. Material Design Specifications

### Accordion Dimensions

**Standard (default)**:
- Summary height: 48px (minimum touch target)
- Details padding: 16px
- Horizontal margin: 16px
- Border radius: 4px (rounded variant)

**Dense variant**:
- Summary height: 36px
- Details padding: 12px
- For compact layouts

### Elevation

**Default elevation**: 1 (subtle shadow)
- Can be customized via `elevation` prop
- Range: 0-24
- Higher values appear "above" other content

### Animation

**Default transition**: Collapse animation
- Duration: 300ms standard
- Easing: Material Design standard curve
- Can be customized via `TransitionComponent` and `slotProps`

### Color Scheme

**Light Mode**:
- Summary background: `rgba(0, 0, 0, .03)`
- Expanded summary: `rgba(0, 0, 0, .06)`
- Text: `text.primary` and `text.secondary`
- Border: `divider` color

**Dark Mode**:
- Summary background: `rgba(255, 255, 255, .05)`
- Expanded summary: `rgba(255, 255, 255, .1)`
- Text: `text.primary` and `text.secondary`
- Border: `divider` color

---

## 10. Common Patterns & Use Cases

### FAQ Section
- Default uncontrolled accordion
- One panel expanded by default
- Used with Typography for text content

### Settings Panel
- Controlled accordion with single expansion
- Contains form inputs (Switch, Checkbox, TextField)
- Action buttons at bottom

### Product Details
- Rich summary content (images, badges, ratings)
- Multiple expandable panels
- Allow comparison by expanding multiple

### Data Tables/Lists
- Each row as accordion
- Details showing full record
- Actions in AccordionActions

### Form Steps
- Multiple expandable sections
- Allow non-linear progression
- Validation indicators in summaries

### Documentation/Help
- Grouped accordions by topic
- Hierarchical structure with nested accordions
- Search functionality with filtering

---

## 11. Additional Resources

### Official Documentation
- Main docs: https://mui.com/material-ui/react-accordion/
- Accordion API: https://mui.com/material-ui/api/accordion/
- AccordionSummary API: https://mui.com/material-ui/api/accordion-summary/
- AccordionDetails API: https://mui.com/material-ui/api/accordion-details/
- AccordionActions API: https://mui.com/material-ui/api/accordion-actions/

### Material Design Specifications
- Accordion design guidelines: https://m3.material.io/components/lists/overview
- Material Design 3: https://m3.material.io/

### Community Resources
- Stack Overflow MUI tag: https://stackoverflow.com/questions/tagged/material-ui
- MUI GitHub discussions: https://github.com/mui/material-ui/discussions

### Related Components
- Tabs: https://mui.com/material-ui/react-tabs/
- Card: https://mui.com/material-ui/react-card/
- ExpansionPanel (legacy): https://v4.mui.com/api/expansion-panel/
- Collapse: https://mui.com/material-ui/react-collapse/
- List: https://mui.com/material-ui/react-list/

---

## Summary

MUI Accordion is a comprehensive, Material Design-compliant disclosure component that provides:

- **Flexible expansion patterns** - Controlled or uncontrolled, single or multiple expansion
- **Rich composition** - Supports AccordionSummary, AccordionDetails, AccordionActions with custom content
- **Material Design integration** - Elevation, ripple effects, smooth animations, theme support
- **Full accessibility** - ARIA attributes, keyboard navigation, screen reader support
- **Extensive customization** - sx prop, styled components, theme-level overrides
- **SEO-friendly** - Content mounted by default even when collapsed
- **Performance optimized** - Efficient re-rendering and animation

The component is production-ready, well-documented, and suitable for FAQs, settings panels, content organization, and progressive disclosure patterns. Its composition system makes it easy to create rich, interactive disclosure interfaces.

---

Research completed: 2025-11-05
Component: Accordion
Framework: MUI
Documentation: https://mui.com/material-ui/react-accordion/
