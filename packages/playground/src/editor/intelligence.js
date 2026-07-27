import { autocompletion } from '@codemirror/autocomplete';
import { Prec, StateEffect, StateField } from '@codemirror/state';
import { EditorView, hoverTooltip, keymap, showTooltip } from '@codemirror/view';

/*
  Editor-side bindings for language intelligence. Providers speak plain data
  ({ name, kind } entries, { text, start, length } hovers, signature items) so
  the adapter surface stays engine-neutral — a Monaco binding would consume the
  same providers.
*/

const completionTypes = {
  var: 'variable',
  let: 'variable',
  const: 'constant',
  function: 'function',
  method: 'method',
  class: 'class',
  interface: 'interface',
  enum: 'enum',
  module: 'namespace',
  property: 'property',
  getter: 'property',
  setter: 'property',
  keyword: 'keyword',
  string: 'text',
  type: 'type',
  parameter: 'variable',
  alias: 'type',
};

const createLink = ({ url, label }, resolveLink) => {
  const anchor = document.createElement('a');
  anchor.href = resolveLink ? resolveLink(url) : url;
  anchor.target = '_blank';
  anchor.rel = 'noopener';
  anchor.textContent = label;
  // keep editor focus so the surrounding tooltip survives long enough to open the link
  anchor.addEventListener('mousedown', event => event.preventDefault());
  return anchor;
};

const renderLinks = (links, resolveLink) => {
  const row = document.createElement('div');
  row.className = 'cm-intelligence-links';
  for (const link of links) {
    // a symbol name reads as a reference, not an exit — 'docs' says where the click goes
    const label = links.length === 1 ? 'docs' : `${link.label} docs`;
    row.appendChild(createLink({ url: link.url, label }, resolveLink));
  }
  return row;
};

// `code`, **bold**, *italic*, [label](url) — ordered so ** wins over *
const appendInline = (parent, text, resolveLink) => {
  // built per call: emphasis recurses, and a shared /g/ regex would have its
  // lastIndex reset by the inner scan and rematch the same span forever
  const inlineMarkdown = /`([^`]+)`|\*\*([\s\S]+?)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\s*\(([^)\s]+)\)/g;
  let last = 0;
  let match;
  while ((match = inlineMarkdown.exec(text)) !== null) {
    if (match.index > last) {
      parent.appendChild(document.createTextNode(text.slice(last, match.index)));
    }
    const [full, code, bold, italic, label, url] = match;
    if (code !== undefined) {
      const element = document.createElement('code');
      element.textContent = code;
      parent.appendChild(element);
    }
    else if (bold !== undefined || italic !== undefined) {
      const element = document.createElement(bold !== undefined ? 'strong' : 'em');
      appendInline(element, bold ?? italic, resolveLink);
      parent.appendChild(element);
    }
    else {
      parent.appendChild(createLink({ url, label }, resolveLink));
    }
    last = match.index + full.length;
  }
  if (last < text.length) {
    parent.appendChild(document.createTextNode(text.slice(last)));
  }
};

/*
  JSDoc bodies are markdown, and TypeScript hands them over verbatim. Renders
  the subset that shows up in practice as DOM nodes rather than innerHTML, so a
  package's documentation can never inject markup into the editor.
*/
export const renderMarkdown = (text, resolveLink) => {
  const dom = document.createElement('div');
  // fenced blocks split first so their contents never reach the inline pass
  const segments = text.split(/```/);
  segments.forEach((segment, index) => {
    if (index % 2) {
      const block = document.createElement('pre');
      // a fence may open with a language tag
      block.textContent = segment.replace(/^[\w-]*\n/, '').replace(/\s+$/, '');
      dom.appendChild(block);
      return;
    }
    for (const block of segment.split(/\n{2,}/)) {
      const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
      if (!lines.length) { continue; }
      if (lines.every(line => /^[-*+]\s+/.test(line))) {
        const list = document.createElement('ul');
        for (const line of lines) {
          const item = document.createElement('li');
          appendInline(item, line.replace(/^[-*+]\s+/, ''), resolveLink);
          list.appendChild(item);
        }
        dom.appendChild(list);
        continue;
      }
      // markdown soft-wraps: a single newline is a space, a blank line is a break
      const element = document.createElement('p');
      appendInline(element, lines.join(' '), resolveLink);
      dom.appendChild(element);
    }
  });
  return dom;
};

const renderInfo = (className, { text, documentation, links }, resolveLink) => {
  const dom = document.createElement('div');
  dom.className = className;
  const signature = document.createElement('code');
  signature.textContent = text;
  dom.appendChild(signature);
  if (documentation) {
    const docs = renderMarkdown(documentation, resolveLink);
    docs.className = 'cm-intelligence-docs';
    dom.appendChild(docs);
  }
  if (links?.length) {
    dom.appendChild(renderLinks(links, resolveLink));
  }
  return dom;
};

export const completionSource = ({ provider, detail, fileName, resolveLink }) => {
  return async (context) => {
    const word = context.matchBefore(/[\w$]*/);
    const empty = !word || word.from === word.to;
    // the object-literal-in-argument case pops options-bag members on the opening brace
    const braceTrigger = empty && !context.explicit
      && context.matchBefore(/\./) === null
      && context.matchBefore(/[(,]\s*\{\s*/) !== null;
    if (empty && !context.explicit && !braceTrigger && context.matchBefore(/\./) === null) {
      return null;
    }
    const result = await provider(fileName, context.pos);
    if (!result?.entries?.length || context.aborted) {
      return null;
    }
    let entries = result.entries;
    if (braceTrigger) {
      // the brace popup teaches the options bag — contextual members only
      // (sortText buckets ≤12); shorthand and scope symbols return once typing starts
      entries = entries.filter(entry => Number.parseInt(entry.sortText, 10) <= 12);
      if (!entries.length) {
        return null;
      }
    }
    return {
      from: word && word.from !== word.to ? word.from : context.pos,
      options: entries.map(entry => ({
        label: entry.name,
        type: completionTypes[entry.kind] ?? entry.kind,
        boost: entry.sortText ? -Number.parseInt(entry.sortText, 10) || 0 : 0,
        info: detail && (async () => {
          const details = await detail(fileName, context.pos, entry.name);
          if (!details?.text) {
            return null;
          }
          return { dom: renderInfo('cm-intelligence-info', details, resolveLink) };
        }),
      })),
      validFor: /^[\w$]*$/,
    };
  };
};

/*
  Parameter hints, VS Code style — a tooltip above the cursor while typing call
  arguments. Requests fire on `(` and `,`, then follow the cursor while help is
  active; the provider returning null (cursor left the call) dismisses.
*/
const signatureHelp = ({ provider, fileName, resolveLink }) => {
  const setSignatureHelp = StateEffect.define();

  const renderSignature = ({ signatures, selectedSignature, activeParameter, parameterShape }) => {
    const item = signatures[selectedSignature] ?? signatures[0];
    const dom = document.createElement('div');
    dom.className = 'cm-intelligence-signature';
    const signature = document.createElement('code');
    signature.appendChild(document.createTextNode(item.prefix));
    item.parameters.forEach((parameter, index) => {
      if (index > 0) {
        signature.appendChild(document.createTextNode(item.separator));
      }
      const label = document.createElement('span');
      if (index === activeParameter) {
        label.className = 'cm-signature-activeParameter';
      }
      label.textContent = parameter.label;
      signature.appendChild(label);
    });
    signature.appendChild(document.createTextNode(item.suffix));
    dom.appendChild(signature);
    const documentation = item.parameters[activeParameter]?.documentation || item.documentation;
    if (documentation) {
      const docs = renderMarkdown(documentation, resolveLink);
      docs.className = 'cm-intelligence-docs';
      dom.appendChild(docs);
    }
    if (parameterShape) {
      const shape = document.createElement('code');
      shape.className = 'cm-intelligence-shape';
      const lines = parameterShape.properties.map(property =>
        `  ${property.name}${property.optional ? '?' : ''}: ${property.type};`
      );
      shape.textContent = `${parameterShape.name} {\n${lines.join('\n')}\n}`;
      dom.appendChild(shape);
    }
    if (item.links?.length) {
      dom.appendChild(renderLinks(item.links, resolveLink));
    }
    return dom;
  };

  const field = StateField.define({
    create: () => null,
    update(value, transaction) {
      for (const effect of transaction.effects) {
        if (effect.is(setSignatureHelp)) {
          value = effect.value;
        }
      }
      if (value && transaction.docChanged) {
        value = { ...value, pos: transaction.changes.mapPos(value.pos) };
      }
      return value;
    },
    provide: (self) =>
      showTooltip.from(self, value =>
        value && {
          pos: value.pos,
          above: true,
          create: () => ({ dom: renderSignature(value.help) }),
        }),
  });

  let requestToken = 0;
  const watcher = EditorView.updateListener.of((update) => {
    const active = update.state.field(field) !== null;
    let triggered = false;
    if (update.docChanged) {
      update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        const text = inserted.toString();
        if (text.includes('(') || text.includes(',')) {
          triggered = true;
        }
      });
    }
    if (!triggered && !(active && (update.docChanged || update.selectionSet))) {
      return;
    }
    const token = ++requestToken;
    const pos = update.state.selection.main.head;
    Promise.resolve(provider(fileName, pos)).then((help) => {
      if (token !== requestToken) {
        return;
      }
      const value = help?.signatures?.length ? { pos, help } : null;
      // no-op dispatches (null over null) would loop the update listener
      if (value !== null || update.view.state.field(field) !== null) {
        update.view.dispatch({ effects: setSignatureHelp.of(value) });
      }
    }).catch(() => {});
  });

  const dismissKeymap = Prec.high(keymap.of([{
    key: 'Escape',
    run: (view) => {
      if (view.state.field(field) === null) {
        return false;
      }
      view.dispatch({ effects: setSignatureHelp.of(null) });
      return true;
    },
  }]));

  return [field, watcher, dismissKeymap];
};

export const intelligence = ({ fileName, completions, completionDetail, hover, signatures, resolveLink }) => {
  const extensions = [];
  if (completions) {
    extensions.push(autocompletion({
      override: [completionSource({ provider: completions, detail: completionDetail, fileName, resolveLink })],
      defaultKeymap: true,
    }));
  }
  if (signatures) {
    extensions.push(signatureHelp({ provider: signatures, fileName, resolveLink }));
  }
  if (hover) {
    extensions.push(hoverTooltip(async (view, pos) => {
      const info = await hover(fileName, pos);
      if (!info?.text) {
        return null;
      }
      return {
        pos: info.start ?? pos,
        end: info.start !== undefined ? info.start + (info.length ?? 0) : undefined,
        create: () => ({ dom: renderInfo('cm-intelligence-hover', info, resolveLink) }),
      };
    }));
  }
  return extensions;
};
