# Ant Design - Upload Usage Patterns

## Component URL
https://ant.design/components/upload
Status: ✅ Working (Documentation accessible via legacy version at 4x.ant.design)

## Documentation Quality
Good - Comprehensive API documentation with TypeScript interfaces, though primary 5x documentation site serves minified assets. Legacy 4x documentation and GitHub source provide complete reference.

## Component Definition
- **Core purpose**: Facilitates "the process of publishing information (web pages, text, pictures, video, etc.) to a remote server via a web page or upload tool." Supports single/bulk uploads, progress visualization, and drag-and-drop functionality.
- **Mental model**: A flexible file input abstraction that handles the complete upload lifecycle - from file selection through upload progress to completion state. Functions as both a simple file picker and a sophisticated upload manager with preview, validation, and custom request handling.
- **Semantic meaning**: Communicates file transfer operations to remote servers. Provides visual feedback for upload state (pending, uploading, success, error) and manages file collections with preview and removal capabilities.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Button trigger | ✅ | Children element becomes the upload trigger (typically a Button component) |
| Drag and drop zone | ✅ | `Upload.Dragger` component provides dedicated drag-and-drop area |
| File list display | ✅ | `showUploadList?: boolean \| object` - Controls file list visibility and icon customization |
| Custom item render | ✅ | `itemRender?: function` - Fully custom upload list item rendering |
| Icon customization | ✅ | `iconRender?: function` - Custom icon rendering for file items |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text list | ✅ | `listType="text"` (default) - Simple text-based file list |
| Picture list | ✅ | `listType="picture"` - File list with thumbnail previews |
| Picture card | ✅ | `listType="picture-card"` - Card-style grid layout with large previews |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Uploading | ✅ | `status="uploading"` - Active upload in progress with progress indicator |
| Done/Success | ✅ | `status="done"` or `status="success"` - Upload completed successfully |
| Error | ✅ | `status="error"` - Upload failed, typically shown with error styling |
| Removed | ✅ | `status="removed"` - File removed from list |
| Disabled | ✅ | `disabled?: boolean` - Disables upload button and interactions |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Multiple files | ✅ | `multiple?: boolean` (default: false) - Allow selecting multiple files at once |
| Directory upload | ✅ | `directory?: boolean` (default: false) - Enable folder upload (webkit only) |
| Max count | ✅ | `maxCount?: number` - Limit maximum number of uploadable files |
| File type filtering | ✅ | `accept?: string` - Specify acceptable file types per HTML input accept attribute |
| Preview support | ✅ | `onPreview?: (file) => void` - Callback when preview icon clicked; `previewFile?: (file) => Promise<string>` for custom preview logic |
| Progress display | ✅ | `progress?: ProgressProps` (default: `{strokeWidth: 2, showInfo: false}`) - Configure progress bar appearance |
| Custom request | ✅ | `customRequest?: function` - Override default XHR behavior for complete upload control |
| Validation | ✅ | `beforeUpload?: (file, fileList) => boolean \| Promise<File> \| Upload.LIST_IGNORE` - Pre-upload validation hook |

## Props API

### Core Upload Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `string \| (file) => Promise<string>` | - | Upload endpoint URL (required unless using customRequest) |
| `accept` | `string` | - | File types accepted (HTML input accept attribute format) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `directory` | `boolean` | `false` | Enable directory/folder upload |
| `disabled` | `boolean` | `false` | Disable upload functionality |
| `listType` | `'text' \| 'picture' \| 'picture-card'` | `'text'` | Display style for file list |
| `maxCount` | `number` | - | Maximum number of files that can be uploaded |

### File List Management
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileList` | `UploadFile[]` | - | Controlled file list (for controlled component pattern) |
| `defaultFileList` | `UploadFile[]` | - | Initial uploaded files (for uncontrolled pattern) |
| `showUploadList` | `boolean \| object` | `true` | Show file list; object allows icon customization |
| `itemRender` | `(originNode, file, fileList, actions) => React.ReactNode` | - | Custom render function for upload list items |
| `iconRender` | `(file: UploadFile) => React.ReactNode` | - | Custom icon render function |

### Request Configuration
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `method` | `string` | `'post'` | HTTP method for upload request |
| `name` | `string` | `'file'` | Name of upload field (form data key) |
| `data` | `object \| (file) => object` | - | Additional data to include in upload request |
| `headers` | `object` | - | Custom request headers (IE10+) |
| `withCredentials` | `boolean` | `false` | Include credentials in AJAX request |
| `customRequest` | `function` | - | Override default upload behavior with custom implementation |

### Event Handlers
| Prop | Type | Description |
|------|------|-------------|
| `onChange` | `(info: UploadChangeParam) => void` | Callback fired during all upload state changes |
| `onPreview` | `(file: UploadFile) => void` | Callback when file link or preview icon clicked |
| `onRemove` | `(file: UploadFile) => boolean \| Promise<boolean>` | Callback before file removal; prevents removal if returns false |
| `onDownload` | `(file: UploadFile) => void` | Callback when download button clicked |
| `onDrop` | `(event: React.DragEvent) => void` | Callback when files are dragged and dropped |
| `beforeUpload` | `(file: RcFile, fileList: RcFile[]) => boolean \| Promise<File> \| Upload.LIST_IGNORE` | Pre-upload hook for validation; prevents upload if returns false or rejected Promise |

### Advanced Configuration
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openFileDialogOnClick` | `boolean` | `true` | Open file dialog when clicking component |
| `previewFile` | `(file: File \| Blob) => Promise<string>` | - | Custom preview logic (returns data URL) |
| `progress` | `ProgressProps` | `{strokeWidth: 2, showInfo: false}` | Progress bar configuration |

## UploadFile Interface
```typescript
interface UploadFile<T = any> {
  uid: string;                    // Unique file identifier
  name: string;                   // File name
  fileName?: string;              // Alternative file name
  status?: 'uploading' | 'done' | 'error' | 'removed' | 'success';  // Upload state
  percent?: number;               // Upload progress (0-100)
  url?: string;                   // Download/preview URL
  thumbUrl?: string;              // Thumbnail URL for previews
  originFileObj?: RcFile;         // Original File object
  response?: T;                   // Server response
  error?: any;                    // Error information
  linkProps?: any;                // Props for download link
  type?: string;                  // File MIME type
  size?: number;                  // File size in bytes
  crossOrigin?: 'anonymous' | 'use-credentials' | '';  // CORS setting
}
```

## UploadChangeParam Interface
```typescript
interface UploadChangeParam<T = any> {
  file: UploadFile<T>;           // Current file object
  fileList: UploadFile<T>[];     // Complete file list
  event?: ProgressEvent;          // Upload progress event
}
```

## Usage Patterns

### Basic Upload with Button
```jsx
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

<Upload {...props}>
  <Button icon={<UploadOutlined />}>Click to Upload</Button>
</Upload>
```

### Drag and Drop Upload
```jsx
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

<Dragger
  name="file"
  multiple={true}
  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
  onChange={(info) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }}
  onDrop={(e) => {
    console.log('Dropped files', e.dataTransfer.files);
  }}
>
  <p className="ant-upload-drag-icon">
    <InboxOutlined />
  </p>
  <p className="ant-upload-text">Click or drag file to this area to upload</p>
  <p className="ant-upload-hint">
    Support for a single or bulk upload.
  </p>
</Dragger>
```

### Picture/Avatar Upload with Validation
```jsx
import { Upload, Button, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

<Upload
  name="avatar"
  listType="picture-card"
  className="avatar-uploader"
  showUploadList={false}
  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
  beforeUpload={beforeUpload}
  onChange={(info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get image URL from response
      setImageUrl(info.file.response.url);
      setLoading(false);
    }
  }}
>
  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
</Upload>
```

### Picture Wall (Multiple Images)
```jsx
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const [previewOpen, setPreviewOpen] = useState(false);
const [previewImage, setPreviewImage] = useState('');
const [fileList, setFileList] = useState([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://example.com/image.png',
  },
]);

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
};

const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

<Upload
  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
  listType="picture-card"
  fileList={fileList}
  onPreview={handlePreview}
  onChange={handleChange}
>
  {fileList.length >= 8 ? null : (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )}
</Upload>

<Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
  <img alt="preview" style={{ width: '100%' }} src={previewImage} />
</Modal>
```

### Manual Upload Control
```jsx
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const [fileList, setFileList] = useState([]);
const [uploading, setUploading] = useState(false);

const handleUpload = () => {
  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append('files[]', file);
  });
  setUploading(true);

  fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      setFileList([]);
      message.success('upload successfully.');
    })
    .catch(() => {
      message.error('upload failed.');
    })
    .finally(() => {
      setUploading(false);
    });
};

<Upload
  onRemove={(file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }}
  beforeUpload={(file) => {
    setFileList([...fileList, file]);
    return false;  // Prevent automatic upload
  }}
  fileList={fileList}
>
  <Button icon={<UploadOutlined />}>Select File</Button>
</Upload>
<Button
  type="primary"
  onClick={handleUpload}
  disabled={fileList.length === 0}
  loading={uploading}
  style={{ marginTop: 16 }}
>
  {uploading ? 'Uploading' : 'Start Upload'}
</Button>
```

### Custom Request Implementation
```jsx
import { Upload, message } from 'antd';

const customRequest = async (options) => {
  const { onSuccess, onError, file, onProgress } = options;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.floor((event.loaded / event.total) * 100);
        onProgress({ percent });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        onSuccess(JSON.parse(xhr.response), file);
        message.success('Upload successful');
      } else {
        onError(new Error('Upload failed'));
      }
    });

    xhr.open('POST', 'https://your-upload-endpoint.com/upload');
    xhr.send(formData);
  } catch (error) {
    onError(error);
    message.error('Upload error');
  }
};

<Upload customRequest={customRequest}>
  <Button>Upload with Custom Request</Button>
</Upload>
```

### File Type and Size Validation
```jsx
import { Upload, message } from 'antd';

const beforeUpload = (file) => {
  // Check file type
  const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
  if (!isValidType) {
    message.error('You can only upload JPG/PNG/PDF files!');
    return false;
  }

  // Check file size (< 5MB)
  const isValidSize = file.size / 1024 / 1024 < 5;
  if (!isValidSize) {
    message.error('File must be smaller than 5MB!');
    return false;
  }

  return true;
};

<Upload
  beforeUpload={beforeUpload}
  accept="image/jpeg,image/png,application/pdf"
  maxCount={3}
>
  <Button>Upload (Max 3 files, JPG/PNG/PDF only)</Button>
</Upload>
```

### Exclude Files from List
```jsx
import { Upload, message } from 'antd';

const beforeUpload = (file) => {
  const isValid = file.size / 1024 / 1024 < 2;

  if (!isValid) {
    message.error(`${file.name} is too large. File must be smaller than 2MB.`);
    return Upload.LIST_IGNORE;  // Exclude from file list
  }

  return true;
};

<Upload
  beforeUpload={beforeUpload}
  multiple
>
  <Button>Upload (Invalid files excluded from list)</Button>
</Upload>
```

### Async Validation with Promise
```jsx
import { Upload, message } from 'antd';

const beforeUpload = async (file) => {
  return new Promise((resolve, reject) => {
    // Simulate async validation (e.g., checking file hash, calling API)
    setTimeout(() => {
      const isValid = file.size / 1024 / 1024 < 2;

      if (isValid) {
        resolve(file);
      } else {
        message.error('File validation failed');
        reject();
      }
    }, 1000);
  });
};

<Upload
  beforeUpload={beforeUpload}
  multiple
>
  <Button>Upload with Async Validation</Button>
</Upload>
```

## Variants and Composition

### Upload.Dragger
Specialized drag-and-drop upload area component that inherits all Upload props:

```jsx
import { Upload } from 'antd';
const { Dragger } = Upload;

<Dragger {...uploadProps}>
  {/* Drag drop zone content */}
</Dragger>
```

### ShowUploadList Object Configuration
Detailed control over upload list display:

```jsx
<Upload
  showUploadList={{
    showDownloadIcon: true,
    downloadIcon: 'Download',
    showRemoveIcon: true,
    removeIcon: <DeleteOutlined onClick={(e) => console.log(e, 'custom remove')} />,
    showPreviewIcon: true,
    previewIcon: <EyeOutlined />,
  }}
>
  <Button>Upload</Button>
</Upload>
```

## Accessibility
- Upload trigger is keyboard accessible (click via Enter/Space)
- File dialog opens on trigger activation
- Progress indicators provide visual feedback for screen reader users
- `openFileDialogOnClick` can be disabled for custom keyboard interactions
- CORS configuration via `crossOrigin` prop for accessible image previews

## Responsive Design
- Component adapts to container width
- Picture-card layout flows responsively in grid
- Mobile browsers open native file picker on trigger
- Touch-friendly drag-and-drop on supporting devices
- Progress bars scale to available width

## Theme Integration
- Integrates with Ant Design theme system
- Customizable via Design Tokens (ConfigProvider)
- Supports `prefixCls` for CSS namespace customization
- Progress bar styling via `progress` prop accepts Ant Design ProgressProps
- Icon colors inherit from theme primary color

## Related Components
- **Button**: Primary upload trigger element
- **Progress**: Upload progress visualization
- **Modal**: Preview modal for images
- **Message**: Upload status notifications
- **Form**: Integration with form validation and submission
- **Icon**: Custom icons for upload states (UploadOutlined, InboxOutlined, PlusOutlined, etc.)

## Framework-Specific Features

### React-Specific Patterns
- Controlled/uncontrolled component patterns via `fileList`/`defaultFileList`
- React event handlers for all upload lifecycle events
- ReactNode children for flexible trigger customization
- Ref forwarding via `UploadRef` interface for imperative control

### TypeScript Support
- Comprehensive type definitions for all props and interfaces
- Generic type parameter for custom response types: `Upload<T>`
- Type-safe file status enums
- Strong typing for event callbacks and custom request functions

### rc-upload Integration
- Built on top of rc-upload library for core upload logic
- `customRequest` provides full control over upload implementation
- Exposes rc-upload methods via ref for advanced use cases

### Performance Optimizations
- Lazy preview generation (only when preview triggered)
- Configurable progress bar rendering (`showInfo: false` by default)
- File list virtualization for large file sets (via itemRender)

## Notable Features

### LIST_IGNORE Pattern
Special return value from `beforeUpload` to exclude files from list without blocking upload:
```jsx
beforeUpload={(file) => {
  if (shouldIgnore(file)) {
    return Upload.LIST_IGNORE;
  }
  return true;
}}
```

### Async beforeUpload
Supports Promise-based async validation before upload:
```jsx
beforeUpload={async (file) => {
  const isValid = await validateFileOnServer(file);
  return isValid;
}}
```

### Custom Request Control
Complete override of upload mechanism for integration with custom backends:
```jsx
customRequest={({ file, onSuccess, onError, onProgress }) => {
  // Custom upload implementation
  myUploadFunction(file, { onSuccess, onError, onProgress });
}}
```

### Directory Upload (WebKit)
Folder/directory selection support (Chrome/Edge):
```jsx
<Upload directory>
  <Button>Upload Folder</Button>
</Upload>
```

### Flexible File List Control
Controlled component pattern for full file list management:
```jsx
const [fileList, setFileList] = useState([]);

<Upload
  fileList={fileList}
  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
/>
```

### Progress Customization
Fine-grained progress bar configuration:
```jsx
<Upload
  progress={{
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    showInfo: true,
  }}
/>
```

### Manual Upload Mode
Deferred upload with manual trigger:
```jsx
beforeUpload={(file) => {
  // Add to file list but don't upload yet
  return false;
}}

// Later trigger upload programmatically
handleManualUpload()
```

## Code Examples

All examples above demonstrate actual Ant Design Upload component usage patterns extracted from official documentation and community resources.

## Notes and Observations

### Documentation Access Challenges
- Current 5x documentation site (ant.design) serves heavily minified assets making web scraping difficult
- Legacy 4x documentation (4x.ant.design) provides complete, accessible API reference
- GitHub TypeScript source code serves as authoritative interface definition source
- Community resources (GeeksforGeeks, Stack Overflow) supplement official docs

### Framework Approach Observations

**TypeScript-First Architecture:**
- Comprehensive type definitions with generic support for custom response types
- JSDoc annotations for IDE intellisense
- Strict prop type enforcement prevents runtime errors
- Version tracking via @since annotations

**Lifecycle Management:**
- Complete control over upload lifecycle from selection through completion
- Multiple hooks (beforeUpload, onChange, onProgress, onSuccess, onError) for fine-grained control
- Status-based state machine (uploading → done/error/removed)
- Manual and automatic upload modes supported

**Flexibility Through Composition:**
- Children-based trigger customization (any React element can trigger upload)
- Multiple display modes (text, picture, picture-card) for different use cases
- Dragger component variant for dedicated drag-drop zones
- Custom rendering functions (itemRender, iconRender) for complete visual control

**Validation and Control:**
- Pre-upload validation via beforeUpload with sync/async support
- File filtering via accept prop (HTML5 file input standard)
- Manual upload control by returning false from beforeUpload
- LIST_IGNORE pattern for excluding files without blocking upload
- Max file count enforcement

**Request Customization:**
- Full XHR behavior override via customRequest
- Header customization for authentication
- Additional form data via data prop
- Credential support for CORS scenarios
- HTTP method configuration

**Developer Experience:**
- Rich event system provides visibility into all upload states
- Progress tracking with customizable visualization
- Error handling with detailed callback parameters
- File list management (controlled/uncontrolled patterns)
- Integration with Ant Design message system for user feedback

### Implementation Patterns

**State Management Approaches:**
1. **Uncontrolled**: Using `defaultFileList` for initial state
2. **Controlled**: Using `fileList` + `onChange` for full control
3. **Hybrid**: Using `onChange` for side effects while letting component manage state

**Upload Modes:**
1. **Automatic**: Files upload immediately after selection (default)
2. **Manual**: `beforeUpload` returns false, upload triggered later programmatically
3. **Batched**: Collect multiple files, upload all at once
4. **Progressive**: Upload files one at a time with individual progress tracking

**Validation Strategies:**
1. **Client-side**: File type, size validation in beforeUpload
2. **Async**: Server-side validation returning Promise from beforeUpload
3. **Post-upload**: Server response validation in onChange
4. **Progressive**: Initial validation in beforeUpload, final validation on server response

**Error Handling:**
1. **Rejection**: Return false from beforeUpload to prevent upload
2. **User feedback**: Message component for error notifications
3. **Visual indication**: Error status reflected in file list styling
4. **Retry**: Manual re-upload via custom UI or list actions

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Very comprehensive API covering all upload scenarios
- Excellent TypeScript support with generic types
- Flexible lifecycle hooks for complete control
- Multiple display modes (text, picture, picture-card)
- Built-in drag-and-drop support via Dragger
- Manual upload mode for deferred submission
- LIST_IGNORE pattern for smart file list management
- Custom request implementation for backend flexibility
- Progress customization with gradient support
- Directory upload support (webkit browsers)

**Potential Improvements:**
- Complex API surface requires careful documentation study
- Multiple patterns for same goal can be confusing (controlled vs uncontrolled)
- Heavy reliance on React-specific patterns limits portability
- No built-in image cropping or editing capabilities
- Limited built-in file type icons (requires custom iconRender)
- No built-in chunked upload for large files
- Preview functionality requires manual implementation for non-images

**Alignment with Web Standards:**
- React component (not web component/custom element)
- Uses standard HTML file input under the hood
- Follows HTML5 accept attribute specification
- XMLHttpRequest/Fetch API for uploads (standard but not native form submission)
- Could benefit from FormData integration patterns
- Custom element approach would improve framework independence

**Semantic UI Design Considerations:**
- Consider simpler API with sensible defaults
- Slot-based composition for clearer content areas (trigger, list, preview)
- Native form integration for progressive enhancement
- Built-in common file type icons
- Clearer state visualization patterns
- Web component architecture for framework independence
- Consider chunked upload for large files
- Built-in image preview modal
- Simpler validation prop patterns
- Better accessibility labeling defaults
