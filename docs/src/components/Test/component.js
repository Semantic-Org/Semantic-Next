import { defineComponent } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';


const settings = {
  firstSetting: true,
  secondSetting: false,
};

const createComponent = ({self, data, settings}) => ({
  initialize() {
    console.log('data is', data);
    console.log('first', settings.firstSetting);
    console.log('second', settings.secondSetting);
  }
});

export const SettingTest = defineComponent({
  tagName: 'setting-test',
  template,
  css,
  settings,
  createComponent
});
