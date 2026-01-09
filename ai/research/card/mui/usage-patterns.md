# MUI - Card Usage Patterns

## Component URL
https://mui.com/material-ui/react-card/
Status: ✅ Successfully fetched via web search

## Documentation Quality
Comprehensive - MUI provides detailed documentation with complete API reference for all card sub-components, multiple examples, accessibility guidance, and theming information.

## Component Definition
- **Core purpose**: A surface container for grouping related content and actions about a single subject. Built on Paper component to provide Material Design card structure with elevation and visual hierarchy.
- **Mental model**: A flexible container that organizes information into distinct, scannable sections using specialized sub-components (header, media, content, actions). Think of it as a "content sandwich" with optional layers.
- **Semantic meaning**: Groups related information into a cohesive, visually distinct unit. Cards are self-contained and don't typically affect other cards when interacted with. Used for displaying content that can stand alone or be part of a collection.

## Container Patterns

### Paper Foundation
| Pattern | Present | Details |
|---------|---------|---------|
| Built on Paper | ✅ | Card extends Paper component, inheriting all Paper props and behaviors |
| Background color | ✅ | Uses theme's paper palette color by default |
| Rounded corners | ✅ | Border-radius applied by default (can be customized via square prop from Paper) |
| Responsive | ✅ | Adapts to container width, no fixed dimensions |

### Elevation System
| Pattern | Present | Details |
|---------|---------|---------|
| Default elevation | ✅ | Uses elevation={1} by default (subtle shadow) |
| Custom elevation | ✅ | Accepts elevation prop with values 0-24 |
| Raised variant | ✅ | `raised` prop sets elevation to 8 for prominent cards |
| Zero elevation | ✅ | `elevation={0}` removes shadow entirely |
| Outlined variant | ✅ | `variant="outlined"` uses border instead of shadow |

## Content Patterns

### Card Sub-Components Architecture
| Component | Present | Details |
|-----------|---------|---------|
| CardHeader | ✅ | Title, subtitle, avatar, and action area at card top |
| CardMedia | ✅ | Image, video, or audio content with responsive sizing |
| CardContent | ✅ | Main content container with 16px padding (24px bottom if last child) |
| CardActions | ✅ | Action buttons area with flexbox layout and 8px spacing |
| CardActionArea | ✅ | Makes card sections clickable with ripple effect |

### CardHeader Structure
| Pattern | Present | Details |
|---------|---------|---------|
| Title | ✅ | `title` prop accepts string or node for main heading |
| Subheader | ✅ | `subheader` prop for secondary text below title |
| Avatar | ✅ | `avatar` prop accepts Avatar component or any node (left-aligned) |
| Action | ✅ | `action` prop for interactive elements (right-aligned, typically IconButton) |
| Typography control | ✅ | `titleTypographyProps` and `subheaderTypographyProps` for styling |

### CardMedia Options
| Pattern | Present | Details |
|---------|---------|---------|
| Background image | ✅ | Default: div with background-image CSS. Use `image` prop |
| Media element | ✅ | Set `component="img"` or `"video"` for actual media elements |
| Height control | ✅ | Must specify height (e.g., `height={140}`) or media won't display |
| Responsive sizing | ✅ | Width adapts to container, height fixed or percentage-based |
| Object fit | ✅ | Can control with sx prop: `sx={{ objectFit: 'cover' }}` |

### CardContent Behavior
| Pattern | Present | Details |
|---------|---------|---------|
| Standard padding | ✅ | 16px padding on all sides |
| Last child padding | ✅ | Additional 24px bottom padding when CardContent is last child |
| Flexible content | ✅ | Accepts any React nodes (Typography, Lists, nested components) |
| No styling constraints | ✅ | Pure container, content determines internal layout |

### CardActions Layout
| Pattern | Present | Details |
|---------|---------|---------|
| Flexbox container | ✅ | Horizontal layout with flex display |
| Default spacing | ✅ | 8px padding on children, 8px horizontal spacing between |
| Disable spacing | ✅ | `disableSpacing` prop removes default spacing |
| Alignment options | ✅ | Use sx prop for justify-content control |
| Common pattern | ✅ | Typically contains Button components or IconButtons |

## Layout Patterns

### Structural Arrangements
| Pattern | Present | Details |
|---------|---------|---------|
| Media-first | ✅ | CardMedia at top, content below. Most common pattern |
| Header-content-actions | ✅ | CardHeader → CardContent → CardActions vertical stack |
| Complex media | ✅ | CardActionArea can wrap CardMedia + CardContent for clickable sections |
| Horizontal layout | ✅ | Media on side via custom Grid or flexbox layout with sx prop |
| Multi-section | ✅ | Multiple CardContent sections for complex information hierarchy |

### Common Composition Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Blog post card | ✅ | CardMedia (thumbnail) → CardContent (title, excerpt) → CardActions (Read More) |
| Product card | ✅ | CardMedia (product image) → CardContent (name, price) → CardActions (Add to Cart, Favorite) |
| Profile card | ✅ | CardHeader (avatar, name) → CardContent (bio) → CardActions (Follow, Message) |
| Dashboard card | ✅ | CardHeader (title, menu icon) → CardContent (stats/charts) |
| Action card | ✅ | CardActionArea wrapping all content for full-card clickability |

## Variation Patterns

### Visual Variants
| Pattern | Present | Details |
|---------|---------|---------|
| Elevated (default) | ✅ | Uses box-shadow for depth, `variant="elevation"` (default) |
| Outlined | ✅ | `variant="outlined"` uses border instead of shadow, no elevation |
| Custom elevation | ✅ | Combine variant="elevation" with elevation={0-24} |

### Elevation Levels
| Pattern | Present | Details |
|---------|---------|---------|
| Flat (0) | ✅ | No shadow, use with outlined variant or custom styling |
| Subtle (1-2) | ✅ | Default level, minimal elevation for content grouping |
| Standard (3-8) | ✅ | Moderate elevation for cards that need emphasis |
| Prominent (9-16) | ✅ | High elevation for modal-like cards or overlays |
| Maximum (17-24) | ✅ | Rarely used, for extreme depth requirements |

### Desktop vs Mobile Considerations
| Pattern | Present | Details |
|---------|---------|---------|
| Mobile elevation | ✅ | Higher resting elevations (shadows) indicate interactivity |
| Desktop elevation | ✅ | Shallower elevations since hover states communicate interactivity |
| Desktop outlined | ✅ | Cards at 0dp elevation on desktop use outlined variant with stroke |
| Responsive strategy | ✅ | Consider adjusting elevation based on device capabilities |

## Interactive Patterns

### CardActionArea Features
| Pattern | Present | Details |
|---------|---------|---------|
| Full card clickable | ✅ | Wraps content to make entire section interactive |
| Ripple effect | ✅ | Material Design ripple animation on click |
| Hover state | ✅ | Visual feedback on hover (background color change) |
| Focus state | ✅ | Keyboard navigation support with visible focus |
| Button wrapper | ✅ | Wraps children in a single Button component internally |
| Accessibility | ✅ | Proper ARIA attributes and keyboard navigation |

### Action Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| CardActions buttons | ✅ | Primary/secondary actions in CardActions section |
| Header action | ✅ | CardHeader `action` prop for contextual menu (IconButton with menu) |
| Mixed interactions | ✅ | Combine CardActionArea for card click + CardActions for specific actions |
| Link cards | ✅ | CardActionArea with component="a" href for navigation |

### Hover State Implementation
| Pattern | Present | Details |
|---------|---------|---------|
| sx prop hover | ✅ | `sx={{ '&:hover': { boxShadow: 20 } }}` for elevation change on hover |
| State management | ✅ | Use `raised` prop with `onMouseOver`/`onMouseOut` state toggling |
| CardActionArea hover | ✅ | Built-in hover styles for interactive cards |
| Custom transitions | ✅ | CSS transitions for smooth elevation changes |

## Styling Patterns

### Customization Approaches
| Pattern | Present | Details |
|---------|---------|---------|
| sx prop | ✅ | Inline theme-aware styling: `sx={{ maxWidth: 345, borderRadius: 2 }}` |
| className | ✅ | External CSS class application for custom styles |
| Theme overrides | ✅ | Global Card styling via MuiCard theme configuration |
| Component prop | ✅ | Change root element: `component="article"` for semantic HTML |
| Sub-component styling | ✅ | Style individual parts via their own sx/className props |

### Theme Integration
| Pattern | Present | Details |
|---------|---------|---------|
| Shadows array | ✅ | Theme.shadows array defines all 24 elevation shadow styles |
| Paper palette | ✅ | Background color from theme.palette.background.paper |
| Color customization | ✅ | sx prop with theme colors: `sx={{ bgcolor: 'primary.light' }}` |
| Border radius | ✅ | Theme.shape.borderRadius applied by default |
| Spacing system | ✅ | Use theme spacing in sx: `sx={{ m: 2, p: 1 }}` |

### CSS Classes
| Pattern | Present | Details |
|---------|---------|---------|
| .MuiCard-root | ✅ | Root card element class |
| Sub-component classes | ✅ | Each sub-component has .Mui{Component}-root class |
| Custom classes | ✅ | Apply via className prop or theme styleOverrides |

## Code Examples

### Basic Card
```jsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// Minimal card
<Card>
  <CardContent>
    <Typography variant="h5">Card Title</Typography>
    <Typography variant="body2">
      This is a basic card with just content.
    </Typography>
  </CardContent>
</Card>

// Outlined variant
<Card variant="outlined">
  <CardContent>
    <Typography>Outlined card with border instead of shadow</Typography>
  </CardContent>
</Card>

// Custom elevation
<Card elevation={8}>
  <CardContent>
    <Typography>Prominent card with higher elevation</Typography>
  </CardContent>
</Card>
```

### Complete Card Structure
```jsx
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Blog post card with all sections
<Card sx={{ maxWidth: 345 }}>
  <CardHeader
    avatar={<Avatar aria-label="author">R</Avatar>}
    action={
      <IconButton aria-label="settings">
        <MoreVertIcon />
      </IconButton>
    }
    title="Blog Post Title"
    subheader="September 14, 2023"
  />
  <CardMedia
    component="img"
    height="194"
    image="/blog-image.jpg"
    alt="Blog post cover"
  />
  <CardContent>
    <Typography variant="body2" color="text.secondary">
      This impressive blog post excerpt provides a quick preview
      of the content and entices readers to learn more.
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Read More</Button>
    <Button size="small">Share</Button>
  </CardActions>
</Card>
```

### CardMedia Variations
```jsx
// Background image (default)
<CardMedia
  image="/static/images/cards/paella.jpg"
  title="Paella dish"
  sx={{ height: 140 }}
/>

// Actual img element
<CardMedia
  component="img"
  height="140"
  image="/static/images/cards/paella.jpg"
  alt="Paella dish"
/>

// Video element
<CardMedia
  component="video"
  height="140"
  src="/static/videos/sample.mp4"
  controls
/>

// Responsive with object-fit
<CardMedia
  component="img"
  image="/image.jpg"
  alt="Description"
  sx={{
    height: { xs: 200, sm: 300 },
    objectFit: 'cover'
  }}
/>
```

### Interactive Cards
```jsx
import CardActionArea from '@mui/material/CardActionArea';

// Fully clickable card
<Card sx={{ maxWidth: 345 }}>
  <CardActionArea onClick={() => console.log('Card clicked')}>
    <CardMedia
      component="img"
      height="140"
      image="/image.jpg"
      alt="Product"
    />
    <CardContent>
      <Typography gutterBottom variant="h5">
        Product Name
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Product description goes here
      </Typography>
    </CardContent>
  </CardActionArea>
  <CardActions>
    <Button size="small">Add to Cart</Button>
    <Button size="small">Learn More</Button>
  </CardActions>
</Card>

// Link card
<Card>
  <CardActionArea component="a" href="/product/123">
    <CardContent>
      <Typography variant="h6">Clickable Link Card</Typography>
    </CardContent>
  </CardActionArea>
</Card>
```

### CardActions Layouts
```jsx
// Default left-aligned actions
<CardActions>
  <Button size="small">Share</Button>
  <Button size="small">Learn More</Button>
</CardActions>

// Right-aligned actions
<CardActions sx={{ justifyContent: 'flex-end' }}>
  <Button size="small">Cancel</Button>
  <Button size="small" variant="contained">Save</Button>
</CardActions>

// Space between actions
<CardActions sx={{ justifyContent: 'space-between' }}>
  <Button size="small">Like</Button>
  <Button size="small">Share</Button>
</CardActions>

// Disabled spacing for custom layout
<CardActions disableSpacing>
  <IconButton aria-label="add to favorites">
    <FavoriteIcon />
  </IconButton>
  <IconButton aria-label="share">
    <ShareIcon />
  </IconButton>
</CardActions>
```

### Profile Card Example
```jsx
<Card sx={{ maxWidth: 345 }}>
  <CardHeader
    avatar={
      <Avatar sx={{ bgcolor: 'primary.main' }}>
        JD
      </Avatar>
    }
    action={
      <IconButton aria-label="settings">
        <MoreVertIcon />
      </IconButton>
    }
    title="John Doe"
    subheader="Software Engineer"
  />
  <CardMedia
    component="img"
    height="194"
    image="/profile-cover.jpg"
    alt="Profile cover"
  />
  <CardContent>
    <Typography variant="body2" color="text.secondary">
      Passionate developer with 5 years of experience in React
      and Material Design. Love creating beautiful user experiences.
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small" variant="contained">Follow</Button>
    <Button size="small">Message</Button>
  </CardActions>
</Card>
```

### Product Card Example
```jsx
<Card sx={{ maxWidth: 345 }}>
  <CardActionArea component="a" href="/products/sneakers">
    <CardMedia
      component="img"
      height="200"
      image="/sneakers.jpg"
      alt="Running Sneakers"
    />
    <CardContent>
      <Typography gutterBottom variant="h6" component="div">
        Premium Running Sneakers
      </Typography>
      <Typography variant="body2" color="text.secondary">
        High-performance running shoes with advanced cushioning
      </Typography>
      <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
        $129.99
      </Typography>
    </CardContent>
  </CardActionArea>
  <CardActions>
    <Button size="small" variant="contained" fullWidth>
      Add to Cart
    </Button>
    <IconButton aria-label="add to favorites">
      <FavoriteIcon />
    </IconButton>
  </CardActions>
</Card>
```

### Dashboard Card Example
```jsx
<Card>
  <CardHeader
    title="Monthly Revenue"
    subheader="Last 30 days"
    action={
      <IconButton aria-label="options">
        <MoreVertIcon />
      </IconButton>
    }
  />
  <CardContent>
    <Typography variant="h3" component="div">
      $24,500
    </Typography>
    <Typography variant="body2" color="success.main">
      ↑ 12% from last month
    </Typography>
  </CardContent>
</Card>
```

### Hover Effect Examples
```jsx
// Elevation change on hover
<Card
  sx={{
    maxWidth: 345,
    transition: '0.3s',
    '&:hover': {
      boxShadow: 20,
    },
  }}
>
  <CardContent>
    <Typography>Hover to see elevation change</Typography>
  </CardContent>
</Card>

// Transform on hover
<Card
  sx={{
    maxWidth: 345,
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 8,
    },
  }}
>
  <CardContent>
    <Typography>Hover to see lift effect</Typography>
  </CardContent>
</Card>
```

### Horizontal Layout Card
```jsx
import Grid from '@mui/material/Grid';

<Card sx={{ display: 'flex' }}>
  <CardMedia
    component="img"
    sx={{ width: 151 }}
    image="/album-cover.jpg"
    alt="Album cover"
  />
  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
    <CardContent sx={{ flex: '1 0 auto' }}>
      <Typography component="div" variant="h5">
        Live From Space
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Mac Miller
      </Typography>
    </CardContent>
    <CardActions>
      <IconButton aria-label="previous">
        <SkipPreviousIcon />
      </IconButton>
      <IconButton aria-label="play">
        <PlayArrowIcon />
      </IconButton>
      <IconButton aria-label="next">
        <SkipNextIcon />
      </IconButton>
    </CardActions>
  </Box>
</Card>
```

### Theme Customization
```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom card theme
const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s, box-shadow 0.3s',
        },
      },
      defaultProps: {
        elevation: 2,
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <Card>
    <CardContent>
      <Typography>Card with custom theme</Typography>
    </CardContent>
  </Card>
</ThemeProvider>

// Custom shadows
const customTheme = createTheme({
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.15)',
    // ... up to 24 levels
  ],
});
```

### Advanced Styling
```jsx
// Complex card with custom styling
<Card
  sx={{
    maxWidth: 345,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  }}
>
  <CardContent>
    <Typography variant="h5" sx={{ color: 'white' }}>
      Custom Styled Card
    </Typography>
  </CardContent>
</Card>

// Glass morphism effect
<Card
  sx={{
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  }}
>
  <CardContent>
    <Typography>Glass morphism card</Typography>
  </CardContent>
</Card>
```

## API Reference

### Card Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Card content (typically CardHeader, CardMedia, CardContent, CardActions) |
| `elevation` | number (0-24) | 1 | Shadow depth of the card |
| `variant` | 'elevation' \| 'outlined' | 'elevation' | Variant to use (shadow vs border) |
| `raised` | boolean | false | If true, sets elevation to 8 |
| `sx` | object | - | System prop for defining custom styles |
| `component` | elementType | 'div' | Root component element type |

### Inherited from Paper
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `square` | boolean | false | If true, rounded corners are disabled |

### CardHeader Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatar` | node | - | Avatar element (left side, typically Avatar component) |
| `action` | node | - | Action element (right side, typically IconButton) |
| `title` | node | - | Main title (string or Typography component) |
| `subheader` | node | - | Subtitle (string or Typography component) |
| `titleTypographyProps` | object | - | Props for title Typography component |
| `subheaderTypographyProps` | object | - | Props for subheader Typography component |
| `sx` | object | - | System prop for custom styles |

### CardMedia Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | elementType | 'div' | Component to render ('div', 'img', 'video', 'audio', etc.) |
| `image` | string | - | Image URL (used as background-image when component='div') |
| `src` | string | - | Source URL (used when component='img', 'video', 'audio') |
| `height` | number \| string | - | Height in pixels or CSS value (required for visibility) |
| `sx` | object | - | System prop for custom styles including objectFit |

### CardContent Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Content elements |
| `component` | elementType | 'div' | Root component type |
| `sx` | object | - | System prop for custom styles |

### CardActions Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Action elements (typically Button or IconButton components) |
| `disableSpacing` | boolean | false | If true, removes default 8px spacing |
| `sx` | object | - | System prop for custom styles |

### CardActionArea Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | Card content to make interactive |
| `onClick` | function | - | Click handler function |
| `component` | elementType | 'button' | Root component type ('a' for links, 'div', etc.) |
| `href` | string | - | Link URL (when component='a') |
| `sx` | object | - | System prop for custom styles |

### CSS Classes
**Card:**
- `.MuiCard-root` - Root card element

**CardHeader:**
- `.MuiCardHeader-root` - Root element
- `.MuiCardHeader-avatar` - Avatar container
- `.MuiCardHeader-action` - Action container
- `.MuiCardHeader-content` - Title/subheader container
- `.MuiCardHeader-title` - Title element
- `.MuiCardHeader-subheader` - Subheader element

**CardMedia:**
- `.MuiCardMedia-root` - Root element
- `.MuiCardMedia-img` - When component='img'
- `.MuiCardMedia-video` - When component='video'

**CardContent:**
- `.MuiCardContent-root` - Root element

**CardActions:**
- `.MuiCardActions-root` - Root element
- `.MuiCardActions-spacing` - When spacing is enabled (default)

**CardActionArea:**
- `.MuiCardActionArea-root` - Root button element
- `.MuiCardActionArea-focusHighlight` - Focus highlight overlay

## Notable Features

### Paper Component Foundation
- **Inheritance Model**: Card extends Paper, inheriting all Paper props (elevation, square, variant, component)
- **Consistent Surface**: Shares Material Design surface behaviors with other Paper-based components
- **Theme Integration**: Benefits from Paper's theme configuration and customization options

### Sub-Component Architecture
- **Specialized Components**: Five purpose-built sub-components for different card sections
- **Flexible Composition**: Use any combination of sub-components or skip sections entirely
- **Independent Styling**: Each sub-component has its own props and styling capabilities
- **Clear Responsibility**: Each sub-component handles specific content type (header, media, content, actions)

### CardMedia Flexibility
- **Dual Rendering Modes**: Background image (div) or actual media element (img, video, audio)
- **Responsive by Default**: Width adapts to container, height controlled explicitly
- **Media Type Support**: Images, videos, audio files all supported
- **Object Fit Control**: CSS object-fit for image sizing strategies

### Interactive Patterns
- **CardActionArea Integration**: Makes any card section clickable with Material Design ripple
- **Hover State Support**: Built-in hover feedback for interactive cards
- **Mixed Interactions**: Combine full-card clicks with specific button actions
- **Link Support**: Can render as anchor tag for navigation

### Elevation System
- **24 Levels Available**: Full range of Material Design elevation levels
- **Desktop/Mobile Awareness**: Different elevation strategies for touch vs hover interactions
- **Outlined Alternative**: Border-based variant for zero-elevation designs
- **Hover Elevation**: Common pattern to increase elevation on hover

### Layout Versatility
- **Vertical Default**: Natural top-to-bottom stacking of sub-components
- **Horizontal Layouts**: Flexbox-based side-by-side arrangements
- **Grid Integration**: Works seamlessly with MUI Grid for card collections
- **Responsive Design**: Breakpoint-based layout adjustments via sx prop

### Accessibility Features
- **Semantic Structure**: Proper HTML hierarchy with header elements
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Focus Indicators**: Visible focus states for CardActionArea
- **Screen Reader Support**: Proper ARIA labels and roles
- **Link Semantics**: CardActionArea can render as proper anchor tags

### Theme Deep Integration
- **Global Customization**: Theme-level defaults for all card components
- **Shadow System**: Theme's shadows array controls all elevation levels
- **Color Palette**: Inherits Paper's background from theme
- **Spacing System**: Theme spacing units work in sx prop
- **Component Overrides**: Global style overrides via theme.components.MuiCard

### Material Design Compliance
- **Elevation Guidelines**: Follows Material Design elevation hierarchy
- **Surface Behavior**: Proper surface treatment and shadow casting
- **Interaction Feedback**: Ripple effects and hover states per spec
- **Content Density**: Appropriate padding and spacing per Material guidelines
- **Color Semantics**: Follows Material color system and contrast ratios

### CardHeader Intelligence
- **Automatic Layout**: Avatar (left) + title/subtitle (center) + action (right) layout
- **Typography Control**: Fine-grained control over title and subtitle typography
- **Avatar Integration**: Designed to work seamlessly with Avatar component
- **Action Positioning**: Consistent right-aligned positioning for contextual actions

### CardActions Flexibility
- **Flexbox Foundation**: Built on flex layout for easy alignment control
- **Spacing Control**: Default spacing can be disabled for custom layouts
- **Button Best Practices**: Designed for Button and IconButton components
- **Alignment Options**: Easy left, right, center, or space-between alignment

### Performance Considerations
- **No Re-renders**: Static cards don't cause unnecessary re-renders
- **Efficient Media**: Background images avoid img element overhead when appropriate
- **CSS-in-JS Optimization**: Emotion-based styling with efficient caching
- **Lazy Loading**: CardMedia works well with lazy loading strategies

## Research Notes

### Documentation Access
- Successfully fetched documentation via web search and direct API
- Comprehensive information gathered from official MUI docs, API references, and community resources
- Verified patterns across multiple sources (official docs, GitHub issues, Stack Overflow)

### Framework Philosophy

1. **Composition Over Configuration**: MUI Card emphasizes composing specialized sub-components rather than prop-heavy configuration

2. **Material Design Strict**: Unlike some frameworks, MUI Card strictly adheres to Material Design specifications for elevation, surfaces, and interactions

3. **Paper as Foundation**: Card's foundation on Paper creates consistency with other surface components (Dialog, AppBar, Drawer)

4. **Sub-Component Specialization**: Each card section (header, media, content, actions) is a distinct component with clear responsibility

5. **Theme-First Approach**: Heavy reliance on theme system for colors, shadows, spacing, and global defaults

### Comparison Points

**vs Semantic UI Classic Card**:
- MUI has distinct sub-components (CardHeader, CardMedia) vs Semantic's more prop-based approach
- MUI elevation system is more sophisticated (24 levels) than Semantic's basic raised variant
- CardActionArea is MUI-specific for making cards clickable; Semantic uses onClick on Card directly
- MUI requires explicit height for CardMedia; Semantic may auto-size images
- MUI's outlined variant vs Semantic's bordered/basic variants

**vs Other Material Design Frameworks**:
- Similar to Vuetify's v-card structure with v-card-title, v-card-text, v-card-actions
- More structured than generic container components in utility-first frameworks
- Less flexible than headless UI but more batteries-included
- Stronger typing and API documentation than many alternatives

### API Design Patterns

1. **Sub-Component Pattern**: Specialized components for each card section rather than prop slots
2. **Paper Inheritance**: All Paper props available on Card
3. **Dual Media Rendering**: Background-image vs actual media element based on component prop
4. **Optional Sections**: Any sub-component can be omitted for simpler cards
5. **Action Integration**: CardActionArea wraps content; CardActions contains buttons
6. **Typography Props**: Pass-through props for fine-tuned typography control

### Notable Implementation Details

- Card is essentially `<Paper elevation={1}>` with no additional functionality
- CardMedia default (div with background-image) avoids img accessibility concerns when image is decorative
- CardContent's extra bottom padding accounts for visual rhythm of stacked content
- CardActions uses flex gap for spacing, which can be disabled
- CardActionArea wraps children in ButtonBase for consistent interaction behavior
- sx prop provides direct access to theme values and CSS-in-JS

### Common Patterns in Practice

1. **Blog/News Cards**: CardMedia (thumbnail) + CardHeader (title, date) + CardContent (excerpt) + CardActions (read more)
2. **Product Cards**: CardActionArea wrapping CardMedia + CardContent, with CardActions below
3. **Profile Cards**: CardHeader (avatar, name) + CardMedia (cover photo) + CardContent (bio) + CardActions (follow, message)
4. **Dashboard Cards**: CardHeader (title, menu icon) + CardContent (metrics/charts), often without CardActions
5. **Image Gallery**: Just CardMedia + CardContent (title, description)

### Accessibility Best Practices

1. Use CardActionArea with proper aria-labels for clickable cards
2. Include alt text for CardMedia images
3. Use semantic HTML with component prop (article, section)
4. Ensure keyboard navigation works for all interactive elements
5. Maintain sufficient color contrast in custom themes
6. Use proper heading hierarchy in CardContent

### Performance Tips

1. Use CardMedia with background-image for decorative images
2. Implement lazy loading for image-heavy card collections
3. Use elevation judiciously (higher elevations = more complex shadows)
4. Consider virtualization for long lists of cards
5. Memoize card components when rendering large collections

### Missing/Requested Features

- No built-in skeleton loading state (handled by Skeleton component separately)
- No built-in expand/collapse behavior (implement with Collapse component)
- No built-in card flip animation (requires custom implementation)
- CardMedia requires explicit height (can be cumbersome for responsive designs)
- No built-in badge/ribbon support for card corners

### Integration Patterns

- Often used with Grid or Stack for card collections
- Common with Skeleton for loading states
- Frequently paired with Chip components in CardContent
- Dialog component shares Paper base with Card
- Typography component essential for CardContent formatting
- IconButton typical in CardHeader action prop

This comprehensive research shows MUI Card as a mature, well-structured component with strict Material Design alignment, sophisticated elevation system, and flexible composition model through specialized sub-components.
