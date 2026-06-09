/*
  Whitespace condensing for template strings, run before parsing.

  Cross-line whitespace is removed only when both sides are tag or block
  boundaries — indentation between elements is formatting. Runs touching
  text or an expression collapse to a single space, which is rendering-
  neutral under normal `white-space`, so {first}\n{last} reads "first last".
  Same-line spacing always survives: "same line means the space is real".

  Runs in the browser for every runtime-compiled template, so the scanner
  works in charCodes with no per-token allocation. The parser then scans
  fewer bytes.
*/

const TAB = 9;
const NEWLINE = 10;
const RETURN = 13;
const SPACE = 32;
const QUOTE = 34;
const APOSTROPHE = 39;
const SLASH = 47;
const TAG_OPEN = 60;
const TAG_CLOSE = 62;
const BRACE_OPEN = 123;
const HASH = 35;

// raw-text elements whose content is never condensed
const RAW_TEXT_TAGS = ['pre', 'textarea', 'script', 'style'];
const RAW_TEXT_CLOSE = {
  pre: /<\/pre/gi,
  textarea: /<\/textarea/gi,
  script: /<\/script/gi,
  style: /<\/style/gi,
};

// {else} {elseif} and the async branch keywords mark block structure
const BRANCH_KEYWORDS = ['else', 'before', 'loading', 'error', 'catch'];

function isWhitespaceCode(code) {
  return code === SPACE || code === TAB || code === NEWLINE || code === RETURN;
}

function isWordCode(code) {
  return (code >= 48 && code <= 57) // 0-9
    || (code >= 65 && code <= 90) // A-Z
    || (code >= 97 && code <= 122) // a-z
    || code === 95; // _
}

// case-insensitive raw-text tag name match at `index` (just past '<'),
// requiring a tag-name boundary after — `<pre-view>` is not `<pre>`
function rawTextTagAt(template, index) {
  for (const tagName of RAW_TEXT_TAGS) {
    let matched = true;
    for (let k = 0; k < tagName.length; k++) {
      // | 32 lowercases ASCII letters without allocating
      if ((template.charCodeAt(index + k) | 32) !== tagName.charCodeAt(k)) {
        matched = false;
        break;
      }
    }
    if (!matched) {
      continue;
    }
    const after = template.charCodeAt(index + tagName.length);
    if (isWhitespaceCode(after) || after === TAG_CLOSE || after === SLASH) {
      return tagName;
    }
  }
  return null;
}

// whether the brace token starting at `index` is a structural marker
// ({#block}, {/block}, {>template}, branch keywords) vs an expression
function isBlockMarkerAt(template, index, len) {
  let j = index + 1;
  if (template.charCodeAt(j) === BRACE_OPEN) {
    j++;
  }
  while (j < len && isWhitespaceCode(template.charCodeAt(j))) {
    j++;
  }
  const code = template.charCodeAt(j);
  if (code === HASH || code === SLASH || code === TAG_CLOSE) {
    return true;
  }
  // e, b, l, c gate the keyword scan so expressions skip it
  if (code !== 101 && code !== 98 && code !== 108 && code !== 99) {
    return false;
  }
  for (const keyword of BRANCH_KEYWORDS) {
    if (template.startsWith(keyword, j)) {
      let end = j + keyword.length;
      if (keyword === 'else' && template.startsWith('if', end)) {
        end += 2;
      }
      if (!isWordCode(template.charCodeAt(end))) {
        return true;
      }
    }
  }
  return false;
}

export function condenseWhitespace(template) {
  let out = '';
  let i = 0;
  const len = template.length;
  // 'boundary' after a tag or block marker, 'text' after text or an expression
  let prevIsBoundary = true;

  while (i < len) {
    const code = template.charCodeAt(i);

    if (code === TAG_OPEN) {
      if (template.startsWith('<!--', i)) {
        const end = template.indexOf('-->', i + 4);
        const stop = end === -1 ? len : end + 3;
        out += template.slice(i, stop);
        i = stop;
        prevIsBoundary = true;
        continue;
      }
      const rawName = rawTextTagAt(template, i + 1);
      const start = i;
      i++;
      let quote = 0;
      while (i < len) {
        const c = template.charCodeAt(i);
        i++;
        if (quote !== 0) {
          if (c === quote) {
            quote = 0;
          }
        }
        else if (c === QUOTE || c === APOSTROPHE) {
          quote = c;
        }
        else if (c === TAG_CLOSE) {
          break;
        }
      }
      out += template.slice(start, i);
      prevIsBoundary = true;

      if (rawName && template.charCodeAt(i - 2) !== SLASH) {
        const closeRegExp = RAW_TEXT_CLOSE[rawName];
        closeRegExp.lastIndex = i;
        const closeMatch = closeRegExp.exec(template);
        const stop = closeMatch ? closeMatch.index : len;
        out += template.slice(i, stop);
        i = stop;
      }
      continue;
    }

    if (code === BRACE_OPEN) {
      // copy the brace token verbatim, balancing nested braces the same
      // naive way the parser's getTagContent does
      const start = i;
      let depth = 0;
      while (i < len) {
        const c = template.charCodeAt(i);
        if (c === BRACE_OPEN) {
          depth++;
        }
        else if (c === 125 /* } */) {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
        i++;
      }
      out += template.slice(start, i);
      prevIsBoundary = isBlockMarkerAt(template, start, len);
      continue;
    }

    if (isWhitespaceCode(code)) {
      let j = i;
      let hasNewline = false;
      while (j < len) {
        const c = template.charCodeAt(j);
        if (c === NEWLINE || c === RETURN) {
          hasNewline = true;
        }
        else if (c !== SPACE && c !== TAB) {
          break;
        }
        j++;
      }
      const next = j < len ? template.charCodeAt(j) : -1;
      const nextIsBoundary = next === -1 || next === TAG_OPEN
        || (next === BRACE_OPEN && isBlockMarkerAt(template, j, len));
      if (!(hasNewline && prevIsBoundary && nextIsBoundary)) {
        out += ' ';
      }
      i = j;
      continue;
    }

    // plain text: copy the whole run in one slice
    const start = i;
    i++;
    while (i < len) {
      const c = template.charCodeAt(i);
      if (c === TAG_OPEN || c === BRACE_OPEN || isWhitespaceCode(c)) {
        break;
      }
      i++;
    }
    out += template.slice(start, i);
    prevIsBoundary = false;
  }
  return out;
}
