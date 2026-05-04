import { TemplateCompiler } from '@semantic-ui/compiler';
import { describe, expect, it } from 'vitest';
import { isEachContentSelfContained } from '../../src/engines/native/blocks/each-content-classifier.js';

// Compile a template fragment and return the first each-block AST node.
// All cases under test are wrapped in a single each so the AST shape
// matches what the renderer hands to each.hydrate.
function getEachNode(template) {
  const compiler = new TemplateCompiler(template);
  const ast = compiler.compile();
  return ast.find(n => n.type === 'each');
}

describe('isEachContentSelfContained', () => {
  /*******************************
        Self-contained shapes
  *******************************/

  it('item-local property access stays lazy', () => {
    const node = getEachNode('{#each item in items}<span>{item.name}</span>{/each}');
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('multiple item-local bindings stay lazy', () => {
    const node = getEachNode(
      '{#each item in items}<a data-id="{item.id}">{item.title}</a>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('iteration index reference stays lazy', () => {
    const node = getEachNode('{#each item, i in items}<span>{i}:{item.name}</span>{/each}');
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('default index name (no explicit indexAs) stays lazy', () => {
    const node = getEachNode('{#each item in items}<span>{index}</span>{/each}');
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('`this` inside an `as`-each forces eager (resolves to parent context)', () => {
    // In `{#each item in items}`, `this` is NOT the item — the item is
    // bound only to `item`. `this` reads parent data context, which is
    // external state from the each's perspective.
    const node = getEachNode('{#each item in items}<span>{this.x}</span>{/each}');
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('pure helper with item-local arg stays lazy', () => {
    const node = getEachNode(
      '{#each item in items}<span>{formatDate item.created "h:mm a"}</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('classMap with item-local object literal stays lazy', () => {
    const node = getEachNode(
      '{#each item in items}<span class="{classMap {active: item.active}}">x</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('nested each iterating an item-local array stays lazy', () => {
    const node = getEachNode(
      '{#each section in sections}{#each tag in section.tags}<span>{tag.label}</span>{/each}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('if/else inside each with item-local condition stays lazy', () => {
    const node = getEachNode(
      '{#each item in items}{#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  /*******************************
        External-state shapes
  *******************************/

  it('helper closing over component method must wire eagerly', () => {
    const node = getEachNode(
      '{#each item in items}<a class="{classMap getItemClasses item}">x</a>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('expression reading non-iteration identifier must wire eagerly', () => {
    const node = getEachNode(
      '{#each item in items}<a class="{activeIf is item.id activeID}">x</a>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('zero-arg auto-invoked component method must wire eagerly', () => {
    const node = getEachNode('{#each item in items}<span>{getStatus}</span>{/each}');
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('JS expression with external identifier must wire eagerly', () => {
    const node = getEachNode(
      '{#each item in items}<span>{item.size > maxSize ? "big" : "small"}</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('if condition reading external state forces eager wire', () => {
    const node = getEachNode(
      '{#each item in items}{#if isHighlighted item.id}<b>{item.name}</b>{/if}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('nested each with inner binding reading external state forces outer eager', () => {
    const node = getEachNode(
      '{#each section in sections}{#each item in section.items}<span>{getCls item}</span>{/each}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('snippet/template invocation inside each forces eager wire', () => {
    const node = getEachNode(
      '{#each item in items}{>card title=item.title}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  /*******************************
        Conservative bails
  *******************************/

  it('no-`as` each bails to eager (item keys spread, indistinguishable)', () => {
    const node = getEachNode('{#each items}<span>{name}</span>{/each}');
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('inner no-`as` each bails outer to eager', () => {
    const node = getEachNode(
      '{#each section in sections}{#each section.tags}<span>{label}</span>{/each}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('nested each with inner over-expression reading external forces outer eager', () => {
    const node = getEachNode(
      '{#each item in items}{#each tag in globalTags}<span>{tag}</span>{/each}{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  /*******************************
        elseContent shapes
  *******************************/

  it('self-contained elseContent stays lazy', () => {
    const node = getEachNode(
      '{#each item in items}<span>{item.name}</span>{else}<p>none</p>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('elseContent reading external state forces eager wire', () => {
    const node = getEachNode(
      '{#each item in items}<span>{item.name}</span>{else}<p>{emptyMessage}</p>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('elseContent calling helper that reads external state forces eager wire', () => {
    const node = getEachNode(
      '{#each item in items}<span>{item.name}</span>{else}<p>{getEmptyText}</p>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('elseContent referencing iteration var forces eager (var not in :else scope)', () => {
    // `foo` is the iteration var; inside :else it's NOT in scope, so a
    // bare `{foo}` there reads the parent — the classifier must not
    // treat it as iteration-local.
    const node = getEachNode(
      '{#each foo in items}<span>{foo.x}</span>{else}<p>{foo}</p>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  /*******************************
        Ternary disambiguation
  *******************************/

  it('ternary then-value reading external state forces eager wire', () => {
    const node = getEachNode(
      '{#each item in items}<span class="{classMap {active: item.size ? externalThen : item.bar}}">x</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('ternary else-value reading external state forces eager wire', () => {
    const node = getEachNode(
      '{#each item in items}<span>{item.size > 0 ? item.size : externalDefault}</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  it('object key followed by item-local ternary stays lazy', () => {
    const node = getEachNode(
      '{#each item in items}<span class="{classMap {active: item.flag ? item.a : item.b}}">x</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  it('optional chaining is not a ternary', () => {
    const node = getEachNode(
      '{#each item in items}<span>{item.nested?.value}</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(true);
  });

  /*******************************
        Template literal bail
  *******************************/

  it('template literal in expression bails to eager (interpolation may read external)', () => {
    const node = getEachNode(
      '{#each item in items}<span>{`prefix-${externalState}-suffix`}</span>{/each}',
    );
    expect(isEachContentSelfContained(node)).toBe(false);
  });

  /*******************************
        Caching
  *******************************/

  it('returns the same verdict on repeated calls (cached on AST identity)', () => {
    const node = getEachNode('{#each item in items}<span>{item.name}</span>{/each}');
    const first = isEachContentSelfContained(node);
    const second = isEachContentSelfContained(node);
    expect(first).toBe(second);
    expect(first).toBe(true);
  });
});
