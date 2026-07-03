import { autocompletion } from '@codemirror/autocomplete';
import { hoverTooltip } from '@codemirror/view';

/*
  Editor-side bindings for language intelligence. Providers speak plain data
  ({ name, kind } entries, { text, start, length } hovers) so the adapter
  surface stays engine-neutral — a Monaco binding would consume the same
  providers.
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

export const completionSource = ({ provider, fileName }) => {
  return async (context) => {
    const word = context.matchBefore(/[\w$]*/);
    if ((!word || word.from === word.to) && !context.explicit && context.matchBefore(/\./) === null) {
      return null;
    }
    const result = await provider(fileName, context.pos);
    if (!result?.entries?.length || context.aborted) {
      return null;
    }
    return {
      from: word && word.from !== word.to ? word.from : context.pos,
      options: result.entries.map(entry => ({
        label: entry.name,
        type: completionTypes[entry.kind] ?? entry.kind,
        boost: entry.sortText ? -Number.parseInt(entry.sortText, 10) || 0 : 0,
      })),
      validFor: /^[\w$]*$/,
    };
  };
};

export const intelligence = ({ fileName, completions, hover }) => {
  const extensions = [];
  if (completions) {
    extensions.push(autocompletion({
      override: [completionSource({ provider: completions, fileName })],
      defaultKeymap: true,
    }));
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
        create: () => {
          const dom = document.createElement('div');
          dom.className = 'cm-intelligence-hover';
          const signature = document.createElement('code');
          signature.textContent = info.text;
          dom.appendChild(signature);
          if (info.documentation) {
            const docs = document.createElement('div');
            docs.textContent = info.documentation;
            dom.appendChild(docs);
          }
          return { dom };
        },
      };
    }));
  }
  return extensions;
};
