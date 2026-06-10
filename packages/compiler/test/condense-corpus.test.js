import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { TemplateCompiler } from '@semantic-ui/compiler';

/*
  Differential sweep over every template in the repo: compiling with and
  without whitespace condensing must agree on everything except whitespace.
  This is the regression net for the condense pass — rule changes that
  corrupt expressions, attributes, or structure on any real template fail
  here before they ship.
*/

const ROOT = join(import.meta.dirname, '../../..');
const TEMPLATE_DIRS = ['src', 'examples', 'docs/src/examples'];

function collectTemplates(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTemplates(path, found);
    }
    else if (entry.name.endsWith('.html')) {
      found.push(path);
    }
  }
  return found;
}

// canonical serialization with whitespace erased — two compiles of the same
// template must agree on every node type, expression, and non-space character
function fingerprint(nodes) {
  let out = '';
  for (const node of nodes ?? []) {
    if (node.type === 'html') {
      out += node.html.replace(/\s+/g, '');
      continue;
    }
    out += `(${node.type}|${node.value ?? ''}|${node.name ?? ''}|${node.condition ?? ''}|${node.over ?? ''}|${
      node.expression ?? ''
    })`;
    for (const prop of ['content', 'elseContent', 'loadingContent', 'errorContent']) {
      if (Array.isArray(node[prop])) {
        out += `[${prop} ${fingerprint(node[prop])}]`;
      }
    }
    if (Array.isArray(node.branches)) {
      for (const branch of node.branches) {
        out += `[branch ${fingerprint(branch.content)}]`;
      }
    }
  }
  return out;
}

describe('condense corpus sweep', () => {
  const files = TEMPLATE_DIRS.flatMap(dir => collectTemplates(join(ROOT, dir)));

  it('finds the template corpus', () => {
    expect(files.length).toBeGreaterThan(300);
  });

  it('condensing changes nothing but whitespace across every repo template', () => {
    const failures = [];
    let compared = 0;
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      let preserved;
      try {
        preserved = new TemplateCompiler().compile(source, { preserveWhitespace: true });
      }
      catch {
        // not a compilable template (page wrappers with reserved words in prose)
        continue;
      }
      let condensed;
      try {
        condensed = new TemplateCompiler(source).compile();
      }
      catch (error) {
        failures.push(
          `${file.slice(ROOT.length + 1)} — compiles preserved, throws condensed: ${error.message.split('\n')[0]}`,
        );
        continue;
      }
      compared++;
      if (fingerprint(condensed) !== fingerprint(preserved)) {
        failures.push(file.slice(ROOT.length + 1));
      }
    }
    expect(failures).toEqual([]);
    expect(compared).toBeGreaterThan(300);
  });
});
