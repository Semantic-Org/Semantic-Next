import { escapeRegExp } from '../utils';

// This is a Scanner class suitable for any parser/lexer/tokenizer.
//
// A Scanner has an immutable source document (string) `input` and a current
// position `pos`, an index into the string, which can be set at will.
//
// * `new Scanner(input)` - constructs a Scanner with source string `input`
// * `scanner.rest()` - returns the rest of the input after `pos`
// * `scanner.peek()` - returns the character at `pos`
// * `scanner.isEOF()` - true if `pos` is at or beyond the end of `input`
// * `scanner.fatal(msg)` - throw an error indicating a problem at `pos`

class Scanner {

  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.runCount = 0;
  }

  matches(regex) {
    return regex.test(this.rest());
  }

  rest() {
    return this.input.slice(this.pos);
  }

  isEOF() {
    this.runCount++;
    if(this.runCount > 100) {
      console.error('Recursion');
      return true;
    }
    return this.pos >= this.input.length;
  }

  peek() {
    return this.input.charAt(this.pos);
  }

  consume(pattern) {
    const regex = (typeof pattern === 'string')
      ? new RegExp(escapeRegExp(pattern))
      : new RegExp(pattern);

    // Match from the current position
    const substring = this.input.substring(this.pos);
    const match = regex.exec(substring);
    if (match && match.index === 0) { // Ensure match starts at the beginning of the substring
      this.pos += match[0].length; // Advance position by the length of the match
      return match[0];
    }
    return null;
  }

  consumeUntil(pattern) {
    const regex = (typeof pattern === 'string')
      ? new RegExp(escapeRegExp(pattern))
      : new RegExp(pattern)
    ;
    const match = regex.exec(this.input.substring(this.pos));
    if (!match) {
      const consumedText = this.input.substr(this.pos);
      this.pos = this.input.length;
      return consumedText;
    }
    const consumedText = this.input.substring(this.pos, this.pos + match.index);
    this.pos += match.index;
    if(pattern == '}}') {
      //console.log('consumed text', consumedText);
    }
    return consumedText;
  }

  fatal(msg) {
    msg = msg || 'Parse error';

    const CONTEXT_AMOUNT = 20;
    const pastInput = this.input.substring(this.pos - CONTEXT_AMOUNT - 1, this.pos);
    const upcomingInput = this.input.substring(this.pos, this.pos + CONTEXT_AMOUNT + 1);

    const positionDisplay = `${pastInput + upcomingInput.replace(/\n/g, ' ')}\n${' '.repeat(pastInput.length)}^`;
    const e = new Error(`${msg}\n${positionDisplay}`);

    e.offset = this.pos;
    const allPastInput = this.input.substring(0, this.pos);
    e.line = 1 + (allPastInput.match(/\n/g) || []).length;
    e.col = 1 + this.pos - allPastInput.lastIndexOf('\n');

    throw e;
  }

}

export { Scanner };
