/*
  Track A — fine-grained reactivity workloads. Pure client-mount, no
  SSR. Each metric drives a real mutation cycle that fires real
  Reactions doing real (small) work. Wall-clock is the only committed
  measurement. Some metrics measure a win available when an FGR fix
  closes a coarseness gap; others lock in current correct behavior so a
  future regression on per-expression isolation surfaces as a slower
  verdict. Calibration log at
  ai/workspace/artifacts/bench-reactivity-calibration.md captures
  per-metric eval counts as a debugging artifact.
*/

import { defineComponent } from '@semantic-ui/component';

const startMark = (name) => `${name}-start`;
const flush = () => new Promise((r) => requestAnimationFrame(r));

const container = document.createElement('div');
document.body.appendChild(container);

function destroy() {
  container.innerHTML = '';
}

/*******************************
      Component Definitions
*******************************/

const reactiveDataChild = defineComponent({
  renderingEngine: 'native',
  template: '<span>{label}</span><span>{status}</span>',
});

defineComponent({
  tagName: 'bench-reactivedata',
  renderingEngine: 'native',
  template: `{#each i in idxs}{> template name='child' reactiveData={label: getLabel, status: getStatus}}{/each}`,
  subTemplates: { child: reactiveDataChild },
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getLabel: () => state.labelVal.get(),
    getStatus: () => 'static',
  }),
});

const shorthandChild = defineComponent({
  renderingEngine: 'native',
  template: '<span>{label}</span><span>{status}</span>',
});

defineComponent({
  tagName: 'bench-shorthand',
  renderingEngine: 'native',
  template: `{#each i in idxs}{>child label=getLabel status=getStatus}{/each}`,
  subTemplates: { child: shorthandChild },
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getLabel: () => state.labelVal.get(),
    getStatus: () => 'static',
  }),
});

defineComponent({
  tagName: 'bench-snippet',
  renderingEngine: 'native',
  template: [
    '{#snippet card}',
    '<span>{label}</span>',
    '<span>{status}</span>',
    '{/snippet}',
    '{#each i in idxs}',
    '{>card label=getLabel status=getStatus}',
    '{/each}',
  ].join(''),
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getLabel: () => state.labelVal.get(),
    getStatus: () => 'static',
  }),
});

defineComponent({
  tagName: 'bench-active-indicator',
  renderingEngine: 'native',
  template: `{#each item in items}<span class="{maybeActive item.id}">{item.id}</span>{/each}`,
  defaultState: { selectedId: 0 },
  createComponent: ({ state }) => ({
    items: Array.from({ length: 200 }, (_, i) => ({ id: i })),
    maybeActive: (id) => state.selectedId.get() === id ? 'active' : '',
  }),
});

defineComponent({
  tagName: 'bench-stable-ref',
  renderingEngine: 'native',
  template: `{#each item in items}<span>{item.label}</span>{/each}`,
  defaultState: {
    items: {
      value: Array.from({ length: 500 }, (_, i) => ({ id: i, label: `item-${i}` })),
      options: { allowClone: false, safety: 'reference' },
    },
  },
});

defineComponent({
  tagName: 'bench-derived-cascade',
  renderingEngine: 'native',
  template:
    `{#if hasLength}LEN {/if}{#if hasUpper}UP {/if}{#if hasNumber}NUM {/if}{#if hasSpecial}SPEC {/if}<span>{getStrengthLabel}</span><span class="{classMap getStrengthClasses}"></span><span>{getDisplayPercent}</span>`,
  defaultState: { password: '' },
  createComponent: ({ self, state }) => ({
    hasLength: () => state.password.get().length >= 8,
    hasUpper: () => /[A-Z]/.test(state.password.get()),
    hasNumber: () => /[0-9]/.test(state.password.get()),
    hasSpecial: () => /[^A-Za-z0-9]/.test(state.password.get()),
    getStrength: () => {
      const p = state.password.get();
      let s = 0;
      if (p.length >= 8) { s++; }
      if (/[A-Z]/.test(p)) { s++; }
      if (/[0-9]/.test(p)) { s++; }
      if (/[^A-Za-z0-9]/.test(p)) { s++; }
      return s;
    },
    getStrengthLabel: () => ['', 'Weak', 'Fair', 'Good', 'Strong'][self.getStrength()],
    getStrengthClasses: () => {
      const s = self.getStrength();
      return { weak: s === 1, fair: s === 2, good: s === 3, strong: s === 4 };
    },
    getDisplayPercent: () => `${self.getStrength() * 25}%`,
  }),
});

const dataBlobChild = defineComponent({
  renderingEngine: 'native',
  template: '<span>{label}</span><span>{status}</span>',
});

defineComponent({
  tagName: 'bench-data-blob',
  renderingEngine: 'native',
  template: `{#each i in idxs}{>child data=getCardData}{/each}`,
  subTemplates: { child: dataBlobChild },
  defaultState: { labelVal: 'init' },
  createComponent: ({ state }) => ({
    idxs: Array.from({ length: 100 }, (_, i) => i),
    getCardData: () => ({ label: state.labelVal.get(), status: 'static' }),
  }),
});

/*******************************
      Bench Runner
*******************************/

async function mount(tagName) {
  const el = document.createElement(tagName);
  container.appendChild(el);
  await flush();
  return el;
}

/*******************************
      Subtemplate reactiveData
      Per-key isolation gap on
      verbose-form reactive data.
*******************************/

// purpose: Mutates a single field on a verbose `reactiveData` object passed to 100 child subtemplates so only the changed field's expression should re-evaluate.
const el1 = await mount('bench-reactivedata');
performance.mark(startMark('subtemplate-reactiveData-100'));
for (let i = 0; i < 50; i++) {
  el1.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('subtemplate-reactiveData-100', startMark('subtemplate-reactiveData-100'));
destroy();

/*******************************
      Subtemplate shorthand props
      Per-key isolation gap on
      shorthand individual props.
*******************************/

// purpose: Mutates one source signal driving one shorthand prop on 100 child subtemplates so only that prop's expression should re-evaluate.
const el2 = await mount('bench-shorthand');
performance.mark(startMark('subtemplate-shorthand-props-100'));
for (let i = 0; i < 50; i++) {
  el2.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('subtemplate-shorthand-props-100', startMark('subtemplate-shorthand-props-100'));
destroy();

/*******************************
      Snippet args
      Locks in current correct
      per-expression isolation in
      snippet bodies.
*******************************/

// purpose: Mutates one source signal driving one snippet arg across 100 invocations so adjacent expressions in the snippet body that read no signals stay quiet.
const el3 = await mount('bench-snippet');
performance.mark(startMark('snippet-args-per-key-100'));
for (let i = 0; i < 50; i++) {
  el3.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('snippet-args-per-key-100', startMark('snippet-args-per-key-100'));
destroy();

/*******************************
      Active indicator
      External-signal-into-each
      fan-out.
*******************************/

// purpose: Cycles a selection signal across 200 list items so only the previously highlighted and newly highlighted items update their class.
const el4 = await mount('bench-active-indicator');
performance.mark(startMark('active-indicator-200'));
for (let i = 0; i < 100; i++) {
  el4.template.state.selectedId.set(i);
  await flush();
}
performance.measure('active-indicator-200', startMark('active-indicator-200'));
destroy();

/*******************************
      Stable-ref item mutate
      Locks in current per-key
      isolation in `#each`.
*******************************/

// purpose: Replaces one item by index in a 500-item list across 100 cycles so only the changed item's expressions re-render.
const el5 = await mount('bench-stable-ref');
performance.mark(startMark('stable-ref-mutate-500'));
for (let i = 0; i < 100; i++) {
  const idx = i % 500;
  el5.template.state.items.setIndex(idx, { id: idx, label: `updated-${i}` });
  await flush();
}
performance.measure('stable-ref-mutate-500', startMark('stable-ref-mutate-500'));
destroy();

/*******************************
      Derived cascade
      Throughput of 7 derived
      expressions reading one
      root signal.
*******************************/

// purpose: Types 100 characters into a single password signal that drives 7 derived expressions matching the password-strength component pattern.
const el6 = await mount('bench-derived-cascade');
performance.mark(startMark('derived-cascade-100'));
for (let i = 0; i < 100; i++) {
  el6.template.state.password.set('a'.repeat(i + 1));
  await flush();
}
performance.measure('derived-cascade-100', startMark('derived-cascade-100'));
destroy();

/*******************************
      Subtemplate data blob
      Negative control on the
      documented coarse-blob
      semantic.
*******************************/

// purpose: Mutates one field inside a `data=expression` blob passed to 100 child subtemplates so every expression in every child re-renders by design.
const el7 = await mount('bench-data-blob');
performance.mark(startMark('subtemplate-data-blob-100'));
for (let i = 0; i < 50; i++) {
  el7.template.state.labelVal.set(`v${i}`);
  await flush();
}
performance.measure('subtemplate-data-blob-100', startMark('subtemplate-data-blob-100'));
destroy();

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
