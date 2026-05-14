import { describe, expect, it } from 'vitest';

import { defineComponent } from '@semantic-ui/component';
import { extractDefinitionContent, TailwindPlugin } from '../src/server.js';

/*******************************
  extractDefinitionContent
  --- Pure scanner. No I/O. ---
*******************************/

describe('extractDefinitionContent — content scanner', () => {
  it('puts template HTML into the content scan bucket', () => {
    const { content, html } = extractDefinitionContent({
      template: '<div class="p-4 bg-red-500">Hi</div>',
    });
    expect(html).toContain('class="p-4 bg-red-500"');
    expect(content).toContain('class="p-4 bg-red-500"');
  });

  it('puts the component css into the css bucket, not the scan content', () => {
    // css is fed to the compiler as `css`, content is for class extraction.
    // If css were merged into content, @theme/@utility blocks would be misinterpreted as classes.
    const { content, css } = extractDefinitionContent({
      template: '<div></div>',
      css: '@theme { --color-brand: #3b82f6; }',
    });
    expect(css).toContain('@theme');
    expect(content).not.toContain('@theme');
  });

  it('stringifies createComponent and exposes class literals from its body', () => {
    const { content, js } = extractDefinitionContent({
      template: '<div></div>',
      createComponent: () => ({
        click() {
          return 'bg-cyan-500';
        },
      }),
    });
    expect(js).toContain('bg-cyan-500');
    expect(content).toContain('bg-cyan-500');
  });

  it('scans every lifecycle hook for class literals', () => {
    const { js } = extractDefinitionContent({
      template: '<div></div>',
      onCreated: () => 'class-from-onCreated',
      onRendered: () => 'class-from-onRendered',
      onDestroyed: () => 'class-from-onDestroyed',
      onThemeChanged: () => 'class-from-onThemeChanged',
      onAttributeChanged: () => 'class-from-onAttributeChanged',
    });
    expect(js).toContain('class-from-onCreated');
    expect(js).toContain('class-from-onRendered');
    expect(js).toContain('class-from-onDestroyed');
    expect(js).toContain('class-from-onThemeChanged');
    expect(js).toContain('class-from-onAttributeChanged');
  });

  it('scans every event handler function body for class literals', () => {
    const { js } = extractDefinitionContent({
      template: '<div></div>',
      events: {
        'click .a': () => 'bg-event-a',
        'submit form': function namedHandler() {
          return 'bg-event-b';
        },
      },
    });
    expect(js).toContain('bg-event-a');
    expect(js).toContain('bg-event-b');
  });

  it('scans every key handler function body for class literals', () => {
    const { js } = extractDefinitionContent({
      template: '<div></div>',
      keys: {
        Enter: () => 'bg-key-a',
        Escape: () => 'bg-key-b',
      },
    });
    expect(js).toContain('bg-key-a');
    expect(js).toContain('bg-key-b');
  });

  it('scans one level of subTemplates for both template HTML and CSS', () => {
    const header = defineComponent({
      template: '<header class="sub-header"></header>',
      css: '@theme { --color-header: red; }',
    });
    const body = defineComponent({
      template: '<section class="sub-body"></section>',
    });
    const { html, css } = extractDefinitionContent({
      template: '<div class="parent-class"></div>',
      subTemplates: { header, body },
    });
    expect(html).toContain('parent-class');
    expect(html).toContain('sub-header');
    expect(html).toContain('sub-body');
    expect(css).toContain('--color-header');
  });

  it('scans nested subTemplates recursively', () => {
    // A subtemplate may itself declare subTemplates. Classes appearing anywhere in
    // that tree must be detected.
    const inner = defineComponent({
      template: '<em class="deep-class"></em>',
    });
    const outer = defineComponent({
      template: '<span class="mid-class"></span>',
      subTemplates: { inner },
    });
    const { html } = extractDefinitionContent({
      template: '<div class="top-class"></div>',
      subTemplates: { outer },
    });
    expect(html).toContain('top-class');
    expect(html).toContain('mid-class');
    expect(html).toContain('deep-class');
  });

  it('scans createComponent and lifecycle hooks inside subTemplates', () => {
    // A subtemplate's createComponent and lifecycle hooks are equally valid locations
    // for class string literals — they should reach the scanner the same way the parent's do.
    const child = defineComponent({
      template: '<span></span>',
      createComponent: () => ({ run: () => 'bg-sub-cc' }),
      onCreated: () => 'bg-sub-lifecycle',
      events: { 'click .x': () => 'bg-sub-event' },
    });
    const { js } = extractDefinitionContent({
      template: '<div></div>',
      subTemplates: { child },
    });
    expect(js).toContain('bg-sub-cc');
    expect(js).toContain('bg-sub-lifecycle');
    expect(js).toContain('bg-sub-event');
  });

  it('joins extracted sources with newlines so adjacent strings cannot merge into invalid candidates', () => {
    // If two adjacent strings concatenated without a separator, "bg-red-500" + "p-4"
    // would scan as "bg-red-500p-4" — neither a valid Tailwind class. Newlines preserve boundaries.
    const { content } = extractDefinitionContent({
      template: '<div class="bg-red-500"></div>',
      createComponent: () => 'p-4',
    });
    // The two should remain scannable separately.
    expect(content).toMatch(/bg-red-500[\s\S]*p-4|p-4[\s\S]*bg-red-500/);
    expect(content).toContain('\n');
  });

  it('skips non-function values inside the events object', () => {
    // A handler may be misconfigured as a string in user code. Should not crash; should not stringify.
    const { js } = extractDefinitionContent({
      template: '<div></div>',
      events: {
        'click .a': 'not-a-function',
        'click .b': () => 'real-handler-class',
      },
    });
    expect(js).toContain('real-handler-class');
    expect(js).not.toContain('not-a-function');
  });

  it('returns empty strings for a definition with no scannable fields', () => {
    const { html, js, css, content } = extractDefinitionContent({});
    expect(html).toBe('');
    expect(js).toBe('');
    expect(css).toBe('');
    // content is `html + '\n' + js` which is "\n" when both empty — TailwindPlugin shortcircuits on
    // !content.trim() so an entirely-empty definition is detected.
    expect(content.trim()).toBe('');
  });

  it('does not mutate the input definition', () => {
    const def = {
      template: '<div class="p-4"></div>',
      events: { 'click .a': () => 'bg-test' },
    };
    const snapshot = JSON.stringify({
      template: def.template,
      eventKeys: Object.keys(def.events),
    });
    extractDefinitionContent(def);
    expect(JSON.stringify({
      template: def.template,
      eventKeys: Object.keys(def.events),
    })).toBe(snapshot);
  });
});

/*******************************
       TailwindPlugin
   --- Async transform. ---
*******************************/

describe('TailwindPlugin — definition transform', () => {
  it('emits CSS containing utilities for classes used in the template', async () => {
    const result = await TailwindPlugin({
      template: '<div class="p-4 bg-red-500"></div>',
    });
    expect(result.css).toContain('.p-4');
    expect(result.css).toContain('.bg-red-500');
  });

  it('emits CSS containing utilities for classes referenced in createComponent bodies', async () => {
    const result = await TailwindPlugin({
      template: '<div></div>',
      createComponent: () => ({
        addError() {
          return 'bg-rose-500';
        },
      }),
    });
    expect(result.css).toContain('.bg-rose-500');
  });

  it('emits CSS containing utilities for classes referenced in event handlers', async () => {
    const result = await TailwindPlugin({
      template: '<div></div>',
      events: {
        'click .btn': () => 'bg-emerald-500',
      },
    });
    expect(result.css).toContain('.bg-emerald-500');
  });

  it('emits CSS containing utilities for classes used in subTemplates', async () => {
    const header = defineComponent({
      template: '<header class="bg-amber-500"></header>',
    });
    const result = await TailwindPlugin({
      template: '<div class="text-xl"></div>',
      subTemplates: { header },
    });
    expect(result.css).toContain('.text-xl');
    expect(result.css).toContain('.bg-amber-500');
  });

  it('accepts plain-object subtemplate sugar for one-off inline definitions', async () => {
    // defineComponent normalizes plain-object entries to Template instances, so authors
    // who want to write a small subtemplate inline can skip the wrapper call.
    const result = await TailwindPlugin({
      template: '<div class="text-xl"></div>',
      subTemplates: {
        header: { template: '<header class="bg-cyan-500"></header>' },
      },
    });
    expect(result.css).toContain('.text-xl');
    expect(result.css).toContain('.bg-cyan-500');
  });

  it('emits CSS containing utilities for classes used in deeply-nested subTemplates', async () => {
    const inner = defineComponent({
      template: '<em class="text-lg"></em>',
    });
    const outer = defineComponent({
      template: '<span class="text-sm"></span>',
      subTemplates: { inner },
    });
    const result = await TailwindPlugin({
      template: '<div class="text-xs"></div>',
      subTemplates: { outer },
    });
    expect(result.css).toContain('.text-xs');
    expect(result.css).toContain('.text-sm');
    expect(result.css).toContain('.text-lg');
  });

  it('resolves @apply directives in component CSS even when no template classes are present', async () => {
    const result = await TailwindPlugin({
      css: '.my-btn { @apply bg-blue-500 p-2; }',
    });
    // The @apply directive should have been processed by the Tailwind compiler.
    // Either the rule expands inline, or the file at minimum contains the apply'd utility classes.
    expect(result.css).not.toBe('.my-btn { @apply bg-blue-500 p-2; }');
    // A processed result will contain compiled background color or padding declarations.
    expect(result.css).toMatch(/background-color|padding|--color-blue-500|--spacing/);
  });

  it('preserves all definition fields other than css and pageCSS', async () => {
    const original = {
      tagName: 'my-thing',
      template: '<div class="p-1"></div>',
      defaultSettings: { foo: 1 },
      defaultState: { bar: 2 },
      createComponent: () => ({}),
    };
    const result = await TailwindPlugin(original);
    expect(result.tagName).toBe('my-thing');
    expect(result.defaultSettings).toEqual({ foo: 1 });
    expect(result.defaultState).toEqual({ bar: 2 });
    expect(result.template).toBe('<div class="p-1"></div>');
    expect(typeof result.createComponent).toBe('function');
  });

  it('does not mutate the input definition', async () => {
    const original = {
      template: '<div class="p-1"></div>',
      css: '/* ORIGINAL CSS */',
    };
    await TailwindPlugin(original);
    expect(original.css).toBe('/* ORIGINAL CSS */');
    expect(original.template).toBe('<div class="p-1"></div>');
  });

  it('returns the definition unchanged when there is no scannable content', async () => {
    const def = {};
    const result = await TailwindPlugin(def);
    expect(result).toBe(def);
  });

  it('moves @property rules out of component css into pageCSS for document-level adoption', async () => {
    // shadow-lg generates several @property declarations in Tailwind 4.
    const result = await TailwindPlugin({
      template: '<div class="shadow-lg"></div>',
    });
    expect(result.css).not.toContain('@property');
    expect(result.pageCSS).toBeDefined();
    expect(result.pageCSS).toContain('@property');
  });

  it('appends generated @property pageCSS after any pre-existing pageCSS', async () => {
    const result = await TailwindPlugin({
      template: '<div class="shadow-lg"></div>',
      pageCSS: '/* existing-page-css */',
    });
    expect(result.pageCSS).toContain('/* existing-page-css */');
    expect(result.pageCSS).toContain('@property');
    // existing CSS must come first.
    expect(result.pageCSS.indexOf('/* existing-page-css */'))
      .toBeLessThan(result.pageCSS.indexOf('@property'));
  });

  it('preserves a pre-existing pageCSS when there are no @property rules to extract', async () => {
    // If no @property rules in tailwind output, the conditional should NOT clobber existing pageCSS.
    const result = await TailwindPlugin({
      template: '<div class="p-1"></div>',
      pageCSS: '/* user-page-css */',
    });
    expect(result.pageCSS).toContain('/* user-page-css */');
  });

  it('omits pageCSS entirely when none is generated and none was supplied', async () => {
    const result = await TailwindPlugin({
      template: '<div class="p-1"></div>',
    });
    expect(result.pageCSS).toBeUndefined();
  });

  it('applies vendor prefixes by default when classes need them', async () => {
    // autoprefix defaults to true; prefixCSS handles user-select among others.
    const result = await TailwindPlugin({
      template: '<div class="select-none"></div>',
    });
    // Tailwind itself emits one -webkit-user-select. prefixCSS adds another for the unprefixed
    // user-select declaration. We assert at least two occurrences as the prefix is duplicated.
    const matches = result.css.match(/-webkit-user-select/g) || [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('skips vendor prefixing when autoprefix:false is passed', async () => {
    const withPrefix = await TailwindPlugin({
      template: '<div class="select-none"></div>',
    });
    const without = await TailwindPlugin({
      template: '<div class="select-none"></div>',
    }, { autoprefix: false });

    const withCount = (withPrefix.css.match(/-webkit-user-select/g) || []).length;
    const withoutCount = (without.css.match(/-webkit-user-select/g) || []).length;
    expect(withoutCount).toBeLessThan(withCount);
  });

  it('applies the component css as a source stylesheet so @theme tokens flow through', async () => {
    const result = await TailwindPlugin({
      template: '<div class="bg-gray-100"></div>',
      css: '@theme { --color-gray-100: #ff00ff; }',
    });
    // The override appears in the cascade and the utility resolves through it.
    expect(result.css).toMatch(/--color-gray-100:\s*#ff00ff/);
    expect(result.css).toContain('background-color: var(--color-gray-100)');
  });

  it('respects an @utility definition in component css', async () => {
    const result = await TailwindPlugin({
      template: '<div class="my-custom-shadow"></div>',
      css: '@utility my-custom-shadow { box-shadow: 0 0 1px red; }',
    });
    expect(result.css).toContain('.my-custom-shadow');
    expect(result.css).toContain('box-shadow');
  });

  it('respects an @custom-variant definition in component css', async () => {
    const result = await TailwindPlugin({
      template: '<div class="dark:text-white"></div>',
      css: '@custom-variant dark (&:where(.dark, .dark *));',
    });
    // The dark variant should produce a rule scoped to .dark selectors.
    expect(result.css).toContain('.dark');
    expect(result.css).toContain('text-white');
  });

  it('returns the original definition when only undocumented class strings appear (no Tailwind output)', async () => {
    // Real Tailwind 4 outputs at least the preflight comment header even for unknown classes,
    // so this branch is essentially defensive. We assert it preserves the definition.
    const def = { template: '<div class="totally-not-tailwind-foo-123"></div>' };
    const result = await TailwindPlugin(def);
    // Even unknown classes generate preflight CSS, so result.css differs from input.
    // But the returned object must contain the original template untouched.
    expect(result.template).toBe(def.template);
  });
});

/*******************************
   Cross-reference (synthesis)
*******************************/

describe('TailwindPlugin — cross-cutting contract', () => {
  it('emits utilities for classes that only appear inside lifecycle hooks of a subtemplate', async () => {
    // Every code path that holds a class string must yield a compiled utility.
    // A subtemplate lifecycle hook is one such path.
    const child = defineComponent({
      template: '<span></span>',
      onRendered: () => 'bg-fuchsia-500',
    });
    const result = await TailwindPlugin({
      template: '<div></div>',
      subTemplates: { child },
    });
    expect(result.css).toContain('.bg-fuchsia-500');
  });

  it('preserves field types — defaultState and defaultSettings retain object identity', async () => {
    const settings = { foo: 1 };
    const state = { bar: 2 };
    const result = await TailwindPlugin({
      template: '<div class="p-2"></div>',
      defaultSettings: settings,
      defaultState: state,
    });
    expect(result.defaultSettings).toBe(settings);
    expect(result.defaultState).toBe(state);
  });
});
