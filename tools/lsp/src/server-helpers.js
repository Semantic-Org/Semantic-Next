/*
  Pure helper functions extracted from server.js for testability.
  These are the core logic for context detection, word extraction,
  and documentation formatting — no LSP connection dependencies.
*/

/*
  Determines what kind of completion context the cursor is in.
*/
export function getCompletionContext(text, offset) {
  let braceDepth = 0;
  let j = offset - 1;
  while (j >= 0) {
    if (text[j] === '}') { braceDepth++; }
    if (text[j] === '{') {
      braceDepth--;
      if (braceDepth < 0) {
        // We're inside a { } expression
        const afterBrace = text.substring(j + 1, offset).trimStart();

        if (afterBrace.startsWith('#')) {
          return { type: 'block' };
        }
        if (afterBrace.startsWith('>')) {
          return { type: 'reference' };
        }
        return { type: 'expression' };
      }
    }
    j--;
  }

  // Check if inside an HTML tag
  const beforeCursor = text.substring(Math.max(0, offset - 200), offset);

  // @event binding
  if (beforeCursor.match(/@\w*$/)) {
    return { type: 'event-binding' };
  }

  // Inside an attribute value: <ui-button size="|
  const attrValueMatch = beforeCursor.match(/<([\w-]+)\s+[^>]*?([\w-]+)\s*=\s*["']([^"']*)$/);
  if (attrValueMatch) {
    return {
      type: 'attribute-value',
      tagName: attrValueMatch[1],
      attributeName: attrValueMatch[2],
    };
  }

  // Inside a tag but not in an attribute value: <ui-button |
  const tagMatch = beforeCursor.match(/<([\w-]+)\s+[^>]*$/);
  if (tagMatch) {
    return { type: 'html-attribute', tagName: tagMatch[1] };
  }

  // After <: tag name completion
  if (beforeCursor.match(/<[\w-]*$/)) {
    return { type: 'html-tag' };
  }

  return { type: 'none' };
}

export function getWordAtOffset(text, offset) {
  let start = offset;
  let end = offset;
  while (start > 0 && /[\w.]/.test(text[start - 1])) { start--; }
  while (end < text.length && /[\w.]/.test(text[end])) { end++; }
  const word = text.substring(start, end);
  // Strip dots from edges
  return word.replace(/^\.+|\.+$/g, '') || null;
}

export function formatAttributeDoc(attr, meta, spec) {
  let doc = '';
  if (meta.name) { doc += `**${meta.name}**\n\n`; }
  if (meta.description) { doc += `${meta.description}\n\n`; }
  const type = spec.propertyTypes[attr];
  if (type) { doc += `Type: \`${type}\`\n\n`; }
  const values = spec.allowedValues[attr];
  if (values?.length) { doc += `Values: ${values.map(v => `\`${v}\``).join(', ')}\n\n`; }
  if (meta.exampleCode) {
    const example = Array.isArray(meta.exampleCode) ? meta.exampleCode[0] : meta.exampleCode;
    doc += `\`\`\`html\n${example.trim()}\n\`\`\``;
  }
  return doc;
}
