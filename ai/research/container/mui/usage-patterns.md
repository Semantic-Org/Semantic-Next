# Material-UI (MUI) - Container Component Usage Patterns

## Research Metadata
- **Framework**: Material-UI (MUI) v5+
- **Component**: Container
- **Documentation URL**: https://mui.com/material-ui/react-container/
- **API Documentation URL**: https://mui.com/material-ui/api/container/
- **Research Date**: 2025-11-04
- **URL Status**: Accessible

---

## Component Definition

### Container Component
**Purpose**: A fundamental layout component that centers content horizontally and manages maximum width based on responsive breakpoints.

**Mental Model**: Container is a **layout wrapper** component designed to:
- Center content horizontally within the viewport
- Constrain maximum width based on breakpoint specifications
- Provide consistent horizontal padding (gutters) across all screen sizes
- Create responsive layouts that adapt to different device widths
- Serve as the foundational layout element for page content

**Key Characteristic**: The Container is the most basic layout element in Material-UI. It's typically the outermost layout component, wrapping page content to provide horizontal centering and responsive width constraints.

---

## Material Design Philosophy

MUI Container follows Material Design layout specifications:
- **Fluid by Default**: Adapts width to viewport while respecting maxWidth limits
- **Fixed Option**: Maintains constant width per breakpoint for stable layouts
- **Responsive Breakpoints**: Aligns with Material Design breakpoint system
- **Gutter System**: Provides consistent 24px horizontal padding by default
- **Progressive Enhancement**: Works across all device sizes from mobile to desktop
- **Accessibility**: Maintains readable line lengths and proper content spacing
- **Composition**: Designed to work seamlessly with Grid, Box, and other layout components

### Material Design 3 Layout Principles
Material Design 3 emphasizes:
- Adaptive layouts that respond to different breakpoints
- Canonical layout patterns rather than rigid grid systems
- Flexible spacing methods that adjust to screen size
- Content-first approach with appropriate constraints

---

## Container Variants & Modes

### 1. **Fluid Container** (Level 1 - Core)
**Support**: Full (Default behavior)
**Description**: Container that adapts its width to the viewport while respecting maxWidth constraints

```jsx
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function FluidContainer() {
  return (
    <Container>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <h1>Fluid Container</h1>
        <p>This container adapts to viewport width up to maxWidth limit (default: lg = 1200px)</p>
      </Box>
    </Container>
  );
}
```

**Behavior**:
- Width adjusts fluidly with viewport resizing
- Never exceeds maxWidth value
- Maintains 24px padding (gutters) on left and right
- Default maxWidth: `'lg'` (1200px)
- Horizontally centered via `margin: 0 auto`

**Use Cases**:
- Standard page layouts
- Content areas that need to adapt smoothly to different screen sizes
- Applications prioritizing fluid responsiveness over fixed widths

### 2. **Fixed Container** (Level 1 - Core)
**Support**: Full
**Description**: Container with constant width at each breakpoint, only changing when crossing breakpoint thresholds

```jsx
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function FixedContainer() {
  return (
    <Container fixed>
      <Box sx={{ bgcolor: '#e8f5e9', height: '100vh' }}>
        <h1>Fixed Container</h1>
        <p>This container maintains constant width at each breakpoint</p>
      </Box>
    </Container>
  );
}
```

**Behavior**:
- Width remains constant within each breakpoint range
- Changes only when crossing breakpoint thresholds
- Provides stable, predictable layout
- Width jumps discretely rather than transitioning smoothly
- Still includes 24px gutters unless disabled

**Use Cases**:
- Layouts requiring stable, non-fluid widths
- Applications where content shouldn't reflow during minor viewport changes
- Designs with precise alignment requirements across breakpoints
- Dashboard layouts with fixed column structures

---

## Container API Props

### Core Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **maxWidth** | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| false \| string` | `'lg'` | Maximum width constraint at different breakpoints | Level 1 |
| **fixed** | `boolean` | `false` | If true, uses fixed width at each breakpoint instead of fluid | Level 1 |
| **disableGutters** | `boolean` | `false` | If true, removes left and right padding | Level 1 |
| **component** | `elementType` | `'div'` | Component used for the root node | Level 1 |
| **sx** | `object \| function` | - | System prop for custom styling | Level 1 |
| **children** | `ReactNode` | - | Content to be constrained and centered | Level 1 |

### Styling Props

| Prop | Type | Default | Description | Support Level |
|------|------|---------|-------------|---------------|
| **classes** | `object` | - | Override or extend component styles | Level 2 |

---

## maxWidth Breakpoint Specifications

### Breakpoint Values and Behavior

The `maxWidth` prop accepts specific breakpoint identifiers that correspond to maximum container widths:

| maxWidth Value | Breakpoint | Max Width | Screen Size Range | Use Case |
|----------------|------------|-----------|-------------------|----------|
| **`'xs'`** | Extra Small | ~444px | <600px | Mobile-first, narrow content |
| **`'sm'`** | Small | ~600px | ≥600px | Small tablets, large phones |
| **`'md'`** | Medium | ~900px | ≥900px | Tablets, small laptops |
| **`'lg'`** | Large | ~1200px | ≥1200px | Standard desktops (default) |
| **`'xl'`** | Extra Large | ~1536px | ≥1536px | Large screens, wide monitors |
| **`false`** | Disabled | 100% | All sizes | Full-width, no constraint |
| **`string`** | Custom | Custom | As specified | Precise control (e.g., '800px') |

### Default Material-UI Breakpoints

```javascript
// Default theme.breakpoints.values
{
  xs: 0,      // Mobile phones
  sm: 600,    // Tablets
  md: 900,    // Small laptops
  lg: 1200,   // Desktops
  xl: 1536    // Large screens
}
```

### maxWidth Examples

#### 1. Extra Small Container (`maxWidth="xs"`)
```jsx
<Container maxWidth="xs">
  <Box sx={{ bgcolor: 'primary.light', p: 2 }}>
    <h2>Extra Small (xs)</h2>
    <p>Perfect for mobile-first, narrow content like single-column forms or focused reading experiences.</p>
    <p>Max width: ~444px</p>
  </Box>
</Container>
```

**Use Cases**:
- Login/signup forms
- Mobile-optimized content
- Single-column layouts
- Focused reading experiences
- Minimal UI workflows

#### 2. Small Container (`maxWidth="sm"`)
```jsx
<Container maxWidth="sm">
  <Box sx={{ bgcolor: 'secondary.light', p: 2 }}>
    <h2>Small (sm)</h2>
    <p>Ideal for blog posts, articles, and content that benefits from constrained line length.</p>
    <p>Max width: ~600px</p>
  </Box>
</Container>
```

**Use Cases**:
- Blog posts and articles
- Content with optimal reading line length
- Simple forms with multiple fields
- Modal-like content displays
- Mobile-tablet interfaces

#### 3. Medium Container (`maxWidth="md"`)
```jsx
<Container maxWidth="md">
  <Box sx={{ bgcolor: 'success.light', p: 2 }}>
    <h2>Medium (md)</h2>
    <p>Versatile size for medium-complexity interfaces and balanced layouts.</p>
    <p>Max width: ~900px</p>
  </Box>
</Container>
```

**Use Cases**:
- Two-column layouts
- Medium-complexity forms
- Settings pages
- Profile pages
- Dashboard sections

#### 4. Large Container (`maxWidth="lg"` - Default)
```jsx
<Container maxWidth="lg">
  <Box sx={{ bgcolor: 'warning.light', p: 2 }}>
    <h2>Large (lg) - Default</h2>
    <p>The default container size, suitable for most web applications.</p>
    <p>Max width: ~1200px</p>
  </Box>
</Container>
```

**Use Cases**:
- Standard web application layouts
- Multi-column interfaces
- Dashboard layouts
- Product listing pages
- General-purpose containers

#### 5. Extra Large Container (`maxWidth="xl"`)
```jsx
<Container maxWidth="xl">
  <Box sx={{ bgcolor: 'error.light', p: 2 }}>
    <h2>Extra Large (xl)</h2>
    <p>Maximum standard size for wide-screen displays and data-dense interfaces.</p>
    <p>Max width: ~1536px</p>
  </Box>
</Container>
```

**Use Cases**:
- Data tables with many columns
- Wide dashboards
- Multi-panel interfaces
- Media galleries
- Large-screen optimized content

#### 6. Full Width Container (`maxWidth={false}`)
```jsx
<Container maxWidth={false}>
  <Box sx={{ bgcolor: 'info.light', p: 2 }}>
    <h2>Full Width (maxWidth=false)</h2>
    <p>Container spans entire viewport width with no maximum constraint.</p>
    <p>Width: 100% (minus gutters if not disabled)</p>
  </Box>
</Container>
```

**Use Cases**:
- Hero sections
- Full-width backgrounds
- Navigation bars
- Footer sections
- Banner content

#### 7. Custom Width Container
```jsx
<Container maxWidth="800px">
  <Box sx={{ bgcolor: 'grey.300', p: 2 }}>
    <h2>Custom Width (800px)</h2>
    <p>Precise control over maximum width using any valid CSS value.</p>
  </Box>
</Container>
```

**Use Cases**:
- Specific design requirements
- Matching existing brand guidelines
- Fine-tuned layouts
- Custom breakpoint strategies

### Complete Breakpoint Demonstration

```jsx
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function BreakpointShowcase() {
  const containers = [
    { maxWidth: 'xs', color: '#e3f2fd', label: 'XS (~444px)' },
    { maxWidth: 'sm', color: '#f3e5f5', label: 'SM (~600px)' },
    { maxWidth: 'md', color: '#e8f5e9', label: 'MD (~900px)' },
    { maxWidth: 'lg', color: '#fff3e0', label: 'LG (~1200px) Default' },
    { maxWidth: 'xl', color: '#fce4ec', label: 'XL (~1536px)' },
    { maxWidth: false, color: '#e0f2f1', label: 'Full Width' },
  ];

  return (
    <Box sx={{ py: 4 }}>
      {containers.map(({ maxWidth, color, label }) => (
        <Box key={String(maxWidth)} sx={{ mb: 2 }}>
          <Container maxWidth={maxWidth}>
            <Box
              sx={{
                bgcolor: color,
                p: 3,
                border: '2px dashed',
                borderColor: 'grey.400',
                textAlign: 'center',
              }}
            >
              <strong>{label}</strong>
              <br />
              maxWidth={maxWidth === false ? 'false' : `"${maxWidth}"`}
            </Box>
          </Container>
        </Box>
      ))}
    </Box>
  );
}
```

---

## disableGutters Prop

### Default Gutter Behavior
By default, Container adds **24px padding** on both left and right sides. These "gutters" prevent content from touching screen edges and maintain comfortable spacing.

```jsx
// Default behavior - with gutters
<Container>
  <Box sx={{ bgcolor: 'primary.light', height: 200 }}>
    Content has 24px padding on left and right
  </Box>
</Container>
```

### Removing Gutters

```jsx
// No padding - content reaches edges
<Container disableGutters>
  <Box sx={{ bgcolor: 'secondary.light', height: 200 }}>
    Content extends to container edges (no padding)
  </Box>
</Container>
```

### Full-Width, Edge-to-Edge Layout

Combine `maxWidth={false}` with `disableGutters` for truly full-width content:

```jsx
<Container maxWidth={false} disableGutters>
  <Box sx={{ bgcolor: 'success.light', height: 200 }}>
    Content spans entire viewport width with no padding
  </Box>
</Container>
```

### Common Pattern: Full-Width Background with Constrained Content

```jsx
function FullWidthSection() {
  return (
    // Outer container: full-width background
    <Container maxWidth={false} disableGutters sx={{ bgcolor: 'primary.main' }}>
      <Box sx={{ py: 8 }}>
        {/* Inner container: constrained content */}
        <Container maxWidth="lg">
          <Box sx={{ color: 'white' }}>
            <h1>Full-width colored background</h1>
            <p>But content is constrained to 1200px and centered</p>
          </Box>
        </Container>
      </Box>
    </Container>
  );
}
```

### Selective Gutter Control with sx Prop

```jsx
// Custom padding control
<Container disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
  <Box sx={{ bgcolor: 'warning.light', height: 200 }}>
    Responsive custom padding:
    - Mobile (xs): 16px
    - Small (sm): 24px
    - Medium+ (md): 32px
  </Box>
</Container>
```

---

## Responsive Design Patterns

### Pattern 1: Progressive Content Width

Adjust maxWidth based on screen size for optimal content presentation:

```jsx
import { useTheme, useMediaQuery, Container, Box } from '@mui/material';

function ResponsiveContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Determine maxWidth based on screen size
  const maxWidth = isMobile ? 'xs' : isTablet ? 'sm' : 'md';

  return (
    <Container maxWidth={maxWidth}>
      <Box sx={{ bgcolor: 'grey.200', p: 3 }}>
        <h2>Responsive Container</h2>
        <p>Container adjusts based on device:</p>
        <ul>
          <li>Mobile: xs (444px)</li>
          <li>Tablet: sm (600px)</li>
          <li>Desktop: md (900px)</li>
        </ul>
      </Box>
    </Container>
  );
}
```

### Pattern 2: Responsive Padding

Adjust padding at different breakpoints using the sx prop:

```jsx
<Container
  maxWidth="lg"
  sx={{
    px: {
      xs: 2,  // 16px on mobile
      sm: 3,  // 24px on small screens
      md: 4,  // 32px on medium+ screens
    },
    py: {
      xs: 4,  // 32px vertical on mobile
      md: 8,  // 64px vertical on medium+ screens
    },
  }}
>
  <Box>Content with responsive padding</Box>
</Container>
```

### Pattern 3: Nested Containers for Complex Layouts

```jsx
function NestedContainerLayout() {
  return (
    <Box>
      {/* Hero section: full-width */}
      <Container maxWidth={false} disableGutters sx={{ bgcolor: 'primary.main' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ color: 'white' }}>
            <h1>Hero Section</h1>
            <p>Full-width background, constrained content</p>
          </Box>
        </Container>
      </Container>

      {/* Main content: standard width */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box>
          <h2>Main Content</h2>
          <p>Standard container width for body content</p>
        </Box>
      </Container>

      {/* Focused content: narrow */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ bgcolor: 'grey.100', p: 3 }}>
          <h3>Call to Action</h3>
          <p>Narrow container for focused content</p>
        </Box>
      </Container>
    </Box>
  );
}
```

### Pattern 4: Conditional Full-Width on Mobile

```jsx
import { useMediaQuery, useTheme } from '@mui/material';

function ConditionalFullWidth() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth={isMobile ? false : 'lg'}
      disableGutters={isMobile}
    >
      <Box sx={{ bgcolor: 'secondary.light', p: isMobile ? 2 : 4 }}>
        <h2>Adaptive Container</h2>
        <p>Full-width on mobile, constrained on larger screens</p>
      </Box>
    </Container>
  );
}
```

---

## Integration with Grid System

Container works seamlessly with Material-UI's Grid component for complex responsive layouts:

### Basic Grid Layout in Container

```jsx
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

function GridLayout() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <h2>Main Content</h2>
            <p>8 columns on desktop, full-width on mobile</p>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <h3>Sidebar</h3>
            <p>4 columns on desktop, full-width on mobile</p>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
```

### Three-Column Responsive Grid

```jsx
function ThreeColumnGrid() {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <h3>Card {item}</h3>
              <p>
                - Mobile (xs): 1 column (100%)
                - Tablet (sm): 2 columns (50%)
                - Desktop (md+): 3 columns (33.33%)
              </p>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
```

### Complex Dashboard Layout

```jsx
function DashboardLayout() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <h1>Dashboard Header</h1>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>Stat 1</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>Stat 2</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>Stat 3</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>Stat 4</Paper>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <h2>Main Chart</h2>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <h2>Activity Feed</h2>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
```

---

## Advanced Customization

### Theme-Based Customization

Override default Container props and styles in your theme:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

const theme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',      // Change default maxWidth
        disableGutters: false,
      },
      styleOverrides: {
        root: {
          paddingLeft: 32,   // Custom gutter width
          paddingRight: 32,
          backgroundColor: 'whitesmoke',
        },
        maxWidthSm: {
          maxWidth: 640,     // Custom breakpoint width
        },
        maxWidthLg: {
          maxWidth: 1280,    // Custom breakpoint width
        },
      },
    },
  },
});

function ThemedApp() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <h1>Container with custom theme</h1>
      </Container>
    </ThemeProvider>
  );
}
```

### Custom Breakpoints

Define custom breakpoint values in your theme:

```jsx
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,   // Custom
      md: 768,   // Custom
      lg: 1024,  // Custom
      xl: 1280,  // Custom
    },
  },
});
```

### Component Prop Override

Change the root element type:

```jsx
<Container component="section" maxWidth="md">
  <h2>Semantic HTML</h2>
  <p>Rendered as &lt;section&gt; instead of &lt;div&gt;</p>
</Container>

<Container component={Paper} elevation={3} maxWidth="sm">
  <h2>Container as Paper</h2>
  <p>Combines Container layout with Paper styling</p>
</Container>
```

### Advanced sx Prop Styling

```jsx
<Container
  maxWidth="lg"
  sx={{
    // Responsive padding
    px: { xs: 2, sm: 3, md: 4, lg: 6 },
    py: { xs: 4, md: 8 },

    // Background with gradient
    background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)',

    // Responsive border
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: { xs: 0, sm: 2 },

    // Shadow
    boxShadow: 2,

    // Transitions
    transition: 'all 0.3s ease',

    // Hover state
    '&:hover': {
      boxShadow: 4,
    },

    // Nested element styling
    '& h2': {
      color: 'primary.main',
      mb: 2,
    },
  }}
>
  <h2>Highly Customized Container</h2>
  <p>Using advanced sx prop styling</p>
</Container>
```

---

## CSS Classes API

Container exposes several CSS classes for styling customization:

| Class Name | Description |
|------------|-------------|
| `.MuiContainer-root` | Styles applied to the root element |
| `.MuiContainer-disableGutters` | Styles applied when `disableGutters={true}` |
| `.MuiContainer-fixed` | Styles applied when `fixed={true}` |
| `.MuiContainer-maxWidthXs` | Styles applied when `maxWidth="xs"` |
| `.MuiContainer-maxWidthSm` | Styles applied when `maxWidth="sm"` |
| `.MuiContainer-maxWidthMd` | Styles applied when `maxWidth="md"` |
| `.MuiContainer-maxWidthLg` | Styles applied when `maxWidth="lg"` |
| `.MuiContainer-maxWidthXl` | Styles applied when `maxWidth="xl"` |

### Custom Class Override

```jsx
<Container
  maxWidth="md"
  classes={{
    root: 'custom-container',
    maxWidthMd: 'custom-md-width',
  }}
  sx={{
    '&.custom-container': {
      backgroundColor: 'background.paper',
    },
    '&.custom-md-width': {
      maxWidth: 850, // Custom md width
    },
  }}
>
  Content with custom classes
</Container>
```

---

## Common Use Cases & Patterns

### 1. Standard Page Layout

```jsx
function StandardPage() {
  return (
    <Box>
      {/* Header */}
      <Container maxWidth={false} disableGutters sx={{ bgcolor: 'primary.main' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="h4" color="white">Site Header</Typography>
        </Container>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" gutterBottom>Page Title</Typography>
        <Typography>Main page content...</Typography>
      </Container>

      {/* Footer */}
      <Container maxWidth={false} disableGutters sx={{ bgcolor: 'grey.900' }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Typography color="white">Footer content</Typography>
        </Container>
      </Container>
    </Box>
  );
}
```

### 2. Hero Section with CTA

```jsx
function HeroSection() {
  return (
    <Container maxWidth={false} disableGutters sx={{ bgcolor: 'primary.main', color: 'white' }}>
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Welcome to Our Product
        </Typography>
        <Typography variant="h5" paragraph>
          The best solution for your needs
        </Typography>
        <Button variant="contained" size="large" color="secondary">
          Get Started
        </Button>
      </Container>
    </Container>
  );
}
```

### 3. Article/Blog Post Layout

```jsx
function BlogPost() {
  return (
    <Box>
      {/* Featured image - full width */}
      <Container maxWidth={false} disableGutters>
        <Box
          component="img"
          src="/featured-image.jpg"
          alt="Featured"
          sx={{ width: '100%', height: 400, objectFit: 'cover' }}
        />
      </Container>

      {/* Article content - narrow for readability */}
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h2" gutterBottom>
          Article Title
        </Typography>
        <Typography variant="body1" paragraph>
          Article content with optimal line length for reading...
        </Typography>
      </Container>

      {/* Comments - slightly wider */}
      <Container maxWidth="md" sx={{ py: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h4" gutterBottom>
          Comments
        </Typography>
        {/* Comment components */}
      </Container>
    </Box>
  );
}
```

### 4. Dashboard Layout

```jsx
function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Metric cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>Metric 1</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>Metric 2</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>Metric 3</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>Metric 4</Paper>
        </Grid>

        {/* Main chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>Chart</Paper>
        </Grid>

        {/* Recent activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>Activity</Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
```

### 5. Form Page

```jsx
function FormPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Form
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField fullWidth label="Name" margin="normal" />
          <TextField fullWidth label="Email" margin="normal" />
          <TextField fullWidth label="Message" multiline rows={4} margin="normal" />
          <Button variant="contained" fullWidth sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
```

### 6. Landing Page Sections

```jsx
function LandingPage() {
  return (
    <Box>
      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h1">Hero Title</Typography>
        <Typography variant="h5">Subtitle</Typography>
      </Container>

      {/* Features */}
      <Container maxWidth={false} disableGutters sx={{ bgcolor: 'grey.100' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Feature 1</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Feature 2</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Feature 3</Typography>
            </Grid>
          </Grid>
        </Container>
      </Container>

      {/* Testimonials */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Testimonials
        </Typography>
        {/* Testimonial content */}
      </Container>

      {/* CTA */}
      <Container maxWidth={false} sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to get started?
          </Typography>
          <Button variant="contained" size="large" color="secondary">
            Sign Up Now
          </Button>
        </Container>
      </Container>
    </Box>
  );
}
```

---

## Accessibility Considerations

### Semantic HTML

Use appropriate semantic elements:

```jsx
<Container component="main" maxWidth="lg">
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</Container>

<Container component="section" maxWidth="md">
  <h2>Section Title</h2>
</Container>

<Container component="footer" maxWidth={false}>
  <Container maxWidth="lg">
    Footer content
  </Container>
</Container>
```

### Readable Line Lengths

For text-heavy content, constrain width for optimal readability (45-75 characters per line):

```jsx
<Container maxWidth="sm">  {/* ~600px = optimal for reading */}
  <Typography variant="body1">
    Long-form content with comfortable line length...
  </Typography>
</Container>
```

### Skip Links

Provide skip navigation for accessibility:

```jsx
function AccessibleLayout() {
  return (
    <Box>
      <a href="#main-content" style={{ position: 'absolute', left: '-9999px' }}>
        Skip to main content
      </a>

      <Container component="header" maxWidth="lg">
        Navigation...
      </Container>

      <Container component="main" id="main-content" maxWidth="lg">
        Main content...
      </Container>
    </Box>
  );
}
```

---

## Performance Considerations

### Avoid Excessive Nesting

```jsx
// ❌ Avoid: Excessive nesting
<Container>
  <Container>
    <Container>
      Content
    </Container>
  </Container>
</Container>

// ✅ Better: Use single Container with Box for spacing
<Container maxWidth="lg">
  <Box sx={{ my: 4 }}>
    Content
  </Box>
</Container>
```

### Conditional Rendering

```jsx
// Only render Container when needed
function ConditionalContainer({ children, useContainer = true }) {
  if (!useContainer) {
    return <>{children}</>;
  }

  return (
    <Container maxWidth="lg">
      {children}
    </Container>
  );
}
```

---

## Migration and Compatibility

### From Material-UI v4 to v5

```jsx
// v4
import Container from '@material-ui/core/Container';

// v5
import Container from '@mui/material/Container';
```

Most props remain the same, but styling approach may differ:

```jsx
// v4: makeStyles
const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
}));

// v5: sx prop
<Container sx={{ pt: 4 }}>
  Content
</Container>
```

---

## Best Practices

### 1. Choose Appropriate maxWidth
- **Articles/blogs**: `sm` for optimal reading
- **Forms**: `sm` or `md` for focused interaction
- **Dashboards**: `xl` for data-dense layouts
- **Standard pages**: `lg` (default) for balanced layouts

### 2. Use Nested Containers Strategically
- Outer container with `maxWidth={false}` for full-width backgrounds
- Inner container with specific `maxWidth` for content constraints

### 3. Leverage disableGutters Appropriately
- Remove gutters for full-width images or backgrounds
- Keep gutters for text content to maintain readability

### 4. Combine with Grid for Complex Layouts
- Container provides horizontal constraints
- Grid handles multi-column responsive layouts

### 5. Use sx Prop for Responsive Styling
- Define different padding/margins at different breakpoints
- Create fluid, adaptive designs

### 6. Consider Semantic HTML
- Use `component` prop to render appropriate semantic elements
- Improves accessibility and SEO

### 7. Theme Consistency
- Define Container defaults in theme for consistency
- Override specific instances only when needed

---

## Implementation Checklist

When implementing a Container-based layout:

- [ ] Choose appropriate `maxWidth` for content type
- [ ] Decide between `fixed` and fluid (default) behavior
- [ ] Determine if gutters should be disabled
- [ ] Consider responsive padding adjustments
- [ ] Select semantic HTML element via `component` prop
- [ ] Plan nested Container strategy for sections
- [ ] Integrate with Grid for multi-column layouts
- [ ] Test across all breakpoints (xs, sm, md, lg, xl)
- [ ] Verify accessibility (semantic HTML, skip links)
- [ ] Check mobile appearance (especially with `disableGutters`)

---

## Related Components

- **Box**: General-purpose layout component for spacing and styling
- **Grid**: Responsive 12-column grid system for complex layouts
- **Stack**: One-dimensional layout with spacing between children
- **Paper**: Surface component for elevated content areas
- **AppBar**: Navigation bar component
- **Toolbar**: Container for AppBar content

---

## Summary

The MUI Container component is the foundational layout element in Material-UI applications. Key takeaways:

1. **Purpose**: Centers content horizontally with responsive width constraints
2. **maxWidth Prop**: Controls maximum width at breakpoints (xs/sm/md/lg/xl/false)
3. **fixed Prop**: Switches between fluid and stepped width behavior
4. **disableGutters**: Removes 24px default padding on left/right
5. **Responsive**: Adapts to screen size using Material Design breakpoints
6. **Composable**: Works seamlessly with Grid, Box, and other layout components
7. **Customizable**: Extensive theming and sx prop styling options
8. **Accessible**: Supports semantic HTML via component prop

The Container component provides a simple but powerful foundation for creating responsive, well-structured layouts that adhere to Material Design principles while offering flexibility for custom requirements.
