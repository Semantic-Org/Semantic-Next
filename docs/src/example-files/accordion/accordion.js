import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({tpl}) => ({
  sections: [
    { title: 'Section 1', content: 'Content for section 1', expanded: new ReactiveVar(false) },
    { title: 'Section 2', content: 'Content for section 2', expanded: new ReactiveVar(false) },
    { title: 'Section 3', content: 'Content for section 3', expanded: new ReactiveVar(false) }
  ],

  toggleSection(index) {
    const section = tpl.sections[index];
    section.expanded.toggle();
  }
});

const events = {
  'click .header'({tpl, data}) {
    tpl.toggleSection(data.index);
  }
};

createComponent({
  tagName: 'ui-accordion',
  events,
  template,
  css,
  createInstance
});
