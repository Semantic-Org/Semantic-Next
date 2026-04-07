/*
  Pure helper functions extracted from server.js for testability.
  These are the core logic for context detection, word extraction,
  and documentation formatting — no LSP connection dependencies.
*/

const blockJoiners = {
  each: ['in', 'as'],
  async: ['as'],
};

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
          // {# or {#partial → show block names
          // {#if condition → past the keyword, show expressions
          const blockMatch = afterBrace.match(/^#(\w*)/);
          const keyword = blockMatch?.[1] || '';
          const afterKeyword = afterBrace.substring(1 + keyword.length);
          if (!afterKeyword.match(/\s/)) {
            // Still typing the keyword: {# or {#if (no space yet)
            return { type: 'block' };
          }
          // Past the keyword — check for block-specific joining keywords
          const blockPrefix = afterKeyword.match(/(\w*)$/)?.[1] || '';
          const joiners = blockJoiners[keyword];
          if (joiners) {
            const args = afterKeyword.trimStart();
            // Check if a joiner keyword has already been typed
            const hasJoiner = joiners.some(j => new RegExp(`\\b${j}\\b`).test(args));
            if (!hasJoiner) {
              // {#each item | or {#each item, i | → suggest joiners
              // But not right after comma: {#each item,| → naming index variable
              const endsWithComma = /,\s*$/.test(args.substring(0, args.length - blockPrefix.length));
              if (!endsWithComma) {
                const tokens = args.split(/[\s,]+/).filter(Boolean);
                if (tokens.length >= 1) {
                  return { type: 'block-joiner', keyword, joiners, prefix: blockPrefix };
                }
              }
            }
          }
          return { type: 'expression', prefix: blockPrefix };
        }
        if (afterBrace.startsWith('>')) {
          const refMatch = afterBrace.match(/^>\s*(\w*)/);
          const refName = refMatch?.[1] || '';
          const afterRef = afterBrace.substring(1 + (refMatch?.[0].length - 1 || 0));
          if (!afterRef.match(/\s/)) {
            // Still typing the name: {> or {>slo
            return { type: 'reference' };
          }
          // Past the name — context depends on what was referenced
          if (refName === 'slot') {
            // {>slot name} — no key=value syntax, just an optional slot name
            return { type: 'none' };
          }
          // {>templateName key=value} or {>template name='x'}
          const refPrefix = afterRef.match(/(\w*)$/)?.[1] || '';
          return { type: 'expression', prefix: refPrefix };
        }
        // Extract the current word being typed for filtering
        const prefix = afterBrace.match(/(\w*)$/)?.[1] || '';
        return { type: 'expression', prefix };
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
