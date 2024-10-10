import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({self, reactiveVar}) => ({
  sections: [
    { title: 'Section 1', content: 'Content for section 1', expanded: reactiveVar(false) },
    { title: 'Section 2', content: 'Content for section 2', expanded: reactiveVar(false) },
    { title: 'Section 3', content: 'Content for section 3', expanded: reactiveVar(false) }
  ],

  toggleSection(index) {
    const section = self.sections[index];
    section.expanded.toggle();
  }
});

const events = {
  'click .header'({self, data}) {
    self.toggleSection(data.index);
  }
};

defineComponent({
  tagName: 'ui-accordion',
  events,
  template,
  css,
  createInstance
});
