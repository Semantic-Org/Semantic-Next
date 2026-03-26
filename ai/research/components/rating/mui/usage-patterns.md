# MUI - Rating Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-rating/
Status: ✅ Working
Version: Material UI v5/v6 (Current)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Excellent documentation with interactive examples, detailed API reference, customization patterns, accessibility guidance, and TypeScript support. Includes hover feedback demos, icon customization examples, and theming approaches.

## Component Definition
- **Core purpose**: Provides a visual rating input/display using stars or custom icons to capture user feedback or display ratings
- **Mental model**: An interactive input control (like a specialized radio group) where users select a rating value by clicking on star icons, or a read-only display showing existing ratings
- **Semantic meaning**: Communicates quality, satisfaction, or approval levels through a familiar 1-5 star metaphor (configurable to other ranges)

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={4}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Star symbols | ✅ | Native | Default icon is `<Star />` from MUI icons |
| Custom icons | ✅ | Native | Via `icon` and `emptyIcon` props (e.g., hearts, thumbs up) |
| Text labels | ✅ | Composed | Display labels alongside or on hover using state |
| Tooltips | ❌ | Composed | Not built-in, can be added via wrapper components |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Read-only display | ✅ | Native | `readOnly` prop removes all pointer events and hover effects |
| Interactive/Editable | ✅ | Native | Default behavior with `onChange` callback |
| Half-star support | ✅ | Native | `precision={0.5}` for half-star increments |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default/Unselected | ✅ | Native | Shows empty icons (default stars with opacity) |
| Hover state | ✅ | Native | Icons fill on hover, `onChangeActive` tracks hover value |
| Selected state | ✅ | Native | Filled icons up to selected value via `value` prop |
| Disabled | ✅ | Native | `disabled` prop disables all interaction |
| Focus state | ✅ | Native | Automatic focus indicators for keyboard navigation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size="small"`, `"medium"`, `"large"` |
| Color options | ✅ | CSS-only | Via `sx` prop or theme customization (iconFilled, iconHover, iconFocus) |
| Count/Max value | ✅ | Native | `max` prop sets maximum rating value (default 5) |
| Character customization | ✅ | Native | `icon` and `emptyIcon` props accept any React node |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to rate | ✅ | Native | Standard interaction, fires `onChange` with new value |
| Hover preview | ✅ | Native | Icons fill on hover, `onChangeActive` provides hover value |
| Clearable | ⚠️ | Native | Implemented as radio group with hidden "0 stars" option |
| onChange callback | ✅ | Native | `onChange={(event, newValue) => {}}` receives new rating |

## Code Examples

### Basic Rating
```jsx
import Rating from '@mui/material/Rating';

// Controlled rating
<Rating
  name="simple-controlled"
  value={value}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
/>

// Uncontrolled with default value
<Rating name="simple-uncontrolled" defaultValue={2} />
```

### Size Variations
```jsx
// Three built-in sizes
<Rating name="size-small" defaultValue={2} size="small" />
<Rating name="size-medium" defaultValue={2} />
<Rating name="size-large" defaultValue={2} size="large" />

// Custom size via fontSize (recommended for custom icons)
<Rating
  name="custom-size"
  defaultValue={2}
  sx={{ fontSize: '3rem' }}
/>
```

### Read-Only Rating
```jsx
// Display existing rating without interaction
<Rating name="read-only" value={3.5} readOnly />

// With half-star precision
<Rating
  name="half-rating-read"
  defaultValue={2.5}
  precision={0.5}
  readOnly
/>
```

### Disabled State
```jsx
<Rating name="disabled" value={2} disabled />
```

### Half-Star Precision
```jsx
import { useState } from 'react';
import Rating from '@mui/material/Rating';

function HalfRating() {
  const [value, setValue] = useState(2.5);

  return (
    <Rating
      name="half-rating"
      value={value}
      precision={0.5}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    />
  );
}
```

### Hover Feedback with Labels
```jsx
import { useState } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function HoverRating() {
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>
          {labels[hover !== -1 ? hover : value]}
        </Box>
      )}
    </Box>
  );
}
```

### Custom Icons
```jsx
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';

// Using hearts instead of stars
const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

function CustomIconRating() {
  return (
    <StyledRating
      name="customized-color"
      defaultValue={2}
      precision={0.5}
      icon={<FavoriteIcon fontSize="inherit" />}
      emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
    />
  );
}
```

### Custom Max Value
```jsx
// 10-star rating system
<Rating name="customized-10" defaultValue={7} max={10} />

// 3-star rating
<Rating name="customized-3" defaultValue={2} max={3} />
```

### Highlight Selected Only
```jsx
import Rating from '@mui/material/Rating';

// Only the selected icon is highlighted (radio button behavior)
<Rating
  name="highlight-selected-only"
  defaultValue={2}
  highlightSelectedOnly
/>
```

### Custom Icon Container
```jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

function RadioGroupRating() {
  return (
    <Rating
      name="highlight-selected-only"
      defaultValue={2}
      IconContainerComponent={IconContainer}
      getLabelText={(value) => customIcons[value].label}
      highlightSelectedOnly
    />
  );
}
```

### Color Customization
```jsx
import Rating from '@mui/material/Rating';

// Different colors for different states
<Rating
  name="custom-colors"
  defaultValue={3.5}
  precision={0.5}
  sx={{
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
    '& .MuiRating-iconFocus': {
      color: '#ff0000',
    },
  }}
/>
```

### Accessibility with Custom Labels
```jsx
function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${value} out of 5`;
}

<Rating
  name="text-feedback"
  value={value}
  precision={0.5}
  getLabelText={getLabelText}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
/>
```

## Notable Features

### 1. Radio Group Implementation
The Rating component is implemented as a radio group with visually hidden radio buttons. This provides:
- **Native form integration**: Works with standard form submission
- **Keyboard accessibility**: Arrow key navigation between ratings
- **Clear/reset capability**: Hidden radio button for 0 stars allows clearing selection
- **Screen reader support**: Each rating value announced properly

### 2. Precision Control
The `precision` prop enables fine-grained rating control:
- **Full stars**: `precision={1}` (default)
- **Half stars**: `precision={0.5}` (most common)
- **Quarter stars**: `precision={0.25}`
- **Any decimal**: `precision={0.1}` for 0.1 increments

### 3. Hover Feedback System
Advanced hover interaction:
- `onChangeActive` callback fires during hover
- Receives hover value (-1 when not hovering)
- Enables label display during preview
- Visual feedback before commitment

### 4. Icon Flexibility
Complete control over rating icons:
- `icon` prop: Sets filled/active icon
- `emptyIcon` prop: Sets unfilled icon
- Accepts any React node (icons, images, components)
- `IconContainerComponent` for per-value customization

### 5. Size System with Limitations
Three native size options but with caveats:
- Built-in sizes work for default stars
- Custom icons ignore `size` prop
- Use `sx={{ fontSize: '...' }}` for reliable sizing
- fontSize approach works universally

### 6. Highlight Selected Only Mode
Alternative interaction pattern:
- `highlightSelectedOnly` prop changes visual behavior
- Only selected icon fills (like traditional radio buttons)
- Useful for emoji ratings or discrete choices
- Better for non-sequential rating systems

### 7. Read-Only Mode
Two ways to display ratings:
- `readOnly`: Removes interaction, keeps visual style
- Still shows hover effects in CSS (can be overridden)
- Common for displaying existing ratings
- Different from `disabled` which shows disabled state

### 8. Theming Integration
Full Material-UI theme integration:
- Respects color palette
- Responds to light/dark mode
- CSS custom properties for easy theming
- `sx` prop for component-level overrides

### 9. Accessibility Built-In
Comprehensive accessibility:
- `getLabelText` for screen reader announcements
- ARIA attributes automatically applied
- Keyboard navigation via arrow keys
- Visual and shape distinction (color + filled/empty)
- Focus indicators

### 10. Form Integration
Standard form control behavior:
- `name` prop for form field identification
- Works with controlled/uncontrolled patterns
- `defaultValue` for uncontrolled
- `value` + `onChange` for controlled
- Integrates with form libraries (Formik, React Hook Form)

## Research Notes

### Framework Approach
MUI Rating follows Material Design principles but with practical flexibility:
- **Radio group foundation**: Semantic HTML with visual enhancement
- **Prop-driven customization**: Extensive props for common patterns
- **Theme integration**: Consistent with broader MUI system
- **Flexible icons**: Not locked into stars

### API Design Philosophy
- **Precision as configuration**: Single prop controls increment granularity
- **Separate hover callback**: `onChangeActive` distinct from `onChange`
- **Two icon props**: `icon` and `emptyIcon` for clear distinction
- **Size limitations**: Acknowledges custom icon sizing challenges

### Component Architecture
- **Single component**: Rating handles all use cases
- **No separate read-only component**: Mode controlled by prop
- **IconContainerComponent pattern**: Allows per-value icon customization
- **Radio group semantics**: Screen reader and keyboard friendly

### State Management Patterns
- **Controlled mode**: `value` + `onChange` for full control
- **Uncontrolled mode**: `defaultValue` for simpler cases
- **Hover state**: Separate from value state
- **Clear/reset**: Built into radio group (0 stars option)

### Interaction Patterns
1. **Standard rating**: Click to select
2. **Hover preview**: See rating before committing
3. **Keyboard navigation**: Arrow keys to change rating
4. **Clear capability**: Can return to unrated state
5. **Read-only display**: Show without interaction

### Customization Layers
1. **Theme level**: Global Rating styling
2. **Component level**: `sx` prop for one-off styling
3. **Icon level**: Custom icons via props
4. **Container level**: `IconContainerComponent` for per-value icons

### Accessibility Strategy
- Visual distinction through both color AND shape
- Screen reader text via `getLabelText`
- Keyboard navigation via radio group semantics
- Focus indicators automatic
- ARIA attributes applied automatically

## Comparison Insights

### Strengths
1. **Radio group implementation**: Semantic and accessible foundation
2. **Precision prop**: Elegant solution for half/quarter ratings
3. **Hover feedback**: `onChangeActive` enables rich preview UX
4. **Icon flexibility**: Both simple and advanced customization
5. **Read-only mode**: Clean way to display ratings
6. **Clearable by default**: 0 stars option built in
7. **Form integration**: Works like standard input
8. **Theme integration**: Consistent with MUI ecosystem

### Potential Limitations
1. **Size prop limitations**: Doesn't work with custom icons
2. **No built-in tooltips**: Must compose with Tooltip component
3. **Color customization**: Requires `sx` prop or theme, not props
4. **No animated transitions**: State changes are instant
5. **Material Design styling**: Some visual patterns may not fit all designs

### Patterns to Consider for Semantic UI

#### Adopt These Patterns
1. **Precision prop**: Single prop for half/quarter/decimal ratings
2. **onChangeActive**: Separate callback for hover preview
3. **icon/emptyIcon split**: Clear distinction between filled and empty
4. **highlightSelectedOnly**: Alternative interaction mode
5. **getLabelText**: Accessibility-first label function
6. **Radio group semantics**: Screen reader and keyboard friendly
7. **max prop**: Flexible rating scale (not just 5 stars)

#### Improve Upon
1. **Size handling**: Make size work with custom icons
2. **Color props**: Native color prop instead of sx/theme only
3. **Tooltip integration**: Built-in tooltip support
4. **Animation support**: Optional transitions for state changes
5. **Label positioning**: Native label display (not just composed)
6. **Clearable control**: Explicit prop to control clear behavior
7. **Icon per value**: Simpler API than IconContainerComponent

### Questions for Semantic UI Design
1. **Default behavior**: Interactive or read-only as primary use case?
2. **Icon system**: Stars only or built-in alternatives (hearts, thumbs)?
3. **Precision defaults**: Half stars by default or full only?
4. **Clear behavior**: Always clearable or opt-in?
5. **Label display**: Built-in label patterns or composition only?
6. **Animation**: Should rating changes animate?
7. **Color semantics**: Rating-based colors (poor=red, excellent=green)?
8. **Size system**: How to handle custom icon sizing?

## Implementation Details Worth Noting

### Prop Interface
```typescript
interface RatingProps {
  name: string;                          // Required for radio group
  value?: number | null;                  // Controlled value
  defaultValue?: number;                  // Uncontrolled default
  max?: number;                           // Maximum rating (default 5)
  precision?: number;                     // Step increment (default 1)
  size?: 'small' | 'medium' | 'large';   // Size (doesn't work with custom icons)
  readOnly?: boolean;                     // Display only mode
  disabled?: boolean;                     // Disabled state
  onChange?: (event: Event, value: number | null) => void;
  onChangeActive?: (event: Event, value: number) => void;  // Hover callback
  icon?: React.ReactNode;                 // Filled icon
  emptyIcon?: React.ReactNode;           // Empty icon
  IconContainerComponent?: React.ElementType;  // Per-value icon component
  getLabelText?: (value: number) => string;    // Accessibility label function
  highlightSelectedOnly?: boolean;        // Radio button style highlighting
  sx?: SxProps;                          // Styling
}
```

### CSS Classes for Customization
```css
.MuiRating-root { }              /* Root container */
.MuiRating-icon { }              /* Each icon wrapper */
.MuiRating-iconEmpty { }         /* Empty icon state */
.MuiRating-iconFilled { }        /* Filled icon state */
.MuiRating-iconHover { }         /* Hover state */
.MuiRating-iconFocus { }         /* Focus state */
.MuiRating-iconActive { }        /* Active state */
.MuiRating-decimal { }           /* Decimal precision container */
.MuiRating-label { }             /* Radio input label */
.MuiRating-visuallyHidden { }    /* Hidden radio inputs */
```

### Accessibility Attributes
Automatically applied:
```html
<span class="MuiRating-root" role="img" aria-label="3 Stars">
  <label>
    <span class="MuiRating-visuallyHidden">1 Star</span>
    <input type="radio" name="rating" value="1" />
    <span class="MuiRating-icon">★</span>
  </label>
  <!-- Repeated for each rating value -->
</span>
```

### Component Usage Patterns
```jsx
// Display rating (read-only)
<Rating value={product.averageRating} readOnly />

// Collect user feedback (controlled)
const [rating, setRating] = useState(0);
<Rating value={rating} onChange={(e, val) => setRating(val)} />

// Advanced hover feedback
const [value, setValue] = useState(3);
const [hover, setHover] = useState(-1);
<Rating
  value={value}
  onChange={(e, newValue) => setValue(newValue)}
  onChangeActive={(e, newHover) => setHover(newHover)}
/>
<div>{hover !== -1 ? hover : value} stars</div>

// Custom satisfaction rating
<Rating
  max={5}
  IconContainerComponent={SatisfactionIcon}
  highlightSelectedOnly
/>
```
