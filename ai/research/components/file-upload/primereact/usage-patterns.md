# PrimeReact - FileUpload Component

## Component Definition

The FileUpload component in PrimeReact is an advanced file upload solution with comprehensive features including drag-and-drop support, multi-file uploads, auto uploading, progress tracking, and validations. It provides both a basic mode for simple use cases and an advanced mode with rich UI interactions. The component is designed to handle file selection, validation, upload operations, and provides extensive customization through templates and event handlers. PrimeReact's FileUpload follows modern file upload UX patterns while maintaining accessibility standards.

---

## Core Features

### Dual Mode System

1. **Advanced Mode (Default)**: Full-featured UI with drag-and-drop area, file list preview, progress indicators, and action buttons
2. **Basic Mode**: Simplified single-button interface for straightforward file selection without additional UI complexity

### Key Capabilities

- **Drag and Drop**: Native support for dragging files into designated upload area
- **Multi-File Selection**: Handle multiple files simultaneously with the `multiple` prop
- **Auto Upload**: Immediate upload on file selection via the `auto` prop
- **Progress Tracking**: Visual feedback during upload operations
- **File Validation**: Built-in validation for file types and file size limits
- **Custom Upload Logic**: Override default upload behavior with custom handlers
- **Template System**: Comprehensive template customization for all UI elements
- **Accessibility**: Screen reader support with hidden native file input

---

## Props API

### Core Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | - | Name attribute for the file input field, used in upload requests |
| `url` | `string` | - | Backend endpoint URL for file uploads |
| `mode` | `'basic' \| 'advanced'` | `'advanced'` | UI mode - basic shows single button, advanced shows full upload interface |
| `multiple` | `boolean` | `false` | Enables selection of multiple files |
| `accept` | `string` | - | Comma-separated MIME types or file extensions (e.g., "image/*", ".pdf,.doc") |
| `disabled` | `boolean` | `false` | When true, disables the file upload component |
| `auto` | `boolean` | `false` | Automatically uploads files immediately after selection |
| `maxFileSize` | `number` | - | Maximum file size in bytes; files exceeding this are rejected |
| `customUpload` | `boolean` | `false` | Enables custom upload handler instead of default HTTP upload |
| `chooseLabel` | `string` | `'Choose'` | Label text for the file selection button |
| `uploadLabel` | `string` | `'Upload'` | Label text for the upload button (advanced mode) |
| `cancelLabel` | `string` | `'Cancel'` | Label text for the cancel button (advanced mode) |

### Template Props

| Property | Type | Description |
|----------|------|-------------|
| `headerTemplate` | `ReactNode \| function` | Custom content for the header area above the file list |
| `itemTemplate` | `function(file, props)` | Custom renderer for each file item in the list |
| `emptyTemplate` | `ReactNode \| function` | Content displayed when no files are selected (typically drag-drop message) |
| `chooseOptions` | `object` | Configuration object for customizing the choose button (icon, className, style) |
| `uploadOptions` | `object` | Configuration object for customizing the upload button (icon, className, style) |
| `cancelOptions` | `object` | Configuration object for customizing the cancel button (icon, className, style) |

### Event Handlers

| Event | Parameters | Description |
|-------|------------|-------------|
| `onUpload` | `event: { xhr: XMLHttpRequest, files: File[] }` | Callback invoked when upload completes successfully |
| `onSelect` | `event: { originalEvent: Event, files: File[] }` | Callback invoked when files are selected |
| `onError` | `event: { xhr: XMLHttpRequest, files: File[] }` | Callback invoked when upload fails or validation errors occur |
| `onClear` | `event: { }` | Callback invoked when all files are removed/cleared |
| `onBeforeUpload` | `event: { xhr: XMLHttpRequest, formData: FormData }` | Callback invoked before upload begins, allows modification |
| `onBeforeSend` | `event: { xhr: XMLHttpRequest, formData: FormData }` | Callback invoked before sending request, allows header modification |
| `onProgress` | `event: { originalEvent: ProgressEvent, progress: number }` | Callback invoked during upload to track progress |
| `onValidationFail` | `event: { file: File }` | Callback invoked when file fails validation (size/type) |
| `uploadHandler` | `event: { files: File[], options: object }` | Custom upload function when `customUpload` is true |

### Styling Props

| Property | Type | Description |
|----------|------|-------------|
| `className` | `string` | CSS class name(s) for the component container |
| `style` | `object` | Inline styles for the component container |
| `contentClassName` | `string` | CSS class for the content area |
| `contentStyle` | `object` | Inline styles for the content area |

### Additional Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `withCredentials` | `boolean` | `false` | Send cookies/credentials with upload requests |
| `previewWidth` | `number` | `50` | Width of image preview thumbnails in pixels |
| `invalidFileSizeMessageSummary` | `string` | `'{0}: Invalid file size'` | Summary message template for size validation errors |
| `invalidFileSizeMessageDetail` | `string` | `'Maximum upload size is {0}'` | Detail message template for size validation errors |
| `invalidFileTypeMessageSummary` | `string` | `'{0}: Invalid file type'` | Summary message template for type validation errors |
| `invalidFileTypeMessageDetail` | `string` | `'Allowed file types: {0}'` | Detail message template for type validation errors |

---

## Usage Patterns

### Basic File Upload

The simplest implementation using basic mode with file type and size restrictions:

```jsx
import { FileUpload } from 'primereact/fileupload';

function BasicUpload() {
  const onUpload = (event) => {
    console.log('Files uploaded successfully', event.files);
  };

  return (
    <FileUpload
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      maxFileSize={1000000}
      onUpload={onUpload}
    />
  );
}
```

### Advanced Mode with Drag and Drop

Full-featured upload interface with drag-and-drop area:

```jsx
function AdvancedUpload() {
  return (
    <FileUpload
      name="demo[]"
      url="/api/upload"
      multiple
      accept="image/*"
      maxFileSize={1000000}
      emptyTemplate={
        <p className="m-0">
          Drag and drop files here to upload.
        </p>
      }
    />
  );
}
```

### Multiple File Upload

Allow users to select and upload multiple files at once:

```jsx
function MultipleFileUpload() {
  const onSelect = (event) => {
    console.log('Files selected:', event.files);
  };

  return (
    <FileUpload
      name="documents[]"
      url="/api/upload/documents"
      multiple
      accept=".pdf,.doc,.docx,.txt"
      maxFileSize={5000000}
      onSelect={onSelect}
      emptyTemplate={
        <p>Select one or more files to upload (PDF, DOC, DOCX, TXT)</p>
      }
    />
  );
}
```

### Auto Upload

Automatically upload files immediately upon selection:

```jsx
function AutoUpload() {
  const onUpload = (event) => {
    console.log('Auto-uploaded:', event.files);
  };

  return (
    <FileUpload
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      maxFileSize={1000000}
      onUpload={onUpload}
      auto
      chooseLabel="Browse"
    />
  );
}
```

### Custom Upload Handler

Override default upload behavior with custom logic (e.g., base64 encoding):

```jsx
function CustomUploadExample() {
  const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
      const base64data = reader.result;
      console.log('Base64 encoded:', base64data);
      // Send base64data to your API
    };

    reader.readAsDataURL(file);
  };

  return (
    <FileUpload
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      customUpload
      uploadHandler={customBase64Uploader}
    />
  );
}
```

### With File Validation

Implement comprehensive file validation with error handling:

```jsx
function ValidatedUpload() {
  const onValidationFail = (event) => {
    console.error('Validation failed for:', event.file.name);
  };

  const onError = (event) => {
    console.error('Upload error:', event);
  };

  return (
    <FileUpload
      name="validated[]"
      url="/api/upload"
      multiple
      accept="image/jpeg,image/png,image/gif"
      maxFileSize={2000000}
      onValidationFail={onValidationFail}
      onError={onError}
      invalidFileSizeMessageSummary="{0}: File is too large"
      invalidFileSizeMessageDetail="Maximum file size is 2MB"
      invalidFileTypeMessageSummary="{0}: Invalid file type"
      invalidFileTypeMessageDetail="Only JPEG, PNG, and GIF images are allowed"
    />
  );
}
```

---

## Variants and Composition

### Basic Mode Variant

Minimal UI with single button for straightforward file selection:

```jsx
function BasicModeExample() {
  return (
    <FileUpload
      mode="basic"
      name="simple[]"
      url="/api/upload"
      chooseLabel="Select File"
      className="simple-upload"
    />
  );
}
```

### Advanced Mode Variant (Default)

Full-featured interface with file list, progress, and action buttons:

```jsx
function AdvancedModeExample() {
  return (
    <FileUpload
      name="advanced[]"
      url="/api/upload"
      multiple
      chooseLabel="Select"
      uploadLabel="Upload Files"
      cancelLabel="Clear All"
    />
  );
}
```

### Custom Button Styling

Customize appearance of action buttons using options objects:

```jsx
function CustomButtonsUpload() {
  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined'
  };

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded'
  };

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded'
  };

  return (
    <FileUpload
      name="custom[]"
      url="/api/upload"
      multiple
      chooseOptions={chooseOptions}
      uploadOptions={uploadOptions}
      cancelOptions={cancelOptions}
    />
  );
}
```

---

## Accessibility

### Screen Reader Support

The FileUpload component uses a hidden native `<input type="file">` element to ensure compatibility with screen readers. The visible UI elements are enhanced overlays that trigger the native file input when activated.

**Implementation Details:**
- Native file input remains in DOM for accessibility
- Visual elements are properly labeled and associated
- File selection announcements through standard input behavior

### Keyboard Navigation

All interactive elements (choose, upload, cancel buttons) function as standard buttons with full keyboard support:

- **Tab/Shift+Tab**: Navigate between upload component buttons
- **Enter/Space**: Activate focused button (choose files, upload, cancel)
- **Escape**: Close file dialog (browser default behavior)

### ARIA Attributes

The component implements appropriate ARIA attributes for:
- Button roles on interactive elements
- State communication (disabled, busy during upload)
- File list announcements

### Focus Management

- Focus returns to trigger button after file dialog closes
- Clear focus indicators on all interactive elements
- Logical tab order through upload interface

---

## Responsive Design

The FileUpload component adapts to different screen sizes:

- **Desktop**: Full interface with drag-and-drop area and file preview
- **Tablet**: Maintains full functionality with optimized touch targets
- **Mobile**: Responsive button sizing and list layouts
- **Touch Devices**: Enhanced drag-and-drop with touch event support

The component automatically adjusts its layout based on available space while maintaining full functionality across all devices.

---

## Theme Integration

### PrimeReact Theme System

The FileUpload component fully integrates with PrimeReact's theming system:

```jsx
// Component inherits theme from PrimeReact context
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';

function App() {
  return (
    <PrimeReactProvider>
      <FileUpload name="themed[]" url="/api/upload" />
    </PrimeReactProvider>
  );
}
```

### Custom Styling

Apply custom styles through className and style props:

```jsx
function StyledUpload() {
  return (
    <FileUpload
      name="styled[]"
      url="/api/upload"
      className="custom-upload-component"
      style={{ border: '2px dashed #ccc', borderRadius: '8px' }}
      contentClassName="upload-content-area"
      contentStyle={{ padding: '2rem' }}
    />
  );
}
```

### CSS Customization

Target specific component parts with CSS:

```css
/* Container styling */
.custom-upload-component {
  background: #f8f9fa;
  border-radius: 12px;
}

/* Drag area styling */
.p-fileupload-content {
  border: 2px dashed #dee2e6;
  padding: 2rem;
}

/* File item styling */
.p-fileupload-row {
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

/* Button styling */
.p-fileupload-choose {
  background: #007bff;
  border-color: #007bff;
}
```

---

## Template Customization

### Empty Template

Customize the message shown when no files are selected:

```jsx
function EmptyTemplateExample() {
  const emptyTemplate = (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <i className="pi pi-cloud-upload" style={{ fontSize: '3rem', color: '#ccc' }}></i>
      <p>Drag and drop files here</p>
      <p style={{ fontSize: '0.9rem', color: '#999' }}>
        or click to browse (max 10MB)
      </p>
    </div>
  );

  return (
    <FileUpload
      name="empty[]"
      url="/api/upload"
      emptyTemplate={emptyTemplate}
    />
  );
}
```

### Item Template

Customize how each file appears in the list:

```jsx
function ItemTemplateExample() {
  const itemTemplate = (file, props) => {
    return (
      <div className="file-item">
        <img
          alt={file.name}
          role="presentation"
          src={file.objectURL}
          width={100}
        />
        <div className="file-details">
          <span className="file-name">{file.name}</span>
          <span className="file-size">{formatSize(file.size)}</span>
        </div>
        <button
          type="button"
          className="p-button-danger"
          onClick={() => props.onRemove()}
        >
          Remove
        </button>
      </div>
    );
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <FileUpload
      name="items[]"
      url="/api/upload"
      itemTemplate={itemTemplate}
    />
  );
}
```

### Header Template

Add custom header content above the file list:

```jsx
function HeaderTemplateExample() {
  const headerTemplate = (options) => {
    const { chooseButton, uploadButton, cancelButton } = options;

    return (
      <div className="upload-header">
        <h3>Upload Documents</h3>
        <div className="upload-actions">
          {chooseButton}
          {uploadButton}
          {cancelButton}
        </div>
      </div>
    );
  };

  return (
    <FileUpload
      name="header[]"
      url="/api/upload"
      headerTemplate={headerTemplate}
    />
  );
}
```

---

## Integration Patterns

### With Progress Toast

Show upload progress in toast notifications:

```jsx
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

function UploadWithToast() {
  const toast = useRef(null);

  const onUpload = (event) => {
    toast.current.show({
      severity: 'success',
      summary: 'Upload Complete',
      detail: `${event.files.length} file(s) uploaded successfully`
    });
  };

  const onError = (event) => {
    toast.current.show({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'An error occurred during upload'
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <FileUpload
        name="toast[]"
        url="/api/upload"
        onUpload={onUpload}
        onError={onError}
      />
    </>
  );
}
```

### With Form Integration

Integrate file upload into a larger form:

```jsx
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';

function FormWithUpload() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSelect = (event) => {
    setFiles(event.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    files.forEach(file => data.append('files[]', file));

    // Submit form data
    await fetch('/api/submit', { method: 'POST', body: data });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <InputText
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <InputText
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="field">
        <label>Attachments</label>
        <FileUpload
          name="files[]"
          customUpload
          onSelect={handleSelect}
          multiple
        />
      </div>

      <Button type="submit" label="Submit" />
    </form>
  );
}
```

### With Authentication

Include authentication headers in upload requests:

```jsx
function AuthenticatedUpload() {
  const onBeforeSend = (event) => {
    const token = localStorage.getItem('authToken');
    event.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  };

  return (
    <FileUpload
      name="secure[]"
      url="/api/secure/upload"
      withCredentials
      onBeforeSend={onBeforeSend}
    />
  );
}
```

### With Progress Tracking

Monitor and display upload progress:

```jsx
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';

function ProgressTrackedUpload() {
  const [progress, setProgress] = useState(0);

  const onProgress = (event) => {
    setProgress(event.progress);
  };

  const onUpload = () => {
    setProgress(0);
  };

  return (
    <>
      <FileUpload
        name="progress[]"
        url="/api/upload"
        onProgress={onProgress}
        onUpload={onUpload}
      />
      {progress > 0 && progress < 100 && (
        <ProgressBar value={progress} />
      )}
    </>
  );
}
```

---

## Related Components

### Toast
Used for displaying upload notifications and feedback messages to users during and after upload operations.

### ProgressBar
Provides visual feedback for upload progress, often used in conjunction with the `onProgress` event handler.

### Button
Used for customizing upload action buttons through the `chooseOptions`, `uploadOptions`, and `cancelOptions` props.

### Message
Displays validation errors, upload failures, or informational messages related to the upload process.

### Dialog
Can contain FileUpload component for modal-based file selection and upload workflows.

### Panel
Groups file upload functionality with related controls and information in a collapsible section.

---

## Framework-Specific Features

### React Integration

The FileUpload component is built specifically for React and leverages React patterns:

**Ref Support:**
```jsx
import { useRef } from 'react';

function UploadWithRef() {
  const fileUploadRef = useRef(null);

  const clearFiles = () => {
    fileUploadRef.current.clear();
  };

  return (
    <>
      <FileUpload ref={fileUploadRef} name="ref[]" url="/api/upload" />
      <button onClick={clearFiles}>Clear All Files</button>
    </>
  );
}
```

**State Management:**
```jsx
import { useState } from 'react';

function StatefulUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onUpload = (event) => {
    setUploadedFiles([...uploadedFiles, ...event.files]);
  };

  return (
    <>
      <FileUpload
        name="state[]"
        url="/api/upload"
        onUpload={onUpload}
      />
      <div>
        <h4>Uploaded Files ({uploadedFiles.length}):</h4>
        <ul>
          {uploadedFiles.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

### TypeScript Support

PrimeReact provides full TypeScript definitions:

```typescript
import { FileUpload, FileUploadSelectEvent, FileUploadUploadEvent } from 'primereact/fileupload';

interface FileUploadComponentProps {
  maxSize: number;
  endpoint: string;
}

const TypedFileUpload: React.FC<FileUploadComponentProps> = ({ maxSize, endpoint }) => {
  const handleSelect = (e: FileUploadSelectEvent) => {
    console.log('Selected files:', e.files);
  };

  const handleUpload = (e: FileUploadUploadEvent) => {
    console.log('Upload complete:', e.files);
  };

  return (
    <FileUpload
      name="typed[]"
      url={endpoint}
      maxFileSize={maxSize}
      onSelect={handleSelect}
      onUpload={handleUpload}
    />
  );
};
```

### PrimeReact Context Integration

The component automatically integrates with PrimeReact's global configuration:

```jsx
import { PrimeReactProvider } from 'primereact/api';

function App() {
  const value = {
    ripple: true,
    inputStyle: 'outlined',
    locale: 'en'
  };

  return (
    <PrimeReactProvider value={value}>
      <FileUpload name="context[]" url="/api/upload" />
    </PrimeReactProvider>
  );
}
```

---

## Code Examples

### Example 1: Image Gallery Uploader

A complete image upload interface with preview thumbnails:

```jsx
import { useState, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';

function ImageGalleryUploader() {
  const [images, setImages] = useState([]);
  const toast = useRef(null);

  const itemTemplate = (file, props) => {
    return (
      <div className="gallery-item">
        <Image
          src={file.objectURL}
          alt={file.name}
          width="100"
          preview
        />
        <div className="image-info">
          <span className="name">{file.name}</span>
          <span className="size">{formatSize(file.size)}</span>
        </div>
        <button
          type="button"
          onClick={() => props.onRemove()}
          className="p-button-danger p-button-icon-only"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>
    );
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onUpload = (event) => {
    setImages([...images, ...event.files]);
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Images uploaded successfully'
    });
  };

  const emptyTemplate = (
    <div className="empty-state">
      <i className="pi pi-image" style={{ fontSize: '3em', color: '#ccc' }}></i>
      <p>Drag and drop images here to upload</p>
    </div>
  );

  return (
    <div className="gallery-uploader">
      <Toast ref={toast} />
      <FileUpload
        name="gallery[]"
        url="/api/gallery/upload"
        multiple
        accept="image/*"
        maxFileSize={5000000}
        onUpload={onUpload}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
      />
    </div>
  );
}
```

### Example 2: Document Upload with Validation

Professional document uploader with comprehensive validation:

```jsx
import { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

function DocumentUploader() {
  const toast = useRef(null);
  const fileUploadRef = useRef(null);

  const onValidationFail = (file) => {
    toast.current.show({
      severity: 'error',
      summary: 'Validation Error',
      detail: `${file.name} failed validation`,
      life: 3000
    });
  };

  const onBeforeUpload = (event) => {
    // Add metadata to the upload
    event.formData.append('uploadedBy', 'user123');
    event.formData.append('timestamp', new Date().toISOString());
  };

  const itemTemplate = (file, props) => {
    const getFileIcon = (name) => {
      if (name.endsWith('.pdf')) return 'pi-file-pdf';
      if (name.endsWith('.doc') || name.endsWith('.docx')) return 'pi-file-word';
      if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'pi-file-excel';
      return 'pi-file';
    };

    return (
      <div className="document-item">
        <i className={`pi ${getFileIcon(file.name)}`} style={{ fontSize: '2em' }}></i>
        <div className="document-details">
          <span className="document-name">{file.name}</span>
          <small className="document-size">{(file.size / 1024).toFixed(2)} KB</small>
        </div>
        <Tag value="Ready" severity="success" />
        <button
          type="button"
          onClick={() => props.onRemove()}
          className="p-button-text p-button-danger"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>
    );
  };

  const headerTemplate = (options) => {
    const { chooseButton, uploadButton, cancelButton } = options;

    return (
      <div className="upload-header">
        <div className="header-content">
          <h3>Upload Documents</h3>
          <p>Accepted: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
        </div>
        <div className="header-actions">
          {chooseButton}
          {uploadButton}
          {cancelButton}
        </div>
      </div>
    );
  };

  return (
    <div className="document-uploader">
      <Toast ref={toast} />
      <FileUpload
        ref={fileUploadRef}
        name="documents[]"
        url="/api/documents/upload"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        maxFileSize={10000000}
        onValidationFail={onValidationFail}
        onBeforeUpload={onBeforeUpload}
        itemTemplate={itemTemplate}
        headerTemplate={headerTemplate}
        emptyTemplate={<p>Drag and drop documents here to upload.</p>}
      />
    </div>
  );
}
```

### Example 3: Avatar Upload with Preview

Single image upload for user avatar with immediate preview:

```jsx
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Avatar } from 'primereact/avatar';

function AvatarUpload() {
  const [avatarUrl, setAvatarUrl] = useState(null);

  const customUploadHandler = async (event) => {
    const file = event.files[0];

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Avatar uploaded:', data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        {avatarUrl ? (
          <Avatar image={avatarUrl} size="xlarge" shape="circle" />
        ) : (
          <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
        )}
      </div>
      <FileUpload
        mode="basic"
        name="avatar"
        accept="image/*"
        maxFileSize={1000000}
        customUpload
        uploadHandler={customUploadHandler}
        auto
        chooseLabel="Upload Avatar"
      />
    </div>
  );
}
```

---

## Notes and Observations

### Strengths

1. **Dual Mode Flexibility**: The choice between basic and advanced modes allows developers to match UI complexity to use case requirements
2. **Comprehensive Event System**: Extensive event handlers cover the entire upload lifecycle from selection through completion or error
3. **Template Customization**: Rich template system enables complete UI customization while maintaining core functionality
4. **Built-in Validation**: File type and size validation are built-in, reducing custom validation code
5. **Accessibility First**: Native file input foundation ensures screen reader compatibility
6. **Progress Tracking**: Built-in progress events enable real-time upload feedback
7. **Custom Upload Logic**: `customUpload` prop allows complete control over upload implementation
8. **Theme Integration**: Seamless integration with PrimeReact's comprehensive theming system

### Implementation Patterns

1. **Progressive Enhancement**: Basic mode provides fallback for simple use cases, advanced mode offers rich interactions
2. **Declarative Configuration**: Props-based configuration makes component behavior explicit and predictable
3. **Separation of Concerns**: Upload logic, validation, and UI rendering are cleanly separated
4. **Template Composition**: Template system allows incremental UI customization without breaking functionality
5. **Event-Driven Architecture**: Comprehensive events enable loose coupling with parent components

### Best Practices

1. **Always Set maxFileSize**: Prevent server overload by validating file sizes client-side
2. **Use Appropriate Mode**: Choose basic mode for simple uploads, advanced for rich interactions
3. **Provide Clear Empty State**: Use `emptyTemplate` to guide users on acceptable file types and actions
4. **Handle All Events**: Implement `onError` and `onValidationFail` for robust error handling
5. **Customize Validation Messages**: Override default messages to match application voice and localization
6. **Consider Auto Upload**: Use `auto` prop for single-file uploads to reduce user actions
7. **Implement Progress Feedback**: Use `onProgress` with visual indicators for large file uploads
8. **Secure Upload Endpoints**: Use `onBeforeSend` to add authentication headers
9. **Validate Server-Side**: Client validation is UX enhancement, not security measure
10. **Test Accessibility**: Verify screen reader functionality and keyboard navigation

### Common Use Cases

1. **Profile Picture Upload**: Basic mode with image preview and auto-upload
2. **Document Management**: Advanced mode with multiple file types and custom item templates
3. **Form Attachments**: Integrated with form submission using custom upload handler
4. **Media Gallery**: Advanced mode with thumbnail previews and drag-and-drop
5. **Bulk Data Import**: Multiple file upload with progress tracking and validation
6. **Resume/CV Upload**: Single file with type restrictions and size validation
7. **Invoice Processing**: PDF upload with custom metadata in upload request

### Framework Considerations

1. **React Patterns**: Component fully embraces React patterns including refs, state, and hooks
2. **TypeScript Support**: Complete type definitions available for type-safe development
3. **PrimeReact Ecosystem**: Integrates seamlessly with other PrimeReact components (Toast, Dialog, etc.)
4. **Theme Compatibility**: Works with all PrimeReact themes without modification
5. **Pass Through Props**: Supports PrimeReact's pass-through prop system for deep customization

---

**Research Date**: 2025-11-06
**Component**: FileUpload
**Framework**: PrimeReact
**Documentation**: https://primereact.org/fileupload
**Version**: Current stable release
