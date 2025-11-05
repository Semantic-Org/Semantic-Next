# MUI: Skeleton Component Patterns

> Research Date: 2025-11-04
> Framework: Material UI (MUI) v5+
> Component: Skeleton
> URLs Verified: See URL verification section

## Executive Summary

MUI provides a single, flexible **Skeleton** component for creating loading placeholders that improve perceived responsiveness during content loading.

**Key Features**:
- Four shape variants: text, circular, rectangular, rounded
- Three animation types: pulse (default), wave, or none
- Flexible sizing via width/height props or dimension inference
- Extensive customization via sx prop and theme overrides
- Material Design 3 specifications for loading states

**Philosophy**: Display placeholder previews before data loads to reduce load-time frustration and create anticipation of content. Uses minimal luminance for visibility in all conditions.

---

## Component Definition

### Skeleton Component

**Purpose**: Display a placeholder preview of your content before data loads to reduce load-time frustration

**Mental Model**: Skeleton screens provide an alternative to traditional spinners by showing the shape of content that's about to appear. Think of it as a "ghost" of your UI that gradually materializes into real content.

**Semantic Meaning**: Skeletons communicate:
- Content is actively loading (not an error state)
- The approximate shape and structure of incoming content
- Progress is happening (through animation)
- Expected layout to reduce layout shift

**Use Cases**:
- Loading states for cards, lists, and grids
- Avatar placeholders during image loading
- Text content loading (articles, comments, descriptions)
- Complex layouts (YouTube video cards, Facebook feeds)
- Dashboard widgets loading data
- Profile information loading
- Media galleries loading images

---

## Pattern Analysis

### Variants (Shape Types)

**Support Level**: Level 1 (Universal)

MUI Skeleton provides four distinct shape variants to match different content types:

#### Text Variant (Default)

The `text` variant represents a single line of text with adjustable height via font-size.

```jsx
import Skeleton from '@mui/material/Skeleton';

// Basic text skeleton
<Skeleton />

// Custom height via fontSize
<Skeleton sx={{ fontSize: '1rem' }} />
<Skeleton sx={{ fontSize: '2rem' }} />

// Multiple lines
<Box>
  <Skeleton />
  <Skeleton animation="wave" />
  <Skeleton animation={false} />
</Box>

// Paragraph simulation
<Box sx={{ width: '100%' }}>
  <Skeleton />
  <Skeleton />
  <Skeleton width="60%" />
</Box>
```

**Key Characteristics**:
- Default variant when none specified
- Height is set using `em` units (typography-relative)
- Automatically adjusts to font size
- Perfect for simulating text content
- Works well for multiple consecutive lines

#### Circular Variant

The `circular` variant is used for avatar and icon placeholders.

```jsx
// Basic circular skeleton
<Skeleton variant="circular" width={40} height={40} />

// Avatar sizes
<Skeleton variant="circular" width={24} height={24} />  // Small
<Skeleton variant="circular" width={40} height={40} />  // Medium
<Skeleton variant="circular" width={56} height={56} />  // Large

// Can infer dimensions from children
<Skeleton variant="circular">
  <Avatar />
</Skeleton>
```

**Key Characteristics**:
- Requires explicit width and height (equal for perfect circle)
- Common for user avatars
- Can wrap Avatar component to infer dimensions
- Maintains circular shape at any size

#### Rectangular Variant

The `rectangular` variant is for rectangular content blocks like images and cards.

```jsx
// Basic rectangular skeleton
<Skeleton variant="rectangular" width={210} height={118} />

// Image placeholder
<Skeleton variant="rectangular" width="100%" height={200} />

// Card image placeholder
<Card sx={{ maxWidth: 345 }}>
  <Skeleton
    variant="rectangular"
    width={345}
    height={140}
  />
  <CardContent>
    <Skeleton />
    <Skeleton width="60%" />
  </CardContent>
</Card>

// YouTube video thumbnail
<Skeleton variant="rectangular" width={210} height={118} />
```

**Key Characteristics**:
- Sharp corners (no border-radius)
- Requires explicit dimensions
- Perfect for image placeholders
- Common for video thumbnails and card headers

#### Rounded Variant

The `rounded` variant provides rectangles with rounded corners.

```jsx
// Basic rounded skeleton
<Skeleton variant="rounded" width={210} height={60} />

// Button placeholder
<Skeleton
  variant="rounded"
  width={100}
  height={40}
  sx={{ borderRadius: '8px' }}
/>

// Card with rounded corners
<Skeleton
  variant="rounded"
  width="100%"
  height={200}
/>
```

**Key Characteristics**:
- Default border-radius applied
- More modern, softer appearance
- Customizable border-radius via sx prop
- Good for buttons, chips, and modern card designs

### Variant Comparison

| Variant | Use Case | Dimensions Required | Border Radius |
|---------|----------|---------------------|---------------|
| `text` | Text lines | No (uses fontSize) | Default (small) |
| `circular` | Avatars, icons | Yes (width = height) | 50% |
| `rectangular` | Images, cards | Yes | 0 |
| `rounded` | Buttons, modern cards | Yes | Default theme value |

---

## Animation Types

**Support Level**: Level 1 (Universal)

MUI Skeleton supports three animation modes to indicate loading progress:

### Pulse Animation (Default)

The pulse animation creates a fading in-and-out effect.

```jsx
// Pulse is the default
<Skeleton />

// Explicitly set pulse
<Skeleton animation="pulse" />

// Pulse with different variants
<Skeleton variant="text" animation="pulse" />
<Skeleton variant="circular" width={40} height={40} animation="pulse" />
<Skeleton variant="rectangular" width={210} height={118} animation="pulse" />
```

**Characteristics**:
- Default when animation prop not specified
- Background color fades between two opacity levels
- Subtle, less distracting than wave
- Works with all variants
- Works reliably with custom background colors

### Wave Animation

The wave animation flows from left to right across the skeleton.

```jsx
// Wave animation
<Skeleton animation="wave" />

// Wave with variants
<Skeleton variant="rectangular" animation="wave" width={500} height={250} />
<Skeleton variant="circular" animation="wave" width={40} height={40} />

// Multiple skeletons with wave
<Box>
  <Skeleton animation="wave" />
  <Skeleton animation="wave" />
  <Skeleton animation="wave" width="60%" />
</Box>
```

**Characteristics**:
- Flowing left-to-right gradient effect
- More visually dynamic than pulse
- Creates sense of progressive loading
- **Known Issue**: May become invisible with custom background colors
- Recommended: Use pulse animation if applying custom backgroundColor

### No Animation

Disable animation entirely for static placeholders.

```jsx
// No animation
<Skeleton animation={false} />

// Static skeletons for performance
<Skeleton variant="rectangular" animation={false} width={210} height={118} />

// Mixed animations in one view
<Box>
  <Skeleton />  {/* pulse */}
  <Skeleton animation="wave" />
  <Skeleton animation={false} />
</Box>
```

**Characteristics**:
- Static placeholder (no movement)
- Better performance when many skeletons present
- Useful for print views or screenshots
- Still provides visual placeholder benefit
- May feel less "alive" to users

### Animation Comparison

| Animation | Visual Effect | Performance | Custom Colors | Best For |
|-----------|--------------|-------------|---------------|----------|
| `pulse` (default) | Fading in/out | Good | ✅ Works well | General use, custom styling |
| `wave` | Left-to-right flow | Good | ⚠️ May have issues | Standard theme colors, dynamic feel |
| `false` | Static | Best | ✅ Works well | Many skeletons, performance-critical |

---

## Dimension Control

**Support Level**: Level 1 (Universal)

MUI Skeleton offers multiple strategies for controlling dimensions:

### Explicit Width and Height Props

The most straightforward approach uses width and height props:

```jsx
// Number values (pixels)
<Skeleton width={100} height={50} />
<Skeleton variant="circular" width={40} height={40} />

// String values (CSS units)
<Skeleton width="100%" height={200} />
<Skeleton width="50vw" height="30vh" />
<Skeleton width="20rem" height="10rem" />

// Responsive sizing
<Skeleton
  width={{ xs: '100%', sm: 400, md: 600 }}
  height={200}
/>
```

**Pros**:
- Explicit and predictable
- Supports any CSS unit
- Required for circular, rectangular, and rounded variants
- Responsive values supported

**Cons**:
- Need to specify dimensions for each skeleton
- Requires knowing exact sizes ahead of time

### Inferring Dimensions from Children

The `text` variant can infer dimensions from child components:

```jsx
// Infer from Avatar
<Skeleton variant="circular">
  <Avatar />
</Skeleton>

// Infer from Typography
<Skeleton variant="text">
  <Typography variant="h1">.</Typography>
</Skeleton>

// Works with custom components
<Skeleton variant="rectangular">
  <img
    src="placeholder.jpg"
    alt=""
    style={{ width: 210, height: 118 }}
  />
</Skeleton>
```

**Pros**:
- Don't need to repeat dimensions
- Automatically matches component size
- Reduces maintenance when sizes change

**Cons**:
- **Important Limitation**: Reliable only for `text` variant
- Other variants may not infer correctly (known issue #38190)
- Children still need explicit dimensions

### Using fontSize for Text Variant

The text variant's height adjusts via font-size:

```jsx
// Using sx prop
<Skeleton sx={{ fontSize: '1rem' }} />    // Small
<Skeleton sx={{ fontSize: '2rem' }} />    // Medium
<Skeleton sx={{ fontSize: '3rem' }} />    // Large

// Matching Typography variants
<Skeleton sx={{ fontSize: 'h1.fontSize' }} />
<Skeleton sx={{ fontSize: 'h3.fontSize' }} />
<Skeleton sx={{ fontSize: 'body1.fontSize' }} />

// Direct fontSize value
<Skeleton sx={{ fontSize: 16 }} />
<Skeleton sx={{ fontSize: 24 }} />
```

**Pros**:
- Natural for text content
- Uses em units (typography-relative)
- Matches Typography component sizing
- Responsive to font-size changes

**Cons**:
- Only applies to text variant
- Width still needs to be set separately

### Full Width Pattern

Common pattern for full-width skeletons:

```jsx
// Full width text
<Box sx={{ width: '100%' }}>
  <Skeleton />
  <Skeleton />
  <Skeleton width="60%" />  {/* Last line shorter */}
</Box>

// Full width rectangular
<Skeleton variant="rectangular" width="100%" height={200} />

// Responsive full width
<Box sx={{ width: { xs: '100%', md: '80%' } }}>
  <Skeleton />
</Box>
```

---

## Styling and Customization

**Support Level**: Level 1 (Universal)

MUI Skeleton provides extensive customization options:

### Using the sx Prop

The `sx` prop provides the most flexible styling approach:

```jsx
// Custom background color
<Skeleton
  sx={{
    bgcolor: 'grey.300'
  }}
/>

// Theme palette colors
<Skeleton sx={{ bgcolor: 'primary.main' }} />
<Skeleton sx={{ bgcolor: 'text.secondary' }} />

// Custom border radius
<Skeleton
  variant="rectangular"
  width={210}
  height={118}
  sx={{ borderRadius: 2 }}  // theme.spacing(2)
/>

// Multiple style properties
<Skeleton
  sx={{
    bgcolor: 'grey.200',
    borderRadius: '8px',
    opacity: 0.7,
    transform: 'scale(0.95)'
  }}
/>

// Responsive styles
<Skeleton sx={{
  bgcolor: { xs: 'grey.200', md: 'grey.300' },
  height: { xs: 100, md: 150 }
}} />
```

**Available Style Properties**:
- `bgcolor` / `backgroundColor`: Change skeleton color
- `borderRadius`: Customize corner rounding
- `opacity`: Adjust transparency
- `transform`: Apply transformations
- Any CSS property via sx prop

### Custom Background Colors

Change skeleton color to match your design:

```jsx
// Light background
<Skeleton sx={{ bgcolor: 'grey.100' }} />

// Dark background
<Skeleton sx={{ bgcolor: 'grey.800' }} />

// Branded color
<Skeleton sx={{ bgcolor: 'primary.light' }} />

// Custom hex color
<Skeleton sx={{ bgcolor: '#f0f0f0' }} />

// Gradient background (advanced)
<Skeleton sx={{
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
}} />
```

**Important Considerations**:
- Pulse animation works with all custom colors
- Wave animation may become invisible with custom colors
- Use pulse animation when applying custom backgroundColor
- Ensure sufficient contrast with surrounding content

### Dark Mode Support

Skeleton automatically adapts to theme mode:

```jsx
// Automatic dark mode support
<Skeleton />  // Uses theme.palette.background

// Explicit dark mode styling
<Skeleton
  sx={{
    bgcolor: (theme) =>
      theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300'
  }}
/>

// Using theme-aware colors
<Skeleton sx={{ bgcolor: 'background.paper' }} />
<Skeleton sx={{ bgcolor: 'action.hover' }} />
```

**Default Dark Mode Behavior**:
- Light mode: `rgba(text.primary / 0.11)`
- Dark mode: `rgba(text.primary / 0.13)`
- Slightly higher luminance in dark mode for visibility

### Component Prop

Change the underlying HTML element:

```jsx
// Default is span
<Skeleton />

// Render as div
<Skeleton component="div" />

// Render as custom component
<Skeleton component={Box} />

// With additional props
<Skeleton
  component="div"
  role="status"
  aria-label="Loading content"
/>
```

---

## Complex Loading Patterns

**Support Level**: Level 1 (Universal)

Real-world applications require combining multiple skeletons:

### YouTube Video Card Pattern

Complete video card with thumbnail, title, and metadata:

```jsx
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function VideoCardSkeleton() {
  return (
    <Box sx={{ width: 210, marginRight: 2, my: 2 }}>
      {/* Thumbnail */}
      <Skeleton variant="rectangular" width={210} height={118} />

      {/* Video info */}
      <Box sx={{ pt: 0.5 }}>
        {/* Title (2 lines) */}
        <Skeleton />
        <Skeleton width="60%" />
      </Box>
    </Box>
  );
}

// List of video cards
function VideoGridSkeleton({ count = 6 }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {Array.from(new Array(count)).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </Box>
  );
}
```

### Facebook Post Pattern

Complete social media post structure:

```jsx
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';

function PostSkeleton() {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardHeader
        avatar={
          <Skeleton variant="circular" width={40} height={40} />
        }
        title={
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="60%" />
        }
        subheader={
          <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="40%" />
        }
      />

      <Skeleton variant="rectangular" height={194} />

      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="60%" />
      </CardContent>
    </Card>
  );
}
```

### Product Card Pattern

E-commerce product card with image, title, price:

```jsx
function ProductCardSkeleton() {
  return (
    <Card sx={{ width: 300, m: 2 }}>
      {/* Product image */}
      <Skeleton variant="rectangular" height={300} />

      <CardContent>
        {/* Product title */}
        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="80%" />

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
              variant="circular"
              width={20}
              height={20}
              sx={{ mr: 0.5 }}
            />
          ))}
        </Box>

        {/* Price */}
        <Skeleton
          variant="text"
          sx={{ fontSize: '1.5rem', mt: 1 }}
          width="40%"
        />

        {/* Button */}
        <Skeleton
          variant="rounded"
          height={40}
          sx={{ mt: 2 }}
        />
      </CardContent>
    </Card>
  );
}
```

### User Profile Pattern

Profile with avatar, name, bio, and stats:

```jsx
function ProfileSkeleton() {
  return (
    <Box sx={{ p: 3, maxWidth: 400 }}>
      {/* Avatar and name */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width="70%" />
          <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="50%" />
        </Box>
      </Box>

      {/* Bio */}
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="60%" />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="80%" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="60%" />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="80%" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="60%" />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="80%" />
        </Box>
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
      </Box>
    </Box>
  );
}
```

### Dashboard Widget Pattern

Data visualization placeholder:

```jsx
function DashboardWidgetSkeleton() {
  return (
    <Card sx={{ p: 2, height: 400 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="40%" />
        <Skeleton variant="rounded" width={100} height={32} />
      </Box>

      {/* Chart area */}
      <Skeleton variant="rectangular" height={250} sx={{ mb: 2 }} />

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Array.from(new Array(4)).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={12} height={12} sx={{ mr: 1 }} />
            <Skeleton variant="text" width={60} />
          </Box>
        ))}
      </Box>
    </Card>
  );
}
```

### List Pattern

Generic list with items:

```jsx
function ListSkeleton({ items = 5 }) {
  return (
    <Box>
      {Array.from(new Array(items)).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="70%" />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="50%" />
          </Box>
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
      ))}
    </Box>
  );
}
```

---

## Progressive Loading Pattern

**Support Level**: Level 2 (Common)

Show content as it loads, replacing skeletons incrementally:

### Basic Progressive Loading

```jsx
import { useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

function MediaCard({ loading = true, item }) {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {loading ? (
        <Skeleton variant="rectangular" height={140} />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image={item.src}
          alt={item.title}
        />
      )}

      <CardContent>
        {loading ? (
          <>
            <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="60%" />
          </>
        ) : (
          <>
            <Typography variant="h5" component="div">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Usage
function MediaGrid() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {loading ? (
        Array.from(new Array(6)).map((_, index) => (
          <MediaCard key={index} loading={true} />
        ))
      ) : (
        items.map((item) => (
          <MediaCard key={item.id} loading={false} item={item} />
        ))
      )}
    </Box>
  );
}
```

### Lazy Image Loading with Skeleton

```jsx
function LazyImageSkeleton({ src, alt, width, height }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box sx={{ position: 'relative', width, height }}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width,
          height,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
      />
    </Box>
  );
}
```

### Incremental List Loading

```jsx
function IncrementalList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading items one by one
    const loadItems = async () => {
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setItems(prev => [...prev, { id: i, title: `Item ${i}` }]);
      }
      setLoading(false);
    };
    loadItems();
  }, []);

  return (
    <Box>
      {items.map(item => (
        <ListItem key={item.id}>
          <ListItemText primary={item.title} />
        </ListItem>
      ))}

      {loading && (
        <>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
        </>
      )}
    </Box>
  );
}
```

---

## Theme Integration

**Support Level**: Level 1 (Universal)

MUI Skeleton integrates deeply with the theme system:

### Global Theme Customization

Override default skeleton styles globally:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',  // Change default animation
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          borderRadius: 4,
        },
        text: {
          borderRadius: 4,
        },
        rectangular: {
          borderRadius: 0,
        },
        rounded: {
          borderRadius: 8,
        },
        circular: {
          // Circular already has 50% borderRadius
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Custom Skeleton Variants

Create custom skeleton variants via theme:

```jsx
const theme = createTheme({
  components: {
    MuiSkeleton: {
      variants: [
        {
          props: { variant: 'card' },
          style: {
            borderRadius: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
          },
        },
        {
          props: { variant: 'button' },
          style: {
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          },
        },
      ],
    },
  },
});

// Usage
<Skeleton variant="card" width={300} height={200} />
<Skeleton variant="button" width={120} />
```

### Theme Mode Adaptation

Automatically adapt to light/dark mode:

```jsx
const theme = createTheme({
  palette: {
    mode: 'dark',  // or 'light'
  },
  components: {
    MuiSkeleton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.13)'
            : 'rgba(0, 0, 0, 0.11)',
        }),
      },
    },
  },
});
```

---

## Accessibility

**Support Level**: Level 2 (Common)

MUI Skeleton includes accessibility considerations:

### ARIA Attributes

Add appropriate ARIA labels for screen readers:

```jsx
// Basic loading indicator
<Skeleton role="status" aria-label="Loading content" />

// Specific content type
<Skeleton
  role="status"
  aria-label="Loading user profile"
  variant="circular"
  width={40}
  height={40}
/>

// Live region for dynamic content
<Box role="region" aria-live="polite" aria-label="Content loading">
  <Skeleton />
  <Skeleton />
  <Skeleton width="60%" />
</Box>
```

### Screen Reader Announcements

Properly announce loading states:

```jsx
function AccessibleSkeleton({ loading, content, label }) {
  return (
    <>
      {loading ? (
        <Box
          role="status"
          aria-live="polite"
          aria-label={`Loading ${label}`}
        >
          <Skeleton />
          <span className="sr-only">Loading {label}</span>
        </Box>
      ) : (
        <div aria-live="polite">
          {content}
          <span className="sr-only">{label} loaded</span>
        </div>
      )}
    </>
  );
}
```

### Focus Management

Handle focus during loading transitions:

```jsx
function FocusAwareSkeleton({ loading, children }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!loading && contentRef.current) {
      // Announce content loaded
      contentRef.current.focus();
    }
  }, [loading]);

  return loading ? (
    <Skeleton role="status" aria-label="Loading content" />
  ) : (
    <div ref={contentRef} tabIndex={-1}>
      {children}
    </div>
  );
}
```

### Best Practices

- Use `role="status"` to indicate loading state
- Provide descriptive `aria-label` when loading specific content
- Use `aria-live="polite"` for dynamic loading regions
- Include visually hidden text for screen readers
- Manage focus when content becomes available
- Ensure skeleton maintains document structure
- Test with screen readers (NVDA, JAWS, VoiceOver)

---

## Performance Considerations

**Support Level**: Level 2 (Common)

Optimize skeleton loading for best performance:

### Animation Performance

```jsx
// Disable animations for many skeletons
function HighPerformanceGrid({ count = 100 }) {
  return (
    <Grid container>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Skeleton
            variant="rectangular"
            height={200}
            animation={false}  // Better performance
          />
        </Grid>
      ))}
    </Grid>
  );
}
```

### Virtualization with Skeletons

Combine with react-window for large lists:

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedSkeleton({ itemCount = 1000 }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Box sx={{ display: 'flex', p: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="70%" />
          <Skeleton width="50%" />
        </Box>
      </Box>
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={itemCount}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Memoization

Prevent unnecessary re-renders:

```jsx
import { memo } from 'react';

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <Card sx={{ width: 300, m: 2 }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton />
        <Skeleton width="60%" />
      </CardContent>
    </Card>
  );
});

function SkeletonGrid({ count }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {Array.from(new Array(count)).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Box>
  );
}
```

### Lazy Loading

Only render skeletons when needed:

```jsx
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function LazyLoadedContent() {
  return (
    <Suspense fallback={
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={400} />
        <Skeleton sx={{ mt: 2 }} />
        <Skeleton width="60%" />
      </Box>
    }>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## Migration Guide (v4 → v5)

**Support Level**: Level 1 (Universal - for existing v4 users)

MUI Skeleton moved from Lab to Core in v5 with breaking changes:

### Import Changes

```jsx
// v4 (from Lab)
import Skeleton from '@mui/lab/Skeleton';

// v5 (from Material)
import Skeleton from '@mui/material/Skeleton';
// or
import { Skeleton } from '@mui/material';
```

### Variant Name Changes

```jsx
// v4 - Old variant names
<Skeleton variant="circle" />
<Skeleton variant="rect" />

// v5 - New variant names
<Skeleton variant="circular" />
<Skeleton variant="rectangular" />
```

### CSS Class Name Changes

```jsx
// v4
<Skeleton
  classes={{
    circle: 'custom-circle-class',
    rect: 'custom-rect-class'
  }}
/>

// v5
<Skeleton
  classes={{
    circular: 'custom-circle-class',
    rectangular: 'custom-rect-class'
  }}
/>
```

### Theme Override Changes

```jsx
// v4
const theme = createTheme({
  overrides: {
    MuiSkeleton: {
      circle: { /* styles */ },
      rect: { /* styles */ },
    },
  },
});

// v5
const theme = createTheme({
  components: {
    MuiSkeleton: {
      styleOverrides: {
        circular: { /* styles */ },
        rectangular: { /* styles */ },
      },
    },
  },
});
```

### Automated Migration

MUI provides codemods to automate migration:

```bash
npx @mui/codemod@latest v5.0.0/preset-safe <path>
```

### Migration Checklist

- ✅ Update imports from `@mui/lab` to `@mui/material`
- ✅ Rename `variant="circle"` to `variant="circular"`
- ✅ Rename `variant="rect"` to `variant="rectangular"`
- ✅ Update CSS class names in `classes` prop
- ✅ Update theme overrides to v5 structure
- ✅ Test all skeleton instances
- ✅ Verify animations still work as expected
- ✅ Check dark mode styling

---

## Code Examples

### Basic Examples

```jsx
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

// Text skeletons
function TextSkeletons() {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );
}

// Shape variants
function ShapeVariants() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Box>
  );
}

// Custom sizing
function CustomSizes() {
  return (
    <Box>
      <Skeleton sx={{ fontSize: '1rem' }} />
      <Skeleton sx={{ fontSize: '2rem' }} />
      <Skeleton sx={{ fontSize: '3rem' }} />
    </Box>
  );
}
```

### Advanced Examples

```jsx
// Complete media card
function MediaCardExample() {
  const [loading, setLoading] = useState(true);

  return (
    <Card sx={{ maxWidth: 345 }}>
      {loading ? (
        <Skeleton variant="rectangular" height={140} />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image="image.jpg"
          alt="Content"
        />
      )}

      <CardContent>
        {loading ? (
          <>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </>
        ) : (
          <>
            <Typography variant="h5">Title</Typography>
            <Typography variant="body2">Description</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Custom styled skeleton
function StyledSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={210}
      height={118}
      sx={{
        bgcolor: 'grey.200',
        borderRadius: 2,
        '&::after': {
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        }
      }}
    />
  );
}

// Responsive skeleton grid
function ResponsiveGrid() {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton />
              <Skeleton width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
```

---

## Common Patterns and Recipes

### Pattern: Loading Button

```jsx
function LoadingButton({ loading, onClick, children }) {
  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Skeleton width={60} />
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}
```

### Pattern: Skeleton with Fade-in

```jsx
function FadeInContent({ loading, children }) {
  return (
    <Fade in={!loading} timeout={500}>
      <Box>
        {loading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : (
          children
        )}
      </Box>
    </Fade>
  );
}
```

### Pattern: Infinite Scroll Loading

```jsx
function InfiniteScrollSkeleton({ hasMore }) {
  return hasMore ? (
    <Box sx={{ py: 2 }}>
      {Array.from(new Array(3)).map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={100} />
          <Skeleton sx={{ mt: 1 }} />
          <Skeleton width="60%" />
        </Box>
      ))}
    </Box>
  ) : null;
}
```

### Pattern: Table Loading

```jsx
function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from(new Array(columns)).map((_, index) => (
              <TableCell key={index}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(new Array(rows)).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from(new Array(columns)).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

---

## Material Design Specifications

**Support Level**: Level 1 (Universal)

MUI Skeleton follows Material Design guidelines for loading states:

### Visual Design Principles

**Luminance Strategy**:
- Uses minimal luminance for visibility in all conditions
- Light mode: `rgba(0, 0, 0, 0.11)` - 11% black opacity
- Dark mode: `rgba(255, 255, 255, 0.13)` - 13% white opacity
- Slightly higher luminance in dark mode for better contrast

**Shape Guidelines**:
- Match the shape of content being loaded
- Use circular for avatars and icons
- Use rectangular for images and media
- Use text variant for typography
- Use rounded for modern card designs and buttons

**Animation Guidelines**:
- Pulse: Subtle, less distracting, good for static layouts
- Wave: Dynamic, conveys progress, good for feeds
- No animation: Best for many simultaneous skeletons

### User Experience Guidelines

**When to Use Skeletons**:
- Initial page load with visible content area
- Lazy loading images and media
- Infinite scroll and pagination
- Data fetching after user interaction
- Component-level async operations

**When NOT to Use Skeletons**:
- Very fast operations (< 300ms)
- Full-page initial loads (consider spinner)
- Error states (show error message instead)
- Background updates without UI changes

**Best Practices**:
- Match skeleton structure to actual content
- Keep skeleton shapes simple and clear
- Use consistent animation across the interface
- Ensure smooth transition from skeleton to content
- Don't show skeletons for too long (> 10s)
- Provide fallback for very slow loading

### Layout Considerations

**Prevent Layout Shift**:
```jsx
// Skeleton dimensions match actual content
<Skeleton
  variant="rectangular"
  width={210}  // Same as image
  height={118} // Same as image
/>
```

**Maintain Structure**:
```jsx
// Skeleton maintains the same layout structure
<Box sx={{ display: 'flex', gap: 2 }}>
  <Skeleton variant="circular" width={40} height={40} />
  <Box sx={{ flex: 1 }}>
    <Skeleton />
    <Skeleton width="60%" />
  </Box>
</Box>
```

---

## URL Verification

### Documentation URLs

**Successfully Researched** (via WebSearch):
- ✅ https://mui.com/material-ui/api/skeleton/ - API Reference
- ✅ https://mui.com/material-ui/react-skeleton/ - Component Documentation
- ✅ https://v4.mui.com/api/skeleton/ - v4 API Reference
- ✅ https://v4.mui.com/components/skeleton/ - v4 Documentation

### Access Method

- **WebFetch**: Blocked due to network/security policies
- **WebSearch**: Successfully gathered comprehensive information from:
  - Official MUI documentation search results
  - GitHub repository markdown files
  - Community tutorials and examples
  - Stack Overflow discussions
  - Migration guides and changelogs
  - Educational platforms (educative.io, kombai.com, etc.)

### Information Completeness

Despite WebFetch limitations, comprehensive information was gathered through:
- Multiple targeted web searches covering:
  - API props and variants
  - Animation types and behavior
  - Code examples and patterns
  - Material Design specifications
  - Theme customization
  - Migration guides
  - Accessibility considerations
  - Performance patterns
  - Real-world usage examples

**Confidence Level**: High - Information cross-referenced across multiple authoritative sources including official documentation, GitHub source, and community examples.

---

## Summary and Recommendations

### Component Summary

**Strengths**:
- Simple, single-component API
- Four well-defined shape variants (text, circular, rectangular, rounded)
- Three animation options (pulse, wave, false)
- Flexible dimension control (explicit props, fontSize, children inference)
- Excellent theme integration
- Automatic dark mode support
- Extensive customization via sx prop
- Material Design aligned
- Performance-optimized animations
- Works with React Suspense

**Limitations**:
- Dimension inference only reliable for text variant
- Wave animation issues with custom background colors
- No built-in compound patterns (must compose manually)
- No loading state management built-in
- Requires manual orchestration for complex loading patterns

**Best For**:
- Loading states for any content type
- Image and media placeholders
- Text content loading
- List and grid loading states
- Card and widget loading
- Progressive loading patterns
- Lazy loading implementations

### Key Patterns to Adopt

**Level 1 (Must Have) - Universal Standards**:
1. Four shape variants system (text, circular, rectangular, rounded)
2. Animation control (pulse, wave, none)
3. Explicit width/height props
4. sx prop customization pattern
5. Theme integration
6. Dark mode support

**Level 2 (Should Have) - Common Patterns**:
1. fontSize-based sizing for text variant
2. Children inference pattern (with caveats)
3. Complex loading compositions (cards, lists, grids)
4. Progressive loading pattern
5. Accessibility attributes (role, aria-label)
6. Memoization for performance

**Level 3 (Nice to Have) - Moderate Adoption**:
1. Custom variants via theme
2. Global theme overrides
3. Fade-in transitions
4. Lazy image loading integration

**Level 4 (Optional) - Specialized**:
1. Virtualization integration
2. Infinite scroll patterns
3. Suspense fallback patterns

### Semantic UI Integration Recommendations

**Core API Patterns**:
```jsx
// Adopt MUI's variant system
<ui-skeleton variant="text" />
<ui-skeleton variant="circular" width="40" height="40" />
<ui-skeleton variant="rectangular" width="210" height="118" />
<ui-skeleton variant="rounded" width="210" height="60" />

// Adopt animation control
<ui-skeleton animation="pulse" />  // default
<ui-skeleton animation="wave" />
<ui-skeleton animation="false" />

// Adopt dimension control
<ui-skeleton width="100%" height="200" />
<ui-skeleton style="font-size: 2rem" />  // for text variant
```

**Key Implementation Decisions**:

1. **Variant System**: Adopt all four variants as they cover the main use cases
2. **Animation**: Implement pulse and wave, make pulse default for reliability
3. **Sizing**: Support width/height props AND fontSize-based sizing for text
4. **Customization**: Use Semantic UI's design token system instead of sx prop
5. **Composition**: Provide examples but let users compose their own patterns
6. **Accessibility**: Build in proper ARIA attributes by default

**Semantic UI Enhancements**:
1. Add natural language variants: `<ui-skeleton text />`, `<ui-skeleton circular />`
2. Provide common pattern components: `<ui-skeleton-card>`, `<ui-skeleton-list>`
3. Built-in loading state management via settings
4. Better children inference across all variants
5. Smooth fade-in transition built-in

**Implementation Priorities**:
1. **Must Have**: Basic variants, animations, dimension control, theme integration
2. **Should Have**: Complex compositions, progressive loading, accessibility
3. **Nice to Have**: Custom variants, advanced theme overrides, transitions
4. **Future**: Virtualization helpers, built-in loading orchestration

### Notable Features and Innovations

**MUI Innovations**:
- Text variant with fontSize-based sizing (elegant for typography)
- Children dimension inference (though limited to text variant)
- Wave animation (unique visual effect)
- Minimal luminance strategy for universal visibility
- Seamless theme integration

**Potential Semantic UI Improvements**:
- More reliable dimension inference across all variants
- Built-in compound patterns (card, list, grid skeletons)
- Loading state management integration
- Smoother skeleton-to-content transitions
- Natural language API enhancements

This research provides a solid foundation for implementing a skeleton/placeholder component in Semantic UI that aligns with Material Design principles while enhancing the natural language philosophy of the framework.
