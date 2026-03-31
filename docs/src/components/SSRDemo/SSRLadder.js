import { defineComponent } from '@semantic-ui/component';

// Step 1: Static HTML only
export const Step1 = defineComponent({
  tagName: 'ssr-step-1',
  renderingEngine: 'native',
  template: '<div class="box">Hello World</div>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; }',
});

// Step 2: Text expressions + settings override
export const Step2 = defineComponent({
  tagName: 'ssr-step-2',
  renderingEngine: 'native',
  template: '<div class="box">{greeting}, {name}!</div>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; }',
  defaultSettings: { greeting: 'Hello', name: 'World' },
});

// Step 3: Attribute expressions
export const Step3 = defineComponent({
  tagName: 'ssr-step-3',
  renderingEngine: 'native',
  template: '<div class="box {theme}" data-count="{count}">{count} items</div>',
  css:
    '.box { padding: 8px; border: 1px solid #555; color: white; } .dark { background: #333; } .light { background: #999; }',
  defaultState: { theme: 'dark', count: 3 },
});

// Step 4: Single conditional
export const Step4 = defineComponent({
  tagName: 'ssr-step-4',
  renderingEngine: 'native',
  template:
    '<div class="box">{#if show}<span class="on">Visible</span>{else}<span class="off">Hidden</span>{/if}</div>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; } .on { color: #2ecc71; } .off { color: #e74c3c; }',
  defaultState: { show: true },
});

// Step 5: Each loop
export const Step5 = defineComponent({
  tagName: 'ssr-step-5',
  renderingEngine: 'native',
  template: '<ul class="box">{#each item in items}<li>{item}</li>{/each}</ul>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; list-style: none; }',
  defaultState: { items: ['Alpha', 'Beta', 'Gamma'] },
});

// Step 6: Snippet
export const Step6 = defineComponent({
  tagName: 'ssr-step-6',
  renderingEngine: 'native',
  template:
    '{#snippet tag}<span class="tag">[{label}]</span>{/snippet}<div class="box">{>tag label="One"} {>tag label="Two"}</div>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; } .tag { color: #f39c12; }',
});

// Step 7: Subtemplate
const childTpl = defineComponent({
  renderingEngine: 'native',
  template: '<em class="child">{msg}</em>',
});
export const Step7 = defineComponent({
  tagName: 'ssr-step-7',
  renderingEngine: 'native',
  template: '<div class="box">{>child msg="From subtemplate"}</div>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; } .child { color: #3498db; }',
  subTemplates: { child: childTpl },
});

// Step 8: Nested blocks
export const Step8 = defineComponent({
  tagName: 'ssr-step-8',
  renderingEngine: 'native',
  template:
    '<div class="box">{#if show}<ul>{#each item in items}<li>{item}</li>{/each}</ul>{else}<p>Nothing</p>{/if}</div>',
  css: '.box { padding: 8px; border: 1px solid #555; color: white; list-style: none; }',
  defaultState: { show: true, items: ['X', 'Y', 'Z'] },
});
