# MUI (Material-UI) - Tooltip Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://mui.com/material-ui/react-tooltip/
Status: ✅ Working
Version: Material UI v6 (Current)
Last Verified: 2025-11-06

## Documentation Quality
**Comprehensive** - Excellent documentation with extensive examples, props reference, API documentation, accessibility guidance, and customization patterns. Includes interactive demos, TypeScript types, and detailed positioning system with Popper integration.

## Component Definition
- **Core purpose**: Displays informative text when users hover over, focus on, or tap an element, providing contextual information without cluttering the interface
- **Mental model**: A contextual popup that enhances UI elements with additional information while remaining non-intrusive until needed
- **Semantic meaning**: Provides supplementary information to aid user understanding and decision-making, following Material Design tooltip specifications

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via `title` prop: `<Tooltip title="Text content">` |
| HTML content | ✅ | Native | `title` accepts React nodes for rich content including JSX elements |
| Rich formatting | ✅ | Composed | Custom components with styling via `title={<CustomComponent />}` |
| Icons in content | ✅ | Composed | Include icon components within title content |
| Multi-line content | ✅ | Native | Automatic text wrapping with max-width constraint (default 300px) |
| Custom width | ✅ | Native | Via `sx` prop or `styled` component to override max-width |
| Long descriptions | ✅ | Native | Supports extended text with scrolling if needed |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Top placement | ✅ | Native | `placement="top"` - Default position above element |
| Bottom placement | ✅ | Native | `placement="bottom"` - Below element |
| Left placement | ✅ | Native | `placement="left"` - To the left of element |
| Right placement | ✅ | Native | `placement="right"` - To the right of element |
| Top-start | ✅ | Native | `placement="top-start"` - Top with left alignment |
| Top-end | ✅ | Native | `placement="top-end"` - Top with right alignment |
| Bottom-start | ✅ | Native | `placement="bottom-start"` - Bottom with left alignment |
| Bottom-end | ✅ | Native | `placement="bottom-end"` - Bottom with right alignment |
| Left-start | ✅ | Native | `placement="left-start"` - Left with top alignment |
| Left-end | ✅ | Native | `placement="left-end"` - Left with bottom alignment |
| Right-start | ✅ | Native | `placement="right-start"` - Right with top alignment |
| Right-end | ✅ | Native | `placement="right-end"` - Right with bottom alignment |
| Auto-positioning | ✅ | Native | Popper automatically flips placement when insufficient space |
| Arrow indicator | ✅ | Native | `arrow` prop adds directional pointer to tooltip |
| Follow cursor | ✅ | Native | `followCursor` prop makes tooltip track mouse movement |
| Virtual element | ✅ | Native | `PopperProps.anchorEl` with virtual positioning reference |

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hover trigger | ✅ | Native | Default behavior, activates on mouse enter |
| Focus trigger | ✅ | Native | Shows on element focus for keyboard accessibility |
| Touch trigger | ✅ | Native | Long press on touch devices |
| Click trigger | ⚠️ | Composed | Requires controlled state with `open` prop and click handler |
| Programmatic | ✅ | Native | Controlled via `open`, `onOpen`, `onClose` props |
| Disable hover | ✅ | Native | `disableHoverListener` prop prevents hover activation |
| Disable focus | ✅ | Native | `disableFocusListener` prop prevents focus activation |
| Disable touch | ✅ | Native | `disableTouchListener` prop prevents touch activation |
| Enter delay | ✅ | Native | `enterDelay` prop in milliseconds (default: 100ms) |
| Leave delay | ✅ | Native | `leaveDelay` prop in milliseconds (default: 0ms) |
| Touch delay | ✅ | Native | `enterTouchDelay` prop for long press duration (default: 700ms) |
| Leave touch delay | ✅ | Native | `leaveTouchDelay` prop for touch exit delay (default: 1500ms) |

## Interactivity Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Interactive content | ✅ | Native | `interactive` (default: true) allows hovering tooltip content |
| Disable interactive | ✅ | Native | `disableInteractive` prevents tooltip hover, fails WCAG 2.1 AA |
| Clickable links | ✅ | Native | Interactive mode allows clicking links within tooltip |
| Form inputs | ✅ | Composed | Can include inputs when `interactive={true}` |
| Close on click away | ✅ | Composed | Via `ClickAwayListener` wrapper for controlled tooltips |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Controlled state | ✅ | Native | `open` prop with `onOpen`/`onClose` callbacks |
| Uncontrolled state | ✅ | Native | Default behavior, internally managed open/close |
| Disabled element support | ⚠️ | Composed | Requires wrapper element (span) around disabled children |
| Conditional display | ✅ | Native | Control visibility via `open` prop based on conditions |
| Persist on click | ✅ | Composed | Controlled state with click handler to toggle |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Theme integration | ✅ | Native | Uses Material-UI theme colors and typography |
| Custom colors | ✅ | Native | Via `sx` prop or theme customization |
| Custom width | ✅ | Native | Override max-width with `styled` component or `sx` |
| Arrow styling | ✅ | Native | Arrow inherits tooltip background color automatically |
| Custom transitions | ✅ | Native | `TransitionComponent` prop (Fade, Grow, Zoom, Collapse) |
| Transition timing | ✅ | Native | `TransitionProps={{ timeout: ms }}` controls duration |
| Custom classes | ✅ | Native | `classes` prop for targeted style overrides |
| Portal control | ✅ | Native | `PopperProps.disablePortal` to render in DOM hierarchy |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA attributes | ✅ | Native | Automatic `aria-describedby` on trigger element |
| Keyboard navigation | ✅ | Native | Focus trigger supports tab navigation |
| Screen reader support | ✅ | Native | Tooltip content announced to screen readers |
| WCAG 2.1 compliance | ✅ | Native | Interactive by default (criterion 1.4.13) |
| Focus visible | ✅ | Native | Visual focus indicators on keyboard navigation |
| Touch accessibility | ✅ | Native | Long press pattern for touch devices |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested tooltips | ⚠️ | Composed | Multiple tooltips require careful event management |
| Tooltip groups | ⚠️ | Composed | Multiple tooltips sharing state requires custom logic |
| Dynamic content | ✅ | Native | `title` prop accepts functions or dynamic React elements |
| Tooltip on disabled elements | ⚠️ | Composed | Requires wrapping disabled element in span |
| Custom positioning | ✅ | Native | `PopperProps` for advanced Popper.js configuration |
| Offset control | ✅ | Native | `PopperProps.modifiers` for positioning offsets |
| Boundary detection | ✅ | Native | Automatic flip and overflow prevention via Popper |
| Z-index control | ✅ | Native | Via `componentsProps.popper.sx={{ zIndex: value }}` |

## Code Examples

### Basic Tooltip
```jsx
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

// Simple text tooltip
<Tooltip title="This is a helpful tooltip">
  <Button>Hover me</Button>
</Tooltip>

// With icon
<Tooltip title="Zoom In">
  <IconButton>
    <ZoomInIcon />
  </IconButton>
</Tooltip>
```

### All 12 Placement Positions
```jsx
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

// Top placements
<Tooltip title="Top start" placement="top-start">
  <Button>Top Start</Button>
</Tooltip>

<Tooltip title="Top center" placement="top">
  <Button>Top</Button>
</Tooltip>

<Tooltip title="Top end" placement="top-end">
  <Button>Top End</Button>
</Tooltip>

// Bottom placements
<Tooltip title="Bottom start" placement="bottom-start">
  <Button>Bottom Start</Button>
</Tooltip>

<Tooltip title="Bottom center" placement="bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip title="Bottom end" placement="bottom-end">
  <Button>Bottom End</Button>
</Tooltip>

// Left placements
<Tooltip title="Left start" placement="left-start">
  <Button>Left Start</Button>
</Tooltip>

<Tooltip title="Left center" placement="left">
  <Button>Left</Button>
</Tooltip>

<Tooltip title="Left end" placement="left-end">
  <Button>Left End</Button>
</Tooltip>

// Right placements
<Tooltip title="Right start" placement="right-start">
  <Button>Right Start</Button>
</Tooltip>

<Tooltip title="Right center" placement="right">
  <Button>Right</Button>
</Tooltip>

<Tooltip title="Right end" placement="right-end">
  <Button>Right End</Button>
</Tooltip>
```

### Arrow Tooltips
```jsx
// Basic arrow
<Tooltip title="Arrow tooltip" arrow>
  <Button>With Arrow</Button>
</Tooltip>

// Arrow with custom placement
<Tooltip
  title="Positioned arrow"
  arrow
  placement="right"
>
  <Button>Right Arrow</Button>
</Tooltip>

// Multiple arrows at different positions
<Box sx={{ display: 'flex', gap: 2 }}>
  <Tooltip title="Top arrow" arrow placement="top">
    <Button>Top</Button>
  </Tooltip>
  <Tooltip title="Bottom arrow" arrow placement="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip title="Left arrow" arrow placement="left">
    <Button>Left</Button>
  </Tooltip>
  <Tooltip title="Right arrow" arrow placement="right">
    <Button>Right</Button>
  </Tooltip>
</Box>
```

### Delay Control
```jsx
// Enter and leave delays
<Tooltip
  title="Appears after 500ms"
  enterDelay={500}
  leaveDelay={200}
>
  <Button>Delayed Tooltip</Button>
</Tooltip>

// Quick tooltip (no delay)
<Tooltip
  title="Instant appearance"
  enterDelay={0}
  leaveDelay={0}
>
  <Button>Instant</Button>
</Tooltip>

// Touch delay
<Tooltip
  title="Long press on mobile"
  enterTouchDelay={1000}
  leaveTouchDelay={2000}
>
  <Button>Touch Delay</Button>
</Tooltip>
```

### Controlled Tooltip
```jsx
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Controlled tooltip"
      >
        <Button onClick={handleTooltipOpen}>Click Me</Button>
      </Tooltip>
    </ClickAwayListener>
  );
}
```

### Disabled Element with Wrapper
```jsx
// Disabled elements need a wrapper
<Tooltip title="You don't have permission">
  <span>
    <Button disabled>Disabled Button</Button>
  </span>
</Tooltip>

// Multiple disabled elements
<Tooltip title="Feature unavailable">
  <span>
    <IconButton disabled>
      <SaveIcon />
    </IconButton>
  </span>
</Tooltip>
```

### Trigger Configuration
```jsx
// Disable hover listener (focus and touch only)
<Tooltip
  title="Focus or touch only"
  disableHoverListener
>
  <Button>No Hover</Button>
</Tooltip>

// Disable focus listener (hover and touch only)
<Tooltip
  title="Hover or touch only"
  disableFocusListener
>
  <Button>No Focus</Button>
</Tooltip>

// Disable touch listener (hover and focus only)
<Tooltip
  title="Hover or focus only"
  disableTouchListener
>
  <Button>No Touch</Button>
</Tooltip>

// Disable all default triggers (manual control only)
<Tooltip
  title="Manual control"
  disableHoverListener
  disableFocusListener
  disableTouchListener
  open={manualOpen}
>
  <Button>Manual</Button>
</Tooltip>
```

### Interactive Tooltips
```jsx
// Interactive tooltip with clickable content (default)
<Tooltip
  title={
    <div>
      Learn more at <a href="https://example.com">example.com</a>
    </div>
  }
>
  <Button>Interactive Content</Button>
</Tooltip>

// Non-interactive tooltip (closes immediately on mouse leave)
<Tooltip
  title="Quick info"
  disableInteractive
>
  <Button>Non-interactive</Button>
</Tooltip>
```

### Follow Cursor
```jsx
// Tooltip follows mouse cursor
<Tooltip title="I follow your cursor" followCursor>
  <Box sx={{ width: 200, height: 100, bgcolor: 'primary.light' }}>
    Move mouse here
  </Box>
</Tooltip>

// Follow cursor with arrow
<Tooltip
  title="Following with arrow"
  followCursor
  arrow
>
  <Box sx={{ p: 2, bgcolor: 'secondary.light' }}>
    Hover area
  </Box>
</Tooltip>
```

### Custom Width Tooltips
```jsx
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

// Custom width tooltip using styled
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

<CustomWidthTooltip title="This is a very long tooltip text that will wrap at 500px instead of the default 300px width limit">
  <Button>Wide Tooltip</Button>
</CustomWidthTooltip>

// No max width tooltip
const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
});

<NoMaxWidthTooltip title="This tooltip has no maximum width constraint and will not wrap">
  <Button>Unlimited Width</Button>
</NoMaxWidthTooltip>
```

### Custom Transitions
```jsx
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import Grow from '@mui/material/Grow';

// Fade transition
<Tooltip
  title="Fade effect"
  TransitionComponent={Fade}
  TransitionProps={{ timeout: 600 }}
>
  <Button>Fade</Button>
</Tooltip>

// Zoom transition
<Tooltip
  title="Zoom effect"
  TransitionComponent={Zoom}
  TransitionProps={{ timeout: 500 }}
>
  <Button>Zoom</Button>
</Tooltip>

// Grow transition (default)
<Tooltip
  title="Grow effect"
  TransitionProps={{ timeout: 1000 }}
>
  <Button>Grow</Button>
</Tooltip>
```

### Rich HTML Content
```jsx
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Rich formatted content
<Tooltip
  title={
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Feature Name
      </Typography>
      <Typography variant="body2">
        Detailed description with multiple lines
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption">
          Pro tip: Use keyboard shortcuts
        </Typography>
      </Box>
    </Box>
  }
>
  <IconButton>
    <InfoIcon />
  </IconButton>
</Tooltip>

// With icons in content
<Tooltip
  title={
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CheckCircleIcon fontSize="small" />
      <span>Successfully saved</span>
    </Box>
  }
>
  <Button>Status</Button>
</Tooltip>
```

### Virtual Element Positioning (Advanced)
```jsx
import { useRef, useState } from 'react';

function VirtualElementTooltip() {
  const positionRef = useRef({ x: 0, y: 0 });
  const popperRef = useRef(null);
  const areaRef = useRef(null);

  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  return (
    <Tooltip
      title="Follows mouse precisely"
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef.current.getBoundingClientRect().y,
              0,
              0,
            );
          },
        },
      }}
    >
      <Box
        ref={areaRef}
        onMouseMove={handleMouseMove}
        sx={{
          width: 300,
          height: 200,
          bgcolor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Move mouse over this area
      </Box>
    </Tooltip>
  );
}
```

### Custom Styling with sx Prop
```jsx
// Custom background and text colors
<Tooltip
  title="Custom styled"
  componentsProps={{
    tooltip: {
      sx: {
        bgcolor: 'common.black',
        color: 'common.white',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        '& .MuiTooltip-arrow': {
          color: 'common.black',
        },
      },
    },
  }}
  arrow
>
  <Button>Custom Colors</Button>
</Tooltip>

// Custom padding and border radius
<Tooltip
  title="Rounded tooltip"
  componentsProps={{
    tooltip: {
      sx: {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 2,
        px: 2,
        py: 1,
        fontSize: '1rem',
      },
    },
  }}
>
  <Button>Styled</Button>
</Tooltip>
```

### Login Form Example
```jsx
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function LoginForm() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <Tooltip title="Please fill in this field" placement="right">
        <TextField label="Username" fullWidth />
      </Tooltip>

      <Tooltip
        title="Password requirements: 10+ chars, uppercase, lowercase, 1 number, 1 special character"
        placement="right"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
      >
        <TextField type="password" label="Password" fullWidth />
      </Tooltip>

      <Tooltip title="Submit the form" placement="right">
        <Button variant="contained" fullWidth>
          Login
        </Button>
      </Tooltip>
    </Box>
  );
}
```

### Custom Children with forwardRef
```jsx
import { forwardRef } from 'react';

// Custom component that properly forwards ref and props
const CustomButton = forwardRef(function CustomButton(props, ref) {
  return (
    <button
      {...props}
      ref={ref}
      style={{
        padding: '8px 16px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Custom Button
    </button>
  );
});

// Use with tooltip
<Tooltip title="Custom component tooltip">
  <CustomButton />
</Tooltip>
```

### Popper Configuration
```jsx
// Disable portal (render in DOM hierarchy)
<Tooltip
  title="Rendered in place"
  PopperProps={{
    disablePortal: true,
  }}
>
  <Button>No Portal</Button>
</Tooltip>

// Custom Popper modifiers
<Tooltip
  title="Custom offset"
  PopperProps={{
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -10],
        },
      },
    ],
  }}
>
  <Button>Custom Offset</Button>
</Tooltip>

// Prevent flip behavior
<Tooltip
  title="No auto-flip"
  PopperProps={{
    modifiers: [
      {
        name: 'flip',
        enabled: false,
      },
    ],
  }}
>
  <Button>Fixed Position</Button>
</Tooltip>
```

## Notable Features

### 1. Comprehensive Positioning System
MUI Tooltip provides 12 distinct placement options covering all sides and corners:
- **Cardinal directions**: top, bottom, left, right
- **Aligned variants**: Each direction has -start, center (default), -end options
- **Auto-positioning**: Popper.js automatically flips placement when constrained
- **Smart boundaries**: Prevents overflow and adjusts position dynamically

### 2. Intelligent Popper.js Integration
Built on Popper.js for sophisticated positioning:
- **Automatic flip**: Changes position when insufficient viewport space
- **Overflow prevention**: Keeps tooltip visible within boundaries
- **Virtual elements**: Support for custom positioning references
- **Modifier system**: Extensive configuration via PopperProps
- **Portal rendering**: Renders at document root to avoid z-index issues

### 3. Rich Delay Configuration
Fine-grained timing control for different interaction modes:
- **Enter delay** (default: 100ms): Prevents accidental tooltip triggers
- **Leave delay** (default: 0ms): Immediate close on mouse exit
- **Touch delays**: Separate timing for mobile interactions (700ms/1500ms)
- **Per-trigger control**: Different delays for hover vs touch

### 4. Multiple Trigger Modes
Flexible activation patterns for different use cases:
- **Hover**: Default mouse enter/leave behavior
- **Focus**: Keyboard navigation support (tab key)
- **Touch**: Long press pattern for mobile devices
- **Manual**: Programmatic control via open prop
- **Selective disable**: Turn off individual triggers while keeping others

### 5. Interactive Tooltips (WCAG 2.1 Compliant)
Built-in support for interactive content:
- **Default interactive**: Tooltip remains open when hovering content
- **Clickable elements**: Support for links, buttons within tooltip
- **WCAG 2.1 criterion 1.4.13**: Passes accessibility requirements by default
- **Opt-out available**: `disableInteractive` for simple use cases

### 6. Disabled Element Support
Special handling for disabled interactive elements:
- **Wrapper pattern**: Requires span wrapper around disabled children
- **Event forwarding**: Disabled elements don't fire events normally
- **Consistent UX**: Provides feedback even when action unavailable
- **Documentation**: Clear guidance on implementation pattern

### 7. Follow Cursor Mode
Tooltip tracks mouse movement in real-time:
- **Dynamic positioning**: Tooltip position updates with cursor
- **Virtual element**: Uses virtual positioning reference
- **Performance optimized**: Efficient update mechanism
- **Arrow support**: Works with arrow indicators

### 8. Customizable Transitions
Multiple animation options with timing control:
- **Grow** (default): Material Design scale-in effect
- **Fade**: Opacity transition
- **Zoom**: Scale animation
- **Custom components**: Support for any React transition component
- **Timing control**: TransitionProps for duration configuration

### 9. Advanced Styling System
Multiple layers of customization:
- **sx prop**: One-off styling via `componentsProps.tooltip.sx`
- **styled components**: Create reusable styled tooltip variants
- **Theme integration**: Global styling via MUI theme
- **CSS classes**: Targeted class overrides via `classes` prop
- **Width control**: Easy max-width customization

### 10. Arrow Indicator
Visual pointer showing tooltip target:
- **Simple activation**: Single `arrow` boolean prop
- **Auto-positioning**: Arrow placement adapts to tooltip position
- **Color inheritance**: Arrow matches tooltip background automatically
- **Custom styling**: Arrow styling via tooltip classes

### 11. Accessibility Built-In
Comprehensive accessibility support:
- **ARIA attributes**: Automatic `aria-describedby` on trigger
- **Keyboard navigation**: Full focus-based interaction support
- **Screen readers**: Tooltip content properly announced
- **WCAG 2.1**: Meets success criterion 1.4.13 by default
- **Focus management**: Clear focus indicators

### 12. Rich Content Support
Beyond simple text tooltips:
- **React elements**: Any JSX as title prop
- **Typography**: Styled text with Material-UI components
- **Icons**: Include icons within tooltip content
- **Multi-line**: Automatic text wrapping with max-width
- **Structured content**: Complex layouts with Box components

### 13. Controlled State Management
Full programmatic control when needed:
- **open prop**: Control visibility state
- **onOpen/onClose**: Callbacks for state synchronization
- **ClickAwayListener**: Integration for click-outside behavior
- **Conditional rendering**: Show/hide based on app state

### 14. Portal System
Flexible rendering context:
- **Default portal**: Renders at document root (avoids z-index issues)
- **Disable portal**: Render in DOM hierarchy via `disablePortal`
- **z-index control**: Customize stacking context
- **Positioning context**: Control relative positioning reference

## Research Notes

### Framework Approach
MUI takes a **props-driven configuration with Popper.js integration** approach where:
- Positioning powered by battle-tested Popper.js library
- Props for every major configuration option
- Composition for rich content
- Theme system for global consistency
- Material Design specifications as foundation

### API Design Philosophy
- **Sensible defaults**: Works out of box with minimal config
- **Progressive disclosure**: Simple use cases simple, complex use cases possible
- **Accessibility first**: WCAG compliant by default
- **Flexibility**: Multiple styling and positioning approaches
- **Type safety**: Full TypeScript support with comprehensive types

### Component Architecture
- **Single Tooltip component**: Handles all use cases
- **Popper.js foundation**: Reliable positioning engine
- **Portal rendering**: Solves z-index and overflow issues
- **Event management**: Sophisticated trigger coordination
- **Ref forwarding**: Proper DOM reference handling

### Material Design Patterns
1. **Subtle appearance**: Low-contrast background, small text
2. **Transient nature**: Appears/disappears without jarring motion
3. **Non-blocking**: Never prevents user interaction
4. **Contextual**: Always related to specific UI element
5. **Brief content**: Concise, helpful information

### Positioning Strategy
- **Popper.js modifiers**: flip, preventOverflow, offset, arrow
- **Boundary detection**: Viewport and custom boundary support
- **Smart fallbacks**: Automatic position adjustment
- **Virtual elements**: Advanced positioning use cases
- **Arrow positioning**: Automatic arrow placement and sizing

### Interaction Model
- **Hover prioritized**: Primary interaction for desktop
- **Focus support**: Keyboard accessibility
- **Touch adapted**: Long press for mobile
- **Manual control**: Programmatic when needed
- **Interactive by default**: WCAG 2.1 compliance

### Customization Layers
1. **Theme-level**: Global tooltip appearance
2. **Component-level**: Individual tooltip styling via sx/styled
3. **Content-level**: Rich HTML/JSX content
4. **Popper-level**: Advanced positioning via PopperProps
5. **Transition-level**: Animation customization

## Comparison Insights

### Strengths
1. **Positioning excellence**: Popper.js integration provides robust positioning
2. **12 placement options**: Comprehensive coverage of all positions
3. **Accessibility**: WCAG 2.1 compliant by default with interactive support
4. **Follow cursor**: Unique feature for dynamic positioning
5. **Rich content**: Full React element support in title prop
6. **Arrow support**: Built-in arrow indicator with auto-positioning
7. **Delay control**: Separate delays for enter/leave/touch
8. **Trigger flexibility**: Multiple activation modes with selective disable
9. **Interactive tooltips**: Clickable content support
10. **Virtual elements**: Advanced positioning for complex scenarios

### Potential Limitations
1. **Disabled elements**: Requires wrapper span (common HTML limitation)
2. **Bundle size**: Includes Popper.js dependency
3. **Material Design bias**: Styling follows Material Design patterns
4. **No nested tooltips**: Multiple tooltips require careful management
5. **Click trigger**: Requires manual controlled implementation
6. **Portal by default**: May cause issues with certain CSS contexts

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **12-position system**: top/bottom/left/right with -start/-end variants
2. **Arrow indicator**: Simple boolean prop with auto-positioning
3. **Delay configuration**: Separate enterDelay/leaveDelay/enterTouchDelay
4. **Trigger control**: Individual disable props for hover/focus/touch
5. **Interactive mode**: Default interactive with opt-out
6. **Follow cursor**: Dynamic positioning feature
7. **Rich content**: React element support in title/content
8. **Controlled state**: open/onOpen/onClose pattern
9. **Virtual elements**: Advanced positioning capability
10. **Portal control**: Option to render in/out of portal

#### Improve Upon
1. **Simplified disabled elements**: Built-in wrapper handling
2. **Click trigger**: Native click activation support
3. **Nested tooltips**: Better support for multiple tooltips
4. **Lighter weight**: Optional Popper.js for basic use cases
5. **CSS-only option**: Simple tooltips without JavaScript
6. **Group management**: Built-in tooltip coordination
7. **Content slots**: Structured slots for header/body/footer
8. **Animation library agnostic**: Not tied to MUI transitions

### Questions for Semantic UI Design

1. **Positioning engine**: Build custom or integrate Popper.js/Floating UI?
2. **Interactive default**: Should tooltips be interactive by default like MUI?
3. **Portal default**: Render in portal by default or in DOM hierarchy?
4. **Disabled elements**: Auto-detect and wrap, or require manual wrapper?
5. **Click trigger**: Built-in click behavior or require controlled state?
6. **Arrow styling**: Simple prop or detailed arrow configuration?
7. **Content model**: Single title prop or multiple content slots?
8. **Delay defaults**: What are appropriate default delays?
9. **Follow cursor**: Essential feature or edge case?
10. **Material Design**: Follow Material Design or be design-agnostic?

## Implementation Details Worth Noting

### Prop Interface (TypeScript)
```typescript
interface TooltipProps {
  // Content
  title: React.ReactNode;

  // Positioning
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  arrow?: boolean;
  followCursor?: boolean;

  // Timing
  enterDelay?: number;
  leaveDelay?: number;
  enterTouchDelay?: number;
  leaveTouchDelay?: number;

  // Triggers
  disableFocusListener?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;

  // Interactivity
  disableInteractive?: boolean;

  // Control
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;

  // Styling
  classes?: Partial<TooltipClasses>;
  componentsProps?: {
    tooltip?: {
      sx?: SxProps;
    };
  };

  // Transitions
  TransitionComponent?: React.ComponentType;
  TransitionProps?: object;

  // Popper
  PopperProps?: Partial<PopperProps>;

  // Children
  children: React.ReactElement;
}
```

### Default Values
```javascript
{
  placement: 'bottom',
  arrow: false,
  enterDelay: 100,
  leaveDelay: 0,
  enterTouchDelay: 700,
  leaveTouchDelay: 1500,
  disableFocusListener: false,
  disableHoverListener: false,
  disableTouchListener: false,
  disableInteractive: false,
  followCursor: false,
}
```

### CSS Classes Structure
```css
.MuiTooltip-popper {
  /* Popper container */
  z-index: 1500;
}

.MuiTooltip-tooltip {
  /* Tooltip content box */
  background-color: rgba(97, 97, 97, 0.92);
  color: #fff;
  font-size: 0.75rem;
  max-width: 300px;
  padding: 4px 8px;
  border-radius: 4px;
}

.MuiTooltip-arrow {
  /* Arrow indicator */
  color: rgba(97, 97, 97, 0.92);
}

.MuiTooltip-tooltipPlacementTop {
  /* Position-specific styles */
  margin-bottom: 8px;
}

.MuiTooltip-tooltipPlacementBottom {
  margin-top: 8px;
}

.MuiTooltip-tooltipPlacementLeft {
  margin-right: 8px;
}

.MuiTooltip-tooltipPlacementRight {
  margin-left: 8px;
}
```

### Accessibility Attributes
Automatically applied:
```html
<!-- Trigger element -->
<button
  aria-describedby="tooltip-1"
  aria-haspopup="false"
>
  Hover me
</button>

<!-- Tooltip element -->
<div
  id="tooltip-1"
  role="tooltip"
  class="MuiTooltip-tooltip"
>
  Tooltip content
</div>
```

### Popper.js Modifiers
Default configuration:
```javascript
PopperProps={{
  modifiers: [
    {
      name: 'flip',
      enabled: true,
      options: {
        altBoundary: true,
        rootBoundary: 'viewport',
      },
    },
    {
      name: 'preventOverflow',
      enabled: true,
      options: {
        altAxis: true,
        altBoundary: true,
        tether: true,
        rootBoundary: 'viewport',
      },
    },
    {
      name: 'arrow',
      enabled: false,
    },
  ],
}}
```

### Event Handler Priority
Tooltip manages multiple event sources:
1. **Hover**: mouseenter/mouseleave on trigger and tooltip
2. **Focus**: focus/blur on trigger element
3. **Touch**: touchstart with delay timer
4. **Controlled**: open prop overrides all

### Virtual Element Pattern
Creating custom positioning reference:
```javascript
const virtualElement = {
  getBoundingClientRect: () => {
    return new DOMRect(x, y, width, height);
  },
};

<Tooltip
  PopperProps={{
    anchorEl: virtualElement,
  }}
>
  {children}
</Tooltip>
```

### Component Composition
Tooltip integrates multiple systems:
```
Tooltip (orchestrator)
├── Popper (positioning)
│   ├── Portal (DOM placement)
│   └── Grow/Fade/Zoom (animation)
├── Event management (triggers)
├── ARIA attributes (a11y)
└── Theme integration (styling)
```

This architecture provides:
- Separation of concerns
- Testable individual systems
- Flexible customization points
- Reliable cross-browser behavior
