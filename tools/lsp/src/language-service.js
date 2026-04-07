import { getCompletionContext, getWordAtOffset, formatAttributeDoc } from './server-helpers.js';
import { formatHelperSignature, getHelper, helpers } from './helper-registry.js';
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
  Property: 10,
  Keyword: 14,
  Reference: 18,
  EnumMember: 20,
  Event: 23,
};
const SnippetFormat = 2;
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
    this.documents.set(uri, { text, version });
    this.models.delete(uri); // invalidate stale model
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
      const mod = await import('@semantic-ui/templating');
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
    catch { return null; }
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
      if (text[i] === '\n') { line++; lastNewline = i; }
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
function pathDirname(p) { const i = p.lastIndexOf('/'); return i > 0 ? p.substring(0, i) : '/'; }
function pathBasename(p, ext) { const b = p.substring(p.lastIndexOf('/') + 1); return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b; }
function pathJoin(dir, file) { return dir.endsWith('/') ? dir + file : dir + '/' + file; }

/*******************************
    Pure Completion Logic
*******************************/

function computeCompletions(text, offset, model, specRegistry) {
  const context = getCompletionContext(text, offset);

  switch (context.type) {
    case 'expression':
      return getExpressionCompletions(model, context.prefix);
    case 'block':
      return getBlockCompletions();
    case 'reference':
      return getReferenceCompletions(text, model);
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

function getExpressionCompletions(model, prefix = '') {
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
      const def = field.defaultValue != null ? ` = ${JSON.stringify(field.defaultValue)}` : '';
      items.push({
        label: field.name,
        kind: Kind.Property,
        detail: `state: ${field.inferredType}${def}`,
        sortText: '1' + field.name,
      });
    }
    for (const field of model.settings) {
      const def = field.defaultValue != null ? ` = ${JSON.stringify(field.defaultValue)}` : '';
      items.push({
        label: field.name,
        kind: Kind.Property,
        detail: `setting: ${field.inferredType}${def}`,
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

function getReferenceCompletions(text, model) {
  const items = [
    { label: 'template', kind: Kind.Keyword, detail: 'Verbose subtemplate ({>template name=\'x\' data={...}})' },
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
  const events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
    'keydown', 'keyup', 'keypress', 'input', 'change', 'focus', 'blur', 'submit',
    'touchstart', 'touchend', 'touchmove', 'scroll', 'wheel', 'contextmenu'];
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
  const word = getWordAtOffset(text, offset);
  if (!word) { return null; }

  const helper = getHelper(word);
  if (helper) {
    return { contents: { kind: Markdown, value: `**${formatHelperSignature(word)}**\n\n${helper.description}` } };
  }

  if (model) {
    const method = model.instance.find(m => m.name === word);
    if (method) {
      return { contents: { kind: Markdown, value: `**${word}**(${method.params.map(p => p.name).join(', ')})\n\nComponent method` } };
    }
    const stateField = model.state.find(s => s.name === word);
    if (stateField) {
      return { contents: { kind: Markdown, value: `**${word}**: Signal\\<${stateField.inferredType}\\>\n\nState (default: ${JSON.stringify(stateField.defaultValue)})` } };
    }
    const settingField = model.settings.find(s => s.name === word);
    if (settingField) {
      return { contents: { kind: Markdown, value: `**${word}**: ${settingField.inferredType}\n\nSetting (default: ${JSON.stringify(settingField.defaultValue)})` } };
    }
  }

  return null;
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
      const pos = offsetToPos(text, error.pos ?? 0);
      diagnostics.push({
        severity: Severity.Error,
        range: {
          start: pos,
          end: { line: pos.line, character: pos.character + 10 },
        },
        message: error.message || 'Template error',
        source: 'sui',
      });
    }
  }
  catch (e) {
    // Compiler threw even in recoverable mode — fallback to single diagnostic
    diagnostics.push({
      severity: Severity.Error,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: e.message || 'Template compile error',
      source: 'sui',
    });
  }
  return diagnostics;
}

function offsetToPos(text, offset) {
  let line = 0;
  let lastNewline = -1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text[i] === '\n') { line++; lastNewline = i; }
  }
  return { line, character: offset - lastNewline - 1 };
}
