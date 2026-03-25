# Ant Design - Result Usage Patterns

## Component URL
https://ant.design/components/result
Status: ✅ Working
Version: 5.x (Current)
Last Verified: 2025-11-05

## Documentation Quality
**Assessment: Comprehensive**

The documentation provides clear examples for all status types, includes API tables with prop descriptions, demonstrates common usage patterns, and shows integration with other components (particularly buttons in the extra prop). The documentation also includes design token customization options.

## Component Definition

- **Core purpose**: To provide feedback to users about the outcome of a series of operational tasks, particularly when the feedback is complex or important enough to warrant dedicated space and attention.

- **Mental model**: A full-page or section-level status indicator that combines an icon, heading, description, and action buttons to communicate operation results and guide users to next steps. Think of it as a structured "landing page" for operation outcomes.

- **Semantic meaning**: Communicates completion status (success, failure, warning, or informational) of user actions or system states, with emphasis on guiding users toward appropriate next actions. Often used for post-submission states, error pages, or intermediate processing states.

## Pattern Support Levels

- **Native**: Icon with status-based styling, title text, subtitle text, extra action area, custom icon override
- **Composed**: Complex content in title/subtitle/extra areas via ReactNode, child content for additional details
- **CSS-only**: Custom styling via className, style prop, and design tokens; layout customization beyond provided structure requires custom implementation

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Title text | ✅ | Native | Primary heading via `title` prop (ReactNode) |
| Subtitle text | ✅ | Native | Secondary description via `subTitle` prop (ReactNode) |
| Icon support | ✅ | Native | Status-based icons (automatic) or custom via `icon` prop (ReactNode) |
| Action buttons | ✅ | Native | Via `extra` prop (ReactNode) - typically holds Button components |
| Custom content | ✅ | Composed | Via `children` prop for additional content below actions |
| Rich content | ✅ | Composed | All text props accept ReactNode for complex layouts |

## Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Success state | ✅ | Native | `status="success"` - green checkmark icon |
| Error state | ✅ | Native | `status="error"` - red close circle icon |
| Info state | ✅ | Native | `status="info"` - blue exclamation icon (default) |
| Warning state | ✅ | Native | `status="warning"` - orange warning icon |
| 404 error | ✅ | Native | `status="404"` - page not found illustration |
| 403 error | ✅ | Native | `status="403"` - unauthorized access illustration |
| 500 error | ✅ | Native | `status="500"` - server error illustration |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | No built-in loading state; use separate loading component |
| Disabled | ❌ | N/A | Not applicable - Result is a display component |
| Interactive states | ❌ | N/A | Component itself is non-interactive; actions in `extra` prop |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Status variants | ✅ | Native | 7 status types: success, error, info, warning, 404, 403, 500 |
| Custom icons | ✅ | Native | Override default icon via `icon` prop |
| Size options | ❌ | CSS-only | No built-in size variants; customize via CSS |
| Color theming | ✅ | Native | Status-based color schemes (success=green, error=red, etc.) |
| Layout variations | ❌ | CSS-only | Single centered layout; customization requires CSS |
| Spacing control | ❌ | CSS-only | No built-in spacing props; use CSS or design tokens |

## Code Examples

### Basic Success Result
```jsx
import { Result } from 'antd';

<Result
  status="success"
  title="Successfully Purchased Cloud Server ECS!"
  subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
/>
```

### Error with Actions
```jsx
import { Result, Button } from 'antd';

<Result
  status="error"
  title="Submission Failed"
  subTitle="Please check and modify the following information before resubmitting."
  extra={[
    <Button type="primary" key="console">
      Go Console
    </Button>,
    <Button key="buy">Buy Again</Button>,
  ]}
/>
```

### 404 Page Not Found
```jsx
import { Result, Button } from 'antd';

<Result
  status="404"
  title="404"
  subTitle="Sorry, the page you visited does not exist."
  extra={<Button type="primary">Back Home</Button>}
/>
```

### Custom Icon
```jsx
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

<Result
  icon={<SmileOutlined />}
  title="Great, we have done all the operations!"
  extra={<Button type="primary">Next</Button>}
/>
```

### Warning with Complex Extra
```jsx
import { Result, Button } from 'antd';

<Result
  status="warning"
  title="There are some problems with your operation."
  extra={
    <Button type="primary" key="console">
      Go Console
    </Button>
  }
/>
```

[View Live Examples](https://ant.design/components/result#components-result-demo-success)

## Props/API Documentation

### Result Component Props

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| `extra` | Operating area - typically contains action buttons | ReactNode | - |
| `icon` | Custom icon element to override status-based icon | ReactNode | - |
| `status` | Result status determining color scheme and default icon | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'info'` |
| `subTitle` | Subtitle text or custom content | ReactNode | - |
| `title` | Title text or custom content | ReactNode | - |
| `children` | Additional content rendered below the extra area | ReactNode | - |
| `className` | Custom CSS class name | string | - |
| `style` | Inline styles | CSSProperties | - |

### TypeScript Definitions

```typescript
export interface ResultProps {
  icon?: React.ReactNode;
  status?: 'success' | 'error' | 'info' | 'warning' | 403 | 404 | 500 | '403' | '404' | '500';
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500';
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap;
```

### Status Icon Mapping

- **success**: CheckCircleFilled (green)
- **error**: CloseCircleFilled (red)
- **info**: ExclamationCircleFilled (blue)
- **warning**: WarningFilled (orange)
- **404**: Custom "not found" illustration
- **403**: Custom "unauthorized" illustration
- **500**: Custom "server error" illustration

## Composition Patterns

### With Button Actions
Result is commonly composed with Button components in the `extra` prop to provide user actions:

```jsx
<Result
  status="success"
  title="Operation Successful"
  extra={[
    <Button type="primary" key="primary">Go Home</Button>,
    <Button key="secondary">View Details</Button>
  ]}
/>
```

### With Custom Content
Use children for additional content below the main result:

```jsx
<Result
  status="warning"
  title="Your operation has potential issues"
  subTitle="Please review the details below"
  extra={<Button>Acknowledge</Button>}
>
  <div className="desc">
    <Paragraph>
      <Text strong>Issues identified:</Text>
    </Paragraph>
    <ul>
      <li>Issue 1 description</li>
      <li>Issue 2 description</li>
    </ul>
  </div>
</Result>
```

## Styling Approaches

### Built-in Theming
Uses Ant Design's design token system for consistent theming:
- Status colors automatically map to theme colors
- Spacing follows design system specifications
- Icons scale appropriately with theme size settings

### Custom Styling
```jsx
<Result
  className="custom-result"
  style={{ padding: '40px' }}
  status="success"
  title="Custom Styled Result"
/>
```

### Design Tokens
The Result component supports component-level design token customization for advanced theming scenarios.

## Accessibility Patterns

### Semantic Structure
- Uses appropriate heading hierarchy
- Icon and status are complementary (doesn't rely solely on color)
- Action buttons maintain keyboard navigation order

### ARIA Considerations
- Status icons include semantic meaning through both visual and structural cues
- Text content is screen-reader accessible
- Interactive elements (buttons in extra) maintain proper focus management

### Color Contrast
- Status colors (success, error, warning, info) meet WCAG contrast requirements
- Text hierarchy ensures readability
- Icons are large and visually distinct

## Notable Features

### Status-Based Theming
Automatic color and icon selection based on status prop eliminates need for manual styling in most cases. The component intelligently maps status to appropriate visual treatment.

### HTTP Error Pages
Built-in support for common HTTP error codes (403, 404, 500) with custom illustrations, making it easy to create error pages without additional assets.

### Flexible Content Model
All content areas accept ReactNode, allowing for simple strings or complex JSX compositions. This flexibility supports both basic and advanced use cases without separate component variants.

### Action Guidance
The `extra` prop specifically designed for action buttons emphasizes the component's role in guiding users to next steps, not just displaying status.

### Predefined Illustrations
Static property access to error illustrations:
- `Result.PRESENTED_IMAGE_404`
- `Result.PRESENTED_IMAGE_403`
- `Result.PRESENTED_IMAGE_500`

## Research Notes

### Documentation Accessibility
The official Ant Design documentation was accessible and comprehensive. Multiple sources (React docs, Angular NG-ZORRO docs, and GitHub source) provided consistent information, indicating stable API design.

### Framework Approach
Ant Design takes a "kitchen sink" approach with the Result component, including specialized status types (HTTP error codes) directly in the component rather than requiring composition or customization. This reduces implementation complexity for common use cases.

### TypeScript Support
Strong TypeScript definitions with discriminated union types for status prop. The API accepts both numeric and string representations of HTTP error codes (e.g., `404` and `"404"`), providing developer flexibility.

### Design Philosophy
The component emphasizes user guidance over pure status display - evidenced by the prominent `extra` prop for actions and the recommendation to limit actions to 2 items maximum to avoid confusion. This reflects a task-completion-oriented design philosophy.

### Comparison with Similar Components
The Result component is distinct from:
- **Alert**: Inline notifications, less prominent
- **Message**: Transient toast notifications
- **Modal**: Interrupting dialogs

Result is specifically designed for dedicated result pages or major section-level feedback, not inline or temporary notifications.
