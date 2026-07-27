import { formatBlockDoc, getBlock, getBlockKeywords } from './block-registry.js';
import { formatHelperSignature, getHelper, getHelperSignature, helpers } from './helper-registry.js';
import {
  formatAttributeDoc,
  getAttributeBindingAtOffset,
  getBlockKeywordAtOffset,
  getCompletionContext,
  getHelperCallAtOffset,
  getIdentifierAtOffset,
  getScopeVariables,
  getTemplateReferenceAtOffset,
  getWordAtOffset,
} from './server-helpers.js';
import { SpecRegistry } from './spec-registry.js';

/*
  Stateful language service — the generic LSP backend.
  Any transport (Node stdio, Worker postMessage, WebSocket) instantiates this
  and feeds document events + requests. Zero transport dependencies.
*/

// LSP enum values inlined to avoid vscode-languageserver dependency
const Kind = {
  Method: 2,
  Function: 3,
  Variable: 6,
  Property: 10,
  Keyword: 14,
  Reference: 18,
  EnumMember: 20,
  Event: 23,
};
const Markdown = 'markdown';
const Severity = { Error: 1, Warning: 2, Info: 3, Hint: 4 };

export class LanguageService {
  /*
    resolver: { readFile, exists, listDir, glob }
    analyzer: function(source, filePath) → ComponentModel
    compiler: TemplateCompiler class (optional — falls back to dynamic import)
    warn: function(message) — called when fallback is used or compiler unavailable
  */
  constructor({ resolver, analyzer, compiler, warn } = {}) {
    this.resolver = resolver || null;
    this.analyzer = analyzer || null;
    this._compiler = compiler || null;
    this._warn = warn || (() => {});
    this.specRegistry = new SpecRegistry();
    this.documents = new Map();
    this.models = new Map();
  }

  /*******************************
      Document Management
  *******************************/

  didOpen(uri, text, version = 0) {
    const existing = this.documents.get(uri);
    if (existing?.text === text && existing?.version === version) {
      return;
    }
    this.documents.set(uri, { text, version });
    this.models.delete(uri);
  }

  didChange(uri, text, version = 0) {
    this.documents.set(uri, { text, version });
    this.models.delete(uri);
  }

  didClose(uri) {
    this.documents.delete(uri);
    this.models.delete(uri);
  }

  scanSpecs(root) {
    if (this.resolver) {
      this.specRegistry.scan(root, this.resolver);
    }
  }

  /*******************************
      LSP Requests
  *******************************/

  getCompletions(uri, position) {
    const doc = this.documents.get(uri);
    if (!doc) { return []; }
    const offset = this.positionToOffset(doc.text, position);
    const model = this.getModel(uri);
    return computeCompletions(doc.text, offset, model, this.specRegistry);
  }

  getHover(uri, position) {
    const doc = this.documents.get(uri);
    if (!doc) { return null; }
    const offset = this.positionToOffset(doc.text, position);
    const model = this.getModel(uri);
    return computeHover(doc.text, offset, model, this.specRegistry);
  }

  getSignatureHelp(uri, position) {
    const doc = this.documents.get(uri);
    if (!doc) { return null; }
    const offset = this.positionToOffset(doc.text, position);
    return computeSignatureHelp(doc.text, offset);
  }

  async getDiagnostics(uri) {
    const doc = this.documents.get(uri);
    if (!doc) { return []; }
    const Compiler = await this.getCompiler();
    if (!Compiler) { return []; }
    return computeDiagnostics(doc.text, Compiler);
  }

  async getCompiler() {
    if (this._compiler) { return this._compiler; }
    try {
      const mod = await import('@semantic-ui/compiler');
      this._compiler = mod.TemplateCompiler;
      this._warn('TemplateCompiler resolved via dynamic import (no injected compiler)');
      return this._compiler;
    }
    catch {
      this._warn('TemplateCompiler unavailable — diagnostics disabled');
      return null;
    }
  }

  /*******************************
      Component Model Resolution
  *******************************/

  getModel(uri) {
    if (this.models.has(uri)) {
      return this.models.get(uri);
    }
    if (!this.analyzer || !this.resolver) { return null; }

    const jsFile = this.resolveComponentFile(uri);
    if (!jsFile) { return null; }

    try {
      const source = this.resolver.readFile(jsFile);
      const model = this.analyzer(source, jsFile);
      this.models.set(uri, model);
      return model;
    }
    catch {
      return null;
    }
  }

  resolveComponentFile(templateUri) {
    const templatePath = uriToPath(templateUri);
    if (!templatePath || !this.resolver) { return null; }

    const dir = pathDirname(templatePath);
    const base = pathBasename(templatePath, '.html');

    // Convention: button.html → button.js
    const conventionPath = pathJoin(dir, `${base}.js`);
    if (this.resolver.exists(conventionPath)) {
      return conventionPath;
    }

    // Fallback: scan sibling .js files for a reference to the template filename
    try {
      const htmlFile = pathBasename(templatePath);
      for (const file of this.resolver.listDir(dir)) {
        if (!file.endsWith('.js') || file.endsWith('.spec.js') || file.endsWith('.component.js')) {
          continue;
        }
        const jsPath = pathJoin(dir, file);
        try {
          if (this.resolver.readFile(jsPath).includes(htmlFile)) {
            return jsPath;
          }
        }
        catch { /* skip */ }
      }
    }
    catch { /* dir not readable */ }

    return null;
  }

  /*******************************
      Position Utilities
  *******************************/

  positionToOffset(text, position) {
    let offset = 0;
    let line = 0;
    while (line < position.line && offset < text.length) {
      if (text[offset] === '\n') { line++; }
      offset++;
    }
    return offset + (position.character || 0);
  }

  offsetToPosition(text, offset) {
    let line = 0;
    let lastNewline = -1;
    for (let i = 0; i < offset && i < text.length; i++) {
      if (text[i] === '\n') {
        line++;
        lastNewline = i;
      }
    }
    return { line, character: offset - lastNewline - 1 };
  }
}

/*******************************
    URI / Path Helpers
*******************************/

export function uriToPath(uri) {
  try {
    const parsed = new URL(uri);
    if (parsed.protocol === 'file:') {
      let p = decodeURIComponent(parsed.pathname);
      if (/^\/[A-Z]:/i.test(p)) { p = p.slice(1); }
      return p;
    }
    // VSCode Remote WSL
    if (parsed.protocol === 'vscode-remote:' && parsed.hostname?.startsWith('wsl+')) {
      return decodeURIComponent(parsed.pathname);
    }
  }
  catch { /* unparseable */ }
  return null;
}

// Minimal path ops — no 'path' import needed
function pathDirname(p) {
  const i = p.lastIndexOf('/');
  return i > 0 ? p.substring(0, i) : '/';
}
function pathBasename(p, ext) {
  const b = p.substring(p.lastIndexOf('/') + 1);
  return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b;
}
function pathJoin(dir, file) {
  return dir.endsWith('/') ? dir + file : dir + '/' + file;
}

/*******************************
    Pure Completion Logic
*******************************/

function computeCompletions(text, offset, model, specRegistry) {
  const context = getCompletionContext(text, offset);

  switch (context.type) {
    case 'expression':
      return getExpressionCompletions(model, context.prefix, context.sections, getScopeVariables(text, offset));
    case 'block':
      return getBlockCompletions();
    case 'block-joiner':
      return context.joiners.map(j => ({ label: j, kind: Kind.Keyword, detail: `${context.keyword} ... ${j}` }));
    case 'reference':
      return getReferenceCompletions(text, model);
    case 'reference-data': {
      // keys name fresh entries in the invoked template's data context, so the
      // parent scope has nothing to offer. The reserved keys complete: `data`
      // everywhere, `name` in the verbose {>template} form
      const items = [];
      if (context.template === 'template') {
        items.push({
          label: 'name',
          kind: Kind.Property,
          detail: 'template to render',
          documentation: {
            kind: Markdown,
            value:
              'Selects which template `{>template}` renders. Accepts a template name or an expression resolving to one.',
          },
        });
      }
      items.push({
        label: 'data',
        kind: Kind.Property,
        detail: 'data context for the rendered template',
        documentation: {
          kind: Markdown,
          value: 'Sets the data context for the rendered template. Accepts an expression or an inline object.',
        },
      });
      return items;
    }
    case 'html-attribute':
      return getAttributeCompletions(context.tagName, specRegistry);
    case 'attribute-value':
      return getAttributeValueCompletions(context.tagName, context.attributeName, specRegistry);
    case 'html-tag':
      return getTagNameCompletions(specRegistry);
    case 'event-binding':
      return getEventBindingCompletions();
    default:
      return [];
  }
}

function getExpressionCompletions(model, prefix = '', sections = [], scopeVariables = []) {
  const items = [];
  // block-scope bindings shadow everything else, same as the renderer's data layering
  for (const variable of scopeVariables) {
    items.push({
      label: variable.name,
      kind: Kind.Variable,
      detail: variable.description,
      documentation: {
        kind: Markdown,
        value: `**${variable.name}**\n\n${variable.description}\n\nScoped to \`${variable.tag}\``,
      },
      sortText: '0!' + variable.name,
    });
  }
  for (const name of sections) {
    items.push({
      label: name,
      kind: Kind.Keyword,
      detail: getBlock(name).description,
      documentation: { kind: Markdown, value: formatBlockDoc(name) },
      sortText: '0' + name,
    });
  }
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
      const def = field.defaultValue != null ? ` = ${JSON.stringify(field.defaultValue)}` : '';
      items.push({
        label: field.name,
        kind: Kind.Property,
        detail: `state: ${field.inferredType}${def}`,
        documentation: field.description ? { kind: Markdown, value: `*${field.description}*` } : undefined,
        sortText: '1' + field.name,
      });
    }
    for (const field of model.settings) {
      const def = field.defaultValue != null ? ` = ${JSON.stringify(field.defaultValue)}` : '';
      items.push({
        label: field.name,
        kind: Kind.Property,
        detail: `setting: ${field.inferredType}${def}`,
        documentation: field.description ? { kind: Markdown, value: `*${field.description}*` } : undefined,
        sortText: '1' + field.name,
      });
    }
  }
  // Only show helpers once the user has started typing — avoids flooding
  // the list with 50+ global helpers when opening a fresh expression
  if (prefix.length > 0) {
    for (const name of Object.keys(helpers)) {
      items.push({
        label: name,
        kind: Kind.Function,
        detail: formatHelperSignature(name),
        sortText: '2' + name,
      });
    }
  }
  return items;
}

function getBlockCompletions() {
  return getBlockKeywords().map(name => ({
    label: name,
    kind: Kind.Keyword,
    detail: getBlock(name).description,
    documentation: { kind: Markdown, value: formatBlockDoc(name) },
  }));
}

function getReferenceCompletions(text, model) {
  const items = [
    { label: 'template', kind: Kind.Keyword, detail: "Verbose subtemplate ({>template name='x' data={...}})" },
    { label: 'slot', kind: Kind.Keyword, detail: 'Content projection slot' },
  ];

  // Snippet names defined in the current template
  const snippetPattern = /\{#snippet\s+(\w+)\}/g;
  let match;
  while ((match = snippetPattern.exec(text)) !== null) {
    items.push({ label: match[1], kind: Kind.Reference, detail: 'Snippet' });
  }

  // Subtemplate names from component model
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
  const events = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'keydown',
    'keyup',
    'keypress',
    'input',
    'change',
    'focus',
    'blur',
    'submit',
    'touchstart',
    'touchend',
    'touchmove',
    'scroll',
    'wheel',
    'contextmenu',
  ];
  return events.map(e => ({ label: e, kind: Kind.Event, detail: `@${e} event binding` }));
}

function getTagNameCompletions(specRegistry) {
  if (!specRegistry) { return []; }
  return specRegistry.getTagNames().map(tag => {
    const spec = specRegistry.get(tag);
    return {
      label: tag,
      kind: Kind.Property,
      detail: spec?.description || '',
      sortText: tag,
    };
  });
}

/*******************************
    Pure Hover Logic
*******************************/

function computeHover(text, offset, model) {
  // Blocks resolve first: {#guard} is the block, {guard x} the helper
  const blockKeyword = getBlockKeywordAtOffset(text, offset);
  if (blockKeyword) {
    return { contents: { kind: Markdown, value: formatBlockDoc(blockKeyword.name, blockKeyword.tag) } };
  }

  // {>name} resolves against subtemplates and snippets, never the data scope,
  // even when a data variable shares the name
  const reference = getTemplateReferenceAtOffset(text, offset);
  if (reference) {
    return { contents: { kind: Markdown, value: formatReferenceHover(reference, text, model) } };
  }

  const attributeBinding = getAttributeBindingAtOffset(text, offset);
  if (attributeBinding) {
    const { kind, name } = attributeBinding;
    const value = kind === 'event'
      ? `**@${name}**\n\nBinds a \`${name}\` event from inside the template. The expression names the handler, `
        + `like a setting or template method.\n\n\`\`\`html\n<div @${name}={doSomething}></div>\n\`\`\`\n\n`
        + `[docs](/docs/guides/components/events#event-handler)`
      : `**.${name}**\n\nPasses the value as the \`${name}\` property instead of an attribute. Useful for `
        + `unserializable content like functions, or for modifying raw DOM properties directly.\n\n`
        + `\`\`\`html\n<ui-chart .${name}={getComplexData}>\n\`\`\`\n\n`
        + `[docs](/docs/guides/templates/expressions#properties)`;
    return { contents: { kind: Markdown, value } };
  }

  let word = getWordAtOffset(text, offset);
  if (!word) { return null; }

  // in a dotted path like {fruit.taste} the hovered segment is the lookup:
  // the head resolves as a name, later segments are property accesses on it
  const identifier = getIdentifierAtOffset(text, offset);
  if (identifier) {
    if (!identifier.head) { return null; }
    word = identifier.name;
  }

  // block-scope bindings shadow helpers and component data, like the renderer
  const scopeVariable = getScopeVariables(text, offset).find(variable => variable.name === word);
  if (scopeVariable) {
    return {
      contents: {
        kind: Markdown,
        value: `**${word}**\n\n${scopeVariable.description}\n\nScoped to \`${scopeVariable.tag}\``,
      },
    };
  }

  const helper = getHelper(word);
  if (helper) {
    return { contents: { kind: Markdown, value: `**${formatHelperSignature(word)}**\n\n${helper.description}` } };
  }

  if (model) {
    const method = model.instance.find(m => m.name === word);
    if (method) {
      return {
        contents: {
          kind: Markdown,
          value: `**${word}**(${method.params.map(p => p.name).join(', ')})\n\nComponent method`,
        },
      };
    }
    const stateField = model.state.find(s => s.name === word);
    if (stateField) {
      return {
        contents: {
          kind: Markdown,
          value: `**${word}**: Signal\\<${stateField.inferredType}\\>\n\nState${formatDefault(stateField)}`
            + formatDescription(stateField),
        },
      };
    }
    const settingField = model.settings.find(s => s.name === word);
    if (settingField) {
      return {
        contents: {
          kind: Markdown,
          value: `**${word}**: ${settingField.inferredType}\n\nSetting${formatDefault(settingField)}`
            + formatDescription(settingField),
        },
      };
    }
  }

  return null;
}

/*******************************
    Pure Signature Help
*******************************/

function computeSignatureHelp(text, offset) {
  const call = getHelperCallAtOffset(text, offset);
  if (!call) { return null; }

  const signature = getHelperSignature(call.name);
  if (!signature) { return null; }

  const helper = getHelper(call.name);
  const isVariadic = helper.params.at(-1)?.name.startsWith('...');
  return {
    signatures: [{
      ...signature,
      documentation: { kind: Markdown, value: helper.description },
    }],
    activeSignature: 0,
    // a rest parameter stays highlighted however many arguments follow it
    activeParameter: isVariadic
      ? Math.min(call.argIndex, helper.params.length - 1)
      : call.argIndex,
  };
}

/* a default that could not be materialized statically stays silent — no `undefined` in hovers */
function formatDefault(field) {
  return field.defaultValue !== undefined ? ` (default: ${JSON.stringify(field.defaultValue)})` : '';
}

/* the trailing comment on a field's declaration, when the author left one */
function formatDescription(field) {
  return field.description ? `\n\n*${field.description}*` : '';
}

function formatReferenceHover(reference, text, model) {
  if (reference.kind === 'key') {
    // `data` sets the whole context in both forms; `name` selects the template
    // only in the verbose {>template} form, elsewhere it is an ordinary key
    if (reference.template === 'template' && reference.name === 'name') {
      return `**name**\n\nSelects which template \`{>template}\` renders. Accepts a template name or an `
        + `expression resolving to one.\n\n[docs](/docs/guides/templates/subtemplates)`;
    }
    if (reference.name === 'data') {
      return `**data**\n\nSets the data context for the rendered template. Accepts an expression or an `
        + `inline object.\n\n[docs](/docs/guides/templates/subtemplates)`;
    }
    return `**${reference.name}**\n\nDefines \`${reference.name}\` in the data context of \`{>${reference.template}}\`. `
      + `The value right of \`=\` is evaluated in this template's scope.\n\n[docs](/docs/guides/templates/subtemplates)`;
  }
  const { name } = reference;
  if (name === 'template') {
    return `**{>template}**\n\nVerbose subtemplate reference, for dynamic names and explicit data: `
      + `\`{>template name='x' data={...}}\`\n\n[docs](/docs/guides/templates/subtemplates)`;
  }
  if (name === 'slot') {
    return `**{>slot}**\n\nContent projection slot. Renders content placed between the component's tags.`
      + `\n\n[docs](/docs/guides/templates/slots)`;
  }
  if (new RegExp(`\\{#snippet\\s+${name}[\\s}]`).test(text)) {
    return `**{>${name}}**\n\nRenders the \`${name}\` snippet defined in this template`
      + `\n\n[docs](/docs/guides/templates/snippets)`;
  }
  if (model?.subTemplates?.[name]) {
    return `**{>${name}}**\n\nRenders the \`${name}\` subtemplate from the component definition`
      + `\n\n[docs](/docs/guides/templates/subtemplates)`;
  }
  return `**{>${name}}**\n\nRenders the \`${name}\` subtemplate or snippet`
    + `\n\n[docs](/docs/guides/templates/subtemplates)`;
}

/*******************************
    Pure Diagnostics
*******************************/

function computeDiagnostics(text, TemplateCompiler) {
  const diagnostics = [];
  try {
    const compiler = new TemplateCompiler(text);
    compiler.compile(undefined, { recoverable: true });
    for (const error of compiler.errors || []) {
      diagnostics.push({
        severity: Severity.Error,
        range: diagnosticRange(text, error.pos ?? 0),
        message: error.message || 'Template error',
        source: 'sui',
      });
    }
  }
  catch (e) {
    // Compiler threw even in recoverable mode — fallback to single diagnostic
    diagnostics.push({
      severity: Severity.Error,
      range: diagnosticRange(text, 0),
      message: e.message || 'Template compile error',
      source: 'sui',
    });
  }
  return diagnostics;
}

/*
  Spans the offending tag, from the error offset to its closing brace or end of
  line. Positions must stay inside the document: the LSP spec says clients may
  clamp, but @codemirror/lsp-client throws on out-of-range positions and one bad
  range takes down the whole publish.
*/
function diagnosticRange(text, offset) {
  offset = Math.min(offset, text.length);
  const lineEnd = text.indexOf('\n', offset);
  const close = text.indexOf('}', offset);
  let endOffset = lineEnd === -1 ? text.length : lineEnd;
  if (close !== -1 && close < endOffset) {
    endOffset = close + 1;
  }
  return { start: offsetToPos(text, offset), end: offsetToPos(text, Math.max(endOffset, offset)) };
}

function offsetToPos(text, offset) {
  let line = 0;
  let lastNewline = -1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text[i] === '\n') {
      line++;
      lastNewline = i;
    }
  }
  return { line, character: offset - lastNewline - 1 };
}
