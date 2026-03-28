import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

const CDN = 'https://cdn.semantic-ui.com';
const VERSION = 'canary';

/**
 * Load components via a combo endpoint URL and wait for them to register.
 * Mirrors real user usage: a single script tag pointing at the live CDN.
 */
async function loadComponents(comboPath, tags) {
  // Add CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${CDN}/css@${VERSION}`;
  document.head.appendChild(link);

  // Add combo script — exactly what a user would do
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${CDN}/core@${VERSION}/${comboPath}`;
  document.head.appendChild(script);

  // Wait for all components to register
  await Promise.all(tags.map(tag => customElements.whenDefined(tag)));
}

describe('CDN Combo Endpoint', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('button,input — interactive components', async () => {
    document.body.innerHTML = `
      <ui-button primary>Primary</ui-button>
      <ui-button secondary>Secondary</ui-button>
      <ui-input placeholder="Type here..."></ui-input>
    `;
    await loadComponents('button,input', ['ui-button', 'ui-input']);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
    expect(button.shadowRoot).toBeTruthy();
  });

  it('icon,label,spinner — display components', async () => {
    document.body.innerHTML = `
      <ui-icon icon="star"></ui-icon>
      <ui-label>Default</ui-label>
      <ui-label primary>Primary</ui-label>
      <ui-spinner></ui-spinner>
    `;
    await loadComponents('icon,label,spinner', ['ui-icon', 'ui-label', 'ui-spinner']);

    const icon = document.querySelector('ui-icon');
    await expect.element(page.elementLocator(icon)).toBeVisible();
    expect(icon.shadowRoot).toBeTruthy();
  });

  it('container,segment,divider,card — layout components', async () => {
    document.body.innerHTML = `
      <ui-container>
        <ui-segment>Segment inside container</ui-segment>
        <ui-divider></ui-divider>
        <ui-card>
          <div slot="header">Card Title</div>
          <div slot="content">Card content</div>
        </ui-card>
      </ui-container>
    `;
    await loadComponents(
      'container,segment,divider,card',
      ['ui-container', 'ui-segment', 'ui-divider', 'ui-card'],
    );

    const segment = document.querySelector('ui-segment');
    await expect.element(page.elementLocator(segment)).toBeVisible();
    expect(segment.shadowRoot).toBeTruthy();
  });

  it('table,menu — data and navigation components', async () => {
    document.body.innerHTML = `
      <ui-table>
        <table>
          <thead><tr><th>Name</th><th>Status</th></tr></thead>
          <tbody><tr><td>Test</td><td>Pass</td></tr></tbody>
        </table>
      </ui-table>
      <ui-menu>
        <a>Item 1</a>
        <a>Item 2</a>
      </ui-menu>
    `;
    await loadComponents('table,menu', ['ui-table', 'ui-menu']);

    const table = document.querySelector('ui-table');
    await expect.element(page.elementLocator(table)).toBeVisible();
  });

  it('modal,image — overlay and media components', async () => {
    document.body.innerHTML = `
      <ui-image src="https://placehold.co/150x100"></ui-image>
      <ui-modal>
        <div slot="header">Test Modal</div>
        <div slot="content">Modal content</div>
      </ui-modal>
    `;
    await loadComponents('modal,image', ['ui-modal', 'ui-image']);

    const image = document.querySelector('ui-image');
    await expect.element(page.elementLocator(image)).toBeVisible();

    const modal = document.querySelector('ui-modal');
    expect(modal.shadowRoot).toBeTruthy();
  });
});

describe('CDN Cross-Category Combo', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('primitive + component in one combo', async () => {
    document.body.innerHTML = `
      <ui-button primary>Click</ui-button>
      <ui-panels><div>A</div><div>B</div></ui-panels>
    `;
    await loadComponents('button,panels', ['ui-button', 'ui-panels']);

    const button = document.querySelector('ui-button');
    expect(button.shadowRoot).toBeTruthy();

    const panels = document.querySelector('ui-panels');
    expect(panels.shadowRoot).toBeTruthy();
  });
});

describe('CDN Presets', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('standard preset loads all standard components', async () => {
    document.body.innerHTML = `
      <ui-button>Button</ui-button>
      <ui-input placeholder="Input"></ui-input>
      <ui-icon icon="star"></ui-icon>
    `;
    await loadComponents('standard', [
      'ui-button',
      'ui-input',
      'ui-icon',
      'ui-label',
      'ui-image',
      'ui-spinner',
      'ui-container',
      'ui-segment',
      'ui-divider',
      'ui-card',
      'ui-table',
      'ui-menu',
      'ui-modal',
    ]);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
    expect(button.shadowRoot).toBeTruthy();
  });

  it('extended preset loads all extended components', async () => {
    document.body.innerHTML = '<ui-button>Button</ui-button>';
    await loadComponents('extended', ['ui-button']);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
  });

  it('full preset loads all components', async () => {
    document.body.innerHTML = '<ui-button>Button</ui-button>';
    await loadComponents('full', ['ui-button']);

    const button = document.querySelector('ui-button');
    await expect.element(page.elementLocator(button)).toBeVisible();
  });
});

describe('CDN Endpoints (non-combo)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('individual component file still works', async () => {
    document.body.innerHTML = '<ui-button>Button</ui-button>';

    const script = document.createElement('script');
    script.type = 'module';
    script.src = `${CDN}/core@${VERSION}/button.min.js`;
    document.head.appendChild(script);

    await customElements.whenDefined('ui-button');

    const button = document.querySelector('ui-button');
    expect(button.shadowRoot).toBeTruthy();
  });

  it('bare package URL serves entry point', async () => {
    const res = await fetch(`${CDN}/core@${VERSION}`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');

    const body = await res.text();
    expect(body).toContain('@semantic-ui/core');
  });

  it('CSS endpoint returns stylesheet', async () => {
    const res = await fetch(`${CDN}/css@${VERSION}`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('text/css');
  });

  it('import map endpoint returns JS', async () => {
    const res = await fetch(`${CDN}/importmap@${VERSION}.js`);
    expect(res.ok).toBe(true);
    expect(res.headers.get('content-type')).toContain('javascript');
  });
});
