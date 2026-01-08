# Ant Design - Modal Component

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/modal
Status: ✅ Working
Version: 5.x (Latest)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent API documentation with detailed property descriptions, usage patterns, and design guidance.

## Component Definition
- **Core purpose**: Creates floating dialogs that overlay the current page content, requiring user interaction without navigation to a new page. Supports multiple presentation modes (standard modal, confirmation dialogs, alerts).
- **Mental model**: A modal dialog system with multiple presentation styles - standard modal for custom content, plus convenience functions for common patterns (confirm, info, success, error, warning).
- **Semantic meaning**: Communicates intent through presentation style and content positioning. Separates user interactions into a focused layer, indicating action requires response before continuing.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `open`, `centered`, `confirmLoading`, `okText`, `cancelText`)
- **Composed**: Via composition/children (e.g., Modal body content, custom footer)
- **Hook-based**: `Modal.useModal()` hook for imperative modal creation
- **Static Methods**: `Modal.confirm()`, `Modal.info()`, `Modal.success()`, `Modal.error()`, `Modal.warning()` for convenience dialogs

---

## Component Overview

The Ant Design Modal component provides a flexible dialog system for displaying content that requires user attention or interaction. It offers both declarative component syntax and imperative hook-based creation methods.

### Key Distinctions
- **Modal component**: Declarative, state-controlled modal dialogs
- **Static methods**: Imperative convenience dialogs (confirm, alert-style)
- **Modal.useModal hook**: Programmatic creation with Promise-based interactions

### Use Cases
- Form submission in a focused modal context
- Confirmation dialogs for destructive actions
- Alert notifications requiring acknowledgment
- Complex content displayed in an overlay layer
- Nested modal support (multiple modals stacked)

---

## Usage Patterns

### Basic Usage

#### Standard Modal Dialog
```jsx
import { Button, Modal } from 'antd';
import { useState } from 'react';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log('OK clicked');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};
```

#### Modal with Custom Content
```jsx
<Modal title="User Details" open={open} onOk={handleOk} onCancel={handleCancel}>
  <form>
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="Email" />
  </form>
</Modal>
```

### Variants/Styles

#### Confirmation Dialog
```jsx
const showConfirm = () => {
  Modal.confirm({
    title: 'Confirm',
    content: 'Do you want to continue?',
    okText: 'Yes',
    cancelText: 'No',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};
```

#### Info Alert
```jsx
const showInfo = () => {
  Modal.info({
    title: 'Information',
    content: 'This is an informational message',
  });
};
```

#### Success Alert
```jsx
const showSuccess = () => {
  Modal.success({
    title: 'Success',
    content: 'Operation completed successfully',
  });
};
```

#### Error Alert
```jsx
const showError = () => {
  Modal.error({
    title: 'Error',
    content: 'An error occurred during the operation',
  });
};
```

#### Warning Alert
```jsx
const showWarning = () => {
  Modal.warning({
    title: 'Warning',
    content: 'Please be careful with this action',
  });
};
```

### States

#### Open/Closed State
```jsx
// Control via 'open' prop (replaces 'visible' in v5)
<Modal
  title="Modal"
  open={isOpen}
  onOk={() => setIsOpen(false)}
  onCancel={() => setIsOpen(false)}
>
  Content
</Modal>
```

#### Loading State
```jsx
const [loading, setLoading] = useState(false);

const handleOk = async () => {
  setLoading(true);
  // Perform async operation
  await fetchData();
  setLoading(false);
};

<Modal
  title="Processing"
  open={isOpen}
  onOk={handleOk}
  onCancel={() => setIsOpen(false)}
  confirmLoading={loading}
>
  Please wait...
</Modal>
```

#### Disabled State
```jsx
<Modal
  title="Modal"
  open={isOpen}
  okButtonProps={{ disabled: true }}
  cancelButtonProps={{ disabled: false }}
>
  Content
</Modal>
```

### Sizing Options

#### Default Size
```jsx
<Modal title="Standard Modal" open={open} onOk={handleOk} onCancel={handleCancel}>
  Content
</Modal>
```

#### Custom Width
```jsx
<Modal
  title="Wide Modal"
  open={open}
  width={800}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Content with more width
</Modal>
```

#### Full Width (for responsive design)
```jsx
<Modal
  title="Responsive Modal"
  open={open}
  width="90%"
  onOk={handleOk}
  onCancel={handleCancel}
>
  Content
</Modal>
```

### Layout & Positioning

#### Centered Modal (Vertical Center)
```jsx
<Modal
  title="Centered Modal"
  open={isOpen}
  centered
  onOk={handleOk}
  onCancel={handleCancel}
>
  Vertically centered content
</Modal>
```

#### Top-Aligned Modal (Default)
```jsx
<Modal
  title="Top-Aligned Modal"
  open={isOpen}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Appears at top with margin
</Modal>
```

#### Custom Position via CSS
```jsx
<Modal
  title="Custom Position"
  open={isOpen}
  style={{ top: '200px' }}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Custom positioned modal
</Modal>
```

#### Full Screen / Maximize
```jsx
<Modal
  title="Full Screen Modal"
  open={isOpen}
  width="100%"
  style={{ top: 0 }}
  bodyStyle={{ height: 'calc(100vh - 108px)' }}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Full screen content
</Modal>
```

### Content & Structure

#### Standard Structure (Header, Body, Footer)
```jsx
<Modal
  title="Modal Title"
  open={isOpen}
  onOk={handleOk}
  onCancel={handleCancel}
>
  {/* Body content */}
  <p>Modal content goes here</p>
</Modal>
```

#### Custom Header
```jsx
<Modal
  title={<span style={{ color: 'red' }}>Important</span>}
  open={isOpen}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Content
</Modal>
```

#### No Header (Full Content Modal)
```jsx
<Modal
  open={isOpen}
  title={null}
  footer={null}
  onCancel={handleCancel}
>
  Full content without header
</Modal>
```

#### Custom Footer
```jsx
<Modal
  title="Custom Footer"
  open={isOpen}
  footer={[
    <Button key="back" onClick={handleCancel}>
      Back
    </Button>,
    <Button key="submit" type="primary" onClick={handleOk}>
      Submit
    </Button>,
  ]}
  onCancel={handleCancel}
>
  Content with custom action buttons
</Modal>
```

#### No Footer
```jsx
<Modal
  title="No Footer"
  open={isOpen}
  footer={null}
  onCancel={handleCancel}
>
  Content without action buttons
</Modal>
```

#### Custom Body Styling
```jsx
<Modal
  title="Custom Styled Body"
  open={isOpen}
  bodyStyle={{
    backgroundColor: '#f5f5f5',
    padding: '24px',
    maxHeight: '400px',
    overflowY: 'auto',
  }}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Scrollable content
</Modal>
```

### Interactive Features

#### Async Form Submission
```jsx
const [loading, setLoading] = useState(false);

const handleOk = async () => {
  setLoading(true);
  try {
    await submitForm();
    message.success('Form submitted');
    setIsOpen(false);
  } catch (error) {
    message.error('Submission failed');
  } finally {
    setLoading(false);
  }
};

<Modal
  title="Form Submission"
  open={isOpen}
  onOk={handleOk}
  onCancel={() => setIsOpen(false)}
  confirmLoading={loading}
>
  {/* Form content */}
</Modal>
```

#### Confirmation Dialog with Async Operation
```jsx
const showDeleteConfirm = () => {
  Modal.confirm({
    title: 'Delete Item',
    content: 'Are you sure you want to delete this item?',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await deleteItem();
        message.success('Item deleted');
      } catch (error) {
        message.error('Deletion failed');
      }
    },
  });
};
```

#### Closable Modal (X Button)
```jsx
<Modal
  title="Modal"
  open={isOpen}
  closable={true} // Shows close button
  onOk={handleOk}
  onCancel={handleCancel}
>
  Content
</Modal>
```

#### Prevent Close on Mask Click
```jsx
<Modal
  title="Important Modal"
  open={isOpen}
  maskClosable={false}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Cannot be closed by clicking the mask
</Modal>
```

#### Modal with Escape Key Disabled
```jsx
<Modal
  title="Modal"
  open={isOpen}
  keyboard={false}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Cannot be closed by pressing Escape
</Modal>
```

### Animation & Transitions

#### Default Animations
```jsx
// Modal has built-in animation/transition
<Modal
  title="Animated Modal"
  open={isOpen}
  transitionName="zoom"
  maskTransitionName="fade"
  onOk={handleOk}
  onCancel={handleCancel}
>
  Default zoom animation
</Modal>
```

#### Custom Transition
```jsx
<Modal
  title="Custom Transition"
  open={isOpen}
  transitionName="slide"
  maskTransitionName="fade"
  onOk={handleOk}
  onCancel={handleCancel}
>
  Custom transition animation
</Modal>
```

#### Lifecycle Callbacks
```jsx
<Modal
  title="Lifecycle Modal"
  open={isOpen}
  afterOpenChange={(open) => {
    if (open) {
      console.log('Modal opened');
    }
  }}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Content
</Modal>
```

### Integration Patterns

#### Modal with Form
```jsx
import { Form, Input, Modal } from 'antd';

const [form] = Form.useForm();

const handleOk = async () => {
  try {
    const values = await form.validateFields();
    console.log('Form values:', values);
    setIsOpen(false);
  } catch (error) {
    console.error('Validation failed');
  }
};

<Modal
  title="User Form"
  open={isOpen}
  onOk={handleOk}
  onCancel={() => {
    form.resetFields();
    setIsOpen(false);
  }}
>
  <Form form={form} layout="vertical">
    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
      <Input />
    </Form.Item>
  </Form>
</Modal>
```

#### Nested Modals
```jsx
const [isModal1Open, setIsModal1Open] = useState(false);
const [isModal2Open, setIsModal2Open] = useState(false);

return (
  <>
    <Button onClick={() => setIsModal1Open(true)}>Open Modal 1</Button>
    <Modal
      title="Modal 1"
      open={isModal1Open}
      onOk={() => setIsModal1Open(false)}
      onCancel={() => setIsModal1Open(false)}
    >
      <Button onClick={() => setIsModal2Open(true)}>Open Modal 2</Button>
      <Modal
        title="Modal 2"
        open={isModal2Open}
        onOk={() => setIsModal2Open(false)}
        onCancel={() => setIsModal2Open(false)}
      >
        Nested modal content
      </Modal>
    </Modal>
  </>
);
```

#### Modal with Table
```jsx
const [selectedRows, setSelectedRows] = useState([]);

<Modal
  title="Select Items"
  open={isOpen}
  onOk={() => {
    console.log('Selected:', selectedRows);
    setIsOpen(false);
  }}
  onCancel={() => setIsOpen(false)}
>
  <Table
    dataSource={data}
    columns={columns}
    rowSelection={{
      onChange: setSelectedRows,
    }}
  />
</Modal>
```

### Accessibility Features

#### ARIA Labels
```jsx
<Modal
  title="Create User"
  open={isOpen}
  aria-label="Create user dialog"
  aria-labelledby="create-user-title"
  onOk={handleOk}
  onCancel={handleCancel}
>
  <div id="create-user-title">Fill out the form below</div>
  {/* Form content */}
</Modal>
```

#### Keyboard Navigation
```jsx
<Modal
  title="Modal"
  open={isOpen}
  keyboard={true} // Enable Escape key to close
  okButtonProps={{
    autoFocus: true, // Focus OK button on open
  }}
  onOk={handleOk}
  onCancel={handleCancel}
>
  Content
  {/* Tab navigation works through form elements */}
</Modal>
```

#### Focus Management
```jsx
<Modal
  title="Modal with Focus"
  open={isOpen}
  autoFocus="cancelButton" // Set initial focus
  onOk={handleOk}
  onCancel={handleCancel}
>
  Modal automatically manages focus for accessibility
</Modal>
```

#### Screen Reader Support
```jsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button
      aria-label="Open information dialog"
      onClick={() => setIsOpen(true)}
    >
      More Info
    </Button>
    <Modal
      title="Information"
      open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <h2 id="modal-title">Information Dialog</h2>
      <p>Screen readers will read this content</p>
    </Modal>
  </>
);
```

---

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls modal visibility. Replaces `visible` from v4 |
| `title` | `ReactNode` | - | Modal title, can be a string or JSX element |
| `closable` | `boolean` | `true` | Shows close (X) button in modal header |
| `onOk` | `() => void` | - | Callback when OK button is clicked |
| `onCancel` | `() => void` | - | Callback when Cancel button or mask is clicked |
| `okText` | `ReactNode` | `Ok` | Text of OK button |
| `cancelText` | `ReactNode` | `Cancel` | Text of Cancel button |
| `okType` | `string` | `primary` | Button type of OK button (primary, default, dashed, etc.) |
| `cancelButtonProps` | `ButtonProps` | - | Props to apply to Cancel button |
| `okButtonProps` | `ButtonProps` | - | Props to apply to OK button |
| `footer` | `ReactNode \| null` | [Cancel, OK buttons] | Custom footer content or null to hide |
| `confirmLoading` | `boolean` | `false` | Shows loading indicator on OK button when true |
| `centered` | `boolean` | `false` | Vertically centers the modal on screen |
| `width` | `string \| number` | `520` | Width of modal dialog in pixels or percentage |
| `style` | `CSSProperties` | - | Inline styles for the modal |
| `bodyStyle` | `CSSProperties` | - | Inline styles for the modal body |
| `maskStyle` | `CSSProperties` | - | Inline styles for the modal mask/overlay |
| `wrapClassName` | `string` | - | CSS class for the modal wrapper |
| `className` | `string` | - | CSS class for the modal dialog |
| `mask` | `boolean` | `true` | Shows mask (overlay) behind modal |
| `maskClosable` | `boolean` | `true` | Closes modal when mask is clicked |
| `keyboard` | `boolean` | `true` | Closes modal when Escape key is pressed |
| `transitionName` | `string` | `zoom` | Animation name (zoom, slide, etc.) |
| `maskTransitionName` | `string` | `fade` | Mask animation name |
| `destroyOnClose` | `boolean` | `false` | Unmounts modal content when closed |
| `forceRender` | `boolean` | `false` | Forces rendering of modal content even when closed |
| `getContainer` | `() => HTMLElement` | - | Container element for modal portal |
| `zIndex` | `number` | `1000` | Z-index of modal |
| `afterClose` | `() => void` | - | Callback after modal is fully closed (animation complete) |
| `afterOpenChange` | `(open: boolean) => void` | - | Callback after modal open/close animation completes |
| `children` | `ReactNode` | - | Modal body content |

---

## Code Examples

### Example 1: Basic Modal
```jsx
import { Button, Modal } from 'antd';
import { useState } from 'react';

export default function BasicModal() {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    console.log('OK clicked');
    setOpen(false);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>This is a simple modal dialog.</p>
        <p>Click OK or Cancel to close the modal.</p>
      </Modal>
    </>
  );
}
```

### Example 2: Form in Modal
```jsx
import { Button, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';

export default function ModalWithForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Form submitted:', values);
      message.success('Form submitted successfully');
      setOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Please fill out all required fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open Form Modal
      </Button>
      <Modal
        title="User Registration"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email format' }
            ]}
          >
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
```

### Example 3: Confirmation Dialog
```jsx
import { Button, Modal, message } from 'antd';

export default function ConfirmationDialog() {
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Keep it',
      onOk() {
        message.success('Item deleted successfully');
      },
      onCancel() {
        message.info('Item preserved');
      },
    });
  };

  return (
    <Button danger onClick={showDeleteConfirm}>
      Delete Item
    </Button>
  );
}
```

### Example 4: Centered Modal with Custom Footer
```jsx
import { Button, Modal, Space } from 'antd';
import { useState } from 'react';

export default function CenteredModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Centered Modal
      </Button>
      <Modal
        title="Centered Modal"
        open={open}
        centered
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Back
          </Button>,
          <Button key="submit" type="primary" onClick={() => setOpen(false)}>
            Submit
          </Button>,
        ]}
        onCancel={() => setOpen(false)}
      >
        <p>This modal is vertically centered on the screen.</p>
        <p>Custom footer with multiple action buttons.</p>
      </Modal>
    </>
  );
}
```

### Example 5: Async Modal with Hook
```jsx
import { Button, Modal, message } from 'antd';

export default function AsyncModal() {
  const [modal, contextHolder] = Modal.useModal();

  const showAsyncConfirm = async () => {
    try {
      await modal.confirm({
        title: 'Async Operation',
        content: 'This operation will take some time. Continue?',
      });
      // User clicked OK
      message.loading('Processing...');
      // Simulate async operation
      setTimeout(() => {
        message.success('Operation completed');
      }, 2000);
    } catch (e) {
      // User clicked Cancel
      message.info('Operation cancelled');
    }
  };

  return (
    <>
      {contextHolder}
      <Button onClick={showAsyncConfirm}>
        Show Async Confirmation
      </Button>
    </>
  );
}
```

---

## Accessibility Notes

### Current State
- Ant Design Modal has good accessibility support with ARIA attributes
- Modal automatically manages focus when opened
- Escape key support for closing (configurable via `keyboard` prop)
- Proper focus restoration when modal closes

### Best Practices

1. **Use `title` or `aria-label`**: Always provide a title to identify the modal purpose
```jsx
<Modal title="Confirm Action" open={open} onOk={handleOk} onCancel={handleCancel}>
  Content
</Modal>
```

2. **Set initial focus**: Use `autoFocus` prop to focus important elements
```jsx
<Modal okButtonProps={{ autoFocus: true }}>Content</Modal>
```

3. **Keyboard navigation**: Ensure form elements within modal are keyboard navigable
```jsx
<Modal keyboard={true}> {/* Enable Escape to close */}
  <Form>{/* Form fields should be tab-navigable */}</Form>
</Modal>
```

4. **ARIA Labels for complex content**: Add additional ARIA labels when needed
```jsx
<Modal
  aria-labelledby="modal-title"
  open={open}
  onCancel={handleCancel}
>
  <h2 id="modal-title">Action Required</h2>
</Modal>
```

5. **Focus trap**: Modal automatically traps focus within the dialog
- Users can only tab through modal content
- Focus returns to trigger element when closed

---

## Common Patterns

### 1. Confirmation Dialog Pattern
Used for destructive actions that need user confirmation.

```jsx
const handleDelete = () => {
  Modal.confirm({
    title: 'Delete?',
    content: 'This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    onOk() {
      // Perform deletion
    },
  });
};
```

### 2. Form in Modal Pattern
Most common use case - collecting user input in a modal.

```jsx
const [form] = Form.useForm();
const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    // Submit form
  } catch (error) {
    // Validation failed
  }
};
```

### 3. Async Loading Pattern
Modal shows loading state during async operation.

```jsx
const [loading, setLoading] = useState(false);
const handleOk = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```

### 4. Controlled Modal Pattern
Parent component manages modal state.

```jsx
const [visible, setVisible] = useState(false);
<Modal open={visible} onCancel={() => setVisible(false)} />
```

### 5. Programmatic Modal (Hook) Pattern
Using Modal.useModal() for imperative modal creation.

```jsx
const [modal, contextHolder] = Modal.useModal();
const handleOpen = async () => {
  try {
    await modal.confirm({...});
  } catch (e) {
    // Handle cancel
  }
};
```

### 6. Static Confirmation Methods
Quick confirmation dialogs without state management.

```jsx
Modal.confirm({...}); // Confirmation
Modal.info({...});    // Info alert
Modal.success({...}); // Success message
Modal.error({...});   // Error alert
Modal.warning({...}); // Warning message
```

---

## Related Components

- **Form**: Often used inside modals for data collection
- **Popconfirm**: Simpler confirmation dialog (no modal overlay)
- **Drawer**: Alternative side-panel for complex content
- **Tooltip**: For contextual information
- **Message**: For simple notifications
- **Notification**: For persistent alerts

---

## Notable Features

### 1. Multiple Presentation Styles
- Standard modal with custom content
- Five static methods (confirm, info, success, error, warning)
- Convenient for different message types

### 2. Promise-Based Hook API
- `Modal.useModal()` returns Promise-based modal
- Allows `await modal.confirm({...})` syntax
- Clean async/await pattern for modal interactions

### 3. Form Integration
- Modal naturally combines with Form component
- Automatic focus management
- Keyboard navigation support

### 4. Flexible Content
- Any React component can be modal content
- Custom footer allows button customization
- No footer option for content-only modals

### 5. Animation Support
- Built-in zoom animation for modal
- Built-in fade animation for mask
- Customizable transition names

### 6. Loading State
- `confirmLoading` prop disables OK button and shows loading indicator
- Perfect for async form submissions

### 7. State Preservation
- Modal content remains in memory by default
- `destroyOnClose` unmounts content on close
- `forceRender` renders content even when hidden

### 8. Keyboard Support
- Escape key closes modal (configurable)
- Tab navigation within modal
- Focus trap ensures accessibility

### 9. Customization
- Custom button text via `okText`/`cancelText`
- Custom button props via `okButtonProps`/`cancelButtonProps`
- Custom styles via `style`, `bodyStyle`, `maskStyle`
- Custom classes via `className`, `wrapClassName`

### 10. Lifecycle Hooks
- `afterClose()`: Called when close animation completes
- `afterOpenChange()`: Called when open state changes after animation

---

## Research Notes

### Access & Documentation
- Documentation successfully accessed at https://ant.design/components/modal
- Comprehensive API reference with version annotations
- Clear examples and best practices provided

### Framework Approach Observations

**API Design:**
- Clean separation between component and static methods
- Hook-based API adds modern async/await pattern
- Props naming is intuitive (e.g., `open`, `confirmLoading`)

**Presentation Styles:**
- Five static methods (confirm, info, success, error, warning) cover common patterns
- Reduces boilerplate for simple dialogs
- Standard Modal component for complex custom content

**State Management:**
- Controlled component pattern via `open` prop
- Internal state for convenience methods
- Both declarative and imperative patterns supported

**Focus Management:**
- Automatic focus trap within modal
- Focus restoration on close
- `autoFocus` prop for setting initial focus

**Animation:**
- Smooth zoom-in for modal
- Fade-in for mask overlay
- Customizable transition names

**Loading States:**
- `confirmLoading` prop for async operations
- Prevents multiple submissions
- Clear visual feedback

**Content Flexibility:**
- Any React content can be modal body
- Null footer removes action buttons
- Custom footer for complex layouts

**Integration:**
- Works seamlessly with Form component
- Integrates with message/notification system
- Nests cleanly for multi-level dialogs

**Customization:**
- Extensive prop API for customization
- CSS classes for styling internal parts
- Inline styles for quick customization

**Accessibility:**
- Good baseline accessibility
- ARIA attributes present
- Focus management automatic
- Keyboard navigation supported

---

## Version Information

- **Current Version**: 5.x
- **Key Changes from v4**:
  - `open` prop replaces `visible`
  - Hook-based API (`Modal.useModal()`)
  - Improved TypeScript support
  - Enhanced design token system
  - Better accessibility features

---

**Research completed:** 2025-11-05
**Component:** Modal
**Framework:** Ant Design
**Documentation:** https://ant.design/components/modal
**Last Verified:** 2025-11-05
