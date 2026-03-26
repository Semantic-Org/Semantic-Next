# Ant Design - QR Code Usage Patterns

> Last Modified: 2025-11-05

## Component URL
[https://ant.design/components/qr-code/](https://ant.design/components/qr-code/)
Status: ✅ Working
Version: antd@5.1.0+ (added in v5.1.0, enhanced with custom status rendering in v5.20.0+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured with clear API documentation, multiple working examples, error correction explanations, and practical patterns for common use cases.

## Component Definition
- **Core purpose**: Converts text/URLs into machine-readable QR codes for data encoding, sharing, and scanning workflows
- **Mental model**: A utility component that transforms user data into visual QR representations; users think of it as "encode this text into a scannable code"
- **Semantic meaning**: Represents data that can be shared or transferred via scanning; often used for contact info, URLs, payment info, or authentication codes

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text/URL encoding | ✅ | Native | `value` prop accepts string or string array for batch QR code generation |
| Icon/Logo overlay | ✅ | Native | `icon` prop (URL) with optional `iconSize` for embedded logos in QR center |
| Error correction | ✅ | Native | `errorLevel` prop with 4 levels (L/M/Q/H) for recovery capability |
| Custom status display | ✅ | Native | `status` prop (active/expired/loading/scanned) with custom rendering support (v5.20.0+) |
| Download capability | ✅ | Native | Built-in download functionality in interactive examples |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Canvas rendering | ✅ | Native | `type="canvas"` (default) - performant, native browser API |
| SVG rendering | ✅ | Native | `type="svg"` - scalable, better for certain use cases |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop (number, default: 160px) - fully customizable dimensions |
| Color customization | ✅ | Native | `color` prop for QR code shade (default: #000), `bgColor` for background (default: transparent) |
| Border options | ✅ | Native | `bordered` prop (boolean, default: true) - toggles border styling |
| Download capability | ✅ | Native | Integrated download button in status displays; users can download generated QR codes |
| Batch generation | ✅ | Native | `value` prop accepts string[] for generating multiple QR codes simultaneously |

## Code Examples

### Primary Usage - Basic QR Code
```jsx
import { QRCode } from 'antd';

export default () => <QRCode value="https://ant.design" />;
```

### With Icon/Logo Overlay
```jsx
import { QRCode } from 'antd';

export default () => (
  <QRCode
    value="https://ant.design"
    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPVeWJV.png"
    size={256}
    iconSize={64}
  />
);
```

### With Custom Colors
```jsx
import { QRCode } from 'antd';

export default () => (
  <QRCode
    value="https://ant.design"
    color="#1890ff"
    bgColor="#ffffff"
    size={200}
  />
);
```

### With Error Correction Levels
```jsx
import { QRCode } from 'antd';
import { Space } from 'antd';

export default () => (
  <Space direction="vertical">
    <QRCode value="https://ant.design" errorLevel="L" title="Level L - 7% recovery" />
    <QRCode value="https://ant.design" errorLevel="M" title="Level M - 15% recovery" />
    <QRCode value="https://ant.design" errorLevel="Q" title="Level Q - 25% recovery" />
    <QRCode value="https://ant.design" errorLevel="H" title="Level H - 30% recovery" />
  </Space>
);
```

### With Rendering Type Options
```jsx
import { QRCode } from 'antd';
import { Space, Radio } from 'antd';
import { useState } from 'react';

export default () => {
  const [type, setType] = useState('canvas');
  return (
    <Space direction="vertical">
      <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
        <Radio value="canvas">Canvas (Performance)</Radio>
        <Radio value="svg">SVG (Scalability)</Radio>
      </Radio.Group>
      <QRCode value="https://ant.design" type={type} />
    </Space>
  );
};
```

### With Status Management
```jsx
import { QRCode } from 'antd';
import { Space, Button } from 'antd';
import { useState } from 'react';

export default () => {
  const [status, setStatus] = useState('active');
  return (
    <Space direction="vertical">
      <Button.Group>
        <Button onClick={() => setStatus('active')}>Active</Button>
        <Button onClick={() => setStatus('expired')}>Expired</Button>
        <Button onClick={() => setStatus('loading')}>Loading</Button>
        <Button onClick={() => setStatus('scanned')}>Scanned</Button>
      </Button.Group>
      <QRCode
        value="https://ant.design"
        status={status}
        icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPVeWJV.png"
      />
    </Space>
  );
};
```

### Batch Generation - Multiple QR Codes
```jsx
import { QRCode } from 'antd';
import { Space } from 'antd';

export default () => (
  <Space wrap>
    <QRCode value={['https://ant.design', 'https://github.com']} />
  </Space>
);
```

### With Custom Status Rendering (v5.20.0+)
```jsx
import { QRCode } from 'antd';
import { Button, Space } from 'antd';
import { useState } from 'react';

export default () => {
  const [status, setStatus] = useState('active');

  return (
    <QRCode
      value="https://ant.design"
      status={status}
      statusRender={() => (
        <Space direction="vertical" align="center">
          <span>Custom Status Display</span>
          <Button onClick={() => setStatus('scanned')}>Mark Scanned</Button>
        </Space>
      )}
    />
  );
};
```

### With SVG Type and Border Toggle
```jsx
import { QRCode } from 'antd';
import { Checkbox, Space } from 'antd';
import { useState } from 'react';

export default () => {
  const [bordered, setBordered] = useState(true);
  return (
    <Space direction="vertical">
      <Checkbox checked={bordered} onChange={(e) => setBordered(e.target.checked)}>
        Show Border
      </Checkbox>
      <QRCode
        value="https://ant.design"
        type="svg"
        bordered={bordered}
        size={200}
      />
    </Space>
  );
};
```

## Notable Features
- **Flexible Value Input**: Accepts single string or array of strings for batch QR code generation without component repetition
- **Dual Rendering Strategies**: Canvas for performance-critical scenarios (default), SVG for scalability and quality printing
- **Sophisticated Status System**: Four distinct states (active, expired, loading, scanned) enable workflow management and user feedback
- **Error Recovery Guarantees**: Explicit error correction levels (L/M/Q/H) allow developers to balance data density with scannability - higher levels handle larger logos and partial damage
- **Transparent Background Default**: BGColor defaults to transparent rather than white, enabling better integration with various UI backgrounds
- **Logo Integration at Core API**: Icon embedding is first-class, not an afterthought - supports both URL and sizing configuration
- **Custom Status Rendering**: v5.20.0+ enhancement enables full customization of status displays, replacing default UI entirely
- **Download Integration Ready**: Component provides structural support for download functionality through status rendering patterns

## API Properties (Complete Reference)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string \| string[] | Required | QR code content or array for batch generation |
| type | 'canvas' \| 'svg' | 'canvas' | Rendering method; canvas preferred for performance, svg for scalability |
| size | number | 160 | Dimensions in pixels; applies to both width and height |
| color | string | '#000' | QR code color (hex format recommended) |
| bgColor | string | 'transparent' | Background color (hex format; transparent enables layering) |
| icon | string | — | Image URL for logo overlay in QR center |
| iconSize | number \| { width: number; height: number } | — | Logo dimensions; auto-scales if number provided |
| errorLevel | 'L' \| 'M' \| 'Q' \| 'H' | 'M' | Error correction level: L(7%), M(15%), Q(25%), H(30%) |
| status | 'active' \| 'expired' \| 'loading' \| 'scanned' | 'active' | Visual state indicator for workflow management |
| bordered | boolean | true | Whether to display border styling |
| statusRender | (status: string) => ReactNode | — | Custom renderer for status display (v5.20.0+) |

## Research Notes
- Documentation is well-organized with clear distinctions between canvas and SVG rendering approaches
- Error correction levels are explicitly explained with percentage recovery capabilities, helping developers make informed choices for their data density requirements
- No difficulty accessing documentation - the component is thoroughly documented with multiple interactive examples
- Framework's approach prioritizes practical use cases: status management suggests this component is designed for QR code workflows (scanning, expiration, payment confirmation) rather than just static generation
- Logo embedding at API level demonstrates that Ant Design recognizes icon overlays as a common real-world requirement for branded QR codes
- The component handles both single and batch generation patterns elegantly through array value support
- Version tracking (introduced v5.1.0, enhanced v5.20.0) shows active maintenance and feature addition over time
