# Ant Design - Carousel Usage Patterns

## Component URL
https://ant.design/components/carousel/
Status: ✅ Working
Version: 4.24.16 (from 4x documentation)
Last Verified: 2025-11-10

## Documentation Quality
Good - Provides clear API documentation with examples. However, relies heavily on react-slick documentation for advanced features. Some users report documentation gaps for complex configurations.

## Component Definition
- **Core purpose**: A container component that displays content in a revolving format, scaling with its container to present groups of content at the same level.
- **Mental model**: Think of it as a "revolving door" that cycles through content to conserve space while maintaining visual hierarchy.
- **Semantic meaning**: Communicates that multiple pieces of equal-importance content exist, with one visible at a time. Commonly used for image galleries, feature showcases, or card collections.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `autoplay={true}`)
- **Composed**: Via composition/children (e.g., `<Carousel>{slides}</Carousel>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image slides | ✅ | Composed | Pass image elements as children; Carousel handles rotation |
| Card slides | ✅ | Composed | Pass any React components as children, commonly used for cards |
| Custom content | ✅ | Composed | Accepts any JSX as children; flexible content structure |
| Multiple items per slide | ✅ | Native | Via react-slick's `slidesToShow` prop; controls visible items count |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal scroll | ✅ | Native | Default behavior with `effect="scrollx"` |
| Vertical scroll | ✅ | CSS-only | Requires custom CSS implementation with vertical orientation |
| Fade transition | ✅ | Native | Via `effect="fade"` prop |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Autoplay | ✅ | Native | `autoplay` prop (boolean, default: false) |
| Pause on hover | ✅ | Native | Via react-slick's `pauseOnHover` prop |
| Loading state | ❌ | N/A | No built-in loading state support |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Navigation dots | ✅ | Native | `dots` prop (boolean or object, default: true); `dotPosition` controls placement (top/bottom/left/right); supports className customization |
| Arrow controls | ✅ | Native | `arrows` prop enables navigation arrows; custom arrows via `nextArrow` and `prevArrow` props; requires slick-carousel CSS import for visibility |
| Infinite loop | ✅ | Native | Via react-slick's `infinite` prop; enables continuous scrolling with automatic restart |
| Speed control | ✅ | Native | `speed` prop controls transition timing; `easing` prop defines animation interpolation function (default: "linear") |
| Swipe/drag support | ✅ | Native | Via react-slick's `draggable` and `swipeToSlide` props; enables touch/mouse-based slide navigation |
| Responsive behavior | ✅ | Native | Via react-slick's `responsive` prop array; configure breakpoints and settings for different screen sizes |

## Code Examples

### Basic Usage
```jsx
import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const App = () => (
  <Carousel afterChange={(current) => console.log(current)}>
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

export default App;
```
[View Live](https://4x.ant.design/components/carousel/)

### Autoplay
```jsx
import React from 'react';
import { Carousel } from 'antd';

const App = () => (
  <Carousel autoplay>
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

export default App;
```

### Fade Transition
```jsx
import React from 'react';
import { Carousel } from 'antd';

const App = () => (
  <Carousel effect="fade">
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

export default App;
```

### Position Control
```jsx
import React, { useState } from 'react';
import { Carousel, Radio } from 'antd';

const App = () => {
  const [dotPosition, setDotPosition] = useState('bottom');

  return (
    <>
      <Radio.Group
        value={dotPosition}
        onChange={(e) => setDotPosition(e.target.value)}
      >
        <Radio.Button value="top">Top</Radio.Button>
        <Radio.Button value="bottom">Bottom</Radio.Button>
        <Radio.Button value="left">Left</Radio.Button>
        <Radio.Button value="right">Right</Radio.Button>
      </Radio.Group>
      <Carousel dotPosition={dotPosition}>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </>
  );
};

export default App;
```

### Custom Arrows (requires react-slick props)
```jsx
import React from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// Custom arrow components
const CustomArrow = ({ className, style, onClick, direction }) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      fontSize: '20px',
    }}
    onClick={onClick}
  >
    {direction === 'left' ? <LeftOutlined /> : <RightOutlined />}
  </div>
);

const App = () => (
  <Carousel
    arrows
    prevArrow={<CustomArrow direction="left" />}
    nextArrow={<CustomArrow direction="right" />}
    infinite
    speed={500}
    slidesToShow={1}
    draggable
  >
    <div>
      <h3 style={contentStyle}>1</h3>
    </div>
    <div>
      <h3 style={contentStyle}>2</h3>
    </div>
    <div>
      <h3 style={contentStyle}>3</h3>
    </div>
    <div>
      <h3 style={contentStyle}>4</h3>
    </div>
  </Carousel>
);

export default App;
```

### Responsive Configuration
```jsx
import React from 'react';
import { Carousel } from 'antd';

const App = () => (
  <Carousel
    responsive={[
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]}
  >
    <div><h3 style={contentStyle}>1</h3></div>
    <div><h3 style={contentStyle}>2</h3></div>
    <div><h3 style={contentStyle}>3</h3></div>
    <div><h3 style={contentStyle}>4</h3></div>
    <div><h3 style={contentStyle}>5</h3></div>
    <div><h3 style={contentStyle}>6</h3></div>
  </Carousel>
);

export default App;
```

## Complete API Reference

### Props

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| autoplay | Auto-scrolling activation | boolean | false |
| dotPosition | Indicator placement location | 'top' \| 'bottom' \| 'left' \| 'right' | 'bottom' |
| dots | Show bottom indicators; supports className customization | boolean \| { className?: string } | true |
| easing | Animation interpolation function | string | 'linear' |
| effect | Transition type | 'scrollx' \| 'fade' | 'scrollx' |
| afterChange | Callback after index changes | (current: number) => void | - |
| beforeChange | Callback before index changes | (from: number, to: number) => void | - |

### Methods

Access via ref:
- `goTo(slideNumber: number, dontAnimate?: boolean)`: Navigate to specific slide
- `next()`: Advance to next slide
- `prev()`: Return to previous slide

### Extended react-slick Props

Ant Design Carousel accepts all react-slick props, including:

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| arrows | Show navigation arrows | boolean | false |
| infinite | Infinite loop sliding | boolean | true |
| speed | Animation speed in milliseconds | number | 500 |
| slidesToShow | Number of slides to show at once | number | 1 |
| slidesToScroll | Number of slides to scroll at once | number | 1 |
| draggable | Enable mouse dragging | boolean | true |
| swipeToSlide | Allow swipe to slide | boolean | false |
| pauseOnHover | Pause autoplay on hover | boolean | true |
| nextArrow | Custom next arrow component | React.ReactNode | - |
| prevArrow | Custom previous arrow component | React.ReactNode | - |
| responsive | Responsive breakpoint settings | Array<{ breakpoint: number, settings: object }> | - |

## Notable Features

- **Built on react-slick**: Leverages mature, well-tested carousel library with extensive customization options
- **Full react-slick compatibility**: All react-slick props and methods are available through pass-through
- **Flexible dot positioning**: Unique `dotPosition` prop allows placement on all four sides (top, bottom, left, right)
- **Programmatic control**: Exposes methods for external control (goTo, next, prev) via component ref
- **Callback hooks**: Both `beforeChange` and `afterChange` callbacks for slide transition lifecycle management
- **Fade effect built-in**: Native support for fade transitions without additional configuration
- **Composable content**: Accepts any React components as children, enabling complex slide content

## Research Notes

### Documentation Structure
- Ant Design provides minimal documentation focused on their custom props
- Users are expected to reference react-slick documentation for advanced features
- This dual-documentation approach can be confusing for developers unfamiliar with react-slick

### Implementation Dependencies
- Requires `slick-carousel` CSS import for arrow visibility: `import "slick-carousel/slick/slick.css";`
- Default arrow font-size is 0px, making them invisible without CSS import or custom styling
- This is a common source of confusion for new users

### Community Feedback
- GitHub issues indicate users request more complete documentation (Issue #42856)
- Arrow implementation requires additional setup not clearly documented (Issue #5458)
- Some confusion about method exposure and ref access (Issue #7484)
- Responsive configuration requires careful testing as behavior can be inconsistent

### Framework Approach
- **Thin wrapper philosophy**: Ant Design provides minimal abstraction over react-slick
- **Props extension**: Adds convenience props (dotPosition, effect) while maintaining full compatibility
- **Styling integration**: Applies Ant Design theme tokens to dots and basic styling
- **Trade-off**: Simplicity at the cost of requiring external documentation reference

### Best Practices from Community
- Always import slick-carousel CSS when using arrows
- Use ref access for programmatic control rather than DOM manipulation
- Test responsive configurations thoroughly across breakpoints
- Consider custom arrow components for better design system integration
- Leverage `afterChange` callback for syncing external UI state
