import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  CompletionItemKind,
  createConnection,
  DiagnosticSeverity,
  MarkupKind,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';

import { analyzeComponent } from '../shared/component-analyzer.js';
import { formatHelperSignature, getHelper, helpers } from '../shared/helper-registry.js';
import { SpecRegistry } from '../shared/spec-registry.js';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let specRegistry = new SpecRegistry();
let projectRoot = '';

// Component model cache: template path → ComponentModel
const componentModels = new Map();

connection.onInitialize((params) => {
  projectRoot = params.rootUri?.replace('file://', '') || params.rootPath || '';

  specRegistry = new SpecRegistry();
  specRegistry.scan(projectRoot);

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: ['{', '>', '<', '@', '"', "'", ' ', '.'],
        resolveProvider: true,
      },
      hoverProvider: true,
    },
  };
});

/*******************************
        Diagnostics
*******************************/

documents.onDidChangeContent(async (change) => {
  if (!change.document.uri.endsWith('.html')) { return; }
  await validateTemplate(change.document);
});

async function validateTemplate(document) {
  const text = document.getText();
  const diagnostics = [];

  try {
    // Dynamic import since @semantic-ui/compiler is ESM
    const { TemplateCompiler } = await import('@semantic-ui/compiler');
    const compiler = new TemplateCompiler(text);
    compiler.compile(undefined, { recoverable: true });

    for (const error of compiler.errors) {
      const pos = document.positionAt(error.pos);
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: { start: pos, end: { line: pos.line, character: pos.character + 10 } },
        message: error.message,
        source: 'sui',
      });
    }
  }
  catch (e) {
    // Compiler threw even in recoverable mode — report as single diagnostic
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
      message: e.message || 'Template compile error',
      source: 'sui',
    });
  }

  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

/*******************************
        Completions
*******************************/

connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) { return []; }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  const context = getCompletionContext(text, offset);

  switch (context.type) {
    case 'expression':
      return getExpressionCompletions(document);

    case 'block':
      return getBlockCompletions();

    case 'reference':
      return getReferenceCompletions(document);

    case 'html-attribute':
      return getAttributeCompletions(context.tagName);

    case 'attribute-value':
      return getAttributeValueCompletions(context.tagName, context.attributeName);

    case 'event-binding':
      return getEventBindingCompletions();

    default:
      return [];
  }
});

/*
  Determines what kind of completion context the cursor is in.
*/
function getCompletionContext(text, offset) {
  // Walk backwards from cursor to find context
  let i = offset - 1;

  // Check if inside {expression}
  let braceDepth = 0;
  let j = i;
  while (j >= 0) {
    if (text[j] === '}') { braceDepth++; }
    if (text[j] === '{') {
      braceDepth--;
      if (braceDepth < 0) {
        // We're inside a { } expression
        const afterBrace = text.substring(j + 1, offset).trimStart();

        if (afterBrace.startsWith('#')) {
          return { type: 'block' };
        }
        if (afterBrace.startsWith('>')) {
          return { type: 'reference' };
        }
        return { type: 'expression' };
      }
    }
    j--;
  }

  // Check if inside an HTML tag
  const beforeCursor = text.substring(Math.max(0, offset - 200), offset);

  // @event binding
  if (beforeCursor.match(/@\w*$/)) {
    return { type: 'event-binding' };
  }

  // Inside an attribute value: <ui-button size="|
  const attrValueMatch = beforeCursor.match(/<([\w-]+)\s+[^>]*?([\w-]+)\s*=\s*["']([^"']*)$/);
  if (attrValueMatch) {
    return {
      type: 'attribute-value',
      tagName: attrValueMatch[1],
      attributeName: attrValueMatch[2],
    };
  }

  // Inside a tag but not in an attribute value: <ui-button |
  const tagMatch = beforeCursor.match(/<([\w-]+)\s+[^>]*$/);
  if (tagMatch) {
    return { type: 'html-attribute', tagName: tagMatch[1] };
  }

  // After <: tag name completion
  if (beforeCursor.match(/<[\w-]*$/)) {
    return { type: 'html-tag' };
  }

  return { type: 'none' };
}

/*
  Expression completions: settings + state + instance methods + helpers.
*/
function getExpressionCompletions(document) {
  const items = [];
  const model = getComponentModel(document);

  // Instance methods
  if (model) {
    for (const method of model.instance) {
      items.push({
        label: method.name,
        kind: CompletionItemKind.Method,
        detail: `(${method.params.map(p => p.name).join(', ')})`,
        sortText: '0' + method.name,
        data: { type: 'instance', name: method.name },
      });
    }

    // State
    for (const field of model.state) {
      items.push({
        label: field.name,
        kind: CompletionItemKind.Property,
        detail: `state: ${field.inferredType}`,
        sortText: '1' + field.name,
        data: { type: 'state', name: field.name },
      });
    }

    // Settings
    for (const field of model.settings) {
      items.push({
        label: field.name,
        kind: CompletionItemKind.Property,
        detail: `setting: ${field.inferredType}`,
        sortText: '1' + field.name,
        data: { type: 'setting', name: field.name },
      });
    }
  }

  // Helpers
  for (const name of Object.keys(helpers)) {
    const sig = formatHelperSignature(name);
    items.push({
      label: name,
      kind: CompletionItemKind.Function,
      detail: sig,
      sortText: '2' + name,
      data: { type: 'helper', name },
    });
  }

  return items;
}

/*
  Block completions: {#if}, {#each}, {#async}, etc.
*/
function getBlockCompletions() {
  return [
    {
      label: 'if',
      kind: CompletionItemKind.Keyword,
      insertText: 'if ${1:condition}}$0{/if}',
      detail: 'Conditional block',
    },
    {
      label: 'each',
      kind: CompletionItemKind.Keyword,
      insertText: 'each ${1:item} in ${2:items}}$0{/each}',
      detail: 'Loop block',
    },
    {
      label: 'async',
      kind: CompletionItemKind.Keyword,
      insertText: 'async ${1:promise} as ${2:result}}$0{/async}',
      detail: 'Async block',
    },
    {
      label: 'snippet',
      kind: CompletionItemKind.Keyword,
      insertText: 'snippet ${1:name}}$0{/snippet}',
      detail: 'Reusable template section',
    },
    {
      label: 'rerender',
      kind: CompletionItemKind.Keyword,
      insertText: 'rerender ${1:key}}$0{/rerender}',
      detail: 'Force re-render on key change',
    },
    {
      label: 'guard',
      kind: CompletionItemKind.Keyword,
      insertText: 'guard ${1:expression}}$0{/guard}',
      detail: 'Re-render only when value changes',
    },
    { label: 'html', kind: CompletionItemKind.Keyword, insertText: 'html ${1:content}}', detail: 'Raw HTML output' },
  ];
}

/*
  Reference completions: {>slot}, {>template}, {>snippetName}.
*/
function getReferenceCompletions(document) {
  const items = [
    { label: 'slot', kind: CompletionItemKind.Keyword, detail: 'Content projection slot' },
  ];

  const model = getComponentModel(document);
  if (model) {
    for (const name of Object.keys(model.subTemplates)) {
      items.push({
        label: name,
        kind: CompletionItemKind.Reference,
        detail: 'Subtemplate',
      });
    }
  }

  return items;
}

/*
  HTML attribute completions for SUI components.
*/
function getAttributeCompletions(tagName) {
  const spec = specRegistry.get(tagName);
  if (!spec) { return []; }

  const items = [];

  // Named attributes from spec
  for (const attr of spec.attributes) {
    const meta = spec.attributeInfo.get(attr);
    items.push({
      label: attr,
      kind: CompletionItemKind.Property,
      detail: meta?.description || spec.propertyTypes[attr] || '',
      sortText: String(meta?.usageLevel ?? 3).padStart(2, '0') + attr,
      documentation: meta
        ? {
          kind: MarkupKind.Markdown,
          value: formatAttributeDoc(attr, meta, spec),
        }
        : undefined,
    });
  }

  // Option attributes (bare values like "primary", "large")
  for (const [value, attr] of Object.entries(spec.optionAttributes)) {
    // Skip if same as an attribute name (boolean-style like disabled="disabled")
    if (spec.attributes.includes(value)) { continue; }

    const meta = spec.attributeInfo.get(attr);
    const optionMeta = meta?.optionInfo?.get(value);
    items.push({
      label: value,
      kind: CompletionItemKind.EnumMember,
      detail: `→ ${attr}="${value}"`,
      sortText: String(meta?.usageLevel ?? 3).padStart(2, '0') + value,
      documentation: optionMeta?.description
        ? {
          kind: MarkupKind.Markdown,
          value: optionMeta.description,
        }
        : undefined,
    });
  }

  return items;
}

/*
  Attribute value completions (e.g., size="|").
*/
function getAttributeValueCompletions(tagName, attributeName) {
  const spec = specRegistry.get(tagName);
  if (!spec) { return []; }

  const values = spec.allowedValues[attributeName];
  if (!values) { return []; }

  const meta = spec.attributeInfo.get(attributeName);

  return values.map(value => {
    const optionMeta = meta?.optionInfo?.get(String(value));
    return {
      label: String(value),
      kind: CompletionItemKind.EnumMember,
      detail: optionMeta?.description || '',
    };
  });
}

/*
  Event binding completions (@click, @input, etc).
*/
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
  return events.map(e => ({
    label: e,
    kind: CompletionItemKind.Event,
    detail: `@${e} event binding`,
  }));
}

/*******************************
          Hover
*******************************/

connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) { return null; }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  const word = getWordAtOffset(text, offset);
  if (!word) { return null; }

  // Check helpers
  const helper = getHelper(word);
  if (helper) {
    const sig = formatHelperSignature(word);
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${sig}**\n\n${helper.description}`,
      },
    };
  }

  // Check component model
  const model = getComponentModel(document);
  if (model) {
    const method = model.instance.find(m => m.name === word);
    if (method) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: `**${word}**(${method.params.map(p => p.name).join(', ')})\n\nComponent method`,
        },
      };
    }

    const stateField = model.state.find(s => s.name === word);
    if (stateField) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: `**${word}**: Signal\\<${stateField.inferredType}\\>\n\nState variable (default: ${
            JSON.stringify(stateField.defaultValue)
          })`,
        },
      };
    }

    const settingField = model.settings.find(s => s.name === word);
    if (settingField) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: `**${word}**: ${settingField.inferredType}\n\nSetting (default: ${
            JSON.stringify(settingField.defaultValue)
          })`,
        },
      };
    }
  }

  return null;
});

/*******************************
        Helpers
*******************************/

function getComponentModel(document) {
  // TODO: resolve the .js file that imports this .html template
  // For now, return cached model if available
  return componentModels.get(document.uri) || null;
}

function getWordAtOffset(text, offset) {
  let start = offset;
  let end = offset;
  while (start > 0 && /[\w.]/.test(text[start - 1])) { start--; }
  while (end < text.length && /[\w.]/.test(text[end])) { end++; }
  const word = text.substring(start, end);
  // Strip dots from edges
  return word.replace(/^\.+|\.+$/g, '') || null;
}

function formatAttributeDoc(attr, meta, spec) {
  let doc = '';
  if (meta.name) { doc += `**${meta.name}**\n\n`; }
  if (meta.description) { doc += `${meta.description}\n\n`; }
  const type = spec.propertyTypes[attr];
  if (type) { doc += `Type: \`${type}\`\n\n`; }
  const values = spec.allowedValues[attr];
  if (values?.length) { doc += `Values: ${values.map(v => `\`${v}\``).join(', ')}\n\n`; }
  if (meta.exampleCode) {
    const example = Array.isArray(meta.exampleCode) ? meta.exampleCode[0] : meta.exampleCode;
    doc += `\`\`\`html\n${example.trim()}\n\`\`\``;
  }
  return doc;
}

documents.listen(connection);
connection.listen();
