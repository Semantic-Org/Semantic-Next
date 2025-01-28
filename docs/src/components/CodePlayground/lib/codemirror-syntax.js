export function defineSyntax(CodeMirror) {
  CodeMirror.defineMode('ui-template', function() {
    return {
      startState() {
        return {
          // Expression
          inExpression: false,
          bracketDepth: 0,

          // Tag & attribute parsing
          inTag: false,
          attrState: 'tag', // can be 'tag', 'attrName', 'attrValue', etc.
          attributeQuoteChar: null,
        };
      },

      token(stream, state) {
        // If in expression
        if (state.inExpression) {
          return tokenExpression(stream, state);
        }

        // If in an HTML tag context
        if (state.inTag) {
          return tokenInTag(stream, state);
        }

        // Otherwise, parse normal text (outside tags & expressions)
        return tokenText(stream, state);
      }
    };

    //----------------------------------------------------------------------------
    // (A) tokenText: outside <tags> and outside {expressions}
    //----------------------------------------------------------------------------
    function tokenText(stream, state) {
      // 1) Expression opening?
      if (stream.match('{{')) {
        openExpression(state, true);
        return 'bracket';
      }
      if (stream.match('{')) {
        openExpression(state, false);
        return 'bracket';
      }

      // 2) Tag opening?
      if (stream.eat('<')) {
        // comment <!-- ?
        if (stream.match('!--')) {
          // consume until -->
          while (!stream.eol()) {
            if (stream.match('-->')) break;
            stream.next();
          }
          return 'comment';
        }
        // Normal tag
        state.inTag = true;
        state.attrState = 'tag'; // we’re at the start of a tag
        // read tag name
        stream.eatWhile(/[a-zA-Z0-9:_-]/);
        return 'tag';
      }

      // Otherwise, consume text until we hit { or <
      let consumed = false;
      while (!stream.eol()) {
        const ch = stream.peek();
        if (ch === '{' || ch === '<') break;
        stream.next();
        consumed = true;
      }
      return consumed ? 'html string' : null;
    }

    //----------------------------------------------------------------------------
    // (B) tokenInTag: we are inside < ... > (not counting expressions)
    //----------------------------------------------------------------------------
    function tokenInTag(stream, state) {
      // 1) Tag close?
      if (stream.eat('>')) {
        state.inTag = false;
        state.attrState = 'tag';
        return 'tag';
      }

      // 2) Possibly a closing slash (e.g. <br/>)
      if (stream.eat('/')) {
        stream.eatWhile(/[a-zA-Z0-9:_-]/); // might be </div or <br/
        return 'tag';
      }

      // 3) Whitespace
      if (stream.eatWhile(/\s/)) {
        return null;
      }

      // 4) Expression inside tag?
      if (stream.match('{{')) {
        openExpression(state, true);
        return 'bracket';
      }
      if (stream.match('{')) {
        openExpression(state, false);
        return 'bracket';
      }

      // 5) If we’re parsing an attribute value already
      if (state.attrState === 'attrValue') {
        return parseAttrValue(stream, state);
      }

      // 6) Otherwise we might be at the start of a new attribute name
      //    or still reading the tag name if it's `<img something`
      return parseAttrOrTagName(stream, state);
    }

    //----------------------------------------------------------------------------
    // parseAttrOrTagName: figure out if we are reading a new attribute or finishing tag name
    //----------------------------------------------------------------------------
    function parseAttrOrTagName(stream, state) {
      // 1) If we see something that looks like an attribute name
      if (/[a-zA-Z_:-]/.test(stream.peek())) {
        // read the attribute name
        stream.eatWhile(/[a-zA-Z0-9_:-]/);
        // Next, if we see an '=', we switch to attrValue, otherwise we are just done with the name
        if (stream.peek() === '=') {
          // We won't consume it here; let next token read that '='
        }
        state.attrState = 'tagNameOrAttr'; // we read a name
        return 'attribute name';
      }

      // 2) If the next char is '=' => that means we are about to parse an attribute value
      if (stream.eat('=')) {
        state.attrState = 'attrValue';
        return 'attribute operator';
      }

      // 3) If it's some punctuation we didn't handle
      stream.next();
      return 'tag';
    }

    //----------------------------------------------------------------------------
    // parseAttrValue: we are expecting either quotes or unquoted text, or an expression
    //----------------------------------------------------------------------------
    function parseAttrValue(stream, state) {
      // If we have a quote already
      if (state.attributeQuoteChar) {
        // check if next char is that quote => means we close it
        if (stream.peek() === state.attributeQuoteChar) {
          stream.next(); // consume quote
          state.attributeQuoteChar = null;
          // after closing quote, we go back to reading the next attribute (or end of tag)
          state.attrState = 'tag';
          return 'html quote';
        }

        // if we see an expression
        if (stream.match('{{')) {
          openExpression(state, true);
          return 'bracket';
        }
        if (stream.match('{')) {
          openExpression(state, false);
          return 'bracket';
        }

        // otherwise consume text until we see a quote or expression
        let consumed = false;
        while (!stream.eol()) {
          const ch = stream.peek();
          if (ch === state.attributeQuoteChar || ch === '{') break;
          stream.next();
          consumed = true;
        }
        return consumed ? 'attribute string' : null;
      } else {
        // we do NOT yet have a quote. So maybe the next char is a quote, or unquoted text, or >, etc.
        const ch = stream.peek();
        if (ch === '"' || ch === "'") {
          // opening quote
          state.attributeQuoteChar = ch;
          stream.next();
          return 'html quote';
        }

        // maybe an expression?
        if (stream.match('{{')) {
          openExpression(state, true);
          return 'bracket';
        }
        if (stream.match('{')) {
          openExpression(state, false);
          return 'bracket';
        }

        // if it's whitespace or '>' => means no attribute value was provided
        if (/\s/.test(ch) || ch === '>') {
          // done with this attribute
          state.attrState = 'tag';
          return null;
        }

        // otherwise unquoted text
        let consumed = false;
        while (!stream.eol()) {
          const nextCh = stream.peek();
          if (/\s/.test(nextCh) || nextCh === '>' || nextCh === '{') {
            break;
          }
          stream.next();
          consumed = true;
        }
        // done reading unquoted string
        if (!consumed) {
          // no text => done
          state.attrState = 'tag';
        }
        return 'attribute string';
      }
    }

    //----------------------------------------------------------------------------
    // (C) tokenExpression: we are inside { ... } (could be nested with bracketDepth)
    //----------------------------------------------------------------------------
    function tokenExpression(stream, state) {
      // Look for close
      if (stream.match('}}') && state.bracketDepth >= 2) {
        closeExpression(state, true);
        return 'bracket';
      }
      if (stream.match('}')) {
        closeExpression(state, false);
        return 'bracket';
      }

      // Nested opens
      if (stream.match('{{')) {
        state.bracketDepth += 2;
        return 'bracket';
      }
      if (stream.match('{')) {
        state.bracketDepth += 1;
        return 'bracket';
      }

      // Templating keywords
      if (stream.match(/(#[a-zA-Z_][a-zA-Z0-9_]*)|\/[a-zA-Z_][a-zA-Z0-9_]*|\bin\b|elseif\b|(else\s+if)\b|else\b/)) {
        return 'keyword templating';
      }

      // Variables
      if (stream.match(/@[a-zA-Z_][a-zA-Z0-9_]*|\b[a-zA-Z_][a-zA-Z0-9_]*\b/)) {
        return 'variable templating';
      }

      // Punctuation
      if (stream.match(/[\(\)\[\],+\-*/%.]/)) {
        return 'punctuation';
      }

      // Strings
      if (stream.match(/"[^"]*"/) || stream.match(/'[^']*'/)) {
        return 'string templating';
      }

      // Fallback
      stream.next();
      return null;
    }

    //----------------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------------
    function openExpression(state, double) {
      state.inExpression = true;
      state.bracketDepth += double ? 2 : 1;
    }
    function closeExpression(state, double) {
      state.bracketDepth -= double ? 2 : 1;
      if (state.bracketDepth <= 0) {
        state.inExpression = false;
        state.bracketDepth = 0;
      }
    }
  });

  CodeMirror.defineMIME('text/ui-template', 'ui-template');
}
