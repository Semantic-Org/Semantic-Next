import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

/*
  Default syntax palette. Colors resolve from CSS custom properties so hosts
  theme the editor with plain CSS — the --playground-code-* vocabulary. Tag
  modifiers (function calls, definitions) can't be targeted by class-based
  highlighting, which is why this exists alongside classHighlighter's tok-*
  classes rather than instead of them.
*/

const color = (name) => ({ color: `var(--playground-code-${name})` });

export const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, ...color('keyword-color') },
  { tag: [tags.string, tags.special(tags.string)], ...color('string-color') },
  { tag: tags.number, ...color('number-color') },
  { tag: [tags.bool, tags.null, tags.atom], ...color('atom-color') },
  { tag: tags.comment, ...color('comment-color') },
  { tag: tags.regexp, ...color('string-2-color') },
  { tag: tags.operator, ...color('operator-color') },
  { tag: [tags.punctuation, tags.separator], ...color('punctuation') },
  { tag: [tags.bracket, tags.brace, tags.paren, tags.squareBracket], ...color('bracket') },
  { tag: tags.variableName, ...color('default-color') },
  { tag: tags.definition(tags.variableName), ...color('def-color') },
  { tag: tags.function(tags.variableName), ...color('callee-color') },
  { tag: tags.propertyName, ...color('property-color') },
  { tag: tags.function(tags.propertyName), ...color('callee-color') },
  { tag: tags.definition(tags.propertyName), ...color('property-color') },
  { tag: [tags.typeName, tags.className], ...color('type-color') },
  { tag: tags.meta, ...color('meta-color') },
  { tag: [tags.attributeName, tags.labelName], ...color('attribute-color') },
]);
