# Component Pattern Research: Result

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 1
- Date: 2025-11-05
- Unique patterns identified: 10+

## Component Definition Consensus

Result components provide feedback about operational task outcomes, combining icons, headings, descriptions, and action buttons in a dedicated feedback display. Mental model: "full-page or section-level status indicator."

**Primary Purpose:** Communicate completion status (success, failure, warning, information) of user actions or system states, with emphasis on guiding users toward appropriate next actions.

**Mental Model:** A structured "landing page" for operation outcomes that combines status visualization with next-step guidance.

**Semantic meaning:** Represents the outcome of an operation with visual feedback and actionable next steps, often used for post-submission states, error pages, or intermediate processing states.

## Terminology Variations

- **Result** (1 framework) = Ant Design

Note: Result components are specialized feedback displays not universally provided across all UI frameworks. Only Ant Design from the surveyed frameworks offers a dedicated Result component.

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Title text | Primary heading | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Subtitle text | Secondary description | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Icon support | Status-based or custom icons | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Action buttons | Call-to-action area | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Custom content | Additional content below actions | 1/1 (100%) | **Level 1: Universal** | Ant Design | Composed |
| Rich content | ReactNode support for complex layouts | 1/1 (100%) | **Level 1: Universal** | Ant Design | Composed |

### Status Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Success state | Green checkmark for success | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Error state | Red close circle for errors | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Info state | Blue exclamation for information | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Warning state | Orange warning icon | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| 404 error | Page not found illustration | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| 403 error | Unauthorized access illustration | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| 500 error | Server error illustration | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Button integration | Action buttons in extra prop | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Multiple actions | Array of buttons | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Custom icon override | Replace default status icon | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Children content | Additional content below | 1/1 (100%) | **Level 1: Universal** | Ant Design | Composed |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Status-based colors | Automatic color schemes | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Custom styling | className and style props | 1/1 (100%) | **Level 1: Universal** | Ant Design | CSS-only |
| Design tokens | Theme customization | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |
| Centered layout | Default centered presentation | 1/1 (100%) | **Level 1: Universal** | Ant Design | Native |

## Notable Patterns

### Universal (100% - Single Framework)
All patterns present in Ant Design are considered standard for Result components:
- Title and subtitle text
- Status-based icon system
- Action button area
- Seven status types (success, error, info, warning, 404, 403, 500)
- Custom icon override
- Centered layout

### Ant Design Implementation

**Status Types:**
The component provides comprehensive status coverage:
- **Operational States**: success, error, info, warning
- **HTTP Errors**: 404, 403, 500
- Each status has associated color scheme and icon

**Content Model:**
```jsx
<Result
  status="success"           // Status determines icon and color
  icon={<CustomIcon />}      // Optional override
  title="Heading"            // ReactNode
  subTitle="Description"     // ReactNode
  extra={[<Button />, ...]}  // Action area
>
  {/* Additional content */}
</Result>
```

**Status-Icon Mapping:**
- `success` → Green checkmark icon
- `error` → Red close circle icon
- `info` → Blue exclamation icon (default)
- `warning` → Orange warning icon
- `404` → Illustration (page not found)
- `403` → Illustration (unauthorized)
- `500` → Illustration (server error)

**Props API:**
- `status`: Enum of 7 values
- `title`: ReactNode
- `subTitle`: ReactNode
- `icon`: ReactNode (override)
- `extra`: ReactNode (actions)
- `children`: ReactNode (additional content)
- Standard: `className`, `style`

## Implementation Notes

### Installation
```jsx
import { Result } from 'antd';
```

Part of the core Ant Design package.

### Basic Usage
```jsx
<Result
  status="success"
  title="Successfully Purchased Cloud Server ECS!"
  subTitle="Order number: 2017182818828182881"
  extra={[
    <Button type="primary" key="console">
      Go Console
    </Button>,
    <Button key="buy">Buy Again</Button>,
  ]}
/>
```

### Common Patterns

**Post-Submission Success:**
```jsx
<Result
  status="success"
  title="Form Submitted Successfully"
  subTitle="Your request has been processed."
  extra={<Button type="primary">Continue</Button>}
/>
```

**Error with Recovery Actions:**
```jsx
<Result
  status="error"
  title="Submission Failed"
  subTitle="Please check the information and try again."
  extra={[
    <Button type="primary">Retry</Button>,
    <Button>Cancel</Button>,
  ]}
/>
```

**404 Page:**
```jsx
<Result
  status="404"
  title="404"
  subTitle="Sorry, the page you visited does not exist."
  extra={<Button type="primary">Back Home</Button>}
/>
```

**Custom Icon:**
```jsx
<Result
  icon={<SmileOutlined />}
  title="Custom Success Message"
  extra={<Button type="primary">Next</Button>}
/>
```

## Limited Ecosystem Observation

Only 1 framework (Ant Design) provides a dedicated Result component out of the surveyed frameworks. Result components are specialized feedback displays that:
- Occupy significant screen real estate
- Combine multiple content types (icon, text, actions)
- Serve specific use cases (post-operation feedback, error pages)
- Are considered enterprise-focused features

Many frameworks expect developers to compose similar layouts from primitives (containers, icons, buttons) rather than providing pre-built Result components.

## Use Cases

Based on Ant Design documentation and examples:

### Operational Feedback
1. **Form submission success/failure** - Confirm user actions
2. **Payment processing results** - Transaction outcomes
3. **Data import/export completion** - Bulk operation feedback
4. **Account registration** - Onboarding confirmations

### Error Pages
1. **404 Not Found** - Invalid routes
2. **403 Forbidden** - Authorization failures
3. **500 Server Error** - System failures
4. **Network errors** - Connectivity issues

### Intermediate States
1. **Processing notifications** - Long-running operations
2. **Pending approvals** - Workflow states
3. **Maintenance modes** - System status

## Design Characteristics

### Visual Structure
- **Centered layout** - Focuses attention on feedback
- **Large icon** - Immediate status recognition
- **Hierarchical text** - Title + subtitle organization
- **Action area** - Clear next steps
- **White space** - Emphasizes importance

### Color System
- **Success**: Green (#52c41a) - Positive outcomes
- **Error**: Red (#ff4d4f) - Failures and problems
- **Info**: Blue (#1890ff) - Neutral information
- **Warning**: Orange (#faad14) - Caution states
- **Illustrations**: Multi-color for HTTP errors

### Content Guidelines (Implied)
- **Title**: Concise outcome statement
- **Subtitle**: Additional context or next-step guidance
- **Actions**: Primary action first, secondary actions after
- **Icon**: Matches status severity and meaning

## Accessibility Considerations

### Semantic Structure
- Uses appropriate heading hierarchy
- Icons have semantic meaning (not decorative)
- Actions are properly labeled buttons

### Color and Contrast
- Status colors meet contrast requirements
- Icons reinforce color-coded status
- Text remains readable on white background

### Keyboard Navigation
- Action buttons are keyboard accessible
- Focus order follows visual hierarchy (title → subtitle → actions)

### Screen Readers
- Title and subtitle are text-based
- Icon alternatives communicated through status
- Button labels describe actions clearly

## Comparison Context

As the only Result component surveyed, Ant Design's implementation serves as the reference pattern. Key characteristics that define the Result component pattern:

1. **Dedicated screen space** - Not inline feedback
2. **Status-driven design** - Icon and color based on outcome
3. **Action orientation** - Guides users to next steps
4. **Multi-part composition** - Icon + title + subtitle + actions
5. **Non-interactive display** - Component shows information, actions in extra prop
6. **Page-level scope** - Typically used for full pages or major sections

## Alternative Approaches

Frameworks without dedicated Result components typically use:
- **Alert/Message components** - For smaller feedback
- **Modal dialogs** - For overlay feedback
- **Custom layouts** - Composing primitives (Card + Icon + Text + Buttons)
- **Empty states** - For no-data scenarios (different use case)

## Raw Data

- [Ant Design](./ant-design/usage-patterns.md)
