import { each, escapeRegExp, isString } from '@semantic-ui/utils';

// A StringScanner has an immutable source document (string) `input` and a current
// position `pos`, an index into the string, which can be set at will.
// Adapted from BlazeJS Scanner
//
// * `new Scanner(input)` - constructs a Scanner with source string `input`
// * `scanner.rest()` - returns the rest of the input after `pos`
// * `scanner.peek()` - returns the character at `pos`
// * `scanner.isEOF()` - true if `pos` is at or beyond the end of `input`
// * `scanner.fatal(msg)` - throw an error indicating a problem at `pos`

export class StringScanner {
  static DEBUG_MODE = true;

  static stringRegex = new Map();

  // sticky (y) regexes match at lastIndex without slicing the remaining
  // input. built on first use and kept on the pattern itself.
  static getRegex(pattern) {
    const stringPattern = isString(pattern);
    const cached = stringPattern ? StringScanner.stringRegex.get(pattern) : pattern.scannerRegex;
    if (cached) {
      return cached;
    }
    const source = stringPattern ? escapeRegExp(pattern) : pattern.source;
    const flags = stringPattern ? '' : pattern.flags.replace(/[gy]/g, '');
    const regex = {
      // y anchors at lastIndex itself, a leading ^ would pin matches to 0
      sticky: new RegExp(source.startsWith('^') ? source.slice(1) : source, flags + 'y'),
      search: new RegExp(source, flags + 'g'),
    };
    if (stringPattern) {
      StringScanner.stringRegex.set(pattern, regex);
    }
    else {
      pattern.scannerRegex = regex;
    }
    return regex;
  }

  constructor(input) {
    this.input = input;
    this.pos = 0;
  }

  matches(regex) {
    const { sticky } = StringScanner.getRegex(regex);
    sticky.lastIndex = this.pos;
    return sticky.test(this.input);
  }

  rest() {
    return this.input.slice(this.pos);
  }

  step(step = 1) {
    if (!this.isEOF()) {
      this.pos = this.pos + step;
    }
  }

  rewind(step = 1) {
    if (this.pos !== 0) {
      this.pos = this.pos - step;
    }
  }

  isEOF() {
    return this.pos >= this.input.length;
  }

  // get character at current position
  peek() {
    return this.input.charAt(this.pos);
  }

  consume(pattern) {
    const { sticky } = StringScanner.getRegex(pattern);
    sticky.lastIndex = this.pos;
    const match = sticky.exec(this.input);
    if (match) {
      this.pos += match[0].length;
      return match[0];
    }
    return null;
  }

  consumeUntil(pattern) {
    const { search } = StringScanner.getRegex(pattern);
    search.lastIndex = this.pos;
    const match = search.exec(this.input);
    if (!match) {
      const consumedText = this.input.slice(this.pos);
      this.pos = this.input.length;
      return consumedText;
    }
    const consumedText = this.input.slice(this.pos, match.index);
    this.pos = match.index;
    return consumedText;
  }

  returnTo(pattern) {
    if (!pattern) {
      return;
    }
    const regex = isString(pattern)
      ? new RegExp(escapeRegExp(pattern), 'gm') // Global flag for multiple matches
      : new RegExp(pattern, 'gm');

    let lastMatch = null;
    let match;
    const substring = this.input.substring(0, this.pos);

    // Find the last match of the regex
    while ((match = regex.exec(substring)) !== null) {
      lastMatch = match;
    }

    if (lastMatch) {
      const consumedText = this.input.substring(0, lastMatch.index);
      this.pos = lastMatch.index; // Update position to the start of the last match
      return consumedText;
    }
    return;
  }

  getContext() {
    let insideTag = false;
    let i = this.pos - 1;
    let tagPos;

    // Step 1: Search backwards to confirm we're inside a tag.
    while (i >= 0) {
      if (this.input[i] === '>') {
        break; // Stop if we find the end of a previous tag
      }
      if (this.input[i] === '<') {
        insideTag = true; // Confirm we're inside a tag
        tagPos = i; // Save the position of the tag
        break;
      }
      i--;
    }

    if (insideTag) {
      const tagText = this.input.substring(tagPos, this.pos);

      const attrPattern = /([a-zA-Z-]+)(?=\s*=\s*[^=]*$)/;
      const attrMatch = tagText.match(attrPattern); // Grab the last sequence of non-space characters
      const attrName = attrMatch ? attrMatch[1] : '';

      const booleanAttributes = [
        'allowfullscreen',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'inert',
        'ismap',
        'itemscope',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected',
      ];
      let booleanAttribute = false;
      if (booleanAttributes.includes(attrName)) {
        // this is a known attribute tag that is always boolean
        booleanAttribute = true;
      }
      else {
        // if the template has syntax <div attribute={{value}}> without quotes then this is intended to be a boolean attribute
        const quotedAttrPattern = /([a-zA-Z-]+)(?=\s*=\s*(\"|\')\s*[^=]*$)/;
        const quotedAttrMatch = tagText.match(quotedAttrPattern);
        const quotedAttrName = quotedAttrMatch ? quotedAttrMatch[1] : '';
        booleanAttribute = attrName !== quotedAttrName;
      }
      if (attrName) {
        return {
          insideTag: true,
          attribute: attrName,
          booleanAttribute,
        };
      }
    }
    return {
      insideTag: insideTag,
    };
  }

  fatal(msg) {
    msg = msg || 'Parse error';

    const input = isString(this.input) ? this.input : '';
    const lines = input.split('\n');
    let lineNumber = 0;
    let charCount = 0;
    for (const line of lines) {
      // Add 1 for the newline character that split removes
      if (charCount + line.length + 1 > this.pos) {
        break;
      }
      charCount += line.length + 1;
      lineNumber++;
    }

    const linesBefore = 5;
    const linesAfter = 5;
    const startLine = Math.max(0, lineNumber - linesBefore);
    const endLine = Math.min(lines.length, lineNumber + linesAfter + 1);

    // Lines around the error, including the error line
    const contextLines = lines.slice(startLine, endLine);

    const consoleMsg = contextLines
      .map((line, idx) => {
        return `%c${line}`;
      })
      .join('\n');

    // Apply red and bold to the error line
    const normalStyle = 'color: grey';
    const errorStyle = 'color: red; font-weight: bold';

    if (StringScanner.DEBUG_MODE) {
      if (globalThis.document) {
        let errorHTML = '';
        each(contextLines, (line, index) => {
          const style = index < linesBefore || index > linesBefore
            ? normalStyle
            : errorStyle;
          errorHTML += `<div style="${style}">${line}</div>`;
        });
        const html = `
          <div style="padding: 1rem; font-size: 14px;">
            <h2>Could not render template</h2>
            <h3>${msg}</h3>
            <code style="margin-top: 1rem; display: block; background-color: #EFEFEF; padding: 0.25rem 1rem;border-left: 3px solid #888"><pre>${errorHTML}</pre></code>
          </div>
        `;
        document.body.innerHTML = html;
      }
      console.error(
        msg + '\n' + consoleMsg,
        ...contextLines.map((_, idx) => lineNumber - startLine === idx ? errorStyle : normalStyle),
      );

      const e = new Error(msg);
      throw e;
    }
  }
}
