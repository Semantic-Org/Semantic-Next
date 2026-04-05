import { getCompletionContext, getWordAtOffset, formatAttributeDoc } from './server-helpers.js';
import { formatHelperSignature, getHelper, helpers } from './helper-registry.js';

/*
  Pure language service — zero transport dependencies.
  All functions take data in, return LSP-shaped response objects out.
  No connection, no documents, no fs.
*/

// LSP CompletionItemKind values (avoid importing from vscode-languageserver)
const Kind = {
  Method: 2,
  Property: 10,
  Keyword: 14,
  Function: 3,
  Reference: 18,
  EnumMember: 20,
  Event: 23,
};

const SnippetFormat = 2; // InsertTextFormat.Snippet
const Markdown = 'markdown';

/*******************************
        Completions
*******************************/

export function getCompletions(text, offset, { model, specRegistry } = {}) {
  const context = getCompletionContext(text, offset);

  switch (context.type) {
    case 'expression':
      return getExpressionCompletions(model);
    case 'block':
      return getBlockCompletions();
    case 'reference':
      return getReferenceCompletions(model);
    case 'html-attribute':
      return getAttributeCompletions(context.tagName, specRegistry);
    case 'attribute-value':
      return getAttributeValueCompletions(context.tagName, context.attributeName, specRegistry);
    case 'event-binding':
      return getEventBindingCompletions();
    default:
      return [];
  }
}

function getExpressionCompletions(model) {
  const items = [];

  if (model) {
    for (const method of model.instance) {
      items.push({
        label: method.name,
        kind: Kind.Method,
        detail: `(${method.params.map(p => p.name).join(', ')})`,
        sortText: '0' + method.name,
      });
    }
    for (const field of model.state) {
      items.push({
        label: field.name,
        kind: Kind.Property,
        detail: `state: ${field.inferredType}`,
        sortText: '1' + field.name,
      });
    }
    for (const field of model.settings) {
      items.push({
        label: field.name,
        kind: Kind.Property,
        detail: `setting: ${field.inferredType}`,
        sortText: '1' + field.name,
      });
    }
  }

  for (const name of Object.keys(helpers)) {
    items.push({
      label: name,
      kind: Kind.Function,
      detail: formatHelperSignature(name),
      sortText: '2' + name,
    });
  }

  return items;
}

function getBlockCompletions() {
  return [
    { label: 'if', kind: Kind.Keyword, insertText: 'if ${1:condition}}$0{/if}', insertTextFormat: SnippetFormat, detail: 'Conditional block' },
    { label: 'each', kind: Kind.Keyword, insertText: 'each ${1:item} in ${2:items}}$0{/each}', insertTextFormat: SnippetFormat, detail: 'Loop block' },
    { label: 'async', kind: Kind.Keyword, insertText: 'async ${1:promise} as ${2:result}}$0{/async}', insertTextFormat: SnippetFormat, detail: 'Async block' },
    { label: 'snippet', kind: Kind.Keyword, insertText: 'snippet ${1:name}}$0{/snippet}', insertTextFormat: SnippetFormat, detail: 'Reusable template section' },
    { label: 'rerender', kind: Kind.Keyword, insertText: 'rerender ${1:key}}$0{/rerender}', insertTextFormat: SnippetFormat, detail: 'Force re-render on key change' },
    { label: 'guard', kind: Kind.Keyword, insertText: 'guard ${1:expression}}$0{/guard}', insertTextFormat: SnippetFormat, detail: 'Re-render only when value changes' },
    { label: 'html', kind: Kind.Keyword, insertText: 'html ${1:content}}', insertTextFormat: SnippetFormat, detail: 'Raw HTML output' },
  ];
}

function getReferenceCompletions(model) {
  const items = [
    { label: 'slot', kind: Kind.Keyword, detail: 'Content projection slot' },
  ];
  if (model) {
    for (const name of Object.keys(model.subTemplates)) {
      items.push({ label: name, kind: Kind.Reference, detail: 'Subtemplate' });
    }
  }
  return items;
}

function getAttributeCompletions(tagName, specRegistry) {
  const spec = specRegistry?.get(tagName);
  if (!spec) { return []; }

  const items = [];
  for (const attr of spec.attributes) {
    const meta = spec.attributeInfo.get(attr);
    items.push({
      label: attr,
      kind: Kind.Property,
      detail: meta?.description || spec.propertyTypes[attr] || '',
      sortText: String(meta?.usageLevel ?? 3).padStart(2, '0') + attr,
      documentation: meta ? { kind: Markdown, value: formatAttributeDoc(attr, meta, spec) } : undefined,
    });
  }
  for (const [value, attr] of Object.entries(spec.optionAttributes)) {
    if (spec.attributes.includes(value)) { continue; }
    const meta = spec.attributeInfo.get(attr);
    const optionMeta = meta?.optionInfo?.get(value);
    items.push({
      label: value,
      kind: Kind.EnumMember,
      detail: `→ ${attr}="${value}"`,
      sortText: String(meta?.usageLevel ?? 3).padStart(2, '0') + value,
      documentation: optionMeta?.description ? { kind: Markdown, value: optionMeta.description } : undefined,
    });
  }
  return items;
}

function getAttributeValueCompletions(tagName, attributeName, specRegistry) {
  const spec = specRegistry?.get(tagName);
  if (!spec) { return []; }
  const values = spec.allowedValues[attributeName];
  if (!values) { return []; }
  const meta = spec.attributeInfo.get(attributeName);
  return values.map(value => {
    const optionMeta = meta?.optionInfo?.get(String(value));
    return { label: String(value), kind: Kind.EnumMember, detail: optionMeta?.description || '' };
  });
}

function getEventBindingCompletions() {
  const events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
    'keydown', 'keyup', 'keypress', 'input', 'change', 'focus', 'blur', 'submit',
    'touchstart', 'touchend', 'touchmove', 'scroll', 'wheel', 'contextmenu'];
  return events.map(e => ({ label: e, kind: Kind.Event, detail: `@${e} event binding` }));
}

/*******************************
          Hover
*******************************/

export function getHover(text, offset, { model, specRegistry } = {}) {
  const word = getWordAtOffset(text, offset);
  if (!word) { return null; }

  const helper = getHelper(word);
  if (helper) {
    return {
      contents: { kind: Markdown, value: `**${formatHelperSignature(word)}**\n\n${helper.description}` },
    };
  }

  if (model) {
    const method = model.instance.find(m => m.name === word);
    if (method) {
      return {
        contents: { kind: Markdown, value: `**${word}**(${method.params.map(p => p.name).join(', ')})\n\nComponent method` },
      };
    }
    const stateField = model.state.find(s => s.name === word);
    if (stateField) {
      return {
        contents: { kind: Markdown, value: `**${word}**: Signal\\<${stateField.inferredType}\\>\n\nState (default: ${JSON.stringify(stateField.defaultValue)})` },
      };
    }
    const settingField = model.settings.find(s => s.name === word);
    if (settingField) {
      return {
        contents: { kind: Markdown, value: `**${word}**: ${settingField.inferredType}\n\nSetting (default: ${JSON.stringify(settingField.defaultValue)})` },
      };
    }
  }

  return null;
}

/*******************************
        Diagnostics
*******************************/

export async function getDiagnostics(text) {
  const diagnostics = [];
  try {
    const { TemplateCompiler } = await import('@semantic-ui/templating');
    const compiler = new TemplateCompiler(text);
    compiler.compile();
  }
  catch (e) {
    diagnostics.push({
      severity: 1, // DiagnosticSeverity.Error
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: e.message || 'Template compile error',
      source: 'sui',
    });
  }
  return diagnostics;
}
