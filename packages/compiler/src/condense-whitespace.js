/*
  Whitespace condensing for template strings, run before parsing.

  Cross-line whitespace is removed only when both sides are tag or block
  boundaries — indentation between elements is formatting. Runs touching
  text or an expression collapse to a single space, which is rendering-
  neutral under normal `white-space`, so {first}\n{last} reads "first last".
  Same-line spacing always survives: "same line means the space is real".

  Runs in the browser for every runtime-compiled template, so it stays a
  single pass over the source string. The parser then scans fewer bytes.
*/

const RAW_TEXT_TAGS = new Set(['pre', 'textarea', 'script', 'style']);

// {#block} {/block} {>template} and branch keywords are structural markers,
// everything else in braces renders inline like text
const BLOCK_MARKER = /^\{\{?\s*(?:[#/>]|(?:else|elseif|before|loading|error|catch)\b)/;

function isWhitespaceChar(ch) {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

export function condenseWhitespace(template) {
  let out = '';
  let i = 0;
  const len = template.length;
  // 'boundary' after a tag or block marker, 'text' after text or an expression
  let prevKind = 'boundary';

  while (i < len) {
    const ch = template[i];

    if (ch === '<') {
      if (template.startsWith('<!--', i)) {
        const end = template.indexOf('-->', i + 4);
        const stop = end === -1 ? len : end + 3;
        out += template.slice(i, stop);
        i = stop;
        prevKind = 'boundary';
        continue;
      }
      const start = i;
      i++;
      let quote = null;
      while (i < len) {
        const c = template[i];
        i++;
        if (quote) {
          if (c === quote) {
            quote = null;
          }
        }
        else if (c === '"' || c === "'") {
          quote = c;
        }
        else if (c === '>') {
          break;
        }
      }
      const tag = template.slice(start, i);
      out += tag;
      prevKind = 'boundary';

      const nameMatch = /^<([a-zA-Z][\w-]*)/.exec(tag);
      const rawName = nameMatch && nameMatch[1].toLowerCase();
      if (rawName && RAW_TEXT_TAGS.has(rawName) && !tag.endsWith('/>')) {
        const close = template.toLowerCase().indexOf('</' + rawName, i);
        const stop = close === -1 ? len : close;
        out += template.slice(i, stop);
        i = stop;
      }
      continue;
    }

    if (ch === '{') {
      // copy the brace token verbatim, balancing nested braces the same
      // naive way the parser's getTagContent does
      const start = i;
      let depth = 0;
      while (i < len) {
        const c = template[i];
        if (c === '{') {
          depth++;
        }
        else if (c === '}') {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
        i++;
      }
      const token = template.slice(start, i);
      out += token;
      prevKind = BLOCK_MARKER.test(token) ? 'boundary' : 'text';
      continue;
    }

    if (isWhitespaceChar(ch)) {
      let j = i;
      let hasNewline = false;
      while (j < len && isWhitespaceChar(template[j])) {
        if (template[j] === '\n' || template[j] === '\r') {
          hasNewline = true;
        }
        j++;
      }
      const next = template[j];
      const nextKind = (next === undefined || next === '<'
          || (next === '{' && BLOCK_MARKER.test(template.slice(j, j + 12))))
        ? 'boundary'
        : 'text';
      if (!(hasNewline && prevKind === 'boundary' && nextKind === 'boundary')) {
        out += ' ';
      }
      i = j;
      continue;
    }

    out += ch;
    prevKind = 'text';
    i++;
  }
  return out;
}
