import { createMarkdownProcessor } from '@astrojs/markdown-remark';

const processor = await createMarkdownProcessor();

// Strips the wrapping <p> for single-line content so callers can inline the result.
export const renderMarkdownInline = async (content) => {
  const { code } = await processor.render(content);
  return code.indexOf('<p>') === 0 && code.indexOf('</p>') === code.length - 4
    ? code.slice(3, -4)
    : code;
};
