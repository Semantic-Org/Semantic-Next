# Ant Design - Tag/Chip Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ant.design/components/tag
Status: ✅ Working
Version: Current (v5.x)
Last Verified: 2025-11-05

## Documentation Quality
Good - Provides comprehensive examples covering basic usage, color variants, interactive patterns (closable, checkable), and dynamic tag management. API documentation includes all major props and their types.

## Component Definition
- **Core purpose**: Tag is a component for categorizing and marking content. Tags allow users to categorize content and display labels that describe attributes or status.
- **Mental model**: Tags are compact, visual elements that represent categories, filters, status indicators, or selections. They can be static labels, removable items (like selected filters), or toggleable selections (like multi-select choices).
- **Semantic meaning**: Tags communicate categorical information, status, or user selections. Closable tags indicate temporary items that can be dismissed. Checkable tags represent selection states similar to checkboxes.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="blue"`, `closable`, `icon={<Icon />}`)
- **Composed**: Via composition/children (e.g., `<Tag>{content}</Tag>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Text passed as children: `<Tag>Label</Tag>` |
| Icons | ✅ | Native + Composed | Via `icon` prop: `<Tag icon={<IconComponent />}>Text</Tag>` or composed: `<Tag><Icon />Text</Tag>`. Documentation recommends composition for specific positioning control. |
| Avatars/Images | ✅ | Composed | Can compose any React component as children, including Avatar components |
| Close/Remove button | ✅ | Native | `closable` prop enables close button, `closeIcon` prop customizes appearance, `onClose` callback for close events |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ✅ | Native | `Tag.CheckableTag` component with `checked` prop. Works like Checkbox - click to toggle. Absolute controlled component requiring `onChange` handler. Icon support added in v5.27.0+ |
| Disabled | ❌ | - | No built-in disabled state mentioned in documentation |
| Loading | ❌ | - | No built-in loading state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | **Preset colors:** `magenta`, `red`, `volcano`, `orange`, `gold`, `lime`, `green`, `cyan`, `blue`, `geekblue`, `purple`. **Status colors:** `success`, `processing`, `error`, `warning`, `default`. **Custom colors:** Accepts hex values like `#f50` or `#2db7f5` via `color` prop |
| Size options | ❌ | - | No built-in size variants (small, medium, large) documented. Size controlled via CSS custom styling |
| Visual variants | ✅ | Native | Bordered (default) vs borderless via `bordered={false}` prop (added in v5.x). Color variants provide different visual styles |
| Bordered/Borderless | ✅ | Native | `bordered` prop (boolean, default: true). Set `bordered={false}` for borderless appearance |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Composed | Can wrap tag in link: `<Tag><a href="...">Link</a></Tag>` or use CheckableTag for toggle behavior |
| Closable/Removable | ✅ | Native | `closable` prop enables close functionality. `onClose` callback executes when tag is closed. `closeIcon` prop customizes close button appearance |
| onClick handler | ✅ | Native | Standard React `onClick` event supported |
| onClose handler | ✅ | Native | `onClose` callback fires when close button is clicked (for closable tags) |

## Code Examples

### Basic Usage
```tsx
import { Tag } from 'antd';

// Simple tag
<Tag>Tag 1</Tag>

// Closable tag with event handler
<Tag closable onClose={(e) => {
  e.preventDefault();
  console.log('Tag closed');
}}>
  Tag 2
</Tag>

// Tag with link
<Tag>
  <a href="https://github.com/ant-design/ant-design">Link</a>
</Tag>
```

### Colorful Tags
```tsx
import { Tag } from 'antd';

// Preset colors
<Tag color="magenta">magenta</Tag>
<Tag color="red">red</Tag>
<Tag color="volcano">volcano</Tag>
<Tag color="orange">orange</Tag>
<Tag color="gold">gold</Tag>
<Tag color="lime">lime</Tag>
<Tag color="green">green</Tag>
<Tag color="cyan">cyan</Tag>
<Tag color="blue">blue</Tag>
<Tag color="geekblue">geekblue</Tag>
<Tag color="purple">purple</Tag>

// Status colors
<Tag color="success">success</Tag>
<Tag color="processing">processing</Tag>
<Tag color="error">error</Tag>
<Tag color="warning">warning</Tag>
<Tag color="default">default</Tag>

// Custom hex colors
<Tag color="#f50">#f50</Tag>
<Tag color="#2db7f5">#2db7f5</Tag>
<Tag color="#87d068">#87d068</Tag>
<Tag color="#108ee9">#108ee9</Tag>
```

### Tag with Icon
```tsx
import { Tag } from 'antd';
import { TwitterOutlined, YoutubeOutlined, FacebookOutlined, LinkedinOutlined } from '@ant-design/icons';

// Using icon prop
<Tag icon={<TwitterOutlined />} color="#55acee">
  Twitter
</Tag>
<Tag icon={<YoutubeOutlined />} color="#cd201f">
  Youtube
</Tag>
<Tag icon={<FacebookOutlined />} color="#3b5999">
  Facebook
</Tag>
<Tag icon={<LinkedinOutlined />} color="#55acee">
  LinkedIn
</Tag>

// Composed icon (for specific positioning control)
<Tag color="blue">
  <TwitterOutlined />
  Twitter
</Tag>
```

### Checkable Tag
```tsx
import { Tag } from 'antd';
import { useState } from 'react';

const { CheckableTag } = Tag;

const tagsData = ['Movies', 'Books', 'Music', 'Sports'];

function CheckableTagExample() {
  const [selectedTags, setSelectedTags] = useState(['Books']);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  return (
    <>
      <span style={{ marginRight: 8 }}>Categories:</span>
      {tagsData.map((tag) => (
        <CheckableTag
          key={tag}
          checked={selectedTags.includes(tag)}
          onChange={(checked) => handleChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      ))}
    </>
  );
}
```

### Borderless Tags
```tsx
import { Tag, Space } from 'antd';

<Space size={[0, 'small']} wrap>
  <Tag bordered={false}>Tag 1</Tag>
  <Tag bordered={false}>Tag 2</Tag>
  <Tag bordered={false} closable>
    Tag 3
  </Tag>
  <Tag bordered={false} closable>
    Tag 4
  </Tag>
  <Tag bordered={false} color="processing">
    processing
  </Tag>
  <Tag bordered={false} color="success">
    success
  </Tag>
  <Tag bordered={false} color="error">
    error
  </Tag>
  <Tag bordered={false} color="warning">
    warning
  </Tag>
</Space>
```

### Dynamic Tags (Add/Remove)
```tsx
import { Tag, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';

function DynamicTags() {
  const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <>
      {tags.map((tag, index) => {
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable={index !== 0}
            onClose={() => handleClose(tag)}
          >
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
}
```

[View Live](https://ant.design/components/tag) *(official documentation)*

## Notable Features
- **Dual tag types**: Regular `Tag` for labels and status, `CheckableTag` for selections
- **Rich color system**: Preset semantic colors, status colors, and custom hex colors
- **Flexible icon integration**: Both native `icon` prop and composed approach supported
- **Controlled CheckableTag**: CheckableTag is an absolute controlled component with no uncontrolled mode, requiring explicit state management
- **Borderless variant**: Modern borderless aesthetic available via `bordered={false}` prop (v5.x+)
- **Dynamic tag management**: Built-in support for add/remove patterns with animations using `rc-tween-one`
- **Long text handling**: Can combine with Tooltip for truncated long tags
- **Close customization**: `closeIcon` prop allows custom close button appearance

## API Reference

### Tag Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `closable` | boolean | false | Whether the Tag can be closed |
| `closeIcon` | ReactNode | - | Custom close icon |
| `color` | string | - | Color of the Tag (preset colors, status colors, or hex values) |
| `icon` | ReactNode | - | Set the icon of Tag |
| `bordered` | boolean | true | Whether has border style |
| `onClose` | (e) => void | - | Callback executed when close animation is completed |
| `onClick` | (e) => void | - | Callback executed when tag is clicked |

### Tag.CheckableTag Props
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `checked` | boolean | false | Checked status of Tag |
| `onChange` | (checked) => void | - | Callback executed when Tag is checked/unchecked |
| `icon` | ReactNode | - | Set the icon of CheckableTag (v5.27.0+) |

## Research Notes
- The Ant Design documentation site uses heavy client-side rendering, making automated extraction challenging
- Documentation accessed from multiple versions (4.x and 5.x) to gather comprehensive information
- The `bordered` prop was added in v5.x for borderless tags
- CheckableTag icon support was added in v5.27.0
- No built-in size variants documented; sizing would require custom CSS
- No built-in disabled state for regular Tag (though CheckableTag can be made non-interactive via `onChange` handling)
- Animation support relies on external library `rc-tween-one` for dynamic add/remove animations
- Documentation recommends composing icons as children rather than using `icon` prop when specific positioning control is needed
