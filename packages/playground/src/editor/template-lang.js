import { StreamLanguage } from '@codemirror/language';

const uiTemplateMode = {
  startState() {
    return {
      inExpression: false,
      bracketDepth: 0,
      inTag: false,
      attrState: 'tag',
      attributeQuoteChar: null,
    };
  },

  token(stream, state) {
    if (state.inExpression) {
      return tokenExpression(stream, state);
    }
    if (state.inTag) {
      return tokenInTag(stream, state);
    }
    return tokenText(stream, state);
  },
};

// ----------------------------------------------------------------------------
// (A) tokenText: outside <tags> and outside {expressions}
// ----------------------------------------------------------------------------
function tokenText(stream, state) {
  if (stream.match('{{')) {
    openExpression(state, true);
    return 'brace';
  }
  if (stream.match('{>')) {
    openExpression(state, false);
    return 'brace';
  }
  if (stream.match('{')) {
    openExpression(state, false);
    return 'brace';
  }

  if (stream.eat('<')) {
    if (stream.match('!--')) {
      while (!stream.eol()) {
        if (stream.match('-->')) { break; }
        stream.next();
      }
      return 'comment';
    }
    state.inTag = true;
    state.attrState = 'tag';
    return 'typeName';
  }

  let consumed = false;
  while (!stream.eol()) {
    const ch = stream.peek();
    if (ch === '{' || ch === '<') { break; }
    stream.next();
    consumed = true;
  }
  return consumed ? 'content' : null;
}

// ----------------------------------------------------------------------------
// (B) tokenInTag: inside < ... >
// ----------------------------------------------------------------------------
function tokenInTag(stream, state) {
  // Closing >
  if (stream.eat('>')) {
    state.inTag = false;
    state.attrState = 'tag';
    return 'typeName';
  }

  // Closing tag slash: /
  if (stream.eat('/')) {
    return 'typeName';
  }

  // Whitespace
  if (stream.eatWhile(/\s/)) {
    return null;
  }

  // Tag name (right after < or /)
  if (state.attrState === 'tag' && /[a-zA-Z0-9:_-]/.test(stream.peek())) {
    stream.eatWhile(/[a-zA-Z0-9:_-]/);
    state.attrState = 'afterTagName';
    return 'typeName';
  }

  if (stream.match('{{')) {
    openExpression(state, true);
    return 'brace';
  }
  if (stream.match('{>')) {
    openExpression(state, false);
    return 'brace';
  }
  if (stream.match('{')) {
    openExpression(state, false);
    return 'brace';
  }

  if (state.attrState === 'attrValue') {
    return parseAttrValue(stream, state);
  }

  return parseAttrOrTagName(stream, state);
}

// ----------------------------------------------------------------------------
// parseAttrOrTagName
// ----------------------------------------------------------------------------
function parseAttrOrTagName(stream, state) {
  if (/[a-zA-Z_:-]/.test(stream.peek())) {
    stream.eatWhile(/[a-zA-Z0-9_:-]/);
    state.attrState = 'tagNameOrAttr';
    return 'attributeName';
  }

  if (stream.eat('=')) {
    state.attrState = 'attrValue';
    return 'definitionOperator';
  }

  stream.next();
  return 'typeName';
}

// ----------------------------------------------------------------------------
// parseAttrValue
// ----------------------------------------------------------------------------
function parseAttrValue(stream, state) {
  if (state.attributeQuoteChar) {
    // Closing quote
    if (stream.peek() === state.attributeQuoteChar) {
      stream.next();
      state.attributeQuoteChar = null;
      state.attrState = 'tag';
      return 'meta';
    }

    if (stream.match('{{')) {
      openExpression(state, true);
      return 'brace';
    }
    if (stream.match('{')) {
      openExpression(state, false);
      return 'brace';
    }

    // String content inside quotes
    let consumed = false;
    while (!stream.eol()) {
      const ch = stream.peek();
      if (ch === state.attributeQuoteChar || ch === '{') { break; }
      stream.next();
      consumed = true;
    }
    return consumed ? 'labelName' : null;
  }
  else {
    const ch = stream.peek();
    // Opening quote
    if (ch === '"' || ch === "'") {
      state.attributeQuoteChar = ch;
      stream.next();
      return 'meta';
    }

    if (stream.match('{{')) {
      openExpression(state, true);
      return 'brace';
    }
    if (stream.match('{')) {
      openExpression(state, false);
      return 'brace';
    }

    if (/\s/.test(ch) || ch === '>') {
      state.attrState = 'tag';
      return null;
    }

    // Unquoted attribute value
    let consumed = false;
    while (!stream.eol()) {
      const nextCh = stream.peek();
      if (/\s/.test(nextCh) || nextCh === '>' || nextCh === '{') {
        break;
      }
      stream.next();
      consumed = true;
    }
    if (!consumed) {
      state.attrState = 'tag';
    }
    return 'labelName';
  }
}

// ----------------------------------------------------------------------------
// (C) tokenExpression: inside { ... }
// ----------------------------------------------------------------------------
function tokenExpression(stream, state) {
  if (stream.match('}}') && state.bracketDepth >= 2) {
    closeExpression(state, true);
    return 'brace';
  }
  if (stream.match('}')) {
    closeExpression(state, false);
    return 'brace';
  }

  if (stream.match('{{')) {
    state.bracketDepth += 2;
    return 'brace';
  }
  if (stream.match('{')) {
    state.bracketDepth += 1;
    return 'brace';
  }

  // Templating keywords
  if (stream.match(/(#[a-zA-Z_][a-zA-Z0-9_]*)|\/[a-zA-Z_][a-zA-Z0-9_]*|\bin\b|\bas\b|elseif\b|(else\s+if)\b|else\b/)) {
    return 'keyword';
  }

  // Variables
  if (stream.match(/@[a-zA-Z_][a-zA-Z0-9_]*|\b[a-zA-Z_][a-zA-Z0-9_]*\b/)) {
    return 'variableName';
  }

  // Punctuation
  if (stream.match(/[\(\)\[\],+\-*/%.]/)) {
    return 'punctuation';
  }

  // Strings
  if (stream.match(/"[^"]*"/) || stream.match(/'[^']*'/)) {
    return 'string';
  }

  stream.next();
  return null;
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
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

// Export the CM6 language
export const templateLang = StreamLanguage.define(uiTemplateMode);
