# Message Component - URL Verification

> Framework documentation URLs for Message/Alert/Notification components
> Created: 2025-11-04

## Framework URLs

### Ant Design
- **URL**: https://ant.design/components/message
- **Component Name**: Message
- **Status**: ✅ To be verified
- **Notes**: Ant Design has separate Message (temporary feedback) and Alert (static notices) components

### Chakra UI
- **URL**: https://chakra-ui.com/docs/components/alert (v3)
- **URL**: https://v2.chakra-ui.com/docs/components/alert (v2)
- **Component Name**: Alert
- **Status**: ✅ To be verified
- **Notes**: Chakra uses "Alert" for message displays. Also has Toast for notifications.

### Headless UI
- **URL**: N/A
- **Component Name**: None
- **Status**: ❌ Not Available
- **Notes**: Headless UI does not provide a Message/Alert component (headless library with minimal components)

### HeroUI
- **URL**: https://www.heroui.com/docs/components/snippet
- **Component Name**: Snippet (closest equivalent)
- **Status**: ⚠️ Alternative
- **Notes**: HeroUI doesn't have a dedicated Message component. Snippet is used for code/text with copy functionality. May need to check for Alert/Banner components.

### Mantine
- **URL**: https://mantine.dev/core/alert
- **Component Name**: Alert
- **Status**: ✅ To be verified
- **Notes**: Mantine uses "Alert" for message displays. Also has Notification system.

### MUI (Material UI)
- **URL**: https://mui.com/material-ui/react-alert
- **Component Name**: Alert
- **Status**: ✅ To be verified
- **Notes**: MUI uses "Alert" based on Material Design spec

### Nuxt UI
- **URL**: https://ui.nuxt.com/components/alert
- **Component Name**: Alert
- **Status**: ✅ To be verified
- **Notes**: Nuxt UI uses "Alert" for message displays

### PrimeReact
- **URL**: https://primereact.org/message
- **Component Name**: Message / Messages
- **Status**: ✅ To be verified
- **Notes**: PrimeReact has both Message (single) and Messages (multiple) components

### Radix UI
- **URL**: N/A (Primitives don't include Alert)
- **Component Name**: None in Primitives
- **Alternative**: https://www.radix-ui.com/themes/docs/components/callout
- **Status**: ⚠️ Alternative (Themes only)
- **Notes**: Radix Primitives doesn't have Alert/Message. Radix Themes has "Callout" component.

### Semantic UI Classic
- **URL**: https://semantic-ui.com/collections/message.html
- **Component Name**: Message
- **Status**: ✅ To be verified
- **Notes**: Semantic UI uses "Message" terminology

### ShadCN
- **URL**: https://ui.shadcn.com/docs/components/alert
- **Component Name**: Alert
- **Status**: ✅ To be verified
- **Notes**: ShadCN uses "Alert" built on Radix UI primitives

## Terminology Notes

**Message vs Alert vs Notification**:
- **Message**: Often used for temporary feedback messages (Ant Design, PrimeReact, Semantic UI)
- **Alert**: Static informational boxes embedded in content (Chakra, MUI, Mantine, ShadCN, Nuxt UI)
- **Notification/Toast**: Temporary overlays, typically positioned at edges (separate component in most frameworks)
- **Callout**: Radix Themes terminology for informational boxes

## Frameworks Included in Research
1. ✅ Ant Design - Message
2. ✅ Chakra UI - Alert
3. ❌ Headless UI - Not available
4. ⚠️ HeroUI - No direct equivalent
5. ✅ Mantine - Alert
6. ✅ MUI - Alert
7. ✅ Nuxt UI - Alert
8. ✅ PrimeReact - Message
9. ✅ Radix UI - Callout (Themes)
10. ✅ Semantic UI Classic - Message
11. ✅ ShadCN - Alert

**Research Count**: 9 frameworks with direct Message/Alert components, 2 with alternatives or not available

## Component Scope Clarification

For this research, we're focusing on **static/embedded message/alert components**, not:
- Toast notifications (temporary overlays)
- Snackbars (bottom notifications)
- Banner messages (full-width notifications)

The component typically:
- Displays informational, warning, error, or success messages
- Is embedded inline within content flow
- Has semantic meaning (info, success, warning, error)
- Can be dismissible or static
- May include icons, titles, descriptions, and actions
