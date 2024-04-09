import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './data-test.html?raw';
import css from './data-test.css?raw';

const createInstance = ({ tpl, $ }) => ({
});

const onRendered = ({ tpl }) => {
};

const onDestroyed = ({ tpl }) => {
};

const events = {
};

const dataTestTab = createComponent({
  templateName: 'data-test',
  createInstance,
  template,
  css,
  onCreated: () => console.log('on created data'),
  onRendered,
  onDestroyed,
  events,
});
export { dataTestTab };
