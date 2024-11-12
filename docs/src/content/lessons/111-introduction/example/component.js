import { defineComponent, getText } from '@semantic-ui/component';
import SubTemplates from './subtemplates.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

console.log(SubTemplates);
const Topbar = defineComponent({
  template: `<div class="topbar">{>template name=topbarTemplate }</div>`,
  css: '.topbar { height: 50px; border: 1px solid var(--blue); }',
});
const Sidebar = defineComponent({
  template: `<div class="sidebar">2</div>`,
  css: '.sidebar { width: 150px; border: 1px solid var(--red); flex-grow: 0; }',
});
const PageContent = defineComponent({
  template: `<div class="page">3</div>`,
  css: '.page { flex-grow: 1; border: 1px solid var(--blue); }',
});

const App = defineComponent({
  tagName: 'main-app',
  template: template,
  css: css,
  pageCSS: 'body { padding: 0; }',
  settings: { topbarTemplate: '', sidebarTemplate: '', pageTemplate: '' },
  subTemplates: { Topbar, Sidebar, PageContent, ...SubTemplates }
});
